-- ============================================================================
-- 202611031930 — dtv_mua_bxh_chuoi_ngay   (áp: `node scripts/migrate.mjs --only 202611031930_dtv_mua_bxh_chuoi_ngay.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202611031929 (mùa BXH) tính BXH "chuỗi ngày" = chuoi_ngay cộng dồn kẹp theo số ngày từ mốc ⇒ em học HÔM NAY
--   nhưng TRƯỚC mốc vẫn hiện chuỗi 1 ngay sau reset (kiểm dưới JWT HS: 10 em đứng hạng 1). BXH phải về trống.
--   Nay SUY THẲNG từ sự kiện trong mùa: các ngày (giờ VN) em có trận (dtv_tran) hoặc lượt tháp (dtv_thap_luot) từ mốc mùa,
--   chuỗi = số ngày liền nhau kết thúc hôm nay hoặc hôm qua (cùng luật "còn sống" của chuoi_ngay cũ). Không cột mới, không ghi gì.
-- MẤT GÌ: không. Thay thân fn_dtv_bxh (giữ chữ ký + quyền).
-- ============================================================================

create or replace function public.fn_dtv_bxh(p_tieu_chi text, p_uid text default null)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare v_moc timestamptz := _dtv_mua_bat_dau(); v_nay date := _dtv_hom_nay();
begin
  perform public._dtv_kiem_uid(p_uid);
  return (with ngay as (           -- ngày có học trong mùa (chỉ dùng cho tiêu chí chuỗi ngày)
    select distinct uid, (tao_at at time zone 'Asia/Ho_Chi_Minh')::date as d from dtv_tran where p_tieu_chi = 'chuoi_ngay' and tao_at >= v_moc
    union
    select distinct uid, (tao_at at time zone 'Asia/Ho_Chi_Minh')::date from dtv_thap_luot where p_tieu_chi = 'chuoi_ngay' and tao_at >= v_moc
  ), dao as (
    select uid, d, d - (row_number() over (partition by uid order by d))::int as nhom from ngay
  ), chuoi as (    -- đảo ngày liền nhau cuối cùng, còn sống nếu kết thúc hôm nay/hôm qua
    select distinct on (uid) uid, count(*) over (partition by uid, nhom) as dai, max(d) over (partition by uid, nhom) as cuoi
    from dao order by uid, d desc
  ), g as (
    select n.uid, n.ma, n.ten, n.nv, c.cap,
           case p_tieu_chi
             when 'chuoi_thang' then n.chuoi_thang_max_mua
             when 'chuoi_ngay'  then coalesce((select ch.dai from chuoi ch where ch.uid = n.uid and ch.cuoi >= v_nay - 1), 0)
             else n.xp - n.xp_dau_mua end as gt
    from dtv_nguoi_choi n cross join lateral _dtv_cap(n.xp) c
  ), x as (
    select g.*, rank() over (order by gt desc) as hang from g where gt > 0
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'cap', cap, 'gt', gt) order by hang, ten)
                     from (select * from x order by hang, ten limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'gt', gt) from x where uid = p_uid)));
end $function$;
