// Sinh migration "TÁCH Lý hóa ⇒ 2 môn VẬT LÝ + HÓA HỌC" (Thùy 12/11: "lý 1 môn hóa 1 môn").
// Thay toàn bộ việc của 4 mig Lý hóa 202611121420/1511/1512/1535/1541 (đã áp): dựng 2 môn từ khuôn KHTN, đưa hàm/view dùng chung
// về BẢN GỐC trước Lý hóa rồi chèn nhánh 2 môn, cuối cùng gỡ bộ lyhoa_* (Thùy gật xoá 12/11 — chỉ có 3 dòng dạng chờ tự tạo).
// Chạy: node scripts/_gen_mig_vat_ly_hoa_hoc.mjs <file.sql> <file_sql_editor.sql> <thư mục bản gốc hàm>
//   thư mục bản gốc = pg_get_functiondef chụp NGAY TRƯỚC khi chèn Lý hóa (đã đối chiếu: khác DB chỉ ở phần Lý hóa).
import pg from 'pg'
import fs from 'fs'

const [out, outEditor, dirGoc] = process.argv.slice(2)
if (!out || !outEditor || !dirGoc) { console.error('cần: <file.sql> <file_sql_editor.sql> <thư mục bản gốc>'); process.exit(1) }
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
  .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// ── 2 MÔN (mỗi môn = 1 trung tâm, khuôn KHTN). P = chữ đầu mã gốc: L (Lý) · Q (Hóa — H đã là Hình). Đã dò mọi tiền tố đang dùng.
const S = [
  { mon: 'Vật lý', key: 'vatly', P: 'L' },
  { mon: 'Hóa học', key: 'hoahoc', P: 'Q' },
]
const MONS = S.map((x) => `'${x.mon}'`).join(', ')
const KEYS = S.map((x) => `'${x.key}'`).join(', ')
const per = (f) => S.map(f).join('')

const MA_TIEN_TO = ['KCUM', 'KCD', 'KCH', 'KDB', 'KNB', 'KG', 'KC']
function doi(s, x) {
  let t = s
  for (const p of MA_TIEN_TO) t = t.replaceAll(`'${p}'`, `'${x.P}${p.slice(1)}'`)
  t = t.replaceAll("'^K[0-9]", `'^${x.P}[0-9]`)
  t = t.replaceAll("'^' || 'K'", `'^' || '${x.P}'`)
  t = t.replace(/khtn/g, x.key)
  t = t.replaceAll("'KHTN'", `'${x.mon}'`)
  t = t.replace(/\bKHTN\b/g, x.mon)
  return t
}

const L = []; const E = []
const push = (...s) => L.push(...s)
push(`-- ============================================================================
-- TÁCH "Lý hóa" ⇒ 2 MÔN: VẬT LÝ + HÓA HỌC (Thùy 12/11: "lý 1 môn hóa 1 môn"; khối 10–12; "đặt sao cho không lẫn")
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_vat_ly_hoa_hoc.mjs — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202611121420/1511/1535/1541 dựng nhầm MỘT môn "Lý hóa". Ở cấp 3 KHTN tách thành Vật lý · Hóa học · Sinh học —
--   mỗi môn một trung tâm (§1.6). Tên đầy đủ "Vật lý"/"Hóa học" để không lẫn với PHÂN MÔN "Lý"/"Hóa" bên trong KHTN.
--   (A) Dựng vatly_* + hoahoc_* (bảng RỖNG, chuỗi, hàm, trigger, policy, quyền) từ khuôn KHTN. Mã gốc: Vật lý L…, Hóa học Q….
--   (B) Mọi hàm/view dùng chung: BẢN GỐC (trước Lý hóa) + chèn nhánh 2 môn cạnh nhánh KHTN. Lớp 2 môn chỉ khối 10–12.
--   (C) Gỡ bộ Lý hóa: 45 hàm *lyhoa*, 25 bảng lyhoa_* (rỗng trừ 3 dòng dạng chờ L10/L11/L12 do mig 1511 tự tạo), chuỗi lyhoa_*.
-- MẤT GÌ (Luật xoá — Thùy gật 12/11): chỉ bộ Lý hóa ở (C), không có dữ liệu người nhập (0 lớp/nhân sự/phân công/phiên/sổ tay).
--   Bảng bị gỡ bằng DROP thường (không CASCADE) — còn gì bám vào là migration hỏng, không âm thầm kéo theo.
-- ============================================================================
set local check_function_bodies = off;
`)

