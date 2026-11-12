-- ============================================================================
-- Môn LÝ HÓA, đợt 2 — KHO + BẢN ĐỒ KIẾN THỨC (Thùy 12/11: "vai trò giống KHTN", khối 10 11 12)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_kho.mjs từ DB đang chạy — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO: Lý hóa = 1 trung tâm riêng (§1.6), cùng KHUÔN với KHTN (Chủ đề → Chuyên đề → Dạng, bản đồ mới bdm, form TN, đề xuất).
--   (A) Nhân bản cấu trúc mọi bảng khtn_* → lyhoa_* (RỖNG — không chép dữ liệu KHTN), chuỗi mã riêng, mã gốc tiền tố L
--       (LC câu · LG dạng cũ · LCD/LCH/LDB/LNB bản đồ mới · LCUM cụm) — không đụng tiền tố nào đang dùng.
--   (B) Nhân bản mọi hàm riêng của KHTN (fn_khtn_*, _khtn_*, khtn_*) + trigger + policy + quyền.
--   (C) Vá REGISTRY dùng chung rẽ nhánh kho theo môn (_kho_*_tbl, fn_kho_tbl, giải bài, duyệt, nhập câu…). Trước bản vá này
--       nhiều hàm "else ⇒ bảng Toán" nên môn Lý hóa (đã mở lớp ở đợt 1) sẽ ÂM THẦM rơi vào kho Toán.
--   (D) Dạng chờ L10/L11/L12 (bản đồ cũ, giống K07–K09 của KHTN) để nhập câu chưa phân dạng.
--   CHƯA ở đợt này (đợt 3–4): tài liệu/giáo trình/ET/MT/BTVN/mastery/tự luyện, app HS (_kho_co_mon), phiên Claude, trợ lý.
-- MẤT GÌ (Luật xoá): không mất gì — chỉ tạo mới + create or replace (giữ chữ ký) + nới CHECK.
-- ============================================================================
set local check_function_bodies = off;

-- (A1) chuỗi mã
create sequence public.lyhoa_bdm_chu_de_seq as bigint;
create sequence public.lyhoa_bdm_chuyen_de_seq as bigint;
create sequence public.lyhoa_bdm_dang_bai_seq as bigint;
create sequence public.lyhoa_bdm_log_id_seq as bigint;
create sequence public.lyhoa_bdm_nhom_seq as bigint;
create sequence public.lyhoa_bdm_tu_choi_id_seq as bigint;
create sequence public.lyhoa_cau_seq as bigint;
create sequence public.lyhoa_cum_seq as bigint;
create sequence public.lyhoa_dang_seq as bigint;

