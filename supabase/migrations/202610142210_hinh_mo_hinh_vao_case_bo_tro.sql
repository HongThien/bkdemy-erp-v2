-- Thùy 14/10: "Làm bước 2 đi. Kho mỏng ko vấn đề. Vì bản chất hình cũng ko học được nhiều" — đưa Hình THEO MÔ HÌNH vào case bổ trợ yếu thật.
-- Thiết kế (CLAUDE.md §1: KP = dạng; CEO 13/10 spec-hinh-luyen §0: "KP = bài mô hình"): dạng của case = MỘT BÀI MÔ HÌNH, ma_dang = hinh_baitoan.ma
-- (mã gốc bất biến). Kho câu của dạng = chính bài đó + các biến thể của nó (kho mỏng cũng được). Đo ở fn_mastery_cells_hinh như cũ.
-- Cách làm: thêm 1 NHÁNH vào registry kho (hinh_mo_hinh) trỏ 4 VIEW giả-bảng (hmh_*) ⇒ toàn bộ đường ống bổ trợ (ca em · ca TA · in phiếu ·
-- test cuối ca · tiến độ · đồng bộ dạng) chạy nguyên, KHÔNG viết lại. Bài chứng minh không có trắc nghiệm ⇒ đi nhánh "trả lời ngắn" (luật 10/10),
-- đáp án = lời giải mẫu để TA đối chiếu và bấm Đúng/Sai trên GIẤY. Dạng này KHÔNG luyện được trên app em (hàm luyện báo "học trên giấy").
-- KHÔNG đưa vào _kho_ds_nhanh ⇒ tự luyện / app HS / các vòng đếm kho không thấy nhánh mới.
-- Kèm: (a) kết quả bổ trợ của bài mô hình tính vào fn_mastery_cells_hinh, và LOẠI khỏi fn_mastery_cells (Đại); (b) đề xuất dạng mới + dạng yếu 2 cửa sổ
-- đọc cả Hình mô hình; (c) in phiếu riêng Hình cho ca 📱 app (fn_btyeu_in_sinh_hinh); (d) đưa 1 bài vào case từ danh sách Hình yếu.
-- Dựng từ bản ĐANG CHẠY của từng hàm.

-- ── 4 view giả-bảng (security_invoker: người ngoài nhân sự không đọc trực tiếp được — các hàm definer thì đọc bình thường) ──
create or replace view public.hmh_ban_do with (security_invoker = true) as
select b.ma as ma_dang,
       (btrim(mh.ten) || ' · bài ' || coalesce(nullif(regexp_replace(split_part(b.ma, '.', 4), '^0+', ''), ''), split_part(b.ma, '.', 4)))::text as ten_dang,
       mh.khoi::text as khoi,
       null::text as ma_chu_de, null::text as ten_chu_de, null::text as ma_chuyen_de,
       'Hình · mô hình — dạy và chấm trên giấy'::text as ten_chuyen_de,
       b.cap::smallint as muc_do
from public.hinh_baitoan b join public.hinh_mo_hinh mh on mh.id = b.mo_hinh_id;

create or replace view public.hmh_cau_hoi with (security_invoker = true) as
select b.ma as ma_cau, b.ma as dang_chinh, null::text as ma_cum,
       nullif(btrim(concat_ws(E'\n', nullif(btrim(public.fn_hl_gia_thiet_hieu_luc(b.id)), ''), nullif(btrim(b.phat_bieu), ''))), '') as noi_dung,
       'tra_loi_ngan'::text as loai_cau,
       coalesce(nullif(btrim(g.loi_giai), ''), 'Chưa có lời giải mẫu trong kho — TA tự đối chiếu.') as dap_an,
       null::jsonb as lua_chon, null::jsonb as menh_de,
       nullif(btrim(g.loi_giai), '') as loi_giai,
       coalesce(nullif(btrim(b.anh_chuan), ''), nullif(btrim(mh.anh_cau_hinh), '')) as anh_de,
       nullif(btrim(g.anh_loi_giai), '') as anh_dap_an,
       true as kho_chuan, true as da_duyet, null::timestamptz as xoa_at, 1::smallint as thu_tu, b.created_at
