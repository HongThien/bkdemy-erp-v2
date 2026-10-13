-- ============================================================================
-- 202610140048 — hinh_cay_nhanh_c1   (spec-hinh-cay-nhanh.md §1, §3, bước C1)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Bản đồ Hình = CÂY NHÁNH (thân 1.1→1.2, rẽ từ bài mẹ thành 1.6.1…). CEO chốt 14/10:
--   (a) nhánh neo vào một BÀI mẹ; cha của nhánh SUY từ neo, không lưu kép;
--   (b) số hiển thị (1.6.1.1) chỉ là vị trí trên cây — suy lúc đọc, không lưu;
--   (c) LUẬT MÃ GỐC BẤT BIẾN (CLAUDE.md §2): mã bài cấp 1 lần lúc sinh, không bao giờ đổi.
--       `hinh_baitoan_gen_ma_trg` cũ cấp LẠI mã khi UPDATE OF mo_hinh_id (policy "1a") ⇒ chuyển bài sang
--       nhánh khác sẽ đổi mã ⇒ vi phạm. Sửa: chỉ cấp ở INSERT; mã bám MÔ HÌNH GỐC của cây.
--   Migration này CHỈ THÊM + vá trigger mã. KHÔNG đụng giả thiết hiệu lực của bài hiện có (luật 17/08
--   ở TS giữ nguyên tới C3; xem reports/hl-c0-ke-thua-17-08.md: 120/366 bài sẽ đổi nếu bỏ luật).
--
-- MẤT GÌ: không xoá gì. Trigger `hinh_baitoan_gen_ma_trg` được THAY (cùng tên) — hành vi "cấp lại mã khi
--   đổi mô hình" bị BỎ có chủ ý (đó là bug theo luật mới).
-- ============================================================================

-- 1. Cột ---------------------------------------------------------------------
alter table hinh_mo_hinh
  add column if not exists chu_de_id      text references dai_bdm_chu_de(id),
  add column if not exists neo_baitoan_id uuid references hinh_baitoan(id) on delete restrict,
  add column if not exists la_mo_hinh     boolean not null default true,
  add column if not exists thu_tu         integer;

alter table hinh_baitoan
  add column if not exists thu_tu integer;

comment on column hinh_mo_hinh.chu_de_id      is 'Chủ đề (dai_bdm_chu_de, nhanh=hinh) — chỉ GỐC cây; nhánh = NULL, suy từ gốc.';
comment on column hinh_mo_hinh.neo_baitoan_id is 'Bài mẹ nơi NHÁNH rẽ ra (hinh_baitoan.id). NULL = gốc cây, hoặc mô hình con kiểu cũ (cha ở hinh_mo_hinh_cha). Cha của nhánh = mô hình chứa bài neo — KHÔNG lưu riêng.';
comment on column hinh_mo_hinh.la_mo_hinh     is 'true = mô hình/mô hình con (đi vào được, mã bài riêng); false = nhánh inline của cây.';
comment on column hinh_mo_hinh.thu_tu         is 'Thứ tự anh em cùng bài neo.';
comment on column hinh_baitoan.thu_tu         is 'Thứ tự trong làn (nhánh/thân). Số hiển thị 1.k.m suy từ đây. KHÔNG phải mã.';

create index if not exists hinh_mo_hinh_neo_idx on hinh_mo_hinh(neo_baitoan_id) where neo_baitoan_id is not null;
create index if not exists hinh_mo_hinh_chu_de_idx on hinh_mo_hinh(chu_de_id) where chu_de_id is not null;

-- backfill thứ tự bài trong mô hình theo STT của mã (BT.kk.mmm.NN) — chỉ dòng chưa có
update hinh_baitoan b set thu_tu = x.rn
from (select id, row_number() over (partition by mo_hinh_id order by
        coalesce(nullif(substring(ma from '(\d+)$'), '')::int, 0), ma) rn
      from hinh_baitoan) x
where x.id = b.id and b.thu_tu is null;

-- một mô hình tối đa 1 cha (đo 14/10: 20 cạnh, 0 mô hình 2 cha) ⇒ cây thật
create unique index if not exists hinh_mo_hinh_cha_mo_hinh_uq on hinh_mo_hinh_cha(mo_hinh_id);

-- 2. Helper: đường mô hình gốc → m ------------------------------------------
-- cha(m) = mô hình chứa bài neo (nhánh inline) HOẶC cha_id ở hinh_mo_hinh_cha (mô hình con kiểu cũ).
create or replace function _hl_cha_mo_hinh(p_mh uuid)
returns uuid language sql stable set search_path = public as $$
  select coalesce(
    (select b.mo_hinh_id from hinh_mo_hinh m join hinh_baitoan b on b.id = m.neo_baitoan_id where m.id = p_mh),
    (select c.cha_id from hinh_mo_hinh_cha c where c.mo_hinh_id = p_mh limit 1))
$$;

create or replace function _hl_duong_mo_hinh(p_mh uuid)
returns uuid[] language plpgsql stable set search_path = public as $$
declare
  v_path uuid[] := '{}';
  v_cur  uuid := p_mh;
  v_n    int := 0;
