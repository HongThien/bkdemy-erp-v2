-- KHO CHUẨN — lời giải do luồng Claude Code ghi PHẢI DUYỆT mới được dùng (CEO chốt 09/09/2026):
--   "Gemini giải: tạm đạt, dùng được · Claude giải: không đạt, phải duyệt · Sau này: tất cả phải duyệt mới được dùng."
-- Khe hở 08–09/09: `_kho_cau_chuan` cho câu CŨ (created_at < ngày bật) tạm dùng bất kể da_duyet; auto giải bài ghi
-- loi_giai/dap_an vào chính các câu cũ đó (da_duyet=false) ⇒ 54 Đại + 8 KHTN + 2 HGT câu mang lời giải Claude chưa ai
-- duyệt vẫn kho_chuan=true, chỗ chọn câu làm tài liệu lấy được (52 câu đang nằm trong 28 tài liệu).
-- Sửa: thêm tham số p_giai_method — câu cũ chỉ tạm dùng khi lời giải KHÔNG do Claude Code ghi ('claude_code').
-- Gemini (giai_method null / khác) giữ nguyên "tạm dùng tới khi quét" — đúng câu chốt. Câu mới vẫn cần da_duyet.
-- kho_chuan là GENERATED STORED ⇒ không alter được biểu thức: drop cột + add lại (rewrite 3 bảng) + dựng lại 3 index.
-- Không view/policy nào phụ thuộc cột này (đã kiểm pg_depend/pg_policies 09/09).
create or replace function public._kho_cau_chuan(p_da_duyet boolean, p_kiem_may text, p_created_at timestamptz, p_giai_method text)
returns boolean language sql immutable as $$
  select coalesce(p_da_duyet, false)
      or (p_kiem_may is distinct from 'nghi'
          and p_giai_method is distinct from 'claude_code'
          and p_created_at < public._kho_ngay_bat())
$$;

alter table public.dai_cau_hoi drop column kho_chuan;
alter table public.dai_cau_hoi add column kho_chuan boolean generated always as (public._kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)) stored;
create index dai_cau_hoi_kho_chuan_dang on public.dai_cau_hoi using btree (dang_chinh) where (kho_chuan and xoa_at is null);

alter table public.khtn_cau_hoi drop column kho_chuan;
alter table public.khtn_cau_hoi add column kho_chuan boolean generated always as (public._kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)) stored;
create index khtn_cau_hoi_kho_chuan_dang on public.khtn_cau_hoi using btree (dang_chinh) where (kho_chuan and xoa_at is null);

alter table public.hgt_cau_hoi drop column kho_chuan;
alter table public.hgt_cau_hoi add column kho_chuan boolean generated always as (public._kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)) stored;
create index hgt_cau_hoi_kho_chuan_dang on public.hgt_cau_hoi using btree (dang_chinh) where (kho_chuan and xoa_at is null);

-- Bản 3 tham số không còn ai gọi (pg_proc.prosrc không nhắc) — bỏ để không còn 2 định nghĩa "chuẩn".
drop function if exists public._kho_cau_chuan(boolean, text, timestamptz);
