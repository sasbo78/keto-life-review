'use client'

import { useState } from 'react'

export function EmailCapture({ source = 'guide' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8 my-8">
      <h3 className="text-xl font-bold text-gray-100 mb-2">Free Keto Coffee Guide</h3>
      <p className="text-gray-400 text-sm mb-4">
        Get our exclusive 7-day keto coffee starter guide + tips delivered to your inbox. No spam, unsubscribe anytime.
      </p>

      {status === 'success' ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-green-400 font-medium">You're in! Check your inbox for the free guide.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email" required placeholder="your@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 text-sm"
          />
          <button type="submit" disabled={status === 'loading'}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-gray-900 font-semibold rounded-xl text-sm transition-all whitespace-nowrap">
            {status === 'loading' ? 'Sending...' : 'Get Free Guide →'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
      )}

      <p className="text-xs text-gray-600 mt-3">We respect your privacy. Unsubscribe anytime.</p>
    </div>
  )
}
