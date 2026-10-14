// tao-goi.mjs — dựng 8 GÓI dữ liệu cho trạm soạn LÝ THUYẾT (nhóm) + VÍ DỤ (dạng bài) bản đồ mới K6 (Thùy 14/10).
//   node kho-rules/dai/lo/k6/ban-do-moi/tao-goi.mjs <thư mục ra>
// Mỗi gói: các nhóm + dạng bài (tên · mô tả · lý thuyết / ví dụ hiện có) + ỨNG VIÊN ví dụ = câu ĐÃ DUYỆT của cụm cũ cùng tên (bản đồ cũ) kèm lời giải.
// Ghép dạng mới ↔ cụm cũ: theo tên trong nhóm đối ứng (dai_bdm_doi_ung). Chỉ ĐỌC DB.
import pg from 'pg'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
process.loadEnvFile('.env')

const OUT = process.argv[2]
if (!OUT) { console.error('Dùng: node …/tao-goi.mjs <thư mục ra>'); process.exit(2) }
mkdirSync(OUT, { recursive: true })

// 8 gói theo cụm nhóm bài
const GOI = [
  { so: 1, ten: 'Tập hợp · Số La Mã · Tính toán số tự nhiên', nhom: ['NNB00889', 'NNB00890', 'NNB00891', 'NNB00892'] },
  { so: 2, ten: 'Tính thuận tiện · Luỹ thừa · Thứ tự phép tính · Toán thực tế', nhom: ['NNB00893', 'NNB00897', 'NNB00898', 'NNB00900', 'NNB00896'] },
  { so: 3, ten: 'Dãy luỹ thừa · Tìm x', nhom: ['NNB00902', 'NNB00894', 'NNB00895', 'NNB00899', 'NNB00901'] },
  { so: 4, ten: 'Ước bội · Dấu hiệu chia hết · Số nguyên tố', nhom: ['NNB00904', 'NNB00905', 'NNB00906', 'NNB00907', 'NNB00908', 'NNB00909', 'NNB00910'] },
  { so: 5, ten: 'Nâng cao quan hệ chia hết', nhom: ['NNB00913', 'NNB00911', 'NNB00912', 'NNB00914', 'NNB00915'] },
  { so: 6, ten: 'Nâng cao số nguyên tố', nhom: ['NNB00916', 'NNB00918', 'NNB00917'] },
  { so: 7, ten: 'ƯC · ƯCLN · BC · BCNN (cơ bản + thực tế)', nhom: ['NNB00919', 'NNB00920', 'NNB00922', 'NNB00921', 'NNB00923', 'NNB00924', 'NNB00926', 'NNB00925'] },
  { so: 8, ten: 'Nâng cao ƯCLN – BCNN · phép chia có dư', nhom: ['NNB00927', 'NNB00928', 'NNB00929', 'NNB00930', 'NNB00931', 'NNB00932', 'NNB00933'] },
]

const norm = (s) => String(s || '').toLowerCase().normalize('NFC').replace(/luỹ/g, 'lũy').replace(/[^\p{L}\p{N}]+/g, ' ').trim()
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
let tong = { nhom: 0, dang: 0, canLT: 0, ungVien: 0, dangKhongUngVien: [] }
try {
  for (const g of GOI) {
    const nhoms = await q(`select n.id, n.ten, n.mo_ta, n.ly_thuyet, ch.ten chuyen_de from dai_bdm_nhom n left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id where n.id = any($1) order by array_position($1::text[], n.id)`, [g.nhom])
    const goi = { goi: g.so, ten: g.ten, nhom: [] }
    for (const n of nhoms) {
      const dangs = await q(`select id, ten, mo_ta, vi_du from dai_bdm_dang_bai where nhom_id = $1 order by thu_tu, id`, [n.id])
      const cuDang = (await q(`select ma_dang_cu from dai_bdm_doi_ung where dich_nhom = $1`, [n.id])).map((r) => r.ma_dang_cu)
      const cums = cuDang.length ? await q(`select ma_cum, ten from dai_cum_bai where ma_dang = any($1) order by thu_tu`, [cuDang]) : []
      const nh = { id: n.id, ten: n.ten, mo_ta: n.mo_ta || '', chuyen_de: n.chuyen_de, ly_thuyet_hien_co: n.ly_thuyet || '', can_ly_thuyet: !(n.ly_thuyet || '').trim(), khong_co_dang: dangs.length === 0, dang: [] }
      tong.nhom++; if (nh.can_ly_thuyet) tong.canLT++
      for (const d of dangs) {
        let cum = cums.find((x) => norm(x.ten) === norm(d.ten)) ?? cums.find((x) => norm(x.ten).includes(norm(d.ten)) || norm(d.ten).includes(norm(x.ten)))
        if (!cum && cums.length === 1) cum = cums[0]
        const uv = cum ? await q(
          `select ma_cau, loai_cau, noi_dung, dap_an, left(loi_giai, 1400) loi_giai, nguon
             from dai_cau_hoi
            where ma_cum = $1 and xoa_at is null and da_duyet and anh_de is null and length(coalesce(loi_giai, '')) > 20 and length(noi_dung) < 700
            order by (loai_cau = 'trac_nghiem'), (nguon in ('le', 'de_thi')) desc, length(noi_dung), ma_cau
            limit 8`, [cum.ma_cum]) : []
        tong.dang++; tong.ungVien += uv.length; if (!uv.length) tong.dangKhongUngVien.push(`${d.id} ${d.ten}`)
        nh.dang.push({ id: d.id, ten: d.ten, mo_ta: d.mo_ta || '', vi_du_hien_co: d.vi_du || '', cum_cu: cum ? `${cum.ma_cum} ${cum.ten}` : null, ung_vien: uv })
      }
      goi.nhom.push(nh)
    }
    writeFileSync(join(OUT, `goi-${g.so}.json`), JSON.stringify(goi, null, 1))
    console.log(`goi-${g.so}: ${goi.nhom.length} nhóm · ${goi.nhom.reduce((s, n) => s + n.dang.length, 0)} dạng · cần LT ${goi.nhom.filter((n) => n.can_ly_thuyet).length} — ${g.ten}`)
  }
} finally { await c.end() }
console.log(`TỔNG: ${tong.nhom} nhóm · ${tong.dang} dạng · ${tong.canLT} nhóm cần lý thuyết · ${tong.ungVien} câu ứng viên · dạng KHÔNG có ứng viên: ${tong.dangKhongUngVien.length}`)
for (const x of tong.dangKhongUngVien) console.log('   ·', x)
