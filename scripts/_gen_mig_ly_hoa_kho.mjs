// Sinh migration "Lý hóa đợt 2 — kho + bản đồ" TỪ DB ĐANG CHẠY (Thùy 12/11).
// Nhân bản mọi bảng/chuỗi/hàm/trigger/policy/quyền khtn_* → lyhoa_* (rỗng), rồi vá các hàm REGISTRY rẽ nhánh kho theo môn.
// Chạy: node scripts/_gen_mig_ly_hoa_kho.mjs <file.sql>   (chỉ ĐỌC DB; in cảnh báo cho chỗ cần mắt người)
import pg from 'pg'
import fs from 'fs'

const out = process.argv[2]
if (!out) { console.error('thiếu đường dẫn file ra'); process.exit(1) }
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
  .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const canh = []

// ---- luật đổi chữ KHTN → Lý hóa (thứ tự quan trọng) ----
const MA_TIEN_TO = ['KCUM', 'KCD', 'KCH', 'KDB', 'KNB', 'KG', 'KC'] // tiền tố mã gốc của bảng khtn_* (default cột)
function doi(s) {
  let t = s
  for (const p of MA_TIEN_TO) t = t.replaceAll(`'${p}'`, `'L${p.slice(1)}'`)
  t = t.replaceAll("'^K[0-9]", "'^L[0-9]")          // mã chuyên đề bản đồ cũ K + 6 số
  t = t.replaceAll("'^' || 'K'", "'^' || 'L'")
  t = t.replace(/khtn/g, 'lyhoa')                      // tên bảng/hàm/trigger/chuỗi + khoá nhánh 'khtn'
  t = t.replaceAll("'KHTN'", "'Lý hóa'")              // nhãn MÔN
  t = t.replace(/\bKHTN\b/g, 'Lý hóa')                 // chữ trong thông báo/chú thích
  return t
}

const L = []
const push = (...s) => L.push(...s)
const outEditor = process.argv[3] // phần thuộc owner postgres (tạo tay qua SQL Editor) — claude_build không thay được
const E = []
push(`-- ============================================================================
-- Môn LÝ HÓA, đợt 2 — KHO + BẢN ĐỒ KIẾN THỨC (Thùy 12/11: "vai trò giống KHTN", khối 10 11 12)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_kho.mjs từ DB đang chạy — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO: Lý hóa = 1 trung tâm riêng (§1.6), cùng KHUÔN với KHTN (Chủ đề → Chuyên đề → Dạng, bản đồ mới bdm, form TN, đề xuất).
--   (A) Nhân bản cấu trúc mọi bảng khtn_* → lyhoa_* (RỖNG — không chép dữ liệu KHTN), chuỗi mã riêng, mã gốc tiền tố L
--       (LC câu · LG dạng cũ · LCD/LCH/LDB/LNB bản đồ mới · LCUM cụm) — không đụng tiền tố nào đang dùng.
--   (B) Nhân bản mọi hàm riêng của KHTN (fn_khtn_*, _khtn_*, khtn_*) + trigger + policy + quyền.
--   (C) Vá REGISTRY dùng chung rẽ nhánh kho theo môn (_kho_*_tbl, fn_kho_tbl, giải bài, duyệt, nhập câu…). Trước bản vá này
--       nhiều hàm "else ⇒ bảng Toán" nên môn Lý hóa (đã mở lớp ở đợt 1) sẽ ÂM THẦM rơi vào kho Toán.
--   (D) Dạng chờ L10/L11/L12 (bản đồ cũ, giống K07–K09 của KHTN) để nhập câu chưa phân dạng.
--   CHƯA ở đợt này (đợt 3–4): tài liệu/giáo trình/ET/MT/BTVN/mastery/tự luyện, app HS (_kho_co_mon), phiên Claude, trợ lý.
-- MẤT GÌ (Luật xoá): không mất gì — chỉ tạo mới + create or replace (giữ chữ ký) + nới CHECK.
-- ============================================================================
set local check_function_bodies = off;
`)

// ---- (A1) chuỗi ----
const seqs = await q(`select c.relname, s.seqtypid::regtype::text typ from pg_class c join pg_namespace n on n.oid=c.relnamespace
  join pg_sequence s on s.seqrelid=c.oid where n.nspname='public' and c.relkind='S' and c.relname like 'khtn%' order by 1`)
push('-- (A1) chuỗi mã')
for (const s of seqs) push(`create sequence public.${doi(s.relname)} as ${s.typ};`)

