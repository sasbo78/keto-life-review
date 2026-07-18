import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllSEOPages } from '@/lib/seo-generator'

const BASE_URL = 'https://keto-life-review-eta.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const seoPages = getAllSEOPages()

  const articleEntries = articles.map(a => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const seoEntries = seoPages.map(p => ({
    url: `${BASE_URL}/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const categoryEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/guide`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/best`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/buy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...categoryEntries,
    ...articleEntries,
    ...seoEntries,
  ]
}
