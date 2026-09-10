-- ============================================================================
-- 202609092245 — TEST ĐẦU VÀO: điểm nhập tay + snapshot nhánh/độ khó/chuyên đề + 1 hàm phiếu
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 09/09, chat "Check lại từ đầu theo luồng"):
--   · Trả bài phải hiện ĐỦ số liệu: % đúng theo CHUYÊN ĐỀ · % cơ bản (độ khó ≤3) / nâng cao (≥4) ·
--     % Đại / Hình ("pick từ bản đồ nào ra thì tính từ đấy; Hình và Giải tích đều là Hình; đề không
--     có câu hình thì bỏ qua") · thang kỹ năng · nhận xét · lớp đề xuất kèm GV + lịch (chỉ trên ẢNH
--     gửi PH, không trên UI trả bài).
--   · Điểm test đầu vào NHẬP RIÊNG, độc lập với Đ/C/S (như điểm MT nhập tay) → cột `ca_test.diem_nhap`.
--   · §2.0: mọi phép gom/tỉ lệ phải ở Postgres — `getBieuDoChuyenDe`/`tongDiem` trong detest.ts đang
--     cộng ở JS, thay bằng `fn_test_dau_vao_phieu` (client chỉ gọi + hiển thị).
--
-- SNAPSHOT (nguyên tắc "neo snapshot, không live-ref" của spec test đầu vào): lúc GÁN ĐỀ, client đã
--   biết câu này pick từ kho nào (registry khoCuaMon + cau_hinh.nhanhByCau) và dạng nào, nên ghi luôn
--   `nhanh` ('dai' | 'hinh'), `muc_do`, `ten_chuyen_de` vào ca_test_cau. Hàm phiếu chỉ gom trên
--   ca_test_cau + ca_test_cau_kq — KHÔNG join lại kho (đề đổi/dạng sửa sau không làm lệch phiếu cũ, và
--   không phải nhân đôi registry môn→bảng trong SQL).
--   NULL ở 3 cột này = "KHÔNG áp dụng" (câu hình theo mô hình không có muc_do; môn 1 kho không có nhánh),
--   không phải "chưa đo" — đúng §1.5.
--
-- MẤT GÌ (Luật xoá): không. Chỉ add column (nullable) + create or replace function + grant.
-- ============================================================================

alter table public.ca_test add column if not exists diem_nhap numeric;
comment on column public.ca_test.diem_nhap is 'Điểm test đầu vào do người chấm NHẬP TAY (CEO 09/09: độc lập với Đ/C/S). NULL = chưa nhập (chặn đóng chấm).';

alter table public.ca_test_cau add column if not exists nhanh text;
alter table public.ca_test_cau add column if not exists muc_do smallint;
alter table public.ca_test_cau add column if not exists ten_chuyen_de text;
alter table public.ca_test_cau drop constraint if exists ca_test_cau_nhanh_check;
alter table public.ca_test_cau add constraint ca_test_cau_nhanh_check check (nhanh is null or nhanh in ('dai', 'hinh'));
comment on column public.ca_test_cau.nhanh is 'Snapshot lúc gán đề: câu pick từ bản đồ Đại (dai) hay Hình/Hình giải tích (hinh). NULL = môn không chia nhánh.';
comment on column public.ca_test_cau.muc_do is 'Snapshot muc_do của dạng neo (1..5) lúc gán đề. ≤3 = cơ bản, ≥4 = nâng cao. NULL = không áp dụng (bài hình theo mô hình).';
comment on column public.ca_test_cau.ten_chuyen_de is 'Snapshot tên chuyên đề của dạng neo lúc gán đề.';

-- ── ĐỌC: toàn bộ số liệu phiếu kết quả 1 ca test ─────────────────────────────────────────────
-- Tỉ lệ = Σdiem / Σdiem_toi_da trên các câu ĐÃ CHẤM (có dòng kq) — Đ=1, C=0.5, S=0 (trigger
-- fn_ca_test_kq_diem). Câu chưa chấm KHÔNG vào mẫu số (§5: chưa-đo ≠ sai). Nhóm không có câu nào → null
-- (client ẩn khối đó — "không có thì bỏ qua").
create or replace function public.fn_test_dau_vao_phieu(p_ca_test_id uuid)
returns jsonb language plpgsql stable as $$
declare
  v jsonb;
