-- ============================================================================
-- FIX: câu hỏi phát hành online KHÔNG hiện được HÌNH ẢNH ĐỀ.
--
-- GỐC: `bai_test_cau` (snapshot đề+key lúc phát hành) từ đầu chỉ có cột `anh_dap_an`
-- (ảnh lời giải) — THIẾU HẲN `anh_de` (ảnh đề), dù kho (`dai_cau_hoi`/`CauHoi`) có cả
-- hai. `phatHanhTest` (testonline.ts) copy được cái gì bảng CÓ cột, nên ảnh đề bị
-- RỤNG ÂM THẦM lúc snapshot — không phải bug hiển thị, là THIẾU CỘT từ gốc.
-- ============================================================================

alter table bai_test_cau add column if not exists anh_de text;

comment on column bai_test_cau.anh_de is 'Ảnh ĐỀ (snapshot từ CauHoi.anh_de lúc phát hành) — khác anh_dap_an (ảnh lời giải).';

-- et_de (chế độ THI — giấu key/lời giải, ET+đề thi): ảnh đề KHÔNG phải đáp án, HS phải
-- thấy trong lúc làm bài (đề giấy khó đọc chữ ảnh chụp là đúng lý do làm test online) →
-- thêm vào cùng nhóm noi_dung/lua_chon, KHÔNG lọc như dap_an_key/loi_giai/anh_dap_an.
create or replace function public.et_de(p_bai_test uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
    'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon, 'anh_de', bc.anh_de,
    'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
    'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem
  ) order by bc.thu_tu), '[]'::jsonb)
  from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
  where bc.bai_test_id = p_bai_test and bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id);
$$;
