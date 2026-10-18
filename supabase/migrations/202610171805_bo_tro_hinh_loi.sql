-- BỔ TRỢ HÌNH (Thùy 17/10): loại bổ trợ thứ 4, ĐỘC LẬP với bổ trợ yếu Đại.
-- Khác Đại: KHÔNG có bản đồ/kho ⇒ không dạng, không MCQ, không đo, không đề xuất máy. Case = HS × ĐỢT (+ lý do + mức L1–L3 + ưu tiên).
-- Vào case: Trang/Lộc tự mở (giai đoạn tạm). Tài liệu gắn theo BUỔI (kho tài liệu / builder). Cuối buổi chỉ NHẬN XÉT.
-- Dùng CHUNG với Yếu/Bù/Đuổi: ca trực (ca_bo_tro), đơn vị (L1 = 1, L2/L3 = 4), suất 3/TA theo bậc lớp, trần 70 em / 20 Cao (gộp Yếu + Hình).
-- Kết thúc như Đại: người dạy HOÀN TẤT ca ⇒ case kết thúc (day_xong) trừ khi tick "còn học tiếp"; Trang/Lộc cũng đóng tay được.

-- ============ 1. Bảng ============
create table public.bo_tro_hinh (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  lop_id uuid references public.lop(id),
  mon text not null default 'Toán',
  ly_do text not null,
  muc smallint not null,
  uu_tien smallint not null default 2,
  trang_thai text not null default 'dang_xu',
  actor uuid,
  created_at timestamptz not null default now(),
  hoan_thanh_at timestamptz,
  ket_qua text,
  dong_boi uuid references public.nhan_su(id),
  ghi_chu_dong text,
  case_truoc_id uuid references public.bo_tro_hinh(id),
  constraint bo_tro_hinh_ly_do_ck check (length(trim(ly_do)) > 0),
  constraint bo_tro_hinh_muc_ck check (muc in (1, 2, 3)),
  constraint bo_tro_hinh_uu_tien_ck check (uu_tien between 1 and 3),
  constraint bo_tro_hinh_trang_thai_ck check (trang_thai in ('dang_xu', 'hoan_thanh')),
  constraint bo_tro_hinh_ket_qua_ck check (ket_qua is null or ket_qua in ('on', 'can_them', 'bo', 'day_xong')),
  constraint bo_tro_hinh_dong_du_ck check (trang_thai <> 'hoan_thanh' or (ket_qua is not null and hoan_thanh_at is not null))
);
create unique index bo_tro_hinh_mot_case_mo on public.bo_tro_hinh (hoc_sinh_id, mon) where trang_thai = 'dang_xu';
create index bo_tro_hinh_hs on public.bo_tro_hinh (hoc_sinh_id);

create table public.bo_tro_hinh_log (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.bo_tro_hinh(id),
  at timestamptz not null default now(),
  actor uuid,
  su_kien text not null,
  cu jsonb,
  moi jsonb
);
create index bo_tro_hinh_log_case on public.bo_tro_hinh_log (case_id, at);

create table public.bo_tro_hinh_tai_lieu (
  id uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references public.buoi_hoc(id) on delete cascade,
  tai_lieu_id uuid not null references public.tai_lieu(id),
  thu_tu int not null default 0,
  ghi_chu text,
  created_at timestamptz not null default now(),
  created_by uuid,
  unique (buoi_hoc_id, tai_lieu_id)
);

alter table public.bo_tro_hinh enable row level security;
alter table public.bo_tro_hinh_log enable row level security;
alter table public.bo_tro_hinh_tai_lieu enable row level security;
create policy bo_tro_hinh_member_all on public.bo_tro_hinh for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy bo_tro_hinh_log_member_sel on public.bo_tro_hinh_log for select to authenticated using (public.la_thanh_vien());
create policy bo_tro_hinh_tai_lieu_member_all on public.bo_tro_hinh_tai_lieu for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ============ 2. Cột nối vào buổi ============
alter table public.buoi_hoc drop constraint buoi_hoc_loai_check;
alter table public.buoi_hoc add constraint buoi_hoc_loai_check
  check (loai = any (array['thuong', 'bu', 'bo_tro_yeu', 'bo_tro_duoi', 'mt', 'bo_tro_hinh']));
alter table public.buoi_hoc_hs add column bo_tro_hinh_id uuid references public.bo_tro_hinh(id);
create index buoi_hoc_hs_bo_tro_hinh on public.buoi_hoc_hs (bo_tro_hinh_id) where bo_tro_hinh_id is not null;

