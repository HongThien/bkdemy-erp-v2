-- ĐIỀN Ô cho CHỨNG MINH HÌNH — D2 (spec-dien-o.md §0b, §2, §3). CEO 09/09: "D2 đi, full 1 vòng mới có cái nhìn để sửa".
-- Form thứ 3 của bài (cạnh TN và tự luận): lời giải chi tiết bỏ trống 1–4 ô, mỗi ô 4 phương án; đo theo CÂU (Đ/C/S).
-- Kho hình không có ma_cau → form khoá theo cach_giai_id HOẶC bien_the_id (đúng 1). Danh mục lý do + nhãn lỗi = bảng riêng
-- (vai trò như dai_mcq_rule), seed từ scripts/mcq-lo/hinh-ly-do-catalog.json (phần cuối file, sinh bằng script).

-- ── 1) Danh mục lý do chuẩn + nhãn lỗi chứng minh ───────────────────────────────────────────────────────────
create table if not exists hinh_ly_do (
  ma text primary key, nhom text not null, ten text not null, phat_bieu text, tuong_duong text[] not null default '{}',
  khoi text[] not null default '{}', duc boolean not null default true,   -- duc=false: GT/CT/TT — không làm ô lý do
  active boolean not null default true, created_at timestamptz not null default now());
create table if not exists hinh_loi_cm (ma text primary key, ten text not null, mo_ta text, nhom_hoan_doi text[] not null default '{}');
alter table hinh_ly_do enable row level security; alter table hinh_loi_cm enable row level security;
drop policy if exists hinh_ly_do_member_all on hinh_ly_do;
create policy hinh_ly_do_member_all on hinh_ly_do for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
drop policy if exists hinh_loi_cm_member_all on hinh_loi_cm;
create policy hinh_loi_cm_member_all on hinh_loi_cm for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hinh_ly_do, hinh_loi_cm to authenticated;

-- ── 2) Form điền ô ──────────────────────────────────────────────────────────────────────────────────────────
create table if not exists hinh_form_dien (
  id uuid primary key default gen_random_uuid(),
  cach_giai_id uuid references hinh_cach_giai(id),
  bien_the_id uuid references hinh_baitoan_bien_the(id),
  loi_giai_bam text not null,          -- md5(lời giải lúc sinh): lời giải đổi ⇒ trigger thu hồi form
  buoc jsonb not null,                 -- [{ "k":1, "text":"…" }, …]  (lời giải tách bước, HS thấy)
  -- o: [{ "id":"o1","kieu":"ket_luan"|"ly_do","buoc":3,"key":"…","dap_an":"C",
  --       "phuong_an":[{ "text":"$…$"|"ma":"LD04","dung":true|false,"loi":"E01","vi_sao_sai":"…" } ×4] }]
  o jsonb not null,
  nguon text not null default 'ai' check (nguon in ('ai','nguoi')), ai_model text, sinh_at timestamptz not null default now(),
  da_duyet boolean not null default false, duyet_boi uuid references nhan_su(id), duyet_at timestamptz,
  sua_truoc_duyet boolean not null default false, tu_choi_boi uuid references nhan_su(id), tu_choi_ly_do text,
  xoa_at timestamptz, updated_at timestamptz not null default now(),
  check ((cach_giai_id is null) <> (bien_the_id is null))
);
create unique index if not exists hinh_form_dien_cach_1 on hinh_form_dien (cach_giai_id) where xoa_at is null and cach_giai_id is not null;
create unique index if not exists hinh_form_dien_bt_1 on hinh_form_dien (bien_the_id) where xoa_at is null and bien_the_id is not null;