// ---- (A2) bảng ----
const tbls = (await q(`select c.oid, c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' and c.relname like 'khtn%' order by 1`))
push('\n-- (A2) bảng: cột + NOT NULL + default + identity + generated + index/PK/UNIQUE + chú thích')
for (const t of tbls) {
  push(`create table public.${doi(t.relname)} (like public.${t.relname} including defaults including identity including generated including indexes including comments including storage);`)
  // default trỏ chuỗi khtn_* / có chữ khtn ⇒ đặt lại theo bản đổi chữ
  for (const d of await q(`select a.attname, pg_get_expr(ad.adbin, ad.adrelid) e from pg_attrdef ad join pg_attribute a on a.attrelid=ad.adrelid and a.attnum=ad.adnum
      where ad.adrelid=$1 and a.attgenerated=''`, [t.oid])) {
    if (doi(d.e) !== d.e) push(`alter table public.${doi(t.relname)} alter column ${d.attname} set default ${doi(d.e)};`)
  }
}
// sở hữu chuỗi (serial cũ) ⇒ chuỗi lyhoa thuộc cột lyhoa
for (const r of await q(`select s.relname seq, t.relname tbl, a.attname col from pg_depend d join pg_class s on s.oid=d.objid and s.relkind='S'
    join pg_class t on t.oid=d.refobjid join pg_attribute a on a.attrelid=t.oid and a.attnum=d.refobjsubid
    where d.deptype='a' and s.relname like 'khtn%' and t.relname like 'khtn%'`)) {
  push(`alter sequence public.${doi(r.seq)} owned by public.${doi(r.tbl)}.${r.col};`)
}

// ---- (A3) CHECK + FK (đổi chữ: tên bảng đích, tiền tố mã) ----
push('\n-- (A3) CHECK + FK')
const cons = await q(`select conrelid::regclass::text t, conname, contype, pg_get_constraintdef(oid) d from pg_constraint
  where conrelid in (select oid from pg_class where relname like 'khtn%' and relkind='r') and contype in ('c','f') order by contype, 1, 2`)
for (const k of cons) push(`alter table public.${doi(k.t)} add constraint ${doi(k.conname)} ${doi(k.d)};`)

// ---- (A4) RLS + policy + quyền bảng ----
push('\n-- (A4) RLS + policy + quyền')
for (const t of tbls) {
  const [r] = await q(`select relrowsecurity rls, relforcerowsecurity f from pg_class where oid=$1`, [t.oid])
  if (r.rls) push(`alter table public.${doi(t.relname)} enable row level security;`)
  if (r.f) push(`alter table public.${doi(t.relname)} force row level security;`)
  for (const p of await q(`select polname, polpermissive, polcmd, polroles, pg_get_expr(polqual, polrelid) u, pg_get_expr(polwithcheck, polrelid) w,
      array(select case when x=0 then 'public' else quote_ident(rolname) end from unnest(polroles) x left join pg_roles r on r.oid=x) roles
      from pg_policy where polrelid=$1`, [t.oid])) {
    if (p.polname === 'claude_ro_select') continue // migrate.mjs tự thêm cho bảng RLS mới
    const cmd = { r: 'select', a: 'insert', w: 'update', d: 'delete', '*': 'all' }[p.polcmd]
    push(`create policy ${JSON.stringify(doi(p.polname))} on public.${doi(t.relname)} as ${p.polpermissive ? 'permissive' : 'restrictive'} for ${cmd} to ${p.roles.join(', ')}`
      + (p.u ? ` using (${doi(p.u)})` : '') + (p.w ? ` with check (${doi(p.w)})` : '') + ';')
  }
  for (const g of await q(`select grantee::regrole::text gr, privilege_type pr from (select (aclexplode(relacl)).* from pg_class where oid=$1) a
      where grantee <> 0 and grantee <> (select relowner from pg_class where oid=$1)`, [t.oid])) {
    push(`grant ${g.pr} on public.${doi(t.relname)} to ${g.gr};`)
  }
}
for (const s of seqs) {
  for (const g of await q(`select grantee::regrole::text gr, privilege_type pr from (select (aclexplode(relacl)).* from pg_class where relname=$1) a
      where grantee <> 0 and grantee <> (select relowner from pg_class where relname=$1)`, [s.relname])) {
    push(`grant ${g.pr} on sequence public.${doi(s.relname)} to ${g.gr};`)
  }
}

