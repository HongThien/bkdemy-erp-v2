/// ============================================================================
// AlbumHS — ALBUM HUY HIỆU của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.7 A5.3, mig 202609281846).
// 8 huy hiệu × 5 sao · "Sắp đạt" · N bạn trong khối có (< 10% = Hiếm) · checklist tháng này · lịch sử từng tháng.
// Số liệu nguyên từ fn_hs_album — ở đây chỉ trình bày.
// Thùy 29/09: khung/chữ trang theo skin (KhungHS); màu từng huy hiệu + vàng "hoàn hảo/bản cứng" là màu GAME, giữ.
// ============================================================================
// Tách VIEW (AlbumView — chỉ vẽ từ 1 object Album) khỏi container (gọi RPC) để màn xem mẫu hs.html?xem=gami vẽ mọi trạng thái
// bằng dữ liệu giả; hình + màu huy hiệu lấy từ gami/hinh.ts (đổi vỏ ở đó, không sửa màn).
import { useEffect, useState } from 'react'
import { albumCuaToi, type Album, type AlbumHuyHieu } from '../../lib/huyhieu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD } from './skin/KhungHS'
import { mauHH, nenTheHH, sangTheHH, VANG_NEN, MAU_GAMI } from './gami/hinh'
import { HinhHuyHieu } from './gami/HinhGami'
import { ChucMungSao, saoChuaXem, daXemHetSao, type SaoMoi } from './gami/ChucMung'
const thangNgan = (ym: string) => `T${Number(ym.slice(5))}`

// Tiến độ tới sao kế (từ số tháng DB đã đếm) — chỉ để hiển thị.
function saoKe(h: AlbumHuyHieu, al: Album) {
  const ke = al.thang_sao.find((s) => s.sao === h.sao + 1)
  if (!ke) return null
  const co = ke.loai === 'chuan' ? h.n_chuan : h.n_hoan_hao
  return { ke, co, con: Math.max(0, ke.so_thang - co) }
}

// Dựng theo ảnh toàn cảnh Đơn 1 (design/handoff/gami-v1/reference/man_album_dt_1 · _ipad_1 · _dt_2 · _dt_3, Thùy duyệt 30/09):
// mỗi huy hiệu = 1 THẺ TÔ MÀU MEN của chính nó (chưa mở = xanh đêm, viền bạc), viền vàng cổ · hình huy hiệu to bên trái · tên + việc
// ghi nhận + hàng 5 sao · cột phải "Tới ★n" + thanh + số bạn trong khối · nhãn Hiếm / ×2 ở góc. Bấm ⇒ mở rộng tại chỗ.
// Màu thẻ là màu GAME (gami/hinh.ts), cố định mọi style — huy hiệu là tài sản sưu tầm, đổi style không đổi màu.
function HangSao({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex gap-[1px]" aria-label={`${n}/5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ fontSize: size, lineHeight: 1, color: i <= n ? MAU_GAMI.vanhSang : MAU_GAMI.saoRong }}>{i <= n ? '★' : '☆'}</span>)}
    </span>
  )
}
function Thanh({ pct, mau }: { pct: number; mau: string }) {
  return (
    <span className="mt-1 block h-2.5 w-full overflow-hidden rounded-full" style={{ background: MAU_GAMI.thanhNen, border: `1px solid ${MAU_GAMI.thanhVien}` }}>
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: mau }} />
    </span>
  )
}
const O_NHO = { background: MAU_GAMI.nenO, border: `1px solid ${MAU_GAMI.vienO}`, borderRadius: 'calc(var(--sk-radius) * 0.7)' }

