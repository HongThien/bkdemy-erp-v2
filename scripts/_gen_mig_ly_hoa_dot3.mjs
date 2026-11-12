// Sinh migration "Lý hóa đợt 3 — tài liệu/giáo trình/ET · MT · BTVN · mastery/dashboard · báo cáo kỳ" TỪ DB ĐANG CHẠY (Thùy 12/11).
// Mỗi hàm/view: lấy định nghĩa đang chạy, CHỈ CHÈN nhánh Lý hóa cạnh nhánh KHTN (bảng lyhoa_* đã có từ mig 202611121511).
// Chạy: node scripts/_gen_mig_ly_hoa_dot3.mjs <file.sql>   (chỉ ĐỌC DB)
import pg from 'pg'
import fs from 'fs'

const out = process.argv[2]
if (!out) { console.error('thiếu đường dẫn file ra'); process.exit(1) }
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
  .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const L = [`-- ============================================================================
-- Môn LÝ HÓA, đợt 3 — tài liệu / giáo trình / ET · MT · BTVN · mastery & dashboard học tập · báo cáo kỳ (Thùy 12/11)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_dot3.mjs từ DB đang chạy — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO: các hàm dưới đang rẽ nhánh "KHTN ⇒ bảng khtn_*, còn lại ⇒ Toán". Môn Lý hóa (bảng lyhoa_* từ mig 202611121511)
--   rơi vào nhánh Toán: giáo trình/ET Lý hóa ra cây Toán, MT/BTVN không thấy câu, mastery không quy được dạng bài.
--   Mỗi chỗ CHỈ CHÈN nhánh Lý hóa song song nhánh KHTN; phần Toán/KHTN giữ nguyên từng chữ.
-- MẤT GÌ (Luật xoá): không mất gì — create or replace hàm (giữ chữ ký, ACL) + create or replace view (thêm 1 khối UNION ALL).
-- ============================================================================
set local check_function_bodies = off;
`]
const ep = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 100)); return s.replace(a, b) }
const epAll = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 100)); return s.replaceAll(a, b) }
async function va(ten, sua, args) {
  const rs = await q(`select p.oid, pg_get_userbyid(p.proowner) own, pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) a
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1`, [ten])
  const r = args === undefined ? (rs.length === 1 ? rs[0] : null) : rs.find((x) => x.a === args)
  if (!r) throw new Error(`${ten}(${args ?? ''}): ${rs.length} bản`)
  if (r.own !== 'claude_build') throw new Error(`${ten}: owner ${r.own}`)
  const goc = r.d.replace(/\r\n/g, '\n')   // thân hàm áp từ file Windows mang CRLF
  const d = sua(goc)
  if (d === goc) throw new Error(`${ten}: vá không đổi gì`)
  L.push(`-- ${ten}(${r.a})`, d + ';')
}
async function vaView(ten, sua) {
  const [r] = await q(`select pg_get_userbyid(relowner) own, pg_get_viewdef($1::text::regclass, true) d from pg_class where relname = $1::text`, [ten])
  if (r.own !== 'claude_build') throw new Error(`${ten}: owner ${r.own}`)
  const d = sua(r.d.replace(/;\s*$/, ''))
  L.push(`-- view ${ten}`, `create or replace view public.${ten} as\n${d};`)
}

// ---- mastery: quy lượt đo về ô (dạng bài) ----
await va('_do_o_quy', (d) => ep(d,
  "              when p_bdm then public._do_o_bdm(",
  "              when p_khtn_bdm and public._lyhoa_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._lyhoa_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- Lý hóa (12/11): cùng luật KHTN\n              when p_bdm then public._do_o_bdm("))

