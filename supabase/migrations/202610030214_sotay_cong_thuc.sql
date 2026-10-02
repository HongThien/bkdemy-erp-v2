-- ============================================================================
-- 202610030214 — SỔ TAY CÔNG THỨC: bảng thẻ + chủ đề + hình + nhật ký, RPC tìm cho app HS
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-so-tay-cong-thuc.md, CEO 03/10):
--   HS quên công thức ⇒ gõ tên trong ô Sổ tay ⇒ ra thẻ công thức (nhãn "Công thức") TRƯỚC, dạng bài
--   (nhãn "Lý thuyết", sổ tay cũ) SAU. Staff sửa/duyệt/gắn hình trên ERP (lá `sotay`, cùng khuôn
--   Bản đồ kiến thức nhưng gọn). Đơn vị = 1 THẺ công thức, KHÁC sổ tay cũ (đơn vị = 1 dạng).
--
-- THIẾT KẾ:
--   · Mọi bảng có `mon` (+ `khoi`) — §1.6 dữ liệu học tập phải mang nhãn môn. Đợt 1 chỉ Toán 12.
--   · Xoá = kho rác `xoa_at` (thẻ được trỏ bằng TEXT từ nhật ký/app — §2 cấm xoá cứng bên được trỏ).
--   · Trạng thái `cho_duyet` → `da_duyet` | `tra_ve`. Sửa NỘI DUNG một thẻ đã duyệt/bị trả về ⇒ trigger tự
--     đưa về `cho_duyet` (đổi chữ mà giữ dấu "đã duyệt" = HS thấy bản chưa ai kiểm). App không phải nhớ.
--   · Mọi đổi state/nội dung ⇒ TRIGGER đẻ dòng `sotay_ct_lich_su` (actor + lúc + bản cũ) — §4, app không tự ghi log.
--   · Người = `nhan_su.id` qua `current_nhan_su_id()` (khuôn duyệt của kho: `duyet_boi` là nhân sự, không phải auth uid).
--   · Quyền staff: đọc = `co_chuc_nang('sotay')`, ghi = `co_quyen_ghi('sotay')` (gán theo vai trò ở màn Phân quyền;
--     admin hệ thống tự qua). HS KHÔNG đọc bảng thẳng — đi RPC `hs_sotay_tim_ct` (security definer), chỉ thấy thẻ đã duyệt.
--   · Hình: 1 dòng `sotay_ct_hinh` = 1 hình CẦN có (mô tả để vẽ); `url` null = chưa vẽ (giống `file_url` của lý thuyết dạng).
--     Nhiều thẻ dùng chung 1 hình.
--   · `hs_sotay_tim_ct` viết SQL TĨNH (không `format()`) — tránh lại bẫy `%` trần 20/09 (mig 202609201056).
--     Cùng luật khớp với `hs_sotay_tim` (mig 202609201203): bỏ dấu, AND từng tiếng, tiếng cuối là tiền tố, các tiếng
--     trước phải trọn từ, lọc input chỉ còn [a-z0-9]. Khớp trên tên + TÊN KHÁC + tên chủ đề.
--   · `hs_sotay_tim` (lý thuyết dạng) GIỮ NGUYÊN — app gọi 2 RPC song song, công thức xếp trước.
--
-- MẤT GÌ: không. Chỉ tạo bảng/hàm/trigger/policy MỚI. Không đụng bảng/hàm có sẵn.
-- ============================================================================

-- ── Chủ đề (thứ tự hiển thị trong ERP / app) ────────────────────────────────
create table public.sotay_ct_chu_de (
  mon     text not null check (mon in ('Toán', 'KHTN', 'Tiếng Anh', 'Văn', 'TSA')),
  khoi    text not null,
  ma      text not null,
  ten     text not null check (btrim(ten) <> ''),
  thu_tu  smallint not null,
  primary key (mon, khoi, ma)
);

