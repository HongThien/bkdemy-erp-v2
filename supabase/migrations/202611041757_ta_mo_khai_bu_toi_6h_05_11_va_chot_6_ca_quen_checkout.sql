-- ============================================================================
-- 202611041757 — ta_mo_khai_bu_toi_6h_05_11_va_chot_6_ca_quen_checkout
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 04/11:
--   (1) "OK" — 6 ca KHAI ĐÚNG nhưng QUÊN CHECKOUT, Trang từ chối 28/10 ("chưa ghi việc") trong khi việc trong ca đã duyệt
--       ⇒ lương bỏ qua. Chốt giờ theo việc cuối trong ca + duyệt lại ca. Giờ máy gốc (vao_at/ra_at) giữ nguyên.
--       3 ca còn lại trong nhóm 9 (QT 17/10, QT 24/10, Giang 25/10) là ca TRÙNG — KHÔNG đụng ở đây.
--   (2) "Mở lại chức năng khai bù cho nhân sự nốt hôm nay, đến 6h sáng 5/11 thì khoá": thêm 1 đợt khai bù
--       01/10 → 04/11, hạn 05/11 06:00 (giờ VN). _ta_duoc_khai_bu tự hết hiệu lực sau hạn — không cần ai tắt.
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 dòng ta_dot_khai_bu, cập nhật 6 dòng ta_cham_cong (ghi vết ta_cong_log).
-- ============================================================================

insert into public.ta_dot_khai_bu (tu, den, han, ghi_chu)
values ('2026-10-01', '2026-11-04', timestamptz '2026-11-05 06:00:00+07',
        'Thùy 04/11: mở lại khai bù nốt hôm nay cho mọi ngày 01/10→04/11, khoá 06:00 sáng 05/11');

do $$
declare
  v_thuy uuid := '626427c3-d82d-468d-9f47-eb29d1981ee5';   -- Đào Xuân Thùy (người quyết)
  r record; v_n int := 0;
begin
  for r in select * from (values
      ('b31f4d42-a48d-4ca2-9c56-9bfe78b64c7a'::uuid, '2026-10-20'::date, null::time, time '21:30'),   -- Long: TG 9A2 tới 21:30
      ('08437e17-b819-430d-9e89-d7804888f2ce'::uuid, '2026-10-21'::date, null::time, time '21:30'),   -- Long: TG 9A1 tới 21:30
      ('1ff840dd-9282-4a72-80e1-7ea6b8b89ce6'::uuid, '2026-10-25'::date, null::time, time '19:30'),   -- Long: trực khối 18:30–19:30
      ('929ad886-c490-4633-87ab-222b46010af5'::uuid, '2026-10-21'::date, null::time, time '19:30'),   -- Minh: trực khối tới 19:30
      ('729ded0d-40ef-4258-93a2-18b462b7face'::uuid, '2026-10-21'::date, null::time, time '19:00'),   -- Cường: đuổi 6A1 tới 19:00
      ('e99c63dd-aef2-4a4f-9a88-c809c79bfe20'::uuid, '2026-10-16'::date, time '17:30', time '19:30')  -- QT: checkin 20:50 sau khi dạy ⇒ chốt cả giờ vào
    ) as t(id, ngay, vao, ra)
  loop
    update public.ta_cham_cong c
       set vao_chot = case when r.vao is null then c.vao_at else (r.ngay + r.vao) at time zone 'Asia/Ho_Chi_Minh' end,
           ra_chot  = (r.ngay + r.ra) at time zone 'Asia/Ho_Chi_Minh',
           trang_thai = 'xong',
           duyet = 'da_duyet', duyet_boi = v_thuy, duyet_at = now(),
           ly_do_duyet = 'Thùy 04/11: quên checkout — chốt giờ ra theo việc cuối trong ca, duyệt lại (trước đó từ chối nhầm 28/10)'
     where c.id = r.id and c.ngay = r.ngay and c.duyet = 'tu_choi';
    if not found then raise exception 'Ca % (%) không còn ở trạng thái từ chối — dừng, kiểm lại', r.id, r.ngay; end if;
    v_n := v_n + 1;
  end loop;
  if v_n <> 6 then raise exception 'Chỉ cập nhật % / 6 ca', v_n; end if;
end $$;
