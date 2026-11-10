// CHẤT LƯỢNG trong phòng (Thùy 10/11). Story: trưởng khối đọc Dashboard học tập, nắm tình hình chung và ra quyết định bổ trợ.
//   Trưởng khối: thanh 4 mục — Dashboard học tập · Tình hình chung (màn cũ) · Hồ sơ học tập · Danh sách bổ trợ.
//   Trưởng bộ môn: Danh sách bổ trợ ở chế độ DUYỆT (duyệt = mở case như cũ · trả lại có lý do).
// Thay hẳn màn Duyệt bổ trợ cũ. Mọi luật ở DB (fn_btk_*, mig 202611101645); màn chỉ gọi + vá dòng vừa đổi tại chỗ.
import { useEffect, useState } from 'react'
import DashboardHocTapScreen from '../danhgia/DashboardHocTapScreen'
import { HoSoHocSinh } from '../ketqua/KetQuaScreen'
import WidgetDangYeu from '../qlcl/WidgetDangYeu'
import BaoCaoCaNhan from '../troly/BaoCaoCaNhan'
import BoTroPopup from './BoTroPopup'
import { tongQuanDangYeu, type OTongQuan } from '../../lib/qlcl'
import { dsBoTro, boBoTro, guiBoTro, duyetBoTro, traLaiBoTro, NHAN_TT, TEN_MUC, TEN_UU_TIEN, type DongBtk } from '../../lib/boTroTk'

type Muc = 'dashboard' | 'chung' | 'hoso' | 'bo_tro'
const MUC: [Muc, string][] = [['dashboard', 'Dashboard học tập'], ['chung', 'Tình hình chung'], ['hoso', 'Hồ sơ học tập'], ['bo_tro', 'Danh sách bổ trợ']]
// sống tới F5: rời phòng quay lại đúng mục, đúng em đang xem (CLAUDE §React)
const NHO: { muc: Muc; hoSo: { hs: string; mon: string } | null; o: OTongQuan[] | null; ds: Record<string, DongBtk[]> } = { muc: 'dashboard', hoSo: null, o: null, ds: {} }

