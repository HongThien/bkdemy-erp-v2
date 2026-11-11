-- ============================================================================
-- 202611112152 — toi_uu_hs_so_luu_chuoi_nhiem_vu
-- ----------------------------------------------------------------------------
-- VÌ SAO (audit timeout 11/11 — reports/audit-timeout-11-11.md; CLAUDE.md §2.0 "số không realtime ⇒ tính sẵn"):
-- Hai phép tính NỀN của app HS chạy lại từ đầu lịch sử của em ở MỌI lượt gọi, và mỗi lượt mở màn chính gọi chúng nhiều lần:
--   · _chuoi_cua(hs) — chuỗi làm bài: duyệt mọi lượt tự luyện từ ngày đầu tiên. Gọi bởi fn_chuoi_cua_toi (mỗi lần về màn chính),
--     _tt_dat_duoc + _tt_tien_do (thành tựu, ô Thành tựu mỗi lần về màn chính), _bxh_gia_tri A5 (BXH chuỗi: 1 lần cho MỖI em trong khối).
--   · fn_nhiem_vu_hoan_thanh(mon, ym, [hs]) — nhiệm vụ đã xong của 1 tháng: _dht_so_du gọi cho TỪNG tháng từ ngày bật nhiệm vụ;
--     fn_hs_nhiem_vu_cua_toi gọi 2 lần + _dht_so_du; thành tựu TT06 gọi cho từng tháng của mùa (2 hàm × mỗi lần mở).
--   ⇒ mỗi lần em về màn chính, cùng một lịch sử được tính lại ~10–15 lần (fn_thanh_tuu_cho_nhan 479 ms TB, fn_hs_nhiem_vu_cua_toi 248 ms…).
--
-- CÁCH LÀM — bản chụp + cờ bẩn (mẫu mastery_luu_san, mig 202611101644), giữ ĐÚNG nghĩa:
--   1. Bảng hs_so_luu là BẢN CHỤP kết quả của chính hàm tính cũ (đổi tên thành _chuoi_cua_tinh / _nv_hoan_thanh_tinh, thân giữ nguyên từng chữ).
--      Xoá đi dựng lại lúc nào cũng được. Không ai ghi tay.
--   2. Chỉ dùng bản chụp khi: cùng NGÀY VN · chụp chưa quá 30 phút · em KHÔNG bẩn sau lúc chụp · nhóm cấu hình KHÔNG đổi sau lúc chụp.
--      Không đạt ⇒ tính trực tiếp như cũ (rồi chụp lại nếu giao dịch được ghi). ⇒ chụp chỉ quyết định NHANH hay không, không quyết định ĐÚNG.
--   3. Cờ bẩn (trigger BEFORE ROW tên zz_… — chạy SAU các trigger BEFORE khác (trg_bai_lam_thi… có thể sửa NEW), TRƯỚC mọi trigger AFTER như trg_chuoi_moc ⇒ trigger đó luôn thấy số mới):
--        bai_lam (thêm/sửa/xoá dòng đã nộp hoặc vừa chuyển nộp) · bai_lam_cau (của bài đã nộp) · bai_test (đổi loai/mon/luyen_yeu/thu_thach)
--        · hoc_sinh (đổi khối — ngày nghỉ chuỗi theo khối). Toàn hệ: chuoi_ngay_nghi ⇒ nhóm 'chuoi'; nhiem_vu_cau_hinh ⇒ nhóm 'nv'.
--      Nguồn không bắt (sửa code ngưỡng _luot_hoc_that_nguong…) ⇒ hạn 30 phút là lưới; migration đổi ngưỡng nên bump hs_so_moc.
--   4. fn_nhiem_vu_hoan_thanh chỉ chụp khi gọi cho ĐÚNG 1 em (app HS); gọi cho nhiều em (báo cáo ERP) tính trực tiếp như cũ.
--   5. Giao dịch READ ONLY (PostgREST chạy hàm STABLE như vậy) ⇒ chỉ đọc bản chụp, không ghi. Vì vậy 2 hàm app HS hay gọi
--      fn_chuoi_cua_toi, fn_may_man_hs_cua_toi đổi STABLE → VOLATILE (chữ ký giữ nguyên) để lượt gọi được chụp lại.
--   6. _chuoi_cua / fn_nhiem_vu_hoan_thanh đổi STABLE → VOLATILE (vì có thể ghi bản chụp). Chữ ký, quyền giữ nguyên.
-- Đo + so cũ–mới: xem báo cáo phiên 11/11 (ROLLBACK, 12 em).
--
-- MẤT GÌ: không có. Không drop/xoá gì. Chỉ thêm bảng chụp + trigger cờ, đổi tên phần tính sang hàm *_tinh.
-- ============================================================================

