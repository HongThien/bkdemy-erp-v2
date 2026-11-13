// Tab "Mục tiêu tuần" — Dashboard học tập (cũng hiện trong Phòng làm việc trưởng khối vì phòng dùng chung màn này).
// spec-muc-tieu-tuan.md §9.3: lọc môn · khối · tuần · 4 ô tổng · bảng theo lớp (kèm trạng thái chốt + nút Chốt mục tiêu tuần) ·
// em cần để ý (bấm ⇒ tờ của em). Mọi con số từ DB (fn_mtt_trung_tam, fn_mtt_hs — mig 202611131000); client chỉ định dạng.
import { useEffect, useState } from 'react'
import {
  mttTrungTam, mttCuaHs, mttChotLop, laChuaChot, dauTuanNay, congNgay, ngayNgan, thuNgay, gioPhut, moTaViec, nhanChenh,
  NHAN_MUC, NHAN_TT, NHAN_THAI_DO, TEN_VIEC,
  type MttTrungTam, type MttTo, type MttNhom, type MttViec, type MucDanhGia,
} from '../../lib/mucTieuTuan'

// rời tab quay lại = đúng chỗ cũ (CLAUDE §React)
const NHO: { tuan: string | null; khoa: string; data: MttTrungTam | null } = { tuan: null, khoa: '', data: null }

const mauMuc = (m: MucDanhGia | null) => m === 'tot' ? 'bg-emerald-100 text-emerald-800' : m === 'tam_on' ? 'bg-amber-100 text-amber-800' : m === 'chua_tot' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
const mauChenh = (h?: string) => h === 'len' ? 'text-emerald-700' : h === 'xuong' ? 'text-rose-600' : 'text-slate-500'
const so = (v: number | null | undefined, hau = '') => (v == null ? '—' : `${Math.round(v)}${hau}`)

