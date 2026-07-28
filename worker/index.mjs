// ============================================================================
// WORKER GEN-LINK PDF (07-12, đời 2) — chạy NỀN, người dùng không chờ gì cả.
// ----------------------------------------------------------------------------
// Vòng đời 1 job:  linkgen_jobs(status='pending')  →  worker nhận ('processing')
//   → mở build của app (serve dist/ tại localhost) bằng Chrome thật (Puppeteer)
//     tại /#pvjob=<id>&loai=<loai>&at=<token>&rt=<token>  (PrintJobPage.tsx)
//   → chờ window.__pvState==='ready' (paged.js dựng xong)
//   → page.pdf({printBackground:true})  ← PDF CHỮ THẬT, ~trăm KB, đúng pixel bản
//     in tay "Microsoft Print to PDF" (cùng CSS + cùng engine in Chrome)
//   → upload bucket 'kho-tailieu' → ghi tai_lieu.file_url → XOÁ file cũ (chống
//     kho phình file mồ côi ~10-50MB/lần gen như đời html2canvas)
//   → job 'done'. Lỗi: attempt+1, quá MAX_ATTEMPTS → 'failed' + error (UI Kho
//     hiện "⚠ lỗi, bấm ↻" — không nuốt im lặng).
// Chạy:  node worker/index.mjs        (cần `npm run build` trước — serve dist/)
// Env:   đọc .env.local — VITE_SUPABASE_URL, VITE_SUPABASE_KEY, SUPABASE_SERVICE_ROLE,
//        VITE_DEV_ACCOUNTS (tài khoản đăng nhập cho phiên trong Chrome).
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer-core'
import { randomUUID } from 'node:crypto'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 4599
const MAX_ATTEMPTS = 3
const POLL_MS = 5000
const RENDER_TIMEOUT_MS = 90_000
const BUCKET = 'kho-tailieu'

// ── env (.env.local, gitignored) ────────────────────────────────────────────
const envRaw = readFileSync(join(root, '.env.local'), 'utf8')
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '')
const SB_URL = env('VITE_SUPABASE_URL')
const SB_ANON = env('VITE_SUPABASE_KEY')
const SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
const DEV_ACCOUNTS = env('VITE_DEV_ACCOUNTS') ?? ''
if (!SB_URL || !SB_ANON || !SB_SERVICE) { console.error('Thiếu VITE_SUPABASE_URL / VITE_SUPABASE_KEY / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(1) }
// tài khoản đầu tiên trong VITE_DEV_ACCOUNTS ("Tên|email|matkhau, ...") — phiên đăng nhập cho app trong Chrome
const [, WK_EMAIL, WK_PASS] = (DEV_ACCOUNTS.split(',')[0] ?? '').split('|').map((s) => s.trim())
if (!WK_EMAIL || !WK_PASS) { console.error('VITE_DEV_ACCOUNTS trống — worker cần 1 tài khoản để app render dữ liệu.'); process.exit(1) }

const svc = createClient(SB_URL, SB_SERVICE) // service role: đọc/ghi jobs + storage + tai_lieu, không vướng RLS
const auth = createClient(SB_URL, SB_ANON)   // anon: chỉ để đăng nhập lấy token cho phiên trong Chrome

// ── serve dist/ (build tĩnh của app) — không phụ thuộc dev server đang bật/tắt ──
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json' }
const dist = join(root, 'dist')
if (!existsSync(join(dist, 'index.html'))) { console.error('Chưa có dist/ — chạy `npm run build` trước.'); process.exit(1) }
createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0].split('#')[0])
  const file = join(dist, path === '/' ? 'index.html' : path)
  try {
    const body = readFileSync(file.startsWith(dist) && existsSync(file) ? file : join(dist, 'index.html'))
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch { res.writeHead(404); res.end() }
}).listen(PORT, () => console.log(`[worker] serve dist/ tại http://localhost:${PORT}`))

// ── Chrome thật (đã cài trên máy) — thử Chrome rồi Edge, không tải Chromium riêng ──
async function launchBrowser() {
  for (const channel of ['chrome', 'msedge']) {
    try { return await puppeteer.launch({ channel, headless: true }) } catch { /* thử kênh sau */ }
  }
  throw new Error('Không tìm thấy Chrome/Edge trên máy.')
}

const filePathOfUrl = (url) => { // .../object/public/kho-tailieu/<path> → <path> (để xoá file cũ)
  const m = url?.match(new RegExp(`/object/public/${BUCKET}/(.+)$`))
  return m ? decodeURIComponent(m[1]) : null
}

