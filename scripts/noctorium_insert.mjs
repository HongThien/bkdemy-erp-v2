// ============================================================================
// noctorium_insert.mjs — nhập JSON đề (từ noctorium_parse.mjs) vào DB: câu → <kho>_cau_hoi (da_duyet=false,
// dạng theo noctorium_crosswalk.mjs, không chắc ⇒ dạng chờ), đề → tai_lieu(loai='de_thi') + tai_lieu_phan(custom)
// + tai_lieu_cau (đường A, spec-de-thi.md §3). MỖI ĐỀ = 1 TRANSACTION; ghi nhap_kho_log(folder='noctorium', sha256)
// nên chạy lại tự bỏ qua đề đã nhập.
//
//   node scripts/noctorium_insert.mjs --in <outdir của parse> --khoi 12 [--dry] [--chi <sha8>] [--limit N]
//
// --dry: không đụng DB/storage, chỉ in thống kê gán dạng + mẫu payload. Ảnh: upload kho-anh/nhap_kho/<YYYY-MM>/…
// (service role .env.local, cùng quy ước kho_anh.mjs — không import file đó vì nó tự chạy CLI khi import).
// Điểm phần/thời gian: cau_hinh.deThi (khuôn Bộ: TN 0,25 · Đ/S 1 · TLN 0,5; 90 phút — CEO 22/09), chưa cần cột mới.
// ============================================================================
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from './_kho_insert.mjs'
import { ganDang } from './noctorium_crosswalk.mjs'

const A = {}; { const v = process.argv.slice(2); for (let i = 0; i < v.length; i++) if (v[i].startsWith('--')) { A[v[i].slice(2)] = v[i + 1] && !v[i + 1].startsWith('--') ? v[++i] : true } }
if (!A.in || !A.khoi) { console.error('Cần --in <dir> --khoi <11|12> [--dry] [--chi sha8] [--limit N]'); process.exit(2) }
const DRY = !!A.dry
const env = {}
for (const f of ['.env', '.env.local']) if (existsSync(f)) for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, '') }
const DB = process.env.DATABASE_URL_RW ?? env.DATABASE_URL
if (!DRY && !DB) { console.error('Thiếu DATABASE_URL (hoặc DATABASE_URL_RW)'); process.exit(2) }

// ── ảnh ──────────────────────────────────────────────────────────────────────
let sb = null
async function upAnh(pngPath, ten) {
  if (DRY) return `dry://${ten}`
  if (!sb) { if (!env.VITE_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE) throw new Error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE (.env.local)'); sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) }
  const thang = new Date().toISOString().slice(0, 7)
  const path = `nhap_kho/${thang}/${randomUUID()}_${ten.replace(/[^a-zA-Z0-9_-]/g, '')}.png`
  const { error } = await sb.storage.from('kho-anh').upload(path, readFileSync(pngPath), { contentType: 'image/png', upsert: false })
  if (error) throw new Error(`upload ảnh ${ten}: ${error.message}`)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

// ── payload câu theo format _kho_insert ───────────────────────────────────────
function payload(q, de, dang, anhDe, anhGiai) {
  const base = {
    dang_chinh: dang, khoi: String(de.khoi), loai_cau: q.loai_cau, noi_dung: q.noi_dung,
    nguon: 'de_thi', nguon_giai: 'nguoi', ten_de_goc: de.file.replace(/\.docx$/i, ''),
    anh_de: anhDe ?? null, anh_dap_an: anhGiai ?? null,
  }
  if (q.loai_cau === 'trac_nghiem') return { ...base, lua_chon: q.lua_chon, dap_an: q.dap_an ?? null, loi_giai: q.loi_giai || null }
  if (q.loai_cau === 'dung_sai') return { ...base, menh_de: q.menh_de.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, ma_dang: 'CHUA', loi_giai: m.loi_giai ?? null })), dap_an: null, loi_giai: null }
  if (q.loai_cau === 'tra_loi_ngan') return { ...base, dap_an: q.dap_an ?? null, loi_giai: q.loi_giai || null }
  // tự luận: giữ nguyên (CEO 22/09: chỉ ý có đáp số mới đổi TLN — bước sau, cần đọc)
  return { ...base, dap_an: null, loi_giai: [q.y?.length ? q.y.join('\n') : '', q.loi_giai || ''].filter(Boolean).join('\n\n') || null }
}

// ── main ─────────────────────────────────────────────────────────────────────
const dir = join(A.in, 'de'); const imgDir = join(A.in, 'img')
let files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
if (A.chi) files = files.filter((f) => f.startsWith(String(A.chi)))
if (A.limit) files = files.slice(0, +A.limit)
const client = DRY ? null : new pg.Client({ connectionString: DB })
if (client) await client.connect()
const daCo = new Set()
// nhap_kho_log.folder có CHECK (co_giai/khong_giai…) ⇒ dùng 'co_giai' + ghi_chu 'noctorium de_thi:<id>' để nhận diện
if (client) for (const r of (await client.query(`select sha256 from nhap_kho_log where ghi_chu like 'noctorium %'`)).rows) daCo.add(r.sha256)

