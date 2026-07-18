import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { WebSocket } from 'ws'
import https from 'https'
import crypto from 'crypto'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'pro-pins')
const SHORTS_DIR = path.join(BASE_DIR, 'pro-shorts-v3')
const FFMPEG = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffmpeg.exe'
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe')

const EDGE_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'

const ARTICLES = [
  { num: '01', title: 'Best Keto Coffee for Weight Loss',
    hook: 'We tested keto coffee for 30 days.',
    scenes: [
      { text: 'Struggling to lose weight?', image: 'hero' },
      { text: 'Keto coffee changed everything.', image: 'side' },
      { text: 'Burns fat faster, stops cravings.', image: 'split' },
      { text: '12,000+ verified 5-star reviews.', image: 'bold' },
    ],
    cta: 'Get yours at the link below!',
    script: 'We tested the best keto coffee for 30 days. The results are incredible. This special coffee blend helps you burn fat faster, gives you clean energy, and stops cravings. Our top pick has 12000 verified reviews on Amazon with a 5 star rating. Try it today and see the difference.' },
  { num: '02', title: 'Where to Buy Keto Coffee Online',
    hook: 'Best price for keto coffee?',
    scenes: [
      { text: 'Stop overpaying for keto coffee.', image: 'hero' },
      { text: 'Less than $1 per serving.', image: 'split' },
      { text: 'Up to 50% off with coupon codes.', image: 'minimal' },
      { text: 'Free shipping available now.', image: 'side' },
    ],
    cta: 'Click the link for the best deal!',
    script: 'Where can you buy keto coffee at the best price? We found the cheapest deals online. The best keto coffee costs less than a dollar per serving. Plus there are coupon codes that save you up to 50 percent. Click the link to get the best price right now.' },
  { num: '03', title: 'Keto Coffee Side Effects',
    hook: 'Keto coffee side effects?',
    scenes: [
      { text: 'Some feel bloated at first.', image: 'hero' },
      { text: 'Mild headaches are normal.', image: 'side' },
      { text: 'Your body is adapting to ketosis.', image: 'split' },
      { text: 'Our guide shows you how.', image: 'minimal' },
    ],
    cta: 'Read the full guide on our blog!',
    script: 'Does keto coffee have side effects? Some people feel bloated on day one. Others get mild headaches. This is completely normal. Our guide shows you exactly how to avoid these issues. Start slow and follow our tips for a smooth experience.' },
  { num: '04', title: 'Keto Coffee for Women Guide',
    hook: 'Keto works differently for women.',
    scenes: [
      { text: 'Female bodies need a special approach.', image: 'hero' },
      { text: 'Best routine for women over 30.', image: 'split' },
      { text: 'Results without the struggle.', image: 'side' },
      { text: 'Join thousands of successful women.', image: 'minimal' },
    ],
    cta: 'Read the complete women guide!',
    script: 'Keto coffee works differently for women. Female bodies need a special approach to ketosis. Our complete guide covers the best routine for women over 30. Get the results you want without the struggle. Read the full guide on our blog.' },
  { num: '05', title: 'Keto Coffee for Beginners',
    hook: 'New to keto coffee?',
    scenes: [
      { text: 'Blend with butter and MCT oil.', image: 'hero' },
      { text: 'Never stir it.', image: 'side' },
      { text: 'Drink it on an empty stomach.', image: 'split' },
      { text: 'Stays full until lunch.', image: 'minimal' },
    ],
    cta: 'Start your keto journey now!',
    script: 'New to keto coffee? Here is everything you need to know. You blend it with butter and MCT oil. Never stir it. Drink it in the morning on an empty stomach. It keeps you full until lunch and gives you steady energy. Start your journey today.' },
  { num: '06', title: 'Keto Coffee vs Regular Coffee',
    hook: 'Which coffee helps you lose weight?',
    scenes: [
      { text: 'Regular coffee has zero fat burning.', image: 'hero' },
      { text: 'Keto coffee with MCT oil works.', image: 'side' },
      { text: 'Puts your body into fat-burning mode.', image: 'split' },
      { text: 'Science confirms it works.', image: 'bold' },
    ],
    cta: 'Make the switch today!',
    script: 'Keto coffee versus regular coffee. Which one helps you lose weight? Regular coffee has zero calories but no fat burning effect. Keto coffee with MCT oil puts your body into fat burning mode. Scientists confirm it works. Make the switch today.' },
  { num: '07', title: '3 Easy Keto Coffee Recipes',
    hook: 'Perfect keto coffee in minutes!',
    scenes: [
      { text: 'Classic bulletproof coffee.', image: 'hero' },
      { text: 'Chocolate keto latte.', image: 'side' },
      { text: 'Iced keto coffee for summer.', image: 'split' },
      { text: 'Each takes 2 minutes.', image: 'minimal' },
    ],
    cta: 'Watch the full tutorial!',
    script: 'Learn how to make the perfect keto coffee in 3 easy recipes. Number 1 classic bulletproof coffee. Number 2 chocolate keto latte. Number 3 iced keto coffee. Each takes less than 2 minutes. Watch the tutorial on our blog.' },
  { num: '08', title: 'Does Keto Coffee Really Work?',
    hook: 'Is keto coffee really effective?',
    scenes: [
      { text: 'Science says YES.', image: 'hero' },
      { text: 'MCT oil boosts ketones by 300%.', image: 'split' },
      { text: 'More fat burning all day.', image: 'side' },
      { text: 'Thousands have transformed.', image: 'bold' },
    ],
    cta: 'See the science on our site!',
    script: 'Does keto coffee really work or is it just hype? Science says yes. The MCT oil in keto coffee increases ketone production by up to 300 percent. This means more fat burning all day long. Read the science on our website.' },
  { num: '09', title: 'Keto Coffee Discount Codes',
    hook: 'Keto coffee at HALF price!',
    scenes: [
      { text: 'Active coupon codes inside.', image: 'hero' },
      { text: 'Save up to 50% right now.', image: 'split' },
      { text: 'Limited time offer.', image: 'side' },
      { text: 'Free shipping included.', image: 'bold' },
    ],
    cta: 'Get the discount before it expires!',
    script: 'Get keto coffee at half price. We found active coupon codes that save you up to 50 percent. Limited time offer. The best keto coffee is currently on sale with free shipping. Click the link to get the discount before it expires.' },
]

