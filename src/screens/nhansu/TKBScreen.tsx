import { useEffect, useState } from 'react'
import { listAllTKB, listLop, addTKB, dongTKB, suaHieuLucTKB, type TKBSlot, type Lop } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'
import { Shell, Field, inp } from '../kho/ui'

const THU_COLS = [2, 3, 4, 5, 6, 7, 8]
const THU_LABEL: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'CN' }
// 6 phòng vị trí CỐ ĐỊNH trong ô ca: 3 cột × 2 hàng (P101 P102 P201 / P202 P301 P302)
const ROOMS = ['P101', 'P102', 'P201', 'P202', 'P301', 'P302']
const MON_TONE: Record<string, string> = { 'Toán': 'border-indigo-400 bg-indigo-50 text-indigo-900', 'Văn': 'border-rose-400 bg-rose-50 text-rose-900', 'Anh': 'border-emerald-400 bg-emerald-50 text-emerald-900', 'KHTN': 'border-amber-400 bg-amber-50 text-amber-900' }
const monTone = (mon?: string) => (mon && MON_TONE[mon]) || 'border-slate-300 bg-slate-50 text-slate-700'
const hhmm = (t: string) => t.slice(0, 5)
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

// Khung lớn cố định của 1 ngày (lo/hi = phút; ca thuộc khung nếu giờ BẮT ĐẦU ∈ [lo, hi)).
// macDinh = giờ gợi ý khi xếp ca mới từ khung này. an = ẩn khi rỗng (giờ trưa).
type Band = { ten: string; lo: number; hi: number; macDinh: [string, string]; an?: boolean }
const BANDS: Band[] = [
  { ten: '7:30\n10:00', lo: 0, hi: 600, macDinh: ['07:30', '09:30'] },
  { ten: '10:00\n12:00', lo: 600, hi: 720, macDinh: ['10:00', '11:30'] },
  { ten: '12:00\n14:00', lo: 720, hi: 840, macDinh: ['12:00', '13:30'], an: true },
  { ten: '14:00\n16:00', lo: 840, hi: 960, macDinh: ['14:00', '16:00'] },
  { ten: '16:00\n18:00', lo: 960, hi: 1080, macDinh: ['16:00', '18:00'] },
  { ten: '18:00\n19:30', lo: 1080, hi: 1170, macDinh: ['18:00', '19:30'] },
  { ten: '19:30\n21:30', lo: 1170, hi: 1440, macDinh: ['19:30', '21:00'] },
]

