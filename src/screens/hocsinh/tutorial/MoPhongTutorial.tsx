// ============================================================================
// MÀN MÔ PHỎNG cho từng chương tutorial — bản thu nhỏ của màn thật, dữ liệu giả, KHÔNG gọi DB.
// Mỗi phần có thể "soi" bọc trong <Soi id="…">: câu thoại đang nói trỏ `soi` vào id nào thì phần đó sáng, phần khác mờ đi.
// Màu CHỈ lấy từ skin (MAU/THE/HEAD) — đổi style là mô phỏng đổi theo (design/STYLE-HS.md).
// ============================================================================
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import { MAU, THE, THE_TRON, HEAD, BadgeHS, NhanHS } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { GOC } from '../gami/hinh'
import type { ChuongTutorial } from './noiDungTutorial'

const SoiCtx = createContext<string | undefined>(undefined)

// giu: id của phần CON nằm trong khung này — con đang soi thì khung giữ sáng (không mờ theo), chỉ con phát sáng.
function Soi({ id, giu = [], children, className = '', style }: { id: string; giu?: string[]; children: ReactNode; className?: string; style?: CSSProperties }) {
  const dang = useContext(SoiCtx)
  const sang = dang === id
  const mo = !!dang && !sang && !giu.includes(dang)
  return (
    <div data-soi={id} className={`relative transition-all duration-300 ${className}`}
      style={{
        ...style,
        opacity: mo ? 0.35 : 1,
        filter: mo ? 'saturate(0.6)' : undefined,
        transform: sang ? 'scale(1.03)' : undefined,
        zIndex: sang ? 2 : undefined,
        borderRadius: style?.borderRadius ?? 'var(--sk-radius)',
        boxShadow: sang ? `0 0 0 2px ${MAU.acc}, 0 0 22px 2px ${MAU.acc}` : style?.boxShadow,
        animation: sang ? 'tut-nhip 1.6s ease-in-out infinite' : undefined,
      }}>
      {children}
    </div>
  )
}

const chu = (s: CSSProperties = {}): CSSProperties => ({ color: MAU.ink, ...s })
const mo = { color: MAU.muted }

function IconO({ id, lon }: { id: string; lon?: boolean }) {
  const skin = laySkin(null)
  const anh = skin.anhO?.[id]
  const c = lon ? 'h-14 w-14' : 'h-10 w-10'
  return anh ? <img src={anh} alt="" className={`${c} object-contain`} /> : <span className="text-[26px]" style={{ color: MAU.acc }}>{skin.dauThayIcon ?? '✦'}</span>
}

// ── 1. Tự luyện ──────────────────────────────────────────────────────────────
function MpTuLuyen() {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-2">
        <Soi id="o_home" style={THE}>
          <div className="flex flex-col items-center gap-1 p-2 text-center">
            <IconO id="tu_luyen" /><b className="text-[13px]" style={{ ...HEAD, ...chu() }}>Tự luyện</b>
            <span className="text-[10.5px]" style={mo}>Luyện theo dạng yếu</span>
          </div>
        </Soi>
        {['so_tay', 'thong_tin'].map((o) => (
          <div key={o} className="flex flex-col items-center gap-1 p-2 text-center opacity-40" style={THE}><IconO id={o} /><span className="text-[11px]" style={mo}>…</span></div>
        ))}
      </div>
      <Soi id="the_tong_hop" style={THE}>
        <div className="flex items-center gap-3 p-3">
          <span className="text-[26px]">🎯</span>
          <div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Tổng hợp</b><p className="text-[12px]" style={mo}>10 câu · máy chọn theo dạng em yếu</p></div>
        </div>
      </Soi>
      <Soi id="phan_bo" style={THE}>
        <div className="p-3">
          <p className="mb-2 text-[12px] font-bold" style={mo}>1 LƯỢT = 10 CÂU</p>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="flex h-7 flex-1 items-center justify-center rounded-md text-[11px] font-bold"
                style={i < 6 ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface2, color: MAU.ink, border: `1px solid ${MAU.line}` }}>{i + 1}</span>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11.5px]"><span style={{ color: MAU.acc }}>6 câu dạng đang yếu</span><span style={mo}>4 câu ôn dạng đã học</span></div>
        </div>
      </Soi>
      <Soi id="ket_qua" style={THE}>
        <div className="flex items-center justify-between gap-2 p-3">
          <div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>8/10 câu đúng</b><p className="text-[12px]" style={mo}>Hôm nay em đã luyện 20 câu.</p></div>
          <span className="rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Luyện lượt mới</span>
        </div>
      </Soi>
    </div>
  )
}

