// chia.mjs — chia nguồn SÁCH (đã ra .txt) chương Giới hạn K11 thành các ĐƠN VỊ ≤ ~62 KB cho từng trạm soạn.
//   node kho-rules/dai/lo/k11/sach-gioi-han/chia.mjs
// Nguồn (ngoài repo): bdm/k11/nguon-gh (PNL ×3 GV · Từ Tâm P3-GHÉP-GV ×3 — P3 = P1 ví dụ + P2 bài tập có lời giải, nên BỎ P1/P2) · bdm/k11/nguon-nbv-gh/txt (NBV: bản có đáp án; bỏ tệp "_-_CH" = bản chỉ câu hỏi).
// Ra: bdm/k11/sach-gh/don-vi/<id>.txt + don-vi.json. Cắt ở dòng mở Dạng / Bài / Câu gần mốc, không cắt giữa một bài.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
const LV = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k11/'
const RA = LV + 'sach-gh/don-vi/'
mkdirSync(RA, { recursive: true })
const MAX = 62000
const mo = /^(\[\[b\]\])?(\[\[mau:[0-9A-F]+\]\])?(\[\[sym:[^\]]+\]\])?\s*(» )?(Dạng|DẠNG|Câu|Bài|BÀI|Ví dụ|VÍ DỤ|PHẦN|Phần|[A-F]\. )/
const don = []
function chia(id, sach, tep, nhan) {
  const lines = readFileSync(tep, 'utf8').replace(/\r\n/g, '\n').split('\n')
  const tong = lines.join('\n').length
  const k = Math.max(1, Math.ceil(tong / MAX))
  const cut = [0]
  if (k > 1) {
    let acc = 0, mocTiep = tong / k, n = 1
    lines.forEach((l, i) => {
      acc += l.length + 1
      if (n < k && acc >= mocTiep * n && mo.test(l) && i - cut[cut.length - 1] > 30) { cut.push(i); n++ }
    })
  }
  cut.push(lines.length)
  for (let p = 0; p < cut.length - 1; p++) {
    const tenDv = cut.length > 2 ? `${id}-p${p + 1}` : id
    const thanChu = lines.slice(cut[p], cut[p + 1]).join('\n')
    writeFileSync(RA + tenDv + '.txt', `# NGUỒN: ${sach} — ${nhan}${cut.length > 2 ? ` (phần ${p + 1}/${cut.length - 1}: câu / dạng bắt đầu trong phần này là của bạn; đuôi đầu phần có thể là của phần trước)` : ''}\n\n` + thanChu)
    don.push({ id: tenDv, sach, nhan, tep, kich_thuoc: thanChu.length, phan: cut.length > 2 ? `${p + 1}/${cut.length - 1}` : '1/1' })
  }
}
const g = LV + 'nguon-gh/'
for (const [id, f, nhan] of [['pnl-b1', 'pnl-b1__B_i_01_Gi_i_h_n_c_a_d_y_s__GV.txt', 'Bài 1 Giới hạn của dãy số'], ['pnl-b2', 'pnl-b2__B_i_02_Gi_i_h_n_c_a_h_m_s__GV.txt', 'Bài 2 Giới hạn của hàm số'], ['pnl-b3', 'pnl-b3__B_i_03_H_m_s_li_n_t_c_GV.txt', 'Bài 3 Hàm số liên tục']]) chia(id, 'PNL', g + f, nhan)
for (const [id, f, nhan] of [['tt-b1', 'tt__C3-B1-GI_I_H_N_D_Y_S_-P3-GH_P_GV.txt', 'C3-B1 Giới hạn dãy số'], ['tt-b2', 'tt__C3-B2-GI_I_H_N_H_M_S_-P3-GH_P_GV.txt', 'C3-B2 Giới hạn hàm số'], ['tt-b3', 'tt__C3-B3-H_M_S_LI_N_T_C-P3-GH_P_GV.txt', 'C3-B3 Hàm số liên tục']]) chia(id, 'Từ Tâm', g + f, nhan)
const n = LV + 'nguon-nbv-gh/txt/'
const ten = { '11_18': ['b1', 'Giới hạn dãy số'], '11_19': ['b2', 'Giới hạn hàm số'], '11_20': ['b3', 'Hàm số liên tục'] }
const ds = readdirSync(n).filter((f) => f.endsWith('.txt') && !/_-_CH\.txt$/.test(f))
for (const f of ds) {
  const m = f.match(/^nbv__(11_\d\d)__.+?__([A-F])__/)
  if (m && ten[m[1]]) { if (m[2] === 'A') continue; chia(`nbv-${ten[m[1]][0]}-${m[2].toLowerCase()}`, 'NBV', n + f, `${ten[m[1]][1]} — phần ${m[2]}`) }
  else if (/ON_TAP_CHUONG_GIOI_HAN__DE_SO_(\d)/.test(f)) chia(`nbv-ot-d${f.match(/DE_SO_(\d)/)[1]}`, 'NBV', n + f, `Ôn tập chương Giới hạn — Đề số ${f.match(/DE_SO_(\d)/)[1]}`)
}
writeFileSync(LV + 'sach-gh/don-vi.json', JSON.stringify(don, null, 1))
console.log(don.length, 'đơn vị ·', (don.reduce((s, x) => s + x.kich_thuoc, 0) / 1e6).toFixed(2), 'MB')
for (const x of don) console.log(' ', x.id.padEnd(14), String(x.kich_thuoc).padStart(6), x.sach, '·', x.nhan, x.phan === '1/1' ? '' : `(${x.phan})`)
