import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const lopId = '20372255-82d8-4ea4-8416-db11bf106f50'

const { rows: pc } = await c.query(`
  select pc.vai_tro, ns.id, ns.ho_ten
  from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
  where pc.lop_id = $1`, [lopId])
console.log('Phân công 4A1:', pc)

// BTVN doc (tai_lieu loai='btvn') gán cho lớp/ngày nào?
const { rows: docs } = await c.query(`select ngay::text, ten, created_at from tai_lieu where lop_id=$1 and loai='btvn' order by ngay desc limit 10`, [lopId])
console.log('\nBTVN doc (tai_lieu) 4A1:', docs)

// btvn_ket_qua tồn tại cho buổi nào (đã có bài nộp/chấm)?
const { rows: buoi } = await c.query(`select id, ngay::text from buoi_hoc where lop_id=$1 and loai='thuong' order by ngay`, [lopId])
console.log('\nBuổi 4A1:', buoi)
for (const b of buoi) {
  const { rows: kq } = await c.query(`select count(*) n, count(*) filter (where trang_thai_nop is not null) n_nop from btvn_ket_qua where buoi_hoc_id=$1`, [b.id])
  console.log(`  buổi ${b.ngay}: btvn_ket_qua n=${kq[0].n} n_nop=${kq[0].n_nop}`)
}

await c.end()
