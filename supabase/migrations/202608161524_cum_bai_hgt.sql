-- ============================================================================
-- 202608161524 — CỤM BÀI + TIỀN ĐỀ cho nhánh HÌNH GIẢI TÍCH (hgt_*)
-- Spec: spec-cum-bai.md (bản 202608131918 làm Đại + KHTN, để hgt lại sau)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 16/08): "Cần cụm bài. Logic phải giống nhau." Để hgt thiếu cụm là vi phạm
--   symmetry test của CLAUDE.md §1.6 — thao tác trên nhánh này phải chạy Y HỆT nhánh khác.
--   Đã cắn thật: 3 chỗ insert của luồng clone ghi `ma_cum` vô điều kiện ⇒ PostgREST trả
--   "Could not find the 'ma_cum' column of 'hgt_cau_hoi' in the schema cache" và chết cả lượt lưu
--   (chết CẢ luồng "Clone biến thể" cũ, không riêng nút clone-từ-kho mới). Đã vá bằng cờ
--   `coCumBai()`; migration này gỡ luôn gốc của ngoại lệ.
--
-- MIRROR NGUYÊN VĂN bản Đại/KHTN, chỉ đổi tiền tố: mã cụm `GCUM` (hgt dùng GT/GC).
-- ⭐ KHÔNG BACKFILL — cụm là THỦ CÔNG 100% (Thùy 14/08). Xem spec-cum-bai.md §3: hệ không tự
--   sinh cụm nào, kể cả từ chuỗi gốc-clone. hgt có 101 câu, 95 clone, 0 câu lẻ ⇒ mọi câu vào
--   thẳng tab "Chưa phân cụm", mã đề/tài liệu chạy y như cũ nhờ tầng `parent_ma_cau` của
--   khoá `ma_cum ?? parent_ma_cau ?? ma_cau`.
--
-- MẤT GÌ: không. Chỉ THÊM 3 bảng + 1 cột + 4 hàm. Không xoá/sửa cột nào đang có.
-- ============================================================================

create sequence if not exists hgt_cum_seq;

create table if not exists hgt_cum_bai (
  ma_cum      text primary key default 'GCUM' || lpad(nextval('hgt_cum_seq')::text, 5, '0'),
  ma_dang     text not null references hgt_ban_do(ma_dang) on update cascade on delete cascade,
  ten         text,                                  -- NULL = chưa đặt tên → UI hiện "Cụm {thu_tu}"
  thu_tu      smallint not null default 1,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
create index if not exists hgt_cum_bai_dang_idx on hgt_cum_bai (ma_dang);

-- on delete set null: xoá cụm ⇒ câu VỀ RỔ "chưa phân cụm", không mất câu.
alter table hgt_cau_hoi add column if not exists ma_cum text references hgt_cum_bai(ma_cum) on delete set null;
create index if not exists hgt_cau_hoi_cum_idx on hgt_cau_hoi (ma_cum);

-- ⚠ on update cascade ở FK trỏ ma_dang: mã dạng ĐÃ TỪNG bị đổi hàng loạt (đổi tiền tố theo môn,
--   202608141259). Thiếu cascade là lần đổi mã sau sẽ bị FK chặn — bản Đại/KHTN phải vá sau, ở đây
--   đặt đúng ngay từ đầu.
create table if not exists hgt_dang_tien_de (
  ma_dang         text not null references hgt_ban_do(ma_dang) on update cascade on delete cascade,
  tien_de_ma_dang text not null references hgt_ban_do(ma_dang) on update cascade on delete cascade,
  primary key (ma_dang, tien_de_ma_dang),
  check (ma_dang <> tien_de_ma_dang)
);
create index if not exists hgt_dang_tien_de_td_idx on hgt_dang_tien_de (tien_de_ma_dang);

create table if not exists hgt_cum_tien_de (
  ma_cum         text not null references hgt_cum_bai(ma_cum) on delete cascade,
  tien_de_ma_cum text not null references hgt_cum_bai(ma_cum) on delete cascade,
  primary key (ma_cum, tien_de_ma_cum),
  check (ma_cum <> tien_de_ma_cum)
);
create index if not exists hgt_cum_tien_de_td_idx on hgt_cum_tien_de (tien_de_ma_cum);

-- RLS — copy nguyên mẫu đang chạy ở các bảng kho khác.
do $$
declare t text;
begin
  foreach t in array array['hgt_cum_bai','hgt_dang_tien_de','hgt_cum_tien_de']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_all', t);
    execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())',
                   t || '_member_all', t);
  end loop;
end $$;

-- Hàm bao đóng — mirror bản Đại/KHTN. `duong` = đường đã đi, chống lặp vô hạn nếu dữ liệu lỡ có vòng.
create or replace function hgt_dang_tien_de_bao_dong(goc text)
returns table (ma_dang text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.tien_de_ma_dang as id, 1 as do_sau, array[goc, t.tien_de_ma_dang] as duong
      from hgt_dang_tien_de t where t.ma_dang = goc
    union all
    select t.tien_de_ma_dang, d.do_sau + 1, d.duong || t.tien_de_ma_dang
      from hgt_dang_tien_de t join di d on t.ma_dang = d.id
     where not t.tien_de_ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function hgt_dang_hau_due(goc text)
returns table (ma_dang text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from hgt_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from hgt_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function hgt_cum_tien_de_bao_dong(goc text)
returns table (ma_cum text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.tien_de_ma_cum as id, 1 as do_sau, array[goc, t.tien_de_ma_cum] as duong
      from hgt_cum_tien_de t where t.ma_cum = goc
    union all
    select t.tien_de_ma_cum, d.do_sau + 1, d.duong || t.tien_de_ma_cum
      from hgt_cum_tien_de t join di d on t.ma_cum = d.id
     where not t.tien_de_ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function hgt_cum_hau_due(goc text)
returns table (ma_cum text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from hgt_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from hgt_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

grant execute on function hgt_dang_tien_de_bao_dong(text), hgt_dang_hau_due(text),
  hgt_cum_tien_de_bao_dong(text), hgt_cum_hau_due(text) to authenticated;

-- KIỂM: cột có thật + chưa cụm nào được sinh (cụm là thủ công).
do $$
declare n_cot int; n_cum int;
begin
  select count(*) into n_cot from information_schema.columns
   where table_name = 'hgt_cau_hoi' and column_name = 'ma_cum';
  if n_cot <> 1 then raise exception 'hgt_cau_hoi.ma_cum chưa được tạo. Rollback.'; end if;
  select count(*) into n_cum from hgt_cum_bai;
  if n_cum <> 0 then raise exception 'hgt_cum_bai phải RỖNG (cụm là thủ công) nhưng đang có % dòng.', n_cum; end if;
  raise notice 'hgt: có cột ma_cum ✓ · 0 cụm (đúng — người tự tạo) ✓';
end $$;
