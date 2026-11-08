// chuyen-pptd-hgt.mjs — chuyển 195 câu PP TOẠ ĐỘ (Oxyz) đề HK/khảo sát K12 từ dai_cau_hoi sang hgt_cau_hoi (đúng kho của bản đồ Oxyz NCD00099).
//   node kho-rules/dai/lo/k12-de/de-hoc-ki/chuyen-pptd-hgt.mjs [--ghi]    (mặc định ROLLBACK)
// Thùy gật 05/11 ("Chuyển đi"). Bản ở dai_cau_hoi KHÔNG xoá cứng: đặt xoa_at (kho rác — mã không bị cấp lại, lùi được).
// Chốt chặn: chỉ đụng đúng các ma_cau trong ghi-giai-ket-qua.json chương PPTD, còn nguyên (chưa duyệt, chưa gán dạng, dạng chờ K12).
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/k12-de/de-hoc-ki/'
const kq = JSON.parse(fs.readFileSync(D + 'ghi-giai-ket-qua.json', 'utf8')).filter((x) => x.chuong === 'PPTD')
const theoId = new Map(kq.map((x) => [x.id, x.ma_cau]))
const goc = new Map(JSON.parse(fs.readFileSync(D + 'goc-giai.json', 'utf8')).map((x) => [x.id, x]))
const HONG = /omml|EQ-FAILED|\[\[eq|\[\[omml|\[\[img|\[\[shape/i
const cauList = [], maDai = []
for (const f of fs.readdirSync(D).filter((f) => /^giai-\d+\.out\.json$/.test(f)).sort()) {
  for (const r of JSON.parse(fs.readFileSync(D + f, 'utf8'))) {
    if (!theoId.has(r.id)) continue
    const g = goc.get(r.id), q = g.q
    const nd = (q.noi_dung ?? '').replace(/\s*HẾT\s*$/i, '').trim()
    const o = { dang_chinh: 'CHUA', khoi: '12', nguon: 'le', nguon_giai: 'ai', ten_de_goc: path.basename(g.file ?? '').replace(/\.docx$/i, '').slice(0, 200) || null, loi_giai: r.loi_giai }
    const da = String(r.dap_an).trim()
    if (q.loai_cau === 'trac_nghiem') Object.assign(o, { loai_cau: 'trac_nghiem', noi_dung: nd, lua_chon: q.lua_chon, dap_an: da })
    else if (/^[A-D]$/.test(da)) {
      const m = [...nd.matchAll(/(?:^|\n|[\t ])([A-D])\.\s*/g)]
      const stem = nd.slice(0, m[0].index).trim()
      const op = [0, 1, 2, 3].map((k) => nd.slice(m[k].index, k < 3 ? m[k + 1].index : nd.length).replace(/^[\n\t ]*[A-D]\.\s*/, '').trim())
      Object.assign(o, { loai_cau: 'trac_nghiem', noi_dung: stem, lua_chon: op, dap_an: da })
    } else Object.assign(o, { loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da })
    if (HONG.test(JSON.stringify(o))) throw new Error('công thức hỏng: ' + r.id)
    cauList.push(o); maDai.push(theoId.get(r.id))
  }
}
console.log('câu PPTD:', cauList.length, '(kỳ vọng', kq.length + ')')
if (cauList.length !== kq.length) throw new Error('lệch số câu')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  // chốt chặn: còn nguyên, chưa ai đụng
  const chk = await c.query(`select count(*)::int n,
      count(*) filter (where da_duyet)::int duyet, count(*) filter (where xoa_at is not null)::int da_xoa,
      count(*) filter (where dang_chinh <> 'T112000000')::int khac_cho,
      count(*) filter (where ma_cau in (select ma_cau from dai_bdm_gan_cau))::int co_gan
    from dai_cau_hoi where ma_cau = any($1)`, [maDai])
  console.log('trước:', JSON.stringify(chk.rows[0]))
  const k = chk.rows[0]
  if (k.n !== maDai.length || k.duyet || k.da_xoa || k.khac_cho || k.co_gan) throw new Error('chốt chặn: câu không còn nguyên')
  const r = await insertCauBatch({ client: c, subject: 'hgt', cauList })
  const trungIdx = new Set(r.trung.map((t) => t.idx))
  const moi = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !trungIdx.has(x.i))
  console.log(`hgt insert: mới ${moi.length} · trùng ${r.trung.length}`)
  const u = await c.query(`update dai_cau_hoi set xoa_at = now() where ma_cau = any($1) and xoa_at is null`, [maDai])
  console.log('dai_cau_hoi đặt xoa_at:', u.rowCount)
  if (GHI) fs.writeFileSync(D + 'chuyen-pptd-ket-qua.json', JSON.stringify({ moi: moi.map((x) => ({ ma_cau: x.m, ma_dai: maDai[x.i], loai: cauList[x.i].loai_cau })), trung: r.trung }))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
