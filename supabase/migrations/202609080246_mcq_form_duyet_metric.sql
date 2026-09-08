-- MCQ FORM M2 — RPC cho tab "Trắc nghiệm AI" (màn Duyệt lời giải AI) + metric. Spec: spec-mcq-form.md §6, §7.
-- Dispatch theo TIỀN TỐ kho p_kho ∈ ('dai','khtn','hgt') — cùng khái niệm KhoMon ở src/lib/kho/api.ts (toan→dai).
-- Bảng <kho>_cau_form_tn CHƯA có (khtn/hgt) ⇒ list trả RỖNG (to_regclass), không nổ — tab hiện "không có câu" là đúng.
-- Ghi (duyệt/từ chối) vào bảng chưa có ⇒ nổ to, đúng ý (không có gì để duyệt).

alter table dai_cau_form_tn add column if not exists tu_choi_boi uuid references nhan_su(id);

create or replace function public._mcq_kiem_kho(p_kho text) returns void
language plpgsql immutable as $$
begin
  if p_kho not in ('dai', 'khtn', 'hgt') then raise exception 'p_kho phải là dai/khtn/hgt (đang %)', p_kho; end if;
end $$;

-- ── Danh sách form (mặc định: chưa duyệt) của 1 kho, lọc khối ở DB (PostgREST không filter được quan hệ lồng) ──
create or replace function public.fn_mcq_form_cho_duyet(p_kho text, p_khoi text default null, p_da_duyet boolean default false)
returns table (
  id uuid, ma_cau text, dang_chinh text, ten_dang text, khoi text, noi_dung text, anh_de text, loi_giai text,
  dap_an_kho text, lua_chon jsonb, dap_an text, key_gia_tri text, ai_model text, sinh_at timestamptz,
  da_duyet boolean, sua_truoc_duyet boolean)
language plpgsql stable as $$
begin
  perform public._mcq_kiem_kho(p_kho);
  if to_regclass(p_kho || '_cau_form_tn') is null then return; end if;
  return query execute format($q$
    select f.id, f.ma_cau, q.dang_chinh, b.ten_dang, b.khoi, q.noi_dung, q.anh_de, q.loi_giai,
           q.dap_an, f.lua_chon, f.dap_an, f.key_gia_tri, f.ai_model, f.sinh_at, f.da_duyet, f.sua_truoc_duyet
    from %1$I f join %2$I q on q.ma_cau = f.ma_cau join %3$I b on b.ma_dang = q.dang_chinh
    where f.xoa_at is null and f.da_duyet = $1 and ($2::text is null or b.khoi = $2)
    order by q.dang_chinh, f.ma_cau
    limit 500
  $q$, p_kho || '_cau_form_tn', p_kho || '_cau_hoi', p_kho || '_ban_do') using p_da_duyet, p_khoi;
end $$;
grant execute on function public.fn_mcq_form_cho_duyet(text, text, boolean) to authenticated;

-- ── Duyệt: p_lua_chon ≠ null và KHÁC bản đang lưu ⇒ ghi đè + sua_truoc_duyet=true (metric). Trigger kiểm lại cấu trúc. ──
create or replace function public.fn_mcq_form_duyet(p_kho text, p_id uuid, p_nguoi uuid, p_lua_chon jsonb default null)
returns void language plpgsql as $$
declare v_cu jsonb; v_sua boolean;
begin
  perform public._mcq_kiem_kho(p_kho);
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  execute format('select lua_chon from %I where id = $1 and xoa_at is null and not da_duyet for update', p_kho || '_cau_form_tn')
    into v_cu using p_id;
  if v_cu is null then raise exception 'Form không tồn tại / đã duyệt / đã bị từ chối'; end if;
  v_sua := p_lua_chon is not null and p_lua_chon <> v_cu;
  execute format($q$update %I set lua_chon = coalesce($2, lua_chon), da_duyet = true, duyet_boi = $3, duyet_at = now(),
                     sua_truoc_duyet = $4 where id = $1$q$, p_kho || '_cau_form_tn')
    using p_id, p_lua_chon, p_nguoi, v_sua;
end $$;
grant execute on function public.fn_mcq_form_duyet(text, uuid, uuid, jsonb) to authenticated;

