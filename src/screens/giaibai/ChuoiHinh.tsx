// CHUỖI Hình (Thùy 06/09 + docs/spec-kho-hinh-soan-chuoi.md): 1 bài = 1 ĐÍCH + bao đóng tiền đề.
//   · mode 'doc'  — hiện CẢ chuỗi để nhân sự đọc: giả thiết mô hình 1 lần, rồi từng ý (tiền đề trước, đích cuối) kèm
//                   phát biểu + trạng thái lời giải (đã duyệt / bản Claude / người viết / chưa có) + lời giải hiện có (gập).
//   · mode 'soan' — MỖI Ý CHƯA CHÍNH THỨC một ô nhập riêng (MathTextarea, ⤢ mở full màn với đề = cả chuỗi, ý đó nổi bật);
//                   ý đã duyệt chỉ đọc. Giá trị theo `YNhap[]` (khoá = id node — danh tính bám khoá, không bám vị trí).
// Nhãn ý = MÃ node (không a/b/c — spec §3: nhãn động theo tập tick, viện dẫn theo tên tính chất).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MathText } from '../kho/ui'
import { MathTextarea } from '../../components/math/MathTextarea'
import { laHinh, layChuoi, yCanNhap, type ChuoiHinh as ChuoiHinhT, type ChuoiY, type GiaiBaiNhanh, type YNhap } from '../../lib/giaibai'

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

