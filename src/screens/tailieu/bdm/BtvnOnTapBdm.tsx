// BTVN + ÔN TẬP cho 1 buổi đã gán lớp — giáo trình BẢN ĐỒ MỚI (riêng, không dùng OnTapConfirmScreen/ontap.ts cũ).
// Giống nhịp cũ: gán buổi chỉ tạo giáo trình buổi; phiếu BTVN làm ở bước này, xem trước rồi Xác nhận mới tạo.
// ⭐ XẾP CHỒNG 3 BUỔI (Thùy 13/11, spec-muc-tieu-tuan.md §8.1 · mig 202611131635): phiếu = một phần câu BTVN của buổi này
// + câu LUYỆN LẠI của 2 buổi trước (mặc định 5–3–2). Máy ghép sẵn ở DB (fn_tl_bdm_btvn_xep_chong), GV soát — bỏ câu, đổi tỉ lệ —
// rồi Xác nhận. Hàm DB chưa có (migration chưa áp) ⇒ màn lùi về cách cũ: giao trọn BTVN của buổi.
// Ôn tập (GV tick tay): tối đa CAP_NHOM_ON_TAP nhóm CŨ HƠN hai buổi trước, máy gợi ý SO_CAU_ON_TAP câu/nhóm; mặc định không chọn.
import { useEffect, useState } from 'react'
import { noiDung, goiY, onTapXep, trichBuoiBdm, cauCuaBuoi, loiDoc, btvnXepChong, CAP_NHOM_ON_TAP, SO_CAU_ON_TAP, TI_LE_XEP_CHONG, type NdBuoi, type UngVienXep, type XepChong } from '../../../lib/tailieuBdm'
import { fetchCausCuaTaiLieu, renumberBuoiLop, DEFAULT_BTVN_LINES, type TaiLieuNhanhCtx } from '../../../lib/tailieu'
import type { CauHoi } from '../../../lib/kho/api'
import { useStore } from '../../../store/useStore'
import { cauItemParts, CauFlow, CHROME_CSS } from '../PrintView'
import { KhoiCau, type CfgCau } from './BuilderBanDoMoi'
import ChonCauBdm from './ChonCauBdm'

// Ôn tập KHÔNG lưu cấu hình in theo câu (dòng/cột/chế độ hình) — KhoiCau chạy chế độ `gon`, cfg chỉ để đủ kiểu.
const CFG_TRONG: CfgCau = { lines: {}, cols: {}, cheDo: {}, onLine: () => {}, onLineAll: () => {}, onCol: () => {}, onCheDo: () => {} }
// Mặc định đề xuất SO_CAU_ON_TAP (2) câu / nhóm; GV đổi số theo loại + Gợi ý lại, hoặc ✎ Chọn câu / ✕ như builder.
const SO_ON_TAP_MAC_DINH: Record<string, number> = { trac_nghiem: SO_CAU_ON_TAP, tra_loi_ngan: 0, tu_luan: 0 }
const TI_LE_MAC_DINH = TI_LE_XEP_CHONG[0].ti_le
const ngayNgan = (d: string) => { const [, m, dd] = d.split('-'); return `${dd}/${m}` }   // 'YYYY-MM-DD' → 'DD/MM' (không qua Date — giờ VN)

type KhoiLui = { bac: number; buoi: string; tieuDe: string | null; ngay: string; nhom: string; ten: string | null; caus: string[] }

