// ============================================================================
// NhiemVuHS — màn NHIỆM VỤ của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.4, mig 202609281810).
// Chặng tháng (30 cấp) · nhiệm vụ ngày (treo tối đa 3 ngày) · tuần (dồn tới hết tháng) + rương · tháng.
// Mọi con số lấy nguyên từ fn_hs_nhiem_vu_cua_toi — ở đây chỉ trình bày. Card KIỂU 1 (CLAUDE.md §6).
// ============================================================================
import { useEffect, useState } from 'react'
import { nhiemVuCuaToi, type NhiemVuCuaToi } from '../../lib/nhiemvu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack, THEME } from './TuLuyenChuDe'

const NAVY = '#0F1745'
const XANH = '#1A9A5C'

function Card({ mau, icon, tieuDe, phai, children }: { mau: string; icon: string; tieuDe: string; phai?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white" style={{ boxShadow: '0 8px 24px rgba(76,108,170,.12)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 text-white" style={{ background: mau }}>
        <span className="text-[18px]" aria-hidden>{icon}</span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-extrabold tracking-tight">{tieuDe}</span>
        {phai && <span className="shrink-0 rounded-full bg-white/25 px-2 py-0.5 text-[11.5px] font-bold">{phai}</span>}
      </div>
      <div className="px-4 py-3" style={{ color: NAVY }}>{children}</div>
    </div>
  )
}

function DongNV({ icon, ten, mota, xong, phu, diem }: { icon: string; ten: string; mota: string; xong: boolean; phu?: string; diem: number }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#EEF1F7] py-2.5 last:border-0">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[18px] ${xong ? 'bg-[#DFF6EA]' : 'bg-[#F1F4FA]'}`}>{xong ? '✓' : icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold" style={{ color: xong ? XANH : NAVY }}>{ten}</span>
        <span className="block text-[11.5px] leading-snug opacity-60">{mota}</span>
        {phu && <span className="mt-0.5 block text-[11px] font-semibold" style={{ color: '#B4791C' }}>{phu}</span>}
      </span>
      <span className="shrink-0 text-[11.5px] font-extrabold opacity-70">+{diem}</span>
    </div>
  )
}

