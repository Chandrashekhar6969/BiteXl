import React, { useEffect, useState } from 'react'
import '../styles/CurrencyConverter.css'

export default function CurrencyConverter(){
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const convert = async ()=>{
    const amt = Number(amount)
    if (!amt || amt < 0) {
      setError('Please enter a valid positive amount')
      return
    }

    setIsLoading(true); setError(''); setResult(null)
    try{
      const resp = await fetch(`https://api.frankfurter.dev/v1/latest?base=INR&symbols=USD,EUR`)
      if (!resp.ok) {
        throw new Error(`API error: ${resp.status}`)
      }
      const json = await resp.json()
      if (!json || !json.rates) throw new Error('Invalid response')
      
      // Calculate converted amounts
      const usd = (amt * json.rates.USD).toFixed(2)
      const eur = (amt * json.rates.EUR).toFixed(2)
      
      setResult({ 
        amount: amt, 
        usd: usd, 
        eur: eur, 
        rates: json.rates 
      })
    }catch(err){ setError('Conversion failed: ' + err.message) }
    finally{ setIsLoading(false) }
  }

  useEffect(()=>{ convert() }, [])

  return (
    <div className="currency-converter">
      <h2>Currency Converter</h2>
      <div className="row">
        <input
          type="number"
          value={amount}
          onChange={e=>setAmount(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') convert() }}
          placeholder="Enter amount in INR"
        />
        <button onClick={convert} disabled={isLoading}>{isLoading ? 'Converting...' : 'Convert'}</button>
      </div>
      {isLoading && <p className="muted">Converting...</p>}
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="card">
          <p><strong>Amount (INR):</strong> {result.amount}</p>
          <p><strong>USD:</strong> {result.usd}</p>
          <p><strong>EUR:</strong> {result.eur}</p>
        </div>
      )}
    </div>
  )
}
