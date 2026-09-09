-- ============================================================================
-- 202609081120 — kho_kiem_lo
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-kho-chuan.md §2 mức B/C + §4 bước 4 "mỗi lô ghi log precision; dừng nếu độ tin < ngưỡng CEO đặt"):
--   Máy (mức A) và Claude (mức B) ký/nghi hàng nghìn câu. Để mức C (người, mẫu 2%) đo được ĐỘ TIN CỦA TỪNG BÊN, mỗi lượt ghi phải
--   là một LÔ có định danh: câu nào thuộc lô nào, lô do ai kiểm, ký hay chỉ báo. Người duyệt sau đó (fn_kho_duyet_cau) để lại dấu
--   "người xác nhận" / "người sửa đáp số" trong kiem_may_ghi ⇒ precision lô = xác nhận / (xác nhận + sửa) — tính ở DB, không log riêng.
--   Bảng `kho_kiem_lo` chung cho 3 kho (cột `kho`), câu trỏ về lô bằng `kiem_may_lo`. Lô mức A đã chạy 08/09 (1.696 câu mcq-auto)
--   được dựng lại từ dữ liệu thật (kiem_may_boi='mcq-auto') để không có "đợt 1 vô danh".
-- MẤT GÌ: không — thêm bảng/cột/hàm; backfill chỉ set kiem_may_lo cho dòng đang null.
-- ============================================================================
create table if not exists kho_kiem_lo (
  id          uuid primary key default gen_random_uuid(),
  kho         text not null check (kho in ('dai', 'khtn', 'hgt')),
  boi         text not null check (boi in ('mcq-auto', 'claude_code')),
  ten         text not null,                                   -- vd "B-01 HS đã làm K6-8 + K10"
  ky          boolean not null default true,                   -- true = khớp ⇒ da_duyet; false = chỉ báo (độ tin thấp)
  so_cau      integer not null default 0,
  so_khop     integer not null default 0,
  so_nghi     integer not null default 0,
  so_khong_kiem integer not null default 0,
  ghi_chu     text,
  tao_at      timestamptz not null default now()
);
alter table kho_kiem_lo enable row level security;
drop policy if exists kho_kiem_lo_member_all on kho_kiem_lo;
create policy kho_kiem_lo_member_all on kho_kiem_lo for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update on kho_kiem_lo to authenticated;

do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi'] loop
    execute format('alter table %I add column if not exists kiem_may_lo uuid references kho_kiem_lo(id)', t);
  end loop;
end $$;
comment on column dai_cau_hoi.kiem_may_lo is 'Lô kiểm đáp số (kho_kiem_lo) mà máy/AI đã ghi kiem_may cho câu này — để đo precision từng lô ở mức C.';

-- Backfill: lô mức A đã chạy 08/09 (mcq-auto, 1.696 câu)
do $$
declare v_id uuid;
begin
  if not exists (select 1 from kho_kiem_lo where boi = 'mcq-auto' and ten = 'A-01 whitelist 48 dạng (08/09)') then
    insert into kho_kiem_lo (kho, boi, ten, ky, ghi_chu) values ('dai', 'mcq-auto', 'A-01 whitelist 48 dạng (08/09)', true,
      'scripts/kho-quet-dapso.mjs --ghi, 08/09 ~09:20 — máy ký khớp 1.679 (9 người đã ký trước), nghi 17') returning id into v_id;
    update dai_cau_hoi set kiem_may_lo = v_id where kiem_may_boi = 'mcq-auto' and kiem_may_lo is null;
    update kho_kiem_lo l set so_cau = s.n, so_khop = s.k, so_nghi = s.g, so_khong_kiem = s.x
      from (select count(*) n, count(*) filter (where kiem_may = 'khop') k, count(*) filter (where kiem_may = 'nghi') g,
                   count(*) filter (where kiem_may = 'khong_kiem_duoc') x from dai_cau_hoi where kiem_may_lo = v_id) s
      where l.id = v_id;
  end if;
end $$;

-- ── Thống kê lô: kết quả máy/AI lúc ghi + phản hồi NGƯỜI sau đó (từ kiem_may_ghi do fn_kho_duyet_cau để lại) ──
-- nguoi_xac_nhan = người duyệt mà không đổi đáp số · nguoi_sua = người đổi đáp số · tu_choi = vào kho rác.
-- precision (trên phần người đã soát) = xác nhận / (xác nhận + sửa). NULL khi chưa ai soát.
create or replace function public.fn_kho_kiem_lo_thong_ke(p_kho text default null)
returns table (id uuid, kho text, boi text, ten text, ky boolean, tao_at timestamptz,
               so_cau integer, so_khop integer, so_nghi integer, so_khong_kiem integer,
               nguoi_xac_nhan bigint, nguoi_sua bigint, tu_choi bigint, precision_nguoi numeric)
language plpgsql stable security definer set search_path = public as $$
declare r record;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  for r in select * from kho_kiem_lo l where p_kho is null or l.kho = p_kho order by l.tao_at loop
    id := r.id; kho := r.kho; boi := r.boi; ten := r.ten; ky := r.ky; tao_at := r.tao_at;
    so_cau := r.so_cau; so_khop := r.so_khop; so_nghi := r.so_nghi; so_khong_kiem := r.so_khong_kiem;
    execute format($q$
      select count(*) filter (where c.xoa_at is null and c.kiem_may_boi = 'nguoi' and c.kiem_may_ghi like 'người xác nhận%%'),
             count(*) filter (where c.xoa_at is null and c.kiem_may_boi = 'nguoi' and c.kiem_may_ghi like 'người sửa đáp số%%'),
             count(*) filter (where c.xoa_at is not null)
      from %I c where c.kiem_may_lo = $1$q$, r.kho || '_cau_hoi') into nguoi_xac_nhan, nguoi_sua, tu_choi using r.id;
    precision_nguoi := case when nguoi_xac_nhan + nguoi_sua = 0 then null
                            else round(nguoi_xac_nhan::numeric / (nguoi_xac_nhan + nguoi_sua), 4) end;
    return next;
  end loop;
end $$;
grant execute on function public.fn_kho_kiem_lo_thong_ke(text) to authenticated;
