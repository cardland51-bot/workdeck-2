export const onRequestGet = async ({ params, env }) => {
  const { format, cardId } = params;

  // Load the card JSON we saved during upload
  const obj = await env.R2.get(`cards/${cardid}.json`);
  if (!obj) return new Response('Not found', { status: 404 });
  const c = JSON.parse(await obj.text());

  // Build a simple export (markdown or txt)
  const md = [
    `# WorkDeck Estimate (${c.id})`,
    `Created: ${c.createdAt}`,
    `Category: ${c.label}`,
    `Price Band: $${c.aiLow} - $${c.aiHigh}`,
    ``,
    `Notes:`,
    c.notes || '(none)',
    ``,
    `Media: ${c.media?.url || ''}`
  ].join('\n');

  // Only md or txt here (PDF would require extra tooling)
  const isMd = (format || '').toLowerCase() === 'md';
  const ext = isMd ? 'md' : 'txt';
  const type = isMd ? 'text/markdown' : 'text/plain';

  return new Response(md, {
    headers: {
      'content-type': type,
      'content-disposition': `attachment; filename="estimate-${cardId}.${ext}"`
    }
  });
};
