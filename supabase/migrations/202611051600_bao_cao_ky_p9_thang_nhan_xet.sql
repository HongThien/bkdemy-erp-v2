-- ============================================================================
-- 202611051600 — bao_cao_ky_p9_thang_nhan_xet
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 (spec-bao-cao-ky.md §D).
--   (1) Nhận xét GV = chọn theo THANG: 4 mục to · 9 mục nhỏ · 3 mức Tốt/Ổn/Chưa tốt, mỗi mức nhiều LOẠI (1 câu cho PH) + "Chưa đủ quan sát"
--       + ô "nhận xét thêm" (cột nhan_xet cũ). Danh mục sửa THẲNG TRÊN ERP (admin), không phụ thuộc Claude.
--   (2) 🤖 Gợi ý mức từ số liệu cho 3 mục (Về nhà · Cẩn thận · Tiến bộ về điểm) — ngưỡng lưu ở danh mục; GV duyệt.
--   (3) Gợi ý điểm dự đoán + sai số (bội 0,25; luật đo backtest T10 — §D) — GV duyệt.
--   (4) Kế hoạch cải thiện: danh mục phương án mẫu theo mục nhỏ, GV tích chọn + viết thêm (cột ke_hoach cũ).
--   Công bố cần: điểm + sai số + mọi mục nhỏ đã chọn (thay "điểm + sai số + nhận xét").
--
-- Mã gốc: NXM### (mục) · NXL#### (loại) · KHM### (phương án) — cấp lúc INSERT từ sequence, trigger cấm đổi. Xoá = kho rác xoa_at
-- (báo cáo lưu MÃ trong nx_chon/kh_chon ⇒ cấm xoá cứng; đã công bố thì chữ nằm trong snapshot).
-- MẤT GÌ (Luật xoá): không — thêm bảng/cột, thay thân hàm. Chưa báo cáo nào (bao_cao_ph_ky 0 dòng lúc viết).
-- ============================================================================

-- ── 1. Danh mục ──────────────────────────────────────────────────────────────
create sequence public.bc_ky_nx_muc_seq;
create sequence public.bc_ky_nx_lua_chon_seq;
create sequence public.bc_ky_kh_mau_seq;

create table public.bc_ky_nx_muc (
  ma          text primary key default 'NXM' || lpad(nextval('public.bc_ky_nx_muc_seq')::text, 3, '0'),
  cha         text references public.bc_ky_nx_muc(ma),          -- NULL = mục TO (không áp dụng cha); có = mục nhỏ
  ten         text not null check (btrim(ten) <> ''),
  thu_tu      int not null default 0,
  goi_y       text check (goi_y in ('btvn', 'can_than', 'tien_bo_diem')),   -- NULL = GV tự chọn, không gợi ý
  nguong_tot      numeric,   -- btvn: % ≥ · can_than: sai số ≤ · tien_bo_diem: chênh tăng ≥
  nguong_chua_tot numeric,   -- btvn: % < · can_than: sai số ≥ · tien_bo_diem: chênh tăng ≤ (số âm)
  xoa_at      timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid default public.jwt_uid(),
  check (goi_y is null or cha is not null),
  check (goi_y is null or (nguong_tot is not null and nguong_chua_tot is not null))
);
create table public.bc_ky_nx_lua_chon (
  ma          text primary key default 'NXL' || lpad(nextval('public.bc_ky_nx_lua_chon_seq')::text, 4, '0'),
  muc_ma      text not null references public.bc_ky_nx_muc(ma),
  muc_do      text not null check (muc_do in ('tot', 'on', 'chua_tot')),
  noi_dung    text not null check (btrim(noi_dung) <> ''),
  -- khoá để gợi ý chọn đúng LOẠI (mục 🤖): btvn ⇒ khong_lam/nop_muon/khong_nghiem_tuc · tien_bo_diem ⇒ top/that_thuong
  khoa_goi_y  text check (khoa_goi_y in ('top', 'that_thuong', 'khong_lam', 'nop_muon', 'khong_nghiem_tuc')),
  thu_tu      int not null default 0,
  xoa_at      timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid default public.jwt_uid()
);
create table public.bc_ky_kh_mau (
  ma          text primary key default 'KHM' || lpad(nextval('public.bc_ky_kh_mau_seq')::text, 3, '0'),
  muc_ma      text references public.bc_ky_nx_muc(ma),   -- mục nhỏ liên quan (NULL = phương án chung, không gắn mục)
  noi_dung    text not null check (btrim(noi_dung) <> ''),
  thu_tu      int not null default 0,
  xoa_at      timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid default public.jwt_uid()
);
create index on public.bc_ky_nx_lua_chon (muc_ma);
create index on public.bc_ky_kh_mau (muc_ma);

-- Mã gốc bất biến + đúng tầng (mục nhỏ nằm dưới mục to; loại / phương án gắn mục nhỏ)
create or replace function public._bc_ky_dm_kiem() returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.ma is distinct from old.ma then raise exception 'Mã gốc % không được đổi.', old.ma; end if;
  new.updated_at := now();
  new.updated_by := coalesce(public.jwt_uid(), new.updated_by);
  if tg_table_name = 'bc_ky_nx_muc' then
    if new.cha is not null and (new.cha = new.ma or exists (select 1 from bc_ky_nx_muc m where m.ma = new.cha and m.cha is not null)) then
      raise exception 'Mục cha phải là mục TO (chỉ 2 tầng).';
    end if;
    if tg_op = 'UPDATE' and new.cha is null and old.cha is not null then raise exception 'Mục nhỏ không đổi thành mục to.'; end if;
    if tg_op = 'UPDATE' and new.cha is not null and old.cha is null then raise exception 'Mục to không đổi thành mục nhỏ.'; end if;
  elsif new.muc_ma is not null and not exists (select 1 from bc_ky_nx_muc m where m.ma = new.muc_ma and m.cha is not null) then
    raise exception 'Phải gắn vào MỤC NHỎ.';
  end if;
  return new;