function TheHuyHieu({ h, al, mo, onMo }: { h: AlbumHuyHieu; al: Album; mo: boolean; onMo: () => void }) {
  const k = saoKe(h, al)
  const cao = h.dat.length ? h.dat[h.dat.length - 1] : null
  const hiem = cao && al.si_so_khoi > 0 && cao.so_ban_khoi / al.si_so_khoi < 0.1
  const coSao = h.sao > 0
  const pct = k ? Math.round(100 * Math.min(1, k.co / k.ke.so_thang)) : 100
  const nhan = [hiem && 'Hiếm', cao && cao.lan > 1 && `×${cao.lan}`].filter(Boolean) as string[]
  return (
    <div id={`hh-${h.key}`} className="relative overflow-hidden" style={{
      borderRadius: 'var(--sk-radius)', color: MAU_GAMI.chu, scrollMarginTop: 12,
      background: coSao ? nenTheHH(h.key) : MAU_GAMI.nenKhoa,
      border: `1.5px solid ${coSao ? MAU_GAMI.vanh : MAU_GAMI.vienKhoa}`,
      boxShadow: mo && coSao ? sangTheHH(h.key) : '0 4px 14px rgba(0,0,0,.28)',
    }}>
      {nhan.length > 0 && (
        <span className="absolute right-2 top-2 z-[1] flex gap-1">
          {nhan.map((t) => <span key={t} className="rounded-md px-1.5 py-0.5 text-[12px] font-extrabold leading-none" style={{ background: t === 'Hiếm' ? MAU_GAMI.hiem : MAU_GAMI.thanhNen, border: `1px solid ${MAU_GAMI.vienO}` }}>{t}</span>)}
        </span>
      )}
      <button onClick={onMo} aria-expanded={mo} className="flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left">
        <HinhHuyHieu hhKey={h.key} sao={h.sao} size={72} title={h.ten} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[20px] font-bold leading-tight" style={HEAD}>{h.ten}</span>
          <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: MAU_GAMI.chuPhu }}>{h.ghi_nhan}</span>
          <span className="mt-1 block"><HangSao n={h.sao} /></span>
        </span>
        <span className={`w-[42%] max-w-[240px] shrink-0 text-[12.5px] leading-snug ${nhan.length ? 'pt-4' : ''}`}>
          {k ? <>Tới <b>★{k.ke.sao}</b>: {k.co}/{k.ke.so_thang} tháng {k.ke.loai === 'chuan' ? 'đạt chuẩn' : 'hoàn hảo'}</> : <b>Đủ 5 sao mùa này 🎉</b>}
          {k?.ke.ban_cung && <span className="ml-1 font-bold" style={{ color: MAU_GAMI.vanhSang }}>· bản cứng</span>}
          <span className="flex items-center gap-1.5">
            <span className="min-w-0 flex-1"><Thanh pct={pct} mau={coSao ? mauHH(h.key).mau : MAU_GAMI.vienKhoa} /></span>
            {mo && <span className="mt-1 shrink-0 text-[12px] font-bold">{pct}%</span>}
          </span>
          {cao
            ? <span className="mt-1 block" style={{ color: MAU_GAMI.chuPhu }}>{cao.so_ban_khoi}/{al.si_so_khoi} bạn trong khối có ★{cao.sao}</span>
            : <span className="mt-1.5 inline-block rounded-md px-2 py-0.5 text-[12px] font-bold" style={{ background: MAU_GAMI.nenO, border: `1px solid ${MAU_GAMI.vienKhoa}` }}>Chưa mở khoá</span>}
          {cao && cao.sao >= 4 && <span className="block font-bold" style={{ color: MAU_GAMI.vanhSang }}>{cao.da_trao ? 'Đã nhận bản cứng' : 'Chờ thầy cô trao bản cứng'}</span>}
        </span>
      </button>
      {mo && (
        <div className="px-3 pb-3">
          {h.cau_chuyen && <p className="mb-2.5 text-[14.5px] leading-snug">{h.cau_chuyen}</p>}
          <div className="grid gap-2">
            <div className="px-3 py-2" style={O_NHO}>
              <p className="mb-1 text-[13px] font-extrabold uppercase tracking-wide" style={{ ...HEAD, textTransform: 'uppercase', color: MAU_GAMI.vanhSang }}>Tháng này</p>
              {h.thang_nay.map((x) => {
                const kq = x.ket_qua ?? 'khong_dat'
                return (
                  <div key={x.key} className="flex items-center gap-2 py-0.5 text-[14px]">
                    {kq === 'khong_ap_dung'
                      ? <span className="w-[18px] text-center font-bold" style={{ color: MAU_GAMI.chuPhu }}>–</span>
                      : <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-[13px] font-black" style={kq === 'dat' ? { background: MAU.dung } : { border: `1.5px solid ${MAU_GAMI.chuPhu}` }}>{kq === 'dat' ? '✓' : ''}</span>}
                    <span className="min-w-0 flex-1" style={{ opacity: kq === 'khong_ap_dung' ? 0.7 : 1 }}>{x.ten}</span>
                    <span className="shrink-0 text-[11.5px]" style={{ color: MAU_GAMI.chuPhu }}>{x.vai === 'chuan' ? 'chuẩn' : '★4–5'}</span>
                  </div>
                )
              })}
            </div>
            <div className="px-3 py-2" style={O_NHO}>
              <p className="mb-1.5 text-[13px] font-extrabold uppercase tracking-wide" style={{ ...HEAD, textTransform: 'uppercase', color: MAU_GAMI.vanhSang }}>Các tháng</p>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.max(5, h.lich_su.length)}, minmax(0,1fr))` }}>
                {h.lich_su.map((m) => (
                  <span key={m.thang} className="flex flex-col items-center rounded-md py-1 text-[12px] font-bold leading-tight" style={{ border: `1px solid ${MAU_GAMI.vienO}` }}>
                    <span style={{ color: MAU_GAMI.chuPhu }}>{thangNgan(m.thang)}</span>
                    <span className="mt-0.5 text-[14.5px]" style={{ color: m.hoan_hao ? MAU_GAMI.vanhSang : m.chuan ? MAU.dung : MAU_GAMI.chuPhu }}>
                      {m.hoan_hao ? '★' : m.chuan ? '✓' : m.chuan === null ? '–' : '·'}{m.da_chot ? '' : '*'}
                    </span>
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[11.5px]" style={{ color: MAU_GAMI.chuPhu }}>✓ đạt chuẩn · ★ hoàn hảo · – chưa áp dụng · * đang tạm tính</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── VIEW: chỉ vẽ. mo/onMo do cha giữ; chucMung = sao mới cần chúc (null = không) ──
export function AlbumView({ al, mo, onMo, chucMung, onDongChucMung }: {
  al: Album; mo: string | null; onMo: (key: string) => void; chucMung?: SaoMoi | null; onDongChucMung?: () => void
}) {
  const sapDat = al.huy_hieu.map((h) => ({ h, k: saoKe(h, al) })).filter((x) => x.k && x.k.con > 0 && x.k.con <= 2)
    .sort((a, b) => a.k!.con - b.k!.con).slice(0, 3)
  // Bấm 1 dòng "Sắp đạt" ⇒ mở thẻ huy hiệu đó + cuộn tới (đang mở thì giữ nguyên, không đóng).
  const toi = (key: string) => {
    if (mo !== key) onMo(key)
    requestAnimationFrame(() => document.getElementById(`hh-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return (
    <>
      {sapDat.length > 0 && (
        <div className="mt-4 overflow-hidden" style={{ borderRadius: 'var(--sk-radius)', background: MAU_GAMI.nenSapDat, border: `1.5px solid ${MAU_GAMI.vanh}`, boxShadow: `0 0 16px ${VANG_NEN}`, color: MAU_GAMI.chu }}>
          {sapDat.map(({ h, k }, i) => (
            <button key={h.key} onClick={() => toi(h.key)} className="flex w-full items-center gap-2.5 px-3 py-2 text-left" style={i ? { borderTop: `1px solid ${MAU_GAMI.vienO}` } : undefined}>
              <span className="shrink-0 rounded-md px-2 py-1 text-[12px] font-extrabold uppercase leading-none" style={{ background: MAU_GAMI.nhanVang, color: MAU_GAMI.nhanVangChu, visibility: i ? 'hidden' : 'visible' }}>Sắp đạt</span>
              <HinhHuyHieu hhKey={h.key} sao={h.sao} size={46} />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[17.5px] font-bold" style={HEAD}>{h.ten} <span style={{ color: MAU_GAMI.vanhSang }}>★{k!.ke.sao}</span></span>
                <span className="block text-[14px]" style={{ color: MAU_GAMI.chuPhu }}>còn {k!.con} tháng {k!.ke.loai === 'chuan' ? 'đạt chuẩn' : 'hoàn hảo'}</span>
              </span>
              <span aria-hidden className="shrink-0 text-[24px] leading-none" style={{ color: MAU_GAMI.vanhSang }}>›</span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 grid items-start gap-2.5 md:grid-cols-2">
        {al.huy_hieu.map((h) => <TheHuyHieu key={h.key} h={h} al={al} mo={mo === h.key} onMo={() => onMo(h.key)} />)}
      </div>
      {chucMung && onDongChucMung && <ChucMungSao s={chucMung} onDong={onDongChucMung} />}
    </>
  )
}

export function tieuDeAlbum(al: Album | null) {
  const tongSao = al ? al.huy_hieu.reduce((s, h) => s + h.sao, 0) : 0   // đếm sao đang hiển thị (badge)
  return al ? `Mùa ${al.mua} · album ${tongSao}/${al.huy_hieu.length * 5} sao · ★4–★5 được trung tâm tặng bản cứng` : 'Sưu tầm huy hiệu qua từng tháng học'
}

export default function AlbumHS({ gioiTinh, onBack }: { gioiTinh: 'nam' | 'nu' | null; onBack: () => void }) {
  const [al, setAl] = useState<Album | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [chuc, setChuc] = useState<SaoMoi | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => (m ? albumCuaToi(m) : null))
      .then((r) => { setAl(r); setState(r ? 'san_sang' : 'trong'); if (r) setChuc(saoChuaXem(r)) })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Huy hiệu {al?.mon ?? ''}</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>{tieuDeAlbum(al)}</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.muted }}>Huy hiệu chưa mở cho môn của em.</p>}

      {state === 'san_sang' && al && (
        <AlbumView al={al} mo={mo} onMo={(k) => setMo((x) => (x === k ? null : k))}
          chucMung={chuc} onDongChucMung={() => { daXemHetSao(al); setChuc(null) }} />
      )}
    </Khung>
  )
}
