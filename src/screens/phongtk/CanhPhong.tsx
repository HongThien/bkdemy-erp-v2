// CẢNH PHÒNG LÀM VIỆC TRƯỞNG KHỐI — bản DEMO vẽ bằng SVG (Thùy 03/11: "m vẽ trước, sau t dùng ChatGPT chỉnh cho đẹp").
// Ý tưởng: phòng làm việc, mỗi bàn một nhân vật = một TA cấp dưới (fn_phong_cap_duoi). Trên đầu: tên + HIỆU SUẤT THÁNG to để so sánh;
// bấm nhân vật ⇒ chi tiết. Phần việc là ĐỒ VẬT trong tranh: máy tính bàn trưởng khối = Phiên Claude · 3 bức tranh ngang nhau giữa
// tường = Bản đồ · Quản trị (báo cáo sư phạm — việc TA) · Chất lượng (dạng yếu · học tập tuần).
// Cửa sổ là LỖ TRONG SUỐT trên tường ⇒ nền style người dùng chọn (như Sảnh) hiện qua cửa sổ — đổi giao diện là đổi cảnh ngoài trời.
// Khi có tranh vẽ thật: giữ nguyên toạ độ GHE / DO_VAT (hệ 1600×900) làm ô bấm, thay phần vẽ bằng 1 ảnh (khuôn cảnh liền, lib/canhErp.ts).
// Người ngồi ở một bàn: TA (phòng trưởng khối) hoặc trưởng khối (phòng Trưởng bộ môn — số = gộp TA trong khối, DB tính).
// nhan = dòng phụ dưới tên (vd "Khối 9 · 8 TA"). trong = ghế trống (ô chưa có trưởng khối): vẽ ghế không người + biển đỏ, vẫn bấm được.
// nhan_su_id = khoá vẽ (ghế trống dùng khoá ô).
export type NguoiCanh = { nhan_su_id: string; ho_ten: string; hieu_suat: number | null; tre_han: number; gay_thang: number; nhan?: string; trong?: boolean }

export type DoVat = 'phien' | 'ban_do' | 'quan_tri' | 'chat_luong' | 'bao_cao' | 'hoi_ta'
const W = 1600, H = 900, SAN = 560   // mép tường / sàn

// 8 chỗ ngồi: hàng sau nhỏ hơn (xa hơn). Thứ tự lấp: hàng trước giữa → ra hai bên → hàng sau.
const GHE: { x: number; y: number; s: number }[] = [
  { x: 560, y: 715, s: 1 }, { x: 1040, y: 715, s: 1 }, { x: 290, y: 715, s: 1 }, { x: 1310, y: 715, s: 1 },
  { x: 560, y: 445, s: 0.78 }, { x: 1040, y: 445, s: 0.78 }, { x: 320, y: 445, s: 0.78 }, { x: 1280, y: 445, s: 0.78 },
]
export const SO_GHE = GHE.length

const TOC = ['#2b1a12', '#4a2c1a', '#1d1b2c', '#6b3e26', '#3a2340', '#5a4632']
const AO = ['#6d8bd6', '#e58aa8', '#7cc4a4', '#f2b25c', '#a08ad6', '#5fb3d1', '#e07a5f', '#8aa36d']
const DA = ['#f6d3b5', '#efc29e', '#f9dcc4', '#e8b991']
const bam = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

// Màu số hiệu suất — chỉ là dải màu hiển thị, số do DB tính.
export const mauHS = (v: number | null) => v == null ? '#94a3b8' : v >= 90 ? '#16a34a' : v >= 75 ? '#d97706' : '#e11d48'
const tenGon = (t: string) => { const p = t.trim().split(/\s+/); return p.length > 2 ? p.slice(-2).join(' ') : t }

function Ban({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-120 0 L120 0 L135 26 L-135 26 Z" fill="#c8915c" />
      <rect x={-135} y={26} width={270} height={70} fill="#a8723f" />
      <rect x={-135} y={26} width={270} height={8} fill="#8f5e31" />
    </g>
  )
}

