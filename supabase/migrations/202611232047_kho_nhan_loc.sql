-- ============================================================================
-- 202611232047 — kho_nhan_loc
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/11: kho Hình nhiều bài, tìm một bài mất lâu; chiều lọc thì nhiều và hay đổi nên KHÔNG làm bộ lọc cố định
--   mà làm NHÃN LỌC ĐỘNG: gán một nhãn bất kì (tên + màu) cho một BÀI, mỗi nhãn tự thành một nút bật/tắt trên thanh lọc
--   của kho và của hộp chọn câu trong builder. Nhãn CHỈ để tìm bài — không vào mastery, không vào phân dạng, không thay
--   dang_chinh / mô hình, học sinh và phụ huynh không đọc được (RLS chỉ nhân sự). Spec: spec-kho-cau-hoi.md §14.
--
--   Khuôn: MỘT cặp bảng dùng chung có cột `kho` (không tạo bảng kiểu hinh_<tên>). Hôm nay mở cho kho='hinh_hoc' và
--   'hinh_luyen' (một bộ nhãn chung nhánh 'hinh'); kho khác mở sau = nới 2 CHECK + thêm nhánh trong _nhan_loc_nhanh_cua_kho
--   và fn_nhan_loc_gan.
--
--   Đơn vị gán = mã gốc của BÀI:
--     hinh_hoc   → coalesce(bai_y, parent_ma_cau, ma_cau): HHB… (bài nhiều ý) · HHC… gốc (câu đơn + mọi bản sao của nó
--                  ⇒ bản sao dùng chung nhãn với câu gốc — Thùy 23/11 câu 8)
--     hinh_luyen → hinh_bai.ma_bai (HLB…)
--   Mã là text không FK (đối tượng nằm ở 3 bảng); mã cấp bằng sequence, không cấp lại ⇒ dòng gán của bài đã xoá không bao giờ
--   dính sang bài khác, và không hàm nào resolve ngược từ dòng gán ra bài (chỉ nối từ bài đang hiện sang nhãn).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất dữ liệu. `drop function fn_hh_kho_cau(text,text,text,integer,integer)` rồi tạo lại NGAY trong cùng giao dịch
--   với thêm tham số p_nhan (mặc định null) và 2 cột trả về (ma_nhan, nhan_loc) — Postgres không cho đổi kiểu trả về bằng
--   create or replace. Lời gọi cũ 5 tham số vẫn chạy y như trước (app đang deploy không vỡ).
-- ============================================================================

-- ── 1. Bảng ──────────────────────────────────────────────────────────────────
create table public.kho_nhan_loc (
  id      uuid primary key default gen_random_uuid(),          -- mã gốc bất biến của nhãn (đổi tên / màu không đổi id)
  mon     text not null,
  nhanh   text not null check (nhanh in ('hinh')),
  ten     text not null check (btrim(ten) <> '' and char_length(ten) <= 40),
  mau     text not null check (mau in ('do', 'cam', 'vang', 'luc', 'ngoc', 'lam', 'tim', 'xam')),
  tao_boi uuid references public.nhan_su(id),
  tao_at  timestamptz not null default now(),
  sua_at  timestamptz not null default now(),
  xoa_at  timestamptz                                           -- xoá mềm: ẩn khỏi thanh lọc + mọi bài, khôi phục được
);
comment on table public.kho_nhan_loc is 'Nhãn lọc động của kho (Thùy 23/11) — chỉ để tìm bài, không đo, không phân dạng. spec-kho-cau-hoi §14';
create unique index kho_nhan_loc_ten_uq on public.kho_nhan_loc (mon, nhanh, lower(ten)) where xoa_at is null;
create index kho_nhan_loc_tao_boi_idx on public.kho_nhan_loc (tao_boi);