// ---- (B) hàm riêng KHTN ----
push('\n-- (B) hàm riêng (nhân bản fn_khtn_* · _khtn_* · khtn_*)')
const fns = await q(`select p.oid, p.proname, pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) args, p.proacl::text acl
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like '%khtn%' and p.prokind='f' order by 1`)
const quyenHam = async (oid, ten, args) => {
  const r = []
  r.push(`revoke all on function public.${ten}(${args}) from public;`)
  r.push(`revoke all on function public.${ten}(${args}) from anon;`)
  for (const g of await q(`select grantee::regrole::text gr from (select (aclexplode(proacl)).* from pg_proc where oid=$1) a
      where grantee <> 0 and grantee <> (select proowner from pg_proc where oid=$1) and privilege_type='EXECUTE'`, [oid])) {
    if (g.gr !== 'anon') r.push(`grant execute on function public.${ten}(${args}) to ${g.gr};`)
  }
  const [pub] = await q(`select exists (select 1 from (select (aclexplode(proacl)).* from pg_proc where oid=$1) a where grantee=0) x, (select proacl is null from pg_proc where oid=$1) mac_dinh`, [oid])
  if (pub.mac_dinh || pub.x) r.push(`-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated`, `grant execute on function public.${ten}(${args}) to authenticated;`)
  return r
}
for (const f of fns) {
  push(doi(f.d) + ';')
  push(...await quyenHam(f.oid, doi(f.proname), doi(f.args)))
}

// ---- (B2) trigger ----
push('\n-- (B2) trigger')
for (const g of await q(`select pg_get_triggerdef(t.oid) d from pg_trigger t where not tgisinternal and tgrelid in (select oid from pg_class where relname like 'khtn%' and relkind='r') order by 1`)) {
  push(doi(g.d) + ';')
}

// ---- (C) vá registry dùng chung ----
push('\n-- (C) REGISTRY dùng chung: thêm nhánh Lý hóa (dựng từ bản đang chạy, chỉ chèn thêm)')
async function va(ten, sua) {
  const rs = await q(`select p.oid, pg_get_userbyid(p.proowner) own, pg_get_functiondef(p.oid) d from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1`, [ten])
  if (rs.length !== 1) throw new Error(`${ten}: ${rs.length} bản`)
  let d = rs[0].d
  const goc = d
  d = sua(d)
  if (d === goc) throw new Error(`${ten}: vá không đổi gì`)
  ;(rs[0].own === 'claude_build' ? L : E).push(`-- ${ten}`, d + ';')
}
const ep = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 80)); return s.replace(a, b) }
const epAll = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 80)); return s.replaceAll(a, b) }

for (const ten of ['_kho_ban_do_tbl', '_kho_cau_tbl', '_kho_form_dien_tbl', '_kho_form_tn_tbl', '_kho_lt_tbl']) {
  await va(ten, (d) => d.replace(/(\n(\s*)select case when p_mon = 'KHTN' then 'khtn_(\w+)')/, `$1\n$2            when p_mon = 'Lý hóa' then 'lyhoa_$3'`))
}
await va('_kho_muc_do_dang', (d) => ep(d, "  elsif p_mon = 'Tiếng Anh' then", "  elsif p_mon = 'Lý hóa' then\n    select muc_do into v_md from lyhoa_ban_do where ma_dang = p_ma_dang;\n  elsif p_mon = 'Tiếng Anh' then"))
await va('_kho_nhanh_cua_dang', (d) => epAll(d, "not in ('KHTN', ", "not in ('KHTN', 'Lý hóa', "))
await va('_kho_dang_cho', (d) => ep(d, "when 'khtn' then 'K'", "when 'khtn' then 'K' when 'lyhoa' then 'L'"))
await va('fn_kho_tbl', (d) => ep(d, "when 'khtn' then 'khtn'", "when 'khtn' then 'khtn' when 'lyhoa' then 'lyhoa'"))
await va('count_cau_by_dang', (d) => ep(d, "'khtn_cau_hoi', ", "'khtn_cau_hoi', 'lyhoa_cau_hoi', "))
await va('_mcq_kiem_kho', (d) => ep(ep(d, "('dai', 'khtn', 'hgt')", "('dai', 'khtn', 'lyhoa', 'hgt')"), 'dai/khtn/hgt', 'dai/khtn/lyhoa/hgt'))
await va('fn_kho_doi_dang_tk', (d) => ep(d, "('dai', 'hgt', 'khtn')", "('dai', 'hgt', 'khtn', 'lyhoa')"))
await va('fn_kho_sua_tk', (d) => ep(d, "('dai', 'hgt', 'khtn')", "('dai', 'hgt', 'khtn', 'lyhoa')"))
await va('_bdm_tu_duyet_sau_gan', (d) => ep(d, "when tg_table_name like 'khtn%' then 'khtn_cau_hoi'", "when tg_table_name like 'khtn%' then 'khtn_cau_hoi'\n                            when tg_table_name like 'lyhoa%' then 'lyhoa_cau_hoi'"))
await va('_trg_chan_duyet_dang_cho', (d) => ep(d, "    end if;\n    raise exception 'Chưa phân dạng",
  "    elsif tg_table_name = 'lyhoa_cau_hoi' then   -- mig Lý hóa đợt 2: như KHTN\n      if exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;\n    end if;\n    raise exception 'Chưa phân dạng"))
