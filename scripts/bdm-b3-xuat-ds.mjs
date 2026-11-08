// B3 Khớp theo DANH SÁCH câu (Đại) — xuất lô cho máy khớp, CHỈ ĐỌC DB. Dùng cho đợt "câu đã có HS làm mà mastery bản đồ mới
// chưa quy được" (PLAN-mastery-ban-do-moi.md, 23/10). Cặp với bdm-b3-gop-lo / bdm-b3-khop-lai-hang (--khong-gan).
//   node scripts/bdm-b3-xuat-ds.mjs <ds.json> <ten-dot> [--lo 60] [--chi-chu-de 12=NCD00095,…] [--nhanh toan,hgt]
//   --nhanh: nhánh của bảng đích (mặc định toan); K12 câu Đại về toạ độ Oxyz cần cả dạng bài nhánh hgt (cùng bảng dai_bdm_dang_bai)
// ds.json = {cau:[{ma_cau, kho, luot, …}]} — chỉ lấy kho 'dai'. Mỗi câu quy về ĐỐI TƯỢNG CẦN XẾP:
//   · câu gốc còn sống (bản sao tự theo gốc — mig 202610231604) ;
//   · gốc đã xoá ⇒ MỘT bản sao đại diện cho cả nhóm bản sao cùng gốc (ghi vào nhom.json: đại diện → mọi bản sao trong ds).
// Câu Đúng/Sai bỏ (kho Đ/S cấp chủ đề, luật 18/10). Gom theo khối của dạng cũ ⇒ kho-rules/dai/lo/b3/k<khoi>-<ten-dot>/:
//   dich.md (bảng đích nhánh Toán của khối; --chi-chu-de giới hạn chủ đề cho khối đó) · lo-NN.json · nhom.json
//   _mau/k<khoi>-<ten-dot>.json = {} (đợt này không có mẫu) để bdm-b3-gop-lo chạy được.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')

const args = process.argv.slice(2)
const [dsFile, dot] = args
const so = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const LO = +so('--lo', 60)
const NHANH = so('--nhanh', 'toan').split(',')
const chiCD = Object.fromEntries((so('--chi-chu-de', '') || '').split(',').filter(Boolean).map((x) => x.split('=')))
if (!dsFile || !dot) { console.error('Dùng: node scripts/bdm-b3-xuat-ds.mjs <ds.json> <ten-dot> [--lo 60] [--chi-chu-de 12=NCD00095]'); process.exit(2) }
const ds = JSON.parse(fs.readFileSync(dsFile, 'utf8')).cau.filter((x) => x.kho === 'dai')

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
await c.query('begin read only')
const q = async (s, p) => (await c.query(s, p)).rows
const cat = (s, n) => { s = (s ?? '').replace(/\s+\n/g, '\n').trim(); return s.length > n ? s.slice(0, n) + ' …' : s }

// đối tượng cần xếp của từng câu
const rows = await q(`
  select x.ma_cau, case when q.parent_ma_cau is not null and p.xoa_at is null then q.parent_ma_cau else x.ma_cau end doi_tuong,
         (q.parent_ma_cau is not null and p.xoa_at is not null) goc_xoa, q.parent_ma_cau, q.loai_cau
    from unnest($1::text[]) x(ma_cau) join dai_cau_hoi q on q.ma_cau = x.ma_cau left join dai_cau_hoi p on p.ma_cau = q.parent_ma_cau`, [ds.map((x) => x.ma_cau)])
const nhom = {}   // đại diện → [bản sao] (chỉ nhóm gốc đã xoá); đối tượng thường → [chính nó]
const daiDien = {} // gốc đã xoá → bản sao đại diện
for (const r of rows) {
  if (r.loai_cau === 'dung_sai') continue
  let dt = r.doi_tuong
  if (r.goc_xoa) { daiDien[r.parent_ma_cau] ??= r.ma_cau; dt = daiDien[r.parent_ma_cau] }
  ;(nhom[dt] ??= []).includes(r.ma_cau) || nhom[dt].push(r.ma_cau)
}
const doiTuong = Object.keys(nhom)
const cau = await q(`
  select q.ma_cau, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, b.khoi, b.ten_chuyen_de, b.ten_dang
    from dai_cau_hoi q left join dai_ban_do b on b.ma_dang = q.dang_chinh where q.ma_cau = any($1) order by q.ma_cau`, [doiTuong])
const theoKhoi = {}
for (const r of cau) (theoKhoi[r.khoi ?? '?'] ??= []).push(r)

