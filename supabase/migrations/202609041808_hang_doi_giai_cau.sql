-- 202609041808 — Kho: HÀNG ĐỢI GIẢI CÂU CHƯA CÓ LỜI GIẢI (Thùy 04/09).
--
-- Bối cảnh: màn "Duyệt lời giải AI" (27/08) chỉ DUYỆT lời giải đã có. Việc GIẢI câu chưa có lời giải
-- (Story 2, 26/08) tới nay phải nhờ Claude Code trong chat, không có chỗ nào trong ERP liệt kê
-- "câu nào chưa có lời giải" để người biết mà làm. Yêu cầu (Thùy 04/09): thêm 1 tab ở màn Duyệt —
-- danh sách câu CHƯA CÓ LỜI GIẢI trong kho, mỗi câu 2 lựa chọn:
--   (1) người tự giải: gõ lời giải / up ảnh lời giải ngay tại chỗ;
--   (2) đặt Claude giải: đưa vào HÀNG ĐỢI (giống hàng đợi clone 26/08) — Claude Code xử lý theo lô,
--       kết quả ghi thẳng vào câu (nguon_giai='ai', giai_method='claude_code', da_duyet=false) →
--       tự hiện ở tab "Lời giải mới từ Claude" để duyệt. KHÔNG bảng nháp riêng như clone: câu đã tồn
--       tại thật, chỉ điền loi_giai; nhãn nguon_giai='ai' + da_duyet=false là hàng rào duyệt sẵn có.
--
-- "Chưa có lời giải" = loi_giai IS NULL AND anh_dap_an IS NULL (ảnh lời giải cũng là lời giải).
-- Hàng đợi = YÊU CẦU thật (không suy ra được) → phải lưu (như dai_cau_hoi_yeu_cau_clone).
-- Mỗi nhánh 1 bảng RIÊNG, đối xứng (CLAUDE.md §1.6) — dispatch môn→bảng gom trong fn_kho_tbl.
-- MẤT GÌ (Luật xoá): không — chỉ thêm bảng/function.

-- ── Registry môn → tiền tố bảng (1 chỗ duy nhất phía SQL; phía TS là khoTbls) ──
create or replace function public.fn_kho_tbl(p_mon text) returns text
language sql immutable as $$
  select case p_mon when 'toan' then 'dai' when 'khtn' then 'khtn' when 'hgt' then 'hgt' end
$$;

-- ── 3 bảng hàng đợi, cùng shape ──
create table if not exists dai_cau_hoi_yeu_cau_giai (
  id uuid primary key default gen_random_uuid(),
  ma_cau text not null references dai_cau_hoi(ma_cau) on delete cascade,
  ghi_chu text,
  nguoi_yeu_cau uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz
);
create unique index if not exists dai_cau_hoi_yeu_cau_giai_cho_uniq on dai_cau_hoi_yeu_cau_giai (ma_cau) where xu_ly_at is null;
alter table dai_cau_hoi_yeu_cau_giai enable row level security;
drop policy if exists dai_cau_hoi_yeu_cau_giai_member_all on dai_cau_hoi_yeu_cau_giai;
create policy dai_cau_hoi_yeu_cau_giai_member_all on dai_cau_hoi_yeu_cau_giai
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on dai_cau_hoi_yeu_cau_giai to authenticated;

create table if not exists khtn_cau_hoi_yeu_cau_giai (
  id uuid primary key default gen_random_uuid(),
  ma_cau text not null references khtn_cau_hoi(ma_cau) on delete cascade,
  ghi_chu text,
  nguoi_yeu_cau uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz
);
create unique index if not exists khtn_cau_hoi_yeu_cau_giai_cho_uniq on khtn_cau_hoi_yeu_cau_giai (ma_cau) where xu_ly_at is null;
alter table khtn_cau_hoi_yeu_cau_giai enable row level security;
drop policy if exists khtn_cau_hoi_yeu_cau_giai_member_all on khtn_cau_hoi_yeu_cau_giai;
create policy khtn_cau_hoi_yeu_cau_giai_member_all on khtn_cau_hoi_yeu_cau_giai
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on khtn_cau_hoi_yeu_cau_giai to authenticated;

create table if not exists hgt_cau_hoi_yeu_cau_giai (
  id uuid primary key default gen_random_uuid(),
  ma_cau text not null references hgt_cau_hoi(ma_cau) on delete cascade,
  ghi_chu text,
  nguoi_yeu_cau uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz
);
create unique index if not exists hgt_cau_hoi_yeu_cau_giai_cho_uniq on hgt_cau_hoi_yeu_cau_giai (ma_cau) where xu_ly_at is null;
alter table hgt_cau_hoi_yeu_cau_giai enable row level security;
drop policy if exists hgt_cau_hoi_yeu_cau_giai_member_all on hgt_cau_hoi_yeu_cau_giai;
create policy hgt_cau_hoi_yeu_cau_giai_member_all on hgt_cau_hoi_yeu_cau_giai
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hgt_cau_hoi_yeu_cau_giai to authenticated;

