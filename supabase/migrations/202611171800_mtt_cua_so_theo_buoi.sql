set local lock_timeout = '3s';
-- ============================================================================
-- 202611171800 — mtt_cua_so_theo_buoi  (Thùy 17/11 tối: "m làm hết đi")
-- ----------------------------------------------------------------------------
-- VÌ SAO: sáng 17/11 (mig 1216 · 1222) Phần 1 đổi sang "buổi diễn ra trong tuần" ⇒ trộn 2 đồng hồ (bài theo ngày dạy, lần đo theo ngày chấm):
--   BTVN buổi cuối tuần (vd 6S1 T6 20/11, chấm 24/11) rơi vào khe — không là việc của tuần nào, lần đo của nó không nằm trên tờ nào.
--   Thùy chốt tối 17/11: "BTVN phải đi theo ngày chấm — mục tiêu cũng đổi theo, đúng luật lùi 1 buổi" · "cả ET cũng phải đi theo buổi học kiến thức,
--   chỉ có bổ trợ kiến thức đã học mới khác" · "1 tuần 2 buổi — lấy buổi 13 và 17 thì lấy BTVN và ET của 2 buổi này cho đồng bộ".
-- LUẬT: đơn vị Phần 1 = BUỔI HỌC. Buổi thuộc tuần chứa BUỔI KẾ của lớp (BTVN chấm xong trước buổi kế) — cờ 's'.
--   · Phần 1 = nhóm của các buổi đó; mỗi buổi 2 lần đo dự kiến (ET + BTVN của chính buổi đó) — ET đi CÙNG buổi, không tách sang tuần khác.
--   · Việc của con = ET + BTVN của các buổi đó (kể cả ca chiếu chưa mở buổi ⇒ "sắp tới") + ca bổ trợ (Phần 2, theo ngày diễn ra ca — không đổi).
--   · Khởi điểm của nhóm = mastery TRƯỚC buổi sớm nhất của nhóm trong tuần (bỏ các lần đo từ ngày buổi đó trở đi khỏi ảnh đầu tuần), mục tiêu =
--     mastery nếu các lần đo của tuần đều Tốt ⇒ ET đã làm trước thứ Hai (vd ET T6 13/11 trong tuần 16–22) vẫn hiện là phần tăng của tuần, không đếm 2 lần.
--   · Khôi phục dòng "sắp học — tính vào tuần sau" (buổi trong tuần mà buổi kế sang tuần sau).
--   · Việc "thêm sau khi công bố" so theo (loại, NGÀY) thay vì mã buổi — lúc công bố buổi sắp dạy chưa có mã.
--   · Ảnh đầu tuần (mtt_dau) giữ tới 10 lần / nhóm (trước: ≤ cs) để cắt "trước buổi" còn đủ lần. Ảnh tuần đã chụp giữ nguyên (≤ cs lần).
-- CÁCH LÀM: vá ĐÚNG từng đoạn trên thân ĐANG CHẠY (pg_get_functiondef), mỗi đoạn phải khớp đúng 1 chỗ, lệch ⇒ raise, không ghi gì
--   (cùng cách mig 1216 · 1221 · 1222). Chạy ở SQL Editor; cuối file trả chủ hàm mới về claude_build (bài học sự cố 15 giờ 16–17/11).
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. Tờ NHÁP (lớp chưa công bố) tự tính lại ở lượt điều phối kế. Lớp ĐÃ công bố tuần này giữ bản khoá
--   (Thùy: để nguyên tới hết tuần) — chỉ khởi điểm / dòng "thêm sau khi công bố" tính lại theo luật mới.
-- ============================================================================

