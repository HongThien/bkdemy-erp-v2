// ============================================================================
// BOT PHIÊN CLAUDE — trưởng khối chat thẳng với Claude Code trên ERP (spec-phong-truong-khoi.md).
// ----------------------------------------------------------------------------
// Vòng đời 1 lượt: trưởng khối gửi tin (fn_phien_gui → claude_phien_tin 'cho') → bot nhận ATOMIC
//   mọi tin chờ của phiên (fn_phien_bot_nhan → 'dang_xu') → chạy `claude -p` TIẾP NỐI đúng session
//   của phiên (lượt đầu --session-id <id phiên>, sau đó --resume) → chữ Claude viết ra được đẩy dần
//   vào 1 tin vai 'claude' (cập nhật ~1 giây/lần, màn hình thấy chữ chạy) → xong thì tin 'xong',
//   việc 'xong'. Tin đi vào claude qua STDIN — không qua argv/shell — nên người gõ gì cũng không thành lệnh.
//
// Chạy (máy Thùy, cùng .env.local với bot hỏi–đáp):
//   node scripts/phien/bot.mjs           → LISTENER: Realtime + quét vớt + heartbeat. Chạy nền.
//   node scripts/phien/bot.mjs --once    → làm hết việc đang chờ rồi thoát (Task Scheduler / thử tay).
//
// Env (.env.local):
//   VITE_SUPABASE_URL · SUPABASE_SERVICE_ROLE                     (bắt buộc)
//   CLAUDE_BIN            đường dẫn claude.exe nếu cài chỗ lạ
//   PHIEN_SONG_SONG       số phiên chạy cùng lúc (mặc định 1 — một subscription, chung hạn mức với Thùy)
//   PHIEN_TIMEOUT_PHUT    trần một lượt (mặc định 30)
//   PHIEN_TAI_LIEU_DIR    thư mục tài liệu cho Claude đọc (vd E:\BK ACADEMY\Tài liệu tham khảo), nhiều thư mục cách nhau ';'
//   PHIEN_MODEL           ép model (bỏ trống = mặc định của Claude Code)
//   PHIEN_DUNG_API=1      dùng ANTHROPIC_API_KEY thay cho login subscription (mặc định: subscription — Thùy 01/11)
//   PHIEN_TU_TIEP         số lượt Claude TỰ làm tiếp tối đa sau mỗi tin của người (mặc định 6; 0 = tắt)
//
// ⭐ RANH GIỚI AN TOÀN (đừng nới — xem README cùng thư mục):
//   Claude được: Read/Grep/Glob trong repo (+ thư mục tài liệu) và ĐÚNG MỘT lệnh Bash
//   `node scripts/phien/ban-do.mjs …`. Không Write/Edit, không Bash tự do, không đọc .env*.
//   ban-do.mjs đọc mã phiên từ biến môi trường PHIEN_ID do BOT đặt (Claude không đổi được — lệnh
//   được phép phải BẮT ĐẦU bằng `node scripts/…`) rồi gọi RPC fn_phien_bd_* — rào thật nằm ở DB:
//   phiên mở, đóng vai người mở phiên, kiểm lại quyền trưởng khối, nút phải thuộc đúng khối, không có lệnh xoá.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { hostname } from 'node:os'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const ONCE = process.argv.includes('--once')

const envRaw = (() => { try { return readFileSync(join(root, '.env.local'), 'utf8') } catch { return '' } })()
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? process.env[k]

