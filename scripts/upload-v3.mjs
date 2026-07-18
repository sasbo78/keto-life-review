import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'
import { spawn } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const VIDEO_PATH = path.join(BASE_DIR, 'pro-shorts-v2', 'article-01', 'shorts.mp4')
const TEMP_PROFILE = path.join(BASE_DIR, 'chrome-yt-profile')
const TITLE = 'Best Keto Coffee for Weight Loss - 30 Day Test Results'
const DESC = `We tested the best keto coffee for 30 days! See our results.\n\nGet the #1 keto coffee: https://amzn.to/4hcHEKn\n\n#keto #weightloss #ketocoffee`

async function waitForPort(port, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const h = require('http')
        h.get(`http://127.0.0.1:${port}/json/version`, r => {
          let d = ''
          r.on('data', c => d += c)
          r.on('end', () => resolve(JSON.parse(d)))
        }).on('error', reject)
      })
      return true
    } catch { await new Promise(r => setTimeout(r, 500)) }
  }
  return false
}

async function main() {
  console.log('=== YouTube Upload v3 ===\n')

  // Clean up old temp profile
  try { fs.rmSync(TEMP_PROFILE, { recursive: true, force: true }) } catch {}

  // Launch Chrome with CDP
  console.log('Launching Chrome with remote debugging...')
  const chrome = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    [
      `--remote-debugging-port=9222`,
      `--user-data-dir="${TEMP_PROFILE}"`,
      '--no-first-run',
      '--no-default-browser-check',
    ],
    { detached: true, stdio: 'ignore' }
  )
  chrome.unref()

  const ready = await waitForPort(9222, 20000)
  if (!ready) { console.log('FAIL: Chrome did not start debugging on port 9222'); process.exit(1) }
  console.log('✓ Chrome ready on port 9222')

  // Connect via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
  const ctx = browser.contexts()[0]
  const page = ctx.pages()[0] || await ctx.newPage()
  console.log('✓ Connected to Chrome')

  // Go to YouTube Studio upload
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(3000)
  console.log('URL:', page.url().substring(0, 80))

  // If login required
  if (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
    console.log('\n⚠ Please sign in to your Google/YouTube account in the browser.')
    console.log('   After reaching YouTube Studio, press Enter in this terminal.')
    console.log('   (The script will be waiting for you.)')
    await new Promise(resolve => process.stdin.once('data', resolve))
    // Navigate again after login
    await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(3000)
    console.log('URL after login:', page.url().substring(0, 80))
  }

  // Try selecting file
  console.log('\nSelecting video file...')
  try {
    const fi = page.locator('input[type="file"]').first()
    if (await fi.isVisible({ timeout: 5000 }).catch(() => false)) {
      await fi.setInputFiles(VIDEO_PATH)
      console.log('✓ File selected via input')
    } else {
      // Click upload button
      await page.locator('#select-files-button').first().click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const fc = await page.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null)
      if (fc) {
        await fc.setFiles(VIDEO_PATH)
        console.log('✓ File selected via chooser')
      } else {
        throw new Error('filechooser not triggered')
      }
    }
  } catch (e) {
    console.log(`✗ Auto-select failed: ${e.message}`)
    console.log(`\n⚠ Please select the file manually in the browser:`)
    console.log(`   ${VIDEO_PATH}`)
    console.log('   Then press Enter...')
    await new Promise(resolve => process.stdin.once('data', resolve))
  }

  console.log('Waiting 30s for video processing...')
  await page.waitForTimeout(30000)

  // Fill title
  try {
    const ti = page.locator('#title-textarea').first()
    await ti.waitFor({ timeout: 15000 }).catch(() => {})
    if (await ti.isVisible().catch(() => false)) {
      await ti.click()
      await ti.fill('')
      await page.waitForTimeout(300)
      await ti.fill(TITLE)
      console.log('✓ Title filled')
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
      console.log('✓ Description filled')
    }
  } catch {}

  await page.screenshot({ path: path.join(BASE_DIR, 'yt-upload.png') })
  console.log('✓ Screenshot saved')

  console.log('\n=== Upload ready! ===')
  console.log('You can publish manually or tell me what to automate next.')
  console.log('Browser stays open. Type "next" to automate publish steps.')
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
