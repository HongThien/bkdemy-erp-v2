-- "⏭ ĐỂ SAU" ở mọi màn duyệt kho (Thùy 20/10): câu/bài chưa muốn quyết bây giờ ⇒ xuống CUỐI hàng đợi, xử lý sau.
--   Không đổi trạng thái đối tượng (không duyệt, không từ chối, không ẩn) — chỉ đổi THỨ TỰ hiện trong hàng duyệt.
--   Dùng chung cả team (DB, không localStorage): người khác mở hàng duyệt cũng thấy mục đó ở cuối.
--   Append-only: mỗi lần bấm = 1 dòng. Thứ tự SUY: mục chưa từng "để sau" giữ thứ tự gốc của hàng; mục đã "để sau" xếp sau
--   cùng, theo lần bấm GẦN NHẤT tăng dần (bấm lại ⇒ lại xuống cuối). Khoá đối tượng = (doi_tuong, mon, ma) như kho_nhan_xet.

create table if not exists kho_de_sau (
  id         bigint generated always as identity primary key,
  doi_tuong  text not null check (doi_tuong in ('cau','form_tn','form_dien','hinh_bai','hinh_bien_the','hinh_cach_giai','clone','de_thi')),
  mon        text not null check (mon in ('toan','khtn','hgt','hinh_hoc','anh','tsa')),
  ma         text not null check (btrim(ma) <> ''),
  man        text not null default '',
  nguoi      uuid default current_nhan_su_id() references nhan_su(id),
  at         timestamptz not null default now()
);
create index if not exists kho_de_sau_dt_idx on kho_de_sau (doi_tuong, mon, ma, at desc);

alter table kho_de_sau enable row level security;
drop policy if exists kho_de_sau_doc on kho_de_sau;
create policy kho_de_sau_doc on kho_de_sau for select to authenticated using (la_thanh_vien());
drop policy if exists kho_de_sau_ghi on kho_de_sau;
create policy kho_de_sau_ghi on kho_de_sau for insert to authenticated with check (la_thanh_vien());
revoke update, delete, truncate on kho_de_sau from authenticated, anon, public;
grant select, insert on kho_de_sau to authenticated;

-- Lần "để sau" gần nhất của từng đối tượng (màn duyệt dùng để xếp mục đó xuống cuối)
create or replace function fn_kho_de_sau_ds(p_doi_tuong text, p_mon text default null)
returns table (mon text, ma text, at timestamptz)
language sql stable as $$
  select d.mon, d.ma, max(d.at)
    from kho_de_sau d
   where d.doi_tuong = p_doi_tuong and (p_mon is null or d.mon = p_mon)
   group by d.mon, d.ma
$$;

create or replace function fn_kho_de_sau_ghi(p_doi_tuong text, p_mon text, p_ma text, p_man text default '')
returns timestamptz
language plpgsql as $$
declare v_at timestamptz;
begin
  if not la_thanh_vien() then raise exception 'Không có quyền'; end if;
  insert into kho_de_sau (doi_tuong, mon, ma, man) values (p_doi_tuong, p_mon, btrim(p_ma), coalesce(p_man, ''))
  returning at into v_at;
  return v_at;
end $$;

revoke execute on function fn_kho_de_sau_ds(text, text) from public, anon;
revoke execute on function fn_kho_de_sau_ghi(text, text, text, text) from public, anon;
grant execute on function fn_kho_de_sau_ds(text, text) to authenticated;
grant execute on function fn_kho_de_sau_ghi(text, text, text, text) to authenticated;
