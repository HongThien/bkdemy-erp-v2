-- ============================================================================
-- CHUỖI → THẾ GIỚI BK (spec-v1-app-hs.md §3): mốc 7 lên Lớp + Bạn bè (A), mốc 30/100/200/365 lên Thế giới (S). Khoe được như thành tích khác.
-- Tính chuỗi cho cả trung tâm mỗi lần mở feed quá đắt (~80 ms/em) ⇒ ghi SỰ KIỆN "đạt mốc" lúc em NỘP lượt luyện thêm (trigger),
-- feed đọc bảng sự kiện. Bảng chỉ THÊM (sự kiện đã xảy ra), khoá (em, mốc, ngày bắt đầu chuỗi) ⇒ mỗi chuỗi mỗi mốc 1 lần.
-- Chỉ ghi mốc VỪA chạm (so_ngay − mốc ≤ 2, sửa chuỗi có thể nhảy 2 ngày) ⇒ không bắn tin dồn cho chuỗi đã dài từ trước.
-- Lỗi tính chuỗi KHÔNG BAO GIỜ được chặn việc nộp bài (bắt lỗi, chỉ cảnh báo).
-- ============================================================================

create or replace function public._chuoi_cua(p_hs uuid)
returns jsonb language plpgsql stable as $$
declare
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_khoi text;
  v_dem jsonb;            -- {ngay: số lượt học thật}
  v_nghi date[];
  v_start date;
  d date;
  c int;
  v_extra int;
  v_tt jsonb := '{}';     -- {ngay: trạng thái}
  v_cho date[] := '{}';   -- ngày lỡ đang chờ sửa (cũ → mới)
  v_the jsonb := '{}';    -- {yyyy-mm: số thẻ đã dùng}
  v_thang text;
  p date;
  v_so int := 0;
  v_ky_luc int := 0;
  v_chay int := 0;
  s text;
  v_moc int;
  v_bay jsonb := '[]';
  v_luot_hn int;
  v_bat_dau date;          -- ngày đầu của chuỗi hiện tại (khoá mốc: mỗi chuỗi mỗi mốc 1 lần)