const ngay = (t: string | null) => (t ? new Date(t).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit' }) : '')
const thanh = (on: boolean) => `whitespace-nowrap rounded-lg px-3 py-1 text-[12.5px] font-semibold ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`

function useOCuaToi() {
  const [o, setO] = useState<OTongQuan[] | null>(NHO.o)
  useEffect(() => { tongQuanDangYeu().then((d) => { NHO.o = d; setO(d) }).catch(() => setO([])) }, [])
  return o
}

export function ChatLuongTK({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const [muc, setMucS] = useState<Muc>(NHO.muc)
  const setMuc = (m: Muc) => { NHO.muc = m; setMucS(m) }
  const [hoSo, setHoSo] = useState(NHO.hoSo)
  const cacO = useOCuaToi()
  const moHoSo = (hs: string, mon: string) => { NHO.hoSo = { hs, mon }; setHoSo(NHO.hoSo); setMuc('hoso') }
  const thanhMuc = (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
      {MUC.map(([k, t]) => <button key={k} onClick={() => setMuc(k)} className={thanh(muc === k)}>{t}</button>)}
    </div>
  )
  return (
    <div className="space-y-4">
      {muc !== 'dashboard' && thanhMuc}
      {muc === 'dashboard' && (cacO ? <DashboardHocTapScreen phong={{ o: cacO.map((x) => ({ mon: x.mon, khoi: x.khoi })), onMoHoSo: moHoSo, dau: thanhMuc }} /> : <>{thanhMuc}<p className="text-[13px] text-slate-400">Đang tải các khối…</p></>)}
      {muc === 'chung' && <><WidgetDangYeu className="" onTaoCaNhe={onTaoCaNhe} /><BaoCaoCaNhan chiMuc={['tuan']} /></>}
      {muc === 'hoso' && <HoSoHocSinh key={hoSo ? `${hoSo.mon}|${hoSo.hs}` : 'trong'} monDau={hoSo?.mon ?? cacO?.[0]?.mon ?? 'Toán'} hsDau={hoSo?.hs ?? null} />}
      {muc === 'bo_tro' && (cacO ? <DanhSachBoTro che="tk" cacO={cacO} onMoHoSo={moHoSo} /> : null)}
    </div>
  )
}

// Danh sách bổ trợ — cùng 1 màn cho 2 ghế: tk (sửa · bỏ · chốt & gửi) · tbm (duyệt · trả lại). Chọn 1 ô (môn × khối) để xem.
export function DanhSachBoTro({ che, cacO, onMoHoSo }: { che: 'tk' | 'tbm'; cacO: OTongQuan[]; onMoHoSo?: (hs: string, mon: string) => void }) {
  const mons = [...new Set(cacO.map((o) => o.mon))]
  const [mon, setMon] = useState(mons[0] ?? 'Toán')
  const khois = cacO.filter((o) => o.mon === mon).map((o) => o.khoi)
  const [khoi, setKhoi] = useState<string | null>(che === 'tk' ? (khois[0] ?? null) : null)   // tbm: null = mọi khối
  const khoa = `${mon}|${khoi ?? '*'}`
  const [ds, setDs] = useState<DongBtk[] | null>(NHO.ds[khoa] ?? null)
  const [loi, setLoi] = useState<string | null>(null)
  const [sua, setSua] = useState<DongBtk | null>(null)
  const [traLai, setTraLai] = useState<{ id: string; lyDo: string } | null>(null)
  const [dang, setDang] = useState<string | null>(null)   // id dòng đang ghi
  const [baoXong, setBaoXong] = useState<string | null>(null)
  const [lamMoi, setLamMoi] = useState(0)

  useEffect(() => {   // đổi ô = đổi ngữ cảnh ⇒ đọc lại (giữ bản đã nhớ của ô đó cho tới khi có bản mới)
    let song = true
    setDs(NHO.ds[khoa] ?? null); setLoi(null)
    dsBoTro(mon, khoi).then((d) => { if (song) { NHO.ds[khoa] = d; setDs(d) } }).catch((e) => song && setLoi(e?.message ?? String(e)))
    return () => { song = false }
  }, [khoa, lamMoi]) // eslint-disable-line react-hooks/exhaustive-deps

  const va = (id: string, f: (d: DongBtk) => DongBtk | null) => setDs((cu) => {
    const moi = (cu ?? []).flatMap((d) => { if (d.id !== id) return [d]; const x = f(d); return x ? [x] : [] })
    NHO.ds[khoa] = moi; return moi
  })
  const bao = (t: string) => { setBaoXong(t); setTimeout(() => setBaoXong(null), 2500) }
  const chay = async (id: string, f: () => Promise<void>) => { setDang(id); setLoi(null); try { await f() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang(null) } }

  const soNhap = (ds ?? []).filter((d) => d.trang_thai === 'nhap').length
  const soCho = (ds ?? []).filter((d) => d.trang_thai === 'cho_duyet').length
  const chip = (on: boolean) => `rounded-full px-3 py-1 text-[12.5px] font-semibold ${on ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {mons.length > 1 && mons.map((m) => <button key={m} onClick={() => { setMon(m); setKhoi(che === 'tk' ? (cacO.find((o) => o.mon === m)?.khoi ?? null) : null) }} className={chip(mon === m)}>{m}</button>)}
        {che === 'tbm' && <button onClick={() => setKhoi(null)} className={chip(khoi === null)}>Mọi khối</button>}
        {khois.map((k) => <button key={k} onClick={() => setKhoi(k)} className={chip(khoi === k)}>Khối {k}</button>)}
        <button onClick={() => setLamMoi((x) => x + 1)} title="Đọc lại" className="ml-1 rounded-full px-2 py-1 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻</button>
        {baoXong && <span className="text-[12.5px] font-semibold text-emerald-600">✓ {baoXong}</span>}
        {che === 'tk' && khoi && (
          <button disabled={soNhap === 0 || dang === 'gui'} onClick={() => chay('gui', async () => {
            const n = await guiBoTro(mon, khoi)
            setDs((cu) => (cu ?? []).map((d) => d.trang_thai === 'nhap' ? { ...d, trang_thai: 'cho_duyet', gui_at: new Date().toISOString() } : d)); bao(`Đã gửi ${n} em cho trưởng bộ môn`)
          })} className="ml-auto rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-bold text-white shadow-sm disabled:opacity-40">
            Chốt & gửi trưởng bộ môn{soNhap ? ` (${soNhap} em)` : ''}
          </button>
        )}
        {che === 'tbm' && soCho > 0 && <span className="ml-auto text-[12.5px] font-semibold text-amber-700">{soCho} em chờ duyệt</span>}
      </div>
      {loi && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</p>}
      {!ds ? <p className="text-[13px] text-slate-400">Đang tải…</p> : ds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-[13px] text-slate-500">
          {che === 'tk' ? 'Chưa có em nào. Bấm "Bổ trợ" ở Dashboard học tập để thêm.' : 'Không có em nào chờ duyệt.'}
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-slate-200">
          <table className="w-full border-separate border-spacing-0 text-[13px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="border-b border-slate-200 px-3 py-2">Học sinh</th>
                {khoi === null && <th className="border-b border-slate-200 px-2 py-2">Khối</th>}
                <th className="border-b border-slate-200 px-2 py-2">Nhóm bổ trợ</th>
                <th className="border-b border-slate-200 px-2 py-2">Mức · ưu tiên</th>
                <th className="border-b border-slate-200 px-2 py-2">Trạng thái</th>
                <th className="border-b border-slate-200 px-2 py-2 text-right" />
              </tr>
            </thead>
            <tbody>
              {ds.map((d) => (
                <tr key={d.id} className="align-top hover:bg-slate-50/60">
                  <td className="border-b border-slate-100 px-3 py-2">
                    {onMoHoSo ? <button onClick={() => onMoHoSo(d.hoc_sinh_id, mon)} className="font-semibold text-slate-800 hover:text-indigo-700 hover:underline">{d.ho_ten}</button> : <span className="font-semibold text-slate-800">{d.ho_ten}</span>}
                    <div className="text-[11.5px] text-slate-500">{[d.lop, d.ma_hs, d.dang_yeu != null ? `${d.dang_yeu} dạng yếu` : null].filter(Boolean).join(' · ')}</div>
                  </td>
                  {khoi === null && <td className="border-b border-slate-100 px-2 py-2 text-slate-600">{d.khoi}</td>}
                  <td className="border-b border-slate-100 px-2 py-2">
                    {d.nhom.map((n) => (
                      <div key={n.ma} className="leading-snug"><span className="text-slate-800">{n.ten}</span>{n.p != null && <b className={`ml-1 ${n.p < 50 ? 'text-rose-600' : n.p < 80 ? 'text-amber-700' : 'text-emerald-700'}`}>{n.p}%</b>}</div>
                    ))}
                    {d.ghi_chu && <div className="mt-0.5 text-[11.5px] italic text-slate-500">“{d.ghi_chu}”</div>}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2 text-[12px] text-slate-600">{TEN_MUC[d.muc]}<div>Ưu tiên {TEN_UU_TIEN[d.uu_tien]}</div></td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    <span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[11.5px] font-semibold ${NHAN_TT[d.trang_thai].cls}`}>{NHAN_TT[d.trang_thai].t}</span>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {d.trang_thai === 'da_duyet' ? `${d.duyet_ten ?? ''} duyệt ${ngay(d.duyet_at)} · ${d.so_dang ?? 0} dạng vào case`
                        : d.trang_thai === 'cho_duyet' ? `${d.gui_ten ?? ''} gửi ${ngay(d.gui_at)}`
                        : `${d.tao_ten ?? ''} · ${ngay(d.tao_at)}`}
                    </div>
                    {d.trang_thai === 'tra_lai' && d.ly_do_tra && <div className="mt-0.5 text-[11.5px] text-rose-600">Lý do: {d.ly_do_tra}</div>}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2 text-right">
                    {che === 'tk' && (d.trang_thai === 'nhap' || d.trang_thai === 'tra_lai') && (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSua(d)} className="rounded-md bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-slate-700 hover:bg-slate-200">Sửa</button>
                        <button disabled={dang === d.id} onClick={() => chay(d.id, async () => { await boBoTro(d.id); va(d.id, () => null); bao('Đã bỏ khỏi danh sách') })}
                          className="rounded-md px-2.5 py-1 text-[12px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40">Bỏ</button>
                      </div>
                    )}
                    {che === 'tbm' && d.trang_thai === 'cho_duyet' && (
                      traLai?.id === d.id ? (
                        <div className="flex min-w-[220px] flex-col items-end gap-1">
                          <input autoFocus value={traLai.lyDo} onChange={(e) => setTraLai({ id: d.id, lyDo: e.target.value })} placeholder="Lý do trả lại…"
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-[12.5px] text-slate-800 outline-none focus:border-slate-500" />
                          <div className="flex gap-1">
                            <button onClick={() => setTraLai(null)} className="rounded-md bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-slate-600">Thôi</button>
                            <button disabled={!traLai.lyDo.trim() || dang === d.id} onClick={() => chay(d.id, async () => {
                              await traLaiBoTro(d.id, traLai.lyDo); va(d.id, (x) => ({ ...x, trang_thai: 'tra_lai', ly_do_tra: traLai.lyDo.trim() })); setTraLai(null); bao('Đã trả lại trưởng khối')
                            })} className="rounded-md bg-rose-600 px-2.5 py-1 text-[12px] font-bold text-white disabled:opacity-40">Trả lại</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setTraLai({ id: d.id, lyDo: '' })} className="rounded-md px-2.5 py-1 text-[12px] font-semibold text-rose-600 hover:bg-rose-50">Trả lại</button>
                          <button disabled={dang === d.id} onClick={() => chay(d.id, async () => {
                            const kq = await duyetBoTro(d.id)
                            va(d.id, (x) => ({ ...x, trang_thai: 'da_duyet', case_id: kq.case_id, so_dang: kq.so_dang, duyet_at: new Date().toISOString() }))
                            bao(`Đã duyệt — mở case, ${kq.so_dang} dạng`)
                          })} className="rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-bold text-white shadow-sm disabled:opacity-40">{dang === d.id ? '…' : 'Duyệt'}</button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[11.5px] text-slate-400">
        {che === 'tk'
          ? 'Nháp sửa / bỏ được. "Chốt & gửi" gửi mọi em nháp của khối cho trưởng bộ môn; bị trả lại thì sửa rồi gửi lại. Đã duyệt = đã mở case bổ trợ như cũ (Lộc xếp lịch · TA dạy · test cuối ca).'
          : 'Duyệt = mở case bổ trợ như cũ (kiểm trần 70 em / 20 Cao, Lộc xếp lịch, TA dạy, test cuối ca). Dạng vào case = các dạng chưa đạt của nhóm đã chọn. Trả lại phải ghi lý do.'}
      </p>
      {sua && <BoTroPopup hs={{ id: sua.hoc_sinh_id, ten: sua.ho_ten, lop: sua.lop }} mon={mon} onDong={() => setSua(null)}
        onXong={() => { setSua(null); setLamMoi((x) => x + 1); bao('Đã lưu') }} />}
    </div>
  )
}
