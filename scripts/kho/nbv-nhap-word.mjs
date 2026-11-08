// ============================================================================
// nbv-nhap-word.mjs — NHẬP câu đã TÁCH từ file Word NBV (đề + lời giải trong cùng file) vào kho Đại, dạng chờ.
//
//   node scripts/kho/nbv-nhap-word.mjs --in <parse.json> --docx <thư mục chứa .docx> [--chu-de NCD00095] [--ghi]
//
// parse.json = mảng { file, so, loai, ten_de_goc, noi_dung, lua_chon?, dap_an?, loi_giai?, menh_de?, img_de[], img_lg[], loi[] }
//   (do bước tách sinh ra; câu có `loi` ≠ [] là câu bước tách KHÔNG chắc ⇒ bỏ, liệt kê, không ghi).
// Hành vi (Thùy 18/10):
//   · Mọi câu vào DẠNG CHỜ của khối 12 (kho-rules/README: giải trước, gán dạng sau), da_duyet=false, nguon='le' + ten_de_goc
//     ⇒ trigger gán nguon_loai='tai_lieu'. Chạy lại không nhân đôi (insertCauBatch lọc trùng nội dung + phương án + mệnh đề).
//   · Hình trong Word (word/media) ghép DỌC thành 1 PNG: ảnh ở phần đề ⇒ anh_de, ảnh ở lời giải ⇒ anh_dap_an. Upload kho-anh.
//   · Câu ĐÚNG/SAI KHÔNG vào kho dạng bài (4 ý ứng 4 dạng) ⇒ ghi thêm vào dai_bdm_kho_ds của chủ đề --chu-de (mig 202610182001).
// Không --ghi: CHẠY THỬ trong 1 transaction rồi ROLLBACK, không upload ảnh.
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { insertCauBatch } from '../_kho_insert.mjs'
import { bien } from './cau-hinh.mjs'

const require = createRequire(import.meta.url)
const JSZip = require('jszip')
const { PNG } = require('pngjs')

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const GHI = args.includes('--ghi')
const vao = opt('--in'), thuMucDocx = opt('--docx'), chuDe = opt('--chu-de', 'NCD00095')
if (!vao) { console.error('Dùng: node scripts/kho/nbv-nhap-word.mjs --in <parse.json> [--docx <thư mục .docx>] [--chu-de NCD..] [--ghi]  (mỗi câu có thể mang đường dẫn docx riêng ở trường "docx")'); process.exit(2) }

const cau = JSON.parse(fs.readFileSync(vao, 'utf8'))
const tot = cau.filter((o) => !o.loi?.length)
const bo = cau.filter((o) => o.loi?.length)
console.log(`đọc ${cau.length} câu · nhập được ${tot.length} · bỏ (tách không chắc) ${bo.length}`)

// ── EMF / WMF / JPG → PNG bằng GDI+ của Windows (PowerShell -Command, KHÔNG dùng file .ps1 vì máy chặn chạy script) ──
const PS_SANG_PNG = `
param()
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($env:NBV_VAO)
try {
  $w = [double]$img.Width; $h = [double]$img.Height
  if ($w -lt 1 -or $h -lt 1) { throw 'kich thuoc anh 0' }
  $k = [Math]::Max(1.0, 700 / $w)
  $W = [int][Math]::Ceiling($w * $k); $H = [int][Math]::Ceiling($h * $k)
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.SmoothingMode = 'HighQuality'; $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'; $g.TextRenderingHint = 'AntiAlias'
  $g.DrawImage($img, 0, 0, $W, $H)
  $bmp.Save($env:NBV_RA, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
} finally { $img.Dispose() }
`
function sangPng(buf, kieu) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nbvanh_'))
  try {
    const vaoF = path.join(dir, 'vao.' + kieu), raF = path.join(dir, 'ra.png')
    fs.writeFileSync(vaoF, buf)
    execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', PS_SANG_PNG], { env: { ...process.env, NBV_VAO: vaoF, NBV_RA: raF }, stdio: ['ignore', 'pipe', 'pipe'] })
    return fs.readFileSync(raF)
  } finally { fs.rmSync(dir, { recursive: true, force: true }) }
}

