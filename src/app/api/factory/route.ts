import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { callAI } from '@/lib/ai'

const AFFILIATE_LINK = process.env.AFFILIATE_LINK || ''
const BLOG_URL = process.env.BLOG_URL || ''

const BLOG_IMAGES = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80',
  'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
]

const PIN_SYSTEM = `You are a world-class Pinterest affiliate marketer creating viral pins for a premium brand.

RULES:
- Generate 5 UNIQUE, high-converting Pinterest pins
- Each pin needs: title (max 60 chars, curiosity-gap), description (180-220 chars, persuasive), 5 hashtags
- Use proven formulas: "I tried X for 30 days...", "The #1 mistake people make with X", "Why I stopped buying X at the store"
- Write in first-person authentic voice — real experience, not marketing
- Create emotional hooks: frustration → discovery → transformation
- Include specific numbers/percentages/results
- Make each pin feel like a genuine recommendation from a friend
- Output JSON array ONLY: [{ "title": "...", "description": "...", "hashtags": "..." }]`

const TIKTOK_SYSTEM = `You are a top TikTok affiliate creator. Generate viral TikTok scripts that feel 100% authentic.

RULES:
- Write 2 UNIQUE TikTok scripts
- Hook (max 10 words): must stop the scroll — use curiosity, controversy, or emotional trigger
- Full script: 60-90 seconds, natural speaking, includes dramatic pauses and emotional arc
- Structure: Problem → Discovery → Transformation → Recommendation
- Include 10 relevant hashtags
- End with subtle CTA: "full review linked in bio" or "check the blog"
- Output JSON array ONLY: [{ "hook": "...", "script": "...", "hashtags": "..." }]`

const BLOG_SYSTEM = `You are a premium affiliate writer for a top health & wellness blog. Write articles that rival the quality of Medical News Today, Healthline, and Verywell Fit.

RULES:
- Generate ONE complete, publish-ready blog article as FULL HTML (not markdown)
- Title must be SEO-optimized, include year, and create curiosity
- Minimum 2500 words of real, valuable content
- Write in first-person authentic voice — genuine experience
- Use proper HTML tags: <h2>, <h3>, <p>, <ul>, <ol>, <blockquote>, <table>, <div class="callout">
- Include affiliate link naturally: ${AFFILIATE_LINK}
- Add affiliate disclosure in first paragraph
- Structure MUST include:
  · An engaging introduction with personal hook
  · What is [product/keyword]
  · How it works (simple science, easy to understand)
  · Benefits with real-feeling details and specific results (numbers, timeframes)
  · My personal experience / Results (before/after, specific metrics)
  · Pros & Cons (honest table)
  · Comparison with alternatives
  · Step-by-step guide on how to use it
  · FAQ section (5 questions with answers)
  · Where to buy + price
  · Final verdict with clear recommendation

IMPORTANT formatting rules:
- Add image placeholders: <div class="blog-image"><img src="__IMAGE__" alt="[description]" loading="lazy" /></div> — place these between sections
- Use <blockquote> for testimonials or key takeaways
- Use <div class="callout success"> for tips
- Use <div class="callout warning"> for warnings
- Use <table> for pros/cons and comparisons
- Use <strong> and <em> for emphasis
- Short paragraphs (2-4 sentences max)
- Conversational but authoritative tone
- Output ONLY the HTML — no other text, no code blocks`

function injectImages(html: string): string {
  let imgIndex = 0
  return html.replace(/__IMAGE__/g, () => {
    const url = BLOG_IMAGES[imgIndex % BLOG_IMAGES.length]
    imgIndex++
    return url
  })
}

function buildMetaHtml(keyword: string, product: string, title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const readingTime = Math.ceil(2500 / 200)
  const today = new Date().toISOString().split('T')[0]
  return `<!-- SEO Meta -->
<meta name="description" content="Read our honest ${product} review. ${keyword} — does it really work? Personal experience, results, pros/cons, and where to buy at the best price." />
<meta name="keywords" content="${keyword}, ${product}, keto, weight loss, review, honest review, 2025, 2026" />
<link rel="canonical" href="${BLOG_URL}/${slug}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="Honest ${product} review after 60 days of testing. See real results, pros/cons, and where to buy." />
<meta property="og:url" content="${BLOG_URL}/${slug}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="Honest ${product} review after 60 days of testing." />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "name": "${title}",
  "author": { "@type": "Person", "name": "Weight Loss Truth" },
  "datePublished": "${today}",
  "dateModified": "${today}",
  "description": "Honest ${product} review",
  "itemReviewed": { "@type": "Product", "name": "${product}" },
  "reviewRating": { "@type": "Rating", "ratingValue": "4.5", "bestRating": "5" }
}
</script>
<!-- /SEO Meta -->

<!-- Table of Contents -->
<div class="toc">
  <h3>Table of Contents</h3>
  <ol>
    <li><a href="#intro">My Story</a></li>
    <li><a href="#what-is">What Is ${product}</a></li>
    <li><a href="#how-it-works">How It Works</a></li>
    <li><a href="#benefits">Key Benefits</a></li>
    <li><a href="#results">My Results</a></li>
    <li><a href="#pros-cons">Pros & Cons</a></li>
    <li><a href="#comparison">Comparison</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#where-to-buy">Where To Buy</a></li>
    <li><a href="#verdict">Final Verdict</a></li>
  </ol>
</div>
<div style="margin:2rem 0;padding:1rem 1.5rem;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;">
  <p style="margin:0;font-size:0.95rem;color:#92400e;"><strong>Affiliate Disclosure:</strong> This article contains affiliate links. If you purchase through these links, I may earn a commission at no extra cost to you. I only recommend products I've personally tested and believe in.</p>
</div>
`
}

