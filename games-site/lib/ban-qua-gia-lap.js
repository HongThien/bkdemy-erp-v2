// GIẢ LẬP CÂN ĐẠN — Bắn Quà (spec-game-ban-qua.md §5d). Chỉ nạp khi mở ban-qua.html?gia_lap=1.
// Dùng ĐÚNG vật lý + cách tính điểm của game (đọc window.__bq). Mỗi lượt game reset map ⇒ giả lập 1 phát/map là chính xác.
// Mô hình học sinh: chọn 1 hộp dưới đất để nhắm (cú "chuẩn" không gió), rồi lệch góc/lực theo tay nghề; KHÔNG bù gió (gió −10…10 ngẫu nhiên).
// Chạy: bấm nút "🧪 Giả lập đạn" góc trái dưới (hoặc gõ giaLap() trong console) — ra bảng điểm TB từng loại đạn × 3 tay nghề.
(function () {
  'use strict'
  const TAY = { 'giỏi': [1.5, 2], 'TB': [4, 5], 'kém': [8, 10] } // biên độ lệch [góc°, lực] (phân bố đều ±1,7×)
  function sim(b, D, goc, luc, gio, hop, t0) {
    const a = goc * Math.PI / 180, v = 420 + luc * 12.5, chet = new Set(); let diem = 0, chuan = 0
    const pos = (q, t) => q.bay ? { x: q.x0 + Math.sin((t0 + t) * q.toc + q.pha) * q.bien, y: q.y0 } : { x: q.x, y: q.y }
    function no(x, y, trung, t) {
      for (const q of hop) {
        if (chet.has(q) || (q.bay && q !== trung)) continue
        const p = pos(q, t), nx = Math.min(Math.max(x, p.x - q.w / 2), p.x + q.w / 2), ny = Math.min(Math.max(y, p.y), p.y + q.h), d = Math.hypot(x - nx, y - ny)
        if (d > D.r) continue
        const c = Math.hypot(x - p.x, y - (p.y + Math.min(14, q.h * .12))) <= 18
        let dm = Math.max(1, Math.round(q.diem * D.he * (1 - .6 * d / D.r))); if (c) { dm = Math.round(dm * 1.2); chuan++ }
        diem += dm; chet.add(q)
      }
    }
    let dans = [{ x: b.PHAO.x + Math.cos(a) * 62, y: b.PHAO.y - 30 - Math.sin(a) * 62, vx: Math.cos(a) * v, vy: -Math.sin(a) * v, nay: D.nay || 0, tach: D.tach || 0 }]
    const h = 1 / 240; let t = 0
    for (let k = 0; k < 5000 && dans.length; k++) {
      t += h
      for (let i = dans.length - 1; i >= 0; i--) {
        const d = dans[i], vyT = d.vy; d.vx += gio * 20 * h; d.vy += 1100 * h; d.x += d.vx * h; d.y += d.vy * h
        if (d.tach && vyT < 0 && d.vy >= 0) { dans.splice(i, 1); for (let s = -1; s <= 1; s++) dans.push({ x: d.x, y: d.y, vx: d.vx + s * 150, vy: d.vy - 20, nay: 0, tach: 0 }); continue }
        const cham = b.dac(d.x, d.y); let tr = null
        for (const q of hop) { if (chet.has(q)) continue; const p = pos(q, t); if (d.x > p.x - q.w / 2 && d.x < p.x + q.w / 2 && d.y > p.y && d.y < p.y + q.h) { tr = q; break } }
        if (cham && d.nay > 0 && !tr) { d.nay--; const nxl = b.dac(d.x - 6, d.y - 2) - b.dac(d.x + 6, d.y - 2); d.x -= d.vx * h * 1.5; d.y -= d.vy * h * 1.5; d.vy = -Math.abs(d.vy) * .62; d.vx = d.vx * .8 + nxl * 60; continue }
        if (cham || tr) { dans.splice(i, 1); no(d.x, d.y, tr, t); continue }
        if (d.x < -200 || d.x > b.WW + 200 || d.y > b.WH + 80) dans.splice(i, 1)
      }
    }
    return { diem, chuan }
  }
  function nham(b, q) { // cú nhắm chuẩn vào nơ, không gió
    let best = null
    for (const goc of [55, 62, 70]) for (let luc = 10; luc <= 100; luc += .5) {
      const a = goc * Math.PI / 180, v = 420 + luc * 12.5; let x = b.PHAO.x + Math.cos(a) * 62, y = b.PHAO.y - 30 - Math.sin(a) * 62, vy = -Math.sin(a) * v; const vx = Math.cos(a) * v, h = 1 / 120
      for (let k = 0; k < 3000; k++) { vy += 1100 * h; x += vx * h; y += vy * h; if (vy > 0 && y >= q.y + 8) { const d = Math.abs(x - q.x); if (!best || d < best.d) best = { goc, luc, d }; break } if (b.dac(x, y)) break }
    }
    return best
  }
  window.giaLap = function (soMap = 5, moiMucTieu = 25) {
    const b = window.__bq; if (!b.DS.length) { alert('Bấm "Quay đạn & bắt đầu" rồi "Vào trận" trước'); return }
    const R = {}; for (const id in b.DAN) { R[id] = {}; for (const t in TAY) R[id][t] = [] }
    for (let m = 0; m < soMap; m++) {
      b.vaoTran(); const hop = b.hop.map(q => ({ ...q }))
      const tg = hop.filter(q => !q.bay).sort(() => Math.random() - .5).slice(0, 8).map(q => nham(b, q)).filter(x => x && x.d < 25)
      for (const id in b.DAN) for (const t in TAY) { const [sg, sl] = TAY[t]; for (const n of tg) for (let i = 0; i < moiMucTieu; i++)
        R[id][t].push(sim(b, b.DAN[id], n.goc + (Math.random() * 2 - 1) * sg * 1.7, n.luc + (Math.random() * 2 - 1) * sl * 1.7, Math.round(Math.random() * 20 - 10), hop, Math.random() * 100)) }
    }
    const bang = {}
    for (const id in R) {
      const row = {}; for (const t in TAY) { const a = R[id][t]; row['TB ' + t] = +(a.reduce((s, x) => s + x.diem, 0) / a.length).toFixed(1) }
      const a = R[id]['TB'], d = a.map(x => x.diem).sort((x, y) => x - y)
      row['% trúng'] = Math.round(100 * a.filter(x => x.diem > 0).length / a.length); row['% chính xác'] = Math.round(100 * a.filter(x => x.chuan > 0).length / a.length)
      row['p90'] = d[Math.floor(d.length * .9)]; row['hệ số'] = b.DAN[id].he
      bang[b.DAN[id].ten] = row
    }
    console.table(bang)
    let el = document.getElementById('glKq'); if (!el) { el = document.createElement('pre'); el.id = 'glKq'; el.style.cssText = 'position:fixed;left:10px;top:10px;z-index:9999;background:#fff;color:#1b2250;padding:12px 16px;border-radius:12px;font:13px Consolas,monospace;box-shadow:0 8px 30px rgba(0,0,0,.4);max-width:96vw;overflow:auto;cursor:pointer'; el.title = 'bấm để đóng'; el.onclick = () => el.remove(); document.body.appendChild(el) }
    const cot = Object.keys(Object.values(bang)[0])
    el.textContent = `GIẢ LẬP ${soMap} map × ~8 mục tiêu × ${moiMucTieu} phát / loại đạn / tay nghề (bấm để đóng)\n\n` + ['Đạn'.padEnd(8), ...cot.map(c => c.padStart(12))].join('') + '\n' +
      Object.entries(bang).map(([k, r]) => [k.padEnd(8), ...cot.map(c => String(r[c]).padStart(12))].join('')).join('\n')
    b.ketThuc && null
    return bang
  }
  const gan = () => { const bt = document.createElement('button'); bt.textContent = '🧪 Giả lập đạn'; bt.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9998;font:600 14px Arial;padding:8px 14px;border-radius:999px;border:0;background:#1b2250;color:#fff;cursor:pointer'; bt.onclick = () => { bt.textContent = '⏳ đang chạy…'; setTimeout(() => { window.giaLap(); bt.textContent = '🧪 Giả lập đạn' }, 30) }; document.body.appendChild(bt) }; if (document.readyState === 'complete') gan(); else addEventListener('load', gan)
})()
