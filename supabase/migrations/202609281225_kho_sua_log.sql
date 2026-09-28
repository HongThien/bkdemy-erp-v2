-- ============================================================================
-- 202609281225 — kho_sua_log
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-luong-kho.md §5.0 lớp ĐO, §5.5 luật lên cấp — CEO chốt 28/09):
--   "Máy kiểm độc lập + người duyệt; tỉ lệ đạt liên tục thì máy tự duyệt." Muốn biết tỉ lệ thì phải biết,
--   với MỖI câu người duyệt, người đã SỬA KHÂU NÀO của máy. Hiện chỉ đo được 1 khâu (dạng, qua
--   kho_doi_dang_log) và đo sai: cột `nguoi` ở đó là duyet_boi của dòng, không phải người gây ra thay đổi,
--   nên đợt chuẩn hoá mã 18/09 (script chạy) nằm lẫn với người sửa thật — 2.748/2.861 dòng là đổi MÃ.
--   Đề, đáp số, lời giải, cụm, hình: sửa xong là mất dấu, `log_kho_cau` cố ý chỉ ghi đổi trạng thái rác.
--
--   Ghi bằng TRIGGER (§4 CLAUDE.md): app và dây chuyền không phải nhớ ghi log ⇒ không bao giờ sót.
--   Ai sửa lấy từ jwt_uid(): có ⇒ NGƯỜI (qua app); null ⇒ MÁY (script/dây chuyền nối thẳng DB).
--   So sánh sau khi chuẩn hoá khoảng trắng: fn_kho_duyet_cau luôn SET lại mọi cột và trim() — nếu so thô
--   thì mỗi lần duyệt "không sửa gì" vẫn bị tính là sửa.
--
--   KHÔNG ghi trùng khâu dạng vào bảng mới: một sự kiện chỉ có một nơi ghi. Khâu dạng vẫn ở
--   kho_doi_dang_log, chỉ thêm cột `actor` cho nó.
--
--   Phạm vi: 3 bảng câu đang đi chung đường duyệt (dai · hgt · khtn). hinh_hoc_cau_hoi có đường riêng,
--   để đợt Hình.
--
-- MẤT GÌ: KHÔNG. Thêm 1 bảng, 1 cột (kho_doi_dang_log.actor), 3 hàm, 3 trigger; thay thân 1 hàm trigger
--   (_trg_log_doi_dang — giữ nguyên mọi thứ đang ghi, thêm actor). Không drop, không đổi kiểu, không xoá dòng.
-- ============================================================================

-- ── 0) Chuẩn hoá trước khi so: CRLF→LF, gộp dấu cách/tab liền nhau, bỏ dấu cách quanh chỗ xuống dòng,
--       bỏ khoảng trắng đầu cuối; rỗng = null. GIỮ chỗ xuống dòng: người sửa cách ngắt dòng lời giải là
--       sửa TRÌNH BÀY, phải được tính. ────────────────────────────────────────────────────────────────────
create or replace function public._kho_so_sanh_chuan(p text) returns text
language sql immutable as $$
  select nullif(btrim(regexp_replace(regexp_replace(replace(p, E'\r\n', E'\n'), '[ \t]+', ' ', 'g'), ' ?\n ?', E'\n', 'g'), E' \n\t'), '')
$$;

-- ── 1) Bảng vết ─────────────────────────────────────────────────────────────────────────────────────────
create table if not exists public.kho_sua_log (
  id               uuid primary key default gen_random_uuid(),
  mon              text not null check (mon in ('dai', 'hgt', 'khtn')),
  ma_cau           text not null,
  khau             text not null check (khau in ('doc', 'menh_de', 'dap_so', 'loi_giai', 'cum', 'hinh')),
  truong           text not null,                 -- tên cột bị đổi
  cu               text,                          -- null = trước đó TRỐNG (đây là ĐIỀN, không phải SỬA)
  moi              text,
  nguon            text not null check (nguon in ('nguoi', 'may')),
  actor            uuid,                          -- jwt_uid() lúc đổi; null khi máy
  da_duyet_truoc   boolean not null default false, -- câu đã duyệt rồi mới bị sửa ⇒ hậu kiểm, không phải duyệt
  giai_method_truoc text,                         -- ai làm ra cái vừa bị sửa
  nguon_giai_truoc text,
  sua_at           timestamptz not null default now()
);
comment on table public.kho_sua_log is 'Vết sửa nội dung câu (đề/mệnh đề/đáp số/lời giải/cụm/hình), trigger tự ghi. Khâu DẠNG nằm ở kho_doi_dang_log. Dùng để đo tỉ lệ lọt từng khâu (spec-luong-kho §5.5).';
comment on column public.kho_sua_log.cu is 'null = trước đó trống ⇒ dòng này là ĐIỀN lần đầu. Đo "người sửa bài của máy" phải lọc cu is not null.';
create index if not exists kho_sua_log_cau on public.kho_sua_log (mon, ma_cau, sua_at);
create index if not exists kho_sua_log_khau on public.kho_sua_log (mon, khau, sua_at desc);

