-- spec-builder.md §12 — Thùy 17/11 "7 việc kĩ thuật kia m xử lý đi" + "1 buổi chỉ có 1 ET thôi".

-- ── L1: CHECK cho cột loại (CLAUDE §2.1 — cột text không nói tập giá trị hợp lệ). Tập = đúng giá trị đang có trong DB 17/11
--        (+ 'lt_chuyen_de' có trong kiểu PhanLoai của client). Thêm loại mới ⇒ migration nới CHECK đi kèm.
alter table public.tai_lieu add constraint tai_lieu_loai_check
  check (loai in ('giao_trinh', 'giao_trinh_buoi', 'et', 'mt', 'mt_buoi', 'btvn', 'bo_tro', 'chuyen_de', 'de_thi', 'de_test_dau_vao'));
alter table public.tai_lieu_phan add constraint tai_lieu_phan_loai_phan_check
  check (loai_phan in ('buoi', 'custom', 'dang', 'dang_bai', 'nhom', 'nhom_chua_phan', 'chua_khop', 'btvn', 'btvn_nhom', 'ontap', 'ontap_nhom',
                       'hl_mo_hinh', 'hl_khac', 'hl_btvn', 'lt_chuyen_de'));

-- ── L11: MỘT ET bản đồ mới cho mỗi (lớp, ngày). Gốc lỗi: hai lượt lưu chồng nhau ở client cùng tạo mới (4 buổi 03–13/11, hai bản
--        giống hệt cách nhau 1–2 giây) — client đã vá (ETBdmEditor: một lượt lưu tại một thời điểm). Đây là lưới cuối ở DB.
--        4 cặp trùng cũ CHƯA xoá (Luật xoá — chờ Thùy gật) ⇒ index chỉ áp cho ET tạo từ 18/11; dọn xong thì thay bằng index không mốc ngày.
create unique index tai_lieu_et_moi_mot_buoi_uidx on public.tai_lieu (lop_id, ngay)
  where loai = 'et' and ban_do = 'moi' and lop_id is not null and ngay is not null and created_at >= '2026-11-18 00:00:00+07';

-- ── L2: cấm XOÁ CỨNG câu đang được tài liệu / bài trên app / ô chấm trỏ tới bằng TEXT (CLAUDE §2 — không FK thì DB phải tự chặn;
--        spec-de-thi §3.3 hứa trigger này nhưng chưa từng có). Xoá mềm (xoa_at) không bị ảnh hưởng.
create or replace function public._kho_chan_xoa_cau_dang_dung() returns trigger
language plpgsql set search_path to 'public' as $$
declare v_o text;
begin
  if exists (select 1 from tai_lieu_cau where ma_cau = old.ma_cau) then v_o := 'tài liệu (tai_lieu_cau)';
  elsif exists (select 1 from bai_test_cau where ma_cau = old.ma_cau) then v_o := 'bài trên app (bai_test_cau)';
  elsif exists (select 1 from gami_session_problems where ma_cau = old.ma_cau) then v_o := 'ô chấm buổi (gami_session_problems)';
  end if;
  if v_o is not null then
    raise exception 'Câu % đang được dùng ở % — không xoá cứng được. Đưa vào kho rác (xoa_at) thay vì xoá.', old.ma_cau, v_o using errcode = 'P0001';
  end if;
  return old;
end $$;
revoke all on function public._kho_chan_xoa_cau_dang_dung() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'hgt_cau_hoi', 'hinh_hoc_cau_hoi', 'khtn_cau_hoi', 'vatly_cau_hoi', 'hoahoc_cau_hoi', 'tsa_cau_hoi', 'anh_cau_hoi'] loop
    execute format('drop trigger if exists trg_chan_xoa_cau_dang_dung on public.%I', t);
    execute format('create trigger trg_chan_xoa_cau_dang_dung before delete on public.%I for each row execute function public._kho_chan_xoa_cau_dang_dung()', t);
  end loop;
end $$;
