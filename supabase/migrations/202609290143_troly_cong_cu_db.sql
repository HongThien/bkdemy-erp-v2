-- ============================================================================
-- 202609290143 — troly_cong_cu_db
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Đo 29/09 trên `troly_hoi_dap`: từ 19/08 có 14 câu hỏi thật, ~11 câu KHÔNG ra thứ người
--   hỏi cần. Bốn gốc rễ, cả bốn đều nằm ở chỗ công cụ:
--     1. Danh mục thiếu → model chọn bừa ("điểm ET lớp 9A1" bị gọi sang công cụ MT).
--     2. Công cụ chạy ở CLIENT, kết quả KHÔNG quay lại model → không hỏi tiếp được
--        (một người hỏi 7 câu liền về cùng 1 HS vẫn chỉ nhận lại đúng 1 thẻ trung bình).
--     3. Hai danh mục chép tay (5 công cụ TS ở `troly-tracuu.ts` + 11 lệnh SQL ở
--        `scripts/hoidap/tools.mjs`) — phạm luật §2.0 "nguồn công thức DUY NHẤT là Postgres".
--     4. Bảng sạch 42k token/câu vì phải chở hết dữ liệu thô thay cho công cụ.
--   ⇒ Danh mục công cụ + phần thực thi về MỘT chỗ: Postgres. Server (`api/troly.mjs`) chỉ
--     gọi `fn_troly_danh_muc()` lấy danh mục và `fn_troly_goi(tên, tham số)` để chạy, bằng
--     ĐÚNG token của người hỏi ⇒ RLS vẫn lọc, không cần service-role. Thêm công cụ mới =
--     1 migration, không phải deploy lại client/server.
--
--   CEO 29/09: trợ lý CHỈ mở cho 3 người (Thùy · Thùy Trang · Bảo Lộc). Danh sách người
--   KHÔNG chép lại ở đây — `troly_duoc_dung()` gọi thẳng `hoi_dap_duoc_dung()` (mig
--   202608291205) để hai tab dùng chung MỘT danh sách. Cổng chặn ở DB, trong TỪNG hàm
--   (hàm invoker nên ai cũng gọi thẳng được hàm con — gác ở cửa chính thôi là hở).
--
--   Luật giữ nguyên từ bản cũ: model chỉ điền TÊN thô (HS/lớp/nhân sự), hàm tự tra tên → id;
--   trùng tên thì trả danh sách ứng viên để hỏi lại, KHÔNG tự chọn (CLAUDE.md §2).
--   Công thức điểm % KHÔNG viết lại: gọi `fn_matrix_lop` (ma trận lớp đang hiển thị trên app),
--   mastery gọi `fn_mastery_cells`, việc vận hành gọi `fn_viec_buoi_thuong`, học phí gọi
--   `hoc_phi_theo_mon_ky`.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Chỉ thêm hàm mới + 1 cột nullable `troly_hoi_dap.buoc`.
-- ============================================================================

alter table troly_hoi_dap add column if not exists buoc jsonb;
comment on column troly_hoi_dap.buoc is
  'Các bước công cụ model đã gọi trong lượt này: [{cong_cu, tham_so, ket_qua}] — giữ để truy "số này lấy từ đâu".';

-- ── CỔNG ────────────────────────────────────────────────────────────────────
-- coalesce: anon không có jwt ⇒ `null in (...)` = NULL, mà `if not NULL` KHÔNG vào nhánh chặn.
create or replace function public.troly_duoc_dung() returns boolean
language sql stable as $$ select coalesce(public.hoi_dap_duoc_dung(), false) $$;

create or replace function public._troly_gac() returns void
language plpgsql stable as $$
begin
  if not public.troly_duoc_dung() then
    raise exception 'Trợ lý chỉ mở cho nhóm được cấp quyền.' using errcode = '42501';
  end if;
end $$;

-- ── TIỆN ÍCH NGÀY (giờ VN) ──────────────────────────────────────────────────
create or replace function public._troly_hom_nay() returns date
language sql stable as $$ select (now() at time zone 'Asia/Ho_Chi_Minh')::date $$;

create or replace function public._troly_ngay(p text, p_mac_dinh date) returns date
language plpgsql stable as $$
begin
  if p is null or btrim(p) = '' then return p_mac_dinh; end if;
  return btrim(p)::date;
exception when others then
  raise exception 'Ngày "%" không đúng dạng YYYY-MM-DD.', p;
end $$;

-- 'YYYY-MM' → ngày 1 của tháng
create or replace function public._troly_thang(p text, p_mac_dinh date) returns date
language plpgsql stable as $$
begin
  if p is null or btrim(p) = '' then return date_trunc('month', p_mac_dinh)::date; end if;
  return (substr(btrim(p), 1, 7) || '-01')::date;
exception when others then
  raise exception 'Tháng "%" không đúng dạng YYYY-MM.', p;
end $$;

create or replace function public._troly_dau_tuan(p date) returns date
language sql immutable as $$ select p - (extract(isodow from p)::int - 1) $$;

-- Tên dạng + môn của 1 mã dạng. Bảng bản đồ lấy qua registry `_kho_ban_do_tbl`, không gõ tên bảng.
create or replace function public._troly_ten_dang(p_ma text) returns jsonb
language plpgsql stable as $$
declare r record; v text;
begin
  if p_ma is null then return null; end if;
  for r in select * from (values ('Toán', null::text), ('Toán', 'hinh_gt'), ('KHTN', null)) t(mon, nhanh) loop
    execute format('select ten_dang from %I where ma_dang = $1 limit 1', public._kho_ban_do_tbl(r.mon, r.nhanh))
      into v using p_ma;
    if v is not null then return jsonb_build_object('mon', r.mon, 'ten', v); end if;
  end loop;
  return null;
end $$;

-- ── TRA TÊN → 1 ĐỐI TƯỢNG ───────────────────────────────────────────────────
-- Trả {id,...} khi ra ĐÚNG 1; ngược lại {loi, thong_diep, ung_vien[]}. Ưu tiên: đang học/đang làm
-- trước, khớp NGUYÊN tên trước khớp chứa. Vẫn >1 thì trả danh sách — không tự chọn.
create or replace function public._troly_chon_hs(p_ten text, p_lop text default null) returns jsonb
language plpgsql stable as $$
declare
  v_q text := public.fn_bo_dau(btrim(coalesce(p_ten, '')));
  v_lop text := nullif(public.fn_bo_dau(btrim(coalesce(p_lop, ''))), '');
  v_n int; v jsonb;
begin
  if v_q = '' then return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'Thiếu tên học sinh.'); end if;
  with c as (
    select hs.id, hs.ho_ten, hs.ma_hs, hs.khoi, hs.trang_thai, hs.phu_huynh_id,
           (public.fn_bo_dau(hs.ho_ten) = v_q or lower(hs.ma_hs) = v_q) as khop_dung,
           (select string_agg(l.ten_lop || ' (' || l.mon || ')', ', ' order by l.ten_lop)
              from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc') as lop_dang_hoc
    from hoc_sinh hs
    where (public.fn_bo_dau(hs.ho_ten) like '%' || v_q || '%' or lower(hs.ma_hs) = v_q)
      and (v_lop is null or exists (
            select 1 from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.hoc_sinh_id = hs.id and public.fn_bo_dau(l.ten_lop) = v_lop))
  ),
  l1 as (select * from c where trang_thai = 'dang_hoc' or not exists (select 1 from c where trang_thai = 'dang_hoc')),
  l2 as (select * from l1 where khop_dung or not exists (select 1 from l1 where khop_dung))
  select count(*), jsonb_agg(jsonb_build_object(
           'id', x.id, 'ho_ten', x.ho_ten, 'ma_hs', x.ma_hs, 'khoi', x.khoi, 'trang_thai', x.trang_thai,
           'lop_dang_hoc', x.lop_dang_hoc, 'phu_huynh_id', x.phu_huynh_id))
    into v_n, v
  from (select * from l2 order by ho_ten limit 12) x;

  if v_n = 0 then
    return jsonb_build_object('loi', 'khong_thay', 'thong_diep',
      format('Không tìm thấy học sinh nào khớp "%s"%s.', btrim(p_ten), case when v_lop is not null then ' ở lớp ' || btrim(p_lop) else '' end));
  elsif v_n = 1 then
    return v->0;
  end if;
  return jsonb_build_object('loi', 'trung_ten',
    'thong_diep', format('Có %s học sinh khớp "%s" — cần hỏi lại người dùng là em nào (kèm lớp hoặc mã HS).', v_n, btrim(p_ten)),
    'ung_vien', (select jsonb_agg(e - 'id' - 'phu_huynh_id') from jsonb_array_elements(v) e));
end $$;

create or replace function public._troly_chon_lop(p_ten text) returns jsonb
language plpgsql stable as $$
declare v_q text := public.fn_bo_dau(btrim(coalesce(p_ten, ''))); v_n int; v jsonb;
begin
  if v_q = '' then return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'Thiếu tên lớp.'); end if;
  with c as (
    select l.id, l.ten_lop, l.mon, l.khoi, l.trang_thai, (public.fn_bo_dau(l.ten_lop) = v_q) as khop_dung
    from lop l where public.fn_bo_dau(l.ten_lop) like '%' || v_q || '%'
  ),
  l1 as (select * from c where khop_dung or not exists (select 1 from c where khop_dung)),
  l2 as (select * from l1 where trang_thai = 'dang_hoc' or not exists (select 1 from l1 where trang_thai = 'dang_hoc'))
  select count(*), jsonb_agg(jsonb_build_object('id', x.id, 'ten_lop', x.ten_lop, 'mon', x.mon, 'khoi', x.khoi, 'trang_thai', x.trang_thai))
    into v_n, v
  from (select * from l2 order by ten_lop limit 12) x;

  if v_n = 0 then
    return jsonb_build_object('loi', 'khong_thay', 'thong_diep', format('Không tìm thấy lớp nào khớp "%s".', btrim(p_ten)));
  elsif v_n = 1 then
    return v->0;
  end if;
  return jsonb_build_object('loi', 'trung_ten',
    'thong_diep', format('Có %s lớp khớp "%s" — cần hỏi lại người dùng là lớp nào.', v_n, btrim(p_ten)),
    'ung_vien', (select jsonb_agg(e - 'id') from jsonb_array_elements(v) e));
end $$;

