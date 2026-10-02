-- ============================================================================
-- 202610021201 — bt_hai_che_do_phat_hanh
-- ----------------------------------------------------------------------------
-- CEO 02/10: "phát hành nên có 2 chế độ: phát hành TOÀN BỘ — giống buổi hôm qua, thường là thi và luyện tập; và phát hành
-- TỪNG PHẦN — dành cho buổi học."
--
-- Áp cho BÀI TRÊN LỚP (`bai_test.loai = 'giao_trinh'`) — loại duy nhất có khái niệm "mở dần" (ET / BTVN / kiểm tra luôn mở cả bài).
--   · TOÀN BỘ  : mở sẵn mọi câu ngay lúc phát hành (theo câu + theo dạng, để mọi bản app đều thấy).
--   · TỪNG PHẦN: chỉ phần ĐẦU mở; GV mở phần kế ở tab Live của buổi.
--       - giáo trình thường: phần = DẠNG (y như từ 13/09: trigger tự mở dạng của câu 1, GV bấm mở dạng kế).
--       - bài gán từ ĐỀ THI: phần = PHẦN của đề (Phần I / II / III, cột `bai_test_cau.phan`), mở theo CÂU. KHÔNG mở theo dạng:
--         một dạng nằm rải ở nhiều phần của đề ⇒ mở theo dạng là lộ câu của phần chưa tới.
-- Chế độ KHÔNG lưu thành cột: nó chỉ là "lúc phát hành mở những gì" — trạng thái thật luôn là 2 bảng phát hành (suy động, §4).
--
-- Thay đổi:
--   1. `fn_bt_mo_toan_bo(bài)`           — MỚI: mở mọi câu (mở lại cả câu đã đóng) + mọi dạng. Dùng lúc phát hành toàn bộ, và nút
--                                          "Mở toàn bộ" ở tab Live cho bài đang mở từng phần.
--   2. `fn_bt_mo_phan_dau(bài)`          — MỚI: bài từ đề, mở các câu của phần đầu. Giáo trình thường: không làm gì (trigger đã mở dạng 1).
--   3. `fn_de_thi_hoan_thien_bai_test`   — thôi tự mở câu (mở gì là việc của chế độ phát hành, 2 hàm trên). Cùng chữ ký.
--   4. `fn_bt_tu_phat_hanh_dang1` (trigger) — bỏ qua bài từ đề thi (bài từ đề không mở theo dạng lúc phát hành).
--   5. `_trg_de_thi_dien_dang` (trigger) — câu vừa có dạng: chỉ mở DẠNG đó khi MỌI câu cùng dạng trong bài đang mở (tức không lộ thêm câu nào).
-- Bài đã phát hành tối 01/10 (12A1, toàn bộ) không đổi gì.
-- MẤT GÌ: không. 2 hàm mới, 3 hàm thay thân cùng chữ ký. Không đụng dòng dữ liệu nào.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- ── 1) Mở toàn bộ ─────────────────────────────────────────────────────────────
create or replace function public.fn_bt_mo_toan_bo(p_bt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); n_cau int; n_dang int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự phát hành được.'; end if;
  if not exists (select 1 from bai_test where id = p_bt and loai = 'giao_trinh' and trang_thai = 'mo') then
    raise exception 'Chỉ bài trên lớp đang mở mới có mở từng phần / mở toàn bộ.';
  end if;
  insert into bai_test_cau_phat_hanh (bai_test_cau_id, bai_test_id, mo_by)
    select bc.id, p_bt, v_ns from bai_test_cau bc where bc.bai_test_id = p_bt
  on conflict (bai_test_cau_id) do update
    set mo_at = now(), mo_by = excluded.mo_by, dong_at = null, dong_by = null
    where bai_test_cau_phat_hanh.dong_at is not null;          -- đang mở sẵn → không đụng (giữ giờ mở gốc)
  get diagnostics n_cau = row_count;
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    select distinct p_bt, bc.ma_dang, v_ns from bai_test_cau bc where bc.bai_test_id = p_bt and bc.ma_dang is not null
  on conflict (bai_test_id, ma_dang) do nothing;
  get diagnostics n_dang = row_count;
  return jsonb_build_object('so_cau_mo_them', n_cau, 'so_dang_mo_them', n_dang,
                            'tong_cau', (select count(*) from bai_test_cau where bai_test_id = p_bt));
end $$;
revoke all on function public.fn_bt_mo_toan_bo(uuid) from public, anon;
grant execute on function public.fn_bt_mo_toan_bo(uuid) to authenticated;

