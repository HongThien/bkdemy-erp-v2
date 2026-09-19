// ============================================================================
// kho_anh.mjs — cắt HÌNH VẼ từ trang PDF và upload lên Supabase Storage (bucket kho-anh),
// trả URL để gắn vào câu (anh_de / anh_dap_an) khi nhập kho. CEO 13/09: "hình vẽ xử lý
// như nào? không thấy câu nào có hình" → trước đó câu phụ thuộc hình bị BỎ vì luồng chỉ có chữ.
//
// Cách dùng (Claude gọi trong /nhap-kho):
//   node scripts/kho_anh.mjs cat --pdf <file.pdf> --page 20 --bbox 0.38,0.17,0.66,0.44 --out <png>
//       Render trang bằng pdftoppm (poppler, có trên PATH) rồi cắt theo bbox = TỶ LỆ trang
//       (x0,y0,x1,y1 trong [0,1], gốc trên-trái) → không phụ thuộc DPI. Claude đọc trang PDF
//       (ảnh ~827×1169) ước lượng khung, chừa mép ~2%. Xem lại PNG (Read) trước khi upload.
//   node scripts/kho_anh.mjs up --png <png> [--ten <nhan>]
//       Upload lên kho-anh/nhap_kho/<YYYY-MM>/<uuid>.png bằng SUPABASE_SERVICE_ROLE (.env.local —
//       anon key bị RLS chặn INSERT storage.objects). In JSON { ok, url }.
//   node scripts/kho_anh.mjs anh --pdf ... --page N --bbox ... [--out <png>]   = cat + up một lệnh.
//
// Quy ước: ảnh chỉ là URL trong DB (không base64) — đúng convention uploadKhoImage (api.ts).
// Service role KHÔNG được in ra / ghi log. Chỉ dùng cho storage, không đụng DB.
// ============================================================================
import { readFileSync, writeFileSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { join, basename } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PNG } from 'pngjs'
import { createClient } from '@supabase/supabase-js'

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1]; if (!n || n.startsWith('--')) args[k] = true; else { args[k] = n; i++ } }
    else args._.push(a)
  }
  return args
}
function loadEnv() {
  const env = {}
  for (const f of ['.env', '.env.local']) {
    if (!existsSync(f)) continue
    for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) {
      if (!l.includes('=') || l.trim().startsWith('#')) continue
      const i = l.indexOf('='); env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
    }
  }
  return env
}
const out = (o) => process.stdout.write(JSON.stringify(o, null, 2) + '\n')
const die = (msg, code = 2) => { console.error('❌ ' + msg); process.exit(code) }

/** Render 1 trang → PNG buffer (pdftoppm), cắt theo bbox tỷ lệ. */
export function catHinh({ pdf, page, bbox, dpi = 150 }) {
  if (!existsSync(pdf)) die(`không thấy PDF: ${pdf}`)
  const [x0, y0, x1, y1] = bbox.split(',').map(Number)
  if (![x0, y0, x1, y1].every((v) => v >= 0 && v <= 1) || x1 <= x0 || y1 <= y0) die(`bbox phải là 4 tỷ lệ 0..1 tăng dần: ${bbox}`)
  const dir = mkdtempSync(join(tmpdir(), 'kho_anh_'))
  try {
    execFileSync('pdftoppm', ['-f', String(page), '-l', String(page), '-r', String(dpi), '-png', pdf, join(dir, 'p')], { stdio: ['ignore', 'ignore', 'ignore'] })
    const f = readdirSync(dir).find((x) => x.endsWith('.png'))
    if (!f) die(`pdftoppm không ra ảnh cho trang ${page}`)
    const src = PNG.sync.read(readFileSync(join(dir, f)))
    const X0 = Math.floor(x0 * src.width), Y0 = Math.floor(y0 * src.height)
    const X1 = Math.ceil(x1 * src.width), Y1 = Math.ceil(y1 * src.height)
    const w = X1 - X0, h = Y1 - Y0
    const dst = new PNG({ width: w, height: h })
    for (let y = 0; y < h; y++) {
      const si = ((Y0 + y) * src.width + X0) * 4, di = (y * w) * 4
      src.data.copy(dst.data, di, si, si + w * 4)
    }
    return { buf: PNG.sync.write(dst), w, h, pageW: src.width, pageH: src.height }
  } finally { rmSync(dir, { recursive: true, force: true }) }
}

export async function upHinh(buf, ten = '') {
  const env = loadEnv()
  const url = env.VITE_SUPABASE_URL, key = env.SUPABASE_SERVICE_ROLE
  if (!url || !key) die('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local')
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const thang = new Date().toISOString().slice(0, 7)
  const path = `nhap_kho/${thang}/${randomUUID()}${ten ? '_' + ten.replace(/[^a-zA-Z0-9_-]/g, '') : ''}.png`
  const { error } = await sb.storage.from('kho-anh').upload(path, buf, { contentType: 'image/png', upsert: false })
  if (error) die(`upload lỗi: ${error.message}`, 4)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

const args = parseArgs(process.argv.slice(2))
const cmd = args._[0]
if (cmd === 'cat' || cmd === 'anh') {
  if (!args.pdf || !args.page || !args.bbox) die('cần --pdf --page --bbox [--out] [--dpi]')
  const r = catHinh({ pdf: args.pdf, page: Number(args.page), bbox: args.bbox, dpi: Number(args.dpi || 150) })
  const outPng = args.out || join(tmpdir(), `kho_anh_${basename(args.pdf).replace(/\.pdf$/i, '')}_p${args.page}.png`)
  writeFileSync(outPng, r.buf)
  if (cmd === 'cat') out({ ok: true, png: outPng, w: r.w, h: r.h, trang: { w: r.pageW, h: r.pageH } })
  else out({ ok: true, png: outPng, w: r.w, h: r.h, url: await upHinh(r.buf, args.ten) })
} else if (cmd === 'up') {
  if (!args.png || !existsSync(args.png)) die('cần --png <file tồn tại>')
  out({ ok: true, url: await upHinh(readFileSync(args.png), args.ten) })
} else {
  console.log('Dùng: kho_anh.mjs cat|up|anh — xem đầu file'); process.exit(2)
}
