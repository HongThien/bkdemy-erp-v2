// Sinh icon + splash cho APK Android từ public/icon-512.png (nguồn duy nhất, cùng icon PWA).
// Chạy: node scripts/android/gen-icons.mjs [hs|ta]  (mặc định hs — sau `npx cap add android` hoặc khi đổi icon).
// Splash nền = `backgroundColor` của app trong capacitor.config.ts (trùng background_color PWA manifest).
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { APPS } from '../../capacitor.config.ts'

const key = process.argv[2] ?? 'hs'
const app = APPS[key]
if (!app) { console.error(`✗ app "${key}" không hợp lệ — chọn: ${Object.keys(APPS).join(', ')}`); process.exit(1) }

const RES = join(app.androidPath, 'app/src/main/res')
const SRC = 'public/icon-512.png'
const BG_ICON = '#ffffff'   // nền adaptive icon (icon gốc trong suốt)
const BG_SPLASH = app.backgroundColor

const img = await loadImage(SRC)
const out = (dir, name, canvas) => { mkdirSync(join(RES, dir), { recursive: true }); writeFileSync(join(RES, dir, name), canvas.toBuffer('image/png')) }

function square(size, bg, scale, round = false) {
  const c = createCanvas(size, size); const g = c.getContext('2d')
  if (bg) {
    g.fillStyle = bg
    if (round) { g.beginPath(); g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); g.fill() }
    else g.fillRect(0, 0, size, size)
  }
  const s = size * scale, o = (size - s) / 2
  g.drawImage(img, o, o, s, s)
  return c
}

// mipmap: legacy launcher 48dp base · foreground adaptive 108dp base (safe zone 66dp ⇒ icon ~56%)
const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 }
for (const [d, k] of Object.entries(DENS)) {
  out(`mipmap-${d}`, 'ic_launcher.png', square(Math.round(48 * k), BG_ICON, 0.78))
  out(`mipmap-${d}`, 'ic_launcher_round.png', square(Math.round(48 * k), BG_ICON, 0.7, true))
  out(`mipmap-${d}`, 'ic_launcher_foreground.png', square(Math.round(108 * k), null, 0.56))
}

// splash: portrait/landscape mỗi density + drawable/splash.png mặc định
function splash(w, h) {
  const c = createCanvas(w, h); const g = c.getContext('2d')
  g.fillStyle = BG_SPLASH; g.fillRect(0, 0, w, h)
  const s = Math.round(Math.min(w, h) * 0.28), x = (w - s) / 2, y = (h - s) / 2
  g.drawImage(img, x, y, s, s)
  return c
}
const PORT = { mdpi: [320, 480], hdpi: [480, 800], xhdpi: [720, 1280], xxhdpi: [960, 1600], xxxhdpi: [1280, 1920] }
for (const [d, [w, h]] of Object.entries(PORT)) {
  out(`drawable-port-${d}`, 'splash.png', splash(w, h))
  out(`drawable-land-${d}`, 'splash.png', splash(h, w))
}
out('drawable', 'splash.png', splash(1280, 1920))

// nền adaptive icon (Capacitor template mặc định màu xanh)
writeFileSync(join(RES, 'values/ic_launcher_background.xml'),
  '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FFFFFF</color>\n</resources>\n')
console.log(`✓ [${key}] icons + splash → ${RES}`)
