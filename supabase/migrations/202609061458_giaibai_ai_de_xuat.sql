-- ============================================================================
-- 202609061458 — giaibai_ai_de_xuat
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 06/09, idea tối ưu flow "giải bài" sau khi tool đã chạy:
--   "Dùng Claude giải các bài trong kho (Sonnet/Haiku) → trang giải bài KHÔNG hiện bài
--    chưa giải nữa, mà hiện bài AI ĐÃ GIẢI để nhân sự SỬA thay vì viết từ trắng."
-- Chốt 4 điểm (Thùy):
--   (1) Nhóm "có đáp án ngắn nhưng chưa có lời giải chi tiết" vốn ĐƠN GIẢN không cần lời giải
--       chi tiết — KHÔNG đưa vào luồng này. Chỉ nhóm THIẾU CẢ HAI (đã lọc ở mig 202609061419,
--       hiện 123 Đại/8 KHTN/2 HGT/30 Hình) là "thiếu thật", đúng nhóm cần AI xử lý.
--   (2) KHÔNG đụng 11.815 câu Đại đã có lời giải AI CŨ trong kho (`loi_giai`, `nguon_giai='ai'`,
--       chưa duyệt) — flow MỚI này TÁCH RIÊNG, dùng CỘT MỚI, không chạm cột `loi_giai` chính thức
--       cho tới khi DUYỆT (đúng luật cũ "luồng giải bài không xoá/ghi đè gì trong kho").
--   (3) Lưu CẢ bản AI đề xuất lẫn model đã sinh, để SAU NÀY so hiệu suất giữa các model (đối chiếu
--       với lời giải NGƯỜI đã hoàn thiện, vốn đã có sẵn ở kho sau khi duyệt — không cần lưu thêm
--       bản "đã hoàn thiện" ở đâu khác).
--   (4) Tính công để sau — bản này CHỈ track số lượng + độ khó (đã có `muc_do` sẵn trong kho).
--
-- Kiến trúc (mirror worker/danhgia.mjs — job queue + Claude API, KHÔNG phải luồng "Claude Code
-- thủ công" của hangdoi-giai.mjs):
--   · Cột "kho ý tưởng AI mới nhất" nằm NGAY TRÊN câu hỏi/mô hình gốc (`loi_giai_ai`, `dap_an_ai`,
--     `ai_model`, `ai_de_xuat_at`) — script sinh xong ghi vào đây, KHÔNG đụng `loi_giai` chính thức.
--   · Bảng job MỚI `giaibai_ai_job` (như `danhgia_ai_job`): học thuật bấm "Tạo job AI" trên Dashboard
--     (RPC `fn_giaibai_ai_tao_job`, gác cửa `fn_giaibai_la_nguoi_duyet`) → worker (chạy nền, đọc
--     ANTHROPIC_API_KEY từ .env.local — KHÔNG phải VITE_*) nhặt job, gọi Claude, ghi vào câu gốc.
--   · Khi 1 người "Nhận bài" (`fn_giaibai_nhan`, KHÔNG đổi chữ ký/hành vi bên ngoài): nếu câu đã có
--     `loi_giai_ai`, COPY vào `loi_giai_nhap`/`dap_an_nhap` (pre-fill, người sửa thay vì viết từ đầu)
--     + SNAPSHOT `loi_giai_ai`/`ai_model` vào dòng nhận (bất biến — trả/nhận lại nhiều lần không mất,
--     và so sánh về sau không phụ thuộc câu gốc có bị AI chạy lại cho câu KHÁC).
--   · `v_giaibai_bai` (nguồn của "Kho bài"): CHỈ hiện câu ĐÃ có `loi_giai_ai` (đổi đúng ý #2 — ẩn hẳn
--     câu "AI chưa xử lý" khỏi người, hiện qua Dashboard dạng "N câu chờ AI" cho học thuật biết).
--
-- MẤT GÌ (Luật xoá): KHÔNG XOÁ GÌ. Toàn bộ là THÊM cột/bảng/hàm + create-or-replace GIỮ chữ ký cũ.
-- Ảnh hưởng dữ liệu: "Kho bài" tạm RỖNG cho tới khi có job AI chạy xong (đây là TÁC DỤNG ĐÚNG Ý #2,
-- không phải lỗi) — Dashboard hiện rõ "N câu chờ AI xử lý" để học thuật biết cần bấm "Tạo job".
-- ============================================================================

-- ═══════════ 1. Cột "kho ý tưởng AI mới nhất" trên câu hỏi/mô hình gốc (5 bảng) ═══════════
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi','khtn_cau_hoi','hgt_cau_hoi','hinh_baitoan','hinh_baitoan_bien_the'] loop
    execute format($q$
      alter table %1$I
        add column if not exists loi_giai_ai text,
        add column if not exists dap_an_ai text,
        add column if not exists ai_model text,
        add column if not exists ai_de_xuat_at timestamptz
    $q$, t);
  end loop;
end $$;

-- ═══════════ 2. Snapshot trên dòng NHẬN BÀI (5 bảng *_yeu_cau_giai) — bất biến sau khi nhận ═══════════
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi_yeu_cau_giai','khtn_cau_hoi_yeu_cau_giai','hgt_cau_hoi_yeu_cau_giai','hinh_baitoan_yeu_cau_giai','hinh_bien_the_yeu_cau_giai'] loop
    execute format($q$
      alter table %1$I
        add column if not exists loi_giai_ai text,
        add column if not exists ai_model text
    $q$, t);
  end loop;
end $$;

-- ═══════════ 3. Bảng JOB gọi Claude (mirror danhgia_ai_job) ═══════════
create table if not exists public.giaibai_ai_job (
  id uuid primary key default gen_random_uuid(),
  nhanh text not null,
  key text not null,             -- ma_cau (toan/khtn/hgt) hoặc uuid dạng text (hinh_baitoan/hinh_bien_the)
  trang_thai text not null default 'pending' check (trang_thai in ('pending','processing','done','failed')),
  model_chon text,               -- null = worker dùng mặc định (env GIAIBAI_AI_MODEL)
  usage jsonb,
  tien_dong int,                 -- đồng — log thật để đối chiếu, KHÔNG dùng để tính công (đã chốt: để sau)
  error text,
  attempt int not null default 0,
  nguoi_tao uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  done_at timestamptz
);
-- 1 câu tối đa 1 job đang treo (pending/processing) — bấm "Tạo job" nhiều lần không tạo trùng.
create unique index if not exists giaibai_ai_job_treo_uniq on public.giaibai_ai_job (nhanh, key) where trang_thai in ('pending','processing');
create index if not exists giaibai_ai_job_trang_thai_idx on public.giaibai_ai_job (trang_thai, updated_at);
-- Khoá kỹ hơn danhgia_ai_job (la_thanh_vien() cho mọi nhân sự): bảng này KHÔNG cấp thẳng cho
-- authenticated — mọi thao tác qua RPC SECURITY DEFINER (gác fn_giaibai_la_nguoi_duyet) hoặc
-- service-role (worker). RLS bật, KHÔNG policy nào cho authenticated/anon ⇒ mặc định chặn hết.
alter table public.giaibai_ai_job enable row level security;

-- ═══════════ 4. Đăng ký nguồn câu hỏi gốc theo nhánh (để RPC dò cột loi_giai_ai) ═══════════
create or replace function public.fn_giaibai_src(p_nhanh text, out src text, out src_key text)
language sql immutable as $$
  select case p_nhanh
           when 'toan' then 'dai_cau_hoi' when 'khtn' then 'khtn_cau_hoi' when 'hgt' then 'hgt_cau_hoi'
           when 'hinh_baitoan' then 'hinh_baitoan' when 'hinh_bien_the' then 'hinh_baitoan_bien_the' end,
         case when p_nhanh like 'hinh_%' then 'id' else 'ma_cau' end
$$;

-- ═══════════ 5. fn_giaibai_nhan — pre-fill từ loi_giai_ai + snapshot vào dòng nhận (KHÔNG đổi chữ ký) ═══════════
create or replace function public.fn_giaibai_nhan(p_nhanh text, p_key text, p_me uuid)
returns uuid
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); s record := public.fn_giaibai_src(p_nhanh);
        v_id uuid; n int; v_ten text; v_lg_ai text; v_da_ai text; v_model text;
