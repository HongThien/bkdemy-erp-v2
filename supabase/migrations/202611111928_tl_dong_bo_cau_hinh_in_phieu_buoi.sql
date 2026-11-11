-- ============================================================================
-- 202611111928 — Phiếu buổi (giáo trình buổi / BTVN của lớp) theo CẤU HÌNH IN của giáo trình gốc
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 11/11 "builder như này nhưng tài liệu ko hiện số dòng đúng"): gán lớp (`trichBuoiBdm`) chép
--   NGUYÊN `cau_hinh` của giáo trình sang phiếu buổi đúng 1 lần. Sửa số dòng / chế độ hình / cỡ ảnh ở giáo trình
--   sau đó thì phiếu đã gán vẫn giữ số cũ. Đo thật: Giáo trình 7S1 HHC000837/832 = 30 dòng, phiếu
--   "BTVN 7S1 08/11 · Buổi 27" = 25.
-- LÀM GÌ:
--   · trigger `trg_tl_dong_bo_cau_hinh_in` (AFTER UPDATE OF cau_hinh trên tai_lieu loai 'giao_trinh'): khi 1 trong 6
--     mục cấu hình in đổi ⇒ chép mục đó sang mọi tài liệu `giao_trinh_buoi` / `btvn` có nguon_id = giáo trình này
--     (gộp theo mã câu: giá trị của giáo trình thắng, khoá riêng của phiếu giữ nguyên). Không đụng nội dung câu,
--     không đụng mục cấu hình khác (mã đề, điểm…).
--   · chép 1 lần cho các phiếu đã gán (cùng luật gộp) ⇒ phiếu hiện có khớp giáo trình ngay.
-- 6 mục: btvnLinesByCau · hinhCheDoByCau · anhMmByCau · anhPctByCau · anhPhaiByCau · colByCau.
-- MẤT GÌ: giá trị cấu hình in của phiếu buổi ở những câu mà giáo trình có giá trị khác (phiếu theo giáo trình — đúng ý).
-- ============================================================================

create or replace function public._tl_gop_cau_hinh_in(p_con jsonb, p_goc jsonb)
returns jsonb
language sql immutable
as $$
  select coalesce(p_con, '{}'::jsonb) || coalesce((
    select jsonb_object_agg(k, coalesce(p_con -> k, '{}'::jsonb) || (p_goc -> k))
      from unnest(array['btvnLinesByCau','hinhCheDoByCau','anhMmByCau','anhPctByCau','anhPhaiByCau','colByCau']) k
     where jsonb_typeof(p_goc -> k) = 'object'
  ), '{}'::jsonb)
$$;

create or replace function public._tl_dong_bo_cau_hinh_in()
returns trigger
language plpgsql
security definer   -- chép sang phiếu con của ĐÚNG giáo trình người dùng vừa lưu được; tránh RLS lọc mất phiếu (cập nhật 0 dòng im lặng)
set search_path = public
as $$
declare k text; v_doi boolean := false;
begin
  foreach k in array array['btvnLinesByCau','hinhCheDoByCau','anhMmByCau','anhPctByCau','anhPhaiByCau','colByCau'] loop
    if (new.cau_hinh -> k) is distinct from (old.cau_hinh -> k) then v_doi := true; end if;
  end loop;
  if not v_doi then return null; end if;
  update tai_lieu c
     set cau_hinh = public._tl_gop_cau_hinh_in(c.cau_hinh, new.cau_hinh), updated_at = now()
   where c.nguon_id = new.id and c.loai in ('giao_trinh_buoi', 'btvn')
     and c.cau_hinh is distinct from public._tl_gop_cau_hinh_in(c.cau_hinh, new.cau_hinh);
  return null;
end $$;

drop trigger if exists trg_tl_dong_bo_cau_hinh_in on public.tai_lieu;
create trigger trg_tl_dong_bo_cau_hinh_in
  after update of cau_hinh on public.tai_lieu
  for each row when (new.loai = 'giao_trinh')
  execute function public._tl_dong_bo_cau_hinh_in();

-- Chép 1 lần cho các phiếu đã gán
update tai_lieu c
   set cau_hinh = public._tl_gop_cau_hinh_in(c.cau_hinh, g.cau_hinh), updated_at = now()
  from tai_lieu g
 where c.nguon_id = g.id and g.loai = 'giao_trinh' and c.loai in ('giao_trinh_buoi', 'btvn')
   and c.cau_hinh is distinct from public._tl_gop_cau_hinh_in(c.cau_hinh, g.cau_hinh);

revoke all on function public._tl_gop_cau_hinh_in(jsonb, jsonb) from public;
revoke execute on function public._tl_gop_cau_hinh_in(jsonb, jsonb) from anon;
revoke all on function public._tl_dong_bo_cau_hinh_in() from public;
revoke execute on function public._tl_dong_bo_cau_hinh_in() from anon;
