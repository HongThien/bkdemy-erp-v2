// ⚠ ĐÃ CHẠY --ghi 23/10: MH.116–MH.123 + BT.08.073.01–15 (script tự từ chối nếu chạy lại). Mã thực tế lệch mã lúc chạy thử vì sequence không rollback.
// Dựng CHUỖI cho mô hình MH.073 "Hình chữ nhật trong tam giác vuông – Chân đường cao H" (Hình–Luyện, khối 8)
// từ file của Thùy (23/10, "Mô hình Hình chữ nhật trong tam giác vuông - Chân đường cao.pdf"). Mô hình cây: giả thiết nối giả thiết,
// bài nối bài (spec-hinh-cay-nhanh.md, khung "ĐỔI MÔ HÌNH 22/10"). Kèm 2 sửa MH.072 Thùy chốt 23/10:
//   B27 đổi thành ∠FAE = ∠FDE · giả thiết gốc MH.072 thêm "AB < AC" (B10, B25 cần).
//   node scripts/kho/hl-chuoi-mh073.mjs          ⇒ chạy thử trong 1 transaction rồi ROLLBACK
//   node scripts/kho/hl-chuoi-mh073.mjs --ghi    ⇒ commit
// Chỉ THÊM (fn_hl_them_gia_thiet / fn_hl_them_bai). MH.073 đã có bài/nhánh ⇒ script từ chối (không chạy 2 lần).
// Lệch so với file (đã kiểm bằng toạ độ, báo Thùy): "OL // AC" sai — luôn ra OL ∥ AB (L trung điểm HD, O trung điểm DE ⇒ OL ∥ EH ∥ AB);
// nhánh phụ 3 thêm "Gọi O là giao điểm của AH và DE" (file dùng O mà nhánh này chưa định nghĩa); bài đồng quy cần AB ≠ AC (giả thiết riêng).
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const MA_MH = 'MH.073'

// giả thiết: cha (khoá trong GT hoặc 'goc'), chinh, ten, gt
const GT = {
  N1:  { cha: 'goc', chinh: false, ten: 'M là trung điểm BC', gt: 'Gọi $M$ là trung điểm của $BC$.' },
  N1a: { cha: 'N1', chinh: true, ten: 'O = AH ∩ DE, qua A kẻ xy ⊥ OM', gt: 'Gọi $O$ là giao điểm của $AH$ và $DE$. Qua $A$ kẻ đường thẳng $xy$ vuông góc với $OM$.' },
  N2:  { cha: 'goc', chinh: false, ten: 'E là trung điểm AK', gt: 'Lấy điểm $K$ sao cho $E$ là trung điểm của $AK$. Gọi $O$ là giao điểm của $AH$ và $DE$, $J$ là giao điểm của $DK$ và $HE$.' },
  N3:  { cha: 'goc', chinh: false, ten: 'D là trung điểm AG', gt: 'Lấy điểm $G$ sao cho $D$ là trung điểm của $AG$. Gọi $O$ là giao điểm của $AH$ và $DE$. $EG$ cắt $HD$ tại $L$.' },
  N4:  { cha: 'goc', chinh: false, ten: 'Qua C kẻ đường song song AH', gt: 'Qua $C$ kẻ đường thẳng song song với $AH$, cắt các đường thẳng $DH, DE$ lần lượt tại $P, Q$.' },
  C2:  { cha: 'goc', chinh: true, ten: 'K đối xứng với A qua I', gt: 'Gọi $I$ là trung điểm của $HC$. Lấy điểm $K$ đối xứng với $A$ qua $I$.' },
  C2a: { cha: 'C2', chinh: false, ten: 'AK cắt CO tại F', gt: 'Gọi $O$ là giao điểm của $AH$ và $DE$. $AK$ cắt $CO$ tại $F$.' },
  C2b: { cha: 'C2', chinh: false, ten: 'R, S là trung điểm AH, CK', gt: 'Gọi $R, S$ lần lượt là trung điểm của $AH$ và $CK$.' },
}
// bài theo thứ tự file (số B1… suy theo thứ tự tạo); td = tiền đề (cái đầu = chính); rieng = giả thiết riêng của bài
const BAI = [
  ['B1', 'goc', 'CMR: $ADHE$ là hình chữ nhật.', []],
  ['B2', 'N1', 'CMR: $AM \\perp DE$.', ['B1']],
  ['B3', 'N1a', 'CMR: $xy, BC, DE$ đồng quy.', ['B2', 'B1'], '$AB \\ne AC$'],
  ['B4', 'N2', 'CMR: $DHKE$ là hình bình hành.', ['B1']],
  ['B5', 'N2', 'CMR: $OJ = \\dfrac{AE}{2}$.', ['B4', 'B1']],
  ['B6', 'N3', 'CMR: $DGHE$ là hình bình hành.', ['B1']],
  ['B7', 'N3', 'CMR: $OL \\parallel AB$.', ['B6', 'B1']],
  ['B8', 'N4', 'Tìm điều kiện của tam giác $ABC$ để $\\Delta DPQ$ là tam giác vuông cân.', ['B1']],
  ['B9', 'C2', 'CMR: $AHKC$ là hình bình hành.', []],
  ['B10', 'C2', 'CMR: $D, H, K$ thẳng hàng.', ['B9', 'B1']],
  ['B11', 'C2', 'CMR: $DECK$ là hình thang cân.', ['B10', 'B9', 'B1']],
  ['B12', 'C2a', 'CMR: $AK = 3AF$.', ['B1']],
  ['B13', 'C2b', 'CMR: $RHSC$ là hình bình hành.', ['B9']],
  ['B14', 'C2b', 'CMR: $I$ là trung điểm của $RS$.', ['B13']],
  ['B15', 'C2b', 'CMR: $R, I, S$ thẳng hàng.', ['B14']],
]

