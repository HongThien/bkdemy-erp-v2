// 🏆 XẾP HẠNG BUỔI + 🎁 GAME TRONG BUỔI (spec-game-buoi-hoc.md §5b, Thùy 27/09) — nằm đầu tab "Chấm bài trên lớp".
// Gợi ý hạng từ điểm bài trên lớp của CHÍNH buổi (bằng điểm = cùng hạng) → GV chọn Nhất + Nhì (lớp có mặt >10: tối đa
// 2 Nhì), còn lại Giải 3 → CHỐT (khoá). Sau chốt mỗi bạn có mặt 1 lượt game mang mức giải; GV chọn game, bấm từng bạn:
// DB rút EXP + ghi sổ (fn_buoi_game_choi) → ERP gửi kết quả xuống TV (kênh bk-lop:<buổi>) để diễn. Đã có bạn chơi ⇒ không
// mở lại được. Mọi số ở DB; ở đây chỉ hiển thị + vá tại chỗ từ kết quả RPC trả về (không reload cả khung).
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { tinhHinhGiai, chotGiai, moLaiGiai, choiLuot, GAME_LOP, linkTV, kenhTV, TEN_GIAI, type GiaiBuoi, type KetQuaLuot } from '../../lib/gameLop'

const NHO_GAME: Record<string, string> = {} // buổi → game GV đã chọn (sống tới F5, đổi tab không mất)

