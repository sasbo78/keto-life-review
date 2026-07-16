import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import * as fs from 'fs'
import * as path from 'path'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const BLOG_ID = process.env.BLOG_ID || ''
const REDIRECT_URI = 'http://localhost:3000/api/blogger/callback'
const TOKEN_PATH = path.join(process.cwd(), 'blogger-tokens.json')

export const SCOPES = ['https://www.googleapis.com/auth/blogger']

function loadTokens(): any {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const raw = fs.readFileSync(TOKEN_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {}
  return null
}

function saveTokens(tokens: any) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
}

export function getOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export function getAuthUrl(): string {
  const oauth = getOAuth2Client()
  return oauth.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })
}

export async function exchangeCode(code: string): Promise<any> {
  const oauth = getOAuth2Client()
  const { tokens } = await oauth.getToken(code)
  saveTokens(tokens)
  return tokens
}

export async function publishPost(title: string, content: string): Promise<any> {
  const tokens = loadTokens()
  if (!tokens || !tokens.access_token) {
    throw new Error('NOT_AUTHENTICATED')
  }

  const oauth = getOAuth2Client()
  oauth.setCredentials(tokens)

  const blogger = google.blogger({ version: 'v3', auth: oauth })

  const res = await blogger.posts.insert({
    blogId: BLOG_ID,
    requestBody: {
      title,
      content,
      labels: ['review', 'affiliate', 'weight loss'],
    },
    isDraft: false,
  })

  if (res.data.url) {
    const cleanUrl = res.data.url
    tokens.lastPostUrl = cleanUrl
    saveTokens(tokens)
  }

  return res.data
}
