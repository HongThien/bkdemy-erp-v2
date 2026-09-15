-- MCQ FORM — phiên bản TRẮC NGHIỆM (distractor theo lỗi) của câu tính toán. Spec: spec-mcq-form.md (CEO chốt 08/09).
-- Pool 1 = Toán lớp 7 "Số hữu tỉ" nhóm tính toán → chỉ tạo bộ dai_*; KHTN/HGT tạo cùng DDL khi cần (§1.6 symmetry).
--
-- Vì sao bảng RIÊNG khoá ma_cau, KHÔNG đổ lua_chon vào dai_cau_hoi: etFormOf (src/lib/tailieu.ts) coi "có lua_chon"
-- = trắc nghiệm ⇒ đổ vào gốc là mọi ET in giấy / mã đề 2/3 / phiếu chấm đang dùng câu đó TỰ ĐỔI FORM. Câu gốc bất động.

-- ── 1) Bảng rule lỗi (canonical, theo môn) ──────────────────────────────────────────────────────────────────
create table if not exists dai_mcq_rule (
  ma          text primary key,                       -- 'R01'..
  ten         text not null,
  mo_ta       text not null,                          -- cách sai
  vi_du       text,                                   -- LaTeX
  nhom        text not null check (nhom in ('khai_niem', 'tinh')),  -- dạy lại quy tắc / luyện cẩn thận
  ap_dung     text[] not null default '{}',           -- ma_dang GỢI Ý (không ràng buộc cứng)
  du_phong    boolean not null default false,         -- rule dự phòng: ≤1 distractor/câu (spec §4)
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table dai_mcq_rule enable row level security;
drop policy if exists dai_mcq_rule_member_all on dai_mcq_rule;
create policy dai_mcq_rule_member_all on dai_mcq_rule
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on dai_mcq_rule to authenticated;

-- ── 2) Form MCQ của câu ─────────────────────────────────────────────────────────────────────────────────────
create table if not exists dai_cau_form_tn (
  id              uuid primary key default gen_random_uuid(),
  ma_cau          text not null references dai_cau_hoi(ma_cau),
  -- MẢNG đúng 4 phần tử, thứ tự = thứ tự HS thấy (không đảo lúc snapshot). Phần tử:
  --   { "text": "$-\dfrac{5}{4}$", "dung": true }
  --   { "text": "...", "dung": false, "rule": "R19", "duong_sai": "chuyển vế không đổi dấu → ..." }
  lua_chon        jsonb not null,
  dap_an          text not null check (dap_an in ('A', 'B', 'C', 'D')),
  key_gia_tri     text not null,                      -- đáp số CHUẨN HOÁ (scripts/lib/huuti.mjs) — nhân chứng thứ hai
  nguon           text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  ai_model        text,
  sinh_at         timestamptz not null default now(),
  da_duyet        boolean not null default false,
  duyet_boi       uuid references nhan_su(id),
  duyet_at        timestamptz,
  sua_truoc_duyet boolean not null default false,     -- người SỬA phương án rồi mới duyệt → metric precision
  tu_choi_ly_do   text,
  xoa_at          timestamptz,                        -- kho rác (§2): từ chối = set xoa_at, KHÔNG delete
  updated_at      timestamptz not null default now()
);
-- 1 form HIỆU LỰC / câu. Sinh lại = set xoa_at bản cũ rồi insert bản mới.
create unique index if not exists dai_cau_form_tn_1_hieu_luc on dai_cau_form_tn (ma_cau) where xoa_at is null;
create index if not exists dai_cau_form_tn_cho_duyet on dai_cau_form_tn (da_duyet) where xoa_at is null;

