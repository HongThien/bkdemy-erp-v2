// BTVN + ÔN TẬP cho 1 buổi đã gán lớp — giáo trình BẢN ĐỒ MỚI (riêng, không dùng OnTapConfirmScreen/ontap.ts cũ).
// Giống nhịp cũ: gán buổi chỉ tạo giáo trình buổi; phiếu BTVN làm ở bước này, xem trước rồi Xác nhận mới tạo.
// Ôn tập v1: GV chọn tối đa CAP_NHOM_ON_TAP nhóm đã học ở buổi trước; máy gợi ý SO_CAU_ON_TAP câu/nhóm (né mọi câu
// của buổi). Chưa xếp theo mastery — mastery còn đo theo nhóm cũ (spec-builder-ban-do-moi.md B6 bước 4).
import { useEffect, useState } from 'react'
import { noiDung, goiY, onTapUngVien, trichBuoiBdm, cauCuaBuoi, loiDoc, CAP_NHOM_ON_TAP, SO_CAU_ON_TAP, type NdBuoi, type UngVienOnTap } from '../../../lib/tailieuBdm'
import { fetchCausCuaTaiLieu, renumberBuoiLop, DEFAULT_BTVN_LINES, type TaiLieuNhanhCtx } from '../../../lib/tailieu'
import type { CauHoi } from '../../../lib/kho/api'
import { useStore } from '../../../store/useStore'
import { cauItemParts, CauFlow, CHROME_CSS } from '../PrintView'

