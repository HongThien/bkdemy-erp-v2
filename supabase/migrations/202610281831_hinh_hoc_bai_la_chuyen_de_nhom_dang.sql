-- ============================================================================
-- 202610281831 — hinh_hoc_bai_la_chuyen_de_nhom_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/10 "Bản đồ kiến thức Hình – học cũng phải thay đổi theo bản đồ Đại mới. Mỗi bài hình – học là 1 chuyên đề —
--   bên trong có 1 nhóm bài — bên trong có 1 dạng bài — tất cả cùng tên luôn cho dễ đánh giá. Không còn cụm gì nữa."
--   CTO chọn: bài học (hinh_hoc_bai, mã gốc HH…) CHÍNH LÀ cả 3 tầng chuyên đề = nhóm = dạng bài (suy, không lưu bảng mới) —
--   tên 3 tầng luôn trùng vì là cùng 1 đối tượng; mã gốc / mastery (đo ở bài học) / giáo trình / bổ trợ không đổi gì.
--   Áp vào 2 chỗ đọc tầng:
--   ① Đánh giá cuối cấp (_dgcc_nut / _dgcc_ten): Hình học trước chỉ có tầng chủ đề ⇒ thêm tầng chuyên đề + nhóm = bài học.
--   ② Bản đồ phiêu lưu (_kho_ban_do_dong): chuyên đề Hình học = bài học (trước: 1 khu "Hình học", 8T gom theo ma_chuyen_de cũ).
--      Cột hinh_hoc_bai.ma_chuyen_de / ten_chuyen_de (8T có 6 nhóm) GIỮ NGUYÊN dữ liệu, chỉ thôi đọc.
--   Cụm: dữ liệu cụm Hình học (hinh_hoc_cum_bai + hinh_hoc_cau_hoi.ma_cum) CHƯA xoá — chờ Thùy gật (Luật xoá).
--
-- MẤT GÌ (Luật xoá): Không mất dữ liệu — chỉ đổi thân 3 hàm đọc.
-- ============================================================================

create or replace function _dgcc_nut(p_ma_cau text, p_ma_dang text, p_hbt uuid, p_cu boolean)
returns table (chu_de text, chuyen_de text, nhom text)
language plpgsql stable security definer set search_path to 'public' as $function$
declare v_mh uuid; v_cd text; v text; v_bai text; i integer := 0;
begin
  -- Hình luyện: bài mô hình → mô hình → chủ đề (của mô hình, nhóm mô hình, hoặc mô hình cha chính)
  if p_hbt is not null then select hb.mo_hinh_id into v_mh from hinh_baitoan hb where hb.id = p_hbt; end if;
  if v_mh is null and p_ma_dang is not null then
    select hb.mo_hinh_id into v_mh from hinh_baitoan hb where hb.ma = p_ma_dang order by hb.id limit 1;
  end if;
  if v_mh is not null then
    loop
      select coalesce(mh.chu_de_id, nm.chu_de_id) into v_cd
        from hinh_mo_hinh mh left join hinh_nhom_mo_hinh nm on nm.id = mh.nhom_mh_id where mh.id = v_mh;
      exit when v_cd is not null or i >= 8;
      select c.cha_id into v_mh from hinh_mo_hinh_cha c where c.mo_hinh_id = v_mh and c.chinh limit 1;
      exit when v_mh is null;
      i := i + 1;
    end loop;
    if v_cd is not null then return query select v_cd, null::text, null::text; end if;
    return;
  end if;

  -- Hình học: câu → bài học → chủ đề; bài học = chuyên đề = nhóm (Thùy 28/10, cùng tên)
  select hb.ma_bai, hb.chu_de_id into v_bai, v_cd from hinh_hoc_bai hb
   where hb.ma_bai = coalesce((select c.dang_chinh from hinh_hoc_cau_hoi c where c.ma_cau = p_ma_cau), p_ma_dang);
  if found then
    return query select v_cd, v_bai, v_bai;
    return;
  end if;

  -- Đại / HGT
  if p_cu then
    v := _do_nhom_cua_o(p_ma_cau, p_ma_dang);
    return query select b.ma_chu_de, b.ma_chuyen_de, null::text from dai_ban_do b
                  where b.ma_dang = v and b.xoa_at is null and not _kho_la_dang_cho(b.ma_dang);
    return;
  end if;
  v := _do_o_bdm(p_ma_cau, p_ma_dang);
  return query select n.chu_de_id, n.chuyen_de_id, n.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where d.id = v;
end $function$;

create or replace function _dgcc_ten(p_tang text, p_nut text, p_cha text)
returns table (ten text, thu_tu integer)
language sql stable security definer set search_path to 'public' as $function$
  select x.ten, x.thu_tu from (
    select cd.ten, cd.thu_tu, 1 as uu from dai_bdm_chu_de cd where p_tang = 'chu_de' and cd.id = p_nut
    union all
    select ch.ten, o.thu_tu, 1 from dai_bdm_chuyen_de ch left join dai_bdm_o o on o.chuyen_de_id = ch.id and o.chu_de_id = p_cha
     where p_tang = 'chuyen_de' and ch.id = p_nut
    union all
    select n.ten, n.thu_tu, 1 from dai_bdm_nhom n where p_tang = 'nhom' and n.id = p_nut
    union all
    -- Hình học: chuyên đề = nhóm = bài học (cùng tên, cùng thứ tự)
    select hb.ten_bai, hb.thu_tu::integer, 1 from hinh_hoc_bai hb where p_tang in ('chuyen_de', 'nhom') and hb.ma_bai = p_nut
    union all
    select b.ten_chu_de, null::integer, 2 from dai_ban_do b where p_tang = 'chu_de' and b.ma_chu_de = p_nut
    union all
    select b.ten_chuyen_de, null::integer, 2 from dai_ban_do b where p_tang = 'chuyen_de' and b.ma_chuyen_de = p_nut
  ) x order by x.uu limit 1
$function$;

create or replace function _kho_ban_do_dong(p_mon text, p_khoi text)
returns table (nhanh text, cautbl text, ma_chu_de text, ten_chu_de text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text, muc_do smallint)
language plpgsql stable as $function$
declare v_nh text; v_bd text;
begin
  foreach v_nh in array public._kho_ds_nhanh_khoi(p_mon, p_khoi) loop
    v_bd := public._kho_ban_do_tbl(p_mon, v_nh);
    if v_bd = 'hinh_hoc_bai' then
      -- Hình học: 1 lục địa "Hình học"; mỗi BÀI HỌC = 1 khu (chuyên đề) có đúng 1 màn (dạng) cùng tên (Thùy 28/10)
      return query execute format($q$
        select %L::text, %L::text, 'HINH_HOC'::text, 'Hình học'::text,
               b.ma_bai, coalesce(nullif(btrim(b.ten_dang), ''), b.ten_bai),
               b.ma_bai, coalesce(nullif(btrim(b.ten_dang), ''), b.ten_bai), b.muc_do::smallint
        from hinh_hoc_bai b where b.khoi = $1
        order by b.thu_tu, b.ma_bai
      $q$, v_nh, public._kho_cau_tbl(p_mon, v_nh)) using p_khoi;
    else
      return query execute format($q$
        select %L::text, %L::text, b.ma_chu_de, b.ten_chu_de, b.ma_chuyen_de, b.ten_chuyen_de, b.ma_dang, b.ten_dang, b.muc_do::smallint
        from %I b where b.khoi = $1
      $q$, v_nh, public._kho_cau_tbl(p_mon, v_nh), v_bd) using p_khoi;
    end if;
  end loop;
end $function$;
