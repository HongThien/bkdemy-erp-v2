-- MỤC TIÊU TUẦN — XẾP HẠNG: tiêu chí phụ khi bằng % + tính MỖI NGÀY MỘT LẦN (Thùy 17/11 khuya: "OK" thứ tự tiêu chí ·
-- "cái này không cần realtime, mỗi ngày tính lại 1 lần cũng được").
-- Vì sao: tiến độ giờ = số nhóm đạt ÷ tổng (mig 202611172340) ⇒ chỉ vài mức % ⇒ hàng trăm em trùng hạng. Thứ tự xếp:
--   (1) % tiến độ ↓ · (2) số việc đã làm ↓ · (3) tổng điểm tăng của các nhóm trong tuần (Σ d = % hiện tại − % đầu tuần) ↓ · vẫn bằng ⇒ cùng hạng.
-- Nhịp: bộ điều phối (_mtt_lam_moi, 5 phút/lượt) chỉ xếp hạng môn nào CHƯA xếp hôm nay (mtt_top.tinh_at theo ngày VN) và chỉ từ 05:00
--   (ngoài khung 17–22 h — K22). Lên/xuống bậc đã tính theo ngày (hang_ngay) ⇒ khớp nhịp mới. Lớp công bố trong ngày có hạng từ sáng hôm sau.
--   Chạy tay scripts/mtt/tinh-lai-toan-bo.sql vẫn xếp lại ngay.
-- Vá trên THÂN ĐANG CHẠY, mỗi đoạn khớp đúng 1 chỗ (bỏ \r — thân có thể mang CRLF), không khớp thì in đoạn thật rồi dừng cả khối.
do $vua$
declare
  v_src text; v_n int;
  a_cu  text := $c$    select hoc_sinh_id, rank() over (order by tien_do desc) as h, count(*) over () as so$c$;
  a_moi text := $m$    -- mig 202611180040: bằng % thì xét số việc đã làm, rồi tổng điểm tăng trong tuần; vẫn bằng ⇒ cùng hạng
    select hoc_sinh_id,
           rank() over (order by tien_do desc, coalesce(viec_xong, 0) desc,
                                 coalesce((select sum((e->>'d')::numeric) from jsonb_array_elements(coalesce(payload->'nhom', '[]'::jsonb)) e
                                            where e->>'d' is not null), 0) desc) as h,
           count(*) over () as so$m$;
  b_cu  text := $c$  for v_mon in select distinct mon from mtt_luu where tuan = v_w loop
    perform public._mtt_xep_hang(v_w, v_mon);
  end loop;$c$;
  b_moi text := $m$  -- mig 202611180040: xếp hạng MỖI NGÀY MỘT LẦN, từ 05:00 (Thùy: "không cần realtime")
  for v_mon in
    select distinct l.mon from mtt_luu l
     where l.tuan = v_w
       and extract(hour from now() at time zone 'Asia/Ho_Chi_Minh') >= 5
       and not exists (select 1 from mtt_top t where t.tuan = v_w and t.mon = l.mon
                          and (t.tinh_at at time zone 'Asia/Ho_Chi_Minh')::date = public._mtt_hom_nay())
  loop
    perform public._mtt_xep_hang(v_w, v_mon);
  end loop;$m$;
begin
  -- (a) _mtt_xep_hang
  select replace(pg_get_functiondef('public._mtt_xep_hang(date, text)'::regprocedure), E'\r', '') into v_src;
  a_cu := replace(a_cu, E'\r', ''); a_moi := replace(a_moi, E'\r', '');
  v_n := (length(v_src) - length(replace(v_src, a_cu, ''))) / length(a_cu);
  if v_n <> 1 then
    raise exception '_mtt_xep_hang: đoạn rank khớp % chỗ (cần 1) — dừng. Đoạn thật: %', v_n,
      coalesce(substr(v_src, greatest(1, strpos(v_src, 'rank()') - 80), 260), '(không thấy rank())');
  end if;
  execute replace(v_src, a_cu, a_moi);

  -- (b) _mtt_lam_moi
  select replace(pg_get_functiondef('public._mtt_lam_moi(integer)'::regprocedure), E'\r', '') into v_src;
  b_cu := replace(b_cu, E'\r', ''); b_moi := replace(b_moi, E'\r', '');
  v_n := (length(v_src) - length(replace(v_src, b_cu, ''))) / length(b_cu);
  if v_n <> 1 then
    raise exception '_mtt_lam_moi: vòng xếp hạng khớp % chỗ (cần 1) — dừng. Đoạn thật: %', v_n,
      coalesce(substr(v_src, greatest(1, strpos(v_src, '_mtt_xep_hang') - 160), 320), '(không thấy _mtt_xep_hang)');
  end if;
  execute replace(v_src, b_cu, b_moi);
end $vua$;

alter function public._mtt_xep_hang(date, text) owner to claude_build;
alter function public._mtt_lam_moi(integer) owner to claude_build;
revoke execute on function public._mtt_xep_hang(date, text) from public, anon, authenticated;
revoke execute on function public._mtt_lam_moi(integer) from public, anon, authenticated;
