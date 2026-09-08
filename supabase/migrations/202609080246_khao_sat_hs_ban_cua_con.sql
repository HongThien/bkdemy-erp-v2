-- ============================================================================
-- 202609080246 — khao_sat_hs_ban_cua_con
-- ----------------------------------------------------------------------------
-- VÌ SAO: spec-khao-sat-hs.md (CEO 08/09) — khảo sát "Bạn của con ở BK": vẽ ĐỒ THỊ quan hệ ~300 HS
--   (cùng lớp trường / cùng toà-tầng / rủ vào) để kiểm giả thuyết referral trước khi thiết kế CSKH.
--   CEO chốt thêm 08/09: "các trường thông tin này cập nhật hết thành THÔNG TIN CÁ NHÂN của học sinh"
--   ⇒ KHÁC spec §3 (spec nói "không thêm cột trên hoc_sinh"): trường/lớp trường/nơi ở/toà/tầng/khu/
--   nghề bố mẹ/ban PH/chức vụ toà/lý do vào là thuộc tính CÁ NHÂN (không nhãn `mon` — §1.6: dữ liệu
--   không-học-tập thì chung) → sống trên `hoc_sinh`, hồ sơ HS ở ERP sửa được. Bảng khảo sát chỉ giữ:
--   (a) `khao_sat_hs` = 1 dòng/HS/đợt đã NỘP (chống làm lại) + `tra_loi` jsonb = SNAPSHOT thô bất biến
--       (hoc_sinh là "trạng thái hiện tại", snapshot là "lịch sử" — §4 mọi đổi state có vết);
--   (b) `khao_sat_hs_quan_he` = 1 dòng/CẠNH (mỗi người được nêu tên) — bảng dựng đồ thị, tên gõ tự do,
--       khớp `den_hoc_sinh_id` SAU bằng tay (§5).
-- LUẬT: không có dòng khi chưa nộp (§1.5) · nộp = 1 RPC 1 transaction (§2.0) · mọi tổng hợp = view/fn ở DB.
-- MẤT GÌ (Luật xoá): không mất gì — chỉ THÊM cột (nullable) + bảng + hàm + view.
-- ============================================================================

-- ── 1) hoc_sinh: thông tin cá nhân mới (null = chưa biết, KHÔNG phải "không áp dụng") ─────────────
alter table hoc_sinh
  add column if not exists lop_truong text,            -- lớp ở trường phổ thông, vd "7A3"
  add column if not exists noi_o_loai text,            -- chung_cu | nha_dat
  add column if not exists toa text,                   -- chung_cu: tên toà (Gemek 1…)
  add column if not exists tang smallint,              -- chung_cu: tầng
  add column if not exists khu text,                   -- nha_dat: khu/xóm
  add column if not exists ly_do_vao text,             -- vì sao vào BK
  add column if not exists bo_me_ban_ph_lop text,      -- bố mẹ trong ban PH lớp ở trường?
  add column if not exists bo_me_chuc_vu_toa text,     -- bố mẹ có chức vụ trong toà nhà?
  add column if not exists nghe_bo_me text;
alter table hoc_sinh drop constraint if exists hoc_sinh_noi_o_loai_chk;
alter table hoc_sinh add constraint hoc_sinh_noi_o_loai_chk check (noi_o_loai is null or noi_o_loai in ('chung_cu','nha_dat'));
alter table hoc_sinh drop constraint if exists hoc_sinh_ly_do_vao_chk;
alter table hoc_sinh add constraint hoc_sinh_ly_do_vao_chk check (ly_do_vao is null or ly_do_vao in ('ban_ru','bo_me_quyet','bo_me_hoi_con_chon','khac'));
alter table hoc_sinh drop constraint if exists hoc_sinh_bo_me_ban_ph_lop_chk;
alter table hoc_sinh add constraint hoc_sinh_bo_me_ban_ph_lop_chk check (bo_me_ban_ph_lop is null or bo_me_ban_ph_lop in ('co','khong','khong_biet'));
alter table hoc_sinh drop constraint if exists hoc_sinh_bo_me_chuc_vu_toa_chk;
alter table hoc_sinh add constraint hoc_sinh_bo_me_chuc_vu_toa_chk check (bo_me_chuc_vu_toa is null or bo_me_chuc_vu_toa in ('co','khong','khong_biet'));

