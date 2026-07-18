import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSEOPageBySlug, getAllSEOPages } from '@/lib/seo-generator'

const BASE_URL = 'https://keto-life-review-eta.vercel.app'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllSEOPages().filter(p => p.category === 'best').map(p => ({ slug: p.slug.replace('best/', '') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getSEOPageBySlug(`best/${slug}`)
  if (!page) return { title: 'Not Found' }
  return {
    title: `Best ${page.title} | Keto Life Review`,
    description: page.description,
    openGraph: { title: page.title, description: page.description, url: `${BASE_URL}/best/${slug}` },
    alternates: { canonical: `${BASE_URL}/best/${slug}` },
  }
}

export default async function BestPage({ params }: Props) {
  const { slug } = await params
  const page = getSEOPageBySlug(`best/${slug}`)
  if (!page) notFound()

  const allPages = getAllSEOPages()
  const related = page.relatedSlugs.map(s => getSEOPageBySlug(s)).filter(Boolean)

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/best" className="text-sm text-gray-500 hover:text-amber-400 transition-colors mb-4 inline-block">
            ← All Top Picks
          </Link>
          <div className="flex gap-2 mb-4 mt-2 flex-wrap">
            {page.labels.map(l => (
              <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">{l}</span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">{page.h1}</h1>
          <p className="text-sm text-gray-500">{page.date}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-invert prose-amber max-w-none
          prose-headings:text-gray-100 prose-headings:font-bold
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
          prose-strong:text-gray-100 prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />

        <div className="mt-12 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-100 mb-2">Ready to Buy?</h3>
          <p className="text-gray-400 mb-4">Get the best price on Amazon with free shipping.</p>
          <a href={process.env.AFFILIATE_LINK || 'https://amzn.to/4hcHEKn'}
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl text-lg transition-all hover:scale-105">
            Check Price on Amazon →
          </a>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">More Top Picks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(r => r && (
                <Link key={r.slug} href={`/${r.slug}`}
                  className="group bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-amber-500/50 transition-all">
                  <h3 className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong> This article contains affiliate links.
            If you make a purchase through these links, we may earn a commission at no additional cost to you.
          </p>
        </div>
      </div>
    </main>
  )
}
