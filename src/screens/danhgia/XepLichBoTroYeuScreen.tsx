// Màn "Xếp bổ trợ yếu" (bước 6 — PLAN-botro-yeu.md). Case đã chọn dạng (bước 4) hiện ở đây để OPS
// chốt ngày/giờ/phòng/người dạy với phụ huynh. Buổi = `buoi_hoc(loai='bo_tro_yeu')`, đối xứng buổi
// bù — "Việc của tôi" tự nhận qua `nguoi_day_tg` (getMyTasks, gami.ts), KHÔNG cần bảng viec riêng.
// Phòng dùng mảng tạm (giống TKBScreen.tsx) — KHÔNG check trùng lịch (PLAN §0 mục 9, chờ dự án
// Quản lý phòng học riêng — Thùy 08-17: "phải làm trước luôn", đang làm ở worktree khác).
import { useEffect, useMemo, useState } from 'react'
import {
  listCaseChoXepLich, taoBuoiBoTroYeu, listBuoiCuaCase,
  type CaseChoXep, type BuoiBoTroYeuDaXep,
} from '../../lib/botro_yeu'
import { getLevels } from '../../lib/danhgia'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

// Tạm dùng chung 6 phòng như TKBScreen.tsx — KHÔNG có nguồn phòng dùng chung, không check trùng.
const ROOMS_TAM = ['P101', 'P102', 'P201', 'P202', 'P301', 'P302']
const MUC_TEN: Record<number, string> = { 1: 'Mức 1 · trước/sau giờ', 2: 'Mức 2 · buổi riêng (TA)', 3: 'Mức 2 · buổi riêng (GV cao cấp)' }
const MUC_CLS: Record<number, string> = { 1: 'bg-slate-100 text-slate-600', 2: 'bg-amber-50 text-amber-700', 3: 'bg-rose-50 text-rose-700' }