// ═════════════ (A) DỰNG 2 MÔN TỪ KHUÔN KHTN (đọc khtn_* ở DB — không bị Lý hóa đụng tới) ═════════════
const seqs = await q(`select c.relname, s.seqtypid::regtype::text typ from pg_class c join pg_namespace n on n.oid=c.relnamespace
  join pg_sequence s on s.seqrelid=c.oid where n.nspname='public' and c.relkind='S' and c.relname like 'khtn%' order by 1`)
const tbls = await q(`select c.oid, c.relname, c.relrowsecurity rls, c.relforcerowsecurity f from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' and c.relname like 'khtn%' order by 1`)
const cons = await q(`select conrelid::regclass::text t, conname, contype, pg_get_constraintdef(oid) d from pg_constraint
  where conrelid in (select oid from pg_class where relname like 'khtn%' and relkind='r') and contype in ('c','f') order by contype, 1, 2`)
const fns = await q(`select p.oid, p.proname, pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) args
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like '%khtn%' and p.prokind='f' order by 1`)
const trgs = await q(`select pg_get_triggerdef(t.oid) d from pg_trigger t where not tgisinternal and tgrelid in (select oid from pg_class where relname like 'khtn%' and relkind='r') order by 1`)
const quyenBang = async (oid) => q(`select grantee::regrole::text gr, privilege_type pr from (select (aclexplode(relacl)).* from pg_class where oid=$1) a
  where grantee <> 0 and grantee <> (select relowner from pg_class where oid=$1)`, [oid])
const quyenHam = async (oid, ten, args) => {
  const r = [`revoke all on function public.${ten}(${args}) from public;`, `revoke all on function public.${ten}(${args}) from anon;`]
  for (const g of await q(`select grantee::regrole::text gr from (select (aclexplode(proacl)).* from pg_proc where oid=$1) a
      where grantee <> 0 and grantee <> (select proowner from pg_proc where oid=$1) and privilege_type='EXECUTE'`, [oid])) {
    if (g.gr !== 'anon') r.push(`grant execute on function public.${ten}(${args}) to ${g.gr};`)
  }
  const [p] = await q(`select exists (select 1 from (select (aclexplode(proacl)).* from pg_proc where oid=$1) a where grantee=0) x, (select proacl is null from pg_proc where oid=$1) md`, [oid])
  if (p.md || p.x) r.push(`grant execute on function public.${ten}(${args}) to authenticated;`)
  return r
}
for (const x of S) {
  push(`\n-- ════ (A) MÔN ${x.mon.toUpperCase()} — bảng ${x.key}_*, mã ${x.P}… ════`)
  for (const s of seqs) push(`create sequence public.${doi(s.relname, x)} as ${s.typ};`)
  for (const t of tbls) {
    push(`create table public.${doi(t.relname, x)} (like public.${t.relname} including defaults including identity including generated including indexes including comments including storage);`)
    for (const d of await q(`select a.attname, pg_get_expr(ad.adbin, ad.adrelid) e from pg_attrdef ad join pg_attribute a on a.attrelid=ad.adrelid and a.attnum=ad.adnum
        where ad.adrelid=$1 and a.attgenerated=''`, [t.oid])) {
      if (doi(d.e, x) !== d.e) push(`alter table public.${doi(t.relname, x)} alter column ${d.attname} set default ${doi(d.e, x)};`)
    }
  }
  for (const r of await q(`select s.relname seq, t.relname tbl, a.attname col from pg_depend d join pg_class s on s.oid=d.objid and s.relkind='S'
      join pg_class t on t.oid=d.refobjid join pg_attribute a on a.attrelid=t.oid and a.attnum=d.refobjsubid
      where d.deptype='a' and s.relname like 'khtn%' and t.relname like 'khtn%'`)) push(`alter sequence public.${doi(r.seq, x)} owned by public.${doi(r.tbl, x)}.${r.col};`)
  for (const k of cons) push(`alter table public.${doi(k.t, x)} add constraint ${doi(k.conname, x)} ${doi(k.d, x)};`)
  for (const t of tbls) {
    if (t.rls) push(`alter table public.${doi(t.relname, x)} enable row level security;`)
    if (t.f) push(`alter table public.${doi(t.relname, x)} force row level security;`)
    for (const p of await q(`select polname, polpermissive, polcmd, pg_get_expr(polqual, polrelid) u, pg_get_expr(polwithcheck, polrelid) w,
        array(select case when r=0 then 'public' else quote_ident(rolname) end from unnest(polroles) r left join pg_roles ro on ro.oid=r) roles
        from pg_policy where polrelid=$1`, [t.oid])) {
      if (p.polname === 'claude_ro_select') continue
      const cmd = { r: 'select', a: 'insert', w: 'update', d: 'delete', '*': 'all' }[p.polcmd]
      push(`create policy ${JSON.stringify(doi(p.polname, x))} on public.${doi(t.relname, x)} as ${p.polpermissive ? 'permissive' : 'restrictive'} for ${cmd} to ${p.roles.join(', ')}`
        + (p.u ? ` using (${doi(p.u, x)})` : '') + (p.w ? ` with check (${doi(p.w, x)})` : '') + ';')
    }
    for (const g of await quyenBang(t.oid)) push(`grant ${g.pr} on public.${doi(t.relname, x)} to ${g.gr};`)
  }
  for (const s of seqs) {
    for (const g of await q(`select grantee::regrole::text gr, privilege_type pr from (select (aclexplode(relacl)).* from pg_class where relname=$1) a
        where grantee <> 0 and grantee <> (select relowner from pg_class where relname=$1)`, [s.relname])) push(`grant ${g.pr} on sequence public.${doi(s.relname, x)} to ${g.gr};`)
  }
  for (const f of fns) { push(doi(f.d, x) + ';'); push(...await quyenHam(f.oid, doi(f.proname, x), doi(f.args, x))) }
  for (const g of trgs) push(doi(g.d, x) + ';')
  push(`insert into public.${x.key}_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
select '${x.P}' || k || '000000', k, '${x.P}' || k || '00', 'Chưa phân dạng', '${x.P}' || k || '0000', 'Chưa phân dạng', 'Chưa phân dạng', 1, 'C',
       'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).'
  from unnest(array['10', '11', '12']) k;   -- dạng chờ, như K07..K09 của KHTN`)
}

