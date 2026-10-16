// Chấm THI THỬ tự luận (Ôn thi GK1 pha 4; spec-on-thi-gk1.md, Thùy 16/10) — TA/GV chấm từ ẢNH HS chụp nộp.
// Hàng đợi DERIVE ở DB (fn_thi_thu_cho_cham: bài thi_thu đã nộp còn câu tự luận chưa có dòng bai_lam_cau). Màn này chỉ vẽ + gọi RPC.
// CLAUDE §2 "sau mutation không reload cả danh sách": chấm 1 câu ⇒ vá đúng bài đó tại chỗ (ds do TaHome giữ, setDs patch);
// rời màn quay lại ⇒ nhớ bộ lọc + cuộn + bài đang mở (NHO ở module, sống tới F5); nút ↻ ép quét lại nền (không xoá list).
import { useEffect, useRef, useState } from 'react'
import { MathText } from '../kho/ui'
import { BK_TROI, BKTabHeader, MaHS } from '../../components/bk/BKUI'
import { baiChamChiTiet, chamTuLuan, kyAnhThiThu, type BaiChamChiTiet, type BaiChoCham, type CauTuLuanCham } from '../../lib/thithucham'

const NHO: { loc: string; cuon: number; baiId: string | null } = { loc: '', cuon: 0, baiId: null }

const fmtGio = (iso: string | null) => (iso ? new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '')
const tenLoc = (b: BaiChoCham) => `${b.mon}${b.khoi ? ` ${b.khoi}` : ''}`

