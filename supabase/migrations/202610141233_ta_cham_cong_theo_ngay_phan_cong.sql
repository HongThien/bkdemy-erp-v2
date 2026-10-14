-- ============================================================================
-- 202610141233 — ta_cham_cong_theo_ngay_phan_cong
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 14/10, sau khi duyệt mockup chấm công):
--   ① LUẬT THỜI GIAN: "TA được phân công vào lớp ngày 12/10 thì dữ liệu phải từ ngày đó, không đẻ ra dữ liệu
--     phía trước." Mig 202610122210 đọc phân công HIỆN TẠI (phan_cong_lop) ở 4 chỗ ⇒ sai cho mọi ngày trước
--     ngày phân công / sau ngày rút:
--       · fn_ta_buoi_thieu_cong: buổi 05/10 ghi "người phụ trách" = TA mới phân 12/10.
--       · fn_ta_doi_chieu: TA khai trợ giảng 05/10 ở lớp mình được phân 12/10 ⇒ không hiện "làm hộ" ai.
--       · fn_ta_khai_viec / fn_ta_hom_nay: lớp mặc định + gợi ý việc của NGÀY KHAI lấy theo phân công hôm nay.
--       · _ta_luong_tinh: TA bị rút giữa tháng ⇒ mất luôn tư cách "lớp của mình" của tháng đó.
--     Sửa: mọi chỗ đọc "phân công TẠI NGÀY X" từ phan_cong_lop_log (khoảng them → xoa, theo ngày giờ VN).
--     Ngày phân công = ngày ghi vào ERP (log). Dòng phân công có từ trước 12/10 lấy created_at (= ngày nhập ERP).
--   ② KHAI LÙI THÁNG 10 (Thùy 14/10: "vẫn cho phép backdate tháng 10 là ngon nhất"): hệ thống mở giữa tháng
--     ⇒ một ĐỢT MỞ KHAI BÙ: TA tự khai ca + việc cho mọi ngày 01–31/10 tới hết 03/11 (hạn duyệt). Ngoài đợt
--     vẫn luật 24 giờ. "Thiếu công" tính từ ngày đầu của đợt sớm nhất (01/10).
--   ③ %TG giữa tháng = buổi TA làm ÷ số buổi CẢ THÁNG của lớp (Thùy 14/10 chọn 4/8) — hàm lương đã đúng, giữ.
--   ④ Chữ: "chấm công vào/ra" → Checkin / Checkout trong thông báo lỗi.
--   ⑤ Quyền: ta_cong_duyet + ta_luong gán cho vai Core team (Thùy 14/10, chấp nhận Lộc cũng xem).
--   ⑥ Khai trợ giảng / trông thi tự gõ (không bấm từ gợi ý) mà lớp hôm đó có buổi ⇒ tự gắn buổi đó
--     (khoá tự nhiên, chặn ghi hai lần cùng một buổi), báo "đã ghi công rồi" thay lỗi unique khó đọc.
--
-- MẤT GÌ (Luật xoá): không drop/alter thu hẹp. Thêm 1 bảng (ta_dot_khai_bu) + 4 hàm nội bộ; các hàm
--   fn_ta_* thay thân bằng create or replace, giữ nguyên chữ ký.
-- ============================================================================

-- ── 1. Phân công TA tại một ngày (từ log) ─────────────────────────────────────
-- Khoảng [tu, den] theo ngày VN; den NULL = đang phân công. Bị rút ngày D ⇒ ngày cuối = D − 1.
create or replace function _ta_pc_khoang()
returns table(nhan_su_id uuid, lop_id uuid, tu date, den date)
language sql stable security definer set search_path = public as $$
  select t.nhan_su_id, t.lop_id, (t.ts at time zone 'Asia/Ho_Chi_Minh')::date,
         (x.ts at time zone 'Asia/Ho_Chi_Minh')::date - 1
    from phan_cong_lop_log t
    left join lateral (select min(o.ts) as ts from phan_cong_lop_log o
                        where o.nhan_su_id = t.nhan_su_id and o.lop_id = t.lop_id and o.vai_tro = t.vai_tro
                          and o.hanh_dong = 'xoa' and o.ts > t.ts) x on true
   where t.vai_tro = 'tg' and t.hanh_dong = 'them'
     and (x.ts is null or (x.ts at time zone 'Asia/Ho_Chi_Minh')::date > (t.ts at time zone 'Asia/Ho_Chi_Minh')::date)
$$;

