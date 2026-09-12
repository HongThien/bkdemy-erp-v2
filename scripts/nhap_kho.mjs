// ============================================================================
// nhap_kho.mjs — engine cho luồng nhập kho câu từ folder Drive-sync.
//
// Luồng A (co_giai): folder chứa file có sẵn đề + lời giải + đáp án → Claude
//   trích, gán dạng, INSERT vào <mon>_cau_hoi với da_duyet=false.
// Luồng B (khong_giai): folder chứa file chỉ có đề → Claude tự giải + verify
//   → INSERT với da_duyet=false, giai_method='ai_extract_solve'. (Luồng B phần
//   giải/verify chạy ở worktree riêng — script này chỉ list/insert/log.)
//
// SUBCOMMAND:
//   list    --mode <co_giai|khong_giai>
//     → In JSON danh sách file trong folder, kèm sha256 và cờ "đã xử lý"
//       (tra nhap_kho_log). Skip toàn bộ nhánh DaXuLy/.
//
//   insert  --subject <hgt|dai|khtn> --json <path-to-json>
//     → Đọc JSON [{ dang_chinh, loai_cau, noi_dung, ... }], INSERT vào bảng
//       <subject>_cau_hoi trong 1 transaction. Ma_cau generate theo convention
//       <dang_chinh> + lpad(STT, 3, '0'), STT = MAX + 1 trong cùng dạng.
//     → In JSON { ok, ma_cau_list: [...] }.
//
//   done    --file <path> --mode <mode> --sha <sha> --subject <subject>
//           --ma_cau_json <path-to-json>
//     → Ghi nhap_kho_log (folder=mode, so_cau_moi, ma_cau_list, ghi_chu=subject).
//     → Move file sang <root>/DaXuLy/<YYYY-MM-DD>/<name>. Nếu name đã tồn tại
//       trong ngày đó → append _2, _3, ...
//
//   fail    --file <path> --mode <mode> --sha <sha> --error "<msg>"
//     → Ghi nhap_kho_log với loi=<msg>, so_cau_moi=0. KHÔNG move file (để CEO
//       xem/sửa file, chạy lại).
//
// GHI Ý:
//   · Đọc DATABASE_URL_RO cho list; DATABASE_URL (hoặc DATABASE_URL_RW env) cho
//     insert/done/fail (theo pattern migrate.mjs).
//   · Output JSON qua stdout (Claude parse). Log tiến độ / warning qua stderr.
//   · Ma_cau collision: dùng advisory_xact_lock theo (subject, dang_chinh)
//     trong lúc insert để 2 lần chạy song song không cấp trùng STT.
// ============================================================================
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename, relative, sep } from 'node:path'
import { createHash } from 'node:crypto'
import pg from 'pg'
import { insertCauBatch, SUBJECTS } from './_kho_insert.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── Cấu hình gốc folder Drive-sync (chỉnh chỗ này nếu CEO đổi ổ) ─────────────
const FOLDER = {
  co_giai:    'E:/BK ACADEMY/Tài liệu Claude nhập kho',
  khong_giai: 'E:/BK ACADEMY/Tài liệu Claude giải bài',
}

// ── Env loader (không dùng dotenv, giống migrate.mjs) ────────────────────────
function envKey(txt, ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const envTxt = (() => { try { return readFileSync(join(root, '.env'), 'utf8') } catch { return '' } })()

function chuoiKetNoi(canGhi) {
  const urlRo = envKey(envTxt, 'DATABASE_URL_RO')
  const urlRw = process.env.DATABASE_URL_RW ?? envKey(envTxt, 'DATABASE_URL')
  const url = canGhi ? urlRw : (urlRo ?? urlRw)
  if (!url) {
    console.error(canGhi
      ? '❌ Không có chuỗi kết nối GHI (DATABASE_URL trong .env, hoặc set DATABASE_URL_RW=...).'
      : '❌ Không có DATABASE_URL_RO / DATABASE_URL trong .env.')
    process.exit(2)
  }
  if (canGhi && urlRo && url === urlRo) {
    console.error('❌ Chuỗi kết nối trỏ vào role CHỈ ĐỌC — insert/done/fail cần role ghi.')
    process.exit(2)
  }
  return url
}

// ── argv mini-parser ────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith('--')) { args[key] = true }
      else { args[key] = next; i++ }
    } else {
      args._.push(a)
    }
  }
  return args
}