-- ============ 3. Trigger: ghi vết · trần dùng chung · 1 buổi chờ học ============
create or replace function public._trg_bthinh_log() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if tg_op = 'INSERT' then
    insert into bo_tro_hinh_log (case_id, actor, su_kien, moi)
      values (new.id, public.jwt_uid(), 'mo', jsonb_build_object('muc', new.muc, 'uu_tien', new.uu_tien, 'ly_do', new.ly_do));
  else
    if new.muc is distinct from old.muc then
      insert into bo_tro_hinh_log (case_id, actor, su_kien, cu, moi) values (new.id, public.jwt_uid(), 'doi_muc', to_jsonb(old.muc), to_jsonb(new.muc)); end if;
    if new.uu_tien is distinct from old.uu_tien then
      insert into bo_tro_hinh_log (case_id, actor, su_kien, cu, moi) values (new.id, public.jwt_uid(), 'doi_uu_tien', to_jsonb(old.uu_tien), to_jsonb(new.uu_tien)); end if;
    if new.trang_thai is distinct from old.trang_thai then
      insert into bo_tro_hinh_log (case_id, actor, su_kien, cu, moi) values (new.id, public.jwt_uid(), 'doi_trang_thai', to_jsonb(old.trang_thai),
        jsonb_build_object('trang_thai', new.trang_thai, 'ket_qua', new.ket_qua, 'ghi_chu', new.ghi_chu_dong)); end if;
  end if;
  return new;
end $$;
create trigger trg_bthinh_log after insert or update on public.bo_tro_hinh for each row execute function public._trg_bthinh_log();

-- Trần 70 em / 20 Cao GỘP Yếu + Hình (cùng advisory lock với Yếu để 2 người duyệt hai loại cùng lúc không lọt trần).
create or replace function public._trg_bthinh_suc_chua() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare v_n int;
begin
  if new.trang_thai <> 'dang_xu' then return new; end if;
  perform pg_advisory_xact_lock(hashtext('btyeu_suc_chua'));
  if tg_op = 'INSERT' or old.trang_thai <> 'dang_xu' then
    select (select count(*) from bo_tro_yeu where trang_thai = 'dang_xu') + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu' and id <> new.id) into v_n;
    if v_n >= public._btyeu_tran_dang() then
      raise exception 'Đã đủ %/% em đang bổ trợ (yếu + Hình) — muốn thêm em mới phải hạ L0 / huỷ 1 em cũ trước.', v_n, public._btyeu_tran_dang();
    end if;
  end if;
  if new.uu_tien = 3 and (tg_op = 'INSERT' or old.trang_thai <> 'dang_xu' or old.uu_tien is distinct from 3) then
    select (select count(*) from bo_tro_yeu where trang_thai = 'dang_xu' and uu_tien = 3) + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu' and uu_tien = 3 and id <> new.id) into v_n;
    if v_n >= public._btyeu_tran_cao() then
      raise exception 'Đã đủ %/% em ưu tiên Cao — hạ ưu tiên 1 em Cao khác trước.', v_n, public._btyeu_tran_cao();
    end if;
  end if;
  return new;
end $$;
create trigger trg_bthinh_suc_chua before insert or update on public.bo_tro_hinh for each row execute function public._trg_bthinh_suc_chua();

create or replace function public._trg_bthinh_mot_buoi_cho_hoc() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare v record;
begin
  if new.bo_tro_hinh_id is null then return new; end if;
  select b.ngay, b.gio_bat_dau into v
  from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
  where hh.bo_tro_hinh_id = new.bo_tro_hinh_id and hh.buoi_hoc_id <> new.buoi_hoc_id
    and b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
  limit 1;
  if found then
    raise exception 'Em đã có buổi bổ trợ Hình ĐÃ XẾP CHƯA HỌC (% %) — sửa hoặc huỷ buổi đó, không xếp buổi mới.',
      to_char(v.ngay, 'DD/MM'), coalesce(to_char(v.gio_bat_dau, 'HH24:MI'), '');
  end if;
  return new;
end $$;
create trigger trg_bthinh_mot_buoi_cho_hoc before insert on public.buoi_hoc_hs for each row execute function public._trg_bthinh_mot_buoi_cho_hoc();

