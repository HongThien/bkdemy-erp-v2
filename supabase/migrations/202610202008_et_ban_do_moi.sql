-- ET THEO BẢN ĐỒ MỚI (Thùy 20/10: "builder mới phải có cả ET · tài liệu từ bản đồ mới là bản mới, tách khỏi bản cũ cho chắc").
-- ET mới = tai_lieu loai='et', ban_do='moi' — CÙNG khuôn lưu với ET cũ (1 phần câu theo thứ tự + cau_hinh.etMaDe/etFormByCau/hsMaDe)
-- ⇒ Chấm ET, bản in, ET online, đo đọc y như cũ. Khác ở chỗ CHỌN câu: theo nhóm/dạng bài bản đồ mới, gợi ý + mã đề tính ở DB.
--   · fn_tl_bdm_et_de_xuat(lop, ngay)   : dạng bài đã dạy buổi đó (giáo trình buổi ban_do='moi' của lớp) — để điền sẵn kế hoạch ET.
--   · fn_tl_bdm_et_vi_tri(khoi, ma[])   : câu → dạng bài/nhóm (mở lại ET đã lưu để sửa).
--   · fn_tl_bdm_et_ma_de(khoi, base)    : sinh đề 2 & 3 — luật cũ (lib/made.ts): câu KHÁC cùng DẠNG BÀI + cùng CỤM + in được cùng FORM;
--                                         thiếu thì cho trùng trong cụm, tệ nhất dùng lại câu gốc — không bao giờ để trống.
--   · trigger _et_khong_tron_ban_do     : 1 buổi (lớp+ngày+nhánh) không có cùng lúc ET bản cũ và ET bản mới (getETByBuoi lấy bản
--                                         mới nhất ⇒ trộn là chấm nhầm đề).

-- ── Dạng bài đã dạy buổi đó ──
create or replace function fn_tl_bdm_et_de_xuat(p_lop uuid, p_ngay date)
returns jsonb
language sql stable as $$
  with gt as (
    select t.id from tai_lieu t
     where t.loai = 'giao_trinh_buoi' and t.ban_do = 'moi' and t.lop_id = p_lop and t.ngay = p_ngay
     order by t.created_at desc limit 1
  )
  select jsonb_build_object(
    'giao_trinh', (select id from gt),
    'dang_bai', coalesce((
      select jsonb_agg(jsonb_build_object('id', p.ref_ma, 'nhom_id', db.nhom_id, 'ten', db.ten) order by p.thu_tu, p.id)
        from tai_lieu_phan p join dai_bdm_dang_bai db on db.id = p.ref_ma
       where p.tai_lieu_id = (select id from gt) and p.loai_phan = 'dang_bai'), '[]'::jsonb))
$$;

-- ── Câu → dạng bài / nhóm ──
create or replace function fn_tl_bdm_et_vi_tri(p_khoi text, p_ma text[])
returns table (ma_cau text, dang_bai_id text, nhom_id text)
language sql stable as $$
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi) x where x.ma_cau = any (p_ma)
$$;

-- ── Đề 2 & 3 ──  p_base = [{ "ma_cau": …, "dang_bai": …, "form": "trac_nghiem" | "tra_loi_ngan" | "tu_luan" }] theo thứ tự đề gốc.
-- Trả { "etMaDe": { câu gốc: [đề 2, đề 3] }, "etFormByCau": { câu biến thể: form } } — người gọi trộn vào cau_hinh.
create or replace function fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
returns jsonb
language plpgsql volatile as $$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_cum text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
  v_used text[] := array(select e->>'ma_cau' from jsonb_array_elements(p_base) e);   -- đề 2/3 khác MỌI câu gốc khi còn đủ câu
  v_made jsonb := '{}'; v_form jsonb := '{}';
