-- CHẤM BTVN TỰ ĐỘNG (Claude) — app trợ giảng. CEO 05–07/11/2026.
-- Luồng: TA chọn lớp → buổi → HS → (ảnh PH đã nộp, hoặc TA tải/dán ảnh) → Edge Function `btvn-cham-ai`
-- gọi Claude → GỢI Ý Đ/C/S từng câu lưu ở bảng NHÁP (btvn_ai_*) → TA xem/sửa → fn_btvn_ai_chot ghi
-- gami_grades (đường chấm cũ, không đẻ hệ thứ 2).
-- Luật §1.5: gợi ý của máy KHÔNG vào gami_grades trước khi TA xác nhận (không "ghi trước sửa sau").
-- Dòng btvn_ai_lan chỉ ra đời khi máy chấm XONG (không có trạng thái "đang chấm"); câu máy không thấy
-- trên ảnh ⇒ KHÔNG có dòng btvn_ai_cau (thiếu = không dòng).
-- Mỗi lần TA xác nhận ghi lại số câu TA sửa so với máy ⇒ dữ liệu đo chất lượng máy chấm tự lớn dần.

-- ── ① TA được tạo lượt nộp bằng ảnh tự chụp (trước đây chỉ PH nộp qua app) ──
alter table btvn_nop drop constraint if exists btvn_nop_nguon_check;
alter table btvn_nop add constraint btvn_nop_nguon_check check (nguon in ('ph_app', 'ta_app'));

-- ── ② Bảng nháp kết quả máy chấm ──
create table if not exists btvn_ai_lan (
  id            uuid primary key default gen_random_uuid(),
  buoi_hoc_id   uuid not null references buoi_hoc(id),
  hoc_sinh_id   uuid not null references hoc_sinh(id),
  model         text not null,
  rule_version  text not null,                 -- phiên bản spec-quy-tac-cham.md dùng lúc chấm
  nhan_xet_chung text,                         -- 1 dòng nhận xét chung gửi PH (máy đề xuất)
  thu_tu_anh    uuid[] not null default '{}',  -- thứ tự ảnh máy đề xuất (id btvn_nop_anh)
  tokens_in     integer,
  tokens_out    integer,
  goi_boi       uuid default public.jwt_uid(),       -- auth user bấm "Chấm tự động"
  created_at    timestamptz not null default now(),
  chot_at       timestamptz,                   -- TA xác nhận ⇒ đã ghi gami_grades
  chot_boi      uuid,
  so_cau_sua    integer                        -- số câu TA đổi kết quả so với máy (đo chất lượng)
);
create index if not exists btvn_ai_lan_hs_buoi on btvn_ai_lan (buoi_hoc_id, hoc_sinh_id, created_at desc);

create table if not exists btvn_ai_cau (
  lan_id      uuid not null references btvn_ai_lan(id),
  problem_id  uuid not null references gami_session_problems(id),
  result      text not null check (result in ('correct', 'partial', 'wrong')),
  chac        boolean not null,                -- false ⇒ app tô vàng, TA phải xem
  loai_loi    text,                            -- nhóm lỗi theo spec §A5 (chỉ gán khi chắc)
  nhan_xet    text,                            -- 1 dòng: "<lỗi> vì: <lý do>. Đúng: <đáp án>"
  primary key (lan_id, problem_id)
);

alter table btvn_ai_lan enable row level security;
alter table btvn_ai_cau enable row level security;
drop policy if exists btvn_ai_lan_member_read on btvn_ai_lan;
create policy btvn_ai_lan_member_read on btvn_ai_lan for select to authenticated using (public.la_thanh_vien());
drop policy if exists btvn_ai_cau_member_read on btvn_ai_cau;
create policy btvn_ai_cau_member_read on btvn_ai_cau for select to authenticated using (public.la_thanh_vien());
-- Ghi CHỈ qua 2 RPC dưới (security definer, tự kiểm la_thanh_vien) — không mở insert/update trực tiếp.

-- ── ③ Dữ liệu cho máy chấm: câu trong lưới BTVN (+ đề/đáp án/lời giải kho) + ảnh theo thứ tự ──
create or replace function public.fn_btvn_ai_du_lieu(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select jsonb_build_object(
    'lop', l.ten_lop, 'khoi', l.khoi, 'mon', l.mon, 'ngay', b.ngay,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'problem_id', sp.id, 'so', sp.problem_no, 'ma_cau', sp.ma_cau, 'ma_dang', sp.ma_dang,
        'hinh', sp.hinh_baitoan_id is not null, 'hinh_nhan', sp.hinh_nhan,
        'loai_cau', coalesce(d.loai_cau, k.loai_cau),
        'de_bai', coalesce(d.noi_dung, k.noi_dung),
        'lua_chon', coalesce(d.lua_chon, k.lua_chon),
        'menh_de', coalesce(d.menh_de, k.menh_de),
        'dap_an', coalesce(d.dap_an, k.dap_an),
        'loi_giai', coalesce(d.loi_giai, k.loi_giai)) order by sp.problem_no)
      from gami_session_problems sp
      left join dai_cau_hoi d on l.mon = 'Toán' and d.ma_cau = sp.ma_cau
      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau
      where sp.buoi_hoc_id = b.id and sp.phase = 'btvn' and not sp.ngoai_de), '[]'::jsonb),
    'anh', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'path', a.path) order by a.thu_tu, a.created_at)
      from btvn_nop_anh a where a.buoi_hoc_id = b.id and a.hoc_sinh_id = p_hoc_sinh_id), '[]'::jsonb))
  into v
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.id = p_buoi_hoc_id;
  if v is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  return v;