-- ============ 4. Hàm dùng chung với Yếu/Bù/Đuổi (bản lấy từ DB đang chạy, thêm nhánh 'hinh') ============
CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_xep(p_ca uuid, p_loai text, p_hoc_sinh uuid, p_ref uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_buoi uuid; v_bhh uuid; v_dv smallint; v_nguoi uuid; v_lop uuid; v_ta uuid; v_bu_cho uuid; v_phut int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('duoi', 'bu', 'yeu', 'hinh') then raise exception 'Loại phải là duoi | bu | yeu | hinh.'; end if;
  select * into c from ca_bo_tro where id = p_ca for update;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  if c.trang_thai <> 'mo' then raise exception 'Ca đã huỷ.'; end if;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;
  if p_loai = 'duoi' and v_phut < 60 then raise exception 'Bổ trợ đuổi cần đủ 1 tiếng — ca này chỉ % phút.', v_phut; end if;
  v_dv := public._ca_bo_tro_don_vi(p_loai, p_hoc_sinh, c.mon);
  -- Thùy 24/09: Lộc chốt với PH RỒI mới điền ⇒ xếp = đã chốt ⇒ trừ đơn vị NGAY, chặn luôn lúc xếp (không còn bước "chờ PH / Xác nhận").
  select * into t from public._ca_bo_tro_tinh(p_ca);
  if t.don_vi_dung + v_dv > c.don_vi then raise exception 'Ca chỉ còn % đơn vị, em cần % — ca đã đủ đơn vị.', c.don_vi - t.don_vi_dung, v_dv; end if;

  -- lớp của em (để tìm TA lớp) + kiểm tra ref thuộc đúng em
  if p_loai = 'duoi' then
    select lop_id into v_lop from bo_tro_duoi where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'can_duoi';
    if not found then raise exception 'Đợt đuổi không hợp lệ.'; end if;
  elsif p_loai = 'bu' then
    select b.lop_id, b.id into v_lop, v_bu_cho from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_ref and hh.hoc_sinh_id = p_hoc_sinh;
    if not found then raise exception 'Lần nghỉ không hợp lệ.'; end if;
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.hoc_sinh_id = p_hoc_sinh and x.bu_cho_buoi_id = v_bu_cho and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
      then raise exception 'Lần nghỉ này đã có buổi bù còn hiệu lực.'; end if;
  elsif p_loai = 'yeu' then
    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  else
    if not exists (select 1 from bo_tro_hinh where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case Hình không hợp lệ.'; end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  end if;
  -- Thùy 09/10: suất theo TRỌNG SỐ LỚP (S 0.5 · A 0.75 · B/C 1), 3 suất/TA. Em đã có lượt trong ca này (vd 2 lần bù) không tính thêm.
  if not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where bb.ca_bo_tro_id = p_ca and bb.trang_thai <> 'huy'
                 and x.hoc_sinh_id = p_hoc_sinh and x.don_vi is not null and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
     and public._ca_bo_tro_suc_nguoi(p_ca) + public._bt_trong_so_lop(v_lop) > 3 * c.so_ta then
    raise exception 'Ca hết suất: còn % suất, em cần % (lớp bậc %).', 3 * c.so_ta - public._ca_bo_tro_suc_nguoi(p_ca), public._bt_trong_so_lop(v_lop),
      coalesce((select bac from lop where id = v_lop), '?');
  end if;
  -- người dạy mặc định (câu 6): yếu = người trực; bù/đuổi = TA lớp em nếu đang trực ca này, không thì người trực
  v_ta := case when v_lop is null then null else public._ta_cua_lop(v_lop) end;
  v_nguoi := case when p_loai not in ('yeu', 'hinh') and v_ta is not null and v_ta in (c.nhan_su_id, c.nhan_su_2_id) then v_ta else c.nhan_su_id end;

  if p_loai = 'bu' then
    select id into v_buoi from buoi_hoc where ca_bo_tro_id = p_ca and loai = 'bu' and trang_thai = 'mo' order by created_at limit 1;
  end if;
  if v_buoi is null then
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_id)
    values (case p_loai when 'duoi' then 'bo_tro_duoi' when 'bu' then 'bu' when 'hinh' then 'bo_tro_hinh' else 'bo_tro_yeu' end, null, c.ngay, public._thu_cua_ngay(c.ngay),
            c.gio_bat_dau, c.gio_ket_thuc, c.phong, v_nguoi, 'mo', public.jwt_uid(), p_ca)
    returning id into v_buoi;
  end if;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_duoi_id, bu_cho_buoi_id, bo_tro_yeu_id, bo_tro_hinh_id, don_vi, xac_nhan_ph_at, xac_nhan_boi)
  values (v_buoi, p_hoc_sinh, case when p_loai = 'duoi' then p_ref end, v_bu_cho, case when p_loai = 'yeu' then p_ref end, case when p_loai = 'hinh' then p_ref end, v_dv, now(), public.jwt_uid())
  returning id into v_bhh;
  return jsonb_build_object('buoi_hoc_id', v_buoi, 'bhh_id', v_bhh, 'don_vi', v_dv, 'nguoi_day_tg', v_nguoi);
end $function$
;

CREATE OR REPLACE FUNCTION public._ca_bo_tro_don_vi(p_loai text, p_hs uuid, p_mon text)
 RETURNS smallint
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_loai in ('duoi', 'bu') then 4
              when p_loai = 'hinh' then (case when coalesce((select h.muc from bo_tro_hinh h where h.hoc_sinh_id = p_hs and h.trang_thai = 'dang_xu' order by h.created_at desc limit 1), 1) <= 1 then 1 else 4 end)
              when coalesce((select l.level from hs_level l where l.hoc_sinh_id = p_hs and l.mon = p_mon and l.loai = 'kien_thuc'), 1) <= 1 then 1
              else 4 end::smallint
