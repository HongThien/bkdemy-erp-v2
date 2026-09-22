// ============================================================================
// ThongTinHocTap — Màn "Thông tin học tập" cho HS (Thùy 12/09):
// = MENU 3 box clickable → mở màn con tương ứng.
// (1) Danh sách dạng yếu    → DangYeuScreen
// (2) Lịch sử làm bài trên app → LichSuScreen
// (3) Bảng xếp hạng         → XepHangScreen (3 tab: tỉ lệ đạt · MT · tự luyện)
//
// Tất cả màn CÙNG THEME HomeHS (backdrop mây bg_home_*.jpg + decor sách + quote handwritten
// Pacifico + header squircle theo giới tính). Shell chung `Kung` tránh duplicate code.
// ============================================================================
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import {
  monCuaHS, khoiCuaHS, layDangHocTap, layLichSuLamBai, xepHangTiLeDat, xepHangTuLuyen,
  SRC_LABEL, type DangHocTap, type TongQuanHocTap, type RecentEval, type LichSuLamBaiRow, type XepHangTiLeRow, type XepHangRow,
} from '../../lib/tuluyen'
import { getBXHDiemMTKhoi, type BXHDiemMTRow } from '../../lib/thanhtich'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Hiểu mình\ntiến bộ mỗi ngày!', quoteColor: '#4A5BC4', plane: true, underline: false, iconTint: '#E8ECFF' },
  nu:  { bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Học mà hiểu\nlà học giỏi ♡', quoteColor: '#E84A8F', plane: false, underline: true, iconTint: '#F3E4F6' },
}
type Theme = typeof THEME.nam
export { THEME as _THEME_TTHT }  // export chỉ để demo trong AppHS?demo=podium

// ── Shell chung — backdrop + decor + quote + header squircle. children là phần thân màn. ────
function Kung({ t, title, sub, onBack, desktop, children }: { t: Theme; title: string; sub?: string; onBack: () => void; desktop?: boolean; children: ReactNode }) {
  return (
    <div className={`font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] md:max-w-[820px] ${desktop ? 'lg:max-w-[1180px]' : ''}`} style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      <img src={t.bg} alt="" className={`pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover md:max-w-[820px] ${desktop ? 'lg:max-w-[1180px]' : ''}`} />
      <div className={`pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end md:max-w-[820px] ${desktop ? 'lg:max-w-[1180px]' : ''}`}>
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>
      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        <div className="relative flex items-start gap-3">
          <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="relative inline-block text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              {title}
              {t.underline && <span className="absolute -bottom-1 left-[35%] h-[3px] w-[55%] rounded-full" style={{ background: t.primary, opacity: .8 }} />}
            </h1>
            {!t.underline && <p className="mt-1 text-[9.5px] font-semibold tracking-[0.22em]" style={{ color: t.sec }}>— BK ACADEMY —</p>}
            {sub && <p className="mt-1.5 text-[12.5px]" style={{ color: t.sec }}>{sub}</p>}
          </div>
          <img src={`${A}/sparkle.svg`} alt="" className="pointer-events-none absolute right-2 top-0 h-4 w-4" />
          {t.plane
            ? <img src={`${A}/paper_plane.svg`} alt="" className="pointer-events-none absolute right-14 top-10 h-10 w-10" />
            : <span className="pointer-events-none absolute right-14 top-2 text-[18px]" style={{ color: t.primary }}>♡</span>}
        </div>
        {children}
      </div>
    </div>
  )
}

// ── MÀN CHÍNH: menu 3 box list-style, click mở màn con ─────────────────────────────
type SubKey = 'dang_yeu' | 'lich_su' | 'xep_hang'
type BoxDef = { key: SubKey; ten: string; mo_ta: string; icon: string; iconBg: string; iconChu: string }
const BOXES: BoxDef[] = [
  { key: 'dang_yeu', ten: 'Danh sách dạng yếu', mo_ta: 'Xem các dạng bài em còn yếu để tập trung luyện thêm.', icon: '⚠️', iconBg: '#FFF0DC', iconChu: '#E08A1E' },
  { key: 'lich_su',  ten: 'Lịch sử làm bài trên app', mo_ta: 'Mỗi ngày em làm bao nhiêu câu, đúng bao nhiêu, mất bao lâu.', icon: '📓', iconBg: '#E3EEFF', iconChu: '#1673D8' },
  { key: 'xep_hang', ten: 'Bảng xếp hạng', mo_ta: 'So thứ hạng với bạn cùng khối: tỉ lệ đạt, điểm MT, số câu tự luyện.', icon: '🏅', iconBg: '#FFF6D6', iconChu: '#C08800' },
]

