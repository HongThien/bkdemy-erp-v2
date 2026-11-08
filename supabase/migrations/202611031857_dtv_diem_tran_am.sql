-- ============================================================================
-- 202611031857 — dtv_diem_tran_am   (áp: `node scripts/migrate.mjs --only 202611031857_dtv_diem_tran_am.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 — trận đua (bot · online · giải) chọn SAI phải bị TRỪ điểm đúng bằng điểm câu đúng cùng tốc độ
--   (100/70/50), "cho nghiêm túc": không trừ thì bấm bừa thật nhanh là lời. Trừ ở trọng tài trận (`src/dautu/lib/trongTai.ts`)
--   ⇒ tổng điểm trận có thể ÂM. Hai hàm ghi trận đang kẹp điểm về ≥ 0 ⇒ ghi sai số thật. Nay cho ghi âm (kẹp −10000…10000).
-- MẤT GÌ: không xoá / drop gì. Thay thân 2 hàm, chỉ đổi đúng biểu thức kẹp điểm (giữ chữ ký + quyền). dtv_tran.diem không có CHECK.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_dtv_ghi_tran_mon(p_uid text, p_mon text, p_che_do text, p_chu_de text, p_ket_qua text, p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_cau integer := least(greatest(coalesce(p_so_cau, 0), 0), 40);
  v_dung integer := least(greatest(coalesce(p_so_dung, 0), 0), least(greatest(coalesce(p_so_cau, 0), 0), 40));
  v_xp integer; v_hom_nay date := _dtv_hom_nay(); v_cap_truoc integer; v_cap_sau integer;
  v_luot_hom_nay integer; n dtv_nguoi_choi; v_tran uuid;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;

  v_xp := case
    when p_che_do = 'on_tap' then v_dung * 2
    when p_che_do = 'noi_tu' then least(v_dung, 30) * 2 + case p_ket_qua when 'thang' then 20 else 0 end
    else v_dung * 5 + case p_ket_qua when 'thang' then 40 when 'hoa' then 20 else 10 end
  end;
  select count(*) into v_luot_hom_nay from dtv_tran
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom_nay;
  if v_luot_hom_nay >= 60 then v_xp := 0; end if;

  insert into dtv_tran (uid, mon, che_do, chu_de, ket_qua, so_dung, so_cau, diem, xp, doi_thu)
  values (p_uid, coalesce(nullif(p_mon, ''), 'Tiếng Anh'), p_che_do, coalesce(nullif(p_chu_de, ''), 'tron'), p_ket_qua, v_dung, v_cau,
          least(greatest(coalesce(p_diem, 0), -10000), 10000), v_xp, nullif(p_doi_thu, ''))
  returning id into v_tran;

  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    so_tran  = n.so_tran  + case when p_che_do in ('bot','mang','giai') then 1 else 0 end,
    so_thang = n.so_thang + case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then 1 else 0 end,
    chuoi_thang = case when p_che_do not in ('bot','mang','giai') then n.chuoi_thang
                       when p_ket_qua = 'thang' then n.chuoi_thang + 1
                       when p_ket_qua = 'thua' then 0 else n.chuoi_thang end,
    chuoi_thang_max = greatest(n.chuoi_thang_max,
                       case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then n.chuoi_thang + 1 else 0 end),
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_hom_nay then n.chuoi_ngay
                      when n.ngay_hoc_cuoi = v_hom_nay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_hom_nay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc, 'tran_id', v_tran);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_tran_ket(p_uid text, p_de_id uuid, p_ket_qua text, p_diem integer DEFAULT 0, p_doi_thu text DEFAULT ''::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare d dtv_de; r jsonb; v_tran uuid;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  if d.che_do <> 'bot' then raise exception 'Đề này không phải trận đấu'; end if;
  if p_ket_qua not in ('thang', 'thua', 'hoa') then raise exception 'Kết quả không hợp lệ'; end if;
  if d.ket_thuc_at is not null then
    select t.id into v_tran from dtv_tran t where t.de_id = d.id limit 1;
    return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', 0, 'len_cap', false, 'tran_id', v_tran);
  end if;
  r := public.fn_dtv_ghi_tran_mon(p_uid, d.mon, 'bot', coalesce(d.chu_de, 'tron'), p_ket_qua, d.so_dung, d.so_cau, coalesce(p_diem, 0), coalesce(p_doi_thu, ''));
  v_tran := (r->>'tran_id')::uuid;
  update dtv_tran set de_id = d.id, nguon_cham = 'server' where id = v_tran;
  update dtv_cau_log set tran_id = v_tran where de_id = d.id;
  update dtv_de set ket_thuc_at = clock_timestamp() where id = d.id;
  return r;
end $function$;