create or replace function public._troly_chon_ns(p_ten text) returns jsonb
language plpgsql stable as $$
declare v_q text := public.fn_bo_dau(btrim(coalesce(p_ten, ''))); v_n int; v jsonb;
begin
  if v_q = '' then return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'Thiếu tên nhân viên.'); end if;
  with c as (
    select ns.id, ns.ho_ten, ns.ma_ns, ns.trang_thai,
           (public.fn_bo_dau(ns.ho_ten) = v_q or lower(ns.ma_ns) = v_q) as khop_dung
    from nhan_su ns
    where public.fn_bo_dau(ns.ho_ten) like '%' || v_q || '%' or lower(ns.ma_ns) = v_q
  ),
  l1 as (select * from c where trang_thai = 'dang_lam' or not exists (select 1 from c where trang_thai = 'dang_lam')),
  l2 as (select * from l1 where khop_dung or not exists (select 1 from l1 where khop_dung))
  select count(*), jsonb_agg(jsonb_build_object('id', x.id, 'ho_ten', x.ho_ten, 'ma_ns', x.ma_ns, 'trang_thai', x.trang_thai))
    into v_n, v
  from (select * from l2 order by ho_ten limit 12) x;

  if v_n = 0 then
    return jsonb_build_object('loi', 'khong_thay', 'thong_diep', format('Không tìm thấy nhân viên nào khớp "%s".', btrim(p_ten)));
  elsif v_n = 1 then
    return v->0;
  end if;
  return jsonb_build_object('loi', 'trung_ten',
    'thong_diep', format('Có %s nhân viên khớp "%s" — cần hỏi lại người dùng là ai.', v_n, btrim(p_ten)),
    'ung_vien', (select jsonb_agg(e - 'id') from jsonb_array_elements(v) e));
end $$;

-- Ma trận lớp theo KHOẢNG NGÀY: lặp từng tháng gọi `fn_matrix_lop` (nguồn công thức % duy nhất).
create or replace function public._troly_matrix(p_lop uuid, p_phase text, p_tu date, p_den date)
returns table(ngay date, buoi_hoc_id uuid, hoc_sinh_id uuid, pct integer, status text)
language sql stable as $$
  select b.ngay, m.buoi_hoc_id, m.hoc_sinh_id, m.pct, m.status
  from generate_series(date_trunc('month', p_tu::timestamp), date_trunc('month', p_den::timestamp), interval '1 month') g(thang)
  cross join lateral public.fn_matrix_lop(p_lop, p_phase, to_char(g.thang, 'YYYY-MM')) m
  join buoi_hoc b on b.id = m.buoi_hoc_id
  where b.ngay between p_tu and p_den
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- CÔNG CỤ. Khuôn: `_troly_cc_<tên>(p jsonb) returns jsonb`, tự gác cổng, tự khai `ghi_chu`
-- (giới hạn của con số) và `da_cat` (cắt mà không nói = người đọc hiểu thành toàn bộ).
-- ════════════════════════════════════════════════════════════════════════════

-- ① HỌC TẬP CỦA MỘT HỌC SINH ────────────────────────────────────────────────
create or replace function public._troly_cc_hoc_tap_hoc_sinh(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_hs jsonb; v_id uuid; v_mon text := nullif(btrim(p->>'mon'), '');
  v_den date; v_tu date; v jsonb;
begin
  perform public._troly_gac();
  v_hs := public._troly_chon_hs(p->>'ten_hoc_sinh', p->>'ten_lop');
  if v_hs ? 'loi' then return v_hs; end if;
  v_id := (v_hs->>'id')::uuid;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 60);
  if v_den - v_tu > 370 then v_tu := v_den - 370; end if;

  with lop_hs as (
    select distinct l.id, l.ten_lop, l.mon
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_id and (v_mon is null or l.mon = v_mon)
      and hl.ngay_vao <= v_den and (hl.ngay_roi is null or hl.ngay_roi >= v_tu)
  ),
  pha as (select unnest(array['et', 'btvn', 'mt']) as phase),
  mx as (
    select ph.phase, lh.ten_lop, lh.mon, m.ngay, m.buoi_hoc_id, m.pct, m.status
    from lop_hs lh cross join pha ph
    cross join lateral public._troly_matrix(lh.id, ph.phase, v_tu, v_den) m
    where m.hoc_sinh_id = v_id
  ),
  dem as (  -- số câu đúng/một phần/sai — đếm thô, không phải công thức
    select sp.phase, g.buoi_hoc_id,
           count(*) filter (where g.result = 'correct')::int as dung,
           count(*) filter (where g.result = 'partial')::int as mot_phan,
           count(*) filter (where g.result = 'wrong')::int as sai
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where g.hoc_sinh_id = v_id and sp.phase in ('et', 'btvn', 'mt')
      and g.buoi_hoc_id in (select buoi_hoc_id from mx)
    group by sp.phase, g.buoi_hoc_id
  ),
  ms as (
    select c.ma_dang, c.score, c.n, c.muc, c.tin, public._troly_ten_dang(c.ma_dang) as td
    from public.fn_mastery_cells(array[v_id]) c
  ),
  msl as (select * from ms where v_mon is null or td->>'mon' = v_mon or td is null)
  select jsonb_build_object(
    'hoc_sinh', v_hs - 'id' - 'phu_huynh_id',
    'mon_loc', v_mon,
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'elo', (select coalesce(jsonb_agg(jsonb_build_object('mon', e.mon, 'elo', e.elo, 'so_buoi_da_tinh', e.sessions_played) order by e.mon), '[]'::jsonb)
              from gami_elo e where e.hoc_sinh_id = v_id and (v_mon is null or e.mon = v_mon)),
    'mastery_tong', (select jsonb_build_object(
                        'so_dang_da_do', count(*),
                        'dat', count(*) filter (where muc = 'dat'),
                        'can_luyen', count(*) filter (where muc = 'can_luyen'),
                        'yeu', count(*) filter (where muc = 'yeu'),
                        'do_tin_thap', count(*) filter (where tin = 'thap')) from msl),
    'dang_yeu_va_can_luyen', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select ma_dang, td->>'ten' as ten_dang, td->>'mon' as mon, muc,
               round(score * 100)::int as diem_pct, n as so_lan_do, tin as do_tin
        from msl where muc in ('yeu', 'can_luyen') order by score, ma_dang limit 40) x),
    'et_tung_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select mx.ngay, mx.ten_lop, mx.mon, mx.pct as diem_pct, mx.status as trang_thai, d.dung, d.mot_phan, d.sai
        from mx left join dem d on d.phase = 'et' and d.buoi_hoc_id = mx.buoi_hoc_id
        where mx.phase = 'et' order by mx.ngay desc, mx.ten_lop limit 60) x),
    'btvn_tung_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select mx.ngay, mx.ten_lop, mx.mon, mx.pct as diem_pct, mx.status as trang_thai,
               k.trang_thai_nop, k.thai_do, d.dung, d.mot_phan, d.sai
        from mx left join dem d on d.phase = 'btvn' and d.buoi_hoc_id = mx.buoi_hoc_id
        left join btvn_ket_qua k on k.buoi_hoc_id = mx.buoi_hoc_id and k.hoc_sinh_id = v_id
        where mx.phase = 'btvn' order by mx.ngay desc, mx.ten_lop limit 60) x),
    'mt_tung_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select mx.ngay, mx.ten_lop, mx.mon, mx.pct as diem_pct, mx.status as trang_thai, d.dung, d.mot_phan, d.sai
        from mx left join dem d on d.phase = 'mt' and d.buoi_hoc_id = mx.buoi_hoc_id
        where mx.phase = 'mt' order by mx.ngay desc, mx.ten_lop limit 60) x),
    'diem_thi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select kt.ngay, kt.ten as ky_thi, kt.loai, kt.mon, dt.diem, dt.diem_co_ban, dt.diem_nang_cao, dt.verdict as ket_qua
        from diem_thi dt join ky_thi kt on kt.id = dt.ky_thi_id
        where dt.hoc_sinh_id = v_id and (v_mon is null or kt.mon = v_mon)
          and (kt.ngay is null or kt.ngay between v_tu and v_den)
        order by kt.ngay desc nulls last limit 30) x),
    'diem_danh', (select jsonb_build_object(
        'so_buoi', count(*),
        'co_mat', count(*) filter (where h.diem_danh = 'co_mat'),
        'vang', count(*) filter (where h.diem_danh = 'vang'),
        'vang_phep', count(*) filter (where h.diem_danh = 'vang_phep'),
        'ngay_vang', coalesce(jsonb_agg(jsonb_build_object('ngay', b.ngay, 'lop', l.ten_lop, 'loai', h.diem_danh) order by b.ngay desc)
                       filter (where h.diem_danh in ('vang', 'vang_phep')), '[]'::jsonb))
        from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
        left join lop l on l.id = b.lop_id
        where h.hoc_sinh_id = v_id and b.ngay between v_tu and v_den and (v_mon is null or l.mon = v_mon)),
    'danh_gia_sau_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select b.ngay, l.ten_lop, dg.muc_ma as muc, dg.hoan_thanh_pct, left(dg.nhan_xet, 400) as nhan_xet
        from buoi_danh_gia dg join buoi_hoc b on b.id = dg.buoi_hoc_id left join lop l on l.id = b.lop_id
        where dg.hoc_sinh_id = v_id and b.ngay between v_tu and v_den and (v_mon is null or l.mon = v_mon)
        order by b.ngay desc limit 15) x),
    'ghi_chu', jsonb_build_array(
      'Điểm % từng buổi lấy từ ma trận lớp (đúng số hiển thị trên app), chỉ có buổi THƯỜNG mà khâu đó ĐÃ ĐÓNG. Buổi chưa đóng khâu thì không có dòng — không phải em không làm.',
      'trang_thai: done = có điểm · khong_lam = không làm/xin phép · vang = vắng buổi đó.',
      'Mastery (đạt/cần luyện/yếu) suy động từ MỌI lần đo của dạng tới hiện tại, KHÔNG cắt theo khoảng ngày. Dạng chưa đo thì không có trong danh sách — chưa đo KHÁC yếu.',
      'Chưa gồm mastery Hình học theo mô hình (nguồn riêng).')
  ) into v;
  return v;
end $$;

