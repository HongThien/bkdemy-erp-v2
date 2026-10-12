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
    // Lưu THEO TÀI KHOẢN (js/cau.js): nhúng trong app HS ⇒ xin bản lưu của tài khoản; chưa có ⇒ nhận bản trên máy MỘT lần (chuyển sang server) rồi chỉ dùng server.
    let s = null, tuServer = false;
    if (window.NT_CAU && NT_CAU.nhung) {
      const kq = await NT_CAU.hoi(4000);
      if (kq && kq.ok) { tuServer = true; NT_CAU.dang = true; s = kq.state ? NT_ENGINE.chuanHoa(kq.state) : NT_ENGINE.nap(); }   // giờ server đã nạp trong NT_CAU.docGio
      NT_CAU.onXungDot = () => {
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font:600 18px system-ui;text-align:center;padding:24px';
        d.innerHTML = '<div>Nông trại của em vừa được lưu từ thiết bị khác.</div><div style="font-weight:400;font-size:15px;opacity:.85">Để không ghi đè mất tiến độ, em tải lại rồi chơi tiếp nhé.</div><button style="padding:12px 22px;border-radius:12px;border:0;font:700 17px system-ui;background:#ffd24a;color:#3a2a00">Tải lại</button>';
        d.querySelector('button').onclick = () => location.reload();
        document.body.appendChild(d);
      };
    }
    if (!s) s = (tuServer ? null : NT_ENGINE.nap()) || NT_ENGINE.moi();
    NT_UI.batDau(s);
    if (tuServer) {
      // ĐIỂM HỌC TẬP THẬT: s.diem do app cấp (số dư ĐHT − phần tiêu chưa ghi). Đã bỏ nút giả lập ⏭/📘 của bản thử.
      let daNoiThieu = false;
      NT_CAU.onDht = (d, loi) => {
        NT_ENGINE.datDiem(s, d.soDu, d.daTieu); NT_UI.capHud();
        if (loi === 'khong_du' && !daNoiThieu) { daNoiThieu = true; NT_UI.thongBao('📘 Điểm học tập không đủ cho khoản vừa mua — em làm thêm bài trên app nhé'); }
      };
      NT_CAU.onXu = (x, them) => { if (them > 0) { try { NT_UI.thongBao('💰 +' + them + ' xu đã vào ví BK của em!'); } catch (e) {} } };
      if (NT_CAU.dht) NT_ENGINE.datDiem(s, NT_CAU.dht.soDu, NT_CAU.dht.daTieu);
      NT_UI.capHud();
      NT_UI.cheDoTaiKhoan();
      NT_CAU.gui(s);
      // GIỚI HẠN GIỜ CHƠI mỗi ngày (B2): hết giờ ⇒ chặn màn; sắp hết (≤ 5 phút) ⇒ nhắc 1 lần.
      NT_CAU.onSapHet = (giay) => { try { NT_UI.thongBao('⏳ Còn ' + Math.max(1, Math.ceil(giay / 60)) + ' phút chơi hôm nay'); } catch (e) {} };
      NT_CAU.onHet = () => {
        if (document.getElementById('ntHetGio')) return;
        NT_CAU.xa();
        const d = document.createElement('div'); d.id = 'ntHetGio';
        d.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(10,20,10,.88);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font:600 19px system-ui;text-align:center;padding:24px';
        d.innerHTML = '<div style="font-size:44px">🌙</div><div>Hết giờ chơi hôm nay rồi!</div><div style="font-weight:400;font-size:15px;opacity:.85">Nông trại của em vẫn được giữ nguyên. Mai quay lại chăm nhé.</div><button style="padding:12px 22px;border-radius:12px;border:0;font:700 17px system-ui;background:#ffd24a;color:#3a2a00">Về</button>';
        d.querySelector('button').onclick = () => NT_CAU.thoat();
        document.body.appendChild(d);
      };
      if (NT_CAU.het && NT_CAU.onHet) NT_CAU.onHet();   // mở lại khi đã hết giờ từ trước
    }   // tài khoản chưa có bản lưu ⇒ tạo ngay (kể cả bản chuyển từ máy)
    setTimeout(() => $('manTai').classList.add('xong'), 150);
  } catch (e) {
    console.error(e);
    $('taiChu').textContent = 'Lỗi khi dựng nông trại: ' + (e && e.message || e);
  }
})();
