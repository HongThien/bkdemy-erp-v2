-- ============================================================================
-- 202611231711 — PHIẾU SỬA BẢN ĐỒ (ticket): trưởng khối đề xuất → Thùy duyệt → máy chạy đúng lệnh đã duyệt
-- VÌ SAO (Thùy 23/11, nguyên văn): "Khóa quyền tự động được thêm sửa xóa của trưởng khối đối với bản đồ kiến thức. Trưởng khối muốn thao tác phải gửi
--   1 ticket để để cho t duyệt - t duyệt thì claude mới chạy." → duyệt đề xuất ("Làm cái ticket đi") với 3 điểm theo khuyến nghị:
--   (1) qua phiếu: CẤU TRÚC bản đồ (thêm / sửa / xoá / chuyển / sắp xếp — Đại · HGT · KHTN · Lý · Hoá · Hình–Học · Hình–Luyện) + lý thuyết · ví dụ; KHO vẫn tự do;
--   (2) sửa tay trên màn Bản đồ cũng khoá; (3) chỉ Thùy (admin hệ thống) duyệt.
-- CÁCH:
--   • Khoá ở MỨC BẢNG (trigger cấp câu lệnh, BEFORE ghi) trên các bảng cấu trúc bản đồ: người dùng đăng nhập (role authenticated) mà KHÔNG phải admin
--     hệ thống và KHÔNG đang chạy phiếu ⇒ chặn. Màn sửa tay, RPC fn_bdm_*, phiên Claude (đóng vai người mở phiên) đều đi qua đây ⇒ một rào cho mọi đường.
--     Tác vụ nền / script máy (không có jwt hoặc service_role, không đóng vai) không bị chặn. hinh_baitoan chỉ khoá THÊM / XOÁ (sửa = lời giải, nhãn, độ khó, ảnh — việc kho).
--   • phien_phieu: Claude soạn danh sách lệnh (đúng tham số các lệnh phiên đang có) + mô tả từng lệnh; gửi = CHẠY THỬ ngay (trong giao dịch con rồi
--     huỷ) — lỗi thì không nhận phiếu. Lệnh sau dùng mã do lệnh trước tạo bằng chuỗi "$<stt>.<trường>" (vd "$1.nhom_id").
--   • Thùy: Chạy thử lại (xem thay đổi trước → sau) · Duyệt = chạy CẢ phiếu trong MỘT giao dịch con (một lệnh lỗi ⇒ không lệnh nào ghi, phiếu 'loi') · Trả lại (bắt buộc lý do).
--   • Kết quả báo về phiên bằng tin hệ thống. Lịch sử trạng thái phiếu do trigger ghi (CLAUDE §4).
-- MẤT GÌ: không xoá gì. Sau khi áp, trưởng khối / nhân sự khác KHÔNG sửa tay bản đồ được nữa (đúng ý Thùy).
-- ============================================================================

