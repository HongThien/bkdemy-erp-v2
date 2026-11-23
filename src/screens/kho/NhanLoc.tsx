// NHÃN LỌC ĐỘNG của kho — bộ component DÙNG CHUNG (Thùy 23/11, mockup duyệt: docs/mockup-nhan-loc-hinh.html, spec-kho-cau-hoi §14).
// Dùng ở: kho Hình–Học (KhoModal, BanDoMoi.tsx) · kho Hình–Luyện (TabKho, CayNhanh.tsx) · hộp chọn câu / chọn bài của builder
// (ChonCauHoc · ChonBai, ChuyenDeHinhBuilder.tsx). Màn mới cần nhãn lọc ⇒ dùng lại các mảnh ở đây, không vẽ kiểu nhãn khác.
//   useNhanLoc      danh mục nhãn + tạo / gán / gỡ (RPC) — màn tự vá danh sách của mình tại chỗ
//   ChipNhan        một nhãn trên thẻ bài (khối ĐẬM màu, chữ trắng, bóng — Thùy 23/11)
//   NhanCuaBai      dãy nhãn của một bài (+ nút "＋ nhãn" khi được gán)
//   ThanhNhan       thanh bật / tắt: bật nhiều nhãn = "và" (bài phải có đủ)
//   HopGanNhan      hộp chọn nhãn cũ / tạo nhãn mới (tên + màu) cho 1 bài hoặc cả loạt
//   ThanhChonNhieu  thanh gán hàng loạt
//   QuanLyNhan      đổi tên · đổi màu · xoá mềm · khôi phục (trưởng khối trở lên + quản trị — DB chặn)
// Bóng = gradient + box-shadow tĩnh: không ảnh, không blur, không animation chạy liên tục ⇒ không tốn hiệu suất.
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DS_MAU_NHAN, MAU_NHAN, dsNhanLoc, ganNhanLoc, suaNhanLoc, taoNhanLoc, xoaNhanLoc, type KhoNhan, type MauNhan, type NhanLoc } from '../../lib/kho/nhanLoc'

const kieuBong = (c: string, bat = false): CSSProperties => ({
  background: `linear-gradient(180deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,.08) 48%, rgba(0,0,0,.06) 100%), ${c}`,
  boxShadow: bat
    ? `inset 0 1px 0 rgba(255,255,255,.45), 0 0 0 2px #fff, 0 0 0 4px ${c}, 0 6px 12px -3px ${c}`
    : `inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.22), 0 4px 9px -3px ${c}`,
  textShadow: '0 1px 1px rgba(0,0,0,.22)',
})
const mauCua = (m: string) => MAU_NHAN[m as MauNhan]?.c ?? MAU_NHAN.xam.c
const loiChu = (e: unknown) => (e instanceof Error ? e.message : String(e))
// Esc đóng ĐÚNG hộp / bảng nhãn đang mở, không đóng luôn popup kho bên dưới (popup kho nghe Esc ở window, pha nổi bọt ⇒
// bắt ở pha capture rồi chặn lại; đo thật 23/11: không chặn thì Esc trong hộp gán nhãn đóng cả kho).
function useEscDong(onDong: () => void) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onDong() } }
    window.addEventListener('keydown', f, true)
    return () => window.removeEventListener('keydown', f, true)
  }, [onDong])
}
/** Thêm / bỏ một nhãn trong mảng nhãn của bài (vá tại chỗ sau khi gán / gỡ). */
export const doiNhan = (ids: readonly string[] | null | undefined, nhanId: string, bat: boolean): string[] =>
  bat ? [...new Set([...(ids ?? []), nhanId])] : (ids ?? []).filter((x) => x !== nhanId)