// ── 2. Tự luyện chủ đề ──────────────────────────────────────────────────────
function MpChuDe() {
  const dang = [
    { ten: 'Cộng, trừ số hữu tỉ', pt: 32, luyen: '12/40' },
    { ten: 'Luỹ thừa của số hữu tỉ', pt: 58, luyen: '6/35' },
    { ten: 'Làm tròn số', pt: null, luyen: '0/22' },
  ]
  return (
    <div className="grid gap-3">
      <Soi id="the_chu_de" style={THE}>
        <div className="flex items-center gap-3 p-3"><span className="text-[26px]">📚</span>
          <div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Theo chủ đề</b><p className="text-[12px]" style={mo}>Chọn dạng để luyện</p></div></div>
      </Soi>
      <Soi id="cau_moi" style={THE}>
        <div className="flex items-center justify-between p-3">
          <span className="text-[13.5px] font-bold" style={chu()}>Chỉ câu mới</span>
          <span className="flex h-6 w-11 items-center rounded-full p-0.5" style={{ background: MAU.acc }}><span className="ml-auto h-5 w-5 rounded-full" style={{ background: MAU.accInk }} /></span>
        </div>
      </Soi>
      <Soi id="ds_dang" giu={['dang_dau', 'chua_danh_gia']} className="grid gap-2" style={{ borderRadius: 'var(--sk-radius)' }}>
        {dang.map((d, i) => {
          const noiDung = (
            <div className="p-3" style={THE}>
              <div className="flex items-center justify-between gap-2">
                <b className="text-[14px]" style={chu()}>{d.ten}</b>
                {d.pt == null ? <NhanHS mau={MAU.muted}>Chưa đánh giá</NhanHS> : <b className="text-[14px]" style={{ color: d.pt < 50 ? MAU.sai : MAU.canhBao }}>{d.pt}%</b>}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
                <div className="h-full rounded-full" style={{ width: `${d.pt ?? 0}%`, background: d.pt != null && d.pt < 50 ? MAU.sai : MAU.canhBao }} />
              </div>
              <p className="mt-1 text-[11.5px]" style={mo}>Đã luyện {d.luyen} câu trong kho</p>
            </div>
          )
          return i === 0 ? <Soi key={d.ten} id="dang_dau">{noiDung}</Soi> : d.pt == null ? <Soi key={d.ten} id="chua_danh_gia">{noiDung}</Soi> : <div key={d.ten}>{noiDung}</div>
        })}
      </Soi>
    </div>
  )
}

// ── 3. Thử thách ─────────────────────────────────────────────────────────────
function MpThuThach() {
  return (
    <div className="grid gap-3">
      <Soi id="the_thu_thach" style={THE}>
        <div className="flex items-center gap-3 p-3"><span className="text-[26px]">⚔️</span>
          <div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Thử thách</b><p className="text-[12px]" style={mo}>Như Tổng hợp, đúng từ 80% được cộng Điểm Rank</p></div></div>
      </Soi>
      <Soi id="cham_cau" style={THE}>
        <div className="p-3">
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="flex h-8 flex-1 items-center justify-center rounded-md text-[14px] font-bold"
                style={{ background: i < 8 ? MAU.dung : MAU.sai, color: MAU.accInk }}>{i < 8 ? '✓' : '✗'}</span>
            ))}
          </div>
          <p className="mt-2 text-center text-[15px] font-bold" style={{ ...HEAD, color: MAU.acc }}>Vượt Thử thách! 8/10 câu đúng</p>
        </div>
      </Soi>
      <Soi id="bang_thuong" style={THE}>
        <div className="grid grid-cols-3 gap-2 p-3 text-center">
          {[['8 câu', 10], ['9 câu', 20], ['10 câu', 30]].map(([c, d]) => (
            <div key={c} className="rounded-lg py-2" style={{ background: MAU.surface2 }}>
              <p className="text-[12px]" style={mo}>Đúng {c}</p><b className="text-[18px]" style={{ ...HEAD, color: MAU.acc }}>+{d}</b><p className="text-[10.5px]" style={mo}>Điểm Rank</p>
            </div>
          ))}
        </div>
      </Soi>
      <Soi id="tien_do" style={THE}>
        <div className="grid gap-2 p-3">
          {[['Hôm nay', 20, 30], ['Tháng này', 240, 600]].map(([n, a, b]) => (
            <div key={n as string}>
              <div className="flex justify-between text-[12.5px]"><span style={chu()}>{n}</span><b style={chu()}>{a}/{b}</b></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}><div className="h-full rounded-full" style={{ width: `${((a as number) / (b as number)) * 100}%`, background: MAU.acc }} /></div>
            </div>
          ))}
        </div>
      </Soi>
    </div>
  )
}