-- ── 2) Mở phần đầu (bài từ đề thi, chế độ từng phần) ──────────────────────────
create or replace function public.fn_bt_mo_phan_dau(p_bt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_phan text; n int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự phát hành được.'; end if;
  if not exists (select 1 from bai_test where id = p_bt and loai = 'giao_trinh' and trang_thai = 'mo') then
    raise exception 'Chỉ bài trên lớp đang mở mới có mở từng phần / mở toàn bộ.';
  end if;
  select bc.phan into v_phan from bai_test_cau bc where bc.bai_test_id = p_bt order by bc.thu_tu limit 1;
  if v_phan is null then            -- giáo trình thường: phần = dạng, trigger đã mở dạng của câu 1
    return jsonb_build_object('phan', null, 'so_cau_mo', 0);
  end if;
  insert into bai_test_cau_phat_hanh (bai_test_cau_id, bai_test_id, mo_by)
    select bc.id, p_bt, v_ns from bai_test_cau bc where bc.bai_test_id = p_bt and bc.phan = v_phan
  on conflict (bai_test_cau_id) do nothing;
  get diagnostics n = row_count;
  return jsonb_build_object('phan', v_phan, 'so_cau_mo', n);
end $$;
revoke all on function public.fn_bt_mo_phan_dau(uuid) from public, anon;
grant execute on function public.fn_bt_mo_phan_dau(uuid) to authenticated;

-- ── 3) Hoàn thiện bài phát hành từ đề: ô 4 ký tự · dạng chờ · tên phần. KHÔNG còn tự mở câu. ────────────────
create or replace function public.fn_de_thi_hoan_thien_bai_test(p_bt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare bt record; v_tu_de boolean; n4 int; n_cho int;
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

  -- Mở câu nào là việc của CHẾ ĐỘ PHÁT HÀNH (fn_bt_mo_toan_bo / fn_bt_mo_phan_dau) — gọi ngay sau hàm này.
  return jsonb_build_object('so_4o', n4, 'so_cho_dang', n_cho);
end $$;

-- ── 4) Trigger tự mở dạng của câu 1: bỏ qua bài phát hành từ đề thi ───────────
create or replace function public.fn_bt_tu_phat_hanh_dang1()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if NEW.thu_tu <> 1 or NEW.ma_dang is null then return NEW; end if;
  if not exists (select 1 from bai_test where id = NEW.bai_test_id and loai = 'giao_trinh') then
    return NEW;
  end if;
  -- Bài gán từ ĐỀ THI mở theo PHẦN của đề (theo câu), không theo dạng — một dạng rải ở nhiều phần (mig 202610021201)
  if exists (select 1 from bai_test bt join tai_lieu t on t.id = bt.nguon_tai_lieu_id
              where bt.id = NEW.bai_test_id and t.cau_hinh ? 'deThi') then
    return NEW;
  end if;
  if exists (select 1 from bai_test bt join buoi_hoc b on b.lop_id = bt.lop_id and b.ngay = bt.ngay
              where bt.id = NEW.bai_test_id and public._buoi_online_dang_mo(b.id)) then
    return NEW;
  end if;
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    values (NEW.bai_test_id, NEW.ma_dang, null)
    on conflict do nothing;
  return NEW;
end $$;

-- ── 5) Câu rời dạng chờ: điền dạng; chỉ mở DẠNG khi mọi câu cùng dạng trong bài đang mở ───────────────────
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
  -- Bài trên lớp từ đề: mở dạng vừa có CHỈ KHI không lộ thêm câu nào — tức mọi câu cùng dạng trong bài đều đang mở lẻ
  -- (bài mở toàn bộ thì đúng; bài mở từng phần mà dạng còn câu ở phần chưa tới thì không).
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    select bt.id, new.dang_chinh, null::uuid
      from bai_test bt
     where bt.loai = 'giao_trinh'
       and exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi')
       and exists (select 1 from bai_test_cau bc where bc.bai_test_id = bt.id and bc.ma_cau = new.ma_cau and bc.ma_dang = new.dang_chinh)
       and not exists (
             select 1 from bai_test_cau bc
              where bc.bai_test_id = bt.id and bc.ma_dang = new.dang_chinh
                and not exists (select 1 from bai_test_cau_phat_hanh ph where ph.bai_test_cau_id = bc.id and ph.dong_at is null))
  on conflict (bai_test_id, ma_dang) do nothing;
  return new;
end $$;
