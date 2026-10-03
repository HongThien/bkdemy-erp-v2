// Sinh migration MỞ kho TSA cho học sinh (tự luyện theo chủ đề/chuyên đề) — dựng từ định nghĩa hàm ĐANG CHẠY.
//   node scripts/tsa/sinh-migration-hocsinh.mjs <file migration ra> <timestamp>
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
const [, , ra, ts] = process.argv
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const def = async (n) => {
  const r = await c.query(`select pg_get_functiondef(p.oid) d from pg_proc p join pg_namespace s on s.oid=p.pronamespace where s.nspname='public' and proname=$1`, [n])
  if (r.rows.length !== 1) throw new Error(`${n}: ${r.rows.length} bản`)
  return r.rows[0].d.replace(/\r\n/g, '\n').trim()
}
const loi = (m) => { throw new Error('không thấy mốc: ' + m) }
const out = []

// 1) bật cờ kho
{
  const s = await def('_kho_co_mon'), re = /p_mon in \(([^)]*)\)/
  if (!re.test(s) || /'TSA'/.test(s)) loi('_kho_co_mon')
  out.push(s.replace(re, (m, l) => `p_mon in (${l}, 'TSA')`))
}

// 2) khoá đáp án câu KÉO THẢ: "a) $x$, b) $y$" → ["$x$","$y$"] (đúng chữ của thẻ trong ngân hàng lua_chon); NULL nếu không khớp số ô trống / không có ngân hàng
out.push(`create or replace function public._tsa_keo_tha_key(p_dap_an text, p_noi_dung text, p_lua_chon jsonb)
 returns jsonb language sql immutable
as $function$
  select case
    when p_lua_chon is null or jsonb_typeof(p_lua_chon) <> 'array' or jsonb_array_length(p_lua_chon) = 0 then null
    when v.n = 0 or v.n <> (select count(*) from regexp_matches(coalesce(p_noi_dung, ''), '_{4,}', 'g')) then null
    when exists (select 1 from jsonb_array_elements_text(v.arr) x where not (p_lua_chon ? x)) then null
    else v.arr end
  from (
    select coalesce(jsonb_agg(m[1] order by o), '[]'::jsonb) as arr, count(*)::int as n
    from regexp_matches(coalesce(p_dap_an, ''), '(?:^|,\\s*)[a-f]\\)\\s*(\\$[^$]*\\$)(?=,\\s*[a-f]\\)|\\s*$)', 'g') with ordinality t(m, o)
  ) v
$function$`)

// 3) bộ lọc câu phát cho học sinh: TSA giữ ĐỦ thể loại (trắc nghiệm · trả lời ngắn · Đúng/Sai · kéo thả); các môn khác y nguyên
out.push(`create or replace function public._kho_dk_online_sql(p_cautbl text)
 returns text language sql stable
as $function$
  select '(c.kho_chuan and ((c.loai_cau in (''trac_nghiem'',''tra_loi_ngan'') and c.dap_an is not null)'
      || ' or (c.loai_cau = ''dung_sai'' and jsonb_array_length(coalesce(c.menh_de,''[]''::jsonb)) >= 2)'
      || case when p_cautbl = 'tsa_cau_hoi' then ' or (c.loai_cau = ''keo_tha'' and public._tsa_keo_tha_key(c.dap_an, c.noi_dung, c.lua_chon) is not null)' else '' end
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || '))'
$function$`)
{
  const s = await def('_kho_dk_online_hs_sql'), a = 'select public._kho_dk_mcq_sql(p_cautbl)'
  if (!s.includes(a)) loi('dk_online_hs')
  // TSA: không áp luật "chỉ MCQ" (luật của luồng bổ trợ Toán) — giữ nguyên thể loại như tài liệu; môn khác y nguyên
  out.push(s.replace(a, "select case when p_cautbl = 'tsa_cau_hoi' then public._kho_dk_online_sql(p_cautbl) else public._kho_dk_mcq_sql(p_cautbl) end"))
}

// 4) chụp câu vào bài: khoá kéo thả
{
  const s = await def('_kho_snapshot_cau'), a = "      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))\n"
  if (!s.includes(a)) loi('snapshot')
  out.push(s.replace(a, a + "      when 'keo_tha' then public._tsa_keo_tha_key(v_row.dap_an, v_row.noi_dung, v_row.lua_chon)\n"))
}

