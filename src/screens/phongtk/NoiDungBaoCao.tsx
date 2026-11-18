// NỘI DUNG một báo cáo tuần của khối — dùng chung cho trưởng khối soạn (sua), trưởng bộ môn xem / duyệt (chỉ đọc), báo cáo môn (anChu) và chiếu TV (phan).
// Thùy 18/11: tách 3 PHẦN thành 3 tab con — ⚙ Vận hành (việc sau buổi của TA / GV + ET · BTVN) · 📚 Học tập (dạng yếu · nhóm yếu · HS yếu · bổ trợ) · 🌱 Phát triển cá nhân (task).
//   Mỗi tab: hàng Ô CHỈ SỐ tổng quát ở trên, bên dưới là các MỤC bấm mới mở chi tiết. Tự viết (Plans · Progress · Problems) là tab con thứ tư, riêng một màn (Thùy 18/11 tối).
// Client KHÔNG tính số nào: mọi tỉ lệ / tổng / danh sách đến từ DB (fn_bctk_so · _bctk_van_hanh · fn_bctk_trend); màn chỉ hiển thị.
// Ô chỉ số: mỗi dòng nằm trọn MỘT hàng ngang (không xuống dòng giữa "160 → 124").
import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import type { DemViec, DongCaNhan, HaiChieu, SoBaoCao, TongSo, TuViet } from '../../lib/baoCaoTuan'
import { ddmmVN } from '../../lib/tuan'
import { nhoBen } from '../../lib/nho'

type TabND = 'van_hanh' | 'hoc_tap' | 'ca_nhan' | 'tu_viet'
const NHO = nhoBen<{ tab: TabND }>('bao_cao_tuan_phan', { tab: 'van_hanh' }, { luu: ['tab'] })   // tab con đang xem — nhớ theo máy (lib/nho)
const XU_LY: Record<string, [string, string]> = {
  chua: ['Chưa xử lý', 'bg-rose-50 text-rose-700'], bo_tro_yeu: ['Đang bổ trợ Yếu', 'bg-violet-50 text-violet-700'],
  ca_nhe: ['Có ca Nhẹ', 'bg-indigo-50 text-indigo-700'], theo_doi: ['Đang theo dõi', 'bg-amber-50 text-amber-800'],
}
const KHAU: Record<string, string> = { danhgia: 'Đánh giá sau buổi', ingame: 'Chấm trên lớp', et: 'Chấm ET', btvn: 'Chấm BTVN', mt: 'Chấm MT' }
const VAI: Record<string, string> = { tg: 'Trợ giảng', gv: 'Giáo viên', tk: 'Trưởng khối' }
const so = (v: number | null | undefined, hau = '') => (v == null ? '—' : `${v}${hau}`)
const gio = (ts: string | null) => ts ? new Date(ts).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'
const LUOI = 'grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(215px,1fr))]'
const TH = 'text-left text-[10.5px] uppercase tracking-wider text-slate-400'
const dongDem = (d: DemViec) => [`${d.dung_han}/${d.so_viec} việc đúng hạn`, `Đóng muộn ${d.muon} · chưa đóng ${d.chua}`]

