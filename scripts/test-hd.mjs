import { EdgeTTS } from 'edge-tts-universal'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'pro-pins')
const OUT_DIR = path.join(BASE_DIR, 'pro-shorts-hd')
const FFMPEG = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffmpeg.exe'
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe')
const FONT = 'C\\:\\\\Windows\\\\Fonts\\\\arial.ttf'

function esc(t) { return t.replace(/'/g, "'\\\\''").replace(/:/g, '\\:').replace(/%/g, '\\\\%').replace(/\[/g, '\\[').replace(/\]/g, '\\]') }

const article = {
  num: '01', title: 'Best Keto Coffee for Weight Loss',
  hook: 'We tested keto coffee for 30 days.',
  scenes: [
    { text: 'Struggling to lose weight?', img: 'hero' },
    { text: 'This coffee burns fat while you sleep.', img: 'side' },
    { text: 'No cravings, clean energy all day.', img: 'split' },
    { text: '12,000+ verified 5-star reviews.', img: 'bold' },
  ],
  cta: 'Get yours at the link below!',
  script: 'We tested the best keto coffee for 30 days. The results are incredible. This special coffee blend helps you burn fat faster, gives you clean energy, and stops cravings. Our top pick has 12000 verified reviews on Amazon with a 5 star rating. Try it today and see the difference.',
}

const outDir = path.join(OUT_DIR, `article-${article.num}`)
fs.mkdirSync(outDir, { recursive: true })
const tmpDir = path.join(outDir, 'tmp')
fs.mkdirSync(tmpDir, { recursive: true })

console.log('1/5 Generating voiceover...')
const tts = new EdgeTTS(article.script, 'en-US-JennyNeural', { rate: '+10%' })
const result = await tts.synthesize()
const voiceBuf = Buffer.from(await result.audio.arrayBuffer())
fs.writeFileSync(path.join(outDir, 'voice.mp3'), voiceBuf)
const words = result.subtitle || []
const totalMs = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 280000000
console.log(`Voice: ${(totalMs/10000000).toFixed(1)}s, ${words.length} words, ${(voiceBuf.length/1024).toFixed(0)}KB`)

// Show some words with timestamps
for (const w of words.slice(0, 10)) {
  console.log(`  ${w.text}: ${(w.offset/10000000).toFixed(2)}s-${((w.offset+w.duration)/10000000).toFixed(2)}s`)
}

const totalDuration = Math.ceil(Math.max(totalMs / 10000000, 28))
console.log(`Total duration: ${totalDuration}s`)

// Render hook scene only first (quick test)
console.log('\n2/5 Rendering hook scene...')
const hookPath = path.join(tmpDir, 'hook.mp4')
execSync(`"${FFMPEG}" -f lavfi -i "color=c=#1a1a2e:s=1080x1920:d=3:r=30" -filter_complex "[0:v]drawtext=text='${esc(article.hook)}':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=h*0.40:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='${FONT}':enable='gte(t,0.3)',drawbox=x=0:y=0:w=1080:h=1920:c=black@0.3:t=fill" -c:v libx264 -b:v 6M -preset fast -crf 20 -y "${hookPath}"`, { stdio: 'pipe', timeout: 60000 })
const hSize = fs.statSync(hookPath).size
console.log(`Hook scene: ${(hSize/1024).toFixed(0)}KB`)

console.log('\n3/5 Rendering first content scene...')
const imgPath = path.join(PINS_DIR, `article-${article.num}`, 'hero.png')
const scenePath = path.join(tmpDir, 'scene-0.mp4')
const sd = (totalDuration - 3 - 5) / 4 // ~5.5s
const fps = 30; const frames = Math.round(sd * fps)
const zoomPerFrame = 0.06 / frames
const alphaExpr = `if(lt(t,0.3),0,if(lt(t,0.7),(t-0.3)/0.4,if(lt(t,${sd-0.5}),1,1-((t-${sd+0.5})/0.5))))`
const dots = ['●','○','○','○']

execSync(`"${FFMPEG}" -loop 1 -i "${imgPath}" -filter_complex "` +
  `[0:v]format=yuv420p,scale=1280:1920:force_original_aspect_ratio=increase,crop=1080:1920,` +
  `zoompan=z='min(1.0+${zoomPerFrame}*on,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps},` +
  `colorchannelmixer=rr=1.1:rg=0.05:rb=0.02:gb=0.95:bb=0.9,` +
  `drawbox=x=0:y=0:c=black@0.25:t=fill,` +
  `drawbox=x=0:y=h*0.68:w=1080:h=h*0.32:c=black@0.55:t=fill:enable='gte(t,0.2)',` +
  `drawtext=text='${esc(article.scenes[0].text)}':fontsize=44:fontcolor=white:x=(w-text_w)/2:y=h*0.72:fontfile='${FONT}':alpha='${alphaExpr}',` +
  `drawtext=text='${esc(dots.join('  '))}':fontsize=18:fontcolor=white@0.6:x=(w-text_w)/2:y=h*0.96:fontfile='${FONT}'` +
  `" -c:v libx264 -b:v 6M -t ${sd} -preset fast -crf 20 -y "${scenePath}"`, { stdio: 'pipe', timeout: 120000 })
const sSize = fs.statSync(scenePath).size
console.log(`Scene: ${(sSize/1024).toFixed(0)}KB`)

console.log('\nDone! Check output:', outDir)
