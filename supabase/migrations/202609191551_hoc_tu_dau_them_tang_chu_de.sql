-- ============================================================================
-- 202609191551 — hoc_tu_dau_them_tang_chu_de
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 19/09, sau khi xem bản đầu): "Học sinh chỉ được chọn tầng chuyên đề.
--   KHÔNG được chọn đến tầng dạng bài" — điều hướng ĐÚNG phải 3 bước: chọn CHỦ ĐỀ
--   (tầng trên cùng, vd "Số hữu tỉ và số thực") → chọn CHUYÊN ĐỀ trong chủ đề đó
--   (vd "Số hữu tỉ") → BẤM vào chuyên đề là tự động vào ĐÚNG dạng đang học (không
--   hiện danh sách dạng để chọn — HS không tự ý nhảy dạng). htd_lo_trinh bản đầu
--   (mig 202609191521) chỉ trả ma_chuyen_de/ten_chuyen_de — THIẾU tầng chủ đề phía
--   trên để client dựng đúng 3 bước. Thêm ma_chu_de/ten_chu_de vào output (đã có sẵn
--   trên *_ban_do, chỉ chưa SELECT ra).
--
-- MẤT GÌ: không mất — create or replace function, chỉ thêm field vào jsonb trả về.
-- ============================================================================

create or replace function public.htd_lo_trinh(p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_dang_can text[];
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  select coalesce(array_agg(distinct bdd.ma_dang), '{}') into v_dang_can
    from bo_tro_duoi bd join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi';
  if array_length(v_dang_can, 1) is null then return '[]'::jsonb; end if;

  if p_mon = 'KHTN' then
    v_dk := public._kho_dk_online_hs_sql('khtn_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang,
        'tong_cau', c.tong_cau
      ) order by bd.ma_dang), '[]'::jsonb)
      from khtn_ban_do bd
      join lateral (select count(*) as tong_cau from khtn_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from khtn_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_part;
  else
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang,
        'tong_cau', c.tong_cau
      ) order by bd.ma_dang), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from dai_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang,
        'tong_cau', c.tong_cau
      ) order by bd.ma_dang), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from hgt_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;
  end if;

  with base as (
    select x, (htd.test_nop_at is not null) as xong, (htd.doc_ly_thuyet_at is not null) as doc_lt
    from jsonb_array_elements(v_out) x
    left join hoc_tu_dau_dang htd
      on htd.hoc_sinh_id = v_hs and htd.mon = p_mon and htd.ma_dang = x->>'ma_dang'
  ), tuan_tu as (
    select x, xong, doc_lt,
           lag(xong) over (partition by x->>'ma_chuyen_de' order by x->>'ma_dang') as xong_truoc
    from base
  )
  select coalesce(jsonb_agg(
    x || jsonb_build_object('doc_ly_thuyet', doc_lt, 'xong', xong, 'mo', coalesce(xong_truoc, true))
    order by x->>'ma_chu_de', x->>'ma_chuyen_de', x->>'ma_dang'
  ), '[]'::jsonb)
  into v_out
  from tuan_tu;

  return v_out;
end $$;
grant execute on function public.htd_lo_trinh(text) to authenticated;
revoke execute on function public.htd_lo_trinh(text) from anon;