-- TA (vai tg) phụ trách lớp TẠI ngày p_ngay. la_chinh = cờ chính mới nhất tính tới ngày đó.
create or replace function _ta_tg_tai(p_ngay date, p_lop uuid default null, p_ns uuid default null)
returns table(nhan_su_id uuid, lop_id uuid, la_chinh boolean)
language sql stable security definer set search_path = public as $$
  select distinct k.nhan_su_id, k.lop_id,
         coalesce((select l.la_chinh from phan_cong_lop_log l
                    where l.nhan_su_id = k.nhan_su_id and l.lop_id = k.lop_id and l.vai_tro = 'tg'
                      and l.hanh_dong in ('them', 'doi_chinh') and (l.ts at time zone 'Asia/Ho_Chi_Minh')::date <= p_ngay
                    order by l.ts desc limit 1), false)
    from _ta_pc_khoang() k
   where k.tu <= p_ngay and (k.den is null or k.den >= p_ngay)
     and (p_lop is null or k.lop_id = p_lop) and (p_ns is null or k.nhan_su_id = p_ns)
$$;

-- ── 2. Đợt mở khai bù ─────────────────────────────────────────────────────────
create table ta_dot_khai_bu (
  id      uuid primary key default gen_random_uuid(),
  tu      date not null,
  den     date not null,
  han     timestamptz not null,            -- quá giờ này thì đợt đóng, chỉ còn luật 24 giờ
  ghi_chu text not null default '',
  tao_boi uuid references nhan_su(id),
  tao_at  timestamptz not null default now(),
  check (den >= tu)
);
comment on table ta_dot_khai_bu is 'Đợt cho TA tự khai lùi ca + việc ngoài luật 24 giờ (vd tháng 10/2026: hệ thống mở giữa tháng). Ngày đầu đợt sớm nhất = mốc bắt đầu tính "thiếu công".';
alter table ta_dot_khai_bu enable row level security;
create policy ta_dot_khai_bu_doc on ta_dot_khai_bu for select to authenticated using (la_thanh_vien());
insert into ta_dot_khai_bu (tu, den, han, ghi_chu) values
  ('2026-10-01', '2026-10-31', '2026-11-03 23:59:59'::timestamp at time zone 'Asia/Ho_Chi_Minh',
   'Thùy 14/10: hệ thống chấm công mở giữa tháng 10 — cho TA khai lùi cả tháng, hạn = hạn duyệt 03/11');

create or replace function _ta_duoc_khai_bu(p_ngay date) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from ta_dot_khai_bu d where p_ngay between d.tu and d.den and now() <= d.han)
$$;

create or replace function _ta_moc_cham_cong() returns date
language sql stable security definer set search_path = public as $$
  select coalesce((select min(tu) from ta_dot_khai_bu),
                  (select min(ngay) from ta_cham_cong),
                  (now() at time zone 'Asia/Ho_Chi_Minh')::date)
$$;

-- ── 3. Hàm GHI (thay thân) ────────────────────────────────────────────────────
create or replace function fn_ta_cham_cong_ra() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_id uuid;
        v_ngay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  update ta_cham_cong set ra_at = now(), trang_thai = 'xong'
   where nhan_su_id = v_ns and ngay = v_ngay and ra_at is null returning id into v_id;
  if v_id is null then raise exception 'Hôm nay chưa checkin'; end if;
  return v_id;
end $$;

