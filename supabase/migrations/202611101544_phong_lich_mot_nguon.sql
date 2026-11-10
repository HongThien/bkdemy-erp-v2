-- LỊCH PHÒNG MỘT NGUỒN (Thùy 10/11): "mọi hoạt động xếp lịch của BK đều phải lấy nguồn từ lịch phòng tổng quan để không conflict".
-- Trước mig này lịch phòng gộp ở CLIENT (src/lib/phong.ts lichPhongNgay — 4 truy vấn + join JS, vi phạm §2.0) và SÓT nguồn:
--   ca_bo_tro (ca trực khối đã mở ngày) · lich_truc_bo_tro (lịch bổ trợ khối hằng tuần, ngày chưa mở) · buổi Ôn thi/Hình/Nhẹ · ca_bo_tro_nhe.
-- Giờ: MỘT hàm fn_phong_lich(tu, den) là nguồn duy nhất — Tổng quan phòng, Lịch phòng, form phát sinh, form xếp bổ trợ, Xếp lịch bổ trợ khối
-- đều đọc nó; kiểm trùng (fn_phong_kiem_trung, fn_lich_truc_kiem_trung) đọc lại CHÍNH nó ⇒ thêm nguồn mới chỉ sửa 1 chỗ.
-- Nguồn (nguon):
--   chinh_khoa  buoi_hoc 'thuong' đã mở; ngày chưa mở buổi ⇒ TKB (thoi_khoa_bieu) của lớp đó
--   bo_tro      buoi_hoc bổ trợ (bu/yếu/đuổi/hình/ôn thi/nhẹ/…) KHÔNG nằm trong ca có phòng · ca_bo_tro tạo tay · ca_bo_tro_nhe
--   bo_tro_khoi ca_bo_tro sinh từ lịch trực · lich_truc_bo_tro chiếu lên ngày chưa sinh ca (cùng luật bỏ dòng trùng TA của fn_ca_bo_tro_sinh_ngay)
--   phat_sinh   hoat_dong_phong 'xac_nhan'
--   test        lich_test_khung (cùng luật fn_phong_lich_test_ngay)
-- phong_ma NULL = khối có giờ nhưng CHƯA gán phòng (vd lịch trực cũ) — vẫn trả để màn hiện "chưa có phòng" và kiểm trùng NGƯỜI.

