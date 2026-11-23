-- ============================================================================
-- 202611231754 — SỔ CHI PHÍ AI (đếm token theo người / kênh) + dashboard ở Phòng làm việc Giám đốc
-- VÌ SAO (Thùy 23/11): "T muốn thiết kế bộ đếm token các thứ: t cần biết ai sử dụng bao nhiêu token để còn tính toán xem hiệu quả hay ko nữa"
--   · "t cần 1 màn dashboard cái đếm token này ở phòng làm việc giám đốc để t theo dõi được".
-- HIỆN TRẠNG (đo 23/11): token nằm rải 5 bảng, mỗi bảng một kiểu — claude_phien_tin.usage (752 lượt từ 01/11) · troly_hoi_dap.usage ·
--   hoi_dap_nhan_su.usage · danhgia_ai_job.usage · btvn_ai_lan.tokens_in/out (29 lần, 0 có số). Máy tự giải bài (scheduler) không ghi.
-- CÁCH:
--   • ai_luot_dung = SỔ CHUNG: một dòng = một lượt gọi model của một kênh (khoá tự nhiên kenh + nguon_id ⇒ ghi lại không đẻ trùng).
--     Trigger trên từng bảng nguồn tự ghi sổ khi lượt có số token (app/bot KHÔNG phải nhớ ghi — CLAUDE §4). Chép số cũ một lần ở cuối file.
--   • TIỀN TÍNH LÚC ĐỌC từ ai_bang_gia (USD / 1 triệu token, giá API chính thức) — sửa giá là mọi số đổi theo; lượt nào Claude Code tự báo
--     chi phí (cost_cli_usd) thì dùng số đó. Model chưa có giá ⇒ chỉ đếm token, tiền để trống (không đoán).
--   • Phiên Claude chạy bằng gói thuê bao trên máy Thùy ⇒ tiền là GIÁ TRỊ TƯƠNG ĐƯƠNG theo giá API, không phải tiền đã trả; chấm BTVN = API trả thật.
--   • fn_ai_chi_phi(từ, đến): một lượt gọi cho cả dashboard (chỉ admin hệ thống). Sổ nhỏ (~1 nghìn dòng / tháng) ⇒ tổng hợp lúc đọc, đo < 100 ms;
--     to lên thì chuyển sang sổ tính sẵn theo ngày (spec-kien-truc K2).
-- MẤT GÌ: không xoá gì.
-- ============================================================================

