// BẢNG THÀNH TÍCH (showcase, GAME style "Mythwings") — áp design từ claude design (BKdemy_Profile).
// Dùng chung: màn Thành tích (full-screen) + tab Học sinh. Nền tối, Baloo 2; data THẬT pure-derive.
// Danh hiệu = 3 nguyên tố (thunder/fire/frost) × cấp 1-5 (chim + nền nguyên tố + sao) — PLACEHOLDER
// cấp/% tới khi define điều kiện. Ảnh chim: public/mythwings/phoenix_{thunder,fire,frost}.png.
import { useEffect, useState } from 'react'
import { getThanhTich, type ThanhTich } from '../../lib/gami'
import { getLevelXu, type LevelXu } from '../../lib/thanhtich'
import { avatarStage } from '../../gami/level.js'

type El = 'thunder' | 'fire' | 'frost'
const BIRD: Record<El, string> = { thunder: '/mythwings/phoenix_thunder.png', fire: '/mythwings/phoenix_fire.png', frost: '/mythwings/phoenix_frost.png' }
const NAMES: Record<El, [string, string, string]> = {
  thunder: ['Sparkwing', 'Stormcaller', 'Thunderbird'],
  fire: ['Emberling', 'Flamewing', 'Phoenix'],
  frost: ['Frostling', 'Glacewing', 'Frostwing'],
}
const nameForLevel = (el: El, lv: number) => NAMES[el][lv >= 5 ? 2 : lv >= 3 ? 1 : 0]

// 3 danh hiệu mùa (điều kiện thật chờ define → cấp/% placeholder).
const DANH_HIEU: { el: El; rarity: string; mean: string }[] = [
  { el: 'thunder', rarity: 'Thành tích', mean: 'Thi vượt band điểm của mình' },
  { el: 'fire', rarity: 'Nỗ lực', mean: 'Tự luyện tập thêm ngoài giờ' },
  { el: 'frost', rarity: 'Chăm chỉ', mean: 'Giữ chuỗi hoàn thành bài tập' },
]

