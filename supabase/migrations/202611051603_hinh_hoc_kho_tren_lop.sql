-- ============================================================================
-- 202611051603 — hinh_hoc_kho_tren_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 05/11: "bản đồ Hình–Học của các khối cần có cấu trúc tương tự Đại: lý thuyết, ví dụ, mô tả, kho trên lớp, kho luyện".
--   Hình–Học đã có mô tả + lý thuyết + ví dụ + kho luyện (hinh_hoc_cau_hoi) — còn thiếu KHO TRÊN LỚP. Đại có từ 22/10
--   (mig 202610221458, dai_cau_lop): kho phục vụ GIẢNG DẠY, 2 vai (bài giảng · luyện trên lớp), thứ tự trong dạng = chuỗi gợi ý;
--   không đo, không vào mastery; giáo trình chọn câu từ CẢ 2 kho.
--   Hình làm BẢNG RIÊNG đối xứng với Đại (CLAUDE.md §1.6: tầng dưới mỗi nhánh bảng riêng, dispatch qua 1 registry ở client —
--   khoTrenLop.ts). Bài học Hình = chuyên đề = nhóm = dạng bài (Thùy 28/10) ⇒ kho trên lớp gắn thẳng BÀI HỌC; cột vẫn tên
--   dang_bai_id (= hinh_hoc_bai.ma_bai) để khuôn dòng trùng Đại, modal soạn dùng chung không phải rẽ nhánh theo tên cột.
--   Tên tham số RPC giữ nguyên như Đại (p_dang_bai…) cùng lý do.
--   Mã gốc 'HHL' + 6 số (cấp lúc INSERT, bất biến; không trùng 'LOP' của Đại, 'HHC' kho luyện Hình, 'HINH:') — tài liệu trỏ
--   text ma_cau ⇒ cấm xoá cứng, dùng kho rác xoa_at (CLAUDE.md §2).
--   RLS viết (select la_thanh_vien()) — luật từ mig 202611021935 (hàm trần chạy lại từng dòng).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm bảng + hàm mới.
-- ============================================================================

create sequence if not exists hinh_hoc_cau_lop_seq;

