import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const SHORTS_DIR = path.join(BASE_DIR, 'pro-shorts')

const VIDEOS = [
  { file: 'article-01\\shorts-classic.mp4', title: 'Best Keto Coffee for Weight Loss - 30 Day Test Results', desc: 'We tested the best keto coffee for 30 days! See our results.\n\nGet the #1 keto coffee here: https://amzn.to/4hcHEKn\n\n#keto #weightloss #ketocoffee' },
  { file: 'article-02\\shorts-classic.mp4', title: 'Where to Buy Keto Coffee Online - Best Price', desc: 'Find the best keto coffee deals online! Save up to 50%.\n\nGet the best price here: https://amzn.to/4hcHEKn\n\n#ketocoffee #deals #amazon' },
  { file: 'article-03\\shorts-classic.mp4', title: 'Keto Coffee Side Effects - What to Expect', desc: 'Keto coffee side effects explained. How to avoid them.\n\nTry keto coffee: https://amzn.to/4hcHEKn\n\n#keto #sides #health' },
  { file: 'article-04\\shorts-classic.mp4', title: 'Keto Coffee for Women - Complete Weight Loss Guide', desc: 'Keto coffee works differently for women. Complete guide.\n\nRead more: https://keto-life-review-eta.vercel.app\n\n#women #keto #weightloss' },
  { file: 'article-05\\shorts-classic.mp4', title: 'Keto Coffee for Beginners - Everything You Need', desc: 'New to keto coffee? Everything you need to know.\n\nGet started: https://amzn.to/4hcHEKn\n\n#ketobeginner #howto #keto' },
  { file: 'article-06\\shorts-classic.mp4', title: 'Keto Coffee vs Regular Coffee - Which Is Better?', desc: 'Keto coffee vs regular coffee for weight loss. Science-backed.\n\nTry keto coffee: https://amzn.to/4hcHEKn\n\n#keto #vs #coffee' },
  { file: 'article-07\\shorts-classic.mp4', title: '3 Easy Keto Coffee Recipes You Can Make at Home', desc: '3 easy keto coffee recipes. Takes less than 2 minutes each!\n\nGet keto coffee: https://amzn.to/4hcHEKn\n\n#ketorecipes #easy #coffee' },
  { file: 'article-08\\shorts-classic.mp4', title: 'Does Keto Coffee Really Work? The Science', desc: 'Does keto coffee work? Science behind MCT oil and fat burning.\n\nRead more: https://keto-life-review-eta.vercel.app\n\n#keto #science #research' },
  { file: 'article-09\\shorts-classic.mp4', title: 'Keto Coffee Discount Codes - Save Up to 50%', desc: 'Get keto coffee at half price! Active coupon codes.\n\nClaim discount: https://amzn.to/4hcHEKn\n\n#discount #coupon #ketocoffee #sale' },
]

async function main() {
  console.log('=== YouTube Shorts Uploader v3 ===\n')
  console.log('Step 1: Browser opens. GO TO youtube.com and SIGN IN manually.')
  console.log('Step 2: After signing in, PRESS ENTER here to continue upload.\n')

  const SESSION_DIR = path.join(BASE_DIR, 'yt-session-' + Date.now())
  fs.mkdirSync(SESSION_DIR, { recursive: true })

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1366, height: 768 },
    args: ['--no-sandbox'],
  })

  const page = browser.pages()[0]

  // Go to YouTube main page - user signs in here
  await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded' })
  console.log('YouTube opened. Sign in with your Google account, create channel.')
  console.log('After you see your channel page, press Enter in this terminal...\n')

  // Wait for user to press Enter
  await new Promise(resolve => {
    process.stdin.once('data', resolve)
  })

  console.log('\nProceeding to upload...')

  // Navigate to upload
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(3000)

  // Check if still on login page
  if (page.url().includes('accounts.google.com')) {
    console.log('Still on login page. Sign in, then press Enter again...')
    await new Promise(resolve => process.stdin.once('data', resolve))
    await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(3000)
  }

  const url = page.url()
  console.log('Current URL:', url)

  // Upload each video
  let success = 0
  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i]
    const videoPath = path.join(SHORTS_DIR, video.file)
    if (!fs.existsSync(videoPath)) {
      console.log(`\n[${i+1}/${VIDEOS.length}] ✗ File missing: ${videoPath}`)
      continue
    }

    console.log(`\n[${i+1}/${VIDEOS.length}] Uploading: ${video.title}`)

    // If not on upload page, go there
    if (!page.url().includes('upload')) {
      await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'networkidle' }).catch(() => {})
      await page.waitForTimeout(3000)
    }

    // Find file input
    try {
      const fileInput = page.locator('input[type="file"]').first()
      if (await fileInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await fileInput.setInputFiles(videoPath)
      } else {
        // Try clicking the upload area
        await page.locator('#select-files-button, #upload-prompt, [aria-label="Select files"]').first().click({ timeout: 5000 }).catch(() => {})
        await page.waitForTimeout(2000)
        const fc = await page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null)
        if (fc) { await fc.setFiles(videoPath) }
        else { await page.locator('input[type="file"]').first().setInputFiles(videoPath).catch(() => {}) }
      }
    } catch (e) {
      console.log(`  ✗ File selection error: ${e.message}`)
      continue
    }

    console.log('  File selected, waiting...')
    await page.waitForTimeout(5000)

    // Wait for processing
    await page.waitForSelector('#title-textarea', { timeout: 120000 }).catch(() => {})
    await page.waitForTimeout(2000)

    // Fill title
    try {
      const titleInput = page.locator('#title-textarea').first()
      await titleInput.click()
      await titleInput.fill('')
      await page.waitForTimeout(300)
      await titleInput.fill(video.title)
      console.log('  ✓ Title filled')
    } catch (e) {
      console.log(`  ✗ Title error: ${e.message}`)
      console.log('  ⚠ Press Enter after fixing the title manually...')
      await new Promise(resolve => process.stdin.once('data', resolve))
    }

    // Fill description
    try {
      const descInput = page.locator('#description-textarea').first()
      await descInput.click()
      await descInput.fill(video.desc)
      console.log('  ✓ Description filled')
    } catch (e) {
      console.log(`  ✗ Description error: ${e.message}`)
    }

    // Not made for kids
    try {
      await page.locator('[name="NOT_MADE_FOR_KIDS"], tp-yt-paper-radio-button:has-text("No, it")').first().click({ timeout: 5000 }).catch(() => {})
    } catch {}

    // Click Next 3 times
    for (let step = 0; step < 3; step++) {
      try {
        await page.locator('#next-button').first().click({ timeout: 5000 }).catch(() => {})
        await page.waitForTimeout(2000)
      } catch {}
    }

    // Set Public
    try {
      await page.locator('[name="PUBLIC"], tp-yt-paper-radio-button:has-text("Public")').first().click({ timeout: 5000 }).catch(() => {})
      await page.waitForTimeout(1000)
    } catch {}

    // Publish
    try {
      await page.locator('#done-button').first().click({ timeout: 5000 }).catch(() => {})
      console.log('  ✓ Published!')
      success++
    } catch (e) {
      console.log(`  ✗ Publish error: ${e.message}`)
      console.log('  ⚠ Press Enter after publishing manually...')
      await new Promise(resolve => process.stdin.once('data', resolve))
      success++
    }

    await page.waitForTimeout(3000)
  }

  console.log(`\n=== Done! ${success}/${VIDEOS.length} uploaded ===`)
  await browser.close()
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
