// Màn "Giao việc & đo hiệu suất" (leaf `giaoviec`) — SCOPE v1 (xem DEVLOG 07-05):
// chỉ đo việc PHÁT TRIỂN (giao→làm→nghiệm thu+bằng chứng→%). Lương/cấp bậc/skill HOÃN.
// 3 tab: Việc tôi giao (tạo mới + theo dõi + nghiệm thu) · Việc tôi làm (bấm hoàn thành)
// · Loại việc (registry, cấu hình bảng định lượng).
import { useEffect, useMemo, useState } from 'react'
import { getMyScope, type MyScope } from '../../lib/nhansu'
import {
  listLoaiViec, createLoaiViec, updateLoaiViec, listNguoiDuocGiao, createViec,
  listViecCuaToi, listViecToiGiao, banHoanThanh, batDauLam, guiLaiNghiemThu, nghiemThu, tinhHieuSuatKy,
  type LoaiViec, type ViecFull, type MucKhoiLuong, type HieuSuatKy, type NguoiDuocGiao,
} from '../../lib/giaoviec'

const CX_INPUT = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-indigo-400'
const CX_BTN = 'rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40'
const kyHienTai = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const fmtNgay = (iso?: string | null) => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('vi-VN') }
const TRANG_THAI_LABEL: Record<string, { ten: string; cls: string }> = {
  giao: { ten: 'Mới giao', cls: 'bg-slate-100 text-slate-600 ring-slate-200' },
  dang_lam: { ten: 'Đang làm', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  cho_nghiem_thu: { ten: 'Chờ nghiệm thu', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  dat: { ten: 'Đạt', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  tra_lai: { ten: 'Trả lại', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}
function Badge({ trangThai }: { trangThai: string }) {
  const t = TRANG_THAI_LABEL[trangThai] ?? { ten: trangThai, cls: 'bg-slate-100 text-slate-600 ring-slate-200' }
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${t.cls}`}>{t.ten}</span>
}

export default function GiaoViecScreen() {
  const [tab, setTab] = useState<'lam' | 'giao' | 'loaiviec'>('lam')
  const [scope, setScope] = useState<MyScope | null>(null)
  useEffect(() => { getMyScope().then(setScope) }, [])
  const tabBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Giao việc & hiệu suất</span>
        <button onClick={() => setTab('lam')} className={tabBtn(tab === 'lam')}>Việc tôi làm</button>
        <button onClick={() => setTab('giao')} className={tabBtn(tab === 'giao')}>Việc tôi giao</button>
        <button onClick={() => setTab('loaiviec')} className={tabBtn(tab === 'loaiviec')}>Loại việc</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!scope ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          tab === 'lam' ? <TabViecToiLam nhanSuId={scope.nhanSu.id} /> :
          tab === 'giao' ? <TabViecToiGiao nhanSuId={scope.nhanSu.id} /> :
          <TabLoaiViec />
        )}
      </div>
    </div>
  )
}

// ── TAB 1: VIỆC TÔI LÀM ──────────────────────────────────────────────────────
function TabViecToiLam({ nhanSuId }: { nhanSuId: string }) {
  const [rows, setRows] = useState<ViecFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [hieuSuat, setHieuSuat] = useState<HieuSuatKy | null>(null)
  const ky = kyHienTai()

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [r, hs] = await Promise.all([listViecCuaToi(nhanSuId), tinhHieuSuatKy(nhanSuId, ky)])
      setRows(r); setHieuSuat(hs)
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [nhanSuId])

  async function act(fn: () => Promise<void>, id: string) {
    setBusy(id)
    try { await fn(); await reload() } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  const dangHoatDong = rows.filter((r) => r.trang_thai !== 'dat')
  const daXong = rows.filter((r) => r.trang_thai === 'dat')

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      {err && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
      {hieuSuat && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="text-[11px] text-slate-400">Hiệu suất tháng {ky}</div><div className="mt-1 text-2xl font-bold text-indigo-600">{hieuSuat.hieuSuat ?? '—'}{hieuSuat.hieuSuat !== null && '%'}</div></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="text-[11px] text-slate-400">Sản lượng (khối lượng đạt)</div><div className="mt-1 text-2xl font-bold text-slate-800">{hieuSuat.sanLuong}</div></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="text-[11px] text-slate-400">Việc đạt / trả lại</div><div className="mt-1 text-2xl font-bold text-slate-800">{hieuSuat.soViecDat} <span className="text-rose-500">/ {hieuSuat.soViecTraLai}</span></div></div>
        </div>
      )}
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          <Section title={`Đang hoạt động (${dangHoatDong.length})`}>
            {dangHoatDong.length === 0 ? <Empty>Không có việc phát triển nào đang chờ.</Empty> : dangHoatDong.map((v) => (
              <ViecCard key={v.id} v={v}>
                {v.trang_thai === 'giao' && <button disabled={busy === v.id} onClick={() => act(() => batDauLam(v.id), v.id)} className={CX_BTN}>{busy === v.id ? '…' : 'Bắt đầu làm'}</button>}
                {v.trang_thai === 'dang_lam' && <button disabled={busy === v.id} onClick={() => act(() => banHoanThanh(v.id), v.id)} className={CX_BTN}>{busy === v.id ? '…' : '✓ Bấm hoàn thành'}</button>}
                {v.trang_thai === 'cho_nghiem_thu' && <span className="text-[12px] text-amber-600">Đang chờ {v.nguoi_giao_ten} nghiệm thu…</span>}
                {v.trang_thai === 'tra_lai' && <button disabled={busy === v.id} onClick={() => act(() => guiLaiNghiemThu(v.id), v.id)} className={CX_BTN}>{busy === v.id ? '…' : 'Gửi lại nghiệm thu'}</button>}
              </ViecCard>
            ))}
          </Section>
          <Section title={`Đã đạt (${daXong.length})`}>
            {daXong.length === 0 ? <Empty>Chưa có việc nào đạt.</Empty> : daXong.map((v) => <ViecCard key={v.id} v={v} />)}
          </Section>
        </>
      )}
    </div>
  )
}

// ── TAB 2: VIỆC TÔI GIAO ─────────────────────────────────────────────────────
function TabViecToiGiao({ nhanSuId }: { nhanSuId: string }) {
  const [rows, setRows] = useState<ViecFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [showGiao, setShowGiao] = useState(false)
  const [nghiemThuId, setNghiemThuId] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setRows(await listViecToiGiao(nhanSuId)) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [nhanSuId])

  const choNghiemThu = rows.filter((r) => r.trang_thai === 'cho_nghiem_thu')
  const dangLam = rows.filter((r) => ['giao', 'dang_lam', 'tra_lai'].includes(r.trang_thai))
  const daXong = rows.filter((r) => r.trang_thai === 'dat')

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      {err && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
      <button onClick={() => setShowGiao(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700">+ Giao việc mới</button>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          <Section title={`Chờ nghiệm thu (${choNghiemThu.length})`} highlight={choNghiemThu.length > 0}>
            {choNghiemThu.length === 0 ? <Empty>Không có việc nào chờ nghiệm thu.</Empty> : choNghiemThu.map((v) => (
              <ViecCard key={v.id} v={v}><button onClick={() => setNghiemThuId(v.id)} className={CX_BTN}>Nghiệm thu</button></ViecCard>
            ))}
          </Section>
          <Section title={`Đang làm (${dangLam.length})`}>
            {dangLam.length === 0 ? <Empty>Không có việc nào đang làm.</Empty> : dangLam.map((v) => <ViecCard key={v.id} v={v} />)}
          </Section>
          <Section title={`Đã đạt (${daXong.length})`}>
            {daXong.length === 0 ? <Empty>Chưa có việc nào đạt.</Empty> : daXong.map((v) => <ViecCard key={v.id} v={v} />)}
          </Section>
        </>
      )}
      {showGiao && <GiaoViecModal onClose={() => setShowGiao(false)} onDone={() => { setShowGiao(false); reload() }} />}
      {nghiemThuId && <NghiemThuModal viecId={nghiemThuId} viec={rows.find((r) => r.id === nghiemThuId)!} onClose={() => setNghiemThuId(null)} onDone={() => { setNghiemThuId(null); reload() }} />}
    </div>
  )
}

// ── TAB 3: LOẠI VIỆC (registry) ──────────────────────────────────────────────
function TabLoaiViec() {
  const [rows, setRows] = useState<LoaiViec[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  async function reload() { setLoading(true); setRows(await listLoaiViec(false)); setLoading(false) }
  useEffect(() => { reload() }, [])

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <button onClick={() => setShowNew(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700">+ Loại việc mới</button>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <div className="space-y-2">
          {rows.map((lv) => (
            <div key={lv.id} className={`rounded-2xl border-l-4 bg-white p-4 shadow-sm ${lv.phuong_thuc_cham === 'phat_trien' ? 'border-l-violet-400' : 'border-l-sky-400'} ${!lv.active ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{lv.ten}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{lv.phuong_thuc_cham === 'phat_trien' ? 'Phát triển' : 'Vận hành'}</span>
                {lv.task_nho && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">Task nhỏ (miễn bằng chứng)</span>}
                <button onClick={() => updateLoaiViec(lv.id, { active: !lv.active }).then(reload)} className="ml-auto text-[12px] text-slate-400 hover:text-indigo-600">{lv.active ? 'Ẩn' : 'Kích hoạt lại'}</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lv.thang_kl.map((m) => <span key={m.ma} className="rounded bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-slate-200">{m.ten}: {m.kl}kl</span>)}
                {!lv.thang_kl.length && <span className="text-[11px] italic text-slate-400">Chưa có mức khối lượng nào</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {showNew && <LoaiViecModal onClose={() => setShowNew(false)} onDone={() => { setShowNew(false); reload() }} />}
    </div>
  )
}

// ── COMPONENTS DÙNG CHUNG ────────────────────────────────────────────────────
function Section({ title, highlight, children }: { title: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className={`mb-2 text-[13px] font-semibold ${highlight ? 'text-amber-600' : 'text-slate-600'}`}>{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-[13px] text-slate-400">{children}</div>
}
function ViecCard({ v, children }: { v: ViecFull; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{v.tieu_de}</span>
            <Badge trangThai={v.trang_thai} />
          </div>
          <div className="mt-0.5 text-[12px] text-slate-500">
            {v.loai_viec?.ten} · KL {v.khoi_luong} · Người làm: {v.nguoi_lam.map((p) => p.ho_ten).join(', ')}
            {v.han_nghiem_thu && <> · Hạn nghiệm thu: {fmtNgay(v.han_nghiem_thu)}</>}
            {v.phan_tram !== null && <> · <span className="font-semibold text-slate-700">{v.phan_tram}%</span></>}
          </div>
          {v.mo_ta && <div className="mt-1 text-[12px] text-slate-400">{v.mo_ta}</div>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  )
}

// ── MODAL: GIAO VIỆC MỚI ─────────────────────────────────────────────────────
function GiaoViecModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [loaiViecs, setLoaiViecs] = useState<LoaiViec[]>([])
  const [nguoi, setNguoi] = useState<NguoiDuocGiao[]>([])
  const [loaiViecId, setLoaiViecId] = useState('')
  const [tieuDe, setTieuDe] = useState('')
  const [moTa, setMoTa] = useState('')
  const [nguoiLamIds, setNguoiLamIds] = useState<string[]>([])
  const [mucKl, setMucKl] = useState<MucKhoiLuong | null>(null)
  const [khoiLuongTay, setKhoiLuongTay] = useState<number | ''>('')
  const [hanNghiemThu, setHanNghiemThu] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { listLoaiViec().then(setLoaiViecs); listNguoiDuocGiao().then(setNguoi) }, [])
  const loaiViec = useMemo(() => loaiViecs.find((l) => l.id === loaiViecId), [loaiViecs, loaiViecId])
  const khoiLuong = mucKl?.kl ?? (khoiLuongTay === '' ? null : khoiLuongTay)

  async function submit() {
    if (!loaiViecId || !tieuDe.trim() || !nguoiLamIds.length || khoiLuong === null) { setErr('Cần đủ: loại việc, tiêu đề, người làm, khối lượng.'); return }
    setSaving(true); setErr(null)
    try {
      await createViec({ loai_viec_id: loaiViecId, tieu_de: tieuDe.trim(), mo_ta: moTa.trim() || undefined, nguoi_lam_ids: nguoiLamIds, khoi_luong: khoiLuong, han_nghiem_thu: hanNghiemThu || null })
      onDone()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  return (
    <Modal title="Giao việc mới" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Loại việc">
          <select value={loaiViecId} onChange={(e) => { setLoaiViecId(e.target.value); setMucKl(null) }} className={CX_INPUT}>
            <option value="">— chọn —</option>
            {loaiViecs.map((l) => <option key={l.id} value={l.id}>{l.ten}</option>)}
          </select>
        </Field>
        <Field label="Tiêu đề"><input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} className={CX_INPUT} placeholder="VD: Soạn giáo trình Đại số 8" /></Field>
        <Field label="Mô tả (tuỳ chọn)"><textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} className={CX_INPUT} rows={2} /></Field>
        <Field label="Giao cho">
          <div className="flex flex-wrap gap-1.5">
            {nguoi.map((n) => (
              <button key={n.nhan_su_id} type="button"
                onClick={() => setNguoiLamIds((ids) => ids.includes(n.nhan_su_id) ? ids.filter((x) => x !== n.nhan_su_id) : [...ids, n.nhan_su_id])}
                className={`rounded-full px-3 py-1 text-[12px] font-medium ring-1 transition ${nguoiLamIds.includes(n.nhan_su_id) ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-300 hover:ring-indigo-300'}`}>
                {n.ho_ten}
              </button>
            ))}
          </div>
        </Field>
        {loaiViec && (
          <Field label="Khối lượng">
            {loaiViec.thang_kl.length > 0 && (
              <div className="mb-1.5 flex flex-wrap gap-1.5">
                {loaiViec.thang_kl.map((m) => (
                  <button key={m.ma} type="button" onClick={() => { setMucKl(m); setKhoiLuongTay('') }}
                    className={`rounded-full px-3 py-1 text-[12px] font-medium ring-1 transition ${mucKl?.ma === m.ma ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-300 hover:ring-indigo-300'}`}>
                    {m.ten} ({m.kl}kl)
                  </button>
                ))}
              </div>
            )}
            <input type="number" value={khoiLuongTay} onChange={(e) => { setKhoiLuongTay(e.target.value === '' ? '' : Number(e.target.value)); setMucKl(null) }} className={CX_INPUT} placeholder="hoặc nhập số khối lượng" />
          </Field>
        )}
        <Field label="Hạn nghiệm thu (tuỳ chọn)"><input type="date" value={hanNghiemThu} onChange={(e) => setHanNghiemThu(e.target.value)} className={CX_INPUT} /></Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-600">Huỷ</button>
          <button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? 'Đang lưu…' : 'Giao việc'}</button>
        </div>
      </div>
    </Modal>
  )
}

// ── MODAL: NGHIỆM THU ────────────────────────────────────────────────────────
function NghiemThuModal({ viecId, viec, onClose, onDone }: { viecId: string; viec: ViecFull; onClose: () => void; onDone: () => void }) {
  const [tienDo, setTienDo] = useState(100)
  const [chatLuong, setChatLuong] = useState(80)
  const [bangChung, setBangChung] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const taskNho = !!viec.loai_viec?.task_nho

  async function submit(dat: boolean) {
    if (dat && !taskNho && !bangChung.trim()) { setErr('Loại việc này cần bằng chứng (link/file) mới chốt Đạt được.'); return }
    setSaving(true); setErr(null)
    try { await nghiemThu(viecId, { dat, tien_do: tienDo, chat_luong: chatLuong, bang_chung: bangChung.trim() || null, ghi_chu: ghiChu.trim() || null }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  return (
    <Modal title={`Nghiệm thu — ${viec.tieu_de}`} onClose={onClose}>
      <div className="space-y-3">
        <div className="text-[12px] text-slate-500">Người làm: {viec.nguoi_lam.map((p) => p.ho_ten).join(', ')} · Khối lượng {viec.khoi_luong}</div>
        <Field label={`Tiến độ: ${tienDo}%`}><input type="range" min={0} max={100} value={tienDo} onChange={(e) => setTienDo(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Chất lượng: ${chatLuong}%`}><input type="range" min={0} max={100} value={chatLuong} onChange={(e) => setChatLuong(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Bằng chứng${taskNho ? ' (miễn — task nhỏ)' : ' (bắt buộc để chốt Đạt)'}`}>
          <input value={bangChung} onChange={(e) => setBangChung(e.target.value)} className={CX_INPUT} placeholder="Link tài liệu / file / badge %..." />
        </Field>
        <Field label="Ghi chú (tuỳ chọn)"><textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} className={CX_INPUT} rows={2} /></Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2 pt-1">
          <button disabled={saving} onClick={() => submit(false)} className="rounded-lg border border-rose-300 px-4 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50">Trả lại</button>
          <button disabled={saving} onClick={() => submit(true)} className={CX_BTN}>{saving ? 'Đang lưu…' : '✓ Chốt Đạt'}</button>
        </div>
      </div>
    </Modal>
  )
}

// ── MODAL: LOẠI VIỆC MỚI ─────────────────────────────────────────────────────
function LoaiViecModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [ten, setTen] = useState('')
  const [phuongThuc, setPhuongThuc] = useState<'frontline' | 'phat_trien'>('phat_trien')
  const [taskNho, setTaskNho] = useState(false)
  const [thangKl, setThangKl] = useState<MucKhoiLuong[]>([{ ma: 'nho', ten: 'Nhỏ', kl: 1 }, { ma: 'vua', ten: 'Vừa', kl: 2 }, { ma: 'lon', ten: 'Lớn', kl: 4 }])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function updMuc(i: number, patch: Partial<MucKhoiLuong>) { setThangKl((rows) => rows.map((r, idx) => idx === i ? { ...r, ...patch } : r)) }
  function addMuc() { setThangKl((rows) => [...rows, { ma: `muc${rows.length + 1}`, ten: '', kl: 1 }]) }
  function rmMuc(i: number) { setThangKl((rows) => rows.filter((_, idx) => idx !== i)) }

  async function submit() {
    if (!ten.trim()) { setErr('Cần nhập tên loại việc.'); return }
    setSaving(true); setErr(null)
    try { await createLoaiViec({ ten: ten.trim(), phuong_thuc_cham: phuongThuc, task_nho: taskNho, thang_kl: thangKl.filter((m) => m.ten.trim()) }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  return (
    <Modal title="Loại việc mới" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Tên"><input value={ten} onChange={(e) => setTen(e.target.value)} className={CX_INPUT} placeholder="VD: Soạn tài liệu" /></Field>
        <Field label="Phương thức chấm">
          <select value={phuongThuc} onChange={(e) => setPhuongThuc(e.target.value as any)} className={CX_INPUT}>
            <option value="phat_trien">Phát triển (task giao, leader chốt tiến độ+chất lượng)</option>
            <option value="frontline">Vận hành (máy đo tiến độ, leader confirm chất lượng — nối sau)</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-[13px] text-slate-600"><input type="checkbox" checked={taskNho} onChange={(e) => setTaskNho(e.target.checked)} /> Task nhỏ (miễn bằng chứng lúc nghiệm thu)</label>
        <Field label="Bảng định lượng (khối lượng theo mức)">
          <div className="space-y-1.5">
            {thangKl.map((m, i) => (
              <div key={i} className="flex gap-1.5">
                <input value={m.ten} onChange={(e) => updMuc(i, { ten: e.target.value, ma: e.target.value.toLowerCase().replace(/\s+/g, '_') })} className={`${CX_INPUT} flex-1`} placeholder="Tên mức (VD: Nhỏ)" />
                <input type="number" value={m.kl} onChange={(e) => updMuc(i, { kl: Number(e.target.value) })} className={`${CX_INPUT} w-24`} placeholder="Khối lượng" />
                <button onClick={() => rmMuc(i)} className="rounded-lg border border-slate-300 px-2 text-slate-400 hover:text-rose-600">✕</button>
              </div>
            ))}
            <button onClick={addMuc} className="text-[12px] font-medium text-indigo-600 hover:underline">+ Thêm mức</button>
          </div>
        </Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-600">Huỷ</button>
          <button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? 'Đang lưu…' : 'Tạo'}</button>
        </div>
      </div>
    </Modal>
  )
}

// ── PRIMITIVES ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1 text-[12px] font-medium text-slate-600">{label}</div>{children}</label>
}
