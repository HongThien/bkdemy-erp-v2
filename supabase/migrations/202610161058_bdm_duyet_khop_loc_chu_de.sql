-- B4 Duyệt khớp nằm TRONG màn Bản đồ mới (Thùy 16/10): hàng đợi lọc theo CHỦ ĐỀ đang xem để vừa duyệt vừa nhìn bản đồ.
--   · fn_bdm_khop_dem / fn_bdm_khop_hang thêm p_chu_de (NULL = cả khối). Câu chưa có chủ đề (hàng "chưa có dạng"/"thiếu dạng")
--     luôn hiện — chúng chưa thuộc chủ đề nào.
--   · fn_bdm_khop_dich thêm chuyen_de_id + nhom_id (để nút "xem trên bản đồ" nhảy đúng chỗ).
-- Hai hàm đổi chữ ký là hàm của mig 202610161046 vừa tạo hôm nay (chưa nơi nào khác gọi) ⇒ drop bản cũ rồi tạo lại.

drop function if exists fn_bdm_khop_dem(text);
drop function if exists fn_bdm_khop_hang(text, text, integer, integer);

create or replace function fn_bdm_khop_dem(p_khoi text, p_chu_de text default null) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'de_xuat', (select count(*) from _bdm_khop_nguon(p_khoi, 'de_xuat') s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'thieu',   (select count(*) from _bdm_khop_nguon(p_khoi, 'thieu')   s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'trong',   (select count(*) from _bdm_khop_nguon(p_khoi, 'trong')   s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'mau',     (select count(*) from _bdm_khop_nguon(p_khoi, 'mau')     s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'kiem_n',   (select count(*) from dai_bdm_kiem_mau k join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from dai_bdm_kiem_mau k join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                  where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
$$;

create or replace function fn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer default 30, p_offset integer default 0, p_chu_de text default null)
returns jsonb language sql stable as $$
  with s as materialized (
    select * from _bdm_khop_nguon(p_khoi, p_hang) x where p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de
  ),
  pg as (select * from s order by ma_cau limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', b.ten_dang, 'chuyen_de_cu', b.ten_chuyen_de
      ) order by pg.ma_cau)
      from pg
      join dai_cau_hoi q on q.ma_cau = pg.ma_cau
      left join dai_ban_do b on b.ma_dang = q.dang_chinh
      left join dai_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join dai_bdm_nhom n on n.id = d.nhom_id
      left join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$$;

create or replace function fn_bdm_khop_dich(p_khoi text) returns jsonb
language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dang_bai', d.ten, 'mo_ta', d.mo_ta, 'nhom', n.ten, 'nhom_id', n.id,
    'chuyen_de', ch.ten, 'chuyen_de_id', ch.id, 'chu_de', cd.ten, 'chu_de_id', cd.id
  ) order by cd.thu_tu, ch.id, n.thu_tu, d.thu_tu), '[]'::jsonb)
  from dai_bdm_chu_de cd
  join dai_bdm_nhom n on n.chu_de_id = cd.id
  join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
  join dai_bdm_dang_bai d on d.nhom_id = n.id
  where cd.khoi = p_khoi
$$;

do $$
declare f text;
begin
  foreach f in array array['fn_bdm_khop_dem(text,text)', 'fn_bdm_khop_hang(text,text,integer,integer,text)', 'fn_bdm_khop_dich(text)'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
