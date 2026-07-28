// KHO RÁC — câu đã xoá khỏi kho chính (mig 0111). Xoá câu KHÔNG còn là xoá cứng: câu vào rác,
// không cho chọn mới nữa nhưng VẪN resolve được, nên tài liệu đã in ra vẫn đủ câu.
// Thùy 07-21: "giữ lại để những thứ tham chiếu không bị sai lệch, nhưng cũng làm sạch kho đang dùng.
// Tôi sẽ chủ động dọn kho rác khi cần."
// Cột "đang dùng" = số dòng tai_lieu_cau còn trỏ tới câu. >0 thì CHẶN xoá vĩnh viễn — đây là cửa duy
// nhất còn đẻ ra được tham chiếu chết, nên chặn ở API (xoaVinhVienCau) chứ không chỉ ẩn nút.
import { useEffect, useState } from 'react'
import { listCauRac, khoiPhucCau, xoaVinhVienCau, LOAI_CAU, type CauRac } from '../../lib/kho/api'
import { Code, MathText } from './ui'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const ngayVN = (iso: string) => new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function KhoRac({ cauTbl, onClose }: { cauTbl: string; onClose: () => void }) {
  const [rows, setRows] = useState<CauRac[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setRows(await listCauRac(cauTbl)) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [cauTbl]) // eslint-disable-line

  async function khoiPhuc(c: CauRac) {
    setBusy(c.ma_cau)
    try { await khoiPhucCau(c.ma_cau, cauTbl); await reload() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }
  async function xoaHan(c: CauRac) {
    if (!confirm(`Xoá VĨNH VIỄN câu ${c.ma_cau}? Không khôi phục lại được.`)) return
    setBusy(c.ma_cau)
    try { await xoaVinhVienCau(c.ma_cau, cauTbl); await reload() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }

  const dungDuoc = rows.filter((r) => r.soTaiLieuDung === 0).length

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-slate-900/60" onClick={onClose}>
      <div className="mx-auto mt-10 flex h-[85vh] w-[min(1100px,94vw)] flex-col rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <span className="text-sm font-semibold text-slate-900">🗑 Kho rác</span>
          <span className="text-[12px] text-slate-400">{rows.length} câu · {dungDuoc} câu không còn tài liệu nào dùng (xoá hẳn được)</span>
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1 text-sm text-slate-500 hover:bg-slate-100">Đóng</button>
        </div>

        <p className="border-b border-slate-100 bg-amber-50/60 px-5 py-2 text-[12px] text-amber-800">
          Câu trong rác <b>không hiện khi soạn tài liệu mới</b>, nhưng tài liệu cũ vẫn in đủ câu.
          Chỉ xoá hẳn được câu <b>không còn tài liệu nào dùng</b> — nếu không sẽ tạo lại đúng lỗi thiếu câu ngày 07-21.
        </p>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-3">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
            : rows.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Kho rác trống.</div>
            : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-[12px] uppercase tracking-wide text-slate-500">
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Mã câu</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Dạng</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Loại</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Nội dung</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-center">Đang dùng</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Vào rác lúc</th>
                    <th className="border border-slate-200 px-2 py-1.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.ma_cau} className="align-top">
                      <td className="border border-slate-200 px-2 py-1.5"><Code>{c.ma_cau}</Code></td>
                      <td className="border border-slate-200 px-2 py-1.5 text-[12px] text-slate-500">{c.dang_chinh}</td>
                      <td className="border border-slate-200 px-2 py-1.5 text-[12px] text-slate-500">{loaiLabel(c.loai_cau)}</td>
                      <td className="max-w-[380px] border border-slate-200 px-2 py-1.5 text-[13px]">
                        <div className="line-clamp-3"><MathText>{c.noi_dung}</MathText></div>
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5 text-center">
                        {c.soTaiLieuDung > 0
                          ? <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[12px] font-semibold text-amber-800">{c.soTaiLieuDung} tài liệu</span>
                          : <span className="text-[12px] text-slate-300">—</span>}
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5 text-[12px] text-slate-500">{ngayVN(c.xoa_at)}</td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <div className="flex gap-1.5">
                          <button disabled={busy === c.ma_cau} onClick={() => khoiPhuc(c)}
                            className="rounded-md border border-slate-200 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40">↩ Khôi phục</button>
                          <button disabled={busy === c.ma_cau || c.soTaiLieuDung > 0} onClick={() => xoaHan(c)}
                            title={c.soTaiLieuDung > 0 ? `Còn ${c.soTaiLieuDung} tài liệu dùng câu này` : 'Xoá vĩnh viễn'}
                            className="rounded-md border border-rose-200 px-2 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30">Xoá hẳn</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  )
}
