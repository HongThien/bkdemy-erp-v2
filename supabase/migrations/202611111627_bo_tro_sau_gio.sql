-- ============================================================================
-- 202611111627 — bo_tro_sau_gio
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 11/11): Bổ trợ SAU GIỜ = mức L1 (thang L1–L4, mig 202611111553). Thùy chọn NÂNG CẤP "Bổ trợ Nhẹ" (29/10, ca_bo_tro_nhe +
--   buổi bo_tro_nhe + case nhe_mo/nhe_xong) thành Sau giờ thay vì dựng hệ thứ hai. Story + 6 câu Thùy chốt:
--   1. Mỗi dạng yếu 1 bài; dạng yếu trong NHÓM YẾU trước, dạng yếu của nhóm chưa yếu sau.          → _sau_gio_dang · fn_btnhe_fill_dang
--   2. Bài test: số câu = số dạng yếu trong nhóm yếu (1 câu/dạng, như ET).                              → fn_btnhe_in_test
--   3. Lý thuyết · bài luyện · bài test — 3 thứ IN RIÊNG, người in chọn (có em không cần lý thuyết/luyện). → fn_btnhe_in_ly_thuyet · fn_btyeu_in_sinh (nới) · fn_btnhe_in_test
--   4. Làm tại chỗ sau giờ.  5. GV và OPS in, TA nhập (app TA thấy ca sau giờ mình cùng làm).               → fn_btyeu_viec_cua_toi (nới)
--   6. Nhập xong là xong (vừa giống ET vừa giống bổ trợ yếu).                                             → fn_btyeu_giay_nop (nộp ⇒ có mặt + hoàn tất ca)
--   + "Bổ trợ sau giờ cũng cần khởi tạo": khởi tạo = tạo ca sau buổi sẵn có (fn_btnhe_tao); em được TBM DUYỆT L1 vào HÀNG CHỜ sau giờ
--     (fn_btnhe_cho), KHÔNG vào hàng xếp của Lộc (fn_btk_duyet nhánh muc = 1, không kiểm trần, không mở case dang_xu).
-- Câu vẫn chọn qua _btyeu_chon_cau(_khac) (luật §4). Kết quả test = bai_test 'bo_tro_test' ⇒ mastery như ET (đã có). Không bảng mới.
--
-- MẤT GÌ (Luật xoá): không mất dữ liệu. Chỉ thêm hàm + create or replace 5 hàm (thay đúng đoạn, chặn nếu định nghĩa đang chạy đã khác).
-- ============================================================================

-- ── (1) DANH SÁCH DẠNG của em cho bổ trợ sau giờ (Thùy 11/11 câu 1): mỗi dạng yếu 1 bài;
--     dạng yếu trong NHÓM YẾU trước, dạng yếu của nhóm CHƯA yếu sau. Đọc bảng chụp mastery (_mastery_lan_cap_nhanh), không tính lại.
--     Dạng yếu = mức 'yeu' ở cấp dạng. Nhóm yếu mà không có dạng nào mức yếu ⇒ lấy dạng thấp nhất chưa đạt của nhóm (để nhóm không bị bỏ sót).
create or replace function public._sau_gio_dang(p_hs uuid, p_mon text)
returns table(ma_dang text, ten_dang text, nhom text, nhom_yeu boolean, score numeric, n integer, thu_tu integer)
language sql stable security definer set search_path to 'public' as $$
  with m as materialized (
    select * from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang', 'nhom'], 5, 5, 3)
  ),
  dg as (
    select m.nut as ma_dang, m.score, m.n, m.muc, coalesce(hh.ma_bai, db.nhom_id) as nhom
      from m left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
     where m.cap = 'dang'
  ),
  nh as (select m.nut as nhom, m.score as nhom_score, (m.muc = 'yeu') as yeu from m where m.cap = 'nhom'),
  x as (
    select dg.*, coalesce(nh.yeu, false) as nhom_yeu, nh.nhom_score,
           row_number() over (partition by dg.nhom order by dg.score, dg.n desc, dg.ma_dang) as rn,
           bool_or(dg.muc = 'yeu') over (partition by dg.nhom) as nhom_co_dang_yeu
      from dg left join nh on nh.nhom = dg.nhom
  ),
  chon as (
    select * from x
     where x.muc = 'yeu' or (x.nhom_yeu and not x.nhom_co_dang_yeu and x.rn = 1 and x.muc <> 'dat')
  )
  select c.ma_dang, t.ten_dang::text, c.nhom, c.nhom_yeu, c.score, c.n::int,
         (row_number() over (order by c.nhom_yeu desc, coalesce(c.nhom_score, c.score), c.nhom, c.score, c.ma_dang))::int
    from chon c cross join lateral (select public._kho_ten_dang(p_mon, c.ma_dang) as ten_dang) t
   where t.ten_dang is not null and not public._kho_dang_da_xoa_mem(c.ma_dang)
