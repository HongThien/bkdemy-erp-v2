-- ĐỢT 2 — BƯỚC 2 (13/11/2026): BẢNG TRA SẴN "câu thuộc dạng bài nào" cho MỌI kho của khuôn dạng–câu (spec-kien-truc.md §3, K21).
-- Thay cho việc tính lại mỗi lượt đọc qua view bdm_cau_dang (UNION 8 nhánh, không đẩy được điều kiện xuống — chỗ làm mastery treo 121 s).
-- Bảng này là BẢN CHIẾU: xoá đi dựng lại được bằng _kho_cau_dang_tinh(); luôn có đường tính trực tiếp để đối chiếu (fn_kho_cau_dang_lech).
-- Migration này CHƯA đổi view / hàm nào đang chạy — chỉ dựng bảng, đổ dữ liệu, gắn trigger giữ đồng bộ.
set local lock_timeout = '5s';

-- index còn thiếu cho luật kế thừa gốc → bản sao (dai, hgt đã có)
create index if not exists khtn_cau_hoi_parent_idx   on public.khtn_cau_hoi   (parent_ma_cau) where parent_ma_cau is not null;
create index if not exists vatly_cau_hoi_parent_idx  on public.vatly_cau_hoi  (parent_ma_cau) where parent_ma_cau is not null;
create index if not exists hoahoc_cau_hoi_parent_idx on public.hoahoc_cau_hoi (parent_ma_cau) where parent_ma_cau is not null;

-- ───────── luật (một nguồn công thức): giữ NGUYÊN luật của view bdm_cau_dang, viết một lần cho mọi kho ─────────
-- Thứ tự ưu tiên của một câu: (1) câu được gán dạng · (2) câu gốc của nó được gán · (3) câu có đề xuất · (4) câu gốc có đề xuất.
create or replace function public._kho_cau_dang_tinh(p_kho text default null, p_ma text[] default null)
returns table (kho text, ma_cau text, dang_bai_id text, nguon text)
language sql stable security definer set search_path = public
as $$
  select q.kho, q.ma_cau,
         coalesce(g.dang_bai_id, gg.dang_bai_id, d.dang_bai_id, dg.dang_bai_id),
         case when g.ma_cau is not null or gg.ma_cau is not null then 'gan_cau' else 'de_xuat' end
    from public.kho_cau_hoi q
    left join public.kho_bdm_gan_cau g  on g.kho  = q.kho and g.ma_cau  = q.ma_cau
    left join public.kho_bdm_gan_cau gg on gg.kho = q.kho and gg.ma_cau = q.parent_ma_cau
    left join public.kho_bdm_de_xuat d  on d.kho  = q.kho and d.ma_cau  = q.ma_cau
    left join public.kho_bdm_de_xuat dg on dg.kho = q.kho and dg.ma_cau = q.parent_ma_cau
   where (p_kho is null or q.kho = p_kho)
     and (p_ma is null or q.ma_cau = any (p_ma) or q.parent_ma_cau = any (p_ma))
     and coalesce(g.ma_cau, gg.ma_cau, d.ma_cau, dg.ma_cau) is not null
$$;
revoke execute on function public._kho_cau_dang_tinh(text, text[]) from public, anon, authenticated;

create table public.kho_cau_dang (
  kho         text not null,
  ma_cau      text not null,
  dang_bai_id text not null,
  nguon       text not null check (nguon in ('gan_cau', 'de_xuat')),
  primary key (kho, ma_cau)
);
comment on table public.kho_cau_dang is 'BẢN CHIẾU (tính sẵn): câu → dạng bài hiệu lực, mọi kho. KHÔNG ghi tay. Nguồn công thức: _kho_cau_dang_tinh(). Giữ đồng bộ bằng trigger trên kho_bdm_gan_cau / kho_bdm_de_xuat / kho_cau_hoi. Đối chiếu: fn_kho_cau_dang_lech().';
create index kho_cau_dang_dang_bai_idx on public.kho_cau_dang (dang_bai_id);
create index kho_cau_dang_ma_cau_idx   on public.kho_cau_dang (ma_cau);
alter table public.kho_cau_dang enable row level security;
revoke all on public.kho_cau_dang from anon;
revoke insert, update, delete, truncate on public.kho_cau_dang from authenticated;   -- chỉ trigger (security definer) ghi
create policy kho_cau_dang_member_select on public.kho_cau_dang for select to authenticated using ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_cau_dang for select to claude_ro using (true);

insert into public.kho_cau_dang (kho, ma_cau, dang_bai_id, nguon) select kho, ma_cau, dang_bai_id, nguon from public._kho_cau_dang_tinh();