from public.hinh_baitoan b
join public.hinh_mo_hinh mh on mh.id = b.mo_hinh_id
left join lateral (select x.loi_giai, x.anh_loi_giai from public.hinh_cach_giai x where x.baitoan_id = b.id order by x.la_mac_dinh desc nulls last, x.thu_tu limit 1) g on true
union all
select b.ma || '~' || substr(v.id::text, 1, 8), b.ma, null::text,
       btrim(v.de_bai), 'tra_loi_ngan'::text,
       coalesce(nullif(btrim(v.loi_giai), ''), 'Chưa có lời giải mẫu trong kho — TA tự đối chiếu.'),
       null::jsonb, null::jsonb, nullif(btrim(v.loi_giai), ''), nullif(btrim(v.anh), ''), nullif(btrim(v.anh_loi_giai), ''),
       true, true, null::timestamptz, coalesce(v.thu_tu, 1)::smallint, v.created_at
from public.hinh_baitoan_bien_the v join public.hinh_baitoan b on b.id = v.baitoan_id
where coalesce(btrim(v.de_bai), '') <> '';

create or replace view public.hmh_dang_ly_thuyet with (security_invoker = true) as
select b.ma as ma_dang, null::text as noi_dung from public.hinh_baitoan b;
create or replace view public.hmh_cum_bai with (security_invoker = true) as
select null::text as ma_cum, null::text as ma_dang, null::text as ten, null::int as thu_tu, null::text as ghi_chu, null::timestamptz as created_at where false;
create or replace view public.hmh_cum_tien_de with (security_invoker = true) as
select null::text as ma_cum, null::text as tien_de_ma_cum where false;
grant select on public.hmh_ban_do, public.hmh_cau_hoi, public.hmh_dang_ly_thuyet, public.hmh_cum_bai, public.hmh_cum_tien_de to authenticated, service_role;

create or replace function public._btyeu_la_hinh_mh(p_ma_dang text) returns boolean
language sql stable security definer set search_path = public as $$
  select p_ma_dang is not null and exists (select 1 from hinh_baitoan where ma = p_ma_dang)
$$;
revoke all on function public._btyeu_la_hinh_mh(text) from public, anon;
grant execute on function public._btyeu_la_hinh_mh(text) to authenticated, service_role;

-- ── registry ──
CREATE OR REPLACE FUNCTION public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_baitoan where ma = p_ma_dang) then 'hinh_mo_hinh' -- 14/10: bài mô hình = KP (ma_dang = hinh_baitoan.ma)
              else null end
$function$;

CREATE OR REPLACE FUNCTION public._kho_ban_do_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_mon = 'Tiếng Anh' then 'anh_ban_do'
              when p_mon = 'TSA' then 'tsa_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_ban_do'
              else 'dai_ban_do' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_cau_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_mon = 'Tiếng Anh' then 'anh_cau_hoi'
              when p_mon = 'TSA' then 'tsa_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_hoi'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_cau_hoi'
              else 'dai_cau_hoi' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_lt_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_mon = 'Tiếng Anh' then 'anh_dang_ly_thuyet'
              when p_mon = 'TSA' then 'tsa_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai_ly_thuyet'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_dang_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_muc_do_dang(p_mon text, p_ma_dang text)
 RETURNS smallint
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Tiếng Anh' then
    select muc_do into v_md from anh_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'TSA' then
    select muc_do into v_md from tsa_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_hoc' then
    select muc_do into v_md from hinh_hoc_bai where ma_bai = p_ma_dang;
  elsif v_nhanh = 'hinh_mo_hinh' then
    select muc_do into v_md from hmh_ban_do where ma_dang = p_ma_dang;
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $function$;