$$;
revoke execute on function public._sau_gio_dang(uuid, text) from public, anon;

-- ── (2) đổ dạng vào case sau giờ (thay fn_btyeu_fill_dang_yeu cho ca Nhẹ/Sau giờ)
create or replace function public.fn_btnhe_fill_dang(p_case uuid)
returns integer language plpgsql security definer set search_path to 'public' as $$
declare v_hs uuid; v_mon text; v_n integer := 0; r record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hoc_sinh_id, mon into v_hs, v_mon from bo_tro_yeu where id = p_case and trang_thai = 'nhe_mo';
  if v_hs is null then raise exception 'Case sau giờ không mở.'; end if;
  for r in select * from public._sau_gio_dang(v_hs, v_mon) order by thu_tu loop
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
      values (p_case, r.ma_dang, 'may', r.score, least(r.n, 32767)::smallint) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
    if found then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $$;
revoke execute on function public.fn_btnhe_fill_dang(uuid) from public, anon;
grant execute on function public.fn_btnhe_fill_dang(uuid) to authenticated;

-- dạng của 1 buổi sau giờ theo THỨ TỰ in (nhóm yếu trước) + cờ nhóm yếu — đọc lại bảng chụp lúc in
create or replace function public._btnhe_dang_buoi(p_buoi uuid)
returns table(ma_dang text, ten_dang text, nhom_yeu boolean, thu_tu integer)
language sql stable security definer set search_path to 'public' as $$
  with b as (select * from public._btyeu_buoi(p_buoi)),
  mo as (select d.ma_dang, d.diem_luc_mo, d.created_at from bo_tro_yeu_dang d, b where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null),
  sg as (select s.* from b cross join lateral public._sau_gio_dang(b.hoc_sinh_id, b.mon) s)
  select mo.ma_dang, coalesce(sg.ten_dang, public._kho_ten_dang((select mon from b), mo.ma_dang))::text,
         coalesce(sg.nhom_yeu, false),
         (row_number() over (order by coalesce(sg.nhom_yeu, false) desc, sg.thu_tu nulls last, mo.diem_luc_mo nulls last, mo.created_at))::int
    from mo left join sg on sg.ma_dang = mo.ma_dang
$$;
revoke execute on function public._btnhe_dang_buoi(uuid) from public, anon;

-- ── (3) IN LÝ THUYẾT (Thùy câu 3: lý thuyết · luyện · test in RIÊNG, người in chọn) — lý thuyết + ví dụ của từng dạng, thứ tự nhóm yếu trước
create or replace function public.fn_btnhe_in_ly_thuyet(p_buoi uuid)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare b record; r record; v_lttbl text; v_lt record; v_vd text; v_out jsonb := '[]'::jsonb; h record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được tài liệu.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không thấy ca.'; end if;
  select ho_ten, ma_hs, khoi into h from hoc_sinh where id = b.hoc_sinh_id;
  for r in select * from public._btnhe_dang_buoi(p_buoi) order by thu_tu loop
    v_lt := null; v_vd := null;
    if exists (select 1 from hinh_hoc_bai where ma_bai = r.ma_dang) then
      select noi_dung, file_url into v_lt from hinh_hoc_bai_ly_thuyet where ma_bai = r.ma_dang limit 1;
      select vi_du into v_vd from hinh_hoc_bai where ma_bai = r.ma_dang;
    else
      v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
      execute format('select noi_dung, file_url from %I where ma_dang = $1 limit 1', v_lttbl) into v_lt using r.ma_dang;
      select vi_du into v_vd from dai_bdm_dang_bai where id = r.ma_dang;
    end if;
    v_out := v_out || jsonb_build_object('ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'nhom_yeu', r.nhom_yeu,
                                         'ly_thuyet', nullif(trim(coalesce(v_lt.noi_dung, '')), ''), 'file_url', v_lt.file_url,
                                         'vi_du', nullif(trim(coalesce(v_vd, '')), ''));
  end loop;
  return jsonb_build_object('buoi_id', p_buoi, 'mon', b.mon, 'ngay', b.ngay,
    'hs', jsonb_build_object('id', b.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi), 'dang', v_out);