begin
  if r.yc is null then raise exception 'fn_giaibai_nhan: nhánh không hợp lệ %', p_nhanh; end if;
  if p_me is null then raise exception 'Chưa xác định người nhận.'; end if;
  if not exists (select 1 from public.v_giaibai_bai b where b.nhanh = p_nhanh and b.key = p_key) then
    raise exception 'Bài này không còn trong danh sách chưa có lời giải.';
  end if;
  select count(*) into n from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.dang_giu and v.trang_thai in ('dang_giai','can_sua');
  if n >= 3 then raise exception 'Bạn đang giữ 3 bài — nộp hoặc trả bớt rồi nhận thêm.'; end if;
  if exists (select 1 from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.nhanh = p_nhanh and v.key = p_key and v.tu_choi_lan >= 3) then
    raise exception 'Bài này bạn đã bị từ chối 3 lần — không nhận lại được.';
  end if;
  perform public.fn_giaibai_dong_qua_han(p_nhanh, p_key);
  select coalesce(v.nguoi_giai_ten, 'Claude') into v_ten from public.v_giaibai_nhan v where v.nhanh = p_nhanh and v.key = p_key and v.xu_ly_at is null limit 1;
  if v_ten is not null then raise exception '% đang giữ bài này.', v_ten; end if;
  -- Lấy bản AI mới nhất từ câu gốc (nếu có) — pre-fill + snapshot, KHÔNG đụng cột `loi_giai` chính thức.
  execute format('select loi_giai_ai, dap_an_ai, ai_model from %I where %I = %s', s.src, s.src_key, r.key_cast)
    into v_lg_ai, v_da_ai, v_model using p_key;
  -- Khe hở race hiếm (2 người bấm NHẬN đúng cùng mili-giây): unique index `*_cho_uniq` (mig cũ) chặn
  -- ở tầng DB, người thua CATCH ở đây để nhận thông báo tiếng Việt thay vì lỗi Postgres thô.
  begin
    execute format('insert into %I (%I, nguoi_yeu_cau, nguoi_giai, trang_thai, han_at, loi_giai_nhap, dap_an_nhap, loi_giai_ai, ai_model)
                     values (%s, $2, $2, ''dang_giai'', now() + interval ''48 hours'', $3, $4, $3, $5) returning id',
                    r.yc, r.key_col, r.key_cast)
      into v_id using p_key, p_me, v_lg_ai, v_da_ai, v_model;
  exception when unique_violation then
    raise exception 'Bài này vừa có người khác nhận trước 1 bước — thử bài khác.';
  end;
  return v_id;
