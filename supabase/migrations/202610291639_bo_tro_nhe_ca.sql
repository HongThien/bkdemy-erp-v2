-- ============================================================================
-- bo_tro_nhe_ca — Thùy 29/10, spec-truong-khoi.md §8: BỔ TRỢ NHẸ (L1.1).
--
-- Trưởng khối tự tạo ca (không qua Lộc, không suất/trần/phòng), 15–20' sau giờ hoặc giờ khác, chọn em trong lớp,
-- TA lớp cùng làm hay không. Mỗi em tối đa 2 ca Nhẹ / tuần. Vắng = ghi vắng, không bù.
--
-- MÔ HÌNH (dùng lại máy chạy ca của Bổ trợ Yếu, không viết máy thứ hai):
--   ca_bo_tro_nhe (1 dòng / ca)  →  mỗi em: 1 case bo_tro_yeu (trang_thai 'nhe_mo' → 'nhe_xong', dạng yếu đổ bằng
--   fn_btyeu_fill_dang_yeu) + 1 buoi_hoc loai 'bo_tro_nhe' (nguoi_day_tg = trưởng khối) + 1 buoi_hoc_hs.
--   ⇒ điểm danh · in phiếu luyện · nhập giấy · đóng ca/test · hoàn tất chạy bằng đúng các hàm fn_btyeu_* (qua _btyeu_buoi).
--
-- VÌ SAO trạng thái riêng 'nhe_mo'/'nhe_xong' (không 'dang_xu'): ~20 hàm đếm case 'dang_xu' (trần suất, hàng xếp của Lộc,
-- chốt tuần, báo động…) và giả định mỗi em-môn ≤ 1 case 'dang_xu'. Case Nhẹ đứng ngoài tất cả, tự động.
-- VÌ SAO loại buổi riêng 'bo_tro_nhe': công TA, dashboard, trợ lý, lịch phòng lọc loai = 'bo_tro_yeu' ⇒ Nhẹ không bị
-- tính nhầm là Yếu (Thùy: công Nhẹ chỉ ghi số liệu, tính lương sau — số liệu nằm ở ca_bo_tro_nhe).
-- ============================================================================

-- ── 1. Nới CHECK ──
alter table buoi_hoc drop constraint buoi_hoc_loai_check;
alter table buoi_hoc add constraint buoi_hoc_loai_check check (loai = any (array['thuong', 'bu', 'bo_tro_yeu', 'bo_tro_duoi', 'mt', 'bo_tro_hinh', 'khao_sat', 'bo_tro_on_thi', 'bo_tro_nhe']));
alter table bo_tro_yeu drop constraint bo_tro_yeu_trang_thai_check;
alter table bo_tro_yeu add constraint bo_tro_yeu_trang_thai_check check (trang_thai = any (array['dang_xu', 'hoan_thanh', 'nhe_mo', 'nhe_xong']));
alter table bo_tro_yeu add constraint bo_tro_yeu_nhe_dong_du_ck check (trang_thai <> 'nhe_xong' or (ket_qua is not null and hoan_thanh_at is not null));

-- ── 2. Bảng ca ──
create table if not exists ca_bo_tro_nhe (
  id             uuid primary key default gen_random_uuid(),
  lop_id         uuid not null references lop(id),
  mon            text not null,
  khoi           text not null,
  kieu           text not null check (kieu in ('sau_buoi', 'khac')),
  ngay           date not null,
  gio_bat_dau    time not null,
  gio_ket_thuc   time not null check (gio_ket_thuc > gio_bat_dau),
  phong          text,
  truong_khoi_id uuid not null references nhan_su(id),   -- người mở + đóng ca
  ta_id          uuid references nhan_su(id),            -- TA lớp cùng làm; NULL = không có TA (không áp dụng)
  trang_thai     text not null default 'mo' check (trang_thai in ('mo', 'huy')),
  ly_do_huy      text,
  created_by     uuid,
  created_at     timestamptz not null default now()
);
comment on table ca_bo_tro_nhe is 'Ca Bổ trợ Nhẹ (L1.1, spec-truong-khoi.md §8). Trưởng khối tự tạo; mỗi em 1 buoi_hoc loai bo_tro_nhe trỏ về đây. Số liệu công TA (ai, bao lâu) đọc từ đây — chưa tính lương.';
alter table buoi_hoc add column if not exists ca_bo_tro_nhe_id uuid references ca_bo_tro_nhe(id);
create index if not exists buoi_hoc_ca_bo_tro_nhe_idx on buoi_hoc (ca_bo_tro_nhe_id) where ca_bo_tro_nhe_id is not null;

