// ============================================================================
// MucTieuTuanHS — "Mục tiêu tuần" của em (spec-muc-tieu-tuan.md §9.1–9.2, Thùy chốt 12–13/11).
//   · Đầu màn: Tiến độ mục tiêu tuần (vạch đầu tuần + cờ đích) · Việc của con x/y · Xếp hạng tiến độ (bấm ⇒ top 20 toàn trung tâm).
//   · Cột trái: Phần 1 Kiến thức mới + Phần 2 Ôn tập — mỗi dòng nhóm GỌN (tên · ▲/▼ · % · cờ ở mục tiêu tuần); bấm mới mở
//     Xem lại lý thuyết · Xem lại bài trên lớp · Luyện tập.
//   · Cột phải: Việc của con tuần này (Đã làm / Sắp tới / Tự luyện không bắt buộc), nhãn Tốt · Tạm ổn · Chưa tốt.
//   · Lớp chưa chốt ⇒ "đang chốt mục tiêu tuần" (spec §12.4). "Các tuần trước" = sổ chốt (trend).
// Mọi con số từ DB (fn_mtt_cua_toi · fn_mtt_top · fn_mtt_cac_tuan — mig 202611131000). Khung/màu theo style (design/STYLE-HS.md).
// ============================================================================
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ManHS, DauTrangHS, TheHS, NutHS, NhanHS, NhomHS, TrongHS, MAU, THE, HEAD } from './skin/KhungHS'
import {
  mttCuaToi, mttTop, mttCacTuan, laChuaChot, tenTuan, thuNgay, ngayNgan, gioPhut, moTaViec, nhanChenh,
  NHAN_MUC, NHAN_TT, TEN_VIEC,
  type MttKetQua, type MttTo, type MttNhom, type MttViec, type MttTop, type MttTuanCu, type MucDanhGia,
} from '../../lib/mucTieuTuan'

// nền nhạt NGỮ NGHĨA, trong suốt ⇒ đọc được trên skin sáng lẫn tối (y khuôn ThongTinHocTap)
const NEN = { dung: 'rgba(34,160,107,0.16)', sai: 'rgba(229,72,77,0.16)', canhBao: 'rgba(224,144,30,0.16)' }
const mauPct = (p: number | null) => (p == null ? MAU.muted : p >= 80 ? MAU.dung : p >= 50 ? MAU.canhBao : MAU.sai)
const mauMuc = (m: MucDanhGia | null) => (m === 'tot' ? MAU.dung : m === 'tam_on' ? MAU.canhBao : m === 'chua_tot' ? MAU.sai : MAU.muted)
const nenMuc = (m: MucDanhGia | null) => (m === 'tot' ? NEN.dung : m === 'tam_on' ? NEN.canhBao : m === 'chua_tot' ? NEN.sai : MAU.surface2)
const mauChenh = (h?: string) => (h === 'len' ? MAU.dung : h === 'xuong' ? MAU.sai : MAU.muted)

export type DichMoMTT = 'ly_thuyet' | 'bai_tren_lop' | 'luyen_tap'

export default function MucTieuTuanHS({ mon, onBack, onMo }: { mon: string; onBack: () => void; onMo?: (dich: DichMoMTT) => void }) {
  const [man, setMan] = useState<'tuan' | 'cac_tuan'>('tuan')
  const [kq, setKq] = useState<MttKetQua | undefined>(undefined)
  const [loi, setLoi] = useState<string | null>(null)
  const [moTop, setMoTop] = useState(false)
  useEffect(() => {
    let alive = true
    setKq(undefined); setLoi(null)
    mttCuaToi(mon).then((r) => alive && setKq(r)).catch((e) => alive && setLoi(String(e?.message ?? e)))
    return () => { alive = false }
  }, [mon])

  if (man === 'cac_tuan') return <CacTuanHS mon={mon} onBack={() => setMan('tuan')} />
  const to = kq && !laChuaChot(kq) ? kq : null
  return (
    <ManHS>
      <DauTrangHS tieuDe="Mục tiêu tuần này" onBack={onBack} theoMon
        phu={to ? `Tuần ${tenTuan(to.tuan, to.den_ngay)}${to.hs.lop ? ` · Lớp ${to.hs.lop}` : ''}` : undefined}
        phai={<NutHS phu onClick={() => setMan('cac_tuan')} className="!h-10 !px-3 !text-[14px]">Các tuần trước</NutHS>} />
      {loi && <TrongHS>Không tải được mục tiêu tuần. {loi}</TrongHS>}
      {kq === undefined && !loi && <TrongHS>Đang tải…</TrongHS>}
      {kq === null && <TrongHS>Em chưa có lớp môn {mon} trong tuần này.</TrongHS>}
      {kq && laChuaChot(kq) && (
        <TheHS className="px-5 py-6 text-center">
          <p className="text-[18px] font-bold" style={{ ...HEAD, color: MAU.ink }}>Thầy cô đang chốt mục tiêu tuần</p>
          <p className="mt-1 text-[14.5px]" style={{ color: MAU.muted }}>Sau buổi họp chiều thứ Hai, mục tiêu tuần {ngayNgan(kq.tuan)} của em sẽ hiện ở đây. Em xem kết quả tuần trước ở “Các tuần trước”.</p>
        </TheHS>
      )}
      {to && <ToTuan to={to} onTop={() => setMoTop(true)} onMo={onMo} />}
      {moTop && <BangTop mon={mon} toi={to} onDong={() => setMoTop(false)} />}
    </ManHS>
  )
}