-- khởi điểm của một nhóm TRƯỚC buổi sớm nhất của nhóm trong tuần: bỏ các lần đo có t ≥ 00:00 (giờ VN) ngày buổi đó khỏi ảnh đầu tuần.
-- p_e = mtt_dau.nhom->ma ({s, cs, lan:[[epoch, giá trị], …] mới nhất trước}) · p_ngay_hoc = ['YYYY-MM-DD', …] (rỗng/null ⇒ trả nguyên p_e).
create or replace function public._mtt_dau_buoi(p_e jsonb, p_ngay_hoc jsonb)
returns jsonb
language sql stable set search_path to 'public' as $$
  select case
    when p_e is null or coalesce(jsonb_array_length(p_ngay_hoc), 0) = 0 then p_e
    else (
      with m as (
        select extract(epoch from (min((x #>> '{}')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh'))::bigint as t0
          from jsonb_array_elements(p_ngay_hoc) x
      ),
      l as (
        select a.e, a.ord from jsonb_array_elements(coalesce(p_e->'lan', '[]'::jsonb)) with ordinality as a(e, ord), m
         where (a.e->>0)::bigint < m.t0
      )
      select jsonb_build_object(
               'cs', p_e->'cs',
               's', (select round(avg((l2.e->>1)::numeric), 4)
                       from (select l.e from l order by l.ord limit coalesce((p_e->>'cs')::int, 5)) l2),
               'lan', coalesce((select jsonb_agg(l.e order by l.ord) from l), '[]'::jsonb))
    ) end
$$;
revoke execute on function public._mtt_dau_buoi(jsonb, jsonb) from public, anon, authenticated;

-- ── 1. _mtt_tinh ──
do $do$
declare d text; c int;
  cu0 text := replace($a$        select n.value #>> '{}' as ma,
               (case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end) as k,
               (bb.b->>'w')::boolean as s, true as goc, bb.b->'ngay' as ngay   /* 17/11: Phần 1 = bài của buổi DIỄN RA TRONG TUẦN (w), không phải buổi cuối tuần trước */$a$, E'\r', '');
  mo0 text := replace($a$        select n.value #>> '{}' as ma,
               case when (bb.b->>'s')::boolean then 2 else 0 end as k,
               (bb.b->>'s')::boolean as s, true as goc, bb.b->'ngay' as ngay   /* 17/11 tối (Thùy): buổi thuộc tuần của BUỔI KẾ (lùi một buổi); ET + BTVN của buổi đi CÙNG buổi ⇒ 2 lần đo */$a$, E'\r', '');
  cu1 text := replace($a$   where false   /* 17/11: bỏ "sắp học (tính vào tuần sau)" — buổi cuối tuần giờ thuộc Phần 1 của chính tuần này */$a$, E'\r', '');
  mo1 text := replace($a$   where (e->>'w')::boolean and not (e->>'s')::boolean   /* 17/11 tối: khôi phục — buổi trong tuần mà buổi kế sang tuần sau ⇒ tính vào tuần sau */$a$, E'\r', '');
  cu2 text := replace($a$      from bb where (bb.b->>'w')::boolean and bb.b->>'id' is not null   -- ca chiếu (chưa mở buổi) không thành việc của con$a$, E'\r', '');
  mo2 text := replace($a$      from bb where (bb.b->>'s')::boolean   /* 17/11 tối: ET của buổi thuộc tuần (s) — kể cả ca chiếu chưa mở buổi (id null ⇒ "sắp tới") */$a$, E'\r', '');
  cu3 text := replace($a$      from bb where (bb.b->>'s')::boolean and (bb.b->>'w')::boolean and bb.b->>'id' is not null   /* 17/11: BTVN chỉ của buổi trong tuần */$a$, E'\r', '');
  mo3 text := replace($a$      from bb where (bb.b->>'s')::boolean   /* 17/11 tối: BTVN của buổi thuộc tuần (s) — đi cùng ET của buổi đó, kể cả ca chiếu */$a$, E'\r', '');
  cu4 text := replace($a$                          where (bx->>'id')::uuid = d2.buoi_id) end,$a$, E'\r', '');
  mo4 text := replace($a$                          where (bx->>'id')::uuid = d2.buoi_id
                             or (d2.buoi_id is null and bx->>'id' is null and (bx->>'ngay')::date = d2.ngay)) end,   /* 17/11 tối: việc của ca chiếu */$a$, E'\r', '');
  cu5 text := replace($a$where x->>'loai' = e->>'loai' and x->>'buoi_id' = e->>'buoi_id'))$a$, E'\r', '');
  mo5 text := replace($a$where x->>'loai' = e->>'loai' and x->>'ngay' = e->>'ngay'))   /* 17/11 tối: so theo NGÀY — lúc công bố buổi sắp dạy chưa có mã buổi */$a$, E'\r', '');
  cu6 text := replace($a$           (v_dau->tat.ma->>'s')::numeric as p_dau,
           coalesce((v_dau->tat.ma->>'cs')::int, case when tat.ma like 'HH%' then 3 else 5 end) as cs,
           coalesce(v_dau->tat.ma->'lan', '[]'::jsonb) as lan,$a$, E'\r', '');
  mo6 text := replace($a$           (public._mtt_dau_buoi(v_dau->tat.ma, tat.ngay_hoc)->>'s')::numeric as p_dau,   /* 17/11 tối: khởi điểm = TRƯỚC buổi của tuần */
           coalesce((v_dau->tat.ma->>'cs')::int, case when tat.ma like 'HH%' then 3 else 5 end) as cs,
           coalesce(public._mtt_dau_buoi(v_dau->tat.ma, tat.ngay_hoc)->'lan', '[]'::jsonb) as lan,$a$, E'\r', '');
  cu7 text := replace($a$(v_dau->x.ma->>'s')::numeric as p_dau,$a$, E'\r', '');
  mo7 text := replace($a$(public._mtt_dau_buoi(v_dau->x.ma, x.ngay_hoc)->>'s')::numeric as p_dau,   /* 17/11 tối: khởi điểm trước buổi */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_tinh(uuid,text,date,timestamptz)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu0, ''))) / length(cu0);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "n1 (nhóm Phần 1 + số lần đo)" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu0, mo0);
  c := (length(d) - length(replace(d, cu1, ''))) / length(cu1);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "sắp học" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu1, mo1);
  c := (length(d) - length(replace(d, cu2, ''))) / length(cu2);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "việc ET" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu2, mo2);
  c := (length(d) - length(replace(d, cu3, ''))) / length(cu3);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "việc BTVN" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu3, mo3);
  c := (length(d) - length(replace(d, cu4, ''))) / length(cu4);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "nhóm của việc" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu4, mo4);
  c := (length(d) - length(replace(d, cu5, ''))) / length(cu5);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "thêm sau khi công bố" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu5, mo5);
  c := (length(d) - length(replace(d, cu6, ''))) / length(cu6);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "khởi điểm (bản nháp)" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu6, mo6);
  c := (length(d) - length(replace(d, cu7, ''))) / length(cu7);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "khởi điểm (bản khoá)" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu7, mo7);
  execute d;
