// ============================================================================
// cong-ghi.mjs — CỔNG GHI của dây chuyền kho (spec-luong-kho.md §9.3, luật cài cứng số 3).
//
// Luật: câu chỉ được ghi vào kho khi kèm BIÊN BẢN KIỂM hợp lệ. Trạm làm (AI) không tự khai
// "đã kiểm, khớp" được — `kiem_may` ghi vào DB do CỔNG suy ra từ biên bản, không do AI điền.
//
// Cổng KHÔNG quyết câu đúng hay sai. Cổng chỉ bảo đảm 4 điều:
//   1. Có biên bản cho mọi trạm kiểm bắt buộc của câu này.
//   2. Biên bản kiểm ĐÚNG NỘI DUNG sắp ghi (so dấu băm — sửa 1 ký tự sau khi kiểm là lộ).
//   3. Người kiểm KHÁC lượt chạy với người làm, và kiểm bằng một CÁCH được công nhận là độc lập.
//   4. Kết quả kiểm được chép nguyên vào `kiem_may` — không đạt thì câu vẫn vào kho nhưng mang cờ 'nghi'.
//
// Mọi câu qua cổng đều `da_duyet = false`. Duyệt là việc của NGƯỜI (hoặc luật lên cấp §5.5), không phải của cổng.
//
//   node scripts/kho/cong-ghi.mjs xet --goi <goi.json>     → in phán quyết; thoát 0 = được ghi, 3 = bị từ chối
//
// P0: cổng mới chỉ XÉT. Nối vào lệnh ghi thật (`_kho_insert.mjs`) làm ở P2.
// ============================================================================
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Các trường làm nên NỘI DUNG của câu. Đổi 1 trong số này sau khi kiểm ⇒ biên bản hết hiệu lực.
export const TRUONG_NOI_DUNG = ['loai_cau', 'noi_dung', 'lua_chon', 'menh_de', 'dap_an', 'loi_giai', 'dang_chinh', 'ma_cum', 'anh_de', 'anh_dap_an']

// Cách kiểm được công nhận là độc lập, xếp từ mạnh tới yếu (spec §5.1 nguyên tắc 4).
export const CACH_KIEM = ['code', 'model_khac', 'cung_model_ngu_canh_sach']

export const KET_QUA = ['dat', 'khong_dat', 'khong_kiem_duoc']

function chuanHoa(v) {
  if (v === undefined || v === null) return null
  if (typeof v === 'string') { const s = v.normalize('NFC').replace(/\r\n/g, '\n').trim(); return s === '' ? null : s }
  if (Array.isArray(v)) return v.map(chuanHoa)
  if (typeof v === 'object') {
    const o = {}
    for (const k of Object.keys(v).sort()) o[k] = chuanHoa(v[k])
    return o
  }
  return v
}

/** Dấu băm nội dung câu: cùng nội dung ⇒ cùng băm, bất kể thứ tự khoá hay CRLF/LF. */
export function bamNoiDung(cau) {
  const o = {}
  for (const k of TRUONG_NOI_DUNG) o[k] = chuanHoa(cau?.[k])
  return createHash('sha256').update(JSON.stringify(o)).digest('hex')
}

export function laDangCho(maDang) {
  return typeof maDang === 'string' && /000000$/.test(maDang)
}

/** Câu này bắt buộc phải qua những trạm kiểm nào. */
export function tramBatBuoc(cau) {
  const ds = ['kiem-doc']                                                   // mọi câu: đọc có đúng với trang gốc không
  if (cau?.dang_chinh && !laDangCho(cau.dang_chinh)) ds.push('kiem-dang')   // đã gán dạng thật
  const coDapSo = (cau?.dap_an ?? '') !== '' || (cau?.loi_giai ?? '') !== '' || (Array.isArray(cau?.menh_de) && cau.menh_de.length > 0)
  if (cau?.nguon_giai === 'ai' && coDapSo) ds.push('kiem-dap-so')           // đáp số/lời giải do AI viết
  if (cau?.hinh_do_may_ve) ds.push('kiem-hinh-a', 'kiem-hinh-b')            // §5.6: A = code, B = model khác
  return ds
}

/**
 * Xét 1 gói. goi = { cau, vet: { lam: { tram, lan_chay, model }, kiem: [ { tram, lan_chay, cach, model?, ket_qua, bam_noi_dung, ghi_chu? } ] } }
 * Trả { duoc_ghi, ly_do[], kiem_may, kiem_may_boi, kiem_may_ghi, bam }.
 */
