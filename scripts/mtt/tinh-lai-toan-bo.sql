-- TÍNH LẠI NGAY toàn bộ tờ mục tiêu tuần ĐANG CHẠY theo luật mới (Thùy 17/11 khuya: "tính lại toàn bộ học sinh đi").
-- Chạy ở Supabase SQL Editor SAU KHI áp mig 202611172340 + 202611180010. Không phải migration — việc một lần, chạy LẶP tới khi "còn 0".
-- Mỗi lượt ≤ 45 giây (dưới trần câu lệnh của SQL Editor), làm tờ chưa có cờ dat_mt (= chưa tính theo luật mới) trước, rồi xếp hạng lại.
-- Không xoá gì: _mtt_ghi ghi đè tờ đệm mtt_luu đúng như bộ điều phối vẫn làm mỗi 5 phút; sổ tuần đã chốt (mtt_chot) KHÔNG đụng.
do $$
declare
  v_w   date := public._mtt_tuan(public._mtt_hom_nay());
  v_bat timestamptz := clock_timestamp();
  r     record;
  v_n   int := 0;
  v_con int;
  v_mon text;
begin
  for r in
    select m.hoc_sinh_id, m.mon from mtt_luu m
     where m.tuan = v_w
       and jsonb_array_length(coalesce(m.payload->'nhom', '[]'::jsonb)) > 0
       and not exists (select 1 from jsonb_array_elements(m.payload->'nhom') e where e ? 'dat_mt')
     order by m.tinh_at
  loop
    exit when clock_timestamp() - v_bat > interval '45 seconds';
    perform public._mtt_ghi(r.hoc_sinh_id, r.mon, v_w);
    v_n := v_n + 1;
  end loop;
  for v_mon in select distinct mon from mtt_luu where tuan = v_w loop
    perform public._mtt_xep_hang(v_w, v_mon);
  end loop;
  select count(*) into v_con from mtt_luu m
   where m.tuan = v_w and jsonb_array_length(coalesce(m.payload->'nhom', '[]'::jsonb)) > 0
     and not exists (select 1 from jsonb_array_elements(m.payload->'nhom') e where e ? 'dat_mt');
  raise notice 'Tuần %: vừa tính lại % tờ trong % giây · còn % tờ chưa tính ⇒ % ', v_w, v_n,
    round(extract(epoch from clock_timestamp() - v_bat)::numeric, 1), v_con, case when v_con = 0 then 'XONG' else 'chạy lại lệnh này' end;
end $$;