-- (A2) bảng: cột + NOT NULL + default + identity + generated + index/PK/UNIQUE + chú thích
create table public.lyhoa_ban_do (like public.khtn_ban_do including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_ban_do alter column ma_dang set default ('LG'::text || lpad((nextval('lyhoa_dang_seq'::regclass))::text, 5, '0'::text));
create table public.lyhoa_cau_hoi (like public.khtn_cau_hoi including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_cau_hoi alter column ma_cau set default ('LC'::text || lpad((nextval('lyhoa_cau_seq'::regclass))::text, 6, '0'::text));
create table public.lyhoa_dang_ly_thuyet (like public.khtn_dang_ly_thuyet including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_chuyen_de_ly_thuyet (like public.khtn_chuyen_de_ly_thuyet including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_cum_bai (like public.khtn_cum_bai including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_cum_bai alter column ma_cum set default ('LCUM'::text || lpad((nextval('lyhoa_cum_seq'::regclass))::text, 5, '0'::text));
create table public.lyhoa_dang_tien_de (like public.khtn_dang_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_cum_tien_de (like public.khtn_cum_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_cau_hoi_yeu_cau_giai (like public.khtn_cau_hoi_yeu_cau_giai including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_de_xuat (like public.khtn_de_xuat including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_de_xuat_cau (like public.khtn_de_xuat_cau including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_de_xuat_quyet_dinh (like public.khtn_de_xuat_quyet_dinh including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_mcq_rule (like public.khtn_mcq_rule including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_cau_form_tn (like public.khtn_cau_form_tn including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_chu_de (like public.khtn_bdm_chu_de including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_bdm_chu_de alter column id set default ('LCD'::text || lpad((nextval('lyhoa_bdm_chu_de_seq'::regclass))::text, 5, '0'::text));
create table public.lyhoa_bdm_chuyen_de (like public.khtn_bdm_chuyen_de including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_bdm_chuyen_de alter column id set default ('LCH'::text || lpad((nextval('lyhoa_bdm_chuyen_de_seq'::regclass))::text, 5, '0'::text));
create table public.lyhoa_bdm_o (like public.khtn_bdm_o including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_nhom (like public.khtn_bdm_nhom including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_bdm_nhom alter column id set default ('LNB'::text || lpad((nextval('lyhoa_bdm_nhom_seq'::regclass))::text, 5, '0'::text));
create table public.lyhoa_bdm_dang_bai (like public.khtn_bdm_dang_bai including defaults including identity including generated including indexes including comments including storage);
alter table public.lyhoa_bdm_dang_bai alter column id set default ('LDB'::text || lpad((nextval('lyhoa_bdm_dang_bai_seq'::regclass))::text, 5, '0'::text));
create table public.lyhoa_bdm_nhom_tien_de (like public.khtn_bdm_nhom_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_gan_cau (like public.khtn_bdm_gan_cau including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_log (like public.khtn_bdm_log including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_de_xuat (like public.khtn_bdm_de_xuat including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_cau_thieu_dang (like public.khtn_bdm_cau_thieu_dang including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_kiem_mau (like public.khtn_bdm_kiem_mau including defaults including identity including generated including indexes including comments including storage);
create table public.lyhoa_bdm_tu_choi (like public.khtn_bdm_tu_choi including defaults including identity including generated including indexes including comments including storage);

-- (A3) CHECK + FK
alter table public.lyhoa_bdm_cau_thieu_dang add constraint lyhoa_bdm_cau_thieu_dang_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.lyhoa_bdm_chu_de add constraint lyhoa_bdm_chu_de_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.lyhoa_bdm_chuyen_de add constraint lyhoa_bdm_chuyen_de_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.lyhoa_bdm_dang_bai add constraint lyhoa_bdm_dang_bai_bac_toi_thieu_check CHECK ((bac_toi_thieu = ANY (ARRAY['S'::text, 'A'::text, 'B'::text, 'C'::text, 'D'::text])));
alter table public.lyhoa_bdm_dang_bai add constraint lyhoa_bdm_dang_bai_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.lyhoa_bdm_de_xuat add constraint lyhoa_bdm_de_xuat_chac_check CHECK ((chac = ANY (ARRAY['cao'::text, 'vua'::text])));
alter table public.lyhoa_bdm_de_xuat add constraint lyhoa_bdm_de_xuat_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.lyhoa_bdm_gan_cau add constraint lyhoa_bdm_gan_cau_nguon_check CHECK ((nguon = ANY (ARRAY['nguoi'::text, 'ai'::text, 'cum'::text])));
alter table public.lyhoa_bdm_kiem_mau add constraint lyhoa_bdm_kiem_mau_ket_qua_check CHECK ((ket_qua = ANY (ARRAY['giu'::text, 'doi'::text])));
alter table public.lyhoa_bdm_log add constraint lyhoa_bdm_log_hanh_dong_check CHECK ((hanh_dong = ANY (ARRAY['them'::text, 'sua'::text, 'xoa'::text])));
alter table public.lyhoa_bdm_nhom add constraint lyhoa_bdm_nhom_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.lyhoa_bdm_nhom_tien_de add constraint lyhoa_bdm_nhom_tien_de_check CHECK ((nhom_id <> tien_de_nhom_id));
alter table public.lyhoa_cau_form_tn add constraint lyhoa_cau_form_tn_dap_an_check CHECK ((dap_an = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text])));
alter table public.lyhoa_cau_form_tn add constraint lyhoa_cau_form_tn_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_duyet_nguon_check CHECK ((duyet_nguon = ANY (ARRAY['nguoi'::text, 'may'::text, 'ai'::text])));
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_kiem_may_boi_check CHECK ((kiem_may_boi = ANY (ARRAY['mcq-auto'::text, 'claude_code'::text, 'nguoi'::text])));
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_kiem_may_check CHECK ((kiem_may = ANY (ARRAY['khop'::text, 'nghi'::text, 'khong_kiem_duoc'::text])));
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_muc_cau_check CHECK (((muc_cau >= 1) AND (muc_cau <= 5)));
alter table public.lyhoa_cau_hoi_yeu_cau_giai add constraint lyhoa_cau_hoi_yeu_cau_giai_che_do_check CHECK ((che_do = ANY (ARRAY['giai'::text, 'hoan_thien'::text])));
alter table public.lyhoa_cau_hoi_yeu_cau_giai add constraint lyhoa_cau_hoi_yeu_cau_giai_trang_thai_chk CHECK (((trang_thai = ANY (ARRAY['cho_claude'::text, 'da_xong'::text, 'dang_giai'::text, 'cho_duyet'::text, 'can_sua'::text, 'da_duyet'::text, 'da_tra'::text, 'qua_han'::text, 'tu_choi_3'::text])) AND ((nguoi_giai IS NULL) = (trang_thai = ANY (ARRAY['cho_claude'::text, 'da_xong'::text])))));
alter table public.lyhoa_cum_tien_de add constraint lyhoa_cum_tien_de_check CHECK ((ma_cum <> tien_de_ma_cum));
alter table public.lyhoa_dang_tien_de add constraint lyhoa_dang_tien_de_check CHECK ((ma_dang <> tien_de_ma_dang));
alter table public.lyhoa_de_xuat add constraint lyhoa_de_xuat_hinh_dang CHECK ((((loai = 'dang_moi'::text) AND (ten IS NOT NULL) AND (mo_ta_ngan IS NOT NULL) AND (ma_dang IS NULL)) OR ((loai = 'cum_moi'::text) AND (ten IS NOT NULL) AND (ma_dang IS NOT NULL)) OR ((loai = 'trao_doi'::text) AND (ten IS NULL))));
alter table public.lyhoa_de_xuat add constraint lyhoa_de_xuat_loai_check CHECK ((loai = ANY (ARRAY['dang_moi'::text, 'cum_moi'::text, 'trao_doi'::text])));
alter table public.lyhoa_de_xuat add constraint lyhoa_de_xuat_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.lyhoa_de_xuat_quyet_dinh add constraint lyhoa_de_xuat_qd_tra_loi CHECK (((hanh_dong <> ALL (ARRAY['bac'::text, 'tra_loi'::text])) OR (NULLIF(btrim(tra_loi), ''::text) IS NOT NULL)));
alter table public.lyhoa_de_xuat_quyet_dinh add constraint lyhoa_de_xuat_quyet_dinh_hanh_dong_check CHECK ((hanh_dong = ANY (ARRAY['nhan'::text, 'nhan_co_sua'::text, 'gop'::text, 'bac'::text, 'tra_loi'::text])));
alter table public.lyhoa_mcq_rule add constraint lyhoa_mcq_rule_nhom_check CHECK ((nhom = ANY (ARRAY['khai_niem'::text, 'tinh'::text])));
alter table public.lyhoa_ban_do add constraint lyhoa_ban_do_bac_toi_thieu_fkey FOREIGN KEY (bac_toi_thieu) REFERENCES lop_bac(ma);
alter table public.lyhoa_bdm_cau_thieu_dang add constraint lyhoa_bdm_cau_thieu_dang_chu_de_id_fkey FOREIGN KEY (chu_de_id) REFERENCES lyhoa_bdm_chu_de(id);
alter table public.lyhoa_bdm_cau_thieu_dang add constraint lyhoa_bdm_cau_thieu_dang_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau);
alter table public.lyhoa_bdm_dang_bai add constraint lyhoa_bdm_dang_bai_nhom_id_fkey FOREIGN KEY (nhom_id) REFERENCES lyhoa_bdm_nhom(id);
alter table public.lyhoa_bdm_de_xuat add constraint lyhoa_bdm_de_xuat_dang_bai_id_fkey FOREIGN KEY (dang_bai_id) REFERENCES lyhoa_bdm_dang_bai(id);
alter table public.lyhoa_bdm_de_xuat add constraint lyhoa_bdm_de_xuat_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau);
alter table public.lyhoa_bdm_gan_cau add constraint lyhoa_bdm_gan_cau_dang_bai_id_fkey FOREIGN KEY (dang_bai_id) REFERENCES lyhoa_bdm_dang_bai(id);
alter table public.lyhoa_bdm_gan_cau add constraint lyhoa_bdm_gan_cau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau);
alter table public.lyhoa_bdm_kiem_mau add constraint lyhoa_bdm_kiem_mau_dang_bai_ai_id_fkey FOREIGN KEY (dang_bai_ai_id) REFERENCES lyhoa_bdm_dang_bai(id);
alter table public.lyhoa_bdm_kiem_mau add constraint lyhoa_bdm_kiem_mau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau);
alter table public.lyhoa_bdm_nhom add constraint lyhoa_bdm_nhom_chu_de_id_chuyen_de_id_fkey FOREIGN KEY (chu_de_id, chuyen_de_id) REFERENCES lyhoa_bdm_o(chu_de_id, chuyen_de_id) ON UPDATE CASCADE;
alter table public.lyhoa_bdm_nhom_tien_de add constraint lyhoa_bdm_nhom_tien_de_nhom_id_fkey FOREIGN KEY (nhom_id) REFERENCES lyhoa_bdm_nhom(id);
alter table public.lyhoa_bdm_nhom_tien_de add constraint lyhoa_bdm_nhom_tien_de_tien_de_nhom_id_fkey FOREIGN KEY (tien_de_nhom_id) REFERENCES lyhoa_bdm_nhom(id);
alter table public.lyhoa_bdm_o add constraint lyhoa_bdm_o_chu_de_id_fkey FOREIGN KEY (chu_de_id) REFERENCES lyhoa_bdm_chu_de(id);
alter table public.lyhoa_bdm_o add constraint lyhoa_bdm_o_chuyen_de_id_fkey FOREIGN KEY (chuyen_de_id) REFERENCES lyhoa_bdm_chuyen_de(id);
alter table public.lyhoa_cau_form_tn add constraint lyhoa_cau_form_tn_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id);
alter table public.lyhoa_cau_form_tn add constraint lyhoa_cau_form_tn_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau);
alter table public.lyhoa_cau_form_tn add constraint lyhoa_cau_form_tn_tu_choi_boi_fkey FOREIGN KEY (tu_choi_boi) REFERENCES nhan_su(id);
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_dang_chinh_fkey FOREIGN KEY (dang_chinh) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id);
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_kiem_may_lo_fkey FOREIGN KEY (kiem_may_lo) REFERENCES kho_kiem_lo(id);
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_ma_cum_fkey FOREIGN KEY (ma_cum) REFERENCES lyhoa_cum_bai(ma_cum) ON DELETE SET NULL;
alter table public.lyhoa_cau_hoi add constraint lyhoa_cau_hoi_parent_ma_cau_fkey FOREIGN KEY (parent_ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau) ON UPDATE CASCADE;
alter table public.lyhoa_cau_hoi_yeu_cau_giai add constraint lyhoa_cau_hoi_yeu_cau_giai_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.lyhoa_cau_hoi_yeu_cau_giai add constraint lyhoa_cau_hoi_yeu_cau_giai_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau) ON DELETE CASCADE;
alter table public.lyhoa_cau_hoi_yeu_cau_giai add constraint lyhoa_cau_hoi_yeu_cau_giai_nguoi_giai_fkey FOREIGN KEY (nguoi_giai) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.lyhoa_cau_hoi_yeu_cau_giai add constraint lyhoa_cau_hoi_yeu_cau_giai_nguoi_yeu_cau_fkey FOREIGN KEY (nguoi_yeu_cau) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.lyhoa_cum_bai add constraint lyhoa_cum_bai_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.lyhoa_cum_tien_de add constraint lyhoa_cum_tien_de_ma_cum_fkey FOREIGN KEY (ma_cum) REFERENCES lyhoa_cum_bai(ma_cum) ON DELETE CASCADE;
alter table public.lyhoa_cum_tien_de add constraint lyhoa_cum_tien_de_tien_de_ma_cum_fkey FOREIGN KEY (tien_de_ma_cum) REFERENCES lyhoa_cum_bai(ma_cum) ON DELETE CASCADE;
alter table public.lyhoa_dang_ly_thuyet add constraint lyhoa_dang_ly_thuyet_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.lyhoa_dang_tien_de add constraint lyhoa_dang_tien_de_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.lyhoa_dang_tien_de add constraint lyhoa_dang_tien_de_tien_de_ma_dang_fkey FOREIGN KEY (tien_de_ma_dang) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.lyhoa_de_xuat add constraint lyhoa_de_xuat_dang_gan_nhat_fkey FOREIGN KEY (dang_gan_nhat) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.lyhoa_de_xuat add constraint lyhoa_de_xuat_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.lyhoa_de_xuat_cau add constraint lyhoa_de_xuat_cau_de_xuat_id_fkey FOREIGN KEY (de_xuat_id) REFERENCES lyhoa_de_xuat(id) ON DELETE CASCADE;
alter table public.lyhoa_de_xuat_cau add constraint lyhoa_de_xuat_cau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES lyhoa_cau_hoi(ma_cau) ON UPDATE CASCADE;
alter table public.lyhoa_de_xuat_quyet_dinh add constraint lyhoa_de_xuat_quyet_dinh_de_xuat_id_fkey FOREIGN KEY (de_xuat_id) REFERENCES lyhoa_de_xuat(id) ON DELETE CASCADE;
alter table public.lyhoa_de_xuat_quyet_dinh add constraint lyhoa_de_xuat_quyet_dinh_ket_qua_ma_cum_fkey FOREIGN KEY (ket_qua_ma_cum) REFERENCES lyhoa_cum_bai(ma_cum) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.lyhoa_de_xuat_quyet_dinh add constraint lyhoa_de_xuat_quyet_dinh_ket_qua_ma_dang_fkey FOREIGN KEY (ket_qua_ma_dang) REFERENCES lyhoa_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.lyhoa_de_xuat_quyet_dinh add constraint lyhoa_de_xuat_quyet_dinh_nguoi_fkey FOREIGN KEY (nguoi) REFERENCES nhan_su(id);

-- (A4) RLS + policy + quyền
alter table public.lyhoa_ban_do enable row level security;
create policy "lyhoa_ban_do_member_all" on public.lyhoa_ban_do as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_ban_do to anon;
grant SELECT on public.lyhoa_ban_do to anon;
grant UPDATE on public.lyhoa_ban_do to anon;
grant DELETE on public.lyhoa_ban_do to anon;
grant INSERT on public.lyhoa_ban_do to authenticated;
grant SELECT on public.lyhoa_ban_do to authenticated;
grant UPDATE on public.lyhoa_ban_do to authenticated;
grant DELETE on public.lyhoa_ban_do to authenticated;
alter table public.lyhoa_cau_hoi enable row level security;
create policy "lyhoa_cau_hoi_member_all" on public.lyhoa_cau_hoi as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_cau_hoi to anon;
grant SELECT on public.lyhoa_cau_hoi to anon;
grant UPDATE on public.lyhoa_cau_hoi to anon;
grant DELETE on public.lyhoa_cau_hoi to anon;
grant INSERT on public.lyhoa_cau_hoi to authenticated;
grant SELECT on public.lyhoa_cau_hoi to authenticated;
grant UPDATE on public.lyhoa_cau_hoi to authenticated;
grant DELETE on public.lyhoa_cau_hoi to authenticated;
alter table public.lyhoa_dang_ly_thuyet enable row level security;
create policy "lyhoa_dang_ly_thuyet_member_all" on public.lyhoa_dang_ly_thuyet as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_dang_ly_thuyet to anon;
grant SELECT on public.lyhoa_dang_ly_thuyet to anon;
grant UPDATE on public.lyhoa_dang_ly_thuyet to anon;
grant DELETE on public.lyhoa_dang_ly_thuyet to anon;
grant INSERT on public.lyhoa_dang_ly_thuyet to authenticated;
grant SELECT on public.lyhoa_dang_ly_thuyet to authenticated;
grant UPDATE on public.lyhoa_dang_ly_thuyet to authenticated;
grant DELETE on public.lyhoa_dang_ly_thuyet to authenticated;
alter table public.lyhoa_chuyen_de_ly_thuyet enable row level security;
create policy "lyhoa_chuyen_de_ly_thuyet_member_all" on public.lyhoa_chuyen_de_ly_thuyet as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_chuyen_de_ly_thuyet to anon;
grant SELECT on public.lyhoa_chuyen_de_ly_thuyet to anon;
grant UPDATE on public.lyhoa_chuyen_de_ly_thuyet to anon;
grant DELETE on public.lyhoa_chuyen_de_ly_thuyet to anon;
grant INSERT on public.lyhoa_chuyen_de_ly_thuyet to authenticated;
grant SELECT on public.lyhoa_chuyen_de_ly_thuyet to authenticated;
grant UPDATE on public.lyhoa_chuyen_de_ly_thuyet to authenticated;
grant DELETE on public.lyhoa_chuyen_de_ly_thuyet to authenticated;
alter table public.lyhoa_cum_bai enable row level security;
create policy "lyhoa_cum_bai_member_all" on public.lyhoa_cum_bai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_cum_bai to anon;
grant SELECT on public.lyhoa_cum_bai to anon;
grant UPDATE on public.lyhoa_cum_bai to anon;
grant DELETE on public.lyhoa_cum_bai to anon;
grant INSERT on public.lyhoa_cum_bai to authenticated;
grant SELECT on public.lyhoa_cum_bai to authenticated;
grant UPDATE on public.lyhoa_cum_bai to authenticated;
grant DELETE on public.lyhoa_cum_bai to authenticated;
alter table public.lyhoa_dang_tien_de enable row level security;
create policy "lyhoa_dang_tien_de_member_all" on public.lyhoa_dang_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_dang_tien_de to anon;
grant SELECT on public.lyhoa_dang_tien_de to anon;
grant UPDATE on public.lyhoa_dang_tien_de to anon;
grant DELETE on public.lyhoa_dang_tien_de to anon;
grant INSERT on public.lyhoa_dang_tien_de to authenticated;
grant SELECT on public.lyhoa_dang_tien_de to authenticated;
grant UPDATE on public.lyhoa_dang_tien_de to authenticated;
grant DELETE on public.lyhoa_dang_tien_de to authenticated;
alter table public.lyhoa_cum_tien_de enable row level security;
create policy "lyhoa_cum_tien_de_member_all" on public.lyhoa_cum_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_cum_tien_de to anon;
grant SELECT on public.lyhoa_cum_tien_de to anon;
grant UPDATE on public.lyhoa_cum_tien_de to anon;
grant DELETE on public.lyhoa_cum_tien_de to anon;
grant INSERT on public.lyhoa_cum_tien_de to authenticated;
grant SELECT on public.lyhoa_cum_tien_de to authenticated;
grant UPDATE on public.lyhoa_cum_tien_de to authenticated;
grant DELETE on public.lyhoa_cum_tien_de to authenticated;
alter table public.lyhoa_cau_hoi_yeu_cau_giai enable row level security;
create policy "lyhoa_cau_hoi_yeu_cau_giai_member_all" on public.lyhoa_cau_hoi_yeu_cau_giai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_cau_hoi_yeu_cau_giai to anon;
grant SELECT on public.lyhoa_cau_hoi_yeu_cau_giai to anon;
grant UPDATE on public.lyhoa_cau_hoi_yeu_cau_giai to anon;
grant DELETE on public.lyhoa_cau_hoi_yeu_cau_giai to anon;
grant INSERT on public.lyhoa_cau_hoi_yeu_cau_giai to authenticated;
grant SELECT on public.lyhoa_cau_hoi_yeu_cau_giai to authenticated;
grant UPDATE on public.lyhoa_cau_hoi_yeu_cau_giai to authenticated;
grant DELETE on public.lyhoa_cau_hoi_yeu_cau_giai to authenticated;
alter table public.lyhoa_de_xuat enable row level security;
create policy "lyhoa_de_xuat_select" on public.lyhoa_de_xuat as permissive for select to authenticated using (true);
grant INSERT on public.lyhoa_de_xuat to anon;
grant SELECT on public.lyhoa_de_xuat to anon;
grant UPDATE on public.lyhoa_de_xuat to anon;
grant DELETE on public.lyhoa_de_xuat to anon;
grant INSERT on public.lyhoa_de_xuat to authenticated;
grant SELECT on public.lyhoa_de_xuat to authenticated;
grant UPDATE on public.lyhoa_de_xuat to authenticated;
grant DELETE on public.lyhoa_de_xuat to authenticated;
alter table public.lyhoa_de_xuat_cau enable row level security;
create policy "lyhoa_de_xuat_cau_select" on public.lyhoa_de_xuat_cau as permissive for select to authenticated using (true);
grant INSERT on public.lyhoa_de_xuat_cau to anon;
grant SELECT on public.lyhoa_de_xuat_cau to anon;
grant UPDATE on public.lyhoa_de_xuat_cau to anon;
grant DELETE on public.lyhoa_de_xuat_cau to anon;
grant INSERT on public.lyhoa_de_xuat_cau to authenticated;
grant SELECT on public.lyhoa_de_xuat_cau to authenticated;
grant UPDATE on public.lyhoa_de_xuat_cau to authenticated;
grant DELETE on public.lyhoa_de_xuat_cau to authenticated;
alter table public.lyhoa_de_xuat_quyet_dinh enable row level security;
create policy "lyhoa_de_xuat_quyet_dinh_select" on public.lyhoa_de_xuat_quyet_dinh as permissive for select to authenticated using (true);
grant INSERT on public.lyhoa_de_xuat_quyet_dinh to anon;
grant SELECT on public.lyhoa_de_xuat_quyet_dinh to anon;
grant UPDATE on public.lyhoa_de_xuat_quyet_dinh to anon;
grant DELETE on public.lyhoa_de_xuat_quyet_dinh to anon;
grant INSERT on public.lyhoa_de_xuat_quyet_dinh to authenticated;
grant SELECT on public.lyhoa_de_xuat_quyet_dinh to authenticated;
grant UPDATE on public.lyhoa_de_xuat_quyet_dinh to authenticated;
grant DELETE on public.lyhoa_de_xuat_quyet_dinh to authenticated;
alter table public.lyhoa_mcq_rule enable row level security;
create policy "lyhoa_mcq_rule_member_all" on public.lyhoa_mcq_rule as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_mcq_rule to anon;
grant SELECT on public.lyhoa_mcq_rule to anon;
grant UPDATE on public.lyhoa_mcq_rule to anon;
grant DELETE on public.lyhoa_mcq_rule to anon;
grant INSERT on public.lyhoa_mcq_rule to authenticated;
grant SELECT on public.lyhoa_mcq_rule to authenticated;
grant UPDATE on public.lyhoa_mcq_rule to authenticated;
grant DELETE on public.lyhoa_mcq_rule to authenticated;
alter table public.lyhoa_cau_form_tn enable row level security;
create policy "lyhoa_cau_form_tn_member_all" on public.lyhoa_cau_form_tn as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_cau_form_tn to anon;
grant SELECT on public.lyhoa_cau_form_tn to anon;
grant UPDATE on public.lyhoa_cau_form_tn to anon;
grant DELETE on public.lyhoa_cau_form_tn to anon;
grant INSERT on public.lyhoa_cau_form_tn to authenticated;
grant SELECT on public.lyhoa_cau_form_tn to authenticated;
grant UPDATE on public.lyhoa_cau_form_tn to authenticated;
grant DELETE on public.lyhoa_cau_form_tn to authenticated;
alter table public.lyhoa_bdm_chu_de enable row level security;
create policy "lyhoa_bdm_chu_de_member_all" on public.lyhoa_bdm_chu_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_chu_de to anon;
grant SELECT on public.lyhoa_bdm_chu_de to anon;
grant UPDATE on public.lyhoa_bdm_chu_de to anon;
grant DELETE on public.lyhoa_bdm_chu_de to anon;
grant INSERT on public.lyhoa_bdm_chu_de to authenticated;
grant SELECT on public.lyhoa_bdm_chu_de to authenticated;
grant UPDATE on public.lyhoa_bdm_chu_de to authenticated;
grant DELETE on public.lyhoa_bdm_chu_de to authenticated;
alter table public.lyhoa_bdm_chuyen_de enable row level security;
create policy "lyhoa_bdm_chuyen_de_member_all" on public.lyhoa_bdm_chuyen_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_chuyen_de to anon;
grant SELECT on public.lyhoa_bdm_chuyen_de to anon;
grant UPDATE on public.lyhoa_bdm_chuyen_de to anon;
grant DELETE on public.lyhoa_bdm_chuyen_de to anon;
grant INSERT on public.lyhoa_bdm_chuyen_de to authenticated;
grant SELECT on public.lyhoa_bdm_chuyen_de to authenticated;
grant UPDATE on public.lyhoa_bdm_chuyen_de to authenticated;
grant DELETE on public.lyhoa_bdm_chuyen_de to authenticated;
alter table public.lyhoa_bdm_o enable row level security;
create policy "lyhoa_bdm_o_member_all" on public.lyhoa_bdm_o as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_o to anon;
grant SELECT on public.lyhoa_bdm_o to anon;
grant UPDATE on public.lyhoa_bdm_o to anon;
grant DELETE on public.lyhoa_bdm_o to anon;
grant INSERT on public.lyhoa_bdm_o to authenticated;
grant SELECT on public.lyhoa_bdm_o to authenticated;
grant UPDATE on public.lyhoa_bdm_o to authenticated;
grant DELETE on public.lyhoa_bdm_o to authenticated;
alter table public.lyhoa_bdm_nhom enable row level security;
create policy "lyhoa_bdm_nhom_member_all" on public.lyhoa_bdm_nhom as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_nhom to anon;
grant SELECT on public.lyhoa_bdm_nhom to anon;
grant UPDATE on public.lyhoa_bdm_nhom to anon;
grant DELETE on public.lyhoa_bdm_nhom to anon;
grant INSERT on public.lyhoa_bdm_nhom to authenticated;
grant SELECT on public.lyhoa_bdm_nhom to authenticated;
grant UPDATE on public.lyhoa_bdm_nhom to authenticated;
grant DELETE on public.lyhoa_bdm_nhom to authenticated;
alter table public.lyhoa_bdm_dang_bai enable row level security;
create policy "lyhoa_bdm_dang_bai_member_all" on public.lyhoa_bdm_dang_bai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_dang_bai to anon;
grant SELECT on public.lyhoa_bdm_dang_bai to anon;
grant UPDATE on public.lyhoa_bdm_dang_bai to anon;
grant DELETE on public.lyhoa_bdm_dang_bai to anon;
grant INSERT on public.lyhoa_bdm_dang_bai to authenticated;
grant SELECT on public.lyhoa_bdm_dang_bai to authenticated;
grant UPDATE on public.lyhoa_bdm_dang_bai to authenticated;
grant DELETE on public.lyhoa_bdm_dang_bai to authenticated;
alter table public.lyhoa_bdm_nhom_tien_de enable row level security;
create policy "lyhoa_bdm_nhom_tien_de_member_all" on public.lyhoa_bdm_nhom_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_nhom_tien_de to anon;
grant SELECT on public.lyhoa_bdm_nhom_tien_de to anon;
grant UPDATE on public.lyhoa_bdm_nhom_tien_de to anon;
grant DELETE on public.lyhoa_bdm_nhom_tien_de to anon;
grant INSERT on public.lyhoa_bdm_nhom_tien_de to authenticated;
grant SELECT on public.lyhoa_bdm_nhom_tien_de to authenticated;
grant UPDATE on public.lyhoa_bdm_nhom_tien_de to authenticated;
grant DELETE on public.lyhoa_bdm_nhom_tien_de to authenticated;
alter table public.lyhoa_bdm_gan_cau enable row level security;
create policy "lyhoa_bdm_gan_cau_member_all" on public.lyhoa_bdm_gan_cau as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_gan_cau to anon;
grant SELECT on public.lyhoa_bdm_gan_cau to anon;
grant UPDATE on public.lyhoa_bdm_gan_cau to anon;
grant DELETE on public.lyhoa_bdm_gan_cau to anon;
grant INSERT on public.lyhoa_bdm_gan_cau to authenticated;
grant SELECT on public.lyhoa_bdm_gan_cau to authenticated;
grant UPDATE on public.lyhoa_bdm_gan_cau to authenticated;
grant DELETE on public.lyhoa_bdm_gan_cau to authenticated;
alter table public.lyhoa_bdm_log enable row level security;
create policy "lyhoa_bdm_log_member_read" on public.lyhoa_bdm_log as permissive for select to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_log to authenticated;
grant SELECT on public.lyhoa_bdm_log to authenticated;
grant UPDATE on public.lyhoa_bdm_log to authenticated;
grant DELETE on public.lyhoa_bdm_log to authenticated;
alter table public.lyhoa_bdm_de_xuat enable row level security;
create policy "lyhoa_bdm_de_xuat_member_all" on public.lyhoa_bdm_de_xuat as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_de_xuat to authenticated;
grant SELECT on public.lyhoa_bdm_de_xuat to authenticated;
grant UPDATE on public.lyhoa_bdm_de_xuat to authenticated;
grant DELETE on public.lyhoa_bdm_de_xuat to authenticated;
alter table public.lyhoa_bdm_cau_thieu_dang enable row level security;
create policy "lyhoa_bdm_cau_thieu_dang_member_all" on public.lyhoa_bdm_cau_thieu_dang as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_cau_thieu_dang to authenticated;
grant SELECT on public.lyhoa_bdm_cau_thieu_dang to authenticated;
grant UPDATE on public.lyhoa_bdm_cau_thieu_dang to authenticated;
grant DELETE on public.lyhoa_bdm_cau_thieu_dang to authenticated;
alter table public.lyhoa_bdm_kiem_mau enable row level security;
create policy "lyhoa_bdm_kiem_mau_member_all" on public.lyhoa_bdm_kiem_mau as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_kiem_mau to authenticated;
grant SELECT on public.lyhoa_bdm_kiem_mau to authenticated;
grant UPDATE on public.lyhoa_bdm_kiem_mau to authenticated;
grant DELETE on public.lyhoa_bdm_kiem_mau to authenticated;
alter table public.lyhoa_bdm_tu_choi enable row level security;
create policy "lyhoa_bdm_tu_choi_member_all" on public.lyhoa_bdm_tu_choi as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.lyhoa_bdm_tu_choi to authenticated;
grant SELECT on public.lyhoa_bdm_tu_choi to authenticated;
grant UPDATE on public.lyhoa_bdm_tu_choi to authenticated;
grant DELETE on public.lyhoa_bdm_tu_choi to authenticated;
grant SELECT on sequence public.lyhoa_bdm_chu_de_seq to anon;
grant USAGE on sequence public.lyhoa_bdm_chu_de_seq to anon;
grant SELECT on sequence public.lyhoa_bdm_chu_de_seq to authenticated;
grant USAGE on sequence public.lyhoa_bdm_chu_de_seq to authenticated;
grant SELECT on sequence public.lyhoa_bdm_chuyen_de_seq to anon;
grant USAGE on sequence public.lyhoa_bdm_chuyen_de_seq to anon;
grant SELECT on sequence public.lyhoa_bdm_chuyen_de_seq to authenticated;
grant USAGE on sequence public.lyhoa_bdm_chuyen_de_seq to authenticated;
grant SELECT on sequence public.lyhoa_bdm_dang_bai_seq to anon;
grant USAGE on sequence public.lyhoa_bdm_dang_bai_seq to anon;
grant SELECT on sequence public.lyhoa_bdm_dang_bai_seq to authenticated;
grant USAGE on sequence public.lyhoa_bdm_dang_bai_seq to authenticated;
grant SELECT on sequence public.lyhoa_bdm_log_id_seq to anon;
grant USAGE on sequence public.lyhoa_bdm_log_id_seq to anon;
grant SELECT on sequence public.lyhoa_bdm_log_id_seq to authenticated;
grant USAGE on sequence public.lyhoa_bdm_log_id_seq to authenticated;
grant SELECT on sequence public.lyhoa_bdm_nhom_seq to anon;
grant USAGE on sequence public.lyhoa_bdm_nhom_seq to anon;
grant SELECT on sequence public.lyhoa_bdm_nhom_seq to authenticated;
grant USAGE on sequence public.lyhoa_bdm_nhom_seq to authenticated;
grant SELECT on sequence public.lyhoa_bdm_tu_choi_id_seq to anon;
grant USAGE on sequence public.lyhoa_bdm_tu_choi_id_seq to anon;
grant SELECT on sequence public.lyhoa_bdm_tu_choi_id_seq to authenticated;
grant USAGE on sequence public.lyhoa_bdm_tu_choi_id_seq to authenticated;
grant SELECT on sequence public.lyhoa_cau_seq to anon;
grant USAGE on sequence public.lyhoa_cau_seq to anon;
grant SELECT on sequence public.lyhoa_cau_seq to authenticated;
grant USAGE on sequence public.lyhoa_cau_seq to authenticated;
grant SELECT on sequence public.lyhoa_cum_seq to anon;
grant USAGE on sequence public.lyhoa_cum_seq to anon;
grant SELECT on sequence public.lyhoa_cum_seq to authenticated;
grant USAGE on sequence public.lyhoa_cum_seq to authenticated;
grant SELECT on sequence public.lyhoa_dang_seq to anon;
grant USAGE on sequence public.lyhoa_dang_seq to anon;
grant SELECT on sequence public.lyhoa_dang_seq to authenticated;
grant USAGE on sequence public.lyhoa_dang_seq to authenticated;

-- (B) hàm riêng (nhân bản fn_khtn_* · _khtn_* · khtn_*)
CREATE OR REPLACE FUNCTION public.lyhoa_dang_tien_de_bao_dong(goc text)
 RETURNS TABLE(ma_dang text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.tien_de_ma_dang as id, 1 as do_sau, array[goc, t.tien_de_ma_dang] as duong
      from lyhoa_dang_tien_de t where t.ma_dang = goc
    union all
    select t.tien_de_ma_dang, d.do_sau + 1, d.duong || t.tien_de_ma_dang
      from lyhoa_dang_tien_de t join di d on t.ma_dang = d.id
     where not t.tien_de_ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.lyhoa_dang_tien_de_bao_dong(goc text) from public;
revoke all on function public.lyhoa_dang_tien_de_bao_dong(goc text) from anon;
grant execute on function public.lyhoa_dang_tien_de_bao_dong(goc text) to authenticated;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public.lyhoa_dang_tien_de_bao_dong(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.lyhoa_dang_hau_due(goc text)
 RETURNS TABLE(ma_dang text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from lyhoa_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from lyhoa_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.lyhoa_dang_hau_due(goc text) from public;
revoke all on function public.lyhoa_dang_hau_due(goc text) from anon;
grant execute on function public.lyhoa_dang_hau_due(goc text) to authenticated;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public.lyhoa_dang_hau_due(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.lyhoa_cum_tien_de_bao_dong(goc text)
 RETURNS TABLE(ma_cum text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.tien_de_ma_cum as id, 1 as do_sau, array[goc, t.tien_de_ma_cum] as duong
      from lyhoa_cum_tien_de t where t.ma_cum = goc
    union all
    select t.tien_de_ma_cum, d.do_sau + 1, d.duong || t.tien_de_ma_cum
      from lyhoa_cum_tien_de t join di d on t.ma_cum = d.id
     where not t.tien_de_ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.lyhoa_cum_tien_de_bao_dong(goc text) from public;
revoke all on function public.lyhoa_cum_tien_de_bao_dong(goc text) from anon;
grant execute on function public.lyhoa_cum_tien_de_bao_dong(goc text) to authenticated;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public.lyhoa_cum_tien_de_bao_dong(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.lyhoa_cum_hau_due(goc text)
 RETURNS TABLE(ma_cum text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from lyhoa_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from lyhoa_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.lyhoa_cum_hau_due(goc text) from public;
revoke all on function public.lyhoa_cum_hau_due(goc text) from anon;
grant execute on function public.lyhoa_cum_hau_due(goc text) to authenticated;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public.lyhoa_cum_hau_due(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_sinh_ma_dang(p_ma_chuyen_de text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare v_stt int; v_ma text;
begin
  if p_ma_chuyen_de !~ '^L[0-9]{6}$' or right(p_ma_chuyen_de, 4) = '0000' then
    raise exception 'fn_lyhoa_sinh_ma_dang: chuyên đề "%" không hợp lệ', p_ma_chuyen_de;
  end if;
  select coalesce(max(substring(ma_dang from 8 for 2)::int), 0) + 1 into v_stt
    from lyhoa_ban_do where ma_dang ~ ('^' || p_ma_chuyen_de || '[0-9]{2}$');
  if v_stt > 99 then raise exception 'fn_lyhoa_sinh_ma_dang: chuyên đề % đã đủ 99 dạng', p_ma_chuyen_de; end if;
  v_ma := p_ma_chuyen_de || lpad(v_stt::text, 2, '0');
  if exists (select 1 from lyhoa_ban_do where ma_dang = v_ma) then raise exception 'fn_lyhoa_sinh_ma_dang: mã "%" đã tồn tại', v_ma; end if;
  return v_ma;
end $function$
;
revoke all on function public.fn_lyhoa_sinh_ma_dang(p_ma_chuyen_de text) from public;
revoke all on function public.fn_lyhoa_sinh_ma_dang(p_ma_chuyen_de text) from anon;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_de_xuat_ds(p_khoi text, p_chi_cho boolean DEFAULT true)
 RETURNS TABLE(id uuid, loai text, khoi text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text, ten text, mo_ta_ngan text, dang_gan_nhat text, ten_dang_gan_nhat text, ly_do text, lo text, nguon text, created_at timestamp with time zone, cau jsonb, quyet_dinh jsonb)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select d.id, d.loai, d.khoi, d.ma_chuyen_de,
         (select b.ten_chuyen_de from lyhoa_ban_do b where b.ma_chuyen_de = d.ma_chuyen_de limit 1),
         d.ma_dang, (select b.ten_dang from lyhoa_ban_do b where b.ma_dang = d.ma_dang),
         d.ten, d.mo_ta_ngan, d.dang_gan_nhat, (select b.ten_dang from lyhoa_ban_do b where b.ma_dang = d.dang_gan_nhat),
         d.ly_do, d.lo, d.nguon, d.created_at,
         coalesce((select jsonb_agg(jsonb_build_object(
                     'ma_cau', q.ma_cau, 'loai_cau', q.loai_cau, 'noi_dung', left(q.noi_dung, 700),
                     'dang_chinh', q.dang_chinh, 'da_duyet', q.da_duyet) order by q.ma_cau)
                     from lyhoa_de_xuat_cau c join lyhoa_cau_hoi q on q.ma_cau = c.ma_cau
                    where c.de_xuat_id = d.id), '[]'::jsonb),
         (select to_jsonb(x) from (select qd.hanh_dong, qd.ket_qua_ma_dang, qd.ket_qua_ma_cum, qd.tra_loi, qd.so_cau_doi, qd.quyet_at,
                                          (select ns.ho_ten from nhan_su ns where ns.id = qd.nguoi) nguoi_ten
                                     from lyhoa_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id) x)
    from lyhoa_de_xuat d
   where d.khoi = p_khoi
     and (not p_chi_cho or not exists (select 1 from lyhoa_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))
   order by d.lo, d.ma_chuyen_de, d.created_at
   limit 500
$function$
;
revoke all on function public.fn_lyhoa_de_xuat_ds(p_khoi text, p_chi_cho boolean) from public;
revoke all on function public.fn_lyhoa_de_xuat_ds(p_khoi text, p_chi_cho boolean) from anon;
grant execute on function public.fn_lyhoa_de_xuat_ds(p_khoi text, p_chi_cho boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang_dich text DEFAULT NULL::text, p_tra_loi text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d        lyhoa_de_xuat%rowtype;
  v_nguoi  uuid := public.current_nhan_su_id();
  v_hd     text := p_hanh_dong;
  v_ma     text;
  v_cum    text;
  v_n      int := 0;
  v_bo_qua int := 0;
  m        record;
begin
  if v_nguoi is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;

  select * into d from lyhoa_de_xuat where id = p_id for update;
  if not found then raise exception 'Đề xuất không tồn tại'; end if;
  if exists (select 1 from lyhoa_de_xuat_quyet_dinh where de_xuat_id = p_id) then raise exception 'Đề xuất này đã được quyết rồi'; end if;

  if not ((d.loai = 'dang_moi' and v_hd in ('nhan', 'gop', 'bac'))
       or (d.loai = 'cum_moi'  and v_hd in ('nhan', 'bac'))
       or (d.loai = 'trao_doi' and v_hd = 'tra_loi')) then
    raise exception 'Hành động "%" không hợp lệ cho đề xuất loại "%"', v_hd, d.loai;
  end if;
  if v_hd in ('bac', 'tra_loi') and nullif(btrim(p_tra_loi), '') is null then
    raise exception 'Phải ghi lý do / câu trả lời — đây là thứ biến thành luật cho lô sau';
  end if;
  if v_hd = 'gop' and p_ma_dang_dich is null then raise exception 'Gộp thì phải chọn dạng đích'; end if;
  if p_ma_dang_dich is not null and not exists (select 1 from lyhoa_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'Dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;
  if p_ma_dang_dich is not null and public._kho_la_dang_cho(p_ma_dang_dich) then
    raise exception 'Không dời câu về dạng chờ';
  end if;

  select count(*) into v_bo_qua from lyhoa_de_xuat_cau c join lyhoa_cau_hoi q on q.ma_cau = c.ma_cau
   where c.de_xuat_id = p_id and q.da_duyet;

  if d.loai = 'dang_moi' and v_hd = 'nhan' then
    select * into m from lyhoa_ban_do where ma_chuyen_de = d.ma_chuyen_de and not public._kho_la_dang_cho(ma_dang) order by ma_dang limit 1;
    if not found then raise exception 'Chuyên đề "%" chưa có dạng nào để lấy tên chủ đề/chuyên đề', d.ma_chuyen_de; end if;
    v_ma := public.fn_lyhoa_sinh_ma_dang(d.ma_chuyen_de);
    insert into lyhoa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
    values (v_ma, m.khoi, m.ma_chu_de, m.ten_chu_de, m.ma_chuyen_de, m.ten_chuyen_de,
            coalesce(nullif(btrim(p_ten), ''), d.ten), m.muc_do, m.bac_toi_thieu, coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan));
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten
       or coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan) is distinct from d.mo_ta_ngan then
      v_hd := 'nhan_co_sua';
    end if;
  elsif v_hd in ('gop', 'tra_loi') then
    v_ma := p_ma_dang_dich;          -- tra_loi không chỉ định dạng ⇒ null, không dời câu
  elsif d.loai = 'cum_moi' and v_hd = 'nhan' then
    insert into lyhoa_cum_bai (ma_dang, ten, thu_tu)
    values (d.ma_dang, coalesce(nullif(btrim(p_ten), ''), d.ten),
            coalesce((select max(thu_tu) from lyhoa_cum_bai where ma_dang = d.ma_dang), 0) + 1)
    returning ma_cum into v_cum;
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten then v_hd := 'nhan_co_sua'; end if;
    update lyhoa_cau_hoi q set ma_cum = v_cum
      from lyhoa_de_xuat_cau c where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and q.dang_chinh = d.ma_dang;
    get diagnostics v_n = row_count;
  end if;

  if v_ma is not null then
    update lyhoa_cau_hoi q set dang_chinh = v_ma, ma_cum = null
      from lyhoa_de_xuat_cau c
     where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and not q.da_duyet and q.dang_chinh is distinct from v_ma;
    get diagnostics v_n = row_count;
  end if;

  insert into lyhoa_de_xuat_quyet_dinh (de_xuat_id, hanh_dong, ket_qua_ma_dang, ket_qua_ma_cum, tra_loi, so_cau_doi, nguoi)
  values (p_id, v_hd, v_ma, v_cum, nullif(btrim(p_tra_loi), ''), v_n, v_nguoi);

  return jsonb_build_object('hanh_dong', v_hd, 'ket_qua_ma_dang', v_ma, 'ket_qua_ma_cum', v_cum,
                            'so_cau_doi', v_n, 'so_cau_da_duyet_bo_qua', case when v_ma is null then 0 else v_bo_qua end);
end $function$
;
revoke all on function public.fn_lyhoa_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) from public;
revoke all on function public.fn_lyhoa_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) from anon;
grant execute on function public.fn_lyhoa_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang text DEFAULT NULL::text, p_dang_gan_nhat text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid; v_thieu text;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;
  if nullif(btrim(p_ly_do), '') is null then raise exception 'Phải ghi lý do / câu hỏi'; end if;
  if nullif(btrim(p_lo), '') is null then raise exception 'Thiếu mã lô'; end if;
  if coalesce(array_length(p_ma_cau, 1), 0) = 0 then raise exception 'Đề xuất phải có ít nhất 1 câu làm chứng'; end if;
  if not exists (select 1 from lyhoa_ban_do where ma_chuyen_de = p_ma_chuyen_de and khoi = p_khoi) then
    raise exception 'Chuyên đề "%" không thuộc khối %', p_ma_chuyen_de, p_khoi;
  end if;
  select string_agg(x, ', ') into v_thieu from unnest(p_ma_cau) x
   where not exists (select 1 from lyhoa_cau_hoi q where q.ma_cau = x and q.xoa_at is null);
  if v_thieu is not null then raise exception 'Câu không tồn tại: %', v_thieu; end if;

  insert into lyhoa_de_xuat (loai, khoi, ma_chuyen_de, ma_dang, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon)
  values (p_loai, p_khoi, p_ma_chuyen_de, p_ma_dang, nullif(btrim(p_ten), ''), nullif(btrim(p_mo_ta_ngan), ''),
          p_dang_gan_nhat, btrim(p_ly_do), btrim(p_lo), 'nguoi')
  returning id into v_id;
  insert into lyhoa_de_xuat_cau (de_xuat_id, ma_cau) select v_id, x from (select distinct unnest(p_ma_cau) x) t;
  return v_id;
end $function$
;
revoke all on function public.fn_lyhoa_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) from public;
revoke all on function public.fn_lyhoa_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) from anon;
grant execute on function public.fn_lyhoa_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_de_xuat_tk(p_khoi text)
 RETURNS TABLE(lo text, loai text, tong integer, cho integer, nhan integer, nhan_co_sua integer, gop integer, bac integer, tra_loi integer)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select d.lo, d.loai, count(*)::int,
         count(*) filter (where qd.de_xuat_id is null)::int,
         count(*) filter (where qd.hanh_dong = 'nhan')::int,
         count(*) filter (where qd.hanh_dong = 'nhan_co_sua')::int,
         count(*) filter (where qd.hanh_dong = 'gop')::int,
         count(*) filter (where qd.hanh_dong = 'bac')::int,
         count(*) filter (where qd.hanh_dong = 'tra_loi')::int
    from lyhoa_de_xuat d left join lyhoa_de_xuat_quyet_dinh qd on qd.de_xuat_id = d.id
   where d.khoi = p_khoi
   group by d.lo, d.loai order by d.lo, d.loai
$function$
;
revoke all on function public.fn_lyhoa_de_xuat_tk(p_khoi text) from public;
revoke all on function public.fn_lyhoa_de_xuat_tk(p_khoi text) from anon;
grant execute on function public.fn_lyhoa_de_xuat_tk(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.lyhoa_cau_form_tn_kiem()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
            and (e->>'rule' is null or not exists (select 1 from lyhoa_mcq_rule r where r.ma = e->>'rule'));
        if v_thieu is not null then raise exception 'phương án sai thiếu rule hoặc rule không tồn tại: %', v_thieu; end if;
        new.updated_at := now();
        return new;
      end $function$
;
revoke all on function public.lyhoa_cau_form_tn_kiem() from public;
revoke all on function public.lyhoa_cau_form_tn_kiem() from anon;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public.lyhoa_cau_form_tn_kiem() to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_thu_tu()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.thu_tu is not null then return new; end if;
  if tg_table_name = 'lyhoa_bdm_chu_de' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from lyhoa_bdm_chu_de where khoi = new.khoi;
  elsif tg_table_name = 'lyhoa_bdm_o' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from lyhoa_bdm_o where chu_de_id = new.chu_de_id;
  elsif tg_table_name = 'lyhoa_bdm_nhom' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from lyhoa_bdm_nhom where chu_de_id = new.chu_de_id and chuyen_de_id = new.chuyen_de_id;
  elsif tg_table_name = 'lyhoa_bdm_dang_bai' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from lyhoa_bdm_dang_bai where nhom_id = new.nhom_id;
  end if;
  return new;
end $function$
;
revoke all on function public._lyhoa_bdm_thu_tu() from public;
revoke all on function public._lyhoa_bdm_thu_tu() from anon;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_ghi_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r_cu  jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  r_moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r     jsonb := coalesce(r_moi, r_cu);
begin
  if tg_op = 'UPDATE' and (r_cu - 'updated_at') = (r_moi - 'updated_at') then return null; end if;
  insert into lyhoa_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id', r ->> 'ma_cau', (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id'), (r ->> 'nhom_id') || '>' || (r ->> 'tien_de_nhom_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end, r_cu, r_moi);
  return null;
end $function$
;
revoke all on function public._lyhoa_bdm_ghi_log() from public;
revoke all on function public._lyhoa_bdm_ghi_log() from anon;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_bump_nhom()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  update lyhoa_bdm_nhom set updated_at = now()
   where id in (case when tg_op <> 'INSERT' then old.nhom_id end, case when tg_op <> 'DELETE' then new.nhom_id end);
  return null;
end $function$
;
revoke all on function public._lyhoa_bdm_bump_nhom() from public;
revoke all on function public._lyhoa_bdm_bump_nhom() from anon;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_tien_de_kiem()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare a lyhoa_bdm_nhom; b lyhoa_bdm_nhom;
begin
  select * into a from lyhoa_bdm_nhom where id = new.nhom_id;
  select * into b from lyhoa_bdm_nhom where id = new.tien_de_nhom_id;
  if (a.chu_de_id, a.chuyen_de_id) is distinct from (b.chu_de_id, b.chuyen_de_id) then
    raise exception 'Đợt này tiền đề chỉ nối các nhóm bài trong cùng một chuyên đề («%» và «%» khác chuyên đề)', a.ten, b.ten;
  end if;
  if exists (
    with recursive t(id) as (
      select tien_de_nhom_id from lyhoa_bdm_nhom_tien_de where nhom_id = new.tien_de_nhom_id
      union
      select e.tien_de_nhom_id from lyhoa_bdm_nhom_tien_de e join t on e.nhom_id = t.id
    ) select 1 from t where t.id = new.nhom_id
  ) then
    raise exception 'Tạo vòng tròn: «%» đang phải học sau «%»', b.ten, a.ten;
  end if;
  return new;
end $function$
;
revoke all on function public._lyhoa_bdm_tien_de_kiem() from public;
revoke all on function public._lyhoa_bdm_tien_de_kiem() from anon;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_tien_de_cung_o()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if exists (
    select 1 from lyhoa_bdm_nhom_tien_de e
      join lyhoa_bdm_nhom x on x.id = e.nhom_id
      join lyhoa_bdm_nhom y on y.id = e.tien_de_nhom_id
     where (e.nhom_id = new.id or e.tien_de_nhom_id = new.id)
       and (x.chu_de_id, x.chuyen_de_id) is distinct from (y.chu_de_id, y.chuyen_de_id)
  ) then
    raise exception 'Nhóm «%» còn mũi tên tiền đề nối với nhóm ở chuyên đề khác — gỡ mũi tên trước', new.ten;
  end if;
  return null;
end $function$
;
revoke all on function public._lyhoa_bdm_tien_de_cung_o() from public;
revoke all on function public._lyhoa_bdm_tien_de_cung_o() from anon;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_khoi_cua_nhom(p_nhom text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select cd.khoi from lyhoa_bdm_nhom n join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_nhom
$function$
;
revoke all on function public._lyhoa_bdm_khoi_cua_nhom(p_nhom text) from public;
revoke all on function public._lyhoa_bdm_khoi_cua_nhom(p_nhom text) from anon;
grant execute on function public._lyhoa_bdm_khoi_cua_nhom(p_nhom text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_cay(p_khoi text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dem_db as materialized (
    select g.dang_bai_id, count(*) n from lyhoa_bdm_gan_cau g join lyhoa_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null group by 1
  ),
  chua as materialized (   -- câu còn sống chưa phân, theo nhóm (dạng cũ = nhóm.ma_cu)
    select n.id nhom_id, n.chu_de_id, n.chuyen_de_id, count(*) n
      from lyhoa_cau_hoi q join lyhoa_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = q.ma_cau)
     group by 1, 2, 3
  ),
  so_cd as materialized (select o.chuyen_de_id, count(*) n from lyhoa_bdm_o o group by 1),
  td as materialized (select e.nhom_id, jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id) ds from lyhoa_bdm_nhom_tien_de e group by 1),
  cho as materialized (   -- câu ở dạng chờ / dạng cũ không còn nhóm (chưa khớp) của khối
    select count(*) n from lyhoa_cau_hoi q join lyhoa_ban_do b on b.ma_dang = q.dang_chinh
     where b.khoi = p_khoi and q.xoa_at is null and not exists (select 1 from lyhoa_bdm_nhom n where n.ma_cu = q.dang_chinh)
  )
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu, 'nhanh', 'lyhoa', 'so_ds', 0,
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from lyhoa_bdm_o o3 join lyhoa_bdm_chu_de c2 on c2.id = o3.chu_de_id
               where o3.chuyen_de_id = ch.id and o3.chu_de_id <> cd.id), '[]'::jsonb),
            'dang_cu', '[]'::jsonb,
            'chua_gan', coalesce((select sum(x.n) from chua x where x.chu_de_id = cd.id and x.chuyen_de_id = ch.id), 0),
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu, 'so', n.so, 'tang', 0,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'tien_de', coalesce((select ds from td where td.nhom_id = n.id), '[]'::jsonb),
                'dang_cu', '[]'::jsonb,
                'chua_gan', coalesce((select x.n from chua x where x.nhom_id = n.id), 0),
                -- độ khó TB nhóm = trung bình mức các dạng bài ĐÃ ĐẶT mức (dạng trống không tính, §1.5); so_co_muc để màn báo độ phủ
                'do_kho_tb', (select round(avg(x.muc_do)::numeric, 1) from lyhoa_bdm_dang_bai x where x.nhom_id = n.id and x.muc_do is not null),
                'so_co_muc', (select count(x.muc_do) from lyhoa_bdm_dang_bai x where x.nhom_id = n.id),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_ly_thuyet', (btrim(d.ly_thuyet) <> '' or d.ly_thuyet_file_url is not null),
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'muc_do', d.muc_do, 'bac_toi_thieu', d.bac_toi_thieu,
                    'so_cau', coalesce((select dd.n from dem_db dd where dd.dang_bai_id = d.id), 0),
                    'dang_cu', '[]'::jsonb
                  ) order by d.so)
                  from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) so from lyhoa_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
              ) order by n.so)
              from (select n0.*, row_number() over (order by n0.thu_tu, n0.id) so
                      from lyhoa_bdm_nhom n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
          ) order by o.so)
          from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) so from lyhoa_bdm_o o0 where o0.chu_de_id = cd.id) o
          join lyhoa_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
      ) order by cd.thu_tu, cd.id)
      from lyhoa_bdm_chu_de cd where cd.khoi = p_khoi), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb) from lyhoa_bdm_o o join lyhoa_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from lyhoa_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from lyhoa_bdm_chu_de group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object('dang_cu', 0, 'dang_cu_chua_gan', 0, 'cau_dang_cu_chua_gan', 0,
      'cau', (select count(*) from lyhoa_cau_hoi q join lyhoa_ban_do b on b.ma_dang = q.dang_chinh where b.khoi = p_khoi and q.xoa_at is null),
      'cau_chua_gan', (select coalesce(sum(x.n), 0) from chua x join lyhoa_bdm_chu_de cd on cd.id = x.chu_de_id where cd.khoi = p_khoi),
      'cau_chua_khop', (select n from cho))
  )
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public.fn_lyhoa_bdm_cay(p_khoi text, p_nhanh text) from public;
revoke all on function public.fn_lyhoa_bdm_cay(p_khoi text, p_nhanh text) from anon;
grant execute on function public.fn_lyhoa_bdm_cay(p_khoi text, p_nhanh text) to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_xoa_cac_nhom(p_nhom text[])
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v_db integer; v_cau integer; v_n integer;
begin
  select count(*) into v_cau from lyhoa_bdm_gan_cau g join lyhoa_bdm_dang_bai d on d.id = g.dang_bai_id where d.nhom_id = any (p_nhom);
  if v_cau > 0 then raise exception 'Bên trong có % câu đã được gán vào dạng bài — gỡ gán hoặc chuyển dạng bài đi trước rồi mới xoá', v_cau; end if;
  delete from lyhoa_bdm_nhom_tien_de where nhom_id = any (p_nhom) or tien_de_nhom_id = any (p_nhom);
  delete from lyhoa_bdm_dang_bai where nhom_id = any (p_nhom);
  get diagnostics v_db = row_count;
  delete from lyhoa_bdm_nhom where id = any (p_nhom);
  get diagnostics v_n = row_count;
  return jsonb_build_object('nhom', v_n, 'dang_bai', v_db);
end $function$
;
revoke all on function public._lyhoa_bdm_xoa_cac_nhom(p_nhom text[]) from public;
revoke all on function public._lyhoa_bdm_xoa_cac_nhom(p_nhom text[]) from anon;
grant execute on function public._lyhoa_bdm_xoa_cac_nhom(p_nhom text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_xoa_nhom(p_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
begin
  if not exists (select 1 from lyhoa_bdm_nhom where id = p_id) then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  return _lyhoa_bdm_xoa_cac_nhom(array[p_id]);
end $function$
;
revoke all on function public.fn_lyhoa_bdm_xoa_nhom(p_id text) from public;
revoke all on function public.fn_lyhoa_bdm_xoa_nhom(p_id text) from anon;
grant execute on function public.fn_lyhoa_bdm_xoa_nhom(p_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_xoa_o(p_chu_de text, p_chuyen_de text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v jsonb; v_xoa_cd boolean := false;
begin
  if not exists (select 1 from lyhoa_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de) then
    raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de, p_chu_de;
  end if;
  v := _lyhoa_bdm_xoa_cac_nhom(array(select id from lyhoa_bdm_nhom where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de));
  delete from lyhoa_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de;
  if not exists (select 1 from lyhoa_bdm_o where chuyen_de_id = p_chuyen_de) then delete from lyhoa_bdm_chuyen_de where id = p_chuyen_de; v_xoa_cd := true; end if;
  return v || jsonb_build_object('xoa_khoi_danh_muc', v_xoa_cd);
end $function$
;
revoke all on function public.fn_lyhoa_bdm_xoa_o(p_chu_de text, p_chuyen_de text) from public;
revoke all on function public.fn_lyhoa_bdm_xoa_o(p_chu_de text, p_chuyen_de text) from anon;
grant execute on function public.fn_lyhoa_bdm_xoa_o(p_chu_de text, p_chuyen_de text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_xoa_chu_de(p_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v jsonb; v_o integer; v_cds text[];
begin
  if not exists (select 1 from lyhoa_bdm_chu_de where id = p_id) then raise exception 'Không tìm thấy chủ đề %', p_id; end if;
  v := _lyhoa_bdm_xoa_cac_nhom(array(select id from lyhoa_bdm_nhom where chu_de_id = p_id));
  v_cds := array(select chuyen_de_id from lyhoa_bdm_o where chu_de_id = p_id);
  delete from lyhoa_bdm_o where chu_de_id = p_id;
  get diagnostics v_o = row_count;
  delete from lyhoa_bdm_chuyen_de ch where ch.id = any (v_cds) and not exists (select 1 from lyhoa_bdm_o o where o.chuyen_de_id = ch.id);
  delete from lyhoa_bdm_chu_de where id = p_id;
  return v || jsonb_build_object('chuyen_de', v_o);
end $function$
;
revoke all on function public.fn_lyhoa_bdm_xoa_chu_de(p_id text) from public;
revoke all on function public.fn_lyhoa_bdm_xoa_chu_de(p_id text) from anon;
grant execute on function public.fn_lyhoa_bdm_xoa_chu_de(p_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_sap_xep(p_loai text, p_ids text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if p_loai = 'chu_de' then
    update lyhoa_bdm_chu_de t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'o' then
    update lyhoa_bdm_o t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.chu_de_id || '|' || t.chuyen_de_id = x.id;
  elsif p_loai = 'nhom' then
    update lyhoa_bdm_nhom t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'dang_bai' then
    update lyhoa_bdm_dang_bai t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  else
    raise exception 'fn_lyhoa_bdm_sap_xep: loại "%" không hợp lệ', p_loai;
  end if;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_sap_xep(p_loai text, p_ids text[]) from public;
revoke all on function public.fn_lyhoa_bdm_sap_xep(p_loai text, p_ids text[]) from anon;
grant execute on function public.fn_lyhoa_bdm_sap_xep(p_loai text, p_ids text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare n lyhoa_bdm_nhom; so_mui integer;
begin
  select * into n from lyhoa_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if (n.chu_de_id, n.chuyen_de_id) is distinct from (p_chu_de_id, p_chuyen_de_id) then
    select count(*) into so_mui from lyhoa_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
    if so_mui > 0 then raise exception 'Nhóm «%» còn % mũi tên tiền đề — gỡ mũi tên trước khi chuyển sang chuyên đề khác', n.ten, so_mui; end if;
  end if;
  update lyhoa_bdm_nhom set chu_de_id = p_chu_de_id, chuyen_de_id = p_chuyen_de_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from lyhoa_bdm_nhom where chu_de_id = p_chu_de_id and chuyen_de_id = p_chuyen_de_id and id <> p_id)
   where id = p_id;
  if p_thu_tu_dich is not null then perform fn_lyhoa_bdm_sap_xep('nhom', p_thu_tu_dich); end if;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) from public;
revoke all on function public.fn_lyhoa_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) from anon;
grant execute on function public.fn_lyhoa_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  update lyhoa_bdm_dang_bai set nhom_id = p_nhom_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from lyhoa_bdm_dang_bai where nhom_id = p_nhom_id and id <> p_id)
   where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if p_thu_tu_dich is not null then perform fn_lyhoa_bdm_sap_xep('dang_bai', p_thu_tu_dich); end if;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) from public;
revoke all on function public.fn_lyhoa_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) from anon;
grant execute on function public.fn_lyhoa_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if p_chu_de_cu = p_chu_de_moi then return; end if;
  if exists (select 1 from lyhoa_bdm_o where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id) then
    update lyhoa_bdm_nhom set chu_de_id = p_chu_de_moi,
           thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from lyhoa_bdm_nhom where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    delete from lyhoa_bdm_o where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
  else
    update lyhoa_bdm_o set chu_de_id = p_chu_de_moi, thu_tu = (select coalesce(max(thu_tu), 0) + 1 from lyhoa_bdm_o where chu_de_id = p_chu_de_moi)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    if not found then raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de_id, p_chu_de_cu; end if;
  end if;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) from public;
revoke all on function public.fn_lyhoa_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) from anon;
grant execute on function public.fn_lyhoa_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_gop_chuyen_de(p_tu text, p_vao text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare r record;
begin
  if p_tu = p_vao then raise exception 'Không thể gộp chuyên đề vào chính nó'; end if;
  if not exists (select 1 from lyhoa_bdm_chuyen_de where id = p_vao) then raise exception 'Không tìm thấy chuyên đề đích %', p_vao; end if;
  for r in select chu_de_id from lyhoa_bdm_o where chuyen_de_id = p_tu loop
    if exists (select 1 from lyhoa_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao) then
      update lyhoa_bdm_nhom set chuyen_de_id = p_vao,
             thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from lyhoa_bdm_nhom where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao)
       where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
      delete from lyhoa_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
    else
      update lyhoa_bdm_o set chuyen_de_id = p_vao where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;   -- ON UPDATE CASCADE kéo nhóm theo
    end if;
  end loop;
  update lyhoa_bdm_chuyen_de v set mo_ta = t.mo_ta from lyhoa_bdm_chuyen_de t where v.id = p_vao and t.id = p_tu and btrim(v.mo_ta) = '';
  delete from lyhoa_bdm_chuyen_de where id = p_tu;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_gop_chuyen_de(p_tu text, p_vao text) from public;
revoke all on function public.fn_lyhoa_bdm_gop_chuyen_de(p_tu text, p_vao text) from anon;
grant execute on function public.fn_lyhoa_bdm_gop_chuyen_de(p_tu text, p_vao text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare d lyhoa_bdm_dang_bai; v_nhom text; v_lt text;
begin
  select * into d from lyhoa_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if exists (select 1 from lyhoa_bdm_gan_cau where dang_bai_id = p_id) then
    raise exception 'Dạng bài «%» đang có câu được gán — chuyển hoặc gỡ gán trước rồi mới nâng', d.ten;
  end if;
  v_lt := case when btrim(d.vi_du) = '' then d.ly_thuyet when btrim(d.ly_thuyet) = '' then d.vi_du
               else d.ly_thuyet || chr(10) || chr(10) || '**Ví dụ**' || chr(10) || chr(10) || d.vi_du end;
  insert into lyhoa_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, v_lt, coalesce(d.ly_thuyet_file_url, d.vi_du_file_url), coalesce(d.ly_thuyet_ten_file, d.vi_du_ten_file))
  returning id into v_nhom;
  delete from lyhoa_bdm_dang_bai where id = p_id;
  return v_nhom;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) from public;
revoke all on function public.fn_lyhoa_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) from anon;
grant execute on function public.fn_lyhoa_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_ha_nhom(p_id text, p_nhom_dich text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare n lyhoa_bdm_nhom; v_db text; v_tt integer;
begin
  if p_id = p_nhom_dich then raise exception 'Không thể hạ nhóm vào chính nó'; end if;
  select * into n from lyhoa_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if not exists (select 1 from lyhoa_bdm_nhom where id = p_nhom_dich) then raise exception 'Không tìm thấy nhóm đích %', p_nhom_dich; end if;
  if exists (select 1 from lyhoa_cau_hoi q where q.dang_chinh = n.ma_cu and q.xoa_at is null and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = q.ma_cau)) then
    raise exception 'Nhóm «%» còn câu chưa phân — xếp các câu đó vào dạng bài trước rồi mới hạ nhóm', n.ten;
  end if;
  select coalesce(max(thu_tu), 0) into v_tt from lyhoa_bdm_dang_bai where nhom_id = p_nhom_dich;
  insert into lyhoa_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file, v_tt + 1)
  returning id into v_db;
  update lyhoa_bdm_dang_bai d set nhom_id = p_nhom_dich, thu_tu = v_tt + 1 + x.i
    from (select c.id, row_number() over (order by c.thu_tu, c.id) i from lyhoa_bdm_dang_bai c where c.nhom_id = p_id) x
   where d.id = x.id;
  delete from lyhoa_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
  delete from lyhoa_bdm_nhom where id = p_id;
  return v_db;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_ha_nhom(p_id text, p_nhom_dich text) from public;
revoke all on function public.fn_lyhoa_bdm_ha_nhom(p_id text, p_nhom_dich text) from anon;
grant execute on function public.fn_lyhoa_bdm_ha_nhom(p_id text, p_nhom_dich text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_dang_cu(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$ select '[]'::jsonb $function$
;
revoke all on function public.fn_lyhoa_bdm_dang_cu(p_khoi text) from public;
revoke all on function public.fn_lyhoa_bdm_dang_cu(p_khoi text) from anon;
grant execute on function public.fn_lyhoa_bdm_dang_cu(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_gan_cum(p_ma_cum text, p_dang_bai text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin raise exception 'Lý hóa không còn cụm — cụm cũ đã thành dạng bài (bản đồ mới 29/10).'; end $function$
;
revoke all on function public.fn_lyhoa_bdm_gan_cum(p_ma_cum text, p_dang_bai text) from public;
revoke all on function public.fn_lyhoa_bdm_gan_cum(p_ma_cum text, p_dang_bai text) from anon;
grant execute on function public.fn_lyhoa_bdm_gan_cum(p_ma_cum text, p_dang_bai text) to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_khoi text; v_khoi_db text; v integer;
begin
  select b.khoi into v_khoi from lyhoa_cau_hoi c join lyhoa_ban_do b on b.ma_dang = c.dang_chinh where c.ma_cau = p_ma_cau and c.xoa_at is null;
  if v_khoi is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  select cd.khoi into v_khoi_db from lyhoa_bdm_dang_bai d join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  if v_khoi_db is null then raise exception 'Không tìm thấy dạng bài % ở bản đồ mới Lý hóa', p_dang_bai; end if;
  if v_khoi_db <> v_khoi then raise exception 'Dạng bài % thuộc khối %, câu % thuộc khối %', p_dang_bai, v_khoi_db, p_ma_cau, v_khoi; end if;
  insert into lyhoa_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, p_dang_bai, p_nguon from lyhoa_cau_hoi c where c.xoa_at is null and (c.ma_cau = p_ma_cau or c.parent_ma_cau = p_ma_cau)
  on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon, actor = public.jwt_uid(), at = now()
   where (g.dang_bai_id, g.nguon) is distinct from (excluded.dang_bai_id, excluded.nguon);
  get diagnostics v = row_count;
  return v;
end $function$
;
revoke all on function public._lyhoa_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) from public;
revoke all on function public._lyhoa_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) from anon;
grant execute on function public._lyhoa_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text DEFAULT 'nguoi'::text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare m text; v integer := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nguon not in ('nguoi', 'ai') then raise exception 'p_nguon phải là nguoi hoặc ai'; end if;
  foreach m in array coalesce(p_ma_caus, '{}') loop v := v + _lyhoa_bdm_gan(m, p_dang_bai, p_nguon); end loop;
  return v;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) from public;
revoke all on function public.fn_lyhoa_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) from anon;
grant execute on function public.fn_lyhoa_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean DEFAULT true)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v jsonb; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ca_ban_sao then v_n := _lyhoa_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  else
    perform 1 from lyhoa_bdm_dang_bai where id = p_dang_bai;
    if not found then raise exception 'Không tìm thấy dạng bài %', p_dang_bai; end if;
    insert into lyhoa_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    v_n := 1;
  end if;
  select jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'so_cau', v_n) into v
    from lyhoa_bdm_dang_bai d join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  return v;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) from public;
