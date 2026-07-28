-- ============================================================================
-- 202607242050 — hinh_hook_do_luong
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-kho-hinh-v3 §8, "hook reserve NGAY — rẻ lúc dựng, không cứu được nếu quên"):
--   Mọi quan sát vận hành trỏ vào Hình (chấm bài trên lớp · ET · BTVN · cảnh báo yếu) phải mang
--   HAI thứ: (1) Ý NÀO sinh ra quan sát, (2) LƯỢT DẠY NÀO sinh ra nó.
--
--   Vì sao cần (2): buổi lượt-1 dạy MÔ HÌNH thì dạng + bổ đề đã được scaffold sẵn ⇒ HS sai ⇒ quy về
--   **mô hình**. Buổi lượt-2 dạy DẠNG thì mô hình đã quen ⇒ sai ⇒ quy về **dạng**. Cùng một ô sai,
--   hai kết luận trái ngược. Không có nhãn ngữ cảnh thì ba trục (mô hình/dạng/bổ đề) chồng lên một
--   quan sát, về sau KHÔNG GỠ RA ĐƯỢC — phải chấm lại từ đầu. Cột rỗng bây giờ vẫn rẻ hơn vô hạn lần.
--
--   `ngu_canh_luot` khai ở `buoi_hoc` (ý định của buổi) và SNAPSHOT xuống từng dòng quan sát: đổi ý
--   định của buổi sau này KHÔNG được viết lại lịch sử những gì đã đo (CLAUDE.md §4 — ghi vết bất biến).
--
-- MẤT GÌ: không mất gì — chỉ THÊM cột nullable + index. NULL = "không áp dụng" (buổi môn khác,
--   quan sát không trỏ Hình), KHÔNG phải "chưa đo" (CLAUDE.md §1.5).
-- ============================================================================

-- Mã đọc được cho ý — spec §8 gọi ref là `ma_y`. Ref THẬT giữa các bảng vẫn đi bằng uuid + FK
-- (CLAUDE.md §2: tham chiếu bằng text không FK thì DB không chặn, chỗ resolve rụng im lặng);
-- `ma_y` là mã cho NGƯỜI đọc — hiện trên phiếu in, hàng chờ, log chẩn đoán.
create sequence if not exists hinh_y_ma_seq;
alter table hinh_y add column if not exists ma_y text;
update hinh_y set ma_y = 'HY.' || lpad(nextval('hinh_y_ma_seq')::text, 5, '0') where ma_y is null;
alter table hinh_y alter column ma_y set default ('HY.' || lpad(nextval('hinh_y_ma_seq')::text, 5, '0'));
alter table hinh_y alter column ma_y set not null;
create unique index if not exists hinh_y_ma_y_idx on hinh_y(ma_y);

-- Lượt dạy của buổi: mo_hinh = lượt 1 (dạy cấu hình) · dang = lượt 2 (dạy cách xử lý) · luyen_de = ôn/thi.
alter table buoi_hoc add column if not exists ngu_canh_luot text;
do $$ begin
  alter table buoi_hoc add constraint buoi_hoc_ngu_canh_luot_check
    check (ngu_canh_luot in ('mo_hinh', 'dang', 'luyen_de'));
exception when duplicate_object then null; end $$;

-- Quan sát chấm điểm (ingame · et · mt · btvn đều là dòng ở bảng này).
alter table gami_session_problems add column if not exists hinh_y_id uuid references hinh_y(id);
alter table gami_session_problems add column if not exists ngu_canh_luot text;
do $$ begin
  alter table gami_session_problems add constraint gami_session_problems_ngu_canh_luot_check
    check (ngu_canh_luot in ('mo_hinh', 'dang', 'luyen_de'));
exception when duplicate_object then null; end $$;
create index if not exists gami_session_problems_hinh_y_idx on gami_session_problems(hinh_y_id)
  where hinh_y_id is not null;

-- Cảnh báo yếu (tín hiệu NGƯỜI-confirm — nguồn "ai cần hỗ trợ").
alter table canh_bao_yeu add column if not exists hinh_y_id uuid references hinh_y(id);
alter table canh_bao_yeu add column if not exists ngu_canh_luot text;
do $$ begin
  alter table canh_bao_yeu add constraint canh_bao_yeu_ngu_canh_luot_check
    check (ngu_canh_luot in ('mo_hinh', 'dang', 'luyen_de'));
exception when duplicate_object then null; end $$;
create index if not exists canh_bao_yeu_hinh_y_idx on canh_bao_yeu(hinh_y_id)
  where hinh_y_id is not null;
