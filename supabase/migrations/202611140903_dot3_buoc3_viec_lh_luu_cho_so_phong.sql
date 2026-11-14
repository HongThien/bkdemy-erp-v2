-- Đợt 3 bước 3 (spec-kien-truc.md §4) — sổ tính sẵn "việc buổi thường theo người phụ trách lúc hạn" cho ĐƯỜNG LÀM MỚI NỀN. Thùy gật 14/11.
-- Đo 14/11: sổ phòng 27 s / chu kỳ vì fn_viec_buoi_thuong_lh (tính cho MỌI nhân sự, 0,56 s / lượt) bị gọi ~70 lần
-- (35 cặp ô × TA, mỗi cặp 1 lần cho việc tuần + 1 lần cho hiệu suất). Hàm gốc không lọc sớm theo người được
-- (phải xét cả lớp mới biết ai phụ trách lúc hạn) ⇒ tính MỘT lần mỗi lượt điều phối, lưu, các hàm nền đọc lại.
-- CHỈ tác vụ nền đọc sổ này (cổng _la_tac_vu_nen) và chỉ khi sổ còn tươi (≤ 4 phút) + phủ đủ cửa sổ; còn lại ⇒ tính trực tiếp như cũ.
-- ⇒ màn người dùng gọi (dashboard hiệu suất, fn_hsta_task từ client…) KHÔNG đổi hành vi. Công thức hiệu suất không đụng.

-- 1) Bảng lưu = bản chiếu của fn_viec_buoi_thuong_lh trên cửa sổ [min(đầu tháng, đầu tuần − 30) … max(cuối tháng, đầu tuần + 6)].
--    Bản chiếu thuần (xoá được, tính lại được) ⇒ không khoá ngoại. dong_at / han NULL đúng như hàm gốc trả.
create table public.viec_lh_luu (
  nhan_su_id uuid not null,
  buoi_id    uuid not null,
  lop_id     uuid,
  ten_lop    text,
  ngay       date not null,
  vai        text not null,
  tab        text not null,
  dong_at    timestamptz,
  han        timestamptz,
  et_online  boolean,
  ref_key    text,
  primary key (nhan_su_id, buoi_id, tab, vai)
);
create index viec_lh_luu_ngay_idx on public.viec_lh_luu (ngay);
comment on table public.viec_lh_luu is 'Sổ tính sẵn (tinh_san_dang_ky: viec_lh): bản chiếu fn_viec_buoi_thuong_lh, CHỈ cho tác vụ nền đọc qua fn_viec_buoi_thuong_lh_nen.';

create table public.viec_lh_luu_moc (
  id      int primary key check (id = 1),
  tu      date not null,
  den     date not null,
  tinh_at timestamptz not null,
  so_dong int not null
);
alter table public.viec_lh_luu     enable row level security;
alter table public.viec_lh_luu_moc enable row level security;
revoke all on public.viec_lh_luu, public.viec_lh_luu_moc from anon, authenticated;

-- 2) Làm mới: ghi phần khác biệt (không xoá hết chèn lại).
create or replace function public._viec_lh_lam_moi()
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_d   date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu  date := least(date_trunc('month', v_d)::date, date_trunc('week', v_d)::date - 30);
  v_den date := greatest((date_trunc('month', v_d) + interval '1 month - 1 day')::date, date_trunc('week', v_d)::date + 6);
  v_n   int;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền.'; end if;
  with moi as materialized (
    select * from public.fn_viec_buoi_thuong_lh(v_tu, v_den)
  ), xoa as (
    delete from viec_lh_luu l
     where not exists (select 1 from moi m where m.nhan_su_id = l.nhan_su_id and m.buoi_id = l.buoi_id and m.tab = l.tab and m.vai = l.vai)
  ), ghi as (
    insert into viec_lh_luu (nhan_su_id, buoi_id, lop_id, ten_lop, ngay, vai, tab, dong_at, han, et_online, ref_key)
    select m.nhan_su_id, m.buoi_id, m.lop_id, m.ten_lop, m.ngay, m.vai, m.tab, m.dong_at, m.han, m.et_online, m.ref_key from moi m
    on conflict (nhan_su_id, buoi_id, tab, vai) do update
      set lop_id = excluded.lop_id, ten_lop = excluded.ten_lop, ngay = excluded.ngay, dong_at = excluded.dong_at,
          han = excluded.han, et_online = excluded.et_online, ref_key = excluded.ref_key
      where (viec_lh_luu.lop_id, viec_lh_luu.ten_lop, viec_lh_luu.ngay, viec_lh_luu.dong_at, viec_lh_luu.han, viec_lh_luu.et_online, viec_lh_luu.ref_key)
            is distinct from (excluded.lop_id, excluded.ten_lop, excluded.ngay, excluded.dong_at, excluded.han, excluded.et_online, excluded.ref_key)
  )
  select count(*) into v_n from moi;
  insert into viec_lh_luu_moc (id, tu, den, tinh_at, so_dong) values (1, v_tu, v_den, clock_timestamp(), v_n)
    on conflict (id) do update set tu = excluded.tu, den = excluded.den, tinh_at = excluded.tinh_at, so_dong = excluded.so_dong;
  return v_n;
