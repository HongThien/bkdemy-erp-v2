-- ============================================================================
-- THẾ GIỚI BK — tương tác kiểu FACEBOOK (Thùy 29/09: "UX quen thuộc giống FB, đừng bắt học cái mới").
-- Tách lượt "khen" (1 icon + 1 câu gộp) thành 2 việc em đã quen trên FB:
--   ① THẢ CẢM XÚC  = the_gioi_khen (mỗi em 1 cảm xúc / tin · bấm = 👍 Thích · giữ = dải cảm xúc · bấm lại = bỏ)
--   ② BÌNH LUẬN     = the_gioi_binh_luan (câu meme soạn sẵn HOẶC sticker — vẫn KHÔNG chữ tự do, spec §5) · tối đa 3 / em / tin
-- Danh mục thêm: loai 'sticker' · cột `nhan` (tên cảm xúc như FB "Thích", "Yêu thích") · 👍 ❤️ lên đầu dải · câu 'cam_on' chỉ chủ tin dùng.
-- Cột the_gioi_khen.cau_ma THÔI DÙNG (0 dòng lúc áp) — chờ Thùy duyệt xoá cột (luật xoá), tới lúc đó luôn trống.
-- ============================================================================

-- ── Danh mục ─────────────────────────────────────────────────────────────────────────────────────────────────
alter table public.the_gioi_danh_muc drop constraint the_gioi_danh_muc_loai_check;
alter table public.the_gioi_danh_muc add constraint the_gioi_danh_muc_loai_check check (loai in ('icon', 'cau', 'sticker'));
alter table public.the_gioi_danh_muc add column nhan text;   -- tên cảm xúc hiện trên nút (chỉ icon; câu/sticker = không áp dụng)

insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('thich', 'icon', '👍', '{chung}', 1), ('tim', 'icon', '❤️', '{chung}', 2);
update public.the_gioi_danh_muc d set nhan = x.nhan, thu_tu = x.tt from (values
  ('thich','Thích',1), ('tim','Yêu thích',2), ('lua','Cháy',3), ('vo_tay','Vỗ tay',4), ('de_goat','GOAT',5), ('no_nao','Nổ não',6),
  ('cup','Vô địch',7), ('tram_diem','100 điểm',8), ('ten_lua','Bay cao',9), ('set','Tốc độ',10), ('co_bap','Chăm',11), ('nao','Não to',12),
  ('ngau','Ngầu',13), ('chao','Bái phục',14), ('bai_su','Bái sư',15), ('kim_cuong','Hàng hiếm',16), ('ngoi_sao','Ngôi sao',17),
  ('an_mung','Ăn mừng',18), ('hong_tam','Chuẩn',19), ('co_4_la','Xin vía',20), ('tim_tay','Thương',21), ('bat_tay','Tôn trọng',22)
) x(ma, nhan, tt) where d.ma = x.ma;
alter table public.the_gioi_danh_muc add constraint the_gioi_danh_muc_nhan_check check ((loai = 'icon') = (nhan is not null));

-- Sticker TẠM = emoji to (chờ bộ sticker Thùy mua — spec §8); hình thật gắn ở client (gami/hinh.ts) theo mã, không đổi DB.
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('s_lua','sticker','🔥','{chung}',1), ('s_goat','sticker','🐐','{chung}',2), ('s_cup','sticker','🏆','{chung}',3),
  ('s_ten_lua','sticker','🚀','{chung}',4), ('s_no_nao','sticker','🤯','{chung}',5), ('s_chao','sticker','🫡','{chung}',6),
  ('s_bai_su','sticker','🙇','{chung}',7), ('s_an_mung','sticker','🥳','{chung}',8), ('s_100','sticker','💯','{chung}',9),
  ('s_co_4_la','sticker','🍀','{chung}',10), ('s_tra_sua','sticker','🧋','{chung}',11), ('s_co_bap','sticker','💪','{chung}',12);
-- Câu CHỦ TIN trả lời (như FB chủ bài cảm ơn) — người khác không thấy trong danh sách chọn.
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('c60','cau','Cảm ơn mọi người nhiều 🫶','{cam_on}',60), ('c61','cau','Nhờ vía mọi người đó 🍀','{cam_on}',61),
  ('c62','cau','Hẹn gặp lại trên top 😎','{cam_on}',62), ('c63','cau','Lần sau sẽ còn đỉnh hơn 🚀','{cam_on}',63),
  ('c64','cau','Học cùng tớ đi, lên top cùng nhau 🤝','{cam_on}',64);

