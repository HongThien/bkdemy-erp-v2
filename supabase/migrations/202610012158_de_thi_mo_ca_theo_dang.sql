-- ============================================================================
-- 202610012158 — de_thi_mo_ca_theo_dang
-- ----------------------------------------------------------------------------
-- LỖI THẬT tối 01/10 (Thùy báo: "phát hành được mỗi 1 câu đầu tiên"): đề số 3 gán làm bài trên lớp cho 12A1, mở app,
-- học sinh chỉ thấy CÂU 1.
-- Nguyên nhân: giáo trình online có HAI cách mở câu — theo DẠNG (`bai_test_dang_phat_hanh`) và theo CÂU
-- (`bai_test_cau_phat_hanh`). RLS chấp nhận cả hai, nhưng app HS đang chạy (bản chưa deploy) lọc thêm ở client và CHỈ
-- nhận mở theo dạng. `fn_de_thi_hoan_thien_bai_test` (mig 202610011759) mới mở theo câu ⇒ chỉ dạng của câu 1 (trigger
-- tự mở dạng đầu) lọt qua lớp lọc cũ.
-- Sửa: bài trên lớp phát hành từ đề thi mở sẵn cả đề bằng CẢ HAI cách ⇒ đúng với mọi bản app, cả màn live của GV
-- (màn đó hiện trạng thái theo dạng).
--   1. `fn_de_thi_hoan_thien_bai_test`: thêm mở theo dạng cho mọi dạng có trong bài.
--   2. `_trg_de_thi_dien_dang`: câu rời dạng chờ ⇒ ngoài điền `ma_dang`, nếu câu đó đang mở lẻ thì mở luôn dạng mới của nó
--      (không thì câu vừa có dạng lại biến mất khỏi bản app lọc theo dạng).
--   3. Vá dữ liệu: các bài trên lớp ĐÃ phát hành từ đề (hiện có 1: 12A1 ngày 01/10) — mở dạng cho những câu đang mở lẻ.
-- Câu CHƯA có dạng (ma_dang trống) chỉ mở được theo câu ⇒ bản app cũ vẫn không thấy; cần deploy app HS, hoặc gán dạng cho câu.
-- MẤT GÌ: không. Chỉ thêm dòng vào `bai_test_dang_phat_hanh` (on conflict do nothing) và thay thân 2 hàm cùng chữ ký.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

create or replace function public.fn_de_thi_hoan_thien_bai_test(p_bt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare bt record; v_tu_de boolean; n4 int; n_cho int; n_mo int := 0; n_dang int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  select b.id, b.loai, b.nguon_tai_lieu_id into bt from bai_test b where b.id = p_bt;
  if bt.id is null then raise exception 'Không thấy bài test %', p_bt; end if;
  v_tu_de := bt.loai = 'de_thi'
          or exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi');
  if not v_tu_de then raise exception 'Bài test này không phát hành từ đề thi'; end if;

  update bai_test_cau set kieu_nhap = 'phieu_4o'
   where bai_test_id = p_bt and loai_cau = 'tra_loi_ngan' and public._de_thi_hop_le_4o(btrim(dap_an_key #>> '{}'));
  get diagnostics n4 = row_count;

  update bai_test_cau set ma_dang = null where bai_test_id = p_bt and public._kho_la_dang_cho(ma_dang);
  get diagnostics n_cho = row_count;

  -- Tên phần (Phần I / II / III) theo CÂU — khoá tự nhiên ma_cau, không theo vị trí
  update bai_test_cau bc set phan = p.tieu_de
    from tai_lieu_cau c join tai_lieu_phan p on p.id = c.phan_id
   where bc.bai_test_id = p_bt and bc.phan is null
     and p.tai_lieu_id = bt.nguon_tai_lieu_id and p.loai_phan <> 'buoi' and c.ma_cau = bc.ma_cau;

  if bt.loai = 'giao_trinh' then
    -- Mở sẵn CẢ ĐỀ bằng cả hai cách: theo câu (kể cả câu chưa có dạng) và theo dạng (bản app / màn live lọc theo dạng)
    insert into bai_test_cau_phat_hanh (bai_test_cau_id, bai_test_id, mo_by)
      select bc.id, p_bt, public.current_nhan_su_id() from bai_test_cau bc where bc.bai_test_id = p_bt
    on conflict (bai_test_cau_id) do nothing;
    get diagnostics n_mo = row_count;
    insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
      select distinct p_bt, bc.ma_dang, public.current_nhan_su_id() from bai_test_cau bc
       where bc.bai_test_id = p_bt and bc.ma_dang is not null
    on conflict (bai_test_id, ma_dang) do nothing;
    get diagnostics n_dang = row_count;
  end if;
  return jsonb_build_object('so_4o', n4, 'so_cho_dang', n_cho, 'so_mo', n_mo, 'so_dang_mo', n_dang);
end $$;

create or replace function public._trg_de_thi_dien_dang() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.dang_chinh is null or public._kho_la_dang_cho(new.dang_chinh) then return new; end if;
  if not (old.dang_chinh is null or public._kho_la_dang_cho(old.dang_chinh)) then return new; end if;
  update bai_test_cau bc set ma_dang = new.dang_chinh
    from bai_test bt
   where bc.ma_cau = new.ma_cau and bc.ma_dang is null and bt.id = bc.bai_test_id
     and (bt.loai = 'de_thi'
          or exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi'));
  -- Câu đang mở lẻ trong bài trên lớp ⇒ mở luôn dạng vừa có (giữ câu hiện với bản app lọc theo dạng)
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    select distinct bc.bai_test_id, new.dang_chinh, null::uuid
      from bai_test_cau bc
      join bai_test bt on bt.id = bc.bai_test_id and bt.loai = 'giao_trinh'
      join bai_test_cau_phat_hanh ph on ph.bai_test_cau_id = bc.id and ph.dong_at is null
     where bc.ma_cau = new.ma_cau and bc.ma_dang = new.dang_chinh
       and exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi')
  on conflict (bai_test_id, ma_dang) do nothing;
  return new;
end $$;

-- Vá dữ liệu: bài trên lớp đã phát hành từ đề thi — mở dạng cho các câu đang mở lẻ (phat_hanh_by trống = hệ thống, như trigger tự mở dạng 1)
insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
  select distinct bc.bai_test_id, bc.ma_dang, null::uuid
    from bai_test_cau bc
    join bai_test bt on bt.id = bc.bai_test_id and bt.loai = 'giao_trinh'
    join bai_test_cau_phat_hanh ph on ph.bai_test_cau_id = bc.id and ph.dong_at is null
   where bc.ma_dang is not null
     and exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi')
on conflict (bai_test_id, ma_dang) do nothing;