export default function BangThanhTich({ hocSinhId, hoTen, maHs, khoi }: { hocSinhId: string; hoTen?: string; maHs?: string | null; khoi?: string | null }) {
  const [tt, setTt] = useState<ThanhTich | null>(null)
  const [loading, setLoading] = useState(true)
  const [mon, setMon] = useState('')
  const [lx, setLx] = useState<LevelXu | null>(null)

  useEffect(() => {
    let live = true
    setLoading(true); setTt(null)
    getThanhTich(hocSinhId).then((r) => { if (!live) return; setTt(r); setMon(r.mons[0]?.mon ?? '') }).finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [hocSinhId])

  useEffect(() => {
    if (!mon) { setLx(null); return }
    let live = true; setLx(null)
    getLevelXu(hocSinhId, mon).then((r) => { if (live) setLx(r) }).catch(() => {})
    return () => { live = false }
  }, [hocSinhId, mon])

  const cur = tt?.mons.find((m) => m.mon === mon) ?? tt?.mons[0] ?? null
  const lv = lx?.level ?? 0
  const xpPct = lx?.expKeMoc ? Math.min(100, Math.round((lx.expThang / lx.expKeMoc) * 100)) : 100

  return (
    <div className="bkprofile">
      <style>{CSS}</style>
      {loading ? (
        <div className="bp-empty">Đang tải thành tích…</div>
      ) : !tt || !cur ? (
        <div className="bp-empty">{hoTen ? <b>{hoTen}</b> : 'Học sinh'} chưa có thành tích. Điểm sinh khi đóng buổi.</div>
      ) : (
        <div className="bp-wrap">
          <div className="bp-grid">
            {/* IDENTITY + METERS */}
            <div className="bp-panel">
              <div className="bp-id-row">
                <div className="bp-avatar"><div className="bp-face">{avatarStage(lv || 1).emoji}</div></div>
                <div className="bp-id-fields">
                  <div className="bp-field"><div className="bp-nm">{hoTen ?? 'Học sinh'}</div></div>
                  <div className="bp-field bp-sub"><span className="bp-lab">Mã HS:</span><span className="bp-val">{maHs ?? '—'}{khoi ? ` · Khối ${khoi}` : ''}</span></div>
                  <div className="bp-subjects">
                    {tt.mons.map((m) => <span key={m.mon} className={`bp-subj${m.mon === cur.mon ? ' on' : ''}`} onClick={() => setMon(m.mon)}>{m.mon}</span>)}
                  </div>
                </div>
              </div>
              <div className="bp-meters">
                <Gem grad="gy" label="LV" labCol="#7a4d04" numCol="#3a2400" value={lv} />
                <Gem grad="gm" label="HẠNG" labCol="#fff" numCol="#5a0a48" value={`#${cur.rankNow}`} />
                <div className="bp-xpwrap">
                  <div className="bp-xphex"><Hex /><b>{lx?.xu ?? 0}</b></div>
                  <div className="bp-xpbar"><i style={{ width: `${xpPct}%` }} /><span>💰 {lx?.expThang?.toLocaleString('vi-VN') ?? 0} EXP{lx?.expKeMoc != null ? ` → ${lx.xuKe} xu` : ''}</span></div>
                </div>
                <div className="bp-trophy"><span className="bp-ic">🏆</span><span>{cur.elo}</span></div>
              </div>
            </div>

            {/* THÀNH TÍCH THI ĐẤU */}
            <div className="bp-panel">
              <div className="bp-bf-title">⚔️ Thành tích thi đấu</div>
              <div className="bp-bf-row first"><span className="l">🥇 Top 1 · Lớp</span><span className="n">{cur.top1.lop}</span></div>
              <div className="bp-bf-row"><span className="l">🥇 Top 1 · ET</span><span className="n">{cur.top1.et}</span></div>
              <div className="bp-bf-row"><span className="l">🥇 Top 1 · MT</span><span className="n">{cur.top1.mt}</span></div>
              <div className="bp-bf-row"><span className="l">📈 Elo đỉnh</span><span className="n">{cur.eloPeak}</span></div>
              <div className="bp-bf-row streak"><span className="l">🔥 Chuỗi đi học</span><span className="n">{cur.chuoiDiHoc}</span></div>
              <div className="bp-bf-row total"><span className="l">Tổng buổi</span><span className="n">{cur.tongBuoi}</span></div>
            </div>
          </div>

          <div className="bp-divider"><h2>⭐ DANH HIỆU MÙA</h2></div>

          <div className="bp-hcards">
            {DANH_HIEU.map((d) => <HCard key={d.el} {...d} cap={1} pct={0} />)}
          </div>

          <div className="bp-seasonchip">🏆 {tt.seasonLabel} · <b>Mythwings</b></div>
        </div>
      )}
    </div>
  )
}

function Gem({ grad, label, labCol, numCol, value }: { grad: string; label: string; labCol: string; numCol: string; value: number | string }) {
  const stops = grad === 'gy' ? ['#ffe06a', '#f0a316'] : ['#ff9be8', '#d23ab6']
  return (
    <div className="bp-gem">
      <svg viewBox="0 0 80 80"><defs><linearGradient id={`bp_${grad}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={stops[0]} /><stop offset="1" stopColor={stops[1]} /></linearGradient></defs>
        <path d="M40 4 L70 24 L70 56 L40 76 L10 56 L10 24 Z" fill={`url(#bp_${grad})`} stroke="#fff" strokeWidth="4" strokeLinejoin="round" /></svg>
      <div className="bp-t"><small style={{ color: labCol }}>{label}</small><b style={{ color: numCol }}>{value}</b></div>
    </div>
  )
}
const Hex = () => (
  <svg viewBox="0 0 60 60"><defs><linearGradient id="bp_gh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fe0ff" /><stop offset="1" stopColor="#2e9bff" /></linearGradient></defs>
    <path d="M30 3 L52 16 L52 44 L30 57 L8 44 L8 16 Z" fill="url(#bp_gh)" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" /></svg>
)

function HCard({ el, rarity, mean, cap, pct }: { el: El; rarity: string; mean: string; cap: number; pct: number }) {
  return (
    <div className={`bp-hcard ${el}`}>
      <div className="bp-htop"><span className="bp-rarity">{rarity}</span><span className="bp-lvtag">CẤP {cap}</span></div>
      <div className="bp-htile"><div className="bp-inner">
        <div className="bp-deco" dangerouslySetInnerHTML={{ __html: backdrop(el) }} />
        <div className="bp-bird"><img src={BIRD[el]} alt={el} /></div>
      </div></div>
      <div className="bp-hname">{nameForLevel(el, cap)}</div>
      <div className="bp-hmean">{mean}</div>
      <div className="bp-stars" dangerouslySetInnerHTML={{ __html: starsHtml(cap) }} />
      <div className="bp-prog2"><div className="bp-pb"><i style={{ width: `${pct}%` }} /></div><div className="bp-cap"><span>Tới Cấp {Math.min(5, cap + 1)}</span><span>{pct}%</span></div></div>
    </div>
  )
}

// ── SVG helpers (port từ design) ──
const rotp = (cx: number, cy: number, x: number, y: number, deg: number) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), dx = x - cx, dy = y - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c] }
const vec = (a: number, len: number) => [Math.cos(a * Math.PI / 180) * len, Math.sin(a * Math.PI / 180) * len]
const DC: Record<El, { glow: string; sym: string }> = { thunder: { glow: '#ffcf3a', sym: '#ffe27a' }, fire: { glow: '#ff6a2a', sym: '#ff8a3a' }, frost: { glow: '#5bb8ff', sym: '#d4ecff' } }
function backdrop(element: El): string {
  const C = DC[element]; const cx = 120, cy = 120; let sym = ''
  if (element === 'thunder') {
    sym = `<path d="M162 2 L86 118 L130 118 L74 238 L176 98 L126 98 Z" fill="${C.sym}" opacity=".5" stroke="#fff7c8" stroke-width="3" stroke-linejoin="round" stroke-opacity=".55"/>`
  } else if (element === 'fire') {
    const flame = (dx: number, h: number, w: number) => `M${cx + dx},${cy + 100} C ${cx + dx - w},${cy + 42} ${cx + dx - w * 0.4},${cy + 8} ${cx + dx},${cy - h} C ${cx + dx + w * 0.4},${cy + 8} ${cx + dx + w},${cy + 42} ${cx + dx},${cy + 100} Z`
    sym = `<path d="${flame(0, 116, 62)}" fill="${C.sym}" opacity=".4"/><path d="${flame(0, 84, 40)}" fill="#ffd24a" opacity=".42"/><path d="${flame(-36, 56, 26)}" fill="${C.sym}" opacity=".3"/><path d="${flame(36, 56, 26)}" fill="${C.sym}" opacity=".3"/>`
  } else {
    const R = 104; let g = ''
    for (let i = 0; i < 6; i++) {
      const a = i * 60; const tip = rotp(cx, cy, cx + R, cy, a)
      g += `<line x1="${cx}" y1="${cy}" x2="${tip[0].toFixed(1)}" y2="${tip[1].toFixed(1)}" stroke="${C.sym}" stroke-width="6" stroke-linecap="round"/>`
      ;([[0.5, 24], [0.75, 17]] as [number, number][]).forEach(([t, bl]) => { const base = rotp(cx, cy, cx + R * t, cy, a)
        ;[60, -60].forEach((off) => { const v = vec(a + off, bl); g += `<line x1="${base[0].toFixed(1)}" y1="${base[1].toFixed(1)}" x2="${(base[0] + v[0]).toFixed(1)}" y2="${(base[1] + v[1]).toFixed(1)}" stroke="${C.sym}" stroke-width="4.5" stroke-linecap="round"/>` }) })
    }
    sym = `<g opacity=".5">${g}</g><circle cx="${cx}" cy="${cy}" r="7" fill="${C.sym}" opacity=".6"/>`
  }
  return `<svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="bpgd_${element}" cx="50%" cy="46%" r="58%"><stop offset="0" stop-color="${C.glow}" stop-opacity=".5"/><stop offset="1" stop-color="${C.glow}" stop-opacity="0"/></radialGradient></defs><rect width="240" height="240" fill="url(#bpgd_${element})"/>${sym}</svg>`
}
const starSvg = (on: boolean) => `<svg viewBox="0 0 24 24"><path d="M12 2 L15 9 L22 9.6 L16.8 14.3 L18.4 21 L12 17.3 L5.6 21 L7.2 14.3 L2 9.6 L9 9 Z" fill="${on ? '#ffd23a' : '#2c365c'}" stroke="${on ? '#b97e08' : '#1a2142'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`
const starsHtml = (n: number) => Array.from({ length: 5 }, (_, i) => `<i>${starSvg(i < n)}</i>`).join('')

