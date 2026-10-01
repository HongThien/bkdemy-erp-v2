-- ============================================================================
-- fn_gay_lich_su — tên NGƯỜI CHẤM trong timeline (vá tiếp 202609231626).
-- gami_grades.graded_by và buoi_danh_gia.graded_by lưu id TÀI KHOẢN (auth uid = tai_khoan.id),
-- KHÔNG phải nhan_su.id (đo thật 23/09: 111.484/111.484 và 4.186/4.186 khớp tai_khoan, 0 khớp
-- nhan_su) ⇒ bản trước tra thẳng nhan_su nên dòng "Nhập điểm HS…" / "Sửa đánh giá HS…" luôn
-- trống tên. Helper _gay_ten_actor: tai_khoan → nhan_su, fallback nhan_su trực tiếp.
-- ============================================================================
create or replace function public._gay_ten_actor(p_id uuid) returns text
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = p_id),
    (select ns.ho_ten from nhan_su ns where ns.id = p_id))
$$;
revoke all on function public._gay_ten_actor(uuid) from public, anon;

create or replace function public.fn_gay_lich_su(p_ref_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_buoi uuid; v_tab text; v_viec uuid;
  b record;
  v_han timestamptz; v_dong1 timestamptz; v_dong_hien timestamptz;
  v_first_sk text; v_first_cu timestamptz;
  v_ten text; ev jsonb := '[]'::jsonb; tmp jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự mới xem được lịch sử task.'; end if;

  -- ── việc giao tay ──
  if p_ref_key ~ '^viec:[0-9a-f-]{36}$' then
    v_viec := substr(p_ref_key, 6)::uuid;
    select coalesce(jsonb_agg(jsonb_build_object(
      'at', (v.deadline::timestamp + interval '23 hours 59 minutes') at time zone 'Asia/Ho_Chi_Minh',
      'loai', 'han', 'mo_ta', 'Hạn chót: ' || v.tieu_de, 'actor', null)), '[]')
    into tmp from viec v where v.id = v_viec and v.deadline is not null;
    ev := ev || tmp;
    select coalesce(jsonb_agg(jsonb_build_object(
      'at', l.ts, 'loai', 'viec',
      'mo_ta', l.hanh_dong
        || case when (l.truoc->>'trang_thai') is distinct from (l.sau->>'trang_thai')
                then ' · ' || coalesce(l.truoc->>'trang_thai', '—') || ' → ' || coalesce(l.sau->>'trang_thai', '—') else '' end
        || case when (l.truoc->>'deadline') is distinct from (l.sau->>'deadline')
                then ' · hạn ' || coalesce(l.truoc->>'deadline', '—') || ' → ' || coalesce(l.sau->>'deadline', '—') else '' end,
      'actor', ns.ho_ten)), '[]')
    into tmp from viec_log l left join nhan_su ns on ns.id = l.actor where l.viec_id = v_viec;
    ev := ev || tmp;

  -- ── task vận hành trên buổi ──
  elsif p_ref_key ~ '^vh:[0-9a-f-]{36}\|(ingame|et|danhgia|btvn|mt)\|' then
    v_buoi := split_part(substr(p_ref_key, 4), '|', 1)::uuid;
    v_tab  := split_part(substr(p_ref_key, 4), '|', 2);
    select bh.* into b from buoi_hoc bh where bh.id = v_buoi;
    if not found then return '[]'::jsonb; end if;
    v_ten := case v_tab when 'ingame' then 'Chấm bài trên lớp' when 'et' then 'Chấm ET'
                        when 'danhgia' then 'Đánh giá sau buổi' when 'btvn' then 'Chấm BTVN' else 'Chấm MT' end;
    v_dong_hien := case v_tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at
                              when 'danhgia' then b.danh_gia_xong_at when 'btvn' then b.btvn_dong_at else b.mt_dong_at end;
    v_han := case
      when b.lop_id is not null then public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, v_tab)
      when v_tab = 'et' then ((b.ngay + 1)::timestamp + interval '12 hours') at time zone 'Asia/Ho_Chi_Minh'
      else (b.ngay::timestamp + interval '23 hours 59 minutes') at time zone 'Asia/Ho_Chi_Minh' end;
    if v_han is not null then
      ev := ev || jsonb_build_array(jsonb_build_object('at', v_han, 'loai', 'han', 'mo_ta', 'Hạn chót ' || v_ten, 'actor', null));
    end if;

    -- đóng / mở lại (từ log)
    select coalesce(jsonb_agg(jsonb_build_object(
      'at', pl.at, 'loai', pl.su_kien,
      'mo_ta', case pl.su_kien
        when 'dong' then 'Đóng ' || v_ten || case when v_han is null then '' when pl.at <= v_han then ' — trước hạn' else ' — trễ ' || public._gay_nhan_tre(v_han, pl.at) end
        when 'mo_lai' then 'Mở lại ' || v_ten
        else 'Đổi mốc đóng ' || v_ten end,
      'actor', ns.ho_ten)), '[]')
    into tmp from buoi_hoc_phase_log pl left join nhan_su ns on ns.id = pl.actor
    where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab;
    ev := ev || tmp;

    -- lần đóng ĐẦU (mốc để nhận ra "dữ liệu HS nhập sau khi đã đóng")
    select min(pl.at) into v_dong1 from buoi_hoc_phase_log pl where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab and pl.su_kien = 'dong';
    select pl.su_kien, pl.cu into v_first_sk, v_first_cu
      from buoi_hoc_phase_log pl where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab order by pl.at, pl.id limit 1;
    if v_first_sk in ('mo_lai', 'doi_moc') and v_first_cu is not null then
      -- log mở đầu bằng "mở lại" ⇒ lần đóng đầu xảy ra TRƯỚC khi có log; mốc = giá trị cũ của cột
      ev := ev || jsonb_build_array(jsonb_build_object(
        'at', v_first_cu, 'loai', 'dong',
        'mo_ta', 'Đóng ' || v_ten || case when v_han is null then '' when v_first_cu <= v_han then ' — trước hạn' else ' — trễ ' || public._gay_nhan_tre(v_han, v_first_cu) end
                 || ' (suy từ mốc cũ — trước khi có log)',
        'actor', null));
      v_dong1 := least(coalesce(v_dong1, v_first_cu), v_first_cu);
    elsif v_dong1 is null and v_dong_hien is not null then
      -- chưa có log dòng nào mà cột đã có mốc ⇒ đóng trước khi có log, không biết có mở lại hay không
      v_dong1 := v_dong_hien;
      ev := ev || jsonb_build_array(jsonb_build_object(
        'at', v_dong_hien, 'loai', 'dong',
        'mo_ta', 'Đóng ' || v_ten || case when v_han is null then '' when v_dong_hien <= v_han then ' — trước hạn' else ' — trễ ' || public._gay_nhan_tre(v_han, v_dong_hien) end
                 || ' (mốc hiện tại — trước khi có log, không biết có mở lại hay không)',
        'actor', null));
    end if;

    -- dữ liệu HS nhập SAU lần đóng đầu (điểm theo phase · kết quả BTVN · đánh giá)
    if v_dong1 is not null then
      if v_tab in ('ingame', 'et', 'mt', 'btvn') then
        select coalesce(jsonb_agg(jsonb_build_object(
          'at', x.at, 'loai', 'nhap', 'mo_ta', 'Nhập điểm HS ' || x.ho_ten || ' (' || x.n || ' câu)', 'actor', x.actor)), '[]')
        into tmp from (
          select hs.ho_ten, min(g.graded_at) as at, count(*) as n,
                 public._gay_ten_actor((array_agg(g.graded_by order by g.graded_at))[1]) as actor
          from gami_grades g join gami_session_problems p on p.id = g.problem_id join hoc_sinh hs on hs.id = g.hoc_sinh_id
          where p.buoi_hoc_id = v_buoi and p.phase = v_tab and g.graded_at > v_dong1
          group by hs.id, hs.ho_ten) x;
        ev := ev || tmp;
      end if;
      if v_tab = 'btvn' then
        select coalesce(jsonb_agg(jsonb_build_object(
          'at', k.updated_at, 'loai', 'nhap',
          'mo_ta', 'Cập nhật kết quả BTVN HS ' || hs.ho_ten
            || case k.trang_thai_nop when 'nop_muon' then ' — nộp muộn' when 'nop_dung_han' then ' — đúng hạn'
                                     when 'xin_phep' then ' — xin phép' when 'khong_lam' then ' — không làm' else '' end,
          'actor', null)), '[]')
        into tmp from btvn_ket_qua k join hoc_sinh hs on hs.id = k.hoc_sinh_id
        where k.buoi_hoc_id = v_buoi and k.updated_at > v_dong1;
        ev := ev || tmp;
      end if;
      if v_tab = 'danhgia' then
        select coalesce(jsonb_agg(jsonb_build_object(
          'at', d.updated_at, 'loai', 'nhap', 'mo_ta', 'Sửa đánh giá HS ' || hs.ho_ten, 'actor', public._gay_ten_actor(d.graded_by))), '[]')
        into tmp from buoi_danh_gia d join hoc_sinh hs on hs.id = d.hoc_sinh_id
        where d.buoi_hoc_id = v_buoi and d.updated_at > v_dong1;
        ev := ev || tmp;
      end if;
    end if;

    -- bằng chứng HS nộp muộn (độc lập với việc đóng — nhân chứng thứ hai)
    if v_tab = 'btvn' then
      select coalesce(jsonb_agg(jsonb_build_object(
        'at', n.nop_at, 'loai', 'hs_nop',
        'mo_ta', 'HS ' || hs.ho_ten || ' nộp BTVN' || coalesce(' (' || n.nguon || ')', '')
          || case when v_han is not null and n.nop_at > v_han then ' — sau hạn ' || public._gay_nhan_tre(v_han, n.nop_at) else '' end
          || case when v_dong1 is not null and n.nop_at > v_dong1 then ' — sau khi đã đóng' else '' end,
        'actor', null)), '[]')
      into tmp from btvn_nop n join hoc_sinh hs on hs.id = n.hoc_sinh_id
      where n.buoi_hoc_id = v_buoi and n.nop_at is not null
        and ((v_han is not null and n.nop_at > v_han) or (v_dong1 is not null and n.nop_at > v_dong1));
      ev := ev || tmp;
    end if;
    if v_tab in ('et', 'btvn', 'mt') and b.lop_id is not null then
      select coalesce(jsonb_agg(jsonb_build_object(
        'at', bl.nop_at, 'loai', 'hs_nop',
        'mo_ta', 'HS ' || hs.ho_ten || ' nộp online'
          || case when bt.deadline is not null and bl.nop_at > bt.deadline then ' — sau hạn nộp ' || public._gay_nhan_tre(bt.deadline, bl.nop_at)
                  when bt.deadline is null and v_han is not null and bl.nop_at > v_han then ' — sau hạn ' || public._gay_nhan_tre(v_han, bl.nop_at) else '' end
          || case when v_dong1 is not null and bl.nop_at > v_dong1 then ' — sau khi đã đóng' else '' end,
        'actor', null)), '[]')
      into tmp from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id join hoc_sinh hs on hs.id = bl.hoc_sinh_id
      where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = v_tab and bl.nop_at is not null
        and (bl.nop_at > coalesce(bt.deadline, v_han) or (v_dong1 is not null and bl.nop_at > v_dong1));
      ev := ev || tmp;
    end if;
  else
    return '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(e order by (e->>'at')::timestamptz), '[]'::jsonb) into ev from jsonb_array_elements(ev) e;
  return ev;
end $$;
revoke all on function public.fn_gay_lich_su(text) from public, anon;
grant execute on function public.fn_gay_lich_su(text) to authenticated;