// ── Danh mục nhãn + thao tác ghi. `phamVi` có ⇒ DB đếm sẵn số bài mang nhãn trong phạm vi (kho phân trang); không có ⇒ màn tự đếm thẻ đang hiện.
// `dung` = false ⇒ không gọi gì (màn dùng chung với kho chưa có nhãn lọc, vd popup kho của Đại).
export function useNhanLoc(kho: KhoNhan, phamVi?: string | null, dung = true) {
  const [ds, setDs] = useState<NhanLoc[]>([])
  const [duocSua, setDuocSua] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  // tải NỀN: giữ danh mục cũ tới khi có danh mục mới (không trắng thanh nhãn)
  const tai = useCallback(() => dsNhanLoc(kho, phamVi).then((r) => { setDs(r.nhan); setDuocSua(r.duocSua); setLoi(null) }).catch((e) => setLoi(loiChu(e))), [kho, phamVi])
  useEffect(() => { if (dung) void tai() }, [tai, dung])
  const tao = useCallback(async (ten: string, mau: MauNhan) => {
    const n = await taoNhanLoc(kho, ten, mau)
    setDs((p) => (p.some((x) => x.id === n.id) ? p : [...p, n]))
    return n
  }, [kho])
  /** Gán / gỡ; trả MÃ GỐC các bài đã đổi (DB quy mã câu / mã ý về mã bài). */
  const gan = useCallback(async (ma: string[], nhanId: string, bat: boolean) => (await ganNhanLoc(kho, ma, nhanId, bat)).ma, [kho])
  return { ds, duocSua, loi, tai, tao, gan }
}

export function ChipNhan({ n, onGo, nho }: { n: Pick<NhanLoc, 'ten' | 'mau'>; onGo?: () => void; nho?: boolean }) {
  return (
    <span style={kieuBong(mauCua(n.mau))} className={`inline-flex shrink-0 items-center gap-1 rounded-full font-semibold text-white ${nho ? 'px-2 py-px text-[10.5px]' : 'px-2.5 py-0.5 text-[11.5px]'}`}>
      {n.ten}
      {onGo && <button type="button" onClick={(e) => { e.stopPropagation(); onGo() }} title="Gỡ nhãn này khỏi bài" className="-mr-0.5 font-normal opacity-70 hover:opacity-100">✕</button>}
    </span>
  )
}

/** Dãy nhãn của MỘT bài theo thứ tự danh mục. `onGo` / `onThem` có ⇒ được gỡ / gán (kho); không có ⇒ chỉ xem (builder, bản sao). */
export function NhanCuaBai({ ds, ids, onGo, onThem, nho }: { ds: NhanLoc[]; ids: readonly string[] | null | undefined; onGo?: (n: NhanLoc) => void; onThem?: (neo: DOMRect) => void; nho?: boolean }) {
  const cua = ds.filter((n) => (ids ?? []).includes(n.id))
  if (!cua.length && !onThem) return null
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {cua.map((n) => <ChipNhan key={n.id} n={n} nho={nho} onGo={onGo ? () => onGo(n) : undefined} />)}
      {onThem && <button type="button" onClick={(e) => { e.stopPropagation(); onThem(e.currentTarget.getBoundingClientRect()) }} title="Gán nhãn lọc cho bài này"
        className="rounded-full border border-dashed border-slate-300 bg-white px-2 py-px text-[11.5px] text-slate-500 hover:border-indigo-400 hover:text-indigo-700">＋ nhãn</button>}
    </span>
  )
}

