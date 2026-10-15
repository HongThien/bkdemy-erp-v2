// Form ĐĂNG KÝ TEST — Lộc nhập thay PH (cùng hàm ghi với form web bkacademy.edu.vn/dang-ky-test).
// Chỉ 2 ô gõ (tên HS, SĐT PH); còn lại là chọn. Mỗi môn chọn 1 buổi + giờ bắt đầu, hệ báo giờ xong dự kiến.
// Giờ hợp lệ / giờ xong / môn mở theo lớp đều do DB trả (fn_ts_dk_form); client chỉ lọc theo lựa chọn đang mở.
import { useEffect, useMemo, useState } from 'react'
import {
  getFormDangKy, dangKyThay, capCuaLop, THU_NGAN, KENH_TEN,
  type FormData, type BuoiMo, type DangKyKetQua, type Kenh,
} from '../../lib/dangKyTest'
import { listNguon } from '../../lib/tuyensinh'
import { norm } from '../../components/SearchSelect'

type Chon = { khung_id: string; ngay: string; gio_bat_dau: string | null }
const ddmm = (ymd: string) => `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}`
const phut = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))
const KHAC = '__khac__'

function Muc({ so, ten: t, children }: { so: number; ten: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-slate-700">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[12px] text-indigo-700">{so}</span>{t}
      </div>
      {children}
    </div>
  )
}

