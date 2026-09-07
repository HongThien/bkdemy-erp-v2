// CHUỖI Hình = 1 BÀI nhiều Ý a), b), c)… (Thùy 06/09 tối: "mỗi câu trong chuỗi sẽ thành ý a,b,c,d của một bài —
// làm giống builder ấy"). Tối giản: CHỈ mã bài toán + đề + ý a/b/c (không mô hình/cấp/trạng thái).
// Đề bài GHÉP CHUNG 1 CARD (không có card riêng cho từng ý) — Thùy 06/09 tối (2): "ghép chung tất cả lại thành 1
// card chung đi, ko cần card riêng. Hình mặc định lấy ý cuối để hiển thị." → CumDe/ChuoiDoc dùng ẢNH CỦA Ý CUỐI
// đang hiện, không lặp ảnh từng ý. CHỈ RIÊNG lúc GIẢI (ChuoiSoan) mới cần hiện LŨY TIẾN theo builder: click ý a
// → đề gồm ý a; click ý b → đề gồm ý a+ý b + ảnh của ý b — vì soạn xong mỗi ý ghép ngay được vào kho.
//   · ChuoiDoc  — đọc cả chuỗi, 1 card, ảnh = ảnh ý CUỐI. Dùng ở Kho bài · Bài của tôi (không đang soạn) · Duyệt.
//   · ChuoiSoan — builder: tab a)/b)/c)… đề LŨY TIẾN 0..ý đang chọn, RichMathBox cho ý đang chọn (KHÔNG hiện LaTeX
//                 thô — gõ liền chữ + công thức như MathType, chỉ hiện công thức đã dựng, sửa được bằng click).
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MathText } from '../kho/ui'
import { SoanWorkspace, type SoanWorkspaceHandle } from '../../soan/SoanWorkspace'
import '../../soan/soan.css'
import { chuY, laHinh, layChuoi, yCanNhap, type ChuoiHinh as ChuoiHinhT, type ChuoiY, type GiaiBaiNhanh, type YNhap } from '../../lib/giaibai'

export const chuoiKey = (nhanh: GiaiBaiNhanh, key: string) => `${nhanh}:${key}`
/** Nạp chuỗi cho mọi dòng Hình trong `rows` (1 RPC / nhánh, chỉ key chưa có). Trả Map `${nhanh}:${key}` → chuỗi. */
export function useChuoi(rows: { nhanh: GiaiBaiNhanh; key: string }[]) {
  const [map, setMap] = useState<Map<string, ChuoiHinhT>>(new Map())
  const dang = useRef<Set<string>>(new Set())
  const can = rows.filter((r) => laHinh(r.nhanh) && !map.has(chuoiKey(r.nhanh, r.key)) && !dang.current.has(chuoiKey(r.nhanh, r.key)))
  const sig = can.map((r) => chuoiKey(r.nhanh, r.key)).join('|')
  useEffect(() => {
    if (!sig) return
    const theo = new Map<GiaiBaiNhanh, string[]>()
    for (const r of can) { dang.current.add(chuoiKey(r.nhanh, r.key)); theo.set(r.nhanh, [...(theo.get(r.nhanh) ?? []), r.key]) }
    for (const [nhanh, keys] of theo) {
      layChuoi(nhanh, keys)
        .then((m) => setMap((old) => { const n = new Map(old); for (const [k, v] of m) n.set(chuoiKey(nhanh, k), v); return n }))
        .catch((e) => console.error('layChuoi', nhanh, e))
        .finally(() => keys.forEach((k) => dang.current.delete(chuoiKey(nhanh, k))))
    }
  }, [sig]) // eslint-disable-line
  return map
}

function NhanY({ i, y }: { i: number; y: ChuoiY }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="font-semibold text-slate-700">{chuY(i)}</span>
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">{y.ma}</code>
      {y.la_dich && <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">ĐÍCH</span>}
    </span>
  )
}

function YDe({ y }: { y: ChuoiY }) {
  return (
    <div className="text-[14px] leading-relaxed text-slate-800">
      {(y.gia_thiet_rieng || y.gia_thiet_phu) && (
        <div className="mb-0.5 text-[13px] text-slate-600"><MathText>{[y.gia_thiet_rieng, y.gia_thiet_phu].filter(Boolean).join('; ')}</MathText></div>
      )}
      <MathText>{y.phat_bieu}</MathText>
    </div>
  )
}

