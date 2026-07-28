// KẾT QUẢ HỌC TẬP — mastery (HS × dạng) SUY ĐỘNG (không lưu). 3 tầng view qua tab:
//   #1 Từng học sinh (QUAN TRỌNG NHẤT — port tab "Dạng bài" V1) · #2 Lớp/Khối (rollup) · #3 Theo dạng (pivot).
// Hiện xây #1; #2/#3 placeholder. Engine src/gami/mastery.js + service src/lib/mastery.ts đã sẵn.
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listHSDangHoc } from '../../lib/tuyensinh'
import { listLop, listHSCuaLop, listLopCuaHS, type Lop, type HSTrongLop } from '../../lib/nhansu'
import { getMasteryHS, listBuoiHoatDong, getMasteryRollup, getMasteryByDang, getMasteryByChuyenDe, getTongQuanHS, getClassMatrix, bucketMucDo, SRC_LABEL, type DangMastery, type DangEval, type BuoiActivity, type HSRollup, type TongQuanHS, type ClassMatrix, type MatrixPhase, type MatrixCell, type ActPct, type BucketPct, type HoanThanhCard as HoanThanhCardT, type MucDoFilter } from '../../lib/mastery'
import {
  listKyThi, createKyThi, listDiemThiByKyThi, upsertDiemThi, currentMua, getDiemThiTruong,
  LOAI_KY_THI, HE_SO_KY_THI, DOT_LABEL, DOT_ORDER, type KyThi, type DiemThi, type Verdict, type TruongDiemRow,
} from '../../lib/thanhtich'
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

type ViewKey = 'hs' | 'matrix' | 'raw' | 'lop' | 'dang' | 'diemthi'
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
        <button onClick={() => go('matrix')} className={tab(view === 'matrix')}>Cả lớp</button>
        <button onClick={() => go('raw')} className={tab(view === 'raw')}>Theo buổi (raw)</button>
        <button onClick={() => go('lop')} className={tab(view === 'lop')}>Lớp / Khối</button>
        <button onClick={() => go('dang')} className={tab(view === 'dang')}>Theo dạng</button>
        <button onClick={() => go('diemthi')} className={tab(view === 'diemthi')}>Điểm thi</button>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto p-6">
        {seen.hs && <div className={view === 'hs' ? '' : 'hidden'}><PerHocSinh /></div>}
        {seen.matrix && <div className={view === 'matrix' ? '' : 'hidden'}><ClassMatrixView /></div>}
        {seen.raw && <div className={view === 'raw' ? '' : 'hidden'}><RawBuoi /></div>}
        {seen.lop && <div className={view === 'lop' ? '' : 'hidden'}><LopKhoiRollup /></div>}
        {seen.dang && <div className={view === 'dang' ? '' : 'hidden'}><TheoDang /></div>}
        {seen.diemthi && <div className={view === 'diemthi' ? '' : 'hidden'}><DiemThiTab /></div>}
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
  const [sub, setSub] = useState<'tongquan' | 'dangbai'>('tongquan')

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
              </div>
              {sub === 'tongquan' ? <TongQuanTab hsId={hsId} mon={mon} /> : <DangBaiTab hsId={hsId} mon={mon} />}
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