end $$;
grant execute on function public.fn_giaibai_nhan(text, text, uuid) to authenticated;

-- ═══════════ 6. v_giaibai_bai — CHỈ hiện câu ĐÃ CÓ đề xuất AI (đúng ý #2) ═══════════
-- Hình: v_hinh_chua_giai APPEND 3 cột ai (create-or-replace view chỉ cho nối cột — an toàn, ERP tab
-- "Chưa có lời giải" cũ không bị ảnh hưởng vì không đụng cột/hàng đã có).
create or replace view public.v_hinh_chua_giai as
  select 'baitoan'::text as loai, b.id, b.ma, m.khoi, m.ma as mo_hinh_ma, m.ten as mo_hinh_ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) as gia_thiet,
         b.phat_bieu as de_bai, coalesce(b.anh_chuan, m.anh_cau_hinh) as anh, null::text as kieu, b.created_at,
         y.id as yeu_cau_id, y.created_at as yeu_cau_at, y.ghi_chu as yeu_cau_ghi_chu,
         y.nguoi_giai as yeu_cau_nguoi_giai, ns.ho_ten as yeu_cau_nguoi_giai_ten, y.trang_thai as yeu_cau_trang_thai,
         b.loi_giai_ai, b.dap_an_ai, b.ai_model, b.ai_de_xuat_at
  from hinh_baitoan b
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join hinh_baitoan_yeu_cau_giai y on y.baitoan_id = b.id and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at)
  left join nhan_su ns on ns.id = y.nguoi_giai
  where not exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null))
  union all
  select 'bien_the', v.id, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
         v.de_bai, coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), v.kieu, v.created_at,
         y.id, y.created_at, y.ghi_chu, y.nguoi_giai, ns.ho_ten, y.trang_thai,
         v.loi_giai_ai, v.dap_an_ai, v.ai_model, v.ai_de_xuat_at
  from hinh_baitoan_bien_the v
  join hinh_baitoan b on b.id = v.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join hinh_bien_the_yeu_cau_giai y on y.bien_the_id = v.id and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at)
  left join nhan_su ns on ns.id = y.nguoi_giai
  where v.loi_giai is null and v.anh_loi_giai is null;

