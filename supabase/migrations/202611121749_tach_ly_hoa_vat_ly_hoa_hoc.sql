-- ============================================================================
-- TÁCH "Lý hóa" ⇒ 2 MÔN: VẬT LÝ + HÓA HỌC (Thùy 12/11: "lý 1 môn hóa 1 môn"; khối 10–12; "đặt sao cho không lẫn")
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_vat_ly_hoa_hoc.mjs — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202611121420/1511/1535/1541 dựng nhầm MỘT môn "Lý hóa". Ở cấp 3 KHTN tách thành Vật lý · Hóa học · Sinh học —
--   mỗi môn một trung tâm (§1.6). Tên đầy đủ "Vật lý"/"Hóa học" để không lẫn với PHÂN MÔN "Lý"/"Hóa" bên trong KHTN.
--   (A) Dựng vatly_* + hoahoc_* (bảng RỖNG, chuỗi, hàm, trigger, policy, quyền) từ khuôn KHTN. Mã gốc: Vật lý L…, Hóa học Q….
--   (B) Mọi hàm/view dùng chung: BẢN GỐC (trước Lý hóa) + chèn nhánh 2 môn cạnh nhánh KHTN. Lớp 2 môn chỉ khối 10–12.
--   (C) Gỡ bộ Lý hóa: 45 hàm *lyhoa*, 25 bảng lyhoa_* (rỗng trừ 3 dòng dạng chờ L10/L11/L12 do mig 1511 tự tạo), chuỗi lyhoa_*.
-- MẤT GÌ (Luật xoá — Thùy gật 12/11): chỉ bộ Lý hóa ở (C), không có dữ liệu người nhập (0 lớp/nhân sự/phân công/phiên/sổ tay).
--   Bảng bị gỡ bằng DROP thường (không CASCADE) — còn gì bám vào là migration hỏng, không âm thầm kéo theo.
-- ============================================================================
set local check_function_bodies = off;


