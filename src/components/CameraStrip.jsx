import React,{useRef,useState} from 'react'
import useDeckState from '../hooks/useDeckState.js'
import usePaywall from '../hooks/usePaywall.js'
import PaywallSheet from './PaywallSheet.jsx'

export default function CameraStrip(){
  const cameraRef = useRef(null)
  const uploadRef = useRef(null)
  const { freeLeft } = usePaywall()
  const createEstimateFromFile = useDeckState(s=>s.createEstimateFromFile)
  const [showPaywall,setShowPaywall] = useState(false)

  function pick(which){
    if (freeLeft <= 0) { setShowPaywall(true); return }
    if (which==='camera') cameraRef.current?.click()
    else uploadRef.current?.click()
  }

  async function onPick(e){
    const f = e.target.files?.[0]
    if(!f) return
    try { await createEstimateFromFile(f) }
    finally { e.target.value = '' } // allow re-pick same file
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Hidden inputs */}
      {/* On phones, capture="environment" opens the back camera */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick}/>
      <input ref={uploadRef} type="file" accept="image/*,video/*" className="hidden" onChange={onPick}/>

      {/* Primary actions */}
      <button className="btn" onClick={()=>pick('camera')}>📷 Take Photo</button>
      <button className="btn-outline" onClick={()=>pick('upload')}>⬆️ Upload from device</button>

      {/* Free-uses badge */}
      <span className="text-xs text-zinc-500">Free left: <b>{freeLeft}</b></span>

      {showPaywall && <PaywallSheet onClose={()=>setShowPaywall(false)}/>}
    </div>
  )
}
