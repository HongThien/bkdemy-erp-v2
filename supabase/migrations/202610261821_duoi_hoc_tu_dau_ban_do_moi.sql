-- ============================================================================
-- 202610261821 — duoi_hoc_tu_dau_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 "Bổ trợ đuổi, học từ đầu chuyển đi" — K6–12 sang BẢN ĐỒ MỚI (PLAN-mastery-ban-do-moi.md), như bổ trợ yếu
--   (mig 202610241000 + 202610241400). Đuổi không dùng mastery; cái dính bản đồ cũ là LỘ TRÌNH (_duoi_lo_trinh gõ cứng
--   dai_ban_do + hgt_ban_do ⇒ dạng bài NDB rơi xuống "học trên giấy") và cổng htd_co_mo (cùng lỗi).
--   · Lộ trình đi theo REGISTRY nhánh (_kho_nhanh_cua_dang → _kho_ban_do_tbl/_kho_cau_tbl), không gõ tên bảng, không `if Toán`.
--     Bản đồ 4 tầng (có cột thu_tu_dang — bdm_ban_do) xếp + khoá tuần tự theo thu_tu chủ đề → chuyên đề → nhóm → dạng bài;
--     bản đồ cũ giữ đúng thứ tự cũ (chuyên đề → độ khó → mã). Đầu ra của bản đồ cũ y hệt trước (cấp 1, KHTN, mã cũ còn lại).
--   · Đếm câu theo dạng 1 LƯỢT cho cả nhánh (lọc view bdm_cau_hoi từng dạng một ~150 ms/dạng — bẫy đã gặp); cùng lý do
--     fn_duoi_dang_trang_thai đếm "có MCQ" 1 lượt/nhánh thay vì exists từng dòng.
--   · _kho_muc_do_dang hiểu nhánh 'bdm' (trước rơi về dai_ban_do ⇒ NULL ⇒ test luôn 5 câu) — đọc độ khó dạng bài.
--   · fn_duoi_dang_chon(mon, khoi): danh sách dạng để học thuật chọn mục tiêu đợt — (môn, khối) chạy bản đồ mới theo
--     registry _kho_ds_nhanh_khoi ⇒ dạng bài NDB; còn lại ⇒ ban_do 'cu', client dùng bộ chọn cũ (cấp 1 không đổi).
--   · Dữ liệu ĐANG CHẠY (đợt can_duoi, (môn, khối lớp) chạy bản đồ mới): mã dạng cũ → dạng bài NDB theo luật mig 202610241400:
--     (1) mọi câu CÒN SỐNG của dạng cũ (cùng đường _do_o_bdm) + đối ứng một-đích quy về ĐÚNG MỘT dạng bài, hoặc (2) mọi câu em ĐÃ
--     LÀM (htd_luyen/htd_test) cho dạng đó quy về đúng một dạng bài. Không duy nhất ⇒ GIỮ mã cũ (§1.5 — lộ trình mã cũ vẫn chạy bản
--     đồ + kho cũ như trước). KHÔNG tách dòng (luật (3) của ca yếu) và không chọn theo mastery (luật (4)): mục tiêu đuổi là phạm vi
--     kiến thức GV chọn, không phải dạng em yếu — tách hay không chờ Thùy quyết.
--     Đổi CÙNG lượt cho một (em × môn × mã cũ): dòng mục tiêu của MỌI đợt của em có mã đó (để tab Hoàn thành vẫn đọc đúng "đã xong"),
--     dòng tiến trình hoc_tu_dau_dang, dạng trên bài htd_luyen/htd_test của em — các hàm ghép ba bên bằng ma_dang.
--     Không quy khi: 2 mã cũ của em về cùng 1 dạng bài (không gộp dòng) · em đã có dòng hoc_tu_dau_dang của dạng bài đó · đợt đã có
--     sẵn dạng bài đó. Mã cũ giữ ở cột ma_dang_cu (NULL = dòng chưa từng bị quy).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 2 cột, UPDATE ma_dang có lưu bản cũ vào ma_dang_cu, thay thân 5 hàm, thêm 1 hàm.
-- ============================================================================

alter table bo_tro_duoi_dang add column if not exists ma_dang_cu text;
comment on column bo_tro_duoi_dang.ma_dang_cu is 'Mã dạng (bản đồ cũ) trước khi quy sang dạng bài bản đồ mới (mig 202610261821) — NULL = chưa từng quy';
alter table hoc_tu_dau_dang add column if not exists ma_dang_cu text;
comment on column hoc_tu_dau_dang.ma_dang_cu is 'Mã dạng (bản đồ cũ) trước khi quy sang dạng bài bản đồ mới (mig 202610261821) — NULL = chưa từng quy';

