// TRƯỚC BUỔI — tab thứ 6 của BuoiDetail (spec-truocbuoi.md). Style "sổ điểm giấy", KHÔNG dùng skill
// bkdemy-scifi-ui. Read-only: chỉ gọi getBaoCaoTruocBuoi, không có action nào ghi dữ liệu ở màn này.
// Bảng màu lấy ĐÚNG theo mockup truocbuoi-redesign-gon.html (không phải mặc định Tailwind) — giữ 1 chỗ
// duy nhất để đổi nếu Thùy chỉnh lại thiết kế.
import { useEffect, useState } from 'react'
import { getBaoCaoTruocBuoi, type BaoCaoTruocBuoi, type HangHS, type DangNgan, type TrangThaiNop, type ThaiDo } from '../../lib/truocbuoi'
import { TRUOCBUOI_CONFIG as CFG } from '../../gami/config.js'

const SERIF = { fontFamily: "'Lora', serif" }
const C = {
  bg: '#f4f6f2', paper: '#fffefb', line: '#e4e8e1', line2: '#edf0eb',
  navy: '#17324d', navy2: '#557086', muted: '#8293a0',
  red: '#c84d42', redSoft: '#fff3f1', redBorder: '#f1cfc9',
  amber: '#c88a2e', amberSoft: '#fff8e8', amberBorder: '#eed8a8', amberIconBg: '#f3dfad', amberIconText: '#8c651d', amberText: '#6f5525',
  green: '#2f7a58', greenSoft: '#edf8f1', greenBorder: '#cfe8d8',
  purple: '#7359a5', orange: '#d58c38',
  perm: '#74848b', permSoft: '#f3f4f2', permBorder: '#dde2dc',
  wait: '#6f7f86', waitBorder: '#d7dcd5', waitStripeA: '#fafaf8', waitStripeB: '#f0f1ed',
  recentHeadBg: '#f1f6f7', recentHeadText: '#4e6e7c', recentCellBg: '#f8fbfb',
  headBg: '#f8faf7', headText: '#788c9a',
  sqOk: { background: '#dceee4', borderColor: '#b9dbc6' }, sqLate: { background: '#f8e9c8', borderColor: '#e5c989' },
  sqNo: { background: '#f5d8d4', borderColor: '#e5aaa2' }, sqE: { background: '#f7f8f5', borderColor: '#dfe3dd' },
  weakBg: '#f5f7f4', weakText: '#657984', weakCode: '#98a4aa', weakBadCode: '#cb746b',
  avatarBg: '#eef3f5',
}
const waitStripe = { backgroundImage: `repeating-linear-gradient(45deg, ${C.waitStripeA}, ${C.waitStripeA} 4px, ${C.waitStripeB} 4px, ${C.waitStripeB} 8px)` }

const TT_LABEL: Record<TrangThaiNop, string> = { nop_dung_han: 'Đúng hạn', nop_muon: 'Nộp muộn', khong_lam: 'Không làm', xin_phep: 'Xin phép' }
const TT_PILL_STYLE: Record<TrangThaiNop, React.CSSProperties> = {
  nop_dung_han: { background: C.greenSoft, borderColor: C.greenBorder, color: C.green },
  nop_muon: { background: C.amberSoft, borderColor: C.amberBorder, color: C.amber },
  khong_lam: { background: C.redSoft, borderColor: C.redBorder, color: C.red },
  xin_phep: { background: C.permSoft, borderColor: C.permBorder, color: C.perm },
}
const TD_LABEL: Record<ThaiDo, string> = { nghiem_tuc: 'Nghiêm túc', chua_het_suc: 'Chưa hết sức', chua_nghiem_tuc: 'Chưa nghiêm túc', chong_doi: 'Chống đối' }
const OB_SQ: Record<TrangThaiNop, React.CSSProperties> = { nop_dung_han: C.sqOk, nop_muon: C.sqLate, khong_lam: C.sqNo, xin_phep: C.sqE }

