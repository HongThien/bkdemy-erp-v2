-- ============================================================================
-- 202611151957 — ops_dashboard_doc_bang_tinh_san
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   fn_ops_dashboard (tab "Của tôi" app OPS) mỗi lượt mở gọi thẳng fn_ops_viec_thang(v_tu, v_den) = tính việc CẢ THÁNG của MỌI OPS
--   (spec-kien-truc.md K2: hàm client gọi chỉ được tốn theo một người). Bảng tính sẵn cho OPS đã có từ 13/11
--   (dash_viec_thang_luu loai 'ops', đọc qua _dash_viec_thang — mig 202611132233; fn_xephang_chung và fn_tich_luy đang dùng),
--   hai dashboard TA / GV đã chuyển từ 11/11 (mig 202611112200), OPS bị sót. Thấy khi soát 16 hàm dùng bảng tạm (K25) 15/11.
--   Sau: đọc _dash_viec_thang('ops', p_ym) — số cũ tối đa 10 phút, CÙNG nguồn với bảng xếp hạng chung trên cùng màn
--   (trước đây hai khối trên một màn có thể lệch nhau tới 10 phút). Trả thêm 'tinhLuc' như TA / GV để màn ghi "số tính lúc HH:MM".
--   Công thức đếm / xếp hạng / ngưỡng KHÔNG đổi một chữ. _dash_viec_thang đưa ten_viec vào cột ten_lop ⇒ khoá 'ten_lop' trong items giữ nguyên nghĩa.
--   Bảng tạm giữ nguyên (đọc 3–4 lần, vài chục–vài trăm dòng — đã soát, không cần index).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Chỉ create or replace một hàm; quyền gọi (ACL) giữ nguyên.
-- ============================================================================

-- Hàm đã bị phiên khác đổi sau khi migration này được viết ⇒ dừng, không đè.
do $$
begin
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'public.fn_ops_dashboard(text)'::regprocedure) <> '5dc2d04f2625c8a0b9164ca96916e7d5' then
    raise exception 'fn_ops_dashboard đã khác bản lúc viết migration (15/11) — đọc lại thân hàm trước khi áp.';
  end if;
end $$;

create or replace function public.fn_ops_dashboard(p_ym text)
 returns jsonb
 language plpgsql
as $function$
declare
  v_me uuid := public.current_nhan_su_id();
  c_nguong_cl constant numeric := 80;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_luc timestamptz; v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;

  create temp table _ops_items on commit drop as
  select * from public._dash_viec_thang('ops', p_ym);   -- 15/11: đọc bảng tính sẵn (≤10 phút) như TA / GV, không tính lại việc cả tháng của mọi OPS mỗi lượt mở

  create temp table _ops_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _ops_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _ops_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _ops_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ops_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han, 'anh_url', anh_url) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select k.ho_ten, k.pct, k.dat, k.den_han, ns.anh_url from _ops_tk k join public.nhan_su ns on ns.id = k.nhan_su_id
        where not k.an_xep_hang and (k.den_han >= c_nguong_rank_final or k.vol_rank <= c_nguong_rank_top)
        order by k.pct desc, k.dat desc, k.ho_ten limit 6) t;

  -- ten_lop ở đây = tên việc của OPS (_dash_viec_thang đưa ten_viec vào cột ten_lop để ba loại cùng khuôn dòng)
  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_lop, ngay, tab, kq, ly_do from _ops_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 200) x;

  select max(tinh_luc) into v_luc from _ops_items;
  drop table _ops_items, _ops_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongChatLuong', c_nguong_cl,
    'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top,
    'tinhLuc', coalesce(v_luc, now()));
end $function$;