export default function NhiemVuHS({ gioiTinh, onBack, onThuThach, onTuLuyen, onVongQuay }: {
  gioiTinh: 'nam' | 'nu' | null; onBack: () => void; onThuThach?: () => void; onTuLuyen?: () => void; onVongQuay?: () => void
}) {
  const [d, setD] = useState<NhiemVuCuaToi | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    monCuaHS().then((m) => (m ? nhiemVuCuaToi(m) : null))
      .then((r) => { setD(r); setState(r ? 'san_sang' : 'trong') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Nhiệm vụ {d?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP (đổi ra xu cuối tháng).</p>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'trong' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Nhiệm vụ chưa mở cho môn của em.</p>}
      {state === 'san_sang' && d && !d.mo && (
        <p className="mt-8 text-center text-[14px] font-bold" style={{ color: NAVY }}>
          Nhiệm vụ mở từ ngày {d.bat_dau.split('-').reverse().join('/')} — hẹn em nhé!
        </p>
      )}

      {state === 'san_sang' && d && d.mo && (() => {
        const c = d.cau_hinh
        const trongCap = d.chang.cap >= c.cap_max ? c.cap_diem : d.chang.diem % c.cap_diem
        const mocKe = c.moc.find(([cap]) => cap > d.chang.cap)
        const rNay = d.ruong.find((r) => r.tuan === d.tuan)
        const treo = (n: number, dv: string) => (n > 0 ? `Còn ${n} ${dv} chờ — làm bù được` : undefined)
        return (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Card mau="linear-gradient(135deg,#8B4DE8,#5B2BB5)" icon="🎖️" tieuDe={`Chặng tháng ${parseInt(d.thang.slice(5), 10)}`} phai={`+${d.chang.exp} EXP`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[26px] font-extrabold leading-none">Cấp {d.chang.cap}<span className="text-[15px] opacity-50">/{c.cap_max}</span></span>
                <span className="text-[12px] opacity-60">{d.chang.diem} Điểm Chặng</span>
              </div>
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#EDF0F7]">
                <div className="h-full rounded-full" style={{ width: `${Math.round(100 * trongCap / c.cap_diem)}%`, background: 'linear-gradient(90deg,#8B4DE8,#C07BFF)' }} />
              </div>
              <p className="mt-1 text-[11.5px] opacity-60">
                Mỗi cấp +{c.exp_cap} EXP{mocKe ? ` · tới cấp ${mocKe[0]} thưởng thêm ${mocKe[1]} EXP` : ' · đã qua mọi mốc thưởng'}
              </p>
            </Card>

            <Card mau="linear-gradient(135deg,#1673D8,#2A4BC4)" icon="☀️" tieuDe="Hôm nay" phai={`${d.vong_quay.xong_hom_nay} xong`}>
              <DongNV icon="⚔️" ten="Vượt 1 Thử thách" mota="Đúng từ 80% trở lên trong 1 lượt Thử thách" diem={c.diem_ngay}
                xong={d.ngay.N1.xong_hom_nay > 0} phu={treo(d.ngay.N1.con_mo, 'lượt')} />
              <DongNV icon="📝" ten={`Luyện ${c.n2_cau} câu`} mota={`Làm đúng ${c.n2_cau} câu trên app — hôm nay ${d.ngay.N2.tien_do} câu đúng`} diem={c.diem_ngay}
                xong={d.ngay.N2.xong_hom_nay > 0} phu={treo(d.ngay.N2.con_mo, 'lượt')} />
              <DongNV icon="🔧" ten="Sửa sai" mota={`Làm đúng ${c.n3_cau} câu thuộc dạng em từng sai (14 ngày) — hôm nay ${d.ngay.N3.tien_do} câu`} diem={c.diem_ngay}
                xong={d.ngay.N3.xong_hom_nay > 0} phu={treo(d.ngay.N3.con_mo, 'lượt')} />
              <div className="mt-2.5 flex gap-2">
                {onThuThach && <button onClick={onThuThach} className="flex-1 rounded-xl bg-[#EEF4FF] py-2 text-[12.5px] font-bold" style={{ color: '#1673D8' }}>⚔️ Thử thách</button>}
                {onTuLuyen && <button onClick={onTuLuyen} className="flex-1 rounded-xl bg-[#EEF4FF] py-2 text-[12.5px] font-bold" style={{ color: '#1673D8' }}>📚 Tự luyện</button>}
              </div>
              <button onClick={onVongQuay} disabled={!onVongQuay}
                className={`mt-2 w-full rounded-xl py-2.5 text-[13px] font-extrabold ${d.vong_quay.xong_hom_nay >= d.vong_quay.can ? 'text-white' : 'text-[#8792B5]'}`}
                style={{ background: d.vong_quay.xong_hom_nay >= d.vong_quay.can ? 'linear-gradient(135deg,#FF9EBB,#F04A7A)' : '#F1F3F8' }}>
                🎰 {d.vong_quay.xong_hom_nay >= d.vong_quay.can ? 'Đã mở lượt quay may mắn!' : `Xong ${d.vong_quay.can} nhiệm vụ hôm nay để quay (${d.vong_quay.xong_hom_nay}/${d.vong_quay.can})`}
              </button>
            </Card>

            <Card mau="linear-gradient(135deg,#F2663B,#E23A6B)" icon="📅" tieuDe={`Tuần ${d.tuan}`} phai={rNay?.mo ? '🎁 đã mở rương' : `${rNay?.so_nv ?? 0}/${c.ruong_can} → rương`}>
              <DongNV icon="⏰" ten="Đúng hẹn cả tuần" mota="Nộp đúng hạn mọi BTVN của tuần" diem={c.diem_tuan} xong={d.tuan_nv.T1.xong_tuan_nay > 0} />
              <DongNV icon="🎯" ten="ET từ 80%" mota="1 bài ET đúng từ 80%" diem={c.diem_tuan} xong={d.tuan_nv.T2.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T2.con_mo, 'tuần')} />
              <DongNV icon="🔥" ten={`Thử thách ${c.t3_ngay} ngày`} mota={`Vượt Thử thách ở ${c.t3_ngay} ngày khác nhau`} diem={c.diem_tuan} xong={d.tuan_nv.T3.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T3.con_mo, 'tuần')} />
              <DongNV icon="🩹" ten="Lấp 1 lỗ" mota="Đưa 1 dạng đang yếu lên đạt" diem={c.diem_tuan} xong={d.tuan_nv.T4.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T4.con_mo, 'tuần')} />
              <div className="mt-2.5 grid grid-cols-4 gap-1.5 text-center">
                {d.ruong.map((r) => (
                  <div key={r.tuan} className={`rounded-xl py-1.5 text-[11px] ${r.tuan === d.tuan ? 'ring-2 ring-[#F2663B]' : ''}`} style={{ background: r.mo ? '#FFF1D6' : '#F4F6FB' }}>
                    <div className="text-[18px]">{r.mo ? '🎁' : '📦'}</div>
                    <div className="font-bold">Tuần {r.tuan}</div>
                    <div className="opacity-60">{r.mo ? `+${c.ruong_exp} EXP` : `${r.so_nv}/${c.ruong_can}`}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card mau="linear-gradient(135deg,#E0B01E,#B8860B)" icon="🏔️" tieuDe="Tháng này">
              <DongNV icon="📈" ten="MT bứt phá" mota="Hạng MT tốt hơn lần trước, hoặc vào top 30% khối" diem={c.diem_thang} xong={d.thang_nv.M1} />
              <DongNV icon="🗓️" ten={`Thử thách ${c.m2_ngay} ngày`} mota={`Vượt Thử thách ở ${c.m2_ngay} ngày trong tháng — đang ${d.thang_nv.ngay_pass}/${c.m2_ngay}`} diem={c.diem_thang} xong={d.thang_nv.M2} />
            </Card>
          </div>
        )
      })()}
    </Khung>
  )
}
