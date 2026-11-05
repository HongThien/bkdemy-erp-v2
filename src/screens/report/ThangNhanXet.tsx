// THANG NHẬN XÉT của báo cáo học kì (spec-bao-cao-ky.md §D, Thùy chốt 05/11).
// 4 mục to · mục nhỏ · 3 mức Tốt/Ổn/Chưa tốt, mỗi mức nhiều LOẠI (1 câu cho PH) + "Chưa đủ quan sát".
// 🤖 gợi ý mức (fn_bc_ky_tinh → goi_y) chỉ để GV duyệt. Danh mục sửa thẳng ở đây (chỉ admin — RLS chặn người khác).
import { useEffect, useState } from 'react'
import {
  getDanhMucNx, laAdminBcKy, themNxMuc, suaNxMuc, themNxLuaChon, suaNxLuaChon, themKhMau, suaKhMau, boVaoKhoRac,
  type DanhMucNx, type NxMuc, type KhMau, type MucDo, type MucDoChon, type NxChon, type BcKyGoiY, type BcKyNxTo,
} from '../../lib/baoCaoKy'

export const NHAN_MUC: Record<MucDoChon, string> = { tot: 'Tốt', on: 'Ổn', chua_tot: 'Chưa tốt', chua_du: 'Chưa đủ quan sát' }
export const MAU_MUC: Record<MucDoChon, string> = {
  tot: 'bg-emerald-600 text-white', on: 'bg-amber-500 text-white', chua_tot: 'bg-rose-600 text-white', chua_du: 'bg-slate-300 text-slate-700',
}
const MUC_DO: MucDo[] = ['tot', 'on', 'chua_tot']
const so2 = (v: number | null | undefined) => v == null ? '—' : Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })

// ── Danh mục: nạp 1 lần, sống tới F5 (đổi HS không nạp lại); màn sửa vá thẳng vào đây ──
let DM: DanhMucNx | null = null
const NGHE = new Set<(d: DanhMucNx) => void>()
function datDm(d: DanhMucNx) { DM = d; NGHE.forEach((f) => f(d)) }
export function useDanhMucNx(): DanhMucNx | null {
  const [d, setD] = useState<DanhMucNx | null>(DM)
  useEffect(() => {
    NGHE.add(setD)
    if (!DM) getDanhMucNx().then(datDm).catch(() => {})
    return () => { NGHE.delete(setD) }
  }, [])
  return d
}
const mucTo = (dm: DanhMucNx) => dm.muc.filter((m) => !m.cha)
const mucCon = (dm: DanhMucNx, cha: string) => dm.muc.filter((m) => m.cha === cha)
export const mucNhoDangDung = (dm: DanhMucNx) => { const to = new Set(mucTo(dm).map((m) => m.ma)); return dm.muc.filter((m) => m.cha && to.has(m.cha)) }

// Dựng phần nhận xét / kế hoạch để VÁ bản xem trước ngay sau khi GV chọn (chỉ ghép chữ từ danh mục — số liệu không đụng).
export function dungNhanXetChon(dm: DanhMucNx, nx: NxChon): BcKyNxTo[] {
  return mucTo(dm).map((t) => ({
    ma: t.ma, ten: t.ten,
    con: mucCon(dm, t.ma).filter((m) => nx[m.ma]).map((m) => ({
      ma: m.ma, ten: m.ten, muc_do: nx[m.ma].muc_do, noi_dung: dm.lc.find((l) => l.ma === nx[m.ma].lc)?.noi_dung ?? null,
    })),
  })).filter((t) => t.con.length > 0)
}
export const dungKeHoachChon = (dm: DanhMucNx, kh: string[]) => kh.map((ma) => dm.kh.find((k) => k.ma === ma)?.noi_dung).filter((x): x is string => !!x)

