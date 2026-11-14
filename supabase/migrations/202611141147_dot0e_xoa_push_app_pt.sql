-- Đợt 0e — XOÁ phần gửi push của app PT. Thùy gật 14/11 ("Xoá phần push PT") sau khi xem danh sách: không ai dùng app PT nữa.
-- Mất đúng 4 thứ: (1) trigger trg_task_pt_push_badge trên task_phat_trien · (2) hàm _trg_task_pt_push ·
-- (3) các dòng push_dang_ky app = 'pt' (đo lúc viết: 5 dòng / 5 người) · (4) nhánh 'pt' trong _push_bao_cap_nhat.
-- KHÔNG đụng: bảng task_phat_trien + dữ liệu task, màn task trên ERP, push app TA, bản thân app PT (mã nguồn / Vercel / tên miền).
drop trigger trg_task_pt_push_badge on public.task_phat_trien;
drop function public._trg_task_pt_push();
delete from public.push_dang_ky where app = 'pt';

do $do$
declare v_def text; v_cu text := E'    when ''pt'' then ''https://pt.bkacademy.edu.vn/api/push-cap-nhat''\n'; v_n int;
begin
  v_def := replace(pg_get_functiondef('public._push_bao_cap_nhat(uuid, text)'::regprocedure), E'\r\n', E'\n');
  v_n := (length(v_def) - length(replace(v_def, v_cu, ''))) / length(v_cu);
  if v_n <> 1 then raise exception '_push_bao_cap_nhat: mong đúng 1 nhánh pt, thấy %', v_n; end if;
  execute replace(v_def, v_cu, '');
  if (select prosrc from pg_proc where oid = 'public._push_bao_cap_nhat(uuid, text)'::regprocedure) like '%pt.bkacademy%' then
    raise exception 'nhánh pt vẫn còn';
  end if;
end $do$;
