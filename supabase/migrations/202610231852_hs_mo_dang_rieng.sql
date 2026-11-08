-- ============================================================================
-- hs_mo_dang_rieng — MỞ RIÊNG DẠNG CHO 1 EM dù lớp chưa học (Thùy 23/10)
-- ----------------------------------------------------------------------------
-- Thùy: "Mở giới hạn tài khoản Đào Minh Quân 4T có thể học được Chuyên đề Bài toán Tổng hiệu" — đang bị khoá do lớp chưa học.
-- TRƯỚC: _hs_dang_da_hoc chỉ mở dạng lớp đã có số đo / đã giao (mig 202610141759 → 202610231532), không có đường mở cho riêng 1 em.
-- NAY: bảng hs_mo_dang (HS × môn × dạng, bám mã gốc ma_dang) — dạng có trong bảng ⇒ coi như "đã học" với em đó.
--   Chỉ CỘNG THÊM khi danh sách đã-học không rỗng (rỗng = lớp chưa có số đo ⇒ vốn không lọc gì; thêm vào lại thành lọc).
--   Áp tự động cho mọi chỗ dùng _hs_dang_da_hoc: Học theo chủ đề · tu_luyen_chu_de_sinh · Luyện dạng yếu/Thử thách · bản đồ phiêu lưu · ôn thi.
-- MẤT GÌ: không xoá gì. Thêm 1 bảng; thân _hs_dang_da_hoc giữ nguyên bản live, chỉ thêm đoạn cộng dạng mở riêng ở cuối.
-- ============================================================================
create table if not exists public.hs_mo_dang (
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  mon text not null,
  ma_dang text not null,
  ly_do text,
  created_at timestamptz not null default now(),
  primary key (hoc_sinh_id, mon, ma_dang)
);
alter table public.hs_mo_dang enable row level security;
revoke all on public.hs_mo_dang from anon;

CREATE OR REPLACE FUNCTION public._hs_dang_da_hoc(p_hs uuid, p_mon text)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_lop uuid; v_hs uuid[]; v_n integer; v_res text[];
begin
  v_lop := public._hs_lop_tu_luyen(p_hs, p_mon);
  if v_lop is null then return '{}'::text[]; end if;
  select coalesce(array_agg(distinct hl.hoc_sinh_id), '{}'::uuid[]) into v_hs from hoc_sinh_lop hl where hl.lop_id = v_lop and hl.trang_thai = 'dang_hoc';
  if not (p_hs = any(v_hs)) then v_hs := v_hs || p_hs; end if;
  v_n := cardinality(v_hs);
  with ev as (
    select g.hoc_sinh_id, sp.ma_cau, sp.ma_dang
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.hoc_sinh_id = any(v_hs) and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn')
    union all
    select bl.hoc_sinh_id, btc.ma_cau, btc.ma_dang
      from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = any(v_hs) and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
    union all
    select tl.hoc_sinh_id, btg.ma_cau, btg.ma_dang
      from bt_grades btg join tai_lieu tl on tl.id = btg.tai_lieu_id
     where tl.hoc_sinh_id = any(v_hs) and btg.ma_dang is not null
  ), nh as (
    select distinct e.hoc_sinh_id, e.ma_dang as goc,
           coalesce(public._do_o(nullif(coalesce(e.ma_cau, ''), ''), nullif(coalesce(e.ma_dang, ''), '')), e.ma_dang) as nhom
      from ev e
  ), qua as (
    select n.nhom from nh n where n.nhom is not null group by n.nhom
     having count(distinct n.hoc_sinh_id) >= least(2, v_n) or bool_or(n.hoc_sinh_id = p_hs)
  ), giao as (   -- dạng LỚP ĐÃ GIAO (ET/BTVN/đề thi/giáo trình của lớp), kể cả chưa chấm xong
    select distinct btc.ma_dang, btc.ma_cau from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
     where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and btc.ma_dang is not null
  )
  select coalesce(array_agg(distinct x.d), '{}'::text[]) into v_res from (
    select nhom as d from qua
    union select n.goc from nh n where n.nhom in (select nhom from qua) and n.goc is not null
    union select ma_dang from giao
    union select public._do_o_bdm(g.ma_cau, g.ma_dang) from giao g where public._mastery_bdm_bat()   -- bản đồ mới: dạng bài của câu đã giao
  ) x;
  -- MỞ RIÊNG cho em (Thùy 23/10): chỉ cộng khi đang có lọc (rỗng = không lọc, cộng vào sẽ thành lọc)
  if cardinality(v_res) > 0 then
    select array(select distinct d from unnest(v_res || coalesce((select array_agg(m.ma_dang) from hs_mo_dang m
                                                                   where m.hoc_sinh_id = p_hs and m.mon = p_mon), '{}'::text[])) d)
      into v_res;
  end if;
  return v_res;
end $function$;

insert into public.hs_mo_dang (hoc_sinh_id, mon, ma_dang, ly_do)
select '93b7bd66-afbc-4080-9bac-59cfac7d3587'::uuid, 'Toán', bd.ma_dang, 'Thùy 23/10: mở chủ đề Bài toán tổng hiệu cho Đào Minh Quân 4T1'
  from public.dai_ban_do bd
 where bd.khoi = '4T' and bd.ma_chuyen_de = 'T14T0801'
on conflict do nothing;
