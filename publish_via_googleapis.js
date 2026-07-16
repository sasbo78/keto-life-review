const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const BLOG_ID = process.env.BLOG_ID || '623286056482006475'
const TOKEN_PATH = path.join(__dirname, 'blogger-tokens.json')

const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))

const oauth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET)
oauth.setCredentials(tokens)

const blogger = google.blogger({ version: 'v3', auth: oauth })

const postsDir = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'

const posts = [
  { file: 'post-01-best-keto-coffee-for-weight-loss--our-30-day-test-.html', title: 'Best Keto Coffee for Weight Loss: Our 30-Day Test Results Revealed (2025)' },
  { file: 'post-02-where-to-buy-keto-coffee-online--best-price-and-di.html', title: 'Where to Buy Keto Coffee Online: Best Price and Discount Guide (2025)' },
  { file: 'post-03-keto-coffee-side-effects-what-to-expect-and-how-to.html', title: 'Keto Coffee Side Effects: What to Expect and How to Minimize Them' },
  { file: 'post-04-keto-coffee-for-women-the-complete-weight-loss-gui.html', title: 'Keto Coffee for Women: The Complete Weight Loss Guide' },
  { file: 'post-05-keto-coffee-for-beginners-everything-you-need-to-k.html', title: 'Keto Coffee for Beginners: Everything You Need to Know to Start' },
  { file: 'post-06-keto-coffee-vs-regular-coffee-which-is-better-for-.html', title: 'Keto Coffee vs Regular Coffee: Which Is Better for Weight Loss?' },
  { file: 'post-07-how-to-make-the-perfect-cup-of-keto-coffee-3-easy-.html', title: 'How to Make the Perfect Cup of Keto Coffee: 3 Easy Recipes' },
  { file: 'post-08-does-keto-coffee-really-work-the-science-behind-th.html', title: 'Does Keto Coffee Really Work? The Science Behind the Hype' },
  { file: 'post-09-keto-coffee-discount-and-coupon-codes--save-up-to-.html', title: 'Keto Coffee Discount and Coupon Codes: Save Up to 40% (2025)' }
]

async function main() {
  for (const post of posts) {
    const filePath = path.join(postsDir, post.file)
    const content = fs.readFileSync(filePath, 'utf-8')

    try {
      const res = await blogger.posts.insert({
        blogId: BLOG_ID,
        requestBody: {
          title: post.title,
          content: content,
          labels: ['keto', 'coffee', 'weight loss', 'review'],
        },
        isDraft: false,
      })

      console.log(`✓ Published: ${post.title} → ${res.data.url}`)
    } catch (err) {
      console.log(`✗ Failed: ${post.title} - ${err.message}`)
      if (err.response) {
        console.log(`  Status: ${err.response.status}`)
        console.log(`  Body: ${JSON.stringify(err.response.data)}`)
      }
    }

    await new Promise(r => setTimeout(r, 2000))
  }
}

main()
