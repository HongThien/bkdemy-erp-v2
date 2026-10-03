-- ĐẤU TỪ: bỏ nhân vật 3D KayKit, dùng nhân vật 2D tranh vẽ của app HS (Thùy 03/10: "không dùng 3D… ảnh đại diện KayKit xấu").
-- id mới: tham_hiem_nam · tham_hiem_nu · hiep_si_dem · phap_su (khớp NHAN_VAT trong src/dautu/ui/Chung.tsx).
-- Thân hàm dựng từ pg_get_functiondef bản đang chạy (03/10), chỉ đổi danh sách hợp lệ + mặc định.

create or replace function public.fn_dtv_ho_so_luu(p_uid text, p_ten text, p_nv text)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_ma text;
begin
  if p_nv not in ('tham_hiem_nam','tham_hiem_nu','hiep_si_dem','phap_su') then p_nv := 'tham_hiem_nam'; end if;
  if exists (select 1 from dtv_nguoi_choi where uid = p_uid) then
    update dtv_nguoi_choi set ten = btrim(p_ten), nv = p_nv, cap_nhat_at = now() where uid = p_uid;
  else
    loop
      v_ma := 'BK-' || lpad((floor(random() * 100000))::int::text, 5, '0');
      exit when not exists (select 1 from dtv_nguoi_choi where ma = v_ma);
    end loop;
    insert into dtv_nguoi_choi (uid, ma, ten, nv) values (p_uid, v_ma, btrim(p_ten), p_nv);
  end if;
  return _dtv_ho_so_json(p_uid);
end $function$;

-- Hồ sơ đã tạo bằng id cũ ⇒ quy đổi (cùng luật nvChuan ở client): mage/druid → phap_su, còn lại → tham_hiem_nam.
update dtv_nguoi_choi set nv = case when nv in ('mage','druid') then 'phap_su' else 'tham_hiem_nam' end
 where nv not in ('tham_hiem_nam','tham_hiem_nu','hiep_si_dem','phap_su');

alter table dtv_nguoi_choi alter column nv set default 'tham_hiem_nam';
