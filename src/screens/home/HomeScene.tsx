// CẢNH "PHÒNG HỌC" — Trang chính vẽ theo bộ ảnh ChatGPT (xem lib/canhErp.ts, design/YEU-CAU-ANH-STYLE-ERP.md).
// Sân khấu cố định W×H của cảnh (vd 1672×941), co đều theo khung chứa (không méo, có viền thừa). Lớp từ dưới lên:
//   nền → đồ vật tĩnh (bảng, biển, trang trí) / ô yêu thích / box nhóm theo z → nhân vật → CHỮ + SỐ + NÚT thật (HTML).
// Số ô yêu thích = 8; số box nhóm = số ngăn của CẢNH (6 hoặc 4). Không có logic dữ liệu ở đây — nhận node đã dựng từ HomeScreen.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Art, Canh, Rect } from '../../lib/canhErp'

export type MucCanh = { id: string; ten: string; onMo: () => void; onSao?: () => void }
export type NhomCanh = { khoa: string; ten: string; so?: number; onMo: () => void }

const ZOOM_CHU = 1.2   // chữ của các bảng to hơn 20% so với màn thường (sân khấu thường bị thu nhỏ ~0,8)

const vung = (a: Art, tb: Rect): Rect => {
  const sx = a.place[2] / a.w, sy = a.place[3] / a.h
  return [a.place[0] + tb[0] * sx, a.place[1] + tb[1] * sy, tb[2] * sx, tb[3] * sy]
}
const px = (r: Rect): CSSProperties => ({ position: 'absolute', left: r[0], top: r[1], width: r[2], height: r[3] })

