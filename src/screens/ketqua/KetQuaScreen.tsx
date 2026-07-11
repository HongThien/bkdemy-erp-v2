// KẾT QUẢ HỌC TẬP — mastery (HS × dạng) SUY ĐỘNG (không lưu). 3 tầng view qua tab:
//   #1 Từng học sinh (QUAN TRỌNG NHẤT — port tab "Dạng bài" V1) · #2 Lớp/Khối (rollup) · #3 Theo dạng (pivot).
// Hiện xây #1; #2/#3 placeholder. Engine src/gami/mastery.js + service src/lib/mastery.ts đã sẵn.
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listHSDangHoc } from '../../lib/tuyensinh'
import { listLop, listHSCuaLop, listLopCuaHS } from '../../lib/nhansu'
import { getMasteryHS, listBuoiHoatDong, getMasteryRollup, getMasteryByDang, getMasteryByChuyenDe, getTongQuanHS, SRC_LABEL, type DangMastery, type DangEval, type BuoiActivity, type HSRollup, type TongQuanHS } from '../../lib/mastery'
import { BuoiDetail } from '../gami/BuoiHocScreen'
import type { TabKey } from '../../lib/gami'
import { tenHienThiDs } from '../../lib/hoten'

// Chỉ môn CÓ KHO mới suy được mastery (khoCuaMon dispatch dai_/khtn_). Anh/Văn chưa có kho.
const MON_CO_KHO = ['Toán', 'KHTN']
const DAYS = [30, 60, 90] as const

const MUC = {
  dat: { label: 'Đạt', pill: 'bg-emerald-100 text-emerald-700 ring-emerald-200', dot: 'text-emerald-600' },
  can_luyen: { label: 'Cần luyện', pill: 'bg-amber-100 text-amber-700 ring-amber-200', dot: 'text-amber-600' },
  yeu: { label: 'Yếu', pill: 'bg-rose-100 text-rose-700 ring-rose-200', dot: 'text-rose-600' },
} as const
const TIN = { cao: 'Tin cao', tb: 'Tin TB', thap: 'Tin thấp' } as const

const fmtShort = (iso: string) => { const d = new Date(iso); return isNaN(+d) ? '' : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) }

