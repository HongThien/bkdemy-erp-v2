-- Đợt 0d (spec-kien-truc.md §7, K14) — khoá quyền GHI các bảng lõi phân quyền + đóng hàm gửi push. Thùy 14/11 "Làm đợt 0 còn dở".
-- HIỆN TRẠNG (đo 14/11): tai_khoan · nhan_su · vi_tri · vai_tro · vai_tro_chuc_nang đều chỉ có policy `<bảng>_member_all` (ALL, la_thanh_vien)
--   ⇒ BẤT KỲ nhân sự nào (TA, GV) gọi thẳng API là: tự bật nhan_su.la_admin_he_thong · nối tài khoản mình sang nhân sự khác ·
--     tự gán vai trò · sửa chức năng của vai trò. Màn hình không lộ nút, nhưng API không chặn.
-- SAU: ĐỌC giữ nguyên (mọi nhân sự). GHI theo đúng người đang dùng các màn đó (ns / orgchart / phanquyen / hs — hiện cùng 3 người + admin):
--   tai_khoan            : dòng nhân sự ⇒ co_quyen_ghi('ns') · dòng học sinh ⇒ co_quyen_ghi('hs')
--   vai_tro, vai_tro_chuc_nang : co_quyen_ghi('phanquyen')
--   vi_tri               : co_quyen_ghi('ns') | ('orgchart') | ('phanquyen')
--   nhan_su              : thêm / xoá ⇒ co_quyen_ghi('ns'); sửa ⇒ trigger theo CỘT (bên dưới)
-- Hàm security definer (chủ bảng) và tác vụ nền không qua RLS / không bị trigger chặn ⇒ không đổi.

-- ───────── 1) tai_khoan ─────────
drop policy tai_khoan_member_all on public.tai_khoan;
create policy tai_khoan_member_select on public.tai_khoan for select to authenticated using ((select public.la_thanh_vien()));
create policy tai_khoan_ghi_them on public.tai_khoan for insert to authenticated with check (
  (nhan_su_id is not null and hoc_sinh_id is null and (select public.co_quyen_ghi('ns')))
  or (hoc_sinh_id is not null and nhan_su_id is null and (select public.co_quyen_ghi('hs'))));
create policy tai_khoan_ghi_sua on public.tai_khoan for update to authenticated
  using ((nhan_su_id is not null and (select public.co_quyen_ghi('ns'))) or (hoc_sinh_id is not null and (select public.co_quyen_ghi('hs')))
         or (nhan_su_id is null and hoc_sinh_id is null and (select public.co_quyen_ghi('ns'))))
  with check ((nhan_su_id is not null and hoc_sinh_id is null and (select public.co_quyen_ghi('ns')))
              or (hoc_sinh_id is not null and nhan_su_id is null and (select public.co_quyen_ghi('hs'))));
create policy tai_khoan_ghi_xoa on public.tai_khoan for delete to authenticated
  using ((nhan_su_id is not null and (select public.co_quyen_ghi('ns'))) or (hoc_sinh_id is not null and (select public.co_quyen_ghi('hs')))
         or (nhan_su_id is null and hoc_sinh_id is null and (select public.co_quyen_ghi('ns'))));

-- ───────── 2) vai_tro, vai_tro_chuc_nang ─────────
drop policy vai_tro_member_all on public.vai_tro;
create policy vai_tro_member_select on public.vai_tro for select to authenticated using ((select public.la_thanh_vien()));
create policy vai_tro_ghi_them on public.vai_tro for insert to authenticated with check ((select public.co_quyen_ghi('phanquyen')));
create policy vai_tro_ghi_sua  on public.vai_tro for update to authenticated using ((select public.co_quyen_ghi('phanquyen'))) with check ((select public.co_quyen_ghi('phanquyen')));
create policy vai_tro_ghi_xoa  on public.vai_tro for delete to authenticated using ((select public.co_quyen_ghi('phanquyen')));

drop policy vai_tro_chuc_nang_member_all on public.vai_tro_chuc_nang;
create policy vai_tro_chuc_nang_member_select on public.vai_tro_chuc_nang for select to authenticated using ((select public.la_thanh_vien()));
create policy vai_tro_chuc_nang_ghi_them on public.vai_tro_chuc_nang for insert to authenticated with check ((select public.co_quyen_ghi('phanquyen')));
create policy vai_tro_chuc_nang_ghi_sua  on public.vai_tro_chuc_nang for update to authenticated using ((select public.co_quyen_ghi('phanquyen'))) with check ((select public.co_quyen_ghi('phanquyen')));
create policy vai_tro_chuc_nang_ghi_xoa  on public.vai_tro_chuc_nang for delete to authenticated using ((select public.co_quyen_ghi('phanquyen')));

