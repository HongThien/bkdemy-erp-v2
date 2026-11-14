-- Đợt 3 bước 1 (spec-kien-truc.md §4, K4) — MỘT khuôn tính sẵn: danh mục + hàng đợi bẩn + nhật ký + một bộ điều phối.
-- Thùy gật 14/11. CHỈ THÊM: không sửa hàm làm mới nào, không đụng job cron nào. Bộ điều phối CHƯA được cron gọi
-- (bật ở bước 1b, Thùy chạy SQL Editor). Tiền tố `tinh_san_` (không dùng `ts_` — đã là của tuyển sinh: _ts_dang_ky_test…).
-- Không màn nào đọc 3 bảng này ⇒ không cấp gì cho anon / authenticated.

-- 1) Danh mục sổ tính sẵn: mỗi sổ một dòng.
create table public.tinh_san_dang_ky (
  ma              text primary key,
  ten             text not null,
  lenh            text not null,          -- BIỂU THỨC SQL trả 1 giá trị (bộ điều phối chạy: select (<lenh>)::text)
  chu_ky_phut     int  not null check (chu_ky_phut >= 1),
  gio_chay        int[],                  -- giờ VN được chạy (0–23); NULL = mọi giờ ("không áp dụng" khung giờ)
  uu_tien         int  not null,          -- nhỏ chạy trước (sổ nền của sổ khác đứng trước)
  ngan_sach_giay  int  not null check (ngan_sach_giay between 1 and 100),
  bat             boolean not null default true,
  chay_gan_nhat   timestamptz,            -- NULL = chưa chạy lần nào qua bộ điều phối
  ghi_chu         text
);
comment on table public.tinh_san_dang_ky is 'Danh mục sổ tính sẵn (spec-kien-truc §4). Thêm sổ mới = thêm 1 dòng, KHÔNG thêm job cron.';

-- 2) Hàng đợi bẩn chung (sổ, khoá). Bước 1 chưa sổ nào dùng — các sổ chuyển sang dần ở các bước sau.
create table public.tinh_san_ban (
  so    text not null references public.tinh_san_dang_ky(ma),
  khoa  text not null,
  at    timestamptz not null default clock_timestamp(),
  primary key (so, khoa)
);
create index tinh_san_ban_so_at_idx on public.tinh_san_ban (so, at);
comment on table public.tinh_san_ban is 'Hàng đợi bẩn chung của các sổ tính sẵn: trigger ở bảng nguồn chỉ chèn (sổ, khoá).';

-- 3) Nhật ký từng lượt chạy của từng sổ. ms NULL = lượt bị cắt giữa chừng (quá trần câu lệnh).
create table public.tinh_san_chay (
  id       bigint generated always as identity primary key,
  so       text not null,
  bat_dau  timestamptz not null default clock_timestamp(),
  ms       int,
  ket_qua  text,
  loi      text
);
create index tinh_san_chay_bat_dau_idx on public.tinh_san_chay (bat_dau);
create index tinh_san_chay_so_idx on public.tinh_san_chay (so, bat_dau desc);
comment on table public.tinh_san_chay is 'Nhật ký bộ điều phối tính sẵn (giữ 7 ngày). ms NULL = lượt bị cắt.';

alter table public.tinh_san_dang_ky enable row level security;
alter table public.tinh_san_ban      enable row level security;
alter table public.tinh_san_chay     enable row level security;
revoke all on public.tinh_san_dang_ky, public.tinh_san_ban, public.tinh_san_chay from anon, authenticated;

