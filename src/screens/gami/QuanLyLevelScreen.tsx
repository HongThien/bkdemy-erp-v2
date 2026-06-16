// QUẢN LÝ LEVEL (staff, gu SaaS) — nhập điểm 13 kì thi/mùa → verdict → Level (Σ, max 21).
// Chọn lớp (→ môn + roster) → list kì thi (tạo mới) → chọn 1 kì thi nhập điểm → ma trận Level.
import { useEffect, useState } from 'react'
import { listLop, listHSCuaLop, type Lop, type HSTrongLop } from '../../lib/nhansu'
import {
  listKyThi, createKyThi, listDiemThiByKyThi, upsertDiemThi, currentMua, verdictDiem,
  type KyThi, type DiemThi, type Verdict,
} from '../../lib/thanhtich'
import SearchSelect from '../../components/SearchSelect'

const LOAI: Record<string, string> = { truong: 'Thi trường', mt_sat_hach: 'BK sát hạch (MT)', khao_sat_thang: 'Khảo sát tháng' }
const HE_SO: Record<string, number> = { truong: 2, mt_sat_hach: 2, khao_sat_thang: 1 }
const DOT: Record<string, string> = { giua_ky_1: 'Giữa kì I', cuoi_ky_1: 'Cuối kì I', giua_ky_2: 'Giữa kì II', cuoi_ky_2: 'Cuối kì II' }
const VERDICTS: Verdict[] = ['dat', 'gan_dat', 'khong_dat']
const V_LABEL: Record<Verdict, string> = { dat: 'Đạt', gan_dat: 'Gần', khong_dat: 'Không' }
const V_CLS: Record<Verdict, string> = { dat: 'bg-emerald-500 text-white', gan_dat: 'bg-amber-500 text-white', khong_dat: 'bg-rose-500 text-white' }
const V_DOT: Record<Verdict, string> = { dat: 'bg-emerald-100 text-emerald-700', gan_dat: 'bg-amber-100 text-amber-700', khong_dat: 'bg-rose-100 text-rose-600' }
const hsName = (h: HSTrongLop) => h.hoc_sinh?.ho_ten ?? '?'

export default function QuanLyLevelScreen() {
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
  const heSoOf = (kyThiId: string) => kyThis.find((k) => k.id === kyThiId)?.he_so ?? 1
  const levelOf = (hsId: string) => diems.filter((d) => d.hoc_sinh_id === hsId).reduce((s, d) => s + verdictDiem(d.verdict, heSoOf(d.ky_thi_id)), 0)
  const maxLevel = kyThis.reduce((s, k) => s + k.he_so, 0) // tối đa thực tế theo số kì thi đã tạo

  async function save(kyThiId: string, hs: HSTrongLop, verdict: Verdict, diem: number | null, vuot: boolean) {
    await upsertDiemThi({ kyThiId, hocSinhId: hs.hoc_sinh_id, diem, bandLucThi: hs.muc_nang_luc_id ?? null, verdict, vuotBand: vuot })
    setDiems((prev) => [...prev.filter((d) => !(d.ky_thi_id === kyThiId && d.hoc_sinh_id === hs.hoc_sinh_id)),
      { ky_thi_id: kyThiId, hoc_sinh_id: hs.hoc_sinh_id, diem, band_luc_thi: hs.muc_nang_luc_id ?? null, verdict, vuot_band: vuot }])
  }

  const selKy = kyThis.find((k) => k.id === sel) ?? null

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Quản lý Level</span>
        <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[12px] font-semibold text-violet-600">Mùa {mua}</span>
        <div className="w-72">
          <SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…"
            options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ` · K${l.khoi}` : ''}` }))} />
        </div>
        {lop && <span className="text-[12px] text-slate-400">Môn <b className="text-slate-600">{lop.mon}</b> · {roster.length} HS · {kyThis.length}/13 kì thi</span>}
      </div>

      {!lop ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Chọn một lớp để nhập điểm sát hạch.</div>
      ) : loading ? (
        <div className="p-8 text-sm text-slate-400">Đang tải…</div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-6 space-y-5">
          {/* Kì thi: chip chọn + thêm */}
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

          {/* Nhập điểm cho 1 kì thi */}
          {selKy && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-[13px] font-semibold text-slate-800">Nhập điểm · {selKy.ten} <span className="text-slate-400">({LOAI[selKy.loai]}, hệ số {selKy.he_so})</span></div>
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400"><th className="py-1.5">Học sinh</th><th className="w-24">Điểm /10</th><th className="w-56">Verdict</th><th className="w-24">Vượt band</th></tr></thead>
                <tbody>
                  {roster.map((hs) => <RowEntry key={hs.hoc_sinh_id} hs={hs} init={diemOf(selKy.id, hs.hoc_sinh_id)} onSave={(v, d, vu) => save(selKy.id, hs, v, d, vu)} />)}
                </tbody>
              </table>
            </div>
          )}

          {/* Ma trận Level */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[12px]">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left">Học sinh</th>
                  {kyThis.map((k) => <th key={k.id} className="px-2 py-2 text-center" title={`${LOAI[k.loai]} ·×${k.he_so}`}>{k.ten}</th>)}
                  <th className="px-3 py-2 text-center">Level</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((hs) => (
                  <tr key={hs.hoc_sinh_id} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 font-medium text-slate-700">{hsName(hs)}</td>
                    {kyThis.map((k) => {
                      const d = diemOf(k.id, hs.hoc_sinh_id)
                      return <td key={k.id} className="px-2 py-1.5 text-center">
                        {d ? <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${V_DOT[d.verdict]}`}>{d.diem ?? V_LABEL[d.verdict]}{d.vuot_band ? '↑' : ''}</span> : <span className="text-slate-300">—</span>}
                      </td>
                    })}
                    <td className="px-3 py-1.5 text-center font-bold text-indigo-600">{levelOf(hs.hoc_sinh_id)}<span className="text-[10px] font-medium text-slate-400">/{maxLevel || 21}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {creating && lop && <CreateModal lop={lop} mua={mua} onClose={() => setCreating(false)} onCreated={() => { setCreating(false); reload(lop) }} />}
    </div>
  )
}