type ViewKey = 'hs' | 'raw' | 'lop' | 'dang'
export default function KetQuaScreen() {
  const [view, setView] = useState<ViewKey>('hs')
  // lazy-mount + GIỮ mount (ẩn bằng `hidden`) → đổi tab qua lại KHÔNG mất lựa chọn/kết quả đã tìm.
  const [seen, setSeen] = useState<Record<string, boolean>>({ hs: true })
  const go = (v: ViewKey) => { setView(v); setSeen((s) => (s[v] ? s : { ...s, [v]: true })) }
  const tab = (on: boolean) => `h-8 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Kết quả học tập</span>
        <button onClick={() => go('hs')} className={tab(view === 'hs')}>Từng học sinh</button>
        <button onClick={() => go('raw')} className={tab(view === 'raw')}>Theo buổi (raw)</button>
        <button onClick={() => go('lop')} className={tab(view === 'lop')}>Lớp / Khối</button>
        <button onClick={() => go('dang')} className={tab(view === 'dang')}>Theo dạng</button>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto p-6">
        {seen.hs && <div className={view === 'hs' ? '' : 'hidden'}><PerHocSinh /></div>}
        {seen.raw && <div className={view === 'raw' ? '' : 'hidden'}><RawBuoi /></div>}
        {seen.lop && <div className={view === 'lop' ? '' : 'hidden'}><LopKhoiRollup /></div>}
        {seen.dang && <div className={view === 'dang' ? '' : 'hidden'}><TheoDang /></div>}
      </div>
    </div>
  )
}

// ── #1 TỪNG HỌC SINH: chọn HS (ô tìm / cột lớp trái) → 3 sub-tab Tổng quan · Dạng bài · Lịch sử hoạt động ──
function PerHocSinh() {
  const [mon, setMon] = useState('Toán')
  const [hsId, setHsId] = useState<string | null>(null)
  const [lopId, setLopId] = useState<string | null>(null) // lớp hiển thị ở cột trái
  const [hsOpts, setHsOpts] = useState<Opt[]>([])
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [sub, setSub] = useState<'tongquan' | 'dangbai' | 'lichsu'>('tongquan')

  // Đổi môn: reset + nạp HS + lớp của môn.
  useEffect(() => {
    setHsId(null); setLopId(null)
    listHSDangHoc(mon).then((hs) => setHsOpts(hs.map((h) => ({ id: h.id, label: h.ho_ten, sub: [h.ma_hs, h.khoi && `K${h.khoi}`].filter(Boolean).join(' · ') || undefined })))).catch(() => setHsOpts([]))
    listLop().then((ls) => setLopOpts(ls.filter((l: any) => l.mon === mon).map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))).catch(() => setLopOpts([]))
  }, [mon])

  // Lớp đổi → nạp roster cột trái (để click chuyển HS khỏi phải gõ lại).
  useEffect(() => {
    if (!lopId) { setRoster([]); return }
    listHSCuaLop(lopId).then((rs) => setRoster((rs as any[]).map((r) => ({ id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null })).sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi')))).catch(() => setRoster([]))
  }, [lopId])

  // Chọn HS từ ô TÌM → tự suy LỚP của em (cho môn) → cột trái hiện cả lớp.
  async function pickHS(id: string | null) {
    setHsId(id)
    if (!id) return
    try {
      const gds = await listLopCuaHS(id)
      const g = (gds as any[]).find((x) => x.trang_thai === 'dang_hoc' && x.lop?.mon === mon)
      if (g) setLopId(g.lop_id)
    } catch { /* */ }
  }

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const subBtn = (on: boolean) => `-mb-px border-b-2 px-3 py-2 text-[13px] font-medium transition ${on ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`

  return (
    <>
      {/* Bộ lọc: môn + tìm HS */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-72"><SearchSelect value={hsId} onChange={pickHS} options={hsOpts} placeholder="Tìm học sinh…" avatars /></div>
      </div>

      <div className="flex gap-4">
        {/* CỘT TRÁI: lớp + danh sách HS (click chuyển HS, khỏi gõ lại) */}
        <aside className="w-52 shrink-0">
          <div className="mb-2"><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
          {lopId ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{roster.length} học sinh</div>
              <div className="max-h-[62vh] overflow-auto">
                {(() => { const tenHT = tenHienThiDs(roster.map((r) => r.ho_ten)); return roster.map((r, i) => (
                  <button key={r.id} onClick={() => setHsId(r.id)} title={r.ho_ten}
                    className={`block w-full truncate px-3 py-1.5 text-left text-[13px] ${r.id === hsId ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}>{tenHT[i]}</button>
                )) })()}
                {roster.length === 0 && <p className="px-3 py-2 text-[12px] text-slate-500">Lớp trống.</p>}
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-[12px] text-slate-500">Chọn lớp, hoặc tìm 1 HS để tự hiện danh sách lớp của em.</p>
          )}
        </aside>

        {/* CỘT PHẢI: 3 sub-tab của HS đang chọn */}
        <div className="min-w-0 flex-1">
          {!hsId ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một học sinh (cột trái hoặc ô tìm) để xem kết quả.</div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-1 border-b border-slate-200">
                <button onClick={() => setSub('tongquan')} className={subBtn(sub === 'tongquan')}>Tổng quan</button>
                <button onClick={() => setSub('dangbai')} className={subBtn(sub === 'dangbai')}>Dạng bài</button>
                <button onClick={() => setSub('lichsu')} className={subBtn(sub === 'lichsu')}>Lịch sử hoạt động</button>
              </div>
              {sub === 'tongquan' ? <TongQuanTab hsId={hsId} mon={mon} />
                : sub === 'dangbai' ? <DangBaiTab hsId={hsId} mon={mon} />
                : <ActivityHistory mon={mon} hocSinhId={hsId} />}
            </>
          )}
        </div>
      </div>
    </>
  )
}

