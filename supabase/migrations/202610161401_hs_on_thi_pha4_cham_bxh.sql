-- ============================================================================
-- 202610161401 — hs_on_thi_pha4_cham_bxh
-- ----------------------------------------------------------------------------
-- VÌ SAO: Pha 4 Ôn thi GK1. Tự luận Thi thử cần người chấm (TA/GV, từ ảnh HS nộp) và BXH theo đề chỉ tính bài đã chấm xong.
-- MẤT GÌ: không xoá gì. Chỉ create or replace + 1 vá biểu thức trong fn_hs_thi_thu_diem (diem_10 gọi hàm chung, kết quả y hệt).
-- ============================================================================
-- Ôn thi giữa kì I — PHA 4: CHẤM tự luận Thi thử (TA/GV từ ảnh) + BXH theo đề (spec-on-thi-gk1.md, Thùy 16/10).
-- Quyết định Thùy: tự luận do TA/GV chấm từ ảnh · điểm tổng + xếp hạng CHỈ có sau khi chấm xong mọi câu tự luận · quà để bàn sau (KHÔNG làm quà/EXP/xu).
-- §1.5: "chưa chấm" = câu tu_luan CHƯA có dòng bai_lam_cau (không trạng thái cho_cham, không bảng tasks) ⇒ hàng đợi là DERIVE.
-- Hàm của nhân sự dùng security definer + cổng la_thanh_vien() ở đầu hàm (đọc chéo bai_lam/bai_test_cau/hoc_sinh/thi_thu_anh của HS khác;
-- không soi được RLS từng bảng khi viết ở cloud — cổng nằm trong hàm, giống fn_btyeu_ta_sua_ket_qua). Revoke anon tường minh (CLAUDE §2.1).

-- ── 1) CÔNG THỨC ĐIỂM — 1 nơi duy nhất (hàm NỘI BỘ: invoker, KHÔNG grant cho ai — chỉ các hàm definer bên dưới gọi, tránh HS hỏi điểm bài người khác). Tổng diem bai_lam_cau / tổng diem bai_test_cau × 10; còn tự luận chưa chấm ⇒ diem_10 = null. ──
create or replace function public._thi_thu_tinh_diem(p_bai_lam uuid)
returns table (toi_da numeric, tong numeric, cho integer, diem_10 numeric)
language sql stable set search_path to 'public' as $$
  with t as (
    select coalesce(sum(bc.diem), 0) toi_da,
           coalesce(sum(blc.diem), 0) tong,
           (count(*) filter (where bc.loai_cau = 'tu_luan' and blc.id is null))::int cho
    from bai_lam bl
    join bai_test_cau bc on bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the
    left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = bl.id
    where bl.id = p_bai_lam)
  select t.toi_da, t.tong, t.cho,
         case when t.cho = 0 and t.toi_da > 0 then round(t.tong / t.toi_da * 10, 2) end
  from t
$$;

-- fn_hs_thi_thu_diem (pha 3) đang tự tính diem_10 — thay đúng biểu thức đó bằng lời gọi hàm chung (vá thân đang chạy, không chép lại).
do $$
declare f record; def text; moi text;
begin
  for f in select p.oid from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = 'fn_hs_thi_thu_diem' loop
    def := pg_get_functiondef(f.oid);
    if def like '%_thi_thu_tinh_diem%' then continue; end if;
    moi := regexp_replace(def,
      'round\(\(select tong from tk\) / \(select sum\(diem\) from cau\) \* 10, 2\)',
      '(select d.diem_10 from public._thi_thu_tinh_diem((select id from bl)) d)', 'g');
    if moi = def then raise exception 'Không tìm thấy biểu thức diem_10 để vá trong fn_hs_thi_thu_diem'; end if;
    execute moi;
  end loop;
end $$;

-- ── 2) HÀNG ĐỢI CHẤM (derive): bài thi_thu đã nộp có ≥1 câu tự luận chưa có dòng bai_lam_cau; nộp sớm nhất lên trước. ──
create or replace function public.fn_thi_thu_cho_cham()
returns table (bai_lam_id uuid, hoc_sinh_id uuid, ma_hs text, ho_ten text, de_id uuid, de_ten text, mon text, khoi text,
               so_cau_cho integer, so_cau_tu_luan integer, nop_at timestamptz)