await va('_bdm_dang_bai_cua_mon', (d) => ep(d, "   where public._kho_ban_do_tbl(p_mon, null) = 'khtn_ban_do' and d.id = any(p_ma)",
  "   where public._kho_ban_do_tbl(p_mon, null) = 'khtn_ban_do' and d.id = any(p_ma)\n  union all\n  select d.id, 'lyhoa', d.muc_do::smallint\n    from lyhoa_bdm_dang_bai d\n   where public._kho_ban_do_tbl(p_mon, null) = 'lyhoa_ban_do' and d.id = any(p_ma)"))
await va('fn_bdm_nhap_cau', (d) => {
  d = ep(d, "t not in ('dai', 'hgt', 'khtn')", "t not in ('dai', 'hgt', 'khtn', 'lyhoa')")
  d = ep(d, "if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))\n     or (t <> 'khtn' and",
    "if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))\n     or (t = 'lyhoa' and not exists (select 1 from lyhoa_bdm_chu_de where khoi = p_khoi))\n     or (t not in ('khtn', 'lyhoa') and")
  d = ep(d, "if p_chu_de is not null and t <> 'khtn' then", "if p_chu_de is not null and t not in ('khtn', 'lyhoa') then")
  d = ep(d, "  elsif p_dang_bai is not null then", "  elsif p_dang_bai is not null and t = 'lyhoa' then\n    perform public._lyhoa_bdm_gan(v_ma, p_dang_bai, 'nguoi');\n  elsif p_dang_bai is not null then")
  return d
})
// giải bài AI / duyệt lời giải
await va('fn_giaibai_mon', (d) => ep(d, "case when p_nhanh = 'khtn' then 'KHTN'", "case when p_nhanh = 'khtn' then 'KHTN' when p_nhanh = 'lyhoa' then 'Lý hóa'"))
await va('fn_giaibai_src', (d) => ep(d, "when 'khtn' then 'khtn_cau_hoi'", "when 'khtn' then 'khtn_cau_hoi' when 'lyhoa' then 'lyhoa_cau_hoi'"))
await va('fn_giaibai_tbl', (d) => ep(d, "when 'khtn' then 'khtn_cau_hoi_yeu_cau_giai'", "when 'khtn' then 'khtn_cau_hoi_yeu_cau_giai' when 'lyhoa' then 'lyhoa_cau_hoi_yeu_cau_giai'"))
await va('fn_giaibai_duyet', (d) => epAll(d, "('toan','khtn','hgt')", "('toan','khtn','lyhoa','hgt')"))
await va('fn_giaibai_nhan', (d) => epAll(d, "('toan','khtn','hgt')", "('toan','khtn','lyhoa','hgt')"))
await va('fn_giaibai_dem_cho_ai', (d) => {
  const m = d.match(/\n(\s*)select 'khtn', count\(\*\) from khtn_cau_hoi [^\n]*\n\s*union all/)
  if (!m) throw new Error('fn_giaibai_dem_cho_ai: không thấy dòng khtn')
  return d.replace(m[0], m[0] + '\n' + m[0].trim().replace(/khtn/g, 'lyhoa').replace(/\s*union all$/, '').replace(/^/, m[1]) + '\n' + m[1] + 'union all')
})
// Các hàm khác có 'khtn' nhưng CHƯA vá ở đợt này — in ra để biết còn lại gì (đợt 3–4)
const daVa = new Set(L.filter((x) => x.startsWith('-- ')).map((x) => x.slice(3).trim()))
const conLai = await q(`select distinct p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
  and p.proname not like '%khtn%' and p.prosrc ilike '%khtn%' order by 1`)
