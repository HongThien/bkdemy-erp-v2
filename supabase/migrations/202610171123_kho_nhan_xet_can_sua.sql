-- NHẬN XÉT LÚC DUYỆT — "✎ Cần sửa" ở mọi màn duyệt kho (Thùy 17/10)
--   Người duyệt ghi: sai ở KHÂU nào + cần sửa THẾ NÀO. Đối tượng KHÔNG vào kho rác, chỉ tạm rời hàng duyệt.
--   Claude đọc nhận xét đang mở (lịch hằng ngày + gọi tay: scripts/kho/nhan-xet.mjs), sửa, ghi "đã sửa gì"
--   ⇒ đối tượng quay lại hàng duyệt kèm nhãn "đã sửa theo nhận xét" ⇒ NGƯỜI duyệt lại (Claude không tự duyệt).
--   Quy trình phía Claude: docs/quy-trinh-sua-theo-nhan-xet.md.
--
-- Bất biến (append-only): nhận xét và xử lý chỉ THÊM, không sửa/xoá. Trạng thái SUY, không lưu cột trạng thái:
--   cho_sua  = có nhận xét chưa có dòng xử lý
--   da_sua   = mọi nhận xét đã xử lý, lần xử lý cuối 'da_sua'
--   khong_sua= mọi nhận xét đã xử lý, lần xử lý cuối 'khong_sua' (Claude không đồng ý / không đủ dữ kiện — kèm lý do cho người xem)
-- Mã gốc: đối tượng tham chiếu bằng (doi_tuong, mon, ma) = mã gốc bất biến của nó (ma_cau, id form, id bài…).

create table if not exists kho_nhan_xet (
  id         bigint generated always as identity primary key,
  doi_tuong  text not null check (doi_tuong in ('cau','form_tn','form_dien','hinh_bai','hinh_bien_the','hinh_cach_giai','clone','de_thi')),
  mon        text not null check (mon in ('toan','khtn','hgt','hinh_hoc','anh','tsa')),
  ma         text not null check (btrim(ma) <> ''),
  khau       text not null check (khau in ('de','dap_an','loi_giai','dang','hinh','trinh_bay','khac')),
  noi_dung   text not null check (btrim(noi_dung) <> ''),
  man        text not null default '',                       -- màn ghi nhận xét (ngữ cảnh cho người sửa)
  nguoi      uuid default current_nhan_su_id() references nhan_su(id),
  at         timestamptz not null default now()
);
create index if not exists kho_nhan_xet_dt_idx on kho_nhan_xet (doi_tuong, mon, ma);

create table if not exists kho_nhan_xet_xu_ly (
  id          bigint generated always as identity primary key,
  nhan_xet_id bigint not null references kho_nhan_xet(id),
  ket_qua     text not null check (ket_qua in ('da_sua','khong_sua')),
  ghi_chu     text not null check (btrim(ghi_chu) <> ''),       -- đã sửa GÌ (hoặc vì sao không sửa)
  boi         text not null default 'nguoi' check (boi in ('claude','nguoi')),
  nguoi       uuid default current_nhan_su_id() references nhan_su(id),   -- NULL khi boi='claude' (không áp dụng)
  at          timestamptz not null default now()
);
create index if not exists kho_nhan_xet_xu_ly_nx_idx on kho_nhan_xet_xu_ly (nhan_xet_id);

alter table kho_nhan_xet        enable row level security;
alter table kho_nhan_xet_xu_ly  enable row level security;
drop policy if exists kho_nhan_xet_doc on kho_nhan_xet;
create policy kho_nhan_xet_doc  on kho_nhan_xet for select to authenticated using (la_thanh_vien());
drop policy if exists kho_nhan_xet_ghi on kho_nhan_xet;
create policy kho_nhan_xet_ghi  on kho_nhan_xet for insert to authenticated with check (la_thanh_vien());
drop policy if exists kho_nhan_xet_xu_ly_doc on kho_nhan_xet_xu_ly;
create policy kho_nhan_xet_xu_ly_doc on kho_nhan_xet_xu_ly for select to authenticated using (la_thanh_vien());
drop policy if exists kho_nhan_xet_xu_ly_ghi on kho_nhan_xet_xu_ly;
create policy kho_nhan_xet_xu_ly_ghi on kho_nhan_xet_xu_ly for insert to authenticated with check (la_thanh_vien());
-- append-only: không có policy update/delete; thu luôn quyền bảng
revoke update, delete, truncate on kho_nhan_xet, kho_nhan_xet_xu_ly from authenticated, anon, public;
grant select, insert on kho_nhan_xet, kho_nhan_xet_xu_ly to authenticated;

