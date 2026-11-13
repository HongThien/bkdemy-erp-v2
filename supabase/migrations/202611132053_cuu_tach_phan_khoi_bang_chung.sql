-- CỨU (13/11/2026 tối): tách mọi bảng nhánh khỏi bảng chung kho_* — PostgREST KHÔNG lộ bảng là "phần" (partition) ra API
-- ⇒ mọi chỗ app đọc thẳng <nhánh>_<họ> báo "Could not find the table 'public.hgt_cau_hoi' in the schema cache" (ET, kho, tài liệu…).
-- Bài học: cách "gắn làm phần" (mig 202611131904 … 202611132033) KHÔNG dùng được chừng nào client còn đọc bảng nhánh qua API.
-- Giữ lại: cột `kho` trên bảng nhánh (hằng, vô hại) · các cột đã làm khớp · bảng tra kho_cau_dang (đọc qua view gộp dưới đây).
-- Các bảng kho_<họ> (đã rỗng, không còn phần nào) CHƯA xoá — chờ Thùy.
set local lock_timeout = '8s';
alter table public.kho_ban_do detach partition public.dai_ban_do;
alter table public.kho_ban_do detach partition public.hgt_ban_do;
alter table public.kho_ban_do detach partition public.hoahoc_ban_do;
alter table public.kho_ban_do detach partition public.khtn_ban_do;
alter table public.kho_ban_do detach partition public.vatly_ban_do;
alter table public.kho_bdm_cau_thieu_dang detach partition public.dai_bdm_cau_thieu_dang;
alter table public.kho_bdm_cau_thieu_dang detach partition public.hgt_bdm_cau_thieu_dang;
alter table public.kho_bdm_cau_thieu_dang detach partition public.hoahoc_bdm_cau_thieu_dang;
alter table public.kho_bdm_cau_thieu_dang detach partition public.khtn_bdm_cau_thieu_dang;
alter table public.kho_bdm_cau_thieu_dang detach partition public.vatly_bdm_cau_thieu_dang;
alter table public.kho_bdm_chu_de detach partition public.dai_bdm_chu_de;
alter table public.kho_bdm_chu_de detach partition public.hoahoc_bdm_chu_de;
alter table public.kho_bdm_chu_de detach partition public.khtn_bdm_chu_de;
alter table public.kho_bdm_chu_de detach partition public.vatly_bdm_chu_de;
alter table public.kho_bdm_chuyen_de detach partition public.dai_bdm_chuyen_de;
alter table public.kho_bdm_chuyen_de detach partition public.hoahoc_bdm_chuyen_de;
alter table public.kho_bdm_chuyen_de detach partition public.khtn_bdm_chuyen_de;
alter table public.kho_bdm_chuyen_de detach partition public.vatly_bdm_chuyen_de;
alter table public.kho_bdm_dang_bai detach partition public.dai_bdm_dang_bai;
alter table public.kho_bdm_dang_bai detach partition public.hoahoc_bdm_dang_bai;
alter table public.kho_bdm_dang_bai detach partition public.khtn_bdm_dang_bai;
alter table public.kho_bdm_dang_bai detach partition public.vatly_bdm_dang_bai;
alter table public.kho_bdm_de_xuat detach partition public.dai_bdm_de_xuat;
alter table public.kho_bdm_de_xuat detach partition public.hgt_bdm_de_xuat;
alter table public.kho_bdm_de_xuat detach partition public.hoahoc_bdm_de_xuat;
alter table public.kho_bdm_de_xuat detach partition public.khtn_bdm_de_xuat;
alter table public.kho_bdm_de_xuat detach partition public.vatly_bdm_de_xuat;
alter table public.kho_bdm_gan_cau detach partition public.dai_bdm_gan_cau;
alter table public.kho_bdm_gan_cau detach partition public.hgt_bdm_gan_cau;
alter table public.kho_bdm_gan_cau detach partition public.hoahoc_bdm_gan_cau;
alter table public.kho_bdm_gan_cau detach partition public.khtn_bdm_gan_cau;
alter table public.kho_bdm_gan_cau detach partition public.vatly_bdm_gan_cau;
alter table public.kho_bdm_kiem_mau detach partition public.dai_bdm_kiem_mau;
alter table public.kho_bdm_kiem_mau detach partition public.hgt_bdm_kiem_mau;
alter table public.kho_bdm_kiem_mau detach partition public.hoahoc_bdm_kiem_mau;
alter table public.kho_bdm_kiem_mau detach partition public.khtn_bdm_kiem_mau;
alter table public.kho_bdm_kiem_mau detach partition public.vatly_bdm_kiem_mau;
alter table public.kho_bdm_log detach partition public.dai_bdm_log;
alter table public.kho_bdm_log detach partition public.hoahoc_bdm_log;
alter table public.kho_bdm_log detach partition public.khtn_bdm_log;
alter table public.kho_bdm_log detach partition public.vatly_bdm_log;
alter table public.kho_bdm_nhom detach partition public.dai_bdm_nhom;
alter table public.kho_bdm_nhom detach partition public.hoahoc_bdm_nhom;
alter table public.kho_bdm_nhom detach partition public.khtn_bdm_nhom;
alter table public.kho_bdm_nhom detach partition public.vatly_bdm_nhom;
alter table public.kho_bdm_nhom_tien_de detach partition public.dai_bdm_nhom_tien_de;
alter table public.kho_bdm_nhom_tien_de detach partition public.hoahoc_bdm_nhom_tien_de;
alter table public.kho_bdm_nhom_tien_de detach partition public.khtn_bdm_nhom_tien_de;
alter table public.kho_bdm_nhom_tien_de detach partition public.vatly_bdm_nhom_tien_de;
alter table public.kho_bdm_o detach partition public.dai_bdm_o;
alter table public.kho_bdm_o detach partition public.hoahoc_bdm_o;
alter table public.kho_bdm_o detach partition public.khtn_bdm_o;
alter table public.kho_bdm_o detach partition public.vatly_bdm_o;
alter table public.kho_bdm_tu_choi detach partition public.dai_bdm_tu_choi;
alter table public.kho_bdm_tu_choi detach partition public.hgt_bdm_tu_choi;
alter table public.kho_bdm_tu_choi detach partition public.hoahoc_bdm_tu_choi;
alter table public.kho_bdm_tu_choi detach partition public.khtn_bdm_tu_choi;
alter table public.kho_bdm_tu_choi detach partition public.vatly_bdm_tu_choi;
alter table public.kho_cau_form_tn detach partition public.dai_cau_form_tn;
alter table public.kho_cau_form_tn detach partition public.hgt_cau_form_tn;
alter table public.kho_cau_form_tn detach partition public.hoahoc_cau_form_tn;
alter table public.kho_cau_form_tn detach partition public.khtn_cau_form_tn;
alter table public.kho_cau_form_tn detach partition public.vatly_cau_form_tn;
alter table public.kho_cau_hoi detach partition public.dai_cau_hoi;
alter table public.kho_cau_hoi detach partition public.hgt_cau_hoi;
alter table public.kho_cau_hoi detach partition public.hoahoc_cau_hoi;
alter table public.kho_cau_hoi detach partition public.khtn_cau_hoi;
alter table public.kho_cau_hoi detach partition public.vatly_cau_hoi;
alter table public.kho_cau_hoi_yeu_cau_giai detach partition public.dai_cau_hoi_yeu_cau_giai;
alter table public.kho_cau_hoi_yeu_cau_giai detach partition public.hgt_cau_hoi_yeu_cau_giai;
alter table public.kho_cau_hoi_yeu_cau_giai detach partition public.hoahoc_cau_hoi_yeu_cau_giai;
alter table public.kho_cau_hoi_yeu_cau_giai detach partition public.khtn_cau_hoi_yeu_cau_giai;
alter table public.kho_cau_hoi_yeu_cau_giai detach partition public.vatly_cau_hoi_yeu_cau_giai;
alter table public.kho_chuyen_de_ly_thuyet detach partition public.dai_chuyen_de_ly_thuyet;
alter table public.kho_chuyen_de_ly_thuyet detach partition public.hgt_chuyen_de_ly_thuyet;
alter table public.kho_chuyen_de_ly_thuyet detach partition public.hoahoc_chuyen_de_ly_thuyet;
alter table public.kho_chuyen_de_ly_thuyet detach partition public.khtn_chuyen_de_ly_thuyet;
alter table public.kho_chuyen_de_ly_thuyet detach partition public.vatly_chuyen_de_ly_thuyet;
alter table public.kho_cum_bai detach partition public.dai_cum_bai;
alter table public.kho_cum_bai detach partition public.hgt_cum_bai;
alter table public.kho_cum_bai detach partition public.hoahoc_cum_bai;
alter table public.kho_cum_bai detach partition public.khtn_cum_bai;
alter table public.kho_cum_bai detach partition public.vatly_cum_bai;
alter table public.kho_cum_tien_de detach partition public.dai_cum_tien_de;
alter table public.kho_cum_tien_de detach partition public.hgt_cum_tien_de;
alter table public.kho_cum_tien_de detach partition public.hoahoc_cum_tien_de;
alter table public.kho_cum_tien_de detach partition public.khtn_cum_tien_de;
alter table public.kho_cum_tien_de detach partition public.vatly_cum_tien_de;
alter table public.kho_dang_ly_thuyet detach partition public.dai_dang_ly_thuyet;
alter table public.kho_dang_ly_thuyet detach partition public.hgt_dang_ly_thuyet;
alter table public.kho_dang_ly_thuyet detach partition public.hoahoc_dang_ly_thuyet;
alter table public.kho_dang_ly_thuyet detach partition public.khtn_dang_ly_thuyet;
alter table public.kho_dang_ly_thuyet detach partition public.vatly_dang_ly_thuyet;
alter table public.kho_dang_tien_de detach partition public.dai_dang_tien_de;
alter table public.kho_dang_tien_de detach partition public.hgt_dang_tien_de;
alter table public.kho_dang_tien_de detach partition public.hoahoc_dang_tien_de;
alter table public.kho_dang_tien_de detach partition public.khtn_dang_tien_de;
alter table public.kho_dang_tien_de detach partition public.vatly_dang_tien_de;
alter table public.kho_de_xuat detach partition public.dai_de_xuat;
alter table public.kho_de_xuat detach partition public.hoahoc_de_xuat;
alter table public.kho_de_xuat detach partition public.khtn_de_xuat;
alter table public.kho_de_xuat detach partition public.vatly_de_xuat;
alter table public.kho_de_xuat_cau detach partition public.dai_de_xuat_cau;
alter table public.kho_de_xuat_cau detach partition public.hoahoc_de_xuat_cau;
alter table public.kho_de_xuat_cau detach partition public.khtn_de_xuat_cau;
alter table public.kho_de_xuat_cau detach partition public.vatly_de_xuat_cau;
alter table public.kho_de_xuat_quyet_dinh detach partition public.dai_de_xuat_quyet_dinh;
alter table public.kho_de_xuat_quyet_dinh detach partition public.hoahoc_de_xuat_quyet_dinh;
alter table public.kho_de_xuat_quyet_dinh detach partition public.khtn_de_xuat_quyet_dinh;
alter table public.kho_de_xuat_quyet_dinh detach partition public.vatly_de_xuat_quyet_dinh;
alter table public.kho_mcq_rule detach partition public.dai_mcq_rule;
alter table public.kho_mcq_rule detach partition public.hgt_mcq_rule;
alter table public.kho_mcq_rule detach partition public.hoahoc_mcq_rule;
alter table public.kho_mcq_rule detach partition public.khtn_mcq_rule;
alter table public.kho_mcq_rule detach partition public.vatly_mcq_rule;