$function$
;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_ngay(p_ngay date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'lich_truc_id', c.lich_truc_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc,
    'phut', (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int,
    'mon', c.mon, 'khoi', c.khoi, 'phong', c.phong, 'so_ta', c.so_ta,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'nhan_su_2_id', c.nhan_su_2_id, 'nhan_su_2_ten', ns2.ho_ten,
    'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'so_hs_xn', t.so_hs_xn, 'so_hs_cho', t.so_hs_cho,
    'trang_thai', c.trang_thai, 'ly_do_huy', c.ly_do_huy, 'toi_da_hs', 3 * c.so_ta,
    'suc_nguoi', public._ca_bo_tro_suc_nguoi(c.id), -- Thùy 09/10: suất theo trọng số lớp (S 0.5 · A 0.75 · B/C 1)
    'day_nguoi', public._ca_bo_tro_suc_nguoi(c.id) >= 3 * c.so_ta, 'day_don_vi', t.don_vi_dung >= c.don_vi,
    'phong_so_ca', (select count(*) from ca_bo_tro x where x.trang_thai = 'mo' and x.ngay = c.ngay and x.phong = c.phong and x.phong is not null
                    and x.gio_bat_dau < c.gio_ket_thuc and x.gio_ket_thuc > c.gio_bat_dau),
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
             'bhh_id', hh.id, 'buoi_hoc_id', b.id, 'loai', case b.loai when 'bo_tro_duoi' then 'duoi' when 'bu' then 'bu' when 'bo_tro_hinh' then 'hinh' else 'yeu' end,
             'hoc_sinh_id', hh.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi,
             'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hh.hoc_sinh_id and l.mon = c.mon limit 1),
             'don_vi', hh.don_vi, 'xac_nhan_ph_at', hh.xac_nhan_ph_at, 'diem_danh', hh.diem_danh,
             'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_day_ten', nd.ho_ten,
             'chi_tiet', case b.loai
               when 'bu' then 'nghỉ ' || to_char((select m.ngay from buoi_hoc m where m.id = hh.bu_cho_buoi_id), 'DD/MM')
               when 'bo_tro_duoi' then 'đuổi · buổi ' || (select count(*) + 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = hh.bo_tro_duoi_id and bb.id <> b.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat')
                                          || coalesce('/' || (select d.so_buoi_du_kien from bo_tro_duoi d where d.id = hh.bo_tro_duoi_id), '')
               when 'bo_tro_hinh' then 'Hình L' || coalesce((select h.muc from bo_tro_hinh h where h.id = hh.bo_tro_hinh_id), 1)
                                       || ' · ưu tiên ' || case coalesce((select h.uu_tien from bo_tro_hinh h where h.id = hh.bo_tro_hinh_id), 2) when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end
                                       || ' · buổi ' || (select count(*) + 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_hinh_id = hh.bo_tro_hinh_id and bb.id <> b.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat')
               else 'yếu L' || coalesce((select l.level from hs_level l where l.hoc_sinh_id = hh.hoc_sinh_id and l.mon = c.mon and l.loai = 'kien_thuc'), 1)
                    -- Thùy 13/10: ghi rõ nghĩa — ca đã xong thì nói ca này dạy mấy dạng; "còn x/y" = case có y dạng, còn x dạng chưa dạy xong (số hiện tại)
                    || case when b.danh_gia_xong_at is not null
                            then ' · ca này dạy ' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.day_buoi_id = b.id) || ' dạng' else '' end
                    || ' · còn ' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false))
                    || '/' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id) || ' dạng cần dạy' end
           ) order by hh.xac_nhan_ph_at nulls last, hs.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
           left join nhan_su nd on nd.id = b.nguoi_day_tg
           where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy' and hh.don_vi is not null)
  ) order by c.gio_bat_dau, c.phong nulls last, c.khoi), '[]'::jsonb) end
  from ca_bo_tro c
  left join nhan_su ns on ns.id = c.nhan_su_id left join nhan_su ns2 on ns2.id = c.nhan_su_2_id
  cross join lateral public._ca_bo_tro_tinh(c.id) t
  where c.ngay = p_ngay
