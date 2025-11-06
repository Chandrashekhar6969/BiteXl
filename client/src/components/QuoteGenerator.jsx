import React, { useEffect, useState } from 'react'
import '../styles/QuoteGenerator.css'

export default function QuoteGenerator(){
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    setQuote(null)
    
    try {
      const response = await fetch('https://dummyjson.com/quotes/random')
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setQuote({
        text: data.quote,
        author: data.author
      })
    } catch (err) {
      setError('Could not load quote. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="quote-generator">
      <h2>Daily Inspiration</h2>
      <div className="row">
        <button onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'New Quote'}
        </button>
      </div>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {quote && (
        <div className="card quote">
          <p className="text">"{quote.text}"</p>
          <p className="author">— {quote.author}</p>
        </div>
      )}
    </div>
  )
}
