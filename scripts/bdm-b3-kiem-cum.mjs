// B3 KIỂM LẠI — câu gốc đang có dạng bài nhờ đối ứng CỤM / dạng cũ (nguồn 'gan_cum' | 'doi_ung' của _bdm_cau_giai).
// Nhãn đó suy ra từ cụm cũ → dạng bài (thô, 17/10 phân xử mẫu thấy sai khá nhiều). Máy đọc lại từng câu, câu lệch đưa ra phân xử.
// Spec: spec-ban-do-4-tang.md §13. Dùng lại brief + dây chuyền B3 (kho-rules/dai/lo/b3/brief.md).
//   node scripts/bdm-b3-kiem-cum.mjs xuat <khoi> [--lo 70]   (CHỈ ĐỌC DB)
//       ⇒ kho-rules/dai/lo/b3-kiem/k<khoi>/{dich.md, lo-NN.json}  — KHÔNG có nhãn hiện tại, KHÔNG có nhan_cu (nhãn cũ cùng gốc với nhãn cụm)
//       ⇒ kho-rules/dai/lo/b3-kiem/_nhan/k<khoi>.json            — nhãn hiện tại + cụm/dạng cũ (NGOÀI thư mục agent)
//       Bỏ 90 câu mẫu đã kiểm 17/10 (b3/_mau/k<khoi>.json) — kết quả của chúng lấy lại từ b3/k<khoi>/.
//   node scripts/bdm-b3-kiem-cum.mjs so <khoi>                (không đụng DB)
//       ⇒ kiểm .out.json (đủ câu, mã có trong bảng đích) · so với nhãn hiện tại · ghi ket_qua.json + lech.json (máy 'cao' lệch, chờ phan_xu)
//       · in lệch gom theo (cụm/dạng cũ → dạng bài) để thấy đối ứng nào sai cả loạt
//   node scripts/bdm-b3-kiem-cum.mjs px <khoi>      ⇒ b3-kiem/k<khoi>/px/px-NN.json: câu lệch + 2 phương án A/B xếp theo md5 (MÙ: không biết bên nào là máy/nhãn cụm)
//   node scripts/bdm-b3-kiem-cum.mjs px-doc <khoi>  ⇒ đọc px-NN.out.json ({ma_cau, chon: A|B|ca_hai|khong, ly_do}) ⇒ điền phan_xu (may|nguoi|ca_hai|khong) vào lech.json
//   node scripts/bdm-b3-kiem-cum.mjs ghi <khoi> [--chu-de NCDxxxxx] [--ghi]   (mặc định chạy thử rồi ROLLBACK; luật Thùy chốt 17/10)
//       phan_xu 'may' (lech.json + mẫu 17/10 b3/k<khoi>/lech-mau.json) ⇒ GHI THẲNG dai_bdm_gan_cau nguon='ai' (đè gán cụm; ~10% rơi vào hàng Kiểm mẫu)
//       phan_xu 'nguoi' | 'ca_hai' | 'khong' ⇒ giữ nhãn cụm · máy 'vua' lệch ⇒ dai_bdm_de_xuat chac 'vua' ("đang ở X, máy chọn Y")
//       --chu-de (K12: NCD00095): chỉ ghi thẳng khi cả nhãn cụm lẫn máy trong chủ đề đó, còn lại ⇒ de_xuat chac 'cao'
//       chỉ câu còn sống, vẫn là gốc, vẫn đang ở đúng dạng bài 'hien' qua gan_cum/doi_ung, chưa có dòng gan_cau
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const [lenh, khoi, ...args] = process.argv.slice(2)
const so = (k, d) => { const i = args.indexOf(k); return i >= 0 ? +args[i + 1] : d }
if (!['xuat', 'so', 'px', 'px-doc', 'ghi'].includes(lenh) || !khoi) { console.error('Dùng: node scripts/bdm-b3-kiem-cum.mjs xuat|so <khoi> [--lo 70]  |  ghi <khoi> [--chu-de X] [--ghi]'); process.exit(2) }
const GOC = path.join('kho-rules', 'dai', 'lo', 'b3-kiem')
const dir = path.join(GOC, 'k' + khoi)
const fNhan = path.join(GOC, '_nhan', `k${khoi}.json`)
const cat = (s, n) => { s = (s ?? '').replace(/\s+\n/g, '\n').trim(); return s.length > n ? s.slice(0, n) + ' …' : s }