$function$
;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_ung_vien(p_ca uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_con int; v_cho_hs numeric; v_phut int; v_out jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select * into c from ca_bo_tro where id = p_ca;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  select * into t from public._ca_bo_tro_tinh(p_ca);
  v_con := c.don_vi - t.don_vi_dung;
  v_cho_hs := 3 * c.so_ta - public._ca_bo_tro_suc_nguoi(p_ca); -- Thùy 09/10: suất còn lại theo trọng số lớp
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;

  with
  duoi as (
    select d.id as ref_id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, d.created_at,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat') as da_hoc,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) as dang_cho,
           d.so_buoi_du_kien
    from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
    where d.trang_thai = 'can_duoi' and d.dang_duyet_at is not null and l.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.ngay = c.ngay)
  ),
  bu as (
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id join lop l on l.id = b.lop_id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
    where hh.diem_danh in ('vang', 'vang_phep') and b.loai = 'thuong' and b.trang_thai <> 'huy' and l.mon = c.mon and (c.khoi is null or l.khoi = c.khoi)
      and not exists (select 1 from bang_khong_bu k where k.buoi_hoc_hs_id = hh.id)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                      where x.hoc_sinh_id = hh.hoc_sinh_id and x.bu_cho_buoi_id = hh.buoi_hoc_id and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
  ),
  yeu as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id,
           coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 1) as level,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false)) as so_dang
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level >= 1) -- Thùy 28/09: L1/L2/L3 đều xếp; L0 = không bổ trợ
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  ),
  hinh as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at, y.muc, y.ly_do,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id
    from bo_tro_hinh y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_hinh_id = y.id and bb.loai = 'bo_tro_hinh' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  )
  select jsonb_build_object(
    'ca', jsonb_build_object('id', c.id, 'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'con', v_con, 'so_hs_xn', t.so_hs_xn, 'cho_hs', v_cho_hs, 'toi_da_hs', 3 * c.so_ta, 'phut', v_phut),
    'duoi', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'duoi', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', case when da_hoc = 0 then 'CHƯA đuổi buổi nào' else 'đã đuổi ' || da_hoc || coalesce('/' || so_buoi_du_kien, '') end || ' · vào ' || to_char(created_at, 'DD/MM') || ' (' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - created_at::date) || ' ngày)',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'da_xep_ngay_khac', dang_cho > 0,
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= 4 and v_cho_hs >= public._bt_trong_so_lop(lop_id) and v_phut >= 60, 'ly_do_khong_vua', case when v_phut < 60 then 'Đuổi cần ca ≥60''' when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by (da_hoc = 0) desc, created_at), '[]'::jsonb) from duoi where so_buoi_du_kien is null or da_hoc + dang_cho < so_buoi_du_kien),
    'bu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= 4 and v_cho_hs >= public._bt_trong_so_lop(lop_id), 'ly_do_khong_vua', case when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when level <= 1 then 1 else 4 end,
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (case when level <= 1 then 1 else 4 end) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (case when level <= 1 then 1 else 4 end) then 'cần ' || (case when level <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu),
    'hinh', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'hinh', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when muc <= 1 then 1 else 4 end,
        'chi_tiet', 'Hình L' || muc || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · mở ' || to_char(created_at, 'DD/MM') || coalesce(' · ' || left(ly_do, 60), ''),
        'uu_tien', uu_tien, 'level', muc,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (case when muc <= 1 then 1 else 4 end) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (case when muc <= 1 then 1 else 4 end) then 'cần ' || (case when muc <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from hinh)
  ) into v_out;
  return v_out;
end $function$
;

CREATE OR REPLACE FUNCTION public._trg_buoi_bo_tro_gan_ca()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_ca record;
begin
  if new.loai not in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh') or new.gio_bat_dau is null or new.nguoi_day_tg is null then return new; end if;
  if new.ngay is not distinct from old.ngay and new.gio_bat_dau is not distinct from old.gio_bat_dau
     and new.gio_ket_thuc is not distinct from old.gio_ket_thuc and new.nguoi_day_tg is not distinct from old.nguoi_day_tg then return new; end if;
  if new.ca_bo_tro_id is not null then
    select * into v_ca from ca_bo_tro where id = new.ca_bo_tro_id;
    if v_ca.ngay = new.ngay and v_ca.trang_thai = 'mo' and new.nguoi_day_tg in (v_ca.nhan_su_id, v_ca.nhan_su_2_id)
       and v_ca.gio_bat_dau < coalesce(new.gio_ket_thuc, new.gio_bat_dau + interval '1 hour') and v_ca.gio_ket_thuc > new.gio_bat_dau then
      return new; -- vẫn khớp ca cũ
    end if;
  end if;
  new.ca_bo_tro_id := public._ca_bo_tro_khop(new.ngay, new.gio_bat_dau, new.gio_ket_thuc, new.nguoi_day_tg);
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public._trg_buoi_bo_tro_khoa_ngay()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if old.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh')
     and (old.danh_gia_xong_at is not null or old.trang_thai = 'hoan_tat')
     and (new.ngay is distinct from old.ngay or new.gio_bat_dau is distinct from old.gio_bat_dau or new.gio_ket_thuc is distinct from old.gio_ket_thuc) then
    raise exception 'Buổi % % đã học xong (đóng ca) — không đổi ngày/giờ được. Muốn học tiếp thì XẾP BUỔI MỚI.',
      to_char(old.ngay, 'DD/MM'), coalesce(to_char(old.gio_bat_dau, 'HH24:MI'), '');
  end if;
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public._trg_btyeu_suc_chua()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_n int;
begin
  if new.trang_thai <> 'dang_xu' then return new; end if;
  perform pg_advisory_xact_lock(hashtext('btyeu_suc_chua')); -- 2 người duyệt cùng lúc không lọt quá trần
  if tg_op = 'INSERT' or old.trang_thai <> 'dang_xu' then
    select count(*) + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu') into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and id <> new.id;
    if v_n >= public._btyeu_tran_dang() then
      raise exception 'Đã đủ %/% em đang bổ trợ (yếu + Hình) — muốn thêm em mới phải hạ L0 / huỷ 1 em cũ trước.', v_n, public._btyeu_tran_dang();
    end if;
  end if;
  if new.uu_tien = 3 and (tg_op = 'INSERT' or old.trang_thai <> 'dang_xu' or old.uu_tien is distinct from 3) then
    select count(*) + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu' and uu_tien = 3) into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and uu_tien = 3 and id <> new.id;
    if v_n >= public._btyeu_tran_cao() then
      raise exception 'Đã đủ %/% em ưu tiên Cao — hạ ưu tiên 1 em Cao khác trước.', v_n, public._btyeu_tran_cao();
    end if;
  end if;
  return new;
