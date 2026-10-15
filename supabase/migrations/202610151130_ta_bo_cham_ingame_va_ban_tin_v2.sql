-- ============================================================================
-- 202610151130 — ta_bo_cham_ingame_va_ban_tin_v2
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì) — Thùy 15/10 sau khi xem bản xem trước bản tin:
--   ① "Chấm bài trên lớp" ra khỏi vai TA (chỉ còn của GV) — fn_viec_buoi_thuong. Áp từ 01/10/2026: tháng 9 trở về
--      giữ nguyên (fn_ta_viec_thang / hạng / thưởng tháng cũ không bị viết lại). 3 đề xuất gậy ĐANG CHỜ của TA cho
--      việc này (buổi từ 01/10) ⇒ rút (bo_qua, ghi lý do). Gậy đã đánh trước đó KHÔNG đụng.
--   ② "Duyệt HS báo sai" là việc của team học thuật ⇒ bỏ khỏi việc tồn của TA (_tg_viec_ton).
--   ③ Bản tin chỉ xoay quanh ET · BTVN · chấm công (mọi loại) và chỉ việc từ tháng 10 (mốc chấm công ERP).
--      "Chấm công mọi loại" ⇒ _ta_buoi_thieu_cong thêm buổi bổ trợ (bù · yếu · đuổi) đã diễn ra chưa ai ghi công
--      — màn "Thiếu công" của Trang cũng thấy (cùng 1 luật). loai trả về = mã loại việc (bo_tro_bu/yeu/duoi).
--   ④ Cảnh báo BTVN cho TA: em 2 bài liên tiếp không làm / 2 lần liên tiếp nộp muộn.
--
-- MẤT GÌ (Luật xoá): không xoá gì. 4 hàm viết lại thân (cùng chữ ký). gay_de_xuat: đổi trạng thái 'cho' → 'bo_qua'
--   cho đúng các đề xuất "chấm bài trên lớp" của TA (buổi từ 01/10) — trigger log_gay_de_xuat ghi vết.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_viec_buoi_thuong(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date, p_tat_ca boolean DEFAULT false)
 RETURNS TABLE(nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, vai text, tab text, dong_at timestamp with time zone, han timestamp with time zone, et_online boolean, ref_key text)
 LANGUAGE sql
 STABLE
AS $function$
  with me as (select public.current_nhan_su_id() as id),
  b as (
    select bh.id, bh.lop_id, l.ten_lop, l.khoi, l.mon, bh.ngay, bh.gio_bat_dau,
           bh.ingame_dong_at, bh.et_dong_at, bh.danh_gia_xong_at, bh.btvn_dong_at, bh.mt_dong_at,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt,
           exists (select 1 from bai_test bt where bt.lop_id = bh.lop_id and bt.ngay = bh.ngay and bt.loai = 'et') as et_online
    from buoi_hoc bh
    join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and (p_tu is null or bh.ngay >= p_tu)
      and (p_den is null or bh.ngay <= p_den)
  ),
  thuong as (
    select pc.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           pc.vai_tro as vai, t.tab, b.gio_bat_dau, b.et_online,
           case t.tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at
                      when 'danhgia' then b.danh_gia_xong_at else b.btvn_dong_at end as dong_at,
           case pc.vai_tro when 'gv' then 1 else 2 end as uu_tien
    from b
    join phan_cong_lop pc on pc.lop_id = b.lop_id
    cross join lateral (
      select unnest(case pc.vai_tro when 'gv' then array['danhgia', 'ingame']
                        -- Thùy 15/10: "Chấm bài trên lớp" ra khỏi TA (chỉ GV). Từ 01/10/2026; tháng trước giữ nguyên (hiệu suất/thưởng đã tính).
                        when 'tg' then case when b.ngay >= date '2026-10-01' then array['et', 'btvn'] else array['ingame', 'et', 'btvn'] end
                        else array['ingame', 'et', 'btvn'] end) as tab
    ) t
    where not b.co_mt
  ),
  mt_tk as (
    select pk.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'tk'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 0 as uu_tien
    from b
    join phan_cong_khoi pk on pk.khoi = b.khoi and pk.mon = b.mon
    where b.co_mt
  ),
  mt_gv as (
    select pc.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'gv'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 1 as uu_tien
    from b
    join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.vai_tro = 'gv'
    where b.co_mt
      and not exists (select 1 from mt_tk k where k.buoi_id = b.id)
      and (pc.la_chinh or not exists (
            select 1 from phan_cong_lop p2 where p2.lop_id = b.lop_id and p2.vai_tro = 'gv' and p2.la_chinh))
  ),
  tat_ca as (
    select * from thuong union all select * from mt_tk union all select * from mt_gv
  ),
  dedup as (
    select distinct on (nhan_su_id, buoi_id, tab) *
    from tat_ca
    order by nhan_su_id, buoi_id, tab, uu_tien
  )
  select d.nhan_su_id, d.buoi_id, d.lop_id, d.ten_lop, d.ngay, d.vai, d.tab, d.dong_at,
         public.fn_han_viec(d.lop_id, d.ngay, d.gio_bat_dau, d.tab) as han, d.et_online,
         ('vh:' || d.buoi_id::text || '|' || d.tab || '|' || d.nhan_su_id::text) as ref_key
  from dedup d, me
  where p_tat_ca or d.nhan_su_id = me.id
