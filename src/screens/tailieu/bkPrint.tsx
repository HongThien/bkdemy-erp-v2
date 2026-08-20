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
/* ⭐ 08-19 (Thùy báo "BTVN 4A1 trống trang 1"): overflow:hidden ở đây khớp đúng anti-pattern đã ghi nhận
   trong PrintView.tsx (".gtbk-card": "TUYỆT ĐỐI không overflow:hidden — paged.js coi box overflow:hidden
   là KHÔNG tách được"). Box này nằm ngay trong đầu phiếu (break-inside:avoid), đứng trước card đầu tiên —
   bỏ overflow:hidden để không góp phần vào cùng lớp bug "card đầu nhảy hẳn sang trang sau dù còn thừa
   chỗ". Bo góc vẫn giữ nguyên qua border-radius (không cần overflow:hidden để clip gì thêm ở đây). */
.pv-bkh-student{display:grid;grid-template-columns:1.55fr .7fr .75fr;margin:0 16px 11px;border:1.5px solid var(--line);border-radius:15px;background:#f8faff}
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
`

// @page cho kiểu BK: lề hẹp (in PHIẾU) + FOOTER full-width ghim ĐÁY MỌI TRANG bằng pseudo ::after trên
// .pagedjs_pagebox (đúng cơ chế footer chrome cũ → NGANG cuối trang, không rơi sang trang sau). 3 giá trị,
// đậm, căn giữa, cách nhau bằng "·". Chỉ dùng khi bật kiểu BK (append riêng, không đụng in giáo trình).
export const BK_PAGE_CSS = `
@page{margin:8mm 10mm 16mm}
/* In cả lớp: mỗi HS bắt đầu ở TRANG LẺ (mặt trước tờ giấy) → in 2 mặt mỗi HS luôn chẵn trang, HS lẻ trang
   không dính sang HS sau (paged.js tự chèn trang trắng). Con đầu không break thêm (wrapper đã break). */
.pv-hs-recto{break-before:right}
.pv-hs-recto>.pv-btvn:first-child{break-before:auto}
/* ET: mỗi mã đề / HS bắt đầu ở trang lẻ (mặt trước) → in 2 mặt mỗi mã đề chẵn trang, không dính nhau. */
.pv-de-recto{break-before:right}
.pagedjs_pagebox::after{content:"CLB Toán học BK Academy      ·      0963.209.309      ·      Số 17A10 KĐT Geleximco";position:absolute;left:10mm;right:10mm;bottom:4mm;height:9mm;display:flex;align-items:center;justify-content:center;border:1.5px solid #c2cbdb;border-radius:11px;background:#fff;color:#172033;font-weight:800;font-size:11.5px;white-space:pre;z-index:2;-webkit-print-color-adjust:exact;print-color-adjust:exact}
`

// Đầu phiếu BTVN — KIỂU GIÁO TRÌNH (masthead 08-08): khung gradient bo góc + logo thật + pill "BTVN"
// (+ "Đáp án" bản GV) + tiêu đề = tên buổi + dòng phụ (Lớp · Ngày phát · Hạn nộp). Dưới masthead là hàng ô
// Họ tên · Lớp · Điểm (tái dùng .pv-bkh-* trong BK_CSS). Class masthead (.gtbk-mh*) đến từ GT_BK_CSS —
// PrintView luôn append GT_BK_CSS khi render BTVN. Không huy hiệu tròn (BTVN không mang số buổi rõ).
export function BtvnBkHead({ buoiTitle, ngayPhat, ngayNop, lopTen, hoTen, gv }: {
  buoiTitle: string; ngayPhat: string; ngayNop: string; lopTen: string; hoTen?: string; gv: boolean
}) {
  const sub = [lopTen && `Lớp ${lopTen}`, ngayPhat && `Ngày phát ${ngayPhat}`, ngayNop && `Hạn nộp ${ngayNop}`].filter(Boolean).join('  ·  ')
  return (
    <div className="gtbk-btvn-head">
      <div className="gtbk-mh gtbk-mh-nobadge">
        <div className="gtbk-mh-grid" />
        <div className="gtbk-mh-main">
          <div className="gtbk-mh-brand"><img className="gtbk-mh-logo" src={location.origin + '/Logo.png'} alt="BK Academy" /></div>
          <div className="gtbk-mh-kicker">
            <span className="gtbk-mh-pill">BTVN</span>
            {gv && <span className="gtbk-mh-tag">Đáp án</span>}
          </div>
          <h1 className="gtbk-mh-title">{buoiTitle}</h1>
          {sub && <div className="gtbk-mh-sub">{sub}</div>}
        </div>
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
