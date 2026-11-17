set local lock_timeout = '3s';
-- ============================================================================
-- 202611171937 — mtt_phan2_dong_bo_bo_tro  (Thùy 17/11 tối: "cần nút để đồng bộ — khi chốt bổ trợ tuần có thay đổi thì cái này cần đồng bộ, tự động hoặc manual đều được")
-- ----------------------------------------------------------------------------
-- CHẠY SAU mig 202611171800 (vá trên thân đã có 1800; thiếu 1800 ⇒ raise, không ghi gì).
-- VÌ SAO: Công bố khoá CẢ tờ (mtt_ke_hoach) ⇒ trưởng khối chốt / sửa bổ trợ sau khi công bố thì Phần 2 + ca bổ trợ không đổi theo (chỉ hiện
--   "thêm sau khi công bố"). Chọn TỰ ĐỘNG: chỉ Phần 1 (bài trên lớp) bị khoá; Phần 2 (nợ) + việc ca bổ trợ LUÔN đọc lượt chốt bổ trợ mới nhất.
--   Không xoá / mở khoá gì (Luật xoá): bản khoá giữ nguyên, hàm chỉ thôi đọc phần Phần 2 trong bản khoá.
-- GỒM: _mtt_tinh — bản khoá chỉ cấp Phần 1; Phần 2 lấy từ tính sống; nhóm "thêm sau khi công bố" chỉ xét Phần 1; việc sau_gio / bo_tro không bao giờ
--   gắn "thêm sau". _mtt_lam_moi — em có đề xuất bổ trợ duyệt SAU lần tính tờ gần nhất ⇒ tính lại ngay lượt điều phối kế (≤ 5 phút) thay vì chờ mốc 20 phút.
-- MẤT GÌ: không xoá dữ liệu. Chi phí thêm: 1 exists / em trên bo_tro_de_xuat (bảng nhỏ) trong lượt điều phối.
-- ============================================================================

-- ── 1. _mtt_tinh ──
do $do$
declare d text; c int;
  cu0 text := replace($a$     where not exists (select 1 from jsonb_array_elements(v_kh.nhom) x where x->>'ma' = e->>'ma');$a$, E'\r', '');
  mo0 text := replace($a$     where (e->>'phan')::int = 1   /* 17/11 tối: chỉ Phần 1 bị khoá — Phần 2 luôn theo lượt chốt bổ trợ mới nhất */
       and not exists (select 1 from jsonb_array_elements(v_kh.nhom) x where x->>'ma' = e->>'ma' and (x->>'phan')::int = 1);$a$, E'\r', '');
  cu1 text := replace($a$        from jsonb_array_elements(v_kh.nhom) with ordinality as x(e, o)
    ),$a$, E'\r', '');
  mo1 text := replace($a$        from jsonb_array_elements(v_kh.nhom) with ordinality as x(e, o)
       where (x.e->>'phan')::int = 1   /* 17/11 tối: bản khoá chỉ giữ Phần 1; nhóm nay là nợ (Phần 2 sống) thì nhường cho Phần 2 */
         and not exists (select 1 from jsonb_array_elements(v_nhom) l where (l->>'phan')::int = 2 and l->>'ma' = x.e->>'ma')
    ),$a$, E'\r', '');
  cu2 text := replace($a$           order by y.o), '[]'::jsonb)
      into v_nhom
      from y;$a$, E'\r', '');
  mo2 text := replace($a$           order by y.o), '[]'::jsonb)
           || coalesce((select jsonb_agg(l order by l->>'ten') from jsonb_array_elements(v_nhom) l where (l->>'phan')::int = 2), '[]'::jsonb)   /* 17/11 tối: Phần 2 LUÔN SỐNG */
      into v_nhom
      from y;$a$, E'\r', '');
  cu3 text := replace($a$    select coalesce(jsonb_agg(e || jsonb_build_object('them_sau', not exists ($a$, E'\r', '');
  mo3 text := replace($a$    select coalesce(jsonb_agg(e || jsonb_build_object('them_sau', e->>'loai' not in ('sau_gio', 'bo_tro') and not exists (   /* 17/11 tối: ca bổ trợ luôn sống */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_tinh(uuid,text,date,timestamptz)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu0, ''))) / length(cu0);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "nhóm thêm sau công bố" khớp % chỗ, cần đúng 1 (mig 202611171800 đã áp chưa?)', c; end if;
  d := replace(d, cu0, mo0);
  c := (length(d) - length(replace(d, cu1, ''))) / length(cu1);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "Phần 1 lấy từ bản khoá" khớp % chỗ, cần đúng 1 (mig 202611171800 đã áp chưa?)', c; end if;
  d := replace(d, cu1, mo1);
  c := (length(d) - length(replace(d, cu2, ''))) / length(cu2);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "ghép Phần 2 sống" khớp % chỗ, cần đúng 1 (mig 202611171800 đã áp chưa?)', c; end if;
  d := replace(d, cu2, mo2);
  c := (length(d) - length(replace(d, cu3, ''))) / length(cu3);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn "việc bổ trợ không gắn thêm sau" khớp % chỗ, cần đúng 1 (mig 202611171800 đã áp chưa?)', c; end if;
  d := replace(d, cu3, mo3);
  execute d;
end $do$;

-- ── 2. _mtt_lam_moi ──
do $do$
declare d text; c int;
  cu0 text := replace($a$   where m.hoc_sinh_id is null or m.tinh_at < now() - interval '20 minutes' or m.tinh_at < t.tinh_at$a$, E'\r', '');
  mo0 text := replace($a$   where m.hoc_sinh_id is null or m.tinh_at < now() - interval '20 minutes' or m.tinh_at < t.tinh_at
      or exists (select 1 from bo_tro_de_xuat d where d.hoc_sinh_id = x.hoc_sinh_id and d.mon = x.mon and d.duyet_at > m.tinh_at)   /* 17/11 tối: lượt chốt bổ trợ mới ⇒ tính lại ngay lượt kế */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_lam_moi(integer)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu0, ''))) / length(cu0);
  if c <> 1 then raise exception '_mtt_lam_moi đã đổi: đoạn "tính lại khi có lượt chốt bổ trợ mới" khớp % chỗ, cần đúng 1 (mig 202611171800 đã áp chưa?)', c; end if;
  d := replace(d, cu0, mo0);
  execute d;
end $do$;