export default function MucTieuTuanTab({ mon, khoi, lamMoi }: { mon: string; khoi: string | null; lamMoi: number }) {
  const nay = dauTuanNay()
  const [tuan, setTuan] = useState(NHO.tuan ?? nay)
  const [data, setData] = useState<MttTrungTam | null>(NHO.data)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangChot, setDangChot] = useState<string | null>(null)
  const [xemHs, setXemHs] = useState<{ id: string; ten: string } | null>(null)
  const [lanDau, setLanDau] = useState(lamMoi)
  useEffect(() => { NHO.tuan = tuan }, [tuan])

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

  // chốt 1 lớp: vá đúng dòng lớp đó ngay, rồi đọc lại NỀN (số của cả khối đổi theo) — không xoá bảng
  const chot = async (lopId: string) => {
    if (!khoi) return
    setDangChot(lopId); setLoi(null)
    try {
      const r = await mttChotLop(lopId, tuan)
      setData((d) => d && ({ ...d, lop: d.lop.map((l) => l.lop_id === lopId ? { ...l, chot_at: r.chot_at } : l) }))
      const moi = await mttTrungTam(mon, khoi, tuan)
      NHO.data = moi; NHO.khoa = [mon, khoi, tuan].join('|'); setData(moi)
    } catch (e) {
      setLoi('Chưa chốt được: ' + ((e as { message?: string })?.message ?? e))
    } finally { setDangChot(null) }
  }

  const tong = data?.tong
  const tile = 'rounded-xl border border-slate-200 bg-white px-4 py-3'
  const nhanTile = 'text-[11px] font-bold uppercase tracking-wide text-slate-500'
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-md ring-1 ring-slate-200">
          <button onClick={() => setTuan(congNgay(tuan, -7))} className="h-8 bg-white px-2.5 text-[13px] text-slate-600 hover:bg-slate-50" aria-label="Tuần trước">‹</button>
          <span className="h-8 bg-white px-3 text-[13px] font-semibold leading-8 text-slate-800">Tuần {ngayNgan(tuan)} – {ngayNgan(congNgay(tuan, 6))}{tuan === nay ? ' (đang chạy)' : ''}</span>
          <button onClick={() => setTuan(congNgay(tuan, 7))} disabled={tuan >= nay} className="h-8 bg-white px-2.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-30" aria-label="Tuần sau">›</button>
        </div>
        {data?.tinh_at && <span className="text-[12px] text-slate-500">Số tính lúc {gioPhut(data.tinh_at)}</span>}
        {tuan === nay && <span className="text-[12px] text-slate-500">Lớp chưa chốt thì học sinh và phụ huynh chưa thấy tờ tuần này.</span>}
      </div>
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {!data ? (dangTai ? <p className="text-sm text-slate-500">Đang tải…</p> : null) : (
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
                    <th className="px-2 py-2">Mục tiêu tuần</th>
                    <th className="px-2 py-2">Tiến độ TB</th><th className="px-2 py-2">Việc xong</th>
                    <th className="px-2 py-2">BTVN T · TÔ · CT</th><th className="px-2 py-2">Chưa làm gì</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lop.length === 0 && <tr><td colSpan={9} className="px-3 py-6 text-center text-slate-500">Khối này chưa có lớp đang học.</td></tr>}
                  {data.lop.map((l) => (
                    <tr key={l.lop_id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold text-slate-800">{l.ten_lop}</td>
                      <td className="px-2 py-2 text-center">{l.si_so}</td>
                      <td className={`px-2 py-2 text-center ${l.so_buoi > 0 && l.so_buoi_co_tl < l.so_buoi ? 'font-semibold text-orange-700' : ''}`}>{l.so_buoi_co_tl}/{l.so_buoi}</td>
                      <td className={`px-2 py-2 text-center ${l.bo_tro_cho > 0 ? 'font-semibold text-orange-700' : ''}`}>{l.bo_tro_cho}</td>
                      <td className="px-2 py-2 text-center">
                        {l.chot_at ? <span className="text-emerald-700">Đã chốt {gioPhut(l.chot_at)} {ngayNgan(l.chot_at.slice(0, 10))}</span>
                          : data.dang_chay ? (
                            <button onClick={() => chot(l.lop_id)} disabled={dangChot !== null}
                              className="h-7 rounded-md bg-slate-800 px-2.5 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
                              {dangChot === l.lop_id ? 'Đang chốt…' : 'Chốt mục tiêu tuần'}
                            </button>
                          ) : <span className="text-slate-400">Không chốt</span>}
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
              <p className="px-4 pb-3 pt-1 text-[11.5px] text-slate-500">Chốt sau buổi họp thứ Hai, khi đã chốt giáo trình cả tuần và chốt bổ trợ ở Phòng làm việc. Bấm chốt là học sinh và phụ huynh lớp đó thấy tờ tuần này.</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-baseline gap-2 px-4 py-2.5">
                <span className="text-[14px] font-bold text-slate-800">Em cần để ý</span>
                <span className="text-[12px] text-slate-500">bấm tên để mở tờ mục tiêu tuần của em</span>
              </div>
              {data.em.length === 0 && <p className="px-4 pb-4 text-[13px] text-slate-500">Không có em nào cần để ý.</p>}
              {data.em.map((e) => (
                <button key={e.id} onClick={() => setXemHs({ id: e.id, ten: e.ten })} className="flex w-full items-start gap-3 border-t border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50">
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
      {xemHs && <ToHsPopup hs={xemHs} mon={mon} tuan={tuan} onDong={() => setXemHs(null)} />}
    </div>
  )
}

// ── tờ của 1 em (nhân sự xem được cả khi lớp chưa chốt) ─────────────────────
function ToHsPopup({ hs, mon, tuan, onDong }: { hs: { id: string; ten: string }; mon: string; tuan: string; onDong: () => void }) {
  const [to, setTo] = useState<MttTo | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    setTo(null); setLoi(null)
    mttCuaHs(hs.id, mon, tuan)
      .then((r) => { if (!alive) return; if (!r || laChuaChot(r)) setLoi('Chưa có tờ tuần này.'); else setTo(r) })
      .catch((e) => alive && setLoi(String(e?.message ?? e)))
    return () => { alive = false }
  }, [hs.id, mon, tuan])
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4" onClick={onDong}>
      <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="text-[17px] font-bold text-slate-900">{hs.ten}{to?.hs.lop ? ` · ${to.hs.lop}` : ''}</div>
            <div className="text-[12.5px] text-slate-500">
              Mục tiêu tuần {to ? `${ngayNgan(to.tuan)} – ${ngayNgan(to.den_ngay)}` : ''} · {mon}
              {to && !to.chot && ' · lớp CHƯA chốt (học sinh chưa thấy)'}
              {to?.da_chot_so && ' · sổ đã chốt'}
            </div>
          </div>
          <button onClick={onDong} className="h-8 rounded-md px-3 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">Đóng</button>
        </div>
        {loi && <p className="mt-4 text-[13px] text-slate-500">{loi}</p>}
        {!to && !loi && <p className="mt-4 text-[13px] text-slate-500">Đang tải…</p>}
        {to && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-3 text-[13px]">
              <span className="rounded-lg bg-slate-50 px-3 py-1.5">Tiến độ <b>{so(to.tien_do, '%')}</b>{to.tien_do_d != null && ` (${to.tien_do_d >= 0 ? '▲' : '▼'} ${Math.abs(to.tien_do_d)})`}</span>
              <span className="rounded-lg bg-slate-50 px-3 py-1.5">Việc <b>{to.viec_xong}/{to.viec_tong}</b></span>
              <span className="rounded-lg bg-slate-50 px-3 py-1.5">Hạng <b>{to.hang ?? '—'}</b>{to.so_hs ? ` / ${to.so_hs}` : ''}</span>
              <span className="rounded-lg bg-slate-50 px-3 py-1.5">Tự luyện <b>{to.tu_luyen.so_cau}</b> câu{to.tu_luyen.pct != null ? ` · đúng ${to.tu_luyen.pct}%` : ''}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {([1, 2] as const).map((ph) => (
                <div key={ph}>
                  <div className="mb-1.5 text-[13px] font-bold text-slate-700">{ph === 1 ? 'Phần 1 · Kiến thức mới' : 'Phần 2 · Ôn tập kiến thức'}</div>
                  {to.nhom.filter((n) => n.phan === ph).length === 0 && <p className="text-[12.5px] text-slate-400">Không có nhóm.</p>}
                  {to.nhom.filter((n) => n.phan === ph).map((n) => <DongNhom key={n.ma} n={n} />)}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1.5 text-[13px] font-bold text-slate-700">Việc của em tuần này</div>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {to.viec.length === 0 && <p className="px-3 py-2 text-[12.5px] text-slate-400">Chưa có việc.</p>}
                {to.viec.map((v) => <DongViec key={v.loai + v.buoi_id} v={v} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DongNhom({ n }: { n: MttNhom }) {
  const c = nhanChenh(n.p, n.d)
  return (
    <div className="mb-1.5 rounded-lg border border-slate-200 px-3 py-2">
      <div className="flex items-baseline gap-2">
        <span className="flex-1 text-[13px] font-semibold text-slate-800">{n.ten}</span>
        {c && <span className={`text-[11.5px] font-bold ${mauChenh(c.huong)}`}>{c.chu}</span>}
        <span className="text-[13px] font-bold text-slate-900">{n.p == null ? 'Chưa đo' : `${n.p}%`}</span>
      </div>
      <div className="mt-0.5 text-[11.5px] text-slate-500">
        Mục tiêu tuần {n.mt == null ? '— (tuần này không có lần đo)' : `${n.mt}%`} · đích {n.dich}% · {n.k} lần đo trong tuần{n.n != null ? ` · ${n.n} lần đã đo` : ''}
      </div>
    </div>
  )
}

function DongViec({ v }: { v: MttViec }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-slate-800">{TEN_VIEC[v.loai]} · {thuNgay(v.ngay)}</span>
        <span className="block text-[11.5px] text-slate-500">{[moTaViec(v), v.ghi_chu].filter(Boolean).join(' · ')}</span>
      </span>
      {v.thai_do && <span className="text-[11px] text-slate-500">{NHAN_THAI_DO[v.thai_do] ?? v.thai_do}</span>}
      <span className="text-[13px] font-bold text-slate-800">{v.pct == null ? '' : `${v.pct}%`}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${v.muc ? mauMuc(v.muc) : 'bg-slate-100 text-slate-500'}`}>{v.muc ? NHAN_MUC[v.muc] : NHAN_TT[v.tt]}</span>
    </div>
  )
}
