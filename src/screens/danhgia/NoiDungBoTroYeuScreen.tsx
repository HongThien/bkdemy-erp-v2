// Màn "Nội dung bổ trợ yếu" (bước 4 — PLAN-botro-yeu.md). Case đã mở (duyệt "Bổ trợ" xong ở
// Dashboard học tập) hiện ở đây để học thuật rà/chọn dạng cần bổ trợ TRƯỚC khi OPS xếp lịch.
// "Lưu cấu hình" = CHÍNH các dòng `bo_tro_yeu_dang` — KHÔNG sinh tài liệu ở bước này (PLAN quyết
// định 08); tài liệu thật (câu, số lượng) sinh khi đã có ngày bổ trợ, ở bước xếp lịch.
import { useEffect, useState } from 'react'
import {
  listCaseDangMo, getDangCuaCase, themDangTayVaoCase, boDangKhoiCase,
  type CaseBoTroYeuItem, type DangCuaCase,
} from '../../lib/botro_yeu'
import { DangPicker } from '../tailieu/TaiLieuBuilder'
import { KHOI_OPTIONS } from '../../lib/kho/api'

const NGUON_TEN: Record<string, string> = {
  ai_de_xuat: 'Hệ thống đề xuất', thu_cong: 'Mở tay',
  chuong_do: '③ Chuông đỏ (TA báo động)', gv_tien_quyet: '④ GV báo hổng kiến thức nền',
}

export default function NoiDungBoTroYeuScreen() {
  const [items, setItems] = useState<CaseBoTroYeuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [moId, setMoId] = useState<string | null>(null)

  const reload = () => { setLoading(true); listCaseDangMo().then(setItems).finally(() => setLoading(false)) }
  useEffect(() => { reload() }, [])

  const moCase = items.find((c) => c.id === moId) ?? null

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Nội dung bổ trợ yếu</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Case đã duyệt "Bổ trợ" — chọn/rà dạng cần bổ trợ trước khi OPS xếp lịch.
          </p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            Chưa có case nào đang mở — duyệt "Bổ trợ" ở Dashboard học tập trước.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <button key={c.id} onClick={() => setMoId(c.id)}
                className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:ring-indigo-300">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-slate-800">
                      {c.ho_ten} <span className="font-normal text-slate-400">· {c.mon}{c.khoi ? ` · Khối ${c.khoi}` : ''}</span>
                    </div>
                    <div className="mt-0.5 text-[12px] text-slate-500">
                      {NGUON_TEN[c.nguon] ?? c.nguon}{c.ly_do ? ` — ${c.ly_do}` : ''}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${c.soDang > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {c.soDang > 0 ? `${c.soDang} dạng` : 'Chưa có dạng'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {moCase && <CaseDetail c={moCase} onDong={() => setMoId(null)} onDoi={reload} />}
    </section>
  )
}

function CaseDetail({ c, onDong, onDoi }: { c: CaseBoTroYeuItem; onDong: () => void; onDoi: () => void }) {
  const [dangs, setDangs] = useState<DangCuaCase[]>([])
  const [loading, setLoading] = useState(true)
  const [khoiPick, setKhoiPick] = useState(c.khoi ?? KHOI_OPTIONS[0])
  const [picker, setPicker] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  const reload = () => { setLoading(true); getDangCuaCase(c.id, c.mon).then(setDangs).finally(() => setLoading(false)) }
  useEffect(() => { reload() }, [c.id]) // eslint-disable-line

  async function xoa(d: DangCuaCase) {
    setLoi(null)
    try { await boDangKhoiCase(d.id); reload(); onDoi() }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function themXong(maDangs: string[]) {
    setPicker(false)
    if (maDangs.length) await themDangTayVaoCase(c.id, maDangs)
    reload(); onDoi()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div className="max-h-[85vh] w-[560px] max-w-full overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-[16px] font-bold text-slate-800">{c.ho_ten} · {c.mon}</h3>
          <button onClick={onDong} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <p className="mb-4 text-[12px] text-slate-500">{NGUON_TEN[c.nguon] ?? c.nguon}{c.ly_do ? ` — ${c.ly_do}` : ''}</p>

        {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : dangs.length === 0 ? (
          <p className="mb-4 text-[13px] text-slate-400">Chưa có dạng nào — thêm dạng bên dưới.</p>
        ) : (
          <ul className="mb-4 space-y-1.5">
            {dangs.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[13px]">
                <div>
                  <span className="font-medium text-slate-700">{d.ten_dang}</span>
                  <span className="ml-1.5 text-slate-400">· {d.ten_chuyen_de}</span>
                  {d.day_at && <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">đã dạy</span>}
                </div>
                <button onClick={() => xoa(d)} disabled={!!d.day_at}
                  title={d.day_at ? 'Đã dạy — không xoá được' : 'Bỏ dạng này'}
                  className="text-slate-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30">✕</button>
              </li>
            ))}
          </ul>
        )}
        {loi && <p className="mb-3 text-[12px] text-rose-600">{loi}</p>}

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
          <select value={khoiPick} onChange={(e) => setKhoiPick(e.target.value)}
            title="Khối để tìm dạng (chọn khối khác = kiến thức năm trước)"
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400">
            {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
          </select>
          <button onClick={() => setPicker(true)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">
            + Thêm dạng
          </button>
        </div>
        {khoiPick !== c.khoi && (
          <p className="mt-1.5 text-[11px] text-amber-600">
            Đang tìm ở khối khác khối hiện tại của HS ({c.khoi ?? '?'}) — dùng cho kiến thức năm trước.
          </p>
        )}
      </div>

      {picker && <DangPicker khoi={khoiPick} mon={c.mon} selected={[]} onClose={() => setPicker(false)} onConfirm={themXong} />}
    </div>
  )
}
