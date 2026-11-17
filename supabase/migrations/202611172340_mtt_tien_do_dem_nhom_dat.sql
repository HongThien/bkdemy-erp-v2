-- MỤC TIÊU TUẦN — đổi định nghĩa TIẾN ĐỘ (Thùy 17/11 khuya: "% tiến độ phải là số cái đạt / tổng số cái";
-- chọn: đạt = CHẠM MỤC TIÊU TUẦN · tổng = MỌI nhóm trên tờ, cả Bài trên lớp + Ôn tập kiến thức, kể cả chưa đo).
-- Cũ: TB min(% hiện tại ÷ mục tiêu tuần, 1) ⇒ đo MỨC HIỆN TẠI, em khá nào cũng 92–99% dù chưa làm việc nào trong tuần.
-- Mới: tiến độ = 100 × (số nhóm có % hiện tại ≥ mục tiêu tuần) ÷ (số nhóm trên tờ).
--   · nhóm chưa đo (p null) ⇒ chưa đạt · nhóm tuần này không có lần đo (không có mục tiêu tuần) ⇒ so với đích dài hạn 80.
--   · tiến độ đầu tuần = cùng phép đếm trên % lúc 00:00 thứ Hai (p_dau); nhóm mới chưa có số đầu tuần ⇒ chưa đạt.
-- TÍNH SẴN (Thùy: "phải theo logic tính sẵn, không tính realtime"): chỉ đổi công thức BÊN TRONG _mtt_tinh — hàm chỉ chạy ở bộ điều phối
--   (_mtt_lam_moi, 5 phút/lượt, ngân sách giây) rồi ghi mtt_luu / mtt_chot; màn chỉ đọc. Tờ tuần này tự tính lại dần (mỗi tờ ≤ 20 phút);
--   sổ tuần đã chốt (mtt_chot) GIỮ số cũ — sổ bất biến. Xếp hạng (_mtt_xep_hang) đọc mtt_luu.tien_do ⇒ theo định nghĩa mới.
-- Vá trên THÂN ĐANG CHẠY (pg_get_functiondef), khớp đúng 1 chỗ, không thì dừng — không ghi đè phần vá của phiên khác.
do $vua$
declare
  v_src text;
  v_cu  text := $c$  select round(100 * avg((e->>'tien')::numeric), 1),
         round(100 * avg(coalesce((e->>'tien_dau')::numeric, 0)) filter (where e->>'tien' is not null), 1)
    into v_td, v_td_dau
    from jsonb_array_elements(v_nhom) e;$c$;
  v_moi text := $m$  -- TIẾN ĐỘ (Thùy 17/11 khuya, mig 202611172340) = số nhóm CHẠM MỤC TIÊU TUẦN ÷ MỌI nhóm trên tờ (chưa đo = chưa đạt;
  -- nhóm không có mục tiêu tuần ⇒ so với đích 80). Đầu tuần: cùng phép đếm trên p_dau.
  select round(100.0 * count(*) filter (where e->>'p' is not null
                 and (e->>'p')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80)) / nullif(count(*), 0), 1),
         round(100.0 * count(*) filter (where e->>'p_dau' is not null
                 and (e->>'p_dau')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80)) / nullif(count(*), 0), 1)
    into v_td, v_td_dau
    from jsonb_array_elements(v_nhom) e;$m$;
  v_n int;
begin
  select pg_get_functiondef('public._mtt_tinh(uuid, text, date, timestamptz)'::regprocedure) into v_src;
  v_n := (length(v_src) - length(replace(v_src, v_cu, ''))) / length(v_cu);
  if v_n <> 1 then
    raise exception 'Đoạn tính tiến độ trong _mtt_tinh khớp % chỗ (cần đúng 1) — thân hàm đã khác, dừng.', v_n;
  end if;
  execute replace(v_src, v_cu, v_moi);
end $vua$;

-- áp bằng SQL Editor ⇒ create or replace giữ chủ cũ; ép lại cho chắc (bài học 16–17/11)
alter function public._mtt_tinh(uuid, text, date, timestamptz) owner to claude_build;
revoke execute on function public._mtt_tinh(uuid, text, date, timestamptz) from public, anon, authenticated;
