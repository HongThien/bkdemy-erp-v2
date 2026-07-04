// Học phí (staff, Apple-clean §189 — KHÔNG sci-fi). Spec: spec-hocphi.md.
// 4 tab: Phiếu (chọn PH+kỳ → phiếu ảo/thật, chốt kỳ, thu tiền) · Xét duyệt (người-trong-vòng-lặp,
// KHÔNG auto-giảm) · Mức học phí · Mức học liệu (config sửa 1 chỗ, đổi hàng loạt lớp).
import { useEffect, useState } from 'react'
import {
  listMucHocPhi, createMucHocPhi, deleteMucHocPhi,
  listMucHocLieu, createMucHocLieu, deleteMucHocLieu,
  listPhuHuynhCoConDangHoc, getPhieuAo, getHoaDonByKy, getHoaDonDong, chotKy, ghiThanhToan, listThanhToan, tinhSoDuNo,
  listXetDuyetChoDuyet, duyetXetDuyet, kyHienTai,
  type MucHocPhi, type MucHocLieu, type PHOpt, type PhieuAo, type XetDuyet, type ThanhToan, type DongPhieu,
} from '../../lib/hocphi'
import SearchSelect from '../../components/SearchSelect'
import { inp } from '../kho/ui'

const tienVN = (n: number) => Math.round(n).toLocaleString('vi-VN') + 'đ'
const LOAI_LABEL: Record<string, string> = { hoc_phi: 'Học phí', hoc_duoi: 'Học đuổi', hoc_lieu: 'Học liệu', phat_sinh: 'Phát sinh', no_ky_truoc: 'Nợ kỳ trước' }
const TAB = [['phieu', 'Phiếu'], ['xetduyet', 'Xét duyệt'], ['muchocphi', 'Mức học phí'], ['muchoclieu', 'Mức học liệu']] as const
type Tab = (typeof TAB)[number][0]

