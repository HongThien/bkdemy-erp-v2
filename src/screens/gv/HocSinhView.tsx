// HocSinhView — tab "Học sinh" app GV (PLAN-app-gv.md §1#3): tình hình học tập CHI TIẾT từng HS
// của lớp mình phụ trách (chốt ④ — khoá theo phan_cong_lop vai 'gv'). Port thu gọn từ
// KetQuaScreen view ① (ERP): Tổng quan (getTongQuanHS) + Dạng bài (fn_mastery_cells qua
// getMasteryHS; timeline CÓ nguồn ĐG — GV thấy đánh giá mình nhập, dù dg KHÔNG vào mastery).
// MT: KHÔNG "trung bình" — điểm THEO THÁNG + rank khối nhỏ bên cạnh (CEO 31/08, chốt ①);
// nguồn = fn_rank_diem_mt_lop (điểm của em đi theo em, cửa sổ 25→10).
import { useEffect, useState } from 'react'
import type { Lop } from '../../lib/nhansu'
import { listHSCuaLop } from '../../lib/nhansu'
import {
  getMasteryHS, getHinhMasteryHS, getTongQuanHS, SRC_LABEL,
  type DangMastery, type HinhMastery, type TongQuanHS, type BucketPct, type ActPct,
} from '../../lib/mastery'
import { rankDiemMTLop, type RankMTRow } from '../../lib/report'
import { homNayVN } from '../../lib/tuan'

const TIN_LBL: Record<string, string> = { cao: 'cao', tb: 'TB', thap: 'thấp' }
const MUC_UI: Record<string, { lbl: string; cls: string }> = {
  dat: { lbl: 'Đạt', cls: 'bg-emerald-100 text-emerald-700' },
  can_luyen: { lbl: 'Cần luyện', cls: 'bg-amber-100 text-amber-700' },
  yeu: { lbl: 'Yếu', cls: 'bg-rose-100 text-rose-700' },
}
const EVAL_SYM = (v: number) => (v === 1 ? '✓' : v === 0.5 ? '◐' : '✗')
const EVAL_CLS = (v: number) => (v === 1 ? 'text-emerald-600' : v === 0.5 ? 'text-amber-600' : 'text-rose-600')

function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

type HSRow = { id: string; ho_ten: string; ma_hs: string | null }

