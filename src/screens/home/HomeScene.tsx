// CẢNH "PHÒNG HỌC" — Trang chính vẽ theo bộ ảnh ChatGPT (xem lib/canhErp.ts, design/YEU-CAU-ANH-STYLE-ERP.md).
// Sân khấu cố định W×H của cảnh (vd 1672×941), co đều theo khung chứa (không méo, có viền thừa). Lớp từ dưới lên:
//   nền → đồ vật tĩnh (bảng, biển, trang trí) / ô yêu thích / box nhóm theo z → nhân vật → CHỮ + SỐ + NÚT thật (HTML).
// Số ô yêu thích = 8; số box nhóm = số ngăn của CẢNH (6 hoặc 4). Không có logic dữ liệu ở đây — nhận node đã dựng từ HomeScreen.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Art, Canh, Rect } from '../../lib/canhErp'

export type MucCanh = { id: string; ten: string; onMo: () => void; onSao?: () => void }
export type NhomCanh = { khoa: string; ten: string; so?: number; onMo: () => void }

// ── LUẬT CHỮ (Thùy 14/10: "chữ lệch khỏi ảnh — phải có rule điều chỉnh") ──
// R1. Chữ chỉ nằm TRONG text_box / label_box của ảnh — không tràn ra ngoài khung vẽ.
// R2. Nhãn (yêu thích / nhóm): bắt đầu NHAN_MAX, tối đa 2 dòng, tràn thì co từng nấc tới NHAN_MIN; hết nấc vẫn tràn thì cắt, không đè ra ngoài.
// R3. Bảng nội dung: phóng ZOOM_CHU; nội dung tràn NGANG (hoặc tràn dọc với ô canh giữa) thì giảm zoom từng nấc tới ZOOM_MIN. Ô cuộn được thì tràn dọc cứ cuộn.
// R4. Lề trong: lùi vào so với text_box LE_NGANG × rộng, LE_DOC × cao (đệm khung gỗ/viền); manifest có thể khai `text_inset` [trái, trên, phải, dưới] (px của ảnh) để ghi đè.
const ZOOM_CHU = 1.2, ZOOM_MIN = 0.78, ZOOM_NAC = 0.04
const NHAN_MAX = 15, NHAN_MIN = 9
const LE_NGANG = 0.035, LE_DOC = 0.03

const vung = (a: Art, tb: Rect): Rect => {
  const sx = a.place[2] / a.w, sy = a.place[3] / a.h
  return [a.place[0] + tb[0] * sx, a.place[1] + tb[1] * sy, tb[2] * sx, tb[3] * sy]
}
/** text_box → vùng chữ thật sau khi trừ lề trong (R4). */
const vungChu = (a: Art, tb: Rect): Rect => {
  const r = vung(a, tb)
  const sx = a.place[2] / a.w, sy = a.place[3] / a.h
  const [l, t, rr, b] = a.textInset
    ? [a.textInset[0] * sx, a.textInset[1] * sy, a.textInset[2] * sx, a.textInset[3] * sy]
    : [r[2] * LE_NGANG, r[3] * LE_DOC, r[2] * LE_NGANG, r[3] * LE_DOC]
  return [r[0] + l, r[1] + t, Math.max(10, r[2] - l - rr), Math.max(10, r[3] - t - b)]
}
const px = (r: Rect): CSSProperties => ({ position: 'absolute', left: r[0], top: r[1], width: r[2], height: r[3] })

/** R3 — nơi nội dung HTML nằm trong 1 text_box: phóng chữ, tràn thì tự giảm zoom. */
function NoiDung({ r, children, canGiua = false }: { r: Rect; children: ReactNode; canGiua?: boolean }) {
  const [z, setZ] = useState(ZOOM_CHU)
  const trong = useRef<HTMLDivElement>(null)
  const dang = `${Math.round(r[2])}x${Math.round(r[3])}`
  useEffect(() => { setZ(ZOOM_CHU) }, [dang])
  useLayoutEffect(() => {
    const el = trong.current
    if (!el || z <= ZOOM_MIN) return
    const tranNgang = el.scrollWidth > el.clientWidth + 1
    const tranDoc = canGiua && el.scrollHeight > el.clientHeight + 1
    if (tranNgang || tranDoc) setZ((v) => Math.max(ZOOM_MIN, +(v - ZOOM_NAC).toFixed(2)))
  })
  return (
    <div style={{ ...px(r), zIndex: 100, overflow: 'hidden' }} className="scene-bare">
      <div ref={trong} style={{ width: r[2] / z, height: r[3] / z, zoom: z, overflowY: 'auto', overflowX: 'hidden', display: canGiua ? 'flex' : 'block', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

/** R2 — nhãn vừa khung: tối đa 2 dòng, tràn thì co cỡ chữ từng nấc. */
function NhanVua({ r, children, style }: { r: Rect; children: string; style?: CSSProperties }) {
  const [fs, setFs] = useState(NHAN_MAX)
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => { setFs(NHAN_MAX) }, [children, r[2], r[3]])
  useLayoutEffect(() => {
    const e = el.current
    if (!e || fs <= NHAN_MIN) return
    if (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1) setFs((v) => Math.max(NHAN_MIN, v - 1))
  })
  return (
    <div ref={el} style={{ ...px(r), ...style, fontSize: fs, lineHeight: 1.1, overflow: 'hidden', wordBreak: 'break-word' }}
      className="flex items-center justify-center text-center font-bold">
      <span style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{children}</span>
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
          <NhanVua r={[dx + lb[0] * k, dy + lb[1] * k, lb[2] * k, lb[3] * k]}
            style={{ zIndex: 111, pointerEvents: 'none', color: T.ink, fontFamily: `'${T.font_body ?? 'Be Vietnam Pro'}', sans-serif` }}>{muc.ten}</NhanVua>
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
          <NhanVua r={[dx + lb[0] * k, dy + lb[1] * k, lb[2] * k, lb[3] * k]} style={{ zIndex: 111, pointerEvents: 'none', color: T.ink }}>{g.ten}</NhanVua>
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
          {bang.today?.textBox && today && <NoiDung r={vungChu(bang.today, bang.today.textBox)}>{today}</NoiDung>}
          {bang.development?.textBox && dev && <NoiDung r={vungChu(bang.development, bang.development.textBox)}>{dev}</NoiDung>}
          {bang.order?.textBox && order && <NoiDung r={vungChu(bang.order, bang.order.textBox)}>{order}</NoiDung>}
          {bang.greeting?.textBox && profile && <NoiDung r={vungChu(bang.greeting, bang.greeting.textBox)} canGiua>{profile}</NoiDung>}
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