// Ô chỉ số Tổng quan.
function StatCard({ label, muted, children }: { label: string; muted?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border p-4 ${muted ? 'border-dashed border-slate-200 bg-slate-50/60' : 'border-slate-200 bg-white'}`}>
      <div className="text-[12px] font-semibold text-slate-500">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}
// Trend ↑/↓ (chênh điểm % 30 ngày gần vs trước). null = chưa đủ data.
function TrendBadge({ delta }: { delta: number | null }) {
  if (delta == null) return null
  const up = delta > 0, flat = delta === 0
  return (
    <span title="so với 30 ngày trước đó" className={`text-[12px] font-bold ${flat ? 'text-slate-400' : up ? 'text-emerald-600' : 'text-rose-600'}`}>
      {flat ? '→' : up ? '↑' : '↓'} {delta > 0 ? '+' : ''}{delta}
    </span>
  )
}

// SUB-TAB TỔNG QUAN: chỉ số tổng kết (% hoàn thành · điểm năng lực[placeholder] · điểm thi) + raw (%ET/%BTVN).
function TongQuanTab({ hsId, mon }: { hsId: string; mon: string }) {
  const [d, setD] = useState<TongQuanHS | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); getTongQuanHS(hsId, mon).then(setD).catch(() => setD(null)).finally(() => setLoading(false)) }, [hsId, mon])
  if (loading) return <p className="text-sm text-slate-500">Đang tính…</p>
  if (!d) return <p className="text-sm text-slate-500">Không tải được.</p>
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Chỉ số tổng kết</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="% hoàn thành bản đồ kiến thức">
            <div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-indigo-700">{d.hoanThanh.total ? `${d.hoanThanh.pct}%` : '—'}</span><TrendBadge delta={d.trend.hoanThanh} /></div>
            {d.hoanThanh.total ? (
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]" title="Số tổng ước tính: đạt×1 + cần luyện×0.5 + yếu×0, chia số dạng đã đo">
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">{d.hoanThanh.dat} đạt</span>
                <span className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700">{d.hoanThanh.can_luyen} cần luyện</span>
                <span className="rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-700">{d.hoanThanh.yeu} yếu</span>
                <span className="text-slate-400">/ {d.hoanThanh.total} dạng đã đo</span>
              </div>
            ) : <div className="mt-0.5 text-[11px] text-slate-400">chưa có dạng nào được đo</div>}
          </StatCard>
          <StatCard label="Điểm năng lực (kỳ vọng)" muted>
            <div className="text-3xl font-bold text-slate-300">—</div>
            <div className="mt-0.5 text-[11px] text-slate-500">Cần cấu trúc đề + đủ dạng đo (gồm Hình) — làm sau</div>
          </StatCard>
          <StatCard label="Điểm thi thực tế">
            <div className="flex gap-5">
              <div><div className="text-2xl font-bold text-slate-800">{d.diemThi.truong ?? '—'}</div><div className="text-[11px] text-slate-500">Trường ({d.diemThi.nTruong})</div></div>
              <div><div className="text-2xl font-bold text-slate-800">{d.diemThi.satHach ?? '—'}</div><div className="text-[11px] text-slate-500">Sát hạch ({d.diemThi.nSatHach})</div></div>
            </div>
          </StatCard>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Chỉ số hoạt động (raw)</h3>
        <div className="grid max-w-2xl grid-cols-3 gap-3">
          <StatCard label="% đúng ET trung bình">
            <div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-emerald-600">{d.pctET != null ? `${d.pctET}%` : '—'}</span><TrendBadge delta={d.trend.et} /></div>
            <div className="mt-0.5 text-[11px] text-slate-500">{d.nET} câu · (Đ + ½C)/số câu</div>
          </StatCard>
          <StatCard label="% đúng MT trung bình">
            <div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-rose-600">{d.pctMT != null ? `${d.pctMT}%` : '—'}</span><TrendBadge delta={d.trend.mt} /></div>
            <div className="mt-0.5 text-[11px] text-slate-500">{d.nMT} câu · giám sát, giống ET</div>
          </StatCard>
          <StatCard label="% đúng BTVN">
            <div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-amber-600">{d.pctBTVN != null ? `${d.pctBTVN}%` : '—'}</span><TrendBadge delta={d.trend.btvn} /></div>
            <div className="mt-0.5 text-[11px] text-slate-500">{d.nBTVN} câu · tham khảo</div>
          </StatCard>
        </div>
      </div>
    </div>
  )
}

// SUB-TAB DẠNG BÀI: bảng mastery per-dạng (cửa sổ ngày + toggle BTVN). Mặc định "Tất cả" để khớp % ở Tổng quan.
function DangBaiTab({ hsId, mon }: { hsId: string; mon: string }) {
  const [days, setDays] = useState<number | null>(null) // null = tất cả (khớp Tổng quan all-time)
  const [btvn, setBtvn] = useState(false)
  const [rows, setRows] = useState<DangMastery[] | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    getMasteryHS(hsId, mon, { includeBTVN: btvn, days: days ?? undefined }).then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [hsId, mon, days, btvn])
  const tally = useMemo(() => {
    const t = { dat: 0, can_luyen: 0, yeu: 0 }
    for (const r of rows ?? []) if (r.mastery) t[r.mastery.muc]++
    return t
  }, [rows])
  const dayBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-medium text-slate-500">Cửa sổ</span>
        <button onClick={() => setDays(null)} className={dayBtn(days === null)}>Tất cả</button>
        {DAYS.map((dv) => <button key={dv} onClick={() => setDays(dv)} className={dayBtn(days === dv)}>{dv} ngày</button>)}
        <label className="ml-1 flex cursor-pointer items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 ring-1 ring-slate-200">
          <input type="checkbox" checked={btvn} onChange={(e) => setBtvn(e.target.checked)} className="accent-indigo-600" />
          Gộp BTVN
        </label>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Đang tính…</p>
      ) : !rows || rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chưa có lần đánh giá nào (môn {mon}{days ? ` trong ${days} ngày` : ''}).</div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px]">
            <Chip n={rows.length} label="dạng đã đo" cls="bg-slate-100 text-slate-600" />
            <Chip n={tally.dat} label="đạt" cls="bg-emerald-100 text-emerald-700" />
            <Chip n={tally.can_luyen} label="cần luyện" cls="bg-amber-100 text-amber-700" />
            <Chip n={tally.yeu} label="yếu" cls="bg-rose-100 text-rose-700" />
            <span className="ml-auto text-[11px] text-slate-500">Đ = 1 · C (chưa đạt) = ½ · S = 0 · điểm = TB 5 lần gần nhất · yếu + mới lên đầu</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <div className="min-w-[760px]">
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <div className="w-[300px] shrink-0">Dạng bài</div>
                <div className="w-24 shrink-0 text-center">Mức</div>
                <div className="w-16 shrink-0 text-center">Điểm</div>
                <div className="w-20 shrink-0 text-center">Độ tin</div>
                <div className="min-w-[344px] flex-1">Lịch sử gần đây (mới → cũ)</div>
              </div>
              {rows.map((d) => <DangRow key={d.ma_dang} d={d} />)}
            </div>
          </div>
          <Legend />
        </>
      )}
    </>
  )
}

function Chip({ n, label, cls }: { n: number; label: string; cls: string }) {
  return <span className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${cls}`}><b>{n}</b> {label}</span>
}

