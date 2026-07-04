// Phát hành LẠI doc demo (xoá bản cũ + snapshot mới có ma_dang/ly_thuyet). Replicate phatHanhBTVN.
import pg from 'pg'
import { readFileSync } from 'fs'
import { extractKey } from '../src/gami/testgrade.js'
const url = readFileSync('.env', 'utf8').split('\n').find((l) => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const TEN = 'DEMO Test online — 11B1'

const doc = (await c.query('select id, lop_id, ngay, mon from tai_lieu where ten=$1', [TEN])).rows[0]
if (!doc) { console.error('không thấy doc demo — chạy seed_demo_test_online.mjs trước'); process.exit(1) }

const del = await c.query('delete from bai_test where nguon_tai_lieu_id=$1 returning id', [doc.id])
console.log('xoá', del.rowCount, 'bai_test cũ (kèm bài làm đã hoàn thành)')

const caus = (await c.query(`
  select q.* from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id join dai_cau_hoi q on q.ma_cau=tc.ma_cau
  where p.tai_lieu_id=$1 and p.loai_phan='btvn' order by tc.thu_tu`, [doc.id])).rows

const dangs = [...new Set(caus.map((c) => c.dang_chinh).filter(Boolean))]
const ltMap = new Map()
for (const r of (await c.query('select ma_dang, noi_dung from dai_dang_ly_thuyet where ma_dang = any($1)', [dangs])).rows)
  if (r.noi_dung) ltMap.set(r.ma_dang, r.noi_dung)

const bt = (await c.query("insert into bai_test(nguon_tai_lieu_id,lop_id,ngay,loai,mon) values($1,$2,$3,'btvn',$4) returning id", [doc.id, doc.lop_id, doc.ngay, doc.mon])).rows[0]
let tt = 0, added = 0, skipped = []
for (const q of caus) {
  const k = extractKey(q)
  if (!k.ok) { skipped.push(q.ma_cau + ': ' + k.warn); continue }
  await c.query(`insert into bai_test_cau(bai_test_id,thu_tu,ma_cau,loai_cau,noi_dung,lua_chon,menh_de,dap_an_key,loi_giai,anh_dap_an,ma_dang,ly_thuyet,diem)
    values($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8::jsonb,$9,$10,$11,$12,1)`,
    [bt.id, ++tt, q.ma_cau, q.loai_cau, q.noi_dung, JSON.stringify(q.lua_chon), JSON.stringify(q.menh_de), JSON.stringify(k.key), q.loi_giai, q.anh_dap_an, q.dang_chinh, ltMap.get(q.dang_chinh) ?? null])
  added++
}
console.log(`✓ phát hành lại: ${added} câu` + (skipped.length ? ` · bỏ qua ${skipped.length}: ${skipped.join('; ')}` : ''))
const chk = await c.query('select loai_cau, (ly_thuyet is not null) co_lt from bai_test_cau where bai_test_id=$1 order by thu_tu', [bt.id])
chk.rows.forEach((x) => console.log('  ', x.loai_cau.padEnd(13), 'gợi ý LT:', x.co_lt ? 'CÓ' : '—'))
await c.end()