end $do$;

-- ── 2. _mtt_dang_nhom: dạng của buổi thuộc tuần (s) ──
do $do$
declare d text; c int;
  cu0 text := replace($a$    select nullif(e->>'id', '')::uuid as id, (e->>'lop_id')::uuid as lop_id, (e->>'ngay')::date as ngay, (e->>'w')::boolean as w
      from jsonb_array_elements(coalesce(p_buoi, '[]'::jsonb)) e
     where (e->>'s')::boolean or (e->>'w')::boolean$a$, E'\r', '');
  mo0 text := replace($a$    select nullif(e->>'id', '')::uuid as id, (e->>'lop_id')::uuid as lop_id, (e->>'ngay')::date as ngay, (e->>'s')::boolean as s
      from jsonb_array_elements(coalesce(p_buoi, '[]'::jsonb)) e
     where (e->>'s')::boolean   /* 17/11 tối: buổi thuộc tuần = buổi kế rơi vào tuần (lùi một buổi) */$a$, E'\r', '');
  cu1 text := replace($a$as x(o) where b.w   /* 17/11: dạng của buổi trong tuần */$a$, E'\r', '');
  mo1 text := replace($a$as x(o)   /* 17/11 tối: dạng của buổi thuộc tuần (s) */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_dang_nhom(uuid,text,jsonb,timestamptz,boolean)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu0, ''))) / length(cu0);
  if c <> 1 then raise exception '_mtt_dang_nhom đã đổi: đoạn "buổi thuộc tuần" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu0, mo0);
  c := (length(d) - length(replace(d, cu1, ''))) / length(cu1);
  if c <> 1 then raise exception '_mtt_dang_nhom đã đổi: đoạn "lọc dạng" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu1, mo1);
  execute d;
end $do$;

-- ── 3. _mtt_dau_tinh: ảnh đầu tuần giữ tới 10 lần ──
do $do$
declare d text; c int;
  cu0 text := replace($a$jsonb_agg(jsonb_build_array(extract(epoch from t)::bigint, round(v, 4)) order by rn) filter (where rn <= cs) as lan$a$, E'\r', '');
  mo0 text := replace($a$jsonb_agg(jsonb_build_array(extract(epoch from t)::bigint, round(v, 4)) order by rn) filter (where rn <= 10) as lan   /* 17/11 tối: giữ tới 10 lần để tính khởi điểm TRƯỚC buổi */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_dau_tinh(uuid,date)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu0, ''))) / length(cu0);
  if c <> 1 then raise exception '_mtt_dau_tinh đã đổi: đoạn "lần trong ảnh" khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu0, mo0);
  execute d;
end $do$;

-- ── 4. Quyền (áp ở SQL Editor ⇒ hàm mới thuộc postgres): trả chủ về claude_build như mọi hàm _mtt_* ──
alter function public._mtt_dau_buoi(jsonb, jsonb) owner to claude_build;
revoke execute on function public._mtt_dau_buoi(jsonb, jsonb) from public, anon, authenticated;
