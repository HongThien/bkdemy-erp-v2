// ============================================================================
// nhap_de_thi.mjs — engine luồng nhập ĐỀ THI (khác luồng nhập câu tự do).
//
// Khác gì luồng nhập câu (nhap_kho.mjs):
//   · Ngoài bóc câu vào <mon>_cau_hoi, phải LƯU CẤU TRÚC ĐỀ (thứ tự câu, phần
//     I/II/III/IV, timing, năm, mã đề, nguồn) vào toan_de_thi + toan_de_thi_cau.
//   · Pha 1 chỉ có Toán (Đại+Hình). KHTN/Văn/Anh hold.
//
// SUBCOMMAND:
//   list  --khoi <10|11|12>
//     → In JSON danh sách file trong <root>/DE_THI/<khoi>/, sha256 + cờ đã xử lý.
//
//   insert --meta <meta.json> --cau <cau.json>
//     → 1 transaction, atomic:
//       (1) INSERT toan_de_thi từ meta → nhận de_id
//       (2) Group câu theo mon_con ('dai'|'hgt'), insertCauBatch từng nhóm →
//           mỗi câu nhận ma_cau
//       (3) INSERT toan_de_thi_cau (de_id, thu_tu, phan, ma_cau_dai/hgt, diem)
//     → In JSON { ok, de_id, ma_cau_list, so_cau }
//
//   done --file <path> --sha <sha> --de-id <id>
//     → INSERT nhap_kho_log (folder='co_giai', ghi_chu='de_thi:<id>').
//     → Move file → <root>/DE_THI/DaXuLy/<YYYY-MM-DD>/<name>.
//
//   fail --file <path> --sha <sha> --error "<msg>"
//     → Log fail vào nhap_kho_log, KHÔNG move.
// ============================================================================
import { readFileSync, existsSync, mkdirSync, renameSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename, sep } from 'node:path'
import { createHash } from 'node:crypto'
import pg from 'pg'
import { insertCauBatch } from './_kho_insert.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT_DE_THI = 'E:/BK ACADEMY/Tài liệu Claude nhập kho/DE_THI'
const MON_CON = ['dai', 'hgt']
const NGUON_VALID = ['bgd', 'so', 'cum_chuyen_mon', 'thi_thu', 'le']
const KHOI_VALID = ['10', '11', '12']
const PHAN_VALID = ['I', 'II', 'III', 'IV']

// ── Env loader (identical pattern with nhap_kho.mjs / migrate.mjs) ──────────
function envKey(txt, ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const envTxt = (() => { try { return readFileSync(join(root, '.env'), 'utf8') } catch { return '' } })()

function chuoiKetNoi(canGhi) {
  const urlRo = envKey(envTxt, 'DATABASE_URL_RO')
  const urlRw = process.env.DATABASE_URL_RW ?? envKey(envTxt, 'DATABASE_URL')
  const url = canGhi ? urlRw : (urlRo ?? urlRw)
  if (!url) { console.error('❌ Thiếu chuỗi kết nối DB'); process.exit(2) }
  if (canGhi && urlRo && url === urlRo) {
    console.error('❌ Chuỗi kết nối là role chỉ đọc — insert/done/fail cần role ghi.'); process.exit(2)
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
      if (!next || next.startsWith('--')) args[key] = true
      else { args[key] = next; i++ }
    } else args._.push(a)
  }
  return args
}

