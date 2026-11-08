// Kiểm mig 202610261822 (game Đấu trường / tháp theo BẢN ĐỒ MỚI K6–12) TRONG ROLLBACK: node scripts/_test_dtv_ban_do_moi.mjs [--mig]
//  --mig: áp file migration trong transaction (trước khi áp thật). Không có --mig: kiểm DB hiện tại (sau khi áp).
// 1) cấp 1 + KHTN: chủ đề / bộ câu / khối y hệt trước (chỉ so được khi --mig) · 2) HS K6/K9/K12: chủ đề NCD có tên, tháp tổng + tháp chủ đề đủ câu,
// sinh đề → phát → chấm → kết thúc; trận bot sinh → chấm · 3) đề bản đồ CŨ sinh trước khi áp vẫn chấm được · 4) khách (không jwt) · 5) thời gian từng hàm
import pg from 'pg'
import fs from 'node:fs'
const MIG = 'supabase/migrations/202610261822_dtv_thap_dau_truong_ban_do_moi.sql'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const doThoi = async (ten, s, a) => { const t0 = Date.now(); const r = await q(s, a); const ms = Date.now() - t0; console.log(`     ⏱ ${ten}: ${ms} ms`); return [r, ms] }
const vai = async (tk) => q("select set_config('request.jwt.claims', $1, true)", [tk ? JSON.stringify({ sub: tk, role: 'authenticated' }) : ''])
const hsKhoi = async (khoi) => (await q(`
  select tk.id tk, hl.hoc_sinh_id hs, l.khoi from tai_khoan tk join hoc_sinh_lop hl on hl.hoc_sinh_id = tk.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
  join lop l on l.id = hl.lop_id and l.mon = 'Toán' and l.khoi = $1
  where exists (select 1 from gami_grades g where g.hoc_sinh_id = hl.hoc_sinh_id)
  order by (select count(*) from gami_grades g where g.hoc_sinh_id = hl.hoc_sinh_id) desc limit 1`, [khoi]))[0]
