// TẦNG 2 — LỤC ĐỊA (bản đồ 2.5D chia vùng). Trái: cảnh 3D, nhãn vùng bám theo; phải: danh sách vùng để bấm nhanh (chạm vùng nhỏ trên màn không dễ).
import { useEffect, useMemo, useRef, useState } from 'react'
import { DauTrangHS, HEAD, NhanHS, THE, THE_TRON } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { VungVao } from '../skin/the3d/canhLucDia'
import { thongKeVung, type LucDiaV } from './kieu'
import { nap3D, useCanh } from './Canh3D'
import { useDoHoa } from './DoHoa'

export function LucDiaView({ luc, b, onChon, onVe }: { luc: LucDiaV; b: BangMau3D; onChon: (ma: string) => void; onVe: () => void }) {
  const vungs = useMemo<(VungVao & { dat: number })[]>(() => luc.vung.map((v) => {
    const t = thongKeVung(v), khoi = v.chang.length > 0 && v.chang.filter((c) => c.muc_do >= 4).length * 2 > v.chang.length
    return { ma: v.ma, ten: v.ten, soDang: t.tong, trangThai: t.trangThai, loai: t.loai, khoi, dat: t.dat }
  }), [luc])
  const [hov, setHov] = useState<string | null>(null)
  const chonRef = useRef(onChon); chonRef.current = onChon
  const nhan = useRef(new Map<string, HTMLElement>())
  const muc = useDoHoa().muc // đổi mức đồ hoạ ⇒ dựng lại cảnh (chatLuong.ts)
  const { host, canh, loi } = useCanh(async (h) => (await nap3D.lucDia()).dungLucDia(h, b, { ma: luc.ma, biome: luc.biome }, vungs, { chon: (m) => chonRef.current(m), hover: setHov }), [vungs, b, luc.ma, muc])
  useEffect(() => {
    if (!canh) return
    const huy: Array<() => void> = []
    for (const [ma, el] of nhan.current) { const pos = canh.neo.get(ma); if (pos) huy.push(canh.sk.gan({ el, pos })) }
    return () => huy.forEach((f) => f())
  }, [canh])
  const trang = (v: (typeof vungs)[number]) => (v.trangThai === 'fog' ? 'Chưa đo' : `${v.dat}/${v.soDang} chặng đạt`)

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      <div className="px-4 pt-3"><DauTrangHS tieuDe={luc.ten} phu={`${luc.vung.length} vùng · chuyên đề giáp nhau, bấm một vùng để đi vào`} onBack={onVe} /></div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 pt-2 lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-[280px] overflow-hidden rounded-xl" style={{ border: 'var(--sk-card-border)' }}>
          <div ref={host} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0">
            {vungs.map((v) => (
              <button key={v.ma} ref={(el) => { if (el) nhan.current.set(v.ma, el); else nhan.current.delete(v.ma) }} onClick={() => onChon(v.ma)}
                onPointerEnter={() => { setHov(v.ma); canh?.hover(v.ma) }} onPointerLeave={() => { setHov(null); canh?.hover(null) }}
                className="pointer-events-auto absolute left-0 top-0 flex max-w-[170px] flex-col items-center gap-0.5 px-2 py-1 text-center"
                style={{ ...THE_TRON, visibility: 'hidden', borderRadius: 12, background: hov === v.ma ? 'var(--sk-surface2)' : 'var(--sk-surface)', borderColor: hov === v.ma ? 'var(--sk-acc)' : undefined }}>
                <span className="line-clamp-2 text-[13px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{v.ten}</span>
                <NhanHS mau={v.trangThai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{trang(v)}</NhanHS>
              </button>
            ))}
          </div>
          {loi && <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[15.5px]" style={{ color: 'var(--sk-muted)' }}>Máy này chưa vẽ được bản đồ 3D — chọn vùng ở danh sách.</div>}
        </div>
        <aside className="flex min-h-0 flex-col gap-2 overflow-y-auto p-3" style={THE}>
          <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)' }}>Các vùng</p>
          {vungs.map((v) => (
            <button key={v.ma} onClick={() => onChon(v.ma)} onPointerEnter={() => { setHov(v.ma); canh?.hover(v.ma) }} onPointerLeave={() => { setHov(null); canh?.hover(null) }}
              className="flex items-center justify-between gap-2 px-3 py-2 text-left" style={{ ...THE_TRON, background: hov === v.ma ? 'var(--sk-surface2)' : 'var(--sk-surface)' }}>
              <span className="min-w-0 text-[15px] font-semibold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{v.ten}</span>
              <NhanHS mau={v.trangThai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{trang(v)}</NhanHS>
            </button>
          ))}
        </aside>
      </div>
    </div>
  )
}
