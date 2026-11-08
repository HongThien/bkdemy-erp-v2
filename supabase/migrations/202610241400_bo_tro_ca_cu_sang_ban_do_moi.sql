-- ============================================================================
-- 202610241400 — bo_tro_ca_cu_sang_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 24/10 (đã bật công tắc mastery bản đồ mới): "Chuyển dữ liệu các ca bổ trợ đã diễn ra + hôm nay theo mastery mới".
--   Thay quyết định 24/10 sáng (ca cũ chạy hết theo bản đồ cũ). Mọi ca → ban_do = 'moi'; dạng của ca (bo_tro_yeu_dang) và
--   dạng trên các bài làm của ca (bai_test_cau của bài bo_tro / bo_tro_test / retest thuộc buổi gắn ca) đổi CÙNG lượt — các hàm
--   retest / đóng ca / lịch sử ghép hai bên bằng ma_dang, đổi một bên là gãy.
--   Luật quy (§1.5 thà bỏ trống còn hơn đánh sai): mã dạng cũ → dạng bài NDB khi (1) mọi câu CÒN SỐNG của dạng cũ (cùng đường
--   _do_o_bdm của mastery) + đối ứng một-đích quy về ĐÚNG MỘT dạng bài, hoặc (2) mọi câu em ĐÃ LÀM trong ca cho dạng đó quy về
--   đúng một dạng bài; (3) câu đã làm rải ≥2 dạng bài ⇒ TÁCH dòng theo các dạng bài đó; (4) ca đang mở, dạng chưa làm câu nào ⇒
--   các dạng bài (của dạng cũ) em đang YẾU theo mastery mới. Không được ⇒ giữ mã cũ (tên vẫn tra được,
--   chọn câu vẫn chạy kho cũ). Một ca có 2 dạng cũ cùng quy về 1 dạng bài ⇒ giữ cả hai mã cũ (không gộp dòng — mất kết quả retest).
--   Cấp 1 + Hình học (mã không phải dạng Đại/HGT) không đổi.
--   Truy lại: mã cũ giữ ở cột ma_dang_cu (bo_tro_yeu_dang, bai_test_cau) — NULL = dòng chưa từng bị quy.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 2 cột, UPDATE ma_dang có lưu bản cũ vào ma_dang_cu, đổi bo_tro_yeu.ban_do 'cu' → 'moi'.
-- ============================================================================

alter table bo_tro_yeu_dang add column if not exists ma_dang_cu text;
comment on column bo_tro_yeu_dang.ma_dang_cu is 'Mã dạng (bản đồ cũ) trước khi quy sang dạng bài bản đồ mới (mig 202610241400) — NULL = chưa từng quy';
alter table bai_test_cau add column if not exists ma_dang_cu text;
comment on column bai_test_cau.ma_dang_cu is 'Mã dạng (bản đồ cũ) trước khi quy sang dạng bài bản đồ mới (mig 202610241400, chỉ bài của ca bổ trợ) — NULL = chưa từng quy';

create temp table _qd on commit drop as
with d as (
  select distinct yd.ma_dang
    from bo_tro_yeu_dang yd join bo_tro_yeu y on y.id = yd.bo_tro_yeu_id join hoc_sinh h on h.id = y.hoc_sinh_id
   where yd.ma_dang not like 'NDB%' and coalesce(h.khoi, '') not in ('3', '4', '4T', '5', '5T')
     and (exists (select 1 from dai_ban_do b where b.ma_dang = yd.ma_dang) or exists (select 1 from hgt_ban_do b where b.ma_dang = yd.ma_dang))
),
k as (
  select d.ma_dang, x.khoa from d cross join lateral (
    select public._do_o_bdm(q.ma_cau, d.ma_dang) as khoa from dai_cau_hoi q where q.dang_chinh = d.ma_dang and q.xoa_at is null
    union select public._do_o_bdm(q.ma_cau, d.ma_dang) from hgt_cau_hoi q where q.dang_chinh = d.ma_dang
    union select public._bdm_dang_cu_mot_dich(d.ma_dang)) x
)
select ma_dang as cu, min(khoa) as moi from k
 group by ma_dang
