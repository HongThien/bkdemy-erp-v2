-- ============================================================================
-- 202609191524 — hoc_tu_dau_khoa_mo
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202609191521 (htd_lo_trinh) trả 'xong' per dạng nhưng THIẾU 'mo'
-- (dạng có được BẤM VÀO không) — bỏ sót ngay khi viết, phát hiện lúc test tay.
-- Luật khoá/mở là PHÉP TÍNH NGHIỆP VỤ (CLAUDE.md §2.0: phải ở Postgres, không
-- suy ở client): dạng ĐẦU TIÊN trong chuyên đề (theo thứ tự ma_dang — xem giải
-- thích rủi ro ở mig 202609191521) luôn mở; dạng sau chỉ mở khi dạng NGAY TRƯỚC
-- (cùng chuyên đề) đã 'xong' (có bài test đã nộp).
--
-- MẤT GÌ: không mất — create or replace function, không đổi chữ ký/bảng.
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

  -- Gắn tiến độ + tính mo/khoá bằng LAG (thứ tự = ma_dang, gộp theo ma_chuyen_de).
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
    order by x->>'ma_chuyen_de', x->>'ma_dang'
  ), '[]'::jsonb)
  into v_out
  from tuan_tu;

  return v_out;
end $$;
grant execute on function public.htd_lo_trinh(text) to authenticated;
revoke execute on function public.htd_lo_trinh(text) from anon;