-- ── 2) Bảng khảo sát ────────────────────────────────────────────────────────────────────────────
-- Một dòng = một HS đã NỘP xong một đợt. Không tạo dòng khi mở dở.
create table if not exists khao_sat_hs (
  id            bigint generated always as identity primary key,
  hoc_sinh_id   uuid not null references hoc_sinh(id),
  dot           smallint not null default 1,
  tra_loi       jsonb not null,                        -- snapshot payload thô lúc nộp (bất biến)
  nguoi_bam_ho  uuid references nhan_su(id),           -- TA bấm hộ (lớp 3–5); null = HS tự làm
  nop_luc       timestamptz not null default now(),
  unique (hoc_sinh_id, dot)
);
alter table khao_sat_hs enable row level security;
drop policy if exists khao_sat_hs_member_all on khao_sat_hs;
create policy khao_sat_hs_member_all on khao_sat_hs for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- Một dòng = một CẠNH (một người được nêu tên). Đây là bảng dựng đồ thị.
create table if not exists khao_sat_hs_quan_he (
  id              bigint generated always as identity primary key,
  khao_sat_id     bigint not null references khao_sat_hs(id) on delete cascade,
  tu_hoc_sinh_id  uuid not null references hoc_sinh(id),   -- HS làm khảo sát (denormalize cho query)
  loai            text not null check (loai in ('biet','duoc_ru_boi','da_ru','muon_ru')),
  ten_goc         text not null,                            -- đúng như trẻ gõ, không sửa
  ghi_chu_goc     text,                                     -- lớp/toà của bạn (câu 9)
  quen_tu         text check (quen_tu in ('cung_lop_truong','cung_toa','khac')),      -- loai=biet
  quan_he         text check (quan_he in ('con_voi_ban','bo_me_voi_bo_me','ca_hai')), -- loai=biet
  ket_qua_ru      text check (ket_qua_ru in ('co','khong','chua_biet')),               -- loai=da_ru
  den_hoc_sinh_id uuid references hoc_sinh(id),             -- KHỚP SAU BẰNG TAY; null = chưa khớp
  ngoai_bk        boolean not null default false,           -- người khớp xác nhận: tên này KHÔNG phải HS BK
  khop_luc        timestamptz,
  khop_boi        uuid references nhan_su(id)
);
create index if not exists khao_sat_hs_quan_he_tu_idx on khao_sat_hs_quan_he (tu_hoc_sinh_id);
create index if not exists khao_sat_hs_quan_he_den_idx on khao_sat_hs_quan_he (den_hoc_sinh_id);
alter table khao_sat_hs_quan_he enable row level security;
drop policy if exists khao_sat_hs_quan_he_member_all on khao_sat_hs_quan_he;
create policy khao_sat_hs_quan_he_member_all on khao_sat_hs_quan_he for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── 3) Bỏ dấu tiếng Việt (không có extension unaccent trên DB này — translate() thuần, không phụ thuộc) ──
create or replace function public.fn_bo_dau(p text) returns text language sql immutable as $$
  select lower(translate(coalesce(p, ''),
    'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ',
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD'))
$$;

-- ── 4) Danh sách gợi ý trường/toà cho màn chọn — LẤY TỪ DATA (tự lớn dần khi khảo sát chạy) + seed ──
create or replace function public.fn_khao_sat_danh_sach() returns jsonb language sql stable as $$
  with tr as (
    select truong_hoc ten, count(*) n from hoc_sinh where truong_hoc is not null and trang_thai = 'dang_hoc' group by 1
  ), toa_dl as (
    select toa ten, count(*)::bigint n from hoc_sinh where toa is not null group by 1
    union all
    select x, 0::bigint from unnest(array['Gemek 1','Gemek 2','Golden Thăng Long','Vinsmart','Thiên Đường Bảo Sơn','Geleximco']) x
  ), toa as (select ten, sum(n) n from toa_dl group by 1)
  select jsonb_build_object(
    'truong', (select coalesce(jsonb_agg(ten order by n desc, ten), '[]'::jsonb) from (select * from tr where n >= 2 order by n desc limit 16) s),
    'toa',    (select coalesce(jsonb_agg(ten order by n desc, ten), '[]'::jsonb) from (select * from toa order by n desc limit 16) s))
$$;
grant execute on function public.fn_khao_sat_danh_sach() to authenticated;

-- ── 5) Lưới lớp: tiến độ theo lớp + danh sách HS của 1 lớp (ai đã làm) ──────────────────────────
create or replace function public.fn_khao_sat_lop_tien_do(p_dot int default 1)
returns table (lop_id uuid, ten_lop text, mon text, khoi text, si_so bigint, da_lam bigint)
language sql stable as $$
  select l.id, l.ten_lop, l.mon, l.khoi,
         count(hl.hoc_sinh_id) si_so,
         count(k.id) da_lam
  from lop l
  left join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
  left join khao_sat_hs k on k.hoc_sinh_id = hl.hoc_sinh_id and k.dot = p_dot
  where l.trang_thai = 'dang_hoc'
  group by l.id, l.ten_lop, l.mon, l.khoi
  order by l.ten_lop
