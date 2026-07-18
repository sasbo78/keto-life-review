import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSEOPageBySlug, getAllSEOPages } from '@/lib/seo-generator'

const BASE_URL = 'https://keto-life-review-eta.vercel.app'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllSEOPages().filter(p => p.category === 'buy').map(p => ({ slug: p.slug.replace('buy/', '') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getSEOPageBySlug(`buy/${slug}`)
  if (!page) return { title: 'Not Found' }
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description, url: `${BASE_URL}/buy/${slug}` },
    alternates: { canonical: `${BASE_URL}/buy/${slug}` },
  }
}

export default async function BuyPage({ params }: Props) {
  const { slug } = await params
  const page = getSEOPageBySlug(`buy/${slug}`)
  if (!page) notFound()

  const related = page.relatedSlugs.map(s => getSEOPageBySlug(s)).filter(Boolean)

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
          <h3 className="text-xl font-bold text-gray-100 mb-2">Order Keto Coffee Today</h3>
          <p className="text-gray-400 mb-4">Free Prime shipping, 365-day returns, best price guaranteed.</p>
          <a href={process.env.AFFILIATE_LINK || 'https://amzn.to/4hcHEKn'}
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl text-lg transition-all hover:scale-105">
            Buy on Amazon →
          </a>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">More Cities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.slice(0, 8).map(r => r && (
                <Link key={r.slug} href={`/${r.slug}`}
                  className="group bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-amber-500/50 transition-all">
                  <h3 className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
