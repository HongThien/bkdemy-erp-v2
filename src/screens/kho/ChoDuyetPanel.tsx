// Panel "Câu chờ duyệt" — câu clone (Claude Code / máy sinh theo mẫu) CHƯA có trong dai_cau_hoi thật.
// Duyệt = promote sang dai_cau_hoi (da_duyet=true luôn). Từ chối = chỉ đánh dấu trong bảng nháp, không đụng dai_cau_hoi.
// 10/10: gom THEO DẠNG + "Duyệt cả dạng" — lô máy sinh theo mẫu có vài chục câu cùng khuôn mỗi dạng; người duyệt đọc
// vài câu mẫu rồi duyệt cả nhóm, không bấm từng câu. Sau mỗi lần duyệt/từ chối chỉ VÁ đúng câu đó khỏi danh sách
// (CLAUDE.md §2: mutation không reload cả danh sách, không alert() cho thành công).
import { useEffect, useMemo, useState } from 'react'
import { listCloneChoDuyet, duyetCloneChoDuyet, tuChoiCloneChoDuyet, tenDangTheoMa, type CloneChoDuyet } from '../../lib/kho/api'
import { MathText } from './ui'
import { myNhanSuId } from '../../lib/giaoviec'

const XEM_TRUOC = 3 // mỗi dạng mở sẵn mấy câu (bấm "xem cả" để mở hết)