-- ② KẾT QUẢ CỦA MỘT LỚP THEO BUỔI (ET · BTVN · MT) ───────────────────────────
create or replace function public._troly_cc_ket_qua_lop(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lop jsonb; v_id uuid; v_loai text := lower(btrim(coalesce(p->>'loai', '')));
  v_den date; v_tu date; v jsonb;
begin
  perform public._troly_gac();
  if v_loai not in ('et', 'btvn', 'mt') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'Tham số loai phải là: et | btvn | mt.');
  end if;
  v_lop := public._troly_chon_lop(p->>'ten_lop');
  if v_lop ? 'loi' then return v_lop; end if;
  v_id := (v_lop->>'id')::uuid;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 30);
  if v_den - v_tu > 186 then v_tu := v_den - 186; end if;

  with mx as (select * from public._troly_matrix(v_id, v_loai, v_tu, v_den)),
  buoi_tat_ca as (
    select b.id, b.ngay,
           case v_loai when 'et' then b.et_dong_at when 'mt' then b.mt_dong_at else b.btvn_dong_at end as dong_at
    from buoi_hoc b
    where b.lop_id = v_id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
  )
  select jsonb_build_object(
    'lop', v_lop - 'id', 'loai', v_loai,
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'so_buoi_trong_khoang', (select count(*) from buoi_tat_ca),
    'so_buoi_da_dong_khau_nay', (select count(*) from buoi_tat_ca where dong_at is not null),
    'buoi_chua_dong_khau_nay', (select coalesce(jsonb_agg(ngay order by ngay), '[]'::jsonb) from buoi_tat_ca where dong_at is null),
    'theo_buoi', (select coalesce(jsonb_agg(to_jsonb(x) order by x.ngay), '[]'::jsonb) from (
        select mx.ngay,
               count(*) filter (where mx.status = 'done')::int as so_hs_co_diem,
               round(avg(mx.pct) filter (where mx.status = 'done'))::int as diem_tb_pct,
               count(*) filter (where mx.status = 'khong_lam')::int as so_hs_khong_lam,
               count(*) filter (where mx.status = 'vang')::int as so_hs_vang
        from mx group by mx.ngay) x),
    'theo_hoc_sinh', (select coalesce(jsonb_agg(to_jsonb(x) order by x.ho_ten), '[]'::jsonb) from (
        select hs.ho_ten, hs.ma_hs,
               round(avg(mx.pct) filter (where mx.status = 'done'))::int as diem_tb_pct,
               count(*) filter (where mx.status = 'done')::int as so_buoi_co_diem,
               count(*) filter (where mx.status = 'khong_lam')::int as so_buoi_khong_lam,
               count(*) filter (where mx.status = 'vang')::int as so_buoi_vang,
               jsonb_agg(jsonb_build_object('ngay', mx.ngay, 'diem_pct', mx.pct, 'trang_thai', mx.status) order by mx.ngay) as tung_buoi
        from mx join hoc_sinh hs on hs.id = mx.hoc_sinh_id
        group by hs.id, hs.ho_ten, hs.ma_hs) x),
    'ghi_chu', jsonb_build_array(
      'Số lấy từ ma trận lớp (đúng số hiển thị trên app). Chỉ có buổi THƯỜNG mà khâu này ĐÃ ĐÓNG; buổi chưa đóng liệt kê riêng ở buoi_chua_dong_khau_nay.',
      'diem_tb_pct là trung bình cộng các buổi CÓ điểm, không tính buổi vắng/không làm.',
      'trang_thai: done = có điểm · khong_lam = không làm/xin phép · vang = vắng.')
  ) into v;
  return v;
end $$;

-- ③ TÌNH TRẠNG DỮ LIỆU CÁC BUỔI HỌC ─────────────────────────────────────────
create or replace function public._troly_cc_tinh_trang_buoi(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lop jsonb; v_lop_id uuid;
  v_khoi text := nullif(btrim(p->>'khoi'), ''); v_mon text := nullif(btrim(p->>'mon'), '');
  v_den date; v_tu date; v_chi_thieu boolean; v_chi_tiet boolean; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den);
  if v_tu > v_den then v_tu := v_den; end if;
  if v_den - v_tu > 120 then v_tu := v_den - 120; end if;
  -- Khoảng dài mà liệt kê mọi buổi thì trôi mất thứ cần nhìn ⇒ mặc định chỉ buổi có vấn đề.
  v_chi_thieu := coalesce((p->>'chi_buoi_co_van_de')::boolean, v_den - v_tu > 7);
  v_chi_tiet := v_den - v_tu <= 7;   -- khoảng ngắn mới trả đủ cột từng buổi; khoảng dài chỉ trả thứ đang thiếu

  -- ⚠ Gom TRƯỚC rồi join, KHÔNG đếm bằng subquery theo từng buổi: `gami_grades` và `btvn_ket_qua`
  --   không có index dẫn đầu bằng buoi_hoc_id ⇒ subquery tương quan = quét cả bảng × số buổi
  --   (đo 29/09: hỏi 90 ngày mất 17 giây). Đi qua `gami_session_problems` (có index buổi+phase).
  with b as (
    select bh.id, bh.ngay, bh.gio_bat_dau, bh.trang_thai, bh.lop_id, l.ten_lop, l.mon, l.khoi,
           bh.ingame_dong_at, bh.et_dong_at, bh.btvn_dong_at, bh.danh_gia_xong_at, bh.mt_dong_at
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between v_tu and v_den
      and (v_lop_id is null or bh.lop_id = v_lop_id)
      and (v_khoi is null or l.khoi = v_khoi) and (v_mon is null or l.mon = v_mon)
  ),
  pv as (  -- buổi thường LIỀN TRƯỚC của cùng lớp — nguồn nghĩa vụ BTVN của buổi này
    select b.id, q.id as truoc_id, q.ngay as truoc_ngay, q.btvn_dong_at as truoc_btvn_dong_at
    from b left join lateral (
      select q.id, q.ngay, q.btvn_dong_at from buoi_hoc q
      where q.lop_id = b.lop_id and q.loai = 'thuong' and q.trang_thai <> 'huy' and q.ngay < b.ngay
      order by q.ngay desc limit 1) q on true
  ),
  tl as (
    select t.lop_id, t.ngay, bool_or(t.loai = 'et') as co_et, bool_or(t.loai = 'btvn') as co_btvn, bool_or(t.loai = 'mt_buoi') as co_mt
    from tai_lieu t
    where t.loai in ('et', 'btvn', 'mt_buoi')
      and (t.lop_id, t.ngay) in (select b.lop_id, b.ngay from b
                                 union select b.lop_id, pv.truoc_ngay from b join pv on pv.id = b.id where pv.truoc_ngay is not null)
    group by t.lop_id, t.ngay
  ),
  de_on as (select distinct bt.lop_id, bt.ngay from bai_test bt where bt.loai = 'et' and bt.ngay between v_tu and v_den),
  de_gsp as (select distinct sp.buoi_hoc_id from gami_session_problems sp
              where sp.phase = 'et' and sp.buoi_hoc_id in (select id from b)),
  et_hs as (
    select u.buoi_hoc_id, count(*)::int as n from (
      select sp.buoi_hoc_id, g.hoc_sinh_id
        from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
       where sp.phase = 'et' and sp.buoi_hoc_id in (select id from b)
      union
      select b.id, bl.hoc_sinh_id
        from b join bai_test bt on bt.loai = 'et' and bt.lop_id = b.lop_id and bt.ngay = b.ngay
        join bai_lam bl on bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') u
    group by u.buoi_hoc_id
  ),
  dd as (
    select h.buoi_hoc_id,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(*) filter (where h.diem_danh in ('vang', 'vang_phep'))::int as vang,
           count(*) filter (where h.diem_danh is null)::int as chua_diem_danh
    from buoi_hoc_hs h where h.buoi_hoc_id in (select id from b) group by h.buoi_hoc_id
  ),
  kq as (
    select k.buoi_hoc_id, count(*)::int as n from btvn_ket_qua k
    where k.buoi_hoc_id in (select id from b union select truoc_id from pv where truoc_id is not null)
    group by k.buoi_hoc_id
  ),
  dg as (
    select d.buoi_hoc_id, count(*)::int as n,
           count(*) filter (where nullif(btrim(d.nhan_xet), '') is not null)::int as n_nx
    from buoi_danh_gia d where d.buoi_hoc_id in (select id from b) group by d.buoi_hoc_id
  ),
  x as (
    select b.*,
      (coalesce(tl.co_et, false) or de_on.lop_id is not null or de_gsp.buoi_hoc_id is not null) as co_de_et,
      coalesce(tl.co_btvn, false) as co_btvn,
      coalesce(tl.co_mt, false) as co_mt,
      coalesce(dd.co_mat, 0) as co_mat, coalesce(dd.vang, 0) as vang, coalesce(dd.chua_diem_danh, 0) as chua_diem_danh,
      coalesce(et_hs.n, 0) as hs_co_diem_et,
      coalesce(kq.n, 0) as hs_co_btvn,
      coalesce(dg.n, 0) as hs_co_danh_gia, coalesce(dg.n_nx, 0) as hs_co_nhan_xet,
      pv.truoc_ngay, pv.truoc_btvn_dong_at,
      coalesce(tlp.co_btvn, false) as truoc_co_btvn,
      coalesce(kqp.n, 0) as truoc_hs_co_btvn
    from b
    join pv on pv.id = b.id
    left join tl on tl.lop_id = b.lop_id and tl.ngay = b.ngay
    left join tl tlp on tlp.lop_id = b.lop_id and tlp.ngay = pv.truoc_ngay
    left join de_on on de_on.lop_id = b.lop_id and de_on.ngay = b.ngay
    left join de_gsp on de_gsp.buoi_hoc_id = b.id
    left join et_hs on et_hs.buoi_hoc_id = b.id
    left join dd on dd.buoi_hoc_id = b.id
    left join kq on kq.buoi_hoc_id = b.id
    left join kq kqp on kqp.buoi_hoc_id = pv.truoc_id
    left join dg on dg.buoi_hoc_id = b.id
  ),
  y as (
    select x.*,
      array_remove(array[
        case when x.co_de_et and x.et_dong_at is null then 'et' end,
        case when x.danh_gia_xong_at is null then 'danh_gia' end,
        case when x.co_mt and x.mt_dong_at is null then 'mt' end,
        case when x.truoc_co_btvn and x.truoc_btvn_dong_at is null then 'btvn_buoi_truoc' end,
        case when x.chua_diem_danh > 0 then 'diem_danh' end
      ], null) as thieu,
      array_remove(array[
        case when x.et_dong_at is not null and x.co_de_et and x.hs_co_diem_et = 0 then 'et' end,
        case when x.danh_gia_xong_at is not null and x.hs_co_danh_gia = 0 then 'danh_gia' end,
        case when x.danh_gia_xong_at is not null and x.hs_co_danh_gia > 0 and x.hs_co_nhan_xet = 0 then 'danh_gia_khong_nhan_xet' end,
        case when x.btvn_dong_at is not null and x.co_btvn and x.hs_co_btvn = 0 then 'btvn' end
      ], null) as dong_ma_khong_co_du_lieu
    from x
  ),
  z as (select * from y where not v_chi_thieu or cardinality(thieu) > 0 or cardinality(dong_ma_khong_co_du_lieu) > 0),
  -- Lớp có LỊCH (TKB) trong khoảng mà buổi CHƯA MỞ — `buoi_hoc` chỉ có dòng khi đã mở.
  chua_mo as (
    select d.ngay::date as ngay, l.ten_lop, l.mon, t.gio_bat_dau
    from generate_series(v_tu::timestamp, least(v_den, v_tu + 7)::timestamp, interval '1 day') d(ngay)
    join thoi_khoa_bieu t on t.thu = extract(isodow from d.ngay)::int + 1
         and t.hieu_luc_tu <= d.ngay::date and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay::date)
    join lop l on l.id = t.lop_id and l.trang_thai = 'dang_hoc'
    where v_den - v_tu <= 7
      and (v_lop_id is null or l.id = v_lop_id)
      and (v_khoi is null or l.khoi = v_khoi) and (v_mon is null or l.mon = v_mon)
      and not exists (select 1 from buoi_hoc bh where bh.lop_id = t.lop_id and bh.ngay = d.ngay::date and bh.loai = 'thuong')
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('lop', v_lop->>'ten_lop', 'khoi', v_khoi, 'mon', v_mon, 'chi_buoi_co_van_de', v_chi_thieu),
    'tong', (select jsonb_build_object(
        'so_buoi_da_mo', count(*),
        'so_buoi_du_du_lieu', count(*) filter (where cardinality(thieu) = 0 and cardinality(dong_ma_khong_co_du_lieu) = 0),
        'thieu_et', count(*) filter (where 'et' = any(thieu)),
        'thieu_danh_gia', count(*) filter (where 'danh_gia' = any(thieu)),
        'thieu_mt', count(*) filter (where 'mt' = any(thieu)),
        'thieu_btvn_buoi_truoc', count(*) filter (where 'btvn_buoi_truoc' = any(thieu)),
        'chua_diem_danh_du', count(*) filter (where 'diem_danh' = any(thieu)),
        'dong_ma_khong_co_du_lieu', count(*) filter (where cardinality(dong_ma_khong_co_du_lieu) > 0)) from y),
    'theo_lop', (select coalesce(jsonb_agg(to_jsonb(g) order by g.so_buoi_co_van_de desc, g.ten_lop), '[]'::jsonb) from (
        select ten_lop, mon, count(*)::int as so_buoi,
               count(*) filter (where cardinality(thieu) > 0 or cardinality(dong_ma_khong_co_du_lieu) > 0)::int as so_buoi_co_van_de,
               count(*) filter (where 'et' = any(thieu))::int as thieu_et,
               count(*) filter (where 'danh_gia' = any(thieu))::int as thieu_danh_gia,
               count(*) filter (where 'btvn_buoi_truoc' = any(thieu))::int as thieu_btvn_buoi_truoc,
               count(*) filter (where cardinality(dong_ma_khong_co_du_lieu) > 0)::int as dong_ma_khong_co_du_lieu,
               min(ngay) filter (where cardinality(thieu) > 0 or cardinality(dong_ma_khong_co_du_lieu) > 0) as buoi_co_van_de_cu_nhat
        from y group by ten_lop, mon) g
      where not v_chi_thieu or g.so_buoi_co_van_de > 0),
    'buoi', (select coalesce(jsonb_agg(r.dong), '[]'::jsonb) from (
        select case when v_chi_tiet then jsonb_build_object(
                 'ngay', ngay, 'ten_lop', ten_lop, 'mon', mon, 'gio', to_char(gio_bat_dau, 'HH24:MI'),
                 'co_mat', co_mat, 'vang', vang, 'chua_diem_danh', chua_diem_danh,
                 'co_de_et', co_de_et, 'et_da_dong', et_dong_at is not null, 'hs_co_diem_et', hs_co_diem_et,
                 'danh_gia_da_dong', danh_gia_xong_at is not null, 'hs_co_danh_gia', hs_co_danh_gia, 'hs_co_nhan_xet', hs_co_nhan_xet,
                 'buoi_nay_co_giao_btvn', co_btvn,
                 'btvn_den_han_la_cua_buoi', truoc_ngay, 'buoi_truoc_co_giao_btvn', truoc_co_btvn,
                 'btvn_buoi_truoc_da_nhap', truoc_btvn_dong_at is not null, 'btvn_buoi_truoc_so_hs_da_nhap', truoc_hs_co_btvn,
                 'co_mt', co_mt, 'mt_da_dong', mt_dong_at is not null,
                 'thieu', thieu, 'dong_ma_khong_co_du_lieu', dong_ma_khong_co_du_lieu)
               else jsonb_build_object(
                 'ngay', ngay, 'ten_lop', ten_lop, 'thieu', thieu, 'dong_ma_khong_co_du_lieu', dong_ma_khong_co_du_lieu)
               end as dong
        from z order by ngay desc, ten_lop limit c_tran) r),
    'da_cat', (select count(*) > c_tran from z),
    'lop_co_lich_nhung_chua_mo_buoi', (select coalesce(jsonb_agg(to_jsonb(cm) order by cm.ngay, cm.gio_bat_dau), '[]'::jsonb) from chua_mo cm),
    'ghi_chu', jsonb_build_array(
      'Chỉ xét buổi THƯỜNG không bị huỷ. Buổi chỉ có dòng khi ĐÃ MỞ; lớp có lịch mà chưa mở liệt kê riêng (chỉ khi khoảng hỏi ≤ 7 ngày).',
      'thieu.et chỉ tính khi buổi CÓ đề ET gắn vào; buổi không có đề thì không đòi. thieu.danh_gia đòi ở MỌI buổi.',
      'BTVN chấm ở buổi KẾ: "btvn_buoi_truoc" = BTVN giao ở buổi trước của lớp đó, đến hạn nhập vào buổi này.',
      'dong_ma_khong_co_du_lieu = khâu đã bấm đóng nhưng hệ không có dòng dữ liệu nào (hoặc có dòng đánh giá mà không có nhận xét).',
      'Hệ KHÔNG ghi vì sao một khâu thiếu, và báo cáo dừng ở mức lớp/buổi — ai phải làm thì hỏi công cụ viec_van_hanh.',
      format('Danh sách "buoi" cắt ở %s dòng (mới nhất trước); con số ở "tong" và "theo_lop" là ĐỦ, không bị cắt. Khoảng hỏi dài hơn 7 ngày thì mỗi buổi chỉ trả phần đang thiếu — cần đủ cột thì hỏi lại theo lớp hoặc khoảng ngắn hơn.', c_tran))
  ) into v;
  return v;
