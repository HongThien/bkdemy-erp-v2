-- ============================================================================
-- NÔNG TRẠI — TĂNG TỐC BẰNG TOÁN (Thùy 03/11: "click tăng tốc ⇒ 3 câu toán random trong các dạng đã học, độ khó 2–3, đúng 2 câu là được")
-- Luật (CTO đề xuất, Thùy duyệt "làm theo đề xuất"):
--   · Áp cho MÁY CHẾ BIẾN trước (cây chín theo NGÀY nên "−10%" vô nghĩa). Đạt ⇒ giảm 1/2 thời gian CÒN LẠI của mẻ đang làm.
--   · 3 câu trắc nghiệm của kho chuẩn (cùng điều kiện _dtv_kho_cau_moi mà trận bot/leo tháp dùng), CHỈ trong dạng EM ĐÃ LÀM (_hs_dang_em_da_lam),
--     ưu tiên mức 2–3, thiếu thì lấy mức khác. Em chưa làm dạng nào ⇒ 'chua_hoc'. Khối chưa sang bản đồ mới ⇒ 'chua_co_kho'.
--   · CHẤM Ở SERVER: đáp án giữ trong nt_tang_toc_de, không gửi xuống máy em; trả đáp án đúng SAU khi nộp để em học.
--   · Chống đoán bừa / đổi đề tìm câu dễ: không đạt (hoặc bỏ dở) ⇒ chờ 60 giây mới xin đề mới; tối đa 5 lần ĐẠT mỗi ngày nông trại.
--   · Câu trả lời ghi lại (nt_tang_toc_nop.chon) nhưng CHƯA tính mastery (spec-che-do-game).
--   · Theo môn (§1.6): tham số p_mon, game hiện gọi 'Toán'; môn nào có kho trắc nghiệm là chạy y hệt.
-- Hai bảng tách theo §1.5: phát đề là một sự kiện thật (dòng _de); kết quả chỉ ra đời khi em NỘP (dòng _nop) — không có ô "chưa nộp".
-- ============================================================================

create table if not exists public.nt_tang_toc_de (
  id          uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  mon         text not null,
  muc_tieu    text not null check (muc_tieu in ('may')),
  ma_cau      text[] not null check (cardinality(ma_cau) = 3),
  dung        int[] not null check (cardinality(dung) = 3),
  tao_at      timestamptz not null default clock_timestamp()
);
create index if not exists nt_tang_toc_de_hs on public.nt_tang_toc_de (hoc_sinh_id, tao_at desc);
alter table public.nt_tang_toc_de enable row level security;

create table if not exists public.nt_tang_toc_nop (
  de_id       uuid primary key references public.nt_tang_toc_de(id) on delete cascade,
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  chon        int[] not null,
  so_dung     int not null check (so_dung between 0 and 3),
  dat         boolean not null,
  giam        numeric not null check (giam >= 0 and giam <= 1),
  nop_at      timestamptz not null default clock_timestamp()
);
create index if not exists nt_tang_toc_nop_hs on public.nt_tang_toc_nop (hoc_sinh_id, nop_at desc);
alter table public.nt_tang_toc_nop enable row level security;

-- DẠNG EM ĐÃ LÀM — nguồn câu cho tăng tốc: dạng của các câu CHÍNH EM đã làm và đã được chấm (ET/MT/BTVN trên lớp + bài trên app:
-- ET/BTVN/giáo trình/đề thi/bổ trợ/kiểm tra lại), quy về nhóm (_do_o) và bản đồ mới (_do_o_bdm), + dạng mở riêng cho em (hs_mo_dang).
-- Là TẬP CON của _hs_dang_da_hoc (cùng nguồn sự kiện, chỉ lấy phần của em) ⇒ chặt hơn "dạng lớp đã học", không bao giờ ra dạng chưa học.
-- Không dùng _hs_dang_da_hoc vì đo 03/11 nó mất 9–15 s ở vài lớp 10–12 (quét cả lớp) > trần 8 s của PostgREST; bản này 0,1–3 s.
create or replace function public._hs_dang_em_da_lam(p_hs uuid, p_mon text) returns text[]
language sql stable security definer set search_path to 'public' as $$
  with ev as (
    select sp.ma_cau, sp.ma_dang from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
     where g.hoc_sinh_id = p_hs and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn') and l.mon = p_mon
    union
    select btc.ma_cau, btc.ma_dang from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id join bai_lam_cau blc on blc.bai_lam_id = bl.id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = p_hs and bt.mon = p_mon and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
  )
  select coalesce(array_agg(distinct d) filter (where d is not null), '{}'::text[]) from (
    select ma_dang d from ev
    union select public._do_o(nullif(coalesce(ma_cau, ''), ''), ma_dang) from ev
    union select public._do_o_bdm(ma_cau, ma_dang) from ev where public._mastery_bdm_bat()
    union select m.ma_dang from hs_mo_dang m where m.hoc_sinh_id = p_hs and m.mon = p_mon
  ) x
