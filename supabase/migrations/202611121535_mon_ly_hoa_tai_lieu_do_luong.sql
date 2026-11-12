-- ============================================================================
-- Môn LÝ HÓA, đợt 3 — tài liệu / giáo trình / ET · MT · BTVN · mastery & dashboard học tập · báo cáo kỳ (Thùy 12/11)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_dot3.mjs từ DB đang chạy — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO: các hàm dưới đang rẽ nhánh "KHTN ⇒ bảng khtn_*, còn lại ⇒ Toán". Môn Lý hóa (bảng lyhoa_* từ mig 202611121511)
--   rơi vào nhánh Toán: giáo trình/ET Lý hóa ra cây Toán, MT/BTVN không thấy câu, mastery không quy được dạng bài.
--   Mỗi chỗ CHỈ CHÈN nhánh Lý hóa song song nhánh KHTN; phần Toán/KHTN giữ nguyên từng chữ.
-- MẤT GÌ (Luật xoá): không mất gì — create or replace hàm (giữ chữ ký, ACL) + create or replace view (thêm 1 khối UNION ALL).
-- ============================================================================
set local check_function_bodies = off;

-- _do_o_quy(p_bdm boolean, p_khtn_bdm boolean, p_kc text, p_kd text)
CREATE OR REPLACE FUNCTION public._do_o_quy(p_bdm boolean, p_khtn_bdm boolean, p_kc text, p_kd text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select case when public._btyeu_la_hinh_mh(p_kd) then null   -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
              when p_khtn_bdm and public._khtn_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._khtn_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))
              when p_khtn_bdm and public._lyhoa_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._lyhoa_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- Lý hóa (12/11): cùng luật KHTN
              when p_bdm then public._do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- BẢN ĐỒ MỚI Toán (K6–12; cấp 1 + Hình giữ cũ bên trong)
              else public._do_nhom_cua_o(nullif(p_kc, ''), nullif(p_kd, '')) end
$function$
;
-- _dbht_cau(p_hs uuid[], p_tu date, p_mon text)
CREATE OR REPLACE FUNCTION public._dbht_cau(p_hs uuid[], p_tu date, p_mon text)
 RETURNS TABLE(hoc_sinh_id uuid, ngay date, t timestamp with time zone, kenh text, luot text, thu_tu integer, ma_cau text, gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text, chu_de_id text, ten_dang text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy (+ bản sao câu app — ngày = ngày nộp)
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           sp.hinh_baitoan_id as bt_id,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang, null::uuid,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  k as (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd, bt_id from m),
  -- HÌNH: nhận diện + quy về mô hình / bài học
  hk as materialized (
    select k.kc, k.kd, k.bt_id,
           coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id) as mh_id,
           public.fn_hl_goc_mo_hinh(coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id)) as goc_id,   -- 09/11: gốc tính 1 lần mỗi khoá
           coalesce(bt1.id, bt2.id) as bt_ref,
           coalesce(hc.dang_chinh, hb.ma_bai) as hh_bai
      from k
      left join hinh_baitoan bt1 on bt1.id = k.bt_id
      left join hinh_baitoan bt2 on k.bt_id is null and bt2.ma = nullif(k.kd, '')
      left join hinh_hoc_cau_hoi hc on hc.ma_cau = nullif(k.kc, '')
      left join hinh_hoc_bai hb on hb.ma_bai = nullif(k.kd, '')
     where bt1.id is not null or bt2.id is not null or hc.ma_cau is not null or hb.ma_bai is not null
  ),
  -- ⭐ 09/11 (spec-hinh-cay-nhanh §13.1/§13.5/§13.6 bước 1): tầng Hình = Chủ đề → MÔ HÌNH (cấp chuyên đề, thay nhóm mô hình)
  --   → TRỌNG ĐIỂM (cấp nhóm). Nốt quy về mô hình GỐC của cây (trước đây lấy thẳng nút chứa nốt ⇒ nốt ở nhánh rơi vào 'HINH').
  --   Cấp nhóm: nốt trong thành viên nhóm bài ⇒ 'H:N:<nút nhóm>' · nốt trọng điểm ⇒ 'H:T:<nốt>' · còn lại ⇒ 'H:<gốc>'.
  hcap as (
    select hk.kc, hk.kd, hk.bt_id,
           coalesce(case when mh.vai = 'thanh_vien' then 'H:N:' || (select c.cha_id::text from hinh_mo_hinh_cha c where c.mo_hinh_id = mh.id limit 1) end,
                    case when btr.la_trong_diem then 'H:T:' || btr.id::text end,
                    'H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as nhom_id,
           coalesce('H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as chuyen_de_id,
           coalesce('H:' || coalesce(g.chu_de_id, nmh.chu_de_id, hhb.chu_de_id), 'HINH') as chu_de_id,
           coalesce(mh.ten, hhb.ten_bai, 'Hình') as ten_dang
      from hk
      left join hinh_mo_hinh mh on mh.id = hk.mh_id
      left join hinh_baitoan btr on btr.id = hk.bt_ref
      left join hinh_mo_hinh g on g.id = hk.goc_id
      left join hinh_nhom_mo_hinh nmh on nmh.id = g.nhom_mh_id      -- Bước 1 chưa xoá nhóm: chỉ còn làm dự phòng chủ đề
      left join hinh_hoc_bai hhb on hhb.ma_bai = hk.hh_bai
  ),
  -- KHTN (04/11): dạng bài bản đồ mới KHTN — cùng luật quy câu với tổng quan HS (`_khtn_do_o_bdm`)
  kk as (
    select k.kc, k.kd, k.bt_id, public._khtn_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._khtn_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- Lý hóa (12/11): như KHTN
  lk as (
    select k.kc, k.kd, k.bt_id, public._lyhoa_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._lyhoa_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- ĐẠI + HGT: dạng bài bản đồ mới (cấp 1 cũng theo bản đồ mới)
  dcap as (
    select k.kc, k.kd, k.bt_id, public._do_o_bdm_core(nullif(k.kc, ''), nullif(k.kd, ''), false) as o
      from k
     where (k.kc <> '' or k.kd <> '')
       and not exists (select 1 from hcap where hcap.kc = k.kc and hcap.kd = k.kd and hcap.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from lk where lk.kc = k.kc and lk.kd = k.kd and lk.bt_id is not distinct from k.bt_id)
  ),
  cap as (
    select dcap.kc, dcap.kd, dcap.bt_id, db.id as dang_bai_id, n.id as nhom_id, n.chuyen_de_id, n.chu_de_id, db.ten as ten_dang
      from dcap join dai_bdm_dang_bai db on db.id = dcap.o join dai_bdm_nhom n on n.id = db.nhom_id
    union all
    select kk.kc, kk.kd, kk.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id
    union all
    select lk.kc, lk.kd, lk.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from lk join lyhoa_bdm_dang_bai db on db.id = lk.o join lyhoa_bdm_nhom n on n.id = db.nhom_id
    union all
    select kc, kd, bt_id, null, nhom_id, chuyen_de_id, chu_de_id, ten_dang from hcap
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri,
         cap.dang_bai_id, cap.nhom_id, cap.chuyen_de_id, cap.chu_de_id, cap.ten_dang
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '') and cap.bt_id is not distinct from m.bt_id
   where p_tu is null or m.ngay >= p_tu
$function$
;
-- _tl_bdm_cau_vi_tri(p_khoi text, p_mon text)
CREATE OR REPLACE FUNCTION public._tl_bdm_cau_vi_tri(p_khoi text, p_mon text)
 RETURNS TABLE(ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  if p_mon = 'Toán' then
    return query select * from _tl_bdm_cau_vi_tri(p_khoi);
    return;
  end if;
  if p_mon = 'KHTN' then
    return query
    with nh as materialized (
      select n.id, n.ma_cu from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from khtn_bdm_gan_cau g
      join khtn_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join khtn_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from khtn_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  if p_mon = 'Lý hóa' then   -- 12/11: như KHTN
    return query
    with nh as materialized (
      select n.id, n.ma_cu from lyhoa_bdm_nhom n join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from lyhoa_bdm_gan_cau g
      join lyhoa_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join lyhoa_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from lyhoa_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  raise exception 'Môn % chưa có bản đồ mới cho giáo trình / ET.', p_mon using errcode = 'P0001';
end $function$
;
-- fn_tl_bdm_et_vi_tri(p_khoi text, p_ma text[])
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_vi_tri(p_khoi text, p_ma text[])
 RETURNS TABLE(ma_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE sql
 STABLE
AS $function$
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi) x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m) and not exists (select 1 from lyhoa_cau_hoi k where k.ma_cau = m))
  union all
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'KHTN') x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from khtn_cau_hoi k where k.ma_cau = any (p_ma))
  union all
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'Lý hóa') x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from lyhoa_cau_hoi k where k.ma_cau = any (p_ma))
$function$
;
-- fn_tl_bdm_cay_chon(p_khoi text, p_nhanh text)
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_cay_chon(p_khoi text, p_nhanh text DEFAULT 'toan'::text)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
  with m as materialized (select case when p_nhanh = 'khtn' then 'KHTN' when p_nhanh = 'lyhoa' then 'Lý hóa' else 'Toán' end as mon),
  -- 11/11: số câu đọc BẢN LƯU _tl_bdm_dem (≤ 5 phút), không đếm lại cả kho khối mỗi lần mở bộ chọn
  dm as materialized (select * from _tl_bdm_dem(p_khoi, (select m.mon from m)))
  select jsonb_build_object('chu_de', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', cd.id, 'ten', cd.ten,
      'chuyen_de', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ch.id, 'ten', ch.ten, 'so', o.so,
          'nhom', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'so', n.so,
              'co_ly_thuyet', (btrim(coalesce(n.ly_thuyet, '')) <> '' or n.ly_thuyet_file_url is not null),
              'so_cau_chua_phan', coalesce(((select dm.dem_cp from dm)->>n.id)::bigint, 0),
              'dang_bai', coalesce((
                select jsonb_agg(jsonb_build_object(
                  'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'so', d.so,
                  'co_ly_thuyet', (btrim(coalesce(d.ly_thuyet, '')) <> '' or d.ly_thuyet_file_url is not null),
                  'co_vi_du', (btrim(coalesce(d.vi_du, '')) <> '' or d.vi_du_file_url is not null),
                  'so_cau', coalesce(((select dm.dem_db from dm)->>d.id)::bigint, 0)
                ) order by d.so)
                from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) as so
                        from tl_bdm_dang_bai_v d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
            ) order by n.so)
            from (select n0.*, (row_number() over (order by n0.thu_tu, n0.id))::integer as so
                    from tl_bdm_nhom_v n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
        ) order by o.so)
        from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) as so
                from tl_bdm_o_v o0 where o0.chu_de_id = cd.id) o
        join tl_bdm_chuyen_de_v ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
    ) order by cd.thu_tu, cd.id)
    from tl_bdm_chu_de_v cd where cd.mon = (select m.mon from m) and cd.khoi = p_khoi and cd.nhanh = p_nhanh), '[]'::jsonb))
