// Tab "Chưa có lời giải" (Thùy 04/09) trong màn Duyệt lời giải AI — danh sách BÀI trong kho CHƯA CÓ lời giải
// của MÔN đang chọn (registry KHO_MON — Toán = Đại + Hình giải tích + Hình; KHTN = 1 cây; KHÔNG trộn môn, Thùy 04/09:
// "KHTN là MÔN, ai phụ trách môn nào mới thấy môn đó"). Câu kho: loi_giai NULL và anh_dap_an NULL. HÌNH: bài toán gốc
// chưa có cách giải nào có nội dung · biến thể chưa có loi_giai/anh_loi_giai — "khác chỗ mô hình nhưng cuối cùng vẫn
// là từng bài một". Thanh lọc NHÁNH (chỉ hiện khi môn có >1 nhánh); nhóm theo dạng (kho) / mô hình (Hình).
// Mỗi bài 2 lựa chọn:
//   (1) ✍️ Tự giải: gõ lời giải (chèn ảnh được) và/hoặc up ảnh lời giải ngay tại chỗ → nguon_giai='nguoi'.
//   (2) 📥 Đặt Claude giải: đưa vào hàng đợi (`{dai,khtn,hgt}_cau_hoi_yeu_cau_giai` · `hinh_{baitoan,bien_the}_yeu_cau_giai`)
//       — Claude Code xử lý theo lô (scripts/hangdoi-giai.mjs), kết quả về tab "Lời giải mới từ Claude" để duyệt.
// List/đặt/đóng = function Postgres (mig 202609041808/1811/1826/1835) — ở đây chỉ gọi rpc + render (§2.0).
import { useEffect, useRef, useState } from 'react'
import { listCauChuaGiaiTab, datClaudeGiai, huyYeuCauGiai, luuLoiGiaiNguoi, LOAI_CAU, NHANH_LABEL, nhanhCuaMon, type CauChuaGiai, type KhoMon, type KhoNhanh } from '../../lib/kho/api'
import { listHinhChuaGiai, datClaudeGiaiHinh, huyYeuCauGiaiHinh, luuLoiGiaiNguoiHinh, type HinhChuaGiai, type HinhLoaiBai } from '../../lib/kho/hinh'
import { MathText } from '../kho/ui'
import { SolutionField, ImageSlot } from '../kho/DangHub'
import { myNhanSuId } from '../../lib/giaoviec'

type Nhanh = KhoNhanh
const LOAI_LABEL = Object.fromEntries(LOAI_CAU.map((x) => [x.value, x.label])) as Record<string, string>
const KIEU_LABEL: Record<string, string> = { doi_so: 'Biến thể đổi số', doi_dinh: 'Biến thể đổi đỉnh', ca_hai: 'Biến thể đổi số + đỉnh' }
const fmtTs = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

