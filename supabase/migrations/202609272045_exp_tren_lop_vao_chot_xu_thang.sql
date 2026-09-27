-- ============================================================================
-- 202609272045 — exp_tren_lop_vao_chot_xu_thang
-- ----------------------------------------------------------------------------
-- VÌ SAO: nguồn EXP mới 'exp_tren_lop' (game trong buổi học — mig 202609272045_xep_hang_buoi_va_game_lop) phải được
--   CHỐT THÀNH XU cuối tháng. fn_gami_exp_xu_thang liệt kê cứng các nguồn; thiếu thì EXP game không bao giờ thành xu,
--   im lặng không lỗi. Hàm này do `postgres` sở hữu (claude_build không sửa được) ⇒ file này chạy bằng SQL EDITOR.
--   Cách sửa: đọc định nghĩa ĐANG CHẠY rồi chèn 'exp_tren_lop' cạnh 'exp_btvn_thang' — không chép đè thân hàm
--   (phiên khác có thể đang sửa hàm này). Chạy lại vô hại.
--
-- MẤT GÌ (Luật xoá): KHÔNG. create or replace cùng chữ ký, chỉ thêm 1 nguồn vào danh sách.
-- ============================================================================
do $$
declare d text; n int;
begin
  select pg_get_functiondef(p.oid) into d from pg_proc p join pg_namespace s on s.oid = p.pronamespace
    where s.nspname = 'public' and p.proname = 'fn_gami_exp_xu_thang';
  if d is null then raise exception 'Không thấy fn_gami_exp_xu_thang'; end if;
  if position('exp_tren_lop' in d) > 0 then raise notice 'đã có exp_tren_lop — bỏ qua'; return; end if;
  n := (length(d) - length(replace(d, '''exp_btvn_thang''', ''))) / length('''exp_btvn_thang''');
  if n <> 1 then raise exception 'mong đúng 1 chỗ liệt kê nguồn có exp_btvn_thang, thấy % — sửa tay.', n; end if;
  execute replace(d, '''exp_btvn_thang''', '''exp_btvn_thang'', ''exp_tren_lop''');
end $$;

-- Kiểm (kỳ vọng: co_exp_tren_lop = true)
select position('exp_tren_lop' in pg_get_functiondef('public.fn_gami_exp_xu_thang(text,uuid,text)'::regprocedure)) > 0 as co_exp_tren_lop;
