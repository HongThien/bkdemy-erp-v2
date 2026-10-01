// 🏆 XẾP HẠNG BUỔI + 🎁 GAME TRONG BUỔI (spec-game-buoi-hoc.md §5b, Thùy 27/09) — nằm đầu tab "Chấm bài trên lớp".
// Gợi ý hạng từ điểm bài trên lớp của CHÍNH buổi (bằng điểm = cùng hạng) → GV chọn Nhất + Nhì (lớp có mặt >10: tối đa
// 2 Nhì), còn lại Giải 3 → CHỐT (khoá). Sau chốt mỗi bạn có mặt 1 lượt game mang mức giải; GV chọn game, bấm từng bạn:
// DB rút EXP + ghi sổ (fn_buoi_game_choi) → ERP gửi kết quả xuống TV (kênh bk-lop:<buổi>) để diễn. Đã có bạn chơi ⇒ không
// mở lại được. Mọi số ở DB; ở đây chỉ hiển thị + vá tại chỗ từ kết quả RPC trả về (không reload cả khung).
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../lib/supabase'
import { tinhHinhGiai, chotGiai, moLaiGiai, choiLuot, traoQua, GAME_LOP, linkTV, kenhTV, TEN_GIAI, TEN_QUA, type GiaiBuoi, type KetQuaLuot } from '../../lib/gameLop'
import BanQuaLop from './BanQuaLop'

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
  // 2 CHẾ ĐỘ HIỂN THỊ (Thùy 28/09):
  //  · Chế độ 1 — TV RIÊNG: GV làm việc ở ERP (khung này), TV riêng mở trang game + BẢNG LỚP (ERP gửi 'ds' qua kênh) để HS thi đua cả buổi.
  //  · Chế độ 2 — CAST CHUNG: overlay toàn màn = game (iframe ?nhung=1) + danh sách cả lớp theo giải, GV bấm tên ngay đây, cast laptop lên TV.
  const [trinhChieu, setTrinhChieu] = useState(false)
  const chRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  // Chống lộ kết quả (Thùy 29/09): bạn vừa bấm "Mở" ⇒ GIẤU +EXP / 🧋 tới khi game báo "xong" (TV gửi {loai:'xong', hid}); không có TV ⇒ hiện luôn.
  // Dự phòng 25s (TV rớt mạng). Ref giữ dữ liệu, state chỉ để vẽ lại.
  const dangMoRef = useRef(new Map<string, string | null>()) // hid → tin 🧋 hoãn (null = không có)
  const [, veLai] = useState(0)
  const xongMo = (hid: string) => {
    if (!dangMoRef.current.has(hid)) return
    const tin = dangMoRef.current.get(hid); dangMoRef.current.delete(hid); veLai((x) => x + 1); if (tin) bao(tin)
  }
  const dangMo = (hid: string) => dangMoRef.current.has(hid)
  const ngheTV = useRef<((p: Record<string, unknown>) => void) | null>(null) // tin TV gửi về (Bắn Quà: điểm ván)
  useEffect(() => { NHO_GAME[buoiId] = game }, [buoiId, game])

  // Buổi đã có lượt game ⇒ khoá đúng game đó (mỗi buổi 1 game)
  useEffect(() => { const gd = tt?.hs.find((h) => h.game)?.game; if (gd && gd !== game) setGame(gd) }, [tt]) // eslint-disable-line

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
      const co = Object.values(ch.presenceState()).flat().some((x) => (x as { role?: string }).role === 'tv')
      setCoTv(co); if (co) window.setTimeout(() => guiDsRef.current(), 300) // TV vừa nối/tải lại ⇒ gửi bảng lớp
    }).on('broadcast', { event: 'mo' }, (m) => {
      const p = (m.payload ?? {}) as Record<string, unknown>
      if (p.loai === 'xong' && typeof p.hid === 'string') xongMo(p.hid)
      ngheTV.current?.(p)
    }).subscribe()
    chRef.current = ch
    return () => { chRef.current = null; supabase.removeChannel(ch); setCoTv(false) }
  }, [buoiId, daChot])
  const guiTV = (k: KetQuaLuot, hid?: string) => {
    // `game` để TV lọc (2 TV game có thể cùng nghe 1 kênh) · `qua` = quà đặc biệt (🧋) DB đã rút — TV chỉ báo
    chRef.current?.send({ type: 'broadcast', event: 'mo', payload: { ten: k.ho_ten, hid, giai: k.giai, exp: k.exp, min: k.min, max: k.max, game: k.game, qua: k.qua, t: Date.now() } })
  }
  const guiTVTho = (payload: Record<string, unknown>) => { chRef.current?.send({ type: 'broadcast', event: 'mo', payload }) }
  // BẢNG LỚP cho TV riêng (chế độ 1): chỉ số liệu đã có từ DB (tinh_hinh), TV chỉ vẽ. TV tự giấu số của bạn đang mở tới khi diễn xong.
  const guiDs = () => {
    const d = tt; if (!d?.da_chot || !chRef.current) return
    chRef.current.send({ type: 'broadcast', event: 'ds', payload: { game, so_co_mat: d.so_co_mat, so_da_choi: d.so_da_choi,
      hs: d.hs.map((h) => ({ ten: h.ho_ten, giai: h.giai, exp: h.exp, qua: h.qua })) } })
  }
  const guiDsRef = useRef(guiDs); guiDsRef.current = guiDs
  useEffect(() => { if (coTv) guiDs() }, [tt, game, coTv]) // eslint-disable-line
  const bao = (t: string) => { setMsg(t); window.setTimeout(() => setMsg((m) => (m === t ? null : m)), 2500) }

  const g = GAME_LOP.find((x) => x.id === game) ?? GAME_LOP[0]
  const moChoBan = async (hid: string) => {
    setBan(hid)
    try {
      const k = await choiLuot(buoiId, hid, game)
      guiTV(k, hid)
      if (coTv && !k.da_choi) { dangMoRef.current.set(hid, k.qua ? `🧋 ${k.ho_ten} TRÚNG ${TEN_QUA[k.qua] ?? k.qua}! Trao xong bấm "Đã trao".` : null); window.setTimeout(() => xongMo(hid), 25000) }
      setTt((p) => p && ({ ...p, so_da_choi: p.so_da_choi + (k.da_choi ? 0 : 1), so_qua_chua_trao: p.so_qua_chua_trao + (k.qua && !k.da_choi ? 1 : 0), hs: p.hs.map((x) => (x.hoc_sinh_id === hid ? { ...x, exp: k.exp, game: k.game, qua: k.qua, qua_trao_at: x.qua_trao_at ?? null } : x)) }))
      if (k.qua && !k.da_choi && !dangMo(hid)) bao(`🧋 ${k.ho_ten} TRÚNG ${TEN_QUA[k.qua] ?? k.qua}! Trao xong bấm "Đã trao".`)
    } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
  }
  const chieuLai = async (hid: string, gm: string | null) => {
    setBan(hid)
    try { const k = await choiLuot(buoiId, hid, gm ?? game); guiTV(k, hid); bao('↻ Đã chiếu lại') } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
  }
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
              <select value={game} disabled={tt.so_da_choi > 0} onChange={(e) => setGame(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100">
                {GAME_LOP.map((x) => <option key={x.id} value={x.id} disabled={!x.co_luat}>{x.ten}{x.co_luat ? '' : ' (chờ luật)'}</option>)}
              </select>
              <a href={g.co_luat ? linkTV(g.file, buoiId) : undefined} target="_blank" rel="noreferrer"
                className={`rounded-md bg-indigo-600 px-3 py-1 text-sm font-bold text-white ${g.co_luat ? '' : 'pointer-events-none opacity-40'}`}
                title="Mở trang game ở cửa sổ riêng → kéo sang TV. TV hiện game + bảng cả lớp; thầy cô làm việc tiếp trên máy tính">📺 Chế độ 1 · TV riêng</a>
              <button disabled={!g.co_luat} onClick={() => setTrinhChieu(true)} className="rounded-md bg-violet-600 px-3 py-1 text-sm font-bold text-white disabled:opacity-40"
                title="Game + danh sách cả lớp trên 1 màn — cast cả màn laptop lên TV">🖥 Chế độ 2 · Cast chung</button>
              <span className={`rounded px-1.5 text-[11px] ${coTv ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{coTv ? '● game đã nối' : '○ chưa mở game'}</span>
              <span className="ml-auto text-xs text-slate-500">{tt.so_da_choi}/{tt.so_co_mat} bạn đã chơi</span>
            </div>
            {tt.so_qua_chua_trao > 0 && (
              <div className="mt-2 rounded-lg bg-pink-50 px-3 py-1.5 text-sm font-bold text-pink-700">🧋 Có {tt.so_qua_chua_trao} bạn trúng quà đặc biệt chưa trao — trao xong bấm "Đã trao" cạnh tên.</div>
            )}
            {g.ca_lop && (
              <BanQuaLop buoiId={buoiId} coTv={coTv} guiTV={guiTVTho} ngheTV={ngheTV} onXong={() => tai()}
                coMat={tt.hs.map((h) => ({ hoc_sinh_id: h.hoc_sinh_id, ho_ten: h.ho_ten, giai: h.giai }))} />
            )}
            <div className="mt-2 space-y-1">
              {tt.hs.filter((h) => !g.ca_lop || h.exp != null).map((h) => (
                <div key={h.hoc_sinh_id} className="flex items-center gap-2 rounded-lg bg-indigo-50/60 px-2 py-1.5">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-500">{TEN_GIAI[h.giai]}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{h.ho_ten}</span>
                  {h.exp != null && dangMo(h.hoc_sinh_id) ? <span className="text-sm font-bold text-amber-600">🎁 đang mở…</span> : h.exp != null ? (
                    <>
                      <span className="text-sm font-black text-emerald-700">+{h.exp} EXP</span>
                      {h.qua && (h.qua_trao_at
                        ? <span className="rounded bg-slate-100 px-1.5 text-[11px] text-slate-500" title={`đã trao ${new Date(h.qua_trao_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}>{TEN_QUA[h.qua] ?? h.qua} ✓</span>
                        : <button disabled={ban === 'qua' + h.hoc_sinh_id} onClick={async () => {
                            setBan('qua' + h.hoc_sinh_id)
                            try { const d = await traoQua(buoiId, h.hoc_sinh_id); setTt(d); bao('✓ Đã ghi trao ' + (TEN_QUA[h.qua!] ?? h.qua)) } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
                          }} className="min-h-9 rounded-md bg-pink-500 px-2.5 text-xs font-bold text-white disabled:opacity-40" title="Trúng quà đặc biệt — bấm khi đã trao tay">{TEN_QUA[h.qua] ?? h.qua} · Đã trao</button>)}
                      {!g.ca_lop && <button disabled={ban === h.hoc_sinh_id} onClick={() => chieuLai(h.hoc_sinh_id, h.game)} className="rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-white" title="Chiếu lại lên TV (không cộng thêm)">↻ TV</button>}
                    </>
                  ) : (
                    <button disabled={ban === h.hoc_sinh_id || !g.co_luat} onClick={() => moChoBan(h.hoc_sinh_id)} className="min-h-9 rounded-md bg-indigo-600 px-3 text-xs font-bold text-white disabled:opacity-40">{g.ten.split(' ')[0]} Mở cho bạn này</button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">{g.ca_lop ? 'Bắn Quà: cả lớp chơi 1 ván trên TV; hệ thống quay đạn, xếp hạng và cộng EXP khi thầy cô bấm Chốt (nguồn "Trên lớp"). Mỗi buổi 1 game.' : 'Mỗi bạn 1 lượt/buổi. Kết quả do hệ thống rút và cộng EXP ngay (nguồn "Trên lớp"); TV chỉ chiếu lại cho cả lớp xem.'}
              {game === 'chiem_dat' && ' Chiếm Đất: bạn chọn ô bất kì đúng cấp giải trên TV (Giải 3 ★ · Nhì ★★ · Nhất ★★★), thầy cô bấm ô đó.'}
              {' '}Quà đặc biệt 🧋 trà sữa: rất hiếm, giải càng cao càng dễ trúng; trúng thì ERP báo và có nút "Đã trao".</p>
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
      {trinhChieu && tt.da_chot && createPortal(
        <TrinhChieu tt={tt} g={g} buoiId={buoiId} ban={ban} coTv={coTv} msg={msg} onMo={moChoBan} onChieuLai={chieuLai} dangMo={dangMo}
          onDong={() => { setTrinhChieu(false); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}) }}>
          {g.ca_lop && (
            <BanQuaLop buoiId={buoiId} coTv={coTv} guiTV={guiTVTho} ngheTV={ngheTV} onXong={() => tai()}
              coMat={tt.hs.map((h) => ({ hoc_sinh_id: h.hoc_sinh_id, ho_ten: h.ho_ten, giai: h.giai }))} />
          )}
        </TrinhChieu>, document.body)}
    </div>
  )
}