-- bảng tra: đọc 3 họ qua view gộp (tạm, tới khi có cách gộp dùng được với API)
create or replace view public.v_kho_cau_hoi with (security_invoker = on) as
  select ma_cau, parent_ma_cau, kho from public.dai_cau_hoi
  union all
  select ma_cau, parent_ma_cau, kho from public.hgt_cau_hoi
  union all
  select ma_cau, parent_ma_cau, kho from public.khtn_cau_hoi
  union all
  select ma_cau, parent_ma_cau, kho from public.vatly_cau_hoi
  union all
  select ma_cau, parent_ma_cau, kho from public.hoahoc_cau_hoi;
create or replace view public.v_kho_bdm_gan_cau with (security_invoker = on) as
  select ma_cau, dang_bai_id, kho from public.dai_bdm_gan_cau
  union all
  select ma_cau, dang_bai_id, kho from public.hgt_bdm_gan_cau
  union all
  select ma_cau, dang_bai_id, kho from public.khtn_bdm_gan_cau
  union all
  select ma_cau, dang_bai_id, kho from public.vatly_bdm_gan_cau
  union all
  select ma_cau, dang_bai_id, kho from public.hoahoc_bdm_gan_cau;
create or replace view public.v_kho_bdm_de_xuat with (security_invoker = on) as
  select ma_cau, dang_bai_id, kho from public.dai_bdm_de_xuat
  union all
  select ma_cau, dang_bai_id, kho from public.hgt_bdm_de_xuat
  union all
  select ma_cau, dang_bai_id, kho from public.khtn_bdm_de_xuat
  union all
  select ma_cau, dang_bai_id, kho from public.vatly_bdm_de_xuat
  union all
  select ma_cau, dang_bai_id, kho from public.hoahoc_bdm_de_xuat;