// ═════════════ (B) HÀM / VIEW DÙNG CHUNG: bản gốc + nhánh 2 môn ═════════════
push('\n-- ════ (B) hàm dùng chung: BẢN GỐC (trước Lý hóa) + nhánh Vật lý, Hóa học ════')
const ep = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 110)); return s.replace(a, b) }
const epAll = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 110)); return s.replaceAll(a, b) }
const sau = (d, a, f) => ep(d, a, a + per(f))
const truoc = (d, a, f) => ep(d, a, per(f) + a)
const daVa = new Set()
async function va(ten, sua) {
  const [r] = await q(`select pg_get_userbyid(p.proowner) own from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1`, [ten])
  if (!r) throw new Error(ten + ': không có ở DB')
  const goc = fs.readFileSync(`${dirGoc}/${ten}.sql`, 'utf8').replace(/\r\n/g, '\n')
  const d = sua(goc)
  if (d === goc) throw new Error(`${ten}: vá không đổi gì`)
  for (const x of S) if (!d.includes(x.key) && !d.includes(x.mon)) throw new Error(`${ten}: thiếu nhánh ${x.mon}`)
  ;(r.own === 'claude_build' ? L : E).push(`-- ${ten}`, d + ';')
  daVa.add(ten)
}
async function vaView(ten, sua) {
  const [r] = await q(`select pg_get_userbyid(relowner) own, pg_get_viewdef($1::text::regclass, true) d from pg_class where relname = $1::text`, [ten])
  if (r.own !== 'claude_build') throw new Error(ten + ': owner ' + r.own)
  const d = sua(r.d.replace(/\r\n/g, '\n').replace(/;\s*$/, ''))
  if (/lyhoa|Lý hóa/.test(d)) throw new Error(ten + ': còn dấu Lý hóa')
  push(`-- view ${ten}`, `create or replace view public.${ten} as\n${d};`)
  daVa.add(ten)
}

// lớp: 2 môn chỉ khối 10–12 (registry _mon_khoi_hop_le — bản gốc chỉ có TSA)
push(`-- _mon_khoi_hop_le
create or replace function public._mon_khoi_hop_le(p_mon text, p_khoi text)
 returns boolean language sql immutable
as $function$
  select case
    when p_mon = 'TSA' then p_khoi = '12'
    when p_mon in (${MONS}) then p_khoi in ('10', '11', '12') -- Thùy 12/11: Vật lý · Hóa học = môn cấp 3
    else true end
$function$;`)

