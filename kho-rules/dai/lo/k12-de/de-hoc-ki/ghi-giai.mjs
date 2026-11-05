// ghi-giai.mjs — nhập câu TN/TLN đề học kì / khảo sát K12 đã được Sonnet GIẢI CHI TIẾT (giai-NN.out.json).
//   node kho-rules/dai/lo/k12-de/de-hoc-ki/ghi-giai.mjs [--ghi]    (mặc định chạy thử ROLLBACK)
// Nhập: do_chac='cao' · có dap_an · không de_sai · không công thức hỏng/hình · TN đủ 4 PA (hoặc TLN mà đề có sẵn A–D → tách ra TN).
// nguon='le', nguon_giai='ai', da_duyet=false, dạng chờ K12. 'vua' + các câu loại ra ghi vào ghi-giai-loai.json để Thùy xem.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/k12-de/de-hoc-ki/'
const goc = new Map(JSON.parse(fs.readFileSync(D + 'goc-giai.json', 'utf8')).map((x) => [x.id, x]))
const HONG = /omml|EQ-FAILED|\[\[eq|\[\[omml|\[\[img|\[\[shape/i
const cauList = [], meta = [], loai = []
const bo = {}
const dem = (k, id) => { bo[k] = (bo[k] || 0) + 1; loai.push({ id, ly_do: k }) }
const files = fs.readdirSync(D).filter((f) => /^giai-\d+\.out\.json$/.test(f)).sort()
for (const f of files) {
  for (const r of JSON.parse(fs.readFileSync(D + f, 'utf8'))) {
    const g = goc.get(r.id); if (!g) { dem('khong_co_goc', r.id); continue }
    const q = g.q
    if (r.dap_an == null || r.dap_an === '') { dem('khong_dap_an', r.id); continue }
    if (r.de_sai) { dem('de_sai', r.id); continue }
    if (r.do_chac !== 'cao') { dem('do_chac_' + r.do_chac, r.id); continue }
    let nd = (q.noi_dung ?? '').replace(/\s*HẾT\s*$/i, '').trim()
    if (HONG.test(JSON.stringify([nd, q.lua_chon, r.loi_giai]))) { dem('cong_thuc_hong', r.id); continue }
    if (nd.length < 25) { dem('qua_ngan', r.id); continue }
    const o = { dang_chinh: 'CHUA', khoi: '12', nguon: 'le', nguon_giai: 'ai', ten_de_goc: path.basename(g.file ?? '').replace(/\.docx$/i, '').slice(0, 200) || null, loi_giai: r.loi_giai }
    const da = String(r.dap_an).trim()
    if (q.loai_cau === 'trac_nghiem') {
      if (!q.lua_chon || q.lua_chon.length !== 4 || !/^[A-D]$/.test(da)) { dem('tn_loi_dang', r.id); continue }
      Object.assign(o, { loai_cau: 'trac_nghiem', noi_dung: nd, lua_chon: q.lua_chon, dap_an: da })
    } else if (q.loai_cau === 'tra_loi_ngan') {
      if (/^[A-D]$/.test(da)) {
        // đề thực ra là TN (phương án nằm trong noi_dung) → tách
        const m = [...nd.matchAll(/(?:^|\n|[\t ])([A-D])\.\s*/g)]
        if (m.length >= 4 && ['A', 'B', 'C', 'D'].every((x, k) => m[k]?.[1] === x)) {
          const stem = nd.slice(0, m[0].index).trim()
          const op = [0, 1, 2, 3].map((k) => nd.slice(m[k].index, k < 3 ? m[k + 1].index : nd.length).replace(/^[\n\t ]*[A-D]\.\s*/, '').trim())
          if (stem.length < 15 || op.some((x) => !x)) { dem('tach_pa_loi', r.id); continue }
          Object.assign(o, { loai_cau: 'trac_nghiem', noi_dung: stem, lua_chon: op, dap_an: da })
        } else { dem('tln_chu_cai_khong_tach_duoc', r.id); continue }
      } else {
        Object.assign(o, { loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da })
      }
    } else { dem('loai_khac', r.id); continue }
    cauList.push(o); meta.push({ id: r.id, chuong: r.chuong })
  }
}
console.log('đủ điều kiện nhập:', cauList.length, '· loại:', JSON.stringify(bo))
fs.writeFileSync(D + 'ghi-giai-loai.json', JSON.stringify(loai))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const trungIdx = new Set(r.trung.map((t) => t.idx))
  const moi = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !trungIdx.has(x.i))
  console.log(`insert: mới ${moi.length} · trùng ${r.trung.length}`)
  const by = {}; for (const x of moi) { const k = meta[x.i].chuong; by[k] = (by[k] || 0) + 1 }
  console.log('theo chương:', JSON.stringify(by))
  if (GHI) fs.writeFileSync(D + 'ghi-giai-ket-qua.json', JSON.stringify(moi.map((x) => ({ ma_cau: x.m, id: meta[x.i].id, chuong: meta[x.i].chuong, loai: cauList[x.i].loai_cau }))))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
