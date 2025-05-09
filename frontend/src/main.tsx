import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Abc from "./App"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Abc />
  </StrictMode>,
)
