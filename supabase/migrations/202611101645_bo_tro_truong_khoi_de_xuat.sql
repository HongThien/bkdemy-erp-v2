-- ============================================================================
-- 202611101645 — bo_tro_truong_khoi_de_xuat
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 10/11): "Đưa Dashboard học tập vào phòng làm việc của trưởng khối, nằm ở Chất lượng … Story: trưởng khối đọc
--   Dashboard học tập, nắm tình hình chung và ra quyết định bổ trợ." Chốt cùng ngày:
--   · luồng mới THAY HẲN màn Duyệt bổ trợ cũ (Chốt tuần · Điểm thấp · Báo động · Đang theo dõi);
--   · trưởng khối bấm "Bổ trợ" ở Dashboard → chọn trong 5 NHÓM thấp nhất → em vào Danh sách bổ trợ (nháp, sửa/xoá được)
--     → "Chốt & gửi" → TRƯỞNG BỘ MÔN duyệt = MỞ CASE NHƯ CŨ (Lộc xếp lịch · TA dạy · test cuối ca). KHÔNG CÒN RETEST;
--   · cột sau tên = số NHÓM yếu là chính, số DẠNG yếu đi kèm;
--   · Dashboard đổi logic tính thành 5 LẦN thay vì 10 câu.
--
-- KHÔNG công thức mới cho "yếu" (CLAUDE.md §2.0): nhóm/dạng yếu = mastery THEO LẦN đọc qua `_mastery_lan_cap_nhanh` (bảng chụp mastery_luu_san, mig 202611101644 — em sạch đọc bảng, em bẩn tính trực tiếp; công thức `_mastery_lan_cap`, mig 202611101427 +
--   202611101521 của phiên bổ trợ theo nhóm, công tắc `mastery_theo_lan` đang BẬT) · số dạng yếu = `dang_yeu_hien_tai` (bảng
--   chụp mà ô Chất lượng/báo cáo tuần đang đọc). Dạng vào case khi duyệt = đúng luật "nhóm quyết, dạng thực thi" của
--   `_btyeu_dang_theo_nhom` (dạng đã đo chưa đạt của nhóm, mọi dạng đạt ⇒ dạng thấp nhất), chỉ khác: nhóm do NGƯỜI tick
--   (không lọc lại "nhóm phải yếu + có đo 2 cửa sổ" vì trưởng khối đã quyết).
-- Dashboard (fn_dbht_bang / fn_dbht_o_lich_su) là kênh quan sát riêng có cửa sổ tuần (khác mastery có chủ ý, mig 202610231524):
--   chỉ đổi ĐƠN VỊ từ câu sang lần cho khớp mastery theo lần — % ô = TB % của ≤5 lần gần nhất trong cửa sổ, mọi lần ngang nhau.
--
-- QUYỀN (chặn ở DB): trưởng khối = ai có ô (môn, khối) trong phạm vi (`_trong_pham_vi`: phân công trưởng khối · quản lý môn ·
--   QLCL toàn hệ). Trưởng bộ môn duyệt = `fn_phong_che_do()='tbm'` + `_phong_trong_pham_vi(môn, khối)`. Bảng chỉ ghi qua RPC.
--
-- MẤT GÌ (Luật xoá): KHÔNG xoá gì. fn_dbht_bang / fn_dbht_o_lich_su đổi công thức ô (câu → lần) + thêm trường; bảng/hàm mới.
--   Màn Duyệt bổ trợ cũ chỉ ẨN ở menu (client), bảng/hàm cũ giữ nguyên.
-- ============================================================================

-- ── 1. Bảng Danh sách bổ trợ (đề xuất của trưởng khối) + lịch sử trạng thái ─────
create table if not exists bo_tro_de_xuat (
  id           uuid primary key default gen_random_uuid(),
  hoc_sinh_id  uuid not null references hoc_sinh(id),
  mon          text not null,
  khoi         text not null,
  lop_id       uuid references lop(id),
  nhom         jsonb not null default '[]'::jsonb,   -- [{ma, ten, cha, p, n, muc}] — mã gốc nhóm + ảnh chụp số lúc chọn (DB tự đọc lại)
  muc          smallint not null default 2 check (muc in (1, 2, 3)),            -- L1 trước/sau giờ · L2 buổi riêng TA · L3 buổi riêng GV
  uu_tien      smallint not null default 2 check (uu_tien in (1, 2, 3)),        -- 3 Cao · 2 Thường · 1 Thấp
  ghi_chu      text not null default '',
  trang_thai   text not null default 'nhap' check (trang_thai in ('nhap', 'cho_duyet', 'da_duyet', 'tra_lai', 'huy')),
  ly_do_tra    text,
  case_id      uuid references bo_tro_yeu(id),
  so_dang      integer,                               -- số dạng đã đổ vào case lúc duyệt
  tao_boi      uuid references nhan_su(id),
  tao_at       timestamptz not null default now(),
  gui_boi      uuid references nhan_su(id),
  gui_at       timestamptz,
  duyet_boi    uuid references nhan_su(id),
  duyet_at     timestamptz,
  updated_at   timestamptz not null default now(),
  constraint bo_tro_de_xuat_nhom_ck check (jsonb_typeof(nhom) = 'array' and jsonb_array_length(nhom) >= 1)
);
comment on table bo_tro_de_xuat is
  'Danh sách bổ trợ của TRƯỞNG KHỐI (Thùy 10/11): chọn nhóm yếu ở Dashboard học tập → nháp → gửi → trưởng bộ môn duyệt (mở case bo_tro_yeu) / trả lại. Ghi chỉ qua fn_btk_*.';
