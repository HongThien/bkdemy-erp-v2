// Tab "Mục tiêu tuần" — Dashboard học tập (cũng hiện trong Phòng làm việc trưởng khối vì phòng dùng chung màn này).
// spec-muc-tieu-tuan.md §9.3: lọc môn · khối · tuần · 4 ô tổng · bảng theo lớp (nháp / đã công bố + nút Công bố) ·
// em cần để ý (bấm ⇒ tờ của em). Mọi con số từ DB (fn_mtt_trung_tam, fn_mtt_hs — mig 202611131000); client chỉ định dạng.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  mttTrungTam, mttCuaHs, mttViecDang, mttDangTinhTrang, mttChotLop, mttCongBoLai, mttCacTuan, mttTop, mttDsLop, laChuaChot, dauTuanNay, congNgay, ngayNgan, thuNgay, gioPhut, nhanHoc,
  NHAN_MUC, NHAN_TT, NHAN_THAI_DO, TEN_VIEC,
  type MttTrungTam, type MttTo, type MttNhom, type MttViec, type MucDanhGia, type MttTuanCu, type MttTop, type MttEmLop, type MttDangTT, type MttViecDang,
} from '../../lib/mucTieuTuan'
import { PH_BASE } from '../../lib/ph-login'
import { nhoBen } from '../../lib/nho'

// rời tab quay lại = đúng chỗ cũ (CLAUDE §React)
const NHO = nhoBen<{ tuan: string | null; khoa: string; data: MttTrungTam | null; lop: { id: string; ten: string } | null; hs: { id: string; ten: string } | null }>('muc_tieu_tuan', { tuan: null, khoa: '', data: null, lop: null, hs: null }, { luu: ['lop', 'hs'], trongNgay: ['tuan'] })

const mauMuc = (m: MucDanhGia | null) => m === 'tot' ? 'bg-emerald-100 text-emerald-800' : m === 'tam_on' ? 'bg-amber-100 text-amber-800' : m === 'chua_tot' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
const so = (v: number | null | undefined, hau = '') => (v == null ? '—' : `${Math.round(v)}${hau}`)

