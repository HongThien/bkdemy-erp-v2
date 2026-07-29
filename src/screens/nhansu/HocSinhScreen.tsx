import { useEffect, useRef, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { MON_LIST } from '../../lib/mon'
import {
  listHocSinh, createHocSinh, updateHocSinh, deleteHocSinh,
  listLopCuaHS, ghiDanh, roiLop, setBandGhiDanh, setNgayVao, chuyenLop,
  listLop, listMucNangLuc, countLopActiveByHS,
  listPhuHuynh, createPhuHuynh, updatePhuHuynh, listConByPH, suggestMaHS, suggestMaPH, uploadAvatar,
  type HocSinh, type GhiDanh, type Lop, type MucNangLuc, type PhuHuynh,
} from '../../lib/nhansu'
import { Field, inp, Seg } from '../kho/ui'
import BangThanhTich from '../gami/BangThanhTich'

const TT_LABEL: Record<string, string> = { dang_hoc: 'Đang học', bao_luu: 'Bảo lưu', nghi: 'Nghỉ' }
const ALL = '__all__' // tab "Tất cả khối"
type SortKey = 'ho_ten' | 'ma_hs' | 'khoi' | 'soLop' | 'trang_thai'

// "Đủ thông tin" = đã điền các trường hồ sơ cơ bản (không tính ảnh/điểm test — tuỳ chọn).
const HS_REQUIRED: { key: keyof HocSinh; label: string }[] = [
  { key: 'ngay_sinh', label: 'Ngày sinh' }, { key: 'gioi_tinh', label: 'Giới tính' },
  { key: 'truong_hoc', label: 'Trường học' }, { key: 'dia_chi', label: 'Địa chỉ' },
  { key: 'ngay_nhap_hoc', label: 'Ngày nhập học' }, { key: 'phu_huynh_id', label: 'Phụ huynh' },
]
const thieuThongTin = (h: HocSinh) => HS_REQUIRED.filter((f) => !h[f.key]).map((f) => f.label)

// Chấm trạng thái hồ sơ cạnh tên: đủ → tích xanh; thiếu → chấm đỏ nhỏ (hover xem thiếu gì).
function HoSoStatus({ h }: { h: HocSinh }) {
  const thieu = thieuThongTin(h)
  return thieu.length === 0
    ? <span title="Đủ thông tin" className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">✓</span>
    : <span title={`Thiếu: ${thieu.join(', ')}`} className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-600">!</span>
}

export default function HocSinhScreen() {
  const [khoi, setKhoi] = useState<string>(DEFAULT_KHOI)
  const [list, setList] = useState<HocSinh[]>([])
  const [countLop, setCountLop] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState<HocSinh | null | 'new'>(null)
  const [tt, setTt] = useState<string>('dang_hoc') // toggle trạng thái — quản lý riêng Đang học / Nghỉ
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'ho_ten', dir: 'asc' })

  // loading=true CHE bảng bằng placeholder "Đang tải…" → co chiều cao khung cuộn về gần 0 → trình
  // duyệt tự CLAMP scrollTop về 0 (không tự phục hồi khi bảng đầy lại) → cảm giác "reset về đầu trang"
  // mỗi lần Sửa xong quay lại. Chỉ hiện placeholder ở LẦN TẢI ĐẦU (chưa có data) — reload sau (đổi khối
  // vẫn tự làm mới) giữ bảng CŨ trên màn cho tới khi data mới về, DOM/scroll không bị phá giữa chừng.
  async function reload() {
    if (list.length === 0) setLoading(true)
    setErr(null)
    try {
      const hs = await listHocSinh(khoi === ALL ? undefined : khoi)
      setList(hs)
      setCountLop(await countLopActiveByHS(hs.map((h) => h.id))) // 1 query thay vì N
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi]) // eslint-disable-line

  // 1) lọc theo search (khối đã lọc ở query) → đếm theo trạng thái cho toggle
  const afterSearch = list.filter((h) => !q.trim() || h.ho_ten.toLowerCase().includes(q.trim().toLowerCase()) || (h.ma_hs ?? '').toLowerCase().includes(q.trim().toLowerCase()))
  const cnt = { dang_hoc: 0, bao_luu: 0, nghi: 0 } as Record<string, number>
  for (const h of afterSearch) cnt[h.trang_thai] = (cnt[h.trang_thai] ?? 0) + 1
  // Toggle: luôn có Đang học + Nghỉ; Bảo lưu chỉ khi có HS (không giấu HS bảo lưu)
  const ttSegs = (['dang_hoc', 'bao_luu', 'nghi'] as const).filter((s) => s !== 'bao_luu' || cnt.bao_luu > 0 || tt === 'bao_luu')
  // 2) lọc theo trạng thái đang chọn + sort theo cột
  const sortVal = (h: HocSinh): string | number =>
    sort.key === 'soLop' ? (countLop[h.id] ?? 0)
    : sort.key === 'ho_ten' ? h.ho_ten ?? ''
    : sort.key === 'ma_hs' ? h.ma_hs ?? ''
    : sort.key === 'khoi' ? h.khoi ?? ''
    : TT_LABEL[h.trang_thai] ?? ''
  const shown = afterSearch.filter((h) => h.trang_thai === tt).sort((a, b) => {
    const av = sortVal(a), bv = sortVal(b)
    const r = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'vi', { numeric: true })
    return sort.dir === 'asc' ? r : -r
  })
  const toggleSort = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Học sinh</span>
        <span className="text-[12px] font-semibold text-slate-400">{khoi === ALL ? 'Tổng' : `Khối ${khoi}`}</span>
        {/* Toggle trạng thái — quản lý riêng Đang học / Nghỉ (Bảo lưu hiện khi có) */}
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {ttSegs.map((s) => (
            <button key={s} onClick={() => setTt(s)}
              className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${tt === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {TT_LABEL[s]} <span className={tt === s ? 'text-indigo-600' : 'text-slate-400'}>{cnt[s]}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-1 gap-y-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên/mã…" className="mr-2 h-7 w-40 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
          <button onClick={() => setKhoi(ALL)} className={`h-7 rounded-md px-2.5 text-xs font-semibold transition ${khoi === ALL ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>Tất cả</button>
          <span className="mx-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)} className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
          ))}
          <button onClick={() => setEdit('new')} className="ml-3 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm học sinh</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">{q ? 'Không khớp.' : <>Không có học sinh <b className="text-slate-600">{TT_LABEL[tt]}</b>{khoi === ALL ? '' : ` khối ${khoi}`}.</>}</div>
          : (
            <table className="w-full border-separate border-spacing-y-1.5 text-sm">
              <thead><tr className="text-left text-[12px] uppercase tracking-wider text-slate-400">
                <Th k="ho_ten" sort={sort} onSort={toggleSort}>Họ tên</Th>
                <Th k="ma_hs" sort={sort} onSort={toggleSort}>Mã</Th>
                <Th k="khoi" sort={sort} onSort={toggleSort}>Khối</Th>
                <Th k="soLop" sort={sort} onSort={toggleSort}>Số lớp</Th>
                <th className="sticky top-0 z-10 bg-[#fafafb] px-3 pb-1.5">Trạng thái</th><th className="sticky top-0 z-10 bg-[#fafafb] pb-1.5"></th>
              </tr></thead>
              <tbody>
                {shown.map((h) => (
                  <tr key={h.id} className="bg-white shadow-sm">
                    <td className="rounded-l-lg px-3 py-2.5 font-medium text-slate-800">
                      <span className="flex items-center gap-2">
                        {h.anh_url
                          ? <img src={h.anh_url} alt="" className="h-7 w-7 rounded-lg object-cover" />
                          : <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-[12px] font-bold text-white">{h.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}</span>}
                        {h.ho_ten}
                        <HoSoStatus h={h} />
                      </span>
                    </td>
                    <td className="px-3 text-slate-500">{h.ma_hs ?? '—'}</td>
                    <td className="px-3 text-slate-500">{h.khoi ?? '—'}</td>
                    <td className="px-3">{countLop[h.id] ? <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px] text-slate-600">{countLop[h.id]} lớp</span> : <span className="text-[12px] text-slate-300">chưa xếp</span>}</td>
                    <td className="px-3"><span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${h.trang_thai === 'dang_hoc' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{TT_LABEL[h.trang_thai]}</span></td>
                    <td className="rounded-r-lg px-3 text-right"><button onClick={() => setEdit(h)} className="text-[13px] text-indigo-600 hover:underline">Sửa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {edit && <EditModal hocSinh={edit === 'new' ? null : edit} defaultKhoi={khoi} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}
    </div>
  )
}

// Header bảng — bấm để sort, mũi tên chỉ chiều
function Th({ k, sort, onSort, children }: { k: SortKey; sort: { key: SortKey; dir: 'asc' | 'desc' }; onSort: (k: SortKey) => void; children: React.ReactNode }) {
  const active = sort.key === k
  return (
    <th className="sticky top-0 z-10 cursor-pointer select-none bg-[#fafafb] px-3 pb-1.5 hover:text-slate-600" onClick={() => onSort(k)}>
      <span className="inline-flex items-center gap-1">{children}<span className={active ? 'text-indigo-500' : 'text-slate-300'}>{active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}</span></span>
    </th>
  )
}

function EditModal({ hocSinh, defaultKhoi, onClose, onSaved }: { hocSinh: HocSinh | null; defaultKhoi: string; onClose: () => void; onSaved: () => void }) {
  const [cur, setCur] = useState<HocSinh | null>(hocSinh) // null = chưa tạo; set sau khi tạo → mở phần ghi danh
  const isNew = !cur
  const [ho_ten, setHoTen] = useState(hocSinh?.ho_ten ?? '')
  const [ma_hs, setMaHs] = useState(hocSinh?.ma_hs ?? '')
  useEffect(() => { if (!hocSinh) suggestMaHS().then(setMaHs).catch(() => {}) }, [hocSinh]) // đề xuất sẵn, sửa được
  const [khoi, setKhoi] = useState(hocSinh?.khoi ? String(hocSinh.khoi) : defaultKhoi)
  const [ngay_sinh, setNgaySinh] = useState(hocSinh?.ngay_sinh ?? '')
  const [gioi_tinh, setGt] = useState<HocSinh['gioi_tinh']>(hocSinh?.gioi_tinh ?? null)
  const [trang_thai, setTt] = useState<HocSinh['trang_thai']>(hocSinh?.trang_thai ?? 'dang_hoc')
  const [truong_hoc, setTruong] = useState(hocSinh?.truong_hoc ?? '')
  const [dia_chi, setDiaChi] = useState(hocSinh?.dia_chi ?? '')
  const [ngay_nhap_hoc, setNgayNhap] = useState(hocSinh?.ngay_nhap_hoc ?? '')
  const [phId, setPhId] = useState<string | null>(hocSinh?.phu_huynh_id ?? null)
  const [anh_url, setAnhUrl] = useState(hocSinh?.anh_url ?? '')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [view, setView] = useState<'info' | 'thanhtich'>('info') // tab hồ sơ vs bảng thành tích

  async function save() {
    if (!ho_ten.trim()) return
    setBusy(true); setError(null)
    try {
      const patch = {
        ho_ten: ho_ten.trim(), khoi: khoi || null,
        ...(ma_hs.trim() ? { ma_hs: ma_hs.trim() } : {}), // trống → DB tự sinh HSxxxx (không gửi null đè default)
        ngay_sinh: ngay_sinh || null, gioi_tinh, trang_thai, truong_hoc: truong_hoc.trim() || null,
        dia_chi: dia_chi.trim() || null, ngay_nhap_hoc: ngay_nhap_hoc || null,
        phu_huynh_id: phId, anh_url: anh_url || null,
      }
      if (isNew) { const created = await createHocSinh(patch); setCur(created); setDirty(true) } // ở lại modal → ghi danh ngay
      else { await updateHocSinh(cur!.id, patch); onSaved() }
    } catch (e: any) { setError(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const close = () => (dirty ? onSaved() : onClose())
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={close}>
      <div className="flex max-h-[92vh] w-[1040px] max-w-[97vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 border-b border-slate-200 px-7 py-4">
          <h3 className="text-base font-semibold text-slate-900">{isNew ? 'Thêm học sinh' : `${cur!.ho_ten}`}</h3>
          {cur && (
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
              {(['info', 'thanhtich'] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`h-7 rounded-md px-3 text-[13px] font-semibold transition ${view === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {v === 'info' ? 'Hồ sơ' : '🏆 Thành tích'}
                </button>
              ))}
            </div>
          )}
          <button onClick={close} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {view === 'thanhtich' && cur ? (
          <div className="min-h-0 flex-1 overflow-hidden bg-slate-900 p-7"><BangThanhTich hocSinhId={cur.id} hoTen={cur.ho_ten} maHs={cur.ma_hs} khoi={cur.khoi} fit /></div>
        ) : (
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-7 overflow-y-auto p-7">
          {/* Cột trái — thông tin */}
          <div>
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Thông tin</div>
            <div className="mb-4 flex items-center gap-3">
              {anh_url
                ? <img src={anh_url} alt="" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
                : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-xl font-bold text-white">{ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'}</div>}
              <div>
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40">
                  {uploading ? 'Đang tải…' : anh_url ? 'Đổi ảnh' : '+ Ảnh đại diện'}
                </button>
                {anh_url && <button onClick={() => setAnhUrl('')} className="ml-2 text-[12px] text-slate-400 hover:text-rose-600">gỡ</button>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0]; e.target.value = ''
                  if (!f) return
                  setUploading(true)
                  try { setAnhUrl(await uploadAvatar(f)) } catch (er: any) { setError(er.message ?? String(er)) } finally { setUploading(false) }
                }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="Họ tên"><input value={ho_ten} onChange={(e) => setHoTen(e.target.value)} className={inp} autoFocus /></Field>
              <Field label="Mã HS"><input value={ma_hs} onChange={(e) => setMaHs(e.target.value)} className={`${inp} font-mono`} /></Field>
              <Field label="Khối">
                <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={inp}>
                  {KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Ngày sinh"><input type="date" value={ngay_sinh} onChange={(e) => setNgaySinh(e.target.value)} className={inp} /></Field>
              <Field label="Giới tính"><Seg options={['nam', 'nu'] as const} value={gioi_tinh ?? 'nam'} onChange={setGt} render={(o) => o === 'nam' ? 'Nam' : 'Nữ'} /></Field>
              <Field label="Ngày nhập học"><input type="date" value={ngay_nhap_hoc} onChange={(e) => setNgayNhap(e.target.value)} className={inp} /></Field>
              <Field label="Trạng thái"><Seg options={['dang_hoc', 'bao_luu', 'nghi'] as const} value={trang_thai} onChange={setTt} render={(o) => TT_LABEL[o]} /></Field>
            </div>
            <Field label="Trường học"><input value={truong_hoc} onChange={(e) => setTruong(e.target.value)} className={inp} placeholder="vd: THCS Cầu Giấy" /></Field>
            <Field label="Địa chỉ nhà"><input value={dia_chi} onChange={(e) => setDiaChi(e.target.value)} className={inp} /></Field>
            <PhuHuynhPicker value={phId} onChange={setPhId} />
          </div>

          {/* Cột phải — lớp & band */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            {cur ? <EnrollBox hocSinhId={cur.id} />
              : <div className="flex h-full flex-col items-center justify-center text-center text-[13px] text-slate-400">
                  <div className="mb-1 text-2xl">📚</div>
                  Bấm <b className="mx-1 text-slate-600">Tạo & xếp lớp</b> để mở phần<br />ghi danh lớp + band theo môn.
                </div>}
          </div>
        </div>
        )}

        {view === 'info' && (
        <div className="flex items-center justify-between border-t border-slate-200 px-7 py-3.5">
          {!isNew ? <button onClick={async () => { if (confirm('Xoá học sinh này?')) { await deleteHocSinh(cur!.id); onSaved() } }} className="text-[13px] text-rose-600 hover:underline">Xoá học sinh</button> : <span />}
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-rose-600">{error}</span>}
            <button onClick={close} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">{dirty ? 'Xong' : 'Huỷ'}</button>
            <button onClick={save} disabled={!ho_ten.trim() || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : isNew ? 'Tạo & xếp lớp' : 'Lưu'}</button>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

// Form thông tin PH (dùng cho TẠO mới + SỬA). Mã PH: tạo mới → đề xuất sẵn (sửa được); sửa → giữ mã hiện có.
type PhPatch = { ho_ten: string; ma_ph?: string; so_dien_thoai: string | null; email: string | null; dia_chi: string | null }
function PhForm({ initial, suggestCode, submitLabel, onCancel, onDone }: { initial?: PhuHuynh; suggestCode?: boolean; submitLabel: string; onCancel: () => void; onDone: (p: PhPatch) => Promise<void> }) {
  const [maPh, setMaPh] = useState(initial?.ma_ph ?? '')
  const [ten, setTen] = useState(initial?.ho_ten ?? '')
  const [sdt, setSdt] = useState(initial?.so_dien_thoai ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [diaChi, setDiaChi] = useState(initial?.dia_chi ?? '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { if (suggestCode && !initial) suggestMaPH().then(setMaPh).catch(() => {}) }, []) // eslint-disable-line
  async function submit() {
    if (!ten.trim()) return
    setBusy(true); setErr(null)
    const patch: PhPatch = { ho_ten: ten.trim(), so_dien_thoai: sdt.trim() || null, email: email.trim() || null, dia_chi: diaChi.trim() || null }
    if (maPh.trim()) patch.ma_ph = maPh.trim()
    try { await onDone(patch) } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="space-y-1.5 rounded-md border border-slate-200 bg-white p-2">
      <div className="flex gap-1.5">
        <input value={maPh} onChange={(e) => setMaPh(e.target.value)} placeholder="Mã PH" className="w-24 rounded border border-slate-300 px-2 py-1.5 font-mono text-[12px]" title="Mã đề xuất — sửa được" />
        <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Họ tên PH" className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-[13px]" autoFocus />
      </div>
      <div className="flex gap-1.5">
        <input value={sdt} onChange={(e) => setSdt(e.target.value)} placeholder="SĐT" className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-[13px]" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-[13px]" />
      </div>
      <input value={diaChi} onChange={(e) => setDiaChi(e.target.value)} placeholder="Địa chỉ" className="w-full rounded border border-slate-300 px-2 py-1.5 text-[13px]" />
      {err && <p className="text-[11px] text-rose-600">{err}</p>}
      <div className="flex justify-end gap-1.5">
        <button onClick={onCancel} className="rounded px-2 py-1 text-[12px] text-slate-500 hover:bg-slate-100">← Quay lại</button>
        <button onClick={submit} disabled={!ten.trim() || busy} className="rounded bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? '…' : submitLabel}</button>
      </div>
    </div>
  )
}

// Bắt cặp Phụ huynh: chọn PH có sẵn (1 PH nhiều con) / tạo mới (mã đề xuất, sửa được) / SỬA thông tin PH đã chọn.
function PhuHuynhPicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [cur, setCur] = useState<PhuHuynh | null>(null)
  const [conCount, setConCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<PhuHuynh[]>([])
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!value) { setCur(null); setConCount(0); return }
    listPhuHuynh().then((all) => setCur(all.find((p) => p.id === value) ?? null))
    listConByPH(value).then((c) => setConCount(c.length)).catch(() => {})
  }, [value])
  useEffect(() => { if (open) listPhuHuynh(q).then(setResults).catch(() => {}) }, [open, q])

  return (
    <div className="mb-3">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Phụ huynh</span>
      {editing && cur ? (
        <PhForm initial={cur} submitLabel="Lưu" onCancel={() => setEditing(false)}
          onDone={async (p) => { await updatePhuHuynh(cur.id, p); setCur({ ...cur, ...p, ma_ph: p.ma_ph ?? cur.ma_ph }); setEditing(false) }} />
      ) : cur ? (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[13px]">
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] text-indigo-700">{cur.ma_ph}</span>
          <span className="font-medium text-slate-800">{cur.ho_ten}</span>
          {cur.so_dien_thoai && <span className="text-[12px] text-slate-400">{cur.so_dien_thoai}</span>}
          {conCount > 1 && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">{conCount} con</span>}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setEditing(true)} className="text-[12px] text-indigo-500 hover:text-indigo-700">✎ sửa</button>
            <button onClick={() => { onChange(null); setOpen(true) }} className="text-[12px] text-slate-400 hover:text-rose-600">đổi</button>
          </div>
        </div>
      ) : !open ? (
        <button onClick={() => setOpen(true)} className={`${inp} text-left text-slate-400`}>— chọn / tạo phụ huynh —</button>
      ) : (
        <div className="rounded-md border border-slate-200 bg-white p-2">
          {!creating ? (
            <>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã / tên / SĐT…" className="mb-1.5 w-full rounded border border-slate-300 px-2 py-1.5 text-[13px]" autoFocus />
              <div className="max-h-36 space-y-0.5 overflow-auto">
                {results.map((p) => (
                  <button key={p.id} onClick={() => { onChange(p.id); setOpen(false) }} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[13px] hover:bg-slate-50">
                    <span className="font-mono text-[11px] text-indigo-600">{p.ma_ph}</span>
                    <span className="font-medium text-slate-700">{p.ho_ten}</span>
                    {p.so_dien_thoai && <span className="text-[12px] text-slate-400">{p.so_dien_thoai}</span>}
                  </button>
                ))}
                {results.length === 0 && <p className="px-2 py-1 text-[12px] text-slate-400">Không có PH khớp.</p>}
              </div>
              <button onClick={() => setCreating(true)} className="mt-1.5 w-full rounded bg-slate-100 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-200">+ Tạo phụ huynh mới</button>
            </>
          ) : (
            <PhForm suggestCode submitLabel="Tạo & chọn" onCancel={() => setCreating(false)}
              onDone={async (p) => { const ph = await createPhuHuynh(p); onChange(ph.id); setCur(ph); setCreating(false); setOpen(false) }} />
          )}
        </div>
      )}
      <p className="mt-1 text-[11px] text-slate-400">1 phụ huynh có thể gắn nhiều con (mã PH dùng để thu học phí / tài khoản PH sau này).</p>
    </div>
  )
}

// Ghi danh = một phần của hồ sơ HS. Trình bày THEO MÔN (giống V1: Toán/Văn/Anh… · lớp · band),
// nhưng DB là bảng nối sạch (không hardcode cột môn) → thêm môn = có lớp môn đó là tự hiện dòng.
function EnrollBox({ hocSinhId }: { hocSinhId: string }) {
  const [rows, setRows] = useState<GhiDanh[]>([])
  const [dsLop, setDsLop] = useState<Lop[]>([])
  const [mnl, setMnl] = useState<MucNangLuc[]>([])

  async function reload() {
    const [r, l, m] = await Promise.all([listLopCuaHS(hocSinhId), listLop(), listMucNangLuc()])
    setRows(r); setDsLop(l); setMnl(m)
  }
  useEffect(() => { reload() }, [hocSinhId]) // eslint-disable-line

  const active = rows.filter((r) => r.trang_thai === 'dang_hoc')
  const lopActive = dsLop.filter((l) => l.trang_thai === 'dang_hoc')
  // Luôn hiện ĐỦ danh mục môn (kể cả môn chưa có lớp → để xếp sau), + môn lạ HS đang học (nếu có).
  const monKhac = [...new Set(active.map((r) => r.lop?.mon).filter(Boolean) as string[])].filter((m) => !MON_LIST.includes(m as any)).sort()
  const mons = [...MON_LIST, ...monKhac]

  // Đổi lớp trong 1 môn = CHUYỂN LỚP chính thức: rời cũ (ngay_roi) + vào mới (ngay_vao), trigger DB log cả 2.
  async function chonLop(mon: string, newLopId: string) {
    const cur = active.find((r) => r.lop?.mon === mon)
    if (cur && cur.lop_id === newLopId) return
    if (cur && newLopId) {
      const tenMoi = lopActive.find((l) => l.id === newLopId)?.ten_lop ?? '?'
      if (!confirm(`Chuyển lớp ${mon}: ${cur.lop?.ten_lop} → ${tenMoi}? (ghi nhận rời lớp cũ + vào lớp mới hôm nay)`)) { reload(); return }
      await chuyenLop(cur.id, hocSinhId, newLopId, cur.muc_nang_luc_id ?? null)
    } else if (cur) {
      if (!confirm(`Cho rời lớp ${cur.lop?.ten_lop}? (giữ lịch sử)`)) { reload(); return }
      await roiLop(cur.id)
    } else if (newLopId) {
      await ghiDanh(hocSinhId, newLopId)
    }
    reload()
  }
  async function chonBand(mon: string, bandId: string) {
    const cur = active.find((r) => r.lop?.mon === mon)
    if (!cur) return
    await setBandGhiDanh(cur.id, bandId || null); reload()
  }

  return (
    <div className="mb-1">
      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Lớp & band theo môn</div>
      {mons.length === 0 ? (
        <p className="text-[12px] text-slate-400">Chưa có lớp nào trong hệ thống. Tạo lớp ở mục <b>Lớp</b> trước.</p>
      ) : (
        <table className="w-full text-[13px]">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-400"><th className="w-20 py-1">Môn</th><th>Lớp</th><th className="w-20">Band</th><th className="w-32">Vào lớp</th></tr></thead>
          <tbody>
            {mons.map((mon) => {
              const cur = active.find((r) => r.lop?.mon === mon)
              const lopsOfMon = lopActive.filter((l) => l.mon === mon)
              return (
                <tr key={mon} className="border-t border-slate-100">
                  <td className="py-1.5 font-medium text-slate-700">{mon}</td>
                  <td>
                    <select value={cur?.lop_id ?? ''} onChange={(e) => chonLop(mon, e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-[13px]">
                      <option value="">— không học —</option>
                      {lopsOfMon.map((l) => <option key={l.id} value={l.id}>{l.ten_lop}{l.khoi ? ` · K${l.khoi}` : ''}{l.bac ? ` · ${l.bac}` : ''}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={cur?.muc_nang_luc_id ?? ''} onChange={(e) => chonBand(mon, e.target.value)} disabled={!cur} className="w-full rounded border border-slate-300 px-1.5 py-1 text-[12px] disabled:opacity-40">
                      <option value="">—</option>
                      {mnl.map((m) => <option key={m.id} value={m.id}>{m.ma}</option>)}
                    </select>
                  </td>
                  <td>
                    {cur ? (
                      <input type="date" value={cur.ngay_vao ?? ''} onChange={async (e) => { if (e.target.value) { await setNgayVao(cur.id, e.target.value); reload() } }}
                        className={`w-full rounded border px-1.5 py-1 text-[12px] ${cur.ngay_vao ? 'border-slate-300' : 'border-amber-400 bg-amber-50'}`}
                        title="Ngày vào lớp — cổng tính data học tập (BTVN/ET)" />
                    ) : <span className="text-[12px] text-slate-300">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <p className="mt-1.5 text-[11px] text-slate-400">Đổi lớp cùng môn = <b>chuyển lớp</b> (ghi nhận rời cũ + vào mới, log tự động). Ngày vào viền vàng = chưa có, cần điền.</p>
    </div>
  )
}