function escapeFfmpeg(text) {
  return text.replace(/'/g, "'\\\\''").replace(/:/g, '\\:').replace(/%/g, '\\\\%').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

function uuid() { return crypto.randomUUID().replace(/-/g, '') }

// ─── Edge TTS with word timestamps ──────────────────────────────────────────
async function edgeTTS(text) {
  const voice = 'en-US-JennyNeural'
  const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${EDGE_TOKEN}&ConnectionId=${uuid()}`

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, {
      host: 'speech.platform.bing.com',
      origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' },
    })

    const audioChunks = []
    const words = []
    let timeout

    ws.on('open', () => {
      timeout = setTimeout(() => reject(new Error('TTS timeout')), 30000)

      const cfg = JSON.stringify({
        context: { synthesis: { audio: {
          metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: true },
          outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
        } } }
      })
      ws.send(`X-Timestamp:${Date()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${cfg}`)

      const ssml = `X-RequestId:${uuid()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${Date()}Z\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='+0Hz' rate='+10%' volume='+0%'>${text}</prosody></voice></speak>`
      ws.send(ssml)
    })

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        const raw = Buffer.isBuffer(data) ? data : Buffer.from(data)
        const sep = 'Path:audio\r\n'
        const idx = raw.indexOf(sep)
        if (idx >= 0) audioChunks.push(raw.subarray(idx + sep.length))
        return
      }

      const msg = data.toString()
      const jsonStart = msg.indexOf('{')
      if (jsonStart >= 0) {
        try {
          const meta = JSON.parse(msg.slice(jsonStart))
          if (meta.type === 'WordBoundary') {
            words.push({
              text: meta.text,
              offset: (meta.offset || 0) / 10000000,
              duration: (meta.duration || 0) / 10000000,
            })
          }
          if (meta.type === 'turn.end') {
            clearTimeout(timeout)
            const totalDuration = words.length > 0
              ? words[words.length - 1].offset + words[words.length - 1].duration
              : 0
            resolve({ audio: Buffer.concat(audioChunks), words, duration: totalDuration })
          }
        } catch {}
      }
    })

    ws.on('error', (err) => { clearTimeout(timeout); reject(err) })
    ws.on('close', () => clearTimeout(timeout))
  })
}

// ─── Generate background music ──────────────────────────────────────────────
function generateMusic(duration, outputPath) {
  const d = Math.ceil(duration)
  // Ambient chord progression using sine waves with slow LFO modulation
  const filter = [
    `sine=f=261.63:d=${d}:sample_rate=44100 [c]`,
    `sine=f=329.63:d=${d} [e]`,
    `sine=f=392:d=${d} [g]`,
    `sine=f=220:d=${d} [a]`,
    `sine=f=277.18:d=${d} [cs]`,
    `sine=f=349.23:d=${d} [fs]`,
    `sine=f=440:d=${d} [as]`,
    `[c][e][g]amix=inputs=3:weights=0.6 0.4 0.5:duration=first [chord1]`,
    `[a][cs][e]amix=inputs=3:weights=0.5 0.3 0.4:duration=first [chord2]`,
    `[as][c][fs]amix=inputs=3:weights=0.4 0.5 0.3:duration=first [chord3]`,
    `[chord1][chord2][chord3]amix=inputs=3:weights=0.5 0.3 0.4:duration=first [mix]`,
    `[mix]volume=0.04,afade=t=in:d=2,afade=t=out:st=${d-3}:d=3 [out]`,
  ].join('; ')

  const cmd = `"${FFMPEG}" -filter_complex "${filter}" -map "[out]" -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 30000 })
}

// ─── Generate scene video ──────────────────────────────────────────────────
function generateScene(scene, index, totalDuration, outPath, fps) {
  const imgPath = path.join(PINS_DIR, `article-${scene.articleNum}`, `${scene.image}.png`)
  const text = scene.text
  const duration = scene.duration
  const zoomStart = 1.0 + index * 0.02
  const zoomEnd = zoomStart + 0.04
  const totalFrames = Math.round(duration * fps)
  const zoomPerFrame = (zoomEnd - zoomStart) / totalFrames

  // Gradient background overlay (semi-transparent over image)
  // Animate gradient position using geq
  const drawText = text
    ? `drawtext=text='${escapeFfmpeg(text)}':fontsize=52:fontcolor=white:x=(w-text_w)/2:y=h*0.35:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':enable='gte(t,0.5)',` +
      `drawtext=text='${escapeFfmpeg(text)}':fontsize=52:fontcolor=white:x=(w-text_w)/2:y=h*0.35:box=1:boxcolor=black@0.5:boxborderw=30:fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':enable='gte(t,${duration-1.5})':alpha=0,`
    : ''

  const filter = [
    `[0:v]format=yuv420p,`,
    `scale=1280:1920:force_original_aspect_ratio=increase,`,
    `crop=1080:1920,`,
    `zoompan=z='min(${zoomStart}+${zoomPerFrame}*on,${zoomEnd})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1080x1920:fps=${fps},`,
    drawText,
    // Overlay animated gradient for visual interest
    `color=c=black:size=1080x1920:d=${duration}:r=${fps},format=yuv420p,`,
    `geq=r='255*abs(sin(X/200+T/5))':g='255*abs(sin(Y/200+T/4))':b='255*abs(sin((X+Y)/300+T/3))':alpha='0.08*sin(X/100+T/3)+0.08',`,
    `[1:v]overlay=0:0,`,
    // Subtle vignette
    `drawbox=x=0:y=0:w=1080:h=1920:c=black@0.3:t=fill:enable='gte(t,0)',`,
    // Bottom gradient bar for text
    `drawbox=x=0:y=h*0.7:w=1080:h=h*0.3:c=black@0.4:t=fill:enable='gte(t,0.5)',`,
    // Scene number indicator (dots)
    `drawtext=text='●  ○  ○  ○':fontsize=20:fontcolor=white:x=w/2-text_w/2:y=h-th-40:fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':box=0,`
  ].join('')

  // For scene indicator, show which dot is filled based on scene index
  const dots = ['○','○','○','○']
  dots[index] = '●'
  const dotText = dots.join('  ')
  // Replace the basic dot text with proper indicator
  const filterWithDots = filter.replace(
    `drawtext=text='●  ○  ○  ○'`,
    `drawtext=text='${dotText}'`
  )

  const cmd = `"${FFMPEG}" -loop 1 -i "${imgPath}" -filter_complex "${filterWithDots}" -c:v libx264 -b:v 6M -t ${duration} -preset fast -crf 20 -y "${outPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 120000 })
}

// ─── Crossfade two clips ──────────────────────────────────────────────────
function crossfade(clipA, clipB, fadeDuration, outputPath) {
  const cmd = `"${FFMPEG}" -i "${clipA}" -i "${clipB}" -filter_complex "xfade=transition=fade:duration=${fadeDuration}:offset=${Math.round(parseFloat(execSync(`"${FFPROBE}" -v error -show_entries format=duration -of csv=p=0 "${clipA}"`, {stdio:'pipe'}).toString().trim()) - fadeDuration)}" -c:v libx264 -b:v 6M -preset fast -crf 20 -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 120000 })
}

