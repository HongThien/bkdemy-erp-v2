-- [Kiến trúc · Đợt 4] Home HS: gộp các lượt gọi NHẸ lúc mở app / về màn chính thành 2 RPC (spec-kien-truc §5 "một màn = một RPC").
-- CHỈ THÊM 2 hàm đọc. Không sửa/xoá hàm nào. Mỗi phần GỌI LẠI đúng hàm đang có ⇒ công thức vẫn ở MỘT nơi.
-- Lớp chi phí: C2 (dữ liệu của MỘT học sinh). Đo 14/11 (pg_stat_statements): các phần 3–159 ms, tổng ước < 400 ms.
-- KHÔNG gộp: fn_thanh_tuu_cho_nhan (477 ms, Đợt 5) · fn_the_gioi_home (3,3 s, Đợt 3) · danh sách bài · hòm thư · rank/nhiệm vụ theo môn · bổ trợ.
-- security INVOKER: quyền/danh tính do chính các hàm con (security definer + my_hoc_sinh_id()) quyết, hàm gộp không mở thêm gì.

-- Phần "về màn chính" — client gọi mỗi lần em quay về màn chính (thay 3–4 lượt gọi lẻ).
create or replace function public.fn_hs_man_chinh(p_home912 boolean default true)
returns jsonb
language plpgsql
security invoker
set search_path to 'public'
as $$
begin
  if public.my_hoc_sinh_id() is null then return null; end if;   -- không phải HS ⇒ client tự rơi về cách gọi lẻ
  return jsonb_build_object(
    'chuoi',     public.fn_chuoi_cua_toi(),
    'tinh_nang', to_jsonb(public.fn_hs_tinh_nang_mo()),
    'tutorial',  to_jsonb(public.fn_hs_tutorial_cua_toi()),
    'home912',   case when p_home912 then public.fn_hs_home_912() end
  );
end $$;

-- Phần "khởi động" — client gọi MỘT lần lúc mở app (thay 9 lượt gọi lẻ) + kèm luôn phần màn chính của lượt đầu.
create or replace function public.fn_hs_khoi_dong()
returns jsonb
language plpgsql
security invoker
set search_path to 'public'
as $$
begin
  if public.my_hoc_sinh_id() is null then return null; end if;
  return jsonb_build_object(
    'cap1',      public.hs_cap1_cua_toi(),
    'cap2',      public.hs_cap2_cua_toi(),
    'khoi',      public.hs_khoi_cua_toi(),
    'ho_so',     public.hs_ho_so_cua_toi(),
    'mon_hoc',   coalesce((select jsonb_agg(jsonb_build_object('mon', m.mon, 'ten_lop', m.ten_lop, 'co_kho', m.co_kho) order by m.stt)
                           from public.hs_mon_hoc_cua_toi() with ordinality as m(mon, ten_lop, co_kho, stt)), '[]'::jsonb),
    'mon_rieng', coalesce((select jsonb_agg(jsonb_build_object('mon', r.mon, 'co_kho', r.co_kho) order by r.stt)
                           from public.hs_mon_rieng_cua_toi() with ordinality as r(mon, co_kho, stt)), '[]'::jsonb),
    'nhan_vat',  public.fn_hs_nhan_vat_cua_toi(),
    'giao_dien', public.fn_hs_giao_dien_cua_toi(),
    'gop_y_chua_doc', public.fn_hs_gop_y_chua_doc(),
    'man_chinh', public.fn_hs_man_chinh(true)
  );
end $$;

revoke all on function public.fn_hs_man_chinh(boolean) from public, anon;
revoke all on function public.fn_hs_khoi_dong() from public, anon;
grant execute on function public.fn_hs_man_chinh(boolean) to authenticated;
grant execute on function public.fn_hs_khoi_dong() to authenticated;
