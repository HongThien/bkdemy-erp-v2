-- ============================================================================
-- 202610261929 — duoi_tach_ma_cu_sang_dang_bai
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 ("Có. Đổi đi") cho 51 dòng mục tiêu đuổi còn mã cũ sau mig 202610261821 (mã cũ ứng ≥2 dạng bài): TÁCH mỗi mã cũ
--   thành TOÀN BỘ các dạng bài mà câu của nó quy về (câu còn sống + câu em đã làm, cùng đường _do_o_bdm của mastery) — mục tiêu
--   đuổi là phạm vi kiến thức GV chọn nên lấy đủ phạm vi, không chỉ phần em đã làm. Trạng thái chép sang từng dạng bài như mig
--   202610241400 tách dòng bổ trợ yếu (dạng cũ đã xong ⇒ các dạng bài của nó đều xong; đã đọc lý thuyết / TA mở tay cũng chép).
--   Dòng gốc nhận dạng bài đầu, dòng thêm cho phần còn lại; mọi dòng mang mã cũ ở ma_dang_cu. Câu bài htd_luyen/htd_test của em
--   đổi CÙNG lượt về dạng bài của CHÍNH câu đó (khớp dạng đợt ↔ dạng bài làm).
--   Khoá: KHÔNG ghi đè, không gộp, không xoá dòng nào —
--     · dạng bài đã có sẵn trong đợt (vd từ mig 202610261821) hoặc đã được mã cũ khác (đứng trước theo mã) của cùng đợt nhận ⇒ không thêm
--       dòng trùng (đợt vẫn có dạng bài đó, một dòng). Mã cũ không còn dạng bài nào để nhận ⇒ GIỮ mã cũ cả đơn vị.
--     · em đã có dòng tiến trình (hoc_tu_dau_dang) của mã cũ mà một dạng bài đích đã có dòng tiến trình khác (hoặc mã cũ khác của em
--       cũng có tiến trình và cùng đích) ⇒ GIỮ mã cũ cả đơn vị (không đè trạng thái thật).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — UPDATE ma_dang (bản cũ lưu ở ma_dang_cu) + INSERT dòng tách; không delete/drop.
-- ============================================================================

-- dòng mục tiêu của đợt ĐANG ĐUỔI, khối chạy bản đồ mới theo registry, còn mã dạng bản đồ cũ Đại/HGT, chưa từng quy
create temp table _dd on commit drop as
select bdd.id, bdd.bo_tro_duoi_id as dot, bd.hoc_sinh_id as hs, l.mon, bdd.ma_dang as cu
  from bo_tro_duoi_dang bdd join bo_tro_duoi bd on bd.id = bdd.bo_tro_duoi_id join lop l on l.id = bd.lop_id
 where bd.trang_thai = 'can_duoi' and bdd.ma_dang not like 'NDB%' and bdd.ma_dang_cu is null
   and 'bdm' = any(public._kho_ds_nhanh_khoi(l.mon, l.khoi))
   and (exists (select 1 from dai_ban_do b where b.ma_dang = bdd.ma_dang) or exists (select 1 from hgt_ban_do b where b.ma_dang = bdd.ma_dang));

-- đơn vị = (em × môn × mã cũ): t = mọi dạng bài mà câu còn sống + câu em đã làm của mã cũ quy về
create temp table _u on commit drop as
select u.hs, u.mon, u.cu,
       (select array_agg(distinct k order by k) from (
          select public._do_o_bdm(q.ma_cau, u.cu) as k from dai_cau_hoi q where q.dang_chinh = u.cu and q.xoa_at is null
          union select public._do_o_bdm(q.ma_cau, u.cu) from hgt_cau_hoi q where q.dang_chinh = u.cu
          union select public._do_o_bdm(btc.ma_cau, u.cu)
                  from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
                 where bt.hoc_sinh_id = u.hs and bt.mon = u.mon and bt.loai in ('htd_luyen', 'htd_test')
                   and btc.ma_dang = u.cu and btc.ma_cau is not null) z
         where k like 'NDB%') as t,
       (select h.id from hoc_tu_dau_dang h where h.hoc_sinh_id = u.hs and h.mon = u.mon and h.ma_dang = u.cu) as htd_id,
       true as ok
  from (select distinct hs, mon, cu from _dd) u;
