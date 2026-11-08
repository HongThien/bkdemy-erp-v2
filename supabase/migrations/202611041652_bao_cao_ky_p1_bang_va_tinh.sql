-- ============================================================================
-- 202611041652 — bao_cao_ky_p1_bang_va_tinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Báo cáo HỌC KÌ gửi phụ huynh (spec-bao-cao-ky.md, Thùy chốt 04/11; "làm tiếp cái report phụ huynh"). Đợt này = Phần A:
--   kì là đối tượng (`ky_hoc`), báo cáo (HS × môn × kì) lưu phần GV nhập + SNAPSHOT jsonb lúc Công bố (đọc lại không tính lại),
--   một hàm tính DUY NHẤT `fn_bc_ky_tinh` trả jsonb TỰ ĐỦ (app PH + PDF dựng ngoài ERP cùng đọc một snapshot).
--   Quyết định kỹ thuật tự chốt (R2), ghi lại để Thùy soát (Phần B của spec):
--   · Hoàn thành chủ đề/chuyên đề TÁI DÙNG nguồn câu của Dashboard học tập `_dbht_cau` (mỗi câu nặng như nhau: điểm đạt/tối đa,
--     không điểm ⇒ Đ 1 · nửa 0,5 · S 0; mọi kênh ET · MT · BTVN · bài app; thứ tự "gần nhất" y fn_dbht_bang) — không đẻ công thức
--     thứ hai. Chủ đề 20 câu / chuyên đề 10 câu gần nhất trong 45 ngày lùi từ min(cuối kì, hôm nay), cắt theo TỪNG đơn vị.
--     Đơn vị liệt kê = mọi chủ đề/chuyên đề em CÓ câu trong kì; không câu nào trong 45 ngày ⇒ "chưa đo" (p null), không phải 0%.
--   · `_dbht_cau` thêm nhánh KHTN (bản đồ mới KHTN, `_khtn_do_o_bdm`) — trước đây câu KHTN rơi hết (chỉ quy Đại/HGT) ⇒ báo cáo kì
--     KHTN sẽ trống. Dashboard học tập (fn_dbht_bang) không đổi: cột của nó join bảng bản đồ Toán nên mã KHTN không lên cột.
--   · Một LẦN THI = (loại MT | Khảo sát, tháng thi, khối, môn) gom mọi `ky_thi` của các lớp (dữ liệu thật: ky_thi tạo theo lớp).
--     Tháng thi: MT ngày 1–10 tính cho tháng trước (cửa sổ 25/M–10/M+1 như report tháng), khảo sát theo tháng lịch. Thuộc kì nếu
--     tháng thi nằm trong [tu_thang, den_thang]. Điểm em trong lần = TB các ky_thi em thi trong lần đó (điểm chính, không thi lại).
--   · Hạng + TB từng lần = trong các em ĐÃ THI lần đó cùng khối (không thi ⇒ không vào mẫu — spec A4/A6b, khác hạng MT tháng cộng 0).
--     Hạng cả kì = xếp theo TB các lần em đã thi, trong các em cùng khối có ≥1 lần thi trong kì; kèm so_lan.
--   · Chuyên cần = buổi THƯỜNG không huỷ của lớp môn đó, ngày trong kì và ≤ hôm nay: vắng / vắng phép / có mặt.
--   · Quyền: tạo/sửa kì = admin hệ thống (spec: "người tạo kì = Thùy"); nhập + công bố = mọi nhân sự (như report tháng). Đổi được sau.
--   · Đổi phần nhập khi đã công bố bị chặn ở trigger (phải Mở lại); mọi đổi state ghi `bao_cao_ph_ky_log` bằng trigger (§4).
--
-- MẤT GÌ (Luật xoá): không — thêm bảng/hàm/trigger; thay thân `_dbht_cau` (giữ chữ ký + cột; chỉ THÊM dòng câu KHTN).
-- ============================================================================

-- ── 0. Nguồn câu chung (Dashboard học tập) + nhánh KHTN ─────────────────────────────────────────────────────────────────
create or replace function public._dbht_cau(p_hs uuid[], p_tu date, p_mon text)
returns table(hoc_sinh_id uuid, ngay date, t timestamptz, kenh text, luot text, thu_tu integer, ma_cau text, gia_tri numeric,
              dang_bai_id text, nhom_id text, chuyen_de_id text, chu_de_id text, ten_dang text)
