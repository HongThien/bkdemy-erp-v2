-- ============================================================================
-- 202611161734 — bo_tu_dien_toan_va_cong_ghi_bo_tro
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Tiếp đợt quyền môn 16/11 (mig 202611161701 · 202611161718). Thùy: "fix các lỗi kia đã" — các mục rà ra mà chưa sửa:
--   (A) hàm TỰ ĐIỀN 'Toán' khi thiếu môn (cổng db_ham_mon_mac_dinh = 16). Rà từng hàm:
--       • fn_dong_phase — LỖI LẪN MÔN THẬT: buổi bù / bổ trợ không có lop_id ⇒ môn rơi về 'Toán' ⇒ EXP điểm sàn (250 / lượt) của em
--         KHTN học bù KHTN ghi vào sổ EXP Toán. Đo 16/11: 44 lượt · 11.000 EXP từ 07/07 đến 13/11 (475 lượt còn lại đúng là Toán).
--         Sửa đường ghi ở đây; 44 dòng cũ KHÔNG sửa trong migration này (đổi số liệu tháng đã trao giải — chờ Thùy quyết, xem DEVLOG).
--       • fn_botro_lap_day_ca — đơn vị ca của em bù / đuổi / Hình tính theo lớp Toán của em ⇒ theo đúng môn của lượt.
--       • fn_recompute_exp_thang · fn_mo_lai_phase — nhánh 'Toán' không chạy thật (lớp luôn có môn; lịch sử Elo 0 dòng thiếu môn) ⇒ bỏ cho rõ.
--       • 9 hàm có tham số p_mon mặc định 'Toán' ⇒ mặc định NULL (mọi nơi gọi đều truyền môn — đã dò repo này + BKGame / web / app PH / sổ kèo).
--   (B) hàm GHI của cụm Bổ trợ chưa kiểm quyền môn (xếp / gỡ / huỷ / tạo ca · lưu / xoá lịch khối · đổi mức / đóng case Hình).
--   Không đổi phép tính nào ngoài các chỗ ghi ở trên.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá dữ liệu, không drop gì. Đổi hành vi có chủ ý: gọi 9 hàm trên mà KHÔNG truyền môn ⇒ nhận rỗng thay vì dữ liệu Toán;
--   nhân sự ghi vào ca / lịch / case Hình của môn ngoài quyền ⇒ lỗi "ngoài quyền môn"; đóng ET buổi không xác định được môn của em ⇒ lỗi (đo 16/11: 0 ca).
-- ============================================================================