having count(distinct khoa) filter (where khoa is not null) = 1 and bool_and(khoa is null or khoa like 'NDB%');

-- đích theo TỪNG ca: (1) đích chung của mã cũ ở trên; không có ⇒ (2) mọi câu em ĐÃ LÀM trong ca cho dạng đó (bài bo_tro/test/retest
-- của buổi gắn ca) quy về đúng một dạng bài ⇒ dạng bài đó. Còn lại giữ mã cũ.
create temp table _dich on commit drop as
select yd.id, yd.bo_tro_yeu_id, yd.ma_dang as cu, q.moi as moi_chung,
       (select array_agg(distinct x.k order by x.k) from (
          select public._do_o_bdm(btc.ma_cau, yd.ma_dang) as k
            from bai_test bt join buoi_hoc_hs hh on hh.buoi_hoc_id = bt.buoi_hoc_id and hh.bo_tro_yeu_id = yd.bo_tro_yeu_id
            join bai_test_cau btc on btc.bai_test_id = bt.id and btc.ma_dang = yd.ma_dang and btc.ma_cau is not null
           where bt.loai in ('bo_tro', 'bo_tro_test', 'retest') and (bt.hoc_sinh_id is null or bt.hoc_sinh_id = hh.hoc_sinh_id)) x) as da_lam,
       null::text as moi
  from bo_tro_yeu_dang yd join bo_tro_yeu y on y.id = yd.bo_tro_yeu_id join hoc_sinh h on h.id = y.hoc_sinh_id
  left join _qd q on q.cu = yd.ma_dang
 where yd.ma_dang not like 'NDB%' and coalesce(h.khoi, '') not in ('3', '4', '4T', '5', '5T')
   and (exists (select 1 from dai_ban_do b where b.ma_dang = yd.ma_dang) or exists (select 1 from hgt_ban_do b where b.ma_dang = yd.ma_dang));

update _dich set moi = coalesce(moi_chung, case when cardinality(da_lam) = 1 and da_lam[1] like 'NDB%' then da_lam[1] end);

-- (3) TÁCH: câu đã làm rải ≥2 dạng bài (đều NDB) ⇒ dòng của ca tách theo các dạng bài đó, mỗi câu bài làm về dạng bài CỦA CÂU
--     (đúng sự thật đo — câu nào thuộc dạng bài nào), trạng thái dòng (dạy/đóng/retest) chép sang từng dòng.
alter table _dich add column tach text[];
update _dich set tach = da_lam where moi is null and cardinality(da_lam) >= 2 and not exists (select 1 from unnest(da_lam) k where k is null or k not like 'NDB%');

-- (4) CA ĐANG MỞ, dạng CHƯA làm câu nào, quy không duy nhất ⇒ chọn như ca mới chọn dạng: trong các dạng bài mà câu còn sống của
--     dạng cũ quy về, giữ những dạng bài em đang YẾU theo mastery bản đồ mới. Không có dạng bài nào yếu ⇒ giữ mã cũ. Ca đã đóng: giữ.
create temp table _yeu on commit drop as
select m.hoc_sinh_id, m.ma_dang from public.fn_mastery_cells_bdm(
  (select array_agg(distinct y.hoc_sinh_id) from bo_tro_yeu y where y.trang_thai = 'dang_xu'), true) m where m.muc = 'yeu';
update _dich d set tach = x.ds
  from (select d2.id, array_agg(distinct k.khoa order by k.khoa) ds
          from _dich d2 join bo_tro_yeu y on y.id = d2.bo_tro_yeu_id and y.trang_thai = 'dang_xu'
          cross join lateral (select public._do_o_bdm(q.ma_cau, d2.cu) as khoa from dai_cau_hoi q where q.dang_chinh = d2.cu and q.xoa_at is null
                              union select public._do_o_bdm(q.ma_cau, d2.cu) from hgt_cau_hoi q where q.dang_chinh = d2.cu) k
          join _yeu u on u.hoc_sinh_id = y.hoc_sinh_id and u.ma_dang = k.khoa
         where d2.moi is null and d2.tach is null and d2.da_lam is null
         group by d2.id) x
 where d.id = x.id;
