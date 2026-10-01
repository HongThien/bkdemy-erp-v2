// 🎯 BẮN QUÀ bản lớp (spec-game-ban-qua.md §7, Thùy 28/09) — nằm trong khung Game của XepHangBuoi khi GV chọn Bắn Quà.
// Luồng: chọn Cá nhân / Đội (chia đội = chức năng riêng: 🎲 DB chia ngẫu nhiên, hoặc GV bấm chip tự xếp) → ▶ Bắt đầu ván: DB snapshot giải,
// RÚT đạn, xáo thứ tự (fn_ban_qua_bat_dau) → gửi danh sách xuống TV (kênh bk-lop:<buổi>) → cả lớp chơi trên TV → TV gửi ĐIỂM THÔ về →
// GV xem → ✓ Chốt: DB xếp hạng + EXP + rương đội + trà sữa + sổ EXP (fn_ban_qua_chot). Mọi rút/tính ở DB; ở đây chỉ hiển thị + chuyển tin.
import { useEffect, useRef, useState } from 'react'
import { banQuaTinhHinh, banQuaChiaDoi, banQuaBatDau, banQuaChot, TEN_DOI, MAU_DOI, TEN_GIAI, TEN_QUA, type BanQuaTinhHinh, type BanQuaKetQua } from '../../lib/gameLop'

type HSCoMat = { hoc_sinh_id: string; ho_ten: string; giai: 1 | 2 | 3 }
// Chế độ 🖥 Cast chung: game nằm trong iframe CÙNG trang với nút ERP. Bấm nút xong, focus còn ở nút ⇒ HS bấm Space (nạp lực) = BẤM LẠI NÚT
// (vd "Bắt đầu lại ván"). Mỗi thao tác xong: bỏ focus nút + trả focus cho iframe game (nếu có). Chế độ TV riêng: không có iframe ⇒ chỉ blur.
const traFocusGame = () => {
  (document.activeElement as HTMLElement | null)?.blur?.()
  const fr = document.querySelector<HTMLIFrameElement>('iframe[title="game"]')
  if (fr) { fr.focus(); fr.contentWindow?.focus() }
}
const TEN_DAN: Record<string, string> = { thuong: '❄️', bomto: '💣', nay: '🏀', xuyen: '🎯', chum: '🎆', cuu: '🐑', chuoi: '🍌', saobang: '☄️', lua: '🔥', set: '⚡' }