do $$
declare r record; v_def text; v_src text; v_n int;
begin
  for r in
    select * from (values
      ('public.fn_dong_phase(uuid,text)', '19624522287d346159e0b0eb96949823',
       '  v_mon := coalesce(v_mon, ''Toán'');
',
       '  -- 16/11: KHÔNG tự điền ''Toán'' — buổi không lớp (bù / bổ trợ): môn theo từng em ở bước ghi EXP bên dưới
'),
      ('public.fn_dong_phase(uuid,text)', null,
       '  v_co_elo := v_co_rank and p_phase = ''et'';
',
       '  v_co_elo := v_co_rank and p_phase = ''et'';
  if v_co_rank and v_mon is null then raise exception ''Buổi % không có lớp (không có môn) — không tính hạng / Elo được.'', p_buoi_id; end if;
'),
      ('public.fn_dong_phase(uuid,text)', null,
       '    select hoc_sinh_id, ''attend_floor'', 250, p_buoi_id, v_mon from _dp_raw;',
       '    select r.hoc_sinh_id, ''attend_floor'', 250, p_buoi_id,
           coalesce(v_mon, (select coalesce((select y.mon from bo_tro_yeu y where y.id = hh.bo_tro_yeu_id),
                     (select h.mon from bo_tro_hinh h where h.id = hh.bo_tro_hinh_id),
                     (select l.mon from bo_tro_duoi d join lop l on l.id = d.lop_id where d.id = hh.bo_tro_duoi_id),
                     (select l.mon from buoi_hoc g join lop l on l.id = g.lop_id where g.id = hh.bu_cho_buoi_id),
                     (select c.mon from ca_bo_tro_nhe c where c.id = b.ca_bo_tro_nhe_id),
                     (select c.mon from ca_bo_tro c where c.id = b.ca_bo_tro_id)) from buoi_hoc_hs hh where hh.buoi_hoc_id = p_buoi_id and hh.hoc_sinh_id = r.hoc_sinh_id limit 1))
      from _dp_raw r;
    if exists (select 1 from gami_exp_ledger g where g.ref_buoi_hoc_id = p_buoi_id and g.source = ''attend_floor'' and g.mon is null) then
      raise exception ''Không xác định được môn của học sinh ở buổi % — không ghi EXP chung chung (§1.6).'', p_buoi_id;
    end if;'),
      ('public.fn_recompute_exp_thang(uuid,text)', 'f13b22d4eb928e7a169e960a6f56d89a',
       '  v_mon := coalesce(v_mon, ''Toán'');
',
       '  if v_mon is null then return jsonb_build_object(''bo_qua'', ''Không thấy lớp — không tính EXP tháng''); end if;   -- 16/11: không tự điền ''Toán''
'),
      ('public.fn_mo_lai_phase(uuid,text)', '5b22275778ee02b03ea89d3de3d95d57',
       '(select hoc_sinh_id, coalesce(mon, ''Toán'') as mon, sum(delta) as d
        from gami_elo_history where buoi_hoc_id = p_buoi_id and phase = p_phase
        group by hoc_sinh_id, coalesce(mon, ''Toán'')) h',
       '(select hoc_sinh_id, mon, sum(delta) as d   -- 16/11: bỏ coalesce(mon, ''Toán'') — lịch sử Elo luôn có môn
        from gami_elo_history where buoi_hoc_id = p_buoi_id and phase = p_phase
        group by hoc_sinh_id, mon) h'),
      ('public.fn_botro_lap_day_ca(date,date,text,boolean)', 'c4d9edd34a4bfe135eb0df64d15baa36',
       'hh.hoc_sinh_id, coalesce(y.mon, ''Toán'')))::int as dv',
       'hh.hoc_sinh_id, public._bo_tro_mon(hh.bo_tro_yeu_id, hh.bo_tro_hinh_id, hh.bo_tro_duoi_id, hh.bu_cho_buoi_id, b.ca_bo_tro_nhe_id, b.ca_bo_tro_id)))::int as dv   -- 16/11: môn của lượt, không tự điền ''Toán'''),
      ('public.fn_dgcc_hs(uuid[],text)', '2d73b28d814d6caa189e0a50a43c46d9',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.fn_dgcc_lan_nut(uuid,text,text,text,text)', 'b1ef93cb71c67aeda11a8b9a5fc3f219',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.fn_dgcc_lich_su_nut(uuid,text,text,text,text)', '075083f970a37abb582b851018847cb9',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.fn_kho_hinh_dem(text)', 'a2ce047db3948888dc7af6064faf9edf',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.fn_nt_tang_toc_de(text,text)', '1263a30147ceb9b9061a55de8cdcc8c5',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.hs_sotay_cay_hs(text,text)', '131462c510f07b36a803b8505d5dc89f',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.hs_sotay_tim_ct(text,text,text,integer)', 'b4d351ae639af1a03a67b306118b47aa',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.hs_sotay_tim_lt(text,text,integer)', '70a5729e45d91c9b53a5cdaa29c0ea93',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.tu_luyen_dien_sinh(text,integer)', '699f27db166c25468f39702257940921',
       'p_mon text DEFAULT ''Toán''::text',
       'p_mon text DEFAULT NULL::text'),
      ('public.fn_ca_bo_tro_xep(uuid,text,uuid,uuid)', '0d146a8cfdad954d2ee7dd6bcf4329f0',
       '  if c.id is null then raise exception ''Không thấy ca.''; end if;
',
       '  if c.id is null then raise exception ''Không thấy ca.''; end if;
  if not public._mon_duoc_xem(c.mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', c.mon; end if;   -- 16/11: quyền môn
'),
      ('public.fn_ca_bo_tro_go(uuid,text)', '9df9bc50a3e3d667a6733cf232c20d41',
       '  if r.id is null or r.ca_bo_tro_id is null then raise exception ''Không thấy lượt xếp.''; end if;
',
       '  if r.id is null or r.ca_bo_tro_id is null then raise exception ''Không thấy lượt xếp.''; end if;
  if not public._mon_duoc_xem((select c.mon from ca_bo_tro c where c.id = r.ca_bo_tro_id)) then raise exception ''Môn % ngoài quyền môn của bạn.'', (select c.mon from ca_bo_tro c where c.id = r.ca_bo_tro_id); end if;   -- 16/11: quyền môn
'),
      ('public.fn_ca_bo_tro_huy(uuid,text)', 'e966229f2cb4ce7a0cd545ca52cb3a0e',
       '  update ca_bo_tro set trang_thai = ''huy'',',
       '  if not public._mon_duoc_xem((select c.mon from ca_bo_tro c where c.id = p_ca)) then raise exception ''Môn % ngoài quyền môn của bạn.'', (select c.mon from ca_bo_tro c where c.id = p_ca); end if;   -- 16/11: quyền môn
  update ca_bo_tro set trang_thai = ''huy'','),
      ('public.fn_ca_bo_tro_tao(date,time without time zone,time without time zone,text,text,text,integer,uuid,uuid)', 'a8654b294c415044edab08f8e5996e70',
       '  if p_ns is null then raise exception ''Ca phải có người trực.''; end if;
',
       '  if p_ns is null then raise exception ''Ca phải có người trực.''; end if;
  if not public._mon_duoc_xem(p_mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', p_mon; end if;   -- 16/11: quyền môn
'),
      ('public.fn_lich_truc_luu(uuid,text,text,text,integer,time without time zone,time without time zone,text,integer,uuid,uuid,integer,date,text,boolean)', 'afa82d344f070359f2f26ed9ab0bc04c',
       '  if p_thu not between 2 and 8 then raise exception ''Thứ không hợp lệ.''; end if;
',
       '  if p_thu not between 2 and 8 then raise exception ''Thứ không hợp lệ.''; end if;
  if not public._mon_duoc_xem(p_mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', p_mon; end if;   -- 16/11: quyền môn
  if p_id is not null and not public._mon_duoc_xem((select x.mon from lich_truc_bo_tro x where x.id = p_id)) then raise exception ''Môn % ngoài quyền môn của bạn.'', (select x.mon from lich_truc_bo_tro x where x.id = p_id); end if;   -- 16/11: quyền môn
'),
      ('public.fn_lich_truc_xoa(uuid,boolean)', '83d6fd7cb99e4fcd26e1aebea785b633',
       '  if not exists (select 1 from lich_truc_bo_tro where id = p_id) then raise exception ''Không thấy lịch này.''; end if;
',
       '  if not exists (select 1 from lich_truc_bo_tro where id = p_id) then raise exception ''Không thấy lịch này.''; end if;
  if not public._mon_duoc_xem((select x.mon from lich_truc_bo_tro x where x.id = p_id)) then raise exception ''Môn % ngoài quyền môn của bạn.'', (select x.mon from lich_truc_bo_tro x where x.id = p_id); end if;   -- 16/11: quyền môn
'),
      ('public.fn_bthinh_doi(uuid,integer,integer)', 'c32b371dbcdc87f821bcabe41cc46fe0',
       '  if y.id is null then raise exception ''Không thấy case.''; end if;
',
       '  if y.id is null then raise exception ''Không thấy case.''; end if;
  if not public._mon_duoc_xem(y.mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', y.mon; end if;   -- 16/11: quyền môn
'),
      ('public.fn_bthinh_dong(uuid,text,text)', 'b0f6dd241f5a85b0040e262cdbf4c232',
       '  if y.id is null then raise exception ''Không thấy case.''; end if;
',
       '  if y.id is null then raise exception ''Không thấy case.''; end if;
  if not public._mon_duoc_xem(y.mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', y.mon; end if;   -- 16/11: quyền môn
')
    ) t(ham, md5_cu, cu, moi)
  loop
    select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p where p.oid = r.ham::regprocedure;
    if r.md5_cu is not null and md5(v_src) <> r.md5_cu then
      raise exception '% đã khác bản lúc viết migration (16/11) — đọc lại trước khi áp.', r.ham;
    end if;
    v_n := (length(v_def) - length(replace(v_def, r.cu, ''))) / length(r.cu);
    if v_n <> 1 then raise exception '%: mốc thay khớp % lần (phải đúng 1): %', r.ham, v_n, left(r.cu, 120); end if;
    execute replace(v_def, r.cu, r.moi);
  end loop;
end $$;