end $$;

-- ④ VIỆC VẬN HÀNH THEO NGƯỜI (ai nợ khâu nào của buổi nào) ───────────────────
create or replace function public._troly_cc_viec_van_hanh(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_ns jsonb; v_ns_id uuid; v_lop jsonb; v_lop_id uuid;
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'chua_xong'));
  v_den date; v_tu date; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_tt not in ('chua_xong', 'qua_han', 'da_xong', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: chua_xong | qua_han | da_xong | tat_ca.');
  end if;
  if nullif(btrim(p->>'ten_nhan_vien'), '') is not null then
    v_ns := public._troly_chon_ns(p->>'ten_nhan_vien');
    if v_ns ? 'loi' then return v_ns; end if;
    v_ns_id := (v_ns->>'id')::uuid;
  end if;
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 14);
  if v_den - v_tu > 120 then v_tu := v_den - 120; end if;

  with t as (
    select f.nhan_su_id, ns.ho_ten, f.ten_lop, f.ngay, f.vai, f.tab, f.dong_at, f.han,
           case when f.dong_at is not null and f.dong_at <= f.han then 'xong_dung_han'
                when f.dong_at is not null then 'xong_tre'
                when f.han < now() then 'chua_xong_qua_han'
                else 'chua_xong_con_han' end as tinh_trang
    from public.fn_viec_buoi_thuong(v_tu, v_den, true) f
    join nhan_su ns on ns.id = f.nhan_su_id
    where (v_ns_id is null or f.nhan_su_id = v_ns_id)
      and (v_lop_id is null or f.lop_id = v_lop_id)
  ),
  loc as (
    select * from t
    where v_tt = 'tat_ca'
       or (v_tt = 'chua_xong' and tinh_trang in ('chua_xong_qua_han', 'chua_xong_con_han'))
       or (v_tt = 'qua_han' and tinh_trang = 'chua_xong_qua_han')
       or (v_tt = 'da_xong' and tinh_trang in ('xong_dung_han', 'xong_tre'))
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('nhan_vien', v_ns->>'ho_ten', 'lop', v_lop->>'ten_lop', 'trang_thai', v_tt),
    'tong', (select jsonb_build_object(
        'so_viec', count(*),
        'xong_dung_han', count(*) filter (where tinh_trang = 'xong_dung_han'),
        'xong_tre', count(*) filter (where tinh_trang = 'xong_tre'),
        'chua_xong_qua_han', count(*) filter (where tinh_trang = 'chua_xong_qua_han'),
        'chua_xong_con_han', count(*) filter (where tinh_trang = 'chua_xong_con_han')) from t),
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.chua_xong_qua_han desc, g.ho_ten), '[]'::jsonb) from (
        select ho_ten, count(*)::int as so_viec,
               count(*) filter (where tinh_trang = 'xong_dung_han')::int as xong_dung_han,
               count(*) filter (where tinh_trang = 'xong_tre')::int as xong_tre,
               count(*) filter (where tinh_trang = 'chua_xong_qua_han')::int as chua_xong_qua_han,
               count(*) filter (where tinh_trang = 'chua_xong_con_han')::int as chua_xong_con_han
        from t group by ho_ten) g),
    'theo_khau', (select coalesce(jsonb_agg(to_jsonb(g) order by g.chua_xong_qua_han desc), '[]'::jsonb) from (
        select tab as khau, count(*)::int as so_viec,
               count(*) filter (where tinh_trang = 'chua_xong_qua_han')::int as chua_xong_qua_han,
               count(*) filter (where tinh_trang = 'chua_xong_con_han')::int as chua_xong_con_han
        from t group by tab) g),
    'viec', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ho_ten, vai, tab as khau, ten_lop, ngay as ngay_buoi,
               to_char(han at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') as han,
               to_char(dong_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') as dong_luc,
               tinh_trang
        from loc order by han, ho_ten, ten_lop limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'ghi_chu', jsonb_build_array(
      'Việc suy từ PHÂN CÔNG LỚP × buổi thường đã mở (cùng nguồn với màn Việc của tôi và bảng hiệu suất). khau: danhgia · ingame (chấm bài trên lớp) · et · btvn · mt.',
      'Chưa gồm việc của Ops (điểm danh, report, báo tan, chuẩn bị phòng) và việc phát triển — việc phát triển hỏi công cụ viec_phat_trien.',
      'tong / theo_nguoi / theo_khau đếm TẤT CẢ trạng thái trong khoảng (không theo bộ lọc trang_thai) và không bị cắt; danh sách "viec" mới theo bộ lọc.',
      format('Danh sách "viec" cắt ở %s dòng, hạn cũ nhất trước. Bị cắt thì lọc thêm theo người hoặc lớp.', c_tran))
  ) into v;
  return v;
end $$;

-- ⑤ VIỆC PHÁT TRIỂN (giao việc) ─────────────────────────────────────────────
create or replace function public._troly_cc_viec_phat_trien(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lam jsonb; v_lam_id uuid; v_giao jsonb; v_giao_id uuid;
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'dang_mo'));
  v_tu date; v_den date; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_tt not in ('dang_mo', 'qua_han', 'cho_nghiem_thu', 'da_xong', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: dang_mo | qua_han | cho_nghiem_thu | da_xong | tat_ca.');
  end if;
  if nullif(btrim(p->>'ten_nguoi_lam'), '') is not null then
    v_lam := public._troly_chon_ns(p->>'ten_nguoi_lam');
    if v_lam ? 'loi' then return v_lam; end if;
    v_lam_id := (v_lam->>'id')::uuid;
  end if;
  if nullif(btrim(p->>'ten_nguoi_giao'), '') is not null then
    v_giao := public._troly_chon_ns(p->>'ten_nguoi_giao');
    if v_giao ? 'loi' then return v_giao; end if;
    v_giao_id := (v_giao->>'id')::uuid;
  end if;
  -- Khoảng ngày lọc theo HẠN (deadline). Bỏ trống cả hai = không lọc theo hạn.
  v_tu := public._troly_ngay(p->>'han_tu_ngay', null);
  v_den := public._troly_ngay(p->>'han_den_ngay', null);

  with t as (
    select vc.tieu_de, vc.trang_thai, vc.deadline, vc.ngay_nop, vc.so_lan_tra_lai, vc.so_lan_gia_han,
           vc.phan_tram, vc.created_at, nl.ho_ten as nguoi_lam, ng.ho_ten as nguoi_giao,
           (vc.trang_thai in ('moi_giao', 'dang_lam', 'tra_lai') and vc.deadline is not null
             and vc.deadline < public._troly_hom_nay()) as qua_han
    from viec vc
    left join nhan_su nl on nl.id = vc.nguoi_lam_id
    join nhan_su ng on ng.id = vc.nguoi_giao_id
    where (v_lam_id is null or vc.nguoi_lam_id = v_lam_id)
      and (v_giao_id is null or vc.nguoi_giao_id = v_giao_id)
      and (v_tu is null or vc.deadline >= v_tu)
      and (v_den is null or vc.deadline <= v_den)
  ),
  loc as (
    select * from t
    where v_tt = 'tat_ca'
       or (v_tt = 'dang_mo' and trang_thai in ('moi_giao', 'dang_lam', 'tra_lai', 'cho_nghiem_thu', 'hold'))
       or (v_tt = 'qua_han' and qua_han)
       or (v_tt = 'cho_nghiem_thu' and trang_thai = 'cho_nghiem_thu')
       or (v_tt = 'da_xong' and trang_thai = 'dat')
  )
  select jsonb_build_object(
    'loc', jsonb_build_object('nguoi_lam', v_lam->>'ho_ten', 'nguoi_giao', v_giao->>'ho_ten',
                              'trang_thai', v_tt, 'han_tu_ngay', v_tu, 'han_den_ngay', v_den),
    'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                               from (select trang_thai, count(*)::int as n from t group by trang_thai) g),
    'so_viec_qua_han', (select count(*) from t where qua_han),
    'theo_nguoi_lam', (select coalesce(jsonb_agg(to_jsonb(g) order by g.qua_han desc, g.dang_mo desc), '[]'::jsonb) from (
        select coalesce(nguoi_lam, '(chưa giao ai)') as nguoi_lam,
               count(*) filter (where trang_thai in ('moi_giao', 'dang_lam', 'tra_lai', 'cho_nghiem_thu', 'hold'))::int as dang_mo,
               count(*) filter (where qua_han)::int as qua_han,
               count(*) filter (where trang_thai = 'cho_nghiem_thu')::int as cho_nghiem_thu,
               count(*) filter (where trang_thai = 'dat')::int as da_xong
        from t group by 1) g),
    'viec', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select tieu_de, trang_thai, deadline as han, qua_han, ngay_nop, nguoi_lam, nguoi_giao,
               so_lan_tra_lai, so_lan_gia_han, phan_tram as hieu_suat_pct
        from loc order by deadline nulls last, created_at limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'ghi_chu', jsonb_build_array(
      'trang_thai của việc: moi_giao · dang_lam · cho_nghiem_thu (đã nộp, chờ người giao duyệt) · tra_lai · hold · dat · huy · chuyen.',
      'qua_han = còn mở (mới giao/đang làm/trả lại) mà hạn đã qua. Việc không có hạn thì không bao giờ tính quá hạn.',
      'Các bảng tổng đếm theo bộ lọc NGƯỜI + HẠN, không theo bộ lọc trang_thai, và không bị cắt.',
      format('Danh sách "viec" cắt ở %s dòng.', c_tran))
  ) into v;
  return v;
end $$;

-- ⑥ HỌC PHÍ CỦA MỘT HỌC SINH ────────────────────────────────────────────────
create or replace function public._troly_cc_hoc_phi_hoc_sinh(p jsonb) returns jsonb
language plpgsql stable as $$
declare v_hs jsonb; v_id uuid; v_ph uuid; v_ky date; v jsonb;
begin
  perform public._troly_gac();
  -- `hoc_phi_theo_mon_ky` là DEFINER (mở cho mọi thành viên) ⇒ phải tự chặn theo quyền học phí
  -- ở đây, nếu không trợ lý thành đường vòng qua khoá nhóm TIỀN (mig 15/08).
  if not coalesce(public.co_chuc_nang('hocphi'), false) then
    return jsonb_build_object('loi', 'khong_co_quyen', 'thong_diep', 'Tài khoản đang hỏi không có quyền xem học phí.');
  end if;
  v_hs := public._troly_chon_hs(p->>'ten_hoc_sinh', p->>'ten_lop');
  if v_hs ? 'loi' then return v_hs; end if;
  v_id := (v_hs->>'id')::uuid;
  v_ph := nullif(v_hs->>'phu_huynh_id', '')::uuid;
  v_ky := public._troly_thang(p->>'thang', public._troly_hom_nay());

  select jsonb_build_object(
    'hoc_sinh', v_hs - 'id' - 'phu_huynh_id',
    'thang', to_char(v_ky, 'YYYY-MM'),
    'theo_lop', (select coalesce(jsonb_agg(e - 'hoc_sinh_id' - 'lop_id'), '[]'::jsonb)
                   from jsonb_array_elements(public.hoc_phi_theo_mon_ky(v_ky)) e
                  where e->>'hoc_sinh_id' = v_id::text),
    'tong_tinh_theo_lop', (select coalesce(sum((e->>'thanh_tien')::numeric), 0)
                   from jsonb_array_elements(public.hoc_phi_theo_mon_ky(v_ky)) e
                  where e->>'hoc_sinh_id' = v_id::text),
    'hoa_don_cua_phu_huynh', (select coalesce(jsonb_agg(jsonb_build_object(
                     'ky', to_char(hd.ky, 'YYYY-MM'), 'trang_thai', hd.trang_thai, 'tong_tien', hd.tong_tien,
                     'da_dong_luc', to_char(hd.dong_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD')) order by hd.ky desc), '[]'::jsonb)
                   from hoa_don hd where v_ph is not null and hd.phu_huynh_id = v_ph and hd.ky = v_ky),
    'ghi_chu', jsonb_build_array(
      'theo_lop = số tính của riêng em này trong tháng (học phí + học liệu + học đuổi), cùng nguồn với phiếu học phí trên app.',
      'Hoá đơn lập theo PHỤ HUYNH (gộp các con) nên tong_tien hoá đơn có thể lớn hơn số của riêng em này.',
      'Không có hoá đơn = tháng đó chưa lập hoá đơn, KHÔNG có nghĩa là đã đóng hay không nợ.',
      case when v_ph is null then 'Em này chưa gắn phụ huynh trong hệ thống nên không tra được hoá đơn.' else 'Chưa gồm dư nợ kỳ trước của phụ huynh.' end)
  ) into v;
  return v;
end $$;

-- ⑦ HOÁ ĐƠN CHƯA THU ĐỦ ─────────────────────────────────────────────────────
create or replace function public._troly_cc_hoc_phi_no(p jsonb) returns jsonb
language plpgsql stable as $$
declare v_ky date; v jsonb; c_tran constant int := 80;
begin
  perform public._troly_gac();
  if not coalesce(public.co_chuc_nang('hocphi'), false) then
    return jsonb_build_object('loi', 'khong_co_quyen', 'thong_diep', 'Tài khoản đang hỏi không có quyền xem học phí.');
  end if;
  if nullif(btrim(p->>'thang'), '') is not null then v_ky := public._troly_thang(p->>'thang', null); end if;

  with t as (
    select hd.ky, hd.trang_thai, hd.tong_tien, ph.ho_ten as phu_huynh,
           (select string_agg(hs.ho_ten, ', ' order by hs.ho_ten) from hoc_sinh hs
             where hs.phu_huynh_id = ph.id and hs.trang_thai = 'dang_hoc') as cac_con_dang_hoc
    from hoa_don hd join phu_huynh ph on ph.id = hd.phu_huynh_id
    where hd.trang_thai in ('chua_thu', 'thu_mot_phan', 'qua_han') and (v_ky is null or hd.ky = v_ky)
  )
  select jsonb_build_object(
    'thang', case when v_ky is null then 'mọi kỳ còn nợ' else to_char(v_ky, 'YYYY-MM') end,
    'tong', (select jsonb_build_object('so_hoa_don', count(*), 'tong_tien_hoa_don', coalesce(sum(tong_tien), 0)) from t),
    'theo_ky_va_trang_thai', (select coalesce(jsonb_agg(to_jsonb(g) order by g.ky desc, g.trang_thai), '[]'::jsonb) from (
        select to_char(ky, 'YYYY-MM') as ky, trang_thai, count(*)::int as so_hoa_don, sum(tong_tien) as tong_tien_hoa_don
        from t group by 1, 2) g),
    'hoa_don', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select to_char(ky, 'YYYY-MM') as ky, trang_thai, tong_tien, phu_huynh, cac_con_dang_hoc
        from t order by ky, phu_huynh limit c_tran) r),
    'da_cat', (select count(*) > c_tran from t),
    'ghi_chu', jsonb_build_array(
      'tong_tien là tổng hoá đơn, KHÔNG phải số còn nợ: hoá đơn "thu_mot_phan" đã thu một phần nhưng công cụ này chưa trừ phần đã thu.',
      'Chỉ gồm hoá đơn ĐÃ LẬP. Tháng chưa lập hoá đơn thì không có ở đây.',
      format('Danh sách "hoa_don" cắt ở %s dòng; các bảng tổng thì đủ.', c_tran))
  ) into v;
  return v;
end $$;

-- ⑧ HỌC SINH VẮNG ───────────────────────────────────────────────────────────
create or replace function public._troly_cc_vang_hoc(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lop jsonb; v_lop_id uuid; v_khoi text := nullif(btrim(p->>'khoi'), ''); v_mon text := nullif(btrim(p->>'mon'), '');
  v_den date; v_tu date; v jsonb; c_tran constant int := 200;
begin
  perform public._troly_gac();
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', public._troly_dau_tuan(v_den));
  if v_den - v_tu > 186 then v_tu := v_den - 186; end if;

  with t as (
    select b.ngay, l.ten_lop, l.mon, hs.id as hoc_sinh_id, hs.ho_ten, hs.ma_hs, h.diem_danh
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
    join lop l on l.id = b.lop_id
    join hoc_sinh hs on hs.id = h.hoc_sinh_id
    where h.diem_danh in ('vang', 'vang_phep') and b.ngay between v_tu and v_den
      and (v_lop_id is null or l.id = v_lop_id)
      and (v_khoi is null or l.khoi = v_khoi) and (v_mon is null or l.mon = v_mon)
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('lop', v_lop->>'ten_lop', 'khoi', v_khoi, 'mon', v_mon),
    'tong', (select jsonb_build_object('so_luot_vang', count(*), 'so_hoc_sinh', count(distinct hoc_sinh_id),
               'khong_phep', count(*) filter (where diem_danh = 'vang'), 'co_phep', count(*) filter (where diem_danh = 'vang_phep')) from t),
    'theo_lop', (select coalesce(jsonb_agg(to_jsonb(g) order by g.so_luot_vang desc, g.ten_lop), '[]'::jsonb) from (
        select ten_lop, mon, count(*)::int as so_luot_vang, count(distinct hoc_sinh_id)::int as so_hoc_sinh from t group by 1, 2) g),
    'hoc_sinh_vang_nhieu', (select coalesce(jsonb_agg(to_jsonb(g)), '[]'::jsonb) from (
        select ho_ten, ma_hs, string_agg(distinct ten_lop, ', ') as lop, count(*)::int as so_luot_vang
        from t group by hoc_sinh_id, ho_ten, ma_hs having count(*) >= 2 order by count(*) desc, ho_ten limit 40) g),
    'luot_vang', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ngay, ten_lop, mon, ho_ten, ma_hs, diem_danh as loai from t order by ngay desc, ten_lop, ho_ten limit c_tran) r),
    'da_cat', (select count(*) > c_tran from t),
    'ghi_chu', jsonb_build_array(
      'Chỉ buổi THƯỜNG đã điểm danh. Buổi chưa điểm danh thì chưa có ai tính là vắng.',
      'Tình trạng bù của các lượt vắng hỏi công cụ bo_tro (loai = bu).',
      format('Danh sách "luot_vang" cắt ở %s dòng; các bảng tổng thì đủ.', c_tran))
  ) into v;
  return v;
end $$;

-- ⑨ THIẾU BTVN ──────────────────────────────────────────────────────────────
create or replace function public._troly_cc_thieu_btvn(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lop jsonb; v_lop_id uuid; v_khoi text := nullif(btrim(p->>'khoi'), ''); v_mon text := nullif(btrim(p->>'mon'), '');
  v_den date; v_tu date; v jsonb; c_tran constant int := 200;
begin
  perform public._troly_gac();
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', public._troly_dau_tuan(v_den));
  if v_den - v_tu > 186 then v_tu := v_den - 186; end if;

  with buoi as (
    select b.id, b.ngay, b.btvn_dong_at, l.ten_lop, l.mon
    from buoi_hoc b join lop l on l.id = b.lop_id
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
      and (v_lop_id is null or l.id = v_lop_id)
      and (v_khoi is null or l.khoi = v_khoi) and (v_mon is null or l.mon = v_mon)
  ),
  t as (
    select bu.ngay, bu.ten_lop, bu.mon, hs.id as hoc_sinh_id, hs.ho_ten, hs.ma_hs, k.trang_thai_nop, k.thai_do
    from btvn_ket_qua k join buoi bu on bu.id = k.buoi_hoc_id
    join hoc_sinh hs on hs.id = k.hoc_sinh_id
    where k.trang_thai_nop in ('khong_lam', 'nop_muon', 'xin_phep')
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('lop', v_lop->>'ten_lop', 'khoi', v_khoi, 'mon', v_mon),
    'so_buoi_trong_khoang', (select count(*) from buoi),
    'so_buoi_da_nhap_btvn', (select count(*) from buoi where btvn_dong_at is not null),
    'tong', (select jsonb_build_object('so_luot', count(*), 'so_hoc_sinh', count(distinct hoc_sinh_id),
               'khong_lam', count(*) filter (where trang_thai_nop = 'khong_lam'),
               'nop_muon', count(*) filter (where trang_thai_nop = 'nop_muon'),
               'xin_phep', count(*) filter (where trang_thai_nop = 'xin_phep')) from t),
    'theo_lop', (select coalesce(jsonb_agg(to_jsonb(g) order by g.so_luot desc, g.ten_lop), '[]'::jsonb) from (
        select ten_lop, mon, count(*)::int as so_luot, count(distinct hoc_sinh_id)::int as so_hoc_sinh from t group by 1, 2) g),
    'theo_hoc_sinh', (select coalesce(jsonb_agg(to_jsonb(g)), '[]'::jsonb) from (
        select ho_ten, ma_hs, string_agg(distinct ten_lop, ', ') as lop, count(*)::int as so_luot,
               jsonb_agg(jsonb_build_object('ngay_buoi', ngay, 'tinh_trang', trang_thai_nop) order by ngay) as tung_buoi
        from t group by hoc_sinh_id, ho_ten, ma_hs order by count(*) desc, ho_ten limit c_tran) g),
    'da_cat', (select count(distinct hoc_sinh_id) > c_tran from t),
    'ghi_chu', jsonb_build_array(
      'Chỉ đếm được ở buổi ĐÃ nhập BTVN. Buổi chưa nhập thì chưa biết ai thiếu — so so_buoi_da_nhap_btvn với so_buoi_trong_khoang trước khi kết luận.',
      'ngay_buoi là ngày buổi GIAO bài; bài được chấm ở buổi kế tiếp của lớp.',
      format('Danh sách "theo_hoc_sinh" cắt ở %s em; các bảng tổng thì đủ.', c_tran))
  ) into v;
  return v;
end $$;

-- ⑩ BỔ TRỢ (bù · đuổi · yếu) ────────────────────────────────────────────────
create or replace function public._troly_cc_bo_tro(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_loai text := lower(btrim(coalesce(p->>'loai', '')));
  v_hs jsonb; v_id uuid; v jsonb; v_tu date; c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_loai not in ('bu', 'duoi', 'yeu') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'Tham số loai phải là: bu | duoi | yeu.');
  end if;
  if nullif(btrim(p->>'ten_hoc_sinh'), '') is not null then
    v_hs := public._troly_chon_hs(p->>'ten_hoc_sinh', p->>'ten_lop');
    if v_hs ? 'loi' then return v_hs; end if;
    v_id := (v_hs->>'id')::uuid;
  end if;

  if v_loai = 'bu' then
    v_tu := public._troly_ngay(p->>'tu_ngay', public._troly_hom_nay() - 30);
    with t as (
      select hs.ho_ten, hs.ma_hs, l.ten_lop, b.ngay as ngay_vang, h.diem_danh,
             case when kb.id is not null then 'khong_bu:' || kb.loai
                  when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                                where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                                  and bb.trang_thai = 'hoan_tat' and x.diem_danh = 'co_mat') then 'da_hoc_bu'
                  when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                                where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                                  and bb.trang_thai = 'mo') then 'da_xep_chua_hoc'
                  when exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id) then 'da_xep_nhung_truot'
                  else 'chua_xep' end as tinh_trang
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
      join lop l on l.id = b.lop_id
      join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
      left join bang_khong_bu kb on kb.buoi_hoc_hs_id = h.id
      where h.diem_danh in ('vang', 'vang_phep') and b.ngay >= v_tu
        and (v_id is null or hs.id = v_id)
    )
    select jsonb_build_object(
      'loai', 'bu', 'tu_ngay', v_tu, 'hoc_sinh', v_hs->>'ho_ten',
      'tong_theo_tinh_trang', (select coalesce(jsonb_object_agg(g.tinh_trang, g.n), '{}'::jsonb)
                                 from (select tinh_trang, count(*)::int as n from t group by 1) g),
      'luot', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
          select * from t where v_id is not null or tinh_trang in ('chua_xep', 'da_xep_nhung_truot', 'da_xep_chua_hoc')
          order by ngay_vang, ho_ten limit c_tran) r),
      'da_cat', (select count(*) > c_tran from t where v_id is not null or tinh_trang in ('chua_xep', 'da_xep_nhung_truot', 'da_xep_chua_hoc')),
      'ghi_chu', jsonb_build_array(
        'Mỗi dòng = 1 lượt vắng buổi thường của HS đang học. da_xep_nhung_truot = đã xếp bù nhưng buổi bù bị huỷ hoặc em vắng buổi bù.',
        'Danh sách "luot" chỉ liệt kê lượt CÒN PHẢI XỬ (trừ khi hỏi riêng 1 em); tong_theo_tinh_trang thì đếm đủ mọi lượt.',
        'Hạn xếp bù 48h và hàng đợi chính thức xem ở màn Bổ trợ › Bù; cách phân loại ở đây giản lược hơn màn đó.')
    ) into v;

  elsif v_loai = 'duoi' then
    with t as (
      select hs.ho_ten, hs.ma_hs, l.ten_lop, d.trang_thai, d.ly_do, d.so_buoi_du_kien,
             (d.created_at at time zone 'Asia/Ho_Chi_Minh')::date as mo_ngay,
             (d.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date as hoan_thanh_ngay,
             (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy')::int as so_buoi_da_xep,
             (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and x.diem_danh = 'co_mat')::int as so_buoi_da_hoc,
             (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id)::int as so_dang,
             (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id and x.day_at is not null)::int as so_dang_da_day
      from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
      where v_id is null or hs.id = v_id
    )
    select jsonb_build_object(
      'loai', 'duoi', 'hoc_sinh', v_hs->>'ho_ten',
      'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                                 from (select trang_thai, count(*)::int as n from t group by 1) g),
      'dot', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
          select t.*, case when t.trang_thai = 'can_duoi' then public._troly_hom_nay() - t.mo_ngay end as so_ngay_da_mo
          from t where v_id is not null or t.trang_thai = 'can_duoi'
          order by t.mo_ngay limit c_tran) r),
      'da_cat', (select count(*) > c_tran from t where v_id is not null or trang_thai = 'can_duoi'),
      'ghi_chu', jsonb_build_array(
        'can_duoi = đợt đang mở. so_buoi_du_kien trống = chưa ai chốt kế hoạch nên chưa xếp lịch được.',
        'Danh sách "dot" chỉ liệt kê đợt ĐANG MỞ (trừ khi hỏi riêng 1 em).',
        'Hệ không lưu ai chịu trách nhiệm từng đợt.')
    ) into v;

  else
    with t as (
      select hs.ho_ten, hs.ma_hs, y.mon, l.ten_lop, y.trang_thai, y.muc, y.uu_tien, y.ket_qua, y.nguon, left(y.ly_do, 160) as ly_do,
             (y.created_at at time zone 'Asia/Ho_Chi_Minh')::date as mo_ngay,
             (y.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date as hoan_thanh_ngay,
             (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id)::int as so_dang,
             (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and x.day_at is not null)::int as so_dang_da_day,
             (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and x.dat = true)::int as so_dang_dat,
             (select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', public._troly_ten_dang(x.ma_dang)->>'ten',
                        'da_day', x.day_at is not null, 'dat', x.dat) order by x.created_at), '[]'::jsonb)
                from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and v_id is not null) as cac_dang
      from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id left join lop l on l.id = y.lop_id
      where v_id is null or hs.id = v_id
    )
    select jsonb_build_object(
      'loai', 'yeu', 'hoc_sinh', v_hs->>'ho_ten',
      'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                                 from (select trang_thai, count(*)::int as n from t group by 1) g),
      'tong_ket_qua_case_da_dong', (select coalesce(jsonb_object_agg(coalesce(g.ket_qua, '(chưa ghi)'), g.n), '{}'::jsonb)
                                 from (select ket_qua, count(*)::int as n from t where trang_thai = 'hoan_thanh' group by 1) g),
      'dang_xu_theo_mon', (select coalesce(jsonb_object_agg(g.mon, g.n), '{}'::jsonb)
                                 from (select mon, count(*)::int as n from t where trang_thai = 'dang_xu' group by 1) g),
      'case', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
          select t.*, case when t.trang_thai = 'dang_xu' then public._troly_hom_nay() - t.mo_ngay end as so_ngay_da_mo
          from t where v_id is not null or t.trang_thai = 'dang_xu'
          order by t.uu_tien desc, t.mo_ngay limit c_tran) r),
      'da_cat', (select count(*) > c_tran from t where v_id is not null or trang_thai = 'dang_xu'),
      'so_canh_bao_yeu_30_ngay', (select count(*) from canh_bao_yeu c
                                   where c.created_at > now() - interval '30 days' and (v_id is null or c.hoc_sinh_id = v_id)),
      'ghi_chu', jsonb_build_array(
        'dang_xu = case đang mở. Danh sách "case" chỉ liệt kê case ĐANG MỞ (trừ khi hỏi riêng 1 em), ưu tiên cao trước.',
        'Lịch ca bổ trợ, kết quả test cuối ca và retest xem ở màn Bổ trợ › Yếu — công cụ này chưa gồm.')
    ) into v;
  end if;
  return v;
