import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const SHORTS_DIR = path.join(BASE_DIR, 'pro-shorts')
const SESSION_DIR = path.join(BASE_DIR, 'yt-session')

const VIDEOS = [
  { file: 'article-01\\shorts-classic.mp4',
    title: 'Best Keto Coffee for Weight Loss - 30 Day Test Results',
    desc: 'We tested the best keto coffee for 30 days! See our results.\n\nGet the #1 keto coffee here: https://amzn.to/4hcHEKn\n\n#keto #weightloss #ketocoffee' },
  { file: 'article-02\\shorts-classic.mp4',
    title: 'Where to Buy Keto Coffee Online - Best Price',
    desc: 'Find the best keto coffee deals online. Save up to 50%!\n\nGet the best price here: https://amzn.to/4hcHEKn\n\n#ketocoffee #deals #amazon' },
  { file: 'article-03\\shorts-classic.mp4',
    title: 'Keto Coffee Side Effects - What to Expect',
    desc: 'Keto coffee side effects explained. What to expect and how to avoid them.\n\nTry keto coffee: https://amzn.to/4hcHEKn\n\n#keto #sides #health' },
  { file: 'article-04\\shorts-classic.mp4',
    title: 'Keto Coffee for Women - Complete Weight Loss Guide',
    desc: 'Keto coffee works differently for women. Here is the complete guide.\n\nRead more: https://keto-life-review-eta.vercel.app\n\n#women #keto #weightloss' },
  { file: 'article-05\\shorts-classic.mp4',
    title: 'Keto Coffee for Beginners - Everything You Need',
    desc: 'New to keto coffee? Here is everything you need to know to get started.\n\nGet started: https://amzn.to/4hcHEKn\n\n#ketobeginner #howto #keto' },
  { file: 'article-06\\shorts-classic.mp4',
    title: 'Keto Coffee vs Regular Coffee - Which Is Better?',
    desc: 'Keto coffee vs regular coffee for weight loss. Science-backed comparison.\n\nTry keto coffee: https://amzn.to/4hcHEKn\n\n#keto #vs #coffee' },
  { file: 'article-07\\shorts-classic.mp4',
    title: '3 Easy Keto Coffee Recipes You Can Make at Home',
    desc: 'Learn 3 easy keto coffee recipes. Takes less than 2 minutes each!\n\nGet keto coffee: https://amzn.to/4hcHEKn\n\n#ketorecipes #easy #coffee' },
  { file: 'article-08\\shorts-classic.mp4',
    title: 'Does Keto Coffee Really Work? The Science',
    desc: 'Does keto coffee work? The science behind MCT oil and fat burning.\n\nRead the research: https://keto-life-review-eta.vercel.app\n\n#keto #science #research' },
  { file: 'article-09\\shorts-classic.mp4',
    title: 'Keto Coffee Discount Codes - Save Up to 50%',
    desc: 'Get keto coffee at half price! Active coupon codes inside.\n\nClaim discount: https://amzn.to/4hcHEKn\n\n#discount #coupon #ketocoffee #sale' },
]

async function uploadVideo(browser, page, video) {
  const videoPath = path.join(SHORTS_DIR, video.file)
  if (!fs.existsSync(videoPath)) {
    console.log(`  ✗ File not found: ${videoPath}`)
    return false
  }

  console.log(`\n  Uploading: ${video.title}...`)

  // Go directly to upload page
  await page.goto('https://studio.youtube.com/video/upload', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(4000)

  // Check if we're on upload page
  const url = page.url()
  if (url.includes('accounts.google.com') || url.includes('signin')) {
    console.log('  ⚠ Not logged in. Please login in the browser window.')
    await page.waitForURL('**/studio.youtube.com/**', { timeout: 120000 })
    await page.waitForTimeout(3000)
  }

  // Find file input
  const fileInput = page.locator('input[type="file"]').first()
  if (await fileInput.isVisible().catch(() => false)) {
    await fileInput.setInputFiles(videoPath)
  } else {
    // Click upload button to trigger file dialog
    const uploadArea = page.locator('#select-files-button, #upload-prompt, [aria-label="Select files"]').first()
    await uploadArea.click().catch(() => {})
    await page.waitForTimeout(2000)

    const fileChooser = await page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null)
    if (!fileChooser) {
      console.log('  ✗ Could not find file input')
      return false
    }
    await fileChooser.setFiles(videoPath)
  }
  console.log('  File selected, waiting for processing...')
  await page.waitForTimeout(8000)

  // Wait for title field to appear
  const titleInput = page.locator('#title-textarea, [aria-label*="title"], [aria-label*="Title"]').first()
  await titleInput.waitFor({ timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(2000)

  // Fill title
  await titleInput.click()
  await titleInput.fill('')
  await page.waitForTimeout(300)
  await titleInput.fill(video.title)
  console.log('  Title filled')

  // Fill description
  const descInput = page.locator('#description-textarea, [aria-label*="description"], [aria-label*="Description"]').first()
  await descInput.click()
  await descInput.fill(video.desc)
  console.log('  Description filled')

  // Click "Not made for kids"
  const notKids = page.locator('[name="NOT_MADE_FOR_KIDS"], [aria-label*="not for kids"], label:has-text("not for kids")').first()
  await notKids.click().catch(() => {
    page.locator('tp-yt-paper-radio-button:has-text("No")').first().click().catch(() => {})
  })
  await page.waitForTimeout(1000)

  // Click Next buttons
  for (let step = 0; step < 3; step++) {
    const nextBtn = page.locator('#next-button, button:has-text("Next"), ytcp-button:has-text("Next")').first()
    await nextBtn.click().catch(() => {})
    await page.waitForTimeout(2000)
  }

  // Set Public
  const publicBtn = page.locator('[name="PUBLIC"], [aria-label*="Public"], label:has-text("Public")').first()
  await publicBtn.click().catch(() => {
    page.locator('tp-yt-paper-radio-button:has-text("Public")').first().click().catch(() => {})
  })
  await page.waitForTimeout(1000)

  // Publish
  const publishBtn = page.locator('#done-button, button:has-text("Publish"), button:has-text("Upload"), ytcp-button:has-text("Publish")').first()
  await publishBtn.click().catch(() => {})
  console.log('  ✓ Published!')
  await page.waitForTimeout(5000)
  return true
}

async function main() {
  console.log('=== YouTube Shorts Uploader v2 ===')
  console.log('Browser will open. If not logged in, login to YouTube in the window.\n')

  fs.mkdirSync(SESSION_DIR, { recursive: true })

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1366, height: 768 },
    args: ['--no-sandbox'],
  })

  const pages = browser.pages()
  const page = pages[0] || await browser.newPage()

  // First upload
  let success = 0
  for (let i = 0; i < VIDEOS.length; i++) {
    console.log(`\n[${i + 1}/${VIDEOS.length}]`)
    const ok = await uploadVideo(browser, page, VIDEOS[i])
    if (ok) success++
  }

  console.log(`\n=== Done! ${success}/${VIDEOS.length} uploaded ===`)
  await browser.close()
}

main().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
