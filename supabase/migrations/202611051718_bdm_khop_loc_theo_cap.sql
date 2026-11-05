-- ============================================================================
-- 202611051718 — bdm_khop_loc_theo_cap
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 (Bản đồ mới › Duyệt kho, hàng «Chưa chắc"): "phạm vi hiển thị có thể chọn đến Dạng bài luôn chứ ko phải chủ đề —
--   1 filter chọn cấp chủ đề · chuyên đề · nhóm bài · dạng bài, filter còn lại hiện list tương ứng".
--   p_loc = mã của BẤT KỲ tầng nào (NCD chủ đề · NCH chuyên đề · NNB nhóm · NDB dạng bài): câu khớp khi dạng bài (AI đề xuất / đã gán)
--   của nó nằm dưới mục đó. Câu chưa có dạng bài (hàng Chưa có dạng / Thiếu dạng) chỉ lọc được ở cấp chủ đề, và — như luật cũ của
--   p_chu_de — câu chưa rõ chủ đề luôn hiện. Danh sách mục + số câu: fn_bdm_khop_loc_ds (theo thứ tự bản đồ, tôn trọng lọc nguồn).
--   Chỉ bộ Toán (fn_bdm_khop_*, Đại + HGT). Bộ KHTN fn_khtn_bdm_khop_* (mig 202611051543, phiên khác) giữ chữ ký cũ — client chỉ gửi
--   p_loc cho Toán; KHTN thêm cùng tham số khi bộ đó ổn định.
--
-- MẤT GÌ (Luật xoá): Không mất dữ liệu. drop + tạo lại 3 hàm vì THÊM tham số (fn_bdm_khop_hang / _dem / _nguon_ds) — thân giữ
--   nguyên, chỉ thêm điều kiện p_loc; client gọi theo TÊN tham số nên bản app đang chạy không vỡ.
-- ============================================================================

create or replace function _bdm_khop_trong_loc(p_loc text, p_dang_bai text, p_chu_de text) returns boolean
language sql stable as $$
  select case
    when p_loc is null then true
    when p_dang_bai is null then p_loc like 'NCD%' and (p_chu_de is null or p_chu_de = p_loc)
    else exists (select 1 from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id
                  where d.id = p_dang_bai and p_loc in (d.id, n.id, n.chuyen_de_id, n.chu_de_id))
  end
$$;

drop function if exists fn_bdm_khop_hang(text, text, integer, integer, text, text);
create or replace function fn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer default 30, p_offset integer default 0,
                                            p_chu_de text default null, p_nguon text default null, p_loc text default null)