alter table public.kho_sua_log enable row level security;
drop policy if exists kho_sua_log_select on public.kho_sua_log;
create policy kho_sua_log_select on public.kho_sua_log for select to authenticated using (true);
grant select on public.kho_sua_log to authenticated;

-- ── 2) Trigger fn: tg_argv[0] = mon. Đọc cột qua to_jsonb để không phụ thuộc bảng nào có/không có cột nào ──
create or replace function public._trg_log_kho_sua() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  jo jsonb := to_jsonb(old);
  jn jsonb := to_jsonb(new);
  v_actor uuid := public.jwt_uid();
  r record;
  khac boolean;
begin
  for r in select * from (values
      ('noi_dung', 'doc'), ('lua_chon', 'doc'), ('menh_de', 'menh_de'), ('dap_an', 'dap_so'),
      ('loi_giai', 'loi_giai'), ('ma_cum', 'cum'), ('anh_de', 'hinh'), ('anh_dap_an', 'hinh')
    ) v(truong, khau) loop
    if jsonb_typeof(jo -> r.truong) = 'string' or jsonb_typeof(jn -> r.truong) = 'string' then
      khac := public._kho_so_sanh_chuan(jo ->> r.truong) is distinct from public._kho_so_sanh_chuan(jn ->> r.truong);
    else
      khac := coalesce(jo -> r.truong, 'null'::jsonb) is distinct from coalesce(jn -> r.truong, 'null'::jsonb);
    end if;
    if khac then
      insert into public.kho_sua_log (mon, ma_cau, khau, truong, cu, moi, nguon, actor, da_duyet_truoc, giai_method_truoc, nguon_giai_truoc)
      values (tg_argv[0], jn ->> 'ma_cau', r.khau, r.truong,
              left(public._kho_so_sanh_chuan(jo ->> r.truong), 4000), left(public._kho_so_sanh_chuan(jn ->> r.truong), 4000),
              case when v_actor is null then 'may' else 'nguoi' end, v_actor,
              coalesce((jo ->> 'da_duyet')::boolean, false), jo ->> 'giai_method', jo ->> 'nguon_giai');
    end if;
  end loop;
  return new;
end $$;

-- Danh sách cột trong mệnh đề UPDATE OF lấy từ chính bảng: bảng thiếu cột nào thì bỏ cột đó, không chết cả migration
do $$
declare r record; v_cot text;
begin
  for r in select * from (values ('dai_cau_hoi', 'dai'), ('hgt_cau_hoi', 'hgt'), ('khtn_cau_hoi', 'khtn')) v(tbl, mon) loop
    select string_agg(quote_ident(c.column_name), ', ' order by c.ordinal_position) into v_cot
      from information_schema.columns c
     where c.table_schema = 'public' and c.table_name = r.tbl
       and c.column_name in ('noi_dung', 'lua_chon', 'menh_de', 'dap_an', 'loi_giai', 'ma_cum', 'anh_de', 'anh_dap_an');
    if v_cot is null then raise exception 'kho_sua_log: bảng % không có cột nội dung nào — kiểm lại tên bảng', r.tbl; end if;
    execute format('drop trigger if exists trg_log_kho_sua on %I', r.tbl);
    execute format('create trigger trg_log_kho_sua after update of %s on %I for each row execute function public._trg_log_kho_sua(%L)', v_cot, r.tbl, r.mon);
  end loop;
end $$;

