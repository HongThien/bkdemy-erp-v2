-- ============================================================================
-- 202609132226 — kho_doi_dang_log
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 13/09): "mỗi khi người dùng duyệt mà đổi dạng thì phải lưu lại, để lần
--   sau không bị thế". Hiện chỉ có cột dang_ai_de_xuat (dạng lúc vào kho) so với
--   dang_chinh (dạng sau duyệt) — biết CÓ đổi nhưng không biết AI/ngày/từ đâu, và
--   Claude nhập kho không có chỗ nào để đọc lại bài học trước khi gán dạng lô mới.
--
-- Làm gì:
--   1. Bảng kho_doi_dang_log: 1 dòng / 1 lần đổi dang_chinh (câu HOẶC mệnh đề ĐS),
--      kèm snapshot noi_dung (để học "đề kiểu này → dạng kia"), ai đổi, khi nào.
--      Một bảng chung có cột `mon` ('dai'|'hgt'|'khtn') — đây là dữ liệu CHẤT LƯỢNG
--      QUY TRÌNH (như nhap_kho_log), không phải content môn ⇒ không tách bảng theo nhánh.
--   2. Trigger AFTER UPDATE OF dang_chinh trên 3 bảng câu + 2 bảng mệnh đề (§4 CLAUDE.md:
--      ghi vết bằng TRIGGER, app không tự nhớ). security definer để authenticated không
--      cần quyền INSERT log. Đọc cột bằng to_jsonb(new)->>… để không phụ thuộc bảng nào
--      có/không có duyet_boi, dang_ai_de_xuat.
--   3. Backfill từ dữ liệu đang có: dang_ai_de_xuat IS DISTINCT FROM dang_chinh ⇒ 1 dòng
--      nguon='backfill' (không có ai/khi nào chính xác ⇒ lấy duyet_at/duyet_boi nếu có).
--   4. fn_kho_doi_dang_tk(p_mon, p_khoi, p_tu): thống kê cặp (dạng cũ → dạng mới) + 3 ví dụ
--      đề — Claude chạy TRƯỚC khi gán dạng lô mới (bước 3 trong /nhap-kho).
--
-- MẤT GÌ: KHÔNG. Thêm 1 bảng, 1 trigger fn, 5 trigger, 1 fn đọc.
-- ============================================================================

create table if not exists public.kho_doi_dang_log (
  id              uuid primary key default gen_random_uuid(),
  mon             text not null check (mon in ('dai', 'hgt', 'khtn')),
  loai            text not null check (loai in ('cau', 'menh_de')),
  ma_cau          text not null,                 -- câu, hoặc câu CHA của mệnh đề
  thu_tu          integer,                       -- mệnh đề: thứ tự trong câu cha; câu: null
  dang_cu         text not null,
  dang_moi        text not null,
  dang_ai_de_xuat text,                          -- dạng lúc vào kho (để đo precision AI theo thời gian)
  loai_cau        text,
  noi_dung        text,                          -- snapshot đề (cắt 600 ký tự) — nguyên liệu học
  nguoi           uuid,                          -- người duyệt (duyet_boi lúc đổi), null nếu không rõ
  doi_at          timestamptz not null default now(),
  nguon           text not null default 'trigger' check (nguon in ('trigger', 'backfill'))
);
comment on table public.kho_doi_dang_log is 'Vết đổi dạng (dang_chinh) của câu/mệnh đề khi người duyệt. Trigger tự ghi. Claude đọc fn_kho_doi_dang_tk trước khi gán dạng lô mới (CEO 13/09).';
create index if not exists kho_doi_dang_log_mon_at on public.kho_doi_dang_log (mon, doi_at desc);
create index if not exists kho_doi_dang_log_cap on public.kho_doi_dang_log (mon, dang_cu, dang_moi);

alter table public.kho_doi_dang_log enable row level security;
drop policy if exists kho_doi_dang_log_select on public.kho_doi_dang_log;
create policy kho_doi_dang_log_select on public.kho_doi_dang_log for select to authenticated using (true);
grant select on public.kho_doi_dang_log to authenticated;

-- ── Trigger fn: tg_argv[0] = mon ('dai'|'hgt'|'khtn'), tg_argv[1] = 'cau' | 'menh_de' ──
create or replace function public._trg_log_doi_dang() returns trigger
language plpgsql security definer set search_path = public as $$
declare j jsonb;
begin
  if new.dang_chinh is distinct from old.dang_chinh then
    j := to_jsonb(new);
    if tg_argv[1] = 'cau' then
      insert into public.kho_doi_dang_log (mon, loai, ma_cau, thu_tu, dang_cu, dang_moi, dang_ai_de_xuat, loai_cau, noi_dung, nguoi)
      values (tg_argv[0], 'cau', j->>'ma_cau', null, old.dang_chinh, new.dang_chinh,
              j->>'dang_ai_de_xuat', j->>'loai_cau', left(j->>'noi_dung', 600), nullif(j->>'duyet_boi', '')::uuid);
    else
      insert into public.kho_doi_dang_log (mon, loai, ma_cau, thu_tu, dang_cu, dang_moi, dang_ai_de_xuat, loai_cau, noi_dung, nguoi)
      values (tg_argv[0], 'menh_de', j->>'ma_cau_cha', (j->>'thu_tu')::int, old.dang_chinh, new.dang_chinh,
              j->>'dang_ai_de_xuat', 'menh_de', left(j->>'noi_dung', 600), nullif(j->>'duyet_boi', '')::uuid);
    end if;
  end if;
  return new;
