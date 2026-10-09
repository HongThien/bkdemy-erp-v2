// SƠ ĐỒ CHUYỂN ĐỘNG (tiểu học) — máy vẽ SVG từ MÔ TẢ CÓ CẤU TRÚC, AI không vẽ điểm ảnh. CEO 09/10: "vẽ được sơ đồ minh hoạ là chuẩn,
// bài chuyển động rất cần". Gọi qua so-do-doan-thang.mjs khi mô tả có "loai": "chuyen_dong" (một lối vào cho ghi-lo / lo-tu-soan / ve-lai).
//   node scripts/kho/so-do-doan-thang.mjs mo-ta.json --out so-do.svg
//
// Mô tả (JSON) — mọi vị trí là SỐ THẬT trên quãng đường (km hoặc m, cùng một đơn vị trong một sơ đồ):
// {
//   "loai": "chuyen_dong",
//   "tieu_de": "Lúc 7 giờ",                                       // tuỳ chọn
//   "diem":   [ { "ten": "A", "x": 0 }, { "ten": "C", "x": 108, "ghi": "gặp nhau" }, { "ten": "B", "x": 240 } ],
//   "di":     [ { "tu": 0, "den": 108, "nhan": "45 km/giờ" },       // mũi tên PHÍA TRÊN đường: xe đi từ tu → den (chiều theo dấu)
//               { "tu": 240, "den": 108, "nhan": "55 km/giờ" } ],   // mũi tên tự xếp tầng để không đè nhau
//   "khoang": [ { "tu": 0, "den": 240, "nhan": "240 km" },          // khoảng cách PHÍA DƯỚI đường (vạch hai đầu + nhãn)
//               { "tu": 0, "den": 108, "nhan": "? km" } ],          // nhãn có "?" ⇒ không kiểm
//   "vat":    [ { "tu": 0, "den": 800, "nhan": "Cầu 800 m", "kieu": "cau" },   // đoạn ĐẬM trên đường: cầu, đoàn tàu, đường hầm…
//               { "tu": -200, "den": 0, "nhan": "Xe lửa", "kieu": "tau" } ]
// }
// ⭐ ĐÚNG TỈ LỆ + MÁY TỰ KIỂM: điểm đặt theo x thật; nhãn khoảng BẮT ĐẦU bằng số (vd "240 km", "0,8 km" khi đơn vị là km) phải bằng |den − tu|,
// lệch ⇒ TỪ CHỐI VẼ. Điểm/mũi tên/khoảng phải nằm trong phạm vi các điểm đã khai báo.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const soDau = (s) => { const k = String(s ?? '').replace(/\s/g, '').match(/^\d+(,\d+)?/); return k ? Number(k[0].replace(',', '.')) : null }
const bang = (a, b) => Math.abs(a - b) < 1e-9
const r1 = (x) => Math.round(x * 10) / 10