-- ── Hình cần có ────────────────────────────────────────────────────────────
create table public.sotay_ct_hinh (
  mon          text not null,
  khoi         text not null,
  ma           text not null,
  ten          text not null check (btrim(ten) <> ''),
  mo_ta        text not null check (btrim(mo_ta) <> ''),   -- cần vẽ gì (để người vẽ đọc)
  url          text,                                        -- null = CHƯA VẼ
  cap_nhat_at  timestamptz not null default now(),
  cap_nhat_boi uuid references public.nhan_su(id),
  primary key (mon, khoi, ma),
  check (mon in ('Toán', 'KHTN', 'Tiếng Anh', 'Văn', 'TSA'))
);

-- ── Thẻ công thức ──────────────────────────────────────────────────────────
create table public.sotay_cong_thuc (
  ma            text primary key,                -- vd CT12-HS-01; để trống khi thêm mới ⇒ trigger tự cấp
  mon           text not null,
  khoi          text not null,
  chu_de        text not null,
  thu_tu        smallint not null default 0,     -- thứ tự trong chủ đề; 0 khi thêm mới ⇒ trigger cấp cuối
  ten           text not null check (btrim(ten) <> ''),
  ten_khac      text[] not null default '{}',    -- mọi tên HS có thể gõ — tìm kiếm sống nhờ cột này
  noi_dung      text not null check (btrim(noi_dung) <> ''),   -- chữ + $LaTeX$, khuôn MathText
  luu_y         text,
  cau_nho       text,
  hinh          text,                            -- mã hình trong sotay_ct_hinh; null = thẻ không cần hình
  nguon         text[] not null default '{}',    -- 'TD:12' = quyển TD trang 12 · 'BK' = BK tự soạn
  ct2018        text not null default 'co' check (ct2018 in ('co', 'nghi_van')),
  ghi_chu_kiem  text,                            -- chỗ nguồn in sai đã sửa khi chép — người duyệt đọc trước
  trang_thai    text not null default 'cho_duyet' check (trang_thai in ('cho_duyet', 'da_duyet', 'tra_ve')),
  ly_do_tra_ve  text,
  xet_boi       uuid references public.nhan_su(id),   -- người DUYỆT hoặc TRẢ VỀ gần nhất (null khi đang chờ)
  xet_at        timestamptz,
  xoa_at        timestamptz,                     -- kho rác
  tao_at        timestamptz not null default now(),
  cap_nhat_at   timestamptz not null default now(),
  cap_nhat_boi  uuid references public.nhan_su(id),
  foreign key (mon, khoi, chu_de) references public.sotay_ct_chu_de (mon, khoi, ma),
  foreign key (mon, khoi, hinh)   references public.sotay_ct_hinh (mon, khoi, ma),
  check (trang_thai <> 'tra_ve' or btrim(coalesce(ly_do_tra_ve, '')) <> '')
);
create index sotay_cong_thuc_mon_khoi_idx on public.sotay_cong_thuc (mon, khoi, chu_de, thu_tu);

-- ── Nhật ký (trigger ghi, app không ghi) ───────────────────────────────────
create table public.sotay_ct_lich_su (
  id              bigint generated always as identity primary key,
  ma_the          text not null references public.sotay_cong_thuc(ma),
  hanh_dong       text not null check (hanh_dong in ('tao', 'sua', 'duyet', 'tra_ve', 'bo_duyet', 'xoa', 'khoi_phuc')),
  trang_thai_cu   text,          -- null khi 'tao' (không áp dụng)
  trang_thai_moi  text not null,
  ban_cu          jsonb,         -- nội dung TRƯỚC khi sửa; null khi 'tao'
  ly_do           text,
  actor           uuid,          -- nhan_su.id; null = máy (migration nạp)
  at              timestamptz not null default now()
);
create index sotay_ct_lich_su_the_idx on public.sotay_ct_lich_su (ma_the, at desc);

-- ── Trigger: cấp mã/thứ tự khi thêm, tự hạ "đã duyệt" khi sửa nội dung, đóng dấu người xét ──
create or replace function public._sotay_ct_truoc_ghi()
returns trigger language plpgsql set search_path = public as $$
declare
  v_doi boolean;
  v_n   integer;
