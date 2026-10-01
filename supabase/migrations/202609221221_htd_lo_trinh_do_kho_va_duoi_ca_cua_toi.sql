-- ============================================================================
-- 202609221221 — htd_lo_trinh_do_kho_va_duoi_ca_cua_toi
-- ----------------------------------------------------------------------------
-- Thùy 22/09, 2 việc:
--
-- 1) htd_lo_trinh: sửa THỨ TỰ học trong 1 chuyên đề — trước giờ sort thuần theo
--    ma_dang (chữ), không biết gì về ĐỘ KHÓ. Luật đúng (CEO chốt): học hết ĐỘ KHÓ 1
--    rồi mới sang 2, hết 2 mới sang 3…; TRONG CÙNG độ khó thì theo thứ tự chỉ số
--    dạng (= thứ tự ma_dang, vốn đã đúng). Đổi CẢ 2 chỗ dùng thứ tự — khoá/mở
--    tuần tự (lag() over) VÀ thứ tự hiển thị cuối — để không lệch nhau. Thêm
--    muc_do vào jsonb output để dùng làm khoá sort (không đổi shape khác — client
--    đọc field `xong`/`mo` sẵn có, không cần biết muc_do).
--
-- 2) fn_duoi_ca_cua_toi(): RPC MỚI, soi gương fn_btyeu_ca_cua_toi — "ca đuổi đang
--    mở" của em (buổi loai=bo_tro_duoi, hôm nay, TA đã điểm danh có_mặt, buổi chưa
--    đóng đánh giá). App HS dùng để: (a) hiện banner "Bổ trợ" active y như Bổ trợ
--    yếu khi TA bấm Có mặt (Thùy: "app học sinh hiện lên như Bổ trợ yếu cũ thôi"),
--    (b) biết mon để mở thẳng "Lộ trình bổ trợ đuổi" (dùng LẠI htd_lo_trinh — CÙNG
--    dữ liệu với Học từ đầu, vì em có thể tự học thêm ở nhà ngoài giờ ca).
--
-- MẤT GÌ (Luật xoá): không — CREATE OR REPLACE htd_lo_trinh (không đổi tham số/
-- shape trả về, chỉ đổi thứ tự phần tử trong mảng + thêm 1 field `muc_do`); thêm
-- MỚI fn_duoi_ca_cua_toi, không đụng hàm nào khác.
-- ============================================================================

create or replace function public.htd_lo_trinh(p_mon text)
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
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
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
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
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
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
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from hgt_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;
  end if;

  -- Tuần tự mở/khoá THEO ĐỘ KHÓ trước (1→2→3…), trong cùng độ khó theo ma_dang —
  -- KHỚP đúng thứ tự hiển thị cuối bên dưới, không thì "mở" lệch với "nhìn thấy".
  with base as (
    select x, (htd.test_nop_at is not null) as xong, (htd.doc_ly_thuyet_at is not null) as doc_lt
    from jsonb_array_elements(v_out) x
    left join hoc_tu_dau_dang htd
      on htd.hoc_sinh_id = v_hs and htd.mon = p_mon and htd.ma_dang = x->>'ma_dang'
  ), tuan_tu as (
    select x, xong, doc_lt,
           lag(xong) over (partition by x->>'ma_chuyen_de' order by coalesce((x->>'muc_do')::int, 3), x->>'ma_dang') as xong_truoc
    from base
  )
  select coalesce(jsonb_agg(
    x || jsonb_build_object('doc_ly_thuyet', doc_lt, 'xong', xong, 'mo', coalesce(xong_truoc, true))
    order by x->>'ma_chu_de', x->>'ma_chuyen_de', coalesce((x->>'muc_do')::int, 3), x->>'ma_dang'
  ), '[]'::jsonb)
  into v_out
  from tuan_tu;

  return v_out;
end $function$;

-- Ca đuổi ĐANG MỞ của em (soi gương fn_btyeu_ca_cua_toi) — TA đã điểm danh có_mặt,
-- buổi hôm nay, chưa đóng đánh giá. Trả mon để app biết gọi htd_lo_trinh(mon) nào.
create or replace function public.fn_duoi_ca_cua_toi()
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  r record;
begin
  if v_hs is null then return null; end if;
  select b.id, b.gio_bat_dau, b.gio_ket_thuc, b.phong, y.id as case_id, l.mon,
         (select ho_ten from nhan_su where id = b.nguoi_day_tg) as ta_ten
    into r
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs and hh.bo_tro_duoi_id is not null
  join bo_tro_duoi y on y.id = hh.bo_tro_duoi_id
  join lop l on l.id = y.lop_id
  where b.loai = 'bo_tro_duoi' and b.trang_thai = 'mo'
    and b.ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null
  order by b.gio_bat_dau nulls last, b.created_at
  limit 1;
  if r.id is null then return null; end if;

  return jsonb_build_object(
    'buoi_id', r.id, 'mon', r.mon, 'gio_bat_dau', r.gio_bat_dau, 'gio_ket_thuc', r.gio_ket_thuc,
    'phong', r.phong, 'ta_ten', r.ta_ten);
end $function$;

grant execute on function public.htd_lo_trinh(text) to authenticated;
grant execute on function public.fn_duoi_ca_cua_toi() to authenticated;