export default function DangKyTestForm({ onXong, onHuy }: { onXong: (kq: DangKyKetQua) => void; onHuy: () => void }) {
  const [fd, setFd] = useState<FormData | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ten, setTen] = useState('')
  const [sdt, setSdt] = useState('')
  const [lop, setLop] = useState<string | null>(null)
  const [truong, setTruong] = useState<string | null>(null)
  const [truongGo, setTruongGo] = useState('')
  const [timTruong, setTimTruong] = useState('')
  const [mon, setMon] = useState<Record<string, Chon | null>>({}) // môn đã tích → lịch đã chọn
  const [kenh, setKenh] = useState<Kenh>('zalo')
  const [nguon, setNguon] = useState('')
  const [nguonOpts, setNguonOpts] = useState<string[]>([])
  const [ghiChu, setGhiChu] = useState('')
  const [dangGui, setDangGui] = useState(false)

  useEffect(() => {
    getFormDangKy().then(setFd).catch((e) => setLoi(e.message ?? String(e)))
    listNguon().then(setNguonOpts).catch(() => {})
  }, [])

  const monCuaLop = useMemo(() => fd?.lop.find((x) => x.lop === lop)?.mon ?? [], [fd, lop])
  const tlCua = (m: string) => monCuaLop.find((x) => x.mon === m)?.thoi_luong_phut ?? 0
  const truongLoc = useMemo(() => {
    if (!fd) return []
    const cap = lop ? capCuaLop(lop) : null
    const q = norm(timTruong.trim())
    return fd.truong.filter((t) => (!cap || t.cap.length === 0 || t.cap.includes(cap)) && (!q || norm(t.ten).includes(q)))
  }, [fd, lop, timTruong])

  function chonLop(l: string) {
    setLop(l)
    const conMo = new Set((fd?.lop.find((x) => x.lop === l)?.mon ?? []).map((m) => m.mon))
    setMon((prev) => Object.fromEntries(Object.entries(prev).filter(([m]) => conMo.has(m)).map(([m]) => [m, null])))
  }
  function tichMon(m: string) { setMon((prev) => { const n = { ...prev }; if (m in n) delete n[m]; else n[m] = null; return n }) }

  // Giờ đã chiếm bởi môn khác cùng ngày (để làm mờ lựa chọn chồng giờ)
  function biChong(m: string, ngay: string, bd: string): boolean {
    const a0 = phut(bd), a1 = a0 + tlCua(m)
    return Object.entries(mon).some(([m2, c]) => m2 !== m && c?.gio_bat_dau && c.ngay === ngay
      && a0 < phut(c.gio_bat_dau) + tlCua(m2) && phut(c.gio_bat_dau) < a1)
  }

  const monDaTich = Object.keys(mon)
  const truongChot = truong === KHAC ? truongGo.trim() : truong
  const du = ten.trim().length >= 2 && /^(0|\+?84)[0-9 .]{9,12}$/.test(sdt.trim()) && !!lop && !!truongChot
    && monDaTich.length > 0 && monDaTich.every((m) => mon[m]?.gio_bat_dau)

  async function gui() {
    if (!du || !lop || !truongChot) return
    setDangGui(true); setLoi(null)
    try {
      const kq = await dangKyThay({
        ho_ten_hs: ten, sdt_ph: sdt, lop, truong: truongChot, truong_tu_go: truong === KHAC,
        nguon_lead: nguon || null, ghi_chu: ghiChu || null,
        mon: monDaTich.map((m) => ({ mon: m, khung_id: mon[m]!.khung_id, ngay: mon[m]!.ngay, gio_bat_dau: mon[m]!.gio_bat_dau! })),
      }, kenh)
      onXong(kq)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangGui(false) }
  }

  if (!fd) return <div className="p-6 text-[14px] text-slate-400">{loi ?? 'Đang tải…'}</div>

  const chip = (on: boolean, dis = false) => `rounded-xl border px-3 py-2 text-[14px] font-medium transition ${
    dis ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through'
      : on ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`
  const inputCls = 'w-full rounded-xl border border-slate-300 px-3 py-2.5 text-[15px] outline-none focus:border-indigo-400'

  return (
    <div>
      <Muc so={1} ten="Học sinh">
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={inputCls} placeholder="Họ tên học sinh" value={ten} onChange={(e) => setTen(e.target.value)} />
          <input className={inputCls} placeholder="SĐT phụ huynh" inputMode="tel" value={sdt} onChange={(e) => setSdt(e.target.value)} />
        </div>
      </Muc>

      <Muc so={2} ten="Lớp đang học ở trường">
        {fd.lop.length === 0 ? <div className="text-[13px] text-amber-600">Chưa lớp nào mở test — khai thời lượng bài test ở mục Cài đặt.</div> : (
          <div className="flex flex-wrap gap-1.5">
            {fd.lop.map((l) => <button key={l.lop} type="button" onClick={() => chonLop(l.lop)} className={`${chip(lop === l.lop)} min-w-[52px]`}>{l.ten}</button>)}
          </div>
        )}
      </Muc>

      <Muc so={3} ten="Trường">
        {truong && truong !== KHAC ? (
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-indigo-50 px-3 py-2 text-[14px] font-medium text-indigo-700">{truong}</span>
            <button type="button" onClick={() => setTruong(null)} className="text-[13px] text-slate-500 underline">Đổi</button>
          </div>
        ) : truong === KHAC ? (
          <div className="flex items-center gap-2">
            <input autoFocus className={inputCls} placeholder="Gõ tên trường" value={truongGo} onChange={(e) => setTruongGo(e.target.value)} />
            <button type="button" onClick={() => setTruong(null)} className="shrink-0 text-[13px] text-slate-500 underline">Chọn từ danh sách</button>
          </div>
        ) : (
          <div>
            <input className={inputCls} placeholder="Tìm trường…" value={timTruong} onChange={(e) => setTimTruong(e.target.value)} />
            <div className="mt-2 flex max-h-[180px] flex-wrap gap-1.5 overflow-y-auto">
              {truongLoc.map((t) => <button key={t.ten} type="button" onClick={() => setTruong(t.ten)} className={chip(false)}>{t.ten}</button>)}
              <button type="button" onClick={() => { setTruong(KHAC); setTruongGo(timTruong) }} className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-[14px] text-slate-500 hover:border-indigo-300">+ Trường khác</button>
            </div>
          </div>
        )}
      </Muc>

      <Muc so={4} ten="Môn test">
        {!lop ? <div className="text-[13px] text-slate-400">Chọn lớp trước.</div> : (
          <div className="flex flex-wrap gap-1.5">
            {monCuaLop.map((m) => (
              <button key={m.mon} type="button" onClick={() => tichMon(m.mon)} className={chip(m.mon in mon)}>
                {m.mon in mon ? '☑' : '☐'} {m.mon} <span className="opacity-70">· {m.thoi_luong_phut}′</span>
              </button>
            ))}
          </div>
        )}
      </Muc>

      {monDaTich.map((m, i) => (
        <Muc key={m} so={5 + i} ten={`Lịch test ${m}`}>
          <div className="mb-2 rounded-lg bg-sky-50 px-3 py-1.5 text-[13px] text-sky-700">Bài test dự kiến {tlCua(m)} phút</div>
          <LichMon fd={fd} tl={tlCua(m)} chon={mon[m]} onChon={(c) => setMon((p) => ({ ...p, [m]: c }))} biChong={(ngay, bd) => biChong(m, ngay, bd)} chip={chip} />
        </Muc>
      ))}

      <Muc so={5 + monDaTich.length} ten="PH báo qua">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(KENH_TEN) as Kenh[]).map((k) => <button key={k} type="button" onClick={() => setKenh(k)} className={chip(kenh === k)}>{KENH_TEN[k]}</button>)}
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <input list="dk-nguon" className={inputCls} placeholder="Nguồn (Giới thiệu, Fanpage…) — không bắt buộc" value={nguon} onChange={(e) => setNguon(e.target.value)} />
          <datalist id="dk-nguon">{nguonOpts.map((n) => <option key={n} value={n} />)}</datalist>
          <input className={inputCls} placeholder="Lưu ý — không bắt buộc" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
        </div>
      </Muc>

      {loi && <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{loi}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onHuy} className="rounded-xl border border-slate-200 px-4 py-2 text-[14px] text-slate-600">Đóng</button>
        <button type="button" onClick={gui} disabled={!du || dangGui}
          className={`rounded-xl px-5 py-2 text-[14px] font-semibold ${du && !dangGui ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'cursor-not-allowed bg-slate-100 text-slate-400'}`}>
          {dangGui ? 'Đang gửi…' : 'Đăng ký test'}
        </button>
      </div>
    </div>
  )
}