-- ── Thả cảm xúc: the_gioi_khen chỉ còn icon ────────────────────────────────────────────────────────────────────
alter table public.the_gioi_khen drop constraint the_gioi_khen_check1;
alter table public.the_gioi_khen add constraint the_gioi_khen_hs_co_icon check (ns_id is not null or icon_ma is not null);
alter table public.the_gioi_khen add constraint the_gioi_khen_cau_thoi_dung check (cau_ma is null);
comment on column public.the_gioi_khen.cau_ma is 'THÔI DÙNG từ mig 202609290148 — câu chuyển sang the_gioi_binh_luan. Chờ duyệt xoá cột.';

-- ── Bình luận ──────────────────────────────────────────────────────────────────────────────────────────────────
create table public.the_gioi_binh_luan (
  id          uuid primary key default gen_random_uuid(),
  tin_khoa    text not null check (tin_khoa ~ '^[a-z_]+:'),
  hs_id       uuid not null references public.hoc_sinh(id) on delete cascade,
  noi_dung_ma text not null references public.the_gioi_danh_muc(ma),   -- câu hoặc sticker (không chữ tự do)
  an_at       timestamptz,   -- chủ tin ẩn bình luận này
  go_at       timestamptz,   -- người viết tự gỡ
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index the_gioi_binh_luan_tin_idx on public.the_gioi_binh_luan (tin_khoa, created_at);
create trigger the_gioi_binh_luan_log after insert or update or delete on public.the_gioi_binh_luan for each row execute function public._the_gioi_ghi_log();
alter table public.the_gioi_binh_luan enable row level security;   -- không policy: chỉ qua hàm bên dưới

-- 1 bình luận ra JSON (người viết theo luật tên/mã).
create or replace function public._the_gioi_bl_json(b public.the_gioi_binh_luan, p_me uuid, p_ban uuid[])
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('id', b.id, 'at', b.created_at, 'loai', d.loai, 'ma', d.ma, 'noi_dung', d.noi_dung,
    'nguoi', public._the_gioi_nguoi(b.hs_id, (select ten_lop from public._the_gioi_lop(b.hs_id, null)), b.hs_id = any(p_ban) or b.hs_id = p_me),
    'la_em', b.hs_id = p_me, 'an', b.an_at is not null)
  from the_gioi_danh_muc d where d.ma = b.noi_dung_ma
$$;

-- Tóm tắt tương tác của 1 tin cho thẻ (kiểu FB: "👍❤️🔥 Em, Hà và 12 người khác · 5 bình luận").
create or replace function public._the_gioi_khen_json(p_khoa text, p_me uuid, p_ban uuid[])
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'dem', coalesce((select jsonb_agg(jsonb_build_object('icon', d.noi_dung, 'ma', d.ma, 'nhan', d.nhan, 'so', x.so) order by x.so desc, d.thu_tu)
                     from (select icon_ma, count(*) so from the_gioi_khen where tin_khoa = p_khoa and hs_id is not null and an_at is null group by icon_ma) x
                     join the_gioi_danh_muc d on d.ma = x.icon_ma), '[]'::jsonb),
    'tong', (select count(*) from the_gioi_khen where tin_khoa = p_khoa and hs_id is not null and an_at is null),
    -- 2 tên đứng đầu: em → bạn bè → mới nhất
    'ten', coalesce((select jsonb_agg(jsonb_build_object('la_em', k.hs_id = p_me,
                       'nguoi', public._the_gioi_nguoi(k.hs_id, (select ten_lop from public._the_gioi_lop(k.hs_id, null)), k.hs_id = any(p_ban) or k.hs_id = p_me)))
                     from (select hs_id from the_gioi_khen where tin_khoa = p_khoa and hs_id is not null and an_at is null
                           order by (hs_id = p_me) desc, (hs_id = any(p_ban)) desc, updated_at desc limit 2) k), '[]'::jsonb),
    'cua_toi', (select jsonb_build_object('icon', d.noi_dung, 'icon_ma', d.ma, 'nhan', d.nhan)
                from the_gioi_khen k join the_gioi_danh_muc d on d.ma = k.icon_ma where k.tin_khoa = p_khoa and k.hs_id = p_me),
    'so_bl', (select count(*) from the_gioi_binh_luan where tin_khoa = p_khoa and an_at is null and go_at is null),
    -- 1 bình luận xem trước dưới thẻ: của bạn bè trước, rồi mới nhất
    'bl', (select public._the_gioi_bl_json(b, p_me, p_ban) from the_gioi_binh_luan b
           where b.tin_khoa = p_khoa and b.an_at is null and b.go_at is null
           order by (b.hs_id = any(p_ban)) desc, b.created_at desc limit 1),
    'thay_co', coalesce((select jsonb_agg(split_part(ns.ho_ten, ' ', array_length(string_to_array(ns.ho_ten, ' '), 1)) order by k.created_at)
                         from the_gioi_khen k join nhan_su ns on ns.id = k.ns_id where k.tin_khoa = p_khoa and k.ns_id is not null), '[]'::jsonb))
