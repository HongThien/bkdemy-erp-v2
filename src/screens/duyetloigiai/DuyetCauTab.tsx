// HÀNG DUYỆT HỢP NHẤT (spec-kho-chuan.md §3, 08/09) — một hàng đợi, nhiều bộ lọc; thẻ duyệt SỬA ĐƯỢC TẠI CHỖ, lưu là chuẩn.
// Bộ lọc (prop `loc`): câu mới chờ duyệt · lời giải Claude mới · máy nghi đáp số · không kiểm được · tồn đọng — đều là
// trạng thái thật trong bảng câu (fn_kho_hang_duyet), không có bảng hàng đợi. Mỗi thẻ:
//   · Dạng: bấm mở DangPickerOne (browse + ô tìm, KHÔNG dropdown) — đổi dạng thì cụm reset (cụm nằm gọn trong 1 dạng).
//   · Cụm: pill lọc theo dạng đang chọn (listCumBai) · Đề / Đáp số / Lời giải: sửa thẳng, preview MathText.
//   · ✓ Duyệt = fn_kho_duyet_cau (áp sửa + ký, 1 transaction; sửa đáp số ⇒ DB thu hồi form TN của câu, báo số form).
//   · ✕ Từ chối = fn_kho_tu_choi_cau (kho rác, lý do bắt buộc). KHÔNG có "duyệt tất cả" cho hàng nghi/không kiểm (spec §3).
// Badge kiểm đáp số: máy/AI ký khớp · NGHI kèm ghi chú "máy X ≠ kho Y" — người nhìn đề, tự tính, sửa đáp số nếu kho sai.
import { useEffect, useRef, useState } from 'react'
import { nhanhCuaMon, NHANH_LABEL, LOAI_CAU, listHangDuyet, duyetCauHangDuyet, tuChoiCauHangDuyet, listCumBai, tenCum, khoTbls, HANG_DUYET_LABEL,
  type CauHangDuyet, type KhoMon, type HangDuyetLoc, type CumBai, type SuaCauDuyet } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { SolutionField } from '../kho/DangHub'
import DangPickerOne from '../../components/DangPickerOne'
import { myNhanSuId } from '../../lib/giaoviec'

type Row = CauHangDuyet & { mon: KhoMon }
const LOAI_LABEL = Object.fromEntries(LOAI_CAU.map((x) => [x.value, x.label])) as Record<string, string>
const NHANH_HGT = 'hinh_gt' // nhánh của DangPickerOne/khoCuaMon cho kho hgt (registry tailieu.ts NHANH_CUA_MON)
const fmtTs = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

