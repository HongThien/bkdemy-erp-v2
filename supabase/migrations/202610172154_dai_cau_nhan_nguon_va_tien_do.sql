-- NHÃN NGUỒN cho mỗi câu Đại + tiến độ xếp vào bản đồ mới theo nguồn (Thùy 17/10:
-- "mỗi bài tập phải lưu 1 nhãn nguồn"; báo tiến độ theo 3 loại: kho cũ · tài liệu tham khảo · đề thi/đề cương).
--
-- nguon_loai:
--   'de_thi'   — đề thi, đề cương (Kho đề thi; nguon = 'de_thi')
--   'tai_lieu' — tài liệu tham khảo / sách Claude nhập theo kho-rules (ghi ten_de_goc = "Sách · số bài")
--   'kho_cu'   — câu nhân sự nhập qua ERP (kho có sẵn), không thuộc 2 loại trên
-- Bản sao (parent_ma_cau) mang nhãn của câu gốc.
-- Điền ngược (dữ liệu tới 17/10): nguon='le' có ten_de_goc ⇒ tai_lieu (13 nguồn: Toán arc 4 · Toán 5 TLTK ·
-- Nguyễn Đức Tấn · Trần Thị Vân Anh · PDF lớp 3/4 · giáo trình CLC6…) + lô 3 tài liệu K12 Nguyên hàm–Tích phân
-- nhập 10/10 (1.046 câu T1120000001518…T1120000002563, nguon='le' không ghi ten_de_goc — DEVLOG 10/10 khuya 12).

alter table dai_cau_hoi add column nguon_loai text;

-- 1) Câu gốc
update dai_cau_hoi set nguon_loai = case
    when nguon = 'de_thi' then 'de_thi'
    when nguon = 'le' and ten_de_goc is not null then 'tai_lieu'
    when nguon = 'le' and length(ma_cau) = 14 and ma_cau between 'T1120000001518' and 'T1120000002563'
         and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = date '2026-10-10' then 'tai_lieu'
    else 'kho_cu' end
 where parent_ma_cau is null;

-- 2) Bản sao theo câu gốc (lặp phòng chuỗi bản sao của bản sao); bản sao mất gốc ⇒ kho_cu
do $$
declare n int;
begin
  loop
    update dai_cau_hoi c set nguon_loai = p.nguon_loai
      from dai_cau_hoi p
     where c.parent_ma_cau = p.ma_cau and c.nguon_loai is null and p.nguon_loai is not null;
    get diagnostics n = row_count;
    exit when n = 0;
  end loop;
  update dai_cau_hoi set nguon_loai = 'kho_cu' where nguon_loai is null;
end $$;

alter table dai_cau_hoi
  alter column nguon_loai set not null,
  add constraint dai_cau_hoi_nguon_loai_check check (nguon_loai in ('kho_cu', 'tai_lieu', 'de_thi'));

comment on column dai_cau_hoi.nguon_loai is
  'Nguồn của câu (Thùy 17/10): kho_cu | tai_lieu | de_thi. Bản sao theo gốc. INSERT không ghi ⇒ trigger suy: bản sao → nhãn gốc; nguon=de_thi → de_thi; có ten_de_goc → tai_lieu; còn lại → kho_cu. Script nhập tài liệu phải ghi ten_de_goc (hoặc ghi thẳng nguon_loai).';

-- 3) Câu mới: tự gán khi người ghi không truyền
create or replace function _trg_dai_cau_nguon_loai() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.nguon_loai is null then
    if new.parent_ma_cau is not null then
      select p.nguon_loai into new.nguon_loai from dai_cau_hoi p where p.ma_cau = new.parent_ma_cau;
    end if;
    if new.nguon_loai is null then
      new.nguon_loai := case when new.nguon = 'de_thi' then 'de_thi'
                             when new.ten_de_goc is not null then 'tai_lieu'
                             else 'kho_cu' end;
    end if;
  end if;
  return new;
end $$;

create trigger trg_dai_cau_nguon_loai before insert on dai_cau_hoi
  for each row execute function _trg_dai_cau_nguon_loai();

-- 4) Tiến độ xếp câu GỐC vào bản đồ mới theo khối × nguồn (bản sao đi theo gốc nên không đếm riêng).
--    da_xep   = câu có dạng bài (gán câu · gán cụm · đối ứng 1 chỗ); trong đó da_xep_ai = máy ghi thẳng (gan_cau nguon='ai')
--    cho_duyet = đang ở hàng Chưa chắc · thieu_dang = hàng Thiếu dạng · chua_xep = còn lại (chưa ai đụng)
create or replace function fn_bdm_tien_do_nguon(p_khoi text default null)
returns table (khoi text, nguon_loai text, goc bigint, da_xep bigint, da_xep_ai bigint,
               cho_duyet bigint, thieu_dang bigint, chua_xep bigint, pct_da_xep numeric)
language sql stable set search_path = public as $$
  with k as (
    select distinct b.khoi from dai_ban_do b
     where (p_khoi is null or b.khoi = p_khoi)
       and exists (select 1 from dai_bdm_chu_de cd where cd.khoi = b.khoi)   -- chỉ khối đã có bản đồ mới
  ),
  g as (
    select k.khoi, cg.ma_cau, cg.dang_bai_id, q.nguon_loai
      from k
      cross join lateral _bdm_cau_giai((select array_agg(ma_dang) from dai_ban_do where khoi = k.khoi)) cg
      join dai_cau_hoi q on q.ma_cau = cg.ma_cau and q.xoa_at is null
     where cg.la_goc
  )
  select g.khoi, g.nguon_loai,
         count(*),
         count(*) filter (where g.dang_bai_id is not null),
         count(*) filter (where g.dang_bai_id is not null and exists (select 1 from dai_bdm_gan_cau a where a.ma_cau = g.ma_cau and a.nguon = 'ai')),
         count(*) filter (where g.dang_bai_id is null and exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = g.ma_cau)),
         count(*) filter (where g.dang_bai_id is null and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = g.ma_cau)
                                                     and exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = g.ma_cau)),
         count(*) filter (where g.dang_bai_id is null and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = g.ma_cau)
                                                     and not exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = g.ma_cau)),
         round(100.0 * count(*) filter (where g.dang_bai_id is not null) / nullif(count(*), 0), 1)
    from g
   group by g.khoi, g.nguon_loai
$$;

grant execute on function fn_bdm_tien_do_nguon(text) to authenticated;
revoke execute on function fn_bdm_tien_do_nguon(text) from public;