function RowEntry({ hs, init, onSave }: { hs: HSTrongLop; init: DiemThi | null; onSave: (v: Verdict, d: number | null, vu: boolean) => void }) {
  const [diem, setDiem] = useState(init?.diem != null ? String(init.diem) : '')
  const [verdict, setVerdict] = useState<Verdict | null>(init?.verdict ?? null)
  const [vuot, setVuot] = useState(init?.vuot_band ?? false)
  const d = () => (diem.trim() === '' ? null : Number(diem))
  const pick = (v: Verdict) => { setVerdict(v); onSave(v, d(), vuot) }
  return (
    <tr className="border-t border-slate-100">
      <td className="py-1.5 font-medium text-slate-700">{hs.hoc_sinh?.ho_ten ?? '?'}</td>
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

function CreateModal({ lop, mua, onClose, onCreated }: { lop: Lop; mua: string; onClose: () => void; onCreated: () => void }) {
  const [loai, setLoai] = useState<KyThi['loai']>('khao_sat_thang')
  const [ten, setTen] = useState('')
  const [dot, setDot] = useState<string>('')
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const coDot = loai !== 'khao_sat_thang'

  async function tao() {
    setBusy(true)
    try {
      await createKyThi({ ten: ten.trim() || LOAI[loai], loai, he_so: HE_SO[loai], dot: coDot && dot ? dot : null, ngay: ngay || null, mon: lop.mon, khoi: lop.khoi, mua, buoi_hoc_id: null })
      onCreated()
    } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[440px] max-w-[95vw] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-base font-semibold text-slate-900">Thêm kì thi · {lop.mon} K{lop.khoi}</div>
        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Loại</label>
        <div className="mb-3 flex gap-1.5">
          {(Object.keys(LOAI) as KyThi['loai'][]).map((l) => (
            <button key={l} onClick={() => setLoai(l)} className={`flex-1 rounded-lg px-2 py-2 text-[12px] font-medium ${loai === l ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{LOAI[l]}<div className="text-[10px] opacity-70">hệ số {HE_SO[l]}</div></button>
          ))}
        </div>
        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Tên</label>
        <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder={LOAI[loai]} className="mb-3 h-9 w-full rounded-lg border border-slate-300 px-3 text-[13px]" autoFocus />
        {coDot && (
          <>
            <label className="mb-1 block text-[12px] font-semibold text-slate-500">Đợt (ghép cặp trường ↔ BK)</label>
            <select value={dot} onChange={(e) => setDot(e.target.value)} className="mb-3 h-9 w-full rounded-lg border border-slate-300 px-2 text-[13px]">
              <option value="">— chọn đợt —</option>
              {Object.entries(DOT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
