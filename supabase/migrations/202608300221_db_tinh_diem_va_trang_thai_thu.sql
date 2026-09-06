-- ============================================================================
-- 202608300221 — Phase 1 (đợt 1/5) chiến dịch §2.0: 3 gốc "tính client rồi ghi DB"
--                chuyển thành TRIGGER — công thức rời khỏi browser.
-- ----------------------------------------------------------------------------
-- VÌ SAO: CLAUDE.md §2.0 (CEO 30/08) — mọi tính toán nghiệp vụ ở Postgres, client
--   chỉ gọi hàm sẵn. Ba gốc này chọn đi đầu vì công thức NHỎ, kiểm chứng parity
--   được ngay trên data thật, và đều là loại "client sai là DB giữ số sai vĩnh viễn":
--   ① điểm chấm test đầu vào (detest.ts chamCauTest tự nhân hệ số rồi upsert)
--   ② trạng thái thu tiền hoá đơn (hocphi.ts ghiThanhToan đọc-cộng-suy-update —
--      2 tab thu tiền song song là ghi đè nhau)
--   ③ điểm + verdict MT (thanhtich.ts tinhDiemMT/verdictTuDiem tính ở JS rồi
--      upsert — điểm này nuôi Level → xu lương)
--   Sau migration: client CHỈ ghi dữ kiện thô (ket_qua · dòng thanh_toan · cơ
--   bản/nâng cao/full) — DB tự suy phần còn lại, trong CÙNG transaction với ghi.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu. Chỉ THÊM function/trigger. Giá trị cột
--   diem/verdict/trang_thai từ nay do trigger quyết — client gửi gì ở các cột đó
--   cũng bị đè (đó là chủ đích: một nguồn công thức).
-- ============================================================================

-- ── ① Điểm chấm test đầu vào: diem = diem_toi_da × hệ số kết quả ─────────────
-- (correct=1 · partial=0.5 · wrong=0 — y nguyên HE_SO của detest.ts)
create or replace function public.fn_ca_test_kq_diem() returns trigger
language plpgsql as $$
begin
  select c.diem_toi_da * case new.ket_qua when 'correct' then 1 when 'partial' then 0.5 else 0 end
    into new.diem
  from ca_test_cau c where c.id = new.ca_test_cau_id;
  return new;
end $$;
drop trigger if exists tg_ca_test_kq_diem on ca_test_cau_kq;
create trigger tg_ca_test_kq_diem before insert or update of ket_qua, ca_test_cau_id
  on ca_test_cau_kq for each row execute function public.fn_ca_test_kq_diem();

-- ── ② Trạng thái thu tiền hoá đơn: suy từ Σ thanh_toan, trong DB ─────────────
-- Y nguyên ngữ nghĩa JS cũ (đè không điều kiện — qua_han đã thu đủ cũng về da_thu),
-- nhưng giờ NGUYÊN TỬ theo từng dòng thanh toán: hết cảnh 2 tab đọc-cộng-suy đè nhau.
create or replace function public.fn_hoa_don_cap_nhat_trang_thai() returns trigger
language plpgsql as $$
declare
  v_hoa_don uuid := coalesce(new.hoa_don_id, old.hoa_don_id);
  v_da_thu numeric;
  v_tong numeric;
begin
  select coalesce(sum(so_tien), 0) into v_da_thu from thanh_toan where hoa_don_id = v_hoa_don;
  select tong_tien into v_tong from hoa_don where id = v_hoa_don;
  update hoa_don set trang_thai = case
    when v_da_thu >= v_tong then 'da_thu'
    when v_da_thu > 0 then 'thu_mot_phan'
    else 'chua_thu' end
  where id = v_hoa_don and trang_thai <> 'mien'; -- miễn thì đứng yên (JS cũ không có ca này — hoá đơn miễn không ai ghi thanh toán)
  return coalesce(new, old);
end $$;
drop trigger if exists tg_thanh_toan_trang_thai on thanh_toan;
create trigger tg_thanh_toan_trang_thai after insert or update or delete
  on thanh_toan for each row execute function public.fn_hoa_don_cap_nhat_trang_thai();

-- ── ③ Điểm + verdict MT: suy từ cơ bản/nâng cao/full ─────────────────────────
-- Chỉ tự tính khi dòng có dữ kiện MT (full_diem hoặc có điểm cơ bản/nâng cao) —
-- kỳ thi trường/khảo sát nhập diem thẳng + verdict staff duyệt thì giữ nguyên đường cũ.
-- Công thức y nguyên thanhtich.ts: full→10 · tổng ≥10→9.75 · round 2 chữ số;
-- verdict: ≥8 đạt · ≥6.5 gần đạt · còn lại không đạt.
create or replace function public.fn_diem_thi_tinh() returns trigger
language plpgsql as $$
declare
  v_tong numeric;
begin
  if new.full_diem or new.diem_co_ban is not null or new.diem_nang_cao is not null then
    if new.full_diem then
      new.diem := 10;
    else
      v_tong := coalesce(new.diem_co_ban, 0) + coalesce(new.diem_nang_cao, 0);
      new.diem := case when v_tong >= 10 then 9.75 else round(v_tong, 2) end;
    end if;
    new.verdict := case when new.diem >= 8 then 'dat' when new.diem >= 6.5 then 'gan_dat' else 'khong_dat' end;
  end if;
  return new;
end $$;
drop trigger if exists tg_diem_thi_tinh on diem_thi;
create trigger tg_diem_thi_tinh before insert or update
  on diem_thi for each row execute function public.fn_diem_thi_tinh();
