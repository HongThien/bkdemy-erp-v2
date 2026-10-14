// ============================================================================
// LuongTaScreen — "Lương trợ giảng" (lá `ta_luong`, spec-cham-cong-ta.md §7, Thùy chốt 12–14/10).
//   · Bảng lương: theo tháng, mỗi TA một dòng (theo lớp · bổ trợ · ngoài package · phạt · thực nhận), mở xem chi tiết.
//     Nguồn công thức DUY NHẤT = fn_ta_luong_thang (chỉ việc đã duyệt thuộc ca đã duyệt; lớp chủ theo phân công
//     TRONG kỳ; %TG mẫu số = cả tháng). Client KHÔNG cộng/tính tiền (CLAUDE.md §2.0).
//   · Đơn giá: bảng chỉ-thêm-dòng có ngày hiệu lực; đổi giá = thêm dòng mới, dòng cũ giữ để xem lại.
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { homNayVN, congNgay, ddmmVN } from '../../lib/tuan'
import { luongThang, bangDonGia, datDonGia, dsLoaiViec, type LuongThang, type DonGia, type LoaiViec } from '../../lib/tacong'

type Tab = 'luong' | 'gia'
const inputCls = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400'
const btnPrimary = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnGhost = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50'
const card = 'rounded-xl border border-slate-200 bg-white shadow-sm'
const tien = (n: number | null | undefined) => Math.round(Number(n) || 0).toLocaleString('vi-VN')
const so = (n: number | null | undefined) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('vi-VN')
const pct = (n: number | null | undefined) => so((Number(n) || 0) * 100) + '%'
const loiCua = (e: unknown) => (e as { message?: string })?.message ?? String(e)
const dauThang = (d: string) => d.slice(0, 8) + '01'

export default function LuongTaScreen() {
  const quyen = useStore((s) => s.quyen)
  const coGhi = !!quyen && (quyen.laAdmin || (quyen.chucNang.includes('ta_luong') && !quyen.chiXem.includes('ta_luong')))
  const [tab, setTab] = useState<Tab>('luong')
  const [toast, setToast] = useState<{ ok: boolean; t: string } | null>(null)
  const bao = useCallback((t: string, ok = true) => { setToast({ ok, t }); setTimeout(() => setToast(null), ok ? 2500 : 6000) }, [])
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
        <h1 className="mr-2 text-base font-semibold text-slate-800">Lương trợ giảng</h1>
        {([['luong', 'Bảng lương'], ['gia', 'Đơn giá']] as [Tab, string][]).map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-sm font-medium transition ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
        ))}
        {!coGhi && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Chỉ xem</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
        {tab === 'luong' && <TabLuong bao={bao} />}
        {tab === 'gia' && <TabGia coGhi={coGhi} bao={bao} />}
      </div>
      {toast && <div className={`fixed bottom-4 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-2xl px-4 py-2 text-sm text-white shadow-lg ${toast.ok ? 'bg-slate-900/90' : 'bg-red-700/95'}`}>{toast.t}</div>}
    </div>
  )
}