revoke all on public.v_kho_cau_hoi, public.v_kho_bdm_gan_cau, public.v_kho_bdm_de_xuat from anon;

create or replace function public._kho_cau_dang_tinh(p_kho text default null, p_ma text[] default null)
returns table (kho text, ma_cau text, dang_bai_id text, nguon text)
language sql stable security definer set search_path = public
as $$
  select q.kho, q.ma_cau,
         coalesce(g.dang_bai_id, gg.dang_bai_id, d.dang_bai_id, dg.dang_bai_id),
         case when g.ma_cau is not null or gg.ma_cau is not null then 'gan_cau' else 'de_xuat' end
    from public.v_kho_cau_hoi q
    left join public.v_kho_bdm_gan_cau g  on g.kho  = q.kho and g.ma_cau  = q.ma_cau
    left join public.v_kho_bdm_gan_cau gg on gg.kho = q.kho and gg.ma_cau = q.parent_ma_cau
    left join public.v_kho_bdm_de_xuat d  on d.kho  = q.kho and d.ma_cau  = q.ma_cau
    left join public.v_kho_bdm_de_xuat dg on dg.kho = q.kho and dg.ma_cau = q.parent_ma_cau
   where (p_kho is null or q.kho = p_kho)
     and (p_ma is null or q.ma_cau = any (p_ma) or q.parent_ma_cau = any (p_ma))
     and coalesce(g.ma_cau, gg.ma_cau, d.ma_cau, dg.ma_cau) is not null
