-- ============================================================================
-- 202608300254 — fn_tln_normalize v2 (chốt đặc tả) + CHUẨN HOÁ LẠI cache đáp án
-- ----------------------------------------------------------------------------
-- VÌ SAO: parity harness (chạy JS smartNormalize vs SQL fn trên 603 đáp án thật) tóm
--   được BUG TIỀM ẨN của JS: \b là ASCII nên chữ có dấu bị coi là ranh giới từ —
--   "10 học sinh" bị bóc h/m thành "10ọcsinh" (bóc "đơn vị" ngay trong chữ). Bản SQL
--   (\y unicode) mới đúng ý định. Chốt đặc tả v2 cho CẢ HAI phía:
--   · bỏ đơn vị theo ranh giới UNICODE (SQL \y · JS lookaround \p{L}\p{N}_)
--   · phân số → round(±a/b, 10) rồi strip zero thừa (hết lệch format float JS/SQL)
--   Kéo theo: answer_normalized trong cache do JS cũ sinh có thể mang giá trị lỗi →
--   CHUẨN HOÁ LẠI từ answer_raw; trùng nhau sau chuẩn hoá thì giữ dòng cũ nhất.
--
-- MẤT GÌ (Luật xoá): các dòng question_accepted_answers TRÙNG (ma_cau, answer_normalized)
--   sau khi chuẩn hoá lại sẽ bị XOÁ (giữ dòng created_at cũ nhất — cùng nghĩa, không mất
--   thông tin chấp nhận; answer_raw của dòng giữ vẫn đại diện). Không đụng bài làm/verdict.
-- ============================================================================

create or replace function public.fn_tln_normalize(p_val text) returns text
language plpgsql immutable as $$
declare s text; m text[];
begin
  if p_val is null then return ''; end if;
  s := lower(trim(p_val));
  s := regexp_replace(s, '\y(km/giờ|km/h|m/s|m/giây|km|cm|mm|m²|cm²|m|kg|gam|g|lít|l|đồng|vnđ|vnd|nghìn|triệu|tỷ|giờ|phút|giây|h|min|s|%)\y', '', 'gi');
  s := regexp_replace(s, '\s+', '', 'g');
  s := regexp_replace(s, '[.,]$', '');
  s := regexp_replace(s, '(\d),(\d)', '\1.\2', 'g');
  s := regexp_replace(s, '(\d)\.(\d{3})\y', '\1\2', 'g');
  m := regexp_match(s, '^(-?\d+)/(\d+)$');
  if m is not null and m[2]::bigint <> 0 then
    s := round(m[1]::numeric / m[2]::numeric, 10)::text;  -- v2: round 10 — khớp toFixed(10) JS
  end if;
  s := regexp_replace(s, '^\+', '');
  s := regexp_replace(s, '\.0+$', '');
  s := regexp_replace(s, '(\.\d*?)0+$', '\1');
  return s;
end $$;

-- Chuẩn hoá lại cache: tính norm mới từ answer_raw (fallback answer_normalized cũ khi raw null),
-- xoá dòng trùng sau chuẩn hoá (giữ cũ nhất), rồi update.
with moi as (
  select id, ma_cau, public.fn_tln_normalize(coalesce(answer_raw, answer_normalized)) as norm, created_at
  from question_accepted_answers
), giu as (
  select distinct on (ma_cau, norm) id from moi where norm <> '' order by ma_cau, norm, created_at
)
delete from question_accepted_answers qa
where qa.id not in (select id from giu)
  and qa.id in (select id from moi where norm = '' or id not in (select id from giu));

update question_accepted_answers qa
set answer_normalized = public.fn_tln_normalize(coalesce(qa.answer_raw, qa.answer_normalized))
where qa.answer_normalized is distinct from public.fn_tln_normalize(coalesce(qa.answer_raw, qa.answer_normalized));