// ---- dashboard học tập: câu → dạng bài ----
await va('_dbht_cau', (d) => {
  d = ep(d, "  -- ĐẠI + HGT: dạng bài bản đồ mới",
    "  -- Lý hóa (12/11): như KHTN\n  lk as (\n    select k.kc, k.kd, k.bt_id, public._lyhoa_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o\n      from k\n     where (k.kc <> '' or k.kd <> '') and k.bt_id is null\n       and public._lyhoa_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))\n  ),\n  -- ĐẠI + HGT: dạng bài bản đồ mới")
  d = ep(d, "       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)\n",
    "       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)\n       and not exists (select 1 from lk where lk.kc = k.kc and lk.kd = k.kd and lk.bt_id is not distinct from k.bt_id)\n")
  d = ep(d, "      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id\n",
    "      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id\n    union all\n    select lk.kc, lk.kd, lk.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten\n      from lk join lyhoa_bdm_dang_bai db on db.id = lk.o join lyhoa_bdm_nhom n on n.id = db.nhom_id\n")
  return d
})

// ---- tài liệu / giáo trình / ET theo bản đồ mới ----
await va('_tl_bdm_cau_vi_tri', (d) => {
  const a = d.indexOf("  if p_mon = 'KHTN' then"); const b = d.indexOf("  raise exception 'Môn % chưa có bản đồ mới")
  if (a < 0 || b < 0) throw new Error('_tl_bdm_cau_vi_tri: không tách được khối KHTN')
  const khoi = d.slice(a, b)
  return d.slice(0, b) + khoi.replace("if p_mon = 'KHTN' then", "if p_mon = 'Lý hóa' then   -- 12/11: như KHTN").replace(/khtn_/g, 'lyhoa_') + d.slice(b)
}, 'p_khoi text, p_mon text')
await va('fn_tl_bdm_et_vi_tri', (d) => {
  d = ep(d, "     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m))",
    "     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m) and not exists (select 1 from lyhoa_cau_hoi k where k.ma_cau = m))")
  d = ep(d, "     and exists (select 1 from khtn_cau_hoi k where k.ma_cau = any (p_ma))\n",
    "     and exists (select 1 from khtn_cau_hoi k where k.ma_cau = any (p_ma))\n  union all\n  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'Lý hóa') x\n   where x.ma_cau = any (p_ma)\n     and exists (select 1 from lyhoa_cau_hoi k where k.ma_cau = any (p_ma))\n")
  return d
})
await va('fn_tl_bdm_cay_chon', (d) => ep(d, "case when p_nhanh = 'khtn' then 'KHTN' else 'Toán' end", "case when p_nhanh = 'khtn' then 'KHTN' when p_nhanh = 'lyhoa' then 'Lý hóa' else 'Toán' end"))
await va('fn_tl_bdm_et_ma_de', (d) => {
  d = ep(d, "    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3)) k",
    "    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all\n    select ma_cau, parent_ma_cau from lyhoa_cau_hoi where ma_cau in (select ma_cau from _et_vt3)) k")
  d = ep(d, "               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);",
    "               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma union all\n               select ma_cau, parent_ma_cau from lyhoa_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);")
  d = ep(d, "            from khtn_cau_hoi c where c.ma_cau = v.ma_cau\n",
    "            from khtn_cau_hoi c where c.ma_cau = v.ma_cau\n          union all\n          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from lyhoa_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)\n            from lyhoa_cau_hoi c where c.ma_cau = v.ma_cau\n")
  if (/khtn_cau_hoi/.test(d.replace(/lyhoa/g, '')) && (d.match(/khtn_cau_hoi/g) || []).length !== (d.match(/lyhoa_cau_hoi/g) || []).length) {
    throw new Error('fn_tl_bdm_et_ma_de: số chỗ khtn_cau_hoi ≠ lyhoa_cau_hoi — còn chỗ chưa vá')
  }
  return d
})
for (const v of ['tl_bdm_chu_de_v', 'tl_bdm_chuyen_de_v', 'tl_bdm_dang_bai_v', 'tl_bdm_nhom_v', 'tl_bdm_o_v']) {
  await vaView(v, (d) => {
    const i = d.lastIndexOf("UNION ALL\n SELECT 'KHTN'::text AS mon,")
    if (i < 0) throw new Error(v + ': không thấy khối KHTN')
    const khoi = d.slice(i)
    return d + '\n' + khoi.replace("'KHTN'::text", "'Lý hóa'::text").replace(/'khtn'::text/g, "'lyhoa'::text").replace(/khtn_/g, 'lyhoa_')
  })
}