create table public.kho_nhan_loc_gan (
  nhan_id uuid not null references public.kho_nhan_loc(id),
  kho     text not null check (kho in ('hinh_hoc', 'hinh_luyen')),
  ma      text not null,                                        -- mã gốc của bài (xem đầu file)
  gan_boi uuid,                                                 -- nhan_su.id của người gán (không FK: chỉ để truy vết)
  gan_at  timestamptz not null default now(),
  primary key (kho, ma, nhan_id)
);
comment on table public.kho_nhan_loc_gan is 'Bài nào mang nhãn lọc nào. Gỡ nhãn = xoá dòng (thiếu = không có dòng).';
create index kho_nhan_loc_gan_nhan_idx on public.kho_nhan_loc_gan (nhan_id, kho);

alter table public.kho_nhan_loc enable row level security;
alter table public.kho_nhan_loc_gan enable row level security;
-- Chỉ nhân sự ĐỌC; không có policy ghi ⇒ mọi lệnh ghi đi qua RPC có cổng bên dưới. Học sinh / phụ huynh / khách: 0 dòng.
create policy kho_nhan_loc_nhan_su_doc on public.kho_nhan_loc for select to authenticated using ((select public.la_thanh_vien()));
create policy kho_nhan_loc_gan_nhan_su_doc on public.kho_nhan_loc_gan for select to authenticated using ((select public.la_thanh_vien()));

-- ── 2. Registry kho → nhánh nhãn + cổng sửa / xoá nhãn ─────────────────────────
create function public._nhan_loc_nhanh_cua_kho(p_kho text) returns text
language sql immutable as $$
  select case p_kho when 'hinh_hoc' then 'hinh' when 'hinh_luyen' then 'hinh' end
$$;

-- Đổi tên / đổi màu / xoá nhãn: trưởng khối (một khối bất kì của môn) trở lên + quản trị (Thùy 23/11 câu 3). Phó khối không.
create function public._nhan_loc_duoc_sua(p_mon text) returns boolean
language sql stable set search_path to 'public' as $$
  select public._qlcl_toan_he()
      or p_mon = any(public._quan_ly_mon())
      or exists (select 1 from public._khoi_quan_ly() q
                  where q.nhan_su_id = public.current_nhan_su_id() and q.mon = p_mon and q.cap = 'truong')
$$;

create function public._nhan_loc_json(n public.kho_nhan_loc) returns jsonb
language sql stable set search_path to 'public' as $$
  select jsonb_build_object('id', n.id, 'ten', n.ten, 'mau', n.mau, 'da_xoa', n.xoa_at is not null,
                            'tao_boi', (select ns.ho_ten from nhan_su ns where ns.id = n.tao_boi))
$$;

-- ── 3. Đọc: danh mục nhãn của (môn, nhánh) + số bài mang nhãn trong phạm vi đang xem ──────────────
-- p_kho/p_pham_vi: hôm nay chỉ 'hinh_hoc' + mã bài học (kho phân trang nên số phải đếm ở DB). Kho tải trọn danh sách
-- (kho của mô hình Luyện, hộp chọn của builder) đếm trên các thẻ đang hiện ở màn. Invoker + RLS (chỉ nhân sự).
create function public.fn_nhan_loc_ds(p_mon text, p_nhanh text, p_kho text default null, p_pham_vi text default null, p_ca_da_xoa boolean default false)
returns jsonb
language sql stable set search_path to 'public' as $$
  with dv as materialized (
    select distinct coalesce(c.bai_y, c.parent_ma_cau, c.ma_cau) as ma
      from hinh_hoc_cau_hoi c
     where p_kho = 'hinh_hoc' and c.dang_chinh = p_pham_vi and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)
  ), dem as (
    select g.nhan_id, count(*)::int as so from kho_nhan_loc_gan g join dv on dv.ma = g.ma where g.kho = p_kho group by 1
  )
  select jsonb_build_object(
    'duoc_sua', public._nhan_loc_duoc_sua(p_mon),
    'nhan', coalesce((
      select jsonb_agg(public._nhan_loc_json(nl) || jsonb_build_object(
                 'so_bai', coalesce(d.so, 0),
                 'tong', (select coalesce(jsonb_object_agg(t.kho, t.c), '{}'::jsonb)
                            from (select g.kho, count(*)::int as c from kho_nhan_loc_gan g where g.nhan_id = nl.id group by 1) t))
               order by nl.xoa_at is not null, nl.tao_at, nl.id)
        from kho_nhan_loc nl left join dem d on d.nhan_id = nl.id
       where nl.mon = p_mon and nl.nhanh = p_nhanh and (p_ca_da_xoa or nl.xoa_at is null)), '[]'::jsonb))