create or replace view public.v_giaibai_bai as
  with k as (
    select 'toan'::text as nhanh, c.ma_cau as key, c.ma_cau as ma, b.khoi, b.ten_dang as nhom_ten, b.ma_dang as nhom_ma, b.ten_chuyen_de as nhom_truoc, b.muc_do,
           c.loai_cau, c.noi_dung as de_bai, null::text as gia_thiet, c.anh_de as anh, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at,
           c.loi_giai_ai, c.dap_an_ai, c.ai_model, c.ai_de_xuat_at
    from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null and c.loi_giai_ai is not null
    union all
    select 'khtn', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at,
           c.loi_giai_ai, c.dap_an_ai, c.ai_model, c.ai_de_xuat_at
    from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null and c.loi_giai_ai is not null
    union all
    select 'hgt', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at,
           c.loi_giai_ai, c.dap_an_ai, c.ai_model, c.ai_de_xuat_at
    from hgt_cau_hoi c join hgt_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null and c.loi_giai_ai is not null
    union all
    select case h.loai when 'baitoan' then 'hinh_baitoan' else 'hinh_bien_the' end, h.id::text, h.ma, h.khoi, h.mo_hinh_ten, h.mo_hinh_ma, 'Mô hình', null::smallint,
           case h.loai when 'baitoan' then 'bai_toan_goc' else 'bien_the_' || h.kieu end, h.de_bai, h.gia_thiet, h.anh, null::jsonb, null::jsonb, null::text, 'le', h.created_at,
           h.loi_giai_ai, h.dap_an_ai, h.ai_model, h.ai_de_xuat_at
    from public.v_hinh_chua_giai h
    where h.loi_giai_ai is not null
  )
  -- ⚠ create-or-replace-view CHỈ cho NỐI cột ở CUỐI — cột mới (loi_giai_ai…) phải đứng SAU yc_ghi_chu,
  -- nên liệt kê tay cột gốc của k (KHÔNG dùng k.*, k.* sẽ kéo cột mới lên giữa và đổi tên cột cũ → lỗi).
  select k.nhanh, k.key, k.ma, k.khoi, k.nhom_ten, k.nhom_ma, k.nhom_truoc, k.muc_do,
         k.loai_cau, k.de_bai, k.gia_thiet, k.anh, k.lua_chon, k.menh_de, k.dap_an, k.nguon, k.created_at,
         public.fn_giaibai_mon(k.nhanh) as mon,
         y.id as yc_id, y.nguoi_giai as yc_nguoi_giai, y.nguoi_giai_ten as yc_nguoi_giai_ten, y.trang_thai as yc_trang_thai, y.han_at as yc_han_at, y.created_at as yc_created_at, y.ghi_chu as yc_ghi_chu,
         k.loi_giai_ai, k.dap_an_ai, k.ai_model, k.ai_de_xuat_at
  from k
  left join lateral (
    select n.* from public.v_giaibai_nhan n where n.nhanh = k.nhanh and n.key = k.key and n.dang_giu limit 1
  ) y on true;
grant select on public.v_giaibai_bai to authenticated;

