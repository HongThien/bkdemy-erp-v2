// ============================================================================
// GayScreen — "Gậy của BK" (leaf `gay`). 5 tab:
//   BẢNG GẬY (công khai toàn công ty) · ĐỀ XUẤT (gậy tự động chờ leader chốt)
//   · ĐÁNH/GỠ (thủ công) · DANH MỤC (lỗi + hoạt động gỡ) · CHỐT THÁNG.
// Quyền: AI CŨNG XEM được bảng gậy (minh bạch — Thùy chốt 08-29); hành động
// (chốt đề xuất/đánh/gỡ/thu hồi/chốt tháng) chỉ leader theo cây tổ chức
// (getMyScope.laQuanLy, đúng phạm vi người dưới quyền) hoặc admin hệ thống.
// Style: scifi HUD design system (skill bkdemy-scifi-ui).
// ============================================================================
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { getMyScope, listNhanSu, type MyScope, type NhanSu } from '../../lib/nhansu'
import { myNhanSuId } from '../../lib/giaoviec'
import {
  GAY_DON_GIA, MA_LOI_CHAM_DEADLINE, kyHienTai, nhanKy,
  listGayLoi, createGayLoi, updateGayLoi, listGayHoatDong, createGayHoatDong, updateGayHoatDong,
  quetGayTuDong, listDeXuat, chotDeXuat, boQuaDeXuat,
  danhGayThuCong, goGay, thuHoiGay, bangGay, chotThang, listChotThang,
  type GayLoi, type GayHoatDong, type GayDeXuatFull, type BangGayRow, type GayChotThangFull,
} from '../../lib/gay'

