import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { marcarCargaExitosa } from './utils/cargaDiferida.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// La app cargó bien: si más adelante un import() dinámico falla por una
// versión vieja del bundle, se podrá intentar una recarga automática.
marcarCargaExitosa()