const tk = { de_nhap: 0, de_bo_qua: 0, de_skip_hinh11: 0, cau_moi: 0, cau_trung: 0, cau_chua_dang: 0, cau_co_dang: 0, anh: 0, theo_dang: {}, chua_ly_do: {}, loi: [] }
for (const f of files) {
  const de = JSON.parse(readFileSync(join(dir, f), 'utf8'))
  if (daCo.has(de.sha256)) { tk.de_bo_qua++; continue }
  // 1) gán dạng + kho
  const items = de.cau.map((q) => ({ q, g: ganDang(de.khoi, q) }))
  if (items.some((x) => x.g.subject === null)) { tk.de_skip_hinh11++; continue } // đề có câu chưa có kho đích ⇒ để nguyên cả đề
  for (const x of items) {
    if (x.g.dang === 'CHUA') { tk.cau_chua_dang++; tk.chua_ly_do[x.g.ly_do] = (tk.chua_ly_do[x.g.ly_do] ?? 0) + 1 }
    else { tk.cau_co_dang++; tk.theo_dang[x.g.dang] = (tk.theo_dang[x.g.dang] ?? 0) + 1 }
  }
  if (DRY) { tk.de_nhap++; tk.cau_moi += items.length; continue }
  try {
    // 2) ảnh (ngoài transaction — lỡ rollback thì ảnh mồ côi trên storage, chấp nhận)
    const anh = new Map()
    for (const x of items) {
      const ten = `${de.sha256.slice(0, 8)}_c${x.q.thu_tu}`
      if (x.q.anh?.[0]) anh.set(x.q, [await upAnh(join(imgDir, x.q.anh[0]), ten), x.q.anh_giai?.[0] ? await upAnh(join(imgDir, x.q.anh_giai[0]), ten + 'g') : null])
      else if (x.q.anh_giai?.[0]) anh.set(x.q, [null, await upAnh(join(imgDir, x.q.anh_giai[0]), ten + 'g')])
      tk.anh += (x.q.anh?.[0] ? 1 : 0) + (x.q.anh_giai?.[0] ? 1 : 0)
    }
    await client.query('begin')
    // 3) insert câu theo kho, giữ ánh xạ vị trí → ma_cau
    const maCauOf = new Map()
    for (const subject of ['dai', 'hgt']) {
      const grp = items.filter((x) => x.g.subject === subject)
      if (!grp.length) continue
      const cauList = grp.map((x) => payload(x.q, de, x.g.dang, ...(anh.get(x.q) ?? [null, null])))
      const r = await insertCauBatch({ client, subject, cauList })
      grp.forEach((x, i) => maCauOf.set(x.q, { ma_cau: r.maCauList[i], subject }))
      tk.cau_trung += r.trung.length; tk.cau_moi += grp.length - r.trung.length
    }
    // 4) đề = tai_lieu + phần + câu
    const nhanhByCau = {}; for (const [, v] of maCauOf) if (v.subject === 'hgt') nhanhByCau[v.ma_cau] = 'hinh_gt'
    const cauHinh = { deThi: { nguon: 'noctorium', nam: de.nam, truong: de.truong, thoiGianPhut: 90, thangDiem: 10, sha256: de.sha256, file: de.file, phan: de.phan }, ...(Object.keys(nhanhByCau).length ? { nhanhByCau } : {}) }
    const { rows: [tl] } = await client.query(
      `insert into tai_lieu (loai, ten, khoi, mon, cau_hinh) values ('de_thi', $1, $2, 'Toán', $3::jsonb) returning id`,
      [de.ten, String(de.khoi), JSON.stringify(cauHinh)])
    for (let pi = 0; pi < de.phan.length; pi++) {
      const p = de.phan[pi]
      const { rows: [ph] } = await client.query(
        `insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung) values ($1, $2, 'custom', null, $3, null) returning id`,
        [tl.id, pi, `Phần ${p.thu_tu}: ${p.ten}`])
      const caus = items.filter((x) => x.q.phan === p.thu_tu)
      let tt = 0
      for (const x of caus) {
        const m = maCauOf.get(x.q); if (!m) continue
        await client.query(`insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) values ($1, $2, $3)`, [ph.id, m.ma_cau, tt++])
      }
    }
    // 5) log
    const maList = [...maCauOf.values()].map((v) => v.ma_cau)
    await client.query(
      `insert into nhap_kho_log (file_name, folder, sha256, so_cau_moi, ma_cau_list, ghi_chu) values ($1, 'co_giai', $2, $3, $4::jsonb, $5)`,
      [de.file, de.sha256, maList.length, JSON.stringify(maList), `noctorium de_thi:${tl.id}`])
    await client.query('commit')
    tk.de_nhap++
    console.error(`✓ ${de.file.slice(0, 70)} → tai_lieu ${tl.id} (${maList.length} câu)`)
  } catch (e) {
    try { await client.query('rollback') } catch {}
    tk.loi.push(`${de.file}: ${e.message}`)
    console.error(`✗ ${de.file.slice(0, 70)}: ${e.message}`)
  }
}
if (client) await client.end()
console.log(JSON.stringify(tk, null, 1))
