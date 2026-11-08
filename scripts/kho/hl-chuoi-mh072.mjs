// ⚠ LỊCH SỬ: script dựng theo kiểu "nhánh rẽ từ bài" (đã bỏ 22/10). Dữ liệu đã chuyển sang "giả thiết nối giả thiết" bởi
// mig 202610221743 (+ B7 thêm tiền đề B1). fn_hl_re_nhanh_tu_bai đã khoá ⇒ KHÔNG chạy lại script này.
// Dựng CHUỖI mẫu cho mô hình MH.072 "Hình chữ nhật trong tam giác vuông - Trung điểm M" (Hình–Luyện, khối 8)
// từ file của Thùy (22/10, "Hình chữ nhật trong tam giác vuông - trung điểm.pdf", B1–B27). Spec: spec-hinh-cay-nhanh.md.
//   node scripts/kho/hl-chuoi-mh072.mjs          ⇒ chạy thử trong 1 transaction rồi ROLLBACK
//   node scripts/kho/hl-chuoi-mh072.mjs --ghi    ⇒ commit
// Cách xếp cây (luật §3 "tiền đề phải nằm trên đường gốc → nhánh"):
//   thân = B1–B7 · các "nhánh chính" (AH → K → I → MF⊥AK) LỒNG nối tiếp, mỗi nhánh rẽ từ bài cuối của đoạn trước
//   (B21 cần cả B19 ở nhánh I lẫn B12 ở nhánh K ⇒ bắt buộc lồng) · nhánh phụ rẽ từ bài nó "đi từ".
// Chỉ THÊM (fn_hl_them_bai / fn_hl_re_nhanh_tu_bai); bài B1 đã có (BT.08.072.01) giữ nguyên. Chạy 2 lần ⇒ script từ chối.
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const MA_MH = 'MH.072', MA_B1 = 'BT.08.072.01'

// nhánh: neo = bài mẹ (khoá B…), gt = giả thiết THÊM
const NHANH = {
  PQ: { ten: 'P, Q là trung điểm MB, MC', gt: 'Gọi $P, Q$ lần lượt là trung điểm của $MB, MC$.', neo: 'B1' },
  AH: { ten: 'Kẻ AH ⊥ BC', gt: 'Kẻ $AH$ vuông góc với $BC$ ($H \\in BC$).', neo: 'B7' },
  K:  { ten: 'K đối xứng với M qua E', gt: 'Lấy điểm $K$ đối xứng với $M$ qua $E$.', neo: 'B11' },
  O:  { ten: 'O là trung điểm AM', gt: 'Gọi $O$ là trung điểm của $AM$.', neo: 'B14' },
  J:  { ten: 'J đối xứng với B qua E', gt: 'Lấy điểm $J$ đối xứng với $B$ qua $E$.', neo: 'B12' },
  I:  { ten: 'I đối xứng với M qua D', gt: 'Lấy điểm $I$ đối xứng với $M$ qua $D$.', neo: 'B16' },
  F:  { ten: 'Kẻ MF ⊥ AK', gt: 'Kẻ $MF$ vuông góc với $AK$ ($F \\in AK$).', neo: 'B23' },
}
// bài theo thứ tự trong làn; td = tiền đề (cái đầu = chính)
const BAI = [
  ['B2', 'than', 'Tìm điều kiện của tam giác $ABC$ để $ADME$ là hình vuông.', ['B1']],
  ['B3', 'than', 'Chứng minh $D, E$ lần lượt là trung điểm của $AB, AC$.', ['B1']],
  ['B4', 'than', 'Chứng minh $DE = \\dfrac{BC}{2}$.', ['B1']],
  ['B5', 'than', 'Chứng minh $\\Delta BDM = \\Delta MEC$.', []],
  ['B6', 'than', 'Chứng minh $BDEM$ và $DMCE$ là các hình bình hành.', ['B3']],
  ['B7', 'than', 'Chứng minh $DE \\parallel BC$.', ['B6']],
  ['B8', 'PQ', 'Chứng minh $DPQE$ là hình thang.', ['B1']],
  ['B9', 'PQ', 'Tìm điều kiện của tam giác $ABC$ để $DPQE$ là hình chữ nhật.', ['B8']],
  ['B10', 'AH', 'Chứng minh $DHME$ là hình thang cân.', ['B3', 'B1']],
  ['B11', 'AH', 'Chứng minh $\\widehat{DHE} = 90^\\circ$.', ['B3']],
  ['B12', 'K', 'Chứng minh $AMCK$ là hình thoi.', ['B3']],
  ['B13', 'K', 'Tìm điều kiện để $AMCK$ là hình vuông.', ['B12']],
  ['B14', 'K', 'Chứng minh $ABMK$ là hình bình hành.', ['B1']],
  ['B15', 'K', 'Chứng minh $ADEK$ là hình bình hành.', ['B1']],
  ['B16', 'K', 'Chứng minh $AM, DE, BK$ đồng quy.', ['B14']],
  ['B17', 'O', 'Chứng minh $B, O, K$ thẳng hàng.', ['B14']],
  ['B18', 'J', 'Chứng minh $A, K, J$ thẳng hàng.', ['B3']],
  ['B19', 'I', 'Chứng minh $AMBI$ là hình thoi.', ['B3']],
  ['B20', 'I', 'Chứng minh $AEDI$ là hình bình hành.', ['B1']],
  ['B21', 'I', 'Chứng minh $A, I, K$ thẳng hàng.', ['B19', 'B12']],
  ['B22', 'I', 'Chứng minh $A$ là trung điểm của $IK$.', ['B21']],
  ['B23', 'I', 'Chứng minh $AM, DK, EI$ đồng quy.', ['B21']],
  ['B24', 'F', 'Chứng minh $DF \\perp EF$.', ['B1']],
  ['B25', 'F', 'Chứng minh $DAFE$ là hình thang cân.', ['B24']],
  ['B26', 'F', 'Chứng minh $\\Delta DFE = \\Delta DME$.', ['B24']],
  ['B27', 'F', 'Chứng minh $\\widehat{FDA} = \\widehat{FAE}$.', ['B26']],
]

