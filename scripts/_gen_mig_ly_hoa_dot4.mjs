// Sinh migration "Lý hóa đợt 4 — app HS (mở kho), phiên Claude / phòng trưởng khối, trợ lý" TỪ DB ĐANG CHẠY (Thùy 12/11).
// Mỗi hàm: lấy định nghĩa đang chạy, CHỈ CHÈN nhánh Lý hóa cạnh nhánh KHTN.
// Chạy: node scripts/_gen_mig_ly_hoa_dot4.mjs <file.sql>   (chỉ ĐỌC DB)
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
-- Môn LÝ HÓA, đợt 4 — app học sinh (mở kho) · phiên Claude / phòng trưởng khối · trợ lý (Thùy 12/11)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_dot4.mjs từ DB đang chạy — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   (1) _kho_co_mon: cổng "môn có kho" của app HS (thanh chọn môn, tự luyện, sổ tay…) — thêm Lý hóa. Lớp Lý hóa chỉ khối 10–12
--       (_mon_khoi_hop_le, mig 202611121420) nên chỉ em khối 10–12 có lớp Lý hóa mới thấy.
--   (2) Phiên Claude (spec-phong-truong-khoi.md): registry bảng bản đồ mới + nhánh kho + các hàm rẽ "KHTN ⇒ khtn_*, còn lại ⇒ Toán"
--       — thêm Lý hóa để trưởng khối Lý hóa mở phiên bản đồ / nhập kho như KHTN. Rào cứng giữ nguyên (đúng môn, đúng khối, không xoá).
--   (3) Trợ lý: tra tên dạng + enum môn trong danh mục công cụ.
-- MẤT GÌ (Luật xoá): không mất gì — create or replace hàm (giữ chữ ký, ACL).
-- ============================================================================
set local check_function_bodies = off;
`]
const ep = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 100)); return s.replace(a, b) }
const epAll = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 100)); return s.replaceAll(a, b) }
async function va(ten, sua) {
  const rs = await q(`select pg_get_userbyid(p.proowner) own, pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) a
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1`, [ten])
  if (rs.length !== 1) throw new Error(`${ten}: ${rs.length} bản`)
  if (rs[0].own !== 'claude_build') throw new Error(`${ten}: owner ${rs[0].own}`)
  const goc = rs[0].d.replace(/\r\n/g, '\n')
  const d = sua(goc)
  if (d === goc) throw new Error(`${ten}: vá không đổi gì`)
  L.push(`-- ${ten}(${rs[0].a})`, d + ';')
}
// nhánh kho ↔ môn (dùng trong các hàm phiên thay cho "(r.nhanh = 'khtn') <> (p_p.mon = 'KHTN')")
const MON_CUA_NHANH = (x) => `(case ${x} when 'khtn' then 'KHTN' when 'lyhoa' then 'Lý hóa' else 'Toán' end)`

// (1) app HS
await va('_kho_co_mon', (d) => ep(d, "('Toán', 'KHTN', 'Tiếng Anh', 'TSA')", "('Toán', 'KHTN', 'Lý hóa', 'Tiếng Anh', 'TSA')"))

// (2) phiên Claude
await va('_phien_kho_mon', (d) => ep(d, "array['Toán', 'KHTN']", "array['Toán', 'KHTN', 'Lý hóa']"))
await va('_phien_bdm_bang', (d) => ep(d, "    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false)\n", "    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false),\n    ('Lý hóa', 'lyhoa_bdm_', 'fn_lyhoa_bdm_', false)\n"))
await va('_phien_bd_kiem_khoi', (d) => ep(d, "case when p_bang = 'khtn_bdm_' then 'KHTN' else 'Toán' end", "case when p_bang = 'khtn_bdm_' then 'KHTN' when p_bang = 'lyhoa_bdm_' then 'Lý hóa' else 'Toán' end"))
await va('_phien_kho_nhanh_ds', (d) => ep(d, "'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn')\n",
  "'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn'),\n    ('lyhoa', 'lyhoa_cau_hoi', 'lyhoa_ban_do', 'lyhoa_bdm_gan_cau', 'lyhoa_bdm_de_xuat', 'lyhoa_bdm_cau_thieu_dang', 'lyhoa_bdm_kiem_mau', 'lyhoa')\n"))
await va('_phien_kho_cau', (d) => ep(d, "if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then continue; end if;", `if ${MON_CUA_NHANH('r.nhanh')} <> p_p.mon then continue; end if;   -- 12/11: mỗi môn đúng bảng của môn`))
await va('_phien_kho_phan1', (d) => {
  d = ep(d, "if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then raise exception", `if ${MON_CUA_NHANH('r.nhanh')} <> p_p.mon then raise exception`)
  // kiểm dạng bài đúng bản đồ môn một-vùng: KHTN / Lý hóa
  d = ep(d, "  elsif p_ket_qua in ('cao', 'vua') then\n    select cd.id into v_cd\n      from dai_bdm_dang_bai",
    "  elsif p_ket_qua in ('cao', 'vua') and r.nhanh = 'lyhoa' then\n    select cd.id into v_cd\n      from lyhoa_bdm_dang_bai d join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id\n     where d.id = p_dang_bai and cd.khoi = p_p.khoi;\n    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ Lý hóa khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;\n  elsif p_ket_qua in ('cao', 'vua') then\n    select cd.id into v_cd\n      from dai_bdm_dang_bai")
  d = ep(d, "      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)\n    else",
    "      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)\n    elsif r.nhanh = 'lyhoa' then\n      perform public._lyhoa_bdm_gan(p_ma_cau, p_dang_bai, 'ai');\n    else")
  d = ep(d, "      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;\n",
    "      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;\n      elsif r.nhanh = 'lyhoa' then select cd.id into v_cd from lyhoa_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;\n")
  if (/r\.nhanh = 'khtn'/.test(d.replace("p_ket_qua in ('cao', 'vua') and r.nhanh = 'khtn'", '').replace("    if r.nhanh = 'khtn' then\n      perform public._khtn_bdm_gan", '').replace("      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de", ''))) {
    throw new Error("_phien_kho_phan1: còn chỗ r.nhanh = 'khtn' chưa xử lý")
  }
  return d
})
await va('fn_phien_kho_dang', (d) => ep(d, "  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);",
  "  if v_p.mon = 'Lý hóa' then\n    perform public._phien_bd_kiem_khoi('lyhoa_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);\n    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_lyhoa_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);\n  end if;\n  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);"))
await va('fn_phien_kho_hang', (d) => ep(d, "  return public.fn_bdm_khop_hang(", "  if v_p.mon = 'Lý hóa' then return public.fn_lyhoa_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;\n  return public.fn_bdm_khop_hang("))
await va('fn_phien_kho_tong', (d) => ep(d, "case when v_p.mon = 'KHTN' then public.fn_khtn_bdm_khop_dem(v_p.khoi) else",
  "case when v_p.mon = 'KHTN' then public.fn_khtn_bdm_khop_dem(v_p.khoi) when v_p.mon = 'Lý hóa' then public.fn_lyhoa_bdm_khop_dem(v_p.khoi) else"))
await va('fn_phien_kho_duyet', (d) => ep(d, "case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau'] else",
  "case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau'] when v_p.mon = 'Lý hóa' then array['lyhoa_bdm_gan_cau'] else"))
await va('fn_phien_kho_them', (d) => {
  d = ep(d, "case when v_p.mon = 'KHTN' then 'khtn' else 'dai' end);", "case when v_p.mon = 'KHTN' then 'khtn' when v_p.mon = 'Lý hóa' then 'lyhoa' else 'dai' end);")
  d = ep(d, "      if v_p.mon <> 'KHTN' and v_nh not in", "      if v_p.mon = 'Lý hóa' and v_nh <> 'lyhoa' then raise exception 'Phiên Lý hóa: nhanh phải là lyhoa.'; end if;\n      if v_p.mon not in ('KHTN', 'Lý hóa') and v_nh not in")
  if (/v_p\.mon = 'KHTN'|v_nh = 'khtn'/.test(d.replace(/case when v_p\.mon = 'KHTN' then 'khtn'/, '').replace("if v_p.mon = 'KHTN' and v_nh <> 'khtn'", ''))) {
    throw new Error("fn_phien_kho_them: còn nhánh KHTN khác chưa xem — soát tay")
  }
  return d
})
await va('fn_phien_bd_ghi', (d) => d.replace(/case when b = 'khtn_bdm_' then '((?:fn_)?)khtn_bdm_(\w+)' else/g,
  "case when b = 'khtn_bdm_' then '$1khtn_bdm_$2' when b = 'lyhoa_bdm_' then '$1lyhoa_bdm_$2' else"))

// (3) trợ lý
await va('_troly_ten_dang', (d) => ep(d, "('KHTN', null))", "('KHTN', null), ('Lý hóa', null))"))
await va('fn_troly_danh_muc', (d) => epAll(d, '"enum":["Toán","Văn","Anh","KHTN"]', '"enum":["Toán","Văn","Anh","KHTN","Lý hóa"]'))

fs.writeFileSync(out, L.join('\n') + '\n')
await c.end()
console.log('OK ->', out, `(${L.length} khối)`)