-- ── 1. Bảng phiếu + lịch sử ───────────────────────────────────────────────────
create table if not exists public.phien_phieu (
  id bigint generated always as identity primary key,
  phien_id uuid not null references public.claude_phien(id),
  mon text not null,
  khoi text not null,
  nguoi_gui uuid not null,                    -- tai_khoan.id của người mở phiên (trưởng khối)
  tieu_de text not null check (btrim(tieu_de) <> ''),
  ly_do text not null default '',
  lenh jsonb not null check (jsonb_typeof(lenh) = 'array' and jsonb_array_length(lenh) between 1 and 200),
  thu jsonb not null,                         -- kết quả chạy thử lúc gửi (từng lệnh + thay đổi bản đồ)
  trang_thai text not null default 'cho_duyet' check (trang_thai in ('cho_duyet', 'tra_lai', 'da_chay', 'loi', 'huy')),
  ghi_chu_duyet text,                         -- chỉ có khi trả lại / lỗi (NULL = không áp dụng)
  nguoi_duyet uuid,                           -- NULL = chưa ai xử (chờ duyệt / huỷ)
  duyet_at timestamptz,
  ket_qua jsonb,                              -- kết quả chạy thật (chỉ khi da_chay / loi)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists phien_phieu_phien_idx on public.phien_phieu (phien_id);
create index if not exists phien_phieu_cho_idx on public.phien_phieu (created_at) where trang_thai = 'cho_duyet';
alter table public.phien_phieu enable row level security;
drop policy if exists phien_phieu_xem on public.phien_phieu;
create policy phien_phieu_xem on public.phien_phieu for select to authenticated
  using ((select coalesce((select n.la_admin_he_thong from public.nhan_su n where n.id = public.current_nhan_su_id()), false))
         or nguoi_gui = (select public.jwt_uid()));
-- ghi chỉ qua hàm security definer bên dưới (không có policy ghi)

create table if not exists public.phien_phieu_lich_su (
  id bigint generated always as identity primary key,
  phieu_id bigint not null references public.phien_phieu(id),
  cu text,                                    -- NULL = lúc tạo
  moi text not null,
  actor uuid default public.jwt_uid(),
  at timestamptz not null default now()
);
create index if not exists phien_phieu_lich_su_phieu_idx on public.phien_phieu_lich_su (phieu_id);
alter table public.phien_phieu_lich_su enable row level security;
drop policy if exists phien_phieu_lich_su_xem on public.phien_phieu_lich_su;
create policy phien_phieu_lich_su_xem on public.phien_phieu_lich_su for select to authenticated
  using (exists (select 1 from public.phien_phieu p where p.id = phieu_id));   -- thấy phiếu (RLS bảng phiếu) thì thấy lịch sử

create or replace function public._phien_phieu_ghi_lich_su()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.trang_thai is distinct from old.trang_thai then
    insert into phien_phieu_lich_su (phieu_id, cu, moi) values (new.id, case when tg_op = 'UPDATE' then old.trang_thai end, new.trang_thai);
  end if;
  if tg_op = 'UPDATE' then new.updated_at := now(); end if;
  return new;
end $$;
revoke execute on function public._phien_phieu_ghi_lich_su() from public, anon, authenticated;
drop trigger if exists trg_phien_phieu_lich_su on public.phien_phieu;
create trigger trg_phien_phieu_lich_su after insert or update on public.phien_phieu for each row execute function public._phien_phieu_ghi_lich_su();
drop trigger if exists trg_phien_phieu_touch on public.phien_phieu;
create or replace function public._phien_phieu_touch() returns trigger language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
revoke execute on function public._phien_phieu_touch() from public, anon, authenticated;
create trigger trg_phien_phieu_touch before update on public.phien_phieu for each row execute function public._phien_phieu_touch();

-- ── 2. Rào ghi bản đồ ─────────────────────────────────────────────────────────
-- Đang chạy phiếu (chạy thử hoặc chạy thật) — cờ giao dịch chỉ hàm definer dưới đây đặt; client không đặt được GUC.
create or replace function public._phieu_dang_chay()
returns boolean language sql stable as $$ select coalesce(current_setting('bk.phieu_chay', true), '') <> '' $$;
revoke execute on function public._phieu_dang_chay() from public, anon, authenticated;

create or replace function public._ban_do_duoc_ghi()
returns boolean language sql stable security definer set search_path = public as $$
  select public._phieu_dang_chay()
      or coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') <> 'authenticated'   -- tác vụ nền / script máy / service_role không đóng vai
      or coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
$$;
revoke execute on function public._ban_do_duoc_ghi() from public, anon, authenticated;

create or replace function public._ban_do_khoa_ghi()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public._ban_do_duoc_ghi() then return null; end if;
  raise exception 'Bản đồ kiến thức đang khoá (Thùy 23/11): thêm / sửa / xoá phải gửi PHIẾU cho Thùy duyệt — trong phiên Claude dùng lệnh gui_phieu. (bảng %)', tg_table_name
    using errcode = '42501';
end $$;
revoke execute on function public._ban_do_khoa_ghi() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'dai_bdm_chu_de', 'dai_bdm_chuyen_de', 'dai_bdm_o', 'dai_bdm_nhom', 'dai_bdm_dang_bai', 'dai_bdm_nhom_tien_de',
    'khtn_bdm_chu_de', 'khtn_bdm_chuyen_de', 'khtn_bdm_o', 'khtn_bdm_nhom', 'khtn_bdm_dang_bai', 'khtn_bdm_nhom_tien_de',
    'vatly_bdm_chu_de', 'vatly_bdm_chuyen_de', 'vatly_bdm_o', 'vatly_bdm_nhom', 'vatly_bdm_dang_bai', 'vatly_bdm_nhom_tien_de',
    'hoahoc_bdm_chu_de', 'hoahoc_bdm_chuyen_de', 'hoahoc_bdm_o', 'hoahoc_bdm_nhom', 'hoahoc_bdm_dang_bai', 'hoahoc_bdm_nhom_tien_de',
    'hinh_hoc_bai', 'hinh_hoc_bai_ly_thuyet', 'hinh_hoc_bai_y',
    'hinh_mo_hinh', 'hinh_mo_hinh_cha', 'hinh_mo_hinh_ly_thuyet', 'hinh_nhom_mo_hinh', 'hinh_nhom_bai_su_kien', 'hinh_thanh_vien_su_kien']
  loop
    if to_regclass('public.' || t) is null then raise notice 'bỏ qua % (không có bảng)', t; continue; end if;
    execute format('drop trigger if exists trg_ban_do_khoa on public.%I', t);
    execute format('create trigger trg_ban_do_khoa before insert or update or delete on public.%I for each statement execute function public._ban_do_khoa_ghi()', t);
  end loop;
  drop trigger if exists trg_ban_do_khoa on public.hinh_baitoan;
  create trigger trg_ban_do_khoa before insert or delete on public.hinh_baitoan for each statement execute function public._ban_do_khoa_ghi();
