-- ĐẤU TỪ (demo) — hồ sơ người chơi · nhật ký trận · bảng xếp hạng · góp từ · góp ý.
-- spec-dau-tu-vung.md; Thùy 02/10 đêm: "làm demo ra thẳng game, deploy web + app test, khớp HS BK tính sau".
-- DEMO: người chơi = thiết bị (uid bí mật sinh ở máy, KHÔNG phải tài khoản HS). `ma` = mã công khai (hiện cho người khác,
-- dùng trong realtime/lời mời) — uid không bao giờ trả ra ngoài, nên không ai ghi đè hồ sơ người khác bằng cách đọc BXH.
-- Bảng bật RLS, KHÔNG policy cho anon: mọi đọc/ghi đi qua hàm security definer bên dưới (tính XP/chuỗi/BXH ở DB — CLAUDE §2.0).

create table if not exists dtv_nguoi_choi (
  uid             text primary key check (uid ~ '^[A-Za-z0-9_-]{16,64}$'),
  ma              text not null unique,
  ten             text not null check (char_length(btrim(ten)) between 2 and 25),
  nv              text not null default 'knight',
  xp              integer not null default 0,
  so_tran         integer not null default 0,
  so_thang        integer not null default 0,
  chuoi_thang     integer not null default 0,
  chuoi_thang_max integer not null default 0,
  chuoi_ngay      integer not null default 0,
  ngay_hoc_cuoi   date,          -- NULL = chưa có ngày học nào (không áp dụng), không phải "chưa đo"
  tao_at          timestamptz not null default now(),
  cap_nhat_at     timestamptz not null default now()
);

-- Nhật ký trận/lượt — append-only, 1 dòng = 1 kết quả THẬT đã xong (§1.5).
create table if not exists dtv_tran (
  id        uuid primary key default gen_random_uuid(),
  uid       text not null references dtv_nguoi_choi(uid) on delete cascade,
  mon       text not null default 'Tiếng Anh',
  che_do    text not null check (che_do in ('bot','doi','mang','giai','on_tap','noi_tu')),
  chu_de    text not null default 'tron',
  ket_qua   text not null check (ket_qua in ('thang','thua','hoa','xong')),
  so_dung   integer not null check (so_dung >= 0),
  so_cau    integer not null check (so_cau >= 0),
  diem      integer not null default 0,
  xp        integer not null default 0,
  doi_thu   text,                -- NULL = lượt không có đối thủ (ôn tập)
  tao_at    timestamptz not null default now()
);
create index if not exists dtv_tran_uid_tao on dtv_tran (uid, tao_at desc);

create table if not exists dtv_gop_tu (
  id          uuid primary key default gen_random_uuid(),
  uid         text not null references dtv_nguoi_choi(uid) on delete cascade,
  mon         text not null default 'Tiếng Anh',
  en          text not null check (char_length(btrim(en)) between 1 and 60),
  vi          text not null check (char_length(btrim(vi)) between 1 and 120),
  loai_tu     text not null default 'khong_ro' check (loai_tu in ('n','v','adj','adv','phr','khong_ro')),
  vi_du       text not null default '',
  vi_du_vi    text not null default '',
  trang_thai  text not null default 'cho_duyet' check (trang_thai in ('cho_duyet','da_duyet','tu_choi')),
  tao_at      timestamptz not null default now()
);

create table if not exists dtv_gop_y (
  id        uuid primary key default gen_random_uuid(),
  uid       text not null references dtv_nguoi_choi(uid) on delete cascade,
  noi_dung  text not null check (char_length(btrim(noi_dung)) between 3 and 2000),
  tao_at    timestamptz not null default now()
);

alter table dtv_nguoi_choi enable row level security;
alter table dtv_tran       enable row level security;
alter table dtv_gop_tu     enable row level security;
alter table dtv_gop_y      enable row level security;

-- ── Cấp độ từ XP: lên cấp k→k+1 cần 100 + 25·(k−1) XP ─────────────────────────────
create or replace function _dtv_cap(p_xp integer)
returns table (cap integer, xp_trong_cap integer, can_cho_cap_sau integer)
language plpgsql immutable as $$
declare k integer := 1; con integer := greatest(p_xp, 0); can integer;
begin
  loop
    can := 100 + 25 * (k - 1);
    exit when con < can;
    con := con - can; k := k + 1;
  end loop;
  return query select k, con, can;
