import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const VIDEO_PATH = path.join(BASE_DIR, 'pro-shorts-v2', 'article-01', 'shorts.mp4')
const TITLE = 'Best Keto Coffee for Weight Loss - 30 Day Test Results'
const DESC = `We tested the best keto coffee for 30 days! See our results.\n\nGet the #1 keto coffee: https://amzn.to/4hcHEKn\n\n#keto #weightloss #ketocoffee`

async function main() {
  console.log('=== YouTube CDP Uploader ===\n')

  // Connect to existing Chrome
  console.log('Connecting to Chrome (port 9222)...')
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
  const ctx = browser.contexts()[0]
  const page = ctx.pages()[0] || await ctx.newPage()

  console.log('Connected!')

  // Go to upload page
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(3000)
  console.log('URL:', page.url())

  // Wait for login if needed
  if (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
    console.log('\n⚠ Sign in to YouTube in the Chrome window.')
    console.log('After reaching YouTube Studio, press Enter...')
    await new Promise(resolve => process.stdin.once('data', resolve))
    await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded' }).catch(() => {})
    await page.waitForTimeout(3000)
  }

  // Select file
  console.log('\nSelecting file...')
  try {
    const fi = page.locator('input[type="file"]').first()
    if (await fi.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fi.setInputFiles(VIDEO_PATH)
      console.log('✓ File selected')
    } else {
      await page.locator('#select-files-button').first().click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const fc = await page.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null)
      if (fc) { await fc.setFiles(VIDEO_PATH); console.log('✓ File selected via chooser') }
      else { throw new Error('Could not select file') }
    }
  } catch (e) {
    console.log('✗', e.message)
    console.log('\n⚠ Open the upload dialog in Chrome and select this file manually:')
    console.log('  ' + VIDEO_PATH)
    console.log('Then press Enter...')
    await new Promise(resolve => process.stdin.once('data', resolve))
  }

  console.log('\nWaiting 30s for processing...')
  await page.waitForTimeout(30000)

  // Fill title
  try {
    const ti = page.locator('#title-textarea').first()
    await ti.waitFor({ timeout: 10000 }).catch(() => {})
    if (await ti.isVisible().catch(() => false)) {
      await ti.click()
      await ti.fill('')
      await page.waitForTimeout(300)
      await ti.fill(TITLE)
      console.log('✓ Title filled: ' + TITLE)
    }
  } catch {}

  // Fill description
  try {
    const di = page.locator('#description-textarea').first()
    if (await di.isVisible({ timeout: 2000 }).catch(() => false)) {
      await di.click(); await di.fill(''); await page.waitForTimeout(200); await di.fill(DESC)
      console.log('✓ Description filled')
    }
  } catch {}

  await page.screenshot({ path: path.join(BASE_DIR, 'yt-upload.png'), fullPage: true })
  console.log('\n✓ Screenshot: yt-upload.png')
  console.log('Browser stays open. Fill details & publish, or let me automate more.')
  console.log('Tell me what to do next.')
}

main().catch(err => { console.error('Fatal:', err.message) })
