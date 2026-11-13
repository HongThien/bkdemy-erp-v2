// Popup KẾ HOẠCH BỔ TRỢ (Thùy 10/11): bấm "Bổ trợ" ở Dashboard học tập (hoặc sửa 1 dòng ở Danh sách bổ trợ).
// Hệ thống hiện 5 NHÓM có % thấp nhất (thấp → cao, mastery theo lần — fn_btk_goi_y), trưởng khối tick; nhóm YẾU tick sẵn.
// Lưu ⇒ em vào Danh sách bổ trợ (nháp). Số liệu + luật ở DB; popup chỉ chọn và gửi.
import { useEffect, useState } from 'react'
import { goiYBoTro, tatCaNhomBoTro, luuBoTro, dangTrongNhom, TEN_MUC, TEN_UU_TIEN, NHAN_TT, type GoiY, type NhomChon, type NhomGoiY, type DangTrongNhom } from '../../lib/boTroTk'

const NHAN_DANG: Record<DangTrongNhom['muc'], { t: string; c: string }> = {
  yeu: { t: 'Yếu', c: 'bg-rose-100 text-rose-700' }, can_luyen: { t: 'Cần luyện', c: 'bg-amber-100 text-amber-800' },
  dat: { t: 'Đạt', c: 'bg-emerald-100 text-emerald-700' }, chua_do: { t: 'Chưa đo', c: 'bg-slate-200 text-slate-500' },
}
const mauP = (p: number | null) => p == null ? 'text-slate-400' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-600'

