-- 202609041826 — Kho HÌNH vào tab "Chưa có lời giải" + hàng đợi Đặt Claude giải (Thùy 04/09:
-- "T muốn hình cũng ở trong đấy, có toggle bar để filter. Hình khác chỗ mô hình các thứ nhưng cuối
-- cùng vẫn là từng bài một").
--
-- Đơn vị "1 bài" bên Hình có 2 loại (cùng nghĩa "từng bài một", khác bảng):
--   · 'baitoan'  = bài toán gốc (node lưới, hinh_baitoan) — "chưa có lời giải" = KHÔNG có dòng hinh_cach_giai
--                  nào có nội dung (loi_giai/anh_loi_giai). Người/Claude giải = TẠO 1 cách giải (mặc định nếu chưa có).
--   · 'bien_the' = biến thể đổi số/đổi đỉnh (hinh_baitoan_bien_the) — chưa có = loi_giai & anh_loi_giai NULL.
--   (Ý của bài đề thi `hinh_y` KHÔNG đưa vào: ý trống rơi về cách giải của node — §3 "đáp án hai bậc" — nên
--    giải node là lấp luôn; hiện cũng 0 ý trống.)
-- Đề bài để giải = giả thiết mô hình (+ giả thiết phụ/riêng của bài toán) + phát biểu; ảnh = anh_chuan của
-- bài toán, rơi về anh_cau_hinh của mô hình (đơn giản hoá anhCuaBaiToan — không leo cha kế thừa ở SQL).
-- Khối = hinh_mo_hinh.khoi (biến thể KHÔNG có cột khối riêng — schema thật 04/09, schema.md mục này bị
-- dính cột bảng khác khi đọc bằng sed, đã đối chiếu information_schema).
-- MẤT GÌ (Luật xoá): không — thêm 2 bảng + function; sửa fn_kho_dem_cau_chua_giai để gộp thêm Hình.

create table if not exists hinh_baitoan_yeu_cau_giai (
  id uuid primary key default gen_random_uuid(),
  baitoan_id uuid not null references hinh_baitoan(id) on delete cascade,
  ghi_chu text,
  nguoi_yeu_cau uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz
);
create unique index if not exists hinh_baitoan_yeu_cau_giai_cho_uniq on hinh_baitoan_yeu_cau_giai (baitoan_id) where xu_ly_at is null;
alter table hinh_baitoan_yeu_cau_giai enable row level security;
drop policy if exists hinh_baitoan_yeu_cau_giai_member_all on hinh_baitoan_yeu_cau_giai;
create policy hinh_baitoan_yeu_cau_giai_member_all on hinh_baitoan_yeu_cau_giai
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hinh_baitoan_yeu_cau_giai to authenticated;

create table if not exists hinh_bien_the_yeu_cau_giai (
  id uuid primary key default gen_random_uuid(),
  bien_the_id uuid not null references hinh_baitoan_bien_the(id) on delete cascade,
  ghi_chu text,
  nguoi_yeu_cau uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz
);
create unique index if not exists hinh_bien_the_yeu_cau_giai_cho_uniq on hinh_bien_the_yeu_cau_giai (bien_the_id) where xu_ly_at is null;
alter table hinh_bien_the_yeu_cau_giai enable row level security;
drop policy if exists hinh_bien_the_yeu_cau_giai_member_all on hinh_bien_the_yeu_cau_giai;
create policy hinh_bien_the_yeu_cau_giai_member_all on hinh_bien_the_yeu_cau_giai
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hinh_bien_the_yeu_cau_giai to authenticated;

-- ── View nội bộ: mọi "bài" Hình chưa có lời giải, shape chung cho cả 2 loại ──
create or replace view public.v_hinh_chua_giai as
  select 'baitoan'::text as loai, b.id, b.ma, m.khoi, m.ma as mo_hinh_ma, m.ten as mo_hinh_ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) as gia_thiet,
         b.phat_bieu as de_bai, coalesce(b.anh_chuan, m.anh_cau_hinh) as anh, null::text as kieu, b.created_at,
         y.id as yeu_cau_id, y.created_at as yeu_cau_at, y.ghi_chu as yeu_cau_ghi_chu
  from hinh_baitoan b
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join hinh_baitoan_yeu_cau_giai y on y.baitoan_id = b.id and y.xu_ly_at is null
  where not exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null))
  union all
  select 'bien_the', v.id, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
         v.de_bai, coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), v.kieu, v.created_at,
         y.id, y.created_at, y.ghi_chu
  from hinh_baitoan_bien_the v
  join hinh_baitoan b on b.id = v.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join hinh_bien_the_yeu_cau_giai y on y.bien_the_id = v.id and y.xu_ly_at is null
  where v.loi_giai is null and v.anh_loi_giai is null;
