// them-dang.mjs — thêm dạng mới vào bản đồ 8T (Thùy gật 21/11: "Thêm dạng mới"). Mã NDB do DB cấp; thu_tu = cuối nhóm. KHÔNG sửa dạng có sẵn.
//   node kho-rules/dai/lo/k8T/dang/them-dang.mjs [--ghi]      (mặc định chạy thử rồi ROLLBACK) · ra: dang/them-dang-ma.json
import pg from 'pg'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const DIR = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
process.loadEnvFile('.env')
const DANG = [
  { nhom: 'NNB01473', ten: 'Tổng phân thức nhiều biến có điều kiện: chặn từng mẫu, bổ đề, đổi biến',
    mo_ta: 'Bài tìm GTLN / GTNN hoặc chứng minh bất đẳng thức cho tổng các phân thức của hai hoặc ba biến dương có điều kiện ràng buộc ($xyz=1$, $a+b+c=1$, $a+b+c=2017$…). Chặn từng mẫu (bình phương, bổ đề $p^3+q^3\ge pq(p+q)$) hoặc dùng $\dfrac1{x+y}\le\dfrac14\left(\dfrac1x+\dfrac1y\right)$ / đổi biến, cộng theo vế các bất đẳng thức hoán vị vòng rồi dùng điều kiện để rút gọn tổng.' },
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const ra = []
try {
  await c.query('begin')
  for (const d of DANG) {
    const nh = (await c.query(`select id from dai_bdm_nhom where id=$1`, [d.nhom])).rows[0]; if (!nh) throw new Error('không có nhóm ' + d.nhom)
    const tt = (await c.query(`select coalesce(max(thu_tu),0)+1 tt from dai_bdm_dang_bai where nhom_id=$1`, [d.nhom])).rows[0].tt
    const r = await c.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu) values ($1,$2,$3,$4) returning id`, [d.nhom, d.ten, d.mo_ta, tt])
    ra.push({ ma: r.rows[0].id, ...d, tt }); console.log('+', r.rows[0].id, d.ten, '(thu_tu', tt + ')')
  }
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
  if (GHI) writeFileSync(join(DIR, 'them-dang-ma.json'), JSON.stringify(ra, null, 1))
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
