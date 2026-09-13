// DUYỆT ĐÚNG/SAI — LOẠI RIÊNG (CEO 12/09, mig 202609121432 + 202609122218).
// Vì sao tách khỏi DuyetCauTab: 1 câu ĐS có N mệnh đề, MỖI mệnh đề là 1 DẠNG (KP) riêng — thẻ "1 dạng / 1 đáp số" của hàng
// duyệt hợp nhất không tả được. Ở đây 1 thẻ = câu cha (đề chung + dạng đại diện) + N hàng mệnh đề, mỗi hàng: nội dung ·
// Đúng/Sai · DẠNG (DangPickerOne) · lời giải · nút ✓ Duyệt riêng. Câu cha chỉ duyệt được khi MỌI mệnh đề đã duyệt (DB chặn).
// Mệnh đề `con === null` = chưa có dòng bảng con (ma_dang jsonb rớt sau renumber 12/09) ⇒ tô vàng, bắt chọn dạng trước.
// Sau mỗi mutation VÁ TẠI CHỖ (CLAUDE.md §2 — không reload list): duyệt mệnh đề ⇒ thay đúng phần tử; duyệt/từ chối câu ⇒ rút thẻ.
import { useEffect, useRef, useState } from 'react'
import { nhanhCuaMon, NHANH_LABEL, listHangDuyetDs, duyetMenhDe, duyetCauDs, tuChoiCauHangDuyet,
  type CauDungSaiDuyet, type MenhDeHop, type MenhDeCon, type KhoMon, type SuaMenhDe, type SuaCauDuyet } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { SolutionField } from '../kho/DangHub'
import DangPickerOne from '../../components/DangPickerOne'
import { myNhanSuId } from '../../lib/giaoviec'

type Row = CauDungSaiDuyet & { mon: KhoMon }
const NHANH_HGT = 'hinh_gt'
const BATCH_SIZE = 20
const fmtTs = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
const chuMd = (thuTu: number) => String.fromCharCode(96 + thuTu) // 1 → a

