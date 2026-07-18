import * as fs from 'fs'
import * as path from 'path'
import { chromium } from 'playwright'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'pro-pins')
const ARTICLES_DIR = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\src\\data\\articles'

// 23 verified working Unsplash HD images (tested with HEAD request)
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1559898312-eb45f5aa80fa?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1526512340740-9217d0159da9?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1541185934-01b600ea069c?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1000&h=1500&fit=crop',
  'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=1000&h=1500&fit=crop',
]

const LAYOUTS = [
  { name: 'hero',    font: 'Georgia, "Times New Roman", serif',               btn: 'pill' },
  { name: 'split',   font: 'Arial, Helvetica, sans-serif',                    btn: 'rect' },
  { name: 'side',    font: '"Trebuchet MS", Arial, sans-serif',               btn: 'outline' },
  { name: 'minimal', font: 'Georgia, "Times New Roman", serif',               btn: 'shadow' },
  { name: 'bold',    font: '"Arial Black", Impact, sans-serif',               btn: 'gradient' },
]

const THEMES = [
  { bg: '#1a3a2a', accent: '#f59e0b', badge: 'TOP PICK' },
  { bg: '#0f0f0f', accent: '#dc2626', badge: 'HOT' },
  { bg: '#2d5016', accent: '#84cc16', badge: 'NATURAL' },
  { bg: '#1e1b4b', accent: '#7c3aed', badge: 'BEST SELLER' },
  { bg: '#7c2d12', accent: '#ea580c', badge: 'TRENDING' },
  { bg: '#0c4a6e', accent: '#06b6d4', badge: 'NEW' },
  { bg: '#4a044e', accent: '#d946ef', badge: 'MUST READ' },
  { bg: '#422006', accent: '#eab308', badge: 'LIMITED' },
  { bg: '#022c22', accent: '#10b981', badge: 'TOP RATED' },
]

const SUBTITLES = [
  'Keto Coffee Guide 2026', 'Must Read Before Buying',
  '100% Real Ingredients', '#1 Rated on Amazon',
  'What Everyone Is Talking About', 'Results May Surprise You',
  'Read This First', 'Limited Time Offer', 'Verified by Experts',
]

function extractTitle(html, filename) {
  const m = html.match(/<h2>([^<]+)<\/h2>/)
  return m ? m[1].trim() : filename.replace(/\.html$/, '').replace(/post-\d+-/g, '').replace(/[-_]/g, ' ')
}

function truncate(s, n) { return s.length > n ? s.substring(0, n-3) + '...' : s }

