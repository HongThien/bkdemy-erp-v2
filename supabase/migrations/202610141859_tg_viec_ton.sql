-- ============================================================================
-- 202610141859 — tg_viec_ton  (spec-bot-telegram-ta.md §5, bước B1)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Bot Telegram đăng lúc 08:00 danh sách VIỆC TỒN của từng TA. "Việc của TA" hiện rải ở 6 chỗ, một nửa
--   tính ở CLIENT (gami.ts getMyTasks: buổi bù / đuổi / báo sai) — vi phạm §2.0 và bot (chạy server) không
--   gọi được. Hàm này là NGUỒN DUY NHẤT cho bot; app TA nên chuyển sang đọc nó sau (việc treo, ghi spec).
--   Luật mỗi nguồn chép ĐÚNG luật đang chạy (dẫn nguồn ở từng khối) — đổi luật thì đổi ở đây + nguồn gốc.
--
--   "Tồn" = CHƯA XONG và ngày gốc < p_ngay (buổi/ca đã diễn ra trước hôm bản tin). Việc trong ngày p_ngay
--   chưa tính — TA còn cả ngày để làm.
--   ref_key = khoá tự nhiên của việc; với việc buổi trùng ĐÚNG khoá gay_de_xuat.ref_key (vh:buoi|tab|ns)
--   ⇒ tổng kết ↔ gậy nối bằng khoá, không bằng vị trí (CLAUDE.md §2).
--
--   _ta_buoi_thieu_cong: tách lõi của fn_ta_buoi_thieu_cong (bỏ kiểm quyền, thêm nhan_su_id) để bot và màn
--   đối chiếu dùng CHUNG một luật "buổi/ca chưa ghi công". fn_ta_buoi_thieu_cong giữ nguyên chữ ký + kết quả.
--
-- MẤT GÌ (Luật xoá): không xoá gì. fn_ta_buoi_thieu_cong viết lại thân (create or replace, cùng chữ ký,
--   cùng cột trả về, cùng quyền) — nay gọi lõi.
-- ============================================================================

-- ── Lõi "buổi/ca chưa ghi công" (luật y hệt fn_ta_buoi_thieu_cong mig 202610141240) ─────────────────────
create or replace function public._ta_buoi_thieu_cong(p_tu date, p_den date)
returns table (loai text, ngay date, lop_id uuid, ten text, gio_bat_dau time, gio_ket_thuc time,
               buoi_hoc_id uuid, ca_bo_tro_id uuid, nhan_su_id uuid, nguoi_phu_trach text)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (now() at time zone 'Asia/Ho_Chi_Minh')::time;
        v_tu date := greatest(p_tu, public._ta_moc_cham_cong());
        v_den date := least(coalesce(p_den, p_tu), v_homnay);
begin
  return query
  select 'buoi'::text, b.ngay, b.lop_id, l.ten_lop, b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, ai.id, ai.ho_ten
    from buoi_hoc b join lop l on l.id = b.lop_id
    left join lateral (select n.id, n.ho_ten from public._ta_tg_tai(b.ngay, b.lop_id) t join nhan_su n on n.id = t.nhan_su_id
                        order by t.la_chinh desc, n.ho_ten limit 1) ai on true
   where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec
                      where cv.lop_id = b.lop_id and cv.ngay = b.ngay and lv.tinh_vao in ('tg', 'trong_thi') and cv.trang_thai <> 'tu_choi')
  union all
  select 'ca'::text, c.ngay, null::uuid, concat_ws(' ', 'Trực bổ trợ', c.mon, c.khoi), c.gio_bat_dau, c.gio_ket_thuc, null::uuid, c.id,
         c.nhan_su_id, (select n.ho_ten from nhan_su n where n.id = c.nhan_su_id)
    from ca_bo_tro c
   where c.trang_thai = 'mo' and c.ngay between v_tu and v_den
     and (c.ngay < v_homnay or c.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv
                      where cv.trang_thai <> 'tu_choi' and cv.ngay = c.ngay
                        and (cv.ca_bo_tro_id = c.id or (cv.loai_viec = 'bo_tro_dinh_ki' and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))))
   order by 2, 5 nulls last;
