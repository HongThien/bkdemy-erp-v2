-- ============================================================================
-- 202611031927 — nt_ban_vuon_giao_dien
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   03/11 em được tự chọn kiểu nhà + khung cảnh (game lưu trong bản lưu: state.giaoDien = {nha, nen}).
--   Thùy: "sang thăm bạn thì phải hiện vườn nhà bạn" ⇒ bản chụp vườn bạn phải mang theo lựa chọn của BẠN.
--   Chỉ trả 2 khoá trong danh sách trắng (giá trị lạ ⇒ null, game hiểu là mặc định) — không đẩy jsonb tuỳ ý của
--   người khác sang máy em. Phần còn lại giữ NGUYÊN bản 202610131557 (đã đối chiếu prosrc trên DB 03/11).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: create or replace, cùng chữ ký, cùng quyền.
-- ============================================================================
create or replace function public.fn_nt_ban_vuon(p_ban uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); st jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if not public._nt_cung_lop(v_me, p_ban) then return jsonb_build_object('ok', false, 'loi', 'khong_cung_lop'); end if;
  select state into st from nt_luu where hoc_sinh_id = p_ban;
  if st is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_vuon'); end if;
  return jsonb_build_object('ok', true, 'id', p_ban, 'ten', public._nt_ten_ban(p_ban), 'cap', coalesce((st->>'cap')::int, 1),
    'hat', st->>'hat', 'ngay0', coalesce((st->>'ngay0')::int, dn), 'oMo', coalesce((st->>'oMo')::int, 4), 'ngay', dn,
    'ruong', public._nt_vuon_ruong(p_ban, st, v_me),
    'vat', jsonb_build_object('ga', jsonb_build_object('con', coalesce(st->'vat'->'ga'->'con', '[]'::jsonb)), 'bo', jsonb_build_object('con', coalesce(st->'vat'->'bo'->'con', '[]'::jsonb))),
    'trangTri', coalesce(st->'trangTri', '[]'::jsonb),
    'thu', jsonb_build_object('cho', jsonb_build_object('tc', coalesce((st->'thu'->'cho'->>'tc')::int, 0), 'd', -1, 'mua', coalesce((st->'thu'->'cho'->>'mua')::boolean, false)),
                              'meo', jsonb_build_object('tc', 0, 'd', -1), 'chim', jsonb_build_object('tc', 0, 'd', -1)),
    'giaoDien', jsonb_build_object(
      'nha', case when st->'giaoDien'->>'nha' in ('go', 'viet', 'nhat', 'hylap') then st->'giaoDien'->>'nha' end,
      'nen', case when st->'giaoDien'->>'nen' in ('thuong', 'tuyet', 'dem') then st->'giaoDien'->>'nen' end))
    || public._nt_luot_con(v_me, dn);
end $$;
