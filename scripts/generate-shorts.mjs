import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const BASE_DIR = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
const PINS_DIR = path.join(BASE_DIR, 'generated-pins')
const SHORTS_DIR = path.join(BASE_DIR, 'shorts')
const FFMPEG = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffmpeg.exe'

const ARTICLES = [
  { num: '01', title: 'Best Keto Coffee for Weight Loss: Our 30-Day Test Results', slug: 'post-01-best-keto-coffee-for-weight-loss--our-30-day-test-', 
    script: 'We tested the best keto coffee for 30 days. The results are incredible. This special coffee blend helps you burn fat faster, gives you clean energy, and stops cravings. Our top pick has 12000 verified reviews on Amazon with a star rating. Try it today and see the difference.' },
  { num: '02', title: 'Where to Buy Keto Coffee Online — Best Price & Deals', slug: 'post-02-where-to-buy-keto-coffee-online--best-price-and-di',
    script: 'Where can you buy keto coffee at the best price? We found the cheapest deals online. The best keto coffee costs less than a dollar per serving. Plus there are coupon codes that save you up to fifty percent. Click the link to get the best price right now.' },
  { num: '03', title: 'Keto Coffee Side Effects: What to Expect and How to Avoid', slug: 'post-03-keto-coffee-side-effects-what-to-expect-and-how-to',
    script: 'Does keto coffee have side effects? Some people feel bloated on day one. Others get mild headaches. This is completely normal. Our guide shows you exactly how to avoid these issues. Start slow and follow our tips for a smooth experience.' },
  { num: '04', title: 'Keto Coffee for Women: The Complete Weight Loss Guide', slug: 'post-04-keto-coffee-for-women-the-complete-weight-loss-gui',
    script: 'Keto coffee works differently for women. Female bodies need a special approach to ketosis. Our complete guide covers the best routine for women over thirty. Get the results you want without the struggle. Read the full guide on our blog.' },
  { num: '05', title: 'Keto Coffee for Beginners: Everything You Need to Know', slug: 'post-05-keto-coffee-for-beginners-everything-you-need-to-k',
    script: 'New to keto coffee? Here is everything you need to know. You blend it with butter and oil. Never stir it. Drink it in the morning on an empty stomach. It keeps you full until lunch and gives you steady energy. Start your journey today.' },
  { num: '06', title: 'Keto Coffee vs Regular Coffee: Which Is Better for Weight Loss?', slug: 'post-06-keto-coffee-vs-regular-coffee-which-is-better-for-',
    script: 'Keto coffee versus regular coffee. Which one helps you lose weight? Regular coffee has zero calories but no fat burning effect. Keto coffee with MCT oil puts your body into fat burning mode. Scientists confirm it works. Make the switch today.' },
  { num: '07', title: 'How to Make the Perfect Cup of Keto Coffee: 3 Easy Recipes', slug: 'post-07-how-to-make-the-perfect-cup-of-keto-coffee-3-easy-',
    script: 'Learn how to make the perfect keto coffee in three easy recipes. Number one classic bulletproof coffee. Number two chocolate keto latte. Number three iced keto coffee. Each takes less than two minutes. Watch the tutorial on our blog.' },
  { num: '08', title: 'Does Keto Coffee Really Work? The Science Behind the Hype', slug: 'post-08-does-keto-coffee-really-work-the-science-behind-th',
    script: 'Does keto coffee really work or is it just hype? Science says yes. The MCT oil in keto coffee increases ketone production by up to three hundred percent. This means more fat burning all day long. Read the science on our website.' },
  { num: '09', title: 'Keto Coffee Discount & Coupon Codes — Save Up to 50%', slug: 'post-09-keto-coffee-discount-and-coupon-codes--save-up-to-',
    script: 'Get keto coffee at half price. We found active coupon codes that save you up to fifty percent. Limited time offer. The best keto coffee is currently on sale with free shipping. Click the link to get the discount before it expires.' },
]

async function generateVoiceover(text, outputPath) {
  const psScript = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice("Microsoft Zira Desktop")
$s.SetOutputToWaveFile("${outputPath.replace(/\\/g, '\\\\')}")
$s.Speak("${text.replace(/"/g, '\\"')}")
$s.Dispose()
`
  const psFile = path.join(BASE_DIR, 'tts.ps1')
  fs.writeFileSync(psFile, psScript)
  execSync(`powershell -ExecutionPolicy Bypass -File "${psFile}"`, { stdio: 'pipe' })
  fs.unlinkSync(psFile)

  const wavSize = fs.statSync(outputPath).size
  return wavSize > 1000
}

async function createShortsVideo(article, design) {
  const articleDir = path.join(PINS_DIR, `article-${article.num}`)
  const imgPath = path.join(articleDir, `${design}.png`)
  if (!fs.existsSync(imgPath)) {
    console.log(`  ✗ No image: ${imgPath}`)
    return null
  }

  const outDir = path.join(SHORTS_DIR, `article-${article.num}`)
  fs.mkdirSync(outDir, { recursive: true })

  // Generate voiceover
  const voicePath = path.join(outDir, `voice-${design}.wav`)
  console.log(`  Generating voiceover...`)
  const ok = await generateVoiceover(article.script, voicePath)
  if (!ok) {
    console.log(`  ✗ Voiceover failed`)
    return null
  }

  // Get audio duration using ffprobe
  let duration = 30
  try {
    const probe = execSync(`"${FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe')}" -v error -show_entries format=duration -of csv=p=0 "${voicePath}"`, { stdio: 'pipe' }).toString().trim()
    duration = Math.ceil(parseFloat(probe))
  } catch {}

  // Create video: image + voiceover
  const videoPath = path.join(outDir, `${design}.mp4`)
  const cmd = `"${FFMPEG}" -loop 1 -i "${imgPath}" -i "${voicePath}" -c:v libx264 -c:a aac -b:a 128k -t ${duration} -pix_fmt yuv420p -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,drawtext=text='${article.title}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h-th-100:box=1:boxcolor=black@0.5,drawtext=text='%{pts\\:gmtime\\:0\\:%S}':fontcolor=white:fontsize=24:x=w-tw-20:y=20:enable='gte(t,1)'" -shortest "${videoPath}"`

  console.log(`  Rendering video (${duration}s)...`)
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 120000 })
    console.log(`  ✓ Saved: ${videoPath}`)
    return videoPath
  } catch (err) {
    console.log(`  ✗ FFmpeg error: ${err.stderr?.toString().slice(0, 200)}`)
    return null
  }
}

async function main() {
  console.log('=== YouTube Shorts Generator ===\n')

  fs.mkdirSync(SHORTS_DIR, { recursive: true })

  for (let i = 0; i < ARTICLES.length; i++) {
    const article = ARTICLES[i]
    console.log(`\n[${i + 1}/${ARTICLES.length}] ${article.title}`)

    // Use the first design (classic) for each article
    const videoPath = await createShortsVideo(article, 'classic')
    if (videoPath) {
      console.log(`  ✓ Shorts video ready`)
    }
  }

  console.log('\n=== Done! ===')
}

main()
