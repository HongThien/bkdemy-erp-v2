-- ============================================================================
-- 202608131918 — CỤM BÀI + TIỀN ĐỀ (Đại + KHTN).  Spec: spec-cum-bai.md
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 13/08): kho có 2 luồng vào — clone từ bài gốc, và nhập tài liệu ngoài. Khái niệm "họ"
--   hôm nay KHÔNG có object riêng, chỉ suy từ `parent_ma_cau ?? ma_cau` ⇒ (a) bài nhập lẻ không có chỗ
--   nào để khai "tao tương đương bài kia", (b) 2 CÂU GỐC tương đương vẫn bị coi là 2 họ khác nhau nên
--   mã đề không dám hoán đổi, tài liệu thì lấy cả hai vào một đề mà không thấy đó là lặp.
--   → Đẻ object thật: CỤM BÀI = lớp tương đương trong 1 dạng, CHỨA ĐƯỢC NHIỀU CÂU GỐC.
--   Kèm TIỀN ĐỀ (thứ tự học) ở 2 tầng: dạng↔dạng và cụm↔cụm.
--
-- TÊN "CỤM" (không phải "họ"): nhánh Hình đã dùng "họ mô hình" với nghĩa NGƯỢC (cụm nối nhau bằng chính
--   quan hệ tiền đề — `hinh_mo_hinh.la_goc_ho`). Trùng chữ ngược nghĩa ⇒ Đại/KHTN dùng "Cụm bài",
--   nhánh Hình GIỮ NGUYÊN, migration này không đụng một dòng nào bên đó.
--
-- ⭐ `ma_cum` NULLABLE CÓ CHỦ Ý — NULL = "chưa ai phân cụm", KHÔNG phải "cụm rỗng".
--   1.587 câu lẻ của Đại (+224 của KHTN) KHÔNG phải 1.587 cụm, chúng là VIỆC TỒN ĐỌNG. Backfill đẻ cụm
--   giả cho chúng = ghi 1.587 lời khẳng định bịa vào DB và mất luôn cách phân biệt "cụm thật 1 bài" với
--   "chưa gom". Đúng tiền lệ `ma_loi` (CLAUDE.md §1.5): nhãn phân loại chưa chắc thì để trống.
--   `ten` cũng để NULL — tên cụm là NGƯỜI đặt, hệ không bịa; UI suy "Cụm {thu_tu}".
--
-- ⭐ KHÔNG đụng `nguon` / `parent_ma_cau` / `nguon_giai` — đó là trục NGUỒN GỐC (ai đẻ ra, lời giải AI hay
--   người, đã duyệt chưa). `ma_cum` là trục TƯƠNG ĐƯƠNG. Hai trục sống song song, không cái nào thay cái nào.
--
-- ⭐ NGÀY 0 HÀNH VI KHÔNG ĐỔI: khoá cụm mà code dùng = `ma_cum ?? parent_ma_cau ?? ma_cau` — sau backfill
--   nó phân hoạch câu BẰNG ĐÚNG khoá cũ `parent_ma_cau ?? ma_cau` ⇒ made.ts/tailieu.ts chạy y hệt (§7
--   kiểm và rollback nếu lệch). Tầng `parent_ma_cau` ở giữa là lưới an toàn cho clone sinh ra trong lúc
--   code chưa deploy kịp gán `ma_cum`. Chỉ khi người GỘP CỤM thì hành vi mới đổi (có chủ ý).
--
-- MẤT GÌ: không. Chỉ THÊM 6 bảng + 2 cột + 8 hàm. Không xoá/sửa cột nào đang có. Backfill chỉ ghi vào
--   cột `ma_cum` vừa tạo (trước đó không tồn tại) ⇒ không đè dữ liệu cũ.
-- ============================================================================

-- ── 1. BẢNG CỤM ──────────────────────────────────────────────────────────────
create sequence if not exists dai_cum_seq;
create sequence if not exists khtn_cum_seq;