end $$;
revoke execute on function public.fn_btvn_ai_du_lieu(uuid, uuid) from public, anon;
grant execute on function public.fn_btvn_ai_du_lieu(uuid, uuid) to authenticated;

-- ── ④ Ghi kết quả máy chấm (1 transaction: lần chấm + từng câu + thứ tự ảnh) ──
-- p_cau: [{problem_id, result, chac, loai_loi, nhan_xet}] — câu không có trên ảnh thì máy không gửi.
create or replace function public.fn_btvn_ai_ghi(
  p_buoi_hoc_id uuid, p_hoc_sinh_id uuid, p_model text, p_rule_version text,
  p_nhan_xet_chung text, p_thu_tu_anh uuid[], p_cau jsonb, p_tokens_in integer, p_tokens_out integer)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  insert into btvn_ai_lan (buoi_hoc_id, hoc_sinh_id, model, rule_version, nhan_xet_chung, thu_tu_anh, tokens_in, tokens_out)
  values (p_buoi_hoc_id, p_hoc_sinh_id, p_model, p_rule_version, nullif(trim(p_nhan_xet_chung), ''),
          coalesce(p_thu_tu_anh, '{}'), p_tokens_in, p_tokens_out)
  returning id into v_id;

  insert into btvn_ai_cau (lan_id, problem_id, result, chac, loai_loi, nhan_xet)
  select v_id, (c->>'problem_id')::uuid, c->>'result', coalesce((c->>'chac')::boolean, false),
         nullif(trim(c->>'loai_loi'), ''), nullif(trim(c->>'nhan_xet'), '')
  from jsonb_array_elements(coalesce(p_cau, '[]'::jsonb)) c
  join gami_session_problems sp on sp.id = (c->>'problem_id')::uuid
   and sp.buoi_hoc_id = p_buoi_hoc_id and sp.phase = 'btvn';   -- chỉ nhận câu thuộc đúng lưới BTVN buổi này

  -- Thứ tự ảnh máy đề xuất: thu_tu chỉ để HIỂN THỊ (danh tính ảnh = id) ⇒ đổi được an toàn.
  if p_thu_tu_anh is not null and array_length(p_thu_tu_anh, 1) > 0 then
    update btvn_nop_anh a set thu_tu = t.ord
    from unnest(p_thu_tu_anh) with ordinality as t(id, ord)
    where a.id = t.id and a.buoi_hoc_id = p_buoi_hoc_id and a.hoc_sinh_id = p_hoc_sinh_id;
  end if;
  return v_id;
end $$;
revoke execute on function public.fn_btvn_ai_ghi(uuid, uuid, text, text, text, uuid[], jsonb, integer, integer) from public, anon;
grant execute on function public.fn_btvn_ai_ghi(uuid, uuid, text, text, text, uuid[], jsonb, integer, integer) to authenticated;