-- 1. Bảng chụp + cờ
create table if not exists public.hs_so_luu (
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  khoa text not null,                    -- 'chuoi' · 'nv|<mon>|<ym>'
  ngay date not null,                    -- ngày VN lúc chụp (số phụ thuộc "hôm nay")
  gia_tri jsonb not null,
  tinh_at timestamptz not null,          -- now() của giao dịch chụp (mốc bắt đầu, an toàn với ghi đồng thời)
  primary key (hoc_sinh_id, khoa)
);
create table if not exists public.hs_so_ban (            -- em BẨN: dữ liệu học đổi lúc ban_at
  hoc_sinh_id uuid primary key references public.hoc_sinh(id) on delete cascade,
  ban_at timestamptz not null
);
create table if not exists public.hs_so_moc (            -- cấu hình toàn hệ đổi lúc ban_at ('chuoi' · 'nv')
  nhom text primary key,
  ban_at timestamptz not null
);
comment on table public.hs_so_luu is 'Bản chụp _chuoi_cua / fn_nhiem_vu_hoan_thanh (1 em). Chỉ hàm ghi; đọc chỉ khi sạch. Mig 202611112152.';
alter table public.hs_so_luu enable row level security;
alter table public.hs_so_ban enable row level security;
alter table public.hs_so_moc enable row level security;
revoke all on public.hs_so_luu, public.hs_so_ban, public.hs_so_moc from anon, authenticated;

-- 2. Đọc / ghi bản chụp (security definer, chỉ owner gọi được — hàm bọc tự kiểm quyền trước khi gọi)
create or replace function public._hs_so_lay(p_hs uuid, p_khoa text, p_nhom text)
returns jsonb language sql stable security definer set search_path = public as $$
  select l.gia_tri from hs_so_luu l
  where l.hoc_sinh_id = p_hs and l.khoa = p_khoa
    and l.ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and l.tinh_at > now() - interval '30 minutes'
    and not exists (select 1 from hs_so_ban b where b.hoc_sinh_id = p_hs and b.ban_at >= l.tinh_at)
    and not exists (select 1 from hs_so_moc m where m.nhom = p_nhom and m.ban_at >= l.tinh_at)
$$;

create or replace function public._hs_so_cat(p_hs uuid, p_khoa text, p_gia_tri jsonb)
returns void language plpgsql volatile security definer set search_path = public as $$
begin
  if p_hs is null or p_gia_tri is null or current_setting('transaction_read_only')::boolean then return; end if;
  insert into hs_so_luu (hoc_sinh_id, khoa, ngay, gia_tri, tinh_at)
  values (p_hs, p_khoa, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_gia_tri, now())
  on conflict (hoc_sinh_id, khoa) do update set ngay = excluded.ngay, gia_tri = excluded.gia_tri, tinh_at = excluded.tinh_at;
exception when foreign_key_violation then null;   -- em không còn trong hoc_sinh: bỏ qua, không chặn lượt đọc
end $$;

create or replace function public._hs_so_danh_ban(p_hs uuid)
returns void language sql volatile security definer set search_path = public as $$
  insert into hs_so_ban (hoc_sinh_id, ban_at)
  select p_hs, clock_timestamp() where p_hs is not null and exists (select 1 from hoc_sinh where id = p_hs)
  on conflict (hoc_sinh_id) do update set ban_at = clock_timestamp()