end $$;

-- ⑪ TUYỂN SINH + TEST ĐẦU VÀO ───────────────────────────────────────────────
create or replace function public._troly_cc_tuyen_sinh(p jsonb) returns jsonb
language plpgsql stable as $$
declare v_mon text := nullif(btrim(p->>'mon'), ''); v_khoi text := nullif(btrim(p->>'khoi'), ''); v jsonb;
begin
  perform public._troly_gac();
  with uv as (
    select * from ung_vien u where (v_mon is null or u.mon = v_mon) and (v_khoi is null or u.khoi = v_khoi)
  ),
  ca as (
    select c.*, u.ho_ten_hs, u.khoi, nc.ho_ten as nguoi_cham, nt.ho_ten as nguoi_tra_bai,
           case when c.hoan_thanh_at is null then 'chua_test_xong'
                when c.bai_url is null then 'chua_scan_bai'
                when c.cham_xong_at is null then 'chua_cham'
                when c.tra_bai_xong_at is null then 'chua_tra_ket_qua'
                else 'xong' end as khau
    from ca_test c join uv u on u.id = c.ung_vien_id
    left join nhan_su nc on nc.id = c.nguoi_cham_id
    left join nhan_su nt on nt.id = c.nguoi_tra_bai_id
    where c.trang_thai <> 'huy'
  )
  select jsonb_build_object(
    'loc', jsonb_build_object('mon', v_mon, 'khoi', v_khoi),
    'ung_vien_theo_level_va_trang_thai', (select coalesce(jsonb_agg(to_jsonb(g) order by g.level, g.trang_thai), '[]'::jsonb) from (
        select level, trang_thai, count(*)::int as so_luong from uv group by 1, 2) g),
    'ca_test_theo_khau', (select coalesce(jsonb_object_agg(g.khau, g.n), '{}'::jsonb)
                            from (select khau, count(*)::int as n from ca group by 1) g),
    'ca_test_dang_ket', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ho_ten_hs, khoi, mon, ngay as ngay_test, public._troly_hom_nay() - ngay as so_ngay_tu_luc_test,
               khau, nguoi_cham, nguoi_tra_bai
        from ca where khau <> 'xong' order by ngay limit 80) r),
    'da_cat', (select count(*) > 80 from ca where khau <> 'xong'),
    'ghi_chu', jsonb_build_array(
      'Chuỗi ca test: test xong → scan bài → chấm → trả kết quả. khau = khâu ĐANG chặn của ca đó.',
      'nguoi_cham / nguoi_tra_bai là người DỰ KIẾN (gán lúc đặt lịch), hàng đợi chấm/trả vẫn là pool chung. Trống = chưa gán ai.',
      'Ca đã huỷ không tính.')
  ) into v;
  return v;
