-- ============================================================================
-- "Dạng LỚP ĐÃ HỌC" LƯU SẴN theo lớp — Thùy 12/11 ("mọi thứ liên quan đến mastery thì làm cache là cách chuẩn")
--
-- Bệnh: _hs_dang_da_hoc(em, môn) — gọi bởi tự luyện, bản đồ phiêu lưu, Đấu trường, học theo chủ đề… (7 hàm) —
-- mỗi lượt quét TOÀN BỘ lịch sử làm bài của CẢ LỚP (gami_grades + bai_lam_cau + bt_grades, không giới hạn thời gian)
-- rồi quy từng (câu, dạng) về nhóm (_do_o ~2.000 lần). Đo 12/11: 0,25–1,1 s mỗi lần; tự luyện tự động 1,1–1,9 s.
-- Cache mastery (mastery_luu_san) không trả lời được: nó là điểm TỪNG EM trong 30 ngày, còn đây là tập dạng CẢ LỚP mọi thời điểm.
--
-- Sửa (cùng khuôn cache mastery):
--   · _lop_nh_tinh(hs[])      = phần quét lịch sử + quy nhóm, NGUYÊN VĂN từ hàm cũ ⇒ các cặp (em, dạng gốc, nhóm).
--   · lop_dang_da_hoc_luu     = kết quả đó theo (lớp, môn) + danh sách em lúc tính.
--   · _hs_dang_da_hoc         = GIỮ chữ ký, GIỮ STABLE. Đọc cache khi: cùng danh sách em VÀ (cache mới hơn lần làm mới
--                               mastery gần nhất của mọi em trong lớp HOẶC cache ≤ 20 phút). Không thì tính trực tiếp như cũ.
--                               Phần "dạng lớp đã được GIAO" (bai_test của lớp) + "mở riêng cho em" vẫn đọc trực tiếp (rẻ, tức thời).
--   · _lop_dang_da_hoc_lam_moi = cron 5 phút: lớp nào có em vừa được làm mới mastery sau lúc chụp ⇒ chụp lại, cũ nhất trước.
-- Độ trễ: dạng mới học (qua bài chấm) vào danh sách chậm tối đa ~5–20 phút; dạng mới GIAO thì tức thời.
-- Bảng lưu là BẢNG ĐỆM (ghi đè từng lớp), không phải dữ liệu gốc.
-- ============================================================================

create table if not exists public.lop_dang_da_hoc_luu (
  lop_id   uuid not null,
  mon      text not null,
  hs       uuid[] not null,          -- danh sách em (đã sắp) lúc tính — đổi sĩ số ⇒ cache không dùng
  nh       jsonb not null,           -- [{"h": hoc_sinh_id, "g": dạng gốc, "n": nhóm}]
  tinh_at  timestamptz not null,
  primary key (lop_id, mon)
);
comment on table public.lop_dang_da_hoc_luu is 'Bảng đệm "dạng lớp đã học" (mig 202611121507). Chỉ _lop_dang_da_hoc_lam_moi ghi; _hs_dang_da_hoc đọc.';
alter table public.lop_dang_da_hoc_luu enable row level security;
revoke all on public.lop_dang_da_hoc_luu from anon, authenticated;

-- Phần quét lịch sử + quy nhóm — NGUYÊN VĂN các CTE ev / cap / nh của _hs_dang_da_hoc cũ.
create or replace function public._lop_nh_tinh(v_hs uuid[])
returns table(hoc_sinh_id uuid, goc text, nhom text)
language sql stable security definer set search_path = public as $$
  with ev as materialized (
    select g.hoc_sinh_id, coalesce(sp.ma_cau, '') as k, sp.ma_dang
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.hoc_sinh_id = any(v_hs) and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn')
    union all
    select bl.hoc_sinh_id, coalesce(btc.ma_cau, ''), btc.ma_dang
      from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = any(v_hs) and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
    union all
    select tl.hoc_sinh_id, coalesce(btg.ma_cau, ''), btg.ma_dang
      from bt_grades btg join tai_lieu tl on tl.id = btg.tai_lieu_id
     where tl.hoc_sinh_id = any(v_hs) and btg.ma_dang is not null
  ), cap as materialized (
    select p.k, p.ma_dang, coalesce(public._do_o(nullif(p.k, ''), nullif(p.ma_dang, '')), p.ma_dang) as nhom
      from (select distinct e.k, e.ma_dang from ev e) p
  )
  select distinct e.hoc_sinh_id, e.ma_dang, c.nhom
    from ev e join cap c on c.k = e.k and c.ma_dang = e.ma_dang
$$;