end $$;

create or replace function _dtv_hom_nay() returns date language sql stable as $$
  select (now() at time zone 'Asia/Ho_Chi_Minh')::date
$$;

create or replace function _dtv_ho_so_json(p_uid text) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'ma', n.ma, 'ten', n.ten, 'nv', n.nv, 'xp', n.xp,
    'cap', c.cap, 'xp_trong_cap', c.xp_trong_cap, 'can_cho_cap_sau', c.can_cho_cap_sau,
    'so_tran', n.so_tran, 'so_thang', n.so_thang,
    'chuoi_thang', n.chuoi_thang, 'chuoi_thang_max', n.chuoi_thang_max,
    -- chuỗi ngày còn sống nếu học hôm nay hoặc hôm qua
    'chuoi_ngay', case when n.ngay_hoc_cuoi >= _dtv_hom_nay() - 1 then n.chuoi_ngay else 0 end,
    'hoc_hom_nay', coalesce(n.ngay_hoc_cuoi = _dtv_hom_nay(), false))
  from dtv_nguoi_choi n cross join lateral _dtv_cap(n.xp) c
  where n.uid = p_uid
$$;

-- ── Tạo / sửa hồ sơ ───────────────────────────────────────────────────────────────
create or replace function fn_dtv_ho_so_luu(p_uid text, p_ten text, p_nv text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ma text;
begin
  if p_nv not in ('knight','mage','ranger','rogue','barbarian','druid') then p_nv := 'knight'; end if;
  if exists (select 1 from dtv_nguoi_choi where uid = p_uid) then
    update dtv_nguoi_choi set ten = btrim(p_ten), nv = p_nv, cap_nhat_at = now() where uid = p_uid;
  else
    loop
      v_ma := 'BK-' || lpad((floor(random() * 100000))::int::text, 5, '0');
      exit when not exists (select 1 from dtv_nguoi_choi where ma = v_ma);
    end loop;
    insert into dtv_nguoi_choi (uid, ma, ten, nv) values (p_uid, v_ma, btrim(p_ten), p_nv);
  end if;
  return _dtv_ho_so_json(p_uid);
end $$;

create or replace function fn_dtv_ho_so(p_uid text)
returns jsonb language sql stable security definer set search_path = public as $$
  select _dtv_ho_so_json(p_uid)
$$;

-- ── Ghi 1 trận/lượt + tính XP, chuỗi thắng, chuỗi ngày (1 transaction) ───────────
create or replace function fn_dtv_ghi_tran(
  p_uid text, p_che_do text, p_chu_de text, p_ket_qua text,
  p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_cau integer := least(greatest(coalesce(p_so_cau, 0), 0), 40);
  v_dung integer := least(greatest(coalesce(p_so_dung, 0), 0), least(greatest(coalesce(p_so_cau, 0), 0), 40));
  v_xp integer; v_hom_nay date := _dtv_hom_nay(); v_cap_truoc integer; v_cap_sau integer;
  v_luot_hom_nay integer; n dtv_nguoi_choi;
begin
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;

  v_xp := case
    when p_che_do = 'on_tap' then v_dung * 2
    when p_che_do = 'noi_tu' then least(v_dung, 30) * 2 + case p_ket_qua when 'thang' then 20 else 0 end
    else v_dung * 5 + case p_ket_qua when 'thang' then 40 when 'hoa' then 20 else 10 end
  end;
  -- chống cày: quá 60 lượt/ngày thì không cộng XP nữa (vẫn ghi nhật ký)
  select count(*) into v_luot_hom_nay from dtv_tran
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom_nay;
  if v_luot_hom_nay >= 60 then v_xp := 0; end if;

  insert into dtv_tran (uid, che_do, chu_de, ket_qua, so_dung, so_cau, diem, xp, doi_thu)
  values (p_uid, p_che_do, coalesce(nullif(p_chu_de, ''), 'tron'), p_ket_qua, v_dung, v_cau,
          least(greatest(coalesce(p_diem, 0), 0), 10000), v_xp, nullif(p_doi_thu, ''));

  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    so_tran  = n.so_tran  + case when p_che_do in ('bot','mang','giai') then 1 else 0 end,
    so_thang = n.so_thang + case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then 1 else 0 end,
    chuoi_thang = case when p_che_do not in ('bot','mang','giai') then n.chuoi_thang
                       when p_ket_qua = 'thang' then n.chuoi_thang + 1
                       when p_ket_qua = 'thua' then 0 else n.chuoi_thang end,
    chuoi_thang_max = greatest(n.chuoi_thang_max,
                       case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then n.chuoi_thang + 1 else 0 end),
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_hom_nay then n.chuoi_ngay
                      when n.ngay_hoc_cuoi = v_hom_nay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_hom_nay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc);
end $$;

-- ── Bảng xếp hạng: 'xp' | 'chuoi_thang' | 'chuoi_ngay' ─────────────────────────────
create or replace function fn_dtv_bxh(p_tieu_chi text, p_uid text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with g as (
    select n.uid, n.ma, n.ten, n.nv, c.cap,
           case p_tieu_chi
             when 'chuoi_thang' then n.chuoi_thang_max
             when 'chuoi_ngay'  then case when n.ngay_hoc_cuoi >= _dtv_hom_nay() - 1 then n.chuoi_ngay else 0 end
             else n.xp end as gt
    from dtv_nguoi_choi n cross join lateral _dtv_cap(n.xp) c
  ), x as (
    select g.*, rank() over (order by gt desc) as hang from g where gt > 0
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'cap', cap, 'gt', gt) order by hang, ten)
                     from (select * from x order by hang, ten limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'gt', gt) from x where uid = p_uid))