-- ─── _kho_muc_do_dang: thêm nhánh 'bdm' ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public._kho_muc_do_dang(p_mon text, p_ma_dang text)
 RETURNS smallint
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Tiếng Anh' then
    select muc_do into v_md from anh_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'TSA' then
    select muc_do into v_md from tsa_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_hoc' then
    select muc_do into v_md from hinh_hoc_bai where ma_bai = p_ma_dang;
  elsif v_nhanh = 'hinh_mo_hinh' then
    select muc_do into v_md from hmh_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'bdm' then
    select muc_do into v_md from bdm_ban_do where ma_dang = p_ma_dang;   -- 26/10: dạng bài bản đồ mới (NULL = chưa gán độ khó)
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $function$;

-- ─── _duoi_lo_trinh: theo registry nhánh, bản đồ 4 tầng xếp theo thu_tu ─────
CREATE OR REPLACE FUNCTION public._duoi_lo_trinh(p_hs uuid, p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := p_hs;
  v_dang_can text[];
  r record;
  v_bd text; v_cau text; v_4tang boolean;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  select coalesce(array_agg(distinct bdd.ma_dang), '{}') into v_dang_can
    from bo_tro_duoi bd join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi';
  if array_length(v_dang_can, 1) is null then return '[]'::jsonb; end if;

  -- 26/10: mỗi dạng về đúng bản đồ của NHÁNH nó (registry — CLAUDE §1.6), không gõ tên bảng. Nhánh có lộ trình app:
  -- nhánh mặc định ('' = Đại / bảng duy nhất của môn 1 nhánh), Hình giải tích, bản đồ mới 'bdm'. Hình học (bài) ⇒ ngoài lộ trình (giấy).
  for r in
    select n.nh, array_agg(n.ma order by n.ma) as ds
      from (select d.ma, coalesce(public._kho_nhanh_cua_dang(p_mon, d.ma), '') as nh from unnest(v_dang_can) d(ma)) n
     where n.nh in ('', 'hinh_gt', 'bdm')
     group by n.nh order by n.nh
  loop
    v_bd := public._kho_ban_do_tbl(p_mon, nullif(r.nh, ''));
    v_cau := public._kho_cau_tbl(p_mon, nullif(r.nh, ''));
    -- bản đồ 4 tầng (chủ đề → chuyên đề → nhóm → dạng bài) mang thu_tu từng tầng ⇒ thứ tự theo thu_tu; bản đồ cũ: chuyên đề → độ khó → mã
    v_4tang := exists (select 1 from information_schema.columns ic
                       where ic.table_schema = 'public' and ic.table_name = v_bd and ic.column_name = 'thu_tu_dang');
    execute format($q$
      with cau as (  -- đếm 1 LƯỢT cho cả nhánh (lọc view bdm_cau_hoi từng dạng một rất chậm)
        select c.dang_chinh, count(*) as n from %2$I c where c.dang_chinh = any($1) and c.xoa_at is null and %3$s group by c.dang_chinh)
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', coalesce(cau.n, 0)
      ) || %4$s), '[]'::jsonb)
      from %1$I bd
      left join cau on cau.dang_chinh = bd.ma_dang
      where bd.ma_dang = any($1)
    $q$, v_bd, v_cau, public._kho_dk_online_hs_sql(v_cau),
       case when v_4tang
         then $s$jsonb_build_object('ma_nhom', bd.ma_nhom, 'ten_nhom', bd.ten_nhom, 'thu_tu', jsonb_build_array(
                  coalesce(bd.thu_tu_chu_de, 0), bd.ma_chu_de, coalesce(bd.thu_tu_chuyen_de, 0), bd.ma_chuyen_de,
                  coalesce(bd.thu_tu_nhom, 0), bd.ma_nhom, coalesce(bd.thu_tu_dang, 0), bd.ma_dang))$s$
         else $s$jsonb_build_object('thu_tu', jsonb_build_array(bd.ma_chu_de, bd.ma_chuyen_de, coalesce(bd.muc_do, 3), bd.ma_dang))$s$ end)
      into v_part using r.ds;
    v_out := v_out || v_part;
  end loop;

  -- Tuần tự mở/khoá trong từng chuyên đề của MỤC TIÊU theo thu_tu (bản đồ cũ: độ khó 1→2→3…, cùng độ khó theo ma_dang). Dạng đã xong,
  -- hoặc TA đã MỞ TAY (hoc_tu_dau_dang.mo_tay_at) thì luôn mở. Tiến độ chi tiết (luyện · test · nơi làm) lấy từ _duoi_tien_do_dang —
  -- MỘT nguồn cho HS, TA và ERP.
  with td as (
    select * from public._duoi_tien_do_dang(v_hs, p_mon, coalesce((select array_agg(x->>'ma_dang') from jsonb_array_elements(v_out) x), '{}'))
  ), base as (
    select x, td.*
    from jsonb_array_elements(v_out) x
    left join td on td.ma_dang = x->>'ma_dang'
  ), tuan_tu as (
    select base.*,
           lag(base.xong) over (partition by x->>'ma_chu_de', x->>'ma_chuyen_de' order by x->'thu_tu') as xong_truoc
    from base
  )
  select coalesce(jsonb_agg(
    (x - 'thu_tu') || jsonb_build_object(
      'doc_ly_thuyet', coalesce(doc_lt, false), 'xong', coalesce(xong, false),
      'mo', coalesce(xong, false) or coalesce(mo_tay, false) or coalesce(xong_truoc, true),
      'luyen_cau', coalesce(luyen_cau, 0), 'luyen_dung', coalesce(luyen_dung, 0),
      'test_lan', coalesce(test_lan, 0), 'test_gan_nhat', test_gan_nhat,
      'xong_at', xong_at, 'noi_lam', noi_lam, 'mo_tay', coalesce(mo_tay, false))
    order by x->'thu_tu'
  ), '[]'::jsonb)
  into v_out
  from tuan_tu;

  return v_out;