// ---- kho (đợt 2 cũ) ----
for (const ten of ['_kho_ban_do_tbl', '_kho_cau_tbl', '_kho_form_dien_tbl', '_kho_form_tn_tbl', '_kho_lt_tbl']) {
  await va(ten, (d) => {
    const m = d.match(/\n(\s*)select case when p_mon = 'KHTN' then 'khtn_(\w+)'/)
    if (!m) throw new Error(ten)
    return d.replace(m[0], m[0] + per((x) => `\n${m[1]}            when p_mon = '${x.mon}' then '${x.key}_${m[2]}'`))
  })
}
await va('_kho_muc_do_dang', (d) => truoc(d, "  elsif p_mon = 'Tiếng Anh' then", (x) => `  elsif p_mon = '${x.mon}' then\n    select muc_do into v_md from ${x.key}_ban_do where ma_dang = p_ma_dang;\n`))
await va('_kho_nhanh_cua_dang', (d) => epAll(d, "not in ('KHTN', ", `not in ('KHTN', ${MONS}, `))
await va('_kho_dang_cho', (d) => sau(d, "when 'khtn' then 'K'", (x) => ` when '${x.key}' then '${x.P}'`))
await va('fn_kho_tbl', (d) => sau(d, "when 'khtn' then 'khtn'", (x) => ` when '${x.key}' then '${x.key}'`))
await va('count_cau_by_dang', (d) => sau(d, "'khtn_cau_hoi', ", (x) => `'${x.key}_cau_hoi', `))
await va('_mcq_kiem_kho', (d) => ep(ep(d, "('dai', 'khtn', 'hgt')", `('dai', 'khtn', ${KEYS}, 'hgt')`), 'dai/khtn/hgt', `dai/khtn/${S.map((x) => x.key).join('/')}/hgt`))
await va('fn_kho_doi_dang_tk', (d) => ep(d, "('dai', 'hgt', 'khtn')", `('dai', 'hgt', 'khtn', ${KEYS})`))
await va('fn_kho_sua_tk', (d) => ep(d, "('dai', 'hgt', 'khtn')", `('dai', 'hgt', 'khtn', ${KEYS})`))
await va('_bdm_tu_duyet_sau_gan', (d) => sau(d, "when tg_table_name like 'khtn%' then 'khtn_cau_hoi'", (x) => `\n                            when tg_table_name like '${x.key}%' then '${x.key}_cau_hoi'`))
await va('_trg_chan_duyet_dang_cho', (d) => truoc(d, "    end if;\n    raise exception 'Chưa phân dạng", (x) => `    elsif tg_table_name = '${x.key}_cau_hoi' then   -- như KHTN\n      if exists (select 1 from ${x.key}_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;\n`))
await va('_bdm_dang_bai_cua_mon', (d) => sau(d, "   where public._kho_ban_do_tbl(p_mon, null) = 'khtn_ban_do' and d.id = any(p_ma)",
  (x) => `\n  union all\n  select d.id, '${x.key}', d.muc_do::smallint\n    from ${x.key}_bdm_dang_bai d\n   where public._kho_ban_do_tbl(p_mon, null) = '${x.key}_ban_do' and d.id = any(p_ma)`))
await va('fn_bdm_nhap_cau', (d) => {
  d = ep(d, "t not in ('dai', 'hgt', 'khtn')", `t not in ('dai', 'hgt', 'khtn', ${KEYS})`)
  d = ep(d, "if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))\n     or (t <> 'khtn' and",
    "if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))\n"
    + per((x) => `     or (t = '${x.key}' and not exists (select 1 from ${x.key}_bdm_chu_de where khoi = p_khoi))\n`) + `     or (t not in ('khtn', ${KEYS}) and`)
  d = ep(d, "if p_chu_de is not null and t <> 'khtn' then", `if p_chu_de is not null and t not in ('khtn', ${KEYS}) then`)
  return truoc(d, "  elsif p_dang_bai is not null then", (x) => `  elsif p_dang_bai is not null and t = '${x.key}' then\n    perform public._${x.key}_bdm_gan(v_ma, p_dang_bai, 'nguoi');\n`)
})
await va('fn_giaibai_mon', (d) => sau(d, "case when p_nhanh = 'khtn' then 'KHTN'", (x) => ` when p_nhanh = '${x.key}' then '${x.mon}'`))
await va('fn_giaibai_src', (d) => sau(d, "when 'khtn' then 'khtn_cau_hoi'", (x) => ` when '${x.key}' then '${x.key}_cau_hoi'`))
await va('fn_giaibai_tbl', (d) => sau(d, "when 'khtn' then 'khtn_cau_hoi_yeu_cau_giai'", (x) => ` when '${x.key}' then '${x.key}_cau_hoi_yeu_cau_giai'`))
for (const ten of ['fn_giaibai_duyet', 'fn_giaibai_nhan']) await va(ten, (d) => epAll(d, "('toan','khtn','hgt')", `('toan','khtn',${S.map((x) => `'${x.key}',`).join('')}'hgt')`))
await va('fn_giaibai_dem_cho_ai', (d) => {
  const m = d.match(/\n(\s*)(select 'khtn', count\(\*\) from khtn_cau_hoi [^\n]*)\n\s*union all/)
  if (!m) throw new Error('fn_giaibai_dem_cho_ai')
  return d.replace(m[0], m[0] + per((x) => `\n${m[1]}${doi(m[2], x)}\n${m[1]}union all`))
})
for (const v of ['v_giaibai_bai', 'v_giaibai_hoan_thien', 'v_giaibai_nhan']) {
  await vaView(v, (d) => {
    const parts = d.split(/\n(\s*)UNION ALL\n/)
    const blocks = []; const ind = []
    for (let i = 0; i < parts.length; i++) (i % 2 === 0 ? blocks : ind).push(parts[i])
    const kLy = blocks.findIndex((b) => /'lyhoa'::text/.test(b))
    const kKh = blocks.findIndex((b) => /'khtn'::text/.test(b) && !/'toan'::text/.test(b))
    if (kLy < 0 || kKh < 0) throw new Error(v + ': không tách được khối')
    blocks.splice(kLy, 1, ...S.map((x) => doi(blocks[kKh], x)))
    ind.splice(kLy, 0, ...S.slice(1).map(() => ind[kLy - 1]))
    let r = blocks[0]
    for (let i = 1; i < blocks.length; i++) r += `\n${ind[i - 1]}UNION ALL\n` + blocks[i]
    return r
  })
}

