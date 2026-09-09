// Màn "Nội dung bổ trợ yếu" (bước 4 — PLAN-botro-yeu.md). Case đã mở (duyệt "Bổ trợ" xong ở
// Dashboard học tập) hiện ở đây để học thuật rà/chọn dạng cần bổ trợ TRƯỚC khi OPS xếp lịch.
// "Lưu cấu hình" = CHÍNH các dòng `bo_tro_yeu_dang` — KHÔNG sinh tài liệu ở bước này (PLAN quyết
// định 08); tài liệu thật (câu, số lượng) sinh khi đã có ngày bổ trợ, ở bước xếp lịch.
import { useEffect, useState } from 'react'
import {
  listCaseDangMo, getDangCuaCase, themDangTayVaoCase, boDangKhoiCase, getDangYeuGoiY,
  type CaseBoTroYeuItem, type DangCuaCase, type DangGoiY,
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
  // 2 đường thêm dạng (Thùy 09-02): 'yeu' = popup CHỈ dạng em đang yếu/cần luyện (mặc định, nút chính) ·
  // 'ban_do' = toàn bản đồ theo khối (đường phụ — kiến thức năm trước / dạng chưa đo, PLAN mục 4).
  const [picker, setPicker] = useState<null | 'yeu' | 'ban_do'>(null)
  const [loi, setLoi] = useState<string | null>(null)

  const reload = () => { setLoading(true); getDangCuaCase(c.id, c.mon).then(setDangs).finally(() => setLoading(false)) }
  useEffect(() => { reload() }, [c.id]) // eslint-disable-line

  async function xoa(d: DangCuaCase) {
    setLoi(null)
    try { await boDangKhoiCase(d.id); reload(); onDoi() }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function themXong(maDangs: string[]) {
    setPicker(null); setLoi(null)
    try {
      if (maDangs.length) await themDangTayVaoCase(c.id, maDangs)
      reload(); onDoi()
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
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
          <button onClick={() => setPicker('yeu')}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">
            + Thêm dạng
          </button>
          <span className="text-[12px] text-slate-400">— chỉ hiện dạng em đang yếu / cần luyện</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-slate-500">
          <span>Kiến thức năm trước / dạng chưa đo:</span>
          <select value={khoiPick} onChange={(e) => setKhoiPick(e.target.value)}
            title="Khối để tìm dạng (chọn khối khác = kiến thức năm trước)"
            className="rounded-lg border border-slate-300 px-2 py-1 text-[12px] outline-none focus:border-indigo-400">
            {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
          </select>
          <button onClick={() => setPicker('ban_do')} className="font-medium text-indigo-600 hover:underline">
            Tìm trong toàn bản đồ…
          </button>
        </div>
        {khoiPick !== c.khoi && (
          <p className="mt-1.5 text-[11px] text-amber-600">
            Đang tìm ở khối khác khối hiện tại của HS ({c.khoi ?? '?'}) — dùng cho kiến thức năm trước.
          </p>
        )}
      </div>

      {picker === 'yeu' && (
        <DangYeuPicker hocSinhId={c.hoc_sinh_id} mon={c.mon} daCo={dangs.map((d) => d.ma_dang)}
          onClose={() => setPicker(null)} onConfirm={themXong} onTimBanDo={() => setPicker('ban_do')} />
      )}
      {picker === 'ban_do' && <DangPicker khoi={khoiPick} mon={c.mon} selected={[]} onClose={() => setPicker(null)} onConfirm={themXong} />}
    </div>
  )
}

// Popup "+ Thêm dạng": CHỈ dạng HS đang yếu/cần luyện (theo mastery hiện tại), yếu nhất lên đầu.
// Dạng đã có trong case hiện mờ + nhãn "đã có", không cho tick lại (upsert vốn idempotent, nhưng tick
// lại sẽ đếm sai "Thêm N dạng"). Không thấy dạng cần → link sang toàn bản đồ (kiến thức năm trước).
const MUC_NHAN: Record<DangGoiY['muc'], { ten: string; cls: string }> = {
  yeu: { ten: 'yếu', cls: 'bg-rose-50 text-rose-700' },
  can_luyen: { ten: 'cần luyện', cls: 'bg-amber-50 text-amber-700' },
}
function DangYeuPicker({ hocSinhId, mon, daCo, onClose, onConfirm, onTimBanDo }: {
  hocSinhId: string; mon: string; daCo: string[]
  onClose: () => void; onConfirm: (maDangs: string[]) => void; onTimBanDo: () => void
}) {
  const [items, setItems] = useState<DangGoiY[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const daCoSet = new Set(daCo)

  useEffect(() => {
    setLoading(true); setLoi(null)
    getDangYeuGoiY(hocSinhId, mon).then(setItems)
      .catch((e: any) => setLoi(e?.message ?? String(e)))
      .finally(() => setLoading(false))
  }, [hocSinhId, mon])

  const toggle = (ma: string) => setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })
  const chuaCo = items.filter((d) => !daCoSet.has(d.ma_dang))
  const chonHet = () => setSel(new Set(chuaCo.map((d) => d.ma_dang)))

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[620px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">Dạng em đang yếu · {mon}</h3>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {loading ? <p className="text-[13px] text-slate-400">Đang tính mastery…</p>
            : loi ? <p className="text-[13px] text-rose-600">{loi}</p>
            : items.length === 0 ? (
              <p className="text-[13px] text-slate-400">
                Chưa có dạng nào yếu/cần luyện theo số đo hiện tại (hoặc em chưa được đo môn này).
              </p>
            ) : (
              <>
                {chuaCo.length > 1 && (
                  <div className="mb-2 flex justify-end">
                    <button onClick={chonHet} className="rounded px-2 py-0.5 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50">
                      Chọn tất cả {chuaCo.length} dạng chưa có
                    </button>
                  </div>
                )}
                <ul className="space-y-1">
                  {items.map((d) => {
                    const co = daCoSet.has(d.ma_dang)
                    const on = sel.has(d.ma_dang)
                    const nhan = MUC_NHAN[d.muc]
                    return (
                      <li key={d.ma_dang}>
                        <label className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${co ? 'cursor-default border-slate-100 bg-slate-50 opacity-60' : on ? 'cursor-pointer border-indigo-300 bg-indigo-50/40' : 'cursor-pointer border-slate-100 hover:bg-slate-50'}`}>
                          <input type="checkbox" checked={co || on} disabled={co} onChange={() => toggle(d.ma_dang)} />
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-slate-700">{d.ten_dang}</div>
                            <div className="text-[11px] text-slate-400">{d.ten_chuyen_de}</div>
                          </div>
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${nhan.cls}`}>{nhan.ten}</span>
                          <span className="w-[86px] shrink-0 text-right text-[12px] tabular-nums text-slate-500" title={`mastery ${d.score.toFixed(2)} · ${d.n} lần đo · độ tin ${d.tin}`}>
                            {Math.round(d.score * 100)}% <span className="text-slate-400">· {d.n} lần</span>
                          </span>
                          {co && <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">đã có</span>}
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onTimBanDo} className="text-[12px] font-medium text-indigo-600 hover:underline">
            Không thấy dạng cần? Tìm trong toàn bản đồ…
          </button>
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onConfirm([...sel])} disabled={sel.size === 0}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40">
            Thêm {sel.size} dạng
          </button>
        </div>
      </div>
    </div>
  )
}
