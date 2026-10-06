/// ============================================================================
// NhiemVuHS — màn NHIỆM VỤ của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.4, mig 202609281810).
// Chặng tháng (30 cấp) · nhiệm vụ ngày (treo tối đa 3 ngày) · tuần (dồn tới hết tháng) + rương · tháng.
// Mọi con số lấy nguyên từ fn_hs_nhiem_vu_cua_toi — ở đây chỉ trình bày.
// ============================================================================
import { useEffect, useState, type ReactNode } from 'react'
import { nhiemVuCuaToi, type NhiemVuCuaToi } from '../../lib/nhiemvu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD } from './skin/KhungHS'
import { IconNV } from './gami/HinhGami'
import { MAU_GAMI } from './gami/hinh'
// Tách VIEW (NhiemVuView — chỉ vẽ từ 1 object NhiemVuCuaToi) khỏi container để hs.html?xem=gami vẽ mọi trạng thái bằng dữ liệu giả.
// Icon = mã nhiệm vụ ⇒ gami/hinh.ts (PNG kit Đơn 1).

// Dựng theo ảnh toàn cảnh Đơn 1 (design/handoff/gami-v1/reference/man_nhiem_vu_dt_1 · _ipad_1 · _dt_2 · _dt_3, Thùy duyệt 30/09):
// mỗi khối = thẻ style + đầu khối "huy hiệu tròn viền vàng + tiêu đề chữ hoa màu nhấn" · Hôm nay: icon to · tên + mô tả · xu "+10" ·
// cột trạng thái (vòng tick + "Đã hoàn thành"/"Chưa xong") · 3 nút Thử thách / Tự luyện / vòng quay · Tuần: sổ to bên trái + 4 dòng +
// hàng rương nối dây · Tháng: 2 ô con. iPad/PC: 2 cột (trái Chặng + Hôm nay, phải Tuần + Tháng).
// Màu khung/chữ theo skin (MAU); 2 nút Thử thách/Tự luyện là màu GAME (gami/hinh.ts). Chữ mô tả = luật thật (spec §0.4), KHÔNG chép
// chữ trong ảnh toàn cảnh (ảnh vẽ sai vài luật — vd M1 "300 câu đúng").
const O_CON = { background: MAU.surface2, border: `1px solid ${MAU.line}`, borderRadius: 'calc(var(--sk-radius) * 0.75)' }

function Sao({ size = 13 }: { size?: number }) {
  return <span aria-hidden style={{ color: MAU.acc, fontSize: size, lineHeight: 1 }}>✦</span>
}
// Đồng xu điểm (+10 / +40 / +150).
function Xu({ n, nho }: { n: number; nho?: boolean }) {
  const d = nho ? 18 : 22
  return (
    <span className="flex shrink-0 items-center gap-1 font-extrabold tabular-nums" style={{ fontSize: nho ? 12.5 : 14 }}>
      <span aria-hidden className="flex items-center justify-center rounded-full" style={{ width: d, height: d, fontSize: d * 0.55, background: MAU.acc, color: MAU.accInk, boxShadow: '0 0 6px var(--sk-acc)' }}>✦</span>
      +{n}
    </span>
  )
}
function Tick({ xong, size = 24 }: { xong: boolean; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-black" aria-label={xong ? 'Đã xong' : 'Chưa xong'}
      style={{ width: size, height: size, fontSize: size * 0.55, ...(xong ? { border: `2px solid ${MAU.dung}`, color: MAU.dung, boxShadow: `0 0 8px ${MAU.dung}` } : { border: `1.5px solid ${MAU.line}`, background: MAU.surface }) }}>
      {xong ? '✓' : ''}
    </span>
  )
}
function TrangThai({ xong }: { xong: boolean }) {
  return (
    <span className="flex w-full flex-col items-center gap-1 text-center">
      <Tick xong={xong} />
      <span className="whitespace-nowrap text-[11px] font-bold leading-tight" style={{ color: xong ? MAU.dung : MAU.muted }}>{xong ? 'Đã hoàn thành' : 'Chưa xong'}</span>
    </span>
  )
}