end $$;

do $$
declare r record;
begin
  for r in select * from (values
      ('dai_cau_hoi', 'dai', 'cau'), ('hgt_cau_hoi', 'hgt', 'cau'), ('khtn_cau_hoi', 'khtn', 'cau'),
      ('dai_cau_menh_de', 'dai', 'menh_de'), ('hgt_cau_menh_de', 'hgt', 'menh_de')
    ) v(tbl, mon, loai) loop
    execute format('drop trigger if exists trg_log_doi_dang on %I', r.tbl);
    execute format('create trigger trg_log_doi_dang after update of dang_chinh on %I for each row execute function public._trg_log_doi_dang(%L, %L)', r.tbl, r.mon, r.loai);
  end loop;
end $$;

-- ── Backfill: những câu/mệnh đề đã bị đổi dạng TRƯỚC khi có log ─────────────
do $$
declare r record;
begin
  for r in select * from (values ('dai_cau_hoi', 'dai'), ('hgt_cau_hoi', 'hgt'), ('khtn_cau_hoi', 'khtn')) v(tbl, mon) loop
    execute format($q$
      insert into public.kho_doi_dang_log (mon, loai, ma_cau, dang_cu, dang_moi, dang_ai_de_xuat, loai_cau, noi_dung, nguoi, doi_at, nguon)
      select %L, 'cau', c.ma_cau, c.dang_ai_de_xuat, c.dang_chinh, c.dang_ai_de_xuat, c.loai_cau, left(c.noi_dung, 600),
             (to_jsonb(c)->>'duyet_boi')::uuid, coalesce((to_jsonb(c)->>'duyet_at')::timestamptz, now()), 'backfill'
        from %I c
       where c.dang_ai_de_xuat is not null and c.dang_ai_de_xuat is distinct from c.dang_chinh
         and (to_jsonb(c)->>'xoa_at') is null
    $q$, r.mon, r.tbl);
  end loop;
  for r in select * from (values ('dai_cau_menh_de', 'dai'), ('hgt_cau_menh_de', 'hgt')) v(tbl, mon) loop
    execute format($q$
      insert into public.kho_doi_dang_log (mon, loai, ma_cau, thu_tu, dang_cu, dang_moi, dang_ai_de_xuat, loai_cau, noi_dung, nguoi, doi_at, nguon)
      select %L, 'menh_de', k.ma_cau_cha, k.thu_tu, k.dang_ai_de_xuat, k.dang_chinh, k.dang_ai_de_xuat, 'menh_de', left(k.noi_dung, 600),
             k.duyet_boi, coalesce(k.duyet_at, now()), 'backfill'
        from %I k
       where k.dang_ai_de_xuat is not null and k.dang_ai_de_xuat is distinct from k.dang_chinh and k.xoa_at is null
    $q$, r.mon, r.tbl);
  end loop;
end $$;

-- ── Thống kê cho Claude/người: cặp (dạng cũ → mới) theo môn/khối, kèm ví dụ đề ───────
-- p_mon = 'dai'|'hgt'|'khtn' (prefix bảng). p_khoi lọc theo khối của DẠNG MỚI. p_tu: chỉ lấy từ mốc này.
create or replace function public.fn_kho_doi_dang_tk(p_mon text, p_khoi text default null, p_tu timestamptz default null)
returns table (dang_cu text, ten_cu text, dang_moi text, ten_moi text, so_lan bigint, lan_cuoi timestamptz, vi_du jsonb)
language plpgsql stable set search_path = public as $$
begin
  if p_mon not in ('dai', 'hgt', 'khtn') then raise exception 'fn_kho_doi_dang_tk: mon không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select l.dang_cu, coalesce(bc.ten_dang, '(dạng không còn)'), l.dang_moi, coalesce(bm.ten_dang, '?'),
           count(*)::bigint, max(l.doi_at),
           (select jsonb_agg(x.noi_dung order by x.doi_at desc)
              from (select noi_dung, doi_at from public.kho_doi_dang_log
                     where mon = l.mon and dang_cu = l.dang_cu and dang_moi = l.dang_moi and noi_dung is not null
                     order by doi_at desc limit 3) x)
      from public.kho_doi_dang_log l
      left join %1$I bc on bc.ma_dang = l.dang_cu
      left join %1$I bm on bm.ma_dang = l.dang_moi
     where l.mon = $1 and ($2::text is null or bm.khoi = $2) and ($3::timestamptz is null or l.doi_at >= $3)
     group by l.mon, l.dang_cu, bc.ten_dang, l.dang_moi, bm.ten_dang
     order by count(*) desc, max(l.doi_at) desc
  $q$, p_mon || '_ban_do') using p_mon, p_khoi, p_tu;
end $$;
grant execute on function public.fn_kho_doi_dang_tk(text, text, timestamptz) to authenticated;