function help() {
  console.error(`nhap_kho.mjs — engine luồng nhập kho câu

Subcommands:
  list    --mode <co_giai|khong_giai>
  insert  --subject <hgt|dai|khtn> --json <path>
  done    --file <path> --mode <mode> --sha <sha> --subject <subject>
          --ma_cau_json <path>
  fail    --file <path> --mode <mode> --sha <sha> --error "<msg>"

Ví dụ:
  node scripts/nhap_kho.mjs list --mode co_giai
  node scripts/nhap_kho.mjs insert --subject hgt --json /tmp/cau.json
  node scripts/nhap_kho.mjs done --file "E:/.../NBV_L12_Ch5_F.pdf" \\
      --mode co_giai --sha abc123... --subject hgt --ma_cau_json /tmp/list.json
`)
}

// ── util: sha256 file ───────────────────────────────────────────────────────
function sha256File(p) {
  const h = createHash('sha256')
  h.update(readFileSync(p))
  return h.digest('hex')
}

// ── util: walk folder, skip DaXuLy + DE_THI (đề thi có luồng riêng nhap_de_thi.mjs) ──
function walk(dirAbs, out = []) {
  for (const name of readdirSync(dirAbs)) {
    if (name === 'DaXuLy' || name === 'DE_THI' || name.startsWith('.') || name === 'desktop.ini') continue
    const p = join(dirAbs, name)
    let st
    try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) walk(p, out)
    else if (st.isFile() && /\.(pdf|docx?)$/i.test(name)) out.push(p)
  }
  return out
}

// ────────────────────────────────────────────────────────────────────────────
// list
// ────────────────────────────────────────────────────────────────────────────
async function cmdList(args) {
  const mode = args.mode
  if (!['co_giai', 'khong_giai'].includes(mode)) {
    console.error('❌ --mode phải là co_giai hoặc khong_giai'); process.exit(2)
  }
  const rootFolder = FOLDER[mode]
  if (!existsSync(rootFolder)) {
    console.error(`❌ Không thấy folder: ${rootFolder}`); process.exit(2)
  }

  const files = walk(rootFolder).map(p => {
    const rel = relative(rootFolder, p).split(sep).join('/')
    const parts = rel.split('/')
    return {
      path: p.split(sep).join('/'),
      name: basename(p),
      khoi_folder: parts.length > 1 ? parts[0] : null,
      size_bytes: statSync(p).size,
      sha256: sha256File(p),
    }
  })

  if (files.length === 0) {
    process.stdout.write(JSON.stringify({ mode, root: rootFolder, files: [] }, null, 2) + '\n')
    return
  }

  const url = chuoiKetNoi(false)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    const shas = files.map(f => f.sha256)
    const { rows } = await c.query(
      `select sha256, xu_ly_at, so_cau_moi, loi, ma_cau_list
         from nhap_kho_log
        where sha256 = any($1::text[])
        order by xu_ly_at desc`,
      [shas]
    )
    const bySha = new Map()
    for (const r of rows) if (!bySha.has(r.sha256)) bySha.set(r.sha256, r) // latest first
    for (const f of files) {
      const prev = bySha.get(f.sha256)
      f.seen_before = !!prev
      if (prev) f.prev_log = {
        xu_ly_at: prev.xu_ly_at, so_cau_moi: prev.so_cau_moi,
        loi: prev.loi, ma_cau_count: (prev.ma_cau_list || []).length,
      }
    }
    process.stdout.write(JSON.stringify({ mode, root: rootFolder, files }, null, 2) + '\n')
  } finally { await c.end() }
}

// ────────────────────────────────────────────────────────────────────────────
// insert  (1 transaction, atomic)
// ────────────────────────────────────────────────────────────────────────────
async function cmdInsert(args) {
  const subject = args.subject
  if (!SUBJECTS.includes(subject)) {
    console.error(`❌ --subject phải là ${SUBJECTS.join('|')}`); process.exit(2)
  }
  if (!args.json || !existsSync(args.json)) {
    console.error('❌ --json <path> thiếu hoặc file không tồn tại'); process.exit(2)
  }
  const cauList = JSON.parse(readFileSync(args.json, 'utf8'))
  if (!Array.isArray(cauList) || cauList.length === 0) {
    console.error('❌ JSON phải là mảng câu, không rỗng'); process.exit(2)
  }

  const url = chuoiKetNoi(true)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    await c.query('BEGIN')
    const { maCauList } = await insertCauBatch({ client: c, subject, cauList })
    await c.query('COMMIT')
    process.stdout.write(JSON.stringify({ ok: true, ma_cau_list: maCauList, inserted: maCauList.length }, null, 2) + '\n')
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {})
    process.stdout.write(JSON.stringify({ ok: false, error: e.message, inserted: 0, ma_cau_list: [] }, null, 2) + '\n')
    process.exit(4)
  } finally { await c.end() }
}