function NhanVat({ ns, x, y, s, onMo }: { ns: NguoiCanh; x: number; y: number; s: number; onMo: () => void }) {
  const h = bam(ns.nhan_su_id)
  // >>> (dịch không dấu): h có thể > 2^31 — dùng >> ra số âm ⇒ chỉ số mảng âm ⇒ màu undefined ⇒ mặt/áo bị tô ĐEN (Thùy chụp 03/11)
  const toc = TOC[h % TOC.length], ao = AO[(h >>> 3) % AO.length], da = DA[(h >>> 6) % DA.length], kieu = (h >>> 9) % 3
  const mau = mauHS(ns.hieu_suat)
  const phu = [ns.tre_han > 0 ? `${ns.tre_han} trễ` : null, ns.gay_thang > 0 ? `${ns.gay_thang} gậy` : null].filter(Boolean).join(' · ')
  return (
    <g className="nv cursor-pointer" onClick={onMo} role="button" aria-label={`${ns.ho_ten} — hiệu suất ${ns.hieu_suat ?? 'chưa có'}`}>
      {ns.trong ? <>
        <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-46} y={-100} width={92} height={96} rx={18} fill="#8a919c" opacity={0.8} /></g>
        <Ban x={x} y={y} s={s} />
      </> : <>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* ghế */}
        <rect x={-46} y={-118} width={92} height={110} rx={18} fill="#58606e" />
        {/* tóc dài phía sau */}
        {kieu === 1 && <path d="M-40 -150 Q-48 -95 -36 -62 L36 -62 Q48 -95 40 -150 Z" fill={toc} />}
        {/* thân */}
        <path d="M-50 -2 Q-50 -66 0 -70 Q50 -66 50 -2 Z" fill={ao} />
        <path d="M-12 -68 L0 -52 L12 -68 Z" fill="#fff" opacity=".85" />
        {/* đầu */}
        <circle cx={0} cy={-112} r={36} fill={da} />
        <circle cx={-12} cy={-110} r={3.6} fill="#2b2b2b" /><circle cx={12} cy={-110} r={3.6} fill="#2b2b2b" />
        <path d="M-9 -96 Q0 -89 9 -96" stroke="#b5654a" strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx={-22} cy={-99} r={5} fill="#f4a6a6" opacity=".55" /><circle cx={22} cy={-99} r={5} fill="#f4a6a6" opacity=".55" />
        {/* tóc */}
        {kieu === 2
          ? <><path d="M-37 -118 Q-36 -152 0 -152 Q36 -152 37 -118 Q20 -134 0 -132 Q-20 -134 -37 -118 Z" fill={toc} /><circle cx={0} cy={-156} r={15} fill={toc} /></>
          : <path d="M-38 -112 Q-40 -154 0 -153 Q40 -154 38 -112 Q28 -138 -2 -136 Q-26 -137 -38 -112 Z" fill={toc} />}
      </g>
      <Ban x={x} y={y} s={s} />
      {/* laptop (mặt sau quay về phía người xem) */}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-46 0 L-40 -56 L40 -56 L46 0 Z" fill="#cfd6e2" stroke="#9aa6b8" strokeWidth={2} />
        <circle cx={0} cy={-28} r={6} fill="#fff" opacity=".8" />
      </g>
      </>}
      {/* biển tên + hiệu suất (ghế trống: viền đỏ nét đứt, tên đỏ) */}
      {(() => {
        // biển xếp dòng từ trên xuống: tên · (nhãn) · số · (trễ/gậy); đáy biển luôn ở y=10 (mũi tên chỉ xuống đầu)
        const cao = 68 + (ns.nhan ? 15 : 0) + (phu ? 16 : 0), dinh = 10 - cao
        return (
          <g transform={`translate(${x} ${y - 185 * s})`}>
            <rect className="the" x={-92} y={dinh} width={184} height={cao} rx={16} fill="#fff" stroke={ns.trong ? '#e11d48' : mau} strokeWidth={3} strokeDasharray={ns.trong ? '8 6' : undefined} />
            <text x={0} y={dinh + 22} textAnchor="middle" fontSize={ns.trong ? 15 : 17} fontWeight={700} fill={ns.trong ? '#e11d48' : '#334155'}>{ns.trong ? ns.ho_ten : tenGon(ns.ho_ten)}</text>
            {ns.nhan && <text x={0} y={dinh + 37} textAnchor="middle" fontSize={12} fontWeight={600} fill="#64748b">{ns.nhan}</text>}
            <text x={0} y={dinh + (ns.nhan ? 15 : 0) + 56} textAnchor="middle" fontSize={32} fontWeight={800} fill={mau}>{ns.hieu_suat == null ? '—' : `${Math.round(ns.hieu_suat)}%`}</text>
            {phu && <text x={0} y={dinh + cao - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill="#e11d48">{phu}</text>}
            <path d="M-9 10 L0 22 L9 10 Z" fill={mau} />
          </g>
        )
      })()}
    </g>
  )
}

function GheTrong({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g opacity={0.75}>
      <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-46} y={-100} width={92} height={96} rx={18} fill="#8a919c" /></g>
      <Ban x={x} y={y} s={s} />
    </g>
  )
}

