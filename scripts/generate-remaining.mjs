import { EdgeTTS } from 'edge-tts-universal'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'pro-pins')
const OUT_DIR = path.join(BASE_DIR, 'pro-shorts-hd')
const FFMPEG = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffmpeg.exe'
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe')
const FONT = 'C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf'

function esc(t) { return t.replace(/'/g, "'\\\\''").replace(/:/g, '\\:').replace(/%/g, '\\\\%').replace(/\[/g, '\\[').replace(/\]/g, '\\]') }
function dur(fp) { try { return parseFloat(execSync(`"${FFPROBE}" -v error -show_entries format=duration -of csv=p=0 "${fp}"`, {stdio:'pipe'}).toString().trim()) || 0 } catch { return 0 } }
const PRESET = 'veryfast'

function genMusic(d, o) {
  const f = `sine=f=261.63:d=${d}:sample_rate=44100 [c];sine=f=329.63:d=${d} [e];sine=f=392:d=${d} [g];[c][e][g]amix=inputs=3:weights=0.5 0.3 0.4:duration=first [mix];[mix]volume=0.06,afade=t=in:d=3,afade=t=out:st=${d-3}:d=3 [out]`
  execSync(`"${FFMPEG}" -filter_complex "${f}" -map "[out]" -y "${o}"`, { stdio: 'pipe', timeout: 30000 })
}

function mixAudio(v, m, d, o) {
  execSync(`"${FFMPEG}" -i "${v}" -i "${m}" -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=0.1[a1];[a0][a1]amix=inputs=2:duration=first:weights=1 0.1[out]" -map "[out]" -t ${d} -y "${o}"`, { stdio: 'pipe', timeout: 30000 })
}

function renderHook(text, d, o, bg = '#1a1a2e') {
  execSync(`"${FFMPEG}" -f lavfi -i "color=c=${bg}:s=1080x1920:d=${d}:r=30" -filter_complex "[0:v]drawtext=text='${esc(text)}':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=800:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='${FONT}':enable='gte(t,0.3)',drawtext=text='Clara Bridge':fontsize=20:fontcolor=white@0.4:x=540-text_w/2:y=300:fontfile='${FONT}'" -c:v libx264 -b:v 4M -preset ${PRESET} -crf 23 -y "${o}"`, { stdio: 'pipe', timeout: 60000 })
}

function renderScene(text, ip, d, o, idx, total) {
  const fps = 30; const frames = Math.round(d * fps)
  const dots = Array(total).fill('○'); dots[idx] = '●'
  const textOn = 0.5; const textOff = d - 0.5
  execSync(`"${FFMPEG}" -loop 1 -i "${ip}" -filter_complex "[0:v]format=yuv420p,scale=1280:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(1.0+0.06*on/${frames},1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps},colorchannelmixer=rr=1.08:rg=0.03:rb=0.02:gb=0.95,drawbox=x=0:y=0:w=1080:h=1920:c=black@0.20:t=fill,drawbox=x=0:y=1300:w=1080:h=620:c=black@0.50:t=fill:enable='gte(t,${textOn})',drawtext=text='${esc(text)}':fontsize=44:fontcolor=white:x=(w-text_w)/2:y=1360:fontfile='${FONT}':enable='between(t,${textOn},${textOff})',drawtext=text='${esc(dots.join('  '))}':fontsize=18:fontcolor=white@0.5:x=(w-text_w)/2:y=1860:fontfile='${FONT}'" -c:v libx264 -b:v 4M -t ${d} -preset ${PRESET} -crf 23 -y "${o}"`, { stdio: 'pipe', timeout: 120000 })
}

const ARTICLES = [
  { num: '07', title: '3 Easy Keto Coffee Recipes',
    hook: 'Perfect keto coffee fast!',
    scenes: [
      { text: 'Classic bulletproof coffee.', img: 'hero' },
      { text: 'Chocolate keto latte.', img: 'side' },
      { text: 'Iced keto coffee for summer.', img: 'split' },
      { text: 'Each takes 2 minutes.', img: 'minimal' },
    ],
    cta: 'Watch the full tutorial!',
    script: 'Learn how to make the perfect keto coffee in 3 easy recipes. Number 1 classic bulletproof coffee. Number 2 chocolate keto latte. Number 3 iced keto coffee. Each takes less than 2 minutes. Watch the tutorial on our blog.' },
  { num: '08', title: 'Does Keto Coffee Really Work?',
    hook: 'Is keto coffee just hype?',
    scenes: [
      { text: 'Science says YES.', img: 'hero' },
      { text: 'MCT boosts ketones by 300%.', img: 'split' },
      { text: 'More fat burning all day.', img: 'side' },
      { text: 'Thousands have transformed.', img: 'bold' },
    ],
    cta: 'Read the science!',
    script: 'Does keto coffee really work or is it just hype? Science says yes. The MCT oil in keto coffee increases ketone production by up to 300 percent. This means more fat burning all day long. Read the science on our website.' },
  { num: '09', title: 'Keto Coffee Discount Codes',
    hook: 'Keto coffee at HALF price!',
    scenes: [
      { text: 'Active coupon codes inside.', img: 'hero' },
      { text: 'Save up to 50% right now.', img: 'split' },
      { text: 'Limited time offer.', img: 'side' },
      { text: 'Free shipping included.', img: 'bold' },
    ],
    cta: 'Get discount before expires!',
    script: 'Get keto coffee at half price. We found active coupon codes that save you up to 50 percent. Limited time offer. The best keto coffee is currently on sale with free shipping. Click the link to get the discount before it expires.' },
]

async function createShort(article) {
  console.log(`\n  ═══ ${article.title}`)
  const outDir = path.join(OUT_DIR, `article-${article.num}`)
  fs.mkdirSync(outDir, { recursive: true })
  const tmp = path.join(outDir, 'tmp')
  fs.mkdirSync(tmp, { recursive: true })

  // Clean up if rerun
  for (const f of ['hook.mp4', 'cta.mp4', 'raw.mp4', 'shorts.mp4']) {
    const fp = path.join(outDir, f); if (fs.existsSync(fp)) fs.unlinkSync(fp)
  }

  console.log('  Voiceover...')
  let words
  try {
    const tts = new EdgeTTS(article.script, 'en-US-JennyNeural', { rate: '+10%' })
    const r = await tts.synthesize()
    const buf = Buffer.from(await r.audio.arrayBuffer())
    if (buf.length < 100) throw new Error('Bad audio')
    fs.writeFileSync(path.join(outDir, 'voice.mp3'), buf)
    words = r.subtitle || []
    const ms = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 0
    console.log(`  ✓ ${(ms/10000000).toFixed(1)}s`)
  } catch (e) { console.log(`  ✗ ${e.message}`); return null }

  const ms = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 280000000
  const totalD = Math.ceil(Math.max(ms / 10000000, 28))
  const n = article.scenes.length
  const hd = 3; const cd = 5
  const sd = (totalD - hd - cd) / n

  console.log('  Music...')
  const mp = path.join(outDir, 'music.wav')
  try { genMusic(totalD, mp); console.log('  ✓') } catch { console.log('  -') }

  console.log('  Rendering...')
  const segs = []

  const hp = path.join(tmp, 'hook.mp4')
  try { renderHook(article.hook, hd, hp); segs.push(hp); console.log('  ✓ Hook') } catch (e) { console.log(`  ✗ Hook: ${e.message}`) }

  for (let i = 0; i < n; i++) {
    const s = article.scenes[i]
    const ip = path.join(PINS_DIR, `article-${article.num}`, `${s.img}.png`)
    if (!fs.existsSync(ip)) { console.log(`  ✗ Missing ${s.img}.png`); continue }
    const d = i === n-1 ? sd + (totalD - hd - n*sd - cd) : sd
    const sp = path.join(tmp, `s${i}.mp4`)
    try { renderScene(s.text, ip, Math.max(d, 3.5), sp, i, n); segs.push(sp); console.log(`  ✓ Scene ${i+1}`) }
    catch (e) { console.log(`  ✗ Scene ${i+1}: ${e.message}`) }
  }

  const cp = path.join(tmp, 'cta.mp4')
  try { renderHook(article.cta + ' ➡', cd, cp, '#0d0d1a'); segs.push(cp); console.log('  ✓ CTA') } catch (e) { console.log(`  ✗ CTA: ${e.message}`) }

  // Concat
  const raw = path.join(tmp, 'raw.mp4')
  const final = path.join(outDir, 'shorts.mp4')
  try {
    const list = path.join(tmp, 'list.txt')
    fs.writeFileSync(list, segs.map(p => `file '${p}'`).join('\n'))
    execSync(`"${FFMPEG}" -f concat -safe 0 -i "${list}" -c:v libx264 -b:v 4M -preset ${PRESET} -crf 23 -pix_fmt yuv420p -y "${raw}"`, { stdio: 'pipe', timeout: 180000 })
  } catch (e) { console.log(`  ✗ Assemble: ${e.message}`); return null }

  // Audio
  const mixed = path.join(tmp, 'mixed.mp3')
  const musicOk = fs.existsSync(mp) && fs.statSync(mp).size > 100
  if (musicOk) try { mixAudio(path.join(outDir, 'voice.mp3'), mp, totalD, mixed) } catch {}
  const hasMixed = fs.existsSync(mixed) && fs.statSync(mixed).size > 100
  const src = hasMixed ? mixed : path.join(outDir, 'voice.mp3')
  execSync(`"${FFMPEG}" -i "${raw}" -i "${src}" -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -y "${final}"`, { stdio: 'pipe', timeout: 60000 })

  console.log(`  ✓ ${(fs.statSync(final).size/1024/1024).toFixed(1)}MB`)
  try { fs.rmSync(tmp, { recursive: true, force: true }) } catch {}
  return final
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  GENERATING REMAINING 3 VIDEOS')
  console.log('═══════════════════════════════════════════\n')
  for (const a of ARTICLES) await createShort(a)
  console.log('\nDone!')
}

main().catch(console.error)