-- ── Danh sách câu chưa có lời giải (1 môn × 1 khối) kèm trạng thái hàng đợi — §2.0: join ở DB ──
create or replace function public.fn_kho_cau_chua_giai(p_mon text, p_khoi text, p_limit int default 500)
returns table (
  ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text,
  noi_dung text, lua_chon jsonb, dap_an text, anh_de text, nguon text, created_at timestamptz,
  yeu_cau_id uuid, yeu_cau_at timestamptz, yeu_cau_ghi_chu text
)
language plpgsql stable as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if t is null then raise exception 'fn_kho_cau_chua_giai: môn không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.dap_an, c.anh_de, c.nguon, c.created_at,
           y.id, y.created_at, y.ghi_chu
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    left join %3$I y on y.ma_cau = c.ma_cau and y.xu_ly_at is null
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and b.khoi = $1
    order by c.dang_chinh, c.ma_cau
    limit $2
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai') using p_khoi, p_limit;
end $$;
grant execute on function public.fn_kho_cau_chua_giai(text, text, int) to authenticated;

-- ── Đếm theo khối (cho dropdown khối biết chỗ nào còn việc) ──
create or replace function public.fn_kho_dem_cau_chua_giai(p_mon text)
returns table (khoi text, so_cau bigint, so_cho_giai bigint)
language plpgsql stable as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if t is null then raise exception 'fn_kho_dem_cau_chua_giai: môn không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select b.khoi, count(*)::bigint, count(y.id)::bigint
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    left join %3$I y on y.ma_cau = c.ma_cau and y.xu_ly_at is null
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
    group by b.khoi
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai');
end $$;
grant execute on function public.fn_kho_dem_cau_chua_giai(text) to authenticated;

-- ── Đặt Claude giải (1 câu hay cả lô) — chỉ nhận câu còn chưa giải & chưa có yêu cầu treo; trả số đã đặt ──
create or replace function public.fn_kho_dat_giai(p_mon text, p_ma_cau text[], p_ghi_chu text, p_nguoi uuid)
returns int
language plpgsql as $$
declare t text := public.fn_kho_tbl(p_mon); n int;
begin
  if t is null then raise exception 'fn_kho_dat_giai: môn không hợp lệ %', p_mon; end if;
  execute format($q$
    insert into %2$I (ma_cau, ghi_chu, nguoi_yeu_cau)
    select c.ma_cau, nullif($2, ''), $3
    from %1$I c
    where c.ma_cau = any($1) and c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
      and not exists (select 1 from %2$I y where y.ma_cau = c.ma_cau and y.xu_ly_at is null)
  $q$, t || '_cau_hoi', t || '_cau_hoi_yeu_cau_giai') using p_ma_cau, p_ghi_chu, p_nguoi;
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function public.fn_kho_dat_giai(text, text[], text, uuid) to authenticated;

-- ── Người tự giải xong: đóng dấu nguồn = người (tin), gỡ yêu cầu Claude còn treo (nếu có) ──
-- Gọi SAU khi app đã update loi_giai/anh_dap_an qua PostgREST. Từ chối nếu câu vẫn chưa có gì.
create or replace function public.fn_kho_giai_nguoi_xong(p_mon text, p_ma_cau text)
returns void
language plpgsql as $$
declare t text := public.fn_kho_tbl(p_mon); ok boolean;
begin
  if t is null then raise exception 'fn_kho_giai_nguoi_xong: môn không hợp lệ %', p_mon; end if;
  execute format('select (loi_giai is not null or anh_dap_an is not null) from %I where ma_cau = $1', t || '_cau_hoi')
    into ok using p_ma_cau;
  if ok is distinct from true then raise exception 'Câu % chưa có lời giải/ảnh lời giải — chưa thể đóng.', p_ma_cau; end if;
  execute format('update %I set nguon_giai = ''nguoi'', giai_method = null where ma_cau = $1', t || '_cau_hoi') using p_ma_cau;
  execute format('delete from %I where ma_cau = $1 and xu_ly_at is null', t || '_cau_hoi_yeu_cau_giai') using p_ma_cau;
end $$;
grant execute on function public.fn_kho_giai_nguoi_xong(text, text) to authenticated;

-- ── Cho worker Claude Code (scripts/hangdoi-giai.mjs): yêu cầu đang treo của 1 môn kèm nội dung câu ──
create or replace function public.fn_kho_yeu_cau_giai_cho(p_mon text)
returns table (
  yeu_cau_id uuid, yeu_cau_at timestamptz, ghi_chu text, ma_cau text, dang_chinh text, ten_dang text,
  khoi text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, anh_de text, ma_cum text,
  da_co_loi_giai boolean
)
language plpgsql stable as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if t is null then raise exception 'fn_kho_yeu_cau_giai_cho: môn không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select y.id, y.created_at, y.ghi_chu, c.ma_cau, c.dang_chinh, b.ten_dang, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.ma_cum,
           (c.loi_giai is not null or c.anh_dap_an is not null)
    from %3$I y
    join %1$I c on c.ma_cau = y.ma_cau
    join %2$I b on b.ma_dang = c.dang_chinh
    where y.xu_ly_at is null
    order by y.created_at
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai');
end $$;
grant execute on function public.fn_kho_yeu_cau_giai_cho(text) to authenticated;