begin
  select h.khoi into v_khoi from hoc_sinh h where h.id = p_hs;
  select coalesce(jsonb_object_agg(x.ngay::text, x.n), '{}'), min(x.ngay) into v_dem, v_start
    from (select l.ngay, count(*) n from public._luot_hoc_that(p_hs, '-infinity', 'infinity') l where l.tinh group by l.ngay) x;
  select coalesce(array_agg(distinct g::date), '{}') into v_nghi
    from chuoi_ngay_nghi n, generate_series(n.tu, n.den, interval '1 day') g
    where n.xoa_at is null and (n.khoi = '{}' or v_khoi = any(n.khoi));
  v_luot_hn := coalesce((v_dem->>v_today::text)::int, 0);

  if v_start is not null then
    d := v_start;
    while d <= v_today loop
      c := coalesce((v_dem->>d::text)::int, 0);
      -- lượt thừa hôm nay sửa ngày lỡ cũ nhất còn trong cửa sổ 48 giờ
      v_extra := case when d = any(v_nghi) then c else greatest(c - 1, 0) end;
      while v_extra > 0 and cardinality(v_cho) > 0 and d - v_cho[1] <= 2 loop
        v_tt := v_tt || jsonb_build_object(v_cho[1]::text, 'sua');
        v_cho := v_cho[2:];
        v_extra := v_extra - 1;
      end loop;
      -- trạng thái chính ngày d
      if c >= 1 then v_tt := v_tt || jsonb_build_object(d::text, 'hoc');
      elsif d = any(v_nghi) then v_tt := v_tt || jsonb_build_object(d::text, 'nghi');
      elsif d = v_today then v_tt := v_tt || jsonb_build_object(d::text, 'trong');
      else v_tt := v_tt || jsonb_build_object(d::text, 'cho_sua'); v_cho := v_cho || d;
      end if;
      -- ngày lỡ hết cửa sổ (đã qua trọn d = p+2) ⇒ thẻ đóng băng hoặc đứt
      while cardinality(v_cho) > 0 and d - v_cho[1] >= 2 and d < v_today loop
        p := v_cho[1]; v_cho := v_cho[2:];
        v_thang := to_char(p, 'YYYY-MM');
        if coalesce((v_the->>v_thang)::int, 0) < 2 then
          v_the := v_the || jsonb_build_object(v_thang, coalesce((v_the->>v_thang)::int, 0) + 1);
          v_tt := v_tt || jsonb_build_object(p::text, 'dong_bang');
        else
          v_tt := v_tt || jsonb_build_object(p::text, 'dut');
        end if;
      end loop;
      d := d + 1;
    end loop;

    -- kỷ lục: chạy xuôi; chuỗi hiện tại: phần chạy cuối (ngày hoc/sua cộng, nghi/dong_bang/cho_sua/trong giữ, dut cắt)
    d := v_start;
    while d <= v_today loop
      s := v_tt->>d::text;
      if s in ('hoc', 'sua') then
        if v_chay = 0 then v_bat_dau := d; end if;
        v_chay := v_chay + 1; v_ky_luc := greatest(v_ky_luc, v_chay);
      elsif s = 'dut' then v_chay := 0; v_bat_dau := null;
      end if;
      d := d + 1;
    end loop;
    v_so := v_chay;
  end if;

  select min(m) into v_moc from unnest(array[3, 7, 14, 30, 50, 100, 200, 365]) m where m > v_so;
  for d in select generate_series(v_today - 6, v_today, interval '1 day')::date loop
    s := coalesce(v_tt->>d::text, case when d = v_today then 'trong' else 'truoc' end);
    v_bay := v_bay || jsonb_build_object('ngay', d, 'trang_thai',
      case s when 'sua' then 'hoc' when 'truoc' then 'trong' else s end);
  end loop;

  return jsonb_build_object(
    'so_ngay', v_so,
    'bat_dau', case when v_so > 0 then v_bat_dau end,
    'hom_nay_da_tinh', coalesce(v_tt->>v_today::text, '') = 'hoc',
    'luot_hom_nay', v_luot_hn,
    'ky_luc', v_ky_luc,
    'the_dong_bang', 2 - coalesce((v_the->>to_char(v_today, 'YYYY-MM'))::int, 0),
    'ngay_cho_sua', to_jsonb(v_cho),
    'luot_can_bu', cardinality(v_cho),               -- hôm nay cần thêm bấy nhiêu lượt (ngoài lượt giữ hôm nay) để sửa hết
    'sua_duoc_den', case when cardinality(v_cho) > 0
      then to_jsonb(((v_cho[1] + 3)::timestamp at time zone 'Asia/Ho_Chi_Minh')) end,   -- hết ngày p+2 giờ VN
    'moc_tiep', v_moc,
    'bay_ngay', v_bay
  );
end $$;

create table if not exists public.chuoi_moc_dat (
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  moc         integer not null check (moc in (7, 30, 100, 200, 365)),
  bat_dau     date not null,
  mon         text not null,           -- môn của lượt làm chạm mốc (tin cần lớp-môn để vào kênh Lớp)
  dat_at      timestamptz not null default now(),
  primary key (hoc_sinh_id, moc, bat_dau)
);
alter table public.chuoi_moc_dat enable row level security;   -- chỉ đọc qua hàm security definer

