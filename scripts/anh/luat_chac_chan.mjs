// ============================================================================
// luat_chac_chan.mjs — LUẬT "CHẮC CHẮN" của kho Tiếng Anh, MỘT nguồn duy nhất cho:
//   cong_ghi_anh.mjs (nhập lô mới) · kiem_lai_anh.mjs (kiểm lại câu đã có trong kho).
//
// Luật (spec-anh-kho.md §2.1, CEO 02/10 "câu chắc chắn đưa thẳng vào kho, chưa chắc chờ duyệt"):
//   ① cấu trúc sạch (trạm đọc không cờ lỗi, có đáp án GV) ② bên A (KHÔNG thấy đáp án) ra đúng đáp án GV
//   ③ bên A không thấy phương án thứ 2 / đề không lỗi ④ A và B độc lập chọn trùng 1 điểm kiến thức, hợp dạng đề
//   ⑤ trong phạm vi (A và B) và B không nghi đáp án GV.
//   + bên A phải kiểm ĐÚNG nội dung đang có (đề + phương án + đoạn văn) — trạm đọc sửa sau khi kiểm thì kết quả cũ không áp.
//   Đủ ⇒ 'chac'. Thiếu ⇒ 'cho' + lý do. A và B CÙNG thấy ngoài phạm vi ⇒ 'bo' (trừ khi ngoaiPhamViChoDuyet).
// CEO 02/10 tối "câu không nghi ngờ thì tự duyệt, không cần duyệt lại": chỉ chặn khi có NGHI về ĐÁP ÁN. Vì vậy
//   · "đề lỗi" của bên A chỉ chặn khi de_loi_cham_dap_an !== false (lỗi chính tả/diễn đạt ngoài đáp án ⇒ chỉ ghi chú);
//     kết quả A cũ không có cờ này ⇒ vẫn chặn (thận trọng).
//   · CHỈ MỘT bên thấy ngoài phạm vi ⇒ ghi chú, không chặn.
//   · A và B lệch điểm kiến thức ⇒ bên C (gán nhãn thứ ba, độc lập) phân xử: trùng A hoặc B (và hợp dạng đề) ⇒ lấy điểm đó.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'

export function env() {
  const e = {}
  for (const f of ['.env', '.env.local']) {
    if (!existsSync(f)) continue
    for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) {
      if (!l.includes('=') || l.trim().startsWith('#')) continue
      const i = l.indexOf('='); e[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
    }
  }
  return e
}

// Vân tay nội dung — bên A đã thấy gì (1 dòng của vao_A_khong_dap_an.json) vs câu hiện tại của trạm đọc
export const vanTayDaThay = (x) => JSON.stringify([x.noi_dung, Object.values(x.lua_chon), x.ngu_lieu?.noi_dung ?? null])
export const vanTayCau = (c, nguLieu) =>
  JSON.stringify([c.noi_dung, c.lua_chon, c.ngu_lieu ? (nguLieu[c.ngu_lieu]?.noi_dung ?? null) : null])

// Điểm kiến thức hợp lệ theo dạng đề (máy kiểm — nhân chứng thứ ba, không dựa AI)
const so = (k) => Number(k.split('-')[1])
export function hopDang(dang, kp) {
  const [p] = kp.split('-')
  switch (dang) {
    case 'phat_am': return p === 'NA' && so(kp) <= 6
    case 'trong_am': return p === 'NA' && so(kp) >= 7
    case 'bien_bao': return kp === 'ĐH-01'
    case 'doc_hieu': return p === 'ĐH' && so(kp) >= 2
    case 'dien_cau_doan': return kp === 'VT-04'
    case 'sap_xep_doan': return kp === 'VT-03' || kp === 'VT-02'
    default: return ['NP', 'TV', 'GT'].includes(p) || kp === 'VT-01' || kp === 'VT-02'
  }
}

