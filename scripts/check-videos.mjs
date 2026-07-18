import { execSync } from 'child_process'

const FFPROBE = 'C:\\Users\\mohel\\Desktop\\EXPER-GOLD\\traffic-monster-source\\node_modules\\@ffmpeg-installer\\win32-x64\\ffprobe.exe'
const BASE = 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\pro-shorts-hd'

const articles = ['01','02','03','04','05','06','07','08','09']

for (const a of articles) {
  const fp = `${BASE}\\article-${a}\\shorts.mp4`
  try {
    const info = execSync(`"${FFPROBE}" -v error -show_entries format=duration,bit_rate:stream=codec_name,width,height,codec_type -of csv=p=0 "${fp}"`, { stdio: 'pipe' }).toString().trim()
    const lines = info.split('\n')
    const videoStream = lines.find(l => l.includes('h264') || l.includes('Video'))
    const audioStream = lines.find(l => l.includes('aac') || l.includes('Audio'))
    const formatLine = lines[0] || ''
    const dur = parseFloat(formatLine.split(',')[0] || 0).toFixed(1)
    const size = (await import('fs')).statSync(fp).size
    console.log(`article-${a}: ${dur}s, ${(size/1024/1024).toFixed(1)}MB`)
  } catch {
    console.log(`article-${a}: FAILED`)
  }
}