language plpgsql stable security definer set search_path to 'public' as $$
#variable_conflict use_column
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự xem được hàng đợi chấm.'; end if;
  return query
  select bl.id, bl.hoc_sinh_id, h.ma_hs, h.ho_ten, bt.nguon_tai_lieu_id, t.ten, bt.mon, t.khoi,
         (select count(*)::int from bai_test_cau bc
           where bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the and bc.loai_cau = 'tu_luan'
             and not exists (select 1 from bai_lam_cau blc where blc.bai_lam_id = bl.id and blc.bai_test_cau_id = bc.id)),
         (select count(*)::int from bai_test_cau bc
           where bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the and bc.loai_cau = 'tu_luan'),
         bl.nop_at
  from bai_lam bl
  join bai_test bt on bt.id = bl.bai_test_id and bt.loai = 'thi_thu'
  join hoc_sinh h on h.id = bl.hoc_sinh_id
  left join tai_lieu t on t.id = bt.nguon_tai_lieu_id
  where bl.trang_thai = 'da_nop' and public._hs_hien(bl.hoc_sinh_id)
    and exists (select 1 from bai_test_cau bc
                 where bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the and bc.loai_cau = 'tu_luan'
                   and not exists (select 1 from bai_lam_cau blc where blc.bai_lam_id = bl.id and blc.bai_test_cau_id = bc.id))
  order by bl.nop_at asc nulls last, bl.id
  limit 500;
end $$;

-- ── 3) CÁC CÂU TỰ LUẬN CỦA 1 BÀI: đề + lời giải mẫu + điểm tối đa + ảnh HS nộp theo câu (+ điểm/nhận xét nếu đã chấm, để chấm lại). ──
-- Nhận xét lưu ở bai_lam_cau_sua_log.ly_do (mỗi lần chấm 1 dòng log: ai, lúc nào, cũ→mới) — bai_lam_cau không có cột nhận xét.
create or replace function public.fn_thi_thu_cau_cho_cham(p_bai_lam uuid)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự xem được bài chờ chấm.'; end if;
  select jsonb_build_object(
    'bai_lam_id', bl.id, 'hoc_sinh_id', h.id, 'ma_hs', h.ma_hs, 'ho_ten', h.ho_ten,
    'de_ten', t.ten, 'mon', bt.mon, 'khoi', t.khoi, 'nop_at', bl.nop_at,
    'cho', (select d.cho from public._thi_thu_tinh_diem(bl.id) d),
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'bai_test_cau_id', bc.id, 'thu_tu', bc.thu_tu, 'phan', bc.phan,
        'noi_dung', bc.noi_dung, 'anh_de', bc.anh_de,
        'dap_an', bc.dap_an_key, 'loi_giai', bc.loi_giai, 'anh_dap_an', bc.anh_dap_an,
        'diem_toi_da', bc.diem,
        'da_cham', blc.id is not null, 'diem', blc.diem,
        'nhan_xet', (select s.ly_do from bai_lam_cau_sua_log s where s.bai_lam_cau_id = blc.id order by s.created_at desc limit 1),
        'anh', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'path', a.path, 'thu_tu', a.thu_tu) order by a.thu_tu, a.created_at)
                           from thi_thu_anh a where a.bai_lam_id = bl.id and a.bai_test_cau_id = bc.id), '[]'::jsonb)
      ) order by bc.thu_tu)
      from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = bl.id
      where bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the and bc.loai_cau = 'tu_luan'), '[]'::jsonb))
    into v
  from bai_lam bl
  join bai_test bt on bt.id = bl.bai_test_id and bt.loai = 'thi_thu'
  join hoc_sinh h on h.id = bl.hoc_sinh_id
  left join tai_lieu t on t.id = bt.nguon_tai_lieu_id
  where bl.id = p_bai_lam and bl.trang_thai = 'da_nop';
  return v;   -- null = không phải bài thi thử đã nộp
end $$;

-- ── 4) CHẤM 1 CÂU TỰ LUẬN — transactional, idempotent (chấm lại = ghi đè điểm, có dòng log). ──
create or replace function public.fn_thi_thu_cham_tu_luan(p_bai_lam uuid, p_bai_test_cau uuid, p_diem numeric, p_nhan_xet text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  c record; v_cu record; v_blc uuid; v_verdict text; d record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự chấm được bài thi.'; end if;
  if p_diem is null or p_diem < 0 then raise exception 'Điểm phải từ 0 trở lên.'; end if;
  if p_diem * 4 <> round(p_diem * 4) then raise exception 'Điểm chia theo bước 0,25.'; end if;

  select bl.id bl_id, bl.trang_thai, bt.loai bt_loai, bc.id bc_id, bc.loai_cau, bc.diem diem_toi_da
    into c
  from bai_lam bl
  join bai_test bt on bt.id = bl.bai_test_id
  join bai_test_cau bc on bc.id = p_bai_test_cau and bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the
  where bl.id = p_bai_lam
  for update of bl;
  if c.bl_id is null then raise exception 'Câu này không thuộc bài làm.'; end if;
  if c.bt_loai <> 'thi_thu' then raise exception 'Chỉ chấm bài Thi thử.'; end if;
  if c.trang_thai <> 'da_nop' then raise exception 'Em chưa nộp bài.'; end if;
  if c.loai_cau <> 'tu_luan' then raise exception 'Chỉ chấm tay câu tự luận (các câu khác máy chấm).'; end if;
  if p_diem > c.diem_toi_da then raise exception 'Điểm tối đa của câu này là %.', c.diem_toi_da; end if;

  v_verdict := case when p_diem >= c.diem_toi_da then 'correct' when p_diem > 0 then 'partial' else 'wrong' end;
  select id, verdict, diem, cham_boi into v_cu from bai_lam_cau where bai_lam_id = p_bai_lam and bai_test_cau_id = p_bai_test_cau;

  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, verdict, diem, cham_boi)
  values (p_bai_lam, p_bai_test_cau, v_verdict, p_diem, 'manual')
  on conflict (bai_lam_id, bai_test_cau_id) do update
    set verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual', cham_at = now()
  returning id into v_blc;

  insert into bai_lam_cau_sua_log (bai_lam_cau_id, verdict_cu, verdict_moi, diem_cu, diem_moi, cham_boi_cu, nhan_su_id, nguoi, ly_do)
  values (v_blc, v_cu.verdict, v_verdict, v_cu.diem, p_diem, v_cu.cham_boi, public.current_nhan_su_id(), public.jwt_uid(),
          nullif(trim(coalesce(p_nhan_xet, '')), ''));

  select * into d from public._thi_thu_tinh_diem(p_bai_lam);
  return jsonb_build_object('bai_test_cau_id', p_bai_test_cau, 'verdict', v_verdict, 'diem', p_diem,
                            'cho', d.cho, 'xong', d.cho = 0, 'diem_10', d.diem_10);
