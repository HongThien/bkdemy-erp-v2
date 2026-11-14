-- ============================================================================
-- 202611141211 — nt_ban_vuon_do_nha_san
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   14/11 Thùy cho em tự trang trí: món của nhà (state.giaoDien.doNha[kiểu nhà] = mảng id món) + đồ trong sân
--   (state.giaoDien.san = mảng id). fn_nt_ban_vuon chỉ trả giaoDien.nha + .nen ⇒ bạn sang thăm thấy nhà / sân MẶC ĐỊNH,
--   không thấy món bạn đã chọn. Cho qua thêm 2 khoá đó, lọc như nha / nen: chỉ id đúng mẫu tên (chữ cái, _, ≤ 24 ký tự),
--   tối đa 40 món mỗi mảng, doNha chỉ lấy mảng của kiểu nhà đang dùng. Id lạ game tự bỏ (doiNha lọc theo KIEU_NHA,
--   doiSan chỉ dựng món có trong SAN_DO). Bạn chưa chọn bao giờ ⇒ null ⇒ game dùng bộ mặc định. Phần còn lại y hệt 202611032033.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: create or replace, cùng chữ ký, cùng quyền (authenticated; hàm do claude_build sở hữu, anon không có quyền).
-- ============================================================================
create or replace function public._nt_ds_id_sach(p jsonb) returns jsonb
language sql immutable set search_path = public as $$
  select case when jsonb_typeof(p) = 'array' then
    coalesce((select jsonb_agg(x order by i) from jsonb_array_elements_text(p) with ordinality t(x, i) where i <= 40 and x ~ '^[A-Za-z_]{1,24}$'), '[]'::jsonb) end
$$;

create or replace function public.fn_nt_ban_vuon(p_ban uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); st jsonb; v_nha text; v_do jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if not public._nt_cung_lop(v_me, p_ban) then return jsonb_build_object('ok', false, 'loi', 'khong_cung_lop'); end if;
  select state into st from nt_luu where hoc_sinh_id = p_ban;
  if st is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_vuon'); end if;
  v_nha := case when st->'giaoDien'->>'nha' ~ '^[a-z_]{1,16}$' then st->'giaoDien'->>'nha' end;
  v_do := case when v_nha is not null then public._nt_ds_id_sach(st->'giaoDien'->'doNha'->v_nha) end;
  return jsonb_build_object('ok', true, 'id', p_ban, 'ten', public._nt_ten_ban(p_ban), 'cap', coalesce((st->>'cap')::int, 1),
    'hat', st->>'hat', 'ngay0', coalesce((st->>'ngay0')::int, dn), 'oMo', coalesce((st->>'oMo')::int, 4), 'ngay', dn,
    'ruong', public._nt_vuon_ruong(p_ban, st, v_me),
    'vat', jsonb_build_object('ga', jsonb_build_object('con', coalesce(st->'vat'->'ga'->'con', '[]'::jsonb)), 'bo', jsonb_build_object('con', coalesce(st->'vat'->'bo'->'con', '[]'::jsonb))),
    'trangTri', coalesce(st->'trangTri', '[]'::jsonb),
    'thu', jsonb_build_object('cho', jsonb_build_object('tc', coalesce((st->'thu'->'cho'->>'tc')::int, 0), 'd', -1, 'mua', coalesce((st->'thu'->'cho'->>'mua')::boolean, false)),
                              'meo', jsonb_build_object('tc', 0, 'd', -1), 'chim', jsonb_build_object('tc', 0, 'd', -1)),
    'giaoDien', jsonb_build_object(
      'nha', v_nha,
      'nen', case when st->'giaoDien'->>'nen' ~ '^[a-z_]{1,16}$' then st->'giaoDien'->>'nen' end,
      'doNha', case when v_do is not null then jsonb_build_object(v_nha, v_do) end,
      'san', public._nt_ds_id_sach(st->'giaoDien'->'san')))
    || public._nt_luot_con(v_me, dn);
end $$;
