-- ============================================================================
-- 202608300729 — Phase 2d §2.0: HỆ SỐ (gợi ý + hiệu lực) & TỔNG HỢP KỲ → function DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — 4 mảnh tiền còn lại của hocphi.ts tính ở client:
--   · listHeSoHocSinh: gợi ý hệ số (≥2 môn −5% · anh chị em cùng môn −5%) — join
--     toàn trường + dò sibling bằng Map (hệ số nhân THẲNG vào học phí)
--   · heSoHieuLucBatch: "entry mới nhất ≤ kỳ" dựa vào THỨ TỰ trả về của PostgREST
--     (asc rồi ghi đè) — DISTINCT ON mới là cách nói điều đó bằng SQL
--   · listChiTietTheoPH / tinhTamTinhTheoPH: dựng dòng phiếu + tạm tính cho MỌI PH
--     bằng loop O(n²) — giờ đứng trên hoc_phi_theo_mon_ky như phiếu ảo (1 nguồn số)
-- MẤT GÌ (Luật xoá): không — thêm 4 function.
-- ============================================================================

-- Hệ số HIỆU LỰC của kỳ (entry hieu_luc_tu ≤ kỳ, mới nhất). Không entry → không dòng (caller ?? 1).
create or replace function public.fn_hocphi_he_so_hieu_luc(p_hs uuid[], p_ky date)
returns table (hoc_sinh_id uuid, he_so numeric)
language sql stable as $$
  select distinct on (h.hoc_sinh_id) h.hoc_sinh_id, h.he_so
  from hoc_sinh_he_so h
  where h.hoc_sinh_id = any(p_hs) and h.hieu_luc_tu <= p_ky
  order by h.hoc_sinh_id, h.hieu_luc_tu desc
$$;
grant execute on function public.fn_hocphi_he_so_hieu_luc(uuid[], date) to authenticated;

-- Gợi ý hệ số cho HS đang học (luật Thùy 07-05, nguyên văn gami/hocphi.js tinhHeSoHocSinh):
--   ≥2 môn đang học → −5% · có anh chị em (cùng PH, đang học) chung ≥1 môn → −5%.
-- anh_chi_em = người ĐẦU TIÊN theo thứ tự tên (để giải thích lý do — khớp JS duyệt theo ho_ten asc).
create or replace function public.fn_hocphi_he_so_goi_y(p_hs uuid default null)
returns table (hoc_sinh_id uuid, mons text[], lops text[], so_mon int,
               anh_chi_em_ten text, mon_chung text[], he_so_goi_y numeric)
language sql stable as $$
  with hs as (
    select id, ho_ten, phu_huynh_id from hoc_sinh
    where trang_thai = 'dang_hoc' and (p_hs is null or id = p_hs)
  ),
  mon_hs as ( -- môn + lớp đang học per HS (toàn trường — cần cả sibling ngoài p_hs)
    select h.id as hoc_sinh_id, h.ho_ten, h.phu_huynh_id,
           array_agg(distinct l.mon) filter (where l.mon is not null) as mons,
           array_agg(distinct l.ten_lop) filter (where l.ten_lop is not null) as lops
    from hoc_sinh h
    left join hoc_sinh_lop hsl on hsl.hoc_sinh_id = h.id and hsl.trang_thai = 'dang_hoc'
    left join lop l on l.id = hsl.lop_id
    where h.trang_thai = 'dang_hoc'
    group by h.id, h.ho_ten, h.phu_huynh_id
  ),
  sib as ( -- anh chị em đầu tiên (theo tên) có môn chung
    select m.hoc_sinh_id, s.ho_ten as sib_ten,
           (select array_agg(x) from unnest(m.mons) x where x = any(s.mons)) as mon_chung,
           row_number() over (partition by m.hoc_sinh_id order by s.ho_ten) as rn
    from mon_hs m
    join mon_hs s on s.phu_huynh_id = m.phu_huynh_id and s.hoc_sinh_id <> m.hoc_sinh_id
    where m.phu_huynh_id is not null and m.mons && s.mons
  )
  select m.hoc_sinh_id, coalesce(m.mons, '{}'), coalesce(m.lops, '{}'),
         coalesce(array_length(m.mons, 1), 0),
         s.sib_ten, s.mon_chung,
         round((1.0
           - case when coalesce(array_length(m.mons, 1), 0) >= 2 then 0.05 else 0 end
           - case when s.sib_ten is not null then 0.05 else 0 end)::numeric, 2)
  from mon_hs m
  join hs on hs.id = m.hoc_sinh_id
  left join sib s on s.hoc_sinh_id = m.hoc_sinh_id and s.rn = 1
$$;
grant execute on function public.fn_hocphi_he_so_goi_y(uuid) to authenticated;

