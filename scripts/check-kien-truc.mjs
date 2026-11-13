// ============================================================================
// npm run check:kien-truc — HÀNG RÀO KIẾN TRÚC (spec-kien-truc.md §8, đợt 1 — 13/11/2026)
// Chỉ ĐỌC DB + đọc code. Không ghi gì vào DB.
//
//   node scripts/check-kien-truc.mjs              → đo, so với số trần; số nào TĂNG ⇒ ✗ (exit 1)
//   node scripts/check-kien-truc.mjs --ha-tran    → ghi lại số trần = số hiện tại, CHỈ cho mục đã GIẢM
//   node scripts/check-kien-truc.mjs --khoi-tao   → ghi số trần + danh sách cho phép lần đầu (chỉ khi chưa có file)
//   node scripts/check-kien-truc.mjs --chi-code   → bỏ phần DB (máy không có .env)
//
// Hai loại mục:
//   CỨNG  = phải bằng 0 (bảng thiếu RLS, hàm/view hở ngoài danh sách cho phép, policy ghi mở).
//   TRẦN  = nợ cũ: chỉ được GIẢM. Tăng ⇒ ✗. Muốn tăng có lý do ⇒ sửa tay scripts/kien-truc/tran.json trong commit, ghi lý do.
// Danh sách cho phép: scripts/kien-truc/cho-phep.json (mỗi mục có lý do).
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(root, 'scripts', 'kien-truc')
const F_TRAN = path.join(DIR, 'tran.json')
const F_CHO = path.join(DIR, 'cho-phep.json')
const argv = process.argv.slice(2)
const HA = argv.includes('--ha-tran'), KHOI = argv.includes('--khoi-tao'), CHI_CODE = argv.includes('--chi-code')

const docJson = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d)
const tran = docJson(F_TRAN, {})
const cho = docJson(F_CHO, { ham_anon: {}, view_chay_quyen_chu: {} })
const muc = [] // { ma, ten, loai: 'cung'|'tran'|'canh_bao', so, chi_tiet[] }
const them = (ma, ten, loai, so, chiTiet = []) => muc.push({ ma, ten, loai, so, chiTiet })

