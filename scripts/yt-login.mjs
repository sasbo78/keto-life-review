import { chromium } from 'playwright'
import * as fs from 'fs'

const SESSION_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\yt-session'

async function main() {
  console.log('=== YouTube Login Helper ===')
  console.log('Browser will open. Please:')
  console.log('1. Sign in with contact.bridgehearts@gmail.com')
  console.log('2. Create your YouTube channel if needed')
  console.log('3. Accept any terms')
  console.log('4. Then close the browser\n')
  console.log('Press Ctrl+C when done.\n')

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1366, height: 768 },
    args: ['--no-sandbox'],
  })

  const page = browser.pages()[0]
  await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded' })

  // Keep browser open until user closes it
  await new Promise(() => {})
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
