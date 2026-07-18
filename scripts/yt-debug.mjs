import { chromium } from 'playwright'
import * as fs from 'fs'

const SESSION_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\yt-session'

async function main() {
  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1366, height: 768 },
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle' })
  await page.waitForTimeout(5000)

  await page.screenshot({ path: 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\yt-studio.png', fullPage: true })

  const html = await page.content()
  fs.writeFileSync('C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\yt-studio.html', html)
  console.log('Screenshot + HTML saved')

  await page.waitForTimeout(60000)
  await browser.close()
}

main()
