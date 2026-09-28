// ============================================================================
// HuyHieuScreen — màn NHÂN SỰ cho Huy hiệu (spec-huy-hieu-build.md §7, mig 202609281846).
// 3 tab: ① Trao bản cứng (việc suy động của GV chính lớp: ★4/★5 lần đầu TRỪ đã trao) · ② Chốt tháng (từ ngày 10 tháng sau,
// theo thứ tự) · ③ Ma trận thành tựu × huy hiệu (tích ô = ghi bảng nối N–N). Tính toán ở DB — màn chỉ gọi + hiển thị.
// Sau "Đã trao" VÁ TẠI CHỖ (bỏ dòng đó), không tải lại cả danh sách (CLAUDE.md §2 React).
// ============================================================================
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  viecTraoCuaToi, daTrao, chotHuyHieuThang, thangDaChot, maTran, datOMaTran,
  type ViecTrao, type ThangChot, type ThanhTuu, type HuyHieu, type DieuKien,
} from '../../lib/huyhieu'

const MON = 'Toán'   // phase 1 chỉ Toán (spec §0) — môn khác bật bằng dữ liệu, màn giữ nguyên
const nhanThang = (ym: string) => `Tháng ${Number(ym.slice(5))}/${ym.slice(0, 4)}`

function TabTrao() {
  const [rows, setRows] = useState<ViecTrao[] | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [dang, setDang] = useState<string | null>(null)
  useEffect(() => { viecTraoCuaToi().then(setRows).catch((e) => { setRows([]); setMsg('Lỗi tải: ' + (e?.message ?? e)) }) }, [])
  const onTrao = async (r: ViecTrao) => {
    setDang(r.dat_id); setMsg(null)
    try { await daTrao(r.dat_id); setRows((prev) => (prev ?? []).filter((x) => x.dat_id !== r.dat_id)); setMsg(`✓ Đã trao ${r.huy_hieu} ${'★'.repeat(r.sao)} cho ${r.ho_ten}`) }
    catch (e: any) { setMsg('Lỗi: ' + (e?.message ?? e)) } finally { setDang(null) }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">Học sinh lớp thầy/cô vừa đạt huy hiệu <b>★4 / ★5</b> — trung tâm có <b>bản cứng</b> để trao tận tay. Trao xong bấm "Đã trao".</p>
      {msg && <p className="text-sm font-medium text-slate-700">{msg}</p>}
      {rows === null ? <p className="text-sm text-slate-500">Đang tải…</p>
        : rows.length === 0 ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Không có huy hiệu nào chờ trao.</p>
        : (
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Học sinh</th><th>Lớp</th><th>Huy hiệu</th><th>Đạt lúc</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.dat_id} className="border-b last:border-0">
                  <td className="py-2 font-medium text-slate-900">{r.ho_ten} <span className="text-slate-400">{r.ma_hs}</span></td>
                  <td>{r.ten_lop}</td>
                  <td>{r.bieu_tuong} {r.huy_hieu} <span className="text-amber-500">{'★'.repeat(r.sao)}</span></td>
                  <td className="text-slate-500">{new Date(r.dat_at).toLocaleDateString('vi-VN')}</td>
                  <td className="text-right">
                    <button onClick={() => onTrao(r)} disabled={dang === r.dat_id} className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white disabled:bg-slate-300">
                      {dang === r.dat_id ? 'Đang lưu…' : 'Đã trao'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  )
}

function TabChot() {
  const [mua, setMua] = useState<{ thang_dau: string; hh_thang_cuoi: string } | null>(null)
  const [chot, setChot] = useState<ThangChot[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const tai = () => thangDaChot(MON).then(setChot).catch((e) => setMsg('Lỗi tải: ' + (e?.message ?? e)))
  useEffect(() => {
    supabase.from('gami_mua').select('thang_dau, hh_thang_cuoi').order('thang_dau', { ascending: false }).limit(1)
      .then(({ data }) => setMua((data?.[0] as any) ?? null))
    tai()
  }, [])
  const thangs: string[] = []
  if (mua) { let [y, m] = mua.thang_dau.split('-').map(Number); for (;;) { const ym = `${y}-${String(m).padStart(2, '0')}`; if (ym > mua.hh_thang_cuoi) break; thangs.push(ym); if (++m > 12) { m = 1; y++ } } }
  const daChot = new Map((chot ?? []).map((c) => [c.thang, c]))
  const ke = thangs.find((t) => !daChot.has(t))
  const onChot = async (ym: string) => {
    setBusy(true); setMsg(null)
    try { const kq = await chotHuyHieuThang(MON, ym); setMsg(`✓ ${nhanThang(ym)}: ${kq.dong_thanh_tuu} dòng thành tựu · ${kq.sao_moi} sao mới`); await tai() }
    catch (e: any) { setMsg('Không chốt được: ' + (e?.message ?? e)) } finally { setBusy(false) }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">Chốt tháng T <b>từ ngày 10 tháng sau</b> (chờ MT), theo thứ tự. Đã chốt thì không thu hồi. Năm huy hiệu: tháng 7 → 4.</p>
      {msg && <p className="text-sm font-medium text-slate-700">{msg}</p>}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {thangs.map((t) => {
          const c = daChot.get(t)
          return (
            <div key={t} className={`rounded-lg border p-3 text-sm ${c ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
              <div className="font-semibold text-slate-900">{nhanThang(t)}</div>
              {c ? <div className="mt-1 text-xs text-emerald-700">✓ {c.so_em} em · {c.sao_moi} sao mới</div>
                : t === ke ? (
                  <button onClick={() => onChot(t)} disabled={busy} className="mt-2 h-8 w-full rounded-lg bg-indigo-600 text-xs font-semibold text-white disabled:bg-slate-300">
                    {busy ? 'Đang chốt…' : 'Chốt tháng này'}
                  </button>
                ) : <div className="mt-1 text-xs text-slate-400">Chưa chốt</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TabMaTran() {
  const [d, setD] = useState<{ tt: ThanhTuu[]; hh: HuyHieu[]; dk: DieuKien[] } | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => { maTran(MON).then(setD).catch((e) => setMsg('Lỗi tải: ' + (e?.message ?? e))) }, [])
  if (!d) return <p className="text-sm text-slate-500">{msg ?? 'Đang tải…'}</p>
  const vaiCua = (hh: string, tt: string) => d.dk.find((x) => x.huy_hieu_key === hh && x.thanh_tuu_key === tt)?.vai ?? null
  const onO = async (hh: string, tt: string) => {
    const cu = vaiCua(hh, tt)
    const moi: 'chuan' | 'them' | null = cu === null ? 'chuan' : cu === 'chuan' ? 'them' : null
    setMsg(null)
    try {
      await datOMaTran(MON, hh, tt, moi)
      setD((p) => p && ({ ...p, dk: [...p.dk.filter((x) => !(x.huy_hieu_key === hh && x.thanh_tuu_key === tt)), ...(moi ? [{ huy_hieu_key: hh, thanh_tuu_key: tt, vai: moi }] : [])] }))
    } catch (e: any) { setMsg('Lỗi lưu: ' + (e?.message ?? e)) }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">
        Bấm ô để đổi: trống → <b className="text-indigo-700">★1–5</b> (điều kiện chuẩn) → <b className="text-amber-700">★4–5</b> (điều kiện thêm cho tháng hoàn hảo) → trống.
        Đổi ở đây áp cho các lần chốt SAU; sao đã trao không mất.
      </p>
      {msg && <p className="text-sm text-rose-600">{msg}</p>}
      <div className="overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="px-2 py-2 text-left">Thành tựu (điều kiện 1 tháng)</th>
              <th className="px-2 text-center">Số huy hiệu dùng</th>
              {d.hh.map((h) => <th key={h.key} className="px-2 text-center" title={h.ghi_nhan}>{h.bieu_tuong}<br />{h.ten}</th>)}
            </tr>
          </thead>
          <tbody>
            {d.tt.map((t) => (
              <tr key={t.key} className="border-b last:border-0">
                <td className="px-2 py-1.5"><b>{t.key}</b> · {t.ten}{t.mo_tu && <span className="ml-1 text-xs text-slate-400">(từ {t.mo_tu.split('-').reverse().join('/')})</span>}</td>
                <td className="px-2 text-center text-slate-500">{d.dk.filter((x) => x.thanh_tuu_key === t.key).length}</td>
                {d.hh.map((h) => {
                  const v = vaiCua(h.key, t.key)
                  return (
                    <td key={h.key} className="px-1 text-center">
                      <button onClick={() => onO(h.key, t.key)}
                        className={`h-7 w-16 rounded text-xs font-semibold ${v === 'chuan' ? 'bg-indigo-100 text-indigo-700' : v === 'them' ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}>
                        {v === 'chuan' ? '★1–5' : v === 'them' ? '★4–5' : '·'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function HuyHieuScreen() {
  const [tab, setTab] = useState<'trao' | 'chot' | 'ma_tran'>('trao')
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900">Huy hiệu · {MON}</h1>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {([['trao', 'Trao bản cứng'], ['chot', 'Chốt tháng'], ['ma_tran', 'Ma trận']] as const).map(([k, t]) => (
            <button key={k} onClick={() => setTab(k)} className={`h-8 rounded-md px-3 text-sm font-medium ${tab === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>
      {tab === 'trao' ? <TabTrao /> : tab === 'chot' ? <TabChot /> : <TabMaTran />}
    </section>
  )
}
