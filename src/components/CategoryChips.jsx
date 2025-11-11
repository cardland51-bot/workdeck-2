import React from 'react'
import useDeckState from '../hooks/useDeckState.js'

export default function CategoryChips(){
  const cats = useDeckState(s=>s.categories)
  const cur = useDeckState(s=>s.selectedCategory)
  const setCat = useDeckState(s=>s.setCategory)
  return (
    <div className="flex flex-wrap gap-2">
      {cats.map(c=> (
        <button key={c} className={`chip ${cur===c?'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900':''}`} onClick={()=>setCat(c)}>{c}</button>
      ))}
    </div>
  )
}
