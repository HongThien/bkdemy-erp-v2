// ============================================================================
// LuongTaScreen — "Lương trợ giảng" (lá `ta_luong`, spec-cham-cong-ta.md §7, Thùy chốt 12–14/10).
//   · Bảng lương: theo tháng, mỗi TA một dòng (theo lớp · bổ trợ · ngoài package · phạt · thực nhận), mở xem chi tiết.
//     Nguồn công thức DUY NHẤT = fn_ta_luong_thang (chỉ việc đã duyệt thuộc ca đã duyệt; lớp chủ theo phân công
//     TRONG kỳ; %TG mẫu số = cả tháng). Client KHÔNG cộng/tính tiền (CLAUDE.md §2.0).
//   · Đơn giá: bảng chỉ-thêm-dòng có ngày hiệu lực; đổi giá = thêm dòng mới, dòng cũ giữ để xem lại.
//   · Chốt kỳ (mig 202610141527): bản chụp bất biến; điều kiện chốt / khoá kỳ / mở lại đều do DB quyết
//     (fn_ta_ky_trang_thai · fn_ta_chot_ky · fn_ta_mo_lai_ky). Kỳ đã chốt ⇒ bảng đọc bản chốt, không tính lại.
// ============================================================================
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { homNayVN, congNgay, ddmmVN } from '../../lib/tuan'
import { luongThang, luongTong, type LuongTong, bangDonGia, datDonGia, suaDonGia, xoaDonGia, thongSoKy, dsLoaiViec, dsLoaiViecQL, luuLoaiViec, dungLoaiViec, type LoaiViecQL, dsLuongLop, datLuongLop, xoaLuongLop, type LuongLop, kyTrangThai, chotKy, moLaiKy, gioVN, type LuongThang, type DonGia, type LoaiViec, type KyTrangThai, type ThongSoKy } from '../../lib/tacong'

