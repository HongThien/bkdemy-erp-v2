// Đầu phiếu KIỂU BK (mockup BK Academy) — DÙNG CHUNG cho ET (ETPrintView) lẫn BTVN (PrintView). Mọi class
// prefix `pv-bkh`, không đụng chrome in chung. CSS gồm cả phần "đậm border" (trước ở ET_CSS_BK) — nướng sẵn
// vào đây để 1 nguồn. @page{margin-top} do TỪNG caller thêm khi bật BK (đã bỏ dải header trên cùng).
export const BK_CSS = `
.pv-bkh{--navy:#24324b;--blue:#4c6fff;--blue-soft:#eef2ff;--gold:#c89b52;--muted:#6f7890;--line:#c9d2e0;position:relative;overflow:hidden;border:1.5px solid #c2cbdb;border-radius:20px;background:#fff;color:#172033;margin-bottom:14px;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pv-bkh::before{content:"";position:absolute;inset:0 0 auto 0;height:6px;background:linear-gradient(90deg,var(--blue),#7966e8 48%,var(--gold))}
.pv-bkh-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:18px 22px 12px}
.pv-bkh-brand{display:flex;align-items:center;gap:10px;min-width:0}
.pv-bkh-logo{height:30px;width:auto;object-fit:contain;flex:0 0 auto}
.pv-bkh-bn strong{display:block;color:var(--navy);font-size:14px;letter-spacing:.04em;white-space:nowrap}
.pv-bkh-label{justify-self:center;padding:5px 11px;border-radius:999px;background:var(--blue-soft);color:var(--blue);font-size:9px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
.pv-bkh-meta{justify-self:end;display:flex;gap:8px}
.pv-bkh-pill{display:flex;flex-direction:column;padding:6px 11px;border:1.5px solid var(--line);border-radius:12px;color:#24324b;font-size:10px;font-weight:800;white-space:nowrap;line-height:1.3}
.pv-bkh-pill strong{color:var(--navy);font-size:12.5px}
.pv-bkh-hero{padding:4px 22px 14px;text-align:center}
.pv-bkh-title{margin:0;color:var(--navy);font-size:25px;font-weight:820;line-height:1.08;letter-spacing:-.03em}
.pv-bkh-divider{width:60px;height:4px;margin:11px auto 0;border-radius:99px;background:linear-gradient(90deg,var(--blue),var(--gold))}
.pv-bkh-student{display:grid;grid-template-columns:1.55fr .7fr .75fr;margin:0 16px 11px;overflow:hidden;border:1.5px solid var(--line);border-radius:15px;background:#f8faff}
.pv-bkh-field{position:relative;padding:11px 16px;min-height:56px;display:flex;flex-direction:column;justify-content:center;gap:5px}
.pv-bkh-field:not(:last-child)::after{content:"";position:absolute;top:13px;right:0;bottom:13px;width:1.5px;background:var(--line)}
.pv-bkh-flbl{color:#24324b;font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}
.pv-bkh-fval{color:var(--navy);font-size:16px;font-weight:760;min-height:20px;line-height:1.2}
.pv-bkh-assess{margin:0 16px 16px;padding:12px 14px;border:1.5px solid var(--line);border-radius:15px;background:#fff}
.pv-bkh-ahead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.pv-bkh-atitle{color:var(--navy);font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
.pv-bkh-anote{color:#3a4356;font-size:10px;font-weight:700}
.pv-bkh-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:7px}
.pv-bkh-qcard{padding:7px 4px 6px;border:1.5px solid var(--line);border-radius:12px;text-align:center}
.pv-bkh-qno{margin-bottom:6px;color:var(--navy);font-size:10.5px;font-weight:800;white-space:nowrap}
.pv-bkh-status{display:flex;justify-content:center;gap:4px}
.pv-bkh-circle{display:grid;place-items:center;width:20px;height:20px;border:2px solid #b3bbca;border-radius:50%;color:#737d91;font-size:9px;font-weight:900;line-height:1}
/* FOOTER BK — 3 mục Đơn vị · Điện thoại · Địa chỉ, vạch gradient dọc bên trái. RUNNING ELEMENT: paged.js
   nhấc ra khỏi luồng, ghim vào LỀ DƯỚI mọi trang (@bottom-center) → không rơi sang trang sau. */
.pv-bkf{position:running(bkfoot);overflow:hidden;display:grid;grid-template-columns:1.15fr .8fr 1.35fr;align-items:center;width:100%;border:1.5px solid #c2cbdb;border-radius:16px;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pv-bkf::before{content:"";position:absolute;inset:0 auto 0 0;width:5px;background:linear-gradient(180deg,#4c6fff,#c89b52)}
.pv-bkf-item{position:relative;padding:9px 16px;min-height:32px;display:flex;align-items:center;justify-content:center}
.pv-bkf-item:first-child{padding-left:20px}
.pv-bkf-item:not(:last-child)::after{content:"";position:absolute;top:8px;right:0;bottom:8px;width:1.5px;background:#c9d2e0}
.pv-bkf-val{color:#172033;font-size:12.5px;font-weight:800;line-height:1.3;text-align:center}
`