export default function XepHangBuoi({ buoiId, soCoMat }: { buoiId: string; soCoMat: number }) {
  const [tt, setTt] = useState<GiaiBuoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ban, setBan] = useState<string | null>(null)
  const [nhat, setNhat] = useState<string | null>(null)
  const [nhi, setNhi] = useState<string[]>([])
  const [game, setGame] = useState<string>(NHO_GAME[buoiId] ?? 'mo_ruong')
  const [coTv, setCoTv] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const chRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  useEffect(() => { NHO_GAME[buoiId] = game }, [buoiId, game])

  // Lựa chọn ban đầu: đã có Nhất/Nhì lưu (sau Mở lại) thì lấy lại; chưa có thì chỉ tự điền khi gợi ý RÕ RÀNG (không hoà).
  const napLuaChon = (d: GiaiBuoi) => {
    const n1 = d.hs.filter((h) => h.giai === 1).map((h) => h.hoc_sinh_id)
    const n2 = d.hs.filter((h) => h.giai === 2).map((h) => h.hoc_sinh_id)
    if (n1.length || n2.length) { setNhat(n1[0] ?? null); setNhi(n2); return }
    const h1 = d.hs.filter((h) => h.hang_goi_y === 1), h2 = d.hs.filter((h) => h.hang_goi_y === 2)
    setNhat(h1.length === 1 ? h1[0].hoc_sinh_id : null)
    setNhi(h1.length === 1 && h2.length >= 1 && h2.length <= d.toi_da_nhi ? h2.map((h) => h.hoc_sinh_id) : [])
  }
  const tai = async (dauTien = false) => {
    try { const d = await tinhHinhGiai(buoiId); setTt(d); setLoi(null); if (dauTien || !d.da_chot) napLuaChon(d) }
    catch (e) { setLoi((e as Error).message) }
  }
  useEffect(() => { setTt(null); tai(true) }, [buoiId]) // eslint-disable-line
  // Điểm danh đổi (thêm/bớt bạn có mặt) ⇒ quét lại NỀN, giữ khung đang hiện
  const lanDau = useRef(true)
  useEffect(() => { if (lanDau.current) { lanDau.current = false; return } tai() }, [soCoMat]) // eslint-disable-line

  // Kênh xuống TV: chỉ mở khi đã chốt. "Đã nối kênh" ≠ "có TV nghe" ⇒ đọc presence role=tv (bài học tối 26/09).
  const daChot = !!tt?.da_chot
  useEffect(() => {
    if (!daChot) return
    const ch = supabase.channel(kenhTV(buoiId), { config: { broadcast: { self: false } } })
    ch.on('presence', { event: 'sync' }, () => {
      setCoTv(Object.values(ch.presenceState()).flat().some((x) => (x as { role?: string }).role === 'tv'))
    }).subscribe()
    chRef.current = ch
    return () => { chRef.current = null; supabase.removeChannel(ch); setCoTv(false) }
  }, [buoiId, daChot])
  const guiTV = (k: KetQuaLuot) => {
    chRef.current?.send({ type: 'broadcast', event: 'mo', payload: { ten: k.ho_ten, giai: k.giai, exp: k.exp, min: k.min, max: k.max, game: k.game, t: Date.now() } })
  }
  const bao = (t: string) => { setMsg(t); window.setTimeout(() => setMsg((m) => (m === t ? null : m)), 2500) }

  const g = GAME_LOP.find((x) => x.id === game) ?? GAME_LOP[0]
  const soNhiCan = tt ? (tt.so_co_mat >= 2 ? 1 : 0) : 0
  const duChon = !!nhat && nhi.length >= soNhiCan && (!tt || nhi.length <= tt.toi_da_nhi)
  const theoGiai = useMemo(() => (tt ? [1, 2, 3].map((gi) => tt.hs.filter((h) => h.giai === gi)) : []), [tt])

  if (loi) return <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">Xếp hạng buổi: {loi}</div>
  if (!tt) return <div className="mb-4 rounded-xl bg-white p-3 text-sm text-slate-400 shadow-sm">Đang tải xếp hạng buổi…</div>
  if (tt.so_co_mat === 0) return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-amber-200">
      <div className="bg-amber-500 px-4 py-2 font-bold text-white">🏆 Xếp hạng buổi</div>
      <div className="p-3 text-sm text-slate-500">Chưa có bạn nào có mặt — điểm danh trước rồi xếp hạng.</div>
    </div>
  )

  const chonNhat = (id: string) => { setNhat((c) => (c === id ? null : id)); setNhi((l) => l.filter((x) => x !== id)) }
  const chonNhi = (id: string) => {
    if (nhat === id) setNhat(null)
    setNhi((l) => (l.includes(id) ? l.filter((x) => x !== id) : tt.toi_da_nhi === 1 ? [id] : [...l, id].slice(-tt.toi_da_nhi)))
  }

  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-amber-200">
      <div className="flex flex-wrap items-center gap-2 bg-amber-500 px-4 py-2 text-white">
        <span className="font-bold">🏆 Xếp hạng buổi</span>
        <span className="rounded bg-white/20 px-2 py-0.5 text-xs">{tt.da_chot ? `đã chốt ${new Date(tt.chot_at!).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'chưa chốt'}</span>
        <span className="text-xs opacity-90">{tt.so_co_mat} bạn có mặt · tối đa {tt.toi_da_nhi} Nhì</span>
        <button onClick={() => tai()} className="ml-auto rounded px-2 py-0.5 text-xs hover:bg-white/20" title="Quét lại">↻</button>
      </div>

      {tt.giai_lech.length > 0 && (
        <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
          ⚠ Có bạn được giải nhưng nay không còn "có mặt" (điểm danh bị sửa sau khi chốt). {tt.so_da_choi === 0 ? 'Bấm Mở lại để chọn lại.' : 'Đã có bạn chơi game nên không mở lại được — báo quản lý.'}
        </div>
      )}

      {!tt.da_chot ? (
        <div className="p-3">
          <p className="mb-2 text-xs text-slate-500">{tt.co_du_lieu
            ? 'Gợi ý theo điểm bài trên lớp của buổi này (bằng điểm = cùng hạng — thầy cô chọn). Có thể đổi tuỳ ý.'
            : 'Buổi này chưa có điểm bài trên lớp — thầy cô tự chọn Nhất / Nhì.'} Các bạn còn lại là Giải 3.</p>
          <div className="space-y-1">
            {tt.hs.map((h) => {
              const la1 = nhat === h.hoc_sinh_id, la2 = nhi.includes(h.hoc_sinh_id)
              return (
                <div key={h.hoc_sinh_id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${la1 ? 'bg-amber-50' : la2 ? 'bg-slate-100' : 'bg-slate-50'}`}>
                  <span className="w-8 text-center text-xs font-bold text-slate-400">{h.hang_goi_y ? `#${h.hang_goi_y}` : '–'}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{h.ho_ten}</span>
                  {h.diem != null && <span className="text-xs tabular-nums text-slate-500">{Number(h.diem)} đ</span>}
                  <button onClick={() => chonNhat(h.hoc_sinh_id)} className={`min-h-9 rounded-md px-2.5 text-xs font-bold ${la1 ? 'bg-amber-500 text-white' : 'border border-amber-300 text-amber-700'}`}>🥇 Nhất</button>
                  <button onClick={() => chonNhi(h.hoc_sinh_id)} disabled={tt.so_co_mat < 2} className={`min-h-9 rounded-md px-2.5 text-xs font-bold disabled:opacity-30 ${la2 ? 'bg-slate-600 text-white' : 'border border-slate-300 text-slate-600'}`}>🥈 Nhì</button>
                </div>
              )
            })}
          </div>
          <button disabled={!duChon || ban === 'chot'} onClick={async () => {
            setBan('chot')
            try { const d = await chotGiai(buoiId, nhat!, nhi); setTt(d); bao('✓ Đã chốt xếp hạng buổi') } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
          }} className="mt-3 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white disabled:opacity-40">
            ✓ Chốt xếp hạng {nhat ? '' : '(chọn Nhất)'}{nhat && nhi.length < soNhiCan ? '(chọn Nhì)' : ''}
          </button>
        </div>
      ) : (
        <div className="p-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {theoGiai.map((ds, i) => (
              <div key={i} className="rounded-lg bg-slate-50 px-2 py-1.5">
                <div className="text-xs font-bold text-slate-500">{TEN_GIAI[(i + 1) as 1 | 2 | 3]} · {ds.length}</div>
                <div className="text-sm text-slate-800">{ds.map((h) => h.ho_ten).join(', ') || '—'}</div>
              </div>
            ))}
          </div>

          {/* GAME */}
          <div className="mt-3 rounded-xl border border-indigo-200 p-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-indigo-700">🎮 Game của buổi</span>
              <select value={game} onChange={(e) => setGame(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 text-sm">
                {GAME_LOP.map((x) => <option key={x.id} value={x.id} disabled={!x.co_luat}>{x.ten}{x.co_luat ? '' : ' (chờ luật)'}</option>)}
              </select>
              <a href={linkTV(g.file, buoiId)} target="_blank" rel="noreferrer" className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-bold text-white">📺 Mở màn TV</a>
              <span className={`rounded px-1.5 text-[11px] ${coTv ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 font-bold text-amber-800'}`}>{coTv ? '● TV đã nối' : '⚠ chưa thấy TV'}</span>
              <span className="ml-auto text-xs text-slate-500">{tt.so_da_choi}/{tt.so_co_mat} bạn đã chơi</span>
            </div>
            <div className="mt-2 space-y-1">
              {tt.hs.map((h) => (
                <div key={h.hoc_sinh_id} className="flex items-center gap-2 rounded-lg bg-indigo-50/60 px-2 py-1.5">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-500">{TEN_GIAI[h.giai]}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{h.ho_ten}</span>
                  {h.exp != null ? (
                    <>
                      <span className="text-sm font-black text-emerald-700">+{h.exp} EXP</span>
                      <button disabled={ban === h.hoc_sinh_id} onClick={async () => {
                        setBan(h.hoc_sinh_id)
                        try { const k = await choiLuot(buoiId, h.hoc_sinh_id, h.game ?? game); guiTV(k); bao('↻ Đã chiếu lại lên TV') } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
                      }} className="rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-white" title="Chiếu lại lên TV (không cộng thêm)">↻ TV</button>
                    </>
                  ) : (
                    <button disabled={ban === h.hoc_sinh_id || !g.co_luat} onClick={async () => {
                      setBan(h.hoc_sinh_id)
                      try {
                        const k = await choiLuot(buoiId, h.hoc_sinh_id, game)
                        guiTV(k)
                        setTt((p) => p && ({ ...p, so_da_choi: p.so_da_choi + (k.da_choi ? 0 : 1), hs: p.hs.map((x) => (x.hoc_sinh_id === h.hoc_sinh_id ? { ...x, exp: k.exp, game: k.game } : x)) }))
                      } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
                    }} className="min-h-9 rounded-md bg-indigo-600 px-3 text-xs font-bold text-white disabled:opacity-40">{g.ten.split(' ')[0]} Mở cho bạn này</button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Mỗi bạn 1 lượt/buổi. Kết quả do hệ thống rút và cộng EXP ngay (nguồn "Trên lớp"); TV chỉ chiếu lại cho cả lớp xem.</p>
          </div>

          {tt.so_da_choi === 0 && (
            <button disabled={ban === 'mo'} onClick={async () => {
              if (!confirm('Mở lại xếp hạng buổi để sửa Nhất/Nhì?')) return
              setBan('mo')
              try { const d = await moLaiGiai(buoiId); setTt(d); napLuaChon(d) } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
            }} className="mt-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600">↩ Mở lại để sửa</button>
          )}
        </div>
      )}
      {msg && <div className="border-t border-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600">{msg}</div>}
    </div>
  )
}