$$;

-- ── Góp từ (tối đa 10/ngày) ─────────────────────────────────────────────────────────
create or replace function fn_dtv_gop_tu(p_uid text, p_en text, p_vi text, p_loai text, p_vd text, p_vdvi text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_n integer;
begin
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  select count(*) into v_n from dtv_gop_tu
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = _dtv_hom_nay();
  if v_n >= 10 then raise exception 'Hôm nay em đã góp đủ 10 từ rồi'; end if;
  if coalesce(btrim(p_vd), '') <> '' and position(lower(btrim(p_en)) in lower(p_vd)) = 0 then
    raise exception 'Câu ví dụ phải chứa từ được đóng góp';
  end if;
  insert into dtv_gop_tu (uid, en, vi, loai_tu, vi_du, vi_du_vi)
  values (p_uid, lower(btrim(p_en)), btrim(p_vi),
          case when p_loai in ('n','v','adj','adv','phr') then p_loai else 'khong_ro' end,
          coalesce(btrim(p_vd), ''), coalesce(btrim(p_vdvi), ''));
  return jsonb_build_object('con_lai_hom_nay', 9 - v_n);
end $$;

create or replace function fn_dtv_gop_tu_cua_toi(p_uid text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('en', en, 'vi', vi, 'loai_tu', loai_tu, 'trang_thai', trang_thai, 'tao_at', tao_at)
                            order by tao_at desc), '[]'::jsonb)
  from (select * from dtv_gop_tu where uid = p_uid order by tao_at desc limit 50) t
$$;

create or replace function fn_dtv_gop_y(p_uid text, p_noi_dung text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  insert into dtv_gop_y (uid, noi_dung) values (p_uid, btrim(p_noi_dung));
end $$;

-- Quyền: chỉ các hàm fn_dtv_* mở cho anon (game chạy không đăng nhập). Hàm _dtv_* nội bộ.
revoke all on function _dtv_cap(integer), _dtv_hom_nay(), _dtv_ho_so_json(text) from public, anon, authenticated;
revoke all on function fn_dtv_ho_so_luu(text, text, text), fn_dtv_ho_so(text),
  fn_dtv_ghi_tran(text, text, text, text, integer, integer, integer, text), fn_dtv_bxh(text, text),
  fn_dtv_gop_tu(text, text, text, text, text, text), fn_dtv_gop_tu_cua_toi(text), fn_dtv_gop_y(text, text) from public;
grant execute on function fn_dtv_ho_so_luu(text, text, text), fn_dtv_ho_so(text),
  fn_dtv_ghi_tran(text, text, text, text, integer, integer, integer, text), fn_dtv_bxh(text, text),
  fn_dtv_gop_tu(text, text, text, text, text, text), fn_dtv_gop_tu_cua_toi(text), fn_dtv_gop_y(text, text)
  to anon, authenticated;
