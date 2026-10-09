// ĐỒ HOẠ — phần giao diện của luật chất lượng tự thích ứng (spec-v1-app-hs.md §4.5, logic ở `skin/the3d/chatLuong.ts`):
// · `useDoHoa()` — mức hiện tại; màn bản đồ cho vào deps của cảnh ⇒ đổi mức là dựng lại ngay, không tải lại app
// · `BaoDoHoa` — 1 dòng nhỏ ("Đồ hoạ: Vừa (tự chọn cho máy này)" / "Máy hơi chậm…") + câu hỏi "Em thấy hình có mượt không?" khi máy không chắc
// · `TamDoHoa` — chỉnh tay: Tự động (khuyên dùng) · Thấp · Vừa · Cao + nút "Đo lại máy này"; mở từ menu ⋯ ở Home, Hồ sơ, và nút ⚙ trên bản đồ
// Không import three (Home/Hồ sơ dùng được mà không kéo gói 3D).
import { useEffect, useSyncExternalStore, useState } from 'react'
import { createPortal } from 'react-dom'
import { MAU, THE, HEAD, NutHS } from '../skin/KhungHS'
import {
  trangThai, dangKy, datCheDo, doLai, traLoiMuot, xoaThongBao, moTaTrangThai, TEN_MUC, MO_TA_MUC, type CheDo, type TrangThai,
} from '../skin/the3d/chatLuong'

export function useDoHoa(): TrangThai {
  return useSyncExternalStore((f) => dangKy(f), trangThai)
}

/** Đặt trong màn bản đồ / màn đấu: dòng báo tự tắt sau 4 giây + câu hỏi mượt/giật. */
export function BaoDoHoa() {
  const t = useDoHoa()
  useEffect(() => { if (!t.thongBao) return; const h = window.setTimeout(xoaThongBao, 4000); return () => window.clearTimeout(h) }, [t.thongBao])
  if (t.hoi) {
    return (
      <div className="pointer-events-auto absolute bottom-16 left-1/2 z-40 w-[min(92vw,380px)] -translate-x-1/2 px-4 py-3 text-center" style={{ ...THE, color: MAU.ink }} role="dialog" aria-label="Hỏi về độ mượt">
        <p className="text-[16.5px] font-bold" style={HEAD}>Em thấy hình có mượt không?</p>
        <p className="mt-0.5 text-[14px]" style={{ color: MAU.muted }}>Đồ hoạ đang để mức {TEN_MUC[t.muc]}</p>
        <div className="mt-2.5 flex justify-center gap-2">
          <NutHS onClick={() => traLoiMuot(true)}>Mượt, giữ mức này</NutHS>
          <NutHS phu onClick={() => traLoiMuot(false)}>Hơi giật, giảm bớt</NutHS>
        </div>
      </div>
    )
  }
  if (!t.thongBao) return null
  return (
    <div className="pointer-events-none absolute bottom-16 left-1/2 z-40 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[14px] font-semibold"
      style={{ background: 'var(--sk-surface)', border: 'var(--sk-card-border)', color: MAU.ink, backdropFilter: 'var(--sk-blur)' }} role="status">
      {t.thongBao}
    </div>
  )
}

const LUA_CHON: { id: CheDo; ten: string; mo: string }[] = [
  { id: 'tu_dong', ten: 'Tự động (khuyên dùng)', mo: 'App tự đo máy và chọn mức hợp nhất' },
  { id: 'thap', ten: TEN_MUC.thap, mo: MO_TA_MUC.thap },
  { id: 'vua', ten: TEN_MUC.vua, mo: MO_TA_MUC.vua },
  { id: 'cao', ten: TEN_MUC.cao, mo: MO_TA_MUC.cao },
]

/** Tấm chỉnh đồ hoạ. Đổi xong áp ngay (cảnh bản đồ dựng lại; màn đấu áp phần đổi nhanh được, phần còn lại ở trận sau). */
export function TamDoHoa({ onDong }: { onDong: () => void }) {
  const t = useDoHoa()
  const [daDo, setDaDo] = useState(false)
  // portal ra body: nút mở tấm thường nằm trong ô có z-index thấp (bản đồ, Home) ⇒ không portal thì tấm bị lớp khác đè
  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] opacity-60" style={{ background: 'var(--sk-bg)' }} onClick={onDong} />
      <div className="fixed inset-x-0 bottom-0 z-[61] mx-auto flex max-w-[480px] flex-col gap-2 rounded-t-[22px] px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4"
        style={{ background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderTop: `1px solid ${MAU.line}` }} role="dialog" aria-label="Đồ hoạ">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[18.5px] font-bold" style={HEAD}>Đồ hoạ</p>
            <p className="text-[14px]" style={{ color: MAU.muted }}>{moTaTrangThai(t)}</p>
          </div>
          <button onClick={onDong} className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[17.5px]" style={{ background: MAU.surface2 }} aria-label="Đóng">✕</button>
        </div>
        {LUA_CHON.map((l) => {
          const chon = t.cheDo === l.id
          return (
            <button key={l.id} onClick={() => datCheDo(l.id)} aria-pressed={chon} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left"
              style={{ border: `1.5px solid ${chon ? MAU.acc : MAU.line}`, background: chon ? MAU.surface2 : 'transparent' }}>
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full" style={{ border: `2px solid ${chon ? MAU.acc : MAU.muted}` }}>
                {chon && <span className="h-2.5 w-2.5 rounded-full" style={{ background: MAU.acc }} />}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[16px] font-bold">{l.ten}</span>
                <span className="block text-[13px]" style={{ color: MAU.muted }}>{l.mo}</span>
              </span>
            </button>
          )
        })}
        <button onClick={() => { doLai(); setDaDo(true) }} className="mt-1 h-10 rounded-xl text-[15px] font-bold" style={{ color: MAU.acc, border: `1.5px solid ${MAU.acc}` }}>Đo lại máy này</button>
        {daDo && <p className="text-center text-[13px]" style={{ color: MAU.muted }}>Mở bản đồ phiêu lưu là app tự đo lại trong khoảng 2 giây.</p>}
      </div>
    </>,
    document.body,
  )
}

/** Nút nhỏ ⚙ trên bản đồ: mở TamDoHoa. */
export function NutDoHoa() {
  const [mo, setMo] = useState(false)
  const t = useDoHoa()
  return (
    <>
      <button onClick={() => setMo(true)} className="pointer-events-auto flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold"
        style={{ background: 'var(--sk-surface)', border: 'var(--sk-card-border)', color: MAU.ink, backdropFilter: 'var(--sk-blur)' }} aria-label="Chỉnh đồ hoạ">
        ⚙ Đồ hoạ: {TEN_MUC[t.muc]}
      </button>
      {mo && <TamDoHoa onDong={() => setMo(false)} />}
    </>
  )
}