$$;

create or replace function public._kho_cau_dang_lam_lai(p_kho text, p_ma text[])
returns void language sql security definer set search_path = public
as $$
  with moi as (select * from public._kho_cau_dang_tinh(p_kho, p_ma)),
  xoa as (
    delete from public.kho_cau_dang t
     where t.kho = p_kho
       and (t.ma_cau = any (p_ma) or t.ma_cau in (select q.ma_cau from public.v_kho_cau_hoi q where q.kho = p_kho and q.parent_ma_cau = any (p_ma)))
       and not exists (select 1 from moi m where m.ma_cau = t.ma_cau)
    returning 1)
  insert into public.kho_cau_dang as t (kho, ma_cau, dang_bai_id, nguon)
  select m.kho, m.ma_cau, m.dang_bai_id, m.nguon from moi m
  on conflict (kho, ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon
   where t.dang_bai_id is distinct from excluded.dang_bai_id or t.nguon is distinct from excluded.nguon
$$;

-- trigger giữ đồng bộ: đặt lại trên TỪNG bảng nhánh (trigger ở bảng chung mất khi tách phần)
drop trigger if exists kho_cau_dang_gan on public.dai_bdm_gan_cau;
create trigger kho_cau_dang_gan after insert or update or delete on public.dai_bdm_gan_cau for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_gan on public.hgt_bdm_gan_cau;
create trigger kho_cau_dang_gan after insert or update or delete on public.hgt_bdm_gan_cau for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_gan on public.khtn_bdm_gan_cau;
create trigger kho_cau_dang_gan after insert or update or delete on public.khtn_bdm_gan_cau for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_gan on public.vatly_bdm_gan_cau;
create trigger kho_cau_dang_gan after insert or update or delete on public.vatly_bdm_gan_cau for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_gan on public.hoahoc_bdm_gan_cau;
create trigger kho_cau_dang_gan after insert or update or delete on public.hoahoc_bdm_gan_cau for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_dexuat on public.dai_bdm_de_xuat;
create trigger kho_cau_dang_dexuat after insert or update or delete on public.dai_bdm_de_xuat for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_dexuat on public.hgt_bdm_de_xuat;
create trigger kho_cau_dang_dexuat after insert or update or delete on public.hgt_bdm_de_xuat for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_dexuat on public.khtn_bdm_de_xuat;
create trigger kho_cau_dang_dexuat after insert or update or delete on public.khtn_bdm_de_xuat for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_dexuat on public.vatly_bdm_de_xuat;
create trigger kho_cau_dang_dexuat after insert or update or delete on public.vatly_bdm_de_xuat for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_dexuat on public.hoahoc_bdm_de_xuat;
create trigger kho_cau_dang_dexuat after insert or update or delete on public.hoahoc_bdm_de_xuat for each row execute function public._trg_kho_cau_dang();
drop trigger if exists kho_cau_dang_cau on public.dai_cau_hoi;
create trigger kho_cau_dang_cau after insert or delete or update of parent_ma_cau, ma_cau on public.dai_cau_hoi for each row execute function public._trg_kho_cau_dang_cau();
drop trigger if exists kho_cau_dang_cau on public.hgt_cau_hoi;
create trigger kho_cau_dang_cau after insert or delete or update of parent_ma_cau, ma_cau on public.hgt_cau_hoi for each row execute function public._trg_kho_cau_dang_cau();
drop trigger if exists kho_cau_dang_cau on public.khtn_cau_hoi;
create trigger kho_cau_dang_cau after insert or delete or update of parent_ma_cau, ma_cau on public.khtn_cau_hoi for each row execute function public._trg_kho_cau_dang_cau();
drop trigger if exists kho_cau_dang_cau on public.vatly_cau_hoi;
create trigger kho_cau_dang_cau after insert or delete or update of parent_ma_cau, ma_cau on public.vatly_cau_hoi for each row execute function public._trg_kho_cau_dang_cau();
drop trigger if exists kho_cau_dang_cau on public.hoahoc_cau_hoi;
create trigger kho_cau_dang_cau after insert or delete or update of parent_ma_cau, ma_cau on public.hoahoc_cau_hoi for each row execute function public._trg_kho_cau_dang_cau();

-- làm lại bảng tra cho chắc (phòng có ghi trong lúc chuyển)
delete from public.kho_cau_dang t where not exists (select 1 from public._kho_cau_dang_tinh() m where m.kho = t.kho and m.ma_cau = t.ma_cau);
insert into public.kho_cau_dang as t (kho, ma_cau, dang_bai_id, nguon) select kho, ma_cau, dang_bai_id, nguon from public._kho_cau_dang_tinh()
  on conflict (kho, ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon;

notify pgrst, 'reload schema';
