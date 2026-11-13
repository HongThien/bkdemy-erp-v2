-- MT khuôn THPT — CHỌN TAY câu Đúng/Sai từ kho chủ đề (Thùy 13/11: "Câu đúng sai cần được chọn tay từ kho chứ").
-- Danh sách câu Đ/S (đã duyệt, còn sống, có mệnh đề — cùng điều kiện _mt_ds_kho của gợi ý) của các chủ đề đang chọn, kèm nội dung
-- để xem trước (bỏ lời giải cho nhẹ), số lần câu đã dùng trong tài liệu, tìm theo chữ trong đề / mã câu, phân trang. Ít dùng đứng trước.
-- Lọc + đếm + xếp trên khoá trước, chỉ dựng nội dung (to_jsonb) cho ĐÚNG TRANG trả về (§2.0 — gọi đúng cái đang hiện).
create or replace function public.fn_mt_ds_kho_cau(p_chu_de text[], p_tim text default null, p_offset int default 0, p_limit int default 40)
 returns table(ma_cau text, chu_de_id text, kho text, so_lan_dung int, tong int, cau jsonb)
 language sql stable set search_path to 'public'
as $$
  with x as (
    select k.ma_cau, k.chu_de_id, 'dai'::text as kho
      from dai_bdm_kho_ds k join dai_cau_hoi q on q.ma_cau = k.ma_cau
     where k.chu_de_id = any(p_chu_de) and q.xoa_at is null and q.da_duyet and jsonb_array_length(coalesce(q.menh_de, '[]'::jsonb)) >= 2
       and (coalesce(btrim(p_tim), '') = '' or q.noi_dung ilike '%' || btrim(p_tim) || '%' or q.ma_cau ilike btrim(p_tim) || '%')
    union all
    select k.ma_cau, k.chu_de_id, 'hgt'::text
      from hgt_bdm_kho_ds k join hgt_cau_hoi q on q.ma_cau = k.ma_cau
     where k.chu_de_id = any(p_chu_de) and q.xoa_at is null and q.da_duyet and jsonb_array_length(coalesce(q.menh_de, '[]'::jsonb)) >= 2
       and (coalesce(btrim(p_tim), '') = '' or q.noi_dung ilike '%' || btrim(p_tim) || '%' or q.ma_cau ilike btrim(p_tim) || '%')
  ),
  d as (select x.ma_cau, count(tc.id)::int as dung from x left join tai_lieu_cau tc on tc.ma_cau = x.ma_cau group by x.ma_cau),
  trang as (
    select x.*, d.dung, (count(*) over ())::int as tong
      from x join d on d.ma_cau = x.ma_cau
     order by d.dung, x.ma_cau
     offset greatest(coalesce(p_offset, 0), 0) limit least(greatest(coalesce(p_limit, 40), 1), 200)
  )
  select t.ma_cau, t.chu_de_id, t.kho, t.dung, t.tong,
         coalesce(to_jsonb(qd), to_jsonb(qh)) - 'loi_giai' - 'loi_giai_ai'
    from trang t
    left join dai_cau_hoi qd on t.kho = 'dai' and qd.ma_cau = t.ma_cau
    left join hgt_cau_hoi qh on t.kho = 'hgt' and qh.ma_cau = t.ma_cau
   order by t.dung, t.ma_cau
$$;

revoke execute on function public.fn_mt_ds_kho_cau(text[], text, int, int) from public, anon;
grant execute on function public.fn_mt_ds_kho_cau(text[], text, int, int) to authenticated;
