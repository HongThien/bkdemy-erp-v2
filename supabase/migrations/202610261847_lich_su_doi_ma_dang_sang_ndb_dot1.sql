-- ============================================================================
-- 202610261847 — lich_su_doi_ma_dang_sang_ndb_dot1
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 (chuyển hẳn sang bản đồ + kho mới) chọn "Đổi mã hàng loạt" cho LỊCH SỬ mang mã dạng cũ K6–12.
--   Đợt 1 = bảng ĐO / VẬN HÀNH: lượt chấm buổi (gami_session_problems), câu bài làm online (bai_test_cau), sổ tự luyện
--   (tu_luyen_dang_lan), câu ca test (ca_test_cau), dạng phát hành của bài test (bai_test_dang_phat_hanh), đánh giá GV theo
--   dạng (buoi_danh_gia_dang), chuông báo động (canh_bao_yeu). Đợt 2 (tài liệu: tai_lieu_phan.ref_ma, cấu hình ôn tập) làm
--   sau khi builder đọc được mã NDB — đổi trước thì tài liệu cũ in lại mất tên dạng + lý thuyết.
--   Luật quy (§1.5 — chỉ đổi khi CHẮC, không chắc thì giữ mã cũ):
--   · Dòng CÓ mã câu ⇒ dạng bài của CHÍNH câu đó (_do_o_bdm — cùng đường mastery), chỉ khi ra NDB.
--   · Dòng KHÔNG có mã câu ⇒ đúng đường mastery đang quy (_do_o_bdm(null, mã) — số mastery giữ nguyên); không ra dạng bài thì
--     mã cũ chỉ đổi khi MỌI câu còn sống của dạng cũ + đối ứng một-đích quy về ĐÚNG MỘT dạng bài.
--   · Dạng phát hành của 1 bài test ⇒ theo các câu CỦA CHÍNH bài đó mang mã cũ ấy (đúng 1 dạng bài thì đổi) — khớp bai_test_cau.
--   · Bảng có khoá theo mã dạng (buoi_danh_gia_dang, bai_test_dang_phat_hanh): dòng mới đụng khoá có sẵn / 2 mã cũ về cùng 1 NDB
--     ⇒ giữ mã cũ (không gộp dòng — mất số liệu).
--   · KHÔNG đụng bài làm + sổ tự luyện của bổ trợ yếu / bù / đuổi / học từ đầu (loai bo_tro, bo_tro_test, retest, bu_*, htd_*):
--     các phiên chuyển bổ trợ đã đổi CÙNG LƯỢT với dòng ca (dạng ca ↔ dạng bài làm phải khớp); phần còn mã cũ ở đó là dòng ca
--     không quy được — đổi riêng bài làm sẽ gãy retest/đóng ca.
--   · Cấp 1 (khối 3/4/4T/5/5T) + Hình + môn khác: không đổi (chỉ mã có trong dai_ban_do/hgt_ban_do khối 6–12).
--   Truy lại: mã cũ lưu ở cột ma_dang_cu (thêm cho bảng chưa có) — NULL = dòng chưa từng đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm cột ma_dang_cu, UPDATE ma_dang có lưu bản cũ vào ma_dang_cu.
-- ============================================================================

alter table gami_session_problems   add column if not exists ma_dang_cu text;
alter table tu_luyen_dang_lan       add column if not exists ma_dang_cu text;
alter table ca_test_cau             add column if not exists ma_dang_cu text;
alter table bai_test_dang_phat_hanh add column if not exists ma_dang_cu text;
alter table buoi_danh_gia_dang      add column if not exists ma_dang_cu text;
alter table canh_bao_yeu            add column if not exists ma_dang_cu text;
comment on column gami_session_problems.ma_dang_cu is 'Mã dạng bản đồ cũ trước khi đổi sang dạng bài NDB (mig 202610261847) — NULL = chưa từng đổi';
comment on column tu_luyen_dang_lan.ma_dang_cu is 'Mã dạng bản đồ cũ trước khi đổi sang dạng bài NDB (mig 202610261847) — NULL = chưa từng đổi';
comment on column ca_test_cau.ma_dang_cu is 'Mã dạng bản đồ cũ trước khi đổi sang dạng bài NDB (mig 202610261847) — NULL = chưa từng đổi';
comment on column bai_test_dang_phat_hanh.ma_dang_cu is 'Mã dạng bản đồ cũ trước khi đổi sang dạng bài NDB (mig 202610261847) — NULL = chưa từng đổi';
comment on column buoi_danh_gia_dang.ma_dang_cu is 'Mã dạng bản đồ cũ trước khi đổi sang dạng bài NDB (mig 202610261847) — NULL = chưa từng đổi';
comment on column canh_bao_yeu.ma_dang_cu is 'Mã dạng bản đồ cũ trước khi đổi sang dạng bài NDB (mig 202610261847) — NULL = chưa từng đổi';

