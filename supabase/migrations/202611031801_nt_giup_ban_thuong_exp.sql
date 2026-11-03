-- ============================================================================
-- NÔNG TRẠI — GIÚP BẠN CÓ THƯỞNG EXP (Thùy 03/11: "giúp bạn có thưởng nhé: thưởng bằng exp, m tự cân đối")
-- Số thưởng nằm ở _nt_luat().expGiup (1 nguồn), fn_nt_ban_giup trả kèm 'exp' ⇒ game cộng đúng số server nói, không tự đặt.
-- Cân đối: tưới hộ 1 ô lúa mì 1 ngày tạo thêm cho bạn ≈ 0,8 × 7 quả × 2 EXP ≈ 11 EXP ⇒ người giúp nhận ~1/3 = 4 EXP/lượt.
--   Trần 5 lượt/ngày ⇒ tối đa 20 EXP/ngày (≈ 1 ô ruộng của mình tưới đủ) — đáng để sang vườn bạn, không lấn việc chăm vườn mình.
--   EXP đổi ra xu vẫn đi qua trần 20 xu/tháng của fn_nt_xu_dong_bo ⇒ không mở thêm vòi xu.
-- ============================================================================

create or replace function public._nt_luat() returns jsonb
language sql immutable as $$
  select '{"tuoiThem":0.8,"bonThem":0.25,"sauTiLe":0.25,"sauTru":0.2,"tromToiDa":0.2,"tromMoiLan":1,"trom":3,"giup":5,"choDuoi":[0,0.2,0.4,0.6],"tcMoc":[20,50,100],"mua0Ngay":60,"mua0Bonus":[0,0],"expGiup":4}'::jsonb
$$;

create or replace function public.fn_nt_ban_giup(p_ban uuid, p_o integer)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare v_me uuid := public.my_hoc_sinh_id(); dn integer := public._nt_hom_nay(); st jsonb; r jsonb; tt jsonb; luot jsonb; v_loai text;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if not public._nt_cung_lop(v_me, p_ban) then return jsonb_build_object('ok', false, 'loi', 'khong_cung_lop'); end if;
  perform pg_advisory_xact_lock(hashtext('ntban:' || p_ban::text));
  select state into st from nt_luu where hoc_sinh_id = p_ban;
  if st is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_vuon'); end if;
  if p_o is null or p_o < 0 or p_o >= coalesce((st->>'oMo')::int, 0) then return jsonb_build_object('ok', false, 'loi', 'o_khong_hop_le'); end if;
  luot := public._nt_luot_con(v_me, dn);
  if (luot->>'con_giup')::int < 1 then return jsonb_build_object('ok', false, 'loi', 'het_luot') || luot; end if;
  r := public._nt_o_hieu_luc(p_ban, p_o, st->'ruong'->p_o, st->>'hat');
  if r->>'cay' is null then return jsonb_build_object('ok', false, 'loi', 'khong_can') || luot; end if;
  tt := public._nt_o_tt(r, (st->>'hat') || '|o' || p_o, dn, public._nt_bonus_mua(coalesce((st->>'ngay0')::int, dn), (r->>'d0')::int));
  if tt->>'tt' = 'lon' and not (tt->>'tuoiHom')::boolean then v_loai := 'tuoi';
  elsif (tt->>'sau')::int > 0 and tt->>'tt' in ('lon', 'chin') then v_loai := 'bat_sau';
  else return jsonb_build_object('ok', false, 'loi', 'khong_can') || luot; end if;
  insert into nt_ban_viec (chu, nguoi, o, d0, ngay, loai) values (p_ban, v_me, p_o, (r->>'d0')::int, dn, v_loai);
  return jsonb_build_object('ok', true, 'loai', v_loai, 'cay', r->>'cay', 'exp', (public._nt_luat()->>'expGiup')::int) || public._nt_luot_con(v_me, dn);
end $function$;