$$;
grant execute on function public.fn_khao_sat_lop_tien_do(int) to authenticated;

create or replace function public.fn_khao_sat_luoi_lop(p_lop uuid, p_dot int default 1)
returns table (hoc_sinh_id uuid, ho_ten text, anh_url text, gioi_tinh text, khoi text,
               truong_hoc text, lop_truong text, noi_o_loai text, toa text, tang smallint, khu text,
               da_lam boolean, nop_luc timestamptz)
language sql stable as $$
  select h.id, h.ho_ten, h.anh_url, h.gioi_tinh, h.khoi,
         h.truong_hoc, h.lop_truong, h.noi_o_loai, h.toa, h.tang, h.khu,
         k.id is not null, k.nop_luc
  from hoc_sinh_lop hl
  join hoc_sinh h on h.id = hl.hoc_sinh_id
  left join khao_sat_hs k on k.hoc_sinh_id = h.id and k.dot = p_dot
  where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
  order by h.ho_ten
$$;
grant execute on function public.fn_khao_sat_luoi_lop(uuid, int) to authenticated;

-- ── 6) NỘP: 1 RPC, 1 transaction — insert khao_sat + cập nhật hồ sơ HS + insert cạnh ─────────────
-- payload: { hoc_sinh_id, dot?, ta_bam_ho, truong, lop_truong, noi_o_loai, toa?, tang?, khu?, ly_do_vao?,
--            bo_me_ban_ph_lop?, bo_me_chuc_vu_toa?, nghe_bo_me?, quan_he: [{loai, ten, ghi_chu?, quen_tu?, quan_he?, ket_qua_ru?}] }
-- Câu tuỳ chọn trẻ bỏ qua (null) → GIỮ giá trị cũ trên hoc_sinh (thà giữ cũ còn hơn xoá bằng "không trả lời").
create or replace function public.fn_khao_sat_hs_nop(p jsonb) returns bigint
language plpgsql as $$
declare
  v_hs    uuid := nullif(p->>'hoc_sinh_id', '')::uuid;
  v_dot   smallint := coalesce(nullif(p->>'dot', '')::smallint, 1);
  v_noi_o text := p->>'noi_o_loai';
  v_id    bigint;
  e       jsonb;
  n_canh  int := 0;