create unique index if not exists bo_tro_de_xuat_song_uq on bo_tro_de_xuat (hoc_sinh_id, mon) where trang_thai in ('nhap', 'cho_duyet', 'tra_lai');
create index if not exists bo_tro_de_xuat_o_idx on bo_tro_de_xuat (mon, khoi, trang_thai);

create table if not exists bo_tro_de_xuat_log (
  id          bigserial primary key,
  de_xuat_id  uuid not null references bo_tro_de_xuat(id),
  actor       uuid references nhan_su(id),
  at          timestamptz not null default now(),
  tt_cu       text,
  tt_moi      text not null,
  du_lieu     jsonb not null default '{}'::jsonb
);
create index if not exists bo_tro_de_xuat_log_dx_idx on bo_tro_de_xuat_log (de_xuat_id, at);

create or replace function public._btk_ghi_log() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if tg_op = 'INSERT' or new.trang_thai is distinct from old.trang_thai or new.nhom is distinct from old.nhom
     or new.muc is distinct from old.muc or new.uu_tien is distinct from old.uu_tien or new.ghi_chu is distinct from old.ghi_chu then
    insert into bo_tro_de_xuat_log (de_xuat_id, actor, tt_cu, tt_moi, du_lieu)
    values (new.id, public.current_nhan_su_id(), case when tg_op = 'UPDATE' then old.trang_thai end, new.trang_thai,
            jsonb_build_object('nhom', new.nhom, 'muc', new.muc, 'uu_tien', new.uu_tien, 'ghi_chu', new.ghi_chu,
                               'ly_do_tra', new.ly_do_tra, 'case_id', new.case_id));
  end if;
  return new;
end $$;
drop trigger if exists trg_bo_tro_de_xuat_log on bo_tro_de_xuat;
create trigger trg_bo_tro_de_xuat_log after insert or update on bo_tro_de_xuat for each row execute function public._btk_ghi_log();

alter table bo_tro_de_xuat enable row level security;
alter table bo_tro_de_xuat_log enable row level security;
drop policy if exists bo_tro_de_xuat_doc on bo_tro_de_xuat;
create policy bo_tro_de_xuat_doc on bo_tro_de_xuat for select to authenticated using ((select public.la_thanh_vien()));
drop policy if exists bo_tro_de_xuat_log_doc on bo_tro_de_xuat_log;
create policy bo_tro_de_xuat_log_doc on bo_tro_de_xuat_log for select to authenticated using ((select public.la_thanh_vien()));

-- ── 2. Mastery NHÓM của các em (một nguồn: _mastery_lan_cap) — chỉ môn dùng bản đồ dai_ban_do (registry, không if môn) ──
create or replace function public._btk_nhom_hs(p_hs uuid[], p_mon text)
returns table(hoc_sinh_id uuid, ma text, ten text, cha text, score numeric, n bigint, muc text, tin text)
language sql stable security definer set search_path to 'public' as $$
  select m.hoc_sinh_id, m.nut, coalesce(nb.ten, hh.ten_bai, m.nut), coalesce(ch.ten, case when hh.ma_bai is not null then 'Hình học' end),
         m.score, m.n, m.muc, m.tin
    from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), p_hs, true, null, null, array['nhom'], 5, 5, 3) m
    left join dai_bdm_nhom nb on nb.id = m.nut
    left join dai_bdm_chuyen_de ch on ch.id = nb.chuyen_de_id
    left join hinh_hoc_bai hh on hh.ma_bai = m.nut
   where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and m.cap = 'nhom' and m.score is not null
     and (nb.id is not null or hh.ma_bai is not null) and public.la_thanh_vien()
$$;
revoke execute on function public._btk_nhom_hs(uuid[], text) from public, anon;
grant execute on function public._btk_nhom_hs(uuid[], text) to authenticated;   -- fn_dbht_bang (invoker) gọi