// SUB-TAB TỔNG QUAN — 3 VÙNG tách bạch (Thùy 07-14): ① hoàn thành bản đồ · ② chỉ số hoạt động · ③ chỉ số điểm.
function TongQuanTab({ hsId, mon }: { hsId: string; mon: string }) {
  const [d, setD] = useState<TongQuanHS | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); getTongQuanHS(hsId, mon).then(setD).catch(() => setD(null)).finally(() => setLoading(false)) }, [hsId, mon])
  if (loading) return <p className="text-sm text-slate-500">Đang tính…</p>
  if (!d) return <p className="text-sm text-slate-500">Không tải được.</p>
  const laToan = mon === 'Toán'
  const hinhPlaceholder = 'Hình học chưa có dữ liệu đo — nhánh này chưa được xây kho câu hỏi/gắn ET-MT-BTVN.'
  return (
    <div className="space-y-6">
      {/* ① HOÀN THÀNH BẢN ĐỒ KIẾN THỨC — toàn bộ + Đại/Hình × cơ bản/nâng cao (Hình placeholder). */}
      <div>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">① Hoàn thành bản đồ kiến thức</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <HoanThanhCard label="Toàn bộ" card={d.hoanThanh.toanBo} trend={d.trend.hoanThanhToanBo} primary />
          {laToan && (
            <>
              <HoanThanhCard label="Đại số — Cơ bản (1-3)" card={d.hoanThanh.daiCoBan} />
              <HoanThanhCard label="Đại số — Nâng cao (4-5)" card={d.hoanThanh.daiNangCao} />
              <HoanThanhPlaceholder label="Hình học — Cơ bản (1-3)" msg={hinhPlaceholder} />
              <HoanThanhPlaceholder label="Hình học — Nâng cao (4-5)" msg={hinhPlaceholder} />
            </>
          )}
        </div>
        <div className="mt-1.5 text-[11px] text-indigo-500">Bảng chi tiết từng dạng ↓ mục "Dạng bài"</div>
      </div>

      {/* ② CHỈ SỐ HOẠT ĐỘNG — 6 card gọn, 1 DÒNG NGANG (Thùy 07-15: "1 màn hình hiện đủ, khỏi kéo") —
          3 cơ bản trước | gạch dọc | 3 nâng cao sau, cùng thứ tự nguồn ET/BTVN/MT để so trực tiếp. */}
      <div>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">② Chỉ số hoạt động</h3>
        <div className="flex max-w-4xl flex-wrap items-stretch gap-2">
          <ActCard label="ET · Cơ bản" cls="text-emerald-600" a={d.hoatDong.etCoBan} trend={d.trend.etCoBan} />
          <ActCard label="BTVN · Cơ bản" cls="text-amber-600" a={d.hoatDong.btvnCoBan} trend={d.trend.btvnCoBan} sub="tham khảo" />
          <ActCard label="MT · Cơ bản" cls="text-rose-600" a={d.hoatDong.mtCoBan} trend={d.trend.mtCoBan} />
          <div className="hidden w-px shrink-0 self-stretch bg-slate-200 sm:block" />
          <ActCard label="ET · Nâng cao" cls="text-emerald-700" a={d.hoatDong.etNangCao} trend={d.trend.etNangCao} />
          <ActCard label="BTVN · Nâng cao" cls="text-amber-700" a={d.hoatDong.btvnNangCao} trend={d.trend.btvnNangCao} sub="tham khảo" />
          <ActCard label="MT · Nâng cao" cls="text-rose-700" a={d.hoatDong.mtNangCao} trend={d.trend.mtNangCao} />
        </div>
      </div>

      {/* ③ CHỈ SỐ ĐIỂM — điểm năng lực (placeholder) · Điểm MT TB (nhập ở buổi) · Điểm thi trường TB (nhập thủ công). */}
      <div>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">③ Chỉ số điểm</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:max-w-2xl">
          <StatCard label="Điểm năng lực (kỳ vọng)" muted>
            <div className="text-3xl font-bold text-slate-300">—</div>
            <div className="mt-0.5 text-[11px] text-slate-500">Cần cấu trúc đề + đủ dạng đo (gồm Hình) — làm sau</div>
          </StatCard>
          <StatCard label="Điểm MT trung bình">
            <div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-slate-800">{d.diem.mt.tb ?? '—'}</span><span className="text-[11px] text-slate-500">({d.diem.mt.n} lượt)</span></div>
            <div className="mt-0.5 text-[11px] text-slate-500">Nhập ở tab MT trong buổi</div>
          </StatCard>
          <StatCard label="Điểm thi trường trung bình">
            <div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-slate-800">{d.diem.truong.tb ?? '—'}</span><span className="text-[11px] text-slate-500">({d.diem.truong.n} lượt)</span></div>
            <div className="mt-0.5 text-[11px] text-slate-500">Nhập thủ công (Giữa/Cuối kì)</div>
          </StatCard>
        </div>
      </div>
    </div>
  )
}

