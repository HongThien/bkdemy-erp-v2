/* BẢNG LỚP trên TV — CHẾ ĐỘ 1 "TV riêng" của game bản buổi học (spec-game-buoi-hoc §5d, Thùy 28/09).
   TV riêng chiếu game + bảng cả lớp suốt buổi để HS thi đua; GV làm việc trên ERP ở máy tính.
   Trang game không đăng nhập ⇒ không đọc DB: ERP gửi bảng qua kênh bk-lop:<buổi>, event 'ds':
     { game, so_co_mat, so_da_choi, hs:[{ten, giai:1|2|3, exp:number|null, qua:string|null}] }
   Chống lộ kết quả: game gọi BKLopBang.cho(ten) khi NHẬN lệnh mở ⇒ dòng đó hiện "🎁 đang mở…" dù ERP đã gửi +EXP;
   game diễn xong gọi BKLopBang.xong(ten) ⇒ mới hiện số. Chế độ 2 (nhúng trong ERP, ?nhung=1) KHÔNG nạp file này.
   Có #side (Chiếm Đất) ⇒ chèn lên đầu cột đó; không có (Mở Rương) ⇒ cột cố định bên phải + thu #stage lại rồi báo resize. */
(function () {
  const W = 360
  let box = null, ds = null
  const cho = new Set(), vuaXong = { ten: null, t: 0 }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const GIAI = { 1: ['🥇 Nhất', 'linear-gradient(90deg,#f5c542,#c98a12)'], 2: ['🥈 Nhì', 'linear-gradient(90deg,#d7dde8,#8a94a8)'], 3: ['🎖 Giải 3', 'linear-gradient(90deg,#f0a868,#a85a1c)'] }

  function dung() {
    if (box) return box
    const css = document.createElement('style')
    css.textContent = `
#lopBang{font-family:"Segoe UI",system-ui,sans-serif;color:#fff}
#lopBang.lb-fixed{position:absolute;top:64px;right:0;bottom:0;width:${W}px;overflow:auto;padding:12px;background:rgba(11,18,48,.88);border-left:1px solid rgba(255,255,255,.12);z-index:6}
#lopBang.lb-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px}
#lopBang .lb-h{display:flex;align-items:center;gap:8px;margin-bottom:8px}
#lopBang .lb-t{font-size:20px;font-weight:900}
#lopBang .lb-n{margin-left:auto;font-size:14px;background:rgba(255,255,255,.12);border-radius:8px;padding:2px 8px}
#lopBang .lb-g{display:inline-block;margin:8px 0 4px;padding:3px 10px;border-radius:9px;font-weight:900;font-size:15px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4)}
#lopBang .lb-r{display:flex;align-items:center;gap:8px;padding:6px 10px;margin:4px 0;border-radius:10px;background:rgba(255,255,255,.05)}
#lopBang .lb-r.da{background:rgba(94,224,138,.14)}
#lopBang .lb-r.moi{animation:lbMoi 1.2s ease-out 3;box-shadow:0 0 0 2px #5ee08a}
#lopBang .lb-ten{flex:1;min-width:0;font-size:18px;font-weight:700;line-height:1.2;word-break:break-word}
#lopBang .lb-exp{font-size:20px;font-weight:900;color:#7dffab;font-variant-numeric:tabular-nums}
#lopBang .lb-cho{font-size:14px;color:rgba(255,255,255,.45)}
#lopBang .lb-dang{font-size:15px;font-weight:800;color:#ffd166}
@keyframes lbMoi{0%{transform:scale(1.04)}100%{transform:scale(1)}}`
    document.head.appendChild(css)
    box = document.createElement('div'); box.id = 'lopBang'
    const side = document.getElementById('side')
    if (side) { box.className = 'lb-card'; side.insertBefore(box, side.firstChild) }
    else {
      box.className = 'lb-fixed'; document.body.appendChild(box)
      const st = document.getElementById('stage'); if (st) { st.style.right = W + 'px'; dispatchEvent(new Event('resize')) }
    }
    return box
  }

  function ve() {
    if (!ds) return
    const b = dung(), hs = ds.hs || []
    const soMo = hs.filter((h) => h.exp != null && !cho.has(h.ten)).length
    let h = `<div class="lb-h"><span class="lb-t">🏆 Bảng lớp</span><span class="lb-n">${soMo}/${ds.so_co_mat ?? hs.length} đã mở</span></div>`
    for (const g of [1, 2, 3]) {
      const ds3 = hs.filter((x) => x.giai === g)
      if (!ds3.length) continue
      // trong mỗi giải: ai đã mở xếp trên, EXP cao trước ⇒ nhìn là so được
      ds3.sort((a, b) => ((b.exp != null && !cho.has(b.ten)) - (a.exp != null && !cho.has(a.ten))) || ((b.exp || 0) - (a.exp || 0)) || String(a.ten).localeCompare(String(b.ten), 'vi'))
      h += `<div class="lb-g" style="background:${GIAI[g][1]}">${GIAI[g][0]}</div>`
      for (const x of ds3) {
        const dang = cho.has(x.ten), da = x.exp != null && !dang
        const moi = da && vuaXong.ten === x.ten && Date.now() - vuaXong.t < 4000
        h += `<div class="lb-r${da ? ' da' : ''}${moi ? ' moi' : ''}"><span class="lb-ten">${esc(x.ten)}</span>` +
          (dang ? '<span class="lb-dang">🎁 đang mở…</span>' : da ? `${x.qua ? '<span title="quà đặc biệt">🧋</span>' : ''}<span class="lb-exp">+${x.exp}</span>` : '<span class="lb-cho">chờ</span>') + '</div>'
      }
    }
    b.innerHTML = h
  }

  window.BKLopBang = {
    cap(p) { if (p && Array.isArray(p.hs)) { ds = p; ve() } }, // ERP gửi bảng mới
    cho(ten) { if (ten) { cho.add(ten); ve() } },               // game vừa nhận lệnh mở cho bạn này
    xong(ten) { if (ten && cho.delete(ten)) { vuaXong.ten = ten; vuaXong.t = Date.now(); ve() } }, // game diễn xong
  }
})()
