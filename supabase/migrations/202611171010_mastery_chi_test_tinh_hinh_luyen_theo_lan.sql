-- 17/11/2026 · Thùy chốt (spec-mastery.md §10): (1) chỉ TEST tính mastery, LUYỆN không tính · (2) test bù + test học từ đầu tính như ET (như test cuối ca yếu)
-- · (3) Hình–Luyện đo THEO LẦN như phần còn lại (≤3 lần · 30 ngày · không trọng số · bỏ luyện / retest) · fn_mastery_cells_hinh thành lớp mỏng (một công thức).
-- Sinh bằng .tmp-claude/gen-mig.mjs từ thân hàm ĐANG CHẠY; chốt chặn dưới dừng nếu phiên khác đã đổi hàm sau lúc sinh.
-- Không đổi chữ ký, không đổi quyền. Áp xong: gọi fn_mastery_danh_dau_tat_ca() để bản lưu sẵn chụp lại (đổi hàm không tự đánh bẩn).
do $$ begin
  if md5(pg_get_functiondef('public._mastery_luot_do_quy'::regproc)) <> '43cd2b8f8a237be98abb7172cb6295cc'
     or md5(pg_get_functiondef('public._mastery_cells_hinh_tai'::regproc)) <> '9110b148019004ed950a8d3917952da1'
     or md5(pg_get_functiondef('public.fn_mastery_cells_hinh'::regproc)) <> '29b9a6c1b5b64a84c3c353c2808a6ac6' then
    raise exception 'Hàm mastery đã bị đổi sau lúc sinh migration — sinh lại từ bản đang chạy';
  end if;
end $$;

CREATE OR REPLACE FUNCTION public._mastery_luot_do_quy(p_bdm boolean, p_khtn_bdm boolean, p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, value numeric, t timestamp with time zone, src text, luot text, cap1 boolean)
 LANGUAGE sql
 STABLE
AS $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '5')) /* 12/11 Thùy: 4T · 5T không tính tự luyện */ as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI; lần = phase + buổi (ET / MT / BTVN của một buổi)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau,
           sp.phase || ':' || coalesce(sp.buoi_hoc_id::text, 'd' || (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date::text) as luot
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: lần = một bài làm
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test') then 'et'   /* 17/11 Thùy: mọi bài TEST tính như ET (test cuối ca yếu · test bù · test học từ đầu) */
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau,
           'bl:' || bl.id
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test', 'tu_luyen', 'btvn', 'giao_trinh')   /* 17/11 Thùy: chỉ TEST tính, LUYỆN không tính (bo_tro · bu_luyen · htd_luyen · retest · on_thi_luyen · thi_thu); loại mới phải thêm tường minh */
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at; lần = một phiếu (tai_lieu)
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau,
           'bt:' || tl.id
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.*, h.cap1 from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = quy theo (câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as materialized (   -- 24/10: KHÔNG để Postgres inline — inline thì quy dạng chạy lại cho TỪNG lượt đo
    select d.kc, d.kd, public._do_o_quy(p_bdm, p_khtn_bdm, d.kc, d.kd) as nhom
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  )
  select mf.hoc_sinh_id, cap.nhom, mf.value, mf.t, mf.src, mf.luot, mf.cap1
  from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
$function$;

CREATE OR REPLACE FUNCTION public._mastery_cells_hinh_tai(p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, hinh_baitoan_id uuid, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  /* 17/11 Thùy "chuyển sang luật mới toàn bộ": Hình–Luyện (bài mô hình) đo THEO LẦN như phần còn lại (spec-mastery.md §6):
     một lần = một bài làm · TB ≤ 3 lần gần nhất (thang Hình 3, CEO 14/10) · 30 ngày tới mốc · không trọng số · chỉ TEST tính, luyện / retest không tính. */
  with m as (
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase || ':' || coalesce(sp.buoi_hoc_id::text, 'd' || (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date::text) as luot
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.hinh_baitoan_id is not null
      and (sp.phase in ('et', 'mt') or (p_include_btvn and sp.phase = 'btvn'))
      and coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= greatest(p_since, coalesce(p_den, now()) - interval '30 days')
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    select bl.hoc_sinh_id, hb.id,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           'bl:' || bl.id
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    join hinh_baitoan hb on hb.ma = btc.ma_dang
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
      and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)   /* câu app có bản sao trong bảng chấm buổi ⇒ lấy bản chấm buổi */
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
      and (bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test') or (p_include_btvn and bt.loai in ('btvn', 'giao_trinh')))
      and coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= greatest(p_since, coalesce(p_den, now()) - interval '30 days')
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
  ),
  lan as (
    select m.hoc_sinh_id, m.hinh_baitoan_id, m.luot, avg(m.value) as p, max(m.t) as t
    from m group by m.hoc_sinh_id, m.hinh_baitoan_id, m.luot
  ),
  rk as (
    select lan.*, row_number() over (partition by lan.hoc_sinh_id, lan.hinh_baitoan_id order by lan.t desc, lan.luot desc) as rn
    from lan
  )
  select rk.hoc_sinh_id, rk.hinh_baitoan_id,
         avg(rk.p) filter (where rk.rn <= 3) as score,
         count(*) as n,
         case when avg(rk.p) filter (where rk.rn <= 3) >= 0.8 then 'dat'
              when avg(rk.p) filter (where rk.rn <= 3) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= 3 then 'cao' when count(*) >= 2 then 'tb' else 'thap' end
  from rk group by rk.hoc_sinh_id, rk.hinh_baitoan_id
$function$;

CREATE OR REPLACE FUNCTION public.fn_mastery_cells_hinh(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, hinh_baitoan_id uuid, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  /* 17/11: MỘT công thức Hình–Luyện — bản này trước là bản chép riêng của _mastery_cells_hinh_tai, giờ chỉ gọi vào đó */
  select * from public._mastery_cells_hinh_tai(p_hs, p_include_btvn, p_since, null)
$function$;