end $$;
revoke execute on function public.fn_btnhe_in_ly_thuyet(uuid) from public, anon;
grant execute on function public.fn_btnhe_in_ly_thuyet(uuid) to authenticated;

-- ── (4) IN BÀI TEST (Thùy câu 2 + 6): mỗi dạng yếu TRONG NHÓM YẾU đúng 1 câu (số câu = số dạng đó; em không còn nhóm yếu ⇒ mọi dạng đang mở),
--     KHÔNG cần luyện trước, không cần "đóng ca". Câu chọn qua _btyeu_chon_cau_khac (luật §4: MCQ trước, rồi trả lời ngắn), né câu đã in trong buổi.
--     Idempotent: đã có test ⇒ trả lại test đó. Nộp test (fn_btyeu_giay_nop) = xong ca.
create or replace function public.fn_btnhe_in_test(p_buoi uuid)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare b record; v_lop uuid; v_bt uuid; v_tru text[]; v_caus text[]; v_cautbl text; v_lttbl text; i integer := 0; c text; r record;
  v_thieu text[] := '{}'; v_chi_nhom_yeu boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được bài.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') then raise exception 'Không phải ca bổ trợ sau giờ.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  select id into v_bt from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
  if v_bt is not null then
    if exists (select 1 from bai_lam where bai_test_id = v_bt and trang_thai = 'da_nop') then raise exception 'Bài test đã nhập & nộp rồi.'; end if;
    update bai_test set in_giay_at = coalesce(in_giay_at, now()) where id = v_bt;
    return jsonb_build_object('bai_test_id', v_bt, 'so_cau', (select so_cau from bai_test where id = v_bt), 'da_co', true, 'dang_khong_co_cau', '[]'::jsonb);
  end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;
  v_chi_nhom_yeu := exists (select 1 from public._btnhe_dang_buoi(p_buoi) where nhom_yeu);
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro_test', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  for r in select * from public._btnhe_dang_buoi(p_buoi) where nhom_yeu or not v_chi_nhom_yeu order by thu_tu loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_caus := public._btyeu_chon_cau_khac(v_cautbl, r.ma_dang, null, v_tru, 1, 0);
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || r.ten_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1; perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null); v_tru := v_tru || c;
    end loop;
    update bo_tro_yeu_dang set day_at = coalesce(day_at, now()), day_buoi_id = coalesce(day_buoi_id, p_buoi)
     where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = r.ma_dang;
  end loop;
  if i = 0 then raise exception 'Các dạng của ca này chưa có câu trong kho — chưa in được bài test.'; end if;
  update bai_test set so_cau = i where id = v_bt;
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'da_co', false, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $$;
revoke execute on function public.fn_btnhe_in_test(uuid) from public, anon;
grant execute on function public.fn_btnhe_in_test(uuid) to authenticated;

-- ── (5) HÀNG CHỜ SAU GIỜ (Thùy 11/11: em được trưởng bộ môn duyệt L1 vào hàng chờ, KHÔNG vào hàng xếp của Lộc):
--     đề xuất đã duyệt mức 1 mà CHƯA có ca sau giờ nào khởi tạo cho em (môn đó) từ lúc duyệt. Phạm vi = người tạo được ca (_btnhe_duoc_tao).
create or replace function public.fn_btnhe_cho()
returns jsonb language sql stable security definer set search_path to 'public' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'de_xuat_id', d.id, 'hoc_sinh_id', d.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'mon', d.mon, 'khoi', d.khoi,
      'lop_id', d.lop_id, 'ten_lop', l.ten_lop, 'nhom', d.nhom, 'uu_tien', d.uu_tien, 'ghi_chu', d.ghi_chu, 'duyet_at', d.duyet_at,
      'so_dang', (select count(*) from public._sau_gio_dang(d.hoc_sinh_id, d.mon)))
    order by d.mon, d.khoi, l.ten_lop, h.ho_ten), '[]'::jsonb)
    from bo_tro_de_xuat d join hoc_sinh h on h.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
   where d.trang_thai = 'da_duyet' and d.muc = 1 and public.la_thanh_vien() and public._btnhe_duoc_tao(d.mon, d.khoi)
     and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = d.hoc_sinh_id and y.mon = d.mon and y.nguon = 'nhe' and y.created_at >= d.duyet_at)