const SB_URL = env('VITE_SUPABASE_URL')
const SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
if (!SB_URL || !SB_SERVICE) { console.error('Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(1) }
const svc = createClient(SB_URL, SB_SERVICE)

const SONG_SONG = Math.max(1, Number(env('PHIEN_SONG_SONG') ?? 1) || 1)
const TIMEOUT_MS = Math.max(5, Number(env('PHIEN_TIMEOUT_PHUT') ?? 30) || 30) * 60_000
const TOI_DA_LAN = 2                       // hỏng 2 lần liên tiếp → 'loi', không quay vòng đốt hạn mức
const POLL_MS = 60_000                     // quét vớt — Realtime mới là đường chính
const HEARTBEAT_MS = 60_000
const DAY_MS = 1000                        // nhịp đẩy chữ đang viết lên DB (màn thấy chữ chạy)
const TAI_LIEU = (env('PHIEN_TAI_LIEU_DIR') ?? '').split(';').map((s) => s.trim()).filter(Boolean)
const MODEL = env('PHIEN_MODEL')
// Lượt TỰ ĐỘNG tối đa sau mỗi tin của người (Claude kết thúc bằng [[TIEP]] khi còn việc dài như phân hết kho). Chặn đốt hạn mức vô hạn.
const TU_TIEP_TOI_DA = Math.max(0, Number(env('PHIEN_TU_TIEP') ?? 6) || 0)
const DAU_TIEP = '[[TIEP]]'

// Task Scheduler chạy với PATH tối thiểu — dò tận file cài mặc định (đã dính ở bot hỏi–đáp 29/08).
const CLAUDE_BIN = env('CLAUDE_BIN')
  ?? [join(process.env.USERPROFILE ?? '', '.local', 'bin', 'claude.exe'), join(process.env.HOME ?? '', '.local', 'bin', 'claude')].find(existsSync)
  ?? 'claude'

// Subscription (Thùy 01/11): BỎ hẳn ANTHROPIC_API_KEY khỏi env của claude — còn key trong env là Claude Code
// ưu tiên key, âm thầm trả tiền API thay vì ăn hạn mức subscription.
const ENV_CLAUDE_GOC = { ...process.env }
delete ENV_CLAUDE_GOC.ANTHROPIC_API_KEY
if (env('PHIEN_DUNG_API') === '1' && env('ANTHROPIC_API_KEY')) ENV_CLAUDE_GOC.ANTHROPIC_API_KEY = env('ANTHROPIC_API_KEY')

const log = (...a) => console.log(new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }), ...a)
const docFile = (p) => { try { return readFileSync(join(root, p), 'utf8') } catch { return '' } }

// ── Bối cảnh của phiên (system prompt nối thêm) ─────────────────────────────
function boiCanh(phien) {
  const homNay = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'full' }).format(new Date())
  const luatKhoi = [`kho-rules/dai/k${phien.khoi}.md`, `kho-rules/hinh/k${phien.khoi}.md`].filter((p) => existsSync(join(root, p)))
  return [
    docFile('scripts/phien/CHUNG.md'),
    docFile(`scripts/phien/loai/${phien.loai}.md`),
    '## Thông tin phiên này',
    `- Loại việc: ${phien.loai} · Môn: ${phien.mon} · Khối: ${phien.khoi}`,
    `- Tiêu đề: ${phien.tieu_de}`,
    `- Người mở phiên: ${phien.nguoi_mo_ten ?? '?'}`,
    `- Hôm nay: ${homNay}`,
    luatKhoi.length ? `- Luật riêng của khối (đọc khi cần): ${luatKhoi.join(' · ')}` : '- Khối này chưa có file luật riêng trong kho-rules/.',
    TAI_LIEU.length ? `- Thư mục tài liệu đọc được: ${TAI_LIEU.join(' · ')}` : '- Chưa cấu hình thư mục tài liệu (PHIEN_TAI_LIEU_DIR) — chỉ đọc được repo.',
  ].join('\n')
}

// ── Hiện tool Claude đang dùng thành 1 dòng người đọc được ───────────────────
function dongTool(b) {
  const i = b.input ?? {}
  if (b.name === 'Bash') {
    const cmd = String(i.command ?? '')
    const m = cmd.match(/scripts\/phien\/ban-do\.mjs\s+(\S+)\s*([\s\S]*)/)
    // Lệnh ghi nội dung đưa chữ qua heredoc — chỉ hiện phần lệnh, không hiện cả bài lý thuyết.
    if (m) return `🗺 bản đồ: ${m[1]} ${m[2].split('<<')[0].trim().replace(/^'|'$/g, '').slice(0, 160)}`
    return `🔧 ${cmd.slice(0, 160)}`
  }
  if (b.name === 'Read') return `📖 đọc ${basename(String(i.file_path ?? ''))}`
  if (b.name === 'Grep') return `🔎 tìm “${String(i.pattern ?? '').slice(0, 80)}”`
  if (b.name === 'Glob') return `🔎 tìm file ${String(i.pattern ?? '').slice(0, 80)}`
  if (b.name === 'TodoWrite') return '📝 lập danh sách việc'
  return `🔧 ${b.name}`
}

