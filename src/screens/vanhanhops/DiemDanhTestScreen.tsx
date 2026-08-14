// Điểm danh test đầu vào — OPS tạo lúc HS THẬT SỰ tới test (đặt lịch trước hoặc walk-in).
// Bằng chứng thật "đã đến test" cho ops-lead tuyển sinh audit L5→L6 (xem tuyensinh.ts).
// Leaf riêng (KHÔNG nhét vào màn Tuyển sinh `tuyensinh` — OPS chỉ cần đúng việc này, không cần
// thấy/sửa cả phễu L5-L8) — cùng nguyên tắc tách leaf đã áp cho Report/Prep (BKDEMY_OPS_SPEC_DETAIL.md).
// ⭐ Đảo luồng 07-19 (BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md): đề chọn THẲNG từ Kho MT (dropdown, mặc định
// MT mới nhất, đổi được bất kỳ lúc nào tại phòng) — KHÔNG còn qua de_test (đã bỏ hẳn, mig 0105).
// Trả bài (Story 4, gộp Nhận xét) TÁCH RA tab riêng — xem TraBaiTestScreen.tsx (Thùy chốt 07-19 lần 2:
// "Trả bài rơi vào điểm danh test, đáng lẽ là tab riêng tương đương Chấm test").
import { useEffect, useState } from 'react'
import {
  listCaTestDangChay, listCaTestHoanThanh, taoCaTest, uploadCaTestBai, ganBaiCaTest, hoanThanhCaTest,
  listUngVienL5, getUngVien, gioKetThucCaTest, THOI_LUONG_OPTIONS, MON_OPTIONS,
  listNguoiChoCham, listNguoiChoTraBai, ganNguoiChamCaTest, ganNguoiTraBaiCaTest,
  type CaTest, type TaoCaTestInput, type MonTS, type NguoiChoAssign,
} from '../../lib/tuyensinh'
import { ganDeCaTest, listDeTestDauVao, type DeTestRow } from '../../lib/detest'
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
  const [deList, setDeList] = useState<DeTestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  async function reload() {
    setLoading(true)
    try {
      const [a, b, m] = await Promise.all([listCaTestDangChay(), listCaTestHoanThanh(homNayVN()), listDeTestDauVao()])
      setDangChay(a); setHoanThanhHomNay(b); setDeList(m)
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
          {dangChay.map((c) => <CaTestCard key={c.id} c={c} now={now} deList={deList} onChanged={reload} />)}
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

      {form && <TaoCaTestModal onClose={() => setForm(false)} onDone={async () => { setForm(false); await reload() }} />}
    </div>
    </div>
  )
}