// 2 nửa BÌNH ĐẲNG (Thùy 07-14, sửa lại): TRÊN = chỉ ET/MT (etMt, số chính) · DƯỚI = etMt + BTVN/Bổ trợ
// (coBTVN) — CÙNG cỡ chữ, CÙNG hiện đạt/cần luyện/yếu, có gạch ngang phân tách ở giữa, để so sánh trực
// tiếp 2 cách đo (không phải 1 số chính + 1 số phụ nhỏ). Chú thích nguồn nằm SAU số %, không phải trước.
function HoanThanhCard({ label, card, trend, primary }: { label: string; card: HoanThanhCardT; trend?: number | null; primary?: boolean }) {
  const sizeCls = primary ? 'text-3xl' : 'text-2xl'
  return (
    <StatCard label={label}>
      <HoanThanhHalf b={card.etMt} sizeCls={sizeCls} trend={trend} emptyMsg="chưa có dạng nào được đo (ET/MT)" />
      <div className="my-2 border-t border-slate-200" />
      <HoanThanhHalf b={card.coBTVN} sizeCls={sizeCls} suffix="(+BTVN/Bổ trợ)" emptyMsg="chưa có dạng nào được đo" />
    </StatCard>
  )
}
function HoanThanhHalf({ b, sizeCls, trend, suffix, emptyMsg }: { b: BucketPct; sizeCls: string; trend?: number | null; suffix?: string; emptyMsg: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className={`font-bold text-indigo-700 ${sizeCls}`}>{b.total ? `${b.pct}%` : '—'}</span>
        {suffix && <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{suffix}</span>}
        {trend !== undefined && <TrendBadge delta={trend ?? null} />}
      </div>
      {b.total ? (
        <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px]" title="Số tổng ước tính: đạt×1 + cần luyện×0.5 + yếu×0, chia số dạng đã đo">
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">{b.dat} đạt</span>
          <span className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700">{b.can_luyen} cần luyện</span>
          <span className="rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-700">{b.yeu} yếu</span>
        </div>
      ) : <div className="mt-0.5 text-[11px] text-slate-400">{emptyMsg}</div>}
    </div>
  )
}
function HoanThanhPlaceholder({ label, msg }: { label: string; msg: string }) {
  return (
    <StatCard label={label} muted>
      <div className="text-2xl font-bold text-slate-300">—</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{msg}</div>
    </StatCard>
  )
}
// Card GỌN cho vùng ② (Thùy 07-15: "nhỏ card lại, 1 dòng ngang hiện đủ 6 card") — w cố định, padding hẹp.
function ActCard({ label, cls, a, trend, sub }: { label: string; cls: string; a: ActPct; trend: number | null; sub?: string }) {
  return (
    <div className="w-[124px] shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
      <div className="text-[10px] font-semibold text-slate-500">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1"><span className={`text-lg font-bold ${cls}`}>{a.pct != null ? `${a.pct}%` : '—'}</span><TrendBadge delta={trend} /></div>
      <div className="mt-0.5 text-[10px] text-slate-400">{a.n} câu{sub ? ` · ${sub}` : ''}</div>
    </div>
  )
}

// SUB-TAB DẠNG BÀI: bảng mastery per-dạng (cửa sổ ngày + toggle BTVN). Mặc định "Tất cả" để khớp % ở Tổng quan.
// 1 khu riêng (Thùy 07-14): bảng chính (mọi dạng, như cũ) + 4 bảng phụ Đại/Hình × cơ bản/nâng cao (cùng
// scope filter Cửa sổ/Gộp BTVN, tính 1 lần rồi bucket theo muc_do client-side — không thêm query).
// Hình học: khoCuaMon('Toán') chỉ đọc dai_ban_do (chưa có hinh_cau_hoi/muc_do/gắn ET-MT-BTVN, xem ADR-mon.md
// §5) → 2 bảng Hình LUÔN rỗng hiện tại, hiện placeholder rõ ràng thay vì trông như bug. Chỉ tách nhánh cho
// môn Toán (KHTN không có khái niệm Đại/Hình).
function DangBaiTab({ hsId, mon }: { hsId: string; mon: string }) {
  const [days, setDays] = useState<number | null>(null) // null = tất cả (khớp Tổng quan all-time)
  const [btvn, setBtvn] = useState(false)
  const [rows, setRows] = useState<DangMastery[] | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    getMasteryHS(hsId, mon, { includeBTVN: btvn, days: days ?? undefined }).then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [hsId, mon, days, btvn])
  const coBan = useMemo(() => (rows ?? []).filter((r) => bucketMucDo(r.muc_do) === 'co_ban'), [rows])
  const nangCao = useMemo(() => (rows ?? []).filter((r) => bucketMucDo(r.muc_do) === 'nang_cao'), [rows])
  const dayBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  const laToan = mon === 'Toán'
  const hinhPlaceholder = 'Hình học chưa có dữ liệu đo — nhánh này chưa được xây kho câu hỏi/gắn ET-MT-BTVN.'
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
      ) : (
        <div className="space-y-7">
          <DangSection title="Toàn bộ bản đồ kiến thức" rows={rows}
            emptyMsg={`Chưa có lần đánh giá nào (môn ${mon}${days ? ` trong ${days} ngày` : ''}).`} />
          {laToan && (
            <div>
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Theo nhánh × độ khó</h3>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <DangSection title="Đại số — Cơ bản (độ khó 1-3)" rows={coBan} compact />
                <DangSection title="Đại số — Nâng cao (độ khó 4-5)" rows={nangCao} compact />
                <DangSection title="Hình học — Cơ bản (độ khó 1-3)" rows={[]} compact placeholder={hinhPlaceholder} />
                <DangSection title="Hình học — Nâng cao (độ khó 4-5)" rows={[]} compact placeholder={hinhPlaceholder} />
              </div>
            </div>
          )}
          {rows && rows.length > 0 && <Legend />}
        </div>
      )}
    </>
  )
}