canh.push('Hàm dùng chung còn nhắc khtn, CHƯA vá (đợt 3–4): ' + conLai.map((r) => r.proname).filter((x) => !daVa.has(x)).join(' '))

// ---- (C2) view giải bài: nhân khối KHTN thành khối Lý hóa ----
push('\n-- (C2) view giải bài AI: thêm khối Lý hóa (nhân bản khối KHTN trong UNION)')
for (const v of ['v_giaibai_bai', 'v_giaibai_hoan_thien', 'v_giaibai_nhan']) {
  const [r] = await q(`select pg_get_viewdef($1::regclass, true) d`, [v])
  // tách các nhánh UNION ALL ở tầng ngoài cùng của CTE đầu: lấy nhánh có 'khtn'::text rồi chèn bản đổi chữ ngay sau
  const parts = r.d.split(/\n(\s*)UNION ALL\n/)
  // split với nhóm bắt ⇒ [khoi0, indent, khoi1, indent, ...]
  const blocks = []; const ind = []
  for (let i = 0; i < parts.length; i++) (i % 2 === 0 ? blocks : ind).push(parts[i])
  const k = blocks.findIndex((b) => /'khtn'::text/.test(b) && !/'toan'::text/.test(b))
  if (k < 0) throw new Error(v + ': không tách được khối khtn')
  const moi = doi(blocks[k])
  blocks.splice(k + 1, 0, moi); ind.splice(k, 0, ind[k] ?? ind[k - 1])
  let d = blocks[0]
  for (let i = 1; i < blocks.length; i++) d += `\n${ind[i - 1]}UNION ALL\n` + blocks[i]
  push(`create or replace view public.${v} as\n${d.replace(/;\s*$/, '')};`)
  canh.push(`${v}: chèn khối Lý hóa sau khối #${k} (${blocks[k].split('\n').length} dòng) — soát bằng mắt`)
}

// ---- (C3) CHECK nhánh kho trên bảng log dùng chung ----
push('\n-- (C3) CHECK khoá nhánh kho ở bảng log dùng chung: thêm lyhoa')
for (const k of await q(`select conrelid::regclass::text t, conname, pg_get_constraintdef(oid) d from pg_constraint where contype='c'
    and pg_get_constraintdef(oid) like '%''khtn''::text%' and conrelid::regclass::text not like 'khtn%'`)) {
  const [o] = await q(`select pg_get_userbyid(relowner) own from pg_class where oid = $1::regclass`, [k.t])
  ;(o.own === 'claude_build' ? L : E).push(`alter table public.${k.t} drop constraint ${k.conname};`,
    `alter table public.${k.t} add constraint ${k.conname} ${k.d.replace("'khtn'::text,", "'khtn'::text, 'lyhoa'::text,")};`)
}

// ---- (D) dạng chờ bản đồ cũ khối 10/11/12 ----
push(`\n-- (D) dạng chờ (câu nhập kho chưa phân dạng) — giống K07..K09 của KHTN
insert into public.lyhoa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
select 'L' || k || '000000', k, 'L' || k || '00', 'Chưa phân dạng', 'L' || k || '0000', 'Chưa phân dạng', 'Chưa phân dạng', 1, 'C',
       'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).'
  from unnest(array['10', '11', '12']) k;`)

fs.writeFileSync(out, L.join('\n') + '\n')
if (E.length) {
  if (!outEditor) throw new Error(`có ${E.length} khối thuộc owner postgres — truyền thêm đường dẫn file SQL Editor`)
  fs.writeFileSync(outEditor, `-- ============================================================================
-- Môn LÝ HÓA đợt 2 — PHẦN CHẠY Ở SUPABASE SQL EDITOR (đối tượng thuộc owner postgres, claude_build không thay được)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_kho.mjs. Chạy SAU file *_mon_ly_hoa_kho_ban_do.sql. Chỉ chèn nhánh 'lyhoa', không mất gì.
-- create or replace giữ nguyên ACL cũ của hàm (không thêm anon).
-- ============================================================================
` + E.join('\n') + '\n')
  console.log('OK ->', outEditor, `(${E.length} khối)`)
}
await c.end()
console.log('OK ->', out, `(${L.length} khối)`)
for (const x of canh) console.log('⚠', x)
// soát: còn chữ khtn/'K..' nào lọt trong phần nhân bản?
const txt = L.join('\n')
const lot = [...txt.matchAll(/'K[A-Z]{0,3}'/g)].map((m) => m[0])
if (lot.length) console.log('⚠ còn tiền tố K trong file:', [...new Set(lot)].join(' '))
