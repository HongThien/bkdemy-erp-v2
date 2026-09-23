// PHIẾU GIẤY BỔ TRỢ YẾU — phía TRỢ GIẢNG (Thùy 22/09: app TA không mượn màn ERP desktop, y hệt luật
// đã áp cho Đuổi — xem DuoiGiayTA.tsx:7). TrangIn + NhapKetQua chuyển từ TheoDoiCaBoTroTab.tsx (ERP)
// sang đây nguyên vẹn, không đổi logic — ERP giờ import ngược lại từ file này.
import { useMemo, useState } from 'react'
import { MathText } from '../kho/ui'
import { giayNhapKetQua, nopTestGiay, type BaiInGiay } from '../../lib/botro_yeu_ca'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

const CHU = ['A', 'B', 'C', 'D', 'E', 'F']
const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')

// ── TRANG IN — overlay trắng + CSS @media print chỉ hiện .bk-print. Trang 1..n = đề cho em; trang cuối (ngắt trang) = đáp án cho TA. ──
export function TrangIn({ bai, onDong }: { bai: BaiInGiay; onDong: () => void }) {
  const theoDang = useMemo(() => {
    const g = new Map<string, BaiInGiay['caus']>()
    for (const k of bai.caus) g.set(k.ten_dang, [...(g.get(k.ten_dang) ?? []), k])
    return [...g.entries()]
  }, [bai])
  return (
    <div className="bk-print fixed inset-0 z-[100] overflow-auto bg-white">
      <style>{`@media print { body * { visibility: hidden !important; } .bk-print, .bk-print * { visibility: visible !important; } .bk-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; overflow: visible !important; } .bk-no-print { display: none !important; } .bk-page-break { break-before: page; } .bk-cau { break-inside: avoid; } }`}</style>
      <div className="bk-no-print sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-2">
        <span className="text-[13px] font-semibold text-slate-700">Xem trước bản in — {bai.hs.ho_ten} · {bai.caus.length} câu</span>
        <button onClick={() => window.print()} className="ml-auto rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">🖨 In</button>
        <button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
      </div>
      <div className="mx-auto max-w-[800px] px-8 py-6 text-[14px] leading-relaxed text-slate-900">
        <div className="mb-4 border-b-2 border-slate-800 pb-2">
          <div className="flex items-baseline justify-between">
            <h1 className="text-[18px] font-bold">BK ACADEMY — {bai.loai === 'bo_tro_test' ? 'BÀI KIỂM TRA CUỐI BUỔI BỔ TRỢ' : 'PHIẾU LUYỆN BỔ TRỢ'} · {bai.mon}</h1>
            <span className="text-[12px]">{thuCuaNgay(bai.ngay)} {ddmmVN(bai.ngay)}{bai.gio_bat_dau ? ` · ${hhmm(bai.gio_bat_dau)}` : ''}{bai.phong ? ` · ${bai.phong}` : ''}</span>
          </div>
          <div className="mt-1 flex justify-between text-[13px]">
            <span>Họ tên: <b>{bai.hs.ho_ten}</b> ({bai.hs.ma_hs}) · Khối {bai.hs.khoi}</span>
            <span>Thầy/cô: {bai.nguoi_ten ?? '…………'}</span>
          </div>
          <p className="mt-1 text-[12px] italic">Khoanh tròn 1 đáp án đúng cho mỗi câu. Làm nháp ra mặt sau.{bai.loai === 'bo_tro_test' ? ' Bài kiểm tra — em tự làm, không hỏi thầy cô.' : ''}</p>
        </div>
        {theoDang.map(([ten, caus]) => (
          <div key={ten} className="mb-4">
            <h2 className="mb-2 rounded bg-slate-100 px-2 py-1 text-[13.5px] font-bold">Dạng: {ten}</h2>
            {caus.map((k) => (
              <div key={k.id} className="bk-cau mb-3">
                <div><b>Câu {k.thu_tu}.</b> <MathText>{k.noi_dung}</MathText></div>
                {k.anh_de && <img src={k.anh_de} alt="" className="my-1 max-h-[220px]" />}
                <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 pl-4">
                  {(k.lua_chon ?? []).map((lc, i) => <div key={i}><b>{CHU[i]}.</b> <MathText>{lc}</MathText></div>)}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="bk-page-break pt-4">
          <h2 className="mb-2 border-b border-slate-400 pb-1 text-[15px] font-bold">ĐÁP ÁN (dành cho thầy cô) — {bai.hs.ho_ten} · {ddmmVN(bai.ngay)}</h2>
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">{bai.caus.map((k) => <span key={k.id}>{k.thu_tu}. <b>{String(k.dap_an_key ?? '?')}</b></span>)}</div>
          {bai.caus.filter((k) => k.loi_giai).map((k) => (
            <div key={k.id} className="bk-cau mb-2 text-[12.5px]"><b>Câu {k.thu_tu} ({String(k.dap_an_key ?? '?')}):</b> <MathText>{k.loi_giai}</MathText></div>
          ))}
          <p className="mt-3 text-[11.5px] italic text-slate-600">Chấm xong: ERP → Xếp bổ trợ yếu → Đang diễn ra → "Nhập KQ" của phiếu này, bấm lại đáp án em đã khoanh — máy tự chấm và tính vào tiến độ ca.</p>
        </div>
      </div>
    </div>
  )
}

// ── NHẬP KẾT QUẢ BÀI GIẤY — bấm đáp án em KHOANH; máy chấm theo key; vá tại chỗ. Bấm lại đúng ô đang chọn = xoá (nhập nhầm). ──
export function NhapKetQua({ bai, onDong }: { bai: BaiInGiay; onDong: () => void }) {
  const laTest = bai.loai === 'bo_tro_test'
  const [daNop, setDaNop] = useState(bai.da_nop)
  const [hoiNop, setHoiNop] = useState(false)
  const [kqNop, setKqNop] = useState<string | null>(null)
  const [caus, setCaus] = useState(bai.caus)
  const [busy, setBusy] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  async function chon(id: string, i: number | null) {
    setBusy(id); setLoi(null)
    try { const r = await giayNhapKetQua(id, i); setCaus((prev) => prev.map((k) => k.id === id ? { ...k, chon: r.chon, verdict: r.verdict } : k)) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  const daNhap = caus.filter((k) => k.verdict).length, dung = caus.filter((k) => k.verdict === 'correct').length
  async function nop() {
    setBusy('nop'); setLoi(null)
    try { const r = await nopTestGiay(bai.bai_test_id); setDaNop(true); setHoiNop(false); setKqNop(`Đã nộp: đúng ${r.so_dung}/${r.so_cau}${r.bo_trong ? ` · ${r.bo_trong} câu bỏ trống tính sai` : ''}.`) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div className="max-h-[88vh] w-[720px] max-w-full overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">{laTest ? 'Nhập kết quả BÀI KIỂM TRA giấy' : 'Nhập kết quả phiếu luyện'} — {bai.hs.ho_ten}{daNop ? ' · ĐÃ NỘP' : ''}</h3>
            <p className="text-[12px] text-slate-500">Bấm đúng đáp án EM ĐÃ KHOANH (không phải đáp án đúng) — máy tự chấm. Đã nhập {daNhap}/{caus.length} · đúng {dung}.</p>
          </div>
          <button onClick={onDong} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {loi && <p className="mb-2 text-[12px] text-rose-600">{loi}</p>}
        <div className="space-y-2">
          {caus.map((k) => (
            <div key={k.id} className={`rounded-xl px-3 py-2 ring-1 ${k.verdict === 'correct' ? 'bg-emerald-50/50 ring-emerald-200' : k.verdict ? 'bg-rose-50/50 ring-rose-200' : 'ring-slate-200'}`}>
              <div className="text-[12.5px] text-slate-700"><b>Câu {k.thu_tu}.</b> <span className="text-slate-500"><MathText>{(k.noi_dung ?? '').slice(0, 140)}</MathText></span></div>
              <div className="mt-1.5 flex items-center gap-1.5">
                {(k.lua_chon ?? []).map((_, i) => {
                  const dangChon = k.chon === i
                  return <button key={i} disabled={busy === k.id || daNop} onClick={() => chon(k.id, dangChon ? null : i)}
                    className={`h-8 w-11 rounded-lg text-[13px] font-bold ${dangChon ? (k.verdict === 'correct' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'border border-slate-300 bg-white text-slate-600 hover:border-indigo-300'}`}>{CHU[i]}</button>
                })}
                <span className="ml-2 text-[12px] text-slate-400">{k.verdict ? (k.verdict === 'correct' ? '✓ đúng' : `✗ sai (đáp án ${String(k.dap_an_key)})`) : 'chưa nhập / em bỏ trống'}</span>
              </div>
            </div>
          ))}
        </div>
        {kqNop && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] font-medium text-emerald-700">✓ {kqNop}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          {laTest && !daNop && (hoiNop ? (
            <span className="mr-auto flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="text-slate-600">Nộp bài kiểm tra?{daNhap < caus.length ? ` ${caus.length - daNhap} câu chưa nhập sẽ tính là em BỎ TRỐNG (sai).` : ''} Nộp rồi không sửa được.</span>
              <button disabled={busy === 'nop'} onClick={nop} className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">{busy === 'nop' ? 'Đang nộp…' : 'Nộp'}</button>
              <button onClick={() => setHoiNop(false)} className="rounded-lg px-2 py-1.5 text-slate-500">Thôi</button>
            </span>
          ) : <button onClick={() => setHoiNop(true)} className="mr-auto rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-bold text-white hover:bg-emerald-700">✓ Nộp bài kiểm tra</button>)}
          <button onClick={onDong} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">{laTest && !daNop ? 'Để sau' : 'Xong'}</button>
        </div>
      </div>
    </div>
  )
}