-- ── đo lường ──
CREATE OR REPLACE FUNCTION public.fn_mastery_cells(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = _do_nhom_cua_o(câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as (
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  ),
  mg as (
    select mf.hoc_sinh_id, cap.nhom as ma_dang, mf.value, mf.t, mf.src
    from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           -- Độ tin scale cùng tỉ lệ (3/2 thay 5/3) — cùng bộ số với Hình–Luyện (fn_mastery_cells_hinh, 21/08).
           -- "Là Hình–Học" = dạng nằm trong hinh_hoc_bai (KP = bài học). Đại / Hình giải tích giữ nguyên tham số.
           case when hh.ma_bai is not null then least(p_window, 3)  else p_window  end as cs,
           case when hh.ma_bai is not null then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh.ma_bai is not null then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from mg mf
    left join hinh_hoc_bai hh on hh.ma_bai = mf.ma_dang
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$function$;

CREATE OR REPLACE FUNCTION public.fn_mastery_cells_hinh(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, hinh_baitoan_id uuid, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  with m as (
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.hinh_baitoan_id is not null
      and (sp.phase in ('et', 'mt') or (p_include_btvn and sp.phase = 'btvn'))
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
    union all
    -- 14/10 BỔ TRỢ: kết quả luyện / phiếu giấy / test cuối ca / retest của dạng = bài mô hình (bai_test_cau.ma_dang = hinh_baitoan.ma).
    -- Cùng cách fn_mastery_cells: test cuối ca ('bo_tro_test') = 'et' (luôn tính); luyện + retest = 'btvn' (chỉ khi p_include_btvn).
    select bl.hoc_sinh_id, hb.id,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai = 'bo_tro_test' then 'et' else 'btvn' end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    join hinh_baitoan hb on hb.ma = btc.ma_dang
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
      and bt.loai in ('bo_tro', 'bo_tro_test', 'retest')
      and (bt.loai = 'bo_tro_test' or p_include_btvn)
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
  ),
  rk as (
    select m.*, case m.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by m.hoc_sinh_id, m.hinh_baitoan_id
                              order by m.t desc, m.src, m.value desc) as rn
    from m
  )
  select hoc_sinh_id, hinh_baitoan_id,
         sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0),
         count(*),
         case when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= 3 then 'cao' when count(*) >= 2 then 'tb' else 'thap' end
  from rk group by hoc_sinh_id, hinh_baitoan_id
$function$;

-- ── đề xuất dạng ──
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_nhom_cua_o(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
  -- 14/10: dạng = bài mô hình Hình (ma_dang = hinh_baitoan.ma) — yếu + có đo trong 2 cửa sổ gần nhất, cùng luật "cứ yếu là bổ trợ".
  return query
    select hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public.fn_mastery_cells_hinh(array[p_hs], true) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = p_hs and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc)
    order by (h.n >= 2) desc, h.score;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu'),
      -- 12/10: dạng CÓ ĐO sau khi mở case, tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — 1 lần cho mỗi cặp câu–mã chép của từng case
      gan as materialized (
        select cs.case_id, public._do_nhom_cua_o(d.ma_cau, d.ma_dang) as md
        from cs cross join lateral (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang is not null and g.graded_at > cs.created_at) d)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gan where gan.case_id = cs.case_id and gan.md = m.ma_dang)
      order by cs.case_id, (m.n >= 3) desc, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
    -- 14/10: bài mô hình Hình yếu, có đo SAU khi mở case (ET/BTVN/MT) hoặc từ kết quả bổ trợ — cùng luật dạng thường.
    for r in
      select y.id as case_id, y.hoc_sinh_id, hb.ma as ma_dang, public._kho_ten_dang(v_mon, hb.ma) as ten_dang, h.score, h.n
      from bo_tro_yeu y
      cross join lateral public.fn_mastery_cells_hinh(array[y.hoc_sinh_id], true) h
      join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = v_mon
      where y.mon = v_mon and y.trang_thai = 'dang_xu' and (p_case is null or y.id = p_case) and h.muc = 'yeu'
        and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.ma_dang = hb.ma)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = y.hoc_sinh_id and p.hinh_baitoan_id = hb.id and g.graded_at > y.created_at)
      order by y.id, (h.n >= 2) desc, h.score
    loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $function$;

