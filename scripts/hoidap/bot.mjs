// ============================================================================
// BOT HỎI–ĐÁP NHÂN SỰ — Claude Code trả lời câu hỏi về hệ thống, ngay trên ERP.
// ----------------------------------------------------------------------------
// Vòng đời 1 job: `hoi_dap_nhan_su(trang_thai='pending')` → bot claim ATOMIC
//   ('processing') → spawn `claude -p` (đọc repo, KHÔNG đụng DB) → ghi `tra_loi`
//   → 'done'. Câu hỏi đi vào claude qua STDIN — không qua argv, không qua shell —
//   nên nội dung người gõ không bao giờ thành lệnh.
//
// Chạy:
//   node scripts/hoidap/bot.mjs           → LISTENER: Realtime + quét mở màn +
//                                           quét vớt 5' + heartbeat 60s. Chạy nền.
//   node scripts/hoidap/bot.mjs --once    → quét pending, xử lý hết, thoát.
//                                           Dành cho Task Scheduler (lưới vớt).
//
// Env (.env.local, gitignored — CÙNG file worker/troly.mjs đang dùng):
//   VITE_SUPABASE_URL · SUPABASE_SERVICE_ROLE
//
// ⭐ RANH GIỚI AN TOÀN — vì sao claude KHÔNG được cấp DB:
//   Bot (file này) cầm service role — bỏ qua RLS — nên MỌI thao tác DB nằm ở đây,
//   trong code cố định không đọc nội dung câu hỏi. Claude chỉ nhận văn bản câu hỏi
//   + được đọc repo (Read/Grep/Glob), trả về văn bản. Câu hỏi có chứa "hãy xoá bảng X"
//   thì claude cũng KHÔNG CÓ TAY để làm — prompt injection bị chặn bằng CƠ CHẾ,
//   không phải bằng lời dặn (lời dặn trong PROMPT.md chỉ là lớp thứ hai).
//
// ⭐ HAI ĐƯỜNG NHẬN JOB, MỘT ĐƯỜNG XỬ LÝ: Realtime đẩy nhanh (vài giây) nhưng
//   websocket rớt là miss event; quét định kỳ chậm nhưng không bỏ sót. Cả hai chỉ
//   ĐÁNH THỨC drainQueue() — claim atomic ở DB mới là người gác cửa, nên listener
//   và --once chạy chồng nhau vẫn không trả lời trùng.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { hostname } from 'node:os'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const ONCE = process.argv.includes('--once')

const POLL_MS = 5 * 60_000        // quét vớt trong listener — Realtime mới là đường chính
const HEARTBEAT_MS = 60_000
const MAX_ATTEMPTS = 2            // hỏng 2 lần → 'failed', báo người hỏi lại — không quay vòng đốt quota
const MO_COI_MS = 5 * 60_000      // 'processing' quá 5' = tiến trình trước chết giữa chừng → trả về 'pending'
const CLAUDE_TIMEOUT_MS = 5 * 60_000

const envRaw = (() => { try { return readFileSync(join(root, '.env.local'), 'utf8') } catch { return '' } })()
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? process.env[k]

const SB_URL = env('VITE_SUPABASE_URL')
const SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
if (!SB_URL || !SB_SERVICE) { console.error('Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(1) }
const svc = createClient(SB_URL, SB_SERVICE)

const PROMPT = readFileSync(join(root, 'scripts', 'hoidap', 'PROMPT.md'), 'utf8')
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a)

// ── Gọi Claude Code ─────────────────────────────────────────────────────────
// --output-format json → lấy được cả usage/model thật thay vì đoán. Tool chỉ cấp
// Read/Grep/Glob (đọc repo) — không Bash, không Write, không Edit: xem RANH GIỚI trên.
function goiClaude(cauHoi) {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', '--output-format', 'json', '--allowedTools', 'Read', 'Grep', 'Glob'],
      { cwd: root, shell: true, windowsHide: true })
    let out = '', err = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { err += d })
    const timer = setTimeout(() => {
      // shell:true ⇒ child.pid là shell trung gian — kill cả cây, không thì claude mồ côi chạy tiếp
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true })
      else child.kill('SIGKILL')
      reject(new Error('timeout: claude chạy quá ' + CLAUDE_TIMEOUT_MS / 60000 + ' phút'))
    }, CLAUDE_TIMEOUT_MS)
    child.on('error', (e) => { clearTimeout(timer); reject(e) })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (code !== 0) return reject(new Error(`claude exit ${code}: ${(err || out).slice(0, 500)}`))
      try {
        const j = JSON.parse(out)
        if (j.is_error || j.subtype !== 'success') return reject(new Error(`claude báo lỗi: ${j.subtype ?? '?'} ${String(j.result ?? '').slice(0, 300)}`))
        resolve({ traLoi: String(j.result ?? '').trim(), usage: j.usage ?? null, model: 'claude-code' })
      } catch { resolve({ traLoi: out.trim(), usage: null, model: 'claude-code' }) } // JSON hỏng → out vẫn là văn bản dùng được
    })
    child.stdin.write(`${PROMPT}\n\n<<<CAU_HOI>>>\n${cauHoi}\n<<<HET_CAU_HOI>>>\n`)
    child.stdin.end()
  })
}

