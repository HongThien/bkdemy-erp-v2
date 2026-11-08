-- ============================================================================
-- 202610271540 — bdm_kho_cau_xoa_chuyen_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 27/10 "Tính năng mới: cho phép xoá câu trong kho — chuyển câu trong kho sang dạng mới" (ngăn 📚 Kho câu của Bản đồ mới,
--   trước chỉ xem). Xoá = KHO RÁC (xoa_at — CLAUDE §2: tham chiếu bằng text cấm xoá cứng; khôi phục ở màn Kho rác; trigger
--   log_kho_cau tự ghi vết + actor). Chuyển dạng = ghi đè GÁN của người qua đúng 1 đường có sẵn _bdm_nguoi_gan_cau (chặn câu
--   đã xoá, Đúng/Sai, khác nhánh, khối chưa chạy bản đồ mới); mặc định chuyển kèm mọi bản sao của câu gốc.
--   Danh sách kho (fn_bdm_kho_cau) không trả bảng gốc của câu ⇒ 2 RPC tự tra câu ở kho Đại hay HGT.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 2 hàm. (Xoá câu qua hàm = kho rác, khôi phục được.)
-- ============================================================================

-- kho gốc của 1 câu bản đồ mới: 'dai' | 'hgt' | null
create or replace function _bdm_kho_cua_cau(p_ma_cau text) returns text
language sql stable as $$
  select case when exists (select 1 from dai_cau_hoi where ma_cau = p_ma_cau) then 'dai'
              when exists (select 1 from hgt_cau_hoi where ma_cau = p_ma_cau) then 'hgt' end
$$;

-- Chuyển 1 câu sang dạng bài khác (người chọn) — trả tên dạng bài + nhóm + chủ đề để màn báo lại
-- p_ca_ban_sao ⇒ chuyển luôn mọi bản sao còn sống của câu gốc (bản sao có thể đã có gán riêng — vd ghi gán từng câu 26/10)
create or replace function fn_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean default true) returns jsonb
language plpgsql set search_path to 'public' as $$
declare v_kho text := public._bdm_kho_cua_cau(p_ma_cau); v jsonb; r record; v_n integer := 1;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if v_kho is null then raise exception 'Không thấy câu % ở kho Đại / Hình giải tích', p_ma_cau; end if;
  perform public._bdm_nguoi_gan_cau(v_kho, p_ma_cau, p_dang_bai);
  if p_ca_ban_sao then
    for r in execute format('select ma_cau from %I where parent_ma_cau = $1 and xoa_at is null', v_kho || '_cau_hoi') using p_ma_cau loop
      perform public._bdm_nguoi_gan_cau(v_kho, r.ma_cau, p_dang_bai); v_n := v_n + 1;
    end loop;
  end if;
  select jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'so_cau', v_n) into v
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where d.id = p_dang_bai;
  return v;
end $$;

-- Đưa câu vào KHO RÁC (xoa_at); p_ca_ban_sao ⇒ kèm mọi bản sao của câu gốc đó. Trả số câu đã đưa vào kho rác.
create or replace function fn_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean default false) returns integer
language plpgsql set search_path to 'public' as $$
declare v_kho text := public._bdm_kho_cua_cau(p_ma_cau); v integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if v_kho is null then raise exception 'Không thấy câu % ở kho Đại / Hình giải tích', p_ma_cau; end if;
  execute format('update %I set xoa_at = now() where xoa_at is null and (ma_cau = $1 or ($2 and parent_ma_cau = $1))', v_kho || '_cau_hoi')
    using p_ma_cau, p_ca_ban_sao;
  get diagnostics v = row_count;
  return v;
end $$;

revoke execute on function fn_bdm_cau_chuyen_dang(text, text, boolean) from public, anon;
revoke execute on function fn_bdm_cau_xoa(text, boolean) from public, anon;
grant execute on function fn_bdm_cau_chuyen_dang(text, text, boolean) to authenticated;
grant execute on function fn_bdm_cau_xoa(text, boolean) to authenticated;