-- ── luồng ca ──
CREATE OR REPLACE FUNCTION public.fn_btyeu_luyen_sinh(p_buoi uuid, p_ma_dang text, p_ma_cum text DEFAULT NULL::text, p_so_cau integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  b record; v_lop uuid; v_cautbl text; v_lttbl text;
  v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text;
begin
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or b.hoc_sinh_id <> v_hs then raise exception 'Không phải ca bổ trợ của em.'; end if;
  if b.trang_thai <> 'mo' or b.ngay <> public._btyeu_today() then raise exception 'Ca này không mở hôm nay.'; end if;
  if b.diem_danh is distinct from 'co_mat' then raise exception 'Chưa điểm danh có mặt.'; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — làm bài kiểm tra cuối buổi nhé.'; end if;
  if not exists (select 1 from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = p_ma_dang) then raise exception 'Dạng không thuộc ca bổ trợ này.'; end if;
  if public._kho_nhanh_cua_dang(b.mon, p_ma_dang) = 'hinh_mo_hinh' then raise exception 'Bài Hình theo mô hình học trên GIẤY với thầy cô — em đưa iPad cho trợ giảng, trợ giảng sẽ in đề và chấm cho em nhé.'; end if; -- 14/10

  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;

  v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang)); -- 29/09 nhánh theo dạng
  -- Câu đã gặp trong CA (mọi bài của buổi) — né trước, cạn thì lặp (trong _btyeu_chon_cau).
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;
  v_caus := public._btyeu_chon_cau(v_cautbl, p_ma_dang, p_ma_cum, v_tru, greatest(1, least(coalesce(p_so_cau, 3), 10)));
  if coalesce(array_length(v_caus, 1), 0) = 0 then raise exception 'Dạng này chưa có câu TRẮC NGHIỆM trong kho — em học dạng này với thầy cô trên giấy nhé (bổ trợ trên app chỉ dùng trắc nghiệm).'; end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
    values (null, v_lop, v_hs, public._btyeu_today(), 'bo_tro', b.mon, 0, 'mo', p_buoi) returning id into v_bt;
  foreach c in array v_caus loop
    i := i + 1;
    perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, p_ma_cum);
  end loop;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_in_sinh(p_buoi uuid, p_so_cau integer DEFAULT 5)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text; d record;
  v_thieu text[] := '{}'; v_n integer := greatest(1, least(coalesce(p_so_cau, 5), 10));
  v_chi_hinh boolean := coalesce(current_setting('bk.chi_hinh', true), '') = '1'; -- 14/10: ca 📱 app chỉ in các dạng Hình mô hình (xem fn_btyeu_in_sinh_hinh)
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được tài liệu.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không thấy ca bổ trợ yếu.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — không in thêm bài luyện.'; end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  for d in select ma_dang from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and dong_at is null
         and (not v_chi_hinh or public._kho_nhanh_cua_dang(b.mon, ma_dang) = 'hinh_mo_hinh') order by diem_luc_mo nulls last, created_at loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); -- 29/09 nhánh theo dạng
    v_caus := public._btyeu_chon_cau(v_cautbl, d.ma_dang, null, v_tru, v_n);
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || d.ma_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
    end loop;
    v_tru := v_tru || v_caus;
  end loop;
  if i = 0 then
    -- Không có câu nào ⇒ raise làm ROLLBACK cả transaction, dòng bai_test vừa tạo tự biến mất (không để lại bài rỗng).
    raise exception 'Các dạng của ca này chưa có câu trong kho — chưa in được.';
  end if;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $function$;

create or replace function public.fn_btyeu_in_sinh_hinh(p_buoi uuid, p_so_cau integer default 2) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  perform set_config('bk.chi_hinh', '1', true); -- chỉ trong giao dịch này
  return public.fn_btyeu_in_sinh(p_buoi, p_so_cau);
end $$;
revoke all on function public.fn_btyeu_in_sinh_hinh(uuid, integer) from public, anon;
grant execute on function public.fn_btyeu_in_sinh_hinh(uuid, integer) to authenticated, service_role;

CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_ta(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_bd text; v_cautbl text; v_cumtbl text; v_dangs jsonb; v_test jsonb; v_retest jsonb; v_dg jsonb; v_hs jsonb;
  rd record; v_nh text; v_mot jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(b.mon); v_cautbl := public._kho_cau_tbl(b.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  select jsonb_build_object('id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
           'level', (select level from hs_level where hoc_sinh_id = h.id and mon = b.mon and loai = 'kien_thuc'))
    into v_hs from hoc_sinh h where h.id = b.hoc_sinh_id;

  v_dangs := '[]'::jsonb;
  -- 29/09: mỗi dạng tra bản đồ/cụm theo NHÁNH của chính nó (Đại · Hình GT · Hình học) — trước 1 bảng cho cả case.
  for rd in select d.id, d.ma_dang from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id
              and not (d.dong_at is not null and public._kho_ten_dang(b.mon, d.ma_dang) is null) -- Thùy 10/10: dạng đã xoá khỏi bản đồ (đã đóng) không hiện nữa
            order by d.diem_luc_mo nulls last, d.created_at loop
    v_nh := public._kho_nhanh_cua_dang(b.mon, rd.ma_dang);
    v_bd := public._kho_ban_do_tbl(b.mon, v_nh); v_cautbl := public._kho_cau_tbl(b.mon, v_nh); v_cumtbl := public._kho_cum_tbl(v_cautbl);
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''), 'la_hinh_mh', $3,
      'day_at', d.day_at, 'day_buoi_id', d.day_buoi_id, 'dong_at', d.dong_at, 'diem_luc_mo', d.diem_luc_mo,
      'retest_diem', d.retest_diem, 'retest_at', d.retest_at, 'dat', d.dat,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'so_goi_y', coalesce((select sum(so_goi_y) from td where td.ma_dang = d.ma_dang), 0),
      'cau_cuoi_at', (select max(cau_cuoi_at) from td where td.ma_dang = d.ma_dang),
      'cums', coalesce((select jsonb_agg(jsonb_build_object(
          'ma_cum', td.ma_cum, 'ten', coalesce(c.ten, case when td.ma_cum is null then 'Cả dạng' else td.ma_cum end),
          'so_cau', td.so_cau, 'so_dung', td.so_dung, 'so_goi_y', td.so_goi_y, 'cau_cuoi_at', td.cau_cuoi_at) order by c.thu_tu nulls last)
        from td left join %2$I c on c.ma_cum = td.ma_cum where td.ma_dang = d.ma_dang), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cumtbl) into v_mot using p_buoi, rd.id, coalesce(v_nh = 'hinh_mo_hinh', false);
    v_dangs := v_dangs || jsonb_build_array(v_mot);
  end loop;

  -- Test cuối ca: điểm theo dạng (đã nộp) — chấm ở DB, app chỉ hiện.
  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', bl.trang_thai = 'da_nop', 'nop_at', bl.nop_at,
           'theo_dang', coalesce((
             select jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'so_cau', x.n, 'so_dung', x.d))
             from (select btc.ma_dang, count(*) n, count(*) filter (where blc.verdict = 'correct') d
                   from bai_test_cau btc left join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and blc.bai_lam_id = bl.id
                   where btc.bai_test_id = bt.id group by btc.ma_dang) x), '[]'::jsonb))
    into v_test
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' limit 1;

  select jsonb_build_object('bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau,
           'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at)
    into v_retest
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'retest' limit 1;

  select jsonb_build_object('nhan_xet', g.nhan_xet, 'muc_ma', g.muc_ma) into v_dg
    from buoi_danh_gia g where g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = b.hoc_sinh_id;

  return jsonb_build_object(
    'buoi_id', b.buoi_id, 'mon', b.mon, 'ngay', b.ngay, 'trang_thai', b.trang_thai, 'diem_danh', b.diem_danh,
    'buoi_hoc_hs_id', b.buoi_hoc_hs_id, 'nguoi_day_tg', b.nguoi_day_tg, 'danh_gia_xong_at', b.danh_gia_xong_at,
    'bo_tro_yeu_id', b.bo_tro_yeu_id, 'hs', v_hs, 'dangs', v_dangs, 'test', v_test, 'retest', v_retest, 'danh_gia', v_dg,
    'case_trang_thai', (select y.trang_thai from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'case_ket_qua', (select y.ket_qua from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'so_dang_con_day', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)),
    'so_lan_huy', (select count(*) from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id
                   where hh2.bo_tro_yeu_id = b.bo_tro_yeu_id and b2.trang_thai = 'huy'));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_hinh_yeu_theo_mo_hinh(p_chi_cua_toi boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with ns as (select public._btyeu_my_ns() as id),
  hs as (
    select h.id, h.ho_ten, h.ma_hs, h.khoi from hoc_sinh h
    where h.trang_thai = 'dang_hoc'
      and (not coalesce(p_chi_cua_toi, false)
           or exists (select 1 from hoc_sinh_lop hl join phan_cong_lop pc on pc.lop_id = hl.lop_id
                      where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and pc.nhan_su_id = (select id from ns)))
  ),
  m as (
    select c.hoc_sinh_id, c.hinh_baitoan_id, c.score, c.n, c.tin
    from public.fn_mastery_cells_hinh((select coalesce(array_agg(id), '{}') from hs), true) c
    where c.muc = 'yeu'
  ),
  cuoi as (   -- ngày đo gần nhất của (HS × bài toán): ngày buổi, không có thì ngày chấm (cùng cách fn_mastery_cells_hinh)
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           max(coalesce(bh.ngay, (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date)) as ngay
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where sp.hinh_baitoan_id is not null and g.hoc_sinh_id in (select hoc_sinh_id from m)
    group by 1, 2
  ),
  day_cuoi as (
    select distinct on (d.hoc_sinh_id, d.hinh_baitoan_id) d.hoc_sinh_id, d.hinh_baitoan_id, d.da_day, d.created_at, n2.ho_ten as nguoi
    from hinh_yeu_da_day d left join nhan_su n2 on n2.id = d.nguoi_id
    where d.hoc_sinh_id in (select hoc_sinh_id from m)
    order by d.hoc_sinh_id, d.hinh_baitoan_id, d.seq desc
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'hoc_sinh_id', hs.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi,
    'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc' and l.mon = 'Toán' order by hl.ngay_vao desc limit 1),
    'co_case_yeu', exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = hs.id and y.trang_thai = 'dang_xu'),
    'trong_case', exists (select 1 from bo_tro_yeu y join bo_tro_yeu_dang d on d.bo_tro_yeu_id = y.id where y.hoc_sinh_id = hs.id and y.trang_thai = 'dang_xu' and d.ma_dang = b.ma and d.dong_at is null),
    'hinh_baitoan_id', m.hinh_baitoan_id, 'bai_ma', b.ma, 'phat_bieu', left(coalesce(b.phat_bieu, b.de_bai_chuan, ''), 160),
    'mo_hinh_id', mh.id, 'mo_hinh', mh.ten,
    'score', round(m.score, 2), 'n', m.n, 'tin', m.tin, 'cuoi_do', c.ngay,
    'da_day', coalesce(dc.da_day, false), 'da_day_at', case when coalesce(dc.da_day, false) then dc.created_at end, 'da_day_boi', case when coalesce(dc.da_day, false) then dc.nguoi end,
    'yeu_sau_day', coalesce(dc.da_day, false) and c.ngay > (dc.created_at at time zone 'Asia/Ho_Chi_Minh')::date
  ) order by hs.ho_ten, m.score, mh.ten), '[]'::jsonb) end
  from m
  join hs on hs.id = m.hoc_sinh_id
  join hinh_baitoan b on b.id = m.hinh_baitoan_id
  join hinh_mo_hinh mh on mh.id = b.mo_hinh_id
  left join cuoi c on c.hoc_sinh_id = m.hoc_sinh_id and c.hinh_baitoan_id = m.hinh_baitoan_id
  left join day_cuoi dc on dc.hoc_sinh_id = m.hoc_sinh_id and dc.hinh_baitoan_id = m.hinh_baitoan_id