const CSS = `
.bkprofile{ --panel:#222b50; --inset:#171e3e; --field:#161d3c; --line2:rgba(255,255,255,.18);
  --txt:#fff; --mut:#97a3d4; --gold:#ffb01f; --orange:#ff8a2b;
  --el-thunder:#ffc21f; --el-fire:#ff5a35; --el-frost:#46b6ff;
  font-family:'Be Vietnam Pro',sans-serif; color:var(--txt); border-radius:22px; overflow:hidden;
  background:radial-gradient(1000px 600px at 50% -8%, #2a2660 0%, transparent 55%), radial-gradient(800px 600px at 88% 108%, #143a52 0%, transparent 50%), linear-gradient(180deg,#151b3a,#0a0f22); }
.bkprofile *{ box-sizing:border-box; }
.bkprofile .bp-empty{ padding:48px 24px; text-align:center; color:var(--mut); font-family:'Be Vietnam Pro'; }
.bkprofile .bp-wrap{ padding:20px; }
.bkprofile .bp-grid{ display:grid; grid-template-columns:1.35fr 1fr; gap:16px; }
@media (max-width:720px){ .bkprofile .bp-grid{ grid-template-columns:1fr; } }
.bkprofile .bp-panel{ background:var(--panel); border:2px solid var(--line2); border-radius:18px; box-shadow:inset 0 2px 0 rgba(255,255,255,.06), 0 6px 0 rgba(0,0,0,.18); padding:18px; }
.bkprofile .bp-id-row{ display:flex; gap:16px; align-items:flex-start; }
.bkprofile .bp-avatar{ width:110px; height:110px; flex:0 0 auto; border-radius:18px; padding:4px; background:linear-gradient(150deg,#5fd0ff,#3a7bff); box-shadow:0 6px 0 rgba(0,0,0,.25); }
.bkprofile .bp-face{ width:100%; height:100%; border-radius:14px; display:grid; place-items:center; background:radial-gradient(circle at 50% 38%, #8be0a0, #3fae74); font-size:56px; }
.bkprofile .bp-id-fields{ flex:1; min-width:0; display:flex; flex-direction:column; gap:10px; }
.bkprofile .bp-field{ background:var(--field); border:2px solid var(--line2); border-radius:14px; padding:12px 16px; box-shadow:inset 0 3px 6px rgba(0,0,0,.3); }
.bkprofile .bp-nm{ font-family:'Baloo 2',cursive; font-weight:800; font-size:24px; }
.bkprofile .bp-sub{ padding:10px 16px; display:flex; align-items:center; gap:8px; }
.bkprofile .bp-lab{ color:var(--mut); font-weight:600; font-size:14px; }
.bkprofile .bp-val{ font-weight:700; font-size:15px; }
.bkprofile .bp-subjects{ display:flex; gap:8px; flex-wrap:wrap; }
.bkprofile .bp-subj{ font-family:'Baloo 2'; font-weight:700; font-size:14px; padding:5px 14px; border-radius:30px; background:var(--field); border:2px solid var(--line2); color:var(--mut); cursor:pointer; }
.bkprofile .bp-subj.on{ background:linear-gradient(180deg,#46c0ff,#2a86f0); color:#06203f; border-color:#7fd6ff; }
.bkprofile .bp-meters{ display:flex; align-items:center; gap:12px; margin-top:16px; flex-wrap:wrap; }
.bkprofile .bp-gem{ width:74px; height:74px; flex:0 0 auto; position:relative; display:grid; place-items:center; filter:drop-shadow(0 5px 0 rgba(0,0,0,.28)); }
.bkprofile .bp-gem svg{ position:absolute; inset:0; width:100%; height:100%; }
.bkprofile .bp-t{ position:relative; text-align:center; line-height:.9; }
.bkprofile .bp-t small{ display:block; font-family:'Baloo 2'; font-weight:700; font-size:11px; }
.bkprofile .bp-t b{ font-family:'Baloo 2'; font-weight:800; font-size:24px; }
.bkprofile .bp-xpwrap{ flex:1; min-width:200px; display:flex; align-items:center; gap:10px; }
.bkprofile .bp-xphex{ width:54px; height:54px; flex:0 0 auto; position:relative; display:grid; place-items:center; filter:drop-shadow(0 4px 0 rgba(0,0,0,.28)); }
.bkprofile .bp-xphex svg{ position:absolute; inset:0; width:100%; height:100%; }
.bkprofile .bp-xphex b{ position:relative; font-family:'Baloo 2'; font-weight:800; font-size:18px; color:#06203f; }
.bkprofile .bp-xpbar{ flex:1; height:30px; border-radius:16px; background:#101736; border:2px solid #0b1124; box-shadow:inset 0 3px 6px rgba(0,0,0,.5); position:relative; overflow:hidden; display:flex; align-items:center; }
.bkprofile .bp-xpbar > i{ position:absolute; left:0; top:0; bottom:0; border-radius:14px; background:linear-gradient(180deg,#7fe0ff,#2e9bff); box-shadow:inset 0 2px 0 rgba(255,255,255,.5); }
.bkprofile .bp-xpbar span{ position:relative; width:100%; text-align:center; font-family:'Baloo 2'; font-weight:800; font-size:13px; color:#fff; -webkit-text-stroke:2.5px #0b1024; paint-order:stroke fill; }
.bkprofile .bp-trophy{ display:flex; align-items:center; gap:8px; font-family:'Baloo 2'; font-weight:800; font-size:22px; }
.bkprofile .bp-trophy .bp-ic{ font-size:28px; filter:drop-shadow(0 3px 0 rgba(0,0,0,.25)); }
.bkprofile .bp-bf-title{ text-align:center; font-family:'Baloo 2'; font-weight:800; font-size:20px; padding-bottom:6px; }
.bkprofile .bp-bf-row{ display:flex; align-items:center; justify-content:space-between; padding:10px 4px; border-bottom:2px solid rgba(255,255,255,.07); }
.bkprofile .bp-bf-row .l{ font-family:'Baloo 2'; font-weight:700; font-size:16px; white-space:nowrap; }
.bkprofile .bp-bf-row .n{ font-family:'Baloo 2'; font-weight:800; font-size:22px; }
.bkprofile .bp-bf-row.first .l, .bkprofile .bp-bf-row.first .n{ color:var(--gold); }
.bkprofile .bp-bf-row.streak .n{ color:var(--orange); }
.bkprofile .bp-bf-row.total{ border-bottom:0; margin-top:4px; padding-top:12px; }
.bkprofile .bp-bf-row.total .l{ font-size:21px; } .bkprofile .bp-bf-row.total .n{ font-size:28px; color:#fff; }
.bkprofile .bp-divider{ background:#0c1126; border-radius:14px; text-align:center; padding:12px; margin:18px 2px 16px; box-shadow:inset 0 3px 8px rgba(0,0,0,.5); }
.bkprofile .bp-divider h2{ margin:0; font-family:'Baloo 2'; font-weight:800; font-size:22px; letter-spacing:2px; }
.bkprofile .bp-hcards{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media (max-width:720px){ .bkprofile .bp-hcards{ grid-template-columns:1fr; } }
.bkprofile .bp-hcard{ background:var(--inset); border:2px solid var(--line2); border-radius:18px; padding:14px; box-shadow:inset 0 2px 0 rgba(255,255,255,.05); }
.bkprofile .bp-htop{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.bkprofile .bp-rarity{ font-family:'Baloo 2'; font-weight:800; font-size:16px; white-space:nowrap; }
.bkprofile .bp-hcard.thunder .bp-rarity{ color:var(--el-thunder); } .bkprofile .bp-hcard.fire .bp-rarity{ color:var(--el-fire); } .bkprofile .bp-hcard.frost .bp-rarity{ color:var(--el-frost); }
.bkprofile .bp-lvtag{ font-family:'Baloo 2'; font-weight:800; font-size:13px; color:#06203f; padding:3px 12px; border-radius:20px; white-space:nowrap; }
.bkprofile .bp-hcard.thunder .bp-lvtag{ background:var(--el-thunder); } .bkprofile .bp-hcard.fire .bp-lvtag{ background:var(--el-fire); color:#fff; } .bkprofile .bp-hcard.frost .bp-lvtag{ background:var(--el-frost); }
.bkprofile .bp-htile{ border-radius:16px; padding:5px; box-shadow:0 6px 0 rgba(0,0,0,.25); }
.bkprofile .bp-hcard.thunder .bp-htile{ background:linear-gradient(150deg,#ffe06a,#f3a51c); }
.bkprofile .bp-hcard.fire .bp-htile{ background:linear-gradient(150deg,#ff8a5a,#e02a1c); }
.bkprofile .bp-hcard.frost .bp-htile{ background:linear-gradient(150deg,#8fe0ff,#2a86f0); }
.bkprofile .bp-inner{ position:relative; border-radius:12px; padding:6px; display:grid; place-items:center; background:radial-gradient(circle at 50% 34%, #20294e, #121838); overflow:hidden; }
.bkprofile .bp-bird{ width:140px; height:140px; display:grid; place-items:center; position:relative; z-index:1; }
.bkprofile .bp-bird img{ display:block; width:100%; height:auto; filter:drop-shadow(0 6px 10px rgba(0,0,0,.45)); }
.bkprofile .bp-deco{ position:absolute; inset:0; pointer-events:none; z-index:0; }
.bkprofile .bp-deco svg{ width:100%; height:100%; display:block; }
.bkprofile .bp-hname{ text-align:center; font-family:'Baloo 2'; font-weight:800; font-size:20px; margin:10px 0 2px; }
.bkprofile .bp-hmean{ text-align:center; color:var(--mut); font-size:12.5px; margin-bottom:9px; }
.bkprofile .bp-stars{ display:flex; gap:5px; justify-content:center; }
.bkprofile .bp-stars i{ width:21px; height:21px; display:inline-block; }
.bkprofile .bp-prog2{ margin-top:11px; }
.bkprofile .bp-pb{ height:13px; border-radius:9px; background:#101736; border:2px solid #0b1124; overflow:hidden; box-shadow:inset 0 2px 4px rgba(0,0,0,.5); }
.bkprofile .bp-pb > i{ display:block; height:100%; border-radius:7px; }
.bkprofile .bp-hcard.thunder .bp-pb > i{ background:linear-gradient(180deg,#ffe06a,#f3a51c); }
.bkprofile .bp-hcard.fire .bp-pb > i{ background:linear-gradient(180deg,#ff8a5a,#e8401c); }
.bkprofile .bp-hcard.frost .bp-pb > i{ background:linear-gradient(180deg,#8fe0ff,#2a86f0); }
.bkprofile .bp-cap{ display:flex; justify-content:space-between; margin-top:6px; font-size:12px; color:var(--mut); font-weight:600; }
.bkprofile .bp-seasonchip{ display:inline-flex; align-items:center; gap:8px; margin-top:16px; font-family:'Baloo 2'; font-weight:800; font-size:14px; background:linear-gradient(180deg,#3a4474,#2a3360); border:3px solid #525f9c; border-radius:30px; padding:7px 16px; box-shadow:0 4px 0 rgba(0,0,0,.3); }
.bkprofile .bp-seasonchip b{ color:var(--gold); }
`
