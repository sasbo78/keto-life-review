import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'generated-pins')

const PINS = []
const articles = ['01','02','03','04','05','06','07','08','09']
const designs = ['classic','dark','natural','premium','warm']

for (const a of articles) {
  const articleDir = path.join(PINS_DIR, `article-${a}`)
  for (const d of designs) {
    const imgPath = path.join(articleDir, `${d}.png`)
    if (!fs.existsSync(imgPath)) continue
    PINS.push({ imagePath: imgPath })
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
  await page.waitForTimeout(10000)

  if (page.url().includes('login')) {
    console.log('Login failed')
    await browser.close()
    return
  }
  console.log('Logged in')

  // Go to the board page directly to find board ID
  await page.goto('https://fr.pinterest.com/ketocoachreview/keto-coffee-reviews/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)
  console.log('Board page URL:', page.url())

  // Look for "Create" or "+" button on the board page
  const boardButtons = await page.$$('button, a, [role="button"]')
  for (const btn of boardButtons) {
    const text = (await btn.textContent()) || ''
    if (/create|Créer|plus|add/i.test(text)) {
      console.log('Found button:', text.trim().slice(0, 50))
    }
  }

  // Try clicking the "+" icon in the nav
  const plusBtn = await page.$('[aria-label*="Create"], [aria-label*="Créer"], [data-test-id*="create"]')
  if (plusBtn) {
    console.log('Found create button')
  }

  await page.screenshot({ path: path.join(BASE_DIR, 'board-page.png') })
  console.log('Screenshot saved')

  await browser.close()
}

main()
