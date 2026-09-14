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
  listLichTruc, themLichTruc, ketThucLichTruc, lichTrucCuaHS, goiYTheoLichTruc,
  type CaseChoXep, type BuoiBoTroYeuDaXep, type GoiYXepLich, type LichTruc, type CaTrucDeXuat,
} from '../../lib/botro_yeu'
import { supabase } from '../../lib/supabase'
import { homNayVN } from '../../lib/tuan'
import { getLevels } from '../../lib/danhgia'
import { huyBuoi, updateBuoiMeta } from '../../lib/gami'
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
// Thùy 09-09: khung giờ SẴN (bước 30', 06:00–22:00) thay vì gõ chữ — gõ "16h" rớt định dạng, người xếp
// tưởng không lưu. Giá trị lẻ từ DB (vd 16:45) vẫn hiện được: thêm vào đầu danh sách nếu thiếu.
const KHUNG_GIO = Array.from({ length: (22 - 6) * 2 + 1 }, (_, i) => `${String(6 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)
const khungGioCo = (v: string) => (v && !KHUNG_GIO.includes(v) ? [v, ...KHUNG_GIO] : KHUNG_GIO)
const soNgayCach = (a: string, b: string) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000)

export default function XepLichBoTroYeuScreen() {
  const [items, setItems] = useState<CaseChoXep[]>([])
  const [muc, setMuc] = useState<Map<string, number>>(new Map()) // hoc_sinh_id → level kiến thức
  const [loading, setLoading] = useState(true)
  const [moId, setMoId] = useState<string | null>(null)
  // Thùy 09-14: tab "Lịch trực" — OPS nhập lịch trực bổ trợ theo khối/lớp; form xếp đọc lịch này để tự đề xuất ca.
  const [tab, setTab] = useState<'xep' | 'truc'>('xep')

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
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-slate-800">Xếp bổ trợ yếu</h1>
            <p className="mt-1 text-[13px] text-slate-500">{tab === 'xep' ? 'Case đã chọn dạng — bấm vào ca để chốt ngày, giờ, phòng, người bổ trợ với phụ huynh.' : 'Lịch trực bổ trợ theo khối/lớp — form xếp tự đề xuất ca trực phù hợp cho từng em.'}</p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 text-[13px] font-semibold">
            {(['xep', 'truc'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 ${tab === t ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                {t === 'xep' ? 'Xếp lịch' : 'Lịch trực'}
              </button>
            ))}
          </div>
        </header>

        {tab === 'truc' ? <LichTrucTab /> : loading ? (
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
      {/* Xếp/sửa xong = vá `daXep` của đúng case tại chỗ, KHÔNG reload (blank list + mất chỗ) — CLAUDE.md §2 React. */}
      {moCase && <XepModal c={moCase} mucLv={muc.get(moCase.hoc_sinh_id) ?? 0} onDong={() => setMoId(null)}
        onDoi={() => setItems((prev) => prev.map((x) => x.id === moCase.id ? { ...x, daXep: true } : x))} />}
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
  const [caTruc, setCaTruc] = useState<CaTrucDeXuat[]>([]) // ca trực cụ thể (ngày thật) đã xếp ưu tiên — Thùy 09-14
  const [trucKey, setTrucKey] = useState<string>(NGAY_KHAC) // `${slotId}|${ngay}` hoặc NGAY_KHAC
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
  // Thùy 09-09: "xếp xong bấm vào lại reset từ đầu" — trước đây form LUÔN mặc định theo TKB/ca cũ, buổi vừa
  // xếp chỉ nằm ở list phía trên nên nhìn như chưa lưu (DB có lưu). Giờ: case đã có buổi còn 'mo' ⇒ mở
  // form ở chế độ SỬA buổi đó (prefill đúng cái đã lưu, nút = "Lưu thay đổi", update chứ không đẻ buổi
  // mới); "+ Xếp thêm buổi khác" mới về chế độ tạo với mặc định.
  const [suaId, setSuaId] = useState<string | null>(null)

  // Ưu tiên (Thùy 09-14): (1) ca trực khớp ca bổ trợ lần trước → (2) ca trực gần nhất → (3) mặc định cũ (TKB / ca cũ).
  function apDungCaTruc(s: CaTrucDeXuat, g: GoiYXepLich | null) {
    setTrucKey(`${s.id}|${s.ngay}`); setSlotKey(NGAY_KHAC)
    setNgay(s.ngay); setGio(hhmm(s.gio_bat_dau)); setGioKt(hhmm(s.gio_ket_thuc)); setPhong(s.phong ?? null)
    setNguoiDay(s.nhan_su_id ?? (mucLv >= 3 ? null : muc1 ? g?.ta_id ?? null : g?.ganNhat?.nguoi_day_tg ?? null))
  }
  function apDungMacDinh(g: GoiYXepLich, ct: CaTrucDeXuat[] = caTruc) {
    if (ct.length) { apDungCaTruc(ct[0], g); return }
    setTrucKey(NGAY_KHAC)
    if (muc1) {
      const s = g.buoiSapToi[0]
      if (s) { setSlotKey(`${s.lop_id}|${s.ngay}`); apDungSlot(s) } else { setSlotKey(NGAY_KHAC); setNgay(''); setGio(''); setGioKt(''); setPhong(null) }
      setNguoiDay(g.ta_id)
    } else {
      const gn = g.ganNhat
      setSlotKey(NGAY_KHAC); setNgay('')
      setGio(hhmm(gn?.gio_bat_dau)); setGioKt(hhmm(gn?.gio_ket_thuc)); setPhong(gn?.phong ?? null)
      setNguoiDay(mucLv >= 3 ? null : gn?.nguoi_day_tg ?? null)
    }
  }
  function moSua(b: BuoiBoTroYeuDaXep) {
    setSuaId(b.id); setSlotKey(NGAY_KHAC); setTrucKey(NGAY_KHAC)
    setNgay(b.ngay); setGio(hhmm(b.gio_bat_dau)); setGioKt(hhmm(b.gio_ket_thuc)); setPhong(b.phong ?? null); setNguoiDay(b.nguoi_day_tg ?? null)
    setDaXep(false); setXong(null); setLoi(null)
  }

  useEffect(() => {
    setLoading(true); setLoi(null)
    Promise.all([listBuoiCuaCase(c.id), goiYXepLichBoTroYeu(c.hoc_sinh_id, c.mon), lichTrucCuaHS(c.hoc_sinh_id, c.mon).catch(() => [])])
      .then(([b, g, slots]) => {
        const ct = goiYTheoLichTruc(slots, g.ganNhat)
        setBuois(b); setGoiY(g); setCaTruc(ct)
        const dangMo = b.find((x) => x.trang_thai === 'mo') // b đã sort ngày giảm dần ⇒ buổi mở gần nhất
        if (dangMo) moSua(dangMo); else apDungMacDinh(g, ct)
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
  function chonCaTruc(key: string) {
    if (key === NGAY_KHAC) { setTrucKey(NGAY_KHAC); if (goiY) { const g = goiY; setSlotKey(NGAY_KHAC); if (muc1 && g.buoiSapToi[0]) { setSlotKey(`${g.buoiSapToi[0].lop_id}|${g.buoiSapToi[0].ngay}`); apDungSlot(g.buoiSapToi[0]) } } return }
    const s = caTruc.find((x) => `${x.id}|${x.ngay}` === key)
    if (s) apDungCaTruc(s, goiY)
  }
  function chonSlot(key: string) {
    setSlotKey(key); setTrucKey(NGAY_KHAC)
    if (key === NGAY_KHAC) return
    const s = goiY?.buoiSapToi.find((x) => `${x.lop_id}|${x.ngay}` === key)
    if (s) apDungSlot(s)
  }

  // Đổi bất kỳ field nào sau khi đã lưu = đang xếp buổi KHÁC → mở khoá nút xác nhận.
  useEffect(() => { if (daXep) { setDaXep(false); setXong(null) } }, [ngay, gio, gioKt, phong, nguoiDay]) // eslint-disable-line

  // Báo trùng phòng (cảnh báo, không chặn) — chỉ khi đủ phòng + ngày + giờ. Đang SỬA thì bỏ qua chính buổi
  // đó (Thùy 09-09: "hiện 1 buổi mà vẫn báo trùng" = form prefill buổi đã lưu tự va với chính nó).
  useEffect(() => {
    const gBd = chuanHoaGio(gio), gKt = chuanHoaGio(gioKt)
    if (!phong || !ngay || !gBd || !gKt) { setTrung([]); return }
    let alive = true
    kiemTraTrungPhong(phong, ngay, gBd, gKt, suaId ?? undefined).then((r) => { if (alive) setTrung(r) }).catch(() => { if (alive) setTrung([]) })
    return () => { alive = false }
  }, [phong, ngay, gio, gioKt, suaId])

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
      const tom = `${thuCuaNgay(ngay)} ${ddmmVN(ngay)}${gBd ? ` · ${gBd}${gKt ? `–${gKt}` : ''}` : ''}${phong ? ` · ${phong}` : ''}${nguoiDay ? ` · ${tenNs(nguoiDay)}` : ''}`
      if (suaId) {
        await updateBuoiMeta(suaId, { ngay, gio_bat_dau: gBd, gio_ket_thuc: gKt, phong: phong || null, nguoi_day_tg: nguoiDay })
        setXong(`Đã lưu thay đổi: ${tom}`)
      } else {
        const id = await taoBuoiBoTroYeu({
          boTroYeuId: c.id, hocSinhId: c.hoc_sinh_id, ngay,
          gio_bat_dau: gBd, gio_ket_thuc: gKt, phong: phong || null, nguoi_day_tg: nguoiDay,
        })
        setSuaId(id) // từ giờ sửa tiếp = update buổi này, không đẻ buổi mới
        setXong(`Đã xếp ${tom}`)
      }
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
      const bs = await listBuoiCuaCase(c.id)
      setBuois(bs)
      if (suaId === b.id) { setSuaId(null); if (goiY) apDungMacDinh(goiY) } // đang sửa đúng buổi vừa huỷ ⇒ về chế độ tạo
      onDoi()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setHuyBusy(false) }
  }

  const nhanMacDinh = caTruc.length
    ? `Mặc định theo LỊCH TRỰC bổ trợ${caTruc[0].khopCaTruoc ? ' — ca khớp giờ em đã học lần trước' : ' — ca trực gần nhất'}. Đổi ca ở ô bên dưới nếu cần.`
    : muc1
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
                    suaId === b.id ? (
                      <span className="shrink-0 rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">đang sửa ↓</span>
                    ) : huyId === b.id ? (
                      <span className="flex shrink-0 items-center gap-1 text-[12px]">
                        <span className="text-slate-500">Huỷ buổi này?</span>
                        <button onClick={() => huy(b)} disabled={huyBusy} className="rounded bg-rose-600 px-2 py-0.5 font-semibold text-white hover:bg-rose-700 disabled:opacity-50">{huyBusy ? '…' : 'Huỷ'}</button>
                        <button onClick={() => setHuyId(null)} className="rounded px-2 py-0.5 text-slate-500 hover:bg-slate-200">Thôi</button>
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-2 text-[12px]">
                        <button onClick={() => moSua(b)} className="text-indigo-600 hover:underline">Sửa</button>
                        <button onClick={() => setHuyId(b.id)} title="Huỷ buổi (giữ dấu, không xoá)" className="text-slate-400 hover:text-rose-600">Huỷ</button>
                      </span>
                    )
                  ) : <span className="shrink-0 text-[11px] text-slate-400">{b.trang_thai}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[11px] text-slate-400">{suaId ? 'Form dưới đang SỬA buổi đã xếp (đổi giờ/phòng/người rồi "Lưu thay đổi"). Muốn thêm buổi nữa: bấm "+ Xếp thêm buổi khác".' : 'Form dưới = xếp THÊM 1 buổi nữa cho ca này (ca cần nhiều buổi, hoặc buổi cũ đã huỷ).'}</p>
          </div>
        )}

        {loading ? <p className="text-[13px] text-slate-400">Đang lấy lịch lớp / ca gần nhất…</p> : (
          <div className="space-y-3">
            <p className="text-[12px] text-slate-500">{suaId ? `Đang sửa buổi ${thuCuaNgay(ngay)} ${ddmmVN(ngay)} đã xếp — sửa xong bấm "Lưu thay đổi".` : nhanMacDinh}</p>

            {!suaId && caTruc.length > 0 && (
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Ca trực bổ trợ (lịch trực khối/lớp) *</label>
                <select value={trucKey} onChange={(e) => chonCaTruc(e.target.value)}
                  className="w-full rounded-lg border border-indigo-300 bg-indigo-50/40 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400">
                  {caTruc.map((s, i) => (
                    <option key={`${s.id}|${s.ngay}`} value={`${s.id}|${s.ngay}`}>
                      {i === 0 ? '▶ ' : ''}{thuCuaNgay(s.ngay)} {ddmmVN(s.ngay)} · {hhmm(s.gio_bat_dau)}–{hhmm(s.gio_ket_thuc)}{s.phong ? ` · ${s.phong}` : ''}{s.nhan_su_ten ? ` · ${s.nhan_su_ten}` : ''}{s.khopCaTruoc ? ' ★ khớp ca trước' : ''}
                    </option>
                  ))}
                  <option value={NGAY_KHAC}>Không theo lịch trực (TKB lớp / nhập tay)…</option>
                </select>
              </div>
            )}
            {!suaId && trucKey === NGAY_KHAC && muc1 && goiY && goiY.buoiSapToi.length > 0 && (
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
                <input type="date" value={ngay} disabled={!suaId && ((muc1 && slotKey !== NGAY_KHAC) || trucKey !== NGAY_KHAC)}
                  onChange={(e) => setNgay(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-500" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Bắt đầu</label>
                <select value={gio} onChange={(e) => { const g = e.target.value; setGio(g); if (g) setGioKt(congPhut(g, THOI_LUONG_MAC_DINH)) }}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] tabular-nums outline-none focus:border-indigo-400">
                  <option value="">— giờ —</option>
                  {khungGioCo(gio).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-500">Kết thúc</label>
                <select value={gioKt} onChange={(e) => setGioKt(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] tabular-nums outline-none focus:border-indigo-400">
                  <option value="">— giờ —</option>
                  {khungGioCo(gioKt).filter((g) => !gio || g > gio).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
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
                  {trung.map((k) => <li key={k.ref_id}>{hhmm(k.gio_bat_dau)}–{hhmm(k.gio_ket_thuc)} · {k.tieu_de}{k.phu_trach ? ` · ${k.phu_trach}` : ''}{buois.some((b) => b.id === k.ref_id) && <b className="ml-1 text-rose-700">← buổi KHÁC của chính ca này — xếp trùng? Huỷ bớt 1 ở list trên.</b>}</li>)}
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
              {(daXep || suaId) && (
                <button onClick={() => { setSuaId(null); setDaXep(false); setXong(null); if (goiY) apDungMacDinh(goiY) }} className="mr-auto text-[12px] font-medium text-indigo-600 hover:underline">
                  + Xếp thêm buổi khác cho ca này
                </button>
              )}
              <button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
              <button onClick={xacNhan} disabled={busy || !ngay || daXep}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-60 ${daXep ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {busy ? 'Đang lưu…' : daXep ? '✓ Đã lưu' : suaId ? 'Lưu thay đổi' : 'Xác nhận đã xếp'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── TAB LỊCH TRỰC BỔ TRỢ (Thùy 09-14) ────────────────────────────────────────────────────────────────
// Slot lặp theo tuần: môn × (khối | lớp) × thứ × giờ [× phòng × người trực]. Kết thúc = đặt `hieu_luc_den` (không xoá cứng —
// buổi đã xếp theo slot cũ vẫn giải thích được). Thêm/kết thúc vá list tại chỗ (CLAUDE.md §2 React).
const THU_TEN: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'Chủ nhật' }
type LopNho = { id: string; ten_lop: string; mon: string; khoi: string | null }
function LichTrucTab() {
  const [rows, setRows] = useState<LichTruc[]>([])
  const [lops, setLops] = useState<LopNho[]>([])
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [loading, setLoading] = useState(true)
  const [hienHetHieuLuc, setHienHetHieuLuc] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // form
  const [mon, setMon] = useState('Toán')
  const [phamVi, setPhamVi] = useState<'khoi' | 'lop'>('khoi')
  const [khoi, setKhoi] = useState('')
  const [lopId, setLopId] = useState<string | null>(null)
  const [thu, setThu] = useState(6)
  const [gio, setGio] = useState('15:00')
  const [gioKt, setGioKt] = useState('16:00')
  const [phong, setPhong] = useState<string | null>(null)
  const [nhanSu, setNhanSu] = useState<string | null>(null)
  const [ghiChu, setGhiChu] = useState('')

  useEffect(() => {
    Promise.all([
      listLichTruc(),
      supabase.from('lop').select('id, ten_lop, mon, khoi').eq('trang_thai', 'dang_hoc').order('ten_lop').limit(500).then(({ data }) => (data ?? []) as LopNho[]),
    ]).then(([r, l]) => { setRows(r); setLops(l) }).catch((e: any) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false))
    listNhanSu().then((l) => setNss(l.filter((n) => n.trang_thai === 'dang_lam'))).catch(() => {})
    listPhong(true).then(setPhongs).catch(() => {})
  }, [])

  const mons = useMemo(() => [...new Set(lops.map((l) => l.mon))].sort(), [lops])
  const khois = useMemo(() => [...new Set(lops.filter((l) => l.mon === mon).map((l) => l.khoi).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true })), [lops, mon])
  const lopOpts = useMemo(() => lops.filter((l) => l.mon === mon).map((l) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `Khối ${l.khoi}` : undefined })), [lops, mon])
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  const phongOpts = useMemo(() => phongs.map((p) => ({ id: p.ma_phong, label: p.ten_phong })), [phongs])
  const homNay = homNayVN()
  const conHieuLuc = (r: LichTruc) => !r.hieu_luc_den || r.hieu_luc_den >= homNay
  const hien = rows.filter((r) => hienHetHieuLuc || conHieuLuc(r))

  async function them() {
    if (phamVi === 'khoi' ? !khoi : !lopId) { setLoi(phamVi === 'khoi' ? 'Chọn khối' : 'Chọn lớp'); return }
    if (gioKt <= gio) { setLoi('Giờ kết thúc phải sau giờ bắt đầu'); return }
    setLoi(null); setBusy(true)
    try {
      const input = { mon, khoi: phamVi === 'khoi' ? khoi : null, lop_id: phamVi === 'lop' ? lopId : null, thu, gio_bat_dau: gio, gio_ket_thuc: gioKt, phong: phong || null, nhan_su_id: nhanSu, hieu_luc_den: null, ghi_chu: ghiChu.trim() || null }
      const id = await themLichTruc(input)
      const lop = lops.find((l) => l.id === lopId)
      setRows((prev) => [...prev, { ...input, id, hieu_luc_tu: homNay, lop_ten: phamVi === 'lop' ? lop?.ten_lop ?? null : null, nhan_su_ten: nss.find((n) => n.id === nhanSu)?.ho_ten ?? null }])
      setGhiChu('')
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  async function ketThuc(r: LichTruc) {
    if (!confirm(`Kết thúc lịch trực ${THU_TEN[r.thu]} ${hhmm(r.gio_bat_dau)}–${hhmm(r.gio_ket_thuc)} (${r.lop_ten ?? `Khối ${r.khoi}`} · ${r.mon}) từ hôm nay? Buổi đã xếp không ảnh hưởng.`)) return
    try { await ketThucLichTruc(r.id, homNay); setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, hieu_luc_den: homNay } : x)) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  const sel = 'w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400'
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-slate-500">Thêm lịch trực</h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Môn</label>
            <select value={mon} onChange={(e) => { setMon(e.target.value); setKhoi(''); setLopId(null) }} className={sel}>{mons.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Phạm vi</label>
            <select value={phamVi} onChange={(e) => setPhamVi(e.target.value as 'khoi' | 'lop')} className={sel}><option value="khoi">Cả khối</option><option value="lop">1 lớp (thắng khối)</option></select></div>
          {phamVi === 'khoi' ? (
            <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Khối *</label>
              <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={sel}><option value="">— chọn —</option>{khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select></div>
          ) : (
            <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Lớp *</label><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
          )}
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Thứ</label>
            <select value={thu} onChange={(e) => setThu(Number(e.target.value))} className={sel}>{[2, 3, 4, 5, 6, 7, 8].map((t) => <option key={t} value={t}>{THU_TEN[t]}</option>)}</select></div>
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Bắt đầu</label>
            <select value={gio} onChange={(e) => { setGio(e.target.value); setGioKt(congPhut(e.target.value, THOI_LUONG_MAC_DINH)) }} className={`${sel} tabular-nums`}>{KHUNG_GIO.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Kết thúc</label>
            <select value={gioKt} onChange={(e) => setGioKt(e.target.value)} className={`${sel} tabular-nums`}>{KHUNG_GIO.filter((g) => g > gio).map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Phòng</label><SearchSelect value={phong} onChange={setPhong} options={phongOpts} placeholder="Chọn phòng…" /></div>
          <div><label className="mb-1 block text-[11px] font-medium text-slate-500">Người trực</label><SearchSelect value={nhanSu} onChange={setNhanSu} options={nsOpts} placeholder="Chọn người…" /></div>
          <div className="col-span-2 md:col-span-3"><label className="mb-1 block text-[11px] font-medium text-slate-500">Ghi chú</label>
            <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="vd: trực chung với lớp 8B2…" className={sel} /></div>
          <div className="flex items-end"><button onClick={them} disabled={busy} className="h-[34px] w-full rounded-lg bg-indigo-600 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{busy ? 'Đang lưu…' : '+ Thêm lịch trực'}</button></div>
        </div>
        {loi && <p className="mt-2 text-[12px] text-rose-600">{loi}</p>}
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-slate-500">Lịch trực đang hiệu lực ({rows.filter(conHieuLuc).length})</h2>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-500"><input type="checkbox" checked={hienHetHieuLuc} onChange={(e) => setHienHetHieuLuc(e.target.checked)} /> hiện cả đã kết thúc</label>
        </div>
        {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : hien.length === 0 ? (
          <p className="text-[13px] text-slate-400">Chưa có lịch trực nào — thêm ở trên. Khi có, form xếp bổ trợ sẽ tự đề xuất ca trực cho HS đúng khối/lớp.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400"><th className="py-1.5">Môn</th><th>Phạm vi</th><th>Thứ · giờ</th><th>Phòng</th><th>Người trực</th><th>Hiệu lực</th><th></th></tr></thead>
            <tbody>
              {hien.map((r) => (
                <tr key={r.id} className={`border-t border-slate-100 ${conHieuLuc(r) ? '' : 'text-slate-400 line-through'}`}>
                  <td className="py-2 font-medium text-slate-700">{r.mon}</td>
                  <td>{r.lop_ten ? <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Lớp {r.lop_ten}</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Khối {r.khoi}</span>}</td>
                  <td className="font-semibold text-slate-800">{THU_TEN[r.thu]} · {hhmm(r.gio_bat_dau)}–{hhmm(r.gio_ket_thuc)}</td>
                  <td>{r.phong ?? '—'}</td>
                  <td>{r.nhan_su_ten ?? <span className="text-slate-400">chưa phân</span>}</td>
                  <td className="text-[12px] text-slate-500">{ddmmVN(r.hieu_luc_tu)}{r.hieu_luc_den ? ` → ${ddmmVN(r.hieu_luc_den)}` : ' →'}</td>
                  <td className="text-right">{conHieuLuc(r) && <button onClick={() => ketThuc(r)} className="text-[12px] text-slate-400 hover:text-rose-600">Kết thúc</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