export default function BtvnOnTapBdm({ tl, masterId, buoiId, tenBuoi, lopId, tenLop, ngay, khoi, onClose, onDone }: {
  tl: TaiLieuNhanhCtx; masterId: string; buoiId: string; tenBuoi: string; lopId: string; tenLop: string; ngay: string; khoi: string
  onClose: () => void; onDone: () => void
}) {
  const [buoi, setBuoi] = useState<NdBuoi | null>(null)
  const [ungVien, setUngVien] = useState<UngVienOnTap[]>([])
  const [chon, setChon] = useState<{ nhom: string; ten: string | null; caus: string[] }[]>([])
  const [cauMap, setCauMap] = useState<Map<string, CauHoi>>(new Map())
  const [gv, setGv] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  async function napCau(ms: string[]) {
    const can = ms.filter((m) => !cauMap.has(m))
    if (!can.length) return
    const rows = await fetchCausCuaTaiLieu(tl, can)
    setCauMap((m) => { const x = new Map(m); rows.forEach((c) => x.set(c.ma_cau, c)); return x })
  }
  useEffect(() => {
    (async () => {
      try {
        const [nd, uv] = await Promise.all([noiDung(masterId, buoiId), onTapUngVien(masterId, buoiId)])
        const b = nd.buoi[0] ?? null
        setBuoi(b); setUngVien(uv)
        if (b) await napCau(b.nhom.flatMap((n) => n.btvn?.caus ?? []))
      } catch (e) { setLoi(loiDoc(e)) }
    })()
  }, [masterId, buoiId]) // eslint-disable-line

  // Câu né khi gợi ý ôn tập: mọi câu của buổi (luyện + BTVN) + câu ôn tập của nhóm khác đã chọn.
  const tru = (khac: string | null) => [...(buoi ? cauCuaBuoi(buoi) : []), ...chon.filter((c) => c.nhom !== khac).flatMap((c) => c.caus)]
  async function batNhom(u: UngVienOnTap) {
    setLoi(null)
    if (chon.some((c) => c.nhom === u.nhom)) { setChon((s) => s.filter((c) => c.nhom !== u.nhom)); return }
    if (chon.length >= CAP_NHOM_ON_TAP) { setLoi(`Tối đa ${CAP_NHOM_ON_TAP} nhóm ôn tập mỗi phiếu.`); return }
    try {
      const ds = await goiYOnTap(u.nhom)
      setChon((s) => [...s, { nhom: u.nhom, ten: u.ten, caus: ds }])
    } catch (e) { setLoi(loiDoc(e)) }
  }
  async function goiYOnTap(nhom: string) {
    const ds = await goiY(nhom, null, { _tong: SO_CAU_ON_TAP }, tru(nhom))
    await napCau(ds)
    return ds
  }
  async function doiCau(nhom: string) {
    setLoi(null)
    try {
      const cu = chon.find((c) => c.nhom === nhom)?.caus ?? []
      const ds = await goiY(nhom, null, { _tong: SO_CAU_ON_TAP }, [...tru(nhom), ...cu])
      await napCau(ds)
      setChon((s) => s.map((c) => c.nhom === nhom ? { ...c, caus: ds.length ? ds : c.caus } : c))
      if (!ds.length) setLoi('Nhóm này hết câu khác để đổi.')
    } catch (e) { setLoi(loiDoc(e)) }
  }
  async function xacNhan() {
    setBusy(true); setLoi(null)
    try {
      const doc = await trichBuoiBdm(masterId, buoiId, { lopId, ngay, khoi, tenLop, tenBuoi, loai: 'btvn', onTap: chon.map((c) => ({ nhom: c.nhom, caus: c.caus })) })
      useStore.getState().enqueueLinkGen(doc.id, doc.loai)
      for (const d of await renumberBuoiLop(lopId)) useStore.getState().enqueueLinkGen(d.id, d.loai)
      onDone()
    } catch (e) { setLoi(loiDoc(e)) } finally { setBusy(false) }
  }

  let bno = 0
  const item = (m: string) => {
    const c = cauMap.get(m)
    if (!c) return null
    bno += 1
    return { key: m, cols: 1, ...cauItemParts({ no: bno, c, gv, lines: gv ? 0 : DEFAULT_BTVN_LINES }) }
  }
  const nhomBtvn = (buoi?.nhom ?? []).filter((n) => n.btvn?.caus.length)

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
        <div>
          <p className="text-[15px] font-semibold text-slate-900">BTVN + Ôn tập · {tenLop} · {tenBuoi}</p>
          <p className="text-[12px] text-slate-400">Chọn nhóm ôn tập, soi trước — bấm Xác nhận mới tạo phiếu BTVN của lớp.</p>
        </div>
        <button onClick={onClose} disabled={busy} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 overflow-hidden">
        <div className="min-h-0 overflow-auto border-r border-slate-200 bg-[#fafafb] p-5">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Ôn tập · chọn tối đa {CAP_NHOM_ON_TAP} nhóm đã học ở buổi trước</div>
          <p className="mb-3 text-[12px] text-slate-400">Chưa xếp theo mức nắm của lớp (bản đồ mới chưa có số đo theo nhóm) — GV tự chọn. Không chọn = phiếu không có ôn tập.</p>
          {ungVien.length === 0
            ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Không có nhóm nào ở các buổi trước (hoặc đều đã học lại ở buổi này).</div>
            : <div className="space-y-1.5">
              {ungVien.map((u) => {
                const c = chon.find((x) => x.nhom === u.nhom)
                return (
                  <div key={u.nhom} className={`rounded-lg border bg-white px-3 py-2 ${c ? 'border-violet-300 ring-1 ring-violet-200' : 'border-slate-200'}`}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={!!c} onChange={() => batNhom(u)} />
                      <span className="min-w-0 flex-1 text-[13px] font-medium text-slate-800">{u.ten ?? u.nhom}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{u.buoi}</span>
                    </label>
                    {c && (
                      <div className="mt-1.5 flex items-center gap-2 pl-6 text-[11.5px] text-slate-500">
                        <span>{c.caus.length} câu: {c.caus.join(', ')}</span>
                        <button onClick={() => doiCau(u.nhom)} className="ml-auto rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-indigo-600 hover:border-indigo-300">↻ Đổi câu</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>}
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
              <div className="pv-bt-head"><div className="pv-bt-titlewrap"><div className="pv-bt-title">{tenBuoi}{gv ? ' · Đáp án' : ''}</div></div></div>
              {!buoi ? <p className="text-center text-[13px] text-slate-400">Đang tải…</p>
                : nhomBtvn.length === 0 && chon.length === 0 ? <p className="text-center text-[13px] italic text-slate-400">Buổi này chưa có câu BTVN nào ở giáo trình.</p>
                : null}
              {nhomBtvn.map((n) => (
                <div key={n.phan_id} className="pv-sec">
                  <h2 className="pv-h-dang">Nhóm {n.stt}: {n.ten ?? ''}</h2>
                  <CauFlow items={n.btvn!.caus.map(item).filter(Boolean) as Parameters<typeof CauFlow>[0]['items']} />
                </div>
              ))}
              {chon.length > 0 && (
                <div className="pv-sec pv-ontap">
                  <h2 className="pv-h-ontap">PHẦN ÔN TẬP</h2>
                  {chon.map((c) => (
                    <div key={c.nhom} className="pv-sec">
                      <h2 className="pv-h-dang">{c.ten ?? c.nhom}</h2>
                      <CauFlow items={c.caus.map(item).filter(Boolean) as Parameters<typeof CauFlow>[0]['items']} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
        {loi && <span className="mr-auto text-[12.5px] text-rose-600">⚠ {loi}</span>}
        <button onClick={onClose} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 disabled:opacity-40">Huỷ</button>
        <button onClick={xacNhan} disabled={busy || !buoi} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-500 disabled:opacity-40">{busy ? 'Đang tạo…' : '✓ Xác nhận · Tạo BTVN'}</button>
      </div>
    </div>
  )
}
