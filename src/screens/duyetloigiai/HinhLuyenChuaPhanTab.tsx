// Duyệt kho › "Hình luyện · chưa phân mô hình" (CEO 14/10): bài Hình–Luyện đã vào kho nhưng ý CHƯA gán vào bài nào của mô hình.
//
// ⭐ MỖI LẦN MỘT BÀI, TRỌN MÀN (CEO 14/10 sáng): duyệt Hình phải nhìn đủ ĐỀ + ĐÁP ÁN CHI TIẾT + HÌNH cùng lúc ⇒ không xếp thẻ
// thành danh sách cuộn. Trái = đề + từng ý + lời giải MỞ SẴN · phải = hình (to, đứng yên khi cuộn lời giải).
// "✓ Duyệt bài → bài kế" duyệt mọi ý của bài rồi sang bài chưa duyệt tiếp theo. ← → để lật bài.
// Hàng đợi + đếm tính ở DB. Sau mỗi thao tác VÁ TẠI CHỖ; nhớ danh sách + bài đang xem theo khối tới khi F5.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../../lib/kho/api'
import type { BaiKho, BaiMoHinhLuyen, MoHinhLuyen, YKho } from '../../lib/kho/hinhCay'
import { MathText } from '../kho/ui'

const TRANG = 30
const NHO: Record<string, { bai: BaiKho[]; het: boolean; vt: number }> = {}

