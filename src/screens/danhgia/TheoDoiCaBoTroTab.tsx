// Tab "Đang diễn ra" của màn Xếp bổ trợ yếu (Thùy 21/09): bảng theo dõi MỌI ca bổ trợ yếu trong ngày để OPS xử lý nhanh — ai chưa điểm
// danh, ai đang luyện / im lâu, ca nào đã đóng chờ test, ca nào xong — + IN TÀI LIỆU khi thiếu iPad.
// ⭐ In = ĐÚNG logic đưa câu của app (RPC fn_btyeu_in_sinh dùng chung _btyeu_chon_cau/_kho_snapshot_cau, MCQ tuyệt đối, né câu đã gặp
//   trong ca) — bài in là 1 `bai_test.loai='bo_tro'` có `in_giay_at`, nên tiến độ luyện / test cuối ca thấy nó y như bài app.
// ⭐ Kết quả bài giấy: nhân sự bấm lại đáp án EM KHOANH (A–D), MÁY chấm theo key (fn_btyeu_giay_nhap) — không tự phán đúng/sai.
// Số liệu tổng hợp ở DB (fn_btyeu_ca_theo_doi — §2.0); ở đây chỉ render + đếm item đang hiện cho chip tóm tắt.
import { useEffect, useMemo, useRef, useState } from 'react'
import { MathText } from '../kho/ui'
import { caTheoDoi, inSinhBaiGiay, inLayBaiGiay, giayNhapKetQua, type CaTheoDoi, type BaiInGiay } from '../../lib/botro_yeu_ca'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'

const POLL_MS = 15000
const CHU = ['A', 'B', 'C', 'D', 'E', 'F']
const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
type TrangThai = 'chua_dd' | 'vang' | 'dang_luyen' | 'im' | 'cho_test' | 'cho_nhan_xet' | 'xong'
const TT: Record<TrangThai, { ten: string; cls: string }> = {
  chua_dd: { ten: 'Chưa điểm danh', cls: 'bg-slate-100 text-slate-600' },
  vang: { ten: 'Vắng', cls: 'bg-rose-50 text-rose-700' },
  dang_luyen: { ten: 'Đang luyện', cls: 'bg-indigo-50 text-indigo-700' },
  im: { ten: 'Im lâu', cls: 'bg-amber-100 text-amber-800' },
  cho_test: { ten: 'Đã đóng · chờ em làm test', cls: 'bg-violet-50 text-violet-700' },
  cho_nhan_xet: { ten: 'Test xong · chờ nhận xét', cls: 'bg-sky-50 text-sky-700' },
  xong: { ten: 'Hoàn tất', cls: 'bg-emerald-50 text-emerald-700' },
}
function trangThai(c: CaTheoDoi, now: number): TrangThai {
  if (c.danh_gia_xong_at || c.trang_thai === 'hoan_tat') return 'xong'
  if (c.diem_danh === 'vang' || c.diem_danh === 'vang_phep') return 'vang'
  if (c.diem_danh !== 'co_mat') return 'chua_dd'
  if (c.da_dong) return c.test_da_nop ? 'cho_nhan_xet' : 'cho_test'
  const im = c.cau_cuoi_at ? (now - Date.parse(c.cau_cuoi_at)) / 60000 : null
  return im != null && im >= 5 ? 'im' : 'dang_luyen'
}