create table if not exists dai_cum_bai (
  ma_cum      text primary key default 'DCUM' || lpad(nextval('dai_cum_seq')::text, 5, '0'),
  ma_dang     text not null references dai_ban_do(ma_dang) on delete cascade,
  ten         text,                                  -- NULL = chưa đặt tên → UI hiện "Cụm {thu_tu}"
  thu_tu      smallint not null default 1,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
create index if not exists dai_cum_bai_dang_idx on dai_cum_bai (ma_dang);

create table if not exists khtn_cum_bai (
  ma_cum      text primary key default 'KCUM' || lpad(nextval('khtn_cum_seq')::text, 5, '0'),
  ma_dang     text not null references khtn_ban_do(ma_dang) on delete cascade,
  ten         text,
  thu_tu      smallint not null default 1,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
create index if not exists khtn_cum_bai_dang_idx on khtn_cum_bai (ma_dang);

-- ── 2. CỘT ma_cum TRÊN CÂU ───────────────────────────────────────────────────
-- on delete set null: xoá cụm ⇒ câu VỀ RỔ "chưa phân cụm", không mất câu.
alter table dai_cau_hoi  add column if not exists ma_cum text references dai_cum_bai(ma_cum)  on delete set null;
alter table khtn_cau_hoi add column if not exists ma_cum text references khtn_cum_bai(ma_cum) on delete set null;
create index if not exists dai_cau_hoi_cum_idx  on dai_cau_hoi  (ma_cum);
create index if not exists khtn_cau_hoi_cum_idx on khtn_cau_hoi (ma_cum);

-- ── 3. TIỀN ĐỀ — 2 tầng × 2 nhánh ────────────────────────────────────────────
-- check(a<>b) chỉ chặn tự-trỏ. Vòng dài hơn (A→B→C→A) chặn ở app bằng hàm *_hau_due (§4 spec);
-- hàm recursive có mảng `duong` nên kể cả lỡ có vòng trong DB thì query vẫn KHÔNG treo.
create table if not exists dai_dang_tien_de (
  ma_dang         text not null references dai_ban_do(ma_dang) on delete cascade,
  tien_de_ma_dang text not null references dai_ban_do(ma_dang) on delete cascade,
  primary key (ma_dang, tien_de_ma_dang),
  check (ma_dang <> tien_de_ma_dang)
);
create index if not exists dai_dang_tien_de_td_idx on dai_dang_tien_de (tien_de_ma_dang);

create table if not exists dai_cum_tien_de (
  ma_cum         text not null references dai_cum_bai(ma_cum) on delete cascade,
  tien_de_ma_cum text not null references dai_cum_bai(ma_cum) on delete cascade,
  primary key (ma_cum, tien_de_ma_cum),
  check (ma_cum <> tien_de_ma_cum)
);
create index if not exists dai_cum_tien_de_td_idx on dai_cum_tien_de (tien_de_ma_cum);

create table if not exists khtn_dang_tien_de (
  ma_dang         text not null references khtn_ban_do(ma_dang) on delete cascade,
  tien_de_ma_dang text not null references khtn_ban_do(ma_dang) on delete cascade,
  primary key (ma_dang, tien_de_ma_dang),
  check (ma_dang <> tien_de_ma_dang)
);
create index if not exists khtn_dang_tien_de_td_idx on khtn_dang_tien_de (tien_de_ma_dang);

create table if not exists khtn_cum_tien_de (
  ma_cum         text not null references khtn_cum_bai(ma_cum) on delete cascade,
  tien_de_ma_cum text not null references khtn_cum_bai(ma_cum) on delete cascade,
  primary key (ma_cum, tien_de_ma_cum),
  check (ma_cum <> tien_de_ma_cum)
);
create index if not exists khtn_cum_tien_de_td_idx on khtn_cum_tien_de (tien_de_ma_cum);

-- ── 4. RLS — copy nguyên mẫu `dai_cau_hoi_member_all` đang chạy ──────────────
do $$
declare t text;
begin
  foreach t in array array['dai_cum_bai','khtn_cum_bai','dai_dang_tien_de','dai_cum_tien_de',
                           'khtn_dang_tien_de','khtn_cum_tien_de']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_all', t);
    execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())',
                   t || '_member_all', t);
  end loop;
