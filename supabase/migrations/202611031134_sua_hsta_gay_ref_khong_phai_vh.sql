-- Sửa fn_hsta_gay: gậy có ref_id KHÔNG phải việc buổi (vd 'ops:grp:ops_prep|…') làm cả hàm lỗi
-- "invalid input syntax for type uuid" — Postgres không hứa xét regex TRƯỚC phép ép ::uuid trong điều kiện nối.
-- Gặp 03/11 khi bấm TA trong Phòng làm việc trưởng khối (cũng làm hỏng màn Chất lượng vận hành ở TA có gậy loại này).
-- Thân lấy từ bản ĐANG CHẠY, chỉ đổi điều kiện nối: ép kiểu nằm trong CASE ⇒ chỉ chạy khi đúng dạng vh:.
CREATE OR REPLACE FUNCTION public.fn_hsta_gay(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(nguon text, id uuid, trang_thai text, ma_loi text, ten_loi text, so_gay integer, tre_phut integer, ly_do text, ref_key text, nguoi text, tao_at timestamp with time zone, thu_hoi_at timestamp with time zone, gan_voi text, buoi_id uuid, ngay_task date, ten_lop text, tinh_vao text, ly_do_khong_tinh text)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with g as (
    select 'so'::text as nguon, l.id, case when l.thu_hoi_at is null then 'da_vao_so' else 'da_thu_hoi' end as tt,
      lo.ma, lo.ten, l.so_gay, d.tre_phut, coalesce(l.ly_do, l.ref_mo_ta) as ly_do, l.ref_id, n.ho_ten as nguoi,
      l.created_at, l.thu_hoi_at, l.ky
    from gay_ledger l left join gay_loi lo on lo.id = l.loi_id left join gay_de_xuat d on d.ledger_id = l.id
    left join nhan_su n on n.id = l.nguoi_tao
    where l.nhan_su_id = p_ns and l.loai <> 'go' and l.so_gay > 0
    union all
    select 'de_xuat', d.id, 'cho_chot', 'cham_deadline', 'Chậm deadline trên ERP (đề xuất)', d.so_gay, d.tre_phut, d.mo_ta, d.ref_key,
      null, d.created_at, null, date_trunc('month', coalesce(d.deadline_at, d.created_at) at time zone 'Asia/Ho_Chi_Minh')::date
    from gay_de_xuat d where d.nhan_su_id = p_ns and d.trang_thai = 'cho'
  ),
  x as (
    select g.*, split_part(g.ref_id, '|', 2) as tab, b.id as bid, b.ngay as bngay, b.loai as bloai, (select lp.ten_lop from lop lp where lp.id = b.lop_id) as tlop,
      exists (select 1 from phan_cong_lop pc where pc.lop_id = b.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg' and pc.la_chinh) as ta_chinh
    from g left join buoi_hoc b
      on b.id = case when g.ref_id ~ '^vh:[0-9a-f-]{36}[|]' then substring(g.ref_id from 4 for 36)::uuid end
  )
  select x.nguon, x.id, x.tt, x.ma, x.ten, x.so_gay, coalesce(td.tre_phut, x.tre_phut), x.ly_do, x.ref_id, x.nguoi, x.created_at, x.thu_hoi_at,
    case when x.bid is null then 'ngoai_task'
         when x.bloai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') then 'bo_tro'
         when x.tab in ('btvn', 'et') then x.tab
         else 'khac_' || x.tab end,
    x.bid, x.bngay, x.tlop,
    case when x.tt <> 'da_vao_so' then null
         when x.bid is null or x.bloai <> 'thuong' or x.tab not in ('btvn', 'et') or not x.ta_chinh then null
         when x.ma = 'cham_deadline' then 'tien_do' else 'chat_luong' end,
    case when x.tt = 'cho_chot' then 'Đề xuất chưa được xác nhận'
         when x.tt = 'da_thu_hoi' then 'Đã thu hồi'
         when x.bid is null then 'Không gắn buổi học nào'
         when x.bloai <> 'thuong' then 'Gậy của ca bổ trợ — bổ trợ chấm tay'
         when x.tab not in ('btvn', 'et') then 'Không thuộc Chấm BTVN / Chấm ET'
         when not x.ta_chinh then 'Không phải lớp TA chính của người này'
    end
  from x
  left join lateral public.fn_viec_tien_do(array[x.ref_id]) td on x.ma = 'cham_deadline'
  where (x.bid is not null and x.bngay between p_tu and p_den)
     or (x.bid is null and x.ky between date_trunc('month', p_tu)::date and p_den)
  order by coalesce(x.bngay, x.ky), x.created_at;
end $function$;