alter table ca_bo_tro_nhe enable row level security;
drop policy if exists ca_bo_tro_nhe_doc on ca_bo_tro_nhe;
create policy ca_bo_tro_nhe_doc on ca_bo_tro_nhe for select to authenticated using (public.la_thanh_vien());

-- ── 3. Case Nhẹ đóng theo buổi: hoàn tất ⇒ nhe_xong/day_xong · huỷ (vắng, huỷ ca) ⇒ nhe_xong/bo ──
create or replace function public._trg_btnhe_dong_case()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_kq text; v_gc text;
begin
  if new.danh_gia_xong_at is not null and old.danh_gia_xong_at is null then
    v_kq := 'day_xong'; v_gc := 'Xong ca Nhẹ ' || to_char(new.ngay, 'DD/MM');
  elsif new.trang_thai = 'huy' and old.trang_thai <> 'huy' then
    v_kq := 'bo'; v_gc := coalesce(new.ly_do_huy, 'Huỷ ca Nhẹ ' || to_char(new.ngay, 'DD/MM'));
  else
    return new;
  end if;
  update bo_tro_yeu_dang d set dong_at = now()
    from buoi_hoc_hs hh where hh.buoi_hoc_id = new.id and d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null;
  update bo_tro_yeu y set trang_thai = 'nhe_xong', hoan_thanh_at = now(), ket_qua = v_kq, dong_boi = public._btyeu_my_ns(), ghi_chu_dong = v_gc
    from buoi_hoc_hs hh where hh.buoi_hoc_id = new.id and y.id = hh.bo_tro_yeu_id and y.trang_thai = 'nhe_mo';
  return new;
end $$;
drop trigger if exists trg_btnhe_dong_case on buoi_hoc;
create trigger trg_btnhe_dong_case after update on buoi_hoc
  for each row when (new.loai = 'bo_tro_nhe') execute function public._trg_btnhe_dong_case();

-- ── 4. Quyền tạo: Trưởng của ô (môn × khối) hoặc toàn hệ QLCL ──
create or replace function public._btnhe_duoc_tao(p_mon text, p_khoi text)
returns boolean language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he()
      or exists (select 1 from public._khoi_quan_ly() q
                  where q.nhan_su_id = public.current_nhan_su_id() and q.mon = p_mon and q.khoi = p_khoi and q.cap = 'truong')
$$;

-- Giờ học của lớp ngày p_ngay: buổi thường đã có trong buoi_hoc (không huỷ) trước, không thì thời khoá biểu còn hiệu lực.
create or replace function public._btnhe_gio_lop(p_lop uuid, p_ngay date)
returns table (gio_bat_dau time, gio_ket_thuc time, phong text)
language sql stable security definer set search_path = public as $$
  select x.gio_bat_dau, x.gio_ket_thuc, x.phong from (
    select b.gio_bat_dau, b.gio_ket_thuc, b.phong, 0 as uu
      from buoi_hoc b where b.lop_id = p_lop and b.ngay = p_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.gio_bat_dau is not null
    union all
    select t.gio_bat_dau, t.gio_ket_thuc, t.phong, 1
      from thoi_khoa_bieu t where t.lop_id = p_lop and t.thu = public._thu_cua_ngay(p_ngay)
       and t.hieu_luc_tu <= p_ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= p_ngay)
  ) x order by x.uu, x.gio_ket_thuc desc limit 1
$$;