end $$;

-- Khoá cả phiên (mig 202611231659) không cản phiếu Thùy đã duyệt.
create or replace function public._phien_kiem_khoa()
returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if public._phieu_dang_chay() then return; end if;
  if coalesce((select bat from he_thong_cong_tac where ma = 'phien_claude_truong_khoi'), false) then return; end if;
  if coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false) then return; end if;
  raise exception 'Phiên Claude đang tạm khoá với trưởng khối (Thùy 23/11). Cần sửa bản đồ / kho thì gửi đề xuất cho Thùy duyệt.' using errcode = '42501';
end $$;
revoke execute on function public._phien_kiem_khoa() from public, anon, authenticated;

-- ── 3. Chạy danh sách lệnh (dùng chung cho chạy thử + chạy thật) ──────────────
-- Mỗi lệnh: {"ham": bd_ghi|hh_bai|lt_ghi|hinh|anh_gan, "viec"?, "ts"? | "ham_hinh"+"args", "mo_ta"}.
-- Chuỗi "$k.<trường>" trong ts/args = giá trị trường đó trong kết quả lệnh thứ k (lệnh trước).
create or replace function public._phieu_chay_lenh(p_phien uuid, p_lenh jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_l jsonb; v_i int := 0; v_kq jsonb := '[]'::jsonb; v_r jsonb; v_txt text; m text[]; v_gt jsonb;
begin
  if not public._phieu_dang_chay() then raise exception 'Chỉ chạy được trong lượt phiếu.'; end if;
  for v_l in select x from jsonb_array_elements(p_lenh) x loop
    v_i := v_i + 1;
    -- thay "$k.truong" bằng giá trị thật của lệnh k
    v_txt := v_l::text;
    for m in select regexp_matches(v_txt, '"\$([0-9]+)\.([a-z_]+)"', 'g') loop
      if m[1]::int >= v_i then raise exception 'Lệnh %: "$%.%" trỏ tới lệnh chưa chạy.', v_i, m[1], m[2]; end if;
      v_gt := (v_kq->(m[1]::int - 1))->m[2];
      if v_gt is null then raise exception 'Lệnh %: kết quả lệnh % không có trường "%".', v_i, m[1], m[2]; end if;
      v_txt := replace(v_txt, format('"$%s.%s"', m[1], m[2]), v_gt::text);
    end loop;
    v_l := v_txt::jsonb;
    begin
      v_r := case v_l->>'ham'
        when 'bd_ghi'  then public.fn_phien_bd_ghi(p_phien, v_l->>'viec', coalesce(v_l->'ts', '{}'::jsonb))
        when 'hh_bai'  then public.fn_phien_hh_bai(p_phien, v_l->>'viec', coalesce(v_l->'ts', '{}'::jsonb))
        when 'lt_ghi'  then public.fn_phien_lt_ghi(p_phien, coalesce(v_l->'ts', '{}'::jsonb))
        when 'hinh'    then public.fn_phien_hinh_goi(p_phien, v_l->>'ham_hinh', coalesce(v_l->'args', '{}'::jsonb))
        when 'anh_gan' then public.fn_phien_anh_gan(p_phien, coalesce(v_l->'ts', '{}'::jsonb))
      end;
      if v_l->>'ham' is null or v_l->>'ham' not in ('bd_ghi', 'hh_bai', 'lt_ghi', 'hinh', 'anh_gan') then
        raise exception 'ham phải là bd_ghi · hh_bai · lt_ghi · hinh · anh_gan.';
      end if;
    exception when others then
      raise exception 'Lệnh % (%): %', v_i, coalesce(v_l->>'mo_ta', v_l->>'ham'), sqlerrm;
    end;
    -- kết quả lệnh: object (bd_ghi / hh_bai / lt_ghi / anh_gan) hoặc mảng (hinh — lấy phần tử đầu cho "$k.<trường>")
    v_kq := v_kq || jsonb_build_array(case when jsonb_typeof(v_r) = 'array' then coalesce(v_r->0, '{}'::jsonb) || jsonb_build_object('_ds', v_r) else coalesce(v_r, '{}'::jsonb) end);
  end loop;
  return v_kq;
end $$;
revoke execute on function public._phieu_chay_lenh(uuid, jsonb) from public, anon, authenticated;

-- Chạy thử: chạy trong giao dịch con rồi HUỶ; trả {ok, kq (từng lệnh), thay_doi (bản đồ trước → sau theo log)} hoặc {ok:false, loi}.
create or replace function public._phieu_chay_thu(p_phien uuid, p_lenh jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v_claims text := current_setting('request.jwt.claims', true); v_kq jsonb; v_td jsonb; v_out jsonb;
begin
  begin
    perform set_config('bk.phieu_chay', 'thu', true);
    v_kq := public._phieu_chay_lenh(p_phien, p_lenh);
    begin
      v_td := public.fn_phien_bd_thay_doi(p_phien, now() - interval '1 millisecond')->'thay_doi';
    exception when others then v_td := '[]'::jsonb; end;
    v_out := jsonb_build_object('ok', true, 'kq', v_kq, 'thay_doi', coalesce(v_td, '[]'::jsonb), 'luc', now());
    raise exception using errcode = 'P0BK1', message = 'huy_chay_thu';
  exception
    when sqlstate 'P0BK1' then null;
    when others then v_out := jsonb_build_object('ok', false, 'loi', sqlerrm, 'luc', now());
  end;
  perform set_config('bk.phieu_chay', '', true);
  perform set_config('request.jwt.claims', coalesce(v_claims, ''), true);
  return v_out;
end $$;
revoke execute on function public._phieu_chay_thu(uuid, jsonb) from public, anon, authenticated;

-- ── 4. Claude gửi / huỷ phiếu (bot — service_role) ───────────────────────────
create or replace function public.fn_phien_phieu_gui(p_phien uuid, p_ts jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v_p claude_phien; v_lenh jsonb := p_ts->'lenh'; v_thu jsonb; v_id bigint; v_l jsonb; v_i int := 0;
begin
  v_p := public._phien_bd_vao(p_phien);   -- phiên đang mở, đúng loại, người mở còn quyền
  perform set_config('request.jwt.claims', '', true);
  if nullif(btrim(coalesce(p_ts->>'tieu_de', '')), '') is null then raise exception 'Thiếu tieu_de.'; end if;
  if v_lenh is null or jsonb_typeof(v_lenh) <> 'array' or jsonb_array_length(v_lenh) = 0 then raise exception 'Thiếu lenh (mảng các lệnh).'; end if;
  if jsonb_array_length(v_lenh) > 200 then raise exception 'Một phiếu tối đa 200 lệnh — tách thành nhiều phiếu.'; end if;
  for v_l in select x from jsonb_array_elements(v_lenh) x loop
    v_i := v_i + 1;
    if nullif(btrim(coalesce(v_l->>'mo_ta', '')), '') is null then raise exception 'Lệnh % thiếu mo_ta (câu mô tả cho Thùy đọc).', v_i; end if;
  end loop;
  v_thu := public._phieu_chay_thu(p_phien, v_lenh);
  if not (v_thu->>'ok')::boolean then raise exception 'Chạy thử lỗi — chưa gửi phiếu. %', v_thu->>'loi'; end if;
  insert into phien_phieu (phien_id, mon, khoi, nguoi_gui, tieu_de, ly_do, lenh, thu)
  values (p_phien, v_p.mon, v_p.khoi, v_p.nguoi_mo, btrim(p_ts->>'tieu_de'), coalesce(p_ts->>'ly_do', ''), v_lenh, v_thu)
  returning id into v_id;
  insert into claude_phien_tin (phien_id, vai, noi_dung, trang_thai)
  values (p_phien, 'he_thong', format('📋 Đã gửi phiếu #%s "%s" (%s lệnh) cho Thùy duyệt. Thùy duyệt xong máy mới chạy.', v_id, btrim(p_ts->>'tieu_de'), jsonb_array_length(v_lenh)), 'xong');
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, 'gui_phieu', jsonb_build_object('phieu_id', v_id), jsonb_build_object('so_lenh', jsonb_array_length(v_lenh)));
  return jsonb_build_object('ok', true, 'phieu_id', v_id, 'so_lenh', jsonb_array_length(v_lenh), 'thay_doi', v_thu->'thay_doi');
end $$;
revoke execute on function public.fn_phien_phieu_gui(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.fn_phien_phieu_gui(uuid, jsonb) to service_role;

create or replace function public.fn_phien_phieu_huy(p_phien uuid, p_id bigint)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v_n int;
begin
  perform public._phien_bd_vao(p_phien);
  update phien_phieu set trang_thai = 'huy' where id = p_id and phien_id = p_phien and trang_thai = 'cho_duyet';
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Phiếu #% không thuộc phiên này hoặc không còn chờ duyệt.', p_id; end if;
  insert into claude_phien_tin (phien_id, vai, noi_dung, trang_thai) values (p_phien, 'he_thong', format('🗑️ Đã huỷ phiếu #%s.', p_id), 'xong');
  return jsonb_build_object('ok', true, 'phieu_id', p_id);
end $$;
revoke execute on function public.fn_phien_phieu_huy(uuid, bigint) from public, anon, authenticated;
grant execute on function public.fn_phien_phieu_huy(uuid, bigint) to service_role;

-- ── 5. Màn: danh sách · chạy thử lại · duyệt / trả lại (Thùy) ─────────────────
create or replace function public._phieu_la_nguoi_duyet()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
$$;
revoke execute on function public._phieu_la_nguoi_duyet() from public, anon, authenticated;

create or replace function public.fn_phien_phieu_ds(p_chi_cho boolean default false, p_gioi_han int default 50)
returns jsonb
language sql stable security definer set search_path = public as $$
  with q as (
    select p.*, (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = p.nguoi_gui) as ten_gui,
           (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = p.nguoi_duyet) as ten_duyet
      from phien_phieu p
     where (public._phieu_la_nguoi_duyet() or p.nguoi_gui = public.jwt_uid())
       and (not p_chi_cho or p.trang_thai = 'cho_duyet')
     order by (p.trang_thai = 'cho_duyet') desc, p.created_at desc
     limit least(greatest(coalesce(p_gioi_han, 50), 1), 200)
  )
  select jsonb_build_object(
    'la_nguoi_duyet', public._phieu_la_nguoi_duyet(),
    'so_cho', (select count(*) from phien_phieu p where p.trang_thai = 'cho_duyet' and (public._phieu_la_nguoi_duyet() or p.nguoi_gui = public.jwt_uid())),
    'ds', coalesce((select jsonb_agg(jsonb_build_object(
        'id', q.id, 'phien_id', q.phien_id, 'mon', q.mon, 'khoi', q.khoi, 'tieu_de', q.tieu_de, 'ly_do', q.ly_do,
        'lenh', q.lenh, 'thu', q.thu, 'trang_thai', q.trang_thai, 'ghi_chu_duyet', q.ghi_chu_duyet, 'ket_qua', q.ket_qua,
        'ten_gui', q.ten_gui, 'ten_duyet', q.ten_duyet, 'duyet_at', q.duyet_at, 'created_at', q.created_at)) from q), '[]'::jsonb))
$$;
revoke execute on function public.fn_phien_phieu_ds(boolean, int) from public, anon;
grant execute on function public.fn_phien_phieu_ds(boolean, int) to authenticated;

create or replace function public.fn_phien_phieu_thu(p_id bigint)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v phien_phieu;
begin
  if not public._phieu_la_nguoi_duyet() then raise exception 'Chỉ Thùy (admin hệ thống) chạy thử / duyệt phiếu.' using errcode = '42501'; end if;
  select * into v from phien_phieu where id = p_id;
  if not found then raise exception 'Không có phiếu #%.', p_id; end if;
  return public._phieu_chay_thu(v.phien_id, v.lenh);
end $$;
revoke execute on function public.fn_phien_phieu_thu(bigint) from public, anon;
grant execute on function public.fn_phien_phieu_thu(bigint) to authenticated;

create or replace function public.fn_phien_phieu_duyet(p_id bigint, p_duyet boolean, p_ghi_chu text default null)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v phien_phieu; v_uid uuid := public.jwt_uid(); v_claims text := current_setting('request.jwt.claims', true);
  v_kq jsonb; v_loi text; v_ten text;
begin
  if not public._phieu_la_nguoi_duyet() then raise exception 'Chỉ Thùy (admin hệ thống) duyệt phiếu.' using errcode = '42501'; end if;
  select * into v from phien_phieu where id = p_id for update;
  if not found then raise exception 'Không có phiếu #%.', p_id; end if;
  if v.trang_thai <> 'cho_duyet' then raise exception 'Phiếu #% không còn chờ duyệt (đang: %).', p_id, v.trang_thai; end if;
  select ns.ho_ten into v_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = v_uid;

  if not p_duyet then
    if nullif(btrim(coalesce(p_ghi_chu, '')), '') is null then raise exception 'Trả lại phải ghi lý do.'; end if;
    update phien_phieu set trang_thai = 'tra_lai', ghi_chu_duyet = btrim(p_ghi_chu), nguoi_duyet = v_uid, duyet_at = now() where id = p_id;
    insert into claude_phien_tin (phien_id, vai, noi_dung, trang_thai)
    values (v.phien_id, 'he_thong', format('↩️ %s trả lại phiếu #%s "%s": %s', coalesce(v_ten, 'Thùy'), p_id, v.tieu_de, btrim(p_ghi_chu)), 'xong');
    return jsonb_build_object('ok', true, 'trang_thai', 'tra_lai');
  end if;

  begin
    perform set_config('bk.phieu_chay', p_id::text, true);
    v_kq := public._phieu_chay_lenh(v.phien_id, v.lenh);
  exception when others then
    v_loi := sqlerrm;   -- giao dịch con đã huỷ ⇒ không lệnh nào ghi
  end;
  perform set_config('bk.phieu_chay', '', true);
  perform set_config('request.jwt.claims', coalesce(v_claims, ''), true);   -- trả vai về Thùy (lịch sử phiếu ghi đúng người duyệt)

  if v_loi is not null then
    update phien_phieu set trang_thai = 'loi', ghi_chu_duyet = v_loi, nguoi_duyet = v_uid, duyet_at = now(),
           ket_qua = jsonb_build_object('loi', v_loi) where id = p_id;
    insert into claude_phien_tin (phien_id, vai, noi_dung, trang_thai)
    values (v.phien_id, 'he_thong', format('⚠️ Thùy đã duyệt phiếu #%s nhưng chạy LỖI — không lệnh nào được ghi: %s. Soạn lại phiếu mới.', p_id, v_loi), 'xong');
    return jsonb_build_object('ok', false, 'trang_thai', 'loi', 'loi', v_loi);
  end if;
  update phien_phieu set trang_thai = 'da_chay', nguoi_duyet = v_uid, duyet_at = now(), ket_qua = jsonb_build_object('kq', v_kq) where id = p_id;
  insert into claude_phien_tin (phien_id, vai, noi_dung, trang_thai)
  values (v.phien_id, 'he_thong', format('✅ %s đã duyệt phiếu #%s "%s" — đã chạy %s lệnh.', coalesce(v_ten, 'Thùy'), p_id, v.tieu_de, jsonb_array_length(v.lenh)), 'xong');
  return jsonb_build_object('ok', true, 'trang_thai', 'da_chay', 'kq', v_kq);
end $$;
revoke execute on function public.fn_phien_phieu_duyet(bigint, boolean, text) from public, anon;
grant execute on function public.fn_phien_phieu_duyet(bigint, boolean, text) to authenticated;

-- ── 6. _phien_bd_vao: phiếu đã duyệt chạy được cả khi phiên đã đóng ──────────
CREATE OR REPLACE FUNCTION public._phien_bd_vao(p_phien uuid)
 RETURNS claude_phien
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found then raise exception 'Không có phiên %.', p_phien; end if;
  if not (v_p.loai = any (public._phien_loai_sua_ban_do())) then
    raise exception 'Phiên này là loại "%" — không có lệnh bản đồ.', v_p.loai;
  end if;
  if v_p.trang_thai <> 'mo' and not public._phieu_dang_chay() then raise exception 'Phiên đã đóng / đang đóng — không ghi được nữa.'; end if;
  -- ĐÓNG VAI người mở phiên trong transaction này: jwt_uid() / current_nhan_su_id() / trigger log đều thấy họ.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_p.nguoi_mo, 'role', 'authenticated')::text, true);
  perform public._phien_kiem_khoa();   -- 23/11 Thùy: khoá phiên Claude với trưởng khối
  if v_p.sua_cau_truc and not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Người mở phiên không còn là trưởng khối trở lên của % khối % — dừng.', v_p.mon, v_p.khoi;
  end if;
  if not v_p.sua_cau_truc and public.current_nhan_su_id() is null then
    raise exception 'Người mở phiên không còn là nhân sự đang làm — dừng.';
  end if;
  if not exists (select 1 from public._phien_bdm_bang(v_p.mon)) then
    raise exception 'Môn % chưa có bản đồ mới.', v_p.mon;
  end if;
  return v_p;
end $function$
;