end $$;

-- ── 5) BXH THEO ĐỀ (cho HS). Chỉ gồm bài thi_thu ĐÃ NỘP + ĐÃ CHẤM XONG của CÙNG đề; em chỉ xem khi bài của CHÍNH em đã chấm xong
-- (cùng luật "điểm + hạng chỉ có sau khi chấm xong"). Hoà điểm ⇒ nộp sớm hơn hạng trên. Tên hiển thị theo quy ước BXH hiện có
-- (fn_hs_xep_hang_ti_le_dat: ma_hs + ho_ten + la_toi; em test chỉ thấy em test — _hs_hien). ──
create or replace function public.fn_hs_thi_thu_bxh(p_de uuid, p_top integer default 20)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_top int := least(greatest(coalesce(p_top, 20), 1), 100);
  v_co_bai boolean; v_xong boolean; v_ket jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi, t.ten into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') <> 'de_cuong';
  if tl.id is null or public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then return null; end if;

  select true, (select d.cho = 0 from public._thi_thu_tinh_diem(bl.id) d) into v_co_bai, v_xong
    from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id
   where bt.nguon_tai_lieu_id = p_de and bt.loai = 'thi_thu' and bl.hoc_sinh_id = v_hs and bl.trang_thai = 'da_nop' limit 1;
  if not coalesce(v_co_bai, false) then return null; end if;
  if not coalesce(v_xong, false) then
    return jsonb_build_object('de_id', p_de, 'de_ten', tl.ten, 'dang_cham', true);   -- chưa lộ gì
  end if;

  with xep as (
    select bl.hoc_sinh_id, h.ma_hs, h.ho_ten, d.diem_10, bl.nop_at,
           row_number() over (order by d.diem_10 desc, bl.nop_at asc, bl.id) hang
    from bai_lam bl
    join bai_test bt on bt.id = bl.bai_test_id and bt.loai = 'thi_thu' and bt.nguon_tai_lieu_id = p_de
    join hoc_sinh h on h.id = bl.hoc_sinh_id
    cross join lateral public._thi_thu_tinh_diem(bl.id) d
    where bl.trang_thai = 'da_nop' and d.cho = 0 and d.diem_10 is not null and public._hs_hien(bl.hoc_sinh_id))
  select jsonb_build_object(
    'de_id', p_de, 'de_ten', tl.ten, 'dang_cham', false,
    'tong', (select count(*) from xep),
    'toi', (select jsonb_build_object('hang', x.hang, 'diem_10', x.diem_10) from xep x where x.hoc_sinh_id = v_hs),
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', x.hang, 'ma_hs', x.ma_hs, 'ho_ten', x.ho_ten,
                                                         'diem_10', x.diem_10, 'la_toi', x.hoc_sinh_id = v_hs) order by x.hang)
                       from xep x where x.hang <= v_top), '[]'::jsonb))
    into v_ket;
  return v_ket;
end $$;

revoke execute on function public._thi_thu_tinh_diem(uuid) from public, anon, authenticated;
revoke execute on function public.fn_thi_thu_cho_cham(), public.fn_thi_thu_cau_cho_cham(uuid),
  public.fn_thi_thu_cham_tu_luan(uuid, uuid, numeric, text), public.fn_hs_thi_thu_bxh(uuid, integer) from public, anon;
grant execute on function public.fn_thi_thu_cho_cham(), public.fn_thi_thu_cau_cho_cham(uuid),
  public.fn_thi_thu_cham_tu_luan(uuid, uuid, numeric, text), public.fn_hs_thi_thu_bxh(uuid, integer) to authenticated;
