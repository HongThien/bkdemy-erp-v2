-- ============================================================================
-- 202609062356 — thong_bao_hs_baoloi_duyet
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_chap_nhan_dap_an (202608300251) đã backfill verdict đúng khi TA/GV
--   duyệt "Em nghĩ mình đúng" là ĐÚNG, nhưng HS không biết trừ khi tự mở lại đúng
--   bài đó xem lại kết quả. CEO: muốn HS THẤY được hệ thống có lắng nghe khi mình
--   báo lỗi đúng — hòm thư IN-APP đơn giản (app HS chưa có hạ tầng push OS, xem
--   push_dang_ky CHECK app in ('pt','ta') — không đụng, không mở rộng ở đây).
-- MẤT GÌ (Luật xoá): không mất gì — bảng mới + nối thêm 1 bước INSERT vào ĐÚNG
--   transaction cũ của fn_chap_nhan_dap_an; hành vi cache/backfill/resolve-report
--   giữ NGUYÊN 100%, chỉ CREATE OR REPLACE thêm đoạn báo tin.
-- ============================================================================

create table if not exists thong_bao_hs (
  id          uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  mon         text not null,                 -- §1.6: dữ liệu học tập phải mang nhãn môn
  noi_dung    text not null,
  doc_at      timestamptz,                   -- NULL = chưa đọc (trạng thái CHƯA XẢY RA, không phải "chưa đo")
  created_at  timestamptz not null default now()
);
create index if not exists idx_thong_bao_hs_hs on thong_bao_hs(hoc_sinh_id, created_at desc);

alter table thong_bao_hs enable row level security;

-- Staff (TA/GV) cần INSERT được — fn_chap_nhan_dap_an chạy INVOKER rights (không security definer),
-- người gọi RPC là chính TA/GV bấm "Chấp nhận đúng" ở DuyetChamScreen.
create policy thong_bao_hs_staff on thong_bao_hs for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- HS chỉ đọc + tự đánh dấu đã đọc thư CỦA MÌNH — không tự tạo/xoá (hệ thống mới được viết thư).
create policy thong_bao_hs_hs_select on thong_bao_hs for select to authenticated
  using (hoc_sinh_id = public.my_hoc_sinh_id());
create policy thong_bao_hs_hs_update on thong_bao_hs for update to authenticated
  using (hoc_sinh_id = public.my_hoc_sinh_id())
  with check (hoc_sinh_id = public.my_hoc_sinh_id());

grant select, insert, update, delete on thong_bao_hs to authenticated;

-- Nối thêm bước "báo tin cho HS" vào ĐÚNG transaction chấp-nhận-đáp-án cũ (không tách luồng mới,
-- không đổi hành vi cache/backfill/resolve-report gốc — chỉ thêm 1 INSERT trước 2 UPDATE cũ).
-- CHỈ báo cho HS đã tự báo lỗi (bai_test_report đang 'moi') — HS khác vô tình trùng đáp án nhưng
-- chưa từng lên tiếng thì không có gì để "xác nhận lại" với họ.
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
    insert into thong_bao_hs (hoc_sinh_id, mon, noi_dung)
    select r.hoc_sinh_id, bt.mon,
      '🎉 Báo lỗi của em đúng rồi! Đáp án "' || p_dap_an_raw || '" đã được chấp nhận, kết quả bài ' ||
      coalesce(case bt.loai
        when 'tu_luyen' then 'Tự luyện' when 'btvn' then 'BTVN' when 'giao_trinh' then 'Bài tập trên lớp'
        when 'et' then 'ET' when 'de_thi' then 'Đề thi' else bt.loai end, 'đã làm')
      || ' ngày ' || to_char(bt.ngay, 'DD/MM') || ' đã được cập nhật lại cho em.'
    from bai_test_report r
    join bai_lam_cau blc2 on blc2.id = r.bai_lam_cau_id
    join bai_test_cau btc2 on btc2.id = blc2.bai_test_cau_id
    join bai_test bt on bt.id = btc2.bai_test_id
    where r.bai_lam_cau_id in (select id from _cnda) and r.trang_thai = 'moi';

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
