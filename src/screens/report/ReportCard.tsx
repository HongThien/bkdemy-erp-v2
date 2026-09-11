// REPORT CARD — thẻ ảnh snapshot dùng chung: (1) modal "Ảnh gửi PH" bên ReportPHScreen, (2) chụp tự động
// lúc GV chốt bên ReportPHScreen, (3) button "📸 Chụp ảnh" bên tab "Đã chốt giải" ở TraoGiaiScreen (CEO 11/09
// — trao giải chốt trước report, phải chụp trước). Template HIỂN THỊ + logic tính số liệu Y HỆT — nếu tách 2
// bản sẽ lệch. `captureReportSnapshot()` gọi hết API rồi upload; ghi URL vào `bao_cao_ph.anh_bao_cao_url`
// (cùng cột với Report PH — 1 ảnh cho (HS, môn, tháng)). NÓ KHÔNG động vào `cong_bo_at`, nên trao giải chụp
// KHÔNG bằng công bố report cho PH.
import { forwardRef } from 'react'
import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'
import type { TongQuanHS } from '../../lib/mastery'
import { getTongQuanHS } from '../../lib/mastery'
import { getReportBuoiHS, getBaoCaoPH, getGVChinhLop, getKhoiRankDiemMT, getLopRankDiemMT, getHeRankDiemMT, type BaoCaoPH, type KhoiRankMT, type LopRankMT, type HeRankMT } from '../../lib/report'
import { uploadReportImage } from '../../lib/ph-login'

// đồng bộ với ReportPHScreen top-of-file (thang 5 GV chọn)
const SKILL_MUC = ['Cần cố gắng', 'Trung bình', 'Khá', 'Tốt', 'Xuất sắc'] as const

// Bucket = { pct, n } — copy đồng bộ với ReportPHScreen (số HS đúng/số HS chấm) để render card.
type Bucket = { pct: number | null; n: number }
function tongPct(a: Bucket, b: Bucket): number | null {
  const nT = a.n + b.n; if (!nT) return null
  const s = (a.pct != null ? a.pct * a.n : 0) + (b.pct != null ? b.pct * b.n : 0)
  return Math.round(s / nT)
}


// ── ẢNH GỬI PHỤ HUYNH — thẻ inline-hex (né oklch Tailwind v4), layout kiểu tab Kết quả app PH ──
export const MUC_HEX: Record<string, { bg: string; fg: string; emoji: string; label: string }> = {
  rat_tot: { bg: '#ecfdf5', fg: '#047857', emoji: '🌟', label: 'Con học rất tốt' },
  dat_yeu_cau: { bg: '#f0fdf4', fg: '#15803d', emoji: '✅', label: 'Con đạt yêu cầu' },
  tien_bo: { bg: '#f0f9ff', fg: '#0369a1', emoji: '📈', label: 'Con đang tiến bộ' },
  cai_thien_thai_do: { bg: '#fffbeb', fg: '#b45309', emoji: '⚠️', label: 'Con cần cải thiện thái độ học tập' },
  cai_thien_kien_thuc: { bg: '#fffbeb', fg: '#b45309', emoji: '⚠️', label: 'Con cần cải thiện kiến thức và kĩ năng' },
  van_de_thai_do: { bg: '#fff1f2', fg: '#be123c', emoji: '🆘', label: 'Con gặp vấn đề về thái độ học tập' },
  van_de_kien_thuc: { bg: '#fff1f2', fg: '#be123c', emoji: '🆘', label: 'Con gặp vấn đề về kiến thức và kĩ năng' },
}
const s10 = (pct: number | null) => pct == null ? '—' : (pct / 10).toFixed(1)
const hexPct = (pct: number | null) => pct == null ? '#cbd5e1' : pct >= 80 ? '#059669' : pct >= 50 ? '#d97706' : '#e11d48'

