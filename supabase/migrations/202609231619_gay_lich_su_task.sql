-- ============================================================================
-- LỊCH SỬ ĐÓNG / MỞ LẠI task vận hành — phục vụ hệ Gậy (CEO 23/09/2026).
--
-- Vấn đề: mốc "xong" của 1 task vận hành = 1 cột `*_dong_at` trên buoi_hoc. Bấm
-- "mở lại" (moLaiDanhGia / reopenBTVN / fn_mo_lai_phase) ghi NULL đè, đóng lại thì
-- cột nhận giờ MỚI ⇒ máy chỉ thấy "đóng 15h30 22/07 → trễ", mất hẳn mốc "đã đóng
-- 18h 19/07 đúng hạn". Leader không phân biệt được lỗi nhân sự đóng muộn với việc
-- HS nộp muộn thật rồi nhân sự mở lại để điền.
--
-- Vá (CLAUDE §4 — mọi đổi state ghi vết bằng TRIGGER ở DB, app không tự nhớ):
--   1) bảng buoi_hoc_phase_log + trigger trên 5 cột mốc phase của buoi_hoc.
--   2) RPC fn_gay_lich_su(ref_key) → timeline 1 task (hạn · đóng/mở lại · dữ liệu
--      HS nhập SAU lần đóng đầu · bằng chứng HS nộp muộn) cho màn Gậy.
-- Không đổi luật gậy: máy vẫn đề xuất theo mốc hiện tại, leader nhìn timeline
-- rồi Đánh / Bỏ qua. Lịch sử chỉ có từ lúc áp migration này.
-- ============================================================================

-- ── 1) LOG mốc phase ──────────────────────────────────────────────────────────
create table if not exists buoi_hoc_phase_log (
  id           uuid primary key default gen_random_uuid(),
  buoi_hoc_id  uuid not null references buoi_hoc(id) on delete cascade,
  phase        text not null check (phase in ('ingame','et','danhgia','btvn','mt')),
  su_kien      text not null check (su_kien in ('dong','mo_lai','doi_moc')),
  actor        uuid references nhan_su(id),
  at           timestamptz not null default now(),
  cu           timestamptz,   -- giá trị cột mốc trước khi đổi
  moi          timestamptz    -- giá trị cột mốc sau khi đổi
);
create index if not exists idx_buoi_hoc_phase_log_buoi on buoi_hoc_phase_log(buoi_hoc_id, phase, at);
alter table buoi_hoc_phase_log enable row level security;
drop policy if exists buoi_hoc_phase_log_staff_read on buoi_hoc_phase_log;
create policy buoi_hoc_phase_log_staff_read on buoi_hoc_phase_log for select to authenticated using (public.la_thanh_vien());
comment on table buoi_hoc_phase_log is 'Vết đóng/mở lại từng phase của buổi (trigger trg_buoi_hoc_phase_log). su_kien: dong (null→có) · mo_lai (có→null) · doi_moc (có→có khác).';

