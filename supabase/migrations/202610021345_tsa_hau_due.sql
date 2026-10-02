-- ============================================================================
-- tsa_hau_due
-- VÌ SAO: bản đồ TSA (làm như Toán/KHTN) cần hàm bao đóng hậu duệ của tiền đề dạng/cụm — UI chặn chu trình + sắp topo
--   gọi RPC <tiền tố>_dang_hau_due / <tiền tố>_cum_hau_due (api.ts RPC_HAU_DUE). Chép nguyên từ khtn_* (đang chạy), đổi tên bảng.
-- MẤT GÌ: không mất gì — chỉ thêm 2 hàm.
-- ============================================================================
create or replace function public.tsa_dang_hau_due(goc text)
 returns table(ma_dang text, do_sau integer)
 language sql stable
as $function$
  with recursive di as (
    select t.ma_dang as id, 1 as do_sau, array[goc, t.ma_dang] as duong
      from tsa_dang_tien_de t where t.tien_de_ma_dang = goc
    union all
    select t.ma_dang, d.do_sau + 1, d.duong || t.ma_dang
      from tsa_dang_tien_de t join di d on t.tien_de_ma_dang = d.id
     where not t.ma_dang = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$;

create or replace function public.tsa_cum_hau_due(goc text)
 returns table(ma_cum text, do_sau integer)
 language sql stable
as $function$
  with recursive di as (
    select t.ma_cum as id, 1 as do_sau, array[goc, t.ma_cum] as duong
      from tsa_cum_tien_de t where t.tien_de_ma_cum = goc
    union all
    select t.ma_cum, d.do_sau + 1, d.duong || t.ma_cum
      from tsa_cum_tien_de t join di d on t.tien_de_ma_cum = d.id
     where not t.ma_cum = any (d.duong)
  ) select id, min(do_sau)::int from di group by id;
$function$;