export default function DuyetDungSaiTab({ mon, khoi, onChanged }: { mon: string; khoi: string; onChanged?: () => void }) {
  const kho = nhanhCuaMon(mon).filter((n): n is KhoMon => n !== 'hinh')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [nhanhLoi, setNhanhLoi] = useState<string[]>([]) // nhánh RPC từ chối (vd KHTN chưa có bảng con) — chỉ ghi chú, không chặn màn
  const [thongBao, setThongBao] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  const [nhanh, setNhanh] = useState<KhoMon | 'all'>('all')
  const reqId = useRef(0)

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null); setRows([]); setNhanhLoi([])
    try {
      const kq = await Promise.allSettled(kho.map((k) => listHangDuyetDs(k, khoi)))
      if (my !== reqId.current) return
      const loi: string[] = []
      const all: Row[] = []
      kq.forEach((x, i) => {
        if (x.status === 'fulfilled') all.push(...x.value.map((r) => ({ ...r, mon: kho[i] })))
        else loi.push(`${NHANH_LABEL[kho[i]]}: ${x.reason?.message ?? String(x.reason)}`)
      })
      setRows(all); setNhanhLoi(loi)
      if (!all.length && loi.length === kq.length) setErr(loi.join(' · '))
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  useEffect(() => { setNhanh('all'); reload() }, [mon, khoi]) // eslint-disable-line

  function bao(msg: string) { setThongBao(msg); setTimeout(() => setThongBao(null), 2500) }
  function rutThe(r: Row, msg: string) { setRows((a) => a.filter((x) => !(x.mon === r.mon && x.ma_cau === r.ma_cau))); bao(msg); onChanged?.() }
  // Vá 1 mệnh đề vừa ký vào đúng thẻ — không reload (§2). so_da_duyet/so_thieu_dang đếm lại trên phần tử đang render (badge).
  function vaMenhDe(r: Row, md: MenhDeCon & { thu_tu: number }) {
    setRows((a) => a.map((x) => {
      if (!(x.mon === r.mon && x.ma_cau === r.ma_cau)) return x
      const hop = x.menh_de_hop.map((h) => h.thu_tu === md.thu_tu
        ? { ...h, noi_dung: md.noi_dung, dap_an: (md.dung ? 'D' : 'S') as 'D' | 'S', ma_dang: md.dang_chinh, loi_giai: md.loi_giai, con: md }
        : h)
      return { ...x, menh_de_hop: hop, so_da_duyet: hop.filter((h) => h.con?.da_duyet).length, so_thieu_dang: hop.filter((h) => !h.con).length }
    }))
  }

  const rowsShown = nhanh === 'all' ? rows : rows.filter((r) => r.mon === nhanh)
  const batch = rowsShown.slice(0, BATCH_SIZE)
  const demNhanh = (m: KhoMon) => rows.filter((r) => r.mon === m).length
  // Batch = ký hết mệnh đề theo hiện trạng + duyệt câu; câu có mệnh đề thiếu dạng bị DB từ chối ⇒ giữ lại trên màn.
  async function onDuyetTatCa() {
    if (!batch.length || !confirm(`Duyệt cả ${batch.length} câu Đúng/Sai trong batch (ký hết mệnh đề theo hiện trạng, không sửa)? Câu còn mệnh đề chưa gán dạng sẽ bị bỏ qua.`)) return
    setBusyAll(true)
    try {
      const nguoi = await myNhanSuId()
      const ok = new Set<string>(); let boQua = 0
      for (const r of batch) {
        try { await duyetCauDs(r.mon, r.ma_cau, nguoi, {}, true); ok.add(`${r.mon}:${r.ma_cau}`) }
        catch { boQua++ }
      }
      setRows((a) => a.filter((x) => !ok.has(`${x.mon}:${x.ma_cau}`)))
      bao(`✓ Đã duyệt ${ok.size}/${batch.length} câu${boQua ? ` · ${boQua} câu bỏ qua (còn mệnh đề chưa gán dạng)` : ''}`)
      onChanged?.()
    } finally { setBusyAll(false) }
  }

  const chip = (n: KhoMon | 'all', label: string, count: number) => (
    <button key={n} onClick={() => setNhanh(n)}
      className={`rounded-full px-3 py-0.5 text-[12px] font-medium transition ${nhanh === n ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'} ${count === 0 && n !== 'all' ? 'opacity-50' : ''}`}>
      {label} <span className={nhanh === n ? 'text-violet-200' : 'text-slate-400'}>{count}</span>
    </button>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-[12px] text-slate-500">
          Batch <b className="text-slate-800">{batch.length}</b>/<b>{rowsShown.length}</b> câu Đúng/Sai · khối {khoi}
          {nhanh !== 'all' && <> · <span className="text-slate-700">{NHANH_LABEL[nhanh]}</span></>}
        </span>
        {kho.length > 1 && (
          <div className="flex items-center gap-1.5">
            {chip('all', 'Tất cả', rows.length)}
            {kho.map((n) => chip(n, NHANH_LABEL[n], demNhanh(n)))}
          </div>
        )}
        <span className="text-[12px] text-slate-500">Mỗi mệnh đề là 1 dạng — duyệt từng mệnh đề, đủ hết mới duyệt được câu.</span>
        {thongBao && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">{thongBao}</span>}
        <button onClick={onDuyetTatCa} disabled={!batch.length || busyAll}
          className="ml-auto rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
          {busyAll ? '⏳ Đang duyệt…' : `✓ Duyệt tất cả batch (${batch.length})`}
        </button>
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {nhanhLoi.length > 0 && rows.length > 0 && <p className="mb-3 text-[12px] text-amber-700">{nhanhLoi.join(' · ')}</p>}
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rowsShown.length === 0 ? <p className="text-sm text-slate-400">Không có câu Đúng/Sai nào chờ duyệt ở {mon}{nhanh !== 'all' ? ` · ${NHANH_LABEL[nhanh]}` : ''} · khối {khoi}. 🎉</p>
          : (
            <>
              <ul className="space-y-4">{batch.map((r) => (
                <The key={`${r.mon}:${r.ma_cau}`} r={r} mon={mon} busyAll={busyAll}
                  onVaMenhDe={(md) => vaMenhDe(r, md)} onXong={(msg) => rutThe(r, msg)} />
              ))}</ul>
              {rowsShown.length > batch.length && (
                <p className="mt-4 text-center text-[12px] text-slate-400">Còn <b>{rowsShown.length - batch.length}</b> câu — sẽ hiện sau khi duyệt/từ chối xong batch này.</p>
              )}
            </>
          )}
      </div>
    </div>
  )
}