type Tab = 'bang' | 'dexuat' | 'danhgo' | 'danhmuc' | 'chot'
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`
const nhanTre = (phut: number | null) => {
  if (phut == null) return ''
  if (phut < 60) return `${phut} phút`
  if (phut < 1440) return `${Math.floor(phut / 60)}h${phut % 60 ? ` ${phut % 60}p` : ''}`
  const d = Math.floor(phut / 1440), h = Math.floor((phut % 1440) / 60)
  return `${d} ngày${h ? ` ${h}h` : ''}`
}
const ddmmhh = (iso: string | null) => {
  if (!iso) return '—'
  const t = new Date(new Date(iso).getTime() + 7 * 3600000)
  return `${String(t.getUTCDate()).padStart(2, '0')}/${String(t.getUTCMonth() + 1).padStart(2, '0')} ${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`
}
// kỳ tháng ± n (ky = 'YYYY-MM-01')
const kyCong = (ky: string, n: number) => {
  const y = Number(ky.slice(0, 4)), m = Number(ky.slice(5, 7)) - 1 + n
  const yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12
  return `${yy}-${String(mm + 1).padStart(2, '0')}-01`
}

export default function GayScreen() {
  const quyen = useStore((s) => s.quyen)
  const [tab, setTab] = useState<Tab>('bang')
  const [ky, setKy] = useState(kyHienTai())
  const [scope, setScope] = useState<MyScope | null>(null)
  const [meId, setMeId] = useState<string>('')
  const [lois, setLois] = useState<GayLoi[]>([])
  const [hds, setHds] = useState<GayHoatDong[]>([])
  const [thongBao, setThongBao] = useState<{ ok: boolean; msg: string } | null>(null)

  const laAdmin = !!quyen?.laAdmin
  const canAct = laAdmin || !!scope?.laQuanLy
  // phạm vi người tôi được đánh/chốt: admin = mọi người; leader = người dưới trong cây
  const scopeIds = useMemo(() => new Set([...(scope?.giamSatTrucTiep ?? []), ...(scope?.giamSatSau ?? [])].map((r) => r.nhan_su_id)), [scope])
  const trongPhamVi = (nsId: string) => laAdmin || scopeIds.has(nsId)

  useEffect(() => {
    getMyScope().then(setScope).catch(() => setScope(null))
    myNhanSuId().then(setMeId).catch(() => setMeId(''))
    listGayLoi().then(setLois).catch(() => setLois([]))
    listGayHoatDong().then(setHds).catch(() => setHds([]))
  }, [])
  useEffect(() => {
    if (!thongBao) return
    const t = setTimeout(() => setThongBao(null), 4000)
    return () => clearTimeout(t)
  }, [thongBao])
  const bao = (ok: boolean, msg: string) => setThongBao({ ok, msg })

  const TABS: { key: Tab; ten: string; can?: boolean }[] = [
    { key: 'bang', ten: 'BẢNG GẬY' },
    { key: 'dexuat', ten: 'ĐỀ XUẤT' },
    { key: 'danhgo', ten: 'ĐÁNH / GỠ', can: canAct },
    { key: 'danhmuc', ten: 'DANH MỤC', can: canAct },
    { key: 'chot', ten: 'CHỐT THÁNG', can: canAct },
  ]

  return (
    <section className="min-h-0 overflow-auto" style={{
      background: '#030b0f',
      backgroundImage: 'linear-gradient(rgba(0,255,231,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,231,0.03) 1px, transparent 1px)',
      backgroundSize: '32px 32px', fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .gay-corner { position: absolute; width: 36px; height: 36px; z-index: 3; pointer-events: none; }
        .gay-corner::before, .gay-corner::after { content: ''; position: absolute; background: #00ffe7; box-shadow: 0 0 6px #00ffe7; }
        .gay-corner::before { width: 100%; height: 2px; top: 0; left: 0; }
        .gay-corner::after { width: 2px; height: 100%; top: 0; left: 0; }
        .gay-corner.tr { top: 0; right: 0; transform: scaleX(-1); }
        .gay-corner.bl { bottom: 0; left: 0; transform: scaleY(-1); }
        .gay-corner.br { bottom: 0; right: 0; transform: scale(-1); }
        .gay-live { font-size: 11px; letter-spacing: .12em; padding: 3px 10px; border: 1px solid #00ffe7; color: #00ffe7; border-radius: 3px; background: rgba(0,255,231,.06); animation: gay-pulse 2s ease-in-out infinite; }
        @keyframes gay-pulse { 0%,100% { box-shadow: 0 0 8px rgba(0,255,231,.2);} 50% { box-shadow: 0 0 18px rgba(0,255,231,.5);} }
        .gay-tbl { border-collapse: separate; border-spacing: 0; width: 100%; }
        .gay-tbl thead th { font-size: 12px; letter-spacing: .1em; color: #5a8a9a; font-weight: 600; padding: 0 8px 12px; text-align: left; border-bottom: 1px solid #0a1a20; }
        .gay-tbl tbody td { padding: 9px 8px; border-bottom: 1px solid #080f18; font-size: 13px; color: #b8d4dc; }
        .gay-tbl tbody tr:hover td { background: rgba(0,255,231,.025); }
        .gay-tog { padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: .12em; border: none; cursor: pointer; font-family: inherit; transition: all .2s; background: transparent; color: #334155; }
        .gay-tog.on { background: rgba(0,255,231,.08); color: #00ffe7; box-shadow: 0 0 10px rgba(0,255,231,.2); }
        .gay-btn { padding: 6px 14px; font-size: 11px; font-weight: 700; letter-spacing: .1em; border: 1px solid rgba(0,255,231,.5); color: #00ffe7; background: rgba(0,255,231,.08); border-radius: 4px; cursor: pointer; font-family: inherit; transition: all .15s; }
        .gay-btn:hover { box-shadow: 0 0 12px rgba(0,255,231,.35); }
        .gay-btn:disabled { opacity: .35; cursor: not-allowed; box-shadow: none; }
        .gay-btn.red { border-color: rgba(255,56,96,.5); color: #ff3860; background: rgba(255,56,96,.08); }
        .gay-btn.red:hover { box-shadow: 0 0 12px rgba(255,56,96,.3); }
        .gay-btn.amber { border-color: rgba(245,158,11,.5); color: #f59e0b; background: rgba(245,158,11,.08); }
        .gay-in { background: #050d10; border: 1px solid #1e2a3a; border-radius: 4px; color: #b8d4dc; padding: 6px 8px; font-size: 13px; font-family: inherit; outline: none; }
        .gay-in:focus { border-color: rgba(0,255,231,.5); box-shadow: 0 0 8px rgba(0,255,231,.15); }
        .gay-panel { position: relative; background: #060e14; border: 1px solid #0f2030; border-radius: 12px; padding: 18px; }
        .gay-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 30px; height: 26px; padding: 0 8px; border-radius: 4px; font-size: 12px; font-weight: 700; border: 1px solid; }
        .gay-chip.danh { background: rgba(255,56,96,.12); border-color: rgba(255,56,96,.5); color: #ff3860; }
        .gay-chip.go { background: rgba(0,255,231,.12); border-color: rgba(0,255,231,.5); color: #00ffe7; }
        .gay-chip.tien { background: rgba(245,158,11,.12); border-color: rgba(245,158,11,.5); color: #f59e0b; }
        .gay-chip.zero { background: transparent; border-color: #0f1a28; color: #334155; }
      `}</style>

      <div style={{ width: 'min(1100px, 94%)', margin: '20px auto 40px' }}>
        {/* ── Header HUD ── */}
        <div className="gay-panel" style={{ marginBottom: 14 }}>
          <div className="gay-corner tl" /><div className="gay-corner tr" /><div className="gay-corner bl" /><div className="gay-corner br" />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, letterSpacing: '.2em', color: '#00ffe7', textShadow: '0 0 16px rgba(0,255,231,.7), 0 0 4px #00ffe7' }}>▍GẬY CỦA BK</div>
              <div style={{ fontSize: 11, letterSpacing: '.14em', color: '#5a8a9a', marginTop: 4 }}>KỶ LUẬT VẬN HÀNH — 1 GẬY = {vnd(GAY_DON_GIA)} · RESET ĐẦU THÁNG</div>
            </div>
            <div className="gay-live">● {nhanKy(ky).toUpperCase()}</div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
              <button className="gay-btn" onClick={() => setKy(kyCong(ky, -1))}>‹</button>
              <button className="gay-btn" disabled={ky >= kyHienTai()} onClick={() => setKy(kyCong(ky, 1))}>›</button>
            </div>
          </div>
          <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #1e2a3a', marginTop: 14, width: 'fit-content' }}>
            {TABS.filter((t) => t.can !== false).map((t) => (
              <button key={t.key} className={`gay-tog ${tab === t.key ? 'on' : ''}`} onClick={() => setTab(t.key)}>{t.ten}</button>
            ))}
          </div>
        </div>

        {thongBao && (
          <div style={{
            marginBottom: 12, padding: '8px 14px', borderRadius: 6, fontSize: 12, letterSpacing: '.06em',
            border: `1px solid ${thongBao.ok ? 'rgba(0,255,231,.5)' : 'rgba(255,56,96,.5)'}`,
            color: thongBao.ok ? '#00ffe7' : '#ff3860', background: thongBao.ok ? 'rgba(0,255,231,.06)' : 'rgba(255,56,96,.06)',
          }}>{thongBao.msg}</div>
        )}

        {tab === 'bang' && <BangGayTab ky={ky} canAct={canAct} trongPhamVi={trongPhamVi} onBao={bao} />}
        {tab === 'dexuat' && <DeXuatTab lois={lois} canAct={canAct} laAdmin={laAdmin} scopeIds={scopeIds} meId={meId} onBao={bao} />}
        {tab === 'danhgo' && canAct && <DanhGoTab lois={lois} hds={hds} laAdmin={laAdmin} scopeIds={scopeIds} onBao={bao} />}
        {tab === 'danhmuc' && canAct && <DanhMucTab lois={lois} hds={hds} reload={async () => { setLois(await listGayLoi()); setHds(await listGayHoatDong()) }} onBao={bao} />}
        {tab === 'chot' && canAct && <ChotThangTab ky={ky} onBao={bao} />}
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — BẢNG GẬY (công khai): tổng theo người + drill chi tiết ledger
// ════════════════════════════════════════════════════════════════════════════
function BangGayTab({ ky, canAct, trongPhamVi, onBao }: {
  ky: string; canAct: boolean; trongPhamVi: (id: string) => boolean; onBao: (ok: boolean, msg: string) => void
}) {
  const [rows, setRows] = useState<BangGayRow[]>([])
  const [loading, setLoading] = useState(true)
  const [moNs, setMoNs] = useState<string | null>(null)
  const [thuHoiId, setThuHoiId] = useState<string | null>(null)
  const [thuHoiLyDo, setThuHoiLyDo] = useState('')

  const load = () => { setLoading(true); bangGay(ky).then(setRows).catch((e) => onBao(false, String(e.message ?? e))).finally(() => setLoading(false)) }
  useEffect(load, [ky])

  const lamThuHoi = async (id: string) => {
    try { await thuHoiGay(id, thuHoiLyDo); setThuHoiId(null); setThuHoiLyDo(''); onBao(true, 'Đã thu hồi.'); load() }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
  }

  return (
    <div className="gay-panel">
      <div className="gay-corner tl" /><div className="gay-corner tr" /><div className="gay-corner bl" /><div className="gay-corner br" />
      {loading ? <div style={{ color: '#5a8a9a', fontSize: 13 }}>ĐANG TẢI…</div> : !rows.length ? (
        <div style={{ color: '#5a8a9a', fontSize: 13, letterSpacing: '.08em' }}>◇ THÁNG NÀY CHƯA AI BỊ GẬY — SẠCH BÓNG.</div>
      ) : (
        <table className="gay-tbl">
          <thead><tr>
            <th style={{ width: 36 }}>#</th><th>NHÂN SỰ</th><th style={{ textAlign: 'center' }}>BỊ ĐÁNH</th>
            <th style={{ textAlign: 'center' }}>ĐÃ GỠ</th><th style={{ textAlign: 'center' }}>CÒN LẠI</th>
            <th style={{ textAlign: 'right' }}>TIỀN PHẠT</th><th style={{ width: 90 }} />
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <FragmentRow key={r.nhan_su_id} r={r} i={i} mo={moNs === r.nhan_su_id} onMo={() => setMoNs(moNs === r.nhan_su_id ? null : r.nhan_su_id)}
                canAct={canAct} trongPhamVi={trongPhamVi} thuHoiId={thuHoiId} setThuHoiId={setThuHoiId}
                thuHoiLyDo={thuHoiLyDo} setThuHoiLyDo={setThuHoiLyDo} lamThuHoi={lamThuHoi} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function FragmentRow({ r, i, mo, onMo, canAct, trongPhamVi, thuHoiId, setThuHoiId, thuHoiLyDo, setThuHoiLyDo, lamThuHoi }: {
  r: BangGayRow; i: number; mo: boolean; onMo: () => void; canAct: boolean; trongPhamVi: (id: string) => boolean
  thuHoiId: string | null; setThuHoiId: (v: string | null) => void; thuHoiLyDo: string; setThuHoiLyDo: (v: string) => void
  lamThuHoi: (id: string) => void
}) {
  return (
    <>
      <tr style={{ cursor: 'pointer' }} onClick={onMo}>
        <td style={{ color: '#334155' }}>{String(i + 1).padStart(2, '0')}</td>
        <td style={{ color: '#e2f4f8', fontSize: 14 }}>{r.ns_ten}</td>
        <td style={{ textAlign: 'center' }}><span className={`gay-chip ${r.soGayDanh ? 'danh' : 'zero'}`}>{r.soGayDanh}</span></td>
        <td style={{ textAlign: 'center' }}><span className={`gay-chip ${r.soGayGo ? 'go' : 'zero'}`}>{r.soGayGo}</span></td>
        <td style={{ textAlign: 'center' }}>
          <span className={`gay-chip ${r.conLai ? 'danh' : 'go'}`} style={r.conLai ? { boxShadow: '0 0 10px rgba(255,56,96,.35)' } : {}}>{r.conLai}</span>
        </td>
        <td style={{ textAlign: 'right' }}><span className={`gay-chip ${r.tienPhat ? 'tien' : 'zero'}`}>{vnd(r.tienPhat)}</span></td>
        <td style={{ textAlign: 'right', color: '#5a8a9a', fontSize: 11, letterSpacing: '.08em' }}>{mo ? '▲ ĐÓNG' : '▼ CHI TIẾT'}</td>
      </tr>
      {mo && (
        <tr><td colSpan={7} style={{ padding: 0, background: '#040a10' }}>
          <div style={{ padding: '10px 16px 14px' }}>
            {r.entries.map((e) => (
              <div key={e.id} style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '7px 10px', marginTop: 6,
                borderLeft: `2px solid ${e.thu_hoi_at ? '#334155' : e.so_gay < 0 ? '#00ffe7' : e.loai === 'tu_dong' ? '#f59e0b' : '#ff3860'}`,
                background: 'rgba(255,255,255,.015)', borderRadius: 4, fontSize: 12,
                opacity: e.thu_hoi_at ? 0.45 : 1, textDecoration: e.thu_hoi_at ? 'line-through' : 'none',
              }}>
                <span style={{ color: e.so_gay < 0 ? '#00ffe7' : '#ff3860', fontWeight: 700, minWidth: 34 }}>{e.so_gay > 0 ? `+${e.so_gay}` : e.so_gay}</span>
                <span style={{ color: '#5a8a9a', letterSpacing: '.06em', fontSize: 10 }}>{e.loai === 'tu_dong' ? 'AUTO' : e.loai === 'go' ? 'GỠ' : 'TAY'}</span>
                <span style={{ color: '#b8d4dc' }}>{e.so_gay < 0 ? e.hoat_dong_ten : e.loi_ten}{e.ly_do ? ` — ${e.ly_do}` : ''}</span>
                <span style={{ marginLeft: 'auto', color: '#5a8a9a', fontSize: 11 }}>{ddmmhh(e.created_at)} · {e.nguoi_tao_ten}</span>
                {e.thu_hoi_at ? <span style={{ color: '#f59e0b', fontSize: 10 }}>ĐÃ THU HỒI: {e.thu_hoi_ly_do}</span>
                  : canAct && trongPhamVi(r.nhan_su_id) && (
                    thuHoiId === e.id ? (
                      <span style={{ display: 'inline-flex', gap: 6 }} onClick={(ev) => ev.stopPropagation()}>
                        <input className="gay-in" style={{ width: 160, padding: '3px 6px', fontSize: 11 }} placeholder="lý do thu hồi…" value={thuHoiLyDo} onChange={(ev) => setThuHoiLyDo(ev.target.value)} />
                        <button className="gay-btn red" style={{ padding: '3px 8px', fontSize: 10 }} disabled={!thuHoiLyDo.trim()} onClick={() => lamThuHoi(e.id)}>XÁC NHẬN</button>
                        <button className="gay-btn" style={{ padding: '3px 8px', fontSize: 10 }} onClick={() => setThuHoiId(null)}>HUỶ</button>
                      </span>
                    ) : (
                      <button className="gay-btn" style={{ padding: '3px 8px', fontSize: 10 }} onClick={(ev) => { ev.stopPropagation(); setThuHoiId(e.id); setThuHoiLyDo('') }}>THU HỒI</button>
                    )
                  )}
              </div>
            ))}
          </div>
        </td></tr>
      )}
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — ĐỀ XUẤT gậy tự động: mở tab là QUÉT (lazy, idempotent) rồi liệt kê 'cho'.
// Leader chỉ thao tác được người TRONG PHẠM VI mình; người ngoài phạm vi chỉ xem.
// ════════════════════════════════════════════════════════════════════════════
function DeXuatTab({ lois, canAct, laAdmin, scopeIds, meId, onBao }: {
  lois: GayLoi[]; canAct: boolean; laAdmin: boolean; scopeIds: Set<string>; meId: string; onBao: (ok: boolean, msg: string) => void
}) {
  const [dxs, setDxs] = useState<GayDeXuatFull[]>([])
  const [loading, setLoading] = useState(true)
  const [soGayById, setSoGayById] = useState<Record<string, number>>({})
  const [loiById, setLoiById] = useState<Record<string, string>>({})
  const [boQuaId, setBoQuaId] = useState<string | null>(null)
  const [boQuaLyDo, setBoQuaLyDo] = useState('')
  const loiChamDeadline = lois.find((l) => l.ma === MA_LOI_CHAM_DEADLINE)?.id ?? lois[0]?.id ?? ''

  const load = async () => {
    setLoading(true)
    try {
      await quetGayTuDong() // quét lazy — idempotent nhờ ref_key unique
      setDxs(await listDeXuat('cho'))
    } catch (e: any) { onBao(false, String(e.message ?? e)) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  // leader thấy người dưới quyền + CHÍNH MÌNH (chỉ xem); admin thấy hết
  const hien = dxs.filter((d) => laAdmin || scopeIds.has(d.nhan_su_id) || d.nhan_su_id === meId)

  const lamChot = async (d: GayDeXuatFull) => {
    try {
      await chotDeXuat(d, { soGay: soGayById[d.id] ?? d.so_gay, loiId: loiById[d.id] ?? loiChamDeadline })
      onBao(true, `Đã đánh ${soGayById[d.id] ?? d.so_gay} gậy cho ${d.ns_ten}.`)
      setDxs((p) => p.filter((x) => x.id !== d.id))
    } catch (e: any) { onBao(false, String(e.message ?? e)); load() }
  }
  const lamBoQua = async (d: GayDeXuatFull) => {
    try {
      await boQuaDeXuat(d.id, boQuaLyDo)
      onBao(true, 'Đã bỏ qua đề xuất.')
      setBoQuaId(null); setBoQuaLyDo('')
      setDxs((p) => p.filter((x) => x.id !== d.id))
    } catch (e: any) { onBao(false, String(e.message ?? e)); load() }
  }

  return (
    <div className="gay-panel">
      <div className="gay-corner tl" /><div className="gay-corner tr" /><div className="gay-corner bl" /><div className="gay-corner br" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 12, letterSpacing: '.12em', color: '#f59e0b' }}>⚠ MÁY ĐỀ XUẤT — NGƯỜI CHỐT. CHƯA CHỐT = CHƯA THÀNH GẬY.</span>
        <button className="gay-btn" style={{ marginLeft: 'auto' }} onClick={load}>↻ QUÉT LẠI</button>
      </div>
      {loading ? <div style={{ color: '#5a8a9a', fontSize: 13 }}>ĐANG QUÉT DEADLINE ERP…</div> : !hien.length ? (
        <div style={{ color: '#5a8a9a', fontSize: 13, letterSpacing: '.08em' }}>◇ KHÔNG CÓ ĐỀ XUẤT NÀO CHỜ XỬ LÝ.</div>
      ) : hien.map((d) => {
        const duocLam = canAct && (laAdmin || scopeIds.has(d.nhan_su_id))
        return (
          <div key={d.id} style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '10px 12px', marginTop: 8,
            border: '1px solid #0f2030', borderLeft: '3px solid #f59e0b', borderRadius: 6, background: 'rgba(245,158,11,.03)',
          }}>
            <div style={{ minWidth: 220, flex: 1 }}>
              <div style={{ color: '#e2f4f8', fontSize: 14 }}>{d.ns_ten}</div>
              <div style={{ color: '#b8d4dc', fontSize: 12, marginTop: 2 }}>{d.mo_ta}</div>
              <div style={{ color: '#5a8a9a', fontSize: 11, marginTop: 2 }}>
                {d.nguon === 'vanhanh' ? 'VẬN HÀNH' : 'GIAO VIỆC'} · hạn {ddmmhh(d.deadline_at)} · <span style={{ color: '#ff3860' }}>trễ {nhanTre(d.tre_phut)}</span>
              </div>
            </div>
            {duocLam ? (
              boQuaId === d.id ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input className="gay-in" style={{ width: 200 }} placeholder="lý do bỏ qua (bắt buộc)…" value={boQuaLyDo} onChange={(e) => setBoQuaLyDo(e.target.value)} autoFocus />
                  <button className="gay-btn amber" disabled={!boQuaLyDo.trim()} onClick={() => lamBoQua(d)}>XÁC NHẬN BỎ QUA</button>
                  <button className="gay-btn" onClick={() => { setBoQuaId(null); setBoQuaLyDo('') }}>HUỶ</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select className="gay-in" value={loiById[d.id] ?? loiChamDeadline} onChange={(e) => setLoiById((p) => ({ ...p, [d.id]: e.target.value }))}>
                    {lois.map((l) => <option key={l.id} value={l.id}>{l.ten}</option>)}
                  </select>
                  <input className="gay-in" type="number" min={1} style={{ width: 58, textAlign: 'center' }}
                    value={soGayById[d.id] ?? d.so_gay} onChange={(e) => setSoGayById((p) => ({ ...p, [d.id]: Math.max(1, Number(e.target.value) || 1) }))} />
                  <button className="gay-btn red" onClick={() => lamChot(d)}>ĐÁNH GẬY</button>
                  <button className="gay-btn" onClick={() => { setBoQuaId(d.id); setBoQuaLyDo('') }}>BỎ QUA</button>
                </div>
              )
            ) : <span style={{ fontSize: 10, letterSpacing: '.1em', color: '#334155' }}>CHỜ LEADER XỬ LÝ</span>}
          </div>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 3 — ĐÁNH / GỠ thủ công (leader): 2 panel song song
// ════════════════════════════════════════════════════════════════════════════
function DanhGoTab({ lois, hds, laAdmin, scopeIds, onBao }: {
  lois: GayLoi[]; hds: GayHoatDong[]; laAdmin: boolean; scopeIds: Set<string>; onBao: (ok: boolean, msg: string) => void
}) {
  const [nsAll, setNsAll] = useState<NhanSu[]>([])
  useEffect(() => { listNhanSu().then((l) => setNsAll(l.filter((n) => n.trang_thai === 'dang_lam'))).catch(() => setNsAll([])) }, [])
  const chonDuoc = nsAll.filter((n) => laAdmin || scopeIds.has(n.id))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
      <FormDanhGo mode="danh" ds={chonDuoc} muc={lois.map((l) => ({ id: l.id, ten: l.ten, macDinh: l.so_gay_mac_dinh }))} onBao={onBao} />
      <FormDanhGo mode="go" ds={chonDuoc} muc={hds.map((h) => ({ id: h.id, ten: h.ten, macDinh: h.so_gay_mac_dinh }))} onBao={onBao} />
    </div>
  )
}

function FormDanhGo({ mode, ds, muc, onBao }: {
  mode: 'danh' | 'go'; ds: NhanSu[]; muc: { id: string; ten: string; macDinh: number }[]; onBao: (ok: boolean, msg: string) => void
}) {
  const [nsId, setNsId] = useState(''); const [mucId, setMucId] = useState(''); const [soGay, setSoGay] = useState(1)
  const [lyDo, setLyDo] = useState(''); const [dangLuu, setDangLuu] = useState(false)
  const laDanh = mode === 'danh'
  useEffect(() => { if (!mucId && muc.length) setMucId(muc[0].id) }, [muc])
  useEffect(() => { const m = muc.find((x) => x.id === mucId); if (m) setSoGay(m.macDinh) }, [mucId])

  const luu = async () => {
    setDangLuu(true)
    try {
      if (laDanh) await danhGayThuCong({ nhanSuId: nsId, loiId: mucId, soGay, lyDo })
      else await goGay({ nhanSuId: nsId, hoatDongId: mucId, soGay, lyDo })
      onBao(true, laDanh ? `Đã đánh ${soGay} gậy.` : `Đã gỡ ${soGay} gậy.`)
      setNsId(''); setLyDo('')
    } catch (e: any) { onBao(false, String(e.message ?? e)) }
    setDangLuu(false)
  }

  return (
    <div className="gay-panel" style={{ borderTop: `2px solid ${laDanh ? '#ff3860' : '#00ffe7'}` }}>
      <div style={{ fontSize: 13, letterSpacing: '.16em', color: laDanh ? '#ff3860' : '#00ffe7', textShadow: laDanh ? '0 0 8px rgba(255,56,96,.5)' : '0 0 8px rgba(0,255,231,.5)', marginBottom: 12 }}>
        {laDanh ? '▼ ĐÁNH GẬY (lỗi ngoài ERP / sai quy trình)' : '▲ GỠ GẬY (hoạt động chuộc lỗi)'}
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <select className="gay-in" value={nsId} onChange={(e) => setNsId(e.target.value)}>
          <option value="">— chọn nhân sự —</option>
          {ds.map((n) => <option key={n.id} value={n.id}>{n.ho_ten}{n.ma_ns ? ` (${n.ma_ns})` : ''}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="gay-in" style={{ flex: 1 }} value={mucId} onChange={(e) => setMucId(e.target.value)}>
            {muc.map((m) => <option key={m.id} value={m.id}>{m.ten}</option>)}
          </select>
          <input className="gay-in" type="number" min={1} style={{ width: 70, textAlign: 'center' }} value={soGay} onChange={(e) => setSoGay(Math.max(1, Number(e.target.value) || 1))} />
        </div>
        <input className="gay-in" placeholder="ghi chú / lý do…" value={lyDo} onChange={(e) => setLyDo(e.target.value)} />
        <button className={`gay-btn ${laDanh ? 'red' : ''}`} disabled={!nsId || !mucId || dangLuu} onClick={luu}>
          {dangLuu ? 'ĐANG GHI…' : laDanh ? `ĐÁNH ${soGay} GẬY` : `GỠ ${soGay} GẬY`}
        </button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 4 — DANH MỤC lỗi + hoạt động gỡ (CEO yêu cầu tự thêm/sửa qua UI)
// ════════════════════════════════════════════════════════════════════════════
function DanhMucTab({ lois, hds, reload, onBao }: {
  lois: GayLoi[]; hds: GayHoatDong[]; reload: () => Promise<void>; onBao: (ok: boolean, msg: string) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
      <PanelDanhMuc tieuDe="▼ DANH MỤC LỖI" mau="#ff3860" items={lois}
        onAdd={async (p) => { await createGayLoi(p); await reload() }}
        onUpdate={async (id, patch) => { await updateGayLoi(id, patch); await reload() }} onBao={onBao} />
      <PanelDanhMuc tieuDe="▲ HOẠT ĐỘNG GỠ GẬY" mau="#00ffe7" items={hds}
        onAdd={async (p) => { await createGayHoatDong(p); await reload() }}
        onUpdate={async (id, patch) => { await updateGayHoatDong(id, patch); await reload() }} onBao={onBao} />
    </div>
  )
}

function PanelDanhMuc({ tieuDe, mau, items, onAdd, onUpdate, onBao }: {
  tieuDe: string; mau: string; items: { id: string; ten: string; so_gay_mac_dinh: number; active: boolean; ma?: string | null }[]
  onAdd: (p: { ten: string; so_gay_mac_dinh: number }) => Promise<void>
  onUpdate: (id: string, patch: { ten?: string; so_gay_mac_dinh?: number; active?: boolean }) => Promise<void>
  onBao: (ok: boolean, msg: string) => void
}) {
  const [ten, setTen] = useState(''); const [soGay, setSoGay] = useState(1)
  const them = async () => {
    try { await onAdd({ ten, so_gay_mac_dinh: soGay }); setTen(''); setSoGay(1); onBao(true, 'Đã thêm.') }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
  }
  return (
    <div className="gay-panel" style={{ borderTop: `2px solid ${mau}` }}>
      <div style={{ fontSize: 13, letterSpacing: '.16em', color: mau, marginBottom: 12 }}>{tieuDe}</div>
      {items.map((it) => (
        <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #080f18', fontSize: 13, color: '#b8d4dc', opacity: it.active ? 1 : 0.4 }}>
          <span style={{ flex: 1 }}>{it.ten}{'ma' in it && it.ma ? <span style={{ color: '#5a8a9a', fontSize: 10 }}> · HỆ THỐNG</span> : ''}</span>
          <input className="gay-in" type="number" min={1} style={{ width: 56, textAlign: 'center', padding: '3px 4px' }} value={it.so_gay_mac_dinh}
            onChange={async (e) => { const v = Math.max(1, Number(e.target.value) || 1); try { await onUpdate(it.id, { so_gay_mac_dinh: v }) } catch (er: any) { onBao(false, String(er.message ?? er)) } }} />
          <button className="gay-btn" style={{ padding: '3px 8px', fontSize: 10 }}
            onClick={async () => { try { await onUpdate(it.id, { active: !it.active }) } catch (er: any) { onBao(false, String(er.message ?? er)) } }}>
            {it.active ? 'ẨN' : 'HIỆN'}
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input className="gay-in" style={{ flex: 1 }} placeholder="tên mới…" value={ten} onChange={(e) => setTen(e.target.value)} />
        <input className="gay-in" type="number" min={1} style={{ width: 56, textAlign: 'center' }} value={soGay} onChange={(e) => setSoGay(Math.max(1, Number(e.target.value) || 1))} />
        <button className="gay-btn" disabled={!ten.trim()} onClick={them}>+ THÊM</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 5 — CHỐT THÁNG: preview từ ledger → snapshot vào gay_chot_thang
// ════════════════════════════════════════════════════════════════════════════
function ChotThangTab({ ky, onBao }: { ky: string; onBao: (ok: boolean, msg: string) => void }) {
  const [preview, setPreview] = useState<BangGayRow[]>([])
  const [daChot, setDaChot] = useState<GayChotThangFull[]>([])
  const [loading, setLoading] = useState(true)
  const [dangChot, setDangChot] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([bangGay(ky), listChotThang(ky)])
      .then(([b, c]) => { setPreview(b); setDaChot(c) })
      .catch((e) => onBao(false, String(e.message ?? e)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [ky])

  const lamChot = async () => {
    setDangChot(true)
    try { const n = await chotThang(ky); onBao(true, `Đã chốt ${nhanKy(ky)} — ${n} nhân sự.`); load() }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
    setDangChot(false)
  }
  const tongTien = preview.reduce((s, r) => s + r.tienPhat, 0)

  return (
    <div className="gay-panel">
      <div className="gay-corner tl" /><div className="gay-corner tr" /><div className="gay-corner bl" /><div className="gay-corner br" />
      {loading ? <div style={{ color: '#5a8a9a', fontSize: 13 }}>ĐANG TẢI…</div> : (
        <>
          {daChot.length > 0 && (
            <div style={{ marginBottom: 14, padding: '8px 12px', border: '1px solid rgba(0,255,231,.35)', borderRadius: 6, fontSize: 12, color: '#00ffe7', background: 'rgba(0,255,231,.05)' }}>
              ✓ {nhanKy(ky).toUpperCase()} ĐÃ CHỐT lúc {ddmmhh(daChot[0].chot_at)} bởi {daChot[0].nguoi_chot_ten} — {daChot.length} nhân sự, tổng {vnd(daChot.reduce((s, r) => s + r.tien_phat, 0))}. Chốt lại sẽ GHI ĐÈ theo số liệu hiện tại.
            </div>
          )}
          {!preview.length ? <div style={{ color: '#5a8a9a', fontSize: 13, letterSpacing: '.08em' }}>◇ KHÔNG CÓ GẬY NÀO TRONG KỲ NÀY.</div> : (
            <>
              <table className="gay-tbl">
                <thead><tr><th>NHÂN SỰ</th><th style={{ textAlign: 'center' }}>BỊ ĐÁNH</th><th style={{ textAlign: 'center' }}>ĐÃ GỠ</th><th style={{ textAlign: 'center' }}>CHỐT</th><th style={{ textAlign: 'right' }}>PHẢI ĐÓNG</th></tr></thead>
                <tbody>
                  {preview.map((r) => (
                    <tr key={r.nhan_su_id}>
                      <td style={{ color: '#e2f4f8' }}>{r.ns_ten}</td>
                      <td style={{ textAlign: 'center' }}>{r.soGayDanh}</td>
                      <td style={{ textAlign: 'center' }}>{r.soGayGo}</td>
                      <td style={{ textAlign: 'center', color: r.conLai ? '#ff3860' : '#00ffe7', fontWeight: 700 }}>{r.conLai}</td>
                      <td style={{ textAlign: 'right' }}><span className={`gay-chip ${r.tienPhat ? 'tien' : 'zero'}`}>{vnd(r.tienPhat)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
                <span style={{ fontSize: 13, color: '#f59e0b', letterSpacing: '.08em' }}>TỔNG THU: <b>{vnd(tongTien)}</b> ({vnd(GAY_DON_GIA)}/gậy)</span>
                <button className="gay-btn amber" style={{ marginLeft: 'auto' }} disabled={dangChot} onClick={lamChot}>
                  {dangChot ? 'ĐANG CHỐT…' : `⚑ CHỐT ${nhanKy(ky).toUpperCase()}`}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