const TT: Record<ChuoiY['trang_thai'], { nhan: string; cls: string }> = {
  chua: { nhan: 'chưa có lời giải', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  claude: { nhan: '🤖 bản Claude, chưa duyệt', cls: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200' },
  nguoi: { nhan: 'người viết, chưa duyệt', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  da_duyet: { nhan: '✓ đã duyệt', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
}

function GiaThietMoHinh({ c }: { c: ChuoiHinhT }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Giả thiết mô hình {c.mo_hinh.ma} · {c.mo_hinh.ten}</span>
      <div className="whitespace-pre-line"><MathText>{[c.mo_hinh.gia_thiet, c.mo_hinh.gia_thiet_them].filter(Boolean).join('\n')}</MathText></div>
    </div>
  )
}

function YHead({ y, k, tong }: { y: ChuoiY; k: number; tong: number }) {
  const tt = TT[y.trang_thai]
  return (
    <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
      <span className={`rounded px-1.5 py-0.5 font-semibold ${y.la_dich ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Ý {k}/{tong}{y.la_dich ? ' · ĐÍCH' : ''}</span>
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{y.ma}</code>
      <span className="text-slate-400">cấp {y.cap}{y.loai === 'bien_the' ? ' · biến thể' : ''}</span>
      <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ${tt.cls}`}>{tt.nhan}</span>
    </div>
  )
}

function YDe({ y }: { y: ChuoiY }) {
  return (
    <div className="text-[14px] leading-relaxed text-slate-800">
      {(y.gia_thiet_rieng || y.gia_thiet_phu) && (
        <div className="mb-0.5 text-[13px] text-slate-600">
          <span className="font-medium text-slate-500">{y.gt_thay_the ? 'Giả thiết (thay thế mô hình): ' : 'Giả thiết thêm: '}</span>
          <MathText>{[y.gia_thiet_rieng, y.gia_thiet_phu].filter(Boolean).join('; ')}</MathText>
        </div>
      )}
      <MathText>{y.phat_bieu}</MathText>
    </div>
  )
}

/** Đọc cả chuỗi (Kho bài · Bài của tôi · Duyệt · panel đề trong full màn). `noiBat` = id ý đang soạn (viền đậm). */
export function ChuoiDoc({ chuoi, noiBat, compact }: { chuoi: ChuoiHinhT; noiBat?: string; compact?: boolean }) {
  const [mo, setMo] = useState<Set<string>>(new Set())
  const tong = chuoi.y.length
  return (
    <div className="space-y-2">
      <GiaThietMoHinh c={chuoi} />
      {chuoi.y.map((y, i) => (
        <div key={y.id} className={`rounded-lg border px-3 py-2 ${noiBat === y.id ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-slate-200'} ${y.la_dich ? 'bg-white' : 'bg-slate-50/60'}`}>
          <YHead y={y} k={i + 1} tong={tong} />
          <div className={y.anh && !compact ? 'grid grid-cols-[1fr_auto] gap-3' : ''}>
            <YDe y={y} />
            {y.anh && !compact && <img src={y.anh} alt="hình" className="max-h-40 max-w-[220px] self-start rounded-lg border border-slate-200 bg-white" />}
          </div>
          {(y.loi_giai || y.anh_loi_giai) && (
            <div className="mt-1.5">
              <button onClick={() => setMo((s) => { const n = new Set(s); n.has(y.id) ? n.delete(y.id) : n.add(y.id); return n })} className="text-[12px] font-medium text-indigo-600 hover:text-indigo-800">
                {mo.has(y.id) ? '▾ Ẩn lời giải' : '▸ Xem lời giải hiện có'}
              </button>
              {mo.has(y.id) && (
                <div className="mt-1 rounded-md border border-dashed border-slate-200 bg-white px-3 py-2 text-[13px] leading-relaxed text-slate-700">
                  {y.loi_giai && <MathText>{y.loi_giai}</MathText>}
                  {y.anh_loi_giai && <img src={y.anh_loi_giai} alt="ảnh lời giải" className="mt-1 max-h-48 max-w-full rounded-lg border border-slate-200" />}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/** Lời giải ĐÃ NHẬP theo ý (Bài của tôi · chờ duyệt / Duyệt): mỗi ý = mã + phát biểu ngắn + lời giải; ý là bản Claude
 *  thì ghi "giữ nguyên/đã sửa" và cho mở bản gốc để so. */
export function YNhapDoc({ chuoi, yNhap }: { chuoi: ChuoiHinhT; yNhap: YNhap[] }) {
  const [goc, setGoc] = useState<Set<string>>(new Set())
  return (
    <div className="space-y-2">
      {yNhap.map((v) => {
        const y = chuoi.y.find((x) => x.id === v.id)
        if (!y) return null
        const claude = y.trang_thai === 'claude' && y.loi_giai
        const giuNguyen = claude && (y.loi_giai ?? '').trim() === (v.loi_giai ?? '').trim()
        return (
          <div key={v.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{y.ma}</code>
              {y.la_dich && <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">ĐÍCH</span>}
              <span className="truncate text-slate-500"><MathText>{y.phat_bieu}</MathText></span>
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

/** Soạn theo từng ý. `values` khoá theo id node. Ý đã duyệt: chỉ đọc (không ô). */
export function ChuoiSoan({ chuoi, values, onChange, tieuDe, deBaiChung }: {
  chuoi: ChuoiHinhT; values: YNhap[]; onChange: (v: YNhap[]) => void; tieuDe: string
  deBaiChung?: (noiBat: string) => ReactNode   // panel đề cho full màn — mặc định = cả chuỗi, ý đang soạn nổi bật
}) {
  const tong = chuoi.y.length
  const get = (id: string) => values.find((v) => v.id === id) ?? { id, loi_giai: null, anh: null }
  const set = (id: string, patch: Partial<YNhap>) => onChange(values.some((v) => v.id === id) ? values.map((v) => (v.id === id ? { ...v, ...patch } : v)) : [...values, { ...get(id), ...patch }])
  return (
    <div className="space-y-3">
      <GiaThietMoHinh c={chuoi} />
      {chuoi.y.map((y, i) => {
        const can = yCanNhap(y)
        const v = get(y.id)
        return (
          <div key={y.id} className={`rounded-lg border px-3 py-2 ${can ? 'border-emerald-200 bg-white' : 'border-slate-200 bg-slate-50/60'}`}>
            <YHead y={y} k={i + 1} tong={tong} />
            <YDe y={y} />
            {can ? (
              <div className="mt-2">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Lời giải ý này{y.trang_thai === 'claude' ? ' — đang nạp bản Claude, sửa rồi nộp' : ''}</div>
                <MathTextarea value={v.loi_giai ?? ''} onChange={(t) => set(y.id, { loi_giai: t || null })} soanTitle={`${tieuDe} · ${y.ma}`}
                  soanDeBai={deBaiChung ? deBaiChung(y.id) : <ChuoiDoc chuoi={chuoi} noiBat={y.id} />}
                  className="min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[13px] leading-relaxed focus:border-emerald-400 focus:outline-none" />
              </div>
            ) : (
              y.loi_giai && <div className="mt-1.5 rounded-md border border-dashed border-emerald-200 bg-emerald-50/40 px-3 py-2 text-[13px] leading-relaxed text-slate-700"><MathText>{y.loi_giai}</MathText></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
