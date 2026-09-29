-- Thùy 29/09: "HS đi bổ trợ bù xong làm BTVN thì cần chỗ nhập để sau này còn tính toán dữ liệu" + "người dạy bù và người chấm BTVN có thể khác nhau"
-- ⇒ chốt phương án B chỉnh: DỮ LIỆU nằm ở CA BÙ (giống ET bù), NGƯỜI CHẤM = TA LỚP của em (người thu vở ở buổi thường sau).
--   · Lưới: câu BTVN của BUỔI MẸ (lưới thật cả lớp đã nhận, ô không ẩn, giữ thứ tự + ma_cau/ma_dang) chép sang ca bù, RIÊNG từng em
--     (gami_session_problems phase 'btvn', hoc_sinh_id) — cùng khuôn ET bù (ensureBuoiBuETProblems · mig 202609291250).
--   · Kết quả: gami_grades (Đ/C/S từng câu) + btvn_ket_qua (trạng thái nộp, thái độ) theo (em, ca bù) — đúng bảng BTVN đang dùng ⇒ mọi
--     phép tính theo em × dạng đọc được luôn. Không EXP (đóng BTVN cả lớp mới thưởng EXP — bù không có nút đóng chung).
--   · Việc: em CÓ MẶT ca bù + buổi mẹ có lưới BTVN ⇒ 1 việc "Chấm BTVN bù". Chủ = TA lớp (phan_cong_lop vai 'tg'); lớp chưa có TA ⇒ người
--     đứng ca bù; admin thấy hết. XONG = đã ghi trạng thái nộp (btvn_ket_qua.trang_thai_nop). Em đã được chấm BTVN ngay ở buổi mẹ
--     (có điểm/trạng thái ở đó — đo 29/09: 73 điểm kiểu này) ⇒ không đòi lại.
--   · Áp từ ca bù ngày 29/09/2026 (345 lượt có mặt cũ, 279 có BTVN — không đổ nợ cũ lên TA).
--   · Hạn = buổi thường kế tiếp của lớp theo TKB (sau ngày bù) + 1 ngày; TKB không có buổi trong 14 ngày thì ngày bù + 8.

create or replace function public._bu_btvn_tu_ngay() returns date language sql immutable as $$ select date '2026-09-29' $$;

-- Chép lưới BTVN buổi mẹ sang ca bù cho 1 em — idempotent THEO EM. Trả số ô đã có của em sau khi chép.
create or replace function public.fn_bu_btvn_seed(p_bhh uuid) returns integer
language plpgsql security definer set search_path = public as $$
declare r record; v_no integer; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hh.hoc_sinh_id, hh.buoi_hoc_id as bu, hh.bu_cho_buoi_id as me into r
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh and b.loai = 'bu';
  if r.bu is null or r.me is null then raise exception 'Không phải lượt bù.'; end if;
  perform pg_advisory_xact_lock(hashtext('bu_btvn_seed:' || r.bu));
  if not exists (select 1 from gami_session_problems where buoi_hoc_id = r.bu and phase = 'btvn' and hoc_sinh_id = r.hoc_sinh_id) then
    select coalesce(max(problem_no), 0) into v_no from gami_session_problems where buoi_hoc_id = r.bu and phase = 'btvn';
    insert into gami_session_problems (buoi_hoc_id, phase, problem_no, ma_dang, ma_cau, hoc_sinh_id)
      select r.bu, 'btvn', v_no + row_number() over (order by m.problem_no), m.ma_dang, m.ma_cau, r.hoc_sinh_id
      from gami_session_problems m where m.buoi_hoc_id = r.me and m.phase = 'btvn' and not m.hidden;
  end if;
  select count(*) into v_n from gami_session_problems where buoi_hoc_id = r.bu and phase = 'btvn' and hoc_sinh_id = r.hoc_sinh_id;
  return v_n;
end $$;
revoke all on function public.fn_bu_btvn_seed(uuid) from public;
revoke execute on function public.fn_bu_btvn_seed(uuid) from anon;
grant execute on function public.fn_bu_btvn_seed(uuid) to authenticated;

