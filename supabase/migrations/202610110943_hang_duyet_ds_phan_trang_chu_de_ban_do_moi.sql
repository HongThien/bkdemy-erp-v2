-- ============================================================================
-- HÀNG DUYỆT ĐÚNG/SAI: phân trang + gợi ý bản đồ mới (đi cặp với 202610110939 — cùng lý do:
-- Supabase API cắt 1000 dòng; khối 12 có 1.045 câu Đ/S chờ duyệt, 250 câu thuộc chủ đề NH-TP).
--   · thêm p_offset (client phân trang từng 1000)
--   · thêm cột bdm_* (chủ đề · chuyên đề · nhóm · dạng bài · trạng thái gan/chua_khop) — chỉ kho 'dai'
-- Không đổi logic duyệt mệnh đề (fn_kho_duyet_menh_de giữ nguyên).
-- ============================================================================
drop function if exists public.fn_kho_hang_duyet_ds(text, text, integer);

create function public.fn_kho_hang_duyet_ds(p_mon text, p_khoi text default null, p_limit integer default 300, p_offset integer default 0)
 returns table(ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, noi_dung text, loi_giai text,
               anh_de text, anh_dap_an text, nguon text, nguon_giai text, created_at timestamptz, ma_cum text, ten_cum text,
               da_duyet boolean, kho_chuan boolean, dang_ai_de_xuat text, ten_de_goc text, so_menh_de integer,
               so_da_duyet integer, so_thieu_dang integer, menh_de_hop jsonb,
               bdm_chu_de text, bdm_chuyen_de text, bdm_nhom text, bdm_dang_bai text, bdm_dang_bai_id text,
               bdm_trang_thai text, bdm_ly_do text)
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare t text := public.fn_kho_tbl(p_mon); v_bdm boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet_ds: môn không hợp lệ %', p_mon; end if;
  if to_regclass(t || '_cau_menh_de') is null then
    raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề (chưa có bảng %_cau_menh_de)', p_mon, t;
  end if;
  v_bdm := (t = 'dai');
  return query execute format($q$
    with cau as (
      select c.*, b.ten_dang, b.ten_chuyen_de, b.khoi as b_khoi, m.ten as ten_cum_
      from %1$I c
      join %2$I b on b.ma_dang = c.dang_chinh
      left join %3$I m on m.ma_cum = c.ma_cum
      where c.xoa_at is null and c.loai_cau = 'dung_sai' and not c.da_duyet
        and ($1::text is null or b.khoi = $1)
      order by b.khoi, c.dang_chinh, c.ma_cau
      limit $2 offset $3
    ),
    md as (
      select k.ma_cau_cha, k.thu_tu, k.id, k.dang_chinh, bd.ten_dang, bd.ten_chuyen_de,
             k.noi_dung, k.dung, k.loi_giai, k.da_duyet, k.duyet_at, k.dang_ai_de_xuat
      from %4$I k join %2$I bd on bd.ma_dang = k.dang_chinh
      where k.xoa_at is null and k.ma_cau_cha in (select ma_cau from cau)
    ),
    hop as (
      select c.ma_cau,
             jsonb_agg(jsonb_build_object(
               'thu_tu', e.ord, 'noi_dung', e.elem->>'noi_dung', 'dap_an', e.elem->>'dap_an',
               'ma_dang', e.elem->>'ma_dang', 'loi_giai', e.elem->>'loi_giai',
               'con', case when md.id is null then null else jsonb_build_object(
                 'id', md.id, 'dang_chinh', md.dang_chinh, 'ten_dang', md.ten_dang, 'ten_chuyen_de', md.ten_chuyen_de,
                 'noi_dung', md.noi_dung, 'dung', md.dung, 'loi_giai', md.loi_giai,
                 'da_duyet', md.da_duyet, 'duyet_at', md.duyet_at, 'dang_ai_de_xuat', md.dang_ai_de_xuat) end
             ) order by e.ord) as menh_de_hop,
             count(*)::int as so_md,
             count(*) filter (where md.da_duyet)::int as so_duyet,
             count(*) filter (where md.id is null or public._kho_la_dang_cho(md.dang_chinh))::int as so_thieu
      from cau c
      cross join lateral jsonb_array_elements(coalesce(c.menh_de, '[]'::jsonb)) with ordinality as e(elem, ord)
      left join md on md.ma_cau_cha = c.ma_cau and md.thu_tu = e.ord
      group by c.ma_cau
    )
    select c.ma_cau, c.dang_chinh, c.ten_dang, c.ten_chuyen_de, c.b_khoi,
           c.noi_dung, c.loi_giai, c.anh_de, c.anh_dap_an, c.nguon, c.nguon_giai, c.created_at,
           c.ma_cum, c.ten_cum_, c.da_duyet, c.kho_chuan, c.dang_ai_de_xuat, c.ten_de_goc,
           coalesce(h.so_md, 0), coalesce(h.so_duyet, 0), coalesce(h.so_thieu, 0), coalesce(h.menh_de_hop, '[]'::jsonb),
           %5$s
    from cau c left join hop h on h.ma_cau = c.ma_cau
    %6$s
    order by c.b_khoi, c.dang_chinh, c.ma_cau
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cum_bai', t || '_cau_menh_de',
       case when v_bdm
         then $s$coalesce(bcd.ten, bck.ten), bch.ten, bnh.ten, bdb.ten, bdb.id,
                 case when bgc.ma_cau is not null then 'gan' when bk.ma_cau is not null then 'chua_khop' end, bk.ly_do$s$
         else 'null::text, null::text, null::text, null::text, null::text, null::text, null::text' end,
       case when v_bdm
         then $s$left join dai_bdm_gan_cau bgc on bgc.ma_cau = c.ma_cau
                 left join dai_bdm_dang_bai bdb on bdb.id = bgc.dang_bai_id
                 left join dai_bdm_nhom bnh on bnh.id = bdb.nhom_id
                 left join dai_bdm_chuyen_de bch on bch.id = bnh.chuyen_de_id
                 left join dai_bdm_chu_de bcd on bcd.id = bnh.chu_de_id
                 left join dai_bdm_cau_chua_khop bk on bk.ma_cau = c.ma_cau
                 left join dai_bdm_chu_de bck on bck.id = bk.chu_de_id$s$
         else '' end
  ) using p_khoi, p_limit, p_offset;
end $function$;

revoke all on function public.fn_kho_hang_duyet_ds(text, text, integer, integer) from public, anon;
grant execute on function public.fn_kho_hang_duyet_ds(text, text, integer, integer) to authenticated;
