/* Nông Trại BK — khởi động: nạp mô hình → chụp biểu tượng → nạp tiến độ đã lưu (hoặc tạo mới) → vào game. */
(async function () {
  'use strict';
  const $ = id => document.getElementById(id);
  // chơi màn ngang (CEO 30/09): Android (cài như app / toàn màn hình) khoá được hướng ngang; iPhone/iPad không cho ⇒ màn #xoayMay nhắc
  addEventListener('pointerdown', () => { try { const p = screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'); if (p && p.catch) p.catch(() => {}); } catch (e) {} }, { once: true });
  try {
    await NT_MODELS.tai(p => { $('taiDay').style.width = (p * 80) + '%'; });
    $('taiChu').textContent = 'Đang vẽ biểu tượng…';
    await new Promise(r => setTimeout(r, 30));
    const D = NT_DATA;
    NT_MODELS.taoIcon([...Object.keys(D.I), 'xu', 'xp', 'diem', 'vat_ga', 'vat_bo', 'lo_banh', 'sap', 'ruong', 'kho_barn', 'thu_meo', 'thu_chim']);
    $('taiDay').style.width = '100%';
    const s = NT_ENGINE.nap() || NT_ENGINE.moi();
    NT_UI.batDau(s);
    setTimeout(() => $('manTai').classList.add('xong'), 150);
  } catch (e) {
    console.error(e);
    $('taiChu').textContent = 'Lỗi khi dựng nông trại: ' + (e && e.message || e);
  }
})();
