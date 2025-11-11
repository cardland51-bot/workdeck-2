export function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(()=> URL.revokeObjectURL(url), 1000)
}

export function cardToMarkdown(card){
  const lines = [
    `# WorkDeck Estimate (${card.id})`,
    `Created: ${card.createdAt}`,
    `Category: ${card.label || 'General'}`,
    `AI Price Band: $${card.aiLow ?? '?'} - $${card.aiHigh ?? '?'}`,
    '',
    `Notes:`,
    card.notes || '(none)',
    '',
    `Media URL: ${location.origin}${card.media?.url || ''}`
  ]
  return new Blob([lines.join('\n')], { type: 'text/markdown' })
}
