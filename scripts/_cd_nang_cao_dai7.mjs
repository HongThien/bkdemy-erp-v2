// Chuyên đề "Chuyên đề nâng cao Đại số 7" (Thùy 21/10): gom CÂU NÂNG CAO CUỐI của đề thi + đề cương Toán 7 GIỮA KÌ trong Kho đề thi,
// THAM CHIẾU TỪ KHO (câu phải ở kho chuẩn + đã xếp dạng bài bản đồ mới — đúng tập builder dùng: _tl_bdm_cau_vi_tri). Câu chưa vào kho
// (chưa duyệt / chưa xếp dạng bài) KHÔNG đưa vào — liệt kê cho Thùy.
//   Câu nâng cao: đề cương = mọi câu Đại trong phần tên có "nâng cao"; đề thi = câu Đại cuối đề (+ các ý cùng bài nếu là bài nhiều ý).
// Chạy: node scripts/_cd_nang_cao_dai7.mjs            → chỉ đọc, in báo cáo + ghi kho-rules/dai/lo/cd-nang-cao-dai7/ket-qua.json
//       node scripts/_cd_nang_cao_dai7.mjs --tao      → tạo chuyên đề (tai_lieu loai chuyen_de) qua đúng RPC builder
//       node scripts/_cd_nang_cao_dai7.mjs --them     → chuyên đề đã có: chỉ THÊM câu mới vào kho (sau khi Thùy duyệt đề), giữ chỗ đã sửa
//       thêm --thu để chạy thử trong ROLLBACK (giả lập mọi câu đã duyệt)
//       --them --tat-ca (Thùy 21/10: chuyên đề ÔN TẬP ⇒ không cần duyệt): đưa HẾT câu nâng cao vào — dạng bài đã gán → đề xuất → khối chưa khớp
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const TAO = process.argv.includes('--tao')
const TEN = 'Chuyên đề nâng cao Đại số 7'
const OUT = 'kho-rules/dai/lo/cd-nang-cao-dai7'

await q('begin')
const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])

// CHỈ đề GIỮA KÌ (đề kiểm tra giữa kì + đề cương ôn tập giữa kì) — Thùy 21/10 "chỉ tính đề giữa kì thôi"
const des = await q(`select id, ten, cau_hinh from tai_lieu where loai = 'de_thi' and mon = 'Toán' and khoi = '7' and ten ilike '%giữa%' order by created_at`)
const chon = []   // { ma_cau, de, ly_do }
for (const d of des) {
  const cs = await q(`select stt, ma_cau, kho, phan_tieu_de, xoa from fn_de_thi_cau($1) order by stt`, [d.id])
  const dai = cs.filter((x) => x.kho === 'dai' && !x.xoa)
  const laDeCuong = d.cau_hinh?.deThi?.kieu === 'de_cuong'
  let lay = dai.filter((x) => /nâng cao/i.test(x.phan_tieu_de ?? ''))
  let ly = 'phần nâng cao'
  if (!lay.length) {
    const cuoi = dai[dai.length - 1]
    if (!cuoi) continue
    const nhom = (d.cau_hinh?.deThi?.nhomBai ?? []).find((g) => Array.isArray(g.cau) && g.cau.some((x) => x.ma_cau === cuoi.ma_cau))
    lay = nhom ? dai.filter((x) => nhom.cau.some((y) => y.ma_cau === x.ma_cau)) : [cuoi]
    ly = laDeCuong ? 'câu Đại cuối đề cương (không có phần nâng cao)' : 'câu Đại cuối đề'
  }
  for (const x of lay) chon.push({ ma_cau: x.ma_cau, de: d.ten, ly_do: ly })
}
// bỏ trùng (1 câu dùng ở nhiều đề) — giữ lần đầu, ghi thêm đề
const theoMa = new Map()
for (const x of chon) { const o = theoMa.get(x.ma_cau); if (o) o.de2.push(x.de); else theoMa.set(x.ma_cau, { ...x, de2: [] }) }
const ds = [...theoMa.values()]

