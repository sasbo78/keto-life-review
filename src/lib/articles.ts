import * as fs from 'fs'
import * as path from 'path'

const ARTICLES_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const AFFILIATE_LINK = process.env.AFFILIATE_LINK || 'https://amzn.to/4hcHEKn'

export interface Article {
  slug: string
  filename: string
  title: string
  html: string
  excerpt: string
  date: string
  imageUrl: string
  labels: string[]
}

function extractTitle(html: string, filename: string): string {
  const m = html.match(/<h2[^>]*>([^<]+)<\/h2>/)
  return m ? m[1].trim() : filename.replace(/\.html$/, '').replace(/post-\d+-/g, '').replace(/[-_]/g, ' ')
}

function extractExcerpt(html: string): string {
  const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const sentences = clean.match(/[^.!?]+[.!?]+/g)
  if (sentences) {
    let excerpt = ''
    for (const s of sentences) {
      excerpt += s
      if (excerpt.length > 120) break
    }
    return excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt
  }
  return clean.substring(0, 160)
}

function extractImageUrl(html: string): string {
  const m = html.match(/<img[^>]+src="([^"]+)"/)
  return m ? m[1] : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800&h=400&fit=crop'
}

function slugify(title: string, filename: string): string {
  if (filename.startsWith('post-')) {
    return filename.replace(/\.html$/, '')
  }
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function getAllArticles(): Article[] {
  const dir = ARTICLES_DIR
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith('post-') && f.endsWith('.html'))
    .sort()

  return files.map((f, i) => {
    const html = fs.readFileSync(path.join(dir, f), 'utf-8')
    const title = extractTitle(html, f)
    const date = new Date()
    date.setDate(date.getDate() - (files.length - i))

    return {
      slug: slugify(title, f),
      filename: f,
      title,
      html,
      excerpt: extractExcerpt(html),
      date: date.toISOString().split('T')[0],
      imageUrl: extractImageUrl(html),
      labels: ['keto', 'weight loss', 'keto coffee', 'review'],
    }
  })
}

export function getArticleBySlug(slug: string): Article | null {
  return getAllArticles().find(a => a.slug === slug) || null
}

export function getRelatedArticles(currentSlug: string, count: number = 3): Article[] {
  return getAllArticles()
    .filter(a => a.slug !== currentSlug)
    .slice(0, count)
}