-- mã dạng cũ K6–12 (Đại + HGT)
create temp table _cu on commit drop as
select ma_dang from dai_ban_do where khoi in ('6','7','8','9','10','11','12')
union select ma_dang from hgt_ban_do where khoi in ('6','7','8','9','10','11','12');
create unique index on _cu (ma_dang);

-- mã cũ → dạng bài DUY NHẤT (cho dòng không có mã câu)
create temp table _mot on commit drop as
with k as (
  select c.ma_dang, x.khoa from _cu c cross join lateral (
    select public._do_o_bdm(q.ma_cau, c.ma_dang) as khoa from dai_cau_hoi q where q.dang_chinh = c.ma_dang and q.xoa_at is null
    union select public._do_o_bdm(q.ma_cau, c.ma_dang) from hgt_cau_hoi q where q.dang_chinh = c.ma_dang and q.xoa_at is null
    union select public._bdm_dang_cu_mot_dich(c.ma_dang)) x
)
select ma_dang as cu, min(khoa) as moi from k
 group by ma_dang
having count(distinct khoa) filter (where khoa is not null) = 1 and bool_and(khoa is null or khoa like 'NDB%');
create unique index on _mot (cu);

-- đích cho dòng KHÔNG mã câu: ưu tiên ĐÚNG đường mastery đang quy (_do_o_bdm(null, mã chép) — có bước dạng cũ đã gộp
-- vào dạng khác) để số mastery không đổi; đường đó không ra dạng bài thì mới dùng đích duy nhất theo câu (_mot)
create temp table _ma on commit drop as
select c.ma_dang as cu, coalesce(case when x.r like 'NDB%' then x.r end, m.moi) as moi
  from _cu c cross join lateral (select public._do_o_bdm(null, c.ma_dang) as r) x left join _mot m on m.cu = c.ma_dang
 where coalesce(case when x.r like 'NDB%' then x.r end, m.moi) is not null;
create unique index on _ma (cu);

-- bài test của bổ trợ yếu / bù / đuổi / học từ đầu — không đụng (đã đổi cùng dòng ca ở mig riêng)
create temp table _bt_bo on commit drop as
select id from bai_test where loai in ('bo_tro', 'bo_tro_test', 'retest', 'bu_luyen', 'bu_test', 'htd_luyen', 'htd_test');
create unique index on _bt_bo (id);

-- cặp (câu, mã cũ) → dạng bài của câu: tính 1 lần cho mọi cặp có trong các bảng có mã câu
create temp table _cap on commit drop as
with p as (
  select distinct ma_cau, ma_dang from gami_session_problems where ma_cau is not null and ma_dang in (select ma_dang from _cu)
  union select distinct t.ma_cau, t.ma_dang from bai_test_cau t where t.ma_cau is not null and t.ma_dang in (select ma_dang from _cu)
                                                                  and t.bai_test_id not in (select id from _bt_bo)
  union select distinct l.ma_cau, l.ma_dang from tu_luyen_dang_lan l where l.ma_cau is not null and l.ma_dang in (select ma_dang from _cu)
                                                                  and (l.bai_test_id is null or l.bai_test_id not in (select id from _bt_bo))
  union select distinct ma_cau, ma_dang from ca_test_cau where ma_cau is not null and ma_dang in (select ma_dang from _cu)
)
select p.ma_cau, p.ma_dang as cu, x.moi from p cross join lateral (select public._do_o_bdm(p.ma_cau, p.ma_dang) as moi) x
 where x.moi like 'NDB%';
