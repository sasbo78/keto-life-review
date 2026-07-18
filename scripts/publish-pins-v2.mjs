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

  console.log('[1] Logging in...')
  await page.goto('https://www.pinterest.com/login/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.fill('input[type="email"]', process.env.PINTEREST_EMAIL)
  await page.fill('input[type="password"]', process.env.PINTEREST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(8000)

  if (page.url().includes('login')) {
    console.log('Login failed!')
    await browser.close()
    return
  }
  console.log('Login OK')

  // Build list of all pins
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

  console.log(`[2] ${allPins.length} pins to publish`)
  console.log('[3] Starting...\n')

  for (let i = 0; i < allPins.length; i++) {
    const pin = allPins[i]
    console.log(`[${i + 1}/${allPins.length}] ${pin.title.slice(0, 50)}`)

    try {
      await page.goto('https://www.pinterest.com/pin-builder/', { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(3000)

      // Upload file
      const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 5000 }).catch(() => null)
      if (!fileInput) {
        console.log('  ✗ No file input')
        continue
      }
      await fileInput.setInputFiles(pin.imagePath)
      await page.waitForTimeout(3000)

      // Look for title/description textarea
      const titleArea = await page.waitForSelector('textarea, div[contenteditable="true"]', { timeout: 3000 }).catch(() => null)

      // Look for save button
      let saved = false
      const allButtons = await page.$$('button')
      for (const btn of allButtons) {
        const text = await btn.textContent()
        if (/Save|Publish|Enregistrer|Publier|Terminé/i.test(text)) {
          await btn.click()
          saved = true
          await page.waitForTimeout(2000)
          console.log('  ✓ Clicked:', text.trim())
          break
        }
      }

      if (!saved) {
        // Try data-test-id or aria-label
        const saveBtn = await page.$('[data-test-id="save-button"], [aria-label*="Save"], [aria-label*="sauve"]')
        if (saveBtn) {
          await saveBtn.click()
          await page.waitForTimeout(2000)
          saved = true
          console.log('  ✓ Save button via attr')
        }
      }

      if (!saved) {
        // Take screenshot for debugging
        await page.screenshot({ path: path.join(BASE_DIR, `debug-${i}.png`) })
        console.log('  ✗ No save button found')
      }
    } catch (err) {
      console.log(`  ✗ ${err.message}`)
    }
  }

  console.log('\nDone!')
  await browser.close()
}

main()
