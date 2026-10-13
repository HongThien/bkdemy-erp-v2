-- ============================================================================
-- 202610131535 — HÌNH LUYỆN · B0: cột + hàm nền (spec-hinh-luyen.md §2, §2.5, §6 B0/B0.5)
-- ----------------------------------------------------------------------------
-- CEO 13/10: Hình luyện = kho BÀI KHO nhiều ý (`hinh_bai` + `hinh_y`, đang 0 dòng) → sau gán từng ý
-- vào BÀI MÔ HÌNH (`hinh_baitoan`). Kho trước, cành sau (đảo §5 spec v3). Mô hình đang LẪN Học/Luyện
-- ⇒ cột `phan` + bước Dọn thủ công.
-- MẤT GÌ: không. Chỉ thêm cột nullable, đổi default mã, nới NOT NULL của hinh_bai.anh_de, thêm hàm.
-- ============================================================================

-- ── 1. hinh_bai = BÀI KHO ───────────────────────────────────────────────────
alter table public.hinh_bai
  alter column ma_bai set default 'HLB' || lpad(nextval('hinh_bai_v3_seq')::text, 5, '0'),
  add column if not exists gia_thiet_chung text,
  alter column anh_de drop not null;
comment on table  public.hinh_bai is 'HÌNH LUYỆN · bài kho = đề thi thực tế nhiều ý (spec-hinh-luyen.md). KHÔNG phải hinh_baitoan (bài mô hình), KHÔNG phải hinh_hoc_bai (phần Học).';
comment on column public.hinh_bai.gia_thiet_chung is 'Phần đề TRƯỚC ý a) — giả thiết chung của mọi ý. Nguyên văn đề gốc. (de_bai = trọn bài nguyên văn.)';
comment on column public.hinh_bai.anh_de is 'Hình của bài. NULL = chưa có hình = việc treo (fn_hl_tien_do.so_bai_chua_hinh), không chặn nhập.';
comment on column public.hinh_bai.mo_hinh_id is 'NHÃN PHỎNG ĐOÁN lúc nhập (P1). Sau khi gán ý, mô hình thật = derive từ hinh_y.baitoan_id.';

-- ── 2. hinh_y = Ý của bài kho ───────────────────────────────────────────────
alter table public.hinh_y
  alter column ma_y set default 'HLY' || lpad(nextval('hinh_y_ma_seq')::text, 5, '0'),
  add column if not exists gia_thiet_them text,
  add column if not exists anh_de text;
comment on column public.hinh_y.gia_thiet_them is 'Giả thiết RIÊNG của ý — dữ kiện xuất hiện LẦN ĐẦU ở ý này ("Gọi M là trung điểm BC…"). NULL = ý không thêm gì.';
comment on column public.hinh_y.anh_de       is 'Hình RIÊNG của ý. NULL = dùng hình của ý gần nhất phía trước có hình, rồi tới hình bài.';
comment on column public.hinh_y.noi_dung     is 'CÂU HỎI của ý, nguyên văn.';

-- ── 3. hinh_mo_hinh.phan — để DỌN (B0.5) ────────────────────────────────────
alter table public.hinh_mo_hinh
  add column if not exists phan text check (phan in ('luyen', 'hoc'));
comment on column public.hinh_mo_hinh.phan is 'luyen | hoc | NULL = Thùy chưa xem. Hình luyện ẩn mô hình ''hoc''. Phần Học không đọc cột này.';

-- ── 4. Sửa con bump cha (CLAUDE.md §2) ──────────────────────────────────────
create or replace function public._hl_y_bump_bai() returns trigger
language plpgsql as $$
begin
  update public.hinh_bai set updated_at = now() where id = coalesce(new.bai_id, old.bai_id);
  return null;
end $$;
drop trigger if exists hinh_y_bump_bai on public.hinh_y;
create trigger hinh_y_bump_bai after insert or update or delete on public.hinh_y
  for each row execute function public._hl_y_bump_bai();

