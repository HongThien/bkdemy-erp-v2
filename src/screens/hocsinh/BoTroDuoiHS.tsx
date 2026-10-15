// BỔ TRỢ ĐUỔI — màn tiến trình của HỌC SINH (Thùy 15/10: "nguyên 1 cái Bổ trợ Đuổi; mục tiêu do giáo viên set, em tự hoàn thành ở nhà,
// đến buổi TA giúp phần còn dở; HS và TA đều nhìn rõ tiến trình"). THAY thẻ "Học từ đầu" + màn "Lộ trình" cũ.
// Mục tiêu = ĐÚNG các dạng giáo viên chọn (không mở rộng cả chuyên đề). Một danh sách, một thanh tiến độ — TA nhìn cùng nguồn
// (fn_duoi_tien_trinh). Khoá tuần tự trong chuyên đề giữ nguyên; TA được mở tay ở ca. Mọi số + trạng thái tính ở DB.
import { useEffect, useMemo, useState } from 'react'
import { duoiTienTrinh, type DangDuoiHS, type DotDuoiHS } from '../../lib/hoctudau'
import { ddmmVN, homNayVN } from '../../lib/tuan'
import { ManHS, DauTrangHS, NutHS, NhanHS, MAU, THE, HEAD } from './skin/KhungHS'

const ICON: Record<DangDuoiHS['trang_thai'], string> = { xong: '✅', dang_hoc: '📖', toi_luot: '▶️', khoa: '🔒', giay: '📄' }
const NHAN: Record<DangDuoiHS['trang_thai'], string> = { xong: 'Xong', dang_hoc: 'Đang học', toi_luot: 'Tới lượt', khoa: 'Khoá', giay: 'Trên giấy' }

function chiTiet(d: DangDuoiHS, truoc?: DangDuoiHS): string {
  if (d.trang_thai === 'xong') {
    const noi = d.noi_lam === 'ca' ? 'làm cùng trợ giảng' : 'làm ở nhà'
    return `${d.test_gan_nhat != null ? `Test ${d.test_gan_nhat}% · ` : ''}${noi}${d.xong_at ? ` · ${ddmmVN(d.xong_at.slice(0, 10))}` : ''}`
  }
  if (d.trang_thai === 'dang_hoc') {
    const p = [d.doc_ly_thuyet ? 'Đã đọc lý thuyết' : 'Chưa đọc lý thuyết']
    if (d.luyen_cau > 0) p.push(`luyện ${d.luyen_dung}/${d.luyen_cau} câu đúng`)
    if (d.test_lan > 0 && d.test_gan_nhat != null) p.push(`test lần gần nhất ${d.test_gan_nhat}% (cần từ 50%)`)
    return p.join(' · ')
  }
  if (d.trang_thai === 'toi_luot') return 'Chưa bắt đầu — đọc lý thuyết rồi luyện, cuối cùng làm test'
  if (d.trang_thai === 'khoa') return truoc ? `Mở khi em xong «${truoc.ten_dang}» (hoặc trợ giảng mở giúp ở ca)` : 'Mở khi em xong dạng trước (hoặc trợ giảng mở giúp ở ca)'
  return 'Dạng này học và làm cùng thầy cô trên giấy'
}