// ─── Get media duration ────────────────────────────────────────────────────
function getDuration(filePath) {
  try {
    const out = execSync(`"${FFPROBE}" -v error -show_entries format=duration -of csv=p=0 "${filePath}"`, { stdio: 'pipe' }).toString().trim()
    return parseFloat(out) || 0
  } catch { return 0 }
}

// ─── Combine audio tracks ──────────────────────────────────────────────────
function mixAudio(voicePath, musicPath, duration, outputPath) {
  const cmd = `"${FFMPEG}" -i "${voicePath}" -i "${musicPath}" -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=0.15[a1];[a0][a1]amix=inputs=2:duration=first:weights=1 0.15[out]" -map "[out]" -t ${duration} -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 30000 })
}

// ─── Generate Click Subscribe animation ────────────────────────────────────
function generateCTA(text, duration, outputPath) {
  const fps = 30
  const frames = Math.round(duration * fps)
  const cmd = `"${FFMPEG}" -f lavfi -i "color=c=#1a1a2e:s=1080x1920:d=${duration}:r=${fps}" -filter_complex `
    + `"` + `[0:v]`
    + `drawtext=text='${escapeFfmpeg(text)}':fontsize=58:fontcolor=#ffd700:x=(w-text_w)/2:y=h*0.35:box=1:boxcolor=black@0.6:boxborderw=35:fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':enable='gte(t,0.3)',`
    + `drawtext=text='Subscribe + Turn on 🔔':fontsize=38:fontcolor=white:x=(w-text_w)/2:y=h*0.55:box=1:boxcolor=red@0.7:boxborderw=20:fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':enable='gte(t,1.5)',`
    + `drawtext=text='⬇  Link in Description Below  ⬇':fontsize=30:fontcolor=white:x=(w-text_w)/2:y=h*0.72:box=1:boxcolor=black@0.5:boxborderw=15:fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':enable='gte(t,${Math.max(duration-4, 2)})'`
    + `" -c:v libx264 -b:v 6M -t ${duration} -preset fast -crf 20 -y "${outputPath}"`
  execSync(cmd, { stdio: 'pipe', timeout: 60000 })
}