end $function$;
revoke all on function public._viec_lh_lam_moi() from public, anon, authenticated;

-- 3) Hai hàm đọc sổ — security definer, chỉ tác vụ nền.
create or replace function public._viec_lh_con_tuoi(p_tu date, p_den date)
 returns boolean
 language sql stable security definer
 set search_path to 'public'
as $function$
  select public._la_tac_vu_nen() and p_tu is not null and p_den is not null
     and exists (select 1 from viec_lh_luu_moc m where m.id = 1 and m.tu <= p_tu and m.den >= p_den and m.tinh_at > now() - interval '4 minutes')
$function$;
revoke all on function public._viec_lh_con_tuoi(date, date) from public, anon, authenticated;

create or replace function public._viec_lh_doc(p_tu date, p_den date)
 returns table(nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, vai text, tab text, dong_at timestamptz, han timestamptz, et_online boolean, ref_key text)
 language sql stable security definer
 set search_path to 'public'
as $function$
  select l.nhan_su_id, l.buoi_id, l.lop_id, l.ten_lop, l.ngay, l.vai, l.tab, l.dong_at, l.han, l.et_online, l.ref_key
    from viec_lh_luu l
   where public._la_tac_vu_nen() and l.ngay >= p_tu and l.ngay <= p_den
$function$;
revoke all on function public._viec_lh_doc(date, date) from public, anon, authenticated;

-- 4) Một cửa cho các hàm NỀN: tác vụ nền + sổ tươi ⇒ đọc sổ; mọi trường hợp khác ⇒ tính trực tiếp y như cũ.
--    Invoker (người dùng gọi qua fn_hsta_task vẫn đi nhánh tính trực tiếp bằng quyền của chính họ).
create or replace function public.fn_viec_buoi_thuong_lh_nen(p_tu date, p_den date)
 returns table(nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, vai text, tab text, dong_at timestamptz, han timestamptz, et_online boolean, ref_key text)
 language plpgsql stable
 set search_path to 'public'
as $function$
begin
  if public._la_tac_vu_nen() then
    if public._viec_lh_con_tuoi(p_tu, p_den) then
      return query select * from public._viec_lh_doc(p_tu, p_den);
      return;
    end if;
  end if;
  return query select * from public.fn_viec_buoi_thuong_lh(p_tu, p_den);
end $function$;

-- 5) Hai hàm trên đường làm mới sổ phòng đổi NGUỒN (chỉ một chỗ gọi mỗi hàm; thân còn lại giữ nguyên từng chữ).
do $do$
declare r record; v_def text; v_moi text; v_n int;
begin
  for r in select p.oid, p.proname from pg_proc p
            where p.pronamespace = 'public'::regnamespace and p.proname in ('fn_hsta_task', '_phong_viec_ta_pv') loop
    v_def := pg_get_functiondef(r.oid);
    v_n := (length(v_def) - length(replace(v_def, 'public.fn_viec_buoi_thuong_lh(', ''))) / length('public.fn_viec_buoi_thuong_lh(');
    if v_n <> 1 then raise exception '%: mong đúng 1 chỗ gọi fn_viec_buoi_thuong_lh, thấy %', r.proname, v_n; end if;
    v_moi := replace(v_def, 'public.fn_viec_buoi_thuong_lh(', 'public.fn_viec_buoi_thuong_lh_nen(');
    execute v_moi;
  end loop;
  if (select count(*) from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname in ('fn_hsta_task', '_phong_viec_ta_pv')
        and p.prosrc like '%fn_viec_buoi_thuong_lh_nen(%') <> 2 then
    raise exception 'Không đổi đủ 2 hàm.';
  end if;
end $do$;

-- 6) Đăng ký sổ: chạy TRƯỚC sổ phòng (60) trong cùng lượt điều phối.
insert into public.tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, ghi_chu) values
  ('viec_lh', 'Việc buổi thường theo người phụ trách lúc hạn (cho hàm nền)', 'public._viec_lh_lam_moi()', 5, null, 55, 10,
   'nguồn của sổ phòng (việc tuần + hiệu suất). Chỉ tác vụ nền đọc, tươi ≤ 4 phút.');
