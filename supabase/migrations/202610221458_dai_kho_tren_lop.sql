-- ============================================================================
-- 202610221458 — dai_kho_tren_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 22/10: tách 2 kho — KHO TRÊN LỚP (phục vụ giảng dạy) và KHO LUYỆN TẬP (BTVN / luyện tập: dai_cau_hoi hiện có).
--   "Bài tập để giảng dạy mang định hướng toàn cục, dẫn dắt; luyện tập focus vấn đề riêng." Kho trên lớp gồm 2 VAI:
--   bài GIẢNG + bài LUYỆN TRÊN LỚP. Kho = tầng đảm bảo: mỗi dạng bài có đủ bài / chuỗi bài cần để dạy dạng đó (thứ tự trong
--   dạng = chuỗi gợi ý); chọn bài nào cho lớp nào là việc của GIÁO TRÌNH (GV chọn nguồn từ CẢ 2 kho). Đại trước, Hình làm riêng sau.
--   BẢNG RIÊNG (không thêm cột "mục đích" vào dai_cau_hoi): dai_cau_hoi có hàng chục chỗ đọc (mastery, ET, tự luyện, bổ trợ, MCQ,
--   chuyên đề) — trộn vào thì chỗ nào quên lọc là kéo bài giảng đi đo, hỏng âm thầm. Kho trên lớp KHÔNG đo, không vào mastery.
--   Mã gốc 'LOP' + 6 số (cấp lúc INSERT, bất biến; không trùng mã kho luyện 'T…' / Hình 'HINH:') — tài liệu trỏ text ma_cau ⇒
--   cấm xoá cứng, dùng kho rác xoa_at (CLAUDE.md §2).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm bảng + hàm mới.
-- ============================================================================

create sequence if not exists dai_cau_lop_seq;

create table dai_cau_lop (
  ma_cau        text primary key default ('LOP' || lpad(nextval('dai_cau_lop_seq')::text, 6, '0')),
  mon           text not null default 'Toán',
  dang_bai_id   text not null references dai_bdm_dang_bai(id),          -- xoá dạng bài còn câu ⇒ DB chặn (chuyển câu trước)
  vai           text not null check (vai in ('giang', 'luyen')),         -- giảng · luyện trên lớp
  thu_tu        integer not null default 0,                              -- thứ tự trong (dạng bài, vai) — chuỗi gợi ý để dạy
  loai_cau      text not null default 'tu_luan' check (loai_cau in ('tu_luan', 'trac_nghiem', 'tra_loi_ngan', 'dung_sai')),
  noi_dung      text not null check (btrim(noi_dung) <> ''),
  lua_chon      jsonb,
  menh_de       jsonb,
  dap_an        text,
  loi_giai      text,
  anh_de        text,
  anh_dap_an    text,
  ghi_chu       text,                                                    -- ghi chú cho GV: dẫn dắt, ý đồ của bài trong chuỗi
  nguon         text,                                                    -- sách / tài liệu gốc (tự do)
  nguon_ma_cau  text,                                                    -- chép từ câu kho luyện nào (dai_cau_hoi.ma_cau) — NULL = soạn mới
  da_duyet      boolean not null default false,
  duyet_boi     uuid references nhan_su(id),
  duyet_at      timestamptz,
  xoa_at        timestamptz,                                             -- kho rác (tài liệu trỏ text ⇒ không xoá cứng)
  created_by    uuid default jwt_uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index dai_cau_lop_dang_idx on dai_cau_lop (dang_bai_id, vai, thu_tu) where xoa_at is null;

alter table dai_cau_lop enable row level security;
create policy dai_cau_lop_member_all on dai_cau_lop for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());

-- mã gốc bất biến + updated_at
create or replace function _dai_cau_lop_truoc_sua() returns trigger language plpgsql as $$
begin
  if new.ma_cau is distinct from old.ma_cau then raise exception 'Mã câu kho trên lớp là mã gốc — không đổi được.' using errcode = 'P0001'; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger trg_dai_cau_lop_truoc_sua before update on dai_cau_lop for each row execute function _dai_cau_lop_truoc_sua();

-- ── Đọc: câu kho trên lớp của 1 dạng bài (còn sống), theo vai → thứ tự ──
create or replace function fn_dai_lop_cua_dang(p_dang_bai text) returns setof dai_cau_lop
language sql stable as $$
  select * from dai_cau_lop where dang_bai_id = p_dang_bai and xoa_at is null order by vai, thu_tu, created_at limit 500
$$;