// ── hình: lấy từ word/media của đúng file docx, ghép dọc ──
const zips = new Map()
async function zipCua(file) {
  if (!zips.has(file)) {
    const p = file.toLowerCase().endsWith('.docx') ? file : path.join(thuMucDocx ?? '', file + '.docx')
    if (!fs.existsSync(p)) throw new Error('không thấy ' + p)
    zips.set(file, await JSZip.loadAsync(fs.readFileSync(p)))
  }
  return zips.get(file)
}
async function ghepAnh(file, ten) {
  if (!ten.length) return { buf: null }
  const z = await zipCua(file)
  const ps = []
  for (const t of ten) {
    const f = z.file('word/media/' + t)
    if (!f) return { loi: `không thấy word/media/${t}` }
    let b = await f.async('nodebuffer')
    // dò định dạng theo byte đầu (đuôi .tmp / .jpg có thể sai); không phải PNG ⇒ đổi bằng GDI+ (EMF/WMF/JPG)
    if (!(b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)) {
      const kieu = b[0] === 0xff && b[1] === 0xd8 ? 'jpg' : (b.toString('latin1', 40, 44) === ' EMF' ? 'emf' : (b[0] === 0xd7 && b[1] === 0xcd) || (b[0] === 0x01 && b[1] === 0x00) || (b[0] === 0x02 && b[1] === 0x00) ? 'wmf' : null)
      if (!kieu) return { loi: `ảnh ${t}: định dạng lạ` }
      try { b = sangPng(b, kieu) } catch (e) { return { loi: `ảnh ${t} (${kieu}): ${String(e.message).split('\n')[0]}` } }
    }
    ps.push(PNG.sync.read(b))
  }
  if (ps.length === 1) return { buf: PNG.sync.write(ps[0]), n: 1 }
  const GAP = 12, W = Math.max(...ps.map((p) => p.width)), H = ps.reduce((a, p) => a + p.height, 0) + GAP * (ps.length - 1)
  const out = new PNG({ width: W, height: H })
  out.data.fill(255)
  let y = 0
  for (const p of ps) { PNG.bitblt(p, out, 0, 0, p.width, p.height, Math.floor((W - p.width) / 2), y); y += p.height + GAP }
  return { buf: PNG.sync.write(out), n: ps.length }
}
const anh = new Map()
const loiAnh = []
for (const o of tot) {
  const file = o.docx || o.file
  const [d, l] = [await ghepAnh(file, o.img_de || []), await ghepAnh(file, o.img_lg || [])]
  if (d.loi || l.loi) { loiAnh.push(`${o.file.slice(0, 2)} ${o.so}: ${d.loi || l.loi}`); o.bo_anh = true; continue }
  anh.set(o, { de: d.buf, lg: l.buf })
  const luu = opt('--luu-anh')
  if (luu) {
    fs.mkdirSync(luu, { recursive: true })
    const ten = `${o.file.slice(0, 2).replace(/\W/g, '')}${o.so}`
    if (d.buf) fs.writeFileSync(path.join(luu, ten + '-de.png'), d.buf)
    if (l.buf) fs.writeFileSync(path.join(luu, ten + '-lg.png'), l.buf)
  }
}
const ok = tot.filter((o) => !o.bo_anh)
console.log(`ảnh: lỗi ${loiAnh.length}`, loiAnh.slice(0, 8))

// ── upload (chỉ --ghi) ──
let sb = null
if (GHI) {
  const env = {}
  for (const f of ['.env', '.env.local']) {
    const p = path.join(process.cwd(), f)
    if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '') }
  }
  const { createClient } = require('@supabase/supabase-js')
  if (!env.VITE_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE) { console.error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE (.env.local)'); process.exit(2) }
  sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
}
const up = async (buf) => {
  if (!buf) return null
  if (!sb) return 'dry://anh.png'
  const thang = new Date().toISOString().slice(0, 7)
  const p = `nhap_kho/${thang}/${randomUUID()}.png`
  const { error } = await sb.storage.from('kho-anh').upload(p, buf, { contentType: 'image/png', upsert: false })
  if (error) throw new Error('upload lỗi: ' + error.message)
  return sb.storage.from('kho-anh').getPublicUrl(p).data.publicUrl
}

// ── dựng cauList ──
const cauList = []
for (const o of ok) {
  const a = anh.get(o)
  const q = {
    dang_chinh: 'CHUA', khoi: '12', loai_cau: o.loai, noi_dung: o.noi_dung, nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: o.ten_de_goc,
    anh_de: await up(a.de), anh_dap_an: await up(a.lg),
  }
  if (o.lua_chon) q.lua_chon = o.lua_chon
  if (o.dap_an != null) q.dap_an = o.dap_an
  if (o.loi_giai) q.loi_giai = o.loi_giai
  if (o.menh_de) q.menh_de = o.menh_de.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, loi_giai: m.loi_giai || null }))
  cauList.push(q)
}

const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
const c = new pg.Client({ connectionString: url })
await c.connect()
await c.query('begin')
try {
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const moi = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !r.trung.some((t) => t.idx === x.i))
  console.log(`insert: mới ${moi.length} · trùng kho/lô ${r.trung.length} · dạng chờ ${r.chua_dang.length}`)
  if (r.trung.length) console.log('  trùng:', r.trung.slice(0, 10).map((t) => `${ok[t.idx].file.slice(0, 2)}${ok[t.idx].so}→${t.ma_cau_cu}`).join(' '))
  // Đ/S → kho Đúng/Sai của chủ đề
  const ds = moi.filter((x) => cauList[x.i].loai_cau === 'dung_sai').map((x) => x.m)
  if (ds.length) {
    const kc = await c.query(`select id from dai_bdm_chu_de where id = $1`, [chuDe])
    if (kc.rowCount !== 1) throw new Error('không có chủ đề ' + chuDe)
    const k = await c.query(`insert into dai_bdm_kho_ds (ma_cau, chu_de_id, nguon) select unnest($1::text[]), $2, 'ai' on conflict (ma_cau) do nothing`, [ds, chuDe])
    console.log(`kho Đúng/Sai ${chuDe}: +${k.rowCount}/${ds.length}`)
  }
  const dem = {}
  for (const x of moi) dem[cauList[x.i].loai_cau] = (dem[cauList[x.i].loai_cau] || 0) + 1
  console.log('theo loại:', JSON.stringify(dem))
  fs.writeFileSync(opt('--ra', 'nbv-nhap-ket-qua.json'), JSON.stringify({ moi: moi.map((x) => ({ ma_cau: x.m, file: ok[x.i].file, so: ok[x.i].so })), trung: r.trung, bo: bo.map((o) => ({ file: o.file, so: o.so, loi: o.loi })), loiAnh }, null, 1))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT (hãy đọc lại bằng kết nối riêng)' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
