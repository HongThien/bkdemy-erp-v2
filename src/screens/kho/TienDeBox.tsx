// TienDeBox — gắn/gỡ TIỀN ĐỀ (thứ tự học) cho 1 nút, dùng chung 2 tầng: DẠNG↔DẠNG và CỤM↔CỤM.
// Spec: spec-cum-bai.md §1 & §6.3.
// ⚠ RANH GIỚI: tiền đề tầng CỤM chỉ phục vụ THỨ TỰ DẠY + builder tài liệu. KP đo mastery vẫn là DẠNG —
//   cấm đưa quan hệ này vào công thức đo (sẽ trộn nhiều trình độ vào một con số).
// Chống chu trình nằm ở `themTienDe` (gọi hàm hậu duệ ở Postgres) — ở đây chỉ hiển thị lỗi trả về.
import { useEffect, useState } from 'react'
import { listTienDe, themTienDe, xoaTienDe, type Tang } from '../../lib/kho/api'

export type NutChon = { ma: string; ten: string }

export default function TienDeBox({ nut, tang, cauTbl, ungVien, nhan }: {
  nut: string
  tang: Tang
  cauTbl: string
  ungVien: NutChon[]              // tập chọn được (dạng cùng nhánh / cụm cùng dạng) — ĐÃ trừ chính nó
  nhan: string                    // 'dạng' | 'cụm' — chỉ để viết câu chữ cho đúng
}) {
  const [tienDe, setTienDe] = useState<string[]>([])
  const [phuThuoc, setPhuThuoc] = useState<string[]>([])
  const [them, setThem] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const tenCua = (ma: string) => ungVien.find((u) => u.ma === ma)?.ten ?? ma

  async function reload() {
    try { const r = await listTienDe(nut, tang, cauTbl); setTienDe(r.tienDe); setPhuThuoc(r.phuThuoc) }
    catch (e: any) { setErr(e.message ?? String(e)) }
  }
  useEffect(() => { reload() }, [nut, tang]) // eslint-disable-line

  async function onThem() {
    if (!them) return
    setBusy(true); setErr(null)
    try { await themTienDe(nut, them, tang, cauTbl); setThem(''); await reload() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function onXoa(td: string) {
    setBusy(true); setErr(null)
    try { await xoaTienDe(nut, td, tang, cauTbl); await reload() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const conLai = ungVien.filter((u) => u.ma !== nut && !tienDe.includes(u.ma))
  const chip = 'inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 ring-1 ring-slate-200'

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Học trước</span>
        {tienDe.length === 0 && <span className="text-[12px] text-slate-400">chưa đặt tiền đề nào</span>}
        {tienDe.map((td) => (
          <span key={td} className={chip}>
            {tenCua(td)}
            <button onClick={() => onXoa(td)} disabled={busy} className="text-slate-300 hover:text-rose-600" title="Gỡ tiền đề">✕</button>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <select value={them} onChange={(e) => setThem(e.target.value)}
          className="h-8 max-w-[280px] rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500">
          <option value="">+ thêm {nhan} phải học trước…</option>
          {conLai.map((u) => <option key={u.ma} value={u.ma}>{u.ten}</option>)}
        </select>
        <button onClick={onThem} disabled={!them || busy}
          className="h-8 rounded-md bg-slate-800 px-3 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-40">Thêm</button>
      </div>
      {phuThuoc.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-2">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Mở khoá</span>
          {phuThuoc.map((p) => <span key={p} className="rounded-full bg-slate-100 px-2.5 py-1 text-[12px] text-slate-500">{tenCua(p)}</span>)}
        </div>
      )}
      {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
    </div>
  )
}
