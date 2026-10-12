-- ============================================================================
-- 202610101606 — hs_bao_loi_cau: HỌC SINH BÁO LỖI TỪNG CÂU HỎI (đề thiếu/sai · hình lỗi · công thức lỗi · đáp án sai · lời giải sai)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 10/10): nút Góp ý nổi chỉ biết HS ở màn nào, KHÔNG biết câu nào ⇒ thầy cô không sửa được. Nút "🚩 Em nghĩ mình đúng" (bai_test_report)
--   chỉ hiện SAU khi bị chấm sai, không có lý do, và trang_thai của nó = 'dung'/'sai' = phán quyết "HS đúng hay sai" — trộn "đề lỗi" vào đó thì
--   thầy cô bấm "đúng" ở tab Duyệt chấm là vô tình nhận đáp án lạ. ⇒ BẢNG RIÊNG cho lỗi của CÂU (nội dung kho), gắn mã câu.
--
-- MÔ HÌNH (§1.5): 1 dòng = 1 báo cáo THẬT của 1 HS về 1 câu (mon · ma_cau · ly_do). Không dòng placeholder. Mỗi (HS, môn, câu, lý do) chỉ 1 báo cáo ĐANG MỞ
--   (chống bấm lặp); trạng thái đổi: moi → da_xu_ly | khong_loi (thầy cô xử lý theo CÂU, mọi báo cáo mở của câu đó cùng đóng).
--   mon + ma_cau lấy từ snapshot bài (bai_test.mon, bai_test_cau.ma_cau) — HS KHÔNG tự khai (không giả mã câu). ma_cau là TEXT không FK (kho rác xoa_at).
-- QUYỀN: HS chỉ báo câu trong bài MÌNH làm (bài tự luyện của em hoặc bài lớp em đã mở bai_lam); hạn mức 10 báo cáo/ngày (giờ VN) — Thùy 10/10.
--   Nhân sự đọc/xử lý theo chức năng 'bdkt' (Bản đồ kiến thức / Kho).
-- MẤT GÌ: không xoá/thu hẹp gì — thêm 1 bảng + 3 hàm.
-- ============================================================================

create table if not exists public.bai_cau_bao_loi (
  id              uuid primary key default gen_random_uuid(),
  hoc_sinh_id     uuid not null references public.hoc_sinh(id) on delete cascade,
  mon             text not null,
  ma_cau          text not null,
  bai_test_cau_id uuid references public.bai_test_cau(id) on delete set null,
  ly_do           text not null check (ly_do in ('thieu_du_kien', 'hinh_loi', 'cong_thuc_loi', 'dap_an_sai', 'loi_giai_sai', 'khac')),
  ghi_chu         text check (ghi_chu is null or length(ghi_chu) <= 500),
  trang_thai      text not null default 'moi' check (trang_thai in ('moi', 'da_xu_ly', 'khong_loi')),
  xu_ly_boi       uuid,
  xu_ly_at        timestamptz,
  xu_ly_ghi_chu   text,
  created_at      timestamptz not null default now()
);
-- 1 báo cáo ĐANG MỞ / (HS, môn, câu, lý do)
create unique index if not exists bai_cau_bao_loi_mo_uq on public.bai_cau_bao_loi (hoc_sinh_id, mon, ma_cau, ly_do) where trang_thai = 'moi';
create index if not exists bai_cau_bao_loi_cau_idx on public.bai_cau_bao_loi (mon, ma_cau, trang_thai);
create index if not exists bai_cau_bao_loi_hs_ngay_idx on public.bai_cau_bao_loi (hoc_sinh_id, created_at desc);
alter table public.bai_cau_bao_loi enable row level security;
revoke all on public.bai_cau_bao_loi from anon, authenticated;

