-- ============================================================================
-- 202611081545 — Máy chấm BTVN: kết quả THEO Ý + ĐIỂM BÀI + BẢN CHẤM ĐỎ (CEO 08/11)
-- ----------------------------------------------------------------------------
-- CEO 08/11: "chấm xong đưa bản đã chấm đỏ lên · chấm điểm cho học sinh lên bài luôn ·
--   min điểm là 5 (dưới 5 vẫn để 5) · 2 bài hình gồm 4 ý nhỏ thì mỗi ý 2,5 · vẫn bội 0,25".
-- ① btvn_ai_cau.y: kết quả từng ý của câu [{ten:'a', result}] — NULL = câu không chia ý (không áp dụng).
-- ② fn_btvn_ai_ghi nhận thêm `y` trong từng câu (cùng chữ ký, chỉ thêm cột ghi).
-- ③ fn_btvn_ai_diem(lan): điểm bài thang 10 — CÔNG THỨC DUY NHẤT (ảnh chấm đỏ + app đều gọi hàm này):
--    • Mỗi câu trong lưới BTVN buổi = số ý của nó (không chia ý = 1 ý). Câu không có trên bài = 1 ý, 0 điểm.
--    • Mỗi ý = 10 / tổng số ý. Đ = trọn ý · C = nửa ý làm tròn XUỐNG bội 0,25 (spec §A2.3) · S = 0.
--    • Tổng làm tròn về bội 0,25 gần nhất, tối đa 10, TỐI THIỂU 5.
--    • Đã chốt: lấy kết quả TA chốt (gami_grades). TA đổi kết quả câu so với máy ⇒ mọi ý của câu theo
--      kết quả mới (Đ ⇒ trọn, C ⇒ nửa từng ý, S ⇒ 0).
-- ④ fn_btvn_ai_dat_anh_cham(anh, path): gắn bản chấm đỏ máy vẽ vào path_cham. KHÔNG đè bản TA vẽ tay
--    (chỉ ghi khi path_cham trống hoặc là bản máy `cham/ai-…`). Ảnh gốc `path` vẫn immutable.
-- MẤT GÌ (Luật xoá): không xoá gì — thêm 1 cột, 2 hàm, redefine fn_btvn_ai_ghi cùng chữ ký.
-- ============================================================================

alter table btvn_ai_cau add column if not exists y jsonb;
comment on column btvn_ai_cau.y is 'Kết quả từng ý [{ten, result correct|partial|wrong}]. NULL = câu không chia ý.';

create or replace function public.fn_btvn_ai_ghi(
  p_buoi_hoc_id uuid, p_hoc_sinh_id uuid, p_model text, p_rule_version text,
  p_nhan_xet_chung text, p_thu_tu_anh uuid[], p_cau jsonb, p_tokens_in integer, p_tokens_out integer)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  insert into btvn_ai_lan (buoi_hoc_id, hoc_sinh_id, model, rule_version, nhan_xet_chung, thu_tu_anh, tokens_in, tokens_out)
  values (p_buoi_hoc_id, p_hoc_sinh_id, p_model, p_rule_version, nullif(trim(p_nhan_xet_chung), ''),
          coalesce(p_thu_tu_anh, '{}'), p_tokens_in, p_tokens_out)
  returning id into v_id;

  insert into btvn_ai_cau (lan_id, problem_id, result, chac, loai_loi, nhan_xet, y)
  select v_id, (c->>'problem_id')::uuid, c->>'result', coalesce((c->>'chac')::boolean, false),
         nullif(trim(c->>'loai_loi'), ''), nullif(trim(c->>'nhan_xet'), ''),
         (select jsonb_agg(jsonb_build_object('ten', coalesce(e->>'ten', ''), 'result', e->>'result') order by o)
            from jsonb_array_elements(case when jsonb_typeof(c->'y') = 'array' then c->'y' else '[]'::jsonb end)
                 with ordinality as t(e, o)
           where e->>'result' in ('correct', 'partial', 'wrong'))
  from jsonb_array_elements(coalesce(p_cau, '[]'::jsonb)) c
  join gami_session_problems sp on sp.id = (c->>'problem_id')::uuid
   and sp.buoi_hoc_id = p_buoi_hoc_id and sp.phase = 'btvn';   -- chỉ nhận câu thuộc đúng lưới BTVN buổi này

  -- Thứ tự ảnh máy đề xuất: thu_tu chỉ để HIỂN THỊ (danh tính ảnh = id) ⇒ đổi được an toàn.
  if p_thu_tu_anh is not null and array_length(p_thu_tu_anh, 1) > 0 then
    update btvn_nop_anh a set thu_tu = t.ord
    from unnest(p_thu_tu_anh) with ordinality as t(id, ord)
    where a.id = t.id and a.buoi_hoc_id = p_buoi_hoc_id and a.hoc_sinh_id = p_hoc_sinh_id;
  end if;
  return v_id;
