/// ============================================================================
// NhiemVuHS — màn NHIỆM VỤ của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.4, mig 202609281810).
// Chặng tháng (30 cấp) · nhiệm vụ ngày (treo tối đa 3 ngày) · tuần (dồn tới hết tháng) + rương · tháng.
// Mọi con số lấy nguyên từ fn_hs_nhiem_vu_cua_toi — ở đây chỉ trình bày. Card KIỂU 1 (CLAUDE.md §6).
// Thùy 29/09: dải header = màu nhấn skin, thân = nền thẻ skin (KhungHS) — không còn màu cứng theo từng thẻ.
// ============================================================================
import { useEffect, useState } from 'react'
import { nhiemVuCuaToi, type NhiemVuCuaToi } from '../../lib/nhiemvu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD } from './skin/KhungHS'
import { IconNV } from './gami/HinhGami'
// Tách VIEW (NhiemVuView — chỉ vẽ từ 1 object NhiemVuCuaToi) khỏi container để hs.html?xem=gami vẽ mọi trạng thái bằng dữ liệu giả.
// Icon = mã nhiệm vụ ⇒ gami/hinh.ts ICON_NV (emoji tạm, PNG khi kit Đơn 1 về).

// Thùy 29/09: dựng theo ảnh toàn cảnh kit Đơn 1 (design/bk-ui-src/Mission/Mission_01.png): thẻ viền style + tiêu đề ✦ (không dải màu),
// mỗi nhiệm vụ 1 ô con — icon TO bên trái (luôn hiện, không bị ✓ thay) · "+10 ✦" · vòng tick tròn bên phải; Chặng có huy hiệu to +
// thanh cả tháng với mốc 10/20/30; tuần = dòng gọn + hàng rương nối dây. Màu chỉ từ skin (MAU).

function Sao({ size = 13 }: { size?: number }) {
  return <span aria-hidden style={{ color: MAU.acc, fontSize: size, lineHeight: 1 }}>✦</span>
}
function Tick({ xong, size = 30 }: { xong: boolean; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-black" aria-label={xong ? 'Đã xong' : 'Chưa xong'}
      style={{ width: size, height: size, fontSize: size * 0.5, ...(xong ? { background: MAU.acc, color: MAU.accInk } : { border: `1.5px solid ${MAU.line}` }) }}>
      {xong ? '✓' : ''}
    </span>
  )
}
function Card({ tieuDe, phai, children }: { tieuDe: string; phai?: string; children: React.ReactNode }) {
  return (
    <section className="px-3 pb-3 pt-2.5" style={THE}>
      <div className="flex items-center gap-2 px-1 pb-2">
        <Sao size={18} />
        <h2 className="min-w-0 flex-1 truncate text-[19px] font-bold leading-tight" style={{ ...HEAD, color: MAU.ink }}>{tieuDe}</h2>
        {phai && <span className="shrink-0 text-[12.5px] font-semibold" style={{ color: MAU.muted }}>{phai}</span>}
      </div>
      <div style={{ color: MAU.ink }}>{children}</div>
    </section>
  )
}
const O_CON = { background: MAU.surface2, border: `1px solid ${MAU.line}`, borderRadius: 'var(--sk-radius)' }

function DongNV({ icon, ten, mota, xong, phu, diem }: { icon: string; ten: string; mota?: string; xong: boolean; phu?: string; diem: number }) {
  return (
    <div className="mt-2 flex items-center gap-3 px-2.5 py-2.5 first:mt-0" style={O_CON}>
      <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center"><IconNV ma={icon} size={40} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold leading-tight">{ten}</span>
        {mota && <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MAU.muted }}>{mota}</span>}
        {phu && <span className="mt-0.5 block text-[11.5px] font-semibold" style={{ color: MAU.canhBao }}>⏳ {phu}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-1 self-start pt-1 text-[13px] font-extrabold tabular-nums">+{diem} <Sao /></span>
      <Tick xong={xong} />
    </div>
  )
}
// Dòng gọn của khối Tuần (như ảnh gốc): icon nhỏ · tên · +40 ✦ · tick
function DongGon({ icon, ten, xong, phu, diem }: { icon: string; ten: string; xong: boolean; phu?: string; diem: number }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center"><IconNV ma={icon} size={24} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold leading-tight">{ten}</span>
        {phu && <span className="block text-[11px] font-semibold" style={{ color: MAU.canhBao }}>⏳ {phu}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[12.5px] font-extrabold tabular-nums">+{diem} <Sao size={12} /></span>
      <Tick xong={xong} size={24} />
    </div>
  )
}

