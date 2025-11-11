import React, { useRef, useState } from 'react'
import useDeckState from '../hooks/useDeckState.js'
import usePaywall from '../hooks/usePaywall.js'
import PaywallSheet from './PaywallSheet.jsx'

export default function CameraStrip(){
  const inputRef = useRef(null)
  const { freeLeft } = usePaywall()
  const createEstimateFromFile = useDeckState(s=>s.createEstimateFromFile)
  const [showPaywall, setShowPaywall] = useState(false)

  async function onFileChange(e){
    const f = e.target.files?.[0]
    if (!f) return
    if (freeLeft <= 0) { setShowPaywall(true); return }
    await createEstimateFromFile(f)
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
      <button className="btn" onClick={()=> inputRef.current?.click()} disabled={freeLeft<=0}>
        {freeLeft<=0 ? 'Create Estimate (Locked)' : 'Create Estimate'}
      </button>
      <button className="btn-outline" onClick={()=> inputRef.current?.click()}>Upload Media</button>
      {showPaywall && <PaywallSheet onClose={()=>setShowPaywall(false)} />}
    </div>
  )
}