end $function$
;

-- ============ 5. RPC bổ trợ Hình ============
-- Mở ca (Trang/Lộc tự mở — giai đoạn tạm, chưa có máy đề xuất/báo động). Vòng n+1 nối case_truoc_id. Trần 70/20 do trigger chặn.
create or replace function public.fn_bthinh_mo(p_hs uuid, p_muc int, p_uu_tien int, p_ly_do text, p_lop uuid default null)
returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v uuid; v_truoc uuid; v_ly text := nullif(trim(coalesce(p_ly_do, '')), '');
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_muc not in (1, 2, 3) then raise exception 'Mức phải là L1–L3.'; end if;
  if p_uu_tien not in (1, 2, 3) then raise exception 'Ưu tiên phải là 1–3.'; end if;
  if v_ly is null then raise exception 'Nhập lý do mở ca Hình (em yếu phần nào / vì sao cần bổ trợ).'; end if;
  if not exists (select 1 from hoc_sinh where id = p_hs) then raise exception 'Không thấy học sinh.'; end if;
  if exists (select 1 from bo_tro_hinh where hoc_sinh_id = p_hs and trang_thai = 'dang_xu') then raise exception 'Em đã có ca bổ trợ Hình đang mở.'; end if;
  select id into v_truoc from bo_tro_hinh where hoc_sinh_id = p_hs and trang_thai = 'hoan_thanh' order by hoan_thanh_at desc nulls last limit 1;
  insert into bo_tro_hinh (hoc_sinh_id, lop_id, ly_do, muc, uu_tien, actor, case_truoc_id)
    values (p_hs, p_lop, v_ly, p_muc, p_uu_tien, public.jwt_uid(), v_truoc) returning id into v;
  return v;
end $$;

