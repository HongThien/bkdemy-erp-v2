// CHỈ ĐỌC. Chi tiết tham chiếu vào chuyên đề T1120301 (dữ liệu HS thật đang dính tới đâu) + hàm xoá sẵn có.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect()
const dangs = ['T112030101','T112030102','T112030103','T112030104']
const q = async (title, sql, p = [dangs]) => { console.log('\n== ' + title); try { console.table((await c.query(sql, p)).rows) } catch (e) { console.log('  ERR', e.message.slice(0, 120)) } }
await q('99 câu: duyệt / lời giải / loại / thời gian', `select dang_chinh, count(*) n, count(*) filter (where da_duyet) da_duyet, count(*) filter (where loi_giai is not null and loi_giai<>'') co_loi_giai, string_agg(distinct loai_cau, ',') loai, min(created_at)::date tu, max(created_at)::date den from dai_cau_hoi where dang_chinh = any($1) group by 1 order by 1`)
await q('tai_lieu chứa câu của chuyên đề (68 dòng tai_lieu_cau)', `select t.id, t.loai, t.ten, l.ten_lop, t.ngay::date ngay, count(*) so_cau from tai_lieu_cau tc join tai_lieu t on t.id = tc.tai_lieu_id left join lop l on l.id = t.lop_id where tc.ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1)) group by 1,2,3,4,5 order by t.ngay`)
await q('bai_test_cau (bài test HS đã làm) — 7 dòng', `select b.ma_dang, count(*) n, count(distinct b.bai_test_id) so_bai, min(b.created_at)::date tu, max(b.created_at)::date den from bai_test_cau b where b.ma_dang = any($1) group by 1`)
await q('ca_test_cau — 12 dòng', `select ma_dang, count(*) n from ca_test_cau where ma_dang = any($1) group by 1`)
await q('gami_session_problems (đo mastery HS) — 23 dòng', `select ma_dang, count(*) n, count(distinct hoc_sinh_id) so_hs from gami_session_problems where ma_dang = any($1) group by 1`)
await q('tu_luyen_dang_lan — 7 dòng', `select ma_dang, count(*) n, count(distinct hoc_sinh_id) so_hs from tu_luyen_dang_lan where ma_dang = any($1) group by 1`)
await q('dai_cau_form_tn (32 form MCQ) — duyệt?', `select count(*) n, count(*) filter (where da_duyet) da_duyet from dai_cau_form_tn where ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))`)
await q('dai_dang_ly_thuyet (3)', `select ma_dang, length(noi_dung) do_dai from dai_dang_ly_thuyet where ma_dang = any($1)`)
await q('Các bảng FK khác: menh_de / bo_de / form_dien / yeu_cau / clone / de_thi / cum_bai / thuoc_tinh / tien_de', `
  select 'dai_cau_menh_de' b, count(*) from dai_cau_menh_de where dang_chinh = any($1) or ma_cau_cha in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cau_bo_de', count(*) from dai_cau_bo_de where ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cau_form_dien', count(*) from dai_cau_form_dien where ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cau_hoi_yeu_cau_giai', count(*) from dai_cau_hoi_yeu_cau_giai where ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cau_hoi_yeu_cau_clone', count(*) from dai_cau_hoi_yeu_cau_clone where ma_cau_goc in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cau_hoi_clone_cho_duyet', count(*) from dai_cau_hoi_clone_cho_duyet where parent_ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cau_hoi parent_ma_cau (câu khác trỏ cha vào đây)', count(*) from dai_cau_hoi where parent_ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1)) and dang_chinh <> all($1)
  union all select 'toan_de_thi_cau', count(*) from toan_de_thi_cau where ma_cau_dai in (select ma_cau from dai_cau_hoi where dang_chinh = any($1))
  union all select 'dai_cum_bai', count(*) from dai_cum_bai where ma_dang = any($1)
  union all select 'dai_dang_thuoc_tinh', count(*) from dai_dang_thuoc_tinh where ma_dang = any($1)
  union all select 'dai_dang_tien_de', count(*) from dai_dang_tien_de where ma_dang = any($1) or tien_de_ma_dang = any($1)
  union all select 'hoc_tu_dau_dang', count(*) from hoc_tu_dau_dang where ma_dang = any($1)`)
await q('Hàm/trigger sẵn có liên quan xoá dạng/câu Đại (kho rác)', `select proname, pg_get_function_identity_arguments(oid) args from pg_proc where pronamespace='public'::regnamespace and (proname ~ '(xoa|rac|khoi_phuc)' and proname ~ '(dai|kho|cau|dang)') order by 1`, [])
await q('Trigger trên dai_ban_do / dai_cau_hoi', `select tgrelid::regclass::text bang, tgname, tgenabled from pg_trigger where tgrelid in ('dai_ban_do'::regclass,'dai_cau_hoi'::regclass) and not tgisinternal order by 1,2`, [])
await c.end()