begin
  while v_cur is not null and v_n < 64 loop
    exit when v_cur = any(v_path);              -- chặn vòng
    v_path := v_cur || v_path;                  -- gốc ở đầu
    v_cur := _hl_cha_mo_hinh(v_cur);
    v_n := v_n + 1;
  end loop;
  return v_path;
end $$;

-- GỐC của mã: leo CHỈ qua neo_baitoan_id (nhánh inline). Mô hình con kiểu cũ (hinh_mo_hinh_cha) là gốc RIÊNG.
create or replace function fn_hl_goc_mo_hinh(p_mh uuid)
returns uuid language plpgsql stable set search_path = public as $$
declare
  v_cur uuid := p_mh;
  v_up  uuid;
  v_n   int := 0;
begin
  loop
    select b.mo_hinh_id into v_up
      from hinh_mo_hinh m join hinh_baitoan b on b.id = m.neo_baitoan_id where m.id = v_cur;
    exit when v_up is null or v_n >= 64;
    v_cur := v_up; v_n := v_n + 1;
  end loop;
  return v_cur;
end $$;

-- 3. Trigger mã bài: CHỈ cấp ở INSERT; UPDATE không bao giờ đổi mã ----------
create or replace function hinh_baitoan_gen_ma()
returns trigger language plpgsql set search_path = public as $$
declare
  v_goc    uuid;
  v_khoi   text;
  v_mh_num text;
  v_stt    int;
begin
  if tg_op = 'UPDATE' then
    -- MÃ GỐC BẤT BIẾN (CLAUDE.md §2): mọi cách đổi mã đều bị đưa về mã cũ
    new.ma := old.ma;
    return new;
  end if;

  if new.ma is not null then return new; end if;   -- INSERT có mã sẵn (nhập tay) — giữ

  v_goc := fn_hl_goc_mo_hinh(new.mo_hinh_id);
  select mh.khoi, substring(mh.ma from 'MH\.(\d+)') into v_khoi, v_mh_num
    from hinh_mo_hinh mh where mh.id = v_goc;
  if v_khoi is null then
    raise exception 'Mô hình gốc (id=%) chưa gán khối — gán khối trước khi tạo bài.', v_goc;
  end if;
  if v_mh_num is null then
    raise exception 'Mô hình gốc (id=%) có mã không đúng dạng "MH.<số>".', v_goc;
  end if;

  -- STT = lớn nhất trong CẢ CÂY (mọi nhánh inline của gốc) + 1 — mã không bao giờ tái dùng
  select coalesce(max((substring(bt.ma from '^BT\.\d+\.\d+\.(\d+)$'))::int), 0) + 1 into v_stt
    from hinh_baitoan bt
    join hinh_mo_hinh m on m.id = bt.mo_hinh_id
   where fn_hl_goc_mo_hinh(m.id) = v_goc
     and bt.ma ~ '^BT\.\d+\.\d+\.\d+$';

  new.ma := 'BT.' || lpad(v_khoi, 2, '0') || '.' || v_mh_num || '.' || lpad(v_stt::text, 2, '0');
  return new;
end $$;

drop trigger if exists hinh_baitoan_gen_ma_trg on hinh_baitoan;
create trigger hinh_baitoan_gen_ma_trg
  before insert or update on hinh_baitoan
  for each row execute function hinh_baitoan_gen_ma();

-- 4. Bất biến cây: neo không được tạo vòng ----------------------------------
create or replace function hinh_mo_hinh_neo_chk()
returns trigger language plpgsql set search_path = public as $$
declare
  v_mh_neo uuid;
begin
  if new.neo_baitoan_id is null then return new; end if;
  select mo_hinh_id into v_mh_neo from hinh_baitoan where id = new.neo_baitoan_id;
  if v_mh_neo is null then
    raise exception 'neo_baitoan_id % không tồn tại', new.neo_baitoan_id;
  end if;
  if v_mh_neo = new.id or new.id = any(_hl_duong_mo_hinh(v_mh_neo)) then
    raise exception 'Nhánh không thể rẽ ra từ chính nó hoặc từ cây con của nó (vòng).';
  end if;
  return new;
end $$;

drop trigger if exists hinh_mo_hinh_neo_chk_trg on hinh_mo_hinh;
create trigger hinh_mo_hinh_neo_chk_trg
  before insert or update of neo_baitoan_id on hinh_mo_hinh
  for each row execute function hinh_mo_hinh_neo_chk();

-- 5. Số hiển thị (suy, không lưu) -------------------------------------------
-- Thân: 1.k · nhánh rẽ từ bài có số X: X.k. Thứ tự làn: hinh_baitoan.thu_tu, rồi mã.
-- (plpgsql lặp — CTE đệ quy không cho tham chiếu đệ quy trong subquery lateral/window.)
create or replace function fn_hl_so_hien_thi(p_goc uuid)
returns table(baitoan_id uuid, mo_hinh_id uuid, so text, ma text)
language plpgsql stable set search_path = public as $$
declare
  v_hang_mh  uuid[] := array[p_goc];
  v_hang_pt  text[] := array['1'];
  v_mh       uuid;
  v_pt       text;
  v_b        record;
  v_k        int;
  v_con      record;
  v_vong     int := 0;