// ---- tài liệu / ET / MT / BTVN / mastery / báo cáo (đợt 3 cũ) ----
await va('_do_o_quy', (d) => truoc(d, "              when p_bdm then public._do_o_bdm(",
  (x) => `              when p_khtn_bdm and public._${x.key}_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._${x.key}_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- như KHTN\n`))
await va('_dbht_cau', (d) => {
  d = truoc(d, "  -- ĐẠI + HGT: dạng bài bản đồ mới", (x) => `  -- ${x.mon} (12/11): như KHTN\n  k_${x.key} as (\n    select k.kc, k.kd, k.bt_id, public._${x.key}_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o\n      from k\n     where (k.kc <> '' or k.kd <> '') and k.bt_id is null\n       and public._${x.key}_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))\n  ),\n`)
  d = sau(d, "       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)\n",
    (x) => `       and not exists (select 1 from k_${x.key} z where z.kc = k.kc and z.kd = k.kd and z.bt_id is not distinct from k.bt_id)\n`)
  return sau(d, "      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id\n",
    (x) => `    union all\n    select z.kc, z.kd, z.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten\n      from k_${x.key} z join ${x.key}_bdm_dang_bai db on db.id = z.o join ${x.key}_bdm_nhom n on n.id = db.nhom_id\n`)
})
await va('_tl_bdm_cau_vi_tri', (d) => {
  const a = d.indexOf("  if p_mon = 'KHTN' then"); const b = d.indexOf("  raise exception 'Môn % chưa có bản đồ mới")
  if (a < 0 || b < 0) throw new Error('_tl_bdm_cau_vi_tri')
  return d.slice(0, b) + per((x) => doi(d.slice(a, b), x)) + d.slice(b)
})
await va('fn_tl_bdm_et_vi_tri', (d) => {
  d = ep(d, "     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m))",
    "     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m)" + per((x) => ` and not exists (select 1 from ${x.key}_cau_hoi k where k.ma_cau = m)`) + ')')
  return sau(d, "     and exists (select 1 from khtn_cau_hoi k where k.ma_cau = any (p_ma))\n",
    (x) => `  union all\n  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, '${x.mon}') x\n   where x.ma_cau = any (p_ma)\n     and exists (select 1 from ${x.key}_cau_hoi k where k.ma_cau = any (p_ma))\n`)
})
await va('fn_tl_bdm_cay_chon', (d) => sau(d, "case when p_nhanh = 'khtn' then 'KHTN'", (x) => ` when p_nhanh = '${x.key}' then '${x.mon}'`))
await va('fn_tl_bdm_et_ma_de', (d) => {
  d = ep(d, "    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3)) k",
    "    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3)" + per((x) => ` union all\n    select ma_cau, parent_ma_cau from ${x.key}_cau_hoi where ma_cau in (select ma_cau from _et_vt3)`) + ') k')
  d = ep(d, "               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);",
    "               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma" + per((x) => ` union all\n               select ma_cau, parent_ma_cau from ${x.key}_cau_hoi where ma_cau = b.ma`) + ') x limit 1), b.ma);')
  d = sau(d, "            from khtn_cau_hoi c where c.ma_cau = v.ma_cau\n",
    (x) => `          union all\n          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from ${x.key}_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)\n            from ${x.key}_cau_hoi c where c.ma_cau = v.ma_cau\n`)
  for (const x of S) if ((d.match(/khtn_cau_hoi/g) || []).length !== (d.match(new RegExp(x.key + '_cau_hoi', 'g')) || []).length) throw new Error('fn_tl_bdm_et_ma_de: lệch số chỗ ' + x.key)
  return d
})
for (const v of ['tl_bdm_chu_de_v', 'tl_bdm_chuyen_de_v', 'tl_bdm_dang_bai_v', 'tl_bdm_nhom_v', 'tl_bdm_o_v']) {
  await vaView(v, (d) => {
    const iLy = d.lastIndexOf("\nUNION ALL\n SELECT 'Lý hóa'::text AS mon,")
    if (iLy < 0) throw new Error(v + ': không thấy khối Lý hóa')
    d = d.slice(0, iLy)
    const i = d.lastIndexOf("UNION ALL\n SELECT 'KHTN'::text AS mon,")
    if (i < 0) throw new Error(v + ': không thấy khối KHTN')
    return d + per((x) => '\n' + doi(d.slice(i), x))
  })
}
await va('fn_mt_bang_ket_qua', (d) => sau(d, "    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do\n",
  (x) => `    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from ${x.key}_ban_do\n`))