-- ── 5. fn_hl_bai_full — bài + ý đã resolve hình & giả thiết hiệu lực ────────
-- Giả thiết hiệu lực của ý i = gia_thiet_chung + ∪ gia_thiet_them(j ≤ i). Hình = của ý ∨ ý trước gần nhất có ∨ bài.
create or replace function public.fn_hl_bai_full(p_bai uuid) returns jsonb
language sql stable
set search_path = public
as $$
  with y as (
    select y.*,
           coalesce(y.anh_de, (select y2.anh_de from hinh_y y2 where y2.bai_id = y.bai_id and y2.thu_tu < y.thu_tu and y2.anh_de is not null order by y2.thu_tu desc limit 1),
                    b.anh_de) as anh_hieu_luc,
           concat_ws('; ', nullif(trim(b.gia_thiet_chung), ''),
             (select string_agg(trim(y3.gia_thiet_them), '; ' order by y3.thu_tu) from hinh_y y3 where y3.bai_id = y.bai_id and y3.thu_tu <= y.thu_tu and nullif(trim(y3.gia_thiet_them), '') is not null)
           ) as gia_thiet_hieu_luc
    from hinh_y y join hinh_bai b on b.id = y.bai_id
    where y.bai_id = p_bai
  )
  select jsonb_build_object(
    'bai', to_jsonb(b),
    'ys', coalesce((select jsonb_agg(to_jsonb(y) order by y.thu_tu) from y), '[]'::jsonb)
  ) from hinh_bai b where b.id = p_bai;
$$;

-- ── 6. fn_hl_chon_y — khung in khi chọn TẬP ý bất kỳ (CEO D3) ───────────────
-- Ý không chọn mà đứng TRƯỚC một ý chọn ⇒ nở thành BƯỚC của ý chọn kế tiếp (mỗi ý ẩn đúng 1 lần).
-- Ý không chọn đứng SAU ý chọn cuối ⇒ bỏ. Đề = gia_thiet_chung + gia_thiet_them của MỌI ý ≤ ý chọn cao nhất
-- (kể cả ý ẩn — dữ kiện của nó vẫn cần). Hình = hình hiệu lực của ý chọn cao nhất.
create or replace function public.fn_hl_chon_y(p_bai uuid, p_y uuid[]) returns jsonb
language plpgsql stable
set search_path = public
as $$
declare v_full jsonb; v_ys jsonb; v_out jsonb := '[]'::jsonb; v_buoc jsonb := '[]'::jsonb;
        y jsonb; v_max int := 0; v_gt text; v_anh text;
begin
  v_full := fn_hl_bai_full(p_bai);
  if v_full is null then return null; end if;
  v_ys := v_full->'ys';
  select max((e->>'thu_tu')::int) into v_max from jsonb_array_elements(v_ys) e where (e->>'id')::uuid = any(p_y);
  if v_max is null then return jsonb_build_object('bai', v_full->'bai', 'gia_thiet', null, 'anh', null, 'ys', '[]'::jsonb); end if;
  for y in select e from jsonb_array_elements(v_ys) e order by (e->>'thu_tu')::int loop
    exit when (y->>'thu_tu')::int > v_max;
    if (y->>'id')::uuid = any(p_y) then
      v_out := v_out || jsonb_build_array(y || jsonb_build_object('buoc', v_buoc));
      v_buoc := '[]'::jsonb;
    else
      v_buoc := v_buoc || jsonb_build_array(jsonb_build_object('id', y->'id', 'ma_y', y->'ma_y', 'nhan_hien_thi', y->'nhan_hien_thi',
                  'thu_tu', y->'thu_tu', 'noi_dung', y->'noi_dung', 'dap_an', y->'dap_an', 'loi_giai', y->'loi_giai', 'anh_loi_giai', y->'anh_loi_giai'));
    end if;
  end loop;
  select e->>'gia_thiet_hieu_luc', e->>'anh_hieu_luc' into v_gt, v_anh from jsonb_array_elements(v_ys) e where (e->>'thu_tu')::int = v_max;
  return jsonb_build_object('bai', v_full->'bai', 'gia_thiet', v_gt, 'anh', v_anh, 'ys', v_out);
end $$;