if (lenh === 'xuat') {
  const LO = so('--lo', 70)
  const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? env }); await c.connect()
  await c.query('begin read only')
  const dich = (await c.query(`
    select d.id, d.ten, d.mo_ta, d.vi_du, n.ten nhom, n.mo_ta nhom_mo_ta, cd.ten chu_de, cdx.ten chuyen_de
      from dai_bdm_dang_bai d
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
      left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
     where cd.khoi = $1 and cd.nhanh = 'toan'
     order by cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu`, [khoi])).rows
  const ngoai = (await c.query(`select ten, nhanh from dai_bdm_chu_de where khoi = $1 and nhanh <> 'toan' order by thu_tu`, [khoi])).rows
  const cau = (await c.query(`
    select g.ma_cau, g.dang_bai_id, g.nguon, g.ma_cum_cu, g.ma_dang_cu, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, md5(g.ma_cau) h
      from _bdm_cau_giai((select array_agg(ma_dang) from dai_ban_do where khoi = $1)) g
      join dai_cau_hoi q on q.ma_cau = g.ma_cau
     where g.la_goc and g.nguon in ('gan_cum', 'doi_ung')`, [khoi])).rows
  await c.query('rollback'); await c.end()

  const dbIds = new Set(dich.map((d) => d.id))
  const fMau = path.join('kho-rules', 'dai', 'lo', 'b3', '_mau', `k${khoi}.json`)
  const mau17 = fs.existsSync(fMau) ? JSON.parse(fs.readFileSync(fMau, 'utf8')) : {}
  const ngoaiDich = cau.filter((r) => !dbIds.has(r.dang_bai_id))
  const kiem = cau.filter((r) => dbIds.has(r.dang_bai_id) && !(r.ma_cau in mau17)).sort((a, b) => a.h.localeCompare(b.h))

  fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(path.dirname(fNhan), { recursive: true })
  for (const f of fs.readdirSync(dir)) if (/^lo-\d+\.json$/.test(f)) throw new Error(`${dir} đã có lô — xoá tay hoặc đổi thư mục trước khi xuất lại`)
  const md = [`# Bảng đích khối ${khoi} — ${dich.length} dạng bài (nhánh Toán · Đại)`, '']
  if (ngoai.length) md.push(`> Chủ đề KHÔNG nằm trong bảng đích (nhánh khác): ${ngoai.map((x) => `${x.ten} [${x.nhanh}]`).join(' · ')}. Câu thuộc các chủ đề này ⇒ để trống, lý do "thuộc nhánh ${'<tên>'}".`, '')
  let cdTruoc = '', nhTruoc = ''
  for (const d of dich) {
    if (d.chu_de !== cdTruoc) { md.push(`## Chủ đề: ${d.chu_de}`, ''); cdTruoc = d.chu_de; nhTruoc = '' }
    const nh = `${d.chuyen_de} › ${d.nhom}`
    if (nh !== nhTruoc) { md.push(`### ${nh}${d.nhom_mo_ta ? ` — ${cat(d.nhom_mo_ta, 300)}` : ''}`, ''); nhTruoc = nh }
    md.push(`- **${d.id}** · ${d.ten}`)
    if (d.mo_ta) md.push(`  - Mô tả: ${cat(d.mo_ta, 500).replace(/\n/g, ' ')}`)
    if (d.vi_du) md.push(`  - Ví dụ: ${cat(d.vi_du, 450).replace(/\n/g, ' ')}`)
  }
  fs.writeFileSync(path.join(dir, 'dich.md'), md.join('\n') + '\n')
  fs.writeFileSync(fNhan, JSON.stringify(Object.fromEntries(kiem.map((r) => [r.ma_cau, { db: r.dang_bai_id, nguon: r.nguon, cum: r.ma_cum_cu, dang_cu: r.ma_dang_cu }])), null, 1))
  const gon = (r) => ({
    ma_cau: r.ma_cau, loai: r.loai_cau, de: cat(r.noi_dung, 1500),
    ...(r.lua_chon ? { lua_chon: r.lua_chon } : {}), ...(r.menh_de ? { menh_de: r.menh_de } : {}),
    ...(r.dap_an ? { dap_an: cat(r.dap_an, 200) } : {}), ...(r.loi_giai ? { loi_giai: cat(r.loi_giai, 700) } : {}),
    ...(r.anh_de ? { co_hinh: true } : {}),
  })
  let n = 0
  for (let i = 0; i < kiem.length; i += LO) {
    n++
    fs.writeFileSync(path.join(dir, `lo-${String(n).padStart(2, '0')}.json`), JSON.stringify(kiem.slice(i, i + LO).map(gon), null, 1))
  }
  console.log(`K${khoi}: bảng đích ${dich.length} · câu gốc gan_cum/doi_ung ${cau.length} (đích ngoài bảng Toán ${ngoaiDich.length}) · đã kiểm 17/10 ${cau.length - ngoaiDich.length - kiem.length} · xuất ${kiem.length} ⇒ ${n} lô × ≤${LO} ⇒ ${dir}`)
}

