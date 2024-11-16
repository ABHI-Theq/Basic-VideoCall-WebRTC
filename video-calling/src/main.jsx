import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SocketContextProvider from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
    
        <BrowserRouter>
            <SocketContextProvider>
                <App />
            </SocketContextProvider>
        </BrowserRouter>
)