create table hinh_hoc_cau_lop (
  ma_cau        text primary key default ('HHL' || lpad(nextval('hinh_hoc_cau_lop_seq')::text, 6, '0')),
  mon           text not null default 'Toán',
  dang_bai_id   text not null references hinh_hoc_bai(ma_bai),            -- = bài học Hình (bài = dạng bài). Xoá bài còn câu ⇒ DB chặn
  vai           text not null check (vai in ('giang', 'luyen')),           -- giảng · luyện trên lớp
  thu_tu        integer not null default 0,                                -- thứ tự trong (bài, vai) — chuỗi gợi ý để dạy
  loai_cau      text not null default 'tu_luan' check (loai_cau in ('tu_luan', 'trac_nghiem', 'tra_loi_ngan', 'dung_sai')),
  noi_dung      text not null check (btrim(noi_dung) <> ''),
  lua_chon      jsonb,
  menh_de       jsonb,
  dap_an        text,
  loi_giai      text,
  anh_de        text,
  anh_dap_an    text,
  ghi_chu       text,                                                      -- ghi chú cho GV: dẫn dắt, ý đồ của bài trong chuỗi
  nguon         text,                                                      -- sách / tài liệu gốc (tự do)
  nguon_ma_cau  text,                                                      -- chép từ câu kho luyện nào (hinh_hoc_cau_hoi.ma_cau) — NULL = soạn mới
  da_duyet      boolean not null default false,
  duyet_boi     uuid references nhan_su(id),
  duyet_at      timestamptz,
  xoa_at        timestamptz,                                               -- kho rác (tài liệu trỏ text ⇒ không xoá cứng)
  created_by    uuid default jwt_uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index hinh_hoc_cau_lop_dang_idx on hinh_hoc_cau_lop (dang_bai_id, vai, thu_tu) where xoa_at is null;

alter table hinh_hoc_cau_lop enable row level security;
create policy hinh_hoc_cau_lop_member_all on hinh_hoc_cau_lop for all to authenticated
  using ((select la_thanh_vien())) with check ((select la_thanh_vien()));

-- mã gốc bất biến + updated_at
create or replace function _hinh_hoc_cau_lop_truoc_sua() returns trigger language plpgsql as $$
begin
  if new.ma_cau is distinct from old.ma_cau then raise exception 'Mã câu kho trên lớp là mã gốc — không đổi được.' using errcode = 'P0001'; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger trg_hinh_hoc_cau_lop_truoc_sua before update on hinh_hoc_cau_lop for each row execute function _hinh_hoc_cau_lop_truoc_sua();

-- ── Đọc: câu kho trên lớp của 1 bài học (còn sống), theo vai → thứ tự ──
create or replace function fn_hh_lop_cua_dang(p_dang_bai text) returns setof hinh_hoc_cau_lop
language sql stable as $$
  select * from hinh_hoc_cau_lop where dang_bai_id = p_dang_bai and xoa_at is null order by vai, thu_tu, created_at limit 500
$$;

-- ── Đếm theo bài học của 1 khối (bản đồ biết bài nào còn trống) ──
create or replace function fn_hh_lop_dem(p_khoi text) returns table (dang_bai_id text, so_giang int, so_luyen int)
language sql stable as $$
  select c.dang_bai_id, count(*) filter (where c.vai = 'giang')::int, count(*) filter (where c.vai = 'luyen')::int
    from hinh_hoc_cau_lop c join hinh_hoc_bai b on b.ma_bai = c.dang_bai_id
   where c.xoa_at is null and b.khoi = p_khoi
   group by c.dang_bai_id
$$;

-- ── Thêm câu (cuối chuỗi của vai đó) ──
create or replace function fn_hh_lop_them(p_dang_bai text, p_vai text, p_cau jsonb) returns hinh_hoc_cau_lop
language plpgsql as $$
declare r hinh_hoc_cau_lop;
begin
  insert into hinh_hoc_cau_lop (dang_bai_id, vai, thu_tu, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ghi_chu, nguon)
  values (p_dang_bai, p_vai,
          (select coalesce(max(thu_tu), -1) + 1 from hinh_hoc_cau_lop where dang_bai_id = p_dang_bai and vai = p_vai and xoa_at is null),
          coalesce(nullif(p_cau->>'loai_cau', ''), 'tu_luan'), p_cau->>'noi_dung', p_cau->'lua_chon', p_cau->'menh_de',
          nullif(p_cau->>'dap_an', ''), nullif(p_cau->>'loi_giai', ''), nullif(p_cau->>'anh_de', ''), nullif(p_cau->>'anh_dap_an', ''),
          nullif(p_cau->>'ghi_chu', ''), nullif(p_cau->>'nguon', ''))
  returning * into r;
  return r;
end $$;

-- ── Chép câu từ kho LUYỆN Hình sang kho trên lớp (đối tượng MỚI, mã mới; nhớ nguồn) ──
create or replace function fn_hh_lop_chep_tu_kho(p_dang_bai text, p_vai text, p_ma_caus text[]) returns setof hinh_hoc_cau_lop
language plpgsql as $$
declare m text; v_tt int;
begin
  select coalesce(max(thu_tu), -1) into v_tt from hinh_hoc_cau_lop where dang_bai_id = p_dang_bai and vai = p_vai and xoa_at is null;
  foreach m in array coalesce(p_ma_caus, '{}') loop
    if not exists (select 1 from hinh_hoc_cau_hoi where ma_cau = m and xoa_at is null) then
      raise exception 'Không có câu % trong kho luyện Hình.', m using errcode = 'P0001';
    end if;
    v_tt := v_tt + 1;
    return query
      insert into hinh_hoc_cau_lop (dang_bai_id, vai, thu_tu, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, nguon_ma_cau)
      select p_dang_bai, p_vai, v_tt, case when q.loai_cau in ('tu_luan', 'trac_nghiem', 'tra_loi_ngan', 'dung_sai') then q.loai_cau else 'tu_luan' end,
             q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.anh_dap_an, q.ma_cau
        from hinh_hoc_cau_hoi q where q.ma_cau = m
      returning *;
  end loop;
end $$;

-- ── Xếp lại thứ tự 1 chuỗi (bài × vai) theo mảng mã; đổi vai thì đưa câu sang chuỗi kia ──
create or replace function fn_hh_lop_xep(p_dang_bai text, p_vai text, p_ma_caus text[]) returns void
language plpgsql as $$
begin
  if exists (select 1 from unnest(coalesce(p_ma_caus, '{}')) x where not exists
             (select 1 from hinh_hoc_cau_lop c where c.ma_cau = x and c.dang_bai_id = p_dang_bai and c.xoa_at is null)) then
    raise exception 'Có câu không thuộc bài học này.' using errcode = 'P0001';
  end if;
  update hinh_hoc_cau_lop c set thu_tu = x.o - 1, vai = p_vai
    from unnest(p_ma_caus) with ordinality as x(m, o)
   where c.ma_cau = x.m and (c.thu_tu is distinct from x.o - 1 or c.vai is distinct from p_vai);
end $$;

-- ── Builder giáo trình: câu kho trên lớp của 1 bài học + số lần đã dùng trong tài liệu (như fn_dai_lop_cua_nhom) ──
create or replace function fn_hh_lop_cua_bai(p_ma_bai text) returns jsonb
language sql stable as $$
  with v as materialized (
    select c.ma_cau, c.dang_bai_id, c.vai, c.loai_cau, c.thu_tu
      from hinh_hoc_cau_lop c where c.dang_bai_id = p_ma_bai and c.xoa_at is null
  ),
  u as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v)))
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_cau', v.ma_cau, 'dang_bai_id', v.dang_bai_id, 'vai', v.vai, 'loai_cau', v.loai_cau, 'so_lan_dung', coalesce(u.n, 0))
         order by v.vai, v.thu_tu), '[]'::jsonb)
    from v left join u on u.ma_cau = v.ma_cau
$$;

revoke execute on function fn_hh_lop_cua_dang(text), fn_hh_lop_dem(text), fn_hh_lop_them(text, text, jsonb),
  fn_hh_lop_chep_tu_kho(text, text, text[]), fn_hh_lop_xep(text, text, text[]), fn_hh_lop_cua_bai(text) from public, anon;
grant execute on function fn_hh_lop_cua_dang(text), fn_hh_lop_dem(text), fn_hh_lop_them(text, text, jsonb),
  fn_hh_lop_chep_tu_kho(text, text, text[]), fn_hh_lop_xep(text, text, text[]), fn_hh_lop_cua_bai(text) to authenticated;
