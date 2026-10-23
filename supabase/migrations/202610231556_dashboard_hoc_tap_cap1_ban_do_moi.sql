-- ============================================================================
-- 202610231556 — dashboard_hoc_tap_cap1_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10: "Dashboard tính cấp 1 theo bản đồ mới luôn, mastery cấp 1 giữ cũ." _do_o_bdm cố ý trả bản đồ CŨ cho K3–5T
--   (quyết định mastery) ⇒ Dashboard học tập khối 3/4/5 không có cột nào. Tách thân _do_o_bdm thành _do_o_bdm_core(…, p_cap1_cu):
--   _do_o_bdm = core(…, true) — mastery + mọi chỗ đang gọi KHÔNG đổi; _dbht_cau gọi core(…, false). Một công thức quy câu → ô.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: _do_o_bdm giữ chữ ký + kết quả; _dbht_cau thay thân (chỉ thêm ô cấp 1).
-- ============================================================================

create or replace function _do_o_bdm_core(p_ma_cau text, p_ma_dang_chep text, p_cap1_cu boolean) returns text
language plpgsql stable security definer set search_path to 'public' as $function$
declare r record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select b.khoi, d.dang_bai_id into r
      from dai_cau_hoi c
      left join dai_ban_do b on b.ma_dang = c.dang_chinh
      left join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if p_cap1_cu and r.khoi in ('3', '4', '4T', '5', '5T') then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      return r.dang_bai_id;
    end if;
    select d.dang_bai_id into r
      from hgt_cau_hoi h left join bdm_cau_dang d on d.kho = 'hgt' and d.ma_cau = h.ma_cau
     where h.ma_cau = p_ma_cau;
    if found then return r.dang_bai_id; end if;
  end if;
  -- lượt đo không có mã câu, hoặc câu không (còn) ở kho Đại/HGT: theo mã dạng chép lúc đo — quy về dạng cũ CÒN SỐNG trước.
  v := _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep);
  select b.khoi into v_khoi from dai_ban_do b where b.ma_dang = v;
  if v_khoi is null or (p_cap1_cu and v_khoi in ('3', '4', '4T', '5', '5T')) then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $function$;

create or replace function _do_o_bdm(p_ma_cau text, p_ma_dang_chep text) returns text
language sql stable security definer set search_path to 'public' as $$
  select public._do_o_bdm_core(p_ma_cau, p_ma_dang_chep, true)
$$;

create or replace function _dbht_cau(p_hs uuid[], p_tu date, p_mon text)
returns table(hoc_sinh_id uuid, ngay date, t timestamptz, kenh text, luot text, thu_tu integer, ma_cau text,
              gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text)
language sql stable set search_path to 'public' as $$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)   -- bản sao câu app: ngày = ngày nộp (có thể sau buổi) ⇒ lọc đúng ở dưới
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  cap as (
    select d.kc, d.kd, public._do_o_bdm_core(nullif(d.kc, ''), nullif(d.kd, ''), false) as o
      from (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd from m
             where ma_cau is not null or ma_dang is not null) d
     where not public._btyeu_la_hinh_mh(nullif(d.kd, ''))
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri, db.id, n.id, n.chuyen_de_id
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '')
    join dai_bdm_dang_bai db on db.id = cap.o
    join dai_bdm_nhom n on n.id = db.nhom_id
   where p_tu is null or m.ngay >= p_tu
$$;
