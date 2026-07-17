import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = path.join(__dirname, '..', 'src', 'data', 'articles')
const PINS_DIR = path.join(__dirname, '..', 'public', 'generated-pins')
const CAMPAIGN_DIR = path.join(__dirname, '..', 'public', 'generated-pins', 'campaign')
const AFFILIATE_LINK = 'https://amzn.to/4gIP345'

const UNSPlASH_IMAGES = [
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1000&h=1500&fit=crop',
]

const VARIANT_THEMES = [
  { name: 'classic', colors: ['#1a3a2a', '#f59e0b'], badge: 'TOP PICK', subtitle: 'Keto Coffee Guide 2026' },
  { name: 'dark', colors: ['#0f0f0f', '#dc2626'], badge: 'HOT', subtitle: 'Must Read Before Buying' },
  { name: 'natural', colors: ['#2d5016', '#84cc16'], badge: 'NATURAL', subtitle: '100% Real Ingredients' },
  { name: 'premium', colors: ['#1e1b4b', '#7c3aed'], badge: 'BEST SELLER', subtitle: '#1 Rated on Amazon' },
  { name: 'warm', colors: ['#7c2d12', '#ea580c'], badge: 'TRENDING', subtitle: 'What Everyone Is Talking About' },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function getArticles() {
  return fs.readdirSync(ARTICLES_DIR).filter(f => f.startsWith('post-') && f.endsWith('.html')).sort()
}

function extractTitle(html, filename) {
  const m = html.match(/<h2[^>]*>([^<]+)<\/h2>/)
  return m ? m[1].trim() : filename.replace(/\.html$/, '').replace(/post-\d+-/g, '').replace(/[-_]/g, ' ')
}

function getPinHtml(title, variant, imgIdx, articleIdx) {
  const shortTitle = title.length > 60 ? title.substring(0, 57) + '...' : title
  const img = UNSPlASH_IMAGES[imgIdx % UNSPlASH_IMAGES.length]
  const bg = variant.colors[0]
  const accent = variant.colors[1]
  const imgIdxForUrl = (articleIdx * 5 + imgIdx) % UNSPlASH_IMAGES.length
  const imageUrl = UNSPlASH_IMAGES[imgIdxForUrl]

  return `<!DOCTYPE html>
<html><head><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:1000px;height:1500px;font-family:Georgia,'Times New Roman',serif;}
.pin{width:100%;height:100%;position:relative;overflow:hidden;background:${bg};}
.bg{position:absolute;width:100%;height:72%;top:0;left:0;}
.bg img{width:100%;height:100%;object-fit:cover;}
.ov{position:absolute;width:100%;height:72%;top:0;left:0;background:linear-gradient(180deg,rgba(0,0,0,0.2)0%,rgba(0,0,0,0.6)100%);}
.grad{position:absolute;bottom:0;width:100%;height:50%;background:linear-gradient(180deg,transparent 0%,${bg} 100%);}
.ct{position:absolute;bottom:0;width:100%;padding:40px 35px 30px;text-align:center;}
.logo{font-size:11px;text-transform:uppercase;letter-spacing:3px;color:${accent};margin-bottom:12px;font-weight:700;font-family:Arial,sans-serif;}
.t{font-size:34px;font-weight:700;line-height:1.25;color:#fff;margin-bottom:10px;text-shadow:0 2px 8px rgba(0,0,0,0.3);}
.sub{font-size:18px;color:rgba(255,255,255,0.75);font-weight:400;margin-bottom:18px;}
.cta{display:inline-block;background:${accent};color:#fff;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:700;font-family:Arial,sans-serif;text-decoration:none;box-shadow:0 4px 15px rgba(0,0,0,0.3);}
.badge{position:absolute;top:20px;right:20px;background:${accent};color:#fff;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;font-family:Arial,sans-serif;letter-spacing:0.5px;}
</style></head><body>
<div class="pin">
<div class="bg"><img src="${imageUrl}"/></div>
<div class="ov"></div><div class="grad"></div>
<div class="badge">${variant.badge}</div>
<div class="ct">
<div class="logo">Keto Life Review</div>
<div class="t">${shortTitle}</div>
<div class="sub">${variant.subtitle}</div>
<span class="cta">Check Price on Amazon &#8594;</span>
</div></div></body></html>`
}

async function generatePins() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║        MULTI-VARIANT PIN ENGINE v2                     ║')
  console.log('║  5 designs × 9 articles = 45 unique pins              ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log('')

  if (!fs.existsSync(PINS_DIR)) fs.mkdirSync(PINS_DIR, { recursive: true })
  if (!fs.existsSync(CAMPAIGN_DIR)) fs.mkdirSync(CAMPAIGN_DIR, { recursive: true })

  const files = getArticles()
  const totalPins = files.length * VARIANT_THEMES.length
  console.log(`Articles: ${files.length} | Variants per article: ${VARIANT_THEMES.length} | Total pins: ${totalPins}`)
  console.log('')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } })

  const allPins = []
  let count = 0

  for (let ai = 0; ai < files.length; ai++) {
    const html = fs.readFileSync(path.join(ARTICLES_DIR, files[ai]), 'utf-8')
    const title = extractTitle(html, files[ai])
    const articlePins = []
    const articleDir = path.join(PINS_DIR, `article-${String(ai + 1).padStart(2, '0')}`)
    if (!fs.existsSync(articleDir)) fs.mkdirSync(articleDir, { recursive: true })

    for (let vi = 0; vi < VARIANT_THEMES.length; vi++) {
      const variant = VARIANT_THEMES[vi]
      const pinHtml = getPinHtml(title, variant, vi, ai)
      const outputPath = path.join(articleDir, `${variant.name}.png`)

      await page.setContent(pinHtml, { waitUntil: 'networkidle', timeout: 15000 })
      await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width: 1000, height: 1500 } })

      count++
      const pct = (count / totalPins * 100).toFixed(0)
      process.stdout.write(`\r  [${count}/${totalPins}] ${pct}% - ${title.substring(0, 40)}... [${variant.name}]`)

      articlePins.push({
        variant: variant.name,
        path: outputPath,
        title: title.substring(0, 100),
        description: `${title} - ${variant.subtitle}. Get the best keto coffee deals on Amazon with free shipping!`,
        link: AFFILIATE_LINK,
      })
    }

    // Generate campaign JSON for this article
    const campaignJson = {
      article: title,
      file: files[ai],
      pins: articlePins,
      schedule: {
        monday: articlePins[0],
        tuesday: articlePins[1],
        wednesday: articlePins[2],
        thursday: articlePins[3],
        friday: articlePins[4],
      },
    }
    fs.writeFileSync(path.join(articleDir, 'campaign.json'), JSON.stringify(campaignJson, null, 2))
    process.stdout.write(` ✓`)
    console.log('')
  }

  await browser.close()

  // Generate master campaign file
  const masterCampaign = {
    generated: new Date().toISOString(),
    totalArticles: files.length,
    totalPins: totalPins,
    variants: VARIANT_THEMES.map(v => v.name),
    articles: files.map((f, i) => ({
      file: f,
      title: extractTitle(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8'), f),
      dir: path.join(PINS_DIR, `article-${String(i + 1).padStart(2, '0')}`),
      pins: path.join(PINS_DIR, `article-${String(i + 1).padStart(2, '0')}`, 'campaign.json'),
    })),
  }
  fs.writeFileSync(path.join(CAMPAIGN_DIR, 'master-campaign.json'), JSON.stringify(masterCampaign, null, 2))

  console.log('')
  console.log(`╔══════════════════════════════════════════════════════════╗`)
  console.log(`║  DONE! ${totalPins} pins generated                     ║`)
  console.log(`║  Location: ${PINS_DIR}        ║`)
  console.log(`║  Campaign: ${CAMPAIGN_DIR}     ║`)
  console.log(`╚══════════════════════════════════════════════════════════╝`)
  console.log('')

  return masterCampaign
}

async function main() {
  const campaign = await generatePins()

  console.log('What now?')
  console.log('1 - Publish all 45 pins to Pinterest via browser')
  console.log('2 - Just save the pins (manual upload)')
  console.log('3 - View campaign summary')

  const ans = await ask('Choose (1, 2, or 3): ')

  if (ans === '1') {
    console.log('Publishing via browser... (coming soon: batch Pinterest publisher)')
    console.log(`For now, upload pins manually from: ${PINS_DIR}`)
  } else if (ans === '3') {
    campaign.articles.forEach(a => {
      console.log(`\n${a.title}`)
      console.log(`  Pins: ${a.dir}`)
      console.log(`  Schedule: Mon-Fri, 1 pin/day`)
    })
  } else {
    console.log(`Pins saved. Upload to Pinterest from: ${PINS_DIR}`)
  }
}

function ask(q) {
  return new Promise(resolve => {
    const i = readline.createInterface({ input: process.stdin, output: process.stdout })
    i.question(q, a => { i.close(); resolve(a) })
  })
}

main().catch(console.error)
