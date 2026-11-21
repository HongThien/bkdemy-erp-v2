// ghi-de-xuat.mjs — ghi ĐỀ XUẤT dạng (dai_bdm_de_xuat, nguon 'ai') cho câu TCDS đã nhập mà hai trạm (Sonnet + Opus kiểm mù) cùng ra một dạng.
// Chỉ câu CHƯA có đề xuất / gán (on conflict do nothing); KHÔNG tự gán, KHÔNG duyệt — chờ trưởng khối.
//   node kho-rules/dai/lo/k8T/dang/ghi-de-xuat.mjs <gan-de-xuat.json> [--ghi]
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const [tep] = process.argv.slice(2).filter((x) => !x.startsWith('--')), GHI = process.argv.includes('--ghi')
const SACH = 'Tuyển chọn các chuyên đề BD HSG Toán 8 Đại số – Trương Quang An, Văn Phú Quốc'
const ds = JSON.parse(readFileSync(tep, 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  await c.query('begin')
  let ghi = 0, co = 0, khongThay = []
  for (const k of ds) {
    const r = (await c.query(`select ma_cau from dai_cau_hoi where xoa_at is null and ten_de_goc = $1`, [`${SACH} · ${k.ma_nguon}`])).rows[0]
    if (!r) { khongThay.push(k.ma_nguon); continue }
    const x = await c.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1,$2,$3,$4,'ai') on conflict (ma_cau) do nothing`, [r.ma_cau, k.dang, k.chac, String(k.ly ?? '').slice(0, 300)])
    x.rowCount ? ghi++ : co++
  }
  console.log(`ghi ${ghi} · đã có đề xuất ${co} · không thấy câu ${khongThay.length}`, khongThay.join(' '))
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
