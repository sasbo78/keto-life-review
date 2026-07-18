import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'generated-pins')
const COOKIE_FILE = path.join(BASE_DIR, 'pinterest-cookies.json')

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
const BOARD_NAME = 'Keto Coffee Reviews'

async function loginAndSaveCookies(page) {
  console.log('[1/5] Logging in...')
  await page.goto('https://www.pinterest.com/login/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.fill('input[type="email"]', process.env.PINTEREST_EMAIL)
  await page.fill('input[type="password"]', process.env.PINTEREST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(8000)

  if (page.url().includes('login')) {
    console.log('Login failed!')
    return false
  }

  console.log('Login OK - saving cookies')
  const cookies = await page.context().cookies()
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2))
  return true
}

async function publishPin(page, imagePath, title, link, boardName) {
  console.log(`  Uploading: ${title.slice(0, 50)}...`)

  try {
    await page.goto('https://www.pinterest.com/pin-builder/', { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(3000)

    const fileInput = await page.$('input[type="file"]')
    if (!fileInput) {
      console.log('  ✗ No file input found')
      return false
    }

    await fileInput.setInputFiles(imagePath)
    await page.waitForTimeout(3000)

    const saveBtn = await page.$('button[data-test-id="save-button"], button:has-text("Save"), button:has-text("Publish")')
    if (saveBtn) {
      await saveBtn.click()
      await page.waitForTimeout(3000)
      console.log('  ✓ Published!')
      return true
    }

    await page.screenshot({ path: path.join(BASE_DIR, 'pin-builder-state.png') })
    console.log('  ? Button not found, check screenshot')
    return false
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`)
    return false
  }
}

async function main() {
  console.log('=== Pinterest Bulk Pin Publisher ===\n')

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  })
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await ctx.newPage()

  const loggedIn = await loginAndSaveCookies(page)
  if (!loggedIn) {
    await browser.close()
    return
  }

  let allPins = []
  for (const article of ARTICLES) {
    const articleDir = path.join(PINS_DIR, `article-${article.num}`)
    for (const design of DESIGNS) {
      const imgPath = path.join(articleDir, `${design}.png`)
      if (!fs.existsSync(imgPath)) continue
      allPins.push({
        imagePath: imgPath,
        title: `${article.title} — ${design.toUpperCase()} Design`,
        link: `https://keto-life-review-eta.vercel.app/blog/${article.slug}`,
        board: BOARD_NAME,
      })
    }
  }

  console.log(`[2/5] Found ${allPins.length} pins to publish`)

  let published = 0
  let failed = 0

  for (let i = 0; i < allPins.length; i++) {
    const pin = allPins[i]
    console.log(`\n[${i + 1}/${allPins.length}]`)
    const ok = await publishPin(page, pin.imagePath, pin.title, pin.link, pin.board)
    if (ok) published++
    else failed++
  }

  console.log(`\n=== Done: ${published} published, ${failed} failed ===`)
  await browser.close()
}

main()
