-- CHỐT XU THÁNG ghi vào SỔ XU CHUNG qlht_xu_ledger (hệ quà của Hải) — Thùy chốt 08-29: BK chỉ có 1 xu.
-- ⚠ CHẠY TAY trong Supabase SQL Editor (role postgres — chủ sở hữu qlht_*). npm run migrate KHÔNG chạy
--   được file này (claude_build không phải owner). Idempotent — chạy lại vô hại.
-- ⚠ BÁO HẢI TRƯỚC KHI CHẠY MỤC (4): view qlht_v_so_du_xu là HỢP ĐỒNG của app Hải + prompt trợ lý AI.
--   Đổi nghĩa: xu_kiem từ "floor(EXP toàn thời gian / 10) tự động" → "Σ xu ĐÃ CHỐT theo tháng".
--   Cột/kiểu giữ nguyên nên app không vỡ, nhưng SỐ hiển thị đổi (công thức /10 là tạm — Hải biết).

-- (1) Cột cho dòng chốt (nullable — dòng cộng/trừ tay cũ của app quà không ảnh hưởng)
alter table qlht_xu_ledger add column if not exists mon text;           -- môn nguồn EXP của dòng chốt
alter table qlht_xu_ledger add column if not exists thang text;         -- 'YYYY-MM' tháng EXP được chốt
alter table qlht_xu_ledger add column if not exists exp_snapshot integer; -- EXP tại thời điểm chốt (soát chênh)

-- (2) Nới CHECK loai: thêm 'chot_thang' (dòng chốt gốc) + 'chot_lai' (điều chỉnh ± khi data trễ/sửa điểm)
alter table qlht_xu_ledger drop constraint if exists qlht_xu_ledger_loai_check;
alter table qlht_xu_ledger add constraint qlht_xu_ledger_loai_check
  check (loai = any (array['cong_tay','tru_tay','doi_qua','hoan','chot_thang','chot_lai']));

-- (3) 1 dòng chốt GỐC / (HS×môn×tháng) — chặn double-click/2 tab chốt trùng; chot_lai không giới hạn.
create unique index if not exists qlht_xu_ledger_chot_1
  on qlht_xu_ledger (hoc_sinh_id, mon, thang) where loai = 'chot_thang';

-- (3b) ERP (đăng nhập nhân sự) được GHI dòng chốt — hiện bảng chỉ có policy SELECT.
--      Chỉ INSERT (sổ append-only — không update/delete từ app).
drop policy if exists qlht_xu_ledger_ins on qlht_xu_ledger;
create policy qlht_xu_ledger_ins on qlht_xu_ledger for insert to authenticated
  with check (current_nhan_su_id() is not null);
grant select, insert on qlht_xu_ledger to authenticated;

-- (4) ⚠ HỢP ĐỒNG — số dư = CHỈ tổng sổ (bỏ công thức tạm EXP/10). Cột & kiểu GIỮ NGUYÊN:
--     exp_total: giữ (tham khảo) · xu_kiem: Σ chốt (chot_thang+chot_lai) · xu_dieu_chinh: Σ tay/quà · so_du = kiem + dieu_chinh
create or replace view qlht_v_so_du_xu as
select hs.id as hoc_sinh_id,
    hs.ho_ten,
    coalesce(e.exp_total, 0::bigint) as exp_total,
    coalesce(k.xu_chot, 0)::integer as xu_kiem,
    coalesce(l.dieu_chinh, 0::bigint) as xu_dieu_chinh,
    (coalesce(k.xu_chot, 0) + coalesce(l.dieu_chinh, 0))::bigint as so_du
  from hoc_sinh hs
    left join (select gami_exp_ledger.hoc_sinh_id, sum(gami_exp_ledger.amount) as exp_total
               from gami_exp_ledger group by gami_exp_ledger.hoc_sinh_id) e on e.hoc_sinh_id = hs.id
    left join (select qlht_xu_ledger.hoc_sinh_id, sum(qlht_xu_ledger.amount) as xu_chot
               from qlht_xu_ledger where qlht_xu_ledger.loai in ('chot_thang','chot_lai')
               group by qlht_xu_ledger.hoc_sinh_id) k on k.hoc_sinh_id = hs.id
    left join (select qlht_xu_ledger.hoc_sinh_id, sum(qlht_xu_ledger.amount) as dieu_chinh
               from qlht_xu_ledger where qlht_xu_ledger.loai in ('cong_tay','tru_tay','doi_qua','hoan')
               group by qlht_xu_ledger.hoc_sinh_id) l on l.hoc_sinh_id = hs.id
  where current_nhan_su_id() is not null;