-- Kiểm cấu trúc lua_chon ở DB (không chỉ ở script): 4 phương án · đúng 1 dung=true · vị trí khớp dap_an ·
-- mọi phương án sai có rule TỒN TẠI. Rule tồn tại không CHECK được (tham chiếu bảng khác) → trigger.
create or replace function public.dai_cau_form_tn_kiem() returns trigger
language plpgsql as $$
declare v_n int; v_dung int; v_idx int; v_rule text; v_thieu text;
begin
  if jsonb_typeof(new.lua_chon) <> 'array' then raise exception 'lua_chon phải là mảng'; end if;
  v_n := jsonb_array_length(new.lua_chon);
  if v_n <> 4 then raise exception 'lua_chon phải đúng 4 phương án (đang %)', v_n; end if;
  select count(*) into v_dung from jsonb_array_elements(new.lua_chon) e where (e->>'dung')::boolean;
  if v_dung <> 1 then raise exception 'phải đúng 1 phương án dung=true (đang %)', v_dung; end if;
  v_idx := ascii(new.dap_an) - 65;
  if coalesce((new.lua_chon -> v_idx ->> 'dung')::boolean, false) is not true then
    raise exception 'dap_an=% không khớp vị trí phương án dung=true', new.dap_an;
  end if;
  if exists (select 1 from jsonb_array_elements(new.lua_chon) e where coalesce(trim(e->>'text'), '') = '') then
    raise exception 'phương án có text trống';
  end if;
  select string_agg(e->>'rule', ',') into v_thieu
    from jsonb_array_elements(new.lua_chon) e
    where not (e->>'dung')::boolean
      and (e->>'rule' is null or not exists (select 1 from dai_mcq_rule r where r.ma = e->>'rule'));
  if v_thieu is not null then raise exception 'phương án sai thiếu rule hoặc rule không tồn tại: %', v_thieu; end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists dai_cau_form_tn_kiem on dai_cau_form_tn;
create trigger dai_cau_form_tn_kiem before insert or update on dai_cau_form_tn
  for each row execute function public.dai_cau_form_tn_kiem();

-- Staff-only. HS KHÔNG đọc form trực tiếp — chỉ thấy bản snapshot trong bai_test_cau.
alter table dai_cau_form_tn enable row level security;
drop policy if exists dai_cau_form_tn_member_all on dai_cau_form_tn;
create policy dai_cau_form_tn_member_all on dai_cau_form_tn
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on dai_cau_form_tn to authenticated;

-- Registry SQL (cạnh _kho_cau_tbl / _kho_lt_tbl). Bảng khtn_/hgt_ CHƯA tồn tại — gọi tới là execute format(%I) nổ
-- to, không im lặng; tạo bảng cùng DDL khi môn đó cần (symmetry §1.6).
create or replace function public._kho_form_tn_tbl(p_mon text, p_nhanh text default null)
returns text language sql immutable as $$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_tn'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_tn'
              else 'dai_cau_form_tn' end
$$;

-- ── 3) Snapshot: bai_test_cau thêm 2 cột ────────────────────────────────────────────────────────────────────
-- lua_chon_rule SONG SONG lua_chon theo vị trí (null = phương án đúng, 'R19' = sai theo rule). Đi ngược §2 "danh
-- tính bám khoá tự nhiên" có chủ đích: 2 cột ghi trong CÙNG 1 INSERT, cùng dòng, không bao giờ sửa riêng; form_tn_id
-- giữ đường về bản gốc. Không đổi shape lua_chon (string[]) vì mọi renderer TN hiện có đọc string[].
-- Lộ key? Tự luyện/BTVN: HS vốn đã SELECT được dap_an_key (chấm-reveal-ngay) → không tệ hơn. ET: HS không SELECT
-- bai_test_cau, et_de() liệt kê cột tường minh → cột mới KHÔNG lọt.
alter table bai_test_cau add column if not exists form_tn_id uuid references dai_cau_form_tn(id);
alter table bai_test_cau add column if not exists lua_chon_rule text[];