const ddmm = (ngay: string) => { const [, m, d] = ngay.split('-'); return `${d}/${m}` }
const initials = (ten: string): string => { const parts = ten.trim().split(/\s+/).filter(Boolean); return parts.slice(-2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?' }

export default function TruocBuoiTab({ lopId, ngayBuoi, mon }: { lopId: string; ngayBuoi: string; mon: string }) {
  const [data, setData] = useState<BaoCaoTruocBuoi | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    setData(null); setErr(null)
    getBaoCaoTruocBuoi({ lopId, ngayBuoi, mon }).then(setData).catch((e) => setErr(e.message ?? String(e)))
  }, [lopId, ngayBuoi, mon])

  if (err) return <p className="text-sm" style={{ color: C.red }}>Lỗi: {err}</p>
  if (!data) return <p className="text-sm" style={{ color: C.muted }}>Đang tải…</p>

  if (data.trangThaiRong === 'chua_co_buoi_truoc') return (
    <div className="rounded-2xl border border-dashed py-16 text-center" style={{ borderColor: C.line, background: C.paper }}>
      <div className="text-[17px] font-bold" style={{ ...SERIF, color: C.navy }}>Chưa có buổi trước</div>
      <div className="mx-auto mt-1.5 max-w-sm text-[13px]" style={{ color: C.muted }}>Lớp mới khai giảng — chưa có buổi học nào trước buổi này để tổng hợp.</div>
    </div>
  )
  if (!data.hang.length) return <p className="text-sm" style={{ color: C.muted }}>Lớp chưa có học sinh đang học.</p>

  const canDe = data.hang.filter((h) => h.batThuong.length > 0)
  const capped = canDe.length > CFG.CARD_CAP

  return (
    <div className="space-y-7 rounded-2xl p-5" style={{ background: C.bg }}>
      {data.chuaChamBTVN.daCham < data.chuaChamBTVN.tong && (
        <div className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] leading-relaxed" style={{ background: C.amberSoft, borderColor: C.amberBorder, color: C.amberText }}>
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold" style={{ background: C.amberIconBg, color: C.amberIconText }}>!</span>
          <span>BTVN buổi {data.buoiTruoc && ddmm(data.buoiTruoc.ngay)} mới chấm <b>{data.chuaChamBTVN.daCham}/{data.chuaChamBTVN.tong}</b> em.
            Các ô còn lại ghi “chưa chấm” — không phải là không có vấn đề.</span>
        </div>
      )}

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-2 rounded-full" style={{ background: C.red }} />
            <h2 className="text-[19px] font-bold" style={{ ...SERIF, color: C.navy }}>Cần để mắt</h2>
          </div>
          <span className="rounded-full border px-2.5 py-1 text-[12px] font-semibold" style={{ borderColor: C.line, color: C.navy2, background: C.paper }}>{canDe.length} / {data.hang.length} học sinh</span>
        </div>
        {canDe.length === 0 ? (
          <div className="rounded-xl border border-dashed py-8 text-center text-[13px]" style={{ borderColor: C.line, background: C.paper, color: C.muted }}>Không có em nào bất thường trước buổi này.</div>
        ) : capped ? (
          <div className="space-y-2">
            <div className="rounded-xl border px-4 py-2.5 text-[13px] font-semibold" style={{ background: C.amberSoft, borderColor: C.amberBorder, color: C.amberText }}>Lớp có {canDe.length}/{data.hang.length} em cần để mắt — thu gọn thẻ, xem chi tiết ở bảng “Cả lớp” bên dưới.</div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">{canDe.map((h) => <CardRong key={h.hocSinhId} h={h} />)}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{canDe.map((h) => <Card key={h.hocSinhId} h={h} />)}</div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-2 rounded-full" style={{ background: '#8ea0aa' }} />
            <h2 className="text-[19px] font-bold" style={{ ...SERIF, color: C.navy }}>Cả lớp</h2>
          </div>
          <span className="rounded-full border px-2.5 py-1 text-[12px] font-semibold" style={{ borderColor: C.line, color: C.navy2, background: C.paper }}>{data.hang.length} học sinh</span>
        </div>
        {data.trangThaiRong === 'chua_co_du_lieu_thang' && (
          <div className="mb-2 text-[12px]" style={{ color: C.muted }}>Tháng {data.thang} chưa có buổi nào đóng — cột “tháng” chưa có dữ liệu.</div>
        )}
        <ClassTable hang={data.hang} />
      </section>
    </div>
  )
}

// ── Lớp 1: Cần để mắt ──────────────────────────────────────────────────────────
function severityOf(h: HangHS): 'severe' | 'mild' {
  if (h.batThuong.includes('et') || h.batThuong.includes('dang')) return 'severe'
  if (h.btvnTruoc.trangThai === 'khong_lam' || h.btvnTruoc.thaiDo === 'chong_doi') return 'severe'
  return 'mild'
}

function signalsOf(h: HangHS): { dot: string; node: React.ReactNode }[] {
  const out: { dot: string; node: React.ReactNode }[] = []
  if (h.batThuong.includes('btvn')) {
    const soKhongLam = h.btvnThang.oPerBuoi.filter((o) => o.trangThai === 'khong_lam').length
    const truocTxt = h.btvnTruoc.chuaCham ? 'Chưa chấm' : h.btvnTruoc.trangThai ? TT_LABEL[h.btvnTruoc.trangThai] : '—'
    const thaiDoTxt = h.btvnTruoc.thaiDo && h.btvnTruoc.thaiDo !== 'nghiem_tuc' ? ` (${TD_LABEL[h.btvnTruoc.thaiDo]})` : ''
    out.push({ dot: C.red, node: <><b style={{ color: C.navy }}>BTVN:</b> {truocTxt}{thaiDoTxt} buổi trước{soKhongLam > 0 ? ` · tháng này ${soKhongLam}/${h.btvnThang.tongBuoi} buổi không làm` : ''}.</> })
  }
  if (h.batThuong.includes('et')) {
    const truocTxt = h.etTruoc.vang ? 'Vắng' : h.etTruoc.pct != null ? `${h.etTruoc.pct}%` : '—'
    const d = h.etThang.deltaThangTruoc
    const xu = d != null && d < 0 ? `, giảm ${Math.abs(d)}đ so tháng trước` : ''
    out.push({ dot: C.purple, node: <><b style={{ color: C.navy }}>ET:</b> {truocTxt} buổi trước · TB tháng {h.etThang.pct != null ? `${h.etThang.pct}%` : '—'}{xu}.</> })
  }
  if (h.batThuong.includes('dang') && h.dangYeuThang.length) {
    const d = h.dangYeuThang[0]
    out.push({ dot: C.orange, node: <><b style={{ color: C.navy }}>Dạng yếu:</b> {d.maDang} · {d.tenDang}{d.n != null && <span style={{ color: C.muted }}> ({d.n} lần đo)</span>}.</> })
  }
  return out.slice(0, 2)
}

function Card({ h }: { h: HangHS }) {
  const sev = severityOf(h)
  const sig = signalsOf(h)
  return (
    <div className="rounded-[17px] border p-4" style={{ background: '#fff', borderColor: C.line, boxShadow: '0 4px 16px rgba(35,54,67,.06)', borderLeft: `4px solid ${sev === 'severe' ? C.red : C.amber}` }}>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-bold" style={{ background: C.avatarBg, color: C.navy }}>{initials(h.tenNgan)}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-bold" style={{ color: C.navy }}>{h.tenNgan}</div>
          {h.level != null && <div className="text-[11px]" style={{ color: C.muted }}>Level {h.level}</div>}
        </div>
        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={sev === 'severe' ? { background: C.redSoft, color: C.red } : { background: C.amberSoft, color: C.amber }}>{sev === 'severe' ? 'Cần chú ý' : 'Theo dõi'}</span>
      </div>
      <div className="space-y-1.5">
        {sig.map((s, i) => (
          <div key={i} className="flex gap-2 text-[12.5px] leading-relaxed" style={{ color: C.navy2 }}>
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.dot }} />
            <span>{s.node}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardRong({ h }: { h: HangHS }) {
  const sev = severityOf(h)
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ background: '#fff', borderColor: C.line, borderLeft: `4px solid ${sev === 'severe' ? C.red : C.amber}` }}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10.5px] font-bold" style={{ background: C.avatarBg, color: C.navy }}>{initials(h.tenNgan)}</span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold" style={{ color: C.navy }}>{h.tenNgan}</span>
      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" style={sev === 'severe' ? { background: C.redSoft, color: C.red } : { background: C.amberSoft, color: C.amber }}>{sev === 'severe' ? 'Cần chú ý' : 'Theo dõi'}</span>
    </div>
  )
}

