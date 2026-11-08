// Lấy HÀNG ĐỢI chấm BTVN (TA đã bấm "Gửi chấm", chưa có lần chấm mới hơn) về máy để Claude Code chấm.
// Mỗi bài = 1 thư mục trong cham_btvn_ai/: de.json (meta + câu + đề/đáp án kho + danh sách ảnh) + ảnh gốc.
// Chạy: node scripts/btvn-ai/hang-doi.mjs [--env <file .env>] [--out <thư mục>]
// Chỉ ĐỌC DB + tải ảnh; không ghi gì lên ERP.
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { docEnv, ketNoi, voiNguoi, tenThuMuc } from './chung.mjs'

const env = docEnv()
if (!env.url || !env.service) throw new Error('Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong file env (để tải ảnh bucket private).')
const iOut = process.argv.indexOf('--out')
const OUT = iOut >= 0 ? process.argv[iOut + 1] : 'cham_btvn_ai'
mkdirSync(OUT, { recursive: true })

const c = await ketNoi(env)
const ds = (await c.query(`select * from v_btvn_ai_hang_doi`)).rows
console.log(`Hàng đợi: ${ds.length} bài`)
for (const j of ds) {
  const dir = join(OUT, tenThuMuc(j))
  if (existsSync(join(dir, 'de.json'))) { console.log(`  · đã có thư mục: ${dir}`); continue }
  const d = await voiNguoi(c, j.yeu_cau_boi, async () =>
    (await c.query(`select fn_btvn_ai_du_lieu($1, $2) d`, [j.buoi_hoc_id, j.hoc_sinh_id])).rows[0].d)
  mkdirSync(dir, { recursive: true })
  const anh = []
  for (const [k, a] of d.anh.entries()) {
    const r = await fetch(`${env.url}/storage/v1/object/btvn-nop/${a.path.split('/').map(encodeURIComponent).join('/')}`,
      { headers: { apikey: env.service, Authorization: `Bearer ${env.service}` } })
    if (!r.ok) throw new Error(`Tải ảnh ${a.path} lỗi ${r.status}`)
    const ext = (r.headers.get('content-type') ?? '').includes('png') ? 'png' : 'jpg'
    const file = `anh_${String(k + 1).padStart(2, '0')}_${a.id.slice(0, 8)}.${ext}`
    writeFileSync(join(dir, file), Buffer.from(await r.arrayBuffer()))
    anh.push({ id: a.id, file })
  }
  writeFileSync(join(dir, 'de.json'), JSON.stringify({
    buoi_hoc_id: j.buoi_hoc_id, hoc_sinh_id: j.hoc_sinh_id, yeu_cau_boi: j.yeu_cau_boi, yeu_cau_at: j.yeu_cau_at,
    hoc_sinh: j.ho_ten, lop: d.lop, khoi: d.khoi, mon: d.mon, ngay: d.ngay, anh, cau: d.cau,
  }, null, 1))
  console.log(`  + ${dir}  (${anh.length} ảnh, ${d.cau.length} câu)`)
}
await c.end()
