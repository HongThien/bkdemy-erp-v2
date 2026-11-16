-- ============================================================================
-- 202611161716 — giao_trinh_tuan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 duyệt `spec-giao-trinh-tuan.md`. Thứ Sáu họp, trưởng khối điền cho TỪNG CA trong thời khoá biểu của tuần sau: ca đó học
--   nhóm / dạng nào (chỉ khung), trưởng bộ môn duyệt. Trước giờ việc này nằm trên Google Sheet; trên hệ buổi giáo trình chỉ được gán cho
--   lớp đúng ngày dạy (30 ngày: 225/261 lượt gán tạo đúng ngày) ⇒ trước ngày dạy hệ không biết tuần tới học dạng gì.
--   Thiết kế (spec §2): khung chỉ lưu MỘT chỗ — dưới nút buổi trong builder (tai_lieu_phan). Bảng mới chỉ giữ LIÊN KẾT 1-1
--   ca (lop_id, ngay) ⇄ buổi builder ⇒ sửa ở màn tuần hay ở builder là sửa cùng dòng, không có bản sao để lệch.
--   Ghi khung = gọi lại đúng hàm builder fn_tl_bdm_dat_buoi (không viết bộ ghi thứ hai). Builder Hình (loai_phan 'dang') làm ở bước 3.
--   Ca = suy từ thoi_khoa_bieu + buoi_hoc thường (cùng luật phần 1–2 của fn_phong_lich, nhưng chỉ cho các lớp được hỏi — K2).
--   Duyệt = sổ chỉ thêm gtt_duyet; lúc duyệt chụp khung mọi ca (bản bất biến để so "sửa sau duyệt" / "dạy đúng giáo trình đã chốt").
--   Quyền: ghi CHỈ qua hàm security definer có cổng đầu thân (_trong_pham_vi = trưởng khối trở lên; duyệt = trưởng bộ môn / QLCL toàn hệ).
--   Hạn giữ (K17): gtt_ca_log · gtt_duyet ~ vài nghìn dòng/năm, giữ vĩnh viễn (dữ liệu gốc).
--   Chạy giờ có lớp: chỉ tạo bảng mới + hàm + 1 index trên tai_lieu (~5.600 dòng); lock_timeout 3 s để không xếp hàng sau giao dịch dài.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá, không drop, không đổi hàm cũ.
-- ============================================================================

set local lock_timeout = '3s';

-- ---------------------------------------------------------------------------
-- 1. Bảng
-- ---------------------------------------------------------------------------
create table gtt_ca (
  lop_id  uuid not null references lop(id),
  ngay    date not null,
  buoi_id uuid not null unique references tai_lieu_phan(id) on delete cascade,
  mon     text not null,
  sua_boi uuid references nhan_su(id),
  sua_at  timestamptz not null default now(),
  primary key (lop_id, ngay)
);
comment on table gtt_ca is 'Giáo trình tuần: liên kết 1-1 ca học (lớp, ngày) ⇄ nút buổi trong builder giáo trình của lớp. Khung dạng nằm trong builder, không ở đây. spec-giao-trinh-tuan.md';
create index gtt_ca_sua_boi_idx on gtt_ca (sua_boi);

create table gtt_ca_log (
  id         bigint generated always as identity primary key,
  lop_id     uuid not null,
  ngay       date not null,
  buoi_cu    uuid,
  buoi_moi   uuid,
  nhan_su_id uuid,
  at         timestamptz not null default now()
);
comment on table gtt_ca_log is 'Vết đổi liên kết ca ⇄ buổi (trigger ghi, app không ghi). Giữ vĩnh viễn.';
create index gtt_ca_log_ca_idx on gtt_ca_log (lop_id, ngay, at desc);