-- ════ (A) MÔN VẬT LÝ — bảng vatly_*, mã L… ════
create sequence public.vatly_bdm_chu_de_seq as bigint;
create sequence public.vatly_bdm_chuyen_de_seq as bigint;
create sequence public.vatly_bdm_dang_bai_seq as bigint;
create sequence public.vatly_bdm_log_id_seq as bigint;
create sequence public.vatly_bdm_nhom_seq as bigint;
create sequence public.vatly_bdm_tu_choi_id_seq as bigint;
create sequence public.vatly_cau_seq as bigint;
create sequence public.vatly_cum_seq as bigint;
create sequence public.vatly_dang_seq as bigint;
create table public.vatly_ban_do (like public.khtn_ban_do including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_ban_do alter column ma_dang set default ('LG'::text || lpad((nextval('vatly_dang_seq'::regclass))::text, 5, '0'::text));
create table public.vatly_cau_hoi (like public.khtn_cau_hoi including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_cau_hoi alter column ma_cau set default ('LC'::text || lpad((nextval('vatly_cau_seq'::regclass))::text, 6, '0'::text));
create table public.vatly_dang_ly_thuyet (like public.khtn_dang_ly_thuyet including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_chuyen_de_ly_thuyet (like public.khtn_chuyen_de_ly_thuyet including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_cum_bai (like public.khtn_cum_bai including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_cum_bai alter column ma_cum set default ('LCUM'::text || lpad((nextval('vatly_cum_seq'::regclass))::text, 5, '0'::text));
create table public.vatly_dang_tien_de (like public.khtn_dang_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_cum_tien_de (like public.khtn_cum_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_cau_hoi_yeu_cau_giai (like public.khtn_cau_hoi_yeu_cau_giai including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_de_xuat (like public.khtn_de_xuat including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_de_xuat_cau (like public.khtn_de_xuat_cau including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_de_xuat_quyet_dinh (like public.khtn_de_xuat_quyet_dinh including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_mcq_rule (like public.khtn_mcq_rule including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_cau_form_tn (like public.khtn_cau_form_tn including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_chu_de (like public.khtn_bdm_chu_de including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_bdm_chu_de alter column id set default ('LCD'::text || lpad((nextval('vatly_bdm_chu_de_seq'::regclass))::text, 5, '0'::text));
create table public.vatly_bdm_chuyen_de (like public.khtn_bdm_chuyen_de including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_bdm_chuyen_de alter column id set default ('LCH'::text || lpad((nextval('vatly_bdm_chuyen_de_seq'::regclass))::text, 5, '0'::text));
create table public.vatly_bdm_o (like public.khtn_bdm_o including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_nhom (like public.khtn_bdm_nhom including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_bdm_nhom alter column id set default ('LNB'::text || lpad((nextval('vatly_bdm_nhom_seq'::regclass))::text, 5, '0'::text));
create table public.vatly_bdm_dang_bai (like public.khtn_bdm_dang_bai including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_bdm_dang_bai alter column id set default ('LDB'::text || lpad((nextval('vatly_bdm_dang_bai_seq'::regclass))::text, 5, '0'::text));
create table public.vatly_bdm_nhom_tien_de (like public.khtn_bdm_nhom_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_gan_cau (like public.khtn_bdm_gan_cau including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_log (like public.khtn_bdm_log including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_de_xuat (like public.khtn_bdm_de_xuat including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_cau_thieu_dang (like public.khtn_bdm_cau_thieu_dang including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_kiem_mau (like public.khtn_bdm_kiem_mau including defaults including identity including generated including indexes including comments including storage);
create table public.vatly_bdm_tu_choi (like public.khtn_bdm_tu_choi including defaults including identity including generated including indexes including comments including storage);
alter table public.vatly_bdm_cau_thieu_dang add constraint vatly_bdm_cau_thieu_dang_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.vatly_bdm_chu_de add constraint vatly_bdm_chu_de_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.vatly_bdm_chuyen_de add constraint vatly_bdm_chuyen_de_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.vatly_bdm_dang_bai add constraint vatly_bdm_dang_bai_bac_toi_thieu_check CHECK ((bac_toi_thieu = ANY (ARRAY['S'::text, 'A'::text, 'B'::text, 'C'::text, 'D'::text])));
alter table public.vatly_bdm_dang_bai add constraint vatly_bdm_dang_bai_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.vatly_bdm_de_xuat add constraint vatly_bdm_de_xuat_chac_check CHECK ((chac = ANY (ARRAY['cao'::text, 'vua'::text])));
alter table public.vatly_bdm_de_xuat add constraint vatly_bdm_de_xuat_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.vatly_bdm_gan_cau add constraint vatly_bdm_gan_cau_nguon_check CHECK ((nguon = ANY (ARRAY['nguoi'::text, 'ai'::text, 'cum'::text])));
alter table public.vatly_bdm_kiem_mau add constraint vatly_bdm_kiem_mau_ket_qua_check CHECK ((ket_qua = ANY (ARRAY['giu'::text, 'doi'::text])));
alter table public.vatly_bdm_log add constraint vatly_bdm_log_hanh_dong_check CHECK ((hanh_dong = ANY (ARRAY['them'::text, 'sua'::text, 'xoa'::text])));
alter table public.vatly_bdm_nhom add constraint vatly_bdm_nhom_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.vatly_bdm_nhom_tien_de add constraint vatly_bdm_nhom_tien_de_check CHECK ((nhom_id <> tien_de_nhom_id));
alter table public.vatly_cau_form_tn add constraint vatly_cau_form_tn_dap_an_check CHECK ((dap_an = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text])));
alter table public.vatly_cau_form_tn add constraint vatly_cau_form_tn_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_duyet_nguon_check CHECK ((duyet_nguon = ANY (ARRAY['nguoi'::text, 'may'::text, 'ai'::text])));
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_kiem_may_boi_check CHECK ((kiem_may_boi = ANY (ARRAY['mcq-auto'::text, 'claude_code'::text, 'nguoi'::text])));
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_kiem_may_check CHECK ((kiem_may = ANY (ARRAY['khop'::text, 'nghi'::text, 'khong_kiem_duoc'::text])));
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_muc_cau_check CHECK (((muc_cau >= 1) AND (muc_cau <= 5)));
alter table public.vatly_cau_hoi_yeu_cau_giai add constraint vatly_cau_hoi_yeu_cau_giai_che_do_check CHECK ((che_do = ANY (ARRAY['giai'::text, 'hoan_thien'::text])));
alter table public.vatly_cau_hoi_yeu_cau_giai add constraint vatly_cau_hoi_yeu_cau_giai_trang_thai_chk CHECK (((trang_thai = ANY (ARRAY['cho_claude'::text, 'da_xong'::text, 'dang_giai'::text, 'cho_duyet'::text, 'can_sua'::text, 'da_duyet'::text, 'da_tra'::text, 'qua_han'::text, 'tu_choi_3'::text])) AND ((nguoi_giai IS NULL) = (trang_thai = ANY (ARRAY['cho_claude'::text, 'da_xong'::text])))));
alter table public.vatly_cum_tien_de add constraint vatly_cum_tien_de_check CHECK ((ma_cum <> tien_de_ma_cum));
alter table public.vatly_dang_tien_de add constraint vatly_dang_tien_de_check CHECK ((ma_dang <> tien_de_ma_dang));
alter table public.vatly_de_xuat add constraint vatly_de_xuat_hinh_dang CHECK ((((loai = 'dang_moi'::text) AND (ten IS NOT NULL) AND (mo_ta_ngan IS NOT NULL) AND (ma_dang IS NULL)) OR ((loai = 'cum_moi'::text) AND (ten IS NOT NULL) AND (ma_dang IS NOT NULL)) OR ((loai = 'trao_doi'::text) AND (ten IS NULL))));
alter table public.vatly_de_xuat add constraint vatly_de_xuat_loai_check CHECK ((loai = ANY (ARRAY['dang_moi'::text, 'cum_moi'::text, 'trao_doi'::text])));
alter table public.vatly_de_xuat add constraint vatly_de_xuat_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.vatly_de_xuat_quyet_dinh add constraint vatly_de_xuat_qd_tra_loi CHECK (((hanh_dong <> ALL (ARRAY['bac'::text, 'tra_loi'::text])) OR (NULLIF(btrim(tra_loi), ''::text) IS NOT NULL)));
alter table public.vatly_de_xuat_quyet_dinh add constraint vatly_de_xuat_quyet_dinh_hanh_dong_check CHECK ((hanh_dong = ANY (ARRAY['nhan'::text, 'nhan_co_sua'::text, 'gop'::text, 'bac'::text, 'tra_loi'::text])));
alter table public.vatly_mcq_rule add constraint vatly_mcq_rule_nhom_check CHECK ((nhom = ANY (ARRAY['khai_niem'::text, 'tinh'::text])));
alter table public.vatly_ban_do add constraint vatly_ban_do_bac_toi_thieu_fkey FOREIGN KEY (bac_toi_thieu) REFERENCES lop_bac(ma);
alter table public.vatly_bdm_cau_thieu_dang add constraint vatly_bdm_cau_thieu_dang_chu_de_id_fkey FOREIGN KEY (chu_de_id) REFERENCES vatly_bdm_chu_de(id);
alter table public.vatly_bdm_cau_thieu_dang add constraint vatly_bdm_cau_thieu_dang_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau);
alter table public.vatly_bdm_dang_bai add constraint vatly_bdm_dang_bai_nhom_id_fkey FOREIGN KEY (nhom_id) REFERENCES vatly_bdm_nhom(id);
alter table public.vatly_bdm_de_xuat add constraint vatly_bdm_de_xuat_dang_bai_id_fkey FOREIGN KEY (dang_bai_id) REFERENCES vatly_bdm_dang_bai(id);
alter table public.vatly_bdm_de_xuat add constraint vatly_bdm_de_xuat_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau);
alter table public.vatly_bdm_gan_cau add constraint vatly_bdm_gan_cau_dang_bai_id_fkey FOREIGN KEY (dang_bai_id) REFERENCES vatly_bdm_dang_bai(id);
alter table public.vatly_bdm_gan_cau add constraint vatly_bdm_gan_cau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau);
alter table public.vatly_bdm_kiem_mau add constraint vatly_bdm_kiem_mau_dang_bai_ai_id_fkey FOREIGN KEY (dang_bai_ai_id) REFERENCES vatly_bdm_dang_bai(id);
alter table public.vatly_bdm_kiem_mau add constraint vatly_bdm_kiem_mau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau);
alter table public.vatly_bdm_nhom add constraint vatly_bdm_nhom_chu_de_id_chuyen_de_id_fkey FOREIGN KEY (chu_de_id, chuyen_de_id) REFERENCES vatly_bdm_o(chu_de_id, chuyen_de_id) ON UPDATE CASCADE;
alter table public.vatly_bdm_nhom_tien_de add constraint vatly_bdm_nhom_tien_de_nhom_id_fkey FOREIGN KEY (nhom_id) REFERENCES vatly_bdm_nhom(id);
alter table public.vatly_bdm_nhom_tien_de add constraint vatly_bdm_nhom_tien_de_tien_de_nhom_id_fkey FOREIGN KEY (tien_de_nhom_id) REFERENCES vatly_bdm_nhom(id);
alter table public.vatly_bdm_o add constraint vatly_bdm_o_chu_de_id_fkey FOREIGN KEY (chu_de_id) REFERENCES vatly_bdm_chu_de(id);
alter table public.vatly_bdm_o add constraint vatly_bdm_o_chuyen_de_id_fkey FOREIGN KEY (chuyen_de_id) REFERENCES vatly_bdm_chuyen_de(id);
alter table public.vatly_cau_form_tn add constraint vatly_cau_form_tn_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id);
alter table public.vatly_cau_form_tn add constraint vatly_cau_form_tn_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau);
alter table public.vatly_cau_form_tn add constraint vatly_cau_form_tn_tu_choi_boi_fkey FOREIGN KEY (tu_choi_boi) REFERENCES nhan_su(id);
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_dang_chinh_fkey FOREIGN KEY (dang_chinh) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id);
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_kiem_may_lo_fkey FOREIGN KEY (kiem_may_lo) REFERENCES kho_kiem_lo(id);
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_ma_cum_fkey FOREIGN KEY (ma_cum) REFERENCES vatly_cum_bai(ma_cum) ON DELETE SET NULL;
alter table public.vatly_cau_hoi add constraint vatly_cau_hoi_parent_ma_cau_fkey FOREIGN KEY (parent_ma_cau) REFERENCES vatly_cau_hoi(ma_cau) ON UPDATE CASCADE;
alter table public.vatly_cau_hoi_yeu_cau_giai add constraint vatly_cau_hoi_yeu_cau_giai_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.vatly_cau_hoi_yeu_cau_giai add constraint vatly_cau_hoi_yeu_cau_giai_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau) ON DELETE CASCADE;
alter table public.vatly_cau_hoi_yeu_cau_giai add constraint vatly_cau_hoi_yeu_cau_giai_nguoi_giai_fkey FOREIGN KEY (nguoi_giai) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.vatly_cau_hoi_yeu_cau_giai add constraint vatly_cau_hoi_yeu_cau_giai_nguoi_yeu_cau_fkey FOREIGN KEY (nguoi_yeu_cau) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.vatly_cum_bai add constraint vatly_cum_bai_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.vatly_cum_tien_de add constraint vatly_cum_tien_de_ma_cum_fkey FOREIGN KEY (ma_cum) REFERENCES vatly_cum_bai(ma_cum) ON DELETE CASCADE;
alter table public.vatly_cum_tien_de add constraint vatly_cum_tien_de_tien_de_ma_cum_fkey FOREIGN KEY (tien_de_ma_cum) REFERENCES vatly_cum_bai(ma_cum) ON DELETE CASCADE;
alter table public.vatly_dang_ly_thuyet add constraint vatly_dang_ly_thuyet_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.vatly_dang_tien_de add constraint vatly_dang_tien_de_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.vatly_dang_tien_de add constraint vatly_dang_tien_de_tien_de_ma_dang_fkey FOREIGN KEY (tien_de_ma_dang) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.vatly_de_xuat add constraint vatly_de_xuat_dang_gan_nhat_fkey FOREIGN KEY (dang_gan_nhat) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.vatly_de_xuat add constraint vatly_de_xuat_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.vatly_de_xuat_cau add constraint vatly_de_xuat_cau_de_xuat_id_fkey FOREIGN KEY (de_xuat_id) REFERENCES vatly_de_xuat(id) ON DELETE CASCADE;
alter table public.vatly_de_xuat_cau add constraint vatly_de_xuat_cau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES vatly_cau_hoi(ma_cau) ON UPDATE CASCADE;
alter table public.vatly_de_xuat_quyet_dinh add constraint vatly_de_xuat_quyet_dinh_de_xuat_id_fkey FOREIGN KEY (de_xuat_id) REFERENCES vatly_de_xuat(id) ON DELETE CASCADE;
alter table public.vatly_de_xuat_quyet_dinh add constraint vatly_de_xuat_quyet_dinh_ket_qua_ma_cum_fkey FOREIGN KEY (ket_qua_ma_cum) REFERENCES vatly_cum_bai(ma_cum) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.vatly_de_xuat_quyet_dinh add constraint vatly_de_xuat_quyet_dinh_ket_qua_ma_dang_fkey FOREIGN KEY (ket_qua_ma_dang) REFERENCES vatly_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.vatly_de_xuat_quyet_dinh add constraint vatly_de_xuat_quyet_dinh_nguoi_fkey FOREIGN KEY (nguoi) REFERENCES nhan_su(id);
alter table public.vatly_ban_do enable row level security;
create policy "vatly_ban_do_member_all" on public.vatly_ban_do as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_ban_do to anon;
grant SELECT on public.vatly_ban_do to anon;
grant UPDATE on public.vatly_ban_do to anon;
grant DELETE on public.vatly_ban_do to anon;
grant INSERT on public.vatly_ban_do to authenticated;
grant SELECT on public.vatly_ban_do to authenticated;
grant UPDATE on public.vatly_ban_do to authenticated;
grant DELETE on public.vatly_ban_do to authenticated;
alter table public.vatly_cau_hoi enable row level security;
create policy "vatly_cau_hoi_member_all" on public.vatly_cau_hoi as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_cau_hoi to anon;
grant SELECT on public.vatly_cau_hoi to anon;
grant UPDATE on public.vatly_cau_hoi to anon;
grant DELETE on public.vatly_cau_hoi to anon;
grant INSERT on public.vatly_cau_hoi to authenticated;
grant SELECT on public.vatly_cau_hoi to authenticated;
grant UPDATE on public.vatly_cau_hoi to authenticated;
grant DELETE on public.vatly_cau_hoi to authenticated;
alter table public.vatly_dang_ly_thuyet enable row level security;
create policy "vatly_dang_ly_thuyet_member_all" on public.vatly_dang_ly_thuyet as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_dang_ly_thuyet to anon;
grant SELECT on public.vatly_dang_ly_thuyet to anon;
grant UPDATE on public.vatly_dang_ly_thuyet to anon;
grant DELETE on public.vatly_dang_ly_thuyet to anon;
grant INSERT on public.vatly_dang_ly_thuyet to authenticated;
grant SELECT on public.vatly_dang_ly_thuyet to authenticated;
grant UPDATE on public.vatly_dang_ly_thuyet to authenticated;
grant DELETE on public.vatly_dang_ly_thuyet to authenticated;
alter table public.vatly_chuyen_de_ly_thuyet enable row level security;
create policy "vatly_chuyen_de_ly_thuyet_member_all" on public.vatly_chuyen_de_ly_thuyet as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_chuyen_de_ly_thuyet to anon;
grant SELECT on public.vatly_chuyen_de_ly_thuyet to anon;
grant UPDATE on public.vatly_chuyen_de_ly_thuyet to anon;
grant DELETE on public.vatly_chuyen_de_ly_thuyet to anon;
grant INSERT on public.vatly_chuyen_de_ly_thuyet to authenticated;
grant SELECT on public.vatly_chuyen_de_ly_thuyet to authenticated;
grant UPDATE on public.vatly_chuyen_de_ly_thuyet to authenticated;
grant DELETE on public.vatly_chuyen_de_ly_thuyet to authenticated;
alter table public.vatly_cum_bai enable row level security;
create policy "vatly_cum_bai_member_all" on public.vatly_cum_bai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_cum_bai to anon;
grant SELECT on public.vatly_cum_bai to anon;
grant UPDATE on public.vatly_cum_bai to anon;
grant DELETE on public.vatly_cum_bai to anon;
grant INSERT on public.vatly_cum_bai to authenticated;
grant SELECT on public.vatly_cum_bai to authenticated;
grant UPDATE on public.vatly_cum_bai to authenticated;
grant DELETE on public.vatly_cum_bai to authenticated;
alter table public.vatly_dang_tien_de enable row level security;
create policy "vatly_dang_tien_de_member_all" on public.vatly_dang_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_dang_tien_de to anon;
grant SELECT on public.vatly_dang_tien_de to anon;
grant UPDATE on public.vatly_dang_tien_de to anon;
grant DELETE on public.vatly_dang_tien_de to anon;
grant INSERT on public.vatly_dang_tien_de to authenticated;
grant SELECT on public.vatly_dang_tien_de to authenticated;
grant UPDATE on public.vatly_dang_tien_de to authenticated;
grant DELETE on public.vatly_dang_tien_de to authenticated;
alter table public.vatly_cum_tien_de enable row level security;
create policy "vatly_cum_tien_de_member_all" on public.vatly_cum_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_cum_tien_de to anon;
grant SELECT on public.vatly_cum_tien_de to anon;
grant UPDATE on public.vatly_cum_tien_de to anon;
grant DELETE on public.vatly_cum_tien_de to anon;
grant INSERT on public.vatly_cum_tien_de to authenticated;
grant SELECT on public.vatly_cum_tien_de to authenticated;
grant UPDATE on public.vatly_cum_tien_de to authenticated;
grant DELETE on public.vatly_cum_tien_de to authenticated;
alter table public.vatly_cau_hoi_yeu_cau_giai enable row level security;
create policy "vatly_cau_hoi_yeu_cau_giai_member_all" on public.vatly_cau_hoi_yeu_cau_giai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_cau_hoi_yeu_cau_giai to anon;
grant SELECT on public.vatly_cau_hoi_yeu_cau_giai to anon;
grant UPDATE on public.vatly_cau_hoi_yeu_cau_giai to anon;
grant DELETE on public.vatly_cau_hoi_yeu_cau_giai to anon;
grant INSERT on public.vatly_cau_hoi_yeu_cau_giai to authenticated;
grant SELECT on public.vatly_cau_hoi_yeu_cau_giai to authenticated;
grant UPDATE on public.vatly_cau_hoi_yeu_cau_giai to authenticated;
grant DELETE on public.vatly_cau_hoi_yeu_cau_giai to authenticated;
alter table public.vatly_de_xuat enable row level security;
create policy "vatly_de_xuat_select" on public.vatly_de_xuat as permissive for select to authenticated using (true);
grant INSERT on public.vatly_de_xuat to anon;
grant SELECT on public.vatly_de_xuat to anon;
grant UPDATE on public.vatly_de_xuat to anon;
grant DELETE on public.vatly_de_xuat to anon;
grant INSERT on public.vatly_de_xuat to authenticated;
grant SELECT on public.vatly_de_xuat to authenticated;
grant UPDATE on public.vatly_de_xuat to authenticated;
grant DELETE on public.vatly_de_xuat to authenticated;
alter table public.vatly_de_xuat_cau enable row level security;
create policy "vatly_de_xuat_cau_select" on public.vatly_de_xuat_cau as permissive for select to authenticated using (true);
grant INSERT on public.vatly_de_xuat_cau to anon;
grant SELECT on public.vatly_de_xuat_cau to anon;
grant UPDATE on public.vatly_de_xuat_cau to anon;
grant DELETE on public.vatly_de_xuat_cau to anon;
grant INSERT on public.vatly_de_xuat_cau to authenticated;
grant SELECT on public.vatly_de_xuat_cau to authenticated;
grant UPDATE on public.vatly_de_xuat_cau to authenticated;
grant DELETE on public.vatly_de_xuat_cau to authenticated;
alter table public.vatly_de_xuat_quyet_dinh enable row level security;
create policy "vatly_de_xuat_quyet_dinh_select" on public.vatly_de_xuat_quyet_dinh as permissive for select to authenticated using (true);
grant INSERT on public.vatly_de_xuat_quyet_dinh to anon;
grant SELECT on public.vatly_de_xuat_quyet_dinh to anon;
grant UPDATE on public.vatly_de_xuat_quyet_dinh to anon;
grant DELETE on public.vatly_de_xuat_quyet_dinh to anon;
grant INSERT on public.vatly_de_xuat_quyet_dinh to authenticated;
grant SELECT on public.vatly_de_xuat_quyet_dinh to authenticated;
grant UPDATE on public.vatly_de_xuat_quyet_dinh to authenticated;
grant DELETE on public.vatly_de_xuat_quyet_dinh to authenticated;
alter table public.vatly_mcq_rule enable row level security;
create policy "vatly_mcq_rule_member_all" on public.vatly_mcq_rule as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_mcq_rule to anon;
grant SELECT on public.vatly_mcq_rule to anon;
grant UPDATE on public.vatly_mcq_rule to anon;
grant DELETE on public.vatly_mcq_rule to anon;
grant INSERT on public.vatly_mcq_rule to authenticated;
grant SELECT on public.vatly_mcq_rule to authenticated;
grant UPDATE on public.vatly_mcq_rule to authenticated;
grant DELETE on public.vatly_mcq_rule to authenticated;
alter table public.vatly_cau_form_tn enable row level security;
create policy "vatly_cau_form_tn_member_all" on public.vatly_cau_form_tn as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_cau_form_tn to anon;
grant SELECT on public.vatly_cau_form_tn to anon;
grant UPDATE on public.vatly_cau_form_tn to anon;
grant DELETE on public.vatly_cau_form_tn to anon;
grant INSERT on public.vatly_cau_form_tn to authenticated;
grant SELECT on public.vatly_cau_form_tn to authenticated;
grant UPDATE on public.vatly_cau_form_tn to authenticated;
grant DELETE on public.vatly_cau_form_tn to authenticated;
alter table public.vatly_bdm_chu_de enable row level security;
create policy "vatly_bdm_chu_de_member_all" on public.vatly_bdm_chu_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_chu_de to anon;
grant SELECT on public.vatly_bdm_chu_de to anon;
grant UPDATE on public.vatly_bdm_chu_de to anon;
grant DELETE on public.vatly_bdm_chu_de to anon;
grant INSERT on public.vatly_bdm_chu_de to authenticated;
grant SELECT on public.vatly_bdm_chu_de to authenticated;
grant UPDATE on public.vatly_bdm_chu_de to authenticated;
grant DELETE on public.vatly_bdm_chu_de to authenticated;
alter table public.vatly_bdm_chuyen_de enable row level security;
create policy "vatly_bdm_chuyen_de_member_all" on public.vatly_bdm_chuyen_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_chuyen_de to anon;
grant SELECT on public.vatly_bdm_chuyen_de to anon;
grant UPDATE on public.vatly_bdm_chuyen_de to anon;
grant DELETE on public.vatly_bdm_chuyen_de to anon;
grant INSERT on public.vatly_bdm_chuyen_de to authenticated;
grant SELECT on public.vatly_bdm_chuyen_de to authenticated;
grant UPDATE on public.vatly_bdm_chuyen_de to authenticated;
grant DELETE on public.vatly_bdm_chuyen_de to authenticated;
alter table public.vatly_bdm_o enable row level security;
create policy "vatly_bdm_o_member_all" on public.vatly_bdm_o as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_o to anon;
grant SELECT on public.vatly_bdm_o to anon;
grant UPDATE on public.vatly_bdm_o to anon;
grant DELETE on public.vatly_bdm_o to anon;
grant INSERT on public.vatly_bdm_o to authenticated;
grant SELECT on public.vatly_bdm_o to authenticated;
grant UPDATE on public.vatly_bdm_o to authenticated;
grant DELETE on public.vatly_bdm_o to authenticated;
alter table public.vatly_bdm_nhom enable row level security;
create policy "vatly_bdm_nhom_member_all" on public.vatly_bdm_nhom as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_nhom to anon;
grant SELECT on public.vatly_bdm_nhom to anon;
grant UPDATE on public.vatly_bdm_nhom to anon;
grant DELETE on public.vatly_bdm_nhom to anon;
grant INSERT on public.vatly_bdm_nhom to authenticated;
grant SELECT on public.vatly_bdm_nhom to authenticated;
grant UPDATE on public.vatly_bdm_nhom to authenticated;
grant DELETE on public.vatly_bdm_nhom to authenticated;
alter table public.vatly_bdm_dang_bai enable row level security;
create policy "vatly_bdm_dang_bai_member_all" on public.vatly_bdm_dang_bai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_dang_bai to anon;
grant SELECT on public.vatly_bdm_dang_bai to anon;
grant UPDATE on public.vatly_bdm_dang_bai to anon;
grant DELETE on public.vatly_bdm_dang_bai to anon;
grant INSERT on public.vatly_bdm_dang_bai to authenticated;
grant SELECT on public.vatly_bdm_dang_bai to authenticated;
grant UPDATE on public.vatly_bdm_dang_bai to authenticated;
grant DELETE on public.vatly_bdm_dang_bai to authenticated;
alter table public.vatly_bdm_nhom_tien_de enable row level security;
create policy "vatly_bdm_nhom_tien_de_member_all" on public.vatly_bdm_nhom_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_nhom_tien_de to anon;
grant SELECT on public.vatly_bdm_nhom_tien_de to anon;
grant UPDATE on public.vatly_bdm_nhom_tien_de to anon;
grant DELETE on public.vatly_bdm_nhom_tien_de to anon;
grant INSERT on public.vatly_bdm_nhom_tien_de to authenticated;
grant SELECT on public.vatly_bdm_nhom_tien_de to authenticated;
grant UPDATE on public.vatly_bdm_nhom_tien_de to authenticated;
grant DELETE on public.vatly_bdm_nhom_tien_de to authenticated;
alter table public.vatly_bdm_gan_cau enable row level security;
create policy "vatly_bdm_gan_cau_member_all" on public.vatly_bdm_gan_cau as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_gan_cau to anon;
grant SELECT on public.vatly_bdm_gan_cau to anon;
grant UPDATE on public.vatly_bdm_gan_cau to anon;
grant DELETE on public.vatly_bdm_gan_cau to anon;
grant INSERT on public.vatly_bdm_gan_cau to authenticated;
grant SELECT on public.vatly_bdm_gan_cau to authenticated;
grant UPDATE on public.vatly_bdm_gan_cau to authenticated;
grant DELETE on public.vatly_bdm_gan_cau to authenticated;
alter table public.vatly_bdm_log enable row level security;
create policy "vatly_bdm_log_member_read" on public.vatly_bdm_log as permissive for select to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_log to authenticated;
grant SELECT on public.vatly_bdm_log to authenticated;
grant UPDATE on public.vatly_bdm_log to authenticated;
grant DELETE on public.vatly_bdm_log to authenticated;
alter table public.vatly_bdm_de_xuat enable row level security;
create policy "vatly_bdm_de_xuat_member_all" on public.vatly_bdm_de_xuat as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_de_xuat to authenticated;
grant SELECT on public.vatly_bdm_de_xuat to authenticated;
grant UPDATE on public.vatly_bdm_de_xuat to authenticated;
grant DELETE on public.vatly_bdm_de_xuat to authenticated;
alter table public.vatly_bdm_cau_thieu_dang enable row level security;
create policy "vatly_bdm_cau_thieu_dang_member_all" on public.vatly_bdm_cau_thieu_dang as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_cau_thieu_dang to authenticated;
grant SELECT on public.vatly_bdm_cau_thieu_dang to authenticated;
grant UPDATE on public.vatly_bdm_cau_thieu_dang to authenticated;
grant DELETE on public.vatly_bdm_cau_thieu_dang to authenticated;
alter table public.vatly_bdm_kiem_mau enable row level security;
create policy "vatly_bdm_kiem_mau_member_all" on public.vatly_bdm_kiem_mau as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_kiem_mau to authenticated;
grant SELECT on public.vatly_bdm_kiem_mau to authenticated;
grant UPDATE on public.vatly_bdm_kiem_mau to authenticated;
grant DELETE on public.vatly_bdm_kiem_mau to authenticated;
alter table public.vatly_bdm_tu_choi enable row level security;
create policy "vatly_bdm_tu_choi_member_all" on public.vatly_bdm_tu_choi as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.vatly_bdm_tu_choi to authenticated;
grant SELECT on public.vatly_bdm_tu_choi to authenticated;
grant UPDATE on public.vatly_bdm_tu_choi to authenticated;
grant DELETE on public.vatly_bdm_tu_choi to authenticated;
grant SELECT on sequence public.vatly_bdm_chu_de_seq to anon;
grant USAGE on sequence public.vatly_bdm_chu_de_seq to anon;
grant SELECT on sequence public.vatly_bdm_chu_de_seq to authenticated;
grant USAGE on sequence public.vatly_bdm_chu_de_seq to authenticated;
grant SELECT on sequence public.vatly_bdm_chuyen_de_seq to anon;
grant USAGE on sequence public.vatly_bdm_chuyen_de_seq to anon;
grant SELECT on sequence public.vatly_bdm_chuyen_de_seq to authenticated;
grant USAGE on sequence public.vatly_bdm_chuyen_de_seq to authenticated;
grant SELECT on sequence public.vatly_bdm_dang_bai_seq to anon;
grant USAGE on sequence public.vatly_bdm_dang_bai_seq to anon;
grant SELECT on sequence public.vatly_bdm_dang_bai_seq to authenticated;
grant USAGE on sequence public.vatly_bdm_dang_bai_seq to authenticated;
grant SELECT on sequence public.vatly_bdm_log_id_seq to anon;
grant USAGE on sequence public.vatly_bdm_log_id_seq to anon;
grant SELECT on sequence public.vatly_bdm_log_id_seq to authenticated;
grant USAGE on sequence public.vatly_bdm_log_id_seq to authenticated;
grant SELECT on sequence public.vatly_bdm_nhom_seq to anon;
grant USAGE on sequence public.vatly_bdm_nhom_seq to anon;
grant SELECT on sequence public.vatly_bdm_nhom_seq to authenticated;
grant USAGE on sequence public.vatly_bdm_nhom_seq to authenticated;
grant SELECT on sequence public.vatly_bdm_tu_choi_id_seq to anon;
grant USAGE on sequence public.vatly_bdm_tu_choi_id_seq to anon;
grant SELECT on sequence public.vatly_bdm_tu_choi_id_seq to authenticated;
grant USAGE on sequence public.vatly_bdm_tu_choi_id_seq to authenticated;
grant SELECT on sequence public.vatly_cau_seq to anon;
grant USAGE on sequence public.vatly_cau_seq to anon;
grant SELECT on sequence public.vatly_cau_seq to authenticated;
grant USAGE on sequence public.vatly_cau_seq to authenticated;
grant SELECT on sequence public.vatly_cum_seq to anon;
grant USAGE on sequence public.vatly_cum_seq to anon;
grant SELECT on sequence public.vatly_cum_seq to authenticated;
grant USAGE on sequence public.vatly_cum_seq to authenticated;
grant SELECT on sequence public.vatly_dang_seq to anon;
grant USAGE on sequence public.vatly_dang_seq to anon;
grant SELECT on sequence public.vatly_dang_seq to authenticated;
grant USAGE on sequence public.vatly_dang_seq to authenticated;
CREATE OR REPLACE FUNCTION public.vatly_dang_tien_de_bao_dong(goc text)
 RETURNS TABLE(ma_dang text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.tien_de_ma_dang as id, 1 as do_sau, array[goc, t.tien_de_ma_dang] as duong
      from vatly_dang_tien_de t where t.ma_dang = goc
    union all
    select t.tien_de_ma_dang, d.do_sau + 1, d.duong || t.tien_de_ma_dang
      from vatly_dang_tien_de t join di d on t.ma_dang = d.id
     where not t.tien_de_ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.vatly_dang_tien_de_bao_dong(goc text) from public;
revoke all on function public.vatly_dang_tien_de_bao_dong(goc text) from anon;
grant execute on function public.vatly_dang_tien_de_bao_dong(goc text) to authenticated;
grant execute on function public.vatly_dang_tien_de_bao_dong(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.vatly_dang_hau_due(goc text)
 RETURNS TABLE(ma_dang text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from vatly_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from vatly_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.vatly_dang_hau_due(goc text) from public;
revoke all on function public.vatly_dang_hau_due(goc text) from anon;
grant execute on function public.vatly_dang_hau_due(goc text) to authenticated;
grant execute on function public.vatly_dang_hau_due(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.vatly_cum_tien_de_bao_dong(goc text)
 RETURNS TABLE(ma_cum text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.tien_de_ma_cum as id, 1 as do_sau, array[goc, t.tien_de_ma_cum] as duong
      from vatly_cum_tien_de t where t.ma_cum = goc
    union all
    select t.tien_de_ma_cum, d.do_sau + 1, d.duong || t.tien_de_ma_cum
      from vatly_cum_tien_de t join di d on t.ma_cum = d.id
     where not t.tien_de_ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.vatly_cum_tien_de_bao_dong(goc text) from public;
revoke all on function public.vatly_cum_tien_de_bao_dong(goc text) from anon;
grant execute on function public.vatly_cum_tien_de_bao_dong(goc text) to authenticated;
grant execute on function public.vatly_cum_tien_de_bao_dong(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.vatly_cum_hau_due(goc text)
 RETURNS TABLE(ma_cum text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from vatly_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from vatly_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.vatly_cum_hau_due(goc text) from public;
revoke all on function public.vatly_cum_hau_due(goc text) from anon;
grant execute on function public.vatly_cum_hau_due(goc text) to authenticated;
grant execute on function public.vatly_cum_hau_due(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_sinh_ma_dang(p_ma_chuyen_de text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare v_stt int; v_ma text;
begin
  if p_ma_chuyen_de !~ '^L[0-9]{6}$' or right(p_ma_chuyen_de, 4) = '0000' then
    raise exception 'fn_vatly_sinh_ma_dang: chuyên đề "%" không hợp lệ', p_ma_chuyen_de;
  end if;
  select coalesce(max(substring(ma_dang from 8 for 2)::int), 0) + 1 into v_stt
    from vatly_ban_do where ma_dang ~ ('^' || p_ma_chuyen_de || '[0-9]{2}$');
  if v_stt > 99 then raise exception 'fn_vatly_sinh_ma_dang: chuyên đề % đã đủ 99 dạng', p_ma_chuyen_de; end if;
  v_ma := p_ma_chuyen_de || lpad(v_stt::text, 2, '0');
  if exists (select 1 from vatly_ban_do where ma_dang = v_ma) then raise exception 'fn_vatly_sinh_ma_dang: mã "%" đã tồn tại', v_ma; end if;
  return v_ma;
end $function$
;
revoke all on function public.fn_vatly_sinh_ma_dang(p_ma_chuyen_de text) from public;
revoke all on function public.fn_vatly_sinh_ma_dang(p_ma_chuyen_de text) from anon;
CREATE OR REPLACE FUNCTION public.fn_vatly_de_xuat_ds(p_khoi text, p_chi_cho boolean DEFAULT true)
 RETURNS TABLE(id uuid, loai text, khoi text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text, ten text, mo_ta_ngan text, dang_gan_nhat text, ten_dang_gan_nhat text, ly_do text, lo text, nguon text, created_at timestamp with time zone, cau jsonb, quyet_dinh jsonb)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select d.id, d.loai, d.khoi, d.ma_chuyen_de,
         (select b.ten_chuyen_de from vatly_ban_do b where b.ma_chuyen_de = d.ma_chuyen_de limit 1),
         d.ma_dang, (select b.ten_dang from vatly_ban_do b where b.ma_dang = d.ma_dang),
         d.ten, d.mo_ta_ngan, d.dang_gan_nhat, (select b.ten_dang from vatly_ban_do b where b.ma_dang = d.dang_gan_nhat),
         d.ly_do, d.lo, d.nguon, d.created_at,
         coalesce((select jsonb_agg(jsonb_build_object(
                     'ma_cau', q.ma_cau, 'loai_cau', q.loai_cau, 'noi_dung', left(q.noi_dung, 700),
                     'dang_chinh', q.dang_chinh, 'da_duyet', q.da_duyet) order by q.ma_cau)
                     from vatly_de_xuat_cau c join vatly_cau_hoi q on q.ma_cau = c.ma_cau
                    where c.de_xuat_id = d.id), '[]'::jsonb),
         (select to_jsonb(x) from (select qd.hanh_dong, qd.ket_qua_ma_dang, qd.ket_qua_ma_cum, qd.tra_loi, qd.so_cau_doi, qd.quyet_at,
                                          (select ns.ho_ten from nhan_su ns where ns.id = qd.nguoi) nguoi_ten
                                     from vatly_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id) x)
    from vatly_de_xuat d
   where d.khoi = p_khoi
     and (not p_chi_cho or not exists (select 1 from vatly_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))
   order by d.lo, d.ma_chuyen_de, d.created_at
   limit 500
$function$
;
revoke all on function public.fn_vatly_de_xuat_ds(p_khoi text, p_chi_cho boolean) from public;
revoke all on function public.fn_vatly_de_xuat_ds(p_khoi text, p_chi_cho boolean) from anon;
grant execute on function public.fn_vatly_de_xuat_ds(p_khoi text, p_chi_cho boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang_dich text DEFAULT NULL::text, p_tra_loi text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d        vatly_de_xuat%rowtype;
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

  select * into d from vatly_de_xuat where id = p_id for update;
  if not found then raise exception 'Đề xuất không tồn tại'; end if;
  if exists (select 1 from vatly_de_xuat_quyet_dinh where de_xuat_id = p_id) then raise exception 'Đề xuất này đã được quyết rồi'; end if;

  if not ((d.loai = 'dang_moi' and v_hd in ('nhan', 'gop', 'bac'))
       or (d.loai = 'cum_moi'  and v_hd in ('nhan', 'bac'))
       or (d.loai = 'trao_doi' and v_hd = 'tra_loi')) then
    raise exception 'Hành động "%" không hợp lệ cho đề xuất loại "%"', v_hd, d.loai;
  end if;
  if v_hd in ('bac', 'tra_loi') and nullif(btrim(p_tra_loi), '') is null then
    raise exception 'Phải ghi lý do / câu trả lời — đây là thứ biến thành luật cho lô sau';
  end if;
  if v_hd = 'gop' and p_ma_dang_dich is null then raise exception 'Gộp thì phải chọn dạng đích'; end if;
  if p_ma_dang_dich is not null and not exists (select 1 from vatly_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'Dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;
  if p_ma_dang_dich is not null and public._kho_la_dang_cho(p_ma_dang_dich) then
    raise exception 'Không dời câu về dạng chờ';
  end if;

  select count(*) into v_bo_qua from vatly_de_xuat_cau c join vatly_cau_hoi q on q.ma_cau = c.ma_cau
   where c.de_xuat_id = p_id and q.da_duyet;

  if d.loai = 'dang_moi' and v_hd = 'nhan' then
    select * into m from vatly_ban_do where ma_chuyen_de = d.ma_chuyen_de and not public._kho_la_dang_cho(ma_dang) order by ma_dang limit 1;
    if not found then raise exception 'Chuyên đề "%" chưa có dạng nào để lấy tên chủ đề/chuyên đề', d.ma_chuyen_de; end if;
    v_ma := public.fn_vatly_sinh_ma_dang(d.ma_chuyen_de);
    insert into vatly_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
    values (v_ma, m.khoi, m.ma_chu_de, m.ten_chu_de, m.ma_chuyen_de, m.ten_chuyen_de,
            coalesce(nullif(btrim(p_ten), ''), d.ten), m.muc_do, m.bac_toi_thieu, coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan));
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten
       or coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan) is distinct from d.mo_ta_ngan then
      v_hd := 'nhan_co_sua';
    end if;
  elsif v_hd in ('gop', 'tra_loi') then
    v_ma := p_ma_dang_dich;          -- tra_loi không chỉ định dạng ⇒ null, không dời câu
  elsif d.loai = 'cum_moi' and v_hd = 'nhan' then
    insert into vatly_cum_bai (ma_dang, ten, thu_tu)
    values (d.ma_dang, coalesce(nullif(btrim(p_ten), ''), d.ten),
            coalesce((select max(thu_tu) from vatly_cum_bai where ma_dang = d.ma_dang), 0) + 1)
    returning ma_cum into v_cum;
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten then v_hd := 'nhan_co_sua'; end if;
    update vatly_cau_hoi q set ma_cum = v_cum
      from vatly_de_xuat_cau c where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and q.dang_chinh = d.ma_dang;
    get diagnostics v_n = row_count;
  end if;

  if v_ma is not null then
    update vatly_cau_hoi q set dang_chinh = v_ma, ma_cum = null
      from vatly_de_xuat_cau c
     where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and not q.da_duyet and q.dang_chinh is distinct from v_ma;
    get diagnostics v_n = row_count;
  end if;

  insert into vatly_de_xuat_quyet_dinh (de_xuat_id, hanh_dong, ket_qua_ma_dang, ket_qua_ma_cum, tra_loi, so_cau_doi, nguoi)
  values (p_id, v_hd, v_ma, v_cum, nullif(btrim(p_tra_loi), ''), v_n, v_nguoi);

  return jsonb_build_object('hanh_dong', v_hd, 'ket_qua_ma_dang', v_ma, 'ket_qua_ma_cum', v_cum,
                            'so_cau_doi', v_n, 'so_cau_da_duyet_bo_qua', case when v_ma is null then 0 else v_bo_qua end);
end $function$
;
revoke all on function public.fn_vatly_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) from public;
revoke all on function public.fn_vatly_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) from anon;
grant execute on function public.fn_vatly_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang text DEFAULT NULL::text, p_dang_gan_nhat text DEFAULT NULL::text)
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
  if not exists (select 1 from vatly_ban_do where ma_chuyen_de = p_ma_chuyen_de and khoi = p_khoi) then
    raise exception 'Chuyên đề "%" không thuộc khối %', p_ma_chuyen_de, p_khoi;
  end if;
  select string_agg(x, ', ') into v_thieu from unnest(p_ma_cau) x
   where not exists (select 1 from vatly_cau_hoi q where q.ma_cau = x and q.xoa_at is null);
  if v_thieu is not null then raise exception 'Câu không tồn tại: %', v_thieu; end if;

  insert into vatly_de_xuat (loai, khoi, ma_chuyen_de, ma_dang, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon)
  values (p_loai, p_khoi, p_ma_chuyen_de, p_ma_dang, nullif(btrim(p_ten), ''), nullif(btrim(p_mo_ta_ngan), ''),
          p_dang_gan_nhat, btrim(p_ly_do), btrim(p_lo), 'nguoi')
  returning id into v_id;
  insert into vatly_de_xuat_cau (de_xuat_id, ma_cau) select v_id, x from (select distinct unnest(p_ma_cau) x) t;
  return v_id;
end $function$
;
revoke all on function public.fn_vatly_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) from public;
revoke all on function public.fn_vatly_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) from anon;
grant execute on function public.fn_vatly_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_de_xuat_tk(p_khoi text)
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
    from vatly_de_xuat d left join vatly_de_xuat_quyet_dinh qd on qd.de_xuat_id = d.id
   where d.khoi = p_khoi
   group by d.lo, d.loai order by d.lo, d.loai
$function$
;
revoke all on function public.fn_vatly_de_xuat_tk(p_khoi text) from public;
revoke all on function public.fn_vatly_de_xuat_tk(p_khoi text) from anon;
grant execute on function public.fn_vatly_de_xuat_tk(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.vatly_cau_form_tn_kiem()
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
            and (e->>'rule' is null or not exists (select 1 from vatly_mcq_rule r where r.ma = e->>'rule'));
        if v_thieu is not null then raise exception 'phương án sai thiếu rule hoặc rule không tồn tại: %', v_thieu; end if;
        new.updated_at := now();
        return new;
      end $function$
;
revoke all on function public.vatly_cau_form_tn_kiem() from public;
revoke all on function public.vatly_cau_form_tn_kiem() from anon;
grant execute on function public.vatly_cau_form_tn_kiem() to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_bdm_thu_tu()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.thu_tu is not null then return new; end if;
  if tg_table_name = 'vatly_bdm_chu_de' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from vatly_bdm_chu_de where khoi = new.khoi;
  elsif tg_table_name = 'vatly_bdm_o' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from vatly_bdm_o where chu_de_id = new.chu_de_id;
  elsif tg_table_name = 'vatly_bdm_nhom' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from vatly_bdm_nhom where chu_de_id = new.chu_de_id and chuyen_de_id = new.chuyen_de_id;
  elsif tg_table_name = 'vatly_bdm_dang_bai' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from vatly_bdm_dang_bai where nhom_id = new.nhom_id;
  end if;
  return new;
end $function$
;
revoke all on function public._vatly_bdm_thu_tu() from public;
revoke all on function public._vatly_bdm_thu_tu() from anon;
CREATE OR REPLACE FUNCTION public._vatly_bdm_ghi_log()
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
  insert into vatly_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id', r ->> 'ma_cau', (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id'), (r ->> 'nhom_id') || '>' || (r ->> 'tien_de_nhom_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end, r_cu, r_moi);
  return null;
end $function$
;
revoke all on function public._vatly_bdm_ghi_log() from public;
revoke all on function public._vatly_bdm_ghi_log() from anon;
CREATE OR REPLACE FUNCTION public._vatly_bdm_bump_nhom()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  update vatly_bdm_nhom set updated_at = now()
   where id in (case when tg_op <> 'INSERT' then old.nhom_id end, case when tg_op <> 'DELETE' then new.nhom_id end);
  return null;
end $function$
;
revoke all on function public._vatly_bdm_bump_nhom() from public;
revoke all on function public._vatly_bdm_bump_nhom() from anon;
CREATE OR REPLACE FUNCTION public._vatly_bdm_tien_de_kiem()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare a vatly_bdm_nhom; b vatly_bdm_nhom;
begin
  select * into a from vatly_bdm_nhom where id = new.nhom_id;
  select * into b from vatly_bdm_nhom where id = new.tien_de_nhom_id;
  if (a.chu_de_id, a.chuyen_de_id) is distinct from (b.chu_de_id, b.chuyen_de_id) then
    raise exception 'Đợt này tiền đề chỉ nối các nhóm bài trong cùng một chuyên đề («%» và «%» khác chuyên đề)', a.ten, b.ten;
  end if;
  if exists (
    with recursive t(id) as (
      select tien_de_nhom_id from vatly_bdm_nhom_tien_de where nhom_id = new.tien_de_nhom_id
      union
      select e.tien_de_nhom_id from vatly_bdm_nhom_tien_de e join t on e.nhom_id = t.id
    ) select 1 from t where t.id = new.nhom_id
  ) then
    raise exception 'Tạo vòng tròn: «%» đang phải học sau «%»', b.ten, a.ten;
  end if;
  return new;
end $function$
;
revoke all on function public._vatly_bdm_tien_de_kiem() from public;
revoke all on function public._vatly_bdm_tien_de_kiem() from anon;
CREATE OR REPLACE FUNCTION public._vatly_bdm_tien_de_cung_o()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if exists (
    select 1 from vatly_bdm_nhom_tien_de e
      join vatly_bdm_nhom x on x.id = e.nhom_id
      join vatly_bdm_nhom y on y.id = e.tien_de_nhom_id
     where (e.nhom_id = new.id or e.tien_de_nhom_id = new.id)
       and (x.chu_de_id, x.chuyen_de_id) is distinct from (y.chu_de_id, y.chuyen_de_id)
  ) then
    raise exception 'Nhóm «%» còn mũi tên tiền đề nối với nhóm ở chuyên đề khác — gỡ mũi tên trước', new.ten;
  end if;
  return null;
end $function$
;
revoke all on function public._vatly_bdm_tien_de_cung_o() from public;
revoke all on function public._vatly_bdm_tien_de_cung_o() from anon;
CREATE OR REPLACE FUNCTION public._vatly_bdm_khoi_cua_nhom(p_nhom text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select cd.khoi from vatly_bdm_nhom n join vatly_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_nhom
$function$
;
revoke all on function public._vatly_bdm_khoi_cua_nhom(p_nhom text) from public;
revoke all on function public._vatly_bdm_khoi_cua_nhom(p_nhom text) from anon;
grant execute on function public._vatly_bdm_khoi_cua_nhom(p_nhom text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_cay(p_khoi text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dem_db as materialized (
    select g.dang_bai_id, count(*) n from vatly_bdm_gan_cau g join vatly_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null group by 1
  ),
  chua as materialized (   -- câu còn sống chưa phân, theo nhóm (dạng cũ = nhóm.ma_cu)
    select n.id nhom_id, n.chu_de_id, n.chuyen_de_id, count(*) n
      from vatly_cau_hoi q join vatly_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = q.ma_cau)
     group by 1, 2, 3
  ),
  so_cd as materialized (select o.chuyen_de_id, count(*) n from vatly_bdm_o o group by 1),
  td as materialized (select e.nhom_id, jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id) ds from vatly_bdm_nhom_tien_de e group by 1),
  cho as materialized (   -- câu ở dạng chờ / dạng cũ không còn nhóm (chưa khớp) của khối
    select count(*) n from vatly_cau_hoi q join vatly_ban_do b on b.ma_dang = q.dang_chinh
     where b.khoi = p_khoi and q.xoa_at is null and not exists (select 1 from vatly_bdm_nhom n where n.ma_cu = q.dang_chinh)
  )
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu, 'nhanh', 'vatly', 'so_ds', 0,
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from vatly_bdm_o o3 join vatly_bdm_chu_de c2 on c2.id = o3.chu_de_id
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
                'do_kho_tb', (select round(avg(x.muc_do)::numeric, 1) from vatly_bdm_dang_bai x where x.nhom_id = n.id and x.muc_do is not null),
                'so_co_muc', (select count(x.muc_do) from vatly_bdm_dang_bai x where x.nhom_id = n.id),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_ly_thuyet', (btrim(d.ly_thuyet) <> '' or d.ly_thuyet_file_url is not null),
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'muc_do', d.muc_do, 'bac_toi_thieu', d.bac_toi_thieu,
                    'so_cau', coalesce((select dd.n from dem_db dd where dd.dang_bai_id = d.id), 0),
                    'dang_cu', '[]'::jsonb
                  ) order by d.so)
                  from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) so from vatly_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
              ) order by n.so)
              from (select n0.*, row_number() over (order by n0.thu_tu, n0.id) so
                      from vatly_bdm_nhom n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
          ) order by o.so)
          from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) so from vatly_bdm_o o0 where o0.chu_de_id = cd.id) o
          join vatly_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
      ) order by cd.thu_tu, cd.id)
      from vatly_bdm_chu_de cd where cd.khoi = p_khoi), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb) from vatly_bdm_o o join vatly_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from vatly_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from vatly_bdm_chu_de group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object('dang_cu', 0, 'dang_cu_chua_gan', 0, 'cau_dang_cu_chua_gan', 0,
      'cau', (select count(*) from vatly_cau_hoi q join vatly_ban_do b on b.ma_dang = q.dang_chinh where b.khoi = p_khoi and q.xoa_at is null),
      'cau_chua_gan', (select coalesce(sum(x.n), 0) from chua x join vatly_bdm_chu_de cd on cd.id = x.chu_de_id where cd.khoi = p_khoi),
      'cau_chua_khop', (select n from cho))
  )
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public.fn_vatly_bdm_cay(p_khoi text, p_nhanh text) from public;
revoke all on function public.fn_vatly_bdm_cay(p_khoi text, p_nhanh text) from anon;
grant execute on function public.fn_vatly_bdm_cay(p_khoi text, p_nhanh text) to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_bdm_xoa_cac_nhom(p_nhom text[])
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v_db integer; v_cau integer; v_n integer;
begin
  select count(*) into v_cau from vatly_bdm_gan_cau g join vatly_bdm_dang_bai d on d.id = g.dang_bai_id where d.nhom_id = any (p_nhom);
  if v_cau > 0 then raise exception 'Bên trong có % câu đã được gán vào dạng bài — gỡ gán hoặc chuyển dạng bài đi trước rồi mới xoá', v_cau; end if;
  delete from vatly_bdm_nhom_tien_de where nhom_id = any (p_nhom) or tien_de_nhom_id = any (p_nhom);
  delete from vatly_bdm_dang_bai where nhom_id = any (p_nhom);
  get diagnostics v_db = row_count;
  delete from vatly_bdm_nhom where id = any (p_nhom);
  get diagnostics v_n = row_count;
  return jsonb_build_object('nhom', v_n, 'dang_bai', v_db);
end $function$
;
revoke all on function public._vatly_bdm_xoa_cac_nhom(p_nhom text[]) from public;
revoke all on function public._vatly_bdm_xoa_cac_nhom(p_nhom text[]) from anon;
grant execute on function public._vatly_bdm_xoa_cac_nhom(p_nhom text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_xoa_nhom(p_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
begin
  if not exists (select 1 from vatly_bdm_nhom where id = p_id) then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  return _vatly_bdm_xoa_cac_nhom(array[p_id]);
end $function$
;
revoke all on function public.fn_vatly_bdm_xoa_nhom(p_id text) from public;
revoke all on function public.fn_vatly_bdm_xoa_nhom(p_id text) from anon;
grant execute on function public.fn_vatly_bdm_xoa_nhom(p_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_xoa_o(p_chu_de text, p_chuyen_de text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v jsonb; v_xoa_cd boolean := false;
begin
  if not exists (select 1 from vatly_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de) then
    raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de, p_chu_de;
  end if;
  v := _vatly_bdm_xoa_cac_nhom(array(select id from vatly_bdm_nhom where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de));
  delete from vatly_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de;
  if not exists (select 1 from vatly_bdm_o where chuyen_de_id = p_chuyen_de) then delete from vatly_bdm_chuyen_de where id = p_chuyen_de; v_xoa_cd := true; end if;
  return v || jsonb_build_object('xoa_khoi_danh_muc', v_xoa_cd);
end $function$
;
revoke all on function public.fn_vatly_bdm_xoa_o(p_chu_de text, p_chuyen_de text) from public;
revoke all on function public.fn_vatly_bdm_xoa_o(p_chu_de text, p_chuyen_de text) from anon;
grant execute on function public.fn_vatly_bdm_xoa_o(p_chu_de text, p_chuyen_de text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_xoa_chu_de(p_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v jsonb; v_o integer; v_cds text[];
begin
  if not exists (select 1 from vatly_bdm_chu_de where id = p_id) then raise exception 'Không tìm thấy chủ đề %', p_id; end if;
  v := _vatly_bdm_xoa_cac_nhom(array(select id from vatly_bdm_nhom where chu_de_id = p_id));
  v_cds := array(select chuyen_de_id from vatly_bdm_o where chu_de_id = p_id);
  delete from vatly_bdm_o where chu_de_id = p_id;
  get diagnostics v_o = row_count;
  delete from vatly_bdm_chuyen_de ch where ch.id = any (v_cds) and not exists (select 1 from vatly_bdm_o o where o.chuyen_de_id = ch.id);
  delete from vatly_bdm_chu_de where id = p_id;
  return v || jsonb_build_object('chuyen_de', v_o);
end $function$
;
revoke all on function public.fn_vatly_bdm_xoa_chu_de(p_id text) from public;
revoke all on function public.fn_vatly_bdm_xoa_chu_de(p_id text) from anon;
grant execute on function public.fn_vatly_bdm_xoa_chu_de(p_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_sap_xep(p_loai text, p_ids text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if p_loai = 'chu_de' then
    update vatly_bdm_chu_de t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'o' then
    update vatly_bdm_o t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.chu_de_id || '|' || t.chuyen_de_id = x.id;
  elsif p_loai = 'nhom' then
    update vatly_bdm_nhom t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'dang_bai' then
    update vatly_bdm_dang_bai t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  else
    raise exception 'fn_vatly_bdm_sap_xep: loại "%" không hợp lệ', p_loai;
  end if;
end $function$
;
revoke all on function public.fn_vatly_bdm_sap_xep(p_loai text, p_ids text[]) from public;
revoke all on function public.fn_vatly_bdm_sap_xep(p_loai text, p_ids text[]) from anon;
grant execute on function public.fn_vatly_bdm_sap_xep(p_loai text, p_ids text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare n vatly_bdm_nhom; so_mui integer;
begin
  select * into n from vatly_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if (n.chu_de_id, n.chuyen_de_id) is distinct from (p_chu_de_id, p_chuyen_de_id) then
    select count(*) into so_mui from vatly_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
    if so_mui > 0 then raise exception 'Nhóm «%» còn % mũi tên tiền đề — gỡ mũi tên trước khi chuyển sang chuyên đề khác', n.ten, so_mui; end if;
  end if;
  update vatly_bdm_nhom set chu_de_id = p_chu_de_id, chuyen_de_id = p_chuyen_de_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from vatly_bdm_nhom where chu_de_id = p_chu_de_id and chuyen_de_id = p_chuyen_de_id and id <> p_id)
   where id = p_id;
  if p_thu_tu_dich is not null then perform fn_vatly_bdm_sap_xep('nhom', p_thu_tu_dich); end if;
end $function$
;
revoke all on function public.fn_vatly_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) from public;
revoke all on function public.fn_vatly_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) from anon;
grant execute on function public.fn_vatly_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  update vatly_bdm_dang_bai set nhom_id = p_nhom_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from vatly_bdm_dang_bai where nhom_id = p_nhom_id and id <> p_id)
   where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if p_thu_tu_dich is not null then perform fn_vatly_bdm_sap_xep('dang_bai', p_thu_tu_dich); end if;
end $function$
;
revoke all on function public.fn_vatly_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) from public;
revoke all on function public.fn_vatly_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) from anon;
grant execute on function public.fn_vatly_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if p_chu_de_cu = p_chu_de_moi then return; end if;
  if exists (select 1 from vatly_bdm_o where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id) then
    update vatly_bdm_nhom set chu_de_id = p_chu_de_moi,
           thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from vatly_bdm_nhom where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    delete from vatly_bdm_o where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
  else
    update vatly_bdm_o set chu_de_id = p_chu_de_moi, thu_tu = (select coalesce(max(thu_tu), 0) + 1 from vatly_bdm_o where chu_de_id = p_chu_de_moi)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    if not found then raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de_id, p_chu_de_cu; end if;
  end if;
end $function$
;
revoke all on function public.fn_vatly_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) from public;
revoke all on function public.fn_vatly_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) from anon;
grant execute on function public.fn_vatly_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_gop_chuyen_de(p_tu text, p_vao text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare r record;
begin
  if p_tu = p_vao then raise exception 'Không thể gộp chuyên đề vào chính nó'; end if;
  if not exists (select 1 from vatly_bdm_chuyen_de where id = p_vao) then raise exception 'Không tìm thấy chuyên đề đích %', p_vao; end if;
  for r in select chu_de_id from vatly_bdm_o where chuyen_de_id = p_tu loop
    if exists (select 1 from vatly_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao) then
      update vatly_bdm_nhom set chuyen_de_id = p_vao,
             thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from vatly_bdm_nhom where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao)
       where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
      delete from vatly_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
    else
      update vatly_bdm_o set chuyen_de_id = p_vao where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;   -- ON UPDATE CASCADE kéo nhóm theo
    end if;
  end loop;
  update vatly_bdm_chuyen_de v set mo_ta = t.mo_ta from vatly_bdm_chuyen_de t where v.id = p_vao and t.id = p_tu and btrim(v.mo_ta) = '';
  delete from vatly_bdm_chuyen_de where id = p_tu;
end $function$
;
revoke all on function public.fn_vatly_bdm_gop_chuyen_de(p_tu text, p_vao text) from public;
revoke all on function public.fn_vatly_bdm_gop_chuyen_de(p_tu text, p_vao text) from anon;
grant execute on function public.fn_vatly_bdm_gop_chuyen_de(p_tu text, p_vao text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare d vatly_bdm_dang_bai; v_nhom text; v_lt text;
begin
  select * into d from vatly_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if exists (select 1 from vatly_bdm_gan_cau where dang_bai_id = p_id) then
    raise exception 'Dạng bài «%» đang có câu được gán — chuyển hoặc gỡ gán trước rồi mới nâng', d.ten;
  end if;
  v_lt := case when btrim(d.vi_du) = '' then d.ly_thuyet when btrim(d.ly_thuyet) = '' then d.vi_du
               else d.ly_thuyet || chr(10) || chr(10) || '**Ví dụ**' || chr(10) || chr(10) || d.vi_du end;
  insert into vatly_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, v_lt, coalesce(d.ly_thuyet_file_url, d.vi_du_file_url), coalesce(d.ly_thuyet_ten_file, d.vi_du_ten_file))
  returning id into v_nhom;
  delete from vatly_bdm_dang_bai where id = p_id;
  return v_nhom;
end $function$
;
revoke all on function public.fn_vatly_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) from public;
revoke all on function public.fn_vatly_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) from anon;
grant execute on function public.fn_vatly_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_ha_nhom(p_id text, p_nhom_dich text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare n vatly_bdm_nhom; v_db text; v_tt integer;
begin
  if p_id = p_nhom_dich then raise exception 'Không thể hạ nhóm vào chính nó'; end if;
  select * into n from vatly_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if not exists (select 1 from vatly_bdm_nhom where id = p_nhom_dich) then raise exception 'Không tìm thấy nhóm đích %', p_nhom_dich; end if;
  if exists (select 1 from vatly_cau_hoi q where q.dang_chinh = n.ma_cu and q.xoa_at is null and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = q.ma_cau)) then
    raise exception 'Nhóm «%» còn câu chưa phân — xếp các câu đó vào dạng bài trước rồi mới hạ nhóm', n.ten;
  end if;
  select coalesce(max(thu_tu), 0) into v_tt from vatly_bdm_dang_bai where nhom_id = p_nhom_dich;
  insert into vatly_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file, v_tt + 1)
  returning id into v_db;
  update vatly_bdm_dang_bai d set nhom_id = p_nhom_dich, thu_tu = v_tt + 1 + x.i
    from (select c.id, row_number() over (order by c.thu_tu, c.id) i from vatly_bdm_dang_bai c where c.nhom_id = p_id) x
   where d.id = x.id;
  delete from vatly_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
  delete from vatly_bdm_nhom where id = p_id;
  return v_db;
end $function$
;
revoke all on function public.fn_vatly_bdm_ha_nhom(p_id text, p_nhom_dich text) from public;
revoke all on function public.fn_vatly_bdm_ha_nhom(p_id text, p_nhom_dich text) from anon;
grant execute on function public.fn_vatly_bdm_ha_nhom(p_id text, p_nhom_dich text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_dang_cu(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$ select '[]'::jsonb $function$
;
revoke all on function public.fn_vatly_bdm_dang_cu(p_khoi text) from public;
revoke all on function public.fn_vatly_bdm_dang_cu(p_khoi text) from anon;
grant execute on function public.fn_vatly_bdm_dang_cu(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_gan_cum(p_ma_cum text, p_dang_bai text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin raise exception 'Vật lý không còn cụm — cụm cũ đã thành dạng bài (bản đồ mới 29/10).'; end $function$
;
revoke all on function public.fn_vatly_bdm_gan_cum(p_ma_cum text, p_dang_bai text) from public;
revoke all on function public.fn_vatly_bdm_gan_cum(p_ma_cum text, p_dang_bai text) from anon;
grant execute on function public.fn_vatly_bdm_gan_cum(p_ma_cum text, p_dang_bai text) to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_khoi text; v_khoi_db text; v integer;
begin
  select b.khoi into v_khoi from vatly_cau_hoi c join vatly_ban_do b on b.ma_dang = c.dang_chinh where c.ma_cau = p_ma_cau and c.xoa_at is null;
  if v_khoi is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  select cd.khoi into v_khoi_db from vatly_bdm_dang_bai d join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  if v_khoi_db is null then raise exception 'Không tìm thấy dạng bài % ở bản đồ mới Vật lý', p_dang_bai; end if;
  if v_khoi_db <> v_khoi then raise exception 'Dạng bài % thuộc khối %, câu % thuộc khối %', p_dang_bai, v_khoi_db, p_ma_cau, v_khoi; end if;
  insert into vatly_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, p_dang_bai, p_nguon from vatly_cau_hoi c where c.xoa_at is null and (c.ma_cau = p_ma_cau or c.parent_ma_cau = p_ma_cau)
  on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon, actor = public.jwt_uid(), at = now()
   where (g.dang_bai_id, g.nguon) is distinct from (excluded.dang_bai_id, excluded.nguon);
  get diagnostics v = row_count;
  return v;
end $function$
;
revoke all on function public._vatly_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) from public;
revoke all on function public._vatly_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) from anon;
grant execute on function public._vatly_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text DEFAULT 'nguoi'::text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare m text; v integer := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nguon not in ('nguoi', 'ai') then raise exception 'p_nguon phải là nguoi hoặc ai'; end if;
  foreach m in array coalesce(p_ma_caus, '{}') loop v := v + _vatly_bdm_gan(m, p_dang_bai, p_nguon); end loop;
  return v;
end $function$
;
revoke all on function public.fn_vatly_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) from public;
revoke all on function public.fn_vatly_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) from anon;
grant execute on function public.fn_vatly_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean DEFAULT true)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v jsonb; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ca_ban_sao then v_n := _vatly_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  else
    perform 1 from vatly_bdm_dang_bai where id = p_dang_bai;
    if not found then raise exception 'Không tìm thấy dạng bài %', p_dang_bai; end if;
    insert into vatly_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    v_n := 1;
  end if;
  select jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'so_cau', v_n) into v
    from vatly_bdm_dang_bai d join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  return v;
end $function$
;
revoke all on function public.fn_vatly_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) from public;
revoke all on function public.fn_vatly_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) from anon;
grant execute on function public.fn_vatly_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean DEFAULT false)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update vatly_cau_hoi set xoa_at = now() where xoa_at is null and (ma_cau = p_ma_cau or (p_ca_ban_sao and parent_ma_cau = p_ma_cau));   -- kho rác
  get diagnostics v = row_count;
  if v = 0 then raise exception 'Không thấy câu % ở kho Vật lý (hoặc đã vào kho rác)', p_ma_cau; end if;
  return v;
