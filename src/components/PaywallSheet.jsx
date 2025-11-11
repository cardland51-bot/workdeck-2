import React, { useEffect, useRef } from 'react'
import usePaywall from '../hooks/usePaywall.js'

export default function PaywallSheet({ onClose }){
  const ref = useRef(null)
  const { freeLeft } = usePaywall()

  useEffect(()=>{
    if (window.paypal && ref.current){
      try{
        window.paypal.Buttons({
          style: { layout:'vertical', color:'gold', shape:'rect', label:'subscribe' },
          createSubscription: (data, actions) => {
            // sandbox stub
            return actions.subscription.create({ 'plan_id': 'P-TESTSANDBOX' })
          },
          onApprove: () => {
            alert('Sandbox subscription approved — unlock successful in demo.')
            onClose?.()
          }
        }).render(ref.current)
      } catch(e){ /* ignore */ }
    }
  },[])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 border border-zinc-200 dark:border-zinc-800" onClick={e=>e.stopPropagation()}>
        <div className="font-semibold text-lg mb-1">Subscribe to continue</div>
        <div className="text-sm text-zinc-500 mb-3">You have {freeLeft} free estimates left.</div>
        <div ref={ref} className="mb-3"></div>
        <button className="btn-outline w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
