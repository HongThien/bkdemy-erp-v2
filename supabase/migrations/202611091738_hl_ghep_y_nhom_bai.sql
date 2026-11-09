-- ============================================================================
-- 202611091738 — HÌNH LUYỆN: ghép ý có NHÓM BÀI (spec-hinh-cay-nhanh §13.4, bước 3 của §13.8)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 09/11): thành viên nhóm bài về cây là CON của nút nhóm, nhưng về logic nó đứng TRƯỚC nút nhóm
--   (nó chứng minh ra đầu ra). Chọn ý ở MT/ET/giáo trình và in đề phải theo đúng điều đó:
--   · in giả thiết của thành viên, ý của thành viên đứng đầu, rồi giả thiết thêm của các nhánh SAU nút nhóm,
--     KHÔNG in lại đầu ra (thành viên vừa chứng minh xong nó);
--   · con đường đi sai ⇒ CẢNH BÁO, không chặn (2 thành viên cùng nhóm · 2 nhánh anh em · rẽ nhánh phụ > 1 lần).
--
-- LÀM GÌ: thêm 1 hàm đọc `fn_hl_ghep_y(p_ids uuid[]) → jsonb`
--   { thu_tu: [id theo thứ tự in], phan: {id: [phần giả thiết]}, canh_bao: [câu] }
--   · `phan` = fn_hl_gia_thiet_phan (giữ là nguồn công thức duy nhất) — chỉ thay ĐOẠN ĐẦU (gốc … nút nhóm)
--     bằng giả thiết của thành viên được chọn, cho các ý nằm dưới nút nhóm đó. Không chọn thành viên ⇒ y như cũ.
--   · `thu_tu` = thứ tự số B (như cũ), riêng ý của thành viên được kéo lên đứng ngay trước ý đầu tiên dưới nhóm.
--   Không đổi hàm nào đang có. MẤT GÌ: không.
-- ============================================================================

-- Mỗi ý = (nút giả thiết, thứ tự số B, nút nhóm nếu nằm trong thành viên, nút "hiệu dụng" = thành viên quy về nhóm, đường gốc → nút).
create or replace function public._hl_ghep_y_nut(p_ids uuid[])
returns table(id uuid, ma text, r int, mh uuid, nhom uuid, eff uuid, duong uuid[])
language sql stable
set search_path = public
as $$
  select b.id, b.ma, (row_number() over (order by length(b.ma), b.ma))::int, b.mo_hinh_id,
         case when m.vai = 'thanh_vien' then public._hl_cha_mo_hinh(m.id) end,
         case when m.vai = 'thanh_vien' then public._hl_cha_mo_hinh(m.id) else m.id end,
         public._hl_duong_mo_hinh(b.mo_hinh_id)
    from hinh_baitoan b join hinh_mo_hinh m on m.id = b.mo_hinh_id
   where b.id = any(p_ids)
$$;
revoke all on function public._hl_ghep_y_nut(uuid[]) from public;
revoke execute on function public._hl_ghep_y_nut(uuid[]) from anon;
grant execute on function public._hl_ghep_y_nut(uuid[]) to authenticated;

create or replace function public.fn_hl_ghep_y(p_ids uuid[])
returns jsonb
language plpgsql stable
set search_path = public
as $$
declare
  v_ids    uuid[];
  r        record;
  v_phan   jsonb := '{}'::jsonb;
  v_canh   text[] := '{}';
  v_thu    jsonb;
  v_d      uuid[];          -- đường dài nhất (gốc … nút sâu nhất) sau khi quy thành viên về nút nhóm
  v_top    int;
  v_re     int := 0;
  v_i      int;
  v_le     boolean := false;
  v_tv     uuid;
  v_tvgt   text;
  v_p      int;
  v_base   int;
  v_parts  text[];
  v_m      hinh_mo_hinh%rowtype;
  v_b      hinh_baitoan%rowtype;
