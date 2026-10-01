-- ============================================================================
-- 202609051251 — GẬY ĐI THEO TASK + lọc bảng gậy theo KHOẢNG NGÀY (tháng / tuần)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 05/09): "gậy sẽ đi theo task — task nào có gậy tức là không đạt
--   chuẩn; sau này đếm hiệu suất = tổng task đạt chuẩn / tổng task". Gậy thủ công
--   trước đây chỉ gắn NGƯỜI + lỗi; giờ gắn vào 1 task cụ thể (ref_loai/ref_id —
--   cùng khoá gậy tự động đã dùng: `vh:<buoiId>|<tab>|<nsId>` · `viec:<id>`).
--   Bảng gậy cần xem theo TUẦN ngoài tháng → function theo khoảng ngày VN.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì — thêm 1 cột nullable, 1 dòng danh mục, 2 function.
--   fn_gay_bang / fn_gay_chot_thang (theo `ky` tháng) GIỮ NGUYÊN — chốt tháng vẫn dùng.
-- ============================================================================

-- ── 1) Nhãn task lúc đánh (để hiển thị/đối chiếu về sau, không phải parse ref_id) ──
alter table gay_ledger add column if not exists ref_mo_ta text;
create index if not exists idx_gay_ledger_ref on gay_ledger(nhan_su_id, ref_id) where ref_id is not null;

-- ── 2) Lỗi hệ thống mặc định khi đánh gậy theo task ─────────────────────────
insert into gay_loi (ma, ten, so_gay_mac_dinh)
select 'khong_dat_chuan', 'Task không đạt chuẩn', 1
where not exists (select 1 from gay_loi where ma = 'khong_dat_chuan');

-- ── 3) BẢNG GẬY theo KHOẢNG NGÀY VN [p_tu, p_den] (tháng hoặc tuần) ──────────
-- Cùng công thức fn_gay_bang (Σ ledger hiệu lực, sàn 0, 20k/gậy) nhưng scope theo
-- ngày VN của created_at thay vì cột `ky`. Thêm so_task_khong_dat = số task RIÊNG
-- BIỆT bị đánh gậy trong khoảng (mầm cho hiệu suất = task đạt chuẩn / tổng task).
create or replace function public.fn_gay_bang_khoang(p_tu date, p_den date)
returns table (
  nhan_su_id uuid, ns_ten text, so_gay_danh bigint, so_gay_go bigint, con_lai bigint,
  so_task_khong_dat bigint, don_gia numeric, tien_phat numeric
)
language sql stable as $$
  select l.nhan_su_id, ns.ho_ten,
         coalesce(sum(l.so_gay) filter (where l.so_gay > 0), 0) as so_gay_danh,
         coalesce(-sum(l.so_gay) filter (where l.so_gay < 0), 0) as so_gay_go,
         greatest(0, coalesce(sum(l.so_gay), 0)) as con_lai,
         count(distinct l.ref_id) filter (where l.so_gay > 0 and l.ref_id is not null) as so_task_khong_dat,
         20000::numeric as don_gia,
         greatest(0, coalesce(sum(l.so_gay), 0)) * 20000 as tien_phat
  from gay_ledger l
  join nhan_su ns on ns.id = l.nhan_su_id
  where (l.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
    and l.thu_hoi_at is null
  group by l.nhan_su_id, ns.ho_ten
  order by con_lai desc, so_gay_danh desc
$$;
grant execute on function public.fn_gay_bang_khoang(date, date) to authenticated;

-- ── 4) GẬY THEO TASK của 1 nhân sự (null = mọi người): Σ gậy hiệu lực theo ref_id ──
-- Dùng cho picker "chọn task để đánh" (badge task đã có gậy) và hiệu suất về sau.
create or replace function public.fn_gay_theo_task(p_nhan_su_id uuid default null)
returns table (nhan_su_id uuid, ref_loai text, ref_id text, so_gay bigint, lan_cuoi timestamptz)
language sql stable as $$
  select l.nhan_su_id, l.ref_loai, l.ref_id, sum(l.so_gay) as so_gay, max(l.created_at) as lan_cuoi
  from gay_ledger l
  where l.ref_id is not null and l.so_gay > 0 and l.thu_hoi_at is null
    and (p_nhan_su_id is null or l.nhan_su_id = p_nhan_su_id)
  group by l.nhan_su_id, l.ref_loai, l.ref_id
$$;
grant execute on function public.fn_gay_theo_task(uuid) to authenticated;
