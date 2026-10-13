// 🔔 HÒM THƯ ở thanh trên: chuông + số chưa đọc, bấm mở danh sách. Mọi thứ liên quan tới tôi (order hai phía,
// gậy, việc được giao / nghiệm thu / nhận xét…) hiện ở đây — nguồn do DB tự đẻ (mig 202610140053).
// Số chưa đọc đếm ở DB (head count); làm tươi mỗi 60 giây + khi quay lại cửa sổ.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'
import { listThu, demChuaDoc, danhDauDoc, NHAN_LOAI, type Thu } from '../lib/homThu'

const tuongDoi = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'vừa xong'
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
}

export default function HomThu({ di, duocDi }: { di: (leaf: string) => void; duocDi: (leaf: string) => boolean }) {
  const coHoSo = useStore((s) => !!s.me)
  const [so, setSo] = useState(0)
  const [mo, setMo] = useState(false)
  const [ds, setDs] = useState<Thu[] | null>(null)
  const [chiChuaDoc, setChiChuaDoc] = useState(false)
  const [loi, setLoi] = useState(false)
  const khung = useRef<HTMLDivElement>(null)

  const lamTuoiSo = useCallback(() => { demChuaDoc().then(setSo).catch(() => { /* chưa có bảng / mất mạng: giữ số cũ */ }) }, [])
  useEffect(() => {
    if (!coHoSo) return
    lamTuoiSo()
    const t = setInterval(lamTuoiSo, 60000)
    window.addEventListener('focus', lamTuoiSo)
    return () => { clearInterval(t); window.removeEventListener('focus', lamTuoiSo) }
  }, [coHoSo, lamTuoiSo])

  // Mở: nạp danh sách MỚI (danh sách là nền, không xoá khi nạp lại).
  useEffect(() => {
    if (!mo) return
    setLoi(false)
    listThu().then(setDs).catch(() => { setLoi(true); setDs((c) => c ?? []) })
  }, [mo])
  useEffect(() => {
    if (!mo) return
    const ngoai = (e: MouseEvent) => { if (!khung.current?.contains(e.target as Node)) setMo(false) }
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') setMo(false) }
    document.addEventListener('mousedown', ngoai)
    document.addEventListener('keydown', phim)
    return () => { document.removeEventListener('mousedown', ngoai); document.removeEventListener('keydown', phim) }
  }, [mo])

  if (!coHoSo) return null

  // Vá tại chỗ (không nạp lại cả danh sách): đổi cờ trong list + số, ghi DB nền, lỗi thì trả lại.
  const doc = (ids: string[]) => {
    const can = (ds ?? []).filter((t) => ids.includes(t.id) && !t.da_doc).map((t) => t.id)
    if (!can.length) return
    setDs((c) => (c ?? []).map((t) => (can.includes(t.id) ? { ...t, da_doc: true } : t)))
    setSo((n) => Math.max(0, n - can.length))
    danhDauDoc(can).catch(() => {
      setDs((c) => (c ?? []).map((t) => (can.includes(t.id) ? { ...t, da_doc: false } : t)))
      lamTuoiSo()
    })
  }
  const bamThu = (t: Thu) => {
    doc([t.id])
    if (t.lien_ket && duocDi(t.lien_ket)) { setMo(false); di(t.lien_ket) }
  }
  const hien = (ds ?? []).filter((t) => !chiChuaDoc || !t.da_doc)
  const chuaDocTrongDs = (ds ?? []).filter((t) => !t.da_doc).map((t) => t.id)

  return (
    <div ref={khung} className="relative shrink-0">
      <button onClick={() => setMo(!mo)} title="Hòm thư" className="relative flex size-8 items-center justify-center rounded-md text-[17px] hover:bg-[var(--sk-surface2)]">
        🔔
        {so > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-[17px] rounded-full bg-rose-500 px-1 text-center text-[10.5px] font-bold leading-[17px] text-white">{so > 99 ? '99+' : so}</span>
        )}
      </button>
      {mo && (
        <div className="absolute right-0 top-full z-[70] mt-2 flex max-h-[min(70vh,560px)] w-[400px] flex-col border border-[var(--sk-line)] bg-[var(--sk-bg)] text-[var(--sk-ink)] shadow-2xl" style={{ borderRadius: 'var(--sk-radius)' }}>
          <div className="flex items-center gap-2 border-b border-[var(--sk-line)] px-3 py-2">
            <span className="text-[14px] font-bold">Hòm thư</span>
            <label className="ml-2 flex cursor-pointer items-center gap-1 text-[12px] text-[var(--sk-muted)]">
              <input type="checkbox" checked={chiChuaDoc} onChange={(e) => setChiChuaDoc(e.target.checked)} /> Chỉ chưa đọc
            </label>
            <button onClick={() => doc(chuaDocTrongDs)} disabled={!chuaDocTrongDs.length}
              className="ml-auto text-[12px] font-semibold text-[var(--sk-acc)] hover:underline disabled:opacity-40 disabled:no-underline">Đánh dấu đã đọc hết</button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {ds === null ? <p className="px-4 py-6 text-center text-[13px] text-[var(--sk-muted)]">Đang tải…</p>
              : loi ? <p className="px-4 py-6 text-center text-[13px] text-[var(--sk-muted)]">Chưa tải được hòm thư.</p>
              : hien.length === 0 ? <p className="px-4 py-8 text-center text-[13px] text-[var(--sk-muted)]">{chiChuaDoc ? 'Không còn thư chưa đọc. ✓' : 'Hòm thư trống.'}</p>
              : (
                <ul>
                  {hien.map((t) => {
                    const nl = NHAN_LOAI[t.loai] ?? NHAN_LOAI.he_thong
                    return (
                      <li key={t.id}>
                        <button onClick={() => bamThu(t)} className={`flex w-full gap-2.5 border-b border-[var(--sk-line)] px-3 py-2.5 text-left hover:bg-[var(--sk-surface2)] ${t.da_doc ? '' : 'bg-[var(--sk-surface)]'}`}>
                          <span className="mt-0.5 text-[18px] leading-none" title={nl.ten}>{nl.icon}</span>
                          <span className="min-w-0 flex-1">
                            <span className={`block text-[13.5px] leading-snug ${t.da_doc ? 'font-medium text-[var(--sk-muted)]' : 'font-bold'}`}>{t.tieu_de}</span>
                            {t.noi_dung && <span className="mt-0.5 block whitespace-pre-line text-[12.5px] leading-snug text-[var(--sk-muted)] line-clamp-3">{t.noi_dung}</span>}
                            <span className="mt-1 block text-[11px] text-[var(--sk-muted)]">{nl.ten} · {tuongDoi(t.created_at)}</span>
                          </span>
                          {!t.da_doc && <span aria-label="chưa đọc" className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--sk-acc)]" />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