-- ───────── 3) vi_tri ─────────
drop policy vi_tri_member_all on public.vi_tri;
create policy vi_tri_member_select on public.vi_tri for select to authenticated using ((select public.la_thanh_vien()));
create policy vi_tri_ghi_them on public.vi_tri for insert to authenticated
  with check ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')));
create policy vi_tri_ghi_sua on public.vi_tri for update to authenticated
  using ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')))
  with check ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')));
create policy vi_tri_ghi_xoa on public.vi_tri for delete to authenticated
  using ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')));

-- ───────── 4) nhan_su ─────────
drop policy nhan_su_member_all on public.nhan_su;
create policy nhan_su_member_select on public.nhan_su for select to authenticated using ((select public.la_thanh_vien()));
create policy nhan_su_ghi_them on public.nhan_su for insert to authenticated with check ((select public.co_quyen_ghi('ns')));
create policy nhan_su_ghi_xoa  on public.nhan_su for delete to authenticated using ((select public.co_quyen_ghi('ns')));
-- sửa: mọi nhân sự qua được policy (ai cũng tự sửa hồ sơ mình), CỘT nào được sửa do trigger quyết
create policy nhan_su_ghi_sua  on public.nhan_su for update to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

-- Trigger theo cột. Chỉ áp cho lượt ghi THẲNG của người đăng nhập (current_user = 'authenticated');
-- hàm security definer / tác vụ nền / service_role không bị chặn. (Biến bk.thu_goi_truc_tiep chỉ để chạy thử — bật nó chỉ làm CHẶT hơn.)
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
    return new;   -- quyền THÊM do policy nhan_su_ghi_them quyết
  end if;

  if new.id is distinct from old.id then raise exception 'Không được đổi id nhân sự (mã gốc bất biến).' using errcode = '42501'; end if;
  if new.la_admin_he_thong is distinct from old.la_admin_he_thong and not v_adm then
    raise exception 'Chỉ admin hệ thống được cấp / gỡ quyền admin hệ thống.' using errcode = '42501';
  end if;
  if public.co_quyen_ghi('ns') then return new; end if;

  a := to_jsonb(old); b := to_jsonb(new);
  if new.id = v_me then
    if (a - c_tu_sua) is distinct from (b - c_tu_sua) then
      raise exception 'Bạn chỉ tự sửa được thông tin cá nhân của mình (SĐT, email, ảnh, tài khoản ngân hàng, giao diện).' using errcode = '42501';
    end if;
    return new;
  end if;
  -- hồ sơ người khác: người có quyền ghi Gậy chỉ được bật / tắt miễn gậy (màn Gậy)
  if (a - array['mien_gay', 'updated_at']) is not distinct from (b - array['mien_gay', 'updated_at']) and public.co_quyen_ghi('gay') then
    return new;
  end if;
  raise exception 'Không có quyền sửa hồ sơ của nhân sự khác.' using errcode = '42501';
end $function$;
revoke all on function public._trg_nhan_su_chan_ghi() from public, anon, authenticated;

create trigger trg_nhan_su_chan_ghi before insert or update on public.nhan_su
  for each row execute function public._trg_nhan_su_chan_ghi();

-- ───────── 5) Hàm gửi push: chỉ trigger được gọi ─────────
-- Trước: _push_bao_cap_nhat(nhân sự, app) mở cho mọi người đăng nhập (kể cả HS) ⇒ gọi thẳng API là bắn thông báo vào máy bất kỳ nhân sự nào.
-- 3 trigger gọi nó đang chạy bằng quyền người gây ra thay đổi ⇒ đổi sang security definer (thân không dùng danh tính người gọi) rồi mới thu quyền.
alter function public._trg_ta_buoi_hoc_push() security definer;
alter function public._trg_ta_retest_push()   security definer;
alter function public._trg_task_pt_push()     security definer;
revoke all on function public._trg_ta_buoi_hoc_push(), public._trg_ta_retest_push(), public._trg_task_pt_push() from public, anon, authenticated;
revoke all on function public._push_bao_cap_nhat(uuid, text) from public, anon, authenticated;
