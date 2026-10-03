// CA BỔ TRỢ YẾU — phía HỌC SINH (PLAN-botro-yeu-ca.md §6). iPad em, tài khoản em.
// Luồng: dạng của case → cụm → LUYỆN liên tục (lô 3 câu tự nối, em bấm "Cụm khác"/"Về dạng" khi TA bảo)
// → TA đóng ca (máy TA) → app thấy test cuối buổi (poll ~10s) → làm bằng LamET (chế độ thi) → xem kết quả.
// Không có nút đóng ca / nhận xét ở đây — đó là việc của TA (tách quyền, chốt 03/09).
// LamBai/LamET truyền vào qua props (không import ngược HocSinhApp → tránh vòng import).
import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { buDangCuaToi, type BuDangHS } from '../../lib/botro_yeu_ca'
import { caCuaToi, sinhLoLuyen, layBaiTestCaNhan, retestCuaToi, LOAI_BO_TRO_TEN, type CaCuaToi, type DangCaHS, type CumCaHS, type RetestCuaToi, type LichBoTro } from '../../lib/botro_yeu_ca'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import type { BaiTestCuaHS } from '../../lib/testonline'
import { CardBai, type Theme } from './HocTuDau'
import { ManHS, DauTrangHS, NutHS, NhanHS, MAU, THE, THE_TRON, HEAD } from './skin/KhungHS'

type LamBaiProps = { baiTestId: string; hocSinhId: string; onXong: () => void; doneCaption?: string; doneExtra?: ReactNode; desktop?: boolean }
type LamETProps = { test: BaiTestCuaHS; hocSinhId: string; onXong: () => void }
type Props = { hocSinhId: string; desktop?: boolean; gioiTinh: 'nam' | 'nu' | null; onXong: () => void; LamBai: ComponentType<LamBaiProps>; LamET: ComponentType<LamETProps> }

const POLL_MS = 10000
const NAVY = MAU.ink
const pct = (d: number, n: number) => (n > 0 ? Math.round((d / n) * 100) : null)
// Icon theo trạng thái luyện (Thùy 22/09, khuôn CardBai): chưa luyện → 🎯, đang luyện <70% → 📖, ≥70% → ✅.
const iconTienDo = (soDung: number, soCau: number) => (soCau === 0 ? '🎯' : pct(soDung, soCau)! >= 70 ? '✅' : '📖')

// Thùy 29/09: mọi màn theo STYLE (skin) em đang chọn — bỏ BACKDROP (nền mây + chồng sách + khẩu hiệu) + màu theo giới tính.
// T_SKIN đủ field khớp `Theme` (HocTuDau.tsx) để dùng chung CardBai — mọi giá trị là biến skin (skin/KhungHS).
// Màn "đang luyện"/"đang test" (LamBai/LamET) KHÔNG bọc ManHS — màn bài tập tự lo khung.
const T_SKIN: Theme = {
  bg: '', decor: '', primary: MAU.acc, sec: MAU.muted,
  iconTint: MAU.surface2, cardTint: MAU.surface, shadow: 'var(--sk-card-shadow)',
  quote: '', quoteColor: MAU.acc,
}
// Nền ngữ nghĩa trong suốt — đứng được trên skin sáng lẫn tối.
const XONG_BG = 'rgba(34,160,107,0.16)'
// Chữ đặc trên nền nhấn: ô icon mờ theo màu chữ-trên-nhấn (tự đúng cả nhấn sáng lẫn tối).
const ICON_TREN_NHAN = 'color-mix(in srgb, var(--sk-acc-ink) 18%, transparent)'

type View =
  | { kind: 'dangs' }
  | { kind: 'cums'; maDang: string }
  | { kind: 'luyen'; maDang: string; maCum: string | null; baiTestId: string }
  | { kind: 'test'; test: BaiTestCuaHS }

