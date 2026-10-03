-- Phủ MCQ theo khối/dạng — tab mới "Phủ MCQ" trong Bản đồ kiến thức (CEO yêu cầu 01/10, thay cho việc
-- Claude phải chạy script tay mỗi lần hỏi). 2 hàm, chỉ Đại (dai_*) và Hình giải tích (hgt_*) — 2 nhánh ĐÃ
-- có pipeline sinh MCQ, KHTN/Hình tổng hợp chưa có nên không đưa vào đây.
--
-- fn_mcq_coverage_dang: trả CẢ rollup-khối LẪN chi-tiết-dạng trong 1 lần gọi (SQL tổng hợp sẵn, client
-- không reduce/group gì thêm — CLAUDE.md §2.0). "Có MCQ" = có dòng form_tn hiệu lực HOẶC câu kho đã sẵn
-- lua_chon (trắc nghiệm nguyên bản, không cần sinh thêm).
create or replace function public.fn_mcq_coverage_dang(p_nhanh text)
returns jsonb
language plpgsql
stable
security invoker
set search_path to 'public'
as $$
declare result jsonb; dang jsonb; khoi_rollup jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_nhanh = 'dai' then
    select coalesce(jsonb_agg(jsonb_build_object(
             'khoi', b.khoi, 'ma_dang', t.dang_chinh, 'ten_dang', b.ten_dang,
             'tong_tln', t.tong_tln, 'co_mcq', t.co_mcq) order by b.khoi, t.dang_chinh), '[]'::jsonb)
      into dang
    from (select q.dang_chinh,
                 count(*) filter (where q.loai_cau = 'tra_loi_ngan') tong_tln,
                 count(*) filter (where q.loai_cau = 'tra_loi_ngan'
                   and (f.ma_cau is not null or q.lua_chon is not null)) co_mcq
          from dai_cau_hoi q
          left join dai_cau_form_tn f on f.ma_cau = q.ma_cau and f.xoa_at is null
          where q.xoa_at is null and q.da_duyet
          group by q.dang_chinh) t
    join dai_ban_do b on b.ma_dang = t.dang_chinh
    where t.tong_tln > 0;
  elsif p_nhanh = 'hgt' then
    select coalesce(jsonb_agg(jsonb_build_object(
             'khoi', b.khoi, 'ma_dang', t.dang_chinh, 'ten_dang', b.ten_dang,
             'tong_tln', t.tong_tln, 'co_mcq', t.co_mcq) order by b.khoi, t.dang_chinh), '[]'::jsonb)
      into dang
    from (select q.dang_chinh,
                 count(*) filter (where q.loai_cau = 'tra_loi_ngan') tong_tln,
                 count(*) filter (where q.loai_cau = 'tra_loi_ngan'
                   and (f.ma_cau is not null or q.lua_chon is not null)) co_mcq
          from hgt_cau_hoi q
          left join hgt_cau_form_tn f on f.ma_cau = q.ma_cau and f.xoa_at is null
          where q.xoa_at is null and q.da_duyet
          group by q.dang_chinh) t
    join hgt_ban_do b on b.ma_dang = t.dang_chinh
    where t.tong_tln > 0;
  else
    raise exception 'invalid nhanh %', p_nhanh;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'khoi', x.khoi, 'tong_tln', x.tong_tln, 'co_mcq', x.co_mcq) order by x.khoi), '[]'::jsonb)
    into khoi_rollup
  from (select d->>'khoi' khoi,
               sum((d->>'tong_tln')::int) tong_tln,
               sum((d->>'co_mcq')::int) co_mcq
        from jsonb_array_elements(dang) d
        group by d->>'khoi') x;

  result := jsonb_build_object('khoi', khoi_rollup, 'dang', dang);
  return result;
end $$;
revoke all on function public.fn_mcq_coverage_dang(text) from public;
grant execute on function public.fn_mcq_coverage_dang(text) to authenticated;

-- Danh sách câu CÒN THIẾU MCQ của 1 dạng cụ thể — panel chi tiết khi click vào 1 dạng.
create or replace function public.fn_mcq_cau_thieu(p_nhanh text, p_ma_dang text)
returns jsonb
language plpgsql
stable
security invoker
set search_path to 'public'
as $$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_nhanh = 'dai' then
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma_cau', q.ma_cau, 'dap_an', q.dap_an, 'noi_dung', q.noi_dung) order by q.ma_cau), '[]'::jsonb)
      into result
    from dai_cau_hoi q
    left join dai_cau_form_tn f on f.ma_cau = q.ma_cau and f.xoa_at is null
    where q.dang_chinh = p_ma_dang and q.xoa_at is null and q.da_duyet
      and q.loai_cau = 'tra_loi_ngan' and f.ma_cau is null and q.lua_chon is null;
  elsif p_nhanh = 'hgt' then
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma_cau', q.ma_cau, 'dap_an', q.dap_an, 'noi_dung', q.noi_dung) order by q.ma_cau), '[]'::jsonb)
      into result
    from hgt_cau_hoi q
    left join hgt_cau_form_tn f on f.ma_cau = q.ma_cau and f.xoa_at is null
    where q.dang_chinh = p_ma_dang and q.xoa_at is null and q.da_duyet
      and q.loai_cau = 'tra_loi_ngan' and f.ma_cau is null and q.lua_chon is null;
  else
    raise exception 'invalid nhanh %', p_nhanh;
  end if;
  return result;
end $$;
revoke all on function public.fn_mcq_cau_thieu(text, text) from public;
grant execute on function public.fn_mcq_cau_thieu(text, text) to authenticated;
