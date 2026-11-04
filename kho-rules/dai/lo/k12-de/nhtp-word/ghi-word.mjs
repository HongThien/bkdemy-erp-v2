// ghi-word.mjs — nhập câu Nguyên hàm–Tích phân (trích từ Word trong folder tham khảo K12) ĐÃ ĐƯỢC HAI NGƯỜI GIẢI ĐỘC LẬP (Sonnet + Opus mù) cùng đáp án.
//   node kho-rules/dai/lo/k12-de/nhtp-word/ghi-word.mjs [--ghi]      (mặc định CHẠY THỬ trong 1 transaction rồi ROLLBACK)
// Nhập: tt='dong_y' (hai bên cùng đáp án) · không đề sai · không công thức hỏng · TN đủ 4 phương án · Đ/S đủ 4 mệnh đề · TLN không có phương án.
// Vào dạng chờ K12 (da_duyet=false, nguon='le', nguon_giai='ai'); Đ/S ⇒ kho Đ/S chủ đề NCD00095. Chạy lại không nhân đôi (insertCauBatch lọc trùng).
import fs from 'node:fs'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'

const D = 'kho-rules/dai/lo/k12-de/nhtp-word/'
const GHI = process.argv.includes('--ghi')
const CHU_DE = 'NCD00095'
const goc = new Map(JSON.parse(fs.readFileSync(D + 'goc.json', 'utf8')).map((g) => [g.id, g]))
const ss = JSON.parse(fs.readFileSync(D + 'so-sanh.json', 'utf8'))
const HONG = /omml|EQ-FAILED|\[\[eq|\[\[omml|\[\[img/i
const bo = {}
const dem = (k) => { bo[k] = (bo[k] || 0) + 1 }
const cauList = [], idCua = []
for (const r of ss) {
  const g = goc.get(r.id), q = g.q
  if (r.tt !== 'dong_y') { dem('khong_dong_y'); continue }
  if (r.de_sai) { dem('de_sai'); continue }
  const text = JSON.stringify([q.noi_dung, q.lua_chon, q.menh_de])
  if (HONG.test(text)) { dem('cong_thuc_hong'); continue }
  if ((q.noi_dung ?? '').length < 25) { dem('qua_ngan'); continue }
  const o = { dang_chinh: 'CHUA', khoi: '12', loai_cau: q.loai_cau, noi_dung: q.noi_dung.trim(), nguon: 'le', nguon_giai: 'ai', ten_de_goc: String(g.de ?? '').slice(0, 200) || null }
  if (q.loai_cau === 'trac_nghiem') {
    if (!q.lua_chon || q.lua_chon.length !== 4 || !/^[A-D]$/.test(r.da)) { dem('tn_loi_dang'); continue }
    o.lua_chon = q.lua_chon; o.dap_an = r.da
  } else if (q.loai_cau === 'dung_sai') {
    if (!q.menh_de || q.menh_de.length !== 4 || !Array.isArray(r.da) || r.da.length !== 4 || r.da.some((x) => x !== 'Đ' && x !== 'S')) { dem('ds_loi_dang'); continue }
    o.menh_de = q.menh_de.map((m, i) => ({ noi_dung: m.noi_dung, dap_an: r.da[i] === 'Đ' ? 'D' : 'S', loi_giai: null }))
  } else if (q.loai_cau === 'tra_loi_ngan') {
    if (q.lua_chon?.length || r.da == null || Array.isArray(r.da) || /^[A-D]$/.test(String(r.da))) { dem('tln_loi_dang'); continue }
    o.dap_an = String(r.da)
  } else { dem('loai_khac'); continue }
  cauList.push(o); idCua.push(r.id)
}
console.log('đủ điều kiện nhập:', cauList.length, '· loại bỏ:', JSON.stringify(bo))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const moi = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !r.trung.some((t) => t.idx === x.i))
  console.log(`insert: mới ${moi.length} · trùng kho/lô ${r.trung.length} · dạng chờ ${r.chua_dang.length}`)
  const ds = moi.filter((x) => cauList[x.i].loai_cau === 'dung_sai').map((x) => x.m)
  if (ds.length) {
    const k = await c.query(`insert into dai_bdm_kho_ds (ma_cau, chu_de_id, nguon) select unnest($1::text[]), $2, 'ai' on conflict (ma_cau) do nothing`, [ds, CHU_DE])
    console.log(`kho Đ/S ${CHU_DE}: +${k.rowCount}/${ds.length}`)
  }
  const by = {}; for (const x of moi) by[cauList[x.i].loai_cau] = (by[cauList[x.i].loai_cau] || 0) + 1
  console.log('theo loại:', JSON.stringify(by))
  fs.writeFileSync(D + 'ghi-word-ket-qua.json', JSON.stringify({ moi: moi.map((x) => ({ ma_cau: x.m, id: idCua[x.i] })), trung: r.trung.map((t) => ({ id: idCua[t.idx], ma_cau_cu: t.ma_cau_cu })) }))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