// TKB = LƯỚI CA RỜI RẠC (đúng bản chất trường học: ca × phòng × lớp — categorical, KHÔNG phải calendar
// liên tục; độ dài ca nằm trong nhãn giờ, không cần tỷ lệ pixel). Hàng = khung ca có thật, cột = thứ.
// Mỗi ô = lưới phòng 3×2 vị trí cố định; phòng trống = chừa trống. Cả bảng gọn 1 màn hình.
export default function TKBScreen() {
  const [slots, setSlots] = useState<TKBSlot[]>([])
  const [dsLop, setDsLop] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sel, setSel] = useState<TKBSlot | null>(null)
  const [adding, setAdding] = useState<{ thu: number; tu: string; den: string } | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { const [s, l] = await Promise.all([listAllTKB(), listLop()]); setSlots(s); setDsLop(l) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  // KHUNG LỚN CANONICAL (Thùy chốt): ngày chia ~7 khung cố định; ca xếp vào khung theo GIỜ BẮT ĐẦU
  // (bỏ qua giờ kết thúc — biên khung trùng giờ vào ca nên không có ca vắt khung).
  // Khung 12–14 gần như không dùng → tự ẩn khi rỗng (có ca thì tự hiện lại).
  const slotsInBand = (band: Band, thu: number) =>
    slots.filter((s) => s.thu === thu && toMin(s.gio_bat_dau) >= band.lo && toMin(s.gio_bat_dau) < band.hi)
  const bands = BANDS.filter((b) => !b.an || THU_COLS.some((t) => slotsInBand(b, t).length > 0))

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2">
        <span className="text-sm font-semibold text-slate-900">Thời khóa biểu</span>
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">{slots.length} ca / tuần</span>
        <span className="ml-auto text-[12px] text-slate-400">Click card để sửa · ô trống click để xếp ca</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 pb-3 pt-2">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : slots.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có ca nào.</div>
          : (
            <table className="w-full table-fixed border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-10"></th>
                  {THU_COLS.map((t) => <th key={t} className="rounded-md bg-slate-800 py-1 text-[12px] font-semibold uppercase tracking-wider text-white">{THU_LABEL[t]}</th>)}
                </tr>
              </thead>
              <tbody>
                {bands.map((band) => (
                  <tr key={band.ten}>
                    <td className="rounded-md bg-white px-1 py-1 text-center align-middle">
                      <div className="text-[12px] font-bold leading-tight text-slate-700">{band.ten.split('\n')[0]}</div>
                      <div className="text-[10px] leading-tight text-slate-400">{band.ten.split('\n')[1]}</div>
                    </td>
                    {THU_COLS.map((thu) => {
                      const cell = slotsInBand(band, thu)
                      return (
                        <td key={thu} className="rounded-md bg-white p-1 align-middle">
                          {/* lưới phòng 3 cột × 2 hàng CỐ ĐỊNH — ô trống hiện mờ, click xếp ca vào đúng phòng */}
                          <div className="grid grid-cols-3 grid-rows-2 gap-1">
                            {ROOMS.map((phong) => {
                              const s = cell.find((x) => (x.phong ?? '') === phong) ?? (phong === ROOMS[5] ? cell.find((x) => !ROOMS.includes(x.phong ?? '')) : undefined)
                              return s ? (
                                <button key={phong} onClick={() => setSel(s)}
                                  className={`rounded-md border-[1.5px] px-0.5 py-0.5 text-center shadow-sm transition hover:shadow ${monTone(s.lop?.mon)}`}
                                  title={`${s.lop?.ten_lop} · ${hhmm(s.gio_bat_dau)}–${hhmm(s.gio_ket_thuc)} · ${s.phong ?? ''}`}>
                                  <div className="text-[13px] font-bold leading-tight">{s.lop?.ten_lop ?? '?'}</div>
                                  {/* giờ THẬT của ca — khung hàng chỉ là nhãn thô */}
                                  <div className="text-[8px] leading-tight opacity-70">{hhmm(s.gio_bat_dau)}–{hhmm(s.gio_ket_thuc)}</div>
                                  <div className="text-[8px] leading-tight opacity-60">{s.phong ?? '—'}</div>
                                </button>
                              ) : (
                                <button key={phong} onClick={() => setAdding({ thu, tu: band.macDinh[0], den: band.macDinh[1] })}
                                  title={`Xếp ca · ${THU_LABEL[thu]} ${band.ten.replace('\n', '–')} · ${phong}`}
                                  className="rounded-md border border-dashed border-slate-200/80 py-1 text-center text-[8px] text-slate-300 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-400">
                                  {phong}
                                </button>
                              )
                            })}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {sel && <SlotModal s={sel} onClose={() => setSel(null)} onChanged={() => { setSel(null); reload() }} />}
      {adding && <AddModal thu={adding.thu} tu={adding.tu} den={adding.den} dsLop={dsLop} onClose={() => setAdding(null)} onAdded={() => { setAdding(null); reload() }} />}
    </div>
  )
}

function SlotModal({ s, onClose, onChanged }: { s: TKBSlot; onClose: () => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const [hieuLucTu, setHieuLucTu] = useState(s.hieu_luc_tu)
  const [error, setError] = useState<string | null>(null)
  return (
    <Shell title={`${s.lop?.ten_lop ?? '?'} · ${THU_LABEL[s.thu]} ${hhmm(s.gio_bat_dau)}–${hhmm(s.gio_ket_thuc)}`} onClose={onClose}>
      <p className="mb-3 text-sm text-slate-600">Môn {s.lop?.mon ?? '—'} · phòng <b>{s.phong ?? '—'}</b></p>
      <Field label="Hiệu lực từ (ngày khai giảng / bắt đầu áp khung này)">
        <input type="date" value={hieuLucTu} onChange={(e) => setHieuLucTu(e.target.value)} className={inp} />
      </Field>
      <p className="mb-3 text-[12px] text-slate-400">Trước ngày này hệ thống KHÔNG sinh buổi học cho ca — đây là "công tắc khai giảng". Đổi giờ/phòng = ngừng ca này rồi xếp ca mới (giữ vết).</p>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex items-center justify-between">
        <button disabled={busy} onClick={async () => { if (!confirm('Ngừng ca này từ hôm nay?')) return; setBusy(true); try { await dongTKB(s.id, today()); onChanged() } catch (e: any) { setError(e.message); setBusy(false) } }}
          className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">Ngừng ca này</button>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button disabled={busy || hieuLucTu === s.hieu_luc_tu} onClick={async () => { setBusy(true); try { await suaHieuLucTKB(s.id, { hieu_luc_tu: hieuLucTu }); onChanged() } catch (e: any) { setError(e.message); setBusy(false) } }}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </Shell>
  )
}

function AddModal({ thu, tu, den, dsLop, onClose, onAdded }: { thu: number; tu: string; den: string; dsLop: Lop[]; onClose: () => void; onAdded: () => void }) {
  const [lopId, setLopId] = useState('')
  const [gioTu, setGioTu] = useState(tu)
  const [gioDen, setGioDen] = useState(den)
  const [phong, setPhong] = useState(ROOMS[0])
  const [hieuLucTu, setHieuLucTu] = useState(today())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function add() {
    if (!lopId) return
    setBusy(true); setError(null)
    try { await addTKB({ lop_id: lopId, thu, gio_bat_dau: gioTu, gio_ket_thuc: gioDen, phong, hieu_luc_tu: hieuLucTu, hieu_luc_den: null }); onAdded() }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Xếp ca · ${THU_LABEL[thu]} ${tu}–${den}`} onClose={onClose}>
      <Field label="Lớp">
        <SearchSelect value={lopId || null} onChange={(id) => setLopId(id ?? '')} autoFocus placeholder="Gõ tên lớp…"
          options={dsLop.filter((l) => l.trang_thai === 'dang_hoc').map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} />
      </Field>
      <Field label="Phòng">
        <div className="flex gap-1.5">
          {ROOMS.map((p) => (
            <button key={p} type="button" onClick={() => setPhong(p)}
              className={`h-9 flex-1 rounded-lg border text-[13px] font-semibold transition ${phong === p ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{p}</button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Giờ bắt đầu"><input type="time" value={gioTu} onChange={(e) => setGioTu(e.target.value)} className={inp} /></Field>
        <Field label="Giờ kết thúc"><input type="time" value={gioDen} onChange={(e) => setGioDen(e.target.value)} className={inp} /></Field>
      </div>
      <Field label="Hiệu lực từ (ngày bắt đầu áp — trước đó không sinh buổi)">
        <input type="date" value={hieuLucTu} onChange={(e) => setHieuLucTu(e.target.value)} className={inp} />
      </Field>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={add} disabled={!lopId || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Xếp ca'}</button>
      </div>
    </Shell>
  )
}