function help() {
  console.error(`nhap_de_thi.mjs — engine luồng nhập ĐỀ THI (Toán, pha 1)

Subcommands:
  list   --khoi <10|11|12>
  insert --meta <meta.json> --cau <cau.json>
  done   --file <path> --sha <sha> --de-id <id>
  fail   --file <path> --sha <sha> --error "<msg>"

Cấu trúc meta.json:
  {
    "ten": "Đề Tham Khảo BGD 2025 Mã 0104",
    "nguon": "bgd",              // bgd | so | cum_chuyen_mon | thi_thu | le
    "ma_de": "0104",             // optional
    "nam": 2025,                 // optional
    "khoi": "12",                // 10 | 11 | 12
    "ten_de_goc": "BGD_L12_2025_M0104_DETHI",   // basename bỏ .pdf
    "thoi_gian_phut": 90,        // optional
    "cau_truc": [
      {"phan":"I","loai":"trac_nghiem","so_cau":12,"diem_moi_cau":0.25},
      {"phan":"II","loai":"dung_sai","so_cau":4,"diem_moi_cau":1.0},
      {"phan":"III","loai":"tra_loi_ngan","so_cau":6,"diem_moi_cau":0.5}
    ],
    "ghi_chu": null
  }

Cấu trúc cau.json (mảng câu, thứ tự bất kỳ — thu_tu quyết định):
  [
    {
      "thu_tu": 1,
      "phan": "I",
      "mon_con": "dai",         // dai | hgt (quyết bảng insert)
      "diem": null,             // optional — null = dùng diem_moi_cau của phần
      "cau": {                  // payload câu, format y hệt nhap_kho insert
        "dang_chinh": "T112010101",
        "loai_cau": "trac_nghiem",
        "noi_dung": "...",
        "lua_chon": ["$A. ...$.","$B. ...$.","$C. ...$.","$D. ...$."],
        "dap_an": "A",
        "loi_giai": "...",
        "ten_de_goc": "BGD_L12_2025_M0104_DETHI"
      }
    }
  ]
`)
}

// ── util ────────────────────────────────────────────────────────────────────
function sha256File(p) {
  const h = createHash('sha256'); h.update(readFileSync(p)); return h.digest('hex')
}
function walk(dirAbs, out = []) {
  for (const name of readdirSync(dirAbs)) {
    if (name === 'DaXuLy' || name.startsWith('.') || name === 'desktop.ini') continue
    const p = join(dirAbs, name)
    let st; try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) walk(p, out)
    else if (st.isFile() && /\.(pdf|docx?)$/i.test(name)) out.push(p)
  }
  return out
}
function ngayVN() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
}

// ────────────────────────────────────────────────────────────────────────────
// list
// ────────────────────────────────────────────────────────────────────────────
async function cmdList(args) {
  const khoi = args.khoi
  if (!KHOI_VALID.includes(khoi)) { console.error(`❌ --khoi phải là ${KHOI_VALID.join('|')}`); process.exit(2) }
  const dir = join(ROOT_DE_THI, `L${khoi}`)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const files = walk(dir).map(p => ({
    path: p.split(sep).join('/'),
    name: basename(p),
    khoi,
    size_bytes: statSync(p).size,
    sha256: sha256File(p),
  }))
  if (files.length === 0) {
    process.stdout.write(JSON.stringify({ khoi, root: dir.split(sep).join('/'), files: [] }, null, 2) + '\n')
    return
  }
  const url = chuoiKetNoi(false)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    const shas = files.map(f => f.sha256)
    const { rows } = await c.query(
      `select sha256, xu_ly_at, so_cau_moi, loi, ma_cau_list, ghi_chu
         from nhap_kho_log
        where sha256 = any($1::text[])
        order by xu_ly_at desc`, [shas])
    const bySha = new Map()
    for (const r of rows) if (!bySha.has(r.sha256)) bySha.set(r.sha256, r)
    for (const f of files) {
      const prev = bySha.get(f.sha256)
      f.seen_before = !!prev
      if (prev) f.prev_log = {
        xu_ly_at: prev.xu_ly_at, so_cau_moi: prev.so_cau_moi,
        loi: prev.loi, ma_cau_count: (prev.ma_cau_list || []).length,
        ghi_chu: prev.ghi_chu,
      }
    }
    process.stdout.write(JSON.stringify({ khoi, root: dir.split(sep).join('/'), files }, null, 2) + '\n')
  } finally { await c.end() }
}

