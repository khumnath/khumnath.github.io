import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

import { StrictMode } from 'react'

import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './assets/css/font-awesome.min.css'
import App from './App.jsx'
import { ConfigProvider } from './utils/ConfigContext.jsx';
import { SearchProvider } from './utils/SearchContext.jsx';



const container = document.getElementById('root')

if (container.childElementCount > 0) {
  // SPA mode - use hydrateRoot for development, but with StrictMode
  hydrateRoot(container,
    <StrictMode>
      <ConfigProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </ConfigProvider>
    </StrictMode>
  )
} else {
  createRoot(container).render(
    <StrictMode>
      <ConfigProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </ConfigProvider>
    </StrictMode>
  )
}