returns jsonb language sql stable as $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from _bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'toan' and d.ma = x.ma_cau) ds on true
     where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
       and (p_nguon is null or p_nguon = any(_kho_nguon_cau(x.ma_cau)))
       and _bdm_khop_trong_loc(p_loc, x.dang_bai_id, x.chu_de_id)
  ),
  pg as (select * from s order by (de_sau_at is not null), de_sau_at, ma_cau
          limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', coalesce(b.ten_dang, hb.ten_dang), 'chuyen_de_cu', coalesce(b.ten_chuyen_de, hb.ten_chuyen_de),
        'nhanh', q.nhanh, 'nguon_tl', _kho_nguon_cau(q.ma_cau)
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join lateral (
        select c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.dang_chinh, 'dai'::text as nhanh
          from dai_cau_hoi c where c.ma_cau = pg.ma_cau
        union all
        select c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.dang_chinh, 'hgt'::text
          from hgt_cau_hoi c where c.ma_cau = pg.ma_cau
      ) q on true
      left join dai_ban_do b on b.ma_dang = q.dang_chinh and q.nhanh = 'dai'
      left join hgt_ban_do hb on hb.ma_dang = q.dang_chinh and q.nhanh = 'hgt'
      left join dai_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join dai_bdm_nhom n on n.id = d.nhom_id
      left join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$;

drop function if exists fn_bdm_khop_dem(text, text, text);
create or replace function fn_bdm_khop_dem(p_khoi text, p_chu_de text default null, p_nguon text default null, p_loc text default null)
returns jsonb language sql stable as $function$
  with h as (select * from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h),
  s as (
    select h.h, count(s.*) n
      from h left join lateral (
        select x.* from _bdm_khop_nguon(p_khoi, h.h) x
         where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
           and (p_nguon is null or p_nguon = any(_kho_nguon_cau(x.ma_cau)))
           and _bdm_khop_trong_loc(p_loc, x.dang_bai_id, x.chu_de_id)) s on true
     group by h.h
  )
  select jsonb_build_object(
    'de_xuat', (select n from s where h = 'de_xuat'),
    'thieu',   (select n from s where h = 'thieu'),
    'trong',   (select n from s where h = 'trong'),
    'mau',     (select n from s where h = 'mau'),
    'kiem_n',   (select count(*) from (
                   select k.ma_cau, k.dang_bai_ai_id from dai_bdm_kiem_mau k union all select k.ma_cau, k.dang_bai_ai_id from hgt_bdm_kiem_mau k) k
                   join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from (
                   select k.ma_cau, k.dang_bai_ai_id, k.ket_qua from dai_bdm_kiem_mau k union all select k.ma_cau, k.dang_bai_ai_id, k.ket_qua from hgt_bdm_kiem_mau k) k
                   join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                  where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
$function$;

drop function if exists fn_bdm_khop_nguon_ds(text, text, text);
create or replace function fn_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text default null, p_loc text default null)
returns table(nguon text, so_cau bigint) language sql stable as $$
  select n, count(*) from _bdm_khop_nguon(p_khoi, p_hang) s, unnest(_kho_nguon_cau(s.ma_cau)) n
   where (p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de)
     and _bdm_khop_trong_loc(p_loc, s.dang_bai_id, s.chu_de_id)
   group by n order by n
$$;

-- Mục ở một CẤP (chu_de | chuyen_de | nhom | dang_bai) đang có câu trong hàng — cho ô chọn phạm vi; theo thứ tự bản đồ
create or replace function fn_bdm_khop_loc_ds(p_khoi text, p_hang text, p_cap text, p_nguon text default null)
returns table(id text, ten text, duong text, so_cau bigint) language sql stable as $$
  with s as (
    select x.ma_cau, x.dang_bai_id, coalesce(n.chu_de_id, x.chu_de_id) cd_id, n.chuyen_de_id cx_id, n.id nh_id
      from _bdm_khop_nguon(p_khoi, p_hang) x
      left join dai_bdm_dang_bai d on d.id = x.dang_bai_id
      left join dai_bdm_nhom n on n.id = d.nhom_id
     where p_nguon is null or p_nguon = any(_kho_nguon_cau(x.ma_cau))
  ),
  k as (
    select case p_cap when 'chu_de' then cd_id when 'chuyen_de' then cx_id when 'nhom' then nh_id when 'dang_bai' then dang_bai_id end id,
           count(*) so_cau
      from s group by 1
  )
  select k.id,
         coalesce(d.ten, n.ten, cx.ten, cd.ten) ten,
         case p_cap
           when 'chuyen_de' then cd2.ten
           when 'nhom'      then cd3.ten || ' › ' || cx3.ten
           when 'dang_bai'  then cd4.ten || ' › ' || cx4.ten || ' › ' || n4.ten
         end duong,
         k.so_cau
    from k
    left join dai_bdm_chu_de cd on p_cap = 'chu_de' and cd.id = k.id
    left join dai_bdm_chuyen_de cx on p_cap = 'chuyen_de' and cx.id = k.id
    left join lateral (select o.chu_de_id, o.thu_tu from dai_bdm_o o join dai_bdm_chu_de c on c.id = o.chu_de_id
                        where p_cap = 'chuyen_de' and o.chuyen_de_id = k.id order by c.thu_tu, o.thu_tu limit 1) o2 on true   -- chuyên đề dùng chung 2 chủ đề: 1 dòng
    left join dai_bdm_chu_de cd2 on cd2.id = o2.chu_de_id
    left join dai_bdm_nhom n on p_cap = 'nhom' and n.id = k.id
    left join dai_bdm_chu_de cd3 on cd3.id = n.chu_de_id
    left join dai_bdm_chuyen_de cx3 on cx3.id = n.chuyen_de_id
    left join dai_bdm_o o3 on o3.chu_de_id = n.chu_de_id and o3.chuyen_de_id = n.chuyen_de_id
    left join dai_bdm_dang_bai d on p_cap = 'dang_bai' and d.id = k.id
    left join dai_bdm_nhom n4 on n4.id = d.nhom_id
    left join dai_bdm_chu_de cd4 on cd4.id = n4.chu_de_id
    left join dai_bdm_chuyen_de cx4 on cx4.id = n4.chuyen_de_id
    left join dai_bdm_o o4 on o4.chu_de_id = n4.chu_de_id and o4.chuyen_de_id = n4.chuyen_de_id
   where k.id is not null
   order by coalesce(cd.thu_tu, cd2.thu_tu, cd3.thu_tu, cd4.thu_tu), coalesce(o2.thu_tu, o3.thu_tu, o4.thu_tu), coalesce(n.thu_tu, n4.thu_tu), d.thu_tu, 2
$$;

revoke execute on function _bdm_khop_trong_loc(text, text, text), fn_bdm_khop_hang(text, text, integer, integer, text, text, text),
  fn_bdm_khop_dem(text, text, text, text), fn_bdm_khop_nguon_ds(text, text, text, text), fn_bdm_khop_loc_ds(text, text, text, text) from public;
grant execute on function _bdm_khop_trong_loc(text, text, text), fn_bdm_khop_hang(text, text, integer, integer, text, text, text),
  fn_bdm_khop_dem(text, text, text, text), fn_bdm_khop_nguon_ds(text, text, text, text), fn_bdm_khop_loc_ds(text, text, text, text) to authenticated;