// ── 4. Nhiệm vụ ──────────────────────────────────────────────────────────────
function DongNv({ ma, ten, diem, xong }: { ma: string; ten: string; diem: number; xong?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <img src={`${GOC}/nhiem-vu/${ma}.png`} alt="" className="h-8 w-8 object-contain" />
      <span className="flex-1 text-[13px]" style={chu({ textDecoration: xong ? 'line-through' : undefined, opacity: xong ? 0.7 : 1 })}>{ten}</span>
      <b className="text-[12.5px]" style={{ color: xong ? MAU.dung : MAU.acc }}>{xong ? '✓' : `+${diem}`}</b>
    </div>
  )
}
function MpNhiemVu() {
  return (
    <div className="grid gap-3">
      <Soi id="link_nhiem_vu" style={THE}>
        <div className="flex items-center justify-center gap-2 p-2.5 text-[14px] font-bold" style={{ ...HEAD, color: MAU.acc }}>📜 Nhiệm vụ ›</div>
      </Soi>
      <Soi id="khoi_ngay" style={THE}>
        <div className="p-3">
          <p className="text-[12px] font-bold" style={mo}>HÔM NAY</p>
          <DongNv ma="N1" ten="Vượt 1 Thử thách" diem={10} xong />
          <DongNv ma="N2" ten="Luyện 20 câu" diem={10} />
          <DongNv ma="N3" ten="Sửa sai 2 câu" diem={10} />
        </div>
      </Soi>
      <Soi id="quay" style={THE}>
        <div className="flex items-center gap-3 p-3">
          <img src={`${GOC}/nhiem-vu/vong_quay.png`} alt="" className="h-10 w-10 object-contain" />
          <span className="flex-1 text-[13px]" style={chu()}>Xong 2 nhiệm vụ hôm nay để quay</span><b style={{ color: MAU.acc }}>1/2</b>
        </div>
      </Soi>
      <Soi id="khoi_tuan" style={THE}>
        <div className="p-3">
          <div className="flex items-center justify-between"><p className="text-[12px] font-bold" style={mo}>TUẦN 1 · MỖI VIỆC +40</p>
            <img src={`${GOC}/nhiem-vu/ruong_dong.png`} alt="" className="h-9 w-9 object-contain" /></div>
          <div className="mt-1 grid grid-cols-4 gap-1">
            {['T1', 'T2', 'T3', 'T4'].map((m) => <img key={m} src={`${GOC}/nhiem-vu/${m}.png`} alt="" className="mx-auto h-9 w-9 object-contain" />)}
          </div>
        </div>
      </Soi>
      <Soi id="chang" style={THE}>
        <div className="p-3">
          <div className="flex justify-between text-[12.5px]"><span style={chu()}>Chặng tháng · cấp 7/30</span><b style={chu()}>30/50</b></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}><div className="h-full w-3/5 rounded-full" style={{ background: MAU.acc }} /></div>
          <p className="mt-1 text-[11.5px]" style={mo}>Lên cấp +25 EXP · cuối tháng EXP đổi ra xu</p>
        </div>
      </Soi>
    </div>
  )
}

// ── 5. Rank ──────────────────────────────────────────────────────────────────
const BAC = ['Novice', 'Soldier', 'Captain', 'General', 'Hero', 'Legend', 'King', 'Emperor', 'God of War', 'Supreme God']
function MpRank() {
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <Soi id="mon" className="flex gap-1.5" style={{ borderRadius: '999px' }}>
          {['Toán', 'KHTN'].map((m, i) => (
            <span key={m} className="rounded-full px-3 py-1 text-[12.5px] font-bold" style={i === 0 ? { background: MAU.acc, color: MAU.accInk } : { ...THE_TRON, borderRadius: '999px' }}>{m}</span>
          ))}
        </Soi>
      </div>
      <Soi id="the_bac" style={THE}>
        <div className="flex items-center gap-3 p-3">
          <IconO id="xep_hang" lon />
          <div className="flex-1">
            <b className="text-[18px]" style={{ ...HEAD, color: MAU.acc }}>Captain ★★</b>
            <p className="text-[12.5px]" style={chu()}>5.140 điểm · hạng 4/38 khối</p>
            <p className="text-[11.5px]" style={mo}>Còn 2.735 điểm lên General</p>
          </div>
        </div>
      </Soi>
      <Soi id="nguon_diem" style={THE}>
        <div className="grid grid-cols-4 gap-1.5 p-3 text-center">
          {[['ET', '100'], ['BTVN', '100'], ['Thử thách', '10–30'], ['MT', '≤1.000']].map(([n, d]) => (
            <div key={n} className="rounded-lg py-1.5" style={{ background: MAU.surface2 }}><p className="text-[11px]" style={mo}>{n}</p><b className="text-[13px]" style={{ color: MAU.acc }}>{d}</b></div>
          ))}
        </div>
      </Soi>
      <Soi id="thang_bac" style={THE}>
        <div className="flex flex-wrap gap-1 p-3">
          {BAC.map((b, i) => (
            <span key={b} className="rounded-md px-1.5 py-0.5 text-[11px] font-bold"
              style={i === 2 ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface2, color: i < 2 ? MAU.ink : MAU.muted }}>{i + 1}. {b}</span>
          ))}
        </div>
      </Soi>
      <Soi id="bang_thang" style={THE}>
        <div className="p-3">
          <p className="text-[12px] font-bold" style={mo}>ĐUA THÁNG 10 · KHỐI 7</p>
          {[['1', 'Lê Minh Anh', 1240], ['2', 'Phạm Gia Bảo', 1105], ['3', 'Em', 980]].map(([h, t, d]) => (
            <div key={h as string} className="flex items-center gap-2 py-1 text-[13px]" style={chu({ fontWeight: t === 'Em' ? 800 : 500 })}>
              <span className="w-5 text-center" style={{ color: MAU.acc }}>{h}</span><span className="flex-1">{t}</span><span>{(d as number).toLocaleString('vi-VN')}</span>
            </div>
          ))}
        </div>
      </Soi>
    </div>
  )
}