export default function BoTroDuoiHS({ onBack, onPickDang }: {
  onBack: () => void
  onPickDang: (d: DangDuoiHS, mon: string, cungChuyenDe: DangDuoiHS[]) => void
}) {
  const [dots, setDots] = useState<DotDuoiHS[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { duoiTienTrinh().then(setDots).catch((e: any) => { setLoi(e?.message ?? String(e)); setDots([]) }) }, [])

  return (
    <ManHS className="!gap-0">
      <div className="sticky top-0 z-10 -mx-4 px-4 pb-3 pt-1 backdrop-blur-sm" style={{ background: 'color-mix(in srgb, var(--sk-bg) 70%, transparent)' }}>
        <DauTrangHS tieuDe="Bổ trợ Đuổi" phu={dots && dots.length ? 'Tiến trình của em — làm ở nhà, thiếu gì trợ giảng giúp ở buổi' : undefined} onBack={onBack} theoMon />
      </div>
      {dots === null && <p className="py-12 text-center text-[15px]" style={{ color: MAU.muted }}>Đang tải…</p>}
      {loi && <p className="p-4 text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{loi}</p>}
      {dots && dots.length === 0 && !loi && (
        <div className="p-6 text-center text-[14.5px]" style={{ ...THE, color: MAU.muted }}>Em chưa có đợt Bổ trợ Đuổi nào đang mở.</div>
      )}
      {(dots ?? []).map((dot) => <Dot key={dot.bo_tro_duoi_id} dot={dot} onPickDang={onPickDang} />)}
    </ManHS>
  )
}

function Dot({ dot, onPickDang }: { dot: DotDuoiHS; onPickDang: (d: DangDuoiHS, mon: string, cung: DangDuoiHS[]) => void }) {
  const nhom = useMemo(() => {
    const m = new Map<string, { ten: string; dangs: DangDuoiHS[] }>()
    for (const d of dot.dangs) {
      const k = d.ma_chuyen_de ?? '_giay'
      if (!m.has(k)) m.set(k, { ten: d.ten_chuyen_de || 'Học trên giấy', dangs: [] })
      m.get(k)!.dangs.push(d)
    }
    return [...m.entries()].map(([ma, v]) => ({ ma, ...v }))
  }, [dot.dangs])
  const tiep = dot.dangs.find((d) => d.trang_thai === 'dang_hoc') ?? dot.dangs.find((d) => d.trang_thai === 'toi_luot')
  const pXong = dot.tong > 0 ? (dot.xong / dot.tong) * 100 : 0
  const pDang = dot.tong > 0 ? (dot.dang_hoc / dot.tong) * 100 : 0
  const duBuoi = dot.so_buoi_du_kien

  return (
    <div className="mb-6">
      <div className="p-4" style={THE}>
        <div className="flex items-center gap-2">
          <NhanHS mau={MAU.acc}>Đuổi</NhanHS>
          <span className="text-[13.5px]" style={{ color: MAU.muted }}>{dot.mon}{dot.lop ? ` · ${dot.lop}` : ''}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[34px] font-extrabold leading-none" style={{ ...HEAD, color: MAU.ink }}>{dot.xong}<span className="text-[20px]" style={{ color: MAU.muted }}> / {dot.tong}</span></span>
          <span className="text-[15px]" style={{ color: MAU.muted }}>dạng đã xong</span>
        </div>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full" style={{ background: MAU.surface2 }} role="progressbar" aria-valuenow={dot.xong} aria-valuemax={dot.tong}>
          <div style={{ width: `${pXong}%`, background: MAU.dung }} />
          <div style={{ width: `${pDang}%`, background: MAU.acc }} />
        </div>
        <p className="mt-2 text-[13.5px]" style={{ color: MAU.muted }}>
          {dot.tai_nha > 0 && `${dot.tai_nha} dạng em tự làm ở nhà`}{dot.tai_nha > 0 && dot.tai_ca > 0 && ' · '}{dot.tai_ca > 0 && `${dot.tai_ca} dạng làm cùng trợ giảng`}
          {dot.tai_nha === 0 && dot.tai_ca === 0 && 'Em chưa xong dạng nào — bắt đầu từ dạng đầu tiên nhé.'}
        </p>

        {dot.buoi.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dot.buoi.map((b, i) => {
              const homNay = !b.xong && b.diem_danh == null && b.ngay === homNayVN()
              const xong = b.xong && b.diem_danh === 'co_mat'
              return (
                <span key={b.buoi_id} className="rounded-full px-2.5 py-1 text-[12.5px] font-semibold"
                  style={{ background: MAU.surface2, color: xong ? MAU.dung : homNay ? MAU.canhBao : MAU.muted, border: homNay ? `1.5px solid ${MAU.canhBao}` : undefined }}>
                  Buổi {i + 1} · {ddmmVN(b.ngay)}{xong ? ' · xong' : b.diem_danh === 'vang' ? ' · vắng' : homNay ? ' · hôm nay' : ''}
                </span>
              )
            })}
            {duBuoi != null && dot.buoi.length < duBuoi && <span className="px-1 py-1 text-[12.5px]" style={{ color: MAU.muted }}>dự kiến {duBuoi} buổi</span>}
          </div>
        )}

        {tiep && dot.tong > 0 && dot.xong < dot.tong && (
          <NutHS onClick={() => onPickDang(tiep, dot.mon, dot.dangs.filter((x) => x.ma_chuyen_de === tiep.ma_chuyen_de))} className="mt-4 w-full">
            {tiep.trang_thai === 'dang_hoc' ? 'Học tiếp' : 'Bắt đầu'}: {tiep.ten_dang} →
          </NutHS>
        )}
        {dot.tong > 0 && dot.xong === dot.tong && (
          <p className="mt-3 rounded-lg px-3 py-2 text-[14px] font-semibold" style={{ background: MAU.surface2, color: MAU.dung }}>🎉 Em đã xong mọi dạng — thầy cô sẽ xác nhận kết thúc đợt.</p>
        )}
      </div>

      {nhom.map((g) => {
        const xong = g.dangs.filter((d) => d.trang_thai === 'xong').length
        return (
          <div key={g.ma} className="mt-4">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <span className="text-[15px] font-bold" style={{ ...HEAD, color: MAU.ink }}>{g.ten}</span>
              <span className="text-[13px]" style={{ color: MAU.muted }}>{xong}/{g.dangs.length}</span>
            </div>
            <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-2">
              {g.dangs.map((d, i) => {
                const truoc = i > 0 ? g.dangs[i - 1] : undefined
                const bam = d.trang_thai !== 'khoa' && d.trang_thai !== 'giay'
                const noi = d.trang_thai === 'dang_hoc' || d.trang_thai === 'toi_luot'
                return (
                  <button key={d.ma_dang} disabled={!bam} onClick={() => onPickDang(d, dot.mon, g.dangs.filter((x) => x.tren_app))}
                    className="flex items-center gap-3 p-3.5 text-left disabled:opacity-60"
                    style={noi && d.ma_dang === tiep?.ma_dang ? { ...THE, border: `2px solid ${MAU.acc}` } : THE}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-[22px]" style={{ background: MAU.surface2 }}>{ICON[d.trang_thai]}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-bold leading-tight" style={{ ...HEAD, color: d.trang_thai === 'xong' ? MAU.dung : MAU.ink }}>{d.ten_dang}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug" style={{ color: MAU.muted }}>{chiTiet(d, truoc)}</span>
                    </span>
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-bold"
                      style={d.trang_thai === 'dang_hoc' ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface2, color: d.trang_thai === 'xong' ? MAU.dung : MAU.muted }}>
                      {NHAN[d.trang_thai]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
