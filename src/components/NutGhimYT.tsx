// NÚT ☆ GHIM + KHUNG CHỌN TAB (Thùy 29/10: "khi chọn 1 cái làm mục yêu thích thì cần chọn luôn tab hiển thị").
// Bấm ☆ ở bất kỳ đâu ⇒ khung nhỏ: tick tab nào thì mục nằm ở tab đó (một mục được ở nhiều tab), đếm n/12 từng tab,
// tab đầy thì không tick thêm được, tạo tab mới ngay tại chỗ (Enter là tạo + ghim luôn). Bỏ tick hết = bỏ ghim.
// Đổi là lưu ngay (store → nhan_su.menu_yeu_thich). Màu chỉ đọc `--sk-*` của khối cha (thanh trên / Trang chính).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useStore, useCayYT } from '../store/useStore'
import { YEU_THICH_TOI_DA } from '../lib/menu'
import { TAB_YT_TOI_DA } from '../lib/yeuThich'

export default function NutGhimYT({ mucId, nut, ben = 'phai', coDinh = false }: {
  mucId: string
  nut: (bat: boolean, mo: () => void) => ReactNode   // vẽ nút ☆/★ theo chỗ đặt; gọi mo() để mở khung
  ben?: 'phai' | 'trai'                                // khung bám mép phải / trái của nút
  coDinh?: boolean                                     // điện thoại: khung cố định giữa màn thay vì bám nút
}) {
  const cay = useCayYT()
  const ghimTabYT = useStore((s) => s.ghimTabYT)
  const themTabYT = useStore((s) => s.themTabYT)
  const [mo, setMo] = useState(false)
  const [moi, setMoi] = useState('')
  const khung = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mo) return
    const ngoai = (e: MouseEvent) => { if (!khung.current?.contains(e.target as Node)) setMo(false) }
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') setMo(false) }
    document.addEventListener('mousedown', ngoai)
    document.addEventListener('keydown', phim)
    return () => { document.removeEventListener('mousedown', ngoai); document.removeEventListener('keydown', phim) }
  }, [mo])

  const dangO = cay.tabs.filter((t) => t.muc.includes(mucId)).map((t) => t.id)
  const bat = dangO.length > 0
  const doi = (tabId: string) => ghimTabYT(mucId, dangO.includes(tabId) ? dangO.filter((x) => x !== tabId) : [...dangO, tabId])
  const tao = () => { const ten = moi.trim(); if (!ten) return; if (themTabYT(ten, mucId)) setMoi('') }

  return (
    <div ref={khung} className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
      {nut(bat, () => setMo(!mo))}
      {mo && (
        <div className={`z-[95] w-[260px] border border-[var(--sk-line)] bg-[var(--sk-bg)] p-2.5 text-left text-[var(--sk-ink)] shadow-2xl ${coDinh ? 'fixed inset-x-3 top-24 mx-auto' : `absolute top-full mt-1.5 ${ben === 'phai' ? 'right-0' : 'left-0'}`}`}
          style={{ borderRadius: 'var(--sk-radius)', fontFamily: 'var(--sk-font)' }}>
          <div className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sk-muted)]">Ghim vào tab Yêu thích</div>
          <ul className="max-h-[50vh] space-y-0.5 overflow-auto">
            {cay.tabs.map((t) => {
              const on = dangO.includes(t.id)
              const day = !on && t.muc.length >= YEU_THICH_TOI_DA
              return (
                <li key={t.id}>
                  <button onClick={() => doi(t.id)} disabled={day} title={day ? `Tab đã đủ ${YEU_THICH_TOI_DA} mục` : undefined}
                    className="flex w-full items-center gap-2 px-1.5 py-1.5 text-left text-[13px] hover:bg-[var(--sk-surface2)] disabled:cursor-not-allowed disabled:opacity-45" style={{ borderRadius: 8 }}>
                    <span aria-hidden className={`flex size-[17px] shrink-0 items-center justify-center border text-[11px] font-black leading-none ${on ? 'border-[var(--sk-acc)] bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'border-[var(--sk-line)]'}`} style={{ borderRadius: 5 }}>{on ? '✓' : ''}</span>
                    <span className={`min-w-0 flex-1 truncate ${on ? 'font-semibold' : ''}`}>{t.ten}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-[var(--sk-muted)]">{t.muc.length}/{YEU_THICH_TOI_DA}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {cay.tabs.length < TAB_YT_TOI_DA && (
            <form onSubmit={(e) => { e.preventDefault(); tao() }} className="mt-2 flex gap-1.5">
              <input value={moi} onChange={(e) => setMoi(e.target.value)} maxLength={30} placeholder="＋ Tab mới (tên)…"
                className="min-w-0 flex-1 border border-[var(--sk-line)] bg-[var(--sk-surface2)] px-2 py-1 text-[12.5px] text-[var(--sk-ink)] outline-none focus:border-[var(--sk-acc)]" style={{ borderRadius: 7 }} />
              <button type="submit" disabled={!moi.trim()} className="shrink-0 bg-[var(--sk-acc)] px-2.5 text-[12px] font-bold text-[var(--sk-acc-ink)] disabled:opacity-40" style={{ borderRadius: 7 }}>Tạo</button>
            </form>
          )}
          <div className="mt-2 flex items-center gap-2 px-1">
            <span className="text-[11px] text-[var(--sk-muted)]">{bat ? 'Bỏ tick hết = bỏ ghim' : 'Tick 1 tab để ghim'}</span>
            <button onClick={() => setMo(false)} className="ml-auto px-2 py-0.5 text-[12px] font-semibold text-[var(--sk-acc)] hover:underline">Xong</button>
          </div>
        </div>
      )}
    </div>
  )
}
