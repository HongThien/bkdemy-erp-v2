-- ============================================================================
-- 202610151355 — tg_ban_tin_chi_viec_tre
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì) — Thùy 15/10 sau khi xem bản thử: bản tin chưa khớp deadline,
--   "chỉ nên thông báo những việc đã trễ" — "đã trễ + chưa làm".
--   Hạn từng loại (nguồn duy nhất, không đặt hạn mới):
--   · ET / BTVN buổi thường: fn_han_viec (qua fn_viec_buoi_thuong — cùng hạn đang tính gậy).
--   · ET buổi bù: 12:00 hôm sau (như app TA).
--   · BTVN bù: hạn của fn_bu_btvn_viec_cua_toi (buổi thường kế tiếp theo TKB + 1 ngày) ⇒ tách ra _bu_btvn_han để
--     _tg_viec_ton dùng chung; tính là trễ khi qua hết ngày hạn.
--   · Chấm công (buổi lớp / ca trực / buổi bổ trợ / quên checkout): 24 giờ sau khi kết thúc — luật tự khai của TA
--     (đợt khai lùi tháng 10 vẫn cho khai tới 03/11, nhưng quá 24 giờ đã là trễ).
--   Bản tin lọc han < 8:00 sáng ngày bản tin; mỗi mục kèm số ngày trễ.
--   ⚠ Nợ: công thức hạn BTVN bù giờ ở 2 nơi (fn_bu_btvn_viec_cua_toi + _bu_btvn_han) — lần sau sửa fn_bu_btvn_viec_cua_toi
--     thì cho nó gọi _bu_btvn_han.
--
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 hàm, viết lại thân 2 hàm (cùng chữ ký).
-- ============================================================================

create or replace function public._bu_btvn_han(p_lop uuid, p_ngay_bu date) returns date
language sql stable security definer set search_path = public as $$
  select coalesce((select min(d)::date from generate_series(p_ngay_bu + 1, p_ngay_bu + 14, interval '1 day') d
                    where exists (select 1 from thoi_khoa_bieu t where t.lop_id = p_lop
                                    and t.thu = case extract(dow from d)::int when 0 then 8 else extract(dow from d)::int + 1 end
                                    and t.hieu_luc_tu <= d and (t.hieu_luc_den is null or t.hieu_luc_den >= d))), p_ngay_bu + 7) + 1