export default function HinhLuyenChuaPhanTab({ khoi, onChanged }: { khoi: string; onChanged?: () => void }) {
  const [bai, setBai] = useState<BaiKho[]>(() => NHO[khoi]?.bai ?? [])
  const [het, setHet] = useState(() => NHO[khoi]?.het ?? false)
  const [vt, setVt] = useState(() => NHO[khoi]?.vt ?? 0)                // bài đang xem (chỉ số trong danh sách đã nạp)
  const [chon, setChon] = useState<BaiMoHinhLuyen[]>([])
  const [moHinhs, setMoHinhs] = useState<MoHinhLuyen[]>([])              // mô hình luyện của khối — gán cho CẢ BÀI
  const [tong, setTong] = useState<{ so_bai: number; so_y: number } | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [ban, setBan] = useState<string | null>(null)
  const [phong, setPhong] = useState<string | null>(null)                // hình đang phóng to
  const cuon = useRef<HTMLDivElement>(null)

  const nap = useCallback(async (themVao: BaiKho[]): Promise<BaiKho[]> => {
    setDangTai(true); setLoi(null)
    try {
      const moi = await api.khoChuaPhanMoHinh(khoi, TRANG, themVao.length)
      const ds = [...themVao, ...moi]
      setBai(ds); setHet(moi.length < TRANG)
      return ds
    } catch (e: any) { setLoi(e.message ?? String(e)); return themVao }
    finally { setDangTai(false) }
  }, [khoi])

  // đổi khối = đổi ngữ cảnh: dùng lại danh sách đã nhớ nếu có, không thì nạp
  useEffect(() => {
    const n = NHO[khoi]
    if (n) { setBai(n.bai); setHet(n.het); setVt(n.vt) } else { setBai([]); setHet(false); setVt(0); void nap([]) }
    api.baiMoHinhLuyen(khoi).then(setChon).catch(() => setChon([]))
    api.moHinhLuyenCuaKhoi(khoi).then(setMoHinhs).catch(() => setMoHinhs([]))
    api.demChuaPhanMoHinh().then((d) => { const x = d.find((r) => r.khoi === khoi); setTong(x ? { so_bai: x.so_bai, so_y: x.so_y } : { so_bai: 0, so_y: 0 }) }).catch(() => setTong(null))
  }, [khoi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { NHO[khoi] = { bai, het, vt } }, [bai, het, vt, khoi])
  useEffect(() => { cuon.current?.scrollTo({ top: 0 }) }, [vt])           // sang bài khác ⇒ đọc lại từ đầu đề

  const b = bai[vt] ?? null
  const den = useCallback(async (i: number) => {
    if (i < 0) return
    if (i < bai.length) { setVt(i); return }
    if (het) return
    const ds = await nap(bai)                                              // hết phần đã nạp ⇒ nạp thêm rồi mới sang
    if (i < ds.length) setVt(i)
  }, [bai, het, nap])

  // ← → lật bài (không cướp phím khi đang gõ ô tìm)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'Escape' && phong) { setPhong(null); return }
      if (e.key === 'ArrowRight') void den(vt + 1)
      if (e.key === 'ArrowLeft') void den(vt - 1)
    }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f)
  }, [den, vt, phong])

  const vaBai = (id: string, f: (x: BaiKho) => BaiKho) => setBai((prev) => prev.map((x) => (x.id === id ? f(x) : x)))
  const vaY = (baiId: string, yId: string, v: Partial<YKho>) => vaBai(baiId, (x) => ({ ...x, y: x.y.map((y) => (y.id === yId ? { ...y, ...v } : y)) }))
  const gan = async (y: YKho, baiToanId: string | null) => {
    if (!b) return
    setBan(y.id); setLoi(null)
    try { await api.ganYVaoBai(y.id, baiToanId); vaY(b.id, y.id, { baitoan_id: baiToanId }); onChanged?.() }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }
  const ganBai = async (moHinhId: string | null) => {
    if (!b) return
    setBan('mh'); setLoi(null)
    try { await api.ganBaiVaoMoHinh(b.id, moHinhId); vaBai(b.id, (x) => ({ ...x, mo_hinh_id: moHinhId })) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }
  const duyetY = async (y: YKho) => {
    if (!b) return
    setBan(y.id); setLoi(null)
    try { await api.updateY(y.id, { da_duyet: !y.da_duyet }); vaY(b.id, y.id, { da_duyet: !y.da_duyet }) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }
  const daDuyet = (x: BaiKho) => x.y.length > 0 && x.y.every((y) => y.da_duyet)
  // duyệt CẢ BÀI rồi sang bài chưa duyệt kế tiếp (đúng nhịp "xong 1 bài mới qua bài khác")
  const duyetBai = async () => {
    if (!b || ban) return
    const bat = !daDuyet(b)
    setBan('bai'); setLoi(null)
    try {
      await api.duyetBaiKho(b.id, bat)
      vaBai(b.id, (x) => ({ ...x, y: x.y.map((y) => ({ ...y, da_duyet: bat })) }))
      if (bat) {
        const ke = bai.findIndex((x, i) => i > vt && !daDuyet(x))
        await den(ke >= 0 ? ke : vt + 1)
      }
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }

  const motY = !!b && !b.gia_thiet_chung && b.y.length === 1   // bài một ý: đề nằm trong ý
  const soDaDuyet = bai.filter(daDuyet).length                              // đếm thứ đang nạp

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* thanh điều hướng: bài nào / bao nhiêu · lật · duyệt */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2">
        <button disabled={vt <= 0} onClick={() => void den(vt - 1)} className="h-8 rounded-lg border border-slate-300 px-3 text-[13px] font-medium disabled:opacity-30" title="Bài trước (←)">‹ Trước</button>
        <span className="min-w-[110px] text-center text-[14px] font-semibold text-slate-900">
          {bai.length ? vt + 1 : 0} <span className="font-normal text-slate-400">/ {tong?.so_bai ?? bai.length} bài</span>
        </span>
        <button disabled={dangTai || (het && vt >= bai.length - 1)} onClick={() => void den(vt + 1)} className="h-8 rounded-lg border border-slate-300 px-3 text-[13px] font-medium disabled:opacity-30" title="Bài sau (→)">Sau ›</button>
        <span className="ml-2 text-[12px] text-slate-500">đã duyệt nội dung <b className="text-slate-800">{soDaDuyet}</b>/{bai.length} bài đang nạp{tong ? ` · còn ${tong.so_y} ý chưa phân mô hình` : ''}</span>
        <button onClick={() => { setVt(0); void nap([]) }} className="rounded-md border border-slate-200 px-2 py-0.5 text-[12px] text-slate-500 hover:bg-slate-50" title="Quét lại từ đầu">↻</button>
        {b && (
          <button onClick={duyetBai} disabled={!!ban}
            className={`ml-auto h-9 rounded-lg px-4 text-[13.5px] font-semibold shadow-sm disabled:opacity-50 ${daDuyet(b) ? 'border border-slate-300 bg-white text-slate-600' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
            {ban === 'bai' ? '⏳…' : daDuyet(b) ? '↩ Bỏ duyệt bài này' : '✓ Duyệt bài → bài kế'}
          </button>)}
      </div>
      {loi && <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-[13px] text-rose-700">{loi} <button className="ml-2 underline" onClick={() => setLoi(null)}>đóng</button></div>}

      {!b ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          {dangTai ? 'Đang tải…' : `Khối ${khoi} không còn ý nào chưa phân mô hình.`}
        </div>
      ) : (
        // ⭐ CEO 14/10: HÌNH ĐI THEO Ý — mỗi hàng = (chữ | hình của chính nó). Hình ý = hình riêng của ý (hinh_y.anh_de);
        // ý không dựng thêm ⇒ dùng hình của ý gần nhất phía trước, không có thì hình bài (hinh_bai.anh_de).
        <div ref={cuon} className="min-h-0 flex-1 overflow-auto px-6 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="rounded bg-teal-50 px-1.5 py-0.5 font-mono font-semibold text-teal-700">{b.ma_bai}</span>
            <span className="min-w-0 flex-1 truncate text-slate-500" title={b.nguon ?? ''}>{b.nguon ?? 'chưa rõ nguồn'}</span>
            {b.nguon_ma_cau && <span className="font-mono text-[11px] text-slate-400" title="Mã câu gốc ở kho đề thi">gốc {b.nguon_ma_cau}</span>}
            {b.can_tach_tay && <span className="rounded border border-amber-400 bg-amber-50 px-1.5 font-semibold text-amber-800" title="Máy không tách được ý — bài đang là 1 ý">⚠ cần tách ý tay</span>}
            {daDuyet(b) && <span className="rounded bg-emerald-100 px-1.5 font-semibold text-emerald-800">✓ đã duyệt nội dung</span>}
          </div>
          {/* ⭐ GÁN MÔ HÌNH cho cả bài (CEO 14/10 "chưa thấy nút nào để gán mô hình") — làm được cả khi mô hình chưa có bài */}
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/60 px-3 py-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-teal-800">Mô hình của bài</span>
            {(() => { const m = moHinhs.find((x) => x.id === b.mo_hinh_id); return b.mo_hinh_id ? (
              <>
                <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[13px] font-semibold text-white">{m ? `${m.ma} · ${m.ten}` : 'mô hình đã gán'}</span>
                {m && <span className="text-[12px] text-teal-700">{m.so_bai} bài trong mô hình</span>}
                <ChonMoHinh moHinhs={moHinhs} disabled={ban === 'mh'} nhan="Đổi" onChon={(id) => void ganBai(id)} />
                <button disabled={ban === 'mh'} onClick={() => void ganBai(null)} className="text-[12px] text-rose-600 hover:underline disabled:opacity-40">gỡ</button>
              </>) : (
              <ChonMoHinh moHinhs={moHinhs} disabled={ban === 'mh'} nhan="＋ Gán mô hình" chinh onChon={(id) => void ganBai(id)} />) })()}
            <span className="ml-auto text-[11.5px] text-slate-500">Gán mô hình cho cả bài trước; gán từng ý vào bài của mô hình ở dưới.</span>
          </div>

          {/* đề chung | hình bài. Bài MỘT Ý: hình bài đứng cạnh chính ý đó (bên dưới), hàng đề không lặp lại hình (CEO 14/10). */}
          <Hang hinh={motY ? null : b.anh_de} chuThich={motY ? '' : b.anh_de ? 'Hình bài · giả thiết chung' : 'Chưa có hình bài'} an={motY} onPhong={setPhong}>
            <Muc ten="Đề bài">
              {b.gia_thiet_chung
                ? <div className="rounded-lg bg-teal-600 px-3.5 py-2.5 text-[15px] leading-relaxed text-white"><MathText>{b.gia_thiet_chung}</MathText></div>
                : <div className="text-[12px] text-slate-400">Bài một ý — đề nằm trọn trong ý bên dưới.</div>}
            </Muc>
            {b.huong_dan && (
              <details className="rounded-lg border border-slate-200 bg-white px-3.5 py-2">
                <summary className="cursor-pointer text-[12px] font-semibold uppercase tracking-wide text-slate-500">Hướng dẫn / mấu chốt chung của bài</summary>
                <div className="mt-2 text-[14px] leading-relaxed"><MathText>{b.huong_dan}</MathText></div>
              </details>)}
          </Hang>

          <div className="mt-3 space-y-3">
            {b.y.map((y, i) => {
              // Mỗi hình chỉ hiện MỘT lần, ở chỗ nó xuất hiện đầu tiên. Ý không dựng thêm ⇒ ghi chú gọn "dùng hình … ở trên", không lặp ảnh.
              const truoc = [...b.y.slice(0, i)].reverse().find((z) => z.anh_de)
              const hinhY = motY ? (y.anh_de ?? b.anh_de) : y.anh_de
              const chuThich = motY ? (hinhY ? 'Hình của bài' : 'Chưa có hình')
                : y.anh_de ? `Hình riêng của ý ${y.nhan ?? ''}`.trim()
                : truoc ? `Không dựng thêm — dùng hình ý ${truoc.nhan ?? ''} ở trên`
                : b.anh_de ? 'Không dựng thêm — dùng hình bài ở trên' : 'Chưa có hình'
              return (
                <Hang key={y.id} hinh={hinhY} chuThich={chuThich} rieng={!!y.anh_de} gon={!motY && !y.anh_de && !!(truoc || b.anh_de)} goc={y.anh_loi_giai} onPhong={setPhong}>
                  <div className={`rounded-xl border bg-white p-3.5 ${y.baitoan_id ? 'border-emerald-300' : 'border-slate-200'}`}>
                    <div className="flex items-start gap-2 text-[15px] leading-relaxed">
                      <b className="mt-px shrink-0 text-violet-700">{y.nhan ? `${y.nhan})` : '•'}</b>
                      <div className="min-w-0 flex-1 font-medium text-slate-900"><MathText>{y.noi_dung}</MathText></div>
                      <span className="shrink-0 font-mono text-[10.5px] text-slate-400">{y.ma_y}</span>
                    </div>
                    {y.dap_an && <div className="mt-2 rounded-md bg-emerald-50 px-2.5 py-1 text-[14px] font-semibold"><span className="mr-1 text-[11px] font-semibold uppercase text-emerald-700">Đáp án</span><MathText className="inline">{y.dap_an}</MathText></div>}
                    {y.loi_giai
                      ? <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-[14px] leading-relaxed"><MathText>{y.loi_giai}</MathText></div>
                      : <div className="mt-2 text-[12px] text-rose-500">chưa có lời giải</div>}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5">
                      {y.baitoan_id ? (() => { const c = chon.find((x) => x.baitoan_id === y.baitoan_id); return (
                        <>
                          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[12px] font-semibold text-white">{c ? `${c.goc_ten} · ${c.so}` : 'đã gán'}</span>
                          {c && <span className="min-w-0 flex-1 truncate text-[12px] text-slate-500">{c.phat_bieu.replace(/\$/g, '')}</span>}
                          <button disabled={ban === y.id} onClick={() => void gan(y, null)} className="text-[12px] text-rose-600 hover:underline disabled:opacity-40">gỡ gán</button>
                        </>) })() : (
                        <>
                          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[12px] font-semibold text-amber-800">chưa phân mô hình</span>
                          {(() => {
                            const trongMH = b.mo_hinh_id ? chon.filter((c) => c.goc_id === b.mo_hinh_id) : chon
                            if (b.mo_hinh_id && !trongMH.length) return <span className="text-[12px] text-slate-500">Mô hình này chưa có bài — thêm bài ở <b>Bản đồ mới › Hình – Luyện</b> rồi gán ý vào.</span>
                            return <ChonBaiMoHinh chon={trongMH} disabled={ban === y.id} onChon={(id) => void gan(y, id)} />
                          })()}
                        </>)}
                      <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[12px] text-slate-600" title="Câu hỏi + lời giải của ý này đã đúng">
                        <input type="checkbox" checked={y.da_duyet} disabled={ban === y.id} onChange={() => void duyetY(y)} /> duyệt ý này
                      </label>
                    </div>
                  </div>
                </Hang>)
            })}
          </div>
          {!moHinhs.length && (
            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-[12px] text-amber-800">
              Khối {khoi} chưa có mô hình luyện nào — dựng ở <b>Bản đồ mới › chủ đề vùng Hình – Luyện</b>, rồi quay lại đây gán. Duyệt nội dung không cần chờ mô hình.
            </div>)}
        </div>
      )}

      {phong && (
        <div className="fixed inset-0 z-[80] flex cursor-zoom-out items-center justify-center bg-slate-900/80 p-6" onClick={() => setPhong(null)}>
          <img src={phong} alt="" className="max-h-full max-w-full rounded-lg bg-white object-contain" />
        </div>)}
    </div>
  )
}

/** Một hàng của bài: chữ (trái) | hình của chính hàng đó (phải, dính khi cuộn qua hàng dài). */
function Hang({ hinh, chuThich, rieng, goc, gon, an, onPhong, children }: {
  hinh: string | null | undefined; chuThich: string; rieng?: boolean; goc?: string | null
  gon?: boolean    // không có hình riêng, đã có hình phía trên ⇒ chỉ một dòng ghi chú, không lặp ảnh
  an?: boolean     // không có cột hình (hàng đề của bài một ý)
  onPhong: (u: string) => void; children: React.ReactNode
}) {
  if (an) return <div className="min-w-0 space-y-3">{children}</div>
  if (gon) return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,38%)]">
      <div className="min-w-0 space-y-3">{children}</div>
      <div className="self-start rounded-lg border border-dashed border-slate-200 px-3 py-2 text-[12px] text-slate-400">↑ {chuThich}</div>
    </div>
  )
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,38%)]">
      <div className="min-w-0 space-y-3">{children}</div>
      <div className="lg:sticky lg:top-0 lg:self-start">
        {hinh
          ? <figure className={`overflow-hidden rounded-xl border bg-white ${rieng ? 'border-violet-300' : 'border-slate-200'}`}>
              <img src={hinh} alt={chuThich} onClick={() => onPhong(hinh)} className="max-h-[46vh] w-full cursor-zoom-in object-contain" />
              <figcaption className={`border-t px-2.5 py-1 text-[11.5px] ${rieng ? 'border-violet-100 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>{chuThich}</figcaption>
            </figure>
          : <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-[12.5px] text-slate-400">{chuThich}</div>}
        {goc && goc !== hinh && <button onClick={() => onPhong(goc)} className="mt-1 text-[11px] text-slate-400 underline hover:text-slate-600">xem hình lời giải gốc</button>}
      </div>
    </div>
  )
}

const Muc = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div className="mb-4"><div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{ten}</div>{children}</div>
)

/** Nút + ô tìm–chọn MÔ HÌNH luyện (gán cho cả bài). Mô hình chưa có bài vẫn chọn được. */
function ChonMoHinh({ moHinhs, disabled, nhan, chinh, onChon }: {
  moHinhs: MoHinhLuyen[]; disabled: boolean; nhan: string; chinh?: boolean; onChon: (id: string) => void
}) {
  const [mo, setMo] = useState(false)
  const [tu, setTu] = useState('')
  const loc = useMemo(() => { const k = tu.trim().toLowerCase(); return k ? moHinhs.filter((m) => `${m.ma} ${m.ten}`.toLowerCase().includes(k)) : moHinhs }, [tu, moHinhs])
  if (!moHinhs.length) return <span className="text-[12px] text-amber-700">Khối này chưa có mô hình luyện — tạo ở Bản đồ mới › Hình – Luyện.</span>
  return (
    <div className="relative">
      <button disabled={disabled} onClick={() => setMo(!mo)}
        className={chinh ? 'h-8 rounded-lg bg-teal-600 px-3 text-[13px] font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50'
          : 'rounded-md border border-teal-300 px-2 py-0.5 text-[12px] text-teal-700 hover:bg-teal-50 disabled:opacity-50'}>{nhan}</button>
      {mo && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[380px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
          <input autoFocus value={tu} onChange={(e) => setTu(e.target.value)} placeholder="Tìm mô hình…"
            className="mb-1 w-full rounded-md border border-slate-300 px-2 py-1 text-[12.5px] outline-none focus:border-teal-500" />
          <div className="max-h-64 overflow-auto">
            {!loc.length && <div className="px-2 py-1.5 text-[12px] text-slate-400">Không khớp mô hình nào.</div>}
            {loc.map((m) => (
              <button key={m.id} onClick={() => { onChon(m.id); setMo(false); setTu('') }}
                className="flex w-full items-baseline gap-2 rounded px-2 py-1 text-left text-[12.5px] hover:bg-teal-50">
                <span className="shrink-0 font-mono text-[11px] text-slate-400">{m.ma}</span>
                <span className="min-w-0 flex-1 truncate text-slate-800">{m.ten}</span>
                <span className="shrink-0 text-[11px] text-slate-400">{m.so_bai} bài</span>
              </button>))}
          </div>
        </div>)}
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
        <div className="absolute bottom-full left-0 right-0 z-20 mb-1 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
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