end $$;

-- ⑫ BẢNG XẾP HẠNG ELO / EXP ─────────────────────────────────────────────────
create or replace function public._troly_cc_xep_hang(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lop jsonb; v_lop_id uuid; v_mon text := nullif(btrim(p->>'mon'), ''); v_khoi text := nullif(btrim(p->>'khoi'), '');
  v_top int := least(greatest(coalesce(nullif(p->>'top', '')::int, 20), 1), 50); v jsonb;
begin
  perform public._troly_gac();
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  select jsonb_build_object(
    'loc', jsonb_build_object('mon', v_mon, 'khoi', v_khoi, 'lop', v_lop->>'ten_lop', 'top', v_top),
    'bang', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select row_number() over (order by ge.elo desc, hs.ho_ten)::int as hang,
               hs.ho_ten, hs.ma_hs, hs.khoi, ge.mon, ge.elo, ge.sessions_played as so_buoi_da_tinh,
               coalesce((select sum(el.amount) from gami_exp_ledger el
                          where el.hoc_sinh_id = hs.id and el.mon is not distinct from ge.mon), 0)::int as exp
        from gami_elo ge join hoc_sinh hs on hs.id = ge.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
        where (v_mon is null or ge.mon = v_mon) and (v_khoi is null or hs.khoi = v_khoi)
          and (v_lop_id is null or exists (select 1 from hoc_sinh_lop hl
                 where hl.hoc_sinh_id = hs.id and hl.lop_id = v_lop_id and hl.trang_thai = 'dang_hoc'))
        order by ge.elo desc, hs.ho_ten limit v_top) r),
    'ghi_chu', jsonb_build_array(
      'Xếp theo Elo, chỉ HS đang học. Elo và EXP tính RIÊNG theo môn — không lọc môn thì bảng trộn nhiều môn, không nên so ngang.',
      'Đây KHÔNG phải bảng Rank theo mùa/tháng của app học sinh (nguồn điểm khác).')
  ) into v;
  return v;
