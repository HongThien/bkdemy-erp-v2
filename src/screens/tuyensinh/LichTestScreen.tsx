// Màn LỊCH TEST của Tuyển sinh (Lộc) — mig 202610151355, spec-dang-ky-test.md.
// ① Việc cần làm (suy từ DB): hẹn lỡ · trường PH tự gõ · lớp×môn chưa khai thời lượng
// ② Lịch các buổi sắp tới + hẹn từng buổi (đóng/mở buổi, đổi lịch, huỷ hẹn)
// ③ Cài đặt: khung tuần · thời lượng bài test · danh mục trường
// Sau mutation: vá tại chỗ, refetch NỀN (không blank list) — CLAUDE.md §2 React.
import { useEffect, useMemo, useState } from 'react'
import {
  getTongQuan, getFormDangKy, doiLichHen, huyHen, listKhung, themKhung, boKhung, dongBuoi, moBuoi, datThoiLuong,
  listTruong, themTruong, anTruong, khungTrungPhong, THU_TEN, THU_NGAN, KENH_TEN, THOI_LUONG_TEST,
  type TongQuan, type Hen, type Khung, type Truong, type Cap, type FormData, type DangKyKetQua, type TrungPhong,
} from '../../lib/dangKyTest'
import { listPhong, type Phong } from '../../lib/phong'
import DangKyTestForm, { LichMon } from './DangKyTestForm'

const ddmm = (ymd: string) => `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}`
const hm = (t: string) => t.slice(0, 5)
const CAP_TEN: Record<Cap, string> = { tieu_hoc: 'Tiểu học', thcs: 'THCS', thpt: 'THPT' }
type Tab = 'lich' | 'cai_dat'