create or replace function public._hs_dang_da_hoc(p_hs uuid, p_mon text)
returns text[]
language plpgsql stable security definer set search_path = public as $$
declare v_lop uuid; v_hs uuid[]; v_n integer; v_res text[]; v_nh jsonb;
begin
  v_lop := public._hs_lop_tu_luyen(p_hs, p_mon);
  if v_lop is null then return '{}'::text[]; end if;
  select coalesce(array_agg(distinct hl.hoc_sinh_id), '{}'::uuid[]) into v_hs from hoc_sinh_lop hl where hl.lop_id = v_lop and hl.trang_thai = 'dang_hoc';
  if not (p_hs = any(v_hs)) then v_hs := v_hs || p_hs; end if;
  v_n := cardinality(v_hs);

  -- cache lớp: cùng sĩ số và (mới hơn mọi lần làm mới mastery của lớp, hoặc chụp ≤ 20 phút)
  select c.nh into v_nh from lop_dang_da_hoc_luu c
   where c.lop_id = v_lop and c.mon = p_mon
     and c.hs = array(select x from unnest(v_hs) x order by x)
     and (c.tinh_at > now() - interval '20 minutes'
          or c.tinh_at >= coalesce((select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id = any(v_hs)), '-infinity'));
  if v_nh is null then
    select coalesce(jsonb_agg(jsonb_build_object('h', x.hoc_sinh_id, 'g', x.goc, 'n', x.nhom)), '[]'::jsonb) into v_nh
      from public._lop_nh_tinh(v_hs) x;
  end if;

  with nh as (
    select (e->>'h')::uuid as hoc_sinh_id, e->>'g' as goc, e->>'n' as nhom from jsonb_array_elements(v_nh) e
  ), qua as (
    select n.nhom from nh n where n.nhom is not null group by n.nhom
     having count(distinct n.hoc_sinh_id) >= least(2, v_n) or bool_or(n.hoc_sinh_id = p_hs)
  ), giao as (   -- dạng LỚP ĐÃ GIAO (ET/BTVN/đề thi/giáo trình của lớp), kể cả chưa chấm xong — đọc trực tiếp như cũ
    select distinct btc.ma_dang, btc.ma_cau from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
     where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and btc.ma_dang is not null
  )
  select coalesce(array_agg(distinct x.d), '{}'::text[]) into v_res from (
    select nhom as d from qua
    union select n.goc from nh n where n.nhom in (select nhom from qua) and n.goc is not null
    union select ma_dang from giao
    union select public._do_o_bdm(g.ma_cau, g.ma_dang) from giao g where public._mastery_bdm_bat()
  ) x;
  -- MỞ RIÊNG cho em (Thùy 23/10): chỉ cộng khi đang có lọc (rỗng = không lọc, cộng vào sẽ thành lọc)
  if cardinality(v_res) > 0 then
    select array(select distinct d from unnest(v_res || coalesce((select array_agg(m.ma_dang) from hs_mo_dang m
                                                                   where m.hoc_sinh_id = p_hs and m.mon = p_mon), '{}'::text[])) d)
      into v_res;
  end if;
  return v_res;
end $$;

-- Làm mới: lớp đang học chưa có cache / đổi sĩ số / có em vừa làm mới mastery sau lúc chụp — cũ nhất trước, có ngân sách giây.
create or replace function public._lop_dang_da_hoc_lam_moi(p_giay int default 20)
returns int language plpgsql volatile security definer set search_path = public as $$
declare v_t0 timestamptz := clock_timestamp(); v_n int := 0; r record;
begin
  if not pg_try_advisory_xact_lock(hashtext('_lop_dang_da_hoc_lam_moi')) then return -1; end if;
  for r in
    select l.id as lop_id, l.mon, array(select hl.hoc_sinh_id from hoc_sinh_lop hl where hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
                                        group by hl.hoc_sinh_id order by hl.hoc_sinh_id) as hs, c.tinh_at
      from lop l left join lop_dang_da_hoc_luu c on c.lop_id = l.id and c.mon = l.mon
     where l.trang_thai = 'dang_hoc' and l.mon is not null
     order by c.tinh_at nulls first
  loop
    exit when clock_timestamp() - v_t0 > make_interval(secs => p_giay);
    continue when cardinality(r.hs) = 0;
    continue when r.tinh_at is not null
      and r.hs = (select c.hs from lop_dang_da_hoc_luu c where c.lop_id = r.lop_id and c.mon = r.mon)
      and r.tinh_at >= coalesce((select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id = any(r.hs)), '-infinity');
    insert into lop_dang_da_hoc_luu (lop_id, mon, hs, nh, tinh_at)
    select r.lop_id, r.mon, r.hs,
           coalesce((select jsonb_agg(jsonb_build_object('h', x.hoc_sinh_id, 'g', x.goc, 'n', x.nhom)) from public._lop_nh_tinh(r.hs) x), '[]'::jsonb),
           clock_timestamp()
    on conflict (lop_id, mon) do update set hs = excluded.hs, nh = excluded.nh, tinh_at = excluded.tinh_at;
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

revoke execute on function public._lop_nh_tinh(uuid[]), public._lop_dang_da_hoc_lam_moi(int) from public, anon, authenticated;

-- Chụp lần đầu mọi lớp đang học.
select public._lop_dang_da_hoc_lam_moi(900) as so_lop_da_chup;