create or replace function public.hinh_form_dien_kiem() returns trigger language plpgsql as $$
declare v_n int; v_o jsonb; v_pa jsonb; v_dung int; v_idx int; v_kieu text; v_nb int; i int := 0;
begin
  if jsonb_typeof(new.buoc) <> 'array' or jsonb_typeof(new.o) <> 'array' then raise exception 'buoc/o phải là mảng'; end if;
  v_nb := jsonb_array_length(new.buoc);
  v_n := jsonb_array_length(new.o);
  if v_n < 1 or v_n > 4 then raise exception 'phải 1–4 ô (đang %)', v_n; end if;   -- CEO: tối đa 4 ô/bài
  for v_o in select * from jsonb_array_elements(new.o) loop
    i := i + 1;
    v_kieu := v_o->>'kieu';
    if v_kieu not in ('ket_luan','ly_do') then raise exception 'ô %: kieu lạ %', i, v_kieu; end if;
    if (v_o->>'buoc')::int < 1 or (v_o->>'buoc')::int > v_nb then raise exception 'ô %: buoc ngoài phạm vi', i; end if;
    if coalesce(v_o->>'key','') = '' then raise exception 'ô %: thiếu key', i; end if;
    v_pa := v_o->'phuong_an';
    if jsonb_typeof(v_pa) <> 'array' or jsonb_array_length(v_pa) <> 4 then raise exception 'ô %: phải 4 phương án', i; end if;
    select count(*) into v_dung from jsonb_array_elements(v_pa) p where (p->>'dung')::boolean;
    if v_dung <> 1 then raise exception 'ô %: phải đúng 1 phương án đúng', i; end if;
    v_idx := ascii(v_o->>'dap_an') - 65;
    if coalesce((v_pa -> v_idx ->> 'dung')::boolean, false) is not true then raise exception 'ô %: dap_an không khớp vị trí', i; end if;
    if v_kieu = 'ly_do' and exists (select 1 from jsonb_array_elements(v_pa) p where not exists (select 1 from hinh_ly_do l where l.ma = p->>'ma'))
      then raise exception 'ô %: phương án lý do có mã LD không tồn tại', i; end if;
    if exists (select 1 from jsonb_array_elements(v_pa) p where not (p->>'dung')::boolean and not exists (select 1 from hinh_loi_cm e where e.ma = p->>'loi'))
      then raise exception 'ô %: phương án sai thiếu nhãn lỗi hợp lệ', i; end if;
  end loop;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists hinh_form_dien_kiem on hinh_form_dien;
create trigger hinh_form_dien_kiem before insert or update on hinh_form_dien for each row execute function public.hinh_form_dien_kiem();

-- Lời giải đổi ⇒ thu hồi form (spec §3): kho rác, không delete.
create or replace function public.hinh_form_dien_thu_hoi() returns trigger language plpgsql as $$
begin
  if new.loi_giai is distinct from old.loi_giai then
    if tg_table_name = 'hinh_cach_giai' then
      update hinh_form_dien set xoa_at = now(), tu_choi_ly_do = coalesce(tu_choi_ly_do, '') || ' [thu hồi: lời giải đổi]'
        where cach_giai_id = new.id and xoa_at is null and loi_giai_bam <> md5(coalesce(new.loi_giai, ''));
    else
      update hinh_form_dien set xoa_at = now(), tu_choi_ly_do = coalesce(tu_choi_ly_do, '') || ' [thu hồi: lời giải đổi]'
        where bien_the_id = new.id and xoa_at is null and loi_giai_bam <> md5(coalesce(new.loi_giai, ''));
    end if;
  end if;
  return new;
end $$;
drop trigger if exists hinh_cach_giai_thu_hoi_dien on hinh_cach_giai;
create trigger hinh_cach_giai_thu_hoi_dien after update of loi_giai on hinh_cach_giai for each row execute function public.hinh_form_dien_thu_hoi();
drop trigger if exists hinh_bien_the_thu_hoi_dien on hinh_baitoan_bien_the;
create trigger hinh_bien_the_thu_hoi_dien after update of loi_giai on hinh_baitoan_bien_the for each row execute function public.hinh_form_dien_thu_hoi();

alter table hinh_form_dien enable row level security;
drop policy if exists hinh_form_dien_member_all on hinh_form_dien;
create policy hinh_form_dien_member_all on hinh_form_dien for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hinh_form_dien to authenticated;

