-- ============================================================================
-- 202610141527 — ta_chot_ky_luong
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-cham-cong-ta.md §10 bước 6): bảng lương TA đang là TẠM TÍNH, tính lại mỗi lần mở ⇒ ai sửa công /
--   đổi đơn giá / phân công sau khi trả lương là con số tháng cũ đổi theo. Cần một BẢN CHỐT bất biến cho mỗi kỳ:
--   · Chốt kỳ = chụp nguyên kết quả _ta_luong_tinh của tháng vào bảng chỉ-thêm (ta_luong_ky + ta_luong_ky_dong).
--   · Chỉ chốt được SAU hạn duyệt/sửa (ngày `han_duyet_ngay` của tháng sau, hoặc hạn đợt khai lùi nếu muộn hơn) và
--     khi không còn ca/việc chờ duyệt, không còn ca quên checkout.
--   · Kỳ đã chốt ⇒ KHOÁ: không thêm/sửa/xoá công (ta_cham_cong, ta_cong_viec) của tháng đó, không thêm đơn giá có hiệu
--     lực lùi về tháng đó. Muốn sửa ⇒ "mở lại kỳ" (bắt buộc lý do): bản cũ KHÔNG xoá, chỉ ghi lúc/ai/lý do mở lại;
--     chốt lần sau thành lần 2 (giữ cả hai để truy lại — CLAUDE.md §4 immutable append + state-log).
--   · TA xem phiếu của mình: đã chốt ⇒ đọc bản chốt; chưa chốt ⇒ tạm tính (fn_ta_luong_ky thay fn_ta_luong_thang ở app).
--   · KHÔNG chốt được tháng trước mốc bắt đầu chấm công trên ERP (_ta_moc_cham_cong, hiện 01/10/2026): tháng 9 lương
--     tính ngoài ERP (bản V6) — trên ERP chỉ có phần BTVN nên bản chốt sẽ sai (đo: 6,06 triệu so với 28,26 triệu).
-- MẤT GÌ (Luật xoá): không có. Chỉ thêm bảng / hàm / trigger. Không sửa hàm cũ.
-- ============================================================================

-- ── 1. Bảng ──────────────────────────────────────────────────────────────────
create table ta_luong_ky (
  id            uuid primary key default gen_random_uuid(),
  ky            date not null check (ky = date_trunc('month', ky)::date),
  lan           integer not null check (lan >= 1),
  chot_at       timestamptz not null default now(),
  chot_boi      uuid references nhan_su(id),
  ghi_chu       text not null default '',
  so_ta         integer not null,
  tong_net      numeric not null,
  mo_lai_at     timestamptz,              -- NULL = bản chốt đang hiệu lực
  mo_lai_boi    uuid references nhan_su(id),
  ly_do_mo_lai  text,
  unique (ky, lan),
  check ((mo_lai_at is null) = (ly_do_mo_lai is null))
);
create unique index ta_luong_ky_hieu_luc on ta_luong_ky (ky) where mo_lai_at is null;
comment on table ta_luong_ky is 'Mỗi lần chốt lương TA một kỳ. Bất biến; mở lại = ghi mo_lai_* (một lần), chốt lại = lần mới.';

create table ta_luong_ky_dong (
  ky_id          uuid not null references ta_luong_ky(id),
  nhan_su_id     uuid not null references nhan_su(id),
  ho_ten         text not null,
  package_lop    numeric not null,
  bo_tro_gio     numeric not null,
  bo_tro_tien    numeric not null,
  ngoai_package  numeric not null,
  gross          numeric not null,
  tien_phat      numeric not null,
  net            numeric not null,
  chi_tiet       jsonb not null,
  primary key (ky_id, nhan_su_id)
);
comment on table ta_luong_ky_dong is 'Bản chụp bảng lương từng TA tại lúc chốt (cùng cột với fn_ta_luong_thang). Bất biến.';

