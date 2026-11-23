-- ============================================================================
-- 202611231840 — Chi phí AI: thêm kênh CLAUDE CODE của Thùy (Thùy 23/11: "token claude code t làm có tính được trên đấy ko" → "Làm đi").
-- Claude Code ghi nhật ký từng câu trả lời trên máy (~/.claude/projects/**/*.jsonl, có model + usage). Script scripts/ai/nhap-claude-code.mjs đọc nhật ký,
-- gộp theo (máy · phiên · model · ngày VN) rồi đẩy qua fn_ai_nhap_claude_code (service_role) — upsert theo khoá ⇒ chạy lại bao nhiêu lần cũng không đếm trùng.
-- Bot phiên Claude tự chạy script mỗi 30 phút ở mọi máy đang chạy bot. Phiên của bot (claude_phien) đã đếm ở kênh 'phien' ⇒ bỏ qua ở đây.
-- Thêm giá model đời cũ để tính được tháng 7–10 (giá API chính thức; ghi / đọc bộ nhớ đệm theo hệ số chuẩn 1,25× · 2× · 0,1×).
-- MẤT GÌ: không xoá dữ liệu; CHECK kenh được nới (bỏ ràng buộc cũ, thêm ràng buộc mới có thêm 'claude_code').
-- ============================================================================
do $$
declare r record;
begin
  for r in select conname from pg_constraint where conrelid = 'public.ai_luot_dung'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%kenh%' loop
    execute format('alter table public.ai_luot_dung drop constraint %I', r.conname);
  end loop;
end $$;
alter table public.ai_luot_dung add constraint ai_luot_dung_kenh_check
  check (kenh in ('phien', 'tro_ly', 'hoi_dap', 'danh_gia', 'cham_btvn', 'claude_code'));

insert into public.ai_bang_gia (model, vao, ra, ghi_5m, ghi_1h, doc_cache, ghi_chu) values
  ('claude-opus-5',     5,  25, 6.25,  10, 0.50, 'Giá API Anthropic, tra 23/11/2026; đệm theo hệ số chuẩn'),
  ('claude-opus-4-8',   5,  25, 6.25,  10, 0.50, 'Giá API Anthropic, tra 23/11/2026; đệm theo hệ số chuẩn'),
  ('claude-opus-4-7',   5,  25, 6.25,  10, 0.50, 'Giá API Anthropic, tra 23/11/2026; đệm theo hệ số chuẩn'),
  ('claude-fable-5',    10, 50, 12.5,  20, 1.00, 'Giá API Anthropic, tra 23/11/2026; đệm theo hệ số chuẩn'),
  ('claude-fable-5-1',  10, 50, 12.5,  20, 1.00, 'Giá API Anthropic, tra 23/11/2026; đệm theo hệ số chuẩn'),
  ('claude-haiku-4-5',  1,  5,  1.25,  2,  0.10, 'Giá API Anthropic, tra 23/11/2026; đệm theo hệ số chuẩn')
on conflict (model) do nothing;

-- p_ds: [{nguon_id, phien, at, model, du_an, vao, ghi_5m, ghi_1h, doc, ra}] — đã gộp sẵn theo (máy · phiên · model · ngày)
create or replace function public.fn_ai_nhap_claude_code(p_ns uuid, p_ds jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v_n int;
begin
  if p_ds is null or jsonb_typeof(p_ds) <> 'array' then raise exception 'p_ds phải là mảng.'; end if;
  if jsonb_array_length(p_ds) > 5000 then raise exception 'Tối đa 5000 dòng một lượt.'; end if;
  if p_ns is not null and not exists (select 1 from nhan_su where id = p_ns) then raise exception 'Không có nhân sự %.', p_ns; end if;
  insert into ai_luot_dung (kenh, nguon_id, at, nhan_su_id, mon, khoi, loai_viec, phien_id, model, vao, ghi_5m, ghi_1h, doc_cache, ra, cost_cli_usd, thue_bao)
  select 'claude_code', x->>'nguon_id', (x->>'at')::timestamptz, p_ns, null, null,
         'Claude Code · ' || coalesce(nullif(x->>'du_an', ''), '?'), null,
         regexp_replace(x->>'model', '-[0-9]{8}$', ''),
         coalesce((x->>'vao')::bigint, 0), coalesce((x->>'ghi_5m')::bigint, 0), coalesce((x->>'ghi_1h')::bigint, 0),
         coalesce((x->>'doc')::bigint, 0), coalesce((x->>'ra')::bigint, 0), null, true
    from jsonb_array_elements(p_ds) x
   where coalesce(x->>'nguon_id', '') <> '' and coalesce(x->>'model', '') ~ '^claude-'
     and not exists (select 1 from claude_phien p where p.id::text = x->>'phien')   -- phiên bot đã đếm ở kênh 'phien'
  on conflict (kenh, nguon_id) do update set
    at = excluded.at, model = excluded.model, loai_viec = excluded.loai_viec, nhan_su_id = excluded.nhan_su_id,
    vao = excluded.vao, ghi_5m = excluded.ghi_5m, ghi_1h = excluded.ghi_1h, doc_cache = excluded.doc_cache, ra = excluded.ra;
  get diagnostics v_n = row_count;
  return jsonb_build_object('ok', true, 'ghi', v_n);
end $$;
revoke execute on function public.fn_ai_nhap_claude_code(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.fn_ai_nhap_claude_code(uuid, jsonb) to service_role;
