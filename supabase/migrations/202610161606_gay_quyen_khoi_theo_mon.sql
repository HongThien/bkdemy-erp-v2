-- ============================================================================
-- gay_quyen_khoi_theo_mon — quyền gậy theo khối phải kèm MÔN (CLAUDE §1.6: mỗi môn
-- = 1 trung tâm riêng). Trưởng khối Toán 9 không xử lý gậy GV lớp 9E1 (Anh) / 9K1 (KHTN).
-- mon rỗng = mọi môn (chỉ hợp với toan_quyen). 4 trưởng khối Thùy giao 16/10 đều là Toán.
-- ============================================================================

alter table public.gay_quyen_khoi add column if not exists mon text[] not null default '{}';
update public.gay_quyen_khoi set mon = '{Toán}' where not toan_quyen and mon = '{}';

create or replace function public.fn_gay_pham_vi_khoi()
returns jsonb
language sql stable
set search_path = public
as $$
  with toi as (
    select q.nhan_su_id, q.toan_quyen, q.khoi, q.mon
    from gay_quyen_khoi q where q.nhan_su_id = public.current_nhan_su_id()
  ),
  lop_toi as (
    select l.id from lop l, toi t
    where l.khoi = any(t.khoi) and (t.mon = '{}' or l.mon = any(t.mon))
  )
  select coalesce((
    select jsonb_build_object(
      'toan_quyen', t.toan_quyen,
      'khoi', to_jsonb(t.khoi),
      'mon', to_jsonb(t.mon),
      'ns_ids', coalesce((
        select jsonb_agg(distinct pc.nhan_su_id)
        from phan_cong_lop pc join lop_toi l on l.id = pc.lop_id
        where pc.nhan_su_id <> t.nhan_su_id), '[]'::jsonb),
      'de_xuat_ids', coalesce((
        select jsonb_agg(d.id)
        from gay_de_xuat d
        join buoi_hoc b on b.id::text = substring(d.ref_key from '^vh:([0-9a-f-]{36})[|]')
        join lop_toi l on l.id = b.lop_id
        where d.trang_thai = 'cho' and d.nhan_su_id <> t.nhan_su_id), '[]'::jsonb))
    from toi t),
    jsonb_build_object('toan_quyen', false, 'khoi', '[]'::jsonb, 'mon', '[]'::jsonb, 'ns_ids', '[]'::jsonb, 'de_xuat_ids', '[]'::jsonb));
$$;

revoke execute on function public.fn_gay_pham_vi_khoi() from public;
revoke execute on function public.fn_gay_pham_vi_khoi() from anon;
grant execute on function public.fn_gay_pham_vi_khoi() to authenticated;
