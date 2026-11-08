// tao-mt-gan-buoi.mjs — tạo 2 đề MT (kho MT khối 12 tháng 10) từ câu đã nhập kho, rồi GÁN vào buổi 30/10/2026 của 12A1 và 12B1.
//   node kho-rules/dai/lo/mt/k12-t10/tao-mt-gan-buoi.mjs [--ghi]     (mặc định ROLLBACK)
// Làm đúng như app (src/lib/mt.ts createMT + ganMTVaoBuoi + gami.moBuoi): tai_lieu loai 'mt' (+ phần + câu + cau_hinh.diemByCau/mtMeta)
// → buoi_hoc thường (lớp+ngày) + seed sĩ số + đóng 4 phase khác → tai_lieu 'mt_buoi' (bản chép bám lớp+ngày). Idempotent: chạy lại thấy đã có thì dừng.
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
import { CAU, TEN_DE } from './cau-mt.mjs'

const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/mt/k12-t10/'
const NGAY = '2026-10-30'
const THU = 6 // thứ Sáu
const kho = JSON.parse(fs.readFileSync(D + 'ket-qua-kho.json', 'utf8'))
const LOP = { a1: '48a8d255-ef5b-45a6-97df-3d3d995a6033', b1: 'aef4b4a5-16c6-4419-a1e0-bca94d60ea20' }
const TEN_LOP = { a1: '12A1', b1: '12B1' }
const PHAN = [{ so: 1, tieu_de: 'Phần I. Trắc nghiệm', diem: 0.25 }, { so: 2, tieu_de: 'Phần II. Đúng sai', diem: 1 }, { so: 3, tieu_de: 'Phần III. Trả lời ngắn', diem: 0.5 }]

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const kq = {}
  for (const de of ['a1', 'b1']) {
    const ten = TEN_DE[de], lopId = LOP[de]
    // 0) idempotent
    const co = (await c.query(`select id from tai_lieu where loai = 'mt' and ten = $1 and khoi = '12' and lop_id is null`, [ten])).rows
    if (co.length) throw new Error(`đã có đề MT "${ten}" (${co[0].id}) — dừng, không tạo trùng`)
    const caus = CAU.filter((x) => x.de === de)
    for (const x of caus) if (!kho[x.id]?.ma_cau) throw new Error('thiếu ma_cau cho ' + x.id)
    // 1) cau_hinh
    const diemByCau = {}, etFormByCau = {}
    for (const x of caus) {
      const ma = kho[x.id].ma_cau
      diemByCau[ma] = PHAN[x.phan - 1].diem
      if (x.loai_cau === 'tra_loi_ngan') etFormByCau[ma] = 'tra_loi_ngan'; else if (x.loai_cau === 'trac_nghiem') etFormByCau[ma] = 'trac_nghiem'
    }
    const cauHinh = { mtMeta: { loaiDe: 'khao_sat_thang', thang: '2026-10' }, diemByCau, etFormByCau }
    const tong = Object.values(diemByCau).reduce((s, v) => s + v, 0)
    // 2) đề gốc + phần + câu
    const m = (await c.query(`insert into tai_lieu (loai, ten, khoi, mon, cau_hinh) values ('mt', $1, '12', 'Toán', $2) returning id`, [ten, cauHinh])).rows[0].id
    const phanId = {}
    for (const p of PHAN) {
      phanId[p.so] = (await c.query(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, nang_cao) values ($1, $2, 'custom', null, $3, null, 'thuong', false) returning id`, [m, p.so - 1, p.tieu_de])).rows[0].id
      const ds = caus.filter((x) => x.phan === p.so).sort((a, b) => a.so - b.so)
      for (let i = 0; i < ds.length; i++) await c.query(`insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) values ($1, $2, $3)`, [phanId[p.so], kho[ds[i].id].ma_cau, i])
    }
    // 3) buổi (lớp+ngày) — như moBuoi
    const lop = (await c.query(`select ten_lop, khoi, mon from lop where id = $1`, [lopId])).rows[0]
    let buoi = (await c.query(`select id, trang_thai from buoi_hoc where loai = 'thuong' and lop_id = $1 and ngay = $2 and trang_thai <> 'huy'`, [lopId, NGAY])).rows[0]
    const buoiMoi = !buoi
    if (!buoi) {
      const slot = (await c.query(`select gio_bat_dau, gio_ket_thuc, phong from thoi_khoa_bieu where lop_id = $1 and thu = $2 and hieu_luc_tu <= $3 and (hieu_luc_den is null or hieu_luc_den >= $3) limit 1`, [lopId, THU, NGAY])).rows[0] ?? {}
      const gv = (await c.query(`select nhan_su_id from phan_cong_lop where lop_id = $1 and vai_tro = 'gv' and la_chinh = true limit 1`, [lopId])).rows[0]?.nhan_su_id ?? null
      const [y, mo, d] = NGAY.split('-')
      buoi = (await c.query(`insert into buoi_hoc (ma_buoi, loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day) values ($1, 'thuong', $2, $3, $4, $5, $6, $7, $8) returning id, trang_thai`,
        [`${TEN_LOP[de]}.T${THU}.${d}${mo}${y}`, lopId, NGAY, THU, slot.gio_bat_dau ?? null, slot.gio_ket_thuc ?? null, slot.phong ?? null, gv])).rows[0]
      const hs = (await c.query(`select hoc_sinh_id from hoc_sinh_lop where lop_id = $1 and trang_thai = 'dang_hoc' and (ngay_vao is null or ngay_vao <= $2)`, [lopId, NGAY])).rows
      for (const h of hs) await c.query(`insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id) values ($1, $2)`, [buoi.id, h.hoc_sinh_id])
      kq[de + '_si_so'] = hs.length
    }
    // đóng 4 phase khác (buổi có MT chỉ có 1 hoạt động = kiểm tra) — set cột trực tiếp như app, không đè nếu đã có
    for (const col of ['danh_gia_xong_at', 'ingame_dong_at', 'et_dong_at', 'btvn_dong_at']) await c.query(`update buoi_hoc set ${col} = now() where id = $1 and ${col} is null`, [buoi.id])
    // 4) bản chép mt_buoi
    const con = (await c.query(`insert into tai_lieu (loai, ten, khoi, mon, theme, lop_id, ngay, nguon_id, cau_hinh) values ('mt_buoi', $1, '12', 'Toán', 'bkdemy', $2, $3, $4, $5) returning id`, [ten, lopId, NGAY, m, cauHinh])).rows[0].id
    let soCau = 0
    for (const p of PHAN) {
      const np = (await c.query(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, nang_cao) values ($1, $2, 'custom', null, $3, null, 'thuong', false) returning id`, [con, p.so - 1, p.tieu_de])).rows[0].id
      const rows = (await c.query(`select ma_cau, thu_tu from tai_lieu_cau where phan_id = $1 order by thu_tu`, [phanId[p.so]])).rows
      for (const r of rows) { await c.query(`insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) values ($1, $2, $3)`, [np, r.ma_cau, r.thu_tu]); soCau++ }
    }
    kq[de] = { master: m, mt_buoi: con, buoi_id: buoi.id, buoi_moi: buoiMoi, so_cau: soCau, tong_diem: tong, lop: lop.ten_lop, ngay: NGAY }
    console.log(de, JSON.stringify(kq[de]))
  }
  if (GHI) fs.writeFileSync(D + 'ket-qua-mt.json', JSON.stringify(kq, null, 1))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
