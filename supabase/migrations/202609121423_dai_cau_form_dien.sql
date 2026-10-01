-- ============================================================================
-- 202609121423 — dai_cau_form_dien: ĐIỀN Ô cho câu TÍNH TOÁN (Đại) — spec-dien-o.md Phase 2 §3 (mốc D2),
--   cầu nối spec-mcq-tung-phan.md ("trắc nghiệm từng phần"). Form thứ 3 của câu, cạnh TN (dai_cau_form_tn) và tự luận.
-- ----------------------------------------------------------------------------
-- VÌ SAO bảng RIÊNG, không dùng hinh_form_dien: bảng đó khoá theo cach_giai_id/bien_the_id (kho hình không có ma_cau) và ô
--   kiểu "lý do" (AI đề xuất). Đại khoá theo ma_cau, ô kiểu "giá trị" 100% máy (scripts/mcq-dien.mjs) — cùng cấu trúc
--   buoc/o, dispatch qua registry _kho_form_dien_tbl (symmetry §1.6: KHTN/HGT tạo cùng DDL khi cần).
-- Sinh: scripts/mcq-dien.mjs --sinh → --verify → --ghi (da_duyet=false). Chấm: fn_dien_cham (đã có từ 202609081019).
-- Lời giải kho đổi ⇒ form tự thu hồi (kho rác xoa_at, không delete — §2 CLAUDE.md).
-- Snapshot vào bai_test_cau (cột dien/o_rule đã có, nhưng form_dien_id đang FK→hinh_form_dien) — để D3, quyết riêng.

-- ── 1) Bảng form ─────────────────────────────────────────────────────────────────────────────────────────────
create table if not exists dai_cau_form_dien (
  id              uuid primary key default gen_random_uuid(),
  ma_cau          text not null references dai_cau_hoi(ma_cau),
  loi_giai_bam    text not null,            -- md5(loi_giai) lúc sinh: lời giải đổi ⇒ trigger thu hồi
  -- buoc: [{ "k":1, "text":"Số tiền … là:" }, { "k":2, "text":"$125000 \\times 3 + … = ⟦o1⟧$ (đồng)" }, …]  (HS thấy, ⟦oN⟧ = ô)
  buoc            jsonb not null,
  -- o: [{ "id":"o1", "buoc":2, "key":"600000", "key_gia_tri":"600000", "tinh_tu":"125000 \\cdot 3 + …", "dap_an":"C",
  --       "phuong_an":[{ "text":"$600000$","dung":true }, { "text":"$250000$","dung":false,"rule":"R102","duong_sai":"…" }, …] }]
  o               jsonb not null,
  nguon           text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  ai_model        text,                     -- 'may:mcq-dien' (máy sinh, không gọi model)
  sinh_at         timestamptz not null default now(),
  da_duyet        boolean not null default false,
  duyet_boi       uuid references nhan_su(id),
  duyet_at        timestamptz,
  sua_truoc_duyet boolean not null default false,
  tu_choi_boi     uuid references nhan_su(id),
  tu_choi_ly_do   text,
  xoa_at          timestamptz,
  updated_at      timestamptz not null default now()
);
create unique index if not exists dai_cau_form_dien_1_hieu_luc on dai_cau_form_dien (ma_cau) where xoa_at is null;
create index if not exists dai_cau_form_dien_cho_duyet on dai_cau_form_dien (da_duyet) where xoa_at is null;

-- ── 2) Trigger kiểm cấu trúc (DB kiểm lần nữa sau script): 2–4 ô · id oN theo thứ tự · ⟦oN⟧ đúng 1 lần trong buoc ·
--       mỗi ô 4 phương án, đúng 1 dung, dap_an khớp vị trí · phương án sai có rule TỒN TẠI ──────────────────────
create or replace function public.dai_cau_form_dien_kiem() returns trigger language plpgsql as $$
declare v_n int; v_nb int; v_o jsonb; v_pa jsonb; v_dung int; v_idx int; v_thieu text; v_txt text; i int := 0;
begin
  if jsonb_typeof(new.buoc) <> 'array' or jsonb_typeof(new.o) <> 'array' then raise exception 'buoc/o phải là mảng'; end if;
  v_nb := jsonb_array_length(new.buoc);
  v_n := jsonb_array_length(new.o);
  if v_n < 2 or v_n > 4 then raise exception 'phải 2–4 ô (đang %)', v_n; end if;
  select string_agg(b->>'text', E'\n') into v_txt from jsonb_array_elements(new.buoc) b;
  for v_o in select * from jsonb_array_elements(new.o) loop
    i := i + 1;
    if v_o->>'id' <> 'o' || i then raise exception 'ô %: id phải o%', i, i; end if;
    if coalesce((v_o->>'buoc')::int, 0) < 1 or (v_o->>'buoc')::int > v_nb then raise exception 'ô %: buoc ngoài phạm vi', i; end if;
    if coalesce(v_o->>'key', '') = '' or coalesce(v_o->>'key_gia_tri', '') = '' then raise exception 'ô %: thiếu key/key_gia_tri', i; end if;
    if (length(v_txt) - length(replace(v_txt, '⟦o' || i || '⟧', ''))) / length('⟦o' || i || '⟧') <> 1
      then raise exception 'ô %: ⟦o%⟧ phải xuất hiện đúng 1 lần trong buoc', i, i; end if;
    if position('⟦o' || i || '⟧' in new.buoc -> ((v_o->>'buoc')::int - 1) ->> 'text') = 0
      then raise exception 'ô %: bước % không chứa ⟦o%⟧', i, v_o->>'buoc', i; end if;
    v_pa := v_o->'phuong_an';
    if jsonb_typeof(v_pa) <> 'array' or jsonb_array_length(v_pa) <> 4 then raise exception 'ô %: phải 4 phương án', i; end if;
    select count(*) into v_dung from jsonb_array_elements(v_pa) p where (p->>'dung')::boolean;
    if v_dung <> 1 then raise exception 'ô %: phải đúng 1 phương án đúng', i; end if;
    v_idx := ascii(v_o->>'dap_an') - 65;
    if v_idx < 0 or v_idx > 3 or coalesce((v_pa -> v_idx ->> 'dung')::boolean, false) is not true then raise exception 'ô %: dap_an không khớp vị trí', i; end if;
    if exists (select 1 from jsonb_array_elements(v_pa) p where coalesce(trim(p->>'text'), '') = '') then raise exception 'ô %: phương án có text trống', i; end if;
    select string_agg(p->>'rule', ',') into v_thieu from jsonb_array_elements(v_pa) p
      where not (p->>'dung')::boolean and (p->>'rule' is null or not exists (select 1 from dai_mcq_rule r where r.ma = p->>'rule'));
    if v_thieu is not null then raise exception 'ô %: phương án sai thiếu rule hoặc rule không tồn tại: %', i, v_thieu; end if;
  end loop;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists dai_cau_form_dien_kiem on dai_cau_form_dien;