-- ── 3) Snapshot vào bai_test_cau: loai_cau = 'dien_o' ──────────────────────────────────────────────────────
-- dien = bản HS THẤY (đã lược dung/loi/vi_sao_sai): { buoc:[{k,text}], o:[{id,kieu,buoc,key_len,phuong_an:[text×4]}] }
-- dap_an_key = ["C","A",…] theo thứ tự ô · o_rule = [[loi|null ×4] mỗi ô] (staff, đọc lỗi) — cùng INSERT, không sửa riêng.
alter table bai_test_cau add column if not exists dien jsonb;
alter table bai_test_cau add column if not exists form_dien_id uuid references hinh_form_dien(id);
alter table bai_test_cau add column if not exists o_rule jsonb;

-- ── 4) Chấm (CEO 09/09): đúng hết = correct · sai quá 60% ô (đúng < 40%) = wrong · còn lại partial ─────────
create or replace function public.fn_dien_cham(p_key jsonb, p_hs jsonb)
returns table (verdict text, ti_le numeric) language sql immutable as $$
  with n as (select jsonb_array_length(p_key) tong),
  d as (select count(*) dung from jsonb_array_elements_text(p_key) with ordinality k(chu, i)
        join jsonb_array_elements(p_hs) with ordinality h(v, j) on h.j = k.i
        where jsonb_typeof(h.v) = 'number' and chr(65 + (h.v)::int) = k.chu)
  select case when d.dung = n.tong then 'correct' when d.dung * 10 < n.tong * 4 then 'wrong' else 'partial' end,
         round(d.dung::numeric / greatest(n.tong, 1), 3)
  from n, d
$$;

-- ── 5) RPC duyệt (tab "Điền ô AI") ──────────────────────────────────────────────────────────────────────────
create or replace function public.fn_dien_form_cho_duyet(p_khoi text default null, p_da_duyet boolean default false)
returns table (id uuid, loai text, ref_id uuid, ma text, khoi text, de text, gia_thiet text, anh text, buoc jsonb, o jsonb,
               sinh_at timestamptz, da_duyet boolean, sua_truoc_duyet boolean, ai_model text)
language sql stable as $$
  select f.id, case when f.cach_giai_id is not null then 'cach' else 'bien_the' end, coalesce(f.cach_giai_id, f.bien_the_id),
         coalesce(bt1.ma, bt2.ma || '/' || v.thu_tu), coalesce(mh1.khoi, mh2.khoi),
         coalesce(bt1.phat_bieu, v.de_bai), bt1.gia_thiet_rieng,
         coalesce(v.anh, bt1.anh_chuan, bt2.anh_chuan, mh1.anh_cau_hinh, mh2.anh_cau_hinh),
         f.buoc, f.o, f.sinh_at, f.da_duyet, f.sua_truoc_duyet, f.ai_model
  from hinh_form_dien f
  left join hinh_cach_giai cg on cg.id = f.cach_giai_id left join hinh_baitoan bt1 on bt1.id = cg.baitoan_id left join hinh_mo_hinh mh1 on mh1.id = bt1.mo_hinh_id
  left join hinh_baitoan_bien_the v on v.id = f.bien_the_id left join hinh_baitoan bt2 on bt2.id = v.baitoan_id left join hinh_mo_hinh mh2 on mh2.id = bt2.mo_hinh_id
  where f.xoa_at is null and f.da_duyet = p_da_duyet and (p_khoi is null or coalesce(mh1.khoi, mh2.khoi) = p_khoi)
  order by 4 limit 500
$$;
create or replace function public.fn_dien_form_duyet(p_id uuid, p_nguoi uuid, p_o jsonb default null)
returns void language plpgsql as $$
declare v_cu jsonb;
begin
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  select o into v_cu from hinh_form_dien where id = p_id and xoa_at is null and not da_duyet for update;
  if v_cu is null then raise exception 'Form không tồn tại / đã duyệt / đã bị từ chối'; end if;
  update hinh_form_dien set o = coalesce(p_o, o), da_duyet = true, duyet_boi = p_nguoi, duyet_at = now(),
    sua_truoc_duyet = (p_o is not null and p_o <> v_cu) where id = p_id;