end $function$;

-- ─── fn_duoi_tien_trinh: dạng trên app xếp ĐÚNG thứ tự lộ trình (không sắp lại theo mã) ─────
CREATE OR REPLACE FUNCTION public.fn_duoi_tien_trinh(p_hoc_sinh uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid; r record; d record; v_out jsonb := '[]'::jsonb; v_dangs jsonb; v_buoi jsonb; v_path jsonb;
  v_nh text; v_bd text; v_cd text; v_tcd text; v_md smallint; v_item jsonb; v_tt text; v_mo boolean;
begin
  if p_hoc_sinh is null then v_hs := public.my_hoc_sinh_id();
  else
    if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
    v_hs := p_hoc_sinh;
  end if;
  if v_hs is null then return '[]'::jsonb; end if;

  for r in select bd.id, bd.so_buoi_du_kien, bd.created_at, l.mon, l.ten_lop
           from bo_tro_duoi bd join lop l on l.id = bd.lop_id
           where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi' order by bd.created_at loop
    v_path := public._duoi_lo_trinh(v_hs, r.mon);
    v_dangs := '[]'::jsonb;
    for d in select bdd.ma_dang from bo_tro_duoi_dang bdd where bdd.bo_tro_duoi_id = r.id order by bdd.created_at, bdd.ma_dang loop
      v_item := (select x from jsonb_array_elements(v_path) x where x->>'ma_dang' = d.ma_dang limit 1);
      if v_item is not null then
        v_tt := case when (v_item->>'xong')::boolean then 'xong'
                     when (v_item->>'doc_ly_thuyet')::boolean or (v_item->>'luyen_cau')::int > 0 or (v_item->>'test_lan')::int > 0 then 'dang_hoc'
                     when (v_item->>'mo')::boolean then 'toi_luot'
                     else 'khoa' end;
        v_dangs := v_dangs || jsonb_build_array(v_item || jsonb_build_object('trang_thai', v_tt, 'tren_app', true));
      else
        -- dạng không nằm trong lộ trình app (vd Bài Hình học, hoặc bản đồ không có): vẫn thuộc mục tiêu, học + chấm trên giấy với TA
        v_nh := public._kho_nhanh_cua_dang(r.mon, d.ma_dang);
        v_bd := public._kho_ban_do_tbl(r.mon, v_nh);
        v_cd := null; v_tcd := null; v_md := null;
        begin
          execute format('select ma_chuyen_de, ten_chuyen_de, muc_do from %I where ma_dang = $1 limit 1', v_bd) into v_cd, v_tcd, v_md using d.ma_dang;
        exception when others then null; end;
        v_dangs := v_dangs || jsonb_build_array(jsonb_build_object(
          'ma_dang', d.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, d.ma_dang), d.ma_dang),
          'ma_chuyen_de', v_cd, 'ten_chuyen_de', coalesce(v_tcd, ''), 'muc_do', v_md,
          'xong', coalesce((select td.xong from public._duoi_tien_do_dang(v_hs, r.mon, array[d.ma_dang]) td), false),
          'doc_ly_thuyet', false, 'mo', true, 'tong_cau', 0, 'luyen_cau', 0, 'luyen_dung', 0, 'test_lan', 0, 'test_gan_nhat', null, 'noi_lam', null, 'mo_tay', false,
          'trang_thai', case when coalesce((select td.xong from public._duoi_tien_do_dang(v_hs, r.mon, array[d.ma_dang]) td), false) then 'xong' else 'giay' end,
          'tren_app', false));
      end if;
    end loop;

    -- Xếp theo ĐÚNG thứ tự khoá tuần tự của lộ trình (26/10: vị trí trong _duoi_lo_trinh — bản đồ mới theo thu_tu, bản đồ cũ
    -- chuyên đề → độ khó → mã như trước), dạng ngoài lộ trình app xuống cuối — để "chờ dạng trước" đọc được từ danh sách.
    select coalesce(jsonb_agg(x order by (x->>'tren_app')::boolean desc, p.o nulls last, x->>'ma_chu_de', x->>'ma_chuyen_de',
                                 coalesce((x->>'muc_do')::int, 3), x->>'ma_dang'), '[]'::jsonb)
      into v_dangs
      from jsonb_array_elements(v_dangs) x
      left join lateral (select e.o from jsonb_array_elements(v_path) with ordinality e(v, o) where e.v->>'ma_dang' = x->>'ma_dang' limit 1) p on true;

    select coalesce(jsonb_agg(jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'trang_thai', b.trang_thai,
             'diem_danh', hh.diem_danh, 'xong', (b.danh_gia_xong_at is not null)) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
      into v_buoi
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
      where hh.bo_tro_duoi_id = r.id and b.trang_thai <> 'huy';

    v_out := v_out || jsonb_build_array(jsonb_build_object(
      'bo_tro_duoi_id', r.id, 'mon', r.mon, 'lop', r.ten_lop, 'so_buoi_du_kien', r.so_buoi_du_kien, 'created_at', r.created_at,
      'dangs', v_dangs, 'buoi', v_buoi,
      'tong', jsonb_array_length(v_dangs),
      'xong', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'xong'),
      'dang_hoc', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'dang_hoc'),
      'tai_nha', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'noi_lam' = 'nha'),
      'tai_ca', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'noi_lam' = 'ca'),
      'giay', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'giay'),
      'so_buoi_xong', (select count(*) from jsonb_array_elements(v_buoi) x where (x->>'xong')::boolean and x->>'diem_danh' = 'co_mat')));
  end loop;
  return v_out;