if (lenh === 'so') {
  const nhan = JSON.parse(fs.readFileSync(fNhan, 'utf8'))
  const dichMd = fs.readFileSync(path.join(dir, 'dich.md'), 'utf8')
  const dbIds = new Set([...dichMd.matchAll(/\*\*(NDB\d+)\*\*/g)].map((m) => m[1]))
  const ten = (id) => (dichMd.match(new RegExp(`\\*\\*${id}\\*\\* · (.*)`)) ?? [])[1] ?? '?'
  const loi = [], kq = []
  for (const f of fs.readdirSync(dir).filter((x) => /^lo-\d+\.json$/.test(x)).sort()) {
    const vao = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    const fo = path.join(dir, f.replace('.json', '.out.json'))
    if (!fs.existsSync(fo)) { loi.push(`${f}: chưa có .out.json`); continue }
    let ra
    try { ra = JSON.parse(fs.readFileSync(fo, 'utf8')) } catch (e) { loi.push(`${f}: out không phải JSON (${e.message})`); continue }
    const theoMa = new Map(ra.map((r) => [r.ma_cau, r]))
    if (ra.length !== vao.length) loi.push(`${f}: vào ${vao.length}, ra ${ra.length}`)
    for (const v of vao) {
      const r = theoMa.get(v.ma_cau)
      if (!r) { loi.push(`${f}: thiếu ${v.ma_cau}`); continue }
      if (r.dang_bai_id && !dbIds.has(r.dang_bai_id)) { loi.push(`${f}: ${v.ma_cau} mã lạ ${r.dang_bai_id} ⇒ trống`); r.dang_bai_id = null }
      if (r.dang_bai_id && !['cao', 'vua'].includes(r.chac)) { loi.push(`${f}: ${v.ma_cau} chac lạ "${r.chac}" ⇒ vua`); r.chac = 'vua' }
      const h = nhan[v.ma_cau]
      kq.push({ ma_cau: v.ma_cau, may: r.dang_bai_id ?? null, chac: r.dang_bai_id ? r.chac : null, ly_do: r.ly_do ?? '', hien: h.db, nguon: h.nguon, cum: h.cum, dang_cu: h.dang_cu, de: v.de, menh_de: v.menh_de })
    }
  }
  fs.writeFileSync(path.join(dir, 'ket_qua.json'), JSON.stringify(kq.map(({ de, menh_de, ...x }) => x), null, 1))
  const cao = kq.filter((r) => r.chac === 'cao'), vua = kq.filter((r) => r.chac === 'vua'), trong = kq.filter((r) => !r.may)
  const lech = cao.filter((r) => r.may !== r.hien)
  // giữ phan_xu đã điền nếu chạy lại
  const fL = path.join(dir, 'lech.json')
  const cu = fs.existsSync(fL) ? Object.fromEntries(JSON.parse(fs.readFileSync(fL, 'utf8')).map((x) => [x.ma_cau, x])) : {}
  fs.writeFileSync(fL, JSON.stringify(lech.map((r) => ({
    ma_cau: r.ma_cau, may: r.may, hien: r.hien, nguon: r.nguon, cum: r.cum, dang_cu: r.dang_cu,
    ten_may: ten(r.may), ten_hien: ten(r.hien), ly_do_may: r.ly_do,
    de: cat(r.de, 900), ...(r.menh_de ? { menh_de: r.menh_de } : {}),
    phan_xu: cu[r.ma_cau]?.phan_xu ?? null, ...(cu[r.ma_cau]?.ghi_chu ? { ghi_chu: cu[r.ma_cau].ghi_chu } : {}),
  })), null, 1))
  console.log(`K${khoi}: ${kq.length} câu · máy cao ${cao.length} (khớp ${cao.length - lech.length} · LỆCH ${lech.length}) · vừa ${vua.length} (lệch ${vua.filter((r) => r.may !== r.hien).length}) · trống ${trong.length}`)
  const nhom = {}
  for (const r of lech) { const k = `${r.nguon === 'gan_cum' ? 'cụm ' + r.cum : 'dạng ' + r.dang_cu} : ${r.hien} → ${r.may}`; nhom[k] = (nhom[k] ?? 0) + 1 }
  for (const [k, v] of Object.entries(nhom).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`   ${String(v).padStart(3)} × ${k}`)
  if (loi.length) { console.log(`  ⚠ ${loi.length} lỗi:`); for (const l of loi.slice(0, 30)) console.log('   ', l) }
}

