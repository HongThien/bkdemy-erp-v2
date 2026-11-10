-- ============================================================================
-- 202611091539 — HÌNH–LUYỆN: NHÓM BÀI + TRỌNG ĐIỂM (spec-hinh-cay-nhanh §13, Thùy chốt 09/11) — bước 1: DB
-- ----------------------------------------------------------------------------
-- Nhóm bài = "nhiều mặt của một bài toán" (định lý & định lý đảo, "2 trong 3"): nền + sự kiện A, B, C…; mỗi THÀNH VIÊN
--   là một bài thật "cho mọi sự kiện trừ một, hỏi cái còn lại"; ĐẦU RA = đủ mọi sự kiện ⇒ chuỗi đi tiếp dưới nút nhóm.
-- GIỮ CÂY (§13.3): không bỏ chỉ mục "1 cha", không sửa 13 hàm đường gốc→nhánh. Chỉ thêm VAI cho nút giả thiết:
--   · nhom_bai   — giả thiết của nút = đầu ra (gốc ⇒ gia_thiet; giữa chuỗi ⇒ gia_thiet_them).
--   · thanh_vien — con của nút nhóm, gt_thay_the = true, gia_thiet = NGUYÊN VĂN đề thật ⇒ fn_hl_gia_thiet_phan chạy
--                  đúng không cần sửa (base = nút thay thế sâu nhất).
-- Luật ở DB (trigger, không dựa vào app nhớ): ① thành viên KHÔNG có nhánh con; ② thành viên chỉ treo dưới nút nhóm;
--   ③ nút nhóm còn thành viên thì không đổi vai được; ④ cho/hỏi chỉ trỏ sự kiện CỦA ĐÚNG nhóm cha.
-- Trọng điểm: nhóm bài tự là trọng điểm; nốt đơn = cờ hinh_baitoan.la_trong_diem, chỉ trưởng khối trở lên bật/tắt.
-- Sự kiện có mã gốc (uuid) bất biến; nhãn A, B, C chỉ để hiển thị, suy từ thu_tu (CLAUDE.md §2 mã gốc bất biến).
-- MẤT GÌ: không. Thêm cột (mặc định giữ nghĩa cũ), 2 bảng mới, trigger chặn, RPC. Không đổi dòng nào đang có.
-- ============================================================================

-- ── 1. Cột ────────────────────────────────────────────────────────────────
alter table public.hinh_mo_hinh add column vai text not null default 'thuong'
  constraint hinh_mo_hinh_vai_check check (vai in ('thuong', 'nhom_bai', 'thanh_vien'));
comment on column public.hinh_mo_hinh.vai is 'Vai nút giả thiết (spec-hinh-cay-nhanh §13): thuong | nhom_bai (giả thiết = đầu ra nhóm bài) | thanh_vien (con của nhóm, gt_thay_the, nguyên văn đề; không có nhánh con)';

alter table public.hinh_baitoan add column la_trong_diem boolean not null default false;
comment on column public.hinh_baitoan.la_trong_diem is 'Nốt đơn là TRỌNG ĐIỂM (đánh giá sâu dưới mô hình) — trưởng khối trở lên bật (fn_hl_trong_diem_dat). Nhóm bài tự là trọng điểm, không dùng cờ này.';