await va('fn_bc_ky_tinh', (d) => {
  const a = (x, s) => `${x.key}_${s}`
  d = ep(d, "coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, dc.ten, dv.ma) as ten,\n           coalesce(kc.thu_tu, dc.thu_tu, 9999) as tt",
    `coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, ${S.map((x) => a(x, 'cd') + '.ten').join(', ')}, dc.ten, dv.ma) as ten,\n           coalesce(kc.thu_tu, ${S.map((x) => a(x, 'cd') + '.thu_tu').join(', ')}, dc.thu_tu, 9999) as tt`)
  d = sau(d, "      left join khtn_bdm_chu_de kc on kc.id = dv.ma\n", (x) => `      left join ${x.key}_bdm_chu_de ${a(x, 'cd')} on ${a(x, 'cd')}.id = dv.ma\n`)
  d = ep(d, "coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, hmh.ten,", `coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, ${S.map((x) => a(x, 'ch') + '.ten').join(', ')}, hmh.ten,`)
  d = ep(d, "coalesce(ko.thu_tu, hmh.thu_tu,", `coalesce(ko.thu_tu, ${S.map((x) => a(x, 'o') + '.thu_tu').join(', ')}, hmh.thu_tu,`)
  d = sau(d, "      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma\n", (x) => `      left join ${x.key}_bdm_chuyen_de ${a(x, 'ch')} on ${a(x, 'ch')}.id = dv.ma\n`)
  return sau(d, "      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de\n", (x) => `      left join ${x.key}_bdm_o ${a(x, 'o')} on ${a(x, 'o')}.chuyen_de_id = dv.ma and ${a(x, 'o')}.chu_de_id = dv.chu_de\n`)
})
await va('_btvn_app_tu_dong', (d) => sau(d, "select q.dang_chinh from khtn_cau_hoi q where q.ma_cau = x.ma_cau union all\n",
  (x) => `                                                 select q.dang_chinh from ${x.key}_cau_hoi q where q.ma_cau = x.ma_cau union all\n`))
await va('fn_btvn_ai_du_lieu', (d) => {
  d = d.replace(/coalesce\(d\.(\w+), k\.(\w+)\)/g, (_, a, b) => `coalesce(d.${a}, k.${b}${S.map((x) => `, ${x.key}.${b}`).join('')})`)
  return sau(d, "      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau\n", (x) => `      left join ${x.key}_cau_hoi ${x.key} on l.mon = '${x.mon}' and ${x.key}.ma_cau = sp.ma_cau\n`)
})
await vaView('v_btvn_dap_an', (d) => {
  d = ep(d, "\n     LEFT JOIN lyhoa_cau_hoi lh ON l.mon = 'Lý hóa'::text AND lh.ma_cau = sp.ma_cau", '')
  d = d.replace(/COALESCE\(d\.(\w+), kk\.(\w+), lh\.\w+\)/g, (_, a, b) => `COALESCE(d.${a}, kk.${b}${S.map((x) => `, ${x.key}.${b}`).join('')})`)
  return sau(d, "     LEFT JOIN khtn_cau_hoi kk ON l.mon = 'KHTN'::text AND kk.ma_cau = sp.ma_cau",
    (x) => `\n     LEFT JOIN ${x.key}_cau_hoi ${x.key} ON l.mon = '${x.mon}'::text AND ${x.key}.ma_cau = sp.ma_cau`)
})
await va('_dtv_giay_thap', (d) => sau(d, "when 'KHTN' then 25", (x) => ` when '${x.mon}' then 25`))

