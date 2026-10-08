-- ============================================================================
-- 202610081800 — ops_duyet_theo_ngay
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 08/10 — "Phần duyệt của Lộc cần được tổng hợp lại toàn bộ một ngày vào 1 chỗ để duyệt 1 lần
-- cho xong. Đưa phần đấy ra Việc của tôi." Chốt phạm vi: Report trước buổi + Báo tan + Prep phòng; cách duyệt:
-- 1 nút "Duyệt cả ngày" + sửa NGOẠI LỆ từng dòng (hạ chất lượng) trước khi bấm.
-- Trước đó: Report/Báo tan duyệt theo TUẦN ở màn Report (1 nút auto-pass), Prep chốt TỪNG lượt ở màn Prep
-- (~21 lượt/ngày) ⇒ tồn ~805 report/tan + 554 prep chưa duyệt từ tháng 7.
--  · "Việc của 1 ngày" = vh_ops_task.ngay (report: ngày GỬI, tối hôm trước) / prep_phong.ngay.
--  · Chỉ dòng ĐÃ ĐÓNG (dong_at) mà CHƯA duyệt (vh_ops_task.duyet_at / prep_phong.leader_chot_at).
--  · Hạn lấy từ fn_viec_ops_thuong (1 nguồn công thức hạn) — nối theo tiền tố ref_key.
--  · Chất lượng = vh_ops_task.chat_luong / prep_phong.gv_diem_nen (đúng cột fn_ops_viec_nhom_thang đọc:
--    gậy tính ĐẠT khi đúng hạn VÀ chất lượng ≥ 80). Ngoại lệ = hạ con số này.
--  · Ghi duyệt ĐÚNG danh sách màn đã hiện (p_items) — dòng đóng sau lúc tải không bị duyệt "mù".
--  · Người duyệt: trưởng/phó team Vận hành (vi_tri, team.ma='ops') hoặc admin hệ thống.
--
-- MẤT GÌ: không mất gì (chỉ thêm hàm).
-- ============================================================================

create or replace function fn_ops_la_nguoi_duyet()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
      select 1 from vi_tri v join team t on t.id = v.team_id
       where t.ma = 'ops' and v.cap in ('truong', 'pho') and v.nhan_su_id = public.current_nhan_su_id())
    or coalesce((select la_admin_he_thong from nhan_su where id = public.current_nhan_su_id()), false)
$$;

-- Danh sách CHỜ DUYỆT trong khoảng ngày (mỗi dòng 1 việc đã đóng chưa duyệt) kèm hạn + số phút trễ.
create or replace function fn_ops_cho_duyet(p_tu date, p_den date)
returns table(loai text, ngay date, tkb_id uuid, phong text, luot text, ten_viec text, ca text,
              nhan_su_ten text, anh_url text, dong_at timestamptz, han timestamptz, tre_phut integer, chat_luong numeric)
