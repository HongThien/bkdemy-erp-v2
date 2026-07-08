// Điểm danh test đầu vào — OPS tạo lúc HS THẬT SỰ tới test (đặt lịch trước hoặc walk-in).
// Bằng chứng thật "đã đến test" cho ops-lead tuyển sinh audit L5→L6 (xem tuyensinh.ts).
// Leaf riêng (KHÔNG nhét vào màn Tuyển sinh `tuyensinh` — OPS chỉ cần đúng việc này, không cần
// thấy/sửa cả phễu L5-L8) — cùng nguyên tắc tách leaf đã áp cho Report/Prep (BKDEMY_OPS_SPEC_DETAIL.md).
import { useEffect, useState } from 'react'
import {
  listCaTestDangChay, listCaTestHoanThanh, taoCaTest, uploadCaTestBai, ganBaiCaTest, hoanThanhCaTest,
  listUngVienL5, getUngVien, gioKetThucCaTest, THOI_LUONG_OPTIONS, MON_OPTIONS,
  type CaTest, type TaoCaTestInput, type MonTS,
} from '../../lib/tuyensinh'
import { listDeTest, ganDeCaTest, listCanTraBai, listDaTraBai, dongTraBai, getPhieuKetQua, type DeTest, type CaTestChoTraBai, type PhieuKetQua } from '../../lib/detest'
import { PhieuTestModal } from '../tuyensinh/PhieuTestDauVao'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { homNayVN, mucDeadline, nhanConLai, type DeadlineMuc } from '../../lib/tuan'
import SearchSelect from '../../components/SearchSelect'
import { useIsMobile } from '../../hooks/useIsMobile'

const DEADLINE_TONE: Record<DeadlineMuc, string> = { qua_han: 'text-rose-600', sat: 'text-orange-600', gan: 'text-amber-600', con_nhieu: 'text-slate-400' }
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

