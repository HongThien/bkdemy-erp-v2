-- ============================================================================
-- 202611281556 — hh_y_gia_thiet_them_tu_cau_hoi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/11 (MT Hình lớp 7) — chọn lẻ ý c mà đề vẫn thiếu giả thiết của ý a, b. Mig 202611281536 chỉ gộp cột da_biet của ý trước, nhưng dữ liệu thật
--   (nhất là K7: hầu hết bài) để da_biet TRỐNG và viết giả thiết dựng thêm NGAY TRONG cau_hoi_y của ý ("Từ D kẻ DE ⊥ AB… Chứng minh DE=DF").
--   Cột mới gia_thiet_them = phần cau_hoi_y đứng TRƯỚC câu lệnh hỏi đầu tiên (Chứng minh / Tính / Tìm…), TÍNH Ở DB từ cau_hoi_y (cột suy ra, không nhập tay);
--   ý bắt đầu bằng chính câu hỏi ⇒ null (thà bỏ trống còn hơn đánh sai). noi_dung của ý = lời dẫn + giả thiết các ý TRƯỚC (da_biet + gia_thiet_them, bỏ trùng,
--   bỏ phần ý này đã có sẵn) + da_biet của ý + câu hỏi ý. Chọn đủ a,b,c: khúc vẫn đúng (lời dẫn khúc = phần trước đuôi của ý ĐẦU khúc).
--   Muốn chính xác tuyệt đối cho một ý: nhập giả thiết vào ô da_biet của ý SAU (cách cũ vẫn dùng được, được ưu tiên bỏ trùng).
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 cột; noi_dung của ý có ý trước mang giả thiết sẽ DÀI THÊM phần giả thiết đó; mã câu không đổi.
-- ============================================================================
alter table public.hinh_hoc_cau_hoi add column if not exists gia_thiet_them text;

create or replace function public._hh_tach_gia_thiet(t text) returns text
language plpgsql immutable as $f$
declare i int := 1; n int; par boolean := false; ch text; j int; s int; q int := null; starts int[] := array[1];
begin
  if t is null then return null; end if;
  n := length(t);
  while i <= n loop
    ch := substr(t, i, 1);
    if ch = '$' then par := not par;
    elsif not par and ch = '.' and i < n and substr(t, i + 1, 1) ~ '\s' then
      j := i + 1;
      while j <= n and substr(t, j, 1) ~ '\s' loop j := j + 1; end loop;
      if j <= n then starts := starts || j; end if;
    end if;
    i := i + 1;
  end loop;
  foreach s in array starts loop
    if substr(t, s) ~ '^(Chứng minh|Chứng tỏ|Tính|Tìm|So sánh|Hãy|Xác định|Cho biết|Giải thích|Biện luận|Suy ra|Từ đó|Khi đó|Hỏi)' then q := s; exit; end if;
  end loop;
  if q is null or q = 1 then return null; end if;
  return nullif(btrim(substr(t, 1, q - 1)), '');
end $f$;
revoke execute on function public._hh_tach_gia_thiet(text) from public, anon;

create or replace function public._trg_hh_y_ghep() returns trigger language plpgsql as $f$
declare b record; v_truoc text; v_own text;
begin
  if new.bai_y is null then return new; end if;
  select * into b from hinh_hoc_bai_y where ma_bai_y = new.bai_y;
  if not found then raise exception 'Không thấy bài nhiều ý %', new.bai_y; end if;
  if tg_op = 'UPDATE' and new.noi_dung is distinct from old.noi_dung
     and new.cau_hoi_y is not distinct from old.cau_hoi_y and new.da_biet is not distinct from old.da_biet then
    raise exception 'Câu % là ý %) của bài % — sửa lời dẫn ở bài, sửa câu hỏi ở ý (không sửa thẳng đề ghép).', new.ma_cau, new.nhan_y, new.bai_y
      using errcode = 'P0001';
  end if;
  new.gia_thiet_them := public._hh_tach_gia_thiet(new.cau_hoi_y);
  v_own := coalesce(new.da_biet, '') || E'\n' || new.cau_hoi_y;
  -- giả thiết các ý đứng TRƯỚC (da_biet + gia_thiet_them), theo nhãn, bỏ trùng, bỏ phần ý này đã có sẵn
  select string_agg(x.d, E'\n' order by x.nhan_y, x.k) into v_truoc
    from (select distinct on (p.d) p.d, p.nhan_y, p.k
            from (select btrim(s.da_biet) d, s.nhan_y, 1 k from hinh_hoc_cau_hoi s
                   where s.bai_y = new.bai_y and s.xoa_at is null and s.ma_cau is distinct from new.ma_cau and s.nhan_y < new.nhan_y
                  union all
                  select btrim(s.gia_thiet_them), s.nhan_y, 2 from hinh_hoc_cau_hoi s
                   where s.bai_y = new.bai_y and s.xoa_at is null and s.ma_cau is distinct from new.ma_cau and s.nhan_y < new.nhan_y) p
           where coalesce(p.d, '') <> '' and position(p.d in v_own) = 0
           order by p.d, p.nhan_y, p.k) x;
  new.noi_dung := b.loi_dan || E'\n' || coalesce(v_truoc || E'\n', '') || coalesce(nullif(btrim(new.da_biet), '') || E'\n', '') || new.cau_hoi_y;
  new.anh_de := b.anh_de;
  new.dang_chinh := b.dang_chinh;
  return new;
end $f$;

-- ý đổi da_biet / nhãn / xoá / câu hỏi ⇒ các ý khác cùng bài ghép lại (WHEN chặn vòng: cú chạm cau_hoi_y = chính nó không đổi giá trị ⇒ không kích lại)
drop trigger if exists trg_hh_y_lan_y_khac_upd on public.hinh_hoc_cau_hoi;
create trigger trg_hh_y_lan_y_khac_upd after update on public.hinh_hoc_cau_hoi
  for each row when (new.bai_y is not null and (old.da_biet is distinct from new.da_biet or old.nhan_y is distinct from new.nhan_y
                     or old.xoa_at is distinct from new.xoa_at or old.cau_hoi_y is distinct from new.cau_hoi_y))
  execute function public._trg_hh_y_lan_y_khac();

-- Đợt 1: tính gia_thiet_them cho mọi ý; đợt 2: ghép lại noi_dung (lúc này giả thiết của ý trước đã đủ)
update public.hinh_hoc_cau_hoi set gia_thiet_them = public._hh_tach_gia_thiet(cau_hoi_y) where bai_y is not null and xoa_at is null;
update public.hinh_hoc_cau_hoi set cau_hoi_y = cau_hoi_y where bai_y is not null and xoa_at is null;
