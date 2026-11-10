// Thử mig 202611101717_dbht_hinh_hoc_cot_bai_hoc trong transaction rồi ROLLBACK. Nhẹ.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const bang = async (khoi, cap) => (await q(`select fn_dbht_bang('Toán', $1, 4, $2) j`, [khoi, cap]))[0].j
try {
  await c.query('begin'); await c.query("set local statement_timeout='2min'")
  const uid = (await q(`select updated_by u from he_thong_cong_tac where ma='mastery_ban_do_moi'`))[0].u
  await c.query(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })])
  const truoc = {}
  for (const k of ['7', '8', '9']) for (const cap of ['chu_de', 'chuyen_de', 'nhom']) truoc[k + cap] = await bang(k, cap)
  await c.query(fs.readFileSync('supabase/migrations/202611101717_dbht_hinh_hoc_cot_bai_hoc.sql', 'utf8'))
  console.log('mig chạy được trong txn')
  for (const k of ['7', '8', '9']) for (const cap of ['chu_de', 'chuyen_de', 'nhom']) {
    const a = truoc[k + cap]; const t0 = Date.now(); const b = await bang(k, cap); const ms = Date.now() - t0
    const laHinh = (m) => m === 'HINH' || m.startsWith('H:') || m.startsWith('HH:')
    // cột không phải Hình: ô giữ nguyên tuyệt đối
    let lech = 0, oHinhTruoc = 0, oHinhSau = 0
    const mapB = new Map(b.hs.map((h) => [h.id, h]))
    for (const h of a.hs) {
      const hb = mapB.get(h.id)
      for (const [m, o] of Object.entries(h.o)) { if (laHinh(m)) { oHinhTruoc++; continue } if (JSON.stringify(o) !== JSON.stringify(hb?.o[m])) lech++ }
      for (const [m, o] of Object.entries(hb?.o ?? {})) { if (laHinh(m)) oHinhSau++; else if (!(m in h.o)) lech++ }
    }
    const cotH = (x) => x.cot.filter((c) => laHinh(c.ma)).map((c) => c.ten + (c.cha ? ` ‹${c.cha}›` : ''))
    console.log(`K${k} ${cap} (${ms} ms): ô ngoài Hình lệch ${lech} · ô Hình ${oHinhTruoc} → ${oHinhSau} · cột Hình ${cotH(a).length} → ${cotH(b).length}`)
    if (cap !== 'chu_de') console.log('   sau:', cotH(b).slice(0, 12).join(' | '))
  }
  // ô lịch sử 1 cột bài học
  const b = await bang('7', 'chuyen_de'); const hh = b.cot.find((c) => c.ma.startsWith('HH:')); const em = hh && b.hs.find((h) => h.o[hh.ma])
  if (em) { const r = (await q(`select fn_dbht_o_lich_su($1,'Toán','chuyen_de',$2,4) j`, [em.id, hh.ma]))[0].j; console.log('lịch sử ô', hh.ten, '·', em.ten, ':', r.luot.length, 'lần · ô hiện', JSON.stringify(em.o[hh.ma])) }
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK') }