// ────────────────────────────────────────────────────────────────────────────
// insert — 1 tx: toan_de_thi + <mon>_cau_hoi + toan_de_thi_cau
// ────────────────────────────────────────────────────────────────────────────
async function cmdInsert(args) {
  if (!args.meta || !existsSync(args.meta)) { console.error('❌ --meta thiếu / không tồn tại'); process.exit(2) }
  if (!args.cau  || !existsSync(args.cau))  { console.error('❌ --cau thiếu / không tồn tại');  process.exit(2) }
  const meta = JSON.parse(readFileSync(args.meta, 'utf8'))
  const items = JSON.parse(readFileSync(args.cau, 'utf8'))

  // Validate meta
  if (!meta.ten) { console.error('❌ meta.ten trống'); process.exit(3) }
  if (!KHOI_VALID.includes(meta.khoi)) { console.error(`❌ meta.khoi phải ∈ ${KHOI_VALID.join('|')}`); process.exit(3) }
  const nguon = meta.nguon || 'le'
  if (!NGUON_VALID.includes(nguon)) { console.error(`❌ meta.nguon phải ∈ ${NGUON_VALID.join('|')}`); process.exit(3) }
  if (!Array.isArray(meta.cau_truc)) { console.error('❌ meta.cau_truc phải là mảng'); process.exit(3) }

  // Validate items
  if (!Array.isArray(items) || items.length === 0) { console.error('❌ cau.json phải là mảng, không rỗng'); process.exit(3) }
  const thuTuSet = new Set()
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    if (!Number.isInteger(it.thu_tu) || it.thu_tu <= 0)
      { console.error(`❌ câu #${i}: thu_tu phải nguyên dương`); process.exit(3) }
    if (thuTuSet.has(it.thu_tu))
      { console.error(`❌ thu_tu ${it.thu_tu} trùng`); process.exit(3) }
    thuTuSet.add(it.thu_tu)
    if (!PHAN_VALID.includes(it.phan))
      { console.error(`❌ câu #${i}: phan phải ∈ ${PHAN_VALID.join('|')}`); process.exit(3) }
    if (!MON_CON.includes(it.mon_con))
      { console.error(`❌ câu #${i}: mon_con phải ∈ ${MON_CON.join('|')}`); process.exit(3) }
    if (!it.cau || typeof it.cau !== 'object')
      { console.error(`❌ câu #${i}: thiếu payload cau`); process.exit(3) }
  }

  const url = chuoiKetNoi(true)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    await c.query('BEGIN')

    // (1) INSERT toan_de_thi
    const { rows: [{ id: deId }] } = await c.query(
      `insert into toan_de_thi (
         ten, nguon, ma_de, nam, khoi, ten_de_goc, thoi_gian_phut, cau_truc, ghi_chu
       ) values (
         $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9
       ) returning id`,
      [
        meta.ten, nguon, meta.ma_de ?? null, meta.nam ?? null, meta.khoi,
        meta.ten_de_goc ?? null, meta.thoi_gian_phut ?? null,
        JSON.stringify(meta.cau_truc), meta.ghi_chu ?? null,
      ]
    )

    // (2) Group items theo mon_con → insertCauBatch từng nhóm
    const groups = new Map()  // mon_con → [{itemIdx, cau}]
    for (let i = 0; i < items.length; i++) {
      const mc = items[i].mon_con
      if (!groups.has(mc)) groups.set(mc, [])
      groups.get(mc).push({ itemIdx: i, cau: items[i].cau })
    }
    const maCauByItemIdx = new Array(items.length)
    for (const [monCon, entries] of groups) {
      const cauList = entries.map(e => e.cau)
      const { maCauList } = await insertCauBatch({ client: c, subject: monCon, cauList })
      entries.forEach((e, j) => { maCauByItemIdx[e.itemIdx] = maCauList[j] })
    }

    // (3) INSERT toan_de_thi_cau
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      const maCau = maCauByItemIdx[i]
      const isDai = it.mon_con === 'dai'
      await c.query(
        `insert into toan_de_thi_cau (
           de_id, thu_tu, phan, ma_cau_dai, ma_cau_hgt, diem
         ) values (
           $1, $2, $3, $4, $5, $6
         )`,
        [deId, it.thu_tu, it.phan, isDai ? maCau : null, isDai ? null : maCau, it.diem ?? null]
      )
    }

    await c.query('COMMIT')
    process.stdout.write(JSON.stringify({
      ok: true, de_id: deId, so_cau: items.length,
      ma_cau_list: maCauByItemIdx,
    }, null, 2) + '\n')
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {})
    process.stdout.write(JSON.stringify({ ok: false, error: e.message }, null, 2) + '\n')
    process.exit(4)
  } finally { await c.end() }
}