-- Bất biến: dòng chốt không sửa/xoá; đầu kỳ chỉ được ghi MỞ LẠI một lần.
create or replace function _ta_luong_ky_bat_bien() returns trigger language plpgsql as $$
begin
  if tg_table_name = 'ta_luong_ky_dong' or tg_op = 'DELETE' then
    raise exception 'Bản chốt lương bất biến — mở lại kỳ rồi chốt lần mới';
  end if;
  if old.mo_lai_at is not null or new.mo_lai_at is null
     or (new.id, new.ky, new.lan, new.chot_at, new.chot_boi, new.ghi_chu, new.so_ta, new.tong_net)
        is distinct from (old.id, old.ky, old.lan, old.chot_at, old.chot_boi, old.ghi_chu, old.so_ta, old.tong_net) then
    raise exception 'Bản chốt lương bất biến — chỉ được ghi mở lại một lần';
  end if;
  return new;
end $$;
create trigger ta_luong_ky_bat_bien before update or delete on ta_luong_ky for each row execute function _ta_luong_ky_bat_bien();
create trigger ta_luong_ky_dong_bat_bien before update or delete on ta_luong_ky_dong for each row execute function _ta_luong_ky_bat_bien();

-- ── 2. Khoá kỳ đã chốt ───────────────────────────────────────────────────────
create or replace function _ta_ky_da_chot(p_ngay date) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from ta_luong_ky k where k.ky = date_trunc('month', p_ngay)::date and k.mo_lai_at is null)
$$;

create or replace function _ta_khoa_ky() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op <> 'DELETE' and public._ta_ky_da_chot(new.ngay)) or (tg_op <> 'INSERT' and public._ta_ky_da_chot(old.ngay)) then
    raise exception 'Tháng % đã chốt lương — cần mở lại kỳ trước khi sửa công',
      to_char(case when tg_op = 'DELETE' then old.ngay else new.ngay end, 'MM/YYYY');
  end if;
  return coalesce(new, old);
end $$;
create trigger ta_cham_cong_khoa_ky before insert or update or delete on ta_cham_cong for each row execute function _ta_khoa_ky();
create trigger ta_cong_viec_khoa_ky before insert or update or delete on ta_cong_viec for each row execute function _ta_khoa_ky();

-- Đơn giá có hiệu lực ≤ đầu một kỳ đã chốt sẽ làm lương kỳ đó (tính lại) lệch bản chốt ⇒ chặn.
create or replace function _ta_don_gia_khoa_ky() returns trigger language plpgsql security definer set search_path = public as $$
declare v_ky date;
begin
  select max(k.ky) into v_ky from ta_luong_ky k where k.mo_lai_at is null and k.ky >= new.hieu_luc_tu;
  if v_ky is not null then
    raise exception 'Giá hiệu lực từ % rơi vào tháng % đã chốt lương — chọn ngày hiệu lực sau tháng đó hoặc mở lại kỳ',
      to_char(new.hieu_luc_tu, 'DD/MM/YYYY'), to_char(v_ky, 'MM/YYYY');
  end if;
  return new;
end $$;
create trigger ta_don_gia_khoa_ky before insert on ta_don_gia for each row execute function _ta_don_gia_khoa_ky();