-- ── 7. fn_hl_tien_do — mỗi mô hình (ẩn 'hoc') + dòng "chưa gắn nhãn" ────────
create or replace function public.fn_hl_tien_do(p_khoi text) returns table (
  mo_hinh_id uuid, ma text, ten text, phan text,
  so_bai_kho bigint, so_bai_chua_hinh bigint, so_y bigint, so_y_chua_duyet bigint, so_y_chua_gan bigint, so_bai_mo_hinh bigint
) language sql stable set search_path = public as $$
  with mh as (select id, ma, ten, phan from hinh_mo_hinh where khoi = p_khoi and phan is distinct from 'hoc'
              union all select null, null, '— chưa gắn nhãn mô hình —', null),
       b as (select * from hinh_bai where khoi = p_khoi)
  select mh.id, mh.ma, mh.ten, mh.phan,
    (select count(*) from b where b.mo_hinh_id is not distinct from mh.id),
    (select count(*) from b where b.mo_hinh_id is not distinct from mh.id and b.anh_de is null),
    (select count(*) from hinh_y y join b on b.id = y.bai_id where b.mo_hinh_id is not distinct from mh.id),
    (select count(*) from hinh_y y join b on b.id = y.bai_id where b.mo_hinh_id is not distinct from mh.id and not y.da_duyet),
    (select count(*) from hinh_y y join b on b.id = y.bai_id where b.mo_hinh_id is not distinct from mh.id and y.da_duyet and y.baitoan_id is null),
    (select count(*) from hinh_baitoan bt where bt.mo_hinh_id = mh.id)
  from mh order by mh.ma nulls last;
$$;

-- ── 8. Dọn mô hình (B0.5) ───────────────────────────────────────────────────
-- 8a. danh sách để Thùy phân loại
create or replace function public.fn_hl_don_mo_hinh(p_khoi text) returns table (
  id uuid, ma text, ten text, khoi text, phan text, la_goc_ho boolean, gia_thiet text,
  so_bai_mo_hinh bigint, so_cau_hoc bigint, so_bai_kho bigint, so_con bigint, so_luot_hs bigint
) language sql stable set search_path = public as $$
  select mh.id, mh.ma, mh.ten, mh.khoi, mh.phan, mh.la_goc_ho, mh.gia_thiet,
    (select count(*) from hinh_baitoan bt where bt.mo_hinh_id = mh.id),
    (select count(*) from hinh_hoc_cau_hoi c where c.mo_hinh_id = mh.id and c.xoa_at is null),
    (select count(*) from hinh_bai b where b.mo_hinh_id = mh.id),
    (select count(*) from hinh_mo_hinh_cha ch where ch.cha_id = mh.id),
    (select count(*) from gami_session_problems p join hinh_baitoan bt on bt.id = p.hinh_baitoan_id where bt.mo_hinh_id = mh.id)
  from hinh_mo_hinh mh where (p_khoi is null or mh.khoi = p_khoi) order by mh.khoi, mh.ma;
$$;

-- 8b. phân loại 1 mô hình
create or replace function public.fn_hl_dat_phan(p_id uuid, p_phan text) returns void
language sql set search_path = public as $$
  update hinh_mo_hinh set phan = p_phan, updated_at = now() where id = p_id;
$$;

-- 8c. liệt kê SẼ MẤT trước khi xoá (chỉ đọc)
create or replace function public.fn_hl_mo_hinh_se_mat(p_id uuid) returns jsonb
language sql stable set search_path = public as $$
  select jsonb_build_object(
    'mo_hinh', (select jsonb_build_object('ma', ma, 'ten', ten, 'khoi', khoi) from hinh_mo_hinh where id = p_id),
    'mo_hinh_con', (select coalesce(jsonb_agg(jsonb_build_object('ma', m.ma, 'ten', m.ten)), '[]') from hinh_mo_hinh_cha ch join hinh_mo_hinh m on m.id = ch.mo_hinh_id where ch.cha_id = p_id),
    'bai_mo_hinh', (select coalesce(jsonb_agg(jsonb_build_object('ma', ma, 'phat_bieu', phat_bieu) order by ma), '[]') from hinh_baitoan where mo_hinh_id = p_id),
    'so_cach_giai', (select count(*) from hinh_cach_giai cg join hinh_baitoan bt on bt.id = cg.baitoan_id where bt.mo_hinh_id = p_id),
    'so_bien_the', (select count(*) from hinh_baitoan_bien_the v join hinh_baitoan bt on bt.id = v.baitoan_id where bt.mo_hinh_id = p_id),
    -- cạnh tiền đề từ mô hình KHÁC trỏ vào bài của mô hình này — cascade mất ÂM THẦM nếu không liệt kê
    'tien_de_tu_ngoai', (select coalesce(jsonb_agg(distinct bt2.ma), '[]') from hinh_cach_tien_de td
        join hinh_baitoan bt on bt.id = td.tien_de_id and bt.mo_hinh_id = p_id
        join hinh_cach_giai cg on cg.id = td.cach_id join hinh_baitoan bt2 on bt2.id = cg.baitoan_id where bt2.mo_hinh_id <> p_id),
    'cau_hoc_mat_nhan', (select count(*) from hinh_hoc_cau_hoi where mo_hinh_id = p_id),
    'bai_kho_mat_nhan', (select count(*) from hinh_bai where mo_hinh_id = p_id),
    'y_mat_gan', (select count(*) from hinh_y y join hinh_baitoan bt on bt.id = y.baitoan_id where bt.mo_hinh_id = p_id),
    -- CHẶN: lịch sử đo / form điền trỏ vào bài mô hình — không xoá được
    'chan_luot_hs', (select count(*) from gami_session_problems p join hinh_baitoan bt on bt.id = p.hinh_baitoan_id where bt.mo_hinh_id = p_id),
    'chan_form_dien', (select count(*) from hinh_form_dien f join hinh_baitoan_bien_the v on v.id = f.bien_the_id join hinh_baitoan bt on bt.id = v.baitoan_id where bt.mo_hinh_id = p_id)
  );