-- Lớp tôi được tạo ca Nhẹ + giờ học ngày p_ngay (null = lớp không học ngày đó) + TA lớp.
create or replace function public.fn_btnhe_lop_cua_toi(p_ngay date)
returns table (lop_id uuid, ten_lop text, mon text, khoi text, gio_bat_dau time, gio_ket_thuc time, phong text, ta_id uuid, ta_ten text)
language sql stable security definer set search_path = public as $$
  select l.id, l.ten_lop, l.mon, l.khoi, g.gio_bat_dau, g.gio_ket_thuc, g.phong, public._ta_cua_lop(l.id),
         (select n.ho_ten from nhan_su n where n.id = public._ta_cua_lop(l.id))
    from lop l
    left join lateral public._btnhe_gio_lop(l.id, p_ngay) g on true
   where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._btnhe_duoc_tao(l.mon, l.khoi)
   order by l.mon, l.khoi, l.ten_lop
$$;

-- Học sinh của lớp + dạng yếu (đúng luật đang dùng: fn_btyeu_dang_yeu_2_cua_so_moi) + số ca Nhẹ tuần chứa p_ngay.
create or replace function public.fn_btnhe_lop_hs(p_lop uuid, p_ngay date)
returns table (hoc_sinh_id uuid, ho_ten text, ma_hs text, so_dang_yeu integer, dang_yeu text[], so_ca_nhe_tuan integer)
language plpgsql stable security definer set search_path = public as $$
declare v_mon text; v_khoi text; v_tuan date := date_trunc('week', p_ngay)::date;
begin
  select l.mon, l.khoi into v_mon, v_khoi from lop l where l.id = p_lop;
  if v_mon is null then raise exception 'Không thấy lớp.'; end if;
  if not public._btnhe_duoc_tao(v_mon, v_khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  return query
  select h.id, h.ho_ten, h.ma_hs,
         (select count(*)::int from public.fn_btyeu_dang_yeu_2_cua_so_moi(h.id, v_mon)),
         (select coalesce(array_agg(d.ten_dang order by d.score), '{}') from public.fn_btyeu_dang_yeu_2_cua_so_moi(h.id, v_mon) d),
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy'
             and b.ngay >= v_tuan and b.ngay < v_tuan + 7)
    from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
   where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
   order by h.ho_ten;
end $$;

-- Tạo ca. p_ta null = không TA cùng làm. Trả {ca_id, so_hs, em_khong_dang:[tên], trung_phong:int}.
create or replace function public.fn_btnhe_tao(p_lop uuid, p_kieu text, p_ngay date, p_gio_bat_dau time, p_phut integer,
                                               p_phong text, p_hs uuid[], p_ta uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare l record; v_me uuid := public.current_nhan_su_id(); v_ca uuid; v_kt time; v_tuan date := date_trunc('week', p_ngay)::date;
  v_hs uuid; v_case uuid; v_buoi uuid; v_ten text; v_n int; v_khong text[] := '{}'; v_trung int := 0;
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

  insert into ca_bo_tro_nhe (lop_id, mon, khoi, kieu, ngay, gio_bat_dau, gio_ket_thuc, phong, truong_khoi_id, ta_id, created_by)
    values (p_lop, l.mon, l.khoi, p_kieu, p_ngay, p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''), v_me, p_ta, public.jwt_uid())
    returning id into v_ca;

  foreach v_hs in array p_hs loop
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, trang_thai, muc, uu_tien)
      values (v_hs, p_lop, l.mon, 'nhe', 'Bổ trợ Nhẹ ' || to_char(p_ngay, 'DD/MM'), 'nhe_mo', 1, 2)
      returning id into v_case;
    if public.fn_btyeu_fill_dang_yeu(v_case) = 0 then
      v_khong := v_khong || (select ho_ten from hoc_sinh where id = v_hs);
    end if;
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_nhe_id)
      values ('bo_tro_nhe', null, p_ngay, public._thu_cua_ngay(p_ngay), p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''),
              v_me, 'mo', public.jwt_uid(), v_ca)
      returning id into v_buoi;
    insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_yeu_id) values (v_buoi, v_hs, v_case);
  end loop;

  -- Trùng phòng: CẢNH BÁO, không chặn (spec §8.2).
  if nullif(trim(coalesce(p_phong, '')), '') is not null then
    select count(*) into v_trung from buoi_hoc b
     where b.ngay = p_ngay and b.phong = trim(p_phong) and b.trang_thai <> 'huy' and coalesce(b.ca_bo_tro_nhe_id, '00000000-0000-0000-0000-000000000000') <> v_ca
       and b.gio_bat_dau < v_kt and coalesce(b.gio_ket_thuc, b.gio_bat_dau + interval '1 hour') > p_gio_bat_dau;
  end if;
  return jsonb_build_object('ca_id', v_ca, 'so_hs', cardinality(p_hs), 'em_khong_dang', to_jsonb(v_khong), 'trung_phong', v_trung);
