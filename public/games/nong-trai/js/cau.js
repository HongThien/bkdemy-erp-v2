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
  const C = { nhung, dang: false, xungDot: false, onXungDot: null };
  let cho = null, hen = null, moiNhat = null, daGui = 0;
  const NGUON = location.origin;
  addEventListener('message', (e) => {
    if (e.source !== window.parent || e.origin !== NGUON) return;
    const d = e.data; if (!d || d.bk !== 'nt') return;
    if (d.loai === 'nap' && cho) { cho(d); cho = null; }
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
  C.gui = function (s) {
    if (!C.dang || C.xungDot) return;
    moiNhat = s;
    const roi = Date.now() - daGui;
    if (roi >= 3000) xa(); else if (!hen) hen = setTimeout(xa, 3000 - roi);
  };
  C.xa = xa;   // ép đẩy ngay (rời trang)
  window.NT_CAU = C;
})();
