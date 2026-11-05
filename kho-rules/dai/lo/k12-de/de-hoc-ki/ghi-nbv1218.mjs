// ghi-nbv1218.mjs — nhập các bài NBV 12-18 (E1/E2/E3 trả lời ngắn · F nâng cao) CHƯA có trong kho, đã được Sonnet giải (giai-27.out.json).
//   node kho-rules/dai/lo/k12-de/de-hoc-ki/ghi-nbv1218.mjs [--ghi]     (mặc định ROLLBACK)
// Chỉ nhập do_chac='cao', có dap_an, không de_sai. Vào dạng chờ K12 (da_duyet=false, nguon 'le', nguon_giai 'ai'), chủ đề NH-TP.
import fs from 'node:fs'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/k12-de/de-hoc-ki/'
const vao = new Map(JSON.parse(fs.readFileSync(D + 'giai-27.json', 'utf8')).map((x) => [x.id, x]))
const ra = JSON.parse(fs.readFileSync(D + 'giai-27.out.json', 'utf8'))
const cauList = [], meta = [], bo = []
for (const r of ra) {
  const v = vao.get(r.id)
  if (r.dap_an == null || r.dap_an === '' || r.de_sai || r.do_chac !== 'cao') { bo.push({ id: r.id, ly_do: r.dap_an == null ? 'không đáp án' : r.de_sai ? 'đề sai' : 'độ chắc ' + r.do_chac, ghi: r.ghi }); continue }
  cauList.push({ dang_chinh: 'CHUA', khoi: '12', loai_cau: 'tra_loi_ngan', noi_dung: v.de.trim(), dap_an: String(r.dap_an).trim(), loi_giai: r.loi_giai, nguon: 'le', nguon_giai: 'ai', ten_de_goc: ('NBV 12-18 · ' + v.nguon_tep).slice(0, 200) })
  meta.push(r.id)
}
console.log('nhập:', cauList.length, '· bỏ:', bo.length, JSON.stringify(bo))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const trung = new Set(r.trung.map((t) => t.idx))
  const moi = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !trung.has(x.i))
  console.log(`insert: mới ${moi.length} · trùng ${r.trung.length}`)
  if (GHI) fs.writeFileSync(D + 'ghi-nbv1218-ket-qua.json', JSON.stringify(moi.map((x) => ({ ma_cau: x.m, id: meta[x.i] }))))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
