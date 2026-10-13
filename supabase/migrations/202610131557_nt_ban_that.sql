-- ============================================================================
-- nt_ban_that — NÔNG TRẠI BK: BẠN LỚP THẬT (bước 4 "hoàn thiện game", Thùy 12/10: "bạn lớp thật")
-- ----------------------------------------------------------------------------
-- VÌ SAO: bạn ảo (BAN_AO) chạy trong trình duyệt; sang vườn BẠN THẬT cần máy chủ: tài khoản, danh sách lớp, giờ server và luật kiểm ở DB
--   (CLAUDE.md §2.0; spec-nong-trai-nhip-ngay.md §7). Client không được tự tuyên "ô này chín quá hạn" rồi hái.
-- MÔ HÌNH (tính thuần, không dòng chờ — §1.5/§4):
--   · Vườn của mỗi em = nt_luu.state (em tự lưu). Việc BẠN làm lên vườn em (tưới hộ, bắt sâu hộ, hái trộm, chó đuổi) = 1 dòng nt_ban_viec
--     CHỈ KHI việc thật xảy ra. Khoá tự nhiên = (chủ, ô, ngày gieo d0) — chủ thu hoạch rồi gieo lại thì dòng cũ tự hết hiệu lực.
--   · Trạng thái ô HIỆU LỰC = bản lưu của chủ + các dòng việc khớp khoá (hợp tập, nên áp lại bao nhiêu lần cũng không đếm đôi).
--   · Lượt/ngày (giúp 5 · trộm 3) đếm bằng dòng có thật của người làm trong ngày nông trại. Ngày nông trại = nt_cau_hinh.gio_doi_ngay (5h VN).
--   · Luật ô (sâu, sản lượng, trộm tối đa) PORT NGUYÊN từ game (engine.js ttO/sauCua/sanLuong, bam = FNV-1a). Hằng số nằm trong
--     nt_cay + _nt_luat() sinh trực tiếp từ data.js. Có script kiểm tương đương JS ↔ SQL (scripts/test-nt-ban.mjs).
-- BẠN = cùng lớp đang học (hoc_sinh_lop.dang_hoc) và ĐÃ có vườn (nt_luu). Tên hiện theo cài đặt Thế giới BK (hiện tên / ẩn thành mã).
-- GHI CHÚ TRUNG THỰC: kho/điểm của NGƯỜI LÀM vẫn do client giữ (quả hái được cộng ở máy em) — chặn kinh tế tuyệt đối là bước sau.
--   Phần QUAN TRỌNG đã ở server: ai được hái gì, mất bao nhiêu, mỗi người 1 lần/ô, lượt/ngày, chó đuổi.
-- MẤT GÌ: không xoá/thu hẹp gì — thêm 3 bảng, ~12 hàm.
-- ============================================================================
create table if not exists public.nt_cay (
  id text primary key, ngay integer not null, goc integer not null, gia integer not null
);
insert into public.nt_cay (id, ngay, goc, gia) values
  ('lua_mi', 1, 7, 2),
  ('ca_rot', 1, 5, 3),
  ('ngo', 2, 8, 4),
  ('khoai_tay', 2, 11, 3),
  ('ca_chua', 2, 7, 5),
  ('bi_ngo', 3, 8, 7),
  ('hoa_huong_duong', 3, 6, 10),
  ('dau_tay', 3, 16, 4),
  ('ot', 1, 10, 2),
  ('dua_hau', 3, 4, 16),
  ('dau_nanh', 1, 10, 2),
  ('lua_nuoc', 2, 10, 4),
  ('mia', 3, 8, 8)
on conflict (id) do update set ngay = excluded.ngay, goc = excluded.goc, gia = excluded.gia;
alter table public.nt_cay enable row level security;
revoke all on public.nt_cay from anon, authenticated;

