// REPORT PHỤ HUYNH (tháng) — leaf riêng. Chọn MÔN → LỚP → cột trái hiện cả lớp, click chọn thẳng HS
// (giống "Kết quả học tập" — KHÔNG dùng dropdown tìm HS) → tháng.
// Bố cục: DỮ LIỆU bên TRÁI (bảng theo buổi + tổng quan mastery) · NHẬN XÉT bên PHẢI (3 ô + thanh mức kết luận).
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listLop, listHSCuaLop } from '../../lib/nhansu'
import { getTongQuanHS, type TongQuanHS } from '../../lib/mastery'
import { getReportBuoiHS, getBaoCaoPH, upsertBaoCaoPH, getGVChinhLop, getKhoiRankDiemMT, getLopRankDiemMT, getHeRankDiemMT, BC_EMPTY, type ReportBuoiRow, type BaoCaoPH, type KhoiRankMT, type LopRankMT, type HeRankMT } from '../../lib/report'
import { tenHienThiDs } from '../../lib/hoten'

const MON_CO_KHO = ['Toán', 'KHTN']
// Thang 5 cho skill bar (GV tự chọn). index 0..4 ↔ mức 1..5.
const SKILL_MUC = ['Cần cố gắng', 'Trung bình', 'Khá', 'Tốt', 'Xuất sắc'] as const
const curYM = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const shiftYM = (ym: string, delta: number) => { const [y, m] = ym.split('-').map(Number); const i = y * 12 + (m - 1) + delta; return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}` }
const NOP_LABEL: Record<string, string> = { nop_dung_han: 'Đúng hạn', nop_muon: 'Nộp muộn', xin_phep: 'Xin phép', khong_lam: 'Không làm' }
const TD_LABEL: Record<string, string> = { nghiem_tuc: 'Nghiêm túc', chua_het_suc: 'Chưa hết sức', chua_nghiem_tuc: 'Chưa nghiêm túc', chong_doi: 'Chống đối' }
const TD_CLS: Record<string, string> = { nghiem_tuc: 'text-emerald-700', chua_het_suc: 'text-amber-700', chua_nghiem_tuc: 'text-rose-700', chong_doi: 'text-rose-800 font-bold' }
const pctCls = (p: number | null) => p == null ? 'text-slate-300' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-700'
const fmtNgay = (iso: string) => { const d = new Date(iso + 'T00:00:00'); return isNaN(+d) ? iso : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) }
// Thanh mức kết luận (7 bậc, Thùy 08-19): trộn 2 trục CÓ CHỦ ĐÍCH — mức tuyệt đối (rất tốt/đạt yêu cầu)
// ưu tiên cao nhất; "đang tiến bộ" (xu hướng) chen lên TRÊN 2 mức "cần cải thiện/gặp vấn đề" vì với PH,
// tin "con đang tiến bộ" quan trọng hơn xu hướng ổn định ở mức thấp — giấu cái ít quan trọng hơn để thông
// điệp rõ ràng nhất (bố mẹ đọc xong phải biết ngay có cần lo hay không). 2 cặp cần-cải-thiện/gặp-vấn-đề
// tách theo TRỤC (thái độ ≠ kiến thức&kĩ năng) — CÙNG màu trong mỗi cặp, không xếp trục nào nặng hơn.
export const KET_LUAN_MUC = [
  { key: 'rat_tot', label: 'Con học rất tốt', emoji: '🌟', dot: 'bg-emerald-500', sel: 'bg-emerald-600 text-white ring-emerald-600' },
  { key: 'dat_yeu_cau', label: 'Con đạt yêu cầu', emoji: '✅', dot: 'bg-green-400', sel: 'bg-green-500 text-white ring-green-500' },
  { key: 'tien_bo', label: 'Con đang tiến bộ', emoji: '📈', dot: 'bg-sky-400', sel: 'bg-sky-500 text-white ring-sky-500' },
  { key: 'cai_thien_thai_do', label: 'Con cần cải thiện thái độ học tập', emoji: '⚠️', dot: 'bg-amber-400', sel: 'bg-amber-500 text-white ring-amber-500' },
  { key: 'cai_thien_kien_thuc', label: 'Con cần cải thiện kiến thức và kĩ năng', emoji: '⚠️', dot: 'bg-amber-400', sel: 'bg-amber-500 text-white ring-amber-500' },
  { key: 'van_de_thai_do', label: 'Con gặp vấn đề về thái độ học tập', emoji: '🆘', dot: 'bg-rose-500', sel: 'bg-rose-600 text-white ring-rose-600' },
  { key: 'van_de_kien_thuc', label: 'Con gặp vấn đề về kiến thức và kĩ năng', emoji: '🆘', dot: 'bg-rose-500', sel: 'bg-rose-600 text-white ring-rose-600' },
] as const

// Band năng lực GV chọn (cao → thấp). 7 chỉ số phát triển (mức 1..5).
const BANDS = ['S+', 'S', 'S-', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'] as const
const CHI_SO: { key: 'cs_thai_do' | 'cs_tap_trung' | 'cs_tiep_thu' | 'cs_tu_duy' | 'cs_ky_nang' | 'cs_van_dung' | 'cs_vuot_kho'; label: string }[] = [
  { key: 'cs_thai_do', label: 'Thái độ học tập' },
  { key: 'cs_tap_trung', label: 'Khả năng tập trung' },
  { key: 'cs_tiep_thu', label: 'Khả năng tiếp thu' },
  { key: 'cs_tu_duy', label: 'Tư duy học tập' },
  { key: 'cs_ky_nang', label: 'Kỹ năng làm bài' },
  { key: 'cs_van_dung', label: 'Khả năng vận dụng' },
  { key: 'cs_vuot_kho', label: 'Khả năng vượt khó' },
]
// màu mức 1..5: 1-2 đỏ, 3 cam, 4 xanh nhạt, 5 xanh đậm (khớp app PH).
const mucBg = (i: number) => i <= 2 ? 'bg-rose-500' : i === 3 ? 'bg-amber-500' : i === 4 ? 'bg-green-400' : 'bg-emerald-600'

type RosterHS = { id: string; ho_ten: string; ma_hs: string | null; anh_url: string | null }

export default function ReportPHScreen() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [hsId, setHsId] = useState<string | null>(null)
  const [roster, setRoster] = useState<RosterHS[]>([])
  const [ym, setYm] = useState(curYM())

  useEffect(() => {
    setLopId(null); setHsId(null)
    listLop().then((ls) => setLopOpts(ls.filter((l: any) => l.mon === mon).map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))).catch(() => setLopOpts([]))
  }, [mon])
  // Đổi lớp → nạp CẢ DANH SÁCH (cột trái, click chọn thẳng — giống "Kết quả học tập"), khỏi phải gõ dropdown.
  useEffect(() => {
    setHsId(null); setRoster([])
    if (!lopId) return
    listHSCuaLop(lopId).then((rows: any[]) => setRoster(rows.map((r) => r.hoc_sinh).filter(Boolean)
      .sort((a: any, b: any) => String(a.ho_ten).localeCompare(String(b.ho_ten), 'vi'))
      .map((h: any) => ({ id: h.id, ho_ten: h.ho_ten, ma_hs: h.ma_hs ?? null, anh_url: h.anh_url ?? null })))).catch(() => setRoster([]))
  }, [lopId])

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const [yy, mm] = ym.split('-')
  const hs = roster.find((r) => r.id === hsId) ?? null
  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Report phụ huynh</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-44"><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
        <div className="ml-2 flex items-center gap-0.5 rounded-md ring-1 ring-slate-200">
          <button onClick={() => setYm(shiftYM(ym, -1))} className="h-7 rounded-l-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng trước">‹</button>
          <span className="min-w-[92px] text-center text-[13px] font-semibold tabular-nums text-slate-700">Tháng {Number(mm)}/{yy}</span>
          <button onClick={() => setYm(shiftYM(ym, +1))} className="h-7 rounded-r-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng sau">›</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!lopId ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn lớp để xem danh sách học sinh.</div>
        ) : (
          <div className="flex gap-4">
            {/* CỘT TRÁI: danh sách cả lớp, click chọn thẳng — giống "Kết quả học tập" */}
            <aside className="w-56 shrink-0">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{roster.length} học sinh</div>
                <div className="max-h-[75vh] overflow-auto">
                  {(() => { const tenHT = tenHienThiDs(roster.map((r) => r.ho_ten)); return roster.map((r, i) => (
                    <button key={r.id} onClick={() => setHsId(r.id)} title={r.ho_ten}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] ${r.id === hsId ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                      {r.anh_url
                        ? <img src={r.anh_url} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                        : <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-600">{r.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'}</span>}
                      <span className="truncate">{tenHT[i]}</span>
                    </button>
                  )) })()}
                  {roster.length === 0 && <p className="px-3 py-2 text-[12px] text-slate-500">Lớp trống.</p>}
                </div>
              </div>
            </aside>
            {/* CỘT PHẢI: report của HS đang chọn */}
            <div className="min-w-0 flex-1">
              {!hs ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn học sinh ở cột trái để xem report.</div>
              ) : <ReportBody key={hs.id + mon + ym} hsId={hs.id} mon={mon} ym={ym} lopId={lopId} hsName={hs.ho_ten} hsImg={hs.anh_url} lopTen={lopOpts.find((o) => o.id === lopId)?.label ?? ''} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportBody({ hsId, mon, ym, lopId, hsName, hsImg, lopTen }: { hsId: string; mon: string; ym: string; lopId: string | null; hsName: string; hsImg: string | null; lopTen: string }) {
  const [rows, setRows] = useState<ReportBuoiRow[] | null>(null)
  const [tq, setTq] = useState<TongQuanHS | null>(null)
  const [gvName, setGvName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [anh, setAnh] = useState(false)
  useEffect(() => {
    setLoading(true)
    Promise.all([getReportBuoiHS(hsId, mon, ym), getTongQuanHS(hsId, mon, { ym })])
      .then(([r, t]) => { setRows(r); setTq(t) }).catch(() => { setRows([]); setTq(null) }).finally(() => setLoading(false))
  }, [hsId, mon, ym])
  useEffect(() => { setGvName(null); if (lopId) getGVChinhLop(lopId).then(setGvName).catch(() => {}) }, [lopId])
  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>
  const missCount = (rows ?? []).filter((r) => r.btvnTrangThai === 'khong_lam' || r.btvnTrangThai === 'xin_phep').length
  return (
    <>
    <div className="mb-3 flex justify-end">
      <button onClick={() => setAnh(true)} className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">📸 Ảnh gửi phụ huynh</button>
    </div>
    {anh && tq && <PhAnhModal hsId={hsId} mon={mon} ym={ym} lopId={lopId} hsName={hsName} hsImg={hsImg} lopTen={lopTen} gvName={gvName} tq={tq} missCount={missCount} onClose={() => setAnh(false)} />}
    <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
      {/* ── TRÁI: SỐ LIỆU ── */}
      <div className="space-y-5">
        {tq && <TongQuanCards tq={tq} missCount={missCount} />}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Chi tiết theo buổi · tháng {Number(ym.split('-')[1])}</h3>
          {!rows || rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">Không có buổi nào trong tháng này.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-[13px]">
                <thead><tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-4 py-2 text-left font-semibold">Buổi</th>
                  <th className="px-3 py-2 text-center font-semibold">ET</th>
                  <th className="px-3 py-2 text-center font-semibold">BTVN</th>
                  <th className="px-4 py-2 text-left font-semibold">Thái độ BTVN</th>
                </tr></thead>
                <tbody>{rows.map((r) => <BuoiRow key={r.buoiId} r={r} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* ── PHẢI: NHẬN XÉT ── */}
      <div className="xl:sticky xl:top-0 xl:self-start"><NhanXet hsId={hsId} mon={mon} ym={ym} /></div>
    </div>
    </>
  )
}

function BuoiRow({ r }: { r: ReportBuoiRow }) {
  const btvnCell = r.btvnTrangThai === 'khong_lam' || r.btvnTrangThai === 'xin_phep'
    ? <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[12px] font-semibold text-rose-700">{NOP_LABEL[r.btvnTrangThai] ?? 'Không làm'}</span>
    : r.btvnPct != null ? <span className={`font-bold tabular-nums ${pctCls(r.btvnPct)}`}>{r.btvnPct}%</span>
    : r.btvnTrangThai ? <span className="text-[12px] text-slate-500">{NOP_LABEL[r.btvnTrangThai] ?? r.btvnTrangThai}</span>
    : <span className="text-slate-300">—</span>
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-1.5 font-medium text-slate-700">{fmtNgay(r.ngay)}</td>
      <td className="px-3 py-1.5 text-center">{r.vang ? <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[12px] font-semibold text-rose-700">Vắng</span> : r.etPct != null ? <span className={`font-bold tabular-nums ${pctCls(r.etPct)}`}>{r.etPct}%</span> : <span className="text-slate-300">—</span>}</td>
      <td className="px-3 py-1.5 text-center">{btvnCell}</td>
      <td className="px-4 py-1.5">{r.btvnThaiDo ? <span className={`text-[12px] ${TD_CLS[r.btvnThaiDo] ?? 'text-slate-600'}`}>{TD_LABEL[r.btvnThaiDo] ?? r.btvnThaiDo}</span> : <span className="text-slate-300">—</span>}</td>
    </tr>
  )
}

type Bucket = { pct: number | null; n: number }
function tongPct(a: Bucket, b: Bucket): number | null {
  const parts = [a, b].filter((x) => x.pct != null && x.n > 0)
  if (!parts.length) return null
  const N = parts.reduce((s, x) => s + x.n, 0)
  return Math.round(parts.reduce((s, x) => s + (x.pct as number) * x.n, 0) / N)
}
function NumCol({ label, pct, big }: { label: string; pct: number | null; big?: boolean }) {
  return (
    <div className="flex-1 px-3 text-center first:pl-0">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`font-extrabold tabular-nums ${big ? 'text-[26px]' : 'text-[20px]'} ${pctCls(pct)}`}>{pct == null ? '—' : pct + '%'}</div>
    </div>
  )
}
// Điểm THẬT nhập tay (thang 10, qua ky_thi/diem_thi) — KHÁC %hoạt động ở NumCol (đúng câu/tổng câu).
// Cố ý không dùng pctCls (màu theo ngưỡng %0-100) cho số 0-10 — dễ đọc sai (vd điểm 8 mà tô đỏ như %8).
function DiemRow({ tong, cb, nc, truong }: { tong: number | null; cb: number | null; nc: number | null; truong?: number | null }) {
  const col = (label: string, v: number | null, big?: boolean) => (
    <div className="flex-1 px-3 text-center first:pl-0">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`font-extrabold tabular-nums text-slate-700 ${big ? 'text-[20px]' : 'text-[15px]'}`}>{v == null ? '—' : v}</div>
    </div>
  )
  return (
    <div className="mt-2.5 rounded-lg bg-slate-50 px-1 py-2">
      <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Điểm MT (thang 10, nhập tay)</div>
      <div className="flex divide-x divide-slate-200">
        {col('Tổng', tong, true)}
        {col('Cơ bản', cb)}
        {col('Nâng cao', nc)}
      </div>
      {truong != null && <div className="mt-1.5 px-3 text-[11px] text-slate-500">Điểm thi trường: <b className="text-slate-700">{truong}</b></div>}
    </div>
  )
}
function ActCard({ icon, ten, cb, nc, warn, diem }: { icon: string; ten: string; cb: Bucket; nc: Bucket; warn?: string; diem?: { tong: number | null; cb: number | null; nc: number | null; truong?: number | null } }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-[14px] font-bold text-slate-700">{icon} {ten}</div>
      <div className="flex divide-x divide-slate-100">
        <NumCol label="Tổng" pct={tongPct(cb, nc)} big />
        <NumCol label="Cơ bản" pct={cb.pct} />
        <NumCol label="Nâng cao" pct={nc.pct} />
      </div>
      {diem && <DiemRow tong={diem.tong} cb={diem.cb} nc={diem.nc} truong={diem.truong} />}
      {warn && <div className="mt-2.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700">⚠ {warn}</div>}
    </div>
  )
}
function TongQuanCards({ tq, missCount }: { tq: TongQuanHS; missCount: number }) {
  const h = tq.hoanThanh.toanBo.etMt, a = tq.hoatDong
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2.5 text-[14px] font-bold text-slate-700">🗺️ Bản đồ kiến thức</div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-bold text-emerald-700">{h.dat} Dạng bài Đạt yêu cầu</span>
          <span className="rounded-lg bg-amber-50 px-3 py-1 text-[13px] font-bold text-amber-700">{h.can_luyen} Dạng bài Cần luyện tập</span>
          <span className="rounded-lg bg-rose-50 px-3 py-1 text-[13px] font-bold text-rose-700">{h.yeu} Dạng bài còn Yếu</span>
        </div>
        <div className="mt-1.5 text-[11px] text-slate-400">Đã tính cả bài tập về nhà và bổ trợ</div>
      </div>
      <ActCard icon="📝" ten="Test cuối giờ (ET)" cb={a.etCoBan} nc={a.etNangCao} />
      <ActCard icon="🏠" ten="Bài tập về nhà" cb={a.btvnCoBan} nc={a.btvnNangCao} warn={missCount > 0 ? `Chưa hoàn thành BTVN ${missCount} lần trong tháng này` : undefined} />
      <ActCard icon="📅" ten="Test tháng (MT)" cb={a.mtCoBan} nc={a.mtNangCao}
        diem={{ tong: tq.diem.mt.tb, cb: tq.diem.mt.coBan, nc: tq.diem.mt.nangCao, truong: tq.diem.truong.tb }} />
    </div>
  )
}

const NX_FIELDS: { key: 'thai_do' | 'kien_thuc_ky_nang'; mucKey: 'muc_thai_do' | 'muc_kien_thuc'; label: string; ph: string; hx: string }[] = [
  { key: 'kien_thuc_ky_nang', mucKey: 'muc_kien_thuc', label: 'Kiến thức & Kĩ năng', ph: 'Mức nắm kiến thức, kĩ năng làm bài, mạnh/yếu…', hx: 'bg-indigo-500' },
  { key: 'thai_do', mucKey: 'muc_thai_do', label: 'Thái độ học tập', ph: 'Thái độ, chuyên cần, tinh thần học tập trong tháng…', hx: 'bg-emerald-500' },
]
function NhanXet({ hsId, mon, ym }: { hsId: string; mon: string; ym: string }) {
  const [val, setVal] = useState<BaoCaoPH>({ ...BC_EMPTY })
  const [prev, setPrev] = useState<BaoCaoPH>({ ...BC_EMPTY })
  const [saved, setSaved] = useState<string | null>(null)
  const [diemStr, setDiemStr] = useState('')
  const [saiStr, setSaiStr] = useState('')
  useEffect(() => { getBaoCaoPH(hsId, mon, ym).then(setVal).catch(() => {}) }, [hsId, mon, ym])
  useEffect(() => { getBaoCaoPH(hsId, mon, shiftYM(ym, -1)).then(setPrev).catch(() => setPrev({ ...BC_EMPTY })) }, [hsId, mon, ym])
  useEffect(() => { setDiemStr(val.nl_diem != null ? String(val.nl_diem) : ''); setSaiStr(val.nl_sai_so != null ? String(val.nl_sai_so) : '') }, [val.nl_diem, val.nl_sai_so])
  const save = async (patch: Partial<BaoCaoPH>, tag: string) => {
    setVal((p) => ({ ...p, ...patch }))
    try { await upsertBaoCaoPH(hsId, mon, ym, patch); setSaved(tag); setTimeout(() => setSaved((s) => (s === tag ? null : s)), 1500) } catch { /* ignore */ }
  }
  const box = 'w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-[13px] leading-relaxed focus:border-indigo-300 focus:bg-white focus:outline-none'
  const locked = val.cong_bo_at != null // đã công bố → khoá sửa (bấm "Mở lại để sửa" mới chỉnh được)
  const congBoLabel = val.cong_bo_at ? new Date(val.cong_bo_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Nhận xét của giáo viên</h3>
      {/* CỔNG CÔNG BỐ: nháp → PH không thấy; chốt → lên app. Khoá sửa khi đã công bố. */}
      <div className={`mb-2 flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[12px] ring-1 ${locked ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-amber-50 text-amber-800 ring-amber-200'}`}>
        <span className="font-semibold">{locked ? `✓ Đã công bố${congBoLabel ? ' · ' + congBoLabel : ''} — phụ huynh đang xem` : '● Nháp — phụ huynh CHƯA thấy báo cáo này'}</span>
        {locked
          ? <button onClick={() => save({ cong_bo_at: null }, 'congbo')} className="shrink-0 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 font-semibold text-emerald-700 hover:bg-emerald-100">Mở lại để sửa</button>
          : <button onClick={() => { if (confirm('Chốt & công bố báo cáo tháng này? Phụ huynh sẽ thấy ngay trên app.')) save({ cong_bo_at: new Date().toISOString() }, 'congbo') }} className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white shadow-sm hover:bg-emerald-500">Chốt &amp; công bố</button>}
      </div>
      <fieldset disabled={locked} className={locked ? 'opacity-60' : ''} style={{ border: 'none', margin: 0, padding: 0, minInlineSize: 'auto' }}>
      <div className="space-y-3">
        {/* NĂNG LỰC: band (GV chọn) + điểm + sai số */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-indigo-800">⚡ Năng lực tháng này</span>
            {saved === 'nl' && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">Band</span>
              <select value={val.nl_band ?? ''} onChange={(e) => save({ nl_band: e.target.value || null }, 'nl')}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-[13px] font-bold focus:border-indigo-300 focus:outline-none">
                <option value="">—</option>
                {BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">Điểm năng lực</span>
              <input type="number" step="0.1" min="0" max="10" value={diemStr}
                onChange={(e) => setDiemStr(e.target.value)}
                onBlur={() => { const n = parseFloat(diemStr); save({ nl_diem: diemStr.trim() === '' || isNaN(n) ? null : n }, 'nl') }}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-[13px] focus:border-indigo-300 focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">Sai số (±)</span>
              <input type="number" step="0.1" min="0" max="5" value={saiStr}
                onChange={(e) => setSaiStr(e.target.value)}
                onBlur={() => { const n = parseFloat(saiStr); save({ nl_sai_so: saiStr.trim() === '' || isNaN(n) ? null : n }, 'nl') }}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-[13px] focus:border-indigo-300 focus:outline-none" />
            </label>
          </div>
          {val.nl_diem != null && <p className="mt-1.5 text-[11px] text-slate-500">Dự kiến điểm thi: <b>{(val.nl_diem - (val.nl_sai_so ?? 0)).toFixed(1)} – {(val.nl_diem + (val.nl_sai_so ?? 0)).toFixed(1)}</b></p>}
        </div>

        {/* 7 CHỈ SỐ PHÁT TRIỂN (mức 1..5) + xu hướng so tháng trước */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-700">7 chỉ số phát triển</span>
            <span className="text-[10px] text-slate-400">so với tháng {Number(shiftYM(ym, -1).split('-')[1])}</span>
          </div>
          <div className="space-y-2">
            {CHI_SO.map((c) => {
              const lvl = val[c.key] as number | null
              const pv = prev[c.key] as number | null
              const tr = lvl != null && pv != null ? (lvl > pv ? 'up' : lvl < pv ? 'down' : 'flat') : null
              return (
                <div key={c.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12px] text-slate-700">{c.label}</span>
                    <span className="flex items-center gap-2 text-[10px]">
                      {pv != null && <span className="text-slate-400">Trước: {pv}</span>}
                      {tr === 'up' && <span className="font-bold text-emerald-600">↑ tiến bộ</span>}
                      {tr === 'down' && <span className="font-bold text-rose-600">↓ giảm</span>}
                      {tr === 'flat' && <span className="font-bold text-slate-400">→ giữ</span>}
                      {saved === c.key && <span className="text-emerald-600">✓</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} onClick={() => save({ [c.key]: lvl === i ? null : i }, c.key)}
                        className={`h-6 flex-1 rounded text-[10px] font-bold ring-1 transition ${lvl != null && i <= lvl ? `${mucBg(lvl)} text-white ring-transparent` : 'bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100'}`}>{i}</button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {NX_FIELDS.map((f) => {
          const lvl = val[f.mucKey] as number | null
          return (
          <div key={f.key} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-700">{f.label}</span>
              {(saved === f.key || saved === f.mucKey) && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
            </div>
            {/* Chọn mức thang 5 */}
            <div className="mb-2 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} onClick={() => save({ [f.mucKey]: lvl === i ? null : i }, f.mucKey)} title={SKILL_MUC[i - 1]}
                  className={`h-7 flex-1 rounded-md text-[11px] font-bold ring-1 transition ${lvl != null && i <= lvl ? `${f.hx} text-white ring-transparent` : 'bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100'}`}>{i}</button>
              ))}
              <span className="ml-1 w-[68px] shrink-0 text-right text-[11px] font-semibold text-slate-500">{lvl ? SKILL_MUC[lvl - 1] : '—'}</span>
            </div>
            <textarea defaultValue={val[f.key] as string ?? ''} onBlur={(e) => save({ [f.key]: e.target.value.trim() || null }, f.key)} placeholder={f.ph} rows={4} className={box} />
          </div>
          )
        })}
        {/* KẾT LUẬN: thanh mức + chữ */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-700">Kết luận</span>
            {saved === 'ket_luan' && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
          </div>
          <div className="mb-2 flex flex-col gap-1">
            {KET_LUAN_MUC.map((m) => (
              <button key={m.key} onClick={() => save({ ket_luan_muc: m.key }, 'muc')}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium ring-1 transition ${val.ket_luan_muc === m.key ? m.sel : 'bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100'}`}>
                <span>{m.emoji}</span>{m.label}
              </button>
            ))}
          </div>
          <textarea defaultValue={val.ket_luan ?? ''} onBlur={(e) => save({ ket_luan: e.target.value.trim() || null }, 'ket_luan')} placeholder="Kết luận chung về tháng…" rows={3} className={box} />
        </div>
        {/* MỤC TIÊU tháng tới (goal card trong ảnh PH) */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 shadow-sm">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-amber-800">🎯 Mục tiêu tháng tới</span>
            {saved === 'muc_tieu' && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
          </div>
          <textarea defaultValue={val.muc_tieu ?? ''} onBlur={(e) => save({ muc_tieu: e.target.value.trim() || null }, 'muc_tieu')} placeholder="Định hướng / mục tiêu cụ thể tháng tới…" rows={2} className={box} />
        </div>
      </div>
      </fieldset>
      <p className="mt-2 text-[11px] text-slate-400">{locked ? 'Đã công bố — bấm “Mở lại để sửa” nếu cần chỉnh.' : 'Tự lưu khi rời ô / chọn mức. Bấm “Chốt & công bố” để phụ huynh thấy.'} {mon} · tháng {Number(ym.split('-')[1])}/{ym.split('-')[0]}.</p>
    </div>
  )
}

// ── ẢNH GỬI PHỤ HUYNH — thẻ inline-hex (né oklch Tailwind v4), layout kiểu tab Kết quả app PH ──
const MUC_HEX: Record<string, { bg: string; fg: string; emoji: string; label: string }> = {
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

function PhAnhModal({ hsId, mon, ym, lopId, hsName, hsImg, lopTen, gvName, tq, missCount, onClose }: { hsId: string; mon: string; ym: string; lopId: string | null; hsName: string; hsImg: string | null; lopTen: string; gvName: string | null; tq: TongQuanHS; missCount: number; onClose: () => void }) {
  const [bc, setBc] = useState<BaoCaoPH>({ ...BC_EMPTY })
  const [khoiRank, setKhoiRank] = useState<KhoiRankMT | null>(null)
  const [lopRank, setLopRank] = useState<LopRankMT | null>(null)
  const [heRank, setHeRank] = useState<HeRankMT | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => { getBaoCaoPH(hsId, mon, ym).then(setBc).catch(() => {}) }, [hsId, mon, ym])
  useEffect(() => { setKhoiRank(null); getKhoiRankDiemMT(hsId, mon, ym).then(setKhoiRank).catch(() => {}) }, [hsId, mon, ym])
  useEffect(() => { setLopRank(null); if (lopId) getLopRankDiemMT(hsId, lopId, mon, ym).then(setLopRank).catch(() => {}) }, [hsId, lopId, mon, ym])
  useEffect(() => { setHeRank(null); getHeRankDiemMT(hsId, mon, ym).then(setHeRank).catch(() => {}) }, [hsId, mon, ym])

  function handleCopy() {
    const el = cardRef.current; if (!el) return
    const cardHTML = el.outerHTML
    const fname = `Report_${hsName.replace(/\s+/g, '')}_${ym}.png`
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
      + '<title>Report ' + hsName + '</title><scr' + 'ipt src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></scr' + 'ipt>'
      + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:12px;display:flex;flex-direction:column;align-items:center}'
      + '.btn{width:100%;max-width:400px;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;background:#16a34a;color:#fff;margin-bottom:10px}.btn:hover{opacity:.9}'
      + '#msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px}#c{background:#fff;border-radius:18px;overflow:hidden}</style></head><body>'
      + '<button class="btn" onclick="cp()">📋 Copy ảnh (paste vào Zalo)</button><div id="c">' + cardHTML + '</div><p id="msg"></p>'
      + '<scr' + 'ipt>async function cp(){var m=document.getElementById("msg");m.textContent="⏳ Đang xử lý...";try{var n=document.getElementById("c");var cv=await html2canvas(n,{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false,width:n.scrollWidth,height:n.scrollHeight});cv.toBlob(async function(b){try{await navigator.clipboard.write([new ClipboardItem({"image/png":b})]);m.textContent="✅ Đã copy! Ctrl+V vào Zalo.";}catch(e){var u=URL.createObjectURL(b);var a=document.createElement("a");a.href=u;a.download=' + JSON.stringify(fname) + ';a.click();URL.revokeObjectURL(u);m.textContent="✅ Đã tải ảnh!";}},"image/png");}catch(e){m.textContent="Lỗi: "+e.message;}}</scr' + 'ipt></body></html>'
    const p = window.open('', '_blank', 'width=460,height=900,scrollbars=yes')
    if (!p) { alert('Trình duyệt chặn popup. Bật "Allow pop-ups" cho site này.'); return }
    p.document.write(html); p.document.close()
  }

  const muc = bc.ket_luan_muc ? MUC_HEX[bc.ket_luan_muc] : null
  const a = tq.hoatDong, hh = tq.hoanThanh.toanBo.etMt
  const trendV = tq.trend.hoanThanhToanBo
  // 3 HẠNG (Thùy 08-19, thay cho %hoàn thành gây confuse PH) — LỚP ⊂ HỆ ⊂ KHỐI (phạm vi lồng nhau tăng
  // dần), NGANG NHAU về hiển thị (Thùy: "3 cái rank này ngang nhau"), tách RIÊNG khỏi khối "xu hướng"
  // (chữ + trend %) — không nhét chung 1 hàng như bản trước. Dùng chung style statusC (3 ô ngang có sẵn).
  const rankHex = (r: { rankNow: number; rankTotal: number } | null) => {
    if (!r) return '#94a3b8'
    const pct = Math.round(((r.rankTotal - r.rankNow) / Math.max(1, r.rankTotal - 1)) * 100)
    return pct >= 80 ? '#12a875' : pct >= 50 ? '#e29a23' : '#e45858'
  }
  const rankBox = (label: string, r: { rankNow: number; rankTotal: number } | null) => (
    <div style={{ padding: '10px 6px 9px', textAlign: 'center', background: '#fff', border: '1px solid #e8edf5', borderRadius: 15 }}>
      <b style={{ display: 'block', fontSize: 17, color: rankHex(r), lineHeight: 1 }}>{r ? `#${r.rankNow}` : '—'}</b>
      <small style={{ display: 'block', fontSize: 7.5, color: '#a0aabd', fontWeight: 800, letterSpacing: .3, marginTop: 3 }}>{r ? `/${r.rankTotal}` : 'chưa có dữ liệu'}</small>
      <small style={{ display: 'block', fontSize: 9, color: '#5a6a83', fontWeight: 800, lineHeight: 1.15, marginTop: 1 }}>{label}</small>
    </div>
  )
  // Skill bar THANG 5 (GV chọn) + text nhận xét kèm tag.
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
  // MT: dùng ĐIỂM THẬT (thang 10, nhập tay) — KHÁC assessRow ở trên (%đúng câu). MT nhập riêng qua
  // ky_thi/diem_thi, không suy từ Đ/C/S như ET/BTVN nên KHÔNG quy đổi s10(%) nữa.
  // Chỉ TỔNG mới đủ điều kiện tô màu ngưỡng (đúng thang 10 thật). Cơ bản/Nâng cao là 2 CỘT ĐIỂM RIÊNG,
  // thang điểm KHÁC NHAU (vd cơ bản max 9đ, nâng cao max 1đ — nâng cao không bắt buộc) → số THẤP tuyệt
  // đối ở nâng cao là BÌNH THƯỜNG, không phải yếu kém. Tô đỏ/xanh theo ngưỡng 0-10 ở đây là SAI, gây hiểu
  // lầm cho phụ huynh (Thùy 08-19). Để màu trung tính, không so ngưỡng.
  const hexDiem = (v: number | null) => v == null ? '#cbd5e1' : v >= 8 ? '#059669' : v >= 5 ? '#d97706' : '#e11d48'
  const cellDiem = (lb: string, v: number | null, sz: number, colored?: boolean) => <div><span style={{ fontSize: 7.5, color: '#94a3b8', display: 'block' }}>{lb}</span><span style={{ fontSize: sz, fontWeight: 900, color: colored ? hexDiem(v) : v == null ? '#cbd5e1' : '#15233b' }}>{v == null ? '—' : v}</span></div>
  const assessRowDiem = (ten: string, hx: string, tong: number | null, cb: number | null, nc: number | null) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr .6fr .6fr .6fr', gap: 6, alignItems: 'center', minHeight: 46, borderTop: '1px dashed #e9edf4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, fontWeight: 800, color: '#15233b' }}><span style={{ width: 9, height: 9, borderRadius: 5, background: hx, boxShadow: `0 0 0 4px ${hx}22` }} />{ten}</div>
      {cellDiem('Tổng', tong, 16, true)}{cellDiem('Cơ bản', cb, 15)}{cellDiem('Nâng cao', nc, 15)}
    </div>
  )
  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-900/70" onClick={onClose}>
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold">Ảnh report gửi phụ huynh — {hsName}</span>
        <button onClick={handleCopy} className="ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500">📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div ref={cardRef} style={{ width: 390, margin: '0 auto', background: '#f8fbff', borderRadius: 28, overflow: 'hidden', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif", boxShadow: '0 20px 55px rgba(26,52,95,.16)', border: '1px solid rgba(255,255,255,.8)' }}>
          {/* HERO */}
          <div style={{ position: 'relative', minHeight: 172, padding: '21px 21px 24px', color: '#fff', background: 'radial-gradient(circle at 92% 18%, rgba(78,215,219,.5), transparent 27%), radial-gradient(circle at 18% -10%, rgba(132,151,255,.7), transparent 34%), linear-gradient(135deg,#12315f 0%,#2451b9 60%,#2c77d8 100%)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 185, height: 185, right: -88, bottom: -125, border: '28px solid rgba(255,255,255,.08)', borderRadius: '50%' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 900, letterSpacing: .5, fontSize: 13 }}>
                {/* Logo BK: B hồng · K cam · tam giác + xanh · tròn − lục */}
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
            {/* XU HƯỚNG (kết luận GV + trend %) — chữ thuần, KHÔNG còn ring % ở đây (đổi sang 3 hạng riêng bên dưới) */}
            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, boxShadow: '0 7px 18px rgba(35,63,104,.055)', padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: '#315fdd', fontWeight: 900, textTransform: 'uppercase', letterSpacing: .7 }}>Xu hướng tháng này</div>
              <div style={{ fontSize: 16, fontWeight: 800, margin: '4px 0', color: '#15233b', letterSpacing: -.15 }}>{muc ? `${muc.emoji} ${muc.label}` : 'Kết quả học tập tháng'}</div>
              {trendV != null && trendV !== 0 ? <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', fontSize: 10, fontWeight: 900, color: trendV > 0 ? '#12a875' : '#e45858', background: trendV > 0 ? '#ecfbf5' : '#fdecec', padding: '6px 8px', borderRadius: 999 }}>{trendV > 0 ? '↗' : '↘'} {trendV > 0 ? 'Tăng' : 'Giảm'} {Math.abs(trendV)}% so với kỳ trước</span> : null}
            </div>
            {/* XẾP HẠNG ĐIỂM MT — 3 phạm vi ngang nhau: Lớp · Hệ · Khối (Thùy 08-19) */}
            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, padding: '13px 14px 10px', marginBottom: 10, boxShadow: '0 7px 18px rgba(35,63,104,.055)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ width: 31, height: 31, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#eef0ff', fontSize: 14 }}>🏆</span>
                <div><div style={{ fontSize: 13, fontWeight: 800, color: '#15233b' }}>Xếp hạng Điểm MT tháng này</div><div style={{ fontSize: 9, color: '#70809b' }}>Lớp {lopTen} · Hệ {heRank?.he ?? '—'} · Khối {khoiRank?.khoi ?? '—'}</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
                {rankBox('Lớp', lopRank)}{rankBox('Hệ', heRank)}{rankBox('Khối', khoiRank)}
              </div>
            </div>
            {/* NHẬN XÉT GV + skill bars (thang 5) + text kèm tag */}
            {(bc.ket_luan || bc.thai_do || bc.kien_thuc_ky_nang || bc.muc_kien_thuc || bc.muc_thai_do) ? <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, padding: 14, marginBottom: 10, boxShadow: '0 7px 18px rgba(35,63,104,.055)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <span style={{ width: 31, height: 31, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#eef0ff', fontSize: 15 }}>✦</span>
                <div><div style={{ fontSize: 13, fontWeight: 800, color: '#15233b' }}>Nhận xét của giáo viên</div><div style={{ fontSize: 9, color: '#70809b' }}>{gvName ? `GV ${gvName}` : 'Đánh giá cá nhân theo quá trình học'}</div></div>
              </div>
              {bc.ket_luan ? <p style={{ fontSize: 11, lineHeight: 1.48, color: '#42516a', margin: '0 0 4px', whiteSpace: 'pre-wrap' }}>{bc.ket_luan}</p> : null}
              {bar5('Kiến thức & kỹ năng', bc.muc_kien_thuc, '#315fdd', bc.kien_thuc_ky_nang)}
              {bar5('Thái độ học tập', bc.muc_thai_do, '#12a875', bc.thai_do)}
            </div> : null}
            {/* STATUS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginBottom: 10 }}>{statusC(hh.dat, 'Đạt yêu cầu', '#12a875')}{statusC(hh.can_luyen, 'Cần luyện tập', '#e29a23')}{statusC(hh.yeu, 'Còn yếu', '#e45858')}</div>
            {/* ĐÁNH GIÁ */}
            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 20, padding: '13px 14px 10px', marginBottom: 10, boxShadow: '0 7px 18px rgba(35,63,104,.055)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ width: 31, height: 31, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#eef0ff', fontSize: 14 }}>📊</span>
                <div><div style={{ fontSize: 13, fontWeight: 800, color: '#15233b' }}>Kết quả đánh giá trong tháng</div><div style={{ fontSize: 9, color: '#70809b' }}>Thang điểm 10</div></div>
              </div>
              {assessRow('Test cuối giờ', '#315fdd', a.etCoBan, a.etNangCao, true)}
              {assessRow('Bài tập về nhà', '#12a875', a.btvnCoBan, a.btvnNangCao)}
              {assessRowDiem('Test tháng (MT)', '#e29a23', tq.diem.mt.tb, tq.diem.mt.coBan, tq.diem.mt.nangCao)}
              {missCount > 0 ? <div style={{ fontSize: 9.5, color: '#da7d00', marginTop: 6 }}>⚠ Chưa hoàn thành BTVN {missCount} lần trong tháng</div> : null}
            </div>
            {/* MỤC TIÊU */}
            {bc.muc_tieu ? <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 10, alignItems: 'center', background: 'linear-gradient(135deg,#fff9e9,#fff)', border: '1px solid #f3e7bf', borderRadius: 20, padding: '12px 13px', marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 13, display: 'grid', placeItems: 'center', background: '#fff0bd', fontSize: 17 }}>🎯</div>
              <div><b style={{ fontSize: 11, display: 'block', marginBottom: 3 }}>Mục tiêu tháng tới</b><p style={{ fontSize: 9.5, lineHeight: 1.4, color: '#776844', margin: 0, whiteSpace: 'pre-wrap' }}>{bc.muc_tieu}</p></div>
            </div> : null}
            <p style={{ textAlign: 'center', color: '#8c99ad', fontSize: 8.5, margin: '10px 0 1px' }}>BK Academy · Đồng hành cùng tiến bộ của con mỗi ngày</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
