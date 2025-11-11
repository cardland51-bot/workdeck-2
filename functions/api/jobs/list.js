export const onRequestGet = async ({ env }) => {
  const items = [];
  let cursor;
  do {
    const { objects, truncated, cursor: next } = await env.R2.list({ prefix: 'cards/', cursor });
    for (const o of objects || []) {
      const f = await env.R2.get(o.key);
      if (!f) continue;
      items.push(JSON.parse(await f.text()));
    }
    cursor = truncated ? next : undefined;
  } while (cursor);
  items.sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||''));
  return new Response(JSON.stringify({ items }), { headers: { 'content-type':'application/json' }});
};
