-- ============================================================================
-- 202609270948 — hs_vi_xu_nhom_nguon_va_fix_exp_thang
-- ----------------------------------------------------------------------------
-- Thùy 27/09: đổi tab "Hoạt động" sang CARD theo nhóm nguồn (ET/BTVN/May mắn/
-- Điểm tham dự/Thầy cô tặng/Bị trừ/Chốt xu/Hoạt động trên lớp...), bấm 1 card
-- mới hiện lịch sử của nguồn đó — thay vì 1 danh sách phẳng. Việc nhóm/hiện
-- card làm ở client (UI thuần); ở DB chỉ cần đủ + đúng DỮ LIỆU NGUỒN.
--
-- ⭐ BUG phát hiện khi soát lại filter cho việc này: `fn_hs_vi_xu_cua_toi`
-- (202609231557) copy điều kiện lọc từ `fn_gami_exp_chi_tiet_thang` nhưng
-- THIẾU `source = 'exp_thang'` (EXP_NOTE_SOURCES thật ở src/lib/gami.ts:830
-- gồm CẢ 'exp_thang' — nguồn gộp cũ trước khi tách ET/BTVN riêng, "không ghi
-- nữa nhưng reader vẫn cộng" theo comment gami.ts:824). Đo thật: 284 dòng
-- exp_thang (28/07–03/09, có `note` đúng tháng) đang bị bỏ sót hoàn toàn khỏi
-- Ví xu. Nhân tiện vá thêm 3 nguồn LEGACY một-lần (`rank_et` 122 dòng,
-- `rank_ingame` 64 dòng, `btvn` (không tiền tố) 98 dòng — đều `note` NULL nên
-- lọc theo `created_at` như attend_floor, không theo `note`).
--
-- MẤT GÌ: không — CREATE OR REPLACE cùng hàm, chỉ nới điều kiện lọc (thêm
-- nguồn, không bớt), không đổi tham số/cột trả về/logic so_du hay lich_su_mua.
-- ============================================================================

create or replace function public.fn_hs_vi_xu_cua_toi(p_ym text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ym text := coalesce(p_ym, to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'));
  v_so_du integer;
  v_mua jsonb;
  v_hoat_dong jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;

  select coalesce(sum(amount), 0)::int into v_so_du
  from qlht_xu_ledger where hoc_sinh_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'ten_qua', q.ten, 'anh_url', q.anh_url, 'so_luong', d.so_luong,
    'xu_tru', d.xu_tru, 'trang_thai', d.trang_thai, 'created_at', d.created_at, 'giao_luc', d.giao_luc
  ) order by d.created_at desc), '[]'::jsonb) into v_mua
  from (
    select * from qlht_doi_qua where hoc_sinh_id = v_me order by created_at desc limit 30
  ) d
  join qlht_qua q on q.id = d.qua_id;

  with cua_so as (
    select ((v_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((v_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ),
  dong as (
    select jsonb_build_object('loai', 'exp', 'nguon', l.source, 'mon', l.mon, 'so', l.amount,
             'created_at', l.created_at, 'ngay', b.ngay, 'lop', lp.ten_lop) as x, l.created_at as t
    from gami_exp_ledger l
    cross join cua_so w
    left join buoi_hoc b on b.id = l.ref_buoi_hoc_id
    left join lop lp on lp.id = b.lop_id
    where l.hoc_sinh_id = v_me and (
      -- exp_thang = nguồn gộp cũ (trước khi tách ET/BTVN), vẫn có `note` đúng tháng — vá bug 27/09.
      (l.source in ('exp_et', 'exp_btvn', 'exp_btvn_thang', 'exp_thang') and l.note = v_ym)
      -- attend_floor + 3 nguồn legacy một-lần (rank_et/rank_ingame/btvn) đều KHÔNG có `note` → lọc theo ngày.
      or (l.source in ('attend_floor', 'rank_et', 'rank_ingame', 'btvn') and l.created_at >= w.tu and l.created_at < w.den)
    )
    union all
    select jsonb_build_object('loai', 'may_man', 'nguon', 'may_man', 'mon', m.mon, 'so', m.exp,
             'created_at', m.created_at, 'ngay', m.ngay, 'lop', null), m.created_at
    from may_man_hs_luot m
    where m.hoc_sinh_id = v_me and to_char(m.ngay, 'YYYY-MM') = v_ym
    union all
    -- CHỈ kiếm/phạt (chot_thang/chot_lai = quy đổi EXP→xu · cong_tay/tru_tay = tay) —
    -- doi_qua/hoan là giao dịch mua, đã hiện ở lich_su_mua (Thùy 23/09).
    select jsonb_build_object('loai', 'xu', 'nguon', x.loai, 'mon', x.mon, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me
      and x.loai in ('chot_thang', 'chot_lai', 'cong_tay', 'tru_tay')
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;

  return jsonb_build_object('ym', v_ym, 'so_du', v_so_du, 'lich_su_mua', v_mua, 'hoat_dong', v_hoat_dong);
end $$;

grant execute on function public.fn_hs_vi_xu_cua_toi(text) to authenticated;
revoke execute on function public.fn_hs_vi_xu_cua_toi(text) from anon;