end $function$
;
revoke all on function public.fn_vatly_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) from public;
revoke all on function public.fn_vatly_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) from anon;
grant execute on function public.fn_vatly_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer DEFAULT 200, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with cg as materialized (
    select q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau) goc
      from vatly_cau_hoi q join vatly_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null
       and ((p_nhom is not null and n.id = p_nhom) or (p_nhom is null and n.chu_de_id = p_chu_de and n.chuyen_de_id = p_chuyen_de))
       and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = q.ma_cau)
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
        from (select * from goc order by goc limit p_limit offset p_offset) g join vatly_cau_hoi c on c.ma_cau = g.goc), '[]'::jsonb)
  )
$function$
;
revoke all on function public.fn_vatly_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) from public;
revoke all on function public.fn_vatly_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) from anon;
grant execute on function public.fn_vatly_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_kho_cau(p_loai text, p_id text, p_loc text DEFAULT 'tat_ca'::text, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0)
 RETURNS TABLE(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ids text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_vatly_bdm_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai = 'dang_bai' then v_ids := array[p_id];
  elsif p_loai = 'nhom' then v_ids := array(select d.id from vatly_bdm_dang_bai d where d.nhom_id = p_id);
  else return;   -- Vật lý chưa có rổ chưa khớp / đề xuất / thiếu dạng / Đúng-Sai ở bản đồ mới
  end if;
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'gan_cau:' || g.nguon, g.dang_bai_id, db.ten, null::text
      from vatly_bdm_gan_cau g
      join vatly_cau_hoi c on c.ma_cau = g.ma_cau and c.xoa_at is null
      join vatly_bdm_dang_bai db on db.id = g.dang_bai_id
     where g.dang_bai_id = any (v_ids)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by db.thu_tu, coalesce(c.parent_ma_cau, c.ma_cau), (c.parent_ma_cau is not null), c.ma_cau
     limit p_limit offset p_offset;
end $function$
;
revoke all on function public.fn_vatly_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) from public;
revoke all on function public.fn_vatly_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) from anon;
grant execute on function public.fn_vatly_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_la_lan_do(p_ma_cau text, p_ma_dang_chep text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select case when p_ma_cau is not null and exists (select 1 from vatly_cau_hoi c where c.ma_cau = p_ma_cau) then true
              when p_ma_cau is not null and (exists (select 1 from dai_cau_hoi c where c.ma_cau = p_ma_cau)
                                          or exists (select 1 from hgt_cau_hoi c where c.ma_cau = p_ma_cau)) then false
              else exists (select 1 from vatly_ban_do b where b.ma_dang = p_ma_dang_chep) end
$function$
;
revoke all on function public._vatly_la_lan_do(p_ma_cau text, p_ma_dang_chep text) from public;
revoke all on function public._vatly_la_lan_do(p_ma_cau text, p_ma_dang_chep text) from anon;
grant execute on function public._vatly_la_lan_do(p_ma_cau text, p_ma_dang_chep text) to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_do_o_bdm(p_ma_cau text, p_ma_dang_chep text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare r record; v text;
begin
  if p_ma_cau is not null then
    select c.dang_chinh, c.xoa_at is not null as da_xoa, g.dang_bai_id into r
      from vatly_cau_hoi c left join vatly_bdm_gan_cau g on g.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      select min(g.dang_bai_id) into v
        from vatly_cau_hoi s join vatly_bdm_gan_cau g on g.ma_cau = s.ma_cau
       where s.dang_chinh = r.dang_chinh and s.xoa_at is null
      having count(distinct g.dang_bai_id) = 1;
      return v;
    end if;
  end if;
  select min(d.id) into v
    from vatly_bdm_nhom n join vatly_bdm_dang_bai d on d.nhom_id = n.id
   where n.ma_cu = p_ma_dang_chep
  having count(*) = 1;
  return v;
end $function$
;
revoke all on function public._vatly_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) from public;
revoke all on function public._vatly_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) from anon;
grant execute on function public._vatly_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_bdm_duyet_duoc(p_khoi text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce((select la_admin from my_quyen()), false) or public._truong_khoi_tro_len('Vật lý', p_khoi)
$function$
;
revoke all on function public._vatly_bdm_duyet_duoc(p_khoi text) from public;
revoke all on function public._vatly_bdm_duyet_duoc(p_khoi text) from anon;
grant execute on function public._vatly_bdm_duyet_duoc(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public._vatly_bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from vatly_bdm_de_xuat dx
      join vatly_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join vatly_bdm_dang_bai d on d.id = dx.dang_bai_id
      join vatly_bdm_nhom n on n.id = d.nhom_id
      join vatly_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, t.chu_de_id, t.ly_do, null::text
      from vatly_bdm_cau_thieu_dang t
      join vatly_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join vatly_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    -- chưa có dạng: câu gốc của khối, chưa gán / chưa đề xuất / chưa báo thiếu. Chủ đề gợi ý = nhóm bản đồ mới dựng từ dạng cũ (ma_cu).
    select q.ma_cau, null::text, (select min(n.chu_de_id) from vatly_bdm_nhom n where n.ma_cu = q.dang_chinh), ''::text, null::text
      from vatly_cau_hoi q
      join vatly_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from vatly_bdm_chu_de c2 where c2.khoi = p_khoi)
       and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from vatly_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from vatly_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from vatly_bdm_gan_cau g
      join vatly_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
      join vatly_bdm_dang_bai d on d.id = g.dang_bai_id
      join vatly_bdm_nhom n on n.id = d.nhom_id
      join vatly_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from vatly_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (như Toán)
  ) s
  where public._vatly_bdm_duyet_duoc(p_khoi)
  ) z
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public._vatly_bdm_khop_nguon(p_khoi text, p_hang text) from public;
revoke all on function public._vatly_bdm_khop_nguon(p_khoi text, p_hang text) from anon;
grant execute on function public._vatly_bdm_khop_nguon(p_khoi text, p_hang text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_khop_dem(p_khoi text, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select z.x from (
with s as materialized (select x.ma_cau, x.chu_de_id, h.hang from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h(hang)
                           cross join lateral public._vatly_bdm_khop_nguon(p_khoi, h.hang) x
                          where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
                            and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau))))
  select jsonb_build_object(
    'de_xuat', (select count(*) from s where hang = 'de_xuat'),
    'thieu',   (select count(*) from s where hang = 'thieu'),
    'trong',   (select count(*) from s where hang = 'trong'),
    'mau',     (select count(*) from s where hang = 'mau'),
    'kiem_n',   (select count(*) from vatly_bdm_kiem_mau k join vatly_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from vatly_bdm_kiem_mau k join vatly_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
  ) z(x)
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public.fn_vatly_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) from public;
revoke all on function public.fn_vatly_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) from anon;
grant execute on function public.fn_vatly_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from public._vatly_bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'vatly' and d.ma = x.ma_cau) ds on true
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
        'nhanh', 'vatly', 'nguon_tl', public._kho_nguon_cau(q.ma_cau)
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join vatly_cau_hoi q on q.ma_cau = pg.ma_cau
      left join vatly_ban_do b on b.ma_dang = q.dang_chinh
      left join vatly_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join vatly_bdm_nhom n on n.id = d.nhom_id
      left join vatly_bdm_chu_de cd on cd.id = n.chu_de_id
      left join vatly_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$
;
revoke all on function public.fn_vatly_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) from public;
revoke all on function public.fn_vatly_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) from anon;
grant execute on function public.fn_vatly_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text DEFAULT NULL::text)
 RETURNS TABLE(nguon text, so_cau bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select n, count(*) from public._vatly_bdm_khop_nguon(p_khoi, p_hang) s, unnest(public._kho_nguon_cau(s.ma_cau)) n
   where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de
   group by n order by n
$function$
;
revoke all on function public.fn_vatly_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) from public;
revoke all on function public.fn_vatly_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) from anon;
grant execute on function public.fn_vatly_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_khop_dich(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dang_bai', d.ten, 'mo_ta', d.mo_ta, 'nhom', n.ten, 'nhom_id', n.id,
    'chuyen_de', ch.ten, 'chuyen_de_id', ch.id, 'chu_de', cd.ten, 'chu_de_id', cd.id
  ) order by cd.thu_tu, ch.id, n.thu_tu, d.thu_tu), '[]'::jsonb)
  from vatly_bdm_chu_de cd
  join vatly_bdm_nhom n on n.chu_de_id = cd.id
  join vatly_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
  join vatly_bdm_dang_bai d on d.nhom_id = n.id
  where cd.khoi = p_khoi
$function$
;
revoke all on function public.fn_vatly_bdm_khop_dich(p_khoi text) from public;
revoke all on function public.fn_vatly_bdm_khop_dich(p_khoi text) from anon;
grant execute on function public.fn_vatly_bdm_khop_dich(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_vatly_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text DEFAULT NULL::text, p_ly_do text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v_khoi text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  select b.khoi into v_khoi from vatly_cau_hoi q join vatly_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;
  if not public._vatly_bdm_duyet_duoc(v_khoi) then raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn (Vật lý khối %)', p_ma_cau, v_khoi; end if;
  select g.dang_bai_id, g.nguon into v_ai, v_nguon from vatly_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from vatly_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  if p_dang_bai is not null then
    select cd.id into v_cd_dich from vatly_bdm_dang_bai d join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi;
    if v_cd_dich is null then raise exception 'Dạng bài % không tồn tại trong Vật lý khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    perform public._vatly_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
    delete from vatly_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from vatly_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    insert into vatly_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) values (p_ma_cau, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    delete from vatly_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from vatly_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into vatly_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into vatly_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    perform public._vatly_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from vatly_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into vatly_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into vatly_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from vatly_bdm_gan_cau where (ma_cau = p_ma_cau or ma_cau in (select c.ma_cau from vatly_cau_hoi c where c.parent_ma_cau = p_ma_cau)) and nguon = 'ai';
    end if;
    delete from vatly_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from vatly_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform public.fn_kho_tu_choi_cau('vatly', p_ma_cau, public.current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$
;
revoke all on function public.fn_vatly_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) from public;
revoke all on function public.fn_vatly_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) from anon;
grant execute on function public.fn_vatly_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) to authenticated;
CREATE CONSTRAINT TRIGGER trg_vatly_bdm_nhom_tien_de_cung_o AFTER UPDATE OF chu_de_id, chuyen_de_id ON public.vatly_bdm_nhom DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_tien_de_cung_o();
CREATE TRIGGER vatly_cau_form_tn_kiem BEFORE INSERT OR UPDATE ON public.vatly_cau_form_tn FOR EACH ROW EXECUTE FUNCTION vatly_cau_form_tn_kiem();
CREATE TRIGGER vatly_cau_hoi_yeu_cau_giai_claude_dong BEFORE UPDATE ON public.vatly_cau_hoi_yeu_cau_giai FOR EACH ROW EXECUTE FUNCTION fn_giaibai_tg_claude_dong();
CREATE TRIGGER trg_chan_duyet_dang_cho BEFORE INSERT OR UPDATE OF da_duyet, dang_chinh ON public.vatly_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_chan_duyet_dang_cho();
CREATE TRIGGER trg_de_thi_dien_dang AFTER UPDATE OF dang_chinh ON public.vatly_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_de_thi_dien_dang();
CREATE TRIGGER trg_kho_cau_duyet_nguon BEFORE INSERT OR UPDATE OF da_duyet, duyet_nguon ON public.vatly_cau_hoi FOR EACH ROW EXECUTE FUNCTION _kho_cau_duyet_nguon();
CREATE TRIGGER trg_vatly_ban_do_sync_ca_test_cau AFTER UPDATE OF ten_chuyen_de, muc_do ON public.vatly_ban_do FOR EACH ROW EXECUTE FUNCTION tg_ban_do_sync_ca_test_cau();
CREATE TRIGGER trg_vatly_ban_do_xoa_dong_bo_btyeu AFTER DELETE ON public.vatly_ban_do FOR EACH STATEMENT EXECUTE FUNCTION _trg_btyeu_dong_bo_dang_ban_do();
CREATE TRIGGER trg_vatly_bdm_chu_de_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_chu_de_thu_tu BEFORE INSERT ON public.vatly_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_thu_tu();
CREATE TRIGGER trg_vatly_bdm_chu_de_touch BEFORE UPDATE ON public.vatly_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_vatly_bdm_chuyen_de_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_chuyen_de FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_chuyen_de_touch BEFORE UPDATE ON public.vatly_bdm_chuyen_de FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_vatly_bdm_dang_bai_bump AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_bump_nhom();
CREATE TRIGGER trg_vatly_bdm_dang_bai_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_dang_bai_thu_tu BEFORE INSERT ON public.vatly_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_thu_tu();
CREATE TRIGGER trg_vatly_bdm_dang_bai_touch BEFORE UPDATE ON public.vatly_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_vatly_bdm_gan_cau_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_gan_cau FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_gan_cau_tu_duyet AFTER INSERT OR UPDATE OF nguon, dang_bai_id ON public.vatly_bdm_gan_cau FOR EACH ROW EXECUTE FUNCTION _bdm_tu_duyet_sau_gan();
CREATE TRIGGER trg_vatly_bdm_nhom_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_nhom_thu_tu BEFORE INSERT ON public.vatly_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_thu_tu();
CREATE TRIGGER trg_vatly_bdm_nhom_tien_de_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_nhom_tien_de FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_nhom_touch BEFORE UPDATE ON public.vatly_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_vatly_bdm_o_log AFTER INSERT OR DELETE OR UPDATE ON public.vatly_bdm_o FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_ghi_log();
CREATE TRIGGER trg_vatly_bdm_o_thu_tu BEFORE INSERT ON public.vatly_bdm_o FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_thu_tu();
CREATE TRIGGER trg_vatly_bdm_tien_de_kiem BEFORE INSERT OR UPDATE ON public.vatly_bdm_nhom_tien_de FOR EACH ROW EXECUTE FUNCTION _vatly_bdm_tien_de_kiem();
CREATE TRIGGER trg_log_doi_dang AFTER UPDATE OF dang_chinh ON public.vatly_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_log_doi_dang('vatly', 'cau');
CREATE TRIGGER trg_log_kho_cau_vatly AFTER DELETE OR UPDATE ON public.vatly_cau_hoi FOR EACH ROW EXECUTE FUNCTION log_kho_cau();
CREATE TRIGGER trg_log_kho_sua AFTER UPDATE OF noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ma_cum ON public.vatly_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_log_kho_sua('vatly');
insert into public.vatly_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
select 'L' || k || '000000', k, 'L' || k || '00', 'Chưa phân dạng', 'L' || k || '0000', 'Chưa phân dạng', 'Chưa phân dạng', 1, 'C',
       'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).'
  from unnest(array['10', '11', '12']) k;   -- dạng chờ, như K07..K09 của KHTN