-- ── 4) Đọc lỗi HS — tính ở DB (§2.0), KHÔNG thêm cột vào bai_lam_cau ───────────────────────────────────────
-- security_invoker: RLS áp theo người gọi (staff thấy theo policy bai_lam_cau; HS chỉ thấy của mình).
create or replace view v_mcq_loi_hs with (security_invoker = true) as
select bl.hoc_sinh_id, bt.mon, btc.ma_dang, btc.ma_cau, btc.form_tn_id,
       btc.lua_chon_rule[(blc.dap_an_hs #>> '{}')::int + 1] as rule_ma,
       blc.cham_at
from bai_lam_cau blc
join bai_test_cau btc on btc.id = blc.bai_test_cau_id
join bai_lam bl on bl.id = blc.bai_lam_id
join bai_test bt on bt.id = bl.bai_test_id
where btc.form_tn_id is not null
  and blc.verdict = 'wrong'
  and jsonb_typeof(blc.dap_an_hs) = 'number';
grant select on v_mcq_loi_hs to authenticated;

-- Đếm lỗi theo rule của 1 HS (1 môn), kèm nhom/ten để client CHỈ render.
create or replace function public.fn_mcq_loi_theo_hs(p_hoc_sinh uuid, p_mon text)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'rule', r.ma, 'ten', r.ten, 'nhom', r.nhom, 'so_lan', s.n, 'dang', s.dangs) order by s.n desc), '[]'::jsonb)
  from (select v.rule_ma, count(*) n, array_agg(distinct v.ma_dang) dangs
        from v_mcq_loi_hs v where v.hoc_sinh_id = p_hoc_sinh and v.mon = p_mon and v.rule_ma is not null
        group by v.rule_ma) s
  join dai_mcq_rule r on r.ma = s.rule_ma
$$;
-- Đếm lỗi theo rule của 1 dạng (toàn bộ HS) — soi "cả lớp dính lỗi gì".
create or replace function public.fn_mcq_loi_theo_dang(p_ma_dang text)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'rule', r.ma, 'ten', r.ten, 'nhom', r.nhom, 'so_lan', s.n, 'so_hs', s.hs) order by s.n desc), '[]'::jsonb)
  from (select v.rule_ma, count(*) n, count(distinct v.hoc_sinh_id) hs
        from v_mcq_loi_hs v where v.ma_dang = p_ma_dang and v.rule_ma is not null
        group by v.rule_ma) s
  join dai_mcq_rule r on r.ma = s.rule_ma
$$;
grant execute on function public.fn_mcq_loi_theo_hs(uuid, text) to authenticated;
grant execute on function public.fn_mcq_loi_theo_dang(text) to authenticated;

