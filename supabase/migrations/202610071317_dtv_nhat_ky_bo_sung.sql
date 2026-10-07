-- ============================================================================
-- 202610071317 — dtv_nhat_ky_bo_sung   (áp: `node scripts/migrate.mjs --only 202610071317_dtv_nhat_ky_bo_sung.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (P1 tiếp — Thùy 07/10 "thông tin mọi thứ đi theo tài khoản học sinh" + "ghi lại mọi thứ"):
--   ① dtv_cau_log thiếu ĐÁP ÁN ĐÚNG và id TỪ tiếng Anh ⇒ thêm dap_an, tu_id (đọc lại được câu đã ghi dù kho đổi; dựng lại sổ nhớ từ về sau).
--   ② SỔ NHỚ TỪ (Leitner, mức nhớ từng từ) đang lưu ở localStorage THEO MÁY ⇒ đổi máy mất, nhiều em dùng chung máy trộn nhau. Nay lưu THEO TÀI KHOẢN:
--      dtv_nguoi_choi.so_nho (jsonb) + fn_dtv_so_nho_luu; fn_dtv_ho_so_hs trả kèm so_nho. LƯU Ý: đây mới là bản SAO lưu trạng thái do game tính (tạm); tính mức nhớ ở Postgres
--      từ dtv_cau_log (CLAUDE §2.0) là việc Phase 2 cùng với chấm ở máy chủ.
-- MẤT GÌ: không xoá dữ liệu. Thay thân 2 hàm của chính mig 202610071314 (fn_dtv_ghi_cau thêm 2 trường; fn_dtv_ho_so_hs trả thêm so_nho).
-- ============================================================================

alter table dtv_cau_log add column if not exists dap_an text;       -- văn bản đáp án ĐÚNG lúc ghi
alter table dtv_cau_log add column if not exists tu_id text;        -- tiếng Anh: id từ trong kho từ
create index if not exists dtv_cau_log_tu_idx on dtv_cau_log (hoc_sinh_id, tu_id) where tu_id is not null;
alter table dtv_nguoi_choi add column if not exists so_nho jsonb not null default '{}'::jsonb;
comment on column dtv_nguoi_choi.so_nho is 'Sổ nhớ từ tiếng Anh (Leitner) theo TÀI KHOẢN — bản sao trạng thái do game tính; về sau suy từ dtv_cau_log.';

create or replace function public.fn_dtv_ghi_cau(p_uid text, p_mon text, p_che_do text, p_chu_de text, p_tran_id uuid, p_luot_id uuid, p_cau jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare v_n integer;
begin
  perform public._dtv_kiem_uid(p_uid);
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  if jsonb_typeof(p_cau) <> 'array' then raise exception 'Dữ liệu không hợp lệ'; end if;
  if p_che_do not in ('bot', 'doi', 'mang', 'giai', 'on_tap', 'noi_tu', 'song_con', 'vo_tan') then raise exception 'Chế độ không hợp lệ'; end if;
  if p_tran_id is not null and not exists (select 1 from dtv_tran where id = p_tran_id and uid = p_uid) then raise exception 'Trận không thuộc về em'; end if;
  if p_luot_id is not null and not exists (select 1 from dtv_thap_luot where id = p_luot_id and uid = p_uid) then raise exception 'Lượt không thuộc về em'; end if;
  insert into dtv_cau_log (uid, tran_id, luot_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, tu_id, de, dap_an, tra_loi, dung, ms)
  select p_uid, p_tran_id, p_luot_id, coalesce(nullif(p_mon, ''), 'Tiếng Anh'), p_che_do, coalesce(p_chu_de, ''),
         coalesce((e->>'thu_tu')::int, 0), nullif(e->>'ma_cau', ''), nullif(e->>'cau_id', ''), nullif(e->>'tu_id', ''), left(e->>'de', 500), left(e->>'dap_an', 300),
         left(coalesce(e->>'tra_loi', ''), 300), coalesce((e->>'dung')::boolean, false), least(greatest(coalesce((e->>'ms')::int, 0), 0), 600000)
  from (select e from jsonb_array_elements(p_cau) e limit 80) x(e);
  get diagnostics v_n = row_count;
  return v_n;
end $$;
revoke all on function public.fn_dtv_ghi_cau(text, text, text, text, uuid, uuid, jsonb) from public;
grant execute on function public.fn_dtv_ghi_cau(text, text, text, text, uuid, uuid, jsonb) to anon, authenticated;

-- Lưu sổ nhớ từ của em (chỉ hồ sơ hs_*; ≤ 300KB)
create or replace function public.fn_dtv_so_nho_luu(p_uid text, p_nho jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public._dtv_kiem_uid(p_uid);
  if left(coalesce(p_uid, ''), 3) <> 'hs_' then raise exception 'Chỉ lưu sổ nhớ cho tài khoản học sinh.'; end if;
  if jsonb_typeof(p_nho) <> 'object' then raise exception 'Dữ liệu không hợp lệ'; end if;
  if octet_length(p_nho::text) > 300000 then raise exception 'Sổ nhớ quá lớn'; end if;
  update dtv_nguoi_choi set so_nho = p_nho, cap_nhat_at = now() where uid = p_uid;
end $$;
revoke all on function public.fn_dtv_so_nho_luu(text, jsonb) from public, anon;
grant execute on function public.fn_dtv_so_nho_luu(text, jsonb) to authenticated;

-- Hồ sơ của em (tự tạo lần đầu) — trả kèm sổ nhớ
create or replace function public.fn_dtv_ho_so_hs(p_nv text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); v_uid text; h hoc_sinh%rowtype; v_ma text; v_nv text; v_ten text; v_nho jsonb;
begin
  if v_hs is null then raise exception 'Chỉ học sinh đăng nhập mới dùng được.'; end if;
  v_uid := 'hs_' || v_hs::text;
  if not exists (select 1 from dtv_nguoi_choi where uid = v_uid) then
    select * into h from hoc_sinh where id = v_hs;
    v_nv := case when p_nv in ('tham_hiem_nam', 'tham_hiem_nu', 'hiep_si_dem', 'phap_su') then p_nv when h.gioi_tinh = 'nu' then 'tham_hiem_nu' else 'tham_hiem_nam' end;
    v_ten := (select string_agg(w, ' ' order by o) from (select w, o from regexp_split_to_table(btrim(h.ho_ten), '\s+') with ordinality t(w, o) order by o desc limit 2) z);
    loop
      v_ma := 'BK-' || lpad((floor(random() * 100000))::int::text, 5, '0');
      exit when not exists (select 1 from dtv_nguoi_choi where ma = v_ma);
    end loop;
    insert into dtv_nguoi_choi (uid, ma, ten, nv, hoc_sinh_id) values (v_uid, v_ma, coalesce(nullif(v_ten, ''), 'Học sinh'), v_nv, v_hs);
  end if;
  select so_nho into v_nho from dtv_nguoi_choi where uid = v_uid;
  return jsonb_build_object('uid', v_uid, 'ho_so', public._dtv_ho_so_json(v_uid), 'so_nho', coalesce(v_nho, '{}'::jsonb));
end $$;
revoke all on function public.fn_dtv_ho_so_hs(text) from public, anon;
grant execute on function public.fn_dtv_ho_so_hs(text) to authenticated;
