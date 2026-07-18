import Link from 'next/link'
import { getAllSEOPages } from '@/lib/seo-generator'

export default function BuyIndex() {
  const pages = getAllSEOPages().filter(p => p.category === 'buy')

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Where to Buy <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Keto Coffee</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Find the best keto coffee delivery options in your city. Quick shipping to all major US locations.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Browse by City</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pages.map(p => (
            <Link key={p.slug} href={`/${p.slug}`}
              className="group bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-amber-500/50 transition-all">
              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors">
                {p.title.replace('Where to Buy Keto Coffee in ', '').replace(' (2026)', '')}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