for (const [khoi, ds2] of Object.entries(theoKhoi)) {
  const dich = await q(`
    select d.id, d.ten, d.mo_ta, d.vi_du, n.ten nhom, n.mo_ta nhom_mo_ta, cd.ten chu_de, cdx.ten chuyen_de
      from dai_bdm_dang_bai d
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
      left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
     where cd.khoi = $1 and cd.nhanh = any($3) and ($2::text is null or cd.id = $2)
     order by cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu`, [khoi, chiCD[khoi] ?? null, NHANH])
  const ngoai = await q(`select ten, nhanh from dai_bdm_chu_de where khoi = $1 and (nhanh <> all($3) or ($2::text is not null and id <> $2)) order by thu_tu`, [khoi, chiCD[khoi] ?? null, NHANH])
  const goc = path.join('kho-rules', 'dai', 'lo', 'b3', `k${khoi}-${dot}`)
  fs.mkdirSync(goc, { recursive: true })
  for (const f of fs.readdirSync(goc)) if (/^lo-\d+\.json$/.test(f)) throw new Error(`${goc} đã có lô`)
  const md = [`# Bảng đích khối ${khoi} — ${dich.length} dạng bài (nhánh ${NHANH.join(' + ')})${chiCD[khoi] ? ` — CHỈ chủ đề ${chiCD[khoi]} (bản đồ chuẩn)` : ''}`, '']
  if (ngoai.length) md.push(`> Chủ đề KHÔNG nằm trong bảng đích: ${ngoai.map((x) => `${x.ten} [${x.nhanh}]`).join(' · ')}. Câu thuộc các chủ đề này ⇒ để trống, lý do "thuộc <tên chủ đề>"${chiCD[khoi] ? ' (chủ đề chưa có bản đồ chuẩn — KHÔNG ép vào bảng đích)' : ''}.`, '')
  let cdT = '', nhT = ''
  for (const d of dich) {
    if (d.chu_de !== cdT) { md.push(`## Chủ đề: ${d.chu_de}`, ''); cdT = d.chu_de; nhT = '' }
    const nh = `${d.chuyen_de} › ${d.nhom}`
    if (nh !== nhT) { md.push(`### ${nh}${d.nhom_mo_ta ? ` — ${cat(d.nhom_mo_ta, 300)}` : ''}`, ''); nhT = nh }
    md.push(`- **${d.id}** · ${d.ten}`)
    if (d.mo_ta) md.push(`  - Mô tả: ${cat(d.mo_ta, 500).replace(/\n/g, ' ')}`)
    if (d.vi_du) md.push(`  - Ví dụ: ${cat(d.vi_du, 450).replace(/\n/g, ' ')}`)
  }
  fs.writeFileSync(path.join(goc, 'dich.md'), md.join('\n') + '\n')
  const gon = (r) => ({
    ma_cau: r.ma_cau, loai: r.loai_cau, de: cat(r.noi_dung, 1500),
    ...(r.lua_chon ? { lua_chon: r.lua_chon } : {}), ...(r.menh_de ? { menh_de: r.menh_de } : {}),
    ...(r.dap_an ? { dap_an: cat(r.dap_an, 200) } : {}), ...(r.loi_giai ? { loi_giai: cat(r.loi_giai, 700) } : {}),
    ...(r.anh_de ? { co_hinh: true } : {}), nhan_cu: `${r.ten_chuyen_de ?? ''} › ${r.ten_dang ?? ''}`,
  })
  let n = 0
  for (let i = 0; i < ds2.length; i += LO) { n++; fs.writeFileSync(path.join(goc, `lo-${String(n).padStart(2, '0')}.json`), JSON.stringify(ds2.slice(i, i + LO).map(gon), null, 1)) }
  fs.writeFileSync(path.join(goc, 'nhom.json'), JSON.stringify(Object.fromEntries(ds2.map((r) => [r.ma_cau, nhom[r.ma_cau]])), null, 1))
  fs.mkdirSync(path.join('kho-rules', 'dai', 'lo', 'b3', '_mau'), { recursive: true })
  fs.writeFileSync(path.join('kho-rules', 'dai', 'lo', 'b3', '_mau', `k${khoi}-${dot}.json`), '{}')
  console.log(`K${khoi}: ${dich.length} dạng bài · ${ds2.length} đối tượng (phủ ${ds2.reduce((s, r) => s + nhom[r.ma_cau].length, 0)} câu trong ds) · ${n} lô ⇒ ${goc}`)
}
await c.query('rollback'); await c.end()
