-- ============================================================================
-- 202608082111 — hinh_giai_tich_kho_rac
-- ----------------------------------------------------------------------------
-- VÌ SAO: migration trước (202608082109) tạo hgt_cau_hoi CLONE 0050_khtn_kho.sql, nhưng 0050 có
-- trước 0111_kho_rac_cau_hoi.sql (kho rác) nên thiếu cột/trigger/whitelist rác — nếu không vá,
-- xoá câu Hình giải tích sẽ xoá CỨNG (mất luôn, tài liệu cũ thiếu câu — đúng bug 07-21 đã sửa cho
-- dai_/khtn_). Vá NGAY, trước khi có câu thật nào được tạo.
--
-- MẤT GÌ: không (chỉ thêm cột/index/trigger mới trên bảng vừa tạo, chưa có dữ liệu; và
-- create-or-replace 1 function để MỞ whitelist thêm 'hgt_cau_hoi', không thu hẹp gì đang chạy).
-- ============================================================================

alter table hgt_cau_hoi add column if not exists xoa_at timestamptz;
comment on column hgt_cau_hoi.xoa_at is 'Có giá trị = câu nằm trong KHO RÁC: không cho chọn mới, nhưng vẫn resolve được để tài liệu cũ in đủ câu. NULL = đang dùng.';
create index if not exists hgt_cau_hoi_dang_song_idx on hgt_cau_hoi (dang_chinh) where xoa_at is null;

drop trigger if exists trg_log_kho_cau_hgt on hgt_cau_hoi;
create trigger trg_log_kho_cau_hgt after update or delete on hgt_cau_hoi for each row execute function log_kho_cau();

create or replace function public.count_cau_by_dang(p_tbl text)
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
  execute format(
    'select coalesce(jsonb_object_agg(dang_chinh, n), ''{}''::jsonb)
       from (select dang_chinh, count(*) n from %I where xoa_at is null group by dang_chinh) t',
    p_tbl
  ) into result;
  return result;
end $function$;