revoke all on function public.fn_lyhoa_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) from anon;
grant execute on function public.fn_lyhoa_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean DEFAULT false)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update lyhoa_cau_hoi set xoa_at = now() where xoa_at is null and (ma_cau = p_ma_cau or (p_ca_ban_sao and parent_ma_cau = p_ma_cau));   -- kho rác
  get diagnostics v = row_count;
  if v = 0 then raise exception 'Không thấy câu % ở kho Lý hóa (hoặc đã vào kho rác)', p_ma_cau; end if;
  return v;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) from public;
revoke all on function public.fn_lyhoa_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) from anon;
grant execute on function public.fn_lyhoa_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer DEFAULT 200, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with cg as materialized (
    select q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau) goc
      from lyhoa_cau_hoi q join lyhoa_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null
       and ((p_nhom is not null and n.id = p_nhom) or (p_nhom is null and n.chu_de_id = p_chu_de and n.chuyen_de_id = p_chuyen_de))
       and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = q.ma_cau)
  ),
  goc as materialized (select cg.goc, count(*) - 1 so_ban_sao from cg group by cg.goc)
  select jsonb_build_object(
    'tong_cau', (select count(*) from cg),
    'tong_goc', (select count(*) from goc),
    'cum', '[]'::jsonb,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object('ma_cau', c.ma_cau, 'noi_dung', c.noi_dung, 'loai_cau', c.loai_cau, 'anh_de', c.anh_de,
                                          'ma_cum', null, 'ma_dang_cu', c.dang_chinh, 'so_ban_sao', g.so_ban_sao)
             order by c.dang_chinh, c.ma_cau)
        from (select * from goc order by goc limit p_limit offset p_offset) g join lyhoa_cau_hoi c on c.ma_cau = g.goc), '[]'::jsonb)
  )
