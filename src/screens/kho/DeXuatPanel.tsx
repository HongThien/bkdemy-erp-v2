// Panel "Đề xuất của dây chuyền" — làn 🟡 (dạng/cụm mới) và 🔴 (cần trao đổi) của mỗi lô nhập kho
// (spec-luong-kho.md §5.3, mig 202609282236). Đề xuất KHÔNG tự vào bản đồ: người có quyền ghi Bản đồ
// quyết ở đây — Nhận / Gộp vào dạng có sẵn / Bác / Trả lời. Lý do bác + câu trả lời là NGUỒN của luật
// cho lô sau (bánh đà), nên bắt buộc ghi.
//
// Màn hàng đợi ⇒ sau mỗi quyết định VÁ TẠI CHỖ (bỏ đúng thẻ vừa quyết), không quét lại danh sách;
// rời màn quay lại vẫn đúng chỗ cũ (cache module-level `NHO`), nút ↻ ép quét lại.
import { useEffect, useRef, useState } from 'react'
import { listDaiDeXuat, quyetDaiDeXuat, type DeXuat, type DeXuatKetQua } from '../../lib/kho/api'
import DangPickerOne from '../../components/DangPickerOne'
import { MathText } from './ui'

const NHO: { khoi: string | null; rows: DeXuat[]; scrollTop: number } = { khoi: null, rows: [], scrollTop: 0 }