type Tab = 'luong' | 'gia' | 'loai' | 'lop'
const inputCls = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400'
const btnPrimary = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnGhost = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50'
const card = 'rounded-xl border border-slate-200 bg-white shadow-sm'
const tien = (n: number | null | undefined) => Math.round(Number(n) || 0).toLocaleString('vi-VN')
const so = (n: number | null | undefined) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('vi-VN')
const pct = (n: number | null | undefined) => so((Number(n) || 0) * 100) + '%'
const loiCua = (e: unknown) => (e as { message?: string })?.message ?? String(e)
const dauThang = (d: string) => d.slice(0, 8) + '01'
// 'HH:MM dd/mm/yyyy' giờ VN từ timestamptz (không qua toISOString cho ngày local — CLAUDE.md §2)
function luc(ts: string | null | undefined): string {
  if (!ts) return '—'
  const d = new Date(new Date(ts).getTime() + 7 * 3600000)
  return `${gioVN(ts)} ${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
}

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
        {([['luong', 'Bảng lương'], ['loai', 'Loại việc & cơ chế'], ['gia', 'Đơn giá'], ['lop', 'Lương theo lớp']] as [Tab, string][]).map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-sm font-medium transition ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
        ))}
        {!coGhi && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Chỉ xem</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
        {tab === 'luong' && <TabLuong bao={bao} coGhi={coGhi} />}
        {tab === 'gia' && <TabGia coGhi={coGhi} bao={bao} />}
        {tab === 'loai' && <TabLoai coGhi={coGhi} bao={bao} />}
        {tab === 'lop' && <TabLop coGhi={coGhi} bao={bao} />}
      </div>
      {toast && <div className={`fixed bottom-4 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-2xl px-4 py-2 text-sm text-white shadow-lg ${toast.ok ? 'bg-slate-900/90' : 'bg-red-700/95'}`}>{toast.t}</div>}
    </div>
  )
}

// ═══════════════════════════════ BẢNG LƯƠNG ═══════════════════════════════
function TabLuong({ bao, coGhi }: { bao: (t: string, ok?: boolean) => void; coGhi: boolean }) {
  const [ky, setKy] = useState(dauThang(homNayVN()))
  const [rows, setRows] = useState<LuongThang[] | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [tenLoai, setTenLoai] = useState<Record<string, string>>({})
  useEffect(() => { dsLoaiViec().then((d) => setTenLoai(Object.fromEntries(d.map((x) => [x.ma, x.ten])))).catch(() => {}) }, [])
  const [tt, setTt] = useState<KyTrangThai | null>(null)
  const [tong, setTong] = useState<LuongTong | null>(null)
  const [dongBo, setDongBo] = useState(false)
  // đổi tháng = đổi ngữ cảnh ⇒ reset; sau chốt / mở lại = cùng ngữ cảnh ⇒ tải NỀN, giữ bảng đang hiện (CLAUDE.md §2 React)
  useEffect(() => { setRows(null); setMo(null); setTt(null); setTong(null); luongThang(ky).then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }); kyTrangThai(ky).then(setTt).catch(() => {}); luongTong(ky).then(setTong).catch(() => {}) }, [ky, bao])
  // Đồng bộ = tính lại NỀN từ dữ liệu hiện tại (công vừa duyệt, mức lớp, đơn giá…), giữ bảng cũ tới khi có bảng mới
  const taiLai = useCallback(async (baoXong = false) => {
    setDongBo(true)
    try {
      const [r, t] = await Promise.all([luongThang(ky), luongTong(ky)])
      setRows(r); setTong(t); kyTrangThai(ky).then(setTt).catch(() => {})
      if (baoXong) bao(t?.da_chot ? 'Tháng đã chốt — đang hiện bản chốt (mở lại kỳ nếu cần tính lại)' : 'Đã tính lại theo dữ liệu mới nhất')
    } catch (e) { bao(loiCua(e), false) } finally { setDongBo(false) }
  }, [ky, bao])
  const daChot = !!rows?.[0]?.da_chot
  const [y, m] = ky.split('-')
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        <button className={btnGhost} onClick={() => setKy(dauThang(congNgay(ky, -1)))}>‹</button>
        <span className="min-w-[110px] text-center text-sm font-semibold text-slate-800">Tháng {Number(m)}/{y}</span>
        <button className={btnGhost} disabled={ky >= dauThang(homNayVN())} onClick={() => setKy(dauThang(congNgay(ky, 32)))}>›</button>
        {tong && <span className="ml-2 rounded-lg bg-emerald-50 px-3 py-1 text-sm text-emerald-800">Tổng thực nhận <b className="text-base">{tien(tong.net)}đ</b> · {tong.so_ta} TA</span>}
        <button className={btnGhost} disabled={dongBo} onClick={() => taiLai(true)} title="Tính lại lương tháng này từ dữ liệu hiện tại (công đã duyệt, mức lương lớp, đơn giá, phạt)">{dongBo ? 'Đang tính…' : '↻ Đồng bộ'}</button>
        {tong && <span className="text-[11px] text-slate-400">{tong.da_chot ? 'chốt lúc' : 'tính lúc'} {luc(tong.tinh_luc)}</span>}
        <span className="ml-auto text-xs text-slate-500">{daChot ? `Bản chốt lần ${rows?.[0]?.lan} — số liệu cố định, không tính lại` : 'Tạm tính từ dữ liệu đã duyệt tới hiện tại · hạn duyệt/sửa: ngày 3 tháng sau'}</span>
      </div>
      {tt && <ChotKy tt={tt} thang={`${Number(m)}/${y}`} coGhi={coGhi} bao={bao} onXong={taiLai} />}
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
          {tong && rows && rows.length > 0 && <tfoot><tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold text-slate-800">
            <td className="px-3 py-2">Tổng ({tong.so_ta} TA)</td><td className="px-3 py-2 text-right">{tien(tong.package_lop)}</td><td className="px-3 py-2 text-right">{tien(tong.bo_tro_tien)}</td>
            <td className="px-3 py-2 text-right">{tien(tong.ngoai_package)}</td><td className="px-3 py-2 text-right">{Number(tong.tien_phat) ? '−' + tien(tong.tien_phat) : '—'}</td><td className="px-3 py-2 text-right text-emerald-700">{tien(tong.net)}</td><td></td>
          </tr></tfoot>}
        </table>
      </div>
      <p className="text-xs text-slate-500">Chỉ tính việc đã duyệt thuộc ca đã duyệt. %Trợ giảng = buổi TA có công ÷ số buổi CẢ THÁNG của lớp (TA phân công giữa tháng chỉ nhận phần buổi mình làm). Lớp của TA = lớp được phân công vào bất kỳ ngày nào trong tháng + lớp TA dạy hộ. BTVN lấy thẳng từ người chấm trên ERP.</p>
    </div>
  )
}

// Khối CHỐT KỲ: trạng thái + điều kiện còn thiếu (DB tính) + chốt có bước xác nhận ngay trên màn (không confirm()) + mở lại bắt lý do.
function ChotKy({ tt, thang, coGhi, bao, onXong }: { tt: KyTrangThai; thang: string; coGhi: boolean; bao: (t: string, ok?: boolean) => void; onXong: () => void }) {
  const [buoc, setBuoc] = useState<'' | 'chot' | 'mo'>('')
  const [chu, setChu] = useState('')
  const [ban, setBan] = useState(false)
  const conViec = tt.cho_duyet_ca + tt.cho_duyet_viec + tt.quen_checkout
  const chuaToiHan = !tt.da_chot && !tt.truoc_moc && new Date(tt.mo_chot_tu).getTime() > Date.now()
  async function lam() {
    setBan(true)
    try {
      if (buoc === 'chot') { const lan = await chotKy(tt.ky, chu.trim()); bao(`Đã chốt lương tháng ${thang} (lần ${lan}) — công và đơn giá tháng này đã khoá`) }
      else { await moLaiKy(tt.ky, chu); bao(`Đã mở lại kỳ ${thang} — bản chốt cũ vẫn giữ trong lịch sử`) }
      setBuoc(''); setChu(''); onXong()
    } catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  return (
    <div className={`${card} flex flex-col gap-2 px-3 py-2.5`}>
      <div className="flex flex-wrap items-center gap-2">
        {tt.da_chot
          ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Đã chốt lần {tt.lan}</span>
          : <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Chưa chốt</span>}
        <span className="text-sm text-slate-700">
          {tt.da_chot ? <>Chốt lúc {luc(tt.chot_at)}{tt.chot_boi ? ` · ${tt.chot_boi}` : ''} · {tt.so_ta} TA · tổng {tien(tt.tong_net)}đ</>
            : tt.truoc_moc ? <>Tháng này trước khi có chấm công trên ERP (bắt đầu {ddmmVN(tt.moc_cham_cong)}/{tt.moc_cham_cong.slice(0, 4)}) — lương tính ngoài ERP, không chốt ở đây.</>
            : chuaToiHan ? <>Chốt được từ {luc(tt.mo_chot_tu)} (hết hạn duyệt/sửa công).</>
            : conViec > 0 ? <>Còn <b>{tt.cho_duyet_ca}</b> ca và <b>{tt.cho_duyet_viec}</b> việc chờ duyệt, <b>{tt.quen_checkout}</b> ca quên checkout — xử lý ở màn Duyệt công rồi mới chốt.</>
            : <>Đủ điều kiện chốt.</>}
        </span>
        {coGhi && !buoc && (tt.da_chot
          ? <button className={`${btnGhost} ml-auto`} onClick={() => { setBuoc('mo'); setChu('') }}>Mở lại kỳ</button>
          : <button className={`${btnPrimary} ml-auto`} disabled={!tt.co_the_chot} onClick={() => { setBuoc('chot'); setChu('') }}>Chốt lương tháng {thang}</button>)}
      </div>
      {buoc && (
        <div className={`flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-sm ${buoc === 'chot' ? 'bg-indigo-50 text-indigo-900' : 'bg-amber-50 text-amber-900'}`}>
          <span className="font-medium">{buoc === 'chot'
            ? `Chốt lương tháng ${thang}? Sau khi chốt, công và đơn giá tháng này bị khoá; TA thấy phiếu chính thức.`
            : `Mở lại kỳ ${thang}: công tháng này sửa được trở lại, bản chốt cũ vẫn giữ trong lịch sử.`}</span>
          <input className={`${inputCls} min-w-[220px] flex-1`} placeholder={buoc === 'chot' ? 'Ghi chú (không bắt buộc)' : 'Lý do mở lại (bắt buộc)'} value={chu} onChange={(e) => setChu(e.target.value)} />
          <button className={btnPrimary} disabled={ban || (buoc === 'mo' && !chu.trim())} onClick={lam}>{buoc === 'chot' ? 'Xác nhận chốt' : 'Xác nhận mở lại'}</button>
          <button className={btnGhost} disabled={ban} onClick={() => setBuoc('')}>Huỷ</button>
        </div>
      )}
      {tt.lich_su.length > 0 && (
        <details className="text-xs text-slate-600">
          <summary className="cursor-pointer select-none text-slate-500">Lịch sử chốt ({tt.lich_su.length} lần)</summary>
          <ul className="mt-1 flex flex-col gap-1">
            {tt.lich_su.map((h) => (
              <li key={h.lan}>Lần {h.lan}: chốt {luc(h.chot_at)}{h.chot_boi ? ` · ${h.chot_boi}` : ''} · {h.so_ta} TA · {tien(h.tong_net)}đ{h.ghi_chu ? ` · ${h.ghi_chu}` : ''}
                {h.mo_lai_at && <span className="text-amber-700"> — mở lại {luc(h.mo_lai_at)}{h.mo_lai_boi ? ` · ${h.mo_lai_boi}` : ''}: {h.ly_do_mo_lai}</span>}
                <ThongSoChot ky={tt.ky} lan={h.lan} /></li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

// Thông số lương ĐÃ CHỤP lúc chốt (Thùy 04/11: đổi thông số hiện tại không làm đổi quá khứ) — bất biến cùng bản chốt.
function ThongSoChot({ ky, lan }: { ky: string; lan: number }) {
  const [ts, setTs] = useState<ThongSoKy | null | undefined>(undefined)
  const [loi, setLoi] = useState<string | null>(null)
  if (ts === undefined) return <button className="ml-2 text-indigo-600 underline" onClick={() => thongSoKy(ky, lan).then((x) => setTs(x)).catch((e) => setLoi(loiCua(e)))}>Xem thông số lúc chốt</button>
  if (loi) return <span className="ml-2 text-red-600">{loi}</span>
  if (!ts || !ts.don_gia?.length) return <span className="ml-2 text-slate-400">(lần chốt này chưa chụp thông số)</span>
  return (
    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2">
      <p className="mb-1 font-semibold text-slate-700">Đơn giá dùng cho lần chốt {lan} (chụp {luc(ts.chup_at)})</p>
      <table className="w-full text-[11.5px] tabular-nums"><tbody>
        {ts.don_gia.map((d, i) => (
          <tr key={d.ma + (d.si_tu ?? '') + i} className="border-t border-slate-100">
            <td className="py-0.5 pr-2 text-slate-700">{d.ten}</td>
            <td className="py-0.5 pr-2 text-right font-medium">{Number(d.gia_tri) < 1 && d.don_vi === 'hệ số' ? so(d.gia_tri) : tien(d.gia_tri)}</td>
            <td className="py-0.5 pr-2 text-slate-500">{d.don_vi}</td>
            <td className="py-0.5 text-slate-400">từ {ddmmVN(d.hieu_luc_tu)}/{String(d.hieu_luc_tu).slice(0, 4)}</td>
          </tr>
        ))}
      </tbody></table>
      <p className="mt-1 text-slate-500">Loại việc lúc chốt: {ts.loai_viec.filter((l) => l.active).map((l) => l.ten).join(' · ')}</p>
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
                  <td className="py-1 pr-2 text-right">{so(x.si_tb)} HS · {x.thieu_muc ? <b className="text-red-600">lớp chưa có mức lương</b> : tien(x.bac)}</td>
                  <td className="py-1 pr-2 text-right">{x.tg_lam}/{x.so_buoi} · {pct(x.ti_le_tg)}</td>
                  <td className="py-1 pr-2 text-right">{x.btvn_lam}/{x.btvn_dinh_muc} · {pct(x.ti_le_btvn)}</td>
                  <td className="py-1 text-right">{tien(x.tien)}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200">
                <td className="py-1 pr-2 font-medium text-slate-800">Bổ trợ</td>
                <td className="py-1 pr-2 text-right" colSpan={3}>{so(bt.gio)} giờ ÷ ({bt.so_lop} lớp × {so(bt.chi_tieu_moi_lop)} giờ) = {pct(bt.ti_le)} · Σ bậc {tien(bt.tong_bac)}{Number(bt.gio_trung) > 0 && <span className="text-amber-700"> · khai {so(bt.gio_khai ?? 0)} giờ, {so(bt.gio_trung ?? 0)} giờ chồng nhau chỉ tính 1 lần</span>}</td>
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

// Sửa / xoá một dòng đơn giá (Thùy 04/11). Xoá = ẩn dòng (giữ lịch sử), bắt lý do, xác nhận ngay trên dòng.
function SuaGia({ r, bao, onXong }: { r: DonGia; bao: (t: string, ok?: boolean) => void; onXong: (x: { id: string; xoa?: boolean; gia?: number; tu?: string; gc?: string } | null) => void }) {
  const [gia, setGia] = useState(String(Number(r.gia_tri)))
  const [tu, setTu] = useState(r.hieu_luc_tu)
  const [gc, setGc] = useState(r.ghi_chu ?? '')
  const [xoa, setXoa] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [ban, setBan] = useState(false)
  async function luu() {
    setBan(true)
    try { await suaDonGia(r.id, Number(gia), tu, gc); bao('Đã sửa đơn giá — có ghi lại giá cũ'); onXong({ id: r.id, gia: Number(gia), tu, gc }) }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  async function xoaDong() {
    setBan(true)
    try { await xoaDonGia(r.id, lyDo); bao('Đã xoá dòng đơn giá (ẩn, lịch sử vẫn giữ)'); onXong({ id: r.id, xoa: true }) }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  return (
    <tr className="border-t border-indigo-100 bg-indigo-50/50">
      <td className="px-3 py-2 text-slate-800">{r.ten}</td>
      <td className="px-3 py-2 text-right"><input type="number" min={0} step="any" className={`${inputCls} w-32 text-right`} value={gia} onChange={(e) => setGia(e.target.value)} /></td>
      <td className="px-3 py-2 text-slate-600">{r.don_vi}</td>
      <td className="px-3 py-2"><input type="date" className={inputCls} value={tu} onChange={(e) => e.target.value && setTu(e.target.value)} /></td>
      <td className="px-3 py-2" colSpan={2}><input className={`${inputCls} w-full`} placeholder="Ghi chú" value={gc} onChange={(e) => setGc(e.target.value)} /></td>
      <td className="px-3 py-2" colSpan={2}>
        {!xoa
          ? <div className="flex flex-wrap gap-1">
              <button className={btnPrimary} disabled={ban || gia === '' || !(Number(gia) >= 0)} onClick={luu}>Lưu</button>
              <button className={btnGhost} disabled={ban} onClick={() => onXong(null)}>Huỷ</button>
              <button className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50" disabled={ban} onClick={() => setXoa(true)}>Xoá</button>
            </div>
          : <div className="flex flex-wrap items-center gap-1">
              <input className={`${inputCls} min-w-[160px] flex-1`} placeholder="Lý do xoá (bắt buộc)" value={lyDo} onChange={(e) => setLyDo(e.target.value)} />
              <button className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40" disabled={ban || !lyDo.trim()} onClick={xoaDong}>Xác nhận xoá</button>
              <button className={btnGhost} disabled={ban} onClick={() => setXoa(false)}>Thôi</button>
            </div>}
      </td>
    </tr>
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
  const [dangSua, setDangSua] = useState<string | null>(null)
  // sau sửa/xoá: vá đúng dòng tại chỗ, rồi quét NỀN (cờ "đang dùng" của dòng khác có thể đổi) — không trắng bảng
  const vaDong = (x: { id: string; xoa?: boolean; gia?: number; tu?: string; gc?: string }) => {
    setRows((prev) => prev && (x.xoa ? prev.filter((r) => r.id !== x.id) : prev.map((r) => (r.id === x.id ? { ...r, gia_tri: x.gia ?? r.gia_tri, hieu_luc_tu: x.tu ?? r.hieu_luc_tu, ghi_chu: x.gc ?? r.ghi_chu } : r))))
    bangDonGia().then(setRows).catch(() => {})
  }
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[820px] border-collapse text-sm tabular-nums">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Mục</th><th className="px-3 py-2 text-right">Giá trị</th><th className="px-3 py-2">Đơn vị</th><th className="px-3 py-2">Hiệu lực từ</th><th className="px-3 py-2">Hôm nay</th><th className="px-3 py-2">Người đặt</th><th className="px-3 py-2">Ghi chú</th>{coGhi && <th className="w-36 px-3 py-2"></th>}
          </tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={8} className="p-6 text-center text-slate-400">Đang tải…</td></tr>}
            {rows?.map((r) => dangSua === r.id ? <SuaGia key={r.id} r={r} bao={bao} onXong={(x) => { setDangSua(null); if (x) vaDong(x) }} /> : (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-3 py-1.5 text-slate-800">{r.ten}</td>
                <td className="px-3 py-1.5 text-right font-medium">{giaTri(r)}</td>
                <td className="px-3 py-1.5 text-slate-600">{r.don_vi}</td>
                <td className="whitespace-nowrap px-3 py-1.5 text-slate-600">{ddmmVN(r.hieu_luc_tu)}/{r.hieu_luc_tu.slice(0, 4)}</td>
                <td className="px-3 py-1.5">{r.dang_hieu_luc ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Đang dùng</span>
                  : r.hieu_luc_tu > homNayVN() ? <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Chưa tới hạn</span>
                  : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Đã thay</span>}</td>
                <td className="px-3 py-1.5 text-slate-600">{r.nguoi_dat ?? 'cài sẵn'}</td>
                <td className="px-3 py-1.5 text-xs text-slate-500">{r.ghi_chu}</td>
                {coGhi && <td className="px-3 py-1.5">{r.khoa_ky
                  ? <span className="text-[11px] text-slate-400" title="Dòng này đang dùng cho tháng đã chốt lương — mở lại kỳ, hoặc thêm giá mới có hiệu lực sau tháng đó">🔒 đã chốt {r.khoa_ky.slice(5, 7)}/{r.khoa_ky.slice(0, 4)}</span>
                  : <button className={btnGhost} onClick={() => setDangSua(r.id)}>Sửa / Xoá</button>}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {coGhi && (
        <div className={`${card} p-3`}>
          <p className="mb-1 text-sm font-semibold text-slate-800">Thêm giá mới (kỳ lương dùng dòng mới nhất có hiệu lực ≤ đầu kỳ)</p>
          <p className="mb-2 text-xs text-slate-500">Muốn đổi giá từ một tháng mới thì <b>thêm dòng</b> có hiệu lực từ tháng đó (giá cũ vẫn dùng cho các tháng trước). Nhập nhầm thì <b>Sửa / Xoá</b>. Dòng đang dùng cho tháng đã chốt lương bị khoá 🔒; mỗi lần chốt, toàn bộ đơn giá được chụp lại trong bản chốt.</p>
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

// ═══════════════════════════════ LOẠI VIỆC & CƠ CHẾ ═══════════════════════════════
// Thùy 04/11: danh sách nghiệp vụ TA được ghi = bảng này. Thêm · sửa · ngừng dùng (không xoá — việc cũ vẫn trỏ tới).
// Mọi luật (cơ chế đặc thù không đổi, mã gốc bất biến, Việc khác không bật lại, giá chỉ cho ngoài package) chặn ở DB.
const CO_CHE: Record<LoaiViecQL['co_che'], string> = {
  tg: 'Trợ giảng — theo bậc lớp',
  bo_tro: 'Bổ trợ — giờ vào chỉ tiêu bổ trợ lớp',
  ngoai: 'Ngoài package — số lượng × đơn giá',
}
const DON_VI: Record<string, string> = { gio: 'giờ', buoi: 'buổi' }
function TabLoai({ coGhi, bao }: { coGhi: boolean; bao: (t: string, ok?: boolean) => void }) {
  const [rows, setRows] = useState<LoaiViecQL[] | null>(null)
  const tai = useCallback(() => dsLoaiViecQL().then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }), [bao])
  useEffect(() => { tai() }, [tai])
  const [dangSua, setDangSua] = useState<string | null>(null)   // mã đang sửa · '' = đang thêm mới
  // sau ghi: quét NỀN (giữ bảng cũ tới khi có bảng mới — giá/đơn vị do DB trả) — không trắng bảng
  const quetNen = () => dsLoaiViecQL().then(setRows).catch(() => {})
  async function doiDung(r: LoaiViecQL) {
    try {
      await dungLoaiViec(r.ma, !r.active)
      setRows((prev) => prev && prev.map((x) => (x.ma === r.ma ? { ...x, active: !r.active } : x)))
      bao(r.active ? `Đã ngừng "${r.ten}" — TA không khai mới được, việc cũ giữ nguyên` : `Đã dùng lại "${r.ten}"`)
    } catch (e) { bao(loiCua(e), false) }
  }
  const thieuGia = (rows ?? []).filter((r) => r.active && r.co_che === 'ngoai' && r.gia_tri === null)
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} p-3 text-xs text-slate-600`}>
        TA chỉ khai được các loại <b>đang dùng</b> ở bảng này. Có 3 cơ chế tính lương: <b>Trợ giảng</b> (theo bậc lớp, đặc thù) ·
        <b> Bổ trợ</b> (giờ cộng vào chỉ tiêu 8 giờ/lớp, ăn 40% bậc lớp) · <b>Ngoài package</b> (số giờ hoặc số buổi × đơn giá riêng).
        Loại có logic riêng (Trợ giảng, Trông thi, Chấm thi, Bổ trợ đặc biệt) không đổi cơ chế được. Đổi cơ chế / giá chỉ ảnh hưởng
        tháng <b>chưa chốt</b> — tháng đã chốt giữ bản chụp. Không xoá loại việc, chỉ <b>Ngừng dùng</b>.
        {thieuGia.length > 0 && <div className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 font-medium text-red-700">⚠ Chưa có giá (đang tính 0đ): {thieuGia.map((r) => r.ten).join(' · ')}</div>}
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[900px] border-collapse text-sm tabular-nums">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Loại việc</th><th className="px-3 py-2">Cơ chế</th><th className="px-3 py-2">Đơn vị</th><th className="px-3 py-2 text-right">Giá hiện tại</th>
            <th className="px-3 py-2">Bắt buộc</th><th className="px-3 py-2 text-right">Đã ghi</th><th className="px-3 py-2">Trạng thái</th>{coGhi && <th className="w-40 px-3 py-2"></th>}
          </tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={8} className="p-6 text-center text-slate-400">Đang tải…</td></tr>}
            {rows?.map((r) => dangSua === r.ma ? <SuaLoai key={r.ma} r={r} bao={bao} onXong={(ok) => { setDangSua(null); if (ok) quetNen() }} /> : (
              <tr key={r.ma} className={`border-t border-slate-100 ${r.active ? '' : 'text-slate-400'}`}>
                <td className="px-3 py-1.5"><div className={r.active ? 'text-slate-800' : ''}>{r.ten}</div>{r.ghi_chu && <div className="text-[11px] text-slate-500">{r.ghi_chu}</div>}</td>
                <td className="px-3 py-1.5 text-xs">{CO_CHE[r.co_che]}{r.dac_thu && <span className="ml-1 rounded bg-slate-100 px-1 text-[10px] text-slate-500">đặc thù</span>}</td>
                <td className="px-3 py-1.5 text-slate-600">{DON_VI[r.don_vi]}</td>
                <td className="whitespace-nowrap px-3 py-1.5 text-right">{r.co_che !== 'ngoai' ? <span className="text-slate-400">—</span>
                  : r.gia_tri === null ? <span className={`font-semibold ${r.active ? 'text-red-600' : ''}`}>chưa có giá</span>
                  : <><b>{tien(r.gia_tri)}</b><span className="text-xs text-slate-500"> đ/{DON_VI[r.don_vi]}</span>{r.gia_hieu_luc_tu && <div className="text-[10px] text-slate-400">từ {ddmmVN(r.gia_hieu_luc_tu)}/{r.gia_hieu_luc_tu.slice(0, 4)}</div>}</>}</td>
                <td className="px-3 py-1.5 text-xs text-slate-600">{[r.can_lop && 'lớp', r.can_hs && 'học sinh'].filter(Boolean).join(' · ') || '—'}</td>
                <td className="px-3 py-1.5 text-right text-slate-600">{r.so_viec}</td>
                <td className="px-3 py-1.5">{r.active ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Đang dùng</span>
                  : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Ngừng</span>}</td>
                {coGhi && <td className="px-3 py-1.5"><div className="flex gap-1">
                  <button className={btnGhost} onClick={() => setDangSua(r.ma)}>Sửa</button>
                  {r.ma !== 'khac' && <button className={btnGhost} onClick={() => doiDung(r)}>{r.active ? 'Ngừng' : 'Dùng lại'}</button>}
                </div></td>}
              </tr>
            ))}
            {coGhi && dangSua === '' && <SuaLoai r={null} bao={bao} onXong={(ok) => { setDangSua(null); if (ok) quetNen() }} />}
          </tbody>
        </table>
      </div>
      {coGhi && dangSua !== '' && <div><button className={btnPrimary} onClick={() => setDangSua('')}>+ Thêm loại việc</button></div>}
    </div>
  )
}

