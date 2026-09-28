// GIẢ LẬP CÂN ĐẠN — Bắn Quà (spec-game-ban-qua.md §5d–5e). Chỉ nạp khi mở ban-qua.html?gia_lap=1.
// Chạy CHÍNH bộ máy đạn của game (window.__bq.engine: taoPhien/phatMoi/buocPhien) — KHÔNG có bản vật lý/điểm thứ hai ở đây.
// Mỗi lượt game reset map ⇒ giả lập 1 phát/map là chính xác. Cừu: không ai bấm Space (tự nổ khi chạm hộp hoặc sau 3s).
// Mô hình học sinh: chọn 1 hộp dưới đất để nhắm (cú "chuẩn" không gió), lệch góc/lực theo tay nghề; KHÔNG bù gió (gió −10…10).
//   giaLap(soMap, moiMucTieu)  → bảng điểm TB từng đạn × 3 tay nghề (+ nút 🧪 góc trái dưới)
//   canBang(vong)              → tự chỉnh he từng đạn cho điểm TB (tay nghề TB) NGANG NHAU, in ra he đề xuất để chép vào DAN
(function () {
  'use strict'
  const TAY = { 'giỏi': [1.5, 2], 'TB': [4, 5], 'kém': [8, 10] } // biên độ lệch [góc°, lực] (phân bố đều ±1,7×)
  const b = () => window.__bq
  function motPhat(D, id, goc, luc, gio, hop, t0) {
    const B = b(), E = B.engine
    const env = { dac: B.dac, hop, gio, khoet: null, bamNo: () => false,
      pos: (q, t) => q.bay ? { x: q.x0 + Math.sin((t0 + t) * q.toc + q.pha) * q.bien, y: q.y0 } : { x: q.x, y: q.y } }
    const P = E.taoPhien(env), a = goc * Math.PI / 180, v = 420 + luc * 12.5
    P.dans.push(E.phatMoi(D, id, B.PHAO.x + Math.cos(a) * 62, B.PHAO.y - 30 - Math.sin(a) * 62, Math.cos(a) * v, -Math.sin(a) * v))
    for (let k = 0; k < 240 * 12 && P.dans.length; k++) { E.buocPhien(P, 1 / 240); P.ev.length = 0 }
    return { diem: P.diem, chuan: P.daChuan }
  }
  function nham(q) { // cú nhắm chuẩn vào nơ, không gió (bay thuần, không cần bộ máy)
    const B = b(); let best = null
    for (const goc of [55, 62, 70]) for (let luc = 10; luc <= 100; luc += .5) {
      const a = goc * Math.PI / 180, v = 420 + luc * 12.5; let x = B.PHAO.x + Math.cos(a) * 62, y = B.PHAO.y - 30 - Math.sin(a) * 62, vy = -Math.sin(a) * v; const vx = Math.cos(a) * v, h = 1 / 120
      for (let k = 0; k < 3000; k++) { vy += 1100 * h; x += vx * h; y += vy * h; if (vy > 0 && y >= q.y + 8) { const d = Math.abs(x - q.x); if (!best || d < best.d) best = { goc, luc, d }; break } if (B.dac(x, y)) break }
    }
    return best
  }
  function chay(soMap, moiMucTieu, chiTay) {
    const B = b(); if (!B.DS.length) throw new Error('Bấm "Quay đạn & bắt đầu" rồi "Vào trận" trước')
    const ids = Object.keys(B.QUAY[1]), R = {}; for (const id of ids) { R[id] = {}; for (const t in TAY) R[id][t] = [] }
    for (let m = 0; m < soMap; m++) {
      B.vaoTran(); const hop = B.hop.map(q => ({ ...q }))
      const tg = hop.filter(q => !q.bay).sort(() => Math.random() - .5).slice(0, 8).map(nham).filter(x => x && x.d < 25)
      for (const id of ids) for (const t in TAY) { if (chiTay && t !== chiTay) continue; const [sg, sl] = TAY[t]
        for (const n of tg) for (let i = 0; i < moiMucTieu; i++)
          R[id][t].push(motPhat(B.DAN[id], id, n.goc + (Math.random() * 2 - 1) * sg * 1.7, n.luc + (Math.random() * 2 - 1) * sl * 1.7, Math.round(Math.random() * 20 - 10), hop, Math.random() * 100)) }
    }
    return R
  }
  const tb = a => a.length ? a.reduce((s, x) => s + x.diem, 0) / a.length : 0
  function hien(tieuDe, bang) {
    console.log(tieuDe); console.table(bang)
    let el = document.getElementById('glKq'); if (!el) { el = document.createElement('pre'); el.id = 'glKq'; el.style.cssText = 'position:fixed;left:10px;top:10px;z-index:9999;background:#fff;color:#1b2250;padding:12px 16px;border-radius:12px;font:13px Consolas,monospace;box-shadow:0 8px 30px rgba(0,0,0,.4);max-width:96vw;max-height:90vh;overflow:auto;cursor:pointer'; el.title = 'bấm để đóng'; el.onclick = () => el.remove(); document.body.appendChild(el) }
    const cot = Object.keys(Object.values(bang)[0])
    el.textContent = tieuDe + ' (bấm để đóng)\n\n' + ['Đạn'.padEnd(10), ...cot.map(c => c.padStart(12))].join('') + '\n' +
      Object.entries(bang).map(([k, r]) => [k.padEnd(10), ...cot.map(c => String(r[c]).padStart(12))].join('')).join('\n')
  }
  window.giaLap = function (soMap = 6, moiMucTieu = 20) {
    const B = b(), R = chay(soMap, moiMucTieu), bang = {}
    for (const id in R) {
      const row = {}; for (const t in TAY) row['TB ' + t] = +tb(R[id][t]).toFixed(1)
      const a = R[id]['TB'], d = a.map(x => x.diem).sort((x, y) => x - y)
      row['% trúng'] = Math.round(100 * a.filter(x => x.diem > 0).length / a.length); row['% chính xác'] = Math.round(100 * a.filter(x => x.chuan).length / a.length)
      row['p90'] = d[Math.floor(d.length * .9)]; row['max'] = d[d.length - 1]; row['hệ số'] = B.DAN[id].he
      bang[B.DAN[id].ic + ' ' + B.DAN[id].ten] = row
    }
    hien(`GIẢ LẬP ${soMap} map × ~8 mục tiêu × ${moiMucTieu} phát / đạn / tay nghề`, bang); return bang
  }
  // Tự cân: đích = điểm TB (tay nghề TB) của đạn Thường; he_mới = he × đích / TB_đạn (điểm tỉ lệ thuận với he). Lặp vài vòng cho khử nhiễu.
  window.canBang = function (vong = 3, soMap = 6, moiMucTieu = 20) {
    const B = b(); let R
    for (let v = 0; v < vong; v++) {
      R = chay(soMap, moiMucTieu, 'TB'); const dich = tb(R.thuong['TB'])
      for (const id in R) { if (id === 'thuong') continue; const x = tb(R[id]['TB']); if (x > 0) B.DAN[id].he = +(B.DAN[id].he * dich / x).toFixed(2) }
    }
    const kq = {}; for (const id in R) kq[id] = B.DAN[id].he
    console.log('he ĐỀ XUẤT (chép vào DAN trong ban-qua.html):', JSON.stringify(kq)); return kq
  }
  const gan = () => { const bt = document.createElement('button'); bt.textContent = '🧪 Giả lập đạn'; bt.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9998;font:600 14px Arial;padding:8px 14px;border-radius:999px;border:0;background:#1b2250;color:#fff;cursor:pointer'; bt.onclick = () => { bt.textContent = '⏳ đang chạy…'; setTimeout(() => { try { window.giaLap() } catch (e) { alert(e.message) } bt.textContent = '🧪 Giả lập đạn' }, 30) }; document.body.appendChild(bt) }
  if (document.readyState === 'complete') gan(); else addEventListener('load', gan)
})()