end $$;

-- ⑬ KẾT QUẢ VIỆC VẬN HÀNH THEO THÁNG (đạt / không đạt) ───────────────────────
create or replace function public._troly_cc_ket_qua_viec_thang(p jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_ns jsonb; v_ns_id uuid; v_ky date; v_cuoi date; v jsonb;
begin
  perform public._troly_gac();
  if nullif(btrim(p->>'ten_nhan_vien'), '') is not null then
    v_ns := public._troly_chon_ns(p->>'ten_nhan_vien');
    if v_ns ? 'loi' then return v_ns; end if;
    v_ns_id := (v_ns->>'id')::uuid;
  end if;
  v_ky := public._troly_thang(p->>'thang', public._troly_hom_nay());
  v_cuoi := (v_ky + interval '1 month' - interval '1 day')::date;

  with t as (
    select 'gv'::text as nhom, f.nhan_su_id, f.ho_ten, f.ten_lop as ten, f.ngay, f.tab, f.kq, f.ly_do from public.fn_gv_viec_thang(v_ky, v_cuoi) f
    union all
    select 'ta', f.nhan_su_id, f.ho_ten, f.ten_lop, f.ngay, f.tab, f.kq, f.ly_do from public.fn_ta_viec_thang(v_ky, v_cuoi) f
    union all
    select 'ops', f.nhan_su_id, f.ho_ten, f.ten_viec, f.ngay, f.tab, f.kq, f.ly_do from public.fn_ops_viec_thang(v_ky, v_cuoi) f
  ),
  l as (select * from t where v_ns_id is null or nhan_su_id = v_ns_id)
  select jsonb_build_object(
    'thang', to_char(v_ky, 'YYYY-MM'), 'nhan_vien', v_ns->>'ho_ten',
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.khong_dat desc, g.ho_ten), '[]'::jsonb) from (
        select ho_ten, nhom, count(*)::int as so_viec,
               count(*) filter (where kq = 'dat')::int as dat,
               count(*) filter (where kq = 'khong_dat')::int as khong_dat,
               count(*) filter (where kq = 'cho')::int as chua_toi_han
        from l group by ho_ten, nhom) g),
    'viec_khong_dat', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ho_ten, nhom, ten as lop_hoac_viec, ngay, tab as khau, ly_do
        from l where kq = 'khong_dat' order by ngay desc, ho_ten limit 150) r),
    'da_cat', (select count(*) > 150 from l where kq = 'khong_dat'),
    'ghi_chu', jsonb_build_array(
      'Cùng nguồn với bảng hiệu suất vận hành (đã áp quy tắc gậy). nhom: gv = giáo viên · ta = trợ giảng · ops = vận hành.',
      'ly_do: tre = đóng sau hạn · no_qua_han = quá hạn mà chưa đóng.',
      'Công cụ chỉ ĐẾM đạt/không đạt; con số % hiệu suất tổng hợp xem ở màn Hiệu suất, công cụ này không tự tính.',
      'Chưa gồm việc phát triển — hỏi công cụ viec_phat_trien.')
  ) into v;
  return v;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- DANH MỤC + CỬA GỌI. Server CHỈ biết 2 hàm này.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.fn_troly_danh_muc() returns jsonb
