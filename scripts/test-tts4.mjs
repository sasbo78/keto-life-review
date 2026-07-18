import { WebSocket } from 'ws'
import * as fs from 'fs'
import * as path from 'path'
import crypto from 'crypto'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const WIN_EPOCH = 11644473600
const SEC_MS_GEC_VERSION = '1-143.0.3650.75'

function uuid() { return crypto.randomUUID().replace(/-/g, '') }
function generateSecMsGec() {
  const now = Math.floor(Date.now() / 1000)
  const rounded = (now + WIN_EPOCH) - ((now + WIN_EPOCH) % 300)
  return crypto.createHash('sha256').update(`${Math.floor(rounded * 10000000)}${TRUSTED_TOKEN}`).digest('hex').toUpperCase()
}

const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}&Sec-MS-GEC=${generateSecMsGec()}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${uuid()}`

console.log('Connecting...')

const result = await new Promise((resolve, reject) => {
  const ws = new WebSocket(url, {
    host: 'speech.platform.bing.com',
    origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
      'Pragma': 'no-cache', 'Cache-Control': 'no-cache',
    },
  })
  const chunks = []
  const metaMsgs = []
  let timeout

  ws.on('open', () => {
    console.log('Connected!')
    timeout = setTimeout(() => resolve({ audio: Buffer.concat(chunks), metaMsgs }), 20000)

    const cfg = JSON.stringify({
      context: { synthesis: { audio: {
        metadataoptions: { sentenceBoundaryEnabled: true, wordBoundaryEnabled: true },
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      } } }
    })
    ws.send(`X-Timestamp:${Date()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${cfg}`)

    const ssml = `X-RequestId:${uuid()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${Date()}Z\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='en-US-JennyNeural'><prosody pitch='+0Hz' rate='+10%' volume='+0%'>Hello, this is a test of the keto coffee voiceover system.</prosody></voice></speak>`
    ws.send(ssml)
  })

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      const raw = Buffer.isBuffer(data) ? data : Buffer.from(data)
      const sep = 'Path:audio\r\n'
      const idx = raw.indexOf(sep)
      if (idx >= 0) chunks.push(raw.subarray(idx + sep.length))
      return
    }
    const msg = data.toString()
    // Check for audio.metadata or WordBoundary
    if (msg.includes('audio.metadata') || msg.includes('WordBoundary')) {
      const jsonStart = msg.indexOf('{')
      if (jsonStart >= 0) {
        metaMsgs.push(msg.slice(jsonStart))
      }
    }
    if (msg.includes('turn.end')) {
      clearTimeout(timeout)
      timeout = setTimeout(() => resolve({ audio: Buffer.concat(chunks), metaMsgs }), 2000)
    }
  })

  ws.on('error', (e) => { clearTimeout(timeout); reject(e) })
  ws.on('close', () => { clearTimeout(timeout); resolve({ audio: Buffer.concat(chunks), metaMsgs }) })
})

console.log(`\nAudio: ${result.audio.length} bytes`)
console.log('Metadata messages:', result.metaMsgs.length)

// Show raw metadata
for (let i = 0; i < Math.min(result.metaMsgs.length, 5); i++) {
  console.log(`\nMeta ${i}: ${result.metaMsgs[i].substring(0, 300)}`)
}

if (result.audio.length > 100) {
  fs.writeFileSync(path.join(BASE_DIR, 'test-tts.mp3'), result.audio)
  console.log('\nAudio saved!')
}
