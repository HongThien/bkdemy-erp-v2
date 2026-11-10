-- ============================================================================
-- 202611091550 — hinh_hoc_bai_nhieu_y
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 09/11: kho Hình – Học tách bài nhiều ý thành các ý — (1) người dùng chọn được ý của bài, (2) mỗi ý đánh giá riêng
--   (bài 3 ý = 3 lần đánh giá). "Mỗi ý 1 câu nhưng phải rõ liên kết, UI như Hình – Luyện là chuẩn" · "về đánh giá không khác —
--   tất cả các ý vẫn chỉ thuộc bài (học) đó, đơn giản hơn kho Hình luyện nhiều". Đảo luật 21/09 "Hình không tách ý".
--   Mô hình: hinh_hoc_bai_y = 1 bài nhiều ý (mã gốc HHB…, lời dẫn + hình chung, thuộc 1 bài học). Mỗi ý = 1 câu hinh_hoc_cau_hoi
--   (mã HHC mới) có bai_y + nhan_y + cau_hoi_y (+ da_biet: kết quả ý trước cần dùng). Trigger GHÉP noi_dung = lời dẫn + đã biết +
--   câu hỏi ý, ÉP anh_de / dang_chinh theo bài ⇒ mọi nơi đọc câu (chọn câu, BTVN, ET, chấm, app HS, mastery theo dạng) chạy như cũ,
--   mỗi ý tự là 1 ô chấm; sửa lời dẫn / hình / bài học của bài ⇒ ý tự theo. Sửa thẳng noi_dung của ý ⇒ TỪ CHỐI (sẽ bị ghép đè).
--   Câu cả bài cũ (HHC…) giữ nguyên cho tài liệu / điểm cũ — bước sau mới rút khỏi kho (kho_chuan=false), KHÔNG xoá.
--   Mã gốc bất biến: HHB cấp lúc INSERT, không trigger nào cấp lại.
-- MẤT GÌ (Luật xoá): Không mất dữ liệu. DROP + CREATE lại fn_hh_kho_cau (đổi kiểu trả về: thêm 5 cột bài–ý ở cuối), thân giữ nguyên.
-- ============================================================================

create sequence if not exists public.hinh_hoc_bai_y_seq;
create table public.hinh_hoc_bai_y (
  ma_bai_y    text primary key default ('HHB' || lpad(nextval('public.hinh_hoc_bai_y_seq')::text, 6, '0')),
  dang_chinh  text not null references public.hinh_hoc_bai(ma_bai),
  loi_dan     text not null,
  anh_de      text,
  ma_cau_goc  text references public.hinh_hoc_cau_hoi(ma_cau),     -- câu cả bài cũ đã tách ra (truy ngược)
  thu_tu      integer not null default 0,
  xoa_at      timestamptz,
  created_by  uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index hinh_hoc_bai_y_goc_uq on public.hinh_hoc_bai_y(ma_cau_goc) where ma_cau_goc is not null and xoa_at is null;
create index hinh_hoc_bai_y_dang_idx on public.hinh_hoc_bai_y(dang_chinh);
alter table public.hinh_hoc_bai_y enable row level security;
create policy hinh_hoc_bai_y_member_all on public.hinh_hoc_bai_y for all to authenticated
  using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'claude_ro') then
    execute 'create policy claude_ro_select on public.hinh_hoc_bai_y for select to claude_ro using (true)';
  end if;
end $$;

alter table public.hinh_hoc_cau_hoi
  add column bai_y     text references public.hinh_hoc_bai_y(ma_bai_y),
  add column nhan_y    text,
  add column cau_hoi_y text,
  add column da_biet   text,
  add constraint hinh_hoc_cau_hoi_y_du check ((bai_y is null) = (nhan_y is null) and (bai_y is null) = (cau_hoi_y is null));
create unique index hinh_hoc_cau_hoi_bai_y_nhan_uq on public.hinh_hoc_cau_hoi(bai_y, nhan_y) where bai_y is not null and xoa_at is null;
create index hinh_hoc_cau_hoi_bai_y_idx on public.hinh_hoc_cau_hoi(bai_y) where bai_y is not null;

