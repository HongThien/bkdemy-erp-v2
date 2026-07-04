-- ============================================================================
-- 0068 — TEST ONLINE mở rộng: Giáo trình (chỉ bài tập) + ET chế độ THI (Thùy 07-04).
-- ----------------------------------------------------------------------------
-- Giáo trình buổi online = chỉ câu BÀI LUYỆN (loai_phan='dang'), bỏ lý thuyết (vẫn ở nút Gợi ý).
-- ET = CHẾ ĐỘ THI: giấu đáp án tới khi nộp (chống gian lận) → HS KHÔNG đọc bai_test_cau của ET;
--   lấy đề qua RPC et_de (đã lọc key), chấm server-side qua RPC et_nop.
-- ============================================================================

-- loại 'giao_trinh' cho bài tập giáo trình online
alter table bai_test drop constraint bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check check (loai in ('et','btvn','giao_trinh'));

-- denormalize số câu (list HS ko đếm được bai_test_cau của ET do RLS chặn)
alter table bai_test add column if not exists so_cau int not null default 0;

-- ⚠ HS KHÔNG được đọc câu ET (giấu key). Non-ET (btvn/giao_trinh) reveal-ngay → đọc bình thường.
drop policy if exists bai_test_cau_hs_read on bai_test_cau;
create policy bai_test_cau_hs_read on bai_test_cau for select to authenticated
  using (exists (select 1 from bai_test bt where bt.id = bai_test_id and public.hs_o_lop(bt.lop_id) and bt.loai <> 'et'));

-- ── RPC et_de: đề ET đã LỌC KEY (cho HS làm bài) ────────────────────────────
-- Trả câu: id/thứ tự/loại/đề/lựa-chọn/mệnh-đề(CHỈ nội dung)/dạng/lý-thuyết/điểm. KHÔNG key, KHÔNG lời giải.
create or replace function public.et_de(p_bai_test uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
    'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon,
    'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
    'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem
  ) order by bc.thu_tu), '[]'::jsonb)
  from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
  where bc.bai_test_id = p_bai_test and bt.loai = 'et' and public.hs_o_lop(bt.lop_id);
$$;
revoke all on function public.et_de(uuid) from public;
grant execute on function public.et_de(uuid) to authenticated;

-- ── RPC et_nop: CHẤM SERVER-SIDE + đông cứng + reveal (chống gian lận) ───────
-- Đọc dap_an_hs HS đã lưu (verdict null) vs key server → chấm → set da_nop → trả reveal (key+lời giải+verdict).
create or replace function public.et_nop(p_bai_lam uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_test uuid; rec record; a jsonb; k jsonb; vv text; vd numeric; dung int; n int; i int; lt text;
begin
  select hoc_sinh_id, bai_test_id into v_hs, v_test from bai_lam where id = p_bai_lam;
  if v_hs is null or v_hs <> public.my_hoc_sinh_id() then raise exception 'khong phai bai lam cua ban'; end if;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = p_bai_lam and trang_thai = 'dang_lam';
  for rec in
    select bc.id cau_id, bc.loai_cau, bc.dap_an_key, bc.diem, blc.id blc_id, blc.dap_an_hs
    from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
    where bc.bai_test_id = v_test
  loop
    if rec.blc_id is null then continue; end if;  -- HS ko trả lời → bỏ (§1.5 anti-NULL)
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
    else  -- tra_loi_ngan: chuẩn hoá cơ bản (lower/trim/bỏ khoảng trắng — POSIX [[:space:]])
      vv := case when regexp_replace(lower(trim(a #>> '{}')), '[[:space:]]', '', 'g')
                    = regexp_replace(lower(trim(k #>> '{}')), '[[:space:]]', '', 'g')
                 then 'correct' else 'wrong' end;
      vd := case when vv = 'correct' then rec.diem else 0 end;
    end if;
    update bai_lam_cau set verdict = vv, diem = vd, cham_boi = 'exact', cham_at = now() where id = rec.blc_id;
  end loop;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'bai_test_cau_id', bc.id, 'verdict', blc.verdict, 'dap_an_key', bc.dap_an_key,
      'loi_giai', bc.loi_giai, 'anh_dap_an', bc.anh_dap_an, 'menh_de', bc.menh_de
    ) order by bc.thu_tu), '[]'::jsonb)
    from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
    where bc.bai_test_id = v_test
  );
end $$;
revoke all on function public.et_nop(uuid) from public;
grant execute on function public.et_nop(uuid) to authenticated;
