-- ============================================================================
-- 202609291107 — troly_bao_cao_luu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   HAI chuyện, cùng một gốc.
--
--   ① LỖI THẬT trên app ngay lượt đầu CEO mở (29/09): "canceling statement due to statement
--      timeout". Role `authenticated` bị giới hạn 8 giây/câu lệnh. `fn_troly_bao_cao` là hàm
--      invoker ⇒ chạy bằng quyền người dùng ⇒ MỌI bảng nó đọc đều bị lớp RLS kiểm từng dòng
--      (policy gọi `la_thanh_vien()`), trên các bảng 100k+ dòng. Đo bằng quyền chủ bảng thì 14
--      ngày mất 0,9s, 30 ngày 2,6s; qua RLS thì vượt 8s.
--      ⚠ Lỗi này do kiểm thiếu: mọi lần chạy thử trước đây đều nối bằng role chủ bảng (RLS không
--      áp). Đã ghi "chưa kiểm RLS" trong DEVLOG nhưng vẫn đẩy lên main.
--
--   ② CEO 29/09: "Báo cáo không phải tính realtime. Lượt đầu mở máy tự tính, kết quả lưu vào DB
--      để mở lại đỡ phải tính lại. Người dùng ấn tính lại thì kết quả mới đè kết quả cũ (hoặc
--      lưu cũng được nếu không nặng)."
--
--   ⇒ MỘT cửa mới `fn_troly_bao_cao_lay(số ngày, tính lại?)`:
--      · có bản lưu của HÔM NAY cho khoảng đó và không bấm tính lại ⇒ trả bản lưu, không tính.
--      · không có, hoặc bấm tính lại ⇒ tính, GHI ĐÈ bản của hôm nay, trả kết quả.
--      Hàm này SECURITY DEFINER — đây là ca "thật cần" (CLAUDE.md §2.0): (a) phải ghi vào bảng
--      lưu mà người dùng không có quyền ghi, (b) phần tính phải chạy bằng quyền chủ bảng mới kịp
--      8 giây. Cổng `_troly_gac()` đứng NGAY đầu hàm, nên definer không mở thêm cho ai: vẫn đúng
--      3 người, và cả 3 vốn là người quản được xem toàn bộ dữ liệu này.
--
--   LƯU THẾ NÀO: một dòng cho mỗi (bộ báo cáo, NGÀY, độ dài khoảng). Tính lại trong ngày = đè
--   dòng của ngày đó. Sang ngày mới = dòng mới ⇒ tự nhiên có lịch sử THEO NGÀY mà không phình
--   theo số lần bấm. Cỡ: ~40KB (7 ngày) · ~100KB (14) · ~180KB (30) mỗi dòng ⇒ dùng đủ cả ba
--   khoảng mỗi ngày thì ~120MB/năm. Chưa có việc dọn bản cũ — khi cần thì hỏi CEO (Luật xoá).
--
--   Bảng KHÔNG có cột `mon` dù CLAUDE.md §1.6 đòi mọi dữ liệu học tập mang nhãn môn: đây là ảnh
--   chụp một BÁO CÁO gộp mọi môn của bộ Sư phạm, không phải dữ liệu đo; từng việc bên trong
--   vẫn gắn với lớp (lớp mang môn).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   THU HẸP QUYỀN (không mất dữ liệu, không drop gì): thu quyền `authenticated` gọi TRỰC TIẾP
--   `fn_troly_bao_cao` và các hàm con `_troly_bc_*`. Lý do: gọi trực tiếp là đường chắc chắn
--   timeout, để lại chỉ tổ có người/phiên sau gọi nhầm. Màn hình đổi sang gọi cửa mới trong
--   cùng commit. Bản app cũ còn cache sẽ báo "permission denied" thay cho "timeout" tới khi tải
--   lại trang.
-- ============================================================================

create table if not exists troly_bao_cao_luu (
  bo          text        not null,                 -- bộ báo cáo: 'su_pham' (Trang) · sau này 'van_hanh' (Lộc)
  ngay        date        not null,                 -- ngày TÍNH theo giờ VN = ngày cuối của khoảng nhìn lại
  so_ngay     integer     not null,                 -- độ dài khoảng nhìn lại
  ket_qua     jsonb       not null,                 -- nguyên kết quả của fn_troly_bao_cao
  tinh_luc    timestamptz not null default now(),
  tinh_boi    uuid        references nhan_su(id),   -- người mở/bấm tính lại làm sinh ra bản này
  tinh_mat_ms integer     not null,
  so_lan_tinh integer     not null default 1,       -- số lần tính trong ngày (1 = chưa ai bấm tính lại)
  primary key (bo, ngay, so_ngay)
);