// Đầu phiếu BTVN kiểu BK — như ET nhưng: nhãn "BTVN", tiêu đề = tên buổi, meta = Ngày phát / Ngày nộp,
// bảng HS = Họ tên · Lớp · Điểm (KHÔNG mã đề, KHÔNG lưới chấm từng câu). Bản GV bỏ bảng HS.
export function BtvnBkHead({ buoiTitle, ngayPhat, ngayNop, lopTen, hoTen, gv }: {
  buoiTitle: string; ngayPhat: string; ngayNop: string; lopTen: string; hoTen?: string; gv: boolean
}) {
  return (
    <div className="pv-bkh">
      <div className="pv-bkh-top">
        <div className="pv-bkh-brand">
          <img className="pv-bkh-logo" src={location.origin + '/Logo.png'} alt="BK ACADEMY" />
        </div>
        <div className="pv-bkh-label">BTVN{gv ? ' · Đáp án' : ''}</div>
        <div className="pv-bkh-meta">
          <div className="pv-bkh-pill"><span>Ngày phát</span><strong>{ngayPhat || '—'}</strong></div>
          <div className="pv-bkh-pill"><span>Ngày nộp</span><strong>{ngayNop || '—'}</strong></div>
        </div>
      </div>
      <div className="pv-bkh-hero">
        <h1 className="pv-bkh-title">{buoiTitle}</h1>
        <div className="pv-bkh-divider" />
      </div>
      {!gv && (
        <div className="pv-bkh-student">
          <div className="pv-bkh-field"><div className="pv-bkh-flbl">Họ và tên học sinh</div><div className="pv-bkh-fval">{hoTen || ' '}</div></div>
          <div className="pv-bkh-field"><div className="pv-bkh-flbl">Lớp</div><div className="pv-bkh-fval">{lopTen || ' '}</div></div>
          <div className="pv-bkh-field"><div className="pv-bkh-flbl">Điểm</div><div className="pv-bkh-fval">&nbsp;</div></div>
        </div>
      )}
    </div>
  )
}

// Footer BK — thông tin liên hệ, dùng chung ET + BTVN (đặt cuối mỗi phiếu kiểu BK).
export function BkFooter() {
  return (
    <div className="pv-bkf">
      <div className="pv-bkf-item"><div className="pv-bkf-val">CLB Toán học BK Academy</div></div>
      <div className="pv-bkf-item"><div className="pv-bkf-val">0963.209.309</div></div>
      <div className="pv-bkf-item"><div className="pv-bkf-val">Số 17A10 KĐT Geleximco</div></div>
    </div>
  )
}