// 1 dòng hiển thị chung cho cả 2 kiểu nguồn — khoá tự nhiên giữ nguyên (ma_cau / id) để thao tác, không dùng vị trí.
type Row = {
  key: string; nhanh: Nhanh; groupKey: string; groupLabel: { truoc: string; ten: string; ma: string }
  ma: string; nhan: string; laClone: boolean
  giaThiet: string | null; deBai: string; anh: string | null; luaChon: string[] | null; menhDe: CauChuaGiai['menh_de']; dapAn: string | null
  yeuCauId: string | null; yeuCauAt: string | null; yeuCauGhiChu: string | null
  yeuCauNguoi: string | null // ≠ null = NGƯỜI đang giữ bài trên tool giaibai (mig 202609060122) — không phải Claude, không huỷ ở đây
  src: { kind: 'kho'; mon: KhoMon; maCau: string; coDapAn: boolean } | { kind: 'hinh'; loai: HinhLoaiBai; id: string }
}
const tuKho = (mon: KhoMon, r: CauChuaGiai): Row => ({
  key: `${mon}:${r.ma_cau}`, nhanh: mon, groupKey: `${mon}:${r.dang_chinh}`,
  groupLabel: { truoc: r.ten_chuyen_de, ten: r.ten_dang, ma: r.dang_chinh },
  ma: r.ma_cau, nhan: LOAI_LABEL[r.loai_cau] ?? r.loai_cau, laClone: r.nguon === 'clone',
  giaThiet: null, deBai: r.noi_dung, anh: r.anh_de, luaChon: r.lua_chon, menhDe: r.menh_de, dapAn: r.dap_an,
  yeuCauId: r.yeu_cau_id, yeuCauAt: r.yeu_cau_at, yeuCauGhiChu: r.yeu_cau_ghi_chu, yeuCauNguoi: r.yeu_cau_nguoi_giai_ten,
  src: { kind: 'kho', mon, maCau: r.ma_cau, coDapAn: !!r.dap_an },
})
const tuHinh = (r: HinhChuaGiai): Row => ({
  key: `hinh:${r.loai}:${r.id}`, nhanh: 'hinh', groupKey: `hinh:${r.mo_hinh_ma}`,
  groupLabel: { truoc: 'Mô hình', ten: r.mo_hinh_ten, ma: r.mo_hinh_ma },
  ma: r.ma, nhan: r.loai === 'baitoan' ? 'Bài toán gốc' : (KIEU_LABEL[r.kieu ?? ''] ?? 'Biến thể'), laClone: false,
  giaThiet: r.gia_thiet || null, deBai: r.de_bai, anh: r.anh, luaChon: null, menhDe: null, dapAn: null,
  yeuCauId: r.yeu_cau_id, yeuCauAt: r.yeu_cau_at, yeuCauGhiChu: r.yeu_cau_ghi_chu, yeuCauNguoi: r.yeu_cau_nguoi_giai_ten,
  src: { kind: 'hinh', loai: r.loai, id: r.id },
})

