-- LUẬT MỌI KHỐI (Thùy 05/11: "đã sửa luật là đưa vào kho là duyệt luôn cơ mà … sửa luôn luật mọi khối"):
-- câu đã GÁN dạng bài mức cao (nguon='ai') hoặc vào kho Đ/S chủ đề (nguon='ai') ⇒ DB TỰ duyệt (da_duyet=true, duyet_nguon='ai'),
-- MIỄN CÓ ĐÁP ÁN đầy đủ (TN A–D · TLN có đáp số · Đ/S đủ 4 ý · tự luận có lời giải). Trước đây là script `duyet-cao-moi-khoi.mjs`
-- phải nhớ chạy sau mỗi lượt B3 — quên là câu nằm chờ duyệt (đã quên nhiều lần: K10 28/10 còn 1.072 câu). Giờ là trigger, không còn bước nhớ.
-- Không đụng gán nguon cum/doi_ung/nguoi (người/quy đổi), mức "vừa", câu thiếu đáp án.

create or replace function public._bdm_du_dap_an(p_loai text, p_dap_an text, p_menh_de jsonb, p_loi_giai text)
returns boolean language sql immutable as $$
  select case
    when p_loai = 'trac_nghiem' then coalesce(p_dap_an, '') ~ '^[A-D]$'
    when p_loai = 'tra_loi_ngan' then coalesce(p_dap_an, '') <> ''
    when p_loai = 'dung_sai' then coalesce((select bool_and(coalesce(m->>'dap_an', '') in ('D', 'S', 'Đ')) and count(*) = 4 from jsonb_array_elements(p_menh_de) m), false)
    else coalesce(p_loi_giai, '') <> ''
  end
$$;

create or replace function public._bdm_tu_duyet_sau_gan() returns trigger language plpgsql as $$
declare v_bang text := case when tg_table_name like 'hgt%' then 'hgt_cau_hoi' else 'dai_cau_hoi' end;
begin
  if new.nguon = 'ai' then
    execute format($q$update public.%I q set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
      where q.ma_cau = $1 and q.da_duyet = false and q.xoa_at is null
        and public._bdm_du_dap_an(q.loai_cau, q.dap_an, q.menh_de, q.loi_giai)$q$, v_bang) using new.ma_cau;
  end if;
  return null;
end $$;

drop trigger if exists trg_dai_bdm_gan_cau_tu_duyet on public.dai_bdm_gan_cau;
create trigger trg_dai_bdm_gan_cau_tu_duyet after insert or update of nguon, dang_bai_id on public.dai_bdm_gan_cau
  for each row execute function public._bdm_tu_duyet_sau_gan();
drop trigger if exists trg_hgt_bdm_gan_cau_tu_duyet on public.hgt_bdm_gan_cau;
create trigger trg_hgt_bdm_gan_cau_tu_duyet after insert or update of nguon, dang_bai_id on public.hgt_bdm_gan_cau
  for each row execute function public._bdm_tu_duyet_sau_gan();
drop trigger if exists trg_dai_bdm_kho_ds_tu_duyet on public.dai_bdm_kho_ds;
create trigger trg_dai_bdm_kho_ds_tu_duyet after insert or update of nguon, chu_de_id on public.dai_bdm_kho_ds
  for each row execute function public._bdm_tu_duyet_sau_gan();
drop trigger if exists trg_hgt_bdm_kho_ds_tu_duyet on public.hgt_bdm_kho_ds;
create trigger trg_hgt_bdm_kho_ds_tu_duyet after insert or update of nguon, chu_de_id on public.hgt_bdm_kho_ds
  for each row execute function public._bdm_tu_duyet_sau_gan();

revoke execute on function public._bdm_tu_duyet_sau_gan() from public, anon;
revoke execute on function public._bdm_du_dap_an(text, text, jsonb, text) from public, anon;
