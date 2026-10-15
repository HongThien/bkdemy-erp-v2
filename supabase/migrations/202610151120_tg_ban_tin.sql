-- ============================================================================
-- 202610151120 — tg_ban_tin  (spec-bot-telegram-ta.md §3.1, bước B3)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Bản tin 08:00: mỗi TA còn việc ⇒ 1 tin, tag TA + người phụ trách khối. Mọi gom/đếm ở đây (§2.0); JS
--   (api/_tg_lib.mjs) chỉ dựng chữ. Chấm công GOM thành 1 dòng/TA (đợt khai lùi tháng 10 làm 243/602 việc tồn
--   là "chưa ghi công" — liệt kê từng buổi thì tin dài vô nghĩa).
--   tg_ban_tin = bản tin ĐÃ ĐĂNG (snapshot việc + message_id), bất biến: ERP đổi sau đó không làm sai "hôm đó
--   đã hỏi gì" — tổng kết 24:00 (B4) đọc snapshot này, không đọc lại ERP. 1 dòng / (ngày, nhóm, TA) ⇒ cron
--   chạy lại không đăng trùng. Đầu bản tin (tiêu đề) = dòng nhan_su_id null.
--   tg_nhom.ban_tin_bat: cron chạy mỗi ngày nhưng chỉ đăng vào nhóm được BẬT (bật sau khi Thùy duyệt bản xem trước).
--
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 cột (default false) + bảng/hàm mới.
-- ============================================================================

alter table public.tg_nhom add column if not exists ban_tin_bat boolean not null default false;

