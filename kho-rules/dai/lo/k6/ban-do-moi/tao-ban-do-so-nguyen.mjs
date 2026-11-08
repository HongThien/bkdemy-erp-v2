// tao-ban-do-so-nguyen.mjs — dựng khung bản đồ chủ đề SỐ NGUYÊN (K6) vào DB từ de-xuat-so-nguyen.json (Thùy giao 21/10: "đựng bản đồ… sau đó t sẽ fix").
//   node kho-rules/dai/lo/k6/ban-do-moi/tao-ban-do-so-nguyen.mjs [--ghi]   (mặc định ROLLBACK)
// Tạo: 1 chủ đề + N chuyên đề mới + ô + nhóm (tên, mô tả) + dạng (tên, mô tả). LT/ví dụ điền ở bước sau. Ghi ra so-nguyen-ma.json (khoá vị trí → mã) cho bước điền.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k6/ban-do-moi/'
const { chude, cd } = JSON.parse(readFileSync(D + 'de-xuat-so-nguyen.json', 'utf8'))
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const ma = {}
try {
  await c.query('begin')
  const ton = await c.query(`select id from dai_bdm_chu_de where khoi='6' and nhanh='toan' and ten=$1`, [chude])
  if (ton.rowCount) throw new Error('Chủ đề đã tồn tại: ' + ton.rows[0].id)
  const cdId = (await c.query(`insert into dai_bdm_chu_de(khoi,ten,nhanh) values ('6',$1,'toan') returning id`, [chude])).rows[0].id
  ma.chu_de = cdId
  ma.cd = []
  for (const [i, ch] of cd.entries()) {
    const chId = (await c.query(`insert into dai_bdm_chuyen_de(ten) values ($1) returning id`, [ch.ten.replace(/ℤ/g, 'tập hợp Số nguyên')])).rows[0].id
    await c.query(`insert into dai_bdm_o(chu_de_id,chuyen_de_id) values ($1,$2)`, [cdId, chId])
    const m = { id: chId, nhom: [] }
    for (const nh of ch.nhom) {
      const nId = (await c.query(`insert into dai_bdm_nhom(chu_de_id,chuyen_de_id,ten,mo_ta) values ($1,$2,$3,$4) returning id`, [cdId, chId, nh.ten.replace(/ℤ/g, 'tập hợp Số nguyên'), nh.mt])).rows[0].id
      const mn = { id: nId, dang: [] }
      for (const d of nh.dang) mn.dang.push((await c.query(`insert into dai_bdm_dang_bai(nhom_id,ten,mo_ta) values ($1,$2,$3) returning id`, [nId, d[0], d[1]])).rows[0].id)
      m.nhom.push(mn)
    }
    ma.cd.push(m)
  }
  const n = ma.cd.reduce((a, x) => a + x.nhom.length, 0), nd = ma.cd.reduce((a, x) => a + x.nhom.reduce((b, y) => b + y.dang.length, 0), 0)
  console.log(`chủ đề ${cdId} · ${ma.cd.length} chuyên đề · ${n} nhóm · ${nd} dạng`)
  if (GHI) { await c.query('commit'); writeFileSync(D + 'so-nguyen-ma.json', JSON.stringify(ma, null, 1)); console.log('✔ đã ghi + so-nguyen-ma.json') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
