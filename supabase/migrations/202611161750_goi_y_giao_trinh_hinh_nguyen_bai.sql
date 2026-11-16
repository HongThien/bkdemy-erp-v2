-- Gợi ý câu cho GIÁO TRÌNH Hình–Học theo BÀI NGUYÊN (Thùy 16/11): đề xuất đủ các ý của một bài (bài–ý) hoặc một câu đơn, KHÔNG đề xuất từng ý rời.
--   * _tl_hh_goi_y_nguyen_bai: đơn vị = bài_y (đủ mọi ý đang vào kho chuẩn của bài đang xét) hoặc câu đơn. Xếp ít dùng nhất trước (so_lan_dung lớn nhất trong các ý), rồi câu gốc, rồi thứ tự.
--     p_n = số CÂU mong muốn: lấy nguyên từng bài theo thứ tự xếp cho tới khi đủ p_n câu, không cắt dở bài (bài đầu lớn hơn p_n vẫn trả đủ).
--     Bài đã có BẤT KỲ ý nào trong p_tru (câu đang chọn trong buổi) thì không gợi ý lại cả bài.
--   * fn_tl_hh_goi_y (nút gợi ý) và fn_tl_hh_dat_bai (bài mới tự gợi ý luyện + BTVN) dùng hàm mới.
--   * _tl_hh_goi_y GIỮ NGUYÊN cho fn_tl_hh_goi_y_bai (hàng ET Hình học: mỗi hàng đúng MỘT câu).
create or replace function public._tl_hh_goi_y_nguyen_bai(p_bai text, p_n integer, p_tru text[])
 returns text[]
 language sql
 stable security definer
 set search_path to 'public'
as $f$
  with v as materialized (
         select x.ma_cau, x.la_goc, x.thu_tu, q.nhan_y, coalesce(q.bai_y, q.ma_cau) dv
           from _tl_hh_cau_chuan(p_bai) x join hinh_hoc_cau_hoi q on q.ma_cau = x.ma_cau),
       dung as materialized (select tc.ma_cau, count(*) n from tai_lieu_cau tc where tc.ma_cau in (select ma_cau from v) group by 1),
       don_vi as (
         select v.dv, count(*)::int so_y, max(coalesce(d.n, 0)) dung, bool_and(v.la_goc) la_goc, min(v.thu_tu) thu_tu
           from v left join dung d on d.ma_cau = v.ma_cau
          group by v.dv
         having not bool_or(v.ma_cau = any (coalesce(p_tru, '{}')))),
       xep as (
         select u.*, coalesce(sum(u.so_y) over (order by u.dung, (not u.la_goc), u.thu_tu, u.dv rows between unbounded preceding and 1 preceding), 0) truoc
           from don_vi u)
  select coalesce(array_agg(v.ma_cau order by x.dung, (not x.la_goc), x.thu_tu, x.dv, v.nhan_y nulls first, v.thu_tu, v.ma_cau), '{}')
    from xep x join v on v.dv = x.dv
   where x.truoc < greatest(coalesce(p_n, 0), 0)
$f$;
revoke all on function public._tl_hh_goi_y_nguyen_bai(text, integer, text[]) from public, anon;
grant execute on function public._tl_hh_goi_y_nguyen_bai(text, integer, text[]) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_tl_hh_goi_y(p_phan uuid, p_n integer)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_buoi uuid; v_bai text;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới soạn được tài liệu.' using errcode = '42501'; end if;
  select p.cha_id, p.ref_ma into v_buoi, v_bai from tai_lieu_phan p where p.id = p_phan and p.loai_phan in ('dang', 'btvn');
  if v_bai is null then raise exception 'Phần này không nhận câu bài học Hình.' using errcode = 'P0001'; end if;
  return _tl_hh_goi_y_nguyen_bai(v_bai, p_n, _tl_hh_cau_cua_buoi(v_buoi, p_phan));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_hh_dat_bai(p_tai_lieu uuid, p_buoi uuid, p_bai text[], p_so_luyen integer DEFAULT 4, p_so_btvn integer DEFAULT 4)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_b text; v_o int; v_p uuid; v_l text[];
begin
  perform _tl_hl_kiem(p_tai_lieu, p_buoi);
  if cardinality(coalesce(p_bai, '{}')) <> (select count(distinct x) from unnest(coalesce(p_bai, '{}')) x) then
    raise exception 'Một bài học bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  if exists (select 1 from unnest(coalesce(p_bai, '{}')) x where not exists (select 1 from hinh_hoc_bai b where b.ma_bai = x)) then
    raise exception 'Có mã không phải bài học Hình.' using errcode = 'P0001';
  end if;
  delete from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan in ('dang', 'btvn') and not (p.ref_ma = any (coalesce(p_bai, '{}')));
  for v_b, v_o in select x, o from unnest(coalesce(p_bai, '{}')) with ordinality as t(x, o) loop
    select p.id into v_p from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'dang' and p.ref_ma = v_b;
    if v_p is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, v_o, 'dang', v_b, p_buoi) returning id into v_p;
      v_l := _tl_hh_goi_y_nguyen_bai(v_b, p_so_luyen, _tl_hh_cau_cua_buoi(p_buoi));
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_p, m, (o - 1)::int from unnest(v_l) with ordinality as x(m, o);
    else
      update tai_lieu_phan set thu_tu = v_o where id = v_p;
    end if;
    v_p := null;
    select p.id into v_p from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'btvn' and p.ref_ma = v_b;
    if v_p is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, v_o, 'btvn', v_b, p_buoi) returning id into v_p;
      v_l := _tl_hh_goi_y_nguyen_bai(v_b, p_so_btvn, _tl_hh_cau_cua_buoi(p_buoi));
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_p, m, (o - 1)::int from unnest(v_l) with ordinality as x(m, o);
    else
      update tai_lieu_phan set thu_tu = v_o where id = v_p;
    end if;
    v_p := null;
  end loop;
  perform _tl_hl_xep(p_tai_lieu);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_hl_noi_dung(p_tai_lieu, p_buoi);
end $function$;
