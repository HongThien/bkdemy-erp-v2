// ============================================================================
// ghi.mjs — GHI 1 đề đã bóc (`de.json`) vào ERP (spec-de-thi.md §10.3 bước 5–6).
//
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc>           # CHẠY THỬ: ghi trong transaction rồi ROLLBACK, in tóm tắt
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc> --ghi     # ghi thật
//
// Thư mục làm việc: de.json (từ boc-word.mjs, Claude đã điền `kho` + `dang` từng câu và xử lý cảnh báo) · img/ · goc.pdf (nếu có).
// Ghi 1 TRANSACTION: câu → <kho>_cau_hoi (da_duyet=false, nguon='de_thi'; trùng câu đã có ⇒ trỏ về câu cũ, không đẻ bản sao)
//   · đề → tai_lieu(loai='de_thi') + tai_lieu_phan(custom) + tai_lieu_cau (đường A)
//   · nhap_kho_log (sha256 ⇒ chạy lại không nhân đôi).
// Ảnh câu → bucket kho-anh · PDF gốc → bucket kho-tailieu (ngoài transaction; chỉ khi --ghi).
// Dạng: câu không có `dang` ⇒ dạng chờ của kho + khối (đề VẪN vào — CEO 01/10: đề luôn dùng được, chỉ cảnh báo).
// Cảnh báo từng câu (đáp án 2 nguồn lệch, hình thiếu…) lưu vào cau_hinh.deThi.canhBaoCau[ma_cau] cho người duyệt đọc.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch, laDangCho } from '../../_kho_insert.mjs'
import { bien, docEnv, GOC_REPO } from '../cau-hinh.mjs'

const args = process.argv.slice(2)
const dir = args.find((a) => !a.startsWith('--'))
const GHI = args.includes('--ghi')
if (!dir || !existsSync(join(dir, 'de.json'))) { console.error('Dùng: node scripts/kho/de-thi/ghi.mjs <thư mục có de.json> [--ghi]'); process.exit(2) }
const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!url) { console.error('❌ Không có chuỗi kết nối GHI (DATABASE_URL_RW hoặc DATABASE_URL).'); process.exit(2) }

// ── kiểm trước khi đụng DB ───────────────────────────────────────────────────
const loi = []
if (!de.khoi) loi.push('thiếu khoi')
if (!de.ten) loi.push('thiếu ten')
de.cau.forEach((q) => {
  const ten = `P${q.phan} câu ${q.so}`
  if (!['dai', 'hgt', 'hinh_hoc'].includes(q.kho)) loi.push(`${ten}: chưa chọn kho (dai / hgt / hinh_hoc)`)
  if (q.loai_cau === 'trac_nghiem') {
    if (!Array.isArray(q.lua_chon) || q.lua_chon.length !== 4 || q.lua_chon.some((x) => !x)) loi.push(`${ten}: trắc nghiệm phải đủ 4 phương án`)
    if (q.dap_an != null && !/^[ABCD]$/.test(q.dap_an)) loi.push(`${ten}: đáp án TN phải là A/B/C/D`)
  }
  if (q.loai_cau === 'dung_sai' && (!q.menh_de?.length || q.menh_de.some((m) => !['D', 'S'].includes(m.dap_an)))) loi.push(`${ten}: mệnh đề Đúng/Sai thiếu đáp án`)
  if (/\[\[(?!u\]\]|\/u\]\])/.test(JSON.stringify([q.noi_dung, q.lua_chon, q.menh_de, q.loi_giai]))) loi.push(`${ten}: còn ký hiệu [[…]] chưa xử lý trong nội dung`)
})
if (loi.length) { console.error('❌ de.json chưa ghi được:\n  ' + loi.join('\n  ')); process.exit(3) }