create table gtt_duyet (
  id         uuid primary key default gen_random_uuid(),
  so         bigint generated always as identity unique,   -- thứ tự ghi (nhiều dòng cùng một now() trong một giao dịch)
  mon        text not null,
  khoi       text not null,
  tuan       date not null check (extract(isodow from tuan) = 1),
  hanh_dong  text not null check (hanh_dong in ('gui', 'duyet', 'tra_lai')),
  ghi_chu    text,
  khung      jsonb,
  nhan_su_id uuid references nhan_su(id),
  at         timestamptz not null default now(),
  check ((hanh_dong = 'duyet') = (khung is not null))
);
comment on table gtt_duyet is 'Sổ gửi / duyệt / trả lại giáo trình tuần theo (môn × khối × tuần), chỉ thêm; trạng thái = dòng mới nhất. khung = bản chụp lúc duyệt.';
create index gtt_duyet_tuan_idx on gtt_duyet (mon, khoi, tuan, so desc);
create index gtt_duyet_nhan_su_idx on gtt_duyet (nhan_su_id);

create index if not exists tai_lieu_gt_lop_idx on tai_lieu (lop_id) where loai = 'giao_trinh';

alter table gtt_ca enable row level security;
alter table gtt_ca_log enable row level security;
alter table gtt_duyet enable row level security;
create policy gtt_ca_doc on gtt_ca for select to authenticated using ((select public.la_thanh_vien()));
create policy gtt_ca_log_doc on gtt_ca_log for select to authenticated using ((select public.la_thanh_vien()));
create policy gtt_duyet_doc on gtt_duyet for select to authenticated using ((select public.la_thanh_vien()));
-- Không có policy ghi: mọi lượt ghi đi qua fn_gtt_* (security definer, có cổng).

-- ---------------------------------------------------------------------------
-- 2. Trigger: buổi phải là nút 'buoi' của giáo trình CỦA ĐÚNG LỚP; nhãn môn lấy từ lớp; ghi vết.
-- ---------------------------------------------------------------------------
create or replace function _gtt_ca_kiem() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_mon text;
begin
  select l.mon into v_mon from lop l where l.id = new.lop_id;
  if v_mon is null then raise exception 'Không thấy lớp.' using errcode = 'P0001'; end if;
  if not exists (
    select 1 from tai_lieu_phan p join tai_lieu t on t.id = p.tai_lieu_id
     where p.id = new.buoi_id and p.loai_phan = 'buoi'
       and t.loai = 'giao_trinh' and t.lop_id = new.lop_id and t.mon = v_mon) then
    raise exception 'Buổi này không thuộc giáo trình của lớp.' using errcode = 'P0001';
  end if;
  new.mon := v_mon;
  new.sua_boi := public.current_nhan_su_id();
  new.sua_at := now();
  return new;
end $$;

create trigger gtt_ca_kiem_trg before insert or update on gtt_ca
  for each row execute function _gtt_ca_kiem();

create or replace function _gtt_ca_ghi_vet() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into gtt_ca_log (lop_id, ngay, buoi_cu, buoi_moi, nhan_su_id) values (old.lop_id, old.ngay, old.buoi_id, null, public.current_nhan_su_id());
    return old;
  elsif tg_op = 'INSERT' then
    insert into gtt_ca_log (lop_id, ngay, buoi_cu, buoi_moi, nhan_su_id) values (new.lop_id, new.ngay, null, new.buoi_id, public.current_nhan_su_id());
  elsif new.buoi_id is distinct from old.buoi_id then
    insert into gtt_ca_log (lop_id, ngay, buoi_cu, buoi_moi, nhan_su_id) values (new.lop_id, new.ngay, old.buoi_id, new.buoi_id, public.current_nhan_su_id());
  end if;
  return new;
end $$;

create trigger gtt_ca_ghi_vet_trg after insert or update or delete on gtt_ca
  for each row execute function _gtt_ca_ghi_vet();

-- ---------------------------------------------------------------------------
-- 3. Hàm nội bộ (tiền tố _, không cấp cho client)
-- ---------------------------------------------------------------------------