// Lỗi CẤU HÌNH (login hết hạn) ≠ HẠN MỨC (chờ là hết) ≠ lỗi TẠM (timeout, mạng).
const laLoiLogin = (s) => /not logged in|please run \/login|log ?in|authenticat|invalid api key|credential|oauth/i.test(s)
const laHanMuc = (s) => /usage limit|rate limit|limit reached|quota|overloaded/i.test(s)
function nghiToi(s) {
  const epoch = s.match(/limit reached\|(\d{10})/i)?.[1]
  if (epoch) return new Date(Number(epoch) * 1000)
  return new Date(Date.now() + 30 * 60_000)
}

// ── Gọi Claude Code, stream ra ──────────────────────────────────────────────
// Bản Claude Code cũ không có --include-partial-messages ⇒ lần đầu báo "unknown option" thì tắt cờ, chạy lại:
// vẫn chạy được, chỉ là chữ hiện theo từng đoạn thay vì từng chữ.
let coChuChay = env('PHIEN_KHONG_CHU_CHAY') !== '1'
async function goiClaude(o) {
  try { return await goiClaude1(o) } catch (e) {
    if (coChuChay && /unknown option.*include-partial/i.test(e.message)) { coChuChay = false; log('Claude Code chưa có --include-partial-messages — tắt chữ chạy'); return goiClaude1(o) }
    throw e
  }
}
function goiClaude1({ phien, nhapVao, tiepNoi, khiCo }) {
  return new Promise((resolve, reject) => {
    const args = ['-p', '--output-format', 'stream-json', '--verbose', ...(coChuChay ? ['--include-partial-messages'] : []),
      tiepNoi ? '--resume' : '--session-id', phien.id,
      '--append-system-prompt', boiCanh(phien),
      '--allowedTools', 'Read', 'Grep', 'Glob', 'Bash(node scripts/phien/ban-do.mjs:*)',
      '--disallowedTools', 'Read(./.env)', 'Read(./.env.*)', 'Read(**/.env)', 'Read(**/.env.*)', 'Write', 'Edit', 'WebFetch', 'WebSearch']
    for (const d of TAI_LIEU) args.push('--add-dir', d)
    if (MODEL) args.push('--model', MODEL)
    const child = spawn(CLAUDE_BIN, args, { cwd: root, windowsHide: true, env: { ...ENV_CLAUDE_GOC, PHIEN_ID: phien.id } })
    let buf = '', err = '', ketQua = null
    child.stdout.on('data', (d) => {
      buf += d
      let nl
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1)
        if (!line) continue
        let ev; try { ev = JSON.parse(line) } catch { continue }
        if (ev.type === 'result') ketQua = ev
        khiCo(ev)
      }
    })
    child.stderr.on('data', (d) => { err += d })
    const timer = setTimeout(() => {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true })
      else child.kill('SIGKILL')
      reject(new Error(`timeout: một lượt chạy quá ${TIMEOUT_MS / 60000} phút`))
    }, TIMEOUT_MS)
    child.on('error', (e) => { clearTimeout(timer); reject(e) })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (ketQua && !ketQua.is_error && ketQua.subtype === 'success') return resolve(ketQua)
      const msg = ketQua ? `${ketQua.subtype ?? ''} ${String(ketQua.result ?? '')}` : (err || `claude exit ${code}`)
      reject(new Error(msg.trim().slice(0, 800)))
    })
    child.stdin.write(nhapVao)
    child.stdin.end()
  })
}

// ── Một lượt của một phiên ──────────────────────────────────────────────────
let nghiDen = 0   // >0 = đang nghỉ vì chạm hạn mức subscription, tới mốc này
const dangChay = new Set()

async function heartbeat(trangThai = nghiDen > Date.now() ? 'nghi_han_muc' : 'chay', ghiChu = '') {
  const { error } = await svc.from('claude_phien_bot').upsert({
    id: 1, may: hostname(), alive_at: new Date().toISOString(), trang_thai: trangThai, ghi_chu: ghiChu,
    nghi_toi: trangThai === 'nghi_han_muc' ? new Date(nghiDen).toISOString() : null,
  })
  if (error) log('heartbeat lỗi:', error.message)
}

