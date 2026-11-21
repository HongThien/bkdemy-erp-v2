// Báo sai CÂU TRONG KHO — dùng chung mọi nơi nhân sự nhìn thấy câu (Thùy 21/11; spec-giai-bai §E3, mig 202611210816).
// Luật tự vào kho đã bỏ nhân chứng đáp số ⇒ an toàn dựa vào hậu kiểm ⇒ MỌI câu có nút 🚩. 5 loại: trình bày · tính sai · sai đề · sai dạng · khác.
// Trưởng khối đúng khối được "đã sửa" / "xoá" luôn, NHƯNG luôn kèm báo (loại + ghi chú) cùng một giao dịch ở DB — để AI có luồng nhận thông tin
// và ghi vào Phần D của spec-giai-bai. Dùng: <NutBaoSai maCau="DC000123" /> hoặc moBaoSai(maCau, { mode: 'xoa', onXong }).
// Một <BaoSaiHost /> duy nhất (gắn ở TopBar) vẽ hộp thoại, nên chỗ nào cũng gọi được mà không phải truyền state.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LOAI_BAO_SAI, baoSaiCau, duocXuLyBaoSai, xuLyBaoSaiCau, type LoaiBaoSai } from '../lib/baoloi_cau'

export type BaoSaiOpts = {
  mode?: 'bao' | 'sua' | 'xoa'                      // chọn sẵn việc tiếp theo (mặc định: chỉ báo)
  loai?: LoaiBaoSai                                  // chọn sẵn loại lỗi
  onXong?: (kq: { hanhDong: 'bao' | 'sua' | 'xoa'; daXoa: boolean }) => void
}
type Yeu = { maCau: string; opts: BaoSaiOpts }

let mo: ((y: Yeu) => void) | null = null
export function moBaoSai(maCau: string, opts: BaoSaiOpts = {}) {
  if (mo) mo({ maCau, opts })
  else alert('Hộp báo sai chưa sẵn sàng — tải lại trang rồi thử lại.')
}

export function NutBaoSai({ maCau, opts, className }: { maCau: string; opts?: BaoSaiOpts; className?: string }) {
  return (
    <button type="button" title="Báo câu này sai (trình bày · tính sai · sai đề · sai dạng)"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); moBaoSai(maCau, opts) }}
      className={className ?? 'no-print shrink-0 rounded px-1 text-[12px] leading-none text-slate-300 hover:bg-rose-50 hover:text-rose-600'}>
      🚩
    </button>
  )
}

export default function BaoSaiHost() {
  const [y, setY] = useState<Yeu | null>(null)
  const [loai, setLoai] = useState<LoaiBaoSai>('tinh_sai')
  const [ghi, setGhi] = useState('')
  const [viec, setViec] = useState<'bao' | 'sua' | 'xoa'>('bao')
  const [ket, setKet] = useState('')
  const [duoc, setDuoc] = useState(false)
  const [ban, setBan] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [xong, setXong] = useState<string | null>(null)

  useEffect(() => {
    mo = (yeu) => {
      setY(yeu); setLoai(yeu.opts.loai ?? 'tinh_sai'); setGhi(''); setKet(''); setLoi(null); setXong(null); setBan(false)
      setViec(yeu.opts.mode ?? 'bao'); setDuoc(false)
      void duocXuLyBaoSai(yeu.maCau).then((v) => { setDuoc(v); if (!v) setViec('bao') })
    }
    return () => { mo = null }
  }, [])

  if (!y) return null
  const dong = () => { if (!ban) setY(null) }
  const ghiOk = ghi.trim().length >= 5
  const ketOk = viec === 'bao' || ket.trim().length >= 5

  async function gui() {
    if (!y || ban || !ghiOk || !ketOk) return
    setBan(true); setLoi(null)
    try {
      let daXoa = false
      if (viec === 'bao') await baoSaiCau(y.maCau, loai, ghi.trim())
      else { const r = await xuLyBaoSaiCau(y.maCau, viec, ket.trim(), { loai, ghiChu: ghi.trim() }); daXoa = r.da_xoa > 0 }
      setXong(viec === 'bao' ? 'Đã gửi báo sai. Trưởng khối và Claude sẽ nhận được.' : viec === 'xoa' ? 'Đã báo và đưa câu vào kho rác.' : 'Đã báo và ghi nhận đã sửa.')
      y.opts.onXong?.({ hanhDong: viec, daXoa })
      setTimeout(() => setY(null), 1300)
    } catch (e) { setLoi((e as Error).message) } finally { setBan(false) }
  }

  return createPortal(
    <div className="fixed inset-0 z-[96] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center" onClick={dong}>
      <div className="w-[480px] max-w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-slate-900">🚩 Báo sai câu</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">{y.maCau}</span>
          <button onClick={dong} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {xong ? <div className="py-6 text-center text-[14px] font-medium text-emerald-600">✓ {xong}</div> : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {LOAI_BAO_SAI.map((l) => (
                <button key={l.id} onClick={() => setLoai(l.id)}
                  className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${loai === l.id ? 'bg-rose-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>{l.ten}</button>
              ))}
            </div>
            <p className="mt-1.5 text-[12px] text-slate-400">{LOAI_BAO_SAI.find((l) => l.id === loai)?.goiY}</p>
            <textarea value={ghi} onChange={(e) => setGhi(e.target.value)} rows={3} maxLength={500} autoFocus
              placeholder="Lỗi gì? (ví dụ: bước 3 nhân sai, đáp số đúng là 14 chứ không phải 12)"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-rose-400" />

            <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[13px]">
              <label className="flex items-center gap-2"><input type="radio" checked={viec === 'bao'} onChange={() => setViec('bao')} /> Chỉ báo — trưởng khối / Claude xử lý sau</label>
              {duoc ? (
                <>
                  <label className="mt-1 flex items-center gap-2"><input type="radio" checked={viec === 'sua'} onChange={() => setViec('sua')} /> Tôi đã sửa câu xong</label>
                  <label className="mt-1 flex items-center gap-2"><input type="radio" checked={viec === 'xoa'} onChange={() => setViec('xoa')} /> Xoá câu khỏi kho (vào kho rác, mã không cấp lại)</label>
                  {viec !== 'bao' && (
                    <input value={ket} onChange={(e) => setKet(e.target.value)} maxLength={500}
                      placeholder={viec === 'xoa' ? 'Vì sao xoá?' : 'Đã sửa gì? (đáp số 12 → 14, thêm bước…)'}
                      className="mt-2 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-rose-400" />
                  )}
                </>
              ) : <p className="mt-1 text-[12px] text-slate-400">Chỉ trưởng khối đúng khối (hoặc cấp trên) mới sửa / xoá câu.</p>}
            </div>

            {loi && <p className="mt-2 text-[12.5px] text-rose-700">{loi}</p>}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11.5px] text-slate-400">Báo trước, rồi mới sửa / xoá — để lỗi được ghi lại và rút thành luật.</span>
              <button onClick={gui} disabled={ban || !ghiOk || !ketOk}
                className="ml-auto rounded-md bg-rose-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">
                {ban ? 'Đang gửi…' : viec === 'bao' ? 'Gửi báo' : viec === 'xoa' ? 'Báo & xoá câu' : 'Báo & đã sửa'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