$function$;

-- ── đưa 1 bài từ danh sách Hình yếu vào case đang mở của em ──
create or replace function public.fn_hinh_yeu_dua_vao_case(p_hoc_sinh uuid, p_baitoan uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_b record; v_case uuid; v_score numeric; v_n int; v_moi boolean := false;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select b.id, b.ma, b.mon into v_b from hinh_baitoan b where b.id = p_baitoan;
  if v_b.id is null then raise exception 'Không thấy bài toán Hình.'; end if;
  select y.id into v_case from bo_tro_yeu y where y.hoc_sinh_id = p_hoc_sinh and y.mon = v_b.mon and y.trang_thai = 'dang_xu' limit 1;
  if v_case is null then
    return jsonb_build_object('ok', false, 'ly_do', 'chua_co_case'); -- chưa mở case: phải qua Duyệt bổ trợ (trần 70/20)
  end if;
  select h.score, h.n into v_score, v_n from public.fn_mastery_cells_hinh(array[p_hoc_sinh], true) h where h.hinh_baitoan_id = p_baitoan;
  insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
    values (v_case, v_b.ma, 'tay', v_score, v_n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
  v_moi := found;
  return jsonb_build_object('ok', true, 'moi', v_moi, 'case_id', v_case);
end $$;
revoke all on function public.fn_hinh_yeu_dua_vao_case(uuid, uuid) from public, anon;
grant execute on function public.fn_hinh_yeu_dua_vao_case(uuid, uuid) to authenticated, service_role;
