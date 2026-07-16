import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import * as fs from 'fs'
import * as path from 'path'
import nodemailer from 'nodemailer'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const REDIRECT_URI = 'http://localhost:3000/api/gmail/callback'
const TOKEN_PATH = path.join(process.cwd(), 'gmail-tokens.json')
const BLOG_EMAIL = 'contact.bridgehearts.ketoposts2026@blogger.com'
const GMAIL_USER = 'contact.bridgehearts@gmail.com'

export const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send']

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

export function getGmailOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export function getGmailAuthUrl(): string {
  const oauth = getGmailOAuth2Client()
  return oauth.generateAuthUrl({
    access_type: 'offline',
    scope: GMAIL_SCOPES,
    prompt: 'consent',
  })
}

export async function exchangeGmailCode(code: string): Promise<any> {
  const oauth = getGmailOAuth2Client()
  const { tokens } = await oauth.getToken(code)
  saveTokens(tokens)
  return tokens
}

function buildMimeMessage(to: string, subject: string, htmlBody: string): string {
  const boundary = '----=' + Date.now().toString(36)
  const lines = [
    `From: ${GMAIL_USER}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(subject).toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody).toString('base64'),
    '',
    `--${boundary}--`,
  ]
  return lines.join('\r\n')
}

async function sendViaGmailApi(subject: string, htmlBody: string): Promise<boolean> {
  const tokens = loadTokens()
  if (!tokens || !tokens.access_token) return false

  const oauth = getGmailOAuth2Client()
  oauth.setCredentials(tokens)

  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth })
    const raw = buildMimeMessage(BLOG_EMAIL, subject, htmlBody)
    const encoded = Buffer.from(raw).toString('base64url')

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encoded },
    })
    return true
  } catch {
    return false
  }
}

async function sendViaSmtp(subject: string, htmlBody: string): Promise<boolean> {
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  if (!gmailPass) return false

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: GMAIL_USER, pass: gmailPass },
    })

    await transporter.sendMail({
      from: GMAIL_USER,
      to: BLOG_EMAIL,
      subject,
      html: htmlBody,
    })
    return true
  } catch {
    return false
  }
}

export async function sendEmail(subject: string, htmlBody: string): Promise<{ sent: boolean; method: string }> {
  if (await sendViaGmailApi(subject, htmlBody)) {
    return { sent: true, method: 'gmail-api' }
  }
  if (await sendViaSmtp(subject, htmlBody)) {
    return { sent: true, method: 'smtp' }
  }
  return { sent: false, method: 'none' }
}

export async function publishArticlesToBlogger(articlesDir: string): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'))

  for (const file of files) {
    try {
      const filePath = path.join(articlesDir, file)
      const rawHtml = fs.readFileSync(filePath, 'utf-8')

      const titleMatch = rawHtml.match(/<h2[^>]*>([^<]+)<\/h2>/)
      const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.html$/, '').replace(/[-_]/g, ' ')

      const result = await sendEmail(title, rawHtml)
      if (result.sent) {
        success++
      } else {
        failed++
        errors.push(`${file}: No sending method available. Connect Gmail or set GMAIL_APP_PASSWORD.`)
      }
    } catch (err: any) {
      failed++
      errors.push(`${file}: ${err.message}`)
    }
  }

  return { success, failed, errors }
}
