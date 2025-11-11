import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useDeckState from '../hooks/useDeckState.js'
import { exportCard } from '../utils/api.js'
import { cardToMarkdown, downloadBlob } from '../utils/exportHelpers.js'
import { toast } from '../components/Toasts.jsx'

export default function CardDetail(){
  const { id } = useParams()
  const nav = useNavigate()
  const card = useDeckState(s=> s.cards.find(c=>c.id===id))
  const [notes, setNotes] = useState(card?.notes || '')
  const [priceBand, setPriceBand] = useState([card?.aiLow ?? 0, card?.aiHigh ?? 0])

  if (!card) return <div>Card not found.</div>

  function saveNotes(){
    card.notes = notes
    toast('Notes saved')
  }

  async function doExport(fmt){
    try{
      if (fmt==='md'){
        downloadBlob(cardToMarkdown({ ...card, notes }), `estimate-${card.id}.md`)
      } else {
        const blob = await exportCard(card.id, fmt)
        downloadBlob(blob, `estimate-${card.id}.${fmt}`)
      }
      toast('Export started ✅')
    } catch {
      // fallback to markdown
      downloadBlob(cardToMarkdown({ ...card, notes }), `estimate-${card.id}.md`)
      toast('Server export unavailable — saved Markdown.')
    }
  }

  const shareUrl = useMemo(()=> `${location.origin}/card/${card.id}`, [card.id])

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <img src={card.media?.url} alt={card.label} className="w-full object-contain" />
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-2xl font-semibold">{card.label || 'Estimate'}</div>
          <div className="text-sm text-zinc-500">{new Date(card.createdAt).toLocaleString()}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm">Price band:</div>
          <input type="number" className="btn-outline w-24" value={priceBand[0]} onChange={e=>setPriceBand([Number(e.target.value), priceBand[1]])} />
          <span>—</span>
          <input type="number" className="btn-outline w-24" value={priceBand[1]} onChange={e=>setPriceBand([priceBand[0], Number(e.target.value)])} />
        </div>

        <div>
          <div className="text-sm mb-1">Notes</div>
          <textarea className="w-full h-32 btn-outline" value={notes} onChange={e=>setNotes(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <button className="btn-outline" onClick={saveNotes}>Save Notes</button>
            <button className="btn" onClick={()=>doExport(localStorage.getItem('workdeck_export_fmt') || 'md')}>Export</button>
            <button className="btn-outline" onClick={()=> navigator.clipboard.writeText(shareUrl)}>Copy Link</button>
            <button className="btn-outline" onClick={()=> nav(-1)}>Back</button>
          </div>
        </div>
      </div>
    </div>
  )
}