create or replace function public._trg_chuoi_moc()
returns trigger language plpgsql security definer set search_path = public as $$
declare v jsonb; v_mon text; m int;
begin
  select bt.mon into v_mon from bai_test bt where bt.id = new.bai_test_id and bt.loai = 'tu_luyen';
  if v_mon is null then return new; end if;
  begin
    v := public._chuoi_cua(new.hoc_sinh_id);
    if coalesce((v->>'so_ngay')::int, 0) > 0 and v->>'bat_dau' is not null then
      foreach m in array array[7, 30, 100, 200, 365] loop
        if (v->>'so_ngay')::int >= m and (v->>'so_ngay')::int - m <= 2 then
          insert into chuoi_moc_dat (hoc_sinh_id, moc, bat_dau, mon)
          values (new.hoc_sinh_id, m, (v->>'bat_dau')::date, v_mon) on conflict do nothing;
        end if;
      end loop;
    end if;
  exception when others then
    raise warning 'chuỗi: không ghi được mốc cho % — %', new.hoc_sinh_id, sqlerrm;   -- không chặn nộp bài
  end;
  return new;
end $$;

drop trigger if exists trg_chuoi_moc on public.bai_lam;
create trigger trg_chuoi_moc after update of trang_thai on public.bai_lam
  for each row when (new.trang_thai = 'da_nop' and old.trang_thai is distinct from 'da_nop')
  execute function public._trg_chuoi_moc();