-- ── 3. Dashboard học tập: ô theo 5 LẦN + cột nhóm yếu / dạng yếu / báo động / trạng thái bổ trợ ──
create or replace function public.fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer default 4, p_cap text default 'chuyen_de')
returns jsonb language sql stable set search_path to 'public' as $function$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  ca as (   -- mọi lúc: trước cửa sổ chỉ để lấy "đầu kỳ"
    select x.*, _dbht_cot(p_cap, x.nhom_id, x.chuyen_de_id, x.chu_de_id) as cot, x.ngay >= _dbht_tu(p_so_tuan) as trong
      from _dbht_cau((select array_agg(hoc_sinh_id) from hs), null, p_mon) x
  ),
  -- ⭐ 10/11 (Thùy): đơn vị = LẦN (1 bài làm), không còn CÂU. % lần = TB các câu của lần thuộc cột; ô = TB % của ≤5 lần gần nhất.
  lan as (
    select hoc_sinh_id, cot, luot, bool_and(trong) as trong, min(ngay) as ngay, min(t) as t, min(_dbht_kenh_tt(kenh)) as ktt, avg(gia_tri) as p_lan
      from ca group by hoc_sinh_id, cot, luot
  ),
  xr as (
    select lan.*, row_number() over (partition by hoc_sinh_id, cot, trong order by ngay desc, ktt desc, t desc, luot desc) as rn,
           count(*) over (partition by hoc_sinh_id, cot, trong) as n
      from lan
  ),
  dau as (select hoc_sinh_id, cot, round(100 * avg(p_lan))::int as p from xr where not trong and rn <= 5 group by hoc_sinh_id, cot),
  dau2 as (   -- chưa đo trước cửa sổ ⇒ mốc = % LẦN ĐẦU trong cửa sổ (chỉ khi có ≥2 lần)
    select hoc_sinh_id, cot, round(100 * max(p_lan) filter (where rn = n))::int as p from xr where trong group by hoc_sinh_id, cot having max(n) >= 2
  ),
  o as (select hoc_sinh_id, cot, round(100 * avg(p_lan))::int as p, max(n) as n from xr where trong and rn <= 5 group by hoc_sinh_id, cot),
  od as (
    select o.*, o.p - coalesce(dau.p, dau2.p) as d, dau.p is not null as co_dau
      from o left join dau using (hoc_sinh_id, cot) left join dau2 using (hoc_sinh_id, cot)
  ),
  cot as (select distinct o.cot from o),
  cot_dai as (
    select cot.cot as ma,
           case p_cap when 'nhom' then n.ten when 'chu_de' then cd.ten else ch.ten end as ten,
           case p_cap when 'nhom' then ch.ten end as cha,
           0 as nhom_cot, cd.thu_tu as t1, coalesce(bo.thu_tu, 0) as t2, case when p_cap = 'nhom' then n.thu_tu else 0 end as t3
      from cot
      left join lateral (select n0.* from dai_bdm_nhom n0 where p_cap = 'nhom' and n0.id = cot.cot) n on true
      left join dai_bdm_chuyen_de ch on p_cap <> 'chu_de' and ch.id = case when p_cap = 'nhom' then n.chuyen_de_id else cot.cot end
      left join lateral (select o2.chu_de_id, o2.thu_tu from dai_bdm_o o2 join dai_bdm_chu_de cd2 on cd2.id = o2.chu_de_id
                          where p_cap <> 'chu_de' and o2.chuyen_de_id = ch.id and (p_cap <> 'nhom' or o2.chu_de_id = n.chu_de_id)
                          order by cd2.thu_tu limit 1) bo on true
      join dai_bdm_chu_de cd on cd.id = case when p_cap = 'chu_de' then cot.cot else bo.chu_de_id end
     where cot.cot not like 'H:%' and cot.cot <> 'HINH'
  ),
  cot_hinh as (
    select cot.cot as ma,
           'Hình · ' || coalesce('◈ ' || nb.ten,
                                 '★ ' || left(regexp_replace(coalesce(nullif(btrim(td.phat_bieu), ''), td.ma), '\s+', ' ', 'g'), 60),
                                 mh.ten || case when p_cap = 'nhom' and mh.id in (
                                     select public.fn_hl_goc_mo_hinh(b2.mo_hinh_id) from hinh_baitoan b2 join hinh_mo_hinh m2 on m2.id = b2.mo_hinh_id
                                      where b2.la_trong_diem or m2.vai = 'thanh_vien')
                                   then ' · ngoài trọng điểm' else '' end,
                                 cd.ten) as ten,
           case when p_cap = 'nhom' then coalesce(case when nb.id is not null or td.id is not null then g.ten end, cd2.ten, 'Hình') end as cha,
           1 as nhom_cot, coalesce(cd.thu_tu, cd2.thu_tu, 0) as t1, coalesce(g.thu_tu, 0) as t2,
           case when nb.id is not null then 0 when td.id is not null then 1 else 2 end as t3
      from cot
      left join hinh_mo_hinh nb on p_cap = 'nhom' and cot.cot like 'H:N:%' and nb.id::text = substr(cot.cot, 5)
      left join hinh_baitoan td on p_cap = 'nhom' and cot.cot like 'H:T:%' and td.id::text = substr(cot.cot, 5)
      left join hinh_mo_hinh mh on p_cap <> 'chu_de' and cot.cot !~ '^H:[NT]:' and mh.id::text = substr(cot.cot, 3)
      left join lateral (select coalesce(mh.id, public.fn_hl_goc_mo_hinh(coalesce(nb.id, td.mo_hinh_id))) as gid) gg on true
      left join hinh_mo_hinh g on g.id = gg.gid
      left join dai_bdm_chu_de cd on p_cap = 'chu_de' and cd.id = substr(cot.cot, 3)
      left join dai_bdm_chu_de cd2 on cd2.id = g.chu_de_id
     where cot.cot like 'H:%'
    union all
    select 'HINH', 'Hình', null, 2, 0, 0, 0 from cot where cot.cot = 'HINH'
  ),
  cot_ten as (select * from cot_dai union all select * from cot_hinh),
  -- ⭐ 10/11: cột ngay sau tên — NHÓM yếu (mastery theo lần) là chính, DẠNG yếu (bảng chụp dang_yeu_hien_tai) đi kèm
  ny as materialized (
    select x.hoc_sinh_id, count(*) filter (where x.muc = 'yeu')::int as nhom_yeu
      from public._btk_nhom_hs((select array_agg(hoc_sinh_id) from hs), p_mon) x group by x.hoc_sinh_id
  ),
  bd as (   -- báo động (chuông GV/TA) 30 ngày, đúng môn, chưa có quyết định bổ trợ nào sau chuông
    select cb.hoc_sinh_id, count(*)::int as so, max(cb.created_at) as moi_nhat,
           (array_agg(coalesce(nullif(btrim(cb.ghi_chu), ''), cb.nguon) order by cb.created_at desc))[1] as ghi_chu
      from canh_bao_yeu cb left join buoi_hoc b on b.id = cb.buoi_hoc_id left join lop bl on bl.id = b.lop_id
     where cb.hoc_sinh_id in (select hoc_sinh_id from hs) and cb.created_at >= now() - interval '30 days' and (bl.mon is null or bl.mon = p_mon)
       and not exists (select 1 from bo_tro_de_xuat dx where dx.hoc_sinh_id = cb.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai <> 'huy' and dx.tao_at >= cb.created_at)
     group by cb.hoc_sinh_id
  ),
  bt as (   -- trạng thái bổ trợ: đề xuất đang sống, không có thì case đang mở
    select hs.hoc_sinh_id,
           coalesce((select jsonb_build_object('id', dx.id, 'tt', dx.trang_thai) from bo_tro_de_xuat dx
                      where dx.hoc_sinh_id = hs.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
                    (select jsonb_build_object('id', y.id, 'tt', 'dang_bo_tro') from bo_tro_yeu y
                      where y.hoc_sinh_id = hs.hoc_sinh_id and y.mon = p_mon and y.trang_thai = 'dang_xu' limit 1)) as j
      from hs
  )
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', ma, 'ten', ten, 'cha', cha) order by nhom_cot, t1, t2, t3, ten) from cot_ten), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', hs.hoc_sinh_id, 'ten', x.ho_ten, 'lop_id', hs.lop_id, 'lop', hs.ten_lop,
              'nhom_yeu', ny.nhom_yeu, 'dang_yeu', dy.so_dang_yeu,
              'bao_dong', case when bd.so > 0 then jsonb_build_object('so', bd.so, 'at', bd.moi_nhat, 'ghi_chu', bd.ghi_chu) end,
              'bt', bt.j,
              'o', coalesce((select jsonb_object_agg(od.cot, jsonb_build_object('p', od.p, 'n', od.n, 'd', od.d, 'dk', od.co_dau)) from od where od.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten)
            from hs join hoc_sinh x on x.id = hs.hoc_sinh_id
            left join ny on ny.hoc_sinh_id = hs.hoc_sinh_id
            left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = hs.hoc_sinh_id and dy.mon = p_mon
            left join bd on bd.hoc_sinh_id = hs.hoc_sinh_id
            left join bt on bt.hoc_sinh_id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$function$;

create or replace function public.fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_tuan integer default 4)
returns jsonb language sql stable set search_path to 'public' as $function$
  with c as (
    select x.*, row_number() over (order by x.ngay, _dbht_kenh_tt(x.kenh), x.t, x.luot, x.thu_tu) as seq
      from _dbht_cau(array[p_hs], null, p_mon) x
     where _dbht_cot(p_cap, x.nhom_id, x.chuyen_de_id, x.chu_de_id) = p_ma
  ),
  -- ⭐ 10/11: 1 LẦN = 1 bài làm (luot) — % lần = TB câu của lần; "hiện tại" = TB % của ≤5 lần gần nhất
  lu_all as (
    select luot, min(ngay) as ngay, min(t) as t, min(kenh) as kenh, sum(gia_tri) as dung, count(*) as tong, max(seq) as cuoi, avg(gia_tri) as p_lan
      from c group by luot
  ),
  dau as (
    select round(100 * avg(p_lan))::int as p, avg(p_lan) as tl, count(*) as n
      from (select p_lan from lu_all where ngay < _dbht_tu(p_so_tuan) order by cuoi desc limit 5) z
    having count(*) > 0
  ),
  lu as (select lu_all.*, row_number() over (order by cuoi) as k from lu_all where ngay >= _dbht_tu(p_so_tuan)),
  lq as (select lu.*, (select avg(x.p_lan) from lu x where x.k between lu.k - 4 and lu.k) as tl5, least(lu.k, 5) as so_lan5 from lu),
  ld as (
    select lq.*, round(100 * tl5)::int as p, round(100 * p_lan)::int as p_luot,
           round(100 * (p_lan - coalesce(lag(tl5) over (order by k), (select tl from dau))))::int as delta,
           round(100 * coalesce(lag(tl5) over (order by k), (select tl from dau)))::int as p_truoc
      from lq
  )
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'dau_ky', (select jsonb_build_object('p', p, 'n', n) from dau),
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', ld.ngay, 'kenh', ld.kenh, 'dung', round(ld.dung, 2), 'tong', ld.tong, 'so_lan5', ld.so_lan5,
              'p', ld.p, 'p_luot', ld.p_luot, 'p_truoc', ld.p_truoc, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', w.ma_cau, 'dang', w.ten_dang, 'g', round(w.gia_tri, 2)) order by w.seq)
                        from c w where w.luot = ld.luot))
            order by ld.k) from ld), '[]'::jsonb)
  )