end $$;

-- Huỷ cả ca: buổi chưa có điểm danh ⇒ huỷ (trigger đóng case 'bo'). Buổi đã điểm danh giữ nguyên.
create or replace function public.fn_btnhe_huy(p_ca uuid, p_ly_do text)
returns integer language plpgsql security definer set search_path = public as $$
declare c record; v_n int;
begin
  select * into c from ca_bo_tro_nhe where id = p_ca for update;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  if not public._btnhe_duoc_tao(c.mon, c.khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  update buoi_hoc b set trang_thai = 'huy', ly_do_huy = coalesce(nullif(trim(coalesce(p_ly_do, '')), ''), 'Huỷ ca Nhẹ'), updated_at = now()
    where b.ca_bo_tro_nhe_id = p_ca and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      and not exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.diem_danh is not null);
  get diagnostics v_n = row_count;
  if not exists (select 1 from buoi_hoc where ca_bo_tro_nhe_id = p_ca and trang_thai <> 'huy') then
    update ca_bo_tro_nhe set trang_thai = 'huy', ly_do_huy = p_ly_do where id = p_ca;
  end if;
  return v_n;
end $$;

-- Danh sách ca Nhẹ [p_tu, p_den] tôi thấy: toàn hệ = mọi ca; còn lại = ca khối tôi là Trưởng, ca tôi mở, ca tôi là TA cùng làm.
create or replace function public.fn_btnhe_ds(p_tu date, p_den date)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'ca_id', c.id, 'lop_id', c.lop_id, 'ten_lop', l.ten_lop, 'mon', c.mon, 'khoi', c.khoi, 'kieu', c.kieu, 'ngay', c.ngay,
    'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong, 'trang_thai', c.trang_thai,
    'truong_khoi_id', c.truong_khoi_id, 'truong_khoi_ten', tk.ho_ten, 'ta_id', c.ta_id, 'ta_ten', ta.ho_ten,
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
              'buoi_id', b.id, 'buoi_hoc_hs_id', hh.id, 'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs,
              'buoi_trang_thai', b.trang_thai, 'diem_danh', hh.diem_danh, 'danh_gia_xong_at', b.danh_gia_xong_at,
              'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id),
              'co_test', exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'),
              'test_da_nop', exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id
                                     where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop'),
              'ket_qua', y.ket_qua) order by h.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh h on h.id = hh.hoc_sinh_id
           left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
          where b.ca_bo_tro_nhe_id = c.id)
  ) order by c.ngay desc, c.gio_bat_dau desc), '[]'::jsonb)
  from ca_bo_tro_nhe c join lop l on l.id = c.lop_id
  left join nhan_su tk on tk.id = c.truong_khoi_id left join nhan_su ta on ta.id = c.ta_id
  where c.ngay between p_tu and p_den and public.la_thanh_vien()
    and (public._btnhe_duoc_tao(c.mon, c.khoi) or c.truong_khoi_id = public.current_nhan_su_id() or c.ta_id = public.current_nhan_su_id())
$$;

-- ── 5. Nới máy chạy ca Yếu cho loại buổi bo_tro_nhe (bản dựng lại từ định nghĩa ĐANG CHẠY, chỉ đổi đúng các dòng ghi chú) ──