begin
  if v_hs is null then raise exception 'Thiếu hoc_sinh_id'; end if;
  if nullif(trim(p->>'truong'), '') is null or nullif(trim(p->>'lop_truong'), '') is null then
    raise exception 'Câu 1 bắt buộc: trường và lớp';
  end if;
  if v_noi_o is null or v_noi_o not in ('chung_cu', 'nha_dat') then raise exception 'Câu 2 bắt buộc: nơi ở'; end if;
  if v_noi_o = 'chung_cu' and nullif(trim(p->>'toa'), '') is null then raise exception 'Chung cư cần tên toà'; end if;
  if exists (select 1 from khao_sat_hs where hoc_sinh_id = v_hs and dot = v_dot) then
    raise exception 'Học sinh này đã làm khảo sát đợt %', v_dot;
  end if;

  insert into khao_sat_hs (hoc_sinh_id, dot, tra_loi, nguoi_bam_ho)
  values (v_hs, v_dot, p - 'hoc_sinh_id' - 'dot',
          case when coalesce((p->>'ta_bam_ho')::boolean, false) then public.current_nhan_su_id() end)
  returning id into v_id;

  update hoc_sinh set
    truong_hoc        = trim(p->>'truong'),
    lop_truong        = trim(p->>'lop_truong'),
    noi_o_loai        = v_noi_o,
    toa               = case when v_noi_o = 'chung_cu' then nullif(trim(p->>'toa'), '') end,
    tang              = case when v_noi_o = 'chung_cu' and (p->>'tang') ~ '^\d{1,3}$' then (p->>'tang')::smallint end,
    khu               = case when v_noi_o = 'nha_dat' then nullif(trim(p->>'khu'), '') end,
    ly_do_vao         = coalesce(nullif(p->>'ly_do_vao', ''), ly_do_vao),
    bo_me_ban_ph_lop  = coalesce(nullif(p->>'bo_me_ban_ph_lop', ''), bo_me_ban_ph_lop),
    bo_me_chuc_vu_toa = coalesce(nullif(p->>'bo_me_chuc_vu_toa', ''), bo_me_chuc_vu_toa),
    nghe_bo_me        = coalesce(nullif(trim(p->>'nghe_bo_me'), ''), nghe_bo_me),
    updated_at        = now()
  where id = v_hs;

  for e in select * from jsonb_array_elements(coalesce(p->'quan_he', '[]'::jsonb)) loop
    continue when nullif(trim(e->>'ten'), '') is null;
    insert into khao_sat_hs_quan_he (khao_sat_id, tu_hoc_sinh_id, loai, ten_goc, ghi_chu_goc, quen_tu, quan_he, ket_qua_ru)
    values (v_id, v_hs, e->>'loai', trim(e->>'ten'), nullif(trim(e->>'ghi_chu'), ''),
            case when e->>'loai' = 'biet'  then nullif(e->>'quen_tu', '') end,
            case when e->>'loai' = 'biet'  then nullif(e->>'quan_he', '') end,
            case when e->>'loai' = 'da_ru' then nullif(e->>'ket_qua_ru', '') end);
    n_canh := n_canh + 1;
  end loop;
  return v_id;
end $$;
grant execute on function public.fn_khao_sat_hs_nop(jsonb) to authenticated;

-- ── 7) KHỚP TÊN (§5): danh sách cạnh + gợi ý HS trùng tên + ghi khớp ─────────────────────────────
create or replace function public.fn_khao_sat_canh()
returns table (id bigint, loai text, ten_goc text, ghi_chu_goc text, quen_tu text, quan_he text, ket_qua_ru text,
               tu_hoc_sinh_id uuid, tu_ho_ten text, tu_khoi text, tu_truong text, tu_lop_truong text, tu_toa text,
               den_hoc_sinh_id uuid, den_ho_ten text, ngoai_bk boolean, khop_luc timestamptz, nop_luc timestamptz)
language sql stable as $$
  select q.id, q.loai, q.ten_goc, q.ghi_chu_goc, q.quen_tu, q.quan_he, q.ket_qua_ru,
         q.tu_hoc_sinh_id, t.ho_ten, t.khoi, t.truong_hoc, t.lop_truong, t.toa,
         q.den_hoc_sinh_id, d.ho_ten, q.ngoai_bk, q.khop_luc, k.nop_luc
  from khao_sat_hs_quan_he q
  join khao_sat_hs k on k.id = q.khao_sat_id
  join hoc_sinh t on t.id = q.tu_hoc_sinh_id
  left join hoc_sinh d on d.id = q.den_hoc_sinh_id
  order by case q.loai when 'biet' then 1 when 'da_ru' then 2 when 'duoc_ru_boi' then 3 else 4 end, t.ho_ten, q.id