// ── CARD BÁO CÁO (dùng chung: modal "Ảnh gửi PH" + chụp tự động lúc chốt) ──
export type ReportCardProps = {
  hsName: string; hsImg: string | null; lopTen: string; mon: string; ym: string; gvName: string | null;
  tq: TongQuanHS; missCount: number; bc: BaoCaoPH;
  khoiRank: KhoiRankMT | null; lopRank: LopRankMT | null; heRank: HeRankMT | null;
}
export const ReportCardView = forwardRef<HTMLDivElement, ReportCardProps>(function ReportCardView(
  { hsName, hsImg, lopTen, mon, ym, gvName, tq, missCount, bc, khoiRank, lopRank, heRank }, ref,
) {
  const muc = bc.ket_luan_muc ? MUC_HEX[bc.ket_luan_muc] : null
  const a = tq.hoatDong, hh = tq.hoanThanh.toanBo.etMt
  const trendV = tq.trend.hoanThanhToanBo
  const RC2 = 2 * Math.PI * 25
  const rankRing = (top: string, sub: string, r: { rankNow: number; rankTotal: number } | null) => {
    const pct = r ? Math.round(((r.rankTotal - r.rankNow) / Math.max(1, r.rankTotal - 1)) * 100) : null
    const hx = pct == null ? '#94a3b8' : pct >= 80 ? '#12a875' : pct >= 50 ? '#e29a23' : '#e45858'
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <svg width={74} height={74} viewBox="0 0 74 74" style={{ display: 'block' }}>
          <circle cx={37} cy={37} r={25} fill="none" stroke="#e9f3ef" strokeWidth={8} />
          <circle cx={37} cy={37} r={25} fill="none" stroke={hx} strokeWidth={8} strokeDasharray={RC2} strokeDashoffset={RC2 * (1 - (pct ?? 0) / 100)} strokeLinecap="round" transform="rotate(-90 37 37)" />
          <text x={37} y={34} textAnchor="middle" fontSize={14} fontWeight={800} fill={hx}>{r ? `#${r.rankNow}` : '—'}</text>
          <text x={37} y={46} textAnchor="middle" fontSize={7} fontWeight={700} fill="#94a3b8">{r ? `/${r.rankTotal}` : ''}</text>
        </svg>
        <div style={{ fontSize: 9.5, fontWeight: 800, color: '#5a6a83', marginTop: 3 }}>{top}</div>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8' }}>{sub}</div>
      </div>
    )
  }
  const bar5 = (label: string, lvl: number | null, hx: string, text: string | null) => (
    <div style={{ background: '#f7f9fd', border: '1px solid #edf1f7', borderRadius: 13, padding: '10px 11px', marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 10.5, fontWeight: 800, color: '#15233b' }}><span style={{ width: 7, height: 7, borderRadius: 4, background: hx }} />{label}</span>
        <span style={{ fontSize: 9.5, fontWeight: 800, color: lvl ? hx : '#94a3b8' }}>{lvl ? SKILL_MUC[lvl - 1] : '—'}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>{[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: lvl && i <= lvl ? hx : '#e9eef6' }} />)}</div>
      {text ? <p style={{ fontSize: 10, lineHeight: 1.45, color: '#42516a', margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{text}</p> : null}
    </div>
  )
  const statusC = (n: number, label: string, hx: string) => (
    <div style={{ padding: '10px 6px 9px', textAlign: 'center', background: '#fff', border: '1px solid #e8edf5', borderRadius: 15 }}>
      <b style={{ display: 'block', fontSize: 19, color: hx, lineHeight: 1 }}>{n}</b>
      <small style={{ display: 'block', fontSize: 7.5, color: '#a0aabd', fontWeight: 800, letterSpacing: .3, marginTop: 3 }}>DẠNG BÀI</small>
      <small style={{ display: 'block', fontSize: 9, color: '#5a6a83', fontWeight: 800, lineHeight: 1.15, marginTop: 1 }}>{label}</small>
    </div>
  )
  const cell = (lb: string, pct: number | null, sz: number) => <div><span style={{ fontSize: 7.5, color: '#94a3b8', display: 'block' }}>{lb}</span><span style={{ fontSize: sz, fontWeight: 900, color: hexPct(pct) }}>{s10(pct)}</span></div>
  const assessRow = (ten: string, hx: string, cb: Bucket, nc: Bucket, first?: boolean) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr .6fr .6fr .6fr', gap: 6, alignItems: 'center', minHeight: 46, borderTop: first ? 'none' : '1px dashed #e9edf4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, fontWeight: 800, color: '#15233b' }}><span style={{ width: 9, height: 9, borderRadius: 5, background: hx, boxShadow: `0 0 0 4px ${hx}22` }} />{ten}</div>
      {cell('Tổng', tongPct(cb, nc), 16)}{cell('Cơ bản', cb.pct, 15)}{cell('Nâng cao', nc.pct, 15)}
    </div>
  )
  const hexDiem = (v: number | null) => v == null ? '#cbd5e1' : v >= 8 ? '#059669' : v >= 5 ? '#d97706' : '#e11d48'
  const cellDiem = (lb: string, v: number | null, sz: number, colored?: boolean) => <div><span style={{ fontSize: 7.5, color: '#94a3b8', display: 'block' }}>{lb}</span><span style={{ fontSize: sz, fontWeight: 900, color: colored ? hexDiem(v) : v == null ? '#cbd5e1' : '#15233b' }}>{v == null ? '—' : v}</span></div>
  const assessRowDiem = (ten: string, hx: string, tong: number | null, cb: number | null, nc: number | null) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr .6fr .6fr .6fr', gap: 6, alignItems: 'center', minHeight: 46, borderTop: '1px dashed #e9edf4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, fontWeight: 800, color: '#15233b' }}><span style={{ width: 9, height: 9, borderRadius: 5, background: hx, boxShadow: `0 0 0 4px ${hx}22` }} />{ten}</div>
      {cellDiem('Tổng', tong, 16, true)}{cellDiem('Cơ bản', cb, 15)}{cellDiem('Nâng cao', nc, 15)}
    </div>
  )
  return (
    <div ref={ref} style={{ width: 390, margin: '0 auto', background: '#f8fbff', borderRadius: 28, overflow: 'hidden', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif", boxShadow: '0 20px 55px rgba(26,52,95,.16)', border: '1px solid rgba(255,255,255,.8)' }}>
      {/* HERO */}
      <div style={{ position: 'relative', minHeight: 172, padding: '21px 21px 24px', color: '#fff', background: 'radial-gradient(circle at 92% 18%, rgba(78,215,219,.5), transparent 27%), radial-gradient(circle at 18% -10%, rgba(132,151,255,.7), transparent 34%), linear-gradient(135deg,#12315f 0%,#2451b9 60%,#2c77d8 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 185, height: 185, right: -88, bottom: -125, border: '28px solid rgba(255,255,255,.08)', borderRadius: '50%' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 900, letterSpacing: .5, fontSize: 13 }}>
            <svg width={32} height={32} viewBox="0 0 36 36" style={{ display: 'block' }}>
              <rect x="1" y="1" width="15" height="15" rx="4.5" fill="#e5389a" />
              <text x="8.5" y="13" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">B</text>
              <rect x="20" y="1" width="15" height="15" rx="6" fill="#f7941e" />
              <text x="27.5" y="13" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">K</text>
              <path d="M8.5 19.5 L16.2 34 L0.8 34 Z" fill="#2bb6d6" />
              <text x="8.5" y="33" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">+</text>
              <circle cx="27.5" cy="27.5" r="7.6" fill="#7ac143" />
              <text x="27.5" y="31.4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">−</text>
            </svg>
            <span>BK ACADEMY</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, padding: '7px 10px', borderRadius: 999, background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)' }}>THÁNG {ym.split('-')[1]}/{ym.split('-')[0]}</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '54px 1fr', gap: 13, alignItems: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 18, overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'linear-gradient(145deg,#fff,#dce9ff)', border: '3px solid rgba(255,255,255,.28)' }}>
            {hsImg
              ? <img src={hsImg} alt="" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <svg width={26} height={26} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4.2" fill="#315fdd" fillOpacity=".55" /><path d="M4 20.5c0-4.4 3.6-7.2 8-7.2s8 2.8 8 7.2" stroke="#315fdd" strokeOpacity=".55" strokeWidth="2.2" strokeLinecap="round" /></svg>}
          </div>
          <div><div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.12, letterSpacing: -.25 }}>{hsName}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11, color: '#e9f2ff', marginTop: 6 }}><span>Lớp {lopTen}</span><span>· Môn {mon}</span>{gvName ? <span>· GV {gvName}</span> : null}</div>
          </div>
        </div>
      </div>
      {/* BODY */}
      <div style={{ padding: '0 13px 14px', marginTop: -13, position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, boxShadow: '0 7px 18px rgba(35,63,104,.055)', padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#315fdd', fontWeight: 900, textTransform: 'uppercase', letterSpacing: .7 }}>Xu hướng tháng này</div>
          <div style={{ fontSize: 16, fontWeight: 800, margin: '4px 0', color: '#15233b', letterSpacing: -.15 }}>{muc ? `${muc.emoji} ${muc.label}` : 'Kết quả học tập tháng'}</div>
          {trendV != null && trendV !== 0 ? <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', fontSize: 10, fontWeight: 900, color: trendV > 0 ? '#12a875' : '#e45858', background: trendV > 0 ? '#ecfbf5' : '#fdecec', padding: '6px 8px', borderRadius: 999 }}>{trendV > 0 ? '↗' : '↘'} {trendV > 0 ? 'Tăng' : 'Giảm'} {Math.abs(trendV)}% so với kỳ trước</span> : null}
        </div>
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, padding: '13px 14px 10px', marginBottom: 10, boxShadow: '0 7px 18px rgba(35,63,104,.055)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <span style={{ width: 31, height: 31, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#eef0ff', fontSize: 14 }}>🏆</span>
            <div><div style={{ fontSize: 13, fontWeight: 800, color: '#15233b' }}>Xếp hạng Test tháng này</div><div style={{ fontSize: 9, color: '#70809b' }}>Theo điểm Test tháng</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, justifyItems: 'center' }}>
            {rankRing('Lớp', lopTen, lopRank)}
            {rankRing('Hệ', heRank ? `${heRank.khoi}${heRank.he}` : '—', heRank)}
            {rankRing('Khối', khoiRank ? khoiRank.khoi : '—', khoiRank)}
          </div>
        </div>
        {(bc.ket_luan || bc.thai_do || bc.kien_thuc_ky_nang || bc.muc_kien_thuc || bc.muc_thai_do) ? <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, padding: 14, marginBottom: 10, boxShadow: '0 7px 18px rgba(35,63,104,.055)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <span style={{ width: 31, height: 31, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#eef0ff', fontSize: 15 }}>✦</span>
            <div><div style={{ fontSize: 13, fontWeight: 800, color: '#15233b' }}>Nhận xét của giáo viên</div><div style={{ fontSize: 9, color: '#70809b' }}>{gvName ? `GV ${gvName}` : 'Đánh giá cá nhân theo quá trình học'}</div></div>
          </div>
          {bc.ket_luan ? <p style={{ fontSize: 11, lineHeight: 1.48, color: '#42516a', margin: '0 0 4px', whiteSpace: 'pre-wrap' }}>{bc.ket_luan}</p> : null}
          {bar5('Kiến thức & kỹ năng', bc.muc_kien_thuc, '#315fdd', bc.kien_thuc_ky_nang)}
          {bar5('Thái độ học tập', bc.muc_thai_do, '#12a875', bc.thai_do)}
        </div> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginBottom: 10 }}>{statusC(hh.dat, 'Đạt yêu cầu', '#12a875')}{statusC(hh.can_luyen, 'Cần luyện tập', '#e29a23')}{statusC(hh.yeu, 'Còn yếu', '#e45858')}</div>
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, padding: '13px 14px 10px', marginBottom: 10, boxShadow: '0 7px 18px rgba(35,63,104,.055)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
            <span style={{ width: 31, height: 31, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#eef0ff', fontSize: 14 }}>📊</span>
            <div><div style={{ fontSize: 13, fontWeight: 800, color: '#15233b' }}>Kết quả đánh giá trong tháng</div><div style={{ fontSize: 9, color: '#70809b' }}>Thang điểm 10</div></div>
          </div>
          {assessRow('Test cuối giờ', '#315fdd', a.etCoBan, a.etNangCao, true)}
          {assessRow('Bài tập về nhà', '#12a875', a.btvnCoBan, a.btvnNangCao)}
          {assessRowDiem('Test tháng', '#e29a23', tq.diem.mt.tb, tq.diem.mt.coBan, tq.diem.mt.nangCao)}
          {missCount > 0 ? <div style={{ fontSize: 9.5, color: '#da7d00', marginTop: 6 }}>⚠ Chưa hoàn thành BTVN {missCount} lần trong tháng</div> : null}
        </div>
        {bc.muc_tieu ? <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 10, alignItems: 'center', background: 'linear-gradient(135deg,#fff9e9,#fff)', border: '1px solid #f3e7bf', borderRadius: 20, padding: '12px 13px', marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 13, display: 'grid', placeItems: 'center', background: '#fff0bd', fontSize: 17 }}>🎯</div>
          <div><b style={{ fontSize: 11, display: 'block', marginBottom: 3 }}>Mục tiêu tháng tới</b><p style={{ fontSize: 9.5, lineHeight: 1.4, color: '#776844', margin: 0, whiteSpace: 'pre-wrap' }}>{bc.muc_tieu}</p></div>
        </div> : null}
        <p style={{ textAlign: 'center', color: '#8c99ad', fontSize: 8.5, margin: '10px 0 1px' }}>BK Academy · Đồng hành cùng tiến bộ của con mỗi ngày</p>
      </div>
    </div>
  )
})

