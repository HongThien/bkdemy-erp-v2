-- Hoàn điểm học tập (ĐHT) — bảng append-only `dht_hoan`.
-- Lý do: lỗi bán phân bón ở Nông Trại (mua 3 ĐHT, bán 5 EXP) → cần cộng lại ĐHT đã tiêu.
-- ĐHT là SUY (kiếm từ nhiệm vụ − dht_tieu); dht_tieu.so > 0 nên hoàn = bảng riêng, trừ vào tổng tiêu.
-- Chỉ `_dht_so_du` đọc dht_tieu để tính số dư (fn_dht_tieu / fn_nt_dht_dong_bo chỉ ghi/gọi lại) → sửa đúng 1 chỗ.

create table if not exists dht_hoan (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ngay date not null default (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  so integer not null check (so > 0),
  ly_do text not null,
  ma_tham_chieu text,
  tao_at timestamptz not null default now()
);
create index if not exists dht_hoan_hs_idx on dht_hoan (hoc_sinh_id, ngay);

alter table dht_hoan enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'dht_hoan' and policyname = 'dht_hoan_member_all') then
    create policy dht_hoan_member_all on dht_hoan for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
  end if;
  if exists (select 1 from pg_roles where rolname = 'claude_ro')
     and not exists (select 1 from pg_policies where tablename = 'dht_hoan' and policyname = 'claude_ro_select') then
    create policy claude_ro_select on dht_hoan for select to claude_ro using (true);
  end if;
end $$;

-- _dht_so_du: thân lấy từ bản ĐANG CHẠY (pg_get_functiondef 07/11); chỉ đổi CTE `t` = tiêu − hoàn.
create or replace function public._dht_so_du(p_hs uuid)
 returns jsonb
 language plpgsql
 stable
as $function$
declare
  v_max integer := coalesce((select max(dht_so_du_max) from nhiem_vu_cau_hinh where bat), 6000);
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_ym text := to_char((now() at time zone 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM');
  r record; v_so integer := 0; v_tong_kiem integer := 0; v_tong_tieu integer := 0; v_mat integer := 0; v_thang_kiem integer := 0;
begin
  for r in
    with k as (select kn.ngay, sum(kn.so)::int as so from public._dht_kiem_ngay(p_hs) kn group by 1),
         t as (select u.ngay, sum(u.so)::int as so
               from (select d.ngay, d.so from dht_tieu d where d.hoc_sinh_id = p_hs
                     union all
                     select h.ngay, -h.so from dht_hoan h where h.hoc_sinh_id = p_hs) u
               group by 1),
         b as (select least((select min(k.ngay) from k), (select min(t.ngay) from t)) as d0)
    select g::date as ngay, coalesce(k.so, 0) as kiem, coalesce(t.so, 0) as tieu
    from b cross join lateral generate_series(b.d0::timestamp, v_nay::timestamp, interval '1 day') g
    left join k on k.ngay = g::date left join t on t.ngay = g::date
    order by 1
  loop
    v_tong_kiem := v_tong_kiem + r.kiem; v_tong_tieu := v_tong_tieu + r.tieu;
    if to_char(r.ngay, 'YYYY-MM') = v_ym then v_thang_kiem := v_thang_kiem + r.kiem; end if;
    if v_so + r.kiem > v_max then v_mat := v_mat + (v_so + r.kiem - v_max); end if;
    v_so := least(v_max, v_so + r.kiem) - r.tieu;
  end loop;
  return jsonb_build_object('so_du', v_so, 'tran', v_max, 'tong_kiem', v_tong_kiem, 'tong_tieu', v_tong_tieu, 'mat_do_vuot_tran', v_mat, 'kiem_thang', v_thang_kiem);
end $function$;