// raA/raB: { ref → kết quả }, daThayA: { ref → vanTayDaThay }, nguLieu: { ref → ngữ liệu của trạm đọc }
export function taoQuyetDinh({ raA, raB, raC = {}, daThayA, nguLieu, ngoaiPhamViChoDuyet = false }) {
  return function quyetDinh(c) {
    const a = raA[c.ref], b = raB[c.ref], cc = raC[c.ref]
    const lyDo = [], ghiChu = []
    if (!a || !b) return { loai: 'cho', lyDo: ['thiếu kết quả bên ' + (!a ? 'A' : 'B')], kp: null, deXuat: b?.kp ?? a?.kp ?? null }
    if (a.ngoai_pham_vi && b.ngoai_pham_vi) {
      if (!ngoaiPhamViChoDuyet) return { loai: 'bo', lyDo: ['ngoài phạm vi (A+B): ' + (b.ly_do_pham_vi || a.ly_do_pham_vi || '')] }
      lyDo.push('A+B thấy ngoài phạm vi THCS — giữ câu (bài của unit / câu của đề thi), GV quyết: ' + (b.ly_do_pham_vi || a.ly_do_pham_vi || ''))
    }
    if (daThayA[c.ref] !== vanTayCau(c, nguLieu)) lyDo.push('nội dung đã sửa sau khi kiểm (bên A kiểm trên bản cũ)')
    if (!!a.ngoai_pham_vi !== !!b.ngoai_pham_vi) ghiChu.push('một bên thấy ngoài phạm vi: ' + ((a.ngoai_pham_vi ? a.ly_do_pham_vi : b.ly_do_pham_vi) || ''))
    if (c.loi_cau_truc?.length) lyDo.push('cấu trúc: ' + c.loi_cau_truc.join(', '))
    if (!c.dap_an) lyDo.push('file GV không có đáp án')
    else if (a.dap_an !== c.dap_an) lyDo.push(`bên A ra ${a.dap_an ?? 'không làm được'}, GV ${c.dap_an}`)
    if (a.phuong_an_khac?.length) lyDo.push('bên A thấy cũng đúng: ' + a.phuong_an_khac.join(','))
    if (a.de_loi) (a.de_loi_cham_dap_an === false ? ghiChu : lyDo).push('đề lỗi: ' + a.de_loi)
    if (b.nghi_dap_an) lyDo.push('bên B nghi đáp án GV: ' + (b.ly_do_nghi || ''))
    let kp = null
    // Hai lượt ĐỘC LẬP chọn trùng 1 điểm + máy thấy hợp dạng đề = 2 nhân chứng + 1 luật cứng. Cờ "chắc" tự khai của từng
    // lượt KHÔNG dùng làm điều kiện (đo Unit 1 02/10: 33 câu lệch thì phần lớn là A=B cùng mã nhưng tự khai "chưa chắc").
    if (a.kp && a.kp === b.kp && hopDang(c.dang_de, a.kp)) kp = a.kp
    else if (cc?.kp && (cc.kp === a.kp || cc.kp === b.kp) && hopDang(c.dang_de, cc.kp)) {
      kp = cc.kp; ghiChu.push(`điểm kiến thức theo đa số 2/3 (A ${a.kp} · B ${b.kp} · C ${cc.kp})`)
    } else lyDo.push(`điểm kiến thức chưa thống nhất (A ${a.kp}${a.kp_tin_chac ? '' : '?'} · B ${b.kp}${b.kp_tin_chac ? '' : '?'})`)
    // đề xuất cho GV: ưu tiên điểm hai bên trùng, rồi điểm hợp dạng của B, rồi của A
    const deXuat = kp ?? [b.kp, a.kp].find((k) => k && hopDang(c.dang_de, k)) ?? b.kp ?? a.kp
    return { loai: lyDo.length ? 'cho' : 'chac', lyDo, ghiChu, kp, deXuat }
  }
}

export const ghiChuChac = (a, kp, ghiChu = []) =>
  `Chắc chắn: A (không thấy đáp án) ra ${a.dap_an} = GV; không phương án thứ 2; điểm ${kp}; B không nghi.` +
  (ghiChu.length ? ' Ghi chú: ' + ghiChu.join(' · ') : '')
export const AI_MODEL = 'claude-opus-5-5 (A: giải mù · B: gán nhãn)'