function Modal({ title, onClose, children, maxW = 'max-w-[560px]' }: { title: string; onClose: () => void; children: React.ReactNode; maxW?: string }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className={`max-h-[92vh] w-full ${maxW} overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">{title}</div>
        {children}
      </div>
    </div>
  )
}

const TT: Record<Hen['tinh_trang'], { ten: string; cls: string }> = {
  cho: { ten: 'Chờ test', cls: 'bg-slate-100 text-slate-600' },
  da_den: { ten: 'Đã đến', cls: 'bg-emerald-100 text-emerald-700' },
  lo_hen: { ten: 'Lỡ hẹn', cls: 'bg-rose-100 text-rose-700' },
}

export default function LichTestScreen() {
  const [tab, setTab] = useState<Tab>('lich')
  const [tq, setTq] = useState<TongQuan | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [moForm, setMoForm] = useState(false)
  const [vuaDk, setVuaDk] = useState<DangKyKetQua | null>(null)
  const [doi, setDoi] = useState<Hen | null>(null)
  const [huy, setHuy] = useState<Hen | null>(null)

  async function tai() { try { setTq(await getTongQuan(14)); setLoi(null) } catch (e: any) { setLoi(e.message ?? String(e)) } }
  useEffect(() => { tai() }, [])

  // Vá 1 hẹn tại chỗ (cả trong buổi lẫn danh sách lỡ hẹn)
  function vaHen(id: string, f: (h: Hen) => Hen | null) {
    setTq((p) => p && ({
      ...p,
      buoi: p.buoi.map((b) => ({ ...b, hen: b.hen.flatMap((h) => h.id === id ? (f(h) ? [f(h)!] : []) : [h]) })),
      lo_hen: p.lo_hen.flatMap((h) => h.id === id ? (f(h) ? [f(h)!] : []) : [h]),
    }))
  }

  async function toggleDong(khungId: string, ngay: string, dong: boolean) {
    try {
      if (dong) await moBuoi(khungId, ngay)
      else await dongBuoi(khungId, ngay, window.prompt('Lý do đóng buổi (không bắt buộc)') || null)
      setTq((p) => p && ({ ...p, buoi: p.buoi.map((b) => b.khung_id === khungId && b.ngay === ngay ? { ...b, dong: !dong } : b) }))
    } catch (e: any) { alert(e.message ?? String(e)) }
  }

  const soViec = tq ? tq.lo_hen.length + tq.truong_tu_go.length + tq.thieu_thoi_luong.length : 0

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex w-fit gap-1 rounded-xl bg-slate-200/70 p-1">
          {([['lich', '📅 Lịch & hẹn'], ['cai_dat', '⚙ Cài đặt']] as [Tab, string][]).map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-1.5 text-[14px] font-semibold transition ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{l}</button>
          ))}
        </div>
        <button onClick={() => tai()} title="Tải lại" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-500 hover:border-indigo-300">↻</button>
        <button onClick={() => { setVuaDk(null); setMoForm(true) }} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Đăng ký test thay PH</button>
      </div>
      {loi && <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{loi}</div>}

      {!tq ? <div className="p-8 text-[14px] text-slate-400">Đang tải…</div> : tab === 'lich' ? (
        <div className="space-y-4">
          {soViec > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="mb-2 text-[14px] font-semibold text-amber-800">Cần xử lý ({soViec})</div>
              {tq.thieu_thoi_luong.length > 0 && (
                <div className="mb-2 text-[13px] text-amber-800">
                  ⏱ {tq.thieu_thoi_luong.length} lớp×môn chưa khai thời lượng bài test ⇒ <b>chưa hiện trên web</b>:{' '}
                  {tq.thieu_thoi_luong.map((x) => `${x.mon} ${x.lop}`).join(' · ')}{' '}
                  <button onClick={() => setTab('cai_dat')} className="underline">Khai ngay</button>
                </div>
              )}
              {tq.truong_tu_go.length > 0 && (
                <div className="mb-2 text-[13px] text-amber-800">
                  🏫 Trường PH tự gõ (chưa có trong danh mục): {tq.truong_tu_go.map((t) => `${t.ten} (${t.so_hen})`).join(' · ')}{' '}
                  <button onClick={() => setTab('cai_dat')} className="underline">Thêm vào danh mục</button>
                </div>
              )}
              {tq.lo_hen.length > 0 && (
                <div>
                  <div className="mb-1 text-[13px] text-amber-800">⚠ {tq.lo_hen.length} hẹn đã qua giờ mà chưa đến test — gọi PH rồi đổi lịch hoặc huỷ:</div>
                  <div className="space-y-1.5">{tq.lo_hen.map((h) => <DongHen key={h.id} h={h} hienNgay onDoi={() => setDoi(h)} onHuy={() => setHuy(h)} />)}</div>
                </div>
              )}
            </div>
          )}

          {tq.buoi.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-[14px] text-slate-400">
              Chưa có khung lịch test. <button onClick={() => setTab('cai_dat')} className="text-indigo-600 underline">Dựng khung tuần</button>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {tq.buoi.map((b) => (
                <div key={b.khung_id + b.ngay} className={`rounded-2xl border bg-white shadow-sm ${b.dong ? 'border-slate-200 opacity-70' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                    <div className="text-[15px] font-semibold text-slate-800">{THU_NGAN[b.thu]} {ddmm(b.ngay)}</div>
                    <div className="text-[13px] text-slate-500">{b.tu}–{b.den}{b.phong && ` · ${b.phong}`}</div>
                    {b.hen.length > 0 && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[12px] font-semibold text-indigo-700">{b.hen.length} hẹn</span>}
                    {b.dong && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[12px] text-slate-600">Đã đóng</span>}
                    {b.khung_da_xoa && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[12px] text-slate-600">Khung đã bỏ</span>}
                    {!b.khung_da_xoa && (
                      <button onClick={() => toggleDong(b.khung_id, b.ngay, b.dong)} className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] text-slate-500 hover:border-indigo-300">
                        {b.dong ? 'Mở lại buổi' : 'Đóng buổi'}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 p-3">
                    {b.hen.length === 0 ? <div className="px-1 text-[13px] text-slate-300">Chưa có hẹn</div>
                      : b.hen.map((h) => <DongHen key={h.id} h={h} onDoi={() => setDoi(h)} onHuy={() => setHuy(h)} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : <CaiDat tq={tq} onDoi={() => tai()} />}

      {moForm && (
        <Modal title={vuaDk ? 'Đã đăng ký' : 'Đăng ký test thay phụ huynh'} onClose={() => setMoForm(false)} maxW="max-w-[720px]">
          {vuaDk ? (
            <div>
              <div className="mb-3 text-[15px] text-slate-700"><b>{vuaDk.ho_ten_hs}</b> · {vuaDk.ten_lop}</div>
              {vuaDk.mon.map((m) => (
                <div key={m.mon} className="mb-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[14px] text-emerald-800">
                  {m.mon}: {THU_NGAN[m.thu]} {ddmm(m.ngay)} · {m.gio_bat_dau} → xong dự kiến <b>{m.gio_xong}</b>{m.dang_ky_lai && ' (đăng ký lại — lịch cũ đã huỷ)'}
                </div>
              ))}
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setVuaDk(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-[14px] text-slate-600">Đăng ký em khác</button>
                <button onClick={() => setMoForm(false)} className="rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-semibold text-white">Xong</button>
              </div>
            </div>
          ) : <DangKyTestForm onHuy={() => setMoForm(false)} onXong={(kq) => { setVuaDk(kq); tai() }} />}
        </Modal>
      )}
      {doi && <DoiLichModal h={doi} onClose={() => setDoi(null)} onXong={(r) => {
        setDoi(null)
        vaHen(doi.id, (h) => ({ ...h, ...r, tinh_trang: 'cho' }))
        tai() // buổi có thể đổi chỗ ⇒ refetch nền, list cũ giữ nguyên tới khi có list mới
      }} />}
      {huy && <HuyModal h={huy} onClose={() => setHuy(null)} onXong={() => { vaHen(huy.id, () => null); setHuy(null) }} />}
    </div>
  )
}

function DongHen({ h, hienNgay, onDoi, onHuy }: { h: Hen; hienNgay?: boolean; onDoi: () => void; onHuy: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-slate-100 bg-white px-3 py-2">
      <div className="w-[96px] text-[13px] font-semibold text-slate-700">{hienNgay && `${ddmm(h.ngay)} · `}{h.gio_bat_dau}–{h.gio_xong}</div>
      <div className="min-w-[160px] flex-1">
        <div className="text-[14px] font-medium text-slate-800">{h.ho_ten_hs} <span className="text-[12px] font-normal text-slate-400">{h.ma_uv} · {h.ten_lop}</span></div>
        <div className="text-[12px] text-slate-500">{h.mon} · {h.sdt_ph} · {h.truong}{h.truong_tu_go && ' ✎'} · {h.nguon === 'web' ? 'Web' : `Nhập thay (${KENH_TEN[h.kenh ?? 'khac']})`}</div>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${TT[h.tinh_trang].cls}`}>{TT[h.tinh_trang].ten}</span>
      {h.tinh_trang !== 'da_den' && (
        <div className="flex gap-1">
          <button onClick={onDoi} className="rounded-lg border border-slate-200 px-2 py-1 text-[12px] text-slate-600 hover:border-indigo-300">Đổi lịch</button>
          <button onClick={onHuy} className="rounded-lg border border-slate-200 px-2 py-1 text-[12px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Huỷ</button>
        </div>
      )}
    </div>
  )
}

function DoiLichModal({ h, onClose, onXong }: { h: Hen; onClose: () => void; onXong: (r: { khung_id: string; ngay: string; gio_bat_dau: string; gio_xong: string }) => void }) {
  const [fd, setFd] = useState<FormData | null>(null)
  const [chon, setChon] = useState<{ khung_id: string; ngay: string; gio_bat_dau: string | null } | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [dang, setDang] = useState(false)
  useEffect(() => { getFormDangKy().then(setFd).catch((e) => setLoi(e.message)) }, [])
  const chip = (on: boolean, dis = false) => `rounded-xl border px-3 py-2 text-[14px] font-medium ${dis ? 'cursor-not-allowed border-slate-100 text-slate-300' : on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`
  async function luu() {
    if (!chon?.gio_bat_dau) return
    setDang(true); setLoi(null)
    try { onXong(await doiLichHen(h.id, chon.khung_id, chon.ngay, chon.gio_bat_dau)) } catch (e: any) { setLoi(e.message) } finally { setDang(false) }
  }
  return (
    <Modal title={`Đổi lịch — ${h.ho_ten_hs} · ${h.mon} (${h.thoi_luong_phut}′)`} onClose={onClose} maxW="max-w-[680px]">
      <div className="mb-3 text-[13px] text-slate-500">Đang hẹn: {ddmm(h.ngay)} · {h.gio_bat_dau}–{h.gio_xong}</div>
      {!fd ? <div className="text-[14px] text-slate-400">{loi ?? 'Đang tải…'}</div>
        : <LichMon fd={fd} tl={h.thoi_luong_phut} chon={chon} onChon={setChon} biChong={() => false} chip={chip} />}
      {loi && fd && <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{loi}</div>}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-[14px] text-slate-600">Đóng</button>
        <button onClick={luu} disabled={!chon?.gio_bat_dau || dang} className={`rounded-xl px-4 py-2 text-[14px] font-semibold ${chon?.gio_bat_dau && !dang ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>Lưu lịch mới</button>
      </div>
    </Modal>
  )
}

function HuyModal({ h, onClose, onXong }: { h: Hen; onClose: () => void; onXong: () => void }) {
  const [lyDo, setLyDo] = useState('')
  const [loi, setLoi] = useState<string | null>(null)
  const GOI_Y = ['PH báo không đến', 'Gọi không được', 'PH đổi ý', 'Trùng đăng ký']
  async function luu() { try { await huyHen(h.id, lyDo); onXong() } catch (e: any) { setLoi(e.message) } }
  return (
    <Modal title={`Huỷ hẹn — ${h.ho_ten_hs} · ${h.mon}`} onClose={onClose}>
      <div className="mb-2 flex flex-wrap gap-1.5">{GOI_Y.map((g) => <button key={g} onClick={() => setLyDo(g)} className={`rounded-lg border px-2.5 py-1 text-[13px] ${lyDo === g ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{g}</button>)}</div>
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[14px]" placeholder="Lý do huỷ" value={lyDo} onChange={(e) => setLyDo(e.target.value)} />
      <div className="mt-2 text-[12px] text-slate-400">Huỷ hẹn không loại ứng viên — muốn loại thì làm ở phễu L5.</div>
      {loi && <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{loi}</div>}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-[14px] text-slate-600">Đóng</button>
        <button onClick={luu} disabled={!lyDo.trim()} className={`rounded-xl px-4 py-2 text-[14px] font-semibold ${lyDo.trim() ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>Huỷ hẹn</button>
      </div>
    </Modal>
  )
}

// ── Cài đặt ──
function CaiDat({ tq, onDoi }: { tq: TongQuan; onDoi: () => void }) {
  const [khung, setKhung] = useState<Khung[]>([])
  const [truong, setTruong] = useState<Truong[]>([])
  const [tl, setTl] = useState(tq.mon_theo_lop)
  const [thu, setThu] = useState(6)
  const [tu, setTu] = useState('08:00')
  const [den, setDen] = useState('11:00')
  const [tenTruong, setTenTruong] = useState('')
  const [capTruong, setCapTruong] = useState<Cap[]>(['thcs'])
  const [loi, setLoi] = useState<string | null>(null)
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [phongId, setPhongId] = useState<string>('')
  const [trung, setTrung] = useState<TrungPhong[]>([])
  useEffect(() => { listKhung().then(setKhung).catch(() => {}); listTruong().then(setTruong).catch(() => {}); listPhong().then(setPhongs).catch(() => {}) }, [])
  // Báo trùng phòng ngay khi chọn (DB cũng chặn lúc lưu)
  useEffect(() => {
    if (!phongId || !(den > tu)) { setTrung([]); return }
    let alive = true
    khungTrungPhong(phongId, thu, tu, den).then((r) => { if (alive) setTrung(r) }).catch(() => { if (alive) setTrung([]) })
    return () => { alive = false }
  }, [phongId, thu, tu, den])
  const biChan = trung.some((t) => t.muc === 'chan')
  useEffect(() => { setTl(tq.mon_theo_lop) }, [tq])

  const lops = useMemo(() => [...new Set(tl.map((x) => x.lop))], [tl])
  const tenLop = (l: string) => tl.find((x) => x.lop === l)?.ten ?? l
  const mons = useMemo(() => [...new Set(tl.map((x) => x.mon))].sort(), [tl])
  const run = async (f: () => Promise<void>) => { setLoi(null); try { await f() } catch (e: any) { setLoi(e.message ?? String(e)) } }

  const box = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
  const inp = 'rounded-lg border border-slate-300 px-2.5 py-1.5 text-[14px]'
  return (
    <div className="space-y-4">
      {loi && <div className="rounded-xl bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{loi}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={box}>
          <div className="mb-1 text-[15px] font-semibold text-slate-800">Khung lịch test cố định (lặp mỗi tuần)</div>
          <div className="mb-3 text-[12px] text-slate-400">Mỗi khung 1 phòng, giữ trọn khung trên Lịch phòng. PH chọn giờ bắt đầu trong khung, bước 15 phút; bài phải xong trước giờ kết thúc khung. Áp cho mọi môn.</div>
          <div className="mb-3 space-y-1.5">
            {khung.length === 0 && <div className="text-[13px] text-slate-300">Chưa có khung nào</div>}
            {khung.map((k) => (
              <div key={k.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[14px]">
                <b className="w-[80px] text-slate-700">{THU_TEN[k.thu]}</b><span className="text-slate-600">{hm(k.gio_bat_dau)}–{hm(k.gio_ket_thuc)}</span><span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[12px] font-medium text-sky-700">{k.phong?.ten_phong ?? '?'}</span>
                <button onClick={() => { if (confirm(`Bỏ khung ${THU_TEN[k.thu]} ${hm(k.gio_bat_dau)}–${hm(k.gio_ket_thuc)}? Hẹn đã đặt vẫn giữ nguyên.`)) run(async () => { await boKhung(k.id); setKhung((p) => p.filter((x) => x.id !== k.id)); onDoi() }) }}
                  className="ml-auto text-[12px] text-slate-400 hover:text-rose-600">Bỏ khung</button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className={inp} value={thu} onChange={(e) => setThu(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6, 7].map((t) => <option key={t} value={t}>{THU_TEN[t]}</option>)}</select>
            <input type="time" step={900} className={inp} value={tu} onChange={(e) => setTu(e.target.value)} />
            <span className="text-slate-400">→</span>
            <input type="time" step={900} className={inp} value={den} onChange={(e) => setDen(e.target.value)} />
            <select className={inp} value={phongId} onChange={(e) => setPhongId(e.target.value)}>
              <option value="">— Phòng —</option>
              {phongs.map((p) => <option key={p.id} value={p.id}>{p.ten_phong}{p.ten_phong !== p.ma_phong ? ` (${p.ma_phong})` : ''}</option>)}
            </select>
            <button disabled={!phongId || biChan} onClick={() => run(async () => { const k = await themKhung(thu, tu, den, phongId); setKhung((p) => [...p, k].sort((a, b) => a.thu - b.thu || a.gio_bat_dau.localeCompare(b.gio_bat_dau))); setTrung([]); onDoi() })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[14px] font-medium text-white disabled:bg-slate-200 disabled:text-slate-400">+ Thêm khung</button>
          </div>
          {trung.length > 0 && (
            <div className="mt-2 space-y-1 text-[12px]">
              {biChan && <div className="font-medium text-rose-700">Phòng đã có lịch cố định trùng giờ — chọn phòng hoặc giờ khác:</div>}
              {trung.map((t, i) => (
                <div key={i} className={`rounded-lg px-2.5 py-1 ${t.muc === 'chan' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>
                  {t.muc === 'chan' ? '⛔' : '⚠'} {t.mo_ta}{t.muc === 'canh_bao' && ' — buổi lẻ, vẫn lưu được, nhớ dời'}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={box}>
          <div className="mb-1 text-[15px] font-semibold text-slate-800">Thời lượng bài test (lớp × môn)</div>
          <div className="mb-3 text-[12px] text-slate-400">Môn hiện theo lớp đang mở ở trung tâm. Ô trống = môn đó <b>chưa mở đăng ký trên web</b>. PH thấy "Bài test dự kiến … phút" và giờ xong.</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-slate-500"><th className="py-1 pr-2 font-medium">Lớp</th>{mons.map((m) => <th key={m} className="px-1 py-1 font-medium">{m}</th>)}</tr></thead>
              <tbody>
                {lops.map((l) => (
                  <tr key={l} className="border-t border-slate-100">
                    <td className="whitespace-nowrap py-1.5 pr-2 font-semibold text-slate-700">{tenLop(l)}</td>
                    {mons.map((m) => {
                      const o = tl.find((x) => x.lop === l && x.mon === m)
                      if (!o) return <td key={m} className="px-1 text-slate-200">—</td>
                      return (
                        <td key={m} className="px-1 py-1">
                          <select value={o.thoi_luong_phut ?? ''} onChange={(e) => { const v = Number(e.target.value); run(async () => { await datThoiLuong(l, m, v); setTl((p) => p.map((x) => x.lop === l && x.mon === m ? { ...x, thoi_luong_phut: v } : x)); onDoi() }) }}
                            className={`rounded-lg border px-1.5 py-1 ${o.thoi_luong_phut ? 'border-slate-200' : 'border-amber-300 bg-amber-50'}`}>
                            {!o.thoi_luong_phut && <option value="">chưa khai</option>}
                            {THOI_LUONG_TEST.map((p) => <option key={p} value={p}>{p}′</option>)}
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={box}>
        <div className="mb-1 text-[15px] font-semibold text-slate-800">Danh mục trường ({truong.length})</div>
        <div className="mb-3 text-[12px] text-slate-400">PH chỉ thấy trường đúng cấp của lớp đã chọn (trường liên cấp hiện ở mọi lớp). Không có thì PH chọn "Trường khác" và gõ — hiện ở mục Cần xử lý để thêm vào đây.</div>
        {tq.truong_tu_go.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tq.truong_tu_go.map((t) => <button key={t.ten} onClick={() => setTenTruong(t.ten)} className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-2.5 py-1 text-[13px] text-amber-800">PH gõ: {t.ten} ({t.so_hen}) → điền</button>)}
          </div>
        )}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input className={`${inp} min-w-[240px] flex-1`} placeholder="Tên trường (vd THCS Tây Mỗ 3)" value={tenTruong} onChange={(e) => setTenTruong(e.target.value)} />
          {(Object.keys(CAP_TEN) as Cap[]).map((c) => (
            <label key={c} className="flex items-center gap-1 text-[13px] text-slate-600">
              <input type="checkbox" checked={capTruong.includes(c)} onChange={() => setCapTruong((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])} />{CAP_TEN[c]}
            </label>
          ))}
          <button disabled={tenTruong.trim().length < 2} onClick={() => run(async () => {
            const t = await themTruong(tenTruong, capTruong.length === 3 ? [] : capTruong)
            setTruong((p) => [...p, t].sort((a, b) => a.ten.localeCompare(b.ten, 'vi'))); setTenTruong(''); onDoi()
          })} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[14px] font-medium text-white disabled:bg-slate-200 disabled:text-slate-400">+ Thêm trường</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {truong.map((t) => (
            <span key={t.id} className="group inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[13px] text-slate-700">
              {t.ten}<span className="text-[11px] text-slate-400">{t.cap.length ? t.cap.map((c) => CAP_TEN[c]).join('+') : 'liên cấp'}</span>
              <button title="Ẩn khỏi danh sách" onClick={() => { if (confirm(`Ẩn "${t.ten}" khỏi danh sách chọn?`)) run(async () => { await anTruong(t.id); setTruong((p) => p.filter((x) => x.id !== t.id)) }) }}
                className="ml-0.5 text-slate-300 hover:text-rose-600">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
