-- fn_dbht_bang là hàm chạy theo quyền NGƯỜI GỌI ⇒ không được dựa vào hàm nội bộ (tên _) mà người dùng phải có quyền gọi (cổng check:kien-truc, K1).
-- Đưa logic trạng thái bổ trợ (mức L1–L4 · đề xuất sống > case mở > case xong tuần này) vào THẲNG CTE bt — cùng nội dung với _btk_trang_thai_hs của mig 202611181302 —
-- rồi thu lại quyền gọi hàm phụ đã mở ở mig 202611181305. Hàm phụ _btk_trang_thai_hs từ nay KHÔNG còn ai gọi (để nguyên, chưa xoá — xoá cần lệnh riêng).
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
    select hs.hoc_sinh_id,
           coalesce(
          (select jsonb_build_object('id', dx.id, 'tt', dx.trang_thai, 'muc', dx.muc) from bo_tro_de_xuat dx
            where dx.hoc_sinh_id = hs.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
          (select jsonb_build_object('id', y.id, 'tt', 'dang_bo_tro',
                    'muc', coalesce((select dx.muc from bo_tro_de_xuat dx where dx.case_id = y.id order by dx.duyet_at desc nulls last limit 1), y.muc::int),
                    -- đã có ca xếp cho em chưa (ca chưa huỷ, từ hôm nay trở đi) — để phân biệt "chờ xếp ca" với "đã có lịch"
                    'ca_ngay', (select min(b.ngay) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                                 where hh.bo_tro_yeu_id = y.id and b.trang_thai <> 'huy' and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date))
             from bo_tro_yeu y
            where y.hoc_sinh_id = hs.hoc_sinh_id and y.mon = p_mon and y.trang_thai in ('dang_xu', 'nhe_mo')
            order by (y.trang_thai = 'dang_xu') desc, y.created_at desc limit 1),
          (select jsonb_build_object('id', y.id, 'tt', 'xong',
                    'muc', coalesce((select dx.muc from bo_tro_de_xuat dx where dx.case_id = y.id order by dx.duyet_at desc nulls last limit 1), y.muc::int),
                    'at', y.hoan_thanh_at)
             from bo_tro_yeu y
            where y.hoc_sinh_id = hs.hoc_sinh_id and y.mon = p_mon and y.trang_thai in ('hoan_thanh', 'nhe_xong') and y.ket_qua not in ('bo', 'het_han')
              and y.hoan_thanh_at >= (date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh')   -- mức thuộc lượt chốt tuần: hết tuần về L0
            order by y.hoan_thanh_at desc limit 1)) as j
      from hs
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

revoke execute on function public._btk_trang_thai_hs(uuid, text) from authenticated;
