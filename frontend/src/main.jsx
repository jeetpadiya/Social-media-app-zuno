import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AuthContextProvider from './context/AuthContext.jsx'
import PostContextProvider from './context/PostContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContextProvider>
    <PostContextProvider>
    <App />
    </PostContextProvider>
  </AuthContextProvider>
  </BrowserRouter>,
)
