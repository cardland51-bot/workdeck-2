import React, { useState } from 'react'
import useTheme from '../hooks/useTheme.js'
import usePaywall from '../hooks/usePaywall.js'

export default function SettingsSheet(){
  const { theme, toggle } = useTheme()
  const [exportFmt, setExportFmt] = useState(localStorage.getItem('workdeck_export_fmt') || 'md')
  const resetQuota = usePaywall(s=>s.reset)

  function saveFmt(v){ setExportFmt(v); localStorage.setItem('workdeck_export_fmt', v) }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
      <div className="font-medium mb-2">Settings</div>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm">Theme:</div>
        <button className="btn-outline" onClick={toggle}>{theme==='dark'?'Dark':'Light'}</button>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm">Export default:</div>
        <select className="btn-outline" value={exportFmt} onChange={e=>saveFmt(e.target.value)}>
          <option value="md">Markdown</option>
          <option value="pdf">PDF (server)</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-outline" onClick={resetQuota}>Reset Free-Use Counter</button>
      </div>
    </div>
  )
}