update _u set ok = false where cardinality(t) is null or cardinality(t) < 2;   -- 0–1 đích đã do mig 202610261821 xử

-- khoá tiến trình: có dòng tiến trình mà đích đụng tiến trình khác ⇒ giữ cũ
update _u u set ok = false
 where u.ok and u.htd_id is not null
   and (exists (select 1 from hoc_tu_dau_dang h where h.hoc_sinh_id = u.hs and h.mon = u.mon and h.ma_dang = any(u.t))
        or exists (select 1 from _u u2 where u2.ok and u2.hs = u.hs and u2.mon = u.mon and u2.cu <> u.cu and u2.htd_id is not null and u2.t && u.t));

-- chia đích cho dòng của từng đợt: bỏ dạng bài đợt đã có; dạng bài nhiều mã cũ cùng ứng ⇒ mã cũ đứng trước (theo mã) nhận
create temp table _nhan on commit drop as
select d.id, d.dot, d.hs, d.mon, d.cu, x.k
  from _dd d join _u u on u.hs = d.hs and u.mon = d.mon and u.cu = d.cu and u.ok
  cross join lateral unnest(u.t) x(k)
 where not exists (select 1 from bo_tro_duoi_dang y where y.bo_tro_duoi_id = d.dot and y.ma_dang = x.k)
   and not exists (select 1 from _dd d2 join _u u2 on u2.hs = d2.hs and u2.mon = d2.mon and u2.cu = d2.cu and u2.ok
                    where d2.dot = d.dot and d2.cu < d.cu and x.k = any(u2.t));
-- đơn vị có dòng không nhận được dạng bài nào ⇒ giữ cũ cả đơn vị (không xoá dòng gốc)
update _u u set ok = false
 where u.ok and exists (select 1 from _dd d where d.hs = u.hs and d.mon = u.mon and d.cu = u.cu
                                                and not exists (select 1 from _nhan n where n.id = d.id));
delete from _nhan n where not exists (select 1 from _u u where u.ok and u.hs = n.hs and u.mon = n.mon and u.cu = n.cu);

-- bài làm: mỗi câu về dạng bài của chính nó
update bai_test_cau btc set ma_dang_cu = btc.ma_dang, ma_dang = public._do_o_bdm(btc.ma_cau, btc.ma_dang)
  from bai_test bt, _u u
 where u.ok and btc.bai_test_id = bt.id and bt.loai in ('htd_luyen', 'htd_test')
   and bt.hoc_sinh_id = u.hs and bt.mon = u.mon and btc.ma_dang = u.cu and btc.ma_cau is not null
   and public._do_o_bdm(btc.ma_cau, btc.ma_dang) = any(u.t);

-- tiến trình: chép trạng thái mã cũ sang MỌI dạng bài của nó
insert into hoc_tu_dau_dang (hoc_sinh_id, mon, ma_dang, doc_ly_thuyet_at, test_bai_test_id, test_nop_at, created_at, mo_tay_at, mo_tay_boi, ma_dang_cu)
select h.hoc_sinh_id, h.mon, k.ma, h.doc_ly_thuyet_at, h.test_bai_test_id, h.test_nop_at, h.created_at, h.mo_tay_at, h.mo_tay_boi, h.ma_dang
  from _u u join hoc_tu_dau_dang h on h.id = u.htd_id
  cross join lateral unnest(u.t[2:]) k(ma)
 where u.ok;
update hoc_tu_dau_dang h set ma_dang_cu = h.ma_dang, ma_dang = u.t[1] from _u u where u.ok and h.id = u.htd_id;

-- mục tiêu đợt: dòng gốc nhận dạng bài đầu, thêm dòng cho phần còn lại
insert into bo_tro_duoi_dang (bo_tro_duoi_id, ma_dang, created_at, day_buoi_id, day_at, ma_dang_cu)
select y.bo_tro_duoi_id, n.k, y.created_at, y.day_buoi_id, y.day_at, y.ma_dang
  from bo_tro_duoi_dang y
  join (select id, k, row_number() over (partition by id order by k) as rn from _nhan) n on n.id = y.id
 where n.rn > 1;
update bo_tro_duoi_dang y set ma_dang_cu = y.ma_dang, ma_dang = n.k
  from (select id, min(k) as k from _nhan group by id) n
 where y.id = n.id;