-- ── ⑤ TA xác nhận: ghi Đ/C/S cuối cùng vào gami_grades + nhận xét từng câu, đếm số câu TA sửa ──
-- p_items: [{problem_id, result, nhan_xet}] — kết quả TA chốt (có thể khác máy). Câu TA bỏ trống thì không gửi.
create or replace function public.fn_btvn_ai_chot(p_lan_id uuid, p_items jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare l record; v_sua integer;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select * into l from btvn_ai_lan where id = p_lan_id for update;
  if l is null then raise exception 'Không thấy lần chấm %', p_lan_id; end if;
  if exists (select 1 from buoi_hoc where id = l.buoi_hoc_id and btvn_dong_at is not null) then
    raise exception 'BTVN buổi này đã đóng — mở lại rồi mới xác nhận được.';
  end if;

  insert into gami_grades (buoi_hoc_id, problem_id, hoc_sinh_id, result, presentation, speed, points, loi, graded_by, nhan_xet)
  select l.buoi_hoc_id, sp.id, l.hoc_sinh_id, i->>'result', 'clean', 'normal',
         case i->>'result' when 'correct' then 100 when 'partial' then 50 else 0 end,
         '[]'::jsonb, public.jwt_uid(), nullif(trim(i->>'nhan_xet'), '')
  from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) i
  join gami_session_problems sp on sp.id = (i->>'problem_id')::uuid
   and sp.buoi_hoc_id = l.buoi_hoc_id and sp.phase = 'btvn'
  where i->>'result' in ('correct', 'partial', 'wrong')
  on conflict (problem_id, hoc_sinh_id) do update
    set result = excluded.result, points = excluded.points, graded_by = excluded.graded_by,
        graded_at = now(), nhan_xet = excluded.nhan_xet;

  -- số câu TA sửa = câu máy có gợi ý mà TA chốt khác (hoặc bỏ trống) + câu TA chấm thêm mà máy không có
  select count(*) into v_sua from (
    select coalesce(c.problem_id, (i->>'problem_id')::uuid) pid
    from (select * from btvn_ai_cau where lan_id = p_lan_id) c
    full join jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) i
      on (i->>'problem_id')::uuid = c.problem_id
    where c.problem_id is null or i is null or c.result is distinct from i->>'result'
  ) x;

  update btvn_ai_lan set chot_at = now(), chot_boi = public.jwt_uid(), so_cau_sua = v_sua where id = p_lan_id;
  return v_sua;
end $$;
revoke execute on function public.fn_btvn_ai_chot(uuid, jsonb) from public, anon;
grant execute on function public.fn_btvn_ai_chot(uuid, jsonb) to authenticated;

-- ── ⑥ TA tạo/bổ sung lượt nộp bằng ảnh tự chụp/dán (HS không nộp qua app PH) ──
-- Mirror fn_btvn_nop_tao (đường PH) nhưng cho nhân sự: nguon = 'ta_app' khi lượt nộp mới.
create or replace function public.fn_btvn_nop_ta_them(p_hoc_sinh_id uuid, p_buoi_hoc_id uuid, p_paths text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_max integer; v_new boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  if p_paths is null or array_length(p_paths, 1) is null then
    raise exception 'Phải có ít nhất 1 ảnh.';
  end if;
  if exists (select 1 from btvn_nop n where n.hoc_sinh_id = p_hoc_sinh_id and n.buoi_hoc_id = p_buoi_hoc_id
             and n.tra_at is not null) then
    raise exception 'Bài đã trả cho phụ huynh — không bổ sung ảnh được nữa.';
  end if;
  -- TA tự chọn buổi rồi mới tải ảnh ⇒ buổi đã chốt luôn (không phải "hệ gán tạm" như đường PH).
  insert into btvn_nop (hoc_sinh_id, buoi_hoc_id, nguon, buoi_xac_nhan_at, buoi_xac_nhan_boi)
  values (p_hoc_sinh_id, p_buoi_hoc_id, 'ta_app', now(), public.current_nhan_su_id())
  on conflict (hoc_sinh_id, buoi_hoc_id) do nothing;
  get diagnostics v_max = row_count; v_new := v_max > 0;
  select coalesce(max(thu_tu), 0) into v_max from btvn_nop_anh
  where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id;
  insert into btvn_nop_anh (hoc_sinh_id, buoi_hoc_id, path, thu_tu)
  select p_hoc_sinh_id, p_buoi_hoc_id, u, v_max + ord from unnest(p_paths) with ordinality as t(u, ord);
  return jsonb_build_object('moi', v_new, 'so_anh_them', array_length(p_paths, 1));
end $$;
revoke execute on function public.fn_btvn_nop_ta_them(uuid, uuid, text[]) from public, anon;
grant execute on function public.fn_btvn_nop_ta_them(uuid, uuid, text[]) to authenticated;

-- ── ⑦ Lớp cho màn "Chấm BTVN tự động": lớp TA đang đăng nhập phụ trách (phan_cong_lop vai trò tg)
--      lên đầu, rồi các lớp đang học khác (TA chấm hộ lớp khác vẫn được).
create or replace function public.fn_btvn_ai_lop_cua_toi()
returns table (lop_id uuid, ten_lop text, mon text, khoi text, phu_trach boolean)
language sql stable security definer set search_path = public as $$
  select l.id, l.ten_lop, l.mon, l.khoi,
         exists (select 1 from phan_cong_lop pc where pc.lop_id = l.id and pc.vai_tro = 'tg'
                 and pc.nhan_su_id = public.current_nhan_su_id()) as phu_trach
  from lop l
  where l.trang_thai = 'dang_hoc' and public.la_thanh_vien()
  order by 5 desc, l.mon, nullif(regexp_replace(l.ten_lop, '\D.*$', ''), '')::int nulls last, l.ten_lop
$$;
revoke execute on function public.fn_btvn_ai_lop_cua_toi() from public, anon;
grant execute on function public.fn_btvn_ai_lop_cua_toi() to authenticated;