create or replace function public.fn_phong_lich(p_tu date, p_den date)
returns table (
  ngay date, nguon text, phong_ma text, gio_bat_dau time, gio_ket_thuc time, tieu_de text, phu_trach text,
  nhan_su_ids uuid[], ref_id text, loai_phat_sinh text, mon text, khoi text, phong_khong_khop_danh_muc boolean
)
language plpgsql stable
set search_path = public
as $$
#variable_conflict use_column
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_den < p_tu then raise exception 'Khoảng ngày sai.'; end if;
  if p_den - p_tu > 62 then raise exception 'Tối đa 63 ngày/lần.'; end if;

  return query
  with d as (select g::date as ngay, public._thu_cua_ngay(g::date) as thu from generate_series(p_tu, p_den, interval '1 day') g),
  khoi_all as (
    -- 1) buổi thường đã mở
    select b.ngay, 'chinh_khoa'::text as nguon, nullif(trim(b.phong), '') as phong_ma, b.gio_bat_dau, b.gio_ket_thuc,
           coalesce(l.ten_lop, '?') || coalesce(' · ' || l.mon, '') as tieu_de,
           coalesce(tg.ho_ten, gv.ho_ten) as phu_trach,
           array_remove(array[b.nguoi_day, b.nguoi_day_tg], null) as nhan_su_ids,
           b.id::text as ref_id, null::text as loai_phat_sinh, l.mon, l.khoi
    from buoi_hoc b left join lop l on l.id = b.lop_id
    left join nhan_su gv on gv.id = b.nguoi_day left join nhan_su tg on tg.id = b.nguoi_day_tg
    where b.ngay between p_tu and p_den and b.loai = 'thuong' and b.trang_thai <> 'huy'
      and b.gio_bat_dau is not null and b.gio_ket_thuc is not null

    union all
    -- 2) TKB cho lớp chưa mở buổi thường ngày đó
    select d.ngay, 'chinh_khoa', nullif(trim(t.phong), ''), t.gio_bat_dau, t.gio_ket_thuc,
           coalesce(l.ten_lop, '?') || coalesce(' · ' || l.mon, '') || ' (TKB)', null, '{}'::uuid[],
           'tkb-' || t.id::text || '-' || d.ngay::text, null, l.mon, l.khoi
    from d join thoi_khoa_bieu t on t.thu = d.thu and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
    left join lop l on l.id = t.lop_id
    where not exists (select 1 from buoi_hoc b where b.lop_id = t.lop_id and b.ngay = d.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy')

    union all
    -- 3) buổi bổ trợ lẻ (không nằm trong ca ĐÃ CÓ PHÒNG — ca có phòng thì ca đại diện, khỏi đếm đôi)
    select b.ngay, 'bo_tro', nullif(trim(b.phong), ''), b.gio_bat_dau, b.gio_ket_thuc,
           (case b.loai when 'bu' then 'Bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' when 'bo_tro_duoi' then 'Bổ trợ đuổi'
              when 'bo_tro_hinh' then 'Bổ trợ Hình' when 'bo_tro_on_thi' then 'Ôn thi' when 'bo_tro_nhe' then 'Bổ trợ nhẹ'
              when 'khao_sat' then 'Khảo sát' else b.loai end) || coalesce(' · ' || l.ten_lop, ''),
           coalesce(tg.ho_ten, gv.ho_ten), array_remove(array[b.nguoi_day, b.nguoi_day_tg], null),
           b.id::text, null, l.mon, l.khoi
    from buoi_hoc b left join lop l on l.id = b.lop_id
    left join nhan_su gv on gv.id = b.nguoi_day left join nhan_su tg on tg.id = b.nguoi_day_tg
    left join ca_bo_tro c on c.id = b.ca_bo_tro_id
    left join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
    where b.ngay between p_tu and p_den and b.loai <> 'thuong' and b.trang_thai <> 'huy'
      and b.gio_bat_dau is not null and b.gio_ket_thuc is not null
      and not (c.id is not null and c.trang_thai = 'mo' and nullif(trim(c.phong), '') is not null)
      and not (cn.id is not null and cn.trang_thai = 'mo' and nullif(trim(cn.phong), '') is not null)

    union all
    -- 4) ca bổ trợ (đã mở ngày / tạo tay)
    select c.ngay, case when c.lich_truc_id is not null then 'bo_tro_khoi' else 'bo_tro' end, nullif(trim(c.phong), ''), c.gio_bat_dau, c.gio_ket_thuc,
           (case when c.lich_truc_id is not null then 'Bổ trợ khối ' else 'Ca bổ trợ ' end) || coalesce(c.khoi, '') || ' · ' || c.mon,
           concat_ws(' + ', n1.ho_ten, n2.ho_ten), array_remove(array[c.nhan_su_id, c.nhan_su_2_id], null),
           'ca-' || c.id::text, null, c.mon, c.khoi
    from ca_bo_tro c left join nhan_su n1 on n1.id = c.nhan_su_id left join nhan_su n2 on n2.id = c.nhan_su_2_id
    where c.ngay between p_tu and p_den and c.trang_thai = 'mo'

    union all
    -- 5) ca bổ trợ nhẹ
    select c.ngay, 'bo_tro', nullif(trim(c.phong), ''), c.gio_bat_dau, c.gio_ket_thuc,
           'Bổ trợ nhẹ · ' || coalesce(l.ten_lop, c.khoi), n.ho_ten, array_remove(array[c.truong_khoi_id, c.ta_id], null),
           'nhe-' || c.id::text, null, c.mon, c.khoi
    from ca_bo_tro_nhe c left join lop l on l.id = c.lop_id left join nhan_su n on n.id = coalesce(c.ta_id, c.truong_khoi_id)
    where c.ngay between p_tu and p_den and c.trang_thai = 'mo'

    union all
    -- 6) lịch bổ trợ khối hằng tuần, chiếu lên ngày CHƯA sinh ca (đã sinh/huỷ ca ngày đó ⇒ ca là sự thật, bỏ dòng chiếu)
    select d.ngay, 'bo_tro_khoi', nullif(trim(t.phong), ''), t.gio_bat_dau, t.gio_ket_thuc,
           'Bổ trợ khối ' || t.khoi || ' · ' || t.mon, concat_ws(' + ', n1.ho_ten, n2.ho_ten),
           array_remove(array[t.nhan_su_id, t.nhan_su_2_id], null),
           'lt-' || t.id::text || '-' || d.ngay::text, null, t.mon, t.khoi
    from d join lich_truc_bo_tro t on t.thu = d.thu and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
    left join nhan_su n1 on n1.id = t.nhan_su_id left join nhan_su n2 on n2.id = t.nhan_su_2_id
    where not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = d.ngay)
      -- cùng luật fn_ca_bo_tro_sinh_ngay: 1 TA 1 ca/khung giờ — dòng tách bậc cũ (7S/7A cùng TA cùng giờ) chỉ hiện 1
      and not exists (select 1 from lich_truc_bo_tro u where u.id < t.id and u.thu = t.thu and u.nhan_su_id = t.nhan_su_id
                        and u.hieu_luc_tu <= d.ngay and (u.hieu_luc_den is null or u.hieu_luc_den >= d.ngay)
                        and u.gio_bat_dau < t.gio_ket_thuc and u.gio_ket_thuc > t.gio_bat_dau)

    union all
    -- 7) hoạt động phát sinh
    select h.ngay, 'phat_sinh', p.ma_phong, h.gio_bat_dau, h.gio_ket_thuc, h.tieu_de, n.ho_ten, '{}'::uuid[],
           h.id::text, h.loai, h.mon, null
    from hoat_dong_phong h left join phong p on p.id = h.phong_id left join nhan_su n on n.id = h.nguoi_tao_id
    where h.ngay between p_tu and p_den and h.trang_thai = 'xac_nhan'

    union all
    -- 8) khung test đầu vào (cùng luật fn_phong_lich_test_ngay)
    select d.ngay, 'test', p.ma_phong, k.gio_bat_dau, k.gio_ket_thuc,
           'Test đầu vào' || coalesce(' · ' || nullif((select count(*) from dang_ky_test h where h.khung_id = k.id and h.ngay = d.ngay and h.trang_thai = 'hen'), 0)::text || ' hẹn', ''),
           null, '{}'::uuid[], 'test-' || k.id::text || '-' || d.ngay::text, null, null, null
    from d join lich_test_khung k on k.thu = extract(isodow from d.ngay)::int and k.xoa_at is null
    join phong p on p.id = k.phong_id
    where not exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = d.ngay)
  )
  select a.ngay, a.nguon, a.phong_ma, a.gio_bat_dau, a.gio_ket_thuc, a.tieu_de, a.phu_trach, a.nhan_su_ids, a.ref_id, a.loai_phat_sinh, a.mon, a.khoi,
         (a.phong_ma is not null and not exists (select 1 from phong p where p.ma_phong = a.phong_ma))
  from khoi_all a
  order by a.ngay, a.phong_ma nulls last, a.gio_bat_dau;
