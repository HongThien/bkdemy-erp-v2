import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const { rows: lop } = await c.query(`select id, ten_lop, ngay_khai_giang::text from lop where ten_lop = '4A1'`)
console.log('LOP 4A1:', lop)
const lopId = lop[0]?.id
if (!lopId) { console.log('Không tìm thấy lớp 4A1'); await c.end(); process.exit(0) }

const { rows: tkb } = await c.query(`select thu, gio_bat_dau::text, gio_ket_thuc::text, hieu_luc_tu::text, hieu_luc_den::text, phong from thoi_khoa_bieu where lop_id = $1 order by hieu_luc_tu, thu`, [lopId])
console.log('\nTKB 4A1:'); for (const r of tkb) console.log(' ', r)

const { rows: buoi } = await c.query(`select id, ngay::text, trang_thai, btvn_dong_at, ly_do_huy from buoi_hoc where lop_id = $1 and loai='thuong' order by ngay desc limit 20`, [lopId])
console.log('\nBuổi thường 4A1 (20 gần nhất):'); for (const r of buoi) console.log(' ', r)

const { rows: now } = await c.query(`select now() as db_now`)
console.log('\nDB now():', now[0].db_now)

await c.end()
