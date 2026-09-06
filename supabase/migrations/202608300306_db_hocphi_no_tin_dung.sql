-- ============================================================================
-- 202608300306 — Phase 2b §2.0: CÔNG NỢ + TÍN DỤNG GIỚI THIỆU → function DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — nợ theo PH (noChiTietTheoPH/tinhSoDuNo) và tín dụng còn lại
--   (tinDungConLaiBatch) đang fetch hoa_don + thanh_toan + hoc_phi_tin_dung về client
--   trừ tay bằng Map. Là các Σ GROUP BY thuần — về đúng chỗ của nó.
--   Công thức (nguyên văn hocphi.ts):
--   · nợ hệ thống PH = Σ tong_tien hoá đơn ĐÃ CHỐT − Σ thanh_toan của các hoá đơn đó
--   · nợ tổng = no_khoi_tao (điền tay) + nợ hệ thống
--   · tín dụng còn lại (kỳ) = max(0, Σ cấp hieu_luc_tu ≤ kỳ − Σ |dòng giam_gioi_thieu| ở hoá đơn chốt)
-- MẤT GÌ (Luật xoá): không — chỉ thêm function.
-- ============================================================================

-- Nợ chi tiết theo PH: mọi PH có nợ khởi tạo > 0 HOẶC có hoá đơn đã chốt (khớp tập của JS cũ).
create or replace function public.fn_hocphi_no_theo_ph()
returns table (phu_huynh_id uuid, no_khoi_tao numeric, no_he_thong numeric)
language sql stable as $$
  with hd as (
    select h.phu_huynh_id, sum(h.tong_tien) as tong
    from hoa_don h where h.dong_at is not null group by h.phu_huynh_id
  ),
  tt as (
    select h.phu_huynh_id, sum(t.so_tien) as thu
    from thanh_toan t join hoa_don h on h.id = t.hoa_don_id
    where h.dong_at is not null group by h.phu_huynh_id
  )
  select ph.id, coalesce(ph.no_khoi_tao, 0),
         coalesce(hd.tong, 0) - coalesce(tt.thu, 0)
  from phu_huynh ph
  left join hd on hd.phu_huynh_id = ph.id
  left join tt on tt.phu_huynh_id = ph.id
  where coalesce(ph.no_khoi_tao, 0) > 0 or hd.phu_huynh_id is not null
$$;
grant execute on function public.fn_hocphi_no_theo_ph() to authenticated;

-- Số dư nợ 1 PH (dùng trên phiếu — "nợ kỳ trước").
create or replace function public.fn_hocphi_so_du_no(p_ph uuid)
returns numeric language sql stable as $$
  select coalesce((select no_khoi_tao from phu_huynh where id = p_ph), 0)
       + coalesce((select sum(tong_tien) from hoa_don where phu_huynh_id = p_ph and dong_at is not null), 0)
       - coalesce((select sum(t.so_tien) from thanh_toan t join hoa_don h on h.id = t.hoa_don_id
                   where h.phu_huynh_id = p_ph and h.dong_at is not null), 0)
$$;
grant execute on function public.fn_hocphi_so_du_no(uuid) to authenticated;

-- Tín dụng giới thiệu CÒN LẠI theo PH cho 1 kỳ (batch).
create or replace function public.fn_hocphi_tin_dung_con_lai(p_phs uuid[], p_ky date)
returns table (phu_huynh_id uuid, con_lai numeric)
language sql stable as $$
  with cap as (
    select td.phu_huynh_id, sum(td.so_tien) as tong
    from hoc_phi_tin_dung td
    where td.phu_huynh_id = any(p_phs) and td.hieu_luc_tu <= p_ky
    group by td.phu_huynh_id
  ),
  da_tru as (
    select h.phu_huynh_id, sum(abs(d.thanh_tien)) as tong
    from hoa_don_dong d join hoa_don h on h.id = d.hoa_don_id
    where d.loai = 'giam_gioi_thieu' and h.dong_at is not null and h.phu_huynh_id = any(p_phs)
    group by h.phu_huynh_id
  )
  select c.phu_huynh_id, greatest(0, c.tong - coalesce(dt.tong, 0))
  from cap c left join da_tru dt on dt.phu_huynh_id = c.phu_huynh_id
$$;
grant execute on function public.fn_hocphi_tin_dung_con_lai(uuid[], date) to authenticated;