// ── upload (chỉ khi ghi thật) ────────────────────────────────────────────────
const envLocal = docEnv(join(GOC_REPO, '.env.local'))
let sb = null
function storage() {
  if (!sb) {
    const u = envLocal.VITE_SUPABASE_URL, k = envLocal.SUPABASE_SERVICE_ROLE
    if (!u || !k) throw new Error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local')
    sb = createClient(u, k, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return sb
}
async function up(bucket, path, buf, contentType) {
  if (!GHI) return `dry://${bucket}/${path}`
  const { error } = await storage().storage.from(bucket).upload(path, buf, { contentType, upsert: false })
  if (error) throw new Error(`upload ${path}: ${error.message}`)
  return storage().storage.from(bucket).getPublicUrl(path).data.publicUrl
}
const sha8 = de.sha256.slice(0, 8)
const thang = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
async function upAnh(f, nhan) {
  const p = join(dir, 'img', f)
  if (!existsSync(p)) throw new Error(`thiếu file ảnh ${p}`)
  const ext = f.split('.').pop().toLowerCase()
  return up('kho-anh', `nhap_kho/${thang}/${randomUUID()}_${sha8}_${nhan}.${ext}`, readFileSync(p), ext === 'png' ? 'image/png' : 'image/jpeg')
}
const laAnhDuoc = (f) => /\.(png|jpe?g)$/i.test(f)

// ── chạy ─────────────────────────────────────────────────────────────────────
const c = new pg.Client({ connectionString: url })
await c.connect()
let ma = 0
try {
  // đã nhập chưa (theo sha256 file gốc)
  const { rows: da } = await c.query(
    `select id, ten from tai_lieu where loai = 'de_thi' and cau_hinh -> 'deThi' ->> 'sha256' = $1`, [de.sha256])
  if (da.length) { console.error(`❌ Đề này đã có trên ERP: "${da[0].ten}" (tai_lieu ${da[0].id}) — không nhập lần hai.`); process.exit(4) }

  // ảnh + PDF gốc (ngoài transaction)
  const canhBaoThem = new Map() // q → [..]
  const anhCua = new Map()
  for (const q of de.cau) {
    const nhan = `p${q.phan}c${q.so}`
    const a = q.anh.filter(laAnhDuoc), g = q.anh_giai.filter(laAnhDuoc)
    const cb = []
    if (a.length > 1) cb.push(`đề có ${a.length} hình, chỉ giữ hình đầu (${a[0]})`)
    if (g.length > 1) cb.push(`lời giải có ${g.length} hình, chỉ giữ hình đầu`)
    anhCua.set(q, [a[0] ? await upAnh(a[0], nhan) : null, g[0] ? await upAnh(g[0], nhan + 'g') : null])
    if (cb.length) canhBaoThem.set(q, cb)
  }
  let pdfGocUrl = null
  const pdf = join(dir, 'goc.pdf')
  if (existsSync(pdf)) pdfGocUrl = await up('kho-tailieu', `de_thi/${thang}/${randomUUID()}_${sha8}.pdf`, readFileSync(pdf), 'application/pdf')

  await c.query('begin')
  const maCua = new Map() // q → { ma_cau, kho, trung }
  const tk = { moi: 0, trung: 0, dang_cho: 0, menh_de_cho: 0 }
  for (const kho of ['dai', 'hgt', 'hinh_hoc']) { // hinh_hoc = hình phẳng THCS (K8 10/10), mã câu do DB cấp
    const grp = de.cau.filter((q) => q.kho === kho)
    if (!grp.length) continue
    const cauList = grp.map((q) => {
      const [anhDe, anhGiai] = anhCua.get(q)
      const base = { dang_chinh: q.dang || 'CHUA', khoi: String(de.khoi), loai_cau: q.loai_cau, noi_dung: q.noi_dung,
        nguon: 'de_thi', nguon_giai: 'nguoi', ten_de_goc: de.ten, anh_de: anhDe, anh_dap_an: anhGiai }
      if (q.loai_cau === 'trac_nghiem') return { ...base, lua_chon: q.lua_chon, dap_an: q.dap_an ?? null, loi_giai: q.loi_giai ?? null }
      if (q.loai_cau === 'dung_sai') return { ...base, dap_an: null, loi_giai: q.loi_giai ?? null,
        menh_de: q.menh_de.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, ma_dang: m.dang || 'CHUA', loi_giai: m.loi_giai ?? null })) }
      return { ...base, dap_an: q.dap_an ?? null, loi_giai: q.loi_giai ?? null }
    })
    const r = await insertCauBatch({ client: c, subject: kho, cauList })
    const trung = new Map(r.trung.map((t) => [t.idx, t]))
    grp.forEach((q, i) => {
      maCua.set(q, { ma_cau: r.maCauList[i], kho, trung: trung.has(i) })
      if (trung.has(i)) tk.trung++; else tk.moi++
      if (laDangCho(cauList[i].dang_chinh)) tk.dang_cho++
      if (cauList[i].menh_de) tk.menh_de_cho += cauList[i].menh_de.filter((m) => laDangCho(m.ma_dang)).length
    })
  }

  // đề
  const nhanhByCau = {}, canhBaoCau = {}
  for (const q of de.cau) {
    const m = maCua.get(q)
    if (m.kho === 'hgt') nhanhByCau[m.ma_cau] = 'hinh_gt'
    else if (m.kho === 'hinh_hoc') nhanhByCau[m.ma_cau] = 'hinh_hoc'
    const cb = [...(q.canh_bao ?? []), ...(canhBaoThem.get(q) ?? [])]
    if (cb.length) canhBaoCau[m.ma_cau] = cb
  }
  const cauHinh = {
    deThi: { nguon: de.nguon ?? 'le', nam: de.nam ?? null, thoiGianPhut: de.thoi_gian_phut ?? 90, thangDiem: de.thang_diem ?? 10,
      sha256: de.sha256, file: de.file, pdfGocUrl, phan: de.phan.map(({ thu_tu, ten, dang_thuc, diem_moi_cau }) => ({ thu_tu, ten, dang_thuc, diem_moi_cau })),
      ...(Object.keys(canhBaoCau).length ? { canhBaoCau } : {}) },
    ...(Object.keys(nhanhByCau).length ? { nhanhByCau } : {}),
  }
  const { rows: [tl] } = await c.query(
    `insert into tai_lieu (loai, ten, khoi, mon, cau_hinh, file_url) values ('de_thi', $1, $2, $3, $4::jsonb, $5) returning id`,
    [de.ten, String(de.khoi), de.mon ?? 'Toán', JSON.stringify(cauHinh), pdfGocUrl])
  for (let pi = 0; pi < de.phan.length; pi++) {
    const p = de.phan[pi]
    const { rows: [ph] } = await c.query(
      `insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung) values ($1, $2, 'custom', null, $3, null) returning id`,
      [tl.id, pi, `Phần ${p.thu_tu}: ${p.ten}`])
    let tt = 0
    for (const q of de.cau.filter((x) => x.phan === p.thu_tu).sort((a, b) => a.so - b.so)) {
      await c.query(`insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) values ($1, $2, $3)`, [ph.id, maCua.get(q).ma_cau, tt++])
    }
  }
  const maList = de.cau.map((q) => maCua.get(q).ma_cau)
  await c.query(
    `insert into nhap_kho_log (file_name, folder, sha256, so_cau_moi, ma_cau_list, ghi_chu) values ($1, 'co_giai', $2, $3, $4::jsonb, $5)`,
    [de.file, de.sha256, tk.moi, JSON.stringify(maList), `de_thi:${tl.id}`])

  // đọc lại qua đúng hàm ERP dùng — bằng chứng đề hiện đủ, đúng thứ tự
  const { rows: doc } = await c.query(`select stt, phan_thu_tu, ma_cau, kho, loai_cau, dang_chinh, dap_an, diem, xoa from fn_de_thi_cau($1) order by stt`, [tl.id])
  const { rows: thieu } = await c.query(`select * from fn_de_thi_thieu($1)`, [tl.id]).catch((e) => ({ rows: [{ loi: e.message }] }))

  console.log(`\n${GHI ? 'GHI THẬT' : 'CHẠY THỬ (sẽ ROLLBACK)'} — "${de.ten}" · khối ${de.khoi} · ${de.cau.length} câu`)
  console.log(`  câu mới ${tk.moi} · trùng câu đã có (trỏ về câu cũ) ${tk.trung} · câu ở dạng chờ ${tk.dang_cho} · mệnh đề ở dạng chờ ${tk.menh_de_cho}`)
  console.log(`  ảnh: ${[...anhCua.values()].flat().filter(Boolean).length} · PDF gốc: ${pdfGocUrl ? 'có' : 'không'} · tai_lieu ${tl.id}`)
  console.log('  STT | phần | kho | loại          | mã câu          | dạng         | đáp án | điểm | ghi chú')
  for (const r of doc) {
    const q = de.cau.find((x) => maCua.get(x).ma_cau === r.ma_cau && x.phan === r.phan_thu_tu + 1) ?? de.cau.find((x) => maCua.get(x).ma_cau === r.ma_cau)
    const m = maCua.get(q)
    console.log(`  ${String(r.stt).padStart(3)} | ${String(r.phan_thu_tu + 1).padStart(4)} | ${r.kho.padEnd(3)} | ${r.loai_cau.padEnd(13)} | ${r.ma_cau.padEnd(15)} | ${(laDangCho(r.dang_chinh) ? 'CHỜ' : r.dang_chinh).padEnd(12)} | ${(r.dap_an ?? (r.loai_cau === 'dung_sai' ? q.menh_de.map((x) => x.dap_an).join('') : '—')).padEnd(6)} | ${String(r.diem).padStart(4)} | ${[m.trung ? 'TRÙNG câu cũ' : '', ...(canhBaoCau[r.ma_cau] ?? [])].filter(Boolean).join(' · ').slice(0, 110)}`)
  }
  console.log(`  fn_de_thi_thieu: ${thieu.length} dòng` + (thieu.length ? ' — ' + JSON.stringify(thieu.slice(0, 4)).slice(0, 400) : ''))

  if (GHI) { await c.query('commit'); console.log(`\n✔ Đã ghi. Đề: tai_lieu ${tl.id}`) }
  else { await c.query('rollback'); console.log('\nĐã ROLLBACK — DB không đổi. Thêm --ghi để ghi thật.') }
} catch (e) {
  ma = 1
  try { await c.query('rollback') } catch {}
  console.error('✘ LỖI — đã rollback:', e.message)
} finally { await c.end() }
process.exit(ma)
