-- ============================================================================
-- 202611232053 — kho_nhan_loc_dong_ham_noi_bo
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Cổng `check:kien-truc` (K1) báo 3 hàm nội bộ của nhãn lọc (mig 202611232047: _nhan_loc_nhanh_cua_kho,
--   _nhan_loc_duoc_sua, _nhan_loc_json) client gọi được. Hàm nội bộ không phải cửa của màn ⇒ thu quyền gọi của người
--   đăng nhập. Muốn thu được thì hàm đọc danh mục fn_nhan_loc_ds (đang chạy quyền người gọi, có gọi 2 hàm nội bộ đó)
--   phải chuyển sang security definer + cổng nhân sự ở đầu thân. Kết quả trả về không đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu. Thu quyền EXECUTE của `authenticated` trên 3 hàm nội bộ nói trên (không màn nào gọi thẳng).
-- ============================================================================

create or replace function public.fn_nhan_loc_ds(p_mon text, p_nhanh text, p_kho text default null, p_pham_vi text default null, p_ca_da_xoa boolean default false)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  return (
    with dv as materialized (
      select distinct coalesce(c.bai_y, c.parent_ma_cau, c.ma_cau) as ma
        from hinh_hoc_cau_hoi c
       where p_kho = 'hinh_hoc' and c.dang_chinh = p_pham_vi and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)
    ), dem as (
      select g.nhan_id, count(*)::int as so from kho_nhan_loc_gan g join dv on dv.ma = g.ma where g.kho = p_kho group by 1
    )
    select jsonb_build_object(
      'duoc_sua', public._nhan_loc_duoc_sua(p_mon),
      'nhan', coalesce((
        select jsonb_agg(public._nhan_loc_json(nl) || jsonb_build_object(
                   'so_bai', coalesce(d.so, 0),
                   'tong', (select coalesce(jsonb_object_agg(t.kho, t.c), '{}'::jsonb)
                              from (select g.kho, count(*)::int as c from kho_nhan_loc_gan g where g.nhan_id = nl.id group by 1) t))
                 order by nl.xoa_at is not null, nl.tao_at, nl.id)
          from kho_nhan_loc nl left join dem d on d.nhan_id = nl.id
         where nl.mon = p_mon and nl.nhanh = p_nhanh and (p_ca_da_xoa or nl.xoa_at is null)), '[]'::jsonb)));
end $$;

revoke execute on function public._nhan_loc_nhanh_cua_kho(text) from authenticated;
revoke execute on function public._nhan_loc_duoc_sua(text) from authenticated;
revoke execute on function public._nhan_loc_json(public.kho_nhan_loc) from authenticated;