$$;
grant execute on function public.fn_khao_sat_canh() to authenticated;

-- Gợi ý: HS đang học có tên (bỏ dấu) chứa TỪ CUỐI của tên trẻ gõ; điểm = khớp tên + cùng trường/lớp/toà/khối.
create or replace function public.fn_khao_sat_goi_y_khop(p_qh bigint)
returns table (hoc_sinh_id uuid, ho_ten text, ma_hs text, khoi text, anh_url text, truong_hoc text, lop_truong text, toa text, diem int, ly_do text)
language sql stable as $$
  with q as (
    select qh.tu_hoc_sinh_id, public.fn_bo_dau(qh.ten_goc) ten_bd,
           regexp_replace(public.fn_bo_dau(trim(qh.ten_goc)), '^.*\s', '') tu_cuoi,
           h.truong_hoc tr, h.lop_truong lt, h.toa toa0, h.khoi khoi0
    from khao_sat_hs_quan_he qh join hoc_sinh h on h.id = qh.tu_hoc_sinh_id
    where qh.id = p_qh
  ), c as (
    select h.id, h.ho_ten, h.ma_hs, h.khoi, h.anh_url, h.truong_hoc, h.lop_truong, h.toa,
      (case when public.fn_bo_dau(h.ho_ten) = q.ten_bd then 5
            when public.fn_bo_dau(h.ho_ten) like '%' || q.ten_bd then 3
            when public.fn_bo_dau(h.ho_ten) like '%' || q.ten_bd || '%' then 2 else 0 end) d_ten,
      (q.tr is not null and h.truong_hoc = q.tr) cung_truong,
      (q.tr is not null and q.lt is not null and h.truong_hoc = q.tr and h.lop_truong = q.lt) cung_lop,
      (q.toa0 is not null and h.toa = q.toa0) cung_toa,
      (h.khoi = q.khoi0) cung_khoi
    from hoc_sinh h, q
    where h.trang_thai = 'dang_hoc' and h.id <> q.tu_hoc_sinh_id
      and q.tu_cuoi <> '' and public.fn_bo_dau(h.ho_ten) like '%' || q.tu_cuoi || '%'
  )
  select c.id, c.ho_ten, c.ma_hs, c.khoi, c.anh_url, c.truong_hoc, c.lop_truong, c.toa,
         (c.d_ten + case when c.cung_lop then 4 when c.cung_truong then 2 else 0 end
                  + case when c.cung_toa then 2 else 0 end + case when c.cung_khoi then 1 else 0 end)::int diem,
         concat_ws(' · ', case when c.cung_lop then 'cùng lớp trường' when c.cung_truong then 'cùng trường' end,
                          case when c.cung_toa then 'cùng toà' end, case when c.cung_khoi then 'cùng khối' end) ly_do
  from c
  order by diem desc, c.ho_ten
  limit 8
$$;
grant execute on function public.fn_khao_sat_goi_y_khop(bigint) to authenticated;

-- p_ngoai_bk=true → đánh dấu ngoài BK · p_hoc_sinh null → bỏ khớp · có p_hoc_sinh → khớp.
create or replace function public.fn_khao_sat_khop(p_qh bigint, p_hoc_sinh uuid, p_ngoai_bk boolean default false) returns void
language plpgsql as $$
begin
  if p_ngoai_bk then
    update khao_sat_hs_quan_he set den_hoc_sinh_id = null, ngoai_bk = true, khop_luc = now(), khop_boi = public.current_nhan_su_id() where id = p_qh;
  elsif p_hoc_sinh is null then
    update khao_sat_hs_quan_he set den_hoc_sinh_id = null, ngoai_bk = false, khop_luc = null, khop_boi = null where id = p_qh;
  else
    if exists (select 1 from khao_sat_hs_quan_he where id = p_qh and tu_hoc_sinh_id = p_hoc_sinh) then
      raise exception 'Không thể khớp một HS với chính mình';
    end if;
    update khao_sat_hs_quan_he set den_hoc_sinh_id = p_hoc_sinh, ngoai_bk = false, khop_luc = now(), khop_boi = public.current_nhan_su_id() where id = p_qh;
  end if;
  if not found then raise exception 'Không có cạnh #%', p_qh; end if;
