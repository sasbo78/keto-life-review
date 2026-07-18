import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'
import { spawn } from 'child_process'
import http from 'http'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const VIDEO_PATH = path.join(BASE_DIR, 'pro-shorts-v2', 'article-01', 'shorts.mp4')
const TEMP_PROFILE = path.join(BASE_DIR, 'chrome-yt-profile')
const TITLE = 'Best Keto Coffee for Weight Loss - 30 Day Test Results'
const DESC = `We tested the best keto coffee for 30 days! See our results.\n\nGet the #1 keto coffee: https://amzn.to/4hcHEKn\n\n#keto #weightloss #ketocoffee`

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, r => {
      let d = ''
      r.on('data', c => d += c)
      r.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

async function waitForPort(port, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await httpGet(`http://127.0.0.1:${port}/json/version`)
      return true
    } catch { await new Promise(r => setTimeout(r, 500)) }
  }
  return false
}

async function main() {
  console.log('=== YouTube Upload Auto ===\n')

  // Clean profile
  try { fs.rmSync(TEMP_PROFILE, { recursive: true, force: true }) } catch {}
  fs.mkdirSync(TEMP_PROFILE, { recursive: true })

  // Launch Chrome
  console.log('Launching Chrome...')
  const chrome = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    [
      '--remote-debugging-port=9222',
      `--user-data-dir="${TEMP_PROFILE}"`,
      '--no-first-run',
      '--no-default-browser-check',
    ],
    { detached: true, stdio: 'ignore' }
  )
  chrome.unref()

  if (!await waitForPort(9222, 20000)) {
    console.log('FAIL: Chrome did not start'); process.exit(1)
  }
  console.log('✓ Chrome ready')

  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
  const ctx = browser.contexts()[0]
  const page = ctx.pages()[0] || await ctx.newPage()
  console.log('✓ Connected')

  // Navigate to YouTube Studio
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded' }).catch(() => {})
  await page.waitForTimeout(3000)

  // Poll for login completion
  console.log('\n⚠ Sign in to YouTube in the browser window.')
  console.log('The script will continue automatically once you reach YouTube Studio.\n')
  let loggedIn = false
  for (let i = 0; i < 120; i++) {
    const url = page.url()
    const hasAvatar = await page.locator('#avatar-btn').isVisible().catch(() => false)
    if (hasAvatar || (url.includes('youtube') && !url.includes('accounts.google.com') && !url.includes('signin'))) {
      loggedIn = true
      console.log('✓ Logged in detected!')
      break
    }
    await page.waitForTimeout(5000)
  }

  if (!loggedIn) {
    console.log('Timed out waiting for login.'); process.exit(1)
  }

  // Navigate to upload
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'domcontentloaded' }).catch(() => {})
  await page.waitForTimeout(4000)

  // Select file
  console.log('\nSelecting video...')
  try {
    await page.locator('input[type="file"]').first().setInputFiles(VIDEO_PATH)
    console.log('✓ File selected')
  } catch {
    try {
      await page.locator('#select-files-button, [aria-label="Select files"]').first().click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const fc = await page.waitForEvent('filechooser', { timeout: 8000 })
      await fc.setFiles(VIDEO_PATH)
      console.log('✓ File selected via chooser')
    } catch (e) {
      console.log('❌ Could not select file:', e.message)
      console.log('Please select "' + VIDEO_PATH + '" in browser.')
      for (let i = 0; i < 20; i++) {
        if (await page.locator('#title-textarea').isVisible().catch(() => false)) break
        await page.waitForTimeout(3000)
      }
    }
  }

  console.log('Waiting 30s for processing...')
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
    if (await di.isVisible({ timeout: 3000 }).catch(() => false)) {
      await di.click()
      await di.fill('')
      await page.waitForTimeout(200)
      await di.fill(DESC)
      console.log('✓ Description filled')
    }
  } catch {}

  await page.screenshot({ path: path.join(BASE_DIR, 'yt-upload.png') })
  console.log('✓ Screenshot: yt-upload.png')

  console.log('\n=== Ready! Browser stays open. ===')
  console.log('Set "Not made for kids" → Next → Next → Next → Public → Publish')
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