-- ── Trạng thái theo ĐỐI TƯỢNG (một nguồn — màn duyệt + script Claude cùng gọi) ─────────────
create or replace function _kho_nhan_xet_trang_thai(p_doi_tuong text default null, p_mon text default null)
returns table (doi_tuong text, mon text, ma text, trang_thai text, ds jsonb)
language sql stable as $$
  with nx as (
    select n.*, x.ket_qua, x.ghi_chu, x.boi, x.at as xu_ly_at,
           coalesce(ns.ho_ten, '') as nguoi_ten
      from kho_nhan_xet n
      left join lateral (select * from kho_nhan_xet_xu_ly x where x.nhan_xet_id = n.id order by x.at desc, x.id desc limit 1) x on true
      left join nhan_su ns on ns.id = n.nguoi
     where (p_doi_tuong is null or n.doi_tuong = p_doi_tuong)
       and (p_mon is null or n.mon = p_mon)
  )
  select nx.doi_tuong, nx.mon, nx.ma,
         case when bool_or(nx.ket_qua is null) then 'cho_sua'
              when (array_agg(nx.ket_qua order by nx.xu_ly_at desc))[1] = 'da_sua' then 'da_sua'
              else 'khong_sua' end,
         jsonb_agg(jsonb_build_object('id', nx.id, 'khau', nx.khau, 'noi_dung', nx.noi_dung, 'man', nx.man,
                                      'nguoi_ten', nx.nguoi_ten, 'at', nx.at,
                                      'ket_qua', nx.ket_qua, 'ghi_chu', nx.ghi_chu, 'boi', nx.boi, 'xu_ly_at', nx.xu_ly_at)
                   order by nx.at)
    from nx
   group by nx.doi_tuong, nx.mon, nx.ma
$$;

create or replace function fn_kho_nhan_xet_trang_thai(p_doi_tuong text, p_mon text default null)
returns table (doi_tuong text, mon text, ma text, trang_thai text, ds jsonb)
language sql stable as $$ select * from _kho_nhan_xet_trang_thai(p_doi_tuong, p_mon) $$;

-- Ghi 1 nhận xét, trả lại trạng thái mới của đối tượng (để màn vá tại chỗ)
create or replace function fn_kho_nhan_xet_ghi(p_doi_tuong text, p_mon text, p_ma text, p_khau text, p_noi_dung text, p_man text default '')
returns jsonb
language plpgsql as $$
declare r record;
begin
  if not la_thanh_vien() then raise exception 'Không có quyền ghi nhận xét'; end if;
  insert into kho_nhan_xet (doi_tuong, mon, ma, khau, noi_dung, man)
  values (p_doi_tuong, p_mon, btrim(p_ma), p_khau, btrim(p_noi_dung), coalesce(p_man, ''));
  select * into r from _kho_nhan_xet_trang_thai(p_doi_tuong, p_mon) t where t.ma = btrim(p_ma);
  return jsonb_build_object('doi_tuong', r.doi_tuong, 'mon', r.mon, 'ma', r.ma, 'trang_thai', r.trang_thai, 'ds', r.ds);
end $$;

-- Đếm nhận xét đang chờ sửa (badge / bản tin)
create or replace function fn_kho_nhan_xet_dem()
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'cho_sua',  count(*) filter (where trang_thai = 'cho_sua'),
    'da_sua',   count(*) filter (where trang_thai = 'da_sua'),
    'khong_sua',count(*) filter (where trang_thai = 'khong_sua'))
  from _kho_nhan_xet_trang_thai(null, null)
$$;

revoke execute on function _kho_nhan_xet_trang_thai(text, text) from public, anon;
revoke execute on function fn_kho_nhan_xet_trang_thai(text, text) from public, anon;
revoke execute on function fn_kho_nhan_xet_ghi(text, text, text, text, text, text) from public, anon;
revoke execute on function fn_kho_nhan_xet_dem() from public, anon;
grant execute on function _kho_nhan_xet_trang_thai(text, text) to authenticated;
grant execute on function fn_kho_nhan_xet_trang_thai(text, text) to authenticated;
grant execute on function fn_kho_nhan_xet_ghi(text, text, text, text, text, text) to authenticated;
grant execute on function fn_kho_nhan_xet_dem() to authenticated;