create table if not exists public.nt_ban_viec (
  id      bigint generated always as identity primary key,
  chu     uuid not null references public.hoc_sinh(id) on delete cascade,
  nguoi   uuid not null references public.hoc_sinh(id) on delete cascade,
  o       smallint not null check (o >= 0 and o < 12),
  d0      integer not null,
  ngay    integer not null,
  loai    text not null check (loai in ('tuoi', 'bat_sau', 'trom', 'cho_duoi')),
  n       smallint not null default 0 check (n >= 0),
  tao_luc timestamptz not null default now(),
  check (chu <> nguoi)
);
create unique index if not exists nt_ban_viec_trom_uq on public.nt_ban_viec (chu, nguoi, o, d0) where loai in ('trom', 'cho_duoi');
create unique index if not exists nt_ban_viec_tuoi_uq on public.nt_ban_viec (chu, o, d0, ngay) where loai = 'tuoi';
create index if not exists nt_ban_viec_chu_idx on public.nt_ban_viec (chu, id);
create index if not exists nt_ban_viec_nguoi_idx on public.nt_ban_viec (nguoi, ngay);
alter table public.nt_ban_viec enable row level security;
revoke all on public.nt_ban_viec from anon, authenticated;

create or replace function public._nt_luat() returns jsonb language sql immutable as $$
  select '{"tuoiThem":0.8,"bonThem":0.25,"sauTiLe":0.25,"sauTru":0.2,"tromToiDa":0.2,"tromMoiLan":1,"trom":3,"giup":5,"choDuoi":[0,0.2,0.4,0.6],"tcMoc":[20,50,100],"mua0Ngay":60,"mua0Bonus":[0.6,0.3]}'::jsonb
$$;

create or replace function public._nt_bam(p_k text) returns double precision
language plpgsql immutable as $$
declare h bigint := 2166136261; i integer; n integer := length(p_k);
begin
  for i in 1..n loop
    h := h # ascii(substr(p_k, i, 1))::bigint;
    h := (h * 16777619) & 4294967295;
  end loop;
  h := h # (h >> 13);
  h := (h * 1540483477) & 4294967295;
  h := h # (h >> 15);
  return h::double precision / 4294967296.0;
end $$;

create or replace function public._nt_hom_nay() returns integer language sql stable set search_path = public as $$
  select (public._nt_ngay(clock_timestamp()) - date '1970-01-01')::integer
$$;

create or replace function public._nt_bonus_mua(p_ngay0 integer, p_d0 integer) returns double precision
language plpgsql immutable as $$
declare l jsonb := public._nt_luat(); off integer := greatest(0, p_d0 - p_ngay0);
begin
  if off >= (l->>'mua0Ngay')::int then return 0; end if;
  return (l->'mua0Bonus'->>(least(jsonb_array_length(l->'mua0Bonus') - 1, off / 30)))::double precision;
end $$;

create or replace function public._nt_sau_ngay(p_r jsonb, p_key text, p_den integer) returns integer[]
language plpgsql stable set search_path = public as $$
declare l jsonb := public._nt_luat(); v_ngay integer; v_d0 integer := (p_r->>'d0')::int; dr integer; d integer; res integer[] := '{}';
begin
  select ngay into v_ngay from nt_cay where id = p_r->>'cay'; if v_ngay is null then return res; end if;
  dr := v_d0 + v_ngay;
  for d in (v_d0 + 1)..least(p_den, dr) loop
    if public._nt_bam(p_key || '|' || v_d0 || '|s' || d) < (l->>'sauTiLe')::double precision
       and not (coalesce(p_r->'bat', '[]'::jsonb) @> to_jsonb(d)) then res := res || d; end if;
  end loop;
  return res;
end $$;

create or replace function public._nt_o_tt(p_r jsonb, p_key text, p_dn integer, p_bonus double precision)
returns jsonb
language plpgsql stable set search_path = public as $$
declare
  l jsonb := public._nt_luat(); c nt_cay; v_d0 integer; dr integer; v_sau integer; v_tuoi_thang integer;
  he_tuoi double precision; he_bon double precision; he_sau double precision; y double precision; fl double precision;
  n integer; v_trom integer := coalesce((p_r->>'trom')::int, 0); tran integer; v_hom boolean;