-- ── 3) Khâu DẠNG: thêm actor vào log đang có (thân hàm y nguyên mig 202609132226, chỉ thêm cột actor) ────
alter table public.kho_doi_dang_log add column if not exists actor uuid;
comment on column public.kho_doi_dang_log.actor is 'jwt_uid() lúc đổi dạng. null = máy/script (vd đợt chuẩn hoá mã). Khác cột `nguoi` (= duyet_boi của dòng, không phải người gây ra thay đổi). Dòng trước 28/09 không có actor.';

create or replace function public._trg_log_doi_dang() returns trigger
language plpgsql security definer set search_path = public as $$
declare j jsonb;
begin
  if new.dang_chinh is distinct from old.dang_chinh then
    j := to_jsonb(new);
    if tg_argv[1] = 'cau' then
      insert into public.kho_doi_dang_log (mon, loai, ma_cau, thu_tu, dang_cu, dang_moi, dang_ai_de_xuat, loai_cau, noi_dung, nguoi, actor)
      values (tg_argv[0], 'cau', j->>'ma_cau', null, old.dang_chinh, new.dang_chinh,
              j->>'dang_ai_de_xuat', j->>'loai_cau', left(j->>'noi_dung', 600), nullif(j->>'duyet_boi', '')::uuid, public.jwt_uid());
    else
      insert into public.kho_doi_dang_log (mon, loai, ma_cau, thu_tu, dang_cu, dang_moi, dang_ai_de_xuat, loai_cau, noi_dung, nguoi, actor)
      values (tg_argv[0], 'menh_de', j->>'ma_cau_cha', (j->>'thu_tu')::int, old.dang_chinh, new.dang_chinh,
              j->>'dang_ai_de_xuat', 'menh_de', left(j->>'noi_dung', 600), nullif(j->>'duyet_boi', '')::uuid, public.jwt_uid());
    end if;
  end if;
  return new;
end $$;

-- ── 4) Đọc: mỗi khâu, trong các câu NGƯỜI duyệt ở khoảng [p_tu, p_den), bao nhiêu câu người phải sửa ─────
-- "Sửa" = người đổi một giá trị ĐÃ CÓ (cu is not null), tính tới lúc duyệt (+1 phút cho lệch đồng hồ giao dịch).
-- Dạng: bỏ ca rời dạng chờ (đó là gán lần đầu, không phải sửa). p_mon = 'dai' | 'hgt' | 'khtn'.
create or replace function public.fn_kho_sua_tk(p_mon text, p_tu timestamptz, p_den timestamptz default now())
returns table (khau text, so_cau_duyet bigint, so_cau_nguoi_sua bigint)
language plpgsql stable set search_path = public as $$
begin
  if p_mon not in ('dai', 'hgt', 'khtn') then raise exception 'fn_kho_sua_tk: mon không hợp lệ %', p_mon; end if;
  return query execute format($q$
    with d as (
      select c.ma_cau, c.duyet_at from %1$I c
       where c.xoa_at is null and c.da_duyet and c.duyet_nguon = 'nguoi' and c.duyet_at >= $2 and c.duyet_at < $3
    ), s as (
      select l.khau, l.ma_cau from public.kho_sua_log l join d on d.ma_cau = l.ma_cau
       where l.mon = $1 and l.nguon = 'nguoi' and l.cu is not null and l.sua_at <= d.duyet_at + interval '1 minute'
      union
      select 'dang', g.ma_cau from public.kho_doi_dang_log g join d on d.ma_cau = g.ma_cau
       where g.mon = $1 and g.loai = 'cau' and g.actor is not null and g.dang_cu !~ '000000$'
         and g.doi_at <= d.duyet_at + interval '1 minute'
    )
    select k.khau, (select count(*) from d)::bigint, (select count(distinct s.ma_cau) from s where s.khau = k.khau)::bigint
      from unnest(array['doc', 'menh_de', 'dang', 'cum', 'dap_so', 'loi_giai', 'hinh']) with ordinality k(khau, tt)
     order by k.tt
  $q$, p_mon || '_cau_hoi') using p_mon, p_tu, p_den;
end $$;
revoke all on function public.fn_kho_sua_tk(text, timestamptz, timestamptz) from public, anon;
grant execute on function public.fn_kho_sua_tk(text, timestamptz, timestamptz) to authenticated;