-- ════ (A) MÔN HÓA HỌC — bảng hoahoc_*, mã Q… ════
create sequence public.hoahoc_bdm_chu_de_seq as bigint;
create sequence public.hoahoc_bdm_chuyen_de_seq as bigint;
create sequence public.hoahoc_bdm_dang_bai_seq as bigint;
create sequence public.hoahoc_bdm_log_id_seq as bigint;
create sequence public.hoahoc_bdm_nhom_seq as bigint;
create sequence public.hoahoc_bdm_tu_choi_id_seq as bigint;
create sequence public.hoahoc_cau_seq as bigint;
create sequence public.hoahoc_cum_seq as bigint;
create sequence public.hoahoc_dang_seq as bigint;
create table public.hoahoc_ban_do (like public.khtn_ban_do including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_ban_do alter column ma_dang set default ('QG'::text || lpad((nextval('hoahoc_dang_seq'::regclass))::text, 5, '0'::text));
create table public.hoahoc_cau_hoi (like public.khtn_cau_hoi including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_cau_hoi alter column ma_cau set default ('QC'::text || lpad((nextval('hoahoc_cau_seq'::regclass))::text, 6, '0'::text));
create table public.hoahoc_dang_ly_thuyet (like public.khtn_dang_ly_thuyet including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_chuyen_de_ly_thuyet (like public.khtn_chuyen_de_ly_thuyet including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_cum_bai (like public.khtn_cum_bai including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_cum_bai alter column ma_cum set default ('QCUM'::text || lpad((nextval('hoahoc_cum_seq'::regclass))::text, 5, '0'::text));
create table public.hoahoc_dang_tien_de (like public.khtn_dang_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_cum_tien_de (like public.khtn_cum_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_cau_hoi_yeu_cau_giai (like public.khtn_cau_hoi_yeu_cau_giai including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_de_xuat (like public.khtn_de_xuat including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_de_xuat_cau (like public.khtn_de_xuat_cau including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_de_xuat_quyet_dinh (like public.khtn_de_xuat_quyet_dinh including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_mcq_rule (like public.khtn_mcq_rule including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_cau_form_tn (like public.khtn_cau_form_tn including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_chu_de (like public.khtn_bdm_chu_de including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_bdm_chu_de alter column id set default ('QCD'::text || lpad((nextval('hoahoc_bdm_chu_de_seq'::regclass))::text, 5, '0'::text));
create table public.hoahoc_bdm_chuyen_de (like public.khtn_bdm_chuyen_de including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_bdm_chuyen_de alter column id set default ('QCH'::text || lpad((nextval('hoahoc_bdm_chuyen_de_seq'::regclass))::text, 5, '0'::text));
create table public.hoahoc_bdm_o (like public.khtn_bdm_o including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_nhom (like public.khtn_bdm_nhom including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_bdm_nhom alter column id set default ('QNB'::text || lpad((nextval('hoahoc_bdm_nhom_seq'::regclass))::text, 5, '0'::text));
create table public.hoahoc_bdm_dang_bai (like public.khtn_bdm_dang_bai including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_bdm_dang_bai alter column id set default ('QDB'::text || lpad((nextval('hoahoc_bdm_dang_bai_seq'::regclass))::text, 5, '0'::text));
create table public.hoahoc_bdm_nhom_tien_de (like public.khtn_bdm_nhom_tien_de including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_gan_cau (like public.khtn_bdm_gan_cau including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_log (like public.khtn_bdm_log including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_de_xuat (like public.khtn_bdm_de_xuat including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_cau_thieu_dang (like public.khtn_bdm_cau_thieu_dang including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_kiem_mau (like public.khtn_bdm_kiem_mau including defaults including identity including generated including indexes including comments including storage);
create table public.hoahoc_bdm_tu_choi (like public.khtn_bdm_tu_choi including defaults including identity including generated including indexes including comments including storage);
alter table public.hoahoc_bdm_cau_thieu_dang add constraint hoahoc_bdm_cau_thieu_dang_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.hoahoc_bdm_chu_de add constraint hoahoc_bdm_chu_de_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.hoahoc_bdm_chuyen_de add constraint hoahoc_bdm_chuyen_de_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.hoahoc_bdm_dang_bai add constraint hoahoc_bdm_dang_bai_bac_toi_thieu_check CHECK ((bac_toi_thieu = ANY (ARRAY['S'::text, 'A'::text, 'B'::text, 'C'::text, 'D'::text])));
alter table public.hoahoc_bdm_dang_bai add constraint hoahoc_bdm_dang_bai_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.hoahoc_bdm_de_xuat add constraint hoahoc_bdm_de_xuat_chac_check CHECK ((chac = ANY (ARRAY['cao'::text, 'vua'::text])));
alter table public.hoahoc_bdm_de_xuat add constraint hoahoc_bdm_de_xuat_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.hoahoc_bdm_gan_cau add constraint hoahoc_bdm_gan_cau_nguon_check CHECK ((nguon = ANY (ARRAY['nguoi'::text, 'ai'::text, 'cum'::text])));
alter table public.hoahoc_bdm_kiem_mau add constraint hoahoc_bdm_kiem_mau_ket_qua_check CHECK ((ket_qua = ANY (ARRAY['giu'::text, 'doi'::text])));
alter table public.hoahoc_bdm_log add constraint hoahoc_bdm_log_hanh_dong_check CHECK ((hanh_dong = ANY (ARRAY['them'::text, 'sua'::text, 'xoa'::text])));
alter table public.hoahoc_bdm_nhom add constraint hoahoc_bdm_nhom_ten_check CHECK ((btrim(ten) <> ''::text));
alter table public.hoahoc_bdm_nhom_tien_de add constraint hoahoc_bdm_nhom_tien_de_check CHECK ((nhom_id <> tien_de_nhom_id));
alter table public.hoahoc_cau_form_tn add constraint hoahoc_cau_form_tn_dap_an_check CHECK ((dap_an = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text])));
alter table public.hoahoc_cau_form_tn add constraint hoahoc_cau_form_tn_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_duyet_nguon_check CHECK ((duyet_nguon = ANY (ARRAY['nguoi'::text, 'may'::text, 'ai'::text])));
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_kiem_may_boi_check CHECK ((kiem_may_boi = ANY (ARRAY['mcq-auto'::text, 'claude_code'::text, 'nguoi'::text])));
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_kiem_may_check CHECK ((kiem_may = ANY (ARRAY['khop'::text, 'nghi'::text, 'khong_kiem_duoc'::text])));
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_muc_cau_check CHECK (((muc_cau >= 1) AND (muc_cau <= 5)));
alter table public.hoahoc_cau_hoi_yeu_cau_giai add constraint hoahoc_cau_hoi_yeu_cau_giai_che_do_check CHECK ((che_do = ANY (ARRAY['giai'::text, 'hoan_thien'::text])));
alter table public.hoahoc_cau_hoi_yeu_cau_giai add constraint hoahoc_cau_hoi_yeu_cau_giai_trang_thai_chk CHECK (((trang_thai = ANY (ARRAY['cho_claude'::text, 'da_xong'::text, 'dang_giai'::text, 'cho_duyet'::text, 'can_sua'::text, 'da_duyet'::text, 'da_tra'::text, 'qua_han'::text, 'tu_choi_3'::text])) AND ((nguoi_giai IS NULL) = (trang_thai = ANY (ARRAY['cho_claude'::text, 'da_xong'::text])))));
alter table public.hoahoc_cum_tien_de add constraint hoahoc_cum_tien_de_check CHECK ((ma_cum <> tien_de_ma_cum));
alter table public.hoahoc_dang_tien_de add constraint hoahoc_dang_tien_de_check CHECK ((ma_dang <> tien_de_ma_dang));
alter table public.hoahoc_de_xuat add constraint hoahoc_de_xuat_hinh_dang CHECK ((((loai = 'dang_moi'::text) AND (ten IS NOT NULL) AND (mo_ta_ngan IS NOT NULL) AND (ma_dang IS NULL)) OR ((loai = 'cum_moi'::text) AND (ten IS NOT NULL) AND (ma_dang IS NOT NULL)) OR ((loai = 'trao_doi'::text) AND (ten IS NULL))));
alter table public.hoahoc_de_xuat add constraint hoahoc_de_xuat_loai_check CHECK ((loai = ANY (ARRAY['dang_moi'::text, 'cum_moi'::text, 'trao_doi'::text])));
alter table public.hoahoc_de_xuat add constraint hoahoc_de_xuat_nguon_check CHECK ((nguon = ANY (ARRAY['ai'::text, 'nguoi'::text])));
alter table public.hoahoc_de_xuat_quyet_dinh add constraint hoahoc_de_xuat_qd_tra_loi CHECK (((hanh_dong <> ALL (ARRAY['bac'::text, 'tra_loi'::text])) OR (NULLIF(btrim(tra_loi), ''::text) IS NOT NULL)));
alter table public.hoahoc_de_xuat_quyet_dinh add constraint hoahoc_de_xuat_quyet_dinh_hanh_dong_check CHECK ((hanh_dong = ANY (ARRAY['nhan'::text, 'nhan_co_sua'::text, 'gop'::text, 'bac'::text, 'tra_loi'::text])));
alter table public.hoahoc_mcq_rule add constraint hoahoc_mcq_rule_nhom_check CHECK ((nhom = ANY (ARRAY['khai_niem'::text, 'tinh'::text])));
alter table public.hoahoc_ban_do add constraint hoahoc_ban_do_bac_toi_thieu_fkey FOREIGN KEY (bac_toi_thieu) REFERENCES lop_bac(ma);
alter table public.hoahoc_bdm_cau_thieu_dang add constraint hoahoc_bdm_cau_thieu_dang_chu_de_id_fkey FOREIGN KEY (chu_de_id) REFERENCES hoahoc_bdm_chu_de(id);
alter table public.hoahoc_bdm_cau_thieu_dang add constraint hoahoc_bdm_cau_thieu_dang_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau);
alter table public.hoahoc_bdm_dang_bai add constraint hoahoc_bdm_dang_bai_nhom_id_fkey FOREIGN KEY (nhom_id) REFERENCES hoahoc_bdm_nhom(id);
alter table public.hoahoc_bdm_de_xuat add constraint hoahoc_bdm_de_xuat_dang_bai_id_fkey FOREIGN KEY (dang_bai_id) REFERENCES hoahoc_bdm_dang_bai(id);
alter table public.hoahoc_bdm_de_xuat add constraint hoahoc_bdm_de_xuat_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau);
alter table public.hoahoc_bdm_gan_cau add constraint hoahoc_bdm_gan_cau_dang_bai_id_fkey FOREIGN KEY (dang_bai_id) REFERENCES hoahoc_bdm_dang_bai(id);
alter table public.hoahoc_bdm_gan_cau add constraint hoahoc_bdm_gan_cau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau);
alter table public.hoahoc_bdm_kiem_mau add constraint hoahoc_bdm_kiem_mau_dang_bai_ai_id_fkey FOREIGN KEY (dang_bai_ai_id) REFERENCES hoahoc_bdm_dang_bai(id);
alter table public.hoahoc_bdm_kiem_mau add constraint hoahoc_bdm_kiem_mau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau);
alter table public.hoahoc_bdm_nhom add constraint hoahoc_bdm_nhom_chu_de_id_chuyen_de_id_fkey FOREIGN KEY (chu_de_id, chuyen_de_id) REFERENCES hoahoc_bdm_o(chu_de_id, chuyen_de_id) ON UPDATE CASCADE;
alter table public.hoahoc_bdm_nhom_tien_de add constraint hoahoc_bdm_nhom_tien_de_nhom_id_fkey FOREIGN KEY (nhom_id) REFERENCES hoahoc_bdm_nhom(id);
alter table public.hoahoc_bdm_nhom_tien_de add constraint hoahoc_bdm_nhom_tien_de_tien_de_nhom_id_fkey FOREIGN KEY (tien_de_nhom_id) REFERENCES hoahoc_bdm_nhom(id);
alter table public.hoahoc_bdm_o add constraint hoahoc_bdm_o_chu_de_id_fkey FOREIGN KEY (chu_de_id) REFERENCES hoahoc_bdm_chu_de(id);
alter table public.hoahoc_bdm_o add constraint hoahoc_bdm_o_chuyen_de_id_fkey FOREIGN KEY (chuyen_de_id) REFERENCES hoahoc_bdm_chuyen_de(id);
alter table public.hoahoc_cau_form_tn add constraint hoahoc_cau_form_tn_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id);
alter table public.hoahoc_cau_form_tn add constraint hoahoc_cau_form_tn_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau);
alter table public.hoahoc_cau_form_tn add constraint hoahoc_cau_form_tn_tu_choi_boi_fkey FOREIGN KEY (tu_choi_boi) REFERENCES nhan_su(id);
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_dang_chinh_fkey FOREIGN KEY (dang_chinh) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE RESTRICT;
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id);
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_kiem_may_lo_fkey FOREIGN KEY (kiem_may_lo) REFERENCES kho_kiem_lo(id);
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_ma_cum_fkey FOREIGN KEY (ma_cum) REFERENCES hoahoc_cum_bai(ma_cum) ON DELETE SET NULL;
alter table public.hoahoc_cau_hoi add constraint hoahoc_cau_hoi_parent_ma_cau_fkey FOREIGN KEY (parent_ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau) ON UPDATE CASCADE;
alter table public.hoahoc_cau_hoi_yeu_cau_giai add constraint hoahoc_cau_hoi_yeu_cau_giai_duyet_boi_fkey FOREIGN KEY (duyet_boi) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.hoahoc_cau_hoi_yeu_cau_giai add constraint hoahoc_cau_hoi_yeu_cau_giai_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau) ON DELETE CASCADE;
alter table public.hoahoc_cau_hoi_yeu_cau_giai add constraint hoahoc_cau_hoi_yeu_cau_giai_nguoi_giai_fkey FOREIGN KEY (nguoi_giai) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.hoahoc_cau_hoi_yeu_cau_giai add constraint hoahoc_cau_hoi_yeu_cau_giai_nguoi_yeu_cau_fkey FOREIGN KEY (nguoi_yeu_cau) REFERENCES nhan_su(id) ON DELETE SET NULL;
alter table public.hoahoc_cum_bai add constraint hoahoc_cum_bai_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.hoahoc_cum_tien_de add constraint hoahoc_cum_tien_de_ma_cum_fkey FOREIGN KEY (ma_cum) REFERENCES hoahoc_cum_bai(ma_cum) ON DELETE CASCADE;
alter table public.hoahoc_cum_tien_de add constraint hoahoc_cum_tien_de_tien_de_ma_cum_fkey FOREIGN KEY (tien_de_ma_cum) REFERENCES hoahoc_cum_bai(ma_cum) ON DELETE CASCADE;
alter table public.hoahoc_dang_ly_thuyet add constraint hoahoc_dang_ly_thuyet_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.hoahoc_dang_tien_de add constraint hoahoc_dang_tien_de_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.hoahoc_dang_tien_de add constraint hoahoc_dang_tien_de_tien_de_ma_dang_fkey FOREIGN KEY (tien_de_ma_dang) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.hoahoc_de_xuat add constraint hoahoc_de_xuat_dang_gan_nhat_fkey FOREIGN KEY (dang_gan_nhat) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.hoahoc_de_xuat add constraint hoahoc_de_xuat_ma_dang_fkey FOREIGN KEY (ma_dang) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE CASCADE;
alter table public.hoahoc_de_xuat_cau add constraint hoahoc_de_xuat_cau_de_xuat_id_fkey FOREIGN KEY (de_xuat_id) REFERENCES hoahoc_de_xuat(id) ON DELETE CASCADE;
alter table public.hoahoc_de_xuat_cau add constraint hoahoc_de_xuat_cau_ma_cau_fkey FOREIGN KEY (ma_cau) REFERENCES hoahoc_cau_hoi(ma_cau) ON UPDATE CASCADE;
alter table public.hoahoc_de_xuat_quyet_dinh add constraint hoahoc_de_xuat_quyet_dinh_de_xuat_id_fkey FOREIGN KEY (de_xuat_id) REFERENCES hoahoc_de_xuat(id) ON DELETE CASCADE;
alter table public.hoahoc_de_xuat_quyet_dinh add constraint hoahoc_de_xuat_quyet_dinh_ket_qua_ma_cum_fkey FOREIGN KEY (ket_qua_ma_cum) REFERENCES hoahoc_cum_bai(ma_cum) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.hoahoc_de_xuat_quyet_dinh add constraint hoahoc_de_xuat_quyet_dinh_ket_qua_ma_dang_fkey FOREIGN KEY (ket_qua_ma_dang) REFERENCES hoahoc_ban_do(ma_dang) ON UPDATE CASCADE ON DELETE SET NULL;
alter table public.hoahoc_de_xuat_quyet_dinh add constraint hoahoc_de_xuat_quyet_dinh_nguoi_fkey FOREIGN KEY (nguoi) REFERENCES nhan_su(id);
alter table public.hoahoc_ban_do enable row level security;
create policy "hoahoc_ban_do_member_all" on public.hoahoc_ban_do as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_ban_do to anon;
grant SELECT on public.hoahoc_ban_do to anon;
grant UPDATE on public.hoahoc_ban_do to anon;
grant DELETE on public.hoahoc_ban_do to anon;
grant INSERT on public.hoahoc_ban_do to authenticated;
grant SELECT on public.hoahoc_ban_do to authenticated;
grant UPDATE on public.hoahoc_ban_do to authenticated;
grant DELETE on public.hoahoc_ban_do to authenticated;
alter table public.hoahoc_cau_hoi enable row level security;
create policy "hoahoc_cau_hoi_member_all" on public.hoahoc_cau_hoi as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_cau_hoi to anon;
grant SELECT on public.hoahoc_cau_hoi to anon;
grant UPDATE on public.hoahoc_cau_hoi to anon;
grant DELETE on public.hoahoc_cau_hoi to anon;
grant INSERT on public.hoahoc_cau_hoi to authenticated;
grant SELECT on public.hoahoc_cau_hoi to authenticated;
grant UPDATE on public.hoahoc_cau_hoi to authenticated;
grant DELETE on public.hoahoc_cau_hoi to authenticated;
alter table public.hoahoc_dang_ly_thuyet enable row level security;
create policy "hoahoc_dang_ly_thuyet_member_all" on public.hoahoc_dang_ly_thuyet as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_dang_ly_thuyet to anon;
grant SELECT on public.hoahoc_dang_ly_thuyet to anon;
grant UPDATE on public.hoahoc_dang_ly_thuyet to anon;
grant DELETE on public.hoahoc_dang_ly_thuyet to anon;
grant INSERT on public.hoahoc_dang_ly_thuyet to authenticated;
grant SELECT on public.hoahoc_dang_ly_thuyet to authenticated;
grant UPDATE on public.hoahoc_dang_ly_thuyet to authenticated;
grant DELETE on public.hoahoc_dang_ly_thuyet to authenticated;
alter table public.hoahoc_chuyen_de_ly_thuyet enable row level security;
create policy "hoahoc_chuyen_de_ly_thuyet_member_all" on public.hoahoc_chuyen_de_ly_thuyet as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_chuyen_de_ly_thuyet to anon;
grant SELECT on public.hoahoc_chuyen_de_ly_thuyet to anon;
grant UPDATE on public.hoahoc_chuyen_de_ly_thuyet to anon;
grant DELETE on public.hoahoc_chuyen_de_ly_thuyet to anon;
grant INSERT on public.hoahoc_chuyen_de_ly_thuyet to authenticated;
grant SELECT on public.hoahoc_chuyen_de_ly_thuyet to authenticated;
grant UPDATE on public.hoahoc_chuyen_de_ly_thuyet to authenticated;
grant DELETE on public.hoahoc_chuyen_de_ly_thuyet to authenticated;
alter table public.hoahoc_cum_bai enable row level security;
create policy "hoahoc_cum_bai_member_all" on public.hoahoc_cum_bai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_cum_bai to anon;
grant SELECT on public.hoahoc_cum_bai to anon;
grant UPDATE on public.hoahoc_cum_bai to anon;
grant DELETE on public.hoahoc_cum_bai to anon;
grant INSERT on public.hoahoc_cum_bai to authenticated;
grant SELECT on public.hoahoc_cum_bai to authenticated;
grant UPDATE on public.hoahoc_cum_bai to authenticated;
grant DELETE on public.hoahoc_cum_bai to authenticated;
alter table public.hoahoc_dang_tien_de enable row level security;
create policy "hoahoc_dang_tien_de_member_all" on public.hoahoc_dang_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_dang_tien_de to anon;
grant SELECT on public.hoahoc_dang_tien_de to anon;
grant UPDATE on public.hoahoc_dang_tien_de to anon;
grant DELETE on public.hoahoc_dang_tien_de to anon;
grant INSERT on public.hoahoc_dang_tien_de to authenticated;
grant SELECT on public.hoahoc_dang_tien_de to authenticated;
grant UPDATE on public.hoahoc_dang_tien_de to authenticated;
grant DELETE on public.hoahoc_dang_tien_de to authenticated;
alter table public.hoahoc_cum_tien_de enable row level security;
create policy "hoahoc_cum_tien_de_member_all" on public.hoahoc_cum_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_cum_tien_de to anon;
grant SELECT on public.hoahoc_cum_tien_de to anon;
grant UPDATE on public.hoahoc_cum_tien_de to anon;
grant DELETE on public.hoahoc_cum_tien_de to anon;
grant INSERT on public.hoahoc_cum_tien_de to authenticated;
grant SELECT on public.hoahoc_cum_tien_de to authenticated;
grant UPDATE on public.hoahoc_cum_tien_de to authenticated;
grant DELETE on public.hoahoc_cum_tien_de to authenticated;
alter table public.hoahoc_cau_hoi_yeu_cau_giai enable row level security;
create policy "hoahoc_cau_hoi_yeu_cau_giai_member_all" on public.hoahoc_cau_hoi_yeu_cau_giai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_cau_hoi_yeu_cau_giai to anon;
grant SELECT on public.hoahoc_cau_hoi_yeu_cau_giai to anon;
grant UPDATE on public.hoahoc_cau_hoi_yeu_cau_giai to anon;
grant DELETE on public.hoahoc_cau_hoi_yeu_cau_giai to anon;
grant INSERT on public.hoahoc_cau_hoi_yeu_cau_giai to authenticated;
grant SELECT on public.hoahoc_cau_hoi_yeu_cau_giai to authenticated;
grant UPDATE on public.hoahoc_cau_hoi_yeu_cau_giai to authenticated;
grant DELETE on public.hoahoc_cau_hoi_yeu_cau_giai to authenticated;
alter table public.hoahoc_de_xuat enable row level security;
create policy "hoahoc_de_xuat_select" on public.hoahoc_de_xuat as permissive for select to authenticated using (true);
grant INSERT on public.hoahoc_de_xuat to anon;
grant SELECT on public.hoahoc_de_xuat to anon;
grant UPDATE on public.hoahoc_de_xuat to anon;
grant DELETE on public.hoahoc_de_xuat to anon;
grant INSERT on public.hoahoc_de_xuat to authenticated;
grant SELECT on public.hoahoc_de_xuat to authenticated;
grant UPDATE on public.hoahoc_de_xuat to authenticated;
grant DELETE on public.hoahoc_de_xuat to authenticated;
alter table public.hoahoc_de_xuat_cau enable row level security;
create policy "hoahoc_de_xuat_cau_select" on public.hoahoc_de_xuat_cau as permissive for select to authenticated using (true);
grant INSERT on public.hoahoc_de_xuat_cau to anon;
grant SELECT on public.hoahoc_de_xuat_cau to anon;
grant UPDATE on public.hoahoc_de_xuat_cau to anon;
grant DELETE on public.hoahoc_de_xuat_cau to anon;
grant INSERT on public.hoahoc_de_xuat_cau to authenticated;
grant SELECT on public.hoahoc_de_xuat_cau to authenticated;
grant UPDATE on public.hoahoc_de_xuat_cau to authenticated;
grant DELETE on public.hoahoc_de_xuat_cau to authenticated;
alter table public.hoahoc_de_xuat_quyet_dinh enable row level security;
create policy "hoahoc_de_xuat_quyet_dinh_select" on public.hoahoc_de_xuat_quyet_dinh as permissive for select to authenticated using (true);
grant INSERT on public.hoahoc_de_xuat_quyet_dinh to anon;
grant SELECT on public.hoahoc_de_xuat_quyet_dinh to anon;
grant UPDATE on public.hoahoc_de_xuat_quyet_dinh to anon;
grant DELETE on public.hoahoc_de_xuat_quyet_dinh to anon;
grant INSERT on public.hoahoc_de_xuat_quyet_dinh to authenticated;
grant SELECT on public.hoahoc_de_xuat_quyet_dinh to authenticated;
grant UPDATE on public.hoahoc_de_xuat_quyet_dinh to authenticated;
grant DELETE on public.hoahoc_de_xuat_quyet_dinh to authenticated;
alter table public.hoahoc_mcq_rule enable row level security;
create policy "hoahoc_mcq_rule_member_all" on public.hoahoc_mcq_rule as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_mcq_rule to anon;
grant SELECT on public.hoahoc_mcq_rule to anon;
grant UPDATE on public.hoahoc_mcq_rule to anon;
grant DELETE on public.hoahoc_mcq_rule to anon;
grant INSERT on public.hoahoc_mcq_rule to authenticated;
grant SELECT on public.hoahoc_mcq_rule to authenticated;
grant UPDATE on public.hoahoc_mcq_rule to authenticated;
grant DELETE on public.hoahoc_mcq_rule to authenticated;
alter table public.hoahoc_cau_form_tn enable row level security;
create policy "hoahoc_cau_form_tn_member_all" on public.hoahoc_cau_form_tn as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_cau_form_tn to anon;
grant SELECT on public.hoahoc_cau_form_tn to anon;
grant UPDATE on public.hoahoc_cau_form_tn to anon;
grant DELETE on public.hoahoc_cau_form_tn to anon;
grant INSERT on public.hoahoc_cau_form_tn to authenticated;
grant SELECT on public.hoahoc_cau_form_tn to authenticated;
grant UPDATE on public.hoahoc_cau_form_tn to authenticated;
grant DELETE on public.hoahoc_cau_form_tn to authenticated;
alter table public.hoahoc_bdm_chu_de enable row level security;
create policy "hoahoc_bdm_chu_de_member_all" on public.hoahoc_bdm_chu_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_chu_de to anon;
grant SELECT on public.hoahoc_bdm_chu_de to anon;
grant UPDATE on public.hoahoc_bdm_chu_de to anon;
grant DELETE on public.hoahoc_bdm_chu_de to anon;
grant INSERT on public.hoahoc_bdm_chu_de to authenticated;
grant SELECT on public.hoahoc_bdm_chu_de to authenticated;
grant UPDATE on public.hoahoc_bdm_chu_de to authenticated;
grant DELETE on public.hoahoc_bdm_chu_de to authenticated;
alter table public.hoahoc_bdm_chuyen_de enable row level security;
create policy "hoahoc_bdm_chuyen_de_member_all" on public.hoahoc_bdm_chuyen_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_chuyen_de to anon;
grant SELECT on public.hoahoc_bdm_chuyen_de to anon;
grant UPDATE on public.hoahoc_bdm_chuyen_de to anon;
grant DELETE on public.hoahoc_bdm_chuyen_de to anon;
grant INSERT on public.hoahoc_bdm_chuyen_de to authenticated;
grant SELECT on public.hoahoc_bdm_chuyen_de to authenticated;
grant UPDATE on public.hoahoc_bdm_chuyen_de to authenticated;
grant DELETE on public.hoahoc_bdm_chuyen_de to authenticated;
alter table public.hoahoc_bdm_o enable row level security;
create policy "hoahoc_bdm_o_member_all" on public.hoahoc_bdm_o as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_o to anon;
grant SELECT on public.hoahoc_bdm_o to anon;
grant UPDATE on public.hoahoc_bdm_o to anon;
grant DELETE on public.hoahoc_bdm_o to anon;
grant INSERT on public.hoahoc_bdm_o to authenticated;
grant SELECT on public.hoahoc_bdm_o to authenticated;
grant UPDATE on public.hoahoc_bdm_o to authenticated;
grant DELETE on public.hoahoc_bdm_o to authenticated;
alter table public.hoahoc_bdm_nhom enable row level security;
create policy "hoahoc_bdm_nhom_member_all" on public.hoahoc_bdm_nhom as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_nhom to anon;
grant SELECT on public.hoahoc_bdm_nhom to anon;
grant UPDATE on public.hoahoc_bdm_nhom to anon;
grant DELETE on public.hoahoc_bdm_nhom to anon;
grant INSERT on public.hoahoc_bdm_nhom to authenticated;
grant SELECT on public.hoahoc_bdm_nhom to authenticated;
grant UPDATE on public.hoahoc_bdm_nhom to authenticated;
grant DELETE on public.hoahoc_bdm_nhom to authenticated;
alter table public.hoahoc_bdm_dang_bai enable row level security;
create policy "hoahoc_bdm_dang_bai_member_all" on public.hoahoc_bdm_dang_bai as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_dang_bai to anon;
grant SELECT on public.hoahoc_bdm_dang_bai to anon;
grant UPDATE on public.hoahoc_bdm_dang_bai to anon;
grant DELETE on public.hoahoc_bdm_dang_bai to anon;
grant INSERT on public.hoahoc_bdm_dang_bai to authenticated;
grant SELECT on public.hoahoc_bdm_dang_bai to authenticated;
grant UPDATE on public.hoahoc_bdm_dang_bai to authenticated;
grant DELETE on public.hoahoc_bdm_dang_bai to authenticated;
alter table public.hoahoc_bdm_nhom_tien_de enable row level security;
create policy "hoahoc_bdm_nhom_tien_de_member_all" on public.hoahoc_bdm_nhom_tien_de as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_nhom_tien_de to anon;
grant SELECT on public.hoahoc_bdm_nhom_tien_de to anon;
grant UPDATE on public.hoahoc_bdm_nhom_tien_de to anon;
grant DELETE on public.hoahoc_bdm_nhom_tien_de to anon;
grant INSERT on public.hoahoc_bdm_nhom_tien_de to authenticated;
grant SELECT on public.hoahoc_bdm_nhom_tien_de to authenticated;
grant UPDATE on public.hoahoc_bdm_nhom_tien_de to authenticated;
grant DELETE on public.hoahoc_bdm_nhom_tien_de to authenticated;
alter table public.hoahoc_bdm_gan_cau enable row level security;
create policy "hoahoc_bdm_gan_cau_member_all" on public.hoahoc_bdm_gan_cau as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_gan_cau to anon;
grant SELECT on public.hoahoc_bdm_gan_cau to anon;
grant UPDATE on public.hoahoc_bdm_gan_cau to anon;
grant DELETE on public.hoahoc_bdm_gan_cau to anon;
grant INSERT on public.hoahoc_bdm_gan_cau to authenticated;
grant SELECT on public.hoahoc_bdm_gan_cau to authenticated;
grant UPDATE on public.hoahoc_bdm_gan_cau to authenticated;
grant DELETE on public.hoahoc_bdm_gan_cau to authenticated;
alter table public.hoahoc_bdm_log enable row level security;
create policy "hoahoc_bdm_log_member_read" on public.hoahoc_bdm_log as permissive for select to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_log to authenticated;
grant SELECT on public.hoahoc_bdm_log to authenticated;
grant UPDATE on public.hoahoc_bdm_log to authenticated;
grant DELETE on public.hoahoc_bdm_log to authenticated;
alter table public.hoahoc_bdm_de_xuat enable row level security;
create policy "hoahoc_bdm_de_xuat_member_all" on public.hoahoc_bdm_de_xuat as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_de_xuat to authenticated;
grant SELECT on public.hoahoc_bdm_de_xuat to authenticated;
grant UPDATE on public.hoahoc_bdm_de_xuat to authenticated;
grant DELETE on public.hoahoc_bdm_de_xuat to authenticated;
alter table public.hoahoc_bdm_cau_thieu_dang enable row level security;
create policy "hoahoc_bdm_cau_thieu_dang_member_all" on public.hoahoc_bdm_cau_thieu_dang as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_cau_thieu_dang to authenticated;
grant SELECT on public.hoahoc_bdm_cau_thieu_dang to authenticated;
grant UPDATE on public.hoahoc_bdm_cau_thieu_dang to authenticated;
grant DELETE on public.hoahoc_bdm_cau_thieu_dang to authenticated;
alter table public.hoahoc_bdm_kiem_mau enable row level security;
create policy "hoahoc_bdm_kiem_mau_member_all" on public.hoahoc_bdm_kiem_mau as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_kiem_mau to authenticated;
grant SELECT on public.hoahoc_bdm_kiem_mau to authenticated;
grant UPDATE on public.hoahoc_bdm_kiem_mau to authenticated;
grant DELETE on public.hoahoc_bdm_kiem_mau to authenticated;
alter table public.hoahoc_bdm_tu_choi enable row level security;
create policy "hoahoc_bdm_tu_choi_member_all" on public.hoahoc_bdm_tu_choi as permissive for all to authenticated using (( SELECT la_thanh_vien() AS la_thanh_vien)) with check (( SELECT la_thanh_vien() AS la_thanh_vien));
grant INSERT on public.hoahoc_bdm_tu_choi to authenticated;
grant SELECT on public.hoahoc_bdm_tu_choi to authenticated;
grant UPDATE on public.hoahoc_bdm_tu_choi to authenticated;
grant DELETE on public.hoahoc_bdm_tu_choi to authenticated;
grant SELECT on sequence public.hoahoc_bdm_chu_de_seq to anon;
grant USAGE on sequence public.hoahoc_bdm_chu_de_seq to anon;
grant SELECT on sequence public.hoahoc_bdm_chu_de_seq to authenticated;
grant USAGE on sequence public.hoahoc_bdm_chu_de_seq to authenticated;
grant SELECT on sequence public.hoahoc_bdm_chuyen_de_seq to anon;
grant USAGE on sequence public.hoahoc_bdm_chuyen_de_seq to anon;
grant SELECT on sequence public.hoahoc_bdm_chuyen_de_seq to authenticated;
grant USAGE on sequence public.hoahoc_bdm_chuyen_de_seq to authenticated;
grant SELECT on sequence public.hoahoc_bdm_dang_bai_seq to anon;
grant USAGE on sequence public.hoahoc_bdm_dang_bai_seq to anon;
grant SELECT on sequence public.hoahoc_bdm_dang_bai_seq to authenticated;
grant USAGE on sequence public.hoahoc_bdm_dang_bai_seq to authenticated;
grant SELECT on sequence public.hoahoc_bdm_log_id_seq to anon;
grant USAGE on sequence public.hoahoc_bdm_log_id_seq to anon;
grant SELECT on sequence public.hoahoc_bdm_log_id_seq to authenticated;
grant USAGE on sequence public.hoahoc_bdm_log_id_seq to authenticated;
grant SELECT on sequence public.hoahoc_bdm_nhom_seq to anon;
grant USAGE on sequence public.hoahoc_bdm_nhom_seq to anon;
grant SELECT on sequence public.hoahoc_bdm_nhom_seq to authenticated;
grant USAGE on sequence public.hoahoc_bdm_nhom_seq to authenticated;
grant SELECT on sequence public.hoahoc_bdm_tu_choi_id_seq to anon;
grant USAGE on sequence public.hoahoc_bdm_tu_choi_id_seq to anon;
grant SELECT on sequence public.hoahoc_bdm_tu_choi_id_seq to authenticated;
grant USAGE on sequence public.hoahoc_bdm_tu_choi_id_seq to authenticated;
grant SELECT on sequence public.hoahoc_cau_seq to anon;
grant USAGE on sequence public.hoahoc_cau_seq to anon;
grant SELECT on sequence public.hoahoc_cau_seq to authenticated;
grant USAGE on sequence public.hoahoc_cau_seq to authenticated;
grant SELECT on sequence public.hoahoc_cum_seq to anon;
grant USAGE on sequence public.hoahoc_cum_seq to anon;
grant SELECT on sequence public.hoahoc_cum_seq to authenticated;
grant USAGE on sequence public.hoahoc_cum_seq to authenticated;
grant SELECT on sequence public.hoahoc_dang_seq to anon;
grant USAGE on sequence public.hoahoc_dang_seq to anon;
grant SELECT on sequence public.hoahoc_dang_seq to authenticated;
grant USAGE on sequence public.hoahoc_dang_seq to authenticated;
CREATE OR REPLACE FUNCTION public.hoahoc_dang_tien_de_bao_dong(goc text)
 RETURNS TABLE(ma_dang text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.tien_de_ma_dang as id, 1 as do_sau, array[goc, t.tien_de_ma_dang] as duong
      from hoahoc_dang_tien_de t where t.ma_dang = goc
    union all
    select t.tien_de_ma_dang, d.do_sau + 1, d.duong || t.tien_de_ma_dang
      from hoahoc_dang_tien_de t join di d on t.ma_dang = d.id
     where not t.tien_de_ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.hoahoc_dang_tien_de_bao_dong(goc text) from public;
revoke all on function public.hoahoc_dang_tien_de_bao_dong(goc text) from anon;
grant execute on function public.hoahoc_dang_tien_de_bao_dong(goc text) to authenticated;
grant execute on function public.hoahoc_dang_tien_de_bao_dong(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.hoahoc_dang_hau_due(goc text)
 RETURNS TABLE(ma_dang text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from hoahoc_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from hoahoc_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.hoahoc_dang_hau_due(goc text) from public;
revoke all on function public.hoahoc_dang_hau_due(goc text) from anon;
grant execute on function public.hoahoc_dang_hau_due(goc text) to authenticated;
grant execute on function public.hoahoc_dang_hau_due(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.hoahoc_cum_tien_de_bao_dong(goc text)
 RETURNS TABLE(ma_cum text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.tien_de_ma_cum as id, 1 as do_sau, array[goc, t.tien_de_ma_cum] as duong
      from hoahoc_cum_tien_de t where t.ma_cum = goc
    union all
    select t.tien_de_ma_cum, d.do_sau + 1, d.duong || t.tien_de_ma_cum
      from hoahoc_cum_tien_de t join di d on t.ma_cum = d.id
     where not t.tien_de_ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.hoahoc_cum_tien_de_bao_dong(goc text) from public;
revoke all on function public.hoahoc_cum_tien_de_bao_dong(goc text) from anon;
grant execute on function public.hoahoc_cum_tien_de_bao_dong(goc text) to authenticated;
grant execute on function public.hoahoc_cum_tien_de_bao_dong(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.hoahoc_cum_hau_due(goc text)
 RETURNS TABLE(ma_cum text, do_sau integer)
 LANGUAGE sql
 STABLE
AS $function$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from hoahoc_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from hoahoc_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$
;
revoke all on function public.hoahoc_cum_hau_due(goc text) from public;
revoke all on function public.hoahoc_cum_hau_due(goc text) from anon;
grant execute on function public.hoahoc_cum_hau_due(goc text) to authenticated;
grant execute on function public.hoahoc_cum_hau_due(goc text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_sinh_ma_dang(p_ma_chuyen_de text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare v_stt int; v_ma text;
begin
  if p_ma_chuyen_de !~ '^Q[0-9]{6}$' or right(p_ma_chuyen_de, 4) = '0000' then
    raise exception 'fn_hoahoc_sinh_ma_dang: chuyên đề "%" không hợp lệ', p_ma_chuyen_de;
  end if;
  select coalesce(max(substring(ma_dang from 8 for 2)::int), 0) + 1 into v_stt
    from hoahoc_ban_do where ma_dang ~ ('^' || p_ma_chuyen_de || '[0-9]{2}$');
  if v_stt > 99 then raise exception 'fn_hoahoc_sinh_ma_dang: chuyên đề % đã đủ 99 dạng', p_ma_chuyen_de; end if;
  v_ma := p_ma_chuyen_de || lpad(v_stt::text, 2, '0');
  if exists (select 1 from hoahoc_ban_do where ma_dang = v_ma) then raise exception 'fn_hoahoc_sinh_ma_dang: mã "%" đã tồn tại', v_ma; end if;
  return v_ma;
end $function$
;
revoke all on function public.fn_hoahoc_sinh_ma_dang(p_ma_chuyen_de text) from public;
revoke all on function public.fn_hoahoc_sinh_ma_dang(p_ma_chuyen_de text) from anon;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_de_xuat_ds(p_khoi text, p_chi_cho boolean DEFAULT true)
 RETURNS TABLE(id uuid, loai text, khoi text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text, ten text, mo_ta_ngan text, dang_gan_nhat text, ten_dang_gan_nhat text, ly_do text, lo text, nguon text, created_at timestamp with time zone, cau jsonb, quyet_dinh jsonb)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select d.id, d.loai, d.khoi, d.ma_chuyen_de,
         (select b.ten_chuyen_de from hoahoc_ban_do b where b.ma_chuyen_de = d.ma_chuyen_de limit 1),
         d.ma_dang, (select b.ten_dang from hoahoc_ban_do b where b.ma_dang = d.ma_dang),
         d.ten, d.mo_ta_ngan, d.dang_gan_nhat, (select b.ten_dang from hoahoc_ban_do b where b.ma_dang = d.dang_gan_nhat),
         d.ly_do, d.lo, d.nguon, d.created_at,
         coalesce((select jsonb_agg(jsonb_build_object(
                     'ma_cau', q.ma_cau, 'loai_cau', q.loai_cau, 'noi_dung', left(q.noi_dung, 700),
                     'dang_chinh', q.dang_chinh, 'da_duyet', q.da_duyet) order by q.ma_cau)
                     from hoahoc_de_xuat_cau c join hoahoc_cau_hoi q on q.ma_cau = c.ma_cau
                    where c.de_xuat_id = d.id), '[]'::jsonb),
         (select to_jsonb(x) from (select qd.hanh_dong, qd.ket_qua_ma_dang, qd.ket_qua_ma_cum, qd.tra_loi, qd.so_cau_doi, qd.quyet_at,
                                          (select ns.ho_ten from nhan_su ns where ns.id = qd.nguoi) nguoi_ten
                                     from hoahoc_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id) x)
    from hoahoc_de_xuat d
   where d.khoi = p_khoi
     and (not p_chi_cho or not exists (select 1 from hoahoc_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))
   order by d.lo, d.ma_chuyen_de, d.created_at
   limit 500
$function$
;
revoke all on function public.fn_hoahoc_de_xuat_ds(p_khoi text, p_chi_cho boolean) from public;
revoke all on function public.fn_hoahoc_de_xuat_ds(p_khoi text, p_chi_cho boolean) from anon;
grant execute on function public.fn_hoahoc_de_xuat_ds(p_khoi text, p_chi_cho boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang_dich text DEFAULT NULL::text, p_tra_loi text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d        hoahoc_de_xuat%rowtype;
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

  select * into d from hoahoc_de_xuat where id = p_id for update;
  if not found then raise exception 'Đề xuất không tồn tại'; end if;
  if exists (select 1 from hoahoc_de_xuat_quyet_dinh where de_xuat_id = p_id) then raise exception 'Đề xuất này đã được quyết rồi'; end if;

  if not ((d.loai = 'dang_moi' and v_hd in ('nhan', 'gop', 'bac'))
       or (d.loai = 'cum_moi'  and v_hd in ('nhan', 'bac'))
       or (d.loai = 'trao_doi' and v_hd = 'tra_loi')) then
    raise exception 'Hành động "%" không hợp lệ cho đề xuất loại "%"', v_hd, d.loai;
  end if;
  if v_hd in ('bac', 'tra_loi') and nullif(btrim(p_tra_loi), '') is null then
    raise exception 'Phải ghi lý do / câu trả lời — đây là thứ biến thành luật cho lô sau';
  end if;
  if v_hd = 'gop' and p_ma_dang_dich is null then raise exception 'Gộp thì phải chọn dạng đích'; end if;
  if p_ma_dang_dich is not null and not exists (select 1 from hoahoc_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'Dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;
  if p_ma_dang_dich is not null and public._kho_la_dang_cho(p_ma_dang_dich) then
    raise exception 'Không dời câu về dạng chờ';
  end if;

  select count(*) into v_bo_qua from hoahoc_de_xuat_cau c join hoahoc_cau_hoi q on q.ma_cau = c.ma_cau
   where c.de_xuat_id = p_id and q.da_duyet;

  if d.loai = 'dang_moi' and v_hd = 'nhan' then
    select * into m from hoahoc_ban_do where ma_chuyen_de = d.ma_chuyen_de and not public._kho_la_dang_cho(ma_dang) order by ma_dang limit 1;
    if not found then raise exception 'Chuyên đề "%" chưa có dạng nào để lấy tên chủ đề/chuyên đề', d.ma_chuyen_de; end if;
    v_ma := public.fn_hoahoc_sinh_ma_dang(d.ma_chuyen_de);
    insert into hoahoc_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
    values (v_ma, m.khoi, m.ma_chu_de, m.ten_chu_de, m.ma_chuyen_de, m.ten_chuyen_de,
            coalesce(nullif(btrim(p_ten), ''), d.ten), m.muc_do, m.bac_toi_thieu, coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan));
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten
       or coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan) is distinct from d.mo_ta_ngan then
      v_hd := 'nhan_co_sua';
    end if;
  elsif v_hd in ('gop', 'tra_loi') then
    v_ma := p_ma_dang_dich;          -- tra_loi không chỉ định dạng ⇒ null, không dời câu
  elsif d.loai = 'cum_moi' and v_hd = 'nhan' then
    insert into hoahoc_cum_bai (ma_dang, ten, thu_tu)
    values (d.ma_dang, coalesce(nullif(btrim(p_ten), ''), d.ten),
            coalesce((select max(thu_tu) from hoahoc_cum_bai where ma_dang = d.ma_dang), 0) + 1)
    returning ma_cum into v_cum;
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten then v_hd := 'nhan_co_sua'; end if;
    update hoahoc_cau_hoi q set ma_cum = v_cum
      from hoahoc_de_xuat_cau c where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and q.dang_chinh = d.ma_dang;
    get diagnostics v_n = row_count;
  end if;

  if v_ma is not null then
    update hoahoc_cau_hoi q set dang_chinh = v_ma, ma_cum = null
      from hoahoc_de_xuat_cau c
     where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and not q.da_duyet and q.dang_chinh is distinct from v_ma;
    get diagnostics v_n = row_count;
  end if;

  insert into hoahoc_de_xuat_quyet_dinh (de_xuat_id, hanh_dong, ket_qua_ma_dang, ket_qua_ma_cum, tra_loi, so_cau_doi, nguoi)
  values (p_id, v_hd, v_ma, v_cum, nullif(btrim(p_tra_loi), ''), v_n, v_nguoi);

  return jsonb_build_object('hanh_dong', v_hd, 'ket_qua_ma_dang', v_ma, 'ket_qua_ma_cum', v_cum,
                            'so_cau_doi', v_n, 'so_cau_da_duyet_bo_qua', case when v_ma is null then 0 else v_bo_qua end);
end $function$
;
revoke all on function public.fn_hoahoc_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) from public;
revoke all on function public.fn_hoahoc_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) from anon;
grant execute on function public.fn_hoahoc_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang text DEFAULT NULL::text, p_dang_gan_nhat text DEFAULT NULL::text)
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
  if not exists (select 1 from hoahoc_ban_do where ma_chuyen_de = p_ma_chuyen_de and khoi = p_khoi) then
    raise exception 'Chuyên đề "%" không thuộc khối %', p_ma_chuyen_de, p_khoi;
  end if;
  select string_agg(x, ', ') into v_thieu from unnest(p_ma_cau) x
   where not exists (select 1 from hoahoc_cau_hoi q where q.ma_cau = x and q.xoa_at is null);
  if v_thieu is not null then raise exception 'Câu không tồn tại: %', v_thieu; end if;

  insert into hoahoc_de_xuat (loai, khoi, ma_chuyen_de, ma_dang, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon)
  values (p_loai, p_khoi, p_ma_chuyen_de, p_ma_dang, nullif(btrim(p_ten), ''), nullif(btrim(p_mo_ta_ngan), ''),
          p_dang_gan_nhat, btrim(p_ly_do), btrim(p_lo), 'nguoi')
  returning id into v_id;
  insert into hoahoc_de_xuat_cau (de_xuat_id, ma_cau) select v_id, x from (select distinct unnest(p_ma_cau) x) t;
  return v_id;
end $function$
;
revoke all on function public.fn_hoahoc_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) from public;
revoke all on function public.fn_hoahoc_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) from anon;
grant execute on function public.fn_hoahoc_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_de_xuat_tk(p_khoi text)
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
    from hoahoc_de_xuat d left join hoahoc_de_xuat_quyet_dinh qd on qd.de_xuat_id = d.id
   where d.khoi = p_khoi
   group by d.lo, d.loai order by d.lo, d.loai
$function$
;
revoke all on function public.fn_hoahoc_de_xuat_tk(p_khoi text) from public;
revoke all on function public.fn_hoahoc_de_xuat_tk(p_khoi text) from anon;
grant execute on function public.fn_hoahoc_de_xuat_tk(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.hoahoc_cau_form_tn_kiem()
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
            and (e->>'rule' is null or not exists (select 1 from hoahoc_mcq_rule r where r.ma = e->>'rule'));
        if v_thieu is not null then raise exception 'phương án sai thiếu rule hoặc rule không tồn tại: %', v_thieu; end if;
        new.updated_at := now();
        return new;
      end $function$
;
revoke all on function public.hoahoc_cau_form_tn_kiem() from public;
revoke all on function public.hoahoc_cau_form_tn_kiem() from anon;
grant execute on function public.hoahoc_cau_form_tn_kiem() to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_thu_tu()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.thu_tu is not null then return new; end if;
  if tg_table_name = 'hoahoc_bdm_chu_de' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from hoahoc_bdm_chu_de where khoi = new.khoi;
  elsif tg_table_name = 'hoahoc_bdm_o' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from hoahoc_bdm_o where chu_de_id = new.chu_de_id;
  elsif tg_table_name = 'hoahoc_bdm_nhom' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from hoahoc_bdm_nhom where chu_de_id = new.chu_de_id and chuyen_de_id = new.chuyen_de_id;
  elsif tg_table_name = 'hoahoc_bdm_dang_bai' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from hoahoc_bdm_dang_bai where nhom_id = new.nhom_id;
  end if;
  return new;
end $function$
;
revoke all on function public._hoahoc_bdm_thu_tu() from public;
revoke all on function public._hoahoc_bdm_thu_tu() from anon;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_ghi_log()
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
  insert into hoahoc_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id', r ->> 'ma_cau', (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id'), (r ->> 'nhom_id') || '>' || (r ->> 'tien_de_nhom_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end, r_cu, r_moi);
  return null;
end $function$
;
revoke all on function public._hoahoc_bdm_ghi_log() from public;
revoke all on function public._hoahoc_bdm_ghi_log() from anon;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_bump_nhom()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  update hoahoc_bdm_nhom set updated_at = now()
   where id in (case when tg_op <> 'INSERT' then old.nhom_id end, case when tg_op <> 'DELETE' then new.nhom_id end);
  return null;
end $function$
;
revoke all on function public._hoahoc_bdm_bump_nhom() from public;
revoke all on function public._hoahoc_bdm_bump_nhom() from anon;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_tien_de_kiem()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare a hoahoc_bdm_nhom; b hoahoc_bdm_nhom;
begin
  select * into a from hoahoc_bdm_nhom where id = new.nhom_id;
  select * into b from hoahoc_bdm_nhom where id = new.tien_de_nhom_id;
  if (a.chu_de_id, a.chuyen_de_id) is distinct from (b.chu_de_id, b.chuyen_de_id) then
    raise exception 'Đợt này tiền đề chỉ nối các nhóm bài trong cùng một chuyên đề («%» và «%» khác chuyên đề)', a.ten, b.ten;
  end if;
  if exists (
    with recursive t(id) as (
      select tien_de_nhom_id from hoahoc_bdm_nhom_tien_de where nhom_id = new.tien_de_nhom_id
      union
      select e.tien_de_nhom_id from hoahoc_bdm_nhom_tien_de e join t on e.nhom_id = t.id
    ) select 1 from t where t.id = new.nhom_id
  ) then
    raise exception 'Tạo vòng tròn: «%» đang phải học sau «%»', b.ten, a.ten;
  end if;
  return new;
end $function$
;
revoke all on function public._hoahoc_bdm_tien_de_kiem() from public;
revoke all on function public._hoahoc_bdm_tien_de_kiem() from anon;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_tien_de_cung_o()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if exists (
    select 1 from hoahoc_bdm_nhom_tien_de e
      join hoahoc_bdm_nhom x on x.id = e.nhom_id
      join hoahoc_bdm_nhom y on y.id = e.tien_de_nhom_id
     where (e.nhom_id = new.id or e.tien_de_nhom_id = new.id)
       and (x.chu_de_id, x.chuyen_de_id) is distinct from (y.chu_de_id, y.chuyen_de_id)
  ) then
    raise exception 'Nhóm «%» còn mũi tên tiền đề nối với nhóm ở chuyên đề khác — gỡ mũi tên trước', new.ten;
  end if;
  return null;
end $function$
;
revoke all on function public._hoahoc_bdm_tien_de_cung_o() from public;
revoke all on function public._hoahoc_bdm_tien_de_cung_o() from anon;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_khoi_cua_nhom(p_nhom text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select cd.khoi from hoahoc_bdm_nhom n join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_nhom
$function$
;
revoke all on function public._hoahoc_bdm_khoi_cua_nhom(p_nhom text) from public;
revoke all on function public._hoahoc_bdm_khoi_cua_nhom(p_nhom text) from anon;
grant execute on function public._hoahoc_bdm_khoi_cua_nhom(p_nhom text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_cay(p_khoi text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dem_db as materialized (
    select g.dang_bai_id, count(*) n from hoahoc_bdm_gan_cau g join hoahoc_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null group by 1
  ),
  chua as materialized (   -- câu còn sống chưa phân, theo nhóm (dạng cũ = nhóm.ma_cu)
    select n.id nhom_id, n.chu_de_id, n.chuyen_de_id, count(*) n
      from hoahoc_cau_hoi q join hoahoc_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = q.ma_cau)
     group by 1, 2, 3
  ),
  so_cd as materialized (select o.chuyen_de_id, count(*) n from hoahoc_bdm_o o group by 1),
  td as materialized (select e.nhom_id, jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id) ds from hoahoc_bdm_nhom_tien_de e group by 1),
  cho as materialized (   -- câu ở dạng chờ / dạng cũ không còn nhóm (chưa khớp) của khối
    select count(*) n from hoahoc_cau_hoi q join hoahoc_ban_do b on b.ma_dang = q.dang_chinh
     where b.khoi = p_khoi and q.xoa_at is null and not exists (select 1 from hoahoc_bdm_nhom n where n.ma_cu = q.dang_chinh)
  )
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu, 'nhanh', 'hoahoc', 'so_ds', 0,
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from hoahoc_bdm_o o3 join hoahoc_bdm_chu_de c2 on c2.id = o3.chu_de_id
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
                'do_kho_tb', (select round(avg(x.muc_do)::numeric, 1) from hoahoc_bdm_dang_bai x where x.nhom_id = n.id and x.muc_do is not null),
                'so_co_muc', (select count(x.muc_do) from hoahoc_bdm_dang_bai x where x.nhom_id = n.id),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_ly_thuyet', (btrim(d.ly_thuyet) <> '' or d.ly_thuyet_file_url is not null),
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'muc_do', d.muc_do, 'bac_toi_thieu', d.bac_toi_thieu,
                    'so_cau', coalesce((select dd.n from dem_db dd where dd.dang_bai_id = d.id), 0),
                    'dang_cu', '[]'::jsonb
                  ) order by d.so)
                  from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) so from hoahoc_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
              ) order by n.so)
              from (select n0.*, row_number() over (order by n0.thu_tu, n0.id) so
                      from hoahoc_bdm_nhom n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
          ) order by o.so)
          from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) so from hoahoc_bdm_o o0 where o0.chu_de_id = cd.id) o
          join hoahoc_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
      ) order by cd.thu_tu, cd.id)
      from hoahoc_bdm_chu_de cd where cd.khoi = p_khoi), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb) from hoahoc_bdm_o o join hoahoc_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from hoahoc_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from hoahoc_bdm_chu_de group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object('dang_cu', 0, 'dang_cu_chua_gan', 0, 'cau_dang_cu_chua_gan', 0,
      'cau', (select count(*) from hoahoc_cau_hoi q join hoahoc_ban_do b on b.ma_dang = q.dang_chinh where b.khoi = p_khoi and q.xoa_at is null),
      'cau_chua_gan', (select coalesce(sum(x.n), 0) from chua x join hoahoc_bdm_chu_de cd on cd.id = x.chu_de_id where cd.khoi = p_khoi),
      'cau_chua_khop', (select n from cho))
  )
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public.fn_hoahoc_bdm_cay(p_khoi text, p_nhanh text) from public;
revoke all on function public.fn_hoahoc_bdm_cay(p_khoi text, p_nhanh text) from anon;
grant execute on function public.fn_hoahoc_bdm_cay(p_khoi text, p_nhanh text) to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_xoa_cac_nhom(p_nhom text[])
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v_db integer; v_cau integer; v_n integer;
begin
  select count(*) into v_cau from hoahoc_bdm_gan_cau g join hoahoc_bdm_dang_bai d on d.id = g.dang_bai_id where d.nhom_id = any (p_nhom);
  if v_cau > 0 then raise exception 'Bên trong có % câu đã được gán vào dạng bài — gỡ gán hoặc chuyển dạng bài đi trước rồi mới xoá', v_cau; end if;
  delete from hoahoc_bdm_nhom_tien_de where nhom_id = any (p_nhom) or tien_de_nhom_id = any (p_nhom);
  delete from hoahoc_bdm_dang_bai where nhom_id = any (p_nhom);
  get diagnostics v_db = row_count;
  delete from hoahoc_bdm_nhom where id = any (p_nhom);
  get diagnostics v_n = row_count;
  return jsonb_build_object('nhom', v_n, 'dang_bai', v_db);
end $function$
;
revoke all on function public._hoahoc_bdm_xoa_cac_nhom(p_nhom text[]) from public;
revoke all on function public._hoahoc_bdm_xoa_cac_nhom(p_nhom text[]) from anon;
grant execute on function public._hoahoc_bdm_xoa_cac_nhom(p_nhom text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_xoa_nhom(p_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
begin
  if not exists (select 1 from hoahoc_bdm_nhom where id = p_id) then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  return _hoahoc_bdm_xoa_cac_nhom(array[p_id]);
end $function$
;
revoke all on function public.fn_hoahoc_bdm_xoa_nhom(p_id text) from public;
revoke all on function public.fn_hoahoc_bdm_xoa_nhom(p_id text) from anon;
grant execute on function public.fn_hoahoc_bdm_xoa_nhom(p_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_xoa_o(p_chu_de text, p_chuyen_de text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v jsonb; v_xoa_cd boolean := false;
begin
  if not exists (select 1 from hoahoc_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de) then
    raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de, p_chu_de;
  end if;
  v := _hoahoc_bdm_xoa_cac_nhom(array(select id from hoahoc_bdm_nhom where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de));
  delete from hoahoc_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de;
  if not exists (select 1 from hoahoc_bdm_o where chuyen_de_id = p_chuyen_de) then delete from hoahoc_bdm_chuyen_de where id = p_chuyen_de; v_xoa_cd := true; end if;
  return v || jsonb_build_object('xoa_khoi_danh_muc', v_xoa_cd);
end $function$
;
revoke all on function public.fn_hoahoc_bdm_xoa_o(p_chu_de text, p_chuyen_de text) from public;
revoke all on function public.fn_hoahoc_bdm_xoa_o(p_chu_de text, p_chuyen_de text) from anon;
grant execute on function public.fn_hoahoc_bdm_xoa_o(p_chu_de text, p_chuyen_de text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_xoa_chu_de(p_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v jsonb; v_o integer; v_cds text[];
begin
  if not exists (select 1 from hoahoc_bdm_chu_de where id = p_id) then raise exception 'Không tìm thấy chủ đề %', p_id; end if;
  v := _hoahoc_bdm_xoa_cac_nhom(array(select id from hoahoc_bdm_nhom where chu_de_id = p_id));
  v_cds := array(select chuyen_de_id from hoahoc_bdm_o where chu_de_id = p_id);
  delete from hoahoc_bdm_o where chu_de_id = p_id;
  get diagnostics v_o = row_count;
  delete from hoahoc_bdm_chuyen_de ch where ch.id = any (v_cds) and not exists (select 1 from hoahoc_bdm_o o where o.chuyen_de_id = ch.id);
  delete from hoahoc_bdm_chu_de where id = p_id;
  return v || jsonb_build_object('chuyen_de', v_o);
end $function$
;
revoke all on function public.fn_hoahoc_bdm_xoa_chu_de(p_id text) from public;
revoke all on function public.fn_hoahoc_bdm_xoa_chu_de(p_id text) from anon;
grant execute on function public.fn_hoahoc_bdm_xoa_chu_de(p_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_sap_xep(p_loai text, p_ids text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if p_loai = 'chu_de' then
    update hoahoc_bdm_chu_de t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'o' then
    update hoahoc_bdm_o t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.chu_de_id || '|' || t.chuyen_de_id = x.id;
  elsif p_loai = 'nhom' then
    update hoahoc_bdm_nhom t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'dang_bai' then
    update hoahoc_bdm_dang_bai t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  else
    raise exception 'fn_hoahoc_bdm_sap_xep: loại "%" không hợp lệ', p_loai;
  end if;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_sap_xep(p_loai text, p_ids text[]) from public;
revoke all on function public.fn_hoahoc_bdm_sap_xep(p_loai text, p_ids text[]) from anon;
grant execute on function public.fn_hoahoc_bdm_sap_xep(p_loai text, p_ids text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare n hoahoc_bdm_nhom; so_mui integer;
begin
  select * into n from hoahoc_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if (n.chu_de_id, n.chuyen_de_id) is distinct from (p_chu_de_id, p_chuyen_de_id) then
    select count(*) into so_mui from hoahoc_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
    if so_mui > 0 then raise exception 'Nhóm «%» còn % mũi tên tiền đề — gỡ mũi tên trước khi chuyển sang chuyên đề khác', n.ten, so_mui; end if;
  end if;
  update hoahoc_bdm_nhom set chu_de_id = p_chu_de_id, chuyen_de_id = p_chuyen_de_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from hoahoc_bdm_nhom where chu_de_id = p_chu_de_id and chuyen_de_id = p_chuyen_de_id and id <> p_id)
   where id = p_id;
  if p_thu_tu_dich is not null then perform fn_hoahoc_bdm_sap_xep('nhom', p_thu_tu_dich); end if;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) from public;
revoke all on function public.fn_hoahoc_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) from anon;
grant execute on function public.fn_hoahoc_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  update hoahoc_bdm_dang_bai set nhom_id = p_nhom_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from hoahoc_bdm_dang_bai where nhom_id = p_nhom_id and id <> p_id)
   where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if p_thu_tu_dich is not null then perform fn_hoahoc_bdm_sap_xep('dang_bai', p_thu_tu_dich); end if;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) from public;
revoke all on function public.fn_hoahoc_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) from anon;
grant execute on function public.fn_hoahoc_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if p_chu_de_cu = p_chu_de_moi then return; end if;
  if exists (select 1 from hoahoc_bdm_o where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id) then
    update hoahoc_bdm_nhom set chu_de_id = p_chu_de_moi,
           thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from hoahoc_bdm_nhom where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    delete from hoahoc_bdm_o where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
  else
    update hoahoc_bdm_o set chu_de_id = p_chu_de_moi, thu_tu = (select coalesce(max(thu_tu), 0) + 1 from hoahoc_bdm_o where chu_de_id = p_chu_de_moi)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    if not found then raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de_id, p_chu_de_cu; end if;
  end if;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) from public;
revoke all on function public.fn_hoahoc_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) from anon;
grant execute on function public.fn_hoahoc_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_gop_chuyen_de(p_tu text, p_vao text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare r record;
begin
  if p_tu = p_vao then raise exception 'Không thể gộp chuyên đề vào chính nó'; end if;
  if not exists (select 1 from hoahoc_bdm_chuyen_de where id = p_vao) then raise exception 'Không tìm thấy chuyên đề đích %', p_vao; end if;
  for r in select chu_de_id from hoahoc_bdm_o where chuyen_de_id = p_tu loop
    if exists (select 1 from hoahoc_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao) then
      update hoahoc_bdm_nhom set chuyen_de_id = p_vao,
             thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from hoahoc_bdm_nhom where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao)
       where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
      delete from hoahoc_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
    else
      update hoahoc_bdm_o set chuyen_de_id = p_vao where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;   -- ON UPDATE CASCADE kéo nhóm theo
    end if;
  end loop;
  update hoahoc_bdm_chuyen_de v set mo_ta = t.mo_ta from hoahoc_bdm_chuyen_de t where v.id = p_vao and t.id = p_tu and btrim(v.mo_ta) = '';
  delete from hoahoc_bdm_chuyen_de where id = p_tu;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_gop_chuyen_de(p_tu text, p_vao text) from public;
revoke all on function public.fn_hoahoc_bdm_gop_chuyen_de(p_tu text, p_vao text) from anon;
grant execute on function public.fn_hoahoc_bdm_gop_chuyen_de(p_tu text, p_vao text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare d hoahoc_bdm_dang_bai; v_nhom text; v_lt text;
begin
  select * into d from hoahoc_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if exists (select 1 from hoahoc_bdm_gan_cau where dang_bai_id = p_id) then
    raise exception 'Dạng bài «%» đang có câu được gán — chuyển hoặc gỡ gán trước rồi mới nâng', d.ten;
  end if;
  v_lt := case when btrim(d.vi_du) = '' then d.ly_thuyet when btrim(d.ly_thuyet) = '' then d.vi_du
               else d.ly_thuyet || chr(10) || chr(10) || '**Ví dụ**' || chr(10) || chr(10) || d.vi_du end;
  insert into hoahoc_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, v_lt, coalesce(d.ly_thuyet_file_url, d.vi_du_file_url), coalesce(d.ly_thuyet_ten_file, d.vi_du_ten_file))
  returning id into v_nhom;
  delete from hoahoc_bdm_dang_bai where id = p_id;
  return v_nhom;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) from public;
revoke all on function public.fn_hoahoc_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) from anon;
grant execute on function public.fn_hoahoc_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_ha_nhom(p_id text, p_nhom_dich text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare n hoahoc_bdm_nhom; v_db text; v_tt integer;
begin
  if p_id = p_nhom_dich then raise exception 'Không thể hạ nhóm vào chính nó'; end if;
  select * into n from hoahoc_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if not exists (select 1 from hoahoc_bdm_nhom where id = p_nhom_dich) then raise exception 'Không tìm thấy nhóm đích %', p_nhom_dich; end if;
  if exists (select 1 from hoahoc_cau_hoi q where q.dang_chinh = n.ma_cu and q.xoa_at is null and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = q.ma_cau)) then
    raise exception 'Nhóm «%» còn câu chưa phân — xếp các câu đó vào dạng bài trước rồi mới hạ nhóm', n.ten;
  end if;
  select coalesce(max(thu_tu), 0) into v_tt from hoahoc_bdm_dang_bai where nhom_id = p_nhom_dich;
  insert into hoahoc_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file, v_tt + 1)
  returning id into v_db;
  update hoahoc_bdm_dang_bai d set nhom_id = p_nhom_dich, thu_tu = v_tt + 1 + x.i
    from (select c.id, row_number() over (order by c.thu_tu, c.id) i from hoahoc_bdm_dang_bai c where c.nhom_id = p_id) x
   where d.id = x.id;
  delete from hoahoc_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
  delete from hoahoc_bdm_nhom where id = p_id;
  return v_db;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_ha_nhom(p_id text, p_nhom_dich text) from public;
revoke all on function public.fn_hoahoc_bdm_ha_nhom(p_id text, p_nhom_dich text) from anon;
grant execute on function public.fn_hoahoc_bdm_ha_nhom(p_id text, p_nhom_dich text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_dang_cu(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$ select '[]'::jsonb $function$
;
revoke all on function public.fn_hoahoc_bdm_dang_cu(p_khoi text) from public;
revoke all on function public.fn_hoahoc_bdm_dang_cu(p_khoi text) from anon;
grant execute on function public.fn_hoahoc_bdm_dang_cu(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_gan_cum(p_ma_cum text, p_dang_bai text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin raise exception 'Hóa học không còn cụm — cụm cũ đã thành dạng bài (bản đồ mới 29/10).'; end $function$
;
revoke all on function public.fn_hoahoc_bdm_gan_cum(p_ma_cum text, p_dang_bai text) from public;
revoke all on function public.fn_hoahoc_bdm_gan_cum(p_ma_cum text, p_dang_bai text) from anon;
grant execute on function public.fn_hoahoc_bdm_gan_cum(p_ma_cum text, p_dang_bai text) to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_khoi text; v_khoi_db text; v integer;
begin
  select b.khoi into v_khoi from hoahoc_cau_hoi c join hoahoc_ban_do b on b.ma_dang = c.dang_chinh where c.ma_cau = p_ma_cau and c.xoa_at is null;
  if v_khoi is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  select cd.khoi into v_khoi_db from hoahoc_bdm_dang_bai d join hoahoc_bdm_nhom n on n.id = d.nhom_id join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  if v_khoi_db is null then raise exception 'Không tìm thấy dạng bài % ở bản đồ mới Hóa học', p_dang_bai; end if;
  if v_khoi_db <> v_khoi then raise exception 'Dạng bài % thuộc khối %, câu % thuộc khối %', p_dang_bai, v_khoi_db, p_ma_cau, v_khoi; end if;
  insert into hoahoc_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, p_dang_bai, p_nguon from hoahoc_cau_hoi c where c.xoa_at is null and (c.ma_cau = p_ma_cau or c.parent_ma_cau = p_ma_cau)
  on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon, actor = public.jwt_uid(), at = now()
   where (g.dang_bai_id, g.nguon) is distinct from (excluded.dang_bai_id, excluded.nguon);
  get diagnostics v = row_count;
  return v;
end $function$
;
revoke all on function public._hoahoc_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) from public;
revoke all on function public._hoahoc_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) from anon;
grant execute on function public._hoahoc_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text DEFAULT 'nguoi'::text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare m text; v integer := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nguon not in ('nguoi', 'ai') then raise exception 'p_nguon phải là nguoi hoặc ai'; end if;
  foreach m in array coalesce(p_ma_caus, '{}') loop v := v + _hoahoc_bdm_gan(m, p_dang_bai, p_nguon); end loop;
  return v;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) from public;
revoke all on function public.fn_hoahoc_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) from anon;
grant execute on function public.fn_hoahoc_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean DEFAULT true)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v jsonb; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ca_ban_sao then v_n := _hoahoc_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  else
    perform 1 from hoahoc_bdm_dang_bai where id = p_dang_bai;
    if not found then raise exception 'Không tìm thấy dạng bài %', p_dang_bai; end if;
    insert into hoahoc_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    v_n := 1;
  end if;
  select jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'so_cau', v_n) into v
    from hoahoc_bdm_dang_bai d join hoahoc_bdm_nhom n on n.id = d.nhom_id join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  return v;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) from public;
