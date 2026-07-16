import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as readline from 'readline'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const BLOG_ID = '623286056482006475'
const SESSION_DIR = path.join(__dirname, '..', '.browser-session')
const PROGRESS_FILE = path.join(__dirname, '..', 'articles-progress.json')

function rl() {
  return readline.createInterface({ input: process.stdin, output: process.stdout })
}

function ask(q) {
  return new Promise(resolve => {
    const i = rl()
    i.question(q, a => { i.close(); resolve(a) })
  })
}

function getArticles() {
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.startsWith('post-') && f.endsWith('.html'))
    .sort()
}

function getProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'))
  } catch {}
  return { published: [] }
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2))
}

function extractTitle(html, filename) {
  const m = html.match(/<h2[^>]*>([^<]+)<\/h2>/)
  return m ? m[1].trim() : filename.replace(/\.html$/, '').replace(/post-\d+-/g, '').replace(/[-_]/g, ' ')
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function publishAll() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║          Blogger Auto Publisher                         ║')
  console.log('║  Publishes articles one by one via browser             ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log('')

  const articles = getArticles()
  const progress = getProgress()
  const remaining = articles.filter(f => !progress.published.includes(f))

  console.log(`Total: ${articles.length} | Already published: ${progress.published.length} | Remaining: ${remaining.length}`)
  console.log('')

  if (remaining.length === 0) {
    console.log('All articles are published!')
    process.exit(0)
  }

  console.log('Starting your Chrome browser...')
  console.log('')

  const browser = await chromium.launchPersistentContext(SESSION_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    locale: 'en-US',
    args: ['--disable-blink-features=AutomationControlled'],
  })

  const page = await browser.newPage()

  try {
    // Step 1: Go to Blogger posts page
    await page.goto(`https://www.blogger.com/blog/posts/${BLOG_ID}`, { waitUntil: 'networkidle', timeout: 30000 })
    await sleep(2000)

    // Check if we need to log in
    if (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
      console.log('╔══════════════════════════════════════════════════════════╗')
      console.log('║  LOGIN REQUIRED                                       ║')
      console.log('║  Enter your Google email and password in the browser.  ║')
      console.log('║  The script will continue automatically after login.   ║')
      console.log('╚══════════════════════════════════════════════════════════╝')
      console.log('')
      
      await page.waitForURL(url => !url.href.includes('accounts.google.com'), { timeout: 120000 })
      await page.waitForLoadState('networkidle')
      await sleep(3000)
    }

    console.log('Logged in! Checking page...')
    console.log('')

    // Take a screenshot to see the page state
    const screenshotPath = path.join(__dirname, '..', 'blogger-state.png')
    await page.screenshot({ path: screenshotPath })
    console.log(`Screenshot saved: ${screenshotPath}`)
    console.log('')

    for (let i = 0; i < remaining.length; i++) {
      const filename = remaining[i]
      const filePath = path.join(ARTICLES_DIR, filename)
      const html = fs.readFileSync(filePath, 'utf-8')
      const title = extractTitle(html, filename)

      console.log(`[${i + 1}/${remaining.length}] "${title}"`)
      console.log('')

      // Navigate to new post editor
      await page.goto(`https://www.blogger.com/blog/post/edit/${BLOG_ID}`, { waitUntil: 'networkidle', timeout: 20000 })
      await sleep(4000)

      // Take screenshot of editor
      await page.screenshot({ path: path.join(__dirname, '..', `editor-${i}.png`) })

      // Try to find and fill the title
      console.log('  Filling title...')
      await page.keyboard.press('Tab')
      await sleep(500)
      await page.keyboard.type(title, { delay: 15 })
      await sleep(500)

      // Tab to content area multiple times
      for (let t = 0; t < 3; t++) {
        await page.keyboard.press('Tab')
        await sleep(300)
      }

      // Try to paste HTML (Ctrl+V)
      console.log('  Pasting content...')
      
      // Use the clipboard API approach
      await page.evaluate((htmlContent) => {
        return navigator.clipboard.writeText(htmlContent)
      }, html).catch(() => {
        console.log('  Clipboard API failed, trying alternative...')
      })

      await sleep(500)
      
      // Try Ctrl+V
      await page.keyboard.press('Control+v')
      await sleep(1000)

      // Check what's on the page
      console.log('')
      console.log('  ╔══════════════════════════════════════════════════╗')
      console.log('  ║  CHECK THE BROWSER WINDOW                       ║')
      console.log('  ║  Please complete and publish the post manually: ║')
      console.log('  ║  1. Verify the title is correct                 ║')
      console.log('  ║  2. Click Publish (top right)                   ║')
      console.log('  ║  3. Then come back here                         ║')
      console.log('  ╚══════════════════════════════════════════════════╝')
      console.log('')

      const answer = await ask('  Type "done" when published, "skip" to skip, "stop" to stop: ')
      
      if (answer.toLowerCase() === 'done') {
        progress.published.push(filename)
        saveProgress(progress)
        console.log('  ✓ Saved as published!')
      } else if (answer.toLowerCase() === 'stop') {
        console.log('  Stopping.')
        break
      } else {
        console.log('  Skipped.')
      }

      console.log('')
      await sleep(1000)
    }

  } catch (err) {
    console.error(`Error: ${err.message}`)
  } finally {
    console.log('')
    const final = getProgress()
    console.log(`Published: ${final.published.length} / ${articles.length}`)
    
    if (final.published.length < articles.length) {
      console.log(`Remaining: ${articles.filter(f => !final.published.includes(f)).length}`)
      console.log('Run the script again to continue.')
    } else {
      console.log('ALL DONE! https://keto-life-review.blogspot.com')
    }

    console.log('')
    console.log('Close the browser window when ready.')
  }
}

publishAll().catch(console.error)
