-- ============================================================================
-- 202610070954 — bang_xep_hang   (áp bằng `node scripts/migrate.mjs --only 202610070954_bang_xep_hang.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy duyệt 06/10 — spec-bang-xep-hang.md §0): thẻ "BẢNG XẾP HẠNG" chứa mọi bảng xếp hạng của BK. V1 = 8 bảng:
--   A1 Siêng luyện (số lượt Luyện dạng yếu đạt) · A2 Tổng câu đúng · A3 Tỉ lệ đạt · A4 Master chủ đề · A5 Chuỗi làm bài ·
--   B1 MT tháng · C1 Leo tháp Sinh tồn · E1 Bộ sưu tập huy hiệu.
--   Sẵn sàng NGAY: A1 A2 A3 A5 B1. CHƯA sẵn sàng (hiện "Sắp có"): A4 (chờ luật Master chủ đề), C1 (Đấu Từ chưa có hồ sơ theo tài khoản), E1 (chờ luật huy hiệu).
-- LUẬT: mỗi bảng 2 phạm vi (Khối mình · Toàn BK) · theo MÔN (bảng không gắn môn A5/E1 hiện mọi môn) · top 20 + hạng của CHÍNH em (riêng tư) ·
--   chỉ xếp em CÓ dữ liệu thật (không có dòng ≠ 0 điểm — CLAUDE §1.5) · hoà hạng ⇒ ai đạt mốc sớm hơn đứng trước · ẩn tài khoản test (`_hs_hien`) ·
--   MỌI con số tính ở Postgres (CLAUDE §2.0). Thêm 1 bảng = 1 dòng bxh_loai + 1 nhánh trong _bxh_gia_tri.
--   Không cache: đo thật ~330 HS, tính trực tiếp đủ nhanh (A5 cả BK ≈ 1,5 giây). Khi lớn hơn thì thêm cache sau.
--
-- MẤT GÌ: không xoá/sửa gì có sẵn — chỉ thêm bảng bxh_loai + 5 hàm mới (_bxh_ky · _bxh_gia_tri · fn_bxh · fn_bxh_danh_muc).
--   Bảng xếp hạng cũ (fn_hs_xep_hang_ti_le_dat, fn_bxh_diem_mt_khoi, màn "Thi đua tự luyện") GIỮ NGUYÊN, chưa gỡ.
-- ============================================================================

create table if not exists bxh_loai (
  ma text primary key,                       -- A1, A2…
  nhom text not null check (nhom in ('hoc_tap', 'ket_qua_lop', 'game', 'suu_tap')),
  ten text not null,
  mo_ta text not null,
  don_vi text not null,                      -- nhãn đơn vị hiển thị: 'lượt' · 'câu' · '%' · 'ngày' · 'điểm' · 'tầng' · 'sao'
  gan_mon boolean not null,                  -- true = xếp theo môn; false = hiện ở mọi môn
  ky_cho_phep text[] not null,               -- tuan · thang · mua · hien_tai
  ky_mac_dinh text not null,
  san_sang boolean not null default true,    -- false = hiện "Sắp có"
  ghi_chu text,
  thu_tu integer not null default 0,
  active boolean not null default true
);
comment on table bxh_loai is 'Danh mục bảng xếp hạng app HS (spec-bang-xep-hang.md). Thêm bảng = thêm dòng + nhánh trong _bxh_gia_tri.';
alter table bxh_loai enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'bxh_loai' and policyname = 'bxh_loai_doc') then
    create policy bxh_loai_doc on bxh_loai for select to authenticated using (true);
  end if;
end $$;

insert into bxh_loai (ma, nhom, ten, mo_ta, don_vi, gan_mon, ky_cho_phep, ky_mac_dinh, san_sang, ghi_chu, thu_tu) values
 ('A1', 'hoc_tap',     'Siêng luyện',        'Số lượt Luyện dạng yếu đạt (đúng từ 7/10 câu)',                          'lượt', true,  '{tuan,thang}', 'thang',    true,  null, 10),
 ('A2', 'hoc_tap',     'Tổng câu đúng',      'Số câu đúng trong các lượt luyện được tính',                              'câu',  true,  '{thang,mua}',  'thang',    true,  null, 20),
 ('A3', 'hoc_tap',     'Tỉ lệ đạt',          'Phần trăm dạng bài em đã đạt (từ 3 câu, đúng từ 75%)',                    '%',    true,  '{hien_tai}',   'hien_tai', true,  null, 30),
 ('A4', 'hoc_tap',     'Master chủ đề',      'Số chủ đề em đạt 100% dạng bài trong mùa',                                'chủ đề', true, '{mua}',        'mua',      false, 'Sắp có', 40),
 ('A5', 'hoc_tap',     'Chuỗi làm bài',      'Số ngày liên tiếp có lượt luyện được tính (mọi môn)',                     'ngày', false, '{hien_tai}',   'hien_tai', true,  null, 50),
 ('B1', 'ket_qua_lop', 'Mock Test tháng',    'Điểm Mock Test gần nhất (đề mỗi khối khác nhau)',                         'điểm', true,  '{thang}',      'thang',    true,  null, 60),
 ('C1', 'game',        'Leo tháp Sinh tồn',  'Tầng cao nhất trong 5 phút',                                              'tầng', true,  '{hien_tai}',   'hien_tai', false, 'Sắp có', 70),
 ('E1', 'suu_tap',     'Bộ sưu tập huy hiệu','Tổng số sao huy hiệu em sưu tầm được trong mùa',                          'sao',  false, '{mua}',        'mua',      false, 'Sắp có', 80)
on conflict (ma) do update set nhom = excluded.nhom, ten = excluded.ten, mo_ta = excluded.mo_ta, don_vi = excluded.don_vi, gan_mon = excluded.gan_mon,
  ky_cho_phep = excluded.ky_cho_phep, ky_mac_dinh = excluded.ky_mac_dinh, san_sang = excluded.san_sang, ghi_chu = excluded.ghi_chu, thu_tu = excluded.thu_tu;

-- Cửa sổ ngày (giờ VN, cả hai đầu tính): tuần = từ thứ Hai · tháng = từ mùng 1 · mùa = từ 01/07 gần nhất · hien_tai = không giới hạn
create or replace function public._bxh_ky(p_ky text)
returns table(tu date, den date)
language sql stable as $$
  with n as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d)
  select case p_ky
           when 'tuan'  then date_trunc('week', n.d::timestamp)::date
           when 'thang' then date_trunc('month', n.d::timestamp)::date
           when 'mua'   then make_date(extract(year from n.d)::int - case when extract(month from n.d) >= 7 then 0 else 1 end, 7, 1)
           else date '2000-01-01' end,
         n.d
  from n
$$;
revoke all on function public._bxh_ky(text) from public, anon, authenticated;

-- Giá trị xếp hạng của từng HS trong p_hs (chỉ trả HS CÓ dữ liệu thật). phu = chỉ số phụ khi hoà, dat_luc = lúc đạt mốc (sớm hơn đứng trước).
create or replace function public._bxh_gia_tri(p_loai text, p_mon text, p_ky text, p_hs uuid[])
returns table(hs uuid, gia_tri numeric, phu numeric, dat_luc timestamptz)
language plpgsql stable as $$
declare
  c record; v_tu date; v_den date; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date; v_ym text; v_khoi text;
begin
  select k.tu, k.den into v_tu, v_den from public._bxh_ky(p_ky) k;

  if p_loai = 'A1' then
    select n.* into c from nhiem_vu_cau_hinh n where n.mon = p_mon and n.bat;
    if c.mon is null then return; end if;
    v_tu := greatest(v_tu, c.bat_dau);
    if v_den < v_tu then return; end if;
    return query
      select d.hoc_sinh_id, count(*)::numeric, 0::numeric, max(d.nop_at)
      from public._nv_luot_dat(p_mon, p_hs, v_tu, v_den, c.dat_ti_le, c.lan_ngay) d group by d.hoc_sinh_id;

  elsif p_loai = 'A2' then
    return query
      select t.hoc_sinh_id, sum(t.dung)::numeric, 0::numeric, max(t.nop_at)
      from public._luot_tinh(p_hs, v_tu::timestamp at time zone 'Asia/Ho_Chi_Minh', (v_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh') t
      where t.mon = p_mon and t.tinh group by t.hoc_sinh_id having sum(t.dung) > 0;

  elsif p_loai = 'A3' then
    return query
      with do_dang as (
        select bl.hoc_sinh_id as h, bc.ma_dang,
               count(*) filter (where blc.verdict is not null) as tong_cau,
               count(*) filter (where blc.verdict = 'correct') as so_dung
        from bai_lam_cau blc
        join bai_lam bl on bl.id = blc.bai_lam_id
        join bai_test_cau bc on bc.id = blc.bai_test_cau_id
        join bai_test bt on bt.id = bl.bai_test_id
        where bt.mon = p_mon and bl.hoc_sinh_id = any(p_hs) and bc.ma_dang is not null
          and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
        group by bl.hoc_sinh_id, bc.ma_dang
      )
      select x.h, round(100.0 * count(*) filter (where x.tong_cau >= 3 and x.so_dung::numeric / x.tong_cau >= 0.75) / count(*), 1),
             count(*)::numeric, null::timestamptz
      from do_dang x group by x.h having count(*) > 0;

  elsif p_loai = 'A5' then
    return query
      select s.h, s.j, s.k, s.b from (
        select u as h, (cc.j->>'so_ngay')::numeric as j, (cc.j->>'ky_luc')::numeric as k,
               ((cc.j->>'bat_dau')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as b
        from unnest(p_hs) u cross join lateral (select public._chuoi_cua(u) as j) cc
      ) s where s.j > 0;

  elsif p_loai = 'B1' then
    -- Mock Test chạy quanh ngày 25 → mùng 10 tháng sau: kỳ "tháng" = đợt đã bắt đầu gần nhất (từ ngày 25 trở đi = tháng này, trước đó = tháng trước)
    v_ym := to_char(case when extract(day from v_nay) >= 25 then v_nay else (v_nay - interval '1 month')::date end, 'YYYY-MM');
    for v_khoi in select distinct h.khoi from hoc_sinh h where h.id = any(p_hs) and h.khoi is not null loop
      return query
        select m.hoc_sinh_id, m.tb, 0::numeric, null::timestamptz
        from public.fn_bxh_diem_mt_khoi(p_mon, v_khoi, v_ym) m where m.tb is not null and m.hoc_sinh_id = any(p_hs);
    end loop;
  end if;
  -- A4 · C1 · E1: chưa sẵn sàng ⇒ không trả dòng nào
end $$;
revoke all on function public._bxh_gia_tri(text, text, text, uuid[]) from public, anon, authenticated;

-- BẢNG XẾP HẠNG cho app: top 20 + hạng riêng tư của người gọi.
create or replace function public.fn_bxh(p_loai text, p_mon text, p_pham_vi text default 'khoi', p_ky text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  l bxh_loai%rowtype; v_ky text; v_khoi text; v_hs uuid[]; v_tong int; v_top jsonb; v_toi jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  select * into l from bxh_loai where ma = p_loai and active;
  if not found then raise exception 'Bảng xếp hạng không tồn tại.'; end if;
  if p_pham_vi not in ('khoi', 'toan_bk') then raise exception 'Phạm vi không hợp lệ.'; end if;
  v_ky := coalesce(p_ky, l.ky_mac_dinh);
  if not (v_ky = any(l.ky_cho_phep)) then raise exception 'Kỳ không hợp lệ cho bảng này.'; end if;
  select h.khoi into v_khoi from hoc_sinh h where h.id = v_me;
  if not l.san_sang then
    return jsonb_build_object('ma', l.ma, 'ten', l.ten, 'san_sang', false, 'ghi_chu', coalesce(l.ghi_chu, 'Sắp có'));
  end if;

  select array_agg(h.id) into v_hs from hoc_sinh h
  where h.trang_thai in ('dang_hoc', 'test') and public._hs_hien(h.id)
    and (p_pham_vi = 'toan_bk' or h.khoi is not distinct from v_khoi)
    and (not l.gan_mon or exists (select 1 from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id
                                  where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and lp.mon = p_mon));

  with r as (
    select g.hs, g.gia_tri,
           (row_number() over (order by g.gia_tri desc, g.phu desc nulls last, g.dat_luc asc nulls last, g.hs))::int as hang,
           (count(*) over ())::int as tong
    from public._bxh_gia_tri(p_loai, p_mon, v_ky, coalesce(v_hs, '{}')) g
  )
  select
    (select coalesce(max(r.tong), 0) from r),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'hang', t.hang, 'ten', h.ho_ten, 'ma_hs', h.ma_hs, 'lop', lc.ten_lop, 'gia_tri', t.gia_tri, 'la_toi', t.hs = v_me) order by t.hang), '[]'::jsonb)
       from r t join hoc_sinh h on h.id = t.hs
       left join lateral (select lp.ten_lop from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id
                          where hl.hoc_sinh_id = t.hs and hl.trang_thai = 'dang_hoc' and (not l.gan_mon or lp.mon = p_mon)
                          order by hl.ngay_vao desc nulls last limit 1) lc on true
       where t.hang <= 20),
    (select jsonb_build_object('hang', t.hang, 'gia_tri', t.gia_tri) from r t where t.hs = v_me)
  into v_tong, v_top, v_toi;

  return jsonb_build_object('ma', l.ma, 'ten', l.ten, 'don_vi', l.don_vi, 'san_sang', true, 'ky', v_ky, 'pham_vi', p_pham_vi, 'khoi', v_khoi,
                            'tong', v_tong, 'top', v_top, 'toi', v_toi);
end $$;
revoke all on function public.fn_bxh(text, text, text, text) from public, anon;
grant execute on function public.fn_bxh(text, text, text, text) to authenticated;

-- Danh mục bảng cho màn Bảng xếp hạng (không chứa dữ liệu học sinh)
create or replace function public.fn_bxh_danh_muc() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('ma', ma, 'nhom', nhom, 'ten', ten, 'mo_ta', mo_ta, 'don_vi', don_vi, 'gan_mon', gan_mon,
           'ky_cho_phep', ky_cho_phep, 'ky_mac_dinh', ky_mac_dinh, 'san_sang', san_sang, 'ghi_chu', ghi_chu) order by thu_tu), '[]'::jsonb)
  from bxh_loai where active
$$;
revoke all on function public.fn_bxh_danh_muc() from public, anon;
grant execute on function public.fn_bxh_danh_muc() to authenticated;