// ---- MT: bảng kết quả theo chủ đề/chuyên đề (bản đồ cũ) ----
await va('fn_mt_bang_ket_qua', (d) => ep(d, "    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do\n",
  "    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do\n    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from lyhoa_ban_do\n"))

// ---- báo cáo kỳ: tên chủ đề/chuyên đề ----
await va('fn_bc_ky_tinh', (d) => {
  d = ep(d, "coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, dc.ten, dv.ma) as ten,\n           coalesce(kc.thu_tu, dc.thu_tu, 9999) as tt",
    "coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, lc.ten, dc.ten, dv.ma) as ten,\n           coalesce(kc.thu_tu, lc.thu_tu, dc.thu_tu, 9999) as tt")
  d = ep(d, "      left join khtn_bdm_chu_de kc on kc.id = dv.ma\n", "      left join khtn_bdm_chu_de kc on kc.id = dv.ma\n      left join lyhoa_bdm_chu_de lc on lc.id = dv.ma\n")
  d = ep(d, "coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, hmh.ten,", "coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, lch.ten, hmh.ten,")
  d = ep(d, "coalesce(ko.thu_tu, hmh.thu_tu,", "coalesce(ko.thu_tu, lo.thu_tu, hmh.thu_tu,")
  d = ep(d, "      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma\n", "      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma\n      left join lyhoa_bdm_chuyen_de lch on lch.id = dv.ma\n")
  d = ep(d, "      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de\n", "      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de\n      left join lyhoa_bdm_o lo on lo.chuyen_de_id = dv.ma and lo.chu_de_id = dv.chu_de\n")
  return d
})

// ---- BTVN ----
await va('_btvn_app_tu_dong', (d) => ep(d, "select q.dang_chinh from khtn_cau_hoi q where q.ma_cau = x.ma_cau union all",
  "select q.dang_chinh from khtn_cau_hoi q where q.ma_cau = x.ma_cau union all\n                                                 select q.dang_chinh from lyhoa_cau_hoi q where q.ma_cau = x.ma_cau union all"))
await va('fn_btvn_ai_du_lieu', (d) => {
  d = d.replace(/coalesce\(d\.(\w+), k\.(\w+)\)/g, 'coalesce(d.$1, k.$2, lh.$2)')
  return ep(d, "      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau\n",
    "      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau\n      left join lyhoa_cau_hoi lh on l.mon = 'Lý hóa' and lh.ma_cau = sp.ma_cau\n")
})
await vaView('v_btvn_dap_an', (d) => {
  d = d.replace(/COALESCE\(d\.(\w+), kk\.(\w+)\)/g, 'COALESCE(d.$1, kk.$2, lh.$2)')
  return ep(d, "     LEFT JOIN khtn_cau_hoi kk ON l.mon = 'KHTN'::text AND kk.ma_cau = sp.ma_cau",
    "     LEFT JOIN khtn_cau_hoi kk ON l.mon = 'KHTN'::text AND kk.ma_cau = sp.ma_cau\n     LEFT JOIN lyhoa_cau_hoi lh ON l.mon = 'Lý hóa'::text AND lh.ma_cau = sp.ma_cau")
})

// ---- game Đấu trường: ngưỡng giấy thấp theo môn ----
await va('_dtv_giay_thap', (d) => ep(d, "when 'KHTN' then 25", "when 'KHTN' then 25 when 'Lý hóa' then 25"))

fs.writeFileSync(out, L.join('\n') + '\n')
await c.end()
console.log('OK ->', out, `(${L.length} khối)`)
