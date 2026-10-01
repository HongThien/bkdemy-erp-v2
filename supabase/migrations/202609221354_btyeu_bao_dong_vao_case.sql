-- Thùy 22/09: "Khi có BÁO ĐỘNG: HS chưa có bổ trợ → vào màn Duyệt bổ trợ (đã vậy — báo động tự đủ tín hiệu). HS ĐANG có bổ trợ → ADD THẲNG
-- dạng báo động vào case luôn." ⇒ trigger AFTER INSERT trên canh_bao_yeu: có case dang_xu CÙNG MÔN (môn = lớp của buổi; buổi bù → lớp gốc
-- của em) ⇒ chèn bo_tro_yeu_dang (nguon='bao_dong', idempotent). Đây là cờ CỨNG của NGƯỜI (GV/TA bấm chuông) nên add thẳng, khác "dạng
-- yếu mới do máy đo" chỉ đề xuất (202609221346). Backfill: báo động bấm SAU khi case mở (15 dòng · 9 HS, đo 22/09) — cùng luật.
alter table public.bo_tro_yeu_dang drop constraint if exists bo_tro_yeu_dang_nguon_check;
alter table public.bo_tro_yeu_dang add constraint bo_tro_yeu_dang_nguon_check check (nguon in ('duyet', 'tay', 'may', 'bao_dong'));

create or replace function public._btyeu_mon_cua_bao_dong(p_hoc_sinh uuid, p_buoi uuid) returns text
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select l.mon from buoi_hoc b join lop l on l.id = b.lop_id where b.id = p_buoi),
    (select l.mon from buoi_hoc_hs hh join buoi_hoc g on g.id = hh.bu_cho_buoi_id join lop l on l.id = g.lop_id
      where hh.buoi_hoc_id = p_buoi and hh.hoc_sinh_id = p_hoc_sinh limit 1))
$$;

create or replace function public._trg_btyeu_bao_dong_vao_case() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_mon text; v_case uuid;
begin
  if new.ma_dang is null then return new; end if;
  v_mon := public._btyeu_mon_cua_bao_dong(new.hoc_sinh_id, new.buoi_hoc_id);
  if v_mon is null then return new; end if;
  select id into v_case from bo_tro_yeu where hoc_sinh_id = new.hoc_sinh_id and mon = v_mon and trang_thai = 'dang_xu' limit 1;
  if v_case is null then return new; end if; -- chưa có bổ trợ ⇒ engine đưa vào hàng đợi Duyệt (báo động tự đủ tín hiệu)
  insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon) values (v_case, new.ma_dang, 'bao_dong')
    on conflict (bo_tro_yeu_id, ma_dang) do nothing;
  return new;
end $$;
drop trigger if exists trg_btyeu_bao_dong_vao_case on public.canh_bao_yeu;
create trigger trg_btyeu_bao_dong_vao_case after insert on public.canh_bao_yeu
  for each row execute function public._trg_btyeu_bao_dong_vao_case();

-- Backfill: báo động bấm SAU khi case đang mở được tạo.
insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon)
select distinct y.id, k.ma_dang, 'bao_dong'
from canh_bao_yeu k
join bo_tro_yeu y on y.hoc_sinh_id = k.hoc_sinh_id and y.trang_thai = 'dang_xu' and y.mon = public._btyeu_mon_cua_bao_dong(k.hoc_sinh_id, k.buoi_hoc_id)
where k.ma_dang is not null and k.created_at > y.created_at
on conflict (bo_tro_yeu_id, ma_dang) do nothing;

-- Màn Xếp: đếm dạng báo động chưa dạy để hiện nhãn 🚨 (thay hàm của 202609221344, thêm 1 trường).
create or replace function public.fn_btyeu_case_xep_lich(p_mon text default null) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                   select count(*) from ch where id is not null),
      'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong, 'so_dang_may', dc.may, 'so_dang_bao_dong', dc.bao_dong,
      'so_dang_chua_day', dc.can_day,
      'giai_doan', case when dc.can_day > 0 then 'dang_bo_tro' when dc.cho_retest > 0 then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', (select count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                          where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and (b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null)),
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id))
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong,
             count(*) filter (where d.nguon = 'may' and d.day_at is null) as may,
             count(*) filter (where d.nguon = 'bao_dong' and d.day_at is null) as bao_dong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc on true
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where y.trang_thai = 'dang_xu' and (p_mon is null or y.mon = p_mon) and dc.tong > 0
  ) s
$$;