export function xetGoi(goi) {
  const ly_do = []
  const cau = goi?.cau
  if (!cau || typeof cau !== 'object') return { duoc_ghi: false, ly_do: ['gói không có trường `cau`'], kiem_may: null }
  const bam = bamNoiDung(cau)
  const lam = goi?.vet?.lam
  const dsKiem = Array.isArray(goi?.vet?.kiem) ? goi.vet.kiem : []
  if (!lam?.lan_chay) ly_do.push('thiếu vết của trạm LÀM (vet.lam.lan_chay) — không biết ai làm thì không chứng minh được người kiểm là người khác')

  const canCo = tramBatBuoc(cau)
  const ketQua = []
  for (const tram of canCo) {
    const bb = dsKiem.filter((k) => k?.tram === tram)
    if (bb.length === 0) { ly_do.push(`thiếu biên bản của trạm "${tram}"`); continue }
    for (const k of bb) {
      const ten = `biên bản "${tram}" (lượt ${k.lan_chay ?? '?'})`
      if (!KET_QUA.includes(k.ket_qua)) ly_do.push(`${ten}: ket_qua "${k.ket_qua}" không hợp lệ`)
      if (!CACH_KIEM.includes(k.cach)) ly_do.push(`${ten}: cách kiểm "${k.cach}" không nằm trong danh sách độc lập (${CACH_KIEM.join(' | ')})`)
      if (!k.lan_chay) ly_do.push(`${ten}: thiếu lan_chay`)
      else if (lam?.lan_chay && k.lan_chay === lam.lan_chay) ly_do.push(`${ten}: CÙNG lượt chạy với trạm làm — tự kiểm bài mình không phải kiểm độc lập`)
      if (k.cach === 'model_khac' && lam?.model && k.model && k.model === lam.model) ly_do.push(`${ten}: khai "model_khac" nhưng cùng model với trạm làm (${k.model})`)
      if (k.cach === 'model_khac' && !k.model) ly_do.push(`${ten}: khai "model_khac" nhưng không ghi model nào`)
      if (k.bam_noi_dung !== bam) ly_do.push(`${ten}: kiểm một NỘI DUNG KHÁC với nội dung sắp ghi (băm ${String(k.bam_noi_dung).slice(0, 10)}… ≠ ${bam.slice(0, 10)}…) — câu đã bị sửa sau khi kiểm`)
      ketQua.push(k)
    }
  }
  // Trạm "kiem-hinh-a" phải là code: kiểm hình bằng toạ độ là việc của máy tính, không phải của model
  for (const k of dsKiem) if (k?.tram === 'kiem-hinh-a' && k.cach !== 'code') ly_do.push('biên bản "kiem-hinh-a" phải kiểm bằng code')

  if (ly_do.length) return { duoc_ghi: false, ly_do, kiem_may: null, bam }

  // Suy kiem_may từ biên bản. Một trạm không đạt là cả câu mang cờ nghi.
  const khongDat = ketQua.filter((k) => k.ket_qua === 'khong_dat')
  const khongKiem = ketQua.filter((k) => k.ket_qua === 'khong_kiem_duoc')
  const kiem_may = khongDat.length ? 'nghi' : khongKiem.length ? 'khong_kiem_duoc' : 'khop'
  const moTa = (k) => `${k.tram}=${k.ket_qua}/${k.cach}${k.ghi_chu ? ` (${k.ghi_chu})` : ''}`
  return {
    duoc_ghi: true, ly_do: [], bam, kiem_may,
    kiem_may_boi: 'day_chuyen',
    kiem_may_ghi: ketQua.map(moTa).join(' · '),
    da_duyet: false,
  }
}

async function main() {
  const [lenh, co, tep] = process.argv.slice(2)
  if (lenh !== 'xet' || co !== '--goi' || !tep) {
    console.error('Dùng: node scripts/kho/cong-ghi.mjs xet --goi <goi.json>')
    process.exit(2)
  }
  const kq = xetGoi(JSON.parse(readFileSync(tep, 'utf8')))
  console.log(JSON.stringify(kq, null, 2))
  process.exit(kq.duoc_ghi ? 0 : 3)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main()