// ── tờ tuần ─────────────────────────────────────────────────────────────────
function ToTuan({ to, onTop, onMo }: { to: MttTo; onTop: () => void; onMo?: (d: DichMoMTT) => void }) {
  const [mo, setMo] = useState<string | null>(null)
  const p1 = to.nhom.filter((n) => n.phan === 1)
  const p2 = to.nhom.filter((n) => n.phan === 2)
  const daLam = to.viec.filter((v) => v.tt !== 'sap_toi')
  const sapToi = to.viec.filter((v) => v.tt === 'sap_toi')
  return (
    <>
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
        <TheHS className="p-4">
          <div className="flex items-baseline gap-2">
            <span className="flex-1 text-[13px] font-bold uppercase tracking-wide" style={{ color: MAU.muted }}>Tiến độ mục tiêu tuần</span>
            {to.tien_do_d != null && <span className="text-[13px] font-bold" style={{ color: to.tien_do_d > 0 ? MAU.dung : to.tien_do_d < 0 ? MAU.sai : MAU.muted }}>
              {to.tien_do_d > 0 ? '▲' : to.tien_do_d < 0 ? '▼' : '='} {Math.abs(to.tien_do_d)} so với đầu tuần</span>}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="w-[84px] text-[32px] font-extrabold leading-none" style={{ ...HEAD, color: MAU.ink }}>{to.tien_do == null ? '—' : `${Math.round(to.tien_do)}%`}</span>
            <ThanhTong p={to.tien_do} dau={to.tien_do_dau} />
          </div>
          {to.tien_do == null && <p className="mt-1 text-[12.5px]" style={{ color: MAU.muted }}>Có số sau lần đo đầu tiên của tuần.</p>}
        </TheHS>
        <TheHS className="p-4">
          <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: MAU.muted }}>Việc của con</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[32px] font-extrabold leading-none" style={{ ...HEAD, color: MAU.ink }}>{to.viec_xong}</span>
            <span className="text-[16px]" style={{ color: MAU.muted }}>/ {to.viec_tong} việc đã làm</span>
          </div>
          <p className="mt-1 text-[12.5px]" style={{ color: MAU.muted }}>Còn {sapToi.length} việc sắp tới · tự luyện không tính vào đây</p>
        </TheHS>
        <TheHS className="p-4" onClick={onTop}>
          <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: MAU.muted }}>Xếp hạng tiến độ</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[32px] font-extrabold leading-none" style={{ ...HEAD, color: MAU.acc }}>{to.hang ? `#${to.hang}` : '—'}</span>
            {to.hang_doi != null && to.hang_doi !== 0 && <span className="text-[13px] font-bold" style={{ color: to.hang_doi > 0 ? MAU.dung : MAU.sai }}>{to.hang_doi > 0 ? `lên ${to.hang_doi} bậc` : `xuống ${-to.hang_doi} bậc`}</span>}
            <span className="ml-auto text-[18px]" style={{ color: MAU.muted }}>›</span>
          </div>
          <p className="mt-1 text-[12.5px]" style={{ color: MAU.muted }}>{to.so_hs ? `Trên ${to.so_hs} bạn · ` : ''}toàn trung tâm, mọi khối · bấm xem top 20</p>
        </TheHS>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="flex flex-col gap-3">
          <Phan ten="Phần 1 · Kiến thức mới" phu={`${p1.length} nhóm bài`} rong="Tuần này chưa có nhóm bài mới.">
            {p1.map((n) => <DongNhom key={n.ma} n={n} mo={mo === n.ma} onBam={() => setMo(mo === n.ma ? null : n.ma)} onMo={onMo} />)}
          </Phan>
          <Phan ten="Phần 2 · Ôn tập kiến thức" phu={`${p2.length} nhóm bài`} rong="Tuần này em không có nhóm ôn tập.">
            {p2.map((n) => <DongNhom key={n.ma} n={n} mo={mo === n.ma} onBam={() => setMo(mo === n.ma ? null : n.ma)} onMo={onMo}
              kiemTra={to.viec.filter((v) => v.loai === 'sau_gio' || v.loai === 'bo_tro')} />)}
          </Phan>
          {to.xep_hang_cho.length > 0 && (
            <TheHS className="px-4 py-3">
              <p className="text-[14px] font-bold" style={{ color: MAU.ink }}>Đang xếp hàng: {to.xep_hang_cho.length} nhóm</p>
              <p className="mt-0.5 text-[13px]" style={{ color: MAU.muted }}>{to.xep_hang_cho.map((x) => x.ten).join(' · ')} — vào kế hoạch các tuần sau.</p>
            </TheHS>
          )}
          {to.sap_hoc && (
            <TheHS className="px-4 py-3" style={{ borderStyle: 'dashed' }}>
              <p className="text-[14px] font-bold" style={{ color: MAU.ink }}>{thuNgay(to.sap_hoc.ngay)} con sẽ học thêm</p>
              <p className="mt-0.5 text-[13px]" style={{ color: MAU.muted }}>{to.sap_hoc.nhom.join(' · ') || 'Bài mới'} · tính vào mục tiêu tuần sau.</p>
            </TheHS>
          )}
        </div>

        <TheHS className="p-4">
          <div className="flex items-baseline gap-2">
            <span className="flex-1 text-[17px] font-bold" style={{ ...HEAD, color: MAU.ink }}>Việc của con tuần này</span>
            <span className="text-[13px]" style={{ color: MAU.muted }}>{to.viec_xong}/{to.viec_tong} đã làm</span>
          </div>
          {to.viec.length === 0 && <p className="mt-2 text-[14px]" style={{ color: MAU.muted }}>Tuần này chưa có việc nào.</p>}
          {daLam.length > 0 && <><NhomHS>Đã làm</NhomHS><div className="mt-1 flex flex-col gap-1.5">{daLam.map((v) => <DongViec key={v.loai + v.buoi_id} v={v} />)}</div></>}
          {sapToi.length > 0 && <><NhomHS>Sắp tới</NhomHS><div className="mt-1 flex flex-col gap-1.5">{sapToi.map((v) => <DongViec key={v.loai + v.buoi_id} v={v} />)}</div></>}
          <NhomHS>Tự luyện trên app · không bắt buộc</NhomHS>
          <div className="mt-1 flex items-center gap-3 px-3 py-2" style={{ background: MAU.surface2, borderRadius: 'var(--sk-radius)' }}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[14px] font-bold" style={{ borderRadius: 'var(--sk-radius-pill)', background: MAU.surface, color: MAU.muted }}>•</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-bold" style={{ color: MAU.ink }}>{to.tu_luyen.so_cau > 0 ? `${to.tu_luyen.so_cau} câu · ${to.tu_luyen.so_luot} lượt` : 'Chưa luyện câu nào'}</span>
              {to.tu_luyen.nhom.length > 0 && <span className="block text-[12.5px]" style={{ color: MAU.muted }}>{to.tu_luyen.nhom.join(' · ')}</span>}
            </span>
            {to.tu_luyen.pct != null && <span className="text-[14px] font-bold" style={{ color: MAU.ink }}>đúng {to.tu_luyen.pct}%</span>}
          </div>
          {to.so_tinh_at && <p className="mt-3 text-[11.5px]" style={{ color: MAU.muted }}>Số cập nhật lúc {gioPhut(to.so_tinh_at)}</p>}
        </TheHS>
      </div>
    </>
  )
}

