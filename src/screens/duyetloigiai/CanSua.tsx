// "✎ Cần sửa" — nhận xét lúc duyệt, dùng chung cho MỌI màn duyệt kho (Thùy 17/10).
//   useNhanXet(doiTuong) — trạng thái nhận xét của cả loại đối tượng (1 RPC), vá tại chỗ khi vừa ghi.
//   <NutCanSua>          — nút mở khung ghi: chọn khâu sai + viết "sai ở đâu, cần sửa thế nào".
//   <NhanXetCu>          — hộp trên thẻ khi đối tượng đã được Claude sửa / chưa sửa (kèm nhận xét gốc).
// Đối tượng đang "chờ sửa" ẩn khỏi hàng duyệt (lọc hiển thị thuần) tới khi Claude sửa xong thì hiện lại.
import { useCallback, useEffect, useState } from 'react'
import { ghiNhanXet, khoaNX, KHAU_NX, nhanXetTrangThai, type DoiTuongNX, type KhauNX, type MonNX, type TrangThaiNX } from '../../lib/kho/nhanXet'

export function useNhanXet(doiTuong: DoiTuongNX, mon?: MonNX) {
  const [nx, setNx] = useState<Map<string, TrangThaiNX>>(new Map())
  const napLai = useCallback(() => { nhanXetTrangThai(doiTuong, mon).then(setNx).catch(() => { /* lỗi đọc nhận xét không chặn màn duyệt */ }) }, [doiTuong, mon])
  useEffect(() => { napLai() }, [napLai])
  const vaNX = useCallback((t: TrangThaiNX) => setNx((m) => new Map(m).set(khoaNX(t.mon, t.ma), t)), [])
  const cua = useCallback((m: string, ma: string) => nx.get(khoaNX(m, ma)), [nx])
  const dangChoSua = useCallback((m: string, ma: string) => nx.get(khoaNX(m, ma))?.trang_thai === 'cho_sua', [nx])
  return { nx, cua, dangChoSua, vaNX, napLai }
}

const ngay = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
const nhanKhau = (k: string) => KHAU_NX.find((x) => x.id === k)?.nhan ?? k

export function NutCanSua({ doiTuong, mon, ma, man, khau = 'loi_giai', nho, onXong }: {
  doiTuong: DoiTuongNX; mon: MonNX; ma: string; man: string; khau?: KhauNX; nho?: boolean
  onXong: (t: TrangThaiNX) => void
}) {
  const [mo, setMo] = useState(false)
  const [k, setK] = useState<KhauNX>(khau)
  const [nd, setNd] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  async function gui() {
    if (!nd.trim()) return
    setBusy(true); setLoi(null)
    try { const t = await ghiNhanXet(doiTuong, mon, ma, k, nd, man); setMo(false); setNd(''); onXong(t) }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
    finally { setBusy(false) }
  }
  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setMo(true) }} title="Chưa duyệt được: ghi sai ở đâu + cần sửa thế nào — Claude sẽ sửa rồi đưa lại hàng duyệt"
        className={`rounded-md border border-amber-300 bg-amber-50 font-medium text-amber-800 hover:bg-amber-100 ${nho ? 'px-2 py-0.5 text-[12px]' : 'px-3 py-1.5 text-[13px]'}`}>✎ Cần sửa</button>
      {mo && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={() => !busy && setMo(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 rounded-t-xl bg-amber-500 px-4 py-2.5 text-white">
              <span className="flex-1 text-[14px] font-semibold">✎ Cần sửa · <code className="text-[12.5px] font-normal">{ma}</code></span>
              <button onClick={() => setMo(false)} disabled={busy} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div>
                <div className="mb-1 text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Sai ở khâu nào</div>
                <div className="flex flex-wrap gap-1.5">
                  {KHAU_NX.map((x) => (
                    <button key={x.id} onClick={() => setK(x.id)}
                      className={`rounded-full border px-3 py-1 text-[12.5px] ${k === x.id ? 'border-amber-500 bg-amber-500 font-semibold text-white' : 'border-slate-300 text-slate-600 hover:border-amber-400'}`}>{x.nhan}</button>
                  ))}
                </div>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Vì sao chưa duyệt được · cần sửa thế nào</span>
                <textarea autoFocus value={nd} onChange={(e) => setNd(e.target.value)} rows={5}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void gui() }}
                  placeholder={'Ghi cụ thể để Claude sửa được ngay, vd:\n· Bước 2 chuyển vế sai dấu, phải là x = 3\n· Đáp án C mới đúng, không phải B\n· Hình thiếu điểm H là chân đường cao'}
                  className="rounded-md border border-slate-300 p-2.5 text-[13.5px] outline-none focus:border-amber-500" />
              </label>
              <p className="text-[11.5px] text-slate-500">Câu tạm rời hàng duyệt. Claude sửa theo nhận xét (mỗi tối hoặc khi được gọi) rồi đưa lại hàng duyệt kèm ghi chú đã sửa gì — người duyệt kiểm lại mới bấm Duyệt.</p>
              {loi && <div className="text-[12.5px] text-rose-600">⚠ {loi}</div>}
              <div className="flex justify-end gap-2">
                <button onClick={() => setMo(false)} disabled={busy} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
                <button onClick={() => void gui()} disabled={!nd.trim() || busy}
                  className="rounded-md bg-amber-500 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-amber-600 disabled:opacity-40">{busy ? 'Đang gửi…' : 'Gửi nhận xét (Ctrl+Enter)'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Hộp trên thẻ: đối tượng ĐÃ có nhận xét và đã được xử lý (đã sửa / chưa sửa được) — để người duyệt kiểm lại */
export function NhanXetCu({ t, hienChoSua }: { t?: TrangThaiNX; hienChoSua?: boolean }) {
  if (!t || (t.trang_thai === 'cho_sua' && !hienChoSua)) return null
  const daSua = t.trang_thai === 'da_sua', choSua = t.trang_thai === 'cho_sua'
  return (
    <div className={`rounded-md border px-3 py-2 text-[12.5px] ${daSua ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
      <div className={`mb-1 font-semibold ${daSua ? 'text-emerald-800' : 'text-amber-800'}`}>
        {choSua ? '⏳ Đang chờ Claude sửa theo nhận xét' : daSua ? '✎ Đã sửa theo nhận xét — kiểm lại rồi duyệt' : '⚠ Claude chưa sửa theo nhận xét — xem lý do'}
      </div>
      <ul className="flex flex-col gap-1.5">
        {t.ds.map((n) => (
          <li key={n.id} className="leading-snug">
            <div className="text-slate-700"><b>{nhanKhau(n.khau)}</b>: {n.noi_dung} <span className="text-[11px] text-slate-400">— {n.nguoi_ten || '?'} · {ngay(n.at)}</span></div>
            {n.ghi_chu && <div className={`pl-3 ${n.ket_qua === 'da_sua' ? 'text-emerald-700' : 'text-amber-700'}`}>↳ {n.boi === 'claude' ? 'Claude' : 'Người'}: {n.ghi_chu}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Dòng nhỏ đầu danh sách: bao nhiêu mục đang ẩn vì chờ sửa (đếm thứ đang render) */
export function DongChoSua({ n }: { n: number }) {
  if (!n) return null
  return <div className="rounded-md bg-amber-50 px-3 py-1.5 text-[12.5px] text-amber-800">⏳ {n} mục đang chờ Claude sửa theo nhận xét (tạm ẩn khỏi hàng duyệt)</div>
}
