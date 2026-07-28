// Tạo file migration mới với tên theo TIMESTAMP (giờ VN) — chống va số.
// Chạy: node scripts/new-migration.mjs ten_viec_bang_snake_case
//
// VÌ SAO timestamp thay vì số tăng dần: số cấp bằng "nhìn file cuối rồi +1" nên hai
// luồng làm song song trong ngày là đụng nhau — 07-21 đụng 2 lần, 4 file. `migrate.mjs`
// sort theo TÊN nên hai file cùng số vẫn chạy, nhưng thứ tự giữa chúng do chữ cái
// quyết định; với cặp nới-CHECK / siết-CHECK thì đảo thứ tự = migrate-from-scratch fail.
// Timestamp tới phút thì hai người phải bấm trong cùng 60 giây mới đụng.
//
// File CŨ (0001..0115) GIỮ NGUYÊN, không đổi tên — '0' < '2' trong ASCII nên số cũ luôn
// sort TRƯỚC timestamp mới, thứ tự lịch sử vẫn đúng.
import { writeFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'supabase', 'migrations')

const ten = process.argv.slice(2).join('_').trim()
if (!ten) {
  console.error('Cần tên việc. Vd: node scripts/new-migration.mjs prep_phong_bo_luot_ngay')
  process.exit(1)
}
if (!/^[a-z0-9_]+$/.test(ten)) {
  console.error(`❌ Tên chỉ dùng a-z 0-9 _ (nhận được: "${ten}")`)
  process.exit(1)
}

// Giờ VN — KHÔNG dùng toISOString() (CLAUDE.md §2: cấm cho ngày local).
const p = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
}).formatToParts(new Date()).reduce((a, x) => (a[x.type] = x.value, a), {})
const stamp = `${p.year}${p.month}${p.day}${p.hour}${p.minute}`

const file = join(dir, `${stamp}_${ten}.sql`)
if (existsSync(file)) { console.error(`❌ Đã có ${stamp}_${ten}.sql`); process.exit(1) }

// Cảnh báo nếu phút này đã có file khác (2 người bấm cùng lúc) — không chặn, chỉ nhắc.
const dungPhut = readdirSync(dir).filter((f) => f.startsWith(stamp))
if (dungPhut.length) console.warn(`⚠️  Cùng phút đã có: ${dungPhut.join(', ')} — kiểm tra thứ tự phụ thuộc.`)

writeFileSync(file, `-- ============================================================================
-- ${stamp} — ${ten}
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
-- ============================================================================

`, 'utf8')
console.log(`OK -> supabase/migrations/${stamp}_${ten}.sql`)