$function$
;
-- fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_loai text; v_goc text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
  v_used text[] := array(select e->>'ma_cau' from jsonb_array_elements(p_base) e);   -- đề 2/3 khác MỌI câu gốc khi còn đủ câu
  v_made jsonb := '{}'; v_form jsonb := '{}';
begin
  create temp table if not exists _et_vt3 (ma_cau text, cum text, dang_bai_id text, la_goc boolean, loai_cau text, goc text) on commit drop;   -- tên mới: thêm loai_cau (bảng tạm cũ cùng phiên có khuôn khác)
  truncate _et_vt3;
  -- chỉ tính vị trí câu của MÔN có dạng bài trong đề (Toán · KHTN — registry tl_bdm_dang_bai_v)
  insert into _et_vt3 select x.ma_cau, x.cum, x.dang_bai_id, x.la_goc, x.loai_cau
    from (select distinct v.mon from tl_bdm_dang_bai_v v where v.id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)) m
    cross join lateral _tl_bdm_cau_vi_tri(p_khoi, m.mon) x
   where x.dang_bai_id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e);
  -- Hình học: dạng bài = bài học (mã HH…), cả bài là 1 "cụm" (không còn cụm Hình học)
  insert into _et_vt3 select h.ma_cau, h.dang_chinh, h.dang_chinh, h.parent_ma_cau is null, h.loai_cau
    from hinh_hoc_cau_hoi h
   where h.dang_chinh in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)
     and h.ma_cau in (select x.ma_cau from _tl_hh_cau_chuan(h.dang_chinh) x);
  update _et_vt3 v set goc = coalesce(k.parent_ma_cau, k.ma_cau) from (
    select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from lyhoa_cau_hoi where ma_cau in (select ma_cau from _et_vt3)) k
   where k.ma_cau = v.ma_cau;
  for b in select e->>'ma_cau' as ma, e->>'dang_bai' as db, coalesce(e->>'form', 'tra_loi_ngan') as form, o
             from jsonb_array_elements(p_base) with ordinality as t(e, o) order by o loop
    select v.loai_cau into v_loai from _et_vt3 v where v.ma_cau = b.ma;
    -- gốc của câu đề 1 (câu gốc ⇒ chính nó; câu clone ⇒ parent) — đọc thẳng kho, kể cả khi câu đề 1 không còn kho chuẩn
    v_goc := coalesce((select coalesce(x.parent_ma_cau, x.ma_cau) from (
               select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from lyhoa_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);
    -- ⭐⭐ Thùy 04/11 "nếu có câu clone thì phải chọn câu clone": ưu tiên SỐ 1 = câu cùng GỐC (clone của câu đề 1, hoặc gốc + clone
    --   anh em khi câu đề 1 là clone), rồi cùng loại câu → câu gốc khác cùng dạng bài. Thùy 04/11 "làm gì còn khái niệm cụm nữa?" ⇒ bỏ bậc cụm.
    -- ⭐ Thùy 04/11 "đề 2 3 bị giống đề 1": ứng viên = cùng DẠNG BÀI + in được cùng form; cùng cụm / cùng loại câu chỉ là ƯU TIÊN.
    --   Trước: lọc cứng cùng cụm ⇒ câu không cụm (câu nhập từ đề thi: cụm = chính nó) chỉ có chính nó ⇒ 52% câu ET bản đồ mới đề 2/3 = đề 1,
    --   dù dạng bài còn 2–84 câu. Dạng bài là đơn vị đo (KP) của bản đồ mới ⇒ câu cùng dạng bài là biến thể hợp lệ.
    -- (cũ) ứng viên = cùng dạng bài + cùng cụm + in được cùng form (TN: có phương án / mệnh đề / form TN đã duyệt; form khác: không phải Đ/S)
    v_cands := array(
      select v.ma_cau from _et_vt3 v
        join lateral (
          select to_jsonb(c.lua_chon) lc, to_jsonb(c.menh_de) md, exists (select 1 from dai_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet) tn
            from dai_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hgt_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet)
            from hgt_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from hinh_hoc_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from khtn_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from khtn_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from lyhoa_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from lyhoa_cau_hoi c where c.ma_cau = v.ma_cau
        ) c on true
       where v.dang_bai_id = b.db
         and case when b.form = 'trac_nghiem'
                  then jsonb_array_length(coalesce(c.lc, '[]'::jsonb)) > 0 or jsonb_array_length(coalesce(c.md, '[]'::jsonb)) > 0 or c.tn
                  else jsonb_array_length(coalesce(c.md, '[]'::jsonb)) = 0 end
       order by (v.ma_cau = b.ma), (v.goc is distinct from v_goc), (v.loai_cau is distinct from v_loai), (not v.la_goc), v.ma_cau);
    v_picks := '{}';
    for i in 1..2 loop
      select x into v_fresh from unnest(v_cands) x where not (x = any (v_used)) limit 1;
      if v_fresh is not null then
        v_used := v_used || v_fresh; v_picks := v_picks || v_fresh;
        v_form := v_form || jsonb_build_object(v_fresh, b.form);
      else
        -- dạng bài hết câu chưa dùng (cùng form) ⇒ cho trùng TRONG dạng bài (khác đề 2 nếu được), rồi câu gốc — không nhảy dạng bài, không để trống
        v_dup := coalesce((select x from unnest(v_cands) x where not (x = any (v_picks)) limit 1), v_cands[1], b.ma);
        v_picks := v_picks || v_dup;
        v_form := v_form || jsonb_build_object(v_dup, b.form);
      end if;
    end loop;
    v_made := v_made || jsonb_build_object(b.ma, to_jsonb(v_picks));
  end loop;
  return jsonb_build_object('etMaDe', v_made, 'etFormByCau', v_form);
end $function$
;
-- view tl_bdm_chu_de_v
create or replace view public.tl_bdm_chu_de_v as
 SELECT 'Toán'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    c.nhanh
   FROM dai_bdm_chu_de c
UNION ALL
 SELECT 'KHTN'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    'khtn'::text AS nhanh
   FROM khtn_bdm_chu_de c
UNION ALL
 SELECT 'Lý hóa'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    'lyhoa'::text AS nhanh
   FROM lyhoa_bdm_chu_de c;
-- view tl_bdm_chuyen_de_v
create or replace view public.tl_bdm_chuyen_de_v as
 SELECT 'Toán'::text AS mon,
    c.id,
    c.ten
   FROM dai_bdm_chuyen_de c
UNION ALL
 SELECT 'KHTN'::text AS mon,
    c.id,
    c.ten
   FROM khtn_bdm_chuyen_de c
UNION ALL
 SELECT 'Lý hóa'::text AS mon,
    c.id,
    c.ten
   FROM lyhoa_bdm_chuyen_de c;
-- view tl_bdm_dang_bai_v
create or replace view public.tl_bdm_dang_bai_v as
 SELECT 'Toán'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM dai_bdm_dang_bai d
UNION ALL
 SELECT 'KHTN'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM khtn_bdm_dang_bai d
UNION ALL
 SELECT 'Lý hóa'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM lyhoa_bdm_dang_bai d;
-- view tl_bdm_nhom_v
create or replace view public.tl_bdm_nhom_v as
 SELECT 'Toán'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM dai_bdm_nhom n
UNION ALL
 SELECT 'KHTN'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM khtn_bdm_nhom n
UNION ALL
 SELECT 'Lý hóa'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM lyhoa_bdm_nhom n;
-- view tl_bdm_o_v
create or replace view public.tl_bdm_o_v as
 SELECT 'Toán'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM dai_bdm_o o
UNION ALL
 SELECT 'KHTN'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM khtn_bdm_o o
UNION ALL
 SELECT 'Lý hóa'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM lyhoa_bdm_o o;
-- fn_mt_bang_ket_qua(p_de uuid, p_cap text)
CREATE OR REPLACE FUNCTION public.fn_mt_bang_ket_qua(p_de uuid, p_cap text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with buoi as (
    select distinct b.id, l.id as lop_id, l.ten_lop
      from tai_lieu t
      join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
     where t.loai = 'mt_buoi' and t.nguon_id = p_de
    union
    -- kỳ khảo sát chung của đề (không thuộc lớp)
    select b.id, null::uuid, null::text from buoi_hoc b where b.loai = 'khao_sat' and b.de_id = p_de and b.trang_thai <> 'huy'
  ),
  bd as (
    select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from dai_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from lyhoa_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from hgt_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from bdm_ban_do where ma_dang like 'NDB%'  -- bản đồ mới (24/10)
    -- Hình học: không có chủ đề cũ ⇒ chủ đề mới (dai_bdm_chu_de) nếu đã gắn, chưa gắn thì gom "Hình học".
    union all select hb.ma_dang, hb.ma_chuyen_de, hb.ten_chuyen_de, coalesce(hb.chu_de_id, 'HINH'), coalesce(cdm.ten, 'Hình học')
      from hinh_hoc_bai hb left join dai_bdm_chu_de cdm on cdm.id = hb.chu_de_id
  ),
  cu as (select x.* from buoi, lateral _mt_o_bai_cu(buoi.id) x),
  o0 as (
    select s.id, s.buoi_hoc_id, s.problem_no, s.diem_toi_da, cu.k as bai_k, cu.tong as bai_tong,
           bd1.ma_chuyen_de, bd1.ten_chuyen_de, bd1.ma_chu_de, bd1.ten_chu_de,
           mh.id as mh_id, mh.ma as mh_ma, mh.chu_de_id as mh_chu_de, cdm2.ten as mh_ten_chu_de,
           btrim(regexp_replace(mh.ten, '\s*\mtest\M\s*', ' ', 'gi')) as mh_ten
      from buoi
      join gami_session_problems s on s.buoi_hoc_id = buoi.id and s.phase = 'mt' and not s.ngoai_de
      left join lateral (select bd.ma_chuyen_de, bd.ten_chuyen_de, bd.ma_chu_de, bd.ten_chu_de from bd where bd.ma_dang = coalesce(case when public._mastery_bdm_bat() then public._do_o_bdm(s.ma_cau, s.ma_dang) end, s.ma_dang) limit 1) bd1 on s.hinh_baitoan_id is null and s.hinh_y_id is null  -- bật công tắc ⇒ câu → dạng bài mới (cùng đường mastery); chưa quy được thì bản đồ cũ
      left join hinh_baitoan bt on bt.id = s.hinh_baitoan_id
      left join hinh_y hy on bt.id is null and hy.id = s.hinh_y_id   -- ô ý bài kho chưa gắn node ⇒ mô hình của cả bài kho (29/10)
      left join hinh_bai hbk on hbk.id = hy.bai_id
      left join hinh_mo_hinh mh on mh.id = coalesce(bt.mo_hinh_id, hbk.mo_hinh_id)
      left join dai_bdm_chu_de cdm2 on cdm2.id = mh.chu_de_id
      left join cu on cu.id = s.id
  ),
  o as (
    select o0.id, o0.buoi_hoc_id, o0.problem_no, o0.diem_toi_da, o0.bai_k, o0.bai_tong,
           case when p_cap = 'chu_de'
                then coalesce(o0.ma_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_chu_de, 'HINH') end, 'KHAC')
                else coalesce(o0.ma_chuyen_de, case when o0.mh_id is not null then 'MH:' || o0.mh_ma end, 'KHAC') end as cd,
           case when p_cap = 'chu_de'
                then coalesce(o0.ten_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_ten_chu_de, 'Hình học') end, 'Chưa gán chủ đề')
                else coalesce(o0.ten_chuyen_de,
                              case when o0.mh_id is not null then
                                case when coalesce(o0.mh_ten, '') = '' then 'Hình học'
                                     when o0.mh_ten ilike 'hình%' then o0.mh_ten
                                     else 'Hình: ' || o0.mh_ten end end,
                              'Chưa gán chuyên đề') end as ten,
           -- luật CEO 23/10: chỉ CHỦ ĐỀ "Các mô hình … nâng cao" ⇒ Nâng cao (không xét tên chuyên đề)
           coalesce(o0.ten_chu_de, o0.mh_ten_chu_de, '') ilike 'các mô hình%nâng cao%' as nc
      from o0
  ),
  g as (select o.*, gr.hoc_sinh_id, gr.diem_dat from o join gami_grades gr on gr.problem_id = o.id),
  don_vi as (
    select g.hoc_sinh_id, g.cd, g.diem_dat as dat, g.diem_toi_da as toi_da
      from g where g.diem_toi_da is not null and g.diem_dat is not null
    union all
    select g.hoc_sinh_id, g.cd, sum(g.diem_dat), max(g.bai_tong)
      from g where g.bai_tong is not null
     group by g.hoc_sinh_id, g.cd, g.buoi_hoc_id, g.bai_k
    having count(g.diem_dat) = (select count(*) from o o2 where o2.buoi_hoc_id = g.buoi_hoc_id and o2.bai_k = g.bai_k and o2.bai_tong is not null)
  ),
  pct as (
    select hoc_sinh_id, cd, round(100 * sum(dat) / sum(toi_da)) as p
      from don_vi group by hoc_sinh_id, cd having sum(toi_da) > 0
  ),
  hs as (
    -- lớp của em: lớp của buổi (MT) — kỳ khảo sát chung thì lớp hiện tại của em trong môn của đề
    select distinct on (g.hoc_sinh_id) g.hoc_sinh_id, coalesce(buoi.lop_id, lh.id) as lop_id, coalesce(buoi.ten_lop, lh.ten_lop) as ten_lop
      from g join buoi on buoi.id = g.buoi_hoc_id
      left join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.hoc_sinh_id = g.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                            and l.mon = (select mon from tai_lieu where id = p_de)
                          order by hl.ngay_vao desc nulls last limit 1) lh on buoi.lop_id is null
     order by g.hoc_sinh_id, buoi.lop_id nulls last, buoi.ten_lop
  ),
  diem as (
    select dt.hoc_sinh_id, round(avg(dt.diem), 2) as diem
      from diem_thi dt join ky_thi k on k.id = dt.ky_thi_id and k.loai in ('mt_sat_hach', 'khao_sat_thang')
     where k.buoi_hoc_id in (select id from buoi) and dt.diem is not null
     group by dt.hoc_sinh_id
  ),
  xep as (
    select hs.*, x.ho_ten, d.diem,
           case when d.diem is not null then rank() over (order by d.diem desc nulls last) end as hang
      from hs join hoc_sinh x on x.id = hs.hoc_sinh_id left join diem d on d.hoc_sinh_id = hs.hoc_sinh_id
  ),
  cot as (select cd, min(ten) as ten, min(problem_no) as tt, bool_or(nc) as nc from o group by cd)
  select jsonb_build_object(
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', cd, 'ten', ten, 'nang_cao', nc) order by nc, tt, ten) from cot), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', xe.hoc_sinh_id, 'ten', xe.ho_ten, 'lop_id', xe.lop_id, 'lop', xe.ten_lop, 'diem', xe.diem, 'hang', xe.hang,
              'o', coalesce((select jsonb_object_agg(p.cd, p.p) from pct p where p.hoc_sinh_id = xe.hoc_sinh_id), '{}'::jsonb))
            order by xe.hang nulls last, xe.ho_ten) from xep xe), '[]'::jsonb),
    'so_co_diem', (select count(*) from diem)
  )
