// BaiTraHS — em xem bài BTVN (nộp ẢNH qua app PH) đã được thầy cô chấm & trả. Vào từ Hòm thư (CEO chốt 29/09).
// Cùng nội dung PH thấy ở app PH (BaiChamScreen): trạng thái nộp · thái độ · Đ/C/S từng câu · nhận xét ·
// ảnh bài chấm bút đỏ. Số liệu (đếm Đ/C/S, tên dạng) tính sẵn ở DB — fn_btvn_tra_chi_tiet_cua_toi.
// Mở được bài = đánh dấu đã xem (fn_btvn_tra_da_xem) ⇒ thư hết sáng, badge chuông giảm.
import { useEffect, useState } from 'react'
import { ManHS, DauTrangHS, TheHS, TrongHS, NhanHS, NhomHS, MAU, HEAD } from './skin/KhungHS'
import { chiTietBaiTra, danhDauDaXemBaiTra, kyAnhBaiTra, type ChiTietBaiTraHS, type CauTraHS } from '../../lib/btvntra'

const NOP: Record<string, { t: string; mau: string }> = {
  nop_dung_han: { t: 'Nộp đúng hạn', mau: MAU.dung },
  nop_muon: { t: 'Nộp muộn', mau: MAU.canhBao },
  xin_phep: { t: 'Đã xin phép', mau: MAU.dung },
  khong_lam: { t: 'Không làm bài', mau: MAU.sai },
}
const THAI_DO: Record<string, string> = {
  nghiem_tuc: 'Nghiêm túc', chua_het_suc: 'Chưa hết sức', chua_nghiem_tuc: 'Chưa nghiêm túc', chong_doi: 'Chống đối',
}
const KQ: Record<CauTraHS['result'], { t: string; mau: string }> = {
  correct: { t: 'Đ', mau: MAU.dung }, partial: { t: 'C', mau: MAU.canhBao }, wrong: { t: 'S', mau: MAU.sai },
}

