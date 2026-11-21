// ghi-dang.mjs — ghi tầng dạng ĐỀ XUẤT 14/11 (dai-g1..g4.json: 37 nhóm / 170 dạng) vào bản đồ 8T. Thùy chốt 21/11 ("chốt theo cái mới").
// Mỗi nhóm hiện có ĐÚNG 1 dạng (trùng tên nhóm): dạng ấy GIỮ MÃ (mã bất biến — CLAUDE.md §2) và trở thành dạng số 1 của nhóm (đổi tên + mô tả);
// dạng 2..n là dòng mới (mã NDB cấp tự động). KHÔNG xoá gì. Câu đang gắn vào dạng cũ vẫn ở yên — bước gán lại ghi riêng (gan-lai-*.mjs).
//   node kho-rules/dai/lo/k8T/dang/ghi-dang.mjs [--ghi]       (mặc định chạy thử rồi ROLLBACK)
// Ghi ra kho-rules/dai/lo/k8T/dang/dang-ma.json: nhóm → [{ma NDB, ten, tt}] cho các bước sau.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
process.loadEnvFile('.env')
const nhomAll = []
for (const f of ['dai-g1', 'dai-g2', 'dai-g3', 'dai-g4']) nhomAll.push(...JSON.parse(readFileSync(join(DIR, f + '.json'), 'utf8')).nhom)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const ra = {}
try {
  await c.query('begin')
  let moi = 0, doi = 0
  for (const n of nhomAll) {
    const hien = (await c.query(`select id, ten, mo_ta, thu_tu from dai_bdm_dang_bai where nhom_id = $1 order by thu_tu, id`, [n.id])).rows
    if (hien.length === 0) throw new Error(`nhóm ${n.id} (${n.ten}) không có dạng nào / không tồn tại`)
    if (hien.length !== 1) throw new Error(`nhóm ${n.id} có ${hien.length} dạng (mong đợi 1) — dừng, không đoán`)
    if (n.dang.length === 0) throw new Error(`nhóm ${n.id} đề xuất rỗng`)
    ra[n.id] = []
    // dạng 1 = dạng cũ (giữ mã)
    const d1 = n.dang[0]
    await c.query(`update dai_bdm_dang_bai set ten = $2, mo_ta = $3, thu_tu = 1, updated_at = now() where id = $1`, [hien[0].id, d1.ten, d1.mo_ta]); doi++
    ra[n.id].push({ ma: hien[0].id, ten: d1.ten, tt: 1 })
    for (let i = 1; i < n.dang.length; i++) {
      const d = n.dang[i]
      const r = await c.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu) values ($1,$2,$3,$4) returning id`, [n.id, d.ten, d.mo_ta, i + 1])
      ra[n.id].push({ ma: r.rows[0].id, ten: d.ten, tt: i + 1 }); moi++
    }
  }
  const dem = (await c.query(`select count(*)::int tong from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='8T'`)).rows[0]
  console.log(`nhóm ${nhomAll.length} · đổi tên dạng cũ ${doi} · dạng mới ${moi} · tổng dạng khối 8T sau: ${dem.tong}`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
  if (GHI) writeFileSync(join(DIR, 'dang-ma.json'), JSON.stringify(ra, null, 1))
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
