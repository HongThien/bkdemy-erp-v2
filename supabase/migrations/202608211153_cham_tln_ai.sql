-- ============================================================================
-- CHẤM TRẢ LỜI NGẮN BẰNG AI (Thùy 21/08, mô hình V1: vòng 1 chấm theo key · vòng 2 khi
-- lệch key thì hỏi AI xem có ĐÚNG BẢN CHẤT không (vd đáp án "5", HS ghi "5 cái bánh") ·
-- vòng 3 nếu AI xác nhận đúng thì thêm vào bộ đáp án để lần sau tự chấm đúng).
-- CEO chốt thêm: (a) CHỈ trả lời ngắn (TN/Đúng-sai không cần — vị trí cố định, không có gì
-- để "diễn đạt khác nhau") (b) MỌI lần AI chấm lệch với key đều phải GHI LOG (c) việc thêm
-- đáp án vào DB (question_accepted_answers, tự backfill NHIỀU bài) PHẢI ĐƯỢC NGƯỜI DUYỆT —
-- KHÔNG tự động 100%, đúng nguyên tắc "AI gợi ý → người confirm" đã chốt ở CLAUDE.md §5.
--
-- KIẾN TRÚC: gọi DeepSeek TỪ TRONG POSTGRES (pg_net), KHÔNG gọi từ client — app này sắp
-- deploy công khai (hs.bkacademy.edu.vn), lộ VITE_DEEPSEEK_KEY qua devtools là mất key thật
-- (đúng cảnh báo có sẵn trong src/lib/kho/api.ts: "trước khi deploy public phải qua proxy").
-- Supabase Vault (đúng chỗ nên cất secret) đã cài (supabase_vault@0.3.1) NHƯNG role
-- claude_build KHÔNG có quyền usage schema vault (đã verify: "permission denied for schema
-- vault") — cần Thùy tự bật qua Supabase Dashboard nếu muốn dùng Vault chuẩn. TẠM THỜI dùng
-- bảng `_app_secrets` riêng: KHÔNG grant cho anon/authenticated, bật RLS không policy nào
-- (chủ bảng — claude_build, cũng là chủ hàm SECURITY DEFINER bên dưới — mặc định BYPASS RLS
-- trên bảng của chính mình; role khác thì bị chặn tuyệt đối) → chỉ RPC bên dưới đọc được,
-- không lộ qua PostgREST dù cố tình truy vấn thẳng.
--
-- LUỒNG: hs_cham_tln_ai(bai_lam_cau_id) — HS gọi NGAY sau khi vòng 1+cache đã chấm 'wrong'
-- (fire-and-forget ở client — KHÔNG chờ, tránh chậm màn "chấm tức thì"). RPC: đọc câu+đáp án
-- HS THẲNG TỪ DB (không tin tham số client gửi lên, chỉ nhận đúng 1 id), gọi DeepSeek, GHI
-- LOG (mọi lần, kể cả AI nói vẫn sai), nếu AI nói ĐÚNG thì tạo 1 dòng bai_test_report
-- (nguon='ai_de_xuat') — CHỈ vậy, KHÔNG tự sửa bai_lam_cau, KHÔNG tự ghi
-- question_accepted_answers. Dòng report này tự nổi lên màn "Duyệt chấm online" có sẵn
-- (DuyetChamScreen.tsx đọc bai_test_report trang_thai='moi') — GV bấm "✓ Chấp nhận đúng"
-- (chapNhanDapAn, ĐÃ CÓ SẴN, không sửa) mới thật sự ghi vào DB + backfill.
-- ============================================================================

create extension if not exists pg_net;

-- ── Secret store tối giản (xem giải thích ở trên) ───────────────────────────────
create table public._app_secrets (
  name text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public._app_secrets enable row level security;
-- KHÔNG policy nào, KHÔNG grant cho anon/authenticated — mặc định deny tuyệt đối cho mọi
-- role khác ngoài chủ bảng. Giá trị thật KHÔNG nằm trong migration này (không lộ qua git) —
-- nạp riêng bằng script 1 lần, đọc từ .env.local (gitignored), xem DEVLOG.

-- ── Nguồn của 1 báo cáo (Thùy: mọi lần AI chốt lệch phải log — đây là NƠI ĐÍCH khi AI nói
-- ĐÚNG; log ĐẦY ĐỦ mọi lần gọi kể cả AI nói vẫn sai nằm ở bảng tln_ai_cham_log dưới) ────
alter table bai_test_report add column nguon text not null default 'hs_bao_sai';
alter table bai_test_report add constraint bai_test_report_nguon_check check (nguon in ('hs_bao_sai', 'ai_de_xuat'));
comment on column bai_test_report.nguon is
  'hs_bao_sai = HS tự bấm "Em nghĩ mình đúng" · ai_de_xuat = AI (vòng 2 chấm TLN) tự đề xuất — DuyetChamScreen hiện khác nhãn theo cột này. Cả 2 đều cần GV duyệt như nhau (chapNhanDapAn), không có đường tắt.';

-- ── Nhật ký MỌI lần gọi AI chấm TLN (Thùy: "tất cả những gì AI chốt lệch với key đều cần
-- ghi log") — ghi CẢ 2 chiều (AI nói đúng lẫn AI nói vẫn sai), staff-only, chưa cần màn
-- riêng (query thẳng khi cần) ────────────────────────────────────────────────────────
create table public.tln_ai_cham_log (
  id uuid primary key default gen_random_uuid(),
  bai_lam_cau_id uuid not null references bai_lam_cau(id),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ma_cau text,
  dap_an_key text,
  dap_an_hs text,
  equivalent boolean, -- null = gọi AI lỗi (xem cot loi), không phải AI nói sai
  reason text,
  model text not null default 'deepseek-chat',
  loi text,
  created_at timestamptz not null default now()
);
create index tln_ai_cham_log_bai_lam_cau_idx on tln_ai_cham_log (bai_lam_cau_id);
alter table tln_ai_cham_log enable row level security;
-- jwt_uid() (public, KHÔNG auth.uid() trực tiếp) — claude_build không có usage schema auth,
-- đúng pattern my_hoc_sinh_id() đã dùng sẵn (đọc sub từ request.jwt.claims).
create policy tln_ai_cham_log_staff_read on tln_ai_cham_log for select to authenticated
  using (exists (select 1 from tai_khoan tk where tk.id = public.jwt_uid() and tk.nhan_su_id is not null));
-- KHÔNG policy insert cho authenticated — chỉ RPC SECURITY DEFINER bên dưới ghi (bypass RLS
-- vì chủ bảng = chủ hàm), HS không tự ý ghi log giả qua PostgREST.

-- ── RPC chính ────────────────────────────────────────────────────────────────
create or replace function public.hs_cham_tln_ai(p_bai_lam_cau_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_row record;
  v_key text;
  v_hs_ans text;
  v_prompt text;
  v_api_key text;
  v_req_id bigint;
  v_resp record;
  v_body jsonb;
  v_content text;
  v_parsed jsonb;
  v_equiv boolean;
  v_reason text;
  v_loi text;
begin
  if v_hs is null then return jsonb_build_object('equivalent', false); end if;

  -- Đọc THẲNG từ DB theo id — KHÔNG tin câu/đáp án client tự gửi lên (chống giả mạo prompt).
  -- Chỉ chấm AI cho: của CHÍNH HS này, đang 'wrong', đúng loại 'tra_loi_ngan' (Thùy: chỉ TLN).
  select blc.id, bc.ma_cau, bc.noi_dung, (bc.dap_an_key #>> '{}') as dap_an_key, (blc.dap_an_hs #>> '{}') as dap_an_hs
    into v_row
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test_cau bc on bc.id = blc.bai_test_cau_id
    where blc.id = p_bai_lam_cau_id and bl.hoc_sinh_id = v_hs
      and blc.verdict = 'wrong' and bc.loai_cau = 'tra_loi_ngan'
    limit 1;
  if v_row.id is null then return jsonb_build_object('equivalent', false, 'error', 'khong_hop_le'); end if;

  v_key := coalesce(v_row.dap_an_key, '');
  v_hs_ans := coalesce(v_row.dap_an_hs, '');
  if v_hs_ans = '' then return jsonb_build_object('equivalent', false); end if;

  select value into v_api_key from public._app_secrets where name = 'deepseek_api_key';
  if v_api_key is null then
    insert into tln_ai_cham_log (bai_lam_cau_id, hoc_sinh_id, ma_cau, dap_an_key, dap_an_hs, loi)
      values (p_bai_lam_cau_id, v_hs, v_row.ma_cau, v_key, v_hs_ans, 'thieu_api_key');
    return jsonb_build_object('equivalent', false, 'error', 'thieu_api_key');
  end if;

  v_prompt := format(
    $p$Câu hỏi: %s
Đáp án chuẩn: %s
Học sinh trả lời: %s

Học sinh trả lời có ĐÚNG VỀ BẢN CHẤT không (cùng giá trị/ý nghĩa với đáp án chuẩn, chỉ khác cách diễn đạt/đơn vị/định dạng — vd đáp án "5" và "5 cái bánh" là ĐÚNG NHƯ NHAU)? Trả lời CHỈ bằng JSON, không thêm chữ nào khác: {"equivalent": true hoặc false, "reason": "1 câu tiếng Việt ngắn gọn giải thích"}$p$,
    coalesce(v_row.noi_dung, '(không có)'), v_key, v_hs_ans
  );

  begin
    select id into v_req_id from net.http_post(
      url := 'https://api.deepseek.com/chat/completions',
      body := jsonb_build_object(
        'model', 'deepseek-chat', 'max_tokens', 300,
        'response_format', jsonb_build_object('type', 'json_object'),
        'messages', jsonb_build_array(jsonb_build_object('role', 'user', 'content', v_prompt))
      ),
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_api_key),
      timeout_milliseconds := 20000
    );
    select * into v_resp from net.http_collect_response(v_req_id, false);
    if v_resp.status_code is null or v_resp.status_code >= 300 then
      v_loi := 'http_' || coalesce(v_resp.status_code::text, 'null') || ': ' || coalesce(v_resp.error_msg, left(v_resp.body::text, 200));
    else
      v_body := v_resp.body::jsonb;
      v_content := v_body #>> '{choices,0,message,content}';
      v_parsed := v_content::jsonb; -- response_format json_object đảm bảo content LÀ JSON hợp lệ
      v_equiv := (v_parsed ->> 'equivalent')::boolean;
      v_reason := v_parsed ->> 'reason';
    end if;
  exception when others then
    v_loi := sqlerrm;
  end;

  insert into tln_ai_cham_log (bai_lam_cau_id, hoc_sinh_id, ma_cau, dap_an_key, dap_an_hs, equivalent, reason, loi)
    values (p_bai_lam_cau_id, v_hs, v_row.ma_cau, v_key, v_hs_ans, v_equiv, v_reason, v_loi);

  -- Vòng 3 SỬA LẠI theo Thùy: AI nói đúng → CHỈ tạo báo cáo chờ duyệt, KHÔNG tự ghi
  -- question_accepted_answers/bai_lam_cau. GV bấm duyệt (chapNhanDapAn có sẵn) mới thật.
  if v_equiv is true then
    insert into bai_test_report (bai_lam_cau_id, hoc_sinh_id, y_kien, nguon)
      values (p_bai_lam_cau_id, v_hs, v_reason, 'ai_de_xuat');
  end if;

  return jsonb_build_object('equivalent', coalesce(v_equiv, false), 'reason', v_reason, 'error', v_loi);
end $$;
grant execute on function public.hs_cham_tln_ai(uuid) to authenticated;