// Đầu khối: huy hiệu tròn viền màu nhấn ôm icon + tiêu đề chữ hoa (như ảnh gốc "CHẶNG THÁNG", "HÔM NAY"…).
function Khoi({ icon, tieuDe, phai, children }: { icon: ReactNode; tieuDe: string; phai?: ReactNode; children: ReactNode }) {
  return (
    <section className="px-3 pb-3 pt-2.5" style={THE}>
      <div className="flex items-center gap-2.5 pb-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ border: `2px solid ${MAU.acc}`, background: MAU.surface2, boxShadow: '0 0 10px var(--sk-acc)' }}>{icon}</span>
        <h2 className="min-w-0 flex-1 truncate text-[19px] font-bold uppercase leading-tight tracking-[0.03em]" style={{ ...HEAD, textTransform: 'uppercase', color: MAU.acc }}>{tieuDe}</h2>
        {phai && <span className="shrink-0 text-right text-[12.5px] font-semibold leading-tight" style={{ color: MAU.muted }}>{phai}</span>}
      </div>
      <div style={{ color: MAU.ink }}>{children}</div>
    </section>
  )
}

// Dòng nhiệm vụ ngày: icon to · tên + mô tả · xu · | trạng thái.
function DongNgay({ icon, ten, mota, xong, phu, diem }: { icon: string; ten: string; mota: string; xong: boolean; phu?: string; diem: number }) {
  return (
    <div className="mt-2 flex items-stretch first:mt-0" style={O_CON}>
      <span className="flex w-[58px] shrink-0 items-center justify-center"><IconNV ma={icon} size={36} /></span>
      <span className="min-w-0 flex-1 py-2 pr-1.5">
        <span className="block text-[14.5px] font-bold leading-tight">{ten}</span>
        <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MAU.muted }}>{mota}</span>
        {phu && <span className="mt-0.5 block text-[11.5px] font-semibold" style={{ color: MAU.canhBao }}>⏳ {phu}</span>}
      </span>
      <span className="flex shrink-0 items-center pr-2"><Xu n={diem} /></span>
      <span className="flex w-[84px] shrink-0 items-center border-l px-1" style={{ borderColor: MAU.line }}><TrangThai xong={xong} /></span>
    </div>
  )
}
// Dòng nhiệm vụ tuần (gọn hơn — cột trái đã có sổ to): icon · tên + mô tả · xu · tick.
function DongTuan({ icon, ten, mota, xong, phu, diem }: { icon: string; ten: string; mota: string; xong: boolean; phu?: string; diem: number }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5" style={O_CON}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center"><IconNV ma={icon} size={27} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold leading-tight">{ten}</span>
        <span className="block text-[11px] leading-snug" style={{ color: MAU.muted }}>{mota}</span>
        {phu && <span className="block text-[11px] font-semibold" style={{ color: MAU.canhBao }}>⏳ {phu}</span>}
      </span>
      <Xu n={diem} nho />
      <Tick xong={xong} size={22} />
    </div>
  )
}

const homNay = () => new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Ho_Chi_Minh' })

