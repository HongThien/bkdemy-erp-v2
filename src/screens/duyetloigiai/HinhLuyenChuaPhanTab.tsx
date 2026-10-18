// Duyệt kho › "Hình luyện · chưa phân mô hình" (CEO 14/10): bài Hình–Luyện đã vào kho nhưng ý CHƯA gán vào bài nào của mô hình.
//
// ⭐ MỖI LẦN MỘT BÀI, TRỌN MÀN (CEO 14/10 sáng): duyệt Hình phải nhìn đủ ĐỀ + ĐÁP ÁN CHI TIẾT + HÌNH cùng lúc ⇒ không xếp thẻ
// thành danh sách cuộn. Trái = đề + từng ý + lời giải MỞ SẴN · phải = hình (to, đứng yên khi cuộn lời giải).
// "✓ Duyệt bài → bài kế" duyệt mọi ý của bài rồi sang bài chưa duyệt tiếp theo. ← → để lật bài.
// Hàng đợi + đếm tính ở DB. Sau mỗi thao tác VÁ TẠI CHỖ; nhớ danh sách + bài đang xem theo khối tới khi F5.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../../lib/kho/api'
import { NHAN_LOAI_CAU_HL, type BaiKho, type CheDoHL, type LoaiCauHL, type MoHinhLuyen, type YKho } from '../../lib/kho/hinhCay'
import { MathText } from '../kho/ui'
import { useNhanXet, NutCanSua, NhanXetCu } from './CanSua'