// ── VIEW: chỉ vẽ ──
export function NhiemVuView({ d, onThuThach, onTuLuyen, onVongQuay }: {
  d: NhiemVuCuaToi; onThuThach?: () => void; onTuLuyen?: () => void; onVongQuay?: () => void
}) {
  const nutPhu = { background: 'transparent', color: MAU.ink, border: `1.5px solid ${MAU.line}` }
  return (
    <>
      {!d.mo && (
        <p className="mt-8 p-4 text-center text-[14px] font-bold" style={{ ...THE, color: MAU.ink }}>
          Nhiệm vụ mở từ ngày {d.bat_dau.split('-').reverse().join('/')} — hẹn em nhé!
        </p>
      )}

      {d.mo && (() => {
        const c = d.cau_hinh
        const mocKe = c.moc.find(([cap]) => cap > d.chang.cap)
        const rNay = d.ruong.find((r) => r.tuan === d.tuan)
        const treo = (n: number, dv: string) => (n > 0 ? `Còn ${n} ${dv} chờ — làm bù được` : undefined)
        const moQuay = d.vong_quay.xong_hom_nay >= d.vong_quay.can
        const phan = (cap: number) => `${Math.min(100, Math.round(100 * cap / c.cap_max))}%`
        return (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Card tieuDe={`Chặng tháng ${parseInt(d.thang.slice(5), 10)}`}>
              <div className="flex items-center gap-3 px-1">
                <span className="flex h-[86px] w-[86px] shrink-0 items-center justify-center"><IconNV ma="chang" size={64} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-bold" style={HEAD}>Cấp <span className="text-[30px] leading-none">{d.chang.cap}</span><span style={{ color: MAU.muted }}>/{c.cap_max}</span></span>
                    <span className="text-right text-[12px]" style={{ color: MAU.muted }}><b className="text-[17px]" style={{ ...HEAD, color: MAU.ink }}>{d.chang.diem}</b> Điểm Chặng</span>
                  </div>
                  {/* thanh cả tháng (cấp / cấp tối đa) + mốc thưởng */}
                  <div className="relative mb-5 mt-2 h-2.5 rounded-full" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}` }}>
                    <div className="h-full rounded-full" style={{ width: phan(d.chang.cap), background: MAU.acc }} />
                    {c.moc.map(([cap]) => (
                      <span key={cap} className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: phan(cap) }}>
                        <Sao size={14} /><span className="absolute top-4 text-[10.5px]" style={{ color: MAU.muted }}>{cap}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-1 flex flex-wrap justify-between gap-x-3 px-1 text-[12px]" style={{ color: MAU.muted }}>
                <span><b className="text-[15px]" style={{ color: MAU.acc }}>+{d.chang.exp} EXP</b> đã tích · mỗi cấp +{c.exp_cap}</span>
                <span>{mocKe ? <>tới cấp {mocKe[0]} thưởng thêm <b style={{ color: MAU.acc }}>{mocKe[1]} EXP</b></> : 'đã qua mọi mốc thưởng'}</span>
              </p>
            </Card>

            <Card tieuDe="Hôm nay" phai={`${d.vong_quay.xong_hom_nay} xong`}>
              <DongNV icon="N1" ten="Vượt 1 Thử thách" mota="Đúng từ 80% trở lên trong 1 lượt Thử thách" diem={c.diem_ngay}
                xong={d.ngay.N1.xong_hom_nay > 0} phu={treo(d.ngay.N1.con_mo, 'lượt')} />
              <DongNV icon="N2" ten={`Luyện ${c.n2_cau} câu`} mota={`Làm đúng ${c.n2_cau} câu trên app — hôm nay ${d.ngay.N2.tien_do} câu đúng`} diem={c.diem_ngay}
                xong={d.ngay.N2.xong_hom_nay > 0} phu={treo(d.ngay.N2.con_mo, 'lượt')} />
              <DongNV icon="N3" ten="Sửa sai" mota={`Làm đúng ${c.n3_cau} câu thuộc dạng em từng sai (14 ngày) — hôm nay ${d.ngay.N3.tien_do} câu`} diem={c.diem_ngay}
                xong={d.ngay.N3.xong_hom_nay > 0} phu={treo(d.ngay.N3.con_mo, 'lượt')} />
              <div className="mt-2.5 flex gap-2">
                {onThuThach && <button onClick={onThuThach} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-bold" style={nutPhu}><IconNV ma="thu_thach" size={20} /> Thử thách</button>}
                {onTuLuyen && <button onClick={onTuLuyen} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-bold" style={nutPhu}><IconNV ma="tu_luyen" size={20} /> Tự luyện</button>}
              </div>
              <button onClick={onVongQuay} disabled={!onVongQuay}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[13.5px] font-extrabold"
                style={moQuay ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface2, color: MAU.muted, border: `1px dashed ${MAU.line}` }}>
                <span style={{ opacity: moQuay ? 1 : 0.5 }}><IconNV ma="vong_quay" size={26} /></span>
                {moQuay ? 'Đã mở lượt quay may mắn!' : `Xong ${d.vong_quay.can} nhiệm vụ hôm nay để quay (${d.vong_quay.xong_hom_nay}/${d.vong_quay.can})`}
              </button>
            </Card>

            <Card tieuDe={`Tuần ${d.tuan}`} phai={rNay?.mo ? 'đã mở rương' : `${rNay?.so_nv ?? 0}/${c.ruong_can} → rương`}>
              <div className="px-2.5 py-1" style={O_CON}>
                <DongGon icon="T1" ten="Đúng hẹn cả tuần" diem={c.diem_tuan} xong={d.tuan_nv.T1.xong_tuan_nay > 0} />
                <DongGon icon="T2" ten="ET từ 80%" diem={c.diem_tuan} xong={d.tuan_nv.T2.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T2.con_mo, 'tuần')} />
                <DongGon icon="T3" ten={`Thử thách ${c.t3_ngay} ngày`} diem={c.diem_tuan} xong={d.tuan_nv.T3.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T3.con_mo, 'tuần')} />
                <DongGon icon="T4" ten="Lấp 1 lỗ" diem={c.diem_tuan} xong={d.tuan_nv.T4.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T4.con_mo, 'tuần')} />
              </div>
              {/* hàng rương nối dây (như ảnh gốc) */}
              <div className="relative mt-3 grid grid-cols-4 text-center">
                <div className="absolute left-[12.5%] right-[12.5%] top-[31px] h-px" style={{ background: MAU.line }} />
                {d.ruong.map((r) => (
                  <div key={r.tuan} className="relative flex flex-col items-center">
                    <span className="flex h-[62px] w-[62px] items-center justify-center rounded-xl"
                      style={r.tuan === d.tuan ? { border: `1.5px solid ${MAU.acc}`, background: MAU.surface2 } : undefined}>
                      <IconNV ma={r.mo ? 'ruong_mo' : 'ruong_dong'} size={40} />
                    </span>
                    {r.mo && <span className="-mt-2 rounded-full px-1.5 text-[10.5px] font-bold" style={{ background: MAU.bg, color: MAU.acc, border: `1px solid ${MAU.acc}` }}>+{c.ruong_exp} EXP</span>}
                    <span className="mt-0.5 text-[11.5px]" style={{ color: MAU.muted }}>Tuần {r.tuan}</span>
                    {!r.mo && <span className="text-[12px] font-bold">{r.so_nv}/{c.ruong_can}</span>}
                  </div>
                ))}
              </div>
            </Card>

            <Card tieuDe="Tháng">
              <DongNV icon="M1" ten="MT bứt phá" mota="Hạng MT tốt hơn lần trước, hoặc vào top 30% khối" diem={c.diem_thang} xong={d.thang_nv.M1} />
              <DongNV icon="M2" ten={`Thử thách ${c.m2_ngay} ngày`} mota={`đang ${d.thang_nv.ngay_pass}/${c.m2_ngay}`} diem={c.diem_thang} xong={d.thang_nv.M2} />
            </Card>
          </div>
        )
      })()}
    </>
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
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP (đổi ra xu cuối tháng).</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Nhiệm vụ chưa mở cho môn của em.</p>}
      {state === 'san_sang' && d && <NhiemVuView d={d} onThuThach={onThuThach} onTuLuyen={onTuLuyen} onVongQuay={onVongQuay} />}
    </Khung>
  )
}
