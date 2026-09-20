-- ============================================================================
-- 202609201730 — ca_test_huy_khoi_phuc
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 20/09 "cần phải sửa / xoá được ở chỗ điểm danh test"): thẻ ca chỉ có upload bài · in đề · hoàn tất —
--   tạo nhầm ca (sai HS, HS không đến, tạo trùng) thì không có đường gỡ; 2 ca K6 treo "quá hạn 14 ngày" ở màn Điểm danh.
-- CÁCH (CLAUDE.md §4 — dữ liệu quan trọng KHÔNG xoá cứng, state-log bất biến): "xoá" = HUỶ CA.
--   • `ca_test.trang_thai` thêm giá trị `huy`; `huy_ly_do` (bắt buộc khi huỷ) + `trang_thai_truoc_huy` (để khôi phục
--     đúng về dang_test / hoan_thanh). 2 cột này NULL = "không áp dụng" (ca chưa từng huỷ) — đúng §1.5.
--   • Mọi hàng đợi hiện lọc `trang_thai = 'dang_test' | 'hoan_thanh'` ⇒ ca huỷ tự rụng khỏi Điểm danh / Chấm / Trả bài /
--     Việc của tôi. Thống kê `fn_test_dau_vao_thong_ke` loại ca huỷ.
--   • Log: `log_ca_test` nhận diện `huy` / `khoi_phuc` (trước đây mọi update khác đều là `sua`).
--   • RPC `fn_ca_test_huy(id, ly_do)` — chặn khi ca ĐÃ TRẢ BÀI (mở lại trả bài trước) · `fn_ca_test_khoi_phuc(id)`.
--   Câu + kết quả chấm của ca huỷ GIỮ NGUYÊN (khôi phục là về đúng như cũ).
-- MẤT GÌ (Luật xoá): không. Chỉ NỚI CHECK (thêm 1 giá trị hợp lệ), thêm 2 cột, create or replace function.
-- ============================================================================
alter table public.ca_test add column if not exists huy_ly_do text;
alter table public.ca_test add column if not exists trang_thai_truoc_huy text;

-- Nới CHECK trang_thai (tên constraint tự sinh ⇒ tìm theo định nghĩa).
do $$
declare c record;
begin
  for c in select conname from pg_constraint
            where conrelid = 'public.ca_test'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%trang_thai%'
              and pg_get_constraintdef(oid) not ilike '%truoc_huy%'
  loop execute format('alter table public.ca_test drop constraint %I', c.conname); end loop;
end $$;
alter table public.ca_test add constraint ca_test_trang_thai_check check (trang_thai in ('dang_test', 'hoan_thanh', 'huy'));
alter table public.ca_test add constraint ca_test_truoc_huy_check check (trang_thai_truoc_huy is null or trang_thai_truoc_huy in ('dang_test', 'hoan_thanh'));
-- Ca huỷ phải có lý do + trạng thái trước; ca không huỷ thì 2 cột này trống.
alter table public.ca_test add constraint ca_test_huy_day_du_check check (
  (trang_thai = 'huy' and huy_ly_do is not null and btrim(huy_ly_do) <> '' and trang_thai_truoc_huy is not null)
  or (trang_thai <> 'huy' and huy_ly_do is null and trang_thai_truoc_huy is null));

