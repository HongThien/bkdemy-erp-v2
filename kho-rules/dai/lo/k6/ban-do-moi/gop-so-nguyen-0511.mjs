// gop-so-nguyen-0511.mjs — Thùy 05/11: sửa bản đồ chuyên đề NCH00461 "Tập hợp số nguyên và thứ tự" (K6, Số nguyên) bằng GỘP:
//   • Nhóm 1 (NNB01622) + Nhóm 2 (NNB01623) + dạng 4.4 (NDB01297)  → nhóm NNB01622 "Các tính chất cơ bản của số nguyên"
//   • Dạng 1.1 (NDB01286) + 1.2 (NDB01287) + 4.4 (NDB01297)        → NDB01286 "Tính chất cơ bản của số nguyên"
//   • Dạng 2.1 (NDB01288) + 2.2 (NDB01289)                         → NDB01288 "Số đối" (chuyển sang nhóm NNB01622)
//   • Dạng 4.1 (NDB01294) + 4.2 (NDB01295)                         → NDB01294 "Tập hợp của số nguyên"
// Mã gốc bất biến: giữ mã nhỏ nhất của mỗi cụm; mã bị gộp: chuyển MỌI tham chiếu (gán câu, câu trên lớp, đo, giáo trình) sang mã giữ lại rồi mới xoá.
//   node kho-rules/dai/lo/k6/ban-do-moi/gop-so-nguyen-0511.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()