// 'YYYY-MM-DD' → 'dd/mm' (tách chuỗi, KHÔNG new Date — CLAUDE §2).
export function ngayNgan(ngay: string): string {
  const [, m, d] = ngay.split('-')
  return `${d}/${m}`
}
function gioVN(iso: string): string {
  const vn = new Date(new Date(iso).getTime() + 7 * 3600000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(vn.getUTCHours())}:${p(vn.getUTCMinutes())} ${p(vn.getUTCDate())}/${p(vn.getUTCMonth() + 1)}`
}

// Gom các câu LIỀN NHAU cùng dạng để hiện theo nhóm (thuần hiển thị, giữ thứ tự câu).
function theoDang(cau: CauTraHS[]): { ten: string | null; cau: CauTraHS[] }[] {
  const out: { ten: string | null; cau: CauTraHS[] }[] = []
  for (const c of cau) {
    const cuoi = out[out.length - 1]
    if (cuoi && cuoi.ten === c.ten_dang) cuoi.cau.push(c)
    else out.push({ ten: c.ten_dang, cau: [c] })
  }
  return out
}

export default function BaiTraHS({ buoiHocId, onXong, onDaXem }: { buoiHocId: string; onXong: () => void; onDaXem?: (buoiHocId: string) => void }) {
  const [bai, setBai] = useState<ChiTietBaiTraHS | null | undefined>(undefined) // undefined = đang tải
  const [loi, setLoi] = useState(false)
  const [anh, setAnh] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    setBai(undefined); setLoi(false); setAnh(null)
    chiTietBaiTra(buoiHocId).then((b) => {
      setBai(b)
      if (!b) return
      danhDauDaXemBaiTra(buoiHocId).then(() => onDaXem?.(buoiHocId)).catch(() => {})
      kyAnhBaiTra(b.anh).then(setAnh).catch(() => setAnh({}))
    }).catch(() => setLoi(true))
  }, [buoiHocId]) // eslint-disable-line react-hooks/exhaustive-deps

  const tieuDe = bai ? `BTVN buổi ${ngayNgan(bai.ngay)}` : 'Bài tập về nhà'
  const phu = bai ? [bai.mon, bai.ten_lop, `trả lúc ${gioVN(bai.tra_at)}`].filter(Boolean).join(' · ') : undefined
  const nop = bai?.trang_thai_nop ? NOP[bai.trang_thai_nop] : null
  const soAnhMo = bai && anh ? bai.anh.filter((p) => anh[p]).length : 0

  return (
    <ManHS rong="hep">
      <DauTrangHS tieuDe={tieuDe} phu={phu} onBack={onXong} />
      {loi && <TrongHS>Không tải được bài chấm — kiểm tra mạng rồi thử lại nhé.</TrongHS>}
      {!loi && bai === undefined && <TrongHS>Đang tải bài chấm…</TrongHS>}
      {!loi && bai === null && <TrongHS>Bài này chưa được thầy cô trả.</TrongHS>}
      {bai && (
        <>
          <TheHS className="p-4">
            <p className="text-[16px] font-bold" style={{ ...HEAD, color: MAU.ink }}>Kết quả</p>
            {bai.so_cau > 0 ? (
              <p className="mt-1.5 text-[15px] font-semibold">
                <span style={{ color: MAU.dung }}>Đúng {bai.so_dung}</span>
                <span style={{ color: MAU.muted }}> · </span>
                <span style={{ color: MAU.canhBao }}>Chưa trọn {bai.so_chua_tron}</span>
                <span style={{ color: MAU.muted }}> · </span>
                <span style={{ color: MAU.sai }}>Sai {bai.so_sai}</span>
                <span style={{ color: MAU.muted }}> / {bai.so_cau} câu</span>
              </p>
            ) : (
              <p className="mt-1.5 text-[14px]" style={{ color: MAU.muted }}>Bài này thầy cô chấm trên ảnh, không có điểm từng câu.</p>
            )}
            {(nop || bai.thai_do) && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {nop && <NhanHS mau={nop.mau}>{nop.t}</NhanHS>}
                {bai.thai_do && <NhanHS mau={MAU.muted}>Thái độ: {THAI_DO[bai.thai_do] ?? bai.thai_do}</NhanHS>}
              </div>
            )}
          </TheHS>

          {bai.cau.length > 0 && (
            <>
              <NhomHS>Từng câu</NhomHS>
              <TheHS className="flex flex-col gap-3 p-4">
                {theoDang(bai.cau).map((g, i) => (
                  <div key={i}>
                    {g.ten && <p className="mb-1.5 text-[13px] font-semibold" style={{ color: MAU.muted }}>{g.ten}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {g.cau.map((c) => <NhanHS key={c.problem_no} mau={KQ[c.result].mau}>Câu {c.problem_no} · {KQ[c.result].t}</NhanHS>)}
                    </div>
                  </div>
                ))}
                <p className="text-[12px]" style={{ color: MAU.muted }}>Đ = đúng · C = chưa trọn · S = sai</p>
              </TheHS>
            </>
          )}

          {bai.nhan_xet.length > 0 && (
            <>
              <NhomHS>Nhận xét của thầy cô</NhomHS>
              <TheHS className="p-4">
                {bai.nhan_xet.map((nx, i) => <p key={i} className="text-[14px] leading-snug" style={{ color: MAU.ink }}>• {nx}</p>)}
              </TheHS>
            </>
          )}

          <NhomHS>Bài làm đã chấm ({bai.anh.length} ảnh)</NhomHS>
          {anh === null && bai.anh.length > 0 && <TrongHS>Đang tải ảnh…</TrongHS>}
          {anh !== null && bai.anh.length > 0 && soAnhMo === 0 && <TrongHS>Chưa mở được ảnh bài chấm — em thử lại sau nhé.</TrongHS>}
          {anh && bai.anh.filter((p) => anh[p]).map((p, i) => (
            // Bấm ảnh ⇒ mở cỡ gốc ở tab mới để phóng to đọc nét bút đỏ.
            <a key={p} href={anh[p]} target="_blank" rel="noreferrer" className="block">
              <img src={anh[p]} alt={`Trang ${i + 1}`} loading="lazy" className="w-full" style={{ borderRadius: 'var(--sk-radius)', border: `1px solid ${MAU.line}` }} />
            </a>
          ))}
        </>
      )}
    </ManHS>
  )
}