end $$;
create trigger trg_bc_ky_nx_muc_kiem before insert or update on public.bc_ky_nx_muc for each row execute function public._bc_ky_dm_kiem();
create trigger trg_bc_ky_nx_lua_chon_kiem before insert or update on public.bc_ky_nx_lua_chon for each row execute function public._bc_ky_dm_kiem();
create trigger trg_bc_ky_kh_mau_kiem before insert or update on public.bc_ky_kh_mau for each row execute function public._bc_ky_dm_kiem();

-- Lịch sử sửa danh mục (trigger ⇒ app không phải tự nhớ ghi)
create table public.bc_ky_dm_log (
  id      bigserial primary key,
  bang    text not null,
  ma      text not null,
  hanh_dong text not null check (hanh_dong in ('them', 'sua')),
  cu      jsonb,
  moi     jsonb,
  actor   uuid default public.jwt_uid(),
  at      timestamptz not null default now()
);
create or replace function public._bc_ky_dm_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into bc_ky_dm_log (bang, ma, hanh_dong, cu, moi)
  values (tg_table_name, new.ma, case tg_op when 'INSERT' then 'them' else 'sua' end,
          case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new));
  return null;
end $$;
create trigger trg_bc_ky_nx_muc_log after insert or update on public.bc_ky_nx_muc for each row execute function public._bc_ky_dm_ghi_log();
create trigger trg_bc_ky_nx_lua_chon_log after insert or update on public.bc_ky_nx_lua_chon for each row execute function public._bc_ky_dm_ghi_log();
create trigger trg_bc_ky_kh_mau_log after insert or update on public.bc_ky_kh_mau for each row execute function public._bc_ky_dm_ghi_log();

-- RLS: nhân sự đọc; chỉ admin thêm/sửa; không ai xoá cứng (không grant delete)
alter table public.bc_ky_nx_muc enable row level security;
alter table public.bc_ky_nx_lua_chon enable row level security;
alter table public.bc_ky_kh_mau enable row level security;
alter table public.bc_ky_dm_log enable row level security;
create policy bc_ky_nx_muc_doc on public.bc_ky_nx_muc for select to authenticated using ((select public.la_thanh_vien()));
create policy bc_ky_nx_muc_them on public.bc_ky_nx_muc for insert to authenticated with check ((select public._bc_ky_la_admin()));
create policy bc_ky_nx_muc_sua on public.bc_ky_nx_muc for update to authenticated using ((select public._bc_ky_la_admin())) with check ((select public._bc_ky_la_admin()));
create policy bc_ky_nx_lua_chon_doc on public.bc_ky_nx_lua_chon for select to authenticated using ((select public.la_thanh_vien()));
create policy bc_ky_nx_lua_chon_them on public.bc_ky_nx_lua_chon for insert to authenticated with check ((select public._bc_ky_la_admin()));
create policy bc_ky_nx_lua_chon_sua on public.bc_ky_nx_lua_chon for update to authenticated using ((select public._bc_ky_la_admin())) with check ((select public._bc_ky_la_admin()));
create policy bc_ky_kh_mau_doc on public.bc_ky_kh_mau for select to authenticated using ((select public.la_thanh_vien()));
create policy bc_ky_kh_mau_them on public.bc_ky_kh_mau for insert to authenticated with check ((select public._bc_ky_la_admin()));
create policy bc_ky_kh_mau_sua on public.bc_ky_kh_mau for update to authenticated using ((select public._bc_ky_la_admin())) with check ((select public._bc_ky_la_admin()));
create policy bc_ky_dm_log_doc on public.bc_ky_dm_log for select to authenticated using ((select public.la_thanh_vien()));
grant select, insert, update on public.bc_ky_nx_muc, public.bc_ky_nx_lua_chon, public.bc_ky_kh_mau to authenticated;
grant select on public.bc_ky_dm_log to authenticated;
grant usage on sequence public.bc_ky_nx_muc_seq, public.bc_ky_nx_lua_chon_seq, public.bc_ky_kh_mau_seq to authenticated;

-- ── 2. Nạp nội dung đề xuất (Claude soạn 05/11 — Thùy sửa trên ERP) ─────────────────────────────────────────
insert into public.bc_ky_nx_muc (ma, cha, ten, thu_tu, goi_y, nguong_tot, nguong_chua_tot) values
  ('NXM001', null, 'Thái độ học tập', 1, null, null, null),
  ('NXM002', null, 'Năng lực học tập', 2, null, null, null),
  ('NXM003', null, 'Độ ổn định', 3, null, null, null),
  ('NXM004', null, 'Tiến bộ', 4, null, null, null);
insert into public.bc_ky_nx_muc (ma, cha, ten, thu_tu, goi_y, nguong_tot, nguong_chua_tot) values
  ('NXM005', 'NXM001', 'Trên lớp', 1, null, null, null),
  ('NXM006', 'NXM001', 'Về nhà', 2, 'btvn', 90, 70),
  ('NXM007', 'NXM001', 'Chủ động', 3, null, null, null),
  ('NXM008', 'NXM002', 'Tiếp thu', 1, null, null, null),
  ('NXM009', 'NXM002', 'Vận dụng', 2, null, null, null),
  ('NXM010', 'NXM003', 'Độ chắc kiến thức', 1, null, null, null),
  ('NXM011', 'NXM003', 'Cẩn thận', 2, 'can_than', 0.75, 1.75),
  ('NXM012', 'NXM004', 'Về điểm', 1, 'tien_bo_diem', 0.5, -0.5),
  ('NXM013', 'NXM004', 'Về cách học', 2, null, null, null);
