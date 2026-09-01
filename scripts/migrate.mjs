// ============================================================================
// migrate.mjs — áp migration CHƯA ÁP, theo thứ tự tên. Mỗi file 1 transaction.
//
//   node scripts/migrate.mjs            → áp mọi file còn treo
//   node scripts/migrate.mjs --status   → liệt kê đã áp / còn treo / file bị sửa sau khi áp
//   node scripts/migrate.mjs --baseline [ten_file_cuoi.sql]
//                                       → ĐÁNH DẤU đã-áp mà KHÔNG chạy SQL (dựng sổ cho DB cũ)
//
// VÌ SAO PHẢI CÓ SỔ (bản cũ không có):
//   Bản cũ chạy lại TOÀN BỘ file từ 0001 mỗi lần. File cũ (0001..0115) dùng `create table`
//   trần, không `if not exists` ⇒ trên DB đang sống là chết ngay câu đầu:
//   `relation "dai_ban_do" already exists`. Nên `npm run migrate` coi như bỏ, và cả đội
//   chuyển sang hand-apply qua Supabase SQL Editor — một sự thật chỉ nằm trong 1 dòng
//   giữa HANDOFF.md, không ai đọc trước khi gõ lệnh. Mỗi phiên mới lại dẫm một lần.
//   Có bảng `_migrations` thì file đã áp được bỏ qua, `npm run migrate` chạy lại được thật.
//
// CHỐNG DẪM LẠI: DB đã có bảng mà CHƯA có sổ ⇒ script TỪ CHỐI chạy và chỉ đúng lệnh
//   `--baseline` cần gõ. Không bao giờ đâm vào 0001 rồi văng lỗi khó hiểu nữa.
// ============================================================================
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createHash } from 'node:crypto'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Đọc key THEO ĐÚNG TÊN — migrate TUYỆT ĐỐI không được nhặt nhầm DATABASE_URL_RO.
// (Bản cũ dùng /DATABASE_URL(?:_RO)?/ nên lấy key nào đứng TRƯỚC trong file: thêm
//  DATABASE_URL_RO vào .env là migrate lặng lẽ nối bằng role chỉ-đọc rồi chết giữa chừng.)
function envKey(txt, ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const envTxt = (() => { try { return readFileSync(join(root, '.env'), 'utf8') } catch { return '' } })()

const dir = join(root, 'supabase', 'migrations')
// sort mặc định (lexicographic) đúng ý đồ đặt tên: '0' < '2' nên 0001..0115 luôn trước timestamp.
const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()

const argv = process.argv.slice(2)
const laBaseline = argv.includes('--baseline')
const laStatus = argv.includes('--status')
const denFile = argv.find((a) => !a.startsWith('--')) ?? null

// --status chỉ ĐỌC ⇒ dùng được role chỉ-đọc. Hai đường kia GHI ⇒ bắt buộc role ghi.
// Ưu tiên DATABASE_URL_RW truyền lúc gọi: giữ chuỗi kết nối GHI ra khỏi đĩa hoàn toàn,
// nên không ai (kể cả Claude) lấy được thứ không tồn tại trong file nào.
const urlRo = envKey(envTxt, 'DATABASE_URL_RO')
const urlRw = process.env.DATABASE_URL_RW ?? envKey(envTxt, 'DATABASE_URL')
const url = laStatus ? (urlRo ?? urlRw) : urlRw

if (!url) {
  console.error(laStatus
    ? '❌ Thiếu DATABASE_URL_RO / DATABASE_URL trong .env'
    : '❌ Không có chuỗi kết nối GHI. Một trong hai:\n' +
      '   · truyền lúc gọi:  set DATABASE_URL_RW=postgresql://...  &&  npm run migrate\n' +
      '   · hoặc đặt DATABASE_URL trong .env (role phải ghi được — KHÔNG phải DATABASE_URL_RO)')
  process.exit(1)
}
if (!laStatus && urlRo && url === urlRo) {
  console.error('❌ Chuỗi kết nối đang trỏ đúng role CHỈ ĐỌC (DATABASE_URL_RO) — migrate cần role ghi.')
  process.exit(1)
}

// ── Chuỗi kết nối đến TỪ ĐÂU + có phải placeholder không ────────────────────
// Biến môi trường ĐÈ .env và SỐNG SUỐT PHIÊN terminal ⇒ ca khó đoán nhất: `.env` đúng
// hoàn toàn mà lệnh vẫn hỏng, chạy lại bao nhiêu lần cũng hỏng y hệt, còn lỗi thô thì chỉ
// nói "getaddrinfo ENOTFOUND" — không hé lộ chuỗi đến từ đâu.
// (Đã cắn 12/08: copy nguyên dòng mẫu `set DATABASE_URL_RW=postgresql://...  &&  npm run
//  migrate` trong .env.example ⇒ biến = "postgresql://..." kèm dấu cách ⇒ host = "... ".)
const tuBienMT = !laStatus && !!process.env.DATABASE_URL_RW
const nguonUrl = tuBienMT ? 'BIẾN MÔI TRƯỜNG DATABASE_URL_RW' : `file .env (khoá ${laStatus && urlRo ? 'DATABASE_URL_RO' : 'DATABASE_URL'})`
let host = null
try { host = new URL(url).hostname } catch { /* không parse nổi → xử như placeholder */ }
if (!host || !host.includes('.') || host.includes('...') || host.includes('[') || host !== host.trim()) {
  console.error(`❌ Chuỗi kết nối không dùng được — host đọc ra = ${JSON.stringify(host ?? '(không parse được)')}`)
  console.error(`   Nguồn: ${nguonUrl}`)
  if (tuBienMT) {
    console.error('   ⚠ Biến môi trường ĐÈ .env và sống hết phiên terminal. Xoá rồi chạy lại:')
    console.error('       set DATABASE_URL_RW=            (cmd)')
    console.error('       Remove-Item Env:DATABASE_URL_RW (PowerShell)')
    console.error('     — hoặc mở cửa sổ terminal mới.')
  } else {
    console.error('   Sửa khoá tương ứng trong .env (xem .env.example).')
  }
  process.exit(1)
}

if (denFile && !laBaseline) {
  console.error(`❌ Tham số "${denFile}" chỉ dùng kèm --baseline.`)
  process.exit(1)
}
if (denFile && !files.includes(denFile)) {
  console.error(`❌ Không có file "${denFile}" trong supabase/migrations.`)
  process.exit(1)
}

// Vân tay nội dung — để phát hiện file ĐÃ ÁP nhưng sau đó bị sửa (lịch sử migration phải bất biến;
// sửa file cũ = DB thật và repo nói hai chuyện khác nhau, và không ai nhận ra).
// CHUẨN HOÁ XUỐNG DÒNG TRƯỚC KHI BĂM: cùng một file áp từ máy Windows (CRLF) và từ Linux/cloud
// (LF) ra hai vân tay khác nhau ⇒ `--status` la làng "62 file bị sửa" trong khi nội dung y hệt
// (cắn 01/09: cả 62 file lệch đều CHỈ vì CRLF — không file nào đổi nội dung thật).
// Băm theo nội dung LOGIC: bỏ ký tự CR trước khi băm, không băm theo kiểu xuống dòng.
const bam = (f) => createHash('sha256')
  .update(readFileSync(join(dir, f), 'utf8').replace(/\r/g, ''), 'utf8')
  .digest('hex').slice(0, 16)

const c = new pg.Client({ connectionString: url })
await c.connect()

try {
  const { rows: [co] } = await c.query(
    `select to_regclass('public._migrations') as so, to_regclass('public.viec') as db_co_data`)

  // ── --status: XEM THUẦN, không tạo sổ, không ghi gì (chạy được cả bằng role chỉ-đọc) ──
  if (laStatus) {
    const daAp0 = co.so
      ? new Map((await c.query('select ten, bam from _migrations')).rows.map((r) => [r.ten, r.bam]))
      : new Map()
    const treo0 = files.filter((f) => !daAp0.has(f))
    const sua0 = files.filter((f) => daAp0.has(f) && daAp0.get(f) !== bam(f))
    // Dòng sổ KHÔNG còn file trong repo: SQL đã chạy trên DB thật nhưng file không nằm trong repo
    // (áp tay qua SQL Editor rồi quên commit, hoặc file sống ở nhánh chưa merge). Repo hết là
    // source of truth cho phần đó ⇒ dựng lại DB từ repo sẽ THIẾU. Phải nói ra, đừng để im.
    const moCoi0 = [...daAp0.keys()].filter((t) => !files.includes(t)).sort()
    if (!co.so) console.log('(chưa có sổ `_migrations` — dựng bằng --baseline)')
    console.log(`Đã áp: ${daAp0.size}/${files.length}`)
    console.log(treo0.length ? `\nCÒN TREO (${treo0.length}):\n  ${treo0.join('\n  ')}` : '\nKhông còn file treo.')
    if (moCoi0.length) {
      console.log(`\n⚠ CÓ TRONG SỔ NHƯNG KHÔNG CÒN FILE TRONG REPO (${moCoi0.length}) — DB có, repo không:`)
      console.log(`  ${moCoi0.join('\n  ')}`)
      console.log('  Dựng lại DB từ repo sẽ THIẾU phần này. Tìm lại file (nhánh chưa merge?) rồi commit.')
    }
    if (sua0.length) {
      console.log(`\n⚠ ĐÃ ÁP NHƯNG FILE BỊ SỬA SAU ĐÓ (${sua0.length}) — DB và repo đang nói khác nhau:`)
      console.log(`  ${sua0.join('\n  ')}`)
      console.log('  Sửa file cũ KHÔNG áp lại được. Muốn đổi thì viết migration MỚI đè lên.')
    }
    process.exit(0)
  }

  // Kiểm quyền GHI NGAY TỪ ĐẦU — thà chết ở đây với một câu rõ ràng, còn hơn chết giữa
  // chừng bằng "permission denied for table ..." sau khi đã áp xong vài file (nửa vời,
  // sổ ghi đúng nhưng người đọc log không hiểu vì sao dừng).
  const { rows: [q] } = await c.query(
    `select current_user as ai, has_schema_privilege(current_user, 'public', 'CREATE') as ghi_duoc`)
  if (!q.ghi_duoc) {
    console.error(`❌ Role "${q.ai}" không có quyền CREATE trên schema public — migrate cần role GHI.`)
    console.error('   Truyền role ghi lúc gọi:  set DATABASE_URL_RW=postgresql://...  &&  npm run migrate')
    process.exit(1)
  }

  // ── Chưa có sổ mà DB đã có dữ liệu ⇒ DỪNG, chỉ lệnh đúng. Đây là ca đã cắn 12/08. ──
  if (!co.so && co.db_co_data && !laBaseline) {
    console.error('❌ DB đã có bảng nhưng CHƯA có sổ `_migrations` — không biết file nào đã áp.')
    console.error('   Chạy migration bây giờ sẽ đâm vào 0001 (`create table` trần) và văng')
    console.error('   "relation ... already exists". Dựng sổ trước, đánh dấu tới file đã áp cuối cùng:')
    console.error('')
    console.error(`     node scripts/migrate.mjs --baseline <ten_file_da_ap_cuoi_cung.sql>`)
    console.error('')
    console.error('   ⚠ Chỉ baseline khi CHẮC DB đã khớp repo tới file đó (đối chiếu `npm run schema`)')
    console.error('     — file bị đánh dấu nhầm sẽ KHÔNG BAO GIỜ chạy, và hỏng im lặng.')
    process.exit(1)
  }

  await c.query(`create table if not exists _migrations (
    ten text primary key, bam text not null, ap_luc timestamptz not null default now())`)

  const daAp = new Map((await c.query('select ten, bam from _migrations')).rows.map((r) => [r.ten, r.bam]))
  const conTreo = files.filter((f) => !daAp.has(f))
  const biSua = files.filter((f) => daAp.has(f) && daAp.get(f) !== bam(f))

  // ── --baseline: ghi sổ, KHÔNG chạy SQL ──────────────────────────────────────
  if (laBaseline) {
    const den = denFile ?? files[files.length - 1]
    const danhDau = files.filter((f) => f <= den && !daAp.has(f))
    if (!danhDau.length) { console.log('Sổ đã đầy đủ tới file đó — không có gì để đánh dấu.'); process.exit(0) }
    await c.query('begin')
    for (const f of danhDau) await c.query('insert into _migrations (ten, bam) values ($1,$2)', [f, bam(f)])
    await c.query('commit')
    console.log(`Đã ĐÁNH DẤU (không chạy SQL) ${danhDau.length} file, tới và gồm: ${den}`)
    const treoSau = files.filter((f) => f > den)
    console.log(treoSau.length
      ? `Còn treo ${treoSau.length} file — chạy \`npm run migrate\` để áp thật:\n  ${treoSau.join('\n  ')}`
      : 'Không còn file nào treo.')
    process.exit(0)
  }

  // ── Áp thật ─────────────────────────────────────────────────────────────────
  if (biSua.length) {
    console.warn(`⚠ ${biSua.length} file đã áp nhưng bị sửa sau đó (DB ≠ repo): ${biSua.join(', ')}`)
    console.warn('  Không áp lại. Muốn đổi thì viết migration MỚI đè lên.\n')
  }
  if (!conTreo.length) { console.log(`Không có file nào treo (đã áp ${daAp.size}/${files.length}).`); process.exit(0) }

  for (const f of conTreo) {
    process.stdout.write(`Applying ${f} ... `)
    try {
      await c.query('begin')
      await c.query(readFileSync(join(dir, f), 'utf8'))
      // Ghi sổ TRONG CÙNG transaction: SQL fail thì sổ cũng rollback, không bao giờ lệch.
      await c.query('insert into _migrations (ten, bam) values ($1,$2)', [f, bam(f)])
      await c.query('commit')
      console.log('OK')
    } catch (e) {
      await c.query('rollback')
      console.log('FAIL')
      throw e
    }
  }
  console.log(`— Đã áp ${conTreo.length} file. Nhớ chạy \`npm run schema\` rồi commit schema.md kèm migration.`)
} catch (e) {
  console.error('❌', e.message)
  process.exitCode = 1
} finally {
  await c.end()
}
