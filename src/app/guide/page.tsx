import Link from 'next/link'
import { getAllSEOPages } from '@/lib/seo-generator'

export default function GuidesIndex() {
  const pages = getAllSEOPages().filter(p => p.category === 'guide')

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Keto Coffee <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Guides</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Research-backed guides on keto coffee benefits, ingredients, and how to choose the best product for your goals.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map(p => (
            <Link key={p.slug} href={`/${p.slug}`}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/50 transition-all">
              <div className="flex gap-2 mb-3 flex-wrap">
                {p.labels.slice(0, 2).map(l => (
                  <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{l}</span>
                ))}
              </div>
              <h2 className="text-base font-semibold text-gray-100 group-hover:text-amber-400 transition-colors mb-2 line-clamp-2">
                {p.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-3 mb-3">{p.description}</p>
              <span className="text-xs text-gray-600">{p.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