// Bức tranh treo tường (bấm được): khung gỗ 260×160 từ y=30, tên ghi ở dải tối dưới đáy khung.
// Đáy khung y=190 — dưới đó là chỗ biển tên hàng sau (biển trưởng khối cao ~100, đỉnh ~y=210; Thùy 03/11: trước bị đè lên chữ "Chất lượng").
// Hình bên trong vẽ theo hệ cũ (khung từ y=70) rồi dời lên 40.
function Tranh({ x, ten, onMo, children }: { x: number; ten: string; onMo: () => void; children: React.ReactNode }) {
  return (
    <g className="dv" onClick={onMo} role="button" aria-label={`Mở ${ten.replace(/^\S+\s/, '')}`}>
      <rect className="vien" x={x} y={30} width={260} height={160} rx={8} fill="#fffaf0" stroke="#8f5e31" strokeWidth={9} />
      <g transform="translate(0 -40)">{children}</g>
      <rect x={x + 5} y={152} width={250} height={34} fill="#1e293b" opacity={0.88} />
      <text x={x + 130} y={176} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff">{ten}</text>
    </g>
  )
}

// Đồ vật bấm được: viền sáng khi rê chuột + biển tên.
function Bien({ x, y, chu }: { x: number; y: number; chu: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-95} y={-20} width={190} height={40} rx={20} fill="#1e293b" opacity={0.88} />
      <text x={0} y={7} textAnchor="middle" fontSize={19} fontWeight={700} fill="#fff">{chu}</text>
    </g>
  )
}