// Chọn buổi rồi chọn giờ bắt đầu cho 1 môn
export function LichMon({ fd, tl, chon, onChon, biChong, chip }: {
  fd: { lich: BuoiMo[] }; tl: number; chon: Chon | null; onChon: (c: Chon | null) => void
  biChong: (ngay: string, bd: string) => boolean; chip: (on: boolean, dis?: boolean) => string
}) {
  const buoi = fd.lich.filter((b) => b.gio[String(tl)]?.length)
  const dangChon = buoi.find((b) => b.khung_id === chon?.khung_id && b.ngay === chon?.ngay) ?? null
  const gioOpt = dangChon?.gio[String(tl)] ?? []
  const xong = gioOpt.find((g) => g.bat_dau === chon?.gio_bat_dau)?.xong
  if (buoi.length === 0) return <div className="text-[13px] text-amber-600">Chưa có buổi test nào mở cho thời lượng này.</div>
  return (
    <div>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {buoi.map((b) => {
          const on = dangChon === b
          return (
            <button key={b.khung_id + b.ngay} type="button" onClick={() => onChon({ khung_id: b.khung_id, ngay: b.ngay, gio_bat_dau: null })}
              className={`${chip(on)} shrink-0 text-left leading-tight`}>
              <div>{THU_NGAN[b.thu]} {ddmm(b.ngay)}</div>
              <div className={`text-[12px] font-normal ${on ? 'text-white/80' : 'text-slate-400'}`}>{b.tu}–{b.den}</div>
            </button>
          )
        })}
      </div>
      {dangChon && (
        <div className="mt-2">
          <div className="mb-1.5 text-[13px] text-slate-500">Giờ bắt đầu</div>
          <div className="flex flex-wrap gap-1.5">
            {gioOpt.map((g) => {
              const dis = biChong(dangChon.ngay, g.bat_dau)
              return <button key={g.bat_dau} type="button" disabled={dis} onClick={() => onChon({ khung_id: dangChon.khung_id, ngay: dangChon.ngay, gio_bat_dau: g.bat_dau })}
                className={`${chip(chon?.gio_bat_dau === g.bat_dau, dis)} min-w-[64px]`}>{g.bat_dau}</button>
            })}
          </div>
          {xong && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[14px] text-emerald-800">⏰ Dự kiến xong lúc <b>{xong}</b> — bố mẹ đón con lúc này.</div>}
        </div>
      )}
    </div>
  )
}