// mon = NHÃN MÔN đang chọn ở màn cha ('Toán'/'KHTN' — nhan_su_mon). Tab chỉ tải/hiện các NHÁNH của môn đó
// (registry KHO_MON) — không bao giờ trộn môn (Thùy 04/09).
export default function ChuaGiaiTab({ mon, khoi, onChanged }: { mon: string; khoi: string; onChanged?: () => void }) {
  const NHANH_ALL = nhanhCuaMon(mon)
  const MON = NHANH_ALL.filter((n): n is KhoMon => n !== 'hinh')
  const coHinh = NHANH_ALL.includes('hinh')
  const [all, setAll] = useState<Row[]>([])
  const [nhanh, setNhanh] = useState<Nhanh | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [ghiChu, setGhiChu] = useState('')
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null) // bài đang mở panel tự giải
  const reqId = useRef(0) // guard race khi đổi khối liên tiếp (như DuyetLoiGiaiScreen)

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null)
    try {
      const [kho, hinh] = await Promise.all([Promise.all(MON.map((m) => listCauChuaGiaiTab(m, khoi))), coHinh ? listHinhChuaGiai(khoi) : Promise.resolve([])])
      if (my !== reqId.current) return
      setAll([...MON.flatMap((m, i) => kho[i].map((r) => tuKho(m, r))), ...hinh.map(tuHinh)])
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  useEffect(() => { setAll([]); setOpenKey(null); setNhanh('all'); reload() }, [khoi, mon]) // eslint-disable-line

  const rows = nhanh === 'all' ? all : all.filter((r) => r.nhanh === nhanh)
  const demNhanh = (n: Nhanh) => all.filter((r) => r.nhanh === n).length // đếm item đang render (badge chip)

  // Đặt Claude: dispatch theo nguồn — kho (mon, ma_cau[]) / Hình (loai, id[]).
  async function datLo(ds: Row[], nguoi: string): Promise<number> {
    let n = 0
    for (const m of MON) {
      const ids = ds.filter((r) => r.src.kind === 'kho' && r.src.mon === m).map((r) => (r.src as { maCau: string }).maCau)
      if (ids.length) n += await datClaudeGiai(m, ids, ghiChu.trim(), nguoi)
    }
    for (const loai of ['baitoan', 'bien_the'] as HinhLoaiBai[]) {
      const ids = ds.filter((r) => r.src.kind === 'hinh' && r.src.loai === loai).map((r) => (r.src as { id: string }).id)
      if (ids.length) n += await datClaudeGiaiHinh(loai, ids, ghiChu.trim(), nguoi)
    }
    return n
  }
  async function onDat(r: Row) {
    setBusyKey(r.key)
    try {
      const n = await datLo([r], await myNhanSuId())
      if (n === 0) alert('Bài này đã có yêu cầu đang treo hoặc đã có lời giải — tải lại danh sách.')
      await reload(); onChanged?.()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyKey(null) }
  }
  async function onDatTatCa() {
    const chuaDat = rows.filter((r) => !r.yeuCauId)
    const nhan = nhanh === 'all' ? 'mọi nhánh' : NHANH_LABEL[nhanh]
    if (!chuaDat.length || !confirm(`Đặt Claude giải ${chuaDat.length} bài chưa đặt (${nhan}, khối ${khoi})?`)) return
    setBusyAll(true)
    try { await datLo(chuaDat, await myNhanSuId()); await reload(); onChanged?.() }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyAll(false) }
  }
  async function onHuy(r: Row) {
    if (!r.yeuCauId) return
    setBusyKey(r.key)
    try {
      if (r.src.kind === 'kho') await huyYeuCauGiai(r.src.mon, r.yeuCauId); else await huyYeuCauGiaiHinh(r.src.loai, r.yeuCauId)
      setAll((a) => a.map((x) => (x.key === r.key ? { ...x, yeuCauId: null, yeuCauAt: null, yeuCauGhiChu: null, yeuCauNguoi: null } : x)))
      onChanged?.()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyKey(null) }
  }
  function onGiaiXong(r: Row) { setAll((a) => a.filter((x) => x.key !== r.key)); setOpenKey(null); onChanged?.() }

  const soDaDat = rows.filter((r) => r.yeuCauId).length
  // Nhóm theo dạng (kho) / mô hình (Hình) để quét mắt — giữ thứ tự DB.
  const groups: { key: string; head: Row; items: Row[] }[] = []
  for (const r of rows) {
    const g = groups[groups.length - 1]
    if (g && g.key === r.groupKey) g.items.push(r); else groups.push({ key: r.groupKey, head: r, items: [r] })
  }
  const chip = (n: Nhanh | 'all', label: string, count: number) => (
    <button key={n} onClick={() => setNhanh(n)}
      className={`rounded-full px-3 py-0.5 text-[12px] font-medium transition ${nhanh === n ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'} ${count === 0 && n !== 'all' ? 'opacity-50' : ''}`}>
      {label} <span className={nhanh === n ? 'text-violet-200' : 'text-slate-400'}>{count}</span>
    </button>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        {NHANH_ALL.length > 1 && (
          <div className="flex items-center gap-1.5">
            {chip('all', 'Tất cả', all.length)}
            {NHANH_ALL.map((n) => chip(n, NHANH_LABEL[n], demNhanh(n)))}
          </div>
        )}
        <span className="text-[12px] text-slate-500">
          <b className="text-slate-800">{rows.length}</b> bài chưa có lời giải · <b className="text-violet-700">{soDaDat}</b> đã đặt Claude
        </span>
        <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú gửi Claude khi đặt (tuỳ chọn) — vd: trình bày theo mẫu SGK, bám đáp án có sẵn…"
          className="min-w-[240px] flex-1 rounded-md border border-slate-200 px-2.5 py-1 text-[13px] focus:border-violet-400 focus:outline-none" />
        <button onClick={onDatTatCa} disabled={busyAll || rows.length - soDaDat === 0}
          title="Đưa mọi bài chưa đặt (đang lọc) vào hàng đợi cho Claude Code giải theo lô"
          className="rounded-md border border-violet-300 bg-violet-50 px-3.5 py-1.5 text-[13px] font-medium text-violet-700 shadow-sm hover:bg-violet-100 disabled:opacity-40">
          {busyAll ? '⏳ Đang đặt…' : `📥 Đặt Claude giải tất cả chưa đặt (${rows.length - soDaDat})`}
        </button>
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Khối {khoi}{nhanh !== 'all' ? ` · ${NHANH_LABEL[nhanh]}` : ''}: mọi bài đều đã có lời giải. 🎉</p>
          : groups.map((g) => (
            <section key={g.key} className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-500">
                <span className={`rounded px-2 py-0.5 font-medium ${g.head.nhanh === 'hinh' ? 'bg-sky-50 text-sky-700' : 'bg-violet-50 text-violet-700'}`}>{NHANH_LABEL[g.head.nhanh]}</span>
                <span className="text-slate-400">{g.head.groupLabel.truoc} ›</span>
                <span className="font-semibold text-slate-700">{g.head.groupLabel.ten}</span>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">{g.head.groupLabel.ma}</code>
                <span className="text-slate-400">· {g.items.length} bài</span>
              </div>
              <ul className="space-y-3">
                {g.items.map((r) => (
                  <li key={r.key} className={`rounded-xl border bg-white p-4 shadow-sm ${r.yeuCauId ? 'border-violet-200' : 'border-slate-200'}`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{r.ma}</code>
                      <span>{r.nhan}</span>
                      {r.laClone && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">clone</span>}
                      {r.yeuCauId && r.yeuCauNguoi ? (
                        <span className="rounded bg-sky-50 px-2 py-0.5 font-medium text-sky-700" title="Đang giữ trên tool giaibai.bkacademy.edu.vn — người đó nộp, học thuật duyệt bên đó">
                          🧑 {r.yeuCauNguoi} đang giải · {r.yeuCauAt ? fmtTs(r.yeuCauAt) : ''}
                        </span>
                      ) : r.yeuCauId ? (
                        <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700" title={r.yeuCauGhiChu ?? undefined}>
                          📥 Đã đặt Claude · {r.yeuCauAt ? fmtTs(r.yeuCauAt) : ''}{r.yeuCauGhiChu ? ` · “${r.yeuCauGhiChu}”` : ''}
                        </span>
                      ) : null}
                      <div className="ml-auto flex items-center gap-1.5">
                        {r.yeuCauId && r.yeuCauNguoi ? null : r.yeuCauId ? (
                          <button onClick={() => onHuy(r)} disabled={busyKey === r.key || busyAll}
                            className="rounded-md px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">{busyKey === r.key ? '⏳…' : '✕ Huỷ đặt'}</button>
                        ) : (
                          <button onClick={() => onDat(r)} disabled={busyKey === r.key || busyAll}
                            title="Không gọi API ngay — Claude Code giải theo lô sau, kết quả vào tab “Lời giải mới từ Claude”"
                            className="rounded-md border border-violet-300 bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40">{busyKey === r.key ? '⏳…' : '📥 Đặt Claude giải'}</button>
                        )}
                        <button onClick={() => setOpenKey(openKey === r.key ? null : r.key)} disabled={busyAll || !!r.yeuCauNguoi} title={r.yeuCauNguoi ? `${r.yeuCauNguoi} đang giữ bài này trên tool giải bài` : undefined}
                          className={`rounded-md px-2.5 py-1 text-[12px] font-medium shadow-sm disabled:opacity-40 ${openKey === r.key ? 'bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                          {openKey === r.key ? 'Đóng' : '✍️ Tự giải / up ảnh'}
                        </button>
                      </div>
                    </div>
                    <div className={`text-[14px] text-slate-800 ${r.anh ? 'grid grid-cols-[1fr_auto] gap-4' : ''}`}>
                      <div>
                        {r.giaThiet && <div className="mb-1 whitespace-pre-line text-[13px] text-slate-600"><span className="font-medium text-slate-500">Giả thiết: </span><MathText>{r.giaThiet}</MathText></div>}
                        <MathText>{r.deBai}</MathText>
                        {r.luaChon && (
                          <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
                            {r.luaChon.map((o, i) => <li key={i}>{String.fromCharCode(65 + i)}. <MathText>{o}</MathText></li>)}
                          </ul>
                        )}
                        {r.menhDe && (
                          <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
                            {r.menhDe.map((m, i) => <li key={i}>{String.fromCharCode(97 + i)}) <MathText>{m.noi_dung}</MathText> <span className="text-slate-400">[{m.dap_an}]</span></li>)}
                          </ul>
                        )}
                        {r.dapAn && <div className="mt-1.5 text-[13px]"><span className="font-medium text-slate-500">Đáp án có sẵn: </span><MathText>{r.dapAn}</MathText></div>}
                      </div>
                      {r.anh && <img src={r.anh} alt="hình" className="max-h-52 w-auto max-w-[260px] self-start rounded-lg border border-slate-200" />}
                    </div>
                    {openKey === r.key && <GiaiPanel row={r} onDone={() => onGiaiXong(r)} onCancel={() => setOpenKey(null)} />}
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  )
}

// Panel tự giải tại chỗ: lời giải text (SolutionField — chèn/dán ảnh vào giữa được) + ảnh lời giải riêng
// (ImageSlot, cùng ô "Ảnh giải" của CauEditor) + đáp án (câu kho chưa có đáp án). Lưu cần ÍT NHẤT 1 trong 2:
// text hoặc ảnh. DB đóng dấu nguon_giai='nguoi' + gỡ yêu cầu Claude treo (fn_kho_giai_nguoi_xong / fn_hinh_luu_loi_giai_nguoi).
function GiaiPanel({ row, onDone, onCancel }: { row: Row; onDone: () => void; onCancel: () => void }) {
  const [loiGiai, setLoiGiai] = useState('')
  const [anh, setAnh] = useState<string | null>(null)
  const [dapAn, setDapAn] = useState(row.dapAn ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ok = !!loiGiai.trim() || !!anh
  const hoiDapAn = row.src.kind === 'kho' && !row.src.coDapAn
  async function save() {
    if (!ok) return
    setSaving(true); setError(null)
    try {
      if (row.src.kind === 'kho') await luuLoiGiaiNguoi(row.src.mon, row.src.maCau, { loiGiai: loiGiai.trim() || null, anhDapAn: anh, dapAn: hoiDapAn ? dapAn.trim() || null : undefined })
      else await luuLoiGiaiNguoiHinh(row.src.loai, row.src.id, { loiGiai: loiGiai.trim() || null, anh })
      onDone()
    } catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }
  return (
    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="flex min-h-0 flex-col">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Lời giải (gõ LaTeX, chèn ảnh được)</div>
          <SolutionField value={loiGiai} onChange={setLoiGiai} taClassName="min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[13px] focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="flex w-[260px] flex-col gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Ảnh lời giải</div>
          <ImageSlot url={anh} label="Ảnh giải" onChange={setAnh} />
          {hoiDapAn && (
            <>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Đáp án (tuỳ chọn)</div>
              <input value={dapAn} onChange={(e) => setDapAn(e.target.value)} className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] focus:border-emerald-400 focus:outline-none" />
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="mr-auto text-[12px] text-slate-400">
          Cần ít nhất lời giải text HOẶC ảnh. Lưu xong bài rời danh sách này (nguồn = người, không cần duyệt).
          {row.src.kind === 'hinh' && row.src.loai === 'baitoan' ? ' Bài toán gốc: lời giải thành CÁCH GIẢI mặc định của node (điền vào cách rỗng sẵn có nếu có).' : ''}
        </span>
        <button onClick={onCancel} disabled={saving} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={save} disabled={!ok || saving} className="rounded-md bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">{saving ? 'Đang lưu…' : '✓ Lưu lời giải'}</button>
      </div>
    </div>
  )
}
