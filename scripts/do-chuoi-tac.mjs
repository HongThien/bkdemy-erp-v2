// ============================================================================
// do-chuoi-tac.mjs — TỰ DÒ CHUỖI ĐANG TẮC trong toàn hệ. Chạy: node scripts/do-chuoi-tac.mjs
//
// VÌ SAO: mục tiêu của CEO là *"hoàn thiện bảng dữ liệu nhanh nhất, tốn ít thời gian của t nhất"*.
//   Nút thắt KHÔNG phải công cụ mà là THỜI GIAN CỦA NGƯỜI. Nên hai thứ phải bỏ đi:
//     ① CEO không phải NHỚ RA có những quy trình nào → file này tự liệt kê từ DB.
//     ② CEO không phải trả lời nhiều lượt → đọc xong hết rồi mới hỏi, hỏi một lần.
//   (12/08 tốn 3 lượt cho 1 chuỗi chỉ vì Claude hỏi trước khi đọc xong.)
//
// CÁCH DÒ: hệ này mô hình hoá chuỗi bằng **cột mốc thời gian** — `*_dong_at`, `*_xong_at`,
//   `hoan_thanh_at`, `duyet_at`, `day_at`... (thấy ở `buoi_hoc`, `ca_test`, `bo_tro_duoi`,
//   `vh_ops_task`, `viec`). Một chuỗi TẮC = mốc đầu ĐÃ điền, mốc sau CÒN TRỐNG, và đã lâu.
//   ⇒ Quét mọi bảng, dựng PHỄU cho từng cột mốc, xếp theo mức tắc.
//
// ⚠ ĐÂY CHỈ LÀ MÁY ĐỀ CỬ, KHÔNG PHẢI KẾT LUẬN. Cột trống có thể là "chưa làm" HOẶC "không áp
//   dụng" — DB không phân biệt được (bài học lớn 12/08). File này chỉ NÊU chỗ đáng hỏi;
//   người mới quyết. Đừng đọc "0/4 đã chấm" thành "cả đội lười".
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function envKey(txt, ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = envKey(txt, 'DATABASE_URL_RO') ?? envKey(txt, 'DATABASE_URL')
if (!url) { console.error('❌ Thiếu DATABASE_URL_RO / DATABASE_URL trong .env'); process.exit(1) }

const NGAY_TOI_THIEU = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 7) // tắc bao lâu thì mới nêu

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  // Cột MỐC = timestamp, và tên nói lên một BƯỚC ĐÃ XONG. Loại `created_at`/`updated_at`
  // (không phải bước) và bảng bị RLS che (số 0 ở đó vô nghĩa — bài học 12/08).
  const { rows: cols } = await c.query(`
    select c.relname as bang, a.attname as cot
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
    where n.nspname = 'public' and c.relkind = 'r'
      and format_type(a.atttypid, a.atttypmod) like 'timestamp%'
      and a.attname not in ('created_at', 'updated_at', 'ts', 'cap_nhat_at')
      and a.attisdropped = false
      and not (pg_get_userbyid(c.relowner) <> current_user and c.relrowsecurity
               and not coalesce((select rolbypassrls from pg_roles where rolname = current_user), false))
    order by c.relname, a.attnum`)

  const theoBang = new Map()
  for (const r of cols) {
    if (!theoBang.has(r.bang)) theoBang.set(r.bang, [])
    theoBang.get(r.bang).push(r.cot)
  }

  const ra = []
  for (const [bang, cs] of theoBang) {
    // Bảng phải có mốc neo thời gian để tính TUỔI. Không có thì không biết tắc bao lâu ⇒ bỏ qua.
    const { rows: [co] } = await c.query(`
      select count(*) filter (where attname = 'created_at')::int co_created
      from pg_attribute where attrelid = ${lit(bang)}::regclass and attnum > 0 and not attisdropped`)
    if (!co.co_created) continue

    const sel = cs.map((x) => `count(*) filter (where ${ident(x)} is not null)::int as ${ident('n_' + x)}`).join(', ')
    const tuoi = cs.map((x) => `max(case when ${ident(x)} is null then
      ((now() at time zone 'Asia/Ho_Chi_Minh')::date - (created_at at time zone 'Asia/Ho_Chi_Minh')::date) end)::int as ${ident('t_' + x)}`).join(', ')
    const { rows: [d] } = await c.query(`select count(*)::int tong, ${sel}, ${tuoi} from ${ident(bang)}`)
    if (!d.tong) continue

    for (const x of cs) {
      const daDien = d['n_' + x], conTrong = d.tong - daDien, cuNhat = d['t_' + x] ?? 0
      // Nêu khi: CÓ dòng đã điền (⇒ bước này CÓ chạy thật) và VẪN còn dòng trống đã lâu.
      // Cột chưa ai điền bao giờ (daDien = 0) vẫn nêu nếu bảng có dữ liệu — đó là ca `ca_test`.
      if (conTrong > 0 && cuNhat >= NGAY_TOI_THIEU) {
        ra.push({ bang, moc: x, tong: d.tong, da_dien: daDien, con_trong: conTrong, cu_nhat_ngay: cuNhat })
      }
    }
  }

  ra.sort((a, b) => b.cu_nhat_ngay - a.cu_nhat_ngay || b.con_trong - a.con_trong)
  console.log(`CHUỖI CÓ MỐC BỎ TRỐNG ≥ ${NGAY_TOI_THIEU} ngày — ${ra.length} mốc, ${new Set(ra.map(r => r.bang)).size} bảng\n`)
  console.log('⚠ MÁY ĐỀ CỬ, KHÔNG PHẢI KẾT LUẬN: ô trống có thể là "chưa làm" HOẶC "không áp dụng".')
  console.log('   DB không phân biệt được — chỉ người mới quyết. Đọc để biết CHỖ ĐÁNG HỎI.\n')
  console.table(ra.slice(0, 30))
  console.log(`\nDùng: node scripts/do-chuoi-tac.mjs 30   (chỉ nêu chỗ tắc ≥ 30 ngày)`)
} catch (e) {
  console.error('❌', e.message); process.exitCode = 1
} finally { await c.end() }

function ident(s) { return '"' + String(s).replace(/"/g, '""') + '"' }
function lit(s) { return "'" + String(s).replace(/'/g, "''") + "'" }
