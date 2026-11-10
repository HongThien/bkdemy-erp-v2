-- ============================================================================
-- 202611101756 — dashboard_hoc_tap_doc_mastery_luu_san
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 10/11): "sao cái dashboard trong chỗ phòng làm việc vẫn tính. t bảo dùng cache từ bên mastery rồi mà" ⇒
--   "Chuyển hết mastery theo lần. ko dùng theo câu nữa. theo lần thì t nghĩ ko cần filter thời gian nữa đâu".
--   Trước: ô Dashboard chạy công thức riêng (_dbht_cau, cửa sổ 2–4 tuần) đọc thẳng từng câu mỗi lần mở ⇒ ~2 s/khối, lần nguội 17 s.
--   Nay: ô Dashboard = ĐÚNG số mastery theo lần (TB 5 lần gần nhất, Hình–Học 3) đọc BẢNG CHỤP mastery_luu_san (mig 202611101644),
--   không còn cửa sổ tuần, không còn mũi tên so đầu kỳ. Một công thức duy nhất (_mastery_lan_cap) cho Dashboard · bổ trợ · nhóm yếu.
--   Dashboard có 3 tầng (chủ đề · chuyên đề · nhóm bài) ⇒ mastery theo lần thêm 2 cấp CHUYÊN ĐỀ + CHỦ ĐỀ, cùng luật
--   (1 lần = 1 bài làm, % lần = TB câu của lần thuộc nút; Hình–Học: bài học = chuyên đề = nhóm, chủ đề = chủ đề của bài).
--   Nguồn quy nút tách thành `_mastery_lan_d` để _mastery_lan_cap và lịch sử ô (popup) dùng CHUNG, không chép 2 nơi.
-- Bảng chụp: nới CHECK cap cho 2 cấp mới; fn_mastery_lam_moi chụp cả 4 cấp và tự chụp lại (cũ nhất trước) những em đã chụp
--   mà chưa có cấp chuyên đề — không đánh bẩn hàng loạt (đánh bẩn = mọi màn phải tính trực tiếp trong giờ HS chơi).
--   Em chưa chụp lại xong ⇒ ô chuyên đề/chủ đề của em tạm trống (đọc bảng), tự đủ sau 1–2 lượt cron 5 phút.
-- Sửa thẳng trên định nghĩa ĐANG CHẠY của fn_mastery_lam_moi (không chép tay); đoạn cần thay không đúng nguyên văn ⇒ dừng.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu. Bỏ CHECK cũ `mastery_luu_san_cap_check` (dang|nhom) để đặt CHECK rộng hơn (dang|nhom|chuyen_de|chu_de).
--   fn_dbht_bang / fn_dbht_o_lich_su thôi đọc _dbht_cau (hàm + kênh cũ giữ nguyên, không xoá); tham số p_so_tuan giữ chữ ký nhưng bỏ qua.
-- ============================================================================

-- ── 1. Nguồn quy nút chung (lượt đo → dạng · nhóm · chuyên đề · chủ đề) ───────────
create or replace function public._mastery_lan_d(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                 p_since timestamp with time zone, p_den timestamp with time zone)
returns table(hoc_sinh_id uuid, luot text, value numeric, t timestamp with time zone, src text,
              dang text, nhom text, chuyen_de text, chu_de text, hh boolean)
language sql stable as $$
  select l.hoc_sinh_id, l.luot, l.value, l.t, l.src, l.ma_dang,
         coalesce(hh.ma_bai, db.nhom_id),
         coalesce(hh.ma_bai, nb.chuyen_de_id),        -- Hình–Học: bài học = chuyên đề = nhóm (Thùy 28/10)
         coalesce(hh.chu_de_id, nb.chu_de_id),
         (hh.ma_bai is not null)
    from public._mastery_luot_do_quy(p_bdm, false, p_hs, p_include_btvn, p_since, p_den) l
    left join hinh_hoc_bai hh on hh.ma_bai = l.ma_dang
    left join dai_bdm_dang_bai db on db.id = l.ma_dang
    left join dai_bdm_nhom nb on nb.id = db.nhom_id
   where l.src <> 'tu_luyen' or l.cap1          -- Thùy 10/11: bỏ tự luyện, trừ cấp 1
