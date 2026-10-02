-- ============================================================================
-- 202610021156 — anh_kho_ban_do_k9
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Môn Tiếng Anh chưa có kho (ADR-mon: mỗi môn 1 trung tâm, bảng riêng). Bản đồ KP khối 9
--   (spec-anh-ban-do-k9.md — 6 mảng → 24 chuyên đề → 100 KP) đã được GV Anh duyệt 01–02/10.
--   Migration này dựng bộ bảng kho Anh + nạp bản đồ + nối các hàm điều phối kho cốt lõi.
--   ⭐ Cây bản đồ dựng theo cách giới dạy tiếng Anh chia (mảng/chuyên đề/điểm kiến thức), KHÔNG theo
--   khuôn Toán; bảng chỉ dùng chung "hợp đồng cột" với hạ tầng kho (ma_chu_de = MẢNG,
--   ma_chuyen_de = CHUYÊN ĐỀ, ten_dang = ĐIỂM KIẾN THỨC) để các hàm kho/đo dùng chung chạy được.
--   Riêng môn Anh: bảng NGỮ LIỆU (đoạn văn/thông báo/biển báo dùng chung cho nhiều câu),
--   cột dang_de (12 dạng đề HN + dạng luyện tập), unit_sgk, ma_hien_thi (NA-01, NP-09… cho GV đọc).
--
--   ⚠ CỐ Ý KHÔNG mở _kho_co_mon('Tiếng Anh'): 16 hàm còn nhánh "không phải KHTN thì là Toán"
--   (tu_luyen, htd, hs_dang_evals, đề thi, trợ lý, giải bài…). Mở chốt bây giờ ⇒ app HS lớp Anh rơi
--   vào kho Toán. Mở khi vá xong các hàm đó (pha app). Kho Anh lúc này chỉ dùng ở màn Kho/duyệt.
--
-- MẤT GÌ: không mất dữ liệu. Có DROP + ADD lại 2 CHECK (kho_doi_dang_log.mon, kho_kiem_lo.kho) — chỉ NỚI thêm giá trị 'anh', không thu hẹp. Các hàm điều phối thay bằng bản
--   dựng từ định nghĩa đang chạy (pg_get_functiondef 02/10) + đúng 1 nhánh 'Tiếng Anh'; Toán/KHTN/Hình
--   giữ nguyên hành vi.
-- ============================================================================

-- ① Dãy số mã
create sequence if not exists public.anh_dang_seq;
create sequence if not exists public.anh_cau_seq;
create sequence if not exists public.anh_ngu_lieu_seq;

-- ② Bản đồ (điểm kiến thức)
create table public.anh_ban_do (
  ma_dang        text primary key default ('EG' || lpad(nextval('public.anh_dang_seq')::text, 5, '0')),
  khoi           text not null,
  ma_chu_de      text not null,          -- MẢNG (Ngữ âm · Ngữ pháp · Từ vựng · Đọc · Viết · Giao tiếp)
  ten_chu_de     text not null,
  ma_chuyen_de   text not null,          -- CHUYÊN ĐỀ (Thì, Mệnh đề quan hệ, Cụm động từ…)
  ten_chuyen_de  text not null,
  ten_dang       text not null,          -- ĐIỂM KIẾN THỨC
  muc_do         smallint not null,      -- 1 nhận biết · 2 thông hiểu · 3 vận dụng (tạm theo mảng, GV chỉnh được)
  bac_toi_thieu  text not null references public.lop_bac(ma),
  created_at     timestamptz not null default now(),
  mo_ta_ngan     text,                   -- "HS làm được gì"
  ma_hien_thi    text unique,            -- mã GV đọc (NA-01…). Chỉ để HIỂN THỊ — danh tính là ma_dang
  day_o          text,                   -- lớp–unit Global Success dạy điểm này ('L8 U9'); null = SGK 6–9 không dạy thành bài riêng
  vi_du          text,
  thu_tu         smallint                -- thứ tự hiển thị trong bản đồ
);
comment on table public.anh_ban_do is 'Bản đồ điểm kiến thức Tiếng Anh (spec-anh-ban-do-k9.md). Cây: mảng(ma_chu_de) → chuyên đề → điểm kiến thức(ma_dang).';

create table public.anh_dang_ly_thuyet (
  ma_dang      text primary key references public.anh_ban_do(ma_dang),
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  cap_nhat_at  timestamptz not null default now()
);

-- ③ Ngữ liệu: đoạn văn / thông báo / biển báo / tin nhắn / hội thoại / bài nghe — cha của nhiều câu
create table public.anh_ngu_lieu (
  ma_ngu_lieu  text primary key default ('EL' || lpad(nextval('public.anh_ngu_lieu_seq')::text, 6, '0')),
  loai         text not null check (loai in ('doan_van', 'thong_bao', 'bien_bao', 'tin_nhan', 'hoi_thoai', 'bai_nghe')),
  tieu_de      text,
  noi_dung     text not null default '',   -- chữ của ngữ liệu; biển báo chỉ có ảnh thì chữ trên biển (nếu chép được)
  anh          text,
  am_thanh     text,
  transcript   text,
  nguon        text not null default 'le',
  ten_de_goc   text,
  created_at   timestamptz not null default now(),
  xoa_at       timestamptz
);

