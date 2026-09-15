-- 🚨 Chuông báo động "HS kém dạng" ở CẢ 4 chỗ chấm (CEO 09/09): Đánh giá sau buổi · ET · BTVN · MT.
-- Trước: CHECK chỉ cho 'btvn' | 'danhgia' (202608311240). ET/MT bấm chuông sẽ chết đúng lúc lưu
-- ("violates check constraint") — bài học §2.1: thêm giá trị vào union TS PHẢI kèm migration nới CHECK.
-- NOT VALID: không quét dòng cũ (giữ nguyên hành vi 202608311240), chỉ chặn giá trị lạ từ giờ.
alter table canh_bao_yeu drop constraint if exists canh_bao_yeu_nguon_chk;
alter table canh_bao_yeu add constraint canh_bao_yeu_nguon_chk
  check (nguon in ('btvn', 'danhgia', 'et', 'mt')) not valid;
comment on column canh_bao_yeu.nguon is
  'Chỗ bấm chuông: btvn (chấm BTVN) · danhgia (đánh giá sau buổi) · et (chấm ET) · mt (chấm MT). Cả 4 = kênh ③ chuông đỏ khi duyệt bổ trợ yếu.';
