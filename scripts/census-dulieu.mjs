// ============================================================================
// census-dulieu.mjs — BẢN ĐỒ DỮ LIỆU THẬT của toàn hệ. Chạy: node scripts/census-dulieu.mjs
//
// VÌ SAO CẦN: `schema.md` nói hệ CÓ GÌ, không nói CÁI GÌ ĐANG SỐNG. Ngày 12/08 đã dẫm đúng
//   khoảng cách đó ba lần — `viec` có đủ cột đẹp nhưng 15 dòng đứng im; `bai_test` tưởng là
//   hiện vật của ET nhưng chỉ là luồng online. **Cột đầy đủ ≠ có dữ liệu.**
//   File này trả lời câu ĐẦU TIÊN phải hỏi trước khi xây bất cứ gì lên trên một bảng:
//   bảng này có ai dùng không, lần cuối là bao giờ.
//
// ⚠ KHÔNG trả lời được (đừng đòi nó trả lời — hỏi người):
//   · must-exist: cái gì ĐÁNG LẼ phải xảy ra. Không nằm trong dữ liệu.
//   · bảng này NUÔI cái gì. Bảng không nuôi gì thì sớm muộn bị bỏ (CEO 12/08: "việc đó không
//     ảnh hưởng đến cái khác nên t bỏ") — và đó là quy luật, không phải kỷ luật kém.
//
// ⚠ BẪY RLS: bảng KHÔNG do role hiện tại sở hữu + role không có `bypassrls` ⇒ count = 0 IM LẶNG.
//   Script tự phát hiện và ĐÁNH DẤU riêng, KHÔNG gộp vào nhóm "rỗng" (12/08: `hinh_giao_trinh`
//   và 2 bảng nữa đọc ra 0 dòng dù có data thật).
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

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  // Bảng + cột thời gian đại diện + bảng nào bị RLS che với role hiện tại.
  const { rows: tbls } = await c.query(`
    select c.relname as bang,
           (pg_get_userbyid(c.relowner) <> current_user
            and c.relrowsecurity
            and not coalesce((select rolbypassrls from pg_roles where rolname = current_user), false)) as bi_rls_che,
           (select a.attname from pg_attribute a
             where a.attrelid = c.oid and not a.attisdropped and a.attnum > 0
               and format_type(a.atttypid, a.atttypmod) like 'timestamp%'
             order by (a.attname = 'created_at') desc, (a.attname = 'ts') desc, a.attnum
             limit 1) as cot_tg
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r','p')
    order by c.relname`)

  // Một lượt UNION ALL cho toàn bộ bảng — 124 round-trip là phí.
  const sql = tbls.map((t) => `select ${quote(t.bang)} bang, count(*)::int n, ${
    t.cot_tg ? `to_char(max(${ident(t.cot_tg)}) at time zone 'Asia/Ho_Chi_Minh','YYYY-MM-DD')` : 'null::text'
  } moi_nhat, ${t.cot_tg ? `count(*) filter (where ${ident(t.cot_tg)} > now() - interval '30 days')::int` : 'null::int'
  } trong_30n from ${ident(t.bang)}`).join('\nunion all\n')
  const { rows } = await c.query(sql)

  const meta = Object.fromEntries(tbls.map((t) => [t.bang, t]))
  const che = rows.filter((r) => meta[r.bang].bi_rls_che)
  const thay = rows.filter((r) => !meta[r.bang].bi_rls_che)
  const song = thay.filter((r) => (r.trong_30n ?? 0) > 0)
  const nguoi = thay.filter((r) => r.n > 0 && (r.trong_30n ?? 0) === 0)
  const rong = thay.filter((r) => r.n === 0)
  const khongTg = thay.filter((r) => r.n > 0 && !meta[r.bang].cot_tg)

  const in_ = (ten, ds, extra) => {
    console.log(`\n${'─'.repeat(70)}\n${ten} — ${ds.length} bảng${extra ? `\n${extra}` : ''}`)
    if (ds.length) console.table(ds.map((r) => ({ bang: r.bang, dong: r.n, '30_ngay': r.trong_30n ?? '—', moi_nhat: r.moi_nhat ?? '(không có cột thời gian)' })))
  }

  console.log(`TỔNG: ${rows.length} bảng · role hiện tại: đọc được ${thay.length}, bị RLS che ${che.length}`)
  in_('🟢 ĐANG SỐNG (có dòng trong 30 ngày)', song.sort((a, b) => b.trong_30n - a.trong_30n))
  in_('🟡 CÓ DATA NHƯNG NGUỘI (>30 ngày không thêm dòng)', nguoi.sort((a, b) => b.n - a.n),
    '→ Hỏi: khâu này còn chạy không? Nếu bỏ rồi thì KHAI TỬ chính thức, đừng để trợ lý nhắc.')
  in_('⚪ RỖNG (0 dòng — schema có, chưa ai dùng)', rong,
    '→ Hỏi: chưa tới lượt dùng, hay đã chết? Xây gì lên bảng rỗng = xây trên giả định.')
  if (khongTg.length) in_('⚠ CÓ DATA NHƯNG KHÔNG CÓ CỘT THỜI GIAN NÀO', khongTg,
    '→ Không suy được "vào/ra state khi nào" (doc §11). Trợ lý mù với mọi bảng ở đây.')
  if (che.length) in_('🔒 BỊ RLS CHE — SỐ 0 Ở ĐÂY VÔ NGHĨA, KHÔNG PHẢI RỖNG', che,
    '→ Role không sở hữu bảng + không bypassrls. Xem qua dashboard/app mới biết số thật.')
} catch (e) {
  console.error('❌', e.message); process.exitCode = 1
} finally { await c.end() }

function ident(s) { return '"' + String(s).replace(/"/g, '""') + '"' }
function quote(s) { return "'" + String(s).replace(/'/g, "''") + "'" }
