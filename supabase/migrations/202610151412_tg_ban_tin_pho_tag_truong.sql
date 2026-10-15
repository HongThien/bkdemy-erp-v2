-- ============================================================================
-- 202610151412 — tg_ban_tin_pho_tag_truong
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 15/10: "TA là Phó khối thì không ghi người phụ trách là Phó khối khác… cho đỡ 2 bạn quản lẫn nhau"
--   → rồi chốt: "chuyển TẤT CẢ phụ trách ở đây là Trưởng khối". Bản tin tag TRƯỞNG của khối có việc (không tag chính
--   mình) — Phó không bị kéo vào quản bạn cùng cấp. Chấm MT KHÔNG đổi (vẫn _khoi_van_hanh: Phó, không có ⇒ Trưởng).
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 hàm, viết lại thân _tg_ban_tin_du_lieu.
-- ============================================================================

create or replace function public._khoi_nguoi_theo_doi(p_mon text, p_khoi text, p_ta uuid)
returns table (nhan_su_id uuid)
language sql stable security definer set search_path = public as $$
  select distinct q.nhan_su_id
    from public._khoi_quan_ly() q
   where q.mon = p_mon and q.khoi = p_khoi and q.nhan_su_id <> p_ta and q.cap = 'truong'
$$;
revoke all on function public._khoi_nguoi_theo_doi(text, text, uuid) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public._tg_ban_tin_du_lieu(p_ngay date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with v as (select * from public._tg_viec_ton(p_ngay) x
              where x.loai in ('et', 'btvn', 'bu_et', 'btvn_bu', 'cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
                and x.ngay_goc >= public._ta_moc_cham_cong()     -- Thùy 15/10: chỉ ET · BTVN · chấm công, chỉ từ tháng 10
                -- Thùy 15/10: ET · BTVN chỉ khi CHƯA LÀM + ĐÃ TRỄ (tới 8:00 sáng). Chấm công KHÔNG gọi là trễ (hệ thống mới ra) ⇒
                -- mọi buổi/ca chưa ghi công tới hết hôm qua = "cần hoàn thành".
                and (x.loai in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
                     or x.han < ((p_ngay + time '08:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'))),
  -- Cảnh báo BTVN (Thùy 15/10): em của lớp TA có 2 kết quả BTVN GẦN NHẤT liên tiếp cùng là "không làm" hoặc cùng "nộp muộn"
  -- (xin phép không tính, không ngắt chuỗi); chỉ nêu khi bài gần nhất trong chuỗi ở 7 ngày qua (cũ hơn = đã nhắc rồi).
  kq as (
    select pc.nhan_su_id, l.id as lop_id, l.ten_lop, h.id as hs_id, h.ho_ten, b.ngay, k.trang_thai_nop,
           row_number() over (partition by pc.nhan_su_id, l.id, h.id order by b.ngay desc) as rn
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
      join hoc_sinh h on h.id = k.hoc_sinh_id
      join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
     where k.trang_thai_nop in ('nop_dung_han', 'nop_muon', 'khong_lam')
       and b.ngay >= public._ta_moc_cham_cong() and b.ngay < p_ngay
  ),
  canh as (
    select x.nhan_su_id, jsonb_agg(jsonb_build_object('ho_ten', x.ho_ten, 'ten_lop', x.ten_lop, 'loai', x.tt, 'ngays', x.ngays)
                                   order by x.tt, x.ten_lop, x.ho_ten) as canh_bao
      from (select nhan_su_id, ten_lop, ho_ten, max(trang_thai_nop) as tt, array_agg(ngay order by ngay) as ngays, max(ngay) as moi
              from kq where rn <= 2
             group by nhan_su_id, lop_id, ten_lop, hs_id, ho_ten
            having count(*) = 2 and min(trang_thai_nop) = max(trang_thai_nop)) x
     where x.tt in ('khong_lam', 'nop_muon') and x.moi >= p_ngay - 7
     group by x.nhan_su_id
  ),
  ds as (select d.nhan_su_id, n.ho_ten, l.tg_user_id
           from public._tg_ds_ta(p_ngay) d join nhan_su n on n.id = d.nhan_su_id
           left join tg_lien_ket l on l.nhan_su_id = d.nhan_su_id and l.den_at is null),
  thuong as (   -- việc không phải chấm công, gom theo loại; cùng lớp + cùng ngày gộp 1 mục kèm số (vd BTVN bù 2 em)
    select v.nhan_su_id, v.loai, min(v.nhan) as nhan, min(v.ngay_goc) as ngay_dau,
           jsonb_agg(jsonb_build_object('ten_lop', v.ten_lop, 'ngay_goc', v.ngay_goc, 'so_luong', v.so_luong, 'tre_ngay', v.tre_ngay)
                     order by v.ngay_goc, v.ten_lop) as muc
      from (select x.nhan_su_id, x.loai, min(x.nhan) as nhan, x.ten_lop, x.ngay_goc, sum(x.so_luong)::int as so_luong,
                   floor(extract(epoch from (((p_ngay + time '08:00')::timestamp at time zone 'Asia/Ho_Chi_Minh') - min(x.han))) / 86400)::int as tre_ngay
              from v x group by x.nhan_su_id, x.loai, x.ten_lop, x.ngay_goc) v where v.loai not in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
     group by v.nhan_su_id, v.loai
  ),
  cong as (
    select v.nhan_su_id,
           jsonb_build_object('so_buoi', count(*) filter (where v.loai = 'cong_buoi'),
                              'so_ca', count(*) filter (where v.loai = 'cong_ca'),
                              'so_bo_tro', count(*) filter (where v.loai = 'cong_bo_tro'),
                              'quen_checkout', count(*) filter (where v.loai = 'quen_checkout'),
                              'tu', min(v.ngay_goc), 'den', max(v.ngay_goc)) as cong
      from v where v.loai in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
     group by v.nhan_su_id
  ),
  pt as (       -- Phó khối (không có Phó ⇒ Trưởng) của các khối TA có việc, theo sơ đồ tổ chức (trừ chính TA đó)
    select x.nhan_su_id, jsonb_agg(distinct jsonb_build_object('ho_ten', n.ho_ten, 'tg_user_id', l.tg_user_id)) as phu_trach
      from (select distinct v.nhan_su_id, v.mon, v.khoi from v where v.khoi is not null) x
      join public._khoi_nguoi_theo_doi(x.mon, x.khoi, x.nhan_su_id) pk on true
      join nhan_su n on n.id = pk.nhan_su_id and n.trang_thai = 'dang_lam'
      left join tg_lien_ket l on l.nhan_su_id = pk.nhan_su_id and l.den_at is null
     group by x.nhan_su_id
  ),
  ta as (
    select ds.nhan_su_id, ds.ho_ten, ds.tg_user_id,
           (select count(*) from v where v.nhan_su_id = ds.nhan_su_id) as so_viec,
           (select count(*) from v where v.nhan_su_id = ds.nhan_su_id
                                     and v.loai not in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')) as so_tre,
           coalesce(pt.phu_trach, '[]'::jsonb) as phu_trach,
           coalesce((select jsonb_agg(jsonb_build_object('loai', t.loai, 'nhan', t.nhan, 'muc', t.muc) order by t.ngay_dau, t.loai)
                       from thuong t where t.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as nhom,
           cong.cong, coalesce(canh.canh_bao, '[]'::jsonb) as canh_bao,
           coalesce((select jsonb_agg(jsonb_build_object('ref_key', v.ref_key, 'loai', v.loai, 'nhan', v.nhan, 'ten_lop', v.ten_lop,
                                                          'khoi', v.khoi, 'mon', v.mon, 'ngay_goc', v.ngay_goc, 'han', v.han, 'so_luong', v.so_luong)
                                       order by v.ngay_goc, v.loai)
                       from v where v.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as viec
      from ds left join pt on pt.nhan_su_id = ds.nhan_su_id left join cong on cong.nhan_su_id = ds.nhan_su_id
      left join canh on canh.nhan_su_id = ds.nhan_su_id
  )
  select jsonb_build_object(
    'ngay', p_ngay,
    'ta', coalesce((select jsonb_agg(to_jsonb(ta) order by ta.ho_ten)
                      from ta where ta.so_viec > 0 or jsonb_array_length(ta.canh_bao) > 0), '[]'::jsonb),
    'sach', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.so_viec = 0 and jsonb_array_length(ta.canh_bao) = 0), '[]'::jsonb),
    'chua_noi', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.tg_user_id is null), '[]'::jsonb))
$function$;