begin
  if tg_op = 'INSERT' then
    if new.thu_tu is null or new.thu_tu = 0 then
      select coalesce(max(thu_tu), 0) + 1 into new.thu_tu
      from sotay_cong_thuc where mon = new.mon and khoi = new.khoi and chu_de = new.chu_de;
    end if;
    if new.ma is null or btrim(new.ma) = '' then
      -- CT<khối>-<chủ đề>-<nn>; nn = số lớn nhất đã dùng (kể cả thẻ trong kho rác — mã đã xoá KHÔNG cấp lại) + 1.
      select coalesce(max(nullif(regexp_replace(ma, '^.*-', ''), '')::int), 0) + 1 into v_n
      from sotay_cong_thuc
      where mon = new.mon and khoi = new.khoi and chu_de = new.chu_de and ma ~ '-[0-9]+$';
      new.ma := 'CT' || new.khoi || '-' || new.chu_de || '-' || lpad(v_n::text, 2, '0');
    end if;
    new.cap_nhat_boi := coalesce(new.cap_nhat_boi, current_nhan_su_id());
    return new;
  end if;

  -- UPDATE
  new.cap_nhat_at := now();
  new.cap_nhat_boi := current_nhan_su_id();
  v_doi := (new.ten, new.ten_khac, new.noi_dung, new.luu_y, new.cau_nho, new.hinh, new.chu_de, new.ct2018)
           is distinct from (old.ten, old.ten_khac, old.noi_dung, old.luu_y, old.cau_nho, old.hinh, old.chu_de, old.ct2018);
  -- Sửa nội dung mà KHÔNG đồng thời đổi trạng thái ⇒ thẻ đã duyệt / bị trả về quay lại chờ duyệt.
  if v_doi and new.trang_thai = old.trang_thai and old.trang_thai in ('da_duyet', 'tra_ve') then
    new.trang_thai := 'cho_duyet';
  end if;
  if new.trang_thai is distinct from old.trang_thai then
    if new.trang_thai = 'cho_duyet' then
      new.xet_boi := null; new.xet_at := null; new.ly_do_tra_ve := null;
    else
      new.xet_boi := current_nhan_su_id(); new.xet_at := now();
      if new.trang_thai = 'da_duyet' then new.ly_do_tra_ve := null; end if;
    end if;
  end if;
  return new;
end $$;

create trigger sotay_cong_thuc_truoc_ghi
  before insert or update on public.sotay_cong_thuc
  for each row execute function public._sotay_ct_truoc_ghi();

create or replace function public._sotay_ct_ghi_lich_su()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_hd  text;
  v_doi boolean;
begin
  if tg_op = 'INSERT' then
    insert into sotay_ct_lich_su (ma_the, hanh_dong, trang_thai_cu, trang_thai_moi, ban_cu, actor)
    values (new.ma, 'tao', null, new.trang_thai, null, current_nhan_su_id());
    return null;
  end if;
  v_doi := (new.ten, new.ten_khac, new.noi_dung, new.luu_y, new.cau_nho, new.hinh, new.chu_de, new.ct2018)
           is distinct from (old.ten, old.ten_khac, old.noi_dung, old.luu_y, old.cau_nho, old.hinh, old.chu_de, old.ct2018);
  v_hd := case
    when old.xoa_at is null and new.xoa_at is not null then 'xoa'
    when old.xoa_at is not null and new.xoa_at is null then 'khoi_phuc'
    when v_doi then 'sua'
    when new.trang_thai is distinct from old.trang_thai then
      case new.trang_thai when 'da_duyet' then 'duyet' when 'tra_ve' then 'tra_ve' else 'bo_duyet' end
    else null end;
  if v_hd is null then return null; end if;   -- đổi cột phụ (thu_tu…) không đáng một dòng nhật ký
  insert into sotay_ct_lich_su (ma_the, hanh_dong, trang_thai_cu, trang_thai_moi, ban_cu, ly_do, actor)
  values (new.ma, v_hd, old.trang_thai, new.trang_thai,
          case when v_doi then jsonb_build_object('ten', old.ten, 'ten_khac', old.ten_khac, 'noi_dung', old.noi_dung,
               'luu_y', old.luu_y, 'cau_nho', old.cau_nho, 'hinh', old.hinh, 'chu_de', old.chu_de, 'ct2018', old.ct2018) end,
          case when v_hd = 'tra_ve' then new.ly_do_tra_ve end,
          current_nhan_su_id());
  return null;
