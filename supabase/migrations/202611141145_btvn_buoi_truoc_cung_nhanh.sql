-- ============================================================================
-- 202611141145_btvn_buoi_truoc_cung_nhanh
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 14/11: "Buổi trước là buổi trước cùng nhánh thôi, không cần khác nhánh"): mig 202611131807 lấy buổi lớp đã được gán từ
--   giáo trình khác chỉ loại nhánh Hình ⇒ giáo trình Đại của lớp K10/K12 có thể nhận "buổi trước" là buổi Hình giải tích (kho câu khác,
--   builder không nạp được nội dung câu). Nay: buổi trước ở giáo trình khác phải CÙNG NHÁNH với giáo trình đang soạn.
-- MẤT GÌ (Luật xoá): không mất gì — thay thân 1 hàm, giữ chữ ký. Phần luyện lại đã soạn trỏ sang buổi khác nhánh (nếu có) không bị xoá:
--   builder nêu ở khối "không còn khớp buổi trước" để GV bỏ.
-- ============================================================================

create or replace function public._tl_bdm_buoi_truoc(p_tai_lieu uuid, p_buoi uuid)
returns table(bac integer, buoi uuid, tieu_de text, ngay date)
language sql stable security definer set search_path to 'public' as $$
  with x as (
    select p.id, p.thu_tu from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi'
  ),
  trong as (
    select y.id, y.tieu_de, null::date as ngay, 0 as nguon, row_number() over (order by y.thu_tu desc, y.id desc) as o
      from tai_lieu_phan y cross join x
     where y.tai_lieu_id = p_tai_lieu and y.loai_phan = 'buoi' and (y.thu_tu, y.id) < (x.thu_tu, x.id)
       and exists (select 1 from tai_lieu_phan n where n.cha_id = y.id and n.loai_phan = 'nhom')
  ),
  ngoai as (
    select g.id, g.tieu_de, g.ngay, 1 as nguon, row_number() over (order by g.ngay desc, g.id desc) as o
      from (
        select b.id, b.tieu_de, max(d.ngay) as ngay
          from tai_lieu t
          join tai_lieu d on d.lop_id = t.lop_id and d.loai = 'giao_trinh_buoi' and d.ban_do = 'moi' and d.hoc_sinh_id is null
                         and coalesce(d.nhanh, '') = coalesce(t.nhanh, '')   -- 14/11: CÙNG NHÁNH với giáo trình này (Đại ↔ Đại, Hình giải tích ↔ Hình giải tích)
                         and d.nguon_id is not null and d.nguon_id <> p_tai_lieu
          join tai_lieu_phan b on b.id = case when d.nguon_buoi ~ '^[0-9a-fA-F-]{36}$' then d.nguon_buoi::uuid end
                              and b.loai_phan = 'buoi'
         where t.id = p_tai_lieu and t.lop_id is not null and exists (select 1 from x)
           and exists (select 1 from tai_lieu_phan n where n.cha_id = b.id and n.loai_phan = 'nhom')
         group by b.id, b.tieu_de
      ) g
  )
  select (row_number() over (order by z.nguon, z.o))::int, z.id, z.tieu_de, z.ngay
    from (select * from trong union all select * from ngoai) z
   order by z.nguon, z.o
   limit 2
$$;