function SuaLoai({ r, bao, onXong }: { r: LoaiViecQL | null; bao: (t: string, ok?: boolean) => void; onXong: (ok: boolean) => void }) {
  const [ten, setTen] = useState(r?.ten ?? '')
  const [coChe, setCoChe] = useState<LoaiViecQL['co_che']>(r?.co_che ?? 'ngoai')
  const [donVi, setDonVi] = useState<'gio' | 'buoi'>(r?.don_vi ?? 'gio')
  const [canLop, setCanLop] = useState(r?.can_lop ?? false)
  const [canHs, setCanHs] = useState(r?.can_hs ?? false)
  const [gc, setGc] = useState(r?.ghi_chu ?? '')
  const [gia, setGia] = useState('')
  const [tu, setTu] = useState(dauThang(homNayVN()))
  const [ban, setBan] = useState(false)
  const khoaCoChe = !!r?.dac_thu
  const khoaDonVi = coChe === 'bo_tro' || coChe === 'tg'
  const dv: 'gio' | 'buoi' = khoaDonVi ? (coChe === 'tg' ? 'buoi' : 'gio') : donVi
  const coGia = coChe === 'ngoai'
  const giaSo = gia === '' ? null : Number(gia)
  async function luu() {
    setBan(true)
    try {
      await luuLoaiViec({ ma: r?.ma ?? null, ten, coChe, donVi: dv, canLop, canHs, ghiChu: gc, gia: coGia ? giaSo : null, giaTu: coGia && giaSo !== null ? tu : null })
      bao(r ? `Đã lưu "${ten.trim()}"` : `Đã thêm "${ten.trim()}" — TA khai được ngay`); onXong(true)
    } catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  const o = 'flex flex-col gap-1 text-[11px] font-medium text-slate-500'
  return (
    <tr className="border-t border-indigo-100 bg-indigo-50/40"><td colSpan={8} className="px-3 py-2">
      <div className="flex flex-wrap items-end gap-2">
        <label className={o}>Tên loại việc<input className={`${inputCls} w-60`} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus /></label>
        <label className={o}>Cơ chế<select className={inputCls} disabled={khoaCoChe} value={coChe} onChange={(e) => setCoChe(e.target.value as LoaiViecQL['co_che'])}>
          {(khoaCoChe && r ? [r.co_che] : (['bo_tro', 'ngoai'] as const)).map((k) => <option key={k} value={k}>{CO_CHE[k]}</option>)}
        </select></label>
        <label className={o}>Đơn vị<select className={inputCls} disabled={khoaDonVi} value={dv} onChange={(e) => setDonVi(e.target.value as 'gio' | 'buoi')}>
          <option value="gio">giờ</option><option value="buoi">buổi</option></select></label>
        <label className="flex items-center gap-1 pb-2 text-xs text-slate-600"><input type="checkbox" checked={canLop} onChange={(e) => setCanLop(e.target.checked)} />cần lớp</label>
        <label className="flex items-center gap-1 pb-2 text-xs text-slate-600"><input type="checkbox" checked={canHs} onChange={(e) => setCanHs(e.target.checked)} />cần ghi HS</label>
        <label className={`${o} min-w-[180px] flex-1`}>Mô tả<input className={inputCls} value={gc} onChange={(e) => setGc(e.target.value)} /></label>
      </div>
      {coGia && <div className="mt-2 flex flex-wrap items-end gap-2">
        <label className={o}>{r?.gia_tri != null ? `Giá mới (hiện ${tien(r.gia_tri)} đ/${DON_VI[dv]}) — bỏ trống = giữ` : `Giá (đ/${DON_VI[dv]})`}<input type="number" min={0} step="any" className={`${inputCls} w-40`} value={gia} onChange={(e) => setGia(e.target.value)} /></label>
        {giaSo !== null && <label className={o}>Có hiệu lực từ<input type="date" className={inputCls} value={tu} onChange={(e) => e.target.value && setTu(e.target.value)} /></label>}
        <span className="pb-2 text-[11px] text-slate-500">Giá mới thêm 1 dòng ở tab Đơn giá; giá cũ giữ cho các tháng trước. Nhập nhầm thì sửa ở tab Đơn giá.</span>
      </div>}
      <div className="mt-2 flex gap-2">
        <button className={btnPrimary} disabled={ban || !ten.trim() || (giaSo !== null && !(giaSo >= 0))} onClick={luu}>{r ? 'Lưu' : 'Thêm'}</button>
        <button className={btnGhost} onClick={() => onXong(false)}>Huỷ</button>
      </div>
    </td></tr>
  )
}

// ═══════════════════════════════ LƯƠNG THEO LỚP ═══════════════════════════════
// Thùy 10/11: mỗi lớp một mức lương tháng (thay bậc theo sĩ số, áp từ T10). Cách chia giữ nguyên: TG 40% · BTVN 20% · bổ trợ 40%.
// Mức + khoá tháng đã chốt + lịch sử do DB quyết (fn_ta_luong_lop_*). Sĩ số TB + bậc theo sĩ số chỉ để tham khảo.
function TabLop({ coGhi, bao }: { coGhi: boolean; bao: (t: string, ok?: boolean) => void }) {
  const [ky, setKy] = useState(dauThang(homNayVN()))
  const [rows, setRows] = useState<LuongLop[] | null>(null)
  const [loc, setLoc] = useState('')
  const [dangSua, setDangSua] = useState<string | null>(null)   // lop_id đang mở sửa
  useEffect(() => { setRows(null); setDangSua(null); dsLuongLop(ky).then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }) }, [ky, bao])
  const quetNen = () => dsLuongLop(ky).then(setRows).catch(() => {})
  const [y, m] = ky.split('-')
  const hien = (rows ?? []).filter((r) => !loc || r.ten_lop.toLowerCase().includes(loc.toLowerCase()) || (r.mon ?? '').toLowerCase().includes(loc.toLowerCase()))
  const thieu = (rows ?? []).filter((r) => r.trang_thai === 'dang_hoc' && r.muc === null)
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        <button className={btnGhost} onClick={() => setKy(dauThang(congNgay(ky, -1)))}>‹</button>
        <span className="min-w-[110px] text-center text-sm font-semibold text-slate-800">Tháng {Number(m)}/{y}</span>
        <button className={btnGhost} onClick={() => setKy(dauThang(congNgay(ky, 32)))}>›</button>
        <input className={`${inputCls} w-48`} placeholder="Lọc lớp / môn…" value={loc} onChange={(e) => setLoc(e.target.value)} />
        <span className="ml-auto text-xs text-slate-500">Mức lương lớp thay cho bậc theo sĩ số (từ tháng 10/2026). Tiền TA = mức × (40% buổi trợ giảng + 20% BTVN) + bổ trợ 40% theo chỉ tiêu.</span>
      </div>
      {thieu.length > 0 && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">⚠ Lớp đang học chưa có mức lương (TA lớp này đang tính 0đ phần lớp): {thieu.map((r) => r.ten_lop).join(' · ')}</div>}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[820px] border-collapse text-sm tabular-nums">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Lớp</th><th className="px-3 py-2 text-right">Mức lương tháng</th><th className="px-3 py-2">Áp từ</th>
            <th className="px-3 py-2 text-right">Sĩ số TB tháng</th><th className="px-3 py-2 text-right">Bậc theo sĩ số (tham khảo)</th><th className="px-3 py-2">Ghi chú</th>{coGhi && <th className="w-28 px-3 py-2"></th>}
          </tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={7} className="p-6 text-center text-slate-400">Đang tải…</td></tr>}
            {hien.map((r) => (
              <Fragment key={r.lop_id}>
                <tr className={`border-t border-slate-100 ${r.trang_thai === 'dang_hoc' ? '' : 'text-slate-400'}`}>
                  <td className="whitespace-nowrap px-3 py-1.5"><b className={r.trang_thai === 'dang_hoc' ? 'text-slate-800' : ''}>{r.ten_lop}</b>{r.mon && <span className="ml-2 text-xs text-slate-500">{r.mon}</span>}{r.trang_thai !== 'dang_hoc' && <span className="ml-2 text-[11px]">(đã đóng)</span>}</td>
                  <td className="px-3 py-1.5 text-right">{r.muc === null ? <span className="font-semibold text-red-600">chưa có</span> : <b>{tien(r.muc)}</b>}</td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-slate-600">{r.hieu_luc_tu ? `${r.hieu_luc_tu.slice(5, 7)}/${r.hieu_luc_tu.slice(0, 4)}` : '—'}{r.khoa_ky && <span className="ml-1 text-[11px] text-slate-400" title="Đang dùng cho tháng đã chốt lương">🔒</span>}</td>
                  <td className="px-3 py-1.5 text-right text-slate-600">{r.si_tb === null ? '—' : so(r.si_tb)}</td>
                  <td className={`px-3 py-1.5 text-right ${r.muc !== null && r.bac_si_so !== null && Number(r.bac_si_so) !== Number(r.muc) ? 'text-amber-700' : 'text-slate-400'}`}>{r.bac_si_so === null ? '—' : tien(r.bac_si_so)}</td>
                  <td className="max-w-[260px] truncate px-3 py-1.5 text-xs text-slate-500" title={r.ghi_chu ?? ''}>{r.ghi_chu}</td>
                  {coGhi && <td className="px-3 py-1.5"><button className={btnGhost} onClick={() => setDangSua(dangSua === r.lop_id ? null : r.lop_id)}>{dangSua === r.lop_id ? 'Đóng' : 'Đặt mức'}</button></td>}
                </tr>
                {dangSua === r.lop_id && <SuaMucLop r={r} ky={ky} bao={bao} onXong={() => { setDangSua(null); quetNen() }} />}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Mức không tự đổi theo sĩ số nữa — cột "Bậc theo sĩ số" chỉ để so (tô cam khi khác mức đang dùng). Đặt mức từ một tháng thì các tháng sau dùng mức đó tới khi đặt mức mới; tháng trước giữ mức cũ. Tháng đã chốt lương bị khoá 🔒 và mức được chụp vào bản chốt.</p>
    </div>
  )
}

function SuaMucLop({ r, ky, bao, onXong }: { r: LuongLop; ky: string; bao: (t: string, ok?: boolean) => void; onXong: () => void }) {
  const [muc, setMuc] = useState(r.muc === null ? '' : String(r.muc))
  const [tu, setTu] = useState(ky)
  const [gc, setGc] = useState('')
  const [ban, setBan] = useState(false)
  const [xoa, setXoa] = useState<{ id: string; ld: string } | null>(null)
  async function luu() {
    setBan(true)
    try { await datLuongLop(r.lop_id, Number(muc), tu, gc); bao(`Đã đặt ${r.ten_lop}: ${tien(Number(muc))} từ ${tu.slice(5, 7)}/${tu.slice(0, 4)}`); onXong() }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  async function xoaDong() {
    if (!xoa) return
    setBan(true)
    try { await xoaLuongLop(xoa.id, xoa.ld); bao('Đã xoá dòng (giữ trong lịch sử)'); onXong() }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  const o = 'flex flex-col gap-1 text-[11px] font-medium text-slate-500'
  return (
    <tr className="border-t border-indigo-100 bg-indigo-50/40"><td colSpan={7} className="px-3 py-2">
      <div className="flex flex-wrap items-end gap-2">
        <label className={o}>Mức lương tháng (đ)<input type="number" min={0} step={50000} className={`${inputCls} w-40`} value={muc} onChange={(e) => setMuc(e.target.value)} autoFocus /></label>
        <label className={o}>Áp từ tháng<input type="month" className={inputCls} value={tu.slice(0, 7)} onChange={(e) => e.target.value && setTu(e.target.value + '-01')} /></label>
        <label className={`${o} min-w-[200px] flex-1`}>Ghi chú<input className={inputCls} value={gc} onChange={(e) => setGc(e.target.value)} placeholder="vd: lớp lên 15 em" /></label>
        <button className={btnPrimary} disabled={ban || muc === '' || !(Number(muc) >= 0)} onClick={luu}>Lưu</button>
      </div>
      {r.lich_su.length > 0 && <div className="mt-2 text-xs text-slate-600">
        <span className="font-semibold">Lịch sử mức:</span>
        {r.lich_su.map((h) => (
          <span key={h.id} className="ml-2 inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5">
            {h.hieu_luc_tu.slice(5, 7)}/{h.hieu_luc_tu.slice(0, 4)}: <b>{tien(h.muc)}</b>
            {h.khoa_ky ? <span title="Đã chốt lương">🔒</span> : <button className="text-red-500 hover:text-red-700" title="Xoá dòng này" onClick={() => setXoa({ id: h.id, ld: '' })}>✕</button>}
          </span>
        ))}
      </div>}
      {xoa && <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
        <span className="text-sm text-red-700">Lý do xoá</span>
        <input className={`${inputCls} min-w-[240px] flex-1`} value={xoa.ld} onChange={(e) => setXoa({ ...xoa, ld: e.target.value })} placeholder="bắt buộc — vd: nhập nhầm" />
        <button disabled={ban || !xoa.ld.trim()} onClick={xoaDong} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40">Xoá</button>
        <button className={btnGhost} onClick={() => setXoa(null)}>Huỷ</button>
      </div>}
    </td></tr>
  )
}
