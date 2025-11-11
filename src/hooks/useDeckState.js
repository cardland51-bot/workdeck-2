import { create } from 'zustand'
import { fetchList, uploadMedia } from '../utils/api.js'
import { getAllCards, saveCard, getAllPending, queuePendingUpload, removePending } from '../utils/storage.js'
import usePaywall from './usePaywall.js'
import { toast } from '../components/Toasts.jsx'

const useDeckState = create((set,get)=> ({
  cards: [],
  loading: false,
  selectedCategory: 'General',
  categories: ['General','Roof','Plumbing','Electrical','Flooring','Landscaping','HVAC','Painting'],
  async hydrate(){
    // try server then fall back to local
    try{
      set({ loading: true })
      const remote = await fetchList()
      set({ cards: remote, loading:false })
      // cache
      for (const c of remote) await saveCard(c)
    } catch {
      const local = await getAllCards()
      local.sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||''))
      set({ cards: local, loading:false })
    }
    // attempt pending uploads if online
    get().flushPending()
  },
  setCategory(cat){ set({ selectedCategory:cat }) },
  async createEstimateFromFile(file){
    const { freeLeft, consume } = usePaywall.getState()
    if (freeLeft <= 0) { toast('Free limit reached. Subscribe to continue.'); return null }
    try{
      const card = await uploadMedia(file, {})
      toast('Uploaded ✅')
      consume()
      await saveCard(card)
      set(s=> ({ cards: [card, ...s.cards] }))
      return card
   } catch(e){
  const message = e?.message || 'Upload failed'
  // Queue offline only if the browser is actually offline
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const id='pending_'+Date.now()
    await queuePendingUpload({ id, fileName:file.name, type:file.type, data:await file.arrayBuffer(), label })
    toast('Saved offline. Will upload when online.')
  } else {
    toast(message)
  }
  return null
}
  },
  async flushPending(){
    const items = await getAllPending()
    for (const it of items){
      try{
        const file = new File([it.data], it.fileName, { type: it.type })
        const card = await uploadMedia(file, {})
        await saveCard(card)
        set(s=> ({ cards: [card, ...s.cards] }))
        await removePending(it.id)
        toast('Pending upload sent ✅')
      } catch {}
    }
  }
}))

export default useDeckState