async function chayLuot(phienId) {
  const { data: viec, error: eN } = await svc.rpc('fn_phien_bot_nhan', { p_phien: phienId })
  if (eN) { log('lỗi nhận việc:', eN.message); return }
  if (!viec?.length) return
  const ids = viec.map((v) => v.id)
  const { data: p, error: eP } = await svc.from('claude_phien')
    .select('id, loai, mon, khoi, tieu_de, trang_thai, nhan_su:nhan_su_id(ho_ten)').eq('id', phienId).single()
  if (eP || !p) { log('không đọc được phiên', phienId, eP?.message); await svc.rpc('fn_phien_bot_tra', { p_ids: ids, p_loi: 'Không đọc được phiên', p_tinh_lan: true, p_toi_da: TOI_DA_LAN }); return }
  const phien = { ...p, nguoi_mo_ten: p.nhan_su?.ho_ten }
  const laTongKet = viec.some((v) => v.vai === 'he_thong') && phien.trang_thai === 'dang_dong'
  const { count: soLuotTruoc } = await svc.from('claude_phien_tin').select('id', { count: 'exact', head: true })
    .eq('phien_id', phienId).eq('vai', 'claude').in('trang_thai', ['xong', 'dung'])
  let tiepNoi = (soLuotTruoc ?? 0) > 0

  const nhapVao = viec.map((v) => v.vai === 'nguoi'
    ? `[${v.nguoi_ten ?? 'Người dùng'} · ${new Date(v.at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })}]\n${v.noi_dung}`
    : `[HỆ THỐNG]\n${v.noi_dung}`).join('\n\n---\n\n')
  log(`▶ phiên ${phienId.slice(0, 8)} ${phien.mon} ${phien.khoi} — ${viec.length} tin${laTongKet ? ' (tổng kết)' : ''}${tiepNoi ? '' : ' · lượt đầu'}`)

  // Tin Claude chỉ SINH khi có chữ/thao tác thật đầu tiên (§1.5) — trước đó màn tự hiện "Claude đang làm…" từ việc 'dang_xu'.
  let tinId = null, phan = [], dangViet = '', daDay = '', hen = null, chuoi = Promise.resolve()
  const noiDung = () => (phan.join('') + dangViet).trim()
  // Mọi lần ghi xếp NỐI TIẾP trên một chuỗi promise — nếu không, lần ghi theo nhịp và lần ghi ép cuối lượt
  // chạy chồng nhau, cả hai cùng thấy tinId=null và đẻ HAI tin Claude cho một lượt.
  const lam = async () => {
    const cur = noiDung()
    if (!cur || cur === daDay) return
    daDay = cur
    if (tinId == null) {
      const { data, error } = await svc.from('claude_phien_tin')
        .insert({ phien_id: phienId, vai: 'claude', noi_dung: cur, trang_thai: 'dang_viet', tra_loi_cho: ids[ids.length - 1] })
        .select('id').single()
      if (!error) tinId = data.id; else log('lỗi tạo tin Claude:', error.message)
    } else {
      const { error } = await svc.from('claude_phien_tin').update({ noi_dung: cur }).eq('id', tinId)
      if (error) log('lỗi cập nhật tin:', error.message)
    }
  }
  function day(epNgay = false) {
    if (epNgay) { clearTimeout(hen); hen = null; chuoi = chuoi.then(lam); return chuoi }
    if (hen) return chuoi
    hen = setTimeout(() => { hen = null; chuoi = chuoi.then(lam) }, DAY_MS)
    return chuoi
  }
  function khiCo(ev) {
    if (ev.type === 'stream_event') {
      const e = ev.event
      if (e?.type === 'content_block_start' && e.content_block?.type === 'text') dangViet = ''
      if (e?.type === 'content_block_delta' && e.delta?.type === 'text_delta') { dangViet += e.delta.text; day() }
    } else if (ev.type === 'assistant') {
      for (const b of ev.message?.content ?? []) {
        if (b.type === 'text' && b.text?.trim()) { phan.push((phan.length ? '\n\n' : '') + b.text.trim()); dangViet = '' }
        else if (b.type === 'tool_use') phan.push(`\n> ${dongTool(b)}`)
      }
      day()
    } else if (ev.type === 'user') {
      for (const b of ev.message?.content ?? []) {
        if (b.type === 'tool_result' && b.is_error) {
          const t = Array.isArray(b.content) ? b.content.map((c) => c.text ?? '').join(' ') : String(b.content ?? '')
          phan.push(`\n>   ⚠ ${t.replace(/\s+/g, ' ').slice(0, 220)}`)
        }
      }
      day()
    }
  }

  try {
    let kq
    try {
      kq = await goiClaude({ phien, nhapVao, tiepNoi, khiCo })
    } catch (e) {
      // Lượt đầu chết sau khi Claude Code đã tạo session ⇒ lần sau --session-id báo trùng: chuyển sang --resume.
      if (!tiepNoi && /already in use|already exists/i.test(e.message)) { tiepNoi = true; kq = await goiClaude({ phien, nhapVao, tiepNoi, khiCo }) }
      else throw e
    }
    if (!noiDung() && kq.result) phan.push(String(kq.result).trim())
    if (!noiDung()) phan.push('(Claude không trả lời gì.)')
    dangViet = ''
    // Dấu [[TIEP]] là lệnh cho BOT, không phải chữ cho người đọc ⇒ gỡ khỏi tin trước khi lưu bản cuối.
    const muonTiep = noiDung().includes(DAU_TIEP)
    if (muonTiep) phan = [noiDung().split(DAU_TIEP).join('').trim()]
    await day(true)
    await svc.from('claude_phien_tin').update({ noi_dung: noiDung(), trang_thai: 'xong', usage: kq.usage ?? null }).eq('id', tinId)
    await svc.from('claude_phien_tin').update({ trang_thai: 'xong', loi: null }).in('id', ids)
    if (laTongKet) await svc.from('claude_phien').update({ trang_thai: 'dong' }).eq('id', phienId)
    else if (muonTiep) await xepLuotTiep(phienId)
    log(`✓ phiên ${phienId.slice(0, 8)} xong lượt`)
  } catch (e) {
    const msg = e?.message ?? String(e)
    log(`✗ phiên ${phienId.slice(0, 8)}: ${msg}`)
    dangViet = ''
    if (tinId != null || noiDung()) {
      phan.push(`\n\n⚠ Lượt này bị ngắt: ${msg.slice(0, 300)}`)
      await day(true)
      if (tinId != null) await svc.from('claude_phien_tin').update({ noi_dung: noiDung(), trang_thai: 'dung' }).eq('id', tinId)
    }
    if (laHanMuc(msg)) {
      nghiDen = nghiToi(msg).getTime()
      await svc.rpc('fn_phien_bot_tra', { p_ids: ids, p_loi: 'Chạm hạn mức Claude — chờ tới ' + new Date(nghiDen).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }), p_tinh_lan: false, p_toi_da: TOI_DA_LAN })
      await heartbeat('nghi_han_muc', msg.slice(0, 200))
      log(`⏸ chạm hạn mức — nghỉ tới ${new Date(nghiDen).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`)
    } else if (laLoiLogin(msg)) {
      await svc.rpc('fn_phien_bot_tra', { p_ids: ids, p_loi: 'Claude Code trên máy Thùy chưa đăng nhập', p_tinh_lan: false, p_toi_da: TOI_DA_LAN })
      await heartbeat('dung', 'Claude Code chưa đăng nhập — chạy `claude` rồi /login trên máy chạy bot')
      console.error('Lỗi LOGIN — trả việc về hàng chờ và TẮT bot. Đăng nhập lại `claude` rồi chạy lại bot.')
      process.exit(1)
    } else {
      await svc.rpc('fn_phien_bot_tra', { p_ids: ids, p_loi: msg.slice(0, 500), p_tinh_lan: true, p_toi_da: TOI_DA_LAN })
    }
  }
}

