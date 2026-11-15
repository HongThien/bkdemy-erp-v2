-- ============================================================================
-- 202611151055 — Giải tháng: báo cả APP PHỤ HUYNH khi công bố (phần 2/2 của 202611151041) — Thùy 15/11
-- ----------------------------------------------------------------------------
-- Kênh thông báo app PH = bảng thong_bao_ph (app PH đọc qua FDW bằng role fdw_bkdemy_web; cron /api/cron/push gửi điện thoại PH).
-- ĐIỀU KIỆN: Thùy chạy ở SQL Editor TRƯỚC: `alter table public.thong_bao_ph owner to claude_build;`
--   (bảng tạo tay bởi postgres ⇒ claude_build không ALTER / INSERT / tạo policy được — migrate báo "must be owner").
-- LÀM:
--   · policy đọc cho fdw_bkdemy_web: trước nay chỉ có policy cho authenticated ⇒ app PH đọc qua FDW ra 0 dòng (kể cả thông báo nhập tay).
--   · cột ref + unique index (chống ghi trùng, như hs_tin_moi.ref).
--   · _giai_ghi_nhan ghi thêm 1 thông báo PH scope 'ca_nhan' mỗi giải lúc công bố (hiện 30 ngày).
--   · gửi bù cho 76 giải tháng 10 đã công bố 15/11 10:21.
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 policy, 1 cột, 1 index, thay 1 hàm (giữ chữ ký), thêm 76 dòng thông báo.
-- ============================================================================
do $$ begin
  if pg_get_userbyid((select relowner from pg_class where oid = 'public.thong_bao_ph'::regclass)) <> current_user then
    raise exception 'thong_bao_ph chưa đổi chủ — chạy ở SQL Editor: alter table public.thong_bao_ph owner to claude_build;';
  end if;
end $$;
drop policy if exists thong_bao_ph_fdw_read on public.thong_bao_ph;
create policy thong_bao_ph_fdw_read on public.thong_bao_ph for select to fdw_bkdemy_web using (true);

-- khoá chống trùng
alter table public.thong_bao_ph add column if not exists ref text;
create unique index if not exists ux_tbph_ref on public.thong_bao_ph (ref) where ref is not null;

-- _giai_ghi_nhan: thân giữ nguyên bản đang chạy, thêm thông báo PH
create or replace function public._giai_ghi_nhan(p_giai uuid, p_hs uuid, p_lop uuid, p_thang date, p_mon text, p_loai text,
                                                 p_xu_cach text default 'tu_dong', p_bao boolean default true)
