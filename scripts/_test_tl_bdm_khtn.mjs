// Test mig 202611031655 (giáo trình + ET bản đồ mới theo MÔN — KHTN) trong 1 transaction rồi ROLLBACK.
//   node scripts/_test_tl_bdm_khtn.mjs [--da-ap]
// (1) Toán KHÔNG đổi: băm đầu ra mọi hàm builder/ET trên dữ liệu thật trước ↔ sau khi áp mig.
// (2) KHTN K7: cây chọn · đặt buổi · chặn nhóm khác môn · nội dung · gán lớp · ET đề xuất / vị trí / 3 mã đề.
import pg from 'pg'; import fs from 'node:fs'; import crypto from 'node:crypto'
const MIG = 'supabase/migrations/202611031655_tl_bdm_theo_mon_khtn.sql'
const url = fs.readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({connectionString:url}); await c.connect()
const q = async (s,a)=>(await c.query(s,a)).rows
let ok = 0, fail = 0
const kiem = (t, d, x = '') => { if (d) { ok++; console.log('  ✔', t) } else { fail++; console.log('  ✘', t, x) } }
const loiKhi = async (s, a) => { await c.query('savepoint s'); try { await c.query(s, a); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
const bam = (x) => crypto.createHash('md5').update(JSON.stringify(x)).digest('hex').slice(0, 10)
const doMs = async (s, a) => { const t = Date.now(); const r = await q(s, a); return [r, Date.now() - t] }

try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])

  // ── (1) Toán: bộ đầu vào thật, chụp TRƯỚC khi áp ──
  const gts = await q(`select id from tai_lieu where ban_do = 'moi' and mon = 'Toán' and loai in ('giao_trinh','chuyen_de') and luu_tru_tu is null order by updated_at desc limit 4`)
  const buois = await q(`select p.tai_lieu_id, p.id from tai_lieu_phan p where p.tai_lieu_id = any($1) and p.loai_phan = 'buoi' order by p.thu_tu desc limit 4`, [gts.map((g) => g.id)])
  const nhoms = await q(`select distinct p.ref_ma id, t.khoi from tai_lieu_phan p join tai_lieu t on t.id = p.tai_lieu_id where t.id = any($1) and p.loai_phan = 'nhom' limit 4`, [gts.map((g) => g.id)])
  const ets = await q(`select t.id, t.khoi, t.lop_id, t.ngay from tai_lieu t where t.loai = 'et' and t.ban_do = 'moi' and t.mon = 'Toán' order by t.updated_at desc limit 2`)
  const etCau = []
  for (const e of ets) etCau.push((await q(`select tc.ma_cau from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1 order by tc.thu_tu`, [e.id])).map((r) => r.ma_cau))
  const chup = async () => {
    const o = {}
    for (const [k, nh] of [['7','toan'],['9','toan'],['10','hgt'],['12','toan']]) o[`cay${k}${nh}`] = bam((await q(`select fn_tl_bdm_cay_chon($1,$2) j`, [k, nh]))[0].j)
    for (const g of gts) o[`nd${g.id.slice(0,6)}`] = bam((await q(`select fn_tl_bdm_noi_dung($1) j`, [g.id]))[0].j)
    for (const b of buois) o[`ot${b.id.slice(0,6)}`] = bam((await q(`select fn_tl_bdm_on_tap_ung_vien($1,$2) j`, [b.tai_lieu_id, b.id]))[0].j)
    for (const n of nhoms) {
      o[`cau${n.id}`] = bam((await q(`select fn_tl_bdm_cau($1) j`, [n.id]))[0].j)
      o[`gy${n.id}`] = bam((await q(`select fn_tl_bdm_goi_y($1, null, '{"_tong":6,"trac_nghiem":3,"tu_luan":1}'::jsonb) j`, [n.id]))[0].j)
    }
    for (const [i, e] of ets.entries()) {
      o[`dx${i}`] = bam((await q(`select fn_tl_bdm_et_de_xuat($1,$2) j`, [e.lop_id, e.ngay]))[0].j)
      const vt = await q(`select * from fn_tl_bdm_et_vi_tri($1,$2) order by 1`, [e.khoi, etCau[i]])
      o[`vt${i}`] = bam(vt)
      const base = vt.filter((v) => v.dang_bai_id).slice(0, 4).map((v) => ({ ma_cau: v.ma_cau, dang_bai: v.dang_bai_id, form: 'tra_loi_ngan' }))
      o[`md${i}`] = bam((await q(`select fn_tl_bdm_et_ma_de($1,$2::jsonb) j`, [e.khoi, JSON.stringify(base)]))[0].j)
    }
    return o
  }
  const truoc = process.argv.includes('--da-ap') ? null : await chup()
  if (truoc) {
    const t = Date.now(); await c.query(fs.readFileSync(MIG, 'utf8')); console.log(`  (áp mig trong transaction: ${Date.now() - t} ms)`)
    const sau = await chup()
    const lech = Object.keys(truoc).filter((k) => truoc[k] !== sau[k])
    kiem(`Toán: ${Object.keys(truoc).length} đầu ra giống hệt trước/sau (${gts.length} giáo trình · ${nhoms.length} nhóm · ${ets.length} ET)`, lech.length === 0, lech.join(', '))
  }

  // ── (2) KHTN K7 ──
  const [[{ cay }], ms] = await doMs(`select fn_tl_bdm_cay_chon('7','khtn') ->'chu_de' cay`)
  const kn = cay.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom)), kd = kn.flatMap((n) => n.dang_bai)
  console.log(`   cây KHTN K7: ${cay.length} chủ đề · ${kn.length} nhóm · ${kd.length} dạng bài · ${kd.reduce((s, d) => s + d.so_cau, 0)} câu đã phân · ${kn.reduce((s, n) => s + n.so_cau_chua_phan, 0)} chưa phân (${ms} ms)`)
  const [dem] = await q(`select count(*)::int n from khtn_bdm_gan_cau g join khtn_cau_hoi c on c.ma_cau = g.ma_cau join khtn_bdm_dang_bai d on d.id = g.dang_bai_id
                          join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '7' and c.kho_chuan and c.xoa_at is null`)
  kiem(`cây KHTN K7 = 7 chủ đề · 67 nhóm · 117 dạng bài`, cay.length === 7 && kn.length === 67 && kd.length === 117)
  kiem(`số câu đã phân trên cây = kho chuẩn đã gán (${dem.n})`, kd.reduce((s, d) => s + d.so_cau, 0) === dem.n)
  kiem('cây Toán K7 không lẫn nhóm KHTN', !JSON.stringify((await q(`select fn_tl_bdm_cay_chon('7','toan') j`))[0].j).includes('"KNB'))

  const A = kn.find((n) => n.dang_bai.length >= 2 && n.dang_bai.filter((d) => d.so_cau >= 3).length >= 2)
  const B = kn.find((n) => n.dang_bai.length === 0 && n.so_cau_chua_phan > 0) ?? kn.find((n) => n.id !== A.id && n.so_cau_chua_phan > 0)
  const [lop] = await q(`select id from lop where khoi = '7' and mon = 'KHTN' limit 1`)
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id) values ('giao_trinh','[T] KHTN','7','KHTN','moi',$1) returning id`, [lop?.id ?? null])
  const [b] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,0,'buoi','B1') returning id`, [tl.id])
  const chon = [{ nhom: A.id, dang_bai: A.dang_bai.map((d) => d.id) }, ...(B ? [{ nhom: B.id, dang_bai: B.dang_bai.map((d) => d.id) }] : [])]
  const [[{ nd }], ms2] = await doMs(`select fn_tl_bdm_dat_buoi($1,$2,$3::jsonb) nd`, [tl.id, b.id, JSON.stringify(chon)])
  const bn = nd.buoi[0].nhom
  kiem(`đặt buổi KHTN (${ms2} ms): nhóm «${A.ten}» ${bn[0].dang_bai.length} dạng bài, câu luyện ${bn[0].dang_bai.map((d) => d.caus.length).join('+')}, BTVN ${bn[0].btvn?.caus.length}`,
    bn[0].ten === A.ten && bn[0].dang_bai.every((d) => d.caus.length > 0) && bn[0].btvn?.caus.length > 0)
  if (B) kiem(`nhóm «${B.ten}» (${B.dang_bai.length} dạng bài): luyện chưa phân ${bn[1].chua_phan?.caus.length ?? 0} câu`, (bn[1].chua_phan?.caus.length ?? 0) + bn[1].dang_bai.reduce((s, d) => s + d.caus.length, 0) > 0)
  const tat = [...bn.flatMap((n) => [...n.dang_bai.flatMap((d) => d.caus), ...(n.chua_phan?.caus ?? []), ...(n.btvn?.caus ?? [])])]
  kiem('mọi câu của buổi là câu KHTN, không lặp', tat.length === new Set(tat).size && (await q(`select count(*)::int n from khtn_cau_hoi where ma_cau = any($1)`, [tat]))[0].n === tat.length)
  const [toanNhom] = await q(`select id from dai_bdm_nhom limit 1`)
  let e = await loiKhi(`select fn_tl_bdm_dat_buoi($1,$2,$3::jsonb)`, [tl.id, b.id, JSON.stringify([{ nhom: toanNhom.id, dang_bai: [] }])])
  kiem('giáo trình KHTN không nhận nhóm Toán', e && e.includes('môn KHTN'), e)
  const [tlT] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('giao_trinh','[T] Toán','7','Toán','moi') returning id`)
  const [bT] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,0,'buoi','B1') returning id`, [tlT.id])
  e = await loiKhi(`select fn_tl_bdm_dat_buoi($1,$2,$3::jsonb)`, [tlT.id, bT.id, JSON.stringify([{ nhom: A.id, dang_bai: [] }])])
  kiem('giáo trình Toán không nhận nhóm KHTN', e && e.includes('môn Toán'), e)

  const kc = await q(`select fn_tl_bdm_cau($1) j`, [A.id])
  kiem(`kho câu nhóm «${A.ten}»: ${kc[0].j.length} câu`, kc[0].j.length > 0 && kc[0].j.every((x) => x.dang_bai_id === null || A.dang_bai.some((d) => d.id === x.dang_bai_id)))

  if (lop) {
    const [gt] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay, nguon_id, nguon_buoi) values ('giao_trinh_buoi','[T]','7','KHTN','moi',$1,'2099-03-03',$2,$3) returning id`, [lop.id, tl.id, b.id])
    await q(`select fn_tl_bdm_trich_buoi($1,$2,$3,'gt','Buổi 1')`, [tl.id, b.id, gt.id])
    const [{ dx }] = await q(`select fn_tl_bdm_et_de_xuat($1,'2099-03-03') dx`, [lop.id])
    kiem(`ET đề xuất từ giáo trình buổi của lớp: ${dx.dang_bai.length} dạng bài`, dx.giao_trinh === gt.id && dx.dang_bai.length === A.dang_bai.length)
    const base = []
    for (const d of A.dang_bai.slice(0, 3)) { const [{ g }] = await q(`select fn_tl_bdm_goi_y($1, array[$2], '{"_tong":1}'::jsonb, $3) g`, [A.id, d.id, base.map((x) => x.ma_cau)]); g.forEach((m) => base.push({ ma_cau: m, dang_bai: d.id, form: 'trac_nghiem' })) }
    const vt = await q(`select * from fn_tl_bdm_et_vi_tri('7', $1)`, [base.map((x) => x.ma_cau)])
    kiem(`ET vị trí: ${vt.length}/${base.length} câu ra đúng dạng bài`, vt.length === base.length && vt.every((v) => base.find((x) => x.ma_cau === v.ma_cau).dang_bai === v.dang_bai_id))
    const [[{ md }], ms3] = await doMs(`select fn_tl_bdm_et_ma_de('7', $1::jsonb) md`, [JSON.stringify(base)])
    const de2 = base.map((x) => md.etMaDe[x.ma_cau]?.[0]), khac = de2.filter((m, i) => m && m !== base[i].ma_cau).length
    kiem(`3 mã đề KHTN (${ms3} ms): đề 2 khác đề gốc ${khac}/${base.length} câu`, base.every((x) => md.etMaDe[x.ma_cau]?.length === 2) && khac > 0)
    const [et] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay) values ('et','[T] ET','7','KHTN','moi',$1,'2099-03-03') returning id`, [lop.id])
    kiem('lưu ET KHTN bản đồ mới (trigger không chặn)', !!et.id)
  } else console.log('   (không có lớp KHTN khối 7 — bỏ qua gán lớp + ET)')

  const quyen = await q(`select c.relname, has_table_privilege('anon', c.oid, 'select') anon from pg_class c where c.relname like 'tl_bdm_%_v'`)
  kiem('anon không đọc được view registry', quyen.length === 5 && quyen.every((r) => !r.anon), JSON.stringify(quyen))
  const qf = await q(`select p.oid::regprocedure::text f, has_function_privilege('anon', p.oid, 'execute') anon from pg_proc p where p.proname in ('_tl_bdm_mon_nhom','_tl_bdm_cau_vi_tri')`)
  kiem('anon không gọi được hàm registry mới', qf.filter((r) => r.f.includes('text, text') || r.f.includes('mon_nhom')).every((r) => !r.anon), JSON.stringify(qf))
} catch (e) { fail++; console.log('  ✘ LỖI', e.message) }
finally { await q('rollback'); await c.end(); console.log(`\n${ok} ✔ · ${fail} ✘ (ROLLBACK)`); process.exit(fail ? 1 : 0) }
