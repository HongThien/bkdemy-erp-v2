// Màn "Xếp bổ trợ yếu" (bước 6 — PLAN-botro-yeu.md). Case đã chọn dạng (bước 4) hiện ở đây để OPS
// chốt ngày/giờ/phòng/người dạy với phụ huynh. Buổi = `buoi_hoc(loai='bo_tro_yeu')`, đối xứng buổi
// bù — "Việc của tôi" tự nhận qua `nguoi_day_tg` (getMyTasks, gami.ts), KHÔNG cần bảng viec riêng.
//
// ⭐ Thùy 09-02: bấm card = RA THẲNG FORM xếp (ngày · giờ · phòng · người), mặc định theo MỨC:
//   · Mức 1 (trước/sau giờ): ngày = buổi học THƯỜNG của lớp em (TKB), mặc định buổi tiếp theo; giờ =
//     ngay sau giờ tan (60'); phòng = phòng lớp; người = TA chính lớp. Không đúng thì người xếp sửa.
//   · Mức 2/3 (buổi riêng): mặc định giống ca bổ trợ yếu GẦN NHẤT em đã học; chưa có thì trống.
//     Mức 3 = ĐỔI NGƯỜI (GV cao cấp, PLAN §0 mục 4) nên KHÔNG kéo người của ca cũ (TA) sang.
// Phòng: danh mục thật `phong` + báo trùng qua `kiemTraTrungPhong` (dự án phòng học đã xong — thay
// mảng ROOMS tạm của PLAN §0 mục 9). Báo trùng = CẢNH BÁO, không chặn (OPS tự quyết với PH).
import { useEffect, useMemo, useState } from 'react'
import {
  listCaseChoXepLich, taoBuoiBoTroYeu, listBuoiCuaCase, goiYXepLichBoTroYeu,
  type CaseChoXep, type BuoiBoTroYeuDaXep, type GoiYXepLich,
} from '../../lib/botro_yeu'
import { getLevels } from '../../lib/danhgia'
import { huyBuoi } from '../../lib/gami'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listPhong, kiemTraTrungPhong, type Phong, type KhoiBanPhong } from '../../lib/phong'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import SearchSelect from '../../components/SearchSelect'

