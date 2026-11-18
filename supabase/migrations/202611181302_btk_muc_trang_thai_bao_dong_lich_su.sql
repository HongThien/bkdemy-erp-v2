-- BỔ TRỢ — thông tin để trưởng khối / trưởng bộ môn / giám đốc nhìn MỘT lần rồi quyết (Thùy 18/11):
--   (1) Dashboard học tập, cột Bổ trợ: hiện MỨC (L1–L4) + trạng thái của em hiện tại — nháp / chờ trưởng bộ môn / bị trả lại / chờ bổ trợ / đã xong tuần này.
--   (2) Danh sách bổ trợ thêm 2 cột: BÁO ĐỘNG (chuông GV / TA trong tuần của đề xuất) · LỊCH SỬ BỔ TRỢ (các ca em có tên trong 2 tuần gần đây + kết quả).
-- Chi phí: mọi thứ tra theo ĐÚNG các em đang hiện (index buoi_hoc_hs(hoc_sinh_id) · canh_bao_yeu(hoc_sinh_id) · bai_test(buoi_hoc_id) · khoá chính mastery_luu_san);
--   KHÔNG quét lịch sử đo — "hết yếu" đọc bảng mastery LƯU SẴN (mastery_luu_san, cấp dạng), tức mức HIỆN TẠI của các dạng đã dạy trong ca.
--   Mức của ca: ca sau giờ = L1; ca khối = mức của đề xuất đã mở case (bo_tro_de_xuat.case_id).
-- Màn dùng chung cho 3 ghế (DanhSachBoTro · DashboardHocTapScreen) ⇒ trưởng bộ môn / giám đốc thấy y hệt, khác phạm vi.

create index if not exists bo_tro_yeu_hs_mon_idx on public.bo_tro_yeu (hoc_sinh_id, mon, created_at desc);
create index if not exists bo_tro_de_xuat_case_idx on public.bo_tro_de_xuat (case_id) where case_id is not null;

-- Trạng thái bổ trợ HIỆN TẠI của một em × môn (cột Bổ trợ ở Dashboard học tập). Ưu tiên: đề xuất đang sống > case đang mở > case xong trong tuần này.
create or replace function public._btk_trang_thai_hs(p_hs uuid, p_mon text)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  select coalesce(
    (select jsonb_build_object('id', dx.id, 'tt', dx.trang_thai, 'muc', dx.muc) from bo_tro_de_xuat dx
      where dx.hoc_sinh_id = p_hs and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
    (select jsonb_build_object('id', y.id, 'tt', 'dang_bo_tro',
              'muc', coalesce((select dx.muc from bo_tro_de_xuat dx where dx.case_id = y.id order by dx.duyet_at desc nulls last limit 1), y.muc::int),
              -- đã có ca xếp cho em chưa (ca chưa huỷ, từ hôm nay trở đi) — để phân biệt "chờ xếp ca" với "đã có lịch"
              'ca_ngay', (select min(b.ngay) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                           where hh.bo_tro_yeu_id = y.id and b.trang_thai <> 'huy' and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date))
       from bo_tro_yeu y
      where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai in ('dang_xu', 'nhe_mo')
      order by (y.trang_thai = 'dang_xu') desc, y.created_at desc limit 1),
    (select jsonb_build_object('id', y.id, 'tt', 'xong',
              'muc', coalesce((select dx.muc from bo_tro_de_xuat dx where dx.case_id = y.id order by dx.duyet_at desc nulls last limit 1), y.muc::int),
              'at', y.hoan_thanh_at)
       from bo_tro_yeu y
      where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai in ('hoan_thanh', 'nhe_xong') and y.ket_qua not in ('bo', 'het_han')
        and y.hoan_thanh_at >= (date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh')   -- mức thuộc lượt chốt tuần: hết tuần về L0
      order by y.hoan_thanh_at desc limit 1));
$fn$;

-- Lịch sử bổ trợ 2 TUẦN gần đây (tuần trước + tuần này, thứ Hai → Chủ nhật giờ VN) của một em × môn: mỗi ca em có tên một dòng.
--   diem_danh null = ca đã xếp, chưa diễn ra / chưa điểm danh. so_dang = dạng đã dạy trong ca; het_yeu / con_yeu = mức HIỆN TẠI của các dạng đó (bảng lưu sẵn);
--   test = câu đúng / tổng của bài test cuối ca.
create or replace function public._btk_lich_su_hs(p_hs uuid, p_mon text)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  with moc as (select date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date as t2),
  ca as (
    select b.id as buoi, b.ngay, b.gio_bat_dau, b.loai, hh.diem_danh, y.id as case_id,
           case when b.loai = 'bo_tro_nhe' then 1
                else coalesce((select dx.muc from bo_tro_de_xuat dx where dx.case_id = y.id order by dx.duyet_at desc nulls last limit 1), y.muc::int) end as muc
      from buoi_hoc_hs hh
      join buoi_hoc b on b.id = hh.buoi_hoc_id
      join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id and y.mon = p_mon
      cross join moc
     where hh.hoc_sinh_id = p_hs and b.loai in ('bo_tro_yeu', 'bo_tro_nhe') and b.trang_thai <> 'huy'
       and b.ngay >= moc.t2 - 7 and b.ngay < moc.t2 + 7
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'buoi_id', ca.buoi, 'ngay', ca.ngay, 'tuan', date_trunc('week', ca.ngay)::date, 'loai', ca.loai, 'muc', ca.muc, 'diem_danh', ca.diem_danh,
           'so_dang', d.so_dang, 'het_yeu', d.het_yeu, 'con_yeu', d.con_yeu, 'test_dung', t.dung, 'test_tong', t.tong)
         order by ca.ngay, ca.gio_bat_dau), '[]'::jsonb)
    from ca
    cross join lateral (
      select count(*)::int as so_dang,
             count(*) filter (where m.muc is not null and m.muc <> 'yeu')::int as het_yeu,
             count(*) filter (where m.muc = 'yeu')::int as con_yeu
        from bo_tro_yeu_dang x
        left join mastery_luu_san m on m.hoc_sinh_id = p_hs and m.btvn and m.cap = 'dang' and m.nut = x.ma_dang
       where x.bo_tro_yeu_id = ca.case_id and x.day_buoi_id = ca.buoi) d
    cross join lateral (
      select count(*)::int as tong, count(*) filter (where blc.verdict = 'correct')::int as dung
        from bai_test bt
        join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = p_hs
        join bai_lam_cau blc on blc.bai_lam_id = bl.id
       where bt.buoi_hoc_id = ca.buoi and bt.loai = 'bo_tro_test') t;
