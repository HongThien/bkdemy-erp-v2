-- ============================================================================
-- 202609282236 — dai_de_xuat_dang_cum
-- ----------------------------------------------------------------------------
-- P1 LUỒNG KHO (spec-luong-kho.md §5.3, spec-ban-do-k12.md §7 việc 2): chỗ cho LÀN 🟡 (đề xuất dạng/cụm mới)
-- và LÀN 🔴 (cần trao đổi) của mỗi lô. Đề xuất KHÔNG ghi thẳng vào bản đồ — canonical không bị dây chuyền
-- làm bẩn; chỉ khi người có quyền ghi `bdkt` quyết thì dạng/cụm mới ra đời.
--
-- MÔ HÌNH INVARIANT (CLAUDE.md §1, §1.5, §4) — KHÔNG có cột trạng thái, KHÔNG có dòng chờ rỗng:
--   dai_de_xuat              = MỘT đề xuất (kết quả thật của dây chuyền / của người)
--   dai_de_xuat_cau          = câu LÀM CHỨNG của đề xuất (khoá tự nhiên ma_cau)
--   dai_de_xuat_quyet_dinh   = quyết định của NGƯỜI — chỉ ra đời khi đã quyết. "Đang chờ" = chưa có dòng này.
--                              Một đề xuất một quyết định, bất biến (muốn đổi ⇒ đề xuất mới).
-- Việc "duyệt đề xuất" = (đề xuất) TRỪ (đã có quyết định) — query, không bảng task.
--
-- Nhánh ĐẠI (bảng dai_*), theo luật "mỗi nhánh bảng riêng" (CLAUDE.md §1.6). Nhánh khác cắm sau cùng khuôn.
-- MẤT GÌ: không — chỉ thêm 3 bảng + 3 hàm.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- ── 1) Đề xuất ───────────────────────────────────────────────────────────────
create table if not exists public.dai_de_xuat (
  id            uuid primary key default gen_random_uuid(),
  loai          text not null check (loai in ('dang_moi', 'cum_moi', 'trao_doi')),
  khoi          text not null,
  ma_chuyen_de  text not null,                 -- chuyên đề đề xuất thuộc về (bản đồ không có bảng chuyên đề ⇒ text)
  ma_dang       text references public.dai_ban_do (ma_dang) on update cascade on delete cascade,
                                               -- CHỈ cum_moi: dạng chứa cụm. NULL = không áp dụng (dang_moi/trao_doi)
  ten           text,                          -- tên dạng/cụm đề xuất. NULL = không áp dụng (trao_doi)
  mo_ta_ngan    text,                          -- dấu hiệu nhận biết (dang_moi). NULL = không áp dụng
  dang_gan_nhat text references public.dai_ban_do (ma_dang) on update cascade on delete set null,
  ly_do         text not null,                 -- dang/cum_moi: vì sao KHÔNG gộp được vào dạng/cụm gần nhất · trao_doi: CÂU HỎI cụ thể
  lo            text not null,                 -- mã lô chạy (vd 'k12-thuc-te-01') — đo theo lô
  nguon         text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  ai_model      text,
  created_at    timestamptz not null default now(),
  constraint dai_de_xuat_hinh_dang check (
    (loai = 'dang_moi' and ten is not null and mo_ta_ngan is not null and ma_dang is null) or
    (loai = 'cum_moi'  and ten is not null and ma_dang is not null) or
    (loai = 'trao_doi' and ten is null)
  )
);
create index if not exists dai_de_xuat_khoi_lo on public.dai_de_xuat (khoi, lo, created_at);

create table if not exists public.dai_de_xuat_cau (
  de_xuat_id uuid not null references public.dai_de_xuat (id) on delete cascade,
  ma_cau     text not null references public.dai_cau_hoi (ma_cau) on update cascade,
  primary key (de_xuat_id, ma_cau)
);
create index if not exists dai_de_xuat_cau_ma_cau on public.dai_de_xuat_cau (ma_cau);