begin
  if p_r is null or p_r->>'cay' is null then return jsonb_build_object('tt', 'trong'); end if;
  select * into c from nt_cay where id = p_r->>'cay';
  if not found then return jsonb_build_object('tt', 'trong'); end if;
  v_d0 := (p_r->>'d0')::int; dr := v_d0 + c.ngay;
  v_sau := coalesce(array_length(public._nt_sau_ngay(p_r, p_key, p_dn), 1), 0);
  v_hom := coalesce(p_r->'tuoi', '[]'::jsonb) @> to_jsonb(p_dn);
  if p_dn < dr then
    return jsonb_build_object('tt', 'lon', 'cay', c.id, 'dr', dr, 'sau', v_sau, 'tuoiHom', v_hom, 'conNgay', dr - p_dn);
  end if;
  select count(distinct x)::int into v_tuoi_thang from jsonb_array_elements_text(coalesce(p_r->'tuoi', '[]'::jsonb)) t(x) where x::int >= v_d0 and x::int < dr;
  v_tuoi_thang := least(c.ngay, v_tuoi_thang);
  he_tuoi := (l->>'tuoiThem')::double precision * v_tuoi_thang / c.ngay;
  he_bon := case when coalesce((p_r->>'bon')::boolean, false) then (l->>'bonThem')::double precision else 0 end;
  he_sau := greatest(0, 1 - (l->>'sauTru')::double precision * v_sau);
  y := c.goc * (1 + he_tuoi) * (1 + he_bon) * he_sau * (1 + p_bonus);
  fl := floor(y + 1e-9);
  n := fl::int + case when public._nt_bam(p_key || '|' || v_d0 || '|le') < y - fl then 1 else 0 end;
  tran := case when n >= 3 then greatest(1, floor(n * (l->>'tromToiDa')::double precision)::int) else 0 end;
  return jsonb_build_object('tt', 'chin', 'cay', c.id, 'dr', dr, 'sau', v_sau, 'n', n, 'trom', v_trom, 'con', greatest(0, n - v_trom),
                            'quaHan', p_dn > dr, 'tromDuoc', greatest(0, tran - v_trom), 'tuoiHom', v_hom);
end $$;

create or replace function public._nt_o_hieu_luc(p_chu uuid, p_i integer, p_r jsonb, p_hat text)
returns jsonb
language plpgsql stable set search_path = public as $$
declare v_d0 integer; v_key text := p_hat || '|o' || p_i; v_tuoi jsonb; v_bat jsonb; v_hai jsonb; v_tong integer; rw record; d integer;
begin
  if p_r is null or p_r->>'cay' is null then return jsonb_build_object('cay', null); end if;
  v_d0 := (p_r->>'d0')::int;
  v_tuoi := coalesce(p_r->'tuoi', '[]'::jsonb);
  v_bat := coalesce(p_r->'bat', '[]'::jsonb);
  v_hai := coalesce(p_r->'haiBan', '{}'::jsonb);
  for rw in select * from nt_ban_viec where chu = p_chu and o = p_i and d0 = v_d0 order by id loop
    if rw.loai = 'tuoi' then
      if not (v_tuoi @> to_jsonb(rw.ngay)) then v_tuoi := v_tuoi || to_jsonb(rw.ngay); end if;
    elsif rw.loai = 'bat_sau' then
      foreach d in array public._nt_sau_ngay(jsonb_build_object('cay', p_r->>'cay', 'd0', v_d0, 'bat', v_bat), v_key, rw.ngay) loop
        v_bat := v_bat || to_jsonb(d);
      end loop;
    elsif rw.loai = 'trom' then
      v_hai := v_hai || jsonb_build_object(rw.nguoi::text, rw.n);
    end if;
  end loop;
  select coalesce(sum(value::int), 0)::int into v_tong from jsonb_each_text(v_hai);
  return jsonb_build_object('cay', p_r->>'cay', 'd0', v_d0, 'tuoi', v_tuoi, 'bat', v_bat, 'bon', coalesce((p_r->>'bon')::boolean, false),
                            'trom', coalesce((p_r->>'trom')::int, 0) + v_tong, 'haiBan', v_hai);