end $$;

create trigger sotay_cong_thuc_lich_su
  after insert or update on public.sotay_cong_thuc
  for each row execute function public._sotay_ct_ghi_lich_su();

create or replace function public._sotay_ct_hinh_truoc_sua()
returns trigger language plpgsql set search_path = public as $$
begin
  new.cap_nhat_at := now();
  new.cap_nhat_boi := current_nhan_su_id();
  return new;
end $$;

create trigger sotay_ct_hinh_truoc_sua
  before update on public.sotay_ct_hinh
  for each row execute function public._sotay_ct_hinh_truoc_sua();

-- ── RLS: staff theo quyền lá `sotay`. Không policy delete (xoá = kho rác). ──
alter table public.sotay_ct_chu_de  enable row level security;
alter table public.sotay_ct_hinh    enable row level security;
alter table public.sotay_cong_thuc  enable row level security;
alter table public.sotay_ct_lich_su enable row level security;

create policy sotay_ct_chu_de_doc on public.sotay_ct_chu_de for select to authenticated using (public.co_chuc_nang('sotay'));
create policy sotay_ct_chu_de_ghi on public.sotay_ct_chu_de for insert to authenticated with check (public.co_quyen_ghi('sotay'));
create policy sotay_ct_chu_de_sua on public.sotay_ct_chu_de for update to authenticated using (public.co_quyen_ghi('sotay')) with check (public.co_quyen_ghi('sotay'));

create policy sotay_ct_hinh_doc on public.sotay_ct_hinh for select to authenticated using (public.co_chuc_nang('sotay'));
create policy sotay_ct_hinh_ghi on public.sotay_ct_hinh for insert to authenticated with check (public.co_quyen_ghi('sotay'));
create policy sotay_ct_hinh_sua on public.sotay_ct_hinh for update to authenticated using (public.co_quyen_ghi('sotay')) with check (public.co_quyen_ghi('sotay'));

create policy sotay_cong_thuc_doc on public.sotay_cong_thuc for select to authenticated using (public.co_chuc_nang('sotay'));
create policy sotay_cong_thuc_ghi on public.sotay_cong_thuc for insert to authenticated with check (public.co_quyen_ghi('sotay'));
create policy sotay_cong_thuc_sua on public.sotay_cong_thuc for update to authenticated using (public.co_quyen_ghi('sotay')) with check (public.co_quyen_ghi('sotay'));

-- Nhật ký: chỉ đọc (trigger security definer ghi).
create policy sotay_ct_lich_su_doc on public.sotay_ct_lich_su for select to authenticated using (public.co_chuc_nang('sotay'));