function Phan({ ten, phu, rong, children }: { ten: string; phu: string; rong: string; children: ReactNode[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-[17px] font-bold" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{ten}</span>
        <span className="text-[13px]" style={{ color: MAU.muted }}>{phu}</span>
      </div>
      {children.length === 0 ? <TheHS className="px-4 py-3"><span className="text-[14px]" style={{ color: MAU.muted }}>{rong}</span></TheHS> : children}
    </div>
  )
}

// thanh tiến độ tổng: vạch đứt = đầu tuần · cờ ở cuối (đầy thanh = đạt hết mục tiêu tuần)
function ThanhTong({ p, dau }: { p: number | null; dau: number | null }) {
  return (
    <div className="relative h-[30px] flex-1" aria-label={p == null ? 'Chưa có số' : `Tiến độ ${Math.round(p)}%`} role="img">
      <div className="absolute left-0 right-[14px] top-[10px] h-[16px] overflow-hidden" style={{ background: MAU.surface2, borderRadius: 'var(--sk-radius-pill)' }}>
        <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, p ?? 0))}%`, background: MAU.acc, borderRadius: 'var(--sk-radius-pill)' }} />
      </div>
      {dau != null && p != null && <div className="absolute top-[6px] h-[24px]" style={{ left: `calc(${Math.min(100, dau)}% * 0.97)`, borderLeft: `2px dashed ${MAU.muted}` }} title={`Đầu tuần ${Math.round(dau)}%`} />}
      <div className="absolute right-[12px] top-0 h-[30px]" style={{ borderLeft: `2px solid ${MAU.ink}` }} />
      <Co className="absolute right-0 top-0" />
    </div>
  )
}

function Co({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <svg aria-hidden width="12" height="9" viewBox="0 0 12 9" className={className} style={style}><path d="M0 0h12l-3 4.5 3 4.5H0z" fill={MAU.acc} /></svg>
}

// dòng nhóm GỌN — cờ ở mục tiêu TUẦN (số dưới cờ) + vạch mờ "đích 80%" khi mục tiêu tuần còn thấp hơn
function DongNhom({ n, mo, onBam, onMo, kiemTra }: { n: MttNhom; mo: boolean; onBam: () => void; onMo?: (d: DichMoMTT) => void; kiemTra?: MttViec[] }) {
  const c = nhanChenh(n.p, n.d)
  const mt = n.mt
  return (
    <div style={THE} className="overflow-hidden">
      <button onClick={onBam} className="w-full px-4 pb-1.5 pt-3 text-left" aria-expanded={mo} aria-label={`Mở chi tiết nhóm ${n.ten}`}>
        <div className="flex items-center gap-2.5">
          <span className="min-w-0 flex-1 text-[15.5px] font-bold" style={{ color: MAU.ink }}>{n.ten}</span>
          {c && <span className="text-[12.5px] font-bold" style={{ color: mauChenh(c.huong) }}>{c.chu}</span>}
          <span className="text-[18px] font-extrabold" style={{ color: mauPct(n.p) }}>{n.p == null ? 'Chưa đo' : `${n.p}%`}</span>
          <span className="text-[14px]" style={{ color: MAU.muted, transform: mo ? 'rotate(180deg)' : 'none' }}>⌄</span>
        </div>
        <div className="relative mt-1 h-[38px]">
          <div className="absolute left-0 right-0 top-[14px] h-[8px] overflow-hidden" style={{ background: MAU.surface2, borderRadius: 'var(--sk-radius-pill)' }}>
            <div className="h-full" style={{ width: `${n.p ?? 0}%`, background: mauPct(n.p), borderRadius: 'var(--sk-radius-pill)' }} />
          </div>
          {n.p != null && n.p_dau != null && <div className="absolute top-[10px] h-[16px]" style={{ left: `${n.p_dau}%`, borderLeft: `2px dashed ${MAU.muted}` }} title={`Đầu tuần ${n.p_dau}%`} />}
          {mt != null && mt < n.dich && <>
            <div className="absolute top-[8px] h-[20px]" style={{ left: `${n.dich}%`, borderLeft: `2px solid ${MAU.line}` }} />
            <span className="absolute top-0 text-[10px] font-semibold" style={{ left: `calc(${n.dich}% + 5px)`, color: MAU.muted }}>đích {n.dich}%</span>
          </>}
          {mt != null && <>
            <div className="absolute top-0 h-[24px]" style={{ left: `${mt}%`, borderLeft: `2px solid ${MAU.ink}` }} />
            <Co className="absolute top-0" style={{ left: `calc(${mt}% + 2px)` }} />
            <span className="absolute top-[25px] -translate-x-1/2 text-[11px] font-bold" style={{ left: `${mt}%`, color: MAU.ink }}>{mt}%</span>
          </>}
        </div>
      </button>
      {mo && (
        <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2.5" style={{ borderTop: `1px solid ${MAU.line}`, background: MAU.surface2 }}>
          <p className="text-[13.5px]" style={{ color: MAU.ink }}>
            {mt != null ? `Tuần này có ${n.k} lần đo. Làm Tốt cả ${n.k} lần thì nhóm lên ${mt}%.` : 'Tuần này nhóm này không có lần đo.'}
            {n.n != null ? ` Số hiện tại tính trên ${Math.min(n.n, 5)} lần gần nhất.` : ' Nhóm này chưa có lần đo nào.'}
            {n.mt != null && n.mt < n.dich ? ` Đích của cả đợt là ${n.dich}%.` : ''}
          </p>
          {kiemTra && kiemTra.length > 0 && kiemTra.map((v) => (
            <div key={v.buoi_id} className="px-3 py-2 text-[13.5px] font-bold" style={{ background: NEN.canhBao, borderRadius: 'var(--sk-radius)', color: MAU.ink }}>
              {TEN_VIEC[v.loai]}: {thuNgay(v.ngay)}{v.gio ? `, ${v.gio}` : ''}{v.phong ? ` · phòng ${v.phong}` : ''}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <NutHS phu onClick={() => onMo?.('ly_thuyet')} className="!text-[14px]">Xem lại lý thuyết</NutHS>
            <NutHS phu onClick={() => onMo?.('bai_tren_lop')} className="!text-[14px]">Xem lại bài trên lớp</NutHS>
            <NutHS onClick={() => onMo?.('luyen_tap')} className="!text-[14px]">Luyện tập</NutHS>
          </div>
        </div>
      )}
    </div>
  )
}

function DongViec({ v }: { v: MttViec }) {
  const xong = v.tt === 'xong' || v.tt === 'cho_cham'
  const phu = [moTaViec(v)].filter(Boolean).join(' · ')
  return (
    <div className="flex items-center gap-3 px-3 py-2" style={{ background: MAU.surface2, borderRadius: 'var(--sk-radius)' }}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[14px] font-bold"
        style={{ borderRadius: 'var(--sk-radius-pill)', background: xong ? NEN.dung : v.tt === 'sap_toi' ? MAU.surface : NEN.sai, color: xong ? MAU.dung : v.tt === 'sap_toi' ? MAU.muted : MAU.sai }} aria-hidden>
        {xong ? '✓' : v.tt === 'sap_toi' ? '○' : '!'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold" style={{ color: MAU.ink }}>{TEN_VIEC[v.loai]} · {thuNgay(v.ngay)}</span>
        {phu && <span className="block text-[12.5px]" style={{ color: MAU.muted }}>{phu}</span>}
        {v.ghi_chu && <span className="block text-[12.5px] font-semibold" style={{ color: v.tt === 'vang' ? MAU.sai : MAU.canhBao }}>{v.ghi_chu}</span>}
      </span>
      {v.pct != null && <span className="text-[15px] font-extrabold" style={{ color: MAU.ink }}>{v.pct}%</span>}
      {v.muc ? <span className="whitespace-nowrap px-2 py-0.5 text-[12px] font-bold" style={{ background: nenMuc(v.muc), color: mauMuc(v.muc), borderRadius: 'var(--sk-radius-pill)' }}>{NHAN_MUC[v.muc]}</span>
        : v.tt !== 'sap_toi' && v.tt !== 'xong' ? <NhanHS mau={v.tt === 'cho_cham' ? MAU.muted : MAU.sai}>{NHAN_TT[v.tt]}</NhanHS> : null}
    </div>
  )
}

// ── top 20 toàn trung tâm ───────────────────────────────────────────────────
function BangTop({ mon, toi, onDong }: { mon: string; toi: MttTo | null; onDong: () => void }) {
  const [top, setTop] = useState<MttTop | null | undefined>(undefined)
  useEffect(() => { let a = true; mttTop(mon).then((t) => a && setTop(t)).catch(() => a && setTop(null)); return () => { a = false } }, [mon])
  const ds = top?.ds ?? []
  const trongTop = !!toi?.hang && toi.hang <= 20
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,11,22,0.65)' }} onClick={onDong}>
      <div className="max-h-[90dvh] w-full max-w-[680px] overflow-y-auto p-5" style={THE} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-[19px] font-bold" style={{ ...HEAD, color: MAU.ink }}>Top 20 tiến độ tuần · toàn trung tâm</p>
            <p className="text-[12.5px]" style={{ color: MAU.muted }}>Môn {mon} · mọi khối · xếp theo tiến độ tới mục tiêu của từng bạn</p>
          </div>
          <NutHS phu onClick={onDong} className="!h-10 !px-3 !text-[14px]">Đóng</NutHS>
        </div>
        {top === undefined && <p className="mt-4 text-[14px]" style={{ color: MAU.muted }}>Đang tải…</p>}
        {top !== undefined && ds.length === 0 && <p className="mt-4 text-[14px]" style={{ color: MAU.muted }}>Bảng xếp hạng tuần này chưa có số.</p>}
        <div className="mt-3 grid gap-1.5 md:grid-flow-col md:grid-cols-2 md:grid-rows-10">
          {ds.map((r) => (
            <div key={r.hang + r.ten} className="flex items-center gap-2.5 px-3 py-2" style={{ background: MAU.surface2, borderRadius: 'var(--sk-radius)' }}>
              <span className="w-7 text-[14px] font-extrabold" style={{ color: r.hang <= 3 ? MAU.acc : MAU.muted }}>{r.hang}</span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold" style={{ color: MAU.ink }}>{r.ten}</span>
              <span className="text-[12px]" style={{ color: MAU.muted }}>{r.lop ?? ''}</span>
              <span className="w-10 text-right text-[14px] font-bold" style={{ color: MAU.ink }}>{r.tien_do}%</span>
            </div>
          ))}
        </div>
        {toi && !trongTop && (
          <div className="mt-3 flex items-center gap-2.5 px-3 py-2" style={{ border: `1.5px solid ${MAU.acc}`, borderRadius: 'var(--sk-radius)' }}>
            <span className="w-10 text-[14px] font-extrabold" style={{ color: MAU.acc }}>{toi.hang ? `#${toi.hang}` : '—'}</span>
            <span className="flex-1 text-[14px] font-bold" style={{ color: MAU.ink }}>Em · {toi.hs.ten}</span>
            <span className="text-[14px] font-bold" style={{ color: MAU.ink }}>{toi.tien_do == null ? '—' : `${Math.round(toi.tien_do)}%`}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── các tuần đã chốt (trend) ────────────────────────────────────────────────
