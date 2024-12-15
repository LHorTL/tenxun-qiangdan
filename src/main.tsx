import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Popup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
