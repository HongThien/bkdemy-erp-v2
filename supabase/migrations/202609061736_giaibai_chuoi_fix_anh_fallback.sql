-- ============================================================================
-- 202609061736 — giaibai_chuoi_fix_anh_fallback
-- ----------------------------------------------------------------------------
-- BUG (Thùy báo 06/09 tối): Kho bài — nhiều bài Hình KHÔNG hiện ảnh dù đã dặn "ảnh mặc định lấy ý cuối".
-- Nguyên nhân: `fn_hinh_chuoi_json` (mig 202609061619) lấy ẢNH của mỗi node CHỈ từ `hinh_baitoan.anh_chuan` —
-- nhưng phần lớn bài toán KHÔNG tự có ảnh riêng, ảnh thật nằm ở HÌNH CHUNG của mô hình (`hinh_mo_hinh.anh_cau_hinh`).
-- Mọi view khác (v_hinh_chua_giai, v_giaibai_bai/hoan_thien nhánh Hình…) đều lấy đúng
-- `coalesce(b.anh_chuan, m.anh_cau_hinh)` — CHỈ RIÊNG hàm chuỗi này thiếu fallback, nên node không có anh_chuan
-- riêng ⇒ ảnh null ⇒ "ý cuối" (ĐÍCH) thường không có anh_chuan riêng ⇒ card không hiện ảnh gì cả.
-- SỬA: thêm `join hinh_mo_hinh m` ở NHÁNH BÀI TOÁN (đang thiếu) và coalesce b.anh_chuan/m.anh_cau_hinh; nhánh BIẾN
-- THỂ coalesce đủ 3 tầng v.anh → b.anh_chuan → m.anh_cau_hinh (đúng thứ tự v_hinh_chua_giai đã dùng).
-- MẤT GÌ (Luật xoá): không — create-or-replace function, chỉ sửa biểu thức lấy ảnh, giữ nguyên chữ ký/logic khác.
create or replace function public.fn_hinh_chuoi_json(p_loai text, p_id uuid)
returns jsonb
language sql stable as $$
  with goc as (
    select case when p_loai = 'baitoan' then p_id else (select baitoan_id from hinh_baitoan_bien_the where id = p_id) end as id
  ),
  nodes as (
    select g.id, 0 as do_sau from goc g
    union all
    select t.id, t.do_sau from goc g cross join lateral public.hinh_bao_dong_tien_de(g.id) t
  ),
  y as (
    select jsonb_build_object(
      'id', b.id, 'ma', b.ma, 'cap', b.cap, 'do_sau', n.do_sau, 'loai', 'baitoan',
      'la_dich', (p_loai = 'baitoan' and b.id = (select id from goc)),
      'gia_thiet_rieng', b.gia_thiet_rieng, 'gt_thay_the', b.gt_thay_the, 'gia_thiet_phu', b.gia_thiet_phu,
      'phat_bieu', b.phat_bieu, 'anh', coalesce(b.anh_chuan, m.anh_cau_hinh),
      'trang_thai', tt.trang_thai, 'loi_giai', tt.loi_giai, 'anh_loi_giai', tt.anh_loi_giai
    ) as j, b.cap, b.ma
    from nodes n join hinh_baitoan b on b.id = n.id join hinh_mo_hinh m on m.id = b.mo_hinh_id
    cross join lateral public.fn_hinh_tt_node(b.id) tt
    union all
    select jsonb_build_object(
      'id', v.id, 'ma', b.ma || ' · BT' || v.thu_tu, 'cap', b.cap, 'do_sau', -1, 'loai', 'bien_the', 'la_dich', true,
      'gia_thiet_rieng', null, 'gt_thay_the', false, 'gia_thiet_phu', null,
      'phat_bieu', v.de_bai, 'anh', coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh),
      'trang_thai', public.fn_hinh_tt_bien_the(v.id), 'loi_giai', v.loi_giai, 'anh_loi_giai', v.anh_loi_giai
    ), b.cap + 1, 'zz'
    from hinh_baitoan_bien_the v join hinh_baitoan b on b.id = v.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
    where p_loai = 'bien_the' and v.id = p_id
  )
  select jsonb_build_object(
    'mo_hinh', (select jsonb_build_object('ma', m.ma, 'ten', m.ten, 'gia_thiet', m.gia_thiet, 'gia_thiet_them', m.gia_thiet_them, 'anh', m.anh_cau_hinh)
                from goc g join hinh_baitoan b on b.id = g.id join hinh_mo_hinh m on m.id = b.mo_hinh_id),
    'y', coalesce((select jsonb_agg(j order by cap, ma) from y), '[]'::jsonb)
  )
$$;
