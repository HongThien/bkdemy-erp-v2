// TẦNG 3 — CHẶNG ĐƯỜNG. Cảnh 3D: con đường qua vùng, mỗi chặng (dạng) là 1 bệ có đội quái; phải: chi tiết chặng đang chọn + nút vào màn đấu.
import { useEffect, useMemo, useRef, useState } from 'react'
import { DauTrangHS, HEAD, NhanHS, NutHS, THE, THE_TRON, useMedia } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import { TEN_LOAI } from '../skin/the3d/loai'
import type { ChangV, LucDiaV, VungV } from './kieu'
import { nap3D, useCanh } from './Canh3D'

const sao = (n: number) => '★'.repeat(Math.min(5, n)) + '☆'.repeat(Math.max(0, 5 - n))
const moTa = (c: ChangV) => (c.trang_thai === 'dat' ? 'đã hạ' : c.trang_thai === 'yeu' ? (c.hp != null ? `còn ${c.hp} đòn` : 'còn quái') : 'chưa gặp')

export function ChangView({ luc, vung, b, onVe, onVao }: { luc: LucDiaV; vung: VungV; b: BangMau3D; onVe: () => void; onVao: (c: ChangV) => void }) {
  const dai = useMedia('(min-width:1024px)')
  const [sel, setSel] = useState<string>(() => (vung.chang.find((c) => c.trang_thai === 'yeu') ?? vung.chang[0]).ma)
  const [hov, setHov] = useState<string | null>(null)
  const ds = useMemo(() => vung.chang.map((c) => ({ ma: c.ma, trangThai: c.trang_thai, quai: c.quai })), [vung])
  const nhan = useRef(new Map<string, HTMLElement>()), nhanHero = useRef<HTMLElement | null>(null)
  const { host, canh, loi } = useCanh(async (h) => (await nap3D.chang()).dungChang(h, b, { biome: luc.biome, ma: vung.ma }, ds, { chon: setSel, hover: setHov }), [ds, b, vung.ma])
  useEffect(() => {
    if (!canh) return
    const huy: Array<() => void> = []
    for (const [ma, el] of nhan.current) { const pos = canh.neo.get(ma); if (pos) huy.push(canh.sk.gan({ el, pos, duoi: true })) }
    if (canh.neoHero && nhanHero.current) huy.push(canh.sk.gan({ el: nhanHero.current, pos: canh.neoHero }))
    return () => huy.forEach((f) => f())
  }, [canh])
  useEffect(() => { canh?.chon(sel) }, [canh, sel])
  useEffect(() => { canh?.sk.chuaPhai(dai ? 330 : 0) }, [canh, dai])
  const c = vung.chang.find((x) => x.ma === sel) ?? vung.chang[0]

  return (
    <div className="absolute inset-0" style={{ background: 'var(--sk-bg)' }}>
      <div ref={host} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        {vung.chang.map((x) => (
          <button key={x.ma} ref={(el) => { if (el) nhan.current.set(x.ma, el); else nhan.current.delete(x.ma) }} onClick={() => { setSel(x.ma); canh?.chon(x.ma) }}
            onPointerEnter={() => { setHov(x.ma); canh?.hover(x.ma) }} onPointerLeave={() => { setHov(null); canh?.hover(null) }}
            className={`pointer-events-auto absolute left-0 top-0 flex flex-col items-center text-center ${dai ? 'w-[150px] gap-0.5 px-2 py-1' : 'h-7 w-7 justify-center'}`}
            style={{ ...THE_TRON, visibility: 'hidden', borderRadius: dai ? 10 : 999, background: hov === x.ma || sel === x.ma ? 'var(--sk-surface2)' : 'var(--sk-surface)', borderColor: sel === x.ma ? 'var(--sk-acc)' : undefined }}>
            {dai ? <>
              <span className="line-clamp-2 text-[11.5px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{x.ten}</span>
              <span className="text-[10.5px]" style={{ color: 'var(--sk-muted)' }}>{x.quai.length} quái · {x.so_cau_luot ?? '?'} câu · {moTa(x)}</span>
            </> : <span className="text-[12px] font-extrabold" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{vung.chang.indexOf(x) + 1}</span>}
          </button>
        ))}
        <span ref={nhanHero} className="absolute left-0 top-0 rounded-full px-2 text-[11px] font-bold" style={{ visibility: 'hidden', background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>Em ở đây</span>
      </div>
      <div className="absolute left-0 right-0 top-0 p-3"><DauTrangHS tieuDe={vung.ten} phu={`${luc.ten}`} onBack={onVe} /></div>
      {loi && <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[14px]" style={{ color: 'var(--sk-muted)' }}>Máy này chưa vẽ được bản đồ 3D.</div>}
      <aside className={`absolute flex flex-col gap-2.5 p-4 ${dai ? 'bottom-4 right-4 top-[72px] w-[300px]' : 'bottom-3 left-3 right-3 max-h-[46%] overflow-y-auto'}`} style={THE}>
        <div className="flex flex-wrap gap-1.5">
          <NhanHS mau={c.trang_thai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{c.trang_thai === 'dat' ? 'Đã chinh phục' : c.trang_thai === 'yeu' ? 'Quái còn máu' : 'Phủ sương · vào được'}</NhanHS>
          <NhanHS>{c.quai.length} quái</NhanHS>
        </div>
        <h3 className="text-[18px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{c.ten}</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[12.5px]">
          <dt style={{ color: 'var(--sk-muted)' }}>Mức độ</dt><dd className="text-right">{sao(c.muc_do)}</dd>
          <dt style={{ color: 'var(--sk-muted)' }}>Độ nắm dạng</dt><dd className="text-right">{c.mastery == null ? 'chưa đo' : `${Math.round(c.mastery * 100)}%`}</dd>
          <dt style={{ color: 'var(--sk-muted)' }}>Một lượt</dt><dd className="text-right">{c.so_cau_luot != null ? `${c.so_cau_luot} câu` : '5–10 câu'}</dd>
        </dl>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="mb-1 text-[11.5px]" style={{ color: 'var(--sk-muted)' }}>Đội hình · đánh lần lượt, hạ hết cả đội</p>
          <div className="flex flex-col gap-1">
            {c.quai.map((q, i) => (
              <div key={i} className="flex items-center justify-between px-2.5 py-1 text-[12.5px]" style={{ ...THE_TRON, borderRadius: 8, opacity: c.trang_thai === 'chua_do' ? 0.65 : 1 }}>
                <span><b style={{ ...HEAD, color: 'var(--sk-ink)' }}>{TEN_LOAI[q.loai] ?? q.loai}</b> <span style={{ color: 'var(--sk-muted)' }}>· {q.boss ? 'Boss cuối' : `Elite ${i + 1}`}</span></span>
              </div>
            ))}
          </div>
        </div>
        <NutHS onClick={() => onVao(c)}>{c.trang_thai === 'dat' ? 'Ôn lại chặng' : 'Vào màn đấu'}</NutHS>
      </aside>
    </div>
  )
}