-- ── 2. Bảng sự kiện của nhóm bài + cho/hỏi của thành viên ───────────────────
create table public.hinh_nhom_bai_su_kien (
  id         uuid primary key default gen_random_uuid(),
  nhom_id    uuid not null references public.hinh_mo_hinh(id) on delete cascade,
  noi_dung   text not null check (btrim(noi_dung) <> ''),
  thu_tu     int  not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index hinh_nhom_bai_su_kien_nhom_idx on public.hinh_nhom_bai_su_kien(nhom_id, thu_tu);
comment on table public.hinh_nhom_bai_su_kien is 'Sự kiện A, B, C… của một nhóm bài (spec-hinh-cay-nhanh §13.3). Nhãn chữ cái suy từ thu_tu, không làm khoá.';

create table public.hinh_thanh_vien_su_kien (
  id            uuid primary key default gen_random_uuid(),
  thanh_vien_id uuid not null references public.hinh_mo_hinh(id) on delete cascade,
  su_kien_id    uuid not null references public.hinh_nhom_bai_su_kien(id) on delete cascade,
  vai           text not null check (vai in ('cho', 'hoi')),
  created_at    timestamptz not null default now(),
  unique (thanh_vien_id, su_kien_id)
);
create index hinh_thanh_vien_su_kien_sk_idx on public.hinh_thanh_vien_su_kien(su_kien_id);
comment on table public.hinh_thanh_vien_su_kien is 'Thành viên của nhóm bài CHO / HỎI sự kiện nào. Chỉ có dòng cho bài thật (§1.5), không tự đẻ đủ tổ hợp.';

alter table public.hinh_nhom_bai_su_kien enable row level security;
alter table public.hinh_thanh_vien_su_kien enable row level security;
create policy hinh_nhom_bai_su_kien_member_all on public.hinh_nhom_bai_su_kien for all to authenticated
  using ((select la_thanh_vien())) with check ((select la_thanh_vien()));
create policy hinh_thanh_vien_su_kien_member_all on public.hinh_thanh_vien_su_kien for all to authenticated
  using ((select la_thanh_vien())) with check ((select la_thanh_vien()));
grant select, insert, update, delete on public.hinh_nhom_bai_su_kien, public.hinh_thanh_vien_su_kien to authenticated;

create trigger trg_hl_nhom_bai_su_kien_log after insert or update or delete on public.hinh_nhom_bai_su_kien
  for each row execute function public._bdm_ghi_log();
create trigger trg_hl_thanh_vien_su_kien_log after insert or update or delete on public.hinh_thanh_vien_su_kien
  for each row execute function public._bdm_ghi_log();

-- ── 3. Luật ở DB ──────────────────────────────────────────────────────────
-- ①② cạnh cha–con: thành viên không làm cha; thành viên chỉ treo dưới nút nhóm.
create or replace function public._hl_canh_vai_chk() returns trigger
language plpgsql set search_path = public as $$
declare v_cha text; v_con text;
begin
  select vai into v_cha from hinh_mo_hinh where id = new.cha_id;
  select vai into v_con from hinh_mo_hinh where id = new.mo_hinh_id;
  if v_cha = 'thanh_vien' then
    raise exception 'Thành viên của nhóm bài không có nhánh con — bài đi tiếp phải treo dưới nút nhóm bài (đầu ra)';
  end if;
  if v_con = 'thanh_vien' and v_cha is distinct from 'nhom_bai' then
    raise exception 'Thành viên chỉ treo được dưới một nút nhóm bài';
  end if;
  return new;
end $$;
create trigger trg_hl_canh_vai_chk before insert or update of cha_id, mo_hinh_id on public.hinh_mo_hinh_cha
  for each row execute function public._hl_canh_vai_chk();

-- ①②③ đổi vai của nút.
create or replace function public._hl_mo_hinh_vai_chk() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.vai = old.vai then return new; end if;
  if new.vai = 'thanh_vien' then
    if new.la_mo_hinh then raise exception 'Gốc mô hình không làm thành viên được'; end if;
    if not exists (select 1 from hinh_mo_hinh_cha k join hinh_mo_hinh c on c.id = k.cha_id
                    where k.mo_hinh_id = new.id and c.vai = 'nhom_bai') then
      raise exception 'Chỉ nhánh treo ngay dưới một nút nhóm bài mới làm thành viên được';
    end if;
    if exists (select 1 from hinh_mo_hinh_cha where cha_id = new.id) then
      raise exception 'Nhánh này còn nhánh con — thành viên không có nhánh con; dời các nhánh con xuống dưới nút nhóm bài trước';
    end if;
  end if;
  if old.vai = 'nhom_bai' and exists (select 1 from hinh_mo_hinh_cha k join hinh_mo_hinh t on t.id = k.mo_hinh_id
                                       where k.cha_id = new.id and t.vai = 'thanh_vien') then
    raise exception 'Nhóm bài còn thành viên — không đổi vai được';
  end if;
  return new;
end $$;
create trigger trg_hl_mo_hinh_vai_chk before update of vai on public.hinh_mo_hinh
  for each row execute function public._hl_mo_hinh_vai_chk();

-- ④ cho/hỏi: thành viên đúng vai, sự kiện thuộc đúng nhóm cha của thành viên.
create or replace function public._hl_tv_su_kien_chk() returns trigger
language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from hinh_mo_hinh where id = new.thanh_vien_id and vai = 'thanh_vien') then
    raise exception 'Chỉ thành viên của nhóm bài mới gắn cho/hỏi được';
  end if;
  if not exists (select 1 from hinh_mo_hinh_cha k join hinh_nhom_bai_su_kien s on s.nhom_id = k.cha_id
                  where k.mo_hinh_id = new.thanh_vien_id and s.id = new.su_kien_id) then
    raise exception 'Sự kiện không thuộc nhóm bài của thành viên này';
  end if;
  return new;