-- ── Từ chối = kho rác (xoa_at), giữ dòng để soát; câu quay lại pool để sinh lại (query pool lọc xoa_at is null). ──
create or replace function public.fn_mcq_form_tu_choi(p_kho text, p_id uuid, p_nguoi uuid, p_ly_do text)
returns void language plpgsql as $$
declare v_n int;
begin
  perform public._mcq_kiem_kho(p_kho);
  if p_nguoi is null then raise exception 'Thiếu người từ chối'; end if;
  if coalesce(trim(p_ly_do), '') = '' then raise exception 'Từ chối phải có lý do'; end if;
  execute format('update %I set xoa_at = now(), tu_choi_boi = $2, tu_choi_ly_do = $3 where id = $1 and xoa_at is null and not da_duyet',
                 p_kho || '_cau_form_tn') using p_id, p_nguoi, p_ly_do;
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Form không tồn tại / đã duyệt / đã bị từ chối'; end if;
end $$;
grant execute on function public.fn_mcq_form_tu_choi(text, uuid, uuid, text) to authenticated;

-- ── Metric (spec §7) — lọc theo sinh_at trong [p_tu, p_den] nếu truyền ──
--   precision = duyệt KHÔNG sửa / (duyệt + từ chối) · ti_le_sua = sửa / duyệt · ly_do_tu_choi gom theo text ·
--   phan_bo = vị trí đúng của form hiệu lực · do_lua = form có ≥30 lượt làm: số lượt chọn từng phương án.
create or replace function public.fn_mcq_metric(p_kho text, p_tu date default null, p_den date default null)
returns jsonb language plpgsql stable as $$
declare v jsonb;
begin
  perform public._mcq_kiem_kho(p_kho);
  if to_regclass(p_kho || '_cau_form_tn') is null then return '{}'::jsonb; end if;
  execute format($q$
    with f as (
      select * from %1$I
      where ($1::date is null or (sinh_at at time zone 'Asia/Ho_Chi_Minh')::date >= $1)
        and ($2::date is null or (sinh_at at time zone 'Asia/Ho_Chi_Minh')::date <= $2)
    ),
    tk as (
      select count(*)::int tong,
             count(*) filter (where xoa_at is null and not da_duyet)::int cho_duyet,
             count(*) filter (where da_duyet)::int duyet,
             count(*) filter (where da_duyet and not sua_truoc_duyet)::int duyet_khong_sua,
             count(*) filter (where da_duyet and sua_truoc_duyet)::int sua,
             count(*) filter (where xoa_at is not null and not da_duyet)::int tu_choi
      from f
    ),
    ld as (
      select coalesce(jsonb_agg(jsonb_build_object('ly_do', ly_do, 'n', n) order by n desc), '[]'::jsonb) j
      from (select tu_choi_ly_do ly_do, count(*)::int n from f where xoa_at is not null and tu_choi_ly_do is not null group by 1) s
    ),
    pb as (
      select coalesce(jsonb_object_agg(dap_an, n), '{}'::jsonb) j
      from (select dap_an, count(*)::int n from f where xoa_at is null group by 1) s
    ),
    dl as (
      select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'luot', luot, 'chon', chon) order by luot desc), '[]'::jsonb) j
      from (
        select f.ma_cau, count(blc.id)::int luot,
               jsonb_build_array(
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 0),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 1),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 2),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 3)) chon
        from f
        join bai_test_cau btc on btc.form_tn_id = f.id
        join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and jsonb_typeof(blc.dap_an_hs) = 'number'
        group by f.ma_cau
        having count(blc.id) >= 30
      ) s
    )
    select jsonb_build_object(
      'tong', tk.tong, 'cho_duyet', tk.cho_duyet, 'duyet', tk.duyet, 'duyet_khong_sua', tk.duyet_khong_sua,
      'sua', tk.sua, 'tu_choi', tk.tu_choi,
      'precision', case when tk.duyet + tk.tu_choi = 0 then null else round(tk.duyet_khong_sua::numeric / (tk.duyet + tk.tu_choi), 3) end,
      'ti_le_sua', case when tk.duyet = 0 then null else round(tk.sua::numeric / tk.duyet, 3) end,
      'ly_do_tu_choi', ld.j, 'phan_bo', pb.j, 'do_lua', dl.j)
    from tk, ld, pb, dl
  $q$, p_kho || '_cau_form_tn') into v using p_tu, p_den;
  return v;
end $$;
grant execute on function public.fn_mcq_metric(text, date, date) to authenticated;

-- Danh sách rule của kho (cho select trong tab duyệt) — rỗng nếu kho chưa có bảng rule.
create or replace function public.fn_mcq_rule(p_kho text)
returns table (ma text, ten text, nhom text, du_phong boolean)
language plpgsql stable as $$
begin
  perform public._mcq_kiem_kho(p_kho);
  if to_regclass(p_kho || '_mcq_rule') is null then return; end if;
  return query execute format('select ma, ten, nhom, du_phong from %I where active order by ma', p_kho || '_mcq_rule');
end $$;
grant execute on function public.fn_mcq_rule(text) to authenticated;