$$;

-- 8d. xoá THẬT, lá → gốc, 1 transaction. Từ chối khi còn mô hình con hoặc còn lịch sử đo.
create or replace function public.fn_hl_xoa_mo_hinh(p_id uuid) returns jsonb
language plpgsql set search_path = public as $$
declare v jsonb; v_bt uuid[];
begin
  v := fn_hl_mo_hinh_se_mat(p_id);
  if v->'mo_hinh' is null then raise exception 'Không có mô hình %', p_id; end if;
  if jsonb_array_length(v->'mo_hinh_con') > 0 then raise exception 'Còn % mô hình con — xoá/tách từng mô hình con trước.', jsonb_array_length(v->'mo_hinh_con'); end if;
  if (v->>'chan_luot_hs')::int > 0 then raise exception 'Có % lượt HS đã làm bài của mô hình này — lịch sử đo, không xoá. Đặt phan=''hoc'' để ẩn thay vì xoá.', v->>'chan_luot_hs'; end if;
  if (v->>'chan_form_dien')::int > 0 then raise exception 'Có % form điền ô trỏ vào biến thể của mô hình này — gỡ form trước.', v->>'chan_form_dien'; end if;

  select coalesce(array_agg(id), '{}') into v_bt from hinh_baitoan where mo_hinh_id = p_id;
  update hinh_y set baitoan_id = null, updated_at = now() where baitoan_id = any(v_bt);   -- FK không cascade
  delete from hinh_baitoan where id = any(v_bt);        -- cascade: cách giải → tiền đề/bổ đề · biến thể · yêu cầu giải
  delete from hinh_mo_hinh where id = p_id;             -- cascade: cạnh cha · lý thuyết; set null: hinh_bai · hinh_hoc_cau_hoi · hinh_gt_buoi
  return v;
end $$;

-- ── 9. Quyền ──────────────────────────────────────────────────────────────────
revoke all on function public.fn_hl_bai_full(uuid)           from public, anon;
revoke all on function public.fn_hl_chon_y(uuid, uuid[])     from public, anon;
revoke all on function public.fn_hl_tien_do(text)            from public, anon;
revoke all on function public.fn_hl_don_mo_hinh(text)        from public, anon;
revoke all on function public.fn_hl_dat_phan(uuid, text)     from public, anon;
revoke all on function public.fn_hl_mo_hinh_se_mat(uuid)     from public, anon;
revoke all on function public.fn_hl_xoa_mo_hinh(uuid)        from public, anon;
grant execute on function public.fn_hl_bai_full(uuid)        to authenticated;
grant execute on function public.fn_hl_chon_y(uuid, uuid[])  to authenticated;
grant execute on function public.fn_hl_tien_do(text)         to authenticated;
grant execute on function public.fn_hl_don_mo_hinh(text)     to authenticated;
grant execute on function public.fn_hl_dat_phan(uuid, text)  to authenticated;
grant execute on function public.fn_hl_mo_hinh_se_mat(uuid)  to authenticated;
grant execute on function public.fn_hl_xoa_mo_hinh(uuid)     to authenticated;
