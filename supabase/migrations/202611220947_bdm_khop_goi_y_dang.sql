-- Duyệt kho › Bản đồ mới (Thùy 22/11): câu "Chưa chắc" / "Chưa có dạng" hiện sẵn các DẠNG BÀI mà hệ đang phân vân để người duyệt tích một phát,
-- chỉ khi mọi gợi ý đều sai mới phải gõ tên. Hàm đọc, KHÔNG ghi gì: nhận danh sách mã câu của trang đang hiện (≤ 100), trả gợi ý từng câu.
-- Nguồn gợi ý (theo thứ tự ưu tiên, bỏ trùng, tối đa p_n dạng / câu):
--   1. phan_van  — mã dạng NDBxxxxx AI nêu trong lý do đề xuất ("LỆCH: người 1 → NDB…; người 2 → NDB…", "máy chọn NDB…").
--   2. ban_do_cu — đối ứng bản đồ cũ → mới (dai_bdm_doi_ung theo dạng cũ của câu · dai_bdm_doi_ung_cum theo cụm cũ).
--   3. tu_khoa   — khớp từ khoá giữa đề và tên + mô tả dạng của khối (trọng số IDF; bỏ từ xuất hiện ở > 20% dạng). Chỉ là gợi ý, người duyệt quyết.
-- Chỉ bộ Toán (Đại + Hình giải tích, cùng cây dai_bdm_*). Quyền: người đăng nhập (mặc định đóng với anon). Không đổi dữ liệu nào.

create or replace function public.fn_bdm_khop_goi_y(p_khoi text, p_ma_cau text[], p_n integer default 6)
returns jsonb
language sql
stable
as $fn$
  with ma as (
    select distinct m from unnest(coalesce(p_ma_cau, '{}'::text[])) m limit 100
  ),
  cau as (
    select c.ma_cau, c.dang_chinh, c.ma_cum, c.noi_dung
      from dai_cau_hoi c join ma on ma.m = c.ma_cau
    union all
    select c.ma_cau, c.dang_chinh, null::text, c.noi_dung
      from hgt_cau_hoi c join ma on ma.m = c.ma_cau
  ),
  dang as (
    select d.id, d.ten, d.mo_ta, n.id as nhom_id, n.ten as nhom, ch.ten as chuyen_de
      from dai_bdm_chu_de cd
      join dai_bdm_nhom n on n.chu_de_id = cd.id
      join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
      join dai_bdm_dang_bai d on d.nhom_id = n.id
     where cd.khoi = p_khoi
  ),
  -- 1. dạng AI nêu trong lý do đề xuất
  ly as (
    select x.ma_cau, x.ly_do from dai_bdm_de_xuat x join ma on ma.m = x.ma_cau
    union all
    select x.ma_cau, x.ly_do from hgt_bdm_de_xuat x join ma on ma.m = x.ma_cau
  ),
  s1 as (
    select ly.ma_cau, g[1] as id, 1 as pri, 0::float8 as diem
      from ly, regexp_matches(ly.ly_do, '(NDB[0-9]{5})', 'g') g
  ),
  -- 2. đối ứng bản đồ cũ → mới
  s2 as (
    select c.ma_cau, d.id, 2 as pri, 0::float8 as diem
      from cau c
      join dai_bdm_doi_ung u on u.ma_dang_cu = c.dang_chinh
      join dang d on d.id = u.dich_dang_bai or d.nhom_id = u.dich_nhom
    union all
    select c.ma_cau, u.dang_bai_id, 2, 0::float8
      from cau c join dai_bdm_doi_ung_cum u on u.ma_cum_cu = c.ma_cum
  ),
  -- 3. khớp từ khoá (IDF trên chính tập dạng của khối)
  td as (
    select d.id, w
      from dang d,
           lateral (select distinct w from regexp_split_to_table(regexp_replace(lower(d.ten || ' ' || coalesce(d.mo_ta, '')), '[^[:alpha:]]+', ' ', 'g'), ' ') w where length(w) >= 3) t
  ),
  nd as (select count(*)::float8 as n from dang),
  df as (select w, count(*)::float8 as k from td group by w),
  tc as (
    select c.ma_cau, w
      from cau c,
           lateral (select distinct w from regexp_split_to_table(regexp_replace(lower(regexp_replace(coalesce(c.noi_dung, ''), '\$[^$]*\$', ' ', 'g')), '[^[:alpha:]]+', ' ', 'g'), ' ') w where length(w) >= 3) t
  ),
  s3 as (
    select tc.ma_cau, td.id, 3 as pri, sum(ln(nd.n / df.k)) as diem
      from tc
      join td on td.w = tc.w
      join df on df.w = tc.w
      cross join nd
     where df.k <= 0.2 * nd.n
     group by tc.ma_cau, td.id
    having sum(ln(nd.n / df.k)) >= 3
  ),
  tat as (
    select ma_cau, id, min(pri) as pri, max(diem) as diem
      from (select * from s1 union all select * from s2 union all select * from s3) u
     where id in (select id from dang)
     group by ma_cau, id
  ),
  xep as (
    select t.*, row_number() over (partition by t.ma_cau order by t.pri, t.diem desc, t.id) as rn
      from tat t
  )
  select coalesce(jsonb_object_agg(g.ma_cau, g.ds), '{}'::jsonb)
    from (
      select x.ma_cau,
             jsonb_agg(jsonb_build_object(
               'id', x.id, 'dang_bai', d.ten, 'nhom', d.nhom, 'chuyen_de', d.chuyen_de,
               'nguon', case x.pri when 1 then 'phan_van' when 2 then 'ban_do_cu' else 'tu_khoa' end
             ) order by x.rn) as ds
        from xep x join dang d on d.id = x.id
       where x.rn <= greatest(p_n, 1)
       group by x.ma_cau
    ) g
   where public.la_thanh_vien()
$fn$;

comment on function public.fn_bdm_khop_goi_y(text, text[], integer) is
  'Gợi ý dạng bài cho câu ở màn Duyệt kho (bản đồ mới, Toán): phan_van (AI nêu trong lý do) > ban_do_cu (đối ứng cũ→mới) > tu_khoa (IDF). Chỉ đọc.';
