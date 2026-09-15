-- ============================================================================
-- BIẾN THỂ (mã đề 1/2/3) cho ET online.
--
-- GỐC VẤN ĐỀ: `phatHanhTest` chỉ snapshot mã đề GỐC (phần `custom`), bỏ qua hoàn
-- toàn `cau_hinh.etMaDe` (3 bộ câu) và `cau_hinh.hsMaDe` (gán riêng từng HS →
-- mã đề, để HS ngồi cạnh không trùng đề). Kết quả: phát hành online thì MỌI HS
-- nhận CÙNG nội dung câu (chỉ khác thứ tự hiển thị) — đúng cái mã đề sinh ra để
-- chống. CEO xác nhận cần làm cho ĐÚNG, không chỉ cảnh báo.
--
-- PHẠM VI: CHỈ ET (`hsMaDe`/`etMaDe` là cơ chế riêng của ETScreen/made.ts —
-- BTVN/giáo trình/đề thi trường-sở không dùng, xác nhận bằng grep trước khi làm).
-- ============================================================================

-- Mỗi vị trí (thu_tu) có tới 3 dòng phân biệt bằng bien_the khi ET có đủ 3 mã đề;
-- KHÔNG đủ (đa số doc) → chỉ 1 dòng bien_the=1, hành vi y hệt trước đây.
alter table bai_test_cau add column if not exists bien_the smallint not null default 1;
comment on column bai_test_cau.bien_the is 'Mã đề (1/2/3) — nhiều dòng cùng thu_tu khi ET có etMaDe. Mặc định 1 = duy nhất (đa số doc không có biến thể).';

-- HS làm đề nào ĐÔNG CỨNG lúc mở bài lần đầu (upsert ignoreDuplicates hiện có) —
-- sửa hsMaDe SAU đó không đổi bài đang làm/đã nộp, đúng nguyên tắc snapshot 1 chiều.
alter table bai_lam add column if not exists bien_the smallint not null default 1;
comment on column bai_lam.bien_the is 'Mã đề HS này làm — chốt lúc mo_bai_lam, đọc từ hsMaDe[hoc_sinh_id] của tai_lieu gốc lúc đó.';

-- HS đọc mã đề CỦA CHÍNH MÌNH — SECURITY DEFINER vì `tai_lieu` là bảng staff-only
-- (RLS chặn HS SELECT thẳng, đã verify: HS0004 select tai_lieu → 0 dòng, không lỗi).
-- Dùng my_hoc_sinh_id() bên trong, KHÔNG nhận hoc_sinh_id làm tham số — HS không
-- dò được mã đề của bạn khác qua RPC này.
create or replace function public.resolve_bien_the(p_bai_test uuid)
returns smallint
language sql stable security definer set search_path = public as $$
  select coalesce(
    (tl.cau_hinh->'hsMaDe'->> (public.my_hoc_sinh_id())::text)::smallint,
    1
  )
  from bai_test bt join tai_lieu tl on tl.id = bt.nguon_tai_lieu_id
  where bt.id = p_bai_test
$$;
grant execute on function public.resolve_bien_the(uuid) to authenticated;

-- et_de: lọc theo ĐÚNG bien_the của bai_lam (đã chốt lúc mở bài — KHÔNG tự suy lại
-- từ hsMaDe ở đây, tránh 2 nơi tính ra 2 kết quả nếu hsMaDe đổi sau khi đã mở bài).
-- Chưa có bai_lam (chưa từng mở) → mặc định 1 (chưa gán được câu nào SAI, chỉ là
-- chưa xác định — HS luôn mở bài (mo_bai_lam) TRƯỚC khi gọi hàm này ở app thật).
create or replace function public.et_de(p_bai_test uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bien_the smallint;
begin
  select bl.bien_the into v_bien_the from bai_lam bl
  where bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = public.my_hoc_sinh_id();
  v_bien_the := coalesce(v_bien_the, 1);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
      'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon, 'anh_de', bc.anh_de,
      'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                  from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
      'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem
    ) order by bc.thu_tu)
    from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
    where bc.bai_test_id = p_bai_test and bc.bien_the = v_bien_the
      and bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id)
  ), '[]'::jsonb);
end $$;