// Claude xin làm tiếp ⇒ bot tự xếp một tin hệ thống "[TIẾP TỤC]" (đi đúng đường việc chờ như tin người gõ).
// Đếm số lượt tự động kể từ tin NGƯỜI gần nhất — quá trần thì dừng, báo người. Phiên đã đóng / người vừa nhắn thì thôi.
async function xepLuotTiep(phienId) {
  const { data: p } = await svc.from('claude_phien').select('trang_thai').eq('id', phienId).single()
  if (p?.trang_thai !== 'mo') return
  const { data: nguoiCuoi } = await svc.from('claude_phien_tin').select('id').eq('phien_id', phienId).eq('vai', 'nguoi')
    .order('id', { ascending: false }).limit(1).maybeSingle()
  const { count: dangCho } = await svc.from('claude_phien_tin').select('id', { count: 'exact', head: true }).eq('phien_id', phienId).eq('trang_thai', 'cho')
  if (dangCho) return   // người vừa nhắn thêm — lượt sau đọc tin của người, không tự tiếp
  const { count: daTiep } = await svc.from('claude_phien_tin').select('id', { count: 'exact', head: true })
    .eq('phien_id', phienId).eq('vai', 'he_thong').like('noi_dung', '[TIẾP TỤC]%').gt('id', nguoiCuoi?.id ?? 0)
  const lan = (daTiep ?? 0) + 1
  if (lan > TU_TIEP_TOI_DA) {
    await svc.from('claude_phien_tin').insert({ phien_id: phienId, vai: 'he_thong', trang_thai: 'xong',
      noi_dung: `[DỪNG TỰ ĐỘNG] Claude đã tự làm tiếp ${TU_TIEP_TOI_DA} lượt — nhắn "tiếp" nếu muốn chạy thêm.` })
    return
  }
  await svc.from('claude_phien_tin').insert({ phien_id: phienId, vai: 'he_thong', trang_thai: 'cho',
    noi_dung: `[TIẾP TỤC] Lượt tự động ${lan}/${TU_TIEP_TOI_DA}: làm tiếp phần còn lại đúng như việc người đã giao. Xong hết, hoặc gặp chỗ cần người quyết, thì dừng và KHÔNG ghi ${DAU_TIEP}.` })
}

