-- ============================================================================
-- 202611061508 — khtn_tu_duyet_khi_gan_ai
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 06/11 "Áp luật duyệt của Toán cho KHTN". Luật Toán (mig 202611051930): câu gán dạng bài mức CAO (nguon 'ai')
--   ⇒ DB TỰ duyệt (da_duyet=true, duyet_nguon='ai') nếu đủ đáp án (_bdm_du_dap_an). KHTN có khtn_bdm_gan_cau nhưng chưa có trigger.
-- CÁCH: _bdm_tu_duyet_sau_gan chọn bảng câu theo tiền tố bảng gán (dai / hgt / khtn — đối xứng môn); thêm trigger trên khtn_bdm_gan_cau.
--   Kèm sửa _trg_chan_duyet_dang_cho: chốt "chưa phân dạng thì không duyệt" chỉ biết bản đồ mới Đại/HGT ⇒ câu KHTN ở dạng chờ đã GÁN
--   dạng bài KHTN vẫn bị chặn (đo khi chạy thử: K07000000) — và vì tự duyệt chạy trong lúc gán, gán dạng KHTN sẽ hỏng theo. Giờ: câu
--   KHTN (hoặc câu gốc của bản sao) có dòng khtn_bdm_gan_cau = đã phân dạng.
--   Vá tồn đọng một lần (như script duyet-cao-moi-khoi.mjs đã làm cho Toán): đo 06/11 KHTN 7 · 8 · 9 = 811 + 50 + 1.660 câu gán AI
--   chưa duyệt mà đủ đáp án ⇒ duyệt. 11 câu thiếu đáp án vẫn chờ người. Không đụng gán nguon cum / nguoi.
-- MẤT GÌ: không xoá gì. Viết lại (create or replace) _bdm_tu_duyet_sau_gan + _trg_chan_duyet_dang_cho (nhánh Toán giữ nguyên). UPDATE da_duyet của ~2.521 câu KHTN
--   (bỏ được: duyet_nguon = 'ai' và duyet_at = lúc áp nhận ra đúng các dòng này).
-- ============================================================================

create or replace function public._bdm_tu_duyet_sau_gan() returns trigger language plpgsql as $$
declare v_bang text := case when tg_table_name like 'hgt%' then 'hgt_cau_hoi'
                            when tg_table_name like 'khtn%' then 'khtn_cau_hoi'
                            else 'dai_cau_hoi' end;
begin
  if new.nguon = 'ai' then
    execute format($q$update public.%I q set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
      where q.ma_cau = $1 and q.da_duyet = false and q.xoa_at is null
        and public._bdm_du_dap_an(q.loai_cau, q.dap_an, q.menh_de, q.loi_giai)$q$, v_bang) using new.ma_cau;
  end if;
  return null;
end $$;

CREATE OR REPLACE FUNCTION public._trg_chan_duyet_dang_cho()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.da_duyet and public._kho_la_dang_cho(new.dang_chinh)
     and coalesce(current_setting('kho.duyet_noi_dung', true), '') <> 'on' then   -- duyệt ĐỀ (nội dung) được phép, phân dạng sau
    -- Bản đồ mới (mig 202610261856 + 202610261929) — khối chạy bản đồ mới, Đại/HGT:
    --   câu thường đã GÁN dạng bài = đã phân dạng · câu Đ/S có CHỦ ĐỀ kho Đ/S = đã phân · ý Đ/S không gắn dạng (dạng chờ chỉ là lưu trữ)
    if tg_table_name in ('dai_cau_hoi', 'hgt_cau_hoi') then
      if new.loai_cau = 'dung_sai' then
        if public._bdm_dang_o_khoi_moi(left(tg_table_name, 3), new.dang_chinh)
           and public._bdm_cau_ds_co_chu_de(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau) then return new; end if;
      elsif public._bdm_cau_co_dang_bai(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau, new.dang_chinh) then return new;
      end if;
    elsif tg_table_name in ('dai_cau_menh_de', 'hgt_cau_menh_de') then
      if public._bdm_dang_o_khoi_moi(left(tg_table_name, 3), new.dang_chinh) then return new; end if;
    -- 06/11: KHTN bản đồ mới — câu (hoặc câu gốc của bản sao) đã gán dạng bài KHTN = đã phân dạng
    elsif tg_table_name = 'khtn_cau_hoi' then
      if exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau in (new.ma_cau, new.parent_ma_cau)) then return new; end if;
    end if;
    raise exception 'Chưa phân dạng: % đang ở dạng chờ % — chọn dạng thật trước khi duyệt', tg_table_name, new.dang_chinh
      using errcode = 'check_violation';
  end if;
  return new;
end $function$;

drop trigger if exists trg_khtn_bdm_gan_cau_tu_duyet on public.khtn_bdm_gan_cau;
create trigger trg_khtn_bdm_gan_cau_tu_duyet after insert or update of nguon, dang_bai_id on public.khtn_bdm_gan_cau
  for each row execute function public._bdm_tu_duyet_sau_gan();

-- vá tồn đọng: câu KHTN đã gán AI trước khi có trigger
update khtn_cau_hoi q set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
  from khtn_bdm_gan_cau g
 where g.ma_cau = q.ma_cau and g.nguon = 'ai' and q.da_duyet = false and q.xoa_at is null
   and public._bdm_du_dap_an(q.loai_cau, q.dap_an, q.menh_de, q.loi_giai);