-- ── HS gửi ──────────────────────────────────────────────────────────────────
create or replace function public.fn_hs_bao_loi_cau(p_bai_test_cau_id uuid, p_ly_do text, p_ghi_chu text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_ma text; v_mon text; v_bt uuid; v_ghi text := nullif(btrim(coalesce(p_ghi_chu, '')), '');
  v_da integer; v_id uuid;
  v_han constant integer := 10;   -- báo cáo / HS / ngày (Thùy 10/10)
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_ly_do not in ('thieu_du_kien', 'hinh_loi', 'cong_thuc_loi', 'dap_an_sai', 'loi_giai_sai', 'khac') then raise exception 'Lý do không hợp lệ.' using errcode = '22023'; end if;
  if p_ly_do = 'khac' and (v_ghi is null or length(v_ghi) < 5) then raise exception 'Em viết thêm vài chữ cho thầy cô hiểu nhé.' using errcode = '22023'; end if;
  if v_ghi is not null and length(v_ghi) > 500 then raise exception 'Ghi chú tối đa 500 chữ.' using errcode = '22023'; end if;

  select c.ma_cau, t.mon, t.id into v_ma, v_mon, v_bt
    from bai_test_cau c join bai_test t on t.id = c.bai_test_id
   where c.id = p_bai_test_cau_id
     and (t.hoc_sinh_id = v_hs or exists (select 1 from bai_lam b where b.bai_test_id = t.id and b.hoc_sinh_id = v_hs));
  if v_ma is null then raise exception 'Không tìm thấy câu này trong bài của em.' using errcode = 'P0002'; end if;

  select count(*) into v_da from bai_cau_bao_loi where hoc_sinh_id = v_hs and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  if v_da >= v_han then raise exception 'Hôm nay em đã báo % câu rồi, mai em báo tiếp nhé. Cảm ơn em!', v_han using errcode = 'P0001'; end if;

  insert into bai_cau_bao_loi (hoc_sinh_id, mon, ma_cau, bai_test_cau_id, ly_do, ghi_chu)
  values (v_hs, v_mon, v_ma, p_bai_test_cau_id, p_ly_do, v_ghi)
  on conflict (hoc_sinh_id, mon, ma_cau, ly_do) where trang_thai = 'moi' do update set ghi_chu = coalesce(excluded.ghi_chu, bai_cau_bao_loi.ghi_chu)
  returning id into v_id;
  return jsonb_build_object('id', v_id, 'con_lai_hom_nay', greatest(0, v_han - v_da - 1));
end $$;
revoke all on function public.fn_hs_bao_loi_cau(uuid, text, text) from public;
revoke execute on function public.fn_hs_bao_loi_cau(uuid, text, text) from anon;
grant execute on function public.fn_hs_bao_loi_cau(uuid, text, text) to authenticated;

-- ── Nhân sự: danh sách theo CÂU (nhiều HS báo cùng câu gộp 1 dòng) ───────────────
create or replace function public.fn_bao_loi_cau_ds(p_trang_thai text default 'moi')
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('bdkt') then raise exception 'Không có quyền xem báo lỗi câu hỏi' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_agg(x order by (x->>'so_hs')::int desc, x->>'moi_nhat' desc) from (
      select jsonb_build_object(
        'mon', r.mon, 'ma_cau', r.ma_cau,
        'so_bao', count(*), 'so_hs', count(distinct r.hoc_sinh_id),
        'ly_do', (select jsonb_object_agg(l, n) from (select r2.ly_do l, count(*) n from bai_cau_bao_loi r2 where r2.mon = r.mon and r2.ma_cau = r.ma_cau and r2.trang_thai = p_trang_thai group by r2.ly_do) q),
        'ghi_chu', (select coalesce(jsonb_agg(g), '[]'::jsonb) from (select r3.ghi_chu g from bai_cau_bao_loi r3 where r3.mon = r.mon and r3.ma_cau = r.ma_cau and r3.trang_thai = p_trang_thai and r3.ghi_chu is not null order by r3.created_at desc limit 3) q2),
        'moi_nhat', max(r.created_at),
        'loai_cau', (select c.loai_cau from bai_test_cau c where c.id = (array_agg(r.bai_test_cau_id order by r.created_at desc) filter (where r.bai_test_cau_id is not null))[1]),
        'noi_dung', (select left(coalesce(c.noi_dung, ''), 400) from bai_test_cau c where c.id = (array_agg(r.bai_test_cau_id order by r.created_at desc) filter (where r.bai_test_cau_id is not null))[1])
      ) x
      from bai_cau_bao_loi r where r.trang_thai = p_trang_thai group by r.mon, r.ma_cau
    ) t), '[]'::jsonb);
end $$;
revoke all on function public.fn_bao_loi_cau_ds(text) from public;
revoke execute on function public.fn_bao_loi_cau_ds(text) from anon;
grant execute on function public.fn_bao_loi_cau_ds(text) to authenticated;

-- ── Nhân sự: xử lý CẢ câu (mọi báo cáo đang mở của câu đó) ───────────────────────
create or replace function public.fn_bao_loi_cau_xu_ly(p_mon text, p_ma_cau text, p_ket_qua text, p_ghi_chu text default null)
returns integer
language plpgsql security definer set search_path = public as $$
declare v_n integer;
begin
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền xử lý báo lỗi câu hỏi' using errcode = '42501'; end if;
  if p_ket_qua not in ('da_xu_ly', 'khong_loi') then raise exception 'Kết quả không hợp lệ' using errcode = '22023'; end if;
  update bai_cau_bao_loi set trang_thai = p_ket_qua, xu_ly_boi = public.jwt_uid(), xu_ly_at = now(), xu_ly_ghi_chu = nullif(btrim(coalesce(p_ghi_chu, '')), '')
   where mon = p_mon and ma_cau = p_ma_cau and trang_thai = 'moi';
  get diagnostics v_n = row_count;
  return v_n;
end $$;
revoke all on function public.fn_bao_loi_cau_xu_ly(text, text, text, text) from public;
revoke execute on function public.fn_bao_loi_cau_xu_ly(text, text, text, text) from anon;
grant execute on function public.fn_bao_loi_cau_xu_ly(text, text, text, text) to authenticated;