language sql stable set search_path to 'public' as $function$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy (+ bản sao câu app — ngày = ngày nộp)
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           sp.hinh_baitoan_id as bt_id,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang, null::uuid,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  k as (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd, bt_id from m),
  -- HÌNH: nhận diện + quy về mô hình / bài học
  hk as (
    select k.kc, k.kd, k.bt_id,
           coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id) as mh_id,
           coalesce(hc.dang_chinh, hb.ma_bai) as hh_bai
      from k
      left join hinh_baitoan bt1 on bt1.id = k.bt_id
      left join hinh_baitoan bt2 on k.bt_id is null and bt2.ma = nullif(k.kd, '')
      left join hinh_hoc_cau_hoi hc on hc.ma_cau = nullif(k.kc, '')
      left join hinh_hoc_bai hb on hb.ma_bai = nullif(k.kd, '')
     where bt1.id is not null or bt2.id is not null or hc.ma_cau is not null or hb.ma_bai is not null
  ),
  hcap as (
    select hk.kc, hk.kd, hk.bt_id,
           coalesce('H:' || mh.id::text, 'HINH') as nhom_id,
           coalesce('H:' || mh.nhom_mh_id, 'HINH') as chuyen_de_id,
           coalesce('H:' || coalesce(nmh.chu_de_id, mh.chu_de_id, hhb.chu_de_id), 'HINH') as chu_de_id,
           coalesce(mh.ten, hhb.ten_bai, 'Hình') as ten_dang
      from hk
      left join hinh_mo_hinh mh on mh.id = hk.mh_id
      left join hinh_nhom_mo_hinh nmh on nmh.id = mh.nhom_mh_id
      left join hinh_hoc_bai hhb on hhb.ma_bai = hk.hh_bai
  ),
  -- KHTN (04/11): dạng bài bản đồ mới KHTN — cùng luật quy câu với tổng quan HS (`_khtn_do_o_bdm`)
  kk as (
    select k.kc, k.kd, k.bt_id, public._khtn_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._khtn_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- ĐẠI + HGT: dạng bài bản đồ mới (cấp 1 cũng theo bản đồ mới)
  dcap as (
    select k.kc, k.kd, k.bt_id, public._do_o_bdm_core(nullif(k.kc, ''), nullif(k.kd, ''), false) as o
      from k
     where (k.kc <> '' or k.kd <> '')
       and not exists (select 1 from hcap where hcap.kc = k.kc and hcap.kd = k.kd and hcap.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)
  ),
  cap as (
    select dcap.kc, dcap.kd, dcap.bt_id, db.id as dang_bai_id, n.id as nhom_id, n.chuyen_de_id, n.chu_de_id, db.ten as ten_dang
      from dcap join dai_bdm_dang_bai db on db.id = dcap.o join dai_bdm_nhom n on n.id = db.nhom_id
    union all
    select kk.kc, kk.kd, kk.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id
    union all
    select kc, kd, bt_id, null, nhom_id, chuyen_de_id, chu_de_id, ten_dang from hcap
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri,
         cap.dang_bai_id, cap.nhom_id, cap.chuyen_de_id, cap.chu_de_id, cap.ten_dang
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '') and cap.bt_id is not distinct from m.bt_id
   where p_tu is null or m.ngay >= p_tu
$function$;

-- ── 1. Kì học ─────────────────────────────────────────────────────────────────────────────────────────────────────────
create table public.ky_hoc (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null check (btrim(ten) <> ''),
  tu_thang   text not null check (tu_thang ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  den_thang  text not null check (den_thang ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  created_by uuid default public.jwt_uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (tu_thang <= den_thang)
);

create or replace function public._bc_ky_la_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
$$;
revoke execute on function public._bc_ky_la_admin() from public, anon;
grant execute on function public._bc_ky_la_admin() to authenticated, service_role;

alter table public.ky_hoc enable row level security;
create policy ky_hoc_doc on public.ky_hoc for select to authenticated using ((select public.la_thanh_vien()));
create policy ky_hoc_them on public.ky_hoc for insert to authenticated with check ((select public._bc_ky_la_admin()));
create policy ky_hoc_sua on public.ky_hoc for update to authenticated using ((select public._bc_ky_la_admin())) with check ((select public._bc_ky_la_admin()));
grant select, insert, update on public.ky_hoc to authenticated;

create or replace function public._ky_hoc_touch() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
create trigger trg_ky_hoc_touch before update on public.ky_hoc for each row execute function public._ky_hoc_touch();

-- ── 2. Báo cáo kì (HS × môn × kì): phần GV nhập + snapshot lúc công bố ─────────────────────────────────────────────────
create table public.bao_cao_ph_ky (
  hoc_sinh_id  uuid not null references public.hoc_sinh(id),
  mon          text not null,
  ky_id        uuid not null references public.ky_hoc(id),
  diem_du_doan numeric(4,2) check (diem_du_doan between 0 and 10),
  sai_so       numeric(4,2) check (sai_so >= 0 and sai_so <= 10),
  nhan_xet     text,
  snapshot     jsonb,          -- NULL = chưa công bố lần nào (không áp dụng); có ⇒ bản đóng băng của lần công bố gần nhất
  cong_bo_at   timestamptz,    -- NULL = nháp (PH chưa thấy)
  cong_bo_boi  uuid,
  updated_by   uuid default public.jwt_uid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (hoc_sinh_id, mon, ky_id),
  check (cong_bo_at is null or snapshot is not null)
);
alter table public.bao_cao_ph_ky enable row level security;
create policy bao_cao_ph_ky_member on public.bao_cao_ph_ky for all to authenticated
  using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
grant select, insert, update on public.bao_cao_ph_ky to authenticated;

create table public.bao_cao_ph_ky_log (
  id          bigserial primary key,
  hoc_sinh_id uuid not null,
  mon         text not null,
  ky_id       uuid not null,
  hanh_dong   text not null check (hanh_dong in ('them', 'sua', 'cong_bo', 'mo_lai', 'xoa')),
  cu          jsonb,
  moi         jsonb,
  actor       uuid default public.jwt_uid(),
  at          timestamptz not null default now()
);
alter table public.bao_cao_ph_ky_log enable row level security;
create policy bao_cao_ph_ky_log_doc on public.bao_cao_ph_ky_log for select to authenticated using ((select public.la_thanh_vien()));
grant select on public.bao_cao_ph_ky_log to authenticated;

create or replace function public._bao_cao_ph_ky_truoc() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(public.jwt_uid(), new.updated_by);
  if tg_op = 'UPDATE' and old.cong_bo_at is not null and new.cong_bo_at is not null
     and (new.diem_du_doan is distinct from old.diem_du_doan or new.sai_so is distinct from old.sai_so
          or new.nhan_xet is distinct from old.nhan_xet or new.snapshot is distinct from old.snapshot) then
    raise exception 'Báo cáo kì đã công bố — bấm "Mở lại để sửa" trước.';
  end if;
  return new;
end $$;
create trigger trg_bao_cao_ph_ky_truoc before insert or update on public.bao_cao_ph_ky
  for each row execute function public._bao_cao_ph_ky_truoc();

-- log: KHÔNG chép snapshot vào `moi` (to) — chỉ chép bản cũ khi mở lại/công bố lại để còn truy được số PH đã thấy
create or replace function public._bao_cao_ph_ky_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
declare v_hd text;
begin
  if tg_op = 'INSERT' then v_hd := case when new.cong_bo_at is not null then 'cong_bo' else 'them' end;
  elsif tg_op = 'DELETE' then v_hd := 'xoa';
  elsif old.cong_bo_at is null and new.cong_bo_at is not null then v_hd := 'cong_bo';
  elsif old.cong_bo_at is not null and new.cong_bo_at is null then v_hd := 'mo_lai';
  else v_hd := 'sua'; end if;
  insert into bao_cao_ph_ky_log (hoc_sinh_id, mon, ky_id, hanh_dong, cu, moi)
  values (coalesce(new.hoc_sinh_id, old.hoc_sinh_id), coalesce(new.mon, old.mon), coalesce(new.ky_id, old.ky_id), v_hd,
          case when tg_op = 'INSERT' then null else to_jsonb(old) - case when v_hd = 'mo_lai' then '' else 'snapshot' end end,
          case when tg_op = 'DELETE' then null else to_jsonb(new) - 'snapshot' end);
  return null;
end $$;
create trigger trg_bao_cao_ph_ky_log after insert or update or delete on public.bao_cao_ph_ky
  for each row execute function public._bao_cao_ph_ky_ghi_log();

-- ── 3. Tháng của một lần thi (MT ngày 1–10 ⇒ tháng trước; khảo sát theo tháng lịch) ─────────────────────────────────────
create or replace function public._bc_ky_thang_thi(p_loai text, p_ngay date) returns text
language sql immutable as $$
  select to_char(case when p_loai = 'mt_sat_hach' and extract(day from p_ngay) <= 10 then p_ngay - interval '1 month' else p_ngay end, 'YYYY-MM')
$$;

-- ── 4. TÍNH báo cáo kì — một nguồn duy nhất, trả jsonb TỰ ĐỦ (cũng chính là snapshot khi công bố) ─────────────────────────
create or replace function public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb
language plpgsql stable
set search_path to 'public'
as $function$
declare
  v_ky ky_hoc;
  v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu date; v_het date; v_cuoi date; v_45 date;
  v_lop record; v_hs record; v_gv text; v_bc bao_cao_ph_ky;
  v_out jsonb;
begin
  select * into v_ky from ky_hoc where id = p_ky;
  if v_ky.id is null then raise exception 'Không có kì %', p_ky; end if;
  v_tu   := (v_ky.tu_thang || '-01')::date;
  v_het  := ((v_ky.den_thang || '-01')::date + interval '1 month')::date;   -- hết kì (không gồm)
  v_cuoi := least(v_het - 1, v_homnay);
  v_45   := v_cuoi - 44;                                                  -- 45 ngày tính cả ngày cuối
  select h.id, h.ho_ten, h.ma_hs into v_hs from hoc_sinh h where h.id = p_hs;
  select l.id, l.ten_lop, l.khoi into v_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;
  select ns.ho_ten into v_gv from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
   where pc.lop_id = v_lop.id and pc.vai_tro = 'gv' and pc.la_chinh limit 1;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;

  with c as materialized (
    select x.* from public._dbht_cau(array[p_hs], least(v_tu, v_45), p_mon) x where x.ngay <= v_cuoi
  ),
  -- đơn vị liệt kê = có câu trong kì (hoặc trong 45 ngày)
  dv_cd as (select distinct chu_de_id as ma from c where ngay >= least(v_tu, v_45)),
  dv_ch as (select chuyen_de_id as ma, min(chu_de_id) as chu_de from c group by chuyen_de_id),
  r_cd as (
    select c.chu_de_id as ma, c.gia_tri,
           row_number() over (partition by c.chu_de_id order by c.ngay desc, _dbht_kenh_tt(c.kenh) desc, c.t desc, c.luot desc, c.thu_tu desc) as rn
      from c where c.ngay >= v_45
  ),
  r_ch as (
    select c.chuyen_de_id as ma, c.gia_tri,
           row_number() over (partition by c.chuyen_de_id order by c.ngay desc, _dbht_kenh_tt(c.kenh) desc, c.t desc, c.luot desc, c.thu_tu desc) as rn
      from c where c.ngay >= v_45
  ),
  p_cd as (select ma, round(100 * avg(gia_tri))::int as p, count(*)::int as n from r_cd where rn <= 20 group by ma),
  p_ch as (select ma, round(100 * avg(gia_tri))::int as p, count(*)::int as n from r_ch where rn <= 10 group by ma),
  -- tên + thứ tự theo bản đồ (Đại/HGT · Hình 'H:' · KHTN 'KC…' · 'HINH' = Hình chưa gắn chủ đề)
  t_cd as (
    select dv.ma,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join dai_bdm_chu_de dc on dc.id = case when dv.ma like 'H:%' then substr(dv.ma, 3) else dv.ma end
  ),
  t_ch as (
    select dv.ma, dv.chu_de,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, nmh.ten, dch.ten, dv.ma) as ten,
           coalesce(tcd.tt, 9999) as tt1,
           coalesce(ko.thu_tu, nmh.thu_tu, dbo.thu_tu, 9999) as tt2
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join hinh_nhom_mo_hinh nmh on dv.ma like 'H:%' and nmh.id::text = substr(dv.ma, 3)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join dai_bdm_o dbo on dbo.chuyen_de_id = dv.ma and dbo.chu_de_id = dv.chu_de
      left join t_cd tcd on tcd.ma = dv.chu_de
  ),
  -- LẦN THI trong kì (khối của em)
  kt as (
    select k.id, k.loai, coalesce(k.ngay, b.ngay) as ngay,
           public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, b.ngay)) as thang
      from ky_thi k left join buoi_hoc b on b.id = k.buoi_hoc_id
     where k.loai in ('mt_sat_hach', 'khao_sat_thang') and k.mon = p_mon and k.khoi = v_lop.khoi
       and coalesce(k.ngay, b.ngay) is not null
  ),
  kt2 as (select * from kt where thang between v_ky.tu_thang and v_ky.den_thang),
  d as (
    select kt2.loai, kt2.thang, dt.hoc_sinh_id, avg(dt.diem) as diem, min(kt2.ngay) as ngay
      from diem_thi dt join kt2 on kt2.id = dt.ky_thi_id
     where dt.diem is not null
     group by kt2.loai, kt2.thang, dt.hoc_sinh_id
  ),
  lan as (
    select d.*, rank() over (partition by loai, thang order by diem desc)::int as hang,
           count(*) over (partition by loai, thang)::int as n_mau,
           avg(diem) over (partition by loai, thang) as tb
      from d
  ),
  ky_tb as (
    select hoc_sinh_id, avg(diem) as tb, count(*)::int as so_lan from d group by hoc_sinh_id
  ),
  ky_hang as (
    select hoc_sinh_id, tb, so_lan, rank() over (order by tb desc)::int as hang, count(*) over ()::int as tong from ky_tb
  ),
  cc as (
    select count(*) filter (where h.diem_danh = 'vang')::int as vang,
           count(*) filter (where h.diem_danh = 'vang_phep')::int as vang_phep,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(h.diem_danh)::int as tong
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai is distinct from 'huy'
      join lop l on l.id = b.lop_id and l.mon = p_mon
     where h.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
  )
  select jsonb_build_object(
    'phien_ban', 1,
    'tinh_luc', now(),
    'hs', jsonb_build_object('id', v_hs.id, 'ho_ten', v_hs.ho_ten, 'ma_hs', v_hs.ma_hs),
    'lop', jsonb_build_object('id', v_lop.id, 'ten', v_lop.ten_lop, 'khoi', v_lop.khoi),
    'mon', p_mon,
    'gv', v_gv,
    'ky', jsonb_build_object('id', v_ky.id, 'ten', v_ky.ten, 'tu_thang', v_ky.tu_thang, 'den_thang', v_ky.den_thang),
    'cua_so_hoan_thanh', jsonb_build_object('tu', v_45, 'den', v_cuoi, 'n_chu_de', 20, 'n_chuyen_de', 10),
    'nang_luc', jsonb_build_object('diem', v_bc.diem_du_doan, 'sai_so', v_bc.sai_so),
    'nhan_xet', v_bc.nhan_xet,
    'hoan_thanh', jsonb_build_object(
      'chu_de', coalesce((select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 20)
                                           order by t.tt, t.ten) from t_cd t left join p_cd p on p.ma = t.ma), '[]'::jsonb),
      'chuyen_de', coalesce((select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'chu_de', tc.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 10)
                                              order by t.tt1, t.tt2, t.ten) from t_ch t left join p_ch p on p.ma = t.ma
                                              left join t_cd tc on tc.ma = t.chu_de), '[]'::jsonb)),
    'thi', coalesce((select jsonb_agg(jsonb_build_object(
                       'loai', l.loai,
                       'nhan', case l.loai when 'mt_sat_hach' then 'MT' else 'KS' end || ' T' || ltrim(substr(l.thang, 6, 2), '0'),
                       'thang', l.thang, 'ngay', l.ngay,
                       'diem', round(l.diem, 1), 'tb', round(l.tb, 1), 'n_mau', l.n_mau, 'hang', l.hang)
                     order by l.ngay, l.loai) from lan l where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'tb', round(k.tb, 1), 'so_lan', k.so_lan)
                  from ky_hang k where k.hoc_sinh_id = p_hs),
    'chuyen_can', (select to_jsonb(cc) from cc)
  ) into v_out;
  return v_out;