export default function HocPhiScreen() {
  const [tab, setTab] = useState<Tab>('phieu')
  const [soChoDuyet, setSoChoDuyet] = useState(0)
  useEffect(() => { listXetDuyetChoDuyet().then((r) => setSoChoDuyet(r.length)) }, [tab])
  return (
    <div className="flex h-full flex-col bg-[#f5f5f7]">
      <div className="flex flex-none items-center gap-1.5 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Học phí</span>
        {TAB.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${tab === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            {l}{v === 'xetduyet' && soChoDuyet > 0 ? ` (${soChoDuyet})` : ''}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {tab === 'phieu' && <PhieuTab />}
        {tab === 'xetduyet' && <XetDuyetTab onChanged={() => listXetDuyetChoDuyet().then((r) => setSoChoDuyet(r.length))} />}
        {tab === 'muchocphi' && <MucHocPhiTab />}
        {tab === 'muchoclieu' && <MucHocLieuTab />}
      </div>
    </div>
  )
}

// ── TAB PHIẾU — chọn PH + kỳ → phiếu ảo/thật, chốt, thu tiền ────────────────
function PhieuTab() {
  const [phs, setPhs] = useState<PHOpt[]>([])
  const [phId, setPhId] = useState<string | null>(null)
  const [ky, setKy] = useState(kyHienTai())
  const [ao, setAo] = useState<PhieuAo | null>(null)
  const [dongChot, setDongChot] = useState<DongPhieu[]>([]) // dòng ĐÃ CHỐT (snapshot, đọc lại — khác ao.dong tính realtime)
  const [hd, setHd] = useState<{ id: string; trang_thai: string; tong_tien: number } | null>(null)
  const [thanhToans, setThanhToans] = useState<ThanhToan[]>([])
  const [soDuNo, setSoDuNo] = useState(0)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [thuTien, setThuTien] = useState('')
  const [phatSinh, setPhatSinh] = useState<{ mo_ta: string; thanh_tien: number }[]>([])

  useEffect(() => { listPhuHuynhCoConDangHoc().then(setPhs) }, [])

  async function reload() {
    if (!phId) return
    setLoading(true); setErr(null)
    try {
      const existed = await getHoaDonByKy(phId, ky)
      setHd(existed)
      if (existed) { setThanhToans(await listThanhToan(existed.id)); setDongChot(await getHoaDonDong(existed.id)); setAo(null) }
      else { setAo(await getPhieuAo(phId, ky)); setThanhToans([]); setDongChot([]) }
      setSoDuNo(await tinhSoDuNo(phId))
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { setPhatSinh([]); reload() }, [phId, ky]) // eslint-disable-line

  async function xacNhanChot() {
    if (!phId) return
    setBusy(true); setErr(null)
    try { await chotKy(phId, ky, phatSinh); await reload() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function xacNhanThu() {
    if (!hd || !thuTien.trim()) return
    const soTien = Number(thuTien.replace(/[.,]/g, ''))
    if (!soTien || soTien <= 0) { setErr('Số tiền không hợp lệ.'); return }
    setBusy(true); setErr(null)
    try { await ghiThanhToan(hd.id, soTien); setThuTien(''); await reload() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  function themPhatSinh() {
    const moTa = prompt('Mô tả khoản phát sinh:')?.trim(); if (!moTa) return
    const soTienStr = prompt('Số tiền (đ):')?.trim(); const soTien = Number(soTienStr?.replace(/[.,]/g, ''))
    if (!soTien) return
    setPhatSinh((a) => [...a, { mo_ta: moTa, thanh_tien: soTien }])
  }

  const dong = hd ? dongChot : (ao?.dong ?? [])
  const tongTien = ao ? ao.tongTien + phatSinh.reduce((s, p) => s + p.thanh_tien, 0) : (hd?.tong_tien ?? 0)
  const daThu = thanhToans.reduce((s, t) => s + Number(t.so_tien), 0)

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="w-72"><SearchSelect value={phId} onChange={setPhId} placeholder="Chọn phụ huynh…" options={phs.map((p) => ({ id: p.id, label: p.ho_ten, sub: `${p.ma_ph} · ${p.soCon} con` }))} /></div>
        <input type="month" value={ky.slice(0, 7)} onChange={(e) => setKy(e.target.value + '-01')} className={`${inp} w-40`} />
      </div>

      {err && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{err}</div>}
      {!phId ? <p className="py-10 text-center text-sm text-slate-400">Chọn phụ huynh để xem phiếu.</p>
        : loading ? <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
        : (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-900">Phiếu tháng {ky.slice(5, 7)}/{ky.slice(0, 4)}</span>
            <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${hd ? (hd.trang_thai === 'da_thu' ? 'bg-emerald-50 text-emerald-700' : hd.trang_thai === 'thu_mot_phan' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600') : 'bg-indigo-50 text-indigo-700'}`}>
              {hd ? { chua_thu: 'Chưa thu', da_thu: 'Đã thu', thu_mot_phan: 'Thu 1 phần', qua_han: 'Quá hạn', xet_duyet: 'Chờ xét duyệt', mien: 'Miễn' }[hd.trang_thai] ?? hd.trang_thai : 'Phiếu ảo (chưa chốt)'}
            </span>
          </div>

          {ao?.choDuyet.length ? (
            <div className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              ⚠ Còn {ao.choDuyet.length} hàng chờ xét duyệt (nghỉ ≥30% / lệch window) — sang tab "Xét duyệt" trước khi chốt.
            </div>
          ) : null}

          <table className="w-full text-[13px]">
            <thead className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <tr><th className="py-1.5">Loại</th><th>Con / Lớp</th><th>Chi tiết</th><th className="text-right">Thành tiền</th></tr>
            </thead>
            <tbody>
              {dong.map((d, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="py-1.5"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{LOAI_LABEL[d.loai]}</span></td>
                  <td className="text-slate-700">{d.hoc_sinh_ten ?? '—'}{d.lop_ten ? ` · ${d.lop_ten}` : ''}</td>
                  <td className="text-slate-500">{d.loai === 'hoc_phi' ? `${d.so_luong} buổi × ${tienVN(d.don_gia ?? 0)}${d.he_so && d.he_so !== 1 ? ` × ${d.he_so}` : ''}` : d.mo_ta ?? ''}</td>
                  <td className="text-right font-medium text-slate-800">{tienVN(d.thanh_tien)}</td>
                </tr>
              ))}
              {phatSinh.map((p, i) => (
                <tr key={'ps' + i} className="border-b border-slate-50">
                  <td className="py-1.5"><span className="rounded bg-violet-100 px-1.5 py-0.5 text-[11px] font-medium text-violet-700">Phát sinh</span></td>
                  <td className="text-slate-700">—</td><td className="text-slate-500">{p.mo_ta}</td>
                  <td className="text-right font-medium text-slate-800">{tienVN(p.thanh_tien)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!dong.length && !phatSinh.length && <p className="py-6 text-center text-[13px] text-slate-400">Không có khoản nào trong kỳ.</p>}

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            {!hd && <button onClick={themPhatSinh} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400">+ Khoản phát sinh</button>}
            <span className="ml-auto text-[15px] font-semibold text-slate-900">Tổng: {tienVN(tongTien)}</span>
          </div>

          {!hd ? (
            <div className="mt-4 text-right">
              <button disabled={busy || !dong.length || !!ao?.choDuyet.length} onClick={xacNhanChot} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang chốt…' : '🔒 Chốt kỳ'}</button>
            </div>
          ) : (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Đã thu {tienVN(daThu)} / {tienVN(hd.tong_tien)}</span>
                <span className={`font-medium ${soDuNo > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Dư nợ hiện tại: {tienVN(soDuNo)}</span>
              </div>
              {thanhToans.length > 0 && (
                <ul className="mt-2 space-y-1 text-[12px] text-slate-500">
                  {thanhToans.map((t) => <li key={t.id}>• {t.ngay}: {tienVN(t.so_tien)}{t.phuong_thuc ? ` (${t.phuong_thuc})` : ''}</li>)}
                </ul>
              )}
              {hd.trang_thai !== 'da_thu' && (
                <div className="mt-3 flex items-center gap-2">
                  <input value={thuTien} onChange={(e) => setThuTien(e.target.value)} placeholder="Số tiền thu…" className={`${inp} w-40`} />
                  <button disabled={busy || !thuTien.trim()} onClick={xacNhanThu} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">Ghi thu tiền</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── TAB XÉT DUYỆT ────────────────────────────────────────────────────────────
function XetDuyetTab({ onChanged }: { onChanged: () => void }) {
  const [rows, setRows] = useState<XetDuyet[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [inputs, setInputs] = useState<Record<string, { soBuoi: string; ghiChu: string }>>({})
  async function reload() { setLoading(true); try { setRows(await listXetDuyetChoDuyet()) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [])

  async function duyet(r: XetDuyet, dungMacDinh: boolean) {
    const inp2 = inputs[r.id]
    const soBuoi = dungMacDinh ? (r.so_buoi_window ?? 0) : Number(inp2?.soBuoi ?? r.so_buoi_window ?? 0)
    const ghiChu = inp2?.ghiChu || (dungMacDinh ? 'Giữ nguyên số buổi window' : 'Chỉnh tay')
    setBusyId(r.id)
    try { await duyetXetDuyet(r.id, soBuoi, ghiChu); await reload(); onChanged() } finally { setBusyId(null) }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-2.5">
      <p className="mb-1 text-[12px] text-slate-400">Người-trong-vòng-lặp ở chỗ tiền nhạy cảm — KHÔNG tự động giảm/miễn. Duyệt xong phiếu của PH mới chốt được.</p>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : rows.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Không có hàng nào chờ duyệt. 🎉</div>
        : rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${r.ly_do === 'nghi_30' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{r.ly_do === 'nghi_30' ? '🚩 Nghỉ ≥30%' : '↔ Lệch window'}</span>
              <span className="text-[12px] text-slate-400">Kỳ {r.ky.slice(5, 7)}/{r.ky.slice(0, 4)}</span>
            </div>
            <div className="mb-3 flex gap-4 text-[13px] text-slate-600">
              <span>Buổi lớp: <b>{r.so_buoi_lop}</b></span>
              <span>Buổi trong window: <b>{r.so_buoi_window}</b></span>
              <span>Buổi nghỉ: <b className="text-rose-600">{r.so_buoi_nghi}</b></span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button disabled={busyId === r.id} onClick={() => duyet(r, true)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40">✓ Giữ nguyên ({r.so_buoi_window} buổi)</button>
              <input placeholder="Số buổi khác…" value={inputs[r.id]?.soBuoi ?? ''} onChange={(e) => setInputs((s) => ({ ...s, [r.id]: { ...s[r.id], soBuoi: e.target.value } }))} className={`${inp} w-28`} />
              <input placeholder="Ghi chú quyết định…" value={inputs[r.id]?.ghiChu ?? ''} onChange={(e) => setInputs((s) => ({ ...s, [r.id]: { ...s[r.id], ghiChu: e.target.value } }))} className={`${inp} w-52`} />
              <button disabled={busyId === r.id || !inputs[r.id]?.soBuoi} onClick={() => duyet(r, false)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400 disabled:opacity-40">Chốt số khác</button>
            </div>
          </div>
        ))}
    </div>
  )
}

// ── TAB MỨC HỌC PHÍ / MỨC HỌC LIỆU (config CRUD) ────────────────────────────
function MucHocPhiTab() {
  const [rows, setRows] = useState<MucHocPhi[]>([])
  const [ten, setTen] = useState(''); const [donGia, setDonGia] = useState(''); const [giaDuoi, setGiaDuoi] = useState('')
  async function reload() { setRows(await listMucHocPhi()) }
  useEffect(() => { reload() }, [])
  async function them() {
    if (!ten.trim() || !donGia || !giaDuoi) return
    await createMucHocPhi({ ten: ten.trim(), don_gia_buoi: Number(donGia), gia_duoi: Number(giaDuoi) })
    setTen(''); setDonGia(''); setGiaDuoi(''); reload()
  }
  return (
    <div className="mx-auto max-w-[700px]">
      <div className="mb-3 flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <Field2 label="Tên mức"><input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Mức 250k" className={inp} /></Field2>
        <Field2 label="Đơn giá/buổi"><input value={donGia} onChange={(e) => setDonGia(e.target.value)} placeholder="250000" className={inp} /></Field2>
        <Field2 label="Giá đuổi"><input value={giaDuoi} onChange={(e) => setGiaDuoi(e.target.value)} placeholder="250000" className={inp} /></Field2>
        <button onClick={them} className="h-8 rounded-lg bg-indigo-600 px-3 text-[13px] font-medium text-white">+ Thêm</button>
      </div>
      <div className="space-y-1.5">
        {rows.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px]">
            <span className="flex-1 font-medium text-slate-800">{m.ten}</span>
            <span className="text-slate-500">{tienVN(m.don_gia_buoi)}/buổi</span>
            <span className="text-slate-500">đuổi {tienVN(m.gia_duoi)}</span>
            <button onClick={async () => { if (confirm(`Xoá "${m.ten}"? (lớp đang gán mức này sẽ mất mức)`)) { await deleteMucHocPhi(m.id); reload() } }} className="text-slate-300 hover:text-rose-600">Xoá</button>
          </div>
        ))}
        {!rows.length && <p className="py-8 text-center text-[13px] text-slate-400">Chưa có mức nào.</p>}
      </div>
    </div>
  )
}
function MucHocLieuTab() {
  const [rows, setRows] = useState<MucHocLieu[]>([])
  const [ten, setTen] = useState(''); const [gia, setGia] = useState('')
  async function reload() { setRows(await listMucHocLieu()) }
  useEffect(() => { reload() }, [])
  async function them() {
    if (!ten.trim() || !gia) return
    await createMucHocLieu({ ten: ten.trim(), gia: Number(gia) })
    setTen(''); setGia(''); reload()
  }
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="mb-3 flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <Field2 label="Tên mức"><input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Mức 30k" className={inp} /></Field2>
        <Field2 label="Giá / tháng"><input value={gia} onChange={(e) => setGia(e.target.value)} placeholder="30000" className={inp} /></Field2>
        <button onClick={them} className="h-8 rounded-lg bg-indigo-600 px-3 text-[13px] font-medium text-white">+ Thêm</button>
      </div>
      <div className="space-y-1.5">
        {rows.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px]">
            <span className="flex-1 font-medium text-slate-800">{m.ten}</span>
            <span className="text-slate-500">{tienVN(m.gia)}/tháng</span>
            <button onClick={async () => { if (confirm(`Xoá "${m.ten}"?`)) { await deleteMucHocLieu(m.id); reload() } }} className="text-slate-300 hover:text-rose-600">Xoá</button>
          </div>
        ))}
        {!rows.length && <p className="py-8 text-center text-[13px] text-slate-400">Chưa có mức nào.</p>}
      </div>
    </div>
  )
}
function Field2({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex-1"><label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</label>{children}</div>
}
