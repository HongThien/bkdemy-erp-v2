// Màn TUYỂN SINH — phễu Test đầu vào L5→L8 (ADR app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233).
// Toggle bar L5/L6/L7/L8/Đã loại · mỗi level: bảng ứng viên × cột-việc (checkbox) + Hoàn thành + Loại · L7 hoàn thành = convert tạo HS.
// Gu Apple-clean (nền xám + card trắng + pill mềm).
import { useEffect, useMemo, useState } from 'react'
import {
  LEVELS, LEVEL_TEN, VIEC_BY_LEVEL, duViec, listUngVien, listLoai, getViecXong, toggleViec, hoanThanhLevel,
  loaiUngVien, moLaiUngVien, createUngVien, updateUngVien, convertUngVien, demTheoLevel, listNguon, listHSDangHoc, suggestMaUV,
  timHocSinh, chiTietHSChoLead, MON_OPTIONS, type UngVien, type UngVienLevel, type MonTS,
} from '../../lib/tuyensinh'
import { listPhuHuynh, listConByPH, type PhuHuynh } from '../../lib/nhansu'
import { listLop, type Lop } from '../../lib/nhansu'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import SearchSelect from '../../components/SearchSelect'

type Tab = UngVienLevel | 'L8' | 'loai'
const TABS: Tab[] = [...LEVELS, 'L8', 'loai']
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'

const readMon = () => { const m = localStorage.getItem('ts.mon'); return (MON_OPTIONS as readonly string[]).includes(m ?? '') ? (m as MonTS) : 'Toán' }