export default function BtvnOnTapBdm({ tl, masterId, buoiId, tenBuoi, lopId, tenLop, ngay, khoi, onClose, onDone }: {
  tl: TaiLieuNhanhCtx; masterId: string; buoiId: string; tenBuoi: string; lopId: string; tenLop: string; ngay: string; khoi: string
  onClose: () => void; onDone: () => void
}) {
  const [buoi, setBuoi] = useState<NdBuoi | null>(null)
  const [ungVien, setUngVien] = useState<UngVienXep[]>([])
  const [xepTheoMastery, setXepTheoMastery] = useState(false)
  const [chon, setChon] = useState<{ nhom: string; ten: string | null; caus: string[] }[]>([])
  const [cauMap, setCauMap] = useState<Map<string, CauHoi>>(new Map())
  const [gv, setGv] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [chonCau, setChonCau] = useState<string | null>(null) // nhóm đang mở hộp "✎ Chọn câu"
  // Xếp chồng: coXc = hàm DB dùng được; nay = câu của buổi này được giao (theo nhóm); lui = câu luyện lại của 2 buổi trước.
  const [coXc, setCoXc] = useState(false)
  const [tiLe, setTiLe] = useState<number[]>(TI_LE_MAC_DINH)
  const [nay, setNay] = useState<Record<string, string[]>>({})
  const [lui, setLui] = useState<KhoiLui[]>([])
  const [dangXep, setDangXep] = useState(false)

  async function napCau(ms: string[]) {
    const can = ms.filter((m) => !cauMap.has(m))
    if (!can.length) return
    const rows = await fetchCausCuaTaiLieu(tl, can)
    setCauMap((m) => { const x = new Map(m); rows.forEach((c) => x.set(c.ma_cau, c)); return x })
  }
  function datXepChong(xc: XepChong) {
    setNay(Object.fromEntries(xc.nay.map((n) => [n.nhom, n.caus])))
    setLui(xc.lui.flatMap((l) => l.nhom.map((n) => ({ bac: l.bac, buoi: l.buoi, tieuDe: l.tieu_de, ngay: l.ngay, nhom: n.nhom, ten: n.ten, caus: n.caus }))))
    setTiLe(xc.ti_le)
    // ôn tập tay chỉ dành cho nhóm cũ hơn hai buổi trước ⇒ nhóm vừa vào phần luyện lại thì rút khỏi ôn tập
    const nhomLui = new Set(xc.lui.flatMap((l) => l.nhom.map((n) => n.nhom)))
    setChon((s) => s.filter((c) => !nhomLui.has(c.nhom)))
  }
  useEffect(() => {
    (async () => {
      try {
        const [nd, uv, xc] = await Promise.all([
          noiDung(masterId, buoiId), onTapXep(masterId, buoiId, lopId),
          btvnXepChong(masterId, buoiId, lopId, ngay, TI_LE_MAC_DINH).catch(() => null),   // hàm chưa có ⇒ cách cũ, không chặn GV
        ])
        const b = nd.buoi[0] ?? null
        setBuoi(b); setUngVien(uv.ds); setXepTheoMastery(uv.xepTheoMastery)
        setCoXc(!!xc)
        if (xc) datXepChong(xc)
        await napCau([...(b ? b.nhom.flatMap((n) => n.btvn?.caus ?? []) : []), ...(xc ? xc.lui.flatMap((l) => l.nhom.flatMap((n) => n.caus)) : [])])
      } catch (e) { setLoi(loiDoc(e)) }
    })()
  }, [masterId, buoiId, lopId, ngay]) // eslint-disable-line

  // Đổi tỉ lệ / đặt lại: hỏi lại DB đúng phần xếp chồng, giữ nguyên màn (không xoá trắng) tới khi có kết quả mới.
  async function xepLai(tl2: number[]) {
    setLoi(null); setDangXep(true)
    try {
      const xc = await btvnXepChong(masterId, buoiId, lopId, ngay, tl2)
      await napCau(xc.lui.flatMap((l) => l.nhom.flatMap((n) => n.caus)))
      datXepChong(xc)
    } catch (e) { setLoi(loiDoc(e)) } finally { setDangXep(false) }
  }

  // Câu BTVN của buổi này thực sự vào phiếu, theo nhóm của buổi (xếp chồng: chỉ câu được chia; cách cũ: trọn).
  const cauNay = (n: NdBuoi['nhom'][number]) => {
    const tat = n.btvn?.caus ?? []
    if (!coXc) return tat
    const giu = new Set(nay[n.id] ?? [])
    return tat.filter((m) => giu.has(m))
  }
  const cauLui = lui.flatMap((k) => k.caus)
  const nhomLui = new Set(lui.map((k) => k.nhom))
  const ungVienHien = ungVien.filter((u) => !nhomLui.has(u.nhom))

  // Câu né khi gợi ý ôn tập: mọi câu của buổi (luyện + BTVN) + câu luyện lại + câu ôn tập của nhóm khác đã chọn.
  const tru = (khac: string | null) => [...(buoi ? cauCuaBuoi(buoi) : []), ...cauLui, ...chon.filter((c) => c.nhom !== khac).flatMap((c) => c.caus)]
  async function batNhom(u: UngVienXep) {
    setLoi(null)
    if (chon.some((c) => c.nhom === u.nhom)) { setChon((s) => s.filter((c) => c.nhom !== u.nhom)); return }
    if (chon.length >= CAP_NHOM_ON_TAP) { setLoi(`Tối đa ${CAP_NHOM_ON_TAP} nhóm ôn tập mỗi phiếu.`); return }
    try {
      const ds = await goiYOnTap(u.nhom)
      setChon((s) => [...s, { nhom: u.nhom, ten: u.ten, caus: ds }])
    } catch (e) { setLoi(loiDoc(e)) }
  }
  async function goiYOnTap(nhom: string) {
    const ds = await goiY(nhom, null, { _tong: SO_CAU_ON_TAP }, tru(nhom))
    await napCau(ds)
    return ds
  }
  // "↻ Gợi ý" theo số câu từng loại GV đặt (như builder): lấy câu ÍT DÙNG NHẤT, né câu của buổi + câu đang có ở nhóm này (để ra bộ khác).
  async function goiYLai(nhom: string, so: Record<string, number>) {
    setLoi(null)
    try {
      const cu = chon.find((c) => c.nhom === nhom)?.caus ?? []
      const ds = await goiY(nhom, null, so, [...tru(nhom), ...cu])
      await napCau(ds)
      setChon((s) => s.map((c) => c.nhom === nhom ? { ...c, caus: ds.length ? ds : c.caus } : c))
      if (!ds.length) setLoi('Nhóm này hết câu khác để gợi ý.')
    } catch (e) { setLoi(loiDoc(e)) }
  }
  const xoaCau = (nhom: string, m: string) => setChon((s) => s.map((c) => c.nhom === nhom ? { ...c, caus: c.caus.filter((x) => x !== m) } : c))
  async function datCau(nhom: string, ms: string[]) {
    await napCau(ms)
    setChon((s) => s.map((c) => c.nhom === nhom ? { ...c, caus: ms } : c))
  }
  async function xacNhan() {
    setBusy(true); setLoi(null)
    try {
      const phieu = coXc && buoi ? {
        ti_le: tiLe,
        nay: buoi.nhom.map((n) => ({ nhom: n.id, caus: cauNay(n) })).filter((n) => n.caus.length > 0),
        lui: lui.filter((k) => k.caus.length > 0).map((k) => ({ bac: k.bac, buoi: k.buoi, nhom: k.nhom, caus: k.caus })),
      } : undefined
      const doc = await trichBuoiBdm(masterId, buoiId, { lopId, ngay, khoi, tenLop, tenBuoi, loai: 'btvn', phieu, onTap: chon.filter((c) => c.caus.length > 0).map((c) => ({ nhom: c.nhom, caus: c.caus })) })
      useStore.getState().enqueueLinkGen(doc.id, doc.loai)
      for (const d of await renumberBuoiLop(lopId)) useStore.getState().enqueueLinkGen(d.id, d.loai)
      onDone()
    } catch (e) { setLoi(loiDoc(e)) } finally { setBusy(false) }
  }

  let bno = 0
  const item = (m: string) => {
    const c = cauMap.get(m)
    if (!c) return null
    bno += 1
    return { key: m, cols: 1, ...cauItemParts({ no: bno, c, gv, lines: gv ? 0 : DEFAULT_BTVN_LINES }) }
  }
  type Items = Parameters<typeof CauFlow>[0]['items']
  const nhomGoc = (buoi?.nhom ?? []).filter((n) => n.btvn?.caus.length)
  const nhomBtvn = nhomGoc.filter((n) => cauNay(n).length)
  const luiHien = lui.filter((k) => k.caus.length)
  const soNay = nhomGoc.flatMap(cauNay).length, soGoc = nhomGoc.flatMap((n) => n.btvn!.caus).length   // đếm cái đang hiện (UI)
  const tiLeKhoa = tiLe.join('-')

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
        <div>
          <p className="text-[15px] font-semibold text-slate-900">BTVN + Ôn tập · {tenLop} · {tenBuoi}</p>
          <p className="text-[12px] text-slate-400">{coXc ? 'Máy ghép sẵn bài của buổi này + bài luyện lại 2 buổi trước. Soát, bấm Xác nhận mới tạo phiếu BTVN của lớp.' : 'Chọn nhóm ôn tập, soi trước — bấm Xác nhận mới tạo phiếu BTVN của lớp.'}</p>
        </div>
        <button onClick={onClose} disabled={busy} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 overflow-hidden">
        <div className="min-h-0 overflow-auto border-r border-slate-200 bg-[#fafafb] p-5">
          {coXc && (
            <>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Bài của buổi này · {soNay}/{soGoc} câu</span>
                <span className="ml-auto flex gap-0.5 rounded-md bg-slate-100 p-0.5">
                  {TI_LE_XEP_CHONG.map((t) => (
                    <button key={t.nhan} disabled={dangXep || busy} onClick={() => xepLai(t.ti_le)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${t.ti_le.join('-') === tiLeKhoa ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>{t.nhan}</button>
                  ))}
                </span>
                <button disabled={dangXep || busy} onClick={() => xepLai(tiLe)} className="rounded-md border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-indigo-400" title="Bỏ các câu đã gạt, ghép lại theo tỉ lệ đang chọn">↺ Đặt lại</button>
              </div>
              <p className="mb-3 text-[12px] text-slate-400">Tỉ lệ = buổi này – buổi trước – buổi trước nữa. Phần còn lại của buổi này ({soGoc - soNay} câu) tự vào phiếu của 2 buổi kế tiếp. ✕ để bỏ một câu khỏi phiếu.</p>
              <div className="mb-5 space-y-1.5">
                {nhomGoc.map((n) => (
                  <div key={n.phan_id} className="rounded-lg border border-slate-200 bg-white">
                    <KhoiCau tieuDe={`Nhóm ${n.stt}: ${n.ten ?? ''} · ${cauNay(n).length}/${n.btvn!.caus.length} câu`} mau="orange" gon caus={cauNay(n)} cauMap={cauMap} cfg={CFG_TRONG} chiXem={false}
                      onXoa={(m) => setNay((s) => ({ ...s, [n.id]: (s[n.id] ?? []).filter((x) => x !== m) }))} />
                  </div>
                ))}
                {nhomGoc.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Buổi này chưa có câu BTVN nào ở giáo trình.</div>}
              </div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Luyện lại buổi trước · {cauLui.length} câu</div>
              <div className="mb-5 space-y-1.5">
                {lui.length === 0
                  ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Chưa có câu luyện lại — lớp chưa có buổi trước theo giáo trình bản đồ mới, hoặc bài của các buổi trước đã giao hết.</div>
                  : lui.map((k) => (
                    <div key={`${k.buoi}-${k.nhom}`} className="rounded-lg border border-slate-200 bg-white">
                      <KhoiCau tieuDe={`${k.bac === 1 ? 'Buổi trước' : 'Buổi trước nữa'} (${ngayNgan(k.ngay)}) · ${k.ten ?? k.nhom} · ${k.caus.length} câu`} mau="amber" gon caus={k.caus} cauMap={cauMap} cfg={CFG_TRONG} chiXem={false}
                        onXoa={(m) => setLui((s) => s.map((x) => x.buoi === k.buoi && x.nhom === k.nhom ? { ...x, caus: x.caus.filter((y) => y !== m) } : x))} />
                    </div>
                  ))}
              </div>
            </>
          )}
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Ôn tập thêm · chọn tối đa {CAP_NHOM_ON_TAP} nhóm {coXc ? 'cũ hơn hai buổi trước' : 'đã học ở buổi trước'}</div>
          <p className="mb-3 text-[12px] text-slate-400">{xepTheoMastery ? 'Xếp theo mức nắm HIỆN TẠI của lớp (mastery ET + MT): nhóm lớp đang yếu lên đầu, nhóm chưa đo ở giữa, nhóm đã đạt ở cuối.' : 'Chưa xếp được theo mức nắm của lớp — GV tự chọn nhóm.'} Mỗi nhóm máy đề xuất {SO_CAU_ON_TAP} câu (đổi số câu từng loại + ↻ Gợi ý, hoặc ✎ Chọn câu / ✕ như giáo trình). Không chọn = phiếu không có ôn tập thêm.</p>
          {ungVienHien.length === 0
            ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Không có nhóm nào ở các buổi trước (hoặc đều đã học lại ở buổi này / đã nằm trong phần luyện lại).</div>
            : <div className="space-y-1.5">
              {ungVienHien.map((u) => {
                const c = chon.find((x) => x.nhom === u.nhom)
                return (
                  <div key={u.nhom} className={`rounded-lg border bg-white px-3 py-2 ${c ? 'border-violet-300 ring-1 ring-violet-200' : 'border-slate-200'}`}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={!!c} onChange={() => batNhom(u)} />
                      <span className="min-w-0 flex-1 text-[13px] font-medium text-slate-800">{u.ten ?? u.nhom}</span>
                      {xepTheoMastery && (
                        u.diem == null
                          ? <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10.5px] text-slate-500" title="Lớp chưa có số đo cho nhóm này (không phải yếu)">chưa đo</span>
                          : <span className={`shrink-0 rounded px-1.5 text-[10.5px] font-semibold ${u.muc === 'yeu' ? 'bg-rose-100 text-rose-700' : u.muc === 'can_luyen' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}
                              title={`Điểm nắm TB ${u.diem.toFixed(2)} · ${u.so_hs_do}/${u.so_hs} em đã được đo`}>{u.pct_dat ?? 0}% đạt · {u.muc === 'yeu' ? 'yếu' : u.muc === 'can_luyen' ? 'cần luyện' : 'đạt'}</span>
                      )}
                      <span className="shrink-0 text-[11px] text-slate-400">{u.buoi}</span>
                    </label>
                    {c && (
                      <div className="mt-1.5 rounded-md border border-violet-100 bg-violet-50/30">
                        <KhoiCau tieuDe={`Ôn tập · ${c.caus.length} câu`} mau="sky" gon caus={c.caus} cauMap={cauMap} cfg={CFG_TRONG} chiXem={false} soMacDinh={SO_ON_TAP_MAC_DINH}
                          onXoa={(m) => xoaCau(u.nhom, m)}
                          onGoiY={(so) => goiYLai(u.nhom, so)}
                          onChonCau={() => setChonCau(u.nhom)} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>}
        </div>
        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Xem trước phiếu BTVN</span>
            <span className="ml-auto flex gap-0.5 rounded-md bg-slate-100 p-0.5">
              <button onClick={() => setGv(false)} className={`rounded px-2 py-0.5 text-[11px] font-medium ${!gv ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Bản học sinh</button>
              <button onClick={() => setGv(true)} className={`rounded px-2 py-0.5 text-[11px] font-medium ${gv ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Bản GV</button>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-5">
            <style>{CHROME_CSS}</style>
            <div className="mx-auto max-w-[640px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pv-bt-head"><div className="pv-bt-titlewrap"><div className="pv-bt-title">{tenBuoi}{gv ? ' · Đáp án' : ''}</div></div></div>
              {!buoi ? <p className="text-center text-[13px] text-slate-400">Đang tải…</p>
                : nhomBtvn.length === 0 && luiHien.length === 0 && chon.length === 0 ? <p className="text-center text-[13px] italic text-slate-400">Phiếu chưa có câu nào.</p>
                : null}
              {nhomBtvn.map((n) => (
                <div key={n.phan_id} className="pv-sec">
                  <h2 className="pv-h-dang">Nhóm {n.stt}: {n.ten ?? ''}</h2>
                  <CauFlow items={cauNay(n).map(item).filter(Boolean) as Items} />
                </div>
              ))}
              {luiHien.length > 0 && (
                <div className="pv-sec pv-ontap">
                  <h2 className="pv-h-ontap">LUYỆN LẠI BÀI BUỔI TRƯỚC</h2>
                  {luiHien.map((k) => (
                    <div key={`${k.buoi}-${k.nhom}`} className="pv-sec">
                      <h2 className="pv-h-dang">{k.ten ?? k.nhom}</h2>
                      <CauFlow items={k.caus.map(item).filter(Boolean) as Items} />
                    </div>
                  ))}
                </div>
              )}
              {chon.length > 0 && (
                <div className="pv-sec pv-ontap">
                  <h2 className="pv-h-ontap">PHẦN ÔN TẬP</h2>
                  {chon.map((c) => (
                    <div key={c.nhom} className="pv-sec">
                      <h2 className="pv-h-dang">{c.ten ?? c.nhom}</h2>
                      <CauFlow items={c.caus.map(item).filter(Boolean) as Items} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {chonCau && (() => {
        const hien = chon.find((c) => c.nhom === chonCau)
        return hien ? (
          <ChonCauBdm tl={tl} nhomId={chonCau} uuTien={null} selected={hien.caus} coKhoLop={false} macDinh="luyen"
            khoa={tru(chonCau).filter((m) => !hien.caus.includes(m))}
            onClose={() => setChonCau(null)}
            onConfirm={async (ms) => { await datCau(chonCau, ms); setChonCau(null) }} />
        ) : null
      })()}
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
        {loi && <span className="mr-auto text-[12.5px] text-rose-600">⚠ {loi}</span>}
        <button onClick={onClose} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 disabled:opacity-40">Huỷ</button>
        <button onClick={xacNhan} disabled={busy || dangXep || !buoi} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-500 disabled:opacity-40">{busy ? 'Đang tạo…' : '✓ Xác nhận · Tạo BTVN'}</button>
      </div>
    </div>
  )
}
