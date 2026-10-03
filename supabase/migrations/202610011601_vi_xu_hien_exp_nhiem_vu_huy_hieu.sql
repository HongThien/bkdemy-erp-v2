-- ============================================================================
-- VÍ XU HIỆN EXP CỦA NHIỆM VỤ + HUY HIỆU (spec-v1-app-hs.md hạng mục 2/4 — Thùy 01/10)
-- EXP nhiệm vụ (cấp Chặng + mốc + rương tuần) và EXP huy hiệu ĐÃ được đổi ra xu cuối tháng (fn_exp_app_thang → fn_gami_exp_xu_thang) nhưng danh sách
-- "Hoạt động" của Ví xu (fn_hs_vi_xu_cua_toi) chỉ liệt kê ledger + vòng quay ⇒ em thấy xu mà không thấy xu từ đâu. Thêm 2 nguồn vào danh sách:
--   exp_nhiem_vu : 1 dòng / môn đang bật / tháng (gộp theo THÁNG — nhiệm vụ không ghi từng sự kiện vào ledger; nguồn số = fn_nhiem_vu_chang_thang,
--                  CÙNG nguồn đang đổi xu ⇒ không lệch). Kèm cap, so_ruong.
--   exp_huy_hieu : 1 dòng / huy hiệu đạt trong tháng (EXP theo sao — huy_hieu_thang_sao). Kèm ten, sao.
-- Sửa bằng cách ĐỌC định nghĩa đang chạy rồi thay ĐÚNG 1 chỗ (assert) — không chép đè thân hàm (bài học 27/09: phiên khác cũng sửa hàm này).
-- ============================================================================
do $mig$
declare
  d text;
  neo constant text := $neo$      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;$neo$;
  moi constant text := $moi$      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- EXP nhiệm vụ (Chặng + mốc + rương tuần): gộp theo THÁNG, mỗi môn đang bật. Nguồn số = fn_nhiem_vu_chang_thang (cùng nguồn đổi xu cuối tháng).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_nhiem_vu', 'mon', c.mon, 'so', n.exp,
             'created_at', k.t, 'ngay', null, 'lop', null, 'cap', n.cap, 'so_ruong', n.so_ruong), k.t
    from nhiem_vu_cau_hinh c
    cross join lateral public.fn_nhiem_vu_chang_thang(c.mon, v_ym, array[v_me]) n
    cross join lateral (select least(now(), (((v_ym || '-01')::date + interval '1 month')::timestamp at time zone 'Asia/Ho_Chi_Minh') - interval '1 second') as t) k
    where c.bat and n.exp > 0
    union all
    -- EXP huy hiệu: mỗi huy hiệu đạt trong tháng (tính vào tháng ĐẠT, giờ VN — như fn_exp_app_thang).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_huy_hieu', 'mon', h.mon, 'so', s.exp,
             'created_at', h.dat_at, 'ngay', (h.dat_at at time zone 'Asia/Ho_Chi_Minh')::date, 'lop', null, 'sao', h.sao, 'ten', hh.ten), h.dat_at
    from hs_huy_hieu_dat h
    join huy_hieu_thang_sao s on s.mon = h.mon and s.sao = h.sao
    left join huy_hieu hh on hh.mon = h.mon and hh.key = h.huy_hieu_key
    where h.hoc_sinh_id = v_me and s.exp > 0
      and to_char(h.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;$moi$;
begin
  select pg_get_functiondef('public.fn_hs_vi_xu_cua_toi(text)'::regprocedure) into d;
  if d is null then raise exception 'không thấy fn_hs_vi_xu_cua_toi'; end if;
  if d like '%exp_nhiem_vu%' then return; end if;     -- đã vá (chạy lại vô hại)
  if (length(d) - length(replace(d, neo, ''))) / length(neo) <> 1 then
    raise exception 'fn_hs_vi_xu_cua_toi: mốc cần thay không khớp đúng 1 chỗ — phiên khác đã sửa hàm, xem lại thủ công';
  end if;
  execute replace(d, neo, moi);
end $mig$;
