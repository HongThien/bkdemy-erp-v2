// go-gan.mjs — gỡ gán các câu 8T mà hai trạm phân dạng lệch / không dạng nào khớp (kq='cho') và còn nằm ở dạng cũ ghi trong gan-lai-ket-qua.json.
// Thùy gật 21/11 ("Gỡ gán 159 câu"): để chúng về hàng "Chưa có dạng" cho trưởng khối phân tay. KHÔNG xoá câu, chỉ xoá dòng gán (dai_bdm_gan_cau).
//   node kho-rules/dai/lo/k8T/dang/go-gan.mjs [--ghi]      (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const DIR = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
process.loadEnvFile('.env')
const ds = JSON.parse(readFileSync(join(DIR, 'gan-lai-ket-qua.json'), 'utf8')).filter((k) => k.kq === 'cho' && k.cu)
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  await c.query('begin')
  const dem = async () => (await c.query(`select count(*)::int tong, count(*) filter (where da_duyet)::int duyet, count(*) filter (where kho_chuan)::int chuan, count(*) filter (where exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau))::int co_dang from dai_cau_hoi c where dang_chinh like 'T18T%' and xoa_at is null`)).rows[0]
  const truoc = await dem()
  let go = 0, lech = 0
  for (const k of ds) {
    const r = await c.query(`delete from dai_bdm_gan_cau where ma_cau = $1 and dang_bai_id = $2 returning ma_cau`, [k.ma_cau, k.cu])
    if (r.rowCount) go++; else lech++
  }
  const sau = await dem()
  console.log(`cần gỡ ${ds.length} · đã gỡ ${go} · bỏ qua (gán đã đổi) ${lech}\ntrước:`, truoc, '\nsau:  ', sau)
  if (go !== ds.length) throw new Error('số gỡ khác số cần gỡ — dừng, không đoán')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GỠ' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