export default function CaBoTroHS({ hocSinhId, desktop, onXong, LamBai, LamET }: Props) {
  const t = T_SKIN
  const [ca, setCa] = useState<CaCuaToi | null | undefined>(undefined) // undefined = đang tải
  const [view, setView] = useState<View>({ kind: 'dangs' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const viewRef = useRef(view); viewRef.current = view

  async function taiCa() {
    try { setCa(await caCuaToi()) } catch (e: any) { setErr(e?.message ?? String(e)); setCa(null) }
  }
  useEffect(() => { taiCa() }, [])
  // Poll khi KHÔNG đang làm bài (đang luyện/thi thì không đổi màn dưới chân em).
  useEffect(() => {
    const id = setInterval(() => { const k = viewRef.current.kind; if (k === 'dangs' || k === 'cums') taiCa() }, POLL_MS)
    return () => clearInterval(id)
  }, [])

  async function luyen(maDang: string, maCum: string | null) {
    setBusy(true); setErr(null)
    try {
      const r = await sinhLoLuyen(ca!.buoi_id, maDang, maCum)
      setView({ kind: 'luyen', maDang, maCum, baiTestId: r.bai_test_id })
    } catch (e: any) {
      setErr(e?.message ?? String(e)); await taiCa(); setView({ kind: 'dangs' }) // ca đã đóng → về màn ca để thấy test
    } finally { setBusy(false) }
  }
  async function moTest() {
    if (!ca?.test) return
    setBusy(true); setErr(null)
    try { setView({ kind: 'test', test: await layBaiTestCaNhan(ca.test.bai_test_id) }) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  const wrap = (children: ReactNode) => <ManHS className="!gap-0">{children}</ManHS>
  const Head = ({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) => (
    <div className="mb-4"><DauTrangHS tieuDe={title} phu={sub} onBack={onBack} /></div>
  )

  if (ca === undefined) return wrap(<p className="py-16 text-center text-sm" style={{ color: MAU.muted }}>Đang tải ca bổ trợ…</p>)

  // ── Đang LUYỆN: LamBai nguyên bản; xong lô → tự nối lô mới (nút chính), phụ: Cụm khác / Về dạng ──
  if (view.kind === 'luyen') {
    const v = view
    return (
      <div className="relative">
        <button onClick={() => setView({ kind: 'cums', maDang: v.maDang })}
          className="fixed right-3 top-[calc(8px+env(safe-area-inset-top))] z-20 rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ ...THE_TRON, borderRadius: '999px', color: MAU.muted }}>
          Đổi cụm
        </button>
        <LamBai key={v.baiTestId} baiTestId={v.baiTestId} hocSinhId={hocSinhId} desktop={desktop}
          onXong={() => setView({ kind: 'cums', maDang: v.maDang })}
          doneCaption="Tiếp tục luyện tới khi thầy cô bảo chuyển nhé."
          doneExtra={
            <div className={`mt-3 flex w-full flex-col gap-2 ${desktop ? 'max-w-sm' : ''}`}>
              {err && <p className="text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
              <button onClick={() => luyen(v.maDang, v.maCum)} disabled={busy}
                className={`w-full font-semibold disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`}
                style={{ background: MAU.acc, color: MAU.accInk, borderRadius: 'var(--sk-radius)', clipPath: 'var(--sk-card-clip)', fontFamily: 'var(--sk-font-head)' }}>
                {busy ? 'Đang lấy câu…' : 'Luyện tiếp cụm này →'}
              </button>
              <NutHS phu onClick={() => setView({ kind: 'dangs' })} className="w-full !text-sm !font-medium">Về danh sách dạng</NutHS>
            </div>
          } />
      </div>
    )
  }

  // ── Làm TEST cuối buổi (chế độ thi) ──
  if (view.kind === 'test') {
    return <LamET test={view.test} hocSinhId={hocSinhId} onXong={async () => { await taiCa(); setView({ kind: 'dangs' }) }} />
  }

  if (!ca) return wrap(
    <>
      <Head title="Bổ trợ" onBack={onXong} />
      <div className="p-8 text-center" style={THE}>
        <p className="text-3xl">🕒</p>
        <p className="mt-2 text-[15px] font-medium" style={{ color: NAVY }}>Hôm nay em chưa vào ca bổ trợ.</p>
        <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>Thầy cô điểm danh xong thì ca sẽ hiện ở đây. Màn này tự cập nhật.</p>
        {err && <p className="mt-2 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
      </div>
    </>,
  )

  // ── Có TEST → chặn luyện, ưu tiên làm test ──
  const testBanner = ca.test && (
    <button onClick={moTest} disabled={busy}
      className="mb-4 w-full p-5 text-left disabled:opacity-60" style={{ ...THE, background: MAU.acc, color: MAU.accInk }}>
      <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Thầy cô đã đóng ca</p>
      <p className="mt-1 text-[18px] font-bold" style={HEAD}>{ca.test.da_nop ? '✓ Đã làm bài kiểm tra cuối buổi' : `Bài kiểm tra cuối buổi · ${ca.test.so_cau} câu`}</p>
      <p className="mt-1 text-[13px] opacity-90">{ca.test.da_nop ? 'Xem lại kết quả và đưa iPad cho thầy cô nhé.' : 'Nộp 1 lần, đáp án hiện sau khi nộp. Bấm để bắt đầu →'}</p>
    </button>
  )

  if (view.kind === 'cums' && !ca.test) {
    const d = ca.dangs.find((x) => x.ma_dang === view.maDang)
    if (!d) { setView({ kind: 'dangs' }); return null }
    return wrap(
      <>
        <Head title={d.ten_dang} sub={d.ten_chuyen_de} onBack={() => setView({ kind: 'dangs' })} />
        {err && <p className="mb-3 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
          {d.cums.length === 0 ? (
            <CumCard t={t} icon={iconTienDo(d.so_dung, d.so_cau)} ten="Cả dạng" sub="Dạng này chưa chia cụm — luyện chung cả dạng." soCau={d.so_cau} soDung={d.so_dung} busy={busy} onLuyen={() => luyen(d.ma_dang, null)} />
          ) : d.cums.map((c) => <CumRow key={c.ma_cum} c={c} d={d} t={t} busy={busy} onLuyen={() => luyen(d.ma_dang, c.ma_cum)} />)}
        </div>
      </>,
    )
  }

  // ── Màn CA: dạng của case ──
  return wrap(
    <>
      <Head title={`Bổ trợ ${ca.mon}`} sub={`${ca.gio_bat_dau ? ca.gio_bat_dau.slice(0, 5) : ''}${ca.gio_ket_thuc ? `–${ca.gio_ket_thuc.slice(0, 5)}` : ''}${ca.phong ? ` · ${ca.phong}` : ''}${ca.ta_ten ? ` · ${ca.ta_ten}` : ''}`} onBack={onXong} />
      {testBanner}
      {err && <p className="mb-3 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
      {!ca.test && <p className="mb-2 px-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>Chọn dạng thầy cô bảo luyện:</p>}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
        {ca.dangs.map((d) => (
          <CardBai key={d.ma_dang} t={t} icon={iconTienDo(d.so_dung, d.so_cau)} ten={d.ten_dang}
            sub={`${d.ten_chuyen_de}${d.cums.length ? ` · ${d.cums.length} cụm` : ''}${d.da_day_truoc ? ' · đã học ở ca trước' : ''}`}
            tag={d.so_cau > 0 ? `${d.so_dung}/${d.so_cau} đúng` : undefined}
            disabled={!!ca.test} onClick={() => setView({ kind: 'cums', maDang: d.ma_dang })} />
        ))}
        {ca.dangs.length === 0 && <p className="p-6 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Ca này chưa có dạng nào — báo thầy cô nhé.</p>}
      </div>
    </>,
  )
}

function CumRow({ c, d, t, busy, onLuyen }: { c: CumCaHS; d: DangCaHS; t: Theme; busy: boolean; onLuyen: () => void }) {
  // Tiền đề chưa luyện → gợi ý thứ tự (KHÔNG chặn — TA quyết).
  const chuaXong = c.tien_de.map((m) => d.cums.find((x) => x.ma_cum === m)).filter((x): x is CumCaHS => !!x && x.so_cau === 0)
  const sub = [c.so_cau_kho ? `${c.so_cau_kho} bài trong kho` : 'kho chưa có bài', chuaXong.length ? `nên làm sau: ${chuaXong.map((x) => x.ten).join(', ')}` : ''].filter(Boolean).join(' · ')
  return <CumCard t={t} icon={iconTienDo(c.so_dung, c.so_cau)} ten={`${c.thu_tu}. ${c.ten}`} sub={sub} soCau={c.so_cau} soDung={c.so_dung} busy={busy || c.so_cau_kho === 0} onLuyen={onLuyen} />
}

// Khuôn CardBai (icon box + tên/mô tả) NHƯNG giữ nút hành động riêng "Luyện tiếp →" — không dùng
// thẳng CardBai vì đó là <button> trọn khối, không lồng được nút bên trong (Thùy 22/09 "cùng khuôn").
function CumCard({ t, icon, ten, sub, soCau, soDung, busy, onLuyen }: { t: Theme; icon: string; ten: string; sub: string; soCau: number; soDung: number; busy: boolean; onLuyen: () => void }) {
  return (
    <div className="p-4" style={THE}>
      <div className="flex items-start gap-3">
        <span className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] text-[26px]" style={{ background: t.iconTint }}>{icon}</span>
        <span className="min-w-0 flex-1 pt-1">
          <span className="block truncate text-[15px] font-extrabold leading-tight" style={{ ...HEAD, color: NAVY }}>{ten}</span>
          <span className="mt-1 block text-[12px] leading-snug" style={{ color: t.sec }}>{sub}</span>
        </span>
        {soCau > 0 && <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: XONG_BG, color: MAU.dung }}>{soDung}/{soCau} đúng</span>}
      </div>
      <button onClick={onLuyen} disabled={busy} className="mt-3 w-full py-3 text-sm font-semibold disabled:opacity-40"
        style={{ background: t.primary, color: MAU.accInk, borderRadius: 'var(--sk-radius)', clipPath: 'var(--sk-card-clip)', fontFamily: 'var(--sk-font-head)' }}>
        {soCau > 0 ? 'Luyện tiếp →' : 'Bắt đầu luyện →'}
      </button>
    </div>
  )
}

// ── Banner ở màn chính: CHỈ render khi có ca hôm nay hoặc retest đến hạn (không "sắp có", không ô trống) ──
// Cấp 1 (HomeCap1 `extra`): 2 box Bổ trợ · Bài tập được giao (Thùy 09-09) + banner ca hôm nay + retest.
// Thùy 29/09: thẻ/màu theo skin (skin/KhungHS) — ô trắng + bóng cố định cũ bỏ.
const BADGE_GOC: CSSProperties = { background: MAU.badge, color: MAU.badgeInk }
export function BoTroBanner({ lich, coCa, soRetest, desktop, onLich, onCa, onRetest }: { lich: LichBoTro[]; coCa: boolean; soRetest: number; desktop?: boolean; onLich: () => void; onCa: () => void; onRetest: () => void }) {
  const ke = lich[0]
  const sub = !ke ? 'Chưa có lịch' : `${LOAI_BO_TRO_TEN[ke.loai]} · ${ke.hom_nay ? 'Hôm nay' : `${thuCuaNgay(ke.ngay)} ${ddmmVN(ke.ngay)}`}${ke.gio_bat_dau ? ` · ${String(ke.gio_bat_dau).slice(0, 5)}` : ''}${ke.phong ? ` · ${ke.phong}` : ''}`
  return (
    <div className={`flex flex-col gap-3 ${desktop ? 'mt-5' : 'mt-4'}`}>
      <div className="grid grid-cols-2 gap-3">
        {/* clipPath none: badge số nhô ra góc trên phải, skin cắt góc sẽ xén mất */}
        <button onClick={onLich} className="relative flex items-center gap-3 p-4 text-left" style={{ ...THE, clipPath: 'none' }}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] text-[21px]" style={{ background: MAU.surface2 }}>🧑‍🏫</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold tracking-tight" style={{ ...HEAD, color: NAVY }}>Bổ trợ</span>
            <span className={`mt-0.5 block truncate text-[12px] ${ke ? 'font-semibold' : ''}`} style={{ color: ke ? MAU.acc : MAU.muted }}>{sub}</span>
          </span>
          {lich.length > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-bold" style={BADGE_GOC}>{lich.length}</span>}
        </button>
        <button disabled className="flex items-center gap-3 p-4 text-left opacity-60 saturate-50" style={THE}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] text-[21px]" style={{ background: MAU.surface2 }}>📚</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold tracking-tight" style={{ ...HEAD, color: NAVY }}>Bài tập được giao</span>
            <span className="mt-0.5 block text-[12px]" style={{ color: MAU.muted }}>Sắp có</span>
          </span>
        </button>
      </div>
      {coCa && (
        <button onClick={onCa} className="flex items-center gap-3 p-4 text-left" style={{ ...THE, background: MAU.acc, color: MAU.accInk }}>
          <span className="flex h-11 w-11 items-center justify-center rounded-[15px] text-[21px]" style={{ background: ICON_TREN_NHAN }}>🧑‍🏫</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold tracking-tight" style={HEAD}>Ca bổ trợ hôm nay</span>
            <span className="mt-0.5 block text-[12px] opacity-90">Luyện theo dạng thầy cô bảo · bấm để vào ca →</span>
          </span>
        </button>
      )}
      {soRetest > 0 && (
        <button onClick={onRetest} className="flex items-center gap-3 p-4 text-left" style={THE}>
          <span className="flex h-11 w-11 items-center justify-center rounded-[15px] text-[21px]" style={{ background: MAU.surface2 }}>📝</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold tracking-tight" style={{ ...HEAD, color: NAVY }}>Bài kiểm tra lại</span>
            <span className="mt-0.5 block text-[12px]" style={{ color: MAU.muted }}>{soRetest} bài chờ làm sau ET · nộp 1 lần</span>
          </span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-bold" style={BADGE_GOC}>{soRetest}</span>
        </button>
      )}
    </div>
  )
}

// ── BÀI KIỂM TRA LẠI (retest tầng 2) — làm ngay sau ET buổi thường, TA đưa iPad ──
export function RetestHS({ hocSinhId, onXong, LamET }: { hocSinhId: string; gioiTinh: 'nam' | 'nu' | null; onXong: () => void; LamET: ComponentType<LamETProps> }) {
  const [ds, setDs] = useState<RetestCuaToi[] | null>(null)
  const [test, setTest] = useState<BaiTestCuaHS | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const tai = () => retestCuaToi().then(setDs).catch((e) => { setErr(e?.message ?? String(e)); setDs([]) })
  useEffect(() => { tai() }, [])
  if (test) return <LamET test={test} hocSinhId={hocSinhId} onXong={() => { setTest(null); tai() }} />
  return (
    <ManHS className="!gap-0">
      <div className="mb-4"><DauTrangHS tieuDe="Bài kiểm tra lại" onBack={onXong} /></div>
      {err && <p className="mb-3 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
      {ds === null ? <p className="py-10 text-center text-sm" style={{ color: MAU.muted }}>Đang tải…</p>
        : ds.length === 0 ? <div className="p-8 text-center" style={THE}><p className="text-3xl">🎉</p><p className="mt-2 text-[15px] font-medium" style={{ color: NAVY }}>Không có bài kiểm tra lại nào.</p></div>
        : ds.map((r) => (
          <button key={r.bai_test_id} onClick={async () => { try { setTest(await layBaiTestCaNhan(r.bai_test_id)) } catch (e: any) { setErr(e?.message ?? String(e)) } }}
            className="mb-3 w-full p-4 text-left" style={THE}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[15px] font-semibold" style={{ color: NAVY }}><NhanHS>THI</NhanHS>Kiểm tra lại {r.mon}</span>
              {r.da_nop ? <NhanHS mau={MAU.dung}>✓ đã nộp</NhanHS> : <NhanHS>mới</NhanHS>}
            </div>
            <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>{r.so_cau} câu · nộp 1 lần{r.buoi_bo_tro_ngay ? ` · sau ca bổ trợ ${r.buoi_bo_tro_ngay.slice(8, 10)}/${r.buoi_bo_tro_ngay.slice(5, 7)}` : ''}</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: MAU.acc }}>{r.da_nop ? 'Xem lại' : 'Bắt đầu'} →</p>
          </button>
        ))}
    </ManHS>
  )
}

// ── LỊCH BỔ TRỢ (Thùy 09-09) — 3 loại yếu / bù / đuổi đã xếp cho em, sắp tới + hôm nay. Ca yếu hôm nay đã
// điểm danh ⇒ nút "Vào ca" (CaBoTroHS). Bù/đuổi chỉ để em + PH biết lịch (làm bài trong ca là việc của TA/GV).
// Màu nhãn 3 loại: yếu = cảnh báo (cam), bù = nhấn của skin, đuổi = tím cố định (chỉ để phân biệt loại —
// tím tầm trung, đọc được trên thẻ sáng lẫn tối).
const LOAI_MAU: Record<LichBoTro['loai'], string> = { bo_tro_yeu: MAU.canhBao, bu: MAU.acc, bo_tro_duoi: '#8b6cf0' }
export function LichBoTroHS({ lich, coCa, onXong, onVaoCa }: { lich: LichBoTro[]; coCa: boolean; gioiTinh: 'nam' | 'nu' | null; onXong: () => void; onVaoCa: (c: LichBoTro) => void }) {
  return (
    <ManHS className="!gap-0">
      <div className="sticky top-0 z-10 -mx-4 px-4 pb-3 pt-1 backdrop-blur-sm" style={{ background: 'color-mix(in srgb, var(--sk-bg) 70%, transparent)' }}>
        <DauTrangHS tieuDe="Bổ trợ" phu={lich.length ? `${lich.length} buổi sắp tới` : 'Chưa có lịch bổ trợ'} onBack={onXong} theoMon />
      </div>
      {lich.length === 0 && (
        <div className="p-6 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>
          Em chưa có buổi bổ trợ nào được xếp. Khi thầy cô xếp lịch (bổ trợ yếu · học bù · học đuổi) sẽ hiện ở đây.
        </div>
      )}
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
        {lich.map((c) => (
          <div key={c.buoi_id} className="p-4" style={c.hom_nay ? { ...THE, border: `2px solid ${MAU.canhBao}` } : THE}>
            <div className="flex items-center gap-2">
              <NhanHS mau={LOAI_MAU[c.loai]}>{LOAI_BO_TRO_TEN[c.loai]}</NhanHS>
              {c.mon && <span className="text-[12px]" style={{ color: MAU.muted }}>{c.mon}</span>}
              {c.hom_nay && <span className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold text-white" style={{ background: MAU.sai }}>Hôm nay</span>}
            </div>
            <div className="mt-2 text-[16px] font-bold" style={{ ...HEAD, color: NAVY }}>
              {thuCuaNgay(c.ngay)} {ddmmVN(c.ngay)}{c.gio_bat_dau ? ` · ${String(c.gio_bat_dau).slice(0, 5)}${c.gio_ket_thuc ? `–${String(c.gio_ket_thuc).slice(0, 5)}` : ''}` : ''}
            </div>
            <div className="mt-1 text-[13px]" style={{ color: MAU.muted }}>
              {c.phong ? `Phòng ${c.phong}` : 'Chưa có phòng'}{c.nguoi ? ` · ${c.nguoi}` : ''}
            </div>
            {c.vao_ca && coCa && (
              <NutHS onClick={() => onVaoCa(c)} className="mt-3 w-full">Vào ca luyện →</NutHS>
            )}
            {c.hom_nay && !c.vao_ca && (
              <div className="mt-2 text-[12px]" style={{ color: MAU.muted }}>Đến phòng, thầy cô điểm danh xong là vào luyện được.</div>
            )}
          </div>
        ))}
      </div>
    </ManHS>
  )
}

// ── CA BÙ (Thùy 03/10: "TA bấm có mặt nhưng app HS không vào ca luyện được") — em học lại các DẠNG của buổi đã nghỉ.
// Mỗi dạng mở bằng màn "Học từ đầu" sẵn có (Lý thuyết · Luyện tập · Test), câu theo luật kho (MCQ). Bấm dạng → cha điều hướng.
export function CaBuHS({ buoiId, onBack, onPickDang }: { buoiId: string; onBack: () => void; onPickDang: (d: { ma_dang: string; ten_dang: string }, mon: string) => void }) {
  const [d, setD] = useState<BuDangHS | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { buDangCuaToi(buoiId).then(setD).catch((e: any) => setLoi(e?.message ?? String(e))) }, [buoiId])
  return (
    <ManHS>
      <DauTrangHS tieuDe="Học bù" phu={d ? `Buổi ${d.ten_lop ?? ''}${d.ngay_me ? ` · ${ddmmVN(d.ngay_me)}` : ''} em đã nghỉ` : 'Đang tải…'} onBack={onBack} />
      {loi && <div className="p-4 text-[13px]" style={{ ...THE, color: MAU.sai }}>{loi}</div>}
      {d && d.dangs.length === 0 && (
        <div className="p-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Buổi này chưa có dạng bài nào trên app — em học cùng thầy cô trên giấy nhé.</div>
      )}
      {d && d.dangs.length > 0 && (
        <>
          <p className="text-[13px]" style={{ color: MAU.muted }}>Chọn từng dạng: đọc lý thuyết → luyện tập → làm bài test.</p>
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
            {d.dangs.map((x, i) => (
              <button key={x.ma_dang} onClick={() => onPickDang(x, d.mon)} className="flex items-center gap-3 p-4 text-left" style={THE}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold" style={{ background: MAU.surface2, color: MAU.acc }}>{i + 1}</span>
                <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug" style={{ ...HEAD, color: NAVY }}>{x.ten_dang}</span>
                <span className="text-[18px]" style={{ color: MAU.muted }}>›</span>
              </button>
            ))}
          </div>
        </>
      )}
    </ManHS>
  )
}
