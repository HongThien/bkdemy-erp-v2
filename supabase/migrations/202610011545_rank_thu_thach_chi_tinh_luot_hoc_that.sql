-- ============================================================================
-- ĐIỂM RANK CỦA THỬ THÁCH CHỈ TÍNH LƯỢT HỌC THẬT (spec-v1-app-hs.md §2 — Thùy 01/10: "OK" đề xuất áp luật cho cả Điểm Rank)
-- trg_thu_thach_nop: sau khi tính v_goc (10/20/30 theo tỉ lệ đúng), nếu lượt KHÔNG phải lượt học thật ⇒ v_goc = 0 (⇒ diem = 0, không vào bảng đua tháng / bậc).
-- Chỉ áp cho lượt nộp TỪ NAY — điểm đã ghi trước đó (thu_thach_luot) giữ nguyên, không tính lại lịch sử.
-- Thân hàm lấy NGUYÊN bản đang chạy (pg_get_functiondef 01/10).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_thu_thach_nop()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_bt record; v_cfg record;
  v_so_dung integer; v_ti_le numeric; v_goc integer := 0; v_diem integer;
  v_ngay date := (coalesce(new.nop_at, now()) at time zone 'Asia/Ho_Chi_Minh')::date;
  v_da_ngay integer; v_da_thang integer; x jsonb;
begin
  select id, mon, so_cau, hoc_sinh_id, thu_thach into v_bt from bai_test where id = new.bai_test_id;
  if not coalesce(v_bt.thu_thach, false) or v_bt.hoc_sinh_id is distinct from new.hoc_sinh_id or v_bt.so_cau <= 0 then
    return new;
  end if;
  select * into v_cfg from rank_cau_hinh where mon = v_bt.mon;

  -- Đếm đúng Ở SERVER: trắc nghiệm so đáp án HS (chỉ số gốc 0..3) với chữ đáp án kho; loại khác dùng verdict.
  select count(*) filter (where case when btc.loai_cau = 'trac_nghiem'
                                     then (blc.dap_an_hs #>> '{}') ~ '^\d+$'
                                          and chr(65 + (blc.dap_an_hs #>> '{}')::int) = upper(trim(btc.dap_an_key #>> '{}'))
                                     else blc.verdict = 'correct' end)
    into v_so_dung
  from bai_lam_cau blc join bai_test_cau btc on btc.id = blc.bai_test_cau_id
  where blc.bai_lam_id = new.id;
  v_ti_le := v_so_dung::numeric / v_bt.so_cau;

  if v_cfg.mon is not null and v_ti_le >= v_cfg.tt_pass then
    for x in select * from jsonb_array_elements(v_cfg.tt_diem) loop
      if v_ti_le >= (x->>0)::numeric then v_goc := greatest(v_goc, (x->>1)::int); end if;
    end loop;
  end if;

  -- 01/10 (spec-v1-app-hs §2, Thùy duyệt): Điểm Rank của Thử thách CHỈ khi lượt là LƯỢT HỌC THẬT (≥5 câu · đúng ≥50% · TB ≥6 s/câu) —
  -- đúng ≥80% nhưng làm quá nhanh (nhớ đáp án / bấm bừa) không ăn điểm. pass vẫn ghi theo ti_le như cũ; chỉ điểm về 0.
  if v_goc > 0 and not coalesce((select t.tinh from public._luot_tinh(array[new.hoc_sinh_id], coalesce(new.nop_at, now()) - interval '1 minute',
                                 coalesce(new.nop_at, now()) + interval '1 minute') t where t.bai_lam_id = new.id), false) then
    v_goc := 0;
  end if;

  -- Trần: khoá theo (HS × môn) để 2 lượt nộp song song không cùng thấy "còn trần".
  perform pg_advisory_xact_lock(hashtext('thu_thach:' || new.hoc_sinh_id || ':' || v_bt.mon));
  select coalesce(sum(diem) filter (where ngay = v_ngay), 0),
         coalesce(sum(diem) filter (where date_trunc('month', ngay) = date_trunc('month', v_ngay)), 0)
    into v_da_ngay, v_da_thang
  from thu_thach_luot where hoc_sinh_id = new.hoc_sinh_id and mon = v_bt.mon;
  v_diem := case when v_goc = 0 then 0
                 else greatest(0, least(v_goc, v_cfg.tt_tran_ngay - v_da_ngay, v_cfg.tt_tran_thang - v_da_thang)) end;

  insert into thu_thach_luot (bai_lam_id, bai_test_id, hoc_sinh_id, mon, ngay, so_cau, so_dung, pass, diem_goc, diem)
  values (new.id, v_bt.id, new.hoc_sinh_id, v_bt.mon, v_ngay, v_bt.so_cau, v_so_dung,
          v_cfg.mon is not null and v_ti_le >= v_cfg.tt_pass, v_goc, v_diem)
  on conflict (bai_lam_id) do nothing;
  return new;
end $function$;