-- ── Đếm theo dạng bài của 1 khối (cho bản đồ biết dạng nào còn trống) ──
create or replace function fn_dai_lop_dem(p_khoi text) returns table (dang_bai_id text, so_giang int, so_luyen int)
language sql stable as $$
  select c.dang_bai_id, count(*) filter (where c.vai = 'giang')::int, count(*) filter (where c.vai = 'luyen')::int
    from dai_cau_lop c
   where c.xoa_at is null
     and c.dang_bai_id in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id
                            join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi)
   group by c.dang_bai_id
$$;

-- ── Thêm câu (cuối chuỗi của vai đó) ──
create or replace function fn_dai_lop_them(p_dang_bai text, p_vai text, p_cau jsonb) returns dai_cau_lop
language plpgsql as $$
declare r dai_cau_lop;
begin
  insert into dai_cau_lop (dang_bai_id, vai, thu_tu, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ghi_chu, nguon)
  values (p_dang_bai, p_vai,
          (select coalesce(max(thu_tu), -1) + 1 from dai_cau_lop where dang_bai_id = p_dang_bai and vai = p_vai and xoa_at is null),
          coalesce(nullif(p_cau->>'loai_cau', ''), 'tu_luan'), p_cau->>'noi_dung', p_cau->'lua_chon', p_cau->'menh_de',
          nullif(p_cau->>'dap_an', ''), nullif(p_cau->>'loi_giai', ''), nullif(p_cau->>'anh_de', ''), nullif(p_cau->>'anh_dap_an', ''),
          nullif(p_cau->>'ghi_chu', ''), nullif(p_cau->>'nguon', ''))
  returning * into r;
  return r;
end $$;

-- ── Chép câu từ kho LUYỆN sang kho trên lớp (đối tượng MỚI, mã mới; nhớ nguồn) — "1 số bài giảng và bài luyện giống nhau" ──
create or replace function fn_dai_lop_chep_tu_kho(p_dang_bai text, p_vai text, p_ma_caus text[]) returns setof dai_cau_lop
language plpgsql as $$
declare m text; v_tt int;
begin
  select coalesce(max(thu_tu), -1) into v_tt from dai_cau_lop where dang_bai_id = p_dang_bai and vai = p_vai and xoa_at is null;
  foreach m in array coalesce(p_ma_caus, '{}') loop
    if not exists (select 1 from dai_cau_hoi where ma_cau = m and xoa_at is null) then
      raise exception 'Không có câu % trong kho luyện.', m using errcode = 'P0001';
    end if;
    v_tt := v_tt + 1;
    return query
      insert into dai_cau_lop (dang_bai_id, vai, thu_tu, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, nguon_ma_cau)
      select p_dang_bai, p_vai, v_tt, case when q.loai_cau in ('tu_luan', 'trac_nghiem', 'tra_loi_ngan', 'dung_sai') then q.loai_cau else 'tu_luan' end,
             q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.anh_dap_an, q.ma_cau
        from dai_cau_hoi q where q.ma_cau = m
      returning *;
  end loop;
end $$;

-- ── Xếp lại thứ tự 1 chuỗi (dạng bài × vai) theo mảng mã; đổi vai thì đưa câu sang chuỗi kia ──
create or replace function fn_dai_lop_xep(p_dang_bai text, p_vai text, p_ma_caus text[]) returns void
language plpgsql as $$
begin
  if exists (select 1 from unnest(coalesce(p_ma_caus, '{}')) x where not exists
             (select 1 from dai_cau_lop c where c.ma_cau = x and c.dang_bai_id = p_dang_bai and c.xoa_at is null)) then
    raise exception 'Có câu không thuộc dạng bài này.' using errcode = 'P0001';
  end if;
  update dai_cau_lop c set thu_tu = x.o - 1, vai = p_vai
    from unnest(p_ma_caus) with ordinality as x(m, o)
   where c.ma_cau = x.m and (c.thu_tu is distinct from x.o - 1 or c.vai is distinct from p_vai);
end $$;

revoke execute on function fn_dai_lop_cua_dang(text), fn_dai_lop_dem(text), fn_dai_lop_them(text, text, jsonb),
  fn_dai_lop_chep_tu_kho(text, text, text[]), fn_dai_lop_xep(text, text, text[]) from public, anon;
grant execute on function fn_dai_lop_cua_dang(text), fn_dai_lop_dem(text), fn_dai_lop_them(text, text, jsonb),
  fn_dai_lop_chep_tu_kho(text, text, text[]), fn_dai_lop_xep(text, text, text[]) to authenticated;