export function veChuyenDong(m) {
  const diem = m.diem || [], di = m.di || [], khoang = m.khoang || [], vat = m.vat || []
  if (!diem.length) throw new Error('chuyển động: cần ít nhất 1 điểm')
  const xs = [...diem.map((d) => d.x), ...vat.flatMap((v) => [v.tu, v.den])]
  const lo = Math.min(...xs), hi = Math.max(...xs)
  if (!(hi > lo)) throw new Error('chuyển động: các điểm trùng nhau')
  for (const k of khoang) {
    if (/\?/.test(k.nhan)) continue
    const so = soDau(k.nhan)
    if (so == null) continue   // nhãn chữ ("đi trong 50 giây") — chỉ vẽ; nhãn BẮT ĐẦU bằng số mới kiểm
    if (!bang(so, Math.abs(k.den - k.tu))) throw new Error(`Sơ đồ SAI SỐ LIỆU: khoảng "${k.nhan}" nhưng hai đầu cách nhau ${r1(Math.abs(k.den - k.tu))}`)
  }
  for (const a of [...di, ...khoang]) for (const x of [a.tu, a.den]) if (x < lo - 1e-9 || x > hi + 1e-9) throw new Error(`vị trí ${x} nằm ngoài sơ đồ [${lo}; ${hi}]`)

  const L = 40, W0 = 600, sx = (x) => r1(L + (x - lo) / (hi - lo) * W0)
  // xếp tầng mũi tên (phía trên) và khoảng (phía dưới): mỗi tầng không có hai đoạn chồng nhau
  const xepTang = (ds) => { const tang = []; return ds.map((a) => { const [p, q] = [Math.min(a.tu, a.den), Math.max(a.tu, a.den)]; let t = 0; while ((tang[t] || []).some(([u, v]) => p < v - 1e-9 && q > u + 1e-9)) t++; (tang[t] ||= []).push([p, q]); return t }) }
  const tDi = xepTang(di), tKh = xepTang(khoang)
  const nDi = di.length ? Math.max(...tDi) + 1 : 0, nKh = khoang.length ? Math.max(...tKh) + 1 : 0
  const TOP = (m.tieu_de ? 30 : 8) + nDi * 30 + (vat.length ? 18 : 0) + 10
  const Y = TOP + 6                                   // đường thẳng chính
  const coGhi = diem.some((d) => d.ghi)               // chú thích điểm nằm DÒNG DƯỚI tên (đặt cạnh tên thì điểm ở mép phải bị cắt chữ)
  const KH0 = Y + 36 + (coGhi ? 14 : 0)               // tầng khoảng đầu tiên
  const H = KH0 - 2 + nKh * 30 + 6
  const W = L + W0 + 40
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial, Helvetica, sans-serif" font-size="14">`,
    `<rect width="${W}" height="${H}" fill="#fff"/>`,
    '<defs><marker id="mt" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#b45309"/></marker></defs>']
  if (m.tieu_de) out.push(`<text x="${L}" y="20" font-style="italic" fill="#334155">${esc(m.tieu_de)}</text>`)
  // đường chính
  out.push(`<line x1="${sx(lo)}" y1="${Y}" x2="${sx(hi)}" y2="${Y}" stroke="#0f172a" stroke-width="2"/>`)
  // vật có chiều dài (cầu, tàu): thanh đậm ngay trên đường
  for (const v of vat) {
    const x1 = sx(Math.min(v.tu, v.den)), x2 = sx(Math.max(v.tu, v.den))
    const mau = v.kieu === 'tau' ? '#2563eb' : '#64748b'
    out.push(`<rect x="${x1}" y="${Y - 7}" width="${r1(x2 - x1)}" height="7" fill="${mau}" opacity="0.85"/>`)
    if (v.nhan) out.push(`<text x="${r1((x1 + x2) / 2)}" y="${Y - 12}" text-anchor="middle" font-size="12" fill="${mau}">${esc(v.nhan)}</text>`)
  }
  // điểm: vạch + tên dưới đường
  for (const d of diem) {
    const x = sx(d.x)
    out.push(`<line x1="${x}" y1="${Y - 6}" x2="${x}" y2="${Y + 6}" stroke="#0f172a" stroke-width="2"/>`)
    out.push(`<circle cx="${x}" cy="${Y}" r="3" fill="#0f172a"/>`)
    out.push(`<text x="${x}" y="${Y + 22}" text-anchor="middle" font-weight="bold" fill="#0f172a">${esc(d.ten)}</text>`)
    if (d.ghi) {
      const neo = d.x === hi ? 'end' : d.x === lo ? 'start' : 'middle'   // điểm ở mép thì chữ chạy vào trong, không tràn ra ngoài khung
      out.push(`<text x="${x}" y="${Y + 36}" text-anchor="${neo}" font-size="11" fill="#475569">(${esc(d.ghi)})</text>`)
    }
  }
  // mũi tên đi (trên)
  di.forEach((a, i) => {
    const y = Y - (vat.length ? 18 : 0) - 16 - tDi[i] * 30
    const x1 = sx(a.tu), x2 = sx(a.den)
    out.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#b45309" stroke-width="2" marker-end="url(#mt)"/>`)
    out.push(`<line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#b45309" stroke-width="2"/>`)
    if (a.nhan) out.push(`<text x="${r1((x1 + x2) / 2)}" y="${y - 6}" text-anchor="middle" font-size="12" fill="#b45309">${esc(a.nhan)}</text>`)
  })
  // khoảng (dưới)
  khoang.forEach((k, i) => {
    const y = KH0 + tKh[i] * 30
    const x1 = sx(Math.min(k.tu, k.den)), x2 = sx(Math.max(k.tu, k.den))
    out.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<text x="${r1((x1 + x2) / 2)}" y="${y + 15}" text-anchor="middle" font-size="12" fill="${/\?/.test(k.nhan) ? '#dc2626' : '#0f172a'}">${esc(k.nhan)}</text>`)
  })
  out.push('</svg>')
  return out.join('\n')
}