$function$;

-- ── 4. Quyền ─────────────────────────────────────────────────────────────────
create or replace function public._btk_la_tk(p_mon text, p_khoi text) returns boolean
language sql stable security definer set search_path to 'public' as $$ select coalesce(public._trong_pham_vi(p_mon, p_khoi), false) $$;
create or replace function public._btk_la_tbm(p_mon text, p_khoi text) returns boolean
language sql stable security definer set search_path to 'public' as $$
  select coalesce(public.fn_phong_che_do() = 'tbm' and public._phong_trong_pham_vi(p_mon, p_khoi), false) $$;
revoke execute on function public._btk_la_tk(text, text) from public, anon;
revoke execute on function public._btk_la_tbm(text, text) from public, anon;

-- Lớp + khối của em trong môn (lớp đang học)
create or replace function public._btk_lop_hs(p_hs uuid, p_mon text) returns table(lop_id uuid, khoi text)
language sql stable security definer set search_path to 'public' as $$
  select l.id, l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by l.ten_lop limit 1 $$;
revoke execute on function public._btk_lop_hs(uuid, text) from public, anon, authenticated;

-- ── 5. Gợi ý cho popup: 5 nhóm thấp nhất (thấp → cao), tick sẵn nhóm YẾU ───────
create or replace function public.fn_btk_goi_y(p_hs uuid, p_mon text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_lop record; v jsonb;
begin
  select * into v_lop from public._btk_lop_hs(p_hs, p_mon);
  if v_lop.khoi is null then raise exception 'Em không học lớp % nào đang mở.', p_mon; end if;
  if not (public._btk_la_tk(p_mon, v_lop.khoi) or public._btk_la_tbm(p_mon, v_lop.khoi)) then
    raise exception 'Không có quyền với khối % môn %', v_lop.khoi, p_mon using errcode = '42501';
  end if;
  with nh as (select * from public._btk_nhom_hs(array[p_hs], p_mon)),
  dg as (   -- dạng đã đo / chưa đạt trong nhóm — biết tick nhóm này sẽ đổ bao nhiêu dạng
    select coalesce(hh.ma_bai, db.nhom_id) as nhom, count(*) filter (where m.muc <> 'dat')::int as chua_dat, count(*)::int as da_do
      from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang'], 5, 5, 3) m
      left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
     where m.cap = 'dang' group by 1
  )
  select jsonb_build_object(
    'khoi', v_lop.khoi,
    'so_nhom_do', (select count(*) from nh),
    'so_nhom_yeu', (select count(*) from nh where muc = 'yeu'),
    'dang_yeu', (select so_dang_yeu from dang_yeu_hien_tai where hoc_sinh_id = p_hs and mon = p_mon),
    'nhom', coalesce((select jsonb_agg(jsonb_build_object('ma', z.ma, 'ten', z.ten, 'cha', z.cha, 'p', round(100 * z.score)::int, 'n', z.n,
                         'muc', z.muc, 'tin', z.tin, 'dang_chua_dat', coalesce(dg.chua_dat, 0), 'dang_da_do', coalesce(dg.da_do, 0), 'tick', z.muc = 'yeu')
                       order by z.score, z.ten)
                      from (select * from nh order by score, ten limit 5) z left join dg on dg.nhom = z.ma), '[]'::jsonb),
    'de_xuat', (select to_jsonb(dx) - 'tao_boi' - 'gui_boi' - 'duyet_boi' from bo_tro_de_xuat dx
                 where dx.hoc_sinh_id = p_hs and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
    'dang_bo_tro', exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai = 'dang_xu')
  ) into v;
  return v;
end $$;
revoke execute on function public.fn_btk_goi_y(uuid, text) from public, anon;
grant execute on function public.fn_btk_goi_y(uuid, text) to authenticated;

-- ── 6. Trưởng khối: lưu (thêm / sửa) · bỏ · gửi ───────────────────────────────
create or replace function public.fn_btk_luu(p_id uuid, p_hs uuid, p_mon text, p_nhom text[], p_muc integer, p_uu_tien integer, p_ghi_chu text)
returns uuid language plpgsql volatile security definer set search_path to 'public' as $$
declare v_lop record; v_dx bo_tro_de_xuat; v_nhom jsonb; v_id uuid; v_me uuid := public.current_nhan_su_id();
begin
  if p_id is not null then
    select * into v_dx from bo_tro_de_xuat where id = p_id for update;
    if v_dx.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
    p_hs := v_dx.hoc_sinh_id; p_mon := v_dx.mon;
  end if;
  select * into v_lop from public._btk_lop_hs(p_hs, p_mon);
  if v_lop.khoi is null then raise exception 'Em không học lớp % nào đang mở.', p_mon; end if;
  if not public._btk_la_tk(p_mon, v_lop.khoi) then raise exception 'Không có quyền đề xuất bổ trợ khối % môn %', v_lop.khoi, p_mon using errcode = '42501'; end if;
  if coalesce(cardinality(p_nhom), 0) = 0 then raise exception 'Chọn ít nhất 1 nhóm.'; end if;
  if p_muc not in (1, 2, 3) or p_uu_tien not in (1, 2, 3) then raise exception 'Mức / ưu tiên không hợp lệ.'; end if;
  -- ảnh chụp nhóm do DB đọc lại (không tin số client gửi); nhóm em chưa đo vẫn nhận (p null)
  select jsonb_agg(jsonb_build_object('ma', x.ma,
           'ten', coalesce(m.ten, nb.ten, hh.ten_bai, x.ma), 'cha', coalesce(m.cha, ch.ten),
           'p', case when m.score is not null then round(100 * m.score)::int end, 'n', m.n, 'muc', m.muc) order by m.score nulls last)
    into v_nhom
    from (select distinct unnest(p_nhom) as ma) x
    left join public._btk_nhom_hs(array[p_hs], p_mon) m on m.ma = x.ma
    left join dai_bdm_nhom nb on nb.id = x.ma left join dai_bdm_chuyen_de ch on ch.id = nb.chuyen_de_id
    left join hinh_hoc_bai hh on hh.ma_bai = x.ma
   where nb.id is not null or hh.ma_bai is not null;
  if v_nhom is null then raise exception 'Nhóm không có trong bản đồ.'; end if;

  if p_id is null then
    if exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai = 'dang_xu') then
      raise exception 'Em đang có case bổ trợ % mở — chờ xong case rồi đề xuất tiếp.', p_mon;
    end if;
    if exists (select 1 from bo_tro_de_xuat where hoc_sinh_id = p_hs and mon = p_mon and trang_thai in ('nhap', 'cho_duyet', 'tra_lai')) then
      raise exception 'Em đã có trong Danh sách bổ trợ — sửa dòng đó.';
    end if;
    insert into bo_tro_de_xuat (hoc_sinh_id, mon, khoi, lop_id, nhom, muc, uu_tien, ghi_chu, tao_boi)
    values (p_hs, p_mon, v_lop.khoi, v_lop.lop_id, v_nhom, p_muc, p_uu_tien, coalesce(p_ghi_chu, ''), v_me)
    returning id into v_id;
    return v_id;
  end if;
  if v_dx.trang_thai not in ('nhap', 'tra_lai') then raise exception 'Dòng đã gửi trưởng bộ môn / đã xử lý — không sửa được.'; end if;
  update bo_tro_de_xuat set nhom = v_nhom, muc = p_muc, uu_tien = p_uu_tien, ghi_chu = coalesce(p_ghi_chu, ''),
         trang_thai = 'nhap', khoi = v_lop.khoi, lop_id = v_lop.lop_id, updated_at = now()
   where id = p_id;
  return p_id;