function DangRow({ d }: { d: DangMastery }) {
  const m = d.mastery
  const muc = m ? MUC[m.muc] : null
  const recent = d.evals.slice(0, 10) // mới → cũ
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0 hover:bg-indigo-50/30">
      <div className="w-[300px] shrink-0">
        <p className="text-[13px] font-medium leading-snug text-slate-800">{d.ten_dang}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-500"><span className="font-mono">{d.ma_dang}</span>{d.ten_chuyen_de && <span> · {d.ten_chuyen_de}</span>}</p>
      </div>
      <div className="w-24 shrink-0 text-center">
        {muc ? <span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1 ${muc.pill}`}>{muc.label}</span> : <span className="text-[12px] text-slate-400">—</span>}
      </div>
      <div className="w-16 shrink-0 text-center">
        <span className={`font-mono text-sm font-bold ${muc?.dot ?? 'text-slate-500'}`}>{m ? m.score.toFixed(2) : '—'}</span>
      </div>
      <div className="w-20 shrink-0 text-center">
        <span className={`text-[11px] font-medium ${m?.tin === 'cao' ? 'text-slate-600' : m?.tin === 'tb' ? 'text-slate-500' : 'text-amber-500'}`}>{m ? TIN[m.tin] : '—'}</span>
        <span className="ml-1 text-[10px] text-slate-400">n={m?.n ?? 0}</span>
      </div>
      <div className="flex min-w-[344px] flex-1 gap-1.5 overflow-hidden">
        {recent.map((e, i) => <Slot key={i} e={e} />)}
        {recent.length === 0 && <span className="text-[12px] text-slate-400">—</span>}
      </div>
    </div>
  )
}

// 1 lần đo: chấm màu (✓ đạt / ◐ nửa / ✗ sai) + nguồn + ngày.
function Slot({ e }: { e: DangEval }) {
  const icon = e.value >= 1 ? '✓' : e.value > 0 ? '◐' : '✗'
  const cls = e.value >= 1 ? 'bg-emerald-500/15 text-emerald-600' : e.value > 0 ? 'bg-amber-500/15 text-amber-600' : 'bg-rose-500/15 text-rose-600'
  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-0.5" title={`${SRC_LABEL[e.src]} · ${fmtShort(e.t)} · ${e.value}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ${cls}`}>{icon}</span>
      <span className="text-[10px] font-bold leading-none text-slate-700">{SRC_LABEL[e.src]}</span>
      <span className="text-[9px] font-medium leading-none text-slate-500">{fmtShort(e.t)}</span>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
      <span className="flex items-center gap-1"><span className="text-emerald-600">✓</span> đúng (1)</span>
      <span className="flex items-center gap-1"><span className="text-amber-600">◐</span> chưa đạt (½)</span>
      <span className="flex items-center gap-1"><span className="text-rose-600">✗</span> sai (0)</span>
      <span className="text-slate-400">|</span>
      <span>Nguồn: IG = chấm bài trên lớp · ET = kiểm tra cuối giờ · MT = kiểm tra tháng · ĐG = đánh giá GV · BT = bổ trợ tự luyện · BTVN = bài tập về nhà (tham khảo)</span>
    </div>
  )
}

// ── RAW · THEO HOẠT ĐỘNG: mỗi buổi TÁCH thành nhiều thẻ (ET/BTVN/Chấm bài/Đánh giá riêng biệt) ──
// Thùy: "ET 22/06 là 1 card, BTVN 22/06 card khác. Click card nào chỉ hiện đúng hoạt động đó" → đỡ click.
type ActKey = 'ingame' | 'et' | 'danhgia' | 'btvn' | 'mt'
const ACTS: { key: ActKey; flag: 'chamBai' | 'et' | 'danhGia' | 'btvn' | 'mt'; tab: TabKey; label: string; pill: string; ring: string }[] = [
  { key: 'ingame', flag: 'chamBai', tab: 'ingame', label: 'Chấm bài', pill: 'bg-sky-100 text-sky-700', ring: 'border-sky-200' },
  { key: 'et', flag: 'et', tab: 'et', label: 'ET', pill: 'bg-indigo-100 text-indigo-700', ring: 'border-indigo-200' },
  { key: 'danhgia', flag: 'danhGia', tab: 'danhgia', label: 'Đánh giá', pill: 'bg-violet-100 text-violet-700', ring: 'border-violet-200' },
  { key: 'btvn', flag: 'btvn', tab: 'btvn', label: 'BTVN', pill: 'bg-amber-100 text-amber-700', ring: 'border-amber-200' },
  { key: 'mt', flag: 'mt', tab: 'mt', label: 'MT', pill: 'bg-rose-100 text-rose-700', ring: 'border-rose-200' },
]
type RawLoai = 'all' | ActKey
const LOAI_TAB: { key: RawLoai; label: string }[] = [
  { key: 'all', label: 'Toàn bộ' }, { key: 'ingame', label: 'Chấm bài' }, { key: 'et', label: 'ET' },
  { key: 'danhgia', label: 'Đánh giá' }, { key: 'btvn', label: 'BTVN' }, { key: 'mt', label: 'MT' },
]
const BUOI_LOAI_LABEL: Record<string, string> = { thuong: 'Buổi thường', bu: 'Buổi bù', bo_tro_yeu: 'Bổ trợ yếu', bo_tro_duoi: 'Bổ trợ đuổi' }
// Ngày tách 2 phần để làm NỔI BẬT ở cuối card (ngày to · thứ nhỏ).
const fmtNgayParts = (iso: string) => {
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(+d)) return { thu: '', date: iso }
  return { thu: d.toLocaleDateString('vi-VN', { weekday: 'long' }), date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
}

type ActCard = { key: string; b: BuoiActivity; act: typeof ACTS[number] }

// LÕI lịch sử hoạt động: nạp buổi theo scope → tách thẻ/hoạt động + toggle loại + popup read-only.
// Dùng CHUNG: tab "Theo buổi" (scope LỚP) và sub-tab "Lịch sử hoạt động" của 1 HS (scope hocSinhId).
function ActivityHistory({ mon, lopId, hocSinhId }: { mon: string; lopId?: string | null; hocSinhId?: string | null }) {
  const [loai, setLoai] = useState<RawLoai>('all')
  const [rows, setRows] = useState<BuoiActivity[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState<{ buoiId: string; tab: TabKey } | null>(null)

  useEffect(() => {
    if (!lopId && !hocSinhId) { setRows(null); return }
    setLoading(true)
    listBuoiHoatDong({ mon, lopId, hocSinhId }).then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [mon, lopId, hocSinhId])

  // TÁCH mỗi buổi → 1 thẻ / hoạt động đã chốt. rows đã xếp ngày giảm dần.
  const shown = useMemo(() => {
    const out: ActCard[] = []
    for (const b of rows ?? []) {
      for (const a of ACTS) {
        if (!b[a.flag]) continue
        if (loai !== 'all' && a.key !== loai) continue
        out.push({ key: b.id + ':' + a.key, b, act: a })
      }
    }
    return out
  }, [rows, loai])

  const loaiBtn = (on: boolean) => `h-7 rounded-full px-3.5 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {LOAI_TAB.map((t) => <button key={t.key} onClick={() => setLoai(t.key)} className={loaiBtn(loai === t.key)}>{t.label}</button>)}
        {rows && <span className="ml-1 text-[12px] text-slate-500">{shown.length} hoạt động</span>}
      </div>

      {!lopId && !hocSinhId ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn phạm vi để xem lịch sử hoạt động.</div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Không có hoạt động nào khớp bộ lọc.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((c) => <ActivityCard key={c.key} c={c} onOpen={() => setOpen({ buoiId: c.b.id, tab: c.act.tab })} />)}
        </div>
      )}

      {/* Portal ra document.body để THOÁT #root{zoom:1.15} (nếu không, h/w bị phóng 1.15× → tràn màn hình). */}
      {open && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setOpen(null)}>
          <div className="flex h-[85vh] max-h-[720px] w-[920px] max-w-[94vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Read-only · CHỈ tab hoạt động được bấm · onlyHsId = HS đang xem (không thì cả lớp). */}
            <BuoiDetail id={open.buoiId} onClose={() => setOpen(null)} canManage={false} tabs={[open.tab]} initialTab={open.tab} onlyHsId={hocSinhId} />
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

