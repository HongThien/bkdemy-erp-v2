-- ============================================================================
-- BẢN ĐỒ MỚI → KHO: xem câu của 1 dạng bài / 1 nhóm bài / rổ "chưa khớp" của 1 chủ đề ngay trên bản đồ
-- (Thùy 18/10: "t chưa thấy đường đi từ bản đồ mới vào kho").
-- Nguồn "câu thuộc dạng bài nào" = _bdm_cau_giai (gán câu > gán cụm > đối ứng ①, bản sao đi theo gốc) — CÙNG nguồn
-- với số câu fn_bdm_cay ⇒ số trên thẻ khớp số dòng trong danh sách. Chỉ đọc. Kho Đại (dai_cau_hoi); nhánh khác trả rỗng.
--   p_loai = 'dang_bai' | 'nhom' (p_id = mã) | 'chua_khop' (p_id = mã chủ đề)
--   p_loc  = 'tat_ca' | 'da_duyet' | 'chua_duyet' | 'kho_chuan'
-- ============================================================================
create or replace function public.fn_bdm_kho_cau(
  p_loai text, p_id text, p_loc text default 'tat_ca', p_limit integer default 40, p_offset integer default 0)
 returns table(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text,
               loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text,
               nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare v_khoi text; v_ids text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then
    raise exception 'fn_bdm_kho_cau: bộ lọc không hợp lệ %', p_loc;
  end if;

  if p_loai = 'chua_khop' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'chua_khop'::text, null::text, null::text, k.ly_do
        from dai_bdm_cau_chua_khop k
        join dai_cau_hoi c on c.ma_cau = k.ma_cau and c.xoa_at is null
       where k.chu_de_id = p_id
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet)
              or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  if p_loai = 'dang_bai' then
    select cd.khoi, array[d.id] into v_khoi, v_ids
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_id;
  elsif p_loai = 'nhom' then
    select cd.khoi, array(select d.id from dai_bdm_dang_bai d where d.nhom_id = n.id) into v_khoi, v_ids
      from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_id;
  else
    raise exception 'fn_bdm_kho_cau: p_loai không hợp lệ %', p_loai;
  end if;
  if v_khoi is null then return; end if;

  return query
    with cg as (
      select g.* from _bdm_cau_giai(array(select b.ma_dang from dai_ban_do b where b.khoi = v_khoi)) g
       where g.dang_bai_id = any (v_ids)
    )
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, cg.la_goc,
           cg.nguon || coalesce(':' || gc.nguon, ''), cg.dang_bai_id, db.ten, null::text
      from cg
      join dai_cau_hoi c on c.ma_cau = cg.ma_cau
      join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
      left join dai_bdm_gan_cau gc on gc.ma_cau = cg.goc
     where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet)
        or (p_loc = 'kho_chuan' and c.kho_chuan)
     order by db.thu_tu, cg.goc, cg.la_goc desc, c.ma_cau
     limit p_limit offset p_offset;
end $function$;

revoke all on function public.fn_bdm_kho_cau(text, text, text, integer, integer) from public, anon;
grant execute on function public.fn_bdm_kho_cau(text, text, text, integer, integer) to authenticated;
