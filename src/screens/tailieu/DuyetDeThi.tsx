// ═══════════ ĐỀ THI · GIAO ĐỀ + LƯỢT THI (spec-de-thi.md §9.3) ═══════════
// Màn sửa + duyệt đề đã GỘP vào KhoDeThi.tsx (DeThiSoan, 01/10/2026). File này giữ phần giao đề cho lớp và bảng kết quả từng lượt.
// Snapshot + chấm + kết quả đều ở Postgres (fn_de_thi_*) — client chỉ gọi + hiển thị.
import { useEffect, useState } from 'react'
import { moDeThi, listLuotThi, ketQuaLuot, thuBaiLuot, datKhoaDapAn, type DeThi, type LuotThi, type KetQuaLuot } from '../../lib/dethi'
import { listLop, type Lop } from '../../lib/nhansu'
import { inp } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'

// Ngày hôm nay theo giờ máy (VN) — KHÔNG toISOString (CLAUDE.md §2 timezone)
function homNay(): string { const d = new Date(); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }

// ═══════════ PHÁT HÀNH ONLINE ═══════════
export function PhatHanhDeThiModal({ de, thoiGianMacDinh, onClose, onDone }: { de: DeThi; thoiGianMacDinh: number | null; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState(homNay())
  const [phut, setPhut] = useState<string>(String(thoiGianMacDinh ?? 90))
  const [khoa, setKhoa] = useState(true)
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then(setLops) }, [])
  async function xacNhan() {
    if (!lopId || !ngay) return
    setBusy(true)
    try {
      await moDeThi(de.id, lopId, ngay, phut.trim() ? Math.max(1, Math.round(+phut)) : null, khoa)
      setRes({ ok: true, msg: 'Đã phát hành — học sinh lớp này thấy đề ở ô "Làm đề thi thử".' }); onDone()
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Phát hành đề thi cho lớp thi trên app</p>
        {!de.duyet_at ? (
          <>
            <p className="mt-3 text-[13px] text-rose-600">Đề chưa duyệt. Bấm "✅ Duyệt đề", xử lý hết câu thiếu rồi mới phát hành được.</p>
            <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button></div>
          </>
        ) : res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button></div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-slate-500">Chế độ THI: giấu đáp án, chấm ở server, mỗi em nộp 1 lần. Trắc nghiệm + đúng/sai; câu trả lời ngắn hiện thành 4 phương án; câu tự luận không lên app.</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp</label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="block text-[12px] font-medium text-slate-600">Ngày thi</label><input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={`${inp} mt-1 w-full`} /></div>
              <div><label className="block text-[12px] font-medium text-slate-600">Thời gian làm bài (phút)</label><input type="number" min={1} value={phut} onChange={(e) => setPhut(e.target.value)} placeholder="để trống = không giới hạn" className={`${inp} mt-1 w-full`} /></div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-[13px] text-slate-700">
              <input type="checkbox" checked={khoa} onChange={(e) => setKhoa(e.target.checked)} /> Khoá đáp án + điểm tới khi thầy/cô mở
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang phát hành…' : 'Phát hành'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════ CÁC LƯỢT THI CỦA ĐỀ ═══════════
export function LuotThiPanel({ deId, lamMoi }: { deId: string; lamMoi: number }) {
  const [luots, setLuots] = useState<LuotThi[] | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  useEffect(() => { listLuotThi(deId).then(setLuots).catch(() => setLuots([])) }, [deId, lamMoi])
  if (!luots || !luots.length) return null
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 font-semibold text-slate-800">Các lượt thi trên app</p>
      <div className="space-y-2">
        {luots.map((l) => (
          <div key={l.id} className="rounded-lg border border-slate-100">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-[13px]">
              <span className="font-medium text-slate-800">{l.lop_ten}</span>
              <span className="text-slate-500">{l.ngay.split('-').reverse().join('/')}</span>
              <span className="text-slate-500">{l.thoi_gian_phut ? `${l.thoi_gian_phut} phút` : 'không giới hạn'}</span>
              <span className="text-slate-500">{l.so_cau} câu</span>
              <span className={`rounded px-1.5 py-0.5 text-[11px] ${l.khoa_reveal ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{l.khoa_reveal ? 'đáp án đang khoá' : 'đã mở đáp án'}</span>
              <button onClick={() => setMo(mo === l.id ? null : l.id)} className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-[12px] text-slate-700 hover:border-indigo-300">{mo === l.id ? 'Ẩn kết quả' : 'Kết quả'}</button>
            </div>
            {mo === l.id && <KetQuaBang luot={l} onKhoa={(k) => setLuots((s) => s?.map((x) => (x.id === l.id ? { ...x, khoa_reveal: k } : x)) ?? s)} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function KetQuaBang({ luot, onKhoa }: { luot: LuotThi; onKhoa: (khoa: boolean) => void }) {
  const [kq, setKq] = useState<KetQuaLuot | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const tai = () => ketQuaLuot(luot.id).then(setKq).catch((e) => setMsg(e.message ?? String(e)))
  useEffect(() => { tai() }, [luot.id]) // eslint-disable-line
  async function thuBai() {
    if (!confirm('Thu bài: mọi bài đang làm dở của lượt này sẽ được nộp + chấm ngay. Tiếp tục?')) return
    setBusy(true)
    try { const n = await thuBaiLuot(luot.id); setMsg(`Đã thu ${n} bài.`); await tai() } catch (e: any) { setMsg(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function doiKhoa() {
    setBusy(true)
    try { await datKhoaDapAn(luot.id, !luot.khoa_reveal); onKhoa(!luot.khoa_reveal) } catch (e: any) { setMsg(e.message ?? String(e)) } finally { setBusy(false) }
  }
  if (!kq) return <p className="px-3 pb-3 text-[12px] text-slate-400">{msg ?? 'Đang tải…'}</p>
  const tt = { chua_lam: 'Chưa làm', dang_lam: 'Đang làm', da_nop: 'Đã nộp' }
  return (
    <div className="border-t border-slate-100 px-3 pb-3 pt-2">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-slate-500">Tối đa {kq.toi_da} đ · quy về thang 10</span>
        {msg && <span className="text-indigo-600">{msg}</span>}
        <button disabled={busy} onClick={thuBai} className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-slate-700 disabled:opacity-40">📥 Thu bài</button>
        <button disabled={busy} onClick={doiKhoa} className={`rounded px-2 py-0.5 font-medium text-white disabled:opacity-40 ${luot.khoa_reveal ? 'bg-emerald-600' : 'bg-slate-500'}`}>{luot.khoa_reveal ? '🔓 Mở đáp án cho HS' : '🔒 Khoá lại'}</button>
      </div>
      <table className="w-full text-[12px]">
        <thead><tr className="text-left text-slate-500">
          <th className="py-1 font-medium">Học sinh</th><th className="font-medium">Trạng thái</th><th className="font-medium">Điểm /10</th>
          {kq.phan.map((p) => <th key={p.phan} className="font-medium">{p.phan || 'Câu'} <span className="text-slate-400">/{p.toi_da}</span></th>)}
        </tr></thead>
        <tbody>
          {kq.hs.map((h) => (
            <tr key={h.hoc_sinh_id} className="border-t border-slate-100">
              <td className="py-1 text-slate-800">{h.ho_ten}</td>
              <td className={h.trang_thai === 'da_nop' ? 'text-emerald-700' : h.trang_thai === 'dang_lam' ? 'text-amber-700' : 'text-slate-400'}>{tt[h.trang_thai]}</td>
              <td className="font-semibold text-slate-800">{h.diem_10 ?? '—'}</td>
              {kq.phan.map((p) => <td key={p.phan} className="text-slate-600">{h.theo_phan ? h.theo_phan[p.phan] ?? 0 : '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