$$;

-- Tin còn trên Thế giới BK + em có tương tác được không (chung cho thả / bình luận).
create or replace function public._the_gioi_tin_mo(p_khoa text)
returns table (nhom text, thanh_vien uuid[]) language plpgsql stable security definer set search_path = public as $$
begin
  return query select t.nhom, t.thanh_vien from public._the_gioi_tin(now() - interval '30 days') t where t.khoa = p_khoa;
  if not found then raise exception 'Tin không còn trên Thế giới BK'; end if;
end $$;

-- ── ① Thả cảm xúc: p_icon = null ⇒ bỏ (bấm lại nút Thích như FB) ────────────────────────────────────────────────
create or replace function public.fn_the_gioi_tha(p_khoa text, p_icon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_tin record;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới thả cảm xúc được'; end if;
  select * into v_tin from public._the_gioi_tin_mo(p_khoa);
  if v_me = any(v_tin.thanh_vien) then raise exception 'Không tự thả cảm xúc cho tin của mình'; end if;
  if p_icon is null then
    delete from the_gioi_khen where tin_khoa = p_khoa and hs_id = v_me;
  else
    if exists (select 1 from the_gioi_an_tin a where a.tin_khoa = p_khoa and a.an) then raise exception 'Tin đã được chủ tin ẩn'; end if;
    if not exists (select 1 from the_gioi_danh_muc where ma = p_icon and loai = 'icon' and an_at is null) then raise exception 'Cảm xúc không hợp lệ'; end if;
    insert into the_gioi_khen (tin_khoa, hs_id, icon_ma) values (p_khoa, v_me, p_icon)
    on conflict (tin_khoa, hs_id) where hs_id is not null do update set icon_ma = excluded.icon_ma, updated_at = now();
  end if;
  return public._the_gioi_khen_json(p_khoa, v_me, array(select public._ban_be_cua(v_me)));
end $$;

-- ── ② Bình luận: câu hợp loại tin (chủ tin: câu cảm ơn) hoặc sticker · tối đa 3 bình luận còn hiện / em / tin ───────
create or replace function public.fn_the_gioi_binh_luan(p_khoa text, p_ma text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_tin record; v_chu boolean; v_ban uuid[]; v_bl the_gioi_binh_luan;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới bình luận được'; end if;
  select * into v_tin from public._the_gioi_tin_mo(p_khoa);
  v_chu := v_me = any(v_tin.thanh_vien);
  if not v_chu and exists (select 1 from the_gioi_an_tin a where a.tin_khoa = p_khoa and a.an) then raise exception 'Tin đã được chủ tin ẩn'; end if;
  if not exists (select 1 from the_gioi_danh_muc d where d.ma = p_ma and d.an_at is null and (
      d.loai = 'sticker'
      or (d.loai = 'cau' and case when v_chu then 'cam_on' = any(d.nhom) else ('chung' = any(d.nhom) or v_tin.nhom = any(d.nhom)) end))) then
    raise exception 'Câu/sticker không hợp tin này'; end if;
  if (select count(*) from the_gioi_binh_luan where tin_khoa = p_khoa and hs_id = v_me and go_at is null) >= 3 then
    raise exception 'Mỗi tin em bình luận tối đa 3 lần'; end if;
  insert into the_gioi_binh_luan (tin_khoa, hs_id, noi_dung_ma) values (p_khoa, v_me, p_ma) returning * into v_bl;
  v_ban := array(select public._ban_be_cua(v_me));
  return jsonb_build_object('bl', public._the_gioi_bl_json(v_bl, v_me, v_ban), 'khen', public._the_gioi_khen_json(p_khoa, v_me, v_ban));
end $$;

-- Người viết gỡ bình luận của mình · chủ tin ẩn/hiện bình luận trên tin mình.
create or replace function public.fn_the_gioi_go_binh_luan(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_khoa text;
begin
  update the_gioi_binh_luan set go_at = now(), updated_at = now() where id = p_id and hs_id = v_me and go_at is null returning tin_khoa into v_khoa;
  if v_khoa is null then raise exception 'Chỉ gỡ được bình luận của chính em'; end if;
  return public._the_gioi_khen_json(v_khoa, v_me, array(select public._ban_be_cua(v_me)));
end $$;

create or replace function public.fn_the_gioi_an_binh_luan(p_id uuid, p_an boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_khoa text;
begin
  select tin_khoa into v_khoa from the_gioi_binh_luan where id = p_id;
  if v_khoa is null or not exists (select 1 from public._the_gioi_tin(now() - interval '30 days') t where t.khoa = v_khoa and v_me = any(t.thanh_vien)) then
    raise exception 'Chỉ ẩn được bình luận trên tin của chính em'; end if;
  update the_gioi_binh_luan set an_at = case when p_an then now() end, updated_at = now() where id = p_id;
  return public._the_gioi_khen_json(v_khoa, v_me, array(select public._ban_be_cua(v_me)));
end $$;

-- ── Mở 1 tin (tấm bình luận kiểu FB): ai đã thả gì + toàn bộ bình luận ────────────────────────────────────────
-- Chủ tin thấy cả bình luận đã ẩn (mờ, có nút Hiện lại); người khác không thấy.
create or replace function public.fn_the_gioi_chi_tiet(p_khoa text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_tin record; v_chu boolean; v_ban uuid[];
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới xem được Thế giới BK'; end if;
  select * into v_tin from public._the_gioi_tin_mo(p_khoa);
  v_chu := v_me = any(v_tin.thanh_vien);
  v_ban := array(select public._ban_be_cua(v_me));
  return jsonb_build_object(
    'chu_tin', v_chu,
    'tha', coalesce((select jsonb_agg(jsonb_build_object('icon', d.noi_dung, 'icon_ma', d.ma, 'nhan', d.nhan, 'la_em', k.hs_id = v_me, 'la_ban', k.hs_id = any(v_ban),
                       'nguoi', public._the_gioi_nguoi(k.hs_id, (select ten_lop from public._the_gioi_lop(k.hs_id, null)), k.hs_id = any(v_ban) or k.hs_id = v_me))
                       order by (k.hs_id = v_me) desc, (k.hs_id = any(v_ban)) desc, k.updated_at desc)
                     from (select * from the_gioi_khen where tin_khoa = p_khoa and hs_id is not null and an_at is null order by updated_at desc limit 500) k
                     join the_gioi_danh_muc d on d.ma = k.icon_ma), '[]'::jsonb),
    'bl', coalesce((select jsonb_agg(public._the_gioi_bl_json(b, v_me, v_ban) order by b.created_at)
                    from (select * from the_gioi_binh_luan where tin_khoa = p_khoa and go_at is null and (an_at is null or v_chu)
                          order by created_at desc limit 200) b), '[]'::jsonb),
    'khen', public._the_gioi_khen_json(p_khoa, v_me, v_ban));
end $$;

-- Hàm cũ (1 icon + 1 câu) giữ tương thích bản app chưa deploy lại: = thả cảm xúc + 1 bình luận câu.
create or replace function public.fn_the_gioi_khen(p_khoa text, p_icon text, p_cau text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public.fn_the_gioi_tha(p_khoa, p_icon);
  return (public.fn_the_gioi_binh_luan(p_khoa, p_cau))->'khen';
end $$;

-- ── Quyền ──────────────────────────────────────────────────────────────────────────────────────────────────────
revoke execute on function public._the_gioi_bl_json(public.the_gioi_binh_luan, uuid, uuid[]) from public, anon, authenticated;
revoke execute on function public._the_gioi_tin_mo(text) from public, anon, authenticated;
revoke execute on function public.fn_the_gioi_tha(text, text) from public, anon;
revoke execute on function public.fn_the_gioi_binh_luan(text, text) from public, anon;
revoke execute on function public.fn_the_gioi_go_binh_luan(uuid) from public, anon;
revoke execute on function public.fn_the_gioi_an_binh_luan(uuid, boolean) from public, anon;
revoke execute on function public.fn_the_gioi_chi_tiet(text) from public, anon;
grant execute on function public.fn_the_gioi_tha(text, text) to authenticated;
grant execute on function public.fn_the_gioi_binh_luan(text, text) to authenticated;
grant execute on function public.fn_the_gioi_go_binh_luan(uuid) to authenticated;
grant execute on function public.fn_the_gioi_an_binh_luan(uuid, boolean) to authenticated;
grant execute on function public.fn_the_gioi_chi_tiet(text) to authenticated;
