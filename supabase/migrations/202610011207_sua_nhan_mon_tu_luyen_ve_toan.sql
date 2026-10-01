-- ============================================================================
-- 202610011207 — Sửa nhãn môn: bài tự luyện CÂU TOÁN bị gắn 'Tiếng Anh'/'Văn' ⇒ về 'Toán' (Thùy gật 01/10: "1. Có")
-- ----------------------------------------------------------------------------
-- VÌ SAO: trước mig 202610011120, registry kho rơi về kho TOÁN cho mọi môn không phải KHTN, và app cũ chọn môn theo chữ cái
--   ('Tiếng Anh' < 'Toán') ⇒ em học Toán + Tiếng Anh/Văn làm tự luyện câu Toán nhưng bài ghi `mon='Tiếng Anh'/'Văn'`,
--   `lop_id` = lớp Anh/Văn. Hậu quả: phần luyện Toán đó không vào mastery/lịch sử/BXH Toán của em. Đo 01/10: 70 bài (6 em),
--   851 dòng `tu_luyen_dang_lan`, 6 lượt `may_man_hs_luot` (HS0645, mon chép từ bài).
-- NHÂN CHỨNG THỨ HAI (CLAUDE §2 "số lượng khớp không phải bằng chứng"): một bài chỉ được đổi khi MỌI câu có mã dạng đều là mã
--   Toán `T…` (0 câu mã môn khác) — đo: 851 câu T, 0 câu khác, 3 câu không mã dạng nằm trong bài toàn T. Lệch dù 1 bài ⇒ dừng cả lượt.
-- LÀM GÌ:
--   (1) bai_test: mon → 'Toán'; lop_id → lớp Toán em đang học VÀO NGÀY làm bài (ngay_vao gần nhất ≤ ngày bài; không có thì lớp Toán
--       vào sớm nhất). (2) tu_luyen_dang_lan của các bài đó: mon → 'Toán'; rồi ĐÁNH SỐ LẠI lan_thu của các (em × dạng) bị gộp theo thời
--       gian (gộp vào làm 57 dòng trùng `lan_thu` với dòng Toán sẵn có — lan_thu là bộ đếm "lần luyện thứ", dùng cho cửa sổ không
--       lặp câu). (3) may_man_hs_luot có bai_lam thuộc các bài đó: mon → 'Toán'.
--   Mọi giá trị cũ ghi vào `log_sua_nhan_mon_2026_10_01` (bảng, id, cột, cũ, mới) ⇒ hoàn tác được, truy được.
-- MẤT GÌ (Luật xoá): không xoá dòng nào. Giá trị cũ bị ĐÈ ở 3 bảng trên (mon, lop_id, lan_thu) — đã lưu đủ trong bảng log.
-- ============================================================================

create table public.log_sua_nhan_mon_2026_10_01 (
  bang text not null, id uuid not null, cot text not null, gia_tri_cu text, gia_tri_moi text,
  sua_at timestamptz not null default now()
);
alter table public.log_sua_nhan_mon_2026_10_01 enable row level security; -- chỉ để truy/hoàn tác, không ai đọc qua API

do $$
declare
  v_lech int; v_bai int; v_dong int; v_mm int;