-- ── 3. Tình trạng kỳ (điều kiện chốt) ────────────────────────────────────────
create or replace function _ta_ky_tinh_trang(p_ky date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_ky date := date_trunc('month', p_ky)::date;
        v_den date := (date_trunc('month', p_ky) + interval '1 month' - interval '1 day')::date;
        v_han int; v_mo_tu timestamptz; v_dot timestamptz;
        v_ca int; v_viec int; v_quen int; k ta_luong_ky; v_moc date := public._ta_moc_cham_cong();
begin
  v_han := coalesce((select d.gia_tri::int from ta_don_gia d where d.ma = 'han_duyet_ngay' and d.hieu_luc_tu <= v_ky
                      order by d.hieu_luc_tu desc limit 1), 3);
  -- chốt được từ 00:00 ngày (hạn + 1) tháng sau, giờ VN; đợt khai lùi phủ kỳ này có hạn muộn hơn thì theo đợt
  v_mo_tu := ((v_ky + interval '1 month' + make_interval(days => v_han))::timestamp at time zone 'Asia/Ho_Chi_Minh');
  select max(d.han) into v_dot from ta_dot_khai_bu d where d.tu <= v_den and d.den >= v_ky;
  if v_dot is not null and v_dot > v_mo_tu then v_mo_tu := v_dot; end if;
  select count(*) into v_ca from ta_cham_cong c where c.ngay between v_ky and v_den and c.duyet = 'cho_duyet';
  select count(*) into v_viec from ta_cong_viec v where v.ngay between v_ky and v_den and v.trang_thai = 'cho_duyet';
  select count(*) into v_quen from ta_cham_cong c where c.ngay between v_ky and v_den and c.ra_at is null and c.ra_chot is null and c.duyet <> 'tu_choi';
  select * into k from ta_luong_ky where ky = v_ky and mo_lai_at is null;
  return jsonb_build_object(
    'ky', v_ky, 'da_chot', k.id is not null, 'lan', k.lan, 'chot_at', k.chot_at,
    'chot_boi', (select ho_ten from nhan_su where id = k.chot_boi), 'so_ta', k.so_ta, 'tong_net', k.tong_net,
    'mo_chot_tu', v_mo_tu, 'cho_duyet_ca', v_ca, 'cho_duyet_viec', v_viec, 'quen_checkout', v_quen,
    'moc_cham_cong', v_moc, 'truoc_moc', v_den < v_moc,
    'co_the_chot', k.id is null and v_den >= v_moc and now() >= v_mo_tu and v_ca + v_viec + v_quen = 0,
    'lich_su', coalesce((select jsonb_agg(jsonb_build_object('lan', h.lan, 'chot_at', h.chot_at,
                   'chot_boi', (select ho_ten from nhan_su where id = h.chot_boi), 'tong_net', h.tong_net, 'so_ta', h.so_ta,
                   'ghi_chu', h.ghi_chu, 'mo_lai_at', h.mo_lai_at, 'mo_lai_boi', (select ho_ten from nhan_su where id = h.mo_lai_boi),
                   'ly_do_mo_lai', h.ly_do_mo_lai) order by h.lan desc)
                 from ta_luong_ky h where h.ky = v_ky), '[]'::jsonb));
end $$;

create or replace function fn_ta_ky_trang_thai(p_ky date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem chốt lương'; end if;
  return public._ta_ky_tinh_trang(p_ky);
end $$;

-- ── 4. Chốt / mở lại ─────────────────────────────────────────────────────────
create or replace function fn_ta_chot_ky(p_ky date, p_ghi_chu text default '') returns integer
language plpgsql security definer set search_path = public as $$
declare v_ky date := date_trunc('month', p_ky)::date; t jsonb; v_rows jsonb; v_id uuid; v_lan int;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền chốt lương'; end if;
  perform pg_advisory_xact_lock(hashtext('ta_chot_ky'), extract(epoch from v_ky)::int);   -- hai người bấm cùng lúc
  t := public._ta_ky_tinh_trang(v_ky);
  if (t->>'da_chot')::boolean then raise exception 'Tháng % đã chốt (lần %)', to_char(v_ky, 'MM/YYYY'), t->>'lan'; end if;
  if (t->>'truoc_moc')::boolean then
    raise exception 'Tháng % trước khi có chấm công trên ERP (bắt đầu %) — lương tháng này tính ngoài ERP, không chốt ở đây',
      to_char(v_ky, 'MM/YYYY'), to_char((t->>'moc_cham_cong')::date, 'DD/MM/YYYY');
  end if;
  if now() < (t->>'mo_chot_tu')::timestamptz then
    raise exception 'Chưa hết hạn duyệt/sửa công — chốt được từ %',
      to_char(((t->>'mo_chot_tu')::timestamptz at time zone 'Asia/Ho_Chi_Minh'), 'HH24:MI DD/MM/YYYY');
  end if;
  if (t->>'cho_duyet_ca')::int + (t->>'cho_duyet_viec')::int + (t->>'quen_checkout')::int > 0 then
    raise exception 'Còn % ca và % việc chờ duyệt, % ca quên checkout — xử lý xong mới chốt',
      t->>'cho_duyet_ca', t->>'cho_duyet_viec', t->>'quen_checkout';
  end if;
  select coalesce(jsonb_agg(to_jsonb(l)), '[]'::jsonb) into v_rows from public._ta_luong_tinh(v_ky, null) l;
  select coalesce(max(lan), 0) + 1 into v_lan from ta_luong_ky where ky = v_ky;
  insert into ta_luong_ky (ky, lan, chot_boi, ghi_chu, so_ta, tong_net)
  values (v_ky, v_lan, public.current_nhan_su_id(), coalesce(p_ghi_chu, ''), jsonb_array_length(v_rows),
          coalesce((select sum((e->>'net')::numeric) from jsonb_array_elements(v_rows) e), 0))
  returning id into v_id;
  insert into ta_luong_ky_dong (ky_id, nhan_su_id, ho_ten, package_lop, bo_tro_gio, bo_tro_tien, ngoai_package, gross, tien_phat, net, chi_tiet)
  select v_id, r.nhan_su_id, r.ho_ten, r.package_lop, r.bo_tro_gio, r.bo_tro_tien, r.ngoai_package, r.gross, r.tien_phat, r.net, r.chi_tiet
    from jsonb_to_recordset(v_rows) as r(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric,
                                          ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb);
  return v_lan;
end $$;

create or replace function fn_ta_mo_lai_ky(p_ky date, p_ly_do text) returns void
language plpgsql security definer set search_path = public as $$
declare v_ky date := date_trunc('month', p_ky)::date;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền mở lại kỳ lương'; end if;
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Mở lại kỳ phải ghi lý do'; end if;
  update ta_luong_ky set mo_lai_at = now(), mo_lai_boi = public.current_nhan_su_id(), ly_do_mo_lai = btrim(p_ly_do)
   where ky = v_ky and mo_lai_at is null;
  if not found then raise exception 'Tháng % chưa chốt', to_char(v_ky, 'MM/YYYY'); end if;
end $$;

-- ── 5. Đọc lương theo kỳ: đã chốt ⇒ bản chốt; chưa ⇒ tạm tính (thay fn_ta_luong_thang ở màn) ───
create or replace function fn_ta_luong_ky(p_ky date, p_ns uuid default null)
returns table(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric,
              ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb,
              da_chot boolean, lan integer, chot_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare v_ky date := date_trunc('month', p_ky)::date; k ta_luong_ky;
begin
  if not (public.co_chuc_nang('ta_luong') or (p_ns is not null and p_ns = public.current_nhan_su_id())) then
    raise exception 'Không có quyền xem lương trợ giảng';
  end if;
  select * into k from ta_luong_ky where ky = v_ky and mo_lai_at is null;
  if k.id is not null then
    return query
    select d.nhan_su_id, d.ho_ten, d.package_lop, d.bo_tro_gio, d.bo_tro_tien, d.ngoai_package, d.gross, d.tien_phat, d.net, d.chi_tiet,
           true, k.lan, k.chot_at
      from ta_luong_ky_dong d where d.ky_id = k.id and (p_ns is null or d.nhan_su_id = p_ns)
     order by d.ho_ten;
  else
    return query
    select l.nhan_su_id, l.ho_ten, l.package_lop, l.bo_tro_gio, l.bo_tro_tien, l.ngoai_package, l.gross, l.tien_phat, l.net, l.chi_tiet,
           false, null::integer, null::timestamptz
      from public._ta_luong_tinh(v_ky, p_ns) l;
  end if;
end $$;

-- ── 6. RLS + quyền thực thi ──────────────────────────────────────────────────
alter table ta_luong_ky      enable row level security;
alter table ta_luong_ky_dong enable row level security;
create policy ta_luong_ky_doc on ta_luong_ky for select to authenticated using (la_thanh_vien());
create policy ta_luong_ky_dong_doc on ta_luong_ky_dong for select to authenticated
  using (co_chuc_nang('ta_luong') or nhan_su_id = current_nhan_su_id());

revoke execute on function _ta_ky_tinh_trang(date), _ta_ky_da_chot(date) from public, anon, authenticated;
revoke execute on function fn_ta_ky_trang_thai(date), fn_ta_chot_ky(date, text), fn_ta_mo_lai_ky(date, text), fn_ta_luong_ky(date, uuid)
  from public, anon;
grant execute on function fn_ta_ky_trang_thai(date), fn_ta_chot_ky(date, text), fn_ta_mo_lai_ky(date, text), fn_ta_luong_ky(date, uuid)
  to authenticated;