language plpgsql stable as $fn$
begin
  perform public._troly_gac();
  return $cat$[
  {"name":"hoc_tap_hoc_sinh",
   "mo_ta":"Hồ sơ học tập của MỘT học sinh theo tên: Elo, mastery (số dạng đạt/cần luyện/yếu + danh sách dạng yếu), điểm ET / BTVN / MT TỪNG BUỔI, điểm các kỳ thi, điểm danh, đánh giá + nhận xét sau buổi. Dùng cho mọi câu hỏi về 1 em cụ thể.",
   "tham_so":{"type":"object","properties":{
     "ten_hoc_sinh":{"type":"string","description":"Tên học sinh (hoặc mã HS), nguyên văn người dùng gõ, không dấu cũng được."},
     "ten_lop":{"type":"string","description":"Tên lớp nếu người dùng có nói, để phân biệt khi trùng tên."},
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN"],"description":"Chỉ điền khi người dùng nói rõ môn."},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = 60 ngày gần nhất."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}},
     "required":["ten_hoc_sinh"]}},
  {"name":"ket_qua_lop",
   "mo_ta":"Kết quả của MỘT lớp theo từng buổi và từng học sinh, cho 1 loại: et (bài kiểm tra cuối buổi) | btvn (bài tập về nhà) | mt (kiểm tra định kỳ). ET, BTVN, MT là BA thứ khác nhau — chọn đúng loại người dùng hỏi.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string","description":"Tên lớp, vd 9A1."},
     "loai":{"type":"string","enum":["et","btvn","mt"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = 30 ngày gần nhất."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}},
     "required":["ten_lop","loai"]}},
  {"name":"tinh_trang_buoi",
   "mo_ta":"Tình trạng dữ liệu của các BUỔI HỌC trong một ngày hoặc khoảng ngày: buổi nào đã/chưa điểm danh, đã/chưa nhập ET, BTVN, đánh giá, MT; buổi nào bấm đóng mà không có dữ liệu (đóng khống, đóng không nhận xét); lớp nào có lịch mà chưa mở buổi. Dùng cho câu hỏi kiểu: hôm nay/hôm qua lớp nào còn thiếu gì, lớp nào chưa nhập BTVN, còn bao nhiêu buổi chưa đóng.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = bằng den_ngay (hỏi 1 ngày)."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_lop":{"type":"string"},"khoi":{"type":"string","description":"vd 8"},
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN"]},
     "chi_buoi_co_van_de":{"type":"boolean","description":"true = chỉ liệt kê buổi thiếu/đóng khống. Bỏ trống: hỏi ≤7 ngày thì liệt kê hết, dài hơn thì chỉ buổi có vấn đề."}}}},
  {"name":"viec_van_hanh",
   "mo_ta":"Việc vận hành sau buổi học theo NGƯỜI (giáo viên, trợ giảng, trưởng khối): ai còn nợ khâu nào (đánh giá, chấm bài trên lớp, ET, BTVN, MT) của buổi nào, quá hạn hay chưa. Dùng cho câu hỏi: ai đang nợ việc, việc tuần trước chưa hoàn thành, việc quá hạn của một người hoặc một lớp.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "ten_lop":{"type":"string"},
     "tu_ngay":{"type":"string","description":"Ngày BUỔI HỌC, YYYY-MM-DD. Bỏ trống = 14 ngày trước den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "trang_thai":{"type":"string","enum":["chua_xong","qua_han","da_xong","tat_ca"],"description":"Bỏ trống = chua_xong."}}}},
  {"name":"viec_phat_trien",
   "mo_ta":"Việc phát triển (việc giao tay qua module Giao việc): đang mở, quá hạn, chờ nghiệm thu, đã xong — theo người làm, người giao, khoảng hạn.",
   "tham_so":{"type":"object","properties":{
     "ten_nguoi_lam":{"type":"string"},"ten_nguoi_giao":{"type":"string"},
     "trang_thai":{"type":"string","enum":["dang_mo","qua_han","cho_nghiem_thu","da_xong","tat_ca"],"description":"Bỏ trống = dang_mo."},
     "han_tu_ngay":{"type":"string","description":"Lọc theo HẠN của việc, YYYY-MM-DD."},
     "han_den_ngay":{"type":"string","description":"YYYY-MM-DD."}}}},
  {"name":"ket_qua_viec_thang",
   "mo_ta":"Kết quả việc vận hành của nhân viên trong MỘT tháng: số việc đạt / không đạt / chưa tới hạn, và danh sách việc không đạt kèm lý do (trễ, nợ quá hạn). Dùng cho câu hỏi về tình trạng làm việc, ai miss, ai làm tốt.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."}}}},
  {"name":"vang_hoc",
   "mo_ta":"Học sinh vắng (có phép / không phép) theo lớp, khối, môn trong khoảng ngày; kèm danh sách em vắng nhiều.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string"},"khoi":{"type":"string"},"mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = thứ Hai tuần này."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}}}},
  {"name":"thieu_btvn",
   "mo_ta":"Học sinh thiếu BTVN (không làm / nộp muộn / xin phép) theo lớp, khối, môn trong khoảng ngày, kèm từng buổi thiếu của từng em.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string"},"khoi":{"type":"string"},"mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = thứ Hai tuần này."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}}}},
  {"name":"bo_tro",
   "mo_ta":"Tình hình bổ trợ. loai = bu (lượt vắng và tình trạng xếp bù) | duoi (đợt học đuổi đang mở, tiến độ) | yeu (case bổ trợ yếu đang xử, kết quả case đã đóng). Có thể hỏi riêng 1 học sinh.",
   "tham_so":{"type":"object","properties":{
     "loai":{"type":"string","enum":["bu","duoi","yeu"]},
     "ten_hoc_sinh":{"type":"string"},"ten_lop":{"type":"string","description":"Để phân biệt khi trùng tên HS."},
     "tu_ngay":{"type":"string","description":"Chỉ dùng cho loai=bu: lượt vắng từ ngày này. Bỏ trống = 30 ngày gần nhất."}},
     "required":["loai"]}},
  {"name":"hoc_phi_hoc_sinh",
   "mo_ta":"Học phí của MỘT học sinh trong 1 tháng: chi tiết theo lớp (số buổi, đơn giá, học liệu, học đuổi, thành tiền) và hoá đơn của phụ huynh.",
   "tham_so":{"type":"object","properties":{
     "ten_hoc_sinh":{"type":"string"},"ten_lop":{"type":"string"},
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."}},
     "required":["ten_hoc_sinh"]}},
  {"name":"hoc_phi_no",
   "mo_ta":"Danh sách hoá đơn học phí CHƯA THU ĐỦ (chưa thu / thu một phần / quá hạn) theo phụ huynh, tổng theo kỳ.",
   "tham_so":{"type":"object","properties":{
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = mọi kỳ còn nợ."}}}},
  {"name":"tuyen_sinh",
   "mo_ta":"Tuyển sinh: đếm ứng viên theo level và trạng thái; chuỗi test đầu vào (test → scan → chấm → trả kết quả) và danh sách ca đang kẹt ở khâu nào, ai dự kiến chấm/trả.",
   "tham_so":{"type":"object","properties":{
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN"]},"khoi":{"type":"string"}}}},
  {"name":"xep_hang",
   "mo_ta":"Bảng xếp hạng Elo + EXP của học sinh đang học, lọc theo môn / khối / lớp.",
   "tham_so":{"type":"object","properties":{
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN"]},"khoi":{"type":"string"},"ten_lop":{"type":"string"},
     "top":{"type":"integer","description":"Số dòng, mặc định 20, tối đa 50."}}}}
  ]$cat$::jsonb;
end $fn$;

create or replace function public.fn_troly_goi(p_cong_cu text, p_tham_so jsonb default '{}'::jsonb) returns jsonb
language plpgsql stable as $$
declare p jsonb := coalesce(p_tham_so, '{}'::jsonb); v jsonb;
begin
  perform public._troly_gac();   -- NGOÀI khối bắt lỗi: bị chặn quyền phải NỔ, không được nuốt thành "lỗi thực thi"
  if jsonb_typeof(p) <> 'object' then p := '{}'::jsonb; end if;
  begin
    v := case p_cong_cu
      when 'hoc_tap_hoc_sinh'   then public._troly_cc_hoc_tap_hoc_sinh(p)
      when 'ket_qua_lop'        then public._troly_cc_ket_qua_lop(p)
      when 'tinh_trang_buoi'    then public._troly_cc_tinh_trang_buoi(p)
      when 'viec_van_hanh'      then public._troly_cc_viec_van_hanh(p)
      when 'viec_phat_trien'    then public._troly_cc_viec_phat_trien(p)
      when 'ket_qua_viec_thang' then public._troly_cc_ket_qua_viec_thang(p)
      when 'vang_hoc'           then public._troly_cc_vang_hoc(p)
      when 'thieu_btvn'         then public._troly_cc_thieu_btvn(p)
      when 'bo_tro'             then public._troly_cc_bo_tro(p)
      when 'hoc_phi_hoc_sinh'   then public._troly_cc_hoc_phi_hoc_sinh(p)
      when 'hoc_phi_no'         then public._troly_cc_hoc_phi_no(p)
      when 'tuyen_sinh'         then public._troly_cc_tuyen_sinh(p)
      when 'xep_hang'           then public._troly_cc_xep_hang(p)
      else jsonb_build_object('loi', 'khong_co_cong_cu', 'thong_diep', format('Không có công cụ "%s".', p_cong_cu))
    end;
    return v;
  exception when others then
    -- Lỗi khi chạy công cụ trả về như DỮ LIỆU để model nói lại cho người hỏi, không làm sập cả lượt.
    return jsonb_build_object('loi', 'loi_thuc_thi', 'thong_diep', sqlerrm);
  end;
end $$;

-- ── QUYỀN GỌI ───────────────────────────────────────────────────────────────
-- `revoke from public` KHÔNG đủ nếu file này bị áp bằng SQL Editor (owner postgres ⇒ anon được
-- grant tường minh — đã cắn thật ở mig 202609181946) ⇒ revoke cả anon cho chắc ở cả hai đường áp.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and (p.proname like '\_troly\_%' or p.proname in ('troly_duoc_dung', 'fn_troly_danh_muc', 'fn_troly_goi'))
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
end $$;

comment on function public.fn_troly_goi(text, jsonb) is
  'Cửa gọi DUY NHẤT của công cụ trợ lý. Server gọi bằng token người hỏi (invoker + RLS). Thêm công cụ: viết _troly_cc_<tên>, thêm vào CASE ở đây và vào fn_troly_danh_muc.';
comment on function public.fn_troly_danh_muc() is
  'Danh mục công cụ trợ lý (tên + mô tả + JSON schema tham số) gửi cho model. Nguồn duy nhất — không chép sang JS.';
