-- ĐẤU TỪ — LEO THÁP (Thùy 03/10: "chế độ mọi game phải có: cùng 1 thử thách, mọi người tham gia có leaderboard").
-- 2 chế độ: 'song_con' (Sinh tồn — 5 phút, leo càng cao càng tốt) · 'vo_tan' (Vô tận — mỗi câu có giờ, sai/hết giờ là thua;
-- 10s, cứ 10 tầng bớt 1s, sàn 3s). "Cùng 1 thử thách" = THÁP HÔM NAY: cùng chuỗi câu (seed theo ngày VN + chế độ) cho mọi người.
-- 1 dòng = 1 lượt leo ĐÃ XONG (append-only, §1.5). Bảng xếp hạng = lượt tốt nhất mỗi người, tính ở DB (fn_dtv_thap_bxh).
-- DEMO: kết quả do máy người chơi gửi lên (chưa có trọng tài server) — có chặn số vô lý.

create table if not exists dtv_thap_luot (
  id       uuid primary key default gen_random_uuid(),
  uid      text not null references dtv_nguoi_choi(uid) on delete cascade,
  mon      text not null default 'Tiếng Anh',
  che_do   text not null check (che_do in ('song_con','vo_tan')),
  ngay     date not null,                       -- ngày của tháp (giờ VN) — tháp đổi mỗi ngày
  tang     integer not null check (tang >= 0),  -- số tầng leo được (= số câu đúng)
  sai      integer not null default 0 check (sai >= 0),
  ms       integer not null check (ms >= 0),    -- thời gian của lượt (Vô tận: tổng thời gian; Sinh tồn: ≤ 300000)
  tao_at   timestamptz not null default now()
);
create index if not exists dtv_thap_luot_ngay on dtv_thap_luot (che_do, ngay, tang desc);
create index if not exists dtv_thap_luot_uid on dtv_thap_luot (uid, che_do);
alter table dtv_thap_luot enable row level security;

-- Ghi 1 lượt leo + cộng XP (2 XP/tầng, trần 100 tầng/lượt) + giữ chuỗi ngày học. Trả hồ sơ + hạng hôm nay.
create or replace function fn_dtv_thap_ghi(p_uid text, p_che_do text, p_tang integer, p_sai integer, p_ms integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ngay date := _dtv_hom_nay();
  v_tang integer := greatest(coalesce(p_tang, 0), 0);
  v_ms integer := greatest(coalesce(p_ms, 0), 0);
  v_xp integer; v_luot_hom_nay integer; n dtv_nguoi_choi; v_cap_truoc integer; v_cap_sau integer;
begin
  if p_che_do not in ('song_con','vo_tan') then raise exception 'Chế độ tháp không hợp lệ'; end if;
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;
  -- chặn số vô lý: mỗi tầng tối thiểu 0,4 giây; Sinh tồn không quá 5 phút (+ 2s trễ mạng)
  if v_tang > 0 and v_ms < v_tang * 400 then raise exception 'Kết quả không hợp lệ'; end if;
  if p_che_do = 'song_con' and v_ms > 302000 then v_ms := 300000; end if;

  insert into dtv_thap_luot (uid, che_do, ngay, tang, sai, ms) values (p_uid, p_che_do, v_ngay, v_tang, greatest(coalesce(p_sai, 0), 0), v_ms);

  select count(*) into v_luot_hom_nay from dtv_thap_luot where uid = p_uid and ngay = v_ngay;
  v_xp := case when v_luot_hom_nay > 30 then 0 else least(v_tang, 100) * 2 end;
  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_ngay then n.chuoi_ngay when n.ngay_hoc_cuoi = v_ngay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_ngay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc,
    'bxh', fn_dtv_thap_bxh(p_che_do, true, p_uid));
end $$;

-- Bảng xếp hạng tháp: p_hom_nay = true ⇒ tháp hôm nay; false ⇒ kỷ lục mọi thời.
-- Mỗi người lấy LƯỢT TỐT NHẤT: nhiều tầng hơn → (Sinh tồn) ít sai hơn / (Vô tận) nhanh hơn → sớm hơn.
create or replace function fn_dtv_thap_bxh(p_che_do text, p_hom_nay boolean, p_uid text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with l as (
    select distinct on (t.uid) t.uid, t.tang, t.sai, t.ms, t.tao_at
    from dtv_thap_luot t
    where t.che_do = p_che_do and (not p_hom_nay or t.ngay = _dtv_hom_nay())
    order by t.uid, t.tang desc,
      case when p_che_do = 'song_con' then t.sai else t.ms end asc, t.tao_at asc
  ), x as (
    select l.*, n.ma, n.ten, n.nv,
      row_number() over (order by l.tang desc, case when p_che_do = 'song_con' then l.sai else l.ms end asc, l.tao_at asc) as hang
    from l join dtv_nguoi_choi n on n.uid = l.uid
  )
  select jsonb_build_object(
    'so_nguoi', (select count(*) from x),
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'tang', tang, 'sai', sai, 'ms', ms) order by hang)
                     from (select * from x order by hang limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'tang', tang, 'sai', sai, 'ms', ms) from x where uid = p_uid))
$$;

revoke all on function fn_dtv_thap_ghi(text, text, integer, integer, integer), fn_dtv_thap_bxh(text, boolean, text) from public;
grant execute on function fn_dtv_thap_ghi(text, text, integer, integer, integer), fn_dtv_thap_bxh(text, boolean, text) to anon, authenticated;