// Số liệu đứng sau gợi ý 🤖 (hiển thị cho GV)
function moTaGoiY(m: NxMuc, g: BcKyGoiY | undefined): string | null {
  const x = g?.muc?.[m.ma]; if (!x) return null
  const s = x.so ?? {}
  if (m.goi_y === 'btvn') return Number(s.mau) ? `Đạt chuẩn ${s.dat}/${s.mau} buổi (${Math.round((100 * Number(s.dat)) / Number(s.mau))}%)` : 'Chưa có buổi BTVN ghi nhận'
  if (m.goi_y === 'can_than') return Number(s.so_lan) >= 2 ? `Sai số ± ${so2(Number(s.sai_so))}${s.tu_gv ? '' : ' (gợi ý)'}` : 'Dưới 2 lần thi — tự chọn'
  if (m.goi_y === 'tien_bo_diem') return Number(s.so_lan) >= 2
    ? `${s.top ? 'Luôn trong top 20% · ' : ''}Chênh so TB khối ${Number(s.tang) >= 0 ? 'tăng' : 'giảm'} ${so2(Math.abs(Number(s.tang)))} (nửa sau so nửa đầu kì)`
    : 'Dưới 2 lần thi — tự chọn'
  return null
}

// ── GV chọn nhận xét ──
export function NhapNhanXet({ dm, nx, goiY, khoa, onDoi }: {
  dm: DanhMucNx; nx: NxChon; goiY?: BcKyGoiY; khoa: boolean; onDoi: (nx: NxChon) => void
}) {
  function chonMuc(m: NxMuc, md: MucDoChon) {
    if (md === 'chua_du') return onDoi({ ...nx, [m.ma]: { muc_do: md, lc: null } })
    const ds = dm.lc.filter((l) => l.muc_ma === m.ma && l.muc_do === md)
    const k = goiY?.muc?.[m.ma]?.khoa
    const lc = (nx[m.ma]?.muc_do === md && ds.find((l) => l.ma === nx[m.ma].lc)) || (k && ds.find((l) => l.khoa_goi_y === k)) || ds[0]
    onDoi({ ...nx, [m.ma]: { muc_do: md, lc: lc?.ma ?? null } })
  }
  return (
    // mục to = 1 thẻ (header màu + thân trắng); khung cha có @container ⇒ ≥880px 4 cột (laptop 1366 vừa 1 màn), ≥640px 2 cột, hẹp 1 cột
    <div className="grid items-start gap-3 @min-[640px]:grid-cols-2 @min-[880px]:grid-cols-4">
      {mucTo(dm).map((t) => (
        <div key={t.ma} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-indigo-600 px-3 py-2 text-[13px] font-bold text-white">{t.ten}</div>
          <div className="space-y-2 p-2.5">
            {mucCon(dm, t.ma).map((m) => {
              const c = nx[m.ma], g = goiY?.muc?.[m.ma], mt = moTaGoiY(m, goiY)
              const ds = c && c.muc_do !== 'chua_du' ? dm.lc.filter((l) => l.muc_ma === m.ma && l.muc_do === c.muc_do) : []
              const lech = !!(c && g?.muc_do && c.muc_do !== 'chua_du' && c.muc_do !== g.muc_do)
              return (
                <div key={m.ma} className={`rounded-lg border px-2.5 py-2 ${c ? 'border-slate-200' : 'border-dashed border-amber-300 bg-amber-50/40'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-slate-700">{m.ten}</span>
                    {m.goi_y && g?.muc_do && (
                      <button disabled={khoa} onClick={() => chonMuc(m, g.muc_do!)} title="Dùng mức hệ thống gợi ý"
                        className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60">🤖 {NHAN_MUC[g.muc_do]}</button>
                    )}
                  </div>
                  {mt && <div className="text-[11px] text-slate-500">{mt}</div>}
                  <div className="mt-1.5 flex gap-1">
                    {(['tot', 'on', 'chua_tot', 'chua_du'] as MucDoChon[]).map((md) => (
                      <button key={md} disabled={khoa} onClick={() => chonMuc(m, md)}
                        title={NHAN_MUC[md]} className={`flex-auto whitespace-nowrap rounded-md px-1 py-1 text-[11.5px] font-semibold ${c?.muc_do === md ? MAU_MUC[md] : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} disabled:cursor-default`}>
                        {md === 'chua_du' ? 'Chưa QS' : NHAN_MUC[md]}
                      </button>
                    ))}
                  </div>
                  {ds.length > 1 && (
                    <div className="mt-1.5 space-y-1">
                      {ds.map((l) => (
                        <label key={l.ma} className={`flex cursor-pointer items-start gap-1.5 rounded px-1 py-0.5 text-[12px] leading-snug ${c?.lc === l.ma ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>
                          <input type="radio" disabled={khoa} checked={c?.lc === l.ma} onChange={() => onDoi({ ...nx, [m.ma]: { muc_do: c!.muc_do, lc: l.ma } })} className="mt-0.5" />
                          {l.noi_dung}
                        </label>
                      ))}
                    </div>
                  )}
                  {ds.length === 1 && <div className="mt-1.5 text-[12px] leading-snug text-slate-700">{ds[0].noi_dung}</div>}
                  {c && c.muc_do !== 'chua_du' && ds.length === 0 && <div className="mt-1.5 text-[11px] text-rose-600">Mức này chưa có câu nhận xét — thêm ở ⚙ Thang nhận xét.</div>}
                  {lech && <div className="mt-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">Khác gợi ý từ số liệu ({NHAN_MUC[g!.muc_do!]}) — xem lại.</div>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── GV chọn kế hoạch cải thiện: phương án của mục chấm Chưa tốt / Ổn lên đầu ──
export function NhapKeHoach({ dm, nx, kh, khoa, onDoi }: { dm: DanhMucNx; nx: NxChon; kh: string[]; khoa: boolean; onDoi: (kh: string[]) => void }) {
  const [tatCa, setTatCa] = useState(false)
  const uu = (k: KhMau) => { const md = k.muc_ma ? nx[k.muc_ma]?.muc_do : undefined; return md === 'chua_tot' ? 0 : md === 'on' ? 1 : 2 }
  const ten = (k: KhMau) => dm.muc.find((m) => m.ma === k.muc_ma)?.ten ?? 'Chung'
  const ds = [...dm.kh].sort((a, b) => uu(a) - uu(b))
  const hien = tatCa ? ds : ds.filter((k) => uu(k) < 2 || kh.includes(k.ma))
  return (
    <div className="space-y-1">
      {hien.length === 0 && <p className="text-[12px] text-slate-400">Chưa có mục nào chấm Ổn / Chưa tốt — bấm "Xem tất cả" để chọn.</p>}
      {hien.map((k) => (
        <label key={k.ma} className={`flex cursor-pointer items-start gap-1.5 rounded px-1 py-0.5 text-[12px] leading-snug ${kh.includes(k.ma) ? 'bg-emerald-50 text-slate-800' : 'text-slate-600'}`}>
          <input type="checkbox" disabled={khoa} checked={kh.includes(k.ma)} className="mt-0.5"
            onChange={(e) => onDoi(e.target.checked ? [...kh, k.ma] : kh.filter((x) => x !== k.ma))} />
          <span><b className="mr-1 text-[10.5px] font-semibold text-slate-400">{ten(k)}</b>{k.noi_dung}</span>
        </label>
      ))}
      <button onClick={() => setTatCa((v) => !v)} className="text-[11.5px] font-semibold text-indigo-600 hover:underline">{tatCa ? 'Thu gọn' : `Xem tất cả (${dm.kh.length})`}</button>
    </div>
  )
}

// ── Màn SỬA THANG (admin) ──
export function NutThangNhanXet() {
  const [mo, setMo] = useState(false)
  return (
    <>
      <button onClick={() => setMo(true)} className="h-7 rounded-md px-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100" title="Mục, mức, câu nhận xét, ngưỡng gợi ý, phương án kế hoạch">⚙ Thang nhận xét</button>
      {mo && <SuaThang onDong={() => setMo(false)} />}
    </>
  )
}

function SuaThang({ onDong }: { onDong: () => void }) {
  const dm = useDanhMucNx()
  const [admin, setAdmin] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [daLuu, setDaLuu] = useState(false)
  useEffect(() => { laAdminBcKy().then(setAdmin) }, [])
  if (!dm) return null
  async function chay(fn: () => Promise<DanhMucNx>) {
    setLoi(null)
    try { datDm(await fn()); setDaLuu(true); setTimeout(() => setDaLuu(false), 1500) } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  const maxTT = (a: { thu_tu: number }[]) => a.reduce((x, y) => Math.max(x, y.thu_tu), 0) + 1
  const d = dm
  const vaMuc = (ma: string, p: Partial<NxMuc>) => ({ ...d, muc: d.muc.map((m) => m.ma === ma ? { ...m, ...p } : m) })
  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-slate-900/40 px-4 pb-4 pt-14" onClick={onDong}>
      <div className="h-fit w-full max-w-5xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center gap-3 rounded-t-2xl border-b border-slate-200 bg-white px-5 py-3">
          <h2 className="text-[16px] font-bold text-slate-800">Thang nhận xét — báo cáo học kì</h2>
          {!admin && <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Chỉ xem — admin mới sửa được</span>}
          {daLuu && <span className="text-[12px] text-emerald-600">Đã lưu</span>}
          {loi && <span className="text-[12px] text-rose-600">{loi}</span>}
          <button onClick={onDong} className="ml-auto rounded-md px-3 py-1 text-[13px] text-slate-500 hover:bg-slate-100">Đóng</button>
        </div>
        <div className="space-y-6 px-5 py-4">
          {mucTo(d).map((t) => (
            <section key={t.ma} className="rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-indigo-50/50 px-3 py-2">
                <OChu gia={t.ten} sua={admin} cls="text-[15px] font-bold text-indigo-800" onLuu={(v) => chay(async () => { await suaNxMuc(t.ma, { ten: v }); return vaMuc(t.ma, { ten: v }) })} />
                <span className="text-[10px] text-slate-400">{t.ma}</span>
                {admin && <NutBo onBo={() => chay(async () => { await boVaoKhoRac('bc_ky_nx_muc', t.ma); return { ...d, muc: d.muc.filter((m) => m.ma !== t.ma) } })} />}
              </div>
              <div className="divide-y divide-slate-100">
                {mucCon(d, t.ma).map((m) => (
                  <div key={m.ma} className="px-3 py-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <OChu gia={m.ten} sua={admin} cls="text-[14px] font-semibold text-slate-800" onLuu={(v) => chay(async () => { await suaNxMuc(m.ma, { ten: v }); return vaMuc(m.ma, { ten: v }) })} />
                      <span className="text-[10px] text-slate-400">{m.ma}</span>
                      {m.goi_y && <NguongGoiY m={m} sua={admin} onLuu={(p) => chay(async () => { await suaNxMuc(m.ma, p); return vaMuc(m.ma, p) })} />}
                      {admin && <NutBo onBo={() => chay(async () => { await boVaoKhoRac('bc_ky_nx_muc', m.ma); return { ...d, muc: d.muc.filter((x) => x.ma !== m.ma) } })} />}
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {MUC_DO.map((md) => {
                        const ds = d.lc.filter((l) => l.muc_ma === m.ma && l.muc_do === md)
                        return (
                          <div key={md}>
                            <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${MAU_MUC[md]}`}>{NHAN_MUC[md]}</span>
                            <div className="mt-1 space-y-1">
                              {ds.map((l) => <DongSua key={l.ma} gia={l.noi_dung} sua={admin}
                                onLuu={(v) => chay(async () => { await suaNxLuaChon(l.ma, { noi_dung: v }); return { ...d, lc: d.lc.map((x) => x.ma === l.ma ? { ...x, noi_dung: v } : x) } })}
                                onBo={() => chay(async () => { await boVaoKhoRac('bc_ky_nx_lua_chon', l.ma); return { ...d, lc: d.lc.filter((x) => x.ma !== l.ma) } })} />)}
                              {admin && <OThem goi="+ câu nhận xét" onThem={(v) => chay(async () => { const n = await themNxLuaChon({ muc_ma: m.ma, muc_do: md, noi_dung: v, thu_tu: maxTT(ds) }); return { ...d, lc: [...d.lc, n] } })} />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-2 rounded-lg bg-emerald-50/50 px-2 py-1.5">
                      <div className="text-[11px] font-bold uppercase text-emerald-700">Phương án kế hoạch cải thiện</div>
                      {(() => { const ds = d.kh.filter((k) => k.muc_ma === m.ma); return <>
                        {ds.map((k) => <DongSua key={k.ma} gia={k.noi_dung} sua={admin}
                          onLuu={(v) => chay(async () => { await suaKhMau(k.ma, { noi_dung: v }); return { ...d, kh: d.kh.map((x) => x.ma === k.ma ? { ...x, noi_dung: v } : x) } })}
                          onBo={() => chay(async () => { await boVaoKhoRac('bc_ky_kh_mau', k.ma); return { ...d, kh: d.kh.filter((x) => x.ma !== k.ma) } })} />)}
                        {admin && <OThem goi="+ phương án" onThem={(v) => chay(async () => { const n = await themKhMau({ muc_ma: m.ma, noi_dung: v, thu_tu: maxTT(ds) }); return { ...d, kh: [...d.kh, n] } })} />}
                      </> })()}
                    </div>
                  </div>
                ))}
                {admin && <div className="px-3 py-2"><OThem goi="+ mục nhỏ" onThem={(v) => chay(async () => { const n = await themNxMuc({ cha: t.ma, ten: v, thu_tu: maxTT(mucCon(d, t.ma)) }); return { ...d, muc: [...d.muc, { ...n, nguong_tot: null, nguong_chua_tot: null }] } })} /></div>}
              </div>
            </section>
          ))}
          {admin && <OThem goi="+ mục to" onThem={(v) => chay(async () => { const n = await themNxMuc({ cha: null, ten: v, thu_tu: maxTT(mucTo(d)) }); return { ...d, muc: [...d.muc, { ...n, nguong_tot: null, nguong_chua_tot: null }] } })} />}
          {(() => { const ds = d.kh.filter((k) => !k.muc_ma); return (ds.length > 0 || admin) && (
            <section className="rounded-xl border border-slate-200 px-3 py-2">
              <div className="text-[12px] font-bold uppercase text-emerald-700">Phương án chung (không gắn mục)</div>
              {ds.map((k) => <DongSua key={k.ma} gia={k.noi_dung} sua={admin}
                onLuu={(v) => chay(async () => { await suaKhMau(k.ma, { noi_dung: v }); return { ...d, kh: d.kh.map((x) => x.ma === k.ma ? { ...x, noi_dung: v } : x) } })}
                onBo={() => chay(async () => { await boVaoKhoRac('bc_ky_kh_mau', k.ma); return { ...d, kh: d.kh.filter((x) => x.ma !== k.ma) } })} />)}
              {admin && <OThem goi="+ phương án chung" onThem={(v) => chay(async () => { const n = await themKhMau({ muc_ma: null, noi_dung: v, thu_tu: maxTT(ds) }); return { ...d, kh: [...d.kh, n] } })} />}
            </section>) })()}
          <p className="text-[11.5px] text-slate-400">Xoá = cất vào kho rác: báo cáo đã công bố vẫn giữ nguyên chữ; báo cáo nháp đang chọn câu bị xoá sẽ phải chọn lại.</p>
        </div>
      </div>
    </div>
  )
}

function NguongGoiY({ m, sua, onLuu }: { m: NxMuc; sua: boolean; onLuu: (p: Pick<NxMuc, 'nguong_tot' | 'nguong_chua_tot'>) => void }) {
  const [t, setT] = useState(String(m.nguong_tot ?? '')); const [c, setC] = useState(String(m.nguong_chua_tot ?? ''))
  const nhan = m.goi_y === 'btvn' ? ['% đạt chuẩn ≥', '% đạt chuẩn <'] : m.goi_y === 'can_than' ? ['sai số ≤', 'sai số ≥'] : ['chênh tăng ≥', 'chênh tăng ≤']
  const luu = () => { const a = Number(t.replace(',', '.')), b = Number(c.replace(',', '.')); if (Number.isFinite(a) && Number.isFinite(b) && (a !== m.nguong_tot || b !== m.nguong_chua_tot)) onLuu({ nguong_tot: a, nguong_chua_tot: b }) }
  const o = 'h-6 w-14 rounded border border-slate-200 px-1 text-[12px] disabled:bg-transparent disabled:border-transparent'
  return (
    <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
      🤖 Tốt khi {nhan[0]} <input className={o} disabled={!sua} value={t} onChange={(e) => setT(e.target.value)} onBlur={luu} />
      · Chưa tốt khi {nhan[1]} <input className={o} disabled={!sua} value={c} onChange={(e) => setC(e.target.value)} onBlur={luu} />
    </span>
  )
}
function OChu({ gia, sua, cls, onLuu }: { gia: string; sua: boolean; cls: string; onLuu: (v: string) => void }) {
  const [v, setV] = useState(gia)
  useEffect(() => setV(gia), [gia])
  if (!sua) return <span className={cls}>{gia}</span>
  return <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { const x = v.trim(); if (x && x !== gia) onLuu(x); else setV(gia) }}
    className={`${cls} rounded border border-transparent bg-transparent px-1 hover:border-slate-200 focus:border-indigo-300 focus:bg-white`} />
}
function DongSua({ gia, sua, onLuu, onBo }: { gia: string; sua: boolean; onLuu: (v: string) => void; onBo: () => void }) {
  const [v, setV] = useState(gia)
  useEffect(() => setV(gia), [gia])
  if (!sua) return <div className="rounded px-1 py-0.5 text-[12.5px] leading-snug text-slate-700">{gia}</div>
  return (
    <div className="group flex items-start gap-1">
      <textarea value={v} rows={2} onChange={(e) => setV(e.target.value)} onBlur={() => { const x = v.trim(); if (x && x !== gia) onLuu(x); else setV(gia) }}
        className="min-w-0 flex-1 resize-y rounded border border-slate-200 px-1.5 py-1 text-[12.5px] leading-snug text-slate-700 focus:border-indigo-300" />
      <NutBo onBo={onBo} />
    </div>
  )
}
function NutBo({ onBo }: { onBo: () => void }) {
  const [hoi, setHoi] = useState(false)
  return hoi
    ? <span className="flex shrink-0 gap-1 text-[11px]"><button onClick={() => { setHoi(false); onBo() }} className="rounded bg-rose-600 px-1.5 py-0.5 font-semibold text-white">Xoá</button><button onClick={() => setHoi(false)} className="rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-100">Thôi</button></span>
    : <button onClick={() => setHoi(true)} title="Xoá (cất vào kho rác)" className="shrink-0 rounded px-1 text-[13px] text-slate-300 hover:bg-rose-50 hover:text-rose-600">✕</button>
}
function OThem({ goi, onThem }: { goi: string; onThem: (v: string) => void }) {
  const [mo, setMo] = useState(false); const [v, setV] = useState('')
  if (!mo) return <button onClick={() => setMo(true)} className="text-[12px] font-semibold text-indigo-600 hover:underline">{goi}</button>
  return (
    <div className="flex items-start gap-1">
      <textarea autoFocus value={v} rows={2} onChange={(e) => setV(e.target.value)} className="min-w-0 flex-1 rounded border border-indigo-300 px-1.5 py-1 text-[12.5px]" />
      <button disabled={!v.trim()} onClick={() => { onThem(v.trim()); setV(''); setMo(false) }} className="rounded bg-indigo-600 px-2 py-1 text-[12px] font-semibold text-white disabled:opacity-40">Thêm</button>
      <button onClick={() => { setV(''); setMo(false) }} className="rounded px-2 py-1 text-[12px] text-slate-500 hover:bg-slate-100">Huỷ</button>
    </div>
  )
}
