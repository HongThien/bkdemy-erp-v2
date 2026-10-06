-- Học phí: nợ KHÔNG còn bị cộng dồn nhiều lần + sửa lại hoá đơn đã chốt (Thùy 06/10).
--
-- Triệu chứng: "nợ tháng trước đã thu xong mà hệ thống không trừ, vẫn cộng thêm vào tháng này".
-- Gốc: fn_hocphi_chot_ky đóng băng dòng "Nợ kỳ trước" (hoa_don_dong.loai='no_ky_truoc') vào hoa_don.tong_tien của
-- kỳ sau, nhưng fn_hocphi_so_du_no / fn_hocphi_no_theo_ph lại cộng tong_tien của MỌI hoá đơn đã chốt ⇒ khoản nợ cũ bị
-- đếm ≥2 lần (hoá đơn gốc + nằm trong hoá đơn kỳ sau). Hoá đơn kỳ sau chốt bằng số đã phình nên cũng sai theo.
--
-- Luật mới (nợ = phí MỚI của từng kỳ, không cộng lại phần mang sang):
--   nợ = nợ_đầu_kỳ + Σ(tong_tien − dòng no_ky_truoc) − Σ đã thu
--   nợ_đầu_kỳ = max(phu_huynh.no_khoi_tao, dòng no_ky_truoc của hoá đơn chốt ĐẦU TIÊN của PH)
--   (hoá đơn đầu tiên không có kỳ nào trước nó ⇒ khoản mang sang trong đó CHÍNH LÀ nợ khởi tạo đã thu/chưa thu lúc đó;
--    no_khoi_tao sau đó bị đặt về 0 nên không dùng một mình được).
-- Hoá đơn đã chốt từ kỳ thứ 2 trở đi: dòng no_ky_truoc đặt lại = max(0, nợ_đầu_kỳ + Σ phí các kỳ trước − Σ đã thu các hoá đơn trước),
--   tong_tien = phí kỳ đó + dòng mới, trạng thái thu tính lại theo luật của fn_hoa_don_cap_nhat_trang_thai.
--   Dòng về 0 thì để 0đ (không xoá dòng) — UI ẩn dòng nợ 0đ. Giá trị cũ giữ ở hoa_don_sua_no_20261006.
-- Không đổi hoá đơn kỳ đầu tiên (số đã gửi PH đúng). Không đổi chữ ký hàm.

-- 1) hai hàm đọc nợ
CREATE OR REPLACE FUNCTION public.fn_hocphi_so_du_no(p_ph uuid)
 RETURNS numeric
 LANGUAGE sql
 STABLE
AS $function$
  select greatest(coalesce((select no_khoi_tao from phu_huynh where id = p_ph), 0),
           coalesce((select sum(d.thanh_tien) from hoa_don_dong d
                     where d.loai = 'no_ky_truoc'
                       and d.hoa_don_id = (select h.id from hoa_don h where h.phu_huynh_id = p_ph and h.dong_at is not null order by h.ky limit 1)), 0))
       + coalesce((select sum(h.tong_tien - coalesce((select sum(d.thanh_tien) from hoa_don_dong d where d.hoa_don_id = h.id and d.loai = 'no_ky_truoc'), 0))
                   from hoa_don h where h.phu_huynh_id = p_ph and h.dong_at is not null), 0)
       - coalesce((select sum(t.so_tien) from thanh_toan t join hoa_don h on h.id = t.hoa_don_id
                   where h.phu_huynh_id = p_ph and h.dong_at is not null), 0)
$function$;

CREATE OR REPLACE FUNCTION public.fn_hocphi_no_theo_ph()
 RETURNS TABLE(phu_huynh_id uuid, no_khoi_tao numeric, no_he_thong numeric)
 LANGUAGE sql
 STABLE
AS $function$
  with hd as (
    select h.id, h.phu_huynh_id, h.ky,
           h.tong_tien - coalesce((select sum(d.thanh_tien) from hoa_don_dong d where d.hoa_don_id = h.id and d.loai = 'no_ky_truoc'), 0) as phi,
           coalesce((select sum(d.thanh_tien) from hoa_don_dong d where d.hoa_don_id = h.id and d.loai = 'no_ky_truoc'), 0) as mang_sang
    from hoa_don h where h.dong_at is not null
  ),
  tong as (
    select phu_huynh_id, sum(phi) as phi,
           (array_agg(mang_sang order by ky))[1] as mang_sang_dau
    from hd group by phu_huynh_id
  ),
  tt as (
    select h.phu_huynh_id, sum(t.so_tien) as thu
    from thanh_toan t join hoa_don h on h.id = t.hoa_don_id
    where h.dong_at is not null group by h.phu_huynh_id
  )
  select ph.id, coalesce(ph.no_khoi_tao, 0),
         (greatest(coalesce(ph.no_khoi_tao, 0), coalesce(tong.mang_sang_dau, 0)) - coalesce(ph.no_khoi_tao, 0))
           + coalesce(tong.phi, 0) - coalesce(tt.thu, 0)
  from phu_huynh ph
  left join tong on tong.phu_huynh_id = ph.id
  left join tt on tt.phu_huynh_id = ph.id
  where coalesce(ph.no_khoi_tao, 0) > 0 or tong.phu_huynh_id is not null
