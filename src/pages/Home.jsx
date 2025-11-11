import React from 'react'
import CameraStrip from '../components/CameraStrip.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import DeckGrid from '../components/DeckGrid.jsx'
import SettingsSheet from '../components/SettingsSheet.jsx'

export default function Home(){
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CameraStrip />
        <SettingsSheet />
      </div>
      <div>
        <div className="text-sm font-medium mb-2">Categories</div>
        <CategoryChips />
      </div>
      <DeckGrid />
    </div>
  )
}