-- Bảng do claude_build tạo được default privileges cấp cả anon — RLS chặn rồi, nhưng thu hẹp luôn cho sạch.
revoke all on public.sotay_ct_chu_de, public.sotay_ct_hinh, public.sotay_cong_thuc, public.sotay_ct_lich_su from anon;
revoke insert, update, delete on public.sotay_ct_lich_su from authenticated;
revoke delete on public.sotay_ct_chu_de, public.sotay_ct_hinh, public.sotay_cong_thuc from authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- hs_sotay_tim_ct — tìm THẺ CÔNG THỨC đã duyệt (app HS). Trả jsonb mảng thẻ đủ nội dung để mở luôn,
-- không cần RPC thứ hai (đợt 1 vài chục thẻ/khối).
-- Điểm: 100 trùng tên · 90 trùng 1 tên khác · 60 tên bắt đầu bằng từ khoá · 50 tên khác chứa · 40 tên chứa · 10 còn lại.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.hs_sotay_tim_ct(
  p_tu_khoa text, p_mon text default 'Toán', p_khoi text default null, p_limit integer default 20)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_q     text := public.fn_bo_dau(btrim(coalesce(p_tu_khoa, '')));
  v_toks  text[];
  v_pats  text[] := '{}';
  v_n     integer;
  v_i     integer;
  v_khoi  text := nullif(btrim(coalesce(p_khoi, '')), '');
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out   jsonb;
begin
  -- = `_sotay_duoc_doc()`, viết thẳng ra: helper đó thuộc owner `postgres` và đã bị revoke khỏi public
  -- (mig 202609182334) ⇒ hàm này (owner claude_build, security definer) gọi nó là "permission denied".
  if not (public.my_hoc_sinh_id() is not null or public.la_thanh_vien()) then
    raise exception 'Không có quyền đọc sổ tay.';
  end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

  v_toks := array(
    select regexp_replace(x, '[^a-z0-9]', '', 'g')
    from unnest(regexp_split_to_array(v_q, '\s+')) x
    where regexp_replace(x, '[^a-z0-9]', '', 'g') <> ''
  );
  v_n := coalesce(array_length(v_toks, 1), 0);
  if v_n = 0 then return '[]'::jsonb; end if;
  for v_i in 1 .. v_n loop
    v_pats := v_pats || (case when v_i < v_n then '\m' || v_toks[v_i] || '\M' else '\m' || v_toks[v_i] end);
  end loop;

  with d as (
    select c.ma, c.ten, c.khoi, c.noi_dung, c.luu_y, c.cau_nho, c.thu_tu,
           cd.ten as ten_chu_de, cd.thu_tu as thu_tu_cd, h.url as hinh_url,
           public.fn_bo_dau(c.ten) as t_ten,
           public.fn_bo_dau(array_to_string(c.ten_khac, ' | ')) as t_khac,
           public.fn_bo_dau(c.ten || ' ' || array_to_string(c.ten_khac, ' ') || ' ' || cd.ten) as hay,
           c.ten_khac
    from sotay_cong_thuc c
    join sotay_ct_chu_de cd on cd.mon = c.mon and cd.khoi = c.khoi and cd.ma = c.chu_de
    left join sotay_ct_hinh h on h.mon = c.mon and h.khoi = c.khoi and h.ma = c.hinh
    where c.trang_thai = 'da_duyet' and c.xoa_at is null
      and c.mon = p_mon and (v_khoi is null or c.khoi = v_khoi)
  ), m as (
    select d.*,
      (case when d.t_ten = v_q then 100
            when exists (select 1 from unnest(d.ten_khac) k where public.fn_bo_dau(k) = v_q) then 90
            when d.t_ten like v_q || '%' then 60
            when d.t_khac like '%' || v_q || '%' then 50
            when d.t_ten like '%' || v_q || '%' then 40
            else 10 end) as diem
    from d where d.hay ~ all(v_pats)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'ma', ma, 'ten', ten, 'khoi', khoi, 'ten_chu_de', ten_chu_de,
      'noi_dung', noi_dung, 'luu_y', luu_y, 'cau_nho', cau_nho, 'hinh_url', hinh_url
    ) order by diem desc, thu_tu_cd, thu_tu), '[]'::jsonb)
  into v_out
  from (select * from m order by diem desc, thu_tu_cd, thu_tu limit v_limit) z;

  return v_out;
end $$;

-- Quyền: bài học 18/09 — owner claude_build vẫn cấp anon tường minh qua default privileges ⇒ revoke anon RIÊNG.
revoke all on function public.hs_sotay_tim_ct(text, text, text, integer) from public;
revoke all on function public.hs_sotay_tim_ct(text, text, text, integer) from anon;
grant execute on function public.hs_sotay_tim_ct(text, text, text, integer) to authenticated;
revoke all on function public._sotay_ct_truoc_ghi() from public, anon;
revoke all on function public._sotay_ct_ghi_lich_su() from public, anon;
revoke all on function public._sotay_ct_hinh_truoc_sua() from public, anon;