end $$;

create or replace function public.fn_btk_huy(p_id uuid)
returns void language plpgsql volatile security definer set search_path to 'public' as $$
declare v bo_tro_de_xuat;
begin
  select * into v from bo_tro_de_xuat where id = p_id for update;
  if v.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
  if not public._btk_la_tk(v.mon, v.khoi) then raise exception 'Không có quyền.' using errcode = '42501'; end if;
  if v.trang_thai not in ('nhap', 'tra_lai') then raise exception 'Chỉ bỏ được dòng nháp / bị trả lại.'; end if;
  update bo_tro_de_xuat set trang_thai = 'huy', updated_at = now() where id = p_id;
end $$;

create or replace function public.fn_btk_gui(p_mon text, p_khoi text)
returns integer language plpgsql volatile security definer set search_path to 'public' as $$
declare v_n integer;
begin
  if not public._btk_la_tk(p_mon, p_khoi) then raise exception 'Không có quyền.' using errcode = '42501'; end if;
  update bo_tro_de_xuat set trang_thai = 'cho_duyet', gui_boi = public.current_nhan_su_id(), gui_at = now(), ly_do_tra = null, updated_at = now()
   where mon = p_mon and khoi = p_khoi and trang_thai = 'nhap';
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Không có dòng nháp nào để gửi.'; end if;
  return v_n;