export default function ChoDuyetPanel({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState<CloneChoDuyet[]>([])
  const [tenDang, setTenDang] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [moHet, setMoHet] = useState<Record<string, boolean>>({})
  const [lo, setLo] = useState<{ dang: string; xong: number; tong: number } | null>(null) // đang duyệt cả dạng
  const [bao, setBao] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)

  useEffect(() => {
    let song = true
    ;(async () => {
      try {
        const r = await listCloneChoDuyet()
        if (!song) return
        setRows(r)
        setTenDang(await tenDangTheoMa([...new Set(r.map((x) => x.dang_chinh))]))
      } catch (e: any) { if (song) setLoi(e.message ?? String(e)) } finally { if (song) setLoading(false) }
    })()
    return () => { song = false }
  }, [])
  useEffect(() => { if (!bao) return; const t = setTimeout(() => setBao(null), 2500); return () => clearTimeout(t) }, [bao])

  // nhóm theo dạng, giữ thứ tự xuất hiện (created_at tăng dần)
  const nhom = useMemo(() => {
    const m = new Map<string, CloneChoDuyet[]>()
    for (const r of rows) { if (!m.has(r.dang_chinh)) m.set(r.dang_chinh, []); m.get(r.dang_chinh)!.push(r) }
    return [...m.entries()]
  }, [rows])
  const boKhoiDs = (id: string) => setRows((prev) => prev.filter((x) => x.id !== id))

  async function onDuyet(r: CloneChoDuyet) {
    setBusyId(r.id); setLoi(null)
    try { const ma = await duyetCloneChoDuyet(r, await myNhanSuId()); boKhoiDs(r.id); setBao(`Đã duyệt — vào kho với mã ${ma}`) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusyId(null) }
  }
  async function onTuChoi(r: CloneChoDuyet) {
    const lyDo = prompt('Lý do từ chối (bắt buộc):')
    if (!lyDo?.trim()) return
    setBusyId(r.id); setLoi(null)
    try { await tuChoiCloneChoDuyet(r.id, await myNhanSuId(), lyDo.trim()); boKhoiDs(r.id); setBao('Đã từ chối') }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusyId(null) }
  }
  // Duyệt cả dạng: lần lượt TỪNG câu (mỗi câu cần một mã câu mới — cấp tuần tự để không trùng mã), câu nào xong thì rời danh sách.
  // Lỗi giữa chừng ⇒ dừng, các câu chưa duyệt vẫn nằm nguyên trong danh sách.
  async function onDuyetCaDang(dang: string, ds: CloneChoDuyet[]) {
    if (!confirm(`Duyệt cả ${ds.length} câu của dạng ${dang}${tenDang[dang] ? ` — ${tenDang[dang]}` : ''}?\nCác câu sẽ vào kho ngay (đã duyệt).`)) return
    setLoi(null); setLo({ dang, xong: 0, tong: ds.length })
    try {
      const nguoi = await myNhanSuId()
      for (let i = 0; i < ds.length; i++) { await duyetCloneChoDuyet(ds[i], nguoi); boKhoiDs(ds[i].id); setLo({ dang, xong: i + 1, tong: ds.length }) }
      setBao(`Đã duyệt ${ds.length} câu của dạng ${dang}`)
    } catch (e: any) { setLoi(`Dừng giữa chừng ở dạng ${dang}: ${e.message ?? String(e)}`) } finally { setLo(null) }
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-indigo-600">← Bản đồ kiến thức</button>
        <span className="text-[15px] font-semibold text-slate-800">Câu chờ duyệt</span>
        <span className="text-[12px] text-slate-400">{rows.length} câu · {nhom.length} dạng — câu clone chưa vào kho</span>
        {bao && <span className="ml-auto rounded-md bg-emerald-50 px-3 py-1 text-[13px] font-medium text-emerald-700">✓ {bao}</span>}
      </div>
      {loi && <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-[13px] text-rose-700">{loi}</div>}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Không có câu nào đang chờ duyệt.</p>
          : (
            <div className="space-y-6">
              {nhom.map(([dang, ds]) => {
                const dangChay = lo?.dang === dang, hien = moHet[dang] ? ds : ds.slice(0, XEM_TRUOC)
                return (
                  <section key={dang}>
                    <div className="sticky top-0 z-10 -mx-2 mb-2 flex items-center gap-3 rounded-lg bg-[#fafafb]/95 px-2 py-2 backdrop-blur">
                      <span className="rounded bg-violet-50 px-2 py-0.5 text-[12px] font-medium text-violet-700">{dang}</span>
                      <span className="text-[14px] font-semibold text-slate-700">{tenDang[dang] ?? ''}</span>
                      <span className="text-[12px] text-slate-400">{ds.length} câu chờ</span>
                      <button onClick={() => onDuyetCaDang(dang, ds)} disabled={!!lo || !!busyId}
                        className="ml-auto rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
                        {dangChay ? `⏳ Đang duyệt ${lo!.xong}/${lo!.tong}…` : `✓ Duyệt cả ${ds.length} câu của dạng`}
                      </button>
                    </div>
                    <ul className="space-y-3">
                      {hien.map((r) => (
                        <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-400">
                            {r.parent_ma_cau && <span>clone từ <b className="text-slate-500">{r.parent_ma_cau}</b></span>}
                            <span className="ml-auto">{new Date(r.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Đề bài</div>
                              <MathText>{r.noi_dung}</MathText>
                              {r.lua_chon && (
                                <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
                                  {r.lua_chon.map((o, i) => <li key={i}>{String.fromCharCode(65 + i)}. <MathText>{o}</MathText></li>)}
                                </ul>
                              )}
                              {r.dap_an && <div className="mt-1.5 text-[13px]"><span className="font-medium text-slate-500">Đáp án: </span><MathText>{r.dap_an}</MathText></div>}
                            </div>
                            <div>
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Lời giải</div>
                              {r.loi_giai ? <MathText>{r.loi_giai}</MathText> : <span className="text-[13px] text-slate-300">(không có)</span>}
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                            <button onClick={() => onTuChoi(r)} disabled={busyId === r.id || !!lo}
                              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">✕ Từ chối</button>
                            <button onClick={() => onDuyet(r)} disabled={busyId === r.id || !!lo}
                              className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">{busyId === r.id ? '⏳…' : '✓ Duyệt — đưa vào kho'}</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {ds.length > XEM_TRUOC && (
                      <button onClick={() => setMoHet((p) => ({ ...p, [dang]: !p[dang] }))} className="mt-2 text-[13px] font-medium text-indigo-600 hover:underline">
                        {moHet[dang] ? '▲ Thu gọn' : `▼ Xem cả ${ds.length} câu của dạng này`}
                      </button>
                    )}
                  </section>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}
