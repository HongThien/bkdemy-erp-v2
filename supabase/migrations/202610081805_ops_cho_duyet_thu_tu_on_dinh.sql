-- VÌ SAO: app đọc fn_ops_cho_duyet THEO TRANG 1000 dòng (PostgREST cắt ở 1000). Phân trang chỉ đúng khi
-- thứ tự là DUY NHẤT — bản 202610081800 sắp theo (ngày, loại, ca, tên việc) có thể hoà nhau ⇒ dòng nhảy
-- trang, trùng/rụng im lặng. Thêm khoá phụ tkb_id/phong/luot. MẤT GÌ: không (thay hàm cùng chữ ký).
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
   order by r.ngay desc, (case r.loai when 'report' then 1 when 'tan' then 2 else 3 end), r.ca nulls last, r.ten_viec, r.tkb_id, r.phong, r.luot
$$;
