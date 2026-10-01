-- ============================================================================
-- 202609122158 — Điền Ô: form LƯU HẾT mọi chỗ có thể điền (trần 4 → 8 ô), mỗi ô có NHÃN VỊ TRÍ `vi_tri`; lúc giao bài mới chọn
--   tổ hợp 3 ô (tối đa 4) xoay vòng — CEO chốt 12/09 tối.
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): "tại sao không phải là trong cùng 1 dạng đổi các chỗ khác nhau. Giết nhầm còn hơn bỏ sót. Sau này còn biết
--   được HS hay sai ở đâu. Mỗi dòng có 1 chỗ có thể điền, các câu khác nhau cùng 1 dạng thì chọn tổ hợp chỗ điền khác nhau."
--   Trần 4 ô cố định lúc sinh làm bài 2 biến luôn rụng ô y ⇒ vị trí "y" không bao giờ được đo. Lý thuyết: matrix sampling
--   (mỗi bài đo 1 phần vị trí, gộp cả dạng đo hết) + faded worked examples (Renkl) với chỗ fade xoay dần.
-- Thiết kế: form = TẤT CẢ ô ứng viên (≥2, ≤8), mỗi ô `vi_tri` (tinh_chat_khong_am · bien_doi · dao_chieu · x · y · buoc …).
--   Giao bài (D3, app HS/tự luyện): chọn `so_o_hien` = 3 ô (tối đa `so_o_toi_da` = 4) xoay vòng theo HS × vị trí — snapshot
--   `bai_test_cau.dien` chỉ chứa tổ hợp đã chọn, `dap_an_key`/`o_rule` theo tổ hợp đó; các ô không chọn hiện như chữ thường.
--   Thống kê "HS hay sai ở đâu" = v_dien_loi_hs group by vi_tri + rule (thêm vi_tri vào snapshot ở D3).

-- ── 1) Backfill vi_tri cho form đã có (91 form toán thực tế, ô giá trị theo bước) — chạy TRƯỚC khi siết trigger ─────
update dai_cau_form_dien f
   set o = (select jsonb_agg(case when x ? 'vi_tri' then x else x || '{"vi_tri":"buoc"}'::jsonb end order by ord)
              from jsonb_array_elements(f.o) with ordinality t(x, ord))
 where exists (select 1 from jsonb_array_elements(f.o) x where not (x ? 'vi_tri'));

-- ── 2) Trigger kiểm: 2–8 ô, mỗi ô phải có vi_tri ────────────────────────────────────────────────────────────────
create or replace function public.dai_cau_form_dien_kiem() returns trigger language plpgsql as $$
declare v_n int; v_nb int; v_o jsonb; v_pa jsonb; v_dung int; v_idx int; v_thieu text; v_txt text; i int := 0;
begin
  if jsonb_typeof(new.buoc) <> 'array' or jsonb_typeof(new.o) <> 'array' then raise exception 'buoc/o phải là mảng'; end if;
  v_nb := jsonb_array_length(new.buoc);
  v_n := jsonb_array_length(new.o);
  if v_n < 2 or v_n > 8 then raise exception 'phải 2–8 ô (đang %) — lưu hết ứng viên, giao bài mới chọn 3', v_n; end if;
  select string_agg(b->>'text', E'\n') into v_txt from jsonb_array_elements(new.buoc) b;
  for v_o in select * from jsonb_array_elements(new.o) loop
    i := i + 1;
    if v_o->>'id' <> 'o' || i then raise exception 'ô %: id phải o%', i, i; end if;
    if coalesce(v_o->>'vi_tri', '') = '' then raise exception 'ô %: thiếu vi_tri (nhãn vị trí để thống kê HS sai ở đâu)', i; end if;
    if coalesce((v_o->>'buoc')::int, 0) < 1 or (v_o->>'buoc')::int > v_nb then raise exception 'ô %: buoc ngoài phạm vi', i; end if;
    if coalesce(v_o->>'key', '') = '' or coalesce(v_o->>'key_gia_tri', '') = '' then raise exception 'ô %: thiếu key/key_gia_tri', i; end if;
    if (length(v_txt) - length(replace(v_txt, '⟦o' || i || '⟧', ''))) / length('⟦o' || i || '⟧') <> 1
      then raise exception 'ô %: ⟦o%⟧ phải xuất hiện đúng 1 lần trong buoc', i, i; end if;
    if position('⟦o' || i || '⟧' in new.buoc -> ((v_o->>'buoc')::int - 1) ->> 'text') = 0
      then raise exception 'ô %: bước % không chứa ⟦o%⟧', i, v_o->>'buoc', i; end if;
    v_pa := v_o->'phuong_an';
    if jsonb_typeof(v_pa) <> 'array' or jsonb_array_length(v_pa) <> 4 then raise exception 'ô %: phải 4 phương án', i; end if;
    select count(*) into v_dung from jsonb_array_elements(v_pa) p where (p->>'dung')::boolean;
    if v_dung <> 1 then raise exception 'ô %: phải đúng 1 phương án đúng', i; end if;
    v_idx := ascii(v_o->>'dap_an') - 65;
    if v_idx < 0 or v_idx > 3 or coalesce((v_pa -> v_idx ->> 'dung')::boolean, false) is not true then raise exception 'ô %: dap_an không khớp vị trí', i; end if;
    if exists (select 1 from jsonb_array_elements(v_pa) p where coalesce(trim(p->>'text'), '') = '') then raise exception 'ô %: phương án có text trống', i; end if;
    select string_agg(p->>'rule', ',') into v_thieu from jsonb_array_elements(v_pa) p
      where not (p->>'dung')::boolean and (p->>'rule' is null or not exists (select 1 from dai_mcq_rule r where r.ma = p->>'rule'));
    if v_thieu is not null then raise exception 'ô %: phương án sai thiếu rule hoặc rule không tồn tại: %', i, v_thieu; end if;
  end loop;
  new.updated_at := now();
  return new;
end $$;

-- ── 3) Cấu hình giao bài — 1 nguồn duy nhất cho app HS / tự luyện (§2.0: hằng nghiệp vụ ở DB, client chỉ gọi) ──────
create or replace function public.fn_dien_cau_hinh() returns jsonb language sql immutable as $$
  select '{"so_o_hien": 3, "so_o_toi_da": 4}'::jsonb   -- CEO 12/09: "hiện mặc định 3, tối đa 4"
$$;
grant execute on function public.fn_dien_cau_hinh() to authenticated;
