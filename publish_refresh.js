const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const BLOG_ID = process.env.BLOG_ID || '623286056482006475'
const TOKEN_PATH = path.join(__dirname, 'blogger-tokens.json')

const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))

async function main() {
  const oauth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET)

  // Set credentials and force refresh
  oauth.setCredentials(tokens)
  oauth.on('tokens', (newTokens) => {
    console.log('Token auto-refreshed!')
    Object.assign(tokens, newTokens)
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
  })

  // Force a token refresh
  try {
    const { credentials } = await oauth.refreshAccessToken()
    console.log('Refresh successful')
  } catch (e) {
    console.log('Refresh failed:', e.message)
  }

  const blogger = google.blogger({ version: 'v3', auth: oauth })

  // Simple test post
  try {
    const res = await blogger.posts.insert({
      blogId: BLOG_ID,
      requestBody: {
        title: 'Hello World - Test',
        content: '<p>This is a test post</p>',
      },
      isDraft: false,
    })
    console.log('✓ Published:', res.data.url)
  } catch (err) {
    console.log('✗ Error:', err.message)
    if (err.response) {
      console.log('Status:', err.response.status)
      console.log('Data:', JSON.stringify(err.response.data, null, 2))
    }
  }
}

main()