-- Đổi mức / ưu tiên (đơn vị buổi đã xếp chưa học đổi theo mức: L1 = 1 · L2+ = 4).
create or replace function public.fn_bthinh_doi(p_case uuid, p_muc int default null, p_uu_tien int default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare y record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_muc is not null and p_muc not in (1, 2, 3) then raise exception 'Mức phải là L1–L3 (hạ hẳn thì ĐÓNG ca).'; end if;
  if p_uu_tien is not null and p_uu_tien not in (1, 2, 3) then raise exception 'Ưu tiên phải là 1–3.'; end if;
  select * into y from bo_tro_hinh where id = p_case for update;
  if y.id is null then raise exception 'Không thấy case.'; end if;
  if y.trang_thai <> 'dang_xu' then raise exception 'Case đã đóng.'; end if;
  update bo_tro_hinh set muc = coalesce(p_muc, muc), uu_tien = coalesce(p_uu_tien, uu_tien) where id = p_case;
  if p_muc is not null and p_muc is distinct from y.muc then
    update buoi_hoc_hs hh set don_vi = case when p_muc <= 1 then 1 else 4 end
      from buoi_hoc b where b.id = hh.buoi_hoc_id and hh.bo_tro_hinh_id = p_case and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.don_vi is not null;
  end if;
  return jsonb_build_object('muc', coalesce(p_muc, y.muc), 'uu_tien', coalesce(p_uu_tien, y.uu_tien));
end $$;

create or replace function public._bthinh_ket_thuc(p_case uuid, p_ns uuid, p_ket_qua text, p_ghi_chu text, p_at timestamptz)
returns void language plpgsql set search_path to 'public' as $$
begin
  update buoi_hoc b set trang_thai = 'huy', ly_do_huy = 'Kết thúc bổ trợ Hình' || coalesce(' — ' || p_ghi_chu, ''), updated_at = now()
    from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.bo_tro_hinh_id = p_case and b.loai = 'bo_tro_hinh'
      and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh is null;
  update bo_tro_hinh set trang_thai = 'hoan_thanh', hoan_thanh_at = p_at, ket_qua = p_ket_qua, dong_boi = p_ns, ghi_chu_dong = p_ghi_chu
    where id = p_case and trang_thai = 'dang_xu';
end $$;

-- Đóng tay (Trang/Lộc): ổn / cần thêm / bỏ. Ca đã điểm danh có mặt mà chưa đóng thì chặn — người dạy hoàn tất trước.
create or replace function public.fn_bthinh_dong(p_case uuid, p_ket_qua text, p_ghi_chu text default null)
returns void language plpgsql security definer set search_path to 'public' as $$
declare y record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ket_qua not in ('on', 'can_them', 'bo') then raise exception 'Kết quả phải là on | can_them | bo.'; end if;
  select * into y from bo_tro_hinh where id = p_case for update;
  if y.id is null then raise exception 'Không thấy case.'; end if;
  if y.trang_thai <> 'dang_xu' then return; end if;
  if exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
             where hh.bo_tro_hinh_id = p_case and b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat') then
    raise exception 'Em đang có ca đã điểm danh có mặt mà chưa đóng — người dạy hoàn tất ca đó trước.';
  end if;
  perform public._bthinh_ket_thuc(p_case, public._btyeu_my_ns(), p_ket_qua, nullif(trim(coalesce(p_ghi_chu, '')), ''), now());
end $$;

-- Danh sách cho màn ERP: 1 nguồn (tính ở DB). p_trang_thai = 'dang_xu' | 'hoan_thanh'.
create or replace function public.fn_bthinh_danh_sach(p_trang_thai text default 'dang_xu', p_limit int default 300)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_ds jsonb; v_tran jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select coalesce(jsonb_agg(x order by x.uu_tien desc, x.created_at), '[]'::jsonb) into v_ds from (
    select y.id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.muc, y.uu_tien, y.ly_do, y.created_at, y.trang_thai, y.ket_qua, y.ghi_chu_dong, y.hoan_thanh_at,
           y.case_truoc_id is not null as vong_tiep,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
             where hh.bo_tro_hinh_id = y.id and b.trang_thai <> 'huy' and b.danh_gia_xong_at is not null and hh.diem_danh = 'co_mat') as so_buoi_da_hoc,
           (select jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
                     'nguoi_day_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
                     'so_tai_lieu', (select count(*) from bo_tro_hinh_tai_lieu t where t.buoi_hoc_id = b.id))
              from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
             where hh.bo_tro_hinh_id = y.id and b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
             order by b.ngay limit 1) as buoi_cho,
           case when y.trang_thai = 'hoan_thanh' then 'hoan_thanh'
                when exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                              where hh.bo_tro_hinh_id = y.id and b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null) then 'da_xep'
                else 'can_xep' end as giai_doan
    from bo_tro_hinh y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = coalesce(p_trang_thai, 'dang_xu')
    order by y.uu_tien desc, y.created_at limit least(coalesce(p_limit, 300), 1000)
  ) x;
  select jsonb_build_object(
    'dang', (select count(*) from bo_tro_yeu where trang_thai = 'dang_xu') + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu'),
    'dang_hinh', (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu'),
    'cao', (select count(*) from bo_tro_yeu where trang_thai = 'dang_xu' and uu_tien = 3) + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu' and uu_tien = 3),
    'tran_dang', public._btyeu_tran_dang(), 'tran_cao', public._btyeu_tran_cao()) into v_tran;
  return jsonb_build_object('ds', v_ds, 'tran', v_tran);
end $$;

-- Lịch sử 1 case (dòng thời gian).
create or replace function public.fn_bthinh_lich_su(p_case uuid)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object('at', l.at, 'su_kien', l.su_kien, 'cu', l.cu, 'moi', l.moi,
         'ai', (select n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where t.id = l.actor)) order by l.at), '[]'::jsonb) end
  from bo_tro_hinh_log l where l.case_id = p_case
$$;

-- Tài liệu của buổi: GV gắn trước buổi (kho tài liệu / tài liệu builder tự chọn bài). Thay trọn bộ theo thứ tự truyền vào.
create or replace function public.fn_bthinh_gan_tai_lieu(p_buoi uuid, p_tai_lieu uuid[])
returns int language plpgsql security definer set search_path to 'public' as $$
declare b record; n int := 0; i int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from buoi_hoc where id = p_buoi;
  if b.id is null or b.loai <> 'bo_tro_hinh' then raise exception 'Không phải buổi bổ trợ Hình.'; end if;
  if b.danh_gia_xong_at is not null then raise exception 'Buổi đã đóng ca — không đổi tài liệu được.'; end if;
  delete from bo_tro_hinh_tai_lieu where buoi_hoc_id = p_buoi and not (tai_lieu_id = any(coalesce(p_tai_lieu, '{}')));
  for i in 1 .. coalesce(array_length(p_tai_lieu, 1), 0) loop
    insert into bo_tro_hinh_tai_lieu (buoi_hoc_id, tai_lieu_id, thu_tu, created_by) values (p_buoi, p_tai_lieu[i], i, public.jwt_uid())
      on conflict (buoi_hoc_id, tai_lieu_id) do update set thu_tu = excluded.thu_tu;
    n := n + 1;
  end loop;
  return n;