end $$;
create or replace function public.fn_dien_form_tu_choi(p_id uuid, p_nguoi uuid, p_ly_do text)
returns void language plpgsql as $$
declare v_n int;
begin
  if coalesce(trim(p_ly_do), '') = '' then raise exception 'Từ chối phải có lý do'; end if;
  update hinh_form_dien set xoa_at = now(), tu_choi_boi = p_nguoi, tu_choi_ly_do = p_ly_do where id = p_id and xoa_at is null and not da_duyet;
  get diagnostics v_n = row_count; if v_n = 0 then raise exception 'Form không tồn tại / đã duyệt / đã bị từ chối'; end if;
end $$;
grant execute on function public.fn_dien_form_cho_duyet(text, boolean), public.fn_dien_form_duyet(uuid, uuid, jsonb), public.fn_dien_form_tu_choi(uuid, uuid, text) to authenticated;

-- ── 6) HS: sinh lượt "luyện chứng minh" + trả lời ─────────────────────────────────────────────────────────
-- Bản HS thấy của 1 form (lược key): phương án lý do hiện TÊN từ danh mục.
create or replace function public._dien_hs_view(p_o jsonb) returns jsonb language sql stable as $$
  select jsonb_agg(jsonb_build_object(
    'id', o->>'id', 'kieu', o->>'kieu', 'buoc', (o->>'buoc')::int, 'key_len', length(o->>'key'),
    'phuong_an', (select jsonb_agg(coalesce(p->>'text', (select l.ten from hinh_ly_do l where l.ma = p->>'ma'), p->>'ma') order by i)
                  from jsonb_array_elements(o->'phuong_an') with ordinality t(p, i))) order by idx)
  from jsonb_array_elements(p_o) with ordinality x(o, idx)
$$;
create or replace function public.tu_luyen_dien_sinh(p_mon text default 'Toán', p_n integer default 3)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_lop uuid; v_khoi text; v_bt uuid; v_thu_tu int := 0; r record;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  select l.khoi into v_khoi from lop l where l.id = v_lop;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo') returning id into v_bt;
  for r in
    select f.*, d.ma, d.de, d.gia_thiet, d.anh, d.khoi
    from hinh_form_dien f join lateral (select * from fn_dien_form_cho_duyet(null, true) x where x.id = f.id) d on true
    where f.da_duyet and f.xoa_at is null and (v_khoi is null or d.khoi = v_khoi)
      -- né form HS đã làm trong 30 bài gần nhất
      and f.id not in (select btc.form_dien_id from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id
                       where bt.hoc_sinh_id = v_hs and btc.form_dien_id is not null order by bt.created_at desc limit 30)
    order by random() limit greatest(1, least(p_n, 6))
  loop
    v_thu_tu := v_thu_tu + 1;
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, anh_de, dap_an_key, diem, form_dien_id, dien, o_rule)
    values (v_bt, v_thu_tu, 1, r.ma, 'dien_o',
      r.de || case when r.gia_thiet is not null then E'\n' || r.gia_thiet else '' end, r.anh,
      (select jsonb_agg(o->>'dap_an' order by i) from jsonb_array_elements(r.o) with ordinality t(o, i)), 1, r.id,
      jsonb_build_object('buoc', r.buoc, 'o', public._dien_hs_view(r.o)),
      (select jsonb_agg((select jsonb_agg(case when (p->>'dung')::boolean then null else to_jsonb(p->>'loi') end order by j)
                         from jsonb_array_elements(o->'phuong_an') with ordinality q(p, j)) order by i)
         from jsonb_array_elements(r.o) with ordinality t(o, i)));
  end loop;
  if v_thu_tu = 0 then raise exception 'Chưa có bài chứng minh nào để luyện — thầy cô đang duyệt, quay lại sau nhé.'; end if;
  update bai_test set so_cau = v_thu_tu where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', v_thu_tu);
end $$;
grant execute on function public.tu_luyen_dien_sinh(text, integer) to authenticated;

