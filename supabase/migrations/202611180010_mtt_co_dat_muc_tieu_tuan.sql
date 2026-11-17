-- MỤC TIÊU TUẦN — cờ "ĐẠT MỤC TIÊU TUẦN" trên từng nhóm (Thùy 17/11 khuya: tiến độ = số nhóm đạt ÷ tổng, "đạt" = CHẠM MỤC TIÊU TUẦN;
-- nhãn Đạt / Chưa đạt / Yếu trên thẻ là MỨC mastery so với 80 — khác nghĩa ⇒ thẻ cần dấu ✓ riêng để đếm ✓ là ra đúng %).
-- payload.nhom[i].dat_mt = (p có số và p ≥ mục tiêu tuần; nhóm không có mục tiêu tuần ⇒ so với đích 80) — CÙNG điều kiện với tiến độ (mig 202611172340).
-- Tính sẵn trong _mtt_tinh (bộ điều phối), màn chỉ đọc. Tờ chưa có cờ = tờ chưa tính lại theo luật mới (dùng để quét tính lại toàn bộ).
-- Vá trên THÂN ĐANG CHẠY, khớp đúng 1 chỗ (bỏ \r — thân hàm có thể mang CRLF từ máy Windows), không khớp thì in đoạn thật rồi dừng.
do $vua$
declare
  v_src text;
  v_cu  text := $c$  select coalesce(jsonb_agg(e || jsonb_build_object('dang', coalesce(v_dmap->(e->>'ma'), '[]'::jsonb)) order by o), '[]'::jsonb)$c$;
  v_moi text := $m$  select coalesce(jsonb_agg(e || jsonb_build_object('dang', coalesce(v_dmap->(e->>'ma'), '[]'::jsonb),
                                              /* mig 202611180010: cờ đạt mục tiêu tuần — cùng điều kiện với tiến độ */
                                              'dat_mt', (e->>'p') is not null and (e->>'p')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80))
                              order by o), '[]'::jsonb)$m$;
  v_n int;
begin
  select replace(pg_get_functiondef('public._mtt_tinh(uuid, text, date, timestamptz)'::regprocedure), E'\r', '') into v_src;
  v_cu  := replace(v_cu, E'\r', '');
  v_moi := replace(v_moi, E'\r', '');
  if position('202611172340' in v_src) = 0 then
    raise exception 'Chưa áp mig 202611172340 (tiến độ = số nhóm đạt) — áp file đó trước.';
  end if;
  v_n := (length(v_src) - length(replace(v_src, v_cu, ''))) / length(v_cu);
  if v_n <> 1 then
    raise exception 'Đoạn gắn dạng vào nhóm trong _mtt_tinh khớp % chỗ (cần đúng 1) — dừng. Đoạn thật quanh "v_dmap->": %', v_n,
      coalesce(substr(v_src, greatest(1, strpos(v_src, 'v_dmap->') - 120), 360), '(không thấy "v_dmap->")');
  end if;
  execute replace(v_src, v_cu, v_moi);
end $vua$;

alter function public._mtt_tinh(uuid, text, date, timestamptz) owner to claude_build;
revoke execute on function public._mtt_tinh(uuid, text, date, timestamptz) from public, anon, authenticated;
