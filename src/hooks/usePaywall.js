import { create } from 'zustand'

const usePaywall = create((set,get)=> ({
  quota: 5,
  used: Number(localStorage.getItem('workdeck_used') || '0'),
  get freeLeft(){ return Math.max(0, get().quota - get().used) },
  consume: () => {
    set(s=>{
      const used = s.used + 1
      localStorage.setItem('workdeck_used', String(used))
      return { ...s, used }
    })
  },
  reset: () => set(()=>{ localStorage.setItem('workdeck_used','0'); return { used:0 } })
}))

export default usePaywall