-- _btyeu_buoi: where b.id = p_buoi and b.loai = 'bo_tro_yeu'
CREATE OR REPLACE FUNCTION public._btyeu_buoi(p_buoi uuid)
 RETURNS TABLE(buoi_id uuid, hoc_sinh_id uuid, bo_tro_yeu_id uuid, mon text, ngay date, trang_thai text, diem_danh text, nguoi_day_tg uuid, danh_gia_xong_at timestamp with time zone, buoi_hoc_hs_id uuid)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select b.id, hh.hoc_sinh_id, hh.bo_tro_yeu_id, y.mon, b.ngay, b.trang_thai, hh.diem_danh, b.nguoi_day_tg, b.danh_gia_xong_at, hh.id
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.id = p_buoi and b.loai in ('bo_tro_yeu', 'bo_tro_nhe')
  limit 1
$function$;

-- fn_btyeu_bo_diem_danh: r.loai <> 'bo_tro_yeu' · bb.loai = 'bo_tro_yeu'
CREATE OR REPLACE FUNCTION public.fn_btyeu_bo_diem_danh(p_bhh uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_cau integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select hh.id, hh.diem_danh, hh.bo_tro_yeu_id, b.id as buoi_id, b.loai, b.trang_thai, b.danh_gia_xong_at, b.nguoi_day_tg, b.ly_do_huy
    into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh;
  if r.id is null or r.loai not in ('bo_tro_yeu', 'bo_tro_nhe') then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if r.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if r.diem_danh is null then return; end if; -- chưa điểm danh: không có gì để bỏ
  if r.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất — không bỏ điểm danh được.'; end if;
  if exists (select 1 from bai_test t where t.buoi_hoc_id = r.buoi_id and t.loai = 'bo_tro_test') then
    raise exception 'Ca đã đóng (đã sinh test cuối ca) — không bỏ điểm danh được.'; end if;
  select count(*) into v_cau from bai_test t join bai_lam bl on bl.bai_test_id = t.id join bai_lam_cau k on k.bai_lam_id = bl.id
    where t.buoi_hoc_id = r.buoi_id and k.verdict is not null;
  if v_cau > 0 then raise exception 'Em đã làm % câu trong ca — không bỏ điểm danh được.', v_cau; end if;
  if r.diem_danh in ('vang', 'vang_phep') and r.trang_thai = 'huy' then
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_yeu_id = r.bo_tro_yeu_id and bb.id <> r.buoi_id and bb.loai in ('bo_tro_yeu', 'bo_tro_nhe') and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) then
      raise exception 'Em đã được xếp buổi khác — không mở lại buổi này được.'; end if;
    update buoi_hoc set trang_thai = 'mo', ly_do_huy = null, updated_at = now() where id = r.buoi_id;
  end if;
  update buoi_hoc_hs set diem_danh = null, btyeu_che_do = null where id = p_bhh;
end $function$;