-- _the_gioi_tin: NGUYÊN bản đang chạy (pg_get_functiondef 01/10) + nhánh 'chuoi' ở cuối.
CREATE OR REPLACE FUNCTION public._the_gioi_tin(p_tu timestamp with time zone)
 RETURNS TABLE(khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamp with time zone, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Nhất buổi (giải 1 xếp hạng buổi)
  select 'nhat_buoi:' || g.buoi_hoc_id || ':' || g.hoc_sinh_id, 'A', 'hoc', 'nhat_buoi', g.hoc_sinh_id, array[g.hoc_sinh_id], b.lop_id, g.mon,
         coalesce(b.giai_chot_at, g.created_at), jsonb_build_object('ngay', b.ngay)
  from buoi_giai g join buoi_hoc b on b.id = g.buoi_hoc_id
  where g.giai = 1 and coalesce(b.giai_chot_at, g.created_at) >= p_tu
  union all
  -- Nhất game buổi (cá nhân) — Bắn Quà chế độ đội thì tin theo ĐỘI ở dưới
  select 'game:' || l.id, 'A', 'game', 'game_nhat', l.hoc_sinh_id, array[l.hoc_sinh_id], b.lop_id, l.mon, l.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_luot l join buoi_hoc b on b.id = l.buoi_hoc_id
  where l.giai = 1 and l.at >= p_tu
    and not exists (select 1 from buoi_ban_qua q where q.buoi_hoc_id = l.buoi_hoc_id and q.che_do = 'doi' and l.game = 'ban_qua')
  union all
  -- 🧋 trúng trà sữa — tầng S
  select 'tra_sua:' || q.luot_id, 'S', 'mayman', 'tra_sua', q.hoc_sinh_id, array[q.hoc_sinh_id], b.lop_id, l.mon, q.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_qua q join buoi_game_luot l on l.id = q.luot_id join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.qua = 'tra_sua' and q.at >= p_tu
  union all
  -- Đội thắng Bắn Quà (chế độ đội)
  select 'ban_qua:' || q.buoi_hoc_id || ':' || d.doi, 'A', 'game', 'doi_thang', null::uuid,
         array(select h.hoc_sinh_id from buoi_ban_qua_hs h where h.buoi_hoc_id = q.buoi_hoc_id and h.doi = d.doi),
         b.lop_id, q.mon, q.chot_at, jsonb_build_object('doi', d.doi, 'game', 'ban_qua', 'ngay', b.ngay)
  from buoi_ban_qua q join buoi_ban_qua_doi d on d.buoi_hoc_id = q.buoi_hoc_id and d.hang = 1 join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.che_do = 'doi' and q.chot_at >= p_tu
  union all
  -- Huy hiệu: ★4–5 = S, ★1–3 = A
  select 'huy_hieu:' || x.id, case when x.sao >= 4 then 'S' else 'A' end, 'hoc', 'huy_hieu', x.hoc_sinh_id, array[x.hoc_sinh_id], null::uuid, x.mon, x.dat_at,
         jsonb_build_object('key', x.huy_hieu_key, 'ten', hh.ten, 'sao', x.sao)
  from hs_huy_hieu_dat x left join huy_hieu hh on hh.mon = x.mon and hh.key = x.huy_hieu_key
  where x.dat_at >= p_tu
  union all
  -- Giải tháng đã công bố — tầng S
  select 'giai_thang:' || g.id, 'S', 'hoc', 'giai_thang', g.hoc_sinh_id, array[g.hoc_sinh_id], g.lop_id, g.mon, g.cong_bo_at,
         jsonb_build_object('loai_giai', g.loai_giai, 'thang', g.thang)
  from giai_thuong g where g.cong_bo_at >= p_tu
  union all
  -- ET điểm cao (Thùy 29/09: tin phải là THÀNH TÍCH có số, tích cực — bỏ tin "xong N bài"). Chỉ ET từ 5 câu (đo 28 ngày: 41% lượt ET
  -- được 10 điểm nhưng phần lớn là ET 1–3 câu ⇒ không đáng khoe). ET 10 điểm = A (~5/ngày toàn trung tâm) · ET 9–9,5 = B.
  select 'et:' || e.buoi_hoc_id || ':' || e.hoc_sinh_id, case when e.ti_le = 1 then 'A' else 'B' end, 'hoc', 'et_cao',
         e.hoc_sinh_id, array[e.hoc_sinh_id], e.lop_id, e.mon, e.cham_at,
         jsonb_build_object('ngay', e.ngay, 'diem', round(e.ti_le * 10, 1), 'so_cau', e.so_cau)
  from public._et_diem_buoi((p_tu at time zone 'Asia/Ho_Chi_Minh')::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date) e
  where e.so_cau >= 5 and e.ti_le >= 0.9 and e.cham_at >= p_tu
  union all
  -- Tự luyện chăm (tầng B): ≥ 50 câu ĐÚNG trong 1 ngày / môn (đo 28 ngày: trung vị 12, top 10% ≈ 59) — 1 tin / em / ngày / môn
  select 'tu_luyen:' || bl.hoc_sinh_id || ':' || (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date || ':' || bt.mon, 'B', 'noluc', 'tu_luyen',
         bl.hoc_sinh_id, array[bl.hoc_sinh_id], null::uuid, bt.mon, max(blc.cham_at),
         jsonb_build_object('ngay', (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, 'so_dung', count(*))
  from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
  where bt.loai = 'tu_luyen' and blc.verdict = 'correct' and blc.cham_at >= p_tu
  group by bl.hoc_sinh_id, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, bt.mon
  having count(*) >= 50
  union all
  -- 🔥 Chuỗi làm bài (mig 202610011515): mốc 7 = A (Lớp + Bạn bè) · 30/100/200/365 = S (lên Thế giới). Mỗi chuỗi chỉ tin MỐC CAO NHẤT trong cửa sổ.
  select * from (
  select distinct on (m.hoc_sinh_id, m.bat_dau)
         'chuoi:' || m.hoc_sinh_id || ':' || m.bat_dau || ':' || m.moc, case when m.moc >= 30 then 'S' else 'A' end, 'noluc', 'chuoi',
         m.hoc_sinh_id, array[m.hoc_sinh_id], null::uuid, m.mon, m.dat_at, jsonb_build_object('so_ngay', m.moc)
  from chuoi_moc_dat m
  where m.dat_at >= p_tu
  order by m.hoc_sinh_id, m.bat_dau, m.moc desc
  ) chuoi_tin
$function$;

revoke all on function public._chuoi_cua(uuid) from public, anon, authenticated;
revoke all on function public._trg_chuoi_moc() from public, anon, authenticated;
