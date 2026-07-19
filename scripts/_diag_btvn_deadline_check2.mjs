import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const { rows: lop } = await c.query(`select id, ten_lop, ngay_khai_giang::text from lop where ten_lop = '11B1'`)
console.log('LOP 11B1:', lop)
const lopId = lop[0]?.id

const { rows: tkb } = await c.query(`select thu, gio_bat_dau::text, gio_ket_thuc::text, hieu_luc_tu::text, hieu_luc_den::text, phong from thoi_khoa_bieu where lop_id = $1 order by hieu_luc_tu, thu`, [lopId])
console.log('\nTKB 11B1:'); for (const r of tkb) console.log(' ', r)

const { rows: buoi } = await c.query(`select ngay::text, trang_thai, ly_do_huy from buoi_hoc where lop_id = $1 and loai='thuong' and ngay between '2026-07-05' and '2026-07-22' order by ngay`, [lopId])
console.log('\nBuổi thường 11B1 05/07 - 22/07:'); for (const r of buoi) console.log(' ', r)

await c.end()
