// TẦNG 1 — THẾ GIỚI (bản đồ 2.5D). Cảnh vẽ bằng three.js; nhãn tên + tiến độ là nút HTML bám theo lục địa (chạm/bấm được, đọc được bằng trình đọc màn hình).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { HEAD, NhanHS, THE_TRON, TrongHS, useMedia } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { LucDiaVao } from '../skin/the3d/canhTheGioi'
import { thongKe, type BanDoV } from './kieu'
import { nap3D, useCanh } from './Canh3D'

export function TheGioiView({ banDo, b, onChon, hienTai, thanh }: { banDo: BanDoV; b: BangMau3D; onChon: (ma: string) => void; hienTai?: string | null; thanh?: ReactNode }) {
  const ds = useMemo<(LucDiaVao & { dat: number })[]>(() => banDo.luc_dia.map((l) => {
    const t = thongKe(l)
    return { ma: l.ma, ten: l.ten, biome: l.biome, soDang: t.tong, trangThai: t.trangThai, loai: t.loai, khoi: t.khoi, dat: t.dat }
  }), [banDo])
  const [hov, setHov] = useState<string | null>(null)
  const dai = useMedia('(min-width:768px)')
  const chonRef = useRef(onChon); chonRef.current = onChon
  const nhan = useRef(new Map<string, HTMLElement>())
  const { host, canh, loi } = useCanh(async (h) => (await nap3D.theGioi()).dungTheGioi(h, b, ds, { chon: (m) => chonRef.current(m), hover: setHov }), [ds, b])

  useEffect(() => {
    if (!canh) return
    const huy: Array<() => void> = []
    for (const [ma, el] of nhan.current) { const pos = canh.neo.get(ma); if (pos) huy.push(canh.sk.gan({ el, pos, duoi: true, hien: () => canh.hienNhan() })) }
    return () => huy.forEach((f) => f())
  }, [canh])

  if (loi) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <TrongHS>Máy này chưa vẽ được bản đồ 3D. Chọn chủ đề ở danh sách bên dưới.</TrongHS>
        {ds.map((d) => <button key={d.ma} onClick={() => onChon(d.ma)} className="px-3 py-2 text-left text-[14px]" style={THE_TRON}>{d.ten} · {d.dat}/{d.soDang} chặng đạt</button>)}
      </div>
    )
  }
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--sk-bg)' }}>
      <div ref={host} className="absolute inset-0" />
      {thanh && <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap justify-center gap-2">{thanh}</div>}
      <div className="pointer-events-none absolute inset-0">
        {ds.map((d) => (
          <button key={d.ma} ref={(el) => { if (el) nhan.current.set(d.ma, el); else nhan.current.delete(d.ma) }} onClick={() => onChon(d.ma)}
            onPointerEnter={() => { setHov(d.ma); canh?.hover(d.ma) }} onPointerLeave={() => { setHov(null); canh?.hover(null) }}
            className={`pointer-events-auto absolute left-0 top-0 flex flex-col items-center gap-0.5 px-2 py-1 text-center transition-[box-shadow,filter] duration-150 ${dai ? 'max-w-[170px]' : 'max-w-[104px]'}`}
            style={{ ...THE_TRON, visibility: 'hidden', borderRadius: 12, background: hov === d.ma ? 'var(--sk-surface2)' : 'var(--sk-surface)', borderColor: hov === d.ma ? 'var(--sk-acc)' : undefined }}>
            {hienTai === d.ma && <span className="rounded-full px-2 text-[10.5px] font-bold" style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>Em đang ở đây</span>}
            <span className="line-clamp-2 text-[12px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)', fontSize: dai ? undefined : 10 }}>{d.ten}</span>
            {!dai ? null : d.trangThai === 'fog'
              ? <NhanHS mau="var(--sk-muted)">Chưa đo</NhanHS>
              : <NhanHS mau={d.trangThai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{d.dat}/{d.soDang} chặng đạt</NhanHS>}
          </button>
        ))}
      </div>
    </div>
  )
}
