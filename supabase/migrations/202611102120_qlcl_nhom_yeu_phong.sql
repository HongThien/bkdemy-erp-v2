-- ============================================================================
-- 202611102120 — qlcl_nhom_yeu_phong
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 10/11, qua phiên "Hoàn thiện phòng làm việc"): "cái này ở phòng trưởng khối ko hiện dạng yếu mà hiện Nhóm yếu.
--   Chỗ học sinh thêm 2 cột: 3 nhóm yếu trở lên. 2 nhóm yếu và 1 nhóm yếu — đếm theo từng cột nhé".
-- Đọc từ BẢNG CHỤP sẵn có, không tính mastery lúc mở (CLAUDE.md §2.0 "số không realtime thì tính sẵn"):
--   hiện tại = dang_yeu_hien_tai · đầu tuần = dang_yeu_dau_tuan (tuần này). Mỗi bảng đã lưu danh sách dạng yếu của em (`dang`);
--   dạng thuộc đúng 1 nhóm (dai_bdm_dang_bai.nhom_id · Hình–Học: bài = nhóm) ⇒ số nhóm yếu của em = số nhóm khác nhau trong danh sách.
--   Từ 10/11 dạng yếu = "dạng chưa đạt của NHÓM yếu" (bổ trợ theo nhóm, mig 202611101521) ⇒ đếm lại đúng số nhóm yếu.
--   Ảnh đầu tuần chụp trước luật mới (09/11) ⇒ tuần này đầu tuần = số nhóm CÓ dạng yếu; từ tuần sau cùng luật.
-- Hàm MỚI, không đổi fn_qlcl_tong_quan (Sảnh vẫn hiện dạng yếu như cũ). Cùng phạm vi (fn_pham_vi_cua_toi) + cùng tập em (_qlcl_hs_cua_o).
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì — chỉ thêm 2 hàm.
-- ============================================================================

-- số nhóm khác nhau trong 1 danh sách dạng yếu (jsonb [{ma_dang,…}]); dạng không quy được nhóm thì tính là nhóm của chính nó
create or replace function public._dy_so_nhom(p_dang jsonb)
returns integer language sql stable set search_path to 'public' as $$
  select count(distinct coalesce(hh.ma_bai, db.nhom_id, e->>'ma_dang'))::int
    from jsonb_array_elements(coalesce(p_dang, '[]'::jsonb)) e
    left join hinh_hoc_bai hh on hh.ma_bai = e->>'ma_dang'
    left join dai_bdm_dang_bai db on db.id = e->>'ma_dang'
$$;
revoke execute on function public._dy_so_nhom(jsonb) from public, anon;

create or replace function public.fn_qlcl_nhom_yeu()
returns table(mon text, khoi text, so_hs integer,
              so_nhom_yeu integer, hs_nhom_3 integer, hs_nhom_2 integer, hs_nhom_1 integer,
              dau_tuan_nhom_yeu integer, dau_tuan_hs_nhom_3 integer, dau_tuan_hs_nhom_2 integer, dau_tuan_hs_nhom_1 integer)
language sql stable security definer set search_path to 'public' as $$
  with o as (select p.mon, p.khoi from public.fn_pham_vi_cua_toi() p where public.la_thanh_vien()),
  ht as (   -- hiện tại: mỗi em 1 số nhóm yếu
    select o.mon, o.khoi, h.hoc_sinh_id, public._dy_so_nhom(d.dang) as n
      from o cross join lateral public._qlcl_hs_cua_o(o.mon, o.khoi) h
      join dang_yeu_hien_tai d on d.mon = o.mon and d.hoc_sinh_id = h.hoc_sinh_id
  ),
  dt as (   -- đầu tuần: ảnh chụp tuần này của ô
    select o.mon, o.khoi, z.hoc_sinh_id, public._dy_so_nhom(z.dang) as n
      from o join dang_yeu_dau_tuan z on z.tuan = public._qlcl_tuan_nay() and z.mon = o.mon and z.khoi = o.khoi
  ),
  co_anh as (select distinct z.mon from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay())
  select o.mon, o.khoi,
         (select count(*)::int from public._qlcl_hs_cua_o(o.mon, o.khoi)),
         (select coalesce(sum(n), 0)::int from ht where ht.mon = o.mon and ht.khoi = o.khoi),
         (select count(*)::int from ht where ht.mon = o.mon and ht.khoi = o.khoi and n >= 3),
         (select count(*)::int from ht where ht.mon = o.mon and ht.khoi = o.khoi and n = 2),
         (select count(*)::int from ht where ht.mon = o.mon and ht.khoi = o.khoi and n = 1),
         case when o.mon in (select mon from co_anh) then (select coalesce(sum(n), 0)::int from dt where dt.mon = o.mon and dt.khoi = o.khoi) end,
         case when o.mon in (select mon from co_anh) then (select count(*)::int from dt where dt.mon = o.mon and dt.khoi = o.khoi and n >= 3) end,
         case when o.mon in (select mon from co_anh) then (select count(*)::int from dt where dt.mon = o.mon and dt.khoi = o.khoi and n = 2) end,
         case when o.mon in (select mon from co_anh) then (select count(*)::int from dt where dt.mon = o.mon and dt.khoi = o.khoi and n = 1) end
    from o
   order by o.mon, o.khoi
$$;
revoke execute on function public.fn_qlcl_nhom_yeu() from public, anon;
grant execute on function public.fn_qlcl_nhom_yeu() to authenticated;