// 1 bảng (dùng chung bảng chính + 4 bảng phụ) — rows đã lọc sẵn theo scope ngoài.
function DangSection({ title, rows, compact, placeholder, emptyMsg }: { title: string; rows: DangMastery[] | null; compact?: boolean; placeholder?: string; emptyMsg?: string }) {
  const tally = useMemo(() => {
    const t = { dat: 0, can_luyen: 0, yeu: 0 }
    for (const r of rows ?? []) if (r.mastery) t[r.mastery.muc]++
    return t
  }, [rows])
  return (
    <div>
      <h4 className={`mb-2 font-semibold text-slate-800 ${compact ? 'text-[13px]' : 'text-[14px]'}`}>{title}</h4>
      {placeholder ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-8 text-center text-[12px] text-slate-400">{placeholder}</div>
      ) : !rows || rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-[12px] text-slate-500">{emptyMsg ?? 'Chưa có dạng nào ở nhóm này.'}</div>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
            <Chip n={rows.length} label="dạng đã đo" cls="bg-slate-100 text-slate-600" />
            <Chip n={tally.dat} label="đạt" cls="bg-emerald-100 text-emerald-700" />
            <Chip n={tally.can_luyen} label="cần luyện" cls="bg-amber-100 text-amber-700" />
            <Chip n={tally.yeu} label="yếu" cls="bg-rose-100 text-rose-700" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <div className={compact ? 'min-w-[520px]' : 'min-w-[760px]'}>
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <div className={`shrink-0 ${compact ? 'w-[220px]' : 'w-[300px]'}`}>Dạng bài</div>
                <div className="w-24 shrink-0 text-center">Mức</div>
                <div className="w-16 shrink-0 text-center">Điểm</div>
                <div className="w-20 shrink-0 text-center">Độ tin</div>
                <div className="min-w-[180px] flex-1">Lịch sử gần đây (mới → cũ)</div>
              </div>
              {rows.map((d) => <DangRow key={d.ma_dang} d={d} />)}
            </div>
          </div>
        </>
      )}
    </div>
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
      <span>Nguồn: ET = kiểm tra cuối giờ · MT = kiểm tra tháng · BT = bổ trợ tự luyện · BTVN = bài tập về nhà (tham khảo) — chấm bài trên lớp/đánh giá GV không tính vào mastery</span>
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

