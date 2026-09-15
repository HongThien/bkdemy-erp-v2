-- 202609061535 — giaibai_nhan_fix_hinh_hoan_thien
-- BUG lộ ngay khi verify tay mig 202609061526 (Nhận thử 1 câu Hoàn thiện nhánh Hình, rollback):
-- "column loi_giai does not exist" — `fn_giaibai_nhan` dùng `fn_giaibai_src('hinh_baitoan')` (trả
-- src='hinh_baitoan', src_key='id') để đọc bản Claude, nhưng `hinh_baitoan` KHÔNG có cột `loi_giai` —
-- lời giải bài toán gốc nằm ở bảng RIÊNG `hinh_cach_giai` (baitoan_id → nhiều cách giải); biến thể thì
-- lời giải nằm ngay trên `hinh_baitoan_bien_the.loi_giai` (đúng), và bảng đó KHÔNG có cột `dap_an`.
-- `fn_giaibai_src` vẫn ĐÚNG cho mục đích ban đầu (dispatch bảng câu hỏi gốc của toan/khtn/hgt) — chỉ
-- riêng bước đọc BẢN AI ĐỂ HOÀN THIỆN của nhánh Hình cần tách case, không dùng chung dispatch đó.
-- MẤT GÌ (Luật xoá): không — create-or-replace, giữ chữ ký.
create or replace function public.fn_giaibai_nhan(p_nhanh text, p_key text, p_me uuid)
returns uuid
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); s record := public.fn_giaibai_src(p_nhanh);
        v_id uuid; n int; v_ten text; v_che_do text; v_lg_ai text; v_da_ai text; v_model text;
begin
  if r.yc is null then raise exception 'fn_giaibai_nhan: nhánh không hợp lệ %', p_nhanh; end if;
  if p_me is null then raise exception 'Chưa xác định người nhận.'; end if;
  if exists (select 1 from public.v_giaibai_bai b where b.nhanh = p_nhanh and b.key = p_key) then
    v_che_do := 'giai'; v_lg_ai := null; v_da_ai := null; v_model := null;
  elsif exists (select 1 from public.v_giaibai_hoan_thien b where b.nhanh = p_nhanh and b.key = p_key) then
    v_che_do := 'hoan_thien';
    if p_nhanh in ('toan','khtn','hgt') then
      execute format('select loi_giai, dap_an from %I where %I = %s', s.src, s.src_key, r.key_cast) into v_lg_ai, v_da_ai using p_key;
    elsif p_nhanh = 'hinh_baitoan' then
      -- Lời giải bài toán gốc nằm ở hinh_cach_giai (1 baitoan có thể nhiều cách) — lấy đúng cách claude_code
      -- chưa duyệt (v_giaibai_hoan_thien đã đảm bảo chỉ 1 dòng thoả điều kiện này cho mỗi bài toán).
      select loi_giai into v_lg_ai from hinh_cach_giai
        where baitoan_id = p_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false
        order by la_mac_dinh desc, thu_tu limit 1;
      v_da_ai := null; -- Hình không có khái niệm "đáp án ngắn"
    else -- hinh_bien_the: lời giải nằm ngay trên chính bảng, không có cột dap_an
      select loi_giai into v_lg_ai from hinh_baitoan_bien_the where id = p_key::uuid;
      v_da_ai := null;
    end if;
    v_model := 'claude_code';
  else
    raise exception 'Bài này không còn trong danh sách chưa có lời giải.';
  end if;
  select count(*) into n from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.dang_giu and v.trang_thai in ('dang_giai','can_sua');
  if n >= 3 then raise exception 'Bạn đang giữ 3 bài — nộp hoặc trả bớt rồi nhận thêm.'; end if;
  if exists (select 1 from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.nhanh = p_nhanh and v.key = p_key and v.tu_choi_lan >= 3) then
    raise exception 'Bài này bạn đã bị từ chối 3 lần — không nhận lại được.';
  end if;
  perform public.fn_giaibai_dong_qua_han(p_nhanh, p_key);
  select coalesce(v.nguoi_giai_ten, 'Claude') into v_ten from public.v_giaibai_nhan v where v.nhanh = p_nhanh and v.key = p_key and v.xu_ly_at is null limit 1;
  if v_ten is not null then raise exception '% đang giữ bài này.', v_ten; end if;
  begin
    execute format('insert into %I (%I, nguoi_yeu_cau, nguoi_giai, trang_thai, han_at, che_do, loi_giai_nhap, dap_an_nhap, loi_giai_ai, ai_model)
                     values (%s, $2, $2, ''dang_giai'', now() + interval ''48 hours'', $3, $4, $5, $4, $6) returning id',
                    r.yc, r.key_col, r.key_cast)
      into v_id using p_key, p_me, v_che_do, v_lg_ai, v_da_ai, v_model;
  exception when unique_violation then
    raise exception 'Bài này vừa có người khác nhận trước 1 bước — thử bài khác.';
  end;
  return v_id;
end $$;
grant execute on function public.fn_giaibai_nhan(text, text, uuid) to authenticated;