-- ── 2) Quyết định của người — ra đời là đã quyết ─────────────────────────────
create table if not exists public.dai_de_xuat_quyet_dinh (
  de_xuat_id      uuid primary key references public.dai_de_xuat (id) on delete cascade,
  hanh_dong       text not null check (hanh_dong in ('nhan', 'nhan_co_sua', 'gop', 'bac', 'tra_loi')),
  ket_qua_ma_dang text references public.dai_ban_do (ma_dang) on update cascade on delete set null,
                                  -- dạng vừa tạo (nhan*) / dạng gộp vào (gop) / dạng người chỉ định (tra_loi). NULL = không áp dụng (bac)
  ket_qua_ma_cum  text references public.dai_cum_bai (ma_cum) on update cascade on delete set null,
  tra_loi         text,           -- lý do bác / câu trả lời — NGUỒN cho luật (bánh đà §5.0). Bắt buộc với bac, tra_loi
  so_cau_doi      int not null default 0,
  nguoi           uuid not null references public.nhan_su (id),
  quyet_at        timestamptz not null default now(),
  constraint dai_de_xuat_qd_tra_loi check (hanh_dong not in ('bac', 'tra_loi') or nullif(btrim(tra_loi), '') is not null)
);

alter table public.dai_de_xuat            enable row level security;
alter table public.dai_de_xuat_cau        enable row level security;
alter table public.dai_de_xuat_quyet_dinh enable row level security;
drop policy if exists dai_de_xuat_select on public.dai_de_xuat;
drop policy if exists dai_de_xuat_cau_select on public.dai_de_xuat_cau;
drop policy if exists dai_de_xuat_quyet_dinh_select on public.dai_de_xuat_quyet_dinh;
create policy dai_de_xuat_select            on public.dai_de_xuat            for select to authenticated using (true);
create policy dai_de_xuat_cau_select        on public.dai_de_xuat_cau        for select to authenticated using (true);
create policy dai_de_xuat_quyet_dinh_select on public.dai_de_xuat_quyet_dinh for select to authenticated using (true);
grant select on public.dai_de_xuat, public.dai_de_xuat_cau, public.dai_de_xuat_quyet_dinh to authenticated;
-- KHÔNG grant insert/update/delete cho authenticated: đề xuất do dây chuyền ghi (role ghi), quyết định chỉ qua RPC dưới.

-- ── 3) ĐỌC: danh sách đề xuất của một khối (kèm câu làm chứng + tên để render) ─
create or replace function public.fn_dai_de_xuat_ds(p_khoi text, p_chi_cho boolean default true)
returns table (
  id uuid, loai text, khoi text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text,
  ten text, mo_ta_ngan text, dang_gan_nhat text, ten_dang_gan_nhat text, ly_do text, lo text, nguon text,
  created_at timestamptz, cau jsonb, quyet_dinh jsonb
)
language sql stable set search_path = public as $$
  select d.id, d.loai, d.khoi, d.ma_chuyen_de,
         (select b.ten_chuyen_de from dai_ban_do b where b.ma_chuyen_de = d.ma_chuyen_de limit 1),
         d.ma_dang, (select b.ten_dang from dai_ban_do b where b.ma_dang = d.ma_dang),
         d.ten, d.mo_ta_ngan, d.dang_gan_nhat, (select b.ten_dang from dai_ban_do b where b.ma_dang = d.dang_gan_nhat),
         d.ly_do, d.lo, d.nguon, d.created_at,
         coalesce((select jsonb_agg(jsonb_build_object(
                     'ma_cau', q.ma_cau, 'loai_cau', q.loai_cau, 'noi_dung', left(q.noi_dung, 700),
                     'dang_chinh', q.dang_chinh, 'da_duyet', q.da_duyet) order by q.ma_cau)
                     from dai_de_xuat_cau c join dai_cau_hoi q on q.ma_cau = c.ma_cau
                    where c.de_xuat_id = d.id), '[]'::jsonb),
         (select to_jsonb(x) from (select qd.hanh_dong, qd.ket_qua_ma_dang, qd.ket_qua_ma_cum, qd.tra_loi, qd.so_cau_doi, qd.quyet_at,
                                          (select ns.ho_ten from nhan_su ns where ns.id = qd.nguoi) nguoi_ten
                                     from dai_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id) x)
    from dai_de_xuat d
   where d.khoi = p_khoi
     and (not p_chi_cho or not exists (select 1 from dai_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))
   order by d.lo, d.ma_chuyen_de, d.created_at
   limit 500
