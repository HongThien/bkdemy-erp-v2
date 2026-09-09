// CA BỔ TRỢ YẾU — phía HỌC SINH (PLAN-botro-yeu-ca.md §6). iPad em, tài khoản em.
// Luồng: dạng của case → cụm → LUYỆN liên tục (lô 3 câu tự nối, em bấm "Cụm khác"/"Về dạng" khi TA bảo)
// → TA đóng ca (máy TA) → app thấy test cuối buổi (poll ~10s) → làm bằng LamET (chế độ thi) → xem kết quả.
// Không có nút đóng ca / nhận xét ở đây — đó là việc của TA (tách quyền, chốt 03/09).
// LamBai/LamET truyền vào qua props (không import ngược HocSinhApp → tránh vòng import).
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { caCuaToi, sinhLoLuyen, layBaiTestCaNhan, retestCuaToi, type CaCuaToi, type DangCaHS, type CumCaHS, type RetestCuaToi } from '../../lib/botro_yeu_ca'
import type { BaiTestCuaHS } from '../../lib/testonline'

type LamBaiProps = { baiTestId: string; hocSinhId: string; onXong: () => void; doneCaption?: string; doneExtra?: ReactNode; desktop?: boolean }
type LamETProps = { test: BaiTestCuaHS; hocSinhId: string; onXong: () => void }
type Props = { hocSinhId: string; desktop?: boolean; onXong: () => void; LamBai: ComponentType<LamBaiProps>; LamET: ComponentType<LamETProps> }

const POLL_MS = 10000
const SHADOW = 'shadow-[0_8px_24px_rgba(28,38,61,0.07)]'
const pct = (d: number, n: number) => (n > 0 ? Math.round((d / n) * 100) : null)

type View =
  | { kind: 'dangs' }
  | { kind: 'cums'; maDang: string }
  | { kind: 'luyen'; maDang: string; maCum: string | null; baiTestId: string }
  | { kind: 'test'; test: BaiTestCuaHS }