$function$;

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
  union all
  -- Buổi bổ trợ TA đứng lớp đã diễn ra, có em có mặt, chưa ai ghi công; buổi nằm trong ca trực của chính người đó thì ca trực đã bao.
  select case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end,
         b.ngay, l.id, (case b.loai when 'bu' then 'Buổi bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' else 'Bổ trợ đuổi' end) || coalesce(' ' || l.ten_lop, ''),
         b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, n.id, n.ho_ten
    from buoi_hoc b
    join nhan_su n on n.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
   where b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.diem_danh = 'co_mat')
     and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and n.id in (c.nhan_su_id, c.nhan_su_2_id))
     and not exists (select 1 from ta_cong_viec cv where cv.buoi_hoc_id = b.id and cv.trang_thai <> 'tu_choi')
   order by 2, 5 nulls last;
end $$;

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
  -- (7) Chấm công: buổi/ca chưa ghi công (lõi _ta_buoi_thieu_cong) + ca quên checkout
  cong as (
    select x.nhan_su_id as ns,
           'cg:' || coalesce(x.buoi_hoc_id, x.ca_bo_tro_id) || '|' || x.nhan_su_id,
           case x.loai when 'buoi' then 'cong_buoi' when 'ca' then 'cong_ca' else 'cong_bo_tro' end,
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
    union all select * from btvn_bu union all select * from cong
  )
  select distinct on (t.ref_key) t.*
  from tat_ca t join nhan_su n on n.id = t.nhan_su_id and n.trang_thai = 'dang_lam'
  order by t.ref_key
$$;

create or replace function public._tg_ban_tin_du_lieu(p_ngay date) returns jsonb
language sql stable security definer set search_path = public as $$
  with v as (select * from public._tg_viec_ton(p_ngay) x
              where x.loai in ('et', 'btvn', 'bu_et', 'btvn_bu', 'cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
                and x.ngay_goc >= public._ta_moc_cham_cong()),   -- Thùy 15/10: chỉ ET · BTVN · chấm công, chỉ từ tháng 10
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
           jsonb_agg(jsonb_build_object('ten_lop', v.ten_lop, 'ngay_goc', v.ngay_goc, 'so_luong', v.so_luong)
                     order by v.ngay_goc, v.ten_lop) as muc
      from (select x.nhan_su_id, x.loai, min(x.nhan) as nhan, x.ten_lop, x.ngay_goc, sum(x.so_luong)::int as so_luong
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
  pt as (       -- người phụ trách các khối mà TA có việc (trừ chính TA đó)
    select x.nhan_su_id, jsonb_agg(distinct jsonb_build_object('ho_ten', n.ho_ten, 'tg_user_id', l.tg_user_id)) as phu_trach
      from (select distinct v.nhan_su_id, v.mon, v.khoi from v where v.khoi is not null) x
      join phan_cong_khoi pk on pk.mon = x.mon and pk.khoi = x.khoi and pk.nhan_su_id <> x.nhan_su_id
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
$$;

update gay_de_xuat g set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null,
       ly_do_bo_qua = 'Thùy 15/10: chấm bài trên lớp không còn là việc của TA (từ 01/10/2026)'
  from buoi_hoc b
 where g.trang_thai = 'cho' and g.nguon = 'vanhanh' and g.ref_key ~ '^vh:[0-9a-f-]{36}[|]ingame[|]'
   and b.id = split_part(substr(g.ref_key, 4), '|', 1)::uuid and b.ngay >= date '2026-10-01'
   and exists (select 1 from phan_cong_lop pc where pc.lop_id = b.lop_id and pc.nhan_su_id = split_part(g.ref_key, '|', 3)::uuid and pc.vai_tro = 'tg')
   and not exists (select 1 from phan_cong_lop pc where pc.lop_id = b.lop_id and pc.nhan_su_id = split_part(g.ref_key, '|', 3)::uuid and pc.vai_tro = 'gv');