export default function DiemDanhTestScreen() {
  const [dangChay, setDangChay] = useState<CaTest[]>([])
  const [hoanThanhHomNay, setHoanThanhHomNay] = useState<CaTest[]>([])
  const [deTests, setDeTests] = useState<DeTest[]>([])
  const [canTraBai, setCanTraBai] = useState<CaTestChoTraBai[]>([])
  const [daTraBai, setDaTraBai] = useState<CaTestChoTraBai[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  async function reload() {
    setLoading(true)
    try {
      const [a, b, d, c, t] = await Promise.all([listCaTestDangChay(), listCaTestHoanThanh(homNayVN()), listDeTest(), listCanTraBai(), listDaTraBai()])
      setDangChay(a); setHoanThanhHomNay(b); setDeTests(d); setCanTraBai(c); setDaTraBai(t)
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(id) }, [])

  const isMobile = useIsMobile()
  return (
    <div className="h-full overflow-auto">
    <div className={isMobile ? 'mx-auto max-w-[1100px] p-3' : 'mx-auto max-w-[1100px] p-6'}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Điểm danh test</h2>
          <p className="text-[12px] text-slate-400">HS tới test đầu vào (đặt lịch trước hoặc walk-in) — đếm ngược tới giờ kết thúc dự kiến.</p>
        </div>
        <button onClick={() => setForm(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo test đầu vào</button>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : dangChay.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có ca test nào đang chạy.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {dangChay.map((c) => <CaTestCard key={c.id} c={c} now={now} deTests={deTests} onChanged={reload} />)}
        </div>
      )}

      {hoanThanhHomNay.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong hôm nay ({hoanThanhHomNay.length})</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {hoanThanhHomNay.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                <span className="font-semibold text-slate-700">{c.ungVien.hoTenHs}</span> · {c.mon} · {c.gioBatDau.slice(0, 5)} ({c.thoiLuongPhut}')
                {c.baiUrl && <a href={c.baiUrl} target="_blank" rel="noreferrer" className="ml-1.5 text-indigo-500 hover:underline">📄 bài</a>}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* STORY 4 — Trả bài: chờ ở đây sau khi nhận xét xong (đội học thuật) */}
      <div className="mt-8">
        <h3 className="mb-1 text-[16px] font-semibold text-slate-800">Trả bài</h3>
        <p className="mb-3 text-[12px] text-slate-400">Xem/xuất phiếu → gửi Zalo cho PH → đóng.</p>
        {canTraBai.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">Không có bài nào cần trả.</div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {canTraBai.map((c) => <TraBaiCard key={c.id} c={c} onChanged={reload} />)}
          </div>
        )}
        {daTraBai.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã trả bài ({daTraBai.length})</summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {daTraBai.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                  <span className="font-semibold text-slate-700">{c.hoTenHs}</span> · {c.mon}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {form && <TaoCaTestModal onClose={() => setForm(false)} onDone={async () => { setForm(false); await reload() }} />}
    </div>
    </div>
  )
}

function TraBaiCard({ c, onChanged }: { c: CaTestChoTraBai; onChanged: () => void }) {
  const [phieu, setPhieu] = useState<PhieuKetQua | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function xemPhieu() { try { setPhieu(await getPhieuKetQua(c.id)) } catch (e: any) { setErr(e.message ?? String(e)) } }
  async function dong() {
    setBusy(true); setErr(null)
    try { await dongTraBai(c.id); onChanged() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
      <div className="mb-2 text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Lớp ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}</div>
      <div className="flex gap-2">
        <button onClick={xemPhieu} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">📋 Xem/Xuất phiếu</button>
        <button onClick={dong} disabled={busy} className="ml-auto rounded-md bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">✓ Đã gửi, đóng</button>
      </div>
      {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
      {phieu && <PhieuTestModal p={phieu} onClose={() => setPhieu(null)} />}
    </div>
  )
}

function CaTestCard({ c, now, deTests, onChanged }: { c: CaTest; now: number; deTests: DeTest[]; onChanged: () => void }) {
  const [baiUrl, setBaiUrl] = useState<string | null>(c.baiUrl)
  const [deTestId, setDeTestId] = useState(c.deTestId)
  const [chonDe, setChonDe] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const deadline = gioKetThucCaTest(c)
  const muc = mucDeadline(deadline, now) ?? 'con_nhieu'
  const deOpts = deTests.filter((d) => d.active && d.mon === c.mon && d.khoi === c.ungVien.khoi)
  const deHienTai = deTests.find((d) => d.id === deTestId)

  async function chonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { const url = await uploadCaTestBai(f); await ganBaiCaTest(c.id, url); setBaiUrl(url) }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function ganDe() {
    if (!chonDe) return
    setBusy(true); setErr(null)
    try { await ganDeCaTest(c.id, chonDe); setDeTestId(chonDe) }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function hoanTat() {
    setBusy(true); setErr(null)
    try { await hoanThanhCaTest(c.id, baiUrl); onChanged() }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-800">{c.ungVien.hoTenHs}</span>
        <span className="text-[12px] text-slate-400">{c.ungVien.maUv ?? 'mới'} · {c.mon}{c.ungVien.khoi ? ` · Lớp ${c.ungVien.khoi}` : ''}</span>
      </div>
      <div className="mb-2 text-[12px] text-slate-500">{c.ungVien.hoTenPh || '—'} · {c.ungVien.sdtPh || '—'}</div>
      <div className="mb-2 flex items-center gap-2 text-[13px]">
        <span className="text-slate-600">{c.gioBatDau.slice(0, 5)} · {c.thoiLuongPhut} phút</span>
        <span className={`ml-auto font-semibold ${DEADLINE_TONE[muc]}`}>{muc === 'qua_han' ? '⚠ ' : ''}{nhanConLai(deadline, now)}</span>
      </div>

      <div className="mb-2 flex items-center gap-1.5">
        {deHienTai ? (
          <span className="text-[12px] text-slate-500">📘 {deHienTai.ten}</span>
        ) : (
          <>
            <select className="rounded-md border border-slate-200 px-2 py-1 text-[12px]" value={chonDe} onChange={(e) => setChonDe(e.target.value)}>
              <option value="">Chọn đề…</option>
              {deOpts.map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}
            </select>
            <button onClick={ganDe} disabled={busy || !chonDe} className="rounded-md bg-slate-700 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-600 disabled:opacity-40">Gán đề</button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">
          {baiUrl ? '📄 Đổi bài' : '📎 Upload bài'}
          <input type="file" accept="application/pdf,image/*" className="hidden" onChange={chonFile} disabled={busy} />
        </label>
        {baiUrl && <a href={baiUrl} target="_blank" rel="noreferrer" className="text-[12px] text-indigo-500 hover:underline">Xem bài</a>}
        <button onClick={hoanTat} disabled={busy || !baiUrl} title={!baiUrl ? 'Cần upload bài mới hoàn tất được' : ''} className="ml-auto rounded-md bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">✓ Hoàn tất</button>
      </div>
      {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
    </div>
  )
}

function TaoCaTestModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [uvL5, setUvL5] = useState<{ id: string; ho_ten_hs: string; ma_uv: string | null; khoi: string | null; mon: string }[]>([])
  const [ungVienId, setUngVienId] = useState<string | null>(null)
  const [f, setF] = useState({
    hoTenHs: '', mon: MON_OPTIONS[0] as MonTS, khoi: DEFAULT_KHOI, ngaySinh: '', hoTenPh: '', sdtPh: '', truongHoc: '',
    ngay: homNayVN(), gioBatDau: '', thoiLuongPhut: 60 as number,
  })
  const set = (k: keyof typeof f, v: any) => setF((s) => ({ ...s, [k]: v }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { listUngVienL5().then(setUvL5).catch(() => {}) }, [])
  const uvOpts = uvL5.map((u) => ({ id: u.id, label: u.ho_ten_hs, sub: `${u.ma_uv ?? ''} ${u.mon}${u.khoi ? ' · Lớp ' + u.khoi : ''}`.trim() }))

  async function pick(id: string | null) {
    setUngVienId(id)
    if (!id) return
    try {
      const uv = await getUngVien(id)
      setF((s) => ({ ...s, hoTenHs: uv.ho_ten_hs, mon: uv.mon as MonTS, khoi: uv.khoi ?? s.khoi, ngaySinh: uv.ngay_sinh ?? '', hoTenPh: uv.ho_ten_ph ?? '', sdtPh: uv.sdt_ph ?? '', truongHoc: uv.truong_hoc ?? '' }))
    } catch (e: any) { setErr(e.message ?? String(e)) }
  }

  async function save() {
    if (!f.gioBatDau) { setErr('Nhập giờ test'); return }
    if (!ungVienId && !f.hoTenHs.trim()) { setErr('Chọn ứng viên L5 hoặc nhập tên học sinh mới'); return }
    setBusy(true); setErr(null)
    try {
      const input: TaoCaTestInput = ungVienId
        ? { ungVienId, ngay: f.ngay, gioBatDau: f.gioBatDau, thoiLuongPhut: f.thoiLuongPhut }
        : { ungVienMoi: { hoTenHs: f.hoTenHs, mon: f.mon, khoi: f.khoi, ngaySinh: f.ngaySinh || null, hoTenPh: f.hoTenPh, sdtPh: f.sdtPh, truongHoc: f.truongHoc }, ngay: f.ngay, gioBatDau: f.gioBatDau, thoiLuongPhut: f.thoiLuongPhut }
      await taoCaTest(input)
      onDone()
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">Tạo test đầu vào</div>
        <div className="space-y-3">
          <div>
            <Lbl>Ứng viên đã đăng ký (L5) — để trống nếu walk-in mới hoàn toàn</Lbl>
            <SearchSelect value={ungVienId} onChange={pick} options={uvOpts} placeholder="🔎 Tìm ứng viên L5…" />
          </div>

          {!ungVienId ? (
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
              <div className="col-span-2"><Lbl>Tên học sinh *</Lbl><input className={inputCls} value={f.hoTenHs} onChange={(e) => set('hoTenHs', e.target.value)} autoFocus /></div>
              <div><Lbl>Môn</Lbl><select className={inputCls} value={f.mon} onChange={(e) => set('mon', e.target.value)}>{MON_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
              <div><Lbl>Lớp</Lbl><select className={inputCls} value={f.khoi} onChange={(e) => set('khoi', e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
              <div><Lbl>Ngày sinh</Lbl><input type="date" max={homNayVN()} className={inputCls} value={f.ngaySinh} onChange={(e) => set('ngaySinh', e.target.value)} /></div>
              <div><Lbl>Trường đang học</Lbl><input className={inputCls} value={f.truongHoc} onChange={(e) => set('truongHoc', e.target.value)} /></div>
              <div><Lbl>Tên bố/mẹ</Lbl><input className={inputCls} value={f.hoTenPh} onChange={(e) => set('hoTenPh', e.target.value)} /></div>
              <div><Lbl>SĐT bố/mẹ</Lbl><input className={inputCls} value={f.sdtPh} onChange={(e) => set('sdtPh', e.target.value)} /></div>
            </div>
          ) : (
            <div className="rounded-xl bg-indigo-50 p-3 text-[13px] text-indigo-800">
              <div className="font-medium">🔗 {f.hoTenHs} · {f.mon}{f.khoi ? ` · Lớp ${f.khoi}` : ''}</div>
              <div className="mt-1 text-[12px] text-indigo-500">Thông tin đã tự load từ L5 — sửa được nếu cần.</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input className={inputCls} value={f.truongHoc} onChange={(e) => set('truongHoc', e.target.value)} placeholder="Trường đang học" />
                <input className={inputCls} value={f.sdtPh} onChange={(e) => set('sdtPh', e.target.value)} placeholder="SĐT bố/mẹ" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div><Lbl>Ngày test</Lbl><input type="date" className={inputCls} value={f.ngay} onChange={(e) => set('ngay', e.target.value)} /></div>
            <div><Lbl>Giờ test *</Lbl><input type="time" className={inputCls} value={f.gioBatDau} onChange={(e) => set('gioBatDau', e.target.value)} /></div>
          </div>
          <div>
            <Lbl>Thời gian test</Lbl>
            <div className="flex flex-wrap gap-1.5">
              {THOI_LUONG_OPTIONS.map((p) => (
                <button key={p} type="button" onClick={() => set('thoiLuongPhut', p)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${f.thoiLuongPhut === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}'</button>
              ))}
            </div>
          </div>

          {err && <p className="text-[12px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
            <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang tạo…' : 'Hoàn thành'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
