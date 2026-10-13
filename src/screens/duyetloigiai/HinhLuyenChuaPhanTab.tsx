// Duyệt kho › "Chưa phân mô hình" (CEO 14/10): bài Hình–Luyện đã vào kho nhưng ý CHƯA gán vào bài nào của mô hình —
// cùng nghĩa với "chưa phân dạng" bên Đại. Người gán tay từng ý, hoặc dựng mô hình mới (Bản đồ mới › Hình – Luyện) rồi quay lại.
// Hàng đợi + đếm tính ở DB (fn_hl_kho_chua_phan / fn_hl_dem_chua_phan). Gán xong VÁ TẠI CHỖ — thẻ không biến mất,
// người đứng nguyên vị trí làm bài kế tiếp (CLAUDE.md §2). Nhớ danh sách + vị trí cuộn theo khối tới khi F5.
import { useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../../lib/kho/api'
import type { BaiKho, BaiMoHinhLuyen, YKho } from '../../lib/kho/hinhCay'
import { MathText } from '../kho/ui'

const TRANG = 30
const NHO: Record<string, { bai: BaiKho[]; het: boolean; cuon: number }> = {}

export default function HinhLuyenChuaPhanTab({ khoi, onChanged }: { khoi: string; onChanged?: () => void }) {
  const [bai, setBai] = useState<BaiKho[]>(() => NHO[khoi]?.bai ?? [])
  const [het, setHet] = useState(() => NHO[khoi]?.het ?? false)
  const [chon, setChon] = useState<BaiMoHinhLuyen[]>([])
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [ban, setBan] = useState<string | null>(null)
  const khung = useRef<HTMLDivElement>(null)

  const nap = async (themVao: BaiKho[]) => {
    setDangTai(true); setLoi(null)
    try {
      const moi = await api.khoChuaPhanMoHinh(khoi, TRANG, themVao.length)
      setBai([...themVao, ...moi]); setHet(moi.length < TRANG)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setDangTai(false) }
  }
  // đổi khối = đổi ngữ cảnh: dùng lại danh sách đã nhớ nếu có, không thì nạp
  useEffect(() => {
    const n = NHO[khoi]
    if (n) { setBai(n.bai); setHet(n.het); requestAnimationFrame(() => { if (khung.current) khung.current.scrollTop = n.cuon }) }
    else { setBai([]); setHet(false); void nap([]) }
    api.baiMoHinhLuyen(khoi).then(setChon).catch(() => setChon([]))
  }, [khoi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { NHO[khoi] = { bai, het, cuon: khung.current?.scrollTop ?? 0 } }, [bai, het, khoi])

  const vaY = (baiId: string, yId: string, v: Partial<YKho>) =>
    setBai((prev) => prev.map((b) => (b.id !== baiId ? b : { ...b, y: b.y.map((y) => (y.id === yId ? { ...y, ...v } : y)) })))
  const gan = async (b: BaiKho, y: YKho, baiToanId: string | null) => {
    setBan(y.id); setLoi(null)
    try { await api.ganYVaoBai(y.id, baiToanId); vaY(b.id, y.id, { baitoan_id: baiToanId }); onChanged?.() }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }
  const duyet = async (b: BaiKho, y: YKho) => {
    setBan(y.id); setLoi(null)
    try { await api.updateY(y.id, { da_duyet: !y.da_duyet }); vaY(b.id, y.id, { da_duyet: !y.da_duyet }) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }
  const soYChua = bai.reduce((s, b) => s + b.y.filter((y) => !y.baitoan_id).length, 0)   // đếm thứ đang hiển thị

  return (
    <div ref={khung} className="flex-1 overflow-auto px-6 py-4"
      onScroll={(e) => { if (NHO[khoi]) NHO[khoi].cuon = (e.target as HTMLDivElement).scrollTop }}>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[13px] text-slate-600">
        <span>Đang hiện <b className="text-slate-900">{bai.length}</b> bài · <b className="text-slate-900">{soYChua}</b> ý chưa phân mô hình</span>
        <button onClick={() => void nap([])} className="rounded-md border border-slate-200 px-2 py-0.5 text-[12px] hover:bg-slate-50" title="Quét lại từ đầu">↻ Quét lại</button>
        {!chon.length && (
          <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[12px] text-amber-800">
            Khối {khoi} chưa có mô hình luyện nào — dựng ở <b>Bản đồ mới › chủ đề vùng Hình – Luyện</b>, rồi quay lại đây gán.
          </span>)}
      </div>
      {loi && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi} <button className="ml-2 underline" onClick={() => setLoi(null)}>đóng</button></div>}
      {!bai.length && !dangTai && !loi && <p className="text-sm text-slate-400">Khối {khoi} không còn ý nào chưa phân mô hình.</p>}

      <div className="space-y-4">
        {bai.map((b) => <TheBai key={b.id} b={b} chon={chon} ban={ban} onGan={gan} onDuyet={duyet} />)}
      </div>
      <div className="py-5 text-center">
        {dangTai ? <span className="text-sm text-slate-400">Đang tải…</span>
          : !het && bai.length > 0 ? <button onClick={() => void nap(bai)} className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-[13px] font-medium hover:bg-slate-50">Tải thêm {TRANG} bài</button>
          : bai.length > 0 ? <span className="text-[12px] text-slate-400">— hết —</span> : null}
      </div>
    </div>
  )
}

function TheBai({ b, chon, ban, onGan, onDuyet }: {
  b: BaiKho; chon: BaiMoHinhLuyen[]; ban: string | null
  onGan: (b: BaiKho, y: YKho, id: string | null) => void; onDuyet: (b: BaiKho, y: YKho) => void
}) {
  const xong = b.y.every((y) => y.baitoan_id)
  return (
    <div className={`rounded-xl border bg-white p-4 ${xong ? 'border-emerald-300' : 'border-slate-200'}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="rounded bg-teal-50 px-1.5 py-0.5 font-mono font-semibold text-teal-700">{b.ma_bai}</span>
        <span className="min-w-0 flex-1 truncate text-slate-500" title={b.nguon ?? ''}>{b.nguon ?? 'chưa rõ nguồn'}</span>
        {b.nguon_ma_cau && <span className="font-mono text-[11px] text-slate-400" title="Mã câu gốc ở kho đề thi">gốc {b.nguon_ma_cau}</span>}
        {b.can_tach_tay && <span className="rounded border border-amber-400 bg-amber-50 px-1.5 font-semibold text-amber-800" title="Máy không tách được ý (đề/lời giải lệch số ý hoặc câu Đúng/Sai) — bài đang là 1 ý">⚠ cần tách ý tay</span>}
        {xong && <span className="rounded bg-emerald-100 px-1.5 font-semibold text-emerald-800">✓ đã gán đủ</span>}
      </div>
      <div className={`grid gap-4 ${b.anh_de ? 'md:grid-cols-[1fr_230px]' : ''}`}>
        <div className="min-w-0">
          {b.gia_thiet_chung
            ? <div className="rounded-lg bg-teal-600 px-3 py-2 text-[13.5px] text-white"><b>Giả thiết chung:</b> <MathText className="inline">{b.gia_thiet_chung}</MathText></div>
            : <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] text-slate-500">Bài một ý — không có giả thiết chung tách riêng.</div>}
          {b.huong_dan && (
            <details className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px]">
              <summary className="cursor-pointer text-[12px] font-semibold text-slate-500">Hướng dẫn chung của bài</summary>
              <div className="mt-1.5"><MathText>{b.huong_dan}</MathText></div>
            </details>)}
        </div>
        {b.anh_de && <img src={b.anh_de} alt="Hình đề" className="max-h-52 w-full rounded-lg border border-slate-200 bg-white object-contain" />}
      </div>
      <div className="mt-3 space-y-2">
        {b.y.map((y) => <DongY key={y.id} b={b} y={y} chon={chon} ban={ban === y.id} onGan={onGan} onDuyet={onDuyet} />)}
      </div>
    </div>
  )
}

function DongY({ b, y, chon, ban, onGan, onDuyet }: {
  b: BaiKho; y: YKho; chon: BaiMoHinhLuyen[]; ban: boolean
  onGan: (b: BaiKho, y: YKho, id: string | null) => void; onDuyet: (b: BaiKho, y: YKho) => void
}) {
  const daGan = y.baitoan_id ? chon.find((c) => c.baitoan_id === y.baitoan_id) : null
  return (
    <div className={`rounded-lg border p-2.5 ${y.baitoan_id ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200'}`}>
      <div className="flex items-start gap-2 text-[13.5px]">
        <b className="mt-0.5 shrink-0 text-violet-700">{y.nhan ? `${y.nhan})` : '•'}</b>
        <div className="min-w-0 flex-1"><MathText>{y.noi_dung}</MathText></div>
        <span className="shrink-0 font-mono text-[10.5px] text-slate-400">{y.ma_y}</span>
      </div>
      {(y.loi_giai || y.dap_an) && (
        <details className="mt-1.5 text-[13px]">
          <summary className="cursor-pointer text-[12px] font-semibold text-slate-500">Lời giải{y.dap_an ? ' · đáp án' : ''}</summary>
          {y.dap_an && <div className="mt-1 rounded bg-emerald-50 px-2 py-1 font-semibold"><MathText>{y.dap_an}</MathText></div>}
          {y.loi_giai && <div className="mt-1 rounded border border-emerald-200 bg-emerald-50/60 p-2"><MathText>{y.loi_giai}</MathText></div>}
          {y.anh_loi_giai && <img src={y.anh_loi_giai} alt="Hình lời giải" className="mt-1.5 max-h-56 rounded border border-slate-200 bg-white object-contain" />}
        </details>)}
      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
        {y.baitoan_id ? (
          <>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[12px] font-semibold text-white">
              {daGan ? `${daGan.goc_ten} · ${daGan.so}` : 'đã gán'}
            </span>
            {daGan && <span className="min-w-0 flex-1 truncate text-[12px] text-slate-500">{daGan.phat_bieu.replace(/\$/g, '')}</span>}
            <button disabled={ban} onClick={() => onGan(b, y, null)} className="text-[12px] text-rose-600 hover:underline disabled:opacity-40">gỡ gán</button>
          </>
        ) : (
          <>
            <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[12px] font-semibold text-amber-800">chưa phân mô hình</span>
            <ChonBaiMoHinh chon={chon} disabled={ban} onChon={(id) => onGan(b, y, id)} />
          </>
        )}
        <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[12px] text-slate-600" title="Nội dung ý (câu hỏi + lời giải) đã đúng">
          <input type="checkbox" checked={y.da_duyet} disabled={ban} onChange={() => onDuyet(b, y)} /> đã duyệt nội dung
        </label>
      </div>
    </div>
  )
}

/** Ô tìm–chọn bài mô hình (gõ là lọc; không dùng dropdown dài). */
function ChonBaiMoHinh({ chon, disabled, onChon }: { chon: BaiMoHinhLuyen[]; disabled: boolean; onChon: (id: string) => void }) {
  const [tu, setTu] = useState('')
  const [mo, setMo] = useState(false)
  const loc = useMemo(() => {
    const k = tu.trim().toLowerCase()
    const ds = k ? chon.filter((c) => `${c.goc_ten} ${c.nhanh_ten} ${c.so} ${c.ma} ${c.phat_bieu}`.toLowerCase().includes(k)) : chon
    return ds.slice(0, 40)
  }, [tu, chon])
  if (!chon.length) return <span className="text-[12px] text-slate-400">— chưa có mô hình luyện để gán —</span>
  return (
    <div className="relative min-w-[280px] flex-1">
      <input value={tu} disabled={disabled} onChange={(e) => { setTu(e.target.value); setMo(true) }} onFocus={() => setMo(true)}
        onBlur={() => window.setTimeout(() => setMo(false), 150)} placeholder="Gõ tên mô hình / số bài / nội dung để gán…"
        className="w-full rounded-md border border-slate-300 px-2 py-1 text-[12.5px] outline-none focus:border-blue-500" />
      {mo && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {!loc.length && <div className="px-2 py-1.5 text-[12px] text-slate-400">Không khớp bài nào.</div>}
          {loc.map((c) => (
            <button key={c.baitoan_id} onMouseDown={(e) => e.preventDefault()} onClick={() => { onChon(c.baitoan_id); setTu(''); setMo(false) }}
              className="flex w-full items-baseline gap-2 px-2 py-1 text-left text-[12.5px] hover:bg-blue-50">
              <b className="shrink-0 text-slate-900">{c.so}</b>
              <span className="shrink-0 text-teal-700">{c.goc_ten}{c.nhanh_id !== c.goc_id ? ` › ${c.nhanh_ten}` : ''}</span>
              <span className="min-w-0 flex-1 truncate text-slate-500">{c.phat_bieu.replace(/\$/g, '')}</span>
            </button>))}
        </div>)}
    </div>
  )
}
