/* Nông Trại BK — CẦU NỐI LƯU THEO TÀI KHOẢN (bước 1 hoàn thiện, 12/10).
   Game chạy NHÚNG trong app HS (iframe cùng origin, ?nhung=1). App giữ phiên đăng nhập + gọi RPC (fn_nt_luu_doc / fn_nt_luu_ghi);
   game KHÔNG biết Supabase, chỉ nói chuyện bằng postMessage:
     game → app : {bk:'nt', loai:'san_sang'}            xin bản lưu của tài khoản
                  {bk:'nt', loai:'luu', state}           đẩy bản lưu mới (đã giãn ≥ 3 giây giữa 2 lần)
     app → game : {bk:'nt', loai:'nap', ok, state|null}  trả bản lưu (state null = tài khoản chưa có)
                  {bk:'nt', loai:'xung_dot'}             thiết bị khác vừa lưu ⇒ NGỪNG ghi, báo em tải lại
   Không nhúng (mở thẳng) hoặc app không trả lời trong 4 giây ⇒ chạy như cũ với localStorage (chế độ thử). */
(function () {
  'use strict';
  const nhung = /[?&]nhung=1/.test(location.search) && window.parent !== window;
  const C = { nhung, dang: false, xungDot: false, onXungDot: null, lech: 0, conLai: null, het: false, onHet: null, onSapHet: null };
  let daBaoSapHet = false;
  // ĐIỂM HỌC TẬP (B3a): game giữ bộ đếm TÍCH LUỸ dem.diemTieu; app gửi tổng đó lên server (fn_nt_dht_dong_bo), server trừ phần chênh vào ví ĐHT.
  //   C.dht = { soDu, daTieu } mới nhất từ app (số dư thật + mốc server đã ghi); C.onDht(d) để game cập nhật s.diem.
  let tongTieu = 0, daGuiTieu = null, daXacNhan = null;
  C.dht = null; C.onDht = null;
  // XU THẬT (B3b): game báo (tháng_k, ra) = xu đã đổi từ EXP trong tháng (tích luỹ); server cắt theo ngày chơi + trần tháng rồi ghi ví BK.
  let xuK = null, xuRa = 0, daGuiXu = null, daXacNhanXu = 0;
  C.xu = null; C.onXu = null;
  // GỌI HÀM SERVER qua app (bạn lớp thật — B4): app có danh sách trắng tên hàm; game chỉ nhận {ok,...} về
  let rpcId = 0; const rpcCho = {};
  C.rpc = function (ten, tham, ms) {
    return new Promise((res) => {
      if (!C.dang) return res({ ok: false, loi: 'khong_online' });
      const id = ++rpcId;
      const t = setTimeout(() => { delete rpcCho[id]; res({ ok: false, loi: 'het_gio' }); }, ms || 10000);
      rpcCho[id] = (d) => { clearTimeout(t); res(d); };
      try { window.parent.postMessage({ bk: 'nt', loai: 'rpc', id, ten, tham: tham || {} }, NGUON); } catch (e) { clearTimeout(t); delete rpcCho[id]; res({ ok: false, loi: 'mang' }); }
    });
  };
  let cho = null, hen = null, moiNhat = null, daGui = 0;
  const NGUON = location.origin;
  addEventListener('message', (e) => {
    if (e.source !== window.parent || e.origin !== NGUON) return;
    const d = e.data; if (!d || d.bk !== 'nt') return;
    if (d.loai === 'nap' && cho) { C.docGio(d); cho(d); cho = null; }
    else if (d.loai === 'gio') C.docGio(d);
    else if (d.loai === 'rpc' && rpcCho[d.id]) { const f = rpcCho[d.id]; delete rpcCho[d.id]; f(d.kq || { ok: false, loi: 'mang' }); }
    else if (d.loai === 'xu') {
      if (d.ok) { daXacNhanXu = Math.max(daXacNhanXu, daGuiXu || 0); C.xu = { daNhan: d.daNhan, tran: d.tran, moiNgay: d.moiNgay, ngayChoi: d.ngayChoi, duocToiNay: d.duocToiNay }; if (C.onXu) C.onXu(C.xu, d.nhanThem || 0); }
      else daGuiXu = null;   // lỗi mạng / lệch tháng: gửi lại ở nhịp sau
    }
    else if (d.loai === 'dht') {
      if (d.ok || d.loi === 'khong_du') { if (d.ok) daXacNhan = d.daTieu; else daGuiTieu = null; C.nhanDht({ soDu: d.soDu, daTieu: d.daTieu }, d.loi); }
      else daGuiTieu = null;   // lỗi mạng: gửi lại ở nhịp sau
    }
    else if (d.loai === 'xung_dot') { C.xungDot = true; C.dang = false; if (C.onXungDot) C.onXungDot(); }
  });
  C.hoi = function (ms) {
    return new Promise((res) => {
      if (!nhung) return res({ ok: false });
      const t = setTimeout(() => { cho = null; res({ ok: false }); }, ms || 4000);
      cho = (d) => { clearTimeout(t); res(d); };
      window.parent.postMessage({ bk: 'nt', loai: 'san_sang' }, NGUON);
    });
  };
  function xa() {
    hen = null; if (!moiNhat) return;
    daGui = Date.now();
    try { window.parent.postMessage({ bk: 'nt', loai: 'luu', state: moiNhat }, NGUON); } catch (e) { /* state không clone được — bỏ lượt này */ }
    moiNhat = null;
  }
  function baoTieu() {
    daGuiTieu = tongTieu;
    try { window.parent.postMessage({ bk: 'nt', loai: 'tieu', tong: tongTieu }, NGUON); } catch (e) { /* bỏ */ }
  }
  function baoXu() {
    daGuiXu = xuRa;
    try { window.parent.postMessage({ bk: 'nt', loai: 'xu', k: xuK, ra: xuRa }, NGUON); } catch (e) { /* bỏ */ }
  }
  C.nhanDht = function (d, loi) {
    C.dht = d;
    if (C.onDht) C.onDht(d, loi);
  };
  C.gui = function (s) {
    if (!C.dang || C.xungDot) return;
    moiNhat = s;
    tongTieu = (s.dem && s.dem.diemTieu) || 0;
    if (s.thang && typeof s.thang.k === 'number') { if (s.thang.k !== xuK) { xuK = s.thang.k; daXacNhanXu = 0; daGuiXu = null; } xuRa = s.thang.ra || 0; }
    if (xuRa > daXacNhanXu && xuRa !== daGuiXu) { xa(); baoXu(); }
    // có chi tiêu mới (hoặc lần đầu) ⇒ đẩy bản lưu NGAY rồi mới báo tiêu (app lưu trước, trừ điểm sau — lỡ rớt giữa chừng thì không mất điểm oan)
    if (tongTieu !== daXacNhan && tongTieu !== daGuiTieu) { xa(); baoTieu(); return; }
    const roi = Date.now() - daGui;
    if (roi >= 3000) xa(); else if (!hen) hen = setTimeout(xa, 3000 - roi);
  };
  C.xa = xa;   // ép đẩy ngay (rời trang)
  // GIỜ THEO SERVER (B2, 12/10): app đưa gio_ms (epoch ms server) ⇒ lệch = server − máy; engine dùng Date.now()+lech thay đồng hồ máy ⇒ đổi giờ máy không tua được ngày.
  C.gioMs = () => Date.now() + C.lech;
  C.docGio = function (d) {
    if (typeof d.dhtSoDu === 'number') C.nhanDht({ soDu: d.dhtSoDu, daTieu: d.dhtDaTieu == null ? null : d.dhtDaTieu });
    if (C.dang && !C.xungDot && tongTieu !== daXacNhan && daGuiTieu === null) baoTieu();
    if (C.dang && !C.xungDot && xuRa > daXacNhanXu && daGuiXu === null) baoXu();   // lần báo trước chưa tới nơi ⇒ gửi lại theo nhịp
    if (typeof d.gioMs === 'number') C.lech = d.gioMs - Date.now();
    if (typeof d.conLaiGiay === 'number' || d.conLaiGiay === null) C.conLai = d.conLaiGiay;
    if (d.het && !C.het) { C.het = true; if (C.onHet) C.onHet(); }
    else if (!d.het && typeof C.conLai === 'number' && C.conLai <= 300 && !daBaoSapHet) { daBaoSapHet = true; if (C.onSapHet) C.onSapHet(C.conLai); }
  };
  C.thoat = function () { try { window.parent.postMessage({ bk: 'nt', loai: 'thoat' }, NGUON); } catch (e) { /* bỏ */ } };
  window.NT_CAU = C;
})();