end
$function$;

-- ── 5. XEM: đã công bố ⇒ snapshot (không tính lại); nháp ⇒ tính động ───────────────────────────────────────────────────────
create or replace function public.fn_bc_ky_xem(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb language plpgsql stable set search_path to 'public' as $$
declare v_bc bao_cao_ph_ky;
begin
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  if v_bc.cong_bo_at is not null then
    return jsonb_build_object('cong_bo_at', v_bc.cong_bo_at, 'du_lieu', v_bc.snapshot);
  end if;
  return jsonb_build_object('cong_bo_at', null, 'du_lieu', public.fn_bc_ky_tinh(p_hs, p_mon, p_ky));
end $$;

-- ── 6. CÔNG BỐ / MỞ LẠI — tính + ghi snapshot trong CÙNG transaction ──────────────────────────────────────────────────────
create or replace function public.fn_bc_ky_cong_bo(p_hs uuid, p_mon text, p_ky uuid)
returns timestamptz language plpgsql volatile set search_path to 'public' as $$
declare v_snap jsonb; v_at timestamptz := now();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if exists (select 1 from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky and cong_bo_at is not null) then
    raise exception 'Báo cáo kì này đã công bố.';
  end if;
  v_snap := public.fn_bc_ky_tinh(p_hs, p_mon, p_ky) || jsonb_build_object('cong_bo_at', v_at);
  insert into bao_cao_ph_ky (hoc_sinh_id, mon, ky_id, snapshot, cong_bo_at, cong_bo_boi)
  values (p_hs, p_mon, p_ky, v_snap, v_at, public.jwt_uid())
  on conflict (hoc_sinh_id, mon, ky_id) do update
     set snapshot = excluded.snapshot, cong_bo_at = excluded.cong_bo_at, cong_bo_boi = excluded.cong_bo_boi;
  return v_at;
end $$;

create or replace function public.fn_bc_ky_mo_lai(p_hs uuid, p_mon text, p_ky uuid)
returns void language plpgsql volatile set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  -- snapshot GIỮ (cột vẫn là bản PH đã thấy lần trước, log 'mo_lai' cũng chép); công bố lại sẽ ghi đè bằng bản tính mới
  update bao_cao_ph_ky set cong_bo_at = null, cong_bo_boi = null
   where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky and cong_bo_at is not null;
end $$;

-- Công bố cả lớp: HS đã nhập ĐỦ (điểm dự đoán + sai số + nhận xét) và chưa công bố. Trả số đã công bố / bỏ qua.
create or replace function public.fn_bc_ky_cong_bo_lop(p_lop uuid, p_mon text, p_ky uuid)
returns jsonb language plpgsql volatile set search_path to 'public' as $$
declare r record; v_ok int := 0; v_bo int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  for r in
    select hl.hoc_sinh_id, bc.diem_du_doan, bc.sai_so, bc.nhan_xet, bc.cong_bo_at
      from hoc_sinh_lop hl
      left join bao_cao_ph_ky bc on bc.hoc_sinh_id = hl.hoc_sinh_id and bc.mon = p_mon and bc.ky_id = p_ky
     where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
  loop
    if r.cong_bo_at is not null then continue; end if;
    if r.diem_du_doan is null or r.sai_so is null or coalesce(btrim(r.nhan_xet), '') = '' then v_bo := v_bo + 1; continue; end if;
    perform public.fn_bc_ky_cong_bo(r.hoc_sinh_id, p_mon, p_ky);
    v_ok := v_ok + 1;
  end loop;
  return jsonb_build_object('cong_bo', v_ok, 'bo_qua', v_bo);
end $$;

revoke execute on function public.fn_bc_ky_tinh(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_xem(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_mo_lai(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_cong_bo_lop(uuid, text, uuid) from public, anon;
grant execute on function public.fn_bc_ky_tinh(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_xem(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_mo_lai(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_cong_bo_lop(uuid, text, uuid) to authenticated, service_role;