select setval('public.bc_ky_nx_muc_seq', 13);

insert into public.bc_ky_nx_lua_chon (muc_ma, muc_do, noi_dung, khoa_goi_y, thu_tu) values
  ('NXM005', 'tot', 'Con tập trung, ghi chép đầy đủ và tích cực tham gia bài học suốt kì.', null, 1),
  ('NXM005', 'on', 'Con tập trung tốt nhưng còn ít tham gia xây dựng bài.', null, 1),
  ('NXM005', 'on', 'Con có buổi rất tập trung, có buổi còn lơ là, chưa đều.', null, 2),
  ('NXM005', 'on', 'Con tập trung khi học bài mới, dễ mất tập trung khi luyện bài.', null, 3),
  ('NXM005', 'chua_tot', 'Con hay mất tập trung, làm việc riêng trong giờ.', null, 1),
  ('NXM005', 'chua_tot', 'Con còn ngại làm bài, làm cho xong.', null, 2),
  ('NXM005', 'chua_tot', 'Con hay nói chuyện, ảnh hưởng tới bạn xung quanh.', null, 3),

  ('NXM006', 'tot', 'Con làm bài về nhà đầy đủ, đúng hạn và nghiêm túc.', null, 1),
  ('NXM006', 'on', 'Con làm đủ bài về nhà nhưng đôi khi nộp muộn.', 'nop_muon', 1),
  ('NXM006', 'on', 'Con làm đủ bài về nhà nhưng có bài còn làm qua loa.', 'khong_nghiem_tuc', 2),
  ('NXM006', 'on', 'Con làm bài về nhà khá đều nhưng còn vài lần bỏ bài.', 'khong_lam', 3),
  ('NXM006', 'chua_tot', 'Con nhiều lần không làm bài về nhà.', 'khong_lam', 1),
  ('NXM006', 'chua_tot', 'Con thường xuyên nộp bài về nhà muộn.', 'nop_muon', 2),
  ('NXM006', 'chua_tot', 'Con có bài về nhà làm đối phó, chưa tự làm.', 'khong_nghiem_tuc', 3),

  ('NXM007', 'tot', 'Con chủ động hỏi khi chưa hiểu và tự xem lại lỗi sai của mình.', null, 1),
  ('NXM007', 'on', 'Con có hỏi khi được thầy cô gợi ý, chưa tự hỏi.', null, 1),
  ('NXM007', 'on', 'Con có hỏi bài nhưng chưa có thói quen xem lại lỗi sai.', null, 2),
  ('NXM007', 'chua_tot', 'Con chưa hiểu nhưng không hỏi, để lỗ hổng dồn lại.', null, 1),
  ('NXM007', 'chua_tot', 'Con còn trông chờ chữa bài, ít tự suy nghĩ trước.', null, 2),

  ('NXM008', 'tot', 'Con hiểu bài mới nhanh, nắm được ngay trên lớp.', null, 1),
  ('NXM008', 'on', 'Con hiểu được bài nhưng cần thêm thời gian và ví dụ.', null, 1),
  ('NXM008', 'on', 'Con tiếp thu tốt phần cơ bản, phần khó còn chậm.', null, 2),
  ('NXM008', 'on', 'Con tiếp thu không đều, có mảng kiến thức tốt, có mảng còn chậm.', null, 3),
  ('NXM008', 'chua_tot', 'Con thường cần giảng lại nhiều lần mới hiểu.', null, 1),
  ('NXM008', 'chua_tot', 'Con hổng kiến thức nền nên khó theo kịp bài mới.', null, 2),

  ('NXM009', 'tot', 'Con tự giải quyết được bài mới và bài nâng cao.', null, 1),
  ('NXM009', 'on', 'Con làm tốt bài giống mẫu, gặp bài biến đổi còn lúng túng.', null, 1),
  ('NXM009', 'on', 'Con tìm được hướng làm nhưng chưa làm trọn vẹn.', null, 2),
  ('NXM009', 'chua_tot', 'Con chỉ làm được khi có bài mẫu hoặc gợi ý.', null, 1),
  ('NXM009', 'chua_tot', 'Con chưa làm được cả bài tương tự bài mẫu.', null, 2),

  ('NXM010', 'tot', 'Con nhớ lâu, kiến thức đã học từ trước vẫn chắc.', null, 1),
  ('NXM010', 'on', 'Con nhớ tốt bài gần đây, kiến thức cũ cần ôn lại.', null, 1),
  ('NXM010', 'on', 'Con nắm chắc phần lớn, còn vài mảng chưa vững.', null, 2),
  ('NXM010', 'chua_tot', 'Con học xong quên nhanh.', null, 1),
  ('NXM010', 'chua_tot', 'Con hiểu chưa đến nơi, nhớ máy móc nên dễ nhầm.', null, 2),

  ('NXM011', 'tot', 'Con làm bài cẩn thận, ít sai do ẩu.', null, 1),
  ('NXM011', 'on', 'Con đôi khi sai do làm vội.', null, 1),
  ('NXM011', 'on', 'Con cẩn thận với bài ngắn, bài dài còn hay sót.', null, 2),
  ('NXM011', 'chua_tot', 'Con thường sai do ẩu: chép nhầm đề, nhầm bước.', null, 1),
  ('NXM011', 'chua_tot', 'Con làm vội, chưa có thói quen kiểm tra lại.', null, 2),
  ('NXM011', 'chua_tot', 'Kết quả của con còn thất thường giữa các lần.', null, 3),

  ('NXM012', 'tot', 'Con tiến bộ rõ so với đầu kì.', null, 1),
  ('NXM012', 'tot', 'Con giữ vững phong độ ở nhóm dẫn đầu.', 'top', 2),
  ('NXM012', 'on', 'Con giữ ổn định so với đầu kì.', null, 1),
  ('NXM012', 'on', 'Con có tiến bộ nhưng chưa đều.', null, 2),
  ('NXM012', 'chua_tot', 'Kết quả của con đi xuống so với đầu kì.', null, 1),
  ('NXM012', 'chua_tot', 'Kết quả của con lên xuống thất thường.', 'that_thuong', 2),

  ('NXM013', 'tot', 'Con có thay đổi tích cực rõ rệt trong cách học so với đầu kì.', null, 1),
  ('NXM013', 'on', 'Con có thay đổi nhưng chưa đều.', null, 1),
  ('NXM013', 'on', 'Con giữ được nề nếp học như đầu kì.', null, 2),
  ('NXM013', 'chua_tot', 'Nề nếp học của con đi xuống so với đầu kì.', null, 1),
  ('NXM013', 'chua_tot', 'Con chưa thay đổi dù đã được nhắc nhở.', null, 2);