-- Ghi 1 dòng nếu mốc đổi. security definer: log không bao giờ được chặn UPDATE nghiệp vụ vì RLS.
create or replace function public._phase_log_ghi(p_buoi uuid, p_phase text, p_cu timestamptz, p_moi timestamptz, p_actor uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_moi is not distinct from p_cu then return; end if;
  insert into buoi_hoc_phase_log (buoi_hoc_id, phase, su_kien, actor, cu, moi)
  values (p_buoi, p_phase,
          case when p_cu is null then 'dong' when p_moi is null then 'mo_lai' else 'doi_moc' end,
          p_actor, p_cu, p_moi);
end $$;
revoke all on function public._phase_log_ghi(uuid, text, timestamptz, timestamptz, uuid) from public, anon;

create or replace function public._trg_buoi_hoc_phase_log() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_actor uuid := public.current_nhan_su_id();
begin
  perform public._phase_log_ghi(NEW.id, 'ingame',  OLD.ingame_dong_at,   NEW.ingame_dong_at,   v_actor);
  perform public._phase_log_ghi(NEW.id, 'et',      OLD.et_dong_at,       NEW.et_dong_at,       v_actor);
  perform public._phase_log_ghi(NEW.id, 'danhgia', OLD.danh_gia_xong_at, NEW.danh_gia_xong_at, v_actor);
  perform public._phase_log_ghi(NEW.id, 'btvn',    OLD.btvn_dong_at,     NEW.btvn_dong_at,     v_actor);
  perform public._phase_log_ghi(NEW.id, 'mt',      OLD.mt_dong_at,       NEW.mt_dong_at,       v_actor);
  return NEW;
end $$;
revoke all on function public._trg_buoi_hoc_phase_log() from public, anon;

drop trigger if exists trg_buoi_hoc_phase_log on buoi_hoc;
create trigger trg_buoi_hoc_phase_log
  after update of ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at on buoi_hoc
  for each row execute function public._trg_buoi_hoc_phase_log();

-- ── 2) Nhãn độ trễ "1 ngày 3h" / "45 phút" ─────────────────────────────────────
create or replace function public._gay_nhan_tre(p_tu timestamptz, p_den timestamptz)
returns text language sql immutable as $$
  select case
    when p_tu is null or p_den is null or p_den <= p_tu then ''
    when p_den - p_tu < interval '1 hour' then extract(epoch from p_den - p_tu)::int / 60 || ' phút'
    when p_den - p_tu < interval '1 day' then
      (extract(epoch from p_den - p_tu)::int / 3600) || 'h'
      || case when (extract(epoch from p_den - p_tu)::int % 3600) / 60 > 0 then ' ' || (extract(epoch from p_den - p_tu)::int % 3600) / 60 || 'p' else '' end
    else (extract(epoch from p_den - p_tu)::int / 86400) || ' ngày'
      || case when (extract(epoch from p_den - p_tu)::int % 86400) / 3600 > 0 then ' ' || (extract(epoch from p_den - p_tu)::int % 86400) / 3600 || 'h' else '' end
  end
$$;

-- ── 3) RPC timeline 1 task ─────────────────────────────────────────────────────
-- ref_key = khoá gậy (gay_de_xuat.ref_key / gay_ledger.ref_id):
--   'vh:<buoi_id>|<tab>|<nhan_su_id>'  → task vận hành trên buổi
--   'viec:<id>'                          → việc giao tay (đọc viec_log)
--   khác (ops gộp theo ca…)              → []
-- Trả jsonb[] {at, loai, mo_ta, actor}; loai ∈ han · dong · mo_lai · doi_moc · nhap · hs_nop · viec.
create or replace function public.fn_gay_lich_su(p_ref_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_buoi uuid; v_tab text; v_viec uuid;
  b record;
  v_han timestamptz; v_dong1 timestamptz; v_dong_hien timestamptz;
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
    -- hạn: buổi thường = fn_han_viec (cùng nguồn với dashboard/gậy); buổi bù/bổ trợ (không lop_id) = luật cố định của getMyTasks
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

    -- lần đóng ĐẦU: mốc để nhận ra "dữ liệu HS nhập sau khi đã đóng"
    select min(pl.at) into v_dong1 from buoi_hoc_phase_log pl where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab and pl.su_kien = 'dong';
    if v_dong1 is null and v_dong_hien is not null then
      -- buổi đóng TRƯỚC khi có log: chỉ biết mốc hiện tại, không biết có mở lại hay chưa
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
                 (select ho_ten from nhan_su where id = (array_agg(g.graded_by order by g.graded_at))[1]) as actor
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
          'at', d.updated_at, 'loai', 'nhap', 'mo_ta', 'Sửa đánh giá HS ' || hs.ho_ten, 'actor', ns.ho_ten)), '[]')
        into tmp from buoi_danh_gia d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join nhan_su ns on ns.id = d.graded_by
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
comment on function public.fn_gay_lich_su(text) is
  'Timeline 1 task cho hệ Gậy theo ref_key (vh:<buoi>|<tab>|<ns> hoặc viec:<id>): hạn · đóng/mở lại (buoi_hoc_phase_log) · dữ liệu HS nhập sau lần đóng đầu · HS nộp muộn. Chỉ nhân sự.';