$$;
revoke all on function public.fn_dai_de_xuat_ds(text, boolean) from public, anon;
grant execute on function public.fn_dai_de_xuat_ds(text, boolean) to authenticated;

-- ── 4) GHI: người quyết một đề xuất — tính + ghi trong CÙNG transaction ───────
--   dang_moi : 'nhan'  → tạo dạng mới trong chuyên đề, dời câu làm chứng sang đó. Người đổi tên/mô tả ⇒ tự ghi 'nhan_co_sua'.
--              'gop'   → dời câu làm chứng sang p_ma_dang_dich (dạng đã có).
--              'bac'   → không đổi gì, bắt buộc lý do.
--   cum_moi  : 'nhan'  → tạo cụm trong dạng, gán ma_cum cho câu làm chứng · 'bac'.
--   trao_doi : 'tra_loi' → ghi câu trả lời; có p_ma_dang_dich thì dời câu làm chứng sang dạng đó.
-- Câu ĐÃ DUYỆT không bị tự dời (người đã chốt dạng cho nó) — đếm riêng, trả về để UI báo.
create or replace function public.fn_dai_de_xuat_quyet(
  p_id uuid, p_hanh_dong text, p_ten text default null, p_mo_ta_ngan text default null,
  p_ma_dang_dich text default null, p_tra_loi text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  d        dai_de_xuat%rowtype;
  v_nguoi  uuid := public.current_nhan_su_id();
  v_hd     text := p_hanh_dong;
  v_ma     text;
  v_cum    text;
  v_n      int := 0;
  v_bo_qua int := 0;
  m        record;
begin
  if v_nguoi is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;

  select * into d from dai_de_xuat where id = p_id for update;
  if not found then raise exception 'Đề xuất không tồn tại'; end if;
  if exists (select 1 from dai_de_xuat_quyet_dinh where de_xuat_id = p_id) then raise exception 'Đề xuất này đã được quyết rồi'; end if;

  if not ((d.loai = 'dang_moi' and v_hd in ('nhan', 'gop', 'bac'))
       or (d.loai = 'cum_moi'  and v_hd in ('nhan', 'bac'))
       or (d.loai = 'trao_doi' and v_hd = 'tra_loi')) then
    raise exception 'Hành động "%" không hợp lệ cho đề xuất loại "%"', v_hd, d.loai;
  end if;
  if v_hd in ('bac', 'tra_loi') and nullif(btrim(p_tra_loi), '') is null then
    raise exception 'Phải ghi lý do / câu trả lời — đây là thứ biến thành luật cho lô sau';
  end if;
  if v_hd = 'gop' and p_ma_dang_dich is null then raise exception 'Gộp thì phải chọn dạng đích'; end if;
  if p_ma_dang_dich is not null and not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'Dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;
  if p_ma_dang_dich is not null and public._kho_la_dang_cho(p_ma_dang_dich) then
    raise exception 'Không dời câu về dạng chờ';
  end if;

  select count(*) into v_bo_qua from dai_de_xuat_cau c join dai_cau_hoi q on q.ma_cau = c.ma_cau
   where c.de_xuat_id = p_id and q.da_duyet;

  if d.loai = 'dang_moi' and v_hd = 'nhan' then
    select * into m from dai_ban_do where ma_chuyen_de = d.ma_chuyen_de and not public._kho_la_dang_cho(ma_dang) order by ma_dang limit 1;
    if not found then raise exception 'Chuyên đề "%" chưa có dạng nào để lấy tên chủ đề/chuyên đề', d.ma_chuyen_de; end if;
    v_ma := public.fn_dai_sinh_ma_dang(d.ma_chuyen_de);
    insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
    values (v_ma, m.khoi, m.ma_chu_de, m.ten_chu_de, m.ma_chuyen_de, m.ten_chuyen_de,
            coalesce(nullif(btrim(p_ten), ''), d.ten), m.muc_do, m.bac_toi_thieu, coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan));
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten
       or coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan) is distinct from d.mo_ta_ngan then
      v_hd := 'nhan_co_sua';
    end if;
  elsif v_hd in ('gop', 'tra_loi') then
    v_ma := p_ma_dang_dich;          -- tra_loi không chỉ định dạng ⇒ null, không dời câu
  elsif d.loai = 'cum_moi' and v_hd = 'nhan' then
    insert into dai_cum_bai (ma_dang, ten, thu_tu)
    values (d.ma_dang, coalesce(nullif(btrim(p_ten), ''), d.ten),
            coalesce((select max(thu_tu) from dai_cum_bai where ma_dang = d.ma_dang), 0) + 1)
    returning ma_cum into v_cum;
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten then v_hd := 'nhan_co_sua'; end if;
    update dai_cau_hoi q set ma_cum = v_cum
      from dai_de_xuat_cau c where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and q.dang_chinh = d.ma_dang;
    get diagnostics v_n = row_count;
  end if;

  if v_ma is not null then
    update dai_cau_hoi q set dang_chinh = v_ma, ma_cum = null
      from dai_de_xuat_cau c
     where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and not q.da_duyet and q.dang_chinh is distinct from v_ma;
    get diagnostics v_n = row_count;
  end if;

  insert into dai_de_xuat_quyet_dinh (de_xuat_id, hanh_dong, ket_qua_ma_dang, ket_qua_ma_cum, tra_loi, so_cau_doi, nguoi)
  values (p_id, v_hd, v_ma, v_cum, nullif(btrim(p_tra_loi), ''), v_n, v_nguoi);

  return jsonb_build_object('hanh_dong', v_hd, 'ket_qua_ma_dang', v_ma, 'ket_qua_ma_cum', v_cum,
                            'so_cau_doi', v_n, 'so_cau_da_duyet_bo_qua', case when v_ma is null then 0 else v_bo_qua end);
