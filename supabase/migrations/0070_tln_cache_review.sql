-- ============================================================================
-- 0070 — TRẢ LỜI NGẮN: tầng CACHE đáp-án-được-duyệt + luồng review (spec §7).
-- ----------------------------------------------------------------------------
-- HS gõ tự do → auto-chấm exact không thể phủ 100%. Vòng học: hệ chấm sai →
-- người (TA) review → HS thật ra đúng → đáp án đó vào question_accepted_answers
-- → lần sau auto-chấm đúng (cham_boi='cache'). Backfill bài làm = client staff (RLS sẵn).
--   · ET (chấm server): et_nop v4 — TLN sai theo key → check cache theo ma_cau.
--   · BTVN/GT (chấm client): RPC tln_cache_check — HS gọi được nhưng KHÔNG đọc được
--     bảng cache (security definer, phải biết sẵn đáp án mới hit → không lộ key).
-- ============================================================================

-- Chuẩn hoá CƠ BẢN phía SQL (lower + bỏ mọi khoảng trắng — POSIX, KHÔNG \s).
-- Không port full smartNormalize (JS) sang SQL: 2 normalizer tự nhất quán mỗi phía,
-- match chéo qua answer_raw (cache lưu CẢ raw lẫn normalized-JS).
create or replace function public.tln_norm(t text) returns text
language sql immutable as $$
  select regexp_replace(lower(trim(coalesce(t, ''))), '[[:space:]]', '', 'g')
$$;

-- Cache hit? Khớp answer_normalized (JS smartNormalize ghi lúc duyệt) HOẶC norm(answer_raw).
-- Hit → bump hit_count. HS callable (BTVN chấm client) — không có đường enumerate.
create or replace function public.tln_cache_check(p_ma_cau text, p_norm text) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if p_ma_cau is null or coalesce(p_norm, '') = '' then return false; end if;
  select id into v_id from question_accepted_answers
    where ma_cau = p_ma_cau
      and (answer_normalized = p_norm or public.tln_norm(answer_raw) = p_norm)
    limit 1;
  if v_id is null then return false; end if;
  update question_accepted_answers set hit_count = hit_count + 1 where id = v_id;
  return true;
end $$;
revoke all on function public.tln_cache_check(text, text) from public;
grant execute on function public.tln_cache_check(text, text) to authenticated;

-- ── et_nop v4: TLN thêm tầng cache (sau exact) — các loại khác giữ nguyên 0069 ──
create or replace function public.et_nop(p_bai_lam uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_test uuid; v_claimed int; v_qa uuid; rec record;
        a jsonb; k jsonb; vv text; vd numeric; cb text; dung int; n int; i int; lt text;
begin
  select hoc_sinh_id, bai_test_id into v_hs, v_test from bai_lam where id = p_bai_lam;
  if v_hs is null or v_hs <> public.my_hoc_sinh_id() then raise exception 'khong phai bai lam cua ban'; end if;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = p_bai_lam and trang_thai = 'dang_lam';
  get diagnostics v_claimed = row_count;  -- 1 = lần nộp đầu · 0 = đã nộp rồi (chỉ chấm lần đầu, 0069)
  if v_claimed > 0 then
    for rec in
      select bc.id cau_id, bc.loai_cau, bc.dap_an_key, bc.diem, bc.ma_cau, blc.id blc_id, blc.dap_an_hs
      from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
      where bc.bai_test_id = v_test
    loop
      if rec.blc_id is null then continue; end if;  -- HS ko trả lời → bỏ (§1.5 anti-NULL)
      a := rec.dap_an_hs; k := rec.dap_an_key; cb := 'exact';
      if rec.loai_cau = 'trac_nghiem' then
        lt := chr(65 + (a #>> '{}')::int);
        vv := case when lt = upper(trim(k #>> '{}')) then 'correct' else 'wrong' end;
        vd := case when vv = 'correct' then rec.diem else 0 end;
      elsif rec.loai_cau = 'dung_sai' then
        n := jsonb_array_length(k); dung := 0;
        for i in 0 .. n - 1 loop
          if upper(left(a ->> i, 1)) = upper(left(k ->> i, 1)) then dung := dung + 1; end if;
        end loop;
        vd := (case dung when 0 then 0 when 1 then 0.1 when 2 then 0.25 when 3 then 0.5 else 1.0 end) * rec.diem;
        vv := case when dung = n then 'correct' when dung > 0 then 'partial' else 'wrong' end;
      else  -- tra_loi_ngan: exact (norm cơ bản) → cache đáp-án-đã-duyệt
        vv := case when public.tln_norm(a #>> '{}') = public.tln_norm(k #>> '{}') then 'correct' else 'wrong' end;
        if vv = 'wrong' and rec.ma_cau is not null then
          select id into v_qa from question_accepted_answers
            where ma_cau = rec.ma_cau
              and (answer_normalized = public.tln_norm(a #>> '{}') or public.tln_norm(answer_raw) = public.tln_norm(a #>> '{}'))
            limit 1;
          if v_qa is not null then
            vv := 'correct'; cb := 'cache';
            update question_accepted_answers set hit_count = hit_count + 1 where id = v_qa;
          end if;
        end if;
        vd := case when vv = 'correct' then rec.diem else 0 end;
      end if;
      update bai_lam_cau set verdict = vv, diem = vd, cham_boi = cb, cham_at = now() where id = rec.blc_id;
    end loop;
  end if;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'bai_test_cau_id', bc.id, 'verdict', blc.verdict, 'dap_an_key', bc.dap_an_key,
      'loi_giai', bc.loi_giai, 'anh_dap_an', bc.anh_dap_an, 'menh_de', bc.menh_de
    ) order by bc.thu_tu), '[]'::jsonb)
    from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
    where bc.bai_test_id = v_test
  );
end $$;