create or replace function public.log_ca_test() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai = 'huy' and old.trang_thai <> 'huy' then hd := 'huy';
  elsif old.trang_thai = 'huy' and new.trang_thai <> 'huy' then hd := 'khoi_phuc';
  elsif new.trang_thai = 'hoan_thanh' and old.trang_thai <> 'hoan_thanh' then hd := 'hoan_thanh';
  else hd := 'sua';
  end if;
  insert into ca_test_log (ca_test_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;

create or replace function public.fn_ca_test_huy(p_ca_test_id uuid, p_ly_do text) returns void
language plpgsql as $$
declare r public.ca_test%rowtype;
begin
  if p_ly_do is null or btrim(p_ly_do) = '' then raise exception 'Cần ghi lý do huỷ ca.'; end if;
  select * into r from public.ca_test where id = p_ca_test_id for update;
  if not found then raise exception 'Không tìm thấy ca test (hoặc không có quyền).'; end if;
  if r.trang_thai = 'huy' then raise exception 'Ca này đã huỷ rồi.'; end if;
  if r.tra_bai_xong_at is not null then raise exception 'Ca đã trả bài cho phụ huynh — mở lại trả bài trước khi huỷ.'; end if;
  update public.ca_test set trang_thai = 'huy', huy_ly_do = btrim(p_ly_do), trang_thai_truoc_huy = r.trang_thai where id = p_ca_test_id;
end $$;

create or replace function public.fn_ca_test_khoi_phuc(p_ca_test_id uuid) returns text
language plpgsql as $$
declare r public.ca_test%rowtype;
begin
  select * into r from public.ca_test where id = p_ca_test_id for update;
  if not found then raise exception 'Không tìm thấy ca test (hoặc không có quyền).'; end if;
  if r.trang_thai <> 'huy' then raise exception 'Ca này không ở trạng thái huỷ.'; end if;
  update public.ca_test set trang_thai = r.trang_thai_truoc_huy, huy_ly_do = null, trang_thai_truoc_huy = null where id = p_ca_test_id;
  return r.trang_thai_truoc_huy;
end $$;
grant execute on function public.fn_ca_test_huy(uuid, text) to authenticated;
grant execute on function public.fn_ca_test_khoi_phuc(uuid) to authenticated;

-- Thống kê: loại ca huỷ (giữ nguyên chữ ký hàm — chỉ thêm 1 điều kiện WHERE).
create or replace function public.fn_test_dau_vao_thong_ke(p_mon text, p_thang text default null, p_khoi text default null)
returns table (nhom text, tong integer, dang_test integer, hoan_thanh integer, cho_cham integer, da_cham integer,
               cho_tra integer, da_tra integer, da_vao_lop integer)
language sql stable as $$
  with ca as (
    select ct.id, ct.trang_thai, ct.cham_xong_at, ct.tra_bai_xong_at, uv.khoi, uv.trang_thai as uv_tt,
           to_char(ct.ngay, 'YYYY-MM') as thang
    from public.ca_test ct join public.ung_vien uv on uv.id = ct.ung_vien_id
    where ct.mon = p_mon and ct.trang_thai <> 'huy'
      and (p_thang is null or to_char(ct.ngay, 'YYYY-MM') = p_thang)
      and (p_khoi is null or uv.khoi = p_khoi)
  ),
  g as (
    select case when p_khoi is null then coalesce(khoi, '?') else thang end as nhom,
           count(*)::int as tong,
           (count(*) filter (where trang_thai = 'dang_test'))::int as dang_test,
           (count(*) filter (where trang_thai = 'hoan_thanh'))::int as hoan_thanh,
           (count(*) filter (where trang_thai = 'hoan_thanh' and cham_xong_at is null))::int as cho_cham,
           (count(*) filter (where cham_xong_at is not null))::int as da_cham,
           (count(*) filter (where cham_xong_at is not null and tra_bai_xong_at is null))::int as cho_tra,
           (count(*) filter (where tra_bai_xong_at is not null))::int as da_tra,
           (count(*) filter (where uv_tt = 'da_convert'))::int as da_vao_lop
    from ca group by 1
  ),
  all_rows as (
    select * from g
    union all
    select 'Tổng', coalesce(sum(tong), 0)::int, coalesce(sum(dang_test), 0)::int, coalesce(sum(hoan_thanh), 0)::int,
           coalesce(sum(cho_cham), 0)::int, coalesce(sum(da_cham), 0)::int, coalesce(sum(cho_tra), 0)::int,
           coalesce(sum(da_tra), 0)::int, coalesce(sum(da_vao_lop), 0)::int
    from g
  )
  select * from all_rows
  order by (nhom = 'Tổng'), nullif(regexp_replace(nhom, '\D', '', 'g'), '')::bigint nulls last, nhom;
$$;