// ─── Main generator ────────────────────────────────────────────────────────
async function createShort(article) {
  console.log(`\n  ═══ ${article.title} ═══`)

  const outDir = path.join(SHORTS_DIR, `article-${article.num}`)
  fs.mkdirSync(outDir, { recursive: true })
  const tmpDir = path.join(outDir, 'tmp')
  fs.mkdirSync(tmpDir, { recursive: true })

  // Step 1: Generate voiceover with edge-tts
  console.log('  [1/6] Generating voiceover (Edge TTS)...')
  let ttsResult
  try {
    ttsResult = await edgeTTS(article.script)
    const voicePath = path.join(outDir, 'voice.mp3')
    fs.writeFileSync(voicePath, ttsResult.audio)
    console.log(`  ✓ Voiceover: ${ttsResult.duration.toFixed(1)}s, ${ttsResult.words.length} words`)
  } catch (e) {
    console.log(`  ✗ TTS failed: ${e.message}`)
    return null
  }

  const totalDuration = Math.max(ttsResult.duration, 28)
  const sceneCount = article.scenes.length
  const sceneDuration = totalDuration / (sceneCount + 1) // +1 for CTA scene
  const ctaDuration = sceneDuration * 0.8

  // Step 2: Generate background music
  console.log('  [2/6] Generating background music...')
  const musicPath = path.join(outDir, 'music.wav')
  try {
    generateMusic(totalDuration, musicPath)
    console.log('  ✓ Background music')
  } catch (e) {
    console.log(`  ✗ Music fail: ${e.message}`)
  }

  // Step 3: Generate hook scene
  console.log('  [3/6] Generating hook scene...')
  const hookPath = path.join(tmpDir, 'hook.mp4')
  const hookDuration = 3
  try {
    generateCTA(article.hook, hookDuration, hookPath)
    console.log('  ✓ Hook scene')
  } catch (e) {
    console.log(`  ✗ Hook fail: ${e.message}`)
  }

  // Step 4: Generate each scene
  console.log('  [4/6] Generating scenes...')
  const scenePaths = []
  for (let i = 0; i < sceneCount; i++) {
    const s = article.scenes[i]
    s.articleNum = article.num
    s.duration = i === sceneCount - 1 ? sceneDuration + (totalDuration - sceneCount * sceneDuration) : sceneDuration
    const sp = path.join(tmpDir, `scene-${i}.mp4`)
    try {
      generateScene(s, i, sceneCount, sp, 30)
      scenePaths.push(sp)
      console.log(`  ✓ Scene ${i+1}: "${s.text}" (${s.duration.toFixed(1)}s)`)
    } catch (e) {
      console.log(`  ✗ Scene ${i+1} fail: ${e.message}`)
      return null
    }
  }

  // Step 5: Generate CTA scene
  console.log('  [5/6] Generating CTA scene...')
  const ctaPath = path.join(tmpDir, 'cta.mp4')
  try {
    generateCTA(article.cta, ctaDuration, ctaPath)
    console.log('  ✓ CTA scene')
  } catch (e) {
    console.log(`  ✗ CTA fail: ${e.message}`)
  }

  // Step 6: Concatenate all videos with crossfade
  console.log('  [6/6] Assembling final video...')
  const concatPath = path.join(tmpDir, 'concat-list.txt')
  const segments = [hookPath, ...scenePaths, ctaPath].filter(p => fs.existsSync(p) && fs.statSync(p).size > 1000)

  // Build concat with crossfade using xfade filter
  const fadeDuration = 0.5
  let xfadeFilter = ''
  let inputCount = 0

  // Use concat protocol for simpler assembly
  const fileContent = segments.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n')
  fs.writeFileSync(concatPath, fileContent)

  const finalVideo = path.join(outDir, 'shorts.mp4')
  try {
    const cmd = `"${FFMPEG}" -f concat -safe 0 -i "${concatPath}" -c:v libx264 -b:v 6M -preset fast -crf 20 -pix_fmt yuv420p -y "${finalVideo}"`
    execSync(cmd, { stdio: 'pipe', timeout: 180000 })
    const size = fs.statSync(finalVideo).size
    console.log(`  ✓ Final: ${(size/1024/1024).toFixed(1)}MB → shorts.mp4`)
  } catch (e) {
    console.log(`  ✗ Assembly failed: ${e.message}`)
    return null
  }

  // Mix audio
  const finalAudio = path.join(outDir, 'final-audio.mp3')
  const musicExists = fs.existsSync(musicPath) && fs.statSync(musicPath).size > 100
  if (musicExists) {
    try {
      mixAudio(path.join(outDir, 'voice.mp3'), musicPath, totalDuration, finalAudio)
    } catch {}
  }

  // Replace audio in final video
  if (fs.existsSync(finalAudio) && fs.statSync(finalAudio).size > 100) {
    const finalWithAudio = path.join(outDir, 'shorts-with-audio.mp4')
    try {
      execSync(`"${FFMPEG}" -i "${finalVideo}" -i "${finalAudio}" -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -y "${finalWithAudio}"`, { stdio: 'pipe', timeout: 60000 })
      if (fs.existsSync(finalWithAudio)) {
        fs.renameSync(finalWithAudio, finalVideo)
      }
    } catch {}
  }

  // Cleanup tmp
  try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch {}

  console.log(`  ✓ DONE: ${article.title}`)
  return finalVideo
}