// ────────────────────────────────────────────────────────────────────────────
// done — log + move
// ────────────────────────────────────────────────────────────────────────────
function ngayVN() {
  // Asia/Ho_Chi_Minh = UTC+7, không DST — cộng 7h thẳng, không xài Intl (chậm + phụ thuộc ICU)
  const d = new Date(Date.now() + 7 * 3600 * 1000)
  return d.toISOString().slice(0, 10)
}

async function cmdDone(args) {
  const { file, mode, sha, subject } = args
  if (!file || !existsSync(file)) { console.error('❌ --file thiếu hoặc không tồn tại'); process.exit(2) }
  if (!['co_giai', 'khong_giai'].includes(mode)) { console.error('❌ --mode sai'); process.exit(2) }
  if (!sha || !/^[0-9a-f]{64}$/.test(sha)) { console.error('❌ --sha thiếu / sai định dạng'); process.exit(2) }
  if (!SUBJECTS.includes(subject)) { console.error('❌ --subject sai'); process.exit(2) }
  if (!args.ma_cau_json || !existsSync(args.ma_cau_json)) {
    console.error('❌ --ma_cau_json thiếu'); process.exit(2)
  }
  const maCauList = JSON.parse(readFileSync(args.ma_cau_json, 'utf8'))
  if (!Array.isArray(maCauList)) { console.error('❌ ma_cau_json phải là mảng'); process.exit(2) }

  // Verify sha khớp
  const shaReal = sha256File(file)
  if (shaReal !== sha) {
    console.error(`❌ sha256 file hiện tại (${shaReal}) khác sha truyền vào (${sha}) — có ai sửa file giữa chừng?`)
    process.exit(3)
  }

  const rootFolder = FOLDER[mode]
  const dayDir = join(rootFolder, 'DaXuLy', ngayVN())
  mkdirSync(dayDir, { recursive: true })
  let dest = join(dayDir, basename(file))
  let n = 2
  while (existsSync(dest)) {
    const base = basename(file).replace(/(\.[^.]+)$/, `_${n}$1`)
    dest = join(dayDir, base)
    n++
    if (n > 50) { console.error('❌ Quá nhiều bản trùng tên'); process.exit(3) }
  }

  const url = chuoiKetNoi(true)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    await c.query('BEGIN')
    await c.query(
      `insert into nhap_kho_log (file_name, folder, sha256, so_cau_moi, ma_cau_list, ghi_chu)
       values ($1, $2, $3, $4, $5::jsonb, $6)`,
      [basename(file), mode, sha, maCauList.length, JSON.stringify(maCauList), `subject=${subject}`]
    )
    // move sau khi log OK — nếu log fail thì file còn nguyên chỗ, chạy lại được
    renameSync(file, dest)
    await c.query('COMMIT')
    process.stdout.write(JSON.stringify({ ok: true, moved_to: dest.split(sep).join('/'), log_rows: 1 }, null, 2) + '\n')
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {})
    process.stdout.write(JSON.stringify({ ok: false, error: e.message }, null, 2) + '\n')
    process.exit(4)
  } finally { await c.end() }
}

// ────────────────────────────────────────────────────────────────────────────
// fail — log lỗi, KHÔNG move
// ────────────────────────────────────────────────────────────────────────────
async function cmdFail(args) {
  const { file, mode, sha, error } = args
  if (!file) { console.error('❌ --file thiếu'); process.exit(2) }
  if (!['co_giai', 'khong_giai'].includes(mode)) { console.error('❌ --mode sai'); process.exit(2) }
  if (!sha || !/^[0-9a-f]{64}$/.test(sha)) { console.error('❌ --sha sai'); process.exit(2) }
  if (!error || typeof error !== 'string') { console.error('❌ --error thiếu'); process.exit(2) }

  const url = chuoiKetNoi(true)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    await c.query(
      `insert into nhap_kho_log (file_name, folder, sha256, so_cau_moi, ma_cau_list, loi)
       values ($1, $2, $3, 0, '[]'::jsonb, $4)`,
      [basename(file), mode, sha, error.slice(0, 2000)]
    )
    process.stdout.write(JSON.stringify({ ok: false, logged: true }, null, 2) + '\n')
  } finally { await c.end() }
}

// ── main dispatch ───────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
if (argv.length === 0 || argv[0] === '-h' || argv[0] === '--help') { help(); process.exit(0) }
const sub = argv[0]
const args = parseArgs(argv.slice(1))
try {
  if (sub === 'list')        await cmdList(args)
  else if (sub === 'insert') await cmdInsert(args)
  else if (sub === 'done')   await cmdDone(args)
  else if (sub === 'fail')   await cmdFail(args)
  else { console.error(`❌ subcommand không rõ: ${sub}`); help(); process.exit(2) }
} catch (e) {
  console.error(`❌ ${e.stack || e.message || e}`)
  process.exit(1)
}