comment on table troly_bao_cao_luu is
  'Bản LƯU báo cáo trợ lý (CEO 29/09: báo cáo không tính realtime). 1 dòng / (bộ, ngày, khoảng); tính lại trong ngày thì ghi đè. CHỈ fn_troly_bao_cao_lay ghi vào đây.';

alter table troly_bao_cao_luu enable row level security;
drop policy if exists troly_bao_cao_luu_doc on troly_bao_cao_luu;
create policy troly_bao_cao_luu_doc on troly_bao_cao_luu for select to authenticated
  using (public.troly_duoc_dung());
-- Không có policy ghi: người dùng không ghi thẳng được, chỉ hàm definer bên dưới ghi.
revoke all on troly_bao_cao_luu from public, anon, authenticated;
grant select on troly_bao_cao_luu to authenticated;

create or replace function public.fn_troly_bao_cao_lay(p_so_ngay integer default 14, p_tinh_lai boolean default false)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_nay date := public._troly_hom_nay();
  v_n int := least(greatest(coalesce(p_so_ngay, 14), 1), 60);
  v_ns uuid := public.current_nhan_su_id();
  r troly_bao_cao_luu%rowtype;
  v jsonb; t0 timestamptz; v_ms int;
begin
  perform public._troly_gac();   -- TRƯỚC mọi thứ: hàm definer mà gác sau là hở

  if not coalesce(p_tinh_lai, false) then
    select * into r from troly_bao_cao_luu l where l.bo = 'su_pham' and l.ngay = v_nay and l.so_ngay = v_n;
  end if;

  if r.bo is null then
    t0 := clock_timestamp();
    v := public.fn_troly_bao_cao(v_nay, v_n);
    v_ms := (extract(epoch from clock_timestamp() - t0) * 1000)::int;
    insert into troly_bao_cao_luu as l (bo, ngay, so_ngay, ket_qua, tinh_luc, tinh_boi, tinh_mat_ms, so_lan_tinh)
      values ('su_pham', v_nay, v_n, v, now(), v_ns, v_ms, 1)
    on conflict (bo, ngay, so_ngay) do update
      set ket_qua = excluded.ket_qua, tinh_luc = excluded.tinh_luc, tinh_boi = excluded.tinh_boi,
          tinh_mat_ms = excluded.tinh_mat_ms, so_lan_tinh = l.so_lan_tinh + 1
    returning l.* into r;
  end if;

  return r.ket_qua || jsonb_build_object('luu', jsonb_build_object(
    'vua_tinh', t0 is not null,     -- true = lượt gọi này vừa tính; false = lấy từ bản lưu
    'tinh_luc', to_char(r.tinh_luc at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM'),
    'tinh_boi', (select ns.ho_ten from nhan_su ns where ns.id = r.tinh_boi),
    'tinh_mat_ms', r.tinh_mat_ms,
    'so_lan_tinh', r.so_lan_tinh));
end $$;

revoke all on function public.fn_troly_bao_cao_lay(integer, boolean) from public, anon;
grant execute on function public.fn_troly_bao_cao_lay(integer, boolean) to authenticated;

comment on function public.fn_troly_bao_cao_lay(integer, boolean) is
  'Cửa DUY NHẤT màn hình gọi để lấy báo cáo trợ lý: trả bản lưu của hôm nay, chưa có hoặc p_tinh_lai thì tính rồi ghi đè. SECURITY DEFINER vì tính bằng quyền người dùng vượt 8s (RLS). Chỉ nhóm troly_duoc_dung().';

-- Thu quyền gọi TRỰC TIẾP phần tính (đường chắc chắn timeout). Hàm definer ở trên gọi chúng bằng
-- quyền chủ hàm nên không cần `authenticated` có quyền.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and (p.proname = 'fn_troly_bao_cao' or p.proname like '\_troly\_bc\_%')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', r.sig);
  end loop;
end $$;