-- ── Ý: ghép đề + ép hình / bài học theo bài (chạy TRƯỚC các trigger chặn khác — tên "trg_a…") ──
create or replace function public._trg_hh_y_ghep() returns trigger language plpgsql as $f$
declare b record;
begin
  if new.bai_y is null then return new; end if;
  select * into b from hinh_hoc_bai_y where ma_bai_y = new.bai_y;
  if not found then raise exception 'Không thấy bài nhiều ý %', new.bai_y; end if;
  if tg_op = 'UPDATE' and new.noi_dung is distinct from old.noi_dung
     and new.cau_hoi_y is not distinct from old.cau_hoi_y and new.da_biet is not distinct from old.da_biet then
    raise exception 'Câu % là ý %) của bài % — sửa lời dẫn ở bài, sửa câu hỏi ở ý (không sửa thẳng đề ghép).', new.ma_cau, new.nhan_y, new.bai_y
      using errcode = 'P0001';
  end if;
  new.noi_dung := b.loi_dan || E'\n' || coalesce(nullif(btrim(new.da_biet), '') || E'\n', '') || new.cau_hoi_y;
  new.anh_de := b.anh_de;
  new.dang_chinh := b.dang_chinh;
  return new;
end $f$;
create trigger trg_a_hh_y_ghep before insert or update on public.hinh_hoc_cau_hoi
  for each row execute function public._trg_hh_y_ghep();

-- ── Bài đổi lời dẫn / hình / bài học ⇒ các ý ghép lại (đi qua trigger trên) ──
create or replace function public._trg_hh_bai_y_lan() returns trigger language plpgsql as $f$
begin
  update hinh_hoc_cau_hoi set cau_hoi_y = cau_hoi_y where bai_y = new.ma_bai_y;
  return null;
end $f$;
create trigger trg_hh_bai_y_lan after update of loi_dan, anh_de, dang_chinh on public.hinh_hoc_bai_y
  for each row when (old.loi_dan is distinct from new.loi_dan or old.anh_de is distinct from new.anh_de or old.dang_chinh is distinct from new.dang_chinh)
  execute function public._trg_hh_bai_y_lan();
create or replace function public._trg_hh_bai_y_moc() returns trigger language plpgsql as $f$
begin new.updated_at := now(); return new; end $f$;
create trigger trg_hh_bai_y_moc before update on public.hinh_hoc_bai_y for each row execute function public._trg_hh_bai_y_moc();

-- ── Kho câu Hình–Học (popup 📚): thêm thông tin bài–ý để giao diện gom ý cùng bài thành 1 thẻ ──
drop function public.fn_hh_kho_cau(text, text, text, integer, integer);
CREATE OR REPLACE FUNCTION public.fn_hh_kho_cau(p_loai text, p_id text, p_loc text DEFAULT 'tat_ca'::text, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0)
 RETURNS TABLE(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text, bai_y text, nhan_y text, cau_hoi_y text, da_biet text, loi_dan text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_khoi text; v_cho text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_hh_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai not in ('dang_bai', 'dung_sai', 'de_xuat', 'chua_khop') then raise exception 'fn_hh_kho_cau: p_loai không hợp lệ %', p_loai; end if;

  if p_loai = 'dang_bai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'hinh_hoc'::text, b.ma_bai, b.ten_bai, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where c.dang_chinh = p_id and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
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
             'dung_sai'::text, null::text, null::text, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
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
             'de_xuat:vua'::text, b.ma_bai, b.ten_bai, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_ai_de_xuat and b.chu_de_id = p_id left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by b.thu_tu, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  -- chua_khop: còn ở bài chờ, chưa có đề xuất của chủ đề này, không phải Đ/S
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'chua_khop'::text, null::text, null::text, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
      from hinh_hoc_cau_hoi c left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
     where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from hinh_hoc_bai b2 where b2.ma_bai = c.dang_ai_de_xuat and b2.chu_de_id = p_id)
       and not exists (select 1 from hinh_hoc_kho_ds k where k.ma_cau = c.ma_cau)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by c.ma_cau limit p_limit offset p_offset;
end $function$;

revoke execute on function public.fn_hh_kho_cau(text, text, text, integer, integer) from public, anon;
grant execute on function public.fn_hh_kho_cau(text, text, text, integer, integer) to authenticated;
