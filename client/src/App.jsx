import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import WeatherModule from './components/WeatherModule'
import CurrencyConverter from './components/CurrencyConverter'
import QuoteGenerator from './components/QuoteGenerator'
import './styles/App.css'
import './styles/ModuleStyles.css'

export default function App(){
  // BrowserRouter basename will use the Vite env variable VITE_BASE_PATH when provided.
  // For GitHub Pages set VITE_BASE_PATH=/BiteXl; on Vercel leave it unset so basename is '/'.
  const routerBase = import.meta.env.VITE_BASE_PATH || '/'
  return (
    <BrowserRouter basename={routerBase}>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/weather" element={<ModulePage title="Weather"><WeatherModule /></ModulePage>} />
        <Route path="/currency" element={<ModulePage title="Currency"><CurrencyConverter /></ModulePage>} />
        <Route path="/quote" element={<ModulePage title="Quote"><QuoteGenerator /></ModulePage>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function MainLayout(){
  return (
    <div className="app">
      <h1>InfoHub</h1>
      <div className="tabs">
        <NavLink to="/weather" className={({isActive})=> isActive? 'active':''}>Weather</NavLink>
        <NavLink to="/currency" className={({isActive})=> isActive? 'active':''}>Currency</NavLink>
        <NavLink to="/quote" className={({isActive})=> isActive? 'active':''}>Quote</NavLink>
      </div>

      <div className="panel">
        <h2>Welcome to InfoHub</h2>
        <p>Choose a module above to open it as its own page.</p>
      </div>

      <footer>Built with Node/Express + React (Vite)</footer>
    </div>
  )
}

function ModulePage({ title, children }){
  return (
    <div className="module-page">
      <div className="module-top">
        <Link to="/" className="back">← Back</Link>
        <h2>{title}</h2>
      </div>
      <div className="module-content">
        {children}
      </div>
    </div>
  )
}

function NotFound(){
  return (
    <div style={{padding:20}}>
      <h2>404 — Page not found</h2>
      <p>The page you requested does not exist.</p>
      <p><Link to="/">Return home</Link></p>
    </div>
  )
}