// --thu: THỬ (ROLLBACK cuối) — giả lập mọi câu nâng cao đã duyệt nội dung để kiểm đường --them, không ghi gì
const THU = process.argv.includes('--thu')
if (THU) { await q(`select set_config('kho.duyet_noi_dung', 'on', true)`); await q(`update dai_cau_hoi set da_duyet = true where ma_cau = any($1) and not da_duyet`, [ds.map((x) => x.ma_cau)]) }
const vt = new Map((await q(`select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri('7') x where x.ma_cau = any($1)`, [ds.map((x) => x.ma_cau)])).map((r) => [r.ma_cau, r]))
const info = new Map((await q(`select c.ma_cau, c.da_duyet, c.kho_chuan, c.dang_chinh, left(regexp_replace(c.noi_dung, '\\s+', ' ', 'g'), 140) nd,
    exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau) gan, exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = c.ma_cau) de_xuat,
    exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = c.ma_cau) thieu
  from dai_cau_hoi c where c.ma_cau = any($1)`, [ds.map((x) => x.ma_cau)])).map((r) => [r.ma_cau, r]))
const vao = [], khongVao = []
for (const x of ds) {
  const v = vt.get(x.ma_cau), i = info.get(x.ma_cau)
  if (v?.dang_bai_id) { vao.push({ ...x, dang_bai_id: v.dang_bai_id, nhom_id: v.nhom_id }); continue }
  const vi = !i ? 'không có trong kho Đại'
    : !i.kho_chuan ? (i.da_duyet ? 'chưa vào kho chuẩn' : 'CHƯA DUYỆT (đề chưa duyệt)')
    : v?.nhom_id ? 'đã vào kho, có nhóm nhưng CHƯA CÓ DẠNG BÀI'
    : i.de_xuat ? 'đã vào kho, dạng bài đang CHỜ DUYỆT (đề xuất)'
    : i.thieu ? 'đã vào kho, bản đồ THIẾU DẠNG cho câu này'
    : 'đã vào kho, CHƯA XẾP vào bản đồ mới'
  khongVao.push({ ...x, vi_sao: vi, nd: i?.nd ?? '' })
}
// --tat-ca (Thùy 21/10: "chuyên đề để ÔN TẬP, không dùng đánh giá ⇒ không cần duyệt, đưa hết vào"): bỏ điều kiện kho chuẩn/duyệt.
// Chỗ của câu: (1) dạng bài đã gán (_bdm_cau_giai, không lọc kho chuẩn) · (2) dạng bài ĐỀ XUẤT chờ duyệt (tạm theo đề xuất, báo Thùy)
// · (3) không có dạng bài ⇒ khối "chưa khớp" của chủ đề (thiếu dạng / chưa khớp) — người kéo vào sau.
const TAT_CA = process.argv.includes('--tat-ca')
const khop = []   // { ma_cau, chu_de_id }
if (TAT_CA) {
  const mas = ds.map((x) => x.ma_cau)
  const cg = new Map((await q(`select g.ma_cau, g.dang_bai_id from _bdm_cau_giai(array(select b.ma_dang from dai_ban_do b where b.khoi = '7' union select unnest(_bdm_dang_cu_cua_khoi('7')))) g
                                where g.ma_cau = any($1) and g.dang_bai_id is not null`, [mas])).map((r) => [r.ma_cau, r.dang_bai_id]))
  const dx = new Map((await q(`select ma_cau, dang_bai_id from dai_bdm_de_xuat where ma_cau = any($1)`, [mas])).map((r) => [r.ma_cau, r.dang_bai_id]))
  const cd = new Map((await q(`select ma_cau, chu_de_id from dai_bdm_cau_thieu_dang where ma_cau = any($1) and chu_de_id is not null
                               union all select ma_cau, chu_de_id from dai_bdm_cau_chua_khop where ma_cau = any($1)`, [mas])).map((r) => [r.ma_cau, r.chu_de_id]))
  vao.length = 0; khongVao.length = 0
  for (const x of ds) {
    const db = cg.get(x.ma_cau) ?? dx.get(x.ma_cau)
    if (db) vao.push({ ...x, dang_bai_id: db, nguon: cg.has(x.ma_cau) ? 'gan' : 'de_xuat', nd: info.get(x.ma_cau)?.nd ?? '' })
    else { khop.push({ ...x, chu_de_id: cd.get(x.ma_cau) ?? null, nd: info.get(x.ma_cau)?.nd ?? '' }); khongVao.push({ ...x, vi_sao: 'chưa có dạng bài ⇒ khối chưa khớp', nd: info.get(x.ma_cau)?.nd ?? '' }) }
  }
  console.log(`--tat-ca: dạng bài đã gán ${vao.filter((x) => x.nguon === 'gan').length} · theo ĐỀ XUẤT ${vao.filter((x) => x.nguon === 'de_xuat').length} · chưa khớp ${khop.length}`)
  fs.mkdirSync(OUT, { recursive: true })
  fs.writeFileSync(`${OUT}/tat-ca.json`, JSON.stringify({ vao, khop }, null, 1))
}
console.log(`${des.length} đề · ${ds.length} câu nâng cao (sau bỏ trùng) · vào chuyên đề ${vao.length} · chưa vào ${khongVao.length}`)
const dem = {}; for (const x of khongVao) dem[x.vi_sao] = (dem[x.vi_sao] ?? 0) + 1
console.log(dem)
fs.mkdirSync(OUT, { recursive: true })
if (!THU && !TAT_CA) fs.writeFileSync(`${OUT}/ket-qua.json`, JSON.stringify({ vao, khongVao }, null, 1))   // --thu: số liệu giả lập, không ghi đè kết quả thật