create unique index on _cap (ma_cau, cu);

-- 1. lượt chấm buổi: có câu ⇒ theo câu; không câu ⇒ đích duy nhất
update gami_session_problems s set ma_dang_cu = s.ma_dang, ma_dang = c.moi
  from _cap c where s.ma_cau = c.ma_cau and s.ma_dang = c.cu;
update gami_session_problems s set ma_dang_cu = s.ma_dang, ma_dang = m.moi
  from _ma m where s.ma_cau is null and s.ma_dang = m.cu;

-- 2. câu bài làm online (trừ bổ trợ/bù/đuổi/học từ đầu)
update bai_test_cau t set ma_dang_cu = t.ma_dang, ma_dang = c.moi
  from _cap c where t.ma_cau = c.ma_cau and t.ma_dang = c.cu and t.bai_test_id not in (select id from _bt_bo);

-- 3. sổ tự luyện (trừ lượt thuộc bài bổ trợ/bù/đuổi/học từ đầu)
update tu_luyen_dang_lan l set ma_dang_cu = l.ma_dang, ma_dang = c.moi
  from _cap c where l.ma_cau = c.ma_cau and l.ma_dang = c.cu and (l.bai_test_id is null or l.bai_test_id not in (select id from _bt_bo));

-- 4. câu ca test
update ca_test_cau t set ma_dang_cu = t.ma_dang, ma_dang = c.moi
  from _cap c where t.ma_cau = c.ma_cau and t.ma_dang = c.cu;

-- 5. dạng phát hành của bài test: theo câu CỦA CHÍNH bài đó (vừa đổi ở bước 2) mang mã cũ ấy — đúng 1 dạng bài, không đụng khoá
create temp table _ph on commit drop as
select p.bai_test_id, p.ma_dang as cu, min(t.ma_dang) as moi
  from bai_test_dang_phat_hanh p join bai_test_cau t on t.bai_test_id = p.bai_test_id and t.ma_dang_cu = p.ma_dang
 where p.ma_dang in (select ma_dang from _cu) and p.bai_test_id not in (select id from _bt_bo)
 group by 1, 2 having count(distinct t.ma_dang) = 1;
delete from _ph x where exists (select 1 from bai_test_dang_phat_hanh p where p.bai_test_id = x.bai_test_id and p.ma_dang = x.moi)
                     or (select count(*) from _ph y where y.bai_test_id = x.bai_test_id and y.moi = x.moi) > 1;
update bai_test_dang_phat_hanh p set ma_dang_cu = p.ma_dang, ma_dang = x.moi
  from _ph x where p.bai_test_id = x.bai_test_id and p.ma_dang = x.cu;

-- 6. đánh giá GV theo dạng (khoá buổi × HS × dạng): đích duy nhất, không đụng khoá
create temp table _dg on commit drop as
select d.buoi_hoc_id, d.hoc_sinh_id, d.ma_dang as cu, m.moi
  from buoi_danh_gia_dang d join _ma m on m.cu = d.ma_dang;
delete from _dg x where exists (select 1 from buoi_danh_gia_dang d where d.buoi_hoc_id = x.buoi_hoc_id and d.hoc_sinh_id = x.hoc_sinh_id and d.ma_dang = x.moi)
                     or (select count(*) from _dg y where y.buoi_hoc_id = x.buoi_hoc_id and y.hoc_sinh_id = x.hoc_sinh_id and y.moi = x.moi) > 1;
update buoi_danh_gia_dang d set ma_dang_cu = d.ma_dang, ma_dang = x.moi
  from _dg x where d.buoi_hoc_id = x.buoi_hoc_id and d.hoc_sinh_id = x.hoc_sinh_id and d.ma_dang = x.cu;

-- 7. chuông báo động: đích duy nhất
update canh_bao_yeu b set ma_dang_cu = b.ma_dang, ma_dang = m.moi
  from _ma m where b.ma_dang = m.cu;