// ────────────────────────────────────────────────────────────────────────────
// done — move file + log
// ────────────────────────────────────────────────────────────────────────────
async function cmdDone(args) {
  const { file, sha } = args
  const deId = args['de-id']
  if (!file || !existsSync(file)) { console.error('❌ --file thiếu / không tồn tại'); process.exit(2) }
  if (!sha || !/^[0-9a-f]{64}$/.test(sha)) { console.error('❌ --sha sai định dạng'); process.exit(2) }
  if (!deId || !/^TD\d{5,}$/.test(deId)) { console.error('❌ --de-id sai định dạng (TDxxxxx)'); process.exit(2) }

  const shaReal = sha256File(file)
  if (shaReal !== sha) { console.error(`❌ sha file khác --sha (file: ${shaReal})`); process.exit(3) }

  const dayDir = join(ROOT_DE_THI, 'DaXuLy', ngayVN())
  mkdirSync(dayDir, { recursive: true })
  let dest = join(dayDir, basename(file))
  let n = 2
  while (existsSync(dest)) {
    dest = join(dayDir, basename(file).replace(/(\.[^.]+)$/, `_${n}$1`))
    n++
    if (n > 50) { console.error('❌ Quá nhiều bản trùng tên'); process.exit(3) }
  }

  // Đếm số câu đã link vào đề (để ghi so_cau_moi cho log)
  const url = chuoiKetNoi(true)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    const { rows: [{ n: soCau }] } = await c.query(
      `select count(*)::int as n from toan_de_thi_cau where de_id = $1`, [deId])
    const { rows } = await c.query(
      `select coalesce(ma_cau_dai, ma_cau_hgt) as ma_cau
         from toan_de_thi_cau where de_id = $1 order by thu_tu`, [deId])
    const maCauList = rows.map(r => r.ma_cau)

    await c.query('BEGIN')
    await c.query(
      `insert into nhap_kho_log (file_name, folder, sha256, so_cau_moi, ma_cau_list, ghi_chu)
       values ($1, 'co_giai', $2, $3, $4::jsonb, $5)`,
      [basename(file), sha, soCau, JSON.stringify(maCauList), `de_thi:${deId}`]
    )
    renameSync(file, dest)
    await c.query('COMMIT')
    process.stdout.write(JSON.stringify({
      ok: true, moved_to: dest.split(sep).join('/'), de_id: deId, so_cau: soCau,
    }, null, 2) + '\n')
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
  const { file, sha, error } = args
  if (!file) { console.error('❌ --file thiếu'); process.exit(2) }
  if (!sha || !/^[0-9a-f]{64}$/.test(sha)) { console.error('❌ --sha sai'); process.exit(2) }
  if (!error) { console.error('❌ --error thiếu'); process.exit(2) }
  const url = chuoiKetNoi(true)
  const c = new pg.Client({ connectionString: url })
  await c.connect()
  try {
    await c.query(
      `insert into nhap_kho_log (file_name, folder, sha256, so_cau_moi, ma_cau_list, loi, ghi_chu)
       values ($1, 'co_giai', $2, 0, '[]'::jsonb, $3, 'de_thi:fail')`,
      [basename(file), sha, String(error).slice(0, 2000)])
    process.stdout.write(JSON.stringify({ ok: false, logged: true }, null, 2) + '\n')
  } finally { await c.end() }
}

// ── main ────────────────────────────────────────────────────────────────────
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
