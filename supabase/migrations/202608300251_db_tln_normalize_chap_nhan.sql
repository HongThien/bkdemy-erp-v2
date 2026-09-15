-- ============================================================================
-- 202608300251 — Phase 1 (đợt 5a) §2.0: smartNormalize + "chấp nhận đáp án" → DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — chapNhanDapAn (testonline.ts) fetch mọi dòng wrong về client,
--   lọc bằng smartNormalize JS ("DB không có" — comment cũ tự thú), rồi UPDATE verdict
--   ngược theo lô: không nguyên tử + công thức chuẩn hoá chỉ sống ở JS. Giờ:
--   fn_tln_normalize (port 1-1 smartNormalize, testgrade.js) + fn_chap_nhan_dap_an
--   (cache + backfill + resolve report trong MỘT transaction).
--   Chia phân số đi qua float8 (PG≥12 in shortest-round-trip — khớp Number.toString JS).
-- MẤT GÌ (Luật xoá): không mất — thêm function; hành vi backfill y nguyên bản JS.
-- ============================================================================

create or replace function public.fn_tln_normalize(p_val text) returns text
language plpgsql immutable as $$
declare s text; m text[];
begin
  if p_val is null then return ''; end if;
  s := lower(trim(p_val));
  -- bỏ đơn vị thường gặp (y nguyên danh sách + \b của JS)
  s := regexp_replace(s, '\y(km/giờ|km/h|m/s|m/giây|km|cm|mm|m²|cm²|m|kg|gam|g|lít|l|đồng|vnđ|vnd|nghìn|triệu|tỷ|giờ|phút|giây|h|min|s|%)\y', '', 'gi');
  s := regexp_replace(s, '\s+', '', 'g');            -- bỏ space
  s := regexp_replace(s, '[.,]$', '');               -- bỏ chấm/phẩy trailing
  s := regexp_replace(s, '(\d),(\d)', '\1.\2', 'g'); -- 1,5 → 1.5
  s := regexp_replace(s, '(\d)\.(\d{3})\y', '\1\2', 'g'); -- 1.000 → 1000
  m := regexp_match(s, '^(-?\d+)/(\d+)$');           -- phân số → thập phân (float8 = format JS)
  if m is not null and m[2]::bigint <> 0 then
    s := (m[1]::float8 / m[2]::float8)::text;
  end if;
  s := regexp_replace(s, '^\+', '');                 -- bỏ + đầu
  s := regexp_replace(s, '\.0+$', '');               -- 5.0 → 5
  s := regexp_replace(s, '(\.\d*?)0+$', '\1');       -- 0.50 → 0.5
  return s;
end $$;

-- Chấp nhận đáp án (TA duyệt "HS đúng"): ①cache ②backfill wrong cùng normalize ③resolve report.
create or replace function public.fn_chap_nhan_dap_an(p_ma_cau text, p_dap_an_raw text)
returns jsonb language plpgsql as $$
declare v_norm text; v_n integer;
begin
  v_norm := public.fn_tln_normalize(p_dap_an_raw);
  if v_norm = '' then raise exception 'Đáp án rỗng sau chuẩn hoá — không chấp nhận được.'; end if;

  insert into question_accepted_answers (ma_cau, answer_normalized, answer_raw, source)
  values (p_ma_cau, v_norm, p_dap_an_raw, 'manual')
  on conflict (ma_cau, answer_normalized) do nothing;

  create temp table _cnda on commit drop as
    select blc.id, btc.diem
    from bai_lam_cau blc
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    where blc.verdict = 'wrong' and btc.ma_cau = p_ma_cau
      -- dap_an_hs là jsonb: #>>'{}' bóc giá trị scalar KHÔNG kèm ngoặc kép (khớp String() của
      -- supabase-js phía JS cũ); ::text trần sẽ ra '"abc"' và không bao giờ khớp normalize.
      and public.fn_tln_normalize(coalesce(blc.dap_an_hs #>> '{}', '')) = v_norm;
  select count(*) into v_n from _cnda;
  if v_n > 0 then
    update bai_lam_cau b set verdict = 'correct', diem = coalesce(t.diem, 1), cham_boi = 'manual', cham_at = now()
    from _cnda t where b.id = t.id;
    update bai_test_report r set trang_thai = 'dung',
      duyet_boi = (select id from tai_khoan where id = public.jwt_uid()), duyet_at = now()
    where r.bai_lam_cau_id in (select id from _cnda) and r.trang_thai = 'moi';
  end if;
  drop table _cnda;
  return jsonb_build_object('backfilled', v_n);
end $$;
grant execute on function public.fn_chap_nhan_dap_an(text, text) to authenticated;