// ── 6. Thế giới BK ──────────────────────────────────────────────────────────
function MpTheGioi() {
  return (
    <div className="grid gap-3">
      <Soi id="tab" className="flex gap-1.5" style={{ borderRadius: '999px' }}>
        {['Thế giới', 'Bạn bè', 'Lớp'].map((t, i) => (
          <span key={t} className="flex-1 rounded-full py-1.5 text-center text-[13px] font-bold" style={i === 0 ? { background: MAU.acc, color: MAU.accInk } : { ...THE_TRON, borderRadius: '999px' }}>{t}</span>
        ))}
      </Soi>
      <Soi id="cho_khoe" giu={['nut_khoe']} style={THE}>
        <div className="p-3">
          <p className="text-[12px] font-bold" style={mo}>🎉 THÀNH TÍCH CHỜ EM KHOE · còn 3/3 lượt hôm nay</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex-1 text-[14px] font-bold" style={chu()}>ET Toán 10 điểm</span>
            <Soi id="nut_khoe" style={{ borderRadius: 'var(--sk-radius)' }}>
              <span className="block rounded-lg px-3 py-1.5 text-[12.5px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Khoe</span>
            </Soi>
          </div>
        </div>
      </Soi>
      <Soi id="bai" giu={['tuong_tac']} className="p-3" style={THE}>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: MAU.surface2, color: MAU.ink }}>MA</span>
          <div className="leading-tight"><b className="text-[13.5px]" style={chu()}>Lê Minh Anh · 7A1</b><p className="text-[11px]" style={mo}>2 giờ trước</p></div>
        </div>
        <p className="mt-2 text-[14px]" style={chu()}>Vừa đạt <b style={{ color: MAU.acc }}>50 câu đúng</b> tự luyện trong ngày 🔥</p>
        <Soi id="tuong_tac" className="mt-2" style={{ borderRadius: 'var(--sk-radius)' }}>
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="rounded-full px-2.5 py-1" style={{ background: MAU.surface2, color: MAU.ink }}>👍 Thích · 12</span>
            <span className="rounded-full px-2.5 py-1" style={{ background: MAU.surface2, color: MAU.ink }}>💬 Bình luận (3)</span>
            <span className="rounded-full px-2.5 py-1" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Đỉnh quá!</span>
          </div>
        </Soi>
      </Soi>
      <Soi id="ket_ban" style={THE}>
        <div className="flex items-center gap-2 p-3">
          <span className="flex-1 text-[13px]" style={chu()}>Phạm Gia Bảo muốn kết bạn</span>
          <span className="rounded-lg px-3 py-1.5 text-[12px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Đồng ý</span>
          <span className="flex items-center"><BadgeHS n={1} /></span>
        </div>
      </Soi>
    </div>
  )
}

const MAN: Record<ChuongTutorial['id'], () => JSX.Element> = {
  tu_luyen: MpTuLuyen, chu_de: MpChuDe, thu_thach: MpThuThach, nhiem_vu: MpNhiemVu, rank: MpRank, the_gioi: MpTheGioi,
}

export default function MoPhongTutorial({ chuong, soi }: { chuong: ChuongTutorial['id']; soi?: string }) {
  const Man = MAN[chuong]
  return <SoiCtx.Provider value={soi}><Man /></SoiCtx.Provider>
}