-- ═══════════ 7. Đếm / tạo job AI (gác cửa học thuật đúng môn hoặc admin) ═══════════
-- Đếm câu "thiếu thật" (đúng luật 202609061419) NHƯNG CHƯA có đề xuất AI — để Dashboard hiện
-- "N câu chờ AI xử lý" và biết còn cần tạo job hay không. Không gác cửa (chỉ đếm, giống dem_pool).
create or replace function public.fn_giaibai_dem_cho_ai(p_nhanh text[])
returns table (nhanh text, so_cau bigint)
language sql stable as $$
  with k as (
    select 'toan'::text nh, count(*) n from dai_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'toan' = any(p_nhanh)
    union all
    select 'khtn', count(*) from khtn_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'khtn' = any(p_nhanh)
    union all
    select 'hgt', count(*) from hgt_cau_hoi where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null and loi_giai_ai is null and 'hgt' = any(p_nhanh)
    union all
    select 'hinh_baitoan', count(*) from public.v_hinh_chua_giai where loai = 'baitoan' and loi_giai_ai is null and 'hinh_baitoan' = any(p_nhanh)
    union all
    select 'hinh_bien_the', count(*) from public.v_hinh_chua_giai where loai = 'bien_the' and loi_giai_ai is null and 'hinh_bien_the' = any(p_nhanh)
  )
  select nh, n from k where n > 0
$$;
grant execute on function public.fn_giaibai_dem_cho_ai(text[]) to authenticated;

-- Tạo job cho MỌI câu "thiếu thật, chưa có đề xuất AI, chưa có job đang treo" của các nhánh truyền vào.
-- Trả về số job vừa tạo. p_model = null → worker dùng mặc định (env), truyền tay để ép Sonnet/Haiku cụ thể.
create or replace function public.fn_giaibai_ai_tao_job(p_nhanh text[], p_me uuid, p_model text default null)
returns int
language plpgsql as $$
declare v_tong int := 0; v_n int; v_nh text; v_src text;
begin
  if not exists (select 1 from unnest(p_nhanh) x where public.fn_giaibai_la_nguoi_duyet(p_me, x)) then
    raise exception 'Chỉ team học thuật (hoặc admin) mới tạo job AI được.';
  end if;
  foreach v_nh in array p_nhanh loop
    if v_nh in ('toan','khtn','hgt') then
      select src into v_src from public.fn_giaibai_src(v_nh);
      execute format($q$
        insert into public.giaibai_ai_job (nhanh, key, model_chon, nguoi_tao)
        select %2$L, c.ma_cau, $2, $1 from %1$I c
        where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null and c.loi_giai_ai is null
          and not exists (select 1 from public.giaibai_ai_job j where j.nhanh = %2$L and j.key = c.ma_cau and j.trang_thai in ('pending','processing'))
      $q$, v_src, v_nh) using p_me, p_model;
    else
      execute format($q$
        insert into public.giaibai_ai_job (nhanh, key, model_chon, nguoi_tao)
        select %1$L, h.id::text, $2, $1 from public.v_hinh_chua_giai h
        where h.loai = %2$L and h.loi_giai_ai is null
          and not exists (select 1 from public.giaibai_ai_job j where j.nhanh = %1$L and j.key = h.id::text and j.trang_thai in ('pending','processing'))
      $q$, v_nh, case v_nh when 'hinh_baitoan' then 'baitoan' else 'bien_the' end) using p_me, p_model;
    end if;
    get diagnostics v_n = row_count;
    v_tong := v_tong + v_n;
  end loop;
  return v_tong;
end $$;
grant execute on function public.fn_giaibai_ai_tao_job(text[], uuid, text) to authenticated;

-- Xem tiến độ job (chỉ học thuật/admin đúng môn) — cho Dashboard.
create or replace function public.fn_giaibai_ai_job_status(p_nhanh text[], p_me uuid)
returns table (trang_thai text, so_luong bigint)
language plpgsql stable as $$
begin
  if not exists (select 1 from unnest(p_nhanh) x where public.fn_giaibai_la_nguoi_duyet(p_me, x)) then
    raise exception 'Chỉ team học thuật (hoặc admin) mới xem được.';
  end if;
  return query select j.trang_thai, count(*) from public.giaibai_ai_job j where j.nhanh = any(p_nhanh) group by j.trang_thai;
end $$;
grant execute on function public.fn_giaibai_ai_job_status(text[], uuid) to authenticated;