-- Ca thường của các lớp trong khoảng ngày: buổi thường đã mở (kể cả huỷ, đánh dấu) + TKB chiếu lên ngày chưa có buổi.
create or replace function _gtt_ca(p_lops uuid[], p_tu date, p_den date)
returns table (lop_id uuid, ngay date, gio_bat_dau time, gio_ket_thuc time, phong text, buoi_hoc_id uuid, huy boolean)
language sql stable security definer set search_path = public as $$
  select distinct on (x.lop_id, x.ngay) x.*
  from (
    select b.lop_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, nullif(trim(b.phong), ''), b.id, b.trang_thai = 'huy'
      from buoi_hoc b
     where b.lop_id = any (p_lops) and b.ngay between p_tu and p_den and b.loai = 'thuong'
    union all
    select t.lop_id, d.ngay, t.gio_bat_dau, t.gio_ket_thuc, nullif(trim(t.phong), ''), null::uuid, false
      from (select g::date as ngay, public._thu_cua_ngay(g::date) as thu from generate_series(p_tu, p_den, interval '1 day') g) d
      join thoi_khoa_bieu t on t.thu = d.thu and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
     where t.lop_id = any (p_lops)
       and not exists (select 1 from buoi_hoc b where b.lop_id = t.lop_id and b.ngay = d.ngay and b.loai = 'thuong')
  ) x (lop_id, ngay, gio_bat_dau, gio_ket_thuc, phong, buoi_hoc_id, huy)
  order by x.lop_id, x.ngay, x.huy, x.buoi_hoc_id nulls last
$$;

-- Khung của một buổi để HIỂN THỊ: Đại/HGT/KHTN = nhóm › dạng bài; Hình = dạng (khuôn mô hình–bài–ý).
create or replace function _gtt_khung(p_buoi uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x.j order by x.tt, x.id), '[]'::jsonb) from (
    select p.thu_tu as tt, p.id, jsonb_build_object('ma', p.ref_ma, 'loai', 'nhom', 'ten', n.ten,
             'con', coalesce((select jsonb_agg(jsonb_build_object('ma', c.ref_ma, 'ten', db.ten) order by c.thu_tu, c.id)
                                from tai_lieu_phan c left join tl_bdm_dang_bai_v db on db.id = c.ref_ma
                               where c.cha_id = p.id and c.loai_phan = 'dang_bai'), '[]'::jsonb)) as j
      from tai_lieu_phan p left join tl_bdm_nhom_v n on n.id = p.ref_ma
     where p.cha_id = p_buoi and p.loai_phan = 'nhom'
    union all
    select p.thu_tu, p.id, jsonb_build_object('ma', p.ref_ma, 'loai', 'dang', 'ten',
             (select h.ten_dang from hinh_hoc_ban_do h where h.ma_dang = p.ref_ma limit 1), 'con', '[]'::jsonb)
      from tai_lieu_phan p
     where p.cha_id = p_buoi and p.loai_phan = 'dang'
  ) x
$$;

-- Khoá so sánh của khung (tập đã sắp) — dùng cho bản chụp lúc duyệt và cờ "sửa sau duyệt".
create or replace function _gtt_khung_khoa(p_buoi uuid) returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(k order by k), '{}') from (
    select 'n:' || p.ref_ma as k from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'nhom'
    union
    select 'n:' || p.ref_ma || '/' || c.ref_ma from tai_lieu_phan p join tai_lieu_phan c on c.cha_id = p.id and c.loai_phan = 'dang_bai'
     where p.cha_id = p_buoi and p.loai_phan = 'nhom'
    union
    select 'd:' || p.ref_ma from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'dang'
  ) x
$$;

-- Dòng mới nhất của sổ duyệt.
create or replace function _gtt_trang_thai(p_mon text, p_khoi text, p_tuan date) returns gtt_duyet
language sql stable security definer set search_path = public as $$
  select d.* from gtt_duyet d where d.mon = p_mon and d.khoi = p_khoi and d.tuan = p_tuan order by d.so desc limit 1
$$;

