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

function esc(t) { return t.replace(/'/g, "'\\\\''").replace(/:/g, '\\:').replace(/%/g, '\\\\%').replace(/\[/g, '\\[').replace(/\]/g, '\\]') }

function dur(fp) { try { return parseFloat(execSync(`"${FFPROBE}" -v error -show_entries format=duration -of csv=p=0 "${fp}"`, {stdio:'pipe'}).toString().trim()) || 0 } catch { return 0 } }

// ─── Generate hook/CTA scene (full screen text) ────────────────────────────
function renderTitleScene(text, duration, outputPath, color = '#1a1a2e') {
  const fps = 30; const frames = Math.round(duration * fps)
  const cmd = `"${FFMPEG}" -f lavfi -i "color=c=${color}:s=1080x1920:d=${duration}:r=${fps}" ` +
    `-filter_complex ` +
    `"[0:v]` +
    `drawtext=text='${esc(text)}':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=h*0.40:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='${FONT}':enable='gte(t,0.3)',` +
    `drawbox=x=0:y=0:w=1080:h=1920:c=black@0.3:t=fill,` +
    `drawtext=text='Clara Bridge':fontsize=20:fontcolor=white@0.5:x=w/2-text_w/2:y=h*0.18:fontfile='${FONT}',` +
    `drawbox=x=0:y=h*0.85:w=1080:h=h*0.15:c=black@0.6:t=fill:enable='gte(t,1.5)',` +
    `drawtext=text='⬇  Link in Description  ⬇':fontsize=28:fontcolor=#ffd700:x=(w-text_w)/2:y=h*0.87:fontfile='${FONT}':enable='gte(t,1.5)'` +
    `" -c:v libx264 -b:v 6M -preset fast -crf 20 -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 60000 })
}

// ─── Generate scene with image + animated text ────────────────────────────
function renderScene(text, imgPath, duration, outPath, index, totalScenes, zoomDir = 1) {
  const fps = 30; const frames = Math.round(duration * fps)
  const zoomStart = 1.0; const zoomEnd = 1.06
  const zoomPerFrame = (zoomEnd - zoomStart) / frames
  const dots = Array(totalScenes).fill('○'); dots[index] = '●'

  const fadeIn = 0.5; const fadeOut = 0.5
  const textStart = 0.3
  const textEnd = duration - fadeOut

  // Text opacity: smooth fade in, hold, smooth fade out
  const alphaExpr = `if(lt(t,${textStart}),0,if(lt(t,${textStart+0.4}),(t-${textStart})/0.4,if(lt(t,${textEnd}),1,if(lt(t,${textEnd+fadeOut}),1-((t-${textEnd})/${fadeOut}),0))))`

  // Ken Burns with subtle parallax
  const panX = `iw/2-(iw/zoom/2)+${-20 * zoomDir * zoomDir}*sin(t/${duration}*PI)`

  const cmd = `"${FFMPEG}" -loop 1 -i "${imgPath}" ` +
    `-filter_complex "` +
    `[0:v]format=yuv420p,` +
    `scale=1280:1920:force_original_aspect_ratio=increase,` +
    `crop=1080:1920,` +
    `zoompan=z='min(${zoomStart}+${zoomPerFrame}*on,${zoomEnd})':x='${panX}':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps},` +
    // Color grade - warm tone
    `colorchannelmixer=rr=1.1:rg=0.05:rb=0.02:gb=0.95:bb=0.9,` +
    // Vignette overlay
    `drawbox=x=0:y=0:w=1080:h=1920:c=black@0.25:t=fill,` +
    // Bottom bar for text area
    `drawbox=x=0:y=h*0.68:w=1080:h=h*0.32:c=black@0.55:t=fill:enable='gte(t,0.2)',` +
    // Main text with fade
    `drawtext=text='${esc(text)}':fontsize=44:fontcolor=white:x=(w-text_w)/2:y=h*0.72:box=0:fontfile='${FONT}':alpha='${alphaExpr}',` +
    // Scene dots
    `drawtext=text='${esc(dots.join('  '))}':fontsize=18:fontcolor=white@0.6:x=(w-text_w)/2:y=h*0.96:fontfile='${FONT}'` +
    `" -c:v libx264 -b:v 6M -t ${duration} -preset fast -crf 20 -y "${outPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 120000 })
}

// ─── Generate background music ─────────────────────────────────────────────
function genMusic(duration, outPath) {
  const d = Math.ceil(duration)
  const filter = `sine=f=261.63:d=${d}:sample_rate=44100 [c];sine=f=329.63:d=${d} [e];sine=f=392:d=${d} [g];[c][e][g]amix=inputs=3:weights=0.5 0.3 0.4:duration=first [mix];[mix]volume=0.05,afade=t=in:d=2,afade=t=out:st=${d-3}:d=3 [out]`
  execSync(`"${FFMPEG}" -filter_complex "${filter}" -map "[out]" -y "${outPath}"`, { stdio: 'pipe', timeout: 30000 })
}

// ─── Crossfade concat ──────────────────────────────────────────────────────
function concatVideos(segments, outputPath) {
  if (segments.length === 0) throw new Error('No segments')
  if (segments.length === 1) { fs.copyFileSync(segments[0], outputPath); return }

  const fadeDur = 0.4
  const tmpDir = path.dirname(segments[0])

  // Build filter string for xfade between consecutive clips
  let filter = ''
  let offset = 0
  const durs = segments.map(s => dur(s))
  for (let i = 0; i < segments.length - 1; i++) {
    offset += durs[i] - fadeDur
    filter += `[${i}][${i+1}]xfade=transition=fade:duration=${fadeDur}:offset=${Math.round(offset*100)/100},`
    if (i < segments.length - 2) filter += `[v${i}];`; else filter = filter.slice(0, -1)
  }

  // For xfade, we need a different approach since filter chains are complex
  // Use concat demuxer for simpler approach
  const listPath = path.join(tmpDir, 'concat.txt')
  const fileLines = segments.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n')
  fs.writeFileSync(listPath, fileLines)
  execSync(`"${FFMPEG}" -f concat -safe 0 -i "${listPath}" -c:v libx264 -b:v 6M -preset fast -crf 20 -pix_fmt yuv420p -y "${outputPath}"`, { stdio: 'pipe', timeout: 180000 })
}

// ─── Mix audio ──────────────────────────────────────────────────────────────
function mixAudio(voicePath, musicPath, duration, outputPath) {
  const cmd = `"${FFMPEG}" -i "${voicePath}" -i "${musicPath}" -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=0.12[a1];[a0][a1]amix=inputs=2:duration=first:weights=1 0.12[out]" -map "[out]" -t ${duration} -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 30000 })
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function createShort(article) {
  console.log(`\n  ═══ ${article.title} ═══`)

  const outDir = path.join(OUT_DIR, `article-${article.num}`)
  fs.mkdirSync(outDir, { recursive: true })
  const tmpDir = path.join(outDir, 'tmp')
  fs.mkdirSync(tmpDir, { recursive: true })

  // [1] Generate voiceover with edge-tts-universal
  console.log('  [1/5] Voiceover (Edge TTS neural)...')
  let voiceBuf, words
  try {
    const tts = new EdgeTTS(article.script, 'en-US-JennyNeural', { rate: '+10%' })
    const result = await tts.synthesize()
    voiceBuf = Buffer.from(await result.audio.arrayBuffer())
    words = result.subtitle || []
    if (voiceBuf.length < 100) throw new Error('Audio too small')
    const voicePath = path.join(outDir, 'voice.mp3')
    fs.writeFileSync(voicePath, voiceBuf)
    const totalMs = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 0
    console.log(`  ✓ ${(totalMs/10000000).toFixed(1)}s, ${words.length} words, ${(voiceBuf.length/1024).toFixed(0)}KB`)
  } catch (e) {
    console.log(`  ✗ TTS failed: ${e.message}`)
    return null
  }

  const totalMs = words.length > 0 ? words[words.length-1].offset + words[words.length-1].duration : 280000000
  const totalDuration = Math.ceil(Math.max(totalMs / 10000000, 28))
  const sceneDuration = totalDuration / (article.scenes.length + 1)
  const hookDur = 3; const ctaDur = Math.min(sceneDuration * 0.7, 6)

  // [2] Background music
  console.log('  [2/5] Background music...')
  const musicPath = path.join(outDir, 'music.wav')
  try { genMusic(totalDuration, musicPath); console.log('  ✓ Done') } catch { console.log('  - Skipped') }

  // [3] Hook scene
  console.log('  [3/5] Scenes...')
  const segs = []
  try {
    const hp = path.join(tmpDir, 'hook.mp4')
    renderTitleScene(article.hook, hookDur, hp)
    segs.push(hp)
    console.log(`  ✓ Hook: "${article.hook}"`)
  } catch (e) { console.log(`  ✗ Hook: ${e.message}`) }

  // Content scenes
  for (let i = 0; i < article.scenes.length; i++) {
    const s = article.scenes[i]
    const imgPath = path.join(PINS_DIR, `article-${article.num}`, `${s.img}.png`)
    if (!fs.existsSync(imgPath)) { console.log(`  ✗ No image: ${s.img}.png`); continue }

    const sd = i === article.scenes.length - 1 ? totalDuration - hookDur - (article.scenes.length - 1) * sceneDuration - ctaDur : sceneDuration
    const sp = path.join(tmpDir, `scene-${i}.mp4`)
    try {
      renderScene(s.text, imgPath, Math.max(sd, 4), sp, i, article.scenes.length, i % 2 === 0 ? 1 : -1)
      segs.push(sp)
      console.log(`  ✓ Scene ${i+1}: "${s.text}" (${sd.toFixed(1)}s)`)
    } catch (e) { console.log(`  ✗ Scene ${i+1}: ${e.message}`) }
  }

  // CTA scene
  try {
    const cp = path.join(tmpDir, 'cta.mp4')
    renderTitleScene(article.cta, ctaDur, cp, '#0d0d1a')
    segs.push(cp)
    console.log(`  ✓ CTA: "${article.cta}"`)
  } catch (e) { console.log(`  ✗ CTA: ${e.message}`) }

  // [4] Assemble video
  console.log('  [4/5] Assembling video...')
  const rawVideo = path.join(tmpDir, 'raw.mp4')
  const finalVideo = path.join(outDir, 'shorts.mp4')
  try {
    concatVideos(segs, rawVideo)
    console.log('  ✓ Video assembled')
  } catch (e) { console.log(`  ✗ Assembly: ${e.message}`); return null }

  // [5] Mix audio
  console.log('  [5/5] Mixing audio...')
  const mixedAudio = path.join(tmpDir, 'mixed.mp3')
  const musicOk = fs.existsSync(musicPath) && fs.statSync(musicPath).size > 100
  if (musicOk) {
    try { mixAudio(path.join(outDir, 'voice.mp3'), musicPath, totalDuration, mixedAudio) } catch {}
  }

  if (fs.existsSync(mixedAudio) && fs.statSync(mixedAudio).size > 100) {
    const wa = path.join(tmpDir, 'with-audio.mp4')
    execSync(`"${FFMPEG}" -i "${rawVideo}" -i "${mixedAudio}" -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -y "${wa}"`, { stdio: 'pipe', timeout: 60000 })
    if (fs.existsSync(wa)) fs.renameSync(wa, finalVideo)
  } else {
    // Voice only
    execSync(`"${FFMPEG}" -i "${rawVideo}" -i "${path.join(outDir, 'voice.mp3')}" -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -y "${finalVideo}"`, { stdio: 'pipe', timeout: 60000 })
  }

  const size = fs.statSync(finalVideo).size
  console.log(`  ✓ ${(size/1024/1024).toFixed(1)}MB → shorts.mp4`)
  try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch {}
  return finalVideo
}

async function main() {
  console.log('\n  ╔═══════════════════════════════════════════════╗')
  console.log('  ║  HD YOUTUBE SHORTS GENERATOR                ║')
  console.log('  ║  Edge TTS Neural · Multi-Scene · Music      ║')
  console.log('  ╚═══════════════════════════════════════════════╝\n')

  fs.mkdirSync(OUT_DIR, { recursive: true })
  const results = []

  for (let i = 0; i < ARTICLES.length; i++) {
    console.log(`\n  ┌─ [${i+1}/${ARTICLES.length}] ${ARTICLES[i].title}`)
    const r = await createShort(ARTICLES[i])
    if (r) results.push(r)
  }

  console.log(`\n  ╔═══════════════════════════════════════════════╗`)
  console.log(`  ║  DONE! ${results.length}/${ARTICLES.length} generated ✓       ║`)
  console.log(`  ╚═══════════════════════════════════════════════╝\n`)
}

main().catch(console.error)
