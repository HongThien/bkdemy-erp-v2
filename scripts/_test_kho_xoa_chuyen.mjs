// Kiểm mig bdm_kho_cau_xoa_chuyen_dang TRONG ROLLBACK (phiên admin): chuyển dạng bài, xoá câu / cả bản sao, chặn câu Đ/S.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
try {
  await q('begin')
  if (process.argv.includes('--mig')) await q(fs.readFileSync(fs.readdirSync('supabase/migrations').filter((x) => x.endsWith('_bdm_kho_cau_xoa_chuyen_dang.sql')).map((x) => 'supabase/migrations/' + x).pop(), 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const r = (await q(`select fn_bdm_cau_chuyen_dang('T14T080102001', 'NDB01541') x`))[0].x
  const g = await q(`select d.dang_bai_id, d.nguon from bdm_cau_dang d where d.ma_cau = 'T14T080102001'`)
  kt(r?.id === 'NDB01541' && g[0]?.dang_bai_id === 'NDB01541', `chuyển T14T080102001 → NDB01541 (${r?.ten}, ${r?.so_cau} câu)`)
  const con = (await q(`select count(*)::int n from dai_cau_hoi c join bdm_cau_dang d on d.ma_cau = c.ma_cau where c.parent_ma_cau = 'T14T080102001' and c.xoa_at is null and d.dang_bai_id = 'NDB01541'`))[0].n
  kt(con > 0, `bản sao đi theo câu gốc (${con} bản sao giờ ở NDB01541)`)
  try { await q('savepoint s'); await q(`select fn_bdm_cau_chuyen_dang('T14T080102001', 'NDB00419')`); kt(false, 'chặn dạng bài khác khối/nhánh?') } catch (e) { await q('rollback to savepoint s'); kt(true, 'dạng bài lạ vẫn ghi được? → không, báo: ' + e.message.slice(0, 70)) }
  const n1 = (await q(`select fn_bdm_cau_xoa('T14T080101007', false) n`))[0].n
  kt(n1 === 1, 'xoá 1 bản sao → kho rác 1 câu')
  const nCon = (await q(`select count(*)::int n from dai_cau_hoi where parent_ma_cau = 'T14T080104001' and xoa_at is null`))[0].n
  const n2 = (await q(`select fn_bdm_cau_xoa('T14T080104001', true) n`))[0].n
  kt(n2 === nCon + 1, `xoá câu gốc + ${nCon} bản sao → ${n2} câu vào kho rác`)
  const ds = (await q(`select ma_cau from dai_cau_hoi where loai_cau = 'dung_sai' and xoa_at is null limit 1`))[0]
  try { await q('savepoint s'); await q(`select fn_bdm_cau_chuyen_dang($1, 'NDB00419')`, [ds.ma_cau]); kt(false, 'chặn câu Đ/S') } catch (e) { await q('rollback to savepoint s'); kt(/Đúng\/Sai|chưa chạy|không thuộc/.test(e.message), 'chặn câu Đ/S: ' + e.message.slice(0, 80)) }
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
