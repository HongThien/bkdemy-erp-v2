-- ============================================================================
-- BÁO LỖI / GÓP Ý CỦA HỌC SINH ⇒ THẲNG VÀO HÒM THƯ ERP (Thùy 10/11: "báo lỗi của học sinh đến thẳng hộp thư của t và Công Hải trên ERP").
-- Học sinh gửi qua fn_hs_gui_gop_y (dòng bao_loi có hoc_sinh_id) ⇒ trigger gửi 1 thư "🔔 Hệ thống" vào hom_thu của từng người
-- trong danh sách nhận. Danh sách là BẢNG (đổi người nhận = sửa bảng, không sửa code): ban đầu Thùy (NS001) + Công Hải (NS008).
-- Thư có đủ nội dung (tên · mã · khối · môn · màn đang mở · mô tả · ảnh) để đọc ngay trong hòm thư; liên kết 'baoloi' mở màn
-- Quản lý báo lỗi cho ai có quyền màn đó. Gửi thư hỏng thì KHÔNG làm hỏng việc em gửi báo lỗi (nuốt lỗi, cảnh báo log).
-- ============================================================================

create table if not exists public.bao_loi_hs_nhan_thu (
  nhan_su_id uuid primary key references public.nhan_su(id) on delete cascade,
  them_at    timestamptz not null default now()
);
alter table public.bao_loi_hs_nhan_thu enable row level security;
drop policy if exists bao_loi_hs_nhan_thu_staff on public.bao_loi_hs_nhan_thu;
create policy bao_loi_hs_nhan_thu_staff on public.bao_loi_hs_nhan_thu for select to authenticated using ((select public.la_thanh_vien()));

insert into public.bao_loi_hs_nhan_thu (nhan_su_id)
select id from public.nhan_su where ma_ns in ('NS001', 'NS008')
on conflict do nothing;

do $$ begin
  if (select count(*) from public.bao_loi_hs_nhan_thu) <> 2 then
    raise exception 'Không thấy đủ 2 người nhận (NS001 Thùy, NS008 Công Hải)';
  end if;
end $$;

create or replace function public._bao_loi_hs_gui_hom_thu() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  v_ten text := coalesce(new.context->>'ho_ten', (select h.ho_ten from hoc_sinh h where h.id = new.hoc_sinh_id), 'Học sinh');
  v_ma  text := coalesce(new.context->>'ma_hs', (select h.ma_hs from hoc_sinh h where h.id = new.hoc_sinh_id), '');
  v_tieu text; v_noi text; r record;
begin
  if new.hoc_sinh_id is null then return new; end if;
  v_tieu := case when new.loai = 'bug' then '🐞 HS báo lỗi: ' else '💡 HS góp ý: ' end || v_ten || case when v_ma <> '' then ' (' || v_ma || ')' else '' end;
  v_noi := concat_ws(E'\n',
    new.mo_ta,
    '',
    concat_ws(' · ',
      nullif('Khối ' || coalesce(new.context->>'khoi', ''), 'Khối '),
      nullif(coalesce(new.context->>'mon', ''), ''),
      nullif('Màn: ' || coalesce(new.context->>'man', new.route, ''), 'Màn: '),
      case when (new.context->>'man_rong') is not null then (new.context->>'man_rong') || '×' || (new.context->>'man_cao') end),
    case when new.anh_url is not null then 'Ảnh: ' || new.anh_url end);
  begin
    for r in select nhan_su_id from bao_loi_hs_nhan_thu loop
      perform public._hom_thu_gui(r.nhan_su_id, 'he_thong', v_tieu, v_noi, 'baoloi', null);
    end loop;
  exception when others then
    raise warning 'bao_loi % gửi hòm thư lỗi: %', new.id, sqlerrm;   -- em vẫn gửi báo lỗi được
  end;
  return new;
end $$;
revoke all on function public._bao_loi_hs_gui_hom_thu() from public, anon;

drop trigger if exists trg_bao_loi_hs_hom_thu on public.bao_loi;
create trigger trg_bao_loi_hs_hom_thu after insert on public.bao_loi
  for each row when (new.hoc_sinh_id is not null) execute function public._bao_loi_hs_gui_hom_thu();