end $$;

create or replace function public._nt_cung_lop(p_a uuid, p_b uuid) returns boolean language sql stable set search_path = public as $$
  select p_a <> p_b and exists (
    select 1 from hoc_sinh_lop x join hoc_sinh_lop y on y.lop_id = x.lop_id and y.trang_thai = 'dang_hoc'
    where x.hoc_sinh_id = p_a and x.trang_thai = 'dang_hoc' and y.hoc_sinh_id = p_b)
$$;

create or replace function public._nt_ten_ban(p_hs uuid) returns text language sql stable set search_path = public as $$
  select case when coalesce(cd.hien, 'ten') = 'ma' then h.ma_hs else h.ho_ten end
  from hoc_sinh h left join the_gioi_cai_dat cd on cd.hoc_sinh_id = h.id where h.id = p_hs
$$;

create or replace function public._nt_luot_con(p_nguoi uuid, p_dn integer) returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object(
    'con_giup', greatest(0, (public._nt_luat()->>'giup')::int - (select count(*) from nt_ban_viec where nguoi = p_nguoi and ngay = p_dn and loai in ('tuoi', 'bat_sau'))::int),
    'con_trom', greatest(0, (public._nt_luat()->>'trom')::int - (select count(*) from nt_ban_viec where nguoi = p_nguoi and ngay = p_dn and loai in ('trom', 'cho_duoi'))::int))
$$;

create or replace function public._nt_vuon_ruong(p_chu uuid, p_state jsonb, p_xem uuid) returns jsonb
language plpgsql stable set search_path = public as $$
declare i integer; o_mo integer := coalesce((p_state->>'oMo')::int, 0); res jsonb := '[]'::jsonb; r jsonb; v_hat text := p_state->>'hat';
begin
  for i in 0..least(o_mo, jsonb_array_length(coalesce(p_state->'ruong', '[]'::jsonb))) - 1 loop
    r := public._nt_o_hieu_luc(p_chu, i, p_state->'ruong'->i, v_hat);
    if r->>'cay' is not null then
      r := r || jsonb_build_object('daHai', exists (select 1 from nt_ban_viec w where w.chu = p_chu and w.nguoi = p_xem and w.o = i and w.d0 = (r->>'d0')::int and w.loai in ('trom', 'cho_duoi')));
    end if;
    res := res || jsonb_build_array(r);
  end loop;
  return res;
end $$;

create or replace function public.fn_nt_ban_ds() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); res jsonb := '[]'::jsonb; b record; rg jsonb; r jsonb; tt jsonb; giup integer; hai integer; i integer;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  for b in
    select h.id, l.state from hoc_sinh h join nt_luu l on l.hoc_sinh_id = h.id
    where h.id <> v_me and h.trang_thai = 'dang_hoc' and public._nt_cung_lop(v_me, h.id)
  loop
    rg := public._nt_vuon_ruong(b.id, b.state, v_me); giup := 0; hai := 0;
    for i in 0..jsonb_array_length(rg) - 1 loop
      r := rg->i; if r->>'cay' is null then continue; end if;
      tt := public._nt_o_tt(r, (b.state->>'hat') || '|o' || i, dn, public._nt_bonus_mua(coalesce((b.state->>'ngay0')::int, dn), (r->>'d0')::int));
      if tt->>'tt' = 'lon' and (not (tt->>'tuoiHom')::boolean or (tt->>'sau')::int > 0) then giup := giup + 1;
      elsif tt->>'tt' = 'chin' and (tt->>'sau')::int > 0 then giup := giup + 1; end if;
      if tt->>'tt' = 'chin' and (tt->>'quaHan')::boolean and (tt->>'tromDuoc')::int > 0 and not (r->>'daHai')::boolean then hai := hai + 1; end if;
    end loop;
    res := res || jsonb_build_array(jsonb_build_object('id', b.id, 'ten', public._nt_ten_ban(b.id), 'cap', coalesce((b.state->>'cap')::int, 1),
                                                         'giup', giup, 'hai', hai));
  end loop;
  return jsonb_build_object('ngay', dn, 'ban', res) || public._nt_luot_con(v_me, dn);