// ---- app HS · phiên Claude · trợ lý (đợt 4 cũ) ----
await va('_kho_co_mon', (d) => ep(d, "('Toán', 'KHTN', 'Tiếng Anh', 'TSA')", `('Toán', 'KHTN', ${MONS}, 'Tiếng Anh', 'TSA')`))
await va('_phien_kho_mon', (d) => ep(d, "array['Toán', 'KHTN']", `array['Toán', 'KHTN', ${MONS}]`))
await va('_phien_bdm_bang', (d) => ep(d, "    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false)\n",
  "    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false)" + per((x) => `,\n    ('${x.mon}', '${x.key}_bdm_', 'fn_${x.key}_bdm_', false)`) + '\n'))
await va('_phien_bd_kiem_khoi', (d) => sau(d, "case when p_bang = 'khtn_bdm_' then 'KHTN'", (x) => ` when p_bang = '${x.key}_bdm_' then '${x.mon}'`))
await va('_phien_kho_nhanh_ds', (d) => ep(d, "'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn')\n",
  "'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn')" + per((x) => `,\n    ('${x.key}', '${x.key}_cau_hoi', '${x.key}_ban_do', '${x.key}_bdm_gan_cau', '${x.key}_bdm_de_xuat', '${x.key}_bdm_cau_thieu_dang', '${x.key}_bdm_kiem_mau', '${x.key}')`) + '\n'))
const MON_CUA = (e) => `(case ${e} when 'khtn' then 'KHTN'${per((x) => ` when '${x.key}' then '${x.mon}'`)} else 'Toán' end)`
await va('_phien_kho_cau', (d) => ep(d, "if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then continue; end if;", `if ${MON_CUA('r.nhanh')} <> p_p.mon then continue; end if;   -- 12/11: mỗi môn đúng bảng của môn`))
await va('_phien_kho_phan1', (d) => {
  d = ep(d, "if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then raise exception", `if ${MON_CUA('r.nhanh')} <> p_p.mon then raise exception`)
  d = truoc(d, "  elsif p_ket_qua in ('cao', 'vua') then\n    select cd.id into v_cd\n      from dai_bdm_dang_bai",
    (x) => `  elsif p_ket_qua in ('cao', 'vua') and r.nhanh = '${x.key}' then\n    select cd.id into v_cd\n      from ${x.key}_bdm_dang_bai d join ${x.key}_bdm_nhom n on n.id = d.nhom_id join ${x.key}_bdm_chu_de cd on cd.id = n.chu_de_id\n     where d.id = p_dang_bai and cd.khoi = p_p.khoi;\n    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ ${x.mon} khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;\n`)
  d = sau(d, "      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)\n",
    (x) => `    elsif r.nhanh = '${x.key}' then\n      perform public._${x.key}_bdm_gan(p_ma_cau, p_dang_bai, 'ai');\n`)
  return sau(d, "      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;\n",
    (x) => `      elsif r.nhanh = '${x.key}' then select cd.id into v_cd from ${x.key}_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;\n`)
})
await va('fn_phien_kho_dang', (d) => truoc(d, "  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);",
  (x) => `  if v_p.mon = '${x.mon}' then\n    perform public._phien_bd_kiem_khoi('${x.key}_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);\n    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_${x.key}_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);\n  end if;\n`))
await va('fn_phien_kho_hang', (d) => truoc(d, "  return public.fn_bdm_khop_hang(", (x) => `  if v_p.mon = '${x.mon}' then return public.fn_${x.key}_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;\n`))
await va('fn_phien_kho_tong', (d) => sau(d, "case when v_p.mon = 'KHTN' then public.fn_khtn_bdm_khop_dem(v_p.khoi)", (x) => ` when v_p.mon = '${x.mon}' then public.fn_${x.key}_bdm_khop_dem(v_p.khoi)`))
await va('fn_phien_kho_duyet', (d) => sau(d, "case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau']", (x) => ` when v_p.mon = '${x.mon}' then array['${x.key}_bdm_gan_cau']`))
await va('fn_phien_kho_them', (d) => {
  d = sau(d, "case when v_p.mon = 'KHTN' then 'khtn'", (x) => ` when v_p.mon = '${x.mon}' then '${x.key}'`)
  d = ep(d, "      if v_p.mon <> 'KHTN' and v_nh not in",
    per((x) => `      if v_p.mon = '${x.mon}' and v_nh <> '${x.key}' then raise exception 'Phiên ${x.mon}: nhanh phải là ${x.key}.'; end if;\n`) + `      if v_p.mon not in ('KHTN', ${MONS}) and v_nh not in`)
  return d
})
await va('fn_phien_bd_ghi', (d) => d.replace(/case when b = 'khtn_bdm_' then '((?:fn_)?)khtn_bdm_(\w+)' else/g,
  (_, f, t) => `case when b = 'khtn_bdm_' then '${f}khtn_bdm_${t}'${per((x) => ` when b = '${x.key}_bdm_' then '${f}${x.key}_bdm_${t}'`)} else`))
