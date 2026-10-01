-- FIX BUG THẬT (25/09): fn_btyeu_hoan_tat ghi buoi_danh_gia.muc_ma nhưng QUÊN ghi buoi_danh_gia.muc
-- ⇒ CHECK buoi_danh_gia_muc_ma_khop_muc_chk (muc_ma not null ⇒ muc not null và left(muc_ma,1)=muc) nổ
-- ngay lần đầu TA chọn bất kỳ mức nào để hoàn tất 1 ca bổ trợ yếu (vd Phương Chi K5, "Mức 1" → muc_ma='1a').
-- Suy muc từ muc_ma CÙNG khuôn phía client (MUC_CATALOG trong src/lib/gami.ts: ma[0] = muc) — chỉ redefine
-- hàm, thêm v_muc + ghi cột muc ở cả insert lẫn on conflict update. Toàn bộ phần còn lại giữ nguyên y hệt
-- bản 202609242330 (tick dạng đã dạy + gọi _btyeu_bu_retest).
-- MẤT GÌ (Luật xoá): không xoá gì — chỉ redefine 1 function, chữ ký không đổi.

create or replace function public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text default null, p_khong_test_ly_do text default null, p_dang_day text[] default null)
returns void language plpgsql security definer set search_path = public as $$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text; v_day text[]; v_muc smallint;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return; end if; -- idempotent
  select exists (select 1 from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test'),
         exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop')
    into v_co_test, v_test_da_nop;
  if v_co_test and not v_test_da_nop and nullif(trim(coalesce(p_khong_test_ly_do, '')), '') is null then
    raise exception 'Em chưa làm bài kiểm tra cuối buổi — nhập lý do "không test" nếu em không làm.';
  end if;
  v_nx := nullif(trim(coalesce(p_nhan_xet, '')), '');
  if v_co_test and not v_test_da_nop then v_nx := concat_ws(E'\n', '[Không test: ' || trim(p_khong_test_ly_do) || ']', v_nx); end if;
  if v_nx is null and p_muc_ma is null then raise exception 'Nhập nhận xét hoặc chọn mức.'; end if;
  -- muc PHẢI khớp chữ số đầu của muc_ma (buoi_danh_gia_muc_ma_khop_muc_chk) — cùng công thức MUC_CATALOG bên client.
  v_muc := case when p_muc_ma is null then null else left(p_muc_ma, 1)::smallint end;

  -- Thùy 24/09: buổi xong ⇒ case phải tiến. p_dang_day = dạng TA xác nhận ĐÃ DẠY buổi này (null = client cũ ⇒ giữ hành vi cũ).
  if p_dang_day is not null then
    update bo_tro_yeu_dang set day_at = null, day_buoi_id = null -- TA bỏ tick dạng máy tự đánh dấu ở buổi này
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi and dong_at is null and dat is null and not (ma_dang = any(p_dang_day));
    update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and dong_at is null and ma_dang = any(p_dang_day);
    update bo_tro_yeu_dang set dat = null -- retest trượt, dạy lại xong ⇒ chờ retest mới
      where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang = any(p_dang_day);
    v_day := p_dang_day;
  else
    select coalesce(array_agg(ma_dang), '{}') into v_day from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi;
  end if;

  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, v_muc, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, muc = excluded.muc, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  perform public._btyeu_bu_retest(p_buoi, v_day); -- mọi dạng vừa dạy đều có câu retest ⇒ không kẹt "Chờ retest"
end $$;
grant execute on function public.fn_btyeu_hoan_tat(uuid, text, text, text, text[]) to authenticated;
