import * as fs from 'fs'
import * as path from 'path'
import { chromium } from 'playwright'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'generated-pins')
const COOKIE_FILE = path.join(BASE_DIR, 'pinterest-cookies.json')

const BOARD_URL = 'https://fr.pinterest.com/ketocoachreview/keto-coffee-reviews/'

const ARTICLE_TITLES = {
  'article-01': 'Best Keto Coffee for Weight Loss: Our 30-Day Test Results',
  'article-02': 'Where to Buy Keto Coffee Online — Best Price & Deals',
  'article-03': 'Keto Coffee Side Effects: What to Expect and How to Avoid',
  'article-04': 'Keto Coffee for Women: The Complete Weight Loss Guide',
  'article-05': 'Keto Coffee for Beginners: Everything You Need to Know',
  'article-06': 'Keto Coffee vs Regular Coffee: Which Is Better for Weight Loss?',
  'article-07': 'How to Make the Perfect Cup of Keto Coffee: 3 Easy Recipes',
  'article-08': 'Does Keto Coffee Really Work? The Science Behind the Hype',
  'article-09': 'Keto Coffee Discount & Coupon Codes — Save Up to 50%',
}

async function login(page) {
  console.log('Logging in...')
  await page.goto('https://www.pinterest.com/login/')
  await page.fill('input[type="email"]', process.env.PINTEREST_EMAIL || '')
  await page.fill('input[type="password"]', process.env.PINTEREST_PASSWORD || '')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(5000)
  await page.screenshot({ path: path.join(BASE_DIR, 'login-result.png') })
  console.log('Login done, saved screenshot')
}

async function createPin(page, imagePath, title, link, boardUrl) {
  console.log(`Creating pin: ${title}`)

  await page.goto('https://www.pinterest.com/pin-builder/')
  await page.waitForTimeout(3000)

  const fileInput = await page.$('input[type="file"]')
  if (fileInput) {
    await fileInput.setInputFiles(imagePath)
    await page.waitForTimeout(3000)
  }

  const titleInput = await page.$('textarea[placeholder*="title"], div[contenteditable="true"]')
  if (titleInput) {
    await titleInput.fill(title)
  }

  const linkInput = await page.$('input[placeholder*="link"], input[type="url"]')
  if (linkInput) {
    await linkInput.fill(link)
  }

  await page.waitForTimeout(2000)

  const publishBtn = await page.$('button:has-text("Publish"), button:has-text("Save")')
  if (publishBtn) {
    await publishBtn.click()
    await page.waitForTimeout(3000)
    console.log(`  ✓ Published: ${title}`)
    return true
  }

  console.log(`  ✗ Could not find publish button for: ${title}`)
  return false
}

async function main() {
  console.log('=== Pinterest Pin Publisher (Playwright) ===')
  console.log('PINS_DIR:', PINS_DIR)

  const articles = fs.readdirSync(PINS_DIR)
    .filter(d => d.startsWith('article-'))
    .sort()

  console.log('Found articles:', articles)
  const allPins = []

  for (const article of articles) {
    const articleDir = path.join(PINS_DIR, article)
    const designs = ['classic.png', 'dark.png', 'natural.png', 'premium.png', 'warm.png']
    const articleNum = article.replace('article-', '')
    const titleKey = article
    const titleBase = ARTICLE_TITLES[titleKey] || `Keto Coffee Review #${articleNum}`

    for (const design of designs) {
      const imgPath = path.join(articleDir, design)
      if (!fs.existsSync(imgPath)) continue
      allPins.push({
        imagePath: imgPath,
        title: `${titleBase} — ${design.replace('.png', '').toUpperCase()} Design`,
        link: `https://keto-life-review-eta.vercel.app/blog/post-${articleNum.padStart(2, '0')}-${titleBase.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        article: article,
        design: design,
      })
    }
  }

  console.log(`Total pins to publish: ${allPins.length}`)

  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await login(page)

    let published = 0
    for (const pin of allPins) {
      const ok = await createPin(page, pin.imagePath, pin.title, pin.link, BOARD_URL)
      if (ok) published++
    }

    console.log(`\nDone! Published ${published}/${allPins.length} pins`)
    await page.screenshot({ path: path.join(BASE_DIR, 'final-result.png') })
  } catch (err) {
    console.error('Error:', err.message)
    await page.screenshot({ path: path.join(BASE_DIR, 'error-result.png') })
  }

  await browser.close()
}

main()