insert into public.bc_ky_kh_mau (muc_ma, noi_dung, thu_tu) values
  ('NXM005', 'Thầy cô nhắc con tập trung và gọi con phát biểu thường xuyên hơn trong giờ học.', 1),
  ('NXM005', 'Gia đình trao đổi với con về mục tiêu học tập để con tự giác tập trung trên lớp.', 2),
  ('NXM006', 'Gia đình dành một khung giờ cố định mỗi ngày để con làm bài tập về nhà.', 1),
  ('NXM006', 'Gia đình kiểm tra con đã nộp bài về nhà đúng hạn chưa; trợ giảng nhắc con trước hạn nộp.', 2),
  ('NXM006', 'Con tự làm bài trước, chỉ xem lời giải sau khi đã làm xong.', 3),
  ('NXM007', 'Con ghi lại câu chưa hiểu và hỏi thầy cô ngay buổi học kế tiếp.', 1),
  ('NXM007', 'Con tự xem lại và chữa lại các câu sai sau mỗi bài kiểm tra.', 2),
  ('NXM008', 'Con học bổ trợ những phần kiến thức nền còn hổng theo lịch của trung tâm.', 1),
  ('NXM008', 'Con xem lại bài giảng và ví dụ trước buổi học kế tiếp.', 2),
  ('NXM009', 'Con luyện thêm các bài biến đổi so với bài mẫu, tự làm trước khi xem gợi ý.', 1),
  ('NXM009', 'Con tập đọc đề và xác định hướng làm trước khi bắt tay vào giải.', 2),
  ('NXM010', 'Con ôn lại kiến thức cũ mỗi tuần bằng bài luyện trên app.', 1),
  ('NXM010', 'Con làm lại các dạng bài đã học để nhớ lâu hơn.', 2),
  ('NXM011', 'Con tập thói quen đọc kĩ đề và kiểm tra lại kết quả trước khi nộp bài.', 1),
  ('NXM011', 'Con trình bày từng bước rõ ràng, không làm tắt.', 2),
  ('NXM012', 'Con đặt mục tiêu điểm cụ thể cho lần thi tới và luyện đề theo mục tiêu đó.', 1),
  ('NXM013', 'Thầy cô và gia đình cùng theo dõi nề nếp học của con hằng tuần.', 1);

-- ── 3. Lựa chọn của GV trên từng báo cáo ─────────────────────────────────────────────────────────────────
-- nx_chon = { "<mã mục nhỏ>": { "muc_do": "tot|on|chua_tot|chua_du", "lc": "<mã loại>" | null } } — chưa chọn mục nào ⇒ không có khoá
-- kh_chon = [ "<mã phương án>", … ] theo thứ tự GV tích. Lưu MÃ (khoá tự nhiên), chữ resolve lúc tính/đóng băng vào snapshot.
alter table public.bao_cao_ph_ky
  add column nx_chon jsonb not null default '{}'::jsonb check (jsonb_typeof(nx_chon) = 'object'),
  add column kh_chon jsonb not null default '[]'::jsonb check (jsonb_typeof(kh_chon) = 'array');

create or replace function public._bao_cao_ph_ky_truoc() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(public.jwt_uid(), new.updated_by);
  if tg_op = 'UPDATE' and old.cong_bo_at is not null and new.cong_bo_at is not null
     and (new.diem_du_doan is distinct from old.diem_du_doan or new.sai_so is distinct from old.sai_so
          or new.nhan_xet is distinct from old.nhan_xet or new.ke_hoach is distinct from old.ke_hoach
          or new.nx_chon is distinct from old.nx_chon or new.kh_chon is distinct from old.kh_chon
          or new.snapshot is distinct from old.snapshot) then
    raise exception 'Báo cáo kì đã công bố — bấm "Mở lại để sửa" trước.';
  end if;
  return new;
end $$;

-- Đủ để công bố: điểm + sai số + MỌI mục nhỏ đang dùng đã chọn (kể cả "chưa đủ quan sát"). Một nơi — dùng cho cả công bố lẻ lẫn cả lớp.
create or replace function public._bc_ky_thieu(p_bc bao_cao_ph_ky) returns text
language sql stable set search_path to 'public' as $$
  select case
    when p_bc.hoc_sinh_id is null or p_bc.diem_du_doan is null or p_bc.sai_so is null then 'Chưa có điểm dự đoán / sai số.'
    when exists (select 1 from bc_ky_nx_muc m join bc_ky_nx_muc t on t.ma = m.cha and t.xoa_at is null
                  where m.cha is not null and m.xoa_at is null
                    and coalesce(p_bc.nx_chon -> m.ma ->> 'muc_do', '') not in ('tot', 'on', 'chua_tot', 'chua_du'))
      then 'Còn mục nhận xét chưa chọn.'
  end
$$;

