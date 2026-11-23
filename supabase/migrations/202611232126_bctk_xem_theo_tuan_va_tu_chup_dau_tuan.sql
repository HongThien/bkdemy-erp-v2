-- ============================================================================
-- 202611232126 — bctk_xem_theo_tuan_va_tu_chup_dau_tuan   (Thùy 23/11)
-- ----------------------------------------------------------------------------
-- 1. "Phòng làm việc Giám đốc: tab Tuần này phải đổi thành kiểu view theo tuần — xem được bản chốt tuần trước."
--    fn_bctk_tuan(p_tuan): tuần đang chạy ⇒ đúng fn_bctk_hien_tai (sổ bctk_so_hien_tai_o) · tuần đã đóng ⇒ đọc SỔ CHỐT bctk_so_tuan_o
--    (chốt một lần, bất biến — mig 202611181732). Cùng hình dạng jsonb ⇒ màn dùng chung một bảng.
--    fn_bctk_tuan_o(p_mon, p_khoi, p_tuan): bấm một khối = tính đúng khối đó cho tuần đang xem (bấm đến đâu gọi đến đấy).
--    fn_bctk_hien_tai / fn_bctk_hien_tai_o giữ chữ ký, gọi sang hàm mới (MỘT nguồn).
-- 2. "Trưởng khối nói nhóm yếu các thứ ko tự tổng kết": ảnh dạng yếu / nhóm yếu đầu tuần 23/11 KHÔNG có ⇒ tuần 16–22/11 không chốt được
--    (_bctk_so_tuan_chot cần ảnh cuối tuần) và tab tuần đang chạy thiếu số "đầu tuần". Gốc: lịch cron riêng 'tu-dong-sang-t2'
--    (mig 202611031347, ngoài bộ điều phối) không chạy được đêm 22/11 — chạy 15/11 thì có (troly_tuan_so_luu.tinh_luc 15/11 17:05 UTC).
--    Sửa: đăng ký vào bộ điều phối (luật 16/11) qua _tu_dong_sang_t2_neu_thieu(): tuần này chưa có ảnh ⇒ chụp (ảnh tính TẠI MỐC 00:00 thứ Hai
--    nên chụp muộn vẫn đúng số đầu tuần), có rồi ⇒ không làm gì (không ghi đè ảnh đầu tuần bằng số giữa tuần).
-- MẤT GÌ (Luật xoá): không. Chỉ thêm hàm + một dòng đăng ký; thay thân 2 hàm đọc giữ nguyên chữ ký và kết quả.
-- ============================================================================

