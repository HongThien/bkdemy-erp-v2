-- LỌC THEO NGUỒN TÀI LIỆU ở các màn duyệt kho (Thùy 27/10: "t dùng tài liệu của nhiều loại khác nhau: 1. Đề thi 2. Đề cương
-- 3. Sách tham khảo của các tác giả — mỗi tác giả coi là 1 nguồn. T sẽ duyệt theo từng loại để tránh đụng tài liệu không phù hợp").
-- Nguồn của 1 câu (Đại / HGT) = mảng khoá, bản sao lấy theo câu gốc:
--   'de_thi'   — câu nằm trong tài liệu loại de_thi (Kho đề thi, tab Đề thi) — hoặc nhập theo luồng đề thi mà không còn đề chứa
--   'de_cuong' — câu nằm trong tài liệu de_thi có cau_hinh.deThi.kieu = 'de_cuong' (tab Đề cương)
--   'sach:<tác giả>' — câu nhập từ sách/tài liệu tham khảo (ten_de_goc = "<tên sách> · <vị trí>"), tác giả suy từ tên sách
--   'kho_cu'   — còn lại (kho cũ nhập qua ERP)
-- Một câu có thể vừa 'de_thi' vừa 'de_cuong'. Không đổi dữ liệu nào.

-- Tên sách → tác giả (một chỗ duy nhất; sách chưa rõ tác giả giữ tên sách). Thêm sách mới = thêm 1 dòng when.
create or replace function _kho_nguon_tac_gia(p_sach text) returns text
language sql immutable as $$
  select case
    when p_sach is null or btrim(p_sach) = '' then 'Tài liệu khác'
    when p_sach ~* '^(sách\s+)?NBV' then 'Nguyễn Bảo Vương'
    when p_sach ~* '^PNL' then 'Phan Nhật Linh'
    when p_sach ~* 'Nguyễn Đức Tấn' then 'Nguyễn Đức Tấn'
    when p_sach ~* 'Trần Thị Vân Anh' then 'Trần Thị Vân Anh'
    when p_sach ~* 'T[ừứ] Tâm' then 'Toán Từ Tâm'
    when p_sach ~* '^Toán arc 4' then 'Toán arc 4'
    when p_sach ~* '^Toán 5 TLTK' then 'Toán 5 TLTK'
    when p_sach ~* '^Clone 4T' then 'Nhân bản 4T (BK)'
    else btrim(p_sach)
  end
$$;

create or replace function _kho_nguon_cau(p_ma text) returns text[]
language sql stable as $$
  with c as (
    select q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau) goc, q.parent_ma_cau, q.nguon, q.nguon_loai, q.ten_de_goc, 'dai'::text kho, b.khoi
      from dai_cau_hoi q left join dai_ban_do b on b.ma_dang = q.dang_chinh where q.ma_cau = p_ma
    union all
    select q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau), q.parent_ma_cau, q.nguon, null, q.ten_de_goc, 'hgt', null
      from hgt_cau_hoi q where q.ma_cau = p_ma
  ),
  g as (
    select c.*, coalesce(c.ten_de_goc,
             (select p.ten_de_goc from dai_cau_hoi p where p.ma_cau = c.parent_ma_cau
              union all select p.ten_de_goc from hgt_cau_hoi p where p.ma_cau = c.parent_ma_cau limit 1)) ten
      from c
  ),
  de as (
    select distinct case when t.cau_hinh->'deThi'->>'kieu' = 'de_cuong' then 'de_cuong' else 'de_thi' end k
      from g
      join tai_lieu_cau tc on tc.ma_cau in (g.ma_cau, g.goc)
      join tai_lieu_phan p on p.id = tc.phan_id
      join tai_lieu t on t.id = p.tai_lieu_id and t.loai = 'de_thi'
  )
  select coalesce((select array_agg(k order by k) from (
      select k from de
      union
      select 'de_thi' from g
       where not exists (select 1 from de) and ((g.kho = 'dai' and g.nguon_loai = 'de_thi') or (g.kho = 'hgt' and g.nguon = 'de_thi'))
      union
      select 'sach:' || case when g.kho = 'dai' and g.ten is null and g.khoi = '12' then 'K12 NH-TP 10/10 (PNL · NBV · Từ Tâm)'
                             else _kho_nguon_tac_gia(split_part(g.ten, ' · ', 1)) end
        from g
       where not exists (select 1 from de)
         and ((g.kho = 'dai' and g.nguon_loai = 'tai_lieu') or (g.kho = 'hgt' and g.nguon <> 'de_thi' and g.ten like '% · %'))
    ) x), array['kho_cu'])
$$;

-- Nguồn của một danh sách câu (màn Duyệt câu / Đúng-Sai tải đủ hàng rồi lọc theo lựa chọn nguồn)
create or replace function fn_kho_nguon_cau_ds(p_ma text[]) returns table(ma_cau text, nguon text[])
language sql stable as $$
  select m, _kho_nguon_cau(m) from unnest(p_ma) m
$$;

-- ═══ Bản đồ mới › Duyệt kho: thêm p_nguon (null = mọi nguồn) ═══
drop function if exists fn_bdm_khop_hang(text, text, integer, integer, text);
create or replace function fn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer default 30, p_offset integer default 0,
                                            p_chu_de text default null, p_nguon text default null)
returns jsonb language sql stable as $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from _bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'toan' and d.ma = x.ma_cau) ds on true
     where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
       and (p_nguon is null or p_nguon = any(_kho_nguon_cau(x.ma_cau)))
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

drop function if exists fn_bdm_khop_dem(text, text);
create or replace function fn_bdm_khop_dem(p_khoi text, p_chu_de text default null, p_nguon text default null)
returns jsonb language sql stable as $function$
  select jsonb_build_object(
    'de_xuat', (select count(*) from _bdm_khop_nguon(p_khoi, 'de_xuat') s where (p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de) and (p_nguon is null or p_nguon = any(_kho_nguon_cau(s.ma_cau)))),
    'thieu',   (select count(*) from _bdm_khop_nguon(p_khoi, 'thieu')   s where (p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de) and (p_nguon is null or p_nguon = any(_kho_nguon_cau(s.ma_cau)))),
    'trong',   (select count(*) from _bdm_khop_nguon(p_khoi, 'trong')   s where (p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de) and (p_nguon is null or p_nguon = any(_kho_nguon_cau(s.ma_cau)))),
    'mau',     (select count(*) from _bdm_khop_nguon(p_khoi, 'mau')     s where (p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de) and (p_nguon is null or p_nguon = any(_kho_nguon_cau(s.ma_cau)))),
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

-- Các nguồn đang có trong một hàng (kèm số câu) — cho ô chọn nguồn
create or replace function fn_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text default null)
returns table(nguon text, so_cau bigint) language sql stable as $$
  select n, count(*) from _bdm_khop_nguon(p_khoi, p_hang) s, unnest(_kho_nguon_cau(s.ma_cau)) n
   where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de
   group by n order by n
$$;

revoke execute on function _kho_nguon_tac_gia(text), _kho_nguon_cau(text), fn_kho_nguon_cau_ds(text[]),
  fn_bdm_khop_hang(text, text, integer, integer, text, text), fn_bdm_khop_dem(text, text, text), fn_bdm_khop_nguon_ds(text, text, text) from public;
grant execute on function _kho_nguon_tac_gia(text), _kho_nguon_cau(text), fn_kho_nguon_cau_ds(text[]),
  fn_bdm_khop_hang(text, text, integer, integer, text, text), fn_bdm_khop_dem(text, text, text), fn_bdm_khop_nguon_ds(text, text, text) to authenticated;