// dau = phần đầu dòng do màn chứa đưa vào (tiêu đề · chọn ô · ↻) ⇒ cả header nằm trên MỘT dòng (Thùy 17/11: "header gọn lại 1 dòng")
export default function MucTieuTuanTab({ mon, khoi, lamMoi, dau }: { mon: string; khoi: string | null; lamMoi: number; dau?: ReactNode }) {
  const nay = dauTuanNay()
  const [tuan, setTuan] = useState(NHO.tuan ?? nay)
  const [data, setData] = useState<MttTrungTam | null>(NHO.data)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangChot, setDangChot] = useState<string | null>(null)
  const [tb, setTb] = useState<string | null>(null)
  const [xemHs, setXemHs] = useState<{ id: string; ten: string } | null>(NHO.hs)
  const [moTop, setMoTop] = useState(false)
  const [xemLop, setXemLop] = useState<{ id: string; ten: string } | null>(NHO.lop)
  const [lanDau, setLanDau] = useState(lamMoi)
  useEffect(() => { NHO.tuan = tuan }, [tuan])
  useEffect(() => { NHO.lop = xemLop; NHO.hs = xemHs }, [xemLop, xemHs])
  // đổi môn / khối ⇒ lớp và em đang xem không còn thuộc ngữ cảnh mới ⇒ về tổng quan (lần mount đầu giữ chỗ cũ)
  const ngCanh = useRef(mon + '|' + khoi)
  useEffect(() => { const k = mon + '|' + khoi; if (ngCanh.current !== k) { ngCanh.current = k; setXemLop(null); setXemHs(null) } }, [mon, khoi])

  // lớp đang nhớ không thuộc khối vừa tải (đổi ô môn × khối làm màn mount lại, NHO còn giữ lớp của khối cũ) ⇒ về tổng quan khối
  useEffect(() => {
    if (!data || NHO.khoa !== [mon, khoi, tuan].join('|')) return
    if (xemLop && !data.lop.some((l) => l.lop_id === xemLop.id)) { setXemLop(null); setXemHs(null) }
  }, [data, xemLop, mon, khoi, tuan])

  // đổi ngữ cảnh (môn/khối/tuần) hoặc bấm ↻ ⇒ tải lại; quay lại tab cùng ngữ cảnh ⇒ dùng bản đã nhớ
  useEffect(() => {
    if (!khoi) return
    const khoa = [mon, khoi, tuan].join('|')
    if (lamMoi === lanDau && NHO.data && NHO.khoa === khoa) return
    setLanDau(lamMoi)
    let alive = true
    setLoi(null); setDangTai(true)
    if (NHO.khoa !== khoa) setData(null)
    mttTrungTam(mon, khoi, tuan)
      .then((d) => { if (alive) { NHO.khoa = khoa; NHO.data = d; setData(d) } })
      .catch((e) => alive && setLoi('Không tải được: ' + (e?.message ?? e)))
      .finally(() => alive && setDangTai(false))
    return () => { alive = false }
  }, [mon, khoi, tuan, lamMoi]) // eslint-disable-line react-hooks/exhaustive-deps

  // công bố 1 lớp: vá đúng dòng lớp đó ngay, rồi đọc lại NỀN (số của cả khối đổi theo) — không xoá bảng
  const chot = async (lopId: string, boTroCho = 0) => {
    if (!khoi) return
    if (boTroCho > 0 && !window.confirm(`Lớp còn ${boTroCho} đề xuất bổ trợ chưa duyệt. Công bố bây giờ thì phần đó không vào mục tiêu tuần này (sẽ hiện "thêm sau khi công bố"). Vẫn công bố?`)) return
    setDangChot(lopId); setLoi(null); setTb(null)
    try {
      const r = await mttChotLop(lopId, tuan)
      setData((d) => d && ({ ...d, lop: d.lop.map((l) => l.lop_id === lopId ? { ...l, chot_at: r.chot_at } : l) }))
      setTb(`Đã công bố — hệ đang khoá mục tiêu cho ${r.tong} em (theo giáo trình + bổ trợ hiện tại), vài phút nữa xong. Học sinh mở app lúc này đã thấy tờ.`)
      const moi = await mttTrungTam(mon, khoi, tuan)
      NHO.data = moi; NHO.khoa = [mon, khoi, tuan].join('|'); setData(moi)
    } catch (e) {
      setLoi('Chưa chốt được: ' + ((e as { message?: string })?.message ?? e))
    } finally { setDangChot(null) }
  }

  // Công bố lại (Thùy 18/11): giáo trình sửa sau khi đã công bố ⇒ khoá lại Phần 1; bắt buộc lý do. Vá đúng dòng lớp, không tải lại bảng.
  const congBoLai = async (lopId: string, tenLop: string) => {
    const lyDo = window.prompt(`Công bố lại ${tenLop}: mục tiêu "Bài trên lớp" của cả lớp sẽ khoá lại theo giáo trình hiện tại (bản cũ giữ làm vết).
Lý do công bố lại:`)
    if (lyDo == null) return
    if (!lyDo.trim()) { setLoi('Công bố lại phải ghi lý do.'); return }
    setDangChot(lopId); setLoi(null); setTb(null)
    try {
      const r = await mttCongBoLai(lopId, tuan, lyDo.trim())
      setData((d) => { const moi = d && ({ ...d, lop: d.lop.map((l) => l.lop_id === lopId ? { ...l, cong_bo_lai_at: r.at } : l) }); if (moi) NHO.data = moi; return moi })
      setTb(`Đã công bố lại ${tenLop} — hệ đang khoá lại mục tiêu cho ${r.tong} em theo giáo trình hiện tại, vài phút nữa xong.`)
    } catch (e) {
      setLoi('Chưa công bố lại được: ' + ((e as { message?: string })?.message ?? e))
    } finally { setDangChot(null) }
  }
  // thiếu giáo trình ⇒ không công bố được (DB cũng chặn — cùng phép đếm với cột "Giáo trình x/y")
  const thieuGt = (l: { so_buoi: number; so_buoi_co_tl: number }) => l.so_buoi > 0 && l.so_buoi_co_tl < l.so_buoi
  const chuThieu = (l: { so_buoi: number; so_buoi_co_tl: number }) => `Thiếu giáo trình ${l.so_buoi_co_tl}/${l.so_buoi} buổi — điền đủ ở 📅 Giáo trình tuần rồi mới công bố`

  const tong = data?.tong
  const tile = 'rounded-xl border border-slate-200 bg-white px-4 py-3'
  const nhanTile = 'text-[11px] font-bold uppercase tracking-wide text-slate-500'
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {dau}
        <div className="flex items-center overflow-hidden rounded-md ring-1 ring-slate-200">
          <button onClick={() => setTuan(congNgay(tuan, -7))} className="h-8 bg-white px-2.5 text-[15px] font-bold !text-slate-800 hover:bg-slate-50" aria-label="Tuần trước" title="Tuần trước">‹</button>
          <span className="h-8 bg-white px-3 text-[13px] font-semibold leading-8 text-slate-800">Tuần {ngayNgan(tuan)} – {ngayNgan(congNgay(tuan, 6))}{tuan === nay ? ' (đang chạy)' : ''}</span>
          <button onClick={() => setTuan(congNgay(tuan, 7))} disabled={tuan >= nay} className="h-8 bg-white px-2.5 text-[15px] font-bold !text-slate-800 hover:bg-slate-50 disabled:opacity-30" aria-label="Tuần sau" title="Tuần sau">›</button>
        </div>
        {/* Thùy 24/11 "qua tuần mà trưởng khối chưa nhìn thấy số chốt mục tiêu tuần": tuần đã qua = SỔ KẾT QUẢ máy chốt 00:00 thứ Hai (mtt_chot) —
            ghi rõ là bản chốt; đang ở tuần này thì có lối thẳng sang kết quả tuần trước */}
        {tuan < nay
          ? <span className="rounded-md bg-slate-800 px-2 py-1 text-[12px] font-semibold text-white">📌 Kết quả tuần — bản chốt 00:00 thứ Hai {ngayNgan(congNgay(tuan, 7))}</span>
          : <button onClick={() => setTuan(congNgay(nay, -7))} className="h-7 rounded-md bg-slate-800 px-2.5 text-[12px] font-semibold text-white hover:bg-slate-700"
              title="Sổ kết quả tuần trước — máy chốt lúc 00:00 thứ Hai, không sửa được">📌 Kết quả tuần trước ({ngayNgan(congNgay(nay, -7))} – {ngayNgan(congNgay(nay, -1))})</button>}
        {data && (xemLop || xemHs) && <>
          <button onClick={() => { setXemLop(null); setXemHs(null) }} className="no-nut-ve h-7 rounded-md bg-indigo-600 px-2.5 text-[12px] font-semibold text-white hover:bg-indigo-700" title="Về bảng tổng quan khối (công bố từng lớp, số cả khối)">← Tổng quan khối</button>
          {data.lop.map((l) => <button key={l.lop_id} onClick={() => { setXemLop({ id: l.lop_id, ten: l.ten_lop }); setXemHs(null) }}
            className={`h-7 rounded-full px-2.5 text-[12px] font-semibold ${xemLop?.id === l.lop_id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{l.ten_lop}</button>)}
        </>}
        {/* Thùy 18/11: nút Công bố có cả ở màn trong (đang xem lớp / em) — không phải quay ra tổng quan khối */}
        {data && xemLop && (() => {
          const l = data.lop.find((x) => x.lop_id === xemLop.id)
          if (!l) return null
          return l.chot_at
            ? <>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200">✓ {l.ten_lop} đã công bố {gioPhut(l.chot_at)} {ngayNgan(l.chot_at.slice(0, 10))}{l.cong_bo_lai_at ? ` · công bố lại ${gioPhut(l.cong_bo_lai_at)}` : ''}</span>
                {data.dang_chay && <button onClick={() => congBoLai(l.lop_id, l.ten_lop)} disabled={dangChot !== null || thieuGt(l)} title={thieuGt(l) ? chuThieu(l) : 'Giáo trình sửa sau khi công bố ⇒ khoá lại mục tiêu Bài trên lớp theo giáo trình hiện tại'}
                  className="h-7 rounded-md bg-white px-2.5 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50">{dangChot === l.lop_id ? 'Đang công bố lại…' : '🔁 Công bố lại'}</button>}
              </>
            : data.dang_chay
              ? thieuGt(l)
                ? <span className="rounded-md bg-orange-50 px-2 py-1 text-[12px] font-semibold text-orange-700 ring-1 ring-orange-200">{chuThieu(l)}</span>
                : <button onClick={() => chot(l.lop_id, l.bo_tro_cho)} disabled={dangChot !== null} title="Khoá mục tiêu tuần của cả lớp + đưa lên app HS / PH"
                  className="h-7 rounded-md bg-slate-800 px-2.5 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
                  {dangChot === l.lop_id ? 'Đang công bố…' : `📣 Công bố ${l.ten_lop}${l.bo_tro_cho > 0 ? ` · ${l.bo_tro_cho} bổ trợ chờ` : ''}`}
                </button>
              : <span className="text-[12px] text-slate-400">Tuần đã qua — không công bố</span>
        })()}
        {data?.tinh_at && tuan === nay && <span className="text-[11.5px] text-slate-400" title="Lớp chưa công bố thì học sinh và phụ huynh chưa thấy tờ tuần này (nhân sự xem được bản nháp). Phần 2 (bổ trợ) tự đồng bộ theo lượt chốt bổ trợ mới nhất, kể cả sau khi đã công bố.">số lúc {gioPhut(data.tinh_at)} ⓘ</span>}
        {data && tuan < nay && <span className="text-[11.5px] text-slate-400" title="Chỉ lớp ĐÃ CÔNG BỐ tuần đó mới vào sổ kết quả. Lớp chưa công bố hiện bản nháp cuối tuần (không vào xếp hạng).">lớp chưa công bố = bản nháp ⓘ</span>}
        <button onClick={() => setMoTop(true)} className="ml-auto h-7 rounded-md bg-white px-2.5 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50" title={`Top 20 toàn trung tâm · ${mon}`}>🏆 Top 20</button>
      </div>
      {tb && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{tb}</div>}
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {!data ? (dangTai ? <p className="text-sm text-slate-500">Đang tải…</p> : null) : (xemLop || xemHs) ? null : (
        <div className={`space-y-3 ${dangTai ? 'opacity-60' : ''}`}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className={tile}>
              <div className={nhanTile}>Tiến độ trung bình</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-900">{so(tong?.tien_do_tb, '%')}</span>
                {tong?.tien_do_d != null && <span className={`text-[13px] font-bold ${tong.tien_do_d > 0 ? 'text-emerald-700' : tong.tien_do_d < 0 ? 'text-rose-600' : 'text-slate-500'}`}>{tong.tien_do_d > 0 ? '▲' : tong.tien_do_d < 0 ? '▼' : '='} {Math.abs(tong.tien_do_d)} so với đầu tuần</span>}
              </div>
            </div>
            <div className={tile}>
              <div className={nhanTile}>Việc đã xong</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-900">{so(tong?.viec_pct, '%')}</span>
                <span className="text-[13px] text-slate-500">{tong?.viec_xong ?? 0} / {tong?.viec_den_han ?? 0} việc đến hạn</span>
              </div>
            </div>
            <div className={tile}>
              <div className={nhanTile}>BTVN đánh giá</div>
              <div className="mt-2 text-[14px] font-semibold text-slate-800">Tốt {tong?.btvn_tot ?? 0} · Tạm ổn {tong?.btvn_tam_on ?? 0} · Chưa tốt {tong?.btvn_chua_tot ?? 0}</div>
              {tong && <div className="mt-0.5 text-[11.5px] text-slate-500">Thái độ: {Object.entries(tong.thai_do).filter(([, n]) => n > 0).map(([k, n]) => `${NHAN_THAI_DO[k]} ${n}`).join(' · ') || 'chưa ghi'}</div>}
            </div>
            <div className={`${tile} ${(tong?.chua_lam ?? 0) > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
              <div className={nhanTile}>Em chưa làm việc nào</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-900">{tong?.chua_lam ?? 0}</span>
                <span className="text-[13px] text-slate-500">trên {tong?.so_em ?? 0} em có tờ</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <div className="px-4 py-2.5 text-[14px] font-bold text-slate-800">Theo lớp</div>
              <table className="min-w-full text-[12.5px]">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Lớp</th><th className="px-2 py-2">Sĩ số</th>
                    <th className="px-2 py-2" title="Buổi trong tuần đã có tài liệu trên hệ / tổng buổi">Giáo trình</th>
                    <th className="px-2 py-2" title="Đề xuất bổ trợ còn nháp / chờ duyệt">Bổ trợ chờ</th>
                    <th className="px-2 py-2" title="Nháp = hệ đã dựng mục tiêu, học sinh chưa thấy. Công bố = khoá mục tiêu + đưa lên app HS / PH">Công bố</th>
                    <th className="px-2 py-2" title="Trung bình các em của lớp. Tiến độ 1 em = em đã đi được bao nhiêu % tới mục tiêu TUẦN của chính em (100% = đạt hết mục tiêu tuần), chỉ tính nhóm bài đã có số">Tiến độ TB ⓘ</th><th className="px-2 py-2">Việc xong</th>
                    <th className="px-2 py-2">BTVN T · TÔ · CT</th><th className="px-2 py-2">Chưa làm gì</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lop.length === 0 && <tr><td colSpan={9} className="px-3 py-6 text-center text-slate-500">Khối này chưa có lớp đang học.</td></tr>}
                  {data.lop.map((l) => (
                    <tr key={l.lop_id} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        <button onClick={() => setXemLop({ id: l.lop_id, ten: l.ten_lop })} title="Mở danh sách học sinh của lớp"
                          className="font-semibold text-indigo-700 hover:underline">{l.ten_lop} ›</button>
                      </td>
                      <td className="px-2 py-2 text-center">{l.si_so}</td>
                      <td className={`px-2 py-2 text-center ${l.so_buoi > 0 && l.so_buoi_co_tl < l.so_buoi ? 'font-semibold text-orange-700' : ''}`}>{l.so_buoi_co_tl}/{l.so_buoi}</td>
                      <td className={`px-2 py-2 text-center ${l.bo_tro_cho > 0 ? 'font-semibold text-orange-700' : ''}`}>{l.bo_tro_cho}</td>
                      <td className="px-2 py-2 text-center">
                        {l.chot_at ? <span className="text-emerald-700">Đã công bố {gioPhut(l.cong_bo_lai_at ?? l.chot_at)} {ngayNgan((l.cong_bo_lai_at ?? l.chot_at).slice(0, 10))}{l.cong_bo_lai_at ? ' (lại)' : ''}
                            {data.dang_chay && <button onClick={() => congBoLai(l.lop_id, l.ten_lop)} disabled={dangChot !== null || thieuGt(l)} title={thieuGt(l) ? chuThieu(l) : 'Công bố lại: khoá lại mục tiêu Bài trên lớp theo giáo trình hiện tại (phải ghi lý do)'}
                              className="ml-1.5 h-6 rounded bg-white px-1.5 text-[11.5px] font-semibold text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-40">{dangChot === l.lop_id ? '…' : '🔁 Lại'}</button>}
                          </span>
                          : data.dang_chay && thieuGt(l) ? <span className="text-[12px] font-semibold text-orange-700" title={chuThieu(l)}>Thiếu giáo trình</span>
                          : data.dang_chay ? (
                            <button onClick={() => chot(l.lop_id, l.bo_tro_cho)} disabled={dangChot !== null}
                              className="h-7 rounded-md bg-slate-800 px-2.5 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
                              {dangChot === l.lop_id ? 'Đang công bố…' : 'Công bố'}
                            </button>
                          ) : <span className="text-slate-400">Không công bố</span>}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className="font-semibold">{so(l.tien_do_tb, '%')}</span>
                        {l.tien_do_d != null && <span className={`ml-1 text-[11px] font-bold ${l.tien_do_d > 0 ? 'text-emerald-700' : l.tien_do_d < 0 ? 'text-rose-600' : 'text-slate-500'}`}>{l.tien_do_d > 0 ? '▲' : l.tien_do_d < 0 ? '▼' : '='}{Math.abs(l.tien_do_d)}</span>}
                      </td>
                      <td className="px-2 py-2 text-center">{l.viec_pct == null ? '—' : `${l.viec_pct}%`}</td>
                      <td className="px-2 py-2 text-center">{l.btvn_tot} · {l.btvn_tam_on} · {l.btvn_chua_tot}</td>
                      <td className={`px-2 py-2 text-center ${l.chua_lam > 0 ? 'font-bold text-orange-700' : ''}`}>{l.chua_lam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="space-y-1 px-4 pb-3 pt-1 text-[11.5px] text-slate-500">
                <p><b className="text-slate-700">Thứ Hai</b> hệ tự đọc giáo trình + bổ trợ của tuần và dựng mục tiêu tuần cho từng em (bản NHÁP, tự cập nhật khi sửa giáo trình / duyệt bổ trợ). <b className="text-slate-700">Bấm tên lớp</b> ⇒ danh sách học sinh bên trái ⇒ bấm tên em ⇒ tờ mục tiêu của em hiện bên phải.</p>
                <p><b className="text-slate-700">Công bố</b> = khoá mục tiêu của từng em (nhóm bài, dạng, cờ mục tiêu tuần, danh sách việc) và đưa lên app học sinh + phụ huynh. Bấm sau khi đã chốt bổ trợ. Sửa giáo trình / duyệt thêm bổ trợ sau khi công bố ⇒ không đổi mục tiêu tuần này, hiện thành "thêm sau khi công bố".</p>
                <p><b className="text-slate-700">Kết quả tuần</b> do máy tự chốt lúc 00:00 thứ Hai vào sổ (không sửa được); người chỉ xem. Trong tuần chỉ số đo chạy (vài phút một lần).</p>
                <p><b className="text-slate-700">Tiến độ</b> của 1 em = trung bình các nhóm bài (đã có số) của em: % hiện tại ÷ mục tiêu TUẦN, tối đa 100%. Vd mục tiêu tuần 80%, em đang 40% ⇒ 50%. Đầu tuần thường thấp vì nhiều lần đo trong tuần chưa diễn ra.</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-baseline gap-2 px-4 py-2.5">
                <span className="text-[14px] font-bold text-slate-800">Em cần để ý</span>
                <span className="text-[12px] text-slate-500">bấm tên để mở tờ mục tiêu tuần của em</span>
              </div>
              {data.em.length === 0 && <p className="px-4 pb-4 text-[13px] text-slate-500">Không có em nào cần để ý.</p>}
              {data.em.map((e) => (
                <button key={e.id} onClick={() => { const l = data.lop.find((x) => x.ten_lop === e.lop); setXemLop(l ? { id: l.lop_id, ten: l.ten_lop } : null); setXemHs({ id: e.id, ten: e.ten }) }} className="flex w-full items-start gap-3 border-t border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold text-slate-800">{e.ten} <span className="font-normal text-slate-500">· {e.lop ?? ''}</span></span>
                    <span className="block text-[12px] text-slate-500">{e.ly_do.join(' · ')}</span>
                  </span>
                  <span className="whitespace-nowrap text-[12.5px] font-semibold text-orange-700">{e.viec_xong}/{e.viec_den_han}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {data && (xemLop || xemHs) && (
        <KhongGianLop lop={xemLop} hs={xemHs} mon={mon} tuan={tuan} onChonHs={setXemHs} />
      )}
      {moTop && <TopPopup mon={mon} tuan={tuan} onDong={() => setMoTop(false)} />}
    </div>
  )
}

// ── tờ của 1 em (nhân sự xem được cả khi lớp chưa chốt) ─────────────────────
function ToHsPanel({ hs, mon, tuan }: { hs: { id: string; ten: string }; mon: string; tuan: string }) {
  const [to, setTo] = useState<MttTo | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [xem, setXem] = useState<'tuan' | 'cac_tuan'>('tuan')
  const [cac, setCac] = useState<MttTuanCu[] | null>(null)
  const [xemPh, setXemPh] = useState(false)
  // bấm tab nào gọi tab đó (§2.0): các tuần đã chốt chỉ đọc khi mở
  useEffect(() => {
    if (xem !== 'cac_tuan' || cac) return
    let alive = true
    mttCacTuan(mon, hs.id).then((d) => alive && setCac(d)).catch(() => alive && setCac([]))
    return () => { alive = false }
  }, [xem, cac, mon, hs.id])
  useEffect(() => {
    let alive = true
    setTo(null); setLoi(null)
    mttCuaHs(hs.id, mon, tuan)
      .then((r) => { if (!alive) return; if (!r || laChuaChot(r)) setLoi('Chưa có tờ tuần này.'); else setTo(r) })
      .catch((e) => alive && setLoi(String(e?.message ?? e)))
    return () => { alive = false }
  }, [hs.id, mon, tuan])
  return (
    <div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-bold text-slate-900">{hs.ten}{to?.hs.lop ? ` · ${to.hs.lop}` : ''}</span>
          {to && <span title={`Mục tiêu tuần ${ngayNgan(to.tuan)} – ${ngayNgan(to.den_ngay)} · ${mon}${to.ke_hoach_at ? ` · mục tiêu khoá lúc ${gioPhut(to.ke_hoach_at)} ${ngayNgan(to.ke_hoach_at.slice(0, 10))}` : ''}${to.da_chot_so ? ' · sổ đã chốt' : ''}`}
            className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold ${to.chot ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{to.chot ? 'Đã công bố' : 'Nháp'}</span>}
          {to?.kiem_tra?.map((k) => <span key={k.ngay} title="Buổi này lớp làm bài kiểm tra tháng, không học bài mới (đặt ở Giáo trình tuần)" className="rounded bg-violet-100 px-1.5 py-0.5 text-[10.5px] font-bold text-violet-800">📝 Kiểm tra tháng · {thuNgay(k.ngay)}</span>)}
          {to && xem === 'tuan' && <span className="text-[12px] text-slate-600">
            Tiến độ <b>{so(to.tien_do, '%')}</b>{to.tien_do_d != null && ` (${to.tien_do_d >= 0 ? '▲' : '▼'}${Math.abs(to.tien_do_d)})`}
            {' · '}Việc <b>{to.viec_xong}/{to.viec_tong}</b>
            {' · '}Hạng <b>{to.hang ?? '—'}</b>{to.so_hs ? `/${to.so_hs}` : ''}
            {' · '}Tự luyện <b>{to.tu_luyen.so_cau}</b> câu{to.tu_luyen.pct != null ? ` (${to.tu_luyen.pct}%)` : ''}
          </span>}
          <span className="flex-1" />
          {to && <button onClick={() => setXemPh(true)} title="Xem đúng màn phụ huynh sẽ thấy, khung điện thoại dọc (kể cả bản nháp chưa công bố)"
            className="h-7 rounded-md bg-white px-2.5 text-[12px] font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50">📱 Xem như PH</button>}
          <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
            <button onClick={() => setXem('tuan')} className={`h-7 px-2.5 text-[12px] font-semibold ${xem === 'tuan' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>Tuần này</button>
            <button onClick={() => setXem('cac_tuan')} className={`h-7 px-2.5 text-[12px] font-semibold ${xem === 'cac_tuan' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>Các tuần đã chốt</button>
          </div>
        </div>
        {xemPh && to && <XemNhuPh to={to} mon={mon} ten={hs.ten} onDong={() => setXemPh(false)} />}
        {xem === 'cac_tuan' && <CacTuanEm ds={cac} />}
        {xem === 'tuan' && loi && <p className="mt-4 text-[13px] text-slate-500">{loi}</p>}
        {xem === 'tuan' && !to && !loi && <p className="mt-4 text-[13px] text-slate-500">Đang tải…</p>}
        {xem === 'tuan' && to && (
          <div className="mt-2.5 space-y-2.5">
            <div className="grid gap-3 lg:grid-cols-3">
              {([1, 2] as const).map((ph) => (
                <div key={ph} className="min-w-0">
                  <div className={`mb-1.5 rounded-lg px-3 py-1 text-[13px] font-bold text-white ${ph === 1 ? 'bg-blue-600' : 'bg-orange-500'}`}>{ph === 1 ? 'Bài trên lớp' : 'Ôn tập kiến thức'}</div>
                  {to.nhom.filter((n) => n.phan === ph).length === 0 && <p className="text-[12.5px] text-slate-400">Không có nhóm.</p>}
                  {to.nhom.filter((n) => n.phan === ph).map((n) => <DongNhom key={n.ma} n={n} hsId={hs.id} mon={mon} />)}
                  {ph === 1 && to.sap_hoc && <p className="truncate text-[11px] text-slate-400" title={`Bài ${thuNgay(to.sap_hoc.ngay)}${to.sap_hoc.nhom.length ? ` (${to.sap_hoc.nhom.join(' · ')})` : ''}: BTVN chấm trước buổi kế nên tính vào mục tiêu tuần sau.`}>Bài {thuNgay(to.sap_hoc.ngay)} → tuần sau ⓘ</p>}
                  {ph === 2 && to.xep_hang_cho.length > 0 && <p className="mt-1 text-[11.5px] text-slate-500"><b className="text-slate-700">Đang xếp hàng:</b> {to.xep_hang_cho.map((x) => `${x.ten} ${x.p}%`).join(' · ')}</p>}
                </div>
              ))}
              <div className="min-w-0">
                <div className="mb-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-[13px] font-bold text-white">Hoạt động tuần này</div>
                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {to.viec.length === 0 && <p className="px-3 py-2 text-[12.5px] text-slate-400">Chưa có việc.</p>}
                  {to.viec.map((v) => <DongViec key={v.loai + v.buoi_id} v={v} hsId={hs.id} mon={mon} />)}
                </div>
              </div>
            </div>
            {(to.them_sau_chot?.length ?? 0) > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12.5px] text-amber-900">
                <b>Thêm sau khi công bố</b> (không vào mục tiêu tuần này, học sinh không thấy): {to.them_sau_chot!.map((x) => `${x.ten} (phần ${x.phan})`).join(' · ')}
              </div>
            )}
          </div>
        )}
    </div>
  )
}

// 📱 XEM NHƯ PHỤ HUYNH (Thùy 17/11): nhúng trang /xem-mtt của app PH trong khung điện thoại dọc, đưa sẵn tờ của em qua postMessage
// ⇒ đúng giao diện PH (cùng component), xem được cả bản NHÁP trước khi bấm Công bố. Trang PH không đọc dữ liệu gì, chỉ hiển thị tờ ERP đưa.
function XemNhuPh({ to, mon, ten, onDong }: { to: MttTo; mon: string; ten: string; onDong: () => void }) {
  const khung = useRef<HTMLIFrameElement>(null)
  // Nhận diện theo KHUNG (e.source = đúng iframe này), không theo tên miền: PH_BASE có thể chuyển hướng (www, tên miền Vercel…)
  // ⇒ so origin cứng là im lặng không gửi (Thùy 17/11: "vẫn bị lỗi chờ dữ liệu"). Chỉ gửi vào đúng iframe của mình.
  useEffect(() => {
    const nghe = (e: MessageEvent) => {
      const k = khung.current?.contentWindow
      if (!k || e.source !== k || (e.data as { loai?: string })?.loai !== 'mtt-san-sang') return
      k.postMessage({ loai: 'mtt-to', to, mon }, e.origin)
    }
    window.addEventListener('message', nghe)
    return () => window.removeEventListener('message', nghe)
  }, [to, mon])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onDong}>
      <div className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex w-[406px] items-center gap-2 text-white">
          <span className="flex-1 truncate text-[13px] font-semibold">📱 Phụ huynh của {ten} sẽ thấy{!to.chot ? ' · NHÁP — chưa công bố, PH chưa thấy' : ''}</span>
          <button onClick={onDong} className="h-7 w-7 rounded-full bg-white/15 text-[14px] hover:bg-white/25" aria-label="Đóng">✕</button>
        </div>
        <div className="rounded-[44px] bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-700">
          <iframe ref={khung} src={`${PH_BASE}/xem-mtt`} title="Xem như phụ huynh"
            className="block rounded-[36px] bg-[#f2f2f7]" style={{ width: 390, height: 'min(844px, calc(100vh - 90px))' }} />
        </div>
      </div>
    </div>
  )
}

// "Tăng 40 → 65%" · "Giảm …" · "giữ 65%" · chỉ có số hiện tại ⇒ "65%" (định dạng hiển thị, số do DB tính)
function ketQua(n: MttNhom): string {
  if (n.p == null) return 'chưa đo'
  if (n.p_dau == null) return `${n.p}%`
  if (n.p_dau === n.p) return `giữ ${n.p}%`
  return `${n.p > n.p_dau ? 'Tăng' : 'Giảm'} ${n.p_dau} → ${n.p}%`
}

function DongNhom({ n, hsId, mon }: { n: MttNhom; hsId: string; mon: string }) {
  const [moDang, setMoDang] = useState(false)   // dạng bài ẩn mặc định — bấm "Chi tiết" mới hiện (và mới gọi tình trạng từng dạng)
  const [tt, setTt] = useState<Map<string, MttDangTT> | null>(null)
  useEffect(() => {
    if (!moDang || tt || !(n.dang?.length)) return
    let alive = true
    mttDangTinhTrang(hsId, mon, n.dang.map((d) => d.ma)).then((r) => alive && setTt(new Map(r.map((x) => [x.ma, x])))).catch(() => alive && setTt(new Map()))
    return () => { alive = false }
  }, [moDang]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="mb-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5">
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-slate-800" title={`${n.ten}${n.phan === 1 && nhanHoc(n.ngay_hoc) ? ` · ${nhanHoc(n.ngay_hoc)}` : ''}`}>{n.ten}</span>
        {/* nhãn = ĐẠT / CHƯA ĐẠT MỤC TIÊU TUẦN (Thùy 17/11 khuya) — cờ dat_mt DB tính sẵn, cùng điều kiện với tiến độ ⇒ đếm "Đạt" là ra % */}
        {n.p == null ? <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500">Chưa đo</span>
          : n.dat_mt != null && <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold ${n.dat_mt ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`} title="So với mục tiêu tuần">{n.dat_mt ? 'Đạt' : 'Chưa đạt'}</span>}
      </div>
      <div className="mt-1 flex items-center gap-2.5">
        {/* Thùy 18/11: thanh dày hơn ~20% (6 → 7 px), vạch mục tiêu NẰM TRONG thanh — vạch màu nhấn viền trắng, không còn que đen nhô ra */}
        <div className="relative h-[7px] w-[38%] shrink-0 rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${n.p == null ? '' : n.p >= 80 ? 'bg-emerald-500' : n.p >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${n.p ?? 0}%` }} />
          {n.p != null && n.p_dau != null && n.p_dau !== n.p && <div className="absolute inset-y-0 border-l border-dashed border-slate-500" style={{ left: `${n.p_dau}%` }} title={`Đầu tuần ${n.p_dau}%`} />}
          {n.mt != null && <div className="absolute inset-y-0 w-[3px] -translate-x-1/2 rounded-sm bg-indigo-600" style={{ left: `${n.mt}%`, boxShadow: '0 0 0 1.5px #fff' }} title={`Mục tiêu tuần ${n.mt}%`} />}
        </div>
        <span className="min-w-0 flex-1 truncate text-[11.5px] text-slate-500">
          Mục tiêu <b className="text-slate-800">{n.mt != null ? `${n.mt}%` : '—'}</b> · <b className={`${n.p == null ? 'text-slate-400' : n.p >= 80 ? 'text-emerald-700' : n.p >= 50 ? 'text-amber-700' : 'text-rose-600'}`}>{ketQua(n)}</b>
        </span>
        {(n.dang?.length ?? 0) > 0 && (
          <button onClick={() => setMoDang((v) => !v)} className="shrink-0 text-[11px] font-semibold text-indigo-700 hover:underline" title="Dạng bài của nhóm trong tuần">
            {moDang ? '▴' : `${n.dang!.length} dạng ▾`}
          </button>
        )}
      </div>
      {moDang && (
        <div className="mt-1.5 divide-y divide-slate-100 rounded-md border border-slate-100">
          {n.dang!.map((d) => {
            const x = tt?.get(d.ma)
            return (
              <div key={d.ma} className="flex items-center gap-2 px-2.5 py-1.5 text-[12px]">
                <span className="min-w-0 flex-1 truncate text-slate-700" title={d.ten}>{d.ten}</span>
                {!tt ? <span className="shrink-0 text-[10.5px] text-slate-400">…</span>
                  : x ? <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${x.p == null ? 'bg-slate-100 text-slate-500' : x.p >= 80 ? 'bg-emerald-100 text-emerald-800' : x.p >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'}`}>{x.p == null ? 'Chưa đo' : `${x.p}%`}</span>
                  : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// dòng phụ GỌN (không liệt kê nhóm/dạng — Thùy 17/11): nộp / hạn / giờ phòng / ghi chú / thái độ
function moTaGon(v: MttViec): string {
  const x: (string | null | undefined)[] = []
  if (v.loai === 'btvn') x.push(v.tt === 'sap_toi' ? (v.han ? `hạn trước buổi ${thuNgay(v.han)}` : null) : v.tt === 'chua_nop' ? 'chưa nộp' : v.tt === 'cho_cham' ? 'đã nộp, đang chấm'
    : v.nop === 'nop_muon' ? 'nộp muộn' : v.nop === 'nop_dung_han' ? 'nộp đúng hạn' : null)
  if (v.loai === 'sau_gio' || v.loai === 'bo_tro') x.push(v.gio, v.phong ? `phòng ${v.phong}` : null)
  x.push(v.ghi_chu, v.thai_do ? (NHAN_THAI_DO[v.thai_do] ?? v.thai_do) : null)
  return x.filter(Boolean).join(' · ')
}

// 1 việc: dòng gọn + nút "Chi tiết" cùng dòng ⇒ bấm mới gọi kết quả từng dạng (fn_mtt_viec_dang)
function DongViec({ v, hsId, mon }: { v: MttViec; hsId: string; mon: string }) {
  const [mo, setMo] = useState(false)
  const [ds, setDs] = useState<MttViecDang[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const coChiTiet = (v.loai === 'et' || v.loai === 'mt' || v.loai === 'btvn') && v.pct != null
  useEffect(() => {
    if (!mo || ds) return
    let alive = true
    mttViecDang(hsId, mon, v.buoi_id, v.loai).then((r) => alive && setDs(r)).catch((e) => alive && setLoi(String(e?.message ?? e)))
    return () => { alive = false }
  }, [mo]) // eslint-disable-line react-hooks/exhaustive-deps
  const phu = moTaGon(v)
  return (
    <div className="px-2.5 py-1.5">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-semibold text-slate-800">{TEN_VIEC[v.loai]} · {thuNgay(v.ngay)}{v.them_sau && <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-800">thêm sau khi công bố</span>}</span>
          {phu && <span className="block truncate text-[11px] text-slate-500" title={phu}>{phu}</span>}
        </span>
        {coChiTiet && <button onClick={() => setMo((x) => !x)} className="shrink-0 text-[11px] font-semibold text-indigo-700 hover:underline">{mo ? 'Ẩn ▴' : 'Chi tiết ▾'}</button>}
        <span className="shrink-0 text-[12.5px] font-bold text-slate-800">{v.pct == null ? '' : `${v.pct}%`}</span>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold ${v.muc ? mauMuc(v.muc) : 'bg-slate-100 text-slate-500'}`}>{v.muc ? NHAN_MUC[v.muc] : NHAN_TT[v.tt]}</span>
      </div>
      {mo && (
        <div className="mt-1 divide-y divide-slate-100 rounded-md border border-slate-100 bg-slate-50/60">
          {loi && <p className="px-2.5 py-1 text-[11.5px] text-rose-600">{loi}</p>}
          {!ds && !loi && <p className="px-2.5 py-1 text-[11.5px] text-slate-400">Đang tải…</p>}
          {ds && ds.length === 0 && <p className="px-2.5 py-1 text-[11.5px] text-slate-400">Chưa có câu nào được chấm.</p>}
          {ds?.map((d) => (
            <div key={d.ma ?? '_'} className="flex items-center gap-2 px-2.5 py-1 text-[11.5px]">
              <span className={`min-w-0 flex-1 truncate ${d.ma ? 'text-slate-700' : 'italic text-slate-400'}`} title={d.ten}>{d.ten}</span>
              <span className="shrink-0 text-slate-400">{d.so_cau} câu</span>
              <span className={`w-10 shrink-0 text-right font-bold ${d.pct >= 80 ? 'text-emerald-700' : d.pct >= 50 ? 'text-amber-700' : 'text-rose-600'}`}>{d.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// các tuần đã chốt của 1 em (sổ chốt) — tiến độ · việc · hạng · từng nhóm bài theo tuần
function CacTuanEm({ ds }: { ds: MttTuanCu[] | null }) {
  if (!ds) return <p className="mt-4 text-[13px] text-slate-500">Đang tải…</p>
  if (ds.length === 0) return <p className="mt-4 text-[13px] text-slate-500">Em chưa có tuần nào được chốt.</p>
  const nhoms = [...new Map(ds.flatMap((t) => t.nhom.map((n) => [n.ma, n.ten] as const))).entries()]
  const o = (p: number | null | undefined) => p == null ? 'border border-dashed border-slate-200 text-slate-400' : p >= 80 ? 'bg-emerald-50 text-emerald-800' : p >= 50 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-1 text-[12.5px]">
        <thead><tr><th className="text-left font-semibold text-slate-500">Tuần</th>{ds.map((t) => <th key={t.tuan} className="font-semibold text-slate-500">{ngayNgan(t.tuan)}</th>)}</tr></thead>
        <tbody>
          <tr><td className="pr-2 font-semibold text-slate-700">Tiến độ</td>{ds.map((t) => <td key={t.tuan} className="text-center font-bold text-slate-900">{so(t.tien_do, '%')}</td>)}</tr>
          <tr><td className="pr-2 font-semibold text-slate-700">Việc đã làm</td>{ds.map((t) => <td key={t.tuan} className="text-center">{t.viec_xong}/{t.viec_tong}</td>)}</tr>
          <tr><td className="pr-2 font-semibold text-slate-700">Hạng</td>{ds.map((t) => <td key={t.tuan} className="text-center">{t.hang ? `#${t.hang}` : '—'}</td>)}</tr>
          {nhoms.map(([ma, ten]) => (
            <tr key={ma}>
              <td className="max-w-[220px] truncate pr-2 text-slate-700" title={ten}>{ten}</td>
              {ds.map((t) => { const x = t.nhom.find((n) => n.ma === ma); return <td key={t.tuan}><div className={`rounded px-2 py-1 text-center font-semibold ${o(x?.p)}`}>{x?.p == null ? '—' : `${x.p}%`}</div></td> })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// top 20 toàn trung tâm (tính sẵn, fn_mtt_top) — đúng bảng HS và phụ huynh thấy
function TopPopup({ mon, tuan, onDong }: { mon: string; tuan: string; onDong: () => void }) {
  const [top, setTop] = useState<MttTop | null | undefined>(undefined)
  useEffect(() => { let a = true; mttTop(mon, tuan).then((t) => a && setTop(t)).catch(() => a && setTop(null)); return () => { a = false } }, [mon, tuan])
  const ds = top?.ds ?? []
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4" onClick={onDong}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="text-[17px] font-bold text-slate-900">Top 20 tiến độ tuần · toàn trung tâm</div>
            <div className="text-[12.5px] text-slate-500">Môn {mon} · mọi khối · tuần {ngayNgan(tuan)} · xếp theo tiến độ tới mục tiêu của từng em{top?.tinh_at ? ` · số tính lúc ${gioPhut(top.tinh_at)}` : ''}</div>
          </div>
          <button onClick={onDong} className="h-8 rounded-md px-3 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">Đóng</button>
        </div>
        {top === undefined && <p className="mt-4 text-[13px] text-slate-500">Đang tải…</p>}
        {top !== undefined && ds.length === 0 && <p className="mt-4 text-[13px] text-slate-500">Tuần này chưa có số xếp hạng (chỉ tuần đang chạy có bảng top 20).</p>}
        <div className="mt-3 grid gap-1.5 md:grid-flow-col md:grid-cols-2 md:grid-rows-10">
          {ds.map((r) => (
            <div key={r.hang + r.ten} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-1.5 text-[13px]">
              <span className={`w-6 font-bold ${r.hang <= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>{r.hang}</span>
              <span className="flex-1 truncate font-semibold text-slate-800">{r.ten}</span>
              <span className="text-[12px] text-slate-500">{r.lop ?? ''}</span>
              <span className="w-10 text-right font-bold text-slate-900">{r.tien_do}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// KHÔNG GIAN LỚP (Thùy 17/11): bấm lớp ⇒ KHÔNG popup, chuyển sang màn làm việc chính của trưởng khối —
// trái = danh sách học sinh của lớp, phải = tờ mục tiêu tuần của em đang chọn. Đọc danh sách 1 lần khi mở (fn_mtt_ds_lop), đổi em không đọc lại.
const NHO_LOP: Record<string, MttEmLop[]> = {}
// chọn lớp / về tổng quan khối nằm trên dòng header của MucTieuTuanTab (Thùy 17/11: header một dòng)
function KhongGianLop({ lop, hs, mon, tuan, onChonHs }: {
  lop: { id: string; ten: string } | null; hs: { id: string; ten: string } | null
  mon: string; tuan: string; onChonHs: (h: { id: string; ten: string }) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:h-[calc(100vh-170px)] lg:min-h-[460px] lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)]">
        <div className="overflow-y-auto rounded-xl border border-slate-200 bg-white">
          {lop ? <DanhSachEm lop={lop} tuan={tuan} chon={hs?.id ?? null} onChon={onChonHs} />
            : <p className="p-4 text-[13px] text-slate-500">Chọn một lớp ở trên để xem danh sách học sinh.</p>}
        </div>
        <div className="overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
          {hs ? <ToHsPanel key={hs.id + '|' + tuan} hs={hs} mon={mon} tuan={tuan} />
            : <div className="flex h-full min-h-[200px] items-center justify-center text-[13.5px] text-slate-400">Bấm tên một học sinh bên trái để xem tờ mục tiêu tuần của em.</div>}
        </div>
      </div>
    </div>
  )
}

function DanhSachEm({ lop, tuan, chon, onChon }: { lop: { id: string; ten: string }; tuan: string; chon: string | null; onChon: (h: { id: string; ten: string }) => void }) {
  const khoa = lop.id + '|' + tuan
  const [ds, setDs] = useState<MttEmLop[] | null>(NHO_LOP[khoa] ?? null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    setDs(NHO_LOP[khoa] ?? null); setLoi(null)
    if (NHO_LOP[khoa]) return
    let alive = true
    mttDsLop(lop.id, tuan).then((d) => { NHO_LOP[khoa] = d; if (alive) setDs(d) }).catch((e) => alive && setLoi(String(e?.message ?? e)))
    return () => { alive = false }
  }, [khoa]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-3 py-2">
        <div className="text-[14px] font-bold text-slate-800">Lớp {lop.ten}{ds ? ` · ${ds.length} em` : ''}</div>
        <div className="text-[11px] text-slate-500" title="Tiến độ = % đi tới mục tiêu tuần của chính em">Tuần {ngayNgan(tuan)} – {ngayNgan(congNgay(tuan, 6))} · % tiến độ</div>
      </div>
      {loi && <p className="p-4 text-[13px] text-rose-600">{loi}</p>}
      {!ds && !loi && <p className="p-4 text-[13px] text-slate-500">Đang tải…</p>}
      {ds && ds.length === 0 && <p className="p-4 text-[13px] text-slate-500">Lớp chưa có em nào.</p>}
      {ds?.map((e) => (
        <button key={e.id} onClick={() => onChon({ id: e.id, ten: e.ten })}
          className={`flex w-full items-center gap-2 border-b border-slate-100 px-3 py-1.5 text-left hover:bg-indigo-50/50 ${chon === e.id ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''}`}>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-[13px] font-semibold ${chon === e.id ? 'text-indigo-800' : 'text-slate-800'}`}>{e.ten}</span>
            <span className="block truncate text-[11px] text-slate-500" title={e.co_to ? `${e.so_nhom ?? 0} nhóm${e.hang ? ` · hạng #${e.hang}` : ''}` : undefined}>
              {e.co_to ? `Việc ${e.viec_xong ?? 0}/${e.viec_tong ?? 0} · nợ ${e.so_no ?? 0}` : 'chưa có tờ'}
            </span>
          </span>
          {e.co_to && <span className="shrink-0 text-right">
            <span className="block text-[14px] font-bold text-slate-900">{so(e.tien_do, '%')}</span>
            <span className={`block text-[11px] font-bold ${e.tien_do_d == null ? 'text-slate-400' : e.tien_do_d > 0 ? 'text-emerald-700' : e.tien_do_d < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
              {e.tien_do_d == null ? '—' : e.tien_do_d > 0 ? `▲ ${e.tien_do_d}` : e.tien_do_d < 0 ? `▼ ${-e.tien_do_d}` : '= 0'}</span>
          </span>}
        </button>
      ))}
    </div>
  )
}
