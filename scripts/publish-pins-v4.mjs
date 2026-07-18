import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'generated-pins')

const ARTICLES = [
  { num: '01', title: 'Best Keto Coffee for Weight Loss: Our 30-Day Test Results', slug: 'post-01-best-keto-coffee-for-weight-loss--our-30-day-test-' },
  { num: '02', title: 'Where to Buy Keto Coffee Online — Best Price & Deals', slug: 'post-02-where-to-buy-keto-coffee-online--best-price-and-di' },
  { num: '03', title: 'Keto Coffee Side Effects: What to Expect and How to Avoid', slug: 'post-03-keto-coffee-side-effects-what-to-expect-and-how-to' },
  { num: '04', title: 'Keto Coffee for Women: The Complete Weight Loss Guide', slug: 'post-04-keto-coffee-for-women-the-complete-weight-loss-gui' },
  { num: '05', title: 'Keto Coffee for Beginners: Everything You Need to Know', slug: 'post-05-keto-coffee-for-beginners-everything-you-need-to-k' },
  { num: '06', title: 'Keto Coffee vs Regular Coffee: Which Is Better for Weight Loss?', slug: 'post-06-keto-coffee-vs-regular-coffee-which-is-better-for-' },
  { num: '07', title: 'How to Make the Perfect Cup of Keto Coffee: 3 Easy Recipes', slug: 'post-07-how-to-make-the-perfect-cup-of-keto-coffee-3-easy-' },
  { num: '08', title: 'Does Keto Coffee Really Work? The Science Behind the Hype', slug: 'post-08-does-keto-coffee-really-work-the-science-behind-th' },
  { num: '09', title: 'Keto Coffee Discount & Coupon Codes — Save Up to 50%', slug: 'post-09-keto-coffee-discount-and-coupon-codes--save-up-to-' },
]

const DESIGNS = ['classic', 'dark', 'natural', 'premium', 'warm']

let allPins = []
for (const article of ARTICLES) {
  const articleDir = path.join(PINS_DIR, `article-${article.num}`)
  for (const design of DESIGNS) {
    const imgPath = path.join(articleDir, `${design}.png`)
    if (!fs.existsSync(imgPath)) continue
    allPins.push({
      imagePath: imgPath,
      title: article.title,
      link: `https://keto-life-review-eta.vercel.app/blog/${article.slug}`,
    })
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  })
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await ctx.newPage()

  // Log in
  await page.goto('https://www.pinterest.com/login/')
  await page.fill('input[type="email"]', process.env.PINTEREST_EMAIL)
  await page.fill('input[type="password"]', process.env.PINTEREST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(8000)

  if (page.url().includes('login')) {
    console.log('Login failed')
    await browser.close()
    return
  }

  for (let i = 0; i < allPins.length; i++) {
    const pin = allPins[i]
    console.log(`\n[${i + 1}/${allPins.length}] ${pin.title}`)

    try {
      await page.goto(`https://fr.pinterest.com/ketocoachreview/keto-coffee-reviews/`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(3000)

      // Click the create/fab button
      const createBtn = await page.$('[aria-label*="Create"], [aria-label*="Créer"], [data-test-id="board-fab"], button:has(svg)')
      if (!createBtn) {
        console.log('  ✗ No create button')
        continue
      }
      await createBtn.click()
      await page.waitForTimeout(3000)

      // Upload file
      const fileInput = await page.$('input[type="file"]')
      if (!fileInput) {
        console.log('  ✗ No file input in modal')
        continue
      }
      await fileInput.setInputFiles(pin.imagePath)
      await page.waitForTimeout(3000)

      // Set title
      const titleInput = await page.$('textarea, input[placeholder*="title"], input[placeholder*="Titre"]')
      if (titleInput) {
        await titleInput.fill(pin.title)
      }

      // Set link
      const linkInput = await page.$('input[type="url"], input[placeholder*="link"], input[placeholder*="Lien"]')
      if (linkInput) {
        await linkInput.fill(pin.link)
      }

      await page.waitForTimeout(1000)

      // Click save
      const saveBtn = await page.$('button:has-text("Save"), button:has-text("Publish"), button:has-text("Enregistrer"), button:has-text("Publier"), [data-test-id="save-button"]')
      if (saveBtn) {
        await saveBtn.click()
        await page.waitForTimeout(3000)
        console.log('  ✓ Published')
      } else {
        await page.screenshot({ path: path.join(BASE_DIR, `debug-${i}.png`) })
        console.log('  ✗ No save button')
      }
    } catch (err) {
      console.log(`  ✗ ${err.message}`)
    }
  }

  console.log('\nDone!')
  await browser.close()
}

main()