begin
  with ct as (
    select c.id, c.mon, c.ngay, c.nhan_xet, c.bai_da_cham_url, c.diem_nhap, c.cham_xong_at, c.tra_bai_xong_at,
           uv.ho_ten_hs, uv.khoi, uv.lop_du_kien_id
    from ca_test c join ung_vien uv on uv.id = c.ung_vien_id
    where c.id = p_ca_test_id
  ),
  cau as (
    select cc.id, cc.thu_tu, cc.diem_toi_da, cc.ma_dang, cc.nhanh, cc.muc_do, cc.ten_chuyen_de,
           kq.ket_qua, kq.diem
    from ca_test_cau cc left join ca_test_cau_kq kq on kq.ca_test_cau_id = cc.id
    where cc.ca_test_id = p_ca_test_id
  ),
  tong as (
    select count(*) as so_cau, count(ket_qua) as da_cham,
           coalesce(sum(diem) filter (where ket_qua is not null), 0) as diem,
           coalesce(sum(diem_toi_da) filter (where ket_qua is not null), 0) as toi_da
    from cau
  ),
  theo_cd as (
    select coalesce(ten_chuyen_de, 'Khác') as chuyen_de,
           sum(diem) as diem, sum(diem_toi_da) as toi_da, count(*) as so_cau, min(thu_tu) as tt
    from cau where ket_qua is not null
    group by 1
  ),
  nhom as (
    -- 1 dòng / nhóm: co_ban · nang_cao · dai · hinh — null khi nhóm không có câu đã chấm
    select
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and muc_do is not null and muc_do <= 3) as co_ban,
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and muc_do is not null and muc_do >= 4) as nang_cao,
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and nhanh = 'dai') as dai,
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and nhanh = 'hinh') as hinh
  ),
  lop_dx as (
    select l.id, l.ten_lop,
      (select coalesce(jsonb_agg(ns.ho_ten order by pc.la_chinh desc, ns.ho_ten), '[]'::jsonb)
         from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
        where pc.lop_id = l.id and pc.vai_tro = 'gv') as gv,
      (select coalesce(jsonb_agg(jsonb_build_object('thu', t.thu, 'gioBatDau', to_char(t.gio_bat_dau, 'HH24:MI'),
                'gioKetThuc', to_char(t.gio_ket_thuc, 'HH24:MI'), 'phong', t.phong) order by t.thu, t.gio_bat_dau), '[]'::jsonb)
         from thoi_khoa_bieu t
        where t.lop_id = l.id
          and t.hieu_luc_tu <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
          and (t.hieu_luc_den is null or t.hieu_luc_den >= (now() at time zone 'Asia/Ho_Chi_Minh')::date)) as lich
    from ct join lop l on l.id = ct.lop_du_kien_id
  )
  select jsonb_build_object(
    'hoTenHs', ct.ho_ten_hs, 'khoi', ct.khoi, 'mon', ct.mon, 'ngay', ct.ngay,
    'diemNhap', ct.diem_nhap, 'chamXong', ct.cham_xong_at is not null, 'traBaiXong', ct.tra_bai_xong_at is not null,
    'tong', (select jsonb_build_object('soCau', so_cau, 'daCham', da_cham, 'diem', diem, 'toiDa', toi_da,
                                       'pct', coalesce(round(100 * diem / nullif(toi_da, 0)), 0)) from tong),
    'theoChuyenDe', (select coalesce(jsonb_agg(jsonb_build_object('chuyenDe', chuyen_de, 'diem', diem, 'toiDa', toi_da,
                        'soCau', so_cau, 'pct', coalesce(round(100 * diem / nullif(toi_da, 0)), 0)) order by tt), '[]'::jsonb) from theo_cd),
    'theoMucDo', (select jsonb_build_object('coBan', co_ban, 'nangCao', nang_cao) from nhom),
    'theoNhanh', (select jsonb_build_object('dai', dai, 'hinh', hinh) from nhom),
    'nhanXet', ct.nhan_xet, 'baiDaChamUrl', ct.bai_da_cham_url,
    'lopDeXuat', (select jsonb_build_object('id', id, 'tenLop', ten_lop, 'gv', gv, 'lich', lich) from lop_dx)
  ) into v
  from ct;
  return v; -- null nếu ca không tồn tại / RLS chặn
end $$;

grant execute on function public.fn_test_dau_vao_phieu(uuid) to authenticated;
