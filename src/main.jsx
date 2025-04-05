import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
   <BrowserRouter basename="/my-react-app">
      <App />
    </BrowserRouter>
</ThemeProvider>,
)