if (lenh === 'ghi') {
  const GHI = args.includes('--ghi'), iCd = args.indexOf('--chu-de'), chuDe = iCd >= 0 ? args[iCd + 1] : null
  const doc = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null)
  const b3 = path.join('kho-rules', 'dai', 'lo', 'b3')
  const lech = doc(path.join(dir, 'lech.json')) ?? [], kq = doc(path.join(dir, 'ket_qua.json')) ?? []
  const lechMau = doc(path.join(b3, 'k' + khoi, 'lech-mau.json')) ?? []
  const mau17 = doc(path.join(b3, '_mau', `k${khoi}.json`)) ?? {}
  const kqMau = (doc(path.join(b3, 'k' + khoi, 'ket_qua.json')) ?? []).filter((r) => r.ma_cau in mau17)
  if (lech.some((x) => !x.phan_xu)) throw new Error('lech.json còn câu chưa phân xử')
  const ds = [
    ...lech.filter((x) => x.phan_xu === 'may').map((x) => ({ ma_cau: x.ma_cau, may: x.may, hien: x.hien, loai: 'gan', ly: x.ly_do_may })),
    ...lechMau.filter((x) => x.phan_xu === 'may').map((x) => ({ ma_cau: x.ma_cau, may: x.may, hien: x.nguoi, loai: 'gan', ly: 'mẫu kiểm 17/10' })),
    ...kq.filter((r) => r.chac === 'vua' && r.may !== r.hien).map((r) => ({ ma_cau: r.ma_cau, may: r.may, hien: r.hien, loai: 'dx_vua', ly: r.ly_do })),
    ...kqMau.filter((r) => r.chac === 'vua' && r.dang_bai_id !== mau17[r.ma_cau]).map((r) => ({ ma_cau: r.ma_cau, may: r.dang_bai_id, hien: mau17[r.ma_cau], loai: 'dx_vua', ly: r.ly_do })),
  ]
  if (new Set(ds.map((x) => x.ma_cau)).size !== ds.length) throw new Error('trùng mã câu giữa các nguồn')
  const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
  await c.query('begin')
  try {
    await c.query(`create temp table _k (ma_cau text primary key, may text, hien text, loai text, ly text) on commit drop`)
    await c.query(`insert into _k select * from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[])`,
      [ds.map((x) => x.ma_cau), ds.map((x) => x.may), ds.map((x) => x.hien), ds.map((x) => x.loai), ds.map((x) => x.ly ?? '')])
    // còn đúng như lúc kiểm: gốc, còn sống, đang ở 'hien' qua gan_cum/doi_ung, chưa có gan_cau, dạng bài máy thuộc khối
    const bo = await c.query(`
      delete from _k k where not exists (
        select 1 from _bdm_cau_giai((select array_agg(ma_dang) from dai_ban_do where khoi = $1)) g
          join dai_bdm_dang_bai d on d.id = k.may join dai_bdm_nhom n on n.id = d.nhom_id
          join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.khoi = $1
         where g.ma_cau = k.ma_cau and g.la_goc and g.nguon in ('gan_cum', 'doi_ung') and g.dang_bai_id = k.hien)
        or exists (select 1 from dai_bdm_gan_cau x where x.ma_cau = k.ma_cau)
      returning k.ma_cau`, [khoi])
    if (bo.rowCount) console.log(`  ⚠ bỏ ${bo.rowCount} câu không còn đúng trạng thái lúc kiểm:`, bo.rows.map((r) => r.ma_cau).slice(0, 15).join(' '))
    if (chuDe) await c.query(`
      update _k k set loai = 'dx_cao' where k.loai = 'gan' and 2 > (
        select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where d.id in (k.may, k.hien) and n.chu_de_id = $1)`, [chuDe])
    const dem = async () => (await c.query(`select (select count(*) from dai_bdm_gan_cau)::int gan, (select count(*) from dai_bdm_de_xuat)::int dx`)).rows[0]
    const truoc = await dem()
    const a = await c.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) select ma_cau, may, 'ai' from _k where loai = 'gan' on conflict (ma_cau) do nothing`)
    const b = await c.query(`
      insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon)
      select k.ma_cau, k.may, case k.loai when 'dx_cao' then 'cao' else 'vua' end,
             format('Kiểm lại nhãn cụm cũ: đang ở %s «%s», máy chọn %s «%s»%s. %s', k.hien, dh.ten, k.may, dm.ten,
                    case k.loai when 'dx_cao' then ' (phân xử: máy đúng; ngoài chủ đề chuẩn nên chưa ghi thẳng)' else ' (chưa chắc)' end, k.ly),
             'ai'
        from _k k join dai_bdm_dang_bai dh on dh.id = k.hien join dai_bdm_dang_bai dm on dm.id = k.may
       where k.loai in ('dx_cao', 'dx_vua')
      on conflict (ma_cau) do nothing`)
    const sau = await dem()
    const loai = Object.fromEntries((await c.query(`select loai, count(*)::int n from _k group by 1`)).rows.map((r) => [r.loai, r.n]))
    // kiểm sau ghi: câu đã ghi giờ mang dạng bài nào trong _bdm_cau_giai
    const kt = (await c.query(`select k.loai, g.nguon, count(*)::int n, count(*) filter (where g.dang_bai_id = k.may)::int theo_may
      from _k k join _bdm_cau_giai((select array_agg(ma_dang) from dai_ban_do where khoi = $1)) g on g.ma_cau = k.ma_cau group by 1, 2`, [khoi])).rows
    console.log(`K${khoi}: nguồn ${ds.length} · hợp lệ ${JSON.stringify(loai)} · ghi thẳng gan_cau ${a.rowCount} (${truoc.gan}→${sau.gan}) · de_xuat ${b.rowCount} (${truoc.dx}→${sau.dx})`)
    console.log('  sau ghi:', JSON.stringify(kt))
    if (a.rowCount !== sau.gan - truoc.gan || b.rowCount !== sau.dx - truoc.dx) throw new Error('lệch số dòng chèn')
    if (a.rowCount !== (loai.gan ?? 0)) throw new Error(`ghi thẳng ${a.rowCount} ≠ ${loai.gan ?? 0} câu hợp lệ`)
    await c.query(GHI ? 'commit' : 'rollback')
    console.log(GHI ? '  ✔ ĐÃ GHI (commit)' : '  ↩ ROLLBACK (chạy thử)')
  } catch (e) { await c.query('rollback'); console.error('  LỖI → rollback:', e.message); process.exitCode = 1 }
  await c.end()
}

if (lenh === 'px' || lenh === 'px-doc') {
  const fL = path.join(dir, 'lech.json'), pxDir = path.join(dir, 'px')
  const lech = JSON.parse(fs.readFileSync(fL, 'utf8'))
  const md5 = (s) => crypto.createHash('md5').update(s).digest('hex')
  const maySoA = (ma) => parseInt(md5('px' + ma).slice(0, 2), 16) % 2 === 0 // cố định theo mã câu
  if (lenh === 'px') {
    const vao = {}
    for (const f of fs.readdirSync(dir).filter((x) => /^lo-\d+\.json$/.test(x))) for (const c of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) vao[c.ma_cau] = c
    fs.mkdirSync(pxDir, { recursive: true })
    for (const f of fs.readdirSync(pxDir)) if (/^px-\d+\.json$/.test(f)) throw new Error(`${pxDir} đã có lô phân xử`)
    const ds = lech.filter((x) => !x.phan_xu).map((x) => {
      const c = vao[x.ma_cau], m = { id: x.may, ten: x.ten_may }, h = { id: x.hien, ten: x.ten_hien }
      const { ma_cau, ...noi } = c
      return { ma_cau, ...noi, A: maySoA(ma_cau) ? m : h, B: maySoA(ma_cau) ? h : m }
    })
    const N = 40
    for (let i = 0, n = 1; i < ds.length; i += N, n++) fs.writeFileSync(path.join(pxDir, `px-${String(n).padStart(2, '0')}.json`), JSON.stringify(ds.slice(i, i + N), null, 1))
    console.log(`K${khoi}: ${ds.length} câu chờ phân xử ⇒ ${Math.ceil(ds.length / N)} lô ở ${pxDir}`)
  } else {
    const ra = {}
    for (const f of fs.readdirSync(pxDir).filter((x) => /^px-\d+\.out\.json$/.test(x))) for (const r of JSON.parse(fs.readFileSync(path.join(pxDir, f), 'utf8'))) ra[r.ma_cau] = r
    const dem = {}
    for (const x of lech) {
      const r = ra[x.ma_cau]; if (!r || x.phan_xu) continue
      const a = maySoA(x.ma_cau)
      x.phan_xu = r.chon === 'A' ? (a ? 'may' : 'nguoi') : r.chon === 'B' ? (a ? 'nguoi' : 'may') : ['ca_hai', 'khong'].includes(r.chon) ? r.chon : null
      if (x.phan_xu) { x.ghi_chu = `Opus phân xử mù 17/10: ${r.ly_do ?? ''}`; dem[x.phan_xu] = (dem[x.phan_xu] ?? 0) + 1 }
    }
    fs.writeFileSync(fL, JSON.stringify(lech, null, 1))
    console.log(`K${khoi}: ${lech.length} câu lệch · vừa điền ${JSON.stringify(dem)} · còn trống ${lech.filter((x) => !x.phan_xu).length}`)
  }
}
