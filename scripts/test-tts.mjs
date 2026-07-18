import { WebSocket } from 'ws'
import * as fs from 'fs'
import * as path from 'path'
import crypto from 'crypto'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'

function uuid() { return crypto.randomUUID().replace(/-/g, '') }

const voice = 'en-US-JennyNeural'
const TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TOKEN}&ConnectionId=${uuid()}`

console.log('Connecting to Edge TTS...')

const result = await new Promise((resolve, reject) => {
  const ws = new WebSocket(url, {
    host: 'speech.platform.bing.com',
    origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  })
  const chunks = []
  const words = []
  let timeout

  ws.on('open', () => {
    console.log('Connected! Sending config...')
    timeout = setTimeout(() => reject(new Error('timeout')), 15000)
    const cfg = JSON.stringify({
      context: { synthesis: { audio: {
        metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: true },
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      } } }
    })
    ws.send(`X-Timestamp:${Date()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${cfg}`)
    const text = 'Hello, this is a test of the keto coffee voiceover system.'
    const ssml = `X-RequestId:${uuid()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${Date()}Z\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='+0Hz' rate='+10%' volume='+0%'>${text}</prosody></voice></speak>`
    ws.send(ssml)
    console.log('SSML sent')
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
    const js = msg.indexOf('{')
    if (js >= 0) {
      try {
        const m = JSON.parse(msg.slice(js))
        if (m.type === 'WordBoundary') {
          words.push({
            text: m.text,
            offset: (m.offset || 0) / 10000000,
            duration: (m.duration || 0) / 10000000,
          })
        }
        if (m.type === 'turn.end') {
          clearTimeout(timeout)
          resolve({ audio: Buffer.concat(chunks), words })
        }
      } catch (e) { console.log('Parse error:', e.message) }
    }
  })

  ws.on('error', (e) => { clearTimeout(timeout); reject(e) })
  ws.on('close', () => clearTimeout(timeout))
})

console.log(`Audio: ${result.audio.length} bytes, Words: ${result.words.length}`)
console.log('First words:', JSON.stringify(result.words.slice(0, 8), null, 2))

if (result.audio.length > 100) {
  fs.writeFileSync(path.join(BASE_DIR, 'test-tts.mp3'), result.audio)
  console.log('Saved:', path.join(BASE_DIR, 'test-tts.mp3'))
}