async function processJob(browser, job, session) {
  const t0 = Date.now()
  const page = await browser.newPage()
  try {
    const hash = `#pvjob=${job.tai_lieu_id}&loai=${encodeURIComponent(job.loai)}&at=${encodeURIComponent(session.access_token)}&rt=${encodeURIComponent(session.refresh_token)}`
    await page.goto(`http://localhost:${PORT}/${hash}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await page.waitForFunction(() => window.__pvState !== undefined, { timeout: RENDER_TIMEOUT_MS })
    const state = await page.evaluate(() => window.__pvState)
    if (state !== 'ready') throw new Error(state?.replace(/^error:/, '') || 'render lỗi không rõ')
    await new Promise((r) => setTimeout(r, 500)) // đệm nhỏ cho font/ảnh vẽ nốt sau tín hiệu ready

    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true, format: 'a4', margin: { top: 0, right: 0, bottom: 0, left: 0 } })

    // upload file MỚI trước, ghi file_url, rồi mới xoá file CŨ (thứ tự an toàn: lỗi giữa chừng
    // thì cùng lắm thừa 1 file, không bao giờ mất link đang dùng)
    const { data: tl, error: eTl } = await svc.from('tai_lieu').select('file_url').eq('id', job.tai_lieu_id).single()
    if (eTl) throw new Error('đọc tai_lieu: ' + eTl.message)
    const newPath = `${randomUUID()}.pdf`
    const { error: eUp } = await svc.storage.from(BUCKET).upload(newPath, pdf, { contentType: 'application/pdf', upsert: false })
    if (eUp) throw new Error('upload: ' + eUp.message)
    const url = svc.storage.from(BUCKET).getPublicUrl(newPath).data.publicUrl
    const { error: eSet } = await svc.from('tai_lieu').update({ file_url: url }).eq('id', job.tai_lieu_id)
    if (eSet) throw new Error('ghi file_url: ' + eSet.message)
    const oldPath = filePathOfUrl(tl?.file_url)
    if (oldPath && oldPath !== newPath) await svc.storage.from(BUCKET).remove([oldPath]) // dọn file cũ — chống kho phình

    await svc.from('linkgen_jobs').update({ status: 'done', error: null, updated_at: new Date().toISOString() }).eq('tai_lieu_id', job.tai_lieu_id)
    console.log(`[worker] ✅ ${job.loai} ${job.tai_lieu_id} — ${(pdf.length / 1024).toFixed(0)}KB, ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const attempt = job.attempt + 1
    const failed = attempt >= MAX_ATTEMPTS
    await svc.from('linkgen_jobs').update({ status: failed ? 'failed' : 'pending', attempt, error: msg, updated_at: new Date().toISOString() }).eq('tai_lieu_id', job.tai_lieu_id)
    console.log(`[worker] ${failed ? '❌ failed' : '↻ retry'} (${attempt}/${MAX_ATTEMPTS}) ${job.tai_lieu_id}: ${msg}`)
  } finally { await page.close().catch(() => {}) }
}

// ── vòng chính ───────────────────────────────────────────────────────────────
// Fail-fast: xác nhận đăng nhập được ngay lúc khởi động (sai mật khẩu thì biết liền, không đợi job).
{
  const { error: eAuth } = await auth.auth.signInWithPassword({ email: WK_EMAIL, password: WK_PASS })
  if (eAuth) { console.error('Đăng nhập worker lỗi:', eAuth.message); process.exit(1) }
  await auth.auth.signOut().catch(() => {})
}
console.log('[worker] đã đăng nhập, bắt đầu quét jobs mỗi', POLL_MS / 1000, 's')

const browser = await launchBrowser()
let busy = false
setInterval(async () => {
  if (busy) return
  busy = true
  try {
    const { data: jobs } = await svc.from('linkgen_jobs').select('*').eq('status', 'pending').order('updated_at').limit(1)
    const job = jobs?.[0]
    if (job) {
      // Đăng nhập MỚI TINH cho TỪNG job (~200ms) — refresh token Supabase là loại DÙNG-1-LẦN: trang in
      // trong Chrome nhận token qua setSession là nó "tiêu" luôn token đó (rotation), phiên Node dùng
      // chung sẽ chết theo → job sau dính "Auth session missing" (bug thật 07-12, ET đầu chạy được rồi
      // các job sau chết cả loạt). Mỗi job 1 phiên riêng thì trang in muốn xoay token gì cũng kệ.
      const { data: si, error: eSi } = await auth.auth.signInWithPassword({ email: WK_EMAIL, password: WK_PASS })
      if (eSi || !si.session) throw new Error('đăng nhập cho job lỗi: ' + (eSi?.message ?? 'không có session'))
      await svc.from('linkgen_jobs').update({ status: 'processing', updated_at: new Date().toISOString() }).eq('tai_lieu_id', job.tai_lieu_id)
      await processJob(browser, job, si.session)
    }
  } catch (e) { console.error('[worker] vòng quét lỗi:', e instanceof Error ? e.message : e) }
  finally { busy = false }
}, POLL_MS)