revoke all on function public.fn_hoahoc_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) from anon;
grant execute on function public.fn_hoahoc_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean DEFAULT false)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update hoahoc_cau_hoi set xoa_at = now() where xoa_at is null and (ma_cau = p_ma_cau or (p_ca_ban_sao and parent_ma_cau = p_ma_cau));   -- kho rác
  get diagnostics v = row_count;
  if v = 0 then raise exception 'Không thấy câu % ở kho Hóa học (hoặc đã vào kho rác)', p_ma_cau; end if;
  return v;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) from public;
revoke all on function public.fn_hoahoc_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) from anon;
grant execute on function public.fn_hoahoc_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer DEFAULT 200, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with cg as materialized (
    select q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau) goc
      from hoahoc_cau_hoi q join hoahoc_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null
       and ((p_nhom is not null and n.id = p_nhom) or (p_nhom is null and n.chu_de_id = p_chu_de and n.chuyen_de_id = p_chuyen_de))
       and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = q.ma_cau)
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
        from (select * from goc order by goc limit p_limit offset p_offset) g join hoahoc_cau_hoi c on c.ma_cau = g.goc), '[]'::jsonb)
  )
$function$
;
revoke all on function public.fn_hoahoc_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) from public;
revoke all on function public.fn_hoahoc_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) from anon;
grant execute on function public.fn_hoahoc_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_kho_cau(p_loai text, p_id text, p_loc text DEFAULT 'tat_ca'::text, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0)
 RETURNS TABLE(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ids text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_hoahoc_bdm_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai = 'dang_bai' then v_ids := array[p_id];
  elsif p_loai = 'nhom' then v_ids := array(select d.id from hoahoc_bdm_dang_bai d where d.nhom_id = p_id);
  else return;   -- Hóa học chưa có rổ chưa khớp / đề xuất / thiếu dạng / Đúng-Sai ở bản đồ mới
  end if;
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'gan_cau:' || g.nguon, g.dang_bai_id, db.ten, null::text
      from hoahoc_bdm_gan_cau g
      join hoahoc_cau_hoi c on c.ma_cau = g.ma_cau and c.xoa_at is null
      join hoahoc_bdm_dang_bai db on db.id = g.dang_bai_id
     where g.dang_bai_id = any (v_ids)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by db.thu_tu, coalesce(c.parent_ma_cau, c.ma_cau), (c.parent_ma_cau is not null), c.ma_cau
     limit p_limit offset p_offset;
end $function$
;
revoke all on function public.fn_hoahoc_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) from public;
revoke all on function public.fn_hoahoc_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) from anon;
grant execute on function public.fn_hoahoc_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer) to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_la_lan_do(p_ma_cau text, p_ma_dang_chep text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select case when p_ma_cau is not null and exists (select 1 from hoahoc_cau_hoi c where c.ma_cau = p_ma_cau) then true
              when p_ma_cau is not null and (exists (select 1 from dai_cau_hoi c where c.ma_cau = p_ma_cau)
                                          or exists (select 1 from hgt_cau_hoi c where c.ma_cau = p_ma_cau)) then false
              else exists (select 1 from hoahoc_ban_do b where b.ma_dang = p_ma_dang_chep) end
$function$
;
revoke all on function public._hoahoc_la_lan_do(p_ma_cau text, p_ma_dang_chep text) from public;
revoke all on function public._hoahoc_la_lan_do(p_ma_cau text, p_ma_dang_chep text) from anon;
grant execute on function public._hoahoc_la_lan_do(p_ma_cau text, p_ma_dang_chep text) to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_do_o_bdm(p_ma_cau text, p_ma_dang_chep text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare r record; v text;
begin
  if p_ma_cau is not null then
    select c.dang_chinh, c.xoa_at is not null as da_xoa, g.dang_bai_id into r
      from hoahoc_cau_hoi c left join hoahoc_bdm_gan_cau g on g.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      select min(g.dang_bai_id) into v
        from hoahoc_cau_hoi s join hoahoc_bdm_gan_cau g on g.ma_cau = s.ma_cau
       where s.dang_chinh = r.dang_chinh and s.xoa_at is null
      having count(distinct g.dang_bai_id) = 1;
      return v;
    end if;
  end if;
  select min(d.id) into v
    from hoahoc_bdm_nhom n join hoahoc_bdm_dang_bai d on d.nhom_id = n.id
   where n.ma_cu = p_ma_dang_chep
  having count(*) = 1;
  return v;
end $function$
;
revoke all on function public._hoahoc_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) from public;
revoke all on function public._hoahoc_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) from anon;
grant execute on function public._hoahoc_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_duyet_duoc(p_khoi text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce((select la_admin from my_quyen()), false) or public._truong_khoi_tro_len('Hóa học', p_khoi)
$function$
;
revoke all on function public._hoahoc_bdm_duyet_duoc(p_khoi text) from public;
revoke all on function public._hoahoc_bdm_duyet_duoc(p_khoi text) from anon;
grant execute on function public._hoahoc_bdm_duyet_duoc(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public._hoahoc_bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from hoahoc_bdm_de_xuat dx
      join hoahoc_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join hoahoc_bdm_dang_bai d on d.id = dx.dang_bai_id
      join hoahoc_bdm_nhom n on n.id = d.nhom_id
      join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, t.chu_de_id, t.ly_do, null::text
      from hoahoc_bdm_cau_thieu_dang t
      join hoahoc_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join hoahoc_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    -- chưa có dạng: câu gốc của khối, chưa gán / chưa đề xuất / chưa báo thiếu. Chủ đề gợi ý = nhóm bản đồ mới dựng từ dạng cũ (ma_cu).
    select q.ma_cau, null::text, (select min(n.chu_de_id) from hoahoc_bdm_nhom n where n.ma_cu = q.dang_chinh), ''::text, null::text
      from hoahoc_cau_hoi q
      join hoahoc_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from hoahoc_bdm_chu_de c2 where c2.khoi = p_khoi)
       and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from hoahoc_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from hoahoc_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from hoahoc_bdm_gan_cau g
      join hoahoc_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
      join hoahoc_bdm_dang_bai d on d.id = g.dang_bai_id
      join hoahoc_bdm_nhom n on n.id = d.nhom_id
      join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from hoahoc_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (như Toán)
  ) s
  where public._hoahoc_bdm_duyet_duoc(p_khoi)
  ) z
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public._hoahoc_bdm_khop_nguon(p_khoi text, p_hang text) from public;
revoke all on function public._hoahoc_bdm_khop_nguon(p_khoi text, p_hang text) from anon;
grant execute on function public._hoahoc_bdm_khop_nguon(p_khoi text, p_hang text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_khop_dem(p_khoi text, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select z.x from (
with s as materialized (select x.ma_cau, x.chu_de_id, h.hang from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h(hang)
                           cross join lateral public._hoahoc_bdm_khop_nguon(p_khoi, h.hang) x
                          where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
                            and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau))))
  select jsonb_build_object(
    'de_xuat', (select count(*) from s where hang = 'de_xuat'),
    'thieu',   (select count(*) from s where hang = 'thieu'),
    'trong',   (select count(*) from s where hang = 'trong'),
    'mau',     (select count(*) from s where hang = 'mau'),
    'kiem_n',   (select count(*) from hoahoc_bdm_kiem_mau k join hoahoc_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join hoahoc_bdm_nhom n on n.id = d.nhom_id join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from hoahoc_bdm_kiem_mau k join hoahoc_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join hoahoc_bdm_nhom n on n.id = d.nhom_id join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
  ) z(x)
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$
;
revoke all on function public.fn_hoahoc_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) from public;
revoke all on function public.fn_hoahoc_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) from anon;
grant execute on function public.fn_hoahoc_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from public._hoahoc_bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'hoahoc' and d.ma = x.ma_cau) ds on true
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
        'nhanh', 'hoahoc', 'nguon_tl', public._kho_nguon_cau(q.ma_cau)
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join hoahoc_cau_hoi q on q.ma_cau = pg.ma_cau
      left join hoahoc_ban_do b on b.ma_dang = q.dang_chinh
      left join hoahoc_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join hoahoc_bdm_nhom n on n.id = d.nhom_id
      left join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id
      left join hoahoc_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$
;
revoke all on function public.fn_hoahoc_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) from public;
revoke all on function public.fn_hoahoc_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) from anon;
grant execute on function public.fn_hoahoc_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text DEFAULT NULL::text)
 RETURNS TABLE(nguon text, so_cau bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select n, count(*) from public._hoahoc_bdm_khop_nguon(p_khoi, p_hang) s, unnest(public._kho_nguon_cau(s.ma_cau)) n
   where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de
   group by n order by n
$function$
;
revoke all on function public.fn_hoahoc_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) from public;
revoke all on function public.fn_hoahoc_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) from anon;
grant execute on function public.fn_hoahoc_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_khop_dich(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dang_bai', d.ten, 'mo_ta', d.mo_ta, 'nhom', n.ten, 'nhom_id', n.id,
    'chuyen_de', ch.ten, 'chuyen_de_id', ch.id, 'chu_de', cd.ten, 'chu_de_id', cd.id
  ) order by cd.thu_tu, ch.id, n.thu_tu, d.thu_tu), '[]'::jsonb)
  from hoahoc_bdm_chu_de cd
  join hoahoc_bdm_nhom n on n.chu_de_id = cd.id
  join hoahoc_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
  join hoahoc_bdm_dang_bai d on d.nhom_id = n.id
  where cd.khoi = p_khoi
$function$
;
revoke all on function public.fn_hoahoc_bdm_khop_dich(p_khoi text) from public;
revoke all on function public.fn_hoahoc_bdm_khop_dich(p_khoi text) from anon;
grant execute on function public.fn_hoahoc_bdm_khop_dich(p_khoi text) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_hoahoc_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text DEFAULT NULL::text, p_ly_do text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare v_khoi text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  select b.khoi into v_khoi from hoahoc_cau_hoi q join hoahoc_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;
  if not public._hoahoc_bdm_duyet_duoc(v_khoi) then raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn (Hóa học khối %)', p_ma_cau, v_khoi; end if;
  select g.dang_bai_id, g.nguon into v_ai, v_nguon from hoahoc_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from hoahoc_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  if p_dang_bai is not null then
    select cd.id into v_cd_dich from hoahoc_bdm_dang_bai d join hoahoc_bdm_nhom n on n.id = d.nhom_id join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi;
    if v_cd_dich is null then raise exception 'Dạng bài % không tồn tại trong Hóa học khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    perform public._hoahoc_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
    delete from hoahoc_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from hoahoc_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    insert into hoahoc_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) values (p_ma_cau, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    delete from hoahoc_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from hoahoc_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into hoahoc_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into hoahoc_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    perform public._hoahoc_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from hoahoc_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into hoahoc_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into hoahoc_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from hoahoc_bdm_gan_cau where (ma_cau = p_ma_cau or ma_cau in (select c.ma_cau from hoahoc_cau_hoi c where c.parent_ma_cau = p_ma_cau)) and nguon = 'ai';
    end if;
    delete from hoahoc_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from hoahoc_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform public.fn_kho_tu_choi_cau('hoahoc', p_ma_cau, public.current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$
;
revoke all on function public.fn_hoahoc_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) from public;
revoke all on function public.fn_hoahoc_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) from anon;
grant execute on function public.fn_hoahoc_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text) to authenticated;
CREATE CONSTRAINT TRIGGER trg_hoahoc_bdm_nhom_tien_de_cung_o AFTER UPDATE OF chu_de_id, chuyen_de_id ON public.hoahoc_bdm_nhom DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_tien_de_cung_o();
CREATE TRIGGER hoahoc_cau_form_tn_kiem BEFORE INSERT OR UPDATE ON public.hoahoc_cau_form_tn FOR EACH ROW EXECUTE FUNCTION hoahoc_cau_form_tn_kiem();
CREATE TRIGGER hoahoc_cau_hoi_yeu_cau_giai_claude_dong BEFORE UPDATE ON public.hoahoc_cau_hoi_yeu_cau_giai FOR EACH ROW EXECUTE FUNCTION fn_giaibai_tg_claude_dong();
CREATE TRIGGER trg_chan_duyet_dang_cho BEFORE INSERT OR UPDATE OF da_duyet, dang_chinh ON public.hoahoc_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_chan_duyet_dang_cho();
CREATE TRIGGER trg_de_thi_dien_dang AFTER UPDATE OF dang_chinh ON public.hoahoc_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_de_thi_dien_dang();
CREATE TRIGGER trg_kho_cau_duyet_nguon BEFORE INSERT OR UPDATE OF da_duyet, duyet_nguon ON public.hoahoc_cau_hoi FOR EACH ROW EXECUTE FUNCTION _kho_cau_duyet_nguon();
CREATE TRIGGER trg_hoahoc_ban_do_sync_ca_test_cau AFTER UPDATE OF ten_chuyen_de, muc_do ON public.hoahoc_ban_do FOR EACH ROW EXECUTE FUNCTION tg_ban_do_sync_ca_test_cau();
CREATE TRIGGER trg_hoahoc_ban_do_xoa_dong_bo_btyeu AFTER DELETE ON public.hoahoc_ban_do FOR EACH STATEMENT EXECUTE FUNCTION _trg_btyeu_dong_bo_dang_ban_do();
CREATE TRIGGER trg_hoahoc_bdm_chu_de_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_chu_de_thu_tu BEFORE INSERT ON public.hoahoc_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_thu_tu();
CREATE TRIGGER trg_hoahoc_bdm_chu_de_touch BEFORE UPDATE ON public.hoahoc_bdm_chu_de FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_hoahoc_bdm_chuyen_de_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_chuyen_de FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_chuyen_de_touch BEFORE UPDATE ON public.hoahoc_bdm_chuyen_de FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_hoahoc_bdm_dang_bai_bump AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_bump_nhom();
CREATE TRIGGER trg_hoahoc_bdm_dang_bai_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_dang_bai_thu_tu BEFORE INSERT ON public.hoahoc_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_thu_tu();
CREATE TRIGGER trg_hoahoc_bdm_dang_bai_touch BEFORE UPDATE ON public.hoahoc_bdm_dang_bai FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_hoahoc_bdm_gan_cau_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_gan_cau FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_gan_cau_tu_duyet AFTER INSERT OR UPDATE OF nguon, dang_bai_id ON public.hoahoc_bdm_gan_cau FOR EACH ROW EXECUTE FUNCTION _bdm_tu_duyet_sau_gan();
CREATE TRIGGER trg_hoahoc_bdm_nhom_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_nhom_thu_tu BEFORE INSERT ON public.hoahoc_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_thu_tu();
CREATE TRIGGER trg_hoahoc_bdm_nhom_tien_de_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_nhom_tien_de FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_nhom_touch BEFORE UPDATE ON public.hoahoc_bdm_nhom FOR EACH ROW EXECUTE FUNCTION _bdm_touch();
CREATE TRIGGER trg_hoahoc_bdm_o_log AFTER INSERT OR DELETE OR UPDATE ON public.hoahoc_bdm_o FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_ghi_log();
CREATE TRIGGER trg_hoahoc_bdm_o_thu_tu BEFORE INSERT ON public.hoahoc_bdm_o FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_thu_tu();
CREATE TRIGGER trg_hoahoc_bdm_tien_de_kiem BEFORE INSERT OR UPDATE ON public.hoahoc_bdm_nhom_tien_de FOR EACH ROW EXECUTE FUNCTION _hoahoc_bdm_tien_de_kiem();
CREATE TRIGGER trg_log_doi_dang AFTER UPDATE OF dang_chinh ON public.hoahoc_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_log_doi_dang('hoahoc', 'cau');
CREATE TRIGGER trg_log_kho_cau_hoahoc AFTER DELETE OR UPDATE ON public.hoahoc_cau_hoi FOR EACH ROW EXECUTE FUNCTION log_kho_cau();
CREATE TRIGGER trg_log_kho_sua AFTER UPDATE OF noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ma_cum ON public.hoahoc_cau_hoi FOR EACH ROW EXECUTE FUNCTION _trg_log_kho_sua('hoahoc');
insert into public.hoahoc_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
select 'Q' || k || '000000', k, 'Q' || k || '00', 'Chưa phân dạng', 'Q' || k || '0000', 'Chưa phân dạng', 'Chưa phân dạng', 1, 'C',
       'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).'
  from unnest(array['10', '11', '12']) k;   -- dạng chờ, như K07..K09 của KHTN