end $$;
revoke all on function public._ta_buoi_thieu_cong(date, date) from public, anon, authenticated;

create or replace function public.fn_ta_buoi_thieu_cong(p_tu date, p_den date default null)
returns table (loai text, ngay date, lop_id uuid, ten text, gio_bat_dau time, gio_ket_thuc time,
               buoi_hoc_id uuid, ca_bo_tro_id uuid, nguoi_phu_trach text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('ta_cong_duyet') then raise exception 'Không có quyền xem đối chiếu công'; end if;
  return query select x.loai, x.ngay, x.lop_id, x.ten, x.gio_bat_dau, x.gio_ket_thuc, x.buoi_hoc_id, x.ca_bo_tro_id, x.nguoi_phu_trach
                 from public._ta_buoi_thieu_cong(p_tu, p_den) x;
end $$;
revoke all on function public.fn_ta_buoi_thieu_cong(date, date) from public, anon;
grant execute on function public.fn_ta_buoi_thieu_cong(date, date) to authenticated;

-- ── Việc tồn của MỌI TA tính tới đầu ngày p_ngay ────────────────────────────────────────────────────────
-- loai: ingame · et · btvn · bu_et · bu_danhgia · duoi_danhgia · yeu_ca · retest · btvn_bu · baosai · cong_buoi · cong_ca · quen_checkout
create or replace function public._tg_viec_ton(p_ngay date)
returns table (nhan_su_id uuid, ref_key text, loai text, nhan text, lop_id uuid, ten_lop text, khoi text, mon text,
               ngay_goc date, han timestamptz, so_luong integer)
language sql stable security definer set search_path = public as $$
  with
  -- (1) Buổi thường: 3 nghiệp vụ app TA (TaHome.tsx filter ingame/et/btvn) — fn_viec_buoi_thuong
  thuong as (
    select v.nhan_su_id, v.ref_key, v.tab as loai,
           case v.tab when 'ingame' then 'Chấm bài trên lớp' when 'et' then case when v.et_online then 'Xác nhận ET (online)' else 'Chấm ET' end
                      else 'Chấm BTVN' end as nhan,
           v.lop_id, v.ten_lop, l.khoi, l.mon, v.ngay as ngay_goc, v.han, 1 as so_luong
    from public.fn_viec_buoi_thuong(null, p_ngay - 1, true) v join lop l on l.id = v.lop_id
    where v.vai = 'tg' and v.tab in ('ingame', 'et', 'btvn') and v.dong_at is null
  ),
  -- (2) Buổi bù / đuổi: owner = TA đứng lớp, fallback GV (gami.ts getMyTasks). Bỏ buổi đã điểm danh xong mà 0 em có mặt.
  bo_tro as (
    select b.id, b.loai, b.ngay, coalesce(b.nguoi_day_tg, b.nguoi_day) as ns, b.et_dong_at, b.danh_gia_xong_at
    from buoi_hoc b
    where b.loai in ('bu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and b.ngay < p_ngay
      and coalesce(b.nguoi_day_tg, b.nguoi_day) is not null
      and (b.loai = 'bo_tro_duoi'
           or exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and (x.diem_danh is null or x.diem_danh = 'co_mat')))
  ),
  bu as (
    select bt.ns, 'vh:' || bt.id || '|et|' || bt.ns, 'bu_et', 'Chấm ET (buổi bù)', null::uuid, 'Buổi bù', null::text, null::text, bt.ngay,
           ((bt.ngay + 1 + time '12:00') at time zone 'Asia/Ho_Chi_Minh'), 1
    from bo_tro bt where bt.loai = 'bu' and bt.et_dong_at is null
    union all
    select bt.ns, 'vh:' || bt.id || '|danhgia|' || bt.ns, case bt.loai when 'bu' then 'bu_danhgia' else 'duoi_danhgia' end,
           case bt.loai when 'bu' then 'Đánh giá buổi bù' else 'Đánh giá buổi đuổi' end,
           null::uuid, case bt.loai when 'bu' then 'Buổi bù' else 'Buổi đuổi' end, null::text, null::text, bt.ngay,
           ((bt.ngay + time '23:59') at time zone 'Asia/Ho_Chi_Minh'), 1
    from bo_tro bt where bt.danh_gia_xong_at is null
  ),
  -- (3) Ca bổ trợ yếu chưa hoàn tất (fn_btyeu_viec_cua_toi / demNoBoTro: chưa xong, em không vắng)
  yeu as (
    select b.nguoi_day_tg as ns, 'vh:' || b.id || '|danhgia|' || b.nguoi_day_tg as ref_key, 'yeu_ca' as loai,
           'Hoàn tất ca bổ trợ yếu — ' || h.ho_ten as nhan, null::uuid as lop_id, 'Bổ trợ yếu' as ten_lop, h.khoi, y.mon, b.ngay,
           ((b.ngay + time '23:59') at time zone 'Asia/Ho_Chi_Minh') as han, 1
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.nguoi_day_tg is not null
      and b.ngay < p_ngay and b.danh_gia_xong_at is null and hh.diem_danh is distinct from 'vang'
  ),
  -- (4) Retest đến hạn mà em chưa nộp — TA lớp (fn_btyeu_viec_cua_toi phần retest)
  retest as (
    select pc.nhan_su_id as ns, 'rt:' || bt.id || '|' || pc.nhan_su_id, 'retest', 'Cho em làm retest — ' || h.ho_ten,
           bt.lop_id, l.ten_lop, l.khoi, l.mon, bt.ngay, null::timestamptz, 1
    from bai_test bt
    join lop l on l.id = bt.lop_id
    join hoc_sinh h on h.id = bt.hoc_sinh_id
    join phan_cong_lop pc on pc.lop_id = bt.lop_id and pc.vai_tro = 'tg'
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
    where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay < p_ngay and public._btyeu_retest_bat()
      and bl.trang_thai is distinct from 'da_nop'
  ),
  -- (5) BTVN bù chưa chấm — TA LỚP của em (fn_bu_btvn_viec_cua_toi, phần chưa xong)
  btvn_bu as (
    select own.ns, 'bb:' || hh.id || '|' || own.ns, 'btvn_bu', 'Chấm BTVN bù — ' || h.ho_ten || ' (buổi ' || to_char(me.ngay, 'DD/MM') || ')',
           l.id, l.ten_lop, l.khoi, l.mon, b.ngay, null::timestamptz, 1
    from buoi_hoc_hs hh
    join buoi_hoc b on b.id = hh.buoi_hoc_id and b.loai = 'bu' and b.trang_thai <> 'huy'
    join buoi_hoc me on me.id = hh.bu_cho_buoi_id
    join lop l on l.id = me.lop_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    left join btvn_ket_qua k on k.hoc_sinh_id = h.id and k.buoi_hoc_id = b.id
    cross join lateral (
      select unnest(coalesce((select array_agg(pc.nhan_su_id) from phan_cong_lop pc where pc.lop_id = l.id and pc.vai_tro = 'tg'),
                             array[coalesce(b.nguoi_day_tg, b.nguoi_day)])) as ns
    ) own
    where hh.diem_danh = 'co_mat' and own.ns is not null
      and b.ngay >= public._bu_btvn_tu_ngay() and b.ngay < p_ngay
      and k.trang_thai_nop is null
      and exists (select 1 from gami_session_problems m where m.buoi_hoc_id = me.id and m.phase = 'btvn' and not m.hidden)
      and not exists (select 1 from btvn_ket_qua km where km.hoc_sinh_id = h.id and km.buoi_hoc_id = me.id and km.trang_thai_nop is not null)
      and not exists (select 1 from gami_grades gm join gami_session_problems pm on pm.id = gm.problem_id
                      where pm.buoi_hoc_id = me.id and pm.phase = 'btvn' and gm.hoc_sinh_id = h.id)
  ),
  -- (6) HS báo sai câu test online đang chờ duyệt — TA lớp, gom theo (lớp × ngày test) (gami.ts getMyTasks)
  baosai as (
    select pc.nhan_su_id as ns, 'vh:' || coalesce(bh.id::text, t.lop_id::text) || '|baosai|' || pc.nhan_su_id,
           'baosai', 'Duyệt HS báo sai', t.lop_id, l.ten_lop, l.khoi, l.mon, t.ngay,
           min(r.created_at) + interval '24 hours', count(*)::int
    from bai_test_report r
    join bai_lam_cau blc on blc.id = r.bai_lam_cau_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    join bai_test t on t.id = btc.bai_test_id
    join lop l on l.id = t.lop_id
    join phan_cong_lop pc on pc.lop_id = t.lop_id and pc.vai_tro = 'tg'
    left join buoi_hoc bh on bh.lop_id = t.lop_id and bh.ngay = t.ngay and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
    where r.trang_thai = 'moi' and (r.created_at at time zone 'Asia/Ho_Chi_Minh')::date < p_ngay
    group by pc.nhan_su_id, bh.id, t.lop_id, l.ten_lop, l.khoi, l.mon, t.ngay
  ),
  -- (7) Chấm công: buổi/ca chưa ghi công (lõi _ta_buoi_thieu_cong) + ca quên checkout
  cong as (
    select x.nhan_su_id as ns,
           case x.loai when 'buoi' then 'cg:' || x.buoi_hoc_id else 'cg:' || x.ca_bo_tro_id end || '|' || x.nhan_su_id,
           case x.loai when 'buoi' then 'cong_buoi' else 'cong_ca' end,
           case x.loai when 'buoi' then 'Ghi công trợ giảng' else 'Ghi công ' || x.ten end,
           x.lop_id, coalesce(l.ten_lop, x.ten), l.khoi, l.mon, x.ngay, null::timestamptz, 1
    from public._ta_buoi_thieu_cong(public._ta_moc_cham_cong(), p_ngay - 1) x
    left join lop l on l.id = x.lop_id
    where x.nhan_su_id is not null
    union all
    select c.nhan_su_id, 'qc:' || c.id, 'quen_checkout', 'Quên checkout — khai giờ ra',
           null::uuid, null::text, null::text, null::text, c.ngay, null::timestamptz, 1
    from ta_cham_cong c
    where c.ra_at is null and c.duyet <> 'tu_choi' and c.ngay < p_ngay and c.ngay >= public._ta_moc_cham_cong()
  ),
  tat_ca as (
    select * from thuong union all select * from bu union all select * from yeu union all select * from retest
    union all select * from btvn_bu union all select * from baosai union all select * from cong
  )
  select distinct on (t.ref_key) t.*
  from tat_ca t join nhan_su n on n.id = t.nhan_su_id and n.trang_thai = 'dang_lam'
  order by t.ref_key
$$;
revoke all on function public._tg_viec_ton(date) from public, anon, authenticated;

-- Bản đọc cho người (Core team xem/kiểm trên ERP). Bot gọi bản secret-gated ở bước B3.
create or replace function public.fn_tg_viec_ton(p_ngay date default null)
returns table (nhan_su_id uuid, ho_ten text, ref_key text, loai text, nhan text, lop_id uuid, ten_lop text, khoi text, mon text,
               ngay_goc date, han timestamptz, so_luong integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('ta_cong_duyet') then raise exception 'Không có quyền xem việc tồn của TA'; end if;
  return query
  select v.nhan_su_id, n.ho_ten, v.ref_key, v.loai, v.nhan, v.lop_id, v.ten_lop, v.khoi, v.mon, v.ngay_goc, v.han, v.so_luong
  from public._tg_viec_ton(coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date)) v
  join nhan_su n on n.id = v.nhan_su_id
  order by n.ho_ten, v.ngay_goc, v.loai;
end $$;
revoke all on function public.fn_tg_viec_ton(date) from public, anon;
grant execute on function public.fn_tg_viec_ton(date) to authenticated;
