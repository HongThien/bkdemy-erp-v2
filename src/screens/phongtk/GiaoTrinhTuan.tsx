// GIÁO TRÌNH TUẦN (spec-giao-trinh-tuan.md · Thùy 16/11) — mở từ Phòng làm việc trưởng khối.
// Thứ Sáu họp: trưởng khối điền cho TỪNG CA trong thời khoá biểu tuần sau ca đó học nhóm / dạng nào (chỉ khung); trưởng bộ môn duyệt.
// Thay Google Sheet. Khung lưu MỘT chỗ — dưới nút buổi trong builder; màn này chỉ là cửa sổ thứ hai nhìn vào đúng các dòng đó
// (gtt_ca giữ liên kết 1-1 ca ⇄ buổi) ⇒ sửa ở đây hay ở builder đều là một.
// Dùng lại nguyên module: BoChonNhom (bộ chọn nhóm của builder) · ChonBaiHoc / ChonMoHinh (bộ chọn của builder Hình) ·
// BuilderBanDoMoi / ChuyenDeHinhBuilder ("Mở trong builder"). Hình = khuôn mô hình–bài–ý: khung = bài học (Học) + mô hình (Luyện).
// Một lượt gọi cho cả lưới (fn_gtt_man_tuan); bấm ô mới gọi chi tiết; mutation vá đúng ô (CLAUDE.md §2 React); rời màn quay lại = đúng chỗ cũ (NHO).
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  oCuaToi, manTuan, chonBuoi, datKhung, chuyen, ngayBuoi, nhanDeXuat, thuHaiTuanSau, congNgay, ddmm, gio, THU, khungThanhChon,
  type GttMan, type GttCa, type GttLop, type GttO, type GttGiaoTrinh, type GttHanhDong, type KhungHinh,
} from '../../lib/giaoTrinhTuan'
import { noiDung, loiDoc, type NdBuoi, type ChonBuoi } from '../../lib/tailieuBdm'
import { nhanhCayChon } from '../../lib/kho/banDoMoi'
import { laNhanhMoHinh, thuTuMon, theNhanh } from '../../lib/mon'
import BoChonNhom from '../tailieu/bdm/BoChonNhom'
import BuilderBanDoMoi from '../tailieu/bdm/BuilderBanDoMoi'
import ChuyenDeHinhBuilder, { ChonBaiHoc, ChonMoHinh } from '../tailieu/bdm/ChuyenDeHinhBuilder'

type Mo = { lop: string; ngay: string } | null
const khoaO = (o: { mon: string; khoi: string }) => `${o.mon}|${o.khoi}`
// Sống tới F5: rời phòng quay lại = đúng ô, đúng tuần, đúng ca đang mở, không tải lại (CLAUDE.md §2 React).
const NHO: { o: string | null; tuan: string | null; ds: GttO[] | null; man: Record<string, GttMan>; mo: Mo; cuon: number } =
  { o: null, tuan: null, ds: null, man: {}, mo: null, cuon: 0 }