// ───────── 🖥 MÀN TRÌNH CHIẾU: game (iframe bản lớp) + bảng cả lớp — 1 màn để cast lên TV ─────────
// iframe vẫn là trang game `?che_do=lop` (nghe kênh bk-lop:<buổi>, báo presence) ⇒ không đổi gì phía game.
// Danh sách chữ TO để cả lớp đọc từ TV: nhóm theo giải, ai đã mở thì hiện +EXP (và 🧋 nếu trúng), GV bấm "Mở" ngay trên tên.
function TrinhChieu({ tt, g, buoiId, ban, coTv, msg, onMo, onChieuLai, onDong, dangMo, children }: {
  tt: GiaiBuoi; g: (typeof GAME_LOP)[number]; buoiId: string; ban: string | null; coTv: boolean; msg: string | null
  onMo: (hid: string) => void; onChieuLai: (hid: string, gm: string | null) => void; onDong: () => void; dangMo: (hid: string) => boolean; children?: React.ReactNode
}) {
  const vungRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.fullscreenElement) onDong() }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onDong])
  const nhom = [1, 2, 3].map((gi) => tt.hs.filter((h) => h.giai === gi))
  const MAU: Record<number, string> = { 1: 'from-amber-400 to-yellow-600', 2: 'from-slate-300 to-slate-500', 3: 'from-orange-300 to-amber-700' }
  return (
    <div ref={vungRef} className="fixed inset-0 z-[100] flex bg-[#0b1030] text-white">
      <div className="relative min-w-0 flex-1">
        <iframe src={linkTV(g.file, buoiId) + '&nhung=1'} title="game" className="h-full w-full border-0" allow="autoplay; fullscreen" />
        {!coTv && <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-lg bg-amber-500/90 px-3 py-1 text-sm font-bold">Đang nối game…</div>}
      </div>
      <aside className="flex w-[min(34vw,460px)] shrink-0 flex-col border-l border-white/10 bg-[#121a45]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="text-xl font-black">{g.ten}</span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-sm">{tt.so_da_choi}/{tt.so_co_mat} đã chơi</span>
          <button onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else vungRef.current?.requestFullscreen().catch(() => {}) }}
            className="ml-auto rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/20" title="Toàn màn hình">⛶</button>
          <button onClick={onDong} className="rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/20" title="Thoát (Esc)">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {children}
          {!g.ca_lop && nhom.map((ds, i) => ds.length > 0 && (
            <div key={i} className="mb-3">
              <div className={`mb-1.5 inline-block rounded-lg bg-gradient-to-r px-3 py-1 text-base font-black text-white shadow ${MAU[i + 1]}`}>{TEN_GIAI[(i + 1) as 1 | 2 | 3]}</div>
              <div className="space-y-1.5">
                {ds.map((h) => (
                  <div key={h.hoc_sinh_id} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${h.exp != null && !dangMo(h.hoc_sinh_id) ? 'bg-emerald-500/15' : 'bg-white/5'}`}>
                    <span className="min-w-0 flex-1 break-words text-lg font-bold leading-tight">{h.ho_ten}</span>
                    {h.exp != null && dangMo(h.hoc_sinh_id) ? <span className="text-lg font-black text-amber-300">🎁 đang mở…</span> : h.exp != null ? (
                      <>
                        {h.qua && <span className="text-lg" title={TEN_QUA[h.qua] ?? h.qua}>🧋</span>}
                        <span className="text-xl font-black text-emerald-300 tabular-nums">+{h.exp}</span>
                        <button disabled={ban === h.hoc_sinh_id} onClick={() => onChieuLai(h.hoc_sinh_id, h.game)} className="rounded-md px-1.5 text-sm text-white/60 hover:bg-white/10" title="Chiếu lại (không cộng thêm)">↻</button>
                      </>
                    ) : (
                      <button disabled={ban === h.hoc_sinh_id} onClick={() => onMo(h.hoc_sinh_id)}
                        className="min-h-10 rounded-lg bg-indigo-500 px-4 text-base font-black text-white hover:bg-indigo-400 disabled:opacity-40">{g.ten.split(' ')[0]} Mở</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {msg && <div className="border-t border-white/10 px-4 py-2 text-sm font-bold text-amber-200">{msg}</div>}
        <div className="border-t border-white/10 px-4 py-2 text-xs text-white/50">EXP cộng ngay khi bấm Mở (nguồn "Trên lớp"). Esc: thoát trình chiếu.</div>
      </aside>
    </div>
  )
}