// ── VIEW CẢ LỚP: ma trận HS × buổi cho ET/BTVN/MT — mỗi ô % hoàn thành; "không làm" tô cảnh báo ──
const MATRIX_PHASES: { key: MatrixPhase; label: string }[] = [{ key: 'et', label: 'ET' }, { key: 'btvn', label: 'BTVN' }, { key: 'mt', label: 'MT' }]
const pctCls = (p: number) => p >= 80 ? 'bg-emerald-50 text-emerald-700' : p >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
// 'YYYY-MM' — tháng hiện tại + dịch tháng (điều hướng next/prev, không dropdown).
const curYM = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const shiftYM = (ym: string, delta: number) => { const [y, m] = ym.split('-').map(Number); const i = y * 12 + (m - 1) + delta; return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}` }
function ClassMatrixView() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [phase, setPhase] = useState<MatrixPhase>('btvn')
  const [ym, setYm] = useState(curYM())
  const [data, setData] = useState<ClassMatrix | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLopId(null)
    listLop().then((ls) => setLopOpts(ls.filter((l: any) => l.mon === mon).map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))).catch(() => setLopOpts([]))
  }, [mon])
  useEffect(() => {
    if (!lopId) { setData(null); return }
    setLoading(true)
    getClassMatrix(lopId, phase, ym).then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [lopId, phase, ym])
  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const phBtn = (on: boolean) => `h-8 rounded-md px-4 text-[13px] font-semibold transition ${on ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  const [yy, mm] = ym.split('-')
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-56"><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
        {/* điều hướng THÁNG: prev ‹ · nhãn · next › */}
        <div className="ml-2 flex items-center gap-0.5 rounded-md ring-1 ring-slate-200">
          <button onClick={() => setYm(shiftYM(ym, -1))} className="h-7 rounded-l-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng trước">‹</button>
          <span className="min-w-[92px] text-center text-[13px] font-semibold tabular-nums text-slate-700">Tháng {Number(mm)}/{yy}</span>
          <button onClick={() => setYm(shiftYM(ym, +1))} className="h-7 rounded-r-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng sau">›</button>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {MATRIX_PHASES.map((p) => <button key={p.key} onClick={() => setPhase(p.key)} className={phBtn(phase === p.key)}>{p.label}</button>)}
        </div>
      </div>
      {!lopId ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một lớp để xem tổng quan cả lớp.</div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : !data || data.buois.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Không có buổi nào đã đóng {phase.toUpperCase()} trong tháng {Number(mm)}/{yy}.</div>
      ) : (
        <>
          <MatrixTable data={data} />
          <Legend2 phase={phase} />
        </>
      )}
    </>
  )
}
function MatrixTable({ data }: { data: ClassMatrix }) {
  const { buois, students, cells } = data
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-600" style={{ minWidth: 168 }}>Học sinh</th>
            {buois.map((b) => {
              const d = new Date(b.ngay + 'T00:00:00')
              return <th key={b.id} className="px-1.5 py-2 text-center font-semibold text-slate-500" style={{ minWidth: 48 }} title={b.ma_buoi ?? b.ngay}>{isNaN(+d) ? b.ngay : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</th>
            })}
            <th className="sticky right-0 z-10 bg-slate-50 px-2 py-2 text-center font-semibold text-slate-600" style={{ minWidth: 48 }}>TB</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const done = buois.map((b) => cells[s.id + ':' + b.id]).filter((c) => c?.status === 'done').map((c) => c!.pct as number)
            const avg = done.length ? Math.round(done.reduce((x, y) => x + y, 0) / done.length) : null
            return (
              <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                <td className="sticky left-0 z-10 bg-white px-3 py-1.5 font-medium text-slate-800" style={{ minWidth: 168 }}>{s.ho_ten}</td>
                {buois.map((b) => <MatrixCellTd key={b.id} cell={cells[s.id + ':' + b.id]} />)}
                <td className="sticky right-0 z-10 bg-white px-2 py-1.5 text-center font-bold tabular-nums text-slate-700">{avg != null ? avg + '%' : '·'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
function MatrixCellTd({ cell }: { cell: MatrixCell | undefined }) {
  if (!cell || cell.status === 'none') return <td className="px-1.5 py-1.5 text-center text-slate-300">·</td>
  if (cell.status === 'khong_lam') return <td className="px-1 py-1.5 text-center"><span className="inline-block rounded bg-rose-600 px-1 py-0.5 text-[10px] font-bold text-white">Ko làm</span></td>
  if (cell.status === 'vang') return <td className="px-1.5 py-1.5 text-center text-[11px] font-medium text-slate-400">V</td>
  const p = cell.pct as number
  return <td className="px-1.5 py-1.5 text-center"><span className={`inline-block min-w-[36px] rounded px-1 py-0.5 text-[11px] font-bold tabular-nums ${pctCls(p)}`}>{p}%</span></td>
}
function Legend2({ phase }: { phase: MatrixPhase }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
      <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-4 rounded bg-emerald-100 ring-1 ring-emerald-200" />≥80%</span>
      <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-4 rounded bg-amber-100 ring-1 ring-amber-200" />50–79%</span>
      <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-4 rounded bg-rose-100 ring-1 ring-rose-200" />&lt;50%</span>
      {phase === 'btvn' && <span className="inline-flex items-center gap-1"><span className="inline-block rounded bg-rose-600 px-1 py-0.5 text-[9px] font-bold text-white">Ko làm</span>xin phép / không làm</span>}
      <span className="inline-flex items-center gap-1"><span className="w-4 text-center font-medium text-slate-400">V</span>vắng</span>
      <span className="inline-flex items-center gap-1"><span className="w-4 text-center text-slate-300">·</span>chưa có dữ liệu</span>
    </div>
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
  const [mucDo, setMucDo] = useState<MucDoFilter>('tat_ca')
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
      ? getMasteryByDang(scope, mucDo).then((rs) => rs.map((d): PivotItem => ({ key: d.ma_dang, title: d.ten_dang, sub: [d.ma_dang, d.ten_chuyen_de].filter(Boolean).join(' · '), dat: d.dat, can_luyen: d.can_luyen, yeu: d.yeu, total: d.total })))
      : getMasteryByChuyenDe(scope, mucDo).then((rs) => rs.map((c): PivotItem => ({ key: c.ten_chuyen_de, title: c.ten_chuyen_de, dat: c.dat, can_luyen: c.can_luyen, yeu: c.yeu, total: c.total })))
    p.then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [mon, lopId, khoi, groupBy, mucDo])

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
  const mucDoBtn = (on: boolean) => `h-7 rounded-md px-3 text-[12px] font-semibold transition ${on ? 'bg-violet-600 text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`
  const donVi = groupBy === 'dang' ? 'dạng' : 'chuyên đề'

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-52"><SearchSelect value={lopId} onChange={(v) => { setLopId(v); if (v) setKhoi(null) }} options={lopOpts} placeholder="Theo lớp…" /></div>
        <span className="text-[12px] text-slate-400">hoặc</span>
        <div className="w-40"><SearchSelect value={khoi} onChange={(v) => { setKhoi(v); if (v) setLopId(null) }} options={khoiOpts} placeholder="Theo khối…" /></div>
        <div className="ml-2 flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setMucDo('tat_ca')} className={mucDoBtn(mucDo === 'tat_ca')}>Tất cả</button>
          <button onClick={() => setMucDo('co_ban')} className={mucDoBtn(mucDo === 'co_ban')}>Cơ bản</button>
          <button onClick={() => setMucDo('nang_cao')} className={mucDoBtn(mucDo === 'nang_cao')}>Nâng cao</button>
        </div>
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

// ── #5 ĐIỂM THI (Thùy 07-14): nhập liệu chuyển VỀ ĐÂY (Kết quả học tập = "quản lý chất lượng"), Quản lý
// Level giờ CHỈ VIEW ma trận Level (xem QuanLyLevelScreen.tsx) — không còn nhập ở đó nữa, tránh trùng chỗ.
// 2 sub-tab: Điểm thi trên trường (view+filter+sort, đúng cột Thùy yêu cầu) · Nhập điểm (port nguyên khối
// UI cũ của Quản lý Level: chọn lớp → kì thi → nhập Điểm/Verdict/Vượt-band từng HS).
function DiemThiTab() {
  const [sub, setSub] = useState<'truong' | 'nhap'>('truong')
  const subBtn = (on: boolean) => `-mb-px border-b-2 px-3 py-2 text-[13px] font-medium transition ${on ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`
  return (
    <>
      <div className="mb-4 flex items-center gap-1 border-b border-slate-200">
        <button onClick={() => setSub('truong')} className={subBtn(sub === 'truong')}>Điểm thi trên trường</button>
        <button onClick={() => setSub('nhap')} className={subBtn(sub === 'nhap')}>Nhập điểm</button>
      </div>
      {sub === 'truong' ? <DiemThiTruongView /> : <NhapDiemView />}
    </>
  )
}

// Cột đúng yêu cầu: Tên HS · Mã HS · Lớp · Trường · Giữa kì I · Giữa kì II · Cuối kì I · Cuối kì II. Filter
// theo lớp/khối; sort theo tên hoặc từng đợt (điểm cao lên đầu, chưa thi xuống cuối).
type DiemSortKey = 'ten' | typeof DOT_ORDER[number]
function DiemThiTruongView() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [khoi, setKhoi] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [khoiOpts, setKhoiOpts] = useState<Opt[]>([])
  const [rows, setRows] = useState<TruongDiemRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState<DiemSortKey>('ten')
  const mua = currentMua()

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
    getDiemThiTruong({ mon, mua, lopId, khoi: lopId ? null : khoi }).then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [mon, lopId, khoi, mua])

  const shown = useMemo(() => {
    const r = [...(rows ?? [])]
    if (sort === 'ten') r.sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
    else r.sort((a, b) => {
      const av = a.diem[sort] ?? null, bv = b.diem[sort] ?? null
      if (av == null && bv == null) return a.ho_ten.localeCompare(b.ho_ten, 'vi')
      if (av == null) return 1
      if (bv == null) return -1
      return bv - av // điểm cao lên đầu
    })
    return r
  }, [rows, sort])

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const sortBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-48"><SearchSelect value={lopId} onChange={(v) => { setLopId(v); if (v) setKhoi(null) }} options={lopOpts} placeholder="Theo lớp…" /></div>
        <span className="text-[12px] text-slate-400">hoặc</span>
        <div className="w-36"><SearchSelect value={khoi} onChange={(v) => { setKhoi(v); if (v) setLopId(null) }} options={khoiOpts} placeholder="Theo khối…" /></div>
        <span className="ml-2 rounded-full bg-violet-50 px-2.5 py-0.5 text-[12px] font-semibold text-violet-600">Mùa {mua}</span>
      </div>

      {!lopId && !khoi ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một lớp hoặc khối để xem điểm thi trên trường.</div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : !rows || rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chưa có học sinh nào trong phạm vi này.</div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="rounded bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600">{shown.length} học sinh</span>
            <span className="ml-1 text-slate-500">Sắp xếp:</span>
            <button onClick={() => setSort('ten')} className={sortBtn(sort === 'ten')}>Tên</button>
            {DOT_ORDER.map((k) => <button key={k} onClick={() => setSort(k)} className={sortBtn(sort === k)}>{DOT_LABEL[k]}</button>)}
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Tên HS</th>
                  <th className="px-3 py-2">Mã HS</th>
                  <th className="px-3 py-2">Lớp</th>
                  <th className="px-3 py-2">Trường</th>
                  {DOT_ORDER.map((k) => <th key={k} className="w-20 px-2 py-2 text-center">{DOT_LABEL[k]}</th>)}
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.hoc_sinh_id} className="border-b border-slate-100 last:border-0 hover:bg-indigo-50/30">
                    <td className="px-3 py-1.5 font-medium text-slate-800">{r.ho_ten}</td>
                    <td className="px-3 py-1.5 font-mono text-[12px] text-slate-500">{r.ma_hs ?? '—'}</td>
                    <td className="px-3 py-1.5 text-slate-600">{r.lop ?? '—'}</td>
                    <td className="px-3 py-1.5 text-slate-600">{r.truong_hoc ?? '—'}</td>
                    {DOT_ORDER.map((k) => (
                      <td key={k} className="px-2 py-1.5 text-center font-mono font-semibold text-slate-700">{r.diem[k] ?? <span className="text-slate-300">—</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

// Nhập điểm (port từ QuanLyLevelScreen — chọn lớp → kì thi (tạo mới nếu cần) → nhập Điểm/Verdict/Vượt-band
// từng HS). Cùng data-layer thanhtich.ts, KHÔNG đổi hành vi, chỉ đổi CHỖ ở (Thùy 07-14).
const VERDICTS: Verdict[] = ['dat', 'gan_dat', 'khong_dat']
const V_LABEL: Record<Verdict, string> = { dat: 'Đạt', gan_dat: 'Gần', khong_dat: 'Không' }
const V_CLS: Record<Verdict, string> = { dat: 'bg-emerald-500 text-white', gan_dat: 'bg-amber-500 text-white', khong_dat: 'bg-rose-500 text-white' }

function NhapDiemView() {
  const mua = currentMua()
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [roster, setRoster] = useState<HSTrongLop[]>([])
  const [kyThis, setKyThis] = useState<KyThi[]>([])
  const [diems, setDiems] = useState<DiemThi[]>([])
  const [sel, setSel] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { listLop().then((l) => setLops(l.filter((x) => x.trang_thai === 'dang_hoc'))).catch(() => {}) }, [])
  const lop = lops.find((l) => l.id === lopId) ?? null

  async function reload(l: Lop) {
    setLoading(true)
    try {
      const [r, kt] = await Promise.all([listHSCuaLop(l.id), listKyThi(mua, l.mon)])
      const kts = kt.filter((k) => !k.khoi || k.khoi === l.khoi)
      setRoster(r); setKyThis(kts)
      setDiems(await listDiemThiByKyThi(kts.map((k) => k.id)))
    } finally { setLoading(false) }
  }
  useEffect(() => { setSel(null); setRoster([]); setKyThis([]); setDiems([]); if (lop) reload(lop) }, [lopId]) // eslint-disable-line

  const diemOf = (kyThiId: string, hsId: string) => diems.find((d) => d.ky_thi_id === kyThiId && d.hoc_sinh_id === hsId) ?? null

  async function save(kyThiId: string, hs: HSTrongLop, verdict: Verdict, diem: number | null, vuot: boolean) {
    await upsertDiemThi({ kyThiId, hocSinhId: hs.hoc_sinh_id, diem, bandLucThi: hs.muc_nang_luc_id ?? null, verdict, vuotBand: vuot })
    setDiems((prev) => [...prev.filter((d) => !(d.ky_thi_id === kyThiId && d.hoc_sinh_id === hs.hoc_sinh_id)),
      { ky_thi_id: kyThiId, hoc_sinh_id: hs.hoc_sinh_id, diem, band_luc_thi: hs.muc_nang_luc_id ?? null, verdict, vuot_band: vuot }])
  }

  const selKy = kyThis.find((k) => k.id === sel) ?? null
  const tenHT = tenHienThiDs(roster.map((hs) => hs.hoc_sinh?.ho_ten))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72">
          <SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…"
            options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ` · K${l.khoi}` : ''}` }))} />
        </div>
        <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[12px] font-semibold text-violet-600">Mùa {mua}</span>
        {lop && <span className="text-[12px] text-slate-400">Môn <b className="text-slate-600">{lop.mon}</b> · {roster.length} HS · {kyThis.length} kì thi</span>}
      </div>

      {!lop ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một lớp để nhập điểm (Thi trường / BK sát hạch MT / Khảo sát tháng).</div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Kì thi</span>
            {kyThis.map((k) => (
              <button key={k.id} onClick={() => setSel(sel === k.id ? null : k.id)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${sel === k.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
                {k.ten} <span className="opacity-60">·×{k.he_so}</span>
              </button>
            ))}
            <button onClick={() => setCreating(true)} className="rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Thêm kì thi</button>
          </div>

          {selKy && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-[13px] font-semibold text-slate-800">Nhập điểm · {selKy.ten} <span className="text-slate-400">({LOAI_KY_THI[selKy.loai]}, hệ số {selKy.he_so})</span></div>
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400"><th className="sticky top-0 z-10 bg-white py-1.5">Học sinh</th><th className="sticky top-0 z-10 w-24 bg-white">Điểm /10</th><th className="sticky top-0 z-10 w-56 bg-white">Verdict</th><th className="sticky top-0 z-10 w-24 bg-white">Vượt band</th></tr></thead>
                <tbody>
                  {roster.map((hs, i) => <DiemRowEntry key={hs.hoc_sinh_id} ten={tenHT[i]} init={diemOf(selKy.id, hs.hoc_sinh_id)} onSave={(v, d, vu) => save(selKy.id, hs, v, d, vu)} />)}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {creating && lop && <TaoKyThiModal lop={lop} mua={mua} onClose={() => setCreating(false)} onCreated={() => { setCreating(false); reload(lop) }} />}
    </div>
  )
}

function DiemRowEntry({ ten, init, onSave }: { ten: string; init: DiemThi | null; onSave: (v: Verdict, d: number | null, vu: boolean) => void }) {
  const [diem, setDiem] = useState(init?.diem != null ? String(init.diem) : '')
  const [verdict, setVerdict] = useState<Verdict | null>(init?.verdict ?? null)
  const [vuot, setVuot] = useState(init?.vuot_band ?? false)
  const d = () => (diem.trim() === '' ? null : Number(diem))
  const pick = (v: Verdict) => { setVerdict(v); onSave(v, d(), vuot) }
  return (
    <tr className="border-t border-slate-100">
      <td className="py-1.5 font-medium text-slate-700">{ten}</td>
      <td><input value={diem} onChange={(e) => setDiem(e.target.value)} onBlur={() => verdict && onSave(verdict, d(), vuot)} inputMode="decimal" className="h-7 w-16 rounded border border-slate-300 px-2 text-[13px]" /></td>
      <td>
        <div className="flex gap-1">
          {VERDICTS.map((v) => (
            <button key={v} onClick={() => pick(v)} className={`h-7 rounded px-2 text-[12px] font-medium ${verdict === v ? V_CLS[v] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{V_LABEL[v]}</button>
          ))}
        </div>
      </td>
      <td><input type="checkbox" checked={vuot} disabled={!verdict} onChange={(e) => { setVuot(e.target.checked); if (verdict) onSave(verdict, d(), e.target.checked) }} className="h-4 w-4 accent-indigo-600 disabled:opacity-40" /></td>
    </tr>
  )
}

function TaoKyThiModal({ lop, mua, onClose, onCreated }: { lop: Lop; mua: string; onClose: () => void; onCreated: () => void }) {
  const [loai, setLoai] = useState<KyThi['loai']>('khao_sat_thang')
  const [ten, setTen] = useState('')
  const [dot, setDot] = useState<string>('')
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const coDot = loai !== 'khao_sat_thang'

  async function tao() {
    setBusy(true)
    try {
      await createKyThi({ ten: ten.trim() || LOAI_KY_THI[loai], loai, he_so: HE_SO_KY_THI[loai], dot: coDot && dot ? dot : null, ngay: ngay || null, mon: lop.mon, khoi: lop.khoi, mua, buoi_hoc_id: null })
      onCreated()
    } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[440px] max-w-[95vw] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-base font-semibold text-slate-900">Thêm kì thi · {lop.mon} K{lop.khoi}</div>
        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Loại</label>
        <div className="mb-3 flex gap-1.5">
          {(Object.keys(LOAI_KY_THI) as KyThi['loai'][]).map((l) => (
            <button key={l} onClick={() => setLoai(l)} className={`flex-1 rounded-lg px-2 py-2 text-[12px] font-medium ${loai === l ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{LOAI_KY_THI[l]}<div className="text-[10px] opacity-70">hệ số {HE_SO_KY_THI[l]}</div></button>
          ))}
        </div>
        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Tên</label>
        <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder={LOAI_KY_THI[loai]} className="mb-3 h-9 w-full rounded-lg border border-slate-300 px-3 text-[13px]" autoFocus />
        {coDot && (
          <>
            <label className="mb-1 block text-[12px] font-semibold text-slate-500">Đợt (ghép cặp trường ↔ BK)</label>
            <select value={dot} onChange={(e) => setDot(e.target.value)} className="mb-3 h-9 w-full rounded-lg border border-slate-300 px-2 text-[13px]">
              <option value="">— chọn đợt —</option>
              {DOT_ORDER.map((k) => <option key={k} value={k}>{DOT_LABEL[k]}</option>)}
            </select>
          </>
        )}
        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Ngày thi</label>
        <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="mb-4 h-9 w-full rounded-lg border border-slate-300 px-3 text-[13px]" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={tao} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo kì thi'}</button>
        </div>
      </div>
    </div>
  )
}
