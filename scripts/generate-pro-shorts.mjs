import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'pro-pins')
const SHORTS_DIR = path.join(BASE_DIR, 'pro-shorts-v2')
const FFMPEG = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffmpeg.exe'
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe')

const ARTICLES = [
  { num: '01', title: 'Best Keto Coffee for Weight Loss',
    script: 'We tested the best keto coffee for 30 days. The results are incredible. This special coffee blend helps you burn fat faster, gives you clean energy, and stops cravings. Our top pick has 12000 verified reviews on Amazon with a 5 star rating. Try it today and see the difference.' },
  { num: '02', title: 'Where to Buy Keto Coffee Online',
    script: 'Where can you buy keto coffee at the best price? We found the cheapest deals online. The best keto coffee costs less than a dollar per serving. Plus there are coupon codes that save you up to 50 percent. Click the link to get the best price right now.' },
  { num: '03', title: 'Keto Coffee Side Effects',
    script: 'Does keto coffee have side effects? Some people feel bloated on day one. Others get mild headaches. This is completely normal. Our guide shows you exactly how to avoid these issues. Start slow and follow our tips for a smooth experience.' },
  { num: '04', title: 'Keto Coffee for Women Guide',
    script: 'Keto coffee works differently for women. Female bodies need a special approach to ketosis. Our complete guide covers the best routine for women over 30. Get the results you want without the struggle. Read the full guide on our blog.' },
  { num: '05', title: 'Keto Coffee for Beginners',
    script: 'New to keto coffee? Here is everything you need to know. You blend it with butter and MCT oil. Never stir it. Drink it in the morning on an empty stomach. It keeps you full until lunch and gives you steady energy. Start your journey today.' },
  { num: '06', title: 'Keto Coffee vs Regular Coffee',
    script: 'Keto coffee versus regular coffee. Which one helps you lose weight? Regular coffee has zero calories but no fat burning effect. Keto coffee with MCT oil puts your body into fat burning mode. Scientists confirm it works. Make the switch today.' },
  { num: '07', title: '3 Easy Keto Coffee Recipes',
    script: 'Learn how to make the perfect keto coffee in 3 easy recipes. Number 1 classic bulletproof coffee. Number 2 chocolate keto latte. Number 3 iced keto coffee. Each takes less than 2 minutes. Watch the tutorial on our blog.' },
  { num: '08', title: 'Does Keto Coffee Really Work?',
    script: 'Does keto coffee really work or is it just hype? Science says yes. The MCT oil in keto coffee increases ketone production by up to 300 percent. This means more fat burning all day long. Read the science on our website.' },
  { num: '09', title: 'Keto Coffee Discount Codes',
    script: 'Get keto coffee at half price. We found active coupon codes that save you up to 50 percent. Limited time offer. The best keto coffee is currently on sale with free shipping. Click the link to get the discount before it expires.' },
]

function escapePs(text) {
  return text.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/'/g, "''")
}