$$;

revoke all on function public._hs_so_lay(uuid, text, text) from public, anon, authenticated;
revoke all on function public._hs_so_cat(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public._hs_so_danh_ban(uuid) from public, anon, authenticated;

-- 3. Trigger cờ bẩn
create or replace function public._hs_so_ban_tg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if TG_TABLE_NAME = 'bai_lam' then
    if TG_OP in ('UPDATE', 'DELETE') and old.trang_thai = 'da_nop' and (TG_OP = 'DELETE'
         or (new.trang_thai, new.nop_at, new.bat_dau_at, new.hoc_sinh_id, new.bai_test_id)
            is distinct from (old.trang_thai, old.nop_at, old.bat_dau_at, old.hoc_sinh_id, old.bai_test_id)) then
      perform public._hs_so_danh_ban(old.hoc_sinh_id);
    end if;
    if TG_OP in ('INSERT', 'UPDATE') and new.trang_thai = 'da_nop' and (TG_OP = 'INSERT'
         or (new.trang_thai, new.nop_at, new.bat_dau_at, new.hoc_sinh_id, new.bai_test_id)
            is distinct from (old.trang_thai, old.nop_at, old.bat_dau_at, old.hoc_sinh_id, old.bai_test_id)) then
      perform public._hs_so_danh_ban(new.hoc_sinh_id);
    end if;
  elsif TG_TABLE_NAME = 'bai_lam_cau' then
    if TG_OP in ('UPDATE', 'DELETE') and (TG_OP = 'DELETE'
         or (new.verdict, new.cham_at, new.bai_lam_id, new.bai_test_cau_id) is distinct from (old.verdict, old.cham_at, old.bai_lam_id, old.bai_test_cau_id)) then
      perform public._hs_so_danh_ban(bl.hoc_sinh_id) from bai_lam bl where bl.id = old.bai_lam_id and bl.trang_thai = 'da_nop';
    end if;
    if TG_OP in ('INSERT', 'UPDATE') and (TG_OP = 'INSERT'
         or (new.verdict, new.cham_at, new.bai_lam_id, new.bai_test_cau_id) is distinct from (old.verdict, old.cham_at, old.bai_lam_id, old.bai_test_cau_id)) then
      perform public._hs_so_danh_ban(bl.hoc_sinh_id) from bai_lam bl where bl.id = new.bai_lam_id and bl.trang_thai = 'da_nop';
    end if;
  elsif TG_TABLE_NAME = 'bai_test' then
    if (new.loai, new.mon, new.luyen_yeu, new.thu_thach) is distinct from (old.loai, old.mon, old.luyen_yeu, old.thu_thach) then
      perform public._hs_so_danh_ban(bl.hoc_sinh_id) from bai_lam bl where bl.bai_test_id = new.id and bl.trang_thai = 'da_nop';
    end if;
  elsif TG_TABLE_NAME = 'hoc_sinh' then
    if new.khoi is distinct from old.khoi then perform public._hs_so_danh_ban(new.id); end if;
  end if;
  if TG_OP = 'DELETE' then return old; end if;
  return new;
end $$;

create or replace function public._hs_so_moc_tg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into hs_so_moc (nhom, ban_at) values (TG_ARGV[0], clock_timestamp())
  on conflict (nhom) do update set ban_at = clock_timestamp();
  return null;
end $$;

create or replace trigger zz_hs_so_ban before insert or update or delete on public.bai_lam
  for each row execute function public._hs_so_ban_tg();
create or replace trigger zz_hs_so_ban before insert or update or delete on public.bai_lam_cau
  for each row execute function public._hs_so_ban_tg();
create or replace trigger zz_hs_so_ban before update of loai, mon, luyen_yeu, thu_thach on public.bai_test
  for each row execute function public._hs_so_ban_tg();
create or replace trigger zz_hs_so_ban before update of khoi on public.hoc_sinh
  for each row execute function public._hs_so_ban_tg();
create or replace trigger a_hs_so_moc after insert or update or delete or truncate on public.chuoi_ngay_nghi
  for each statement execute function public._hs_so_moc_tg('chuoi');
create or replace trigger a_hs_so_moc after insert or update or delete or truncate on public.nhiem_vu_cau_hinh
  for each statement execute function public._hs_so_moc_tg('nv');

-- 4. Phần TÍNH giữ nguyên từng chữ (pg_get_functiondef 11/11), chỉ đổi tên
CREATE OR REPLACE FUNCTION public._chuoi_cua_tinh(p_hs uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_khoi text;
  v_dem jsonb;            -- {ngay: số lượt học thật}
  v_nghi date[];
  v_start date;
  d date;
  c int;
  v_extra int;
  v_tt jsonb := '{}';     -- {ngay: trạng thái}
  v_cho date[] := '{}';   -- ngày lỡ đang chờ sửa (cũ → mới)
  v_the jsonb := '{}';    -- {yyyy-mm: số thẻ đã dùng}
  v_thang text;
  p date;
  v_so int := 0;
  v_ky_luc int := 0;
  v_chay int := 0;
  s text;
  v_moc int;
  v_bay jsonb := '[]';
  v_luot_hn int;
  v_bat_dau date;          -- ngày đầu của chuỗi hiện tại (khoá mốc: mỗi chuỗi mỗi mốc 1 lần)
begin
  select h.khoi into v_khoi from hoc_sinh h where h.id = p_hs;
  select coalesce(jsonb_object_agg(x.ngay::text, x.n), '{}'), min(x.ngay) into v_dem, v_start
    from (select l.ngay, count(*) n from public._luot_hoc_that(p_hs, '-infinity', 'infinity') l where l.tinh group by l.ngay) x;
  select coalesce(array_agg(distinct g::date), '{}') into v_nghi
    from chuoi_ngay_nghi n, generate_series(n.tu, n.den, interval '1 day') g
    where n.xoa_at is null and (n.khoi = '{}' or v_khoi = any(n.khoi));
  v_luot_hn := coalesce((v_dem->>v_today::text)::int, 0);

  if v_start is not null then
    d := v_start;
    while d <= v_today loop
      c := coalesce((v_dem->>d::text)::int, 0);
      -- lượt thừa hôm nay sửa ngày lỡ cũ nhất còn trong cửa sổ 48 giờ
      v_extra := case when d = any(v_nghi) then c else greatest(c - 1, 0) end;
      while v_extra > 0 and cardinality(v_cho) > 0 and d - v_cho[1] <= 2 loop
        v_tt := v_tt || jsonb_build_object(v_cho[1]::text, 'sua');
        v_cho := v_cho[2:];
        v_extra := v_extra - 1;
      end loop;
      -- trạng thái chính ngày d
      if c >= 1 then v_tt := v_tt || jsonb_build_object(d::text, 'hoc');
      elsif d = any(v_nghi) then v_tt := v_tt || jsonb_build_object(d::text, 'nghi');
      elsif d = v_today then v_tt := v_tt || jsonb_build_object(d::text, 'trong');
      else v_tt := v_tt || jsonb_build_object(d::text, 'cho_sua'); v_cho := v_cho || d;
      end if;
      -- ngày lỡ hết cửa sổ (đã qua trọn d = p+2) ⇒ thẻ đóng băng hoặc đứt
      while cardinality(v_cho) > 0 and d - v_cho[1] >= 2 and d < v_today loop
        p := v_cho[1]; v_cho := v_cho[2:];
        v_thang := to_char(p, 'YYYY-MM');
        if coalesce((v_the->>v_thang)::int, 0) < 2 then
          v_the := v_the || jsonb_build_object(v_thang, coalesce((v_the->>v_thang)::int, 0) + 1);
          v_tt := v_tt || jsonb_build_object(p::text, 'dong_bang');
        else
          v_tt := v_tt || jsonb_build_object(p::text, 'dut');
        end if;
      end loop;
      d := d + 1;
    end loop;

    -- kỷ lục: chạy xuôi; chuỗi hiện tại: phần chạy cuối (ngày hoc/sua cộng, nghi/dong_bang/cho_sua/trong giữ, dut cắt)
    d := v_start;
    while d <= v_today loop
      s := v_tt->>d::text;
      if s in ('hoc', 'sua') then
        if v_chay = 0 then v_bat_dau := d; end if;
        v_chay := v_chay + 1; v_ky_luc := greatest(v_ky_luc, v_chay);
      elsif s = 'dut' then v_chay := 0; v_bat_dau := null;
      end if;
      d := d + 1;
    end loop;
    v_so := v_chay;
  end if;

  select min(m) into v_moc from unnest(array[3, 7, 14, 30, 50, 100, 200, 365]) m where m > v_so;
  for d in select generate_series(v_today - 6, v_today, interval '1 day')::date loop
    s := coalesce(v_tt->>d::text, case when d = v_today then 'trong' else 'truoc' end);
    v_bay := v_bay || jsonb_build_object('ngay', d, 'trang_thai',
      case s when 'sua' then 'hoc' when 'truoc' then 'trong' else s end);
  end loop;

  return jsonb_build_object(
    'so_ngay', v_so,
    'bat_dau', case when v_so > 0 then v_bat_dau end,
    'hom_nay_da_tinh', coalesce(v_tt->>v_today::text, '') = 'hoc',
    'luot_hom_nay', v_luot_hn,
    'ky_luc', v_ky_luc,
    'the_dong_bang', 2 - coalesce((v_the->>to_char(v_today, 'YYYY-MM'))::int, 0),
    'ngay_cho_sua', to_jsonb(v_cho),
    'luot_can_bu', cardinality(v_cho),               -- hôm nay cần thêm bấy nhiêu lượt (ngoài lượt giữ hôm nay) để sửa hết
    'sua_duoc_den', case when cardinality(v_cho) > 0
      then to_jsonb(((v_cho[1] + 3)::timestamp at time zone 'Asia/Ho_Chi_Minh')) end,   -- hết ngày p+2 giờ VN
    'moc_tiep', v_moc,
    'bay_ngay', v_bay
  );
end $function$;

CREATE OR REPLACE FUNCTION public._nv_hoan_thanh_tinh(p_mon text, p_ym text, p_hs uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(hoc_sinh_id uuid, ma text, tang text, xong_ngay date, so integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  c record;
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_den date; v_tu date; v_hs uuid[];
begin
  select * into c from nhiem_vu_cau_hinh where mon = p_mon and bat;
  if c.mon is null then return; end if;
  v_den := least(v_me, v_nay);
  if v_den < c.bat_dau or v_den < v_ms then return; end if;
  v_tu := greatest(v_ms, c.bat_dau);
  v_hs := coalesce(p_hs, (select array_agg(distinct hl.hoc_sinh_id) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.trang_thai = 'dang_hoc' and l.mon = p_mon));
  if v_hs is null then return; end if;
  return query
  with luot as (
    select d.hoc_sinh_id, d.ngay, d.nop_at, least(4, (extract(day from d.ngay)::int - 1) / 7 + 1) as w
    from public._nv_luot_dat(p_mon, v_hs, v_tu, v_den, c.dat_ti_le, c.lan_ngay) d
  ),
  theo_ngay as (select l.hoc_sinh_id, l.ngay, count(*)::int as n from luot l group by 1, 2),
  w1 as (   -- có lượt đạt ở w1_ngay ngày khác nhau trong tuần: xong vào ngày thứ w1_ngay
    select z.hoc_sinh_id, z.w, (array_agg(z.ngay order by z.ngay))[c.w1_ngay] as xong
    from (select distinct l.hoc_sinh_id, l.w, l.ngay from luot l) z group by 1, 2 having count(*) >= c.w1_ngay
  ),
  w2 as (   -- tổng w2_luot lượt đạt trong tuần: xong vào ngày của lượt thứ w2_luot
    select l.hoc_sinh_id, l.w, (array_agg(l.ngay order by l.nop_at))[c.w2_luot] as xong
    from luot l group by 1, 2 having count(*) >= c.w2_luot
  ),
  m1 as (
    select z.hoc_sinh_id, (array_agg(z.ngay order by z.ngay))[c.m1_ngay] as xong
    from (select distinct l.hoc_sinh_id, l.ngay from luot l) z group by 1 having count(*) >= c.m1_ngay
  )
  select t.hoc_sinh_id, 'N'::text, 'ngay'::text, t.ngay, t.n from theo_ngay t
  union all select w1.hoc_sinh_id, 'W1', 'tuan', w1.xong, 1 from w1
  union all select w2.hoc_sinh_id, 'W2', 'tuan', w2.xong, 1 from w2
  union all select m1.hoc_sinh_id, 'M1', 'thang', m1.xong, 1 from m1;
end $function$;

revoke all on function public._chuoi_cua_tinh(uuid) from public, anon, authenticated;
revoke all on function public._nv_hoan_thanh_tinh(text, text, uuid[]) from public, anon;
grant execute on function public._nv_hoan_thanh_tinh(text, text, uuid[]) to authenticated;   -- như fn_nhiem_vu_hoan_thanh (ERP gọi trực tiếp, invoker)

-- 5. Hàm bọc: đọc chụp nếu sạch, không thì tính + chụp
create or replace function public._chuoi_cua(p_hs uuid)
returns jsonb language plpgsql volatile as $function$
declare v jsonb; v_dung boolean;
begin
  v_dung := p_hs is not null and has_function_privilege('public._hs_so_lay(uuid, text, text)', 'execute');
  if v_dung then
    v := public._hs_so_lay(p_hs, 'chuoi', 'chuoi');
    if v is not null then return v; end if;
  end if;
  v := public._chuoi_cua_tinh(p_hs);
  if v_dung then perform public._hs_so_cat(p_hs, 'chuoi', v); end if;
  return v;
end $function$;

create or replace function public.fn_nhiem_vu_hoan_thanh(p_mon text, p_ym text, p_hs uuid[] default null::uuid[])
returns table(hoc_sinh_id uuid, ma text, tang text, xong_ngay date, so integer)
language plpgsql volatile as $function$
declare v jsonb; v_k text;
begin
  if p_hs is null or cardinality(p_hs) <> 1 or p_hs[1] is null
     or not has_function_privilege('public._hs_so_lay(uuid, text, text)', 'execute') then
    return query select * from public._nv_hoan_thanh_tinh(p_mon, p_ym, p_hs);
    return;
  end if;
  v_k := 'nv|' || coalesce(p_mon, '') || '|' || coalesce(p_ym, '');
  v := public._hs_so_lay(p_hs[1], v_k, 'nv');
  if v is null then
    select coalesce(jsonb_agg(jsonb_build_array(t.hoc_sinh_id, t.ma, t.tang, t.xong_ngay, t.so) order by t.n), '[]'::jsonb) into v
    from public._nv_hoan_thanh_tinh(p_mon, p_ym, p_hs) with ordinality t(hoc_sinh_id, ma, tang, xong_ngay, so, n);
    perform public._hs_so_cat(p_hs[1], v_k, v);
  end if;
  return query select (e->>0)::uuid, e->>1, e->>2, (e->>3)::date, (e->>4)::integer
               from jsonb_array_elements(v) with ordinality x(e, n) order by x.n;
end $function$;

-- 6. Hàm app HS hay gọi: STABLE → VOLATILE để lượt gọi qua PostgREST được ghi bản chụp (thân giữ nguyên)
alter function public.fn_chuoi_cua_toi() volatile;
alter function public.fn_may_man_hs_cua_toi() volatile;
