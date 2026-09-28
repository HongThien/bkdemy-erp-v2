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

const NEN_DUNG = 'rgba(34,160,107,0.16)'
const NEN_VANG = 'rgba(233,170,30,0.18)' // rương đã mở

function Card({ icon, tieuDe, phai, children }: { icon: string; tieuDe: string; phai?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={THE}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: MAU.acc, color: MAU.accInk }}>
        <span className="text-[18px]" aria-hidden>{icon}</span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-extrabold tracking-tight" style={HEAD}>{tieuDe}</span>
        {phai && <span className="shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-bold" style={{ background: 'rgba(0,0,0,0.14)' }}>{phai}</span>}
      </div>
      <div className="px-4 py-3" style={{ color: MAU.ink }}>{children}</div>
    </div>
  )
}

function DongNV({ icon, ten, mota, xong, phu, diem }: { icon: string; ten: string; mota: string; xong: boolean; phu?: string; diem: number }) {
  return (
    <div className="flex items-center gap-3 border-b py-2.5 last:border-0" style={{ borderColor: MAU.line }}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[18px]" style={{ background: xong ? NEN_DUNG : MAU.surface2, color: xong ? MAU.dung : undefined }}>{xong ? '✓' : icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold" style={{ color: xong ? MAU.dung : MAU.ink }}>{ten}</span>
        <span className="block text-[11.5px] leading-snug" style={{ color: MAU.muted }}>{mota}</span>
        {phu && <span className="mt-0.5 block text-[11px] font-semibold" style={{ color: MAU.canhBao }}>{phu}</span>}
      </span>
      <span className="shrink-0 text-[11.5px] font-extrabold" style={{ color: MAU.acc }}>+{diem}</span>
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

  const nutPhu = { background: MAU.surface2, color: MAU.acc, border: `1px solid ${MAU.line}` }
  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Nhiệm vụ {d?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP (đổi ra xu cuối tháng).</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Nhiệm vụ chưa mở cho môn của em.</p>}
      {state === 'san_sang' && d && !d.mo && (
        <p className="mt-8 p-4 text-center text-[14px] font-bold" style={{ ...THE, color: MAU.ink }}>
          Nhiệm vụ mở từ ngày {d.bat_dau.split('-').reverse().join('/')} — hẹn em nhé!
        </p>
      )}

      {state === 'san_sang' && d && d.mo && (() => {
        const c = d.cau_hinh
        const trongCap = d.chang.cap >= c.cap_max ? c.cap_diem : d.chang.diem % c.cap_diem
        const mocKe = c.moc.find(([cap]) => cap > d.chang.cap)
        const rNay = d.ruong.find((r) => r.tuan === d.tuan)
        const treo = (n: number, dv: string) => (n > 0 ? `Còn ${n} ${dv} chờ — làm bù được` : undefined)
        const moQuay = d.vong_quay.xong_hom_nay >= d.vong_quay.can
        return (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Card icon="🎖️" tieuDe={`Chặng tháng ${parseInt(d.thang.slice(5), 10)}`} phai={`+${d.chang.exp} EXP`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[26px] font-extrabold leading-none" style={HEAD}>Cấp {d.chang.cap}<span className="text-[15px]" style={{ color: MAU.muted }}>/{c.cap_max}</span></span>
                <span className="text-[12px]" style={{ color: MAU.muted }}>{d.chang.diem} Điểm Chặng</span>
              </div>
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round(100 * trongCap / c.cap_diem)}%`, background: MAU.acc }} />
              </div>
              <p className="mt-1 text-[11.5px]" style={{ color: MAU.muted }}>
                Mỗi cấp +{c.exp_cap} EXP{mocKe ? ` · tới cấp ${mocKe[0]} thưởng thêm ${mocKe[1]} EXP` : ' · đã qua mọi mốc thưởng'}
              </p>
            </Card>

            <Card icon="☀️" tieuDe="Hôm nay" phai={`${d.vong_quay.xong_hom_nay} xong`}>
              <DongNV icon="⚔️" ten="Vượt 1 Thử thách" mota="Đúng từ 80% trở lên trong 1 lượt Thử thách" diem={c.diem_ngay}
                xong={d.ngay.N1.xong_hom_nay > 0} phu={treo(d.ngay.N1.con_mo, 'lượt')} />
              <DongNV icon="📝" ten={`Luyện ${c.n2_cau} câu`} mota={`Làm đúng ${c.n2_cau} câu trên app — hôm nay ${d.ngay.N2.tien_do} câu đúng`} diem={c.diem_ngay}
                xong={d.ngay.N2.xong_hom_nay > 0} phu={treo(d.ngay.N2.con_mo, 'lượt')} />
              <DongNV icon="🔧" ten="Sửa sai" mota={`Làm đúng ${c.n3_cau} câu thuộc dạng em từng sai (14 ngày) — hôm nay ${d.ngay.N3.tien_do} câu`} diem={c.diem_ngay}
                xong={d.ngay.N3.xong_hom_nay > 0} phu={treo(d.ngay.N3.con_mo, 'lượt')} />
              <div className="mt-2.5 flex gap-2">
                {onThuThach && <button onClick={onThuThach} className="flex-1 rounded-xl py-2 text-[12.5px] font-bold" style={nutPhu}>⚔️ Thử thách</button>}
                {onTuLuyen && <button onClick={onTuLuyen} className="flex-1 rounded-xl py-2 text-[12.5px] font-bold" style={nutPhu}>📚 Tự luyện</button>}
              </div>
              <button onClick={onVongQuay} disabled={!onVongQuay}
                className="mt-2 w-full rounded-xl py-2.5 text-[13px] font-extrabold"
                style={moQuay ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface2, color: MAU.muted }}>
                🎰 {moQuay ? 'Đã mở lượt quay may mắn!' : `Xong ${d.vong_quay.can} nhiệm vụ hôm nay để quay (${d.vong_quay.xong_hom_nay}/${d.vong_quay.can})`}
              </button>
            </Card>

            <Card icon="📅" tieuDe={`Tuần ${d.tuan}`} phai={rNay?.mo ? '🎁 đã mở rương' : `${rNay?.so_nv ?? 0}/${c.ruong_can} → rương`}>
              <DongNV icon="⏰" ten="Đúng hẹn cả tuần" mota="Nộp đúng hạn mọi BTVN của tuần" diem={c.diem_tuan} xong={d.tuan_nv.T1.xong_tuan_nay > 0} />
              <DongNV icon="🎯" ten="ET từ 80%" mota="1 bài ET đúng từ 80%" diem={c.diem_tuan} xong={d.tuan_nv.T2.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T2.con_mo, 'tuần')} />
              <DongNV icon="🔥" ten={`Thử thách ${c.t3_ngay} ngày`} mota={`Vượt Thử thách ở ${c.t3_ngay} ngày khác nhau`} diem={c.diem_tuan} xong={d.tuan_nv.T3.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T3.con_mo, 'tuần')} />
              <DongNV icon="🩹" ten="Lấp 1 lỗ" mota="Đưa 1 dạng đang yếu lên đạt" diem={c.diem_tuan} xong={d.tuan_nv.T4.xong_tuan_nay > 0} phu={treo(d.tuan_nv.T4.con_mo, 'tuần')} />
              <div className="mt-2.5 grid grid-cols-4 gap-1.5 text-center">
                {d.ruong.map((r) => (
                  <div key={r.tuan} className="rounded-xl py-1.5 text-[11px]"
                    style={{ background: r.mo ? NEN_VANG : MAU.surface2, boxShadow: r.tuan === d.tuan ? `inset 0 0 0 2px ${MAU.acc}` : undefined }}>
                    <div className="text-[18px]">{r.mo ? '🎁' : '📦'}</div>
                    <div className="font-bold">Tuần {r.tuan}</div>
                    <div style={{ color: MAU.muted }}>{r.mo ? `+${c.ruong_exp} EXP` : `${r.so_nv}/${c.ruong_can}`}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card icon="🏔️" tieuDe="Tháng này">
              <DongNV icon="📈" ten="MT bứt phá" mota="Hạng MT tốt hơn lần trước, hoặc vào top 30% khối" diem={c.diem_thang} xong={d.thang_nv.M1} />
              <DongNV icon="🗓️" ten={`Thử thách ${c.m2_ngay} ngày`} mota={`Vượt Thử thách ở ${c.m2_ngay} ngày trong tháng — đang ${d.thang_nv.ngay_pass}/${c.m2_ngay}`} diem={c.diem_thang} xong={d.thang_nv.M2} />
            </Card>
          </div>
        )
      })()}
    </Khung>
  )
}
