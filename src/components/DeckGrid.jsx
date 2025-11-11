import React, { useEffect } from 'react'
import useDeckState from '../hooks/useDeckState.js'
import EstimateCard from './EstimateCard.jsx'

export default function DeckGrid(){
  const cards = useDeckState(s=>s.cards)
  const hydrate = useDeckState(s=>s.hydrate)
  const loading = useDeckState(s=>s.loading)

  useEffect(()=>{ hydrate() }, [])

  if (loading) return <div>Loading deck…</div>
  if (!cards.length) return <div>No estimates yet. Create one above.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(c=> <EstimateCard key={c.id} card={c} />)}
    </div>
  )
}
