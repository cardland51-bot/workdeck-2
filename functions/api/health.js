export const onRequestGet = async ({ env }) => {
  const ok = !!env.R2
  const hasKey = !!env.OPENAI_API_KEY
  return new Response(JSON.stringify({ ok, hasKey, time: new Date().toISOString() }), {
    headers: { 'content-type': 'application/json' }
  })
}

