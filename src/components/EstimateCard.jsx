import React from 'react'
import { Link } from 'react-router-dom'

export default function EstimateCard({ card }){
  return (
    <Link to={`/card/${card.id}`} className="block border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow">
      <div className="aspect-video bg-zinc-100 dark:bg-zinc-800">
        {card.media?.url && <img src={card.media.url} alt={card.label} className="w-full h-full object-cover" />}
      </div>
      <div className="p-3 text-sm">
        <div className="font-medium">{card.label || 'General'}</div>
        <div className="text-zinc-500">${card.aiLow ?? '?'} - ${card.aiHigh ?? '?'}</div>
        <div className="text-xs text-zinc-400">{new Date(card.createdAt).toLocaleString()}</div>
      </div>
    </Link>
  )
}