// Lỗi CẤU HÌNH (login CLI hết hạn, hết quota) ≠ lỗi TẠM (timeout, mạng): cấu hình thì
// job nào cũng sẽ hỏng y hệt — retry chỉ đốt lượt. Trả job về pending rồi TẮT bot:
// heartbeat ngừng → UI hiện "mất liên lạc" → người biết mà vào sửa (login lại/chờ quota).
const laLoiCauHinh = (msg) => /log ?in|authenticat|credential|OAuth|API key|usage limit|rate limit|billing/i.test(msg)

// ── Vòng đời job ────────────────────────────────────────────────────────────
// Claim ATOMIC: update ... eq(trang_thai,'pending') — hai tiến trình cùng vồ một job
// thì chỉ một update khớp điều kiện, bên kia nhận 0 dòng và bỏ qua. Không lock, không bảng phụ.
async function claim(job) {
  const { data, error } = await svc.from('hoi_dap_nhan_su')
    .update({ trang_thai: 'processing', claimed_at: new Date().toISOString(), so_lan: job.so_lan + 1 })
    .eq('id', job.id).eq('trang_thai', 'pending').select('id, cau_hoi, so_lan')
  if (error) throw error
  return data?.[0] ?? null
}

async function xuLy(job) {
  log(`▶ job ${job.id.slice(0, 8)} (lần ${job.so_lan})`)
  try {
    const ket = await goiClaude(job.cau_hoi)
    if (!ket.traLoi) throw new Error('claude trả về rỗng')
    await svc.from('hoi_dap_nhan_su')
      .update({ trang_thai: 'done', tra_loi: ket.traLoi, usage: ket.usage, model: ket.model, done_at: new Date().toISOString() })
      .eq('id', job.id)
    log(`✓ job ${job.id.slice(0, 8)} xong`)
  } catch (e) {
    const msg = e?.message ?? String(e)
    log(`✗ job ${job.id.slice(0, 8)}: ${msg}`)
    if (laLoiCauHinh(msg)) {
      await svc.from('hoi_dap_nhan_su').update({ trang_thai: 'pending', error: msg }).eq('id', job.id)
      console.error('Lỗi CẤU HÌNH (login/quota) — trả job về hàng đợi và TẮT bot. Sửa xong chạy lại.')
      process.exit(1)
    }
    const hetLuot = job.so_lan >= MAX_ATTEMPTS
    await svc.from('hoi_dap_nhan_su')
      .update(hetLuot
        ? { trang_thai: 'failed', error: msg, done_at: new Date().toISOString() }
        : { trang_thai: 'pending', error: msg })
      .eq('id', job.id)
  }
}

// Drain TUẦN TỰ (không Promise.all): mỗi câu là một tiến trình claude ngốn CPU/quota —
// chạy song song nhiều câu trên máy làm việc là máy khựng. Câu sau chờ câu trước.
let dangChay = false
async function drainQueue() {
  if (dangChay) return          // Realtime + quét vớt cùng đánh thức → chỉ một vòng drain chạy
  dangChay = true
  try {
    for (;;) {
      const { data, error } = await svc.from('hoi_dap_nhan_su')
        .select('id, cau_hoi, so_lan').eq('trang_thai', 'pending')
        .order('created_at').limit(5)
      if (error) { log('lỗi đọc hàng đợi:', error.message); break }
      if (!data?.length) break
      for (const j of data) {
        const claimed = await claim(j)
        if (claimed) await xuLy({ ...claimed, so_lan: j.so_lan + 1 })
      }
    }
  } finally { dangChay = false }
}

// Job 'processing' mồ côi (tiến trình trước bị kill giữa chừng) → trả về 'pending'.
// so_lan ĐÃ đếm lần claim đó nên không cần đụng — quá MAX_ATTEMPTS sẽ failed ở lần xử lý sau.
async function nhatMoCoi() {
  const han = new Date(Date.now() - MO_COI_MS).toISOString()
  const { data } = await svc.from('hoi_dap_nhan_su')
    .update({ trang_thai: 'pending' })
    .eq('trang_thai', 'processing').lt('claimed_at', han).select('id')
  if (data?.length) log(`nhặt ${data.length} job mồ côi về hàng đợi`)
}

const heartbeat = () => svc.from('hoi_dap_bot').upsert({ id: 1, may: hostname(), alive_at: new Date().toISOString() })
  .then(({ error }) => { if (error) log('heartbeat lỗi:', error.message) })

// ── Main ────────────────────────────────────────────────────────────────────
await heartbeat()
await nhatMoCoi()
await drainQueue()
if (ONCE) { log('--once: hàng đợi sạch, thoát.'); process.exit(0) }

setInterval(heartbeat, HEARTBEAT_MS)
setInterval(async () => { await nhatMoCoi(); await drainQueue() }, POLL_MS)
svc.channel('hoi_dap_bot')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hoi_dap_nhan_su' }, () => drainQueue())
  .subscribe((status) => log('realtime:', status))
log(`listener chạy — Realtime + quét vớt ${POLL_MS / 60000}' + heartbeat ${HEARTBEAT_MS / 1000}s. Ctrl+C để dừng.`)