const NHAN_LOAI: Record<DeXuat['loai'], { icon: string; ten: string; cls: string }> = {
  dang_moi: { icon: '🟡', ten: 'Dạng mới', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  cum_moi: { icon: '🟡', ten: 'Cụm mới', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  trao_doi: { icon: '🔴', ten: 'Cần trao đổi', cls: 'bg-rose-50 text-rose-800 border-rose-200' },
}

export default function DeXuatPanel({ khoi, onClose, onDoiBanDo }: { khoi: string; onClose: () => void; onDoiBanDo?: () => void }) {
  const coCache = NHO.khoi === khoi
  const [rows, setRows] = useState<DeXuat[]>(coCache ? NHO.rows : [])
  const [loading, setLoading] = useState(!coCache)
  const [loi, setLoi] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)
  const cuon = useRef<HTMLDivElement>(null)
  const daDoi = useRef(false)

  async function quet() {
    setLoading(true); setLoi(null)
    try { const r = await listDaiDeXuat(khoi); NHO.khoi = khoi; NHO.rows = r; setRows(r) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => {
    if (!coCache) quet()
    else requestAnimationFrame(() => { if (cuon.current) cuon.current.scrollTop = NHO.scrollTop })
  }, [khoi]) // eslint-disable-line

  function daQuyet(id: string, kq: DeXuatKetQua) {
    setRows((prev) => { const r = prev.filter((x) => x.id !== id); NHO.rows = r; return r })
    daDoi.current = true
    const nhan = { nhan: 'Đã nhận', nhan_co_sua: 'Đã nhận (có sửa)', gop: 'Đã gộp', bac: 'Đã bác', tra_loi: 'Đã trả lời' }[kq.hanh_dong]
    const dich = kq.ket_qua_ma_cum ?? kq.ket_qua_ma_dang
    setThongBao(`${nhan}${dich ? ' → ' + dich : ''}${kq.so_cau_doi ? ` · dời ${kq.so_cau_doi} câu` : ''}${kq.so_cau_da_duyet_bo_qua ? ` · ${kq.so_cau_da_duyet_bo_qua} câu đã duyệt giữ nguyên dạng` : ''}`)
    window.setTimeout(() => setThongBao(null), 3500)
  }
  function dong() { if (daDoi.current) onDoiBanDo?.(); onClose() }

  // nhóm theo lô → chuyên đề (chỉ để hiển thị)
  const nhom: { khoa: string; lo: string; cd: string; items: DeXuat[] }[] = []
  for (const r of rows) {
    const khoa = r.lo + '|' + r.ma_chuyen_de
    let g = nhom.find((x) => x.khoa === khoa)
    if (!g) { g = { khoa, lo: r.lo, cd: r.ten_chuyen_de ?? r.ma_chuyen_de, items: [] }; nhom.push(g) }
    g.items.push(r)
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <button onClick={dong} className="text-[14px] text-slate-500 hover:text-indigo-600">← Bản đồ kiến thức</button>
        <span className="text-[15px] font-semibold text-slate-800">Đề xuất của dây chuyền · Khối {khoi}</span>
        <span className="text-[12px] text-slate-400">{rows.length} đề xuất chờ quyết</span>
        {thongBao && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[12.5px] font-medium text-emerald-700">✓ {thongBao}</span>}
        <button onClick={quet} title="Quét lại danh sách" className="ml-auto rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] text-slate-600 hover:border-indigo-300 hover:text-indigo-700">↻</button>
      </div>
      <div ref={cuon} onScroll={(e) => { NHO.scrollTop = (e.target as HTMLDivElement).scrollTop }} className="flex-1 overflow-auto px-6 py-4">
        {loi ? <p className="text-sm text-rose-600">Không tải được: {loi}</p>
          : loading && rows.length === 0 ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-2 text-3xl">✅</div>
              <div className="text-[15px] font-semibold text-slate-800">Không có đề xuất nào đang chờ</div>
              <p className="mt-1.5 text-[13px] text-slate-500">Khi dây chuyền nhập kho gặp câu không khớp dạng nào, hoặc cần hỏi ý học thuật, đề xuất sẽ hiện ở đây.</p>
            </div>
          ) : (
            <div className="mx-auto max-w-5xl space-y-6">
              {nhom.map((g) => (
                <section key={g.khoa}>
                  <div className="mb-2 flex items-baseline gap-2">
                    <h3 className="text-[14px] font-semibold text-slate-800">{g.cd}</h3>
                    <span className="text-[12px] text-slate-400">lô {g.lo} · {g.items.length} đề xuất</span>
                  </div>
                  <ul className="space-y-3">
                    {g.items.map((r) => <TheDeXuat key={r.id} r={r} khoi={khoi} onXong={(kq) => daQuyet(r.id, kq)} />)}
                  </ul>
                </section>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

function TheDeXuat({ r, khoi, onXong }: { r: DeXuat; khoi: string; onXong: (kq: DeXuatKetQua) => void }) {
  const nl = NHAN_LOAI[r.loai]
  const [ten, setTen] = useState(r.ten ?? '')
  const [moTa, setMoTa] = useState(r.mo_ta_ngan ?? '')
  const [traLoi, setTraLoi] = useState('')
  const [dich, setDich] = useState<string | null>(null)      // dạng đích (gộp / chỉ định khi trả lời)
  const [che, setChe] = useState<null | 'bac' | 'gop'>(null)  // đang mở ô nhập cho hành động nào
  const [picker, setPicker] = useState(false)
  const [moCau, setMoCau] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  async function quyet(hd: 'nhan' | 'gop' | 'bac' | 'tra_loi') {
    setBusy(true); setLoi(null)
    try {
      onXong(await quyetDaiDeXuat(r.id, hd, {
        ten: hd === 'nhan' ? ten : null, moTaNgan: hd === 'nhan' ? moTa : null,
        maDangDich: hd === 'gop' || hd === 'tra_loi' ? dich : null,
        traLoi: hd === 'bac' || hd === 'tra_loi' ? traLoi : null,
      }))
    } catch (e: any) { setLoi(e.message ?? String(e)); setBusy(false) }
  }
  const cauHien = moCau ? r.cau : r.cau.slice(0, 2)
  const thieuTen = r.loai !== 'trao_doi' && !ten.trim()
  const thieuMoTa = r.loai === 'dang_moi' && !moTa.trim()

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
        <span className={`rounded-md border px-2 py-0.5 font-semibold ${nl.cls}`}>{nl.icon} {nl.ten}</span>
        {r.loai === 'cum_moi' && r.ten_dang && <span className="text-slate-500">trong dạng <b className="text-slate-700">{r.ten_dang}</b></span>}
        <span className="ml-auto text-slate-400">{r.cau.length} câu làm chứng</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2.5">
          {r.loai !== 'trao_doi' && (
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tên {r.loai === 'dang_moi' ? 'dạng' : 'cụm'} đề xuất</span>
              <input value={ten} onChange={(e) => setTen(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-[14px] text-slate-800 focus:border-indigo-400 focus:outline-none" />
            </label>
          )}
          {r.loai === 'dang_moi' && (
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Dấu hiệu nhận biết</span>
              <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} rows={3}
                className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-[13px] text-slate-700 focus:border-indigo-400 focus:outline-none" />
            </label>
          )}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{r.loai === 'trao_doi' ? 'Câu hỏi của dây chuyền' : 'Vì sao không gộp được'}</div>
            <p className="mt-1 whitespace-pre-wrap text-[13.5px] text-slate-700">{r.ly_do}</p>
          </div>
          {r.ten_dang_gan_nhat && (
            <div className="text-[12.5px] text-slate-500">Dạng gần nhất: <b className="text-slate-700">{r.ten_dang_gan_nhat}</b> <span className="font-mono text-[11px] text-slate-400">{r.dang_gan_nhat}</span></div>
          )}
        </div>

        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Câu làm chứng</div>
          <ul className="space-y-2">
            {cauHien.map((c) => (
              <li key={c.ma_cau} className="rounded-lg bg-slate-50 p-2.5 text-[13px] text-slate-700">
                <div className="mb-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono">{c.ma_cau}</span>
                  {c.da_duyet && <span className="rounded bg-emerald-50 px-1.5 text-emerald-700" title="Câu đã duyệt giữ nguyên dạng, không tự dời">đã duyệt</span>}
                </div>
                <MathText>{c.noi_dung}</MathText>
              </li>
            ))}
          </ul>
          {r.cau.length > 2 && (
            <button onClick={() => setMoCau((v) => !v)} className="mt-1.5 text-[12.5px] font-medium text-indigo-600 hover:underline">
              {moCau ? 'Thu gọn' : `Xem cả ${r.cau.length} câu`}
            </button>
          )}
        </div>
      </div>

      {/* Ô nhập theo hành động */}
      {(r.loai === 'trao_doi' || che === 'bac') && (
        <label className="mt-3 block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{r.loai === 'trao_doi' ? 'Trả lời (sẽ thành luật cho lô sau)' : 'Lý do bác (sẽ thành luật cho lô sau)'}</span>
          <textarea value={traLoi} onChange={(e) => setTraLoi(e.target.value)} rows={2} autoFocus={che === 'bac'}
            className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-[13.5px] text-slate-800 focus:border-indigo-400 focus:outline-none" />
        </label>
      )}
      {(r.loai === 'trao_doi' || che === 'gop') && (
        <div className="mt-2 flex items-center gap-2 text-[13px]">
          <span className="text-slate-500">{r.loai === 'trao_doi' ? 'Dời câu về dạng (không bắt buộc):' : 'Gộp vào dạng:'}</span>
          <button onClick={() => setPicker(true)} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:border-indigo-300">
            {dich ?? 'Chọn dạng…'}
          </button>
          {che === 'gop' && r.dang_gan_nhat && dich !== r.dang_gan_nhat && (
            <button onClick={() => setDich(r.dang_gan_nhat)} className="text-[12.5px] text-indigo-600 hover:underline">dùng dạng gần nhất</button>
          )}
          {dich && <button onClick={() => setDich(null)} className="text-[12.5px] text-slate-400 hover:text-rose-600">bỏ chọn</button>}
        </div>
      )}
      {loi && <p className="mt-2 text-[13px] text-rose-600">{loi}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        {r.loai === 'trao_doi' ? (
          <button disabled={busy || !traLoi.trim()} onClick={() => quyet('tra_loi')}
            className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">Gửi trả lời</button>
        ) : che === 'bac' ? (<>
          <button disabled={busy || !traLoi.trim()} onClick={() => quyet('bac')}
            className="rounded-md bg-rose-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-rose-700 disabled:opacity-40">Xác nhận bác</button>
          <button disabled={busy} onClick={() => setChe(null)} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
        </>) : che === 'gop' ? (<>
          <button disabled={busy || !dich} onClick={() => quyet('gop')}
            className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">Xác nhận gộp</button>
          <button disabled={busy} onClick={() => { setChe(null); setDich(null) }} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
        </>) : (<>
          <button disabled={busy || thieuTen || thieuMoTa} onClick={() => quyet('nhan')}
            title={thieuTen || thieuMoTa ? 'Cần đủ tên và dấu hiệu nhận biết' : 'Tạo vào bản đồ và dời câu làm chứng sang'}
            className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-40">
            Nhận{ten !== (r.ten ?? '') || moTa !== (r.mo_ta_ngan ?? '') ? ' (đã sửa)' : ''}
          </button>
          {r.loai === 'dang_moi' && (
            <button disabled={busy} onClick={() => { setChe('gop'); setDich(r.dang_gan_nhat) }}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:border-indigo-300">Gộp vào dạng có sẵn…</button>
          )}
          <button disabled={busy} onClick={() => setChe('bac')}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-rose-300 hover:text-rose-700">Bác…</button>
        </>)}
        {busy && <span className="text-[12.5px] text-slate-400">Đang ghi…</span>}
      </div>

      {picker && <DangPickerOne khoi={khoi} onClose={() => setPicker(false)} onPick={(ma) => { setDich(ma); setPicker(false) }} />}
    </li>
  )
}