await va('_troly_ten_dang', (d) => ep(d, "('KHTN', null))", "('KHTN', null)" + per((x) => `, ('${x.mon}', null)`) + ')'))
await va('fn_troly_danh_muc', (d) => epAll(d, '"enum":["Toán","Văn","Anh","KHTN"]', `"enum":["Toán","Văn","Anh","KHTN",${S.map((x) => `"${x.mon}"`).join(',')}]`))

// hàm dùng chung còn mang dấu Lý hóa mà chưa vá ⇒ dừng
const sot = (await q(`select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
  and p.proname not like '%lyhoa%' and (p.prosrc like '%lyhoa%' or p.prosrc like '%Lý hóa%')`)).map((r) => r.proname).filter((n) => !daVa.has(n) && n !== '_mon_khoi_hop_le')
if (sot.length) throw new Error('Còn hàm mang dấu Lý hóa chưa xử lý: ' + sot.join(' '))

// ---- CHECK khoá nhánh / nhãn môn ----
push('\n-- ════ CHECK: thay Lý hóa bằng 2 môn ════')
for (const k of await q(`select conrelid::regclass::text t, conname, pg_get_constraintdef(oid) d, pg_get_userbyid((select relowner from pg_class where oid=conrelid)) own
    from pg_constraint where contype='c' and (pg_get_constraintdef(oid) like '%''lyhoa''::text%' or pg_get_constraintdef(oid) like '%''Lý hóa''::text%')`)) {
  const moi = k.d.replace("'lyhoa'::text", S.map((x) => `'${x.key}'::text`).join(', ')).replace("'Lý hóa'::text", S.map((x) => `'${x.mon}'::text`).join(', '))
  ;(k.own === 'claude_build' ? L : E).push(`alter table public.${k.t} drop constraint ${k.conname};`, `alter table public.${k.t} add constraint ${k.conname} ${moi};`)
}

// ═════════════ (C) GỠ BỘ LÝ HÓA (Thùy gật 12/11) ═════════════
push('\n-- ════ (C) gỡ bộ Lý hóa — DROP thường, không CASCADE ════')
const fLy = await q(`select p.proname, pg_get_function_identity_arguments(p.oid) a from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like '%lyhoa%' order by 1`)
const tLy = await q(`select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='r' and relname like 'lyhoa%' order by 1`)
const sLy = await q(`select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='S' and relname like 'lyhoa%' order by 1`)
push(`drop table ${tLy.map((t) => 'public.' + t.relname).join(', ')};`)
for (const f of fLy) push(`drop function public.${f.proname}(${f.a});`)
push(...sLy.map((s) => `drop sequence if exists public.${s.relname};`))
push(`delete from public.tl_bdm_dem_luu where mon = 'Lý hóa';   -- bản đếm lưu sẵn (nếu ai đã mở bộ chọn giáo trình Lý hóa)`)

fs.writeFileSync(out, L.join('\n') + '\n')
fs.writeFileSync(outEditor, `-- ============================================================================
-- TÁCH Lý hóa ⇒ Vật lý + Hóa học — PHẦN CHẠY Ở SUPABASE SQL EDITOR (owner postgres, claude_build không thay được)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_vat_ly_hoa_hoc.mjs. Chạy SAU file *_tach_ly_hoa_vat_ly_hoa_hoc.sql. Project ERP: osrvycilwshkzhljuxef.
-- Bản gốc trước Lý hóa + nhánh 2 môn. create or replace giữ ACL cũ của hàm. Không mất dữ liệu.
-- ============================================================================
${E.join('\n')}
`)
await c.end()
console.log('OK ->', out, `(${L.length} khối) ·`, outEditor, `(${E.length} khối) · gỡ: ${tLy.length} bảng, ${fLy.length} hàm, ${sLy.length} chuỗi`)