$$;
revoke all on function public._bu_btvn_han(uuid, date) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public._tg_viec_ton(p_ngay date)
 RETURNS TABLE(nhan_su_id uuid, ref_key text, loai text, nhan text, lop_id uuid, ten_lop text, khoi text, mon text, ngay_goc date, han timestamp with time zone, so_luong integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
           l.id, l.ten_lop, l.khoi, l.mon, b.ngay, ((public._bu_btvn_han(l.id, b.ngay) + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'), 1   -- hết ngày hạn
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
  -- (7) Chấm công: buổi/ca chưa ghi công (lõi _ta_buoi_thieu_cong) + ca quên checkout
  cong as (
    select x.nhan_su_id as ns,
           'cg:' || coalesce(x.buoi_hoc_id, x.ca_bo_tro_id) || '|' || x.nhan_su_id,
           case x.loai when 'buoi' then 'cong_buoi' when 'ca' then 'cong_ca' else 'cong_bo_tro' end,
           case x.loai when 'buoi' then 'Ghi công trợ giảng' else 'Ghi công ' || x.ten end,
           x.lop_id, coalesce(l.ten_lop, x.ten), l.khoi, l.mon, x.ngay,
           ((x.ngay + coalesce(x.gio_ket_thuc, time '23:59'))::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '24 hours', 1   -- tự ghi công trong 24 giờ
    from public._ta_buoi_thieu_cong(public._ta_moc_cham_cong(), p_ngay - 1) x
    left join lop l on l.id = x.lop_id
    where x.nhan_su_id is not null
    union all
    select c.nhan_su_id, 'qc:' || c.id, 'quen_checkout', 'Quên checkout — khai giờ ra',
           null::uuid, null::text, null::text, null::text, c.ngay, ((c.ngay + time '23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '24 hours', 1
    from ta_cham_cong c
    where c.ra_at is null and c.duyet <> 'tu_choi' and c.ngay < p_ngay and c.ngay >= public._ta_moc_cham_cong()
  ),
  tat_ca as (
    select * from thuong union all select * from bu union all select * from yeu union all select * from retest
    union all select * from btvn_bu union all select * from cong
  )
  select distinct on (t.ref_key) t.*
  from tat_ca t join nhan_su n on n.id = t.nhan_su_id and n.trang_thai = 'dang_lam'
  order by t.ref_key
$function$;

CREATE OR REPLACE FUNCTION public._tg_ban_tin_du_lieu(p_ngay date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with v as (select * from public._tg_viec_ton(p_ngay) x
              where x.loai in ('et', 'btvn', 'bu_et', 'btvn_bu', 'cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
                and x.ngay_goc >= public._ta_moc_cham_cong()     -- Thùy 15/10: chỉ ET · BTVN · chấm công, chỉ từ tháng 10
                and x.han < ((p_ngay + time '08:00')::timestamp at time zone 'Asia/Ho_Chi_Minh')),        -- Thùy 15/10: chỉ việc CHƯA LÀM + ĐÃ TRỄ (tính tới 8:00 sáng)
  -- Cảnh báo BTVN (Thùy 15/10): em của lớp TA có 2 kết quả BTVN GẦN NHẤT liên tiếp cùng là "không làm" hoặc cùng "nộp muộn"
  -- (xin phép không tính, không ngắt chuỗi); chỉ nêu khi bài gần nhất trong chuỗi ở 7 ngày qua (cũ hơn = đã nhắc rồi).
  kq as (
    select pc.nhan_su_id, l.id as lop_id, l.ten_lop, h.id as hs_id, h.ho_ten, b.ngay, k.trang_thai_nop,
           row_number() over (partition by pc.nhan_su_id, l.id, h.id order by b.ngay desc) as rn
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
      join hoc_sinh h on h.id = k.hoc_sinh_id
      join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
     where k.trang_thai_nop in ('nop_dung_han', 'nop_muon', 'khong_lam')
       and b.ngay >= public._ta_moc_cham_cong() and b.ngay < p_ngay
  ),
  canh as (
    select x.nhan_su_id, jsonb_agg(jsonb_build_object('ho_ten', x.ho_ten, 'ten_lop', x.ten_lop, 'loai', x.tt, 'ngays', x.ngays)
                                   order by x.tt, x.ten_lop, x.ho_ten) as canh_bao
      from (select nhan_su_id, ten_lop, ho_ten, max(trang_thai_nop) as tt, array_agg(ngay order by ngay) as ngays, max(ngay) as moi
              from kq where rn <= 2
             group by nhan_su_id, lop_id, ten_lop, hs_id, ho_ten
            having count(*) = 2 and min(trang_thai_nop) = max(trang_thai_nop)) x
     where x.tt in ('khong_lam', 'nop_muon') and x.moi >= p_ngay - 7
     group by x.nhan_su_id
  ),
  ds as (select d.nhan_su_id, n.ho_ten, l.tg_user_id
           from public._tg_ds_ta(p_ngay) d join nhan_su n on n.id = d.nhan_su_id
           left join tg_lien_ket l on l.nhan_su_id = d.nhan_su_id and l.den_at is null),
  thuong as (   -- việc không phải chấm công, gom theo loại; cùng lớp + cùng ngày gộp 1 mục kèm số (vd BTVN bù 2 em)
    select v.nhan_su_id, v.loai, min(v.nhan) as nhan, min(v.ngay_goc) as ngay_dau,
           jsonb_agg(jsonb_build_object('ten_lop', v.ten_lop, 'ngay_goc', v.ngay_goc, 'so_luong', v.so_luong, 'tre_ngay', v.tre_ngay)
                     order by v.ngay_goc, v.ten_lop) as muc
      from (select x.nhan_su_id, x.loai, min(x.nhan) as nhan, x.ten_lop, x.ngay_goc, sum(x.so_luong)::int as so_luong,
                   floor(extract(epoch from (((p_ngay + time '08:00')::timestamp at time zone 'Asia/Ho_Chi_Minh') - min(x.han))) / 86400)::int as tre_ngay
              from v x group by x.nhan_su_id, x.loai, x.ten_lop, x.ngay_goc) v where v.loai not in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
     group by v.nhan_su_id, v.loai
  ),
  cong as (
    select v.nhan_su_id,
           jsonb_build_object('so_buoi', count(*) filter (where v.loai = 'cong_buoi'),
                              'so_ca', count(*) filter (where v.loai = 'cong_ca'),
                              'so_bo_tro', count(*) filter (where v.loai = 'cong_bo_tro'),
                              'quen_checkout', count(*) filter (where v.loai = 'quen_checkout'),
                              'tu', min(v.ngay_goc), 'den', max(v.ngay_goc)) as cong
      from v where v.loai in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
     group by v.nhan_su_id
  ),
  pt as (       -- Phó khối (không có Phó ⇒ Trưởng) của các khối TA có việc, theo sơ đồ tổ chức (trừ chính TA đó)
    select x.nhan_su_id, jsonb_agg(distinct jsonb_build_object('ho_ten', n.ho_ten, 'tg_user_id', l.tg_user_id)) as phu_trach
      from (select distinct v.nhan_su_id, v.mon, v.khoi from v where v.khoi is not null) x
      join public._khoi_van_hanh(x.mon, x.khoi) pk on pk.nhan_su_id <> x.nhan_su_id
      join nhan_su n on n.id = pk.nhan_su_id and n.trang_thai = 'dang_lam'
      left join tg_lien_ket l on l.nhan_su_id = pk.nhan_su_id and l.den_at is null
     group by x.nhan_su_id
  ),
  ta as (
    select ds.nhan_su_id, ds.ho_ten, ds.tg_user_id,
           (select count(*) from v where v.nhan_su_id = ds.nhan_su_id) as so_viec,
           coalesce(pt.phu_trach, '[]'::jsonb) as phu_trach,
           coalesce((select jsonb_agg(jsonb_build_object('loai', t.loai, 'nhan', t.nhan, 'muc', t.muc) order by t.ngay_dau, t.loai)
                       from thuong t where t.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as nhom,
           cong.cong, coalesce(canh.canh_bao, '[]'::jsonb) as canh_bao,
           coalesce((select jsonb_agg(jsonb_build_object('ref_key', v.ref_key, 'loai', v.loai, 'nhan', v.nhan, 'ten_lop', v.ten_lop,
                                                          'khoi', v.khoi, 'mon', v.mon, 'ngay_goc', v.ngay_goc, 'han', v.han, 'so_luong', v.so_luong)
                                       order by v.ngay_goc, v.loai)
                       from v where v.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as viec
      from ds left join pt on pt.nhan_su_id = ds.nhan_su_id left join cong on cong.nhan_su_id = ds.nhan_su_id
      left join canh on canh.nhan_su_id = ds.nhan_su_id
  )
  select jsonb_build_object(
    'ngay', p_ngay,
    'ta', coalesce((select jsonb_agg(to_jsonb(ta) order by ta.ho_ten)
                      from ta where ta.so_viec > 0 or jsonb_array_length(ta.canh_bao) > 0), '[]'::jsonb),
    'sach', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.so_viec = 0 and jsonb_array_length(ta.canh_bao) = 0), '[]'::jsonb),
    'chua_noi', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.tg_user_id is null), '[]'::jsonb))
$function$;
