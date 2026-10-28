// In BÀI HÌNH–LUYỆN (bài trọn ý của 1 mô hình) — dùng chung cho chuyên đề Hình (ChuyenDeHinhPrintView) và phần LUYỆN của
// giáo trình Hình bản đồ mới (PrintView, mig 202610271757). Như màn duyệt Hình–Luyện: đề = giả thiết chung (de_bai là bản gốc
// trọn — in nữa thì lặp); không có giả thiết chung + 1 ý = "bài một ý": đề nằm trọn trong ý, hình = hình của ý (không có thì hình bài).
// Số "Bài N." là số HIỂN THỊ (người gọi đếm), không lưu.
import { MathText } from '../../kho/ui'
import type { CdhBai } from '../../../lib/chuyenDeHinh'

export function BaiHinhIn({ b, no, gv, nguon }: { b: CdhBai; no: number; gv: boolean; nguon?: string }) {
  const motY = !b.gia_thiet_chung?.trim() && b.y.length === 1
  // Có nguồn (Thùy 21/10): dòng riêng "Bài N. (Đề thi … — THCS …)", nội dung bài xuống dòng dưới.
  const no_ = nguon ? '' : `<span class="pv-cau-no">Bài ${no}.</span> `
  return (
    <div className="pv-cau cdh-bai">
      {nguon && <div className="cdh-nguon"><span className="pv-cau-no">Bài {no}.</span> <i>({nguon})</i></div>}
      {!motY && <div className="pv-math"><MathText prefix={no_}>{b.gia_thiet_chung ?? ''}</MathText></div>}
      {!motY && b.anh_de && <img className="pv-img" src={b.anh_de} alt="" />}
      {b.y.map((y, i) => (
        <div key={i} className={motY ? '' : 'cdh-y'}>
          <div className="pv-math"><MathText prefix={motY ? no_ : y.nhan ? `<b>${y.nhan})</b> ` : ''}>{[y.gia_thiet_them, y.noi_dung].filter((x) => x && x.trim()).join('\n')}</MathText></div>
          {(motY ? (y.anh_de ?? b.anh_de) : y.anh_de) && <img className="pv-img" src={(motY ? (y.anh_de ?? b.anh_de) : y.anh_de)!} alt="" />}
          {gv && (y.dap_an || y.loi_giai || y.anh_loi_giai) && (
            <div className="pv-loigiai">
              {y.dap_an && <div className="pv-math"><MathText prefix="<b>Đáp số:</b> ">{y.dap_an}</MathText></div>}
              {y.loi_giai && <div className="pv-math"><MathText>{y.loi_giai}</MathText></div>}
              {y.anh_loi_giai && <img className="pv-img" src={y.anh_loi_giai} alt="" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Bài được CHẢY qua trang (đề thi 19/10: giữ nguyên khối bài dài ⇒ nhảy trang bỏ trống); chỉ giữ ảnh + đầu mô hình liền khối.
export const CDH_CSS = `
.pv-cdh .pv-cau{break-inside:auto}
.pv-cdh .cdh-mh{margin-top:10px}
.pv-cdh .cdh-mh-head{font-weight:800;font-size:15px;color:#334155;border-left:4px solid var(--pv-accent,#2D9CDB);padding:2px 0 2px 8px;margin:8px 0 6px;break-after:avoid}
.pv-cdh .cdh-y{margin:4px 0 4px 14px}
.pv-cdh .cdh-nguon{break-after:avoid;margin-bottom:2px}
.pv-cdh .cdh-nguon i{color:#5b6470}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
`