end $$;

-- Buổi + tài liệu cho app TA / ERP.
create or replace function public._bthinh_tai_lieu_json(p_buoi uuid) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'ten', t.ten, 'loai', t.loai, 'khoi', t.khoi, 'file_url', t.file_url, 'ghi_chu', x.ghi_chu) order by x.thu_tu), '[]'::jsonb)
  from bo_tro_hinh_tai_lieu x join tai_lieu t on t.id = x.tai_lieu_id where x.buoi_hoc_id = p_buoi
$$;

-- Việc của TA: ca Hình mình đứng (admin: mọi ca). Cùng khuôn fn_btyeu_viec_cua_toi: nợ cũ + hôm nay + 7 ngày tới.
create or replace function public.fn_bthinh_viec_cua_toi() returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_ca jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen(); v_admin := coalesce(v_admin, false);
  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_ca from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong, h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, h.khoi,
           y.id as case_id, y.muc as level, y.uu_tien, y.ly_do, hh.diem_danh, b.danh_gia_xong_at,
           (select d.nhan_xet from buoi_danh_gia d where d.buoi_hoc_id = b.id and d.hoc_sinh_id = h.id) as nhan_xet,
           public._bthinh_tai_lieu_json(b.id) as tai_lieu
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_hinh_id is not null
    join bo_tro_hinh y on y.id = hh.bo_tro_hinh_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    where b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and (v_admin or b.nguoi_day_tg = v_ns)
      and b.ngay <= v_today + 7 and (b.danh_gia_xong_at is null or b.ngay = v_today)
  ) x;
  return jsonb_build_object('ca', v_ca);
end $$;

-- Hoàn tất ca (người đứng ca hoặc admin): bắt buộc em CÓ MẶT + nhận xét. Không đánh giá, không test (chưa có bản đồ kiến thức).
-- Như Đại: hoàn tất ⇒ case KẾT THÚC (day_xong), trừ khi p_con_tiep = true (còn học tiếp ⇒ Lịch phòng xếp buổi kế).
create or replace function public.fn_bthinh_hoan_tat(p_buoi uuid, p_nhan_xet text, p_con_tiep boolean default false)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare b record; hh record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_nx text := nullif(trim(coalesce(p_nhan_xet, '')), ''); v_kt boolean := false;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from buoi_hoc where id = p_buoi and loai = 'bo_tro_hinh';
  if b.id is null then raise exception 'Không phải buổi bổ trợ Hình.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return jsonb_build_object('da_xong', true); end if; -- idempotent
  select * into hh from buoi_hoc_hs where buoi_hoc_id = p_buoi and bo_tro_hinh_id is not null limit 1;
  if hh.id is null then raise exception 'Buổi chưa có em nào.'; end if;
  if hh.diem_danh is distinct from 'co_mat' then raise exception 'Em chưa được điểm danh CÓ MẶT.'; end if;
  if v_nx is null then raise exception 'Nhập nhận xét cuối buổi.'; end if;
  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, graded_by, updated_at) values (p_buoi, hh.hoc_sinh_id, v_nx, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  if not coalesce(p_con_tiep, false) then
    perform public._bthinh_ket_thuc(hh.bo_tro_hinh_id, v_ns, 'day_xong', 'Người dạy hoàn tất ca ' || to_char(b.ngay, 'DD/MM'), now());
    v_kt := true;
  end if;
  return jsonb_build_object('da_xong', true, 'ket_thuc_case', v_kt);
end $$;

revoke execute on function public.fn_bthinh_mo(uuid, int, int, text, uuid), public.fn_bthinh_doi(uuid, int, int), public.fn_bthinh_dong(uuid, text, text),
  public.fn_bthinh_danh_sach(text, int), public.fn_bthinh_lich_su(uuid), public.fn_bthinh_gan_tai_lieu(uuid, uuid[]), public._bthinh_tai_lieu_json(uuid),
  public.fn_bthinh_viec_cua_toi(), public.fn_bthinh_hoan_tat(uuid, text, boolean), public._bthinh_ket_thuc(uuid, uuid, text, text, timestamptz) from public, anon;
grant execute on function public.fn_bthinh_mo(uuid, int, int, text, uuid), public.fn_bthinh_doi(uuid, int, int), public.fn_bthinh_dong(uuid, text, text),
  public.fn_bthinh_danh_sach(text, int), public.fn_bthinh_lich_su(uuid), public.fn_bthinh_gan_tai_lieu(uuid, uuid[]),
  public.fn_bthinh_viec_cua_toi(), public.fn_bthinh_hoan_tat(uuid, text, boolean) to authenticated;
