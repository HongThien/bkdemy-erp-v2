-- spec-quan-ly-chat-luong.md §11.0 câu 8 + §11.2 mục 2, 3 — Thùy 18/11 "Bịt ngay".

-- ── (A) NHÃN TEAM: trước, mọi nhân sự ghi thẳng nhan_su_team / team ⇒ tự thêm nhãn ops / media / marketing là fn_mon_cua_toi trả "mọi môn".
--        Sau: ai cũng đọc; GHI chỉ người có quyền nhân sự / sơ đồ tổ chức / phân quyền — đúng khuôn policy của bảng vi_tri.
drop policy if exists nhan_su_team_member_all on public.nhan_su_team;
create policy nhan_su_team_doc on public.nhan_su_team for select to authenticated using ((select public.la_thanh_vien()));
create policy nhan_su_team_ghi on public.nhan_su_team for all to authenticated
  using ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')))
  with check ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')));
drop policy if exists team_member_all on public.team;
create policy team_doc on public.team for select to authenticated using ((select public.la_thanh_vien()));
create policy team_ghi on public.team for all to authenticated
  using ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')))
  with check ((select public.co_quyen_ghi('ns')) or (select public.co_quyen_ghi('orgchart')) or (select public.co_quyen_ghi('phanquyen')));

-- ── (B) CÔNG BỐ BÁO CÁO HỌC KÌ gửi phụ huynh: Thùy 18/11 — người công bố là TRƯỞNG KHỐI (không phải giáo viên / TA / Phó khối).
--        Được công bố / mở lại = quản trị · trưởng / phó QLCL · quản lý môn (= trưởng bộ môn) của môn đó · TRƯỞNG khối của (môn, khối lớp em đang học môn đó).
create or replace function public._bc_ky_duoc_cong_bo(p_hs uuid, p_mon text) returns boolean
language sql stable security definer set search_path to 'public' as $$
  select public.current_nhan_su_id() is not null and (
       public._qlcl_toan_he()
    or p_mon = any(public._quan_ly_mon())
    or exists (select 1 from public._khoi_quan_ly() q
                 join lop l on l.mon = q.mon and l.khoi = q.khoi
                 join hoc_sinh_lop hl on hl.lop_id = l.id and hl.hoc_sinh_id = p_hs
                where q.nhan_su_id = public.current_nhan_su_id() and q.cap = 'truong' and q.mon = p_mon))
$$;
revoke all on function public._bc_ky_duoc_cong_bo(uuid, text) from public, anon;
grant execute on function public._bc_ky_duoc_cong_bo(uuid, text) to authenticated;

-- Chốt chặn ở BẢNG (mọi đường ghi, kể cả ghi thẳng qua API): đổi trạng thái công bố mà không có quyền ⇒ chặn.
-- Nhập / sửa nội dung báo cáo CHƯA công bố vẫn như cũ (giáo viên nhập). 3 hàm fn_bc_ky_cong_bo / _cong_bo_lop / _mo_lai chạy quyền người gọi ⇒ đi qua đúng trigger này.
create or replace function public._bao_cao_ph_ky_quyen_cong_bo() returns trigger
language plpgsql set search_path to 'public' as $$
begin
  if (tg_op = 'INSERT' and new.cong_bo_at is not null)
     or (tg_op = 'UPDATE' and new.cong_bo_at is distinct from old.cong_bo_at) then
    if public.jwt_uid() is not null and not public._bc_ky_duoc_cong_bo(new.hoc_sinh_id, new.mon) then
      raise exception 'Chỉ trưởng khối (hoặc quản lý môn / Quản lý chất lượng) được công bố hay mở lại báo cáo học kì gửi phụ huynh.' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;
revoke all on function public._bao_cao_ph_ky_quyen_cong_bo() from public, anon, authenticated;
drop trigger if exists trg_bao_cao_ph_ky_quyen_cong_bo on public.bao_cao_ph_ky;
create trigger trg_bao_cao_ph_ky_quyen_cong_bo before insert or update on public.bao_cao_ph_ky
  for each row execute function public._bao_cao_ph_ky_quyen_cong_bo();
