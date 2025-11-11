export async function fetchList(){
  const res = await fetch('/api/jobs/list', { credentials: 'include' })
  if (!res.ok) throw new Error('list_failed')
  const data = await res.json()
  return data.items || []
}

export async function uploadMedia(file, fields={}){
  const fd = new FormData()
  fd.append('media', file)
  for (const [k,v] of Object.entries(fields)) fd.append(k, v)

  const res = await fetch('/api/jobs/upload', { method:'POST', body: fd, credentials: 'include' })
  if (!res.ok) throw new Error('upload_failed')
  return await res.json()
}

export async function exportCard(cardId, format='pdf'){
  const res = await fetch(`/api/export/${format}/${cardId}`, { credentials: 'include' })
  if (!res.ok) throw new Error('export_failed')
  return await res.blob()
}