-- fn_btyeu_fill_dang_yeu: where id = p_case and trang_thai = 'dang_xu';
CREATE OR REPLACE FUNCTION public.fn_btyeu_fill_dang_yeu(p_case uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_mon text; v_n integer := 0; r record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hoc_sinh_id, mon into v_hs, v_mon from bo_tro_yeu where id = p_case and trang_thai in ('dang_xu', 'nhe_mo'); -- 29/10: + case Bổ trợ Nhẹ
  if v_hs is null then raise exception 'Case không mở.'; end if;
  -- dạng yếu theo bản đồ mới (đã chuyển hẳn 28/10)
  for r in select * from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, v_mon) loop
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
      values (p_case, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
    if found then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $function$;

-- _btyeu_vao_theo_doi_sau_case: if y.id is null then return false; end if;
CREATE OR REPLACE FUNCTION public._btyeu_vao_theo_doi_sau_case(p_case uuid, p_ly_do text, p_bat_buoc boolean DEFAULT false, p_tinh_yeu boolean DEFAULT true)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare y record; v_yeu jsonb := '[]'::jsonb; v_da_hoc int; v_ds text; v_gc text; v_so int;
begin
  select * into y from bo_tro_yeu where id = p_case;
  if y.id is null then return false; end if;
  if y.trang_thai in ('nhe_mo', 'nhe_xong') then return false; end if; -- 29/10 Bổ trợ Nhẹ: còn yếu thì trưởng khối tự xử lý, không vào theo dõi
  if exists (select 1 from bo_tro_theo_doi where hoc_sinh_id = y.hoc_sinh_id and mon = y.mon and trang_thai = 'theo_doi') then return false; end if; -- đã ở theo dõi
  select count(*) into v_da_hoc from bo_tro_yeu_dang where bo_tro_yeu_id = p_case and day_at is not null;
  if p_tinh_yeu then
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', t.ma_dang, 'ten_dang', t.ten_dang, 'score', t.score, 'n', t.n) order by t.score), '[]'::jsonb)
      into v_yeu from public._btyeu_dang_con_yeu(p_case) t;
  end if;
  v_so := jsonb_array_length(v_yeu);
  if v_so = 0 and not p_bat_buoc then return false; end if;
  select string_agg(x ->> 'ten_dang', '; ') into v_ds from (select x from jsonb_array_elements(v_yeu) x limit 6) s;
  v_gc := 'Sau bổ trợ yếu (' || p_ly_do || ')'
          || case when v_so > 0 then ' — còn yếu ' || v_so || ' dạng đã học: ' || v_ds || case when v_so > 6 then '…' else '' end
                  when v_da_hoc = 0 then ' — chưa học dạng nào trong ca' else '' end;
  insert into bo_tro_theo_doi (hoc_sinh_id, mon, vao_boi, nguon, ghi_chu, so_lieu_vao)
    values (y.hoc_sinh_id, y.mon, public.jwt_uid(), 'sau_bo_tro', v_gc,
            jsonb_build_object('chuyen_de', '[]'::jsonb,
              'et_btvn', case when p_tinh_yeu then public.fn_botro_et_btvn(y.hoc_sinh_id, 4) else jsonb_build_object('et', '[]'::jsonb, 'btvn', '[]'::jsonb) end,
              'sau_bo_tro', jsonb_build_object('case_id', p_case, 'ly_do', p_ly_do, 'dang_con_yeu', v_yeu, 'so_dang_da_hoc', v_da_hoc)));
  return true;
end $function$;

-- _btyeu_ca_cua_hs: where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo'
CREATE OR REPLACE FUNCTION public._btyeu_ca_cua_hs(p_hs uuid, p_buoi uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := p_hs; v_td_sql text;
  r record;
  v_bd text; v_cautbl text; v_cumtbl text;
  v_dangs jsonb; v_test jsonb;
  rd record; v_nh text; v_mot jsonb;
begin
  if v_hs is null then return null; end if;
  select b.id, b.gio_bat_dau, b.gio_ket_thuc, b.phong, y.id as case_id, y.mon,
         (select ho_ten from nhan_su where id = b.nguoi_day_tg) as ta_ten
    into r
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.loai in ('bo_tro_yeu', 'bo_tro_nhe') and b.trang_thai = 'mo'
    and (case when p_buoi is null then (b.ngay = public._btyeu_today() and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null) else b.id = p_buoi end)
  order by b.gio_bat_dau nulls last, b.created_at
  limit 1;
  if r.id is null then return null; end if;

  v_bd := public._kho_ban_do_tbl(r.mon); v_cautbl := public._kho_cau_tbl(r.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  v_dangs := '[]'::jsonb;
  -- 29/09: mỗi dạng tra bản đồ/cụm theo NHÁNH của chính nó (Đại · Hình GT · Hình học) — trước 1 bảng cho cả case.
  for rd in select d.id, d.ma_dang from bo_tro_yeu_dang d where d.bo_tro_yeu_id = r.case_id and d.dong_at is null
            order by d.diem_luc_mo nulls last, d.created_at loop
    v_nh := public._kho_nhanh_cua_dang(r.mon, rd.ma_dang);
    v_bd := public._kho_ban_do_tbl(r.mon, v_nh); v_cautbl := public._kho_cau_tbl(r.mon, v_nh); v_cumtbl := public._kho_cum_tbl(v_cautbl);
    -- 29/10: KHÔNG phải nhánh nào cũng có bảng tiền đề (bdm_cum_tien_de KHÔNG tồn tại ⇒ cả ca của mọi em có dạng NDB* nổ lỗi, app HS coi như "không có ca").
    v_td_sql := case when to_regclass('public.' || quote_ident(replace(v_cumtbl, '_cum_bai', '_cum_tien_de'))) is not null
                     then format('coalesce((select jsonb_agg(t.tien_de_ma_cum) from %I t where t.ma_cum = k.ma_cum), ''[]''::jsonb)', replace(v_cumtbl, '_cum_bai', '_cum_tien_de'))
                     else '''[]''::jsonb' end;
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'da_day_truoc', (d.day_at is not null and d.day_buoi_id is distinct from $1),
      'diem_luc_mo', d.diem_luc_mo,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      -- Thùy 13/10: cụm KHÔNG có bài dùng được thì không liệt kê (trước hiện "kho chưa có bài" và khoá luôn cả dạng dù dạng có bài chưa chia cụm).
      -- Không cụm nào có bài ⇒ danh sách rỗng ⇒ app hiện 1 ô "Cả dạng". Có cụm có bài mà còn bài nằm ngoài cụm ⇒ thêm mục "Cả dạng" (ma_cum null = luyện cả dạng).
      'cums', coalesce((
        select jsonb_agg(x.j order by x.thu_tu, x.ma_cum nulls last) from (
          select k.thu_tu, k.ma_cum, jsonb_build_object(
            'ma_cum', k.ma_cum, 'ten', coalesce(k.ten, 'Cụm ' || k.thu_tu), 'thu_tu', k.thu_tu,
            'tien_de', %3$s,
            'so_cau_kho', kc.n,
            'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang and td.ma_cum = k.ma_cum), 0),
            'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang and td.ma_cum = k.ma_cum), 0)) as j
          from %2$I k
          cross join lateral (select count(*) as n from %4$I c where c.ma_cum = k.ma_cum and c.dang_chinh = d.ma_dang and c.xoa_at is null and %5$s) kc
          where k.ma_dang = d.ma_dang and kc.n > 0
          union all
          select tc.thu_tu, null, jsonb_build_object(
            'ma_cum', null, 'ten', 'Cả dạng (gồm bài chưa chia cụm)', 'thu_tu', tc.thu_tu, 'tien_de', '[]'::jsonb,
            'so_cau_kho', tc.tat_ca,
            'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang and td.ma_cum is null), 0),
            'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang and td.ma_cum is null), 0))
          from (select count(*) as tat_ca,
                       count(*) filter (where exists (select 1 from %2$I k2 where k2.ma_cum = c.ma_cum and k2.ma_dang = d.ma_dang)) as trong_cum,
                       (select coalesce(max(k3.thu_tu), 0) + 1 from %2$I k3 where k3.ma_dang = d.ma_dang) as thu_tu
                from %4$I c where c.dang_chinh = d.ma_dang and c.xoa_at is null and %5$s) tc
          where tc.trong_cum > 0 and tc.tat_ca > tc.trong_cum
        ) x), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d
    left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cumtbl, v_td_sql, v_cautbl, public._btyeu_dk_dang_sql(v_cautbl, rd.ma_dang))
  into v_mot using r.id, rd.id;
    v_dangs := v_dangs || jsonb_build_array(v_mot);
  end loop;

  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'))
    into v_test
  from bai_test bt where bt.buoi_hoc_id = r.id and bt.loai = 'bo_tro_test' limit 1;

  return jsonb_build_object(
    'buoi_id', r.id, 'mon', r.mon, 'gio_bat_dau', r.gio_bat_dau, 'gio_ket_thuc', r.gio_ket_thuc, 'phong', r.phong,
    'ta_ten', r.ta_ten, 'dangs', v_dangs, 'test', v_test);
end $function$;

-- ── 6. Quyền gọi ──
do $$
declare f text;
begin
  foreach f in array array[
    'public._btnhe_duoc_tao(text, text)', 'public._btnhe_gio_lop(uuid, date)', 'public.fn_btnhe_lop_cua_toi(date)',
    'public.fn_btnhe_lop_hs(uuid, date)', 'public.fn_btnhe_tao(uuid, text, date, time, integer, text, uuid[], uuid)',
    'public.fn_btnhe_huy(uuid, text)', 'public.fn_btnhe_ds(date, date)', 'public._trg_btnhe_dong_case()']
  loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