-- Bản chụp lúc duyệt gần nhất (null nếu dòng mới nhất không phải duyệt).
create or replace function _gtt_snap_duyet(p_mon text, p_khoi text, p_tuan date) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when s.hanh_dong = 'duyet' then s.khung end from public._gtt_trang_thai(p_mon, p_khoi, p_tuan) s
$$;

-- Một ca (đúng hình màn cần). p_snap = bản chụp duyệt (null ⇒ không xét "sửa sau duyệt").
create or replace function _gtt_ca_json(p_lop uuid, p_ngay date, p_snap jsonb) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'lop_id', c.lop_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong, 'huy', c.huy,
    'buoi', case when g.buoi_id is null then null else jsonb_build_object(
        'id', p.id, 'tai_lieu_id', t.id, 'ten_gt', t.ten, 'nhanh', t.nhanh, 'luu_tru', t.luu_tru_tu is not null,
        'tieu_de', p.tieu_de,
        'stt', (select count(*) from tai_lieu_phan x where x.tai_lieu_id = p.tai_lieu_id and x.loai_phan = 'buoi'
                  and (x.thu_tu < p.thu_tu or (x.thu_tu = p.thu_tu and x.id <= p.id))),
        'khung', public._gtt_khung(p.id)) end,
    'da_gan', (select jsonb_build_object('tai_lieu_id', b.id, 'khop', b.nguon_buoi = g.buoi_id::text)
                 from tai_lieu b where b.lop_id = c.lop_id and b.ngay = c.ngay and b.loai = 'giao_trinh_buoi' limit 1),
    'sua_sau_duyet', case when p_snap is null then false else
        (p_snap -> (c.lop_id::text || '|' || c.ngay::text)) is distinct from
        case when g.buoi_id is null then null
             else jsonb_build_object('buoi', g.buoi_id, 'k', to_jsonb(public._gtt_khung_khoa(g.buoi_id))) end end)
  from public._gtt_ca(array[p_lop], p_ngay, p_ngay) c
  left join gtt_ca g on g.lop_id = c.lop_id and g.ngay = c.ngay
  left join tai_lieu_phan p on p.id = g.buoi_id
  left join tai_lieu t on t.id = p.tai_lieu_id
$$;

-- Bản chụp khung của mọi ca đã gắn trong (môn × khối × tuần).
create or replace function _gtt_snap(p_mon text, p_khoi text, p_tuan date) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(g.lop_id::text || '|' || g.ngay::text,
           jsonb_build_object('buoi', g.buoi_id, 'k', to_jsonb(public._gtt_khung_khoa(g.buoi_id)))), '{}'::jsonb)
    from gtt_ca g join lop l on l.id = g.lop_id
   where l.mon = p_mon and l.khoi = p_khoi and g.ngay between p_tuan and p_tuan + 6
$$;

-- Cổng duyệt: trưởng bộ môn của môn hoặc QLCL toàn hệ.
create or replace function _gtt_la_tbm(p_mon text) returns boolean
language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he() or p_mon = any (coalesce(public._quan_ly_mon(), '{}'))
$$;

-- Ca hợp lệ để sửa: tồn tại trong TKB / buổi thường, không huỷ, chưa qua; người gọi có phạm vi. Trả lớp.
create or replace function _gtt_kiem_ca(p_lop uuid, p_ngay date) returns lop
language plpgsql stable security definer set search_path = public as $$
declare l lop;
begin
  select * into l from lop where id = p_lop;
  if l.id is null then raise exception 'Không thấy lớp.' using errcode = 'P0001'; end if;
  if not public._trong_pham_vi(l.mon, l.khoi) then
    raise exception 'Lớp % ngoài phạm vi của bạn.', l.ten_lop using errcode = '42501';
  end if;
  if p_ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date then
    raise exception 'Ca ngày % đã qua.', to_char(p_ngay, 'DD/MM') using errcode = 'P0001';
  end if;
  if not exists (select 1 from public._gtt_ca(array[p_lop], p_ngay, p_ngay) c where not c.huy) then
    raise exception 'Lớp % không có ca ngày % (theo thời khoá biểu) hoặc ca đã huỷ.', l.ten_lop, to_char(p_ngay, 'DD/MM') using errcode = 'P0001';
  end if;
  return l;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Hàm màn gọi
