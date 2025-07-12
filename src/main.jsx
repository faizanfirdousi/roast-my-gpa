import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoastMyGPA from './page.jsx'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoastMyGPA />
    <Analytics />
  </StrictMode>,
)
