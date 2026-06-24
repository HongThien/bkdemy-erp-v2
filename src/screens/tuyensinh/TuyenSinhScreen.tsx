// Màn TUYỂN SINH — phễu Test đầu vào L5→L8 (ADR app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233).
// Toggle bar L5/L6/L7/L8/Đã loại · mỗi level: bảng ứng viên × cột-việc (checkbox) + Hoàn thành + Loại · L7 hoàn thành = convert tạo HS.
// Gu Apple-clean (nền xám + card trắng + pill mềm).
import { useEffect, useMemo, useState } from 'react'
import {
  LEVELS, LEVEL_TEN, VIEC_BY_LEVEL, duViec, listUngVien, listLoai, getViecXong, toggleViec, hoanThanhLevel,
  loaiUngVien, moLaiUngVien, createUngVien, convertUngVien, demTheoLevel, listNguon, listHSDangHoc, suggestMaUV,
  type UngVien, type UngVienLevel,
} from '../../lib/tuyensinh'
import { listLop, type Lop } from '../../lib/nhansu'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import SearchSelect from '../../components/SearchSelect'

type Tab = UngVienLevel | 'L8' | 'loai'
const TABS: Tab[] = [...LEVELS, 'L8', 'loai']
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'

export default function TuyenSinhScreen() {
  const [tab, setTab] = useState<Tab>('L5')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [rows, setRows] = useState<UngVien[]>([])
  const [done, setDone] = useState<Record<string, Set<string>>>({})
  const [hs, setHs] = useState<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null }[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [convertUv, setConvertUv] = useState<UngVien | null>(null)
  const [loaiUv, setLoaiUv] = useState<UngVien | null>(null)

  async function reloadCounts() { try { setCounts(await demTheoLevel()) } catch { /* */ } }
  async function reload() {
    setLoading(true)
    try {
      if (tab === 'L8') { setHs(await listHSDangHoc()); setRows([]) }
      else if (tab === 'loai') { setRows(await listLoai()); setDone({}) }
      else { const r = await listUngVien(tab); setRows(r); setDone(await getViecXong(r.map((x) => x.id))) }
    } catch { setRows([]) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tab]) // eslint-disable-line
  useEffect(() => { reloadCounts() }, [])
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
          <button onClick={() => setShowCreate(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm ứng viên</button>
        </div>

        {/* Toggle bar level */}
        <div className="mb-4 inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => {
            const on = tab === t
            const lbl = t === 'loai' ? 'Đã loại' : `${t} · ${LEVEL_TEN[t]}`
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-xl px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {lbl}{counts[t] != null ? <span className={`ml-1.5 rounded-full px-1.5 text-[12px] ${on ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{counts[t]}</span> : null}
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
                    {viecCols.map((v) => <th key={v.key} className="px-3 py-3 text-center font-medium">{v.ten}{v.derive && <span className="ml-1 rounded bg-violet-100 px-1 text-[10px] font-medium text-violet-600" title="Sẽ tự động khi nối chấm bài test">auto</span>}</th>)}
                    <th className="px-4 py-3 text-right font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={5 + viecCols.length} className="px-4 py-10 text-center text-[14px] text-slate-400">Chưa có ứng viên ở {tab}.</td></tr>
                  ) : rows.map((uv) => {
                    const d = done[uv.id]
                    const ready = duViec(tab as UngVienLevel, d)
                    return (
                      <tr key={uv.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                        <td className="px-4 py-3"><div className="font-medium text-slate-800">{uv.ho_ten_hs}</div><div className="text-[12px] text-slate-400">{uv.ma_uv} · {uv.mon}</div></td>
                        <td className="px-4 py-3 text-slate-600">{uv.ho_ten_ph || <span className="text-slate-300">—</span>}<div className="text-[12px] text-slate-400">{uv.sdt_ph}</div></td>
                        <td className="px-3 py-3 text-slate-600">{uv.khoi || '—'}</td>
                        <td className="px-3 py-3 text-slate-600">{uv.nguon || <span className="text-slate-300">—</span>}</td>
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

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onDone={async () => { setShowCreate(false); await refresh() }} />}
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
        <thead><tr className="border-b border-slate-200 text-left text-[13px] text-slate-500"><th className="px-4 py-3 font-medium">Ứng viên</th><th className="px-4 py-3 font-medium">Phụ huynh</th><th className="px-4 py-3 font-medium">Lý do loại</th><th className="px-4 py-3 text-right font-medium">Hành động</th></tr></thead>
        <tbody>
          {rows.map((uv) => (
            <tr key={uv.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3"><div className="font-medium text-slate-800">{uv.ho_ten_hs}</div><div className="text-[12px] text-slate-400">{uv.ma_uv} · {uv.level}</div></td>
              <td className="px-4 py-3 text-slate-600">{uv.ho_ten_ph}<div className="text-[12px] text-slate-400">{uv.sdt_ph}</div></td>
              <td className="px-4 py-3 text-slate-600">{uv.ly_do_loai || '—'}</td>
              <td className="px-4 py-3 text-right"><button onClick={() => onMoLai(uv.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-indigo-600 hover:border-indigo-300">↩ Mở lại</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">{title}</div>
        {children}
      </div>
    </div>
  )
}

function CreateModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [hoTenHs, setHoTenHs] = useState('')
  const [hoTenPh, setHoTenPh] = useState('')
  const [sdt, setSdt] = useState('')
  const [khoi, setKhoi] = useState<string>(DEFAULT_KHOI)
  const [nguon, setNguon] = useState('')
  const [maUv, setMaUv] = useState('')
  const [nguonOpts, setNguonOpts] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => { suggestMaUV().then(setMaUv).catch(() => {}); listNguon().then(setNguonOpts).catch(() => {}) }, [])
  async function save() {
    if (!hoTenHs.trim()) { alert('Nhập tên học sinh'); return }
    setBusy(true)
    try { await createUngVien({ ho_ten_hs: hoTenHs.trim(), ho_ten_ph: hoTenPh.trim() || null, sdt_ph: sdt.trim() || null, khoi, nguon: nguon.trim() || null, ma_uv: maUv.trim() || undefined }); onDone() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Thêm ứng viên (L5 · Đăng ký test)" onClose={onClose}>
      <div className="space-y-3">
        <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Tên học sinh *</label><input className={inputCls} value={hoTenHs} onChange={(e) => setHoTenHs(e.target.value)} autoFocus /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Tên phụ huynh</label><input className={inputCls} value={hoTenPh} onChange={(e) => setHoTenPh(e.target.value)} /></div>
          <div><label className="mb-1 block text-[13px] font-medium text-slate-600">SĐT phụ huynh</label><input className={inputCls} value={sdt} onChange={(e) => setSdt(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Khối</label><select className={inputCls} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
          <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Mã UV</label><input className={inputCls} value={maUv} onChange={(e) => setMaUv(e.target.value)} /></div>
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-slate-600">Nguồn (gõ tự do, gợi ý từ đã có)</label>
          <input className={inputCls} value={nguon} onChange={(e) => setNguon(e.target.value)} list="nguon-list" placeholder="Fanpage / Gọi điện / Giới thiệu…" />
          <datalist id="nguon-list">{nguonOpts.map((n) => <option key={n} value={n} />)}</datalist>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Tạo'}</button>
        </div>
      </div>
    </Modal>
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
  const lopOpts = useMemo(() => lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · ' + l.khoi : ''}` })), [lops])
  async function go() {
    setBusy(true)
    try { await convertUngVien(uv, { khoi, lopId }); onDone() } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Nhập học sinh chính thức (L7 → L8)" onClose={onClose}>
      <div className="mb-3 rounded-xl bg-slate-50 p-3 text-[13px] text-slate-600">
        <div className="font-medium text-slate-800">{uv.ho_ten_hs}</div>
        <div className="text-[12px] text-slate-500">PH: {uv.ho_ten_ph || '—'} · {uv.sdt_ph || '—'}{uv.sdt_ph ? ' (gộp PH cũ nếu SĐT đã có)' : ''}</div>
      </div>
      <div className="space-y-3">
        <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Khối</label><select className={inputCls} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
        <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Xếp lớp (tuỳ chọn — band đặt sau ở màn Học sinh)</label><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50">{busy ? 'Đang tạo HS…' : 'Tạo học sinh'}</button>
      </div>
    </Modal>
  )
}