export default function TheoDoiCaBoTroTab({ monF, khoiF }: { monF: string; khoiF: string }) {
  const [ngay, setNgay] = useState(homNayVN())
  const [rows, setRows] = useState<CaTheoDoi[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())
  const [soCau, setSoCau] = useState(5)
  const [busy, setBusy] = useState<string | null>(null)
  const [inBai, setInBai] = useState<BaiInGiay | null>(null)     // đang mở trang in
  const [nhapBai, setNhapBai] = useState<BaiInGiay | null>(null) // đang nhập kết quả giấy
  const [thongBao, setThongBao] = useState<string | null>(null)
  const ngayRef = useRef(ngay); ngayRef.current = ngay

  // Nạp NỀN: giữ rows cũ tới khi có rows mới (không blank khi poll) — CLAUDE.md §2 React.
  const tai = () => caTheoDoi(ngayRef.current).then((r) => { setRows(r); setLoi(null) }).catch((e: any) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false))
  useEffect(() => { setLoading(true); setRows([]); tai() }, [ngay]) // đổi ngày = đổi ngữ cảnh ⇒ reset là đúng
  useEffect(() => { const id = setInterval(() => { if (document.visibilityState === 'visible') { tai(); setNow(Date.now()) } }, POLL_MS); return () => clearInterval(id) }, [])

  const hien = useMemo(() => rows.filter((c) => (!monF || c.mon === monF) && (!khoiF || c.khoi === khoiF)), [rows, monF, khoiF])
  const dem = useMemo(() => { const m: Record<string, number> = {}; for (const c of hien) { const t = trangThai(c, now); m[t] = (m[t] ?? 0) + 1 } return m }, [hien, now])
  const nhom = useMemo(() => {
    const g = new Map<string, CaTheoDoi[]>()
    for (const c of hien) { const k = hhmm(c.gio_bat_dau) || '—'; g.set(k, [...(g.get(k) ?? []), c]) }
    return [...g.entries()]
  }, [hien])

  async function inMoi(c: CaTheoDoi) {
    setBusy(c.buoi_id); setLoi(null); setThongBao(null)
    try {
      const r = await inSinhBaiGiay(c.buoi_id, soCau)
      if (r.dang_khong_co_cau.length) setThongBao(`${c.ho_ten}: ${r.dang_khong_co_cau.length} dạng chưa có câu trắc nghiệm nên không in được (${r.dang_khong_co_cau.join(', ')}).`)
      setInBai(await inLayBaiGiay(r.bai_test_id))
      tai()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  async function moBai(id: string, che: 'in' | 'nhap') {
    setBusy(id); setLoi(null)
    try { const b = await inLayBaiGiay(id); if (che === 'in') setInBai(b); else setNhapBai(b) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <input type="date" value={ngay} onChange={(e) => e.target.value && setNgay(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
        <span className="text-[13px] font-semibold text-slate-700">{thuCuaNgay(ngay)} {ddmmVN(ngay)}{ngay === homNayVN() ? ' · hôm nay' : ''} — {hien.length} ca</span>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(TT) as TrangThai[]).filter((k) => dem[k]).map((k) => <span key={k} className={`rounded-full px-2 py-0.5 text-[11.5px] font-bold ${TT[k].cls}`}>{TT[k].ten}: {dem[k]}</span>)}
        </div>
        <label className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-500">In mỗi dạng
          <select value={soCau} onChange={(e) => setSoCau(Number(e.target.value))} className="rounded-md border border-slate-300 px-1.5 py-1 text-[12px]">{[3, 5, 8, 10].map((n) => <option key={n} value={n}>{n} câu</option>)}</select>
        </label>
        <button onClick={() => { tai(); setNow(Date.now()) }} title="Tải lại" className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-500 hover:bg-slate-100">↻</button>
      </div>
      {loi && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {thongBao && <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">⚠ {thongBao}</p>}

      {loading ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        : hien.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Không có ca bổ trợ yếu nào ngày này{monF || khoiF ? ' (theo filter)' : ''}.</div>
        : nhom.map(([gio, ds]) => (
          <div key={gio} className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
            <h3 className="mb-2 text-[13px] font-bold text-slate-700">🕒 {gio} <span className="font-normal text-slate-400">· {ds.length} em</span></h3>
            <div className="space-y-2">
              {ds.map((c) => {
                const tt = trangThai(c, now)
                const im = c.cau_cuoi_at ? Math.floor((now - Date.parse(c.cau_cuoi_at)) / 60000) : null
                const dangMo = c.trang_thai === 'mo' && !c.da_dong
                return (
                  <div key={c.buoi_id} className={`rounded-xl border px-3 py-2 ${tt === 'im' ? 'border-amber-300 bg-amber-50/40' : tt === 'chua_dd' ? 'border-slate-200' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-slate-800">{c.ho_ten}</span>
                      <span className="text-[11.5px] text-slate-400">{c.ma_hs} · K{c.khoi} · {c.mon} · L{c.level}{c.uu_tien === 3 ? ' · ▲ ưu tiên cao' : ''}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TT[tt].cls}`}>{TT[tt].ten}{tt === 'im' && im != null ? ` ${im}'` : ''}</span>
                      <span className="ml-auto text-[12px] text-slate-500">{c.nguoi_ten ?? 'chưa có người dạy'}{c.phong ? ` · ${c.phong}` : ''}{c.gio_ket_thuc ? ` · tới ${hhmm(c.gio_ket_thuc)}` : ''}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px]">
                      <span className="text-slate-500">{c.so_dang} dạng · đã làm <b className={c.so_cau && c.so_dung / c.so_cau >= 0.7 ? 'text-emerald-700' : 'text-slate-700'}>{c.so_dung}/{c.so_cau}</b> câu đúng</span>
                      {c.bai_giay.map((g, i) => (
                        <span key={g.bai_test_id} className="flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 ring-1 ring-slate-200">
                          <span className="text-slate-600">📄 Giấy {i + 1} · {g.so_cau} câu · nhập <b className={g.da_nhap >= g.so_cau ? 'text-emerald-700' : 'text-amber-700'}>{g.da_nhap}/{g.so_cau}</b></span>
                          <button disabled={busy === g.bai_test_id} onClick={() => moBai(g.bai_test_id, 'nhap')} className="font-semibold text-indigo-600 hover:underline">Nhập KQ</button>
                          <button disabled={busy === g.bai_test_id} onClick={() => moBai(g.bai_test_id, 'in')} className="text-slate-500 hover:underline">In lại</button>
                        </span>
                      ))}
                      {dangMo && (
                        <button disabled={busy === c.buoi_id} onClick={() => inMoi(c)} className="ml-auto rounded-lg bg-slate-800 px-3 py-1 text-[12px] font-semibold text-white hover:bg-slate-900 disabled:opacity-50">
                          {busy === c.buoi_id ? 'Đang chọn câu…' : '🖨 In tài liệu'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

      {inBai && <TrangIn bai={inBai} onDong={() => setInBai(null)} />}
      {nhapBai && <NhapKetQua bai={nhapBai} onDong={() => { setNhapBai(null); tai() }} />}
    </div>
  )
}

// ── TRANG IN — overlay trắng + CSS @media print chỉ hiện .bk-print. Trang 1..n = đề cho em; trang cuối (ngắt trang) = đáp án cho TA. ──
function TrangIn({ bai, onDong }: { bai: BaiInGiay; onDong: () => void }) {
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
            <h1 className="text-[18px] font-bold">BK ACADEMY — PHIẾU LUYỆN BỔ TRỢ · {bai.mon}</h1>
            <span className="text-[12px]">{thuCuaNgay(bai.ngay)} {ddmmVN(bai.ngay)}{bai.gio_bat_dau ? ` · ${hhmm(bai.gio_bat_dau)}` : ''}{bai.phong ? ` · ${bai.phong}` : ''}</span>
          </div>
          <div className="mt-1 flex justify-between text-[13px]">
            <span>Họ tên: <b>{bai.hs.ho_ten}</b> ({bai.hs.ma_hs}) · Khối {bai.hs.khoi}</span>
            <span>Thầy/cô: {bai.nguoi_ten ?? '…………'}</span>
          </div>
          <p className="mt-1 text-[12px] italic">Khoanh tròn 1 đáp án đúng cho mỗi câu. Làm nháp ra mặt sau.</p>
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
function NhapKetQua({ bai, onDong }: { bai: BaiInGiay; onDong: () => void }) {
  const [caus, setCaus] = useState(bai.caus)
  const [busy, setBusy] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  async function chon(id: string, i: number | null) {
    setBusy(id); setLoi(null)
    try { const r = await giayNhapKetQua(id, i); setCaus((prev) => prev.map((k) => k.id === id ? { ...k, chon: r.chon, verdict: r.verdict } : k)) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  const daNhap = caus.filter((k) => k.verdict).length, dung = caus.filter((k) => k.verdict === 'correct').length
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div className="max-h-[88vh] w-[720px] max-w-full overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">Nhập kết quả bài giấy — {bai.hs.ho_ten}</h3>
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
                  return <button key={i} disabled={busy === k.id} onClick={() => chon(k.id, dangChon ? null : i)}
                    className={`h-8 w-11 rounded-lg text-[13px] font-bold ${dangChon ? (k.verdict === 'correct' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'border border-slate-300 bg-white text-slate-600 hover:border-indigo-300'}`}>{CHU[i]}</button>
                })}
                <span className="ml-2 text-[12px] text-slate-400">{k.verdict ? (k.verdict === 'correct' ? '✓ đúng' : `✗ sai (đáp án ${String(k.dap_an_key)})`) : 'chưa nhập / em bỏ trống'}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end"><button onClick={onDong} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">Xong</button></div>
      </div>
    </div>
  )
}