export default function ThongTinHocTap({ hocSinhId, gioiTinh, onXong, desktop }: { hocSinhId: string; gioiTinh: 'nam' | 'nu' | null; onXong: () => void; desktop?: boolean }) {
  const [sub, setSub] = useState<SubKey | null>(null)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  if (sub === 'dang_yeu') return <DangYeuScreen t={t} desktop={desktop} onBack={() => setSub(null)} />
  if (sub === 'lich_su')  return <LichSuScreen t={t} desktop={desktop} onBack={() => setSub(null)} />
  if (sub === 'xep_hang') return <XepHangScreen t={t} hocSinhId={hocSinhId} desktop={desktop} onBack={() => setSub(null)} />
  return (
    <Kung t={t} title="Thông tin học tập" sub="Chọn nội dung em muốn xem" onBack={onXong} desktop={desktop}>
      <div className="mt-5 flex flex-col gap-3">
        {BOXES.map((b) => (
          <button key={b.key} onClick={() => setSub(b.key)}
            className="group relative flex items-center gap-3.5 rounded-[24px] p-4 text-left transition active:scale-[0.98]"
            style={{ background: t.cardTint, boxShadow: t.shadow }}>
            <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[18px] text-[30px]" style={{ background: b.iconBg }}>
              {b.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-extrabold leading-tight" style={{ color: NAVY }}>{b.ten}</span>
              <span className="mt-1 block text-[12.5px] leading-snug" style={{ color: t.sec }}>{b.mo_ta}</span>
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${t.primary}18` }}>
              <svg viewBox="0 0 48 48" className="h-4 w-4" fill="none" aria-hidden><path d="M18 12l12 12-12 12" stroke={t.primary} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
        ))}
      </div>
    </Kung>
  )
}

// ── SUB 1 — DẠNG YẾU ──────────────────────────────────────────────────────────────
// 4 nhóm (CEO 20/09): Đạt/Cần luyện/Yếu chỉ tính dạng có lần đo trong 2 cửa sổ gần nhất — dạng
// KHÔNG có đo gần đây (dù từng đo lâu rồi) rơi vào "Chưa đánh giá được", KHÔNG hiện mức cũ.
type Nhom = 'yeu' | 'can_luyen' | 'dat' | 'chua_danh_gia'
const NHOM_DEF: { key: Nhom; ten: string; mau: string; nen: string }[] = [
  { key: 'yeu', ten: 'Yếu', mau: '#E0405A', nen: '#ffe3e6' },
  { key: 'can_luyen', ten: 'Cần luyện', mau: '#E08A1E', nen: '#fff3e0' },
  { key: 'dat', ten: 'Đạt', mau: '#20A886', nen: '#e7f9ee' },
  { key: 'chua_danh_gia', ten: 'Chưa đánh giá', mau: '#7A88B8', nen: '#eef1fa' },
]
const nhomCuaDang = (d: DangHocTap): Nhom => d.muc ?? 'chua_danh_gia'

function DangYeuScreen({ t, onBack, desktop }: { t: Theme; onBack: () => void; desktop?: boolean }) {
  const [data, setData] = useState<TongQuanHocTap | null>(null)
  const [tab, setTab] = useState<Nhom>('yeu')
  useEffect(() => {
    (async () => {
      const mon = await monCuaHS(); if (!mon) { setData({ dangs: [], dat: 0, canLuyen: 0, yeu: 0, chuaDanhGia: 0 }); return }
      setData(await layDangHocTap(mon))
    })().catch(() => setData({ dangs: [], dat: 0, canLuyen: 0, yeu: 0, chuaDanhGia: 0 }))
  }, [])
  const tongDaDo = data ? data.dat + data.canLuyen + data.yeu : 0 // "chưa đánh giá" KHÔNG vào mẫu số — đó là "chưa biết", không phải mức thấp
  const tiLe = data && tongDaDo > 0 ? Math.round(((data.dat + data.canLuyen * 0.5) / tongDaDo) * 100) : 0
  const soCua: Record<Nhom, number> = { yeu: data?.yeu ?? 0, can_luyen: data?.canLuyen ?? 0, dat: data?.dat ?? 0, chua_danh_gia: data?.chuaDanhGia ?? 0 }
  const dsTab = useMemo(() => (data ? data.dangs.filter((d) => nhomCuaDang(d) === tab) : []), [data, tab])
  const tong = tongDaDo + (data?.chuaDanhGia ?? 0)
  return (
    <Kung t={t} title="Dạng yếu" sub="Tập trung luyện các dạng này để tiến bộ nhanh" onBack={onBack} desktop={desktop}>
      {data === null && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {data && tong === 0 && (
        <EmptyBox t={t} icon="🌱" title="Chưa có dữ liệu học tập" mo_ta="Học vài buổi trên lớp hoặc làm Tự luyện rồi quay lại nhé." />
      )}
      {data && tong > 0 && (
        <>
          {/* Hero % thành thạo + 4 tab Đạt/Cần luyện/Yếu/Chưa đánh giá — bấm để lọc list bên dưới */}
          <div className="mt-4 rounded-[24px] p-4" style={{ background: t.cardTint, boxShadow: t.shadow }}>
            <p className="text-[13px] font-bold" style={{ color: NAVY }}>Tỉ lệ thành thạo kiến thức</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[42px] font-extrabold leading-none tracking-tight" style={{ color: NAVY }}>{tiLe}</span>
              <span className="text-[18px] font-bold" style={{ color: t.sec }}>%</span>
            </div>
            <p className="mt-0.5 text-[10.5px]" style={{ color: t.sec }}>Tính trên {tongDaDo} dạng có đo trong 2 kỳ gần nhất — chưa tính {soCua.chua_danh_gia} dạng chưa đánh giá được</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {NHOM_DEF.map((x) => (
                <button key={x.key} onClick={() => setTab(x.key)}
                  className="rounded-[14px] p-2 text-center transition"
                  style={{ background: x.nen, boxShadow: tab === x.key ? `0 0 0 2px ${x.mau}` : 'none' }}>
                  <b className="block text-[17px] font-extrabold" style={{ color: x.mau }}>{soCua[x.key]}</b>
                  <span className="text-[8px] font-black uppercase tracking-wide" style={{ color: t.sec }}>{x.ten}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="ml-1 mb-2 mt-5 text-[10.5px] font-extrabold uppercase tracking-[0.2em]" style={{ color: t.sec }}>
            Dạng {NHOM_DEF.find((x) => x.key === tab)?.ten.toLowerCase()}
          </p>
          {dsTab.length === 0
            ? <EmptyBox t={t} icon={tab === 'dat' ? '🎉' : tab === 'chua_danh_gia' ? '🕓' : '✨'}
                title="Không có dạng nào ở đây"
                mo_ta={tab === 'chua_danh_gia' ? 'Mọi dạng đã học đều có đo trong 2 kỳ gần nhất.' : 'Chọn tab khác để xem nhóm dạng còn lại.'} />
            : (
              <div className="flex flex-col gap-2.5">
                {dsTab.map((d) => {
                  const def = NHOM_DEF.find((x) => x.key === tab)!
                  return (
                  <div key={d.ma_dang} className="rounded-[16px] p-3" style={{ background: t.cardTint, boxShadow: t.shadow }}>
                    <div className="flex items-center gap-2.5">
                      <span className="h-[10px] w-[10px] shrink-0 rounded-full" style={{ background: def.mau }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-extrabold" style={{ color: NAVY }}>{d.ten_dang}</p>
                        {d.ten_chuyen_de && <p className="truncate text-[11px]" style={{ color: t.sec }}>{d.ten_chuyen_de}</p>}
                      </div>
                      <span className="shrink-0 rounded-full px-2 py-1 text-[10px] font-black" style={{ background: def.nen, color: def.mau }}>{def.ten}</span>
                    </div>
                    <div className="mt-2.5 flex gap-1 border-t border-black/[0.06] pt-2.5">
                      {d.recent.length === 0 && <span className="text-[10.5px]" style={{ color: t.sec }}>Chưa có lần đo nào</span>}
                      {d.recent.map((e, i) => <LanDo key={i} e={e} t={t} />)}
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
        </>
      )}
    </Kung>
  )
}

// ── SUB 2 — LỊCH SỬ LÀM BÀI TRÊN APP ─────────────────────────────────────────────
function LichSuScreen({ t, onBack, desktop }: { t: Theme; onBack: () => void; desktop?: boolean }) {
  const [rows, setRows] = useState<LichSuLamBaiRow[] | null>(null)
  useEffect(() => {
    layLichSuLamBai(30).then(setRows).catch(() => setRows([]))
  }, [])
  return (
    <Kung t={t} title="Lịch sử làm bài" sub="30 ngày gần nhất — thời gian in-app đo từ câu đầu tiên đến câu cuối trong ngày" onBack={onBack} desktop={desktop}>
      {rows === null && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {rows && rows.length === 0 && (
        <EmptyBox t={t} icon="📓" title="Chưa có lịch sử làm bài" mo_ta="Vào Tự luyện làm 10 câu đầu tiên để thấy lịch sử ở đây." />
      )}
      {rows && rows.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-[20px]" style={{ background: t.cardTint, boxShadow: t.shadow }}>
          <div className="grid grid-cols-[minmax(80px,1.2fr)_.8fr_1fr_1.1fr] px-3 py-2 text-[10px] font-black uppercase tracking-wide" style={{ color: t.sec, borderBottom: '1px solid rgba(0,0,0,.06)' }}>
            <span>Ngày</span><span className="text-center">Câu</span><span className="text-center">Đ / S</span><span className="text-right">In-app</span>
          </div>
          {rows.map((r, i) => (
            <div key={r.ngay} className="grid grid-cols-[minmax(80px,1.2fr)_.8fr_1fr_1.1fr] items-center px-3 py-2 text-[13px]" style={{ color: NAVY, borderTop: i > 0 ? '1px solid rgba(0,0,0,.04)' : 'none' }}>
              <span className="font-semibold">{fmtNgayVN(r.ngay)}</span>
              <span className="text-center font-semibold">{r.so_cau}</span>
              <span className="text-center">
                <b style={{ color: '#20A886' }}>{r.so_dung}</b>
                <span className="mx-1" style={{ color: t.sec }}>/</span>
                <b style={{ color: '#E0405A' }}>{r.so_sai}</b>
              </span>
              <span className="text-right font-medium" style={{ color: t.sec }}>{fmtThoiGian(r.thoi_gian_giay)}</span>
            </div>
          ))}
        </div>
      )}
    </Kung>
  )
}

// ── SUB 3 — BẢNG XẾP HẠNG (3 tab) ─────────────────────────────────────────────────
type BxhKind = 'ti_le' | 'mt' | 'tu_luyen'
function XepHangScreen({ t, hocSinhId, onBack, desktop }: { t: Theme; hocSinhId: string; onBack: () => void; desktop?: boolean }) {
  const [kind, setKind] = useState<BxhKind>('ti_le')
  const [tiLe, setTiLe] = useState<XepHangTiLeRow[] | null>(null)
  const [mt, setMt] = useState<BXHDiemMTRow[] | null>(null)
  const [tuLuyen, setTuLuyen] = useState<XepHangRow[] | null>(null)
  useEffect(() => {
    (async () => {
      const mon = await monCuaHS(); const khoi = await khoiCuaHS()
      if (!mon || !khoi) { setTiLe([]); setMt([]); setTuLuyen([]); return }
      const [a, b, c] = await Promise.all([
        xepHangTiLeDat(mon, khoi).catch(() => [] as XepHangTiLeRow[]),
        getBXHDiemMTKhoi(mon, khoi, ymHomNay()).catch(() => [] as BXHDiemMTRow[]),
        xepHangTuLuyen(khoi).catch(() => [] as XepHangRow[]),
      ])
      setTiLe(a); setMt(b); setTuLuyen(c)
    })().catch(() => { setTiLe([]); setMt([]); setTuLuyen([]) })
  }, [])
  const dangTai = tiLe === null || mt === null || tuLuyen === null
  return (
    <Kung t={t} title="Bảng xếp hạng" sub="So thứ hạng với các bạn cùng khối" onBack={onBack} desktop={desktop}>
      <div className="mt-4 grid grid-cols-3 gap-1 rounded-full p-1" style={{ background: t.cardTint, boxShadow: t.shadow }}>
        {(['ti_le', 'mt', 'tu_luyen'] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)}
            className="rounded-full py-2 text-[12px] font-bold transition"
            style={kind === k ? { background: t.primary, color: '#fff' } : { color: t.sec }}>
            {k === 'ti_le' ? 'Tỉ lệ đạt' : k === 'mt' ? 'Điểm MT' : 'Tự luyện'}
          </button>
        ))}
      </div>
      {dangTai && <p className="mt-6 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {!dangTai && (
        <div className="mt-3">
          {kind === 'ti_le' && <BXHList t={t} rows={tiLe!.map((r) => ({
            ma_hs: r.ma_hs, ho_ten: r.ho_ten, la_toi: r.la_toi,
            nhan: r.ti_le == null ? '—' : `${r.ti_le}%`,
            phu: `${r.so_dat}/${r.so_dang} dạng`,
          }))} emptyText="Chưa có bạn nào đo dạng." />}
          {kind === 'mt' && <BXHList t={t} rows={mt!.map((r) => ({
            ma_hs: r.ma_hs ?? '', ho_ten: r.ho_ten,
            la_toi: r.hoc_sinh_id === hocSinhId,
            nhan: r.tb == null ? '—' : r.tb.toFixed(2),
            phu: r.ten_lop ?? '',
          }))} emptyText="Chưa có điểm MT tháng này." />}
          {kind === 'tu_luyen' && <BXHList t={t} rows={tuLuyen!.map((r) => ({
            ma_hs: r.ma_hs, ho_ten: r.ho_ten, la_toi: r.la_toi,
            nhan: `${r.so_cau_dung}`,
            phu: 'câu đúng',
          }))} emptyText="Chưa có ai làm tự luyện." />}
        </div>
      )}
    </Kung>
  )
}

// ── COMPONENT PHỤ ─────────────────────────────────────────────────────────────────

function EmptyBox({ t, icon, title, mo_ta }: { t: Theme; icon: string; title: string; mo_ta: string }) {
  return (
    <div className="mt-6 rounded-[24px] p-7 text-center" style={{ background: t.cardTint, boxShadow: t.shadow }}>
      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-[20px]" style={{ background: t.iconTint }}>
        <span className="text-[34px]">{icon}</span>
      </div>
      <p className="text-[15px] font-extrabold" style={{ color: NAVY }}>{title}</p>
      <p className="mx-auto mt-1.5 max-w-[280px] text-[12.5px] leading-relaxed" style={{ color: t.sec }}>{mo_ta}</p>
    </div>
  )
}

// Ngày của lần đo PHẢI hiện được ra màn (không chỉ nằm trong title/hover) — đây là thứ quyết định
// lần đo đó có còn "gần đây" (trong cửa sổ) hay đã cũ, quan trọng nhất khi đọc dãy 5 lần đo (Thùy 20/09).
function LanDo({ e, t }: { e: RecentEval; t: Theme }) {
  const icon = e.value >= 1 ? '✓' : e.value > 0 ? '◐' : '✗'
  const mau = e.value >= 1 ? { bg: '#e7f9ee', fg: '#20A886' } : e.value > 0 ? { bg: '#fff3e0', fg: '#E08A1E' } : { bg: '#ffe3e6', fg: '#E0405A' }
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5" title={`${SRC_LABEL[e.src]} · ${fmtNgayVN(e.t)}`}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: mau.bg, color: mau.fg }}>{icon}</span>
      <span className="whitespace-nowrap text-[9px] font-extrabold leading-none" style={{ color: NAVY }}>{fmtNgayVN(e.t)}</span>
      <span className="text-[7.5px] font-bold leading-none" style={{ color: t.sec }}>{SRC_LABEL[e.src]}</span>
    </div>
  )
}

// BXHList — TOP 10 với BỤC TRAO GIẢI 3 đầu (Thùy 13/09: "top 3 dùng bảng xếp hạng giống module xếp
// hạng của TA"). Mượn ĐÚNG pattern Podium ở src/components/bk/XepHangScreen.tsx (dùng cho DashTa/OpsDash):
// ảnh bục /bk-ui/buc_trao_giai.png (aspect 1448/770) — 3 lỗ tròn avatar + 3 thẻ tên đặt theo % đo trên
// ảnh (VI_TRI copy y hệt). Hạng 4-10 dùng Dong (card ngang: hạng · avatar · tên+phụ · pill nhan). Nếu
// "Bạn" không lọt top 10 → dòng riêng ở đáy.
const AV = ['🧑‍🏫', '👩‍🏫', '🧑‍🎓', '👩‍🎓', '🧑', '👩']
const av = (s: string) => AV[(s.charCodeAt(0) + s.length) % AV.length]
const BUC = { url: '/bk-ui/buc_trao_giai.png', aspect: '1448 / 770' }
// Vị trí đo trên ảnh — copy CHÍNH XÁC từ XepHangScreen (CEO đã đo trên ảnh gốc)
const VI_TRI = [
  { cx: 49.9, cy: 29.2, d: 17.0, the: { l: 39.6, t: 49.5, w: 21.4, h: 12.6 }, mau: '#FCF5E7' },   // #1
  { cx: 25.0, cy: 44.2, d: 14.6, the: { l: 14.8, t: 62.6, w: 19.6, h: 12.6 }, mau: '#F1F3FF' },   // #2
  { cx: 74.9, cy: 44.2, d: 14.6, the: { l: 65.9, t: 61.9, w: 19.8, h: 12.6 }, mau: '#FFF1F4' },   // #3
]
type BXHRow = { ma_hs: string; ho_ten: string; la_toi: boolean; nhan: string; phu: string }

function BXHPodium({ top }: { top: BXHRow[] }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: BUC.aspect, containerType: 'inline-size' }}>
      <img src={BUC.url} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />
      {VI_TRI.map((v, i) => {
        const p = top[i]
        if (!p) return null
        return (
          <div key={i}>
            <span className="absolute flex items-center justify-center overflow-hidden rounded-full bg-white"
              style={{ left: `${v.cx}%`, top: `${v.cy}%`, width: `${v.d}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)', fontSize: `${v.d * 0.55}cqw` }}>
              {av(p.ho_ten)}
            </span>
            <div className="absolute flex flex-col justify-center overflow-hidden rounded-md text-center"
              style={{ left: `${v.the.l}%`, top: `${v.the.t}%`, width: `${v.the.w}%`, height: `${v.the.h}%`, background: v.mau }}>
              <p className="truncate font-extrabold leading-tight text-[#16224D]" style={{ fontSize: '2.9cqw' }}>
                {p.ho_ten.split(' ').slice(-2).join(' ')}{p.la_toi && <span className="ml-1" style={{ fontSize: '2.4cqw' }}>· Bạn</span>}
              </p>
              <p className="truncate font-semibold leading-tight text-[#63709A]" style={{ fontSize: '2.5cqw' }}>👑 {p.nhan}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const DONG_VIEN = ['Đang tiến bộ rất nhanh! ✨', 'Cố gắng thêm một chút nhé! 💗', 'Kiên trì là chiến thắng! ⭐', 'Sắp lọt top 3 rồi! 💪', 'Chăm luyện là giỏi! ♡', 'Không bỏ cuộc nhé! 🌟', 'Còn tuyệt vời hơn nữa! ✨']

// Dòng hạng 4-10 — copy phong cách Dong ở XepHangScreen (viền brand khi là "Bạn", avatar tròn, pill động viên).
function DongHS({ t, hang, row, dongVien, ban }: { t: Theme; hang: number | string; row: BXHRow; dongVien: string; ban?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-2.5 py-1.5" style={{ boxShadow: ban ? `inset 0 0 0 2px ${t.primary}66` : 'none' }}>
      <span className="w-6 text-center text-[14px] font-extrabold" style={{ color: ban ? t.primary : '#63709A' }}>{hang}</span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DDF4FF] text-[16px] ring-2 ring-[#DCE6FF]">
        {av(row.ho_ten)}
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-[12px] font-extrabold" style={{ color: NAVY }}>
          {row.ho_ten}{ban && <span className="ml-1 rounded-full px-1.5 py-px text-[8.5px] text-white" style={{ background: t.primary }}>Bạn</span>}
        </p>
        <p className="truncate text-[10px]" style={{ color: t.sec }}>{row.nhan}{row.phu ? ` · ${row.phu}` : ''}</p>
      </div>
      <span className="font-hand shrink-0 rounded-xl bg-[#EEF3FF] px-2 py-1 text-right text-[10px] italic leading-tight text-[#2F73F6]">{dongVien}</span>
    </div>
  )
}

export function BXHList({ t, rows, emptyText }: { t: Theme; rows: BXHRow[]; emptyText: string }) {
  if (rows.length === 0) return <p className="py-4 text-center text-[12.5px]" style={{ color: t.sec }}>{emptyText}</p>
  const top10 = rows.slice(0, 10)
  const top3 = top10.slice(0, 3)
  const rest = top10.slice(3, 10)
  const banRank = rows.findIndex((r) => r.la_toi)   // 0-based
  const banInTop = banRank >= 0 && banRank < 10
  return (
    <div className="flex flex-col gap-1.5">
      <BXHPodium top={top3} />
      {rest.map((r, i) => (
        <DongHS key={r.ma_hs || `${i}-${r.ho_ten}`} t={t} hang={i + 4} row={r} dongVien={DONG_VIEN[i] ?? DONG_VIEN[DONG_VIEN.length - 1]} ban={r.la_toi} />
      ))}
      {banRank >= 0 && !banInTop && (
        <DongHS t={t} hang={`#${banRank + 1}`} row={rows[banRank]} dongVien={`Bạn đang #${banRank + 1}/${rows.length} ✨`} ban />
      )}
    </div>
  )
}

// ── Helper ──
function ymHomNay(): string {
  const vn = new Date(Date.now() + 7 * 3600 * 1000)
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}`
}
function fmtNgayVN(s: string): string {
  const d0 = s.length >= 10 ? s.slice(0, 10) : s
  const [y, m, d] = d0.split('-').map(Number)
  if (!y || !m || !d) return s
  const vn = new Date(Date.now() + 7 * 3600 * 1000)
  const ty = vn.getUTCFullYear(), tm = vn.getUTCMonth() + 1, td = vn.getUTCDate()
  if (y === ty && m === tm && d === td) return 'Hôm nay'
  const y2 = new Date(Date.UTC(ty, tm - 1, td - 1))
  if (y === y2.getUTCFullYear() && m === y2.getUTCMonth() + 1 && d === y2.getUTCDate()) return 'Hôm qua'
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
}
function fmtThoiGian(giay: number): string {
  if (!giay) return '—'
  if (giay < 60) return `${giay}s`
  if (giay < 3600) return `${Math.round(giay / 60)}ph`
  const h = Math.floor(giay / 3600), ph = Math.round((giay - h * 3600) / 60)
  return ph ? `${h}h${ph}` : `${h}h`
}

// Giữ tham chiếu supabase cho TS resolve (import chỉ dùng qua lib helpers)
void supabase