-- ── 5) Seed 25 rule pool 1 (spec §4) — idempotent ───────────────────────────────────────────────────────────
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R01','Phá ngoặc không đổi dấu','Bỏ ngoặc sau dấu trừ mà giữ nguyên dấu các hạng tử bên trong','$a-(b-c)=a-b-c$','khai_niem','{T107010401,T107010403,T107010206}',false),
('R02','Luỹ thừa thành nhân','Coi $a^n = a\cdot n$','$3^2=6$','khai_niem','{T107010301,T107010401,T107010404}',false),
('R03','Số âm mũ chẵn ra âm','Giữ dấu âm khi nâng số âm lên mũ chẵn','$\left(-\dfrac25\right)^2=-\dfrac4{25}$','khai_niem','{T107010301,T107010404}',false),
('R04','Cộng số âm lấy dấu sai','Cộng hai số khác dấu: lấy hiệu đúng nhưng dấu sai','$-9+4=5$','khai_niem','{}',false),
('R05','Sai phép cộng/trừ có nhớ','Tính sai ở bước cộng/trừ số nguyên (nhớ, mượn)','$-43+16=-37$','tinh','{}',false),
('R06','Cộng tử với tử, mẫu với mẫu','Cộng/trừ phân số bằng cách cộng tử và cộng mẫu','$\dfrac12+\dfrac13=\dfrac25$','khai_niem','{T107010201,T107010206,T107010203}',false),
('R07','Quy đồng đổi mẫu, quên nhân tử','Đưa về mẫu chung nhưng giữ nguyên tử','$\dfrac12+\dfrac13=\dfrac16+\dfrac16$','khai_niem','{T107010201,T107010206}',false),
('R08','Chia phân số không nghịch đảo','Chia hai phân số như nhân: tử chia tử, mẫu chia mẫu hoặc nhân thẳng','$\dfrac ab:\dfrac cd=\dfrac{ac}{bd}$','khai_niem','{T107010202,T107010207,T107010203}',false),
('R09','Nghịch đảo nhầm phân số thứ nhất','Khi chia, lật ngược phân số bị chia thay vì phân số chia','$\dfrac ab:\dfrac cd=\dfrac ba\cdot\dfrac cd$','khai_niem','{T107010202,T107010203}',false),
('R10','Dấu nhân chia sai','Nhân/chia hai số âm ra âm, hoặc âm với dương ra dương','$(-)\cdot(-)=(-)$','khai_niem','{T107010202,T107010207,T107010401}',false),
('R11','Đổi thập phân sang phân số sai','Đổi số thập phân sai mẫu hoặc sai tử','$0{,}4=\dfrac4{100}$; $0{,}25=\dfrac1{25}$','khai_niem','{T107010202,T107010401,T107010403}',false),
('R12','Tính trái sang phải, cộng trước nhân','Bỏ ưu tiên nhân chia trước cộng trừ','$2+3\cdot4=20$','khai_niem','{T107010401,T107010403}',false),
('R13','Bỏ ưu tiên luỹ thừa','Nhân/chia trước rồi mới luỹ thừa','$2\cdot3^2=36$','khai_niem','{T107010401,T107010301}',false),
('R14','Luỹ thừa mũ 0 sai','Coi $a^0=0$ hoặc $a^0=a$','$\left(\dfrac{2023}{2022}\right)^0=0$','khai_niem','{T107010401,T107010301}',false),
('R15','$-a^2$ coi là $(-a)^2$','Không có ngoặc mà vẫn bình phương cả dấu âm','$-3^2=9$','khai_niem','{T107010301,T107010401}',false),
('R16','Mũ tử, quên mũ mẫu','Nâng luỹ thừa phân số chỉ nâng tử','$\left(\dfrac ab\right)^n=\dfrac{a^n}b$','khai_niem','{T107010301,T107010404}',false),
('R17','Lẫn cộng/nhân số mũ','$(a^m)^n=a^{m+n}$ hoặc $a^m\cdot a^n=a^{mn}$','$(2^3)^2=2^5$','khai_niem','{T107010301}',false),
('R18','Số âm mũ lẻ ra dương','Nâng số âm lên mũ lẻ mà mất dấu âm','$(-1)^5=1$','khai_niem','{T107010301,T107010401}',false),
('R19','Chuyển vế không đổi dấu','Chuyển hạng tử sang vế kia mà giữ nguyên dấu','$x+3=5\Rightarrow x=8$','khai_niem','{T107010203,T107010403,T107010404}',false),
('R20','Chia ngược khi tìm x','$a:x=b\Rightarrow x=ab$ hoặc $x\cdot a=b\Rightarrow x=\dfrac ab$','$\dfrac34:x=\dfrac58\Rightarrow x=\dfrac34\cdot\dfrac58$','khai_niem','{T107010203,T107010403}',false),
('R21','Thiếu nghiệm âm khi $x^2=k$','Chỉ lấy căn dương','$x^2=\dfrac{49}{81}\Rightarrow x=\dfrac79$','khai_niem','{T107010404}',false),
('R22','Mất dấu ở căn bậc lẻ','$x^3=-k$ mà lấy $x$ dương','$x^3=-\dfrac18\Rightarrow x=\dfrac12$','khai_niem','{T107010404}',false),
('R23','Phân phối sai','$ab+ac=a(bc)$ hoặc $a(b+c)=ab+c$','$\dfrac{-5}{17}\cdot\dfrac{31}{33}+\dfrac{-5}{17}\cdot\dfrac2{33}=\dfrac{-5}{17}\cdot\dfrac{62}{1089}$','khai_niem','{T107010206,T107010207}',false),
('R24','Sót một hạng tử / thừa số','Bỏ quên một hạng tử hoặc thừa số của biểu thức','quên $+\dfrac38$ cuối biểu thức','tinh','{}',true),
('R25','Rút gọn sai','Rút gọn phân số sai (chia tử và mẫu cho số khác nhau)','$\dfrac{12}{18}=\dfrac34$','tinh','{}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
