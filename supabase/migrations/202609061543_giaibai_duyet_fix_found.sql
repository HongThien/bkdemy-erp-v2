-- 202609061543 — giaibai_duyet_fix_found
-- BUG lộ khi verify tay mig 202609061526 (nhận → nộp → duyệt, rollback): fn_giaibai_duyet luôn ném "Bài không
-- ở trạng thái chờ duyệt" dù dòng đúng là cho_duyet (SELECT tay cùng điều kiện trả 1 dòng). Nguyên nhân: kiểm
-- bằng `IF NOT FOUND` ngay sau `EXECUTE … INTO` — cùng họ bẫy đã vá ở 202609060200 cho tra/luu_nhap/nop
-- (FOUND sau EXECUTE không đáng tin). E2E hôm 06/09 CHỈ test từ chối/trả, CHƯA test duyệt-thành-công nên
-- không lộ (DEVLOG 202609060122 còn ghi "fn_giaibai_duyet dùng EXECUTE … INTO nên FOUND đúng" — sai).
-- Vá: kiểm `v_key is null` (khoá không bao giờ null với dòng thật) — không phụ thuộc FOUND.
-- MẤT GÌ (Luật xoá): không — create-or-replace, giữ chữ ký + toàn bộ logic Giải/Hoàn thiện của 202609061526.
create or replace function public.fn_giaibai_duyet(p_nhanh text, p_id uuid, p_me uuid) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); t text; v_key text; v_nguoi uuid; v_lg text; v_anh text; v_da text; v_che_do text; n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_duyet: nhánh không hợp lệ %', p_nhanh; end if;
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh) then raise exception 'Chỉ team học thuật môn % mới duyệt được.', public.fn_giaibai_mon(p_nhanh); end if;
  execute format('select %I::text, nguoi_giai, loi_giai_nhap, anh_nhap, dap_an_nhap, che_do from %I where id = $1 and xu_ly_at is null and trang_thai = ''cho_duyet'' for update', r.key_col, r.yc)
    into v_key, v_nguoi, v_lg, v_anh, v_da, v_che_do using p_id;
  -- KHÔNG dùng FOUND sau EXECUTE INTO (bẫy 202609060200) — khoá null ⇔ không có dòng.
  if v_key is null then raise exception 'Bài không ở trạng thái chờ duyệt.'; end if;
  if v_nguoi = p_me then raise exception 'Không tự duyệt bài mình giải.'; end if;
  if p_nhanh in ('toan','khtn','hgt') then
    t := public.fn_kho_tbl(p_nhanh) || '_cau_hoi';
    if v_che_do = 'hoan_thien' then
      -- Hoàn thiện: câu ĐANG LÀ bản Claude claude_code chưa duyệt (BẮT BUỘC đang có loi_giai — tiền đề của chế độ).
      execute format('update %I set loi_giai = $2, anh_dap_an = coalesce(anh_dap_an, $3), dap_an = coalesce($4, dap_an), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                      where ma_cau = $1 and xoa_at is null and nguon_giai = ''ai'' and giai_method = ''claude_code'' and da_duyet = false', t)
        using v_key, v_lg, v_anh, nullif(v_da, ''), p_me;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Câu % không còn ở trạng thái "Claude đã giải, chưa duyệt" — có thể đã bị duyệt/sửa nơi khác.', v_key; end if;
    else
      execute format('update %I set loi_giai = $2, anh_dap_an = $3, dap_an = coalesce(dap_an, $4), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                      where ma_cau = $1 and xoa_at is null and loi_giai is null and anh_dap_an is null', t)
        using v_key, v_lg, v_anh, v_da, p_me;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Câu % đã có lời giải trong lúc chờ — không ghi đè. Từ chối bài này hoặc trả bài.', v_key; end if;
    end if;
  else
    if v_che_do = 'hoan_thien' then
      -- Hoàn thiện Hình: UPDATE thẳng dòng đã có (KHÔNG qua fn_hinh_ghi_loi_giai — hàm đó viết cho câu TRỐNG).
      if p_nhanh = 'hinh_baitoan' then
        update hinh_cach_giai set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
          where baitoan_id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
      else
        update hinh_baitoan_bien_the set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
          where id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
      end if;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Bài % không còn ở trạng thái "Claude đã giải, chưa duyệt".', v_key; end if;
    else
      -- Giải Hình: đóng dòng nhận TRƯỚC (fn_hinh_ghi_loi_giai xoá dòng mở khi nguon='nguoi'), rồi ghi, rồi đóng dấu duyệt.
      execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
      perform public.fn_hinh_ghi_loi_giai(case when p_nhanh = 'hinh_baitoan' then 'baitoan' else 'bien_the' end, v_key::uuid, v_lg, v_anh, 'nguoi');
      if p_nhanh = 'hinh_baitoan' then
        update hinh_cach_giai set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta'
          where baitoan_id = v_key::uuid and nguon_giai = 'nguoi' and (loi_giai is not null or anh_loi_giai is not null) and da_duyet = false;
      else
        update hinh_baitoan_bien_the set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta' where id = v_key::uuid;
      end if;
      return;
    end if;
  end if;
  execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
end $$;
grant execute on function public.fn_giaibai_duyet(text, uuid, uuid) to authenticated;