const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  // ── MH.072: B27 + AB < AC ──
  const b27 = await q(`update hinh_baitoan set phat_bieu = $2, updated_at = now() where ma = $1 and phat_bieu = $3 returning id`,
    ['BT.08.072.27', 'CMR: $\\widehat{FAE} = \\widehat{FDE}$.', 'CMR: $\\widehat{FDA} = \\widehat{FAE}$.'])
  const gt72 = await q(`update hinh_mo_hinh set gia_thiet = $2, updated_at = now() where ma = 'MH.072' and neo_baitoan_id is null and gia_thiet = $1 returning id`,
    ['Cho tam giác $ABC$ vuông ở $A$. $M$ là trung điểm của $BC$. Từ $M$ kẻ $MD, ME$ lần lượt vuông góc với $AB, AC$.',
     'Cho tam giác $ABC$ vuông ở $A$ ($AB < AC$). $M$ là trung điểm của $BC$. Từ $M$ kẻ $MD, ME$ lần lượt vuông góc với $AB, AC$.'])
  console.log(`MH.072: B27 ${b27.length ? 'đã sửa' : 'KHÔNG đổi (đề đã khác bản cũ?)'} · giả thiết AB < AC ${gt72.length ? 'đã thêm' : 'KHÔNG đổi'}`)

  // ── MH.073 ──
  const goc = (await q(`select id from hinh_mo_hinh where ma = $1 and neo_baitoan_id is null and la_mo_hinh`, [MA_MH]))[0]?.id
  if (!goc) throw new Error('Không thấy MH.073')
  const nBai = +(await q(`select count(*) n from hinh_baitoan where mo_hinh_id = $1`, [goc]))[0].n
  const nCon = +(await q(`select count(*) n from hinh_mo_hinh_cha where cha_id = $1`, [goc]))[0].n
  if (nBai || nCon) throw new Error(`MH.073 đã có ${nBai} bài, ${nCon} nhánh — đã dựng rồi? Không chạy lại.`)
  await q(`update hinh_mo_hinh set gia_thiet = $2, updated_at = now() where id = $1`,
    [goc, 'Cho tam giác $ABC$ vuông ở $A$ có đường cao $AH$. Từ $H$ kẻ $HD, HE$ lần lượt vuông góc với $AB, AC$.'])
  const id = { goc }
  for (const [k, g] of Object.entries(GT)) {
    await q(`select fn_hl_them_gia_thiet($1, $2, $3, $4)`, [id[g.cha], g.ten, g.gt, g.chinh])
    id[k] = (await q(`select m.id from hinh_mo_hinh m join hinh_mo_hinh_cha h on h.mo_hinh_id = m.id where h.cha_id = $1 and m.gia_thiet_them = $2`, [id[g.cha], g.gt]))[0].id
  }
  const bai = {}
  for (const [k, l, pb, td, rieng] of BAI) {
    const tienDe = td.map((x) => { if (!bai[x]) throw new Error(`${k}: tiền đề ${x} chưa có`); return bai[x] })
    bai[k] = (await q(`select fn_hl_them_bai($1, $2, $3, null, null, $4::uuid[]) v`, [id[l], pb, rieng ?? null, tienDe]))[0].v.bai_moi
  }
  const ma = new Map((await q(`select id, ma from hinh_mo_hinh where id = any($1::uuid[])`, [Object.values(id)])).map((r) => [r.id, r.ma]))
  for (const k of Object.keys(GT)) console.log(`${k.padEnd(4)} ${ma.get(id[k])}  ${GT[k].chinh ? 'chính' : 'phụ  '} của ${GT[k].cha === 'goc' ? MA_MH : ma.get(id[GT[k].cha])}  ${GT[k].ten}`)
  const so = new Map((await q(`select baitoan_id, so, ma from fn_hl_so_hien_thi($1)`, [goc])).map((r) => [r.baitoan_id, r]))
  for (const [k] of BAI) { const r = so.get(bai[k]); console.log(`${k.padEnd(4)} → ${String(r?.so).padEnd(5)} ${r?.ma}`) }
  const lech = BAI.filter(([k]) => String(so.get(bai[k])?.so) !== k)
  if (lech.length) throw new Error('Số hiển thị lệch thứ tự file: ' + lech.map((x) => x[0]).join(' '))
  const sai = await q(`select * from fn_hl_sai_nhanh($1)`, [goc])
  if (sai.length) throw new Error('Có bài sai nhánh: ' + JSON.stringify(sai))
  console.log(`giả thiết mới: ${Object.keys(GT).length} · bài mới: ${BAI.length} · sai nhánh: 0`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI (commit)' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
