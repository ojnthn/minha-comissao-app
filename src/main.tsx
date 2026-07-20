import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ojnthn/minhas-venda-design-system/index.css'
import './index.css'
import { App } from './app/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
