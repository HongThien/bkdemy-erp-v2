-- ============================================================================
-- 202609181530 — ban_do_sync_ca_test_cau_khi_doi_ten
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09 "t mới cập nhật chuyên đề lớp 7–11 trong bản đồ, cập nhật bài test lớp 7 và 11 theo chuyên đề
--   mới" + "không chỉ đổi tên, t gộp dạng bài và chuyên đề"):
--   `ca_test_cau.ten_chuyen_de` + `muc_do` là SNAPSHOT lúc gán đề, phiếu `fn_test_dau_vao_phieu` đọc thẳng.
--   Mig 202609181342 (phiên Kho Đại) đã sync cho đường CHUYỂN DẠNG (RPC `fn_dai_chuyen_dang`) + 1 lần retro. Nhưng
--   ĐỔI TÊN / GỘP chuyên đề (update `ten_chuyen_de` trên các dòng `*_ban_do`) thì KHÔNG có đường nào lan sang ca test
--   ⇒ đo 18/09 15h: K7 khớp 100%, K11 còn 6 dòng ("Côn thức lượng giác", "Công thức cộng" → "Công thức lượng giác").
-- LÀM:
--   (a) Trigger AFTER UPDATE OF ten_chuyen_de, muc_do trên 3 bảng bản đồ (dai/hgt/khtn — mã dạng khác tiền tố T1/T3/K
--       nên không đụng nhau) ⇒ update snapshot `ca_test_cau` cùng `ma_dang`. Từ giờ sửa bản đồ là phiếu test theo ngay.
--       Không xung đột `fn_dai_chuyen_dang`: lúc RPC đổi `ma_dang` trên bản đồ, ca_test_cau còn mã CŨ ⇒ trigger khớp 0
--       dòng, RPC tự update ngay sau đó như cũ.
--   (b) Sync retro mọi dòng đang lệch (cả 3 kho).
-- KHÔNG đụng: `ca_test_cau.ma_dang` (gộp CÂU dạng A→B vẫn giữ mã dạng lúc HS làm — quyết định mig 202609181342),
--   kết quả chấm, hàng `HINH:` (không có dạng, nhãn "Hình học" cố định).
-- MẤT GÌ (Luật xoá): không xoá gì. UPDATE ghi đè nhãn chuyên đề/độ khó cũ trên dòng lệch bằng giá trị bản đồ hiện tại.
-- ============================================================================
create or replace function public.tg_ban_do_sync_ca_test_cau() returns trigger
language plpgsql as $$
begin
  if new.ten_chuyen_de is distinct from old.ten_chuyen_de or new.muc_do is distinct from old.muc_do then
    update public.ca_test_cau cc
       set ten_chuyen_de = new.ten_chuyen_de, muc_do = new.muc_do
     where cc.ma_dang = new.ma_dang
       and (cc.ten_chuyen_de is distinct from new.ten_chuyen_de or cc.muc_do is distinct from new.muc_do);
  end if;
  return null;
end $$;

drop trigger if exists trg_dai_ban_do_sync_ca_test_cau on public.dai_ban_do;
create trigger trg_dai_ban_do_sync_ca_test_cau after update of ten_chuyen_de, muc_do on public.dai_ban_do
  for each row execute function public.tg_ban_do_sync_ca_test_cau();
drop trigger if exists trg_hgt_ban_do_sync_ca_test_cau on public.hgt_ban_do;
create trigger trg_hgt_ban_do_sync_ca_test_cau after update of ten_chuyen_de, muc_do on public.hgt_ban_do
  for each row execute function public.tg_ban_do_sync_ca_test_cau();
drop trigger if exists trg_khtn_ban_do_sync_ca_test_cau on public.khtn_ban_do;
create trigger trg_khtn_ban_do_sync_ca_test_cau after update of ten_chuyen_de, muc_do on public.khtn_ban_do
  for each row execute function public.tg_ban_do_sync_ca_test_cau();

-- (b) Sync retro
with bd as (
  select ma_dang, ten_chuyen_de, muc_do from public.dai_ban_do
  union all select ma_dang, ten_chuyen_de, muc_do from public.hgt_ban_do
  union all select ma_dang, ten_chuyen_de, muc_do from public.khtn_ban_do
)
update public.ca_test_cau cc
   set ten_chuyen_de = bd.ten_chuyen_de, muc_do = bd.muc_do
  from bd
 where bd.ma_dang = cc.ma_dang
   and (cc.ten_chuyen_de is distinct from bd.ten_chuyen_de or cc.muc_do is distinct from bd.muc_do);

do $$
declare n int;
begin
  select count(*) into n from public.ca_test_cau cc
    join (select ma_dang, ten_chuyen_de, muc_do from public.dai_ban_do
          union all select ma_dang, ten_chuyen_de, muc_do from public.hgt_ban_do
          union all select ma_dang, ten_chuyen_de, muc_do from public.khtn_ban_do) bd on bd.ma_dang = cc.ma_dang
   where cc.ten_chuyen_de is distinct from bd.ten_chuyen_de or cc.muc_do is distinct from bd.muc_do;
  raise notice 'Sau sync: % dòng ca_test_cau còn lệch snapshot với bản đồ (kỳ vọng 0)', n;
  if n <> 0 then raise exception 'Sync chưa sạch: % dòng', n; end if;
end $$;
