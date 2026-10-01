-- ============================================================================
-- 202609291225 — troly_tuan_chenh_lech
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Tổng kết tuần (mig 202609291215) trả số của tuần xem và tuần liền trước, nhưng CHƯA trả
--   phần chênh lệch và con số gộp các khâu. Để màn hình tự trừ / tự cộng là phép tính nghiệp vụ
--   nằm ở client (CLAUDE.md §2.0: nguồn công thức duy nhất là hàm Postgres) ⇒ tính luôn ở đây:
--     · `so.tong_khau` / `truoc.tong_khau` — gộp mọi khâu: bao nhiêu việc tới hạn, bao nhiêu
--       đúng chuẩn / chậm / thiếu, tỉ lệ. Đây là con số đứng đầu dashboard.
--     · `chenh` — tuần xem TRỪ tuần trước, cho mọi tỉ lệ màn hình có bày.
--   Thiếu một bên (tuần trước không có việc ⇒ tỉ lệ NULL) thì chênh lệch là NULL, màn hình
--   không bày mũi tên — không coi NULL là 0.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Thêm 2 hàm phụ; thay thân `fn_troly_tuan` (thêm khoá vào JSON trả về, không
--   bỏ khoá nào). Bản lưu của tuần đã tính trước migration này thiếu 2 khoá mới — bấm "↻ Tính lại"
--   là có; màn hình chịu được việc thiếu.
-- ============================================================================

create or replace function public._troly_chenh(a jsonb, b jsonb, variadic p text[]) returns numeric
language sql immutable as $$
  select (a #>> p)::numeric - (b #>> p)::numeric
$$;

-- Gộp mọi khâu của một tuần thành một dòng số.
create or replace function public._troly_tuan_tong_khau(p_khau jsonb) returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'tong', coalesce(sum((k->>'tong')::int), 0),
    'con_han', coalesce(sum((k->>'con_han')::int), 0),
    'da_toi_han', coalesce(sum((k->>'da_toi_han')::int), 0),
    'dung_chuan', coalesce(sum((k->>'dung_chuan')::int), 0),
    'cham', coalesce(sum((k->>'cham')::int), 0),
    'thieu', coalesce(sum((k->>'thieu')::int), 0),
    'pct_dung_chuan', round(sum((k->>'dung_chuan')::int) * 100.0 / nullif(sum((k->>'da_toi_han')::int), 0), 1),
    'pct_cham', round(sum((k->>'cham')::int) * 100.0 / nullif(sum((k->>'da_toi_han')::int), 0), 1),
    'pct_thieu', round(sum((k->>'thieu')::int) * 100.0 / nullif(sum((k->>'da_toi_han')::int), 0), 1))
  from jsonb_array_elements(coalesce(p_khau, '[]'::jsonb)) k
$$;

create or replace function public.fn_troly_tuan(p_tuan date) returns jsonb
language plpgsql stable as $$
declare
  v_nay date := public._troly_hom_nay();
  v_tu date := public._troly_dau_tuan(p_tuan);
  v_den date := public._troly_dau_tuan(p_tuan) + 6;
  s jsonb; t jsonb;