end $$;

create or replace function public.fn_nt_ban_vuon(p_ban uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); st jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if not public._nt_cung_lop(v_me, p_ban) then return jsonb_build_object('ok', false, 'loi', 'khong_cung_lop'); end if;
  select state into st from nt_luu where hoc_sinh_id = p_ban;
  if st is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_vuon'); end if;
  return jsonb_build_object('ok', true, 'id', p_ban, 'ten', public._nt_ten_ban(p_ban), 'cap', coalesce((st->>'cap')::int, 1),
    'hat', st->>'hat', 'ngay0', coalesce((st->>'ngay0')::int, dn), 'oMo', coalesce((st->>'oMo')::int, 4), 'ngay', dn,
    'ruong', public._nt_vuon_ruong(p_ban, st, v_me),
    'vat', jsonb_build_object('ga', jsonb_build_object('con', coalesce(st->'vat'->'ga'->'con', '[]'::jsonb)), 'bo', jsonb_build_object('con', coalesce(st->'vat'->'bo'->'con', '[]'::jsonb))),
    'trangTri', coalesce(st->'trangTri', '[]'::jsonb),
    'thu', jsonb_build_object('cho', jsonb_build_object('tc', coalesce((st->'thu'->'cho'->>'tc')::int, 0), 'd', -1, 'mua', coalesce((st->'thu'->'cho'->>'mua')::boolean, false)),
                              'meo', jsonb_build_object('tc', 0, 'd', -1), 'chim', jsonb_build_object('tc', 0, 'd', -1)))
    || public._nt_luot_con(v_me, dn);
end $$;

create or replace function public.fn_nt_ban_giup(p_ban uuid, p_o integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); st jsonb; r jsonb; tt jsonb; luot jsonb; v_loai text;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if not public._nt_cung_lop(v_me, p_ban) then return jsonb_build_object('ok', false, 'loi', 'khong_cung_lop'); end if;
  perform pg_advisory_xact_lock(hashtext('ntban:' || p_ban::text));
  select state into st from nt_luu where hoc_sinh_id = p_ban;
  if st is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_vuon'); end if;
  if p_o is null or p_o < 0 or p_o >= coalesce((st->>'oMo')::int, 0) then return jsonb_build_object('ok', false, 'loi', 'o_khong_hop_le'); end if;
  luot := public._nt_luot_con(v_me, dn);
  if (luot->>'con_giup')::int < 1 then return jsonb_build_object('ok', false, 'loi', 'het_luot') || luot; end if;
  r := public._nt_o_hieu_luc(p_ban, p_o, st->'ruong'->p_o, st->>'hat');
  if r->>'cay' is null then return jsonb_build_object('ok', false, 'loi', 'khong_can') || luot; end if;
  tt := public._nt_o_tt(r, (st->>'hat') || '|o' || p_o, dn, public._nt_bonus_mua(coalesce((st->>'ngay0')::int, dn), (r->>'d0')::int));
  if tt->>'tt' = 'lon' and not (tt->>'tuoiHom')::boolean then v_loai := 'tuoi';
  elsif (tt->>'sau')::int > 0 and tt->>'tt' in ('lon', 'chin') then v_loai := 'bat_sau';
  else return jsonb_build_object('ok', false, 'loi', 'khong_can') || luot; end if;
  insert into nt_ban_viec (chu, nguoi, o, d0, ngay, loai) values (p_ban, v_me, p_o, (r->>'d0')::int, dn, v_loai);
  return jsonb_build_object('ok', true, 'loai', v_loai, 'cay', r->>'cay') || public._nt_luot_con(v_me, dn);
end $$;