$function$;

-- 2) sao lưu giá trị cũ rồi sửa hoá đơn đã chốt (kỳ thứ 2 trở đi, chỉ khi dòng no_ky_truoc đổi)
CREATE TABLE public.hoa_don_sua_no_20261006 (
  hoa_don_id uuid primary key,
  phu_huynh_id uuid not null,
  ky date not null,
  tong_tien_cu numeric not null,
  no_ky_truoc_cu numeric not null,
  tong_tien_moi numeric not null,
  no_ky_truoc_moi numeric not null,
  trang_thai_cu text not null,
  created_at timestamptz not null default now()
);
ALTER TABLE public.hoa_don_sua_no_20261006 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.hoa_don_sua_no_20261006 FROM anon, authenticated;

INSERT INTO public.hoa_don_sua_no_20261006 (hoa_don_id, phu_huynh_id, ky, tong_tien_cu, no_ky_truoc_cu, tong_tien_moi, no_ky_truoc_moi, trang_thai_cu)
SELECT x.id, x.phu_huynh_id, x.ky, x.tong_tien, x.no_cu, x.phi + x.no_moi, x.no_moi, x.trang_thai
FROM (
  SELECT y.*,
    greatest(0, greatest(coalesce(y.no_khoi_tao, 0), y.no_dau) + coalesce(y.phi_truoc, 0) - coalesce(y.thu_truoc, 0)) AS no_moi
  FROM (
    SELECT hd.*, ph.no_khoi_tao, hd.tong_tien - hd.no_cu AS phi,
      row_number() OVER (PARTITION BY hd.phu_huynh_id ORDER BY hd.ky) AS stt,
      first_value(hd.no_cu) OVER (PARTITION BY hd.phu_huynh_id ORDER BY hd.ky) AS no_dau,
      sum(hd.tong_tien - hd.no_cu) OVER w AS phi_truoc,
      sum(hd.thu) OVER w AS thu_truoc
    FROM (
      SELECT h.id, h.phu_huynh_id, h.ky, h.tong_tien, h.trang_thai,
        (SELECT coalesce(sum(d.thanh_tien), 0) FROM hoa_don_dong d WHERE d.hoa_don_id = h.id AND d.loai = 'no_ky_truoc') AS no_cu,
        (SELECT coalesce(sum(t.so_tien), 0) FROM thanh_toan t WHERE t.hoa_don_id = h.id) AS thu
      FROM hoa_don h WHERE h.dong_at IS NOT NULL
    ) hd JOIN phu_huynh ph ON ph.id = hd.phu_huynh_id
    WINDOW w AS (PARTITION BY hd.phu_huynh_id ORDER BY hd.ky ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING)
  ) y
) x
WHERE x.stt > 1 AND x.no_moi <> x.no_cu
  AND EXISTS (SELECT 1 FROM hoa_don_dong d WHERE d.hoa_don_id = x.id AND d.loai = 'no_ky_truoc');

-- dòng nợ kỳ trước (mỗi hoá đơn đúng 1 dòng loại này — kiểm bên dưới trước khi ghi)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM hoa_don_dong d JOIN hoa_don_sua_no_20261006 b ON b.hoa_don_id = d.hoa_don_id
             WHERE d.loai = 'no_ky_truoc' GROUP BY d.hoa_don_id HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Có hoá đơn có >1 dòng no_ky_truoc — dừng, không tự đoán.';
  END IF;
END $$;

UPDATE hoa_don_dong d SET thanh_tien = b.no_ky_truoc_moi
FROM hoa_don_sua_no_20261006 b
WHERE d.hoa_don_id = b.hoa_don_id AND d.loai = 'no_ky_truoc';

UPDATE hoa_don h SET tong_tien = b.tong_tien_moi
FROM hoa_don_sua_no_20261006 b WHERE h.id = b.hoa_don_id;

-- trạng thái thu tính lại đúng luật của fn_hoa_don_cap_nhat_trang_thai (bỏ qua 'mien')
UPDATE hoa_don h SET
  trang_thai = CASE WHEN t.thu >= h.tong_tien THEN 'da_thu' WHEN t.thu > 0 THEN 'thu_mot_phan' ELSE 'chua_thu' END,
  trang_thai_tb = CASE WHEN t.thu >= h.tong_tien THEN 'hoan_thanh'
                       WHEN h.trang_thai_tb = 'hoan_thanh' THEN CASE WHEN h.bao_lan1_at IS NOT NULL THEN 'cho_xu_ly' ELSE 'thong_bao_1' END
                       ELSE h.trang_thai_tb END
FROM (SELECT b.hoa_don_id, coalesce((SELECT sum(so_tien) FROM thanh_toan WHERE hoa_don_id = b.hoa_don_id), 0) AS thu
      FROM hoa_don_sua_no_20261006 b) t
WHERE h.id = t.hoa_don_id AND h.trang_thai <> 'mien';