/** Đề gộp 1 khối — ý 0..upTo (bao gồm); ảnh = ảnh của ý upTo (ý cuối ĐANG hiện), không lặp ảnh từng ý. */
export function CumDe({ chuoi, upTo, compact }: { chuoi: ChuoiHinhT; upTo: number; compact?: boolean }) {
  const anh = chuoi.y[upTo]?.anh
  return (
    <div className={anh && !compact ? 'grid grid-cols-[1fr_auto] gap-3' : ''}>
      <div className="space-y-2">
        {chuoi.y.slice(0, upTo + 1).map((y, i) => (
          <div key={y.id}>
            <div className="mb-0.5"><NhanY i={i} y={y} /></div>
            <YDe y={y} />
          </div>
        ))}
      </div>
      {anh && !compact && <img src={anh} alt="hình" className="max-h-56 max-w-[260px] self-start rounded-lg border border-slate-200 bg-white" />}
    </div>
  )
}

/** Đọc cả chuỗi — 1 CARD CHUNG (không card riêng từng ý), ảnh mặc định = ảnh ý CUỐI. */
export function ChuoiDoc({ chuoi, compact }: { chuoi: ChuoiHinhT; compact?: boolean }) {
  const [mo, setMo] = useState<Set<string>>(new Set())
  const coLoiGiai = chuoi.y.some((y) => y.loi_giai || y.anh_loi_giai)
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
      <CumDe chuoi={chuoi} upTo={chuoi.y.length - 1} compact={compact} />
      {coLoiGiai && (
        <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
          {chuoi.y.map((y, i) => (y.loi_giai || y.anh_loi_giai) ? (
            <div key={y.id}>
              <button onClick={() => setMo((s) => { const n = new Set(s); n.has(y.id) ? n.delete(y.id) : n.add(y.id); return n })} className="text-[12px] font-medium text-indigo-600 hover:text-indigo-800">
                {mo.has(y.id) ? `▾ Ẩn lời giải ${chuY(i)}` : `▸ Xem lời giải ${chuY(i)} hiện có`}
              </button>
              {mo.has(y.id) && (
                <div className="mt-1 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-[13px] leading-relaxed text-slate-700">
                  {y.loi_giai && <MathText>{y.loi_giai}</MathText>}
                  {y.anh_loi_giai && <img src={y.anh_loi_giai} alt="ảnh lời giải" className="mt-1 max-h-48 max-w-full rounded-lg border border-slate-200" />}
                </div>
              )}
            </div>
          ) : null)}
        </div>
      )}
    </div>
  )
}

