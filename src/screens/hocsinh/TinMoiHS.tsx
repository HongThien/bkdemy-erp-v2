// ============================================================================
// TinMoiHS — khung "Tin mới của em" BẬT LÊN khi học sinh mở app có sự kiện chưa đọc (giải thưởng, thành tựu, huy hiệu, xu…) — Thùy 17/10.
// Nguồn: hs_tin_moi (DB ghi lúc sự kiện xảy ra). "Đã đọc" ⇒ đánh dấu đã đọc cả nhóm; chạm nền/"Để sau" ⇒ chỉ ẩn trong phiên này (tin vẫn chưa đọc, còn ở Hòm thư).
// Chỉ VẼ: màu/khung theo skin (KhungHS), không số liệu nghiệp vụ.
// ============================================================================
import { useEffect, useState } from 'react'
import { HEAD, MAU, NutHS, THE, THE_TRON } from './skin/KhungHS'
import { docTinMoi, listTinMoiChuaDoc, type TinMoiHS } from '../../lib/tinmoi_hs'

const KHOA = 'bk_tin_moi_de_sau'   // sessionStorage: mã các tin em bấm "Để sau" trong phiên này (tin MỚI phát sinh sau đó vẫn bật lên)
const docDeSau = (): Set<string> => { try { return new Set(JSON.parse(sessionStorage.getItem(KHOA) ?? '[]') as string[]) } catch { return new Set() } }

/** `lamMoi` đổi giá trị mỗi lần em về màn chính ⇒ tải lại (sự kiện mới phát sinh trong phiên). */
export default function TinMoiHS({ lamMoi }: { lamMoi: unknown }) {
  const [ds, setDs] = useState<TinMoiHS[]>([])
  const [deSauIds, setDeSauIds] = useState<Set<string>>(docDeSau)
  const [dang, setDang] = useState(false)

  useEffect(() => {
    let bo = false
    listTinMoiChuaDoc().then((r) => { if (!bo) setDs(r) }).catch(() => {})   // lỗi mạng: im lặng, không chặn app
    return () => { bo = true }
  }, [lamMoi])

  const hien = ds.filter((x) => !deSauIds.has(x.id))
  if (hien.length === 0) return null

  const deSau = () => {
    const moi = new Set([...deSauIds, ...hien.map((x) => x.id)])
    try { sessionStorage.setItem(KHOA, JSON.stringify([...moi])) } catch { /* không có sessionStorage: chỉ ẩn lần này */ }
    setDeSauIds(moi)
  }
  const daDoc = async () => {
    if (dang) return
    setDang(true)
    try { await docTinMoi(hien.map((x) => x.id)); setDs((cu) => cu.filter((x) => !hien.some((h) => h.id === x.id))) } catch { deSau() } finally { setDang(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 px-4 pb-6 sm:items-center" onClick={deSau} role="dialog" aria-modal="true" aria-label="Tin mới của em">
      <div className="flex max-h-[85dvh] w-full max-w-[440px] flex-col gap-3 overflow-y-auto p-5" onClick={(e) => e.stopPropagation()} style={{ ...THE_TRON, background: MAU.bg }}>
        <p className="text-center text-[22px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>
          {hien.length === 1 ? 'Em có 1 tin mới!' : `Em có ${hien.length} tin mới!`}
        </p>
        <div className="flex flex-col gap-2.5">
          {hien.map((t) => (
            <div key={t.id} className="flex items-start gap-3 p-3" style={THE}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-[28px]" style={{ background: MAU.surface2 }} aria-hidden>{t.bieu_tuong ?? '🔔'}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-extrabold leading-snug" style={{ color: MAU.ink }}>{t.tieu_de}</span>
                <span className="mt-0.5 block text-[14px] leading-snug" style={{ color: MAU.muted }}>{t.noi_dung}</span>
              </span>
            </div>
          ))}
        </div>
        <NutHS onClick={daDoc} tat={dang} className="w-full">Em đã đọc ♡</NutHS>
        <NutHS phu onClick={deSau} className="w-full">Để sau</NutHS>
      </div>
    </div>
  )
}