$function$
;
revoke all on function public.fn_lyhoa_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) from public;
revoke all on function public.fn_lyhoa_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) from anon;
grant execute on function public.fn_lyhoa_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_kho_cau(p_loai text, p_id text, p_loc text DEFAULT 'tat_ca'::text, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0)
 RETURNS TABLE(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ids text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_lyhoa_bdm_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai = 'dang_bai' then v_ids := array[p_id];
  elsif p_loai = 'nhom' then v_ids := array(select d.id from lyhoa_bdm_dang_bai d where d.nhom_id = p_id);
  else return;   -- Lý hóa chưa có rổ chưa khớp / đề xuất / thiếu dạng / Đúng-Sai ở bản đồ mới
  end if;
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'gan_cau:' || g.nguon, g.dang_bai_id, db.ten, null::text
      from lyhoa_bdm_gan_cau g
      join lyhoa_cau_hoi c on c.ma_cau = g.ma_cau and c.xoa_at is null
      join lyhoa_bdm_dang_bai db on db.id = g.dang_bai_id
     where g.dang_bai_id = any (v_ids)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by db.thu_tu, coalesce(c.parent_ma_cau, c.ma_cau), (c.parent_ma_cau is not null), c.ma_cau
     limit p_limit offset p_offset;
end $function$
;
revoke all on function public.fn_lyhoa_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) from public;
revoke all on function public.fn_lyhoa_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) from anon;
grant execute on function public.fn_lyhoa_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_la_lan_do(p_ma_cau text, p_ma_dang_chep text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select case when p_ma_cau is not null and exists (select 1 from lyhoa_cau_hoi c where c.ma_cau = p_ma_cau) then true
              when p_ma_cau is not null and (exists (select 1 from dai_cau_hoi c where c.ma_cau = p_ma_cau)
                                          or exists (select 1 from hgt_cau_hoi c where c.ma_cau = p_ma_cau)) then false
              else exists (select 1 from lyhoa_ban_do b where b.ma_dang = p_ma_dang_chep) end
$function$
;
revoke all on function public._lyhoa_la_lan_do(p_ma_cau text, p_ma_dang_chep text) from public;
revoke all on function public._lyhoa_la_lan_do(p_ma_cau text, p_ma_dang_chep text) from anon;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public._lyhoa_la_lan_do(p_ma_cau text, p_ma_dang_chep text) to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_do_o_bdm(p_ma_cau text, p_ma_dang_chep text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare r record; v text;
begin
  if p_ma_cau is not null then
    select c.dang_chinh, c.xoa_at is not null as da_xoa, g.dang_bai_id into r
      from lyhoa_cau_hoi c left join lyhoa_bdm_gan_cau g on g.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      select min(g.dang_bai_id) into v
        from lyhoa_cau_hoi s join lyhoa_bdm_gan_cau g on g.ma_cau = s.ma_cau
       where s.dang_chinh = r.dang_chinh and s.xoa_at is null
      having count(distinct g.dang_bai_id) = 1;
      return v;
    end if;
  end if;
  select min(d.id) into v
    from lyhoa_bdm_nhom n join lyhoa_bdm_dang_bai d on d.nhom_id = n.id
   where n.ma_cu = p_ma_dang_chep
  having count(*) = 1;
  return v;
end $function$
;
revoke all on function public._lyhoa_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) from public;
revoke all on function public._lyhoa_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) from anon;
-- (bản gốc: PUBLIC được gọi) ⇒ giữ cho authenticated
grant execute on function public._lyhoa_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_duyet_duoc(p_khoi text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce((select la_admin from my_quyen()), false) or public._truong_khoi_tro_len('Lý hóa', p_khoi)
$function$
;
revoke all on function public._lyhoa_bdm_duyet_duoc(p_khoi text) from public;
revoke all on function public._lyhoa_bdm_duyet_duoc(p_khoi text) from anon;
grant execute on function public._lyhoa_bdm_duyet_duoc(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public._lyhoa_bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from lyhoa_bdm_de_xuat dx
      join lyhoa_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join lyhoa_bdm_dang_bai d on d.id = dx.dang_bai_id
      join lyhoa_bdm_nhom n on n.id = d.nhom_id
      join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, t.chu_de_id, t.ly_do, null::text
      from lyhoa_bdm_cau_thieu_dang t
      join lyhoa_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join lyhoa_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    -- chưa có dạng: câu gốc của khối, chưa gán / chưa đề xuất / chưa báo thiếu. Chủ đề gợi ý = nhóm bản đồ mới dựng từ dạng cũ (ma_cu).
    select q.ma_cau, null::text, (select min(n.chu_de_id) from lyhoa_bdm_nhom n where n.ma_cu = q.dang_chinh), ''::text, null::text
      from lyhoa_cau_hoi q
      join lyhoa_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from lyhoa_bdm_chu_de c2 where c2.khoi = p_khoi)
       and not exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from lyhoa_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from lyhoa_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from lyhoa_bdm_gan_cau g
      join lyhoa_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
      join lyhoa_bdm_dang_bai d on d.id = g.dang_bai_id
      join lyhoa_bdm_nhom n on n.id = d.nhom_id
      join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from lyhoa_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (như Toán)
  ) s
  where public._lyhoa_bdm_duyet_duoc(p_khoi)
  ) z
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public._lyhoa_bdm_khop_nguon(p_khoi text, p_hang text) from public;
revoke all on function public._lyhoa_bdm_khop_nguon(p_khoi text, p_hang text) from anon;
grant execute on function public._lyhoa_bdm_khop_nguon(p_khoi text, p_hang text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_khop_dem(p_khoi text, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select z.x from (
with s as materialized (select x.ma_cau, x.chu_de_id, h.hang from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h(hang)
                           cross join lateral public._lyhoa_bdm_khop_nguon(p_khoi, h.hang) x
                          where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
                            and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau))))
  select jsonb_build_object(
    'de_xuat', (select count(*) from s where hang = 'de_xuat'),
    'thieu',   (select count(*) from s where hang = 'thieu'),
    'trong',   (select count(*) from s where hang = 'trong'),
    'mau',     (select count(*) from s where hang = 'mau'),
    'kiem_n',   (select count(*) from lyhoa_bdm_kiem_mau k join lyhoa_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from lyhoa_bdm_kiem_mau k join lyhoa_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
  ) z(x)
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public.fn_lyhoa_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) from public;
revoke all on function public.fn_lyhoa_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) from anon;
grant execute on function public.fn_lyhoa_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from public._lyhoa_bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'lyhoa' and d.ma = x.ma_cau) ds on true
     where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
       and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau)))
  ),
  pg as (select * from s order by (de_sau_at is not null), de_sau_at, ma_cau
          limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', b.ten_dang, 'chuyen_de_cu', b.ten_chuyen_de,
        'nhanh', 'lyhoa', 'nguon_tl', public._kho_nguon_cau(q.ma_cau)
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join lyhoa_cau_hoi q on q.ma_cau = pg.ma_cau
      left join lyhoa_ban_do b on b.ma_dang = q.dang_chinh
      left join lyhoa_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join lyhoa_bdm_nhom n on n.id = d.nhom_id
      left join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id
      left join lyhoa_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$
;
revoke all on function public.fn_lyhoa_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) from public;
revoke all on function public.fn_lyhoa_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) from anon;
grant execute on function public.fn_lyhoa_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text DEFAULT NULL::text)
 RETURNS TABLE(nguon text, so_cau bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select n, count(*) from public._lyhoa_bdm_khop_nguon(p_khoi, p_hang) s, unnest(public._kho_nguon_cau(s.ma_cau)) n
   where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de
   group by n order by n
$function$
;
revoke all on function public.fn_lyhoa_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) from public;
revoke all on function public.fn_lyhoa_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) from anon;
grant execute on function public.fn_lyhoa_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_khop_dich(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dang_bai', d.ten, 'mo_ta', d.mo_ta, 'nhom', n.ten, 'nhom_id', n.id,
    'chuyen_de', ch.ten, 'chuyen_de_id', ch.id, 'chu_de', cd.ten, 'chu_de_id', cd.id
  ) order by cd.thu_tu, ch.id, n.thu_tu, d.thu_tu), '[]'::jsonb)
  from lyhoa_bdm_chu_de cd
  join lyhoa_bdm_nhom n on n.chu_de_id = cd.id
  join lyhoa_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
  join lyhoa_bdm_dang_bai d on d.nhom_id = n.id
  where cd.khoi = p_khoi