$function$
;
-- fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
CREATE OR REPLACE FUNCTION public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare
  v_ky ky_hoc;
  v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu date; v_het date; v_cuoi date; v_60 date;
  v_lop record; v_hs record; v_gv text; v_bc bao_cao_ph_ky;
  v_out jsonb;
begin
  select * into v_ky from ky_hoc where id = p_ky;
  if v_ky.id is null then raise exception 'Không có kì %', p_ky; end if;
  v_tu   := (v_ky.tu_thang || '-01')::date;
  v_het  := ((v_ky.den_thang || '-01')::date + interval '1 month')::date;
  v_cuoi := least(v_het - 1, v_homnay);
  v_60   := v_cuoi - 59;   -- 60 ngày tính cả ngày cuối (Thùy 04/11: đếm theo LẦN nên nới từ 45)
  select h.id, h.ho_ten, h.ma_hs into v_hs from hoc_sinh h where h.id = p_hs;
  select l.id, l.ten_lop, l.khoi into v_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;
  select ns.ho_ten into v_gv from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
   where pc.lop_id = v_lop.id and pc.vai_tro = 'gv' and pc.la_chinh limit 1;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;

  with c as materialized (
    select x.* from public._dbht_cau(array[p_hs], least(v_tu, v_60), p_mon) x where x.ngay <= v_cuoi
  ),
  dv_cd as (select distinct chu_de_id as ma from c),
  dv_ch as (select distinct chuyen_de_id as ma, chu_de_id as chu_de from c),   -- 1 chuyên đề có thể ở nhiều chủ đề ⇒ theo CẶP
  -- LUẬT ĐÁNH GIÁ (Thùy 04/11, đo trên K9 so với luật đếm câu): đếm theo LẦN đánh giá (1 buổi ET/BTVN/MT hay 1 bài app = 1 lần, nhiều câu
  -- trong lần vẫn 1 phiếu; điểm lần = TB các câu của đơn vị trong lần). Chủ đề: 10 lần gần nhất, trọng số 6-6-4-4-4-4-3-3-3-3; chuyên đề:
  -- 5 lần gần nhất, trọng số 6-4-4-3-3 (lần gần nhất nặng nhất). Cửa sổ 60 ngày cuối kì. Tính cho MỌI em cùng khối × môn ⇒ hạng của em
  -- trong từng đơn vị (chỉ xếp em có lần đánh giá ở đơn vị đó, bằng % thì cùng hạng); % của em lấy từ chính tập này (một nơi tính).
  ds_khoi as (
    select array(select distinct x from unnest(array_agg(hl.hoc_sinh_id) || array[p_hs]) x) as ids
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_lop.khoi
  ),
  ck as materialized (
    select x.* from public._dbht_cau((select ids from ds_khoi), v_60, p_mon) x where x.ngay <= v_cuoi
  ),
  lan_cd as (   -- 1 dòng / (em, chủ đề, lần)
    select hoc_sinh_id, chu_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, luot
  ),
  lan_ch as (   -- 1 dòng / (em, chủ đề, chuyên đề, lần)
    select hoc_sinh_id, chu_de_id as chu_de, chuyen_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, chuyen_de_id, luot
  ),
  r_cd as (select l.*, row_number() over (partition by hoc_sinh_id, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_cd l),
  r_ch as (select l.*, row_number() over (partition by hoc_sinh_id, chu_de, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_ch l),
  k_cd as (
    select z.*, rank() over (partition by ma order by p desc)::int as hang, count(*) over (partition by ma)::int as tong
      from (select hoc_sinh_id, ma,
                   round(100 * sum(g * (array[6,6,4,4,4,4,3,3,3,3])[rn]) / sum((array[6,6,4,4,4,4,3,3,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_cd where rn <= 10 group by hoc_sinh_id, ma) z
  ),
  k_ch as (
    select z.*, rank() over (partition by chu_de, ma order by p desc)::int as hang, count(*) over (partition by chu_de, ma)::int as tong
      from (select hoc_sinh_id, chu_de, ma,
                   round(100 * sum(g * (array[6,4,4,3,3])[rn]) / sum((array[6,4,4,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_ch where rn <= 5 group by hoc_sinh_id, chu_de, ma) z
  ),
  p_cd as (select ma, p, n, hang, tong from k_cd where hoc_sinh_id = p_hs),
  p_ch as (select ma, chu_de, p, n, hang, tong from k_ch where hoc_sinh_id = p_hs),
  t_cd as (
    select dv.ma,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, lc.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, lc.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join lyhoa_bdm_chu_de lc on lc.id = dv.ma
      left join dai_bdm_chu_de dc on dc.id = case when dv.ma like 'H:%' then substr(dv.ma, 3) else dv.ma end
  ),
  -- Tag Cơ bản / Nâng cao cho chuyên đề ĐẠI SỐ (nhánh 'toan'; Hình, HGT, KHTN không tag — Thùy 04/11): theo ĐA SỐ độ khó các dạng bài
  -- của cặp (chủ đề, chuyên đề) trên bản đồ (muc_do ≤3 cơ bản, ≥4 nâng cao — cùng ngưỡng report tháng); hoà ⇒ nâng cao; không dạng nào có độ khó ⇒ không tag.
  tag as (
    select n.chu_de_id as chu_de, n.chuyen_de_id as ma,
           case when count(db.muc_do) = 0 then null
                when count(*) filter (where db.muc_do >= 4) >= count(*) filter (where db.muc_do <= 3) then 'nang_cao' else 'co_ban' end as muc
      from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.nhanh = 'toan'
      join dai_bdm_dang_bai db on db.nhom_id = n.id
     where n.chu_de_id in (select chu_de from dv_ch)
     group by n.chu_de_id, n.chuyen_de_id
  ),
  t_ch as (
    select dv.ma, dv.chu_de,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, lch.ten, hmh.ten, nmh.ten, dch.ten, dv.ma) as ten,
           coalesce(ko.thu_tu, lo.thu_tu, hmh.thu_tu, nmh.thu_tu, dbo.thu_tu, 9999) as tt
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join lyhoa_bdm_chuyen_de lch on lch.id = dv.ma
      left join hinh_mo_hinh hmh on dv.ma like 'H:%' and hmh.id::text = substr(dv.ma, 3)      -- 09/11: chuyên đề Hình = mô hình (§13.6)
      left join hinh_nhom_mo_hinh nmh on dv.ma like 'H:%' and nmh.id::text = substr(dv.ma, 3)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join lyhoa_bdm_o lo on lo.chuyen_de_id = dv.ma and lo.chu_de_id = dv.chu_de
      left join dai_bdm_o dbo on dbo.chuyen_de_id = dv.ma and dbo.chu_de_id = dv.chu_de
  ),
  -- LẦN THI trong kì của KHỐI em (mọi em của khối — dùng cho hạng, TB lần thi và phụ lục)
  kt as (
    select k.id, k.loai, coalesce(k.ngay, b.ngay) as ngay,
           public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, b.ngay)) as thang
      from ky_thi k left join buoi_hoc b on b.id = k.buoi_hoc_id
     where k.loai in ('mt_sat_hach', 'khao_sat_thang') and k.mon = p_mon and k.khoi = v_lop.khoi
       and coalesce(k.ngay, b.ngay) is not null
  ),
  kt2 as (select * from kt where thang between v_ky.tu_thang and v_ky.den_thang),
  d as (
    select kt2.loai, kt2.thang, dt.hoc_sinh_id, avg(dt.diem) as diem, min(kt2.ngay) as ngay
      from diem_thi dt join kt2 on kt2.id = dt.ky_thi_id
     where dt.diem is not null
     group by kt2.loai, kt2.thang, dt.hoc_sinh_id
  ),
  lan as (
    select d.*, rank() over (partition by loai, thang order by diem desc)::int as hang,
           count(*) over (partition by loai, thang)::int as n_mau,
           avg(diem) over (partition by loai, thang) as tb
      from d
  ),
  cot0 as (select loai, thang, min(ngay) as ngay from lan group by loai, thang),
  cot as (   -- các lần thi của khối, theo thời gian (cột phụ lục + trục đồ thị). Nhãn cho PH (Thùy 04/11): MT = "T8", khảo sát = "Khảo sát 1, 2…" theo thứ tự trong kì
    select loai, thang, ngay,
           case loai when 'mt_sat_hach' then 'T' || ltrim(substr(thang, 6, 2), '0')
                else 'KS' || row_number() over (partition by loai order by ngay, thang) end as nhan,   -- Thùy 04/11: viết tắt, cột không bị phình
           row_number() over (order by ngay, loai) as stt
      from cot0
  ),
  hang_tb as (   -- hạng TB các lần em ĐÃ thi ⇒ xếp hạng lại (Thùy 04/11)
    select hoc_sinh_id, avg(hang) as hang_tb, avg(diem) as diem_tb, count(*)::int as so_lan from lan group by hoc_sinh_id
  ),
  ky_hang as (
    select h.*, rank() over (order by h.hang_tb asc)::int as hang, count(*) over ()::int as tong from hang_tb h
  ),
  lop_hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id in (select hoc_sinh_id from ky_hang)
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  cc as (
    select count(*) filter (where h.diem_danh = 'vang')::int as vang,
           count(*) filter (where h.diem_danh = 'vang_phep')::int as vang_phep,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(h.diem_danh)::int as tong
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai is distinct from 'huy'
      join lop l on l.id = b.lop_id and l.mon = p_mon
     where h.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
  ),
  bt as (   -- BTVN: buổi thường của lớp môn này + ca bù cho buổi của môn này
    select k.trang_thai_nop, k.thai_do
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.trang_thai is distinct from 'huy'
      left join lop l on l.id = b.lop_id
     where k.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
       and ((b.loai = 'thuong' and l.mon = p_mon)
         or (b.loai = 'bu' and exists (select 1 from buoi_hoc_hs hh join buoi_hoc me on me.id = hh.bu_cho_buoi_id
                                                join lop lm on lm.id = me.lop_id and lm.mon = p_mon
                                        where hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = p_hs)))
       and (k.trang_thai_nop is not null or k.thai_do is not null)
  ),
  -- GỢI Ý (spec §D, Thùy 05/11) — GV duyệt trên màn nhập, không tự ghi vào báo cáo.
  em_lan as (   -- các lần thi CỦA EM trong kì
    select l.diem, l.diem - l.tb as chenh, l.hang, l.n_mau,
           row_number() over (order by l.ngay desc, l.loai) as rn_moi,
           row_number() over (order by l.ngay asc, l.loai) as rn_cu,
           count(*) over () as n
      from lan l where l.hoc_sinh_id = p_hs
  ),
  dd as (
    -- điểm dự đoán = TB điểm, trọng số lần gần nhất 6-4-3-3 · sai số = max(0,75; 1,5 × độ lệch chuẩn của CHÊNH so TB lần thi), 1 lần ⇒ 1,0
    -- (backtest T10, 254 em: lệch TB 0,97; 65% lọt khoảng). Bội 0,25.
    -- tang = chênh TB nửa sau kì − nửa đầu kì (mỗi nửa = floor(n/2) lần; lẻ thì bỏ lần giữa) · top = mọi lần trong top 20%.
    select count(*)::int as n,
           least(10, greatest(0, round(4 * sum(diem * (case rn_moi when 1 then 6 when 2 then 4 else 3 end))
                                      / nullif(sum(case rn_moi when 1 then 6 when 2 then 4 else 3 end), 0)) / 4)) as du_doan,
           case when count(*) < 2 then 1.0 else greatest(0.75, round(4 * 1.5 * stddev_pop(chenh)) / 4) end as sai_so,
           avg(chenh) filter (where rn_moi <= floor(n / 2.0)) - avg(chenh) filter (where rn_cu <= floor(n / 2.0)) as tang,
           bool_and(hang::numeric / n_mau <= 0.2) as top
      from em_lan
  ),
  bt_so as (   -- BTVN cho gợi ý "Về nhà": mẫu = buổi đã ghi trạng thái nộp, bỏ xin phép
    select count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int as dat,
           count(*) filter (where trang_thai_nop is not null and trang_thai_nop <> 'xin_phep')::int as mau,
           count(*) filter (where trang_thai_nop = 'khong_lam')::int as kl,
           count(*) filter (where trang_thai_nop = 'nop_muon')::int as nm,
           count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int as knt
      from bt
  ),
  gy as (   -- mức gợi ý cho mục 🤖 — ngưỡng đọc từ danh mục (Thùy sửa trên ERP)
    select m.ma,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 then null
                               when 100.0 * b.dat / b.mau >= m.nguong_tot then 'tot'
                               when 100.0 * b.dat / b.mau < m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'can_than' then case when d.n < 2 then null
                               when coalesce(v_bc.sai_so, d.sai_so) <= m.nguong_tot then 'tot'
                               when coalesce(v_bc.sai_so, d.sai_so) >= m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'tien_bo_diem' then case when d.n < 2 then null
                               when d.top or d.tang >= m.nguong_tot then 'tot'
                               when d.tang <= m.nguong_chua_tot then 'chua_tot' else 'on' end
      end as muc_do,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 or b.kl + b.nm + b.knt = 0 then null
                              when b.kl >= b.nm and b.kl >= b.knt then 'khong_lam'
                              when b.nm >= b.knt then 'nop_muon' else 'khong_nghiem_tuc' end
        when 'tien_bo_diem' then case when d.n >= 2 and d.top then 'top' end
      end as khoa,
      case m.goi_y
        when 'btvn' then jsonb_build_object('dat', b.dat, 'mau', b.mau, 'khong_lam', b.kl, 'nop_muon', b.nm, 'chua_nghiem_tuc', b.knt)
        when 'can_than' then jsonb_build_object('sai_so', coalesce(v_bc.sai_so, d.sai_so), 'tu_gv', v_bc.sai_so is not null, 'so_lan', d.n)
        when 'tien_bo_diem' then jsonb_build_object('tang', round(d.tang, 2), 'top', d.top, 'so_lan', d.n)
      end as so
      from bc_ky_nx_muc m cross join bt_so b cross join dd d
     where m.goi_y is not null and m.xoa_at is null
  )
  select jsonb_build_object(
    'phien_ban', 3,
    'tinh_luc', now(),
    'hs', jsonb_build_object('id', v_hs.id, 'ho_ten', v_hs.ho_ten, 'ma_hs', v_hs.ma_hs),
    'lop', jsonb_build_object('id', v_lop.id, 'ten', v_lop.ten_lop, 'khoi', v_lop.khoi),
    'mon', p_mon,
    'gv', v_gv,
    'ky', jsonb_build_object('id', v_ky.id, 'ten', v_ky.ten, 'tu_thang', v_ky.tu_thang, 'den_thang', v_ky.den_thang),
    -- PHẦN 1 — Đánh giá: cây chủ đề → chuyên đề
    'danh_gia', jsonb_build_object(
      'tu', v_60, 'den', v_cuoi, 'n_chu_de', 10, 'n_chuyen_de', 5, 'luat', 'lan',
      'chu_de', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ma', t.ma, 'ten', t.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 10, 'hang', p.hang, 'tong', p.tong,
                 'chuyen_de', coalesce((
                   select jsonb_agg(jsonb_build_object('ma', ch.ma, 'ten', ch.ten, 'p', pc.p, 'n', coalesce(pc.n, 0), 'n_toi_da', 5, 'muc', tg.muc,
                                                      'hang', pc.hang, 'tong', pc.tong)
                                    order by ch.tt, ch.ten)
                     from t_ch ch left join p_ch pc on pc.ma = ch.ma and pc.chu_de = ch.chu_de
                     left join tag tg on tg.ma = ch.ma and tg.chu_de = ch.chu_de
                    where ch.chu_de = t.ma), '[]'::jsonb))
               order by t.tt, t.ten)
          from t_cd t left join p_cd p on p.ma = t.ma), '[]'::jsonb)),
    -- PHẦN 2 — Kết quả thi của em (bảng + đồ thị) và hạng cả kì theo HẠNG TB
    'thi', coalesce((select jsonb_agg(jsonb_build_object(
                       'loai', l.loai, 'nhan', ct.nhan, 'thang', l.thang, 'ngay', l.ngay,
                       'diem', round(l.diem, 2), 'tb', round(l.tb, 2), 'chenh', round(l.diem, 2) - round(l.tb, 2),   -- điểm 2 chữ số (Thùy 04/11)
                       'n_mau', l.n_mau, 'hang', l.hang)
                     order by ct.stt) from lan l join cot ct using (loai, thang) where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'hang_tb', round(k.hang_tb, 1),
                                          'diem_tb', round(k.diem_tb, 2), 'so_lan', k.so_lan)
                  from ky_hang k where k.hoc_sinh_id = p_hs),
    -- PHẦN 3 — Thái độ học tập
    'thai_do', jsonb_build_object(
      'chuyen_can', (select to_jsonb(cc) from cc),
      'btvn', (select jsonb_build_object(
                 'tong', count(*)::int,
                 -- đạt chuẩn = nộp đúng hạn + thái độ không bị ghi chưa nghiêm túc / chống đối (Thùy 04/11)
                 'dat_chuan', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                 and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 -- NHÓM KHÔNG TRÙNG (Thùy 04/11 — PH cộng các ô phải ra đúng tổng): dat_chuan + dung_han_chua_nt + nop_muon + khong_lam
                 -- + xin_phep + chua_ghi = tong. khong_nghiem_tuc / chong_doi bên dưới là số ĐẾM CHỒNG (chỉ để ghi chú "trong đó…").
                 'dung_han_chua_nt', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                        and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chua_ghi', count(*) filter (where trang_thai_nop is null)::int,
                 'khong_lam', count(*) filter (where trang_thai_nop = 'khong_lam')::int,
                 'nop_muon', count(*) filter (where trang_thai_nop = 'nop_muon')::int,
                 'xin_phep', count(*) filter (where trang_thai_nop = 'xin_phep')::int,
                 'khong_nghiem_tuc', count(*) filter (where thai_do in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chong_doi', count(*) filter (where thai_do = 'chong_doi')::int) from bt)),
    -- PHẦN 4 — GV nhập: KHÔNG ở đây — ghép bằng _bc_ky_phan_gv lúc trả (mig 202611051704, để số liệu chốt dùng chung)
    'goi_y', (select jsonb_build_object(
                'du_doan', case when d.n > 0 then d.du_doan end,
                'sai_so', case when d.n > 0 then d.sai_so end,
                'so_lan', d.n,
                'muc', coalesce((select jsonb_object_agg(g.ma, jsonb_build_object('muc_do', g.muc_do, 'khoa', g.khoa, 'so', g.so)) from gy g), '{}'::jsonb))
                from dd d),
    -- PHẦN 5 — Phụ lục: toàn bộ em cùng khối × môn có ≥1 lần thi trong kì, xếp theo hạng TB
    'phu_luc', jsonb_build_object(
      'cot', coalesce((select jsonb_agg(jsonb_build_object('nhan', nhan, 'ngay', ngay) order by stt) from cot), '[]'::jsonb),
      'hs', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ten', hs.ho_ten, 'lop', lh.ten_lop, 'la_em', k.hoc_sinh_id = p_hs,
                 'diem', (select jsonb_agg((select round(l.diem, 2) from lan l where l.hoc_sinh_id = k.hoc_sinh_id
                                              and l.loai = ct.loai and l.thang = ct.thang) order by ct.stt) from cot ct),
                 'hang_tb', round(k.hang_tb, 1), 'hang', k.hang)
               order by k.hang, hs.ho_ten)
          from ky_hang k join hoc_sinh hs on hs.id = k.hoc_sinh_id left join lop_hs lh on lh.hoc_sinh_id = k.hoc_sinh_id), '[]'::jsonb))
  ) into v_out;
  return v_out || public._bc_ky_phan_gv(p_hs, p_mon, p_ky, v_out -> 'goi_y');
end
$function$
;
-- _btvn_app_tu_dong()
CREATE OR REPLACE FUNCTION public._btvn_app_tu_dong()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; h record;
  v_dong int := 0; v_tre int := 0; v_hs int := 0; v_rut int := 0; v_n int; v_doi boolean;
  v_ly_do constant text := 'Máy tự rút (Thùy 04/11): BTVN app cấp 3 tự đóng đúng giờ hết hạn — TA không cần đóng';
begin
  for r in
    select b.id, b.lop_id, b.ngay, b.btvn_dong_at, t.id as test_id, t.deadline,
           greatest(t.so_cau, (select count(distinct c.thu_tu) from bai_test_cau c where c.bai_test_id = t.id))::int as so_cau
      from buoi_hoc b
      join lop l on l.id = b.lop_id and l.khoi in ('10', '11', '12')       -- cấp 3
      join lateral (select bt.* from bai_test bt
                     where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'btvn' and bt.hoc_sinh_id is null
                     order by bt.created_at desc limit 1) t on true
     where b.loai = 'thuong' and b.trang_thai <> 'huy'
       and t.deadline is not null and t.deadline <= now()
       -- chưa đóng · hoặc MÁY đã đóng (giờ đóng = đúng giờ hạn). Buổi TA tự đóng ⇒ giữ nguyên quyết định của TA, không nhận bài muộn tự động.
       and (b.btvn_dong_at is null or b.btvn_dong_at = t.deadline)
       and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date - 30
       -- có bài nộp ẢNH ⇒ TA phải chấm ảnh, để TA đóng như cũ
       and not exists (select 1 from btvn_nop n where n.buoi_hoc_id = b.id)
       -- chưa em nào làm trên app ⇒ nhiều khả năng lớp làm GIẤY, không tự gán "Không làm bài" cho cả lớp
       and exists (select 1 from bai_lam bl join bai_lam_cau x on x.bai_lam_id = bl.id
                    where bl.bai_test_id = t.id and x.dap_an_hs is not null)
  loop
    -- ⓪ Buổi CHƯA có lưới chấm BTVN (lưới vốn chỉ dựng khi TA mở tab chấm) ⇒ dựng như màn chấm (syncDocProblems: chưa có ô nào ⇒
    --    mỗi câu 1 ô, gắn ma_cau + dạng = dạng bài bản đồ mới nếu có, không thì dang_chinh). Câu lấy từ BÀI APP (biến thể 1 theo thứ tự),
    --    vốn sinh từ phiếu BTVN của buổi. Đã có ô ⇒ không đụng (lưới bám phiếu là việc của màn chấm).
    if not exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = r.id and sp.phase = 'btvn') then
      insert into gami_session_problems (buoi_hoc_id, phase, problem_no, ma_cau, ma_dang)
      select r.id, 'btvn', (row_number() over (order by x.thu_tu))::int, x.ma_cau,
             coalesce((select d.ma_dang from fn_bdm_dang_cua_cau(array[x.ma_cau]) d limit 1),
                      (select k.dang_chinh from (select q.dang_chinh from dai_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hgt_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from khtn_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from lyhoa_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hinh_hoc_cau_hoi q where q.ma_cau = x.ma_cau) k limit 1))
        from (select distinct on (bc.thu_tu) bc.thu_tu, bc.ma_cau from bai_test_cau bc
               where bc.bai_test_id = r.test_id and bc.bien_the = 1 and bc.ma_cau is not null order by bc.thu_tu) x
      on conflict (buoi_hoc_id, phase, problem_no) do nothing;
    end if;

    -- ① Đổ kết quả app vào lưới (kể cả khi đã đóng — bài làm sau hạn vẫn vào, tính nộp muộn) + trạng thái của em làm HẾT
    perform public._btvn_online_dong_bo_core(r.id, true);
    v_doi := false;

    -- ② Trạng thái nộp + thái độ của em CÓ MẶT (hoặc có bài làm) theo bài làm app — chỉ điền chỗ còn TRỐNG,
    --    và nâng "Không làm bài" → nộp khi em làm sau đó (Thùy 04/11: "vẫn cho làm, nhưng tính là nộp muộn").
    for h in
      with hs as (
        select x.hoc_sinh_id from buoi_hoc_hs x where x.buoi_hoc_id = r.id and x.diem_danh = 'co_mat'
        union
        select bl.hoc_sinh_id from bai_lam bl
         where bl.bai_test_id = r.test_id
           and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = r.id and x.hoc_sinh_id = bl.hoc_sinh_id)
      ),
      lam as (
        select bl.hoc_sinh_id,
               count(distinct bc.thu_tu) filter (where x.dap_an_hs is not null) as da_tra_loi,
               min(x.cham_at) filter (where x.dap_an_hs is not null) as luc_dau
          from bai_lam bl
          join bai_lam_cau x on x.bai_lam_id = bl.id
          join bai_test_cau bc on bc.id = x.bai_test_cau_id
         where bl.bai_test_id = r.test_id
         group by bl.hoc_sinh_id
      )
      select hs.hoc_sinh_id, coalesce(lam.da_tra_loi, 0)::int as da_tra_loi, lam.luc_dau,
             k.trang_thai_nop, k.thai_do
        from hs
        left join lam on lam.hoc_sinh_id = hs.hoc_sinh_id
        left join btvn_ket_qua k on k.buoi_hoc_id = r.id and k.hoc_sinh_id = hs.hoc_sinh_id
    loop
      if h.da_tra_loi = 0 then
        -- bỏ trống ⇒ Không làm bài (chỉ khi BTVN chưa đóng — sau khi đóng, ô trống đã được chốt lúc hết hạn)
        if r.btvn_dong_at is null and h.trang_thai_nop is null then
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
          values (r.id, h.hoc_sinh_id, 'khong_lam', now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update set trang_thai_nop = 'khong_lam', updated_at = now()
            where btvn_ket_qua.trang_thai_nop is null;
          v_hs := v_hs + 1; v_doi := true;
        end if;
      else
        -- có trả lời ⇒ có làm: trước hạn = đúng hạn · sau hạn = nộp muộn. Đè được ô trống hoặc "Không làm bài".
        if h.trang_thai_nop is null or (h.trang_thai_nop = 'khong_lam' and r.btvn_dong_at is not null) then   -- 'Không làm bài' chỉ do máy chốt lúc hết hạn mới được nâng
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
          values (r.id, h.hoc_sinh_id, case when h.luc_dau > r.deadline then 'nop_muon' else 'nop_dung_han' end, now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update
            set trang_thai_nop = excluded.trang_thai_nop, updated_at = now()
            where btvn_ket_qua.trang_thai_nop is null or (btvn_ket_qua.trang_thai_nop = 'khong_lam' and r.btvn_dong_at is not null);
          v_hs := v_hs + 1; v_doi := true;
          if r.btvn_dong_at is not null then v_tre := v_tre + 1; end if;
        end if;
        -- không điền đủ đáp án ⇒ thái độ "Chưa nghiêm túc" (chỉ khi thái độ còn trống — không đè TA)
        if h.da_tra_loi < r.so_cau and h.thai_do is null then
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, thai_do, updated_at)
          values (r.id, h.hoc_sinh_id, 'chua_nghiem_tuc', now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update set thai_do = 'chua_nghiem_tuc', updated_at = now()
            where btvn_ket_qua.thai_do is null;
          v_doi := true;
        end if;
      end if;
    end loop;

    if r.btvn_dong_at is null then
      -- ③ Đóng y đường TA bấm (EXP tháng + hoàn tất + trả bài), rồi ghi giờ đóng = ĐÚNG giờ hết hạn (không ai bị tính trễ).
      perform public.fn_dong_btvn(r.id);
      update buoi_hoc set btvn_dong_at = r.deadline where id = r.id and btvn_dong_at is distinct from r.deadline;
      v_dong := v_dong + 1;
      update gay_de_xuat set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null, ly_do_bo_qua = v_ly_do
       where trang_thai = 'cho' and nguon = 'vanhanh' and ref_key like 'vh:' || r.id::text || '|btvn|%';
      get diagnostics v_n = row_count; v_rut := v_rut + v_n;
    elsif v_doi then
      -- đã đóng mà trạng thái đổi (bài nộp muộn) ⇒ EXP tháng tính lại (EXP BTVN đọc trạng thái nộp)
      perform public.fn_recompute_exp_thang(r.lop_id, to_char(r.ngay, 'YYYY-MM'));
    end if;
  end loop;
  return jsonb_build_object('dong', v_dong, 'hs_ghi', v_hs, 'nop_muon_sau_dong', v_tre, 'rut_gay', v_rut);
end $function$
;
-- fn_btvn_ai_du_lieu(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
CREATE OR REPLACE FUNCTION public.fn_btvn_ai_du_lieu(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select jsonb_build_object(
    'lop', l.ten_lop, 'khoi', l.khoi, 'mon', l.mon, 'ngay', b.ngay,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'problem_id', sp.id, 'so', sp.problem_no, 'ma_cau', sp.ma_cau, 'ma_dang', sp.ma_dang,
        'hinh', sp.hinh_baitoan_id is not null, 'hinh_nhan', sp.hinh_nhan,
        'loai_cau', coalesce(d.loai_cau, k.loai_cau, lh.loai_cau),
        'de_bai', coalesce(d.noi_dung, k.noi_dung, lh.noi_dung),
        'lua_chon', coalesce(d.lua_chon, k.lua_chon, lh.lua_chon),
        'menh_de', coalesce(d.menh_de, k.menh_de, lh.menh_de),
        'dap_an', coalesce(d.dap_an, k.dap_an, lh.dap_an),
        'loi_giai', coalesce(d.loi_giai, k.loi_giai, lh.loi_giai)) order by sp.problem_no)
      from gami_session_problems sp
      left join dai_cau_hoi d on l.mon = 'Toán' and d.ma_cau = sp.ma_cau
      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau
      left join lyhoa_cau_hoi lh on l.mon = 'Lý hóa' and lh.ma_cau = sp.ma_cau
      where sp.buoi_hoc_id = b.id and sp.phase = 'btvn' and not sp.ngoai_de), '[]'::jsonb),
    'anh', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'path', a.path, 'xoay', a.xoay) order by a.thu_tu, a.created_at)
      from btvn_nop_anh a where a.buoi_hoc_id = b.id and a.hoc_sinh_id = p_hoc_sinh_id and a.bo_at is null), '[]'::jsonb))
  into v
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.id = p_buoi_hoc_id;
  if v is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  return v;