/** Lời giải ĐÃ NHẬP theo ý (Bài của tôi · chờ duyệt / Duyệt). Ý là bản Claude: ghi giữ nguyên/đã sửa, mở bản gốc để so. */
export function YNhapDoc({ chuoi, yNhap }: { chuoi: ChuoiHinhT; yNhap: YNhap[] }) {
  const [goc, setGoc] = useState<Set<string>>(new Set())
  return (
    <div className="space-y-2">
      {yNhap.map((v) => {
        const i = chuoi.y.findIndex((x) => x.id === v.id)
        const y = chuoi.y[i]
        if (!y) return null
        const claude = y.trang_thai === 'claude' && y.loi_giai
        const giuNguyen = claude && (y.loi_giai ?? '').trim() === (v.loi_giai ?? '').trim()
        return (
          <div key={v.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
              <NhanY i={i} y={y} />
              {claude && (
                <button onClick={() => setGoc((s) => { const n = new Set(s); n.has(v.id) ? n.delete(v.id) : n.add(v.id); return n })}
                  className="ml-auto rounded border border-fuchsia-200 bg-fuchsia-50 px-1.5 py-0.5 text-[11px] text-fuchsia-700 hover:bg-fuchsia-100">
                  🤖 {goc.has(v.id) ? 'Ẩn bản Claude' : 'So với bản Claude'} · {giuNguyen ? 'giữ nguyên' : 'đã sửa'}
                </button>
              )}
            </div>
            <div className="text-[13px] leading-relaxed text-slate-800"><MathText>{v.loi_giai}</MathText></div>
            {v.anh && <img src={v.anh} alt="ảnh" className="mt-1 max-h-48 max-w-full rounded-lg border border-slate-200" />}
            {claude && goc.has(v.id) && (
              <div className="mt-2 rounded-md border border-fuchsia-200 bg-fuchsia-50/50 px-3 py-2">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700">Bản Claude gốc</div>
                <div className="text-[13px] leading-relaxed text-slate-700"><MathText>{y.loi_giai}</MathText></div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** FULL MÀN — toggle a)/b)/c)… NGAY TRONG NÀY (Thùy 06/09 tối (4): "chọn ý a,b,c ở chỗ full màn luôn đi… full màn
 *  cũng cần có toggle ý a,b,c ấy"). Đổi ý → chụp lại buffer đang gõ của ý cũ (SoanWorkspaceHandle.getValue — KHÔNG
 *  qua nút Lưu, đổi ý mà chưa bấm Lưu vẫn không mất) rồi mới nạp ý mới; `key={y.id}` ép SoanWorkspace remount đúng
 *  nội dung. Đề bên trái = CumDe lũy tiến 0..ý đang chọn. */
function ChuoiSoanModal({ chuoi, values, active, onActive, onChange, tieuDe, onClose }: {
  chuoi: ChuoiHinhT; values: YNhap[]; active: number; onActive: (i: number) => void
  onChange: (v: YNhap[]) => void; tieuDe: string; onClose: () => void
}) {
  const wsRef = useRef<SoanWorkspaceHandle>(null)
  const get = (id: string) => values.find((v) => v.id === id) ?? { id, loi_giai: null, anh: null }
  const set = (id: string, raw: string) => onChange(values.some((v) => v.id === id) ? values.map((v) => (v.id === id ? { ...v, loi_giai: raw || null } : v)) : [...values, { id, loi_giai: raw || null, anh: null }])
  const y = chuoi.y[active]
  const chon = (i: number) => { const raw = wsRef.current?.getValue(); if (raw !== undefined && y) set(y.id, raw); onActive(i) }
  const dong = () => { const raw = wsRef.current?.getValue(); if (raw !== undefined && y) set(y.id, raw); onClose() }
  if (!y) return null
  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-100" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-4 pt-2">
        <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Ý</span>
        {chuoi.y.map((yy, i) => {
          const co = !!get(yy.id).loi_giai?.trim()
          return (
            <button key={yy.id} onClick={() => chon(i)}
              className={`rounded-t-md border-b-2 px-3 py-1.5 text-[13px] font-semibold transition ${active === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
              {chuY(i)}{yy.la_dich ? ' ★' : ''}{yCanNhap(yy) && co ? ' ✓' : ''}
            </button>
          )
        })}
        <button onClick={dong} className="ml-auto rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">✕ Đóng</button>
      </div>
      <div className="min-h-0 flex-1">
        <SoanWorkspace ref={wsRef} key={y.id} initial={get(y.id).loi_giai ?? ''} title={`${tieuDe} · ${chuY(active)}`}
          deBai={<CumDe chuoi={chuoi} upTo={active} />} onSave={(raw) => set(y.id, raw)} />
      </div>
    </div>,
    document.body,
  )
}

/** Điểm vào soạn chuỗi Hình — LUÔN full màn (Thùy: "sẽ ko có ai sửa ở cái màn bé tí kia đâu"): mở SẴN full màn ngay
 *  khi lên (không cần bấm thêm) — component này chỉ còn tác dụng khi người dùng đóng full màn giữa chừng: lúc đó
 *  hiện tóm tắt (ChuoiDoc) + nút mở lại. */
export function ChuoiSoan({ chuoi, values, onChange, tieuDe }: {
  chuoi: ChuoiHinhT; values: YNhap[]; onChange: (v: YNhap[]) => void; tieuDe: string
}) {
  const [active, setActive] = useState(() => { const i = chuoi.y.findIndex(yCanNhap); return i >= 0 ? i : 0 })
  const [soan, setSoan] = useState(true)   // tự mở full màn ngay
  const soY = chuoi.y.filter(yCanNhap).length
  const xong = values.filter((v) => v.loi_giai?.trim()).length
  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3">
        <ChuoiDoc chuoi={chuoi} compact />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[12px] text-slate-500">{xong}/{soY} ý đã có lời giải</span>
          <button onClick={() => setSoan(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">
            ⤢ {xong > 0 ? 'Tiếp tục soạn' : 'Soạn lời giải'} — full màn
          </button>
        </div>
      </div>
      {soan && (
        <ChuoiSoanModal chuoi={chuoi} values={values} active={active} onActive={setActive} onChange={onChange} tieuDe={tieuDe} onClose={() => setSoan(false)} />
      )}
    </div>
  )
}