// --them: chuyên đề ĐÃ CÓ (Thùy có thể đã sửa) ⇒ chỉ THÊM câu nâng cao mới vào kho từ lần trước (vd sau khi duyệt đề), không đụng phần đã có.
if (process.argv.includes('--them')) {
  const [tl] = await q(`select id from tai_lieu where loai = 'chuyen_de' and khoi = '7' and ten = $1 order by created_at limit 1`, [TEN])
  if (!tl) { console.log('Chưa có chuyên đề — chạy --tao trước.'); await q('rollback'); process.exit(1) }
  const [{ nd }] = await q(`select fn_tl_bdm_noi_dung($1) nd`, [tl.id])
  const daCo = new Set(nd.buoi.flatMap((b) => [...b.nhom.flatMap((n) => [...n.dang_bai.flatMap((d) => d.caus), ...(n.btvn?.caus ?? []), ...(n.chua_phan?.caus ?? [])]), ...(b.chua_khop?.caus ?? [])]))
  const moi = vao.filter((x) => !daCo.has(x.ma_cau))
  console.log(`--them: chuyên đề đang có ${daCo.size} câu · câu mới vào kho ${moi.length}`)
  const khopMoi = khop.filter((x) => !daCo.has(x.ma_cau))
  if (!moi.length && !khopMoi.length) { await q('rollback'); await c.end(); process.exit(0) }
  const db = await q(`select d.id, d.nhom_id, n.chu_de_id, cd.ten chu_de, cd.thu_tu cd_tt, n.thu_tu n_tt, d.thu_tu d_tt
                        from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = any($1)`, [[...new Set(moi.map((x) => x.dang_bai_id))]])
  for (const cdTen of [...new Set(db.map((r) => r.chu_de))]) {
    let b = nd.buoi.find((x) => x.tieu_de === cdTen)
    let bId = b?.id
    if (!bId) { const [{ m }] = await q(`select coalesce(max(thu_tu), -1) + 1 m from tai_lieu_phan where tai_lieu_id = $1`, [tl.id]); bId = (await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, m, cdTen]))[0].id }
    const cu = (b?.nhom ?? []).map((n) => ({ nhom: n.id, dang_bai: n.dang_bai.map((d) => d.id) }))
    const cuDb = new Set(cu.flatMap((x) => x.dang_bai)), cuNhom = new Set(cu.map((x) => x.nhom))
    for (const r of db.filter((r) => r.chu_de === cdTen).sort((a, b2) => a.n_tt - b2.n_tt || a.d_tt - b2.d_tt)) {
      let x = cu.find((y) => y.nhom === r.nhom_id); if (!x) { x = { nhom: r.nhom_id, dang_bai: [] }; cu.push(x) }
      if (!x.dang_bai.includes(r.id)) x.dang_bai.push(r.id)
    }
    const [{ nd: nd2 }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd`, [tl.id, bId, JSON.stringify(cu)])
    for (const n of nd2.buoi[0].nhom) {
      if (!cuNhom.has(n.id) && n.btvn) await q(`select fn_tl_bdm_dat_cau($1, '{}'::text[])`, [n.btvn.phan_id])
      for (const d of n.dang_bai) {
        const them = moi.filter((x) => x.dang_bai_id === d.id).map((x) => x.ma_cau)
        const giu = cuDb.has(d.id) ? d.caus : []                       // dạng bài mới tạo: bỏ câu gợi ý, chỉ giữ câu nâng cao
        if (them.length || !cuDb.has(d.id)) await q(`select fn_tl_bdm_dat_cau($1, $2)`, [d.phan_id, [...giu, ...them.filter((m) => !giu.includes(m))]])
      }
    }
  }
  // câu chưa có dạng bài (--tat-ca) ⇒ khối "chưa khớp" của phần chủ đề (không có chủ đề ⇒ phần "Chưa xếp chủ đề")
  if (khopMoi.length) {
    const tenCd = new Map((await q(`select id, ten from dai_bdm_chu_de where id = any($1)`, [[...new Set(khopMoi.map((x) => x.chu_de_id).filter(Boolean))]])).map((r) => [r.id, r.ten]))
    const [{ nd: ndK }] = await q(`select fn_tl_bdm_noi_dung($1) nd`, [tl.id])
    for (const tenPhan of [...new Set(khopMoi.map((x) => tenCd.get(x.chu_de_id) ?? 'Chưa xếp chủ đề'))]) {
      const mas = khopMoi.filter((x) => (tenCd.get(x.chu_de_id) ?? 'Chưa xếp chủ đề') === tenPhan).map((x) => x.ma_cau)
      const b = ndK.buoi.find((x) => x.tieu_de === tenPhan)
      let bId = b?.id
      if (!bId) { const [{ m }] = await q(`select coalesce(max(thu_tu), -1) + 1 m from tai_lieu_phan where tai_lieu_id = $1`, [tl.id]); bId = (await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, m, tenPhan]))[0].id }
      let pk = b?.chua_khop?.phan_id
      if (!pk) {   // khối chưa khớp đứng cuối phần (sau nhóm, trước phần kế)
        const [{ m }] = await q(`select coalesce(max(thu_tu), -1) + 1 m from tai_lieu_phan where tai_lieu_id = $1`, [tl.id])
        pk = (await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, cha_id) values ($1, $2, 'chua_khop', $3) returning id`, [tl.id, m, bId]))[0].id
      }
      await q(`select fn_tl_bdm_dat_cau($1, $2)`, [pk, [...(b?.chua_khop?.caus ?? []), ...mas]])
      await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb)`, [tl.id, bId, JSON.stringify((ndK.buoi.find((x) => x.id === bId)?.nhom ?? []).map((n) => ({ nhom: n.id, dang_bai: n.dang_bai.map((d) => d.id) })))])   // xếp lại thứ tự phần con
    }
  }
  const [{ n }] = await q(`select count(*)::int n from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id where p.tai_lieu_id = $1`, [tl.id])
  console.log(`Sau khi thêm: ${n} câu (trước ${daCo.size} + mới ${moi.length} + chưa khớp ${khopMoi.length})`)
  if (n !== daCo.size + moi.length + khopMoi.length) { await q('rollback'); console.log('LỆCH ⇒ ROLLBACK'); process.exit(1) }
  if (THU) { const [{ nd: ndThu }] = await q(`select fn_tl_bdm_noi_dung($1) nd`, [tl.id]); console.log('THỬ — phần:', ndThu.buoi.map((b) => `${b.tieu_de} (${b.nhom.length} nhóm)`).join(' · ')); await q('rollback'); console.log('--thu ⇒ ROLLBACK, không ghi gì'); await c.end(); process.exit(0) }
  await q('commit'); await c.end(); process.exit(0)
}

if (TAO && vao.length) {
  const [daTao] = await q(`select id from tai_lieu where loai = 'chuyen_de' and khoi = '7' and ten = $1 limit 1`, [TEN])
  if (daTao) { console.log(`Đã có "${TEN}" (${daTao.id}) — dùng --them để thêm câu mới, không tạo bản thứ 2.`); await q('rollback'); process.exit(1) }
  // dạng bài → nhóm → chủ đề (thứ tự bản đồ)
  const db = await q(`select d.id, d.nhom_id, n.chu_de_id, cd.ten chu_de, cd.thu_tu cd_tt, n.thu_tu n_tt, d.thu_tu d_tt
                        from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                       where d.id = any($1)`, [[...new Set(vao.map((x) => x.dang_bai_id))]])
  const dbMap = new Map(db.map((r) => [r.id, r]))
  const chuDe = [...new Map(db.sort((a, b) => a.cd_tt - b.cd_tt).map((r) => [r.chu_de_id, r.chu_de])).entries()]
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do, created_by) values ('chuyen_de', $1, '7', 'Toán', null, 'moi', $2) returning id`, [TEN, ad.id])
  let tt = 0
  for (const [cdId, cdTen] of chuDe) {
    const [b] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, tt++, cdTen])
    const dbs = db.filter((r) => r.chu_de_id === cdId).sort((a, b) => a.n_tt - b.n_tt || a.d_tt - b.d_tt)
    const nhoms = [...new Set(dbs.map((r) => r.nhom_id))]
    const chonBuoi = nhoms.map((n) => ({ nhom: n, dang_bai: dbs.filter((r) => r.nhom_id === n).map((r) => r.id) }))
    const [{ nd }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd`, [tl.id, b.id, JSON.stringify(chonBuoi)])
    for (const n of nd.buoi[0].nhom) {
      if (n.btvn) await q(`select fn_tl_bdm_dat_cau($1, '{}'::text[])`, [n.btvn.phan_id])            // chuyên đề nâng cao: không BTVN tự gợi ý
      for (const d of n.dang_bai) await q(`select fn_tl_bdm_dat_cau($1, '{}'::text[])`, [d.phan_id])  // xoá câu gợi ý trước…
    }
    for (const n of nd.buoi[0].nhom) for (const d of n.dang_bai) {                                       // …rồi đặt đúng câu nâng cao
      const mas = vao.filter((x) => x.dang_bai_id === d.id).map((x) => x.ma_cau)
      await q(`select fn_tl_bdm_dat_cau($1, $2)`, [d.phan_id, mas])
    }
  }
  const [{ n }] = await q(`select count(*)::int n from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id where p.tai_lieu_id = $1`, [tl.id])
  console.log(`TẠO "${TEN}" id=${tl.id}: ${chuDe.length} phần · ${n} câu (phải = ${vao.length})`)
  if (n !== vao.length) { await q('rollback'); console.log('LỆCH SỐ CÂU ⇒ ROLLBACK, không tạo gì'); process.exit(1) }
  await q('commit')
} else await q('rollback')
await c.end()