function CaTestCard({ c, now, deList, onChanged }: { c: CaTest; now: number; deList: DeTestRow[]; onChanged: () => void }) {
  const [baiUrl, setBaiUrl] = useState<string | null>(c.baiUrl)
  const [taiLieuId, setTaiLieuId] = useState(c.taiLieuId)
  const [chonMT, setChonMT] = useState('')
  const [nguoiCham, setNguoiCham] = useState(c.nguoiChamId ?? '')
  const [nguoiTraBai, setNguoiTraBai] = useState(c.nguoiTraBaiId ?? '')
  const [choCham, setChoCham] = useState<NguoiChoAssign[]>([])
  const [choTraBai, setChoTraBai] = useState<NguoiChoAssign[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const deadline = gioKetThucCaTest(c)
  const muc = mucDeadline(deadline, now) ?? 'con_nhieu'
  useEffect(() => { listNguoiChoCham(c.mon).then(setChoCham).catch(() => {}); listNguoiChoTraBai(c.mon).then(setChoTraBai).catch(() => {}) }, [c.mon])
  async function doiNguoiCham(id: string) {
    setNguoiCham(id); setBusy(true); setErr(null)
    try { await ganNguoiChamCaTest(c.id, id || null) } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function doiNguoiTraBai(id: string) {
    setNguoiTraBai(id); setBusy(true); setErr(null)
    try { await ganNguoiTraBaiCaTest(c.id, id || null) } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  // Đề = đề test đầu vào ĐÃ SINH (tab "Đề test") khớp môn + khối ứng viên. listDeTestDauVao() sort desc →
  // đề ĐANG DÙNG (laHienTai) đứng đầu; lịch sử phía sau (Ops vẫn chọn được bản cũ nếu cần). Chưa có đề
  // nào cho khối×môn → báo nhờ học thuật tạo (không fallback MT thô — đề đầu vào phải do học thuật curate).
  const cands = deList.filter((d) => d.mon === c.mon && (!c.ungVien.khoi || d.khoi === c.ungVien.khoi))
  const chuaCoDe = cands.length === 0
  const deDaGan = deList.find((d) => d.id === taiLieuId)

  async function chonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { const url = await uploadCaTestBai(f); await ganBaiCaTest(c.id, url); setBaiUrl(url) }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  // Đổi đề bất kỳ lúc nào tại phòng (HS kêu khó quá) — dropdown luôn mở, KHÔNG khoá sau khi đã gán 1 lần.
  async function ganDe() {
    if (!chonMT) return
    setBusy(true); setErr(null)
    try { await ganDeCaTest(c.id, chonMT); setTaiLieuId(chonMT); setChonMT('') }
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

      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {deDaGan && <span className="text-[12px] text-slate-500">📘 {deDaGan.ten}</span>}
        {chuaCoDe ? (
          <span className="text-[11px] text-amber-600" title='Học thuật chưa tạo đề test đầu vào cho khối×môn này ở tab "Đề test".'>⚠ Chưa có đề test đầu vào cho khối này</span>
        ) : (
          <>
            <select className="rounded-md border border-slate-200 px-2 py-1 text-[12px]" value={chonMT} onChange={(e) => setChonMT(e.target.value)}>
              <option value="">{deDaGan ? 'Đổi đề khác…' : 'Chọn đề…'}</option>
              {cands.map((d) => <option key={d.id} value={d.id}>{d.ten}{d.laHienTai ? ' · đang dùng' : ' · lịch sử'}</option>)}
            </select>
            {chonMT && <button onClick={ganDe} disabled={busy} className="rounded-md bg-slate-700 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-600 disabled:opacity-40">{deDaGan ? 'Đổi đề' : 'Gán đề'}</button>}
          </>
        )}
      </div>

      <div className="mb-2 grid grid-cols-2 gap-1.5">
        <select className="rounded-md border border-slate-200 px-2 py-1 text-[12px]" value={nguoiCham} onChange={(e) => doiNguoiCham(e.target.value)} disabled={busy} title="Người dự kiến chấm — hàng đợi Chấm vẫn chung, ai mở cũng làm được">
          <option value="">👤 Người chấm…</option>
          <AssignOptions list={choCham} />
        </select>
        <select className="rounded-md border border-slate-200 px-2 py-1 text-[12px]" value={nguoiTraBai} onChange={(e) => doiNguoiTraBai(e.target.value)} disabled={busy} title="Người dự kiến trả bài — hàng đợi Trả bài vẫn chung, ai mở cũng làm được">
          <option value="">👤 Người trả bài…</option>
          <AssignOptions list={choTraBai} />
        </select>
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
    ngay: homNayVN(), gioBatDau: '', thoiLuongPhut: 60 as number, nguoiChamId: '', nguoiTraBaiId: '',
  })
  const set = (k: keyof typeof f, v: any) => setF((s) => ({ ...s, [k]: v }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [choCham, setChoCham] = useState<NguoiChoAssign[]>([])
  const [choTraBai, setChoTraBai] = useState<NguoiChoAssign[]>([])

  useEffect(() => { listUngVienL5().then(setUvL5).catch(() => {}) }, [])
  // Danh sách đổi theo môn — reset lựa chọn nếu người đã chọn không còn thuộc môn mới.
  useEffect(() => {
    listNguoiChoCham(f.mon).then((r) => { setChoCham(r); if (f.nguoiChamId && !r.some((n) => n.nhanSuId === f.nguoiChamId)) set('nguoiChamId', '') }).catch(() => {})
    listNguoiChoTraBai(f.mon).then((r) => { setChoTraBai(r); if (f.nguoiTraBaiId && !r.some((n) => n.nhanSuId === f.nguoiTraBaiId)) set('nguoiTraBaiId', '') }).catch(() => {})
  }, [f.mon]) // eslint-disable-line
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
      const chung = { ngay: f.ngay, gioBatDau: f.gioBatDau, thoiLuongPhut: f.thoiLuongPhut, nguoiChamId: f.nguoiChamId || null, nguoiTraBaiId: f.nguoiTraBaiId || null }
      const input: TaoCaTestInput = ungVienId
        ? { ungVienId, ...chung }
        : { ungVienMoi: { hoTenHs: f.hoTenHs, mon: f.mon, khoi: f.khoi, ngaySinh: f.ngaySinh || null, hoTenPh: f.hoTenPh, sdtPh: f.sdtPh, truongHoc: f.truongHoc }, ...chung }
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Lbl>Người chấm (dự kiến)</Lbl>
              <select className={inputCls} value={f.nguoiChamId} onChange={(e) => set('nguoiChamId', e.target.value)}>
                <option value="">{choCham.length ? '— Chưa chọn —' : `— Chưa có ai thuộc môn ${f.mon} —`}</option>
                <AssignOptions list={choCham} />
              </select>
            </div>
            <div>
              <Lbl>Người trả bài (dự kiến)</Lbl>
              <select className={inputCls} value={f.nguoiTraBaiId} onChange={(e) => set('nguoiTraBaiId', e.target.value)}>
                <option value="">{choTraBai.length ? '— Chưa chọn —' : `— Chưa có ai thuộc môn ${f.mon} —`}</option>
                <AssignOptions list={choTraBai} />
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Chỉ để biết trước ai dự kiến làm — hàng đợi Chấm/Trả bài vẫn chung, sửa được sau lúc nào cũng được.</p>

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

// Nhóm "Gần đây" (từng gán gần nhất cho môn này) lên đầu, còn lại xếp dưới — không khoá ai.
function AssignOptions({ list }: { list: NguoiChoAssign[] }) {
  const ganDay = list.filter((n) => n.ganDay)
  const khac = list.filter((n) => !n.ganDay)
  if (!ganDay.length) return <>{khac.map((n) => <option key={n.nhanSuId} value={n.nhanSuId}>{n.hoTen}</option>)}</>
  return (
    <>
      <optgroup label="Gần đây">{ganDay.map((n) => <option key={n.nhanSuId} value={n.nhanSuId}>{n.hoTen}</option>)}</optgroup>
      {khac.length > 0 && <optgroup label="Khác">{khac.map((n) => <option key={n.nhanSuId} value={n.nhanSuId}>{n.hoTen}</option>)}</optgroup>}
    </>
  )
}
