// Trả bài test đầu vào (Story 4) — tab RIÊNG, tương đương Chấm test (Thùy chốt 07-19). Sinh sớm ngay khi
// điểm danh đóng; CHẶN đóng tới khi đủ 3 nguồn: chấm xong + scan-đã-chấm + đã chọn lớp đề xuất.
// ⭐ 12/09 (CEO, kit v2) — 2 thứ TÁCH BẠCH: (1) PHIẾU gửi PH = bản in đẹp (PhieuTestDauVao.tsx, read-only);
// (2) màn ĐÁNH GIÁ của GV = form riêng "gần giống" phong cách đó — click 1 HS ⇒ popup màn hình to:
// TRÁI = form nhập (kỹ năng 5 mức · nhận xét · lớp đề xuất) style navy/gold, PHẢI = phiếu thật xem trước,
// sửa gì thấy ngay. Nháp tự lưu (debounce) khi gõ; lớp đề xuất ghi `ung_vien.lop_du_kien_id` ngay khi chọn.
// Số liệu (%, điểm) do Postgres tính (fn_test_dau_vao_phieu — §2.0). "Của tôi" = ca tôi được gán
// `nguoi_tra_bai_id`. Sau mutation KHÔNG reload cả danh sách (CLAUDE.md §2): đóng 1 ca ⇒ vá tại chỗ.
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  listCanTraBai, listDaTraBai, dongTraBai, getPhieuKetQua, setNhanXet, paragraphNhanXet, mucKyNang,
  timNhanXetMau, luuNhanXetMau,
  type CaTestChoTraBai, type PhieuKetQua, type NhanXet,
} from '../../lib/detest'
import { listLop } from '../../lib/nhansu'
import { updateUngVien } from '../../lib/tuyensinh'
import { useStore } from '../../store/useStore'
import SearchSelect from '../../components/SearchSelect'
import { PhieuCard, PhieuTestModal, moPopupXuatAnh, ensureFonts, Icon, I, PHIEU_W, NAVY, NAVY_DAM, GOLD, GOLD_SANG, NEN, CHU, CHU_PHU, FONT } from './PhieuTestDauVao'

const NHO: { loc: 'toi' | 'tatca' | null } = { loc: null }

