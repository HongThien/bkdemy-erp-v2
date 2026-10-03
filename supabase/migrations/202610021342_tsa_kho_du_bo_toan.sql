-- ============================================================================
-- tsa_kho_du_bo_toan
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 02/10 — "đây là Toán, sao lại khuôn môn Anh. Làm như một Toán." Mig 202610021339 dựng kho TSA theo bộ tối giản của
--   môn Anh; TSA là Toán nên phải đủ bộ bảng như KHTN/Đại: cụm bài, tiền đề dạng/cụm, yêu cầu giải (cây Chủ đề → Chuyên đề → Dạng,
--   lý thuyết dạng + chuyên đề đã có ở mig trước). Bổ sung đúng các bảng còn thiếu theo khtn_* (LIKE khtn_* rồi nối FK sang tsa_*).
--   Đồng thời đổi tên dạng seed: hiện chỉ có 2 tầng Chủ đề–Chuyên đề ⇒ mỗi chuyên đề 1 "dạng cơ bản" (khái niệm của Toán, spec-luong-kho §2)
--   chứa mọi câu cho tới khi chia dạng. (Mới tạo cách đây vài phút, 0 câu tham chiếu.)
-- MẤT GÌ: không mất dữ liệu — chỉ thêm bảng; UPDATE ten_dang/mo_ta_ngan của 16 dạng seed vừa nạp.
-- ============================================================================
create sequence if not exists public.tsa_cum_seq;

create table public.tsa_cum_bai (like public.khtn_cum_bai including defaults including constraints);
alter table public.tsa_cum_bai alter column ma_cum set default ('TCUM' || lpad(nextval('public.tsa_cum_seq')::text, 5, '0'));
alter table public.tsa_cum_bai add primary key (ma_cum);
alter table public.tsa_cum_bai add constraint tsa_cum_bai_ma_dang_fkey foreign key (ma_dang) references public.tsa_ban_do(ma_dang);

create table public.tsa_cum_tien_de (like public.khtn_cum_tien_de including defaults including constraints);
alter table public.tsa_cum_tien_de add primary key (ma_cum, tien_de_ma_cum);
alter table public.tsa_cum_tien_de add constraint tsa_cum_tien_de_ma_cum_fkey foreign key (ma_cum) references public.tsa_cum_bai(ma_cum);
alter table public.tsa_cum_tien_de add constraint tsa_cum_tien_de_tien_de_fkey foreign key (tien_de_ma_cum) references public.tsa_cum_bai(ma_cum);

create table public.tsa_dang_tien_de (like public.khtn_dang_tien_de including defaults including constraints);
alter table public.tsa_dang_tien_de add primary key (ma_dang, tien_de_ma_dang);
alter table public.tsa_dang_tien_de add constraint tsa_dang_tien_de_ma_dang_fkey foreign key (ma_dang) references public.tsa_ban_do(ma_dang);
alter table public.tsa_dang_tien_de add constraint tsa_dang_tien_de_tien_de_fkey foreign key (tien_de_ma_dang) references public.tsa_ban_do(ma_dang);

alter table public.tsa_cau_hoi add constraint tsa_cau_hoi_ma_cum_fkey foreign key (ma_cum) references public.tsa_cum_bai(ma_cum);

create table public.tsa_cau_hoi_yeu_cau_giai (like public.khtn_cau_hoi_yeu_cau_giai including defaults including constraints);
alter table public.tsa_cau_hoi_yeu_cau_giai add primary key (id);
alter table public.tsa_cau_hoi_yeu_cau_giai add constraint tsa_cau_hoi_yeu_cau_giai_ma_cau_fkey foreign key (ma_cau) references public.tsa_cau_hoi(ma_cau);
alter table public.tsa_cau_hoi_yeu_cau_giai add constraint tsa_cau_hoi_yeu_cau_giai_nguoi_yeu_cau_fkey foreign key (nguoi_yeu_cau) references public.nhan_su(id);
alter table public.tsa_cau_hoi_yeu_cau_giai add constraint tsa_cau_hoi_yeu_cau_giai_nguoi_giai_fkey foreign key (nguoi_giai) references public.nhan_su(id);
alter table public.tsa_cau_hoi_yeu_cau_giai add constraint tsa_cau_hoi_yeu_cau_giai_duyet_boi_fkey foreign key (duyet_boi) references public.nhan_su(id);
create trigger tsa_cau_hoi_yeu_cau_giai_claude_dong before update on public.tsa_cau_hoi_yeu_cau_giai
  for each row execute function public.fn_giaibai_tg_claude_dong();

alter table public.tsa_cum_bai enable row level security;
alter table public.tsa_cum_tien_de enable row level security;
alter table public.tsa_dang_tien_de enable row level security;
alter table public.tsa_cau_hoi_yeu_cau_giai enable row level security;
create policy tsa_cum_bai_member_all on public.tsa_cum_bai for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy tsa_cum_tien_de_member_all on public.tsa_cum_tien_de for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy tsa_dang_tien_de_member_all on public.tsa_dang_tien_de for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy tsa_cau_hoi_yeu_cau_giai_member_all on public.tsa_cau_hoi_yeu_cau_giai for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

update public.tsa_ban_do
   set ten_dang = 'Dạng cơ bản',
       mo_ta_ngan = 'Chưa chia dạng: mọi câu của chuyên đề nằm ở đây theo thứ tự tài liệu. Chia dạng ở bước sau.'
 where ma_dang <> 'TS12000000' and ten_dang like 'Tổng hợp — %';
