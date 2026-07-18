import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles, getAllArticles } from '@/lib/articles'
import { Metadata } from 'next'
import { EmailCapture } from '@/components/EmailCapture'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: `${article.title} | Keto Life Review`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedArticles(slug)

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-amber-400 transition-colors mb-4 inline-block">
            ← Back to all reviews
          </Link>
          <div className="flex gap-2 mb-4 mt-2">
            {article.labels.map(label => (
              <span key={label} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">
                {label}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
            {article.title}
          </h1>
          <p className="text-sm text-gray-500">{article.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-invert prose-amber max-w-none
          prose-headings:text-gray-100 prose-headings:font-bold
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
          prose-img:rounded-xl prose-img:shadow-lg
          prose-strong:text-gray-100
          prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        {/* Buy CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-100 mb-2">Ready to Try Keto Coffee?</h3>
          <p className="text-gray-400 mb-4">Get the best deal on Amazon with free Prime shipping and 365-day money-back guarantee.</p>
          <a href={process.env.AFFILIATE_LINK || 'https://amzn.to/4hcHEKn'}
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl text-lg transition-all hover:scale-105">
            Check Best Price on Amazon →
          </a>
        </div>

        {/* Email Capture */}
        <EmailCapture source={`article-${article.slug}`} />

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">More Reviews You Might Like</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all">
                  <div className="aspect-[16/9] overflow-hidden bg-gray-800">
                    <img src={r.imageUrl} alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Affiliate Disclosure */}
        <div className="mt-12 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong> This article contains affiliate links. 
            If you make a purchase through these links, we may earn a commission at no additional cost to you. 
            All opinions are based on our genuine product testing and research.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
          <Link href="/blog" className="hover:text-amber-400 transition-colors">← All Reviews</Link>
        </div>
      </footer>
    </main>
  )
}
