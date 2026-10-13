// THANH ĐƯỜNG DẪN kiểu Windows Explorer (Thùy 13/10: "có thể quay lại bất cứ chỗ nào mình muốn"):
//   🏠 Trang chính › Vận hành › Vận hành lớp học › Buổi học
// • Bấm TÊN một cấp  ⇒ nhảy về cấp đó.
// • Bấm dấu › sau nó ⇒ xổ các mục NẰM TRONG cấp đó, chọn là sang thẳng (đi ngang, không phải lùi rồi tiến).
// • Cấp là thư mục không có trang riêng (vd "Vận hành lớp học") ⇒ bấm tên cũng xổ mục con.
// Màu đọc từ biến `--sk-*` của khối cha (xem erpSkin.ts) — component không tự chọn màu.
import { useEffect, useRef, useState } from 'react'
import type { NutMenu } from '../lib/menu'

function Dong({ n, dang, thut, onChon }: { n: NutMenu; dang: boolean; thut?: boolean; onChon: (id: string) => void }) {
  return (
    <button onClick={() => n.id && onChon(n.id)}
      className={`flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[13px] ${thut ? 'pl-6' : 'pl-2'} ${dang ? 'bg-[var(--sk-surface2)] font-semibold text-[var(--sk-acc)]' : 'text-[var(--sk-ink)] hover:bg-[var(--sk-surface2)]'}`}>
      <span className="w-5 shrink-0 text-center text-[14px] leading-none">{n.icon}</span>
      <span className="min-w-0 flex-1 truncate">{n.ten}</span>
      {n.con?.length ? <span className="text-[var(--sk-muted)]">›</span> : null}
    </button>
  )
}

export default function DuongDan({ duong, duoi, onDi, onDuoi, gon }: {
  duong: NutMenu[]
  // Cấp phụ nằm SAU màn đang mở, không có trong cây (vd "Chi tiết buổi", hoặc tên màn vào bằng card việc).
  duoi?: string | null
  onDi: (id: string) => void
  // Bấm lại đúng màn đang mở trong lúc có cấp phụ ⇒ đóng cấp phụ (về màn đó).
  onDuoi?: () => void
  // Bản hẹp (điện thoại): chỉ hiện 2 cấp cuối — nút 🏠 đứng riêng bên ngoài.
  gon?: boolean
}) {
  const [mo, setMo] = useState<number | null>(null)
  const khung = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (mo == null) return
    const ngoai = (e: MouseEvent) => { if (!khung.current?.contains(e.target as Node)) setMo(null) }
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') setMo(null) }
    document.addEventListener('mousedown', ngoai)
    document.addEventListener('keydown', phim)
    return () => { document.removeEventListener('mousedown', ngoai); document.removeEventListener('keydown', phim) }
  }, [mo])

  const chon = (id: string) => { setMo(null); onDi(id) }
  const cuoi = duong.length - 1
  const tu = gon ? Math.max(0, duong.length - 2) : 0
  return (
    <div ref={khung} className="flex min-w-0 items-center text-[13px]">
      {duong.map((n, i) => {
        if (i < tu) return null
        const dangO = i === cuoi && !duoi
        const coCon = !!n.con?.length
        const bamTen = () => {
          if (!n.id) { setMo(mo === i ? null : i); return }   // thư mục: xổ mục con
          setMo(null)
          if (i === cuoi && duoi) onDuoi?.(); else onDi(n.id)
        }
        return (
          <div key={i} className="relative flex min-w-0 items-center">
            <button onClick={bamTen} title={n.id ? `Về ${n.ten}` : n.ten}
              className={`flex min-w-0 items-center gap-1 rounded px-1.5 py-1 hover:bg-[var(--sk-surface2)] ${dangO ? 'font-semibold text-[var(--sk-ink)]' : 'text-[var(--sk-muted)] hover:text-[var(--sk-ink)]'}`}>
              {i === 0 && <span className="text-[13px] leading-none">{n.icon}</span>}
              <span className="max-w-[200px] truncate">{n.ten}</span>
            </button>
            {coCon ? (
              <button onClick={() => setMo(mo === i ? null : i)} title={`Các mục trong ${n.ten}`}
                className={`rounded px-1 py-1 leading-none hover:bg-[var(--sk-surface2)] hover:text-[var(--sk-acc)] ${mo === i ? 'bg-[var(--sk-surface2)] text-[var(--sk-acc)]' : 'text-[var(--sk-muted)]'}`}>
                <span className={`inline-block transition-transform ${mo === i ? 'rotate-90' : ''}`}>›</span>
              </button>
            ) : (i < cuoi || duoi) ? <span className="px-1 text-[var(--sk-muted)]">›</span> : null}
            {mo === i && coCon && (
              <div className={`absolute top-full z-[70] mt-1.5 max-h-[70vh] w-[250px] overflow-auto rounded-lg border border-[var(--sk-line)] bg-[var(--sk-bg)] p-1 shadow-2xl ${gon ? 'right-0' : 'left-0'}`}>
                {n.con!.map((c) => (c.id ? (
                  <Dong key={c.id} n={c} dang={duong[i + 1] === c} onChon={chon} />
                ) : (
                  <div key={c.ten}>
                    <div className="px-2 pb-0.5 pt-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--sk-muted)]">{c.ten}</div>
                    {c.con?.map((d) => <Dong key={d.id ?? d.ten} n={d} dang={duong[i + 2] === d} thut onChon={chon} />)}
                  </div>
                )))}
              </div>
            )}
          </div>
        )
      })}
      {duoi && <span className="truncate px-1.5 py-1 font-semibold text-[var(--sk-ink)]">{duoi}</span>}
    </div>
  )
}