$$;
revoke all on function public._mastery_lan_d(boolean, uuid[], boolean, timestamptz, timestamptz) from public, anon;
grant execute on function public._mastery_lan_d(boolean, uuid[], boolean, timestamptz, timestamptz) to authenticated, service_role;

-- ── 2. _mastery_lan_cap: thêm cấp chuyen_de + chu_de (dang/nhom y nguyên) ─────────
create or replace function public._mastery_lan_cap(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                   p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[],
                                                   p_window integer, p_tin_cao integer, p_tin_tb integer)
returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
language sql stable rows 20000 as $$
  with d as materialized (
    select * from public._mastery_lan_d(p_bdm, p_hs, p_include_btvn, p_since, p_den)
  ),
  lan as (
    select hoc_sinh_id, 'dang'::text as cap, dang as nut, luot, bool_or(hh) as hh, avg(value) as p, max(t) as t
    from d where 'dang' = any(p_caps) group by hoc_sinh_id, dang, luot
    union all
    select hoc_sinh_id, 'nhom', nhom, luot, bool_or(hh), avg(value), max(t)
    from d where 'nhom' = any(p_caps) and nhom is not null group by hoc_sinh_id, nhom, luot
    union all
    select hoc_sinh_id, 'chuyen_de', chuyen_de, luot, bool_or(hh), avg(value), max(t)
    from d where 'chuyen_de' = any(p_caps) and chuyen_de is not null group by hoc_sinh_id, chuyen_de, luot
    union all
    select hoc_sinh_id, 'chu_de', chu_de, luot, bool_or(hh), avg(value), max(t)
    from d where 'chu_de' = any(p_caps) and chu_de is not null group by hoc_sinh_id, chu_de, luot
  ),
  rk as (
    select lan.*,
           row_number() over (partition by hoc_sinh_id, cap, nut order by t desc, luot desc) as rn,
           -- Hình–Học (CEO 14/10): thang 3 thay 5, độ tin 3/2
           case when hh then least(p_window, 3)  else p_window  end as cs,
           case when hh then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from lan
  )
  select hoc_sinh_id, cap, nut,
         avg(p) filter (where rn <= cs) as score,     -- mọi lần ngang nhau
         count(*) as n,                               -- n = SỐ LẦN
         case when avg(p) filter (where rn <= cs) >= 0.8 then 'dat'
              when avg(p) filter (where rn <= cs) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, cap, nut
$$;

-- ── 3. Bảng chụp: nhận 2 cấp mới + làm mới chụp đủ 4 cấp ───────────────────────
alter table public.mastery_luu_san drop constraint if exists mastery_luu_san_cap_check;
alter table public.mastery_luu_san add constraint mastery_luu_san_cap_check check (cap in ('dang', 'nhom', 'chuyen_de', 'chu_de'));

do $mig$
declare d text; n text; c integer;
begin
  select pg_get_functiondef('public.fn_mastery_lam_moi(integer)'::regprocedure) into d;
  c := (length(d) - length(replace(d, $a$array['dang', 'nhom']$a$, ''))) / length($a$array['dang', 'nhom']$a$);
  if c <> 2 then raise exception 'fn_mastery_lam_moi đã đổi: thấy % chỗ array[dang, nhom], cần đúng 2', c; end if;
  n := replace(d, $a$array['dang', 'nhom']$a$, $a$array['dang', 'nhom', 'chuyen_de', 'chu_de']$a$);
  -- sau "em chưa từng chụp": em đã chụp mà chưa có cấp chuyên đề (bản chụp trước 10/11 18h) ⇒ chụp lại, cũ nhất trước
  if position($a$    exit when cardinality(v_lo) = 0;$a$ in n) = 0 then raise exception 'fn_mastery_lam_moi đã đổi: không thấy dòng exit'; end if;
  n := replace(n, $a$    exit when cardinality(v_lo) = 0;$a$,
$a$    if cardinality(v_lo) = 0 then   -- 10/11: bản chụp cũ thiếu cấp chuyên đề/chủ đề (mig 202611101756) ⇒ chụp lại dần, cũ nhất trước
      select coalesce(array_agg(z.hoc_sinh_id), '{}') into v_lo
      from (select t.hoc_sinh_id from mastery_luu_san_tinh t
            where exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = t.hoc_sinh_id and s.cap = 'nhom')
              and not exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = t.hoc_sinh_id and s.cap = 'chuyen_de')
            order by t.tinh_at limit 20) z;
    end if;
    exit when cardinality(v_lo) = 0;$a$);
  execute n;