export default function HocSinhView({ lops }: { lops: Lop[] }) {
  const [lopId, setLopId] = useState<string | null>(lops[0]?.id ?? null)
  const [roster, setRoster] = useState<HSRow[]>([])
  const [hsId, setHsId] = useState<string | null>(null)
  const lop = lops.find((l) => l.id === lopId) ?? null

  useEffect(() => { (async () => {
    setRoster([]); setHsId(null)
    if (!lopId) return
    const rows = await listHSCuaLop(lopId).catch(() => [])
    const hs = rows.map((r: any) => r.hoc_sinh).filter(Boolean)
      .map((h: any) => ({ id: h.id, ho_ten: h.ho_ten, ma_hs: h.ma_hs }))
      .sort((a: HSRow, b: HSRow) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
    setRoster(hs)
  })() }, [lopId])

  if (!lops.length) return <Trong text="Bạn chưa được phân công lớp nào (vai giáo viên)." />

  const hs = roster.find((r) => r.id === hsId) ?? null
  return (
    <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
      <ChonLop lops={lops} lopId={lopId} onPick={setLopId} />
      {!hs ? (
        <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {roster.length === 0 && <p className="text-[13px] text-slate-400">Đang tải danh sách lớp…</p>}
          {roster.map((r) => (
            <button key={r.id} onClick={() => setHsId(r.id)}
              className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white px-3 py-2.5 text-left shadow-sm active:bg-slate-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-[13px] font-bold text-green-700">{r.ho_ten.trim().split(/\s+/).pop()?.charAt(0) ?? '?'}</span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-slate-800">{r.ho_ten}</span>
              {r.ma_hs && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] text-slate-500">{r.ma_hs}</span>}
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </div>
      ) : lop && <ChiTietHS hs={hs} lop={lop} onBack={() => setHsId(null)} />}
    </div>
  )
}

function ChonLop({ lops, lopId, onPick }: { lops: Lop[]; lopId: string | null; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {lops.map((l) => (
        <button key={l.id} onClick={() => onPick(l.id)}
          className={`min-h-[36px] rounded-full px-3.5 text-[13px] font-semibold transition ${l.id === lopId ? 'bg-green-600 text-white' : 'border border-slate-200 bg-white text-slate-600 active:bg-slate-100'}`}>
          {l.ten_lop}<span className="ml-1 font-normal opacity-60">{l.mon}</span>
        </button>
      ))}
    </div>
  )
}

function Trong({ text }: { text: string }) {
  return <p className="mx-auto max-w-[1000px] px-3 pt-4 text-center text-[13px] text-slate-400">{text}</p>
}

// ── Chi tiết 1 HS: 2 sub-tab (Tổng quan / Dạng bài) — cửa sổ mastery mặc định TẤT CẢ (khớp ERP) ──
function ChiTietHS({ hs, lop, onBack }: { hs: HSRow; lop: Lop; onBack: () => void }) {
  const [sub, setSub] = useState<'tq' | 'dang'>('tq')
  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center gap-2">
        <button onClick={onBack} className="rounded-lg px-2 py-1.5 text-[13.5px] font-semibold text-green-700 active:bg-green-50">‹ {lop.ten_lop}</button>
        <p className="min-w-0 flex-1 truncate text-center text-[14.5px] font-bold text-slate-800">{hs.ho_ten}</p>
        <span className="w-[64px]" />
      </div>
      <div className="mb-3 flex gap-1.5">
        {([['tq', 'Tổng quan'], ['dang', 'Dạng bài']] as const).map(([k, lbl]) => (
          <button key={k} onClick={() => setSub(k)}
            className={`min-h-[36px] flex-1 rounded-xl text-[13px] font-semibold ${sub === k ? 'bg-green-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>{lbl}</button>
        ))}
      </div>
      {sub === 'tq' ? <TongQuanTab hsId={hs.id} lop={lop} /> : <DangBaiTab hsId={hs.id} mon={lop.mon} />}
    </div>
  )
}

function TongQuanTab({ hsId, lop }: { hsId: string; lop: Lop }) {
  const [tq, setTq] = useState<TongQuanHS | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setTq(null); setErr(null); getTongQuanHS(hsId, lop.mon).then(setTq).catch((e) => setErr(e.message ?? String(e))) }, [hsId, lop.mon])
  if (err) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
  if (!tq) return <p className="text-[13px] text-slate-400">Đang tính…</p>
  const laToan = lop.mon === 'Toán'
  return (
    <div className="flex flex-col gap-3">
      {/* ① Hoàn thành bản đồ kiến thức — mỗi card 2 nửa ET+MT / +BTVN (khớp ERP) */}
      <div>
        <p className="mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Hoàn thành bản đồ kiến thức</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <HoanThanhCardUI ten="Toàn bộ" card={tq.hoanThanh.toanBo} trend={tq.trend.hoanThanhToanBo} />
          {laToan && <HoanThanhCardUI ten="Đại số · Cơ bản" card={tq.hoanThanh.daiCoBan} />}
          {laToan && <HoanThanhCardUI ten="Đại số · Nâng cao" card={tq.hoanThanh.daiNangCao} />}
          {laToan && <HoanThanhCardUI ten="Hình học · Cơ bản" card={tq.hoanThanh.hinhCoBan} />}
          {laToan && <HoanThanhCardUI ten="Hình học · Nâng cao" card={tq.hoanThanh.hinhNangCao} />}
        </div>
      </div>
      {/* ② Chỉ số hoạt động — % đúng câu, 3 nguồn × CB/NC */}
      <div>
        <p className="mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Chỉ số hoạt động (% câu đúng)</p>
        <div className="grid grid-cols-3 gap-2">
          <ActCard ten="ET cơ bản" a={tq.hoatDong.etCoBan} />
          <ActCard ten="ET nâng cao" a={tq.hoatDong.etNangCao} />
          <ActCard ten="MT cơ bản" a={tq.hoatDong.mtCoBan} />
          <ActCard ten="BTVN cơ bản" a={tq.hoatDong.btvnCoBan} thamKhao />
          <ActCard ten="BTVN nâng cao" a={tq.hoatDong.btvnNangCao} thamKhao />
          <ActCard ten="MT nâng cao" a={tq.hoatDong.mtNangCao} />
        </div>
      </div>
      {/* ③ MT theo THÁNG + rank khối (CEO 31/08 — không "trung bình") */}
      <MTTheoThang hsId={hsId} lop={lop} />
    </div>
  )
}

function HoanThanhCardUI({ ten, card, trend }: { ten: string; card: { etMt: BucketPct; coBTVN: BucketPct }; trend?: number | null }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
      <p className="mb-1 flex items-center gap-1.5 text-[12.5px] font-bold text-slate-700">{ten}
        {trend != null && <span className={`text-[11px] font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}</span>}
      </p>
      <NuaHoanThanh nhan="ET + MT" b={card.etMt} />
      <NuaHoanThanh nhan="+ BTVN/Bổ trợ" b={card.coBTVN} nhat />
    </div>
  )
}
function NuaHoanThanh({ nhan, b, nhat }: { nhan: string; b: BucketPct; nhat?: boolean }) {
  return (
    <div className={`flex items-center gap-2 py-0.5 ${nhat ? 'opacity-70' : ''}`}>
      <span className="w-[86px] shrink-0 text-[10.5px] font-medium text-slate-400">{nhan}</span>
      <span className="text-[16px] font-extrabold text-slate-800">{b.total ? `${b.pct}%` : '—'}</span>
      {b.total > 0 && (
        <span className="flex gap-1 text-[10.5px] font-semibold">
          <span className="rounded bg-emerald-50 px-1 text-emerald-700">{b.dat}</span>
          <span className="rounded bg-amber-50 px-1 text-amber-700">{b.can_luyen}</span>
          <span className="rounded bg-rose-50 px-1 text-rose-700">{b.yeu}</span>
          <span className="text-slate-400">/{b.total} dạng</span>
        </span>
      )}
    </div>
  )
}
function ActCard({ ten, a, thamKhao }: { ten: string; a: ActPct; thamKhao?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-2.5 text-center shadow-sm">
      <p className={`text-[17px] font-extrabold ${a.pct == null ? 'text-slate-300' : a.pct >= 80 ? 'text-emerald-600' : a.pct >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{a.pct == null ? '—' : `${a.pct}%`}</p>
      <p className="text-[10px] font-semibold text-slate-400">{ten}{thamKhao ? ' ·tk' : ''} {a.n ? `(${a.n})` : ''}</p>
    </div>
  )
}

// MT theo tháng: mỗi tháng 1 hàng — điểm to + rank khối nhỏ bên cạnh. Nguồn fn_rank_diem_mt_lop
// (1 call/tháng, lấy dòng của HS này). Chưa thi trong cửa sổ → điểm "—" (rank vẫn có, luật 0đ riêng xếp hạng).
function MTTheoThang({ hsId, lop }: { hsId: string; lop: Lop }) {
  const ymNay = homNayVN().slice(0, 7)
  const yms = [0, -1, -2, -3].map((n) => ymCong(ymNay, n))
  const [rows, setRows] = useState<Map<string, RankMTRow | null> | null>(null)
  useEffect(() => { (async () => {
    setRows(null)
    const out = new Map<string, RankMTRow | null>()
    await Promise.all(yms.map(async (ym) => {
      const m = await rankDiemMTLop(lop.id, lop.mon, ym).catch(() => null)
      out.set(ym, m?.get(hsId) ?? null)
    }))
    setRows(out)
  })() }, [hsId, lop.id]) // eslint-disable-line
  return (
    <div>
      <p className="mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Điểm MT theo tháng · rank trong khối</p>
      <div className="rounded-2xl border border-slate-200/70 bg-white p-1 shadow-sm">
        {!rows ? <p className="p-2.5 text-[13px] text-slate-400">Đang tải…</p> : yms.map((ym) => {
          const r = rows.get(ym)
          return (
            <div key={ym} className="flex items-center gap-2.5 border-t border-slate-100 px-2.5 py-2 first:border-0">
              <span className="w-[74px] shrink-0 text-[12px] font-semibold text-slate-500">Tháng {ym.slice(5, 7)}/{ym.slice(0, 4)}</span>
              <span className={`text-[18px] font-extrabold ${r?.tb == null ? 'text-slate-300' : r.tb >= 8 ? 'text-emerald-600' : r.tb >= 6.5 ? 'text-amber-600' : 'text-rose-600'}`}>{r?.tb == null ? '—' : r.tb}</span>
              {r?.tb != null && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500">#{r.rankNow}/{r.rankTotal} khối</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Dạng bài: bảng mastery per-dạng + Hình (khi Toán). Timeline nguồn ĐG hiện rõ. ──
function DangBaiTab({ hsId, mon }: { hsId: string; mon: string }) {
  const [rows, setRows] = useState<DangMastery[] | null>(null)
  const [hinh, setHinh] = useState<HinhMastery[]>([])
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { (async () => {
    setRows(null); setErr(null)
    try {
      const [d, h] = await Promise.all([
        getMasteryHS(hsId, mon),
        mon === 'Toán' ? getHinhMasteryHS(hsId).catch(() => [] as HinhMastery[]) : Promise.resolve([] as HinhMastery[]),
      ])
      setRows(d); setHinh(h)
    } catch (e: any) { setErr(e.message ?? String(e)) }
  })() }, [hsId, mon])
  if (err) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
  if (!rows) return <p className="text-[13px] text-slate-400">Đang tính mastery…</p>
  const daDo = rows.filter((r) => r.mastery)
  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-[11.5px] text-slate-400">
        {daDo.length}/{rows.length} dạng đã đo · nguồn ✓/◐/✗: ET/MT vào điểm — <b>ĐG (đánh giá của bạn) hiện tham khảo, không vào mastery</b>.</p>
      {rows.map((r) => <DangRow key={r.ma_dang} ten={r.ten_dang} phu={r.ten_chuyen_de} m={r.mastery} evals={r.evals} />)}
      {hinh.length > 0 && (
        <>
          <p className="mt-1 px-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Hình học (mô hình)</p>
          {hinh.map((r) => <DangRow key={r.hinh_baitoan_id} ten={r.ma} phu={r.ten_mo_hinh} m={r.mastery} evals={r.evals} />)}
        </>
      )}
    </div>
  )
}

function DangRow({ ten, phu, m, evals }: { ten: string; phu: string; m: DangMastery['mastery']; evals: DangMastery['evals'] }) {
  const ui = m ? MUC_UI[m.muc] : null
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-slate-800">{ten}</p>
          <p className="truncate text-[10.5px] text-slate-400">{phu}</p>
        </div>
        {ui
          ? <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${ui.cls}`}>{ui.lbl} {m!.score.toFixed(2)}</span>
          : <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-400">chưa đo</span>}
        {m && <span className="shrink-0 text-[10px] text-slate-400">tin {TIN_LBL[m.tin]} · n={m.n}</span>}
      </div>
      {evals.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
          {evals.slice(0, 8).map((e, i) => (
            <span key={i} className="text-[10.5px] text-slate-400">
              <b className={EVAL_CLS(e.value)}>{EVAL_SYM(e.value)}</b> {SRC_LABEL[e.src]} {e.t.slice(5, 10).split('-').reverse().join('/')}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