// ═══════════════════════════════ BẢNG LƯƠNG ═══════════════════════════════
function TabLuong({ bao }: { bao: (t: string, ok?: boolean) => void }) {
  const [ky, setKy] = useState(dauThang(homNayVN()))
  const [rows, setRows] = useState<LuongThang[] | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [tenLoai, setTenLoai] = useState<Record<string, string>>({})
  useEffect(() => { dsLoaiViec().then((d) => setTenLoai(Object.fromEntries(d.map((x) => [x.ma, x.ten])))).catch(() => {}) }, [])
  useEffect(() => { setRows(null); setMo(null); luongThang(ky).then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }) }, [ky, bao])
  const [y, m] = ky.split('-')
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        <button className={btnGhost} onClick={() => setKy(dauThang(congNgay(ky, -1)))}>‹</button>
        <span className="min-w-[110px] text-center text-sm font-semibold text-slate-800">Tháng {Number(m)}/{y}</span>
        <button className={btnGhost} disabled={ky >= dauThang(homNayVN())} onClick={() => setKy(dauThang(congNgay(ky, 32)))}>›</button>
        <span className="ml-auto text-xs text-slate-500">Tạm tính từ dữ liệu đã duyệt tới hiện tại · hạn duyệt/sửa: ngày 3 tháng sau</span>
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[900px] border-collapse text-sm tabular-nums">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Trợ giảng</th><th className="px-3 py-2 text-right">Theo lớp (TG 40% · BTVN 20%)</th><th className="px-3 py-2 text-right">Bổ trợ (40%)</th>
            <th className="px-3 py-2 text-right">Ngoài package</th><th className="px-3 py-2 text-right">Phạt</th><th className="px-3 py-2 text-right">Thực nhận</th><th className="w-20 px-3 py-2"></th>
          </tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={7} className="p-6 text-center text-slate-400">Đang tính…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate-400">Tháng này chưa có dữ liệu lương.</td></tr>}
            {rows?.map((r) => (
              <FragmentLuong key={r.nhan_su_id} r={r} mo={mo === r.nhan_su_id} onMo={() => setMo(mo === r.nhan_su_id ? null : r.nhan_su_id)} tenLoai={tenLoai} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Chỉ tính việc đã duyệt thuộc ca đã duyệt. %Trợ giảng = buổi TA có công ÷ số buổi CẢ THÁNG của lớp (TA phân công giữa tháng chỉ nhận phần buổi mình làm). Lớp của TA = lớp được phân công vào bất kỳ ngày nào trong tháng + lớp TA dạy hộ. BTVN lấy thẳng từ người chấm trên ERP.</p>
    </div>
  )
}

function FragmentLuong({ r, mo, onMo, tenLoai }: { r: LuongThang; mo: boolean; onMo: () => void; tenLoai: Record<string, string> }) {
  const bt = r.chi_tiet.bo_tro
  return (
    <>
      <tr className="border-t border-slate-100">
        <td className="px-3 py-2 font-semibold text-slate-800">{r.ho_ten}</td>
        <td className="px-3 py-2 text-right">{tien(r.package_lop)}</td>
        <td className="px-3 py-2 text-right">{tien(r.bo_tro_tien)}<div className="text-[11px] text-slate-500">{so(r.bo_tro_gio)}/{so(bt.chi_tieu)} giờ</div></td>
        <td className="px-3 py-2 text-right">{tien(r.ngoai_package)}{r.chi_tiet.ngoai_package.some((x) => x.thieu_don_gia) && <div className="text-[11px] text-amber-700">có việc chưa có giá</div>}</td>
        <td className="px-3 py-2 text-right">{Number(r.tien_phat) > 0 ? <span className="text-red-600">−{tien(r.tien_phat)}</span> : '—'}</td>
        <td className="px-3 py-2 text-right font-bold text-slate-900">{tien(r.net)}</td>
        <td className="px-3 py-2"><button className={btnGhost} onClick={onMo}>{mo ? 'Thu gọn' : 'Chi tiết'}</button></td>
      </tr>
      {mo && (
        <tr><td colSpan={7} className="bg-slate-50 px-3 pb-3 pt-1">
          <table className="w-full border-collapse text-[13px] tabular-nums">
            <thead><tr className="text-left text-[11px] uppercase text-slate-500">
              <th className="py-1 pr-2">Lớp</th><th className="py-1 pr-2 text-right">Sĩ số TB · bậc</th><th className="py-1 pr-2 text-right">Trợ giảng</th><th className="py-1 pr-2 text-right">BTVN</th><th className="py-1 text-right">Tiền</th>
            </tr></thead>
            <tbody>
              {r.chi_tiet.lop.map((x) => (
                <tr key={x.lop} className="border-t border-slate-200">
                  <td className="py-1 pr-2 font-medium text-slate-800">{x.lop} {!x.la_chu && <span className="rounded-full bg-indigo-50 px-1.5 text-[11px] text-indigo-700">dạy hộ</span>}</td>
                  <td className="py-1 pr-2 text-right">{so(x.si_tb)} HS · {tien(x.bac)}</td>
                  <td className="py-1 pr-2 text-right">{x.tg_lam}/{x.so_buoi} · {pct(x.ti_le_tg)}</td>
                  <td className="py-1 pr-2 text-right">{x.btvn_lam}/{x.btvn_dinh_muc} · {pct(x.ti_le_btvn)}</td>
                  <td className="py-1 text-right">{tien(x.tien)}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200">
                <td className="py-1 pr-2 font-medium text-slate-800">Bổ trợ</td>
                <td className="py-1 pr-2 text-right" colSpan={3}>{so(bt.gio)} giờ ÷ ({bt.so_lop} lớp × {so(bt.chi_tieu_moi_lop)} giờ) = {pct(bt.ti_le)} · Σ bậc {tien(bt.tong_bac)}</td>
                <td className="py-1 text-right">{tien(bt.tien)}</td>
              </tr>
              {r.chi_tiet.ngoai_package.map((x, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="py-1 pr-2 text-slate-800" colSpan={4}>{tenLoai[x.loai] ?? x.loai}{x.lop ? ' ' + x.lop : ''} · {ddmmVN(x.ngay)} · {so(x.so_luong)} × {x.thieu_don_gia ? <span className="text-amber-700">chưa có đơn giá</span> : tien(x.don_gia)}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          {r.chi_tiet.day_thay > 0 && <p className="mt-1 text-[11px] text-slate-500">Dạy hộ lớp khác: {r.chi_tiet.day_thay} buổi (tính theo bậc và số buổi của lớp được dạy).</p>}
        </td></tr>
      )}
    </>
  )
}

// ═══════════════════════════════ ĐƠN GIÁ ═══════════════════════════════
function TabGia({ coGhi, bao }: { coGhi: boolean; bao: (t: string, ok?: boolean) => void }) {
  const [rows, setRows] = useState<DonGia[] | null>(null)
  const [loai, setLoai] = useState<LoaiViec[]>([])
  const tai = useCallback(() => bangDonGia().then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }), [bao])
  useEffect(() => { tai(); dsLoaiViec().then(setLoai).catch(() => {}) }, [tai])

  // Mục đặt giá: mọi (mã, bậc) đã có + việc ngoài package chưa có giá (vd họp, đào tạo, chấm thi)
  const muc = useMemo(() => {
    const m = new Map<string, { ma: string; ten: string; siTu: number | null; siDen: number | null }>()
    for (const r of rows ?? []) { const k = r.ma + '|' + (r.si_tu ?? ''); if (!m.has(k)) m.set(k, { ma: r.ma, ten: r.ten, siTu: r.si_tu, siDen: r.si_den }) }
    for (const l of loai.filter((x) => x.nhom === 'ngoai_package')) { const k = 'gia_' + l.ma + '|'; if (!m.has(k)) m.set(k, { ma: 'gia_' + l.ma, ten: l.ten + ' (chưa có giá)', siTu: null, siDen: null }) }
    return [...m.entries()]
  }, [rows, loai])
  const [chon, setChon] = useState('')
  const [gia, setGia] = useState('')
  const [tu, setTu] = useState(congNgay(dauThang(congNgay(dauThang(homNayVN()), 32)), 0))
  const [gc, setGc] = useState('')
  const [ban, setBan] = useState(false)
  async function them() {
    const x = muc.find(([k]) => k === chon)?.[1]
    if (!x) return
    setBan(true)
    try {
      await datDonGia(x.ma, Number(gia), tu, { ten: x.ten.replace(' (chưa có giá)', ''), siTu: x.siTu, siDen: x.siDen, ghiChu: gc })
      bao('Đã thêm giá mới — dòng cũ giữ nguyên'); setGia(''); setGc(''); tai()
    } catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  const giaTri = (r: DonGia) => (Number(r.gia_tri) < 1 && r.don_vi === 'hệ số' ? so(r.gia_tri) : tien(r.gia_tri))
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[820px] border-collapse text-sm tabular-nums">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Mục</th><th className="px-3 py-2 text-right">Giá trị</th><th className="px-3 py-2">Đơn vị</th><th className="px-3 py-2">Hiệu lực từ</th><th className="px-3 py-2">Hôm nay</th><th className="px-3 py-2">Người đặt</th><th className="px-3 py-2">Ghi chú</th>
          </tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={7} className="p-6 text-center text-slate-400">Đang tải…</td></tr>}
            {rows?.map((r, i) => (
              <tr key={r.ma + (r.si_tu ?? '') + r.hieu_luc_tu + i} className="border-t border-slate-100">
                <td className="px-3 py-1.5 text-slate-800">{r.ten}</td>
                <td className="px-3 py-1.5 text-right font-medium">{giaTri(r)}</td>
                <td className="px-3 py-1.5 text-slate-600">{r.don_vi}</td>
                <td className="whitespace-nowrap px-3 py-1.5 text-slate-600">{ddmmVN(r.hieu_luc_tu)}/{r.hieu_luc_tu.slice(0, 4)}</td>
                <td className="px-3 py-1.5">{r.dang_hieu_luc ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Đang dùng</span>
                  : r.hieu_luc_tu > homNayVN() ? <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Chưa tới hạn</span>
                  : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Đã thay</span>}</td>
                <td className="px-3 py-1.5 text-slate-600">{r.nguoi_dat ?? 'cài sẵn'}</td>
                <td className="px-3 py-1.5 text-xs text-slate-500">{r.ghi_chu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {coGhi && (
        <div className={`${card} p-3`}>
          <p className="mb-2 text-sm font-semibold text-slate-800">Thêm giá mới (dòng cũ giữ nguyên, kỳ lương dùng dòng mới nhất có hiệu lực ≤ đầu kỳ)</p>
          <div className="flex flex-wrap items-end gap-2 text-xs font-medium text-slate-500">
            <label className="flex flex-col gap-1">Mục<select className={`${inputCls} min-w-[280px]`} value={chon} onChange={(e) => setChon(e.target.value)}>
              <option value="">— chọn mục —</option>{muc.map(([k, x]) => <option key={k} value={k}>{x.ten}</option>)}
            </select></label>
            <label className="flex flex-col gap-1">Giá trị<input type="number" min={0} step="any" className={`${inputCls} w-36`} value={gia} onChange={(e) => setGia(e.target.value)} /></label>
            <label className="flex flex-col gap-1">Hiệu lực từ<input type="date" className={inputCls} value={tu} onChange={(e) => e.target.value && setTu(e.target.value)} /></label>
            <label className="flex flex-1 flex-col gap-1">Ghi chú<input className={inputCls} value={gc} onChange={(e) => setGc(e.target.value)} /></label>
            <button disabled={ban || !chon || gia === '' || !(Number(gia) >= 0)} onClick={them} className={btnPrimary}>Thêm</button>
          </div>
        </div>
      )}
    </div>
  )
}