// ───────────────────────── CODE ─────────────────────────
const SKIP = new Set(['node_modules', 'dist', '.git'])
const files = []
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (SKIP.has(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(e.name)) files.push(p) } }
walk(path.join(root, 'src'))
const dem = (re, loc = () => true) => { let n = 0; const top = []; for (const f of files) { if (!loc(f)) continue; const k = (fs.readFileSync(f, 'utf8').match(re) || []).length; if (k) { n += k; top.push([k, path.relative(root, f).replace(/\\/g, '/')]) } } return [n, top.sort((a, b) => b[0] - a[0]).slice(0, 5).map(([k, f]) => `${f} (${k})`)] }
{
  const [n1, t1] = dem(/(?<!storage)\s*\.from\(\s*['"`][a-z_]/g)
  them('code_from_bang', 'Chỗ client đọc/ghi thẳng bảng (.from) — K12', 'tran', n1, t1)
  const [n2, t2] = dem(/\bsetInterval\s*\(/g)
  them('code_set_interval', 'setInterval trong src (polling ngoài usePoll) — K13', 'tran', n2, t2)
  const [n3, t3] = dem(/\.limit\(\s*(?:[1-9]\d{3,}|LIMIT|LIM\b)|const\s+LIMIT\s*=\s*[1-9]\d{3,}/g)
  them('code_limit_lon', 'limit ≥ 1000 / hằng LIMIT lớn — K9', 'tran', n3, t3)
  const [n4, t4] = dem(/\.select\(\s*(?:['"`]\*['"`])?\s*\)/g)
  them('code_select_sao', "select('*') / select() lấy hết cột — K9", 'tran', n4, t4)
  const [n5, t5] = dem(/\b(?:mon|nhanh)\s*(?:===|!==)\s*['"`](?:toan|Toán|dai|hgt|hinh|hinh_gt|khtn|KHTN|anh|van|vatly|hoahoc)['"`]/g, (f) => !/[\\/]lib[\\/](mon|kho[\\/]branches)\.ts$/.test(f))
  them('code_mon_cung', 'So sánh môn/nhánh cứng ngoài registry — K16', 'tran', n5, t5)
}

// ───────────────────────── DB ─────────────────────────
if (!CHI_CODE) {
  const envPath = path.join(root, '.env')
  const env = fs.existsSync(envPath) ? Object.fromEntries(fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])) : {}
  const url = process.env.DATABASE_URL_RO || env.DATABASE_URL_RO || process.env.DATABASE_URL || env.DATABASE_URL
  if (!url) { console.error('❌ Không có DATABASE_URL_RO / DATABASE_URL — dùng --chi-code nếu chỉ kiểm code.'); process.exit(2) }
  const { default: pg } = await import('pg')
  const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await c.connect()
  await c.query('set default_transaction_read_only = on')
  const q = async (s, p) => (await c.query(s, p)).rows
  const ds = (rows, k = 'ten') => rows.map((r) => r[k])

  // CỨNG
  let r = await q(`select relname ten from pg_class where relnamespace='public'::regnamespace and relkind in ('r','p') and not relrowsecurity order by 1`)
  them('db_bang_khong_rls', 'Bảng public chưa bật RLS — K14', 'cung', r.length, ds(r))

  r = await q(`select distinct p.proname ten from pg_proc p where p.pronamespace='public'::regnamespace and p.prorettype <> 'trigger'::regtype and has_function_privilege('anon', p.oid, 'execute') order by 1`)
  const anonHienTai = ds(r)
  const anonLa = anonHienTai.filter((n) => !(n in cho.ham_anon))
  them('db_ham_anon_ngoai_ds', 'Hàm người CHƯA đăng nhập gọi được, ngoài danh sách cho phép — K14', 'cung', anonLa.length, anonLa)

  r = await q(`select c.relname ten from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v' and coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name='security_invoker'),'off') not in ('on','true') order by 1`)
  const viewLa = ds(r).filter((n) => !(n in cho.view_chay_quyen_chu))
  them('db_view_bo_qua_rls', 'View chạy bằng quyền chủ (bỏ qua RLS), ngoài danh sách cho phép — K14', 'cung', viewLa.length, viewLa)

  r = await q(`select tablename||'.'||policyname ten from pg_policies where schemaname='public' and cmd in ('ALL','INSERT','UPDATE','DELETE') and roles::text ~ '(authenticated|anon|public)' and coalesce(qual,'true')='true' and coalesce(with_check,'true')='true' order by 1`)
  them('db_policy_ghi_mo', 'Policy cho GHI với điều kiện true — K14', 'cung', r.length, ds(r))

  r = await q(`select c.relname ten from pg_class c where c.relnamespace='public'::regnamespace and c.relkind in ('r','v') and (has_table_privilege('anon',c.oid,'insert') or has_table_privilege('anon',c.oid,'update') or has_table_privilege('anon',c.oid,'delete')) and (c.relkind='v' or not c.relrowsecurity) order by 1`)
  them('db_anon_ghi_khong_rls', 'Bảng/view người chưa đăng nhập GHI được mà không có RLS chặn — K14', 'cung', r.length, ds(r))

  r = await q(`select c.relname ten from pg_class c where c.relnamespace='public'::regnamespace and c.relispartition and c.relname !~ '^messages_' order by 1`)
  them('db_bang_la_partition', 'Bảng public là PARTITION (PostgREST không lộ ra API ⇒ app mất bảng) — đã dính 13/11', 'cung', r.length, ds(r))

  // BẢN CHIẾU phải khớp đường tính trực tiếp (K21). Bảng nào thêm vào khuôn tính sẵn thì thêm một dòng đối chiếu ở đây.
  try { r = await q('select kho, ma_cau from public.fn_kho_cau_dang_lech() limit 20'); them('db_tra_cau_dang_lech', 'Bảng tra câu → dạng lệch so với tính trực tiếp — K21', 'cung', r.length, r.map((x) => x.kho + ':' + x.ma_cau)) } catch { /* chưa có bảng tra */ }

  // TRẦN
  r = await q(`select p.proname ten from pg_proc p where p.pronamespace='public'::regnamespace and p.prosecdef and p.prorettype <> 'trigger'::regtype
     and has_function_privilege('authenticated', p.oid, 'execute')
     and p.prosrc !~* '(la_thanh_vien|co_quyen_ghi|co_chuc_nang|current_nhan_su_id|my_hoc_sinh_id|chi_me_id|jwt_uid|auth\\.uid|request\\.jwt|_duoc_|_la_tac_vu_nen|fn_pham_vi_cua_toi|p_secret|_kiem|_sk_can|hs_o_lop|_duyet_duoc)' order by 1`)
  them('db_secdef_khong_cong', 'Hàm security definer người đăng nhập gọi được mà thân KHÔNG thấy cổng (ước lượng theo từ khoá) — K14', 'tran', r.length, ds(r).slice(0, 8))

  r = await q(`select conrelid::regclass::text||'.'||conname ten from pg_constraint c where contype='f' and connamespace='public'::regnamespace
     and not exists (select 1 from pg_index i where i.indrelid=c.conrelid and (i.indkey::int2[])[0:cardinality(c.conkey)-1] @> c.conkey) order by 1`)
  them('db_fk_thieu_index', 'Khoá ngoại chưa có index — K7', 'tran', r.length, ds(r).slice(0, 5))

  r = await q(`select proname ten from pg_proc where pronamespace='public'::regnamespace and prosrc ~ 'jwt_email\\(\\)' and proname <> 'jwt_email' order by 1`)
  them('db_ham_dung_email', 'Hàm lấy danh tính theo email trong token — K15', 'tran', r.length, ds(r))

  r = await q(`select count(*)::int n from pg_proc p where p.pronamespace='public'::regnamespace and p.prorettype <> 'trigger'::regtype and p.proname like E'\\\\_%' and has_function_privilege('authenticated', p.oid, 'execute')`)
  them('db_ham_noi_bo_mo', 'Hàm nội bộ (tên bắt đầu _) mà client gọi được — K1', 'tran', r[0].n)

  // cron + hàm chậm: cần hàm _audit_* (owner postgres). Không có thì bỏ qua, không coi là lỗi.
  try {
    r = await q(`select jobname ten from public._audit_cron_job() where active order by 1`)
    them('db_cron_job', 'Số job cron đang bật (đích: 1 bộ điều phối) — K4', 'tran', r.length, ds(r).slice(0, 6))
    r = await q(`select j.jobname ten, count(*)::int n from public._audit_cron_runs() d join public._audit_cron_job() j using (jobid) where d.status <> 'succeeded' and d.start_time > now() - interval '24 hours' group by 1 order by 2 desc`)
    them('db_cron_loi_24h', 'Job cron có lượt lỗi trong 24 giờ', 'canh_bao', r.length, r.map((x) => `${x.ten} (${x.n})`))
    r = await q(`select (regexp_match(s.query, '"public"\\."([a-z0-9_]+)"\\('))[1] ten, sum(s.calls)::int calls, round(sum(s.total_exec_time)/sum(s.calls))::int ms
       from public._audit_pss() s join pg_roles ro on ro.oid = s.userid where ro.rolname = 'authenticated' and s.query ~ '"public"\\."[a-z0-9_]+"\\('
       group by 1 having sum(s.calls) >= 20 and sum(s.total_exec_time)/sum(s.calls) >= 1000 order by 3 desc`)
    them('db_ham_cham', 'Hàm client gọi có trung bình ≥ 1 giây (số cộng dồn, chỉ để theo dõi) — K10', 'canh_bao', r.length, r.slice(0, 8).map((x) => `${x.ten} ${x.ms}ms×${x.calls}`))
  } catch { them('db_thong_ke', 'Thống kê cron / hàm chậm: không đọc được (thiếu hàm _audit_*)', 'canh_bao', 0) }

  await c.end()
  if (KHOI && !fs.existsSync(F_CHO)) {
    const lyDo = (n) => (/^fn_(pt|ta)_push|^fn_tg_|^fn_troly_tuan_tu_dong/.test(n) ? 'bot/cron gọi bằng khoá công khai, hàm tự kiểm p_secret'
      : /^fn_(dtv|game_bxh|xep_chu)/.test(n) ? 'game cho khách chưa đăng nhập'
        : /^postgres_fdw/.test(n) ? 'hàm của extension postgres_fdw'
          : 'hàm kiểm quyền / tiện ích dùng trong policy, view, ràng buộc (trả false/rỗng cho người chưa đăng nhập)')
    cho.ham_anon = Object.fromEntries(anonHienTai.map((n) => [n, lyDo(n)]))
    cho.view_chay_quyen_chu = Object.fromEntries(ds(await (async () => { const c2 = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c2.connect(); const x = (await c2.query(`select c.relname ten from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v' and coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name='security_invoker'),'off') not in ('on','true') order by 1`)).rows; await c2.end(); return x })()).map((n) => [n, 'cửa đọc của app phụ huynh qua FDW (role fdw_bkdemy_web); authenticated/anon không có quyền']))
    fs.mkdirSync(DIR, { recursive: true })
    fs.writeFileSync(F_CHO, JSON.stringify(cho, null, 2) + '\n')
    console.log(`— Đã ghi danh sách cho phép lần đầu: ${path.relative(root, F_CHO)} — CHẠY LẠI lệnh để đo theo danh sách này.`)
    process.exit(0)
  }
}

// ───────────────────────── SO VỚI TRẦN ─────────────────────────
let hong = 0, giam = 0
const dong = []
for (const m of muc) {
  if (CHI_CODE && m.ma.startsWith('db_')) continue
  let kq = '✔', ghiChu = ''
  if (m.loai === 'cung') { if (m.so > 0) { kq = '✗'; hong++; ghiChu = 'phải = 0' } }
  else if (m.loai === 'tran') {
    const t = tran[m.ma]
    if (t === undefined) { kq = '•'; ghiChu = 'chưa có số trần (chạy --khoi-tao)' }
    else if (m.so > t) { kq = '✗'; hong++; ghiChu = `TĂNG so với trần ${t} (+${m.so - t})` }
    else if (m.so < t) { kq = '↓'; giam++; ghiChu = `giảm so với trần ${t} (−${t - m.so}) — chạy --ha-tran để chốt` }
    else ghiChu = `= trần ${t}`
  } else { kq = m.so > 0 ? '!' : '✔'; ghiChu = 'chỉ cảnh báo' }
  dong.push(`${kq} ${String(m.so).padStart(5)}  ${m.ten}${ghiChu ? `  [${ghiChu}]` : ''}`)
  if (m.chiTiet?.length && (kq === '✗' || kq === '!' || argv.includes('--chi-tiet'))) dong.push(`         ${m.chiTiet.slice(0, 8).join(' · ')}${m.chiTiet.length > 8 ? ' …' : ''}`)
}
console.log('HÀNG RÀO KIẾN TRÚC — spec-kien-truc.md §8\n' + dong.join('\n'))

if (KHOI || HA) {
  const moi = { ...tran }
  for (const m of muc) if (m.loai === 'tran' && !(CHI_CODE && m.ma.startsWith('db_'))) { if (KHOI && moi[m.ma] === undefined) moi[m.ma] = m.so; else if (HA && moi[m.ma] !== undefined && m.so < moi[m.ma]) moi[m.ma] = m.so }
  fs.mkdirSync(DIR, { recursive: true })
  fs.writeFileSync(F_TRAN, JSON.stringify(moi, null, 2) + '\n')
  console.log(`\n— Đã ghi số trần: ${path.relative(root, F_TRAN)}`)
}
if (hong) { console.log(`\n✗ ${hong} mục vi phạm. Sửa cho về mức cũ, hoặc (nếu có lý do) cập nhật scripts/kien-truc/ trong CÙNG commit và ghi lý do.`); process.exit(1) }
console.log(`\n✔ Không mục nào tăng.${giam ? ` ${giam} mục đã giảm — chạy --ha-tran để chốt mức mới.` : ''}`)