const MUC_TEN: Record<number, string> = { 1: 'Mức 1 · trước/sau giờ', 2: 'Mức 2 · buổi riêng (TA)', 3: 'Mức 2 · buổi riêng (GV cao cấp)' }
const MUC_CLS: Record<number, string> = { 1: 'bg-slate-100 text-slate-600', 2: 'bg-amber-50 text-amber-700', 3: 'bg-rose-50 text-rose-700' }
const THOI_LUONG_MAC_DINH = 60 // phút — cùng mặc định với buổi bù (BoTroScreen `cong60`)

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
function congPhut(hhmmStr: string, phut: number): string {
  const [h, m] = hhmmStr.split(':').map(Number)
  const tong = h * 60 + m + phut
  return `${String(Math.floor(tong / 60) % 24).padStart(2, '0')}:${String(tong % 60).padStart(2, '0')}`
}
// Giờ gõ CHỮ (Thùy 09-03: picker giờ của trình duyệt khó chịu) — nhận "19:30" · "1930" · "19h30" · "7:30" → "HH:MM";
// sai định dạng → null (báo lỗi lúc xác nhận, không âm thầm lưu rác).
function chuanHoaGio(s: string): string | null {
  const t = s.trim().toLowerCase().replace(/h|g|\./g, ':').replace(/\s+/g, '')
  if (!t) return null
  const m = t.match(/^(\d{1,2}):?(\d{2})$/)
  if (!m) return null
  const h = Number(m[1]), mi = Number(m[2])
  if (h > 23 || mi > 59) return null
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`
}
const soNgayCach = (a: string, b: string) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000)

export default function XepLichBoTroYeuScreen() {
  const [items, setItems] = useState<CaseChoXep[]>([])
  const [muc, setMuc] = useState<Map<string, number>>(new Map()) // hoc_sinh_id → level kiến thức
  const [loading, setLoading] = useState(true)
  const [moId, setMoId] = useState<string | null>(null)

  const reload = () => {
    setLoading(true)
    listCaseChoXepLich().then(async (r) => {
      setItems(r)
      const byMon = new Map<string, string[]>()
      for (const c of r) byMon.set(c.mon, [...(byMon.get(c.mon) ?? []), c.hoc_sinh_id])
      const m = new Map<string, number>()
      for (const [mon, ids] of byMon) {
        const lv = await getLevels(ids, mon)
        for (const id of ids) m.set(id, lv.get(id)?.kien_thuc ?? 0)
      }
      setMuc(m)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { reload() }, [])

  const choXep = useMemo(() => items.filter((c) => !c.daXep), [items])
  const daXep = useMemo(() => items.filter((c) => c.daXep), [items])
  const moCase = items.find((c) => c.id === moId) ?? null

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1000px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Xếp bổ trợ yếu</h1>
          <p className="mt-1 text-[13px] text-slate-500">Case đã chọn dạng — bấm vào ca để chốt ngày, giờ, phòng, người bổ trợ với phụ huynh.</p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            Chưa có case nào sẵn sàng — cần chọn dạng ở "Nội dung bổ trợ yếu" trước.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-slate-500">Chờ xếp lịch ({choXep.length})</h2>
              <div className="space-y-3">
                {choXep.map((c) => (
                  <CaseCard key={c.id} c={c} mucLv={muc.get(c.hoc_sinh_id) ?? 0} onMo={() => setMoId(c.id)} />
                ))}
                {choXep.length === 0 && <p className="text-[12px] text-slate-400">Không còn case nào.</p>}
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-slate-500">Đã xếp ({daXep.length})</h2>
              <div className="space-y-3">
                {daXep.map((c) => (
                  <CaseCard key={c.id} c={c} mucLv={muc.get(c.hoc_sinh_id) ?? 0} onMo={() => setMoId(c.id)} daXep />
                ))}
                {daXep.length === 0 && <p className="text-[12px] text-slate-400">Chưa có case nào.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
      {moCase && <XepModal c={moCase} mucLv={muc.get(moCase.hoc_sinh_id) ?? 0} onDong={() => setMoId(null)} onDoi={reload} />}
    </section>
  )
}

function CaseCard({ c, mucLv, onMo, daXep }: { c: CaseChoXep; mucLv: number; onMo: () => void; daXep?: boolean }) {
  return (
    <button onClick={onMo}
      className={`w-full rounded-2xl bg-white p-4 text-left ring-1 transition hover:ring-indigo-300 ${daXep ? 'ring-emerald-200' : 'ring-slate-200'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[14px] font-semibold text-slate-800">
            {c.ho_ten} <span className="font-normal text-slate-400">· {c.mon}{c.khoi ? ` · Khối ${c.khoi}` : ''}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${MUC_CLS[mucLv] ?? MUC_CLS[1]}`}>{MUC_TEN[mucLv] ?? `L${mucLv}`}</span>
            <span className="text-[11px] text-slate-400">{c.soDang} dạng</span>
          </div>
        </div>
        {daXep && <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">Đã xếp</span>}
      </div>
    </button>
  )
}

const NGAY_KHAC = '__khac__'

function XepModal({ c, mucLv, onDong, onDoi }: { c: CaseChoXep; mucLv: number; onDong: () => void; onDoi: () => void }) {
  const muc1 = mucLv <= 1 // L0 không có case; phòng thủ coi như mức 1
  const [buois, setBuois] = useState<BuoiBoTroYeuDaXep[]>([])
  const [goiY, setGoiY] = useState<GoiYXepLich | null>(null)
  const [loading, setLoading] = useState(true)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])

  // form
  const [slotKey, setSlotKey] = useState<string>(NGAY_KHAC) // mức 1: `${lop_id}|${ngay}` hoặc NGAY_KHAC
  const [ngay, setNgay] = useState('')
  const [gio, setGio] = useState('')
  const [gioKt, setGioKt] = useState('')
  const [phong, setPhong] = useState<string | null>(null)
  const [nguoiDay, setNguoiDay] = useState<string | null>(null)
  const [trung, setTrung] = useState<KhoiBanPhong[]>([])
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [xong, setXong] = useState<string | null>(null)
  // Thùy 09-03: bấm "Xác nhận" 2 lần đẻ 2 buổi → sau khi lưu xong KHOÁ nút tới khi người xếp đổi field hoặc
  // bấm "Xếp thêm buổi khác". (`busy` chỉ chặn trong lúc chờ mạng, không chặn lần bấm thứ hai sau đó.)
  const [daXep, setDaXep] = useState(false)
  const [huyId, setHuyId] = useState<string | null>(null) // buổi đang hỏi "huỷ thật không?"
  const [huyBusy, setHuyBusy] = useState(false)

  useEffect(() => {
    setLoading(true); setLoi(null)
    Promise.all([listBuoiCuaCase(c.id), goiYXepLichBoTroYeu(c.hoc_sinh_id, c.mon)])
      .then(([b, g]) => {
        setBuois(b); setGoiY(g)
        if (muc1) {
          const s = g.buoiSapToi[0]
          if (s) { setSlotKey(`${s.lop_id}|${s.ngay}`); apDungSlot(s) } else setSlotKey(NGAY_KHAC)
          setNguoiDay(g.ta_id)
        } else {
          const gn = g.ganNhat
          setSlotKey(NGAY_KHAC); setNgay('')
          setGio(hhmm(gn?.gio_bat_dau)); setGioKt(hhmm(gn?.gio_ket_thuc)); setPhong(gn?.phong ?? null)
          setNguoiDay(mucLv >= 3 ? null : gn?.nguoi_day_tg ?? null)
        }
      })
      .catch((e: any) => setLoi(e?.message ?? String(e)))
      .finally(() => setLoading(false))
    listNhanSu().then(setNss).catch(() => {})
    listPhong(true).then(setPhongs).catch(() => {})
  }, [c.id]) // eslint-disable-line

  function apDungSlot(s: GoiYXepLich['buoiSapToi'][number]) {
    setNgay(s.ngay)
    const kt = hhmm(s.gio_ket_thuc)
    setGio(kt); setGioKt(kt ? congPhut(kt, THOI_LUONG_MAC_DINH) : '') // "sau giờ": bắt đầu ngay khi lớp tan
    setPhong(s.phong ?? null)
  }
  function chonSlot(key: string) {
    setSlotKey(key)
    if (key === NGAY_KHAC) return
    const s = goiY?.buoiSapToi.find((x) => `${x.lop_id}|${x.ngay}` === key)
    if (s) apDungSlot(s)
  }

  // Đổi bất kỳ field nào sau khi đã lưu = đang xếp buổi KHÁC → mở khoá nút xác nhận.
  useEffect(() => { if (daXep) { setDaXep(false); setXong(null) } }, [ngay, gio, gioKt, phong, nguoiDay]) // eslint-disable-line

  // Báo trùng phòng (cảnh báo, không chặn) — chỉ khi đủ phòng + ngày + giờ.
  useEffect(() => {
    const gBd = chuanHoaGio(gio), gKt = chuanHoaGio(gioKt)
    if (!phong || !ngay || !gBd || !gKt) { setTrung([]); return }
    let alive = true
    kiemTraTrungPhong(phong, ngay, gBd, gKt).then((r) => { if (alive) setTrung(r) }).catch(() => { if (alive) setTrung([]) })
    return () => { alive = false }
  }, [phong, ngay, gio, gioKt])

  // Mức 2: PLAN §0 mục 3 — buổi thường TIẾP THEO của em nên rơi 3–7 ngày sau buổi bổ trợ (retest trong buổi đó).
  const retest = useMemo(() => {
    if (muc1 || !ngay || !goiY) return null
    const ke = goiY.buoiSapToi.find((s) => s.ngay > ngay)
    if (!ke) return { ke: null as null | typeof ke, cach: null as number | null, ok: false }
    const cach = soNgayCach(ngay, ke.ngay)
    return { ke, cach, ok: cach >= 3 && cach <= 7 }
  }, [muc1, ngay, goiY])

  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  const phongOpts = useMemo(() => {
    const ds = phongs.map((p) => ({ id: p.ma_phong, label: `${p.ten_phong}${p.dang_hoat_dong ? '' : ' (đã đóng)'}` }))
    if (phong && !phongs.some((p) => p.ma_phong === phong)) ds.unshift({ id: phong, label: `${phong} (ngoài danh mục)` }) // phòng TKB cũ chưa vào danh mục — vẫn giữ để không mất mặc định
    return ds
  }, [phongs, phong])
  const tenNs = (id: string | null) => (id ? nss.find((n) => n.id === id)?.ho_ten ?? id : '')

  async function xacNhan() {
    if (busy || daXep) return
    if (!ngay) { setLoi('Chọn ngày'); return }
    const gBd = gio ? chuanHoaGio(gio) : null
    const gKt = gioKt ? chuanHoaGio(gioKt) : null
    if (gio && !gBd) { setLoi('Giờ bắt đầu sai định dạng — gõ kiểu 19:30'); return }
    if (gioKt && !gKt) { setLoi('Giờ kết thúc sai định dạng — gõ kiểu 20:30'); return }
    if (gBd && gKt && gKt <= gBd) { setLoi('Giờ kết thúc phải sau giờ bắt đầu'); return }
    setLoi(null); setBusy(true)
    try {
      await taoBuoiBoTroYeu({
        boTroYeuId: c.id, hocSinhId: c.hoc_sinh_id, ngay,
        gio_bat_dau: gBd, gio_ket_thuc: gKt, phong: phong || null, nguoi_day_tg: nguoiDay,
      })
      setXong(`Đã xếp ${thuCuaNgay(ngay)} ${ddmmVN(ngay)}${gBd ? ` · ${gBd}` : ''}${phong ? ` · ${phong}` : ''}${nguoiDay ? ` · ${tenNs(nguoiDay)}` : ''}`)
      setDaXep(true)
      setBuois(await listBuoiCuaCase(c.id))
      onDoi()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  // Huỷ buổi đã xếp (soft — trang_thai='huy', giữ dấu; dùng chung `huyBuoi` với buổi thường/bù). Chỉ buổi còn 'mo'.
  async function huy(b: BuoiBoTroYeuDaXep) {
    setHuyBusy(true); setLoi(null)
    try {
      await huyBuoi(b.id, 'OPS huỷ ở màn Xếp bổ trợ yếu')
      setHuyId(null)
      setBuois(await listBuoiCuaCase(c.id))
      onDoi()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setHuyBusy(false) }
  }

  const nhanMacDinh = muc1
    ? (goiY?.buoiSapToi.length ? `Mặc định theo buổi học tiếp theo của lớp ${goiY.lops[0]?.ten_lop ?? ''} — sửa nếu không đúng.` : 'Không tìm thấy buổi học sắp tới của lớp em (chưa có TKB?) — nhập tay.')
    : (goiY?.ganNhat ? `Mặc định theo ca bổ trợ gần nhất (${ddmmVN(goiY.ganNhat.ngay)})${mucLv >= 3 ? ' — mức 3 đổi người dạy, chọn GV cao cấp.' : '.'}` : 'Em chưa có ca bổ trợ nào trước đây — nhập tay.')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div className="max-h-[85vh] w-[600px] max-w-full overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-[16px] font-bold text-slate-800">{c.ho_ten} · {c.mon}{c.khoi ? ` · Khối ${c.khoi}` : ''}</h3>
          <button onClick={onDong} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${MUC_CLS[mucLv] ?? MUC_CLS[1]}`}>{MUC_TEN[mucLv] ?? `L${mucLv}`}</span>
          <span className="text-[11px] text-slate-400">{c.soDang} dạng cần bổ trợ</span>
        </div>

        {buois.length > 0 && (
          <div className="mb-4 rounded-xl bg-slate-50 p-3">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Đã xếp cho ca này ({buois.length})</div>
            <ul className="space-y-1">
              {buois.map((b) => (
                <li key={b.id} className="flex items-center gap-2 text-[13px]">
                  <div className={`min-w-0 flex-1 ${b.trang_thai === 'huy' ? 'line-through opacity-60' : ''}`}>
                    <span className="font-medium text-slate-700">{thuCuaNgay(b.ngay)} {ddmmVN(b.ngay)}{b.gio_bat_dau ? ` · ${hhmm(b.gio_bat_dau)}${b.gio_ket_thuc ? `–${hhmm(b.gio_ket_thuc)}` : ''}` : ''}</span>
                    {b.phong && <span className="ml-1.5 text-slate-500">· {b.phong}</span>}
                    {b.nguoi_day_tg && <span className="ml-1.5 text-slate-500">· {tenNs(b.nguoi_day_tg)}</span>}
                  </div>
                  {b.trang_thai === 'huy' ? (
                    <span className="shrink-0 rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">đã huỷ</span>
                  ) : b.trang_thai === 'mo' ? (
                    huyId === b.id ? (
                      <span className="flex shrink-0 items-center gap-1 text-[12px]">
                        <span className="text-slate-500">Huỷ buổi này?</span>
                        <button onClick={() => huy(b)} disabled={huyBusy} className="rounded bg-rose-600 px-2 py-0.5 font-semibold text-white hover:bg-rose-700 disabled:opacity-50">{huyBusy ? '…' : 'Huỷ'}</button>
                        <button onClick={() => setHuyId(null)} className="rounded px-2 py-0.5 text-slate-500 hover:bg-slate-200">Thôi</button>
                      </span>
                    ) : (
                      <button onClick={() => setHuyId(b.id)} title="Huỷ buổi (giữ dấu, không xoá)" className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">Huỷ</button>
                    )
                  ) : <span className="shrink-0 text-[11px] text-slate-400">{b.trang_thai}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[11px] text-slate-400">Form dưới = xếp THÊM 1 buổi nữa cho ca này (ca cần nhiều buổi, hoặc buổi cũ đã huỷ).</p>
          </div>
        )}

        {loading ? <p className="text-[13px] text-slate-400">Đang lấy lịch lớp / ca gần nhất…</p> : (
          <div className="space-y-3">
            <p className="text-[12px] text-slate-500">{nhanMacDinh}</p>

            {muc1 && goiY && goiY.buoiSapToi.length > 0 && (
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Buổi học của lớp (theo TKB) *</label>
                <select value={slotKey} onChange={(e) => chonSlot(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400">
                  {goiY.buoiSapToi.map((s, i) => (
                    <option key={`${s.lop_id}|${s.ngay}`} value={`${s.lop_id}|${s.ngay}`}>
                      {i === 0 ? '▶ ' : ''}{thuCuaNgay(s.ngay)} {ddmmVN(s.ngay)} · {hhmm(s.gio_bat_dau)}–{hhmm(s.gio_ket_thuc)}{s.phong ? ` · ${s.phong}` : ''} · {s.ten_lop}{s.daMo ? ' (đã mở buổi)' : ''}
                    </option>
                  ))}
                  <option value={NGAY_KHAC}>Ngày khác (nhập tay)…</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Ngày *</label>
                <input type="date" value={ngay} disabled={muc1 && slotKey !== NGAY_KHAC}
                  onChange={(e) => setNgay(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-500" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Bắt đầu</label>
                <input type="text" inputMode="numeric" placeholder="19:30" value={gio}
                  onChange={(e) => setGio(e.target.value)}
                  onBlur={() => { const g = chuanHoaGio(gio); if (g) { setGio(g); if (!gioKt) setGioKt(congPhut(g, THOI_LUONG_MAC_DINH)) } }}
                  className={`w-full rounded-lg border px-2 py-1.5 text-[13px] tabular-nums outline-none focus:border-indigo-400 ${gio && !chuanHoaGio(gio) ? 'border-rose-300' : 'border-slate-300'}`} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Kết thúc</label>
                <input type="text" inputMode="numeric" placeholder="20:30" value={gioKt}
                  onChange={(e) => setGioKt(e.target.value)}
                  onBlur={() => { const g = chuanHoaGio(gioKt); if (g) setGioKt(g) }}
                  className={`w-full rounded-lg border px-2 py-1.5 text-[13px] tabular-nums outline-none focus:border-indigo-400 ${gioKt && !chuanHoaGio(gioKt) ? 'border-rose-300' : 'border-slate-300'}`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Phòng</label>
                <SearchSelect value={phong} onChange={setPhong} options={phongOpts} placeholder="Chọn phòng…" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">
                  Người bổ trợ {mucLv >= 3 ? '(GV cao cấp)' : '(TA)'}
                </label>
                <SearchSelect value={nguoiDay} onChange={setNguoiDay} options={nsOpts} placeholder="Chọn người…" />
              </div>
            </div>

            {trung.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
                <b>⚠ Phòng {phong} đã có lịch trùng giờ:</b>
                <ul className="mt-0.5 list-inside list-disc">
                  {trung.map((k) => <li key={k.ref_id}>{hhmm(k.gio_bat_dau)}–{hhmm(k.gio_ket_thuc)} · {k.tieu_de}{k.phu_trach ? ` · ${k.phu_trach}` : ''}</li>)}
                </ul>
              </div>
            )}
            {retest && (
              retest.ke
                ? <p className={`text-[12px] ${retest.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {retest.ok ? '✓' : '⚠'} Buổi thường kế tiếp của em: {thuCuaNgay(retest.ke.ngay)} {ddmmVN(retest.ke.ngay)} (cách {retest.cach} ngày{retest.ok ? ', đúng cửa sổ retest 3–7 ngày' : ' — retest nên rơi 3–7 ngày sau buổi bổ trợ'}).
                  </p>
                : <p className="text-[12px] text-amber-700">⚠ Không thấy buổi thường nào của em sau ngày này trong 28 ngày tới — không có chỗ retest.</p>
            )}

            {loi && <p className="text-[12px] text-rose-600">{loi}</p>}
            {xong && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-700">✓ {xong}</p>}
            <div className="flex items-center justify-end gap-2 pt-1">
              {daXep && (
                <button onClick={() => { setDaXep(false); setXong(null) }} className="mr-auto text-[12px] font-medium text-indigo-600 hover:underline">
                  + Xếp thêm buổi khác cho ca này
                </button>
              )}
              <button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
              <button onClick={xacNhan} disabled={busy || !ngay || daXep}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-60 ${daXep ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {busy ? 'Đang lưu…' : daXep ? '✓ Đã xếp' : 'Xác nhận đã xếp'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
