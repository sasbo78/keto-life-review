import { EdgeTTS } from 'edge-tts-universal'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'pro-pins')
const OUT_DIR = path.join(BASE_DIR, 'pro-shorts-hd', 'test')
const FFMPEG = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffmpeg.exe'
const FONT = 'C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf'
fs.mkdirSync(OUT_DIR, { recursive: true })

function esc(t) { return t.replace(/'/g, "'\\\\''").replace(/:/g, '\\:').replace(/%/g, '\\\\%').replace(/\[/g, '\\[').replace(/\]/g, '\\]') }

// Test 1: Hook scene
console.log('Test 1: Hook scene...')
try {
  execSync(`"${FFMPEG}" -f lavfi -i "color=c=#1a1a2e:s=1080x1920:d=3:r=30" -filter_complex "[0:v]drawtext=text='We tested keto coffee for 30 days':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=800:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='${FONT}':enable='gte(t,0.3)',drawtext=text='Clara Bridge':fontsize=20:fontcolor=white@0.4:x=540-text_w/2:y=300:fontfile='${FONT}'" -c:v libx264 -b:v 6M -preset fast -crf 20 -y "${path.join(OUT_DIR, 'hook.mp4')}"`, { stdio: 'pipe', timeout: 60000 })
  console.log('  ✓ Hook OK')
} catch (e) { console.log('  ✗', e.stderr.toString().slice(0, 200)) }

// Test 2: Content scene with image + drawbox + drawtext
console.log('Test 2: Content scene...')
const imgPath = path.join(PINS_DIR, 'article-01', 'hero.png')
const txt = 'Struggling to lose weight?'
try {
  execSync(`"${FFMPEG}" -loop 1 -i "${imgPath}" -filter_complex "[0:v]format=yuv420p,scale=1280:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(1.0+0.06*on/150,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30,colorchannelmixer=rr=1.08:rg=0.03:rb=0.02:gb=0.95,drawbox=x=0:y=0:w=1080:h=1920:c=black@0.20:t=fill,drawbox=x=0:y=1300:w=1080:h=620:c=black@0.50:t=fill:enable='gte(t,0.5)',drawtext=text='${esc(txt)}':fontsize=44:fontcolor=white:x=(w-text_w)/2:y=1360:fontfile='${FONT}':enable='between(t,0.5,4.5)',drawtext=text='●  ○  ○  ○':fontsize=18:fontcolor=white@0.5:x=(w-text_w)/2:y=1860:fontfile='${FONT}'" -c:v libx264 -b:v 6M -t 5 -preset fast -crf 20 -y "${path.join(OUT_DIR, 'scene.mp4')}"`, { stdio: 'pipe', timeout: 120000 })
  console.log('  ✓ Scene OK')
} catch (e) { console.log('  ✗', e.stderr.toString().slice(0, 300)) }

// Test 3: Full pipeline with TTS
console.log('\nTest 3: Full pipeline with TTS...')
try {
  const tts = new EdgeTTS('We tested the best keto coffee for 30 days. The results are incredible.', 'en-US-JennyNeural', { rate: '+10%' })
  const r = await tts.synthesize()
  const buf = Buffer.from(await r.audio.arrayBuffer())
  console.log(`  ✓ TTS: ${buf.length} bytes, ${r.subtitle?.length || 0} words`)
  console.log('  Sample words:', JSON.stringify((r.subtitle || []).slice(0, 3)))
  fs.writeFileSync(path.join(OUT_DIR, 'voice.mp3'), buf)
} catch (e) { console.log('  ✗', e.message) }

console.log('\nDone! Check:', OUT_DIR)