$$;

-- ── 4. Ghi (RPC có cổng) ─────────────────────────────────────────────────────
-- Tạo nhãn: nhân sự. Tên đã có (không phân biệt hoa thường) ⇒ trả nhãn đang có, không đẻ nhãn trùng.
create function public.fn_nhan_loc_tao(p_mon text, p_nhanh text, p_ten text, p_mau text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare v_ten text := regexp_replace(btrim(coalesce(p_ten, '')), '\s+', ' ', 'g'); v public.kho_nhan_loc;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._mon_duoc_xem(p_mon) then raise exception 'Không thuộc phạm vi môn %.', p_mon; end if;
  if p_nhanh is null or p_nhanh not in ('hinh') then raise exception 'Nhãn lọc chưa mở cho nhánh %.', p_nhanh; end if;
  if v_ten = '' then raise exception 'Nhãn phải có tên.'; end if;
  if char_length(v_ten) > 40 then raise exception 'Tên nhãn tối đa 40 ký tự.'; end if;
  if p_mau is null or p_mau not in ('do', 'cam', 'vang', 'luc', 'ngoc', 'lam', 'tim', 'xam') then raise exception 'Màu nhãn không hợp lệ: %.', p_mau; end if;
  select * into v from kho_nhan_loc n where n.mon = p_mon and n.nhanh = p_nhanh and lower(n.ten) = lower(v_ten) and n.xoa_at is null;
  if not found then
    begin
      insert into kho_nhan_loc (mon, nhanh, ten, mau, tao_boi) values (p_mon, p_nhanh, v_ten, p_mau, public.current_nhan_su_id()) returning * into v;
    exception when unique_violation then   -- hai người tạo cùng tên cùng lúc
      select * into v from kho_nhan_loc n where n.mon = p_mon and n.nhanh = p_nhanh and lower(n.ten) = lower(v_ten) and n.xoa_at is null;
    end;
  end if;
  return public._nhan_loc_json(v);
end $$;

-- Gán (p_bat) / gỡ một nhãn cho MỘT hoặc NHIỀU bài (gán hàng loạt). Nhận mã câu / mã ý / mã bài, tự quy về mã gốc của bài.
create function public.fn_nhan_loc_gan(p_kho text, p_ma text[], p_nhan uuid, p_bat boolean) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare v_nhanh text; v_ma text[]; v_la text; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if public._nhan_loc_nhanh_cua_kho(p_kho) is null then raise exception 'Nhãn lọc chưa mở cho kho %.', p_kho; end if;
  if coalesce(cardinality(p_ma), 0) = 0 then raise exception 'Chưa chọn bài nào.'; end if;
  if cardinality(p_ma) > 500 then raise exception 'Mỗi lượt gán tối đa 500 bài.'; end if;
  select n.nhanh into v_nhanh from kho_nhan_loc n where n.id = p_nhan and n.xoa_at is null;
  if v_nhanh is null then raise exception 'Nhãn không còn (đã xoá).'; end if;
  if v_nhanh <> public._nhan_loc_nhanh_cua_kho(p_kho) then raise exception 'Nhãn này không thuộc kho %.', p_kho; end if;

  if p_kho = 'hinh_hoc' then
    select array_agg(distinct x.ma) into v_ma from (
      select coalesce(c.bai_y, c.parent_ma_cau, c.ma_cau) as ma from hinh_hoc_cau_hoi c where c.ma_cau = any(p_ma)
      union all
      select y.ma_bai_y from hinh_hoc_bai_y y where y.ma_bai_y = any(p_ma)) x;
    select string_agg(m, ', ') into v_la from unnest(p_ma) m
     where not exists (select 1 from hinh_hoc_cau_hoi c where c.ma_cau = m) and not exists (select 1 from hinh_hoc_bai_y y where y.ma_bai_y = m);
  else   -- hinh_luyen
    select array_agg(distinct b.ma_bai) into v_ma from hinh_bai b where b.ma_bai = any(p_ma);
    select string_agg(m, ', ') into v_la from unnest(p_ma) m where not exists (select 1 from hinh_bai b where b.ma_bai = m);
  end if;
  if v_la is not null then raise exception 'Không thấy bài % trong kho.', v_la; end if;

  if coalesce(p_bat, true) then
    insert into kho_nhan_loc_gan (nhan_id, kho, ma, gan_boi)
      select p_nhan, p_kho, m, public.current_nhan_su_id() from unnest(v_ma) m on conflict do nothing;
  else
    delete from kho_nhan_loc_gan g where g.nhan_id = p_nhan and g.kho = p_kho and g.ma = any(v_ma);
  end if;
  get diagnostics v_n = row_count;
  return jsonb_build_object('ma', to_jsonb(v_ma), 'doi', v_n);
end $$;

-- Đổi tên / đổi màu (tham số null = giữ nguyên): trưởng khối trở lên + quản trị.
create function public.fn_nhan_loc_sua(p_nhan uuid, p_ten text default null, p_mau text default null) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare v public.kho_nhan_loc; v_ten text := regexp_replace(btrim(coalesce(p_ten, '')), '\s+', ' ', 'g');
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into v from kho_nhan_loc n where n.id = p_nhan;
  if not found then raise exception 'Nhãn không tồn tại.'; end if;
  if not public._nhan_loc_duoc_sua(v.mon) then raise exception 'Chỉ trưởng khối trở lên hoặc quản trị được đổi tên / đổi màu nhãn.'; end if;
  if p_ten is not null and v_ten = '' then raise exception 'Nhãn phải có tên.'; end if;
  if char_length(v_ten) > 40 then raise exception 'Tên nhãn tối đa 40 ký tự.'; end if;
  if p_mau is not null and p_mau not in ('do', 'cam', 'vang', 'luc', 'ngoc', 'lam', 'tim', 'xam') then raise exception 'Màu nhãn không hợp lệ: %.', p_mau; end if;
  begin
    update kho_nhan_loc n set ten = case when p_ten is null then n.ten else v_ten end, mau = coalesce(p_mau, n.mau), sua_at = now()
     where n.id = p_nhan returning * into v;
  exception when unique_violation then raise exception 'Đã có nhãn tên «%».', v_ten;
  end;
  return public._nhan_loc_json(v);
end $$;

-- Xoá mềm (p_xoa) / khôi phục: trưởng khối trở lên + quản trị. Dòng gán giữ nguyên ⇒ khôi phục là bài có lại nhãn.
create function public.fn_nhan_loc_xoa(p_nhan uuid, p_xoa boolean default true) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare v public.kho_nhan_loc;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into v from kho_nhan_loc n where n.id = p_nhan;
  if not found then raise exception 'Nhãn không tồn tại.'; end if;
  if not public._nhan_loc_duoc_sua(v.mon) then raise exception 'Chỉ trưởng khối trở lên hoặc quản trị được xoá / khôi phục nhãn.'; end if;
  begin
    update kho_nhan_loc n set xoa_at = case when coalesce(p_xoa, true) then coalesce(n.xoa_at, now()) end, sua_at = now()
     where n.id = p_nhan returning * into v;
  exception when unique_violation then raise exception 'Đang có một nhãn khác cùng tên «%» — đổi tên nhãn đó trước khi khôi phục.', v.ten;
  end;
  return public._nhan_loc_json(v);
end $$;

-- ── 5. Kho Hình–Học: lọc "đủ MỌI nhãn đang bật" ở DB + trả nhãn của từng bài ───────────────────
-- Thân hàm giữ nguyên bản đang chạy (mig 202611091550 + sau), chỉ thêm: p_nhan · cột ma_nhan · cột nhan_loc · điều kiện lọc ở nhánh 'dang_bai'.
drop function public.fn_hh_kho_cau(text, text, text, integer, integer);
create function public.fn_hh_kho_cau(p_loai text, p_id text, p_loc text default 'tat_ca', p_limit integer default 40, p_offset integer default 0, p_nhan uuid[] default null)
returns table(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text, bai_y text, nhan_y text, cau_hoi_y text, da_biet text, loi_dan text, ma_nhan text, nhan_loc uuid[])
language plpgsql stable security definer set search_path to 'public' as $function$
declare v_khoi text; v_cho text; v_nhan uuid[]; v_so_nhan integer;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_hh_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai not in ('dang_bai', 'dung_sai', 'de_xuat', 'chua_khop') then raise exception 'fn_hh_kho_cau: p_loai không hợp lệ %', p_loai; end if;
  select coalesce(array_agg(distinct x), '{}'::uuid[]) into v_nhan from unnest(coalesce(p_nhan, '{}'::uuid[])) x;
  v_so_nhan := cardinality(v_nhan);

  if p_loai = 'dang_bai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'hinh_hoc'::text, b.ma_bai, b.ten_bai, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan,
             dv.ma,
             coalesce((select array_agg(g.nhan_id) from kho_nhan_loc_gan g join kho_nhan_loc nl on nl.id = g.nhan_id and nl.xoa_at is null
                        where g.kho = 'hinh_hoc' and g.ma = dv.ma), '{}'::uuid[])
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
             cross join lateral (select coalesce(c.bai_y, c.parent_ma_cau, c.ma_cau) as ma) dv
       where c.dang_chinh = p_id and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
         -- nhãn lọc (Thùy 23/11): bật nhiều nhãn = "và" — bài phải mang ĐỦ mọi nhãn đang bật
         and (v_so_nhan = 0 or (select count(*) from kho_nhan_loc_gan g join kho_nhan_loc nl on nl.id = g.nhan_id and nl.xoa_at is null
                                 where g.kho = 'hinh_hoc' and g.ma = dv.ma and g.nhan_id = any(v_nhan)) = v_so_nhan)
       order by coalesce(c.bai_y, c.parent_ma_cau, c.ma_cau), c.nhan_y nulls first, c.parent_ma_cau is not null, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  select cd.khoi into v_khoi from dai_bdm_chu_de cd where cd.id = p_id;
  if v_khoi is null then return; end if;
  v_cho := 'HH' || v_khoi || '000000';

  if p_loai = 'dung_sai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'dung_sai'::text, null::text, null::text, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan, null::text, '{}'::uuid[]
        from hinh_hoc_kho_ds k join hinh_hoc_cau_hoi c on c.ma_cau = k.ma_cau and c.xoa_at is null left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where k.chu_de_id = p_id
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  if p_loai = 'de_xuat' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'de_xuat:vua'::text, b.ma_bai, b.ten_bai, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan, null::text, '{}'::uuid[]
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_ai_de_xuat and b.chu_de_id = p_id left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by b.thu_tu, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  -- chua_khop: còn ở bài chờ, chưa có đề xuất của chủ đề này, không phải Đ/S
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'chua_khop'::text, null::text, null::text, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan, null::text, '{}'::uuid[]
      from hinh_hoc_cau_hoi c left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
     where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
       and not exists (select 1 from hinh_hoc_bai b2 where b2.ma_bai = c.dang_ai_de_xuat and b2.chu_de_id = p_id)
       and not exists (select 1 from hinh_hoc_kho_ds k where k.ma_cau = c.ma_cau)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by c.ma_cau limit p_limit offset p_offset;
end $function$;

-- ── 6. Hộp chọn câu Hình–Học của builder: kèm mã bài + nhãn của bài (thân giữ nguyên, thêm 2 khoá) ──
create or replace function public.fn_tl_hh_cau(p_bai text)
returns jsonb
language sql stable security definer set search_path to 'public' as $function$
  with v as materialized (select * from _tl_hh_cau_chuan(p_bai)),
       t as materialized (select tc.ma_cau, count(*) n from tai_lieu_cau tc where tc.ma_cau in (select v.ma_cau from v) group by 1)
  select coalesce(jsonb_agg(jsonb_build_object('ma_cau', q.ma_cau, 'noi_dung', q.noi_dung, 'anh_de', q.anh_de, 'loai_cau', q.loai_cau,
                                               'la_goc', v.la_goc, 'so_lan_dung', coalesce(t.n, 0),
                                               'bai_y', q.bai_y, 'nhan_y', q.nhan_y, 'cau_hoi_y', q.cau_hoi_y, 'da_biet', q.da_biet, 'loi_dan', y.loi_dan,
                                               'ma_nhan', coalesce(q.bai_y, q.parent_ma_cau, q.ma_cau),
                                               'nhan_loc', coalesce((select jsonb_agg(g.nhan_id) from kho_nhan_loc_gan g join kho_nhan_loc nl on nl.id = g.nhan_id and nl.xoa_at is null
                                                                  where g.kho = 'hinh_hoc' and g.ma = coalesce(q.bai_y, q.parent_ma_cau, q.ma_cau)), '[]'::jsonb))
                            order by v.thu_tu, coalesce(q.bai_y, q.ma_cau), q.nhan_y nulls first, q.ma_cau), '[]'::jsonb)
    from v join hinh_hoc_cau_hoi q on q.ma_cau = v.ma_cau left join t on t.ma_cau = v.ma_cau
    left join hinh_hoc_bai_y y on y.ma_bai_y = q.bai_y
   where la_thanh_vien()
$function$;

-- ── 7. Kho bài của một mô hình Hình–Luyện: kèm nhãn của bài (thân giữ nguyên, thêm khoá 'nhan_loc') ──
create or replace function public.fn_hl_kho_cua_mo_hinh(p_mo_hinh uuid, p_gioi_han integer default 200)
returns jsonb
language sql stable set search_path to 'public' as $function$
  with cay as (select s.baitoan_id, s.so, s.ma from fn_hl_so_hien_thi(p_mo_hinh) s),
  kb as (
    select hb.* from hinh_bai hb
     where hb.mo_hinh_id = p_mo_hinh
        or exists (select 1 from hinh_y y join cay on cay.baitoan_id = y.baitoan_id where y.bai_id = hb.id)
     order by hb.created_at, hb.ma_bai
     limit greatest(1, least(coalesce(p_gioi_han, 200), 500))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', kb.id, 'ma_bai', kb.ma_bai, 'nguon', kb.nguon, 'nguon_ma_cau', kb.nguon_ma_cau,
    'de_bai', kb.de_bai, 'gia_thiet_chung', kb.gia_thiet_chung, 'anh_de', kb.anh_de,
    'gan_ca_bai', kb.mo_hinh_id = p_mo_hinh,
    'nhan_loc', coalesce((select jsonb_agg(g.nhan_id) from kho_nhan_loc_gan g join kho_nhan_loc nl on nl.id = g.nhan_id and nl.xoa_at is null
                       where g.kho = 'hinh_luyen' and g.ma = kb.ma_bai), '[]'::jsonb),
    'y', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', y.id, 'ma_y', y.ma_y, 'nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung, 'dap_an', y.dap_an,
            'loi_giai', y.loi_giai, 'anh_de', y.anh_de, 'da_duyet', y.da_duyet, 'baitoan_id', y.baitoan_id,
            'so', cay.so, 'ma_bai_mh', cay.ma,
            'ngoai_mo_hinh', y.baitoan_id is not null and cay.baitoan_id is null) order by y.thu_tu), '[]'::jsonb)
            from hinh_y y left join cay on cay.baitoan_id = y.baitoan_id where y.bai_id = kb.id)
  ) order by kb.created_at, kb.ma_bai), '[]'::jsonb) from kb
$function$;