-- ④ Câu hỏi — cùng hợp đồng cột với kho các môn (hàm kho/snapshot đọc theo tên cột) + cột riêng môn Anh
create table public.anh_cau_hoi (
  ma_cau          text primary key default ('EC' || lpad(nextval('public.anh_cau_seq')::text, 6, '0')),
  dang_chinh      text not null references public.anh_ban_do(ma_dang),
  loai_cau        text not null,
  noi_dung        text not null,
  lua_chon        jsonb,
  menh_de         jsonb,
  dap_an          text,
  loi_giai        text,
  anh_de          text,
  anh_dap_an      text,
  nguon           text not null default 'le',
  nguon_giai      text not null default 'nguoi',
  parent_ma_cau   text references public.anh_cau_hoi(ma_cau),
  clone_method    text,
  created_at      timestamptz not null default now(),
  xoa_at          timestamptz,
  ma_cum          text,                  -- hợp đồng chung (_kho_snapshot_cau đọc); môn Anh chưa có bảng cụm
  da_duyet        boolean not null default false,
  duyet_boi       uuid references public.nhan_su(id),
  duyet_at        timestamptz,
  giai_method     text,
  loi_giai_ai     text,
  dap_an_ai       text,
  ai_model        text,
  ai_de_xuat_at   timestamptz,
  kiem_may        text check (kiem_may in ('khop', 'nghi', 'khong_kiem_duoc')),
  kiem_may_at     timestamptz,
  kiem_may_boi    text check (kiem_may_boi in ('mcq-auto', 'claude_code', 'nguoi')),
  kiem_may_ghi    text,
  duyet_nguon     text check (duyet_nguon in ('nguoi', 'may', 'ai')),
  dang_ai_de_xuat text,
  kiem_may_lo     uuid references public.kho_kiem_lo(id),
  kho_chuan       boolean generated always as (public._kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)) stored,
  ten_de_goc      text,
  -- riêng môn Anh
  ngu_lieu        text references public.anh_ngu_lieu(ma_ngu_lieu),   -- null = câu đứng một mình (không áp dụng)
  thu_tu_trong_ngu_lieu smallint,
  dang_de         text not null check (dang_de in (
                    -- 12 dạng đề Tiếng Anh vào 10 Hà Nội
                    'phat_am', 'trong_am', 'hoan_thanh_cau', 'dien_thong_bao', 'sap_xep_doan', 'cau_chu_de',
                    'dien_doan_van', 'cau_gan_nghia', 'viet_cau_goi_y', 'bien_bao', 'doc_hieu', 'dien_cau_doan',
                    -- dạng luyện tập (tài liệu, không có trong đề HN 2025–26)
                    'dong_trai_nghia', 'ket_hop_cau', 'nghe', 'dien_tu', 'chia_dong_tu', 'word_form',
                    'viet_lai_cau', 'sap_xep_tu', 'viet_cau')),
  unit_sgk        text check (unit_sgk ~ '^L[6-9]U([1-9]|1[0-2])$'),   -- 'L9U1'; null = câu không theo unit (đề thi…)
  check ((ngu_lieu is null) = (thu_tu_trong_ngu_lieu is null))
);
create index anh_cau_hoi_dang on public.anh_cau_hoi (dang_chinh);
create index anh_cau_hoi_kho_chuan_dang on public.anh_cau_hoi using btree (dang_chinh) where (kho_chuan and xoa_at is null);
create index anh_cau_hoi_ngu_lieu on public.anh_cau_hoi (ngu_lieu, thu_tu_trong_ngu_lieu) where ngu_lieu is not null;

-- ⑤ Trigger — y hệt bộ của khtn_cau_hoi (đối xứng), tham số môn = 'anh'
create trigger trg_chan_duyet_dang_cho before insert or update of da_duyet, dang_chinh on public.anh_cau_hoi
  for each row execute function public._trg_chan_duyet_dang_cho();
create trigger trg_kho_cau_duyet_nguon before insert or update of da_duyet, duyet_nguon on public.anh_cau_hoi
  for each row execute function public._kho_cau_duyet_nguon();
create trigger trg_log_kho_cau_anh after delete or update on public.anh_cau_hoi
  for each row execute function public.log_kho_cau();
create trigger trg_log_doi_dang after update of dang_chinh on public.anh_cau_hoi
  for each row execute function public._trg_log_doi_dang('anh', 'cau');
create trigger trg_log_kho_sua after update of noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ma_cum on public.anh_cau_hoi
  for each row execute function public._trg_log_kho_sua('anh');
create trigger trg_de_thi_dien_dang after update of dang_chinh on public.anh_cau_hoi
  for each row execute function public._trg_de_thi_dien_dang();
create trigger trg_anh_ban_do_sync_ca_test_cau after update of ten_chuyen_de, muc_do on public.anh_ban_do
  for each row execute function public.tg_ban_do_sync_ca_test_cau();

-- ⑥ Sổ log dùng chung: nới CHECK thêm 'anh'.
--    kho_sua_log thuộc owner postgres (tạo tay qua SQL Editor) ⇒ claude_build KHÔNG sửa được CHECK của nó:
--    tách sang 202610021157_anh_kho_sua_log_mon_check.sql (ÁP BẰNG SQL EDITOR). Trước khi file đó chạy,
--    SỬA NỘI DUNG câu Anh (noi_dung/lua_chon/dap_an…) sẽ bị CHECK chặn — nhập mới (INSERT) không ảnh hưởng.
alter table public.kho_doi_dang_log drop constraint kho_doi_dang_log_mon_check;
alter table public.kho_doi_dang_log add constraint kho_doi_dang_log_mon_check check (mon = any (array['dai', 'hgt', 'khtn', 'anh']));
alter table public.kho_kiem_lo drop constraint kho_kiem_lo_kho_check;
alter table public.kho_kiem_lo add constraint kho_kiem_lo_kho_check check (kho = any (array['dai', 'khtn', 'hgt', 'anh']));