function CacTuanHS({ mon, onBack }: { mon: string; onBack: () => void }) {
  const [ds, setDs] = useState<MttTuanCu[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { let a = true; mttCacTuan(mon).then((d) => a && setDs(d)).catch((e) => a && setLoi(String(e?.message ?? e))); return () => { a = false } }, [mon])
  const cuoi = ds && ds.length ? ds[ds.length - 1] : null
  const nhoms = ds ? [...new Map(ds.flatMap((t) => t.nhom.map((n) => [n.ma, n.ten] as const))).entries()] : []
  return (
    <ManHS>
      <DauTrangHS tieuDe="Các tuần đã chốt" phu="Mỗi tuần chốt sáng thứ Hai, không sửa sau khi chốt" onBack={onBack} theoMon />
      {loi && <TrongHS>Không tải được. {loi}</TrongHS>}
      {!ds && !loi && <TrongHS>Đang tải…</TrongHS>}
      {ds && ds.length === 0 && <TrongHS>Chưa có tuần nào được chốt.</TrongHS>}
      {ds && cuoi && (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <TheHS className="p-4"><NhoTieuDe>Tiến độ tuần {ngayNgan(cuoi.tuan)}</NhoTieuDe><So>{cuoi.tien_do == null ? '—' : `${Math.round(cuoi.tien_do)}%`}</So></TheHS>
            <TheHS className="p-4"><NhoTieuDe>Việc con đã làm</NhoTieuDe><So>{cuoi.viec_xong}/{cuoi.viec_tong}</So></TheHS>
            <TheHS className="p-4"><NhoTieuDe>Hạng tiến độ toàn trung tâm</NhoTieuDe><So mau={MAU.acc}>{cuoi.hang ? `#${cuoi.hang}` : '—'}</So></TheHS>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <BieuDoCot ten="Tiến độ mục tiêu tuần" ds={ds.map((t) => ({ tuan: t.tuan, v: t.tien_do, chu: t.tien_do == null ? '—' : `${Math.round(t.tien_do)}%` }))} max={100} />
            <BieuDoCot ten="Việc con đã làm" ds={ds.map((t) => ({ tuan: t.tuan, v: t.viec_tong ? t.viec_xong : null, chu: `${t.viec_xong}/${t.viec_tong}` }))}
              max={Math.max(1, ...ds.map((t) => t.viec_tong))} />
          </div>
          {nhoms.length > 0 && (
            <TheHS className="overflow-x-auto p-4">
              <p className="mb-2 text-[15px] font-bold" style={{ color: MAU.ink }}>Từng nhóm bài qua các tuần</p>
              <table className="min-w-full text-[12.5px]">
                <thead><tr>
                  <th className="pb-1 pr-2 text-left font-semibold" style={{ color: MAU.muted }}>Nhóm bài</th>
                  {ds.map((t) => <th key={t.tuan} className="pb-1 text-center font-semibold" style={{ color: MAU.muted }}>{ngayNgan(t.tuan)}</th>)}
                </tr></thead>
                <tbody>
                  {nhoms.map(([ma, ten]) => (
                    <tr key={ma}>
                      <td className="max-w-[220px] truncate py-0.5 pr-2 font-semibold" style={{ color: MAU.ink }} title={ten}>{ten}</td>
                      {ds.map((t) => {
                        const o = t.nhom.find((n) => n.ma === ma)
                        return <td key={t.tuan} className="p-0.5"><div className="flex h-7 items-center justify-center text-[12px] font-bold"
                          style={{ borderRadius: 'var(--sk-radius)', ...(o?.p == null ? { border: `1px dashed ${MAU.line}`, color: MAU.muted } : { background: o.p >= 80 ? NEN.dung : o.p >= 50 ? NEN.canhBao : NEN.sai, color: MAU.ink }) }}>
                          {o?.p == null ? '—' : `${o.p}%`}</div></td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TheHS>
          )}
        </>
      )}
    </ManHS>
  )
}
const NhoTieuDe = ({ children }: { children: ReactNode }) => <p className="text-[12.5px] font-bold uppercase tracking-wide" style={{ color: MAU.muted }}>{children}</p>
const So = ({ children, mau }: { children: ReactNode; mau?: string }) => <p className="mt-1 text-[28px] font-extrabold leading-none" style={{ ...HEAD, color: mau ?? MAU.ink }}>{children}</p>

// biểu đồ cột 1 chuỗi (tuần), nhãn chỉ ở cột mới nhất; rê chuột / chạm giữ xem số từng tuần (title)
function BieuDoCot({ ten, ds, max }: { ten: string; ds: { tuan: string; v: number | null; chu: string }[]; max: number }) {
  return (
    <TheHS className="p-4">
      <p className="text-[15px] font-bold" style={{ color: MAU.ink }}>{ten}</p>
      <div className="mt-2 flex h-[140px] items-end gap-1" role="img" aria-label={`${ten}: ${ds.map((d) => `${ngayNgan(d.tuan)} ${d.chu}`).join(', ')}`}>
        {ds.map((d, i) => (
          <div key={d.tuan} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`Tuần ${ngayNgan(d.tuan)}: ${d.chu}`}>
            {i === ds.length - 1 && <span className="text-[12px] font-bold" style={{ color: MAU.ink }}>{d.chu}</span>}
            <div className="w-[60%] max-w-[26px]" style={{ height: `${d.v == null ? 0 : Math.max(2, (d.v / max) * 110)}px`, background: MAU.acc, opacity: i === ds.length - 1 ? 1 : 0.55, borderRadius: '4px 4px 0 0' }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1" style={{ borderTop: `1px solid ${MAU.line}` }}>
        {ds.map((d) => <span key={d.tuan} className="flex-1 pt-1 text-center text-[11px]" style={{ color: MAU.muted }}>{ngayNgan(d.tuan)}</span>)}
      </div>
    </TheHS>
  )
}
