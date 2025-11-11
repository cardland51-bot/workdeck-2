import React,{useEffect} from 'react'
import {create} from 'zustand'

const useToast = create(set=>({
  items: [],
  push: (msg, ms=3500) => set(s=>{
    // de-dup same consecutive message
    if (s.items.length && s.items[s.items.length-1].msg === msg) return s
    const id = Math.random().toString(36).slice(2)
    // schedule auto-remove
    setTimeout(()=>useToast.getState().remove(id), ms)
    return { items: [...s.items, { id, msg }] }
  }),
  remove: (id) => set(s=>({ items: s.items.filter(i=>i.id!==id) }))
}))

export function toast(msg, ms){ useToast.getState().push(msg, ms) }

export default function Toasts(){
  const items = useToast(s=>s.items)
  const remove = useToast(s=>s.remove)
  useEffect(()=>{},[items])
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {items.map(i=>(
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