end $function$;

-- ─── htd_co_mo: cùng tập nhánh với lộ trình, bảng qua registry ───────────────
CREATE OR REPLACE FUNCTION public.htd_co_mo(p_mon text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v boolean; r record;
begin
  if not public._kho_co_mon(p_mon) then return false; end if;  -- môn chưa có kho ⇒ không rơi về kho Toán
  -- 26/10: mỗi dạng tra bản đồ của NHÁNH nó (registry — CLAUDE §1.6); cùng tập nhánh có lộ trình app như _duoi_lo_trinh.
  for r in
    select n.nh, array_agg(distinct n.ma) as ds
      from (select bdd.ma_dang as ma, coalesce(public._kho_nhanh_cua_dang(p_mon, bdd.ma_dang), '') as nh
              from bo_tro_duoi bd join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
             where bd.hoc_sinh_id = public.my_hoc_sinh_id() and bd.trang_thai = 'can_duoi') n
     where n.nh in ('', 'hinh_gt', 'bdm')
     group by n.nh
  loop
    execute format('select exists (select 1 from %I b where b.ma_dang = any($1))', public._kho_ban_do_tbl(p_mon, nullif(r.nh, '')))
      into v using r.ds;
    if v then return true; end if;
  end loop;
  return false;
end $function$;

-- ─── fn_duoi_dang_trang_thai: "có MCQ" đếm 1 lượt mỗi (môn × nhánh) ───────────
CREATE OR REPLACE FUNCTION public.fn_duoi_dang_trang_thai(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_cautbl text; v_part text[]; v_co text[] := '{}'; v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự xem được.'; end if;
  -- 26/10: exists từng dòng trên view bdm_cau_hoi ~150 ms/dạng ⇒ gom dạng theo (môn × nhánh), hỏi kho 1 lượt.
  for r in
    select l.mon, public._kho_nhanh_cua_dang(l.mon, bdd.ma_dang) as nh, array_agg(distinct bdd.ma_dang) as ds
    from buoi_hoc_hs bh
    join bo_tro_duoi bd on bd.id = bh.bo_tro_duoi_id
    join lop l on l.id = bd.lop_id
    join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bh.buoi_hoc_id = p_buoi and bh.bo_tro_duoi_id is not null
    group by 1, 2
  loop
    v_cautbl := public._kho_cau_tbl(r.mon, r.nh);
    execute format('select coalesce(array_agg(distinct c.dang_chinh), ''{}'') from %1$I c where c.dang_chinh = any($1) and c.xoa_at is null and %2$s',
                   v_cautbl, public._kho_dk_online_hs_sql(v_cautbl))
      into v_part using r.ds;
    v_co := v_co || array(select r.mon || '|' || x from unnest(v_part) x);
  end loop;
  select coalesce(jsonb_agg(jsonb_build_object(
           'hoc_sinh_id', bd.hoc_sinh_id, 'bo_tro_duoi_id', bd.id, 'ma_dang', bdd.ma_dang,
           'xong', (htd.test_nop_at is not null), 'co_mcq', (l.mon || '|' || bdd.ma_dang) = any(v_co))
         order by bd.hoc_sinh_id, bdd.ma_dang), '[]'::jsonb)
    into v_out
    from buoi_hoc_hs bh
    join bo_tro_duoi bd on bd.id = bh.bo_tro_duoi_id
    join lop l on l.id = bd.lop_id
    join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    left join hoc_tu_dau_dang htd on htd.hoc_sinh_id = bd.hoc_sinh_id and htd.mon = l.mon and htd.ma_dang = bdd.ma_dang
    where bh.buoi_hoc_id = p_buoi and bh.bo_tro_duoi_id is not null;
  return v_out;
end $function$;

-- ─── fn_duoi_dang_chon: dạng để học thuật chọn mục tiêu đợt (bản đồ theo registry khối) ─────
create or replace function public.fn_duoi_dang_chon(p_mon text, p_khoi text)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $function$
declare v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  -- (môn, khối) chưa chạy bản đồ mới (cấp 1, môn khác, công tắc tắt) ⇒ client giữ bộ chọn cũ
  if not coalesce('bdm' = any(public._kho_ds_nhanh_khoi(p_mon, p_khoi)), false) then
    return jsonb_build_object('ban_do', 'cu', 'dangs', '[]'::jsonb);
  end if;
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma_dang', b.ma_dang, 'ten_dang', b.ten_dang, 'muc_do', b.muc_do,
             'ma_chu_de', b.ma_chu_de, 'ten_chu_de', b.ten_chu_de,
             'ma_chuyen_de', b.ma_chuyen_de, 'ten_chuyen_de', b.ten_chuyen_de,
             'ma_nhom', b.ma_nhom, 'ten_nhom', b.ten_nhom)
           order by b.thu_tu_chu_de, b.ma_chu_de, b.thu_tu_chuyen_de, b.ma_chuyen_de, b.thu_tu_nhom, b.ma_nhom, b.thu_tu_dang, b.ma_dang), '[]'::jsonb)
      from %I b where b.khoi = $1
  $q$, public._kho_ban_do_tbl(p_mon, 'bdm')) into v_out using p_khoi;
  return jsonb_build_object('ban_do', 'moi', 'dangs', v_out);