end $$;

-- ── 7. Danh sách (trưởng khối: 1 ô · trưởng bộ môn: p_khoi null = mọi khối trong phạm vi) ──
create or replace function public.fn_btk_ds(p_mon text, p_khoi text default null, p_so_ngay integer default 14)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v jsonb;
begin
  if p_khoi is not null and not (public._btk_la_tk(p_mon, p_khoi) or public._btk_la_tbm(p_mon, p_khoi)) then
    raise exception 'Không có quyền với khối % môn %', p_khoi, p_mon using errcode = '42501';
  end if;
  if p_khoi is null and public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ trưởng bộ môn xem mọi khối.' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', dx.id, 'hoc_sinh_id', dx.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'lop', l.ten_lop, 'khoi', dx.khoi,
           'nhom', dx.nhom, 'muc', dx.muc, 'uu_tien', dx.uu_tien, 'ghi_chu', dx.ghi_chu, 'trang_thai', dx.trang_thai,
           'ly_do_tra', dx.ly_do_tra, 'so_dang', dx.so_dang, 'case_id', dx.case_id,
           'case_tt', y.trang_thai, 'case_ket_qua', y.ket_qua,
           'tao_at', dx.tao_at, 'tao_ten', nt.ho_ten, 'gui_at', dx.gui_at, 'gui_ten', ng.ho_ten, 'duyet_at', dx.duyet_at, 'duyet_ten', nd.ho_ten,
           'dang_yeu', dy.so_dang_yeu)
         order by dx.khoi, case dx.trang_thai when 'tra_lai' then 0 when 'nhap' then 1 when 'cho_duyet' then 2 else 3 end, dx.uu_tien desc, hs.ho_ten), '[]'::jsonb)
    into v
    from bo_tro_de_xuat dx
    join hoc_sinh hs on hs.id = dx.hoc_sinh_id
    left join lop l on l.id = dx.lop_id
    left join bo_tro_yeu y on y.id = dx.case_id
    left join nhan_su nt on nt.id = dx.tao_boi left join nhan_su ng on ng.id = dx.gui_boi left join nhan_su nd on nd.id = dx.duyet_boi
    left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = dx.hoc_sinh_id and dy.mon = dx.mon
   where dx.mon = p_mon and (p_khoi is null or dx.khoi = p_khoi)
     and (p_khoi is not null or public._btk_la_tbm(dx.mon, dx.khoi))
     and (dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai')
          or (dx.trang_thai = 'da_duyet' and dx.duyet_at >= now() - make_interval(days => greatest(1, least(coalesce(p_so_ngay, 14), 90)))));
  return v;
