-- 0069 — et_nop: CHỈ chấm ở lần nộp ĐẦU (đông cứng). Chống sửa đáp án qua API rồi nộp lại.
-- Lần đầu: claim dang_lam→da_nop THÀNH CÔNG → chấm. Lần sau: đã da_nop → bỏ qua chấm, chỉ trả reveal.
create or replace function public.et_nop(p_bai_lam uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_test uuid; v_claimed int; rec record; a jsonb; k jsonb; vv text; vd numeric; dung int; n int; i int; lt text;
begin
  select hoc_sinh_id, bai_test_id into v_hs, v_test from bai_lam where id = p_bai_lam;
  if v_hs is null or v_hs <> public.my_hoc_sinh_id() then raise exception 'khong phai bai lam cua ban'; end if;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = p_bai_lam and trang_thai = 'dang_lam';
  get diagnostics v_claimed = row_count;  -- 1 = lần nộp đầu · 0 = đã nộp rồi
  if v_claimed > 0 then
    for rec in
      select bc.id cau_id, bc.loai_cau, bc.dap_an_key, bc.diem, blc.id blc_id, blc.dap_an_hs
      from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
      where bc.bai_test_id = v_test
    loop
      if rec.blc_id is null then continue; end if;
      a := rec.dap_an_hs; k := rec.dap_an_key;
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
      else
        vv := case when regexp_replace(lower(trim(a #>> '{}')), '[[:space:]]', '', 'g')
                      = regexp_replace(lower(trim(k #>> '{}')), '[[:space:]]', '', 'g')
                   then 'correct' else 'wrong' end;
        vd := case when vv = 'correct' then rec.diem else 0 end;
      end if;
      update bai_lam_cau set verdict = vv, diem = vd, cham_boi = 'exact', cham_at = now() where id = rec.blc_id;
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