// ── VIEW: chỉ vẽ ──
export function NhiemVuView({ d, onThuThach, onTuLuyen, onVongQuay }: {
  d: NhiemVuCuaToi; onThuThach?: () => void; onTuLuyen?: () => void; onVongQuay?: () => void
}) {
  if (!d.mo) {
    return (
      <div className="mx-auto mt-10 flex w-full max-w-[420px] flex-col items-center px-5 py-6 text-center" style={{ ...THE, boxShadow: '0 0 22px var(--sk-acc)' }}>
        <span className="relative flex h-[120px] w-[120px] items-center justify-center">
          <IconNV ma="tuan" size={88} />
          <span aria-hidden className="absolute bottom-1 right-1 text-[30px]">🔒</span>
        </span>
        <p className="mt-3 text-[22px] font-bold leading-snug" style={{ ...HEAD, color: MAU.acc }}>
          Nhiệm vụ mở từ ngày {d.bat_dau.split('-').reverse().slice(0, 2).join('/')} — hẹn em nhé!
        </p>
      </div>
    )
  }
  const c = d.cau_hinh
  const mocKe = c.moc.find(([cap]) => cap > d.chang.cap)
  const rNay = d.ruong.find((r) => r.tuan === d.tuan)
  const treo = (n: number, dv: string) => (n > 0 ? `Còn ${n} ${dv} chờ — làm bù được` : undefined)
  const moQuay = d.vong_quay.xong_hom_nay >= d.vong_quay.can
  const phan = (cap: number) => `${Math.min(100, Math.round(100 * cap / c.cap_max))}%`
  const nut = 'flex min-h-[46px] items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-[13.5px] font-bold active:scale-[0.98]'

  const chang = (
    <Khoi icon={<Sao size={24} />} tieuDe={`Chặng tháng ${parseInt(d.thang.slice(5), 10)}`}>
      <div className="flex items-center gap-2.5">
        <span className="flex w-[92px] shrink-0 items-center justify-center"><IconNV ma="chang" size={70} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[16px] font-bold" style={HEAD}>Cấp <span className="text-[28px] leading-none">{d.chang.cap}</span><span style={{ color: MAU.muted }}>/{c.cap_max}</span></span>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: MAU.muted }}><Sao /> <b className="text-[16px]" style={{ ...HEAD, color: MAU.ink }}>{d.chang.diem}</b> Điểm Chặng</span>
          </div>
          {/* thanh cả tháng (cấp / cấp tối đa) — quà ở mốc 10/20/30 đặt TRÊN thanh như ảnh gốc */}
          <div className="relative mb-5 mt-7 h-3.5 rounded-full" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}` }}>
            <div className="h-full rounded-full" style={{ width: phan(d.chang.cap), background: MAU.acc, boxShadow: '0 0 8px var(--sk-acc)' }} />
            {c.moc.map(([cap]) => (
              <span key={cap} className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: phan(cap) }}>
                <span aria-hidden className="absolute -top-6 text-[18px] leading-none" style={{ opacity: d.chang.cap >= cap ? 1 : 0.55 }}>🎁</span>
                <span className="h-2 w-2 rounded-full" style={{ background: d.chang.cap >= cap ? MAU.accInk : MAU.acc }} />
                <span className="absolute top-3 text-[11px] font-bold" style={{ color: MAU.muted }}>{cap}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2 px-2.5 py-2" style={O_CON}>
        <svg viewBox="0 0 44 40" className="h-9 w-10 shrink-0" aria-hidden style={{ color: MAU.acc }}>
          <polygon points="11,2 33,2 42,20 33,38 11,38 2,20" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text x="22" y="24.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor">EXP</text>
        </svg>
        <span className="min-w-0 flex-1 text-[12.5px]"><b className="text-[18px]" style={{ ...HEAD, color: MAU.acc }}>+{d.chang.exp} EXP</b> đã tích</span>
        <span className="shrink-0 border-l pl-2 text-right text-[12px] leading-snug" style={{ borderColor: MAU.line, color: MAU.muted }}>
          {mocKe ? <>tới cấp {mocKe[0]} thưởng thêm<br /><b style={{ color: MAU.ink }}>{mocKe[1]} EXP</b></> : 'đã qua mọi mốc thưởng'}
        </span>
      </div>
    </Khoi>
  )

  const ngay = (
    <Khoi icon={<IconNV ma="ngay" size={22} />} tieuDe="Hôm nay" phai={<span className="first-letter:uppercase">{homNay()}</span>}>
      <DongNgay icon="N1" ten="Vượt 1 Thử thách" mota="Đúng từ 80% trở lên trong 1 lượt Thử thách" diem={c.diem_ngay}
        xong={d.ngay.N1.xong_hom_nay > 0} phu={treo(d.ngay.N1.con_mo, 'lượt')} />
      <DongNgay icon="N2" ten={`Luyện ${c.n2_cau} câu`} mota={`Làm đúng ${c.n2_cau} câu trên app — hôm nay ${d.ngay.N2.tien_do} câu đúng`} diem={c.diem_ngay}
        xong={d.ngay.N2.xong_hom_nay > 0} phu={treo(d.ngay.N2.con_mo, 'lượt')} />
      <DongNgay icon="N3" ten="Sửa sai" mota={`Làm đúng ${c.n3_cau} câu thuộc dạng em từng sai (14 ngày) — hôm nay ${d.ngay.N3.tien_do} câu`} diem={c.diem_ngay}
        xong={d.ngay.N3.xong_hom_nay > 0} phu={treo(d.ngay.N3.con_mo, 'lượt')} />
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {onThuThach
          ? <button onClick={onThuThach} className={nut} style={{ background: MAU_GAMI.nutThuThach, color: MAU_GAMI.chu, border: `1px solid ${MAU.acc}` }}><IconNV ma="thu_thach" size={18} /> Thử thách ›</button>
          : <span />}
        {onTuLuyen
          ? <button onClick={onTuLuyen} className={nut} style={{ background: MAU_GAMI.nutTuLuyen, color: MAU_GAMI.chu, border: `1px solid ${MAU.acc}` }}><IconNV ma="tu_luyen" size={18} /> Tự luyện ›</button>
          : <span />}
        <button onClick={onVongQuay} disabled={!onVongQuay} className={`${nut} text-[11.5px] leading-tight`}
          style={moQuay ? { background: MAU.acc, color: MAU.accInk, boxShadow: '0 0 12px var(--sk-acc)' } : { background: MAU.surface2, color: MAU.muted, border: `1px dashed ${MAU.line}` }}>
          <span className="shrink-0" style={{ opacity: moQuay ? 1 : 0.5 }}><IconNV ma="vong_quay" size={20} /></span>
          <span>{moQuay ? 'Đã mở lượt quay may mắn!' : `Xong ${d.vong_quay.can} nhiệm vụ hôm nay để quay (${d.vong_quay.xong_hom_nay}/${d.vong_quay.can})`}</span>
        </button>
      </div>
    </Khoi>
  )

  const tuan = (
    <Khoi icon={<IconNV ma="tuan" size={22} />} tieuDe="Nhiệm vụ tuần"
      phai={<><b className="text-[16px]" style={{ ...HEAD, color: MAU.ink }}>Tuần {d.tuan}</b><br />{rNay?.mo ? 'đã mở rương' : `${rNay?.so_nv ?? 0}/${c.ruong_can} → rương`}</>}>
      <div className="flex gap-2">
        <span className="hidden w-[26%] max-w-[130px] shrink-0 items-center justify-center min-[400px]:flex"><IconNV ma="tuan" size={74} /></span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <DongTuan icon="T1" ten="Đúng hẹn cả tuần" mota="Nộp BTVN đúng hạn cả tuần" diem={c.diem_tuan} xong={d.tuan_nv.T1.xong_tuan_nay > 0} />
          <DongTuan icon="T2" ten="ET từ 80%" mota="Ít nhất 1 bài ET đạt từ 80%" diem={c.diem_tuan} xong={d.tuan_nv.T2.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T2.con_mo, 'tuần')} />
          <DongTuan icon="T3" ten={`Thử thách ${c.t3_ngay} ngày`} mota={`Vượt Thử thách ở ${c.t3_ngay} ngày khác nhau`} diem={c.diem_tuan} xong={d.tuan_nv.T3.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T3.con_mo, 'tuần')} />
          <DongTuan icon="T4" ten="Lấp 1 lỗ" mota="1 dạng đang yếu lên đạt" diem={c.diem_tuan} xong={d.tuan_nv.T4.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T4.con_mo, 'tuần')} />
        </div>
      </div>
      {/* hàng rương nối dây — rương tuần này viền sáng */}
      <div className="relative mt-3 grid grid-cols-4 text-center">
        <div className="absolute left-[12.5%] right-[12.5%] top-[32px] h-[2px]" style={{ background: MAU.acc, opacity: 0.45 }} />
        {d.ruong.map((r) => (
          <div key={r.tuan} className="relative flex flex-col items-center">
            <span className="flex h-[64px] w-[64px] items-center justify-center rounded-xl"
              style={r.tuan === d.tuan ? { border: `1.5px solid ${MAU.acc}`, background: MAU.surface2, boxShadow: '0 0 12px var(--sk-acc)' } : undefined}>
              <IconNV ma={r.mo ? 'ruong_mo' : 'ruong_dong'} size={42} />
            </span>
            <span className="mt-1 text-[12px] font-bold leading-tight">Tuần {r.tuan}</span>
            <span className="text-[11.5px] font-bold" style={{ color: r.mo ? MAU.acc : MAU.muted }}>{r.mo ? `+${c.ruong_exp} EXP` : `${r.so_nv}/${c.ruong_can}`}</span>
          </div>
        ))}
      </div>
    </Khoi>
  )

  const thang = (
    <Khoi icon={<IconNV ma="thang" size={22} />} tieuDe="Nhiệm vụ tháng">
      <div className="grid grid-cols-2 gap-2">
        {[
          { ma: 'M1', ten: 'MT bứt phá', mota: 'Hạng MT tốt hơn lần trước, hoặc vào top 30% khối', xong: d.thang_nv.M1, phu: null },
          { ma: 'M2', ten: `Thử thách ${c.m2_ngay} ngày`, mota: `Vượt Thử thách ở ${c.m2_ngay} ngày trong tháng`, xong: d.thang_nv.M2, phu: `đang ${d.thang_nv.ngay_pass}/${c.m2_ngay}` },
        ].map((m) => (
          <div key={m.ma} className="flex flex-col px-2.5 py-2.5" style={O_CON}>
            <div className="flex items-start gap-2">
              <IconNV ma={m.ma} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold leading-tight">{m.ten}</span>
                <span className="mt-0.5 block text-[11.5px] leading-snug" style={{ color: MAU.muted }}>{m.mota}</span>
              </span>
            </div>
            <div className="mt-auto flex items-center gap-1.5 pt-2">
              <Xu n={c.diem_thang} nho />
              <span className="min-w-0 flex-1" />
              {m.phu && !m.xong && <span className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10.5px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>{m.phu}</span>}
              <Tick xong={m.xong} size={22} />
            </div>
          </div>
        ))}
      </div>
    </Khoi>
  )

  return (
    <div className="mt-4 grid items-start gap-3 md:grid-cols-2">
      <div className="grid gap-3">{chang}{ngay}</div>
      <div className="grid gap-3">{tuan}{thang}</div>
    </div>
  )
}

export default function NhiemVuHS({ gioiTinh, onBack, onThuThach, onTuLuyen, onVongQuay }: {
  gioiTinh: 'nam' | 'nu' | null; onBack: () => void; onThuThach?: () => void; onTuLuyen?: () => void; onVongQuay?: () => void
}) {
  const [d, setD] = useState<NhiemVuCuaToi | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => (m ? nhiemVuCuaToi(m) : null))
      .then((r) => { setD(r); setState(r ? 'san_sang' : 'trong') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[28px] font-bold leading-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Nhiệm vụ {d?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP (đổi ra xu ngay).</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Nhiệm vụ chưa mở cho môn của em.</p>}
      {state === 'san_sang' && d && <NhiemVuView d={d} onThuThach={onThuThach} onTuLuyen={onTuLuyen} onVongQuay={onVongQuay} />}
    </Khung>
  )
}