-- ════ (B) hàm dùng chung: BẢN GỐC (trước Lý hóa) + nhánh Vật lý, Hóa học ════
-- _mon_khoi_hop_le
create or replace function public._mon_khoi_hop_le(p_mon text, p_khoi text)
 returns boolean language sql immutable
as $function$
  select case
    when p_mon = 'TSA' then p_khoi = '12'
    when p_mon in ('Vật lý', 'Hóa học') then p_khoi in ('10', '11', '12') -- Thùy 12/11: Vật lý · Hóa học = môn cấp 3
    else true end
$function$;
-- _kho_ban_do_tbl
CREATE OR REPLACE FUNCTION public._kho_ban_do_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_mon = 'Vật lý' then 'vatly_ban_do'
              when p_mon = 'Hóa học' then 'hoahoc_ban_do'
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
              when p_mon = 'Vật lý' then 'vatly_cau_hoi'
              when p_mon = 'Hóa học' then 'hoahoc_cau_hoi'
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
              when p_mon = 'Vật lý' then 'vatly_cau_form_dien'
              when p_mon = 'Hóa học' then 'hoahoc_cau_form_dien'
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
              when p_mon = 'Vật lý' then 'vatly_cau_form_tn'
              when p_mon = 'Hóa học' then 'hoahoc_cau_form_tn'
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
              when p_mon = 'Vật lý' then 'vatly_dang_ly_thuyet'
              when p_mon = 'Hóa học' then 'hoahoc_dang_ly_thuyet'
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
  elsif p_mon = 'Vật lý' then
    select muc_do into v_md from vatly_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Hóa học' then
    select muc_do into v_md from hoahoc_ban_do where ma_dang = p_ma_dang;
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
              when p_mon not in ('KHTN', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'TSA') and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon not in ('KHTN', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              when p_mon not in ('KHTN', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_baitoan where ma = p_ma_dang) then 'hinh_mo_hinh' -- 14/10: bài mô hình = KP (ma_dang = hinh_baitoan.ma)
              else null end
$function$
;
-- _kho_dang_cho
CREATE OR REPLACE FUNCTION public._kho_dang_cho(p_tbl text, p_khoi text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_tbl when 'dai' then 'T1' when 'hgt' then 'T3' when 'khtn' then 'K' when 'vatly' then 'L' when 'hoahoc' then 'Q' when 'anh' then 'E' when 'tsa' then 'TS' when 'hinh_hoc' then 'HH' end
         || lpad(p_khoi, 2, '0') || '000000'
$function$
;
-- fn_kho_tbl
CREATE OR REPLACE FUNCTION public.fn_kho_tbl(p_mon text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_mon when 'toan' then 'dai' when 'khtn' then 'khtn' when 'vatly' then 'vatly' when 'hoahoc' then 'hoahoc' when 'hgt' then 'hgt' when 'hinh_hoc' then 'hinh_hoc' when 'anh' then 'anh' when 'tsa' then 'tsa' end
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
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi', 'vatly_cau_hoi', 'hoahoc_cau_hoi', 'hgt_cau_hoi', 'anh_cau_hoi', 'tsa_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
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
  if p_kho not in ('dai', 'khtn', 'vatly', 'hoahoc', 'hgt') then raise exception 'p_kho phải là dai/khtn/vatly/hoahoc/hgt (đang %)', p_kho; end if;
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
  if p_mon not in ('dai', 'hgt', 'khtn', 'vatly', 'hoahoc') then raise exception 'fn_kho_doi_dang_tk: mon không hợp lệ %', p_mon; end if;
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
                            when tg_table_name like 'vatly%' then 'vatly_cau_hoi'
                            when tg_table_name like 'hoahoc%' then 'hoahoc_cau_hoi'
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
    elsif tg_table_name = 'vatly_cau_hoi' then   -- như KHTN
      if exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;
    elsif tg_table_name = 'hoahoc_cau_hoi' then   -- như KHTN
      if exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;
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
  select d.id, 'vatly', d.muc_do::smallint
    from vatly_bdm_dang_bai d
   where public._kho_ban_do_tbl(p_mon, null) = 'vatly_ban_do' and d.id = any(p_ma)
  union all
  select d.id, 'hoahoc', d.muc_do::smallint
    from hoahoc_bdm_dang_bai d
   where public._kho_ban_do_tbl(p_mon, null) = 'hoahoc_ban_do' and d.id = any(p_ma)
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
  if t is null or t not in ('dai', 'hgt', 'khtn', 'vatly', 'hoahoc') then raise exception 'Kho % chưa có bản đồ mới', coalesce(p_mon, '∅'); end if;
  if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))
     or (t = 'vatly' and not exists (select 1 from vatly_bdm_chu_de where khoi = p_khoi))
     or (t = 'hoahoc' and not exists (select 1 from hoahoc_bdm_chu_de where khoi = p_khoi))
     or (t not in ('khtn', 'vatly', 'hoahoc') and not coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', p_khoi)), false)) then
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
    if p_chu_de is not null and t not in ('khtn', 'vatly', 'hoahoc') then   -- KHTN chưa có kho Đ/S cấp chủ đề
      execute format($q$insert into %I (ma_cau, chu_de_id, nguon) values ($1, $2, 'nguoi')$q$, t || '_bdm_kho_ds') using v_ma, p_chu_de;
    end if;
  elsif p_dang_bai is not null and t = 'khtn' then
    perform public._khtn_bdm_gan(v_ma, p_dang_bai, 'nguoi');
  elsif p_dang_bai is not null and t = 'vatly' then
    perform public._vatly_bdm_gan(v_ma, p_dang_bai, 'nguoi');
  elsif p_dang_bai is not null and t = 'hoahoc' then
    perform public._hoahoc_bdm_gan(v_ma, p_dang_bai, 'nguoi');
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
AS $function$ select case when p_nhanh = 'khtn' then 'KHTN' when p_nhanh = 'vatly' then 'Vật lý' when p_nhanh = 'hoahoc' then 'Hóa học' else 'Toán' end $function$
;
-- fn_giaibai_src
CREATE OR REPLACE FUNCTION public.fn_giaibai_src(p_nhanh text, OUT src text, OUT src_key text)
 RETURNS record
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_nhanh
           when 'toan' then 'dai_cau_hoi' when 'khtn' then 'khtn_cau_hoi' when 'vatly' then 'vatly_cau_hoi' when 'hoahoc' then 'hoahoc_cau_hoi' when 'hgt' then 'hgt_cau_hoi'
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
           when 'toan' then 'dai_cau_hoi_yeu_cau_giai' when 'khtn' then 'khtn_cau_hoi_yeu_cau_giai' when 'vatly' then 'vatly_cau_hoi_yeu_cau_giai' when 'hoahoc' then 'hoahoc_cau_hoi_yeu_cau_giai' when 'hgt' then 'hgt_cau_hoi_yeu_cau_giai'
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

  if p_nhanh in ('toan','khtn','vatly','hoahoc','hgt') then
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
    if p_nhanh in ('toan','khtn','vatly','hoahoc','hgt') then
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
    select 'vatly', count(*) from vatly_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'vatly' = any(p_nhanh)
    union all
    select 'hoahoc', count(*) from hoahoc_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'hoahoc' = any(p_nhanh)
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
-- view v_giaibai_bai
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
         SELECT 'khtn'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
         SELECT 'vatly'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
           FROM vatly_cau_hoi c
             JOIN vatly_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.loi_giai IS NULL AND c.anh_dap_an IS NULL AND c.dap_an IS NULL
        UNION ALL
         SELECT 'hoahoc'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
           FROM hoahoc_cau_hoi c
             JOIN hoahoc_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.loi_giai IS NULL AND c.anh_dap_an IS NULL AND c.dap_an IS NULL
        UNION ALL
         SELECT 'hgt'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
            'Mô hình'::text AS text,
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
            'le'::text AS text,
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
-- view v_giaibai_hoan_thien
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
         SELECT 'khtn'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
         SELECT 'vatly'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
           FROM vatly_cau_hoi c
             JOIN vatly_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.nguon_giai = 'ai'::text AND c.giai_method = 'claude_code'::text AND c.da_duyet = false
        UNION ALL
         SELECT 'hoahoc'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
           FROM hoahoc_cau_hoi c
             JOIN hoahoc_ban_do b ON b.ma_dang = c.dang_chinh
          WHERE c.xoa_at IS NULL AND c.nguon_giai = 'ai'::text AND c.giai_method = 'claude_code'::text AND c.da_duyet = false
        UNION ALL
         SELECT 'hgt'::text AS text,
            c.ma_cau,
            c.ma_cau,
            b.khoi,
            b.ten_dang,
            b.ma_dang,
            b.ten_chuyen_de,
            b.muc_do,
            c.loai_cau,
            c.noi_dung,
            NULL::text AS text,
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
         SELECT 'hinh_baitoan'::text AS text,
            b.id::text AS id,
            b.ma,
            m.khoi,
            m.ten,
            m.ma,
            'Mô hình'::text AS text,
            NULL::smallint AS int2,
            'bai_toan_goc'::text AS text,
            b.phat_bieu,
            concat_ws('
'::text, m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) AS concat_ws,
            COALESCE(b.anh_chuan, m.anh_cau_hinh) AS "coalesce",
            NULL::jsonb AS jsonb,
            NULL::jsonb AS jsonb,
            NULL::text AS text,
            'le'::text AS text,
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
         SELECT 'hinh_bien_the'::text AS text,
            v.id::text AS id,
            (b.ma || ' · BT'::text) || v.thu_tu,
            m.khoi,
            m.ten,
            m.ma,
            'Mô hình'::text AS text,
            NULL::smallint AS int2,
            'bien_the_'::text || v.kieu,
            v.de_bai,
            concat_ws('
'::text, m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) AS concat_ws,
            COALESCE(v.anh, b.anh_chuan, m.anh_cau_hinh) AS "coalesce",
            NULL::jsonb AS jsonb,
            NULL::jsonb AS jsonb,
            NULL::text AS text,
            'le'::text AS text,
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
-- view v_giaibai_nhan
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
         SELECT 'khtn'::text AS text,
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
            NULL::text AS text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai
           FROM khtn_cau_hoi_yeu_cau_giai y
             JOIN khtn_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN khtn_ban_do b ON b.ma_dang = c.dang_chinh
        UNION ALL
         SELECT 'vatly'::text AS text,
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
            NULL::text AS text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai
           FROM vatly_cau_hoi_yeu_cau_giai y
             JOIN vatly_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN vatly_ban_do b ON b.ma_dang = c.dang_chinh
        UNION ALL
         SELECT 'hoahoc'::text AS text,
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
            NULL::text AS text,
            c.anh_de,
            c.lua_chon,
            c.menh_de,
            c.dap_an,
            c.loi_giai
           FROM hoahoc_cau_hoi_yeu_cau_giai y
             JOIN hoahoc_cau_hoi c ON c.ma_cau = y.ma_cau
             JOIN hoahoc_ban_do b ON b.ma_dang = c.dang_chinh
        UNION ALL
         SELECT 'hgt'::text AS text,
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
            NULL::text AS text,
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
         SELECT 'hinh_bien_the'::text AS text,
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
            'Mô hình'::text AS text,
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
-- _do_o_quy
CREATE OR REPLACE FUNCTION public._do_o_quy(p_bdm boolean, p_khtn_bdm boolean, p_kc text, p_kd text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select case when public._btyeu_la_hinh_mh(p_kd) then null   -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
              when p_khtn_bdm and public._khtn_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._khtn_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))
              when p_khtn_bdm and public._vatly_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._vatly_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- như KHTN
              when p_khtn_bdm and public._hoahoc_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._hoahoc_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- như KHTN
              when p_bdm then public._do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- BẢN ĐỒ MỚI Toán (K6–12; cấp 1 + Hình giữ cũ bên trong)
              else public._do_nhom_cua_o(nullif(p_kc, ''), nullif(p_kd, '')) end
$function$
;
-- _dbht_cau
CREATE OR REPLACE FUNCTION public._dbht_cau(p_hs uuid[], p_tu date, p_mon text)
 RETURNS TABLE(hoc_sinh_id uuid, ngay date, t timestamp with time zone, kenh text, luot text, thu_tu integer, ma_cau text, gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text, chu_de_id text, ten_dang text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy (+ bản sao câu app — ngày = ngày nộp)
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           sp.hinh_baitoan_id as bt_id,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang, null::uuid,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  k as (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd, bt_id from m),
  -- HÌNH: nhận diện + quy về mô hình / bài học
  hk as materialized (
    select k.kc, k.kd, k.bt_id,
           coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id) as mh_id,
           public.fn_hl_goc_mo_hinh(coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id)) as goc_id,   -- 09/11: gốc tính 1 lần mỗi khoá
           coalesce(bt1.id, bt2.id) as bt_ref,
           coalesce(hc.dang_chinh, hb.ma_bai) as hh_bai
      from k
      left join hinh_baitoan bt1 on bt1.id = k.bt_id
      left join hinh_baitoan bt2 on k.bt_id is null and bt2.ma = nullif(k.kd, '')
      left join hinh_hoc_cau_hoi hc on hc.ma_cau = nullif(k.kc, '')
      left join hinh_hoc_bai hb on hb.ma_bai = nullif(k.kd, '')
     where bt1.id is not null or bt2.id is not null or hc.ma_cau is not null or hb.ma_bai is not null
  ),
  -- ⭐ 09/11 (spec-hinh-cay-nhanh §13.1/§13.5/§13.6 bước 1): tầng Hình = Chủ đề → MÔ HÌNH (cấp chuyên đề, thay nhóm mô hình)
  --   → TRỌNG ĐIỂM (cấp nhóm). Nốt quy về mô hình GỐC của cây (trước đây lấy thẳng nút chứa nốt ⇒ nốt ở nhánh rơi vào 'HINH').
  --   Cấp nhóm: nốt trong thành viên nhóm bài ⇒ 'H:N:<nút nhóm>' · nốt trọng điểm ⇒ 'H:T:<nốt>' · còn lại ⇒ 'H:<gốc>'.
  hcap as (
    select hk.kc, hk.kd, hk.bt_id,
           coalesce(case when mh.vai = 'thanh_vien' then 'H:N:' || (select c.cha_id::text from hinh_mo_hinh_cha c where c.mo_hinh_id = mh.id limit 1) end,
                    case when btr.la_trong_diem then 'H:T:' || btr.id::text end,
                    'H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as nhom_id,
           coalesce('H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as chuyen_de_id,
           coalesce('H:' || coalesce(g.chu_de_id, nmh.chu_de_id, hhb.chu_de_id), 'HINH') as chu_de_id,
           coalesce(mh.ten, hhb.ten_bai, 'Hình') as ten_dang
      from hk
      left join hinh_mo_hinh mh on mh.id = hk.mh_id
      left join hinh_baitoan btr on btr.id = hk.bt_ref
      left join hinh_mo_hinh g on g.id = hk.goc_id
      left join hinh_nhom_mo_hinh nmh on nmh.id = g.nhom_mh_id      -- Bước 1 chưa xoá nhóm: chỉ còn làm dự phòng chủ đề
      left join hinh_hoc_bai hhb on hhb.ma_bai = hk.hh_bai
  ),
  -- KHTN (04/11): dạng bài bản đồ mới KHTN — cùng luật quy câu với tổng quan HS (`_khtn_do_o_bdm`)
  kk as (
    select k.kc, k.kd, k.bt_id, public._khtn_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._khtn_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- Vật lý (12/11): như KHTN
  k_vatly as (
    select k.kc, k.kd, k.bt_id, public._vatly_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._vatly_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- Hóa học (12/11): như KHTN
  k_hoahoc as (
    select k.kc, k.kd, k.bt_id, public._hoahoc_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._hoahoc_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- ĐẠI + HGT: dạng bài bản đồ mới (cấp 1 cũng theo bản đồ mới)
  dcap as (
    select k.kc, k.kd, k.bt_id, public._do_o_bdm_core(nullif(k.kc, ''), nullif(k.kd, ''), false) as o
      from k
     where (k.kc <> '' or k.kd <> '')
       and not exists (select 1 from hcap where hcap.kc = k.kc and hcap.kd = k.kd and hcap.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from k_vatly z where z.kc = k.kc and z.kd = k.kd and z.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from k_hoahoc z where z.kc = k.kc and z.kd = k.kd and z.bt_id is not distinct from k.bt_id)
  ),
  cap as (
    select dcap.kc, dcap.kd, dcap.bt_id, db.id as dang_bai_id, n.id as nhom_id, n.chuyen_de_id, n.chu_de_id, db.ten as ten_dang
      from dcap join dai_bdm_dang_bai db on db.id = dcap.o join dai_bdm_nhom n on n.id = db.nhom_id
    union all
    select kk.kc, kk.kd, kk.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id
    union all
    select z.kc, z.kd, z.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from k_vatly z join vatly_bdm_dang_bai db on db.id = z.o join vatly_bdm_nhom n on n.id = db.nhom_id
    union all
    select z.kc, z.kd, z.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from k_hoahoc z join hoahoc_bdm_dang_bai db on db.id = z.o join hoahoc_bdm_nhom n on n.id = db.nhom_id
    union all
    select kc, kd, bt_id, null, nhom_id, chuyen_de_id, chu_de_id, ten_dang from hcap
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri,
         cap.dang_bai_id, cap.nhom_id, cap.chuyen_de_id, cap.chu_de_id, cap.ten_dang
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '') and cap.bt_id is not distinct from m.bt_id
   where p_tu is null or m.ngay >= p_tu
$function$
;
-- _tl_bdm_cau_vi_tri
CREATE OR REPLACE FUNCTION public._tl_bdm_cau_vi_tri(p_khoi text, p_mon text)
 RETURNS TABLE(ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  if p_mon = 'Toán' then
    return query select * from _tl_bdm_cau_vi_tri(p_khoi);
    return;
  end if;
  if p_mon = 'KHTN' then
    return query
    with nh as materialized (
      select n.id, n.ma_cu from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from khtn_bdm_gan_cau g
      join khtn_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join khtn_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from khtn_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  if p_mon = 'Vật lý' then
    return query
    with nh as materialized (
      select n.id, n.ma_cu from vatly_bdm_nhom n join vatly_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from vatly_bdm_gan_cau g
      join vatly_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join vatly_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from vatly_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from vatly_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  if p_mon = 'Hóa học' then
    return query
    with nh as materialized (
      select n.id, n.ma_cu from hoahoc_bdm_nhom n join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from hoahoc_bdm_gan_cau g
      join hoahoc_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join hoahoc_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from hoahoc_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from hoahoc_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  raise exception 'Môn % chưa có bản đồ mới cho giáo trình / ET.', p_mon using errcode = 'P0001';
end $function$
;
-- fn_tl_bdm_et_vi_tri
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_vi_tri(p_khoi text, p_ma text[])
 RETURNS TABLE(ma_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE sql
 STABLE
AS $function$
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi) x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m) and not exists (select 1 from vatly_cau_hoi k where k.ma_cau = m) and not exists (select 1 from hoahoc_cau_hoi k where k.ma_cau = m))
  union all
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'KHTN') x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from khtn_cau_hoi k where k.ma_cau = any (p_ma))
  union all
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'Vật lý') x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from vatly_cau_hoi k where k.ma_cau = any (p_ma))
  union all
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'Hóa học') x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from hoahoc_cau_hoi k where k.ma_cau = any (p_ma))
$function$
;
-- fn_tl_bdm_cay_chon
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_cay_chon(p_khoi text, p_nhanh text DEFAULT 'toan'::text)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
  with m as materialized (select case when p_nhanh = 'khtn' then 'KHTN' when p_nhanh = 'vatly' then 'Vật lý' when p_nhanh = 'hoahoc' then 'Hóa học' else 'Toán' end as mon),
  -- 11/11: số câu đọc BẢN LƯU _tl_bdm_dem (≤ 5 phút), không đếm lại cả kho khối mỗi lần mở bộ chọn
  dm as materialized (select * from _tl_bdm_dem(p_khoi, (select m.mon from m)))
  select jsonb_build_object('chu_de', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', cd.id, 'ten', cd.ten,
      'chuyen_de', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ch.id, 'ten', ch.ten, 'so', o.so,
          'nhom', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'so', n.so,
              'co_ly_thuyet', (btrim(coalesce(n.ly_thuyet, '')) <> '' or n.ly_thuyet_file_url is not null),
              'so_cau_chua_phan', coalesce(((select dm.dem_cp from dm)->>n.id)::bigint, 0),
              'dang_bai', coalesce((
                select jsonb_agg(jsonb_build_object(
                  'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'so', d.so,
                  'co_ly_thuyet', (btrim(coalesce(d.ly_thuyet, '')) <> '' or d.ly_thuyet_file_url is not null),
                  'co_vi_du', (btrim(coalesce(d.vi_du, '')) <> '' or d.vi_du_file_url is not null),
                  'so_cau', coalesce(((select dm.dem_db from dm)->>d.id)::bigint, 0)
                ) order by d.so)
                from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) as so
                        from tl_bdm_dang_bai_v d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
            ) order by n.so)
            from (select n0.*, (row_number() over (order by n0.thu_tu, n0.id))::integer as so
                    from tl_bdm_nhom_v n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
        ) order by o.so)
        from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) as so
                from tl_bdm_o_v o0 where o0.chu_de_id = cd.id) o
        join tl_bdm_chuyen_de_v ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
    ) order by cd.thu_tu, cd.id)
    from tl_bdm_chu_de_v cd where cd.mon = (select m.mon from m) and cd.khoi = p_khoi and cd.nhanh = p_nhanh), '[]'::jsonb))
$function$
;
-- fn_tl_bdm_et_ma_de
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_loai text; v_goc text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
  v_used text[] := array(select e->>'ma_cau' from jsonb_array_elements(p_base) e);   -- đề 2/3 khác MỌI câu gốc khi còn đủ câu
  v_made jsonb := '{}'; v_form jsonb := '{}';
begin
  create temp table if not exists _et_vt3 (ma_cau text, cum text, dang_bai_id text, la_goc boolean, loai_cau text, goc text) on commit drop;   -- tên mới: thêm loai_cau (bảng tạm cũ cùng phiên có khuôn khác)
  truncate _et_vt3;
  -- chỉ tính vị trí câu của MÔN có dạng bài trong đề (Toán · KHTN — registry tl_bdm_dang_bai_v)
  insert into _et_vt3 select x.ma_cau, x.cum, x.dang_bai_id, x.la_goc, x.loai_cau
    from (select distinct v.mon from tl_bdm_dang_bai_v v where v.id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)) m
    cross join lateral _tl_bdm_cau_vi_tri(p_khoi, m.mon) x
   where x.dang_bai_id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e);
  -- Hình học: dạng bài = bài học (mã HH…), cả bài là 1 "cụm" (không còn cụm Hình học)
  insert into _et_vt3 select h.ma_cau, h.dang_chinh, h.dang_chinh, h.parent_ma_cau is null, h.loai_cau
    from hinh_hoc_cau_hoi h
   where h.dang_chinh in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)
     and h.ma_cau in (select x.ma_cau from _tl_hh_cau_chuan(h.dang_chinh) x);
  update _et_vt3 v set goc = coalesce(k.parent_ma_cau, k.ma_cau) from (
    select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from vatly_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hoahoc_cau_hoi where ma_cau in (select ma_cau from _et_vt3)) k
   where k.ma_cau = v.ma_cau;
  for b in select e->>'ma_cau' as ma, e->>'dang_bai' as db, coalesce(e->>'form', 'tra_loi_ngan') as form, o
             from jsonb_array_elements(p_base) with ordinality as t(e, o) order by o loop
    select v.loai_cau into v_loai from _et_vt3 v where v.ma_cau = b.ma;
    -- gốc của câu đề 1 (câu gốc ⇒ chính nó; câu clone ⇒ parent) — đọc thẳng kho, kể cả khi câu đề 1 không còn kho chuẩn
    v_goc := coalesce((select coalesce(x.parent_ma_cau, x.ma_cau) from (
               select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from vatly_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hoahoc_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);
    -- ⭐⭐ Thùy 04/11 "nếu có câu clone thì phải chọn câu clone": ưu tiên SỐ 1 = câu cùng GỐC (clone của câu đề 1, hoặc gốc + clone
    --   anh em khi câu đề 1 là clone), rồi cùng loại câu → câu gốc khác cùng dạng bài. Thùy 04/11 "làm gì còn khái niệm cụm nữa?" ⇒ bỏ bậc cụm.
    -- ⭐ Thùy 04/11 "đề 2 3 bị giống đề 1": ứng viên = cùng DẠNG BÀI + in được cùng form; cùng cụm / cùng loại câu chỉ là ƯU TIÊN.
    --   Trước: lọc cứng cùng cụm ⇒ câu không cụm (câu nhập từ đề thi: cụm = chính nó) chỉ có chính nó ⇒ 52% câu ET bản đồ mới đề 2/3 = đề 1,
    --   dù dạng bài còn 2–84 câu. Dạng bài là đơn vị đo (KP) của bản đồ mới ⇒ câu cùng dạng bài là biến thể hợp lệ.
    -- (cũ) ứng viên = cùng dạng bài + cùng cụm + in được cùng form (TN: có phương án / mệnh đề / form TN đã duyệt; form khác: không phải Đ/S)
    v_cands := array(
      select v.ma_cau from _et_vt3 v
        join lateral (
          select to_jsonb(c.lua_chon) lc, to_jsonb(c.menh_de) md, exists (select 1 from dai_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet) tn
            from dai_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hgt_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet)
            from hgt_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from hinh_hoc_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from khtn_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from khtn_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from vatly_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from vatly_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hoahoc_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from hoahoc_cau_hoi c where c.ma_cau = v.ma_cau
        ) c on true
       where v.dang_bai_id = b.db
         and case when b.form = 'trac_nghiem'
                  then jsonb_array_length(coalesce(c.lc, '[]'::jsonb)) > 0 or jsonb_array_length(coalesce(c.md, '[]'::jsonb)) > 0 or c.tn
                  else jsonb_array_length(coalesce(c.md, '[]'::jsonb)) = 0 end
       order by (v.ma_cau = b.ma), (v.goc is distinct from v_goc), (v.loai_cau is distinct from v_loai), (not v.la_goc), v.ma_cau);
    v_picks := '{}';
    for i in 1..2 loop
      select x into v_fresh from unnest(v_cands) x where not (x = any (v_used)) limit 1;
      if v_fresh is not null then
        v_used := v_used || v_fresh; v_picks := v_picks || v_fresh;
        v_form := v_form || jsonb_build_object(v_fresh, b.form);
      else
        -- dạng bài hết câu chưa dùng (cùng form) ⇒ cho trùng TRONG dạng bài (khác đề 2 nếu được), rồi câu gốc — không nhảy dạng bài, không để trống
        v_dup := coalesce((select x from unnest(v_cands) x where not (x = any (v_picks)) limit 1), v_cands[1], b.ma);
        v_picks := v_picks || v_dup;
        v_form := v_form || jsonb_build_object(v_dup, b.form);
      end if;
    end loop;
    v_made := v_made || jsonb_build_object(b.ma, to_jsonb(v_picks));
  end loop;
  return jsonb_build_object('etMaDe', v_made, 'etFormByCau', v_form);
end $function$
;
-- view tl_bdm_chu_de_v
create or replace view public.tl_bdm_chu_de_v as
 SELECT 'Toán'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    c.nhanh
   FROM dai_bdm_chu_de c
UNION ALL
 SELECT 'KHTN'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    'khtn'::text AS nhanh
   FROM khtn_bdm_chu_de c
UNION ALL
 SELECT 'Vật lý'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    'vatly'::text AS nhanh
   FROM vatly_bdm_chu_de c
UNION ALL
 SELECT 'Hóa học'::text AS mon,
    c.id,
    c.khoi,
    c.ten,
    c.thu_tu,
    'hoahoc'::text AS nhanh
   FROM hoahoc_bdm_chu_de c;
-- view tl_bdm_chuyen_de_v
create or replace view public.tl_bdm_chuyen_de_v as
 SELECT 'Toán'::text AS mon,
    c.id,
    c.ten
   FROM dai_bdm_chuyen_de c
UNION ALL
 SELECT 'KHTN'::text AS mon,
    c.id,
    c.ten
   FROM khtn_bdm_chuyen_de c
UNION ALL
 SELECT 'Vật lý'::text AS mon,
    c.id,
    c.ten
   FROM vatly_bdm_chuyen_de c
UNION ALL
 SELECT 'Hóa học'::text AS mon,
    c.id,
    c.ten
   FROM hoahoc_bdm_chuyen_de c;
-- view tl_bdm_dang_bai_v
create or replace view public.tl_bdm_dang_bai_v as
 SELECT 'Toán'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM dai_bdm_dang_bai d
UNION ALL
 SELECT 'KHTN'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM khtn_bdm_dang_bai d
UNION ALL
 SELECT 'Vật lý'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM vatly_bdm_dang_bai d
UNION ALL
 SELECT 'Hóa học'::text AS mon,
    d.id,
    d.nhom_id,
    d.ten,
    d.mo_ta,
    d.ly_thuyet,
    d.ly_thuyet_file_url,
    d.vi_du,
    d.vi_du_file_url,
    d.thu_tu
   FROM hoahoc_bdm_dang_bai d;
-- view tl_bdm_nhom_v
create or replace view public.tl_bdm_nhom_v as
 SELECT 'Toán'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM dai_bdm_nhom n
UNION ALL
 SELECT 'KHTN'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM khtn_bdm_nhom n
UNION ALL
 SELECT 'Vật lý'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM vatly_bdm_nhom n
UNION ALL
 SELECT 'Hóa học'::text AS mon,
    n.id,
    n.chu_de_id,
    n.chuyen_de_id,
    n.ten,
    n.mo_ta,
    n.ly_thuyet,
    n.ly_thuyet_file_url,
    n.thu_tu
   FROM hoahoc_bdm_nhom n;
-- view tl_bdm_o_v
create or replace view public.tl_bdm_o_v as
 SELECT 'Toán'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM dai_bdm_o o
UNION ALL
 SELECT 'KHTN'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM khtn_bdm_o o
UNION ALL
 SELECT 'Vật lý'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM vatly_bdm_o o
UNION ALL
 SELECT 'Hóa học'::text AS mon,
    o.chu_de_id,
    o.chuyen_de_id,
    o.thu_tu
   FROM hoahoc_bdm_o o;
-- fn_mt_bang_ket_qua
CREATE OR REPLACE FUNCTION public.fn_mt_bang_ket_qua(p_de uuid, p_cap text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with buoi as (
    select distinct b.id, l.id as lop_id, l.ten_lop
      from tai_lieu t
      join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
     where t.loai = 'mt_buoi' and t.nguon_id = p_de
    union
    -- kỳ khảo sát chung của đề (không thuộc lớp)
    select b.id, null::uuid, null::text from buoi_hoc b where b.loai = 'khao_sat' and b.de_id = p_de and b.trang_thai <> 'huy'
  ),
  bd as (
    select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from dai_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from vatly_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from hoahoc_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from hgt_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from bdm_ban_do where ma_dang like 'NDB%'  -- bản đồ mới (24/10)
    -- Hình học: không có chủ đề cũ ⇒ chủ đề mới (dai_bdm_chu_de) nếu đã gắn, chưa gắn thì gom "Hình học".
    union all select hb.ma_dang, hb.ma_chuyen_de, hb.ten_chuyen_de, coalesce(hb.chu_de_id, 'HINH'), coalesce(cdm.ten, 'Hình học')
      from hinh_hoc_bai hb left join dai_bdm_chu_de cdm on cdm.id = hb.chu_de_id
  ),
  cu as (select x.* from buoi, lateral _mt_o_bai_cu(buoi.id) x),
  o0 as (
    select s.id, s.buoi_hoc_id, s.problem_no, s.diem_toi_da, cu.k as bai_k, cu.tong as bai_tong,
           bd1.ma_chuyen_de, bd1.ten_chuyen_de, bd1.ma_chu_de, bd1.ten_chu_de,
           mh.id as mh_id, mh.ma as mh_ma, mh.chu_de_id as mh_chu_de, cdm2.ten as mh_ten_chu_de,
           btrim(regexp_replace(mh.ten, '\s*\mtest\M\s*', ' ', 'gi')) as mh_ten
      from buoi
      join gami_session_problems s on s.buoi_hoc_id = buoi.id and s.phase = 'mt' and not s.ngoai_de
      left join lateral (select bd.ma_chuyen_de, bd.ten_chuyen_de, bd.ma_chu_de, bd.ten_chu_de from bd where bd.ma_dang = coalesce(case when public._mastery_bdm_bat() then public._do_o_bdm(s.ma_cau, s.ma_dang) end, s.ma_dang) limit 1) bd1 on s.hinh_baitoan_id is null and s.hinh_y_id is null  -- bật công tắc ⇒ câu → dạng bài mới (cùng đường mastery); chưa quy được thì bản đồ cũ
      left join hinh_baitoan bt on bt.id = s.hinh_baitoan_id
      left join hinh_y hy on bt.id is null and hy.id = s.hinh_y_id   -- ô ý bài kho chưa gắn node ⇒ mô hình của cả bài kho (29/10)
      left join hinh_bai hbk on hbk.id = hy.bai_id
      left join hinh_mo_hinh mh on mh.id = coalesce(bt.mo_hinh_id, hbk.mo_hinh_id)
      left join dai_bdm_chu_de cdm2 on cdm2.id = mh.chu_de_id
      left join cu on cu.id = s.id
  ),
  o as (
    select o0.id, o0.buoi_hoc_id, o0.problem_no, o0.diem_toi_da, o0.bai_k, o0.bai_tong,
           case when p_cap = 'chu_de'
                then coalesce(o0.ma_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_chu_de, 'HINH') end, 'KHAC')
                else coalesce(o0.ma_chuyen_de, case when o0.mh_id is not null then 'MH:' || o0.mh_ma end, 'KHAC') end as cd,
           case when p_cap = 'chu_de'
                then coalesce(o0.ten_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_ten_chu_de, 'Hình học') end, 'Chưa gán chủ đề')
                else coalesce(o0.ten_chuyen_de,
                              case when o0.mh_id is not null then
                                case when coalesce(o0.mh_ten, '') = '' then 'Hình học'
                                     when o0.mh_ten ilike 'hình%' then o0.mh_ten
                                     else 'Hình: ' || o0.mh_ten end end,
                              'Chưa gán chuyên đề') end as ten,
           -- luật CEO 23/10: chỉ CHỦ ĐỀ "Các mô hình … nâng cao" ⇒ Nâng cao (không xét tên chuyên đề)
           coalesce(o0.ten_chu_de, o0.mh_ten_chu_de, '') ilike 'các mô hình%nâng cao%' as nc
      from o0
  ),
  g as (select o.*, gr.hoc_sinh_id, gr.diem_dat from o join gami_grades gr on gr.problem_id = o.id),
  don_vi as (
    select g.hoc_sinh_id, g.cd, g.diem_dat as dat, g.diem_toi_da as toi_da
      from g where g.diem_toi_da is not null and g.diem_dat is not null
    union all
    select g.hoc_sinh_id, g.cd, sum(g.diem_dat), max(g.bai_tong)
      from g where g.bai_tong is not null
     group by g.hoc_sinh_id, g.cd, g.buoi_hoc_id, g.bai_k
    having count(g.diem_dat) = (select count(*) from o o2 where o2.buoi_hoc_id = g.buoi_hoc_id and o2.bai_k = g.bai_k and o2.bai_tong is not null)
  ),
  pct as (
    select hoc_sinh_id, cd, round(100 * sum(dat) / sum(toi_da)) as p
      from don_vi group by hoc_sinh_id, cd having sum(toi_da) > 0
  ),
  hs as (
    -- lớp của em: lớp của buổi (MT) — kỳ khảo sát chung thì lớp hiện tại của em trong môn của đề
    select distinct on (g.hoc_sinh_id) g.hoc_sinh_id, coalesce(buoi.lop_id, lh.id) as lop_id, coalesce(buoi.ten_lop, lh.ten_lop) as ten_lop
      from g join buoi on buoi.id = g.buoi_hoc_id
      left join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.hoc_sinh_id = g.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                            and l.mon = (select mon from tai_lieu where id = p_de)
                          order by hl.ngay_vao desc nulls last limit 1) lh on buoi.lop_id is null
     order by g.hoc_sinh_id, buoi.lop_id nulls last, buoi.ten_lop
  ),
  diem as (
    select dt.hoc_sinh_id, round(avg(dt.diem), 2) as diem
      from diem_thi dt join ky_thi k on k.id = dt.ky_thi_id and k.loai in ('mt_sat_hach', 'khao_sat_thang')
     where k.buoi_hoc_id in (select id from buoi) and dt.diem is not null
     group by dt.hoc_sinh_id
  ),
  xep as (
    select hs.*, x.ho_ten, d.diem,
           case when d.diem is not null then rank() over (order by d.diem desc nulls last) end as hang
      from hs join hoc_sinh x on x.id = hs.hoc_sinh_id left join diem d on d.hoc_sinh_id = hs.hoc_sinh_id
  ),
  cot as (select cd, min(ten) as ten, min(problem_no) as tt, bool_or(nc) as nc from o group by cd)
  select jsonb_build_object(
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', cd, 'ten', ten, 'nang_cao', nc) order by nc, tt, ten) from cot), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', xe.hoc_sinh_id, 'ten', xe.ho_ten, 'lop_id', xe.lop_id, 'lop', xe.ten_lop, 'diem', xe.diem, 'hang', xe.hang,
              'o', coalesce((select jsonb_object_agg(p.cd, p.p) from pct p where p.hoc_sinh_id = xe.hoc_sinh_id), '{}'::jsonb))
            order by xe.hang nulls last, xe.ho_ten) from xep xe), '[]'::jsonb),
    'so_co_diem', (select count(*) from diem)
  )