/** Nơi nội dung HTML nằm trong 1 text_box: phóng chữ ZOOM_CHU, cuộn dọc nếu dài. */
function NoiDung({ r, children, canGiua = false }: { r: Rect; children: ReactNode; canGiua?: boolean }) {
  return (
    <div style={{ ...px(r), zIndex: 100, overflow: 'hidden' }} className="scene-bare">
      <div style={{ width: r[2] / ZOOM_CHU, height: r[3] / ZOOM_CHU, zoom: ZOOM_CHU, overflowY: 'auto', overflowX: 'hidden', display: canGiua ? 'flex' : 'block', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

export default function HomeScene({ canh, today, dev, order, profile, tuyChinh, giaoDien, yeuThich, nhom, hienNhanVat = true }: {
  canh: Canh
  today?: ReactNode; dev?: ReactNode; order?: ReactNode; profile?: ReactNode
  tuyChinh?: ReactNode; giaoDien?: ReactNode
  yeuThich: MucCanh[]; nhom: NhomCanh[]; hienNhanVat?: boolean
}) {
  const khung = useRef<HTMLDivElement>(null)
  const [kich, setKich] = useState<{ w: number; h: number }>({ w: 0, h: 0 })
  useEffect(() => {
    const el = khung.current
    if (!el) return
    const ro = new ResizeObserver(() => setKich({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el); setKich({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])
  const s = kich.w && kich.h ? Math.min(kich.w / canh.W, kich.h / canh.H) : 0
  const T = canh.tokens

  // ── các lớp, xếp theo z ──
  const lop: { z: number; k: string; node: ReactNode }[] = []
  for (const a of canh.tinh) lop.push({ z: a.z, k: a.id, node: <img key={a.id} src={a.file} alt="" draggable={false} style={{ ...px(a.place), zIndex: a.z }} /> })

  // ô yêu thích: ô có mục = hình ô i + nhãn + ★; ô chưa dùng = favorite-empty (nếu cảnh có)
  const lopYeuThich: ReactNode[] = []
  canh.yeuThichO.forEach((o, i) => {
    const muc = yeuThich[i]
    const art = muc ? canh.yeuThichArt[i] : canh.yeuThichTrong
    if (!art) return
    const k = Math.min(o[2] / art.w, o[3] / art.h)
    const dw = art.w * k, dh = art.h * k
    const dx = o[0] + (o[2] - dw) / 2, dy = o[1] + (o[3] - dh)   // contain: giữa ngang, sát đáy ô
    const r: Rect = [dx, dy, dw, dh]
    lop.push({ z: 30, k: `fav-${i}`, node: <img key={`fav-${i}`} src={art.file} alt="" draggable={false} style={{ ...px(r), zIndex: 30, opacity: muc ? 1 : 0.32 }} /> })
    if (!muc) return
    const lb = art.labelBox
    lopYeuThich.push(
      <div key={`fv-${i}`}>
        <button onClick={muc.onMo} title={muc.ten} className="scene-hit" style={{ ...px(r), zIndex: 110, background: 'none', border: 0, cursor: 'pointer' }} />
        {lb && (
          <div style={{ ...px([dx + lb[0] * k, dy + lb[1] * k, lb[2] * k, lb[3] * k]), zIndex: 111, pointerEvents: 'none', color: T.ink, fontFamily: `'${T.font_body ?? 'Be Vietnam Pro'}', sans-serif` }}
            className="flex items-center justify-center overflow-hidden text-center text-[15px] font-bold leading-tight">
            <span className="line-clamp-2">{muc.ten}</span>
          </div>
        )}
        {muc.onSao && art.badge && (
          <button onClick={muc.onSao} title="Bỏ khỏi Yêu thích"
            style={{ position: 'absolute', left: dx + art.badge[0] * k - 11, top: dy + art.badge[1] * k - 11, width: 22, height: 22, zIndex: 112, color: T.acc, background: 'none', border: 0, cursor: 'pointer', fontSize: 18, lineHeight: '22px' }}>★</button>
        )}
      </div>,
    )
  })

  // box nhóm: nhóm thứ i vào ngăn thứ i; hình lấy theo khoá nhóm
  const lopNhom: ReactNode[] = []
  nhom.slice(0, canh.nhomO.length).forEach((g, i) => {
    const o = canh.nhomO[i]
    const art = canh.nhomArt[g.khoa] ?? Object.values(canh.nhomArt)[0]
    if (!art) return
    const k = Math.min(o[2] / art.w, o[3] / art.h)
    const dw = art.w * k, dh = art.h * k
    const dx = o[0] + (o[2] - dw) / 2, dy = o[1] + (o[3] - dh)
    const r: Rect = [dx, dy, dw, dh]
    lop.push({ z: 30, k: `nh-${i}`, node: <img key={`nh-${i}`} src={art.file} alt="" draggable={false} style={{ ...px(r), zIndex: 30 }} /> })
    const lb = art.labelBox
    lopNhom.push(
      <div key={`ng-${i}`}>
        <button onClick={g.onMo} title={g.ten} className="scene-hit" style={{ ...px(r), zIndex: 110, background: 'none', border: 0, cursor: 'pointer' }} />
        {lb && (
          <div style={{ ...px([dx + lb[0] * k, dy + lb[1] * k, lb[2] * k, lb[3] * k]), zIndex: 111, pointerEvents: 'none', color: T.ink }}
            className="flex items-center justify-center overflow-hidden whitespace-nowrap text-center text-[15px] font-bold">{g.ten}</div>
        )}
        {g.so != null && art.badge && (
          <span style={{ position: 'absolute', left: dx + art.badge[0] * k - 24, top: dy + art.badge[1] * k - 10, zIndex: 112, background: '#fff', color: T.acc, borderRadius: 999, padding: '0 8px', fontSize: 12, fontWeight: 800, lineHeight: '20px', boxShadow: '0 1px 3px rgba(0,0,0,.25)', pointerEvents: 'none' }}>{g.so} mục</span>
        )}
      </div>,
    )
  })

  if (hienNhanVat) for (const a of canh.nhanVat) lop.push({ z: a.z, k: a.id, node: <img key={a.id} src={a.file} alt="" draggable={false} style={{ ...px(a.place), zIndex: a.z, pointerEvents: 'none' }} /> })
  lop.sort((a, b) => a.z - b.z)

  const bang = canh.bang
  const bienYT = bang.bienYeuThich
  const vars = {
    '--sk-ink': T.ink, '--sk-muted': T.muted, '--sk-acc': T.acc, '--sk-acc-ink': T.acc_ink ?? '#fff',
    '--sk-surface': T.surface, '--sk-surface2': T.surface2, '--sk-line': T.line, '--sk-bg': T.surface,
    '--sk-radius': `${T.radius ?? 16}px`, '--sk-radius-pill': '999px', '--sk-blur': 'none', '--sk-card-border': `1px solid ${T.line}`, '--sk-card-shadow': 'none',
    '--sk-font': `'${T.font_body ?? 'Be Vietnam Pro'}', sans-serif`, '--sk-font-head': `'${T.font_head ?? 'Baloo 2'}', sans-serif`,
    '--sk-head-case': 'none', '--sk-head-track': '0',
  } as CSSProperties

  return (
    <div ref={khung} className="relative h-full min-h-0 w-full overflow-hidden" style={{ background: T.surface2 }}>
      {s > 0 && (
        <div style={{ position: 'absolute', left: (kich.w - canh.W * s) / 2, top: (kich.h - canh.H * s) / 2, width: canh.W, height: canh.H, transform: `scale(${s})`, transformOrigin: 'top left', color: T.ink, fontFamily: `'${T.font_body ?? 'Be Vietnam Pro'}', sans-serif`, ...vars }}>
          <img src={canh.bg} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: canh.W, height: canh.H, zIndex: 0 }} />
          {lop.map((l) => l.node)}

          {/* chữ + số + nút thật */}
          {bang.today?.textBox && today && <NoiDung r={vung(bang.today, bang.today.textBox)}>{today}</NoiDung>}
          {bang.development?.textBox && dev && <NoiDung r={vung(bang.development, bang.development.textBox)}>{dev}</NoiDung>}
          {bang.order?.textBox && order && <NoiDung r={vung(bang.order, bang.order.textBox)}>{order}</NoiDung>}
          {bang.greeting?.textBox && profile && <NoiDung r={vung(bang.greeting, bang.greeting.textBox)} canGiua>{profile}</NoiDung>}
          {bienYT?.textBox && (
            <div style={{ ...px(vung(bienYT, bienYT.textBox)), zIndex: 100, color: T.ink, fontFamily: `'${T.font_head ?? 'Baloo 2'}', sans-serif` }}
              className="flex items-center justify-center whitespace-nowrap text-[22px] font-extrabold">★ Yêu thích</div>
          )}
          {canh.nutCong.chinh?.textBox && tuyChinh && (
            <div style={{ ...px(vung(canh.nutCong.chinh, canh.nutCong.chinh.textBox)), zIndex: 120 }} className="scene-bare-btn flex items-center justify-center text-center">{tuyChinh}</div>
          )}
          {canh.nutCong.phu?.textBox && giaoDien && (
            <div style={{ ...px(vung(canh.nutCong.phu, canh.nutCong.phu.textBox)), zIndex: 120 }} className="scene-bare-btn flex items-center justify-center text-center">{giaoDien}</div>
          )}
          {lopYeuThich}
          {lopNhom}
        </div>
      )}
    </div>
  )
}