begin
  create temp table if not exists _et_vt (ma_cau text, cum text, dang_bai_id text, la_goc boolean) on commit drop;
  truncate _et_vt;
  insert into _et_vt select x.ma_cau, x.cum, x.dang_bai_id, x.la_goc from _tl_bdm_cau_vi_tri(p_khoi) x
   where x.dang_bai_id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e);
  for b in select e->>'ma_cau' as ma, e->>'dang_bai' as db, coalesce(e->>'form', 'tra_loi_ngan') as form, o
             from jsonb_array_elements(p_base) with ordinality as t(e, o) order by o loop
    select v.cum into v_cum from _et_vt v where v.ma_cau = b.ma;
    v_cum := coalesce(v_cum, b.ma);   -- câu gốc không còn trong kho chuẩn ⇒ cụm = chính nó
    -- ứng viên = cùng dạng bài + cùng cụm + in được cùng form (TN: có phương án / mệnh đề / form TN đã duyệt; form khác: không phải Đ/S)
    v_cands := array(
      select v.ma_cau from _et_vt v join dai_cau_hoi c on c.ma_cau = v.ma_cau
       where v.dang_bai_id = b.db and v.cum = v_cum
         and case when b.form = 'trac_nghiem'
                  then jsonb_array_length(coalesce(to_jsonb(c.lua_chon), '[]'::jsonb)) > 0
                    or jsonb_array_length(coalesce(to_jsonb(c.menh_de), '[]'::jsonb)) > 0
                    or exists (select 1 from dai_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet)
                  else jsonb_array_length(coalesce(to_jsonb(c.menh_de), '[]'::jsonb)) = 0 end
       order by (v.ma_cau = b.ma), (not v.la_goc), v.ma_cau);
    v_picks := '{}';
    for i in 1..2 loop
      select x into v_fresh from unnest(v_cands) x where not (x = any (v_used)) limit 1;
      if v_fresh is not null then
        v_used := v_used || v_fresh; v_picks := v_picks || v_fresh;
        v_form := v_form || jsonb_build_object(v_fresh, b.form);
      else
        -- không đủ biến thể cùng cụm + form ⇒ cho trùng TRONG cụm (khác đề 2 nếu được), rồi câu gốc — không nhảy cụm, không để trống
        v_dup := coalesce((select x from unnest(v_cands) x where not (x = any (v_picks)) limit 1), v_cands[1], b.ma);
        v_picks := v_picks || v_dup;
        v_form := v_form || jsonb_build_object(v_dup, b.form);
      end if;
    end loop;
    v_made := v_made || jsonb_build_object(b.ma, to_jsonb(v_picks));
  end loop;
  return jsonb_build_object('etMaDe', v_made, 'etFormByCau', v_form);
end $$;

-- ── Không trộn ET bản cũ / bản mới trong 1 buổi ──
create or replace function _et_khong_tron_ban_do() returns trigger language plpgsql as $$
begin
  if new.loai = 'et' and new.lop_id is not null and new.ngay is not null and exists (
       select 1 from tai_lieu t
        where t.loai = 'et' and t.id <> new.id and t.lop_id = new.lop_id and t.ngay = new.ngay
          and coalesce(t.nhanh, '') = coalesce(new.nhanh, '') and t.ban_do <> new.ban_do) then
    raise exception 'Buổi này đã có ET theo bản đồ %. Sửa ET đó (mục %), không tạo thêm bản khác cho cùng buổi.',
      case when new.ban_do = 'moi' then 'CŨ' else 'MỚI' end, case when new.ban_do = 'moi' then '"ET"' else '"ET (bản đồ mới)"' end
      using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists trg_et_khong_tron_ban_do on tai_lieu;
create trigger trg_et_khong_tron_ban_do before insert or update of lop_id, ngay, ban_do, loai on tai_lieu
  for each row execute function _et_khong_tron_ban_do();

revoke execute on function fn_tl_bdm_et_de_xuat(uuid, date) from public, anon;
revoke execute on function fn_tl_bdm_et_vi_tri(text, text[]) from public, anon;
revoke execute on function fn_tl_bdm_et_ma_de(text, jsonb) from public, anon;
grant execute on function fn_tl_bdm_et_de_xuat(uuid, date) to authenticated;
grant execute on function fn_tl_bdm_et_vi_tri(text, text[]) to authenticated;
grant execute on function fn_tl_bdm_et_ma_de(text, jsonb) to authenticated;
