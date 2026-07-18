import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const VIDEO_PATH = path.join(BASE_DIR, 'pro-shorts-v2', 'article-01', 'shorts.mp4')

const TITLE = 'Best Keto Coffee for Weight Loss - 30 Day Test Results'
const DESC = `We tested the best keto coffee for 30 days! See our results.

Get the #1 keto coffee here: https://amzn.to/4hcHEKn

#keto #weightloss #ketocoffee`

async function main() {
  console.log('=== YouTube Upload Test (1 video) ===\n')
  console.log(`Video: ${VIDEO_PATH}`)
  console.log(`Title: ${TITLE}\n`)

  if (!fs.existsSync(VIDEO_PATH)) {
    console.log('✗ Video file not found!')
    process.exit(1)
  }

  const SESSION_DIR = path.join(BASE_DIR, 'yt-session-' + Date.now())
  fs.mkdirSync(SESSION_DIR, { recursive: true })

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1366, height: 768 },
    args: ['--no-sandbox'],
  })

  const page = browser.pages()[0]

  // Go to YouTube upload page directly
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(3000)

  // Check if login is needed
  const url = page.url()
  if (url.includes('accounts.google.com') || url.includes('signin')) {
    console.log('⚠ Not signed in.')
    console.log('Please sign in with your Google account in the browser window.')
    console.log('After signing in, press Enter in this terminal...\n')

    await new Promise(resolve => process.stdin.once('data', resolve))
    console.log('Proceeding...')

    // Navigate to upload page again after login
    await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(3000)
  }

  console.log('Current page:', page.url())

  // Look for file input
  const fileInput = page.locator('input[type="file"]').first()
  const hasInput = await fileInput.isVisible({ timeout: 3000 }).catch(() => false)

  if (hasInput) {
    await fileInput.setInputFiles(VIDEO_PATH)
    console.log('✓ File selected via input')
  } else {
    // Try clicking the upload button
    console.log('Looking for upload button...')
    try {
      await page.locator('#select-files-button, [aria-label="Select files"], #upload-prompt').first().click({ timeout: 5000 }).catch(() => {})
      await page.waitForTimeout(2000)
      const fc = await page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null)
      if (fc) {
        await fc.setFiles(VIDEO_PATH)
        console.log('✓ File selected via file chooser')
      } else {
        console.log('✗ Could not select file')
        console.log('Please select the file manually in the browser:')
        console.log(VIDEO_PATH)
        await new Promise(resolve => process.stdin.once('data', resolve))
      }
    } catch (e) {
      console.log('✗ Error:', e.message)
    }
  }

  console.log('\nWaiting for upload processing (this may take a minute)...')
  await page.waitForTimeout(15000)

  // Take screenshot of current state
  await page.screenshot({ path: path.join(BASE_DIR, 'yt-upload-state.png') })
  console.log('Screenshot saved to yt-upload-state.png')

  console.log('\n✓ Video file sent! The browser is still open.')
  console.log('You can now fill title/description and publish manually.')
  console.log('Or press Enter and I can try to fill them automatically...')

  await new Promise(resolve => process.stdin.once('data', resolve))

  // Try to fill title
  try {
    const titleInput = page.locator('#title-textarea').first()
    await titleInput.waitFor({ timeout: 10000 }).catch(() => {})
    if (await titleInput.isVisible().catch(() => false)) {
      await titleInput.click()
      await titleInput.fill('')
      await page.waitForTimeout(500)
      await titleInput.fill(TITLE)
      console.log('✓ Title filled automatically')
    }
  } catch (e) {
    console.log('Could not fill title automatically')
  }

  // Try to fill description
  try {
    const descInput = page.locator('#description-textarea').first()
    if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await descInput.click()
      await descInput.fill(DESC)
      console.log('✓ Description filled automatically')
    }
  } catch (e) {}

  console.log('\nBrowser stays open. Complete the upload manually if needed.')
  console.log('Press Ctrl+C when done.')

  await new Promise(() => {})
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