$fn$;

-- Báo động (chuông GV / TA) của một em trong TUẦN chứa mốc p_moc (thứ Hai → Chủ nhật giờ VN), đúng môn (chuông không gắn buổi thì tính cho mọi môn — như Dashboard).
create or replace function public._btk_bao_dong_tuan(p_hs uuid, p_mon text, p_moc timestamptz)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  with moc as (select date_trunc('week', p_moc at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh' as tu)
  select coalesce(jsonb_agg(jsonb_build_object('at', cb.created_at, 'nguon', cb.nguon, 'ghi_chu', nullif(btrim(cb.ghi_chu), ''),
                                               'nguoi', ns.ho_ten, 'lop', bl.ten_lop) order by cb.created_at desc), '[]'::jsonb)
    from canh_bao_yeu cb
    cross join moc
    left join buoi_hoc b on b.id = cb.buoi_hoc_id
    left join lop bl on bl.id = b.lop_id
    left join nhan_su ns on ns.id = cb.created_by
   where cb.hoc_sinh_id = p_hs and cb.created_at >= moc.tu and cb.created_at < moc.tu + interval '7 days'
     and (bl.mon is null or bl.mon = p_mon);
$fn$;

-- hàm nội bộ: chỉ fn_dbht_bang / fn_btk_ds (security definer, đã có cổng phạm vi) gọi
revoke all on function public._btk_trang_thai_hs(uuid, text) from public, authenticated;
revoke all on function public._btk_lich_su_hs(uuid, text) from public, authenticated;
revoke all on function public._btk_bao_dong_tuan(uuid, text, timestamptz) from public, authenticated;

-- fn_dbht_bang: chỉ đổi CTE bt (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer DEFAULT 4, p_cap text DEFAULT 'chuyen_de'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
       and public._mon_duoc_xem(p_mon)   -- 16/11: quyền môn (fn_mon_cua_toi)
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  ca as (select case p_cap when 'nhom' then 'nhom' when 'chu_de' then 'chu_de' else 'chuyen_de' end as c),
  -- ⭐ 10/11 (Thùy): đọc BẢNG CHỤP mastery theo lần (em bẩn mới tính trực tiếp) — một lượt cho cấp đang xem + cấp nhóm (cột Nhóm yếu)
  m as materialized (
    select x.* from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), (select array_agg(hoc_sinh_id) from hs), true,
                                                  null, null, array[(select c from ca), 'nhom'], 5, 5, 3) x
     where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and x.score is not null
    union all   -- 13/11: môn một vùng (KHTN · Vật lý · Hóa học) — cache theo môn
    select x.* from public._mastery_mon_doc(p_mon, (select array_agg(hoc_sinh_id) from hs), true, array[(select c from ca), 'nhom']) x
     where x.score is not null
  ),
  o as (select m.hoc_sinh_id, m.nut as cot, round(100 * m.score)::int as p, m.n, m.muc, m.tin from m where m.cap = (select c from ca)),
  ny as (select m.hoc_sinh_id, count(*) filter (where m.muc = 'yeu')::int as nhom_yeu from m where m.cap = 'nhom' group by m.hoc_sinh_id),
  cot as (select distinct o.cot from o),
  cot_ten as (
    select cot.cot as ma,
           coalesce(case when hb.ma_bai is not null then 'Hình · ' || hb.ten_bai
                         when p_cap = 'nhom' then nb.ten when p_cap = 'chu_de' then cd.ten else ch.ten end,
                    case when p_cap = 'nhom' then vn.ten when p_cap = 'chu_de' then vcd.ten else vch.ten end, cot.cot) as ten,
           coalesce(case when p_cap = 'nhom' then coalesce(ch.ten, cd.ten) when hb.ma_bai is not null and p_cap <> 'chu_de' then cd.ten end,
                    case when p_cap = 'nhom' then coalesce(vch.ten, vcd.ten) end) as cha,
           (hb.ma_bai is not null or cd.nhanh in ('hinh', 'hinh_hoc', 'hinh_luyen'))::int as t0,
           coalesce(cd.thu_tu, vcd.thu_tu, 0) as t1, coalesce(bo.thu_tu, vo.thu_tu, 0) as t2, coalesce(nb.thu_tu, hb.thu_tu, vn.thu_tu, 0) as t3
      from cot
      left join hinh_hoc_bai hb on hb.ma_bai = cot.cot
      left join dai_bdm_nhom nb on p_cap = 'nhom' and nb.id = cot.cot
      left join dai_bdm_chuyen_de ch on ch.id = case when p_cap = 'nhom' then nb.chuyen_de_id when p_cap = 'chuyen_de' then cot.cot end
      left join lateral (select o2.chu_de_id, o2.thu_tu from dai_bdm_o o2 join dai_bdm_chu_de c2 on c2.id = o2.chu_de_id
                          where ch.id is not null and o2.chuyen_de_id = ch.id and (nb.id is null or o2.chu_de_id = nb.chu_de_id)
                          order by c2.thu_tu limit 1) bo on true
      left join dai_bdm_chu_de cd on cd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, hb.chu_de_id, nb.chu_de_id, bo.chu_de_id)
      -- 13/11: môn một vùng — tên/thứ tự từ cây bản đồ mới của ĐÚNG môn (view có cột mon)
      left join tl_bdm_nhom_v vn on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and p_cap = 'nhom' and vn.mon = p_mon and vn.id = cot.cot
      left join tl_bdm_chuyen_de_v vch on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and vch.mon = p_mon
                                       and vch.id = case when p_cap = 'nhom' then vn.chuyen_de_id when p_cap = 'chuyen_de' then cot.cot end
      left join lateral (select o3.chu_de_id, o3.thu_tu from tl_bdm_o_v o3 join tl_bdm_chu_de_v c3 on c3.id = o3.chu_de_id and c3.mon = p_mon
                          where o3.mon = p_mon and vch.id is not null and o3.chuyen_de_id = vch.id and (vn.id is null or o3.chu_de_id = vn.chu_de_id)
                          order by c3.thu_tu limit 1) vo on true
      left join tl_bdm_chu_de_v vcd on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and vcd.mon = p_mon
                                    and vcd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, vn.chu_de_id, vo.chu_de_id)
  ),
  bd as (   -- báo động (chuông GV/TA) 30 ngày, đúng môn, chưa có quyết định bổ trợ nào sau chuông
    select cb.hoc_sinh_id, count(*)::int as so, max(cb.created_at) as moi_nhat,
           (array_agg(coalesce(nullif(btrim(cb.ghi_chu), ''), cb.nguon) order by cb.created_at desc))[1] as ghi_chu
      from canh_bao_yeu cb left join buoi_hoc b on b.id = cb.buoi_hoc_id left join lop bl on bl.id = b.lop_id
     where cb.hoc_sinh_id in (select hoc_sinh_id from hs) and cb.created_at >= now() - interval '30 days' and (bl.mon is null or bl.mon = p_mon)
       and not exists (select 1 from bo_tro_de_xuat dx where dx.hoc_sinh_id = cb.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai <> 'huy' and dx.tao_at >= cb.created_at)
     group by cb.hoc_sinh_id
  ),
  bt as (   -- 18/11: mức L1–L4 + trạng thái hiện tại (đề xuất sống > case mở > case xong tuần này)
    select hs.hoc_sinh_id, public._btk_trang_thai_hs(hs.hoc_sinh_id, p_mon) as j from hs
  )
  select jsonb_build_object(
    'tu', null, 'ngoai_quyen', not public._mon_duoc_xem(p_mon),
    'tinh_at', (select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id in (select hoc_sinh_id from hs)),
    'co_do', (public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' or p_mon = any(public._mastery_mon_ds())),   -- 13/11: môn đã đo theo bản đồ mới chưa
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', ma, 'ten', ten, 'cha', cha) order by t0, t1, t2, t3, ten) from cot_ten), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', hs.hoc_sinh_id, 'ten', x.ho_ten, 'lop_id', hs.lop_id, 'lop', hs.ten_lop,
              'nhom_yeu', ny.nhom_yeu, 'dang_yeu', dy.so_dang_yeu,
              'bao_dong', case when bd.so > 0 then jsonb_build_object('so', bd.so, 'at', bd.moi_nhat, 'ghi_chu', bd.ghi_chu) end,
              'bt', bt.j,
              'o', coalesce((select jsonb_object_agg(o.cot, jsonb_build_object('p', o.p, 'n', o.n, 'muc', o.muc, 'tin', o.tin, 'd', null, 'dk', false))
                               from o where o.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten)
            from hs join hoc_sinh x on x.id = hs.hoc_sinh_id
            left join ny on ny.hoc_sinh_id = hs.hoc_sinh_id
            left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = hs.hoc_sinh_id and dy.mon = p_mon
            left join bd on bd.hoc_sinh_id = hs.hoc_sinh_id
            left join bt on bt.hoc_sinh_id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$function$;

-- fn_btk_ds: thêm 2 khoá bao_dong · lich_su (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_btk_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_so_ngay integer DEFAULT 14)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  if p_khoi is not null and not (public._btk_la_tk(p_mon, p_khoi) or public._btk_la_tbm(p_mon, p_khoi)) then
    raise exception 'Không có quyền với khối % môn %', p_khoi, p_mon using errcode = '42501';
  end if;
  if p_khoi is null and public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ trưởng bộ môn xem mọi khối.' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', dx.id, 'hoc_sinh_id', dx.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'lop', l.ten_lop, 'khoi', dx.khoi,
           'nhom', dx.nhom, 'muc', dx.muc, 'uu_tien', dx.uu_tien, 'ghi_chu', dx.ghi_chu, 'trang_thai', dx.trang_thai,
           'ly_do_tra', dx.ly_do_tra, 'so_dang', dx.so_dang, 'case_id', dx.case_id,
           'case_tt', y.trang_thai, 'case_ket_qua', y.ket_qua,
           'tao_at', dx.tao_at, 'tao_ten', nt.ho_ten, 'gui_at', dx.gui_at, 'gui_ten', ng.ho_ten, 'duyet_at', dx.duyet_at, 'duyet_ten', nd.ho_ten,
           'dang_yeu', dy.so_dang_yeu,
           'bao_dong', public._btk_bao_dong_tuan(dx.hoc_sinh_id, dx.mon, dx.tao_at),   /* 18/11: chuông trong tuần của đề xuất */
           'lich_su', public._btk_lich_su_hs(dx.hoc_sinh_id, dx.mon))                     /* 18/11: ca bổ trợ 2 tuần gần đây + kết quả */
         order by dx.khoi, case dx.trang_thai when 'tra_lai' then 0 when 'nhap' then 1 when 'cho_duyet' then 2 else 3 end, dx.uu_tien desc, hs.ho_ten), '[]'::jsonb)
    into v
    from bo_tro_de_xuat dx
    join hoc_sinh hs on hs.id = dx.hoc_sinh_id
    left join lop l on l.id = dx.lop_id
    left join bo_tro_yeu y on y.id = dx.case_id
    left join nhan_su nt on nt.id = dx.tao_boi left join nhan_su ng on ng.id = dx.gui_boi left join nhan_su nd on nd.id = dx.duyet_boi
    left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = dx.hoc_sinh_id and dy.mon = dx.mon
   where dx.mon = p_mon and (p_khoi is null or dx.khoi = p_khoi)
     and (p_khoi is not null or public._btk_la_tbm(dx.mon, dx.khoi))
     and (dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai')
          or (dx.trang_thai = 'da_duyet' and dx.duyet_at >= now() - make_interval(days => greatest(1, least(coalesce(p_so_ngay, 14), 90)))));
  return v;
end $function$;