export default function BoTroPopup({ hs, mon, onDong, onXong }: {
  hs: { id: string; ten: string; lop?: string | null }; mon: string
  onDong: () => void; onXong: (kq: { id: string; tt: 'nhap' }) => void
}) {
  const [gy, setGy] = useState<GoiY | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [chon, setChon] = useState<Set<string>>(new Set())
  const [them, setThem] = useState<NhomChon[]>([])   // nhóm đã chọn trước đây nhưng không còn trong top 5
  const [muc, setMuc] = useState(3)   // mặc định 4 đơn vị (= L2 cũ "buổi riêng TA")
  const [uuTien, setUuTien] = useState(2)
  const [ghiChu, setGhiChu] = useState('')
  const [dangLuu, setDangLuu] = useState(false)
  // 11/11 (Thùy): mở rộng từ 5 nhóm thấp nhất ra MỌI nhóm em đã đo — gọi DB lúc bấm
  const [tatCa, setTatCa] = useState<NhomGoiY[] | null>(null)
  const [dangMo, setDangMo] = useState(false)
  const [moRong, setMoRong] = useState(false)
  // Thùy 13/11: bấm nhóm ⇒ xem từng dạng (yếu / cần luyện / đạt / chưa đo) — gọi DB lúc bấm, nhớ lại khi mở lần 2
  const [moDang, setMoDang] = useState<Record<string, DangTrongNhom[] | 'dang'>>({})
  const xemDang = (ma: string) => {
    if (moDang[ma]) { setMoDang((x) => { const y = { ...x }; delete y[ma]; return y }); return }
    setMoDang((x) => ({ ...x, [ma]: 'dang' }))
    dangTrongNhom(hs.id, mon, ma).then((ds) => setMoDang((x) => ({ ...x, [ma]: ds }))).catch((e) => { setLoi(e?.message ?? String(e)); setMoDang((x) => { const y = { ...x }; delete y[ma]; return y }) })
  }
  const moTatCa = () => {
    setMoRong(true)
    if (tatCa) return
    setDangMo(true); tatCaNhomBoTro(hs.id, mon).then(setTatCa).catch((e) => setLoi(e?.message ?? String(e))).finally(() => setDangMo(false))
  }

  useEffect(() => {
    goiYBoTro(hs.id, mon).then((g) => {
      setGy(g)
      const dx = g.de_xuat
      if (dx) {
        setChon(new Set(dx.nhom.map((n) => n.ma))); setMuc(dx.muc); setUuTien(dx.uu_tien); setGhiChu(dx.ghi_chu)
        setThem(dx.nhom.filter((n) => !g.nhom.some((x) => x.ma === n.ma)))
      } else setChon(new Set(g.nhom.filter((n) => n.tick).map((n) => n.ma)))
    }).catch((e) => setLoi(e?.message ?? String(e)))
  }, [hs.id, mon])

  const khoa = gy?.de_xuat && gy.de_xuat.trang_thai === 'cho_duyet'
  const bat = (ma: string) => setChon((s) => { const n = new Set(s); if (n.has(ma)) n.delete(ma); else n.add(ma); return n })
  async function luu() {
    setDangLuu(true); setLoi(null)
    try {
      const id = await luuBoTro({ id: gy?.de_xuat?.id ?? null, hs: hs.id, mon, nhom: [...chon], muc, uuTien, ghiChu })
      onXong({ id, tt: 'nhap' })
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDangLuu(false) }
  }

  const o = (on: boolean) => `rounded-lg px-2.5 py-1 text-[12.5px] font-semibold ring-1 ${on ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'}`
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/45 p-4" onClick={onDong}>
      <div className="flex max-h-[90vh] w-[min(620px,96vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-indigo-600 px-5 py-3 text-white">
          <div className="text-[16px] font-bold">Kế hoạch bổ trợ · {hs.ten}</div>
          <div className="text-[12.5px] text-indigo-100">{[hs.lop, mon, gy ? `${gy.so_nhom_yeu} nhóm yếu${gy.dang_yeu != null ? ` · ${gy.dang_yeu} dạng yếu${gy.dang_yeu_trong_nhom_yeu != null ? ` (${gy.dang_yeu_trong_nhom_yeu} trong nhóm yếu)` : ''}` : ''}` : null].filter(Boolean).join(' · ')}</div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
          {loi && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</p>}
          {!gy ? (!loi && <p className="text-[13px] text-slate-400">Đang đọc các nhóm của em…</p>) : (
            <>
              {gy.dang_bo_tro && !gy.de_xuat && <p className="mb-3 rounded-lg bg-indigo-50 px-3 py-2 text-[13px] text-indigo-700">Em đang có case bổ trợ mở — chờ xong case rồi đề xuất tiếp.</p>}
              {gy.de_xuat?.trang_thai === 'tra_lai' && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700"><b>Bị trả lại:</b> {gy.de_xuat.ly_do_tra}</p>}
              {khoa && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">Đã gửi trưởng bộ môn — {NHAN_TT.cho_duyet.t.toLowerCase()}, không sửa được nữa.</p>}
              <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-slate-500">{moRong && tatCa ? `Tất cả ${tatCa.length} nhóm em đã đo (thấp → cao)` : '5 nhóm thấp nhất'} — tick nhóm cần bổ trợ</div>
              {gy.nhom.length === 0 && them.length === 0 ? <p className="text-[13px] text-slate-400">Em chưa có lần đo nào theo nhóm bài của bản đồ mới.</p> : (
                <div className="space-y-1.5">
                  {[...(moRong && tatCa ? tatCa : [...gy.nhom, ...(tatCa ?? []).filter((x) => chon.has(x.ma) && !gy.nhom.some((g) => g.ma === x.ma))]).map((n) => ({ ...n, cu: false })),
                    ...them.filter((t) => !(tatCa ?? []).some((x) => x.ma === t.ma)).map((n) => ({ ...n, p: n.p ?? 0, n: n.n ?? 0, tin: '', dang_chua_dat: 0, dang_da_do: 0, tick: true, cu: true }))].map((n) => (
                    <div key={n.ma}>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 ${chon.has(n.ma) ? 'border-indigo-300 bg-indigo-50/60' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={chon.has(n.ma)} disabled={!!khoa} onChange={() => bat(n.ma)} className="mt-1 h-4 w-4 accent-indigo-600" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-semibold text-slate-800">{n.ten}</div>
                        <div className="text-[11.5px] text-slate-500">{[n.cha, n.cu ? 'đã chọn trước đây' : `${n.n} lần đo`, !n.cu && n.dang_da_do ? `${(n as { dang_yeu?: number }).dang_yeu ? `${(n as { dang_yeu?: number }).dang_yeu} dạng yếu · ` : ''}${n.dang_chua_dat}/${n.dang_da_do} dạng chưa đạt` : null].filter(Boolean).join(' · ')}</div>
                      </div>
                      <button type="button" onClick={(e) => { e.preventDefault(); xemDang(n.ma) }} className="shrink-0 self-center rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50">{moDang[n.ma] ? 'dạng ▴' : 'dạng ▾'}</button>
                      <div className={`shrink-0 text-[18px] font-extrabold tabular-nums ${mauP(n.cu ? null : n.p)}`}>{n.cu ? '' : `${n.p}%`}</div>
                    </label>
                    {moDang[n.ma] && (
                      <div className="mx-3 mb-1 rounded-b-lg border border-t-0 border-slate-200 bg-slate-50/70 px-3 py-1.5">
                        {moDang[n.ma] === 'dang' ? <p className="text-[12px] text-slate-400">Đang đọc dạng…</p>
                          : (moDang[n.ma] as DangTrongNhom[]).length === 0 ? <p className="text-[12px] text-slate-400">Nhóm chưa có dạng nào.</p>
                          : (moDang[n.ma] as DangTrongNhom[]).map((d) => (
                            <div key={d.ma_dang} className="flex items-center gap-2 py-0.5 text-[12px]">
                              <span className={`w-[68px] shrink-0 rounded-full px-1.5 text-center text-[10.5px] font-semibold ${NHAN_DANG[d.muc].c}`}>{NHAN_DANG[d.muc].t}</span>
                              <span className="min-w-0 flex-1 truncate text-slate-700" title={d.ten_dang}>{d.ten_dang}</span>
                              <span className={`shrink-0 tabular-nums font-semibold ${mauP(d.p)}`}>{d.p == null ? '—' : `${d.p}%`}</span>
                              <span className="w-[52px] shrink-0 text-right text-[11px] text-slate-400">{d.n} lần đo</span>
                            </div>
                          ))}
                      </div>
                    )}
                    </div>
                  ))}
                </div>
              )}
              {!moRong && gy.so_nhom_do > gy.nhom.length && (
                <button onClick={moTatCa} disabled={dangMo} className="mt-2 w-full rounded-lg border border-dashed border-indigo-300 py-1.5 text-[12.5px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
                  {dangMo ? 'Đang đọc…' : `▾ Xem tất cả ${gy.so_nhom_do} nhóm em đã đo`}
                </button>
              )}
              {moRong && tatCa && <button onClick={() => setMoRong(false)} className="mt-2 w-full rounded-lg py-1 text-[12px] font-semibold text-slate-500 hover:bg-slate-50">▴ Thu gọn về 5 nhóm thấp nhất</button>}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Mức</div>
                  <div className="flex flex-col gap-1">{[1, 2, 3, 4].map((m) => <button key={m} disabled={!!khoa} onClick={() => setMuc(m)} className={o(muc === m) + ' text-left'}>{TEN_MUC[m]}</button>)}</div>
                </div>
                <div>
                  <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Ưu tiên</div>
                  <div className="flex gap-1">{[3, 2, 1].map((u) => <button key={u} disabled={!!khoa} onClick={() => setUuTien(u)} className={o(uuTien === u)}>{TEN_UU_TIEN[u]}</button>)}</div>
                  <div className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Ghi chú</div>
                  <textarea value={ghiChu} disabled={!!khoa} onChange={(e) => setGhiChu(e.target.value)} rows={2} placeholder="Lý do, lưu ý cho người xếp / dạy (tuỳ chọn)"
                    className="w-full resize-none rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] text-slate-800 outline-none focus:border-slate-500" />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button onClick={onDong} className="rounded-lg bg-slate-100 px-4 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-200">Đóng</button>
          {!khoa && <button onClick={luu} disabled={!gy || chon.size === 0 || dangLuu || (gy.dang_bo_tro && !gy.de_xuat)}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-bold text-white shadow-sm disabled:opacity-40">{dangLuu ? 'Đang lưu…' : gy?.de_xuat ? 'Lưu thay đổi' : 'Thêm vào Danh sách bổ trợ'}</button>}
        </div>
      </div>
    </div>
  )
}