$function$
;
-- fn_bc_ky_tinh
CREATE OR REPLACE FUNCTION public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
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
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, vatly_cd.ten, hoahoc_cd.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, vatly_cd.thu_tu, hoahoc_cd.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join vatly_bdm_chu_de vatly_cd on vatly_cd.id = dv.ma
      left join hoahoc_bdm_chu_de hoahoc_cd on hoahoc_cd.id = dv.ma
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
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, vatly_ch.ten, hoahoc_ch.ten, hmh.ten, nmh.ten, dch.ten, dv.ma) as ten,
           coalesce(ko.thu_tu, vatly_o.thu_tu, hoahoc_o.thu_tu, hmh.thu_tu, nmh.thu_tu, dbo.thu_tu, 9999) as tt
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join vatly_bdm_chuyen_de vatly_ch on vatly_ch.id = dv.ma
      left join hoahoc_bdm_chuyen_de hoahoc_ch on hoahoc_ch.id = dv.ma
      left join hinh_mo_hinh hmh on dv.ma like 'H:%' and hmh.id::text = substr(dv.ma, 3)      -- 09/11: chuyên đề Hình = mô hình (§13.6)
      left join hinh_nhom_mo_hinh nmh on dv.ma like 'H:%' and nmh.id::text = substr(dv.ma, 3)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join vatly_bdm_o vatly_o on vatly_o.chuyen_de_id = dv.ma and vatly_o.chu_de_id = dv.chu_de
      left join hoahoc_bdm_o hoahoc_o on hoahoc_o.chuyen_de_id = dv.ma and hoahoc_o.chu_de_id = dv.chu_de
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
    -- PHẦN 4 — GV nhập: KHÔNG ở đây — ghép bằng _bc_ky_phan_gv lúc trả (mig 202611051704, để số liệu chốt dùng chung)
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
  return v_out || public._bc_ky_phan_gv(p_hs, p_mon, p_ky, v_out -> 'goi_y');
end
$function$
;
-- _btvn_app_tu_dong
CREATE OR REPLACE FUNCTION public._btvn_app_tu_dong()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; h record;
  v_dong int := 0; v_tre int := 0; v_hs int := 0; v_rut int := 0; v_n int; v_doi boolean;
  v_ly_do constant text := 'Máy tự rút (Thùy 04/11): BTVN app cấp 3 tự đóng đúng giờ hết hạn — TA không cần đóng';
begin
  for r in
    select b.id, b.lop_id, b.ngay, b.btvn_dong_at, t.id as test_id, t.deadline,
           greatest(t.so_cau, (select count(distinct c.thu_tu) from bai_test_cau c where c.bai_test_id = t.id))::int as so_cau
      from buoi_hoc b
      join lop l on l.id = b.lop_id and l.khoi in ('10', '11', '12')       -- cấp 3
      join lateral (select bt.* from bai_test bt
                     where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'btvn' and bt.hoc_sinh_id is null
                     order by bt.created_at desc limit 1) t on true
     where b.loai = 'thuong' and b.trang_thai <> 'huy'
       and t.deadline is not null and t.deadline <= now()
       -- chưa đóng · hoặc MÁY đã đóng (giờ đóng = đúng giờ hạn). Buổi TA tự đóng ⇒ giữ nguyên quyết định của TA, không nhận bài muộn tự động.
       and (b.btvn_dong_at is null or b.btvn_dong_at = t.deadline)
       and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date - 30
       -- có bài nộp ẢNH ⇒ TA phải chấm ảnh, để TA đóng như cũ
       and not exists (select 1 from btvn_nop n where n.buoi_hoc_id = b.id)
       -- chưa em nào làm trên app ⇒ nhiều khả năng lớp làm GIẤY, không tự gán "Không làm bài" cho cả lớp
       and exists (select 1 from bai_lam bl join bai_lam_cau x on x.bai_lam_id = bl.id
                    where bl.bai_test_id = t.id and x.dap_an_hs is not null)
  loop
    -- ⓪ Buổi CHƯA có lưới chấm BTVN (lưới vốn chỉ dựng khi TA mở tab chấm) ⇒ dựng như màn chấm (syncDocProblems: chưa có ô nào ⇒
    --    mỗi câu 1 ô, gắn ma_cau + dạng = dạng bài bản đồ mới nếu có, không thì dang_chinh). Câu lấy từ BÀI APP (biến thể 1 theo thứ tự),
    --    vốn sinh từ phiếu BTVN của buổi. Đã có ô ⇒ không đụng (lưới bám phiếu là việc của màn chấm).
    if not exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = r.id and sp.phase = 'btvn') then
      insert into gami_session_problems (buoi_hoc_id, phase, problem_no, ma_cau, ma_dang)
      select r.id, 'btvn', (row_number() over (order by x.thu_tu))::int, x.ma_cau,
             coalesce((select d.ma_dang from fn_bdm_dang_cua_cau(array[x.ma_cau]) d limit 1),
                      (select k.dang_chinh from (select q.dang_chinh from dai_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hgt_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from khtn_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from vatly_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hoahoc_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hinh_hoc_cau_hoi q where q.ma_cau = x.ma_cau) k limit 1))
        from (select distinct on (bc.thu_tu) bc.thu_tu, bc.ma_cau from bai_test_cau bc
               where bc.bai_test_id = r.test_id and bc.bien_the = 1 and bc.ma_cau is not null order by bc.thu_tu) x
      on conflict (buoi_hoc_id, phase, problem_no) do nothing;
    end if;

    -- ① Đổ kết quả app vào lưới (kể cả khi đã đóng — bài làm sau hạn vẫn vào, tính nộp muộn) + trạng thái của em làm HẾT
    perform public._btvn_online_dong_bo_core(r.id, true);
    v_doi := false;

    -- ② Trạng thái nộp + thái độ của em CÓ MẶT (hoặc có bài làm) theo bài làm app — chỉ điền chỗ còn TRỐNG,
    --    và nâng "Không làm bài" → nộp khi em làm sau đó (Thùy 04/11: "vẫn cho làm, nhưng tính là nộp muộn").
    for h in
      with hs as (
        select x.hoc_sinh_id from buoi_hoc_hs x where x.buoi_hoc_id = r.id and x.diem_danh = 'co_mat'
        union
        select bl.hoc_sinh_id from bai_lam bl
         where bl.bai_test_id = r.test_id
           and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = r.id and x.hoc_sinh_id = bl.hoc_sinh_id)
      ),
      lam as (
        select bl.hoc_sinh_id,
               count(distinct bc.thu_tu) filter (where x.dap_an_hs is not null) as da_tra_loi,
               min(x.cham_at) filter (where x.dap_an_hs is not null) as luc_dau
          from bai_lam bl
          join bai_lam_cau x on x.bai_lam_id = bl.id
          join bai_test_cau bc on bc.id = x.bai_test_cau_id
         where bl.bai_test_id = r.test_id
         group by bl.hoc_sinh_id
      )
      select hs.hoc_sinh_id, coalesce(lam.da_tra_loi, 0)::int as da_tra_loi, lam.luc_dau,
             k.trang_thai_nop, k.thai_do
        from hs
        left join lam on lam.hoc_sinh_id = hs.hoc_sinh_id
        left join btvn_ket_qua k on k.buoi_hoc_id = r.id and k.hoc_sinh_id = hs.hoc_sinh_id
    loop
      if h.da_tra_loi = 0 then
        -- bỏ trống ⇒ Không làm bài (chỉ khi BTVN chưa đóng — sau khi đóng, ô trống đã được chốt lúc hết hạn)
        if r.btvn_dong_at is null and h.trang_thai_nop is null then
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
          values (r.id, h.hoc_sinh_id, 'khong_lam', now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update set trang_thai_nop = 'khong_lam', updated_at = now()
            where btvn_ket_qua.trang_thai_nop is null;
          v_hs := v_hs + 1; v_doi := true;
        end if;
      else
        -- có trả lời ⇒ có làm: trước hạn = đúng hạn · sau hạn = nộp muộn. Đè được ô trống hoặc "Không làm bài".
        if h.trang_thai_nop is null or (h.trang_thai_nop = 'khong_lam' and r.btvn_dong_at is not null) then   -- 'Không làm bài' chỉ do máy chốt lúc hết hạn mới được nâng
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
          values (r.id, h.hoc_sinh_id, case when h.luc_dau > r.deadline then 'nop_muon' else 'nop_dung_han' end, now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update
            set trang_thai_nop = excluded.trang_thai_nop, updated_at = now()
            where btvn_ket_qua.trang_thai_nop is null or (btvn_ket_qua.trang_thai_nop = 'khong_lam' and r.btvn_dong_at is not null);
          v_hs := v_hs + 1; v_doi := true;
          if r.btvn_dong_at is not null then v_tre := v_tre + 1; end if;
        end if;
        -- không điền đủ đáp án ⇒ thái độ "Chưa nghiêm túc" (chỉ khi thái độ còn trống — không đè TA)
        if h.da_tra_loi < r.so_cau and h.thai_do is null then
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, thai_do, updated_at)
          values (r.id, h.hoc_sinh_id, 'chua_nghiem_tuc', now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update set thai_do = 'chua_nghiem_tuc', updated_at = now()
            where btvn_ket_qua.thai_do is null;
          v_doi := true;
        end if;
      end if;
    end loop;

    if r.btvn_dong_at is null then
      -- ③ Đóng y đường TA bấm (EXP tháng + hoàn tất + trả bài), rồi ghi giờ đóng = ĐÚNG giờ hết hạn (không ai bị tính trễ).
      perform public.fn_dong_btvn(r.id);
      update buoi_hoc set btvn_dong_at = r.deadline where id = r.id and btvn_dong_at is distinct from r.deadline;
      v_dong := v_dong + 1;
      update gay_de_xuat set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null, ly_do_bo_qua = v_ly_do
       where trang_thai = 'cho' and nguon = 'vanhanh' and ref_key like 'vh:' || r.id::text || '|btvn|%';
      get diagnostics v_n = row_count; v_rut := v_rut + v_n;
    elsif v_doi then
      -- đã đóng mà trạng thái đổi (bài nộp muộn) ⇒ EXP tháng tính lại (EXP BTVN đọc trạng thái nộp)
      perform public.fn_recompute_exp_thang(r.lop_id, to_char(r.ngay, 'YYYY-MM'));
    end if;
  end loop;
  return jsonb_build_object('dong', v_dong, 'hs_ghi', v_hs, 'nop_muon_sau_dong', v_tre, 'rut_gay', v_rut);
end $function$
;
-- fn_btvn_ai_du_lieu
CREATE OR REPLACE FUNCTION public.fn_btvn_ai_du_lieu(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select jsonb_build_object(
    'lop', l.ten_lop, 'khoi', l.khoi, 'mon', l.mon, 'ngay', b.ngay,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'problem_id', sp.id, 'so', sp.problem_no, 'ma_cau', sp.ma_cau, 'ma_dang', sp.ma_dang,
        'hinh', sp.hinh_baitoan_id is not null, 'hinh_nhan', sp.hinh_nhan,
        'loai_cau', coalesce(d.loai_cau, k.loai_cau, vatly.loai_cau, hoahoc.loai_cau),
        'de_bai', coalesce(d.noi_dung, k.noi_dung, vatly.noi_dung, hoahoc.noi_dung),
        'lua_chon', coalesce(d.lua_chon, k.lua_chon, vatly.lua_chon, hoahoc.lua_chon),
        'menh_de', coalesce(d.menh_de, k.menh_de, vatly.menh_de, hoahoc.menh_de),
        'dap_an', coalesce(d.dap_an, k.dap_an, vatly.dap_an, hoahoc.dap_an),
        'loi_giai', coalesce(d.loi_giai, k.loi_giai, vatly.loi_giai, hoahoc.loi_giai)) order by sp.problem_no)
      from gami_session_problems sp
      left join dai_cau_hoi d on l.mon = 'Toán' and d.ma_cau = sp.ma_cau
      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau
      left join vatly_cau_hoi vatly on l.mon = 'Vật lý' and vatly.ma_cau = sp.ma_cau
      left join hoahoc_cau_hoi hoahoc on l.mon = 'Hóa học' and hoahoc.ma_cau = sp.ma_cau
      where sp.buoi_hoc_id = b.id and sp.phase = 'btvn' and not sp.ngoai_de), '[]'::jsonb),
    'anh', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'path', a.path, 'xoay', a.xoay) order by a.thu_tu, a.created_at)
      from btvn_nop_anh a where a.buoi_hoc_id = b.id and a.hoc_sinh_id = p_hoc_sinh_id and a.bo_at is null), '[]'::jsonb))
  into v
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.id = p_buoi_hoc_id;
  if v is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  return v;
end $function$
;
-- view v_btvn_dap_an
create or replace view public.v_btvn_dap_an as
 SELECT n.hoc_sinh_id,
    n.buoi_hoc_id,
    sp.problem_no,
    sp.ma_dang,
    sp.ma_cau,
    COALESCE(d.loai_cau, kk.loai_cau, vatly.loai_cau, hoahoc.loai_cau) AS loai_cau,
    COALESCE(d.noi_dung, kk.noi_dung, vatly.noi_dung, hoahoc.noi_dung) AS de_bai,
    COALESCE(d.lua_chon, kk.lua_chon, vatly.lua_chon, hoahoc.lua_chon) AS lua_chon,
    COALESCE(d.menh_de, kk.menh_de, vatly.menh_de, hoahoc.menh_de) AS menh_de,
    COALESCE(d.dap_an, kk.dap_an, vatly.dap_an, hoahoc.dap_an) AS dap_an,
    COALESCE(d.loi_giai, kk.loi_giai, vatly.loi_giai, hoahoc.loi_giai) AS loi_giai,
    COALESCE(d.anh_de, kk.anh_de, vatly.anh_de, hoahoc.anh_de) AS anh_de,
    COALESCE(d.anh_dap_an, kk.anh_dap_an, vatly.anh_dap_an, hoahoc.anh_dap_an) AS anh_dap_an
   FROM btvn_nop n
     JOIN buoi_hoc b ON b.id = n.buoi_hoc_id
     LEFT JOIN lop l ON l.id = b.lop_id
     JOIN gami_session_problems sp ON sp.buoi_hoc_id = n.buoi_hoc_id AND sp.phase = 'btvn'::text AND sp.ma_cau IS NOT NULL
     LEFT JOIN dai_cau_hoi d ON l.mon = 'Toán'::text AND d.ma_cau = sp.ma_cau
     LEFT JOIN khtn_cau_hoi kk ON l.mon = 'KHTN'::text AND kk.ma_cau = sp.ma_cau
     LEFT JOIN vatly_cau_hoi vatly ON l.mon = 'Vật lý'::text AND vatly.ma_cau = sp.ma_cau
     LEFT JOIN hoahoc_cau_hoi hoahoc ON l.mon = 'Hóa học'::text AND hoahoc.ma_cau = sp.ma_cau
  WHERE n.tra_at IS NOT NULL;
-- _dtv_giay_thap
CREATE OR REPLACE FUNCTION public._dtv_giay_thap(p_mon text)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
AS $function$ select case p_mon when 'Toán' then 40 when 'KHTN' then 25 when 'Vật lý' then 25 when 'Hóa học' then 25 else 10 end $function$
;
-- _kho_co_mon
CREATE OR REPLACE FUNCTION public._kho_co_mon(p_mon text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select p_mon in ('Toán', 'KHTN', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'TSA')
$function$
;
-- _phien_kho_mon
CREATE OR REPLACE FUNCTION public._phien_kho_mon()
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
AS $function$ select array['Toán', 'KHTN', 'Vật lý', 'Hóa học'] $function$
;
-- _phien_bdm_bang
CREATE OR REPLACE FUNCTION public._phien_bdm_bang(p_mon text)
 RETURNS TABLE(bang text, ham text, co_vung boolean)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select r.bang, r.ham, r.co_vung from (values
    ('Toán', 'dai_bdm_',  'fn_bdm_',      true),
    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false),
    ('Vật lý', 'vatly_bdm_', 'fn_vatly_bdm_', false),
    ('Hóa học', 'hoahoc_bdm_', 'fn_hoahoc_bdm_', false)
  ) r(mon, bang, ham, co_vung) where r.mon = p_mon
$function$
;
-- _phien_bd_kiem_khoi
CREATE OR REPLACE FUNCTION public._phien_bd_kiem_khoi(p_bang text, p_loai text, p_id text, p_khoi text)
 RETURNS void
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v text; v_ok boolean;
begin
  if nullif(trim(coalesce(p_id, '')), '') is null then raise exception 'Thiếu mã % .', p_loai; end if;
  v := public._phien_bd_khoi(p_bang, p_loai, p_id);
  if v is null then raise exception 'Không có % mã %.', p_loai, p_id; end if;
  if v = '*' then
    execute format('select coalesce(bool_and(public._truong_khoi_tro_len(%L, c.khoi)), false) from %I o join %I c on c.id = o.chu_de_id where o.chuyen_de_id = $1',
                   case when p_bang = 'khtn_bdm_' then 'KHTN' when p_bang = 'vatly_bdm_' then 'Vật lý' when p_bang = 'hoahoc_bdm_' then 'Hóa học' else 'Toán' end, p_bang || 'o', p_bang || 'chu_de') into v_ok using p_id;
    if not v_ok then raise exception 'Chuyên đề % dùng chung với khối bạn không quản — nhờ trưởng khối đó hoặc cấp trên.', p_id; end if;
    return;
  end if;
  if v <> p_khoi then raise exception '% % thuộc khối %, ngoài phạm vi phiên (khối %).', p_loai, p_id, v, p_khoi; end if;
end $function$
;
-- _phien_kho_nhanh_ds
CREATE OR REPLACE FUNCTION public._phien_kho_nhanh_ds()
 RETURNS TABLE(nhanh text, cau text, ban_do_cu text, gan text, de_xuat text, thieu text, kiem_mau text, vung text)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select * from (values
    ('dai', 'dai_cau_hoi', 'dai_ban_do', 'dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'dai_bdm_cau_thieu_dang', 'dai_bdm_kiem_mau', 'toan'),
    ('hgt', 'hgt_cau_hoi', 'hgt_ban_do', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', 'hgt_bdm_cau_thieu_dang', 'hgt_bdm_kiem_mau', 'hgt'),
    ('khtn', 'khtn_cau_hoi', 'khtn_ban_do', 'khtn_bdm_gan_cau', 'khtn_bdm_de_xuat', 'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn'),
    ('vatly', 'vatly_cau_hoi', 'vatly_ban_do', 'vatly_bdm_gan_cau', 'vatly_bdm_de_xuat', 'vatly_bdm_cau_thieu_dang', 'vatly_bdm_kiem_mau', 'vatly'),
    ('hoahoc', 'hoahoc_cau_hoi', 'hoahoc_ban_do', 'hoahoc_bdm_gan_cau', 'hoahoc_bdm_de_xuat', 'hoahoc_bdm_cau_thieu_dang', 'hoahoc_bdm_kiem_mau', 'hoahoc')
  ) r(nhanh, cau, ban_do_cu, gan, de_xuat, thieu, kiem_mau, vung)
$function$
;
-- _phien_kho_cau
CREATE OR REPLACE FUNCTION public._phien_kho_cau(p_p claude_phien, p_ma_cau text)
 RETURNS TABLE(tbl text, nhanh text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_q jsonb; v_khoi text;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    if (case r.nhanh when 'khtn' then 'KHTN' when 'vatly' then 'Vật lý' when 'hoahoc' then 'Hóa học' else 'Toán' end) <> p_p.mon then continue; end if;   -- 12/11: mỗi môn đúng bảng của môn
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    if v_q is not null then
      execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := r.cau; nhanh := r.nhanh; return next; return;
    end if;
  end loop;
  -- 07/11: kho Hình–Học (câu HHC…, dạng = bài học hinh_hoc_bai) — phiên Toán
  if p_p.mon = 'Toán' then
    select hb.khoi into v_khoi from hinh_hoc_cau_hoi c join hinh_hoc_bai hb on hb.ma_bai = c.dang_chinh where c.ma_cau = p_ma_cau;
    if found then
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := 'hinh_hoc_cau_hoi'; nhanh := 'hinh_hoc'; return next; return;
    end if;
  end if;
  raise exception 'Không có câu % trong kho % của phiên.', p_ma_cau, p_p.mon;
end $function$
;
-- _phien_kho_phan1
CREATE OR REPLACE FUNCTION public._phien_kho_phan1(p_p claude_phien, p_ma_cau text, p_ket_qua text, p_dang_bai text, p_ly_do text, p_chu_de text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; v_q jsonb; v_khoi text; v_gan_nguon text; v_gan_db text; v_mau boolean; v_cd text; v_ly text := btrim(coalesce(p_ly_do, '')); v_nguoi boolean;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    exit when v_q is not null;
  end loop;
  if v_q is null then raise exception 'Không có câu %.', p_ma_cau; end if;
  -- 05/11: KHTN nối vào cùng luồng — câu phải đúng môn của phiên (bảng khtn_* chỉ cho phiên KHTN).
  if (case r.nhanh when 'khtn' then 'KHTN' when 'vatly' then 'Vật lý' when 'hoahoc' then 'Hóa học' else 'Toán' end) <> p_p.mon then raise exception 'Câu % không thuộc môn % của phiên.', p_ma_cau, p_p.mon; end if;
  if v_q->>'xoa_at' is not null then raise exception 'Câu % đang ở kho rác.', p_ma_cau; end if;
  if v_q->>'parent_ma_cau' is not null then raise exception 'Câu % là bản sao của % — phân câu gốc, bản sao tự đi theo.', p_ma_cau, v_q->>'parent_ma_cau'; end if;
  if v_q->>'loai_cau' = 'dung_sai' then raise exception 'Câu % là Đúng/Sai — xếp theo chủ đề (đường riêng), không xếp theo dạng.', p_ma_cau; end if;
  execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
  if v_khoi is distinct from p_p.khoi then raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi; end if;

  execute format('select nguon, dang_bai_id from %I where ma_cau = $1', r.gan) into v_gan_nguon, v_gan_db using p_ma_cau;
  execute format('select exists (select 1 from %I where ma_cau = $1)', r.kiem_mau) into v_mau using p_ma_cau;
  if v_gan_nguon is not null and (v_gan_nguon <> 'ai' or v_mau) and coalesce(current_setting('phien.ghi_de', true), '') <> 'on' then
    raise exception 'Câu % đã được NGƯỜI quyết (gán dạng / kiểm mẫu) — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;
  -- 04/11 (Thùy: "thêm được, không được xoá"): dòng chờ duyệt / thiếu dạng do NGƯỜI nhập cũng là người đã quyết ⇒ Claude không đụng.
  execute format('select exists (select 1 from %I where ma_cau = $1 and nguon is distinct from ''ai'')
                      or exists (select 1 from %I where ma_cau = $1 and nguon is distinct from ''ai'')', r.de_xuat, r.thieu)
    into v_nguoi using p_ma_cau;
  if v_nguoi and coalesce(current_setting('phien.ghi_de', true), '') <> 'on' then
    raise exception 'Câu % đang có dòng chờ duyệt / thiếu dạng do NGƯỜI nhập — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;

  if p_ket_qua in ('cao', 'vua') and r.nhanh = 'khtn' then
    select cd.id into v_cd
      from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi;
    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ KHTN khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;
  elsif p_ket_qua in ('cao', 'vua') and r.nhanh = 'vatly' then
    select cd.id into v_cd
      from vatly_bdm_dang_bai d join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi;
    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ Vật lý khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;
  elsif p_ket_qua in ('cao', 'vua') and r.nhanh = 'hoahoc' then
    select cd.id into v_cd
      from hoahoc_bdm_dang_bai d join hoahoc_bdm_nhom n on n.id = d.nhom_id join hoahoc_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi;
    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ Hóa học khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;
  elsif p_ket_qua in ('cao', 'vua') then
    select cd.id into v_cd
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi and cd.nhanh = r.vung;
    if v_cd is null then raise exception 'Dạng bài % không thuộc vùng % của khối % (câu % là nhánh %).', coalesce(p_dang_bai, '?'), r.vung, p_p.khoi, p_ma_cau, r.nhanh; end if;
  end if;

  if p_ket_qua = 'cao' then
    if r.nhanh = 'khtn' then
      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)
    elsif r.nhanh = 'vatly' then
      perform public._vatly_bdm_gan(p_ma_cau, p_dang_bai, 'ai');
    elsif r.nhanh = 'hoahoc' then
      perform public._hoahoc_bdm_gan(p_ma_cau, p_dang_bai, 'ai');
    else
    execute format($q$insert into %I (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.gan)
      using p_ma_cau, p_dang_bai;
    end if;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.de_xuat) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'vua' then
    if v_ly = '' then raise exception 'Đề xuất (chưa chắc) phải kèm lý do phân vân.'; end if;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.gan) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'vua', $3, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = 'vua', ly_do = excluded.ly_do, nguon = 'ai', at = now()$q$, r.de_xuat)
      using p_ma_cau, p_dang_bai, v_ly;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'thieu' then
    if v_ly = '' then raise exception 'Báo thiếu dạng phải kèm lý do (câu này hỏi gì mà bản đồ chưa có).'; end if;
    -- chủ đề của hàng "thiếu": chủ đề Claude nêu (nếu có, phải đúng khối + vùng) — để trưởng khối thấy câu ở đúng chỗ.
    if p_chu_de is not null then
      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;
      elsif r.nhanh = 'vatly' then select cd.id into v_cd from vatly_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;
      elsif r.nhanh = 'hoahoc' then select cd.id into v_cd from hoahoc_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;
      else select cd.id into v_cd from dai_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi and cd.nhanh = r.vung; end if;
      if v_cd is null then raise exception 'Chủ đề % không thuộc vùng % của khối %.', p_chu_de, r.vung, p_p.khoi; end if;
    end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.gan) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.de_xuat) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, chu_de_id, ly_do, nguon) values ($1, $2, $3, 'ai')
                     on conflict (ma_cau) do update set chu_de_id = excluded.chu_de_id, ly_do = excluded.ly_do, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.thieu)
      using p_ma_cau, v_cd, v_ly;
  else
    raise exception 'ket_qua phải là cao · vua · thieu.';
  end if;
  return jsonb_build_object('ma_cau', p_ma_cau, 'ket_qua', p_ket_qua, 'dang_bai_id', case when p_ket_qua = 'thieu' then null else p_dang_bai end,
                            'nhanh', r.nhanh, 'truoc', case when v_gan_db is not null then 'ai_gan:' || v_gan_db else null end);