end $function$;
revoke execute on function public.fn_duoi_dang_chon(text, text) from public, anon;
grant execute on function public.fn_duoi_dang_chon(text, text) to authenticated;

-- ═══ DỮ LIỆU ĐANG CHẠY: mã dạng cũ → dạng bài NDB (đích duy nhất) ═══════════════════════════════════════
-- dòng mục tiêu của đợt ĐANG ĐUỔI, (môn, khối lớp) chạy bản đồ mới theo registry, mã còn là dạng bản đồ cũ Đại/HGT
create temp table _dd on commit drop as
select bdd.id, bdd.bo_tro_duoi_id as dot, bd.hoc_sinh_id as hs, l.mon, bdd.ma_dang as cu
  from bo_tro_duoi_dang bdd join bo_tro_duoi bd on bd.id = bdd.bo_tro_duoi_id join lop l on l.id = bd.lop_id
 where bd.trang_thai = 'can_duoi' and bdd.ma_dang not like 'NDB%'
   and 'bdm' = any(public._kho_ds_nhanh_khoi(l.mon, l.khoi))
   and (exists (select 1 from dai_ban_do b where b.ma_dang = bdd.ma_dang) or exists (select 1 from hgt_ban_do b where b.ma_dang = bdd.ma_dang));

-- (1) đích chung của mã cũ: mọi câu còn sống (đường _do_o_bdm của mastery) + đối ứng một-đích về đúng MỘT dạng bài
create temp table _qd on commit drop as
with d as (select distinct cu as ma_dang from _dd),
k as (
  select d.ma_dang, x.khoa from d cross join lateral (
    select public._do_o_bdm(q.ma_cau, d.ma_dang) as khoa from dai_cau_hoi q where q.dang_chinh = d.ma_dang and q.xoa_at is null
    union select public._do_o_bdm(q.ma_cau, d.ma_dang) from hgt_cau_hoi q where q.dang_chinh = d.ma_dang
    union select public._bdm_dang_cu_mot_dich(d.ma_dang)) x
)
select ma_dang as cu, min(khoa) as moi from k
 group by ma_dang