begin
  create temp table _bai on commit drop as
    select bt.id, bt.hoc_sinh_id, bt.mon as mon_cu, bt.lop_id as lop_cu,
      coalesce(
        (select hl.lop_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
          where hl.hoc_sinh_id = bt.hoc_sinh_id and l.mon = 'Toán' and hl.ngay_vao <= bt.ngay order by hl.ngay_vao desc limit 1),
        (select hl.lop_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
          where hl.hoc_sinh_id = bt.hoc_sinh_id and l.mon = 'Toán' order by hl.ngay_vao limit 1)) as lop_moi
    from bai_test bt
    where bt.loai = 'tu_luyen' and bt.mon in ('Tiếng Anh', 'Văn');

  -- Nhân chứng: không bài nào có câu mã dạng KHÔNG phải Toán; em nào cũng có lớp Toán.
  select count(*) into v_lech from _bai b
    where exists (select 1 from bai_test_cau c where c.bai_test_id = b.id and c.ma_dang is not null and c.ma_dang not like 'T%')
       or exists (select 1 from tu_luyen_dang_lan t where t.bai_test_id = b.id and t.ma_dang not like 'T%')
       or b.lop_moi is null;
  if v_lech > 0 then raise exception 'Dừng: % bài không chắc là bài Toán (hoặc em không có lớp Toán) — không sửa gì.', v_lech; end if;
  select count(*) into v_bai from _bai;
  if v_bai <> 70 then raise exception 'Dừng: số bài % ≠ 70 đã đo 01/10 — đo lại trước khi sửa.', v_bai; end if;

  -- (1) bai_test
  insert into log_sua_nhan_mon_2026_10_01 (bang, id, cot, gia_tri_cu, gia_tri_moi)
    select 'bai_test', id, 'mon', mon_cu, 'Toán' from _bai
    union all select 'bai_test', id, 'lop_id', lop_cu::text, lop_moi::text from _bai;
  update bai_test bt set mon = 'Toán', lop_id = b.lop_moi from _bai b where bt.id = b.id;

  -- (2) tu_luyen_dang_lan: đổi môn, rồi đánh số lại lan_thu cho các (em × dạng) bị gộp
  create temp table _cap on commit drop as
    select distinct t.hoc_sinh_id, t.ma_dang from tu_luyen_dang_lan t join _bai b on b.id = t.bai_test_id;
  insert into log_sua_nhan_mon_2026_10_01 (bang, id, cot, gia_tri_cu, gia_tri_moi)
    select 'tu_luyen_dang_lan', t.id, 'mon', t.mon, 'Toán' from tu_luyen_dang_lan t join _bai b on b.id = t.bai_test_id;
  update tu_luyen_dang_lan t set mon = 'Toán' from _bai b where b.id = t.bai_test_id;
  get diagnostics v_dong = row_count;
  if v_dong <> 851 then raise exception 'Dừng: % dòng tu_luyen_dang_lan ≠ 851 đã đo.', v_dong; end if;

  create temp table _so on commit drop as
    with g as (
      select t.hoc_sinh_id, t.ma_dang, t.bai_test_id, t.lan_thu, min(t.tao_at) as t0
      from tu_luyen_dang_lan t join _cap k on k.hoc_sinh_id = t.hoc_sinh_id and k.ma_dang = t.ma_dang
      where t.mon = 'Toán' group by 1, 2, 3, 4
    )
    select *, row_number() over (partition by hoc_sinh_id, ma_dang order by t0, lan_thu, bai_test_id)::int as lan_moi from g;
  insert into log_sua_nhan_mon_2026_10_01 (bang, id, cot, gia_tri_cu, gia_tri_moi)
    select 'tu_luyen_dang_lan', t.id, 'lan_thu', t.lan_thu::text, s.lan_moi::text
    from tu_luyen_dang_lan t join _so s on s.hoc_sinh_id = t.hoc_sinh_id and s.ma_dang = t.ma_dang and s.bai_test_id = t.bai_test_id and s.lan_thu = t.lan_thu
    where t.mon = 'Toán' and t.lan_thu <> s.lan_moi;
  update tu_luyen_dang_lan t set lan_thu = s.lan_moi
    from _so s where s.hoc_sinh_id = t.hoc_sinh_id and s.ma_dang = t.ma_dang and s.bai_test_id = t.bai_test_id and s.lan_thu = t.lan_thu
      and t.mon = 'Toán' and t.lan_thu <> s.lan_moi;

  -- (3) may_man_hs_luot — mon chép từ bài làm đủ điều kiện quay
  insert into log_sua_nhan_mon_2026_10_01 (bang, id, cot, gia_tri_cu, gia_tri_moi)
    select 'may_man_hs_luot', m.id, 'mon', m.mon, 'Toán'
    from may_man_hs_luot m join bai_lam bl on bl.id = m.bai_lam_id join _bai b on b.id = bl.bai_test_id where m.mon <> 'Toán';
  update may_man_hs_luot m set mon = 'Toán' from bai_lam bl, _bai b
    where bl.id = m.bai_lam_id and b.id = bl.bai_test_id and m.mon <> 'Toán';
  get diagnostics v_mm = row_count;
  if v_mm <> 6 then raise exception 'Dừng: % lượt may mắn ≠ 6 đã đo.', v_mm; end if;
end $$;