export default function XepLichBoTroYeuScreen() {
  const [items, setItems] = useState<CaseChoXep[]>([])
  const [muc, setMuc] = useState<Map<string, number>>(new Map()) // hoc_sinh_id → level kiến thức
  const [loading, setLoading] = useState(true)
  const [moId, setMoId] = useState<string | null>(null)

  const reload = () => {
    setLoading(true)
    listCaseChoXepLich().then(async (r) => {
      setItems(r)
      const byMon = new Map<string, string[]>()
      for (const c of r) byMon.set(c.mon, [...(byMon.get(c.mon) ?? []), c.hoc_sinh_id])
      const m = new Map<string, number>()
      for (const [mon, ids] of byMon) {
        const lv = await getLevels(ids, mon)
        for (const id of ids) m.set(id, lv.get(id)?.kien_thuc ?? 0)
      }
      setMuc(m)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { reload() }, [])

  const choXep = useMemo(() => items.filter((c) => !c.daXep), [items])
  const daXep = useMemo(() => items.filter((c) => c.daXep), [items])
  const moCase = items.find((c) => c.id === moId) ?? null

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1000px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Xếp bổ trợ yếu</h1>
          <p className="mt-1 text-[13px] text-slate-500">Case đã chọn dạng — chốt giờ học, phòng, người dạy với phụ huynh.</p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            Chưa có case nào sẵn sàng — cần chọn dạng ở "Nội dung bổ trợ yếu" trước.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-slate-500">Chờ xếp lịch ({choXep.length})</h2>
              <div className="space-y-3">
                {choXep.map((c) => (
                  <CaseCard key={c.id} c={c} mucLv={muc.get(c.hoc_sinh_id) ?? 0} onMo={() => setMoId(c.id)} />
                ))}
                {choXep.length === 0 && <p className="text-[12px] text-slate-400">Không còn case nào.</p>}
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-slate-500">Đã xếp ({daXep.length})</h2>
              <div className="space-y-3">
                {daXep.map((c) => (
                  <CaseCard key={c.id} c={c} mucLv={muc.get(c.hoc_sinh_id) ?? 0} onMo={() => setMoId(c.id)} daXep />
                ))}
                {daXep.length === 0 && <p className="text-[12px] text-slate-400">Chưa có case nào.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
      {moCase && <XepModal c={moCase} mucLv={muc.get(moCase.hoc_sinh_id) ?? 0} onDong={() => setMoId(null)} onDoi={reload} />}
    </section>
  )
}

function CaseCard({ c, mucLv, onMo, daXep }: { c: CaseChoXep; mucLv: number; onMo: () => void; daXep?: boolean }) {
  return (
    <button onClick={onMo}
      className={`w-full rounded-2xl bg-white p-4 text-left ring-1 transition hover:ring-indigo-300 ${daXep ? 'ring-emerald-200' : 'ring-slate-200'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[14px] font-semibold text-slate-800">
            {c.ho_ten} <span className="font-normal text-slate-400">· {c.mon}{c.khoi ? ` · Khối ${c.khoi}` : ''}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${MUC_CLS[mucLv] ?? MUC_CLS[1]}`}>{MUC_TEN[mucLv] ?? `L${mucLv}`}</span>
            <span className="text-[11px] text-slate-400">{c.soDang} dạng</span>
          </div>
        </div>
        {daXep && <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">Đã xếp</span>}
      </div>
    </button>
  )
}

function XepModal({ c, mucLv, onDong, onDoi }: { c: CaseChoXep; mucLv: number; onDong: () => void; onDoi: () => void }) {
  const [buois, setBuois] = useState<BuoiBoTroYeuDaXep[]>([])
  const [loading, setLoading] = useState(true)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [form, setForm] = useState(false)
  const [ngay, setNgay] = useState('')
  const [gio, setGio] = useState('')
  const [phong, setPhong] = useState(ROOMS_TAM[0])
  const [nguoiDay, setNguoiDay] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  const reload = () => { setLoading(true); listBuoiCuaCase(c.id).then(setBuois).finally(() => setLoading(false)) }
  useEffect(() => { reload(); listNhanSu().then(setNss).catch(() => {}) }, [c.id]) // eslint-disable-line
  const opts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])

  async function xacNhan() {
    if (!ngay) { setLoi('Chọn ngày'); return }
    setLoi(null); setBusy(true)
    try {
      await taoBuoiBoTroYeu({ boTroYeuId: c.id, hocSinhId: c.hoc_sinh_id, ngay, gio_bat_dau: gio || null, phong, nguoi_day_tg: nguoiDay })
      setForm(false); setNgay(''); setGio(''); setNguoiDay(null)
      reload(); onDoi()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div className="max-h-[85vh] w-[560px] max-w-full overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-[16px] font-bold text-slate-800">{c.ho_ten} · {c.mon}</h3>
          <button onClick={onDong} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <span className={`mb-4 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${MUC_CLS[mucLv] ?? MUC_CLS[1]}`}>{MUC_TEN[mucLv] ?? `L${mucLv}`}</span>

        {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : buois.length === 0 ? (
          <p className="mb-4 text-[13px] text-slate-400">Chưa có buổi nào.</p>
        ) : (
          <ul className="mb-4 space-y-1.5">
            {buois.map((b) => (
              <li key={b.id} className="rounded-lg bg-slate-50 px-3 py-2 text-[13px]">
                <span className="font-medium text-slate-700">{b.ngay}{b.gio_bat_dau ? ` · ${b.gio_bat_dau.slice(0, 5)}` : ''}</span>
                {b.phong && <span className="ml-1.5 text-slate-500">· {b.phong}</span>}
                {b.nguoi_day_tg && <span className="ml-1.5 text-slate-500">· {nss.find((n) => n.id === b.nguoi_day_tg)?.ho_ten ?? b.nguoi_day_tg}</span>}
                {b.trang_thai === 'huy' && <span className="ml-1.5 rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">đã huỷ</span>}
              </li>
            ))}
          </ul>
        )}

        {!form ? (
          <button onClick={() => setForm(true)} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700">
            + Xếp buổi mới
          </button>
        ) : (
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Ngày *</label>
                <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Giờ</label>
                <input type="time" value={gio} onChange={(e) => setGio(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Phòng</label>
                <select value={phong} onChange={(e) => setPhong(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400">
                  {ROOMS_TAM.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                Người dạy {mucLv >= 3 ? '(GV cao cấp)' : '(TA)'}
              </label>
              <SearchSelect value={nguoiDay} onChange={setNguoiDay} options={opts} placeholder="Chọn người dạy…" />
            </div>
            <p className="text-[11px] text-amber-600">⚠ Phòng chưa kiểm tra trùng lịch tự động — hỏi OPS khác trước khi chốt.</p>
            {loi && <p className="text-[12px] text-rose-600">{loi}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setForm(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Huỷ</button>
              <button onClick={xacNhan} disabled={busy} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                {busy ? 'Đang lưu…' : 'Xác nhận đã xếp'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