/** Thanh bật / tắt nhãn. `so` = số bài mang nhãn trong danh sách đang xem; chỉ hiện nhãn có bài (Thùy 23/11 câu 6). */
export function ThanhNhan({ ds, so, bat, onBat, soKhop, phai, className = '' }: {
  ds: NhanLoc[]; so: (n: NhanLoc) => number; bat: readonly string[]; onBat: (ids: string[]) => void
  soKhop?: number | null; phai?: ReactNode; className?: string
}) {
  const hien = ds.filter((n) => so(n) > 0 || bat.includes(n.id))
  const coLoc = bat.length > 0
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Nhãn lọc</span>
      {hien.length === 0 && <span className="text-[12.5px] text-slate-400">Chưa bài nào trong danh sách này có nhãn.</span>}
      {hien.map((n) => {
        const on = bat.includes(n.id)
        return (
          <button key={n.id} type="button" onClick={() => onBat(on ? bat.filter((x) => x !== n.id) : [...bat, n.id])} style={kieuBong(mauCua(n.mau), on)}
            title={on ? 'Đang lọc theo nhãn này — bấm để tắt' : 'Bấm để chỉ hiện bài mang nhãn này'}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold text-white transition ${on ? '-translate-y-px' : coLoc ? 'opacity-55 !shadow-none hover:opacity-85' : 'hover:-translate-y-px'}`}>
            {on && <span>✓</span>}{n.ten}
            <span className="rounded-full bg-white/25 px-1.5 text-[11px]" style={{ textShadow: 'none' }}>{so(n)}</span>
          </button>
        )
      })}
      {coLoc && <>
        {soKhop != null && <span className="text-[12px] text-slate-500">→ có đủ {bat.length} nhãn: <b className="text-slate-800">{soKhop}</b> bài</span>}
        <button type="button" onClick={() => onBat([])} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[12px] font-medium text-slate-600 hover:border-rose-300 hover:text-rose-600">Xoá lọc</button>
      </>}
      {phai && <span className="ml-auto flex items-center gap-1.5">{phai}</span>}
    </div>
  )
}

/** Hộp gán nhãn cho 1 bài hoặc cả loạt. `cua` = mảng nhãn của TỪNG bài đang chọn (để hiện ✓ mọi bài có · – một số bài có). */
export function HopGanNhan({ neo, ds, cua, onDat, onTao, onDong }: {
  neo: DOMRect; ds: NhanLoc[]; cua: (readonly string[])[]
  onDat: (n: NhanLoc, bat: boolean) => Promise<void>; onTao: (ten: string, mau: MauNhan) => Promise<NhanLoc>; onDong: () => void
}) {
  const [q, setQ] = useState('')
  const [mau, setMau] = useState<MauNhan>('lam')
  const [ban, setBan] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEscDong(onDong)
  const k = q.trim().toLowerCase()
  const khop = ds.filter((n) => !k || n.ten.toLowerCase().includes(k))
  const trung = ds.some((n) => n.ten.toLowerCase() === k)
  const chay = async (f: () => Promise<void>) => { setBan(true); setLoi(null); try { await f() } catch (e) { setLoi(loiChu(e)) } finally { setBan(false) } }
  // mở xuống dưới nút; sát đáy màn (thanh gán hàng loạt) thì mở lên trên
  const R = 290, len = neo.bottom + 360 > window.innerHeight
  const viTri: CSSProperties = { left: Math.max(8, Math.min(window.innerWidth - R - 8, neo.left)), width: R, ...(len ? { bottom: window.innerHeight - neo.top + 6 } : { top: neo.bottom + 6 }) }
  // Vẽ thẳng vào <body>: khung cha có transform / cuộn riêng (màn Cây nhánh) làm position:fixed tính theo khung đó ⇒ hộp lệch khỏi nút (đo thật 23/11).
  return createPortal(
    <div onClick={(e) => e.stopPropagation()}>
      <div className="fixed inset-0 z-[94]" onClick={onDong} />
      <div style={viTri} className="fixed z-[95] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm nhãn hoặc gõ tên nhãn mới…" maxLength={40}
          className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-[13.5px] outline-none focus:border-indigo-300" />
        <div className="mt-2 max-h-56 overflow-auto">
          {khop.length === 0 && <div className="px-2 py-1.5 text-[12px] text-slate-400">{ds.length ? 'Chưa có nhãn nào khớp.' : 'Chưa có nhãn nào — gõ tên để tạo nhãn đầu tiên.'}</div>}
          {khop.map((n) => {
            const co = cua.filter((ids) => ids.includes(n.id)).length, du = cua.length > 0 && co === cua.length
            return (
              <button key={n.id} type="button" disabled={ban} onClick={() => void chay(() => onDat(n, !du))}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100 disabled:opacity-50">
                <span className="w-4 text-center text-[13px] font-bold text-indigo-600">{du ? '✓' : co ? '–' : ''}</span>
                <ChipNhan n={n} />
              </button>
            )
          })}
        </div>
        {k && !trung && (
          <div className="mt-2 border-t border-slate-100 pt-2">
            <div className="mb-1.5 text-[12px] text-slate-500">Tạo nhãn mới «<b className="text-slate-800">{q.trim()}</b>» — chọn màu:</div>
            <div className="mb-2 flex gap-1.5">
              {DS_MAU_NHAN.map((m) => (
                <button key={m} type="button" onClick={() => setMau(m)} title={MAU_NHAN[m].ten} style={{ background: MAU_NHAN[m].c }}
                  className={`h-6 w-6 rounded-full ring-offset-2 ${mau === m ? 'ring-2 ring-slate-800' : 'hover:ring-2 hover:ring-slate-300'}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ChipNhan n={{ ten: q.trim(), mau }} />
              <button type="button" disabled={ban} onClick={() => void chay(async () => { const n = await onTao(q.trim(), mau); await onDat(n, true); setQ('') })}
                className="ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[12.5px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">＋ Tạo và gán{cua.length > 1 ? ` cho ${cua.length} bài` : ''}</button>
            </div>
          </div>
        )}
        {loi && <div className="mt-2 rounded-md bg-rose-50 px-2 py-1 text-[12px] text-rose-700">{loi}</div>}
        <div className="mt-2 text-[11.5px] leading-snug text-slate-400">
          {cua.length > 1 ? `Đang gán cho ${cua.length} bài · ✓ mọi bài đã có · – một số bài có. Bấm để gán cho cả loạt, bấm lần nữa để gỡ.` : 'Bấm một nhãn để gán, bấm lần nữa để gỡ.'}
        </div>
      </div>
    </div>, document.body)
}

/** Thanh gán hàng loạt (dính đáy khung cuộn của kho). */
export function ThanhChonNhieu({ so, soHien, onGan, onChonHet, onBo, onXong }: { so: number; soHien: number; onGan: (neo: DOMRect) => void; onChonHet: () => void; onBo: () => void; onXong: () => void }) {
  const nut = 'rounded-md border border-slate-600 bg-slate-700 px-2.5 py-1 text-[12.5px] font-medium text-white hover:bg-slate-600 disabled:opacity-40'
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-white shadow-xl">
      <b className="text-[13px]">Đã chọn {so} bài</b>
      <button type="button" disabled={!so} onClick={(e) => onGan(e.currentTarget.getBoundingClientRect())}
        className="rounded-md bg-white px-2.5 py-1 text-[12.5px] font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-40">Gán / gỡ nhãn ▾</button>
      <button type="button" onClick={onChonHet} className={nut}>Chọn hết {soHien} bài đang hiện</button>
      <button type="button" disabled={!so} onClick={onBo} className={nut}>Bỏ chọn</button>
      <button type="button" onClick={onXong} className={`${nut} ml-auto`}>Xong</button>
    </div>
  )
}
/** Ô tick của một bài ở chế độ chọn nhiều. */
export function OTickBai({ on, onDoi }: { on: boolean; onDoi: () => void }) {
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onDoi() }} title={on ? 'Bỏ chọn bài này' : 'Chọn bài này để gán nhãn hàng loạt'}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[12px] font-bold ${on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-transparent hover:border-indigo-400'}`}>✓</button>
  )
}