end $$;

-- ── 8. Trưởng bộ môn: duyệt (= mở case như cũ) · trả lại ─────────────────────
create or replace function public.fn_btk_duyet(p_id uuid)
returns jsonb language plpgsql volatile security definer set search_path to 'public' as $$
declare
  v bo_tro_de_xuat; v_chan text; v_lv_cu smallint; v_case uuid; v_truoc uuid; v_n integer := 0;
  v_nhom text[]; v_uid uuid := public.jwt_uid(); v_ly_do text;
begin
  select * into v from bo_tro_de_xuat where id = p_id for update;
  if v.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
  if not public._btk_la_tbm(v.mon, v.khoi) then raise exception 'Chỉ trưởng bộ môn % duyệt được khối %', v.mon, v.khoi using errcode = '42501'; end if;
  if v.trang_thai <> 'cho_duyet' then raise exception 'Dòng không ở trạng thái chờ duyệt.'; end if;

  -- (1) trần 70 em / 20 Cao — cùng hàm màn duyệt cũ (trigger trg_btyeu_suc_chua vẫn chặn lần nữa khi mở case)
  if not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = v.hoc_sinh_id and y.mon = v.mon and y.trang_thai = 'dang_xu') then
    v_chan := public.fn_btyeu_kiem_suc_chua(v.hoc_sinh_id, v.mon, v.uu_tien::int);
    if v_chan is not null then raise exception '%', v_chan; end if;
  end if;

  -- (2) mức: ghi log trước rồi trạng thái (y như duyetLevel)
  select level into v_lv_cu from hs_level where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and loai = 'kien_thuc';
  select string_agg(n->>'ten', ', ') into v_ly_do from jsonb_array_elements(v.nhom) n;
  v_ly_do := 'Trưởng khối đề xuất (Dashboard học tập) — nhóm: ' || coalesce(v_ly_do, '') || case when v.ghi_chu <> '' then ' · ' || v.ghi_chu else '' end;
  insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
  values (v.hoc_sinh_id, v.mon, 'kien_thuc', coalesce(v_lv_cu, 0), null, jsonb_build_object('nguon', 'truong_khoi_de_xuat', 'de_xuat_id', v.id),
          v.muc, v_ly_do, v_uid);
  insert into hs_level (hoc_sinh_id, mon, loai, level, updated_at) values (v.hoc_sinh_id, v.mon, 'kien_thuc', v.muc, now())
  on conflict (hoc_sinh_id, mon, loai) do update set level = excluded.level, updated_at = now();

  -- (3) mở case mới hoặc gộp vào case đang mở (y như moHoacGopCaseBoTroYeu)
  select id into v_case from bo_tro_yeu where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and trang_thai = 'dang_xu';
  if v_case is null then
    select id into v_truoc from bo_tro_yeu where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and trang_thai = 'hoan_thanh' order by created_at desc limit 1;
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, actor, case_truoc_id, uu_tien)
    values (v.hoc_sinh_id, v.lop_id, v.mon, 'thu_cong', v_ly_do, v_uid, v_truoc, v.uu_tien)
    returning id into v_case;
  end if;

  -- (4) dạng vào case: "nhóm quyết, dạng thực thi" — mọi dạng ĐÃ ĐO chưa đạt của nhóm tick; nhóm mà mọi dạng đạt ⇒ dạng thấp nhất
  select array_agg(n->>'ma') into v_nhom from jsonb_array_elements(v.nhom) n;
  with dg as (
    select m.nut as ma_dang, m.score, m.n, m.muc, coalesce(hh.ma_bai, db.nhom_id) as nhom
      from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[v.hoc_sinh_id], true, null, null, array['dang'], 5, 5, 3) m
      left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
     where m.cap = 'dang'
  ),
  ung as (select dg.*, row_number() over (partition by dg.nhom order by dg.score, dg.n desc, dg.ma_dang) as rn from dg where dg.nhom = any(v_nhom)),
  chon as (
    select u.* from ung u
     where (u.muc <> 'dat' or u.rn = 1)
       and public._kho_ten_dang(v.mon, u.ma_dang) is not null and not public._kho_dang_da_xoa_mem(u.ma_dang)
  ),
  ins as (
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
    select v_case, c.ma_dang, 'duyet', c.score, least(c.n, 32767)::smallint from chon c
    on conflict (bo_tro_yeu_id, ma_dang) do nothing
    returning 1
  )
  select count(*) into v_n from ins;

  update bo_tro_de_xuat set trang_thai = 'da_duyet', duyet_boi = public.current_nhan_su_id(), duyet_at = now(),
         case_id = v_case, so_dang = v_n, updated_at = now()
   where id = p_id;
  return jsonb_build_object('case_id', v_case, 'so_dang', v_n);