async function main() {
  console.log('\n  ╔═══════════════════════════════════════════════╗')
  console.log('  ║  PROFESSIONAL YOUTUBE SHORTS v3             ║')
  console.log('  ║  Edge TTS · Multi-Scene · Animated BG      ║')
  console.log('  ║  Background Music · Cinematic Text          ║')
  console.log('  ╚═══════════════════════════════════════════════╝\n')

  fs.mkdirSync(SHORTS_DIR, { recursive: true })
  const results = []

  for (let i = 0; i < ARTICLES.length; i++) {
    console.log(`  \n  ┌─ [${i+1}/${ARTICLES.length}] ${ARTICLES[i].title}`)
    const r = await createShort(ARTICLES[i])
    if (r) results.push(r)
  }

  console.log(`\n  ╔═══════════════════════════════════════════════╗`)
  console.log(`  ║  DONE! ${results.length}/${ARTICLES.length} Shorts generated ✓    ║`)
  console.log(`  ╚═══════════════════════════════════════════════╝\n`)

  if (results.length > 0) {
    console.log(`  Output: ${SHORTS_DIR}\n`)
    for (const r of results) {
      console.log(`    ${path.relative(SHORTS_DIR, r)}`)
    }
    console.log('')
  }
}

main().catch(console.error)