export default function CanhPhong<T extends NguoiCanh>({ ds, onMoNguoi, onMoDoVat, coHoiTa = false }: {
  ds: T[]; onMoNguoi: (ns: T) => void; onMoDoVat: (d: DoVat) => void
  coHoiTa?: boolean   // phòng trưởng bộ môn: thêm bảng tin "Hỏi vận hành TA" (Thùy 05/11)
}) {
  const ngoi = ds.slice(0, SO_GHE)
  // Tường có 2 lỗ cửa sổ ở 2 đầu (evenodd) ⇒ nền style phía sau hiện qua. Giữa tường: 3 bức tranh (Thùy 03/11).
  const CUA = [[60, 90, 190, 220], [1350, 90, 190, 220]]
  const tuong = `M0 0 H${W} V${SAN} H0 Z ` + CUA.map(([x, y, w, h]) => `M${x} ${y} h${w} v${h} h${-w} Z`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full select-none">
      <style>{`.nv:hover .the{filter:drop-shadow(0 4px 10px rgba(0,0,0,.25))} .nv:hover{filter:brightness(1.06)}
        .dv{cursor:pointer} .dv:hover .vien{stroke:var(--sk-acc,#f59e0b);stroke-width:6} .dv:hover{filter:brightness(1.08)}`}</style>
      {/* tường + cửa sổ */}
      <path d={tuong} fill="#f3e6d3" fillRule="evenodd" />
      <rect x={0} y={SAN - 26} width={W} height={26} fill="#e2cfb3" />
      {CUA.map(([x, y, w, h], i) => (
        <g key={i} fill="none" stroke="#fff" strokeWidth={10}>
          <rect x={x} y={y} width={w} height={h} /><line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} /><line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} />
          <rect x={x - 12} y={y + h} width={w + 24} height={14} fill="#e9d7bd" stroke="none" />
        </g>
      ))}
      {/* đồng hồ */}
      <circle cx={1290} cy={130} r={32} fill="#fff" stroke="#c8915c" strokeWidth={6} />
      <line x1={1290} y1={130} x2={1290} y2={108} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
      <line x1={1290} y1={130} x2={1306} y2={138} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
      {/* sàn gỗ + thảm */}
      <rect x={0} y={SAN} width={W} height={H - SAN} fill="#d9b48a" />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={0} y1={SAN + 30 + i * 68} x2={W} y2={SAN + 30 + i * 68} stroke="#c9a074" strokeWidth={3} />)}
      <ellipse cx={800} cy={700} rx={640} ry={150} fill="var(--sk-acc,#e8a0b4)" opacity={0.22} />

      {/* 3 BỨC TRANH giữa tường, ngang nhau (Thùy 03/11): Bản đồ · Quản trị · Chất lượng. Tên ghi TRONG khung (dưới khung là chỗ biển tên hàng sau). */}
      <Tranh x={370} ten="🗺 Bản đồ" onMo={() => onMoDoVat('ban_do')}>
        <path d="M395 190 Q440 110 490 150 T580 100 T610 150" fill="none" stroke="#7cc4a4" strokeWidth={7} strokeLinecap="round" />
        {[[430, 160], [490, 150], [545, 118], [600, 140]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={10} fill={['#e58aa8', '#6d8bd6', '#f2b25c', '#a08ad6'][i]} stroke="#fff" strokeWidth={3} />)}
      </Tranh>
      <Tranh x={670} ten="📋 Quản trị" onMo={() => onMoDoVat('quan_tri')}>
        <rect x={735} y={88} width={130} height={100} rx={8} fill="#fff" stroke="#cbd5e1" strokeWidth={3} />
        <rect x={775} y={80} width={50} height={16} rx={5} fill="#94a3b8" />
        {[0, 1, 2].map((i) => <g key={i}>
          <path d={`M750 ${116 + i * 25} l8 8 l14 -16`} fill="none" stroke={i < 2 ? '#16a34a' : '#e11d48'} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={782} y={110 + i * 25} width={68} height={10} rx={5} fill="#e2e8f0" />
        </g>)}
      </Tranh>
      <Tranh x={970} ten="📈 Chất lượng" onMo={() => onMoDoVat('chat_luong')}>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={1015 + i * 45} y={190 - (i + 1) * 24} width={30} height={(i + 1) * 24} rx={4} fill={['#f2b25c', '#e58aa8', '#6d8bd6', '#7cc4a4'][i]} />)}
        <path d="M1010 165 L1060 140 L1105 120 L1160 88" fill="none" stroke="#334155" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 8" />
        <text x={1190} y={100} textAnchor="middle" fontSize={30}>⭐</text>
      </Tranh>

      {/* LỊCH TREO TƯỜNG = Báo cáo tuần (spec-bao-cao-tuan §2.11) — dưới cửa sổ trái */}
      <g className="dv" onClick={() => onMoDoVat('bao_cao')} role="button" aria-label="Mở Báo cáo tuần">
        <rect className="vien" x={72} y={332} width={150} height={78} rx={8} fill="#fff" stroke="#8f5e31" strokeWidth={5} />
        <rect x={72} y={332} width={150} height={24} rx={6} fill="#e11d48" />
        <circle cx={100} cy={330} r={5} fill="#475569" /><circle cx={194} cy={330} r={5} fill="#475569" />
        <text x={147} y={350} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">BÁO CÁO TUẦN</text>
        <text x={147} y={396} textAnchor="middle" fontSize={30}>📝</text>
      </g>

      {/* BẢNG TIN = Hỏi vận hành trợ giảng (Thùy 05/11) — chỉ phòng trưởng bộ môn, dưới cửa sổ phải (đối xứng lịch Báo cáo tuần) */}
      {coHoiTa && (
        <g className="dv" onClick={() => onMoDoVat('hoi_ta')} role="button" aria-label="Mở Hỏi vận hành trợ giảng">
          <rect className="vien" x={1378} y={332} width={150} height={78} rx={8} fill="#fff" stroke="#8f5e31" strokeWidth={5} />
          <rect x={1378} y={332} width={150} height={24} rx={6} fill="#4f46e5" />
          <circle cx={1406} cy={330} r={5} fill="#475569" /><circle cx={1500} cy={330} r={5} fill="#475569" />
          <text x={1453} y={350} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">HỎI VẬN HÀNH TA</text>
          <text x={1453} y={396} textAnchor="middle" fontSize={30}>💬</text>
        </g>
      )}

      {/* chậu cây */}
      <g><rect x={40} y={500} width={70} height={70} rx={10} fill="#c8915c" />
        <ellipse cx={60} cy={470} rx={30} ry={52} fill="#5fa86b" /><ellipse cx={95} cy={480} rx={26} ry={44} fill="#6dbb78" /></g>

      {/* hàng sau rồi hàng trước (vẽ sau đè lên trước) */}
      {[4, 5, 6, 7, 0, 1, 2, 3].map((i) => {
        const g = GHE[i], ns = ngoi[i]
        return ns ? <NhanVat key={ns.nhan_su_id} ns={ns} x={g.x} y={g.y} s={g.s} onMo={() => onMoNguoi(ns)} /> : <GheTrong key={`t${i}`} x={g.x} y={g.y} s={g.s} />
      })}

      {/* BÀN TRƯỞNG KHỐI + máy tính = Phiên Claude */}
      <g className="dv" onClick={() => onMoDoVat('phien')} role="button" aria-label="Mở Phiên Claude">
        <rect className="vien" x={700} y={690} width={200} height={130} rx={12} fill="#1e293b" stroke="#475569" strokeWidth={4} />
        <rect x={714} y={704} width={172} height={102} rx={6} fill="#c7d2fe" />
        <text x={800} y={770} textAnchor="middle" fontSize={50}>🤖</text>
        <rect x={785} y={820} width={30} height={22} fill="#475569" />
        <path d="M620 842 L980 842 L1000 870 L600 870 Z" fill="#8f5e31" />
        <rect x={600} y={870} width={400} height={30} fill="#6f4724" />
        <Bien x={800} y={668} chu="🤖 Phiên Claude" />
      </g>
    </svg>
  )
}