// ── 1 thẻ = câu cha + N mệnh đề ─────────────────────────────────────────────────────────────
function The({ r, mon, busyAll, onVaMenhDe, onXong }: {
  r: Row; mon: string; busyAll: boolean; onVaMenhDe: (md: MenhDeCon & { thu_tu: number }) => void; onXong: (msg: string) => void
}) {
  const [de, setDe] = useState(r.noi_dung)
  const [suaDe, setSuaDe] = useState(false)
  const [dang, setDang] = useState({ ma: r.dang_chinh, ten: r.ten_dang, cd: r.ten_chuyen_de })
  const [pickDang, setPickDang] = useState(false)
  const [tuChoi, setTuChoi] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const doiDe = de.trim() !== r.noi_dung.trim()
  const doiDang = dang.ma !== r.dang_chinh
  const duHet = r.so_menh_de > 0 && r.so_da_duyet === r.so_menh_de

  async function onDuyetCau() {
    setBusy(true); setErr(null)
    try {
      const sua: SuaCauDuyet = {}
      if (doiDe) sua.noi_dung = de.trim()
      if (doiDang) sua.dang_chinh = dang.ma
      const kq = await duyetCauDs(r.mon, r.ma_cau, await myNhanSuId(), sua)
      onXong(`✓ Đã duyệt câu ${r.ma_cau} (${kq.so_menh_de} mệnh đề)`)
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

  return (
    <li className={`rounded-xl border bg-white p-4 shadow-sm ${r.so_thieu_dang ? 'border-amber-300' : 'border-slate-200'}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
        <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">{NHANH_LABEL[r.mon]}</span>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{r.ma_cau}</code>
        <span>Khối {r.khoi} · Đúng/Sai</span>
        <span className={`rounded px-2 py-0.5 font-medium ${duHet ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {r.so_da_duyet}/{r.so_menh_de} mệnh đề đã duyệt
        </span>
        {r.so_thieu_dang > 0 && <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800" title="Dạng ghi trong jsonb không còn trong bản đồ (renumber) — chọn dạng mới rồi duyệt">⚠ {r.so_thieu_dang} mệnh đề chưa gán dạng</span>}
        {r.ten_de_goc && <span className="text-slate-400" title="Tên đề/tài liệu gốc">📄 {r.ten_de_goc}</span>}
        {!r.kho_chuan && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700" title="Chỗ chọn câu cho HS/ET không lấy câu này tới khi duyệt">ngoài kho chuẩn</span>}
        <span className="text-slate-400">· vào kho {fmtTs(r.created_at)}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTuChoi(tuChoi === null ? '' : null)} disabled={busy || busyAll}
            className="rounded-md px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">✕ Từ chối</button>
          <button onClick={onDuyetCau} disabled={busy || busyAll || !de.trim() || !duHet}
            title={duHet ? 'Duyệt câu cha (mọi mệnh đề đã duyệt)' : 'Duyệt hết các mệnh đề trước'}
            className="rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
            {busy ? '⏳…' : doiDe || doiDang ? '✓ Lưu sửa + Duyệt câu' : '✓ Duyệt câu'}
          </button>
        </div>
      </div>

      {/* Dạng đại diện của câu cha (để đặt ma_cau + browse theo chuyên đề) — dạng THẬT nằm ở từng mệnh đề bên dưới */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-slate-400">Dạng đại diện:</span>
        <button onClick={() => setPickDang(true)} disabled={busy || busyAll} title="Đổi dạng đại diện (mở bảng tìm dạng)"
          className={`rounded-md border px-2.5 py-1 text-left font-medium hover:border-indigo-400 hover:bg-indigo-50 ${doiDang ? 'border-indigo-400 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-700'}`}>
          📁 {dang.cd ? <span className="text-slate-400">{dang.cd} › </span> : null}{dang.ten} <code className="ml-1 text-[11px] text-slate-400">{dang.ma}</code>
        </button>
      </div>

      <div className={`grid gap-4 ${r.anh_de ? 'grid-cols-[1fr_auto]' : 'grid-cols-1'}`}>
        <div className="min-w-0">
          <div className="flex items-center justify-between"><span className={lbl}>Đề chung{doiDe ? ' · đã sửa' : ''}</span>
            <button onClick={() => setSuaDe((v) => !v)} className="text-[11px] font-medium text-slate-400 hover:text-indigo-600">{suaDe ? '✓ Xong' : '✎ Sửa'}</button></div>
          {suaDe ? <textarea value={de} onChange={(e) => setDe(e.target.value)} className={`${inp} min-h-[70px] font-mono text-[13px]`} />
            : <div className={box}><MathText>{de}</MathText></div>}
        </div>
        {r.anh_de && <img src={r.anh_de} alt="ảnh đề" className="max-h-52 w-[220px] rounded-lg border border-slate-200 object-contain" />}
      </div>

      <ul className="mt-3 space-y-2">
        {r.menh_de_hop.map((h) => (
          <MenhDeRow key={h.thu_tu} r={r} h={h} mon={mon} busyAll={busy || busyAll} onVa={onVaMenhDe} />
        ))}
      </ul>

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
          onClose={() => setPickDang(false)}
          onPick={(maDang) => { setDang({ ma: maDang, ten: maDang === r.dang_chinh ? r.ten_dang : maDang, cd: maDang === r.dang_chinh ? r.ten_chuyen_de : '' }); setPickDang(false) }} />
      )}
    </li>
  )
}

// ── 1 hàng mệnh đề: nội dung · Đúng/Sai · DẠNG riêng · lời giải · ✓ Duyệt ──────────────────
function MenhDeRow({ r, h, mon, busyAll, onVa }: { r: Row; h: MenhDeHop; mon: string; busyAll: boolean; onVa: (md: MenhDeCon & { thu_tu: number }) => void }) {
  const con = h.con
  const goc = { nd: con?.noi_dung ?? h.noi_dung ?? '', dung: con ? con.dung : h.dap_an === 'D', lg: con?.loi_giai ?? h.loi_giai ?? '', dang: con?.dang_chinh ?? null }
  const [nd, setNd] = useState(goc.nd)
  const [dung, setDung] = useState(goc.dung)
  const [lg, setLg] = useState(goc.lg)
  const [dang, setDang] = useState<{ ma: string; ten: string; cd: string } | null>(con ? { ma: con.dang_chinh, ten: con.ten_dang, cd: con.ten_chuyen_de } : null)
  const [suaNd, setSuaNd] = useState(false)
  const [suaLg, setSuaLg] = useState(false)
  const [pick, setPick] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  // Đồng bộ lại khi cha vá phần tử (sau khi ký): con mới ⇒ state cục bộ nhận giá trị đã ghi.
  useEffect(() => {
    setNd(goc.nd); setDung(goc.dung); setLg(goc.lg)
    setDang(con ? { ma: con.dang_chinh, ten: con.ten_dang, cd: con.ten_chuyen_de } : null)
    setSuaNd(false); setSuaLg(false); setBusy(false)
  }, [con?.id, con?.duyet_at]) // eslint-disable-line

  const doiNd = nd.trim() !== goc.nd.trim()
  const doiDung = dung !== goc.dung
  const doiLg = lg.trim() !== goc.lg.trim()
  const doiDang = (dang?.ma ?? null) !== goc.dang
  const coSua = doiNd || doiDung || doiLg || doiDang
  const thieuDang = !dang
  const daDuyet = !!con?.da_duyet && !coSua

  async function onDuyet() {
    if (!dang) { setErr('Chọn dạng cho mệnh đề trước khi duyệt'); return }
    setBusy(true); setErr(null)
    try {
      const sua: SuaMenhDe = {}
      if (doiNd) sua.noi_dung = nd.trim()
      if (doiDung) sua.dung = dung
      if (doiLg) sua.loi_giai = lg.trim() || null
      if (doiDang || !con) sua.dang_chinh = dang.ma
      const kq = await duyetMenhDe(r.mon, r.ma_cau, h.thu_tu, await myNhanSuId(), sua)
      // RPC trả mã dạng; tên dạng giữ theo lựa chọn hiện tại của người (DangPickerOne chỉ trả mã — cùng cách DuyetCauTab).
      onVa({ ...kq, ten_dang: kq.ten_dang ?? dang.ten, ten_chuyen_de: kq.ten_chuyen_de ?? dang.cd })
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  const dis = busy || busyAll
  return (
    <li className={`rounded-xl border p-3 ${thieuDang ? 'border-amber-300 bg-amber-50/30' : daDuyet ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-start gap-2">
        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-[12px] font-bold text-slate-600">{chuMd(h.thu_tu)})</span>
        <div className="min-w-0 flex-1">
          {suaNd ? <textarea value={nd} onChange={(e) => setNd(e.target.value)} className={`${inp} min-h-[56px] font-mono text-[13px]`} />
            : <div className="text-[15px] leading-relaxed text-slate-800"><MathText>{nd}</MathText></div>}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px]">
            <button onClick={() => setSuaNd((v) => !v)} className="font-medium text-slate-400 hover:text-indigo-600">{suaNd ? '✓ Xong' : '✎ Sửa nội dung'}</button>
            <span className="text-slate-300">|</span>
            <div className="inline-flex overflow-hidden rounded-lg border border-slate-200">
              <button onClick={() => setDung(true)} disabled={dis} className={`px-2.5 py-0.5 font-medium ${dung ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Đúng</button>
              <button onClick={() => setDung(false)} disabled={dis} className={`px-2.5 py-0.5 font-medium ${!dung ? 'bg-rose-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Sai</button>
            </div>
            {doiDung && <span className="text-indigo-600">đã đổi Đ/S</span>}
            <span className="text-slate-300">|</span>
            <button onClick={() => setPick(true)} disabled={dis} title={thieuDang ? 'Mệnh đề chưa có dạng hợp lệ — chọn dạng' : 'Đổi dạng của mệnh đề này'}
              className={`rounded-md border px-2 py-0.5 text-left font-medium hover:border-indigo-400 hover:bg-indigo-50 ${thieuDang ? 'border-amber-400 bg-amber-50 text-amber-800' : doiDang ? 'border-indigo-400 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-700'}`}>
              {dang ? <>📁 {dang.cd ? <span className="text-slate-400">{dang.cd} › </span> : null}{dang.ten} <code className="ml-1 text-[11px] text-slate-400">{dang.ma}</code></>
                : <>⚠ chưa gán dạng{h.ma_dang ? <> · <code className="text-[11px] line-through">{h.ma_dang}</code> không còn trong bản đồ</> : null}</>}
            </button>
            {con?.dang_ai_de_xuat && con.dang_ai_de_xuat !== (dang?.ma ?? '') && <span className="text-slate-400" title="Dạng AI/gốc gán lúc vào kho">gốc: <code>{con.dang_ai_de_xuat}</code></span>}
            <span className="text-slate-300">|</span>
            <button onClick={() => setSuaLg((v) => !v)} className="font-medium text-slate-400 hover:text-indigo-600">{suaLg ? '✓ Xong lời giải' : lg ? '✎ Lời giải' : '+ Lời giải'}</button>
          </div>
          {suaLg ? <div className="mt-1.5"><SolutionField value={lg} onChange={setLg} taClassName={`${inp} min-h-[90px] font-mono text-[13px]`} /></div>
            : lg ? <div className="mt-1.5 rounded-md bg-slate-50/70 px-2.5 py-1.5 text-[13px] text-slate-700"><MathText>{lg}</MathText></div> : null}
          {err && <p className="mt-1.5 text-xs text-rose-600">{err}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <button onClick={onDuyet} disabled={dis || !nd.trim() || !dang}
            className={`rounded-md px-3 py-1 text-[12px] font-medium shadow-sm disabled:opacity-40 ${daDuyet ? 'bg-white text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-50' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
            {busy ? '⏳…' : daDuyet ? '✓ Đã duyệt' : coSua ? '✓ Lưu sửa + Duyệt' : '✓ Duyệt'}
          </button>
          {con?.duyet_at && !coSua && <span className="text-[11px] text-slate-400">{fmtTs(con.duyet_at)}</span>}
        </div>
      </div>
      {pick && (
        <DangPickerOne khoi={r.khoi} mon={mon} nhanh={r.mon === 'hgt' ? NHANH_HGT : null}
          onClose={() => setPick(false)}
          onPick={(maDang) => { setDang(maDang === con?.dang_chinh && con ? { ma: con.dang_chinh, ten: con.ten_dang, cd: con.ten_chuyen_de } : { ma: maDang, ten: maDang, cd: '' }); setPick(false) }} />
      )}
    </li>
  )
}
