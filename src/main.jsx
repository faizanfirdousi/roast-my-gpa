import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoastMyGPA from './page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoastMyGPA />
  </StrictMode>,
)