export default function CaBoTroHS({ hocSinhId, desktop, onXong, LamBai, LamET }: Props) {
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

  const wrap = (children: ReactNode) => (
    <div className={desktop ? 'min-h-screen bg-[#f4f7fb] px-8 py-6' : 'mx-auto min-h-screen max-w-md bg-ios px-4 pb-10 pt-[calc(14px+env(safe-area-inset-top))]'}>
      <div className={desktop ? 'mx-auto max-w-3xl' : ''}>{children}</div>
    </div>
  )
  const Head = ({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) => (
    <div className="mb-4 flex items-center gap-3">
      <button onClick={onBack} className={`flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-white text-[18px] ${SHADOW}`}>‹</button>
      <div className="min-w-0">
        <p className="truncate text-[19px] font-bold tracking-tight text-ph-label">{title}</p>
        {sub && <p className="truncate text-[13px] text-ph-label-2">{sub}</p>}
      </div>
    </div>
  )

  if (ca === undefined) return wrap(<p className="py-16 text-center text-sm text-ph-label-2">Đang tải ca bổ trợ…</p>)

  // ── Đang LUYỆN: LamBai nguyên bản; xong lô → tự nối lô mới (nút chính), phụ: Cụm khác / Về dạng ──
  if (view.kind === 'luyen') {
    const v = view
    return (
      <div className="relative">
        <button onClick={() => setView({ kind: 'cums', maDang: v.maDang })}
          className="fixed right-3 top-[calc(8px+env(safe-area-inset-top))] z-20 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ph-label-2 shadow">
          Đổi cụm
        </button>
        <LamBai key={v.baiTestId} baiTestId={v.baiTestId} hocSinhId={hocSinhId} desktop={desktop}
          onXong={() => setView({ kind: 'cums', maDang: v.maDang })}
          doneCaption="Tiếp tục luyện tới khi thầy cô bảo chuyển nhé."
          doneExtra={
            <div className={`mt-3 flex w-full flex-col gap-2 ${desktop ? 'max-w-sm' : ''}`}>
              {err && <p className="text-[12.5px] text-ph-red">{err}</p>}
              <button onClick={() => luyen(v.maDang, v.maCum)} disabled={busy}
                className={`w-full rounded-xl bg-brand/10 font-semibold text-brand disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`}>
                {busy ? 'Đang lấy câu…' : 'Luyện tiếp cụm này →'}
              </button>
              <button onClick={() => setView({ kind: 'dangs' })} className="w-full rounded-xl bg-white px-6 py-3 text-sm font-medium text-ph-label-2 shadow-sm">Về danh sách dạng</button>
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
      <div className={`rounded-[21px] bg-white p-8 text-center ${SHADOW}`}>
        <p className="text-3xl">🕒</p>
        <p className="mt-2 text-[15px] font-medium text-ph-label">Hôm nay em chưa vào ca bổ trợ.</p>
        <p className="mt-1 text-[13px] text-ph-label-2">Thầy cô điểm danh xong thì ca sẽ hiện ở đây. Màn này tự cập nhật.</p>
        {err && <p className="mt-2 text-[12.5px] text-ph-red">{err}</p>}
      </div>
    </>,
  )

  // ── Có TEST → chặn luyện, ưu tiên làm test ──
  const testBanner = ca.test && (
    <button onClick={moTest} disabled={busy}
      className={`mb-4 w-full rounded-[21px] bg-gradient-to-br from-brand to-brand-2 p-5 text-left text-white ${SHADOW} disabled:opacity-60`}>
      <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Thầy cô đã đóng ca</p>
      <p className="mt-1 text-[18px] font-bold">{ca.test.da_nop ? '✓ Đã làm bài kiểm tra cuối buổi' : `Bài kiểm tra cuối buổi · ${ca.test.so_cau} câu`}</p>
      <p className="mt-1 text-[13px] opacity-90">{ca.test.da_nop ? 'Xem lại kết quả và đưa iPad cho thầy cô nhé.' : 'Nộp 1 lần, đáp án hiện sau khi nộp. Bấm để bắt đầu →'}</p>
    </button>
  )

  if (view.kind === 'cums' && !ca.test) {
    const d = ca.dangs.find((x) => x.ma_dang === view.maDang)
    if (!d) { setView({ kind: 'dangs' }); return null }
    return wrap(
      <>
        <Head title={d.ten_dang} sub={d.ten_chuyen_de} onBack={() => setView({ kind: 'dangs' })} />
        {err && <p className="mb-3 text-[12.5px] text-ph-red">{err}</p>}
        <div className="flex flex-col gap-3">
          {d.cums.length === 0 ? (
            <CumCard ten="Cả dạng" sub="Dạng này chưa chia cụm — luyện chung cả dạng." soCau={d.so_cau} soDung={d.so_dung} busy={busy} onLuyen={() => luyen(d.ma_dang, null)} />
          ) : d.cums.map((c) => <CumRow key={c.ma_cum} c={c} d={d} busy={busy} onLuyen={() => luyen(d.ma_dang, c.ma_cum)} />)}
        </div>
      </>,
    )
  }

  // ── Màn CA: dạng của case ──
  return wrap(
    <>
      <Head title={`Bổ trợ ${ca.mon}`} sub={`${ca.gio_bat_dau ? ca.gio_bat_dau.slice(0, 5) : ''}${ca.gio_ket_thuc ? `–${ca.gio_ket_thuc.slice(0, 5)}` : ''}${ca.phong ? ` · ${ca.phong}` : ''}${ca.ta_ten ? ` · ${ca.ta_ten}` : ''}`} onBack={onXong} />
      {testBanner}
      {err && <p className="mb-3 text-[12.5px] text-ph-red">{err}</p>}
      {!ca.test && <p className="mb-2 px-1 text-[13px] text-ph-label-2">Chọn dạng thầy cô bảo luyện:</p>}
      <div className="flex flex-col gap-3">
        {ca.dangs.map((d) => {
          const p = pct(d.so_dung, d.so_cau)
          return (
            <button key={d.ma_dang} disabled={!!ca.test} onClick={() => setView({ kind: 'cums', maDang: d.ma_dang })}
              className={`rounded-[21px] bg-white p-4 text-left ${SHADOW} disabled:opacity-60`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-semibold text-ph-label">{d.ten_dang}</span>
                {d.so_cau > 0 && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${p! >= 70 ? 'bg-ph-green/10 text-ph-green' : 'bg-ph-orange/10 text-ph-orange'}`}>{d.so_dung}/{d.so_cau} đúng</span>}
              </div>
              <p className="mt-0.5 text-[12.5px] text-ph-label-2">{d.ten_chuyen_de}{d.cums.length ? ` · ${d.cums.length} cụm` : ''}{d.da_day_truoc ? ' · đã học ở ca trước' : ''}</p>
            </button>
          )
        })}
        {ca.dangs.length === 0 && <p className="rounded-[21px] bg-white p-6 text-center text-[13px] text-ph-label-2">Ca này chưa có dạng nào — báo thầy cô nhé.</p>}
      </div>
    </>,
  )
}

function CumRow({ c, d, busy, onLuyen }: { c: CumCaHS; d: DangCaHS; busy: boolean; onLuyen: () => void }) {
  // Tiền đề chưa luyện → gợi ý thứ tự (KHÔNG chặn — TA quyết).
  const chuaXong = c.tien_de.map((m) => d.cums.find((x) => x.ma_cum === m)).filter((x): x is CumCaHS => !!x && x.so_cau === 0)
  const sub = [c.so_cau_kho ? `${c.so_cau_kho} bài trong kho` : 'kho chưa có bài', chuaXong.length ? `nên làm sau: ${chuaXong.map((x) => x.ten).join(', ')}` : ''].filter(Boolean).join(' · ')
  return <CumCard ten={`${c.thu_tu}. ${c.ten}`} sub={sub} soCau={c.so_cau} soDung={c.so_dung} busy={busy || c.so_cau_kho === 0} onLuyen={onLuyen} />
}

function CumCard({ ten, sub, soCau, soDung, busy, onLuyen }: { ten: string; sub: string; soCau: number; soDung: number; busy: boolean; onLuyen: () => void }) {
  const p = pct(soDung, soCau)
  return (
    <div className={`rounded-[21px] bg-white p-4 ${SHADOW}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[15px] font-semibold text-ph-label">{ten}</span>
        {soCau > 0 && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${p! >= 70 ? 'bg-ph-green/10 text-ph-green' : 'bg-ph-orange/10 text-ph-orange'}`}>{soDung}/{soCau} đúng</span>}
      </div>
      <p className="mt-0.5 text-[12.5px] text-ph-label-2">{sub}</p>
      <button onClick={onLuyen} disabled={busy} className="mt-3 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-40">
        {soCau > 0 ? 'Luyện tiếp →' : 'Bắt đầu luyện →'}
      </button>
    </div>
  )
}

// ── Banner ở màn chính: CHỈ render khi có ca hôm nay hoặc retest đến hạn (không "sắp có", không ô trống) ──
export function BoTroBanner({ coCa, soRetest, desktop, onCa, onRetest }: { coCa: boolean; soRetest: number; desktop?: boolean; onCa: () => void; onRetest: () => void }) {
  if (!coCa && soRetest === 0) return null
  return (
    <div className={`flex flex-col gap-3 ${desktop ? 'mt-5' : 'mt-4'}`}>
      {coCa && (
        <button onClick={onCa} className={`flex items-center gap-3 rounded-[22px] bg-gradient-to-br from-brand to-brand-2 p-4 text-left text-white ${SHADOW}`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/20 text-[21px]">🧑‍🏫</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold tracking-tight">Ca bổ trợ hôm nay</span>
            <span className="mt-0.5 block text-[12px] opacity-90">Luyện theo dạng thầy cô bảo · bấm để vào ca →</span>
          </span>
        </button>
      )}
      {soRetest > 0 && (
        <button onClick={onRetest} className={`flex items-center gap-3 rounded-[22px] bg-white p-4 text-left ${SHADOW}`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-ph-purple/10 text-[21px]">📝</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold tracking-tight text-ph-label">Bài kiểm tra lại</span>
            <span className="mt-0.5 block text-[12px] text-ph-label-2">{soRetest} bài chờ làm sau ET · nộp 1 lần</span>
          </span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ph-red px-1.5 text-[12px] font-bold text-white">{soRetest}</span>
        </button>
      )}
    </div>
  )
}

// ── BÀI KIỂM TRA LẠI (retest tầng 2) — làm ngay sau ET buổi thường, TA đưa iPad ──
export function RetestHS({ hocSinhId, onXong, LamET }: { hocSinhId: string; onXong: () => void; LamET: ComponentType<LamETProps> }) {
  const [ds, setDs] = useState<RetestCuaToi[] | null>(null)
  const [test, setTest] = useState<BaiTestCuaHS | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const tai = () => retestCuaToi().then(setDs).catch((e) => { setErr(e?.message ?? String(e)); setDs([]) })
  useEffect(() => { tai() }, [])
  if (test) return <LamET test={test} hocSinhId={hocSinhId} onXong={() => { setTest(null); tai() }} />
  return (
    <div className="mx-auto min-h-screen max-w-md bg-ios px-4 pb-10 pt-[calc(14px+env(safe-area-inset-top))]">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onXong} className={`flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-white text-[18px] ${SHADOW}`}>‹</button>
        <p className="text-[19px] font-bold tracking-tight text-ph-label">Bài kiểm tra lại</p>
      </div>
      {err && <p className="mb-3 text-[12.5px] text-ph-red">{err}</p>}
      {ds === null ? <p className="py-10 text-center text-sm text-ph-label-2">Đang tải…</p>
        : ds.length === 0 ? <div className={`rounded-[21px] bg-white p-8 text-center ${SHADOW}`}><p className="text-3xl">🎉</p><p className="mt-2 text-[15px] font-medium text-ph-label">Không có bài kiểm tra lại nào.</p></div>
        : ds.map((r) => (
          <button key={r.bai_test_id} onClick={async () => { try { setTest(await layBaiTestCaNhan(r.bai_test_id)) } catch (e: any) { setErr(e?.message ?? String(e)) } }}
            className={`mb-3 w-full rounded-[21px] bg-white p-4 text-left ${SHADOW}`}>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-ph-label"><span className="mr-1.5 rounded bg-ph-purple/10 px-1.5 py-0.5 text-[11px] font-semibold text-ph-purple">THI</span>Kiểm tra lại {r.mon}</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${r.da_nop ? 'bg-ph-green/10 text-ph-green' : 'bg-brand/10 text-brand'}`}>{r.da_nop ? '✓ đã nộp' : 'mới'}</span>
            </div>
            <p className="mt-1 text-[13px] text-ph-label-2">{r.so_cau} câu · nộp 1 lần{r.buoi_bo_tro_ngay ? ` · sau ca bổ trợ ${r.buoi_bo_tro_ngay.slice(8, 10)}/${r.buoi_bo_tro_ngay.slice(5, 7)}` : ''}</p>
            <p className="mt-2 text-[13px] font-medium text-brand">{r.da_nop ? 'Xem lại' : 'Bắt đầu'} →</p>
          </button>
        ))}
    </div>
  )
}