end $$;
create trigger trg_hl_tv_su_kien_chk before insert or update on public.hinh_thanh_vien_su_kien
  for each row execute function public._hl_tv_su_kien_chk();

-- ── 4. RPC ghi (invoker + RLS, như các fn_hl_* khác; trả _hl_ket_qua để client vá tại chỗ) ──
-- Bật nhóm bài trên một nút giả thiết đang có (gốc hoặc nhánh): đặt vai + tạo sự kiện theo thứ tự.
create or replace function public.fn_hl_nhom_bai_bat(p_nut uuid, p_su_kien text[])
returns jsonb language plpgsql set search_path = public as $$
declare v_vai text; v_i int := 0; v_t text;
begin
  select vai into v_vai from hinh_mo_hinh where id = p_nut;
  if v_vai is null then raise exception 'Giả thiết không tồn tại'; end if;
  if v_vai <> 'thuong' then raise exception 'Nút này đã là %', case v_vai when 'nhom_bai' then 'nhóm bài' else 'thành viên' end; end if;
  if coalesce(array_length(p_su_kien, 1), 0) < 2 then raise exception 'Nhóm bài cần ít nhất 2 sự kiện'; end if;
  update hinh_mo_hinh set vai = 'nhom_bai', updated_at = now() where id = p_nut;
  foreach v_t in array p_su_kien loop
    if coalesce(btrim(v_t), '') = '' then raise exception 'Sự kiện thứ % đang trống', v_i + 1; end if;
    v_i := v_i + 1;
    insert into hinh_nhom_bai_su_kien(nhom_id, noi_dung, thu_tu) values (p_nut, btrim(v_t), v_i);
  end loop;
  return public._hl_ket_qua(public.fn_hl_goc_mo_hinh(p_nut));
end $$;

create or replace function public.fn_hl_su_kien_them(p_nhom uuid, p_noi_dung text)
returns jsonb language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from hinh_mo_hinh where id = p_nhom and vai = 'nhom_bai') then raise exception 'Không phải nút nhóm bài'; end if;
  if coalesce(btrim(p_noi_dung), '') = '' then raise exception 'Sự kiện đang trống'; end if;
  insert into hinh_nhom_bai_su_kien(nhom_id, noi_dung, thu_tu)
  values (p_nhom, btrim(p_noi_dung), coalesce((select max(thu_tu) from hinh_nhom_bai_su_kien where nhom_id = p_nhom), 0) + 1);
  update hinh_mo_hinh set updated_at = now() where id = p_nhom;
  return public._hl_ket_qua(public.fn_hl_goc_mo_hinh(p_nhom));
end $$;

create or replace function public.fn_hl_su_kien_sua(p_su_kien uuid, p_noi_dung text)
returns jsonb language plpgsql set search_path = public as $$
declare v_nhom uuid;
begin
  if coalesce(btrim(p_noi_dung), '') = '' then raise exception 'Sự kiện đang trống'; end if;
  update hinh_nhom_bai_su_kien set noi_dung = btrim(p_noi_dung), updated_at = now() where id = p_su_kien returning nhom_id into v_nhom;
  if v_nhom is null then raise exception 'Sự kiện không tồn tại'; end if;
  update hinh_mo_hinh set updated_at = now() where id = v_nhom;
  return public._hl_ket_qua(public.fn_hl_goc_mo_hinh(v_nhom));
end $$;

-- cho/hỏi của một thành viên: thay trọn bộ (cùng transaction). Phải hỏi ≥1, cho ∩ hỏi = ∅.
create or replace function public._hl_tv_cho_hoi_ghi(p_tv uuid, p_cho uuid[], p_hoi uuid[])
returns void language plpgsql set search_path = public as $$
begin
  if coalesce(array_length(p_hoi, 1), 0) = 0 then raise exception 'Thành viên phải HỎI ít nhất 1 sự kiện'; end if;
  if p_cho && p_hoi then raise exception 'Một sự kiện không thể vừa cho vừa hỏi'; end if;
  delete from hinh_thanh_vien_su_kien where thanh_vien_id = p_tv;
  insert into hinh_thanh_vien_su_kien(thanh_vien_id, su_kien_id, vai)
  select p_tv, x, 'cho' from unnest(coalesce(p_cho, '{}')) x
  union all select p_tv, x, 'hoi' from unnest(p_hoi) x;