-- ---------------------------------------------------------------------------

-- MỘT lượt gọi cho cả lưới (môn × khối × tuần). Chi phí theo một khối (K2).
create or replace function fn_gtt_man_tuan(p_mon text, p_khoi text, p_tuan date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_lops uuid[]; v_snap jsonb; v_tt gtt_duyet;
begin
  if not public._trong_pham_vi(p_mon, p_khoi) then
    raise exception 'Môn % khối % ngoài phạm vi của bạn.', p_mon, p_khoi using errcode = '42501';
  end if;
  if extract(isodow from p_tuan) <> 1 then raise exception 'Tuần phải bắt đầu bằng thứ Hai.' using errcode = 'P0001'; end if;

  v_lops := array(select l.id from lop l where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc');
  v_tt := public._gtt_trang_thai(p_mon, p_khoi, p_tuan);
  v_snap := case when v_tt.hanh_dong = 'duyet' then v_tt.khung end;

  return jsonb_build_object(
    'mon', p_mon, 'khoi', p_khoi, 'tuan', p_tuan, 'den', p_tuan + 6,
    'sua', true, 'duyet', public._gtt_la_tbm(p_mon),
    'trang_thai', case when v_tt.id is null then null else jsonb_build_object(
        'hanh_dong', v_tt.hanh_dong, 'at', v_tt.at, 'ghi_chu', v_tt.ghi_chu,
        'ho_ten', (select n.ho_ten from nhan_su n where n.id = v_tt.nhan_su_id)) end,
    'lich_su', coalesce((select jsonb_agg(jsonb_build_object('hanh_dong', d.hanh_dong, 'at', d.at, 'ghi_chu', d.ghi_chu, 'ho_ten', n.ho_ten) order by d.so desc)
                           from (select * from gtt_duyet d where d.mon = p_mon and d.khoi = p_khoi and d.tuan = p_tuan order by d.so desc limit 10) d
                           left join nhan_su n on n.id = d.nhan_su_id), '[]'::jsonb),
    'lop', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', l.id, 'ten_lop', l.ten_lop,
               'giao_trinh', coalesce((select jsonb_agg(jsonb_build_object('id', t.id, 'ten', t.ten, 'nhanh', t.nhanh) order by t.updated_at desc)
                                         from tai_lieu t where t.lop_id = l.id and t.loai = 'giao_trinh' and t.ban_do = 'moi'
                                          and t.luu_tru_tu is null and t.mon = l.mon), '[]'::jsonb),
               'ca', coalesce((select jsonb_agg(public._gtt_ca_json(c.lop_id, c.ngay, v_snap) order by c.ngay)
                                 from public._gtt_ca(array[l.id], p_tuan, p_tuan + 6) c), '[]'::jsonb))
             order by l.ten_lop)
        from lop l where l.id = any (v_lops)), '[]'::jsonb),
    -- liên kết của ca không còn trong TKB (đổi lịch) — không tự xoá, màn nêu cờ
    'mo_coi', coalesce((
      select jsonb_agg(jsonb_build_object('lop_id', g.lop_id, 'ngay', g.ngay, 'buoi_id', g.buoi_id) order by g.ngay)
        from gtt_ca g
       where g.lop_id = any (v_lops) and g.ngay between p_tuan and p_tuan + 6
         and not exists (select 1 from public._gtt_ca(array[g.lop_id], g.ngay, g.ngay) c)), '[]'::jsonb));
end $$;

