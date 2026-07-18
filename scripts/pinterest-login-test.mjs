import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'

async function main() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  page.on('response', r => console.log('→', r.status(), r.url().slice(0, 80)))

  await page.goto('https://www.pinterest.com/login/')
  await page.waitForTimeout(3000)

  await page.screenshot({ path: path.join(BASE_DIR, 'step1-login-page.png') })

  const title = await page.title()
  console.log('Page title:', title)
  console.log('URL:', page.url())

  const emailInput = await page.$('input[type="email"]')
  const passInput = await page.$('input[type="password"]')
  console.log('Email input found:', !!emailInput)
  console.log('Pass input found:', !!passInput)

  if (emailInput && passInput) {
    await emailInput.fill(process.env.PINTEREST_EMAIL)
    await passInput.fill(process.env.PINTEREST_PASSWORD)
    const submitBtn = await page.$('button[type="submit"]')
    if (submitBtn) {
      await submitBtn.click()
      console.log('Clicked submit')
      await page.waitForTimeout(15000)
      console.log('After login URL:', page.url())
      await page.screenshot({ path: path.join(BASE_DIR, 'step2-after-login.png') })

      const buttons = await page.$$eval('button', els => els.map(e => e.textContent.trim()).filter(t => t))
      fs.writeFileSync(path.join(BASE_DIR, 'after-login-buttons.txt'), buttons.slice(0, 20).join('\n'))
    }
  }

  await browser.close()
}

main()
