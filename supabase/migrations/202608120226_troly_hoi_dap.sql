-- ============================================================================
-- 202608120226 — troly_hoi_dap
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 12/08: *"bây giờ trợ lý đưa ra 1 đống thứ. t cần trao đổi với nó như đang trao đổi
--   với m. chứ hệ thống đưa ra thì khác gì dashboard và việc của tôi nhỉ"*.
--   ⇒ ĐÚNG. Doc §1 nói *"ERP đã hiển thị đủ dữ liệu, người quá tải không tự tổng hợp nổi"* —
--   mà Claude lại đi dựng thêm MỘT MÀN HIỂN THỊ NỮA. Danh sách = dashboard, không phải trợ lý.
--   Thứ biến nó thành trợ lý là **HỎI ĐƯỢC**.
--
--   Đây là chỗ AI vào lần đầu trong module này, và ranh giới giữ nguyên doc §4:
--     · CODE tính số (`nhacViecHomNay` + `nhanDinhHeThong`) → gói thành BẢNG SẠCH.
--     · MODEL chỉ ĐỌC bảng đó rồi trò chuyện. **Cấm tự tính, cấm tự suy ra số không có sẵn.**
--     · Hỏi cái ngoài bảng ⇒ phải trả lời "tôi không có số đó" (§4 "không suy từ dữ liệu vắng mặt").
--
--   Khuôn hạ tầng bê nguyên `danhgia_ai_job` (đã chạy thật): client ghi job → `worker/troly.mjs`
--   quét mỗi 5s → gọi Anthropic → ghi kết quả. Key Anthropic Ở SERVER, không bao giờ vào bundle
--   browser (DEVLOG "vụ 920k" — key lộ = người lạ đốt tiền).
--
--   `boi_canh` lưu NGUYÊN bảng sạch đã gửi: hỏi lại "vì sao lúc đó nói thế" thì tái dựng được
--   đúng bối cảnh. Không lưu thì mọi câu trả lời cũ thành không kiểm chứng được.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Bảng mới hoàn toàn, không đụng bảng nào đang có.
-- ============================================================================

create table if not exists troly_hoi_dap (
  id         uuid primary key default gen_random_uuid(),
  phien      uuid not null,            -- gom nhiều lượt thành 1 cuộc trò chuyện
  cau_hoi    text not null,
  boi_canh   jsonb not null,           -- BẢNG SẠCH code tính, đúng thứ đã gửi model
  lich_su    jsonb not null default '[]'::jsonb,  -- các lượt trước trong phiên
  trang_thai text not null default 'pending',
  -- Số lần worker đã thử job này. THIẾU CỘT NÀY = điều kiện bỏ cuộc không bao giờ đúng
  -- ⇒ job hỏng quay vòng VÔ HẠN, mỗi vòng một lượt gọi model CÓ TÍNH TIỀN.
  so_lan     integer not null default 0,
  tra_loi    text,
  usage      jsonb,
  model      text,
  error      text,
  nguoi      uuid,
  created_at timestamptz not null default now(),
  done_at    timestamptz
);

alter table troly_hoi_dap drop constraint if exists troly_hoi_dap_tt_ck;
alter table troly_hoi_dap add constraint troly_hoi_dap_tt_ck
  check (trang_thai = any (array['pending', 'processing', 'done', 'failed']));

create index if not exists troly_hoi_dap_phien_idx on troly_hoi_dap (phien, created_at);
-- Worker quét job chờ — index hẹp theo trạng thái, khỏi full-scan khi bảng phình.
create index if not exists troly_hoi_dap_cho_idx on troly_hoi_dap (created_at) where trang_thai = 'pending';

comment on table troly_hoi_dap is
  'Hỏi–đáp với Trợ lý AI. Client tính BẢNG SẠCH (boi_canh) rồi ghi job; worker/troly.mjs gọi Anthropic và ghi tra_loi. Model CHỈ đọc boi_canh — cấm tự tính số (doc §4).';
comment on column troly_hoi_dap.boi_canh is
  'Bảng sạch do CODE tính, nguyên văn thứ đã gửi model. Giữ lại để tái dựng bối cảnh khi cần truy "vì sao lúc đó nói thế".';

alter table troly_hoi_dap enable row level security;
drop policy if exists troly_hoi_dap_member_all on troly_hoi_dap;
create policy troly_hoi_dap_member_all on troly_hoi_dap for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on troly_hoi_dap to authenticated;
