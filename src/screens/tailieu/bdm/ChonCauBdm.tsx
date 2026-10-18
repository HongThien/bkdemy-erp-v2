// Popup "✎ Chọn câu" cho 1 phần của giáo trình bản đồ mới (dạng bài / chưa phân / BTVN nhóm).
// Kho = câu kho chuẩn của NHÓM (fn_tl_bdm_cau), chia theo dạng bài; dạng bài đang soạn lên đầu, câu chưa phân dạng bài cuối.
// Câu đã dùng ở phần khác cùng buổi ⇒ khoá (DB cũng chặn lần nữa khi ghi). Thứ tự = thứ tự bấm (giống KhoPicker cũ).
import { useEffect, useState } from 'react'
import { cauCuaNhom, dangBaiCuaNhom, type CauKho } from '../../../lib/tailieuBdm'
import { fetchCausCuaTaiLieu, type TaiLieuNhanhCtx } from '../../../lib/tailieu'
import { LOAI_CAU, type CauHoi } from '../../../lib/kho/api'
import { CauPreview } from '../../../components/KhoPicker'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v

export default function ChonCauBdm({ tl, nhomId, uuTien, selected, khoa, onClose, onConfirm }: {
  tl: TaiLieuNhanhCtx
  nhomId: string
  uuTien: string | null                     // dạng bài đang soạn (lên đầu); null = cả nhóm
  selected: string[]
  khoa: string[]                            // câu đã dùng ở phần khác cùng buổi
  onClose: () => void
  onConfirm: (maCaus: string[]) => Promise<void> | void
}) {
  const [kho, setKho] = useState<CauKho[] | null>(null)
  const [dangBai, setDangBai] = useState<{ id: string; ten: string }[]>([])   // dạng bài của nhóm theo bản đồ (đặt tên nhóm câu)
  const [noiDung, setNoiDung] = useState<Map<string, CauHoi>>(new Map())
  const [err, setErr] = useState<string | null>(null)
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [fLoai, setFLoai] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [loiGhi, setLoiGhi] = useState<string | null>(null)
  const khoaSet = new Set(khoa.filter((m) => !selected.includes(m)))

  useEffect(() => {
    (async () => {
      try {
        const [k, ds] = await Promise.all([cauCuaNhom(nhomId), dangBaiCuaNhom(nhomId)])
        setKho(k); setDangBai(ds)
        const rows = await fetchCausCuaTaiLieu(tl, k.map((x) => x.ma_cau))
        setNoiDung(new Map(rows.map((c) => [c.ma_cau, c])))
      } catch (e: any) { setErr(e.message ?? String(e)) }
    })()
  }, [nhomId]) // eslint-disable-line

  const toggle = (ma: string) => { if (khoaSet.has(ma)) return; setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n }) }
  const toggleLoai = (v: string) => setFLoai((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n })

  // Nhóm câu theo dạng bài: dạng bài ưu tiên → các dạng bài khác (thứ tự bản đồ) → chưa phân.
  const thuTu: (string | null)[] = [...(uuTien ? [uuTien] : []), ...dangBai.map((d) => d.id).filter((id) => id !== uuTien)]
  for (const c of kho ?? []) if (c.dang_bai_id && !thuTu.includes(c.dang_bai_id)) thuTu.push(c.dang_bai_id)
  thuTu.push(null)
  const loc = (kho ?? []).filter((c) => !fLoai.size || fLoai.has(c.loai_cau))
  const nhomCau = thuTu.map((id) => ({ id, ten: id ? dangBai.find((d) => d.id === id)?.ten ?? id : 'Chưa phân dạng bài', caus: loc.filter((c) => c.dang_bai_id === id) }))
    .filter((g) => g.caus.length > 0)

  async function xong() {
    setBusy(true); setLoiGhi(null)
    try { await onConfirm([...sel]) } catch (e) { setLoiGhi((e as { message?: string })?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[75] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn câu từ kho</h3>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-6 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lọc loại:</span>
          {LOAI_CAU.map((l) => (
            <button key={l.value} onClick={() => toggleLoai(l.value)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${fLoai.has(l.value) ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700'}`}>{l.label}</button>
          ))}
          {fLoai.size > 0 && <button onClick={() => setFLoai(new Set())} className="ml-1 text-[12px] font-medium text-slate-400 hover:text-rose-600">Xoá lọc</button>}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
            : !kho ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : nhomCau.length === 0 ? <p className="text-sm text-slate-400">Nhóm này chưa có câu kho chuẩn{fLoai.size ? ' khớp lọc' : ''}.</p>
            : nhomCau.map((g) => (
              <div key={g.id ?? '__chua_phan__'} className="mb-5">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className={`text-[12.5px] font-semibold ${g.id ? 'text-indigo-700' : 'text-slate-400'}`}>{g.id === uuTien && g.id ? '★ ' : ''}{g.ten}</span>
                  <span className="text-[11px] text-slate-400">{g.caus.length} câu</span>
                </div>
                <div className="space-y-1">
                  {g.caus.map((k) => {
                    const c = noiDung.get(k.ma_cau)
                    const bi = khoaSet.has(k.ma_cau)
                    return (
                      <label key={k.ma_cau} title={bi ? 'Câu này đã dùng ở phần khác trong buổi' : undefined}
                        className={`flex flex-col gap-2 rounded-md border px-3 py-2 ${bi ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-55' : sel.has(k.ma_cau) ? 'cursor-pointer border-indigo-300 bg-indigo-50/40' : 'cursor-pointer border-slate-100 hover:bg-slate-50'}`}>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked={sel.has(k.ma_cau)} disabled={bi} onChange={() => toggle(k.ma_cau)} className="mt-1" />
                          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{k.ma_cau}</span>
                          <span className="ml-auto flex items-center gap-1.5">
                            {bi ? <span className="shrink-0 rounded bg-rose-100 px-1.5 text-[10px] font-semibold text-rose-600">đã dùng trong buổi</span>
                              : <span className={`shrink-0 rounded px-1.5 text-[10px] font-medium ${k.so_lan_dung > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{k.so_lan_dung > 0 ? `dùng ${k.so_lan_dung}×` : 'chưa dùng'}</span>}
                            {!k.la_goc && <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] text-slate-400">bản sao</span>}
                            <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(k.loai_cau)}</span>
                          </span>
                        </div>
                        {c ? <CauPreview c={c} /> : <span className="text-[12px] text-slate-300">…</span>}
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-3">
          {loiGhi && <span className="mr-auto text-[12.5px] text-rose-600">⚠ {loiGhi}</span>}
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={xong} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Dùng {sel.size} câu</button>
        </div>
      </div>
    </div>
  )
}