begin
  while array_length(v_hang_mh, 1) > 0 and v_vong < 2000 loop
    v_vong := v_vong + 1;
    v_mh := v_hang_mh[1]; v_pt := v_hang_pt[1];
    v_hang_mh := v_hang_mh[2:]; v_hang_pt := v_hang_pt[2:];
    v_k := 0;
    for v_b in
      select b.id, b.ma from hinh_baitoan b where b.mo_hinh_id = v_mh order by b.thu_tu nulls last, b.ma
    loop
      v_k := v_k + 1;
      baitoan_id := v_b.id; mo_hinh_id := v_mh; so := v_pt || '.' || v_k; ma := v_b.ma;
      return next;
      for v_con in select m.id from hinh_mo_hinh m where m.neo_baitoan_id = v_b.id order by m.thu_tu nulls last, m.ma loop
        v_hang_mh := v_hang_mh || v_con.id;
        v_hang_pt := v_hang_pt || so;
      end loop;
    end loop;
  end loop;
end $$;

-- 6. Giả thiết hiệu lực — LUẬT MỚI (đường gốc → nhánh + riêng bài), KHÔNG thay TS đang chạy ----
create or replace function fn_hl_gia_thiet_hieu_luc(p_baitoan uuid)
returns text language plpgsql stable set search_path = public as $$
declare
  v_b      hinh_baitoan%rowtype;
  v_path   uuid[];
  v_base   int := 1;
  v_i      int;
  v_parts  text[] := '{}';
  v_m      hinh_mo_hinh%rowtype;
begin
  select * into v_b from hinh_baitoan where id = p_baitoan;
  if not found then return null; end if;
  if v_b.gt_thay_the then return coalesce(btrim(v_b.gia_thiet_rieng), ''); end if;

  v_path := _hl_duong_mo_hinh(v_b.mo_hinh_id);          -- [gốc … nhánh]
  for v_i in 2 .. coalesce(array_length(v_path, 1), 0) loop   -- node thay-thế sâu nhất (i > 1)
    select * into v_m from hinh_mo_hinh where id = v_path[v_i];
    if v_m.gt_thay_the then v_base := v_i; end if;
  end loop;

  for v_i in v_base .. coalesce(array_length(v_path, 1), 0) loop
    select * into v_m from hinh_mo_hinh where id = v_path[v_i];
    if v_i = v_base then
      if coalesce(btrim(v_m.gia_thiet), '') <> '' then v_parts := v_parts || btrim(v_m.gia_thiet); end if;
    else
      if coalesce(btrim(v_m.gia_thiet_them), '') <> '' then v_parts := v_parts || btrim(v_m.gia_thiet_them); end if;
    end if;
  end loop;

  if coalesce(btrim(v_b.gia_thiet_rieng), '') <> '' then v_parts := v_parts || btrim(v_b.gia_thiet_rieng); end if;
  return array_to_string(v_parts, '; ');
end $$;

-- 7. Cờ "sai nhánh": bài b có tiền đề t mà nhánh(b) KHÔNG nằm trong cây con của nhánh(t) -----
create or replace function fn_hl_sai_nhanh(p_goc uuid)
returns table(baitoan_id uuid, ma text, tien_de_id uuid, ma_tien_de text)
language sql stable set search_path = public as $$
  select b.id, b.ma, t.id, t.ma
    from hinh_baitoan b
    join hinh_mo_hinh mb on mb.id = b.mo_hinh_id
    join lateral (
      select g.id from hinh_cach_giai g where g.baitoan_id = b.id
       order by g.la_mac_dinh desc, g.thu_tu limit 1
    ) cg on true
    join hinh_cach_tien_de td on td.cach_id = cg.id
    join hinh_baitoan t on t.id = td.tien_de_id
   where p_goc = any(_hl_duong_mo_hinh(b.mo_hinh_id))
     and not (t.mo_hinh_id = any(_hl_duong_mo_hinh(b.mo_hinh_id)))     -- đường của b phải đi qua nhánh của t
$$;

-- quyền: chỉ người đăng nhập (migrate chạy bằng role sở hữu ⇒ không có grant anon tường minh, vẫn thu hồi cho chắc)
revoke execute on function _hl_cha_mo_hinh(uuid), _hl_duong_mo_hinh(uuid), fn_hl_goc_mo_hinh(uuid),
  fn_hl_so_hien_thi(uuid), fn_hl_gia_thiet_hieu_luc(uuid), fn_hl_sai_nhanh(uuid) from public, anon;
grant execute on function fn_hl_goc_mo_hinh(uuid), fn_hl_so_hien_thi(uuid),
  fn_hl_gia_thiet_hieu_luc(uuid), fn_hl_sai_nhanh(uuid) to authenticated;
