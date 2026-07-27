// Màn "Ôn tập + xem trước BTVN" (Thùy 07-22, nắn UX): tách hẳn khỏi TrichPanel — gán buổi giờ CHỈ tạo GT,
// BTVN (kèm khối ôn tập) hoãn tới màn NÀY, xem trước rồi mới bấm Xác nhận mới CHÍNH THỨC tạo vào Kho.
// Không có gì ghi DB cho tới lúc Xác nhận — Huỷ = không có BTVN nào ra đời, mở lại bất cứ lúc nào sau đó
// (trạng thái "đã GT, chưa BTVN" tự derive từ listTrichXuat, không cần nhớ ý định ở đâu khác).
import { useEffect, useState } from 'react'
import { trichXuatBuoi, renumberBuoiLop, khoCuaMon, DEFAULT_BTVN_LINES, type PhanResolved } from '../../lib/tailieu'
import { type CauHoi } from '../../lib/kho/api'
import { saveOnTapConfig, appendOnTapToBtvnDoc, fetchCausByMa, fetchTenDangByMa, type OnTapConfig } from '../../lib/ontap'
import { useStore } from '../../store/useStore'
import OnTapEditor from '../../components/OnTapEditor'
import { CauItem, CauList, CHROME_CSS } from './PrintView'

export default function OnTapConfirmScreen({ masterId, buoiId, tenBuoi, lopId, tenLop, ngay, khoi, mon, regularBtvn, onClose, onConfirmed }: {
  masterId: string; buoiId: string; tenBuoi: string; lopId: string; tenLop: string; ngay: string; khoi: string; mon: string
  regularBtvn: PhanResolved[] // dạng+câu BTVN "thường" của buổi — lấy thẳng từ master (buoi.btvnByMa), không cần fetch
  onClose: () => void
  onConfirmed: () => void
}) {
  const [config, setConfig] = useState<OnTapConfig | null>(null)
  const [gv, setGv] = useState(false)
  const [busy, setBusy] = useState(false)
  const [ontapPreview, setOntapPreview] = useState<{ ten_dang: string; caus: CauHoi[]; linesByCau: Record<string, number> }[]>([])
  const cauTbl = khoCuaMon(mon).cauTbl

  // Preview khối ôn tập — resolve NỘI DUNG câu + tên dạng từ config (đang sống ở state, chưa lưu DB) để
  // vẽ y hệt cái sẽ ra khi Xác nhận. OnTapEditor tự giữ cache riêng của nó, không expose ra ngoài nên
  // resolve lại 1 lần nữa ở đây (query rẻ, khỏi phải nới API của component dùng chung).
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!config || config.skipped || !config.dangs.length) { setOntapPreview([]); return }
      const [tenMap, ...causLists] = await Promise.all([
        fetchTenDangByMa(config.dangs.map((d) => d.ma_dang), mon),
        ...config.dangs.map((d) => fetchCausByMa(d.ma_caus, cauTbl)),
      ])
      if (!alive) return
      setOntapPreview(config.dangs.map((d, i) => ({ ten_dang: tenMap.get(d.ma_dang) ?? d.ma_dang, caus: causLists[i], linesByCau: d.linesByCau ?? {} })))
    })()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, cauTbl, mon])

  async function xacNhan() {
    if (!config) return
    setBusy(true)
    try {
      // Thứ tự spec §5: lưu config TRƯỚC rồi mới tạo doc, để appendOnTapToBtvnDoc đọc được ngay.
      await saveOnTapConfig(masterId, buoiId, lopId, config)
      const created = await trichXuatBuoi(masterId, buoiId, { lopId, ngay, khoi, tenLop, tenBuoi, giaoTrinh: false, btvn: true })
      const btvnDoc = created.find((d) => d.loai === 'btvn')
      if (btvnDoc) {
        useStore.getState().enqueueLinkGen(btvnDoc.id, btvnDoc.loai)
        const { matChet } = await appendOnTapToBtvnDoc(btvnDoc.id, masterId, buoiId, lopId, mon)
        if (matChet.length) alert(`${matChet.length} câu ôn tập không còn trong kho (đã xoá/đổi mã) — mở ✎ Ôn tập ở Kho tài liệu để thay câu khác.`)
      }
      // Số buổi là số CỦA LỚP → chốt lại cả lớp; doc nào đổi tiêu đề/tên thì làm mới link PDF.
      for (const d of await renumberBuoiLop(lopId)) useStore.getState().enqueueLinkGen(d.id, d.loai)
      onConfirmed()
    } finally { setBusy(false) }
  }

  let bno = 0
  const regularShown = regularBtvn.filter((b) => b.caus.length)

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
        <div>
          <p className="text-[15px] font-semibold text-slate-900">BTVN + Ôn tập · {tenLop} · {tenBuoi}</p>
          <p className="text-[12px] text-slate-400">Chọn ôn tập, soi trước — bấm Xác nhận mới chính thức tạo BTVN vào Kho.</p>
        </div>
        <button onClick={onClose} disabled={busy} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 overflow-hidden">
        <div className="min-h-0 overflow-auto border-r border-slate-200 bg-[#fafafb] p-5">
          <OnTapEditor nguonId={masterId} buoiId={buoiId} lopId={lopId} khoi={khoi} mon={mon} config={config} onChange={setConfig} />
        </div>
        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Xem trước phiếu BTVN</span>
            <span className="ml-auto flex gap-0.5 rounded-md bg-slate-100 p-0.5">
              <button onClick={() => setGv(false)} className={`rounded px-2 py-0.5 text-[11px] font-medium ${!gv ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Bản học sinh</button>
              <button onClick={() => setGv(true)} className={`rounded px-2 py-0.5 text-[11px] font-medium ${gv ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Bản GV</button>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-5">
            <style>{CHROME_CSS}</style>
            <div className="mx-auto max-w-[640px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pv-bt-head">
                <div className="pv-bt-titlewrap"><div className="pv-bt-title">{tenBuoi}{gv ? ' · Đáp án' : ''}</div></div>
              </div>
              {regularShown.length === 0 && ontapPreview.length === 0 && <p className="text-center text-[13px] italic text-slate-400">Buổi này chưa có câu BTVN nào ở giáo trình.</p>}
              {regularShown.map((b) => (
                <div key={b.id} className="pv-sec">
                  <h2 className="pv-h-dang">Dạng {b.ref_ma}: {b.dang?.ten_dang ?? b.ref_ma}</h2>
                  <CauList kieu={b.kieu}>{b.caus.map((c) => { bno += 1; return <CauItem key={c.ma_cau} no={bno} c={c} gv={gv} lines={gv ? 0 : DEFAULT_BTVN_LINES} /> })}</CauList>
                </div>
              ))}
              {ontapPreview.length > 0 && (
                <div className="pv-sec pv-ontap">
                  <h2 className="pv-h-ontap">PHẦN ÔN TẬP</h2>
                  {ontapPreview.map((d, i) => (
                    <div key={i} className="pv-sec">
                      <h2 className="pv-h-dang">{d.ten_dang}</h2>
                      <CauList>{d.caus.map((c) => { bno += 1; return <CauItem key={c.ma_cau} no={bno} c={c} gv={gv} lines={gv ? 0 : (d.linesByCau[c.ma_cau] ?? DEFAULT_BTVN_LINES)} /> })}</CauList>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
        <button onClick={onClose} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 disabled:opacity-40">Huỷ</button>
        <button onClick={xacNhan} disabled={busy || !config} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-500 disabled:opacity-40">{busy ? 'Đang tạo…' : '✓ Xác nhận · Tạo BTVN'}</button>
      </div>
    </div>
  )
}