$function$
;
revoke all on function public.fn_lyhoa_bdm_khop_dich(p_khoi text) from public;
revoke all on function public.fn_lyhoa_bdm_khop_dich(p_khoi text) from anon;
grant execute on function public.fn_lyhoa_bdm_khop_dich(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_lyhoa_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text DEFAULT NULL::text, p_ly_do text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v_khoi text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  select b.khoi into v_khoi from lyhoa_cau_hoi q join lyhoa_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;
  if not public._lyhoa_bdm_duyet_duoc(v_khoi) then raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn (Lý hóa khối %)', p_ma_cau, v_khoi; end if;
  select g.dang_bai_id, g.nguon into v_ai, v_nguon from lyhoa_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from lyhoa_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  if p_dang_bai is not null then
    select cd.id into v_cd_dich from lyhoa_bdm_dang_bai d join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi;
    if v_cd_dich is null then raise exception 'Dạng bài % không tồn tại trong Lý hóa khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    perform public._lyhoa_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
    delete from lyhoa_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from lyhoa_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    insert into lyhoa_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) values (p_ma_cau, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    delete from lyhoa_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from lyhoa_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into lyhoa_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into lyhoa_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    perform public._lyhoa_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from lyhoa_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into lyhoa_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into lyhoa_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from lyhoa_bdm_gan_cau where (ma_cau = p_ma_cau or ma_cau in (select c.ma_cau from lyhoa_cau_hoi c where c.parent_ma_cau = p_ma_cau)) and nguon = 'ai';
    end if;
    delete from lyhoa_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from lyhoa_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform public.fn_kho_tu_choi_cau('lyhoa', p_ma_cau, public.current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$
;
revoke all on function public.fn_lyhoa_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) from public;
revoke all on function public.fn_lyhoa_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) from anon;
grant execute on function public.fn_lyhoa_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) to authenticated;

-- (B2) trigger
CREATE CONSTRAINT TRIGGER trg_lyhoa_bdm_nhom_tien_de_cung_o AFTER UPDATE OF chu_de_id, chuyen_de_id ON public.lyhoa_bdm_nhom DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_tien_de_cung_o();
CREATE TRIGGER lyhoa_cau_form_tn_kiem BEFORE INSERT OR UPDATE ON public.lyhoa_cau_form_tn FOR EACH ROW EXECUTE FUNCTION lyhoa_cau_form_tn_kiem();
CREATE TRIGGER lyhoa_cau_hoi_yeu_cau_giai_claude_dong BEFORE UPDATE ON public.lyhoa_cau_hoi_yeu_cau_giai FOR EACH ROW EXECUTE FUNCTION fn_giaibai_tg_claude_dong();
CREATE TRIGGER trg_chan_duyet_dang_cho BEFORE INSERT OR UPDATE OF da_duyet, dang_chinh ON public.lyhoa_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_chan_duyet_dang_cho();
CREATE TRIGGER trg_de_thi_dien_dang AFTER UPDATE OF dang_chinh ON public.lyhoa_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_de_thi_dien_dang();
CREATE TRIGGER trg_kho_cau_duyet_nguon BEFORE INSERT OR UPDATE OF da_duyet, duyet_nguon ON public.lyhoa_cau_hoi FOR EACH ROW EXECUTE FUNCTION _kho_cau_duyet_nguon();
CREATE TRIGGER trg_lyhoa_ban_do_sync_ca_test_cau AFTER UPDATE OF ten_chuyen_de, muc_do ON public.lyhoa_ban_do FOR EACH ROW EXECUTE FUNCTION tg_ban_do_sync_ca_test_cau();
CREATE TRIGGER trg_lyhoa_ban_do_xoa_dong_bo_btyeu AFTER DELETE ON public.lyhoa_ban_do FOR EACH STATEMENT EXECUTE FUNCTION _trg_btyeu_dong_bo_dang_ban_do();
CREATE TRIGGER trg_lyhoa_bdm_chu_de_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_chu_de_thu_tu BEFORE INSERT ON public.lyhoa_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_thu_tu();
CREATE TRIGGER trg_lyhoa_bdm_chu_de_touch BEFORE UPDATE ON public.lyhoa_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_lyhoa_bdm_chuyen_de_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_chuyen_de FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_chuyen_de_touch BEFORE UPDATE ON public.lyhoa_bdm_chuyen_de FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_lyhoa_bdm_dang_bai_bump AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_bump_nhom();
CREATE TRIGGER trg_lyhoa_bdm_dang_bai_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_dang_bai_thu_tu BEFORE INSERT ON public.lyhoa_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_thu_tu();
CREATE TRIGGER trg_lyhoa_bdm_dang_bai_touch BEFORE UPDATE ON public.lyhoa_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_lyhoa_bdm_gan_cau_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_gan_cau FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_gan_cau_tu_duyet AFTER INSERT OR UPDATE OF nguon, dang_bai_id ON public.lyhoa_bdm_gan_cau FOR EACH ROW EXECUTE FUNCTION _bdm_tu_duyet_sau_gan();
CREATE TRIGGER trg_lyhoa_bdm_nhom_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_nhom_thu_tu BEFORE INSERT ON public.lyhoa_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_thu_tu();
CREATE TRIGGER trg_lyhoa_bdm_nhom_tien_de_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_nhom_tien_de FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_nhom_touch BEFORE UPDATE ON public.lyhoa_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_lyhoa_bdm_o_log AFTER INSERT OR DELETE OR UPDATE ON public.lyhoa_bdm_o FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_ghi_log();
CREATE TRIGGER trg_lyhoa_bdm_o_thu_tu BEFORE INSERT ON public.lyhoa_bdm_o FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_thu_tu();
CREATE TRIGGER trg_lyhoa_bdm_tien_de_kiem BEFORE INSERT OR UPDATE ON public.lyhoa_bdm_nhom_tien_de FOR EACH ROW EXECUTE FUNCTION _lyhoa_bdm_tien_de_kiem();
CREATE TRIGGER trg_log_doi_dang AFTER UPDATE OF dang_chinh ON public.lyhoa_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_log_doi_dang('lyhoa', 'cau');
CREATE TRIGGER trg_log_kho_cau_lyhoa AFTER DELETE OR UPDATE ON public.lyhoa_cau_hoi FOR EACH ROW EXECUTE FUNCTION log_kho_cau();
CREATE TRIGGER trg_log_kho_sua AFTER UPDATE OF noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ma_cum ON public.lyhoa_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_log_kho_sua('lyhoa');