async function generateWithAI(system: string, user: string, retries = 3, maxTokens = 2000): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      return await callAI({ system, user, maxTokens })
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  throw new Error('AI generation failed')
}

export async function POST(request: NextRequest) {
  try {
    const { nuggetId } = await request.json()
    if (!nuggetId) return NextResponse.json({ error: 'nuggetId required' }, { status: 400 })

    const nugget = await db.nugget.findUnique({ where: { id: nuggetId } })
    if (!nugget) return NextResponse.json({ error: 'Nugget not found' }, { status: 404 })

    const { keyword, product, niche } = nugget
    const userPrompt = `Keyword: "${keyword}"
Product: "${product}"
Niche: "${niche}"
Blog: ${BLOG_URL}
Affiliate link: ${AFFILIATE_LINK}

Generate premium, conversion-optimized affiliate content for ${keyword}. Write for an audience that is actively researching and ready to buy. Include the affiliate link naturally in the blog post.`

    const [pinsRaw, tiktoksRaw, blogRaw] = await Promise.all([
      generateWithAI(PIN_SYSTEM, userPrompt).catch(() => null),
      generateWithAI(TIKTOK_SYSTEM, userPrompt).catch(() => null),
      generateWithAI(BLOG_SYSTEM, userPrompt, 3, 6000).catch(() => null),
    ])

    const assets = []

    if (pinsRaw) {
      try {
        const pins = JSON.parse(pinsRaw)
        if (Array.isArray(pins)) {
          for (const pin of pins.slice(0, 5)) {
            const saved = await db.contentAsset.create({
              data: {
                nuggetId,
                type: 'pin',
                title: pin.title?.slice(0, 100) ?? 'Pin',
                content: pin.description ?? '',
                description: `${keyword}. ${pin.description ?? ''}\n\n${pin.hashtags ?? ''}`,
                tags: JSON.stringify([niche, product, 'pinterest']),
                platform: 'pinterest',
                status: 'draft',
              },
            })
            assets.push(saved)
          }
        }
      } catch {}
    }

    if (tiktoksRaw) {
      try {
        const tiktoks = JSON.parse(tiktoksRaw)
        if (Array.isArray(tiktoks)) {
          for (const tt of tiktoks.slice(0, 2)) {
            const saved = await db.contentAsset.create({
              data: {
                nuggetId,
                type: 'tiktok',
                title: tt.hook?.slice(0, 100) ?? 'TikTok',
                content: tt.script ?? '',
                description: tt.hashtags ?? '',
                tags: JSON.stringify([niche, product, 'tiktok']),
                platform: 'tiktok',
                status: 'draft',
              },
            })
            assets.push(saved)
          }
        }
      } catch {}
    }

    if (blogRaw) {
      try {
        const titleMatch = blogRaw.match(/<h1[^>]*>(.*?)<\/h1>/i)
        const title = titleMatch
          ? titleMatch[1].trim()
          : `${product} Honest Review: Does It Really Work?`

        let finalContent = blogRaw
        finalContent = injectImages(finalContent)
        finalContent = finalContent.replace(/<h1[^>]*>.*?<\/h1>/i, '').trim()

        const metaHtml = buildMetaHtml(keyword, product, title)
        const fullHtml = `<article class="premium-article">
${metaHtml}
${finalContent}
</article>`

        const saved = await db.contentAsset.create({
          data: {
            nuggetId,
            type: 'blog',
            title: title.slice(0, 200),
            content: fullHtml,
            description: `Honest ${product} review: ${keyword}. Real results, pros/cons, and where to buy at the best price.`,
            tags: JSON.stringify([niche, product, 'review', 'blog', 'keto', 'weight loss']),
            platform: 'google',
            status: 'draft',
          },
        })
        assets.push(saved)
      } catch {}
    }

    if (assets.length === 0) {
      return NextResponse.json({ error: 'AI generation failed, try again' }, { status: 500 })
    }

    return NextResponse.json({ assets, count: assets.length }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const contents = await db.contentAsset.findMany({
      orderBy: { createdAt: 'desc' },
      include: { nugget: { select: { keyword: true, product: true } } },
    })
    return NextResponse.json(contents)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
