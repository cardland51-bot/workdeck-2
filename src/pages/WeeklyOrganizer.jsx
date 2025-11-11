import React, { useEffect } from 'react'
import useDeckState from '../hooks/useDeckState.js'
import WeekTabs from '../components/WeekTabs.jsx'
import EstimateCard from '../components/EstimateCard.jsx'

export default function WeeklyOrganizer(){
  const cards = useDeckState(s=>s.cards)
  const hydrate = useDeckState(s=>s.hydrate)
  useEffect(()=>{ hydrate() }, [])
  return (
    <div>
      <WeekTabs items={cards} renderItem={(c)=> <EstimateCard key={c.id} card={c} />} />
    </div>
  )
}