language sql stable security invoker set search_path = public as $$
  with han as (
    select split_part(v.ref_key, '|', 1) as k, v.han
      from public.fn_viec_ops_thuong(p_tu, p_den, true) v
     where v.tab in ('ops_report', 'ops_tan', 'ops_prep')
  ),
  rows as (
    select o.tab as loai, o.ngay, o.tkb_id, null::text as phong, null::text as luot,
           (case o.tab when 'report' then 'Report — ' else 'Báo tan — ' end) || l.ten_lop as ten_viec,
           public.fn_ca_cua_gio(t.gio_bat_dau) as ca, ns.ho_ten as nhan_su_ten, o.anh_url, o.dong_at, o.chat_luong,
           'vh:ops:' || o.tkb_id::text || '@' || o.ngay::text as k
      from vh_ops_task o
      join thoi_khoa_bieu t on t.id = o.tkb_id
      join lop l on l.id = t.lop_id
      left join nhan_su ns on ns.id = o.nhan_su_id
     where o.ngay between p_tu and p_den and o.dong_at is not null and o.duyet_at is null
    union all
    select 'prep', p.ngay, null::uuid, p.phong, p.luot,
           'Prep phòng ' || p.phong, p.luot, ns.ho_ten, p.anh_url, p.dong_at, p.gv_diem_nen,
           'vh:ops:' || p.phong || '@' || p.ngay::text || '@' || p.luot
      from prep_phong p
      -- prep_phong.nhan_su_id thường TRỐNG (dongPrep không ghi) ⇒ lấy người trực ca của lượt đó.
      left join nhan_su ns on ns.id = coalesce(p.nhan_su_id, public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(p.ngay), p.luot, p.ngay))
     where p.ngay between p_tu and p_den and p.dong_at is not null and p.leader_chot_at is null
  )
  select r.loai, r.ngay, r.tkb_id, r.phong, r.luot, r.ten_viec, r.ca, r.nhan_su_ten, r.anh_url, r.dong_at,
         h.han,
         (case when h.han is not null and r.dong_at > h.han
               then ceil(extract(epoch from (r.dong_at - h.han)) / 60)::int else 0 end) as tre_phut,
         r.chat_luong
    from rows r
    left join (select distinct on (k) k, han from han order by k, han) h on h.k = r.k
   order by r.ngay desc, (case r.loai when 'report' then 1 when 'tan' then 2 else 3 end), r.ca nulls last, r.ten_viec
$$;

-- Duyệt CẢ NGÀY: ghi chất lượng (ngoại lệ) + dấu duyệt cho ĐÚNG các dòng gửi lên, 1 transaction.
-- p_items: [{ "loai": "report"|"tan"|"prep", "tkb_id": uuid?, "phong": text?, "luot": text?, "chat_luong": number }]
create or replace function fn_ops_duyet_ngay(p_ngay date, p_items jsonb)
returns integer language plpgsql security invoker set search_path = public as $$
declare
  v_me uuid := public.current_nhan_su_id();
  n1 int := 0; n2 int := 0;
begin
  if not public.fn_ops_la_nguoi_duyet() then
    raise exception 'Chỉ trưởng/phó Vận hành (hoặc admin) được duyệt việc OPS.';
  end if;
  if exists (select 1 from jsonb_array_elements(p_items) e
              where coalesce((e->>'chat_luong')::numeric, 100) not between 0 and 100) then
    raise exception 'Chất lượng phải trong 0–100.';
  end if;

  update vh_ops_task o
     set chat_luong = coalesce((e->>'chat_luong')::numeric, o.chat_luong), nguoi_duyet = v_me, duyet_at = now()
    from jsonb_array_elements(p_items) e
   where e->>'loai' in ('report', 'tan') and o.tab = e->>'loai' and o.tkb_id = (e->>'tkb_id')::uuid
     and o.ngay = p_ngay and o.dong_at is not null and o.duyet_at is null;
  get diagnostics n1 = row_count;

  update prep_phong p
     set gv_diem_nen = coalesce((e->>'chat_luong')::numeric, p.gv_diem_nen),
         gv_cham_at = case when (e->>'chat_luong')::numeric is distinct from p.gv_diem_nen then now() else p.gv_cham_at end,
         leader_chot_at = now()
    from jsonb_array_elements(p_items) e
   where e->>'loai' = 'prep' and p.phong = e->>'phong' and p.luot = e->>'luot'
     and p.ngay = p_ngay and p.dong_at is not null and p.leader_chot_at is null;
  get diagnostics n2 = row_count;

  return n1 + n2;
end $$;

revoke execute on function fn_ops_la_nguoi_duyet() from public, anon;
revoke execute on function fn_ops_cho_duyet(date, date) from public, anon;
revoke execute on function fn_ops_duyet_ngay(date, jsonb) from public, anon;
grant execute on function fn_ops_la_nguoi_duyet() to authenticated;
grant execute on function fn_ops_cho_duyet(date, date) to authenticated;
grant execute on function fn_ops_duyet_ngay(date, jsonb) to authenticated;
