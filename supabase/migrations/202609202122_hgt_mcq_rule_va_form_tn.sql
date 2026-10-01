-- MCQ FORM cho nhánh Hình giải tích (HGT) — CEO chốt 20/09 (cấp 3 chỉ dùng MCQ cho ET/giáo trình/BTVN,
-- phạm vi Đại + Hình giải tích). BẢNG RIÊNG cho HGT, KHÔNG gộp với dai_mcq_rule/dai_cau_form_tn (CLAUDE.md
-- §1.6: mỗi nhánh tự cấu trúc, bảng riêng). Mirror NGUYÊN cấu trúc dai_mcq_rule/dai_cau_form_tn của migration
-- gốc 202609080230_mcq_form_tn.sql — đúng như comment đã dự trù sẵn ở đó cho `_kho_form_tn_tbl('Toán','hinh_gt')`.

-- ── 1) Bảng rule lỗi (canonical, riêng nhánh HGT) ───────────────────────────────────────────────────────────
create table if not exists hgt_mcq_rule (
  ma          text primary key,
  ten         text not null,
  mo_ta       text not null,
  vi_du       text,
  nhom        text not null check (nhom in ('khai_niem', 'tinh')),
  ap_dung     text[] not null default '{}',
  du_phong    boolean not null default false,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table hgt_mcq_rule enable row level security;
drop policy if exists hgt_mcq_rule_member_all on hgt_mcq_rule;
create policy hgt_mcq_rule_member_all on hgt_mcq_rule
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hgt_mcq_rule to authenticated;

-- Sao y 4 rule "sinh nhiễu từ đáp số kho" (R343-346, engine dùng chung sinhNhieuDapSoThucTe) từ dai_mcq_rule —
-- cùng mã, cùng mô tả, dùng chung tooling/UI hiển thị rule, chỉ khác BẢNG (đúng nhánh HGT).
insert into hgt_mcq_rule (ma, ten, mo_ta, vi_du, nhom, du_phong, active) values
('R343', 'Bài toán thực tế: hoán đổi 2 giá trị / tính gấp đôi',
 'Hoán đổi nhầm 2 đại lượng cần tìm (nếu đáp số có 2 giá trị), hoặc tính gấp đôi giá trị đúng — quên chia đôi ở 1 bước (nếu đáp số chỉ 1 giá trị)',
 'Đúng "90; 60" → nhầm "60; 90"', 'khai_niem', false, true),
('R344', 'Bài toán thực tế: lệch 1 đơn vị ở giá trị thứ nhất',
 'Tính đúng cấu trúc nhưng giá trị đầu tiên lệch 1 đơn vị',
 'Đúng "90; 60" → nhầm "91; 60"', 'tinh', false, true),
('R345', 'Bài toán thực tế: lệch 1 đơn vị ở giá trị thứ nhất, chiều ngược lại',
 'Rule dự phòng — đúng cấu trúc nhưng giá trị đầu tiên lệch 1 đơn vị theo chiều ngược lại với R344',
 'Đúng "90; 60" → nhầm "89; 60"', 'tinh', true, true),
('R346', 'Bài toán thực tế: lệch giá trị ở giá trị còn lại',
 'Đúng cấu trúc nhưng giá trị còn lại (thứ hai, hoặc giá trị duy nhất theo hướng khác nếu chỉ có 1) lệch so với đúng',
 'Đúng "90; 60" → nhầm "90; 61"', 'tinh', false, true);

-- Nối 22 dạng HGT khớp ≥97% sinhNhieuDapSoThucTe (khảo sát 20/09, khối 12 "Hình giải tích") vào R343-346.
update hgt_mcq_rule set ap_dung = ap_dung || '{T312010803,T312010103,T312010702,T312010505,T312010401,T312010202,T312010201,T312010801,T312010504,T312010402,T312010102,T312010602,T312010802,T312010705,T312010603,T312010209,T312010210,T312010205,T312010301,T312010403,T312010107,T312010503}'::text[]
where ma in ('R343','R344','R345','R346');

-- ── 2) Form MCQ của câu HGT ──────────────────────────────────────────────────────────────────────────────────
create table if not exists hgt_cau_form_tn (
  id              uuid primary key default gen_random_uuid(),
  ma_cau          text not null references hgt_cau_hoi(ma_cau),
  lua_chon        jsonb not null,
  dap_an          text not null check (dap_an in ('A', 'B', 'C', 'D')),
  key_gia_tri     text not null,
  nguon           text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  ai_model        text,
  sinh_at         timestamptz not null default now(),
  da_duyet        boolean not null default false,
  duyet_boi       uuid references nhan_su(id),
  duyet_at        timestamptz,
  sua_truoc_duyet boolean not null default false,
  tu_choi_ly_do   text,
  tu_choi_boi     uuid references nhan_su(id),
  xoa_at          timestamptz,
  updated_at      timestamptz not null default now()
);
create unique index if not exists hgt_cau_form_tn_1_hieu_luc on hgt_cau_form_tn (ma_cau) where xoa_at is null;
create index if not exists hgt_cau_form_tn_cho_duyet on hgt_cau_form_tn (da_duyet) where xoa_at is null;

create or replace function public.hgt_cau_form_tn_kiem() returns trigger
language plpgsql as $$
declare v_n int; v_dung int; v_idx int; v_thieu text;
begin
  if jsonb_typeof(new.lua_chon) <> 'array' then raise exception 'lua_chon phải là mảng'; end if;
  v_n := jsonb_array_length(new.lua_chon);
  if v_n <> 4 then raise exception 'lua_chon phải đúng 4 phương án (đang %)', v_n; end if;
  select count(*) into v_dung from jsonb_array_elements(new.lua_chon) e where (e->>'dung')::boolean;
  if v_dung <> 1 then raise exception 'phải đúng 1 phương án dung=true (đang %)', v_dung; end if;
  v_idx := ascii(new.dap_an) - 65;
  if coalesce((new.lua_chon -> v_idx ->> 'dung')::boolean, false) is not true then
    raise exception 'dap_an=% không khớp vị trí phương án dung=true', new.dap_an;
  end if;
  if exists (select 1 from jsonb_array_elements(new.lua_chon) e where coalesce(trim(e->>'text'), '') = '') then
    raise exception 'phương án có text trống';
  end if;
  select string_agg(e->>'rule', ',') into v_thieu
    from jsonb_array_elements(new.lua_chon) e
    where not (e->>'dung')::boolean
      and (e->>'rule' is null or not exists (select 1 from hgt_mcq_rule r where r.ma = e->>'rule'));
  if v_thieu is not null then raise exception 'phương án sai thiếu rule hoặc rule không tồn tại: %', v_thieu; end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists hgt_cau_form_tn_kiem on hgt_cau_form_tn;
create trigger hgt_cau_form_tn_kiem before insert or update on hgt_cau_form_tn
  for each row execute function public.hgt_cau_form_tn_kiem();

alter table hgt_cau_form_tn enable row level security;
drop policy if exists hgt_cau_form_tn_member_all on hgt_cau_form_tn;
create policy hgt_cau_form_tn_member_all on hgt_cau_form_tn
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hgt_cau_form_tn to authenticated;
