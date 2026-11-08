// Xuất lô "phân câu chưa gán vào dạng bài" — bản đồ mới KHTN (Thùy 03/11: chỉ câu CHƯA gán). Chỉ đọc DB.
//   node scripts/kho/khtn-bdm-xuat-phan.mjs <thư mục ra>
// Mỗi lô = vài nhóm cùng chủ đề: bảng đích (mọi dạng bài của nhóm, ĐỦ mô tả + lý thuyết + ví dụ, không cắt) + câu gốc chưa gán.
// Chặn cứng (exit 2) nếu dạng đích thiếu mô tả/lý thuyết/ví dụ (luật Thùy 02/11) — trừ khi --chap-nhan-thieu.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('begin read only')
const q = async (s, a) => (await c.query(s, a)).rows
const DIR = process.argv[2]; if (!DIR) throw new Error('thiếu thư mục ra'); fs.mkdirSync(DIR, { recursive: true })
const CHAP = process.argv.includes('--chap-nhan-thieu')
const CHI_DU = process.argv.includes('--chi-nhom-du')  // bỏ qua nhóm còn dạng thiếu tài liệu (chạy lại sau khi điền xong)
const cat = (s, n) => (s ?? '').length > n ? s.slice(0, n) + ' …' : (s ?? '')

// --tu-chon <dir>: câu ở dạng chờ — nhóm lấy từ kết quả trạm chọn nhóm (cho-*.out.json, khtn-bdm-xuat-cho.mjs), không từ dang_chinh
const TU_CHON = process.argv.includes('--tu-chon') ? process.argv[process.argv.indexOf('--tu-chon') + 1] : null
const chon = TU_CHON ? fs.readdirSync(TU_CHON).filter(f => /^cho-.*\.out\.json$/.test(f))
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(TU_CHON, f), 'utf8'))).filter(r => r.nhom_id) : []
const cau = TU_CHON
  ? await q(`select cd.khoi, cd.thu_tu cd_tt, n.id nhom_id, x.chac nhom_chac, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai, c.anh_de
      from jsonb_to_recordset($1::jsonb) x(ma_cau text, nhom_id text, chac text) join khtn_cau_hoi c on c.ma_cau=x.ma_cau
      join khtn_bdm_nhom n on n.id=x.nhom_id join khtn_bdm_chu_de cd on cd.id=n.chu_de_id
      where c.xoa_at is null and c.dang_chinh like '%000000' and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau=c.ma_cau)
      order by cd.khoi, cd.thu_tu, n.thu_tu, c.ma_cau`, [JSON.stringify(chon)])
  : await q(`select cd.khoi, cd.thu_tu cd_tt, n.id nhom_id, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai, c.anh_de
  from khtn_cau_hoi c join khtn_bdm_nhom n on n.ma_cu=c.dang_chinh join khtn_bdm_chu_de cd on cd.id=n.chu_de_id
  where c.xoa_at is null and c.parent_ma_cau is null and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau=c.ma_cau)
    and exists (select 1 from khtn_bdm_dang_bai d where d.nhom_id=n.id) order by cd.khoi, cd.thu_tu, n.thu_tu, c.ma_cau`)
const nhomIds = [...new Set(cau.map(r => r.nhom_id))]
const dich = await q(`select n.id nhom_id, cd.ten chu_de, ch.ten chuyen_de, n.ten nhom, n.ly_thuyet nhom_lt, d.id, d.thu_tu, d.ten, d.mo_ta, d.ly_thuyet, d.vi_du
  from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id=d.nhom_id join khtn_bdm_chu_de cd on cd.id=n.chu_de_id join khtn_bdm_chuyen_de ch on ch.id=n.chuyen_de_id
  where n.id = any($1) order by n.id, d.thu_tu`, [nhomIds])
const thieu = dich.filter(d => !d.mo_ta?.trim() || !d.ly_thuyet?.trim() || !d.vi_du?.trim())
const nhomThieu = new Set(thieu.map(d => d.nhom_id))
if (thieu.length && CHI_DU) { console.log(`bỏ qua ${nhomThieu.size} nhóm còn dạng thiếu tài liệu`); for (const id of nhomThieu) nhomIds.splice(nhomIds.indexOf(id), 1) }
else if (thieu.length) {
  console.log(`⚠ ${thieu.length} dạng đích thiếu mô tả/lý thuyết/ví dụ:`, thieu.slice(0, 10).map(d => d.id).join(', '))
  if (!CHAP) { console.log('DỪNG — điền bản đồ trước (hoặc --chap-nhan-thieu để thử).'); process.exit(2) }
}
const dByN = {}; for (const d of dich) (dByN[d.nhom_id] ??= []).push(d)
const cByN = {}; for (const r of cau) (cByN[r.nhom_id] ??= []).push(r)
const lo = {}
for (const nid of nhomIds) {
  const r0 = cByN[nid][0]; const key = `${TU_CHON ? "phancho" : "phan"}-${r0.khoi}-${String(r0.cd_tt).padStart(2, '0')}`
  let k = 0; const ten = () => key + (k ? '-' + k : '')
  while (lo[ten()] && lo[ten()].so + cByN[nid].length > 120) k++
  const L = (lo[ten()] ??= { nhom: [], cau: [], so: 0 })
  const ds = dByN[nid]
  L.nhom.push({ nhom_id: nid, chu_de: ds[0].chu_de, chuyen_de: ds[0].chuyen_de, nhom: ds[0].nhom, nhom_ly_thuyet: ds[0].nhom_lt,
    dang_bai: ds.map(d => ({ dang_id: d.id, thu_tu: d.thu_tu, ten: d.ten, mo_ta: d.mo_ta, ly_thuyet: d.ly_thuyet, vi_du: d.vi_du,
      ...((!d.mo_ta?.trim() || !d.ly_thuyet?.trim() || !d.vi_du?.trim()) ? { canh_bao: '⚠ THIẾU tài liệu — tối đa mức vua' } : {}) })) })
  L.cau.push(...cByN[nid].map(r => ({ ma_cau: r.ma_cau, nhom_id: nid, ...(r.nhom_chac ? { nhom_chac: r.nhom_chac } : {}), loai: r.loai_cau, de: r.noi_dung, ...(r.lua_chon ? { lua_chon: r.lua_chon } : {}),
    ...(r.menh_de ? { menh_de: r.menh_de } : {}), ...(r.dap_an ? { dap_an: r.dap_an } : {}), loi_giai: cat(r.loi_giai, 800), ...(r.anh_de ? { co_hinh: true } : {}) })))
  L.so += cByN[nid].length
}
for (const [k, v] of Object.entries(lo)) {
  fs.writeFileSync(path.join(DIR, k + '.in.json'), JSON.stringify({ nhom: v.nhom, cau: v.cau }, null, 1))
  console.log(k, 'nhóm', v.nhom.length, 'câu', v.cau.length)
}
console.log('tổng câu', cau.length, 'lô', Object.keys(lo).length)
await c.query('rollback'); await c.end()