create or replace function public.fn_bc_ky_cong_bo(p_hs uuid, p_mon text, p_ky uuid)
returns timestamptz language plpgsql volatile set search_path to 'public' as $$
declare v_snap jsonb; v_at timestamptz := now(); v_bc bao_cao_ph_ky; v_thieu text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  if v_bc.cong_bo_at is not null then raise exception 'Báo cáo kì này đã công bố.'; end if;
  v_thieu := public._bc_ky_thieu(v_bc);
  if v_thieu is not null then raise exception '%', v_thieu; end if;
  v_snap := public.fn_bc_ky_tinh(p_hs, p_mon, p_ky) || jsonb_build_object('cong_bo_at', v_at);
  update bao_cao_ph_ky set snapshot = v_snap, cong_bo_at = v_at, cong_bo_boi = public.jwt_uid()
   where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  return v_at;
end $$;

create or replace function public.fn_bc_ky_cong_bo_lop(p_lop uuid, p_mon text, p_ky uuid)
returns jsonb language plpgsql volatile set search_path to 'public' as $$
declare r record; v_bc bao_cao_ph_ky; v_ok int := 0; v_bo int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  for r in select hl.hoc_sinh_id from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc' loop
    v_bc := null;
    select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = r.hoc_sinh_id and mon = p_mon and ky_id = p_ky;
    if v_bc.cong_bo_at is not null then continue; end if;
    if public._bc_ky_thieu(v_bc) is not null then v_bo := v_bo + 1; continue; end if;
    perform public.fn_bc_ky_cong_bo(r.hoc_sinh_id, p_mon, p_ky);
    v_ok := v_ok + 1;
  end loop;
  return jsonb_build_object('cong_bo', v_ok, 'bo_qua', v_bo);
end $$;
revoke execute on function public._bc_ky_thieu(bao_cao_ph_ky) from public, anon;
grant execute on function public._bc_ky_thieu(bao_cao_ph_ky) to authenticated, service_role;
revoke execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_cong_bo_lop(uuid, text, uuid) from public, anon;
grant execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_cong_bo_lop(uuid, text, uuid) to authenticated, service_role;

-- ── 4. fn_bc_ky_tinh: + gợi ý (điểm dự đoán · sai số · mức 3 mục 🤖) + nhận xét/kế hoạch đã chọn (resolve chữ) ──

create or replace function public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb
language plpgsql stable
set search_path to 'public'
as $function$
declare
  v_ky ky_hoc;
  v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu date; v_het date; v_cuoi date; v_60 date;
  v_lop record; v_hs record; v_gv text; v_bc bao_cao_ph_ky;
  v_out jsonb;