end $$;

-- ── 5. HÀM BAO ĐÓNG — soi gương 202607241923_kho_hinh_v3_derive.sql ─────────
-- `duong` = đường đã đi, chống lặp vô hạn khi dữ liệu lỡ có vòng.
-- *_bao_dong  = TỔ TIÊN (mọi node phải học TRƯỚC nó); do_sau = số bước lùi tối thiểu ⇒ sắp topo.
-- *_hau_due   = HẬU DUỆ (mọi node phụ thuộc vào nó); dùng CHẶN CHU TRÌNH lúc nối + "học xong mở khoá gì".
create or replace function dai_dang_tien_de_bao_dong(goc text)
returns table (ma_dang text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.tien_de_ma_dang as id, 1 as do_sau, array[goc, t.tien_de_ma_dang] as duong
      from dai_dang_tien_de t where t.ma_dang = goc
    union all
    select t.tien_de_ma_dang, d.do_sau + 1, d.duong || t.tien_de_ma_dang
      from dai_dang_tien_de t join di d on t.ma_dang = d.id
     where not t.tien_de_ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function dai_dang_hau_due(goc text)
returns table (ma_dang text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from dai_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from dai_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function dai_cum_tien_de_bao_dong(goc text)
returns table (ma_cum text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.tien_de_ma_cum as id, 1 as do_sau, array[goc, t.tien_de_ma_cum] as duong
      from dai_cum_tien_de t where t.ma_cum = goc
    union all
    select t.tien_de_ma_cum, d.do_sau + 1, d.duong || t.tien_de_ma_cum
      from dai_cum_tien_de t join di d on t.ma_cum = d.id
     where not t.tien_de_ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function dai_cum_hau_due(goc text)
returns table (ma_cum text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from dai_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from dai_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function khtn_dang_tien_de_bao_dong(goc text)
returns table (ma_dang text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.tien_de_ma_dang as id, 1 as do_sau, array[goc, t.tien_de_ma_dang] as duong
      from khtn_dang_tien_de t where t.ma_dang = goc
    union all
    select t.tien_de_ma_dang, d.do_sau + 1, d.duong || t.tien_de_ma_dang
      from khtn_dang_tien_de t join di d on t.ma_dang = d.id
     where not t.tien_de_ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function khtn_dang_hau_due(goc text)
returns table (ma_dang text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from khtn_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from khtn_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function khtn_cum_tien_de_bao_dong(goc text)
returns table (ma_cum text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.tien_de_ma_cum as id, 1 as do_sau, array[goc, t.tien_de_ma_cum] as duong
      from khtn_cum_tien_de t where t.ma_cum = goc
    union all
    select t.tien_de_ma_cum, d.do_sau + 1, d.duong || t.tien_de_ma_cum
      from khtn_cum_tien_de t join di d on t.ma_cum = d.id
     where not t.tien_de_ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

create or replace function khtn_cum_hau_due(goc text)
returns table (ma_cum text, do_sau int) language sql stable security invoker as $$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from khtn_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from khtn_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$$;

grant execute on function dai_dang_tien_de_bao_dong(text), dai_dang_hau_due(text),
  dai_cum_tien_de_bao_dong(text), dai_cum_hau_due(text),
  khtn_dang_tien_de_bao_dong(text), khtn_dang_hau_due(text),
  khtn_cum_tien_de_bao_dong(text), khtn_cum_hau_due(text) to authenticated;

-- ── 6. BACKFILL ──────────────────────────────────────────────────────────────
-- Gom theo NHÓM khoá cũ `coalesce(parent_ma_cau, ma_cau)` có ≥2 câu còn sống → 1 cụm.
-- Nhóm 1 câu → ma_cum để NULL (rổ "chưa phân cụm"). Câu trong kho rác (xoa_at) → bỏ qua.
--
-- ⚠ VÌ SAO GOM THEO NHÓM chứ không phải "duyệt câu gốc rồi kéo clone theo": bản đầu tao lọc
--   `goc.xoa_at is null` nên bỏ sót **17 nhóm MỒ CÔI** ở Đại (câu gốc đã vào kho rác nhưng 78 clone
--   của nó vẫn còn sống). 78 câu đó tụt về "chưa phân cụm" ⇒ vỡ 17 khối thành 78 khối lẻ ⇒ mã đề mất
--   quyền hoán đổi giữa chúng. Guard §7 bắt được và rollback (2954 khối mới vs 2893 khối cũ).
--   Gốc chết KHÔNG làm các clone hết tương đương với nhau — chúng vẫn là một cụm.
--
-- `ten` để NULL: tên là người đặt. `thu_tu` đánh số trong từng dạng để UI hiện "Cụm 1, Cụm 2…".
-- `min(dang_chinh)`: đã kiểm 0 nhóm nào trải trên >1 dạng ở cả 2 nhánh (13/08).
do $$
declare r record; v_ma text;
begin
  for r in
    with nhom as (
      select coalesce(parent_ma_cau, ma_cau) k, min(dang_chinh) ma_dang
        from dai_cau_hoi where xoa_at is null
       group by 1 having count(*) > 1
    )
    select k, ma_dang, row_number() over (partition by ma_dang order by k) as stt from nhom
  loop
    insert into dai_cum_bai (ma_dang, thu_tu) values (r.ma_dang, r.stt) returning ma_cum into v_ma;
    update dai_cau_hoi set ma_cum = v_ma
     where xoa_at is null and coalesce(parent_ma_cau, ma_cau) = r.k;
  end loop;

  for r in
    with nhom as (
      select coalesce(parent_ma_cau, ma_cau) k, min(dang_chinh) ma_dang
        from khtn_cau_hoi where xoa_at is null
       group by 1 having count(*) > 1
    )
    select k, ma_dang, row_number() over (partition by ma_dang order by k) as stt from nhom
  loop
    insert into khtn_cum_bai (ma_dang, thu_tu) values (r.ma_dang, r.stt) returning ma_cum into v_ma;
    update khtn_cau_hoi set ma_cum = v_ma
     where xoa_at is null and coalesce(parent_ma_cau, ma_cau) = r.k;
  end loop;
end $$;

-- ── 7. KIỂM BẤT BIẾN "NGÀY 0 KHÔNG ĐỔI HÀNH VI" ─────────────────────────────
-- Khoá cụm mà code dùng = `coalesce(ma_cum, parent_ma_cau, ma_cau)` (3 tầng — xem spec §5: tầng
-- `parent_ma_cau` ở giữa là lưới an toàn cho câu clone sinh ra TRƯỚC khi UI gán cụm kịp).
-- Nó phải phân hoạch câu y hệt khoá cũ `coalesce(parent_ma_cau, ma_cau)`.
-- Lệch dù 1 câu ⇒ RAISE, cả migration rollback (mỗi file 1 transaction).
-- Hai phân hoạch bằng nhau ⟺ số khối mới = số khối cũ = số CẶP (khối mới, khối cũ) phân biệt.
-- (Lệch bất kỳ kiểu nào — tách đôi một họ, hay gộp nhầm hai họ — đều làm số cặp vọt lên.)
do $$
declare r record;
begin
  for r in
    select 'dai' nhanh,
           count(distinct k_moi) n_moi, count(distinct k_cu) n_cu, count(*) n_cap
      from (select distinct coalesce(ma_cum, parent_ma_cau, ma_cau) k_moi, coalesce(parent_ma_cau, ma_cau) k_cu
              from dai_cau_hoi where xoa_at is null) d
    union all
    select 'khtn',
           count(distinct k_moi), count(distinct k_cu), count(*)
      from (select distinct coalesce(ma_cum, parent_ma_cau, ma_cau) k_moi, coalesce(parent_ma_cau, ma_cau) k_cu
              from khtn_cau_hoi where xoa_at is null) k
  loop
    if r.n_moi <> r.n_cu or r.n_moi <> r.n_cap then
      raise exception 'BACKFILL LỆCH (%): cụm mới=% họ cũ=% cặp=% — phân hoạch không trùng khít. Rollback.',
        r.nhanh, r.n_moi, r.n_cu, r.n_cap;
    end if;
  end loop;
end $$;