end $$;
grant execute on function public.fn_khao_sat_khop(bigint, uuid, boolean) to authenticated;

-- ── 8) ĐỌC KẾT QUẢ (§5 — 4 query + tổng quan), tính ở DB, client chỉ render ───────────────────
-- 1. Mật độ cụm: HS đang học theo (trường, lớp) và (toà, tầng) — đọc từ hoc_sinh (trạng thái hiện tại).
create or replace view v_khao_sat_cum_truong with (security_invoker = true) as
select truong_hoc, lop_truong, count(*) so_hs, count(*) = 1 don_doc,
       array_agg(ho_ten order by ho_ten) hs
from hoc_sinh where trang_thai = 'dang_hoc' and truong_hoc is not null
group by truong_hoc, lop_truong;
grant select on v_khao_sat_cum_truong to authenticated;

create or replace view v_khao_sat_cum_toa with (security_invoker = true) as
select toa, tang, count(*) so_hs, count(*) = 1 don_doc,
       array_agg(ho_ten order by ho_ten) hs
from hoc_sinh where trang_thai = 'dang_hoc' and noi_o_loai = 'chung_cu' and toa is not null
group by toa, tang;
grant select on v_khao_sat_cum_toa to authenticated;

-- 2. Kênh: phân bố quen_tu × quan_he trên cạnh `biet` ĐÃ KHỚP; hai chiều = B cũng khai A.
create or replace view v_khao_sat_kenh with (security_invoker = true) as
select q.quen_tu, q.quan_he, count(*) so_canh,
       count(*) filter (where exists (
         select 1 from khao_sat_hs_quan_he r
         where r.loai = 'biet' and r.tu_hoc_sinh_id = q.den_hoc_sinh_id and r.den_hoc_sinh_id = q.tu_hoc_sinh_id)) so_hai_chieu
from khao_sat_hs_quan_he q
where q.loai = 'biet' and q.den_hoc_sinh_id is not null
group by q.quen_tu, q.quan_he;
grant select on v_khao_sat_kenh to authenticated;

-- 3. Vector trẻ: mỗi HS đã nộp — lý do vào, số bạn đã rủ (thành công), cờ ưu tiên (ban PH / chức vụ toà) → danh sách gọi PH.
create or replace view v_khao_sat_vector with (security_invoker = true) as
select h.id hoc_sinh_id, h.ho_ten, h.khoi, h.truong_hoc, h.lop_truong, h.toa, h.tang,
       h.ly_do_vao, h.bo_me_ban_ph_lop, h.bo_me_chuc_vu_toa, h.nghe_bo_me,
       ph.ho_ten ph_ten, ph.so_dien_thoai ph_sdt,
       (select string_agg(r.ten_goc, ', ') from khao_sat_hs_quan_he r where r.tu_hoc_sinh_id = h.id and r.loai = 'duoc_ru_boi') nguoi_ru,
       (select count(*) from khao_sat_hs_quan_he r where r.tu_hoc_sinh_id = h.id and r.loai = 'da_ru') so_da_ru,
       (select count(*) from khao_sat_hs_quan_he r where r.tu_hoc_sinh_id = h.id and r.loai = 'da_ru' and r.ket_qua_ru = 'co') so_da_ru_co,
       (select count(*) from khao_sat_hs_quan_he r where r.tu_hoc_sinh_id = h.id and r.loai = 'muon_ru') so_muon_ru,
       (select count(*) from khao_sat_hs_quan_he r where r.tu_hoc_sinh_id = h.id and r.loai = 'biet') so_biet,
       (h.bo_me_ban_ph_lop = 'co' or h.bo_me_chuc_vu_toa = 'co') uu_tien,
       k.nop_luc