-- Khai bù ca (quên checkin / quên checkout): trong 24 giờ, hoặc ngày nằm trong đợt mở khai bù.
create or replace function fn_ta_cham_cong_khai_bu(p_vao timestamptz, p_ra timestamptz, p_co_so text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_id uuid;
        v_ngay date := (p_vao at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  if p_ra <= p_vao then raise exception 'Giờ checkout phải sau giờ checkin'; end if;
  if (p_ra at time zone 'Asia/Ho_Chi_Minh')::date <> v_ngay then raise exception 'Checkin và checkout phải cùng một ngày'; end if;
  if p_ra > now() then raise exception 'Không khai bù cho giờ chưa tới'; end if;
  if now() > p_ra + interval '24 hours' and not public._ta_duoc_khai_bu(v_ngay) then
    raise exception 'Đã quá 24 giờ — nhờ quản lý nhập hộ';
  end if;
  -- quên CHECKOUT: ca hôm đó còn mở ⇒ điền giờ ra cho chính ca đó (giữ giờ checkin gốc)
  update ta_cham_cong set ra_at = p_ra, trang_thai = 'xong', khai_bu = true
   where nhan_su_id = v_ns and ngay = v_ngay and ra_at is null and p_ra >= vao_at returning id into v_id;
  if v_id is not null then return v_id; end if;
  insert into ta_cham_cong (nhan_su_id, ngay, vao_at, ra_at, co_so, khai_bu, trang_thai, created_by)
  values (v_ns, v_ngay, p_vao, p_ra, p_co_so, true, 'xong', v_ns) returning id into v_id;
  return v_id;
end $$;

-- TA khai việc. Trợ giảng không chọn lớp ⇒ lớp chính TẠI NGÀY ĐÓ (không có ⇒ bắt chọn, không đoán).
-- Trợ giảng / trông thi có lớp mà chưa gắn buổi ⇒ tự gắn buổi của lớp hôm đó (khoá tự nhiên).
create or replace function fn_ta_khai_viec(p_loai text, p_ngay date, p_lop uuid default null, p_buoi uuid default null,
  p_ca uuid default null, p_bat time default null, p_ket time default null, p_hs text default null, p_ghi_chu text default '')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_cc uuid; v_id uuid; v_lop uuid := p_lop; v_buoi uuid := p_buoi;
        v_bat time := p_bat; v_ket time := p_ket; v_tinh text;
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_het timestamptz := ((p_ngay + coalesce(p_ket, time '23:59'))::timestamp at time zone 'Asia/Ho_Chi_Minh');
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  if p_ngay > v_homnay then raise exception 'Không khai trước cho ngày chưa tới'; end if;
  if now() > v_het + interval '24 hours' and not public._ta_duoc_khai_bu(p_ngay) then
    raise exception 'Đã quá 24 giờ kể từ khi việc diễn ra — nhờ quản lý nhập hộ';
  end if;
  select id into v_cc from ta_cham_cong where nhan_su_id = v_ns and ngay = p_ngay and duyet <> 'tu_choi' order by vao_at desc limit 1;
  if v_cc is null then raise exception 'Chưa checkin ngày %', to_char(p_ngay, 'DD/MM'); end if;
  select tinh_vao into v_tinh from ta_loai_viec where ma = p_loai;
  if v_lop is null and v_buoi is not null then select b.lop_id into v_lop from buoi_hoc b where b.id = v_buoi; end if;
  if v_lop is null and p_loai = 'tro_giang' then
    select t.lop_id into v_lop from public._ta_tg_tai(p_ngay, null, v_ns) t order by t.la_chinh desc limit 1;
    if v_lop is null then
      raise exception 'Ngày % bạn chưa được phân công lớp nào — chọn đúng lớp đã trợ giảng', to_char(p_ngay, 'DD/MM');
    end if;
  end if;
  if v_buoi is null and v_tinh in ('tg', 'trong_thi') and v_lop is not null then
    select b.id, coalesce(v_bat, b.gio_bat_dau), coalesce(v_ket, b.gio_ket_thuc) into v_buoi, v_bat, v_ket
      from buoi_hoc b
     where b.lop_id = v_lop and b.ngay = p_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
     order by b.gio_bat_dau nulls last limit 1;
  end if;
  begin
    insert into ta_cong_viec (nhan_su_id, cham_cong_id, ngay, loai_viec, lop_id, buoi_hoc_id, ca_bo_tro_id,
                              gio_bat_dau, gio_ket_thuc, hoc_sinh, ghi_chu, nguon, khai_bu, created_by)
    values (v_ns, v_cc, p_ngay, p_loai, v_lop, v_buoi, p_ca, v_bat, v_ket, p_hs, coalesce(p_ghi_chu, ''),
            case when v_buoi is not null or p_ca is not null then 'he_thong' else 'tu_khai' end, p_ngay < v_homnay, v_ns)
    returning id into v_id;
  exception when unique_violation then
    raise exception 'Việc này đã ghi công rồi';
  end;
  return v_id;
end $$;

-- ── 4. Hàm ĐỌC (thay thân) ────────────────────────────────────────────────────
create or replace function fn_ta_hom_nay(p_at timestamptz default now())
returns table(nguon text, loai_viec text, lop_id uuid, ten_lop text, buoi_hoc_id uuid, ca_bo_tro_id uuid,
              gio_bat_dau time, gio_ket_thuc time, dang_dien_ra boolean, da_khai boolean)
language plpgsql stable security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id();
        v_ngay date := (p_at at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (p_at at time zone 'Asia/Ho_Chi_Minh')::time;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  return query
  with k1 as (
    -- buổi thường của lớp mình TẠI NGÀY ĐÓ; buổi có kỳ thi ⇒ gợi ý trông thi
    select 'buoi_thuong'::text as nguon,
           case when exists (select 1 from ky_thi kt where kt.buoi_hoc_id = b.id) then 'trong_thi' else 'tro_giang' end::text as loai_viec,
           b.lop_id, l.ten_lop, b.id as buoi_hoc_id, null::uuid as ca_bo_tro_id, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b join lop l on l.id = b.lop_id
      join public._ta_tg_tai(v_ngay, null, v_ns) pc on pc.lop_id = b.lop_id
     where b.ngay = v_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
    union all
    -- ca trực bổ trợ khối đã xếp cho mình
    select 'ca_bo_tro', 'bo_tro_dinh_ki', null::uuid, concat_ws(' ', c.mon, c.khoi), null::uuid, c.id, c.gio_bat_dau, c.gio_ket_thuc
      from ca_bo_tro c
     where c.ngay = v_ngay and c.trang_thai = 'mo' and v_ns in (c.nhan_su_id, c.nhan_su_2_id)
    union all
    -- buổi bù / yếu / đuổi mình dạy
    select 'buoi_bo_tro',
           case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end,
           b.lop_id, l.ten_lop, b.id, null::uuid, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b left join lop l on l.id = b.lop_id
     where b.ngay = v_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and b.nguoi_day = v_ns
  )
  select x.nguon, x.loai_viec, x.lop_id, x.ten_lop, x.buoi_hoc_id, x.ca_bo_tro_id, x.gio_bat_dau, x.gio_ket_thuc,
         (x.gio_bat_dau is not null and x.gio_ket_thuc is not null
            and v_gio between x.gio_bat_dau - interval '30 minutes' and x.gio_ket_thuc + interval '30 minutes'),
         exists (select 1 from ta_cong_viec cv where cv.nhan_su_id = v_ns and cv.trang_thai <> 'tu_choi'
                   and ((x.buoi_hoc_id is not null and cv.buoi_hoc_id = x.buoi_hoc_id and cv.loai_viec = x.loai_viec)
                     or (x.ca_bo_tro_id is not null and cv.ca_bo_tro_id = x.ca_bo_tro_id)))
    from k1 x
   order by x.gio_bat_dau nulls last;
end $$;

-- ĐỐI CHIẾU: "làm hộ ai" = TA phụ trách lớp TẠI NGÀY của việc (không phải hôm nay).
create or replace function fn_ta_doi_chieu(p_tu date, p_den date default null)
returns table(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date,
              vao_at timestamptz, ra_at timestamptz, vao_chot timestamptz, ra_chot timestamptz, quen_ra boolean,
              khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text,
              gio_bat_dau time, gio_ket_thuc time, hoc_sinh text, ghi_chu text,
              khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare v_den date := coalesce(p_den, p_tu);
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if not public.co_chuc_nang('ta_cong_duyet') then raise exception 'Không có quyền xem đối chiếu công'; end if;
  return query
  -- CA CÓ MẶT
  select 'ca'::text, cc.id, cc.id, cc.nhan_su_id, ns.ho_ten, cc.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         (cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay),
         cc.khai_bu, cc.nguon, null::text, null::text, null::uuid, null::text, null::time, null::time, null::text, ''::text,
         null::boolean,
         array_remove(array[
           case when cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay then 'quen_ra' end,
           case when cc.khai_bu then 'khai_bu' end,
           case when cc.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when not exists (select 1 from ta_cong_viec v where v.cham_cong_id = cc.id and v.trang_thai <> 'tu_choi') then 'ca_khong_viec' end
         ], null),
         null::text, cc.duyet, cc.ly_do_duyet
    from ta_cham_cong cc join nhan_su ns on ns.id = cc.nhan_su_id
   where cc.ngay between p_tu and v_den
  union all
  -- VIỆC
  select 'viec'::text, cv.id, cv.cham_cong_id, cv.nhan_su_id, ns.ho_ten, cv.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         false, cv.khai_bu, cv.nguon, cv.loai_viec, lv.ten, cv.lop_id, l.ten_lop, cv.gio_bat_dau, cv.gio_ket_thuc, cv.hoc_sinh, cv.ghi_chu,
         kq.khop,
         array_remove(array[
           case when lv.tinh_vao = 'tg' and not kq.khop and exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong' and b.trang_thai = 'huy') then 'buoi_huy' end,
           case when lv.tinh_vao = 'tg' and not exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong') then 'khong_co_buoi' end,
           case when lv.tinh_vao = 'tg' and exists (select 1 from ta_cong_viec o join ta_loai_viec lo on lo.ma = o.loai_viec
                        where o.lop_id = cv.lop_id and o.ngay = cv.ngay and lo.tinh_vao = 'tg' and o.trang_thai <> 'tu_choi'
                          and o.nhan_su_id <> cv.nhan_su_id) then 'hai_ta_cung_buoi' end,
           case when cc.id is not null and cv.gio_bat_dau is not null
                     and cv.gio_bat_dau < (coalesce(cc.vao_chot, cc.vao_at) at time zone 'Asia/Ho_Chi_Minh')::time - interval '15 minutes' then 'truoc_gio_vao' end,
           case when cc.id is not null and cv.gio_ket_thuc is not null and coalesce(cc.ra_chot, cc.ra_at) is not null
                     and cv.gio_ket_thuc > (coalesce(cc.ra_chot, cc.ra_at) at time zone 'Asia/Ho_Chi_Minh')::time + interval '15 minutes' then 'sau_gio_ra' end,
           case when cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null and exists (select 1 from ta_cong_viec o
                        where o.nhan_su_id = cv.nhan_su_id and o.ngay = cv.ngay and o.id <> cv.id and o.trang_thai <> 'tu_choi'
                          and o.gio_bat_dau < cv.gio_ket_thuc and o.gio_ket_thuc > cv.gio_bat_dau) then 'trung_gio' end,
           case when cv.gio_bat_dau < time '07:00' or cv.gio_ket_thuc > time '22:30' then 'ngoai_gio' end,
           case when lv.don_vi = 'gio' and (cv.gio_bat_dau is null or cv.gio_ket_thuc is null) then 'thieu_gio' end,
           case when lv.nhom = 'ngoai_package' and not exists (select 1 from ta_don_gia d where d.ma = 'gia_' || lv.ma and d.hieu_luc_tu <= cv.ngay) then 'chua_don_gia' end,
           case when cv.khai_bu then 'khai_bu' end,
           case when cv.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when cc.id is not null and cc.duyet = 'tu_choi' then 'ca_bi_tu_choi' end,
           -- trợ giảng ở lớp mà NGÀY ĐÓ chưa có TA nào được phân công
           case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                     and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id)) then 'lop_chua_co_ta' end
         ], null),
         case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                   and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id, cv.nhan_su_id))
                then (select n2.ho_ten from public._ta_tg_tai(cv.ngay, cv.lop_id) t join nhan_su n2 on n2.id = t.nhan_su_id
                       order by t.la_chinh desc, n2.ho_ten limit 1)
              when cv.ca_bo_tro_id is not null and not exists (select 1 from ca_bo_tro c where c.id = cv.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))
                then (select n2.ho_ten from ca_bo_tro c join nhan_su n2 on n2.id = c.nhan_su_id where c.id = cv.ca_bo_tro_id)
         end,
         cv.trang_thai, cv.ly_do_duyet
    from ta_cong_viec cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    join nhan_su ns on ns.id = cv.nhan_su_id
    left join lop l on l.id = cv.lop_id
    left join ta_cham_cong cc on cc.id = cv.cham_cong_id
    cross join lateral (select case
        when lv.tinh_vao = 'tg' then exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                                              and b.loai = 'thuong' and b.trang_thai <> 'huy')
        when cv.loai_viec = 'bo_tro_dinh_ki' then exists (select 1 from ca_bo_tro c where c.ngay = cv.ngay and c.trang_thai = 'mo'
                                              and (c.id = cv.ca_bo_tro_id or cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
        when cv.loai_viec in ('bo_tro_bu', 'bo_tro_yeu', 'bo_tro_duoi') then exists (
              select 1 from buoi_hoc b
               where b.ngay = cv.ngay and b.trang_thai <> 'huy'
                 and b.loai = case cv.loai_viec when 'bo_tro_bu' then 'bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end
                 and (b.id = cv.buoi_hoc_id or b.nguoi_day = cv.nhan_su_id
                      or exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
                 and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'))
        when lv.tinh_vao = 'trong_thi' then exists (select 1 from buoi_hoc b join ky_thi kt on kt.buoi_hoc_id = b.id
                                              where b.lop_id = cv.lop_id and b.ngay = cv.ngay)
        else false end as khop) kq
   where cv.ngay between p_tu and v_den
   order by 6, 5, 1, 18 nulls first;
end $$;

-- BẤT BIẾN thiếu công: chỉ từ MỐC chấm công (01/10), chỉ buổi/ca đã kết thúc; người phụ trách = TA TẠI NGÀY ĐÓ.
create or replace function fn_ta_buoi_thieu_cong(p_tu date, p_den date default null)
returns table(loai text, ngay date, lop_id uuid, ten text, gio_bat_dau time, gio_ket_thuc time,
              buoi_hoc_id uuid, ca_bo_tro_id uuid, nguoi_phu_trach text)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (now() at time zone 'Asia/Ho_Chi_Minh')::time;
        v_tu date := greatest(p_tu, public._ta_moc_cham_cong());
        v_den date := least(coalesce(p_den, p_tu), v_homnay);
begin
  if not public.co_chuc_nang('ta_cong_duyet') then raise exception 'Không có quyền xem đối chiếu công'; end if;
  return query
  select 'buoi'::text, b.ngay, b.lop_id, l.ten_lop, b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid,
         (select n.ho_ten from public._ta_tg_tai(b.ngay, b.lop_id) t join nhan_su n on n.id = t.nhan_su_id
           order by t.la_chinh desc, n.ho_ten limit 1)
    from buoi_hoc b join lop l on l.id = b.lop_id
   where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec
                      where cv.lop_id = b.lop_id and cv.ngay = b.ngay and lv.tinh_vao in ('tg', 'trong_thi') and cv.trang_thai <> 'tu_choi')
  union all
  select 'ca'::text, c.ngay, null::uuid, concat_ws(' ', 'Trực bổ trợ', c.mon, c.khoi), c.gio_bat_dau, c.gio_ket_thuc, null::uuid, c.id,
         (select n.ho_ten from nhan_su n where n.id = c.nhan_su_id)
    from ca_bo_tro c
   where c.trang_thai = 'mo' and c.ngay between v_tu and v_den
     and (c.ngay < v_homnay or c.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv
                      where cv.trang_thai <> 'tu_choi' and cv.ngay = c.ngay
                        and (cv.ca_bo_tro_id = c.id or (cv.loai_viec = 'bo_tro_dinh_ki' and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))))
   order by 2, 5 nulls last;
end $$;


-- ── 5. Lương: lớp của TA theo phân công TRONG KỲ (log), không theo phân công hôm nay ──
-- %TG giữ nguyên: buổi TA làm ÷ số buổi CẢ THÁNG của lớp (Thùy 14/10: phân 12/10, đi đủ 4/8 buổi ⇒ 50%).
create or replace function _ta_luong_tinh(p_ky date, p_ns uuid default null)
returns table(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric,
              ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb)
language sql stable security definer set search_path = public as $$
with
k as (
  select date_trunc('month', p_ky)::date as tu,
         (date_trunc('month', p_ky)::date + interval '1 month' - interval '1 day')::date as den
),
cv_ok as (   -- việc được tính lương: đã duyệt VÀ ca có mặt của nó đã duyệt (việc nhập hộ / nạp cũ không gắn ca: chỉ cần việc đã duyệt)
  select cv.* from ta_cong_viec cv, k
   where cv.ky = k.tu and cv.trang_thai = 'da_duyet'
     and (cv.cham_cong_id is null
          or exists (select 1 from ta_cham_cong cc where cc.id = cv.cham_cong_id and cc.duyet = 'da_duyet'))
),
dg as (   -- đơn giá đang hiệu lực tại đầu kỳ (dòng mới nhất có hieu_luc_tu <= đầu kỳ)
  select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
    from ta_don_gia d, k where d.hieu_luc_tu <= k.tu
   order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
),
cfg as (
  select (select gia_tri from dg where ma = 'he_so_tg')            as w_tg,
         (select gia_tri from dg where ma = 'he_so_btvn')          as w_btvn,
         (select gia_tri from dg where ma = 'he_so_bo_tro')        as w_bt,
         (select gia_tri from dg where ma = 'chi_tieu_bo_tro_gio') as chi_tieu,
         (select gia_tri from dg where ma = 'btvn_lop_8_buoi')     as btvn_8,
         (select gia_tri from dg where ma = 'btvn_lop_4_buoi')     as btvn_4
),
ta_sel as (
  select x.nhan_su_id from (
    select pk.nhan_su_id from public._ta_pc_khoang() pk, k where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
    union
    select cv.nhan_su_id from cv_ok cv
  ) x where p_ns is null or x.nhan_su_id = p_ns
),
lop_cua as (
  -- Lớp thuộc về TA được phân công (la_chu) giữ BTVN + chỉ tiêu bổ trợ + bậc lương, kể cả khi nhờ người dạy hộ.
  -- Lớp TA có công TG mà không được phân công = dạy hộ: tiền TG của buổi đó đi theo người dạy (CEO 12/10).
  select x.nhan_su_id, x.lop_id, bool_or(x.chu) as la_chu, bool_or(x.la_chinh) as la_chinh
    from (
      -- Lớp chủ = được phân công vào BẤT KỲ NGÀY NÀO trong kỳ (theo log): phân công SAU kỳ không tính vào kỳ này
      -- (Tùng 6A3, Vân Anh 7S3 phân 11–12/10); TA bị rút giữa kỳ vẫn giữ lớp cho kỳ đó (Thùy 14/10).
      select pk.nhan_su_id, pk.lop_id, true as chu,
             coalesce((select lg.la_chinh from phan_cong_lop_log lg
                        where lg.nhan_su_id = pk.nhan_su_id and lg.lop_id = pk.lop_id and lg.vai_tro = 'tg'
                          and lg.hanh_dong in ('them', 'doi_chinh') and (lg.ts at time zone 'Asia/Ho_Chi_Minh')::date <= k.den
                        order by lg.ts desc limit 1), false) as la_chinh
        from public._ta_pc_khoang() pk join ta_sel s on s.nhan_su_id = pk.nhan_su_id, k
       where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
      union all
      select cv.nhan_su_id, cv.lop_id, false, false
        from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
        join ta_sel s on s.nhan_su_id = cv.nhan_su_id
       where lv.tinh_vao = 'tg' and cv.lop_id is not null
    ) x
   group by x.nhan_su_id, x.lop_id
),
lop_stat as (
  select lc.nhan_su_id, lc.lop_id, l.ten_lop, lc.la_chu, lc.la_chinh,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
        and b.ngay between k.tu and k.den)::int as so_buoi,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong'
        and b.ngay between k.tu and k.den)::int as so_buoi_lich,
    -- BTVN thật (CEO 12/10): buổi lớp mình mà CHÍNH TA này đã chấm (gami_grades.graded_by → tai_khoan → nhan_su)
    -- trong hạn duyệt của kỳ. Buổi MT/thi không có câu BTVN ⇒ không có dòng chấm ⇒ không tính;
    -- BTVN online TA chưa chấm (hoặc chấm sau hạn) ⇒ không tính.
    (select count(*) from buoi_hoc b, k
      where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between k.tu and k.den
        and exists (select 1 from gami_grades g
                      join gami_session_problems p on p.id = g.problem_id and p.phase = 'btvn' and not p.hidden
                      join tai_khoan tk on tk.id = g.graded_by
                     where g.buoi_hoc_id = b.id and tk.nhan_su_id = lc.nhan_su_id
                       and g.graded_at < ((k.tu + interval '1 month')
                             + make_interval(days => coalesce((select gia_tri::int from dg where ma = 'han_duyet_ngay'), 3)))
                             ::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int as btvn_lam,
    (select avg(x.c) from k, generate_series(k.tu, k.den, interval '1 day') d(d),
        lateral (select count(*)::int as c from hoc_sinh_lop h
                  where h.lop_id = lc.lop_id and h.ngay_vao <= d.d::date
                    and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x) as si_tb,
    -- TG: từ CHẤM CÔNG đã duyệt (K2), theo ngày. Trông thi ở LỚP MÌNH nằm trong công TG: cùng ngày chỉ tính
    -- một lần vào TG (không trả tiền trông thi riêng — xem ngoai_dong), kể cả khi hôm đó chỉ có dòng trông thi.
    (select count(distinct cv.ngay) from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
      where cv.nhan_su_id = lc.nhan_su_id and cv.lop_id = lc.lop_id
        and lv.tinh_vao in ('tg', 'trong_thi'))::int as tg_lam
    from lop_cua lc join lop l on l.id = lc.lop_id
),
lop_bac as (
  select ls.*, coalesce(
      (select b.gia_tri from dg b
        where b.ma = 'bac_luong'
          and round(coalesce(ls.si_tb, 0))::int >= b.si_tu
          and (b.si_den is null or round(coalesce(ls.si_tb, 0))::int <= b.si_den)
        order by b.si_tu desc limit 1),
      (select min(gia_tri) from dg where ma = 'bac_luong')) as luong
    from lop_stat ls
),
chinh as (
  select distinct on (lb.nhan_su_id) lb.nhan_su_id, lb.lop_id as chinh_lop, lb.ten_lop as chinh_ten, lb.luong as chinh_luong
    from lop_bac lb
   -- lớp chính = lớp TA THỰC SỰ có công TG (bằng chứng), rồi mới tới cờ la_chinh trong phân công
   order by lb.nhan_su_id, lb.la_chu desc, (lb.tg_lam > 0) desc, lb.la_chinh desc, lb.luong desc, lb.ten_lop
),
lop_tien as (
  select lb.*, lb.tg_lam as tg_tinh,
         case when lb.so_buoi_lich <= 5 then c.btvn_4 else c.btvn_8 end as btvn_dm,
         c.w_tg, c.w_btvn
    from lop_bac lb, cfg c
),
lop_kq as (
  select lt.*,
         case when lt.so_buoi > 0 then lt.tg_tinh::numeric / lt.so_buoi else 0 end as ti_le_tg,
         case when lt.btvn_dm > 0 then lt.btvn_lam::numeric / lt.btvn_dm else 0 end as ti_le_btvn
    from lop_tien lt
),
lop_tong as (
  select lk.nhan_su_id,
         sum(round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn)))::numeric as tien,
         -- Lớp chủ chỉ vào chỉ tiêu bổ trợ khi TA CÓ HOẠT ĐỘNG ở lớp đó trong kỳ (có công TG hoặc đã chấm BTVN).
         -- Chặn phân công "treo" (phụ, chưa làm gì) làm tăng chỉ tiêu oan; sau này chấm công thay hẳn bước này.
         (count(*) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)))::int as n_chu,
         coalesce(sum(lk.luong) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)), 0)::numeric as sum_bac_chu,
         (count(*) filter (where lk.tg_lam > 0))::int as n_lop_tg,
         coalesce(sum(lk.luong) filter (where lk.tg_lam > 0), 0)::numeric as sum_bac_tg,
         coalesce(sum(lk.tg_lam) filter (where not lk.la_chu), 0)::int as tg_ho,
         jsonb_agg(jsonb_build_object(
           'lop', lk.ten_lop, 'la_chu', lk.la_chu, 'co_hoat_dong', (lk.tg_lam > 0 or lk.btvn_lam > 0), 'si_tb', round(lk.si_tb::numeric, 2), 'bac', lk.luong,
           'tg_lam', lk.tg_tinh, 'so_buoi', lk.so_buoi, 'ti_le_tg', round(lk.ti_le_tg, 4),
           'btvn_lam', lk.btvn_lam, 'btvn_dinh_muc', lk.btvn_dm, 'ti_le_btvn', round(lk.ti_le_btvn, 4),
           'tien', round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn))) order by lk.ten_lop) as ds
    from lop_kq lk group by lk.nhan_su_id
),
bo as (
  select cv.nhan_su_id,
         sum(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric as gio
    from cv_ok cv join ta_loai_viec lv on lv.ma = cv.loai_viec
   where lv.tinh_vao = 'bo_tro'
     and cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null
   group by cv.nhan_su_id
),
ngoai_dong as (
  select cv.nhan_su_id, lv.ma as loai, cv.ngay, l.ten_lop,
         case lv.don_vi when 'gio' then coalesce(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0, 0)
                        else 1 end as so_luong,
         (select gia_tri from dg where dg.ma = 'gia_' || lv.ma) as don_gia
    from cv_ok cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    left join lop l on l.id = cv.lop_id
   where lv.nhom = 'ngoai_package'
     -- trông thi lớp mình nằm trong công TG, không tính riêng
     and not (lv.tinh_vao = 'trong_thi' and exists (
            select 1 from lop_cua lc where lc.nhan_su_id = cv.nhan_su_id and lc.lop_id = cv.lop_id))
),
ngoai as (
  select nd.nhan_su_id,
         sum(round(nd.so_luong * coalesce(nd.don_gia, 0)))::numeric as tien,
         jsonb_agg(jsonb_build_object('loai', nd.loai, 'ngay', nd.ngay, 'lop', nd.ten_lop,
                   'so_luong', round(nd.so_luong::numeric, 2), 'don_gia', nd.don_gia,
                   'thieu_don_gia', nd.don_gia is null) order by nd.ngay) as ds
    from ngoai_dong nd group by nd.nhan_su_id
),
ket as (
  select s.nhan_su_id,
         coalesce(lt.tien, 0) as package_lop,
         coalesce(bo.gio, 0) as bo_tro_gio,
         -- Mỗi lớp có phần bổ trợ riêng (8 giờ, 40% bậc lớp ấy): chỉ tiêu = 8 × số lớp được phân công (không có thì
         -- theo lớp có TG); tiền = 0,4 × giờ ÷ chỉ tiêu × Σ bậc các lớp đó. Giờ dùng chung, không gắn lớp.
         case when n_bt.n = 0 then 0
              else round(c.w_bt * coalesce(bo.gio, 0) / nullif(c.chi_tieu * n_bt.n, 0) * n_bt.bac) end as bo_tro_tien,
         n_bt.n as n_lop_bt,
         n_bt.bac as bac_bt,
         coalesce(ng.tien, 0) as ngoai_package,
         coalesce((select g.tien_phat from gay_chot_thang g, k where g.ky = k.tu and g.nhan_su_id = s.nhan_su_id), 0) as tien_phat,
         lt.ds as ds_lop, ng.ds as ds_ngoai, ch.chinh_ten, ch.chinh_luong,
         coalesce(lt.tg_ho, 0) as day_thay, c.chi_tieu
    from ta_sel s
    left join lop_tong lt on lt.nhan_su_id = s.nhan_su_id
    left join chinh ch on ch.nhan_su_id = s.nhan_su_id
    left join bo on bo.nhan_su_id = s.nhan_su_id
    left join ngoai ng on ng.nhan_su_id = s.nhan_su_id, cfg c
    cross join lateral (
      select case when coalesce(lt.n_chu, 0) > 0 then lt.n_chu else coalesce(lt.n_lop_tg, 0) end as n,
             case when coalesce(lt.n_chu, 0) > 0 then lt.sum_bac_chu else coalesce(lt.sum_bac_tg, 0) end as bac) n_bt
)
select kt.nhan_su_id, n.ho_ten, kt.package_lop, round(kt.bo_tro_gio, 2), kt.bo_tro_tien, kt.ngoai_package,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package,
       kt.tien_phat,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package - kt.tien_phat,
       jsonb_build_object('lop', coalesce(kt.ds_lop, '[]'::jsonb),
                          'bo_tro', jsonb_build_object('gio', round(kt.bo_tro_gio, 2),
                                    'so_lop', kt.n_lop_bt, 'chi_tieu_moi_lop', kt.chi_tieu,
                                    'chi_tieu', kt.chi_tieu * kt.n_lop_bt,
                                    'ti_le', round(kt.bo_tro_gio / nullif(kt.chi_tieu * kt.n_lop_bt, 0), 4),
                                    'tong_bac', kt.bac_bt, 'lop_chinh', kt.chinh_ten, 'tien', kt.bo_tro_tien),
                          'ngoai_package', coalesce(kt.ds_ngoai, '[]'::jsonb),
                          'day_thay', kt.day_thay,
                          'tien_phat', kt.tien_phat)
  from ket kt join nhan_su n on n.id = kt.nhan_su_id
 where p_ns is not null or kt.package_lop + kt.bo_tro_tien + kt.ngoai_package + kt.tien_phat <> 0
 order by n.ho_ten
$$;

-- ── 6. Quyền chức năng: Core team (Thùy 14/10) ────────────────────────────────
insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select v.id, x.cn, false from vai_tro v cross join (values ('ta_cong_duyet'), ('ta_luong')) x(cn)
 where v.ten = 'Core team'
on conflict do nothing;

-- ── 7. Quyền thực thi: hàm nội bộ không cho client gọi thẳng ─────────────────
revoke execute on function _ta_pc_khoang(), _ta_tg_tai(date, uuid, uuid), _ta_duoc_khai_bu(date), _ta_moc_cham_cong(),
  _ta_luong_tinh(date, uuid) from public, anon, authenticated;