const TT: Record<GttHanhDong, { chu: string; cls: string }> = {
  gui: { chu: 'Đã gửi · chờ trưởng bộ môn duyệt', cls: 'bg-amber-100 text-amber-800' },
  duyet: { chu: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-800' },
  tra_lai: { chu: 'Bị trả lại', cls: 'bg-rose-100 text-rose-700' },
}
const fmtLuc = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

export default function GiaoTrinhTuan() {
  const [ds, setDs] = useState<GttO[] | null>(NHO.ds)
  const [o, setOS] = useState<string | null>(NHO.o)
  const [tuan, setTuanS] = useState<string>(NHO.tuan ?? thuHaiTuanSau())
  const khoa = o ? `${o}|${tuan}` : null
  const [man, setManS] = useState<GttMan | null>(khoa ? NHO.man[khoa] ?? null : null)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMoS] = useState<Mo>(NHO.mo)
  const [daLuu, setDaLuu] = useState<string | null>(null)
  const [ghiChu, setGhiChu] = useState<{ hd: GttHanhDong } | null>(null)
  const [builder, setBuilder] = useState<{ id: string; hinh: boolean } | null>(null)
  const cuonRef = useRef<HTMLDivElement>(null)

  const setO = (v: string) => { NHO.o = v; NHO.mo = null; setMoS(null); setOS(v) }
  const setTuan = (v: string) => { NHO.tuan = v; NHO.mo = null; setMoS(null); setTuanS(v) }
  const setMo = (m: Mo) => { NHO.mo = m; setMoS(m) }
  const setMan = (m: GttMan | null) => { if (m) NHO.man[`${khoaO(m)}|${m.tuan}`] = m; setManS(m) }
  const vaMan = (f: (m: GttMan) => GttMan) => setManS((prev) => { if (!prev) return prev; const n = f(prev); NHO.man[`${khoaO(n)}|${n.tuan}`] = n; return n })
  const baoLuu = (s = 'Đã lưu') => { setDaLuu(s); setTimeout(() => setDaLuu(null), 2000) }

  // Ô (môn × khối) trong phạm vi — gọi một lần; nhớ tới F5.
  useEffect(() => {
    if (ds) return
    oCuaToi().then((d) => {
      const s = [...d].sort((a, b) => thuTuMon(a.mon) - thuTuMon(b.mon) || a.khoi.localeCompare(b.khoi, 'vi', { numeric: true }))
      NHO.ds = s; setDs(s)
      if (!NHO.o && s[0]) setO(khoaO(s[0]))
    }).catch((e) => setLoi(loiDoc(e)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Đổi ngữ cảnh (ô / tuần) ⇒ đọc lưới. Có bản nhớ ⇒ dùng luôn, không gọi (nút ↻ ép đọc lại).
  async function tai(nen = false) {
    if (!o) return
    const [mon, khoi] = o.split('|')
    if (!nen) { setLoi(null); setDangTai(true) }
    try { setMan(await manTuan(mon, khoi, tuan)); setLoi(null) } catch (e) { setLoi(loiDoc(e)) } finally { setDangTai(false) }
  }
  useEffect(() => {
    if (!khoa) return
    const nho = NHO.man[khoa]
    if (nho) { setManS(nho); return }
    setManS(null); tai()
  }, [khoa]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (man && cuonRef.current) cuonRef.current.scrollTop = NHO.cuon }, [!!man]) // eslint-disable-line react-hooks/exhaustive-deps

  const vaCa = (ca: GttCa) => vaMan((m) => ({ ...m, lop: m.lop.map((l) => l.id !== ca.lop_id ? l : { ...l, ca: l.ca.map((c) => c.ngay === ca.ngay ? ca : c) }) }))

  async function lamChuyen(hd: GttHanhDong, gc?: string) {
    if (!man) return
    try { setMan(await chuyen(man.mon, man.khoi, man.tuan, hd, gc)); setGhiChu(null); baoLuu(hd === 'gui' ? 'Đã gửi duyệt' : hd === 'duyet' ? 'Đã duyệt' : 'Đã trả lại') }
    catch (e) { setLoi(loiDoc(e)) }
  }
  async function nhanTatCa() {
    if (!man) return
    try { setMan(await nhanDeXuat(man.mon, man.khoi, man.tuan)); baoLuu(`Đã nhận ${soDeXuat} đề xuất`) } catch (e) { setLoi(loiDoc(e)) }
  }

  const ngays = Array.from({ length: 7 }, (_, i) => congNgay(tuan, i))
  const lopMo = mo && man ? man.lop.find((l) => l.id === mo.lop) ?? null : null
  const caMo = lopMo ? lopMo.ca.find((c) => c.ngay === mo!.ngay) ?? null : null
  // đếm ô đang hiện (badge) — không phải số nghiệp vụ
  const caHien = (man?.lop ?? []).flatMap((l) => l.ca.filter((c) => !c.huy))
  const soTrong = caHien.filter((c) => !c.buoi || c.buoi.khung.length === 0).length
  const soDeXuat = caHien.filter((c) => !c.buoi && c.de_xuat).length   // ca trống có buổi đề xuất (Thùy 16/11 "tự load bài")
  const tt = man?.trang_thai?.hanh_dong ?? null
  const coGui = !!man?.sua && tt !== 'gui'
  const coDuyet = !!man?.duyet && tt === 'gui'
  const coTraLai = !!man?.duyet && (tt === 'gui' || tt === 'duyet')

  if (builder) {
    const dong = () => { setBuilder(null); tai(true) }   // builder có thể đổi khung ⇒ đọc lại NỀN, không xoá lưới
    // portal ra body: phòng nằm trong lớp xếp chồng z-[1], không nổi được trên thanh đầu trang (z-60)
    return createPortal(
      <div className="fixed inset-0 z-[250] bg-white">
        {builder.hinh ? <ChuyenDeHinhBuilder id={builder.id} laGiaoTrinh onClose={dong} /> : <BuilderBanDoMoi id={builder.id} onClose={dong} />}
      </div>, document.body)
  }

  return (
    <div className="flex min-h-[520px] flex-col gap-3 text-slate-800">
      {/* Thanh trên: ô · tuần · trạng thái duyệt · hành động */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[17px] font-bold">📅 Giáo trình tuần</span>
        <select value={o ?? ''} onChange={(e) => setO(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[13px]">
          {(ds ?? []).map((x) => <option key={khoaO(x)} value={khoaO(x)}>{x.mon} · khối {x.khoi}</option>)}
        </select>
        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 text-[13px]">
          <button onClick={() => setTuan(congNgay(tuan, -7))} className="px-2.5 py-1.5 hover:bg-slate-50">‹</button>
          <span className="px-2 py-1.5 font-semibold">Tuần {ddmm(tuan)} – {ddmm(congNgay(tuan, 6))}</span>
          <button onClick={() => setTuan(congNgay(tuan, 7))} className="px-2.5 py-1.5 hover:bg-slate-50">›</button>
        </div>
        {tuan !== thuHaiTuanSau() && <button onClick={() => setTuan(thuHaiTuanSau())} className="rounded-lg px-2 py-1.5 text-[12.5px] text-indigo-600 hover:bg-indigo-50">Về tuần sau</button>}
        <button onClick={() => tai(true)} title="Đọc lại" className="rounded-lg px-2 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">↻</button>
        {dangTai && <span className="text-[12px] text-slate-400">đang tải…</span>}
        {daLuu && <span className="text-[12.5px] font-semibold text-emerald-600">✓ {daLuu}</span>}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {man && <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${tt ? TT[tt].cls : 'bg-slate-100 text-slate-600'}`}>
            {tt ? TT[tt].chu : 'Chưa gửi duyệt'}{man.trang_thai?.ho_ten ? ` · ${man.trang_thai.ho_ten}` : ''}{man.trang_thai ? ` · ${fmtLuc(man.trang_thai.at)}` : ''}
          </span>}
          {man && caHien.length > 0 && <span className={`text-[12.5px] ${soTrong ? 'text-rose-600' : 'text-emerald-700'}`}>{soTrong ? `còn ${soTrong}/${caHien.length} ca chưa có khung` : `đủ khung ${caHien.length} ca`}</span>}
          {man?.sua && soDeXuat > 0 && <button onClick={nhanTatCa} title="Gắn mỗi ca trống với buổi kế tiếp chưa gán của giáo trình (theo thứ tự thời gian)" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-[13px] font-semibold text-amber-800 hover:bg-amber-100">⤓ Nhận {soDeXuat} đề xuất</button>}
          {coGui && <button onClick={() => lamChuyen('gui')} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">📤 {tt === 'duyet' ? 'Gửi duyệt lại' : 'Gửi duyệt'}</button>}
          {coDuyet && <button onClick={() => lamChuyen('duyet')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-emerald-700">✅ Duyệt</button>}
          {coTraLai && <button onClick={() => setGhiChu({ hd: 'tra_lai' })} className="rounded-lg border border-rose-200 px-3 py-1.5 text-[13px] font-semibold text-rose-700 hover:bg-rose-50">↩ Trả lại</button>}
        </div>
      </div>
      {man?.trang_thai?.hanh_dong === 'tra_lai' && man.trang_thai.ghi_chu && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">↩ Lý do trả lại: {man.trang_thai.ghi_chu}</p>
      )}
      {loi && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</p>}
      {man && man.mo_coi.length > 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          ⚠ {man.mo_coi.length} buổi đã lên kế hoạch cho ngày không còn ca trong thời khoá biểu ({man.mo_coi.map((x) => `${man.lop.find((l) => l.id === x.lop_id)?.ten_lop ?? '?'} ${ddmm(x.ngay)}`).join(', ')}) — gắn lại cho ca mới.
        </p>
      )}

      {/* Lưới: hàng = lớp · cột = T2 … CN · ô = ca */}
      <div ref={cuonRef} onScroll={(e) => { NHO.cuon = e.currentTarget.scrollTop }} className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
        {!man ? <div className="p-6 text-center text-[13px] text-slate-400">{dangTai ? 'Đang tải…' : ds && ds.length === 0 ? 'Bạn chưa có phạm vi môn × khối nào.' : ''}</div>
          : man.lop.length === 0 ? <div className="p-6 text-center text-[13px] text-slate-400">Khối này chưa có lớp đang học.</div>
          : (
          <table className="w-full min-w-[980px] border-collapse text-[12.5px]">
            <thead className="sticky top-0 z-[1] bg-slate-50">
              <tr>
                <th className="w-[110px] border-b border-slate-200 px-2 py-2 text-left font-semibold text-slate-600">Lớp</th>
                {ngays.map((d, i) => <th key={d} className="border-b border-l border-slate-200 px-2 py-2 text-left font-semibold text-slate-600">{THU[i]} <span className="font-normal text-slate-400">{ddmm(d)}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {man.lop.map((l) => (
                <tr key={l.id} className="align-top">
                  <td className="border-b border-slate-100 px-2 py-2 font-semibold">
                    {l.ten_lop}
                    {l.giao_trinh.length === 0 && <div className="mt-0.5 text-[11px] font-normal text-rose-500">chưa có giáo trình</div>}
                  </td>
                  {ngays.map((d) => {
                    const c = l.ca.find((x) => x.ngay === d)
                    const dangMo = mo?.lop === l.id && mo.ngay === d
                    return (
                      <td key={d} className="border-b border-l border-slate-100 p-1">
                        {c && <OCa ca={c} dangMo={dangMo} onMo={() => setMo({ lop: l.id, ngay: d })} />}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {man && man.lich_su.length > 0 && (
        <details className="text-[12px] text-slate-500">
          <summary className="cursor-pointer">Sổ gửi / duyệt tuần này ({man.lich_su.length})</summary>
          <ul className="mt-1 space-y-0.5 pl-4">
            {man.lich_su.map((x, i) => <li key={i}>{fmtLuc(x.at)} · {x.ho_ten ?? '?'} · {TT[x.hanh_dong].chu.split(' · ')[0]}{x.ghi_chu ? ` — ${x.ghi_chu}` : ''}</li>)}
          </ul>
        </details>
      )}

      {lopMo && caMo && man && createPortal(
        <KhungCa key={`${lopMo.id}|${caMo.ngay}`} lop={lopMo} ca={caMo} mon={man.mon} khoi={man.khoi} sua={man.sua}
          onDong={() => setMo(null)} onVa={(ca) => { vaCa(ca); baoLuu(); if (soDeXuat > 0) tai(true) }} onBuilder={setBuilder} />, document.body,
      )}

      {ghiChu && createPortal(<GhiChuPopup onDong={() => setGhiChu(null)} onXong={(gc) => lamChuyen(ghiChu.hd, gc)} />, document.body)}
    </div>
  )
}

// Một ô ca trên lưới.
function OCa({ ca, dangMo, onMo }: { ca: GttCa; dangMo: boolean; onMo: () => void }) {
  if (ca.huy) return <div className="rounded-lg bg-slate-100 px-2 py-1.5 text-[11.5px] text-slate-400 line-through">{gio(ca.gio_bat_dau)} · ca huỷ</div>
  const b = ca.buoi
  const trong = !b || b.khung.length === 0
  return (
    <button onClick={onMo}
      className={`w-full rounded-lg border px-2 py-1.5 text-left transition hover:shadow-sm ${dangMo ? 'border-indigo-500 ring-2 ring-indigo-200' : trong ? 'border-dashed border-slate-300 bg-white' : 'border-slate-200 bg-indigo-50/40'}`}>
      <div className="flex items-center gap-1 text-[11px] text-slate-500">
        <span>{gio(ca.gio_bat_dau)}–{gio(ca.gio_ket_thuc)}{ca.phong ? ` · ${ca.phong}` : ''}</span>
        {ca.sua_sau_duyet && <span title="Đã sửa sau khi trưởng bộ môn duyệt" className="ml-auto rounded bg-amber-100 px-1 font-semibold text-amber-700">sửa sau duyệt</span>}
      </div>
      {!b && ca.de_xuat ? (
        <div className="mt-0.5 rounded border border-dashed border-amber-300 bg-amber-50/60 px-1.5 py-1" title="Đề xuất: buổi kế tiếp chưa gán của giáo trình — chưa lưu">
          <div className="truncate text-[11px] font-semibold text-amber-800">Đề xuất · {tenBuoi(ca.de_xuat.stt, ca.de_xuat.tieu_de)}</div>
          {ca.de_xuat.khung.slice(0, 3).map((k) => <div key={k.loai + k.ma} className="truncate text-[11.5px] text-slate-700">{k.ten ?? k.ma}</div>)}
        </div>
      ) : !b ? <div className="mt-0.5 text-[12px] font-semibold text-indigo-600">+ Chọn khung</div> : (
        <>
          <div className="mt-0.5 truncate text-[11.5px] font-semibold text-slate-600">{tenBuoi(b.stt, b.tieu_de)}</div>
          {trong ? <div className="text-[12px] font-semibold text-indigo-600">+ Chọn khung</div> : (
            <ul className="mt-0.5 space-y-0.5">
              {b.khung.slice(0, 4).map((k) => (   // ô lưới gọn: tối đa 4 dòng, đủ ở khung bên phải
                <li key={k.loai + k.ma} className="truncate leading-snug">
                  {k.loai === 'mo_hinh' && <span className="text-teal-700">Luyện · </span>}
                  <span className="font-medium text-slate-800">{k.ten ?? k.ma}</span>
                  {k.con.length > 0 && <span className="text-slate-500"> · {k.con.length} dạng</span>}
                </li>
              ))}
              {b.khung.length > 4 && <li className="text-[11px] text-slate-400">+{b.khung.length - 4} khác</li>}
            </ul>
          )}
        </>
      )}
      {ca.da_gan && <div className={`mt-0.5 text-[10.5px] ${ca.da_gan.khop === false ? 'text-rose-600' : 'text-emerald-600'}`}>{ca.da_gan.khop === false ? '⚠ ngày dạy gán buổi khác' : '✓ đã gán ngày dạy'}</div>}
    </button>
  )
}

// Khung bên phải: chi tiết một ca — chọn buổi / đặt khung / mở builder.
function KhungCa({ lop, ca, mon, khoi, sua, onDong, onVa, onBuilder }: {
  lop: GttLop; ca: GttCa; mon: string; khoi: string; sua: boolean
  onDong: () => void; onVa: (ca: GttCa) => void; onBuilder: (b: { id: string; hinh: boolean }) => void
}) {
  const [loi, setLoi] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // bộ chọn đang mở: nhóm › dạng bài (BoChonNhom) · bài học Hình (ChonBaiHoc) · mô hình Hình (ChonMoHinh). gt ≠ null ⇒ tạo buổi mới ở giáo trình đó.
  const [boChon, setBoChon] = useState<{ kieu: 'nhom'; gt: GttGiaoTrinh | null; daChon: ChonBuoi } | { kieu: 'bai'; gt: GttGiaoTrinh | null; daChon: string[] } | { kieu: 'mo_hinh'; gt: GttGiaoTrinh | null; daChon: string[] } | null>(null)
  const [chonCoSan, setChonCoSan] = useState(!ca.buoi && !ca.de_xuat)   // ca chưa gắn, không có đề xuất ⇒ mở sẵn phần chọn buổi
  const b = ca.buoi
  const laKhuonNhom = (nhanh: string | null) => !laNhanhMoHinh(nhanh)   // Hình = khuôn mô hình–bài–ý: khung = bài học + mô hình
  // Ghi khung Hình: bộ chọn của builder Hình tự đóng khi bấm xong ⇒ lỗi báo ở khung bên phải.
  async function ghiHinh(chon: KhungHinh, gt: GttGiaoTrinh | null) {
    setBoChon(null); setBusy(true); setLoi(null)
    try { onVa(await datKhung(lop.id, ca.ngay, chon, gt?.id ?? null)); setChonCoSan(false) } catch (e) { setLoi(loiDoc(e)) } finally { setBusy(false) }
  }

  async function lam(f: () => Promise<GttCa>) {
    setBusy(true); setLoi(null)
    try { onVa(await f()) } catch (e) { setLoi(loiDoc(e)) } finally { setBusy(false) }
  }
  const thu = THU[(new Date(Number(ca.ngay.slice(0, 4)), Number(ca.ngay.slice(5, 7)) - 1, Number(ca.ngay.slice(8, 10))).getDay() + 6) % 7]

  return (
    <div className="fixed inset-0 z-[200]" onClick={onDong}>
      <div className="absolute inset-y-0 right-0 flex w-[min(460px,100vw)] flex-col overflow-hidden bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-2 border-b border-slate-200 px-4 py-3">
          <div>
            <div className="text-[16px] font-bold">{lop.ten_lop} · {thu} {ddmm(ca.ngay)}</div>
            <div className="text-[12.5px] text-slate-500">{gio(ca.gio_bat_dau)}–{gio(ca.gio_ket_thuc)}{ca.phong ? ` · phòng ${ca.phong}` : ''} · {mon} khối {khoi}</div>
          </div>
          <button onClick={onDong} className="ml-auto rounded-lg px-2 py-1 text-[18px] text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-3 text-[13px]">
          {loi && <p className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{loi}</p>}
          {ca.sua_sau_duyet && <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">Ca này đã sửa sau khi trưởng bộ môn duyệt.</p>}
          {ca.da_gan && <p className={`rounded-lg px-3 py-2 ${ca.da_gan.khop === false ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'}`}>
            {ca.da_gan.khop === false ? 'Ngày dạy, GV đã gán một buổi KHÁC buổi kế hoạch.' : 'GV đã gán buổi cho lớp (ngày dạy). Sửa khung bây giờ không đổi bản đã gán.'}
          </p>}

          {b ? (
            <section className="rounded-xl border border-slate-200">
              <div className="border-b border-slate-100 px-3 py-2">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500"><TheNhanh mon={mon} nhanh={b.nhanh} />{b.ten_gt}{b.luu_tru ? ' · bản lưu trữ' : ''}</div>
                <div className="font-semibold">{tenBuoi(b.stt, b.tieu_de)}</div>
              </div>
              <div className="px-3 py-2">
                {b.khung.length === 0 ? <p className="text-slate-400">{laKhuonNhom(b.nhanh) ? 'Chưa có nhóm / dạng nào.' : 'Chưa có bài học / mô hình nào.'}</p> : (
                  <ul className="space-y-1.5">
                    {b.khung.map((k) => (
                      <li key={k.loai + k.ma}>
                        <div className="font-medium">{k.loai === 'dang' && <span className="mr-1 rounded bg-sky-100 px-1.5 text-[11px] font-semibold text-sky-700">Học</span>}{k.loai === 'mo_hinh' && <span className="mr-1 rounded bg-teal-100 px-1.5 text-[11px] font-semibold text-teal-700">Luyện</span>}{k.ten ?? k.ma}</div>
                        {k.con.length > 0 && <div className="mt-0.5 flex flex-wrap gap-1">{k.con.map((d) => <span key={d.ma} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11.5px] text-slate-600">{d.ten ?? d.ma}</span>)}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-slate-100 px-3 py-2">
                {sua && laKhuonNhom(b.nhanh) && !b.luu_tru && (
                  <button disabled={busy} onClick={() => setBoChon({ kieu: 'nhom', gt: null, daChon: khungThanhChon(b.khung) })}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">✏️ Sửa khung</button>
                )}
                {sua && !laKhuonNhom(b.nhanh) && !b.luu_tru && (<>
                  <button disabled={busy} onClick={() => setBoChon({ kieu: 'bai', gt: null, daChon: b.khung.filter((k) => k.loai === 'dang').map((k) => k.ma) })}
                    className="rounded-lg bg-sky-600 px-3 py-1.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-50">✏️ Bài học</button>
                  <button disabled={busy} onClick={() => setBoChon({ kieu: 'mo_hinh', gt: null, daChon: b.khung.filter((k) => k.loai === 'mo_hinh').map((k) => k.ma) })}
                    className="rounded-lg bg-teal-600 px-3 py-1.5 font-semibold text-white hover:bg-teal-700 disabled:opacity-50">✏️ Mô hình</button>
                </>)}
                <button onClick={() => onBuilder({ id: b.tai_lieu_id, hinh: !laKhuonNhom(b.nhanh) })}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">📖 Mở trong builder</button>
                {sua && <button disabled={busy} onClick={() => setChonCoSan((v) => !v)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">🔁 Đổi buổi</button>}
                {sua && <button disabled={busy} onClick={() => lam(() => chonBuoi(lop.id, ca.ngay, null))} className="rounded-lg px-3 py-1.5 text-rose-600 hover:bg-rose-50">Bỏ gắn</button>}
              </div>
            </section>
          ) : ca.de_xuat ? (
            <section className="rounded-xl border border-dashed border-amber-300 bg-amber-50/40">
              <div className="border-b border-amber-100 px-3 py-2">
                <div className="text-[11.5px] font-semibold uppercase tracking-wide text-amber-700">Đề xuất · buổi kế tiếp chưa gán (chưa lưu)</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate-500"><TheNhanh mon={mon} nhanh={ca.de_xuat.nhanh} />{ca.de_xuat.ten_gt}</div>
                <div className="font-semibold">{tenBuoi(ca.de_xuat.stt, ca.de_xuat.tieu_de)}</div>
              </div>
              <ul className="space-y-1 px-3 py-2">
                {ca.de_xuat.khung.length === 0 ? <li className="text-slate-400">Buổi này chưa có nhóm / dạng.</li>
                  : ca.de_xuat.khung.map((k) => <li key={k.loai + k.ma}>{k.ten ?? k.ma}{k.con.length > 0 && <span className="text-slate-500"> · {k.con.length} dạng</span>}</li>)}
              </ul>
              {sua && (
                <div className="flex flex-wrap gap-2 border-t border-amber-100 px-3 py-2">
                  <button disabled={busy} onClick={() => lam(() => chonBuoi(lop.id, ca.ngay, ca.de_xuat!.id))} className="rounded-lg bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-50">✓ Nhận đề xuất</button>
                  <button disabled={busy} onClick={() => setChonCoSan((v) => !v)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50">Chọn buổi khác</button>
                </div>
              )}
            </section>
          ) : !sua ? <p className="text-slate-500">Ca này chưa có khung.</p> : null}

          {sua && chonCoSan && (
            <section className="space-y-3">
              {lop.giao_trinh.length === 0 && <p className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">Lớp chưa có giáo trình (bản đồ mới). Tạo ở <b>Làm tài liệu › Giáo trình (bản đồ mới)</b> rồi quay lại.</p>}
              {[...lop.giao_trinh].sort((a, b) => thuTuNhanh(a.nhanh) - thuTuNhanh(b.nhanh)).map((g) => (   // chỉ sắp để hiện: nhánh chính (Đại) trước, Hình sau
                <ChonBuoiCuaGt key={g.id} gt={g} mon={mon} lop={lop} ca={ca} busy={busy}
                  onMoi={() => setBoChon(laKhuonNhom(g.nhanh) ? { kieu: 'nhom', gt: g, daChon: [] } : { kieu: 'bai', gt: g, daChon: [] })}
                  onChon={(buoiId) => lam(async () => { const r = await chonBuoi(lop.id, ca.ngay, buoiId); setChonCoSan(false); return r })} />
              ))}
            </section>
          )}
        </div>
      </div>

      {boChon && (
        <div onClick={(e) => e.stopPropagation()}>
          {boChon.kieu === 'bai' ? <ChonBaiHoc khoi={khoi} daChon={boChon.daChon} onClose={() => setBoChon(null)} onConfirm={(mas) => ghiHinh({ bai: mas }, boChon.gt)} />
          : boChon.kieu === 'mo_hinh' ? <ChonMoHinh khoi={khoi} daChon={boChon.daChon} onClose={() => setBoChon(null)} onConfirm={(ids) => ghiHinh({ mo_hinh: ids }, boChon.gt)} />
          : <BoChonNhom khoi={khoi} nhanh={nhanhCayChon(mon, boChon.gt?.nhanh ?? b?.nhanh)} daChon={boChon.daChon} onClose={() => setBoChon(null)}
            onConfirm={async (c) => {
              // lỗi ném ra ⇒ BoChonNhom giữ popup + lựa chọn, báo tại chỗ
              const r = await datKhung(lop.id, ca.ngay, c, boChon.gt?.id ?? null)
              onVa(r); setBoChon(null); setChonCoSan(false)
            }} />}
        </div>
      )}
    </div>
  )
}

// Danh sách buổi của MỘT giáo trình (bấm mới tải) — buổi đã gắn ca khác hiện ngày, không chọn được (1-1).
function ChonBuoiCuaGt({ gt, mon, lop, ca, busy, onMoi, onChon }: {
  gt: GttGiaoTrinh; mon: string; lop: GttLop; ca: GttCa; busy: boolean; onMoi: () => void; onChon: (buoiId: string) => void
}) {
  const [mo, setMo] = useState(false)
  const [buoi, setBuoi] = useState<NdBuoi[] | null>(null)
  const [ban, setBan] = useState<Map<string, string>>(new Map())
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    if (!mo || buoi) return
    Promise.all([noiDung(gt.id), ngayBuoi(gt.id)])
      .then(([nd, ng]) => { setBuoi(nd.buoi); setBan(new Map(ng.filter((x) => !(x.lop_id === lop.id && x.ngay === ca.ngay)).map((x) => [x.buoi_id, x.ngay]))) })
      .catch((e) => setLoi(loiDoc(e)))
  }, [mo]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="rounded-xl border border-slate-200">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <TheNhanh mon={mon} nhanh={gt.nhanh} /><span className="font-semibold">{gt.ten}</span>
        <div className="ml-auto flex gap-1.5">
          {<button disabled={busy} onClick={onMoi} className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[12.5px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">+ Buổi mới</button>}
          <button onClick={() => setMo((v) => !v)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12.5px] text-slate-700 hover:bg-slate-50">{mo ? 'Ẩn buổi' : 'Chọn buổi có sẵn'}</button>
        </div>
      </div>
      {mo && (
        <div className="max-h-[320px] overflow-auto border-t border-slate-100">
          {loi && <p className="px-3 py-2 text-rose-600">{loi}</p>}
          {!buoi && !loi && <p className="px-3 py-2 text-slate-400">Đang tải…</p>}
          {buoi?.length === 0 && <p className="px-3 py-2 text-slate-400">Giáo trình chưa có buổi.</p>}
          {buoi?.map((x, i) => {
            const daGanNgay = ban.get(x.id)
            const laHienTai = ca.buoi?.id === x.id
            return (
              <button key={x.id} disabled={busy || !!daGanNgay || laHienTai} onClick={() => onChon(x.id)}
                className="flex w-full items-start gap-2 border-b border-slate-50 px-3 py-1.5 text-left hover:bg-indigo-50 disabled:cursor-default disabled:hover:bg-transparent">
                <span className="w-14 shrink-0 font-semibold text-slate-600">Buổi {i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{x.tieu_de ?? ''}</span>
                  {x.nhom.length > 0 && <span className="block truncate text-[11.5px] text-slate-500">{x.nhom.map((n) => n.ten).join(' · ')}</span>}
                </span>
                {laHienTai ? <span className="shrink-0 text-[11.5px] text-indigo-600">đang gắn</span>
                  : daGanNgay ? <span className="shrink-0 text-[11.5px] text-slate-400">ca {ddmm(daGanNgay)}</span> : null}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GhiChuPopup({ onDong, onXong }: { onDong: () => void; onXong: (gc: string) => void }) {
  const [gc, setGc] = useState('')
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/45 p-4" onClick={onDong}>
      <div className="w-[min(460px,94vw)] rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 font-bold">Trả lại giáo trình tuần</div>
        <textarea value={gc} onChange={(e) => setGc(e.target.value)} rows={3} autoFocus placeholder="Lý do / cần sửa gì"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px]" />
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={onDong} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[13px]">Huỷ</button>
          <button disabled={!gc.trim()} onClick={() => onXong(gc.trim())} className="rounded-lg bg-rose-600 px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-50">↩ Trả lại</button>
        </div>
      </div>
    </div>
  )
}

// Thẻ nhánh cạnh tên giáo trình (Thùy 16/11: tên = "Giáo trình <lớp>", nhánh là thẻ). Nhãn từ registry lib/mon.ts.
function TheNhanh({ mon, nhanh }: { mon: string; nhanh: string | null }) {
  const t = theNhanh(mon, nhanh)
  if (!t) return null
  const mau = laNhanhMoHinh(nhanh) ? 'bg-teal-100 text-teal-700' : nhanh ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
  return <span className={'shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ' + mau}>{t}</span>
}
const thuTuNhanh = (nhanh: string | null) => (!nhanh ? 0 : laNhanhMoHinh(nhanh) ? 2 : 1)

// Tiêu đề buổi: "Buổi <số>" + phần tên riêng (bỏ "Buổi N:" người soạn gõ sẵn — số hiển thị là số suy ra, không lặp).
const tenBuoi = (stt: number, tieuDe: string | null) => {
  const rieng = (tieuDe ?? '').replace(/^\s*Buổi\s*\d+\s*[:.\-–]?\s*/i, '').trim()
  return `Buổi ${stt}${rieng ? ` · ${rieng}` : ''}`
}