/** Quản lý nhãn: mọi người xem được; đổi tên · đổi màu · xoá · khôi phục chỉ khi `duocSua` (DB chặn lần nữa). `onDoi` = báo màn tải lại danh mục. */
export function QuanLyNhan({ kho, onDong, onDoi }: { kho: KhoNhan; onDong: () => void; onDoi: () => void }) {
  const [ds, setDs] = useState<NhanLoc[] | null>(null)
  const [duocSua, setDuocSua] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [sua, setSua] = useState<{ id: string; ten: string } | null>(null)
  const [hoiXoa, setHoiXoa] = useState<string | null>(null)
  useEscDong(useCallback(() => { if (sua) setSua(null); else onDong() }, [sua, onDong]))
  useEffect(() => { dsNhanLoc(kho, null, true).then((r) => { setDs(r.nhan); setDuocSua(r.duocSua) }).catch((e) => setLoi(loiChu(e))) }, [kho])
  // vá đúng dòng vừa đổi (không tải lại bảng)
  const va = async (f: () => Promise<Omit<NhanLoc, 'so_bai' | 'tong'>>) => {
    setLoi(null)
    try { const n = await f(); setDs((p) => (p ?? []).map((x) => (x.id === n.id ? { ...x, ...n } : x))); onDoi() } catch (e) { setLoi(loiChu(e)) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-slate-900/40 p-4" onClick={(e) => { e.stopPropagation(); onDong() }}>
      <div className="flex max-h-[88vh] w-[960px] max-w-full flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">⚙ Nhãn lọc của kho Hình</h3>
          <span className="text-[12px] text-slate-500">dùng chung cho kho Hình–Học và Hình–Luyện, mọi khối</span>
          <button onClick={onDong} className="ml-auto rounded-md px-2 py-1 text-[13px] text-slate-500 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {loi && <div className="mb-2 rounded-md bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
          {!ds ? <p className="text-sm text-slate-400">Đang tải…</p> : ds.length === 0 ? <p className="rounded-xl bg-white p-6 text-center text-[13.5px] text-slate-400">Chưa có nhãn nào. Tạo nhãn bằng nút «＋ nhãn» trên một bài trong kho.</p> : (
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              {ds.map((n) => (
                <div key={n.id} className={`flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0 ${n.da_xoa ? 'opacity-50' : ''}`}>
                  <span className="flex w-44 min-w-0 items-center gap-2">
                    {sua?.id === n.id
                      ? <input autoFocus value={sua.ten} maxLength={40} onChange={(e) => setSua({ id: n.id, ten: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter' && sua.ten.trim()) { void va(() => suaNhanLoc(n.id, { ten: sua.ten.trim() })); setSua(null) } }}
                          onBlur={() => setSua(null)} className="h-8 w-full rounded-md border border-indigo-300 px-2 text-[13px] outline-none" />
                      : <ChipNhan n={n} />}
                    {n.da_xoa && <span className="text-[11.5px] text-slate-500">đã xoá</span>}
                  </span>
                  <span className="flex gap-1">
                    {DS_MAU_NHAN.map((m) => (
                      <button key={m} type="button" disabled={!duocSua || n.da_xoa} onClick={() => void va(() => suaNhanLoc(n.id, { mau: m }))} title={MAU_NHAN[m].ten} style={{ background: MAU_NHAN[m].c }}
                        className={`h-5 w-5 rounded-full ring-offset-1 disabled:cursor-default ${n.mau === m ? 'ring-2 ring-slate-800' : duocSua && !n.da_xoa ? 'opacity-60 hover:opacity-100' : 'opacity-25'}`} />
                    ))}
                  </span>
                  <span className="text-[12.5px] text-slate-600">Hình–Học <b>{n.tong.hinh_hoc ?? 0}</b> bài · Hình–Luyện <b>{n.tong.hinh_luyen ?? 0}</b> bài</span>
                  <span className="text-[12px] text-slate-400">{n.tao_boi ? `tạo: ${n.tao_boi}` : ''}</span>
                  {duocSua && (
                    <span className="ml-auto flex items-center gap-1 text-[12px]">
                      {n.da_xoa ? <button onClick={() => void va(() => xoaNhanLoc(n.id, false))} className="rounded-md border border-slate-200 px-2 py-0.5 font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700">Khôi phục</button>
                        : hoiXoa === n.id ? <>
                          <span className="text-rose-700">Ẩn nhãn này khỏi mọi bài?</span>
                          <button onClick={() => { setHoiXoa(null); void va(() => xoaNhanLoc(n.id, true)) }} className="rounded-md bg-rose-600 px-2 py-0.5 font-semibold text-white hover:bg-rose-700">Xoá</button>
                          <button onClick={() => setHoiXoa(null)} className="rounded-md px-2 py-0.5 text-slate-500 hover:bg-slate-100">Huỷ</button>
                        </> : <>
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => setSua({ id: n.id, ten: n.ten })} className="rounded-md border border-slate-200 px-2 py-0.5 font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">Đổi tên</button>
                          <button onClick={() => setHoiXoa(n.id)} className="rounded-md border border-slate-200 px-2 py-0.5 font-medium text-slate-600 hover:border-rose-300 hover:text-rose-700">Xoá</button>
                        </>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Nhãn chỉ để tìm bài: không vào đánh giá, không đổi bài học / mô hình của bài, học sinh không thấy. Xoá nhãn = ẩn khỏi thanh lọc và khỏi mọi bài, khôi phục là các bài có lại nhãn như cũ.
            {!duocSua && ' Đổi tên, đổi màu, xoá nhãn: trưởng khối trở lên hoặc quản trị.'}
          </p>
        </div>
      </div>
    </div>, document.body)
}
