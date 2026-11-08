// ghi-co-dap-an.mjs — nhập câu ĐỀ THI HỌC KÌ / ĐỀ KHẢO SÁT K12 (Word trong folder tham khảo, mọi chương) mà kho CHƯA có và đề đã có ĐÁP ÁN (gạch chân / "Chọn X").
//   node kho-rules/dai/lo/k12-de/de-hoc-ki/ghi-co-dap-an.mjs [--ghi]    (mặc định chạy thử ROLLBACK)
// Nhập: TN đủ 4 PA + đáp án A–D · TLN có đáp số. Đ/S và câu chưa đáp án chờ giải. Vào dạng chờ K12, da_duyet=false, nguon='le', nguon_giai='nguoi'.
import fs from 'node:fs'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/k12-de/de-hoc-ki/'
const moi = JSON.parse(fs.readFileSync(D + 'moi-tat-ca.json', 'utf8')).filter((x) => x.kind === 'hoc_ki' || x.kind === 'khao_sat')
const HONG = /omml|EQ-FAILED|\[\[eq|\[\[omml|\[\[img/i
const cauList = [], bo = {}
const dem = (k) => { bo[k] = (bo[k] || 0) + 1 }
for (const x of moi) {
  const q = x.q
  if (!q.dap_an) { dem('chua_dap_an'); continue }
  if (HONG.test(JSON.stringify([q.noi_dung, q.lua_chon, q.menh_de]))) { dem('cong_thuc_hong'); continue }
  if ((q.noi_dung ?? '').length < 25) { dem('qua_ngan'); continue }
  const o = { dang_chinh: 'CHUA', khoi: '12', loai_cau: q.loai_cau, noi_dung: q.noi_dung.trim(), nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: String(x.de ?? '').slice(0, 200) || null }
  if (q.loai_cau === 'trac_nghiem') {
    if (!q.lua_chon || q.lua_chon.length !== 4 || !/^[A-D]$/.test(q.dap_an)) { dem('tn_loi'); continue }
    o.lua_chon = q.lua_chon; o.dap_an = q.dap_an; if (q.loi_giai) o.loi_giai = q.loi_giai
  } else if (q.loai_cau === 'tra_loi_ngan') {
    if (q.lua_chon?.length || Array.isArray(q.dap_an) || /^[A-D]$/.test(String(q.dap_an))) { dem('tln_loi'); continue }
    o.dap_an = String(q.dap_an); if (q.loi_giai) o.loi_giai = q.loi_giai
  } else { dem('dung_sai_cho_giai'); continue }
  cauList.push(o)
}
console.log('đủ điều kiện nhập:', cauList.length, '· loại:', JSON.stringify(bo))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const moiRows = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !r.trung.some((t) => t.idx === x.i))
  console.log(`insert: mới ${moiRows.length} · trùng ${r.trung.length}`)
  if (GHI) fs.writeFileSync(D + 'ghi-co-dap-an-ket-qua.json', JSON.stringify(moiRows.map((x) => ({ ma_cau: x.m, loai: cauList[x.i].loai_cau }))))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