begin
  select coalesce(array_agg(distinct x), '{}') into v_ids from unnest(p_ids) x where x is not null;
  if cardinality(v_ids) = 0 then return jsonb_build_object('thu_tu', '[]'::jsonb, 'phan', '{}'::jsonb, 'canh_bao', '[]'::jsonb); end if;

  -- ── CẢNH BÁO 1: 2 thành viên của CÙNG một nhóm ──
  for r in
    select g.nhom, n.ten from public._hl_ghep_y_nut(v_ids) g join hinh_mo_hinh n on n.id = g.nhom
     where g.nhom is not null group by g.nhom, n.ten having count(distinct g.mh) > 1
  loop
    v_canh := v_canh || format('Lấy ý của 2 thành viên cùng nhóm bài «%s» — một đề chỉ nên vào nhóm bằng một cửa.', r.ten);
  end loop;

  -- ── CẢNH BÁO 2 + 3: một đường theo chiều mũi tên, rẽ nhánh phụ tối đa 1 lần ──
  select public._hl_duong_mo_hinh(g.eff) into v_d
    from public._hl_ghep_y_nut(v_ids) g order by cardinality(public._hl_duong_mo_hinh(g.eff)) desc, g.r limit 1;
  if exists (select 1 from public._hl_ghep_y_nut(v_ids) g where not (g.eff = any(v_d))) then
    v_le := true;
    v_canh := v_canh || 'Các ý nằm trên 2 nhánh anh em — không đi được thành một đường (chọn ý trên cùng một đường từ gốc xuống).'::text;
  else
    select min(array_position(v_d, g.eff)) into v_top from public._hl_ghep_y_nut(v_ids) g;
    for v_i in v_top + 1 .. cardinality(v_d) loop
      if exists (select 1 from hinh_mo_hinh_cha c where c.mo_hinh_id = v_d[v_i] and c.cha_id = v_d[v_i - 1] and not c.chinh) then
        v_re := v_re + 1;
      end if;
    end loop;
    if v_re > 1 then
      v_canh := v_canh || format('Đường đi rẽ sang nhánh phụ %s lần — tối đa 1 lần (đi thẳng nhánh chính hoặc qua nhóm bài không tính).', v_re);
    end if;
  end if;

  -- ── PHẦN GIẢ THIẾT từng ý ──
  for r in select * from public._hl_ghep_y_nut(v_ids) loop
    v_parts := public.fn_hl_gia_thiet_phan(r.id);
    if r.nhom is null then
      -- Ý dưới nút nhóm N mà đề có chọn thành viên của N ⇒ đoạn đầu (… N) thay bằng giả thiết thành viên.
      -- Nhiều nhóm lồng trên đường ⇒ lấy nhóm sâu nhất có thành viên được chọn.
      select g.mh, array_position(r.duong, g.nhom) into v_tv, v_p
        from public._hl_ghep_y_nut(v_ids) g
       where g.nhom is not null and g.nhom = any(r.duong)
       order by array_position(r.duong, g.nhom) desc, g.r limit 1;
      if v_tv is not null then
        select * into v_b from hinh_baitoan where id = r.id;
        v_base := 1;                                   -- node thay-thế sâu nhất (như fn_hl_gia_thiet_phan)
        for v_i in 2 .. cardinality(r.duong) loop
          select * into v_m from hinh_mo_hinh where id = r.duong[v_i];
          if v_m.gt_thay_the then v_base := v_i; end if;
        end loop;
        if not v_b.gt_thay_the and v_base <= v_p then  -- base nằm trên/đúng nút nhóm mới thay; sâu hơn ⇒ giữ
          select nullif(btrim(gia_thiet), '') into v_tvgt from hinh_mo_hinh where id = v_tv;
          v_parts := case when v_tvgt is not null then array[v_tvgt] else '{}'::text[] end;
          for v_i in v_p + 1 .. cardinality(r.duong) loop
            select * into v_m from hinh_mo_hinh where id = r.duong[v_i];
            if coalesce(btrim(v_m.gia_thiet_them), '') <> '' then v_parts := v_parts || btrim(v_m.gia_thiet_them); end if;
          end loop;
          if coalesce(btrim(v_b.gia_thiet_rieng), '') <> '' then v_parts := v_parts || btrim(v_b.gia_thiet_rieng); end if;
        end if;
      end if;
      v_tv := null; v_p := null;
    end if;
    v_phan := v_phan || jsonb_build_object(r.id::text, to_jsonb(coalesce(v_parts, '{}'::text[])));
  end loop;

  -- ── THỨ TỰ IN: số B; ý thành viên của N kéo lên ngay trước ý đầu tiên dưới N ──
  select jsonb_agg(k.id order by k.k1, k.k2, k.r) into v_thu
    from (
      select g.id, g.r,
             case when g.nhom is null then g.r
                  else least(g.r, coalesce((select min(h.r) from public._hl_ghep_y_nut(v_ids) h where h.nhom is null and g.nhom = any(h.duong)), g.r)) end as k1,
             case when g.nhom is null then 1 else 0 end as k2
        from public._hl_ghep_y_nut(v_ids) g
    ) k;

  return jsonb_build_object('thu_tu', coalesce(v_thu, '[]'::jsonb), 'phan', v_phan, 'canh_bao', to_jsonb(v_canh));
end
$$;

revoke all on function public.fn_hl_ghep_y(uuid[]) from public;
revoke execute on function public.fn_hl_ghep_y(uuid[]) from anon;
grant execute on function public.fn_hl_ghep_y(uuid[]) to authenticated;
