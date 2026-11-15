// ============================================================================
// npm run ra:kien-truc — LẤY SỐ cho buổi RÀ KIẾN TRÚC HẰNG THÁNG (spec-kien-truc.md §13, Thùy 15/11/2026)
// Chỉ ĐỌC DB (các hàm _audit_* + danh mục). Không ghi gì vào DB. In ra màn và ghi reports/ra-kien-truc-YYYY-MM.md
// (file đã có thì ghi thêm hậu tố giờ, không đè). Số "cộng dồn" ở đây chỉ để CHỌN chỗ đo tiếp — kết luận phải bằng
// hiệu số hai lần chụp giờ đông (§13 bước 3), không bằng bảng này.
//   node scripts/ra-kien-truc.mjs            → in + ghi file
//   node scripts/ra-kien-truc.mjs --khong-ghi → chỉ in
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
const env = fs.existsSync(envPath) ? Object.fromEntries(fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])) : {}
const url = process.env.DATABASE_URL_RO || env.DATABASE_URL_RO || process.env.DATABASE_URL || env.DATABASE_URL
if (!url) { console.error('❌ Không có DATABASE_URL_RO / DATABASE_URL.'); process.exit(2) }
const { default: pg } = await import('pg')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false }, statement_timeout: 20000 })
await c.connect(); await c.query('set default_transaction_read_only = on')
const q = async (s, p) => (await c.query(s, p)).rows
const thu = async (ten, f) => { try { return await f() } catch (e) { ra.push(`- (${ten}: không đọc được — ${String(e.message).slice(0, 90)})`); return null } }
const ra = []
const bang = (cot, rows) => { ra.push('| ' + cot.join(' | ') + ' |', '|' + cot.map(() => '---').join('|') + '|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')) }

const luc = (await q("select to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') t, to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') ym, to_char(pg_postmaster_start_time() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') kd"))[0]
ra.push(`# Rà kiến trúc ${luc.ym} — số lấy lúc ${luc.t} (giờ VN)`, '', '> Sinh bởi `npm run ra:kien-truc`. Số cộng dồn chỉ để chọn chỗ đo tiếp. Phần "Phát hiện" và "Việc phải làm" ở cuối do người rà viết (spec-kien-truc.md §13).', '')

ra.push('## 1. Máy và kết nối')
const st = Object.fromEntries((await q("select name, setting from pg_settings where name in ('max_connections', 'shared_buffers', 'effective_cache_size', 'work_mem', 'statement_timeout')")).map((x) => [x.name, x.setting]))
ra.push(`- Trần kết nối ${st.max_connections} · shared_buffers ${Math.round(st.shared_buffers * 8 / 1024)} MB · effective_cache_size ${Math.round(st.effective_cache_size * 8 / 1024)} MB · work_mem ${Math.round(st.work_mem / 1024)} MB · DB khởi động lần gần nhất ${luc.kd}`)
await thu('kết nối', async () => {
  const k = await q('select * from public._audit_ket_noi()')
  const cl = k.filter((x) => x.loai === 'client backend')
  ra.push(`- Kết nối client đang mở: **${cl.reduce((s, x) => s + x.so, 0)} / ${st.max_connections}** · đang chạy ${cl.filter((x) => x.trang_thai === 'active').reduce((s, x) => s + x.so, 0)} (số tại thời điểm chạy lệnh — đỉnh tháng xem dashboard Supabase)`)
  const g = {}; for (const x of cl) { const t = x.ung_dung.replace(/realtime_.*/, 'Realtime').slice(0, 30); g[t] = (g[t] || 0) + x.so }
  ra.push('- Ai giữ: ' + Object.entries(g).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(' · '))
})

ra.push('', '## 2. Việc nền 30 ngày (tinh_san_chay)')
await thu('việc nền', async () => {
  const r = await q(`select so, count(*)::int luot, round(avg(ms))::int tb, max(ms)::int mx, count(*) filter (where loi is not null)::int loi, count(*) filter (where ms is null)::int cat from public.tinh_san_chay where bat_dau > now() - interval '30 days' group by 1 order by 3 desc nulls last`)
  bang(['Sổ', 'Lượt', 'TB ms', 'Max ms', 'Lỗi', 'Bị cắt'], r.map((x) => [x.so, x.luot, x.tb ?? '-', x.mx ?? '-', x.loi, x.cat]))
  ra.push('', '_Bảng nhật ký chỉ giữ 7 ngày nếu chưa đổi hạn giữ — số "30 ngày" khi đó là 7 ngày._')
})
await thu('cron', async () => {
  const j = await q('select jobname, schedule, active from public._audit_cron_job() order by active desc, 1')
  ra.push('', `- Cron đang bật: ${j.filter((x) => x.active).length} (${j.filter((x) => x.active).map((x) => x.jobname).join(', ')})`)
  const l = await q(`select j.jobname, count(*)::int n from public._audit_cron_runs() d join public._audit_cron_job() j using (jobid) where d.status <> 'succeeded' and d.status <> 'running' group by 1 order by 2 desc`)
  ra.push(`- Lượt cron không thành công 7 ngày: ${l.length ? l.map((x) => `${x.jobname} ${x.n}`).join(' · ') : 'không có'}`)
})

