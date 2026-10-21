// Kiểm builder đọc câu HGT (mig 202610211629) TRONG ROLLBACK: node scripts/_test_hgt_bdm_builder.mjs [--mig file]
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0
const kt = (dk, ten, ct = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten, ct) } }
try {
  await q('begin')
  const im = process.argv.indexOf('--mig'); if (im > 0) await q(fs.readFileSync(process.argv[im + 1], 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  for (const k of ['6', '12']) {   // K10 chưa có câu HGT nào gán (21/10)
    const t0 = Date.now()
    const [{ cay }] = await q(`select fn_tl_bdm_cay_chon($1, 'hgt') cay`, [k])
    const nhoms = cay.chu_de.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom))
    const soCau = nhoms.reduce((s, n) => s + n.dang_bai.reduce((x, d) => x + d.so_cau, 0), 0)
    kt(soCau > 0, `K${k} HGT: cây có ${nhoms.length} nhóm, ${soCau} câu dùng được (${Date.now() - t0}ms)`)
    const [{ cayT }] = await q(`select fn_tl_bdm_cay_chon($1, 'toan') "cayT"`, [k])
    kt(cayT.chu_de.every((cd) => cd.id), `K${k} Đại vẫn chạy (${cayT.chu_de.length} chủ đề)`)
    const N = nhoms.find((n) => n.dang_bai.some((d) => d.so_cau >= 2))
    if (!N) { kt(false, `K${k}: không có nhóm HGT nào đủ câu để thử`); continue }
    const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('chuyen_de','[T]',$1,'Toán','hinh_gt','moi') returning id`, [k])
    const [b] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,0,'buoi','Phần 1') returning id`, [tl.id])
    const [{ nd }] = await q(`select fn_tl_bdm_dat_buoi($1,$2,$3::jsonb) nd`, [tl.id, b.id, JSON.stringify([{ nhom: N.id, dang_bai: N.dang_bai.map((d) => d.id) }])])
    const caus = nd.buoi[0].nhom[0].dang_bai.flatMap((d) => d.caus).concat(nd.buoi[0].nhom[0].btvn?.caus ?? [])
    kt(caus.length > 0 && caus.every((m) => m.startsWith('T3')), `K${k}: chuyên đề HGT đặt nhóm "${N.ten}" ⇒ ${caus.length} câu HGT (T3…)`)
    const co = await q(`select count(*)::int n from hgt_cau_hoi where ma_cau = any($1)`, [caus])
    kt(co[0].n === caus.length, `K${k}: mọi câu có trong hgt_cau_hoi`)
  }
} catch (e) { sai++; console.log('LỖI:', e.message, e.where ?? '') }
await q('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`)
process.exitCode = sai ? 1 : 0