const TRANG = 30
// ⭐ Thùy 18/10: mô hình luyện CHỈ lấy bài TỰ LUẬN ⇒ hàng 'cho' = tự luận chưa duyệt; trắc nghiệm / đúng sai / trả lời ngắn nằm ở
// "kho riêng" ('khac'); "Bỏ qua" (không duyệt vào kho, có lý do) nằm ở 'bo_qua'. Nhớ danh sách theo (khối × hàng).
const NHO: Record<string, { bai: BaiKho[]; het: boolean; vt: number }> = {}
const khoaNho = (khoi: string, cd: CheDoHL) => `${khoi}|${cd}`
const NGAY = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export default function HinhLuyenChuaPhanTab({ khoi, onChanged }: { khoi: string; onChanged?: () => void }) {
  const [cheDo, setCheDo] = useState<CheDoHL>('cho')
  const [phu, setPhu] = useState<{ bo_qua: number; khac: number } | null>(null)   // số bài ở hai hàng phụ — tính ở DB
  const [bai, setBai] = useState<BaiKho[]>(() => NHO[khoaNho(khoi, 'cho')]?.bai ?? [])
  const [het, setHet] = useState(() => NHO[khoaNho(khoi, 'cho')]?.het ?? false)
  const [vt, setVt] = useState(() => NHO[khoaNho(khoi, 'cho')]?.vt ?? 0)                // bài đang xem (chỉ số trong danh sách đã nạp)
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
      const moi = await api.khoChuaPhanMoHinh(khoi, TRANG, themVao.length, cheDo)
      const ds = [...themVao, ...moi]
      setBai(ds); setHet(moi.length < TRANG)
      return ds
    } catch (e: any) { setLoi(e.message ?? String(e)); return themVao }
    finally { setDangTai(false) }
  }, [khoi, cheDo])

  // đếm nền (không xoá danh sách): hàng chờ duyệt + hai hàng phụ
  const napDem = useCallback(() => {
    api.demChuaPhanMoHinh().then((d) => { const x = d.find((r) => r.khoi === khoi); setTong(x ? { so_bai: x.so_bai, so_y: x.so_y } : { so_bai: 0, so_y: 0 }) }).catch(() => setTong(null))
    api.demHangPhuHL(khoi).then(setPhu).catch(() => setPhu(null))
  }, [khoi])

  // đổi khối / đổi hàng = đổi ngữ cảnh: dùng lại danh sách đã nhớ nếu có, không thì nạp
  useEffect(() => {
    const n = NHO[khoaNho(khoi, cheDo)]
    if (n) { setBai(n.bai); setHet(n.het); setVt(n.vt) } else { setBai([]); setHet(false); setVt(0); void nap([]) }
  }, [khoi, cheDo]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    api.moHinhLuyenCuaKhoi(khoi).then(setMoHinhs).catch(() => setMoHinhs([]))
    napDem()
  }, [khoi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { NHO[khoaNho(khoi, cheDo)] = { bai, het, vt } }, [bai, het, vt, khoi, cheDo])
  useEffect(() => { cuon.current?.scrollTo({ top: 0 }) }, [vt])           // sang bài khác ⇒ đọc lại từ đầu đề

  const b = bai[vt] ?? null
  const nhanXet = useNhanXet('hinh_bai', 'toan')   // "✎ Cần sửa": bài một màn ⇒ không ẩn, hiện dải chờ sửa + sang bài kế
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
  const ganBai = async (moHinhId: string | null) => {
    if (!b) return
    setBan('mh'); setLoi(null)
    try { await api.ganBaiVaoMoHinh(b.id, moHinhId); vaBai(b.id, (x) => ({ ...x, mo_hinh_id: moHinhId })); onChanged?.() }
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
  // Bài rời hàng đang xem (bỏ qua · khôi phục · đổi loại): VÁ TẠI CHỖ — bỏ đúng bài đó, đứng nguyên vị trí (bài kế dồn lên), đếm nạp lại nền.
  const goBai = (id: string) => {
    const i = bai.findIndex((x) => x.id === id)
    const ds = bai.filter((x) => x.id !== id)
    setBai(ds); setVt(Math.max(0, Math.min(i >= 0 && i < vt ? vt - 1 : vt, ds.length - 1)))
    napDem(); onChanged?.()
  }
  const boQua = async (lyDo: string) => {
    if (!b) return
    setBan('qua'); setLoi(null)
    try { await api.boQuaBaiKho(b.id, lyDo); goBai(b.id) }
    catch (e: any) { setLoi(e.message ?? String(e)); throw e }
    finally { setBan(null) }
  }
  const khoiPhuc = async () => {
    if (!b) return
    setBan('qua'); setLoi(null)
    try { await api.khoiPhucBaiKho(b.id); goBai(b.id) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(null) }
  }
  const doiLoai = async (loai: LoaiCauHL) => {
    if (!b || loai === b.loai_cau) return
    setBan('loai'); setLoi(null)
    try {
      await api.doiLoaiBaiKho(b.id, loai)
      // hàng 'cho' chỉ có tự luận · hàng 'khac' chỉ có loại khác ⇒ đổi sang phía bên kia thì rời hàng này; còn lại chỉ đổi nhãn
      const roi = (cheDo === 'cho' && loai !== 'tu_luan') || (cheDo === 'khac' && loai === 'tu_luan')
      if (roi) goBai(b.id); else vaBai(b.id, (x) => ({ ...x, loai_cau: loai }))
    } catch (e: any) { setLoi(e.message ?? String(e)) }
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
      {/* 3 hàng: chờ duyệt (tự luận) · đã bỏ qua · kho riêng (trắc nghiệm, đúng/sai, trả lời ngắn) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-6 py-1.5">
        {([['cho', 'Chờ duyệt · tự luận', tong?.so_bai], ['bo_qua', 'Đã bỏ qua', phu?.bo_qua], ['khac', 'Kho riêng · trắc nghiệm / đúng-sai / trả lời ngắn', phu?.khac]] as [CheDoHL, string, number | undefined][]).map(([id, nhan, n]) => (
          <button key={id} onClick={() => setCheDo(id)}
            className={`rounded-full border px-3 py-1 text-[12.5px] ${cheDo === id ? 'border-teal-600 bg-teal-600 font-semibold text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-teal-400'}`}>
            {nhan}{n != null ? <span className={`ml-1.5 rounded-full px-1.5 text-[11px] ${cheDo === id ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{n}</span> : null}
          </button>))}
        <span className="ml-2 text-[11.5px] text-slate-500">Mô hình luyện chỉ lấy bài <b>tự luận</b>.</span>
      </div>
      {/* thanh điều hướng: bài nào / bao nhiêu · lật · duyệt */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2">
        <button disabled={vt <= 0} onClick={() => void den(vt - 1)} className="h-8 rounded-lg border border-slate-300 px-3 text-[13px] font-medium disabled:opacity-30" title="Bài trước (←)">‹ Trước</button>
        <span className="min-w-[110px] text-center text-[14px] font-semibold text-slate-900">
          {bai.length ? vt + 1 : 0} <span className="font-normal text-slate-400">/ {(cheDo === 'cho' ? tong?.so_bai : cheDo === 'bo_qua' ? phu?.bo_qua : phu?.khac) ?? bai.length} bài</span>
        </span>
        <button disabled={dangTai || (het && vt >= bai.length - 1)} onClick={() => void den(vt + 1)} className="h-8 rounded-lg border border-slate-300 px-3 text-[13px] font-medium disabled:opacity-30" title="Bài sau (→)">Sau ›</button>
        {cheDo === 'cho' && <span className="ml-2 text-[12px] text-slate-500">đã duyệt nội dung <b className="text-slate-800">{soDaDuyet}</b>/{bai.length} bài đang nạp{tong ? ` · còn ${tong.so_bai} bài chưa có mô hình` : ''}</span>}
        <button onClick={() => { setVt(0); void nap([]); napDem() }} className="rounded-md border border-slate-200 px-2 py-0.5 text-[12px] text-slate-500 hover:bg-slate-50" title="Quét lại từ đầu">↻</button>
        {b && cheDo === 'cho' && (
          <span className="ml-auto flex items-center gap-2">
            <NutBoQua ma={b.ma_bai} busy={ban === 'qua'} onXacNhan={boQua} />
            <NutCanSua doiTuong="hinh_bai" mon="toan" ma={b.id} man={`Duyệt kho › Hình luyện · ${b.ma_bai}`} khau="de"
              onXong={(t) => { nhanXet.vaNX(t); void den(vt + 1) }} />
          </span>)}
        {b && cheDo === 'cho' && (
          <button onClick={duyetBai} disabled={!!ban}
            className={`h-9 rounded-lg px-4 text-[13.5px] font-semibold shadow-sm disabled:opacity-50 ${daDuyet(b) ? 'border border-slate-300 bg-white text-slate-600' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
            {ban === 'bai' ? '⏳…' : daDuyet(b) ? '↩ Bỏ duyệt bài này' : '✓ Duyệt bài → bài kế'}
          </button>)}
      </div>
      {loi && <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-[13px] text-rose-700">{loi} <button className="ml-2 underline" onClick={() => setLoi(null)}>đóng</button></div>}

      {!b ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          {dangTai ? 'Đang tải…' : cheDo === 'cho' ? `Khối ${khoi} không còn bài tự luận nào chưa có mô hình.` : cheDo === 'bo_qua' ? `Khối ${khoi} chưa bỏ qua bài nào.` : `Khối ${khoi} chưa có bài trắc nghiệm / đúng-sai / trả lời ngắn nào ở kho riêng.`}
        </div>
      ) : (
        // ⭐ CEO 14/10: HÌNH ĐI THEO Ý — mỗi hàng = (chữ | hình của chính nó). Hình ý = hình riêng của ý (hinh_y.anh_de);
        // ý không dựng thêm ⇒ dùng hình của ý gần nhất phía trước, không có thì hình bài (hinh_bai.anh_de).
        <div ref={cuon} className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {nhanXet.cua('toan', b.id) && <div className="mb-3"><NhanXetCu hienChoSua t={nhanXet.cua('toan', b.id)} /></div>}
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="rounded bg-teal-50 px-1.5 py-0.5 font-mono font-semibold text-teal-700">{b.ma_bai}</span>
            <span className="min-w-0 flex-1 truncate text-slate-500" title={b.nguon ?? ''}>{b.nguon ?? 'chưa rõ nguồn'}</span>
            {b.nguon_ma_cau && <span className="font-mono text-[11px] text-slate-400" title="Mã câu gốc ở kho đề thi">gốc {b.nguon_ma_cau}</span>}
            {b.can_tach_tay && <span className="rounded border border-amber-400 bg-amber-50 px-1.5 font-semibold text-amber-800" title="Máy không tách được ý — bài đang là 1 ý">⚠ cần tách ý tay</span>}
            {daDuyet(b) && <span className="rounded bg-emerald-100 px-1.5 font-semibold text-emerald-800">✓ đã duyệt nội dung</span>}
            {/* loại câu: máy xếp nhầm thì đổi tại đây — đổi sang phía bên kia thì bài rời hàng này */}
            <label className="flex items-center gap-1 text-[11.5px] text-slate-500">loại
              <select value={b.loai_cau} disabled={ban === 'loai'} onChange={(e) => void doiLoai(e.target.value as LoaiCauHL)}
                className={`rounded border px-1 py-0.5 text-[12px] font-semibold ${b.loai_cau === 'tu_luan' ? 'border-slate-300 text-slate-700' : 'border-violet-300 bg-violet-50 text-violet-800'}`}>
                {(Object.keys(NHAN_LOAI_CAU_HL) as LoaiCauHL[]).map((k) => <option key={k} value={k}>{NHAN_LOAI_CAU_HL[k]}</option>)}
              </select>
            </label>
          </div>
          {/* Đã bỏ qua: hiện lý do + khôi phục */}
          {cheDo === 'bo_qua' && (
            <div className="mb-3 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-600 px-2.5 py-0.5 text-[12.5px] font-semibold text-white">⤼ Đã bỏ qua — không duyệt vào kho</span>
                {b.bo_qua_at && <span className="text-[11.5px] text-slate-500">{b.bo_qua_ten || '?'} · {NGAY(b.bo_qua_at)}</span>}
                <button onClick={() => void khoiPhuc()} disabled={ban === 'qua'} className="ml-auto h-8 rounded-lg border border-teal-400 bg-white px-3 text-[13px] font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-50">↩ Khôi phục vào hàng duyệt</button>
              </div>
              <div className="text-[13.5px] text-slate-800"><b className="text-slate-500">Lý do:</b> {b.bo_qua_ly_do}</div>
            </div>)}
          {cheDo === 'khac' && (
            <div className="mb-3 rounded-xl border border-violet-300 bg-violet-50 px-3 py-2 text-[13px] text-violet-900">
              <b>{NHAN_LOAI_CAU_HL[b.loai_cau]}</b> — không vào mô hình luyện (mô hình chỉ lấy tự luận); bài nằm ở kho riêng. Máy xếp nhầm thì đổi “loại” ở trên về <b>Tự luận</b> để đưa lại hàng duyệt.
            </div>)}
          {/* ⭐ GÁN MÔ HÌNH cho cả bài (CEO 14/10 "chưa thấy nút nào để gán mô hình") — làm được cả khi mô hình chưa có bài. Chỉ hàng chờ duyệt. */}
          {cheDo === 'cho' && <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/60 px-3 py-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-teal-800">Mô hình của bài</span>
            {(() => { const m = moHinhs.find((x) => x.id === b.mo_hinh_id); return b.mo_hinh_id ? (
              <>
                <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[13px] font-semibold text-white">{m ? `${m.ma} · ${m.ten}` : 'mô hình đã gán'}</span>
                {m && <span className="text-[12px] text-teal-700">{m.so_bai} bài trong mô hình</span>}
                <ChonMoHinh moHinhs={moHinhs} disabled={ban === 'mh'} nhan="Đổi" onChon={(id) => void ganBai(id)} />
                <button disabled={ban === 'mh'} onClick={() => void ganBai(null)} className="text-[12px] text-rose-600 hover:underline disabled:opacity-40">gỡ</button>
              </>) : (
              <ChonMoHinh moHinhs={moHinhs} disabled={ban === 'mh'} nhan="＋ Gán mô hình" chinh onChon={(id) => void ganBai(id)} />) })()}
            <span className="ml-auto text-[11.5px] text-slate-500">Gán mô hình là đủ để bài vào kho — xem ở Bản đồ mới › Hình – Luyện › ③ Kho bài.</span>
          </div>}

          {/* ⭐ Bố cục 2 cột MỘT lưới (CEO 14/10: "thu gọn vào thì lời giải phải ở ngay dưới, không cách ra"):
               cột trái = chữ xếp SÁT nhau (đề → ý a → ý b…), cột phải = mỗi hình đứng cạnh hàng đầu tiên dùng nó và
               KÉO DÀI (row-span) qua các ý không dựng thêm — hàng chữ không còn bị kéo cao bằng hình. Hình dính khi cuộn.
               Bài MỘT Ý: hình bài đứng cạnh chính ý đó, hàng đề không có hình. Mỗi hình chỉ hiện một lần. */}
          {(() => {
            const hang: { key: string; trai: React.ReactNode; hinh?: { url: string | null; chuThich: string; rieng: boolean; goc?: string | null } }[] = []
            hang.push({
              key: 'de',
              trai: (
                <div className="min-w-0 space-y-3">
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
                </div>),
              hinh: motY ? undefined : { url: b.anh_de, chuThich: b.anh_de ? 'Hình bài · giả thiết chung' : 'Chưa có hình bài', rieng: false },
            })
            b.y.forEach((y) => {
              const url = motY ? (y.anh_de ?? b.anh_de) : y.anh_de
              hang.push({
                key: y.id,
                trai: (
                  <div className={`rounded-xl border bg-white p-3.5 ${y.da_duyet ? 'border-emerald-300' : 'border-slate-200'}`}>
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
                      {!motY && !y.anh_de && <span className="text-[11.5px] text-slate-400">không dựng thêm — dùng hình bên cạnh</span>}
                      {cheDo === 'cho' && <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[12px] text-slate-600" title="Câu hỏi + lời giải của ý này đã đúng">
                        <input type="checkbox" checked={y.da_duyet} disabled={ban === y.id} onChange={() => void duyetY(y)} /> duyệt ý này
                      </label>}
                    </div>
                  </div>),
                hinh: url || motY ? { url, chuThich: motY ? (url ? 'Hình của bài' : 'Chưa có hình') : `Hình riêng của ý ${y.nhan ?? ''}`.trim(), rieng: !!y.anh_de, goc: y.anh_loi_giai } : undefined,
              })
            })
            // hình kéo dài tới hàng kế tiếp có hình riêng; ghi rõ những ý dùng chung hình đó
            const chu = hang.map((h, i) => (h.hinh ? i : -1)).filter((i) => i >= 0)
            return (
              <div className="space-y-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,38%)] lg:gap-x-4 lg:gap-y-3 lg:space-y-0">
                {hang.map((h, i) => {
                  const k = chu.indexOf(i)
                  const den = k >= 0 ? (chu[k + 1] ?? hang.length) : i + 1
                  const dung = hang.slice(i + 1, den).map((_, j) => b.y[i + j]?.nhan).filter(Boolean)
                  return [
                    <div key={h.key} className="min-w-0" style={{ gridColumn: 1, gridRow: i + 1 }}>{h.trai}</div>,
                    h.hinh && (
                      <div key={h.key + ':h'} style={{ gridColumn: 2, gridRow: `${i + 1} / span ${den - i}` }}>
                        <div className="lg:sticky lg:top-0">
                          {h.hinh.url
                            ? <figure className={`overflow-hidden rounded-xl border bg-white ${h.hinh.rieng ? 'border-violet-300' : 'border-slate-200'}`}>
                                <img src={h.hinh.url} alt={h.hinh.chuThich} onClick={() => setPhong(h.hinh!.url)} className="max-h-[46vh] w-full cursor-zoom-in object-contain" />
                                <figcaption className={`border-t px-2.5 py-1 text-[11.5px] ${h.hinh.rieng ? 'border-violet-100 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                                  {h.hinh.chuThich}{dung.length ? ` · dùng tiếp cho ý ${dung.join(', ')}` : ''}</figcaption>
                              </figure>
                            : <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-[12.5px] text-slate-400">{h.hinh.chuThich}</div>}
                          {h.hinh.goc && h.hinh.goc !== h.hinh.url && <button onClick={() => setPhong(h.hinh!.goc!)} className="mt-1 text-[11px] text-slate-400 underline hover:text-slate-600">xem hình lời giải gốc</button>}
                        </div>
                      </div>),
                  ]
                })}
              </div>)
          })()}
          {cheDo === 'cho' && !moHinhs.length && (
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

/** "⤼ Bỏ qua" — KHÔNG duyệt bài vào kho; bắt buộc ghi lý do (cùng khuôn khung "✎ Cần sửa", nhưng không chờ Claude sửa). */
function NutBoQua({ ma, busy, onXacNhan }: { ma: string; busy: boolean; onXacNhan: (lyDo: string) => Promise<void> }) {
  const [mo, setMo] = useState(false)
  const [nd, setNd] = useState('')
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const gui = async () => {
    if (!nd.trim()) return
    setDang(true); setLoi(null)
    try { await onXacNhan(nd.trim()); setMo(false); setNd('') }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
    finally { setDang(false) }
  }
  return (
    <>
      <button onClick={() => setMo(true)} disabled={busy} title="Không duyệt bài này vào kho — ghi lý do; bài rời hàng duyệt (xem lại ở “Đã bỏ qua”)"
        className="rounded-md border border-slate-400 bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50">⤼ Bỏ qua</button>
      {mo && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={() => !dang && setMo(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 rounded-t-xl bg-slate-600 px-4 py-2.5 text-white">
              <span className="flex-1 text-[14px] font-semibold">⤼ Bỏ qua · <code className="text-[12.5px] font-normal">{ma}</code></span>
              <button onClick={() => setMo(false)} disabled={dang} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Vì sao không đưa bài này vào kho</span>
                <textarea autoFocus value={nd} onChange={(e) => setNd(e.target.value)} rows={4}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void gui() }}
                  placeholder={'Ghi ngắn gọn lý do, vd:\n· Đề quá khó / ngoài chương trình\n· Trùng với bài HLB00xxx\n· Hình cần vẽ lại, tạm gác'}
                  className="rounded-md border border-slate-300 p-2.5 text-[13.5px] outline-none focus:border-slate-500" />
              </label>
              <p className="text-[11.5px] text-slate-500">Bài KHÔNG được duyệt vào kho và rời hàng chờ duyệt. Khác “Cần sửa”: không có ai sửa lại — muốn dùng lại thì vào “Đã bỏ qua” bấm Khôi phục.</p>
              {loi && <div className="text-[12.5px] text-rose-600">⚠ {loi}</div>}
              <div className="flex justify-end gap-2">
                <button onClick={() => setMo(false)} disabled={dang} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
                <button onClick={() => void gui()} disabled={!nd.trim() || dang}
                  className="rounded-md bg-slate-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-slate-700 disabled:opacity-40">{dang ? 'Đang ghi…' : 'Bỏ qua bài này (Ctrl+Enter)'}</button>
              </div>
            </div>
          </div>
        </div>)}
    </>
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
