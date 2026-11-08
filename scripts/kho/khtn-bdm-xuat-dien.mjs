// Xuất lô "điền bản đồ KHTN mới" (Thùy 03/11): mô tả + lý thuyết + ví dụ cho dạng bài trống, lý thuyết nhóm trống,
// và nhóm CHƯA có dạng bài (trạm đề xuất dạng). Chỉ đọc DB.
//   node scripts/kho/khtn-bdm-xuat-dien.mjs <thư mục ra>
//   → <dir>/dien-<khối>-<cđ>[-k].in.json  (nhóm đã có dạng)  ·  <dir>/tao-<khối>-<cđ>[-k].in.json (nhóm chưa có dạng)
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('begin read only')
const q = async (s, a) => (await c.query(s, a)).rows
const DIR = process.argv[2]; if (!DIR) throw new Error('thiếu thư mục ra'); fs.mkdirSync(DIR, { recursive: true })
const cat = (s, n) => (s ?? '').length > n ? s.slice(0, n) + ' …' : (s ?? '')
const cau = r => ({ ma_cau: r.ma_cau, loai: r.loai_cau, de: cat(r.noi_dung, 600), ...(r.lua_chon ? { lua_chon: r.lua_chon } : {}),
  ...(r.dap_an ? { dap_an: r.dap_an } : {}), loi_giai: cat(r.loi_giai, 700), ...(r.anh_de ? { co_hinh: true } : {}) })

const nhoms = await q(`select cd.khoi, cd.thu_tu cd_tt, cd.ten chu_de, ch.ten chuyen_de, o.thu_tu o_tt, n.id, n.thu_tu, n.ten, n.mo_ta, n.ly_thuyet, n.ma_cu
  from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id=n.chu_de_id join khtn_bdm_chuyen_de ch on ch.id=n.chuyen_de_id
  join khtn_bdm_o o on o.chu_de_id=n.chu_de_id and o.chuyen_de_id=n.chuyen_de_id order by cd.khoi, cd.thu_tu, o.thu_tu, n.thu_tu`)
const dangs = await q(`select d.id, d.nhom_id, d.thu_tu, d.ten, d.mo_ta, d.ly_thuyet, d.vi_du from khtn_bdm_dang_bai d order by d.nhom_id, d.thu_tu`)
// câu mẫu của dạng: tối đa 6 câu gốc có lời giải, trải đều loại câu
const mau = await q(`select * from (select g.dang_bai_id, c.*, row_number() over (partition by g.dang_bai_id order by (c.loi_giai is null), (c.anh_de is not null), c.loai_cau desc, md5(c.ma_cau)) rn
  from khtn_bdm_gan_cau g join khtn_cau_hoi c on c.ma_cau=g.ma_cau where c.xoa_at is null and c.parent_ma_cau is null) x where rn<=6`)
const soCau = Object.fromEntries((await q(`select dang_bai_id, count(*) n from khtn_bdm_gan_cau group by 1`)).map(r => [r.dang_bai_id, +r.n]))
// câu gốc chưa gán của nhóm chưa có dạng
const chua = await q(`select n.id nhom_id, c.* from khtn_cau_hoi c join khtn_bdm_nhom n on n.ma_cu=c.dang_chinh
  where c.xoa_at is null and c.parent_ma_cau is null and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau=c.ma_cau)
    and not exists (select 1 from khtn_bdm_dang_bai d where d.nhom_id=n.id) order by n.id, c.ma_cau`)

const byNhom = {}; for (const d of dangs) (byNhom[d.nhom_id] ??= []).push(d)
const mauBy = {}; for (const r of mau) (mauBy[r.dang_bai_id] ??= []).push(cau(r))
const chuaBy = {}; for (const r of chua) (chuaBy[r.nhom_id] ??= []).push(cau(r))
const nhomOut = n => ({ nhom_id: n.id, khoi: n.khoi, chu_de: n.chu_de, chuyen_de: n.chuyen_de, nhom: n.ten, nhom_mo_ta: n.mo_ta,
  nhom_ly_thuyet_hien_co: n.ly_thuyet, can_dien_ly_thuyet_nhom: !n.ly_thuyet?.trim() })

const lo = {}  // key → {nhom:[], dang_bai:[], so}
const them = (key, max, obj, size) => {
  let k = 0; while (lo[`${key}${k ? '-' + k : ''}`]?.so + size > max && lo[`${key}${k ? '-' + k : ''}`].nhom.length) k++
  const kk = `${key}${k ? '-' + k : ''}`; (lo[kk] ??= { nhom: [], dang_bai: [], so: 0 }); lo[kk].nhom.push(obj.nhom); lo[kk].dang_bai.push(...(obj.dang_bai ?? [])); lo[kk].so += size
}
for (const n of nhoms) {
  const cd = String(n.cd_tt).padStart(2, '0')
  const ds = byNhom[n.id] ?? []
  if (ds.length) {
    const can = ds.filter(d => !d.mo_ta?.trim() || !d.ly_thuyet?.trim() || !d.vi_du?.trim())
    if (!can.length && n.ly_thuyet?.trim()) continue
    them(`dien-${n.khoi}-${cd}`, 32, { nhom: nhomOut(n), dang_bai: ds.map(d => ({ dang_id: d.id, nhom_id: n.id, thu_tu: d.thu_tu, dang: d.ten,
      mo_ta_hien_co: d.mo_ta, ly_thuyet_hien_co: d.ly_thuyet, vi_du_hien_co: d.vi_du,
      can_dien_mo_ta: !d.mo_ta?.trim(), can_dien_ly_thuyet: !d.ly_thuyet?.trim(), can_dien_vi_du: !d.vi_du?.trim(),
      so_cau_da_gan: soCau[d.id] ?? 0, cau_mau: mauBy[d.id] ?? [] })) }, ds.length)
  } else {
    const cs = chuaBy[n.id] ?? []
    if (!cs.length) { console.log('bỏ nhóm 0 câu:', n.khoi, n.id, n.ten); continue }
    them(`tao-${n.khoi}-${cd}`, 200, { nhom: { ...nhomOut(n), cau: cs } }, Math.max(cs.length, 5))
  }
}
let tong = { dien: 0, tao: 0 }
for (const [k, v] of Object.entries(lo)) {
  fs.writeFileSync(path.join(DIR, k + '.in.json'), JSON.stringify(k.startsWith('dien') ? { nhom: v.nhom, dang_bai: v.dang_bai } : { nhom: v.nhom }, null, 1))
  console.log(k, 'nhóm', v.nhom.length, k.startsWith('dien') ? 'dạng ' + v.dang_bai.length : 'câu ' + v.nhom.reduce((a, n) => a + n.cau.length, 0))
  tong[k.startsWith('dien') ? 'dien' : 'tao']++
}
console.log(tong)
await c.query('rollback'); await c.end()
