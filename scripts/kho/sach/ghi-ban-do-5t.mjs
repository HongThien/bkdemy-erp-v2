// ============================================================================
// ghi-ban-do-5t.mjs — GHI bản đồ kiến thức 5T (bản đồ MỚI dai_bdm_*) theo đề xuất đã duyệt (Thùy 13/11: "cập nhật lại bản đồ hiện tại").
//
//   node scripts/kho/sach/ghi-ban-do-5t.mjs [--ghi]
//
// Nguồn dữ liệu: de-xuat-ban-do-5t-du-lieu.mjs (cùng nguồn với trang HTML đã duyệt). CHỈ THÊM + CHUYỂN, KHÔNG XOÁ:
//   · chủ đề mới A, B, D, E (khối 5T, nhánh toán) · chủ đề F "để sau" KHÔNG tạo (chưa đủ dữ liệu)
//   · chuyên đề / nhóm / dạng bài mới theo đúng thứ tự trong dữ liệu
//   · 2 nhóm cũ (NNB01807, NNB01808) CHUYỂN sang chuyên đề mới Phân số / Số thập phân — mã giữ nguyên, dạng + câu gán đi theo
//   · dạng mới thêm vào nhóm đã có (phần trăm: NNB02088, 02090, 02091)
//   · thứ tự chủ đề: A, B, "Bài toán tỉ số" (NCD00215, đổi thu_tu 1→3), D, E
// Chạy lại an toàn (tìm theo tên trước khi tạo). Không --ghi: chạy thử trong transaction rồi ROLLBACK. Mã gốc bất biến: mọi mã do DB cấp.
// ============================================================================
import { CD } from './de-xuat-ban-do-5t-du-lieu.mjs'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const KHOI = '5T', CD_CU = 'NCD00215'
const chuanTen = (s) => s.replace(/ · /g, ' - ').trim()
/** "Tên (chú thích)" → { ten, mo_ta } */
function tachDang(s) {
  const t = s.replace(/^🆕\s*/, '').trim()
  const m = t.match(/^(.*?)\s*\((.*)\)\s*$/)
  return m ? { ten: m[1].trim(), mo_ta: m[2].trim() } : { ten: t, mo_ta: '' }
}
const MO_TA_RIENG = { 'Pha loãng / cô đặc': 'Thêm nước / thêm chất, đun bay hơi — lượng chất tan không đổi', 'Hạt tươi – hạt khô': 'Phơi khô: nước bay hơi, lượng chất khô không đổi' }
const NHOM_CHO_DANG_THEM = 'NNB02088'   // '🆕 thêm dạng: Tính tỉ số % và đổi số ↔ %'

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
const dem = { chu_de: 0, chuyen_de: 0, nhom: 0, dang: 0, nhom_chuyen: 0 }
const ds = { chu_de: [], nhom_moi: [], chuyen: [] }
let ma = 0
try {
  await db.query('begin')
  const one = async (sql, p) => (await db.query(sql, p)).rows[0]

  const themDang = async (nhomId, dang) => {
    const { rows } = await db.query(`select ten from dai_bdm_dang_bai where nhom_id = $1`, [nhomId])
    const co = new Set(rows.map((r) => r.ten.toLowerCase()))
    for (const d of dang) {
      if (!d.startsWith('🆕') && nhomId.startsWith('NNB0') && false) continue
      const { ten, mo_ta } = tachDang(d)
      if (co.has(ten.toLowerCase())) continue
      await db.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta) values ($1, $2, $3)`, [nhomId, ten, MO_TA_RIENG[ten] ?? mo_ta])
      co.add(ten.toLowerCase()); dem.dang++
    }
  }

  const thuTuChuDe = []
  for (const c of CD) {
    if (!c.cdn.length) continue                                  // F: để sau
    let cdId
    if (c.id === 'C') cdId = CD_CU
    else {
      const ten = chuanTen(c.ten)
      cdId = (await one(`select id from dai_bdm_chu_de where khoi = $1 and nhanh = 'toan' and ten = $2`, [KHOI, ten]))?.id
      if (!cdId) { cdId = (await one(`insert into dai_bdm_chu_de (khoi, ten, nhanh) values ($1, $2, 'toan') returning id`, [KHOI, ten])).id; dem.chu_de++; ds.chu_de.push(`${cdId} ${ten}`) }
    }
    thuTuChuDe.push([cdId, c.id])

    for (const ch of c.cdn) {
      let chId = ch.ma
      if (!chId) {
        const ten = chuanTen(ch.ten)
        chId = (await one(`select ch.id from dai_bdm_chuyen_de ch join dai_bdm_o o on o.chuyen_de_id = ch.id where o.chu_de_id = $1 and ch.ten = $2`, [cdId, ten]))?.id
        if (!chId) {
          chId = (await one(`insert into dai_bdm_chuyen_de (ten) values ($1) returning id`, [ten])).id
          await db.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id) values ($1, $2)`, [cdId, chId])
          dem.chuyen_de++; ds.chuyen.push(`${chId} ${ten}`)
        }
      }
      for (const n of ch.nhom) {
        if (n.tt === 'co' && n.ma) {
          // nhóm đã có: chuyển chuyên đề nếu đề xuất nằm ở chuyên đề khác; thêm dạng mới (đánh dấu 🆕)
          const hien = await one(`select chu_de_id, chuyen_de_id from dai_bdm_nhom where id = $1`, [n.ma])
          if (!hien) throw new Error(`nhóm ${n.ma} không còn trong DB`)
          if (hien.chu_de_id !== cdId || hien.chuyen_de_id !== chId) {
            await db.query(`update dai_bdm_nhom set chu_de_id = $2, chuyen_de_id = $3 where id = $1`, [n.ma, cdId, chId]); dem.nhom_chuyen++
          }
          await themDang(n.ma, n.dang.filter((d) => d.startsWith('🆕')))
          continue
        }
        if (n.ten.startsWith('🆕 thêm dạng:')) { await themDang(NHOM_CHO_DANG_THEM, n.dang); continue }
        const ten = chuanTen(n.ten.replace(/^🆕 nhóm:\s*/, ''))
        let nhId = (await one(`select id from dai_bdm_nhom where chu_de_id = $1 and chuyen_de_id = $2 and ten = $3`, [cdId, chId, ten]))?.id
        if (!nhId) { nhId = (await one(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten) values ($1, $2, $3) returning id`, [cdId, chId, ten])).id; dem.nhom++; ds.nhom_moi.push(`${nhId} ${ten}`) }
        await themDang(nhId, n.dang)
      }
    }
  }
  // thứ tự chủ đề: theo thứ tự trong dữ liệu (A, B, C, D, E)
  let i = 0
  for (const [id] of thuTuChuDe) await db.query(`update dai_bdm_chu_de set thu_tu = $2 where id = $1`, [id, ++i])

  const { rows: sau } = await db.query(`select cd.thu_tu, cd.id, cd.ten, count(distinct o.chuyen_de_id) so_chuyen_de, count(distinct n.id) so_nhom, count(distinct d.id) so_dang
      from dai_bdm_chu_de cd left join dai_bdm_o o on o.chu_de_id = cd.id left join dai_bdm_nhom n on n.chu_de_id = cd.id left join dai_bdm_dang_bai d on d.nhom_id = n.id
     where cd.khoi = $1 and cd.nhanh = 'toan' group by cd.thu_tu, cd.id, cd.ten order by cd.thu_tu`, [KHOI])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', JSON.stringify(dem))
  console.table(sau.map((r) => ({ stt: r.thu_tu, id: r.id, chu_de: r.ten, chuyen_de: r.so_chuyen_de, nhom: r.so_nhom, dang: r.so_dang })))
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