end $function$
;
-- view v_btvn_dap_an
create or replace view public.v_btvn_dap_an as
 SELECT n.hoc_sinh_id,
    n.buoi_hoc_id,
    sp.problem_no,
    sp.ma_dang,
    sp.ma_cau,
    COALESCE(d.loai_cau, kk.loai_cau, lh.loai_cau) AS loai_cau,
    COALESCE(d.noi_dung, kk.noi_dung, lh.noi_dung) AS de_bai,
    COALESCE(d.lua_chon, kk.lua_chon, lh.lua_chon) AS lua_chon,
    COALESCE(d.menh_de, kk.menh_de, lh.menh_de) AS menh_de,
    COALESCE(d.dap_an, kk.dap_an, lh.dap_an) AS dap_an,
    COALESCE(d.loi_giai, kk.loi_giai, lh.loi_giai) AS loi_giai,
    COALESCE(d.anh_de, kk.anh_de, lh.anh_de) AS anh_de,
    COALESCE(d.anh_dap_an, kk.anh_dap_an, lh.anh_dap_an) AS anh_dap_an
   FROM btvn_nop n
     JOIN buoi_hoc b ON b.id = n.buoi_hoc_id
     LEFT JOIN lop l ON l.id = b.lop_id
     JOIN gami_session_problems sp ON sp.buoi_hoc_id = n.buoi_hoc_id AND sp.phase = 'btvn'::text AND sp.ma_cau IS NOT NULL
     LEFT JOIN dai_cau_hoi d ON l.mon = 'Toán'::text AND d.ma_cau = sp.ma_cau
     LEFT JOIN khtn_cau_hoi kk ON l.mon = 'KHTN'::text AND kk.ma_cau = sp.ma_cau
     LEFT JOIN lyhoa_cau_hoi lh ON l.mon = 'Lý hóa'::text AND lh.ma_cau = sp.ma_cau
  WHERE n.tra_at IS NOT NULL;
-- _dtv_giay_thap(p_mon text)
CREATE OR REPLACE FUNCTION public._dtv_giay_thap(p_mon text)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
AS $function$ select case p_mon when 'Toán' then 40 when 'KHTN' then 25 when 'Lý hóa' then 25 else 10 end $function$
;