-- (C) REGISTRY dùng chung: thêm nhánh Lý hóa (dựng từ bản đang chạy, chỉ chèn thêm)
-- _kho_ban_do_tbl
CREATE OR REPLACE FUNCTION public._kho_ban_do_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_mon = 'Lý hóa' then 'lyhoa_ban_do'
              when p_mon = 'Tiếng Anh' then 'anh_ban_do'
              when p_mon = 'TSA' then 'tsa_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_ban_do'
              when p_nhanh = 'bdm' then 'bdm_ban_do'
              else 'dai_ban_do' end
$function$
;
-- _kho_cau_tbl
CREATE OR REPLACE FUNCTION public._kho_cau_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_mon = 'Lý hóa' then 'lyhoa_cau_hoi'
              when p_mon = 'Tiếng Anh' then 'anh_cau_hoi'
              when p_mon = 'TSA' then 'tsa_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_hoi'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_cau_hoi'
              when p_nhanh = 'bdm' then 'bdm_cau_hoi'
              else 'dai_cau_hoi' end
$function$
;
-- _kho_form_dien_tbl
CREATE OR REPLACE FUNCTION public._kho_form_dien_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_dien'
              when p_mon = 'Lý hóa' then 'lyhoa_cau_form_dien'
              when p_mon = 'Tiếng Anh' then 'anh_cau_form_dien'
              when p_mon = 'TSA' then 'tsa_cau_form_dien'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_dien'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_dien'
              else 'dai_cau_form_dien' end
$function$
;
-- _kho_form_tn_tbl
CREATE OR REPLACE FUNCTION public._kho_form_tn_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_tn'
              when p_mon = 'Lý hóa' then 'lyhoa_cau_form_tn'
              when p_mon = 'Tiếng Anh' then 'anh_cau_form_tn'
              when p_mon = 'TSA' then 'tsa_cau_form_tn'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_tn'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_tn'
              else 'dai_cau_form_tn' end
$function$
;
-- _kho_lt_tbl
CREATE OR REPLACE FUNCTION public._kho_lt_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_mon = 'Lý hóa' then 'lyhoa_dang_ly_thuyet'
              when p_mon = 'Tiếng Anh' then 'anh_dang_ly_thuyet'
              when p_mon = 'TSA' then 'tsa_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai_ly_thuyet'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_dang_ly_thuyet'
              when p_nhanh = 'bdm' then 'bdm_dang_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$function$
