-- ============================================================================
-- TRẢ LỜI BÁO LỖI / GÓP Ý CỦA HỌC SINH NGAY TRONG HÒM THƯ ERP ⇒ VỀ HÒM THƯ CỦA EM (Thùy 10/11: "có hòm thư của học sinh để t và Hải phản hồi").
-- (1) hom_thu.bao_loi_id: thư nào sinh từ báo lỗi của HS thì gắn đúng báo lỗi đó (NULL = thư khác, không áp dụng) ⇒ ERP mở thư là thấy
--     ô trả lời. Trigger mig 202611101726 sửa lại để ghi cột này.
-- (2) bao_loi_tra_loi: CHUỖI trả lời (trả lời nhiều lần, ai trả lời, lúc nào) — trước đây chỉ 1 ô bao_loi.tra_loi, lần sau đè lần trước.
--     bao_loi.tra_loi/tra_loi_at giữ = lời MỚI NHẤT (màn Góp ý của em + BaoLoiScreen đang đọc), tra_loi_doc_at về NULL ⇒ em thấy dấu "Mới".
-- (3) fn_bao_loi_tra_loi (giữ chữ ký cũ, BaoLoiScreen dùng chung): thêm dòng chuỗi + 1 TIN vào hòm thư em (hs_tin_moi, hiện ở chuông
--     Hòm thư app HS có tiêu đề + trích lời em đã viết). Bỏ thong_bao_hs cũ (dòng chữ trần, trùng tin).
-- (4) fn_bao_loi_luong: đọc 1 báo lỗi + chuỗi trả lời cho ô trả lời trong hòm thư ERP (chỉ nhân sự).
-- ============================================================================

alter table public.hom_thu add column if not exists bao_loi_id uuid references public.bao_loi(id) on delete set null;
create index if not exists hom_thu_bao_loi_idx on public.hom_thu (bao_loi_id) where bao_loi_id is not null;

create table if not exists public.bao_loi_tra_loi (
  id         uuid primary key default gen_random_uuid(),
  bao_loi_id uuid not null references public.bao_loi(id) on delete cascade,
  nhan_su_id uuid references public.nhan_su(id),
  noi_dung   text not null check (length(btrim(noi_dung)) between 2 and 600),
  created_at timestamptz not null default clock_timestamp()   -- nhiều lời trong 1 giao dịch vẫn đúng thứ tự
);
create index if not exists bao_loi_tra_loi_bl_idx on public.bao_loi_tra_loi (bao_loi_id, created_at);
alter table public.bao_loi_tra_loi enable row level security;
drop policy if exists bao_loi_tra_loi_staff on public.bao_loi_tra_loi;
create policy bao_loi_tra_loi_staff on public.bao_loi_tra_loi for select to authenticated using ((select public.la_thanh_vien()));

-- (1) trigger gửi thư: như mig 202611101726, thêm bao_loi_id
create or replace function public._bao_loi_hs_gui_hom_thu() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  v_ten text := coalesce(new.context->>'ho_ten', (select h.ho_ten from hoc_sinh h where h.id = new.hoc_sinh_id), 'Học sinh');
  v_ma  text := coalesce(new.context->>'ma_hs', (select h.ma_hs from hoc_sinh h where h.id = new.hoc_sinh_id), '');
  v_tieu text; v_noi text;