-- ── 1a. danh sách khối của một tuần: đang chạy ⇒ sổ hiện tại · đã đóng ⇒ sổ chốt ──
create or replace function public.fn_bctk_tuan(p_tuan date default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_nay  date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tuan date := least(coalesce(date_trunc('week', p_tuan)::date, v_nay), v_nay);
  v_chay boolean;
  v_mon  text[];
begin
  if public.current_nhan_su_id() is null then raise exception 'Chỉ nhân sự đã đăng nhập' using errcode = '42501'; end if;
  perform public._bctk_gac_tbm();
  v_chay := v_tuan = v_nay;
  v_mon := public._bctk_cac_mon_toi();
  return (
    with x as (
      select s.mon, s.khoi, s.tong, s.tinh_at from bctk_so_hien_tai_o s where v_chay and s.tuan = v_tuan
      union all
      select s.mon, s.khoi, s.tong, s.tinh_at from bctk_so_tuan_o s where not v_chay and s.tuan = v_tuan
    )
    select jsonb_build_object(
      'tuan', v_tuan, 'den', v_tuan + 6, 'dang_chay', v_chay, 'tuan_nay', v_nay,
      'co_chot', v_chay or exists (select 1 from x),
      'mon', (select coalesce(jsonb_agg(jsonb_build_object(
                'mon', m.mon,
                'tinh_at', (select min(s.tinh_at) from x s where s.mon = m.mon),
                'tong', (select public._bctk_gom_tong(array_agg(s.tong)) from x s where s.mon = m.mon),
                'khoi', (select coalesce(jsonb_agg(jsonb_build_object(
                            'khoi', s.khoi, 'tinh_at', s.tinh_at, 'tong', s.tong,
                            'truong', (select n.ho_ten from phan_cong_quan_ly_khoi q join nhan_su n on n.id = q.nhan_su_id
                                        where q.mon = s.mon and q.khoi = s.khoi and q.vai = 'truong'))
                          order by coalesce(substring(s.khoi from '^[0-9]+')::int, 0), s.khoi), '[]'::jsonb)
                           from x s where s.mon = m.mon))
              order by m.mon), '[]'::jsonb)
                from unnest(v_mon) m(mon))));
end $$;

-- ── 1b. chi tiết một khối của tuần đang xem ──
create or replace function public.fn_bctk_tuan_o(p_mon text, p_khoi text, p_tuan date default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_nay  date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tuan date := least(coalesce(date_trunc('week', p_tuan)::date, v_nay), v_nay);
  v_o jsonb := jsonb_build_array(jsonb_build_object('mon', p_mon, 'khoi', p_khoi));
  v_so jsonb;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chỉ nhân sự đã đăng nhập' using errcode = '42501'; end if;
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  v_so := public.fn_bctk_so(v_o, v_tuan);
  return v_so
    || jsonb_build_object('trend', (
         select jsonb_agg(jsonb_build_object('tuan', w.tuan, 'tong', case when w.k = 0 then v_so->'tong' else coalesce(
                    (select s.tong from bctk_so_tuan_o s where s.tuan = w.tuan and s.mon = p_mon and s.khoi = p_khoi),
                    public.fn_bctk_so(v_o, w.tuan)->'tong') end) order by w.tuan)
           from (select k, (v_tuan - 7 * k)::date as tuan from generate_series(0, 3) k) w))
    || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, v_tuan))
    || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, v_tuan));
end $$;

-- ── 1c. hai hàm cũ giữ chữ ký, đi qua hàm mới ──
create or replace function public.fn_bctk_hien_tai()
returns jsonb language sql stable security definer set search_path = public as $$ select public.fn_bctk_tuan(null) $$;
create or replace function public.fn_bctk_hien_tai_o(p_mon text, p_khoi text)
returns jsonb language sql stable security definer set search_path = public as $$ select public.fn_bctk_tuan_o(p_mon, p_khoi, null) $$;

revoke execute on function public.fn_bctk_tuan(date) from public, anon;
revoke execute on function public.fn_bctk_tuan_o(text, text, date) from public, anon;
grant execute on function public.fn_bctk_tuan(date) to authenticated;
grant execute on function public.fn_bctk_tuan_o(text, text, date) to authenticated;

-- ── 2. ảnh dạng yếu / nhóm yếu đầu tuần vào bộ điều phối ──
create or replace function public._tu_dong_sang_t2_neu_thieu()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
begin
  if exists (select 1 from dang_yeu_dau_tuan where tuan = v_tuan) then return jsonb_build_object('tuan', v_tuan, 'da_co', true); end if;
  return public._tu_dong_sang_t2();
end $$;
revoke execute on function public._tu_dong_sang_t2_neu_thieu() from public, anon, authenticated;

insert into public.tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu)
values ('chup_dau_tuan', 'Ảnh dạng yếu / nhóm yếu đầu tuần + Tổng kết tuần vừa rồi (chỉ khi tuần này chưa có ảnh)',
        'public._tu_dong_sang_t2_neu_thieu()', 55, array[0, 1, 2, 3, 4, 5], 1, 90, true,
        'Thùy 23/11 · thay lịch cron riêng tu-dong-sang-t2 (đêm 22/11 không chạy) · ảnh tính tại mốc 00:00 thứ Hai nên chụp muộn vẫn đúng · có ảnh rồi thì bỏ qua')
on conflict (ma) do update set lenh = excluded.lenh, chu_ky_phut = excluded.chu_ky_phut, gio_chay = excluded.gio_chay,
  uu_tien = excluded.uu_tien, ngan_sach_giay = excluded.ngan_sach_giay, bat = true, ghi_chu = excluded.ghi_chu;