create or replace function public.hs_dien_tra_loi(p_bai_lam_id uuid, p_bai_test_cau_id uuid, p_dap_an_hs jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_key jsonb; v_diem numeric; v_v text; v_tl numeric; v_id uuid;
begin
  if not exists (select 1 from bai_lam where id = p_bai_lam_id and hoc_sinh_id = v_hs) then raise exception 'Không phải bài làm của em.'; end if;
  select dap_an_key, diem into v_key, v_diem from bai_test_cau where id = p_bai_test_cau_id and loai_cau = 'dien_o';
  if v_key is null then raise exception 'Câu không phải điền ô.'; end if;
  select verdict, ti_le into v_v, v_tl from fn_dien_cham(v_key, p_dap_an_hs);
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (p_bai_lam_id, p_bai_test_cau_id, p_dap_an_hs, v_v, v_diem * v_tl, 'exact', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_at = now()
    returning id into v_id;
  return jsonb_build_object('verdict', v_v, 'ti_le', v_tl, 'key', v_key, 'bai_lam_cau_id', v_id);
end $$;
grant execute on function public.hs_dien_tra_loi(uuid, uuid, jsonb) to authenticated;

-- ── 7) Đọc lỗi theo ô (staff) ───────────────────────────────────────────────────────────────────────────────
create or replace view v_dien_loi_hs with (security_invoker = true) as
select bl.hoc_sinh_id, btc.ma_cau, btc.form_dien_id, t.i as o_thu, (btc.o_rule -> ((t.i - 1)::int) ->> ((t.v)::int)) as loi_ma, blc.cham_at
from bai_lam_cau blc join bai_test_cau btc on btc.id = blc.bai_test_cau_id join bai_lam bl on bl.id = blc.bai_lam_id
cross join lateral jsonb_array_elements(blc.dap_an_hs) with ordinality t(v, i)
where btc.loai_cau = 'dien_o' and jsonb_typeof(t.v) = 'number'
  and (btc.o_rule -> ((t.i - 1)::int) ->> ((t.v)::int)) is not null;
grant select on v_dien_loi_hs to authenticated;

-- ── 8) Seed danh mục (sinh từ scripts/mcq-lo/hinh-ly-do-catalog.json) — idempotent ──
insert into hinh_ly_do (ma, nhom, ten, phat_bieu, tuong_duong, khoi, duc) values
('LD01','GOC','Hai góc kề bù','Hai góc kề bù có tổng bằng 180°','{"hai góc kề bù","kề bù trên đường thẳng"}','{"7","8"}',true),
('LD02','GOC','Hai góc đối đỉnh','Hai góc đối đỉnh thì bằng nhau','{"hai góc đối đỉnh","đối đỉnh"}','{"7","8"}',true),
('LD03','GOC','Tia phân giác của một góc','Tia phân giác chia góc thành hai góc bằng nhau','{"là tia phân giác của góc","phân giác"}','{"7","8","9"}',true),
('LD04','GOC_SS','Hai góc so le trong','Hai đường thẳng song song bị cắt bởi cát tuyến thì hai góc so le trong bằng nhau','{"hai góc so le trong","so le trong"}','{"7","8"}',true),
('LD05','GOC_SS','Hai góc đồng vị','Hai đường thẳng song song bị cắt bởi cát tuyến thì hai góc đồng vị bằng nhau','{"hai góc đồng vị","đồng vị","cùng vị trí"}','{"7","8"}',true),
('LD06','GOC_SS','Hai góc trong cùng phía','Hai đường thẳng song song bị cắt bởi cát tuyến thì hai góc trong cùng phía bù nhau','{"hai góc trong cùng phía"}','{"7","8"}',true),
('LD07','GOC_SS','Dấu hiệu nhận biết hai đường thẳng song song','Cát tuyến tạo với hai đường thẳng một cặp góc so le trong (hoặc đồng vị) bằng nhau thì hai đường thẳng song song','{}','{"7"}',true),
('LD08','SS_VG','Cùng vuông góc với đường thứ ba','Hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba thì song song với nhau','{"cùng vuông góc với","cùng vuông góc"}','{"7","8"}',true),
('LD09','SS_VG','Vuông góc với một trong hai đường song song','Đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường còn lại','{"đường thẳng vuông góc với 1 trong 2 đường thẳng song song thì vuông góc với đường còn lại"}','{"7"}',true),
('LD10','SS_VG','Cùng song song với đường thứ ba','Hai đường thẳng phân biệt cùng song song với đường thẳng thứ ba thì song song với nhau','{}','{"7"}',true),
('LD11','TG','Tổng ba góc của tam giác','Tổng ba góc trong một tam giác bằng 180°','{"tổng các góc trong"}','{"7","8"}',true),
('LD12','TG','Góc ngoài của tam giác','Góc ngoài bằng tổng hai góc trong không kề với nó','{}','{"7"}',true),
('LD13','TG','Tam giác cân','Tam giác cân có hai góc ở đáy bằng nhau; ngược lại tam giác có hai góc bằng nhau là tam giác cân','{"từ hai tam giác cân","hai cạnh đối diện với hai góc bằng nhau"}','{"7","8"}',true),
('LD14','TG','Tam giác đều','Tam giác đều có ba cạnh bằng nhau và ba góc bằng 60°','{}','{"7"}',true),
('LD15','TG','Định lý Pythagore','Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông','{"do ab^2=ah^2+bh^2"}','{"7","8","9"}',true),
('LD16','TG','Bất đẳng thức tam giác','Mỗi cạnh nhỏ hơn tổng và lớn hơn hiệu hai cạnh còn lại','{}','{"7"}',true),
('LD17','TG','Quan hệ góc và cạnh đối diện','Trong tam giác, góc đối diện với cạnh lớn hơn thì lớn hơn và ngược lại','{"cạnh đối diện với"}','{"7","9"}',true),
('LD18','TG','Đường vuông góc và đường xiên','Đường vuông góc ngắn hơn mọi đường xiên kẻ từ một điểm đến một đường thẳng','{}','{"7"}',true),
('LD19','TG_BN','Hai tam giác bằng nhau c.c.c','Ba cạnh của tam giác này bằng ba cạnh của tam giác kia','{"c.c.c"}','{"7","8"}',true),
('LD20','TG_BN','Hai tam giác bằng nhau c.g.c','Hai cạnh và góc xen giữa bằng nhau','{"c.g.c"}','{"7","8"}',true),
('LD21','TG_BN','Hai tam giác bằng nhau g.c.g','Một cạnh và hai góc kề bằng nhau','{"g.c.g"}','{"7","8"}',true),
('LD22','TG_BN','Tam giác vuông: cạnh huyền – góc nhọn','Hai tam giác vuông có cạnh huyền và một góc nhọn bằng nhau','{"ch - gn","cạnh huyền – góc nhọn","cạnh huyền - góc nhọn","$ch - gn$"}','{"7","8"}',true),
('LD23','TG_BN','Tam giác vuông: cạnh huyền – cạnh góc vuông','Hai tam giác vuông có cạnh huyền và một cạnh góc vuông bằng nhau','{"cạnh huyền – cạnh góc vuông"}','{"7","8"}',true),
('LD24','TG_BN','Tam giác vuông: hai cạnh góc vuông','Hai tam giác vuông có hai cạnh góc vuông tương ứng bằng nhau','{}','{"7","8"}',true),
('LD25','TG_BN','Các yếu tố tương ứng của hai tam giác bằng nhau','Hai tam giác bằng nhau thì các cạnh tương ứng và các góc tương ứng bằng nhau','{"vì tương ứng","hai cạnh tương ứng"}','{"7","8"}',true),
('LD26','TG_DD','Đường trung trực','Điểm nằm trên trung trực của đoạn thẳng thì cách đều hai đầu mút, và ngược lại','{}','{"7"}',true),
('LD27','TG_DD','Trọng tâm – đường trung tuyến','Ba trung tuyến đồng quy tại trọng tâm, cách mỗi đỉnh 2/3 độ dài trung tuyến','{}','{"7"}',true),
('LD28','TG_DD','Đường phân giác – điểm cách đều hai cạnh','Điểm nằm trên tia phân giác của góc thì cách đều hai cạnh của góc, và ngược lại','{}','{"7"}',true),
('LD29','TG_DD','Đường cao – trực tâm','Ba đường cao của tam giác đồng quy tại trực tâm','{"đường cao"}','{"7","9"}',true),
('LD30','TG_DD','Đường trung bình của tam giác','Đường trung bình song song với cạnh thứ ba và bằng nửa cạnh ấy','{}','{"8"}',true),
('LD31','TG_DD','Trung tuyến ứng với cạnh huyền','Trong tam giác vuông, trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền; ngược lại tam giác có trung tuyến bằng nửa cạnh tương ứng là tam giác vuông','{}','{"8","9"}',true),
('LD32','TU_GIAC','Tổng các góc của tứ giác','Tổng bốn góc của tứ giác bằng 360°','{}','{"8"}',true),
('LD33','TU_GIAC','Hình bình hành: cạnh đối','Trong hình bình hành các cạnh đối song song và bằng nhau','{"cạnh đối hbh","cạnh đối hình bình hành"}','{"8"}',true),
('LD34','TU_GIAC','Hình bình hành: góc đối','Trong hình bình hành các góc đối bằng nhau','{}','{"8"}',true),
('LD35','TU_GIAC','Hình bình hành: đường chéo','Hai đường chéo hình bình hành cắt nhau tại trung điểm mỗi đường','{"tính chất đường chéo hình bình hành","tính chất đường chéo hbh","trung điểm mỗi đường chéo","đồng thời là trung điểm mỗi đường"}','{"8"}',true),
('LD36','TU_GIAC','Dấu hiệu nhận biết hình bình hành','Tứ giác có các cạnh đối song song / cạnh đối bằng nhau / hai cạnh đối song song và bằng nhau / góc đối bằng nhau / hai đường chéo cắt nhau tại trung điểm mỗi đường','{}','{"8"}',true),
('LD37','TU_GIAC','Hình chữ nhật: tính chất','Hình chữ nhật có hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường','{"hai đường chéo hình chữ nhật bằng nhau"}','{"8","9"}',true),
('LD38','TU_GIAC','Dấu hiệu nhận biết hình chữ nhật','Tứ giác có ba góc vuông / hình thang cân có một góc vuông / hình bình hành có một góc vuông hoặc hai đường chéo bằng nhau','{}','{"8"}',true),
('LD39','TU_GIAC','Hình thoi: tính chất','Hình thoi có hai đường chéo vuông góc và là phân giác các góc','{}','{"8"}',true),
('LD40','TU_GIAC','Dấu hiệu nhận biết hình thoi','Tứ giác có bốn cạnh bằng nhau / hình bình hành có hai cạnh kề bằng nhau, hai đường chéo vuông góc, hoặc một đường chéo là phân giác','{}','{"8"}',true),
('LD41','TU_GIAC','Hình vuông: tính chất và dấu hiệu','Hình vuông có mọi tính chất của hình chữ nhật và hình thoi','{}','{"8"}',true),
('LD42','TU_GIAC','Hình thang cân: tính chất và dấu hiệu','Hình thang cân có hai góc kề một đáy bằng nhau, hai đường chéo bằng nhau; hình thang có hai góc kề đáy bằng nhau là hình thang cân','{}','{"8"}',true),
('LD43','TU_GIAC','Đường trung bình của hình thang','Đường trung bình của hình thang song song với hai đáy và bằng nửa tổng hai đáy','{}','{"8"}',true),
('LD44','DONG_DANG','Định lý Thales và hệ quả','Đường thẳng song song với một cạnh của tam giác định ra trên hai cạnh kia những đoạn tương ứng tỉ lệ','{}','{"8"}',true),
('LD45','DONG_DANG','Tính chất đường phân giác trong tam giác','Đường phân giác chia cạnh đối diện thành hai đoạn tỉ lệ với hai cạnh kề','{}','{"8"}',true),
('LD46','DONG_DANG','Tam giác đồng dạng g.g','Hai tam giác có hai cặp góc bằng nhau thì đồng dạng','{}','{"8"}',true),
('LD47','DONG_DANG','Tam giác đồng dạng c.g.c / c.c.c','Hai cặp cạnh tỉ lệ và góc xen giữa bằng nhau, hoặc ba cặp cạnh tỉ lệ','{}','{"8"}',true),
('LD48','L9','Hệ thức lượng trong tam giác vuông','b² = ab'', c² = ac'', h² = b''c'', ah = bc, 1/h² = 1/b² + 1/c²','{"hệ thức lượng trong tam giác vuông"}','{"9"}',true),
('LD49','L9','Tỉ số lượng giác của góc nhọn','sin, cos, tan, cot của góc nhọn trong tam giác vuông; hai góc phụ nhau có sin góc này bằng cos góc kia','{"tỉ số lượng giác của góc nhọn trong tam giác vuông"}','{"9"}',true),
('LD50','L9','Đường tròn: tâm, bán kính, đường kính','Điểm thuộc đường tròn khi cách tâm một khoảng bằng bán kính; tâm là trung điểm đường kính','{"tâm là trung điểm","là hai đầu mút đường kính"}','{"9"}',true),
('LD51','L9','Góc nội tiếp chắn nửa đường tròn','Góc nội tiếp chắn nửa đường tròn là góc vuông','{}','{"9"}',true),
('LD52','L9','Tiếp tuyến vuông góc với bán kính','Tiếp tuyến vuông góc với bán kính đi qua tiếp điểm; hai tiếp tuyến cắt nhau thì cách đều tiếp điểm','{}','{"9"}',true),
('GT','KHONG_DUC','Giả thiết / hình vẽ / đã cho','Dẫn từ đề bài hoặc hình vẽ — không phải định lý','{"giả thiết","hình vẽ","theo hình vẽ","từ hình vẽ","đã cho"}','{"7","8","9"}',false),
('CT','KHONG_DUC','Theo câu trên / cách dựng','Tham chiếu kết quả ý trước trong chuỗi bài — không đục lỗ','{"câu a","câu trên","theo câu trước","theo cách dựng ở câu a","dpcm"}','{"7","8","9"}',false),
('TT','KHONG_DUC','Tính toán số học','Cộng độ dài, tổng góc, thay số — có thể là ô giá trị do máy sinh, không phải ô lý do','{"ac+bd","ab+bc+cd+da","mp+nq"}','{"7","8","9"}',false)
on conflict (ma) do update set nhom=excluded.nhom, ten=excluded.ten, phat_bieu=excluded.phat_bieu, tuong_duong=excluded.tuong_duong, khoi=excluded.khoi, duc=excluded.duc;
insert into hinh_loi_cm (ma, ten, mo_ta, nhom_hoan_doi) values
('E01','Nhầm cặp góc','So le trong ↔ đồng vị ↔ trong cùng phía ↔ đối đỉnh ↔ kề bù','{"GOC","GOC_SS"}'),
('E02','Nhầm trường hợp bằng nhau/đồng dạng','c.c.c ↔ c.g.c ↔ g.c.g ↔ ch-gn ↔ ch-cgv; g.g ↔ c.g.c','{"TG_BN","DONG_DANG"}'),
('E03','Đảo chiều định lý','Dùng tính chất thay cho dấu hiệu nhận biết hoặc ngược lại (hbh có cạnh đối bằng nhau ↔ tứ giác có cạnh đối bằng nhau là hbh)','{"TU_GIAC","SS_VG"}'),
('E04','Dùng điều chưa chứng minh','Viện dẫn kết luận của chính bước đang chứng minh hoặc bước sau','{}'),
('E05','Nhầm đối tượng','Đúng định lý nhưng áp lên sai cặp góc/cạnh/tam giác','{}')
on conflict (ma) do update set ten=excluded.ten, mo_ta=excluded.mo_ta, nhom_hoan_doi=excluded.nhom_hoan_doi;