create table public.tg_ban_tin (
  id          uuid primary key default gen_random_uuid(),
  ngay        date not null,
  chat_id     bigint not null references public.tg_nhom(chat_id),
  nhan_su_id  uuid references public.nhan_su(id),            -- null = tin tiêu đề
  message_id  bigint not null,
  noi_dung    text not null,
  viec        jsonb not null default '[]'::jsonb,              -- snapshot việc tồn lúc đăng (có ref_key)
  gui_at      timestamptz not null default now()
);
create unique index tg_ban_tin_mot on public.tg_ban_tin (ngay, chat_id, coalesce(nhan_su_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index tg_ban_tin_msg on public.tg_ban_tin (chat_id, message_id);
create trigger tg_ban_tin_bat_bien before update or delete on public.tg_ban_tin
  for each row execute function public._tg_tin_bat_bien();
alter table public.tg_ban_tin enable row level security;
create policy tg_ban_tin_doc on public.tg_ban_tin for select to authenticated using (public.co_chuc_nang('ta_cong_duyet'));

-- Danh sách TA "đang làm": có phân công TG hiện tại, hoặc đang có việc tồn.
create or replace function public._tg_ds_ta(p_ngay date) returns table (nhan_su_id uuid)
language sql stable security definer set search_path = public as $$
  select distinct n.id from nhan_su n
   where n.trang_thai = 'dang_lam'
     and (exists (select 1 from phan_cong_lop pc where pc.nhan_su_id = n.id and pc.vai_tro = 'tg')
          or exists (select 1 from public._tg_viec_ton(p_ngay) v where v.nhan_su_id = n.id))
$$;
revoke all on function public._tg_ds_ta(date) from public, anon, authenticated;

-- Nội dung bản tin (dữ liệu, chưa thành chữ). Trả jsonb: { ngay, ta: [ {nhan_su_id, ho_ten, tg_user_id, so_viec,
--   phu_trach:[{ho_ten,tg_user_id,khoi}], nhom:[{loai,nhan,muc:[{ten_lop,ngay_goc,so_luong,ref_key}]}],
--   cong:{so_buoi,so_ca,quen_checkout,tu,den} | null, viec:[snapshot] } ], sach:[ho_ten], chua_noi:[ho_ten] }
create or replace function public._tg_ban_tin_du_lieu(p_ngay date) returns jsonb
language sql stable security definer set search_path = public as $$
  with v as (select * from public._tg_viec_ton(p_ngay)),
  ds as (select d.nhan_su_id, n.ho_ten, l.tg_user_id
           from public._tg_ds_ta(p_ngay) d join nhan_su n on n.id = d.nhan_su_id
           left join tg_lien_ket l on l.nhan_su_id = d.nhan_su_id and l.den_at is null),
  thuong as (   -- việc không phải chấm công, gom theo loại
    select v.nhan_su_id, v.loai, min(v.nhan) as nhan, min(v.ngay_goc) as ngay_dau,
           jsonb_agg(jsonb_build_object('ten_lop', v.ten_lop, 'ngay_goc', v.ngay_goc, 'so_luong', v.so_luong, 'ref_key', v.ref_key)
                     order by v.ngay_goc, v.ten_lop) as muc
      from v where v.loai not in ('cong_buoi', 'cong_ca', 'quen_checkout')
     group by v.nhan_su_id, v.loai
  ),
  cong as (
    select v.nhan_su_id,
           jsonb_build_object('so_buoi', count(*) filter (where v.loai = 'cong_buoi'),
                              'so_ca', count(*) filter (where v.loai = 'cong_ca'),
                              'quen_checkout', count(*) filter (where v.loai = 'quen_checkout'),
                              'tu', min(v.ngay_goc), 'den', max(v.ngay_goc)) as cong
      from v where v.loai in ('cong_buoi', 'cong_ca', 'quen_checkout')
     group by v.nhan_su_id
  ),
  pt as (       -- người phụ trách các khối mà TA có việc (trừ chính TA đó)
    select x.nhan_su_id, jsonb_agg(distinct jsonb_build_object('ho_ten', n.ho_ten, 'tg_user_id', l.tg_user_id)) as phu_trach
      from (select distinct v.nhan_su_id, v.mon, v.khoi from v where v.khoi is not null) x
      join phan_cong_khoi pk on pk.mon = x.mon and pk.khoi = x.khoi and pk.nhan_su_id <> x.nhan_su_id
      join nhan_su n on n.id = pk.nhan_su_id and n.trang_thai = 'dang_lam'
      left join tg_lien_ket l on l.nhan_su_id = pk.nhan_su_id and l.den_at is null
     group by x.nhan_su_id
  ),
  ta as (
    select ds.nhan_su_id, ds.ho_ten, ds.tg_user_id,
           (select count(*) from v where v.nhan_su_id = ds.nhan_su_id) as so_viec,
           coalesce(pt.phu_trach, '[]'::jsonb) as phu_trach,
           coalesce((select jsonb_agg(jsonb_build_object('loai', t.loai, 'nhan', t.nhan, 'muc', t.muc) order by t.ngay_dau, t.loai)
                       from thuong t where t.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as nhom,
           cong.cong,
           coalesce((select jsonb_agg(jsonb_build_object('ref_key', v.ref_key, 'loai', v.loai, 'nhan', v.nhan, 'ten_lop', v.ten_lop,
                                                          'khoi', v.khoi, 'mon', v.mon, 'ngay_goc', v.ngay_goc, 'han', v.han, 'so_luong', v.so_luong)
                                       order by v.ngay_goc, v.loai)
                       from v where v.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as viec
      from ds left join pt on pt.nhan_su_id = ds.nhan_su_id left join cong on cong.nhan_su_id = ds.nhan_su_id
  )
  select jsonb_build_object(
    'ngay', p_ngay,
    'ta', coalesce((select jsonb_agg(to_jsonb(ta) order by ta.ho_ten)
                      from ta where ta.so_viec > 0), '[]'::jsonb),
    'sach', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.so_viec = 0), '[]'::jsonb),
    'chua_noi', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.tg_user_id is null), '[]'::jsonb))
$$;
revoke all on function public._tg_ban_tin_du_lieu(date) from public, anon, authenticated;

-- Cron / script gọi (secret 'push_cron' như các cron khác — CRON_SECRET trên Vercel).
create or replace function public.fn_tg_ban_tin(p_secret text, p_ngay date default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_ngay date := coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date);
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return public._tg_ban_tin_du_lieu(v_ngay) || jsonb_build_object(
    'nhom', coalesce((select jsonb_agg(jsonb_build_object('chat_id', g.chat_id, 'ten', g.ten,
                       'da_dang', (select coalesce(jsonb_agg(b.nhan_su_id), '[]'::jsonb) from tg_ban_tin b where b.ngay = v_ngay and b.chat_id = g.chat_id),
                       'da_dang_dau', exists (select 1 from tg_ban_tin b where b.ngay = v_ngay and b.chat_id = g.chat_id and b.nhan_su_id is null)))
                       from tg_nhom g where g.vai = 'ta_chung' and g.ban_tin_bat and g.trang_thai_bot in ('member', 'administrator')), '[]'::jsonb));
end $$;
revoke all on function public.fn_tg_ban_tin(text, date) from public;
grant execute on function public.fn_tg_ban_tin(text, date) to anon, authenticated;

create or replace function public.fn_tg_ghi_ban_tin(p_secret text, p_ngay date, p_chat bigint, p_ns uuid, p_message_id bigint,
                                                    p_noi_dung text, p_viec jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  insert into tg_ban_tin (ngay, chat_id, nhan_su_id, message_id, noi_dung, viec)
  values (p_ngay, p_chat, p_ns, p_message_id, p_noi_dung, coalesce(p_viec, '[]'::jsonb));
end $$;
revoke all on function public.fn_tg_ghi_ban_tin(text, date, bigint, uuid, bigint, text, jsonb) from public;
grant execute on function public.fn_tg_ghi_ban_tin(text, date, bigint, uuid, bigint, text, jsonb) to anon, authenticated;