-- 4) Bộ điều phối. PROCEDURE (không SET, không security definer) để COMMIT sau từng sổ:
--    sổ nào xong lưu sổ đó, một sổ lỗi / bị cắt không huỷ các sổ trước. Một kết nối thay cho N job.
create or replace procedure public._tinh_san_chay(p_giay int default 100)
language plpgsql
as $proc$
declare
  v_bd   timestamptz := clock_timestamp();
  v_gio  int := extract(hour from (now() at time zone 'Asia/Ho_Chi_Minh'))::int;
  v_ma   text[];
  v_lenh text[];
  v_ns   int[];
  v_t    timestamptz;
  v_id   bigint;
  v_kq   text;
  v_loi  text;
  i      int;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền được chạy bộ điều phối tính sẵn.'; end if;
  if not pg_try_advisory_lock(hashtext('_tinh_san_chay')) then return; end if;   -- đang có lượt khác chạy

  -- sổ đến hạn (trừ hao 30 giây cho lệch nhịp cron), ưu tiên nhỏ trước, cũ nhất trước
  select array_agg(d.ma order by d.uu_tien, d.chay_gan_nhat nulls first),
         array_agg(d.lenh order by d.uu_tien, d.chay_gan_nhat nulls first),
         array_agg(d.ngan_sach_giay order by d.uu_tien, d.chay_gan_nhat nulls first)
    into v_ma, v_lenh, v_ns
    from public.tinh_san_dang_ky d
   where d.bat
     and (d.gio_chay is null or v_gio = any(d.gio_chay))
     and (d.chay_gan_nhat is null or d.chay_gan_nhat <= now() - make_interval(mins => d.chu_ky_phut) + interval '30 seconds');

  for i in 1 .. coalesce(cardinality(v_ma), 0) loop
    -- không đủ giờ cho ngân sách của sổ này ⇒ để lượt sau (lúc đó nó cũ nhất trong cùng mức ưu tiên)
    continue when extract(epoch from clock_timestamp() - v_bd) + v_ns[i] > p_giay;
    v_t := clock_timestamp();
    insert into public.tinh_san_chay (so, bat_dau) values (v_ma[i], v_t) returning id into v_id;
    update public.tinh_san_dang_ky set chay_gan_nhat = v_t where ma = v_ma[i];
    commit;                                   -- dấu "đang chạy" còn lại nếu lượt bị cắt
    v_kq := null; v_loi := null;
    begin
      execute 'select (' || v_lenh[i] || ')::text' into v_kq;
    exception when others then
      v_loi := sqlstate || ' ' || sqlerrm;
    end;
    update public.tinh_san_chay
       set ms = round(extract(epoch from clock_timestamp() - v_t) * 1000)::int, ket_qua = left(v_kq, 500), loi = left(v_loi, 500)
     where id = v_id;
    commit;
  end loop;

  delete from public.tinh_san_chay where bat_dau < now() - interval '7 days';
  commit;
  perform pg_advisory_unlock(hashtext('_tinh_san_chay'));
end
$proc$;
revoke all on procedure public._tinh_san_chay(int) from public, anon, authenticated;
comment on procedure public._tinh_san_chay(int) is 'Bộ điều phối sổ tính sẵn: chạy các sổ đến hạn trong tinh_san_dang_ky, commit sau từng sổ. Chỉ tác vụ nền.';

-- 5) Đăng ký 8 sổ hiện có — lệnh GIỮ NGUYÊN như job cron đang chạy (chu kỳ, khung giờ, tham số).
--    xu-dong-bo KHÔNG vào đây: nó ghi sổ xu (dữ liệu gốc), không phải bảng tính sẵn.
insert into public.tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, ghi_chu) values
  ('mastery',        'Mastery lưu sẵn (em bẩn)',            'public.fn_mastery_lam_moi(20)',        5,  null, 10, 20, 'job cũ: mastery_lam_moi'),
  ('lop_dang_da_hoc','Dạng đã học theo lớp',                'public._lop_dang_da_hoc_lam_moi(20)',  5,  null, 20, 20, 'job cũ: lop-dang-da-hoc-luu · bám mốc mastery'),
  ('muc_tieu_tuan',  'Mục tiêu tuần',                       'public._mtt_lam_moi(40)',              5,  null, 30, 40, 'job cũ: muc-tieu-tuan · bám mốc mastery'),
  ('dang_yeu',       'Dạng yếu hiện tại (QLCL)',            'public._qlcl_lam_moi_nen(25)',         5,  null, 40, 25, 'job cũ: qlcl-dang-yeu-nen'),
  ('the_gioi_tin',   'Tin Thế giới BK',                     'public._the_gioi_tin_lam_moi()',       5,  null, 50, 10, 'job cũ: the-gioi-tin-luu'),
  ('phong_so',       'Số phòng làm việc',                   'public._phong_so_lam_moi(25, 10)',     5,  null, 60, 25, 'job cũ: phong-so-luu-san'),
  ('dash_viec_thang','Việc tháng dashboard nhân sự (TA+GV)',
     $l$(select count(*) from public._dash_viec_thang('ta', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'), 8))
      + (select count(*) from public._dash_viec_thang('gv', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'), 8))$l$,
                                                                                                     10, null, 70, 10, 'job cũ: dash-viec-thang'),
  ('bxh',            'Bảng xếp hạng',                       'public._bxh_lam_moi(30, 10)',          10, array[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 80, 30,
     'job cũ: bxh-luu-san (*/10 0-16,23 UTC = 6h–23h VN)');
