// Bổ trợ › Lịch khối = XẾP LỊCH BỔ TRỢ KHỐI (Thùy 10/11; trước đó là tab "Lịch trực" — form nhập không có phòng, không báo trùng).
// Lịch trực TA = NGUỒN LỰC CHUNG của các loại bổ trợ (spec-xep-bo-tro-chung.md §2), lặp hằng tuần, đơn vị = 30' × 1 TA.
// Màn = (1) LƯỚI LỊCH PHÒNG y hệt Bổ trợ… Quản lý phòng › Tổng quan phòng (cùng component TongQuanTuanScreen, cùng nguồn DB fn_phong_lich)
//       — bấm ô trống = xếp vào đúng ngày/phòng/giờ đó, bấm ô bổ trợ khối = sửa · (2) nút "+ Thêm lịch bổ trợ" → popup (LichKhoiModal)
//       · (3) danh sách lịch khối đang hiệu lực (lọc môn/khối, "chưa có phòng").
// Lưu → DB ghi lich_truc_bo_tro ⇒ Tổng quan phòng tự thấy (cùng hàm), không có bản sao nào phải đồng bộ.
// Sau lưu: vá đúng dòng trong danh sách + nạp lại NỀN lưới phòng (CLAUDE.md §2), không trắng màn.
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { listLichTruc, ketThucLichTruc, type LichTruc } from '../../lib/botro_yeu'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listPhong, type Phong, type KhoiBanPhong, type LichKhoiInput } from '../../lib/phong'
import { homNayVN, ddmmVN } from '../../lib/tuan'
import TongQuanTuanScreen from '../phonghoc/TongQuanTuanScreen'
import LichKhoiModal, { THU_TEN, thuTuNgay, type LopNho } from './LichKhoiModal'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
// rời tab rồi quay lại = đúng chỗ cũ
const NHO: { ngayDau: string | null; mon: string; khoi: string; chuaPhong: boolean } = { ngayDau: null, mon: '', khoi: '', chuaPhong: false }

async function layLichTruc(id: string): Promise<LichTruc> {
  const { data, error } = await supabase.from('lich_truc_bo_tro').select('*, lop:lop_id(ten_lop), ns:nhan_su_id(ho_ten), ns2:nhan_su_2_id(ho_ten)').eq('id', id).single()
  if (error) throw error
  const { lop, ns, ns2, ...r } = data as any
  return { ...r, lop_ten: lop?.ten_lop ?? null, nhan_su_ten: ns?.ho_ten ?? null, nhan_su_2_ten: ns2?.ho_ten ?? null }
}
const sangInput = (r: LichTruc): LichKhoiInput => ({
  id: r.id, mon: r.mon, khoi: r.khoi, bac: r.bac, thu: r.thu, gio_bat_dau: hhmm(r.gio_bat_dau), gio_ket_thuc: hhmm(r.gio_ket_thuc),
  phong: r.phong ?? '', so_ta: r.so_ta, nhan_su_id: r.nhan_su_id ?? '', nhan_su_2_id: r.nhan_su_2_id, suc_chua: r.suc_chua, hieu_luc_tu: String(r.hieu_luc_tu).slice(0, 10), ghi_chu: r.ghi_chu,
})

