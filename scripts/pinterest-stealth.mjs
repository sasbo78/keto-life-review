import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PIN_IMG = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\generated-pins\\article-01\\classic.png'

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  })
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await ctx.newPage()

  await page.goto('https://www.pinterest.com/login/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  await page.fill('input[type="email"]', process.env.PINTEREST_EMAIL)
  await page.waitForTimeout(500)
  await page.fill('input[type="password"]', process.env.PINTEREST_PASSWORD)
  await page.waitForTimeout(500)

  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ])
  await page.waitForTimeout(5000)

  const url = page.url()
  console.log('URL after login:', url)

  if (url.includes('login')) {
    console.log('Login failed - CAPTCHA or wrong credentials')
    await page.screenshot({ path: path.join(BASE_DIR, 'login-failed.png') })
  } else {
    console.log('Login SUCCESS!')
    await page.screenshot({ path: path.join(BASE_DIR, 'login-success.png') })

    await page.goto('https://www.pinterest.com/pin-builder/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(5000)

    await page.screenshot({ path: path.join(BASE_DIR, 'pin-builder.png'), fullPage: true })

    const fileInput = await page.$('input[type="file"]')
    if (fileInput) {
      console.log('File input found, uploading...')
      await fileInput.setInputFiles(PIN_IMG)
      await page.waitForTimeout(3000)
      await page.screenshot({ path: path.join(BASE_DIR, 'after-upload.png'), fullPage: true })

      const html = await page.content()
      fs.writeFileSync(path.join(BASE_DIR, 'pin-builder-html.txt'), html)
    }
  }

  await browser.close()
}

main()
