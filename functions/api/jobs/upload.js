export const onRequestPost = async ({ request, env }) => {
  try {
    const ALLOWED = ['Handyman','Powerwashing','Mowing','Landscaping'];

    const ct = request.headers.get('content-type') || '';
    if (!ct.includes('multipart/form-data')) return j({ error: 'bad_request' }, 400);

    const form = await request.formData();
    const file = form.get('media');
    const label = String(form.get('label') || 'Handyman').trim();
    if (!file || !file.name) return j({ error: 'no_file' }, 400);
    if (!ALLOWED.includes(label)) return j({ error: 'unsupported_category' }, 400);

    const id = crypto.randomUUID();
    const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] || '').toLowerCase();
    const keyMedia = `media/${id}${ext}`;
    const keyCard  = `cards/${id}.json`;

    // 1) store media in R2 (binding is env.R2)
    await env.R2.put(keyMedia, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' }
    });

    const mediaUrl = `${https://pub-8256a83562a441a19db6ee3ab4feacf8.r2.dev}/${keyMedia}`;

    // 2) call OpenAI (guardrails + price band)
    const ai = await analyzeWithOpenAI({ imageUrl: mediaUrl, category: label, apiKey: env.OPENAI_API_KEY });
    if (ai.reject) return j({ error: 'not_supported', reason: ai.reason }, 422);

    const card = {
      id, label, notes: '',
      aiLow: ai.low, aiHigh: ai.high,
      createdAt: new Date().toISOString(),
      media: { url: mediaUrl, type: file.type || 'image/jpeg' }
    };

    // 3) save card metadata
    await env.R2.put(keyCard, JSON.stringify(card), {
      httpMetadata: { contentType: 'application/json' }
    });

    return j(card, 200);
  } catch {
    return j({ error: 'server_error' }, 500);
  }
};

async function analyzeWithOpenAI({ imageUrl, category, apiKey }) {
  if (!apiKey) return { reject: true, reason: 'OPENAI_API_KEY missing' };

  const system = [
    'You are a field-trades estimator. Return strict JSON.',
    'Allowed categories: Handyman, Powerwashing, Mowing, Landscaping.',
    'Reject if the image is not a trade job photo (hands, faces, selfies, screenshots, documents, medical).',
    'If OK, return: {"decision":"ok","low":int,"high":int,"reasons":"short"}',
    'If reject, return: {"decision":"reject","reason":"why"}'
  ].join(' ');

  const body = {
    model: 'gpt-4o-mini',
    input: [
      { role: 'system', content: [{ type: 'input_text', text: system }] },
      { role: 'user', content: [
        { type: 'input_text', text: `Category: ${category}` },
        { type: 'input_image', image_url: imageUrl }
      ] }
    ],
    temperature: 0.2,
    max_output_tokens: 200
  };

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) return { reject: true, reason: 'OpenAI error' };

  const data = await res.json();
  let text = data.output_text
    || (data.output?.[0]?.content?.[0]?.text)
    || (Array.isArray(data.choices?.[0]?.message?.content) ? data.choices[0].message.content.map(x=>x.text||'').join('\n') : data.choices?.[0]?.message?.content);

  if (!text) return { reject: true, reason: 'No AI text' };
  const m = text.match(/\{[\s\S]*\}/); if (!m) return { reject: true, reason: 'No JSON' };

  try {
    const obj = JSON.parse(m[0]);
    if (obj.decision === 'reject') return { reject: true, reason: obj.reason || 'Not supported' };
    if (obj.decision === 'ok' && Number.isFinite(obj.low) && Number.isFinite(obj.high) && obj.high >= obj.low) {
      return { low: Math.floor(obj.low), high: Math.floor(obj.high), reasons: obj.reasons || '' };
    }
    return { reject: true, reason: 'Invalid JSON fields' };
  } catch { return { reject: true, reason: 'Bad JSON' } }
}

function j(obj, status=200){ return new Response(JSON.stringify(obj), { status, headers:{'content-type':'application/json'} }) }
