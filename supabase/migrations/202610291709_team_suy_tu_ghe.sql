-- ============================================================================
-- team_suy_tu_ghe — Thùy 29/10: "nhân sự thuộc màn team nào thì tự động có tag team đó" — bỏ tick team tay.
-- Team của 1 người = các team mà người đó CÓ GHẾ trên sơ đồ (vi_tri). nhan_su_team giữ nguyên làm bảng ĐỌC (mọi chỗ đang đọc
-- không phải sửa) nhưng chỉ còn TRIGGER này ghi: ngồi vào ghế ⇒ có tag; rời ghế cuối cùng của team đó ⇒ mất tag.
-- Màn Nhân sự bỏ ô tick team (client). Bù 1 lần: người có ghế mà chưa có tag ⇒ thêm tag.
-- KHÔNG xoá ở đây: các tag tay KHÔNG có ghế tương ứng (22 dòng đo 29/10) — chờ Thùy gật theo Luật xoá.
-- ============================================================================

create or replace function public._nst_dong_bo(p_ns uuid, p_team uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_ns is null or p_team is null then return; end if;
  if exists (select 1 from vi_tri where nhan_su_id = p_ns and team_id = p_team) then
    insert into nhan_su_team (nhan_su_id, team_id) select p_ns, p_team
      where not exists (select 1 from nhan_su_team where nhan_su_id = p_ns and team_id = p_team);
  else
    delete from nhan_su_team where nhan_su_id = p_ns and team_id = p_team;
  end if;
end $$;

create or replace function public._trg_vi_tri_dong_bo_team()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then perform public._nst_dong_bo(old.nhan_su_id, old.team_id); end if;
  if tg_op in ('INSERT', 'UPDATE') then perform public._nst_dong_bo(new.nhan_su_id, new.team_id); end if;
  return null;
end $$;

drop trigger if exists trg_vi_tri_dong_bo_team on vi_tri;
create trigger trg_vi_tri_dong_bo_team after insert or update of nhan_su_id, team_id or delete on vi_tri
  for each row execute function public._trg_vi_tri_dong_bo_team();

-- Bù 1 lần: có ghế mà chưa có tag
insert into nhan_su_team (nhan_su_id, team_id)
select distinct v.nhan_su_id, v.team_id from vi_tri v
 where v.nhan_su_id is not null
   and not exists (select 1 from nhan_su_team nt where nt.nhan_su_id = v.nhan_su_id and nt.team_id = v.team_id);

revoke execute on function public._nst_dong_bo(uuid, uuid) from public, anon;
revoke execute on function public._trg_vi_tri_dong_bo_team() from public, anon;