export default function TraBaiTestScreen() {
  const me = useStore((s) => s.me)
  const myId = me?.nhanSu.id ?? null
  const [canTraBai, setCanTraBai] = useState<CaTestChoTraBai[]>([])
  const [daTraBai, setDaTraBai] = useState<CaTestChoTraBai[]>([])
  const [loading, setLoading] = useState(true)
  const [loc, setLoc] = useState<'toi' | 'tatca'>(NHO.loc ?? (myId ? 'toi' : 'tatca'))
  const [openId, setOpenId] = useState<string | null>(null)   // ca đang đánh giá (popup form)
  const [xemId, setXemId] = useState<string | null>(null)     // ca đã trả — chỉ xem lại/copy
  const [xemPhieu, setXemPhieu] = useState<PhieuKetQua | null>(null)
  useEffect(() => { NHO.loc = loc }, [loc])

  async function reload() {
    setLoading(true)
    try { const [c, t] = await Promise.all([listCanTraBai(), listDaTraBai()]); setCanTraBai(c); setDaTraBai(t) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])
  useEffect(() => {
    if (!xemId) { setXemPhieu(null); return }
    getPhieuKetQua(xemId).then(setXemPhieu).catch(() => setXemPhieu(null))
  }, [xemId])

  const cuaToi = useMemo(() => canTraBai.filter((c) => c.nguoiTraBaiId === myId), [canTraBai, myId])
  const shown = loc === 'toi' ? cuaToi : canTraBai
  const patch = (id: string, p: Partial<CaTestChoTraBai>) => setCanTraBai((s) => s.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const daDong = (id: string) => {
    const it = canTraBai.find((x) => x.id === id)
    setCanTraBai((s) => s.filter((x) => x.id !== id))
    if (it) setDaTraBai((s) => [{ ...it, choLopDeXuat: false }, ...s])
    setOpenId(null)
  }
  const openItem = openId ? canTraBai.find((c) => c.id === openId) ?? null : null

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Trả bài test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Bấm vào học sinh → đánh giá (kỹ năng · nhận xét · lớp) có phiếu xem trước → Copy ảnh gửi Zalo cho PH → Đã gửi, đóng.</p>
        </div>
        <div className="ml-auto inline-flex rounded-full bg-slate-100 p-0.5">
          {([['toi', `Của tôi (${cuaToi.length})`], ['tatca', `Tất cả (${canTraBai.length})`]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setLoc(k)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${loc === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
          ))}
          <button onClick={reload} title="Quét lại" className="rounded-full px-2 text-[14px] text-slate-400 hover:text-indigo-600">↻</button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : shown.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
          {loc === 'toi' && canTraBai.length > 0 ? `Không có ca nào gán cho bạn — hàng đợi chung còn ${canTraBai.length} ca.` : 'Không có bài nào cần trả.'}
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {shown.map((c) => {
            const thieu = [c.choChamXong && 'chờ chấm', c.choScanDaCham && 'chờ scan bài đã chấm', c.choLopDeXuat && 'chờ chọn lớp'].filter(Boolean) as string[]
            return (
              <button key={c.id} onClick={() => setOpenId(c.id)} className="rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm hover:shadow-md">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
                    <div className="mt-0.5 text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Khối ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}{c.diemNhap != null ? ` · ${c.diemNhap}đ` : ''}</div>
                  </div>
                  {c.nguoiTraBaiTen && <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">👤 {c.nguoiTraBaiTen}</span>}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {thieu.length === 0
                    ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Đủ, sẵn sàng trả</span>
                    : thieu.map((t) => <span key={t} className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">{t}</span>)}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {daTraBai.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã trả bài ({daTraBai.length})</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {daTraBai.map((c) => (
              <button key={c.id} onClick={() => setXemId(c.id)} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-left text-[12px] text-slate-500 shadow-sm hover:shadow-md">
                <span className="font-semibold text-slate-700">{c.hoTenHs}</span> · {c.mon}{c.diemNhap != null ? ` · ${c.diemNhap}đ` : ''} <span className="text-slate-300">· xem lại</span>
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
    {openItem && <DanhGiaGvModal c={openItem} onClose={() => setOpenId(null)} onPatch={(p) => patch(openItem.id, p)} onDone={() => daDong(openItem.id)} />}
    {xemPhieu && <PhieuTestModal p={xemPhieu} onClose={() => setXemId(null)} />}
    </div>
  )
}

// Dữ liệu cũ (3 mức chữ / 2 ô kiến thức / câu dẫn) → khuôn mới: nhận xét = 1 paragraph ở `khac`; mức số 1..5.
function chuanHoaNx(nx: NhanXet | null): NhanXet {
  const n: NhanXet = { ...(nx ?? {}) }
  const para = paragraphNhanXet(n)
  if (para && !(n.khac ?? '').trim()) n.khac = para
  const tb = mucKyNang(n.trinhBay), tt = mucKyNang(n.tinhToan)
  if (tb != null) n.trinhBay = tb; else delete n.trinhBay
  if (tt != null) n.tinhToan = tt; else delete n.tinhToan
  delete n.kienThuc; delete n.trinhBayNhanXet; delete n.tinhToanNhanXet
  return n
}

// ═══ FORM ĐÁNH GIÁ CỦA GV — style navy/gold "gần giống phiếu" ════════════════════════════════════
const FORM_W = 400
const NHAN_MUC: Record<number, string> = { 1: 'Yếu', 2: 'Cần cố gắng', 3: 'Trung bình', 4: 'Khá', 5: 'Tốt' }
const card = (extra?: React.CSSProperties): React.CSSProperties => ({ background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 4px 14px rgba(16,43,85,0.08)', ...extra })
function DauMuc({ icon, text, phu }: { icon: string; text: string; phu?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <Icon svg={icon} />
      <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{text}</div>
      {phu && <div style={{ marginLeft: 'auto', fontSize: 11, color: CHU_PHU }}>{phu}</div>}
    </div>
  )
}
function ChonMuc({ icon, ten, muc, onPick }: { icon: string; ten: string; muc: number | null; onPick: (m: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: '1px solid #EEF2F7' }}>
      <Icon svg={icon} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{ten}</span>
          <span style={{ fontSize: 12, color: CHU_PHU }}>{muc ? `${muc}/5 · ${NHAN_MUC[muc]}` : 'chưa chọn'}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((m) => {
            const on = muc != null && m <= muc
            return (
              <button key={m} type="button" onClick={() => onPick(m)} title={NHAN_MUC[m]}
                style={{ flex: 1, height: 34, borderRadius: 9, border: `1.5px solid ${on ? GOLD : '#D7DFEA'}`, background: on ? `linear-gradient(135deg, ${NAVY} 0%, #1C3C74 100%)` : '#fff', color: on ? GOLD_SANG : CHU_PHU, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT, boxShadow: on ? '0 3px 8px rgba(16,43,85,0.25)' : 'none' }}>{m}</button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DanhGiaGvModal({ c, onClose, onPatch, onDone }: { c: CaTestChoTraBai; onClose: () => void; onPatch: (p: Partial<CaTestChoTraBai>) => void; onDone: () => void }) {
  const [phieu, setPhieu] = useState<PhieuKetQua | null>(null)
  const [nx, setNxRaw] = useState<NhanXet>(() => chuanHoaNx(c.nhanXet))
  const [lopId, setLopIdRaw] = useState<string | null>(c.lopDeXuatId)
  const [lopOpts, setLopOpts] = useState<{ id: string; label: string; sub?: string }[]>([])
  const [goiY, setGoiY] = useState<{ id: string; noiDung: string }[]>([])
  const [focusNx, setFocusNx] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [luu, setLuu] = useState<'sach' | 'dang' | 'xong'>('sach')
  const [scale, setScale] = useState(1)
  const cardRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)
  const nxRef = useRef(nx)

  useEffect(() => {
    ensureFonts()
    getPhieuKetQua(c.id).then(setPhieu).catch((e) => setErr(e.message ?? String(e)))
    listLop(c.khoi ?? undefined).then((l) => setLopOpts(l.filter((x) => x.mon === c.mon).map((x) => ({ id: x.id, label: x.ten_lop, sub: x.mon }))))
  }, [c.id]) // eslint-disable-line
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') dongModal() }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }) // eslint-disable-line
  // Phiếu xem trước co theo bề ngang còn lại (form 400 + lề), không bao giờ vượt 1:1.
  useEffect(() => {
    const tinh = () => setScale(Math.min(1, Math.max(0.45, (window.innerWidth - FORM_W - 72) / PHIEU_W)))
    tinh(); window.addEventListener('resize', tinh); return () => window.removeEventListener('resize', tinh)
  }, [])
  useEffect(() => {
    if (!focusNx) return
    const t = setTimeout(() => { timNhanXetMau(c.mon, 'khac', nx.khac ?? '').then((r) => setGoiY(r.map((x) => ({ id: x.id, noiDung: x.noiDung })))).catch(() => setGoiY([])) }, 200)
    return () => clearTimeout(t)
  }, [nx.khac, focusNx, c.mon])

  // Autosave nháp 700ms sau lần gõ/bấm cuối; flush khi đóng/xuất/gửi.
  async function luuNgay(v: NhanXet) {
    setLuu('dang')
    try { await setNhanXet(c.id, v); onPatch({ nhanXet: v }); setLuu('xong') } catch (e: any) { setErr(e.message ?? String(e)); setLuu('sach') }
  }
  const setNx = (f: (s: NhanXet) => NhanXet) => {
    setNxRaw((s) => {
      const v = f(s); nxRef.current = v
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => luuNgay(v), 700)
      return v
    })
  }
  const setLopId = async (id: string | null) => {
    setLopIdRaw(id); setErr(null)
    try { await updateUngVien(c.ungVienId, { lop_du_kien_id: id }); onPatch({ lopDeXuatId: id, choLopDeXuat: !id }); setPhieu(await getPhieuKetQua(c.id)) }
    catch (e: any) { setErr(e.message ?? String(e)) }
  }
  async function flush() { if (timer.current) { window.clearTimeout(timer.current); timer.current = null; await luuNgay(nxRef.current) } }
  async function dongModal() { await flush(); onClose() }
  async function xuatAnh() { await flush(); if (cardRef.current && phieuXem) await moPopupXuatAnh(cardRef.current, phieuXem) }
  async function daGui() {
    setBusy(true); setErr(null)
    try { await flush(); await dongTraBai(c.id, c.ungVienId, lopId); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const conThieu = [c.choChamXong && 'chờ chấm xong', c.choScanDaCham && 'chờ scan bài đã chấm', !lopId && 'chưa chọn lớp đề xuất'].filter(Boolean) as string[]
  const tenLop = lopOpts.find((o) => o.id === lopId)?.label ?? phieu?.lopDeXuat?.tenLop ?? null
  // Phiếu xem trước = số liệu DB + nhận xét/lớp ĐANG nhập (không chờ DB) — GV thấy đúng cái PH sẽ nhận.
  const phieuXem: PhieuKetQua | null = phieu ? { ...phieu, nhanXet: nx, lopDeXuat: lopId ? { id: lopId, tenLop: tenLop ?? '', gv: [], lich: [] } : null } : null
  const tb = mucKyNang(nx.trinhBay), tt = mucKyNang(nx.tinhToan)

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ fontFamily: FONT, background: '#0F172A' }}>
      {/* Thanh trên */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white">
        <div className="min-w-0">
          <div className="text-[14px] font-semibold">{c.hoTenHs} <span className="font-normal text-slate-400">· {c.mon}{c.khoi ? ` · Khối ${c.khoi}` : ''}{c.diemNhap != null ? ` · ${c.diemNhap}/10` : ''}</span></div>
          <div className="text-[11px] text-slate-400">
            {luu === 'dang' ? 'Đang lưu nháp…' : luu === 'xong' ? '✓ Đã lưu nháp' : 'Nháp tự lưu khi nhập'}
            {conThieu.length > 0 && <span className="ml-2 text-amber-300">· còn thiếu: {conThieu.join(', ')}</span>}
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {c.baiDaChamUrl && <a href={c.baiDaChamUrl} target="_blank" rel="noreferrer" className="rounded-md border border-slate-500 px-3 py-1.5 text-[13px] hover:bg-slate-700">📄 Bài đã chấm</a>}
          <button onClick={xuatAnh} disabled={!phieu} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium hover:bg-indigo-500 disabled:opacity-40">📋 Copy ảnh gửi PH</button>
          <button onClick={daGui} disabled={busy || conThieu.length > 0} title={conThieu.join(', ')} className="rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold hover:bg-emerald-500 disabled:opacity-40">{busy ? 'Đang xử lý…' : '✓ Đã gửi, đóng'}</button>
          <button onClick={dongModal} className="rounded-md border border-slate-500 px-3 py-1.5 text-[13px] hover:bg-slate-700">Đóng</button>
        </div>
        {err && <div className="w-full text-[12px] text-rose-300">{err}</div>}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* TRÁI — form đánh giá */}
        <div style={{ width: FORM_W, flexShrink: 0, background: NEN, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DAM} 0%, #163A72 60%, ${NAVY_DAM} 100%)`, padding: '14px 18px', borderBottom: `2px solid ${GOLD}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: GOLD_SANG, letterSpacing: '2px' }}>ĐÁNH GIÁ CỦA GIÁO VIÊN</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{c.hoTenHs}</div>
            {phieu && <div style={{ fontSize: 12, color: '#C9D5EA', marginTop: 2 }}>Đúng {phieu.tong.pct}% · {phieu.tong.daCham}/{phieu.tong.soCau} câu · Điểm {phieu.diemNhap ?? '—'}/10</div>}
          </div>
          <div style={{ padding: 14, display: 'grid', gap: 12 }}>
            <div style={card()}>
              <DauMuc icon={I.gear()} text="Đánh giá kĩ năng" phu="thang 5" />
              <ChonMuc icon={I.pencilDoc()} ten="Trình bày" muc={tb} onPick={(m) => setNx((s) => ({ ...s, trinhBay: m }))} />
              <ChonMuc icon={I.calc()} ten="Tính toán" muc={tt} onPick={(m) => setNx((s) => ({ ...s, tinhToan: m }))} />
            </div>

            <div style={card()}>
              <DauMuc icon={I.comment()} text="Nhận xét của giáo viên" phu="in nguyên văn lên phiếu" />
              <div style={{ position: 'relative' }}>
                <textarea value={nx.khac ?? ''} onChange={(e) => setNx((s) => ({ ...s, khac: e.target.value }))} onFocus={() => setFocusNx(true)} onBlur={() => setTimeout(() => setFocusNx(false), 150)}
                  rows={6} placeholder="Nói về kiến thức cơ bản / nâng cao, thái độ làm bài, hướng phát triển của con…"
                  style={{ width: '100%', border: '1.5px solid #D7DFEA', background: '#F4F7FC', borderRadius: 12, padding: '10px 12px', resize: 'vertical', outline: 'none', fontFamily: FONT, fontSize: 14, lineHeight: 1.65, color: CHU }} />
                {focusNx && goiY.length > 0 && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 5, marginTop: 4, background: '#fff', border: '1px solid #D7DFEA', borderRadius: 10, boxShadow: '0 8px 24px rgba(16,43,85,0.18)', maxHeight: 200, overflow: 'auto' }}>
                    {goiY.map((g) => (
                      <button key={g.id} type="button" onMouseDown={() => { setNx((s) => ({ ...s, khac: g.noiDung })); setFocusNx(false) }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', fontSize: 12.5, color: CHU, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>{g.noiDung}</button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: CHU_PHU }}>
                <span>{(nx.khac ?? '').length} ký tự · gõ để hiện câu mẫu</span>
                {(nx.khac ?? '').trim() && <button type="button" onClick={() => luuNhanXetMau(c.mon, 'khac', nx.khac ?? '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: NAVY, fontFamily: FONT, fontSize: 11, fontWeight: 600 }}>💾 Lưu làm mẫu</button>}
              </div>
            </div>

            <div style={card({ background: 'linear-gradient(135deg, #FFF8EA 0%, #FDF1D6 100%)', border: '1px solid #F1DFB5' })}>
              <DauMuc icon={I.cap()} text="Đề xuất lớp phù hợp" />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 72, height: 68, borderRadius: 12, background: `linear-gradient(160deg, #1C3C74 0%, ${NAVY} 60%, ${NAVY_DAM} 100%)`, border: `2px solid ${GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: GOLD_SANG, letterSpacing: '1.5px' }}>LỚP</div>
                  <div style={{ fontSize: tenLop && tenLop.length > 4 ? 16 : 22, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{tenLop ?? '—'}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="🔎 Chọn lớp cùng môn, cùng khối…" />
                  <div style={{ fontSize: 11, color: CHU_PHU, marginTop: 4 }}>Lưu ngay khi chọn. Bắt buộc trước khi "Đã gửi".</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHẢI — phiếu thật xem trước (co theo màn) */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 20 }}>
          {!phieuXem ? <p className="text-center text-sm text-slate-300">Đang tải số liệu…</p> : (
            <div style={{ width: PHIEU_W * scale, margin: '0 auto' }}>
              <div style={{ width: PHIEU_W, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <div ref={cardRef} style={{ width: PHIEU_W }}><PhieuCard p={phieuXem} /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
