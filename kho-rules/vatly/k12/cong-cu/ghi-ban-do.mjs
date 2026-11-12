// Ghi cây đề xuất (cay-v3.md) vào BẢN ĐỒ MỚI môn VẬT LÝ (vatly_bdm_*) — khối 12. Thùy duyệt 12/11: "duyệt vào bản đồ vật lý, t đọc và sửa trên đấy".
//   chủ đề → vatly_bdm_chu_de (khoi '12') · chuyên đề → vatly_bdm_chuyen_de + ô (chu_de × chuyen_de) · nhóm → vatly_bdm_nhom · dạng → vatly_bdm_dang_bai (ten + mo_ta)
//   Mã gốc do DB cấp (LCD/LCH/LNB/LDB…), mã tạm N1.1.1… KHÔNG lưu. Không ghi câu.
//   Khối 12 đã có chủ đề ⇒ TỪ CHỐI (không nhân đôi việc người đã sửa).
// Chạy (từ gốc repo):  node kho-rules/vatly/k12/cong-cu/ghi-ban-do.mjs        → thử trong ROLLBACK, in số
//                      node kho-rules/vatly/k12/cong-cu/ghi-ban-do.mjs --ghi  → ghi thật (lệch số ⇒ ROLLBACK)
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const CAY = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'cay-v3.md')

const TEN_CD = { NHIET: 'Vật lí nhiệt', KHI: 'Khí lí tưởng', TU: 'Từ trường', HN: 'Vật lí hạt nhân' }
const cay = []; let cd, cdd, nh
for (const l of fs.readFileSync(CAY, 'utf8').split(/\r?\n/)) {
  let m
  if ((m = l.match(/^## (NHIET|KHI|TU|HN) — /))) { cd = { ten: TEN_CD[m[1]], cdd: [] }; cay.push(cd) }
  else if (/^## /.test(l)) cd = null
  else if ((m = l.match(/^### [A-Z]\d+ (.*)/)) && cd) { cdd = { ten: m[1].trim(), nhom: [] }; cd.cdd.push(cdd) }
  else if ((m = l.match(/^#### [A-Z]\d+\.\d+ (.*)/)) && cd) { nh = { ten: m[1].trim(), dang: [] }; cdd.nhom.push(nh) }
  else if ((m = l.match(/^- [A-Z]\d+\.\d+\.\d+ (.*?) — (.*)/)) && cd) nh.dang.push({ ten: m[1].replace(/\s*\[[^\]]*\]/g, '').trim(), mo_ta: m[2].trim() })
}
const dem = { chu_de: cay.length, chuyen_de: 0, nhom: 0, dang_bai: 0 }
cay.forEach(c => c.cdd.forEach(x => { dem.chuyen_de++; x.nhom.forEach(n => { dem.nhom++; dem.dang_bai += n.dang.length }) }))
console.log('cây đọc được:', dem)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const co = await q("select count(*)::int n from vatly_bdm_chu_de where khoi = '12'")
  if (co[0].n > 0) throw new Error(`khối 12 đã có ${co[0].n} chủ đề — không ghi đè`)
  let i = 0
  for (const x of cay) {
    const [{ id: cdId }] = await q("insert into vatly_bdm_chu_de (khoi, ten, thu_tu) values ('12', $1, $2) returning id", [x.ten, ++i])
    let j = 0
    for (const y of x.cdd) {
      const [{ id: chId }] = await q('insert into vatly_bdm_chuyen_de (ten) values ($1) returning id', [y.ten])
      await q('insert into vatly_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values ($1, $2, $3)', [cdId, chId, ++j])
      let k = 0
      for (const n of y.nhom) {
        const [{ id: nId }] = await q('insert into vatly_bdm_nhom (chu_de_id, chuyen_de_id, ten, thu_tu) values ($1, $2, $3, $4) returning id', [cdId, chId, n.ten, ++k])
        let h = 0
        for (const d of n.dang) await q('insert into vatly_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu) values ($1, $2, $3, $4)', [nId, d.ten, d.mo_ta, ++h])
      }
    }
  }
  const [s] = await q(`select (select count(*)::int from vatly_bdm_chu_de where khoi='12') chu_de,
      (select count(*)::int from vatly_bdm_o o join vatly_bdm_chu_de c on c.id=o.chu_de_id where c.khoi='12') chuyen_de,
      (select count(*)::int from vatly_bdm_nhom n join vatly_bdm_chu_de c on c.id=n.chu_de_id where c.khoi='12') nhom,
      (select count(*)::int from vatly_bdm_dang_bai d join vatly_bdm_nhom n on n.id=d.nhom_id join vatly_bdm_chu_de c on c.id=n.chu_de_id where c.khoi='12') dang_bai`)
  console.log('DB sau khi ghi:', s)
  if (JSON.stringify(s) !== JSON.stringify(dem)) throw new Error('lệch số — ROLLBACK')
  const mau = await q(`select c.thu_tu ct, c.ten, o.thu_tu ot, ch.ten cdd, ch.id from vatly_bdm_chu_de c join vatly_bdm_o o on o.chu_de_id=c.id join vatly_bdm_chuyen_de ch on ch.id=o.chuyen_de_id where c.khoi='12' order by 1,3 limit 5`)
  console.log(mau)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '(chạy thử — đã ROLLBACK; thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✖', e.message); process.exitCode = 1 }
await c.end()