end $function$
;
-- fn_phien_kho_dang
CREATE OR REPLACE FUNCTION public.fn_phien_kho_dang(p_phien uuid, p_dang_bai text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_l int; v_o int;
begin
  v_p := public._phien_kho_vao(p_phien);
  v_l := least(greatest(coalesce(p_limit, 30), 1), 50); v_o := greatest(coalesce(p_offset, 0), 0);
  if v_p.mon = 'KHTN' then
    perform public._phien_bd_kiem_khoi('khtn_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_khtn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
  end if;
  if v_p.mon = 'Vật lý' then
    perform public._phien_bd_kiem_khoi('vatly_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_vatly_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
  end if;
  if v_p.mon = 'Hóa học' then
    perform public._phien_bd_kiem_khoi('hoahoc_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_hoahoc_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
  end if;
  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
  return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
end $function$
;
-- fn_phien_kho_hang
CREATE OR REPLACE FUNCTION public.fn_phien_kho_hang(p_phien uuid, p_hang text, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_l int; v_o int;
begin
  v_p := public._phien_kho_vao(p_phien);
  if p_hang not in ('trong', 'de_xuat', 'thieu', 'mau') then raise exception 'hang phải là trong · de_xuat · thieu · mau.'; end if;
  v_l := least(greatest(coalesce(p_limit, 20), 1), 50); v_o := greatest(coalesce(p_offset, 0), 0);
  if v_p.mon = 'KHTN' then return public.fn_khtn_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;
  if v_p.mon = 'Vật lý' then return public.fn_vatly_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;
  if v_p.mon = 'Hóa học' then return public.fn_hoahoc_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;
  return public.fn_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o);
end $function$
;
-- fn_phien_kho_tong
CREATE OR REPLACE FUNCTION public.fn_phien_kho_tong(p_phien uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  v_p := public._phien_kho_vao(p_phien);
  return jsonb_build_object('khoi', v_p.khoi, 'mon', v_p.mon,
    'dem', case when v_p.mon = 'KHTN' then public.fn_khtn_bdm_khop_dem(v_p.khoi) when v_p.mon = 'Vật lý' then public.fn_vatly_bdm_khop_dem(v_p.khoi) when v_p.mon = 'Hóa học' then public.fn_hoahoc_bdm_khop_dem(v_p.khoi) else public.fn_bdm_khop_dem(v_p.khoi) end);
end $function$
;
-- fn_phien_kho_duyet
CREATE OR REPLACE FUNCTION public.fn_phien_kho_duyet(p_phien uuid, p_ts jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_ma text[]; m text; c record; v_duyet boolean := coalesce((p_ts->>'duyet')::boolean, true);
        v_ok int := 0; v_loi int := 0; v_kq jsonb := '[]'::jsonb; b text; v_gan text[]; v_tmp text[];
begin
  v_p := public._phien_kho_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  v_gan := case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau'] when v_p.mon = 'Vật lý' then array['vatly_bdm_gan_cau'] when v_p.mon = 'Hóa học' then array['hoahoc_bdm_gan_cau'] else array['dai_bdm_gan_cau', 'hgt_bdm_gan_cau'] end;
  if jsonb_typeof(p_ts->'ma_cau') = 'array' then
    v_ma := array(select jsonb_array_elements_text(p_ts->'ma_cau'));
  elsif p_ts ? 'ma_bai' then   -- 07/11: cả một bài học Hình–Học
    if not exists (select 1 from hinh_hoc_bai where ma_bai = p_ts->>'ma_bai' and khoi = v_p.khoi) then
      raise exception 'Bài % không phải bài học Hình của khối %.', p_ts->>'ma_bai', v_p.khoi;
    end if;
    v_ma := array(select hc.ma_cau from hinh_hoc_cau_hoi hc where hc.dang_chinh = p_ts->>'ma_bai' and hc.xoa_at is null and hc.parent_ma_cau is null);
  elsif p_ts ? 'dang_bai_id' or p_ts ? 'nhom_id' then
    if p_ts ? 'dang_bai_id' then perform public._phien_bd_kiem_khoi(b, 'dang_bai', p_ts->>'dang_bai_id', v_p.khoi);
    else perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_p.khoi); end if;
    v_ma := '{}';
    foreach m in array v_gan loop
      execute format($q$select coalesce(array_agg(g.ma_cau), '{}') from %I g join %I d on d.id = g.dang_bai_id
                        where ($1::text is not null and d.id = $1) or ($2::text is not null and d.nhom_id = $2)$q$, m, b || 'dang_bai')
        into v_tmp using p_ts->>'dang_bai_id', p_ts->>'nhom_id';
      v_ma := v_ma || v_tmp;
    end loop;
  else
    raise exception 'Cần {"ma_cau":[...]} hoặc {"dang_bai_id":".."} hoặc {"nhom_id":".."} hoặc {"ma_bai":".."} (bài học Hình).';
  end if;
  if cardinality(v_ma) = 0 then return jsonb_build_object('ok', 0, 'loi', 0, 'ghi_chu', 'Không có câu nào.'); end if;
  if cardinality(v_ma) > 1000 then raise exception 'Mỗi lần tối đa 1000 câu (đang %).', cardinality(v_ma); end if;
  foreach m in array v_ma loop
    begin
      select * into c from public._phien_kho_cau(v_p, m);
      -- bản sao đi theo câu gốc (cùng như màn duyệt: duyệt gốc ⇒ duyệt bản sao)
      execute format($q$update %I set da_duyet = $2, duyet_boi = case when $2 then public.current_nhan_su_id() end,
                          duyet_at = case when $2 then now() end, duyet_nguon = case when $2 then 'nguoi' end
                        where (ma_cau = $1 or parent_ma_cau = $1) and xoa_at is null and da_duyet is distinct from $2$q$, c.tbl) using m, v_duyet;   -- câu đã đúng trạng thái: giữ người duyệt cũ
      v_ok := v_ok + 1;
    exception when others then
      v_loi := v_loi + 1; v_kq := v_kq || jsonb_build_array(jsonb_build_object('ma_cau', m, 'loi', sqlerrm));
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, case when v_duyet then 'duyet_cau' else 'bo_duyet_cau' end, p_ts, jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$
;
-- fn_phien_kho_them
CREATE OR REPLACE FUNCTION public.fn_phien_kho_them(p_phien uuid, p_ds jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_ok int := 0; v_trung int := 0; v_loi int := 0;
        v_nh text; v_tbl text; v_ma text; v_cu text; v_k text; v_phan jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu (xem tro-giup).'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lô tối đa 20 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' when v_p.mon = 'Vật lý' then 'vatly' when v_p.mon = 'Hóa học' then 'hoahoc' else 'dai' end);
      if v_p.mon = 'KHTN' and v_nh <> 'khtn' then raise exception 'Phiên KHTN: nhanh phải là khtn.'; end if;
      if v_p.mon = 'Vật lý' and v_nh <> 'vatly' then raise exception 'Phiên Vật lý: nhanh phải là vatly.'; end if;
      if v_p.mon = 'Hóa học' and v_nh <> 'hoahoc' then raise exception 'Phiên Hóa học: nhanh phải là hoahoc.'; end if;
      if v_p.mon not in ('KHTN', 'Vật lý', 'Hóa học') and v_nh not in ('dai', 'hgt', 'hinh_hoc') then raise exception 'nhanh phải là dai · hgt · hinh_hoc.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      -- 11/11: md5(khoá) = md5($1) chỉ để đi index <bảng>_khoa_trung_idx (mig 202611112136); so khoá đầy đủ vẫn giữ.
      execute format($q$select min(c.ma_cau) from %I c where c.xoa_at is null
                         and md5(regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g')) = md5($1)
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1$q$, v_tbl)
        into v_cu using v_k;
      if v_cu is not null then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'trung', true, 'ma_cau', v_cu));
        v_trung := v_trung + 1;
        continue;
      end if;
      if v_nh = 'hinh_hoc' then   -- 07/11: câu Hình–Học vào thẳng bài học (dạng = bài), chưa duyệt
        if not exists (select 1 from hinh_hoc_bai where ma_bai = x->>'ma_bai' and khoi = v_p.khoi) then
          raise exception 'Câu Hình–Học cần "ma_bai" là bài học Hình của khối %.', v_p.khoi;
        end if;
        if nullif(trim(x->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
        insert into hinh_hoc_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, nguon, nguon_giai, da_duyet, dang_ai_de_xuat)
        values (x->>'ma_bai', x->>'loai_cau', trim(x->>'noi_dung'),
                case when jsonb_typeof(x->'lua_chon') = 'array' then x->'lua_chon' end,
                case when jsonb_typeof(x->'menh_de') = 'array' then x->'menh_de' end,
                nullif(trim(x->>'dap_an'), ''), nullif(trim(x->>'loi_giai'), ''), 'le',
                case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end, false, x->>'ma_bai')
        returning ma_cau into v_ma;
      else
      v_ma := public.fn_bdm_nhap_cau(case v_nh when 'dai' then 'toan' else v_nh end, v_p.khoi,
                                     x || jsonb_build_object('nguon_giai', case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end),
                                     null, null);
      end if;
      if nullif(trim(x->>'ten_de_goc'), '') is not null and v_nh <> 'hinh_hoc' then
        execute format('update %I set ten_de_goc = $2 where ma_cau = $1', v_tbl) using v_ma, trim(x->>'ten_de_goc');
      end if;
      v_phan := null;
      if jsonb_typeof(x->'phan') = 'object' and x->>'loai_cau' <> 'dung_sai' and v_nh <> 'hinh_hoc' then
        v_phan := public._phien_kho_phan1(v_p, v_ma, x->'phan'->>'ket_qua', x->'phan'->>'dang_bai_id', x->'phan'->>'ly_do', x->'phan'->>'chu_de_id');
      end if;
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'ma_cau', v_ma, 'nhanh', v_nh, 'phan', v_phan));
      v_ok := v_ok + 1;
    exception when others then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', false, 'loi', sqlerrm, 'dau_de', left(coalesce(x->>'noi_dung', ''), 60)));
      v_loi := v_loi + 1;
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'them_cau', jsonb_build_object('so_cau', jsonb_array_length(p_ds)),
          jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$
;
-- fn_phien_bd_ghi
CREATE OR REPLACE FUNCTION public.fn_phien_bd_ghi(p_phien uuid, p_viec text, p_ts jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_p claude_phien; b text; v_vung boolean; v_khoi text;
  v_id text; v_id2 text; v_kq jsonb; v_ten text; v_mo_ta text; v_loai text;
  v_ids text[]; v_i integer; v_cha text; v_n integer; v_set text[] := '{}';
begin
  v_p := public._phien_bd_vao(p_phien);
  -- 04/11: phiên của nhân sự (không phải trưởng khối) chỉ THÊM câu + XẾP câu vào dạng có sẵn — không đổi bản đồ.
  if not v_p.sua_cau_truc then
    raise exception 'Phiên này của nhân sự: chỉ đưa bài tập vào kho và xếp vào dạng có sẵn. Thiếu dạng thì báo "thieu" để trưởng khối thêm.';
  end if;
  -- 05/11 (Thùy): trưởng khối làm ĐỦ mọi việc với bản đồ khối mình trong MỌI loại phiên — loại phiên chỉ là nhãn việc.
  v_khoi := v_p.khoi;
  select bang, co_vung into b, v_vung from public._phien_bdm_bang(v_p.mon);
  p_ts := coalesce(p_ts, '{}'::jsonb);
  v_ten := nullif(trim(coalesce(p_ts->>'ten', '')), '');
  v_mo_ta := p_ts->>'mo_ta';

  if p_viec = 'them_chu_de' then
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    if v_vung then
      execute format('insert into %I (khoi, ten, nhanh) values ($1, $2, $3) returning id', b || 'chu_de')
        into v_id using v_khoi, v_ten, coalesce(nullif(p_ts->>'nhanh', ''), 'toan');
    else
      execute format('insert into %I (khoi, ten) values ($1, $2) returning id', b || 'chu_de') into v_id using v_khoi, v_ten;
    end if;
    v_kq := jsonb_build_object('chu_de_id', v_id);

  elsif p_viec = 'them_chuyen_de' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (ten, mo_ta) values ($1, $2) returning id', b || 'chuyen_de')
      into v_id using v_ten, coalesce(v_mo_ta, '');
    execute format('insert into %I (chu_de_id, chuyen_de_id) values ($1, $2)', b || 'o') using p_ts->>'chu_de_id', v_id;
    v_kq := jsonb_build_object('chuyen_de_id', v_id, 'chu_de_id', p_ts->>'chu_de_id');

  elsif p_viec = 'them_nhom' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (chu_de_id, chuyen_de_id, ten, mo_ta) values ($1, $2, $3, $4) returning id', b || 'nhom')
      into v_id using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('nhom_id', v_id);

  elsif p_viec = 'them_dang_bai' then
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (nhom_id, ten, mo_ta) values ($1, $2, $3) returning id', b || 'dang_bai')
      into v_id using p_ts->>'nhom_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('dang_bai_id', v_id);

  elsif p_viec = 'sua' then
    -- Chỉ tên + mô tả nhận biết. Lý thuyết / ví dụ thuộc loại việc 'ly_thuyet' (chưa mở). Mã không bao giờ đổi.
    v_loai := p_ts->>'loai';
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_khoi);
    if p_ts ? 'ten' then
      if v_ten is null then raise exception 'ten không được trống.'; end if;
      v_set := v_set || format('ten = %L', v_ten);
    end if;
    if p_ts ? 'mo_ta' then
      if v_loai = 'chu_de' then raise exception 'Chủ đề không có mô tả.'; end if;
      v_set := v_set || format('mo_ta = %L', coalesce(v_mo_ta, ''));
    end if;
    if cardinality(v_set) = 0 then raise exception 'Không có gì để sửa (chỉ sửa được ten, mo_ta).'; end if;
    execute format('update %I set %s where id = $1', b || v_loai, array_to_string(v_set, ', ')) using v_id;
    v_kq := jsonb_build_object('loai', v_loai, 'id', v_id);

  elsif p_viec = 'chuyen_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    execute format('update %I set chu_de_id = $2, chuyen_de_id = $3,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where chu_de_id = $2 and chuyen_de_id = $3)
                    where id = $1', b || 'nhom', b || 'nhom')
      using v_id, p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    v_kq := jsonb_build_object('nhom_id', v_id, 'chu_de_id', p_ts->>'chu_de_id', 'chuyen_de_id', p_ts->>'chuyen_de_id');

  elsif p_viec = 'chuyen_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    execute format('update %I set nhom_id = $2,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where nhom_id = $2)
                    where id = $1', b || 'dang_bai', b || 'dang_bai')
      using v_id, p_ts->>'nhom_id';
    v_kq := jsonb_build_object('dang_bai_id', v_id, 'nhom_id', p_ts->>'nhom_id');

  elsif p_viec = 'sap_xep' then
    -- Đặt lại thứ tự theo đúng mảng ids; mọi id phải cùng một cha và thuộc khối của phiên.
    v_loai := p_ts->>'loai';
    select array_agg(x) into v_ids from jsonb_array_elements_text(coalesce(p_ts->'ids', '[]'::jsonb)) x;
    if coalesce(cardinality(v_ids), 0) = 0 then raise exception 'Thiếu ids.'; end if;
    if v_loai = 'chu_de' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi); end loop;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'chu_de') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'o' then  -- thứ tự chuyên đề trong 1 chủ đề
      v_cha := p_ts->>'chu_de_id';
      perform public._phien_bd_kiem_khoi(b, 'chu_de', v_cha, v_khoi);
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $3 where chu_de_id = $1 and chuyen_de_id = $2', b || 'o') using v_cha, v_ids[v_i], v_i;
        get diagnostics v_n = row_count;
        if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', v_ids[v_i], v_cha; end if;
      end loop;
    elsif v_loai = 'nhom' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi); end loop;
      execute format('select count(distinct (chu_de_id, chuyen_de_id)) from %I where id = any($1)', b || 'nhom') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các nhóm không cùng một chuyên đề — sắp xếp từng chuyên đề một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'nhom') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'dang_bai' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi); end loop;
      execute format('select count(distinct nhom_id) from %I where id = any($1)', b || 'dang_bai') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các dạng bài không cùng một nhóm — sắp xếp từng nhóm một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'dang_bai') using v_ids[v_i], v_i;
      end loop;
    else
      raise exception 'sap_xep: loai phải là chu_de · o · nhom · dang_bai.';
    end if;
    v_kq := jsonb_build_object('loai', v_loai, 'so', cardinality(v_ids));

  -- 05/11 XOÁ (Thùy: trưởng khối có đủ quyền xử lý bản đồ) — cùng hàm màn sửa tay đang dùng. Nút còn câu đã gán thì DB báo số câu:
  -- chuyển câu đi (phan_dang) rồi xoá. Log bản đồ (*_bdm_log, trigger) giữ vết từng dòng xoá, actor = người mở phiên.
  elsif p_viec = 'xoa_chu_de' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi);
    execute format('select public.%I($1)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_chu_de' when b = 'vatly_bdm_' then 'fn_vatly_bdm_xoa_chu_de' when b = 'hoahoc_bdm_' then 'fn_hoahoc_bdm_xoa_chu_de' else 'fn_bdm_xoa_chu_de' end) into v_kq using v_id;
    v_kq := jsonb_build_object('chu_de_id', v_id) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_chuyen_de' then
    v_id := p_ts->>'chu_de_id'; v_id2 := p_ts->>'chuyen_de_id';
    perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi);
    execute format('select public.%I($1, $2)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_o' when b = 'vatly_bdm_' then 'fn_vatly_bdm_xoa_o' when b = 'hoahoc_bdm_' then 'fn_hoahoc_bdm_xoa_o' else 'fn_bdm_xoa_o' end) into v_kq using v_id, v_id2;
    v_kq := jsonb_build_object('chu_de_id', v_id, 'chuyen_de_id', v_id2) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    execute format('select public.%I($1)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_nhom' when b = 'vatly_bdm_' then 'fn_vatly_bdm_xoa_nhom' when b = 'hoahoc_bdm_' then 'fn_hoahoc_bdm_xoa_nhom' else 'fn_bdm_xoa_nhom' end) into v_kq using v_id;
    v_kq := jsonb_build_object('nhom_id', v_id) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    execute format('select count(*) from %I where dang_bai_id = $1', case when b = 'khtn_bdm_' then 'khtn_bdm_gan_cau' when b = 'vatly_bdm_' then 'vatly_bdm_gan_cau' when b = 'hoahoc_bdm_' then 'hoahoc_bdm_gan_cau' else 'dai_bdm_gan_cau' end)
      into v_n using v_id;
    if b = 'dai_bdm_' then v_n := v_n + (select count(*) from hgt_bdm_gan_cau where dang_bai_id = v_id); end if;
    if v_n > 0 then raise exception 'Dạng bài % còn % câu đã gán — chuyển câu sang dạng khác (phan_dang) rồi xoá.', v_id, v_n; end if;
    execute format('delete from %I where dang_bai_id = $1', b || 'de_xuat') using v_id;
    if b = 'dai_bdm_' then delete from hgt_bdm_de_xuat where dang_bai_id = v_id; end if;
    execute format('delete from %I where id = $1', b || 'dang_bai') using v_id;
    v_kq := jsonb_build_object('dang_bai_id', v_id, 'xoa', true);
  else
    raise exception 'Lệnh không có: % (them_chu_de · them_chuyen_de · them_nhom · them_dang_bai · sua · chuyen_nhom · chuyen_dang_bai · sap_xep · xoa_chu_de · xoa_chuyen_de · xoa_nhom · xoa_dang_bai).', p_viec;
  end if;

  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, p_viec, p_ts, v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $function$
;
-- _troly_ten_dang
CREATE OR REPLACE FUNCTION public._troly_ten_dang(p_ma text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare r record; v text;
begin
  if p_ma is null then return null; end if;
  for r in select * from (values ('Toán', 'bdm'), ('Toán', null::text), ('Toán', 'hinh_gt'), ('Toán', 'hinh_hoc'), ('KHTN', null), ('Vật lý', null), ('Hóa học', null)) t(mon, nhanh) loop
    execute format('select ten_dang from %I where ma_dang = $1 limit 1', public._kho_ban_do_tbl(r.mon, r.nhanh))
      into v using p_ma;
    if v is not null then return jsonb_build_object('mon', r.mon, 'ten', v); end if;
  end loop;
  return null;
end $function$
;
-- fn_troly_danh_muc
CREATE OR REPLACE FUNCTION public.fn_troly_danh_muc()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  perform public._troly_gac();
  return $cat$[
  {"name":"hoc_tap_hoc_sinh",
   "mo_ta":"Hồ sơ học tập của MỘT học sinh theo tên: Elo, mastery (số dạng đạt/cần luyện/yếu + danh sách dạng yếu), điểm ET / BTVN / MT TỪNG BUỔI, điểm các kỳ thi, điểm danh, đánh giá + nhận xét sau buổi. Dùng cho mọi câu hỏi về 1 em cụ thể.",
   "tham_so":{"type":"object","properties":{
     "ten_hoc_sinh":{"type":"string","description":"Tên học sinh (hoặc mã HS), nguyên văn người dùng gõ, không dấu cũng được."},
     "ten_lop":{"type":"string","description":"Tên lớp nếu người dùng có nói, để phân biệt khi trùng tên."},
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Vật lý","Hóa học"],"description":"Chỉ điền khi người dùng nói rõ môn."},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = 60 ngày gần nhất."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}},
     "required":["ten_hoc_sinh"]}},
  {"name":"ket_qua_lop",
   "mo_ta":"Kết quả của MỘT lớp theo từng buổi và từng học sinh, cho 1 loại: et (bài kiểm tra cuối buổi) | btvn (bài tập về nhà) | mt (kiểm tra định kỳ). ET, BTVN, MT là BA thứ khác nhau — chọn đúng loại người dùng hỏi.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string","description":"Tên lớp, vd 9A1."},
     "loai":{"type":"string","enum":["et","btvn","mt"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = 30 ngày gần nhất."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}},
     "required":["ten_lop","loai"]}},
  {"name":"tinh_trang_buoi",
   "mo_ta":"Tình trạng dữ liệu của các BUỔI HỌC trong một ngày hoặc khoảng ngày: buổi nào đã/chưa điểm danh, đã/chưa nhập ET, BTVN, đánh giá, MT; buổi nào bấm đóng mà không có dữ liệu (đóng khống, đóng không nhận xét); lớp nào có lịch mà chưa mở buổi. Dùng cho câu hỏi kiểu: hôm nay/hôm qua lớp nào còn thiếu gì, lớp nào chưa nhập BTVN, còn bao nhiêu buổi chưa đóng.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = bằng den_ngay (hỏi 1 ngày)."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_lop":{"type":"string"},"khoi":{"type":"string","description":"vd 8"},
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Vật lý","Hóa học"]},
     "chi_buoi_co_van_de":{"type":"boolean","description":"true = chỉ liệt kê buổi thiếu/đóng khống. Bỏ trống: hỏi ≤7 ngày thì liệt kê hết, dài hơn thì chỉ buổi có vấn đề."}}}},
  {"name":"viec_van_hanh",
   "mo_ta":"Việc vận hành sau buổi học theo NGƯỜI (giáo viên, trợ giảng, trưởng khối): ai còn nợ khâu nào (đánh giá, chấm bài trên lớp, ET, BTVN, MT) của buổi nào, quá hạn hay chưa. Dùng cho câu hỏi: ai đang nợ việc, việc tuần trước chưa hoàn thành, việc quá hạn của một người hoặc một lớp.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "ten_lop":{"type":"string"},
     "tu_ngay":{"type":"string","description":"Ngày BUỔI HỌC, YYYY-MM-DD. Bỏ trống = 14 ngày trước den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "trang_thai":{"type":"string","enum":["chua_xong","qua_han","da_xong","tat_ca"],"description":"Bỏ trống = chua_xong."}}}},
  {"name":"viec_phat_trien",
   "mo_ta":"Việc phát triển (việc giao tay qua module Giao việc): đang mở, quá hạn, chờ nghiệm thu, đã xong — theo người làm, người giao, khoảng hạn.",
   "tham_so":{"type":"object","properties":{
     "ten_nguoi_lam":{"type":"string"},"ten_nguoi_giao":{"type":"string"},
     "trang_thai":{"type":"string","enum":["dang_mo","qua_han","cho_nghiem_thu","da_xong","tat_ca"],"description":"Bỏ trống = dang_mo."},
     "han_tu_ngay":{"type":"string","description":"Lọc theo HẠN của việc, YYYY-MM-DD."},
     "han_den_ngay":{"type":"string","description":"YYYY-MM-DD."}}}},
  {"name":"ket_qua_viec_thang",
   "mo_ta":"Kết quả việc vận hành của nhân viên trong MỘT tháng: số việc đạt / không đạt / chưa tới hạn, và danh sách việc không đạt kèm lý do (trễ, nợ quá hạn). Dùng cho câu hỏi về tình trạng làm việc, ai miss, ai làm tốt.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."}}}},
  {"name":"vang_hoc",
   "mo_ta":"Học sinh vắng (có phép / không phép) theo lớp, khối, môn trong khoảng ngày; kèm danh sách em vắng nhiều.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string"},"khoi":{"type":"string"},"mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Vật lý","Hóa học"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = thứ Hai tuần này."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}}}},
  {"name":"thieu_btvn",
   "mo_ta":"Học sinh thiếu BTVN (không làm / nộp muộn / xin phép) theo lớp, khối, môn trong khoảng ngày, kèm từng buổi thiếu của từng em.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string"},"khoi":{"type":"string"},"mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Vật lý","Hóa học"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = thứ Hai tuần này."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}}}},
  {"name":"bo_tro",
   "mo_ta":"Tình hình bổ trợ. loai = bu (lượt vắng và tình trạng xếp bù) | duoi (đợt học đuổi đang mở, tiến độ) | yeu (case bổ trợ yếu đang xử, kết quả case đã đóng). Có thể hỏi riêng 1 học sinh.",
   "tham_so":{"type":"object","properties":{
     "loai":{"type":"string","enum":["bu","duoi","yeu"]},
     "ten_hoc_sinh":{"type":"string"},"ten_lop":{"type":"string","description":"Để phân biệt khi trùng tên HS."},
     "tu_ngay":{"type":"string","description":"Chỉ dùng cho loai=bu: lượt vắng từ ngày này. Bỏ trống = 30 ngày gần nhất."}},
     "required":["loai"]}},
  {"name":"hoc_phi_hoc_sinh",
   "mo_ta":"Học phí của MỘT học sinh trong 1 tháng: chi tiết theo lớp (số buổi, đơn giá, học liệu, học đuổi, thành tiền) và hoá đơn của phụ huynh.",
   "tham_so":{"type":"object","properties":{
     "ten_hoc_sinh":{"type":"string"},"ten_lop":{"type":"string"},
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."}},
     "required":["ten_hoc_sinh"]}},
  {"name":"hoc_phi_no",
   "mo_ta":"Danh sách hoá đơn học phí CHƯA THU ĐỦ (chưa thu / thu một phần / quá hạn) theo phụ huynh, tổng theo kỳ.",
   "tham_so":{"type":"object","properties":{
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = mọi kỳ còn nợ."}}}},
  {"name":"tuyen_sinh",
   "mo_ta":"Tuyển sinh: đếm ứng viên theo level và trạng thái; chuỗi test đầu vào (test → scan → chấm → trả kết quả) và danh sách ca đang kẹt ở khâu nào, ai dự kiến chấm/trả.",
   "tham_so":{"type":"object","properties":{
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Vật lý","Hóa học"]},"khoi":{"type":"string"}}}},
  {"name":"xep_hang",
   "mo_ta":"Bảng xếp hạng Elo + EXP của học sinh đang học, lọc theo môn / khối / lớp.",
   "tham_so":{"type":"object","properties":{
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Vật lý","Hóa học"]},"khoi":{"type":"string"},"ten_lop":{"type":"string"},
     "top":{"type":"integer","description":"Số dòng, mặc định 20, tối đa 50."}}}}
  ]$cat$::jsonb;
end $function$
;

-- ════ CHECK: thay Lý hóa bằng 2 môn ════
alter table public.sotay_ct_chu_de drop constraint sotay_ct_chu_de_mon_check;
alter table public.sotay_ct_chu_de add constraint sotay_ct_chu_de_mon_check CHECK ((mon = ANY (ARRAY['Toán'::text, 'KHTN'::text, 'Vật lý'::text, 'Hóa học'::text, 'Tiếng Anh'::text, 'Văn'::text, 'TSA'::text])));
alter table public.sotay_ct_hinh drop constraint sotay_ct_hinh_mon_check;
alter table public.sotay_ct_hinh add constraint sotay_ct_hinh_mon_check CHECK ((mon = ANY (ARRAY['Toán'::text, 'KHTN'::text, 'Vật lý'::text, 'Hóa học'::text, 'Tiếng Anh'::text, 'Văn'::text, 'TSA'::text])));
alter table public.kho_doi_dang_log drop constraint kho_doi_dang_log_mon_check;
alter table public.kho_doi_dang_log add constraint kho_doi_dang_log_mon_check CHECK ((mon = ANY (ARRAY['dai'::text, 'hgt'::text, 'khtn'::text, 'vatly'::text, 'hoahoc'::text, 'anh'::text, 'tsa'::text])));
alter table public.kho_kiem_lo drop constraint kho_kiem_lo_kho_check;
alter table public.kho_kiem_lo add constraint kho_kiem_lo_kho_check CHECK ((kho = ANY (ARRAY['dai'::text, 'khtn'::text, 'vatly'::text, 'hoahoc'::text, 'hgt'::text, 'anh'::text, 'tsa'::text])));
alter table public.kho_de_sau drop constraint kho_de_sau_mon_check;
alter table public.kho_de_sau add constraint kho_de_sau_mon_check CHECK ((mon = ANY (ARRAY['toan'::text, 'khtn'::text, 'vatly'::text, 'hoahoc'::text, 'hgt'::text, 'hinh_hoc'::text, 'anh'::text, 'tsa'::text])));
alter table public.kho_nhan_xet drop constraint kho_nhan_xet_mon_check;
alter table public.kho_nhan_xet add constraint kho_nhan_xet_mon_check CHECK ((mon = ANY (ARRAY['toan'::text, 'khtn'::text, 'vatly'::text, 'hoahoc'::text, 'hgt'::text, 'hinh_hoc'::text, 'anh'::text, 'tsa'::text])));

-- ════ (C) gỡ bộ Lý hóa — DROP thường, không CASCADE ════
drop table public.lyhoa_ban_do, public.lyhoa_bdm_cau_thieu_dang, public.lyhoa_bdm_chu_de, public.lyhoa_bdm_chuyen_de, public.lyhoa_bdm_dang_bai, public.lyhoa_bdm_de_xuat, public.lyhoa_bdm_gan_cau, public.lyhoa_bdm_kiem_mau, public.lyhoa_bdm_log, public.lyhoa_bdm_nhom, public.lyhoa_bdm_nhom_tien_de, public.lyhoa_bdm_o, public.lyhoa_bdm_tu_choi, public.lyhoa_cau_form_tn, public.lyhoa_cau_hoi, public.lyhoa_cau_hoi_yeu_cau_giai, public.lyhoa_chuyen_de_ly_thuyet, public.lyhoa_cum_bai, public.lyhoa_cum_tien_de, public.lyhoa_dang_ly_thuyet, public.lyhoa_dang_tien_de, public.lyhoa_de_xuat, public.lyhoa_de_xuat_cau, public.lyhoa_de_xuat_quyet_dinh, public.lyhoa_mcq_rule;
drop function public._lyhoa_bdm_bump_nhom();
drop function public._lyhoa_bdm_duyet_duoc(p_khoi text);
drop function public._lyhoa_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text);
drop function public._lyhoa_bdm_ghi_log();
drop function public._lyhoa_bdm_khoi_cua_nhom(p_nhom text);
drop function public._lyhoa_bdm_khop_nguon(p_khoi text, p_hang text);
drop function public._lyhoa_bdm_thu_tu();
drop function public._lyhoa_bdm_tien_de_cung_o();
drop function public._lyhoa_bdm_tien_de_kiem();
drop function public._lyhoa_bdm_xoa_cac_nhom(p_nhom text[]);
drop function public._lyhoa_do_o_bdm(p_ma_cau text, p_ma_dang_chep text);
drop function public._lyhoa_la_lan_do(p_ma_cau text, p_ma_dang_chep text);
drop function public.fn_lyhoa_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer, p_offset integer);
drop function public.fn_lyhoa_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean);
drop function public.fn_lyhoa_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean);
drop function public.fn_lyhoa_bdm_cay(p_khoi text, p_nhanh text);
drop function public.fn_lyhoa_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]);
drop function public.fn_lyhoa_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]);
drop function public.fn_lyhoa_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text);
drop function public.fn_lyhoa_bdm_dang_cu(p_khoi text);
drop function public.fn_lyhoa_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text);
drop function public.fn_lyhoa_bdm_gan_cum(p_ma_cum text, p_dang_bai text);
drop function public.fn_lyhoa_bdm_gop_chuyen_de(p_tu text, p_vao text);
drop function public.fn_lyhoa_bdm_ha_nhom(p_id text, p_nhom_dich text);
drop function public.fn_lyhoa_bdm_kho_cau(p_loai text, p_id text, p_loc text, p_limit integer, p_offset integer);
drop function public.fn_lyhoa_bdm_khop_dem(p_khoi text, p_chu_de text, p_nguon text);
drop function public.fn_lyhoa_bdm_khop_dich(p_khoi text);
drop function public.fn_lyhoa_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer, p_offset integer, p_chu_de text, p_nguon text);
drop function public.fn_lyhoa_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text);
drop function public.fn_lyhoa_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text, p_ly_do text);
drop function public.fn_lyhoa_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text);
drop function public.fn_lyhoa_bdm_sap_xep(p_loai text, p_ids text[]);
drop function public.fn_lyhoa_bdm_xoa_chu_de(p_id text);
drop function public.fn_lyhoa_bdm_xoa_nhom(p_id text);
drop function public.fn_lyhoa_bdm_xoa_o(p_chu_de text, p_chuyen_de text);
drop function public.fn_lyhoa_de_xuat_ds(p_khoi text, p_chi_cho boolean);
drop function public.fn_lyhoa_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text, p_mo_ta_ngan text, p_ma_dang_dich text, p_tra_loi text);
drop function public.fn_lyhoa_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text, p_mo_ta_ngan text, p_ma_dang text, p_dang_gan_nhat text);
drop function public.fn_lyhoa_de_xuat_tk(p_khoi text);
drop function public.fn_lyhoa_sinh_ma_dang(p_ma_chuyen_de text);
drop function public.lyhoa_cau_form_tn_kiem();
drop function public.lyhoa_cum_hau_due(goc text);
drop function public.lyhoa_cum_tien_de_bao_dong(goc text);
drop function public.lyhoa_dang_hau_due(goc text);
drop function public.lyhoa_dang_tien_de_bao_dong(goc text);
drop sequence if exists public.lyhoa_bdm_chu_de_seq;
drop sequence if exists public.lyhoa_bdm_chuyen_de_seq;
drop sequence if exists public.lyhoa_bdm_dang_bai_seq;
drop sequence if exists public.lyhoa_bdm_log_id_seq;
drop sequence if exists public.lyhoa_bdm_log_id_seq1;
drop sequence if exists public.lyhoa_bdm_nhom_seq;
drop sequence if exists public.lyhoa_bdm_tu_choi_id_seq;
drop sequence if exists public.lyhoa_bdm_tu_choi_id_seq1;
drop sequence if exists public.lyhoa_cau_seq;
drop sequence if exists public.lyhoa_cum_seq;
drop sequence if exists public.lyhoa_dang_seq;
delete from public.tl_bdm_dem_luu where mon = 'Lý hóa';   -- bản đếm lưu sẵn (nếu ai đã mở bộ chọn giáo trình Lý hóa)