export default function LichTrucScreen() {
  const homNay = homNayVN()
  const [rows, setRows] = useState<LichTruc[]>([])
  const [lops, setLops] = useState<LopNho[]>([])
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [lamMoi, setLamMoi] = useState(0)
  const [monF, setMonF] = useState(NHO.mon)
  const [khoiF, setKhoiF] = useState(NHO.khoi)
  const [chuaPhong, setChuaPhong] = useState(NHO.chuaPhong)
  const [modal, setModal] = useState<{ init: Partial<LichKhoiInput>; cu: LichKhoiInput | null } | null>(null)
  const [vuaLuu, setVuaLuu] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      listLichTruc(),
      supabase.from('lop').select('mon, khoi').eq('trang_thai', 'dang_hoc').limit(1000).then(({ data }) => (data ?? []) as LopNho[]),
    ]).then(([r, l]) => { setRows(r); setLops(l) }).catch((e: any) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false))
    listNhanSu().then((l) => setNss(l.filter((n) => n.trang_thai === 'dang_lam'))).catch(() => {})
    listPhong().then(setPhongs).catch(() => {})
  }, [])
  useEffect(() => { NHO.mon = monF; NHO.khoi = khoiF; NHO.chuaPhong = chuaPhong }, [monF, khoiF, chuaPhong])

  const conHieuLuc = (r: LichTruc) => !r.hieu_luc_den || String(r.hieu_luc_den).slice(0, 10) >= homNay
  const dangHL = useMemo(() => rows.filter(conHieuLuc), [rows]) // eslint-disable-line react-hooks/exhaustive-deps
  const mons = useMemo(() => [...new Set(dangHL.map((r) => r.mon))].sort(), [dangHL])
  const khois = useMemo(() => [...new Set(dangHL.filter((r) => !monF || r.mon === monF).map((r) => r.khoi))].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true })), [dangHL, monF])
  const hien = useMemo(() => dangHL
    .filter((r) => (!monF || r.mon === monF) && (!khoiF || r.khoi === khoiF) && (!chuaPhong || !r.phong))
    .sort((a, b) => a.mon.localeCompare(b.mon) || a.khoi.localeCompare(b.khoi, 'vi', { numeric: true }) || a.thu - b.thu || a.gio_bat_dau.localeCompare(b.gio_bat_dau)),
  [dangHL, monF, khoiF, chuaPhong])
  const soChuaPhong = dangHL.filter((r) => !r.phong).length // đếm dòng đang render cho badge

  const moThem = (init: Partial<LichKhoiInput> = {}) => setModal({ init: { mon: monF || 'Toán', khoi: khoiF || undefined, ...init }, cu: null })
  const moSua = (r: LichTruc) => { const x = sangInput(r); setModal({ init: x, cu: x }) }

  async function daLuu(id: string) {
    setModal(null)
    try {
      const r = await layLichTruc(id)
      setRows((prev) => prev.some((x) => x.id === id) ? prev.map((x) => x.id === id ? r : x) : [...prev, r])
      setVuaLuu(id); setTimeout(() => setVuaLuu((v) => (v === id ? null : v)), 2500)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
    setLamMoi((n) => n + 1)
  }
  async function ketThuc(r: LichTruc) {
    if (!confirm(`Kết thúc lịch bổ trợ khối ${THU_TEN[r.thu]} ${hhmm(r.gio_bat_dau)}–${hhmm(r.gio_ket_thuc)} (khối ${r.khoi} · ${r.mon}) từ hôm nay? Buổi đã xếp không ảnh hưởng.`)) return
    try { await ketThucLichTruc(r.id, homNay); setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, hieu_luc_den: homNay } : x)); setLamMoi((n) => n + 1) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  function chonKhoi(ks: KhoiBanPhong[]) {
    const k = ks.find((x) => x.ref_id.startsWith('lt-'))
    if (!k) return
    const id = k.ref_id.slice(3, 39)
    const r = rows.find((x) => x.id === id)
    if (r) moSua(r)
  }

  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[13px] outline-none focus:border-teal-500'
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-[#f5f5f7]">
      <div className="mx-auto max-w-[1600px] px-6 pt-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-slate-800">Xếp lịch bổ trợ khối</h1>
            <p className="mt-1 max-w-[900px] text-[13px] text-slate-500">Lịch trực hằng tuần theo khối — giờ · phòng · người trực. Lưới dưới là <b>lịch phòng chung của BK</b> (giống Quản lý phòng › Tổng quan phòng):
              xếp ở đây thì Tổng quan phòng thấy ngay; chỗ nào trùng phòng/người trực hệ báo trước khi lưu. Bấm ô trống để xếp đúng ngày–phòng–giờ đó.</p>
          </div>
          <button onClick={() => moThem()} className="rounded-xl bg-teal-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-teal-700">+ Thêm lịch bổ trợ</button>
        </header>
      </div>

      <div className="mx-6 mt-4 h-[62vh] min-h-[420px] overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <TongQuanTuanScreen mauTheo="nguon" lamMoi={lamMoi} ngayDau={NHO.ngayDau ?? undefined} onDoiNgay={(d) => { NHO.ngayDau = d }}
          moTa={<p className="mb-3 text-[12.5px] text-slate-500">Mỗi ngày chia cột theo phòng, khung 30 phút. <b className="text-teal-700">Xanh đậm = bổ trợ khối</b> (bấm để sửa) · vàng = bổ trợ lẻ · nhạt = chính khoá / test / phát sinh. Ô có số = nhiều hoạt động cùng lúc. Rê chuột để xem chi tiết.</p>}
          onChonO={({ ngay, phongMa, gio }) => moThem({ thu: thuTuNgay(ngay), gio_bat_dau: gio, phong: phongMa, hieu_luc_tu: ngay < homNay ? homNay : ngay })}
          onChonKhoi={chonKhoi} />
      </div>

      <div className="mx-6 my-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="mr-2 text-[13px] font-bold uppercase tracking-wide text-slate-500">Lịch bổ trợ khối đang hiệu lực ({dangHL.length})</h2>
          <select value={monF} onChange={(e) => { setMonF(e.target.value); setKhoiF('') }} className={sel}><option value="">Mọi môn</option>{mons.map((m) => <option key={m} value={m}>{m}</option>)}</select>
          <select value={khoiF} onChange={(e) => setKhoiF(e.target.value)} className={sel}><option value="">Mọi khối</option>{khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select>
          <button onClick={() => setChuaPhong((v) => !v)} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${chuaPhong ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'}`}>Chưa có phòng ({soChuaPhong})</button>
        </div>
        {loi && <p className="mb-2 text-[12px] text-rose-600">{loi}</p>}
        {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : hien.length === 0 ? (
          <p className="text-[13px] text-slate-400">Không có dòng nào khớp bộ lọc. Bấm "+ Thêm lịch bổ trợ" hoặc bấm ô trống trên lưới.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400"><th className="py-1.5">Môn</th><th>Khối · bậc</th><th>Thứ · giờ</th><th>Phòng</th><th>Người trực</th><th>Đơn vị</th><th>Sức chứa</th><th>Từ ngày</th><th></th></tr></thead>
            <tbody>
              {hien.map((r) => (
                <tr key={r.id} className={`border-t border-slate-100 transition-colors ${vuaLuu === r.id ? 'bg-teal-50' : ''}`}>
                  <td className="py-2 font-medium text-slate-700">{r.mon}</td>
                  <td><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Khối {r.khoi}</span> <span className="text-[11px] font-bold text-slate-400">{r.bac}</span></td>
                  <td className="font-semibold text-slate-800">{THU_TEN[r.thu]} · {hhmm(r.gio_bat_dau)}–{hhmm(r.gio_ket_thuc)}</td>
                  <td>{r.phong ? <span className="font-semibold text-teal-700">{r.phong}</span> : <button onClick={() => moSua(r)} className="rounded-md bg-amber-50 px-2 py-0.5 text-[11.5px] font-semibold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100">chưa có phòng — gán</button>}</td>
                  <td>{r.nhan_su_ten ?? <span className="text-slate-400">chưa phân</span>}{r.so_ta === 2 && <> + {r.nhan_su_2_ten ?? <span className="text-slate-400">?</span>}</>}</td>
                  <td><span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700" title="1 đơn vị = 30' × 1 TA">{r.don_vi ?? '—'} đv</span></td>
                  <td>{r.suc_chua}</td>
                  <td className="text-[12px] text-slate-500">{ddmmVN(String(r.hieu_luc_tu).slice(0, 10))}</td>
                  <td className="whitespace-nowrap text-right">
                    <button onClick={() => moSua(r)} className="mr-3 text-[12px] font-medium text-teal-700 hover:underline">Sửa</button>
                    <button onClick={() => ketThuc(r)} className="text-[12px] text-slate-400 hover:text-rose-600">Kết thúc</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && <LichKhoiModal init={modal.init} cu={modal.cu} lops={lops} nss={nss} phongs={phongs} onClose={() => setModal(null)} onSaved={daLuu} />}
    </section>
  )
}