;
-- _kho_muc_do_dang
CREATE OR REPLACE FUNCTION public._kho_muc_do_dang(p_mon text, p_ma_dang text)
 RETURNS smallint
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Lý hóa' then
    select muc_do into v_md from lyhoa_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Tiếng Anh' then
    select muc_do into v_md from anh_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'TSA' then
    select muc_do into v_md from tsa_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_hoc' then
    select muc_do into v_md from hinh_hoc_bai where ma_bai = p_ma_dang;
  elsif v_nhanh = 'hinh_mo_hinh' then
    select muc_do into v_md from hmh_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'bdm' then
    select muc_do into v_md from bdm_ban_do where ma_dang = p_ma_dang;   -- 26/10: dạng bài bản đồ mới (NULL = chưa gán độ khó)
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $function$
;
-- _kho_nhanh_cua_dang
CREATE OR REPLACE FUNCTION public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_mon = 'Toán' and p_ma_dang like 'NDB%' then 'bdm'
              when p_mon not in ('KHTN', 'Lý hóa', 'Tiếng Anh', 'TSA') and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon not in ('KHTN', 'Lý hóa', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              when p_mon not in ('KHTN', 'Lý hóa', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_baitoan where ma = p_ma_dang) then 'hinh_mo_hinh' -- 14/10: bài mô hình = KP (ma_dang = hinh_baitoan.ma)
              else null end
$function$
;
-- _kho_dang_cho
CREATE OR REPLACE FUNCTION public._kho_dang_cho(p_tbl text, p_khoi text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_tbl when 'dai' then 'T1' when 'hgt' then 'T3' when 'khtn' then 'K' when 'lyhoa' then 'L' when 'anh' then 'E' when 'tsa' then 'TS' when 'hinh_hoc' then 'HH' end
         || lpad(p_khoi, 2, '0') || '000000'
$function$
;
-- fn_kho_tbl
CREATE OR REPLACE FUNCTION public.fn_kho_tbl(p_mon text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_mon when 'toan' then 'dai' when 'khtn' then 'khtn' when 'lyhoa' then 'lyhoa' when 'hgt' then 'hgt' when 'hinh_hoc' then 'hinh_hoc' when 'anh' then 'anh' when 'tsa' then 'tsa' end
$function$
;
-- count_cau_by_dang
CREATE OR REPLACE FUNCTION public.count_cau_by_dang(p_tbl text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi', 'lyhoa_cau_hoi', 'hgt_cau_hoi', 'anh_cau_hoi', 'tsa_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
  execute format(
    'select coalesce(jsonb_object_agg(dang_chinh, n), ''{}''::jsonb)
       from (select dang_chinh, count(*) n from %I where xoa_at is null group by dang_chinh) t',
    p_tbl
  ) into result;
  return result;
end $function$
;
-- _mcq_kiem_kho
CREATE OR REPLACE FUNCTION public._mcq_kiem_kho(p_kho text)
 RETURNS void
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
begin
  if p_kho not in ('dai', 'khtn', 'lyhoa', 'hgt') then raise exception 'p_kho phải là dai/khtn/lyhoa/hgt (đang %)', p_kho; end if;
end $function$
;
-- fn_kho_doi_dang_tk
CREATE OR REPLACE FUNCTION public.fn_kho_doi_dang_tk(p_mon text, p_khoi text DEFAULT NULL::text, p_tu timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(dang_cu text, ten_cu text, dang_moi text, ten_moi text, so_lan bigint, lan_cuoi timestamp with time zone, vi_du jsonb)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
begin
  if p_mon not in ('dai', 'hgt', 'khtn', 'lyhoa') then raise exception 'fn_kho_doi_dang_tk: mon không hợp lệ %', p_mon; end if;
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
end $function$
;
-- _bdm_tu_duyet_sau_gan
CREATE OR REPLACE FUNCTION public._bdm_tu_duyet_sau_gan()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare v_bang text := case when tg_table_name like 'hgt%' then 'hgt_cau_hoi'
                            when tg_table_name like 'khtn%' then 'khtn_cau_hoi'
                            when tg_table_name like 'lyhoa%' then 'lyhoa_cau_hoi'
                            else 'dai_cau_hoi' end;
begin
  if new.nguon = 'ai' then
    execute format($q$update public.%I q set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
      where q.ma_cau = $1 and q.da_duyet = false and q.xoa_at is null
        and public._bdm_du_dap_an(q.loai_cau, q.dap_an, q.menh_de, q.loi_giai)$q$, v_bang) using new.ma_cau;
  end if;
  return null;
end $function$
;
-- _trg_chan_duyet_dang_cho
CREATE OR REPLACE FUNCTION public._trg_chan_duyet_dang_cho()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.da_duyet and public._kho_la_dang_cho(new.dang_chinh)
     and coalesce(current_setting('kho.duyet_noi_dung', true), '') <> 'on' then   -- duyệt ĐỀ (nội dung) được phép, phân dạng sau
    -- Bản đồ mới (mig 202610261856 + 202610261929) — khối chạy bản đồ mới, Đại/HGT:
    --   câu thường đã GÁN dạng bài = đã phân dạng · câu Đ/S có CHỦ ĐỀ kho Đ/S = đã phân · ý Đ/S không gắn dạng (dạng chờ chỉ là lưu trữ)
    if tg_table_name in ('dai_cau_hoi', 'hgt_cau_hoi') then
      if new.loai_cau = 'dung_sai' then
        if public._bdm_dang_o_khoi_moi(left(tg_table_name, 3), new.dang_chinh)
           and public._bdm_cau_ds_co_chu_de(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau) then return new; end if;
      elsif public._bdm_cau_co_dang_bai(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau, new.dang_chinh) then return new;
      end if;
    elsif tg_table_name in ('dai_cau_menh_de', 'hgt_cau_menh_de') then
      if public._bdm_dang_o_khoi_moi(left(tg_table_name, 3), new.dang_chinh) then return new; end if;
    -- 06/11: KHTN bản đồ mới — câu (hoặc câu gốc của bản sao) đã gán dạng bài KHTN = đã phân dạng
    elsif tg_table_name = 'khtn_cau_hoi' then
      if exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;
    elsif tg_table_name = 'lyhoa_cau_hoi' then   -- mig Lý hóa đợt 2: như KHTN
      if exists (select 1 from lyhoa_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;
    end if;
    raise exception 'Chưa phân dạng: % đang ở dạng chờ % — chọn dạng thật trước khi duyệt', tg_table_name, new.dang_chinh
      using errcode = 'check_violation';
  end if;
  return new;
end $function$
;
-- _bdm_dang_bai_cua_mon
CREATE OR REPLACE FUNCTION public._bdm_dang_bai_cua_mon(p_mon text, p_ma text[])
 RETURNS TABLE(ma_dang text, nhanh_bdm text, muc_do smallint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select b.ma_dang, b.nhanh_bdm, b.muc_do::smallint
    from bdm_ban_do b
   where cardinality(public._kho_ds_nhanh(p_mon)) > 0 and public._kho_ban_do_tbl(p_mon, 'bdm') = 'bdm_ban_do'
     and b.ma_dang = any(p_ma) and b.ma_dang like 'NDB%'
  union all
  select d.id, 'khtn', d.muc_do::smallint
    from khtn_bdm_dang_bai d
   where public._kho_ban_do_tbl(p_mon, null) = 'khtn_ban_do' and d.id = any(p_ma)
  union all
  select d.id, 'lyhoa', d.muc_do::smallint
    from lyhoa_bdm_dang_bai d
   where public._kho_ban_do_tbl(p_mon, null) = 'lyhoa_ban_do' and d.id = any(p_ma)
$function$
;
-- fn_bdm_nhap_cau
CREATE OR REPLACE FUNCTION public.fn_bdm_nhap_cau(p_mon text, p_khoi text, p_cau jsonb, p_dang_bai text, p_chu_de text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare t text := public.fn_kho_tbl(p_mon); v_cho text; v_ok boolean; v_seq int; v_ma text; v_loai text := p_cau->>'loai_cau';
        v_md jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null or t not in ('dai', 'hgt', 'khtn', 'lyhoa') then raise exception 'Kho % chưa có bản đồ mới', coalesce(p_mon, '∅'); end if;
  if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))
     or (t = 'lyhoa' and not exists (select 1 from lyhoa_bdm_chu_de where khoi = p_khoi))
     or (t not in ('khtn', 'lyhoa') and not coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', p_khoi)), false)) then
    raise exception 'Khối % chưa chạy bản đồ mới — nhập theo bản đồ cũ', p_khoi;
  end if;
  if nullif(trim(p_cau->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
  v_cho := public._kho_dang_cho(t, p_khoi);
  execute format('select exists (select 1 from %I where ma_dang = $1)', t || '_ban_do') into v_ok using v_cho;
  if not v_ok then raise exception 'Khối % chưa có dạng chờ % ở kho %', p_khoi, v_cho, t; end if;

  perform pg_advisory_xact_lock(hashtext(t || '_cau_hoi:' || v_cho));
  execute format($q$select coalesce(max(substr(ma_cau, length($1) + 1)::int), 0) from %I
                    where ma_cau like $1 || '%%' and substr(ma_cau, length($1) + 1) ~ '^[0-9]+$'$q$, t || '_cau_hoi')
    into v_seq using v_cho;
  v_ma := v_cho || lpad((v_seq + 1)::text, greatest(3, length((v_seq + 1)::text)), '0');   -- lpad CẮT chuỗi dài hơn 3 ⇒ phải nới

  if v_loai = 'dung_sai' then
    select coalesce(jsonb_agg(m || jsonb_build_object('ma_dang', v_cho) order by o), '[]'::jsonb) into v_md
      from jsonb_array_elements(coalesce(p_cau->'menh_de', '[]'::jsonb)) with ordinality e(m, o);
  end if;
  execute format($q$insert into %I (ma_cau, dang_chinh, loai_cau, noi_dung, dap_an, loi_giai, lua_chon, menh_de, anh_de, anh_dap_an, nguon, nguon_giai)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'le', $11)$q$, t || '_cau_hoi')
    using v_ma, v_cho, v_loai, trim(p_cau->>'noi_dung'),
          case when v_loai = 'dung_sai' then null else nullif(trim(p_cau->>'dap_an'), '') end,
          nullif(trim(p_cau->>'loi_giai'), ''),
          case when jsonb_typeof(p_cau->'lua_chon') = 'array' then p_cau->'lua_chon' end,
          v_md, nullif(p_cau->>'anh_de', ''), nullif(p_cau->>'anh_dap_an', ''),
          coalesce(nullif(p_cau->>'nguon_giai', ''), 'nguoi');

  if v_loai = 'dung_sai' then
    if p_chu_de is not null and t not in ('khtn', 'lyhoa') then   -- KHTN chưa có kho Đ/S cấp chủ đề
      execute format($q$insert into %I (ma_cau, chu_de_id, nguon) values ($1, $2, 'nguoi')$q$, t || '_bdm_kho_ds') using v_ma, p_chu_de;
    end if;
  elsif p_dang_bai is not null and t = 'khtn' then
    perform public._khtn_bdm_gan(v_ma, p_dang_bai, 'nguoi');
  elsif p_dang_bai is not null and t = 'lyhoa' then
    perform public._lyhoa_bdm_gan(v_ma, p_dang_bai, 'nguoi');
  elsif p_dang_bai is not null then
    perform public._bdm_nguoi_gan_cau(t, v_ma, p_dang_bai);
  end if;
  return v_ma;
end $function$
;
-- fn_giaibai_mon
CREATE OR REPLACE FUNCTION public.fn_giaibai_mon(p_nhanh text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$ select case when p_nhanh = 'khtn' then 'KHTN' when p_nhanh = 'lyhoa' then 'Lý hóa' else 'Toán' end $function$
;
-- fn_giaibai_src
CREATE OR REPLACE FUNCTION public.fn_giaibai_src(p_nhanh text, OUT src text, OUT src_key text)
 RETURNS record
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_nhanh
           when 'toan' then 'dai_cau_hoi' when 'khtn' then 'khtn_cau_hoi' when 'lyhoa' then 'lyhoa_cau_hoi' when 'hgt' then 'hgt_cau_hoi'
           when 'hinh_baitoan' then 'hinh_baitoan' when 'hinh_bien_the' then 'hinh_baitoan_bien_the' end,
         case when p_nhanh like 'hinh_%' then 'id' else 'ma_cau' end
$function$
;
-- fn_giaibai_tbl
CREATE OR REPLACE FUNCTION public.fn_giaibai_tbl(p_nhanh text, OUT yc text, OUT key_col text, OUT key_cast text)
 RETURNS record
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_nhanh
           when 'toan' then 'dai_cau_hoi_yeu_cau_giai' when 'khtn' then 'khtn_cau_hoi_yeu_cau_giai' when 'lyhoa' then 'lyhoa_cau_hoi_yeu_cau_giai' when 'hgt' then 'hgt_cau_hoi_yeu_cau_giai'
           when 'hinh_baitoan' then 'hinh_baitoan_yeu_cau_giai' when 'hinh_bien_the' then 'hinh_bien_the_yeu_cau_giai' end,
         case p_nhanh when 'hinh_baitoan' then 'baitoan_id' when 'hinh_bien_the' then 'bien_the_id' else 'ma_cau' end,
         case when p_nhanh like 'hinh_%' then '$1::uuid' else '$1' end
$function$
;
-- fn_giaibai_duyet
CREATE OR REPLACE FUNCTION public.fn_giaibai_duyet(p_nhanh text, p_id uuid, p_me uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare r record := public.fn_giaibai_tbl(p_nhanh); t text; v_key text; v_nguoi uuid; v_lg text; v_anh text; v_da text; v_che_do text; v_y jsonb; n int;
        y jsonb; v_yid uuid; v_ylg text; v_yanh text; v_tt text; v_bo text[] := '{}'; v_ghi int := 0;
begin
  if r.yc is null then raise exception 'fn_giaibai_duyet: nhánh không hợp lệ %', p_nhanh; end if;
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh) then raise exception 'Chỉ team học thuật môn % mới duyệt được.', public.fn_giaibai_mon(p_nhanh); end if;
  execute format('select %I::text, nguoi_giai, loi_giai_nhap, anh_nhap, dap_an_nhap, che_do, y_nhap from %I where id = $1 and xu_ly_at is null and trang_thai = ''cho_duyet'' for update', r.key_col, r.yc)
    into v_key, v_nguoi, v_lg, v_anh, v_da, v_che_do, v_y using p_id;
  if v_key is null then raise exception 'Bài không ở trạng thái chờ duyệt.'; end if;
  if v_nguoi = p_me then raise exception 'Không tự duyệt bài mình giải.'; end if;

  if p_nhanh in ('toan','khtn','lyhoa','hgt') then
    t := public.fn_kho_tbl(p_nhanh) || '_cau_hoi';
    if v_che_do = 'hoan_thien' then
      execute format('update %I set loi_giai = $2, anh_dap_an = coalesce(anh_dap_an, $3), dap_an = coalesce($4, dap_an), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                      where ma_cau = $1 and xoa_at is null and nguon_giai = ''ai'' and giai_method = ''claude_code'' and da_duyet = false', t)
        using v_key, v_lg, v_anh, nullif(v_da, ''), p_me;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Câu % không còn ở trạng thái "Claude đã giải, chưa duyệt" — có thể đã bị duyệt/sửa nơi khác.', v_key; end if;
    else
      execute format('update %I set loi_giai = $2, anh_dap_an = $3, dap_an = coalesce(dap_an, $4), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                      where ma_cau = $1 and xoa_at is null and loi_giai is null and anh_dap_an is null', t)
        using v_key, v_lg, v_anh, v_da, p_me;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Câu % đã có lời giải trong lúc chờ — không ghi đè. Từ chối bài này hoặc trả bài.', v_key; end if;
    end if;
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
    return;
  end if;

  -- ── HÌNH ──
  if v_y is not null and jsonb_typeof(v_y) = 'array' and jsonb_array_length(v_y) > 0 then
    -- Đóng dòng nhận TRƯỚC (fn_hinh_ghi_loi_giai xoá dòng mở nguoi_giai NULL của node; dòng của người thì không đụng).
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
    for y in select * from jsonb_array_elements(v_y) loop
      v_yid := (y->>'id')::uuid; v_ylg := nullif(y->>'loi_giai', ''); v_yanh := nullif(y->>'anh', '');
      if v_ylg is null and v_yanh is null then continue; end if;
      if p_nhanh = 'hinh_bien_the' and v_yid = v_key::uuid then
        v_tt := public.fn_hinh_tt_bien_the(v_yid);
        if v_tt = 'chua' then
          perform public.fn_hinh_ghi_loi_giai('bien_the', v_yid, v_ylg, v_yanh, 'nguoi');
          update hinh_baitoan_bien_the set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta' where id = v_yid;
          v_ghi := v_ghi + 1;
        elsif v_tt = 'claude' then
          update hinh_baitoan_bien_the set loi_giai = v_ylg, anh_loi_giai = coalesce(anh_loi_giai, v_yanh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now() where id = v_yid;
          v_ghi := v_ghi + 1;
        else v_bo := v_bo || (y->>'ma'); end if;
      else
        select trang_thai into v_tt from public.fn_hinh_tt_node(v_yid);
        if v_tt = 'chua' then
          -- tiền đề có thể đang bị NGƯỜI KHÁC giữ riêng (nhận trước khi luật ĐÍCH có) → fn_hinh_ghi_loi_giai ném lỗi:
          -- bỏ qua ý đó, không hỏng cả lượt duyệt.
          begin
            perform public.fn_hinh_ghi_loi_giai('baitoan', v_yid, v_ylg, v_yanh, 'nguoi');
            update hinh_cach_giai set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta'
              where baitoan_id = v_yid and nguon_giai = 'nguoi' and (loi_giai is not null or anh_loi_giai is not null) and da_duyet = false;
            v_ghi := v_ghi + 1;
          exception when others then
            v_bo := v_bo || (coalesce(y->>'ma', v_yid::text) || ' (' || sqlerrm || ')');
          end;
        elsif v_tt = 'claude' then
          update hinh_cach_giai set loi_giai = v_ylg, anh_loi_giai = coalesce(anh_loi_giai, v_yanh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
            where baitoan_id = v_yid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
          v_ghi := v_ghi + 1;
        else v_bo := v_bo || coalesce(y->>'ma', v_yid::text); end if;   -- đã có nội dung người khác / đã duyệt: KHÔNG ghi đè
      end if;
    end loop;
    if v_ghi = 0 then raise exception 'Không ghi được ý nào — mọi ý đã có lời giải chính thức/của người khác (%). Trả bài hoặc từ chối.', array_to_string(v_bo, ', '); end if;
    if array_length(v_bo, 1) > 0 then raise notice 'Bỏ qua % ý đã có nội dung: %', array_length(v_bo, 1), array_to_string(v_bo, ', '); end if;
    return;
  end if;

  -- Không có y_nhap (bản cũ / 1 node) — hành vi 1543 giữ nguyên
  if v_che_do = 'hoan_thien' then
    if p_nhanh = 'hinh_baitoan' then
      update hinh_cach_giai set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
        where baitoan_id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
    else
      update hinh_baitoan_bien_the set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
        where id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
    end if;
    get diagnostics n = row_count;
    if n = 0 then raise exception 'Bài % không còn ở trạng thái "Claude đã giải, chưa duyệt".', v_key; end if;
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
  else
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
    perform public.fn_hinh_ghi_loi_giai(case when p_nhanh = 'hinh_baitoan' then 'baitoan' else 'bien_the' end, v_key::uuid, v_lg, v_anh, 'nguoi');
    if p_nhanh = 'hinh_baitoan' then
      update hinh_cach_giai set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta'
        where baitoan_id = v_key::uuid and nguon_giai = 'nguoi' and (loi_giai is not null or anh_loi_giai is not null) and da_duyet = false;
    else
      update hinh_baitoan_bien_the set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta' where id = v_key::uuid;
    end if;
  end if;
end $function$
;
-- fn_giaibai_nhan
CREATE OR REPLACE FUNCTION public.fn_giaibai_nhan(p_nhanh text, p_key text, p_me uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
declare r record := public.fn_giaibai_tbl(p_nhanh); s record := public.fn_giaibai_src(p_nhanh);
        v_id uuid; n int; v_ten text; v_che_do text; v_lg_ai text; v_da_ai text; v_model text;
begin
  if r.yc is null then raise exception 'fn_giaibai_nhan: nhánh không hợp lệ %', p_nhanh; end if;
  if p_me is null then raise exception 'Chưa xác định người nhận.'; end if;
  if exists (select 1 from public.v_giaibai_bai b where b.nhanh = p_nhanh and b.key = p_key) then
    v_che_do := 'giai'; v_lg_ai := null; v_da_ai := null; v_model := null;
  elsif exists (select 1 from public.v_giaibai_hoan_thien b where b.nhanh = p_nhanh and b.key = p_key) then
    v_che_do := 'hoan_thien';
    if p_nhanh in ('toan','khtn','lyhoa','hgt') then
      execute format('select loi_giai, dap_an from %I where %I = %s', s.src, s.src_key, r.key_cast) into v_lg_ai, v_da_ai using p_key;
    elsif p_nhanh = 'hinh_baitoan' then
      -- Lời giải bài toán gốc nằm ở hinh_cach_giai (1 baitoan có thể nhiều cách) — lấy đúng cách claude_code
      -- chưa duyệt (v_giaibai_hoan_thien đã đảm bảo chỉ 1 dòng thoả điều kiện này cho mỗi bài toán).
      select loi_giai into v_lg_ai from hinh_cach_giai
        where baitoan_id = p_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false
        order by la_mac_dinh desc, thu_tu limit 1;
      v_da_ai := null; -- Hình không có khái niệm "đáp án ngắn"
    else -- hinh_bien_the: lời giải nằm ngay trên chính bảng, không có cột dap_an
      select loi_giai into v_lg_ai from hinh_baitoan_bien_the where id = p_key::uuid;
      v_da_ai := null;
    end if;
    v_model := 'claude_code';
  else
    raise exception 'Bài này không còn trong danh sách chưa có lời giải.';
  end if;
  select count(*) into n from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.dang_giu and v.trang_thai in ('dang_giai','can_sua');
  if n >= 3 then raise exception 'Bạn đang giữ 3 bài — nộp hoặc trả bớt rồi nhận thêm.'; end if;
  if exists (select 1 from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.nhanh = p_nhanh and v.key = p_key and v.tu_choi_lan >= 3) then
    raise exception 'Bài này bạn đã bị từ chối 3 lần — không nhận lại được.';
  end if;
  perform public.fn_giaibai_dong_qua_han(p_nhanh, p_key);
  select coalesce(v.nguoi_giai_ten, 'Claude') into v_ten from public.v_giaibai_nhan v where v.nhanh = p_nhanh and v.key = p_key and v.xu_ly_at is null limit 1;
  if v_ten is not null then raise exception '% đang giữ bài này.', v_ten; end if;
  begin
    execute format('insert into %I (%I, nguoi_yeu_cau, nguoi_giai, trang_thai, han_at, che_do, loi_giai_nhap, dap_an_nhap, loi_giai_ai, ai_model)
                     values (%s, $2, $2, ''dang_giai'', now() + interval ''48 hours'', $3, $4, $5, $4, $6) returning id',
                    r.yc, r.key_col, r.key_cast)
      into v_id using p_key, p_me, v_che_do, v_lg_ai, v_da_ai, v_model;
  exception when unique_violation then
    raise exception 'Bài này vừa có người khác nhận trước 1 bước — thử bài khác.';
  end;
  return v_id;
end $function$
;
-- fn_giaibai_dem_cho_ai
CREATE OR REPLACE FUNCTION public.fn_giaibai_dem_cho_ai(p_nhanh text[])
 RETURNS TABLE(nhanh text, so_cau bigint)
 LANGUAGE sql
 STABLE
AS $function$
  with k as (
    select 'toan'::text nh, count(*) n from dai_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'toan' = any(p_nhanh)
    union all
    select 'khtn', count(*) from khtn_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'khtn' = any(p_nhanh)
    union all
    select 'lyhoa', count(*) from lyhoa_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'lyhoa' = any(p_nhanh)
    union all
    select 'hgt', count(*) from hgt_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'hgt' = any(p_nhanh)
    union all
    select 'hinh_baitoan', count(*) from public.v_hinh_chua_giai where loai = 'baitoan' and loi_giai_ai is null and 'hinh_baitoan' = any(p_nhanh)
    union all
    select 'hinh_bien_the', count(*) from public.v_hinh_chua_giai where loai = 'bien_the' and loi_giai_ai is null and 'hinh_bien_the' = any(p_nhanh)
  )
  select nh, n from k where n > 0
$function$
;

-- (C2) view giải bài AI: thêm khối Lý hóa (nhân bản khối KHTN trong UNION)
create or replace view public.v_giaibai_bai as
 WITH k AS (
         SELECT 'toan'::text AS nhanh,
            c.ma_cau AS key,
            c.ma_cau AS ma,
            b.khoi,
            b.ten_dang AS nhom_ten,
            b.ma_dang AS nhom_ma,
            b.ten_chuyen_de AS nhom_truoc,
            b.muc_do,
            c.loai_cau,
            c.noi_dung AS de_bai,
            NULL::text AS gia_thiet,
            c.anh_de AS anh,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai_ai,
            c.dap_an_ai,
            c.ai_model,
            c.ai_de_xuat_at
           FROM dai_cau_hoi c
             JOIN dai_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.loi_giai IS NULL AND c.anh_dap_an IS NULL AND c.dap_an IS NULL
        UNION ALL
         SELECT 'khtn'::text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai_ai,
            c.dap_an_ai,
            c.ai_model,
            c.ai_de_xuat_at
           FROM khtn_cau_hoi c
             JOIN khtn_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.loi_giai IS NULL AND c.anh_dap_an IS NULL AND c.dap_an IS NULL
        UNION ALL
         SELECT 'lyhoa'::text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai_ai,
            c.dap_an_ai,
            c.ai_model,
            c.ai_de_xuat_at
           FROM lyhoa_cau_hoi c
             JOIN lyhoa_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.loi_giai IS NULL AND c.anh_dap_an IS NULL AND c.dap_an IS NULL
        UNION ALL
         SELECT 'hgt'::text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai_ai,
            c.dap_an_ai,
            c.ai_model,
            c.ai_de_xuat_at
           FROM hgt_cau_hoi c
             JOIN hgt_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.loi_giai IS NULL AND c.anh_dap_an IS NULL AND c.dap_an IS NULL
        UNION ALL
         SELECT
                CASE h.loai
                    WHEN 'baitoan'::text THEN 'hinh_baitoan'::text
                    ELSE 'hinh_bien_the'::text
                END AS "case",
            h.id::text AS id,
            h.ma,
            h.khoi,
            h.mo_hinh_ten,
            h.mo_hinh_ma,
            'Mô hình'::text,
            NULL::smallint AS int2,
                CASE h.loai
                    WHEN 'baitoan'::text THEN 'bai_toan_goc'::text
                    ELSE 'bien_the_'::text || h.kieu
                END AS "case",
            h.de_bai,
            h.gia_thiet,
            h.anh,
            NULL::jsonb AS jsonb,
            NULL::jsonb AS jsonb,
            NULL::text AS text,
            'le'::text,
            h.created_at,
            h.loi_giai_ai,
            h.dap_an_ai,
            h.ai_model,
            h.ai_de_xuat_at
           FROM v_hinh_chua_giai h
          WHERE NOT (h.loai = 'baitoan'::text AND fn_hinh_co_phu_thuoc_cho(h.id))
        )
 SELECT k.nhanh,
    k.key,
    k.ma,
    k.khoi,
    k.nhom_ten,
    k.nhom_ma,
    k.nhom_truoc,
    k.muc_do,
    k.loai_cau,
    k.de_bai,
    k.gia_thiet,
    k.anh,
    k.lua_chon,
    k.menh_de,
    k.dap_an,
    k.nguon,
    k.created_at,
    fn_giaibai_mon(k.nhanh) AS mon,
    y.id AS yc_id,
    y.nguoi_giai AS yc_nguoi_giai,
    y.nguoi_giai_ten AS yc_nguoi_giai_ten,
    y.trang_thai AS yc_trang_thai,
    y.han_at AS yc_han_at,
    y.created_at AS yc_created_at,
    y.ghi_chu AS yc_ghi_chu,
    k.loi_giai_ai,
    k.dap_an_ai,
    k.ai_model,
    k.ai_de_xuat_at
   FROM k
     LEFT JOIN LATERAL ( SELECT n.nhanh,
            n.id,
            n.key,
            n.ghi_chu,
            n.nguoi_yeu_cau,
            n.created_at,
            n.xu_ly_at,
            n.nguoi_giai,
            n.trang_thai,
            n.han_at,
            n.nop_at,
            n.cap_nhat_at,
            n.loi_giai_nhap,
            n.anh_nhap,
            n.dap_an_nhap,
            n.tu_choi_lan,
            n.ly_do_tu_choi,
            n.tu_choi_at,
            n.duyet_boi,
            n.duyet_at,
            n.so_ky_tu,
            n.so_cong_thuc,
            n.ma,
            n.khoi,
            n.nhom_ten,
            n.nhom_ma,
            n.nhom_truoc,
            n.muc_do,
            n.loai_cau,
            n.de_bai,
            n.gia_thiet,
            n.anh,
            n.lua_chon,
            n.menh_de,
            n.dap_an,
            n.bai_loi_giai,
            n.mon,
            n.dang_giu,
            n.qua_han,
            n.nguoi_giai_ten,
            n.duyet_boi_ten,
            n.giay_giai,
            n.loi_giai_ai,
            n.ai_model,
            n.che_do
           FROM v_giaibai_nhan n
          WHERE n.nhanh = k.nhanh AND n.key = k.key AND n.dang_giu
         LIMIT 1) y ON true;
create or replace view public.v_giaibai_hoan_thien as
 WITH k AS (
         SELECT 'toan'::text AS nhanh,
            c.ma_cau AS key,
            c.ma_cau AS ma,
            b.khoi,
            b.ten_dang AS nhom_ten,
            b.ma_dang AS nhom_ma,
            b.ten_chuyen_de AS nhom_truoc,
            b.muc_do,
            c.loai_cau,
            c.noi_dung AS de_bai,
            NULL::text AS gia_thiet,
            c.anh_de AS anh,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai AS loi_giai_ai,
            NULL::text AS dap_an_ai,
            'claude_code'::text AS ai_model,
            c.ai_de_xuat_at
           FROM dai_cau_hoi c
             JOIN dai_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.nguon_giai = 'ai'::text AND c.giai_method = 'claude_code'::text AND c.da_duyet = false
        UNION ALL
         SELECT 'khtn'::text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai,
            NULL::text AS text,
            'claude_code'::text AS text,
            c.ai_de_xuat_at
           FROM khtn_cau_hoi c
             JOIN khtn_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.nguon_giai = 'ai'::text AND c.giai_method = 'claude_code'::text AND c.da_duyet = false
        UNION ALL
         SELECT 'lyhoa'::text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai,
            NULL::text AS text,
            'claude_code'::text AS text,
            c.ai_de_xuat_at
           FROM lyhoa_cau_hoi c
             JOIN lyhoa_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.nguon_giai = 'ai'::text AND c.giai_method = 'claude_code'::text AND c.da_duyet = false
        UNION ALL
         SELECT 'hgt'::text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.nguon,
            c.created_at,
            c.loi_giai,
            NULL::text AS text,
            'claude_code'::text AS text,
            c.ai_de_xuat_at
           FROM hgt_cau_hoi c
             JOIN hgt_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.nguon_giai = 'ai'::text AND c.giai_method = 'claude_code'::text AND c.da_duyet = false
        UNION ALL
         SELECT 'hinh_baitoan'::text,
            b.id::text AS id,
            b.ma,
            m.khoi,
            m.ten,
            m.ma,
            'Mô hình'::text,
            NULL::smallint AS int2,
            'bai_toan_goc'::text,
            b.phat_bieu,
            concat_ws('
'::text, m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) AS concat_ws,
            COALESCE(b.anh_chuan, m.anh_cau_hinh) AS "coalesce",
            NULL::jsonb AS jsonb,
            NULL::jsonb AS jsonb,
            NULL::text AS text,
            'le'::text,
            b.created_at,
            cg.loi_giai,
            NULL::text AS text,
            'claude_code'::text AS text,
            cg.updated_at
           FROM hinh_cach_giai cg
             JOIN hinh_baitoan b ON b.id = cg.baitoan_id
             JOIN hinh_mo_hinh m ON m.id = b.mo_hinh_id
          WHERE cg.nguon_giai = 'ai'::text AND cg.giai_method = 'claude_code'::text AND cg.da_duyet = false AND NOT (EXISTS ( SELECT 1
                   FROM hinh_cach_giai x
                  WHERE x.baitoan_id = b.id AND x.id <> cg.id AND (x.loi_giai IS NOT NULL OR x.anh_loi_giai IS NOT NULL))) AND NOT fn_hinh_co_phu_thuoc_cho(b.id)
        UNION ALL
         SELECT 'hinh_bien_the'::text,
            v.id::text AS id,
            (b.ma || ' · BT'::text) || v.thu_tu,
            m.khoi,
            m.ten,
            m.ma,
            'Mô hình'::text,
            NULL::smallint AS int2,
            'bien_the_'::text || v.kieu,
            v.de_bai,
            concat_ws('
'::text, m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) AS concat_ws,
            COALESCE(v.anh, b.anh_chuan, m.anh_cau_hinh) AS "coalesce",
            NULL::jsonb AS jsonb,
            NULL::jsonb AS jsonb,
            NULL::text AS text,
            'le'::text,
            v.created_at,
            v.loi_giai,
            NULL::text AS text,
            'claude_code'::text AS text,
            v.updated_at
           FROM hinh_baitoan_bien_the v
             JOIN hinh_baitoan b ON b.id = v.baitoan_id
             JOIN hinh_mo_hinh m ON m.id = b.mo_hinh_id
          WHERE v.nguon_giai = 'ai'::text AND v.giai_method = 'claude_code'::text AND v.da_duyet = false
        )
 SELECT k.nhanh,
    k.key,
    k.ma,
    k.khoi,
    k.nhom_ten,
    k.nhom_ma,
    k.nhom_truoc,
    k.muc_do,
    k.loai_cau,
    k.de_bai,
    k.gia_thiet,
    k.anh,
    k.lua_chon,
    k.menh_de,
    k.dap_an,
    k.nguon,
    k.created_at,
    fn_giaibai_mon(k.nhanh) AS mon,
    y.id AS yc_id,
    y.nguoi_giai AS yc_nguoi_giai,
    y.nguoi_giai_ten AS yc_nguoi_giai_ten,
    y.trang_thai AS yc_trang_thai,
    y.han_at AS yc_han_at,
    y.created_at AS yc_created_at,
    y.ghi_chu AS yc_ghi_chu,
    k.loi_giai_ai,
    k.dap_an_ai,
    k.ai_model,
    k.ai_de_xuat_at
   FROM k
     LEFT JOIN LATERAL ( SELECT n.nhanh,
            n.id,
            n.key,
            n.ghi_chu,
            n.nguoi_yeu_cau,
            n.created_at,
            n.xu_ly_at,
            n.nguoi_giai,
            n.trang_thai,
            n.han_at,
            n.nop_at,
            n.cap_nhat_at,
            n.loi_giai_nhap,
            n.anh_nhap,
            n.dap_an_nhap,
            n.tu_choi_lan,
            n.ly_do_tu_choi,
            n.tu_choi_at,
            n.duyet_boi,
            n.duyet_at,
            n.so_ky_tu,
            n.so_cong_thuc,
            n.ma,
            n.khoi,
            n.nhom_ten,
            n.nhom_ma,
            n.nhom_truoc,
            n.muc_do,
            n.loai_cau,
            n.de_bai,
            n.gia_thiet,
            n.anh,
            n.lua_chon,
            n.menh_de,
            n.dap_an,
            n.bai_loi_giai,
            n.mon,
            n.dang_giu,
            n.qua_han,
            n.nguoi_giai_ten,
            n.duyet_boi_ten,
            n.giay_giai,
            n.loi_giai_ai,
            n.ai_model,
            n.che_do
           FROM v_giaibai_nhan n
          WHERE n.nhanh = k.nhanh AND n.key = k.key AND n.dang_giu
         LIMIT 1) y ON true;
create or replace view public.v_giaibai_nhan as
 WITH k AS (
         SELECT 'toan'::text AS nhanh,
            y.id,
            y.ma_cau,
            y.ghi_chu,
            y.nguoi_yeu_cau,
            y.created_at,
            y.xu_ly_at,
            y.nguoi_giai,
            y.trang_thai,
            y.han_at,
            y.nop_at,
            y.cap_nhat_at,
            y.loi_giai_nhap,
            y.anh_nhap,
            y.dap_an_nhap,
            y.tu_choi_lan,
            y.ly_do_tu_choi,
            y.tu_choi_at,
            y.duyet_boi,
            y.duyet_at,
            y.so_ky_tu,
            y.so_cong_thuc,
            y.loi_giai_ai,
            y.ai_model,
            y.che_do,
            y.y_nhap,
            y.ma_cau AS key,
            c.ma_cau AS ma,
            b.khoi,
            b.ten_dang AS nhom_ten,
            b.ma_dang AS nhom_ma,
            b.ten_chuyen_de AS nhom_truoc,
            b.muc_do,
            c.loai_cau,
            c.noi_dung AS de_bai,
            NULL::text AS gia_thiet,
            c.anh_de AS anh,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai AS bai_loi_giai
           FROM dai_cau_hoi_yeu_cau_giai y
             JOIN dai_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN dai_ban_do b ON b.ma_dang = c.dang_chinh
        UNION ALL
         SELECT 'khtn'::text,
            y.id,
            y.ma_cau,
            y.ghi_chu,
            y.nguoi_yeu_cau,
            y.created_at,
            y.xu_ly_at,
            y.nguoi_giai,
            y.trang_thai,
            y.han_at,
            y.nop_at,
            y.cap_nhat_at,
            y.loi_giai_nhap,
            y.anh_nhap,
            y.dap_an_nhap,
            y.tu_choi_lan,
            y.ly_do_tu_choi,
            y.tu_choi_at,
            y.duyet_boi,
            y.duyet_at,
            y.so_ky_tu,
            y.so_cong_thuc,
            y.loi_giai_ai,
            y.ai_model,
            y.che_do,
            y.y_nhap,
            y.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai
           FROM khtn_cau_hoi_yeu_cau_giai y
             JOIN khtn_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN khtn_ban_do b ON b.ma_dang = c.dang_chinh
        UNION ALL
         SELECT 'lyhoa'::text,
            y.id,
            y.ma_cau,
            y.ghi_chu,
            y.nguoi_yeu_cau,
            y.created_at,
            y.xu_ly_at,
            y.nguoi_giai,
            y.trang_thai,
            y.han_at,
            y.nop_at,
            y.cap_nhat_at,
            y.loi_giai_nhap,
            y.anh_nhap,
            y.dap_an_nhap,
            y.tu_choi_lan,
            y.ly_do_tu_choi,
            y.tu_choi_at,
            y.duyet_boi,
            y.duyet_at,
            y.so_ky_tu,
            y.so_cong_thuc,
            y.loi_giai_ai,
            y.ai_model,
            y.che_do,
            y.y_nhap,
            y.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai
           FROM lyhoa_cau_hoi_yeu_cau_giai y
             JOIN lyhoa_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN lyhoa_ban_do b ON b.ma_dang = c.dang_chinh
        UNION ALL
         SELECT 'hgt'::text,
            y.id,
            y.ma_cau,
            y.ghi_chu,
            y.nguoi_yeu_cau,
            y.created_at,
            y.xu_ly_at,
            y.nguoi_giai,
            y.trang_thai,
            y.han_at,
            y.nop_at,
            y.cap_nhat_at,
            y.loi_giai_nhap,
            y.anh_nhap,
            y.dap_an_nhap,
            y.tu_choi_lan,
            y.ly_do_tu_choi,
            y.tu_choi_at,
            y.duyet_boi,
            y.duyet_at,
            y.so_ky_tu,
            y.so_cong_thuc,
            y.loi_giai_ai,
            y.ai_model,
            y.che_do,
            y.y_nhap,
            y.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai
           FROM hgt_cau_hoi_yeu_cau_giai y
             JOIN hgt_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN hgt_ban_do b ON b.ma_dang = c.dang_chinh
        ), h AS (
         SELECT 'hinh_baitoan'::text AS nhanh,
            y.id,
            y.baitoan_id::text AS key,
            y.ghi_chu,
            y.nguoi_yeu_cau,
            y.created_at,
            y.xu_ly_at,
            y.nguoi_giai,
            y.trang_thai,
            y.han_at,
            y.nop_at,
            y.cap_nhat_at,
            y.loi_giai_nhap,
            y.anh_nhap,
            y.dap_an_nhap,
            y.tu_choi_lan,
            y.ly_do_tu_choi,
            y.tu_choi_at,
            y.duyet_boi,
            y.duyet_at,
            y.so_ky_tu,
            y.so_cong_thuc,
            b.ma,
            m.khoi,
            m.ten AS nhom_ten,
            m.ma AS nhom_ma,
            'Mô hình'::text AS nhom_truoc,
            NULL::smallint AS muc_do,
            'bai_toan_goc'::text AS loai_cau,
            b.phat_bieu AS de_bai,
            concat_ws('
'::text, m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) AS gia_thiet,
            COALESCE(b.anh_chuan, m.anh_cau_hinh) AS anh,
            NULL::jsonb AS lua_chon,
            NULL::jsonb AS menh_de,
            NULL::text AS dap_an,
            ( SELECT cg.loi_giai
                   FROM hinh_cach_giai cg
                  WHERE cg.baitoan_id = b.id AND (cg.loi_giai IS NOT NULL OR cg.anh_loi_giai IS NOT NULL)
                  ORDER BY cg.la_mac_dinh DESC, cg.thu_tu
                 LIMIT 1) AS bai_loi_giai,
            y.loi_giai_ai,
            y.ai_model,
            y.che_do,
            y.y_nhap
           FROM hinh_baitoan_yeu_cau_giai y
             JOIN hinh_baitoan b ON b.id = y.baitoan_id
             JOIN hinh_mo_hinh m ON m.id = b.mo_hinh_id
        UNION ALL
         SELECT 'hinh_bien_the'::text,
            y.id,
            y.bien_the_id::text AS bien_the_id,
            y.ghi_chu,
            y.nguoi_yeu_cau,
            y.created_at,
            y.xu_ly_at,
            y.nguoi_giai,
            y.trang_thai,
            y.han_at,
            y.nop_at,
            y.cap_nhat_at,
            y.loi_giai_nhap,
            y.anh_nhap,
            y.dap_an_nhap,
            y.tu_choi_lan,
            y.ly_do_tu_choi,
            y.tu_choi_at,
            y.duyet_boi,
            y.duyet_at,
            y.so_ky_tu,
            y.so_cong_thuc,
            (b.ma || ' · BT'::text) || v.thu_tu,
            m.khoi,
            m.ten,
            m.ma,
            'Mô hình'::text,
            NULL::smallint AS int2,
            'bien_the_'::text || v.kieu,
            v.de_bai,
            concat_ws('
'::text, m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) AS concat_ws,
            COALESCE(v.anh, b.anh_chuan, m.anh_cau_hinh) AS "coalesce",
            NULL::jsonb AS jsonb,
            NULL::jsonb AS jsonb,
            NULL::text AS text,
            v.loi_giai,
            y.loi_giai_ai,
            y.ai_model,
            y.che_do,
            y.y_nhap
           FROM hinh_bien_the_yeu_cau_giai y
             JOIN hinh_baitoan_bien_the v ON v.id = y.bien_the_id
             JOIN hinh_baitoan b ON b.id = v.baitoan_id
             JOIN hinh_mo_hinh m ON m.id = b.mo_hinh_id
        ), u AS (
         SELECT k.nhanh,
            k.id,
            k.key,
            k.ghi_chu,
            k.nguoi_yeu_cau,
            k.created_at,
            k.xu_ly_at,
            k.nguoi_giai,
            k.trang_thai,
            k.han_at,
            k.nop_at,
            k.cap_nhat_at,
            k.loi_giai_nhap,
            k.anh_nhap,
            k.dap_an_nhap,
            k.tu_choi_lan,
            k.ly_do_tu_choi,
            k.tu_choi_at,
            k.duyet_boi,
            k.duyet_at,
            k.so_ky_tu,
            k.so_cong_thuc,
            k.ma,
            k.khoi,
            k.nhom_ten,
            k.nhom_ma,
            k.nhom_truoc,
            k.muc_do,
            k.loai_cau,
            k.de_bai,
            k.gia_thiet,
            k.anh,
            k.lua_chon,
            k.menh_de,
            k.dap_an,
            k.bai_loi_giai,
            k.loi_giai_ai,
            k.ai_model,
            k.che_do,
            k.y_nhap
           FROM k
        UNION ALL
         SELECT h.nhanh,
            h.id,
            h.key,
            h.ghi_chu,
            h.nguoi_yeu_cau,
            h.created_at,
            h.xu_ly_at,
            h.nguoi_giai,
            h.trang_thai,
            h.han_at,
            h.nop_at,
            h.cap_nhat_at,
            h.loi_giai_nhap,
            h.anh_nhap,
            h.dap_an_nhap,
            h.tu_choi_lan,
            h.ly_do_tu_choi,
            h.tu_choi_at,
            h.duyet_boi,
            h.duyet_at,
            h.so_ky_tu,
            h.so_cong_thuc,
            h.ma,
            h.khoi,
            h.nhom_ten,
            h.nhom_ma,
            h.nhom_truoc,
            h.muc_do,
            h.loai_cau,
            h.de_bai,
            h.gia_thiet,
            h.anh,
            h.lua_chon,
            h.menh_de,
            h.dap_an,
            h.bai_loi_giai,
            h.loi_giai_ai,
            h.ai_model,
            h.che_do,
            h.y_nhap
           FROM h
        )
 SELECT u.nhanh,
    u.id,
    u.key,
    u.ghi_chu,
    u.nguoi_yeu_cau,
    u.created_at,
    u.xu_ly_at,
    u.nguoi_giai,
    u.trang_thai,
    u.han_at,
    u.nop_at,
    u.cap_nhat_at,
    u.loi_giai_nhap,
    u.anh_nhap,
    u.dap_an_nhap,
    u.tu_choi_lan,
    u.ly_do_tu_choi,
    u.tu_choi_at,
    u.duyet_boi,
    u.duyet_at,
    u.so_ky_tu,
    u.so_cong_thuc,
    u.ma,
    u.khoi,
    u.nhom_ten,
    u.nhom_ma,
    u.nhom_truoc,
    u.muc_do,
    u.loai_cau,
    u.de_bai,
    u.gia_thiet,
    u.anh,
    u.lua_chon,
    u.menh_de,
    u.dap_an,
    u.bai_loi_giai,
    fn_giaibai_mon(u.nhanh) AS mon,
    fn_giaibai_dang_giu(u.trang_thai, u.han_at, u.xu_ly_at) AS dang_giu,
    u.xu_ly_at IS NULL AND (u.trang_thai = ANY (ARRAY['dang_giai'::text, 'can_sua'::text])) AND u.han_at < now() AS qua_han,
    ns.ho_ten AS nguoi_giai_ten,
    nd.ho_ten AS duyet_boi_ten,
    EXTRACT(epoch FROM u.nop_at - u.created_at)::integer AS giay_giai,
    u.loi_giai_ai,
    u.ai_model,
    u.che_do,
    u.y_nhap
   FROM u
     LEFT JOIN nhan_su ns ON ns.id = u.nguoi_giai
     LEFT JOIN nhan_su nd ON nd.id = u.duyet_boi;

-- (C3) CHECK khoá nhánh kho ở bảng log dùng chung: thêm lyhoa
alter table public.kho_doi_dang_log drop constraint kho_doi_dang_log_mon_check;
alter table public.kho_doi_dang_log add constraint kho_doi_dang_log_mon_check CHECK ((mon = ANY (ARRAY['dai'::text, 'hgt'::text, 'khtn'::text, 'lyhoa'::text, 'anh'::text, 'tsa'::text])));
alter table public.kho_kiem_lo drop constraint kho_kiem_lo_kho_check;
alter table public.kho_kiem_lo add constraint kho_kiem_lo_kho_check CHECK ((kho = ANY (ARRAY['dai'::text, 'khtn'::text, 'lyhoa'::text, 'hgt'::text, 'anh'::text, 'tsa'::text])));
alter table public.kho_de_sau drop constraint kho_de_sau_mon_check;
alter table public.kho_de_sau add constraint kho_de_sau_mon_check CHECK ((mon = ANY (ARRAY['toan'::text, 'khtn'::text, 'lyhoa'::text, 'hgt'::text, 'hinh_hoc'::text, 'anh'::text, 'tsa'::text])));
alter table public.kho_nhan_xet drop constraint kho_nhan_xet_mon_check;
alter table public.kho_nhan_xet add constraint kho_nhan_xet_mon_check CHECK ((mon = ANY (ARRAY['toan'::text, 'khtn'::text, 'lyhoa'::text, 'hgt'::text, 'hinh_hoc'::text, 'anh'::text, 'tsa'::text])));

-- (D) dạng chờ (câu nhập kho chưa phân dạng) — giống K07..K09 của KHTN
insert into public.lyhoa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
select 'L' || k || '000000', k, 'L' || k || '00', 'Chưa phân dạng', 'L' || k || '0000', 'Chưa phân dạng', 'Chưa phân dạng', 1, 'C',
       'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).'
  from unnest(array['10', '11', '12']) k;