ra.push('', '## 3. Hàm người dùng gọi (pg_stat_statements — CỘNG DỒN từ lần reset gần nhất)')
await thu('pss', async () => {
  const r = await q(`select (regexp_match(s.query, '"public"\\."([a-z0-9_]+)"\\('))[1] ham, sum(s.calls)::int luot, round(sum(s.total_exec_time) / sum(s.calls))::int tb, round(max(s.max_exec_time))::int mx,
       round(sum(s.total_exec_time) / 1000)::int tong_s, sum(s.total_exec_time) tong_ms, sum(s.shared_blks_read)::bigint doc_dia
     from public._audit_pss() s join pg_roles ro on ro.oid = s.userid where ro.rolname = 'authenticated' and s.query ~ '"public"\\."[a-z0-9_]+"\\(' group by 1`)
  ra.push('', '**12 hàm tốn tổng thời gian nhiều nhất:**', '')
  bang(['Hàm', 'Lượt', 'TB ms', 'Max ms', 'Tổng s', 'Trang đọc đĩa'], [...r].sort((a, b) => Number(b.tong_ms) - Number(a.tong_ms)).slice(0, 12).map((x) => [x.ham, x.luot, x.tb, x.mx, x.tong_s, x.doc_dia]))
  const cham = r.filter((x) => x.luot >= 20 && x.tb >= 500).sort((a, b) => b.tb - a.tb)
  ra.push('', `**Hàm trung bình ≥ 0,5 s (≥ 20 lượt): ${cham.length}**`, '')
  if (cham.length) bang(['Hàm', 'Lượt', 'TB ms', 'Max ms'], cham.slice(0, 20).map((x) => [x.ham, x.luot, x.tb, x.mx]))
  ra.push('', '**10 hàm đọc đĩa nhiều nhất:** ' + [...r].sort((a, b) => Number(b.doc_dia) - Number(a.doc_dia)).slice(0, 10).map((x) => `${x.ham} ${x.doc_dia}`).join(' · '))
})

ra.push('', '## 4. Dung lượng')
await thu('dung lượng', async () => {
  ra.push(`- DB: ${(await q('select pg_size_pretty(pg_database_size(current_database())) s'))[0].s}`)
  const t = await q(`select c.relname, pg_size_pretty(pg_total_relation_size(c.oid)) tong, pg_size_pretty(pg_relation_size(c.oid)) heap, c.reltuples::bigint dong from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' order by pg_total_relation_size(c.oid) desc limit 12`)
  ra.push(''); bang(['Bảng', 'Tổng (kèm index)', 'Heap', 'Dòng (ước)'], t.map((x) => [x.relname, x.tong, x.heap, x.dong]))
})

ra.push('', '## 5. Lô của máy trong khung 17–22 h (30 ngày) — K22')
await thu('kho file', async () => {
  const r = await q(`select to_char(luc at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI') luc, sum(so_file)::int f, sum(khong_chu)::int kc from public._audit_kho_file_moi(now() - interval '30 days', now())
     where extract(hour from luc at time zone 'Asia/Ho_Chi_Minh') between 17 and 21 group by 1 having sum(khong_chu) >= 50 order by 2 desc limit 10`)
  ra.push(r.length ? '- Khoảng 10 phút có ≥ 50 file do script đẩy lên kho trong giờ HS dùng app: ' + r.map((x) => `${x.luc} (${x.kc} file)`).join(' · ') : '- Không có đợt đẩy file lớn nào của script trong khung 17–22 h.')
})

ra.push('', '## 6. Số trần của cổng (scripts/kien-truc/tran.json) — chạy `npm run check:kien-truc` để so')
const tran = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'kien-truc', 'tran.json'), 'utf8'))
ra.push('- ' + Object.entries(tran).map(([k, v]) => `${k} ${v}`).join(' · '))

ra.push('', '## 7. Phát hiện (người rà viết — đối chiếu spec-kien-truc.md §12)', '', '- …', '', '## 8. Việc phải làm · việc chờ Thùy quyết · ngày rà kế tiếp', '', '- …', '')
await c.end()

const noi = ra.join('\n')
console.log(noi)
if (!process.argv.includes('--khong-ghi')) {
  const dir = path.join(root, 'reports'); fs.mkdirSync(dir, { recursive: true })
  let f = path.join(dir, `ra-kien-truc-${luc.ym}.md`)
  if (fs.existsSync(f)) f = path.join(dir, `ra-kien-truc-${luc.ym}-${luc.t.slice(8).replace(/[ :]/g, '')}.md`)
  fs.writeFileSync(f, noi + '\n')
  console.log(`\n— Đã ghi: ${path.relative(root, f)}`)
}