// ── Hàng đợi: phiên có tin chờ, cũ nhất trước; tối đa SONG_SONG phiên cùng lúc ──
// Realtime + quét vớt + lượt vừa xong đều chỉ ĐÁNH THỨC quet(); fn_phien_bot_nhan ở DB mới là người gác cửa
// (khoá phiên, không nhận khi phiên đang có lượt chạy) — listener và --once chạy chồng vẫn không giẫm nhau.
let dangQuet = false
async function quet() {
  if (dangQuet) return
  dangQuet = true
  try {
    if (nghiDen > Date.now()) return
    if (nghiDen) { nghiDen = 0; await heartbeat('chay') }
    const { data, error } = await svc.from('claude_phien_tin').select('phien_id, created_at')
      .eq('trang_thai', 'cho').order('created_at').limit(50)
    if (error) { log('lỗi đọc hàng đợi:', error.message); return }
    const phienCho = [...new Set((data ?? []).map((r) => r.phien_id))].filter((id) => !dangChay.has(id))
    for (const id of phienCho.slice(0, Math.max(0, SONG_SONG - dangChay.size))) {
      dangChay.add(id)
      chayLuot(id).finally(() => { dangChay.delete(id); quet() })
    }
  } finally { dangQuet = false }
}

async function nhatMoCoi() {
  const { data, error } = await svc.rpc('fn_phien_bot_nhat_mo_coi', { p_phut: Math.ceil(TIMEOUT_MS / 60000) + 5 })
  if (error) log('lỗi nhặt mồ côi:', error.message)
  else if (data) log(`nhặt ${data} việc mồ côi về hàng chờ`)
}

// ── Main ────────────────────────────────────────────────────────────────────
log(`bot phiên Claude — ${hostname()} · claude: ${CLAUDE_BIN} · ${env('PHIEN_DUNG_API') === '1' ? 'API key' : 'subscription'} · song song ${SONG_SONG}`)
await heartbeat('chay')
await nhatMoCoi()
if (ONCE) {
  await quet()
  while (dangChay.size) await new Promise((r) => setTimeout(r, 1000))
  log('--once: hết việc, thoát.')
  process.exit(0)
}
setInterval(() => heartbeat(), HEARTBEAT_MS)
setInterval(async () => { await nhatMoCoi(); await quet() }, POLL_MS)
svc.channel('phien_bot')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'claude_phien_tin' }, (m) => { if (m.new?.trang_thai === 'cho') quet() })
  .subscribe((s) => log('realtime:', s))
await quet()
const tat = async () => { await heartbeat('dung', 'bot tắt'); process.exit(0) }
process.on('SIGINT', tat); process.on('SIGTERM', tat)
log(`listener chạy — Realtime + quét vớt ${POLL_MS / 1000}s + heartbeat ${HEARTBEAT_MS / 1000}s. Ctrl+C để dừng.`)