grant select on public.v_hinh_chua_giai to authenticated;

create or replace function public.fn_hinh_cau_chua_giai(p_khoi text, p_limit int default 500)
returns setof public.v_hinh_chua_giai
language sql stable as $$
  select * from public.v_hinh_chua_giai where khoi = p_khoi order by mo_hinh_ma, loai, ma limit p_limit
$$;
grant execute on function public.fn_hinh_cau_chua_giai(text, int) to authenticated;

-- ── Đếm chung: p_mon NULL = gộp Đại/KHTN/HGT + Hình; 'hinh' = chỉ Hình; còn lại như cũ ──
drop function if exists public.fn_kho_dem_cau_chua_giai(text);
create or replace function public.fn_kho_dem_cau_chua_giai(p_mon text default null)
returns table (khoi text, so_cau bigint, so_cho_giai bigint)
language plpgsql stable as $$
declare m text; t text; sql text := '';
begin
  if p_mon is not null and p_mon <> 'hinh' and public.fn_kho_tbl(p_mon) is null then
    raise exception 'fn_kho_dem_cau_chua_giai: môn không hợp lệ %', p_mon;
  end if;
  foreach m in array (case when p_mon is null then array['toan','khtn','hgt','hinh'] else array[p_mon] end) loop
    if m = 'hinh' then
      sql := sql || case when sql = '' then '' else ' union all ' end ||
        ' select h.khoi, 1::bigint as so_cau, (h.yeu_cau_id is not null)::int::bigint as so_cho_giai from public.v_hinh_chua_giai h ';
      continue;
    end if;
    t := public.fn_kho_tbl(m);
    sql := sql || case when sql = '' then '' else ' union all ' end || format($q$
      select b.khoi, 1::bigint as so_cau, (y.id is not null)::int::bigint as so_cho_giai
      from %1$I c
      join %2$I b on b.ma_dang = c.dang_chinh
      left join %3$I y on y.ma_cau = c.ma_cau and y.xu_ly_at is null
      where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
    $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai');
  end loop;
  return query execute 'select u.khoi, sum(u.so_cau)::bigint, sum(u.so_cho_giai)::bigint from (' || sql || ') u group by u.khoi';
end $$;
grant execute on function public.fn_kho_dem_cau_chua_giai(text) to authenticated;

-- ── Đặt Claude giải (1 hay cả lô) — chỉ nhận bài còn chưa giải & chưa có yêu cầu treo ──
create or replace function public.fn_hinh_dat_giai(p_loai text, p_ids uuid[], p_ghi_chu text, p_nguoi uuid)
returns int
language plpgsql as $$
declare n int;
begin
  if p_loai = 'baitoan' then
    insert into hinh_baitoan_yeu_cau_giai (baitoan_id, ghi_chu, nguoi_yeu_cau)
    select h.id, nullif(p_ghi_chu, ''), p_nguoi from public.v_hinh_chua_giai h
    where h.loai = 'baitoan' and h.id = any(p_ids) and h.yeu_cau_id is null;
  elsif p_loai = 'bien_the' then
    insert into hinh_bien_the_yeu_cau_giai (bien_the_id, ghi_chu, nguoi_yeu_cau)
    select h.id, nullif(p_ghi_chu, ''), p_nguoi from public.v_hinh_chua_giai h
    where h.loai = 'bien_the' and h.id = any(p_ids) and h.yeu_cau_id is null;
  else
    raise exception 'fn_hinh_dat_giai: loai không hợp lệ %', p_loai;
  end if;
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function public.fn_hinh_dat_giai(text, uuid[], text, uuid) to authenticated;

-- ── Người tự giải: ghi lời giải + đóng dấu nguồn = người + gỡ yêu cầu treo, 1 transaction ──
--   baitoan  → TẠO hinh_cach_giai (la_mac_dinh = true nếu bài toán chưa có cách nào; dang_id null — taxonomy điền sau).
--   bien_the → UPDATE loi_giai/anh_loi_giai.
create or replace function public.fn_hinh_luu_loi_giai_nguoi(p_loai text, p_id uuid, p_loi_giai text, p_anh text)
returns void
language plpgsql as $$
begin
  if nullif(p_loi_giai, '') is null and nullif(p_anh, '') is null then
    raise exception 'Cần lời giải text hoặc ảnh lời giải.';
  end if;
  if p_loai = 'baitoan' then
    if not exists (select 1 from hinh_baitoan where id = p_id) then raise exception 'Không thấy bài toán %', p_id; end if;
    insert into hinh_cach_giai (baitoan_id, dang_id, loi_giai, anh_loi_giai, la_mac_dinh, thu_tu, nguon_giai, giai_method, da_duyet)
    values (p_id, null, nullif(p_loi_giai, ''), nullif(p_anh, ''),
            not exists (select 1 from hinh_cach_giai where baitoan_id = p_id),
            coalesce((select max(thu_tu) + 1 from hinh_cach_giai where baitoan_id = p_id), 0),
            'nguoi', null, false);
    update hinh_baitoan set updated_at = now() where id = p_id; -- đổi nội dung con → bump cha (CLAUDE.md §2)
    delete from hinh_baitoan_yeu_cau_giai where baitoan_id = p_id and xu_ly_at is null;
  elsif p_loai = 'bien_the' then
    update hinh_baitoan_bien_the
      set loi_giai = nullif(p_loi_giai, ''), anh_loi_giai = nullif(p_anh, ''), nguon_giai = 'nguoi', giai_method = null, updated_at = now()
      where id = p_id;
    if not found then raise exception 'Không thấy biến thể %', p_id; end if;
    delete from hinh_bien_the_yeu_cau_giai where bien_the_id = p_id and xu_ly_at is null;
  else
    raise exception 'fn_hinh_luu_loi_giai_nguoi: loai không hợp lệ %', p_loai;
  end if;
end $$;
grant execute on function public.fn_hinh_luu_loi_giai_nguoi(text, uuid, text, text) to authenticated;

-- ── Cho worker (scripts/hangdoi-giai.mjs): yêu cầu Hình đang treo + đề + cách giải mặc định của node
--    (biến thể: mẫu tham khảo = cách giải node gốc; bài toán gốc: cách giải của node CHA kế thừa nếu có) ──
create or replace function public.fn_hinh_yeu_cau_giai_cho()
returns table (
  yeu_cau_id uuid, yeu_cau_at timestamptz, ghi_chu text, loai text, id uuid, ma text, khoi text,
  mo_hinh_ma text, mo_hinh_ten text, gia_thiet text, de_bai text, anh text, kieu text,
  da_co_loi_giai boolean, mau_loi_giai text, mau_anh text
)
language sql stable as $$
  select y.id, y.created_at, y.ghi_chu, 'baitoan', b.id, b.ma, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng), b.phat_bieu,
         coalesce(b.anh_chuan, m.anh_cau_hinh), null::text,
         exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null)),
         null::text, null::text
  from hinh_baitoan_yeu_cau_giai y
  join hinh_baitoan b on b.id = y.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  where y.xu_ly_at is null
  union all
  select y.id, y.created_at, y.ghi_chu, 'bien_the', v.id, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng), v.de_bai,
         coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), v.kieu,
         (v.loi_giai is not null or v.anh_loi_giai is not null),
         cg.loi_giai, cg.anh_loi_giai
  from hinh_bien_the_yeu_cau_giai y
  join hinh_baitoan_bien_the v on v.id = y.bien_the_id
  join hinh_baitoan b on b.id = v.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join lateral (
    select loi_giai, anh_loi_giai from hinh_cach_giai c where c.baitoan_id = b.id and (c.loi_giai is not null or c.anh_loi_giai is not null)
    order by la_mac_dinh desc, thu_tu limit 1
  ) cg on true
  where y.xu_ly_at is null
  order by 2
$$;
grant execute on function public.fn_hinh_yeu_cau_giai_cho() to authenticated;