end
$$;

-- Khối trùng PHÒNG với (phòng, ngày, giờ) — dùng cho mọi form đặt phòng 1 ngày. p_bo_qua = ref_id của chính khối đang sửa.
create or replace function public.fn_phong_kiem_trung(p_phong text, p_ngay date, p_gio_bd time, p_gio_kt time, p_bo_qua text default null)
returns table (
  ngay date, nguon text, phong_ma text, gio_bat_dau time, gio_ket_thuc time, tieu_de text, phu_trach text,
  nhan_su_ids uuid[], ref_id text, loai_phat_sinh text, mon text, khoi text, phong_khong_khop_danh_muc boolean
)
language sql stable
set search_path = public
as $$
  select l.* from public.fn_phong_lich(p_ngay, p_ngay) l
  where l.phong_ma = p_phong and l.gio_bat_dau < p_gio_kt and l.gio_ket_thuc > p_gio_bd
    and (p_bo_qua is null or l.ref_id <> p_bo_qua)
$$;

-- Kiểm trùng 1 dòng LỊCH BỔ TRỢ KHỐI (hằng tuần) trên 4 tuần tới tính từ ngày áp dụng: trùng PHÒNG và trùng NGƯỜI TRỰC.
-- muc: 'chan'  = không được lưu (phòng có chính khoá/test/phát sinh · phòng đã đủ 2 ca bổ trợ · người trực đang ở chỗ khác)
--      'canh_bao' = được lưu nếu người xếp xác nhận (ghép phòng với 1 ca bổ trợ khác — luật ≤2 ca/phòng, spec-xep-bo-tro-chung §3;
--                   trùng người với dòng lịch khối cũ tách bậc cùng giờ — hệ chỉ mở 1 ca).
-- p_bo_qua = id dòng lịch trực đang sửa (bỏ chính nó + ca nó đã sinh).
create or replace function public.fn_lich_truc_kiem_trung(
  p_thu int, p_gio_bd time, p_gio_kt time, p_phong text, p_ns uuid, p_ns2 uuid,
  p_tu date default null, p_den date default null, p_bo_qua uuid default null
) returns jsonb
language plpgsql stable
set search_path = public
as $$
declare
  v_tu date := greatest(coalesce(p_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date), (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v_den date;
  v jsonb;
begin
  v_den := v_tu + 27;
  if p_den is not null and p_den < v_den then v_den := p_den; end if;
  if v_den < v_tu then return '[]'::jsonb; end if;

  with l as (
    select * from public.fn_phong_lich(v_tu, v_den) x
    where public._thu_cua_ngay(x.ngay) = p_thu and x.gio_bat_dau < p_gio_kt and x.gio_ket_thuc > p_gio_bd
      and (p_bo_qua is null or (x.ref_id not like 'lt-' || p_bo_qua::text || '-%'
            and x.ref_id not in (select 'ca-' || c.id::text from ca_bo_tro c where c.lich_truc_id = p_bo_qua)))
  ),
  phong_bt as ( -- số khối bổ trợ cùng phòng từng ngày
    select x.ngay, count(*) n from l x where x.phong_ma = p_phong and x.nguon in ('bo_tro', 'bo_tro_khoi') group by x.ngay
  ),
  hit as (
    select x.*, 'phong'::text as kieu,
           case when x.nguon not in ('bo_tro', 'bo_tro_khoi') then 'chan'
                when coalesce((select n from phong_bt b where b.ngay = x.ngay), 0) >= 2 then 'chan'
                else 'canh_bao' end as muc
    from l x where p_phong is not null and x.phong_ma = p_phong
    union all
    select x.*, 'nguoi', case when x.nguon = 'bo_tro_khoi' and x.gio_bat_dau = p_gio_bd and x.gio_ket_thuc = p_gio_kt
                                   and x.ref_id like 'lt-%' then 'canh_bao' else 'chan' end
    from l x where (p_ns is not null and p_ns = any(x.nhan_su_ids)) or (p_ns2 is not null and p_ns2 = any(x.nhan_su_ids))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'kieu', g.kieu, 'muc', g.muc, 'nguon', g.nguon, 'tieu_de', g.tieu_de, 'phong', g.phong_ma, 'phu_trach', g.phu_trach,
           'gio_bat_dau', to_char(g.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(g.gio_ket_thuc, 'HH24:MI'), 'ngay', g.ngays)
         order by g.muc desc, g.kieu, g.gio_bat_dau), '[]'::jsonb)
  into v
  from (
    select h.kieu, max(h.muc) as muc, h.nguon, h.tieu_de, h.phong_ma, h.phu_trach, h.gio_bat_dau, h.gio_ket_thuc,
           array_agg(distinct h.ngay order by h.ngay) as ngays -- max(muc): 'canh_bao' < 'chan' theo chữ ⇒ 1 ngày chặn là chặn
    from hit h group by h.kieu, h.nguon, h.tieu_de, h.phong_ma, h.phu_trach, h.gio_bat_dau, h.gio_ket_thuc
  ) g;
  return v;
end
$$;

-- LƯU 1 dòng lịch bổ trợ khối = kiểm trùng + ghi trong CÙNG transaction (§2.0). Không ghi khi còn 'chan'; còn 'canh_bao' mà chưa
-- p_chap_nhan ⇒ trả về để người xếp xác nhận. p_id NULL = thêm mới, có = sửa (giờ/phòng/người/khối…).
-- Trả {ok, id, trung[]}.
create or replace function public.fn_lich_truc_luu(
  p_id uuid, p_mon text, p_khoi text, p_bac text, p_thu int, p_gio_bd time, p_gio_kt time, p_phong text,
  p_so_ta int, p_ns uuid, p_ns2 uuid, p_suc_chua int, p_hieu_luc_tu date, p_ghi_chu text, p_chap_nhan boolean default false
) returns jsonb
language plpgsql volatile
set search_path = public
as $$
declare
  v_trung jsonb; v_id uuid; v_den date; v_cu lich_truc_bo_tro%rowtype; v_kiem_nguoi boolean := true;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if coalesce(trim(p_mon), '') = '' or coalesce(trim(p_khoi), '') = '' then raise exception 'Chọn môn và khối.'; end if;
  if p_thu not between 2 and 8 then raise exception 'Thứ không hợp lệ.'; end if;
  if p_gio_kt <= p_gio_bd then raise exception 'Giờ kết thúc phải sau giờ bắt đầu.'; end if;
  if coalesce(trim(p_phong), '') = '' then raise exception 'Chọn phòng.'; end if;
  if not exists (select 1 from phong where ma_phong = p_phong and dang_hoat_dong) then raise exception 'Phòng % không có trong danh mục phòng đang dùng.', p_phong; end if;
  if p_ns is null then raise exception 'Mỗi ca phải có người trực.'; end if;
  if coalesce(p_so_ta, 1) = 2 and (p_ns2 is null or p_ns2 = p_ns) then raise exception 'Ca 2 TA phải có người trực thứ 2 khác người 1.'; end if;
  if p_id is not null then
    select * into v_cu from lich_truc_bo_tro where id = p_id;
    if not found then raise exception 'Không thấy dòng lịch này.'; end if;
    v_den := v_cu.hieu_luc_den;
    -- sửa mà KHÔNG đổi thứ/giờ/người (vd chỉ gán phòng cho lịch cũ) ⇒ không kiểm lại trùng người: trùng đó có từ trước, không do lần sửa này
    v_kiem_nguoi := not (v_cu.thu = p_thu and v_cu.gio_bat_dau = p_gio_bd and v_cu.gio_ket_thuc = p_gio_kt
                         and v_cu.nhan_su_id is not distinct from p_ns
                         and v_cu.nhan_su_2_id is not distinct from (case when p_so_ta = 2 then p_ns2 end));
  end if;

  v_trung := public.fn_lich_truc_kiem_trung(p_thu, p_gio_bd, p_gio_kt, p_phong,
                                            case when v_kiem_nguoi then p_ns end,
                                            case when v_kiem_nguoi and p_so_ta = 2 then p_ns2 end,
                                            p_hieu_luc_tu, v_den, p_id);
  if exists (select 1 from jsonb_array_elements(v_trung) e where e->>'muc' = 'chan')
     or (jsonb_array_length(v_trung) > 0 and not coalesce(p_chap_nhan, false)) then
    return jsonb_build_object('ok', false, 'id', p_id, 'trung', v_trung);
  end if;

  if p_id is null then
    insert into lich_truc_bo_tro (mon, khoi, bac, lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, nhan_su_id, nhan_su_2_id, so_ta,
                                  suc_chua, hieu_luc_tu, ghi_chu, created_by)
    values (p_mon, p_khoi, coalesce(nullif(p_bac, ''), 'A'), null, p_thu, p_gio_bd, p_gio_kt, p_phong, p_ns,
            case when p_so_ta = 2 then p_ns2 end, coalesce(p_so_ta, 1), coalesce(p_suc_chua, 3 * coalesce(p_so_ta, 1)),
            coalesce(p_hieu_luc_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date), nullif(trim(p_ghi_chu), ''), public.jwt_uid())
    returning id into v_id;
  else
    update lich_truc_bo_tro set mon = p_mon, khoi = p_khoi, bac = coalesce(nullif(p_bac, ''), bac), thu = p_thu,
      gio_bat_dau = p_gio_bd, gio_ket_thuc = p_gio_kt, phong = p_phong, nhan_su_id = p_ns,
      nhan_su_2_id = case when p_so_ta = 2 then p_ns2 end, so_ta = coalesce(p_so_ta, 1),
      suc_chua = coalesce(p_suc_chua, suc_chua), ghi_chu = nullif(trim(p_ghi_chu), '')
    where id = p_id;
    v_id := p_id;
    -- ca đã sinh cho ngày CHƯA QUA của dòng này mà chưa có em ⇒ theo lịch mới (phòng/người/giờ); ca đã có em giữ nguyên, người xếp tự xử
    update ca_bo_tro c set phong = p_phong, gio_bat_dau = p_gio_bd, gio_ket_thuc = p_gio_kt, nhan_su_id = p_ns,
      nhan_su_2_id = case when p_so_ta = 2 then p_ns2 end, so_ta = coalesce(p_so_ta, 1)
    where c.lich_truc_id = p_id and c.trang_thai = 'mo' and c.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date
      and public._thu_cua_ngay(c.ngay) = p_thu
      and not exists (select 1 from buoi_hoc b where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy');
  end if;
  return jsonb_build_object('ok', true, 'id', v_id, 'trung', v_trung);
end
$$;

revoke all on function public.fn_phong_lich(date, date) from public, anon;
revoke all on function public.fn_phong_kiem_trung(text, date, time, time, text) from public, anon;
revoke all on function public.fn_lich_truc_kiem_trung(int, time, time, text, uuid, uuid, date, date, uuid) from public, anon;
revoke all on function public.fn_lich_truc_luu(uuid, text, text, text, int, time, time, text, int, uuid, uuid, int, date, text, boolean) from public, anon;
grant execute on function public.fn_phong_lich(date, date) to authenticated;
grant execute on function public.fn_phong_kiem_trung(text, date, time, time, text) to authenticated;
grant execute on function public.fn_lich_truc_kiem_trung(int, time, time, text, uuid, uuid, date, date, uuid) to authenticated;
grant execute on function public.fn_lich_truc_luu(uuid, text, text, text, int, time, time, text, int, uuid, uuid, int, date, text, boolean) to authenticated;