$$;
revoke execute on function public.fn_btnhe_cho() from public, anon;
grant execute on function public.fn_btnhe_cho() to authenticated;

-- ── (6) vá hàm cũ (thay chuỗi trên định nghĩa đang chạy)
CREATE OR REPLACE FUNCTION public.fn_btnhe_tao(p_lop uuid, p_kieu text, p_ngay date, p_gio_bat_dau time without time zone, p_phut integer, p_phong text, p_hs uuid[], p_ta uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare l record; v_me uuid := public.current_nhan_su_id(); v_ca uuid; v_kt time; v_tuan date := date_trunc('week', p_ngay)::date;
  v_hs uuid; v_case uuid; v_buoi uuid; v_ten text; v_n int; v_khong text[] := '{}'; v_trung int := 0; v_trung_ds jsonb := '[]'::jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into l from lop where id = p_lop and trang_thai = 'dang_hoc';
  if l.id is null then raise exception 'Không thấy lớp đang học.'; end if;
  if not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Chỉ trưởng khối % · % (hoặc Quản lý chất lượng) tạo được ca Nhẹ cho lớp này.', l.mon, l.khoi; end if;
  if p_kieu not in ('sau_buoi', 'khac') then raise exception 'Loại thời gian phải là sau_buoi | khac.'; end if;
  if p_ngay is null or p_gio_bat_dau is null then raise exception 'Thiếu ngày/giờ.'; end if;
  if coalesce(p_phut, 0) < 10 or p_phut > 90 then raise exception 'Thời lượng 10–90 phút.'; end if;
  if coalesce(cardinality(p_hs), 0) = 0 then raise exception 'Chưa chọn học sinh.'; end if;
  if p_ta is not null and not exists (select 1 from nhan_su where id = p_ta) then raise exception 'TA không hợp lệ.'; end if;
  v_kt := p_gio_bat_dau + make_interval(mins => p_phut);
  if v_kt <= p_gio_bat_dau then raise exception 'Ca vắt qua nửa đêm.'; end if;

  foreach v_hs in array p_hs loop
    select h.ho_ten into v_ten from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
     where hl.lop_id = p_lop and hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc';
    if v_ten is null then raise exception 'Có học sinh không thuộc lớp %.', l.ten_lop; end if;
    select count(*) into v_n from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
     where x.hoc_sinh_id = v_hs and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7;
    if v_n >= 2 then raise exception '% đã có % ca Nhẹ tuần này (tối đa 2).', v_ten, v_n; end if;
  end loop;

  -- Trùng phòng: CẢNH BÁO, không chặn (spec §8.2) — đếm trên lịch phòng chung, TRƯỚC khi ghi ca này
  if nullif(trim(coalesce(p_phong, '')), '') is not null then
    select count(*), coalesce(jsonb_agg(jsonb_build_object('tieu_de', x.tieu_de, 'gio_bat_dau', to_char(x.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(x.gio_ket_thuc, 'HH24:MI'), 'nguon', x.nguon) order by x.gio_bat_dau), '[]'::jsonb)
      into v_trung, v_trung_ds
      from public.fn_phong_kiem_trung(trim(p_phong), p_ngay, p_gio_bat_dau, v_kt) x;
  end if;

  insert into ca_bo_tro_nhe (lop_id, mon, khoi, kieu, ngay, gio_bat_dau, gio_ket_thuc, phong, truong_khoi_id, ta_id, created_by)
    values (p_lop, l.mon, l.khoi, p_kieu, p_ngay, p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''), v_me, p_ta, public.jwt_uid())
    returning id into v_ca;

  foreach v_hs in array p_hs loop
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, trang_thai, muc, uu_tien)
      values (v_hs, p_lop, l.mon, 'nhe', 'Bổ trợ Nhẹ ' || to_char(p_ngay, 'DD/MM'), 'nhe_mo', 1, 2)
      returning id into v_case;
    if public.fn_btnhe_fill_dang(v_case) = 0 then -- 11/11: dạng sau giờ = nhóm yếu trước (_sau_gio_dang)
      v_khong := v_khong || (select ho_ten from hoc_sinh where id = v_hs);
    end if;
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_nhe_id)
      values ('bo_tro_nhe', null, p_ngay, public._thu_cua_ngay(p_ngay), p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''),
              v_me, 'mo', public.jwt_uid(), v_ca)
      returning id into v_buoi;
    insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_yeu_id) values (v_buoi, v_hs, v_case);
  end loop;

  return jsonb_build_object('ca_id', v_ca, 'so_hs', cardinality(p_hs), 'em_khong_dang', to_jsonb(v_khong), 'trung_phong', v_trung, 'trung_ds', v_trung_ds);
