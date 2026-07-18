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

async function uploadVideo(page, video) {
  const videoPath = path.join(SHORTS_DIR, video.file)
  if (!fs.existsSync(videoPath)) {
    console.log(`  ✗ File not found: ${videoPath}`)
    return false
  }

  console.log(`\n  Uploading: ${video.title}`)

  await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // Click CREATE button
  const createBtn = page.locator('#create-icon').or(page.locator('ytcp-button:has-text("Create")')).first()
  await createBtn.click()
  await page.waitForTimeout(2000)

  // Click "Upload videos"
  const uploadBtn = page.locator('text=Upload videos').or(page.locator('ytcp-ve:has-text("Upload videos")')).first()
  await uploadBtn.click()
  await page.waitForTimeout(2000)

  // Select file
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.locator('#select-files-button').or(page.locator('input[type="file"]')).first().click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(videoPath)
  console.log('  File selected, waiting for processing...')
  await page.waitForTimeout(5000)

  // Wait for title field
  await page.waitForSelector('#title-textarea', { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(2000)

  // Fill title
  const titleInput = page.locator('#title-textarea').or(page.locator('[aria-label="Add a title"]')).first()
  await titleInput.click()
  await titleInput.fill('')
  await page.waitForTimeout(500)
  await titleInput.fill(video.title)
  console.log('  Title filled')

  // Fill description
  const descInput = page.locator('#description-textarea').or(page.locator('[aria-label="Tell viewers about your video"]')).first()
  await descInput.click()
  await descInput.fill(video.desc)
  console.log('  Description filled')

  // Set "Not made for kids"
  await page.locator('text=No, it\'s not made for kids').or(page.locator('tp-yt-paper-radio-button:has-text("No")')).first().click()
  await page.waitForTimeout(500)

  // Click NEXT
  for (let step = 0; step < 3; step++) {
    const nextBtn = page.locator('#next-button').or(page.locator('ytcp-button:has-text("Next")')).first()
    await nextBtn.click()
    await page.waitForTimeout(2000)
  }

  // Set visibility to Public
  await page.locator('text=Public').or(page.locator('tp-yt-paper-radio-button:has-text("Public")')).first().click()
  await page.waitForTimeout(1000)

  // Publish
  const publishBtn = page.locator('#done-button').or(page.locator('ytcp-button:has-text("Publish")')).first()
  await publishBtn.click()
  console.log('  ✓ Published!')
  await page.waitForTimeout(5000)
  return true
}

async function main() {
  console.log('=== YouTube Shorts Uploader ===')
  console.log('This will open a browser. Login to YouTube manually when prompted.\n')

  fs.mkdirSync(SESSION_DIR, { recursive: true })

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1366, height: 768 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    args: ['--no-sandbox'],
  })

  const page = await browser.newPage()

  // Check if already logged in
  await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(3000)

  const needsLogin = await page.locator('input[type="email"]').or(page.locator('text=Sign in')).first().isVisible().catch(() => true)

  if (needsLogin) {
    console.log('\n⚠ MANUAL STEP: Sign in to your Google/YouTube account in the browser.')
    console.log('  After signing in, come back here and press Enter...\n')
    await page.waitForTimeout(2000)
    // Wait for user to login
    await page.waitForSelector('yt-icon#create-icon', { timeout: 120000 }).catch(() => {})
    await page.waitForTimeout(2000)
    console.log('✓ Login detected!')
  } else {
    console.log('✓ Already logged in!')
  }

  // Upload each video
  let success = 0
  for (let i = 0; i < VIDEOS.length; i++) {
    console.log(`\n[${i + 1}/${VIDEOS.length}]`)
    const ok = await uploadVideo(page, VIDEOS[i])
    if (ok) success++
  }

  console.log(`\n=== Done! ${success}/${VIDEOS.length} uploaded ===`)
  await browser.close()
}

main().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