export default function DuyetCauTab({ mon, khoi, loc, onChanged }: { mon: string; khoi: string; loc: HangDuyetLoc; onChanged?: () => void }) {
  const kho = nhanhCuaMon(mon).filter((n): n is KhoMon => n !== 'hinh')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  const reqId = useRef(0)

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null); setRows([])
    try {
      const lists = await Promise.all(kho.map((k) => listHangDuyet(k, loc, khoi)))
      if (my !== reqId.current) return
      setRows(kho.flatMap((k, i) => lists[i].map((r) => ({ ...r, mon: k }))))
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  useEffect(() => { reload() }, [mon, khoi, loc]) // eslint-disable-line

  function bao(msg: string) { setThongBao(msg); setTimeout(() => setThongBao(null), 2500) }
  function xong(r: Row, msg: string) { setRows((a) => a.filter((x) => !(x.mon === r.mon && x.ma_cau === r.ma_cau))); bao(msg); onChanged?.() }

  // "Duyệt tất cả" CHỈ cho 2 hàng lời giải (moi/ton_dong) như màn cũ — hàng nghi/không kiểm/câu mới phải đi từng thẻ.
  const choDuyetLo = loc === 'moi' || loc === 'ton_dong'
  async function onDuyetTatCa() {
    if (!rows.length || !confirm(`Duyệt cả ${rows.length} câu đang lọc (không sửa gì)?`)) return
    setBusyAll(true)
    try {
      const nguoi = await myNhanSuId()
      for (const r of rows) { try { await duyetCauHangDuyet(r.mon, r.ma_cau, nguoi) } catch { /* bỏ qua câu lỗi, tiếp tục */ } }
      await reload(); onChanged?.()
    } finally { setBusyAll(false) }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-[12px] text-slate-500"><b className="text-slate-800">{rows.length}</b> câu · {HANG_DUYET_LABEL[loc]} · khối {khoi}</span>
        {loc === 'nghi' && <span className="text-[12px] text-amber-700">Máy/AI tính ra khác đáp số kho. Xem đề, tự tính; kho sai thì sửa đáp số rồi Duyệt — form trắc nghiệm của câu sẽ tự thu hồi để sinh lại.</span>}
        {loc === 'cau_moi' && <span className="text-[12px] text-slate-500">Câu vào kho sau 08/09 — HS chưa thấy tới khi duyệt.</span>}
        {thongBao && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">{thongBao}</span>}
        {choDuyetLo && (
          <button onClick={onDuyetTatCa} disabled={!rows.length || busyAll}
            className="ml-auto rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
            {busyAll ? '⏳ Đang duyệt…' : `✓ Duyệt tất cả đang lọc (${rows.length})`}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Không có câu nào ở {mon} · khối {khoi} · {HANG_DUYET_LABEL[loc]}. 🎉</p>
          : <ul className="space-y-4">{rows.map((r) => <The key={`${r.mon}:${r.ma_cau}`} r={r} mon={mon} busyAll={busyAll} onXong={(msg) => xong(r, msg)} />)}</ul>}
      </div>
    </div>
  )
}

// 1 thẻ duyệt: state sửa cục bộ, so với bản gốc để chỉ gửi key ĐÃ ĐỔI (DB: key vắng = giữ nguyên).
function The({ r, mon, busyAll, onXong }: { r: Row; mon: string; busyAll: boolean; onXong: (msg: string) => void }) {
  const [de, setDe] = useState(r.noi_dung)
  const [dapAn, setDapAn] = useState(r.dap_an ?? '')
  const [loiGiai, setLoiGiai] = useState(r.loi_giai ?? '')
  const [dang, setDang] = useState({ ma: r.dang_chinh, ten: r.ten_dang, cd: r.ten_chuyen_de })
  const [cum, setCum] = useState<string | null>(r.ma_cum)
  const [cums, setCums] = useState<CumBai[] | null>(null)   // null = chưa tải
  const [suaDe, setSuaDe] = useState(false)
  const [suaLg, setSuaLg] = useState(false)
  const [pickDang, setPickDang] = useState(false)
  const [tuChoi, setTuChoi] = useState<string | null>(null) // null = ô từ chối đóng
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const cauTbl = khoTbls(r.mon).cauTbl
  const hasOpts = !!(r.lua_chon && r.lua_chon.length)

  useEffect(() => { let alive = true; listCumBai(dang.ma, cauTbl).then((c) => { if (alive) setCums(c) }).catch(() => { if (alive) setCums([]) }); return () => { alive = false } }, [dang.ma, cauTbl])

  const doiDe = de.trim() !== r.noi_dung.trim()
  const doiDap = dapAn.trim() !== (r.dap_an ?? '').trim()
  const doiLg = loiGiai.trim() !== (r.loi_giai ?? '').trim()
  const doiDang = dang.ma !== r.dang_chinh
  const doiCum = (cum ?? null) !== (r.ma_cum ?? null)
  const coSua = doiDe || doiDap || doiLg || doiDang || doiCum

  function chonDang(maDang: string) {
    // DangPickerOne chỉ trả mã — tên hiện tạm là mã, DB trả tên thật khi tải lại; cụm reset vì cụm thuộc dạng.
    setDang({ ma: maDang, ten: maDang === r.dang_chinh ? r.ten_dang : maDang, cd: maDang === r.dang_chinh ? r.ten_chuyen_de : '' })
    setCum(maDang === r.dang_chinh ? r.ma_cum : null); setPickDang(false)
  }
  async function onDuyet() {
    setBusy(true); setErr(null)
    try {
      const sua: SuaCauDuyet = {}
      if (doiDe) sua.noi_dung = de.trim()
      if (doiDap) sua.dap_an = dapAn.trim()
      if (doiLg) sua.loi_giai = loiGiai.trim()
      if (doiDang) sua.dang_chinh = dang.ma
      if (doiCum || doiDang) sua.ma_cum = cum
      const kq = await duyetCauHangDuyet(r.mon, r.ma_cau, await myNhanSuId(), sua)
      onXong(`✓ Đã duyệt ${r.ma_cau}${coSua ? ' (có sửa)' : ''}${kq.thu_hoi_form ? ` · thu hồi ${kq.thu_hoi_form} form trắc nghiệm để sinh lại` : ''}`)
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  async function onTuChoi() {
    const lyDo = (tuChoi ?? '').trim(); if (!lyDo) return
    setBusy(true); setErr(null)
    try { await tuChoiCauHangDuyet(r.mon, r.ma_cau, await myNhanSuId(), lyDo); onXong(`✕ Đã đưa ${r.ma_cau} vào kho rác`) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  const lbl = 'mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400'
  const box = 'rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-[15px] leading-relaxed text-slate-800'
  const kiemBadge = r.kiem_may === 'nghi'
    ? <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800" title={r.kiem_may_at ? `${r.kiem_may_boi} · ${fmtTs(r.kiem_may_at)}` : undefined}>⚠ {r.kiem_may_boi === 'mcq-auto' ? 'máy' : r.kiem_may_boi} nghi: {r.kiem_may_ghi}</span>
    : r.kiem_may === 'khop' ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">✓ {r.kiem_may_boi === 'mcq-auto' ? 'máy' : r.kiem_may_boi} đã kiểm khớp</span>
    : r.kiem_may === 'khong_kiem_duoc' ? <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600" title={r.kiem_may_ghi ?? undefined}>? không kiểm được</span>
    : null

  return (
    <li className={`rounded-xl border bg-white p-4 shadow-sm ${r.kiem_may === 'nghi' ? 'border-amber-300' : 'border-slate-200'}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
        <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">{NHANH_LABEL[r.mon]}</span>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{r.ma_cau}</code>
        <span>Khối {r.khoi} · {LOAI_LABEL[r.loai_cau] ?? r.loai_cau}</span>
        {r.nguon === 'clone' && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">clone</span>}
        {r.nguon_giai === 'ai' && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-sky-700">lời giải AI{r.giai_method ? ` · ${r.giai_method}` : ''}</span>}
        {kiemBadge}
        {!r.kho_chuan && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700" title="Chỗ chọn câu cho HS/ET không lấy câu này tới khi duyệt">ngoài kho chuẩn</span>}
        <span className="text-slate-400">· vào kho {fmtTs(r.created_at)}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTuChoi(tuChoi === null ? '' : null)} disabled={busy || busyAll}
            className="rounded-md px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">✕ Từ chối</button>
          <button onClick={onDuyet} disabled={busy || busyAll || !de.trim()}
            className="rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
            {busy ? '⏳…' : coSua ? '✓ Lưu sửa + Duyệt' : '✓ Duyệt'}
          </button>
        </div>
      </div>

      {/* Dạng + cụm — sửa tại chỗ: dạng qua popup tìm kiếm, cụm là pill theo dạng đang chọn */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
        <button onClick={() => setPickDang(true)} disabled={busy || busyAll} title="Đổi dạng (mở bảng tìm dạng)"
          className={`rounded-md border px-2.5 py-1 text-left font-medium hover:border-indigo-400 hover:bg-indigo-50 ${doiDang ? 'border-indigo-400 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-700'}`}>
          📁 {dang.cd ? <span className="text-slate-400">{dang.cd} › </span> : null}{dang.ten} <code className="ml-1 text-[11px] text-slate-400">{dang.ma}</code>
        </button>
        {r.dang_ai_de_xuat && r.dang_ai_de_xuat !== r.dang_chinh && <span className="text-slate-400" title="Dạng AI gán lúc vào kho">AI đề xuất: <code>{r.dang_ai_de_xuat}</code></span>}
        <span className="ml-2 text-slate-400">Cụm:</span>
        {cums === null ? <span className="text-slate-400">…</span>
          : (
            <>
              <button onClick={() => setCum(null)} disabled={busy || busyAll}
                className={`rounded-full px-2.5 py-0.5 ${cum === null ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`}>chưa phân</button>
              {cums.map((c) => (
                <button key={c.ma_cum} onClick={() => setCum(c.ma_cum)} disabled={busy || busyAll} title={c.ghi_chu ?? c.ma_cum}
                  className={`rounded-full px-2.5 py-0.5 ${cum === c.ma_cum ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`}>{tenCum(c)}</button>
              ))}
              {cums.length === 0 && <span className="text-slate-400">(dạng chưa có cụm)</span>}
            </>
          )}
      </div>

      <div className={`grid gap-4 ${r.anh_de || r.anh_dap_an ? 'grid-cols-[1fr_1fr_auto]' : 'grid-cols-2'}`}>
        <div className="min-w-0">
          <div className="flex items-center justify-between"><span className={lbl}>Đề bài{doiDe ? ' · đã sửa' : ''}</span>
            <button onClick={() => setSuaDe((v) => !v)} className="text-[11px] font-medium text-slate-400 hover:text-indigo-600">{suaDe ? '✓ Xong' : '✎ Sửa'}</button></div>
          {suaDe ? <textarea value={de} onChange={(e) => setDe(e.target.value)} className={`${inp} min-h-[90px] font-mono text-[13px]`} />
            : <div className={box}><MathText>{de}</MathText></div>}
          {hasOpts && (
            <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
              {r.lua_chon!.map((o, i) => <li key={i} className={String.fromCharCode(65 + i) === (r.dap_an ?? '').trim().toUpperCase() ? 'font-medium text-emerald-700' : ''}>{String.fromCharCode(65 + i)}. <MathText>{o}</MathText></li>)}
            </ul>
          )}
          {r.menh_de && (
            <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
              {r.menh_de.map((m, i) => <li key={i}>{String.fromCharCode(97 + i)}) <MathText>{m.noi_dung}</MathText> <span className="text-slate-400">[{m.dap_an}]</span></li>)}
            </ul>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className={`${lbl} mb-0`}>Đáp số{doiDap ? ' · đã sửa' : ''}</span>
            <input value={dapAn} onChange={(e) => setDapAn(e.target.value)} placeholder={hasOpts ? 'Chữ cái đúng (A/B/C/D)' : 'LaTeX, vd \\dfrac{3}{4}'}
              className={`${inp} ${doiDap ? 'border-indigo-400 bg-indigo-50/40' : ''} ${r.kiem_may === 'nghi' && !doiDap ? 'border-amber-400' : ''}`} />
            {dapAn.trim() && <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[15px]"><MathText>{dapAn}</MathText></span>}
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between"><span className={lbl}>Lời giải{doiLg ? ' · đã sửa' : ''}{r.nguon_giai === 'ai' ? ' (AI)' : ''}</span>
            <button onClick={() => setSuaLg((v) => !v)} className="text-[11px] font-medium text-slate-400 hover:text-indigo-600">{suaLg ? '✓ Xong' : '✎ Sửa'}</button></div>
          {suaLg ? <SolutionField value={loiGiai} onChange={setLoiGiai} taClassName={`${inp} min-h-[160px] font-mono text-[13px]`} />
            : <div className={`${box} max-h-[360px] overflow-auto`}><MathText>{loiGiai || '—'}</MathText></div>}
        </div>
        {(r.anh_de || r.anh_dap_an) && (
          <div className="flex w-[220px] flex-col gap-2">
            {r.anh_de && <img src={r.anh_de} alt="ảnh đề" className="max-h-52 w-auto rounded-lg border border-slate-200" />}
            {r.anh_dap_an && <img src={r.anh_dap_an} alt="ảnh giải" className="max-h-52 w-auto rounded-lg border border-slate-200" />}
          </div>
        )}
      </div>

      {tuChoi !== null && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/40 p-2.5">
          <input autoFocus value={tuChoi} onChange={(e) => setTuChoi(e.target.value)} placeholder="Lý do từ chối (bắt buộc) — câu vào kho rác, khôi phục được ở Kho"
            className={`${inp} border-rose-200`} onKeyDown={(e) => { if (e.key === 'Enter') onTuChoi() }} />
          <button onClick={onTuChoi} disabled={busy || !tuChoi.trim()} className="shrink-0 rounded-md bg-rose-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">Xác nhận từ chối</button>
          <button onClick={() => setTuChoi(null)} className="shrink-0 rounded-md px-2 py-1.5 text-[12px] text-slate-500 hover:bg-slate-100">Huỷ</button>
        </div>
      )}
      {err && <p className="mt-2 text-xs text-rose-600">{err}</p>}
      {pickDang && (
        <DangPickerOne khoi={r.khoi} mon={mon} nhanh={r.mon === 'hgt' ? NHANH_HGT : null}
          onClose={() => setPickDang(false)} onPick={(maDang) => chonDang(maDang)} />
      )}
    </li>
  )
}