// ── Lớp 2: Cả lớp ──────────────────────────────────────────────────────────────
function ClassTable({ hang }: { hang: HangHS[] }) {
  const th = (recent?: boolean): React.CSSProperties => ({ background: recent ? C.recentHeadBg : C.headBg, color: recent ? C.recentHeadText : C.headText, borderColor: C.line })
  return (
    <div className="overflow-auto rounded-[17px] border" style={{ background: '#fff', borderColor: C.line, boxShadow: '0 8px 28px rgba(36,55,70,.07)' }}>
      <table className="w-full min-w-[900px] border-separate border-spacing-0 text-[12.5px]">
        <thead>
          <tr className="text-left text-[10.5px] font-bold uppercase tracking-wide">
            <th className="sticky top-0 z-10 border-b px-4 py-2.5" style={th()}>Học sinh</th>
            <th className="sticky top-0 z-10 border-b px-3 py-2.5 text-center" style={th(true)}>BTVN buổi trước</th>
            <th className="sticky top-0 z-10 border-b px-3 py-2.5 text-center" style={th()}>BTVN tháng</th>
            <th className="sticky top-0 z-10 border-b px-3 py-2.5 text-center" style={th(true)}>ET buổi trước</th>
            <th className="sticky top-0 z-10 border-b px-3 py-2.5 text-center" style={th()}>ET TB tháng</th>
            <th className="sticky top-0 z-10 border-b px-3 py-2.5 text-left" style={th()}>Dạng còn yếu</th>
          </tr>
        </thead>
        <tbody>{hang.map((h) => <Row key={h.hocSinhId} h={h} />)}</tbody>
      </table>
    </div>
  )
}

