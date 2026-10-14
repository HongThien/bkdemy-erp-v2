-- ============================================================================
-- 202610141242 — hinh_luyen_kho_cua_mo_hinh
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "kho bài của mỗi nhóm bài hình đâu? cần chỗ truy cập nhanh. Kho là các chuỗi bài — mỗi chuỗi 1 dòng".
--   Một CHUỖI = một bài kho (hinh_bai) với các ý a → b → c. Kho của một mô hình luyện = bài kho
--   (a) đã gán cả bài vào mô hình (hinh_bai.mo_hinh_id) HOẶC (b) có ý gán vào một bài thuộc cây mô hình đó.
--   Mỗi ý kèm số hiển thị của bài mô hình nó gán (suy từ fn_hl_so_hien_thi — chỉ để đọc, khoá vẫn là baitoan_id).
--
-- MẤT GÌ: không. Chỉ thêm 2 hàm đọc.
-- ============================================================================

-- Kho (các chuỗi) của một mô hình luyện gốc cây.
create or replace function fn_hl_kho_cua_mo_hinh(p_mo_hinh uuid, p_gioi_han integer default 200)
returns jsonb language sql stable set search_path = public as $$
  with cay as (select s.baitoan_id, s.so, s.ma from fn_hl_so_hien_thi(p_mo_hinh) s),
  kb as (
    select hb.* from hinh_bai hb
     where hb.mo_hinh_id = p_mo_hinh
        or exists (select 1 from hinh_y y join cay on cay.baitoan_id = y.baitoan_id where y.bai_id = hb.id)
     order by hb.created_at, hb.ma_bai
     limit greatest(1, least(coalesce(p_gioi_han, 200), 500))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', kb.id, 'ma_bai', kb.ma_bai, 'nguon', kb.nguon, 'nguon_ma_cau', kb.nguon_ma_cau,
    'de_bai', kb.de_bai, 'gia_thiet_chung', kb.gia_thiet_chung, 'anh_de', kb.anh_de,
    'gan_ca_bai', kb.mo_hinh_id = p_mo_hinh,
    'y', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', y.id, 'ma_y', y.ma_y, 'nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung, 'dap_an', y.dap_an,
            'loi_giai', y.loi_giai, 'anh_de', y.anh_de, 'da_duyet', y.da_duyet, 'baitoan_id', y.baitoan_id,
            'so', cay.so, 'ma_bai_mh', cay.ma,
            'ngoai_mo_hinh', y.baitoan_id is not null and cay.baitoan_id is null) order by y.thu_tu), '[]'::jsonb)
            from hinh_y y left join cay on cay.baitoan_id = y.baitoan_id where y.bai_id = kb.id)
  ) order by kb.created_at, kb.ma_bai), '[]'::jsonb) from kb
$$;

-- Đếm kho theo từng mô hình luyện gốc của khối (badge ở danh sách mô hình).
create or replace function fn_hl_dem_kho_mo_hinh(p_khoi text)
returns table(mo_hinh_id uuid, so_chuoi bigint, so_y bigint, so_y_da_gan bigint)
language sql stable set search_path = public as $$
  select g.id,
         count(distinct hb.id),
         count(y.id),
         count(y.id) filter (where y.baitoan_id in (select s.baitoan_id from fn_hl_so_hien_thi(g.id) s))
    from hinh_mo_hinh g
    left join lateral (
      select hb.id from hinh_bai hb
       where hb.mo_hinh_id = g.id
          or exists (select 1 from hinh_y y2 where y2.bai_id = hb.id
                       and y2.baitoan_id in (select s.baitoan_id from fn_hl_so_hien_thi(g.id) s))
    ) hb on true
    left join hinh_y y on y.bai_id = hb.id
   where g.phan = 'luyen' and g.neo_baitoan_id is null and (p_khoi is null or g.khoi = p_khoi)
   group by g.id
$$;

revoke execute on function fn_hl_kho_cua_mo_hinh(uuid, integer), fn_hl_dem_kho_mo_hinh(text) from public, anon;
grant execute on function fn_hl_kho_cua_mo_hinh(uuid, integer), fn_hl_dem_kho_mo_hinh(text) to authenticated;