from khao_sat_hs k
join hoc_sinh h on h.id = k.hoc_sinh_id
left join phu_huynh ph on ph.id = h.phu_huynh_id
order by (select count(*) from khao_sat_hs_quan_he r where r.tu_hoc_sinh_id = h.id and r.loai = 'da_ru' and r.ket_qua_ru = 'co') desc,
         (h.bo_me_ban_ph_lop = 'co' or h.bo_me_chuc_vu_toa = 'co') desc, h.ho_ten;
grant select on v_khao_sat_vector to authenticated;

-- 4. Lead: cạnh muon_ru gom theo HS → giao người gọi PH của HS đó.
create or replace view v_khao_sat_lead with (security_invoker = true) as
select h.id hoc_sinh_id, h.ho_ten, h.khoi, ph.ho_ten ph_ten, ph.so_dien_thoai ph_sdt,
       (h.bo_me_ban_ph_lop = 'co' or h.bo_me_chuc_vu_toa = 'co') uu_tien,
       count(*) so_lead,
       jsonb_agg(jsonb_build_object('id', r.id, 'ten', r.ten_goc, 'ghi_chu', r.ghi_chu_goc, 'da_khop', r.den_hoc_sinh_id is not null) order by r.id) leads
from khao_sat_hs_quan_he r
join hoc_sinh h on h.id = r.tu_hoc_sinh_id
left join phu_huynh ph on ph.id = h.phu_huynh_id
where r.loai = 'muon_ru'
group by h.id, h.ho_ten, h.khoi, ph.ho_ten, ph.so_dien_thoai, h.bo_me_ban_ph_lop, h.bo_me_chuc_vu_toa
order by count(*) desc, h.ho_ten;
grant select on v_khao_sat_lead to authenticated;

-- Tổng quan 1 phát cho đầu màn Kết quả.
create or replace function public.fn_khao_sat_tong_quan(p_dot int default 1) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'so_hs_dang_hoc', (select count(*) from hoc_sinh where trang_thai = 'dang_hoc'),
    'so_da_lam',      (select count(*) from khao_sat_hs where dot = p_dot),
    'so_canh',        (select count(*) from khao_sat_hs_quan_he),
    'so_canh_da_khop',(select count(*) from khao_sat_hs_quan_he where den_hoc_sinh_id is not null),
    'so_canh_ngoai_bk',(select count(*) from khao_sat_hs_quan_he where ngoai_bk),
    'ly_do', (select coalesce(jsonb_agg(jsonb_build_object('ly_do', s.ly_do_vao, 'n', s.n) order by s.n desc), '[]'::jsonb)
              from (select h.ly_do_vao, count(*) n from khao_sat_hs k join hoc_sinh h on h.id = k.hoc_sinh_id where k.dot = p_dot group by h.ly_do_vao) s),
    'loai_canh', (select coalesce(jsonb_agg(jsonb_build_object('loai', s.loai, 'n', s.n) order by s.n desc), '[]'::jsonb)
              from (select loai, count(*) n from khao_sat_hs_quan_he group by loai) s),
    'noi_o', (select coalesce(jsonb_agg(jsonb_build_object('loai', s.noi_o_loai, 'n', s.n)), '[]'::jsonb)
              from (select noi_o_loai, count(*) n from hoc_sinh where trang_thai = 'dang_hoc' and noi_o_loai is not null group by 1) s),
    'uu_tien', (select count(*) from khao_sat_hs k join hoc_sinh h on h.id = k.hoc_sinh_id where k.dot = p_dot and (h.bo_me_ban_ph_lop = 'co' or h.bo_me_chuc_vu_toa = 'co'))
  )
$$;
grant execute on function public.fn_khao_sat_tong_quan(int) to authenticated;
