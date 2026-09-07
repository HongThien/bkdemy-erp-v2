// SCHEDULER TỰ ĐỘNG GIẢI BÀI (Thùy 06/09: "Claude auto giải hết, người chỉ duyệt qua hệ thống giải bài").
//
// Gọi bởi Windows Task Scheduler mỗi 5-10 phút. Thiết kế 3 lớp để lượt nào KHÔNG có việc gần như miễn phí
// (không tốn quota Claude), và lượt đang chạy dở KHÔNG bao giờ bị đè bởi lượt sau (khoá ngoài Claude,
// không phải để Claude tự quyết định skip — xem spec-giai-bai-ai.md + thảo luận 06/09):
//   1) Khoá file (.auto-giai.lock) — nếu phiên trước còn chạy (khoá chưa cũ quá 30 phút) → thoát ngay,
//      không đụng gì khác. Khoá quá 30 phút coi như phiên trước crash, tự dọn.
//   2) Đếm nhanh bằng SQL thuần (không qua Claude) — không có gì cần giải → thoát ngay.
//   3) Có việc → tạo khoá → auto-nap-hang-doi.mjs (nạp thêm từ pool tổng nếu hàng ưu tiên rỗng) →
//      gọi `claude -p` (headless, dùng CLAUDE_CODE_OAUTH_TOKEN — quota subscription, KHÔNG API trả phí)
//      xử lý đúng luồng hangdoi-giai.mjs --list/--ghi đã có sẵn → xoá khoá dù thành công hay lỗi.
//
// TRƯỚC KHI bật lịch chạy thật: chạy tay 1 lần `node scripts/auto-giai-scheduler.mjs` để xem log, xác
// nhận claude -p chạy được (cần CLAUDE_CODE_OAUTH_TOKEN đã set — xem HANDOFF/spec-giai-bai-ai.md).
import { existsSync, readFileSync, writeFileSync, unlinkSync, appendFileSync, openSync, closeSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const LOCK = join(root, 'scripts', '.auto-giai.lock')
const LOG = join(root, 'scripts', '.auto-giai.log')
const MAX_LOCK_AGE_MS = 30 * 60 * 1000 // phiên trước quá 30' coi như crash, tự dọn khoá

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`
  appendFileSync(LOG, line)
  console.log(line.trim())
}

// ── 1) Khoá ──
if (existsSync(LOCK)) {
  const age = Date.now() - Number(readFileSync(LOCK, 'utf8').trim() || 0)
  if (age < MAX_LOCK_AGE_MS) {
    process.exit(0) // phiên trước còn chạy — im lặng bỏ qua lượt này, KHÔNG log (đỡ rác log mỗi 5-10')
  }
  log(`Khoá cũ ${Math.round(age / 60000)} phút — coi như phiên trước crash, tự dọn khoá.`)
}

// ── 2) Đếm nhanh (SQL thuần, không tốn quota Claude) ──
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf(join(root, '.env')).DATABASE_URL })
await c.connect()
const MON = ['toan', 'khtn', 'hgt']
let tong = 0
for (const mon of MON) {
  const t = (await c.query('select public.fn_kho_tbl($1) t', [mon])).rows[0].t
  const r = await c.query(`select count(*) n from ${t}_cau_hoi_yeu_cau_giai where xu_ly_at is null and nguoi_giai is null`)
  tong += Number(r.rows[0].n)
}
{
  const r1 = await c.query(`select count(*) n from hinh_baitoan_yeu_cau_giai where xu_ly_at is null and nguoi_giai is null`)
  const r2 = await c.query(`select count(*) n from hinh_bien_the_yeu_cau_giai where xu_ly_at is null and nguoi_giai is null`)
  tong += Number(r1.rows[0].n) + Number(r2.rows[0].n)
}
// fn_giaibai_dem_pool trả về nhiều dòng (theo khối) — cộng dồn so_bai qua sum().
const poolRows = await c.query(`select coalesce(sum(so_bai), 0) n from public.fn_giaibai_dem_pool($1, 'giai')`, [[...MON, 'hinh_baitoan', 'hinh_bien_the']])
const tongPool = Number(poolRows.rows[0].n)
await c.end()

if (tong === 0 && tongPool === 0) {
  process.exit(0) // không có gì cần giải — thoát êm, không log (đỡ rác log)
}
log(`Có việc: ${tong} yêu cầu ưu tiên treo, ${tongPool} bài trong pool tổng — bắt đầu lượt xử lý.`)

// ── 3) Tạo khoá, xử lý ──
writeFileSync(LOCK, String(Date.now()))
try {
  const nap = spawnSync('node', ['scripts/auto-nap-hang-doi.mjs', '--n', '5'], { cwd: root, encoding: 'utf8' })
  log(`auto-nap-hang-doi: ${nap.stdout?.trim()}${nap.stderr ? ' | lỗi: ' + nap.stderr.trim() : ''}`)

  const prompt = `Đọc kỹ file spec-giai-bai-ai.md ở thư mục gốc TRƯỚC — đây là rule bắt buộc, đặc biệt mục "bài nhiều ý phải dùng lại kết quả ý trước".
Sau đó xử lý hàng đợi giải bài hiện có, đúng luồng đã ghi trong scripts/hangdoi-giai.mjs (đọc chú thích đầu file đó):
1) node scripts/hangdoi-giai.mjs --list --out scripts/_auto_ds.json
2) Đọc file đó. Với mỗi câu/bài: GIẢI theo đúng spec-giai-bai-ai.md — verify trước khi ghi (toạ độ/số học độc lập). Với Hình, trường "chuoi" trong mỗi mục đã liệt kê SẴN toàn bộ bài tiền đề kèm lời giải hiện có (trạng thái chua/claude/nguoi/da_duyet) — DÙNG LẠI các ý đã có lời giải, chỉ giải thêm ý còn "chua" trong chuỗi, xuất MỖI node một mục kết quả riêng.
3) Ghi kết quả ra scripts/_auto_ketqua.json đúng format --ghi cần (xem chú thích đầu hangdoi-giai.mjs).
4) node scripts/hangdoi-giai.mjs --ghi scripts/_auto_ketqua.json
5) Xoá 2 file scripts/_auto_ds.json và scripts/_auto_ketqua.json.
Bài nào không chắc chắn (đề thiếu dữ kiện, hình mâu thuẫn không giải quyết được) → dùng --bo <mon> <yeu_cau_id> "<lý do>" thay vì ghi liều — thà bỏ trống còn hơn đánh sai (CLAUDE.md §1.5).
Không cần hỏi lại — tự làm hết trong lượt này rồi dừng.`

  const claudeArgs = [
    '-p', prompt,
    '--permission-mode', 'dontAsk',
    '--allowedTools', 'Bash', 'Read', 'Write',
    'mcp__Claude_Browser__navigate', 'mcp__Claude_Browser__computer',
    'mcp__Claude_Browser__read_page', 'mcp__Claude_Browser__find',
    'mcp__Claude_Browser__tabs_create', 'mcp__Claude_Browser__tabs_close',
  ]
  // stdio ghi trực tiếp ra file log (không đợi claude thoát mới thấy) — muốn xem tiến trình lúc đang chạy,
  // mở 1 cửa sổ khác: powershell -> Get-Content scripts\.auto-giai.log -Wait -Tail 20
  log('Bắt đầu gọi claude -p — theo dõi tiến trình: mở cửa sổ khác chạy `Get-Content scripts\\.auto-giai.log -Wait -Tail 20`')
  const fd = openSync(LOG, 'a')
  const r = spawnSync('claude', claudeArgs, { cwd: root, stdio: ['ignore', fd, fd], timeout: 20 * 60 * 1000 })
  closeSync(fd)
  log(`claude -p exit=${r.status}${r.error ? ' | spawn error: ' + r.error.message : ''}`)
} finally {
  try { unlinkSync(LOCK) } catch {}
}
