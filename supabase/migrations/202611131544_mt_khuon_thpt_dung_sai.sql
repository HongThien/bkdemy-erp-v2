-- MT KHỐI 12 THEO KHUÔN THI THẬT (Thùy 13/11: "Riêng MT lớp 12 fix logic chuẩn như thi thật: 12 câu MCQ, 4 câu đúng sai và 6 câu
-- trả lời ngắn. Đúng sai chọn từ kho câu đúng sai theo chủ đề hiện tại" — chủ đề do người soạn CHỌN TAY; chấm Đ/S TỪNG Ý theo quy chế).
-- Quy chế thi tốt nghiệp THPT từ 2025: Phần I 12 × 0,25 · Phần II 4 câu × 4 ý, đúng 1/2/3/4 ý = 0,1/0,25/0,5/1 · Phần III 6 × 0,5 = 10.
--   1. gami_grades.y_ket_qua: kết quả TỪNG Ý của câu Đúng/Sai (mảng true = em làm đúng ý đó). Null = chấm cả câu như cũ.
--   2. _tg_gami_grades_mt_diem: có y_ket_qua ⇒ DB tự quy điểm = điểm tối đa × hệ số theo số ý đúng (4 ý: 0 · 0,1 · 0,25 · 0,5 · 1;
--      câu khác 4 ý: tỉ lệ ý đúng), tự ra Đ/C/S (đủ ý = Đ, 0 ý = S, còn lại = C) và points (100/50/0 — cùng công thức problemPoints
--      clean·normal của app) để xếp hạng MT không lệch. Đổi Đ/C/S cả câu (vd "Chấm cả bài") ⇒ bỏ chấm theo ý, quay về luật cũ.
--      Luật chung cho MỌI câu Đ/S chấm theo ý, không riêng khối 12 (symmetry).
--   3. Kho Đ/S theo chủ đề (dai_/hgt_bdm_kho_ds): danh sách chủ đề có câu · gợi ý câu ít dùng nhất (rải đều các chủ đề đã chọn) ·
--      tra chủ đề của câu đã chọn (mở lại đề).
alter table public.gami_grades add column if not exists y_ket_qua jsonb;
alter table public.gami_grades drop constraint if exists gami_grades_y_ket_qua_check;
alter table public.gami_grades add constraint gami_grades_y_ket_qua_check
  check (y_ket_qua is null or (jsonb_typeof(y_ket_qua) = 'array' and jsonb_array_length(y_ket_qua) between 1 and 8));

create or replace function public._tg_gami_grades_mt_diem()
 returns trigger
 language plpgsql
as $function$
declare v_phase text; v_max numeric; v_k int; v_n int; v_f numeric;
begin
  select phase, diem_toi_da into v_phase, v_max from gami_session_problems where id = new.problem_id;
  if v_phase is distinct from 'mt' then return new; end if;

  -- (13/11) Câu Đúng/Sai chấm TỪNG Ý ⇒ điểm/Đ-C-S/points do DB quy theo số ý đúng.
  if new.y_ket_qua is not null and (tg_op = 'INSERT' or new.y_ket_qua is distinct from old.y_ket_qua) then
    v_k := jsonb_array_length(new.y_ket_qua);
    select count(*) filter (where e = 'true'::jsonb) into v_n from jsonb_array_elements(new.y_ket_qua) e;
    v_f := case when v_k = 4 then (array[0, 0.1, 0.25, 0.5, 1]::numeric[])[v_n + 1] else v_n::numeric / v_k end;
    new.diem_dat := coalesce(v_max, 1) * v_f;
    new.result := case when v_n = v_k then 'correct' when v_n = 0 then 'wrong' else 'partial' end;
    new.points := case new.result when 'correct' then 100 when 'partial' then 50 else 0 end;
    return new;
  end if;
  if tg_op = 'UPDATE' and new.y_ket_qua is not null and new.result is distinct from old.result then
    new.y_ket_qua := null;                                      -- đổi Đ/C/S cả câu ⇒ bỏ chấm theo ý
  end if;

  if tg_op = 'INSERT' then
    if new.diem_dat is not null then return new; end if;        -- người chấm chủ động cho điểm
  elsif new.result is not distinct from old.result or new.diem_dat is distinct from old.diem_dat then
    return new;                                                 -- không đổi Đ/C/S, hoặc người chấm gửi điểm kèm
  end if;
  new.diem_dat := case new.result when 'correct' then v_max when 'wrong' then 0 else null end;
  return new;
end $function$;

-- Câu Đ/S trong kho chủ đề (Đại + Hình giải tích), đã duyệt, còn sống, có mệnh đề.
create or replace function public._mt_ds_kho()
 returns table(ma_cau text, chu_de_id text, kho text)
 language sql stable set search_path to 'public'
as $$
  select k.ma_cau, k.chu_de_id, 'dai'::text from dai_bdm_kho_ds k join dai_cau_hoi q on q.ma_cau = k.ma_cau
   where q.xoa_at is null and q.da_duyet and jsonb_array_length(coalesce(q.menh_de, '[]'::jsonb)) >= 2
  union all
  select k.ma_cau, k.chu_de_id, 'hgt'::text from hgt_bdm_kho_ds k join hgt_cau_hoi q on q.ma_cau = k.ma_cau
   where q.xoa_at is null and q.da_duyet and jsonb_array_length(coalesce(q.menh_de, '[]'::jsonb)) >= 2
$$;

-- Chủ đề của khối có câu Đ/S trong kho (ô chọn chủ đề ở Phần II).
create or replace function public.fn_mt_ds_chu_de(p_khoi text)
 returns table(id text, ten text, so_cau int)
 language sql stable set search_path to 'public'
as $$
  select cd.id, cd.ten, count(*)::int
    from _mt_ds_kho() x join dai_bdm_chu_de cd on cd.id = x.chu_de_id
   where cd.khoi = p_khoi
   group by cd.id, cd.ten, cd.thu_tu
   order by cd.thu_tu nulls last, cd.id
$$;

-- Gợi ý p_n câu Đ/S ÍT DÙNG NHẤT, rải đều các chủ đề đã chọn (theo thứ tự chọn), né p_tru.
create or replace function public.fn_mt_goi_y_ds(p_chu_de text[], p_n int default 4, p_tru text[] default '{}')
 returns table(ma_cau text, chu_de_id text, kho text)
 language sql volatile set search_path to 'public'
as $$
  with c as (
    select x.*, array_position(p_chu_de, x.chu_de_id) as vt
      from _mt_ds_kho() x
     where x.chu_de_id = any(p_chu_de) and not (x.ma_cau = any(coalesce(p_tru, '{}')))
  ),
  d as (select c.*, (select count(*) from tai_lieu_cau tc where tc.ma_cau = c.ma_cau) as dung, random() as ng from c),
  r as (select d.*, row_number() over (partition by d.chu_de_id order by d.dung, d.ng) as rn from d)
  select r.ma_cau, r.chu_de_id, r.kho from r order by r.rn, r.vt limit greatest(coalesce(p_n, 0), 0)
$$;

-- Chủ đề + kho của các câu Đ/S đã có trong đề (mở lại đề).
create or replace function public.fn_mt_ds_cua_cau(p_ma text[])
 returns table(ma_cau text, chu_de_id text, kho text)
 language sql stable set search_path to 'public'
as $$
  select k.ma_cau, k.chu_de_id, 'dai'::text from dai_bdm_kho_ds k where k.ma_cau = any(p_ma)
  union all
  select k.ma_cau, k.chu_de_id, 'hgt'::text from hgt_bdm_kho_ds k where k.ma_cau = any(p_ma)
$$;

revoke execute on function public._mt_ds_kho() from public, anon;
revoke execute on function public.fn_mt_ds_chu_de(text) from public, anon;
revoke execute on function public.fn_mt_goi_y_ds(text[], int, text[]) from public, anon;
revoke execute on function public.fn_mt_ds_cua_cau(text[]) from public, anon;
grant execute on function public._mt_ds_kho() to authenticated;
grant execute on function public.fn_mt_ds_chu_de(text) to authenticated;
grant execute on function public.fn_mt_goi_y_ds(text[], int, text[]) to authenticated;
grant execute on function public.fn_mt_ds_cua_cau(text[]) to authenticated;