const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
await c.query('begin')
try {
  const goc = (await c.query(`select id from hinh_mo_hinh where ma = $1 and neo_baitoan_id is null`, [MA_MH])).rows[0]?.id
  const b1 = (await c.query(`select id, mo_hinh_id from hinh_baitoan where ma = $1`, [MA_B1])).rows[0]
  if (!goc || !b1 || b1.mo_hinh_id !== goc) throw new Error('Không thấy MH.072 / bài 1.1 đúng chỗ')
  const n = +(await c.query(`select count(*) from hinh_baitoan b where b.mo_hinh_id = $1 or b.mo_hinh_id in (select id from hinh_mo_hinh where neo_baitoan_id is not null and fn_hl_goc_mo_hinh(id) = $1)`, [goc])).rows[0].count
  if (n !== 1) throw new Error(`Cây MH.072 đang có ${n} bài (mong 1) — đã dựng rồi? Không chạy lại.`)
  const id = { B1: b1.id }, lan = { than: goc }
  for (const [k, l, pb, td] of BAI) {
    const tienDe = td.map((x) => { if (!id[x]) throw new Error(`${k}: tiền đề ${x} chưa có`); return id[x] })
    let kq
    if (lan[l]) {
      kq = (await c.query(`select fn_hl_them_bai($1, $2, null, null, null, $3::uuid[]) v`, [lan[l], pb, tienDe])).rows[0].v
    } else {
      const nh = NHANH[l]
      kq = (await c.query(`select fn_hl_re_nhanh_tu_bai($1, $2, $3, $4, null, null, null, $5::uuid[]) v`, [id[nh.neo], nh.ten, nh.gt, pb, tienDe])).rows[0].v
      lan[l] = kq.nhanh_moi
    }
    id[k] = kq.bai_moi
  }
  const so = new Map((await c.query(`select baitoan_id, so, ma from fn_hl_so_hien_thi($1)`, [goc])).rows.map((r) => [r.baitoan_id, r]))
  for (const k of ['B1', ...BAI.map((x) => x[0])]) {
    const r = so.get(id[k]); const l = k === 'B1' ? 'than' : BAI.find((x) => x[0] === k)[1]
    console.log(`${k.padEnd(4)} ${String(r?.so).padEnd(10)} ${r?.ma}  [${l === 'than' ? 'Thân' : NHANH[l].ten}]`)
  }
  const sai = (await c.query(`select * from fn_hl_sai_nhanh($1)`, [goc])).rows
  console.log(`nhánh mới: ${Object.keys(lan).length - 1} · bài mới: ${BAI.length} · sai nhánh: ${sai.length}`)
  if (sai.length) throw new Error('Có bài sai nhánh: ' + JSON.stringify(sai))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI (commit)' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