function Row({ h }: { h: HangHS }) {
  const flag = h.batThuong.length > 0
  const rowBg = flag ? '#fffafa' : undefined
  const cellB = { borderColor: C.line2 }
  return (
    <tr style={{ background: rowBg }}>
      <td className="relative border-b px-4 py-2.5 font-semibold" style={{ ...cellB, color: C.navy }}>
        {flag && <span className="absolute left-1.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded" style={{ background: C.red }} />}
        {h.tenNgan}
      </td>
      <td className="border-b px-3 py-2.5 text-center" style={{ ...cellB, background: C.recentCellBg }}><BtvnPill h={h} /></td>
      <td className="border-b px-3 py-2.5 text-center" style={cellB}><BtvnStrip h={h} /></td>
      <td className="border-b px-3 py-2.5 text-center" style={{ ...cellB, background: C.recentCellBg }}><EtTruocCell h={h} /></td>
      <td className="border-b px-3 py-2.5 text-center" style={cellB}><EtThangCell h={h} /></td>
      <td className="border-b px-3 py-2.5" style={cellB}><DangCell dang={h.dangYeuThang} /></td>
    </tr>
  )
}

function BtvnPill({ h }: { h: HangHS }) {
  if (h.btvnTruoc.chuaCham) return <span className="inline-block rounded-full border border-dashed px-2.5 py-1 text-[10.5px] font-bold" style={{ ...waitStripe, borderColor: C.waitBorder, color: C.wait }}>Chưa chấm</span>
  const tt = h.btvnTruoc.trangThai
  if (!tt) return <span style={{ color: '#a8b1b5' }}>—</span>
  return <span className="inline-block min-w-[74px] rounded-full border px-2.5 py-1 text-[10.5px] font-bold" style={TT_PILL_STYLE[tt]}>{TT_LABEL[tt]}</span>
}

function BtvnStrip({ h }: { h: HangHS }) {
  if (!h.btvnThang.tongBuoi) return <span style={{ color: '#a8b1b5' }}>—</span>
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="inline-flex gap-[3px]">
        {h.btvnThang.oPerBuoi.map((o) => (
          <span key={o.buoiId} title={o.chuaCham ? 'Chưa chấm' : o.trangThai ? TT_LABEL[o.trangThai] : ''}
            className="h-3.5 w-3 rounded-[3px] border" style={o.chuaCham || !o.trangThai ? { ...C.sqE, borderStyle: 'dashed' } : OB_SQ[o.trangThai]} />
        ))}
      </span>
      <span className="text-[11px] font-semibold" style={{ color: C.navy2 }}>{h.btvnThang.soDatHan}/{h.btvnThang.tongBuoi}</span>
    </div>
  )
}

const etTone = (pct: number) => pct < 50 ? C.red : pct < 75 ? C.navy : C.green

function EtTruocCell({ h }: { h: HangHS }) {
  if (h.etTruoc.vang) return <span className="inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ background: '#f3f0fb', color: C.purple }}>Vắng</span>
  if (h.etTruoc.pct == null) return <span style={{ color: '#a8b1b5' }}>—</span>
  return <span className="text-[15px] font-bold" style={{ ...SERIF, color: etTone(h.etTruoc.pct) }}>{h.etTruoc.pct}%</span>
}

function EtThangCell({ h }: { h: HangHS }) {
  if (h.etThang.pct == null) return <span style={{ color: '#a8b1b5' }}>—</span>
  const d = h.etThang.deltaThangTruoc
  return (
    <span className="text-[15px] font-bold" style={{ ...SERIF, color: etTone(h.etThang.pct) }}>
      {h.etThang.pct}%
      {d != null && d !== 0 && <span className="ml-1 text-[10px] font-bold" style={{ color: d < 0 ? C.red : C.green }}>{d < 0 ? '↓' : '↑'}{Math.abs(d) >= 3 ? ` ${Math.abs(d)}đ` : ''}</span>}
    </span>
  )
}

function DangCell({ dang }: { dang: DangNgan[] }) {
  if (!dang.length) return <span style={{ color: '#a8b1b5' }}>—</span>
  const shown = dang.slice(0, 2)
  const extra = dang.length - shown.length
  return (
    <div className="flex flex-col items-start gap-1">
      {shown.map((d) => (
        <span key={d.maDang} className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: C.redSoft, borderColor: C.redBorder, color: C.red }}>
          <span className="font-mono font-extrabold" style={{ color: C.weakBadCode }}>{d.maDang}</span>{d.tenDang}
        </span>
      ))}
      {extra > 0 && <span className="text-[10.5px]" style={{ color: C.muted }}>+{extra} dạng nữa</span>}
    </div>
  )
}