$$;

-- Luật số ở 1 chỗ
create or replace function public._nt_tang_toc_luat() returns jsonb
language sql immutable as $$
  select '{"so_cau":3,"can_dung":2,"giam":0.5,"cho_giay":60,"toi_da_ngay":5,"han_phut":10,"muc":[2,3]}'::jsonb
$$;

-- Còn mấy lượt ĐẠT hôm nay + phải chờ bao nhiêu giây nữa (đề gần nhất không đạt / bỏ dở ⇒ chờ cho_giay kể từ lúc phát đề hoặc lúc nộp)
create or replace function public._nt_tang_toc_trang_thai(p_hs uuid) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  with l as (select public._nt_tang_toc_luat() j),
  da as (select count(*)::int n from nt_tang_toc_nop p where p.hoc_sinh_id = p_hs and p.dat
           and (public._nt_ngay(p.nop_at) - date '1970-01-01') = public._nt_hom_nay()),
  cuoi as (select d.tao_at, p.nop_at, p.dat from nt_tang_toc_de d left join nt_tang_toc_nop p on p.de_id = d.id
            where d.hoc_sinh_id = p_hs order by d.tao_at desc limit 1)
  select jsonb_build_object(
    'con_luot', greatest(0, (l.j->>'toi_da_ngay')::int - da.n),
    'cho_giay', coalesce((select greatest(0, ceil((l.j->>'cho_giay')::int - extract(epoch from (clock_timestamp() - coalesce(c.nop_at, c.tao_at)))))::int
                            from cuoi c where not coalesce(c.dat, false)), 0))
  from l, da
$$;

create or replace function public.fn_nt_tang_toc_de(p_muc_tieu text, p_mon text default 'Toán')
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); l jsonb := public._nt_tang_toc_luat(); tt jsonb; v_lop uuid; v_khoi text;
  v_ds jsonb; v_chon jsonb; v_id uuid; v_hoc text[]; v_ung text[]; v_ma text; v_k jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_muc_tieu is distinct from 'may' then return jsonb_build_object('ok', false, 'loi', 'muc_tieu'); end if;
  if not public._kho_co_mon(p_mon) then return jsonb_build_object('ok', false, 'loi', 'chua_co_mon'); end if;
  perform pg_advisory_xact_lock(hashtext('nt_tang_toc:' || v_hs::text));
  tt := public._nt_tang_toc_trang_thai(v_hs);
  if (tt->>'con_luot')::int < 1 then return jsonb_build_object('ok', false, 'loi', 'het_luot') || tt; end if;
  if (tt->>'cho_giay')::int > 0 then return jsonb_build_object('ok', false, 'loi', 'cho') || tt; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon);
  select l2.khoi into v_khoi from lop l2 where l2.id = v_lop;
  if v_khoi is null then return jsonb_build_object('ok', false, 'loi', 'chua_co_lop'); end if;
  v_hoc := public._hs_dang_em_da_lam(v_hs, p_mon);
  if cardinality(v_hoc) = 0 then return jsonb_build_object('ok', false, 'loi', 'chua_hoc'); end if;
  if not public._dtv_ban_do_moi(p_mon, v_khoi) then return jsonb_build_object('ok', false, 'loi', 'chua_co_kho'); end if;
  -- Bốc 2 bước (đo 03/11: lấy NỘI DUNG cả nghìn câu một lúc có lần > 40 s): ① chỉ MÃ câu (dạng em đã làm + đủ điều kiện trắc nghiệm
  -- của kho, cùng hàm fn_dtv_kho_bo_cau dùng), ưu tiên mức 2–3, trộn ngẫu nhiên, lấy 12 ứng viên · ② đọc nội dung từng câu (_dtv_kho_cau_tim),
  -- giữ câu đủ 4 phương án + có đáp án, đủ 3 thì dừng.
  with d as materialized (select dm.cautbl, dm.ma_dang, max(dm.muc_do) muc from public._dtv_kho_dang_moi(p_mon, array[v_khoi]) dm group by 1, 2),
  c as materialized (select cm.cautbl, cm.ma_cau, cm.ma_dang from public._dtv_kho_cau_moi(p_mon, array[v_khoi], null, v_hoc, false) cm)
  select array_agg(x.ma_cau order by x.uu, x.r) into v_ung from (
    select c.ma_cau, case when coalesce(d.muc, 3) = any(array(select jsonb_array_elements_text(l->'muc')::int)) then 0 else 1 end uu, random() r
      from c left join d on d.cautbl = c.cautbl and d.ma_dang = c.ma_dang
     order by 2, 3 limit 12) x;
  v_ds := '[]'::jsonb;
  foreach v_ma in array coalesce(v_ung, '{}'::text[]) loop
    v_k := public._dtv_kho_cau_tim(p_mon, v_khoi, v_ma);
    continue when v_k is null or jsonb_typeof(v_k->'opts') <> 'array' or jsonb_array_length(v_k->'opts') <> 4
               or coalesce((v_k->>'dung')::int, -1) not between 0 and 3;
    v_ds := v_ds || jsonb_build_array(v_k);
    exit when jsonb_array_length(v_ds) >= (l->>'so_cau')::int;
  end loop;
  -- ưu tiên mức 2–3, thiếu thì bù bằng mức khác (vẫn trong dạng đã học)
  select jsonb_agg(e order by uu, ord) into v_chon from (
    select e, case when coalesce((e->>'muc')::int, 3) = any(array(select jsonb_array_elements_text(l->'muc')::int)) then 0 else 1 end uu, ord
      from jsonb_array_elements(coalesce(v_ds, '[]'::jsonb)) with ordinality t(e, ord)
     order by uu, ord limit (l->>'so_cau')::int) x;
  if v_chon is null or jsonb_array_length(v_chon) < (l->>'so_cau')::int then return jsonb_build_object('ok', false, 'loi', 'thieu_cau'); end if;
  insert into nt_tang_toc_de (hoc_sinh_id, mon, muc_tieu, ma_cau, dung)
  values (v_hs, p_mon, p_muc_tieu,
          array(select e->>'ma_cau' from jsonb_array_elements(v_chon) with ordinality t(e, o) order by o),
          array(select (e->>'dung')::int from jsonb_array_elements(v_chon) with ordinality t(e, o) order by o))
  returning id into v_id;
  return jsonb_build_object('ok', true, 'de_id', v_id, 'can_dung', (l->>'can_dung')::int, 'giam', (l->>'giam')::numeric,
    'cau', (select jsonb_agg(jsonb_build_object('de', e->'de', 'anh', e->'anh', 'opts', e->'opts', 'dang', e->'dang') order by o)
              from jsonb_array_elements(v_chon) with ordinality t(e, o)))
    || jsonb_build_object('con_luot', (tt->>'con_luot')::int);