const SEC = (t) => { const o = { TC: '', PP: '', CY: '' }; let k = null; for (const l of (t || '').split('\n')) { const m = l.match(/^##(TC|PP|CY)\s*$/); if (m) { k = m[1]; continue } if (k) o[k] += l + '\n' } for (const x in o) o[x] = o[x].trim(); return o }
const VDS = (t) => (t || '').split(/^##VD\s*$/m).map((s) => s.trim()).filter(Boolean)
const nhanVD = (arr) => arr.map((s) => '##VD\n' + s).join('\n\n')

const lay = async (id) => (await c.query('select * from dai_bdm_dang_bai where id=$1', [id])).rows[0]
const layN = async (id) => (await c.query('select * from dai_bdm_nhom where id=$1', [id])).rows[0]
const gopLT = (parts) => { // parts: [{nhan, lt}] → ##PP có nhãn + ##CY nối
  const pp = parts.map((p) => `**${p.nhan}:**\n${SEC(p.lt).PP}`).join('\n\n')
  const cy = parts.map((p) => SEC(p.lt).CY).filter(Boolean).join('\n')
  return `##PP\n${pp}\n\n##CY\n${cy}`
}

try {
  await c.query('begin')
  // ───── 0. đối chiếu trạng thái đầu
  const D = {}; for (const id of ['NDB01286', 'NDB01287', 'NDB01288', 'NDB01289', 'NDB01294', 'NDB01295', 'NDB01297']) D[id] = await lay(id)
  for (const [id, ten] of Object.entries({ NDB01286: 'Nhận biết số nguyên dương, số nguyên âm', NDB01287: 'Dùng số nguyên âm biểu thị đại lượng thực tế', NDB01288: 'Tìm số đối của một số', NDB01289: 'Tập hợp gồm các phần tử và số đối của chúng', NDB01294: 'Viết tập hợp số nguyên bằng cách liệt kê', NDB01295: 'Đếm số phần tử của tập hợp số nguyên', NDB01297: 'Nhận định đúng / sai về số nguyên' }))
    if (!D[id] || D[id].ten !== ten) throw new Error(`${id} không còn như lúc dò (${D[id]?.ten})`)
  const N22 = await layN('NNB01622'), N23 = await layN('NNB01623')
  if (!N22 || !N23) throw new Error('thiếu nhóm')
  const dem = async (sql, p) => Number((await c.query(sql, p)).rows[0].n)
  const truoc = {}; for (const id of Object.keys(D)) truoc[id] = await dem('select count(*) n from dai_bdm_gan_cau where dang_bai_id=$1', [id])
  console.log('gán trước', truoc)

  // ───── 1. nội dung mới
  // Dạng 1: Tính chất cơ bản của số nguyên
  const v1 = VDS(D.NDB01286.vi_du), v2 = VDS(D.NDB01287.vi_du), v4 = VDS(D.NDB01297.vi_du)
  const ND1 = {
    ten: 'Tính chất cơ bản của số nguyên',
    mo_ta: 'Nhận biết số nguyên dương / âm / 0, dùng số nguyên âm biểu thị đại lượng thực tế (hoặc diễn đạt lại số âm bằng lời), và chọn khẳng định đúng / sai về ℤ, số nguyên âm, số đối.',
    lt: gopLT([{ nhan: 'Nhận biết số nguyên dương, số nguyên âm', lt: D.NDB01286.ly_thuyet }, { nhan: 'Dùng số nguyên âm biểu thị đại lượng thực tế', lt: D.NDB01287.ly_thuyet }, { nhan: 'Nhận định đúng / sai về số nguyên', lt: D.NDB01297.ly_thuyet }]),
    vd: nhanVD([v1[0], v2[0], ...v4]),
  }
  // Dạng 2: Số đối
  const s1 = VDS(D.NDB01288.vi_du), s2 = VDS(D.NDB01289.vi_du)
  const ND2 = {
    ten: 'Số đối',
    mo_ta: 'Tìm số đối của một số nguyên (kể cả dạng −(−15), 5−a) và viết tập hợp gồm các phần tử của một tập cùng số đối của chúng.',
    lt: gopLT([{ nhan: 'Tìm số đối của một số', lt: D.NDB01288.ly_thuyet }, { nhan: 'Tập hợp gồm các phần tử và số đối của chúng', lt: D.NDB01289.ly_thuyet }]),
    vd: nhanVD([...s1, ...s2]),
  }
  // Dạng 3: Tập hợp của số nguyên
  const t1 = VDS(D.NDB01294.vi_du), t2 = VDS(D.NDB01295.vi_du)
  const ND3 = {
    ten: 'Tập hợp của số nguyên',
    mo_ta: 'Cho {x ∈ ℤ | −2 < x ≤ 3}: viết các phần tử bằng cách liệt kê, hoặc đếm xem có bao nhiêu số nguyên thoả mãn.',
    lt: gopLT([{ nhan: 'Viết tập hợp số nguyên bằng cách liệt kê', lt: D.NDB01294.ly_thuyet }, { nhan: 'Đếm số phần tử của tập hợp số nguyên', lt: D.NDB01295.ly_thuyet }]),
    vd: nhanVD([...t1, ...t2]),
  }
  for (const [id, x] of [['NDB01286', ND1], ['NDB01288', ND2], ['NDB01294', ND3]])
    await c.query('update dai_bdm_dang_bai set ten=$2, mo_ta=$3, ly_thuyet=$4, vi_du=$5 where id=$1', [id, x.ten, x.mo_ta, x.lt, x.vd])
  // Nhóm
  const a = SEC(N22.ly_thuyet), b = SEC(N23.ly_thuyet), d44 = SEC(D.NDB01297.ly_thuyet)
  const bay = d44.CY.split('\n')[0]
  const ltN = `##TC\n${a.TC}\n${b.TC}\n\n##PP\n${a.PP}\n${b.PP}\n\n##CY\n${a.CY}\n${b.CY}\n${bay}`
  await c.query('update dai_bdm_nhom set ten=$2, mo_ta=$3, ly_thuyet=$4 where id=$1', ['NNB01622', 'Các tính chất cơ bản của số nguyên',
    'Số nguyên dương / âm / 0, dùng số nguyên âm biểu thị đại lượng thực tế, số đối, và nhận định đúng / sai về tập hợp số nguyên.', ltN])

  // ───── 2. dạng Số đối chuyển sang nhóm NNB01622
  await c.query(`select fn_bdm_chuyen_dang_bai('NDB01288','NNB01622',null)`)

  // ───── 3. chuyển tham chiếu dạng bị gộp → dạng giữ lại
  const MAP = { NDB01287: 'NDB01286', NDB01297: 'NDB01286', NDB01289: 'NDB01288', NDB01295: 'NDB01294' }
  const bo = Object.keys(MAP)
  const mv = {}
  for (const [bang, col] of [['dai_bdm_gan_cau', 'dang_bai_id'], ['dai_cau_lop', 'dang_bai_id'], ['bai_test_cau', 'ma_dang'], ['tu_luyen_dang_lan', 'ma_dang'], ['gami_session_problems', 'ma_dang']]) {
    let n = 0
    for (const [cu, moi] of Object.entries(MAP)) n += (await c.query(`update ${bang} set ${col}=$2 where ${col}=$1`, [cu, moi])).rowCount
    mv[bang] = n
  }
  console.log('đã chuyển', mv)

  // ───── 4. giáo trình (tai_lieu_phan)
  const P = (await c.query(`select id,tai_lieu_id,loai_phan,ref_ma,cha_id,thu_tu from tai_lieu_phan where ref_ma = any($1)`, [[...bo, 'NNB01623', 'NNB01622', 'NDB01288']])).rows
  let giaoXoa = 0, giaoDoi = 0
  const xoaIds = []
  for (const tl of [...new Set(P.map((r) => r.tai_lieu_id))]) {
    const rows = P.filter((r) => r.tai_lieu_id === tl)
    const nhom22 = rows.find((r) => r.loai_phan === 'nhom' && r.ref_ma === 'NNB01622')
    const nhom23 = rows.find((r) => r.loai_phan === 'nhom' && r.ref_ma === 'NNB01623')
    for (const r of rows) {
      if (bo.includes(r.ref_ma) || r.ref_ma === 'NNB01623') xoaIds.push(r.id)
      if (r.loai_phan === 'dang_bai' && r.ref_ma === 'NDB01288' && nhom22) { await c.query('update tai_lieu_phan set cha_id=$2 where id=$1', [r.id, nhom22.id]); giaoDoi++ }
    }
    // phần con (btvn_nhom …) của nhóm 23 phải xoá cùng
    if (nhom23) for (const r of (await c.query('select id from tai_lieu_phan where cha_id=$1 and ref_ma<>$2', [nhom23.id, 'NDB01288'])).rows) if (!xoaIds.includes(r.id)) xoaIds.push(r.id)
  }
  // xoá lá → gốc: bỏ phần nào còn là cha của phần khác sẽ giữ lại (không được xảy ra)
  const con = (await c.query(`select cha_id, count(*) n from tai_lieu_phan where cha_id = any($1) and not (id = any($1)) group by 1`, [xoaIds])).rows
  if (con.length) throw new Error('còn phần con ngoài danh sách xoá: ' + JSON.stringify(con))
  giaoXoa = (await c.query('delete from tai_lieu_phan where id = any($1)', [xoaIds])).rowCount
  console.log('giáo trình: đổi cha', giaoDoi, '· xoá', giaoXoa)

  // ───── 5. không còn tham chiếu → xoá dạng, nhóm
  const con2 = {}
  for (const [bang, col] of [['dai_bdm_gan_cau', 'dang_bai_id'], ['dai_bdm_de_xuat', 'dang_bai_id'], ['hgt_bdm_gan_cau', 'dang_bai_id'], ['hgt_bdm_de_xuat', 'dang_bai_id'], ['dai_cau_lop', 'dang_bai_id'], ['dai_bdm_doi_ung', 'dich_dang_bai'], ['dai_bdm_doi_ung_cum', 'dang_bai_id'], ['bai_test_cau', 'ma_dang'], ['tu_luyen_dang_lan', 'ma_dang'], ['gami_session_problems', 'ma_dang'], ['tai_lieu_phan', 'ref_ma']]) {
    const n = await dem(`select count(*) n from ${bang} where ${col} = any($1)`, [[...bo, 'NNB01623']])
    if (n) con2[bang] = n
  }
  if (Object.keys(con2).length) throw new Error('còn tham chiếu: ' + JSON.stringify(con2))
  const xd = (await c.query('delete from dai_bdm_dang_bai where id = any($1)', [bo])).rowCount
  if (await dem('select count(*) n from dai_bdm_dang_bai where nhom_id=$1', ['NNB01623'])) throw new Error('nhóm NNB01623 còn dạng')
  const xn = (await c.query('delete from dai_bdm_nhom where id=$1', ['NNB01623'])).rowCount
  console.log('xoá dạng', xd, '· xoá nhóm', xn)
  if (xd !== 4 || xn !== 1) throw new Error('số dòng xoá không đúng')

  // ───── 6. thứ tự dạng trong nhóm mới: 1 Tính chất, 2 Số đối
  await c.query(`update dai_bdm_dang_bai set thu_tu=1 where id='NDB01286'`)
  await c.query(`update dai_bdm_dang_bai set thu_tu=2 where id='NDB01288'`)

  // chuẩn hoá thứ tự (không để lỗ hổng sau khi xoá nhóm/dạng)
  await c.query(`update dai_bdm_nhom n set thu_tu=r.rn from (select id,row_number() over(order by thu_tu,id) rn from dai_bdm_nhom where chuyen_de_id='NCH00461') r where n.id=r.id and n.thu_tu<>r.rn`)
  await c.query(`update dai_bdm_dang_bai d set thu_tu=r.rn from (select id,row_number() over(partition by nhom_id order by thu_tu,id) rn from dai_bdm_dang_bai where nhom_id in (select id from dai_bdm_nhom where chuyen_de_id='NCH00461')) r where d.id=r.id and d.thu_tu<>r.rn`)
  // ───── 7. kiểm sau
  const sau = {}; for (const id of ['NDB01286', 'NDB01288', 'NDB01294']) sau[id] = await dem('select count(*) n from dai_bdm_gan_cau where dang_bai_id=$1', [id])
  const dky = { NDB01286: truoc.NDB01286 + truoc.NDB01287 + truoc.NDB01297, NDB01288: truoc.NDB01288 + truoc.NDB01289, NDB01294: truoc.NDB01294 + truoc.NDB01295 }
  console.log('gán sau', sau, 'kỳ vọng', dky)
  for (const k in dky) if (sau[k] !== dky[k]) throw new Error('số câu gán không khớp ' + k)
  console.table((await c.query(`select n.thu_tu nt,n.id nid,n.ten nten,d.thu_tu dt,d.id did,d.ten dten from dai_bdm_nhom n left join dai_bdm_dang_bai d on d.nhom_id=n.id where n.chuyen_de_id='NCH00461' order by n.thu_tu,d.thu_tu`)).rows)

  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK (chạy thử)') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