export default function TuyenSinhScreen() {
  const [mon, setMon] = useState<MonTS>(readMon)
  const [tab, setTab] = useState<Tab>('L5')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [rows, setRows] = useState<UngVien[]>([])
  const [done, setDone] = useState<Record<string, Set<string>>>({})
  const [hs, setHs] = useState<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null }[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<UngVien | 'new' | null>(null) // 'new' = tạo · UngVien = sửa · null = đóng
  const [convertUv, setConvertUv] = useState<UngVien | null>(null)
  const [loaiUv, setLoaiUv] = useState<UngVien | null>(null)

  async function reloadCounts() { try { setCounts(await demTheoLevel(mon)) } catch { /* */ } }
  async function reload() {
    setLoading(true)
    try {
      if (tab === 'L8') { setHs(await listHSDangHoc(mon)); setRows([]) }
      else if (tab === 'loai') { setRows(await listLoai(mon)); setDone({}) }
      else { const r = await listUngVien(tab, mon); setRows(r); setDone(await getViecXong(r.map((x) => x.id))) }
    } catch { setRows([]) } finally { setLoading(false) }
  }
  useEffect(() => { localStorage.setItem('ts.mon', mon) }, [mon])
  useEffect(() => { reload() }, [tab, mon]) // eslint-disable-line
  useEffect(() => { reloadCounts() }, [mon]) // eslint-disable-line
  const refresh = async () => { await reload(); await reloadCounts() }

  async function onToggle(uv: UngVien, key: string, on: boolean) {
    try {
      await toggleViec(uv.id, key, on)
      setDone((d) => { const s = new Set(d[uv.id] ?? []); on ? s.add(key) : s.delete(key); return { ...d, [uv.id]: s } })
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function onHoanThanh(uv: UngVien) {
    if (uv.level === 'L7') { setConvertUv(uv); return }
    try { await hoanThanhLevel(uv); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  const isFunnel = tab === 'L5' || tab === 'L6' || tab === 'L7'
  const viecCols = isFunnel ? VIEC_BY_LEVEL[tab] : []

  return (
    <div className="h-full overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <h2 className="text-[22px] font-semibold text-slate-800">Tuyển sinh</h2>
            <p className="text-[13px] text-slate-500">Phễu Test đầu vào · L5 đăng ký → L6 test → L7 học thử → L8 chính thức</p>
          </div>
          <button onClick={() => setForm('new')} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm ứng viên</button>
        </div>

        {/* Toggle bar MÔN — phễu riêng từng môn */}
        <div className="mb-3 flex w-fit flex-wrap gap-1 rounded-xl bg-slate-200/70 p-1">
          {MON_OPTIONS.map((m) => (
            <button key={m} onClick={() => setMon(m)}
              className={`rounded-lg px-4 py-1.5 text-[14px] font-semibold transition ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m}</button>
          ))}
        </div>

        {/* Toggle bar level */}
        <div className="mb-4 flex w-fit flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => {
            const on = tab === t
            const lbl = t === 'loai' ? 'Đã loại' : `${t} · ${LEVEL_TEN[t]}`
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-xl px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {lbl}{counts[t] != null ? <span className={`ml-2 inline-flex min-w-[24px] items-center justify-center rounded-full px-1.5 py-0.5 text-[15px] font-bold ${on ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{counts[t]}</span> : null}
              </button>
            )
          })}
        </div>

        {/* Nội dung */}
        {loading ? <div className="p-8 text-[14px] text-slate-400">Đang tải…</div>
          : tab === 'L8' ? <L8List hs={hs} />
          : tab === 'loai' ? <LoaiList rows={rows} onMoLai={async (id) => { await moLaiUngVien(id); await refresh() }} />
          : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[760px] border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-[13px] text-slate-500">
                    <th className="px-4 py-3 font-medium">Ứng viên</th>
                    <th className="px-4 py-3 font-medium">Phụ huynh</th>
                    <th className="px-3 py-3 font-medium">Khối</th>
                    <th className="px-3 py-3 font-medium">Nguồn</th>
                    <th className="px-3 py-3 font-medium">Lưu ý</th>
                    {viecCols.map((v) => <th key={v.key} className="px-3 py-3 text-center font-medium">{v.ten}{v.derive && <span className="ml-1 rounded bg-violet-100 px-1 text-[10px] font-medium text-violet-600" title="Sẽ tự động khi nối chấm bài test">auto</span>}</th>)}
                    <th className="px-4 py-3 text-right font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={6 + viecCols.length} className="px-4 py-10 text-center text-[14px] text-slate-400">Chưa có ứng viên ở {tab}.</td></tr>
                  ) : rows.map((uv) => {
                    const d = done[uv.id]
                    const ready = duViec(tab as UngVienLevel, d)
                    return (
                      <tr key={uv.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                        <td className="px-4 py-3"><div className="font-medium text-slate-800">{uv.ho_ten_hs}</div><div className="text-[12px] text-slate-400">{uv.ma_uv} · {uv.mon}</div></td>
                        <td className="px-4 py-3 text-slate-600">{uv.ho_ten_ph || <span className="text-slate-300">—</span>}<div className="text-[12px] text-slate-400">{uv.sdt_ph}</div></td>
                        <td className="px-3 py-3 text-slate-600">{uv.khoi || '—'}</td>
                        <td className="px-3 py-3 text-slate-600">{uv.nguon || <span className="text-slate-300">—</span>}</td>
                        <td className="max-w-[200px] px-3 py-3 text-[13px] text-slate-500">{uv.ghi_chu ? <span className="line-clamp-2" title={uv.ghi_chu}>{uv.ghi_chu}</span> : <span className="text-slate-300">—</span>}</td>
                        {viecCols.map((v) => {
                          const checked = !!d?.has(v.key)
                          return (
                            <td key={v.key} className="px-3 py-3 text-center">
                              <button onClick={() => onToggle(uv, v.key, !checked)}
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border text-[15px] transition ${checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent hover:border-indigo-400'}`}>✓</button>
                            </td>
                          )
                        })}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setForm(uv)} title="Sửa thông tin" className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] text-slate-500 hover:border-indigo-300 hover:text-indigo-700">✎ Sửa</button>
                            <button onClick={() => onHoanThanh(uv)} disabled={!ready}
                              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${ready ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500' : 'cursor-not-allowed bg-slate-100 text-slate-400'}`}>
                              {uv.level === 'L7' ? 'Hoàn thành → Nhập HS' : 'Hoàn thành'}
                            </button>
                            <button onClick={() => setLoaiUv(uv)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Loại</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {form && <UvFormModal uv={form === 'new' ? null : form} defaultMon={mon} onClose={() => setForm(null)} onDone={async () => { setForm(null); await refresh() }} />}
      {convertUv && <ConvertModal uv={convertUv} onClose={() => setConvertUv(null)} onDone={async () => { setConvertUv(null); await refresh() }} />}
      {loaiUv && <LoaiModal uv={loaiUv} onClose={() => setLoaiUv(null)} onDone={async () => { setLoaiUv(null); await refresh() }} />}
    </div>
  )
}

function L8List({ hs }: { hs: { id: string; ma_hs: string | null; ho_ten: string; khoi: string | null }[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-[13px] text-slate-500">Học sinh chính thức (đang học) — {hs.length} HS. Quản lý chi tiết ở màn <b>Học sinh</b>.</p>
      <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {hs.map((h) => (
          <div key={h.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px]"><span className="font-medium text-slate-800">{h.ho_ten}</span><div className="text-[12px] text-slate-400">{h.ma_hs} · Khối {h.khoi || '—'}</div></div>
        ))}
      </div>
    </div>
  )
}

function LoaiList({ rows, onMoLai }: { rows: UngVien[]; onMoLai: (id: string) => void }) {
  if (!rows.length) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-[14px] text-slate-400 shadow-sm">Chưa có ứng viên bị loại.</div>
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-[14px]">
        <thead><tr className="border-b border-slate-200 text-left text-[13px] text-slate-500"><th className="px-4 py-3 font-medium">Ứng viên</th><th className="px-4 py-3 font-medium">Phụ huynh</th><th className="px-4 py-3 font-medium">Lý do loại</th><th className="px-4 py-3 font-medium">Lưu ý</th><th className="px-4 py-3 text-right font-medium">Hành động</th></tr></thead>
        <tbody>
          {rows.map((uv) => (
            <tr key={uv.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3"><div className="font-medium text-slate-800">{uv.ho_ten_hs}</div><div className="text-[12px] text-slate-400">{uv.ma_uv} · {uv.level}</div></td>
              <td className="px-4 py-3 text-slate-600">{uv.ho_ten_ph}<div className="text-[12px] text-slate-400">{uv.sdt_ph}</div></td>
              <td className="px-4 py-3 text-slate-600">{uv.ly_do_loai || '—'}</td>
              <td className="max-w-[200px] px-4 py-3 text-[13px] text-slate-500">{uv.ghi_chu || <span className="text-slate-300">—</span>}</td>
              <td className="px-4 py-3 text-right"><button onClick={() => onMoLai(uv.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-indigo-600 hover:border-indigo-300">↩ Mở lại</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Modal({ title, onClose, children, maxW = 'max-w-[480px]' }: { title: string; onClose: () => void; children: React.ReactNode; maxW?: string }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full ${maxW} overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">{title}</div>
        {children}
      </div>
    </div>
  )
}

const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

// Form tạo / SỬA ứng viên — thông tin HS ĐẦY ĐỦ (như màn Học sinh) + Lưu ý + link PH cũ. uv=null → tạo; uv=obj → sửa.
function UvFormModal({ uv, defaultMon, onClose, onDone }: { uv: UngVien | null; defaultMon: MonTS; onClose: () => void; onDone: () => void }) {
  const edit = !!uv
  const [f, setF] = useState({
    ho_ten_hs: uv?.ho_ten_hs ?? '', mon: uv?.mon ?? defaultMon, khoi: uv?.khoi ?? DEFAULT_KHOI, ngay_sinh: uv?.ngay_sinh ?? '', gioi_tinh: uv?.gioi_tinh ?? '',
    truong_hoc: uv?.truong_hoc ?? '', dia_chi: uv?.dia_chi ?? '',
    ho_ten_ph: uv?.ho_ten_ph ?? '', sdt_ph: uv?.sdt_ph ?? '', email_ph: uv?.email_ph ?? '',
    nguon: uv?.nguon ?? '', ghi_chu: uv?.ghi_chu ?? '', ma_uv: uv?.ma_uv ?? '',
  })
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }))
  const [phId, setPhId] = useState<string | null>(uv?.phu_huynh_id ?? null)
  const [phCon, setPhCon] = useState<string[]>([]) // con đang/đã học của PH đã link (hiển thị xác nhận đúng PH)
  const [hsGoc, setHsGoc] = useState<{ id: string; ho_ten: string; ma_hs: string | null } | null>(
    uv?.hoc_sinh_goc_id ? { id: uv.hoc_sinh_goc_id, ho_ten: uv.ho_ten_hs, ma_hs: null } : null)
  const [nguonOpts, setNguonOpts] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    listNguon().then(setNguonOpts).catch(() => {}); if (!edit) suggestMaUV().then((m) => set('ma_uv', m)).catch(() => {})
    if (uv?.phu_huynh_id) listConByPH(uv.phu_huynh_id).then((cs) => setPhCon(cs.map((c) => c.ho_ten))).catch(() => {})
  }, []) // eslint-disable-line
  function pickPh(ph: PhuHuynh) {
    setPhId(ph.id)
    setF((s) => ({ ...s, ho_ten_ph: ph.ho_ten, sdt_ph: ph.so_dien_thoai ?? '', email_ph: ph.email ?? '' }))
    listConByPH(ph.id).then((cs) => setPhCon(cs.map((c) => c.ho_ten))).catch(() => {})
  }
  function clearPh() { setPhId(null); setPhCon([]) }
  // Chọn HS CŨ (học thêm môn) → fill HS + tự load PH theo HS đó.
  async function pickHs(hs: { id: string; ho_ten: string; ma_hs: string | null }) {
    setHsGoc(hs)
    try {
      const d = await chiTietHSChoLead(hs.id)
      setF((s) => ({ ...s, ho_ten_hs: d.ho_ten_hs ?? '', khoi: d.khoi ?? s.khoi, ngay_sinh: d.ngay_sinh ?? '', gioi_tinh: d.gioi_tinh ?? '', truong_hoc: d.truong_hoc ?? '', dia_chi: d.dia_chi ?? '', ho_ten_ph: d.ho_ten_ph ?? '', sdt_ph: d.sdt_ph ?? '', email_ph: d.email_ph ?? '' }))
      if (d.phu_huynh_id) { setPhId(d.phu_huynh_id); listConByPH(d.phu_huynh_id).then((cs) => setPhCon(cs.map((c) => c.ho_ten))).catch(() => {}) }
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  function clearHs() { setHsGoc(null); setPhId(null); setPhCon([]) }
  async function save() {
    if (!f.ho_ten_hs.trim()) { alert('Nhập tên học sinh'); return }
    setBusy(true)
    const patch = {
      ho_ten_hs: f.ho_ten_hs.trim(), mon: f.mon, khoi: f.khoi, ngay_sinh: f.ngay_sinh || null, gioi_tinh: f.gioi_tinh || null,
      truong_hoc: f.truong_hoc.trim() || null, dia_chi: f.dia_chi.trim() || null,
      ho_ten_ph: f.ho_ten_ph.trim() || null, sdt_ph: f.sdt_ph.trim() || null, email_ph: f.email_ph.trim() || null, phu_huynh_id: phId,
      hoc_sinh_goc_id: hsGoc?.id ?? null,
      nguon: f.nguon.trim() || null, ghi_chu: f.ghi_chu.trim() || null,
    }
    try { if (edit) await updateUngVien(uv!.id, patch); else await createUngVien({ ...patch, ma_uv: f.ma_uv.trim() || undefined }); onDone() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title={edit ? `Sửa ứng viên · ${uv!.ma_uv ?? ''}` : 'Thêm ứng viên (L5 · Đăng ký test)'} onClose={onClose} maxW="max-w-[640px]">
      <div className="space-y-3">
        {/* HS cũ học thêm môn → ghi danh lại, không tạo HS mới */}
        {hsGoc ? (
          <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-[13px] text-indigo-800">
            🎓 <b>HS cũ học thêm môn:</b> {hsGoc.ho_ten}{hsGoc.ma_hs ? ` · ${hsGoc.ma_hs}` : ''}
            <span className="text-[12px] text-indigo-500">— convert sẽ ghi danh HS này vào lớp mới, không tạo HS mới</span>
            <button onClick={clearHs} className="ml-auto text-indigo-400 hover:text-rose-600">✕ bỏ chọn</button>
          </div>
        ) : !edit && (
          <div>
            <Lbl>HS đang học muốn học thêm môn? Chọn từ HS cũ (PH tự load)</Lbl>
            <HsCuPicker onPick={pickHs} />
          </div>
        )}
        <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">Học sinh</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Lbl>Tên học sinh *</Lbl><input className={inputCls} value={f.ho_ten_hs} onChange={(e) => set('ho_ten_hs', e.target.value)} autoFocus /></div>
          <div><Lbl>Môn</Lbl><select className={inputCls} value={f.mon} onChange={(e) => set('mon', e.target.value)}>{MON_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
          <div><Lbl>Khối</Lbl><select className={inputCls} value={f.khoi} onChange={(e) => set('khoi', e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
          {!edit && <div className="col-span-2"><Lbl>Mã UV</Lbl><input className={inputCls} value={f.ma_uv} onChange={(e) => set('ma_uv', e.target.value)} /></div>}
          <div><Lbl>Ngày sinh</Lbl><input type="date" className={inputCls} value={f.ngay_sinh} onChange={(e) => set('ngay_sinh', e.target.value)} /></div>
          <div><Lbl>Giới tính</Lbl><select className={inputCls} value={f.gioi_tinh} onChange={(e) => set('gioi_tinh', e.target.value)}><option value="">—</option><option value="nam">Nam</option><option value="nu">Nữ</option></select></div>
          <div><Lbl>Trường học</Lbl><input className={inputCls} value={f.truong_hoc} onChange={(e) => set('truong_hoc', e.target.value)} placeholder="vd: THCS Cầu Giấy" /></div>
          <div><Lbl>Địa chỉ</Lbl><input className={inputCls} value={f.dia_chi} onChange={(e) => set('dia_chi', e.target.value)} /></div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">Phụ huynh</span>
          {phId
            ? <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">🔗 PH cũ{phCon.length ? ` · con: ${phCon.join(', ')}` : ''}<button onClick={clearPh} className="text-emerald-500 hover:text-rose-600">✕ bỏ link</button></span>
            : <span className="ml-auto text-[12px] text-slate-400">PH cho con thứ 2? Tìm PH cũ để dùng lại →</span>}
        </div>
        {!phId && <PhCuPicker onPick={pickPh} />}
        <div className="grid grid-cols-3 gap-3">
          <div><Lbl>Tên phụ huynh</Lbl><input className={inputCls} value={f.ho_ten_ph} onChange={(e) => set('ho_ten_ph', e.target.value)} /></div>
          <div><Lbl>SĐT</Lbl><input className={inputCls} value={f.sdt_ph} onChange={(e) => set('sdt_ph', e.target.value)} /></div>
          <div><Lbl>Email</Lbl><input className={inputCls} value={f.email_ph} onChange={(e) => set('email_ph', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <Lbl>Nguồn (gõ tự do, gợi ý từ đã có)</Lbl>
            <input className={inputCls} value={f.nguon} onChange={(e) => set('nguon', e.target.value)} list="nguon-list" placeholder="Fanpage / Gọi điện / Giới thiệu…" />
            <datalist id="nguon-list">{nguonOpts.map((n) => <option key={n} value={n} />)}</datalist>
          </div>
          <div><Lbl>Lưu ý</Lbl><input className={inputCls} value={f.ghi_chu} onChange={(e) => set('ghi_chu', e.target.value)} placeholder="vd: referral — chị Lan giới thiệu" /></div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : edit ? 'Lưu' : 'Tạo'}</button>
        </div>
      </div>
    </Modal>
  )
}

// Tìm & chọn PH cũ (con thứ 2) — gõ tên/SĐT/mã → chọn → fill + link phu_huynh_id.
function PhCuPicker({ onPick }: { onPick: (ph: PhuHuynh) => void }) {
  const [q, setQ] = useState('')
  const [res, setRes] = useState<PhuHuynh[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!q.trim()) { setRes([]); return }
    let live = true
    const t = setTimeout(() => { listPhuHuynh(q).then((r) => { if (live) { setRes(r.slice(0, 8)); setOpen(true) } }).catch(() => {}) }, 200)
    return () => { live = false; clearTimeout(t) }
  }, [q])
  return (
    <div className="relative">
      <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => res.length && setOpen(true)}
        placeholder="🔎 Tìm PH cũ theo tên / SĐT / mã PH…" />
      {open && res.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {res.map((ph) => (
            <button key={ph.id} onClick={() => { onPick(ph); setQ(''); setOpen(false) }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-indigo-50">
              <span className="font-medium text-slate-800">{ph.ho_ten}</span>
              <span className="text-[12px] text-slate-400">{ph.so_dien_thoai || '—'} · {ph.ma_ph}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Tìm & chọn HS cũ (học thêm môn) — gõ tên/mã HS → chọn → fill HS + tự load PH.
function HsCuPicker({ onPick }: { onPick: (hs: { id: string; ho_ten: string; ma_hs: string | null }) => void }) {
  const [q, setQ] = useState('')
  const [res, setRes] = useState<{ id: string; ho_ten: string; ma_hs: string | null; khoi: string | null }[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!q.trim()) { setRes([]); return }
    let live = true
    const t = setTimeout(() => { timHocSinh(q).then((r) => { if (live) { setRes(r); setOpen(true) } }).catch(() => {}) }, 200)
    return () => { live = false; clearTimeout(t) }
  }, [q])
  return (
    <div className="relative">
      <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => res.length && setOpen(true)}
        placeholder="🔎 Tìm HS cũ theo tên / mã HS…" />
      {open && res.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {res.map((hs) => (
            <button key={hs.id} onClick={() => { onPick(hs); setQ(''); setOpen(false) }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-indigo-50">
              <span className="font-medium text-slate-800">{hs.ho_ten}</span>
              <span className="text-[12px] text-slate-400">{hs.ma_hs || '—'}{hs.khoi ? ` · K${hs.khoi}` : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LoaiModal({ uv, onClose, onDone }: { uv: UngVien; onClose: () => void; onDone: () => void }) {
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  async function go() {
    setBusy(true)
    try { await loaiUngVien(uv.id, lyDo.trim()); onDone() } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title={`Loại ứng viên: ${uv.ho_ten_hs}`} onClose={onClose}>
      <p className="mb-2 text-[13px] text-slate-500">Kéo ra khỏi phễu (giữ lịch sử để đo tỉ lệ chuyển đổi). Mở lại được ở tab "Đã loại".</p>
      <textarea className={`${inputCls} h-24`} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (không liên lạc được / không đạt / đổi ý…)" autoFocus />
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-rose-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-rose-500 disabled:opacity-50">{busy ? '…' : 'Xác nhận loại'}</button>
      </div>
    </Modal>
  )
}

function ConvertModal({ uv, onClose, onDone }: { uv: UngVien; onClose: () => void; onDone: () => void }) {
  const [khoi, setKhoi] = useState<string>(uv.khoi || DEFAULT_KHOI)
  const [lopId, setLopId] = useState<string | null>(uv.lop_du_kien_id)
  const [lops, setLops] = useState<Lop[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => { listLop().then(setLops).catch(() => {}) }, [])
  const lopOpts = useMemo(() => lops.filter((l) => l.mon === uv.mon).map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · ' + l.khoi : ''}` })), [lops, uv.mon])
  async function go() {
    setBusy(true)
    try { await convertUngVien(uv, { khoi, lopId }); onDone() } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  const hsCu = !!uv.hoc_sinh_goc_id
  return (
    <Modal title={hsCu ? 'Ghi danh HS cũ vào môn mới (L7 → L8)' : 'Nhập học sinh chính thức (L7 → L8)'} onClose={onClose}>
      <div className="mb-3 rounded-xl bg-slate-50 p-3 text-[13px] text-slate-600">
        <div className="font-medium text-slate-800">{uv.ho_ten_hs}{hsCu && <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700">HS cũ · {uv.mon}</span>}</div>
        <div className="text-[12px] text-slate-500">PH: {uv.ho_ten_ph || '—'} · {uv.sdt_ph || '—'}{hsCu ? ' (giữ nguyên — không tạo HS/PH mới)' : uv.sdt_ph ? ' (gộp PH cũ nếu SĐT đã có)' : ''}</div>
      </div>
      <div className="space-y-3">
        {!hsCu && <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Khối</label><select className={inputCls} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>}
        <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Xếp lớp {uv.mon} (tuỳ chọn — band đặt sau ở màn Học sinh)</label><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50">{busy ? (hsCu ? 'Đang ghi danh…' : 'Đang tạo HS…') : hsCu ? 'Ghi danh' : 'Tạo học sinh'}</button>
      </div>
    </Modal>
  )
}