begin
  if new.hoc_sinh_id is null then return new; end if;
  v_tieu := case when new.loai = 'bug' then '🐞 HS báo lỗi: ' else '💡 HS góp ý: ' end || v_ten || case when v_ma <> '' then ' (' || v_ma || ')' else '' end;
  v_noi := concat_ws(E'\n',
    new.mo_ta,
    '',
    concat_ws(' · ',
      nullif('Khối ' || coalesce(new.context->>'khoi', ''), 'Khối '),
      nullif(coalesce(new.context->>'mon', ''), ''),
      nullif('Màn: ' || coalesce(new.context->>'man', new.route, ''), 'Màn: '),
      case when (new.context->>'man_rong') is not null then (new.context->>'man_rong') || '×' || (new.context->>'man_cao') end),
    case when new.anh_url is not null then 'Ảnh: ' || new.anh_url end);
  begin
    insert into hom_thu (nhan_su_id, loai, tieu_de, noi_dung, lien_ket, tu_nhan_su, bao_loi_id)
    select r.nhan_su_id, 'he_thong', v_tieu, nullif(btrim(v_noi), ''), 'baoloi', null, new.id from bao_loi_hs_nhan_thu r;
  exception when others then
    raise warning 'bao_loi % gửi hòm thư lỗi: %', new.id, sqlerrm;   -- em vẫn gửi báo lỗi được
  end;
  return new;
end $$;
revoke all on function public._bao_loi_hs_gui_hom_thu() from public, anon;

-- (3) trả lời: chuỗi + tin vào hòm thư em
create or replace function public.fn_bao_loi_tra_loi(p_id uuid, p_noi_dung text)
returns void
language plpgsql security definer set search_path to 'public' as $$
declare v_bl bao_loi; v_nd text := btrim(coalesce(p_noi_dung, '')); v_tl uuid;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự được trả lời góp ý.'; end if;
  if length(v_nd) < 2 or length(v_nd) > 600 then raise exception 'Lời trả lời 2–600 chữ.'; end if;
  select * into v_bl from bao_loi where id = p_id for update;
  if not found then raise exception 'Không thấy góp ý này.'; end if;
  insert into bao_loi_tra_loi (bao_loi_id, nhan_su_id, noi_dung) values (p_id, public.current_nhan_su_id(), v_nd) returning id into v_tl;
  update bao_loi set tra_loi = v_nd, tra_loi_at = now(), tra_loi_boi = public.jwt_uid(), tra_loi_doc_at = null where id = p_id;
  if v_bl.hoc_sinh_id is not null then
    insert into hs_tin_moi (hoc_sinh_id, loai, tieu_de, noi_dung, bieu_tuong, ref)
    values (v_bl.hoc_sinh_id, 'gop_y',
      'Thầy cô đã trả lời ' || case when v_bl.loai = 'bug' then 'báo lỗi' else 'góp ý' end || ' của em',
      v_nd || E'\n\nEm đã viết: "' || left(btrim(v_bl.mo_ta), 140) || case when length(btrim(v_bl.mo_ta)) > 140 then '…' else '' end || '"',
      '💬', 'gop_y_tra_loi:' || v_tl::text);
  end if;
end $$;
revoke all on function public.fn_bao_loi_tra_loi(uuid, text) from public, anon;
grant execute on function public.fn_bao_loi_tra_loi(uuid, text) to authenticated;

-- (4) đọc 1 báo lỗi + chuỗi trả lời (ô trả lời trong hòm thư ERP)
create or replace function public.fn_bao_loi_luong(p_id uuid)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự xem được.'; end if;
  return (
    select jsonb_build_object('id', b.id, 'loai', b.loai, 'mo_ta', b.mo_ta, 'created_at', b.created_at, 'anh_url', b.anh_url,
      'ten_hs', h.ho_ten, 'ma_hs', h.ma_hs, 'em_da_doc', b.tra_loi_doc_at is not null,
      'tra_loi', coalesce((select jsonb_agg(jsonb_build_object('noi_dung', t.noi_dung, 'created_at', t.created_at, 'ho_ten', n.ho_ten) order by t.created_at)
                           from bao_loi_tra_loi t left join nhan_su n on n.id = t.nhan_su_id where t.bao_loi_id = b.id), '[]'::jsonb))
    from bao_loi b left join hoc_sinh h on h.id = b.hoc_sinh_id where b.id = p_id);
end $$;
revoke all on function public.fn_bao_loi_luong(uuid) from public, anon;
grant execute on function public.fn_bao_loi_luong(uuid) to authenticated;
