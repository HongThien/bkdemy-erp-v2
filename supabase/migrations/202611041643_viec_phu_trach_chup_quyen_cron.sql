-- Cron (mig 202611041644, chạy ở SQL Editor) gọi hàm dưới vai postgres — hàm đã revoke PUBLIC nên phải cấp riêng.
grant execute on function public.fn_viec_chup_phu_trach(date) to postgres;