create or replace function public.fn_nt_ban_trom(p_ban uuid, p_o integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); st jsonb; r jsonb; tt jsonb; luot jsonb; l jsonb := public._nt_luat();
        v_tc integer; v_moc integer; v_n integer;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if not public._nt_cung_lop(v_me, p_ban) then return jsonb_build_object('ok', false, 'loi', 'khong_cung_lop'); end if;
  perform pg_advisory_xact_lock(hashtext('ntban:' || p_ban::text));
  select state into st from nt_luu where hoc_sinh_id = p_ban;
  if st is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_vuon'); end if;
  if p_o is null or p_o < 0 or p_o >= coalesce((st->>'oMo')::int, 0) then return jsonb_build_object('ok', false, 'loi', 'o_khong_hop_le'); end if;
  luot := public._nt_luot_con(v_me, dn);
  if (luot->>'con_trom')::int < 1 then return jsonb_build_object('ok', false, 'loi', 'het_luot') || luot; end if;
  r := public._nt_o_hieu_luc(p_ban, p_o, st->'ruong'->p_o, st->>'hat');
  if r->>'cay' is null then return jsonb_build_object('ok', false, 'loi', 'chua_chin') || luot; end if;
  tt := public._nt_o_tt(r, (st->>'hat') || '|o' || p_o, dn, public._nt_bonus_mua(coalesce((st->>'ngay0')::int, dn), (r->>'d0')::int));
  if tt->>'tt' <> 'chin' then return jsonb_build_object('ok', false, 'loi', 'chua_chin') || luot; end if;
  if not (tt->>'quaHan')::boolean then return jsonb_build_object('ok', false, 'loi', 'gio_vang_cua_chu') || luot; end if;
  if exists (select 1 from nt_ban_viec w where w.chu = p_ban and w.nguoi = v_me and w.o = p_o and w.d0 = (r->>'d0')::int and w.loai in ('trom', 'cho_duoi')) then
    return jsonb_build_object('ok', false, 'loi', 'da_hai') || luot; end if;
  if (tt->>'tromDuoc')::int < 1 then return jsonb_build_object('ok', false, 'loi', 'het_phan') || luot; end if;
  v_tc := coalesce((st->'thu'->'cho'->>'tc')::int, 0);
  select count(*)::int into v_moc from jsonb_array_elements_text(l->'tcMoc') x where x::int <= v_tc;
  if public._nt_bam(p_ban::text || '|trom|' || v_me::text || '|' || p_o || ':' || (r->>'d0')) < (l->'choDuoi'->>v_moc)::double precision then
    insert into nt_ban_viec (chu, nguoi, o, d0, ngay, loai, n) values (p_ban, v_me, p_o, (r->>'d0')::int, dn, 'cho_duoi', 0);
    return jsonb_build_object('ok', true, 'loai', 'cho_duoi', 'n', 0, 'cay', r->>'cay') || public._nt_luot_con(v_me, dn);
  end if;
  v_n := least((tt->>'tromDuoc')::int, (l->>'tromMoiLan')::int);
  insert into nt_ban_viec (chu, nguoi, o, d0, ngay, loai, n) values (p_ban, v_me, p_o, (r->>'d0')::int, dn, 'trom', v_n);
  return jsonb_build_object('ok', true, 'loai', 'trom', 'n', v_n, 'cay', r->>'cay') || public._nt_luot_con(v_me, dn);
end $$;

create or replace function public.fn_nt_viec_ve_toi(p_sau bigint default 0) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  return jsonb_build_object('viec', coalesce((
    select jsonb_agg(jsonb_build_object('id', w.id, 'nguoi', w.nguoi, 'ten', public._nt_ten_ban(w.nguoi), 'o', w.o, 'd0', w.d0, 'ngay', w.ngay, 'loai', w.loai, 'n', w.n) order by w.id)
    from (select * from nt_ban_viec where chu = v_me and id > coalesce(p_sau, 0) order by id limit 200) w), '[]'::jsonb));
end $$;

do $$ declare f text; begin
  foreach f in array array['fn_nt_ban_ds()', 'fn_nt_ban_vuon(uuid)', 'fn_nt_ban_giup(uuid,integer)', 'fn_nt_ban_trom(uuid,integer)', 'fn_nt_viec_ve_toi(bigint)'] loop
    execute format('revoke all on function public.%s from public', f);
    execute format('revoke execute on function public.%s from anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