const SEED = 'thap|vo_tan|Toán|x|2026-10-26'
try {
  await q('begin')
  const hs6 = await hsKhoi('6'), hs9 = await hsKhoi('9'), hs12 = await hsKhoi('12'), hs4 = await hsKhoi('4'), hs5 = await hsKhoi('5')
  console.log('HS mẫu:', [hs6, hs9, hs12, hs4, hs5].map((h) => h ? `${h.khoi}:${h.hs.slice(0, 8)}` : '—').join(' · '))
  const [cb] = await q(`select bat from he_thong_cong_tac where ma = 'mastery_ban_do_moi'`); console.log('công tắc mastery_ban_do_moi =', cb?.bat)

  // ── ảnh chụp TRƯỚC (cấp 1 · KHTN · khách) ──
  const chup = async () => {
    const o = {}
    await vai(null)
    o.khoi = (await q(`select fn_dtv_kho_khoi('Toán') j`))[0].j.filter((x) => ['3', '4', '4T', '5', '5T'].includes(x.khoi))
    o.khtnKhoi = (await q(`select fn_dtv_kho_khoi('KHTN') j`))[0].j
    for (const k of ['3', '4', '4T', '5', '5T']) {
      o['cd' + k] = (await q(`select fn_dtv_kho_chu_de('Toán', $1) j`, [k]))[0].j
      o['bo' + k] = (await q(`select fn_dtv_kho_bo_cau('Toán', $1, null, 200, $2, true) j`, [k, SEED]))[0].j
      const cd = o['cd' + k][0]?.ma
      if (cd) o['bocd' + k] = (await q(`select fn_dtv_kho_bo_cau('Toán', $1, $2, 200, $3, true) j`, [k, cd, SEED]))[0].j
    }
    o.khtnCd = (await q(`select fn_dtv_kho_chu_de('KHTN', '8') j`))[0].j
    o.khtnBo = (await q(`select fn_dtv_kho_bo_cau('KHTN', '8', null, 100, $1, false) j`, [SEED]))[0].j
    for (const h of [hs4, hs5].filter(Boolean)) {
      await vai(h.tk)
      o['hscd' + h.khoi] = (await q(`select fn_dtv_kho_chu_de('Toán', $1) j`, [h.khoi]))[0].j
      o['hsbo' + h.khoi] = (await q(`select fn_dtv_kho_bo_cau('Toán', $1, null, 200, $2, true) j`, [h.khoi, SEED]))[0].j
    }
    await vai(null)
    return o
  }
  const coMig = process.argv.includes('--mig')
  let truoc = null, deCu = null
  if (coMig) {
    truoc = await chup()
    truoc.cd9cu = (await q(`select fn_dtv_kho_chu_de('Toán', '9') j`))[0].j
    truoc.bo9cu = (await q(`select fn_dtv_kho_bo_cau('Toán', '9', null, 200, $1, true) j`, [SEED]))[0].j
    truoc.khoiAll = (await q(`select fn_dtv_kho_khoi('Toán') j`))[0].j
    // đề tháp bản CŨ của HS K9 (sinh trước khi áp) — sau khi áp phải phát + chấm được
    if (hs9) {
      await vai(hs9.tk); await q(`select fn_dtv_ho_so_hs()`)
      const [r] = await q(`select fn_dtv_de_moi($1, 'Toán', 'song_con', '9', null) j`, ['hs_' + hs9.hs]); deCu = r.j.de_id
      await vai(null)
    }
    await q(fs.readFileSync(MIG, 'utf8'))
    console.log('— đã áp migration trong transaction —')
  }
  if (truoc) {
    const sau = await chup()
    for (const k of Object.keys(truoc).filter((x) => x in sau)) kt(JSON.stringify(truoc[k]) === JSON.stringify(sau[k]), `y hệt trước: ${k} (${Array.isArray(truoc[k]) ? truoc[k].length : '?'} phần tử)`)
    // công tắc TẮT ⇒ K6–12 quay về y hệt bản cũ (game theo bản đồ cũ)
    await q(`update he_thong_cong_tac set bat = false where ma = 'mastery_ban_do_moi'`)
    await vai(null)
    const cd9 = (await q(`select fn_dtv_kho_chu_de('Toán', '9') j`))[0].j, bo9 = (await q(`select fn_dtv_kho_bo_cau('Toán', '9', null, 200, $1, true) j`, [SEED]))[0].j
    const kh = (await q(`select fn_dtv_kho_khoi('Toán') j`))[0].j
    kt(JSON.stringify(cd9) === JSON.stringify(truoc.cd9cu) && JSON.stringify(bo9) === JSON.stringify(truoc.bo9cu) && JSON.stringify(kh) === JSON.stringify(truoc.khoiAll),
      `công tắc TẮT ⇒ K9 chủ đề (${cd9.length}) + bộ câu + danh sách khối y hệt bản cũ`)
    await q(`update he_thong_cong_tac set bat = true where ma = 'mastery_ban_do_moi'`)
  }

  // ── khách (không jwt): K9 ──
  await vai(null)
  {
    const [[r1], ms1] = await doThoi('khách fn_dtv_kho_khoi(Toán)', `select fn_dtv_kho_khoi('Toán') j`)
    const k = r1.j.map((x) => `${x.khoi}:${x.so_cau}`); console.log('     khối:', k.join(' '))
    kt(r1.j.some((x) => x.khoi === '9') && r1.j.some((x) => x.khoi === '4'), `khối có cả cấp 1 lẫn K6–12 (${ms1} ms)`)
    const [[r2], ms2] = await doThoi('khách fn_dtv_kho_chu_de(Toán, 9)', `select fn_dtv_kho_chu_de('Toán', '9') j`)
    console.log('     ', r2.j.map((x) => `${x.ma} ${x.ten} (${x.so_cau})`).join(' | '))
    kt(r2.j.length > 0 && r2.j.every((x) => /^NCD|^HINH_HOC$/.test(x.ma) && x.ten), `khách K9: ${r2.j.length} chủ đề NCD/Hình học có tên`)
  }

  for (const h of [hs6, hs9, hs12].filter(Boolean)) {
    console.log(`\n▶ HS K${h.khoi} ${h.hs}`)
    await vai(h.tk)
    const uid = 'hs_' + h.hs
    await q(`select fn_dtv_ho_so_hs()`)
    const [[hoc]] = await doThoi('_hs_dang_da_hoc', `select _hs_dang_da_hoc($1, 'Toán') a`, [h.hs])
    console.log(`     dạng lớp đã học: ${hoc.a.length} (NDB ${hoc.a.filter((x) => /^NDB/.test(x)).length})`)
    const [[cd], msCd] = await doThoi('fn_dtv_kho_chu_de', `select fn_dtv_kho_chu_de('Toán', $1) j`, [h.khoi])
    console.log('     ', cd.j.map((x) => `${x.ma} ${x.ten} (${x.so_cau})`).join(' | '))
    kt(cd.j.every((x) => /^NCD|^HINH_HOC$/.test(x.ma) && x.ten && x.so_cau >= 8), `K${h.khoi}: ${cd.j.length} chủ đề NCD có tên, mỗi chủ đề ≥8 câu`)
    kt(msCd < 3000, `fn_dtv_kho_chu_de < 3 s (${msCd} ms)`)
    const [[bo], msBo] = await doThoi('fn_dtv_kho_bo_cau tháp tổng', `select fn_dtv_kho_bo_cau('Toán', $1, null, 200, $2, true) j`, [h.khoi, SEED])
    kt(bo.j.length >= 5 && bo.j.every((x) => x.opts.length === 4 && x.dung >= 0 && x.dung <= 3), `tháp tổng: ${bo.j.length} câu, đủ 4 đáp án (${msBo} ms)`)
    kt(new Set(bo.j.map((x) => x.ma_cau)).size === bo.j.length, 'tháp tổng không trùng câu')
    if (hoc.a.length) kt(true, `câu thuộc dạng lớp đã học: kiểm ở DB bên dưới`)
    const [ngoai] = await q(`select count(*)::int n from jsonb_array_elements($1::jsonb) e
       where (select coalesce(nullif(array_length($2::text[], 1), 0), 0)) > 0
         and not exists (select 1 from bdm_cau_hoi b where b.ma_cau = e->>'ma_cau' and b.dang_chinh = any($2::text[]))
         and not exists (select 1 from hinh_hoc_cau_hoi hh where hh.ma_cau = e->>'ma_cau' and hh.dang_chinh = any($2::text[]))`, [JSON.stringify(bo.j), hoc.a])
    kt(ngoai.n === 0, `mọi câu tháp tổng thuộc dạng lớp đã học (lệch ${ngoai.n})`)
    // sinh đề tháp tổng (Vô tận) → bắt đầu → phát → chấm 2 câu → kết thúc
    const [[de], msDe] = await doThoi('fn_dtv_de_moi tháp tổng', `select fn_dtv_de_moi($1, 'Toán', 'vo_tan', $2, null) j`, [uid, h.khoi])
    kt(de.j.so_cau >= 5 && de.j.nhom === h.khoi, `đề tháp tổng ${de.j.so_cau} câu, nhóm BXH '${de.j.nhom}' (${msDe} ms)`)
    await q(`select fn_dtv_de_bat_dau($1, $2)`, [uid, de.j.de_id])
    const [[lay], msLay] = await doThoi('fn_dtv_de_lay 20 câu', `select fn_dtv_de_lay($1, $2, 1, 20) j`, [uid, de.j.de_id])
    kt(lay.j.length === Math.min(20, de.j.so_cau) && lay.j.every((x) => x.opts.length === 4 && x.dung === undefined), `phát ${lay.j.length} câu, không lộ đáp án (${msLay} ms)`)
    const [[ch], msCh] = await doThoi('fn_dtv_cham', `select fn_dtv_cham($1, $2, 1, 0, 5000) j`, [uid, de.j.de_id])
    kt(typeof ch.j.dung === 'boolean' && ch.j.dung_idx >= 0, `chấm câu 1: dung=${ch.j.dung} (${msCh} ms)`)
    const [[ket], msKet] = await doThoi('fn_dtv_thap_ket', `select fn_dtv_thap_ket($1, $2) j`, [uid, de.j.de_id])
    kt(ket.j.luot_id && ket.j.bxh, `kết thúc lượt tháp, có BXH (${msKet} ms)`)
    // tháp chủ đề (chủ đề đầu tiên)
    if (cd.j.length) {
      const ma = cd.j[0].ma
      const [[de2], msDe2] = await doThoi('fn_dtv_de_moi tháp chủ đề', `select fn_dtv_de_moi($1, 'Toán', 'song_con', $2, $3) j`, [uid, h.khoi, ma])
      kt(de2.j.so_cau >= 5 && de2.j.nhom === `${h.khoi}|${ma}`, `tháp chủ đề ${ma}: ${de2.j.so_cau} câu, nhóm '${de2.j.nhom}' (${msDe2} ms)`)
      const [sai2] = await q(`select count(*)::int n from unnest((select ma_cau from dtv_de where id = $1)) m
         where not exists (select 1 from bdm_cau_hoi b join bdm_ban_do bd on bd.ma_dang = b.dang_chinh where b.ma_cau = m and bd.ma_chu_de = $2)
           and not ($2 = 'HINH_HOC' and exists (select 1 from hinh_hoc_cau_hoi hh where hh.ma_cau = m))`, [de2.j.de_id, ma])
      kt(sai2.n === 0, `mọi câu tháp chủ đề thuộc đúng chủ đề ${ma} (lệch ${sai2.n})`)
      await q(`select fn_dtv_de_bat_dau($1, $2)`, [uid, de2.j.de_id])
      const [c2] = await q(`select fn_dtv_cham($1, $2, 1, 1, 4000) j`, [uid, de2.j.de_id])
      kt(typeof c2.j.dung === 'boolean', 'chấm câu tháp chủ đề')
    }
    // trận bot (Đấu trường) theo chủ đề + trộn
    const [[tr], msTr] = await doThoi('fn_dtv_de_tran_moi trộn', `select fn_dtv_de_tran_moi($1, 'Toán', $2, null, 15) j`, [uid, h.khoi])
    kt(tr.j.so_cau >= 3, `trận bot trộn: ${tr.j.so_cau} câu (${msTr} ms)`)
    await q(`update dtv_de set bat_dau_at = clock_timestamp() - interval '10 seconds' where id = $1`, [tr.j.de_id])
    const [[ct], msCt] = await doThoi('fn_dtv_cham_tran', `select fn_dtv_cham_tran($1, $2, 1, 2, 3000) j`, [uid, tr.j.de_id])
    kt(typeof ct.j.dung === 'boolean', `chấm trận bot câu 1 (${msCt} ms)`)
    const [tk2] = await q(`select fn_dtv_tran_ket($1, $2, 'thua', 0, 'Bot') j`, [uid, tr.j.de_id])
    kt(!!tk2.j.tran_id, 'kết thúc trận bot')
    if (cd.j.length > 1) {
      const [tr2] = await q(`select fn_dtv_de_tran_moi($1, 'Toán', $2, $3, 15) j`, [uid, h.khoi, cd.j.at(-1).ma])
      kt(tr2.j.so_cau >= 3, `trận bot chủ đề ${cd.j.at(-1).ma}: ${tr2.j.so_cau} câu`)
    }
  }

  // ── đề bản đồ CŨ sinh trước khi áp ──
  if (deCu) {
    await vai(hs9.tk); const uid = 'hs_' + hs9.hs
    await q(`select fn_dtv_de_bat_dau($1, $2)`, [uid, deCu])
    const [l] = await q(`select fn_dtv_de_lay($1, $2, 1, 10) j`, [uid, deCu])
    const [ch] = await q(`select fn_dtv_cham($1, $2, 1, 0, 5000) j`, [uid, deCu])
    kt(l.j.length === 10 && typeof ch.j.dung === 'boolean', `đề tháp CŨ (sinh trước khi áp) vẫn phát ${l.j.length} câu + chấm được`)
  }
  // BXH chủ đề cũ vẫn đọc được
  await vai(null)
  // lịch sử tháp chủ đề CŨ (khoá khoi|T…) không bị đụng: dòng còn nguyên. (Mọi lượt tháp Toán hiện có đều nguon_cham='client' ⇒ vốn đã KHÔNG
  //  hiện trên BXH từ khi BXH chỉ tính lượt chấm ở máy chủ — không phải do mig này.)
  const [bx] = await q(`select count(*)::int n, count(*) filter (where nhom ~ '\\|T') ::int cu from dtv_thap_luot where mon = 'Toán'`)
  kt(bx.cu >= 1, `dòng tháp chủ đề cũ (khoá mã T…) còn nguyên: ${bx.cu}/${bx.n} lượt Toán`)
  const [bx2] = await q(`select fn_dtv_thap_bxh_mon('song_con', 'Toán', '7|T10701', false, null) j`)
  kt(bx2.j && 'so_nguoi' in bx2.j, `BXH khoá cũ '7|T10701' vẫn gọi được (${bx2.j.so_nguoi} người — lượt client không lên BXH như trước)`)
} catch (e) { sai++; console.log('  ✘ LỖI', e.message, e.where ?? '') } finally { await q('rollback'); console.log(`\n${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