export function NoiDungBaoCao({ duLieu, caNhan, setCaNhan, tuViet, setTuViet, sua, anChu, phan = 'tat_ca' }: {
  duLieu: SoBaoCao; caNhan: DongCaNhan[]; setCaNhan: Dispatch<SetStateAction<DongCaNhan[]>>; tuViet: TuViet; setTuViet: Dispatch<SetStateAction<TuViet>>; sua: boolean
  anChu?: boolean   // báo cáo môn: chỉ phần số, không có cá nhân / tự viết của một khối
  phan?: 'tat_ca' | 'o' | 'lop'   // chiếu TV: 'o' = chỉ hàng ô chỉ số · 'lop' = chỉ bảng từng lớp (mỗi phần một trang, chữ to)
}) {
  const [tabS, setTabS] = useState<TabND>(NHO.tab)
  const tab: TabND = anChu && (tabS === 'ca_nhan' || tabS === 'tu_viet') ? 'van_hanh' : tabS
  const setTab = (x: TabND) => { NHO.tab = x; setTabS(x) }
  const t = duLieu.tong, vh = duLieu.van_hanh, tr = duLieu.trend
  const uuTien = [0, 1, 2].map((i) => tuViet.uu_tien?.[i] ?? '')
  // 18/11: tuần đang chạy ⇒ "cuối" là số HIỆN TẠI (DB trả cờ) — chỉ đổi nhãn, không tính gì
  const ht = !!duLieu.cuoi_hien_tai
  const dauCuoi = ht ? 'đầu tuần → hiện tại' : 'đầu → cuối'

  // ── Ô chỉ số ──
  const oChamEt = <O ten="Chấm ET" chinh={so(t.et.ti_le_dung_han, '%')} nhanChinh="đúng hạn" phu={[`${t.et.dung_han}/${t.et.so_viec} buổi`, `Điểm TB ${so(t.et.diem_tb)}`]}
    trend={tr.map((w) => w.tong.et.ti_le_dung_han)} mau="text-sky-600" />
  const oBtvn = <O ten="BTVN" chinh={so(t.btvn.ti_le_nop, '%')} nhanChinh="em nộp" phu={[`Điểm TB ${so(t.btvn.diem_tb)}`, `Nộp đúng hạn ${so(t.btvn.ti_le_dung_han, '%')}`]}
    trend={tr.map((w) => w.tong.btvn.ti_le_nop)} mau="text-teal-600" />
  // 17/11 Thùy: HAI CHIỀU tách riêng — (1) đầu tuần → còn yếu (hiệu quả bổ trợ, cùng nhóm em × nút) · (2) phát sinh mới (kiến thức mới học bị yếu)
  const oYeu = t.hai_chieu ? <>
    <OHaiChieu ten="Nhóm yếu" h={t.hai_chieu.nhom} ht={ht} mau="text-orange-600" trend={tr.map((w) => w.tong.hai_chieu?.nhom ?? null)} />
    <OHaiChieu ten="Dạng yếu" h={t.hai_chieu.dang} ht={ht} mau="text-rose-600" trend={tr.map((w) => w.tong.hai_chieu?.dang ?? null)} them={`Độ phủ đo ${so(t.do_phu.ti_le, '%')}`} />
  </> : <>
    <O ten="Dạng yếu" chinh={`${so(t.dang_yeu.dau)} → ${so(t.dang_yeu.cuoi)}`} nhanChinh={dauCuoi}
      phu={[`Giảm ${so(t.dang_yeu.giam)} (${so(t.dang_yeu.ti_le_giam, '%')})`,
        ...(t.dong_chay ? [`Vào ${t.dong_chay.vao} · Ra ${t.dong_chay.ra_bang_chung} có bằng chứng`, `${t.dong_chay.ra_cua_so} rớt cửa sổ`] : []), `Độ phủ đo ${so(t.do_phu.ti_le, '%')}`]}
      trend={tr.map((w) => w.tong.dang_yeu.cuoi)} mau="text-rose-600" />
    {t.nhom_yeu && <O ten="Nhóm yếu" chinh={`${so(t.nhom_yeu.dau)} → ${so(t.nhom_yeu.cuoi)}`} nhanChinh={dauCuoi}
      phu={[`Giảm ${so(t.nhom_yeu.giam)} (${so(t.nhom_yeu.ti_le_giam, '%')})`]} trend={tr.map((w) => w.tong.nhom_yeu?.cuoi ?? null)} mau="text-orange-600" />}
  </>
  const oDiemEt = <O ten="Điểm ET" chinh={so(t.et.diem_tb)} nhanChinh="trung bình" phu={[`${t.et.so_luot} lượt làm`]} trend={tr.map((w) => w.tong.et.diem_tb)} mau="text-sky-600" />
  const oHsYeu = <O ten="Học sinh yếu" chinh={`${so(t.hs_yeu.dau)} → ${so(t.hs_yeu.cuoi)}`} nhanChinh={`${ht ? '→ hiện tại · ' : ''}/ ${t.hs_yeu.si_so} em`}
    phu={[`Giảm ${so(t.hs_yeu.giam)} (${so(t.hs_yeu.ti_le_giam, '%')})`, duLieu.hs_yeu_theo === 'nhom' ? 'Em có ≥ 1 nhóm yếu' : 'Bản cũ: em có ≥ 1 dạng yếu']}
    trend={tr.map((w) => w.tong.hs_yeu.cuoi)} mau="text-violet-600" />
  const oCaBoTro = <O ten="Ca bổ trợ" chinh={`${t.bo_tro.ca_yeu} + ${t.bo_tro.ca_nhe}`} nhanChinh="ca Yếu + Nhẹ" phu={[`${t.bo_tro.luot_hs} lượt em có mặt`]}
    trend={tr.map((w) => w.tong.bo_tro.ca_yeu + w.tong.bo_tro.ca_nhe)} mau="text-indigo-600" />

  // ── Chiếu TV: giữ đúng hai trang cũ ──
  if (phan === 'o') return <div className={LUOI}>{oChamEt}{oBtvn}{oYeu}{oHsYeu}{oCaBoTro}</div>
  if (phan === 'lop') return (
    // bảng chiếm hết bề ngang, chia đôi 2 cột lớp (danh sách HS đã có trang riêng)
    <div className="grid grid-cols-2 gap-3">
      <Khung ten="Từng lớp"><BangLop lop={duLieu.lop.slice(0, Math.ceil(duLieu.lop.length / 2))} /></Khung>
      <Khung ten="Từng lớp (tiếp)"><BangLop lop={duLieu.lop.slice(Math.ceil(duLieu.lop.length / 2))} /></Khung>
    </div>
  )

  const nut = (dang: boolean) => `rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${dang ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`
  return (
    <div className="space-y-3">
      <div className="min-w-0 space-y-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
          <button onClick={() => setTab('van_hanh')} className={nut(tab === 'van_hanh')}>⚙ Vận hành</button>
          <button onClick={() => setTab('hoc_tap')} className={nut(tab === 'hoc_tap')}>📚 Học tập</button>
          {!anChu && <button onClick={() => setTab('ca_nhan')} className={nut(tab === 'ca_nhan')}>🌱 Phát triển cá nhân{caNhan.length ? ` (${caNhan.length})` : ''}</button>}
          {/* Thùy 18/11 tối: Tự viết là tab con RIÊNG, không nằm chung màn với 3 tab kia */}
          {!anChu && <button onClick={() => setTab('tu_viet')} className={nut(tab === 'tu_viet')}>✍ Tự viết{sua && !(tuViet.nhan_dinh ?? '').trim() ? ' · chưa viết' : ''}</button>}
        </div>

        {/* ⚙ VẬN HÀNH — việc sau buổi của TA / GV trong khối */}
        {tab === 'van_hanh' && <>
          {vh?.tong ? <div className={LUOI}>
            <O ten="Việc sau buổi" chinh={so(vh.tong.ti_le_dung_han, '%')} nhanChinh="đúng hạn" phu={dongDem(vh.tong)} mau="text-slate-800" />
            {vh.khau.map((k) => <O key={k.tab} ten={KHAU[k.tab] ?? k.tab} chinh={so(k.ti_le_dung_han, '%')} nhanChinh="đúng hạn" phu={dongDem(k)}
              mau={k.chua > 0 ? 'text-rose-600' : k.muon > 0 ? 'text-amber-600' : 'text-emerald-600'} />)}
            {oDiemEt}{oBtvn}{oCaBoTro}
          </div> : <>
            <div className={LUOI}>{oChamEt}{oBtvn}{oCaBoTro}</div>
            <p className="text-[12px] text-slate-400">Báo cáo này chốt trước 18/11 nên phần Vận hành chỉ có số chấm ET. Báo cáo nộp từ nay có đủ đánh giá sau buổi · chấm ET · chấm BTVN · MT theo người và theo lớp.</p>
          </>}
          <MoChiTiet ten="Điểm ET · BTVN theo lớp" phu={`${duLieu.lop.length} lớp`} rong={duLieu.lop.length === 0}>
            <BangLop lop={duLieu.lop} che="van_hanh" />
          </MoChiTiet>
          {vh?.tong && <>
            <MoChiTiet ten="Việc đóng muộn / chưa đóng" phu={`${vh.tre.length} việc`} rong={vh.tre.length === 0}>
              <table className="w-full text-[12.5px]">
                <thead><tr className={TH}><th className="py-1">Lớp</th><th>Ngày dạy</th><th>Việc</th><th>Người phụ trách</th><th>Hạn</th><th>Tình trạng</th></tr></thead>
                <tbody>{vh.tre.map((v) => (
                  <tr key={`${v.buoi_id}|${v.tab}`} className="border-t border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-800">{v.ten_lop}</td>
                    <td className="whitespace-nowrap text-slate-600">{ddmmVN(v.ngay)}</td>
                    <td className="whitespace-nowrap">{KHAU[v.tab] ?? v.tab}</td>
                    <td className="text-slate-700">{v.nguoi ?? '—'}</td>
                    <td className="whitespace-nowrap text-slate-500">{gio(v.han)}</td>
                    <td className="whitespace-nowrap">{v.kq === 'chua' ? <b className="text-rose-600">Chưa đóng</b> : <span className="text-amber-700">Đóng muộn · {gio(v.dong)}</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </MoChiTiet>
            <div className="grid items-start gap-3 lg:grid-cols-2">
              <MoChiTiet ten="Theo người phụ trách" phu={`${vh.nguoi.length} dòng`} rong={vh.nguoi.length === 0}>
                <BangDem cot="Người" dong={vh.nguoi.map((n) => ({ khoa: `${n.nhan_su_id}|${n.vai}`, ten: n.ho_ten, phu: VAI[n.vai] ?? n.vai, d: n }))} />
              </MoChiTiet>
              <MoChiTiet ten="Theo lớp" phu={`${vh.lop.length} lớp`} rong={vh.lop.length === 0}>
                <BangDem cot="Lớp" dong={vh.lop.map((l) => ({ khoa: l.lop_id, ten: l.ten_lop, d: l }))} />
              </MoChiTiet>
            </div>
          </>}
        </>}

        {/* 📚 HỌC TẬP — thông số học của học sinh */}
        {tab === 'hoc_tap' && <>
          <BangHocTap duLieu={duLieu} />
          <div className="grid items-start gap-3 lg:grid-cols-[3fr_2fr]">
            <MoChiTiet ten="Từng lớp" phu={`${duLieu.lop.length} lớp`} rong={duLieu.lop.length === 0}>
              <BangLop lop={duLieu.lop} che="hoc_tap" />
            </MoChiTiet>
            <MoChiTiet ten={ht ? 'HS đang yếu (hiện tại)' : 'HS còn yếu cuối tuần'} phu={duLieu.co_anh_cuoi ? `${duLieu.hs_con_yeu.length} em` : 'chưa có ảnh cuối tuần'} rong={!duLieu.co_anh_cuoi || duLieu.hs_con_yeu.length === 0}>
              <ul className="max-h-[420px] space-y-1 overflow-auto pr-1">{duLieu.hs_con_yeu.map((h) => (
                <li key={`${h.hoc_sinh_id}|${h.mon}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1 text-[12.5px]">
                  <span className="min-w-0 flex-1 truncate" title={(h.nhom ?? h.dang).join(' · ')}><b className="text-slate-800">{h.ho_ten}</b> <span className="text-slate-500">· {h.ten_lop} · {h.so_nhom_yeu != null ? `${h.so_nhom_yeu} nhóm · ` : ''}{h.so_dang_yeu} dạng</span></span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${XU_LY[h.xu_ly][1]}`}>{XU_LY[h.xu_ly][0]}</span>
                </li>
              ))}</ul>
            </MoChiTiet>
          </div>
        </>}

        {/* 🌱 PHÁT TRIỂN CÁ NHÂN — task phát triển được giao */}
        {tab === 'ca_nhan' && !anChu && (
          <Khung ten="Việc phát triển được giao">
            {caNhan.length === 0 ? <p className="text-[12.5px] text-slate-400">Không có việc phát triển nào trong kỳ.</p> : (
              <table className="w-full text-[12.5px]">
                <thead><tr className={TH}><th className="py-1">Việc</th><th>Hạn</th><th className="w-[150px]">Trạng thái</th><th>Mô tả (lưu ý, khó khăn…)</th><th className="w-[80px]">% xong</th></tr></thead>
                <tbody>{caNhan.map((d, i) => {
                  const doi = (p: Partial<DongCaNhan>) => setCaNhan((prev) => prev.map((x, j) => (j === i ? { ...x, ...p } : x)))
                  const khoa = d.tu_dien || !sua
                  return (
                    <tr key={d.task_id} className="border-t border-slate-100 align-top">
                      <td className="py-1.5 pr-2 font-medium text-slate-800">{d.tieu_de}{d.tu_dien && <span className="ml-1 text-[10.5px] text-emerald-600">✓ đã duyệt</span>}</td>
                      <td className="whitespace-nowrap pr-2 text-slate-500">{ddmmVN(d.han)}{d.so_lan_gia_han > 0 ? ` · gia hạn ${d.so_lan_gia_han}` : ''}</td>
                      <td className="pr-2">{khoa ? <span className="text-slate-700">{d.trang_thai}</span>
                        : <input value={d.trang_thai} onChange={(e) => doi({ trang_thai: e.target.value })} className="w-full rounded border border-slate-200 px-1.5 py-0.5" />}</td>
                      <td className="pr-2">{khoa ? <span className="text-slate-600">{d.mo_ta || '—'}</span>
                        : <textarea value={d.mo_ta} onChange={(e) => doi({ mo_ta: e.target.value })} rows={1} className="w-full resize-y rounded border border-slate-200 px-1.5 py-0.5" />}</td>
                      <td>{khoa ? <span className="font-semibold text-slate-700">{so(d.pct, '%')}</span>
                        : <input type="number" min={0} max={100} value={d.pct ?? ''} onChange={(e) => doi({ pct: e.target.value === '' ? null : Number(e.target.value) })} className="w-full rounded border border-slate-200 px-1.5 py-0.5" />}</td>
                    </tr>
                  )
                })}</tbody>
              </table>
            )}
          </Khung>
        )}
      </div>

      {/* ✍ TỰ VIẾT — Plans · Progress · Problems (tab con riêng) */}
      {tab === 'tu_viet' && !anChu && (
        <div className="max-w-[980px]"><Khung ten="Tự viết — Plans · Progress · Problems">
          <label className="block text-[11.5px] font-semibold text-slate-500">Nhận định tình hình khối <span className="text-rose-500">*</span></label>
          <textarea disabled={!sua} value={tuViet.nhan_dinh ?? ''} onChange={(e) => setTuViet((v) => ({ ...v, nhan_dinh: e.target.value }))} rows={6}
            className="mb-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] text-slate-800 disabled:bg-slate-50" placeholder="Đọc số thấy gì, vì sao…" />
          <label className="block text-[11.5px] font-semibold text-slate-500">3 việc ưu tiên tuần tới <span className="text-rose-500">*</span></label>
          {uuTien.map((u, i) => (
            <input key={i} disabled={!sua} value={u} placeholder={`Việc ${i + 1}`}
              onChange={(e) => setTuViet((v) => { const a = [0, 1, 2].map((k) => v.uu_tien?.[k] ?? ''); a[i] = e.target.value; return { ...v, uu_tien: a } })}
              className="mb-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] text-slate-800 disabled:bg-slate-50" />
          ))}
          <label className="mt-1 block text-[11.5px] font-semibold text-slate-500">Cần hỗ trợ gì</label>
          <textarea disabled={!sua} value={tuViet.can_ho_tro ?? ''} onChange={(e) => setTuViet((v) => ({ ...v, can_ho_tro: e.target.value }))} rows={4}
            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] text-slate-800 disabled:bg-slate-50" placeholder="Từ trưởng bộ môn / CEO…" />
        </Khung></div>
      )}
    </div>
  )
}

// BẢNG HỌC TẬP (Thùy 18/11 chiều): mỗi chỉ số MỘT dòng — đầu tuần có gì → cuối tuần (tuần đang chạy: hiện tại) ra sao → làm được bao nhiêu (số tuyệt đối + %).
// Chưa nhập mục tiêu (Thùy: "theo dõi qua mỗi tuần đã"); cột Thường đạt để sẵn, có số khi đủ tuần. Mọi số do DB trả (fn_bctk_so, khối 'ht' + 'hai_chieu').
function BangHocTap({ duLieu }: { duLieu: SoBaoCao }) {
  const t = duLieu.tong, h = t.ht, hc = t.hai_chieu, tr = duLieu.trend, ht = !!duLieu.cuoi_hien_tai, td = duLieu.thuong_dat
  // Một ô = SỐ to ở trên + chữ chú thích nhỏ ở dưới (Thùy 18/11); mọi cột căn trái.
  type OSo = { so: ReactNode; chu?: string; mau?: string } | null
  type Dong = { ten: string; chu?: string; dau: OSo; cuoi: OSo; kq: OSo; td: OSo; trend: (number | null | undefined)[] }
  const pt = (p: number | null | undefined) => so(p, '%')
  const xanhDo = (n: number) => n > 0 ? 'text-emerald-600' : n < 0 ? 'text-rose-600' : 'text-slate-600'
  const giam = (n: number | null | undefined, p: number | null | undefined, duoi = 'so với đầu tuần'): OSo => n == null ? null
    : { so: n > 0 ? `Giảm ${n}` : n < 0 ? `Tăng ${-n}` : 'Không đổi', chu: `${pt(p != null && n < 0 ? -p : p)} ${duoi}`, mau: xanhDo(n) }
  // Thường đạt: chưa đủ tuần ⇒ ghi rõ đang có mấy tuần; bản chốt cũ không có khoá này ⇒ trống
  const tdO = (f: (x: NonNullable<SoBaoCao['thuong_dat']>) => OSo): OSo => !td ? null
    : td.so_tuan < td.can ? { so: '—', chu: `mới có ${td.so_tuan}/${td.can} tuần`, mau: 'text-slate-300' } : f(td)
  const tdGiam = (x: { so: number | null; ti_le: number | null } | undefined): OSo => !x || x.so == null ? null : { ...giam(x.so, x.ti_le, 'mỗi tuần')!, mau: 'text-slate-600' }
  const tdTiLe = (x: { ti_le: number | null } | undefined): OSo => !x ? null : { so: pt(x.ti_le), chu: 'trung bình các tuần trước', mau: 'text-slate-600' }
  const haiChieu = (ten: string, x: HaiChieu | undefined, lay: (w: TongSo) => number | null | undefined, tdx: OSo): Dong => x
    ? { ten, dau: { so: x.dau }, cuoi: { so: x.con_yeu, chu: `còn yếu · phát sinh mới +${x.phat_sinh} · tổng ${x.cuoi}${x.roi ? ` · ${x.roi} của em thôi học` : ''}` },
        kq: { so: `Giảm ${x.het_yeu}`, chu: `${pt(x.ti_le_het_yeu)} số đầu tuần đã hết yếu`, mau: 'text-emerald-600' }, td: tdx, trend: tr.map((w) => lay(w.tong)) }
    : { ten, chu: 'chưa đủ ảnh đầu / cuối tuần', dau: null, cuoi: null, kq: null, td: tdx, trend: [] }
  const ds: Dong[] = [
    haiChieu('Nhóm yếu', hc?.nhom, (w) => w.hai_chieu?.nhom.het_yeu, tdO((x) => tdGiam(x.nhom))),
    haiChieu('Dạng yếu', hc?.dang, (w) => w.hai_chieu?.dang.het_yeu, tdO((x) => tdGiam(x.dang))),
    { ten: 'Học sinh yếu', chu: 'có ≥ 1 nhóm yếu', dau: t.hs_yeu.dau == null ? null : { so: t.hs_yeu.dau, chu: `trên ${t.hs_yeu.si_so} em` }, cuoi: t.hs_yeu.cuoi == null ? null : { so: t.hs_yeu.cuoi },
      kq: giam(t.hs_yeu.giam, t.hs_yeu.ti_le_giam), td: tdO((x) => tdGiam(x.hs_yeu_1)), trend: tr.map((w) => w.tong.hs_yeu.cuoi) },
    { ten: 'Học sinh yếu', chu: 'có ≥ 2 nhóm yếu', dau: h?.hs_yeu_2.dau == null ? null : { so: h.hs_yeu_2.dau }, cuoi: h?.hs_yeu_2.cuoi == null ? null : { so: h.hs_yeu_2.cuoi },
      kq: h ? giam(h.hs_yeu_2.giam, h.hs_yeu_2.ti_le_giam) : null, td: tdO((x) => tdGiam(x.hs_yeu_2)), trend: tr.map((w) => w.tong.ht?.hs_yeu_2.cuoi) },
    { ten: 'HS yếu được xếp bổ trợ', chu: 'HS yếu = có ≥ 2 nhóm yếu đầu tuần', dau: h?.xep ? { so: h.xep.yeu_2, chu: 'HS yếu đầu tuần' } : null, cuoi: h?.xep ? { so: h.xep.xep_2, chu: 'em được xếp ca' } : null,
      kq: h?.xep ? { so: pt(h.xep.ti_le_2), chu: `${h.xep.xep_2}/${h.xep.yeu_2} em · tính cả em ≥ 1 nhóm: ${h.xep.xep_1}/${h.xep.yeu_1} (${pt(h.xep.ti_le_1)})`, mau: 'text-indigo-600' } : null,
      td: tdO((x) => tdTiLe(x.xep)), trend: tr.map((w) => w.tong.ht?.xep?.ti_le_2) },
    { ten: 'Hiệu suất bổ trợ', chu: '1 em × 1 dạng = 1 đơn vị', dau: h ? { so: h.hieu_suat.don_vi, chu: 'đơn vị được test' } : null, cuoi: h ? { so: h.hieu_suat.het_yeu, chu: 'đơn vị hết yếu' } : null,
      kq: h ? { so: pt(h.hieu_suat.ti_le), chu: `${h.hieu_suat.het_yeu}/${h.hieu_suat.don_vi} đơn vị`, mau: 'text-emerald-600' } : null, td: tdO((x) => tdTiLe(x.hieu_suat)), trend: tr.map((w) => w.tong.ht?.hieu_suat.ti_le) },
    { ten: 'Vắng ca bổ trợ', chu: 'lượt vắng / lượt đã điểm danh', dau: h ? { so: h.vang.luot_xep, chu: 'lượt xếp' } : null, cuoi: h ? { so: h.vang.vang, chu: 'lượt vắng' } : null,
      kq: h ? { so: pt(h.vang.ti_le), chu: `${h.vang.vang}/${h.vang.da_diem_danh} lượt đã điểm danh`, mau: h.vang.vang > 0 ? 'text-rose-600' : 'text-emerald-600' } : null,
      td: tdO((x) => tdTiLe(x.vang)), trend: tr.map((w) => w.tong.ht?.vang.ti_le) },
    { ten: 'HS yếu chưa ai xử lý', chu: 'chưa có đề xuất · ca · theo dõi', dau: null, cuoi: h?.chua_xu_ly ? { so: h.chua_xu_ly.n1, chu: 'em — việc của tuần tới' } : null,
      kq: h?.chua_xu_ly ? { so: `${h.chua_xu_ly.n1} em`, chu: `trong đó ≥ 2 nhóm yếu: ${h.chua_xu_ly.n2} em`, mau: h.chua_xu_ly.n1 > 0 ? 'text-rose-600' : 'text-emerald-600' } : null,
      td: tdO((x) => x.chua_xu_ly?.so == null ? null : { so: `${x.chua_xu_ly.so} em`, chu: 'trung bình các tuần trước', mau: 'text-slate-600' }), trend: tr.map((w) => w.tong.ht?.chua_xu_ly?.n1) },
  ]
  const td0 = 'border-t border-slate-100 px-3 py-2 text-left align-top'
  const o = (x: OSo, macDinh = 'text-slate-800') => x == null ? <span className="text-[18px] font-bold text-slate-300">—</span> : (
    <>
      <div className={`whitespace-nowrap text-[19px] font-extrabold leading-tight tabular-nums ${x.mau ?? macDinh}`}>{x.so}</div>
      {x.chu && <div className="text-[11.5px] leading-snug text-slate-500">{x.chu}</div>}
    </>
  )
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full table-fixed text-[13px]">
        <colgroup><col className="w-[19%]" /><col className="w-[12%]" /><col className="w-[21%]" /><col className="w-[22%]" /><col className="w-[16%]" /><col className="w-[10%]" /></colgroup>
        <thead><tr className={`${TH} bg-slate-50`}>
          <th className="px-3 py-2">Chỉ số</th><th className="px-3 py-2">Đầu tuần</th><th className="px-3 py-2">{ht ? 'Hiện tại' : 'Cuối tuần'}</th>
          <th className="px-3 py-2">Kết quả</th><th className="px-3 py-2" title="Trung bình các tuần đã đóng liền trước (tối đa 8 tuần, cần ít nhất 4 tuần) của chính các khối này">Thường đạt</th><th className="px-3 py-2">4 tuần</th>
        </tr></thead>
        <tbody>{ds.map((d, i) => (
          <tr key={i}>
            <td className={td0}><div className="text-[14.5px] font-bold leading-tight text-slate-800">{d.ten}</div>{d.chu && <div className="text-[11.5px] leading-snug text-slate-400">{d.chu}</div>}</td>
            <td className={td0}>{o(d.dau, 'text-slate-600')}</td>
            <td className={td0}>{o(d.cuoi)}</td>
            <td className={td0}>{o(d.kq)}</td>
            <td className={td0}>{o(d.td)}</td>
            <td className={td0}><Cot4 v={d.trend} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

// 4 cột nhỏ: dãy số DB trả về của 4 tuần gần nhất (cũ → mới); tuần chưa có số = vạch mờ.
function Cot4({ v }: { v: (number | null | undefined)[] }) {
  const lon = Math.max(1, ...v.map((x) => Math.abs(x ?? 0)))
  return (
    <div className="flex h-6 w-[72px] items-end gap-1" title={v.map((x) => x ?? '—').join(' → ')}>
      {v.map((x, i) => <div key={i} className={`flex-1 rounded-t ${i === v.length - 1 ? 'bg-indigo-400' : 'bg-slate-300'}`} style={{ height: x == null ? 2 : `${Math.max(10, (Math.abs(x) / lon) * 100)}%` }} />)}
    </div>
  )
}

// Mục chi tiết: mặc định gập, bấm mới mở (dữ liệu đã nằm sẵn trong báo cáo — mở không gọi thêm gì).
function MoChiTiet({ ten, phu, rong, children }: { ten: string; phu?: string; rong?: boolean; children: ReactNode }) {
  const [mo, setMo] = useState(false)
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button onClick={() => !rong && setMo((v) => !v)} className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-2 text-left ${rong ? 'cursor-default' : 'hover:bg-slate-50'}`}>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{ten}</span>
        {phu && <span className="text-[12px] text-slate-400">· {phu}</span>}
        {!rong && <span className="ml-auto text-[12px] font-medium text-indigo-600">{mo ? 'Thu gọn ▴' : 'Xem chi tiết ▾'}</span>}
      </button>
      {mo && !rong && <div className="overflow-x-auto border-t border-slate-100 px-3 py-2">{children}</div>}
    </div>
  )
}

// Bảng đếm việc theo người / theo lớp (chỉ hiển thị số DB trả về).
function BangDem({ cot, dong }: { cot: string; dong: { khoa: string; ten: string; phu?: string; d: DemViec }[] }) {
  return (
    <table className="w-full text-[12.5px]">
      <thead><tr className={TH}><th className="py-1">{cot}</th><th>Đúng hạn</th><th>Số việc</th><th>Đóng muộn</th><th>Chưa đóng</th></tr></thead>
      <tbody>{dong.map(({ khoa, ten, phu, d }) => (
        <tr key={khoa} className="border-t border-slate-100 whitespace-nowrap">
          <td className="py-1.5 font-semibold text-slate-800">{ten}{phu && <span className="ml-1.5 text-[11px] font-normal text-slate-400">{phu}</span>}</td>
          <td><b className={d.chua > 0 ? 'text-rose-600' : d.muon > 0 ? 'text-amber-600' : 'text-emerald-600'}>{so(d.ti_le_dung_han, '%')}</b> <span className="text-slate-400">({d.dung_han}/{d.so_viec})</span></td>
          <td>{d.so_viec}</td>
          <td className={d.muon > 0 ? 'text-amber-700' : 'text-slate-300'}>{d.muon}</td>
          <td className={d.chua > 0 ? 'font-semibold text-rose-600' : 'text-slate-300'}>{d.chua}</td>
        </tr>
      ))}</tbody>
    </table>
  )
}

// Bảng từng lớp (chỉ hiển thị số DB trả về). che: 'van_hanh' = chỉ ET · BTVN · 'hoc_tap' = chỉ dạng / nhóm / HS yếu · không truyền = đủ cột (chiếu TV).
function BangLop({ lop, che }: { lop: SoBaoCao['lop']; che?: 'van_hanh' | 'hoc_tap' }) {
  const vh = che !== 'hoc_tap', ht = che !== 'van_hanh'
  return (
    <table className="w-full text-[12.5px]">
      <thead><tr className={TH}>
        <th className="py-1">Lớp</th>{vh && <><th>ET đúng hạn</th><th>ET TB</th><th>BTVN nộp</th><th>BTVN TB</th></>}{ht && <><th>Dạng yếu</th><th>Nhóm yếu</th><th>HS yếu</th></>}
      </tr></thead>
      <tbody>{lop.map((l) => (
        <tr key={l.lop_id} className="border-t border-slate-100 whitespace-nowrap">
          <td className="py-1.5 font-semibold text-slate-800">{l.ten_lop}</td>
          {vh && <>
            <td>{so(l.et.ti_le_dung_han, '%')} <span className="text-slate-400">({l.et.dung_han}/{l.et.so_viec})</span></td>
            <td>{so(l.et.diem_tb)}</td>
            <td>{so(l.btvn.ti_le_nop, '%')}</td>
            <td>{so(l.btvn.diem_tb)}</td>
          </>}
          {ht && <>
          <td>{l.hai_chieu ? <HaiChieuO h={l.hai_chieu.dang} mau="text-rose-600" /> : <>{so(l.dang_yeu.dau)} → <b className="text-rose-600">{so(l.dang_yeu.cuoi)}</b></>}</td>
          <td>{l.hai_chieu ? <HaiChieuO h={l.hai_chieu.nhom} mau="text-orange-600" /> : l.nhom_yeu ? <>{so(l.nhom_yeu.dau)} → <b className="text-orange-600">{so(l.nhom_yeu.cuoi)}</b></> : <span className="text-slate-300">—</span>}</td>
          <td>{so(l.hs_yeu.dau)} → <b className="text-violet-600">{so(l.hs_yeu.cuoi)}</b><span className="text-slate-400">/{l.hs_yeu.si_so}</span></td>
          </>}
        </tr>
      ))}</tbody>
    </table>
  )
}

// Một ô bảng lớp: đầu → còn yếu · −hết yếu · +phát sinh (chỉ hiển thị số DB trả về).
function HaiChieuO({ h, mau }: { h: HaiChieu; mau: string }) {
  return <span title={`Đầu tuần ${h.dau} · còn yếu ${h.con_yeu} · hết yếu ${h.het_yeu}${h.roi ? ` · em thôi học ${h.roi}` : ''} · phát sinh mới ${h.phat_sinh} · cuối tuần ${h.cuoi}`}>
    {h.dau} → <b className={mau}>{h.con_yeu}</b> <span className="text-emerald-600">−{h.het_yeu}</span> <span className="text-amber-600">+{h.phat_sinh}</span>
  </span>
}

// Khung một ô chỉ số: hàng tên (nhãn phụ bên phải) · SỐ CHÍNH một hàng · các dòng phụ, mỗi dòng một hàng (dài thì cắt, rê chuột xem đủ).
function KhungO({ ten, nhan, chinh, mau, dong, children }: { ten: string; nhan: string; chinh: string; mau: string; dong: ReactNode[]; children?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="flex items-baseline justify-between gap-2 whitespace-nowrap">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{ten}</span>
        <span className="truncate text-[11px] text-slate-400">{nhan}</span>
      </div>
      <div className={`whitespace-nowrap text-[24px] font-extrabold leading-tight ${mau}`}>{chinh}</div>
      {dong.map((d, i) => <div key={i} className="truncate whitespace-nowrap text-[11.5px] leading-snug text-slate-500" title={typeof d === 'string' ? d : undefined}>{d}</div>)}
      {children}
    </div>
  )
}

// Ô HAI CHIỀU (Thùy 17/11): chiều 1 = đầu tuần → còn yếu (hiệu quả bổ trợ); chiều 2 = phát sinh mới; trend 2 dãy (hết yếu xanh · phát sinh vàng).
function OHaiChieu({ ten, h, mau, trend, them, ht }: { ten: string; h: HaiChieu; mau: string; trend: (HaiChieu | null)[]; them?: string; ht?: boolean }) {
  const lon = Math.max(1, ...trend.flatMap((v) => [v?.het_yeu ?? 0, v?.phat_sinh ?? 0]))
  return (
    <KhungO ten={ten} nhan="đầu tuần → còn yếu" chinh={`${h.dau} → ${h.con_yeu}`} mau={mau} dong={[
      <>① Hết yếu <b className="text-emerald-600">{h.het_yeu}</b> ({so(h.ti_le_het_yeu, '%')}){h.roi ? ` · ${h.roi} của em thôi học` : ''}</>,
      <>② Phát sinh mới <b className="text-amber-600">+{h.phat_sinh}</b> · {ht ? 'hiện tại' : 'cuối tuần'} {h.cuoi}</>,
      ...(them ? [them] : []),
    ]}>
      <div className="mt-auto flex h-7 items-end gap-1 pt-1.5" title="4 tuần gần nhất (cũ → mới): xanh = hết yếu · vàng = phát sinh mới">
        {trend.map((v, i) => (
          <div key={i} className="flex h-full flex-1 items-end justify-center gap-px" title={v == null ? 'chưa có số' : `hết yếu ${v.het_yeu} · phát sinh ${v.phat_sinh}`}>
            <div className="w-1/2 rounded-t bg-emerald-300" style={{ height: v == null ? 2 : `${Math.max(8, (v.het_yeu / lon) * 100)}%` }} />
            <div className="w-1/2 rounded-t bg-amber-300" style={{ height: v == null ? 2 : `${Math.max(8, (v.phat_sinh / lon) * 100)}%` }} />
          </div>
        ))}
      </div>
    </KhungO>
  )
}

// Ô chỉ số: số chính to + các dòng phụ + (nếu có) 4 cột trend — chỉ vẽ dãy số DB trả về, không tính gì.
export function O({ ten, chinh, nhanChinh, phu, trend, mau }: { ten: string; chinh: string; nhanChinh: string; phu: string | string[]; trend?: (number | null)[]; mau: string }) {
  const lon = Math.max(1, ...(trend ?? []).map((v) => v ?? 0))
  return (
    <KhungO ten={ten} nhan={nhanChinh} chinh={chinh} mau={mau} dong={Array.isArray(phu) ? phu : [phu]}>
      {trend && (
        <div className="mt-auto flex h-7 items-end gap-1 pt-1.5" title="4 tuần gần nhất (cũ → mới)">
          {trend.map((v, i) => (
            // h-full: cột con cao theo % ⇒ khung cha phải có chiều cao, thiếu là mọi cột về 0 (chỉ cột trống 2px còn thấy)
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end" title={v == null ? 'chưa có số' : String(v)}>
              <div className={`w-full rounded-t ${i === trend.length - 1 ? 'bg-indigo-400' : 'bg-slate-200'}`} style={{ height: v == null ? 2 : `${Math.max(8, (v / lon) * 100)}%` }} />
            </div>
          ))}
        </div>
      )}
    </KhungO>
  )
}

export const Khung = ({ ten, children }: { ten: string; children: ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
    <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{ten}</p>
    {children}
  </div>
)