end $$;

-- Thêm thành viên MỚI dưới nút nhóm: giả thiết nguyên văn đề thật (thay thế, không cộng dồn).
create or replace function public.fn_hl_thanh_vien_them(p_nhom uuid, p_ten text, p_gia_thiet text, p_cho uuid[], p_hoi uuid[])
returns jsonb language plpgsql set search_path = public as $$
declare v_goc uuid; v_phan text; v_khoi text; v_n uuid;
begin
  if not exists (select 1 from hinh_mo_hinh where id = p_nhom and vai = 'nhom_bai') then raise exception 'Không phải nút nhóm bài'; end if;
  if coalesce(btrim(p_gia_thiet), '') = '' then raise exception 'Chưa nhập giả thiết (nguyên văn đề) của thành viên'; end if;
  v_goc := public.fn_hl_goc_mo_hinh(p_nhom);
  select phan, khoi into v_phan, v_khoi from hinh_mo_hinh where id = v_goc;
  insert into hinh_mo_hinh(ten, gia_thiet, gia_thiet_them, la_mo_hinh, gt_thay_the, phan, khoi, thu_tu)
  values (coalesce(nullif(btrim(p_ten), ''), 'Thành viên'), btrim(p_gia_thiet), '', false, true, v_phan, v_khoi,
          coalesce((select count(*) from hinh_mo_hinh_cha where cha_id = p_nhom), 0) + 1)
  returning id into v_n;
  insert into hinh_mo_hinh_cha(mo_hinh_id, cha_id, chinh) values (v_n, p_nhom, false);
  update hinh_mo_hinh set vai = 'thanh_vien' where id = v_n;
  perform public._hl_tv_cho_hoi_ghi(v_n, p_cho, p_hoi);
  update hinh_mo_hinh set updated_at = now() where id = p_nhom;
  return public._hl_ket_qua(v_goc, v_n);
end $$;

-- Biến một nhánh ĐANG CÓ (treo ngay dưới nút nhóm, không có nhánh con) thành thành viên — dùng khi gom dữ liệu cũ.
-- Nốt trong nhánh giữ nguyên (mã không đổi); giả thiết đổi sang nguyên văn đề, gt_thay_the bật.
create or replace function public.fn_hl_thanh_vien_chuyen(p_nut uuid, p_gia_thiet text, p_cho uuid[], p_hoi uuid[])
returns jsonb language plpgsql set search_path = public as $$
begin
  if coalesce(btrim(p_gia_thiet), '') = '' then raise exception 'Chưa nhập giả thiết (nguyên văn đề) của thành viên'; end if;
  update hinh_mo_hinh set vai = 'thanh_vien', gt_thay_the = true, gia_thiet = btrim(p_gia_thiet), updated_at = now() where id = p_nut;
  if not found then raise exception 'Nhánh không tồn tại'; end if;
  perform public._hl_tv_cho_hoi_ghi(p_nut, p_cho, p_hoi);
  update hinh_mo_hinh set updated_at = now() where id = (select cha_id from hinh_mo_hinh_cha where mo_hinh_id = p_nut);
  return public._hl_ket_qua(public.fn_hl_goc_mo_hinh(p_nut));
end $$;

create or replace function public.fn_hl_thanh_vien_cho_hoi(p_tv uuid, p_cho uuid[], p_hoi uuid[])
returns jsonb language plpgsql set search_path = public as $$
begin
  perform public._hl_tv_cho_hoi_ghi(p_tv, p_cho, p_hoi);
  update hinh_mo_hinh set updated_at = now() where id = p_tv;
  return public._hl_ket_qua(public.fn_hl_goc_mo_hinh(p_tv));
end $$;