begin
  select * into v_ky from ky_hoc where id = p_ky;
  if v_ky.id is null then raise exception 'Không có kì %', p_ky; end if;
  v_tu   := (v_ky.tu_thang || '-01')::date;
  v_het  := ((v_ky.den_thang || '-01')::date + interval '1 month')::date;
  v_cuoi := least(v_het - 1, v_homnay);
  v_60   := v_cuoi - 59;   -- 60 ngày tính cả ngày cuối (Thùy 04/11: đếm theo LẦN nên nới từ 45)
  select h.id, h.ho_ten, h.ma_hs into v_hs from hoc_sinh h where h.id = p_hs;
  select l.id, l.ten_lop, l.khoi into v_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;
  select ns.ho_ten into v_gv from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
   where pc.lop_id = v_lop.id and pc.vai_tro = 'gv' and pc.la_chinh limit 1;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;

  with c as materialized (
    select x.* from public._dbht_cau(array[p_hs], least(v_tu, v_60), p_mon) x where x.ngay <= v_cuoi
  ),
  dv_cd as (select distinct chu_de_id as ma from c),
  dv_ch as (select distinct chuyen_de_id as ma, chu_de_id as chu_de from c),   -- 1 chuyên đề có thể ở nhiều chủ đề ⇒ theo CẶP
  -- LUẬT ĐÁNH GIÁ (Thùy 04/11, đo trên K9 so với luật đếm câu): đếm theo LẦN đánh giá (1 buổi ET/BTVN/MT hay 1 bài app = 1 lần, nhiều câu
  -- trong lần vẫn 1 phiếu; điểm lần = TB các câu của đơn vị trong lần). Chủ đề: 10 lần gần nhất, trọng số 6-6-4-4-4-4-3-3-3-3; chuyên đề:
  -- 5 lần gần nhất, trọng số 6-4-4-3-3 (lần gần nhất nặng nhất). Cửa sổ 60 ngày cuối kì. Tính cho MỌI em cùng khối × môn ⇒ hạng của em
  -- trong từng đơn vị (chỉ xếp em có lần đánh giá ở đơn vị đó, bằng % thì cùng hạng); % của em lấy từ chính tập này (một nơi tính).
  ds_khoi as (
    select array(select distinct x from unnest(array_agg(hl.hoc_sinh_id) || array[p_hs]) x) as ids
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_lop.khoi
  ),
  ck as materialized (
    select x.* from public._dbht_cau((select ids from ds_khoi), v_60, p_mon) x where x.ngay <= v_cuoi
  ),
  lan_cd as (   -- 1 dòng / (em, chủ đề, lần)
    select hoc_sinh_id, chu_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, luot
  ),
  lan_ch as (   -- 1 dòng / (em, chủ đề, chuyên đề, lần)
    select hoc_sinh_id, chu_de_id as chu_de, chuyen_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, chuyen_de_id, luot
  ),
  r_cd as (select l.*, row_number() over (partition by hoc_sinh_id, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_cd l),
  r_ch as (select l.*, row_number() over (partition by hoc_sinh_id, chu_de, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_ch l),
  k_cd as (
    select z.*, rank() over (partition by ma order by p desc)::int as hang, count(*) over (partition by ma)::int as tong
      from (select hoc_sinh_id, ma,
                   round(100 * sum(g * (array[6,6,4,4,4,4,3,3,3,3])[rn]) / sum((array[6,6,4,4,4,4,3,3,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_cd where rn <= 10 group by hoc_sinh_id, ma) z
  ),
  k_ch as (
    select z.*, rank() over (partition by chu_de, ma order by p desc)::int as hang, count(*) over (partition by chu_de, ma)::int as tong
      from (select hoc_sinh_id, chu_de, ma,
                   round(100 * sum(g * (array[6,4,4,3,3])[rn]) / sum((array[6,4,4,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_ch where rn <= 5 group by hoc_sinh_id, chu_de, ma) z
  ),
  p_cd as (select ma, p, n, hang, tong from k_cd where hoc_sinh_id = p_hs),
  p_ch as (select ma, chu_de, p, n, hang, tong from k_ch where hoc_sinh_id = p_hs),
  t_cd as (
    select dv.ma,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join dai_bdm_chu_de dc on dc.id = case when dv.ma like 'H:%' then substr(dv.ma, 3) else dv.ma end
  ),
  -- Tag Cơ bản / Nâng cao cho chuyên đề ĐẠI SỐ (nhánh 'toan'; Hình, HGT, KHTN không tag — Thùy 04/11): theo ĐA SỐ độ khó các dạng bài
  -- của cặp (chủ đề, chuyên đề) trên bản đồ (muc_do ≤3 cơ bản, ≥4 nâng cao — cùng ngưỡng report tháng); hoà ⇒ nâng cao; không dạng nào có độ khó ⇒ không tag.
  tag as (
    select n.chu_de_id as chu_de, n.chuyen_de_id as ma,
           case when count(db.muc_do) = 0 then null
                when count(*) filter (where db.muc_do >= 4) >= count(*) filter (where db.muc_do <= 3) then 'nang_cao' else 'co_ban' end as muc
      from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.nhanh = 'toan'
      join dai_bdm_dang_bai db on db.nhom_id = n.id
     where n.chu_de_id in (select chu_de from dv_ch)
     group by n.chu_de_id, n.chuyen_de_id
  ),
  t_ch as (
    select dv.ma, dv.chu_de,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, nmh.ten, dch.ten, dv.ma) as ten,
           coalesce(ko.thu_tu, nmh.thu_tu, dbo.thu_tu, 9999) as tt
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join hinh_nhom_mo_hinh nmh on dv.ma like 'H:%' and nmh.id::text = substr(dv.ma, 3)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join dai_bdm_o dbo on dbo.chuyen_de_id = dv.ma and dbo.chu_de_id = dv.chu_de
  ),
  -- LẦN THI trong kì của KHỐI em (mọi em của khối — dùng cho hạng, TB lần thi và phụ lục)
  kt as (
    select k.id, k.loai, coalesce(k.ngay, b.ngay) as ngay,
           public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, b.ngay)) as thang
      from ky_thi k left join buoi_hoc b on b.id = k.buoi_hoc_id
     where k.loai in ('mt_sat_hach', 'khao_sat_thang') and k.mon = p_mon and k.khoi = v_lop.khoi
       and coalesce(k.ngay, b.ngay) is not null
  ),
  kt2 as (select * from kt where thang between v_ky.tu_thang and v_ky.den_thang),
  d as (
    select kt2.loai, kt2.thang, dt.hoc_sinh_id, avg(dt.diem) as diem, min(kt2.ngay) as ngay
      from diem_thi dt join kt2 on kt2.id = dt.ky_thi_id
     where dt.diem is not null
     group by kt2.loai, kt2.thang, dt.hoc_sinh_id
  ),
  lan as (
    select d.*, rank() over (partition by loai, thang order by diem desc)::int as hang,
           count(*) over (partition by loai, thang)::int as n_mau,
           avg(diem) over (partition by loai, thang) as tb
      from d
  ),
  cot0 as (select loai, thang, min(ngay) as ngay from lan group by loai, thang),
  cot as (   -- các lần thi của khối, theo thời gian (cột phụ lục + trục đồ thị). Nhãn cho PH (Thùy 04/11): MT = "T8", khảo sát = "Khảo sát 1, 2…" theo thứ tự trong kì
    select loai, thang, ngay,
           case loai when 'mt_sat_hach' then 'T' || ltrim(substr(thang, 6, 2), '0')
                else 'KS' || row_number() over (partition by loai order by ngay, thang) end as nhan,   -- Thùy 04/11: viết tắt, cột không bị phình
           row_number() over (order by ngay, loai) as stt
      from cot0
  ),
  hang_tb as (   -- hạng TB các lần em ĐÃ thi ⇒ xếp hạng lại (Thùy 04/11)
    select hoc_sinh_id, avg(hang) as hang_tb, avg(diem) as diem_tb, count(*)::int as so_lan from lan group by hoc_sinh_id
  ),
  ky_hang as (
    select h.*, rank() over (order by h.hang_tb asc)::int as hang, count(*) over ()::int as tong from hang_tb h
  ),
  lop_hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id in (select hoc_sinh_id from ky_hang)
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  cc as (
    select count(*) filter (where h.diem_danh = 'vang')::int as vang,
           count(*) filter (where h.diem_danh = 'vang_phep')::int as vang_phep,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(h.diem_danh)::int as tong
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai is distinct from 'huy'
      join lop l on l.id = b.lop_id and l.mon = p_mon
     where h.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
  ),
  bt as (   -- BTVN: buổi thường của lớp môn này + ca bù cho buổi của môn này
    select k.trang_thai_nop, k.thai_do
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.trang_thai is distinct from 'huy'
      left join lop l on l.id = b.lop_id
     where k.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
       and ((b.loai = 'thuong' and l.mon = p_mon)
         or (b.loai = 'bu' and exists (select 1 from buoi_hoc_hs hh join buoi_hoc me on me.id = hh.bu_cho_buoi_id
                                                join lop lm on lm.id = me.lop_id and lm.mon = p_mon
                                        where hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = p_hs)))
       and (k.trang_thai_nop is not null or k.thai_do is not null)
  ),
  -- GỢI Ý (spec §D, Thùy 05/11) — GV duyệt trên màn nhập, không tự ghi vào báo cáo.
  em_lan as (   -- các lần thi CỦA EM trong kì
    select l.diem, l.diem - l.tb as chenh, l.hang, l.n_mau,
           row_number() over (order by l.ngay desc, l.loai) as rn_moi,
           row_number() over (order by l.ngay asc, l.loai) as rn_cu,
           count(*) over () as n
      from lan l where l.hoc_sinh_id = p_hs
  ),
  dd as (
    -- điểm dự đoán = TB điểm, trọng số lần gần nhất 6-4-3-3 · sai số = max(0,75; 1,5 × độ lệch chuẩn của CHÊNH so TB lần thi), 1 lần ⇒ 1,0
    -- (backtest T10, 254 em: lệch TB 0,97; 65% lọt khoảng). Bội 0,25.
    -- tang = chênh TB nửa sau kì − nửa đầu kì (mỗi nửa = floor(n/2) lần; lẻ thì bỏ lần giữa) · top = mọi lần trong top 20%.
    select count(*)::int as n,
           least(10, greatest(0, round(4 * sum(diem * (case rn_moi when 1 then 6 when 2 then 4 else 3 end))
                                      / nullif(sum(case rn_moi when 1 then 6 when 2 then 4 else 3 end), 0)) / 4)) as du_doan,
           case when count(*) < 2 then 1.0 else greatest(0.75, round(4 * 1.5 * stddev_pop(chenh)) / 4) end as sai_so,
           avg(chenh) filter (where rn_moi <= floor(n / 2.0)) - avg(chenh) filter (where rn_cu <= floor(n / 2.0)) as tang,
           bool_and(hang::numeric / n_mau <= 0.2) as top
      from em_lan
  ),
  bt_so as (   -- BTVN cho gợi ý "Về nhà": mẫu = buổi đã ghi trạng thái nộp, bỏ xin phép
    select count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int as dat,
           count(*) filter (where trang_thai_nop is not null and trang_thai_nop <> 'xin_phep')::int as mau,
           count(*) filter (where trang_thai_nop = 'khong_lam')::int as kl,
           count(*) filter (where trang_thai_nop = 'nop_muon')::int as nm,
           count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int as knt
      from bt
  ),
  gy as (   -- mức gợi ý cho mục 🤖 — ngưỡng đọc từ danh mục (Thùy sửa trên ERP)
    select m.ma,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 then null
                               when 100.0 * b.dat / b.mau >= m.nguong_tot then 'tot'
                               when 100.0 * b.dat / b.mau < m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'can_than' then case when d.n < 2 then null
                               when coalesce(v_bc.sai_so, d.sai_so) <= m.nguong_tot then 'tot'
                               when coalesce(v_bc.sai_so, d.sai_so) >= m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'tien_bo_diem' then case when d.n < 2 then null
                               when d.top or d.tang >= m.nguong_tot then 'tot'
                               when d.tang <= m.nguong_chua_tot then 'chua_tot' else 'on' end
      end as muc_do,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 or b.kl + b.nm + b.knt = 0 then null
                              when b.kl >= b.nm and b.kl >= b.knt then 'khong_lam'
                              when b.nm >= b.knt then 'nop_muon' else 'khong_nghiem_tuc' end
        when 'tien_bo_diem' then case when d.n >= 2 and d.top then 'top' end
      end as khoa,
      case m.goi_y
        when 'btvn' then jsonb_build_object('dat', b.dat, 'mau', b.mau, 'khong_lam', b.kl, 'nop_muon', b.nm, 'chua_nghiem_tuc', b.knt)
        when 'can_than' then jsonb_build_object('sai_so', coalesce(v_bc.sai_so, d.sai_so), 'tu_gv', v_bc.sai_so is not null, 'so_lan', d.n)
        when 'tien_bo_diem' then jsonb_build_object('tang', round(d.tang, 2), 'top', d.top, 'so_lan', d.n)
      end as so
      from bc_ky_nx_muc m cross join bt_so b cross join dd d
     where m.goi_y is not null and m.xoa_at is null
  )
  select jsonb_build_object(
    'phien_ban', 3,
    'tinh_luc', now(),
    'hs', jsonb_build_object('id', v_hs.id, 'ho_ten', v_hs.ho_ten, 'ma_hs', v_hs.ma_hs),
    'lop', jsonb_build_object('id', v_lop.id, 'ten', v_lop.ten_lop, 'khoi', v_lop.khoi),
    'mon', p_mon,
    'gv', v_gv,
    'ky', jsonb_build_object('id', v_ky.id, 'ten', v_ky.ten, 'tu_thang', v_ky.tu_thang, 'den_thang', v_ky.den_thang),
    -- PHẦN 1 — Đánh giá: cây chủ đề → chuyên đề
    'danh_gia', jsonb_build_object(
      'tu', v_60, 'den', v_cuoi, 'n_chu_de', 10, 'n_chuyen_de', 5, 'luat', 'lan',
      'chu_de', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ma', t.ma, 'ten', t.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 10, 'hang', p.hang, 'tong', p.tong,
                 'chuyen_de', coalesce((
                   select jsonb_agg(jsonb_build_object('ma', ch.ma, 'ten', ch.ten, 'p', pc.p, 'n', coalesce(pc.n, 0), 'n_toi_da', 5, 'muc', tg.muc,
                                                      'hang', pc.hang, 'tong', pc.tong)
                                    order by ch.tt, ch.ten)
                     from t_ch ch left join p_ch pc on pc.ma = ch.ma and pc.chu_de = ch.chu_de
                     left join tag tg on tg.ma = ch.ma and tg.chu_de = ch.chu_de
                    where ch.chu_de = t.ma), '[]'::jsonb))
               order by t.tt, t.ten)
          from t_cd t left join p_cd p on p.ma = t.ma), '[]'::jsonb)),
    -- PHẦN 2 — Kết quả thi của em (bảng + đồ thị) và hạng cả kì theo HẠNG TB
    'thi', coalesce((select jsonb_agg(jsonb_build_object(
                       'loai', l.loai, 'nhan', ct.nhan, 'thang', l.thang, 'ngay', l.ngay,
                       'diem', round(l.diem, 2), 'tb', round(l.tb, 2), 'chenh', round(l.diem, 2) - round(l.tb, 2),   -- điểm 2 chữ số (Thùy 04/11)
                       'n_mau', l.n_mau, 'hang', l.hang)
                     order by ct.stt) from lan l join cot ct using (loai, thang) where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'hang_tb', round(k.hang_tb, 1),
                                          'diem_tb', round(k.diem_tb, 2), 'so_lan', k.so_lan)
                  from ky_hang k where k.hoc_sinh_id = p_hs),
    -- PHẦN 3 — Thái độ học tập
    'thai_do', jsonb_build_object(
      'chuyen_can', (select to_jsonb(cc) from cc),
      'btvn', (select jsonb_build_object(
                 'tong', count(*)::int,
                 -- đạt chuẩn = nộp đúng hạn + thái độ không bị ghi chưa nghiêm túc / chống đối (Thùy 04/11)
                 'dat_chuan', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                 and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 -- NHÓM KHÔNG TRÙNG (Thùy 04/11 — PH cộng các ô phải ra đúng tổng): dat_chuan + dung_han_chua_nt + nop_muon + khong_lam
                 -- + xin_phep + chua_ghi = tong. khong_nghiem_tuc / chong_doi bên dưới là số ĐẾM CHỒNG (chỉ để ghi chú "trong đó…").
                 'dung_han_chua_nt', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                        and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chua_ghi', count(*) filter (where trang_thai_nop is null)::int,
                 'khong_lam', count(*) filter (where trang_thai_nop = 'khong_lam')::int,
                 'nop_muon', count(*) filter (where trang_thai_nop = 'nop_muon')::int,
                 'xin_phep', count(*) filter (where trang_thai_nop = 'xin_phep')::int,
                 'khong_nghiem_tuc', count(*) filter (where thai_do in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chong_doi', count(*) filter (where thai_do = 'chong_doi')::int) from bt)),
    -- PHẦN 4 — GV nhập
    'nang_luc', jsonb_build_object('diem', v_bc.diem_du_doan, 'sai_so', v_bc.sai_so),
    'nhan_xet', v_bc.nhan_xet,     -- ô "nhận xét thêm" (không bắt buộc)
    'ke_hoach', v_bc.ke_hoach,     -- ô "viết thêm" của kế hoạch
    -- nhận xét theo thang (Thùy 05/11): mục to → mục nhỏ GV đã chọn, chữ resolve từ danh mục (loại đã vào kho rác vẫn đọc được)
    'nhan_xet_chon', coalesce((
      select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'con', x.con) order by t.thu_tu, t.ma)
        from bc_ky_nx_muc t
        cross join lateral (
          select jsonb_agg(jsonb_build_object('ma', m.ma, 'ten', m.ten, 'muc_do', v_bc.nx_chon -> m.ma ->> 'muc_do', 'noi_dung', lc.noi_dung)
                           order by m.thu_tu, m.ma) as con
            from bc_ky_nx_muc m
            left join bc_ky_nx_lua_chon lc on lc.ma = v_bc.nx_chon -> m.ma ->> 'lc'
           where m.cha = t.ma and m.xoa_at is null and v_bc.nx_chon ? m.ma) x
       where t.cha is null and t.xoa_at is null and x.con is not null), '[]'::jsonb),
    'ke_hoach_chon', coalesce((
      select jsonb_agg(k.noi_dung order by e.ord)
        from jsonb_array_elements_text(v_bc.kh_chon) with ordinality e(ma, ord) join bc_ky_kh_mau k on k.ma = e.ma), '[]'::jsonb),
    'goi_y', (select jsonb_build_object(
                'du_doan', case when d.n > 0 then d.du_doan end,
                'sai_so', case when d.n > 0 then d.sai_so end,
                'so_lan', d.n,
                'muc', coalesce((select jsonb_object_agg(g.ma, jsonb_build_object('muc_do', g.muc_do, 'khoa', g.khoa, 'so', g.so)) from gy g), '{}'::jsonb))
                from dd d),
    -- PHẦN 5 — Phụ lục: toàn bộ em cùng khối × môn có ≥1 lần thi trong kì, xếp theo hạng TB
    'phu_luc', jsonb_build_object(
      'cot', coalesce((select jsonb_agg(jsonb_build_object('nhan', nhan, 'ngay', ngay) order by stt) from cot), '[]'::jsonb),
      'hs', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ten', hs.ho_ten, 'lop', lh.ten_lop, 'la_em', k.hoc_sinh_id = p_hs,
                 'diem', (select jsonb_agg((select round(l.diem, 2) from lan l where l.hoc_sinh_id = k.hoc_sinh_id
                                              and l.loai = ct.loai and l.thang = ct.thang) order by ct.stt) from cot ct),
                 'hang_tb', round(k.hang_tb, 1), 'hang', k.hang)
               order by k.hang, hs.ho_ten)
          from ky_hang k join hoc_sinh hs on hs.id = k.hoc_sinh_id left join lop_hs lh on lh.hoc_sinh_id = k.hoc_sinh_id), '[]'::jsonb))
  ) into v_out;
  return v_out;
end
$function$;
