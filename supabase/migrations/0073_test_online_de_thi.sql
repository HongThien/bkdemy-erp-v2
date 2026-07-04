-- ============================================================================
-- 0073 — TEST ONLINE mở rộng: ĐỀ THI (trường/sở) phát hành = chế độ THI y hệt ET
-- (giấu đáp án tới khi nộp, chấm server-side, chỉ tính lần nộp đầu — 0068/0069).
-- ============================================================================

alter table bai_test drop constraint bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check check (loai in ('et', 'btvn', 'giao_trinh', 'de_thi'));

-- HS KHÔNG được đọc thẳng câu ET LẪN đề thi (giấu key) — non-thi (btvn/giao_trinh) reveal-ngay bình thường.
drop policy if exists bai_test_cau_hs_read on bai_test_cau;
create policy bai_test_cau_hs_read on bai_test_cau for select to authenticated
  using (exists (select 1 from bai_test bt where bt.id = bai_test_id and public.hs_o_lop(bt.lop_id) and bt.loai not in ('et', 'de_thi')));

-- et_de: mở rộng cho cả đề thi (cùng cơ chế lọc key/lời giải). et_nop KHÔNG cần đổi (không lọc theo loai).
create or replace function public.et_de(p_bai_test uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
    'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon,
    'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
    'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem
  ) order by bc.thu_tu), '[]'::jsonb)
  from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
  where bc.bai_test_id = p_bai_test and bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id);
$$;