update _dich set moi = tach[1], tach = null where cardinality(tach) = 1;

-- dòng được quy, và trong cùng ca không có dạng khác (NDB sẵn hoặc dạng cũ khác) chiếm/đụng cùng đích
create temp table _dong on commit drop as
select d.id, d.bo_tro_yeu_id, d.cu, d.moi
  from _dich d
 where d.moi is not null
   and not exists (select 1 from bo_tro_yeu_dang y2 where y2.bo_tro_yeu_id = d.bo_tro_yeu_id and y2.id <> d.id and y2.ma_dang = d.moi)
   and not exists (select 1 from _dich d2 where d2.bo_tro_yeu_id = d.bo_tro_yeu_id and d2.id <> d.id and (d2.moi = d.moi or d.moi = any(d2.tach)));

create temp table _tach on commit drop as
select d.id, d.bo_tro_yeu_id, d.cu, d.tach
  from _dich d
 where d.tach is not null
   and not exists (select 1 from bo_tro_yeu_dang y2 where y2.bo_tro_yeu_id = d.bo_tro_yeu_id and y2.id <> d.id and y2.ma_dang = any(d.tach))
   and not exists (select 1 from _dich d2 where d2.bo_tro_yeu_id = d.bo_tro_yeu_id and d2.id <> d.id and (d2.moi = any(d.tach) or d2.tach && d.tach));

update bai_test_cau btc set ma_dang_cu = btc.ma_dang, ma_dang = d.moi
  from bai_test bt, buoi_hoc_hs hh, _dong d
 where btc.bai_test_id = bt.id and bt.loai in ('bo_tro', 'bo_tro_test', 'retest')
   and hh.buoi_hoc_id = bt.buoi_hoc_id and hh.bo_tro_yeu_id = d.bo_tro_yeu_id and btc.ma_dang = d.cu
   and (bt.hoc_sinh_id is null or bt.hoc_sinh_id = hh.hoc_sinh_id);

update bo_tro_yeu_dang yd set ma_dang_cu = yd.ma_dang, ma_dang = d.moi from _dong d where yd.id = d.id;

update bai_test_cau btc set ma_dang_cu = btc.ma_dang, ma_dang = public._do_o_bdm(btc.ma_cau, btc.ma_dang)
  from bai_test bt, buoi_hoc_hs hh, _tach d
 where btc.bai_test_id = bt.id and bt.loai in ('bo_tro', 'bo_tro_test', 'retest')
   and hh.buoi_hoc_id = bt.buoi_hoc_id and hh.bo_tro_yeu_id = d.bo_tro_yeu_id and btc.ma_dang = d.cu and btc.ma_cau is not null
   and (bt.hoc_sinh_id is null or bt.hoc_sinh_id = hh.hoc_sinh_id);

insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, created_at, day_buoi_id, day_at, dong_at, diem_luc_mo, so_lan_do_luc_mo,
                             retest_diem, retest_at, retest_nguon, dat, nguon, ma_dang_cu)
select yd.bo_tro_yeu_id, k.ma, yd.created_at, yd.day_buoi_id, yd.day_at, yd.dong_at, yd.diem_luc_mo, yd.so_lan_do_luc_mo,
       yd.retest_diem, yd.retest_at, yd.retest_nguon, yd.dat, yd.nguon, yd.ma_dang
  from _tach d join bo_tro_yeu_dang yd on yd.id = d.id
  cross join lateral unnest(d.tach[2:]) k(ma);
update bo_tro_yeu_dang yd set ma_dang_cu = yd.ma_dang, ma_dang = d.tach[1] from _tach d where yd.id = d.id;

update bo_tro_yeu set ban_do = 'moi' where ban_do = 'cu';