-- Chi tiết dòng phiếu của MỌI PH trong kỳ (học phí/liệu/đuổi từ hoc_phi_theo_mon_ky + phát sinh).
-- KHÔNG gồm giảm/nợ (2 khoản đó theo PH — fn 2b). Cùng nguồn số với phiếu ảo per-PH.
create or replace function public.fn_hocphi_chi_tiet_ky(p_ky date)
returns table (phu_huynh_id uuid, loai text, hoc_sinh_id uuid, hoc_sinh_ten text,
               lop_id uuid, lop_ten text, mo_ta text, so_luong numeric, don_gia numeric,
               he_so numeric, thanh_tien numeric)
language sql stable security definer set search_path = public as $$
  with rows as (
    select * from jsonb_to_recordset(public.hoc_phi_theo_mon_ky(p_ky)) as x(
      hoc_sinh_id uuid, hoc_sinh_ten text, lop_id uuid, ten_lop text,
      so_buoi_lop int, so_buoi_di_hoc int, so_buoi_bu int, so_buoi_bu_da_hoc int,
      so_buoi_bu_da_xep int, so_buoi_duoi int, don_gia numeric, he_so numeric,
      cong_thuc_de_xuat text, cong_thuc_chon text,
      tien_hoc_chinh numeric, tien_duoi numeric, tien_hoc_lieu numeric, hoc_lieu_ten text)
  ),
  con as (select id, phu_huynh_id from hoc_sinh where phu_huynh_id is not null)
  select c.phu_huynh_id, 'hoc_phi', r.hoc_sinh_id, r.hoc_sinh_ten, r.lop_id, r.ten_lop,
         case when r.so_buoi_bu > 0
           then 'gồm ' || r.so_buoi_bu || ' buổi bù (' || r.so_buoi_bu_da_hoc || ' đã bù'
                || case when r.so_buoi_bu_da_xep > 0 then ', ' || r.so_buoi_bu_da_xep || ' đã xếp lịch' else '' end || ')'
           else null end,
         (case when coalesce(r.cong_thuc_chon, r.cong_thuc_de_xuat) = 'ct2'
               then r.so_buoi_di_hoc + r.so_buoi_bu else r.so_buoi_lop end)::numeric,
         r.don_gia, r.he_so, r.tien_hoc_chinh
  from rows r join con c on c.id = r.hoc_sinh_id where r.tien_hoc_chinh > 0
  union all
  select c.phu_huynh_id, 'hoc_lieu', r.hoc_sinh_id, r.hoc_sinh_ten, r.lop_id, r.ten_lop,
         r.hoc_lieu_ten, 1, r.tien_hoc_lieu, null, r.tien_hoc_lieu
  from rows r join con c on c.id = r.hoc_sinh_id where r.tien_hoc_lieu > 0
  union all
  select c.phu_huynh_id, 'hoc_duoi', r.hoc_sinh_id, r.hoc_sinh_ten, null, nullif(r.ten_lop, '—'),
         'Học đuổi ' || r.so_buoi_duoi || ' buổi', r.so_buoi_duoi::numeric, null, null, r.tien_duoi
  from rows r join con c on c.id = r.hoc_sinh_id where r.tien_duoi > 0
  union all
  select hs.phu_huynh_id, 'phat_sinh', hs.id, hs.ho_ten, null, null,
         ps.mo_ta, null, null, null, ps.so_tien
  from hoc_sinh hs
  join hoc_phi_phat_sinh ps on ps.ky = p_ky and (
    (ps.loai = 'ca_nhan' and ps.hoc_sinh_id = hs.id)
    or (ps.loai = 'lop' and ps.lop_id in (
      select hsl.lop_id from hoc_sinh_lop hsl
      where hsl.hoc_sinh_id = hs.id and hsl.ngay_vao < (p_ky + interval '1 month')::date
        and (hsl.ngay_roi is null or hsl.ngay_roi >= p_ky))))
  where hs.phu_huynh_id is not null and public.la_thanh_vien()
$$;
revoke all on function public.fn_hocphi_chi_tiet_ky(date) from public;
grant execute on function public.fn_hocphi_chi_tiet_ky(date) to authenticated;

-- Tổng hợp kỳ theo PH: chinh (học phí + liệu + phát sinh) / duoi — nền cho tab Danh sách + Đuổi.
create or replace function public.fn_hocphi_tong_hop_ky(p_ky date)
returns table (phu_huynh_id uuid, tien_chinh numeric, tien_duoi numeric)
language sql stable security definer set search_path = public as $$
  select ct.phu_huynh_id,
         coalesce(sum(ct.thanh_tien) filter (where ct.loai in ('hoc_phi', 'hoc_lieu', 'phat_sinh')), 0),
         coalesce(sum(ct.thanh_tien) filter (where ct.loai = 'hoc_duoi'), 0)
  from public.fn_hocphi_chi_tiet_ky(p_ky) ct
  group by ct.phu_huynh_id
$$;
revoke all on function public.fn_hocphi_tong_hop_ky(date) from public;
grant execute on function public.fn_hocphi_tong_hop_ky(date) to authenticated;