export default function BanQuaLop({ buoiId, coMat, coTv, guiTV, ngheTV, onXong }: {
  buoiId: string; coMat: HSCoMat[]; coTv: boolean
  guiTV: (payload: Record<string, unknown>) => void
  ngheTV: React.MutableRefObject<((p: Record<string, unknown>) => void) | null>
  onXong: () => void // đã chốt ⇒ cha quét lại tình hình buổi (EXP + trà sữa hiện ở danh sách cha)
}) {
  const [tt, setTt] = useState<BanQuaTinhHinh | null>(null)
  const [cheDo, setCheDo] = useState<'canhan' | 'doi'>('canhan')
  const [soDoi, setSoDoi] = useState(2)
  const [phut, setPhut] = useState(3)
  const [doi, setDoi] = useState<Record<string, number>>({})
  const [kq, setKq] = useState<BanQuaKetQua | null>(null)
  const [ban, setBan] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const ttRef = useRef<BanQuaTinhHinh | null>(null); ttRef.current = tt
  const bao = (t: string) => { setMsg(t); window.setTimeout(() => setMsg((m) => (m === t ? null : m)), 3000) }

  const tai = async () => {
    try {
      const d = await banQuaTinhHinh(buoiId); setTt(d)
      if (d.van) { setCheDo(d.van.che_do); if (d.van.so_doi) setSoDoi(d.van.so_doi); if (d.van.phut) setPhut(d.van.phut)
        const m: Record<string, number> = {}; d.hs.forEach((h) => { if (h.doi) m[h.hoc_sinh_id] = h.doi }); if (Object.keys(m).length) setDoi(m) }
    } catch (e) { bao('❌ ' + (e as Error).message) }
  }
  useEffect(() => { tai() }, [buoiId]) // eslint-disable-line

  // nghe TV: kết quả ván (điểm thô) — chỉ nhận khi ván đang mở chưa chốt
  useEffect(() => {
    ngheTV.current = (p) => {
      if (p.game !== 'ban_qua' || p.loai !== 'ket_qua') return
      if (!ttRef.current?.van || ttRef.current.van.chot_at) return
      setKq({ hs: (p.hs as Record<string, number>) ?? {}, doi: (p.doi as Record<string, number>) ?? undefined }); bao('📥 TV đã gửi kết quả — kiểm rồi bấm Chốt')
    }
    return () => { ngheTV.current = null }
  }, [ngheTV])

  const payloadBatDau = (d: BanQuaTinhHinh) => ({
    game: 'ban_qua', loai: 'bat_dau', che_do: d.van!.che_do, so_doi: d.van!.so_doi, phut: d.van!.phut, t: Date.now(),
    ds: d.hs.filter((h) => h.co_mat).map((h) => ({ id: h.hoc_sinh_id, ten: h.ho_ten, giai: h.giai, doi: h.doi, dan: h.dan, thu_tu: h.thu_tu })),
  })
  const payloadChot = (d: BanQuaTinhHinh) => ({
    game: 'ban_qua', loai: 'da_chot', t: Date.now(),
    hs: d.hs.filter((h) => h.exp != null).map((h) => ({ id: h.hoc_sinh_id, ten: h.ho_ten, giai: h.giai, diem: h.diem, exp: h.exp, qua: h.qua, doi: h.doi })),
    doi: d.doi,
  })

  if (!tt) return <div className="mt-2 text-xs text-slate-400">Đang tải ván Bắn Quà…</div>
  const van = tt.van, daChot = !!van?.chot_at
  const soTheoDoi = (k: number) => coMat.filter((h) => doi[h.hoc_sinh_id] === k).length
  const duDoi = cheDo === 'canhan' || (coMat.every((h) => (doi[h.hoc_sinh_id] ?? 0) >= 1 && doi[h.hoc_sinh_id] <= soDoi) && Array.from({ length: soDoi }, (_, i) => soTheoDoi(i + 1)).every((n) => n > 0))

  // ---------- ĐÃ CHỐT ----------
  if (daChot) return (
    <div className="mt-2 rounded-lg bg-emerald-50 p-2.5 text-sm">
      <div className="font-bold text-emerald-800">✓ Đã chốt ván Bắn Quà ({van!.che_do === 'doi' ? `${van!.so_doi} đội` : 'cá nhân'}) — EXP đã vào tài khoản</div>
      {tt.doi.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {tt.doi.map((d) => (
            <span key={d.doi} className="rounded-md bg-white px-2 py-1 text-xs font-semibold" style={{ borderLeft: `4px solid ${MAU_DOI[d.doi - 1]}` }}>
              #{d.hang} Đội {TEN_DOI[d.doi - 1]} · {d.sat_thuong} sát thương · {d.ruong === 'vang' ? '🟨 Rương Vàng' : '⬜ Rương Bạc'} · +{d.exp} EXP/bạn
            </span>
          ))}
        </div>
      )}
      <div className="mt-1.5 text-xs text-slate-600">{tt.hs.filter((h) => h.exp != null).sort((a, b) => (b.diem ?? 0) - (a.diem ?? 0))
        .map((h) => `${h.ho_ten} ${h.diem}đ +${h.exp}${h.qua ? ' ' + (TEN_QUA[h.qua] ?? h.qua) : ''}`).join(' · ')}</div>
      <button onClick={() => { guiTV(payloadChot(tt)); bao('↻ Đã chiếu lại kết quả lên TV') }} className="mt-1.5 rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-white">↻ Chiếu kết quả lên TV</button>
      {msg && <div className="mt-1 text-xs font-medium text-slate-600">{msg}</div>}
    </div>
  )

  // ---------- THIẾT LẬP / ĐANG CHƠI ----------
  return (
    <div className="mt-2 space-y-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full bg-slate-100 p-0.5">
          {(['canhan', 'doi'] as const).map((c) => (
            <button key={c} disabled={!!van} onClick={() => setCheDo(c)} className={`rounded-full px-3 py-1 text-xs font-bold disabled:cursor-not-allowed ${cheDo === c ? 'bg-white text-orange-600 shadow' : 'text-slate-500'}`}>
              {c === 'canhan' ? '👤 Cá nhân' : '👥 Đội'}
            </button>
          ))}
        </div>
        {cheDo === 'doi' && (<>
          <label className="text-xs text-slate-600">Số đội <select value={soDoi} disabled={!!van} onChange={(e) => { setSoDoi(+e.target.value); setDoi({}) }} className="rounded border border-slate-300 px-1">{[2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select></label>
          <label className="text-xs text-slate-600">Giờ chơi <select value={phut} onChange={(e) => setPhut(+e.target.value)} className="rounded border border-slate-300 px-1">{[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} phút</option>)}</select></label>
          <button disabled={ban === 'chia'} onClick={async () => {
            setBan('chia'); try { setDoi(await banQuaChiaDoi(buoiId, soDoi)); bao('🎲 Đã chia ngẫu nhiên — bấm chip đội cạnh tên để sửa') } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
          }} className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-bold text-white">🎲 Chia ngẫu nhiên</button>
        </>)}
      </div>

      {cheDo === 'doi' && (
        <div className="space-y-1">
          <p className="text-[11px] text-slate-500">Chia đội: bấm 🎲 để hệ thống chia ngẫu nhiên, hoặc tự xếp — bấm vào ô đội cạnh tên từng bạn.
            {' '}{Array.from({ length: soDoi }, (_, i) => `Đội ${TEN_DOI[i]}: ${soTheoDoi(i + 1)}`).join(' · ')}</p>
          {coMat.map((h) => (
            <div key={h.hoc_sinh_id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1">
              <span className="w-16 shrink-0 text-xs text-slate-500">{TEN_GIAI[h.giai]}</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">{h.ho_ten}</span>
              {Array.from({ length: soDoi }, (_, i) => i + 1).map((k) => (
                <button key={k} onClick={() => setDoi((m) => ({ ...m, [h.hoc_sinh_id]: k }))}
                  className="h-7 min-w-12 rounded-md px-1.5 text-[11px] font-bold"
                  style={doi[h.hoc_sinh_id] === k ? { background: MAU_DOI[k - 1], color: '#fff' } : { border: `1.5px solid ${MAU_DOI[k - 1]}`, color: MAU_DOI[k - 1] }}>
                  {TEN_DOI[k - 1]}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button disabled={!duDoi || ban === 'bd'} onClick={async () => {
          setBan('bd')
          try {
            const d = await banQuaBatDau(buoiId, cheDo, cheDo === 'doi' ? soDoi : null, cheDo === 'doi' ? phut : null, cheDo === 'doi' ? doi : {})
            setTt(d); setKq(null); guiTV(payloadBatDau(d)); traFocusGame()
            bao(coTv ? '▶ Đã gửi danh sách + đạn xuống TV' : '▶ Đã bắt đầu — mở màn TV (TV nhận khi bấm ↻ Gửi lại)')
          } catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
        }} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
          {van ? '↻ Bắt đầu lại ván (giữ đạn đã quay)' : '▶ Bắt đầu ván — quay đạn & gửi lên TV'}
        </button>
        {van && <button onClick={() => { guiTV(payloadBatDau(tt)); traFocusGame(); bao('↻ Đã gửi lại danh sách lên TV') }} className="rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50">↻ Gửi lại lên TV</button>}
        {van && <button onClick={() => { guiTV({ game: 'ban_qua', loai: 'xin_ket_qua', t: Date.now() }); traFocusGame(); bao('📨 Đã xin TV gửi lại kết quả') }} className="rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50">📨 Xin kết quả từ TV</button>}
        {!duDoi && cheDo === 'doi' && <span className="text-xs text-amber-700">Xếp đủ đội cho mọi bạn (mỗi đội ≥1 bạn)</span>}
      </div>

      {van && (
        <div className="rounded-lg border border-slate-200 p-2">
          <div className="text-xs font-bold text-slate-600">Ván đang chơi trên TV · {van.che_do === 'doi' ? `${van.so_doi} đội · ${van.phut} phút` : 'cá nhân'} · đạn đã quay (DB):</div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-700">
            {tt.hs.filter((h) => h.co_mat).map((h) => (
              <span key={h.hoc_sinh_id}>{h.thu_tu}. {h.ho_ten}{h.doi ? <b style={{ color: MAU_DOI[h.doi - 1] }}> ({TEN_DOI[h.doi - 1]})</b> : null} {h.dan.map((x) => TEN_DAN[x] ?? x).join('')}{kq ? <b className="text-indigo-700"> → {kq.hs[h.hoc_sinh_id] ?? 0}đ</b> : null}</span>
            ))}
          </div>
          {kq?.doi && <div className="mt-1 text-xs font-semibold">{Object.entries(kq.doi).map(([k, v]) => `Đội ${TEN_DOI[+k - 1]}: ${v} sát thương`).join(' · ')}</div>}
          {kq ? (
            <button disabled={ban === 'chot'} onClick={async () => {
              if (!confirm('Chốt kết quả ván Bắn Quà? EXP sẽ vào tài khoản HS, không sửa lại được.')) return
              setBan('chot')
              try { const d = await banQuaChot(buoiId, kq); setTt(d); guiTV(payloadChot(d)); traFocusGame(); onXong(); bao('✓ Đã chốt — EXP đã vào tài khoản') }
              catch (e) { bao('❌ ' + (e as Error).message) } finally { setBan(null) }
            }} className="mt-2 w-full rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white disabled:opacity-40">✓ Chốt kết quả (DB xếp hạng + tính EXP)</button>
          ) : <p className="mt-1 text-[11px] text-slate-500">Chơi xong, TV tự gửi điểm về đây. Chưa thấy thì bấm 📨 Xin kết quả từ TV.</p>}
        </div>
      )}
      {msg && <div className="text-xs font-medium text-slate-600">{msg}</div>}
    </div>
  )
}