end $$;

create or replace function public.fn_btk_tra_lai(p_id uuid, p_ly_do text)
returns void language plpgsql volatile security definer set search_path to 'public' as $$
declare v bo_tro_de_xuat;
begin
  select * into v from bo_tro_de_xuat where id = p_id for update;
  if v.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
  if not public._btk_la_tbm(v.mon, v.khoi) then raise exception 'Chỉ trưởng bộ môn trả lại được.' using errcode = '42501'; end if;
  if v.trang_thai <> 'cho_duyet' then raise exception 'Dòng không ở trạng thái chờ duyệt.'; end if;
  if nullif(btrim(p_ly_do), '') is null then raise exception 'Ghi lý do trả lại.'; end if;
  update bo_tro_de_xuat set trang_thai = 'tra_lai', ly_do_tra = btrim(p_ly_do), duyet_boi = public.current_nhan_su_id(), duyet_at = now(), updated_at = now()
   where id = p_id;
end $$;

do $$ declare f text; begin
  foreach f in array array['fn_btk_luu(uuid, uuid, text, text[], integer, integer, text)', 'fn_btk_huy(uuid)', 'fn_btk_gui(text, text)',
                           'fn_btk_ds(text, text, integer)', 'fn_btk_duyet(uuid)', 'fn_btk_tra_lai(uuid, text)'] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
