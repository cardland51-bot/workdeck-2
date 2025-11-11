import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import useTheme from './hooks/useTheme.js'
import usePaywall from './hooks/usePaywall.js'
import Toasts from './components/Toasts.jsx'

export default function App(){
  const { theme, toggle } = useTheme()
  const { freeLeft } = usePaywall()
  const loc = useLocation()

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-block w-2 h-6 bg-emerald-500 rounded"></span>
            WorkDeck
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/" className={`btn-outline ${loc.pathname==='/'?'bg-zinc-100 dark:bg-zinc-800':''}`}>Capture & Deck</Link>
            <Link to="/weekly" className={`btn-outline ${loc.pathname.startsWith('/weekly')?'bg-zinc-100 dark:bg-zinc-800':''}`}>Weekly Organizer</Link>
            <span className="text-xs text-zinc-500">Free left: <b>{freeLeft}</b></span>
            <button className="btn-outline" onClick={toggle}>{theme==='dark'?'🌙':'🌞'}</button>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
      <Toasts />
    </div>
  )
}
