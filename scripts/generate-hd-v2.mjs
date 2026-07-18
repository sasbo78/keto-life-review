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

function genMusic(duration, outPath) {
  const d = Math.ceil(duration)
  const f = `sine=f=261.63:d=${d}:sample_rate=44100 [c];sine=f=329.63:d=${d} [e];sine=f=392:d=${d} [g];[c][e][g]amix=inputs=3:weights=0.5 0.3 0.4:duration=first [mix];[mix]volume=0.06,afade=t=in:d=3,afade=t=out:st=${d-3}:d=3 [out]`
  execSync(`"${FFMPEG}" -filter_complex "${f}" -map "[out]" -y "${outPath}"`, { stdio: 'pipe', timeout: 30000 })
}

function mixAudio(voicePath, musicPath, duration, outputPath) {
  execSync(`"${FFMPEG}" -i "${voicePath}" -i "${musicPath}" -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=0.1[a1];[a0][a1]amix=inputs=2:duration=first:weights=1 0.1[out]" -map "[out]" -t ${duration} -y "${outputPath}"`, { stdio: 'pipe', timeout: 30000 })
}

// ─── Hook / CTA (gradient bg, centered text) ──────────────────────────────
function renderHook(text, duration, outputPath, bgColor = '#1a1a2e') {
  const cmd = `"${FFMPEG}" -f lavfi -i "color=c=${bgColor}:s=1080x1920:d=${duration}:r=30"` +
    ` -filter_complex "[0:v]` +
    `drawtext=text='${esc(text)}':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=800:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='${FONT}':enable='gte(t,0.3)',` +
    `drawtext=text='Clara Bridge':fontsize=20:fontcolor=white@0.4:x=540-text_w/2:y=300:fontfile='${FONT}'` +
    `" -c:v libx264 -b:v 6M -preset fast -crf 20 -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 60000 })
}

// ─── Content scene (image + text + dots) ──────────────────────────────────
function renderScene(text, imgPath, duration, outPath, index, totalScenes) {
  const fps = 30
  const frames = Math.round(duration * fps)
  const dots = Array(totalScenes).fill('○'); dots[index] = '●'
  // Text appears at t=0.5, disappears at t=duration-0.5
  const textOn = 0.5; const textOff = duration - 0.5

  // Use two drawtexts: one that fades in and one for fade out workaround
  // Actually simpler: use drawtext visible with shadow overlay for cinematic look
  const cmd = `"${FFMPEG}" -loop 1 -i "${imgPath}"` +
    ` -filter_complex "` +
    `[0:v]format=yuv420p,` +
    `scale=1280:1920:force_original_aspect_ratio=increase,` +
    `crop=1080:1920,` +
    `zoompan=z='min(1.0+0.06*on/${frames},1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps},` +
    `colorchannelmixer=rr=1.08:rg=0.03:rb=0.02:gb=0.95,` +
    `drawbox=x=0:y=0:w=1080:h=1920:c=black@0.20:t=fill,` +
    `drawbox=x=0:y=1300:w=1080:h=620:c=black@0.50:t=fill:enable='gte(t,${textOn})',` +
    `drawtext=text='${esc(text)}':fontsize=44:fontcolor=white:x=(w-text_w)/2:y=1360:fontfile='${FONT}':enable='between(t,${textOn},${textOff})',` +
    `drawtext=text='${esc(dots.join('  '))}':fontsize=18:fontcolor=white@0.5:x=(w-text_w)/2:y=1860:fontfile='${FONT}'` +
    `" -c:v libx264 -b:v 6M -t ${duration} -preset fast -crf 20 -y "${outPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 120000 })
}

// ═══════════════════════════════════════════════════════════════════════════
const ARTICLES = [
  { num: '01', title: 'Best Keto Coffee for Weight Loss',
    hook: 'We tested keto coffee for 30 days.',
    scenes: [
      { text: 'Struggling to lose weight?', img: 'hero' },
      { text: 'This coffee burns fat while you sleep.', img: 'side' },
      { text: 'No cravings, clean energy all day.', img: 'split' },
      { text: '12,000+ verified 5-star reviews.', img: 'bold' },
    ],
    cta: 'Get yours at the link below!',
    script: 'We tested the best keto coffee for 30 days. The results are incredible. This special coffee blend helps you burn fat faster, gives you clean energy, and stops cravings. Our top pick has 12000 verified reviews on Amazon with a 5 star rating. Try it today and see the difference.' },
  { num: '02', title: 'Where to Buy Keto Coffee Online',
    hook: 'Best price for keto coffee?',
    scenes: [
      { text: 'Stop overpaying for keto coffee.', img: 'hero' },
      { text: 'Less than $1 per serving.', img: 'split' },
      { text: 'Up to 50% off with coupons.', img: 'minimal' },
      { text: 'Free shipping available now.', img: 'side' },
    ],
    cta: 'Click for the best deal!',
    script: 'Where can you buy keto coffee at the best price? We found the cheapest deals online. The best keto coffee costs less than a dollar per serving. Plus there are coupon codes that save you up to 50 percent. Click the link to get the best price right now.' },
  { num: '03', title: 'Keto Coffee Side Effects',
    hook: 'Keto coffee side effects?',
    scenes: [
      { text: 'Some feel bloated at first.', img: 'hero' },
      { text: 'Mild headaches are normal.', img: 'side' },
      { text: 'Your body adapts to ketosis.', img: 'split' },
      { text: 'Our guide helps you avoid issues.', img: 'minimal' },
    ],
    cta: 'Read the full guide!',
    script: 'Does keto coffee have side effects? Some people feel bloated on day one. Others get mild headaches. This is completely normal. Our guide shows you exactly how to avoid these issues. Start slow and follow our tips for a smooth experience.' },
  { num: '04', title: 'Keto Coffee for Women Guide',
    hook: 'Keto works differently for women.',
    scenes: [
      { text: 'Female bodies need a special approach.', img: 'hero' },
      { text: 'Best routine for women over 30.', img: 'split' },
      { text: 'Results without the struggle.', img: 'side' },
      { text: 'Join thousands of successful women.', img: 'minimal' },
    ],
    cta: 'Read the women guide!',
    script: 'Keto coffee works differently for women. Female bodies need a special approach to ketosis. Our complete guide covers the best routine for women over 30. Get the results you want without the struggle. Read the full guide on our blog.' },
  { num: '05', title: 'Keto Coffee for Beginners',
    hook: 'New to keto coffee?',
    scenes: [
      { text: 'Blend with butter and MCT oil.', img: 'hero' },
      { text: 'Never stir it.', img: 'side' },
      { text: 'Drink on empty stomach.', img: 'split' },
      { text: 'Full until lunch, steady energy.', img: 'minimal' },
    ],
    cta: 'Start your keto journey!',
    script: 'New to keto coffee? Here is everything you need to know. You blend it with butter and MCT oil. Never stir it. Drink it in the morning on an empty stomach. It keeps you full until lunch and gives you steady energy. Start your journey today.' },
  { num: '06', title: 'Keto Coffee vs Regular Coffee',
    hook: 'Which coffee burns more fat?',
    scenes: [
      { text: 'Regular coffee has zero fat burn.', img: 'hero' },
      { text: 'Keto coffee with MCT oil works.', img: 'side' },
      { text: 'Fat burning mode activated.', img: 'split' },
      { text: 'Science confirms the difference.', img: 'bold' },
    ],
    cta: 'Make the switch today!',
    script: 'Keto coffee versus regular coffee. Which one helps you lose weight? Regular coffee has zero calories but no fat burning effect. Keto coffee with MCT oil puts your body into fat burning mode. Scientists confirm it works. Make the switch today.' },
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

  // 1. Voiceover
  console.log('  Voiceover (Edge TTS)...')
  let voiceBuf, words
  try {
    const tts = new EdgeTTS(article.script, 'en-US-JennyNeural', { rate: '+10%' })
    const r = await tts.synthesize()
    voiceBuf = Buffer.from(await r.audio.arrayBuffer())
    words = r.subtitle || []
    if (voiceBuf.length < 100) throw new Error('Audio too small')
    fs.writeFileSync(path.join(outDir, 'voice.mp3'), voiceBuf)
    const totalMs = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 0
    console.log(`  ✓ ${(totalMs/10000000).toFixed(1)}s, ${words.length} words`)
  } catch (e) { console.log(`  ✗ ${e.message}`); return null }

  const totalMs = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 280000000
  const totalDuration = Math.ceil(Math.max(totalMs / 10000000, 28))
  const nScenes = article.scenes.length
  const hookDur = 3
  const ctaDur = 5
  const sceneDur = (totalDuration - hookDur - ctaDur) / nScenes

  // 2. Music
  console.log('  Music...')
  const musicPath = path.join(outDir, 'music.wav')
  try { genMusic(totalDuration, musicPath); console.log('  ✓') } catch { console.log('  -') }

  // 3. Hook
  console.log('  Hook...')
  const segs = []
  const hp = path.join(tmp, 'hook.mp4')
  try { renderHook(article.hook, hookDur, hp); segs.push(hp); console.log('  ✓') } catch (e) { console.log(`  ✗ ${e.message}`) }

  // 4. Scenes
  console.log('  Scenes...')
  for (let i = 0; i < nScenes; i++) {
    const s = article.scenes[i]
    const ip = path.join(PINS_DIR, `article-${article.num}`, `${s.img}.png`)
    if (!fs.existsSync(ip)) { console.log(`  ✗ Missing ${s.img}.png`); continue }
    const sd = i === nScenes - 1 ? sceneDur + (totalDuration - hookDur - nScenes * sceneDur - ctaDur) : sceneDur
    const sp = path.join(tmp, `s${i}.mp4`)
    try { renderScene(s.text, ip, Math.max(sd, 3.5), sp, i, nScenes); segs.push(sp); console.log(`  ✓ ${i+1}/${nScenes}`) }
    catch (e) { console.log(`  ✗ ${i+1}: ${e.message}`) }
  }

  // 5. CTA
  console.log('  CTA...')
  const cp = path.join(tmp, 'cta.mp4')
  try { renderHook(article.cta + ' ➡', ctaDur, cp, '#0d0d1a'); segs.push(cp); console.log('  ✓') } catch (e) { console.log(`  ✗ ${e.message}`) }

  // 6. Concat
  console.log('  Assembling...')
  const raw = path.join(tmp, 'raw.mp4')
  const final = path.join(outDir, 'shorts.mp4')
  try {
    const list = path.join(tmp, 'list.txt')
    fs.writeFileSync(list, segs.map(p => `file '${p}'`).join('\n'))
    execSync(`"${FFMPEG}" -f concat -safe 0 -i "${list}" -c:v libx264 -b:v 6M -preset fast -crf 20 -pix_fmt yuv420p -y "${raw}"`, { stdio: 'pipe', timeout: 180000 })
  } catch (e) { console.log(`  ✗ ${e.message}`); return null }

  // 7. Audio mix
  console.log('  Audio mix...')
  const mixed = path.join(tmp, 'mixed.mp3')
  const musicOk = fs.existsSync(musicPath) && fs.statSync(musicPath).size > 100
  if (musicOk) try { mixAudio(path.join(outDir, 'voice.mp3'), musicPath, totalDuration, mixed) } catch {}
  const hasMixed = fs.existsSync(mixed) && fs.statSync(mixed).size > 100
  const audioSrc = hasMixed ? mixed : path.join(outDir, 'voice.mp3')
  execSync(`"${FFMPEG}" -i "${raw}" -i "${audioSrc}" -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -y "${final}"`, { stdio: 'pipe', timeout: 60000 })

  const size = fs.statSync(final).size
  console.log(`  ✓ ${(size/1024/1024).toFixed(1)}MB\n`)
  try { fs.rmSync(tmp, { recursive: true, force: true }) } catch {}
  return final
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  HD SHORTS GENERATOR v2')
  console.log('  Edge TTS Neural · Multi-Scene · Music')
  console.log('═══════════════════════════════════════════\n')
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const results = []
  for (const article of ARTICLES) {
    const r = await createShort(article)
    if (r) results.push(r)
  }
  console.log(`\n✓ ${results.length}/${ARTICLES.length} generated`)
}

main().catch(console.error)
