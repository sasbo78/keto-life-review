import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const VIDEO_PATH = path.join(BASE_DIR, 'pro-shorts-v2', 'article-01', 'shorts.mp4')
const SESSION_DIR = path.join(BASE_DIR, 'yt-session')
const TITLE = 'Best Keto Coffee for Weight Loss - 30 Day Test Results'
const DESC = `We tested the best keto coffee for 30 days! See our results.\n\nGet the #1 keto coffee: https://amzn.to/4hcHEKn\n\n#keto #weightloss #ketocoffee`

async function main() {
  console.log('=== YouTube Upload (Simple Mode) ===\n')
  console.log('Browser opens. Please SIGN IN to YouTube.')
  console.log('After that, I will upload the video.\n')

  fs.mkdirSync(SESSION_DIR, { recursive: true })

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1366, height: 768 },
    args: ['--no-sandbox'],
  })

  const page = browser.pages()[0]

  // Go to YouTube
  await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded' })
  console.log('\n✅ YouTube opened in your Chrome.')
  console.log('⚠ If not signed in:')
  console.log('   1. Click "Sign in" at top-right')
  console.log('   2. Login with your Google account')
  console.log('   3. Come back here and press Enter')
  console.log('⚠ If ALREADY signed in:')
  console.log('   Just press Enter now\n')

  await new Promise(resolve => process.stdin.once('data', resolve))

  // Go to upload
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(4000)
  console.log('Page URL:', page.url())

  // If still on login, wait for user
  if (page.url().includes('accounts.google.com')) {
    console.log('Still on sign-in page. Login in the browser window, then press Enter again...')
    await new Promise(resolve => process.stdin.once('data', resolve))
    await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded' }).catch(() => {})
    await page.waitForTimeout(4000)
  }

  // Try file selection
  console.log('\nSelecting video file...')
  try {
    await page.locator('input[type="file"]').first().setInputFiles(VIDEO_PATH)
    console.log('✅ File selected!')
  } catch {
    console.log('Clicking upload button...')
    try {
      await page.locator('#select-files-button').first().click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const fc = await page.waitForEvent('filechooser', { timeout: 8000 })
      await fc.setFiles(VIDEO_PATH)
      console.log('✅ File selected!')
    } catch (e) {
      console.log('❌ Auto-select failed. Please do it manually:')
      console.log('  1. In the Chrome window, click "Select files"')
      console.log('  2. Choose this file:')
      console.log(`     ${VIDEO_PATH}`)
      console.log('  3. Press Enter when done')
      await new Promise(resolve => process.stdin.once('data', resolve))
    }
  }

  console.log('\nWaiting for video processing (up to 60 seconds)...')
  await page.waitForTimeout(30000)

  // Fill title
  try {
    const ti = page.locator('#title-textarea').first()
    await ti.waitFor({ timeout: 20000 }).catch(() => {})
    if (await ti.isVisible().catch(() => false)) {
      await ti.click()
      await ti.fill('')
      await page.waitForTimeout(300)
      await ti.fill(TITLE)
      console.log('✅ Title filled')
    }
  } catch {}

  // Fill description
  try {
    const di = page.locator('#description-textarea').first()
    if (await di.isVisible({ timeout: 2000 }).catch(() => false)) {
      await di.click()
      await di.fill('')
      await page.waitForTimeout(200)
      await di.fill(DESC)
      console.log('✅ Description filled')
    }
  } catch {}

  await page.screenshot({ path: path.join(BASE_DIR, 'yt-upload.png') })
  console.log('✅ Screenshot saved')

  console.log('\n=== Video is ready. Now you can: ===')
  console.log('1. Set "Not made for kids" → No')
  console.log('2. Click Next → Next → Next')
  console.log('3. Set visibility → Public')
  console.log('4. Click Publish 🎉')

  console.log('\nOr press Enter and I can try to automate these steps...')
  await new Promise(resolve => process.stdin.once('data', resolve))

  try {
    const notKids = page.locator('[name="NOT_MADE_FOR_KIDS"]').first()
    if (await notKids.isVisible({ timeout: 2000 }).catch(() => false)) await notKids.click()
  } catch {}

  for (let step = 0; step < 3; step++) {
    try {
      await page.locator('#next-button').first().click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(1500)
    } catch {}
  }

  try {
    await page.locator('[name="PUBLIC"]').first().click({ timeout: 2000 }).catch(() => {})
    await page.waitForTimeout(500)
  } catch {}

  try {
    await page.locator('#done-button').first().click({ timeout: 3000 }).catch(() => {})
    console.log('✅ Published!')
  } catch {
    console.log('Manual publish needed')
  }

  console.log('\nBrowser stays open. Ctrl+C to exit.')
  await new Promise(() => {})
}

main().catch(err => console.error('Error:', err.message))
