// ============================================================================
// LuongTaScreen — "Lương trợ giảng" (lá `ta_luong`, spec-cham-cong-ta.md §7, Thùy chốt 12–14/10).
//   · Bảng lương: theo tháng, mỗi TA một dòng (theo lớp · bổ trợ · ngoài package · phạt · thực nhận), mở xem chi tiết.
//     Nguồn công thức DUY NHẤT = fn_ta_luong_thang (chỉ việc đã duyệt thuộc ca đã duyệt; lớp chủ theo phân công
//     TRONG kỳ; %TG mẫu số = cả tháng). Client KHÔNG cộng/tính tiền (CLAUDE.md §2.0).
//   · Đơn giá: bảng chỉ-thêm-dòng có ngày hiệu lực; đổi giá = thêm dòng mới, dòng cũ giữ để xem lại.
//   · Chốt kỳ (mig 202610141527): bản chụp bất biến; điều kiện chốt / khoá kỳ / mở lại đều do DB quyết
//     (fn_ta_ky_trang_thai · fn_ta_chot_ky · fn_ta_mo_lai_ky). Kỳ đã chốt ⇒ bảng đọc bản chốt, không tính lại.
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { homNayVN, congNgay, ddmmVN } from '../../lib/tuan'
import { luongThang, bangDonGia, datDonGia, suaDonGia, xoaDonGia, thongSoKy, dsLoaiViec, kyTrangThai, chotKy, moLaiKy, gioVN, type LuongThang, type DonGia, type LoaiViec, type KyTrangThai, type ThongSoKy } from '../../lib/tacong'

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
        {([['luong', 'Bảng lương'], ['gia', 'Đơn giá']] as [Tab, string][]).map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-sm font-medium transition ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
        ))}
        {!coGhi && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Chỉ xem</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
        {tab === 'luong' && <TabLuong bao={bao} coGhi={coGhi} />}
        {tab === 'gia' && <TabGia coGhi={coGhi} bao={bao} />}
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
  // đổi tháng = đổi ngữ cảnh ⇒ reset; sau chốt / mở lại = cùng ngữ cảnh ⇒ tải NỀN, giữ bảng đang hiện (CLAUDE.md §2 React)
  useEffect(() => { setRows(null); setMo(null); setTt(null); luongThang(ky).then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }); kyTrangThai(ky).then(setTt).catch(() => {}) }, [ky, bao])
  const taiLai = useCallback(() => { luongThang(ky).then(setRows).catch((e) => bao(loiCua(e), false)); kyTrangThai(ky).then(setTt).catch(() => {}) }, [ky, bao])
  const daChot = !!rows?.[0]?.da_chot
  const [y, m] = ky.split('-')
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        <button className={btnGhost} onClick={() => setKy(dauThang(congNgay(ky, -1)))}>‹</button>
        <span className="min-w-[110px] text-center text-sm font-semibold text-slate-800">Tháng {Number(m)}/{y}</span>
        <button className={btnGhost} disabled={ky >= dauThang(homNayVN())} onClick={() => setKy(dauThang(congNgay(ky, 32)))}>›</button>
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
                  <td className="py-1 pr-2 text-right">{so(x.si_tb)} HS · {tien(x.bac)}</td>
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
