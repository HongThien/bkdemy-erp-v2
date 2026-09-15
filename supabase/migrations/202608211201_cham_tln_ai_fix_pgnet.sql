-- ============================================================================
-- Sửa lỗi cú pháp pg_net trong hs_cham_tln_ai (202608211153 đã áp, KHÔNG sửa trực tiếp
-- theo CLAUDE.md §2.1 — đè bằng CREATE OR REPLACE ở migration mới). Verify thật (vite-node,
-- HS0004 thật, câu "92 405 – 36 728") báo lỗi: "column \"id\" does not exist" — do viết
-- `select id into v_req_id from net.http_post(...)` như thể http_post trả BẢNG, nhưng nó
-- trả THẲNG bigint (request_id). `net.http_collect_response(id, false)` cũng KHÔNG trả cột
-- status_code/body phẳng — trả `(status, message, response)` với `response` là composite
-- lồng `(status_code, headers, body)`. Sửa cho đúng cấu trúc thật (đã dò bằng pg_attribute).
-- ============================================================================
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
    select net.http_post(
      url := 'https://api.deepseek.com/chat/completions',
      body := jsonb_build_object(
        'model', 'deepseek-chat', 'max_tokens', 300,
        'response_format', jsonb_build_object('type', 'json_object'),
        'messages', jsonb_build_array(jsonb_build_object('role', 'user', 'content', v_prompt))
      ),
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_api_key),
      timeout_milliseconds := 20000
    ) into v_req_id;
    select * into v_resp from net.http_collect_response(v_req_id, false);
    if v_resp.status is distinct from 'SUCCESS' or (v_resp.response).status_code is null or (v_resp.response).status_code >= 300 then
      v_loi := 'net_' || coalesce(v_resp.status::text, '?') || ': ' || coalesce(v_resp.message, left((v_resp.response).body, 200));
    else
      v_body := (v_resp.response).body::jsonb;
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

  if v_equiv is true then
    insert into bai_test_report (bai_lam_cau_id, hoc_sinh_id, y_kien, nguon)
      values (p_bai_lam_cau_id, v_hs, v_reason, 'ai_de_xuat');
  end if;

  return jsonb_build_object('equivalent', coalesce(v_equiv, false), 'reason', v_reason, 'error', v_loi);
end $$;