create trigger dai_cau_form_dien_kiem before insert or update on dai_cau_form_dien for each row execute function public.dai_cau_form_dien_kiem();

-- ── 3) Lời giải/đáp số kho đổi ⇒ thu hồi form điền (kho rác) ──────────────────────────────────────────────────
create or replace function public.dai_cau_form_dien_thu_hoi() returns trigger language plpgsql as $$
begin
  if new.loi_giai is distinct from old.loi_giai or new.dap_an is distinct from old.dap_an then
    update dai_cau_form_dien set xoa_at = now(), tu_choi_ly_do = coalesce(tu_choi_ly_do, '') || ' [thu hồi: lời giải/đáp số kho đổi]'
      where ma_cau = new.ma_cau and xoa_at is null and loi_giai_bam <> md5(coalesce(new.loi_giai, ''));
  end if;
  return new;
end $$;
drop trigger if exists dai_cau_hoi_thu_hoi_dien on dai_cau_hoi;
create trigger dai_cau_hoi_thu_hoi_dien after update of loi_giai, dap_an on dai_cau_hoi for each row execute function public.dai_cau_form_dien_thu_hoi();

-- ── 4) Quyền: staff-only như dai_cau_form_tn; HS chỉ thấy snapshot ──────────────────────────────────────────
alter table dai_cau_form_dien enable row level security;
drop policy if exists dai_cau_form_dien_member_all on dai_cau_form_dien;
create policy dai_cau_form_dien_member_all on dai_cau_form_dien for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on dai_cau_form_dien to authenticated;

-- Registry (cạnh _kho_form_tn_tbl). Bảng khtn_/hgt_ CHƯA tồn tại — gọi tới là execute format(%I) nổ to, không im lặng.
create or replace function public._kho_form_dien_tbl(p_mon text, p_nhanh text default null)
returns text language sql immutable as $$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_dien'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_dien'
              else 'dai_cau_form_dien' end
$$;

-- ── 5) Rule lỗi mới cho bài TOÁN THỰC TẾ (R100–R104; R89–R99 đã bị luồng khối 8 chiếm 14:16 12/09 nên nhảy sang 3 chữ số; LƯU Ý select max(ma) trả R99 vì so chuỗi — dùng order by length(ma) desc, ma desc) — idempotent ────────────────
-- Kho rule cũ xây cho phân số/dấu/luỹ thừa; bước "a − b", "a : b", "a · p%" của bài thực tế chỉ ra R24/R05 (1–2 đường sai)
-- nên thêm 5 đường sai THẬT của HS làm toán đố. Tính ở scripts/mcq-dien.mjs (ruleThem), không sửa ev() của mcq-auto.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R100','Phần trăm quên chia 100','Tính p% của a thành a·p (quên :100)','$200\cdot30\%=6000$','khai_niem','{T107010205,T106020304}',false),
('R101','Lấy nhầm phần trăm bù','Hỏi p% (hoặc "còn lại sau giảm p%") mà lấy (100−p)% thay vì p% (hoặc ngược lại)','$125000\cdot(100\%-20\%)$ tính thành $125000\cdot20\%=25000$','khai_niem','{T107010205,T106020304}',false),
('R102','Nhầm cộng thành trừ / trừ thành cộng','Đọc đề "còn lại"/"tổng" sai nên làm ngược phép tính ở bước ngoài cùng','$750000-600000$ tính thành $750000+600000$','khai_niem','{T106020304,T107010205}',false),
('R103','Lệch một chữ số 0','Đặt tính với số tròn nghìn lệch một hàng: kết quả gấp 10 hoặc bằng 1/10','$150000:5=3000$','tinh','{T106020304,T107010205}',true),
('R104','Quên nhân với số lượng','Hạng tử "số lượng × đơn giá" mà bỏ quên số lượng, chỉ lấy đơn giá','$2\cdot45000+35000$ tính thành $45000+35000$','khai_niem','{T106020304,T107010205}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