end $$;

create or replace function public.fn_nt_tang_toc_nop(p_de_id uuid, p_chon int[])
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); l jsonb := public._nt_tang_toc_luat(); d nt_tang_toc_de; v_dung int := 0; i int; v_dat boolean; v_giam numeric;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(hashtext('nt_tang_toc:' || v_hs::text));
  select * into d from nt_tang_toc_de where id = p_de_id and hoc_sinh_id = v_hs;
  if not found then return jsonb_build_object('ok', false, 'loi', 'khong_co_de'); end if;
  if exists (select 1 from nt_tang_toc_nop where de_id = p_de_id) then return jsonb_build_object('ok', false, 'loi', 'da_nop'); end if;
  if clock_timestamp() - d.tao_at > make_interval(mins => (l->>'han_phut')::int) then return jsonb_build_object('ok', false, 'loi', 'het_han'); end if;
  if p_chon is null or cardinality(p_chon) <> cardinality(d.dung) then return jsonb_build_object('ok', false, 'loi', 'thieu_tra_loi'); end if;
  for i in 1 .. cardinality(d.dung) loop
    if p_chon[i] = d.dung[i] then v_dung := v_dung + 1; end if;
  end loop;
  v_dat := v_dung >= (l->>'can_dung')::int;
  v_giam := case when v_dat then (l->>'giam')::numeric else 0 end;
  insert into nt_tang_toc_nop (de_id, hoc_sinh_id, chon, so_dung, dat, giam) values (p_de_id, v_hs, p_chon, v_dung, v_dat, v_giam);
  return jsonb_build_object('ok', true, 'so_dung', v_dung, 'dat', v_dat, 'giam', v_giam, 'dap_an', to_jsonb(d.dung)) || public._nt_tang_toc_trang_thai(v_hs);
end $$;

revoke all on function public._nt_tang_toc_trang_thai(uuid), public._hs_dang_em_da_lam(uuid, text) from public, anon, authenticated;
revoke all on function public.fn_nt_tang_toc_de(text, text), public.fn_nt_tang_toc_nop(uuid, int[]) from public, anon;
grant execute on function public.fn_nt_tang_toc_de(text, text), public.fn_nt_tang_toc_nop(uuid, int[]) to authenticated;