end $$;
revoke execute on function public.fn_btvn_ai_ghi(uuid, uuid, text, text, text, uuid[], jsonb, integer, integer) from public, anon;
grant execute on function public.fn_btvn_ai_ghi(uuid, uuid, text, text, text, uuid[], jsonb, integer, integer) to authenticated;

-- ③ Điểm bài. Trả {diem, so_y, gia_tri_y, tong_tho}.
create or replace function public.fn_btvn_ai_diem(p_lan_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  with l as (select * from btvn_ai_lan where id = p_lan_id),
  cau as (
    select sp.id pid, c.result may, c.y,
           case when l.chot_at is not null then g.result else c.result end cuoi
    from l
    join gami_session_problems sp on sp.buoi_hoc_id = l.buoi_hoc_id and sp.phase = 'btvn'
    left join btvn_ai_cau c on c.lan_id = l.id and c.problem_id = sp.id
    left join gami_grades g on g.problem_id = sp.id and g.hoc_sinh_id = l.hoc_sinh_id
  ),
  y as (
    select case when c.y is not null and c.cuoi is not distinct from c.may then e->>'result'
                else coalesce(c.cuoi, 'wrong') end kq
    from cau c
    cross join lateral jsonb_array_elements(coalesce(nullif(c.y, '[]'::jsonb), '[{}]'::jsonb)) e
  ),
  n as (select count(*) so_y, 10.0 / nullif(count(*), 0) gt from y),
  t as (
    select sum(case y.kq when 'correct' then n.gt
                        when 'partial' then floor(n.gt / 2 / 0.25) * 0.25
                        else 0 end) tong
    from y cross join n
  )
  select jsonb_build_object(
           'diem', greatest(5, least(10, round(coalesce(t.tong, 0) / 0.25) * 0.25)),
           'so_y', n.so_y, 'gia_tri_y', round(n.gt, 4), 'tong_tho', round(coalesce(t.tong, 0), 4))
    into v
  from n cross join t;
  return v;
end $$;
revoke execute on function public.fn_btvn_ai_diem(uuid) from public, anon;
grant execute on function public.fn_btvn_ai_diem(uuid) to authenticated;

-- ④ Gắn bản chấm đỏ máy vẽ. Trả true nếu đã gắn, false nếu trang đã có bản TA vẽ tay (giữ nguyên).
create or replace function public.fn_btvn_ai_dat_anh_cham(p_anh_id uuid, p_path text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  if p_path not like 'cham/ai-%' then raise exception 'Bản chấm máy phải nằm ở cham/ai-…'; end if;
  update btvn_nop_anh set path_cham = p_path
  where id = p_anh_id and bo_at is null and (path_cham is null or path_cham like 'cham/ai-%');
  return found;
end $$;
revoke execute on function public.fn_btvn_ai_dat_anh_cham(uuid, text) from public, anon;
grant execute on function public.fn_btvn_ai_dat_anh_cham(uuid, text) to authenticated;