-- Trọng điểm nốt đơn — chỉ trưởng khối trở lên của (môn, khối) mô hình.
create or replace function public.fn_hl_trong_diem_dat(p_baitoan uuid, p_bat boolean)
returns jsonb language plpgsql set search_path = public as $$
declare v_goc uuid; v_mon text; v_khoi text;
begin
  select public.fn_hl_goc_mo_hinh(b.mo_hinh_id) into v_goc from hinh_baitoan b where b.id = p_baitoan;
  if v_goc is null then raise exception 'Bài không tồn tại'; end if;
  select mon, khoi into v_mon, v_khoi from hinh_mo_hinh where id = v_goc;
  if not public._truong_khoi_tro_len(v_mon, v_khoi) then raise exception 'Chỉ trưởng khối trở lên mới đánh dấu trọng điểm'; end if;
  update hinh_baitoan set la_trong_diem = coalesce(p_bat, false), updated_at = now()
   where id = p_baitoan and la_trong_diem is distinct from coalesce(p_bat, false);
  return public._hl_ket_qua(v_goc);
end $$;

-- ── 5. RPC đọc: nhóm bài của một cây (sự kiện có nhãn A, B, C suy từ thứ tự; thành viên kèm cho/hỏi) ──
create or replace function public.fn_hl_nhom_bai_cua_cay(p_goc uuid)
returns jsonb language sql stable set search_path = public as $$
  with nb as (select m.* from hinh_mo_hinh m where m.vai = 'nhom_bai' and public.fn_hl_goc_mo_hinh(m.id) = p_goc),
  sk as (select s.*, chr(64 + row_number() over (partition by s.nhom_id order by s.thu_tu, s.created_at)::int) as ky_hieu
           from hinh_nhom_bai_su_kien s where s.nhom_id in (select id from nb))
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', nb.id, 'ten', nb.ten,
    'su_kien', coalesce((select jsonb_agg(jsonb_build_object('id', sk.id, 'ky_hieu', sk.ky_hieu, 'noi_dung', sk.noi_dung) order by sk.thu_tu, sk.created_at)
                           from sk where sk.nhom_id = nb.id), '[]'::jsonb),
    'thanh_vien', coalesce((select jsonb_agg(jsonb_build_object(
                    'id', t.id, 'ten', t.ten, 'gia_thiet', t.gia_thiet,
                    'cho', coalesce((select jsonb_agg(x.su_kien_id order by sk.thu_tu) from hinh_thanh_vien_su_kien x join sk on sk.id = x.su_kien_id
                                      where x.thanh_vien_id = t.id and x.vai = 'cho'), '[]'::jsonb),
                    'hoi', coalesce((select jsonb_agg(x.su_kien_id order by sk.thu_tu) from hinh_thanh_vien_su_kien x join sk on sk.id = x.su_kien_id
                                      where x.thanh_vien_id = t.id and x.vai = 'hoi'), '[]'::jsonb))
                    order by t.thu_tu, t.created_at)
                    from hinh_mo_hinh_cha k join hinh_mo_hinh t on t.id = k.mo_hinh_id
                   where k.cha_id = nb.id and t.vai = 'thanh_vien'), '[]'::jsonb))
    order by nb.created_at), '[]'::jsonb)
  from nb
$$;

revoke all on function public.fn_hl_nhom_bai_bat(uuid, text[]), public.fn_hl_su_kien_them(uuid, text), public.fn_hl_su_kien_sua(uuid, text),
  public._hl_tv_cho_hoi_ghi(uuid, uuid[], uuid[]), public.fn_hl_thanh_vien_them(uuid, text, text, uuid[], uuid[]),
  public.fn_hl_thanh_vien_chuyen(uuid, text, uuid[], uuid[]), public.fn_hl_thanh_vien_cho_hoi(uuid, uuid[], uuid[]),
  public.fn_hl_trong_diem_dat(uuid, boolean), public.fn_hl_nhom_bai_cua_cay(uuid) from public;
grant execute on function public.fn_hl_nhom_bai_bat(uuid, text[]), public.fn_hl_su_kien_them(uuid, text), public.fn_hl_su_kien_sua(uuid, text),
  public.fn_hl_thanh_vien_them(uuid, text, text, uuid[], uuid[]), public.fn_hl_thanh_vien_chuyen(uuid, text, uuid[], uuid[]),
  public.fn_hl_thanh_vien_cho_hoi(uuid, uuid[], uuid[]), public.fn_hl_trong_diem_dat(uuid, boolean), public.fn_hl_nhom_bai_cua_cay(uuid) to authenticated;
