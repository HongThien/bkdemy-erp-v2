-- ============================================================================
-- Thế giới BK: TIN LƯU SẴN — Thùy 11/11 (audit timeout: fn_the_gioi_home 5.943 lần × 4,0 s = 24.053 s DB, 1/4 mọi thời gian chậm)
--
-- Bệnh: _the_gioi_tin(p_tu) dựng lại TOÀN BỘ tin của cả trung tâm (ET 30 ngày qua _et_diem_buoi, tự luyện đếm câu đúng trên
-- bai_lam_cau, huy hiệu, chuỗi, giải…) MỖI LẦN một em mở Home / kênh / khen / bình luận. Danh sách này GIỐNG NHAU với mọi em.
-- Sửa (CLAUDE.md §2.0 — số không realtime thì tính sẵn):
--   · _the_gioi_tin_tinh(p_tu)  = thân hàm cũ NGUYÊN VĂN (chép từ DB), chỉ bỏ dòng lọc _hs_hien.
--   · the_gioi_tin_luu           = kết quả _the_gioi_tin_tinh(now() - 31 ngày), máy dựng lại ngầm mỗi 5 phút (cron, file _cron_sql_editor).
--   · _the_gioi_tin(p_tu)        = GIỮ chữ ký; đọc bảng lưu (at >= p_tu) + lọc _hs_hien lúc đọc ⇒ 8 hàm gọi nó không sửa.
--                                  Bảng chưa dựng / p_tu cũ hơn mốc lưu ⇒ tính trực tiếp như cũ (không bao giờ sai, chỉ chậm).
-- Độ trễ: tin mới (ET vừa chấm, huy hiệu vừa đạt…) lên Thế giới chậm tối đa ~5 phút. Khen / bình luận / bài khoe vẫn tức thời
-- (đọc bảng gốc, không qua cache).
-- Bảng lưu là BẢNG ĐỆM: mỗi lượt làm mới xoá-dựng lại trong 1 transaction (người đọc thấy bản cũ tới khi commit). Không phải dữ liệu gốc.
-- ============================================================================

create table if not exists public.the_gioi_tin_luu (
  khoa text not null, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text,
  at timestamptz, chi_tiet jsonb
);
create index if not exists the_gioi_tin_luu_at_idx on public.the_gioi_tin_luu (at);
create index if not exists the_gioi_tin_luu_khoa_idx on public.the_gioi_tin_luu (khoa);
comment on table public.the_gioi_tin_luu is 'Bảng đệm tin Thế giới BK (mig 202611112114). Chỉ _the_gioi_tin_lam_moi ghi; đọc qua _the_gioi_tin.';
alter table public.the_gioi_tin_luu enable row level security;
revoke all on public.the_gioi_tin_luu from anon, authenticated;

create table if not exists public.the_gioi_tin_luu_moc (
  id int primary key check (id = 1),
  tu timestamptz not null,          -- bảng lưu đủ mọi tin có at >= tu
  tinh_luc timestamptz not null
);
alter table public.the_gioi_tin_luu_moc enable row level security;
revoke all on public.the_gioi_tin_luu_moc from anon, authenticated;

-- Thân hàm cũ, nguyên văn từ DB (chỉ đổi tên + bỏ dòng lọc _hs_hien)
CREATE OR REPLACE FUNCTION public._the_gioi_tin_tinh(p_tu timestamp with time zone)
 RETURNS TABLE(khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamp with time zone, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
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
  union all
  -- ⬆ Lên bậc Rank (mig rank_len_bac): bậc 3–4 = B · 5–6 = A · ≥7 = S (lên Thế giới). Soldier (bậc 2) và Novice không có tin.
  select 'len_bac:' || r.hoc_sinh_id || ':' || r.mua || ':' || r.mon || ':' || r.bac,
         case when r.bac >= 7 then 'S' when r.bac >= 5 then 'A' else 'B' end, 'hoc', 'len_bac',
         r.hoc_sinh_id, array[r.hoc_sinh_id], null::uuid, r.mon, (r.dat_ngay::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '12 hours',
         jsonb_build_object('bac', r.bac, 'ten_bac', r.ten_bac)
  from rank_len_bac r
  where r.bac >= 3 and (r.dat_ngay::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '12 hours' >= p_tu
  ) t(khoa, tang, nhom, kieu, hoc_sinh_id, thanh_vien, lop_id, mon, at, chi_tiet)
  -- (lọc _hs_hien chuyển sang lúc ĐỌC ở _the_gioi_tin — cache dùng chung mọi người xem)
$function$;

-- Làm mới bảng lưu: dựng lại 31 ngày (callers dùng tối đa 30 ngày).
create or replace function public._the_gioi_tin_lam_moi()
returns int language plpgsql volatile security definer set search_path = public as $$
declare v_tu timestamptz := now() - interval '31 days'; v_n int;
begin
  delete from the_gioi_tin_luu;
  insert into the_gioi_tin_luu select * from public._the_gioi_tin_tinh(v_tu);
  get diagnostics v_n = row_count;
  insert into the_gioi_tin_luu_moc (id, tu, tinh_luc) values (1, v_tu, now())
    on conflict (id) do update set tu = excluded.tu, tinh_luc = excluded.tinh_luc;
  return v_n;
end $$;

-- Đọc: cùng chữ ký, cùng cột. Cache phủ được p_tu ⇒ đọc cache; không ⇒ tính trực tiếp như cũ.
create or replace function public._the_gioi_tin(p_tu timestamptz)
returns table(khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamptz, chi_tiet jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if exists (select 1 from the_gioi_tin_luu_moc m where m.id = 1 and m.tu <= p_tu) then
    return query select t.khoa, t.tang, t.nhom, t.kieu, t.hoc_sinh_id, t.thanh_vien, t.lop_id, t.mon, t.at, t.chi_tiet
                   from the_gioi_tin_luu t where t.at >= p_tu and public._hs_hien(t.hoc_sinh_id);
  else
    return query select t.* from public._the_gioi_tin_tinh(p_tu) t where public._hs_hien(t.hoc_sinh_id);
  end if;
end $$;

revoke execute on function public._the_gioi_tin_tinh(timestamptz), public._the_gioi_tin_lam_moi() from public, anon, authenticated;

-- Dựng lần đầu để có cache ngay sau khi áp.
select public._the_gioi_tin_lam_moi() as so_tin_luu;
