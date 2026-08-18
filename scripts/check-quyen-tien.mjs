// ============================================================================
// KIỂM CHỨNG SIẾT QUYỀN NHÓM TIỀN — chạy TRƯỚC và SAU migration rồi so hai bảng.
//
// Vì sao cần: bật RLS sai trên DB đang chạy KHÔNG báo lỗi — nó chỉ trả 0 dòng, im lặng
// (CLAUDE.md §2.1). Không tin policy viết đúng cho tới khi thấy số: người trong nhóm
// PHẢI mở được, người ngoài PHẢI bị chặn.
//
// ⚠ KHÔNG giả lập bằng `set local role authenticated` được — role `claude_build` không có
//   quyền đó, và bản thân nó SỞ HỮU bảng nên chủ sở hữu vốn đã bỏ qua RLS. Thay vào đó:
//   nhét `request.jwt.claims` đúng người rồi gọi thẳng HÀM QUYẾT ĐỊNH — đó là chỗ chứa
//   toàn bộ logic rủi ro, còn phần đấu policy vào hàm thì cơ học.
//   ⇒ Kiểm này chứng minh CỔNG đúng, KHÔNG thay thế được một lượt bấm thật trên app.
//
//   node scripts/check-quyen-tien.mjs
// ============================================================================
import { readFileSync } from 'node:fs'
import pg from 'pg'

const env = readFileSync('.env', 'utf8')
const url = env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url })
await c.connect()

// Ba người nhóm ① + hai người NGOÀI nhóm làm đối chứng.
const AI = ['NS001', 'NS002', 'NS003', 'NS005', 'NS008', 'NS014']
const nguoi = (await c.query(
  `select ns.ma_ns, ns.ho_ten, tk.id as uid, ns.email, ns.la_admin_he_thong as admin
   from nhan_su ns left join tai_khoan tk on tk.nhan_su_id = ns.id
   where ns.ma_ns = any($1) order by ns.ma_ns`, [AI])).rows

const coHam = (await c.query(
  `select count(*)::int n from pg_proc where proname='co_chuc_nang' and pronamespace='public'::regnamespace`
)).rows[0].n > 0

// Trước migration hàm chưa tồn tại ⇒ chạy bản MÔ PHỎNG y hệt thân hàm, để vẫn có số mà so.
const SQL_DOC = coHam
  ? `select public.co_chuc_nang('hocphi') as v`
  : `with me as (select coalesce((select nhan_su_id from tai_khoan where id=public.jwt_uid()),
       (select id from nhan_su where email is not null and lower(email)=public.jwt_email() and public.jwt_email()<>'')) ns_id)
     select coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id=me.ns_id), false)
       or exists (select 1 from me join vi_tri v on v.nhan_su_id=me.ns_id
         join vai_tro_chuc_nang vc on vc.vai_tro_id=v.vai_tro_id where vc.chuc_nang='hocphi') as v`

const ra = []
for (const p of nguoi) {
  await c.query('begin')
  await c.query(`select set_config('request.jwt.claims', $1, true)`,
    [JSON.stringify({ sub: p.uid, email: p.email, role: 'authenticated' })])
  const cong = (await c.query(SQL_DOC)).rows[0].v
  const cu = (await c.query(`select public.la_thanh_vien() as v`)).rows[0].v
  await c.query('rollback')
  ra.push({
    ma_ns: p.ma_ns, ho_ten: p.ho_ten,
    admin: p.admin,
    'cổng CŨ (la_thanh_vien)': cu,
    'cổng MỚI (chức năng hocphi)': cong,
  })
}

const tong = {}
for (const b of ['hoa_don', 'hoa_don_dong', 'hoc_phi_cong_thuc', 'luong_bac'])
  tong[b] = (await c.query(`select count(*)::int n from public.${b}`)).rows[0].n

console.log(`\n▸ Hàm co_chuc_nang() ${coHam ? 'ĐÃ tồn tại (migration đã chạy)' : 'CHƯA có — đang chạy bản mô phỏng'}`)
console.log('▸ Số dòng thật trong nhóm tiền:', JSON.stringify(tong))
console.log('\n▸ AI QUA ĐƯỢC CỔNG NÀO')
console.table(ra)

const sai = ra.filter((r) => ['NS001', 'NS002', 'NS003', 'NS005'].includes(r.ma_ns) !== r['cổng MỚI (chức năng hocphi)'])
console.log(sai.length
  ? `\n❌ LỆCH KỲ VỌNG ở: ${sai.map((r) => r.ma_ns).join(', ')} — KHÔNG chạy migration cho tới khi hiểu vì sao.`
  : `\n✅ Cổng mới khớp đúng nhóm ①: NS001 · NS002 · NS003 · NS005(admin) mở được, còn lại bị chặn.`)
await c.end()
