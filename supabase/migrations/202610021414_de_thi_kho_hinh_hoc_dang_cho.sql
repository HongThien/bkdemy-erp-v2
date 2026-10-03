-- ============================================================================
-- 202610021414 — de_thi_kho_hinh_hoc_dang_cho
-- ----------------------------------------------------------------------------
-- CEO 02/10: 344 câu HÌNH KHÔNG GIAN lớp 11 (61 đề giữa kì Noctorium bị giữ lại từ 24/09 vì "kho đích chưa chốt") vào
-- KHO HÌNH HỌC (`hinh_hoc_cau_hoi`), nằm ở một DẠNG CHỜ, gán dạng thật sau.
--   1. `_kho_dang_cho` biết kho hinh_hoc: 'HH' + khối + '000000' (cùng quy ước mọi kho: mã chờ kết thúc 000000).
--   2. Thêm bài chờ `HH11000000` "Chưa phân dạng — Hình không gian 11" vào `hinh_hoc_bai` (kho Hình học: dạng = bài).
--   3. Câu ở dạng chờ không duyệt được vào kho chuẩn — gắn trigger chặn sẵn có (`_trg_chan_duyet_dang_cho`) lên
--      `hinh_hoc_cau_hoi` như kho Đại / Hình giải tích.
--   4. `fn_de_thi_mo`: bảng lý thuyết của kho lấy qua `_kho_lt_dang_tbl` — kho Hình học không có `hinh_hoc_dang_ly_thuyet`
--      (lý thuyết nằm ở `hinh_hoc_bai_ly_thuyet`), gọi theo quy ước cũ là mở kiểm tra đề có câu hình sẽ lỗi.
-- MẤT GÌ: không. Thêm 1 dòng bản đồ, 1 hàm, 1 trigger; thay thân 2 hàm cùng chữ ký.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

CREATE OR REPLACE FUNCTION public._kho_dang_cho(p_tbl text, p_khoi text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_tbl when 'dai' then 'T1' when 'hgt' then 'T3' when 'khtn' then 'K' when 'anh' then 'E' when 'tsa' then 'TS' when 'hinh_hoc' then 'HH' end
         || lpad(p_khoi, 2, '0') || '000000'
$function$;

-- (ma_dang / ten_dang của hinh_hoc_bai là cột SINH từ ma_bai / ten_bai — không chèn tay)
insert into public.hinh_hoc_bai (ma_bai, khoi, ten_bai, thu_tu, da_duyet)
values ('HH11000000', '11', 'Chưa phân dạng — Hình không gian 11', 0, false)
on conflict (ma_bai) do nothing;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_chan_duyet_dang_cho' and tgrelid = 'public.hinh_hoc_cau_hoi'::regclass) then
    create trigger trg_chan_duyet_dang_cho before insert or update of da_duyet, dang_chinh on public.hinh_hoc_cau_hoi
      for each row execute function public._trg_chan_duyet_dang_cho();
  end if;
end $$;

-- Bảng lý thuyết theo dạng của một kho (registry — không rải if theo kho): <kho>_dang_ly_thuyet nếu có, không thì <kho>_bai_ly_thuyet.
create or replace function public._kho_lt_dang_tbl(p_kho text)
returns text language sql stable set search_path = public as $$
  select case when to_regclass('public.' || p_kho || '_dang_ly_thuyet') is not null then p_kho || '_dang_ly_thuyet'
              when to_regclass('public.' || p_kho || '_bai_ly_thuyet') is not null then p_kho || '_bai_ly_thuyet' end
$$;

CREATE OR REPLACE FUNCTION public.fn_de_thi_mo(p_de uuid, p_lop uuid, p_ngay date, p_thoi_gian_phut integer, p_khoa_dap_an boolean DEFAULT true)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare tl record; v_bt uuid; r record; n int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  select * into tl from tai_lieu where id = p_de and loai = 'de_thi';
  if tl.id is null then raise exception 'Không phải đề thi: %', p_de; end if;
  if tl.duyet_at is null then raise exception 'Đề chưa duyệt — duyệt đề trước khi phát hành' using errcode = 'check_violation'; end if;
  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề bị sửa sau khi duyệt và đang thiếu dữ liệu — mở đề để xử lý' using errcode = 'check_violation';
  end if;
  if p_lop is null or p_ngay is null then raise exception 'Thiếu lớp hoặc ngày thi'; end if;
  if exists (select 1 from bai_test where nguon_tai_lieu_id = p_de and lop_id = p_lop and ngay = p_ngay and loai = 'de_thi') then
    raise exception 'Đề này đã phát hành cho lớp này ngày này rồi' using errcode = 'unique_violation';
  end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, ngay, loai, mon, deadline, khoa_reveal, thoi_gian_phut, so_cau)
  values (p_de, p_lop, p_ngay, 'de_thi', tl.mon, null, coalesce(p_khoa_dap_an, true), p_thoi_gian_phut, 0)
  returning id into v_bt;

  for r in select * from public.fn_de_thi_cau(p_de) where not xoa and loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') order by stt loop
    n := n + 1;
    perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', public._kho_lt_dang_tbl(r.kho), r.ma_cau, n);
    -- Điểm theo phần · tiêu đề phần · đang THI ⇒ không kèm lý thuyết gợi ý
    update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
    where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
    -- K5: câu trả lời ngắn giữ form đề gốc. `_kho_snapshot_cau` tự hiện thành 4 phương án nếu kho có form trắc nghiệm đã
    -- duyệt (đúng cho bổ trợ / tự luyện) — với đề thi thì trả về đúng trả lời ngắn + đáp số của kho.
    if r.loai_cau = 'tra_loi_ngan' then
      update bai_test_cau set loai_cau = 'tra_loi_ngan', lua_chon = null, lua_chon_rule = null,
             form_tn_id = null, form_tn_hgt_id = null, dap_an_key = to_jsonb(btrim(r.dap_an))
      where bai_test_id = v_bt and thu_tu = n and bien_the = 1 and loai_cau <> 'tra_loi_ngan';
    end if;
  end loop;
  if n = 0 then raise exception 'Đề không có câu nào làm được trên app'; end if;
  update bai_test set so_cau = n where id = v_bt;
  perform public.fn_de_thi_hoan_thien_bai_test(v_bt);
  return v_bt;
end $function$;