end $$;
revoke all on function public.fn_dai_de_xuat_quyet(uuid, text, text, text, text, text) from public, anon;
grant execute on function public.fn_dai_de_xuat_quyet(uuid, text, text, text, text, text) to authenticated;

-- ── 5) ĐO skill ② (spec-luong-kho.md §9.6): nhận nguyên / nhận có sửa / gộp / bác · số câu phải hỏi người, theo lô ─
create or replace function public.fn_dai_de_xuat_tk(p_khoi text)
returns table (lo text, loai text, tong int, cho int, nhan int, nhan_co_sua int, gop int, bac int, tra_loi int)
language sql stable set search_path = public as $$
  select d.lo, d.loai, count(*)::int,
         count(*) filter (where qd.de_xuat_id is null)::int,
         count(*) filter (where qd.hanh_dong = 'nhan')::int,
         count(*) filter (where qd.hanh_dong = 'nhan_co_sua')::int,
         count(*) filter (where qd.hanh_dong = 'gop')::int,
         count(*) filter (where qd.hanh_dong = 'bac')::int,
         count(*) filter (where qd.hanh_dong = 'tra_loi')::int
    from dai_de_xuat d left join dai_de_xuat_quyet_dinh qd on qd.de_xuat_id = d.id
   where d.khoi = p_khoi
   group by d.lo, d.loai order by d.lo, d.loai
$$;
revoke all on function public.fn_dai_de_xuat_tk(text) from public, anon;
grant execute on function public.fn_dai_de_xuat_tk(text) to authenticated;