begin
  perform public._troly_gac();
  if v_tu > v_nay then raise exception 'Tuần này chưa bắt đầu.'; end if;

  s := public._troly_tuan_so(v_tu, least(v_den, v_nay));
  t := public._troly_tuan_so(v_tu - 7, v_tu - 1);
  s := s || jsonb_build_object('tong_khau', public._troly_tuan_tong_khau(s->'khau'));
  t := t || jsonb_build_object('tong_khau', public._troly_tuan_tong_khau(t->'khau'));

  return jsonb_build_object(
    'bo', 'tuan', 'ten', 'Tổng kết tuần',
    'tu', v_tu, 'den', v_den,
    'da_ket_thuc', v_den < v_nay,
    'tao_luc', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
    'so', s,
    'truoc', t,
    'chenh', jsonb_build_object(
      'so_buoi', public._troly_chenh(s, t, 'quy_mo', 'so_buoi'),
      'chuyen_can_pct', public._troly_chenh(s, t, 'quy_mo', 'chuyen_can_pct'),
      'btvn_hs_pct', public._troly_chenh(s, t, 'btvn_hs', 'ti_le_pct'),
      'tong_khau', jsonb_build_object(
        'pct_dung_chuan', public._troly_chenh(s, t, 'tong_khau', 'pct_dung_chuan'),
        'pct_cham', public._troly_chenh(s, t, 'tong_khau', 'pct_cham'),
        'pct_thieu', public._troly_chenh(s, t, 'tong_khau', 'pct_thieu')),
      'khau', (select coalesce(jsonb_object_agg(a->>'ma', jsonb_build_object(
                  'pct_dung_chuan', (a->>'pct_dung_chuan')::numeric - (b->>'pct_dung_chuan')::numeric,
                  'pct_cham', (a->>'pct_cham')::numeric - (b->>'pct_cham')::numeric,
                  'pct_thieu', (a->>'pct_thieu')::numeric - (b->>'pct_thieu')::numeric)), '{}'::jsonb)
                from jsonb_array_elements(s->'khau') a
                join jsonb_array_elements(t->'khau') b on b->>'ma' = a->>'ma'),
      'bo_tro_yeu', jsonb_build_object(
        'can_bo_tro', public._troly_chenh(s, t, 'bo_tro_yeu', 'can_bo_tro'),
        'pct_len_lich', public._troly_chenh(s, t, 'bo_tro_yeu', 'pct_len_lich'),
        'pct_da_bo_tro', public._troly_chenh(s, t, 'bo_tro_yeu', 'pct_da_bo_tro'),
        'pct_su_co', public._troly_chenh(s, t, 'bo_tro_yeu', 'pct_su_co')),
      'bo_tro_bu', jsonb_build_object(
        'pct_da_xep', public._troly_chenh(s, t, 'bo_tro_bu', 'pct_da_xep')),
      'thoi_gian', jsonb_build_object(
        'duyet_den_xep', public._troly_chenh(s, t, 'thoi_gian', 'duyet_den_xep', 'tb_ngay'),
        'xep_den_dien_ra', public._troly_chenh(s, t, 'thoi_gian', 'xep_den_dien_ra', 'tb_ngay'))),
    'xep_hang', public._troly_tuan_xep_hang(v_tu, least(v_den, v_nay)),
    'xep_hang_bo_qua', (select coalesce(jsonb_agg(ns.ho_ten order by ns.ma_ns), '[]'::jsonb) from nhan_su ns
                         where (public._troly_bc_gia_dinh()->'xep_hang_bo_qua') ? coalesce(ns.ma_ns, '')),
    'cach_tinh', jsonb_build_array(
      'Mẫu số của các tỉ lệ = việc đã tới hạn hoặc đã đóng. Việc còn trong hạn mà chưa đóng để riêng, không tính vào tỉ lệ.',
      'ĐÚNG CHUẨN = đóng đúng hạn và đủ dữ liệu. CHẬM = đóng sau hạn, hoặc quá hạn mà chưa đóng. THIẾU = buổi không có đề / không gán bài, bấm đóng mà trống, hoặc đóng mà còn em có mặt thiếu dữ liệu.',
      'Một việc có nhiều người phụ trách thì tính cho từng người ở bảng xếp hạng, nhưng chỉ tính MỘT lần ở con số của trung tâm.',
      'Chênh lệch = tuần đang xem trừ tuần liền trước, tính bằng điểm phần trăm (hoặc ngày, với thời gian).',
      'Bổ trợ yếu — "cần bổ trợ" = case còn ít nhất một dạng phải dạy trong tuần. "Đã lên lịch" / "đã bổ trợ" đếm theo CASE; "sự cố" đếm theo LƯỢT xếp (1 học sinh × 1 buổi).',
      '"Chuyển lịch" chưa đo được chính xác vì hệ không ghi vết đổi ngày/giờ buổi bổ trợ; con số gần nhất là lượt bị "OPS gỡ khỏi lịch phòng".',
      'Sự cố "không ai điểm danh" = buổi qua ngày mà không có điểm danh nên hệ tự huỷ; không biết em có đến hay không, nên để riêng với "học sinh không đến".',
      'Duyệt → xếp lịch: tính trên case có LẦN XẾP ĐẦU rơi vào tuần. Xếp lịch → diễn ra: tính trên lượt đã diễn ra trong tuần.',
      'Bổ trợ bù tính theo LƯỢT VẮNG của tuần: tới lúc tính thì lượt vắng đó đã được xếp bù / đã học bù chưa. Tuần càng mới thì số "đã học bù" càng thấp vì buổi bù chưa tới ngày.',
      'BTVN của học sinh: một em đạt chuẩn khi đã nộp + có thái độ + có điểm chấm; "xin phép" vẫn tính là chưa nộp.',
      'Chấm bài trên lớp chỉ bắt buộc từ 01/10/2026 nên trước đó không có trong tổng kết.'));
end $$;

-- Hàm tính bên trong: không mở cho người dùng gọi thẳng (cửa duy nhất là fn_troly_tuan_lay).
revoke all on function public._troly_chenh(jsonb, jsonb, text[]) from public, anon, authenticated;
revoke all on function public._troly_tuan_tong_khau(jsonb) from public, anon, authenticated;
revoke all on function public.fn_troly_tuan(date) from public, anon, authenticated;
