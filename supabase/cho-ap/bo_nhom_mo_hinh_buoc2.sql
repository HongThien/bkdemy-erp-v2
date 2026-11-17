-- ⏸ CHƯA ÁP — nằm ngoài supabase/migrations/ có chủ ý (để `npm run migrate` không tự áp).
-- Bỏ tầng NHÓM MÔ HÌNH — bước 2/2: XOÁ HẲN (Thùy 17/11 "bỏ tầng này nhé. xóa hẳn đi" + gật danh sách xoá).
-- ĐIỀU KIỆN ÁP: bản ERP có commit "bỏ nhóm mô hình — client" (chuyenDeHinh.ts thôi select nhom_mh_id) ĐÃ DEPLOY.
--   Áp trước khi deploy ⇒ bộ chọn mô hình của Builder giáo trình Hình (ChonMoHinh) báo 400 "column nhom_mh_id does not exist".
-- CÁCH ÁP: `npm run new-migration bo_nhom_mo_hinh_buoc2_xoa` → chép nội dung file này vào → `node scripts/migrate.mjs --only <file>`
--   → `npm run schema` → thử qua REST: GET /rest/v1/hinh_mo_hinh?select=id,ma,ten,chu_de_id,thu_tu&limit=1 → mở Builder Hình chọn mô hình.
-- Bản chép 16 nhóm (tên, mô tả, mô hình thuộc nhóm) trước khi xoá: _luu-tru/du-lieu/hinh_nhom_mo_hinh-17-11.json.
-- Bước 1 (mig 202611171835) đã gỡ mọi hàm khác khỏi bảng/cột này; sau bước 1 chỉ còn 5 hàm dưới đây nhắc tới nhóm.
-- 17 báo cáo tuần đã nộp có mục 'H:<nhóm>' đều lưu sẵn tên trong du_lieu ⇒ không vỡ. 34 dòng dai_bdm_log của bảng nhóm GIỮ (vết lịch sử).

drop trigger if exists trg_hl_mo_hinh_khop_nhom on public.hinh_mo_hinh;
drop function if exists public._hl_mo_hinh_khop_nhom();
drop function if exists public.fn_hl_nhom_mh_sap(text[]);
drop function if exists public.fn_hl_nhom_mh_xoa(text);
drop function if exists public.fn_hl_tao_mo_hinh_trong_nhom(text, text, text, text);
alter table public.hinh_mo_hinh drop column if exists nhom_mh_id;
drop table if exists public.hinh_nhom_mo_hinh;          -- kéo theo trg_hl_nhom_mh_thu_tu · trg_hl_nhom_mh_log
drop function if exists public._hl_nhom_mh_thu_tu();

do $$ begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and (p.prosrc ilike '%hinh_nhom_mo_hinh%' or p.prosrc ilike '%nhom_mh_id%')) then
    raise exception 'còn hàm nhắc tới nhóm mô hình — dừng';
  end if;
end $$;