-- ───────── làm lại cho một nhóm câu (câu đó + các bản sao của nó) ─────────
create or replace function public._kho_cau_dang_lam_lai(p_kho text, p_ma text[])
returns void language sql security definer set search_path = public
as $$
  with moi as (select * from public._kho_cau_dang_tinh(p_kho, p_ma)),
  xoa as (
    delete from public.kho_cau_dang t
     where t.kho = p_kho
       and (t.ma_cau = any (p_ma) or t.ma_cau in (select q.ma_cau from public.kho_cau_hoi q where q.kho = p_kho and q.parent_ma_cau = any (p_ma)))
       and not exists (select 1 from moi m where m.ma_cau = t.ma_cau)
    returning 1)
  insert into public.kho_cau_dang as t (kho, ma_cau, dang_bai_id, nguon)
  select m.kho, m.ma_cau, m.dang_bai_id, m.nguon from moi m
  on conflict (kho, ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon
   where t.dang_bai_id is distinct from excluded.dang_bai_id or t.nguon is distinct from excluded.nguon
$$;
revoke execute on function public._kho_cau_dang_lam_lai(text, text[]) from public, anon, authenticated;

create or replace function public._trg_kho_cau_dang() returns trigger
language plpgsql security definer set search_path = public
as $$
declare v_ma text[];
begin
  if tg_op = 'DELETE' then
    v_ma := array[old.ma_cau];
    perform public._kho_cau_dang_lam_lai(old.kho, v_ma);
    return old;
  end if;
  if tg_op = 'UPDATE' then
    if old.ma_cau = new.ma_cau and old.dang_bai_id is not distinct from new.dang_bai_id then return new; end if;   -- đổi cột khác: không ảnh hưởng
    v_ma := array[new.ma_cau, old.ma_cau];
  else
    v_ma := array[new.ma_cau];
  end if;
  perform public._kho_cau_dang_lam_lai(new.kho, v_ma);
  return new;
end
$$;
revoke execute on function public._trg_kho_cau_dang() from public, anon, authenticated;

-- bảng câu: chỉ thêm / xoá / đổi câu gốc mới ảnh hưởng (trigger chỉ bắn khi đổi parent_ma_cau, ma_cau)
create or replace function public._trg_kho_cau_dang_cau() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public._kho_cau_dang_lam_lai(old.kho, array[old.ma_cau]);
    return old;
  end if;
  if tg_op = 'UPDATE' then
    perform public._kho_cau_dang_lam_lai(new.kho, array[new.ma_cau, old.ma_cau]);
  elsif new.parent_ma_cau is not null then                                           -- câu mới chỉ có dạng ngay nếu là bản sao của câu đã có dạng
    perform public._kho_cau_dang_lam_lai(new.kho, array[new.ma_cau]);
  end if;
  return new;
end
$$;
revoke execute on function public._trg_kho_cau_dang_cau() from public, anon, authenticated;

-- trigger đặt ở BẢNG CHUNG ⇒ tự áp cho mọi nhánh (kể cả khi code ghi qua tên cũ <nhánh>_<họ>)
create trigger kho_cau_dang_gan    after insert or update or delete on public.kho_bdm_gan_cau for each row execute function public._trg_kho_cau_dang();
create trigger kho_cau_dang_dexuat after insert or update or delete on public.kho_bdm_de_xuat for each row execute function public._trg_kho_cau_dang();
create trigger kho_cau_dang_cau    after insert or delete or update of parent_ma_cau, ma_cau on public.kho_cau_hoi for each row execute function public._trg_kho_cau_dang_cau();

-- ───────── đối chiếu (K21): bảng lưu sẵn so với tính trực tiếp — phải 0 dòng ─────────
create or replace function public.fn_kho_cau_dang_lech()
returns table (kho text, ma_cau text, luu text, dung text)
language sql stable security definer set search_path = public
as $$
  select coalesce(a.kho, b.kho), coalesce(a.ma_cau, b.ma_cau), a.dang_bai_id || '/' || a.nguon, b.dang_bai_id || '/' || b.nguon
    from public.kho_cau_dang a
    full join public._kho_cau_dang_tinh() b on b.kho = a.kho and b.ma_cau = a.ma_cau
   where a.ma_cau is null or b.ma_cau is null or a.dang_bai_id <> b.dang_bai_id or a.nguon <> b.nguon
$$;
revoke execute on function public.fn_kho_cau_dang_lech() from public, anon, authenticated;
grant execute on function public.fn_kho_cau_dang_lech() to claude_ro;
