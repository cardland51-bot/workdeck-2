import React from 'react'

function groupByWeek(items){
  const now = new Date()
  const startOfWeek = (d)=> {
    const date = new Date(d)
    const day = date.getDay() // 0..6
    const diff = (day + 6) % 7 // make Monday start
    date.setDate(date.getDate() - diff)
    date.setHours(0,0,0,0)
    return date
  }
  const thisWeekStart = startOfWeek(now).getTime()
  const lastWeekStart = thisWeekStart - 7*86400000

  const groups = { this: [], last: [], older: [] }
  for (const it of items){
    const t = new Date(it.createdAt).getTime()
    if (t >= thisWeekStart) groups.this.push(it)
    else if (t >= lastWeekStart) groups.last.push(it)
    else groups.older.push(it)
  }
  return groups
}

export default function WeekTabs({ items, renderItem }){
  const g = groupByWeek(items)
  const tabs = [
    { key:'this', label:'This Week', items: g.this },
    { key:'last', label:'Last Week', items: g.last },
    { key:'older', label:'Older', items: g.older },
  ]
  const [tab, setTab] = React.useState('this')
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {tabs.map(t=> (
          <button key={t.key} onClick={()=>setTab(t.key)} className={`chip ${tab===t.key?'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900':''}`}>{t.label} ({t.items.length})</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tabs.find(t=>t.key===tab).items.map(renderItem)}
      </div>
    </div>
  )
}
