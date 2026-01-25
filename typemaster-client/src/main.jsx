import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'
import { FriendsProvider } from './contexts/FriendsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <FriendsProvider>
          <App />
        </FriendsProvider>
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>,
)