export default function ChamThiThu({ ds, setDs, onBack, onQuet }: {
  ds: BaiChoCham[]; setDs: (f: (p: BaiChoCham[]) => BaiChoCham[]) => void; onBack: () => void; onQuet: () => Promise<void>
}) {
  const [baiId, setBaiId] = useState<string | null>(NHO.baiId)
  const [loc, setLoc] = useState(NHO.loc)
  const [dangQuet, setDangQuet] = useState(false)
  const cuonRef = useRef<HTMLDivElement>(null)
  useEffect(() => { NHO.baiId = baiId }, [baiId])
  useEffect(() => { NHO.loc = loc }, [loc])
  useEffect(() => { if (!baiId && cuonRef.current) cuonRef.current.scrollTop = NHO.cuon }, [baiId])

  async function quet() { setDangQuet(true); try { await onQuet() } finally { setDangQuet(false) } }

  if (baiId) {
    const dong = ds.find((b) => b.bai_lam_id === baiId)
    return <BaiCham key={baiId} baiLamId={baiId}
      onBack={() => setBaiId(null)}
      onCapNhat={(cho) => setDs((p) => (cho > 0 ? p.map((b) => (b.bai_lam_id === baiId ? { ...b, so_cau_cho: cho } : b)) : p.filter((b) => b.bai_lam_id !== baiId)))}
      tieuDe={dong ? `${dong.ho_ten}` : undefined} />
  }

  const cacLoc = [...new Set(ds.map(tenLoc))].sort()
  const hien = ds.filter((b) => !loc || tenLoc(b) === loc)
  return (
    <div className="flex h-[100dvh] flex-col" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <BKTabHeader icon="/bk-ui/pr_et.png" title="Chấm Thi thử" sub={`${ds.length} bài chờ chấm tự luận`} onBack={onBack}
        right={<button onClick={quet} disabled={dangQuet} aria-label="Quét lại" className="h-9 w-9 shrink-0 rounded-full bg-[#EEF3FF] text-[18px] font-bold text-[#2F73F6] active:scale-95 disabled:opacity-50">{dangQuet ? '…' : '↻'}</button>} />
      <div ref={cuonRef} onScroll={(e) => { NHO.cuon = e.currentTarget.scrollTop }} className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-2 px-2 pb-6">
          {cacLoc.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {['', ...cacLoc].map((l) => (
                <button key={l || 'all'} onClick={() => setLoc(l)} className={`rounded-full px-3 py-1 text-[12.5px] font-bold ${loc === l ? 'bg-[#2F73F6] text-white' : 'bg-white/90 text-[#63709A]'}`}>{l || 'Tất cả'}</button>
              ))}
            </div>
          )}
          {hien.length === 0
            ? <p className="rounded-[18px] bg-white/90 px-4 py-6 text-center text-[14px] text-[#63709A]">✓ Không còn bài Thi thử nào chờ chấm.</p>
            : hien.map((b) => (
              <button key={b.bai_lam_id} onClick={() => setBaiId(b.bai_lam_id)} className="flex flex-col gap-1 rounded-[20px] bg-white/90 px-3.5 py-3 text-left active:scale-[.99]">
                <span className="flex items-center gap-2">
                  <span className="min-w-0 truncate text-[15px] font-extrabold text-[#16224D]">{b.ho_ten}</span><MaHS ma={b.ma_hs} />
                  <span className="ml-auto shrink-0 rounded-full bg-[#FFF1D6] px-2 py-0.5 text-[11.5px] font-bold text-[#C27A00]">{b.so_cau_cho}/{b.so_cau_tu_luan} câu chờ</span>
                </span>
                <span className="truncate text-[12.5px] text-[#16224D]">{b.de_ten ?? 'Đề thi'}</span>
                <span className="text-[11.5px] text-[#63709A]">{tenLoc(b)} · nộp {fmtGio(b.nop_at)}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

// ── MỘT BÀI: từng câu tự luận = đề + lời giải mẫu + ảnh HS + ô điểm + nhận xét + Lưu ──
function BaiCham({ baiLamId, tieuDe, onBack, onCapNhat }: { baiLamId: string; tieuDe?: string; onBack: () => void; onCapNhat: (cho: number) => void }) {
  const [b, setB] = useState<BaiChamChiTiet | null | 'loi' | undefined>(undefined)
  const [url, setUrl] = useState<Record<string, string>>({})
  const [phong, setPhong] = useState<string | null>(null)
  const [xong, setXong] = useState<number | null | false>(false) // false = chưa xong; số/null = đã chấm hết (điểm hệ 10 do DB trả)

  useEffect(() => {
    let bo = false
    baiChamChiTiet(baiLamId).then(async (r) => {
      if (bo) return
      setB(r)
      if (r) kyAnhThiThu(r.cau.flatMap((c) => c.anh.map((a) => a.path))).then((m) => { if (!bo) setUrl(m) }).catch(() => {})
    }).catch(() => { if (!bo) setB('loi') })
    return () => { bo = true }
  }, [baiLamId])

  function vaCau(id: string, p: Partial<CauTuLuanCham>) { setB((x) => (x && x !== 'loi' ? { ...x, cau: x.cau.map((c) => (c.bai_test_cau_id === id ? { ...c, ...p } : c)) } : x)) }

  return (
    <div className="flex h-[100dvh] flex-col" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <BKTabHeader icon="/bk-ui/pr_et.png" title={tieuDe ?? 'Chấm bài'} sub={b && b !== 'loi' ? `${b.de_ten ?? 'Đề thi'} · ${b.mon}${b.khoi ? ` ${b.khoi}` : ''}` : undefined} onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-3 px-2 pb-8">
          {b === undefined ? <p className="rounded-[18px] bg-white/90 px-4 py-6 text-center text-[14px] text-[#63709A]">Đang tải…</p>
            : b === 'loi' ? <p className="rounded-[18px] bg-rose-50 px-4 py-6 text-center text-[14px] font-semibold text-rose-700">Không tải được bài. Bấm ‹ rồi mở lại.</p>
            : b === null ? <p className="rounded-[18px] bg-white/90 px-4 py-6 text-center text-[14px] text-[#63709A]">Bài này không còn trong hàng chờ (chưa nộp hoặc không phải Thi thử).</p>
            : <>
                <div className="flex items-center gap-2 rounded-[18px] bg-white/90 px-3.5 py-2.5">
                  <span className="text-[15px] font-extrabold text-[#16224D]">{b.ho_ten}</span><MaHS ma={b.ma_hs} />
                  <span className="ml-auto text-[12px] text-[#63709A]">nộp {fmtGio(b.nop_at)}</span>
                </div>
                {xong !== false && (
                  <div className="rounded-[18px] bg-[#E4F8EC] px-4 py-3 text-[14px] font-bold text-[#1E8A52]">
                    ✓ Đã chấm xong mọi câu tự luận{xong != null ? ` — điểm tổng ${xong}/10` : ''}. Điểm và hạng đã mở cho em.
                    <button onClick={onBack} className="ml-3 rounded-full bg-white px-3 py-1 text-[12.5px] text-[#2F73F6]">Về danh sách</button>
                  </div>
                )}
                {b.cau.map((c) => (
                  <CauCham key={c.bai_test_cau_id} c={c} url={url} onPhong={setPhong}
                    onLuu={async (diem, nx) => {
                      const r = await chamTuLuan(baiLamId, c.bai_test_cau_id, diem, nx)
                      vaCau(c.bai_test_cau_id, { da_cham: true, diem: r.diem, nhan_xet: nx })
                      onCapNhat(r.cho)
                      if (r.xong) setXong(r.diem_10)
                    }} />
                ))}
              </>}
        </div>
      </div>
      {phong && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/85" onClick={() => setPhong(null)}>
          <button className="fixed right-3 top-3 z-10 h-10 w-10 rounded-full bg-white text-[20px] font-bold text-[#16224D]" aria-label="Đóng">×</button>
          <img src={phong} alt="Bài làm của em" className="mx-auto my-4 block w-full max-w-none sm:w-[min(100%,1400px)]" />
        </div>
      )}
    </div>
  )
}

function CauCham({ c, url, onPhong, onLuu }: { c: CauTuLuanCham; url: Record<string, string>; onPhong: (u: string) => void; onLuu: (diem: number, nhanXet: string | null) => Promise<void> }) {
  const [diem, setDiem] = useState(c.diem != null ? String(c.diem) : '')
  const [nx, setNx] = useState(c.nhan_xet ?? '')
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [daLuu, setDaLuu] = useState(c.da_cham)
  const so = Number(diem)
  // chỉ kiểm hình thức ô nhập (khoảng + bước 0,25); luật thật nằm ở DB
  const hopLe = diem.trim() !== '' && Number.isFinite(so) && so >= 0 && so <= c.diem_toi_da && so * 4 === Math.round(so * 4)
  const dapAn = typeof c.dap_an === 'string' ? c.dap_an : ''
  async function luu() {
    setDang(true); setLoi(null)
    try { await onLuu(so, nx.trim() || null); setDaLuu(true) }
    catch (e: any) { setLoi(e?.message ?? 'Lưu không được.') }
    finally { setDang(false) }
  }
  return (
    <div className="flex flex-col gap-2.5 rounded-[22px] bg-white/95 p-3.5">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#E6DDFF] px-2.5 py-0.5 text-[12.5px] font-bold text-[#8B6BEF]">Câu {c.thu_tu}</span>
        {c.phan && <span className="truncate text-[12px] text-[#63709A]">{c.phan}</span>}
        <span className="ml-auto text-[12px] font-bold text-[#63709A]">tối đa {c.diem_toi_da} điểm</span>
        {daLuu && <span className="rounded-full bg-[#E4F8EC] px-2 py-0.5 text-[11.5px] font-bold text-[#1E8A52]">đã chấm</span>}
      </div>
      <div className="text-[14px] text-[#16224D]">
        {c.noi_dung && <MathText>{c.noi_dung}</MathText>}
        {c.anh_de && <img src={c.anh_de} alt="hình đề" className="my-2 max-h-72 rounded-lg bg-white" />}
      </div>
      {(dapAn || c.loi_giai || c.anh_dap_an) && (
        <div className="rounded-xl bg-[#F1F6FF] px-3 py-2 text-[13px] text-[#16224D]">
          <p className="mb-1 text-[11.5px] font-bold uppercase tracking-wide text-[#2F73F6]">Lời giải mẫu</p>
          {dapAn && <p><b>Đáp án:</b> <MathText>{dapAn}</MathText></p>}
          {c.loi_giai && <MathText>{c.loi_giai}</MathText>}
          {c.anh_dap_an && <img src={c.anh_dap_an} alt="hình lời giải" className="mt-1 max-h-72 rounded-lg bg-white" />}
        </div>
      )}
      <div>
        <p className="mb-1 text-[11.5px] font-bold uppercase tracking-wide text-[#63709A]">Bài làm của em ({c.anh.length} ảnh)</p>
        {c.anh.length === 0
          ? <p className="rounded-xl bg-[#FFF3D6] px-3 py-2 text-[13px] font-semibold text-[#B87800]">Em không nộp ảnh cho câu này — chấm 0 nếu đúng là bỏ trống.</p>
          : <div className="flex flex-wrap gap-2">
              {c.anh.map((a) => url[a.path]
                ? <button key={a.id} onClick={() => onPhong(url[a.path])} className="overflow-hidden rounded-xl ring-1 ring-[#DCE6FF] active:scale-95"><img src={url[a.path]} alt="" className="h-40 w-auto max-w-[260px] object-cover" /></button>
                : <span key={a.id} className="flex h-40 w-28 items-center justify-center rounded-xl bg-[#EEF3FF] text-[12px] text-[#63709A]">đang tải…</span>)}
            </div>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#16224D]">Điểm
          <input type="number" inputMode="decimal" min={0} max={c.diem_toi_da} step={0.25} value={diem}
            onChange={(e) => { setDiem(e.target.value); setDaLuu(false) }}
            className="h-10 w-24 rounded-xl border border-[#C9D6F2] px-2 text-center text-[16px] font-bold text-[#16224D]" />
          <span className="text-[#63709A]">/ {c.diem_toi_da}</span>
        </label>
        <button onClick={() => { setDiem('0'); setDaLuu(false) }} className="h-9 rounded-full bg-[#FFE3E8] px-3 text-[12.5px] font-bold text-[#C0355A]">0</button>
        <button onClick={() => { setDiem(String(c.diem_toi_da)); setDaLuu(false) }} className="h-9 rounded-full bg-[#E4F8EC] px-3 text-[12.5px] font-bold text-[#1E8A52]">Tối đa</button>
      </div>
      <input value={nx} onChange={(e) => { setNx(e.target.value); setDaLuu(false) }} placeholder="Nhận xét (không bắt buộc)"
        className="h-10 w-full rounded-xl border border-[#C9D6F2] px-3 text-[14px] text-[#16224D]" />
      {loi && <p className="text-[12.5px] font-semibold text-rose-700">⚠ {loi}</p>}
      <button onClick={luu} disabled={!hopLe || dang} className="h-11 rounded-2xl bg-[#2F73F6] text-[15px] font-bold text-white active:scale-[.99] disabled:opacity-40">
        {dang ? 'Đang lưu…' : daLuu ? '✓ Đã lưu (bấm để lưu lại)' : 'Lưu điểm câu này'}
      </button>
      {diem.trim() !== '' && !hopLe && <p className="text-[12px] text-[#C27A00]">Điểm từ 0 đến {c.diem_toi_da}, bước 0,25.</p>}
    </div>
  )
}
