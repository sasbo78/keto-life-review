import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'
import { execSync, spawn } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const VIDEO_PATH = path.join(BASE_DIR, 'pro-shorts-v2', 'article-01', 'shorts.mp4')
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER_DATA = 'C:\\Users\\mohel\\AppData\\Local\\Google\\Chrome\\User Data'

const TITLE = 'Best Keto Coffee for Weight Loss - 30 Day Test Results'
const DESC = `We tested the best keto coffee for 30 days! See our results.

Get the #1 keto coffee here: https://amzn.to/4hcHEKn

#keto #weightloss #ketocoffee`

async function main() {
  console.log('=== YouTube Upload via Real Chrome ===\n')

  // Kill any existing Chrome with debug port
  try { execSync('taskkill /F /IM chrome.exe 2>nul', { stdio: 'ignore' }) } catch {}
  await new Promise(r => setTimeout(r, 2000))

  // Launch Chrome with remote debugging
  console.log('Launching Chrome with remote debugging...')
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=9222`,
    `--user-data-dir="${USER_DATA}"`,
    '--no-first-run',
    '--no-default-browser-check',
  ], {
    detached: true,
    stdio: 'ignore',
  })

  console.log('Chrome PID:', chrome.pid)
  await new Promise(r => setTimeout(r, 3000))

  // Connect via CDP
  console.log('Connecting to Chrome...')
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
  const defaultContext = browser.contexts()[0]
  const page = defaultContext.pages()[0] || await defaultContext.newPage()

  // Go to YouTube upload
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {})
  await page.waitForTimeout(3000)

  const url = page.url()
  console.log('Current URL:', url)

  if (url.includes('accounts.google.com') || url.includes('signin')) {
    console.log('\n⚠ Sign in to your Google account in the Chrome window.')
    console.log('After signing in and reaching YouTube Studio, press Enter...')
    await new Promise(resolve => process.stdin.once('data', resolve))
  }

  // Re-navigate to upload
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(3000)

  // Select file
  console.log('\nSelecting video file...')
  try {
    const fileInput = page.locator('input[type="file"]').first()
    if (await fileInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await fileInput.setInputFiles(VIDEO_PATH)
    } else {
      console.log('Clicking upload area...')
      await page.locator('#select-files-button, [aria-label="Select files"]').first().click({ timeout: 4000 }).catch(() => {
        page.evaluate(() => document.querySelector('input[type="file"]')?.click())
      })
      await page.waitForTimeout(1500)
      const fc = await page.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null)
      if (fc) await fc.setFiles(VIDEO_PATH)
      else {
        // Direct fill
        await page.locator('input[type="file"]').first().setInputFiles(VIDEO_PATH).catch(e => {
          console.log('✗ File select failed:', e.message)
          console.log('\n⚠ Please select the file manually in Chrome:')
          console.log(VIDEO_PATH)
          console.log('Then press Enter...')
          return new Promise(resolve => process.stdin.once('data', resolve))
        })
      }
    }
  } catch (e) {
    console.log('✗ Error:', e.message)
  }

  console.log('Waiting for upload processing (30s)...')
  await page.waitForTimeout(30000)

  // Take screenshot
  await page.screenshot({ path: path.join(BASE_DIR, 'yt-upload-state.png'), fullPage: true })
  console.log('Screenshot saved')

  // Try fill title
  try {
    const ti = page.locator('#title-textarea').first()
    await ti.waitFor({ timeout: 8000 }).catch(() => {})
    if (await ti.isVisible().catch(() => false)) {
      await ti.click()
      await ti.fill('')
      await page.waitForTimeout(300)
      await ti.fill(TITLE)
      console.log('✓ Title filled')
    }
  } catch {}

  // Try fill description
  try {
    const di = page.locator('#description-textarea').first()
    if (await di.isVisible({ timeout: 2000 }).catch(() => false)) {
      await di.click()
      await di.fill(DESC)
      console.log('✓ Description filled')
    }
  } catch {}

  console.log('\n✓ Done! Browser stays open.')
  console.log('You can fill remaining fields and publish manually.')
  console.log('Press Ctrl+C when done.')

  await new Promise(() => {})
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