// Chụp card ra ảnh PNG (render off-screen) + upload → URL. Dùng khi GV bấm Chốt.
export async function renderCardToUrl(props: ReportCardProps, key: string): Promise<string> {
  const holder = document.createElement('div')
  holder.style.cssText = 'position:fixed;left:-99999px;top:0;z-index:-1'
  document.body.appendChild(holder)
  const root = createRoot(holder)
  root.render(<ReportCardView {...props} />)
  await new Promise((r) => setTimeout(r, 650)) // chờ render + ảnh avatar
  const node = holder.firstElementChild as HTMLElement
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#f8fbff', useCORS: true, logging: false, width: node.scrollWidth, height: node.scrollHeight })
  root.unmount(); holder.remove()
  return uploadReportImage(key, canvas.toDataURL('image/png'))
}

// Gọi ĐỦ mọi API để dựng ReportCardProps rồi render + upload — dùng chung Report PH + Trao giải.
// Trả về URL ảnh đã upload; caller tự ghi vào `bao_cao_ph.anh_bao_cao_url` (không auto-ghi ở đây để caller kiểm quyền).
export async function captureReportSnapshot(p: {
  hsId: string; mon: string; ym: string; lopId: string | null;
  hsName: string; hsImg: string | null; lopTen: string;
  gvName?: string | null; // nếu caller đã có (đỡ 1 query); không có thì tự lấy theo lopId
}): Promise<string> {
  const [tq, rows, bc, khoiRank, lopRank, heRank, gvName] = await Promise.all([
    getTongQuanHS(p.hsId, p.mon, { ym: p.ym }),
    getReportBuoiHS(p.hsId, p.mon, p.ym),
    getBaoCaoPH(p.hsId, p.mon, p.ym),
    getKhoiRankDiemMT(p.hsId, p.mon, p.ym),
    p.lopId ? getLopRankDiemMT(p.hsId, p.lopId, p.mon, p.ym) : Promise.resolve(null),
    getHeRankDiemMT(p.hsId, p.mon, p.ym),
    p.gvName !== undefined ? Promise.resolve(p.gvName) : (p.lopId ? getGVChinhLop(p.lopId) : Promise.resolve(null)),
  ])
  const missCount = rows.filter((r) => r.btvnTrangThai === 'khong_lam' || r.btvnTrangThai === 'xin_phep').length
  return renderCardToUrl({ hsName: p.hsName, hsImg: p.hsImg, lopTen: p.lopTen, mon: p.mon, ym: p.ym, gvName, tq, missCount, bc, khoiRank, lopRank, heRank }, `${p.hsId}_${p.ym}`)
}