end $mig$;

-- ── 4. Dashboard học tập: ô = mastery theo lần, đọc bảng chụp ─────────────────────
create or replace function public.fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer default 4, p_cap text default 'chuyen_de')
returns jsonb language sql stable set search_path to 'public' as $function$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  ca as (select case p_cap when 'nhom' then 'nhom' when 'chu_de' then 'chu_de' else 'chuyen_de' end as c),
  -- ⭐ 10/11 (Thùy): đọc BẢNG CHỤP mastery theo lần (em bẩn mới tính trực tiếp) — một lượt cho cấp đang xem + cấp nhóm (cột Nhóm yếu)
  m as materialized (
    select x.* from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), (select array_agg(hoc_sinh_id) from hs), true,
                                                  null, null, array[(select c from ca), 'nhom'], 5, 5, 3) x
     where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and x.score is not null
  ),
  o as (select m.hoc_sinh_id, m.nut as cot, round(100 * m.score)::int as p, m.n, m.muc, m.tin from m where m.cap = (select c from ca)),
  ny as (select m.hoc_sinh_id, count(*) filter (where m.muc = 'yeu')::int as nhom_yeu from m where m.cap = 'nhom' group by m.hoc_sinh_id),
  cot as (select distinct o.cot from o),
  cot_ten as (
    select cot.cot as ma,
           coalesce(case when hb.ma_bai is not null then 'Hình · ' || hb.ten_bai
                         when p_cap = 'nhom' then nb.ten when p_cap = 'chu_de' then cd.ten else ch.ten end, cot.cot) as ten,
           case when p_cap = 'nhom' then coalesce(ch.ten, cd.ten) when hb.ma_bai is not null and p_cap <> 'chu_de' then cd.ten end as cha,
           (hb.ma_bai is not null or cd.nhanh in ('hinh', 'hinh_hoc', 'hinh_luyen'))::int as t0,
           coalesce(cd.thu_tu, 0) as t1, coalesce(bo.thu_tu, 0) as t2, coalesce(nb.thu_tu, hb.thu_tu, 0) as t3
      from cot
      left join hinh_hoc_bai hb on hb.ma_bai = cot.cot
      left join dai_bdm_nhom nb on p_cap = 'nhom' and nb.id = cot.cot
      left join dai_bdm_chuyen_de ch on ch.id = case when p_cap = 'nhom' then nb.chuyen_de_id when p_cap = 'chuyen_de' then cot.cot end
      left join lateral (select o2.chu_de_id, o2.thu_tu from dai_bdm_o o2 join dai_bdm_chu_de c2 on c2.id = o2.chu_de_id
                          where ch.id is not null and o2.chuyen_de_id = ch.id and (nb.id is null or o2.chu_de_id = nb.chu_de_id)
                          order by c2.thu_tu limit 1) bo on true
      left join dai_bdm_chu_de cd on cd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, hb.chu_de_id, nb.chu_de_id, bo.chu_de_id)
  ),
  bd as (   -- báo động (chuông GV/TA) 30 ngày, đúng môn, chưa có quyết định bổ trợ nào sau chuông
    select cb.hoc_sinh_id, count(*)::int as so, max(cb.created_at) as moi_nhat,
           (array_agg(coalesce(nullif(btrim(cb.ghi_chu), ''), cb.nguon) order by cb.created_at desc))[1] as ghi_chu
      from canh_bao_yeu cb left join buoi_hoc b on b.id = cb.buoi_hoc_id left join lop bl on bl.id = b.lop_id
     where cb.hoc_sinh_id in (select hoc_sinh_id from hs) and cb.created_at >= now() - interval '30 days' and (bl.mon is null or bl.mon = p_mon)
       and not exists (select 1 from bo_tro_de_xuat dx where dx.hoc_sinh_id = cb.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai <> 'huy' and dx.tao_at >= cb.created_at)
     group by cb.hoc_sinh_id
  ),
  bt as (
    select hs.hoc_sinh_id,
           coalesce((select jsonb_build_object('id', dx.id, 'tt', dx.trang_thai) from bo_tro_de_xuat dx
                      where dx.hoc_sinh_id = hs.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
                    (select jsonb_build_object('id', y.id, 'tt', 'dang_bo_tro') from bo_tro_yeu y
                      where y.hoc_sinh_id = hs.hoc_sinh_id and y.mon = p_mon and y.trang_thai = 'dang_xu' limit 1)) as j
      from hs
  )
  select jsonb_build_object(
    'tu', null,
    'tinh_at', (select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id in (select hoc_sinh_id from hs)),
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', ma, 'ten', ten, 'cha', cha) order by t0, t1, t2, t3, ten) from cot_ten), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', hs.hoc_sinh_id, 'ten', x.ho_ten, 'lop_id', hs.lop_id, 'lop', hs.ten_lop,
              'nhom_yeu', ny.nhom_yeu, 'dang_yeu', dy.so_dang_yeu,
              'bao_dong', case when bd.so > 0 then jsonb_build_object('so', bd.so, 'at', bd.moi_nhat, 'ghi_chu', bd.ghi_chu) end,
              'bt', bt.j,
              'o', coalesce((select jsonb_object_agg(o.cot, jsonb_build_object('p', o.p, 'n', o.n, 'muc', o.muc, 'tin', o.tin, 'd', null, 'dk', false))
                               from o where o.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten)
            from hs join hoc_sinh x on x.id = hs.hoc_sinh_id
            left join ny on ny.hoc_sinh_id = hs.hoc_sinh_id
            left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = hs.hoc_sinh_id and dy.mon = p_mon
            left join bd on bd.hoc_sinh_id = hs.hoc_sinh_id
            left join bt on bt.hoc_sinh_id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$function$;

-- ── 5. Lịch sử 1 ô (bấm mới gọi): từng LẦN của nút, % hiện tại = TB ≤5 lần (Hình–Học 3) tới lần đó — cùng nguồn _mastery_lan_d ──
create or replace function public.fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_tuan integer default 4)
returns jsonb language sql stable set search_path to 'public' as $function$
  with d as (
    select x.* from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true, null, null) x
     where case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
  ),
  lu as (select luot, min(t) as t, min(src) as src, sum(value) as dung, count(*) as tong, avg(value) as p_lan from d group by luot),
  k as (select lu.*, row_number() over (order by t, luot) as k, case when (select bool_or(hh) from d) then 3 else 5 end as cs from lu),
  lq as (select k.*, (select avg(x.p_lan) from k x where x.k between k.k - k.cs + 1 and k.k) as tl, least(k.k, k.cs) as so_lan5 from k),
  ld as (
    select lq.*, round(100 * tl)::int as p, round(100 * p_lan)::int as p_luot,
           round(100 * (p_lan - lag(tl) over (order by k)))::int as delta, round(100 * lag(tl) over (order by k))::int as p_truoc
      from lq
  )
  select jsonb_build_object(
    'tu', null, 'dau_ky', null,
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', (ld.t at time zone 'Asia/Ho_Chi_Minh')::date, 'kenh', ld.src, 'dung', round(ld.dung, 2), 'tong', ld.tong, 'so_lan5', ld.so_lan5,
              'p', ld.p, 'p_luot', ld.p_luot, 'p_truoc', ld.p_truoc, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', null, 'dang', coalesce(public._kho_ten_dang(p_mon, w.dang), w.dang), 'g', round(w.value, 2)))
                        from d w where w.luot = ld.luot))
            order by ld.k) from ld), '[]'::jsonb)
  )
$function$;
