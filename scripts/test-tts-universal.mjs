import { EdgeTTS } from 'edge-tts-universal'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'

const tts = new EdgeTTS(
  'Hello, this is a test of the keto coffee voiceover system. It sounds much more natural than before.',
  'en-US-JennyNeural',
  { rate: '+10%' }
)

console.log('Synthesizing...')
const result = await tts.synthesize()
console.log('Audio type:', typeof result.audio)
console.log('Audio size:', result.audio?.byteLength || 0)
console.log('Subtitles:', Object.keys(result.subtitles || {}))
console.log('Word boundaries:', result.wordBoundaries?.length || 'N/A')

if (result.wordBoundaries) {
  for (const wb of result.wordBoundaries.slice(0, 8)) {
    console.log(`  Word: "${wb.text}", offset: ${wb.offset?.toFixed?.(3) || wb.offset}, duration: ${wb.duration?.toFixed?.(3) || wb.duration}`)
  }
}

if (result.audio && (result.audio.byteLength || result.audio.length) > 100) {
  const buf = Buffer.from(result.audio)
  fs.writeFileSync(path.join(BASE_DIR, 'test-tts.mp3'), buf)
  console.log('Audio saved!')
} else {
  console.log('No audio data or too small')
}