-- ── 1. Bảng giá + tỷ giá ─────────────────────────────────────────────────────
create table if not exists public.ai_bang_gia (
  model text primary key,
  vao numeric not null,          -- USD / 1 triệu token đầu vào thường
  ra numeric not null,           -- USD / 1 triệu token đầu ra (gồm nghĩ)
  ghi_5m numeric not null,       -- ghi bộ nhớ đệm giữ 5 phút (1,25 × vào)
  ghi_1h numeric not null,       -- ghi bộ nhớ đệm giữ 1 giờ (2 × vào)
  doc_cache numeric not null,    -- đọc lại bộ nhớ đệm
  ghi_chu text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.ai_bang_gia enable row level security;
drop policy if exists ai_bang_gia_xem on public.ai_bang_gia;
create policy ai_bang_gia_xem on public.ai_bang_gia for select to authenticated
  using (coalesce((select n.la_admin_he_thong from public.nhan_su n where n.id = (select public.current_nhan_su_id())), false));
insert into public.ai_bang_gia (model, vao, ra, ghi_5m, ghi_1h, doc_cache, ghi_chu) values
  ('claude-opus-5-5',   4,    20,   5,     8,    0.20, 'Giá API Anthropic, tra 23/11/2026'),
  ('claude-fable-5-2',  8,    40,   10,    16,   0.20, 'Giá API Anthropic, tra 23/11/2026'),
  ('claude-sonnet-5-5', 2,    10,   2.5,   4,    0.10, 'Giá API Anthropic, tra 23/11/2026'),
  ('claude-sonnet-5',   2,    10,   2.5,   4,    0.20, 'Giá API Anthropic, tra 23/11/2026'),
  ('claude-haiku-5-5',  0.10, 0.50, 0.125, 0.20, 0.01, 'Giá API Anthropic, tra 23/11/2026 (≤100K token đầu vào)')
on conflict (model) do nothing;

create table if not exists public.ai_cau_hinh (
  id int primary key default 1 check (id = 1),
  vnd_moi_usd numeric not null,
  model_mac_dinh text not null,  -- lượt không ghi model (bot cũ) ⇒ tính theo model này, đánh dấu "ước tính"
  updated_at timestamptz not null default now()
);
alter table public.ai_cau_hinh enable row level security;
drop policy if exists ai_cau_hinh_xem on public.ai_cau_hinh;
create policy ai_cau_hinh_xem on public.ai_cau_hinh for select to authenticated
  using (coalesce((select n.la_admin_he_thong from public.nhan_su n where n.id = (select public.current_nhan_su_id())), false));
insert into public.ai_cau_hinh (id, vnd_moi_usd, model_mac_dinh) values (1, 26000, 'claude-opus-5-5') on conflict (id) do nothing;

-- ── 2. Sổ chung ──────────────────────────────────────────────────────────────
create table if not exists public.ai_luot_dung (
  id bigint generated always as identity primary key,
  kenh text not null check (kenh in ('phien', 'tro_ly', 'hoi_dap', 'danh_gia', 'cham_btvn')),
  nguon_id text not null,                 -- id dòng ở bảng nguồn
  at timestamptz not null,
  nhan_su_id uuid references public.nhan_su(id),   -- NULL = máy tự chạy, không gắn người
  mon text,                               -- NULL = kênh không theo môn (trợ lý, hỏi đáp)
  khoi text,
  loai_viec text not null,                -- loại phiên / loại việc
  phien_id uuid,                          -- chỉ kênh phiên
  model text,                             -- NULL = nguồn không ghi model ⇒ tính theo ai_cau_hinh.model_mac_dinh
  vao bigint not null default 0,
  ghi_5m bigint not null default 0,
  ghi_1h bigint not null default 0,
  doc_cache bigint not null default 0,
  ra bigint not null default 0,
  cost_cli_usd numeric,                   -- Claude Code tự báo (NULL = nguồn không báo ⇒ tính từ bảng giá)
  thue_bao boolean not null,              -- true = gói thuê bao (giá trị tương đương), false = API trả tiền thật
  created_at timestamptz not null default now(),
  unique (kenh, nguon_id)
);
create index if not exists ai_luot_dung_at_idx on public.ai_luot_dung (at);
create index if not exists ai_luot_dung_ns_idx on public.ai_luot_dung (nhan_su_id);
create index if not exists ai_luot_dung_phien_idx on public.ai_luot_dung (phien_id);
alter table public.ai_luot_dung enable row level security;
drop policy if exists ai_luot_dung_xem on public.ai_luot_dung;
create policy ai_luot_dung_xem on public.ai_luot_dung for select to authenticated
  using (coalesce((select n.la_admin_he_thong from public.nhan_su n where n.id = (select public.current_nhan_su_id())), false));

-- usage kiểu Claude (input/cache/output) ⇒ 5 cột; usage kiểu khác (prompt_tokens / completion_tokens) cũng đọc được
create or replace function public._ai_ghi_luot(
  p_kenh text, p_nguon text, p_at timestamptz, p_ns uuid, p_mon text, p_khoi text, p_loai text, p_phien uuid,
  p_model text, p_u jsonb, p_thue_bao boolean)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_1h bigint := coalesce((p_u->'cache_creation'->>'ephemeral_1h_input_tokens')::bigint, 0);
  v_ghi bigint := coalesce((p_u->>'cache_creation_input_tokens')::bigint, 0);
begin
  if p_u is null or jsonb_typeof(p_u) <> 'object' then return; end if;
  insert into ai_luot_dung (kenh, nguon_id, at, nhan_su_id, mon, khoi, loai_viec, phien_id, model, vao, ghi_5m, ghi_1h, doc_cache, ra, cost_cli_usd, thue_bao)
  values (p_kenh, p_nguon, p_at, p_ns, p_mon, p_khoi, p_loai, p_phien,
          nullif(coalesce(p_u->>'model', p_model), ''),
          coalesce((p_u->>'input_tokens')::bigint, (p_u->>'prompt_tokens')::bigint, 0),
          greatest(v_ghi - v_1h, 0), v_1h,
          coalesce((p_u->>'cache_read_input_tokens')::bigint, 0),
          coalesce((p_u->>'output_tokens')::bigint, (p_u->>'completion_tokens')::bigint, 0),
          (p_u->>'cost_usd')::numeric, p_thue_bao)
  on conflict (kenh, nguon_id) do update set
    at = excluded.at, model = coalesce(excluded.model, ai_luot_dung.model), vao = excluded.vao, ghi_5m = excluded.ghi_5m, ghi_1h = excluded.ghi_1h,
    doc_cache = excluded.doc_cache, ra = excluded.ra, cost_cli_usd = coalesce(excluded.cost_cli_usd, ai_luot_dung.cost_cli_usd);
end $$;
revoke execute on function public._ai_ghi_luot(text, text, timestamptz, uuid, text, text, text, uuid, text, jsonb, boolean) from public, anon, authenticated;

-- ── 3. Trigger từng nguồn ────────────────────────────────────────────────────
create or replace function public._ai_tg_phien_tin()
returns trigger language plpgsql security definer set search_path = public as $$
declare p claude_phien;
begin
  if new.vai <> 'claude' or new.usage is null then return null; end if;
  select * into p from claude_phien where id = new.phien_id;
  perform public._ai_ghi_luot('phien', new.id::text, coalesce(new.updated_at, new.created_at), p.nhan_su_id, p.mon, p.khoi, p.loai, p.id,
                              null, new.usage, true);
  return null;
end $$;
revoke execute on function public._ai_tg_phien_tin() from public, anon, authenticated;
drop trigger if exists trg_ai_phien_tin on public.claude_phien_tin;
create trigger trg_ai_phien_tin after insert or update of usage on public.claude_phien_tin for each row execute function public._ai_tg_phien_tin();

create or replace function public._ai_tg_hoi()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_ns uuid;
begin
  if new.usage is null then return null; end if;
  select tk.nhan_su_id into v_ns from tai_khoan tk where tk.id = new.nguoi;
  perform public._ai_ghi_luot(case tg_table_name when 'troly_hoi_dap' then 'tro_ly' else 'hoi_dap' end, new.id::text,
                              coalesce(new.done_at, new.created_at), v_ns, null, null,
                              case tg_table_name when 'troly_hoi_dap' then 'Trợ lý' else 'Hỏi đáp nhân sự' end, null,
                              case when coalesce(new.model, '') in ('', 'claude-code') then null else regexp_replace(new.model, '^anthropic/', '') end,
                              new.usage, false);   -- trợ lý (OpenRouter) + hỏi đáp (khoá API) đều trả theo token
  return null;
end $$;
revoke execute on function public._ai_tg_hoi() from public, anon, authenticated;
drop trigger if exists trg_ai_luot on public.troly_hoi_dap;
create trigger trg_ai_luot after insert or update of usage on public.troly_hoi_dap for each row execute function public._ai_tg_hoi();
drop trigger if exists trg_ai_luot on public.hoi_dap_nhan_su;
create trigger trg_ai_luot after insert or update of usage on public.hoi_dap_nhan_su for each row execute function public._ai_tg_hoi();

create or replace function public._ai_tg_danh_gia()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_ns uuid;
begin
  if new.usage is null then return null; end if;
  select tk.nhan_su_id into v_ns from tai_khoan tk where tk.id = new.created_by;
  perform public._ai_ghi_luot('danh_gia', new.id::text, coalesce(new.done_at, new.created_at), v_ns, new.mon, null, 'Đánh giá AI', null,
                              nullif(coalesce(new.model, new.model_chon), ''), new.usage, false);
  return null;
end $$;
revoke execute on function public._ai_tg_danh_gia() from public, anon, authenticated;
drop trigger if exists trg_ai_luot on public.danhgia_ai_job;
create trigger trg_ai_luot after insert or update of usage on public.danhgia_ai_job for each row execute function public._ai_tg_danh_gia();

create or replace function public._ai_tg_btvn()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_mon text; v_khoi text;
begin
  if new.tokens_in is null and new.tokens_out is null then return null; end if;
  select tk.nhan_su_id into v_ns from tai_khoan tk where tk.id = new.goi_boi;
  select l.mon, l.khoi into v_mon, v_khoi from buoi_hoc b join lop l on l.id = b.lop_id where b.id = new.buoi_hoc_id;
  perform public._ai_ghi_luot('cham_btvn', new.id::text, new.created_at, v_ns, v_mon, v_khoi, 'Chấm BTVN bằng máy', null, new.model,
                              jsonb_build_object('input_tokens', new.tokens_in, 'output_tokens', new.tokens_out), false);
  return null;
end $$;
revoke execute on function public._ai_tg_btvn() from public, anon, authenticated;
drop trigger if exists trg_ai_luot on public.btvn_ai_lan;
create trigger trg_ai_luot after insert or update of tokens_in, tokens_out on public.btvn_ai_lan for each row execute function public._ai_tg_btvn();

-- ── 4. Tiền của một lượt (lúc đọc) ───────────────────────────────────────────
create or replace function public._ai_usd(l ai_luot_dung, g ai_bang_gia)
returns numeric language sql immutable as $$
  select coalesce(l.cost_cli_usd,
    case when g.model is null then null
         else (l.vao * g.vao + l.ghi_5m * g.ghi_5m + l.ghi_1h * g.ghi_1h + l.doc_cache * g.doc_cache + l.ra * g.ra) / 1e6 end)
$$;
revoke execute on function public._ai_usd(ai_luot_dung, ai_bang_gia) from public, anon, authenticated;

-- ── 5. Dashboard (một lượt gọi) ──────────────────────────────────────────────
create or replace function public.fn_ai_chi_phi(p_tu date, p_den date)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tu timestamptz := (p_tu::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v_den timestamptz := ((p_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v_tg numeric; v_md text; v jsonb;
begin
  if not coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false) then
    raise exception 'Chỉ Giám đốc (admin hệ thống) xem chi phí AI.' using errcode = '42501';
  end if;
  if p_den < p_tu or p_den - p_tu > 400 then raise exception 'Khoảng ngày không hợp lệ (tối đa 400 ngày).'; end if;
  select vnd_moi_usd, model_mac_dinh into v_tg, v_md from ai_cau_hinh where id = 1;

  with l as materialized (
    select a.*, coalesce(a.model, v_md) as model_tinh, (a.model is null) as uoc,
           public._ai_usd(a, g) as usd, (g.model is null and a.cost_cli_usd is null) as chua_gia,
           (a.vao + a.ghi_5m + a.ghi_1h + a.doc_cache + a.ra) as tong_tok,
           coalesce(ns.ho_ten, 'Máy tự chạy') as ten
      from ai_luot_dung a
      left join ai_bang_gia g on g.model = coalesce(a.model, v_md)
      left join nhan_su ns on ns.id = a.nhan_su_id
     where a.at >= v_tu and a.at < v_den
  ),
  -- việc làm ra của phiên Claude (vết lệnh claude_phien_ghi) theo người mở phiên
  ra_viec as (
    select p.nhan_su_id,
           sum(case when g.viec = 'them_cau' then coalesce((g.ket_qua->>'them')::int, 0) else 0 end) as cau_vao_kho,
           sum(case when g.viec = 'phan_dang' then coalesce((g.ket_qua->>'ok')::int, 0) else 0 end) as cau_phan_dang,
           count(*) filter (where g.viec in ('duyet_cau', 'sua_cau', 'kho_rac')) as lenh_sua_kho,
           count(*) filter (where g.viec in ('gan_anh', 'anh_gan')) as anh,
           count(*) filter (where g.viec ~ '^(them_|sua$|chuyen_|sap_xep|xoa_|ghi_noi_dung|hh_bai_|hinh:fn_hl_|gui_phieu)' and g.viec <> 'them_cau') as lenh_ban_do
      from claude_phien_ghi g join claude_phien p on p.id = g.phien_id
     where g.at >= v_tu and g.at < v_den
     group by p.nhan_su_id
  ),
  nguoi as (
    select l.nhan_su_id, l.ten, count(*) as luot, sum(l.usd) as usd, sum(l.tong_tok) as tok,
           sum(l.vao) vao, sum(l.ghi_5m + l.ghi_1h) ghi, sum(l.doc_cache) doc, sum(l.ra) ra,
           bool_or(l.uoc) as co_uoc, bool_or(l.chua_gia) as co_chua_gia
      from l
     group by l.nhan_su_id, l.ten
  ),
  nguoi_kenh as (
    select nhan_su_id, jsonb_object_agg(kenh, usd_k) as kenh
      from (select nhan_su_id, kenh, round(coalesce(sum(usd), 0), 4) usd_k from l group by 1, 2) x group by 1
  )
  select jsonb_build_object(
    'tu', p_tu, 'den', p_den, 'vnd_moi_usd', v_tg, 'model_mac_dinh', v_md, 'luc', now(),
    'tong', (select jsonb_build_object('luot', count(*), 'usd', round(coalesce(sum(usd), 0), 4),
                     'usd_thue_bao', round(coalesce(sum(usd) filter (where thue_bao), 0), 4), 'usd_tra_that', round(coalesce(sum(usd) filter (where not thue_bao), 0), 4),
                     'vao', coalesce(sum(vao), 0), 'ghi', coalesce(sum(ghi_5m + ghi_1h), 0), 'doc', coalesce(sum(doc_cache), 0), 'ra', coalesce(sum(ra), 0),
                     'so_nguoi', count(distinct nhan_su_id), 'luot_uoc', count(*) filter (where uoc), 'luot_chua_gia', count(*) filter (where chua_gia)) from l),
    'theo_nguoi', coalesce((select jsonb_agg(jsonb_build_object(
          'nhan_su_id', n.nhan_su_id, 'ten', n.ten, 'luot', n.luot, 'usd', round(coalesce(n.usd, 0), 4), 'tok', n.tok,
          'vao', n.vao, 'ghi', n.ghi, 'doc', n.doc, 'ra', n.ra, 'co_uoc', n.co_uoc, 'co_chua_gia', n.co_chua_gia,
          'kenh', nk.kenh,
          'cau_vao_kho', coalesce(r.cau_vao_kho, 0), 'cau_phan_dang', coalesce(r.cau_phan_dang, 0), 'lenh_sua_kho', coalesce(r.lenh_sua_kho, 0),
          'anh', coalesce(r.anh, 0), 'lenh_ban_do', coalesce(r.lenh_ban_do, 0),
          'usd_moi_cau', case when coalesce(r.cau_vao_kho, 0) > 0 then round(n.usd / r.cau_vao_kho, 4) end)
        order by n.usd desc nulls last)
      from nguoi n left join nguoi_kenh nk on nk.nhan_su_id is not distinct from n.nhan_su_id
      left join ra_viec r on r.nhan_su_id is not distinct from n.nhan_su_id), '[]'::jsonb),
    'theo_kenh', coalesce((select jsonb_agg(jsonb_build_object('kenh', kenh, 'luot', luot, 'usd', usd, 'tok', tok, 'thue_bao', thue_bao) order by usd desc nulls last)
      from (select kenh, count(*) luot, round(coalesce(sum(usd), 0), 4) usd, sum(tong_tok) tok, bool_and(thue_bao) thue_bao from l group by kenh) x), '[]'::jsonb),
    'theo_model', coalesce((select jsonb_agg(jsonb_build_object('model', model_tinh, 'luot', luot, 'usd', usd, 'tok', tok, 'co_gia', co_gia) order by usd desc nulls last)
      from (select model_tinh, count(*) luot, round(coalesce(sum(usd), 0), 4) usd, sum(tong_tok) tok, bool_and(not chua_gia) co_gia from l group by model_tinh) x), '[]'::jsonb),
    'theo_ngay', coalesce((select jsonb_agg(jsonb_build_object('ngay', ngay, 'luot', luot, 'usd', usd) order by ngay)
      from (select (at at time zone 'Asia/Ho_Chi_Minh')::date ngay, count(*) luot, round(coalesce(sum(usd), 0), 4) usd from l group by 1) x), '[]'::jsonb),
    'theo_loai', coalesce((select jsonb_agg(jsonb_build_object('loai', loai_viec, 'luot', luot, 'usd', usd) order by usd desc nulls last)
      from (select loai_viec, count(*) luot, round(coalesce(sum(usd), 0), 4) usd from l group by 1) x), '[]'::jsonb),
    'top_phien', coalesce((select jsonb_agg(jsonb_build_object('phien_id', x.phien_id, 'tieu_de', p.tieu_de, 'ten', x.ten, 'mon', p.mon, 'khoi', p.khoi, 'loai', p.loai,
                                                               'luot', x.luot, 'usd', x.usd) order by x.usd desc nulls last)
      from (select phien_id, min(ten) ten, count(*) luot, round(coalesce(sum(usd), 0), 4) usd from l where phien_id is not null group by 1 order by 4 desc nulls last limit 15) x
      join claude_phien p on p.id = x.phien_id), '[]'::jsonb)
  ) into v;
  return v;
end $$;
revoke execute on function public.fn_ai_chi_phi(date, date) from public, anon;
grant execute on function public.fn_ai_chi_phi(date, date) to authenticated;

-- ── 6. Chép số cũ một lần ────────────────────────────────────────────────────
insert into ai_luot_dung (kenh, nguon_id, at, nhan_su_id, mon, khoi, loai_viec, phien_id, model, vao, ghi_5m, ghi_1h, doc_cache, ra, cost_cli_usd, thue_bao)
select 'phien', t.id::text, coalesce(t.updated_at, t.created_at), p.nhan_su_id, p.mon, p.khoi, p.loai, p.id, nullif(t.usage->>'model', ''),
       coalesce((t.usage->>'input_tokens')::bigint, 0),
       greatest(coalesce((t.usage->>'cache_creation_input_tokens')::bigint, 0) - coalesce((t.usage->'cache_creation'->>'ephemeral_1h_input_tokens')::bigint, 0), 0),
       coalesce((t.usage->'cache_creation'->>'ephemeral_1h_input_tokens')::bigint, 0),
       coalesce((t.usage->>'cache_read_input_tokens')::bigint, 0), coalesce((t.usage->>'output_tokens')::bigint, 0),
       (t.usage->>'cost_usd')::numeric, true
  from claude_phien_tin t join claude_phien p on p.id = t.phien_id
 where t.vai = 'claude' and t.usage is not null and jsonb_typeof(t.usage) = 'object'
on conflict (kenh, nguon_id) do nothing;

do $$
declare r record;
begin
  for r in select id, nguoi, usage, model, created_at, done_at from troly_hoi_dap where usage is not null loop
    perform public._ai_ghi_luot('tro_ly', r.id::text, coalesce(r.done_at, r.created_at), (select nhan_su_id from tai_khoan where id = r.nguoi), null, null, 'Trợ lý', null,
      case when coalesce(r.model, '') in ('', 'claude-code') then null else regexp_replace(r.model, '^anthropic/', '') end, r.usage, false);
  end loop;
  for r in select id, nguoi, usage, model, created_at, done_at from hoi_dap_nhan_su where usage is not null loop
    perform public._ai_ghi_luot('hoi_dap', r.id::text, coalesce(r.done_at, r.created_at), (select nhan_su_id from tai_khoan where id = r.nguoi), null, null, 'Hỏi đáp nhân sự', null,
      case when coalesce(r.model, '') in ('', 'claude-code') then null else r.model end, r.usage, false);
  end loop;
  for r in select * from danhgia_ai_job where usage is not null loop
    perform public._ai_ghi_luot('danh_gia', r.id::text, coalesce(r.done_at, r.created_at), (select nhan_su_id from tai_khoan where id = r.created_by), r.mon, null, 'Đánh giá AI', null,
      nullif(coalesce(r.model, r.model_chon), ''), r.usage, false);
  end loop;
end $$;
