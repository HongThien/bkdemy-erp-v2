// CHỌN NHÂN VẬT CHÍNH (Thùy 03/10: "cho chọn nhân vật ngay khi bấm card Học tập — nhân vật này dùng cho mọi hoạt động của app, coi như nhân vật chính").
// Hiện lần đầu em bấm Học tập (chưa có dòng hs_nhan_vat_chinh) + đổi được bất cứ lúc nào từ khu Học tập. Lưu qua RPC fn_hs_chon_nhan_vat (DB — mọi máy cùng 1 nhân vật).
// Mỗi thẻ: nhân vật đứng thở (dung_1 ⇄ dung_2 900ms) — bấm chọn ⇒ nhân vật đổi tư thế thắng; nút xác nhận lưu.
import { useEffect, useState } from 'react'
import { DauTrangHS, HEAD, MAU, NutHS, THE_TRON } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { NV_CHON, anhDauNv, hopDauNv, moTaNv, tenNv, type NvId } from '../skin/nhanVat'
import type { TuTheDau } from '../skin/heroDau'

const CHU_NOI = { textShadow: '0 0 3px var(--sk-bg), 0 0 6px var(--sk-bg), 0 2px 10px var(--sk-bg)' }

/** Nhân vật đứng thở / ăn mừng — vẽ theo neo của bộ ảnh, chân chạm đáy khung. */
function NhanVatThoi({ id, cao, mung }: { id: NvId; cao: number; mung: boolean }) {
  const [k, setK] = useState(0)
  useEffect(() => { const t = window.setInterval(() => setK((x) => x + 1), mung ? 550 : 900); return () => window.clearInterval(t) }, [mung])
  const p: TuTheDau = mung ? (k % 2 ? 'thang_2' : 'thang_1') : (k % 2 ? 'dung_2' : 'dung_1')
  const w = cao * 0.9, h = hopDauNv(id, p, cao, w / 2, cao)
  return (
    <span className="relative block" style={{ width: w, height: cao }}>
      <img src={anhDauNv(id, p)} alt="" draggable={false} className="absolute max-w-none select-none" style={{ left: h.left, top: h.top, width: h.width, height: h.height }} />
    </span>
  )
}

export function ChonNhanVatHS({ dangCo, onXong, onBack, luu }: {
  /** nhân vật đang dùng (đổi nhân vật) — null = chọn lần đầu */
  dangCo: NvId | null
  onXong: (id: NvId) => void
  onBack: () => void
  /** ghi DB (fn_hs_chon_nhan_vat) — trang xem thử truyền hàm giả */
  luu: (id: NvId) => Promise<unknown>
}) {
  const [chon, setChon] = useState<NvId | null>(dangCo)
  const [dangLuu, setDangLuu] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const ht = laySkin(null).hocTap
  useEffect(() => { for (const id of NV_CHON) for (const p of ['dung_1', 'dung_2', 'thang_1', 'thang_2'] as TuTheDau[]) new Image().src = anhDauNv(id, p) }, [])
  const xacNhan = async () => {
    if (!chon) return
    setDangLuu(true); setLoi(null)
    try { await luu(chon); onXong(chon) } catch (e) { setLoi((e as Error).message); setDangLuu(false) }
  }
  const cao = typeof window === 'undefined' ? 220 : Math.round(Math.max(130, Math.min(260, window.innerHeight * 0.27, window.innerWidth * 0.3)))
  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto" style={{ background: ht?.nen ?? 'var(--sk-page)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <div className="px-4 pt-[calc(12px+env(safe-area-inset-top))]">
        <DauTrangHS tieuDe={dangCo ? 'Đổi nhân vật' : 'Chọn nhân vật của em'} phu="Nhân vật đồng hành cùng em trong mọi cuộc phiêu lưu" onBack={onBack} />
      </div>
      <div className="mx-auto grid w-full max-w-[1100px] flex-1 grid-cols-2 content-center gap-3 px-4 py-4 md:grid-cols-3 md:gap-4 xl:grid-cols-6">
        {NV_CHON.map((id) => {
          const dang = chon === id
          return (
            <button key={id} onClick={() => setChon(id)} aria-pressed={dang}
              className="relative flex flex-col items-center gap-1 px-2 pb-3 pt-2 transition active:scale-[0.98]"
              style={{ ...THE_TRON, borderRadius: 'var(--sk-radius)', background: dang ? 'color-mix(in srgb, var(--sk-acc) 22%, var(--sk-surface))' : 'var(--sk-surface)', outline: dang ? '2.5px solid var(--sk-acc)' : 'none', boxShadow: dang ? '0 0 26px color-mix(in srgb, var(--sk-acc) 55%, transparent)' : undefined }}>
              <NhanVatThoi id={id} cao={cao} mung={dang} />
              <span className="text-[17px] font-bold leading-tight md:text-[19px]" style={{ ...HEAD, ...CHU_NOI }}>{tenNv(id)}</span>
              <span className="text-center text-[12px] leading-snug md:text-[13px]" style={{ color: MAU.muted }}>{moTaNv(id)}</span>
              {dangCo === id && <span className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>Đang dùng</span>}
            </button>
          )
        })}
      </div>
      <div className="flex flex-col items-center gap-2 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        {loi && <p className="text-[13px]" style={{ color: MAU.sai }}>Chưa lưu được: {loi}</p>}
        <NutHS onClick={xacNhan} tat={!chon || dangLuu} className="min-w-[240px] !h-12 !text-[17px]">
          {dangLuu ? 'Đang lưu…' : chon ? `Chọn ${tenNv(chon)}` : 'Chạm vào một nhân vật'}
        </NutHS>
        <p className="text-[12px]" style={{ ...CHU_NOI, color: MAU.muted }}>Đổi lại được bất cứ lúc nào trong khu Học tập.</p>
      </div>
    </div>
  )
}
