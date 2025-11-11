import React from 'react'
import { create } from 'zustand'

const useToast = create(set => ({
  items: [],
  push: (msg)=> set(s=>({ items: [...s.items, { id: Math.random().toString(36).slice(2), msg }] })),
  remove: (id)=> set(s=>({ items: s.items.filter(i=>i.id!==id) }))
}))

export function toast(msg){ useToast.getState().push(msg) }

export default function Toasts(){
  const items = useToast(s=>s.items)
  const remove = useToast(s=>s.remove)
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {items.map(i=> (
        <div key={i.id} className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-2 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <span className="text-sm">{i.msg}</span>
            <button className="text-xs opacity-70 hover:opacity-100" onClick={()=>remove(i.id)}>dismiss</button>
          </div>
        </div>
      ))}
    </div>
  )
}