end
$function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_in_sinh(p_buoi uuid, p_so_cau integer DEFAULT 5)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text; d record;
  v_thieu text[] := '{}'; v_n integer := greatest(1, least(coalesce(p_so_cau, 5), 10));
  v_chi_hinh boolean := coalesce(current_setting('bk.chi_hinh', true), '') = '1'; -- 14/10: ca 📱 app chỉ in các dạng Hình mô hình (xem fn_btyeu_in_sinh_hinh)
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được tài liệu.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không thấy ca bổ trợ yếu.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test')
     and not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') -- 11/11 sau giờ: luyện / test in riêng, thứ tự tuỳ người in
  then raise exception 'Ca đã đóng — không in thêm bài luyện.'; end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  for d in select x.ma_dang from bo_tro_yeu_dang x
           left join public._btnhe_dang_buoi(p_buoi) sg on sg.ma_dang = x.ma_dang  -- 11/11 sau giờ: dạng nhóm yếu trước (ca Yếu: sg rỗng ⇒ thứ tự cũ)
         where x.bo_tro_yeu_id = b.bo_tro_yeu_id and x.dong_at is null
         and (not v_chi_hinh or public._kho_nhanh_cua_dang(b.mon, x.ma_dang) = 'hinh_mo_hinh') order by sg.thu_tu nulls last, x.diem_luc_mo nulls last, x.created_at loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); -- 29/09 nhánh theo dạng
    v_caus := public._btyeu_chon_cau_khac(v_cautbl, d.ma_dang, null, v_tru, v_n, 2); -- 17/10: luyện ≠ test, chừa 2 câu cho test cuối ca
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || d.ma_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
    end loop;
    v_tru := v_tru || v_caus;
  end loop;
  if i = 0 then
    -- Không có câu nào ⇒ raise làm ROLLBACK cả transaction, dòng bai_test vừa tạo tự biến mất (không để lại bài rỗng).
    raise exception 'Các dạng của ca này chưa có câu trong kho — chưa in được.';
  end if;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_giay_nop(p_bai_test uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t record; v_bl uuid; v_trong integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nộp được bài giấy.'; end if;
  select id, loai, in_giay_at, hoc_sinh_id into t from bai_test where id = p_bai_test;
  if t.id is null or t.loai <> 'bo_tro_test' or t.in_giay_at is null then raise exception 'Chỉ nộp tay cho BÀI KIỂM TRA CUỐI CA in giấy.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (t.id, t.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id into v_bl;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    select v_bl, k.id, null, 'wrong', 0, 'manual', now() from bai_test_cau k
    where k.bai_test_id = t.id and not exists (select 1 from bai_lam_cau x where x.bai_lam_id = v_bl and x.bai_test_cau_id = k.id);
  get diagnostics v_trong = row_count;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = v_bl and trang_thai = 'dang_lam';
  -- 11/11 Thùy: bổ trợ SAU GIỜ "nhập xong là xong" — nộp test ⇒ em có mặt + ca hoàn tất (trigger đóng case nhe_xong)
  update buoi_hoc_hs hh set diem_danh = 'co_mat'
    from bai_test bt join buoi_hoc b on b.id = bt.buoi_hoc_id
   where bt.id = t.id and b.loai = 'bo_tro_nhe' and hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = t.hoc_sinh_id and hh.diem_danh is null;
  update buoi_hoc b set danh_gia_xong_at = now(), updated_at = now()
    from bai_test bt where bt.id = t.id and b.id = bt.buoi_hoc_id and b.loai = 'bo_tro_nhe' and b.danh_gia_xong_at is null;
  return jsonb_build_object('bo_trong', v_trong,
    'so_dung', (select count(*) from bai_lam_cau where bai_lam_id = v_bl and verdict = 'correct'),
    'so_cau', (select count(*) from bai_test_cau where bai_test_id = t.id));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_viec_cua_toi()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_ca jsonb; v_rt jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);

  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_ca from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, h.khoi, y.mon,
           (select level from hs_level where hoc_sinh_id = h.id and mon = y.mon and loai = 'kien_thuc') as level,
           hh.diem_danh,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id) as so_dang,
           exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test') as co_test,
           exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id
                   where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop') as test_da_nop,
           b.danh_gia_xong_at, (b.loai = 'bo_tro_nhe') as nhe
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    where b.loai in ('bo_tro_yeu', 'bo_tro_nhe') and b.trang_thai = 'mo'   -- 11/11: + ca sau giờ (TA cùng làm nhập test)
      and (v_admin or b.nguoi_day_tg = v_ns
           or (b.loai = 'bo_tro_nhe' and exists (select 1 from ca_bo_tro_nhe cn where cn.id = b.ca_bo_tro_nhe_id and cn.ta_id = v_ns)))
      and b.ngay <= v_today + 7
      and (b.danh_gia_xong_at is null or b.ngay = v_today)   -- nợ cũ + hôm nay (kể cả đã xong để xem lại) + sắp tới
  ) x;

  select coalesce(jsonb_agg(x order by x.ngay, x.ho_ten), '[]'::jsonb) into v_rt from (
    select bt.id as bai_test_id, bt.ngay, bt.mon, bt.so_cau, bt.lop_id, l.ten_lop,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs,
           coalesce(bl.trang_thai = 'da_nop', false) as da_nop,
           (select ngay from buoi_hoc where id = bt.buoi_hoc_id) as buoi_bo_tro_ngay
    from bai_test bt
    join lop l on l.id = bt.lop_id
    join hoc_sinh h on h.id = bt.hoc_sinh_id
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
    where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay <= v_today and public._btyeu_retest_bat()
      and (bl.trang_thai is distinct from 'da_nop')
      and (v_admin or exists (select 1 from phan_cong_lop pc where pc.lop_id = bt.lop_id and pc.nhan_su_id = v_ns and pc.vai_tro = 'tg'))
  ) x;

  return jsonb_build_object('ca', v_ca, 'retest', v_rt);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btk_duyet(p_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v bo_tro_de_xuat; v_chan text; v_lv_cu smallint; v_case uuid; v_truoc uuid; v_n integer := 0;
  v_nhom text[]; v_uid uuid := public.jwt_uid(); v_ly_do text;
begin
  select * into v from bo_tro_de_xuat where id = p_id for update;
  if v.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
  if not public._btk_la_tbm(v.mon, v.khoi) then raise exception 'Chỉ trưởng bộ môn % duyệt được khối %', v.mon, v.khoi using errcode = '42501'; end if;
  if v.trang_thai <> 'cho_duyet' then raise exception 'Dòng không ở trạng thái chờ duyệt.'; end if;

  -- (1) trần 70 em / 20 Cao — cùng hàm màn duyệt cũ (trigger trg_btyeu_suc_chua vẫn chặn lần nữa khi mở case)
  if v.muc <> 1 and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = v.hoc_sinh_id and y.mon = v.mon and y.trang_thai = 'dang_xu') then -- L1 sau giờ: không mở case khối ⇒ không kiểm trần
    v_chan := public.fn_btyeu_kiem_suc_chua(v.hoc_sinh_id, v.mon, v.uu_tien::int);
    if v_chan is not null then raise exception '%', v_chan; end if;
  end if;

  -- (2) mức: ghi log trước rồi trạng thái (y như duyetLevel)
  select level into v_lv_cu from hs_level where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and loai = 'kien_thuc';
  select string_agg(n->>'ten', ', ') into v_ly_do from jsonb_array_elements(v.nhom) n;
  v_ly_do := 'Trưởng khối đề xuất (Dashboard học tập) — nhóm: ' || coalesce(v_ly_do, '') || case when v.ghi_chu <> '' then ' · ' || v.ghi_chu else '' end;
  insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
  values (v.hoc_sinh_id, v.mon, 'kien_thuc', coalesce(v_lv_cu, 0), null, jsonb_build_object('nguon', 'truong_khoi_de_xuat', 'de_xuat_id', v.id),
          v.muc, v_ly_do, v_uid);
  insert into hs_level (hoc_sinh_id, mon, loai, level, updated_at) values (v.hoc_sinh_id, v.mon, 'kien_thuc', v.muc, now())
  on conflict (hoc_sinh_id, mon, loai) do update set level = excluded.level, updated_at = now();

  -- 11/11 Thùy: L1 = bổ trợ SAU GIỜ ⇒ KHÔNG mở case vào hàng xếp của Lộc; em vào HÀNG CHỜ SAU GIỜ (fn_btnhe_cho) chờ khởi tạo ca.
  if v.muc = 1 then
    update bo_tro_de_xuat set trang_thai = 'da_duyet', duyet_boi = public.current_nhan_su_id(), duyet_at = now(),
           case_id = null, so_dang = (select count(*) from public._sau_gio_dang(v.hoc_sinh_id, v.mon)), updated_at = now()
     where id = p_id;
    return jsonb_build_object('case_id', null, 'sau_gio', true, 'so_dang', (select so_dang from bo_tro_de_xuat where id = p_id));
  end if;

  -- (3) mở case mới hoặc gộp vào case đang mở (y như moHoacGopCaseBoTroYeu)
  select id into v_case from bo_tro_yeu where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and trang_thai = 'dang_xu';
  if v_case is null then
    select id into v_truoc from bo_tro_yeu where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and trang_thai = 'hoan_thanh' order by created_at desc limit 1;
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, actor, case_truoc_id, uu_tien)
    values (v.hoc_sinh_id, v.lop_id, v.mon, 'thu_cong', v_ly_do, v_uid, v_truoc, v.uu_tien)
    returning id into v_case;
  end if;

  -- (4) dạng vào case: "nhóm quyết, dạng thực thi" — mọi dạng ĐÃ ĐO chưa đạt của nhóm tick; nhóm mà mọi dạng đạt ⇒ dạng thấp nhất
  select array_agg(n->>'ma') into v_nhom from jsonb_array_elements(v.nhom) n;
  with dg as (
    select m.nut as ma_dang, m.score, m.n, m.muc, coalesce(hh.ma_bai, db.nhom_id) as nhom
      from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[v.hoc_sinh_id], true, null, null, array['dang'], 5, 5, 3) m
      left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
     where m.cap = 'dang'
  ),
  ung as (select dg.*, row_number() over (partition by dg.nhom order by dg.score, dg.n desc, dg.ma_dang) as rn from dg where dg.nhom = any(v_nhom)),
  chon as (
    select u.* from ung u
     where (u.muc <> 'dat' or u.rn = 1)
       and public._kho_ten_dang(v.mon, u.ma_dang) is not null and not public._kho_dang_da_xoa_mem(u.ma_dang)
  ),
  ins as (
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
    select v_case, c.ma_dang, 'duyet', c.score, least(c.n, 32767)::smallint from chon c
    on conflict (bo_tro_yeu_id, ma_dang) do nothing
    returning 1
  )
  select count(*) into v_n from ins;

  update bo_tro_de_xuat set trang_thai = 'da_duyet', duyet_boi = public.current_nhan_su_id(), duyet_at = now(),
         case_id = v_case, so_dang = v_n, updated_at = now()
   where id = p_id;
  return jsonb_build_object('case_id', v_case, 'so_dang', v_n);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_lop_hs(p_lop uuid, p_ngay date)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, so_dang_yeu integer, dang_yeu text[], so_ca_nhe_tuan integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_mon text; v_khoi text; v_tuan date := date_trunc('week', p_ngay)::date; v_hs uuid[];
begin
  select l.mon, l.khoi into v_mon, v_khoi from lop l where l.id = p_lop;
  if v_mon is null then raise exception 'Không thấy lớp.'; end if;
  if not public._btnhe_duoc_tao(v_mon, v_khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  select array_agg(hl.hoc_sinh_id) into v_hs from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc';
  return query
  with dy as materialized (select x.id as hoc_sinh_id, s.ten_dang, s.score  -- 11/11: cùng luật dạng sau giờ (_sau_gio_dang)
                            from unnest(coalesce(v_hs, '{}'::uuid[])) x(id) cross join lateral public._sau_gio_dang(x.id, v_mon) s)
  select h.id, h.ho_ten, h.ma_hs,
         (select count(*)::int from dy where dy.hoc_sinh_id = h.id),
         (select coalesce(array_agg(dy.ten_dang order by dy.score), '{}') from dy where dy.hoc_sinh_id = h.id),
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy'
             and b.ngay >= v_tuan and b.ngay < v_tuan + 7)
    from hoc_sinh h
   where h.id = any(coalesce(v_hs, '{}'))
   order by h.ho_ten;
end $function$;