-- Gắn ca với một buổi CÓ SẴN của giáo trình lớp; p_buoi null ⇒ bỏ gắn. Trả ca (vá tại chỗ).
create or replace function fn_gtt_chon_buoi(p_lop uuid, p_ngay date, p_buoi uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l lop; v_khac date;
begin
  l := public._gtt_kiem_ca(p_lop, p_ngay);
  if p_buoi is null then
    delete from gtt_ca where lop_id = p_lop and ngay = p_ngay;
  else
    select g.ngay into v_khac from gtt_ca g where g.buoi_id = p_buoi and not (g.lop_id = p_lop and g.ngay = p_ngay);
    if v_khac is not null then
      raise exception 'Buổi này đã gắn với ca ngày % — bỏ gắn ở ca đó trước.', to_char(v_khac, 'DD/MM') using errcode = 'P0001';
    end if;
    insert into gtt_ca (lop_id, ngay, buoi_id, mon) values (p_lop, p_ngay, p_buoi, l.mon)
    on conflict (lop_id, ngay) do update set buoi_id = excluded.buoi_id;
  end if;
  return public._gtt_ca_json(p_lop, p_ngay, public._gtt_snap_duyet(l.mon, l.khoi, p_ngay - (extract(isodow from p_ngay)::int - 1)));
end $$;

-- Đặt khung (nhóm / dạng bài) cho ca. Ca chưa gắn buổi ⇒ tạo buổi mới cuối giáo trình p_tai_lieu rồi gắn, cùng giao dịch.
-- Ghi khung bằng đúng hàm builder fn_tl_bdm_dat_buoi (cùng luật kiểm nhóm/dạng, cùng gợi ý câu như khi GV chọn trong builder).
create or replace function fn_gtt_dat_khung(p_lop uuid, p_ngay date, p_chon jsonb, p_tai_lieu uuid default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l lop; v_buoi uuid; v_tl uuid; v_nhanh text; v_n int; v_tt int;
begin
  l := public._gtt_kiem_ca(p_lop, p_ngay);
  select g.buoi_id, p.tai_lieu_id into v_buoi, v_tl
    from gtt_ca g join tai_lieu_phan p on p.id = g.buoi_id where g.lop_id = p_lop and g.ngay = p_ngay;

  if v_buoi is null then
    if p_tai_lieu is null then raise exception 'Ca chưa gắn buổi — chọn giáo trình để thêm buổi mới.' using errcode = 'P0001'; end if;
    perform 1 from tai_lieu t where t.id = p_tai_lieu and t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.luu_tru_tu is null
                                and t.lop_id = p_lop and t.mon = l.mon for update;
    if not found then raise exception 'Giáo trình này không phải giáo trình của lớp.' using errcode = 'P0001'; end if;
    v_tl := p_tai_lieu;
  end if;

  select t.nhanh into v_nhanh from tai_lieu t where t.id = v_tl;
  if v_nhanh = 'hinh' then
    raise exception 'Khung giáo trình Hình chưa sửa được ở màn này — mở builder Hình.' using errcode = 'P0001';
  end if;

  if v_buoi is null then
    select count(*) filter (where p.loai_phan = 'buoi'), coalesce(max(p.thu_tu), -1) + 1 into v_n, v_tt
      from tai_lieu_phan p where p.tai_lieu_id = v_tl;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values (v_tl, v_tt, 'buoi', 'Buổi ' || (v_n + 1))
    returning id into v_buoi;
    insert into gtt_ca (lop_id, ngay, buoi_id, mon) values (p_lop, p_ngay, v_buoi, l.mon);
  end if;

  perform public.fn_tl_bdm_dat_buoi(v_tl, v_buoi, coalesce(p_chon, '[]'::jsonb));
  return public._gtt_ca_json(p_lop, p_ngay, public._gtt_snap_duyet(l.mon, l.khoi, p_ngay - (extract(isodow from p_ngay)::int - 1)));
end $$;

-- Gửi duyệt (trưởng khối) · Duyệt / Trả lại (trưởng bộ môn). Trả cả màn tuần.
create or replace function fn_gtt_chuyen(p_mon text, p_khoi text, p_tuan date, p_hanh_dong text, p_ghi_chu text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_tt gtt_duyet;
begin
  if not public._trong_pham_vi(p_mon, p_khoi) then
    raise exception 'Môn % khối % ngoài phạm vi của bạn.', p_mon, p_khoi using errcode = '42501';
  end if;
  if extract(isodow from p_tuan) <> 1 then raise exception 'Tuần phải bắt đầu bằng thứ Hai.' using errcode = 'P0001'; end if;
  if p_hanh_dong not in ('gui', 'duyet', 'tra_lai') then raise exception 'Hành động không hợp lệ.' using errcode = 'P0001'; end if;
  if p_hanh_dong in ('duyet', 'tra_lai') and not public._gtt_la_tbm(p_mon) then
    raise exception 'Chỉ trưởng bộ môn % mới duyệt / trả lại được.', p_mon using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtext('gtt|' || p_mon || '|' || p_khoi || '|' || p_tuan::text));
  v_tt := public._gtt_trang_thai(p_mon, p_khoi, p_tuan);

  if p_hanh_dong = 'gui' and v_tt.hanh_dong = 'gui' then
    raise exception 'Tuần này đã gửi, đang chờ trưởng bộ môn duyệt.' using errcode = 'P0001';
  elsif p_hanh_dong = 'duyet' and v_tt.hanh_dong is distinct from 'gui' then
    raise exception 'Chưa có bản gửi duyệt.' using errcode = 'P0001';
  elsif p_hanh_dong = 'tra_lai' then
    if v_tt.hanh_dong is null or v_tt.hanh_dong = 'tra_lai' then raise exception 'Chưa có bản để trả lại.' using errcode = 'P0001'; end if;
    if nullif(trim(p_ghi_chu), '') is null then raise exception 'Trả lại phải ghi lý do.' using errcode = 'P0001'; end if;
  end if;

  insert into gtt_duyet (mon, khoi, tuan, hanh_dong, ghi_chu, khung, nhan_su_id)
  values (p_mon, p_khoi, p_tuan, p_hanh_dong, nullif(trim(p_ghi_chu), ''),
          case when p_hanh_dong = 'duyet' then public._gtt_snap(p_mon, p_khoi, p_tuan) end,
          public.current_nhan_su_id());

  return public.fn_gtt_man_tuan(p_mon, p_khoi, p_tuan);
end $$;

-- ---------------------------------------------------------------------------
-- 5. Quyền: hàm nội bộ + trigger không cấp cho client; hàm màn chỉ cho nhân sự đăng nhập (cổng trong thân).
-- ---------------------------------------------------------------------------
revoke execute on function _gtt_ca_kiem() from public, anon, authenticated;
revoke execute on function _gtt_ca_ghi_vet() from public, anon, authenticated;
revoke execute on function _gtt_ca(uuid[], date, date) from public, anon, authenticated;
revoke execute on function _gtt_khung(uuid) from public, anon, authenticated;
revoke execute on function _gtt_khung_khoa(uuid) from public, anon, authenticated;
revoke execute on function _gtt_trang_thai(text, text, date) from public, anon, authenticated;
revoke execute on function _gtt_snap_duyet(text, text, date) from public, anon, authenticated;
revoke execute on function _gtt_ca_json(uuid, date, jsonb) from public, anon, authenticated;
revoke execute on function _gtt_snap(text, text, date) from public, anon, authenticated;
revoke execute on function _gtt_la_tbm(text) from public, anon, authenticated;
revoke execute on function _gtt_kiem_ca(uuid, date) from public, anon, authenticated;
revoke execute on function fn_gtt_man_tuan(text, text, date) from public, anon;
revoke execute on function fn_gtt_chon_buoi(uuid, date, uuid) from public, anon;
revoke execute on function fn_gtt_dat_khung(uuid, date, jsonb, uuid) from public, anon;
revoke execute on function fn_gtt_chuyen(text, text, date, text, text) from public, anon;
grant execute on function fn_gtt_man_tuan(text, text, date) to authenticated;
grant execute on function fn_gtt_chon_buoi(uuid, date, uuid) to authenticated;
grant execute on function fn_gtt_dat_khung(uuid, date, jsonb, uuid) to authenticated;
grant execute on function fn_gtt_chuyen(text, text, date, text, text) to authenticated;
