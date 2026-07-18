import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'

async function main() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://www.pinterest.com/login/')
  await page.fill('input[type="email"]', process.env.PINTEREST_EMAIL)
  await page.fill('input[type="password"]', process.env.PINTEREST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(10000)

  await page.goto('https://www.pinterest.com/pin-builder/')
  await page.waitForTimeout(10000)

  const buttons = await page.$$eval('button', els => els.map(e => e.textContent.trim()).filter(t => t))
  fs.writeFileSync(path.join(BASE_DIR, 'buttons.txt'), buttons.join('\n'))

  const inputs = await page.$$eval('input, textarea, [contenteditable]', els =>
    els.map(e => `${e.tagName} type=${e.type} placeholder="${e.placeholder}" class="${e.className?.slice(0,60)}"`))
  fs.writeFileSync(path.join(BASE_DIR, 'inputs.txt'), inputs.join('\n'))

  const title = await page.title()
  const url = page.url()
  fs.writeFileSync(path.join(BASE_DIR, 'page-info.txt'), `Title: ${title}\nURL: ${url}`)

  console.log('Done. Check files in', BASE_DIR)
  await browser.close()
}

main()
