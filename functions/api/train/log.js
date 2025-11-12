export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    // Convert the incoming adjustment into one JSONL line
    const line = JSON.stringify({
      image_url: body.image_url,
      prompt: body.prompt,
      completion: body.completion,
      timestamp: new Date().toISOString()
    }) + "\n";

    // Try every possible R2 binding name so you don’t have to guess in dashboard
    const bucket = env.srcdec || env.R2BUCKET || env.R2;
    const key = "manifest/tune-set.jsonl";

    // Fetch existing file contents (if any)
    let existing = "";
    try {
      const obj = await bucket.get(key);
      if (obj) existing = await obj.text();
    } catch {
      // no file yet — first write will create it
    }

    // Append new data
    const newData = existing + line;

    await bucket.put(key, new Blob([newData]), {
      httpMetadata: { contentType: "application/jsonl" },
    });

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
