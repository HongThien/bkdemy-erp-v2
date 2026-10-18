-- BUILDER BẢN ĐỒ MỚI — _tl_bdm_cau_da_dung chậm dưới RLS (đo 17/10 trên app sau mig 202610172336).
-- Đo bằng phiên đăng nhập thật: _tl_bdm_cau_da_dung = 2,0 giây/lần (noi_dung cùng buổi chỉ 0,1 giây).
-- fn_tl_bdm_dat_buoi gọi nó trước MỖI lần gợi ý (5 lần cho 2 nhóm 3 dạng bài) ⇒ vẫn quá trần 8 giây.
-- Gốc: JOIN tai_lieu_cau với kết quả CTE đệ quy ⇒ planner quét cả 74k dòng tai_lieu_cau, policy la_thanh_vien()
--   chạy trên từng dòng trước khi join. Sửa: lấy id phần ra MẢNG trước, rồi `phan_id = any(mảng)` ⇒ đi index
--   idx_tlcau_phan, policy chỉ chạy trên vài chục dòng thật của buổi. Vẫn invoker + RLS (không nới quyền).
create or replace function _tl_bdm_cau_da_dung(p_buoi uuid, p_tru_phan uuid default null)
returns text[] language plpgsql stable as $$
declare v_ids uuid[];
begin
  v_ids := array(select p.id from _tl_bdm_phan_cua_buoi(p_buoi) p where p.id is distinct from p_tru_phan);
  if cardinality(v_ids) = 0 then return '{}'; end if;
  return coalesce((select array_agg(distinct tc.ma_cau) from tai_lieu_cau tc where tc.phan_id = any (v_ids)), '{}');
end $$;

revoke execute on function _tl_bdm_cau_da_dung(uuid, uuid) from public, anon;
grant execute on function _tl_bdm_cau_da_dung(uuid, uuid) to authenticated;
