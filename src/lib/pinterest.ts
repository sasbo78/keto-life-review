import * as fs from 'fs'
import * as path from 'path'

const PINTEREST_API = 'https://api.pinterest.com/v5'
const TOKEN_PATH = path.join(process.cwd(), 'pinterest-tokens.json')

function loadTokens(): any {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))
    }
  } catch {}
  return null
}

function saveTokens(tokens: any) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
}

export function getAuthUrl(): string {
  const clientId = process.env.PINTEREST_CLIENT_ID || ''
  const redirectUri = 'http://localhost:3000/api/pinterest/callback'
  const scopes = ['boards:read', 'boards:write', 'pins:read', 'pins:write']
  return `https://www.pinterest.com/oauth/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join(',')}`
}

export async function exchangeCode(code: string): Promise<any> {
  const clientId = process.env.PINTEREST_CLIENT_ID || ''
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET || ''
  const redirectUri = 'http://localhost:3000/api/pinterest/callback'

  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })

  const data = await res.json()
  if (res.ok) saveTokens(data)
  return data
}

export async function refreshToken(): Promise<string | null> {
  const tokens = loadTokens()
  if (!tokens?.refresh_token) return null

  const clientId = process.env.PINTEREST_CLIENT_ID || ''
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET || ''

  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    }),
  })

  const data = await res.json()
  if (res.ok && data.access_token) {
    tokens.access_token = data.access_token
    if (data.refresh_token) tokens.refresh_token = data.refresh_token
    saveTokens(tokens)
    return data.access_token
  }
  return null
}

async function getValidToken(): Promise<string | null> {
  const personalToken = process.env.PINTEREST_CLIENT_SECRET
  if (personalToken && personalToken.startsWith('pina_')) {
    return personalToken
  }
  const tokens = loadTokens()
  return tokens?.access_token || null
}

export async function api(path: string, options: any = {}): Promise<any> {
  let token = await getValidToken()
  if (!token) throw new Error('PINTEREST_NOT_AUTHENTICATED')

  const res = await fetch(`${PINTEREST_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    token = await refreshToken()
    if (token) {
      const retryRes = await fetch(`${PINTEREST_API}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      })
      if (retryRes.ok) return retryRes.json()
      const retryData = await retryRes.json()
      throw new Error(retryData.message || 'Pinterest API error')
    }
    throw new Error('PINTEREST_NOT_AUTHENTICATED')
  }

  if (res.ok) {
    if (res.status === 204) return { success: true }
    return res.json()
  }

  const data = await res.json()
  throw new Error(data.message || `Pinterest API error (${res.status})`)
}

export async function getBoards() {
  return api('/boards')
}

export async function createBoard(name: string, description?: string) {
  return api('/boards', {
    method: 'POST',
    body: JSON.stringify({ name, description: description || '' }),
  })
}

export async function createPin(pin: {
  board_id: string
  title: string
  description: string
  link: string
  media_source: { source_type: string; url?: string }
  alt_text?: string
}) {
  return api('/pins', {
    method: 'POST',
    body: JSON.stringify(pin),
  })
}

export async function getPins(boardId?: string) {
  let p = '/pins'
  if (boardId) p += `?board_id=${boardId}`
  return api(p)
}

export async function getAnalytics(startDate?: string, endDate?: string) {
  const sd = startDate || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const ed = endDate || new Date().toISOString().split('T')[0]
  return api(`/user_account/analytics?start_date=${sd}&end_date=${ed}&metric_types=IMPRESSION,CLICK,OUTBOUND_CLICK,PIN_CLICK_RATE,SAVE_RATE`)
}

export async function isConnected(): Promise<boolean> {
  const personalToken = process.env.PINTEREST_CLIENT_SECRET
  if (personalToken && personalToken.startsWith('pina_')) return true
  const tokens = loadTokens()
  return !!(tokens?.access_token)
}
