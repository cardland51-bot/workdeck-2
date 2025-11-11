import { useEffect, useState } from 'react'

export default function useTheme(){
  const [theme, setTheme] = useState(localStorage.getItem('workdeck_theme') || 'light')

  useEffect(()=>{
    localStorage.setItem('workdeck_theme', theme)
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },[theme])

  return {
    theme,
    setTheme,
    toggle: ()=> setTheme(t => t==='dark' ? 'light' : 'dark')
  }
}
