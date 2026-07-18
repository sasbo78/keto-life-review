import Link from 'next/link'
import { getAllSEOPages } from '@/lib/seo-generator'

export default function CompareIndex() {
  const pages = getAllSEOPages().filter(p => p.category === 'compare')

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Keto Coffee <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Comparisons</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Side-by-side comparisons of the most popular keto coffee products. We tested both so you know which one wins.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-4">
          {pages.map(p => (
            <Link key={p.slug} href={`/${p.slug}`}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/50 transition-all">
              <h2 className="text-base font-semibold text-gray-100 group-hover:text-amber-400 transition-colors mb-2">
                {p.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
              <span className="text-xs text-gray-600">{p.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