// 5) chấm câu kéo thả: đúng từng ô, điểm theo tỉ lệ ô đúng
{
  const s = await def('_et_cham'), a = "    else  -- tra_loi_ngan:"
  if (!s.includes(a)) loi('_et_cham')
  out.push(s.replace(a, `    elsif rec.loai_cau = 'keo_tha' then
      n := jsonb_array_length(k); dung := 0;
      for i in 0 .. n - 1 loop
        if public.tln_norm(a ->> i) = public.tln_norm(k ->> i) and coalesce(a ->> i, '') <> '' then dung := dung + 1; end if;
      end loop;
      vd := (dung::numeric / greatest(n, 1)) * rec.diem;
      vv := case when dung = n then 'correct' when dung > 0 then 'partial' else 'wrong' end;
` + a))
}

await c.end()

// Mở chốt _kho_co_mon('TSA') tách file RIÊNG — chỉ áp SAU KHI deploy app HS mới (bản app cũ không biết môn TSA / câu kéo thả), như môn Anh.
const coMon = out.shift()
const tsMo = String(Number(ts) + 1)
const raMo = ra.replace(/\d{12}_tsa_mo_kho_hoc_sinh/, tsMo + '_tsa_mo_co_mon')
writeFileSync(raMo, `-- ============================================================================
-- ${tsMo} — tsa_mo_co_mon
-- VÌ SAO: mở chốt kho TSA cho học sinh. ÁP SAU KHI DEPLOY APP HS MỚI (có màn kéo thả + môn TSA) — bản app cũ không biết câu kéo thả.
--   Dựng từ định nghĩa ĐANG CHẠY của _kho_co_mon: nếu phiên Anh đã mở 'Tiếng Anh' trước thì danh sách đã có 'Tiếng Anh' — thêm 'TSA' vào, KHÔNG ghi đè.
--   ⚠ Hai phiên cùng sửa 1 hàm: ai áp SAU phải dựng lại từ định nghĩa đang chạy (chạy lại scripts/tsa/sinh-migration-hocsinh.mjs), đừng áp file cũ.
-- MẤT GÌ: không mất gì (thêm 'TSA' vào danh sách môn có kho).
-- ============================================================================
${coMon};
`, 'utf8')
const sql = `-- ============================================================================
-- ${ts} — tsa_mo_kho_hoc_sinh
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 02/10 — "lên được app cho học sinh học luôn và giữ đúng thể loại câu hỏi trong pdf". Mở chốt kho TSA cho học sinh
--   (tự luyện theo chủ đề/chuyên đề). Mig 202610021339 cố ý để đóng vì 16 hàm còn nhánh "không phải KHTN thì là Toán"; ở đây vá đúng
--   những hàm học sinh đi qua và mở chốt. Dựng từ định nghĩa ĐANG CHẠY (pg_get_functiondef).
--   • _kho_co_mon('TSA') = true (_kho_ds_nhanh: môn ≠ Toán đã là 1 nhánh — mig 202610021403 của phiên Anh).
--   • THỂ LOẠI: câu TSA giữ nguyên thể loại như PDF — bộ lọc _kho_dk_online(_hs)_sql cho TSA nhận trắc nghiệm · trả lời ngắn · Đúng/Sai · KÉO THẢ
--     (luật "chỉ MCQ" là của luồng bổ trợ Toán, không áp cho TSA). Kéo thả: _tsa_keo_tha_key() rút khoá đáp án theo từng ô từ dap_an chuẩn
--     "a) $x$, b) $y$" (chỉ câu chuẩn hoá được mới được phát); _kho_snapshot_cau chụp khoá; _et_cham chấm theo ô (điểm tỉ lệ ô đúng).
--   • tu_luyen_chu_de_ds_dang / hs_dang_evals / htd_* đã đi qua registry (mig 202610021403, phiên Anh) — TSA hưởng luôn, không cần nhánh riêng.
-- MẤT GÌ: không mất dữ liệu. Chỉ thay (create or replace) 6 hàm + thêm 1 hàm; hành vi Toán/KHTN giữ nguyên.
-- ============================================================================
${out.join(';\n\n')};
`
writeFileSync(ra, sql, 'utf8')
console.log('đã sinh', ra, sql.split('\n').length, 'dòng,', out.length, 'hàm')
