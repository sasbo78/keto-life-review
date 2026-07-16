import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

export interface PinDesign {
  title: string
  subtitle?: string
  imageUrl: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  logoText?: string
  ctaText?: string
}

const PIN_WIDTH = 1000
const PIN_HEIGHT = 1500

function getPinHtml(design: PinDesign): string {
  const bg = design.backgroundColor || '#1a3a2a'
  const text = design.textColor || '#ffffff'
  const accent = design.accentColor || '#f59e0b'
  const logo = design.logoText || 'Keto Life Review'

  return `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${PIN_WIDTH}px; height: ${PIN_HEIGHT}px; font-family: 'Georgia', 'Times New Roman', serif; }
.pin { width: 100%; height: 100%; position: relative; overflow: hidden; background: ${bg}; }
.bg { position: absolute; width: 100%; height: 70%; top: 0; left: 0; }
.bg img { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; width: 100%; height: 70%; top: 0; left: 0; background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%); }
.gradient-bottom { position: absolute; bottom: 0; width: 100%; height: 55%; background: linear-gradient(180deg, transparent 0%, ${bg} 100%); }
.content { position: absolute; bottom: 0; width: 100%; padding: 50px 45px 40px; text-align: center; }
.logo { font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: ${accent}; margin-bottom: 18px; font-weight: 700; font-family: 'Arial', sans-serif; }
.title { font-size: 42px; font-weight: 700; line-height: 1.25; color: ${text}; margin-bottom: 15px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
${design.subtitle ? `.subtitle { font-size: 22px; color: rgba(255,255,255,0.85); font-weight: 400; line-height: 1.4; margin-bottom: 25px; }` : ''}
.cta { display: inline-block; background: ${accent}; color: #1a1a1a; padding: 16px 40px; border-radius: 50px; font-size: 18px; font-weight: 700; text-decoration: none; font-family: 'Arial', sans-serif; letter-spacing: 0.5px; }
.cta-arrow { margin-left: 8px; }
.badge { position: absolute; top: 25px; right: 25px; background: ${accent}; color: #1a1a1a; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 700; font-family: 'Arial', sans-serif; }
</style></head><body>
<div class="pin">
  <div class="bg"><img src="${design.imageUrl}" alt=""/></div>
  <div class="overlay"></div>
  <div class="gradient-bottom"></div>
  <div class="badge">&#9733; TOP PICK</div>
  <div class="content">
    <div class="logo">${logo}</div>
    <div class="title">${design.title}</div>
    ${design.subtitle ? `<div class="subtitle">${design.subtitle}</div>` : ''}
    <span class="cta">${design.ctaText || 'Learn More'}<span class="cta-arrow">→</span></span>
  </div>
</div>
</body></html>`
}

export async function generatePinImage(design: PinDesign, outputPath: string): Promise<string> {
  const html = getPinHtml(design)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: PIN_WIDTH, height: PIN_HEIGHT } })

  try {
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.screenshot({ path: outputPath, fullPage: false, clip: { x: 0, y: 0, width: PIN_WIDTH, height: PIN_HEIGHT } })
    return outputPath
  } finally {
    await browser.close()
  }
}

export async function generatePinImageBase64(design: PinDesign): Promise<string> {
  const html = getPinHtml(design)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: PIN_WIDTH, height: PIN_HEIGHT } })

  try {
    await page.setContent(html, { waitUntil: 'networkidle' })
    const buffer = await page.screenshot({ fullPage: false, clip: { x: 0, y: 0, width: PIN_WIDTH, height: PIN_HEIGHT } })
    return buffer.toString('base64')
  } finally {
    await browser.close()
  }
}

export async function generateMultiplePins(articlesDir: string, outputDir: string): Promise<{ title: string; imagePath: string }[]> {
  const articles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html')).sort()
  const results: { title: string; imagePath: string }[] = []
  const unsplashQueries = [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=1000&h=1500&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1500&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=1500&fit=crop',
    'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1000&h=1500&fit=crop',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1000&h=1500&fit=crop',
  ]
  const colors = ['#1a3a2a', '#2d1b4e', '#8b4513', '#1a365d', '#6b2fa0']

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  for (let i = 0; i < articles.length; i++) {
    const html = fs.readFileSync(path.join(articlesDir, articles[i]), 'utf-8')
    const titleMatch = html.match(/<h2[^>]*>([^<]+)<\/h2>/)
    const title = titleMatch ? titleMatch[1].trim() : articles[i].replace(/\.html$/, '').replace(/post-\d+-/g, '').replace(/[-_]/g, ' ')

    const shortTitle = title.length > 60 ? title.substring(0, 57) + '...' : title
    const imgIdx = i % unsplashQueries.length

    const design: PinDesign = {
      title: shortTitle,
      subtitle: 'Keto Coffee Weight Loss Guide',
      imageUrl: unsplashQueries[imgIdx],
      backgroundColor: colors[i % colors.length],
      ctaText: 'Check Price on Amazon →',
    }

    const outputPath = path.join(outputDir, `pin-${String(i + 1).padStart(2, '0')}.png`)
    await generatePinImage(design, outputPath)
    results.push({ title, imagePath: outputPath })

    console.log(`  Generated pin ${i + 1}/${articles.length}: ${shortTitle}`)
  }

  return results
}
