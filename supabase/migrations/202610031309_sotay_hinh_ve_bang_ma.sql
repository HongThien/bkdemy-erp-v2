-- ============================================================================
-- 202610031309 — SỔ TAY: HÌNH VẼ BẰNG MÃ (cột `sotay_ct_hinh.ve`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/10 — hình của sổ tay KHTN (KHTN Pocket) không phải file ảnh mà là MÃ `[kiểu:tham số]` do code vẽ ra SVG
--   (`[bohr:10:Ne]`, `[mach:nt 1 A V]`…). Thùy chọn "chép cả code lại vào app" thay vì xuất ảnh: bộ vẽ đã chép nguyên văn vào
--   `src/lib/sotayHinh/hinhVe.js` (scripts/sotay-khtn/chep-hinh-ve.mjs). Từ đây 1 hình có 2 cách có mặt:
--     · `url` = ảnh người vẽ/tải lên (Toán H01…) — ưu tiên nếu có;
--     · `ve`  = mã vẽ, app tự vẽ (KHTN 109 hình) — sửa mã trên ERP là hình đổi theo, không cần file ảnh.
--   Cả hai null = hình CHƯA CÓ (như cũ). Lúc nạp KHTN (mig 202610031126) mã chỉ nằm trong câu mô tả ⇒ chép ra cột `ve`.
--
-- LÀM GÌ: thêm cột `ve` · chép mã từ `mo_ta` cho các hình nạp từ KHTN Pocket (mô tả có "vẽ bằng code theo mã: [...]") ·
--   `_sotay_muc_json` trả thêm `hinh_ve` (thân lấy từ bản đang chạy, chỉ thêm 1 khoá).
-- MẤT GÌ: không — thêm cột, `mo_ta` giữ nguyên; replace 1 hàm (giữ chữ ký).
-- ============================================================================

alter table public.sotay_ct_hinh add column ve text check (ve is null or ve ~ '^\[[a-z0-9]+:[^\]]*\]$');
comment on column public.sotay_ct_hinh.ve is 'Mã vẽ hình [kiểu:tham số] — app vẽ bằng src/lib/sotayHinh/hinhVe.js. url (ảnh) ưu tiên nếu có cả hai.';

update public.sotay_ct_hinh
set ve = substring(mo_ta from '\[[a-z0-9]+:[^\]]*\]')
where ve is null and mo_ta ~ 'vẽ bằng code theo mã: \[[a-z0-9]+:';

do $$
declare n int;
begin
  select count(*) into n from public.sotay_ct_hinh where mon = 'KHTN' and ve is not null;
  if n <> 109 then raise exception 'Chép mã vẽ KHTN: kỳ vọng 109 hình, được %', n; end if;
end $$;

CREATE OR REPLACE FUNCTION public._sotay_muc_json(p_ma text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select jsonb_strip_nulls(jsonb_build_object(
    'ma', c.ma, 'mon', c.mon, 'khoi', c.khoi, 'loai', c.loai, 'ten', c.ten,
    'chu_de', c.chu_de, 'ten_chu_de', cd.ten, 'nhanh', cd.nhanh,
    'noi_dung', c.noi_dung, 'cong_thuc', c.cong_thuc, 'luu_y', c.luu_y, 'cau_nho', c.cau_nho, 'hinh_url', h.url,
    'hinh_ve', h.ve,   -- mig 202610031309: mã vẽ (app tự vẽ) khi chưa có ảnh
    'y', c.y, 'bang', c.bang, 'bien', c.bien, 'vd', c.vd, 'nham', c.nham,
    'lq', (select jsonb_agg(jsonb_build_object('ma', x.ma, 'ten', x.ten, 'loai', x.loai) order by array_position(c.lq, x.ma))
           from sotay_cong_thuc x
           where x.ma = any(c.lq) and x.mon = c.mon and x.trang_thai = 'da_duyet' and x.xoa_at is null)))
  from sotay_cong_thuc c
  join sotay_ct_chu_de cd on cd.mon = c.mon and cd.khoi = c.khoi and cd.ma = c.chu_de
  left join sotay_ct_hinh h on h.mon = c.mon and h.khoi = c.khoi and h.ma = c.hinh
  where c.ma = p_ma and c.trang_thai = 'da_duyet' and c.xoa_at is null
$function$;
revoke all on function public._sotay_muc_json(text) from public;
revoke all on function public._sotay_muc_json(text) from anon;