returns jsonb
language plpgsql volatile security definer set search_path = public
as $$
declare v_khoi text; v_xu integer; v_ghi text; v_n integer; v_ten text; v_ic text; v_th text; v_body text; v_lop text; v_hs_ten text;
begin
  if not (public.la_thanh_vien() or session_user in ('claude_build', 'postgres')) then
    raise exception 'Chỉ nhân sự được ghi nhận giải thưởng.' using errcode = '42501';
  end if;
  select l.khoi, l.ten_lop into v_khoi, v_lop from lop l where l.id = p_lop;
  v_xu := public._giai_xu(v_khoi);
  v_ghi := case when v_xu = 0 then 'khong_xu' else coalesce(p_xu_cach, 'tu_dong') end;
  insert into hs_giai_thuong (giai_thuong_id, hoc_sinh_id, lop_id, thang, mon, loai_giai, khoi, xu, xu_ghi)
  values (p_giai, p_hs, p_lop, p_thang, p_mon, p_loai, v_khoi, v_xu, v_ghi)
  on conflict (giai_thuong_id) do nothing;
  get diagnostics v_n = row_count;
  if v_n = 0 then return jsonb_build_object('moi', false); end if;
  v_ten := case p_loai when 'xuat_sac' then 'Xuất sắc' when 'tien_bo' then 'Tiến bộ' else 'Chăm chỉ' end;
  v_ic := case p_loai when 'xuat_sac' then '🏆' when 'tien_bo' then '🚀' else '🌟' end;
  v_th := 'tháng ' || to_char(p_thang, 'FMMM') || '/' || to_char(p_thang, 'YYYY');
  if v_ghi = 'tu_dong' then
    insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai)
    values (p_hs, v_xu, 'giai_thuong', 'Giải ' || v_ten || ' ' || v_th, p_giai, 'giai_thuong')
    on conflict (ref_id) where loai = 'giai_thuong' do nothing;
  end if;
  if p_bao and v_ghi <> 'cho_xac_nhan' then
    v_body := 'Môn ' || p_mon || ' · lớp ' || coalesce(v_lop, '') || '. Chúc mừng em!'
              || case when v_ghi in ('tu_dong', 'da_cong_tay') then ' Phần thưởng ' || v_xu || ' xu đã vào ví của em.' else '' end;
    insert into hs_tin_moi (hoc_sinh_id, loai, tieu_de, noi_dung, bieu_tuong, ref)
    values (p_hs, 'giai_thuong', 'Em nhận Giải ' || v_ten || ' ' || v_th || '!', v_body, v_ic, 'giai:' || p_giai)
    on conflict (hoc_sinh_id, ref) do nothing;
    -- (15/11) báo phụ huynh
    select ho_ten into v_hs_ten from hoc_sinh where id = p_hs;
    insert into thong_bao_ph (tieu_de, noi_dung, loai, scope, hoc_sinh_id, hieu_luc_tu, hieu_luc_den, ref)
    values (v_ic || ' Con ' || coalesce(v_hs_ten, '') || ' nhận Giải ' || v_ten || ' ' || v_th,
            'Chúc mừng con ' || coalesce(v_hs_ten, '') || ' đạt Giải ' || v_ten || ' ' || v_th || ' — môn ' || p_mon || ', lớp ' || coalesce(v_lop, '') || '.'
              || case when v_ghi in ('tu_dong', 'da_cong_tay') then ' Phần thưởng ' || v_xu || ' xu đã vào ví của con trên app học sinh.' else '' end,
            'chung', 'ca_nhan', p_hs,
            (now() at time zone 'Asia/Ho_Chi_Minh')::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date + 30, 'giai:' || p_giai)
    on conflict (ref) where ref is not null do nothing;
  end if;
  return jsonb_build_object('moi', true, 'xu', v_xu, 'xu_ghi', v_ghi);
end $$;

-- Gửi bù thông báo PH cho mọi giải tháng 10 đã công bố
do $$
declare n int;
begin
  insert into public.thong_bao_ph (tieu_de, noi_dung, loai, scope, hoc_sinh_id, hieu_luc_tu, hieu_luc_den, ref)
  select x.ic || ' Con ' || h.ho_ten || ' nhận Giải ' || x.ten || ' ' || x.th,
         'Chúc mừng con ' || h.ho_ten || ' đạt Giải ' || x.ten || ' ' || x.th || ' — môn ' || g.mon || ', lớp ' || coalesce(l.ten_lop, '') || '.'
           || case when g.xu_ghi in ('tu_dong', 'da_cong_tay') then ' Phần thưởng ' || g.xu || ' xu đã vào ví của con trên app học sinh.' else '' end,
         'chung', 'ca_nhan', g.hoc_sinh_id,
         (now() at time zone 'Asia/Ho_Chi_Minh')::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date + 30, 'giai:' || g.giai_thuong_id
  from public.hs_giai_thuong g
  join public.hoc_sinh h on h.id = g.hoc_sinh_id
  left join public.lop l on l.id = g.lop_id
  cross join lateral (select
      case g.loai_giai when 'xuat_sac' then 'Xuất sắc' when 'tien_bo' then 'Tiến bộ' else 'Chăm chỉ' end as ten,
      case g.loai_giai when 'xuat_sac' then '🏆' when 'tien_bo' then '🚀' else '🌟' end as ic,
      'tháng ' || to_char(g.thang, 'FMMM') || '/' || to_char(g.thang, 'YYYY') as th) x
  where g.thang = '2026-10-01' and g.xu_ghi <> 'cho_xac_nhan'
  on conflict (ref) where ref is not null do nothing;
  get diagnostics n = row_count;
  if n <> 76 then raise exception 'thông báo PH tháng 10: % ≠ 76', n; end if;
end $$;
