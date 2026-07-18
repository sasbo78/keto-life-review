import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

export default function BlogPage() {
  const articles = getAllArticles()

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Keto Coffee Reviews{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              & Guides
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Honest, research-backed reviews of the best keto coffee products. 
            We test every product for 30 days so you don't have to.
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
            <a href={process.env.AFFILIATE_LINK || 'https://amzn.to/4hcHEKn'}
               target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl transition-colors">
              Best Keto Coffee on Amazon →
            </a>
            <Link href="/guide" className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors border border-gray-700">
              Guides & Tips
            </Link>
            <Link href="/best" className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors border border-gray-700">
              Top Picks
            </Link>
            <Link href="/compare" className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors border border-gray-700">
              Comparisons
            </Link>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="aspect-[16/9] overflow-hidden bg-gray-800">
                <img src={article.imageUrl} alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-3">
                  {article.labels.slice(0, 2).map(label => (
                    <span key={label} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">
                      {label}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-gray-100 group-hover:text-amber-400 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{article.date}</span>
                  <span className="text-amber-500/70 group-hover:text-amber-400 transition-colors">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p className="mb-2">Some links on this page are affiliate links. We may earn a commission if you purchase through them at no extra cost to you.</p>
          <p>© 2026 Keto Life Review. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