having count(distinct khoa) filter (where khoa is not null) = 1 and bool_and(khoa is null or khoa like 'NDB%');

-- (2) theo TỪNG em: không có đích chung ⇒ mọi câu em ĐÃ LÀM (htd_luyen/htd_test) cho mã đó quy về đúng một dạng bài
create temp table _don on commit drop as
select u.hs, u.mon, u.cu, q.moi as moi_chung,
       (select array_agg(distinct public._do_o_bdm(btc.ma_cau, u.cu))
          from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
         where bt.hoc_sinh_id = u.hs and bt.mon = u.mon and bt.loai in ('htd_luyen', 'htd_test')
           and btc.ma_dang = u.cu and btc.ma_cau is not null) as da_lam,
       null::text as moi
  from (select distinct hs, mon, cu from _dd) u
  left join _qd q on q.cu = u.cu;
update _don set moi = coalesce(moi_chung, case when cardinality(da_lam) = 1 and da_lam[1] like 'NDB%' then da_lam[1] end);

-- đơn vị quy = (em × môn × mã cũ), loại khi đụng: 2 mã cũ của em cùng về 1 dạng bài · em đã có dòng tiến trình dạng bài đó ·
-- một đợt (bất kỳ trạng thái) của em có mã cũ này đã có sẵn dạng bài đó
create temp table _ok on commit drop as
select d.hs, d.mon, d.cu, d.moi from _don d
 where d.moi is not null
   and not exists (select 1 from _don d2 where d2.hs = d.hs and d2.mon = d.mon and d2.cu <> d.cu and d2.moi = d.moi)
   and not exists (select 1 from hoc_tu_dau_dang h where h.hoc_sinh_id = d.hs and h.mon = d.mon and h.ma_dang = d.moi)
   and not exists (select 1 from bo_tro_duoi bd join lop l on l.id = bd.lop_id
                     join bo_tro_duoi_dang y on y.bo_tro_duoi_id = bd.id and y.ma_dang = d.cu
                     join bo_tro_duoi_dang y2 on y2.bo_tro_duoi_id = bd.id and y2.ma_dang = d.moi
                    where bd.hoc_sinh_id = d.hs and l.mon = d.mon);

update bai_test_cau btc set ma_dang_cu = btc.ma_dang, ma_dang = o.moi
  from bai_test bt, _ok o
 where btc.bai_test_id = bt.id and bt.loai in ('htd_luyen', 'htd_test')
   and bt.hoc_sinh_id = o.hs and bt.mon = o.mon and btc.ma_dang = o.cu;

update hoc_tu_dau_dang h set ma_dang_cu = h.ma_dang, ma_dang = o.moi
  from _ok o
 where h.hoc_sinh_id = o.hs and h.mon = o.mon and h.ma_dang = o.cu;

update bo_tro_duoi_dang y set ma_dang_cu = y.ma_dang, ma_dang = o.moi
  from bo_tro_duoi bd, lop l, _ok o
 where y.bo_tro_duoi_id = bd.id and l.id = bd.lop_id and bd.hoc_sinh_id = o.hs and l.mon = o.mon and y.ma_dang = o.cu;
