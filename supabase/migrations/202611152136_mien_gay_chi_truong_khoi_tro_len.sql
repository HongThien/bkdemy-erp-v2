-- ============================================================================
-- 202611152136 — mien_gay_chi_truong_khoi_tro_len
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy chốt 15/11: "Miễn gậy chỉ có từ trưởng khối trở lên". Trước: ai có quyền GHI chức năng 'gay' (20 người, kể cả 3 thành viên
--   thường và 2 phó khối) hoặc quyền ghi hồ sơ 'ns' đều bật / tắt được nhan_su.mien_gay của người khác (mig 202611141114, đợt 0d).
--   Sau: đổi cột mien_gay CHỈ khi người gọi là "trưởng khối trở lên" = MỘT hàm fn_gay_duoc_doi_mien():
--     admin hệ thống · trưởng/phó team QLCL (_qlcl_toan_he) · trưởng/phó team core (ban lãnh đạo — Claude xếp vào "trở lên";
--     Thùy không muốn thì bỏ nhánh core ở hàm này) · quản lý môn (_quan_ly_mon) · trưởng khối (phan_cong_quan_ly_khoi vai 'truong').
--     PHÓ khối KHÔNG được. Quyền ghi 'gay' / 'ns' không còn đủ để đổi mien_gay; ngược lại trưởng khối trở lên đổi được dù không có quyền ghi 'gay'.
--   Đo 15/11: 14 người đủ điều kiện theo 4 nhánh đầu + 1 người thuộc nhánh core; 5 người mất quyền này (3 thành viên, 2 phó khối).
--   Hàm đặt tên fn_ (không phải _) vì màn Gậy cũng gọi nó để ẩn nút với người không đủ điều kiện — một nguồn cho cả trigger lẫn màn.
--   Không ai tự miễn gậy cho chính mình qua đường "tự sửa hồ sơ" (mien_gay không nằm trong cột tự sửa) — giữ nguyên.
--   Trigger vẫn chỉ áp cho lượt ghi thẳng của người đăng nhập (hàm definer / tác vụ nền không qua nhánh này) — giữ nguyên.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá dữ liệu. THU HẸP QUYỀN: 5 người đang có quyền ghi 'gay' mà không phải trưởng khối trở lên hết bật / tắt được miễn gậy.
--   Hai người đang được miễn gậy giữ nguyên trạng thái.
-- ============================================================================

do $$
begin
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'public._trg_nhan_su_chan_ghi()'::regprocedure) <> 'cb8796590e823f11411fb3362342b22c' then
    raise exception '_trg_nhan_su_chan_ghi đã khác bản lúc viết migration (15/11) — đọc lại thân hàm trước khi áp.';
  end if;
end $$;

-- "Tôi có được bật / tắt miễn gậy không" — trưởng khối trở lên. Chỉ trả lời về CHÍNH người gọi (current_nhan_su_id), không nhận tham số người.
create or replace function public.fn_gay_duoc_doi_mien()
 returns boolean
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select public.current_nhan_su_id() is not null and (
       public._qlcl_toan_he()                                   -- admin hệ thống · trưởng/phó team QLCL
    or cardinality(public._quan_ly_mon()) > 0                   -- quản lý môn (trưởng bộ môn)
    or exists (select 1 from public._khoi_quan_ly() q           -- trưởng khối (không tính phó)
                where q.nhan_su_id = public.current_nhan_su_id() and q.cap = 'truong')
    or exists (select 1 from vi_tri v join team t on t.id = v.team_id and t.ma = 'core'   -- ban lãnh đạo
                where v.nhan_su_id = public.current_nhan_su_id() and v.cap in ('truong', 'pho')))
$function$;

create or replace function public._trg_nhan_su_chan_ghi()
 returns trigger
 language plpgsql
 set search_path to 'public'
as $function$
declare
  v_me  uuid;
  v_adm boolean;
  c_tu_sua constant text[] := array['so_dien_thoai', 'email', 'anh_url', 'updated_at', 'bank_bin', 'bank_stk', 'bank_chu_tk',
                                    'phim_tat_cong_thuc', 'menu_yeu_thich', 'erp_giao_dien', 'home_bo_cuc', 'giao_dien'];
  a jsonb; b jsonb;
begin
  if not (current_user = 'authenticated' or coalesce(current_setting('bk.thu_goi_truc_tiep', true), '') = '1') then return new; end if;
  v_me  := public.current_nhan_su_id();
  v_adm := coalesce((select n.la_admin_he_thong from public.nhan_su n where n.id = v_me), false);

  if TG_OP = 'INSERT' then
    if coalesce(new.la_admin_he_thong, false) and not v_adm then
      raise exception 'Chỉ admin hệ thống được cấp quyền admin hệ thống.' using errcode = '42501';
    end if;
    if coalesce(new.mien_gay, false) and not public.fn_gay_duoc_doi_mien() then   -- 15/11: miễn gậy chỉ trưởng khối trở lên
      raise exception 'Chỉ trưởng khối trở lên được bật / tắt miễn gậy.' using errcode = '42501';
    end if;
    return new;   -- quyền THÊM do policy nhan_su_ghi_them quyết
  end if;

  if new.id is distinct from old.id then raise exception 'Không được đổi id nhân sự (mã gốc bất biến).' using errcode = '42501'; end if;
  if new.la_admin_he_thong is distinct from old.la_admin_he_thong and not v_adm then
    raise exception 'Chỉ admin hệ thống được cấp / gỡ quyền admin hệ thống.' using errcode = '42501';
  end if;
  -- 15/11 (Thùy): miễn gậy chỉ trưởng khối trở lên — xét TRƯỚC lối tắt quyền ghi 'ns', nên quyền ghi hồ sơ cũng không đủ.
  if new.mien_gay is distinct from old.mien_gay and not public.fn_gay_duoc_doi_mien() then
    raise exception 'Chỉ trưởng khối trở lên được bật / tắt miễn gậy.' using errcode = '42501';
  end if;
  if public.co_quyen_ghi('ns') then return new; end if;

  a := to_jsonb(old); b := to_jsonb(new);
  if new.id = v_me then
    if (a - c_tu_sua) is distinct from (b - c_tu_sua) then
      raise exception 'Bạn chỉ tự sửa được thông tin cá nhân của mình (SĐT, email, ảnh, tài khoản ngân hàng, giao diện).' using errcode = '42501';
    end if;
    return new;
  end if;
  -- hồ sơ người khác: trưởng khối trở lên chỉ được bật / tắt miễn gậy (màn Gậy). Tới đây mien_gay có đổi thì người gọi đã đủ điều kiện (kiểm ở trên).
  if (a - array['mien_gay', 'updated_at']) is not distinct from (b - array['mien_gay', 'updated_at']) and public.fn_gay_duoc_doi_mien() then
    return new;
  end if;
  raise exception 'Không có quyền sửa hồ sơ của nhân sự khác.' using errcode = '42501';
end $function$;