-- ⑦ RLS — cùng tư thế với kho KHTN (thành viên đọc/ghi; claude_ro do migrate.mjs tự thêm)
alter table public.anh_ban_do enable row level security;
alter table public.anh_dang_ly_thuyet enable row level security;
alter table public.anh_ngu_lieu enable row level security;
alter table public.anh_cau_hoi enable row level security;
create policy anh_ban_do_member_all on public.anh_ban_do for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy anh_dang_ly_thuyet_member_all on public.anh_dang_ly_thuyet for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy anh_ngu_lieu_member_all on public.anh_ngu_lieu for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy anh_cau_hoi_member_all on public.anh_cau_hoi for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ⑧ Nạp bản đồ: 1 điểm "chưa phân" (câu chưa chắc điểm kiến thức nằm đây, trigger chặn duyệt) + 100 KP
insert into public.anh_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, thu_tu)
values ('E09000000', '9', 'E0900', 'Chưa phân', 'E090000', 'Chưa phân', 'Chưa phân điểm kiến thức', 1, 'C',
        'Câu chưa chắc điểm kiến thức — GV chọn điểm thật rồi mới duyệt được', 0);
insert into public.anh_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, ma_hien_thi, day_o, vi_du, thu_tu) values
  ('E09010101', '9', 'E0901', 'Ngữ âm', 'E090101', 'Phát âm', 'Đuôi -ed', 1, 'C', '/t/ sau âm vô thanh · /ɪd/ sau t, d · /d/ còn lại. Nhận ra tính từ -ed đọc /ɪd/ (beloved, naked)', 'NA-01', 'L7 U3', '25 c1 beloved / developed', 1),
  ('E09010102', '9', 'E0901', 'Ngữ âm', 'E090101', 'Phát âm', 'Đuôi -s/-es', 1, 'C', '/s/ sau âm vô thanh · /ɪz/ sau s, z, ʃ, ʒ, tʃ, dʒ · /z/ còn lại', 'NA-02', 'L6 U2', 'books / bags / boxes', 2),
  ('E09010103', '9', 'E0901', 'Ngữ âm', 'E090101', 'Phát âm', 'Chữ nguyên âm đơn a · e · i · o · u', 1, 'C', 'Các cách đọc chính của từng chữ. Âm yếu /ə/ ở âm tiết không nhấn', 'NA-03', 'L6 U1,4,8 · L7 U1,5 · L8 U2 · L9 U1', '25 c2 fashion / ancient; 26 c28 performance', 3),
  ('E09010104', '9', 'E0901', 'Ngữ âm', 'E090101', 'Phát âm', 'Nhóm chữ nguyên âm', 1, 'C', 'ea, ee, oo, ou, ow, ai, ie, ar/er/ir/or/ur, ear, ure', 'NA-04', 'L6 U9 · L7 U7,8 · L8 U1,3 · L9 U2', 'health / disease', 4),
  ('E09010105', '9', 'E0901', 'Ngữ âm', 'E090101', 'Phát âm', 'Chữ phụ âm nhiều cách đọc', 1, 'C', 'c · g · s · x · ch · th · gh', 'NA-05', 'L6 U6,7 · L7 U4,6 · L8 U4', 'MH c2 crowd / space', 5),
  ('E09010106', '9', 'E0901', 'Ngữ âm', 'E090101', 'Phát âm', 'Âm câm', 1, 'C', 'h · k · w · b · l · t · d (hour, knee, write, climb, calm, listen, handsome)', 'NA-06', null, '26 c27 honour / holography', 6),
  ('E09010201', '9', 'E0901', 'Ngữ âm', 'E090102', 'Trọng âm', 'Từ 2 âm tiết', 1, 'C', 'Danh/tính từ thường nhấn âm 1, động từ nhấn âm 2. Nhớ ngoại lệ hay ra (hotel, event, advice)', 'NA-07', 'L6 U10 · L7 U9', 'MH c3 hotel; 25 c12 event', 7),
  ('E09010202', '9', 'E0901', 'Ngữ âm', 'E090102', 'Trọng âm', 'Đuôi quyết định vị trí nhấn (đuôi không nhận nhấn)', 1, 'C', '-tion/-sion, -ic, -ical, -ity, -ious, -ian, -ial nhấn âm ngay trước. -ate, -gy, -phy nhấn âm 3 từ cuối', 'NA-08', 'L8 U9 · L9 U8,9', '25 c11 generation; 26 c2 recognition', 8),
  ('E09010203', '9', 'E0901', 'Ngữ âm', 'E090102', 'Trọng âm', 'Đuôi nhận trọng âm', 1, 'C', '-ee · -eer · -ese · -oo · -oon · -ique · -aire', 'NA-09', 'L8 U10', 'MH c4, 26 c1 engineer', 9),
  ('E09010204', '9', 'E0901', 'Ngữ âm', 'E090102', 'Trọng âm', 'Từ ≥3 âm tiết không có đuôi báo hiệu · từ ghép', 1, 'C', 'Nhớ trọng âm từ thông dụng. Danh từ ghép nhấn phần đầu', 'NA-10', 'L7 U10', 'energy, dangerous', 10),
  ('E09020101', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'Hiện tại đơn', 2, 'C', 'Thói quen, sự thật. Lịch trình cố định dùng cho tương lai', 'NP-01', 'L6 U1 · L7 U1 · L8 U8', '25 c9 Our test starts next Monday', 11),
  ('E09020102', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'Hiện tại tiếp diễn', 2, 'C', 'Đang diễn ra; kế hoạch tương lai. Phân biệt với HTĐ', 'NP-02', 'L6 U3 · L7 U10', null, 12),
  ('E09020103', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'Quá khứ đơn', 2, 'C', 'Sự việc, thói quen trong quá khứ', 'NP-03', 'L6 U8 · L7 U3', '26 c22 Back then… she always sold', 13),
  ('E09020104', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'Quá khứ tiếp diễn + phối thì với QKĐ', 2, 'C', 'Hành động đang diễn ra + hành động xen vào (when/while)', 'NP-04', 'L8 U9 · L9 U4', 'MH c6 She was dancing when…', 14),
  ('E09020105', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'used to / be used to / get used to', 2, 'C', 'Thói quen quá khứ (didn''t use to) ≠ quen với (+V-ing)', 'NP-05', null, '25 c7 didn''t use to eat', 15),
  ('E09020106', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'Hiện tại hoàn thành', 2, 'C', 'for/since, ever/never, just/already/yet. Phân biệt với QKĐ', 'NP-06', 'L9 U5', null, 16),
  ('E09020107', '9', 'E0902', 'Ngữ pháp', 'E090201', 'Thì', 'Tương lai: will · be going to · might', 2, 'C', 'Dự đoán, quyết định, kế hoạch, khả năng', 'NP-07', 'L6 U10 · L7 U11 · L8 U6', null, 17),
  ('E09020201', '9', 'E0902', 'Ngữ pháp', 'E090202', 'Động từ khuyết thiếu', 'can/could · should/ought to · must/have to · may/might', 2, 'C', 'Nghĩa (khả năng, lời khuyên, bắt buộc, cấm) + dạng (modal + V; ought to)', 'NP-08', 'L6 U5,6 · L7 U7 · L9 U3', '25 c24 They should talk to teens', 18),
  ('E09020301', '9', 'E0902', 'Ngữ pháp', 'E090203', 'Điều kiện & câu ước', 'Câu điều kiện loại 1', 2, 'C', 'If/unless + HTĐ. Mệnh đề chính dùng will / modal / mệnh lệnh', 'NP-09', 'L6 U11 · L8 U6 · L9 U3', '26 c17 If you visit…, learn its culture', 19),
  ('E09020302', '9', 'E0902', 'Ngữ pháp', 'E090203', 'Điều kiện & câu ước', 'wish + quá khứ đơn', 2, 'C', 'Ước điều trái hiện tại', 'NP-10', 'L9 U4', null, 20),
  ('E09020401', '9', 'E0902', 'Ngữ pháp', 'E090204', 'Câu tường thuật', 'Tường thuật câu kể', 2, 'C', 'Lùi thì, đổi ngôi, đổi trạng từ (today → that day)', 'NP-11', 'L8 U11', 'MH c25', 21),
  ('E09020402', '9', 'E0902', 'Ngữ pháp', 'E090204', 'Câu tường thuật', 'Tường thuật câu hỏi', 2, 'C', 'Yes/No → if/whether; Wh- giữ từ hỏi; không đảo ngữ. Chuyển được cả 2 chiều', 'NP-12', 'L8 U12 · L9 U7', '25 c26', 22),
  ('E09020501', '9', 'E0902', 'Ngữ pháp', 'E090205', 'Câu hỏi', 'Câu hỏi Yes/No & Wh-', 2, 'C', 'Trợ động từ đúng thì/ngôi; How much/many', 'NP-13', 'L6 U7 · L7 U5,9 · L8 U4', '25 c19 does music have', 23),
  ('E09020502', '9', 'E0902', 'Ngữ pháp', 'E090205', 'Câu hỏi', 'Từ để hỏi + to-V', 2, 'C', 'what/where/when/how/who to V; whether to V', 'NP-14', 'L9 U1', null, 24),
  ('E09020601', '9', 'E0902', 'Ngữ pháp', 'E090206', 'Danh động từ & to-V', 'Động từ + V-ing / + to-V', 2, 'C', 'enjoy/mind/avoid/finish/fancy + V-ing; want/decide/agree/promise/learn + to-V; like/love/hate + cả hai', 'NP-15', 'L8 U1 · L9 U6', null, 25),
  ('E09020602', '9', 'E0902', 'Ngữ pháp', 'E090206', 'Danh động từ & to-V', 'Động từ + tân ngữ + to-V / V / tính từ', 2, 'C', 'allow/ask/tell/remind/encourage sb to V; let/make sb V; keep sb adj', 'NP-16', null, 'MH c22 allows you to live; 26 c3 reminded Nana to bring', 26),
  ('E09020603', '9', 'E0902', 'Ngữ pháp', 'E090206', 'Danh động từ & to-V', 'V-ing làm chủ ngữ · V-ing sau giới từ', 2, 'C', 'Building houses is difficult; look forward to presenting', 'NP-17', null, 'MH c20; 26 c16; 25 c27', 27),
  ('E09020604', '9', 'E0902', 'Ngữ pháp', 'E090206', 'Danh động từ & to-V', 'Khuyên & đề nghị', 2, 'C', 'suggest/advise/recommend + V-ing / that…should; Let''s = Why don''t we = How about + V-ing', 'NP-18', 'L9 U11', 'MH c26, c28', 28),
  ('E09020701', '9', 'E0902', 'Ngữ pháp', 'E090207', 'Danh từ – mạo từ – lượng từ', 'Danh từ đếm được / không đếm được', 2, 'C', 'equipment, information, advice, furniture… không đi với a/an, không thêm -s', 'NP-19', 'L6 U5 · L8 U4', '26 c24 a heating equipment', 29),
  ('E09020702', '9', 'E0902', 'Ngữ pháp', 'E090207', 'Danh từ – mạo từ – lượng từ', 'Mạo từ a · an · the · Ø', 2, 'C', 'Lần đầu nhắc / xác định / duy nhất / địa lý / one of the', 'NP-20', 'L6 U11 · L7 U12 · L8 U5', '25 c8; MH c14; 26 c7', 30),
  ('E09020703', '9', 'E0902', 'Ngữ pháp', 'E090207', 'Danh từ – mạo từ – lượng từ', 'Lượng từ', 2, 'C', 'some/any · much/many · a lot of · a few/a little · few/little · another/other', 'NP-21', 'L6 U5,6 · L7 U5 · L8 U4', '25 c14 a few questions; MH c21 another problem', 31),
  ('E09020801', '9', 'E0902', 'Ngữ pháp', 'E090208', 'Đại từ', 'Sở hữu & phản thân', 2, 'C', 'Tính từ/đại từ sở hữu, sở hữu cách ''s/s'', a friend of mine, đại từ phản thân', 'NP-22', 'L6 U2,9 · L7 U11 · L8 U10', null, 32),
  ('E09020901', '9', 'E0902', 'Ngữ pháp', 'E090209', 'Mệnh đề quan hệ', 'Đại từ & trạng từ quan hệ', 2, 'C', 'who · whom · which · that · whose + N · where · when', 'NP-23', 'L9 U8,9', '25 c20 others who like; 26 c23 whose tables', 33),
  ('E09020902', '9', 'E0902', 'Ngữ pháp', 'E090209', 'Mệnh đề quan hệ', 'MĐQH xác định vs không xác định', 2, 'C', 'Dấu phẩy; không dùng *that* sau dấu phẩy; lược đại từ tân ngữ ở MĐ xác định', 'NP-24', 'L9 U9,10', 'MH c10 Da Nang, which is…', 34),
  ('E09021001', '9', 'E0902', 'Ngữ pháp', 'E090210', 'Tính từ, trạng từ & so sánh', 'So sánh hơn & nhất của tính từ', 2, 'C', 'Ngắn/dài/bất quy tắc; one of the most + N số nhiều', 'NP-25', 'L6 U4,12', '25 c3; MH c7', 35),
  ('E09021002', '9', 'E0902', 'Ngữ pháp', 'E090210', 'Tính từ, trạng từ & so sánh', 'So sánh bằng / giống / khác', 2, 'C', '(not) as…as · the same as · like · different from', 'NP-26', 'L7 U4', null, 36),
  ('E09021003', '9', 'E0902', 'Ngữ pháp', 'E090210', 'Tính từ, trạng từ & so sánh', 'So sánh trạng từ', 2, 'C', 'more quickly (không "more quicker"), well → better', 'NP-27', 'L8 U2', '26 c4', 37),
  ('E09021004', '9', 'E0902', 'Ngữ pháp', 'E090210', 'Tính từ, trạng từ & so sánh', 'So sánh kép', 2, 'C', 'The more…, the less…; -er and -er', 'NP-28', 'L9 U2', '26 c22 the less time they have', 38),
  ('E09021005', '9', 'E0902', 'Ngữ pháp', 'E090210', 'Tính từ, trạng từ & so sánh', 'Tính từ đuôi -ed / -ing', 2, 'C', 'amazed (người cảm thấy) ≠ amazing (gây ra cảm giác)', 'NP-29', '(L9 U5 từ vựng)', null, 39),
  ('E09021006', '9', 'E0902', 'Ngữ pháp', 'E090210', 'Tính từ, trạng từ & so sánh', 'too / enough', 2, 'C', 'too + adj + to V · adj + enough · enough + N · not enough land', 'NP-30', null, 'MH c19 not enough land', 40),
  ('E09021101', '9', 'E0902', 'Ngữ pháp', 'E090211', 'Liên từ & mệnh đề trạng ngữ', 'Câu ghép & từ nối trong câu', 2, 'C', 'and/but/or/so; however/therefore/otherwise (dấu câu đúng)', 'NP-31', 'L6 U7 · L7 U2 · L8 U3', null, 41),
  ('E09021102', '9', 'E0902', 'Ngữ pháp', 'E090211', 'Liên từ & mệnh đề trạng ngữ', 'Mệnh đề thời gian', 2, 'C', 'when · while · before · after · until · as soon as (không dùng will sau chúng)', 'NP-32', 'L8 U7', null, 42),
  ('E09021103', '9', 'E0902', 'Ngữ pháp', 'E090211', 'Liên từ & mệnh đề trạng ngữ', 'Nhượng bộ', 2, 'C', 'although/though + mệnh đề ≠ despite/in spite of + N/V-ing; however', 'NP-33', 'L7 U8 · L9 U12', null, 43),
  ('E09021104', '9', 'E0902', 'Ngữ pháp', 'E090211', 'Liên từ & mệnh đề trạng ngữ', 'Nguyên nhân & kết quả', 2, 'C', 'because/since/as ≠ because of; so; so + adj + that; such (a) + N + that', 'NP-34', 'L9 U12', 'MH c23 …, so you have to walk', 44),
  ('E09021201', '9', 'E0902', 'Ngữ pháp', 'E090212', 'Giới từ', 'Giới từ thời gian', 2, 'C', 'in/on/at, on + ngày cụ thể, at Christmas, for/since, by, until', 'NP-35', 'L7 U6 · L8 U10', '25 c13 on July 20th', 45),
  ('E09021202', '9', 'E0902', 'Ngữ pháp', 'E090212', 'Giới từ', 'Giới từ nơi chốn & chuyển động', 2, 'C', 'in/on/at, inside, into, opposite, on the website', 'NP-36', 'L6 U2 · L7 U6 · L8 U10', 'MH c13 stay inside; 26 c5', 46),
  ('E09021301', '9', 'E0902', 'Ngữ pháp', 'E090213', 'Cấu trúc câu', 'Hoà hợp chủ ngữ – động từ', 2, 'C', 'Chủ ngữ số ít, không đếm được, V-ing, có MĐQH chen giữa', 'NP-37', null, '25 c28 The contestant who guesses… stays', 47),
  ('E09021302', '9', 'E0902', 'Ngữ pháp', 'E090213', 'Cấu trúc câu', 'Trật tự từ', 2, 'C', 'Cụm danh từ (these simple steps), vị trí trạng từ (can also hurt), trạng từ tần suất', 'NP-38', 'L6 U1 · L7 U2 · L8 U8', '25 c22; 26 c29', 48),
  ('E09021303', '9', 'E0902', 'Ngữ pháp', 'E090213', 'Cấu trúc câu', 'Câu mệnh lệnh', 2, 'C', 'Khẳng định / phủ định (Don''t…)', 'NP-39', 'L6 U8', null, 49),
  ('E09021304', '9', 'E0902', 'Ngữ pháp', 'E090213', 'Cấu trúc câu', 'Cặp cấu trúc tương đương hay gặp', 3, 'C', 'remind sb of = make sb remember · It takes sb time to V = spend time V-ing · prefer = would rather · the first time = never…before · last…ago = haven''t…since', 'NP-40', null, '25 c25', 50),
  ('E09030101', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U1 Local community', 1, 'C', 'Người làm dịch vụ cộng đồng, nghề thủ công, tourist attraction', 'TV-01', null, null, 51),
  ('E09030102', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U2 City life', 1, 'C', 'Đời sống đô thị, giao thông, tiện ích công cộng', 'TV-02', null, null, 52),
  ('E09030103', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U3 Healthy living for teens', 1, 'C', 'Học hành, áp lực, sức khoẻ thể chất/tinh thần', 'TV-03', null, null, 53),
  ('E09030104', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U4 Remembering the past', 1, 'C', 'Đời sống xưa, di sản, gìn giữ giá trị', 'TV-04', null, null, 54),
  ('E09030105', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U5 Our experiences', 1, 'C', 'Trải nghiệm + tính từ tả trải nghiệm (amazing, embarrassing, helpless)', 'TV-05', null, null, 55),
  ('E09030106', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U6 Vietnamese lifestyle: then and now', 1, 'C', 'Thay đổi lối sống, gia đình', 'TV-06', null, null, 56),
  ('E09030107', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U7 Natural wonders of the world', 1, 'C', 'Kỳ quan, bảo tồn thiên nhiên', 'TV-07', null, null, 57),
  ('E09030108', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U8 Tourism', 1, 'C', 'Loại hình du lịch, dịch vụ du lịch', 'TV-08', null, null, 58),
  ('E09030109', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U9 World Englishes', 1, 'C', 'Ngôn ngữ, học tiếng Anh', 'TV-09', null, null, 59),
  ('E09030110', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U10 Planet Earth', 1, 'C', 'Môi trường sống, động thực vật', 'TV-10', null, null, 60),
  ('E09030111', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U11 Electronic devices', 1, 'C', 'Thiết bị điện tử, từ chỉ chất liệu', 'TV-11', null, null, 61),
  ('E09030112', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'U12 Career choices', 1, 'C', 'Nghề, tính từ tả công việc (demanding, well-paid)', 'TV-12', null, null, 62),
  ('E09030113', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'Chủ đề lớp 6', 1, 'C', 'Trường, nhà, bạn bè, khu phố, Tết, TV, thể thao, thành phố, robot…', 'TV-13', null, null, 63),
  ('E09030114', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'Chủ đề lớp 7', 1, 'C', 'Sở thích, sức khoẻ, âm nhạc, ăn uống, giao thông, phim, lễ hội, năng lượng…', 'TV-14', null, null, 64),
  ('E09030115', '9', 'E0903', 'Từ vựng', 'E090301', 'Từ vựng chủ đề', 'Chủ đề lớp 8', 1, 'C', 'Giải trí, nông thôn, tuổi teen, dân tộc, phong tục, mua sắm, thiên tai, KH-CN…', 'TV-15', null, null, 65),
  ('E09030201', '9', 'E0903', 'Từ vựng', 'E090302', 'Cấu tạo từ', 'Xác định từ loại cần điền theo vị trí', 2, 'C', 'Sau mạo từ/giới từ/sở hữu → danh từ; trước danh từ → tính từ; bổ nghĩa động từ → trạng từ', 'TV-16', null, '25 c5 words of encouragement; MH c16 in danger; 26 c34', 66),
  ('E09030202', '9', 'E0903', 'Từ vựng', 'E090302', 'Cấu tạo từ', 'Hậu tố & họ từ', 2, 'C', '-tion/-ment/-ness/-ity/-ance/-er/-or/-ist · -ful/-less/-ous/-al/-ive/-able · -ly · -ize/-en', 'TV-17', null, 'success → successful ≠ successive', 67),
  ('E09030203', '9', 'E0903', 'Từ vựng', 'E090302', 'Cấu tạo từ', 'Tiền tố', 2, 'C', 'un-/in-/im-/il-/ir-/dis-/non-/mis-/re- và nghĩa', 'TV-18', null, null, 68),
  ('E09030301', '9', 'E0903', 'Từ vựng', 'E090303', 'Cụm động từ', 'với LOOK', 2, 'C', 'look after/for/around/up/forward to/through/at', 'TV-19', null, null, 69),
  ('E09030302', '9', 'E0903', 'Từ vựng', 'E090303', 'Cụm động từ', 'với GET', 2, 'C', 'get on with, get around, get up, get over', 'TV-20', null, null, 70),
  ('E09030303', '9', 'E0903', 'Từ vựng', 'E090303', 'Cụm động từ', 'với TAKE', 2, 'C', 'take care of, take up, take off, take part in, take over', 'TV-21', null, null, 71),
  ('E09030304', '9', 'E0903', 'Từ vựng', 'E090303', 'Cụm động từ', 'với COME / GO', 2, 'C', 'come back, come down with, go over, go on, go out', 'TV-22', null, null, 72),
  ('E09030305', '9', 'E0903', 'Từ vựng', 'E090303', 'Cụm động từ', 'với GIVE / PUT / SET / TURN', 2, 'C', 'give up, put up, set up, set off, turn up/down', 'TV-23', null, null, 73),
  ('E09030306', '9', 'E0903', 'Từ vựng', 'E090303', 'Cụm động từ', 'Cụm động từ khác trong SGK 9', 2, 'C', 'cut down on, carry out, pick up, hand down, find out, hang out with, run out of', 'TV-24', null, null, 74),
  ('E09030401', '9', 'E0903', 'Từ vựng', 'E090304', 'Giới từ đi kèm', 'Tính từ + giới từ', 2, 'C', 'interested in, famous for, fascinated by, proud of, good at', 'TV-25', null, null, 75),
  ('E09030402', '9', 'E0903', 'Từ vựng', 'E090304', 'Giới từ đi kèm', 'Động từ + giới từ', 2, 'C', 'listen to, depend on, connect with, take part in', 'TV-26', null, null, 76),
  ('E09030403', '9', 'E0903', 'Từ vựng', 'E090304', 'Giới từ đi kèm', 'Danh từ + giới từ · cụm giới từ cố định', 2, 'C', 'connection to, in danger, on time, by heart, on foot', 'TV-27', null, null, 77),
  ('E09030501', '9', 'E0903', 'Từ vựng', 'E090305', 'Collocation & thành ngữ', 'Động từ + danh từ', 2, 'C', 'play a role · set a goal · pursue a dream · achieve results · make/do/take/have…', 'TV-28', null, null, 78),
  ('E09030502', '9', 'E0903', 'Từ vựng', 'E090305', 'Collocation & thành ngữ', 'Tính từ/danh từ + danh từ', 2, 'C', 'further information · heavy traffic · well-paid job', 'TV-29', null, null, 79),
  ('E09030503', '9', 'E0903', 'Từ vựng', 'E090305', 'Collocation & thành ngữ', 'Thành ngữ & cách nói cố định', 2, 'C', 'break a leg · learn by heart · my mind went blank', 'TV-30', null, null, 80),
  ('E09040101', '9', 'E0904', 'Đọc', 'E090401', 'Văn bản ngắn', 'Biển báo, thông báo, tin nhắn ngắn', 1, 'C', 'Hiểu ý nghĩa và mục đích; chọn câu diễn đạt lại đúng', 'ĐH-01', null, null, 81),
  ('E09040201', '9', 'E0904', 'Đọc', 'E090402', 'Đọc hiểu bài', 'Ý chính / tiêu đề', 2, 'C', 'Chọn câu khái quát cả bài, không chọn câu chỉ đúng 1 đoạn', 'ĐH-02', null, null, 82),
  ('E09040202', '9', 'E0904', 'Đọc', 'E090402', 'Đọc hiểu bài', 'Thông tin chi tiết & diễn đạt lại', 2, 'C', 'Tìm đúng chỗ trong bài, nhận ra cách nói khác (specialists = experts)', 'ĐH-03', null, null, 83),
  ('E09040203', '9', 'E0904', 'Đọc', 'E090402', 'Đọc hiểu bài', 'Đúng / không đúng / không được nhắc', 2, 'C', 'TRUE · NOT TRUE · NOT mentioned · EXCEPT: đối chiếu từng phương án', 'ĐH-04', null, null, 84),
  ('E09040204', '9', 'E0904', 'Đọc', 'E090402', 'Đọc hiểu bài', 'Nghĩa của từ trong ngữ cảnh', 2, 'C', 'Đồng nghĩa / trái nghĩa của từ gạch chân, dựa vào ngữ cảnh. Tránh bẫy lấy phương án đồng nghĩa cho câu hỏi trái nghĩa', 'ĐH-05', null, null, 85),
  ('E09040205', '9', 'E0904', 'Đọc', 'E090402', 'Đọc hiểu bài', 'Quy chiếu', 2, 'C', 'it / they / this / them chỉ cái gì', 'ĐH-06', null, null, 86),
  ('E09040206', '9', 'E0904', 'Đọc', 'E090402', 'Đọc hiểu bài', 'Suy luận · mục đích & cách viết của tác giả', 3, 'C', 'infer, purpose, cách tác giả giải thích (ví dụ, số liệu…)', 'ĐH-07', null, null, 87),
  ('E09050101', '9', 'E0905', 'Viết', 'E090501', 'Liên kết & tổ chức đoạn', 'Từ nối liên kết câu/đoạn', 2, 'C', 'Trình tự (to begin with, next, finally), bổ sung (also, moreover), đối lập (however), kết quả (therefore), giải thích (this means)', 'VT-01', null, null, 88),
  ('E09050102', '9', 'E0905', 'Viết', 'E090501', 'Liên kết & tổ chức đoạn', 'Câu chủ đề · câu mở / kết đoạn', 2, 'C', 'Chọn câu khái quát mở đoạn, câu khép lại mạch ý', 'VT-02', null, null, 89),
  ('E09050103', '9', 'E0905', 'Viết', 'E090501', 'Liên kết & tổ chức đoạn', 'Sắp xếp câu thành đoạn / hội thoại / thư', 3, 'C', 'Dựa vào trình tự thời gian, đại từ quy chiếu, từ nối', 'VT-03', null, null, 90),
  ('E09050104', '9', 'E0905', 'Viết', 'E090501', 'Liên kết & tổ chức đoạn', 'Điền câu/cụm vào đoạn', 3, 'C', 'Phương án phải khớp ngữ pháp chỗ trống (nối tiếp chủ ngữ, song song với "and…", to-V chỉ mục đích) và khớp mạch ý', 'VT-04', null, null, 91),
  ('E09060101', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Chào hỏi, giới thiệu, kết thúc hội thoại', 1, 'C', '', 'GT-01', null, null, 92),
  ('E09060102', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Cảm ơn / xin lỗi & đáp lời', 1, 'C', '26 c18 Thank you… → No problem!', 'GT-02', null, null, 93),
  ('E09060103', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Khen, chúc mừng, chúc may mắn & đáp lời', 1, 'C', 'MH c9 → How cool! Congratulations!', 'GT-03', null, null, 94),
  ('E09060104', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Mời, gợi ý, đề nghị giúp & nhận lời / từ chối', 1, 'C', 'Would you like…? Shall I…?', 'GT-04', null, null, 95),
  ('E09060105', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Xin phép, nhờ vả & đáp', 1, 'C', 'May I…? Could you…?', 'GT-05', null, null, 96),
  ('E09060106', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Hỏi & cho lời khuyên', 1, 'C', '', 'GT-06', null, null, 97),
  ('E09060107', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Nêu ý kiến · đồng ý / phản đối', 1, 'C', 'You can say that again · I''m afraid I disagree', 'GT-07', null, null, 98),
  ('E09060108', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Hỏi thông tin (đường, giá, giờ…) & trả lời', 1, 'C', '', 'GT-08', null, null, 99),
  ('E09060109', '9', 'E0906', 'Giao tiếp', 'E090601', 'Chức năng giao tiếp', 'Đáp lại tin buồn / tin vui (thông cảm, động viên, ngạc nhiên)', 1, 'C', '25 c6 → Don''t give up! You''ll have another chance.', 'GT-09', null, null, 100);

-- ⑨ Hàm điều phối kho cốt lõi: thêm đúng 1 nhánh 'Tiếng Anh' (nhãn môn trong nhan_su_mon/lop.mon).
--    Dựng từ bản đang chạy (pg_get_functiondef 02/10). Toán/KHTN/Hình không đổi.
CREATE OR REPLACE FUNCTION public._kho_ban_do_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_mon = 'Tiếng Anh' then 'anh_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai'
              else 'dai_ban_do' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_cau_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_mon = 'Tiếng Anh' then 'anh_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_hoi'
              else 'dai_cau_hoi' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_lt_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_mon = 'Tiếng Anh' then 'anh_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_form_tn_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_tn'
              when p_mon = 'Tiếng Anh' then 'anh_cau_form_tn'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_tn'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_tn'
              else 'dai_cau_form_tn' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_form_dien_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_dien'
              when p_mon = 'Tiếng Anh' then 'anh_cau_form_dien'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_dien'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_dien'
              else 'dai_cau_form_dien' end
$function$;

-- Môn Anh không có nhánh hgt/hinh_hoc: đừng dò bảng Hình cho mã E…
CREATE OR REPLACE FUNCTION public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text)
 RETURNS text LANGUAGE sql STABLE
AS $function$
  select case when p_mon not in ('KHTN', 'Tiếng Anh') and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon not in ('KHTN', 'Tiếng Anh') and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              else null end
$function$;

CREATE OR REPLACE FUNCTION public._kho_muc_do_dang(p_mon text, p_ma_dang text)
 RETURNS smallint LANGUAGE plpgsql STABLE
AS $function$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Tiếng Anh' then
    select muc_do into v_md from anh_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_hoc' then
    select muc_do into v_md from hinh_hoc_bai where ma_bai = p_ma_dang;
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $function$;

-- Mã "dạng chờ" theo khối: Anh = E + khối + 000000 (E09000000 nạp ở ⑧)
CREATE OR REPLACE FUNCTION public._kho_dang_cho(p_tbl text, p_khoi text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case p_tbl when 'dai' then 'T1' when 'hgt' then 'T3' when 'khtn' then 'K' when 'anh' then 'E' end
         || lpad(p_khoi, 2, '0') || '000000'
$function$;

-- Khoá kho phía TS (KhoMon) → tiền tố bảng
CREATE OR REPLACE FUNCTION public.fn_kho_tbl(p_mon text)
 RETURNS text LANGUAGE sql IMMUTABLE
AS $function$
  select case p_mon when 'toan' then 'dai' when 'khtn' then 'khtn' when 'hgt' then 'hgt' when 'hinh_hoc' then 'hinh_hoc' when 'anh' then 'anh' end
$function$;
