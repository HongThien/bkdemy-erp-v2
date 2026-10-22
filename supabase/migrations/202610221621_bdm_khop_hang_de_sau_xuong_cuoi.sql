-- "⏭ Để sau" ở Bản đồ mới › Duyệt kho phải đưa câu xuống CUỐI CẢ HÀNG ĐỢI (Thùy 22/10).
-- Trước đây fn_bdm_khop_hang xếp theo ma_cau rồi cắt trang 20 câu ở DB; "Để sau" chỉ xếp lại trong 20 câu đã tải ở client
-- ⇒ câu tụt xuống cuối TRANG, lần nạp sau DB lại trả nó ở đầu. Giờ DB tự xếp: câu chưa để sau theo ma_cau trước,
-- câu đã để sau (kho_de_sau, doi_tuong 'bdm_khop', lần bấm gần nhất) xuống cuối, bấm trước đứng trước.
-- Chỉ đổi thứ tự — không đổi tập câu, số đếm, quyền (giữ chữ ký, LANGUAGE sql STABLE, grant cũ).

create or replace function fn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer default 30, p_offset integer default 0, p_chu_de text default null)
returns jsonb
language sql
stable
as $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from _bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'toan' and d.ma = x.ma_cau) ds on true
     where p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de
  ),
  pg as (select * from s order by (de_sau_at is not null), de_sau_at, ma_cau
          limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', b.ten_dang, 'chuyen_de_cu', b.ten_chuyen_de
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join dai_cau_hoi q on q.ma_cau = pg.ma_cau
      left join dai_ban_do b on b.ma_dang = q.dang_chinh
      left join dai_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join dai_bdm_nhom n on n.id = d.nhom_id
      left join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$;