// Tab "Theo buổi (raw)" — CHỈ lọc theo LỚP (lọc theo HS đã chuyển vào "Từng học sinh › Lịch sử hoạt động").
function RawBuoi() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  useEffect(() => {
    setLopId(null)
    listLop().then((ls) => setLopOpts(ls.filter((l: any) => l.mon === mon).map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))).catch(() => setLopOpts([]))
  }, [mon])
  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-56"><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
      </div>
      {!lopId
        ? <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một lớp để xem lịch sử hoạt động của lớp.</div>
        : <ActivityHistory mon={mon} lopId={lopId} />}
    </>
  )
}

// Card HOẠT ĐỘNG: dài hết dòng, dẹt — loại hoạt động (danh tính) ở ĐẦU, ngày NỔI BẬT ở CUỐI.
function ActivityCard({ c, onOpen }: { c: ActCard; onOpen: () => void }) {
  const { b, act } = c
  const done = b.trang_thai === 'hoan_tat'
  const { thu, date } = fmtNgayParts(b.ngay)
  return (
    <button onClick={onOpen} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md">
      {/* loại hoạt động = danh tính thẻ */}
      <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[12px] font-bold ${act.pill} ${act.ring}`}>{act.label}</span>
      {/* lớp + mã buổi */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-slate-800">{b.ten_lop ?? (BUOI_LOAI_LABEL[b.loai] ?? b.loai)}</span>
          {b.loai !== 'thuong' && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{BUOI_LOAI_LABEL[b.loai] ?? b.loai}</span>}
        </div>
        {b.ma_buoi && <div className="mt-0.5 font-mono text-[10px] text-slate-500">{b.ma_buoi}</div>}
      </div>
      {/* trạng thái */}
      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{done ? 'Hoàn tất' : 'Đang mở'}</span>
      {/* ngày NỔI BẬT */}
      <div className="w-24 shrink-0 border-l border-slate-100 pl-3 text-right">
        <div className="text-[15px] font-bold tabular-nums text-slate-700">{date}</div>
        <div className="text-[11px] capitalize text-slate-500">{thu}</div>
      </div>
    </button>
  )
}

// ── #2 LỚP / KHỐI: mỗi HS 1 thanh 100% (bộ nhớ iPhone) — xanh Đạt · vàng Cần luyện · đỏ Yếu ──
type SortKey = 'yeu' | 'can_luyen' | 'dat' | 'ten'
const HE_OPTS: Opt[] = [{ id: 'S', label: 'Hệ S' }, { id: 'A', label: 'Hệ A' }, { id: 'B', label: 'Hệ B' }, { id: 'C', label: 'Hệ C' }]
function LopKhoiRollup() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [khoi, setKhoi] = useState<string | null>(null)
  const [he, setHe] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [khoiOpts, setKhoiOpts] = useState<Opt[]>([])
  const [rows, setRows] = useState<HSRollup[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState<SortKey>('yeu')

  // Lớp + khối theo môn (đổi môn: reset).
  useEffect(() => {
    setLopId(null); setKhoi(null); setHe(null); setRows(null)
    listLop().then((ls) => {
      const mine = ls.filter((l: any) => l.mon === mon)
      setLopOpts(mine.map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))
      const ks = [...new Set(mine.map((l: any) => l.khoi).filter(Boolean))].sort((a: any, b: any) => String(a).localeCompare(String(b), 'vi', { numeric: true }))
      setKhoiOpts(ks.map((k: any) => ({ id: String(k), label: `Khối ${k}` })))
    }).catch(() => { setLopOpts([]); setKhoiOpts([]) })
  }, [mon])

  useEffect(() => {
    if (!lopId && !khoi && !he) { setRows(null); return }
    setLoading(true)
    getMasteryRollup({ mon, lopId, khoi: lopId ? null : khoi, he: (lopId || khoi) ? null : he }).then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [mon, lopId, khoi, he])

  const shown = useMemo(() => {
    const r = [...(rows ?? [])]
    if (sort === 'ten') r.sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
    else {
      const ratio = (h: HSRollup) => (h.total ? h[sort] / h.total : -1) // theo % (chưa-đo → cuối)
      r.sort((a, b) => (ratio(b) - ratio(a)) || a.ho_ten.localeCompare(b.ho_ten, 'vi'))
    }
    return r
  }, [rows, sort])

  const showLop = !lopId && (!!khoi || !!he) // khối/hệ span nhiều lớp → hiện tên lớp mỗi HS
  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const sortBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-48"><SearchSelect value={lopId} onChange={(v) => { setLopId(v); if (v) { setKhoi(null); setHe(null) } }} options={lopOpts} placeholder="Theo lớp…" /></div>
        <span className="text-[12px] text-slate-400">·</span>
        <div className="w-36"><SearchSelect value={khoi} onChange={(v) => { setKhoi(v); if (v) { setLopId(null); setHe(null) } }} options={khoiOpts} placeholder="Theo khối…" /></div>
        <span className="text-[12px] text-slate-400">·</span>
        <div className="w-36"><SearchSelect value={he} onChange={(v) => { setHe(v); if (v) { setLopId(null); setKhoi(null) } }} options={HE_OPTS} placeholder="Theo hệ…" /></div>
      </div>

      {!lopId && !khoi && !he ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một lớp / khối / hệ để xem tổng quan.</div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Đang tính…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Lớp/khối này chưa có học sinh đang học.</div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="rounded bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600">{shown.length} học sinh</span>
            <span className="ml-1 text-slate-500">Sắp xếp:</span>
            <button onClick={() => setSort('yeu')} className={sortBtn(sort === 'yeu')}>Yếu nhiều</button>
            <button onClick={() => setSort('can_luyen')} className={sortBtn(sort === 'can_luyen')}>Cần luyện</button>
            <button onClick={() => setSort('dat')} className={sortBtn(sort === 'dat')}>Đạt nhiều</button>
            <button onClick={() => setSort('ten')} className={sortBtn(sort === 'ten')}>Tên</button>
            <span className="ml-auto flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Đạt</span>
              <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" /> Cần luyện</span>
              <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500" /> Yếu</span>
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {(() => { const tenHT = tenHienThiDs(shown.map((h) => h.ho_ten)); return shown.map((h, i) => <RollupRow key={h.hoc_sinh_id} h={h} ten={tenHT[i]} showLop={showLop} />) })()}
          </div>
        </>
      )}
    </>
  )
}

function RollupSeg({ n, total, cls, label }: { n: number; total: number; cls: string; label: string }) {
  if (n <= 0) return null
  const p = Math.round((n / total) * 100)
  const wPct = (n / total) * 100
  return (
    <div style={{ width: `${wPct}%` }} className={`flex items-center justify-center overflow-hidden ${cls}`} title={`${label}: ${n} dạng (${p}%)`}>
      {/* chỉ hiện chữ khi đủ rộng (≈12%); hẹp hơn thì để trống, hover xem tooltip */}
      {wPct >= 12 && <span className="whitespace-nowrap px-1 text-[11px] font-semibold text-white">{p}% ({n})</span>}
    </div>
  )
}
function RollupRow({ h, ten, showLop }: { h: HSRollup; ten: string; showLop: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50">
      <div className="w-52 shrink-0 truncate">
        <span className="text-[13px] font-medium text-slate-800">{ten}</span>
        {showLop && h.lop && <span className="ml-1.5 text-[11px] text-slate-500">{h.lop}</span>}
      </div>
      {/* thanh dày ~nửa màn, số % (n) HIỆN TRONG từng màu */}
      <div className="flex h-7 w-[440px] max-w-[48%] shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
        {h.total === 0 ? (
          <div className="flex w-full items-center justify-center text-[11px] text-slate-500">chưa đo</div>
        ) : (
          <>
            <RollupSeg n={h.dat} total={h.total} cls="bg-emerald-500" label="Đạt" />
            <RollupSeg n={h.can_luyen} total={h.total} cls="bg-amber-400" label="Cần luyện" />
            <RollupSeg n={h.yeu} total={h.total} cls="bg-rose-500" label="Yếu" />
          </>
        )}
      </div>
      {/* tổng số dạng đã đo (mẫu số) — cạnh thanh */}
      <div className="text-[12px] text-slate-500">
        <b className="text-slate-700">{h.total}</b> dạng
      </div>
    </div>
  )
}

// ── #3 THEO DẠNG / CHUYÊN ĐỀ: pivot — mỗi dạng (hoặc chuyên đề) 1 thanh phân bố HS → chỗ nào lớp yếu nhất ──
type PivotItem = { key: string; title: string; sub?: string; dat: number; can_luyen: number; yeu: number; total: number }
function TheoDang() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [khoi, setKhoi] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [khoiOpts, setKhoiOpts] = useState<Opt[]>([])
  const [groupBy, setGroupBy] = useState<'dang' | 'chuyende'>('dang')
  const [rows, setRows] = useState<PivotItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState<SortKey>('yeu')

  useEffect(() => {
    setLopId(null); setKhoi(null); setRows(null)
    listLop().then((ls) => {
      const mine = ls.filter((l: any) => l.mon === mon)
      setLopOpts(mine.map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))
      const ks = [...new Set(mine.map((l: any) => l.khoi).filter(Boolean))].sort((a: any, b: any) => String(a).localeCompare(String(b), 'vi', { numeric: true }))
      setKhoiOpts(ks.map((k: any) => ({ id: String(k), label: `Khối ${k}` })))
    }).catch(() => { setLopOpts([]); setKhoiOpts([]) })
  }, [mon])

  useEffect(() => {
    if (!lopId && !khoi) { setRows(null); return }
    setLoading(true)
    const scope = { mon, lopId, khoi: lopId ? null : khoi }
    const p = groupBy === 'dang'
      ? getMasteryByDang(scope).then((rs) => rs.map((d): PivotItem => ({ key: d.ma_dang, title: d.ten_dang, sub: [d.ma_dang, d.ten_chuyen_de].filter(Boolean).join(' · '), dat: d.dat, can_luyen: d.can_luyen, yeu: d.yeu, total: d.total })))
      : getMasteryByChuyenDe(scope).then((rs) => rs.map((c): PivotItem => ({ key: c.ten_chuyen_de, title: c.ten_chuyen_de, dat: c.dat, can_luyen: c.can_luyen, yeu: c.yeu, total: c.total })))
    p.then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [mon, lopId, khoi, groupBy])

  const shown = useMemo(() => {
    const r = [...(rows ?? [])]
    if (sort === 'ten') r.sort((a, b) => a.title.localeCompare(b.title, 'vi'))
    else {
      const ratio = (d: PivotItem) => (d.total ? d[sort] / d.total : -1)
      r.sort((a, b) => (ratio(b) - ratio(a)) || a.title.localeCompare(b.title, 'vi'))
    }
    return r
  }, [rows, sort])

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const sortBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  const gbBtn = (on: boolean) => `h-7 rounded-md px-3 text-[12px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  const donVi = groupBy === 'dang' ? 'dạng' : 'chuyên đề'

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-52"><SearchSelect value={lopId} onChange={(v) => { setLopId(v); if (v) setKhoi(null) }} options={lopOpts} placeholder="Theo lớp…" /></div>
        <span className="text-[12px] text-slate-400">hoặc</span>
        <div className="w-40"><SearchSelect value={khoi} onChange={(v) => { setKhoi(v); if (v) setLopId(null) }} options={khoiOpts} placeholder="Theo khối…" /></div>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setGroupBy('dang')} className={gbBtn(groupBy === 'dang')}>Dạng</button>
          <button onClick={() => setGroupBy('chuyende')} className={gbBtn(groupBy === 'chuyende')}>Chuyên đề</button>
        </div>
      </div>

      {!lopId && !khoi ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một lớp hoặc khối để xem {donVi} nào yếu nhất.</div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Đang tính…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Lớp/khối này chưa có {donVi} nào được đo.</div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="rounded bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600">{shown.length} {donVi}</span>
            <span className="ml-1 text-slate-500">Sắp xếp:</span>
            <button onClick={() => setSort('yeu')} className={sortBtn(sort === 'yeu')}>Yếu nhiều</button>
            <button onClick={() => setSort('can_luyen')} className={sortBtn(sort === 'can_luyen')}>Cần luyện</button>
            <button onClick={() => setSort('dat')} className={sortBtn(sort === 'dat')}>Đạt nhiều</button>
            <button onClick={() => setSort('ten')} className={sortBtn(sort === 'ten')}>Tên</button>
            <span className="ml-auto flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Đạt</span>
              <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" /> Cần luyện</span>
              <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500" /> Yếu</span>
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {shown.map((it) => <PivotRow key={it.key} it={it} />)}
          </div>
        </>
      )}
    </>
  )
}

function PivotRow({ it }: { it: PivotItem }) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50">
      <div className="w-72 shrink-0">
        <p className="truncate text-[13px] font-medium text-slate-800">{it.title}</p>
        {it.sub && <p className="mt-0.5 truncate text-[11px] text-slate-500">{it.sub}</p>}
      </div>
      {/* thanh: phân bố HS đạt/cần-luyện/yếu */}
      <div className="flex h-7 w-[380px] max-w-[42%] shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
        <RollupSeg n={it.dat} total={it.total} cls="bg-emerald-500" label="HS đạt" />
        <RollupSeg n={it.can_luyen} total={it.total} cls="bg-amber-400" label="HS cần luyện" />
        <RollupSeg n={it.yeu} total={it.total} cls="bg-rose-500" label="HS yếu" />
      </div>
      <div className="text-[12px] text-slate-500"><b className="text-slate-700">{it.total}</b> HS</div>
    </div>
  )
}