function escapeFfmpeg(text) {
  return text.replace(/'/g, "'\\\\''").replace(/:/g, '\\:').replace(/%/g, '\\\\%')
}

async function generateVoiceover(text, outputPath) {
  const psScript = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice("Microsoft Zira Desktop")
$s.Rate = -1
$s.Volume = 100
$s.SetOutputToWaveFile("${outputPath.replace(/\\/g, '\\\\')}")
$s.Speak("${escapePs(text)}")
$s.Dispose()
`
  const psFile = path.join(BASE_DIR, 'tts.ps1')
  fs.writeFileSync(psFile, psScript)
  execSync(`powershell -ExecutionPolicy Bypass -File "${psFile}"`, { stdio: 'pipe' })
  fs.unlinkSync(psFile)
  return fs.statSync(outputPath).size > 1000
}

function getDuration(filePath) {
  try {
    const out = execSync(`"${FFPROBE}" -v error -show_entries format=duration -of csv=p=0 "${filePath}"`, { stdio: 'pipe' }).toString().trim()
    return Math.ceil(parseFloat(out))
  } catch { return 30 }
}

async function createShort(article) {
  // Use hero layout image (best for video - full bleed background)
  const imgPath = path.join(PINS_DIR, `article-${article.num}`, 'hero.png')
  if (!fs.existsSync(imgPath)) {
    console.log(`  ✗ No image: ${imgPath}`)
    return null
  }

  const outDir = path.join(SHORTS_DIR, `article-${article.num}`)
  fs.mkdirSync(outDir, { recursive: true })

  // Generate voiceover
  const voicePath = path.join(outDir, 'voice.wav')
  console.log(`  Generating voiceover...`)
  const ok = await generateVoiceover(article.script, voicePath)
  if (!ok) { console.log(`  ✗ Voiceover failed`); return null }

  const duration = getDuration(voicePath)
  const fps = 30
  const totalFrames = duration * fps

  // Ken Burns zoom: 1.0x → 1.06x over the video duration
  const zoomEnd = 1.06
  const zoomPerFrame = (zoomEnd - 1.0) / totalFrames
  const titleEscaped = escapeFfmpeg(article.title)

  const filter = [
    `[0:v]format=yuv420p,`,
    `scale=1280:1920:force_original_aspect_ratio=increase,`,
    `crop=1080:1920,`,
    `zoompan=z='min(1.0+${zoomPerFrame}*on,${zoomEnd})':`,
    `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1080x1920:fps=${fps},`,
    `drawtext=text='${titleEscaped}':`,
    `fontsize=46:fontcolor=white:`,
    `x=(w-text_w)/2:y=h-th-130:`,
    `box=1:boxcolor=black@0.6:boxborderw=25:`,
    `fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':`,
    `enable='gte(t,0.5)',`,
    `drawtext=text='Subscribe for more':`,
    `fontsize=34:fontcolor=yellow:`,
    `x=(w-text_w)/2:y=h-th-60:`,
    `box=1:boxcolor=black@0.4:boxborderw=15:`,
    `fontfile='C\\\\:\\\\Windows\\\\Fonts\\\\arial.ttf':`,
    `enable='gte(t,${Math.max(duration - 5, 2)})'`
  ].join('')

  const videoPath = path.join(outDir, 'shorts.mp4')
  console.log(`  Rendering ${duration}s Shorts (zoom 1x → ${zoomEnd}x)...`)

  const cmd = `"${FFMPEG}" -loop 1 -i "${imgPath}" -i "${voicePath}" -filter_complex "${filter}" -c:v libx264 -b:v 4M -c:a aac -b:a 128k -t ${duration} -preset medium -crf 22 -shortest -movflags +faststart "${videoPath}"`

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 180000 })
    const size = fs.statSync(videoPath).size
    console.log(`  ✓ ${(size / 1024 / 1024).toFixed(1)}MB → shorts.mp4`)
    return videoPath
  } catch (err) {
    const stderr = err.stderr?.toString() || ''
    console.log(`  ✗ Error: ${stderr.slice(0, 200)}`)
    return null
  }
}

async function main() {
  console.log('\n  ╔═══════════════════════════════════════════════╗')
  console.log('  ║     PROFESSIONAL YOUTUBE SHORTS v2           ║')
  console.log('  ║  9 videos · Ken Burns zoom · HD voiceover    ║')
  console.log('  ╚═══════════════════════════════════════════════╝\n')

  fs.mkdirSync(SHORTS_DIR, { recursive: true })
  const results = []

  for (let i = 0; i < ARTICLES.length; i++) {
    console.log(`  [${i+1}/${ARTICLES.length}] ${ARTICLES[i].title}`)
    const r = await createShort(ARTICLES[i])
    if (r) results.push(r)
  }

  console.log(`\n  ╔═══════════════════════════════════════════════╗`)
  console.log(`  ║  DONE! ${results.length}/9 Shorts generated ✓  ║`)
  console.log(`  ╚═══════════════════════════════════════════════╝\n`)
}

main().catch(console.error)