function generatePin(title, layout, themeIdx, imgUrl, subtitle) {
  const t = THEMES[themeIdx % THEMES.length]
  const st = subtitle || SUBTITLES[themeIdx % SUBTITLES.length]
  const shortTitle = truncate(title, 50)
  const longTitle = truncate(title, 75)

  const btnStyles = {
    pill:    `background:${t.accent};color:#fff;padding:15px 40px;border-radius:50px;font-weight:700;font-size:16px;box-shadow:0 4px 20px rgba(0,0,0,0.3);`,
    rect:    `background:${t.accent};color:#fff;padding:15px 40px;border-radius:8px;font-weight:700;font-size:16px;`,
    outline: `background:transparent;color:#fff;padding:14px 38px;border-radius:10px;border:2.5px solid ${t.accent};font-weight:700;font-size:16px;`,
    shadow:  `background:${t.accent};color:#fff;padding:15px 40px;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 8px 30px ${t.accent}55;`,
    gradient:`background:linear-gradient(135deg, ${t.accent}, ${t.accent}cc);color:#fff;padding:15px 40px;border-radius:10px;font-weight:700;font-size:16px;box-shadow:0 4px 20px ${t.accent}33;`,
  }
  const btn = `<a style="display:inline-block;text-decoration:none;cursor:pointer;${btnStyles[layout.btn] || btnStyles.pill}">Check Price on Amazon →</a>`
  const logo = `<div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:${t.accent};font-weight:700;margin-bottom:10px;">KETO LIFE REVIEW</div>`
  const badge = `<div style="position:absolute;top:20px;right:20px;background:${t.accent};color:#fff;padding:7px 16px;border-radius:6px;font-size:11px;font-weight:700;z-index:10;">${t.badge}</div>`
  const subEl = `<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:18px;">${st}</div>`
  const onerr = "this.style.display='none'"

  let body = ''
  switch (layout.name) {
    case 'hero':
      body = `
<div style="position:absolute;width:100%;height:75%;top:0;overflow:hidden;">
  <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="${onerr}"/>
  <div style="position:absolute;top:0;width:100%;height:100%;background:linear-gradient(180deg,rgba(0,0,0,0.15)0%,rgba(0,0,0,0.7)100%)"></div>
</div>
${badge}
<div style="position:absolute;bottom:0;width:100%;padding:50px 40px 40px;text-align:center;">
  ${logo}
  <div style="font-size:36px;font-weight:700;line-height:1.25;color:#fff;margin-bottom:8px;text-shadow:0 2px 10px rgba(0,0,0,0.4);">${shortTitle}</div>
  <div style="font-size:17px;color:rgba(255,255,255,0.75);margin-bottom:18px;">${st}</div>
  ${btn}
</div>`
      break
    case 'split':
      body = `
<div style="position:absolute;top:0;width:100%;height:58%;overflow:hidden;">
  <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="${onerr}"/>
  <div style="position:absolute;top:0;width:100%;height:100%;background:linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.4))"></div>
</div>
<div style="position:absolute;bottom:0;width:100%;height:42%;background:${t.bg};padding:30px 35px;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;">
  ${badge}${logo}
  <div style="font-size:30px;font-weight:700;line-height:1.3;color:#fff;margin:8px 0;">${longTitle}</div>
  <div style="font-size:15px;color:rgba(255,255,255,0.75);margin-bottom:14px;">${st}</div>
  ${btn}
</div>`
      break
    case 'side':
      body = `
<div style="position:absolute;left:0;top:0;width:50%;height:100%;overflow:hidden;">
  <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="${onerr}"/>
  <div style="position:absolute;top:0;width:100%;height:100%;background:linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.3))"></div>
</div>
<div style="position:absolute;right:0;top:0;width:50%;height:100%;background:${t.bg};padding:40px 28px;display:flex;flex-direction:column;justify-content:center;">
  ${badge}${logo}
  <div style="font-size:27px;font-weight:700;line-height:1.3;color:#fff;margin:10px 0;">${longTitle}</div>
  <div style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:16px;">${st}</div>
  ${btn}
</div>`
      break
    case 'minimal':
      body = `
<div style="position:absolute;width:100%;height:100%;background:linear-gradient(145deg,${t.bg},#000);">
  <div style="position:absolute;width:100%;height:100%;opacity:0.06;filter:blur(2px);background-image:url(${imgUrl});background-size:cover;background-position:center;"></div>
</div>
<div style="position:absolute;top:30px;left:35px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:${t.accent};font-weight:700;">KETO LIFE REVIEW</div>
${badge}
<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:75%;z-index:5;">
  <div style="width:150px;height:150px;border-radius:50%;margin:0 auto 22px;overflow:hidden;border:4px solid ${t.accent};box-shadow:0 10px 40px rgba(0,0,0,0.5);">
    <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="${onerr}"/>
  </div>
  <div style="font-size:34px;font-weight:700;line-height:1.2;color:#fff;margin-bottom:8px;">${shortTitle}</div>
  <div style="font-size:16px;color:rgba(255,255,255,0.75);margin-bottom:18px;">${st}</div>
  ${btn}
</div>`
      break
    case 'bold':
      body = `
<div style="position:absolute;width:100%;height:100%;background:${t.bg};">
  <div style="position:absolute;right:-80px;top:-80px;width:400px;height:400px;border-radius:50%;opacity:0.12;background:${t.accent};"></div>
  <div style="position:absolute;left:-100px;bottom:180px;width:350px;height:350px;border-radius:50%;opacity:0.08;background:${t.accent};"></div>
</div>
<div style="position:absolute;top:25px;left:30px;right:30px;display:flex;justify-content:space-between;align-items:flex-start;z-index:5;">
  <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${t.accent};font-weight:700;line-height:1.4;">KETO LIFE<br>REVIEW</div>
  <span style="background:${t.accent};color:#fff;padding:5px 14px;border-radius:4px;font-size:11px;font-weight:700;">${t.badge}</span>
</div>
<div style="position:absolute;top:100px;left:0;width:100%;height:320px;overflow:hidden;z-index:2;">
  <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;clip-path:polygon(0 0,100% 0,100% 100%,0 85%);" onerror="${onerr}"/>
</div>
<div style="position:absolute;bottom:50px;left:35px;right:35px;z-index:5;">
  <div style="font-size:42px;font-weight:900;line-height:1.1;color:#fff;text-transform:uppercase;margin-bottom:8px;letter-spacing:-0.5px;text-shadow:0 2px 15px rgba(0,0,0,0.3);">${shortTitle}</div>
  <div style="font-size:15px;color:${t.accent};font-weight:700;margin-bottom:16px;letter-spacing:1px;">${st.toUpperCase()}</div>
  ${btn}
</div>`
      break
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:1000px;height:1500px;font-family:${layout.font};}
.pin{width:100%;height:100%;position:relative;overflow:hidden;background:${t.bg};}
</style></head><body><div class="pin">${body}</div></body></html>`
}

async function main() {
  console.log('\n  ╔═══════════════════════════════════════════════╗')
  console.log('  ║     PROFESSIONAL PIN GENERATOR v4            ║')
  console.log('  ║  45 unique · 5 layouts · verified HD images ║')
  console.log('  ╚═══════════════════════════════════════════════╝\n')

  fs.mkdirSync(PINS_DIR, { recursive: true })
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.startsWith('post-') && f.endsWith('.html')).sort()

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } })

  let total = 0, all = files.length * LAYOUTS.length

  for (let ai = 0; ai < files.length; ai++) {
    const html = fs.readFileSync(path.join(ARTICLES_DIR, files[ai]), 'utf-8')
    const title = extractTitle(html, files[ai])
    const articleDir = path.join(PINS_DIR, `article-${String(ai + 1).padStart(2, '0')}`)
    fs.mkdirSync(articleDir, { recursive: true })

    console.log(`  [${ai+1}/${files.length}] ${title.substring(0, 55)}`)

    for (let li = 0; li < LAYOUTS.length; li++) {
      const imgIdx = (ai * LAYOUTS.length + li) % BG_IMAGES.length
      const colorIdx = ai + li
      const pinHtml = generatePin(title, LAYOUTS[li], colorIdx, BG_IMAGES[imgIdx], SUBTITLES[(ai + li) % SUBTITLES.length])
      const out = path.join(articleDir, `${LAYOUTS[li].name}.png`)

      await page.setContent(pinHtml, { waitUntil: 'networkidle', timeout: 20000 })
      await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1000, height: 1500 } })
      total++
      process.stdout.write(`    [${total}/${all}] ${((total/all)*100).toFixed(0)}% - ${LAYOUTS[li].name}\n`)
    }
  }

  await browser.close()
  console.log(`\n  ╔═══════════════════════════════════════════════╗`)
  console.log(`  ║  DONE! ${total} pins ✓                       ║`)
  console.log(`  ╚═══════════════════════════════════════════════╝\n`)
}

main().catch(console.error)