-- Việc "Chấm BTVN bù" của tôi: chưa xong (mọi ngày từ _bu_btvn_tu_ngay) + đã xong 14 ngày gần nhất.
create or replace function public.fn_bu_btvn_viec_cua_toi() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);
  select coalesce(jsonb_agg(x order by x.xong, x.han, x.ho_ten), '[]'::jsonb) into v_out from (
    select hh.id as bhh_id, b.id as buoi_bu_id, b.ngay as ngay_bu, me.id as buoi_me_id, me.ngay as ngay_me, l.id as lop_id, l.ten_lop, l.mon,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, coalesce(tb.ho_ten, gb.ho_ten) as nguoi_day_bu,
           (select count(*) from gami_session_problems m where m.buoi_hoc_id = me.id and m.phase = 'btvn' and not m.hidden) as so_cau,
           (select count(*) from gami_grades g join gami_session_problems p on p.id = g.problem_id
             where p.buoi_hoc_id = b.id and p.phase = 'btvn' and p.hoc_sinh_id = h.id and g.hoc_sinh_id = h.id) as da_cham,
           k.trang_thai_nop, k.thai_do, k.trang_thai_nop is not null as xong,
           coalesce((select min(d)::date from generate_series(b.ngay + 1, b.ngay + 14, interval '1 day') d
                     where exists (select 1 from thoi_khoa_bieu t where t.lop_id = l.id
                                     and t.thu = case extract(dow from d)::int when 0 then 8 else extract(dow from d)::int + 1 end
                                     and t.hieu_luc_tu <= d and (t.hieu_luc_den is null or t.hieu_luc_den >= d))), b.ngay + 7) + 1 as han, -- buổi thường kế tiếp theo TKB (CN=8)
           ta.ns_id = v_ns as cua_toi
    from buoi_hoc_hs hh
    join buoi_hoc b on b.id = hh.buoi_hoc_id and b.loai = 'bu' and b.trang_thai <> 'huy'
    join buoi_hoc me on me.id = hh.bu_cho_buoi_id
    join lop l on l.id = me.lop_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    left join nhan_su tb on tb.id = b.nguoi_day_tg
    left join nhan_su gb on gb.id = b.nguoi_day
    left join btvn_ket_qua k on k.hoc_sinh_id = h.id and k.buoi_hoc_id = b.id
    cross join lateral (
      select coalesce((select array_agg(pc.nhan_su_id) from phan_cong_lop pc where pc.lop_id = l.id and pc.vai_tro = 'tg'),
                      array[coalesce(b.nguoi_day_tg, b.nguoi_day)]) as ds
    ) own
    cross join lateral (select case when v_ns = any(own.ds) then v_ns else own.ds[1] end as ns_id) ta
    where hh.diem_danh = 'co_mat'
      and b.ngay >= public._bu_btvn_tu_ngay() and b.ngay <= v_today
      and (v_admin or v_ns = any(own.ds))
      and exists (select 1 from gami_session_problems m where m.buoi_hoc_id = me.id and m.phase = 'btvn' and not m.hidden)
      -- đã chấm BTVN của em ngay ở buổi mẹ ⇒ không đòi lại
      and not exists (select 1 from btvn_ket_qua km where km.hoc_sinh_id = h.id and km.buoi_hoc_id = me.id and km.trang_thai_nop is not null)
      and not exists (select 1 from gami_grades gm join gami_session_problems pm on pm.id = gm.problem_id
                      where pm.buoi_hoc_id = me.id and pm.phase = 'btvn' and gm.hoc_sinh_id = h.id)
      and (k.trang_thai_nop is null or k.updated_at >= now() - interval '14 days')
  ) x;
  return v_out;
end $$;
revoke all on function public.fn_bu_btvn_viec_cua_toi() from public;
revoke execute on function public.fn_bu_btvn_viec_cua_toi() from anon;
grant execute on function public.fn_bu_btvn_viec_cua_toi() to authenticated;
