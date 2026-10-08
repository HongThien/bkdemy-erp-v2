// ============================================================================
// MÀN MÔ PHỎNG cho từng chương tutorial — bản thu nhỏ của màn thật, dữ liệu giả, KHÔNG gọi DB.
// Mỗi phần có thể "soi" bọc trong <Soi id="…">: câu thoại đang nói trỏ `soi` vào id nào thì phần đó sáng, phần khác mờ đi.
// Màu CHỈ lấy từ skin (MAU/THE/HEAD) — đổi style là mô phỏng đổi theo (design/STYLE-HS.md).
// ============================================================================
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import { MAU, THE, THE_TRON, HEAD, BadgeHS, NhanHS } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { anhDauNv, type NvId } from '../skin/nhanVat'
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
            <IconO id="tu_luyen" /><b className="text-[13px]" style={{ ...HEAD, ...chu() }}>Học tập</b>
            <span className="text-[10.5px]" style={mo}>Luyện, thi đấu, chinh phục</span>
          </div>
        </Soi>
        {['so_tay', 'thong_tin'].map((o) => (
          <div key={o} className="flex flex-col items-center gap-1 p-2 text-center opacity-40" style={THE}><IconO id={o} /><span className="text-[11px]" style={mo}>…</span></div>
        ))}
      </div>
      <Soi id="the_tong_hop" style={THE}>
        <div className="flex items-center gap-3 p-3">
          <span className="text-[26px]">🎯</span>
          <div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Luyện dạng yếu</b><p className="text-[12px]" style={mo}>10 câu · máy chọn theo dạng em yếu</p></div>
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
          <div className="mt-2 flex justify-between text-[11.5px]"><span style={{ color: MAU.acc }}>Phần lớn: dạng đang yếu</span><span style={mo}>Còn lại: ôn dạng đã học</span></div>
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

// ── 2. Học theo chủ đề (bản đồ phiêu lưu) ───────────────────────────────────────
function Diamond({ v }: { v?: boolean }) {
  return <span className="inline-block h-4 w-4 rotate-45 rounded-[3px]" style={{ background: v === true ? MAU.dung : v === false ? MAU.sai : 'transparent', border: `1.5px solid ${v === undefined ? MAU.acc : v ? MAU.dung : MAU.sai}` }} />
}
function MpChuDe() {
  return (
    <div className="grid gap-3">
      <Soi id="the_gioi_map" style={THE}>
        <div className="p-3">
          <p className="mb-2 text-[12px] font-bold" style={mo}>THẾ GIỚI TOÁN · MỖI CHỦ ĐỀ LÀ MỘT LỤC ĐỊA</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {['Số hữu tỉ', 'Hình học', 'Hàm số'].map((t, i) => (
              <div key={t} className="rounded-xl px-1 py-3" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}` }}>
                <b className="block text-[13px]" style={chu()}>{t}</b><span className="text-[11px]" style={{ color: i === 0 ? MAU.acc : MAU.muted }}>{i === 0 ? '★★★☆☆' : '☆☆☆☆☆'}</span>
              </div>
            ))}
          </div>
        </div>
      </Soi>
      <Soi id="cong_trinh" giu={['trang_thai']} style={THE}>
        <div className="p-3">
          <p className="mb-2 text-[12px] font-bold" style={mo}>CHUYÊN ĐỀ → DẠNG BÀI: MỖI DẠNG LÀ MỘT CÔNG TRÌNH</p>
          <div className="flex items-end justify-around gap-2">
            {[['Cộng trừ', 'dat', '🏠'], ['Luỹ thừa', 'yeu', '🏰'], ['Làm tròn', 'chua_do', '🏯']].map(([t, tt, ic]) => (
              <Soi key={t} id={tt === 'yeu' ? 'trang_thai' : `ct_${tt}`} className="flex flex-col items-center gap-1 px-2 py-1">
                <span className="text-[34px] leading-none">{ic}</span><b className="text-[12px]" style={chu()}>{t}</b>
                <span className="text-[10.5px]" style={{ color: tt === 'dat' ? MAU.dung : tt === 'yeu' ? MAU.sai : MAU.muted }}>{tt === 'dat' ? 'Đã chinh phục' : tt === 'yeu' ? 'Quái còn máu' : 'Chưa đo'}</span>
              </Soi>
            ))}
          </div>
        </div>
      </Soi>
      <Soi id="trang_thai" style={THE}>
        <div className="flex flex-wrap gap-1.5 p-3">
          <NhanHS mau={MAU.muted}>Chưa đo · vẫn vào được</NhanHS><NhanHS mau={MAU.sai}>Yếu · quái còn máu</NhanHS><NhanHS mau={MAU.dung}>Đạt · có cờ</NhanHS>
        </div>
      </Soi>
      <Soi id="combo" style={THE}>
        <div className="grid gap-2 p-3">
          <div className="flex items-center justify-between"><b className="text-[13px]" style={chu()}>Cứ 3 câu một chiêu</b><span className="flex gap-1.5"><Diamond v /><Diamond v /><Diamond v /></span></div>
          {[[3, 'Đúng 3/3: chiêu mạnh nhất'], [2, 'Đúng 2/3: chiêu mạnh'], [1, 'Đúng 1/3: chiêu nhẹ'], [0, 'Sai cả 3: quái đánh trả, hồi một chút máu']].map(([n, t]) => (
            <div key={n as number} className="flex items-center gap-2 text-[12.5px]" style={chu()}>
              <span className="flex gap-1">{[0, 1, 2].map((k) => <Diamond key={k} v={k < (n as number)} />)}</span><span>{t}</span>
            </div>
          ))}
        </div>
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
          <div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Thử thách</b><p className="text-[12px]" style={mo}>Như Luyện dạng yếu, đúng từ 8/10 câu là vượt</p></div></div>
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
        <p className="p-3 text-[12.5px]" style={chu()}>Lượt Thử thách là lượt học thật <span style={mo}>· được tính vào chuỗi làm bài</span></p>
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
          <DongNv ma="N2" ten="Luyện dạng yếu · lượt 1 (+20 EXP · +20 ĐHT)" diem={20} xong />
          <DongNv ma="N2" ten="Luyện dạng yếu · lượt 2" diem={20} />
          <DongNv ma="N2" ten="Luyện dạng yếu · lượt 3" diem={20} />
        </div>
      </Soi>
      <Soi id="quay" style={THE}>
        <div className="flex items-center gap-3 p-3">
          <img src={`${GOC}/nhiem-vu/vong_quay.png`} alt="" className="h-10 w-10 object-contain" />
          <span className="flex-1 text-[13px]" style={chu()}>Có 1 lượt đạt hôm nay để quay</span><b style={{ color: MAU.acc }}>1/1</b>
        </div>
      </Soi>
      <Soi id="khoi_tuan" style={THE}>
        <div className="p-3">
          <div className="flex items-center justify-between"><p className="text-[12px] font-bold" style={mo}>TUẦN 1 · MỖI VIỆC +100 EXP</p>
            <img src={`${GOC}/nhiem-vu/ruong_dong.png`} alt="" className="h-9 w-9 object-contain" /></div>
          <div className="mt-1 grid grid-cols-4 gap-1">
            {['T1', 'T2'].map((m) => <img key={m} src={`${GOC}/nhiem-vu/${m}.png`} alt="" className="mx-auto h-9 w-9 object-contain" />)}
          </div>
        </div>
      </Soi>
      <Soi id="chang" style={THE}>
        <div className="p-3">
          <div className="flex justify-between text-[12.5px]"><span style={chu()}>Điểm học tập</span><b style={chu()}>1.840/6.000</b></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}><div className="h-full w-[30%] rounded-full" style={{ background: MAU.acc }} /></div>
          <p className="mt-1 text-[11.5px]" style={mo}>Dùng để chơi game · nhiệm vụ mỗi ngày đều cộng</p>
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

// ── 0. Nhân vật và giao diện ────────────────────────────────────────────────
function MpGiaoDien() {
  return (
    <div className="grid gap-3">
      <Soi id="hai_kieu" style={{ borderRadius: 'var(--sk-radius)' }}>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5 p-3" style={THE}>
            <b className="text-[13px]" style={{ ...HEAD, ...chu() }}>Kiểu mặc định</b>
            {[70, 90, 55].map((w) => <span key={w} className="h-2 rounded-full" style={{ width: `${w}%`, background: MAU.surface2 }} />)}
            <span className="text-[11px]" style={mo}>Nền trơn, chữ gọn</span>
          </div>
          <div className="grid gap-1.5 p-3" style={{ ...THE, border: `1.5px solid ${MAU.acc}` }}>
            <b className="text-[13px]" style={{ ...HEAD, ...chu() }}>Kiểu game</b>
            <span className="flex gap-1 text-[18px]"><span>🗺️</span><span>🛡️</span><span>🐲</span></span>
            <span className="text-[11px]" style={mo}>Bản đồ, nhân vật, hiệu ứng</span>
          </div>
        </div>
      </Soi>
      <Soi id="nhan_vat" style={THE}>
        <div className="p-3">
          <p className="mb-2 text-[12px] font-bold" style={mo}>CHỌN 1 TRONG 6 NHÂN VẬT CHÍNH</p>
          <div className="grid grid-cols-6 gap-1.5">
            {['nam', 'nu', 'su_tu', 'cao', 'ninja', 'elf'].map((n, i) => (
              <span key={n} className="relative block h-12 overflow-hidden rounded-full" style={{ background: MAU.surface2, border: `2px solid ${i === 4 ? MAU.acc : MAU.line}` }}>
                <img src={anhDauNv(n as NvId, 'dung_1')} alt="" className="absolute left-1/2 top-0 w-[150%] max-w-none -translate-x-1/2" />
              </span>
            ))}
          </div>
        </div>
      </Soi>
      <Soi id="cong_tac" style={THE}>
        <div className="grid gap-2 p-3">
          {[['Hiệu ứng game', true], ['Đồ hoạ: Cao', null]].map(([t, b]) => (
            <div key={t as string} className="flex items-center justify-between text-[13.5px]" style={chu()}>
              <span className="font-bold">{t}</span>
              {b ? <span className="flex h-6 w-11 items-center rounded-full p-0.5" style={{ background: MAU.acc }}><span className="ml-auto h-5 w-5 rounded-full" style={{ background: MAU.accInk }} /></span> : <span style={mo}>Thấp · Vừa · Cao</span>}
            </div>
          ))}
        </div>
      </Soi>
    </div>
  )
}

// ── Khu Học tập ──────────────────────────────────────────────────────────────
function MpHocTap() {
  const o = [['Học theo chủ đề', 'Bản đồ phiêu lưu', 'the_gioi'], ['Luyện dạng yếu', 'Sửa dạng em còn yếu', 'tu_luyen_rieng'], ['Đấu trường BK', 'Thi đấu', 'xep_hang'], ['Chinh phục BK', 'Leo tháp', 'rank'], ['Giải Vô địch BK', 'Giải đấu', 'thanh_tuu']]
  return (
    <div className="grid gap-3">
      <Soi id="o_home" style={THE}>
        <div className="flex items-center gap-3 p-3"><IconO id="tu_luyen" /><div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Học tập</b><p className="text-[12px]" style={mo}>Luyện, thi đấu, chinh phục</p></div></div>
      </Soi>
      <Soi id="nam_o" style={THE}>
        <div className="grid gap-1.5 p-3">
          {o.map(([t, d, ic]) => (
            <div key={t} className="flex items-center gap-2.5 py-0.5"><IconO id={ic} /><div className="leading-tight"><b className="text-[13.5px]" style={chu()}>{t}</b><p className="text-[11.5px]" style={mo}>{d}</p></div></div>
          ))}
        </div>
      </Soi>
      <Soi id="luot_10" style={THE}>
        <div className="p-3">
          <p className="mb-2 text-[12px] font-bold" style={mo}>MỘT LƯỢT = 10 CÂU · LÀM BAO NHIÊU LƯỢT CŨNG ĐƯỢC</p>
          <div className="flex gap-1">{Array.from({ length: 10 }, (_, i) => <span key={i} className="flex h-7 flex-1 items-center justify-center rounded-md text-[11px] font-bold" style={{ background: MAU.surface2, color: MAU.ink, border: `1px solid ${MAU.line}` }}>{i + 1}</span>)}</div>
        </div>
      </Soi>
    </div>
  )
}

// ── Lượt học thật ────────────────────────────────────────────────────────────
function Dk({ ok, t }: { ok: boolean; t: string }) {
  return <div className="flex items-center gap-2 py-1 text-[13px]" style={chu()}><b style={{ color: ok ? MAU.dung : MAU.sai }}>{ok ? '✓' : '✗'}</b><span>{t}</span></div>
}
function MpLuotThat() {
  return (
    <div className="grid gap-3">
      <Soi id="dk_cau" giu={['dk_dung']} style={THE}>
        <div className="p-3">
          <p className="text-[12px] font-bold" style={mo}>LƯỢT ĐƯỢC TÍNH KHI CÙNG ĐÚNG CẢ BA</p>
          <Dk ok t="Làm ít nhất 5 câu" />
          <Soi id="dk_dung" className="px-0"><Dk ok t="Đúng ít nhất một nửa số câu đã làm" /></Soi>
          <Dk ok t="Trung bình mỗi câu từ 6 giây trở lên" />
        </div>
      </Soi>
      <Soi id="loai_bai" style={THE}>
        <div className="grid grid-cols-2 gap-2 p-3 text-[12.5px]" style={chu()}>
          <div><p className="font-bold" style={{ color: MAU.dung }}>Được tính</p><p>Luyện dạng yếu</p><p>Học theo chủ đề</p><p>Thử thách</p></div>
          <div><p className="font-bold" style={mo}>Cách tính riêng</p><p>ET · BTVN</p><p>Bài trên lớp</p><p>Học từ đầu</p></div>
        </div>
      </Soi>
      <Soi id="khong_tinh" style={THE}>
        <div className="p-3"><b className="text-[13.5px]" style={{ color: MAU.canhBao }}>Lượt này chưa được tính</b>
          <p className="mt-0.5 text-[12.5px]" style={mo}>Em làm hơi nhanh nên lượt chưa vào chuỗi và nhiệm vụ. Em vẫn học được bình thường.</p></div>
      </Soi>
    </div>
  )
}

// ── Đấu trường · Chinh phục · Giải vô địch ──────────────────────────────────
function MpDauChinhPhuc() {
  return (
    <div className="grid gap-3">
      <Soi id="luat_chung" style={THE}>
        <div className="grid gap-2 p-3">
          <div className="flex items-center justify-between text-[13px]" style={chu()}><b>Câu 4/10</b><b style={{ color: MAU.canhBao }}>⏱ 00:32</b></div>
          <div className="grid grid-cols-2 gap-1.5">
            {['A', 'B', 'C', 'D'].map((x, i) => <span key={x} className="rounded-lg px-3 py-2 text-center text-[13px] font-bold" style={i === 1 ? { background: MAU.sai, color: MAU.accInk } : { background: MAU.surface2, color: MAU.ink, opacity: i === 1 ? 1 : 0.9 }}>{x}{i === 1 ? ' ✗ (khoá)' : ''}</span>)}
          </div>
          <p className="text-[11.5px]" style={mo}>Chọn sai là khoá cả câu · mỗi câu chỉ bấm một lần</p>
        </div>
      </Soi>
      <Soi id="ba_che_do" style={THE}>
        <div className="grid gap-1.5 p-3 text-[13px]" style={chu()}>
          {[['Đấu trường BK', 'thi đấu với người chơi khác hoặc máy'], ['Chinh phục BK', 'leo tháp, mỗi tháp có bảng xếp hạng riêng'], ['Giải Vô địch BK', 'có đăng ký, nhánh đấu và lịch']].map(([t, d]) => (
            <p key={t}><b>{t}</b> <span style={mo}>· {d}</span></p>
          ))}
        </div>
      </Soi>
      <Soi id="khong_rank" style={THE}>
        <p className="p-3 text-[12.5px]" style={mo}>Điểm các chế độ này là sân chơi riêng, chưa cộng vào Rank, chuỗi hay nhiệm vụ.</p>
      </Soi>
    </div>
  )
}

// ── Huy hiệu ─────────────────────────────────────────────────────────────────
function MpHuyHieu() {
  const tt: [string, string, number, number][] = [['Chuỗi làm bài', 'ngày', 7, 100], ['Luyện yếu đạt liên tiếp', 'lượt', 3, 200], ['Tổng câu luyện đạt', 'câu', 1000, 100], ['Top 5 khối', 'hạng', 5, 300]]
  return (
    <div className="grid gap-3">
      <Soi id="tam_huy_hieu" style={THE}>
        <div className="grid gap-1.5 p-3">
          {tt.map(([ten, dv, ng, exp], i) => (
            <div key={ten} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: MAU.surface2 }}>
              <span className="text-[18px]" aria-hidden>{i < 2 ? '🏅' : '🔒'}</span>
              <b className="min-w-0 flex-1 text-[12.5px]" style={chu()}>{ten}</b>
              <span className="text-[11px]" style={mo}>{ng} {dv}</span>
              <b className="text-[11.5px]" style={{ color: i < 2 ? MAU.acc : MAU.muted }}>+{exp} EXP</b>
            </div>
          ))}
        </div>
      </Soi>
      <Soi id="sao" style={THE}>
        <div className="flex items-center justify-between p-3"><b className="text-[13.5px]" style={chu()}>Chuỗi làm bài</b><span className="text-[12.5px]" style={{ color: MAU.acc }}>✓ 7 ngày · ✓ 14 ngày · 30 ngày</span></div>
      </Soi>
      <Soi id="chot_thang" style={THE}>
        <div className="flex items-center gap-2 p-3 text-[13px]" style={chu()}><span aria-hidden>🔒</span><b>Thành tựu ẩn</b><span style={mo}>· đạt mới biết tên</span></div>
      </Soi>
      <Soi id="ghim" style={THE}>
        <div className="flex items-center gap-2 p-3 text-[12.5px]" style={chu()}><span className="flex-1">Đạt rồi! <span style={mo}>· +200 EXP, đổi ra xu trong Ví</span></span><b className="rounded-lg px-3 py-1.5" style={{ background: MAU.acc, color: MAU.accInk }}>Nhận quà</b></div>
      </Soi>
    </div>
  )
}

// ── Bảng xếp hạng ────────────────────────────────────────────────────────────
function MpBxh() {
  const hs: [number, string, number][] = [[1, 'Nguyễn Khôi Nguyên', 24], [2, 'Trịnh Bảo Ngọc', 22], [3, 'Lê Minh Anh', 20], [4, 'Em', 18]]
  return (
    <div className="grid gap-3">
      <Soi id="bxh_loc" style={THE}>
        <div className="grid grid-cols-3 gap-1.5 p-2.5 text-center text-[12px] font-bold" style={chu()}>
          {['Siêng luyện', 'Khối mình', 'Tháng này'].map((t) => (
            <span key={t} className="flex items-center justify-between rounded-lg px-2 py-2" style={{ background: MAU.surface2 }}>{t}<span style={{ color: MAU.acc }}>▾</span></span>
          ))}
        </div>
      </Soi>
      <Soi id="bxh_hang" style={THE}>
        <div className="flex items-center gap-2 p-3 text-[13px]" style={chu()}>
          <b className="rounded-full px-2 py-0.5 text-[12.5px]" style={{ background: MAU.acc, color: MAU.accInk }}>#4</b>
          <span>Em hạng 4/78 khối 9 · 18 lượt</span><span style={mo}>· chỉ mình em thấy</span>
        </div>
      </Soi>
      <Soi id="bxh_top" style={THE}>
        <div className="p-3">
          {hs.map(([h, t, d]) => (
            <div key={h} className="flex items-center gap-2 py-1 text-[13px]" style={chu({ fontWeight: t === 'Em' ? 800 : 500 })}>
              <span className="w-6 text-center" style={{ color: MAU.acc }}>{h <= 3 ? ['🥇', '🥈', '🥉'][h - 1] : h}</span><span className="flex-1">{t}</span><span>{d} lượt</span>
            </div>
          ))}
        </div>
      </Soi>
    </div>
  )
}

// ── EXP · xu · May mắn ───────────────────────────────────────────────────────
function MpXuMayMan() {
  return (
    <div className="grid gap-3">
      <Soi id="exp_xu" style={THE}>
        <div className="p-3">
          <div className="flex justify-between text-[12.5px]"><span style={chu()}>EXP tháng này · môn Toán</span><b style={chu()}>640</b></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}><div className="h-full w-2/3 rounded-full" style={{ background: MAU.acc }} /></div>
          <p className="mt-1.5 text-[12px]" style={mo}>Đổi ngay: cứ 100 EXP được 1 xu → <b style={{ color: MAU.acc }}>7 xu</b></p>
        </div>
      </Soi>
      <Soi id="vi_xu" style={THE}>
        <div className="flex items-center gap-3 p-3"><IconO id="vi_xu" /><div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Ví xu · 12 xu</b><p className="text-[12px]" style={mo}>Đổi quà tại tủ quà ở trung tâm</p></div></div>
      </Soi>
      <Soi id="quay_so" style={THE}>
        <div className="flex items-center gap-3 p-3"><IconO id="may_man" /><div className="flex-1"><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>May mắn</b><p className="text-[12px]" style={mo}>Có lượt đạt trong ngày là được quay</p></div>
          <span className="rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Quay</span></div>
      </Soi>
    </div>
  )
}

// ── Chuỗi làm bài (banner ở màn chính) ───────────────────────────────────────
function MpChuoi() {
  const ngay: [string, string, 'hoc' | 'lo' | 'nay'][] = [['T6', '02/10', 'hoc'], ['T7', '03/10', 'hoc'], ['CN', '04/10', 'hoc'], ['T2', '05/10', 'hoc'], ['T3', '06/10', 'hoc'], ['T4', '07/10', 'lo'], ['Nay', '08/10', 'nay']]
  return (
    <div className="grid gap-3">
      <Soi id="lua" giu={['bay_ngay', 'chua_giu', 'ngay_lo', 'moc']} style={{ ...THE, clipPath: 'none', border: `2px solid ${MAU.acc}` }}>
        <div className="flex items-center gap-3 p-3.5">
          <span className="text-[44px] leading-none" style={{ filter: 'grayscale(1) opacity(.65)' }} aria-hidden>🔥</span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em]" style={mo}>Chuỗi làm bài</p>
            <p className="text-[24px] font-bold" style={{ ...HEAD, ...chu() }}>12 ngày liên tiếp</p>
            <Soi id="chua_giu" className="mt-0.5"><p className="text-[13px]" style={mo}>Hôm nay chưa giữ chuỗi — luyện 1 lượt để không bị đứt</p></Soi>
          </div>
        </div>
        <Soi id="bay_ngay" className="mx-3.5 flex gap-1">
          {ngay.map(([t, d, k]) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[11px] font-bold" style={{ color: k === 'nay' ? MAU.acc : MAU.muted }}>{t}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-[16px]" style={{ background: k === 'hoc' ? MAU.acc : MAU.surface2, border: `2px solid ${k === 'lo' ? MAU.canhBao : k === 'nay' ? MAU.acc : 'transparent'}` }}>{k === 'hoc' ? '🔥' : k === 'lo' ? '⏳' : ''}</span>
              <span className="text-[10.5px]" style={mo}>{d}</span>
            </div>
          ))}
        </Soi>
        <Soi id="ngay_lo" className="mx-3.5 mt-2.5"><p className="text-[13px] font-bold" style={{ color: MAU.canhBao }}>Em lỡ 07/10 — vẫn sửa được, bấm để xem cách bù.</p></Soi>
        <div className="p-3.5 pt-2.5"><span className="block rounded-lg py-2.5 text-center text-[14px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Luyện ngay để giữ chuỗi</span></div>
      </Soi>
      <Soi id="moc" style={THE}>
        <div className="flex items-center justify-around p-3 text-center">
          {[3, 7, 14, 30, 50, 100].map((n) => (
            <div key={n}><p className="text-[18px] font-bold" style={{ ...HEAD, color: n <= 7 ? MAU.acc : MAU.muted }}>{n}</p><p className="text-[10.5px]" style={mo}>ngày</p></div>
          ))}
        </div>
      </Soi>
    </div>
  )
}

// ── Trò chơi (danh sách game) ────────────────────────────────────────────────
function MpTroChoi() {
  return (
    <div className="grid gap-3">
      <Soi id="o_tro_choi" style={THE}>
        <div className="flex items-center gap-3 p-3"><IconO id="tro_choi" lon /><div><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Trò chơi</b><p className="text-[12px]" style={mo}>Giải lao sau giờ học</p></div></div>
      </Soi>
      <Soi id="ds_game" giu={['nong_trai']} className="grid gap-2">
        <Soi id="nong_trai" style={THE}>
          <div className="flex gap-3 p-3">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] text-[30px]" style={{ background: MAU.surface2 }}>🌾</span>
            <div className="min-w-0 flex-1"><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Nông trại BK</b><p className="text-[12px]" style={mo}>Trồng trọt, thu hoạch, mở rộng vườn của em</p><p className="mt-1 text-[12.5px] font-bold" style={{ color: MAU.acc }}>Chơi ngay ›</p></div>
          </div>
        </Soi>
        <div style={{ ...THE, opacity: 0.55 }} className="flex gap-3 p-3">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] text-[28px] font-extrabold" style={{ background: MAU.surface2, border: '1.5px dashed var(--sk-line)', color: MAU.muted }}>?</span>
          <div className="min-w-0 flex-1"><b className="text-[15px]" style={{ ...HEAD, ...chu() }}>Game mới</b> <NhanHS mau="var(--sk-muted)">Sắp ra mắt</NhanHS><p className="mt-0.5 text-[12px]" style={mo}>Đang chuẩn bị</p></div>
        </div>
      </Soi>
    </div>
  )
}

const MAN: Record<ChuongTutorial['id'], () => JSX.Element> = {
  chuoi: MpChuoi, tro_choi: MpTroChoi,
  giao_dien: MpGiaoDien, hoc_tap: MpHocTap, chu_de: MpChuDe, tu_luyen: MpTuLuyen, luot_that: MpLuotThat, thu_thach: MpThuThach, dau_chinh_phuc: MpDauChinhPhuc,
  nhiem_vu: MpNhiemVu, bxh: MpBxh, rank: MpRank, huy_hieu: MpHuyHieu, xu_may_man: MpXuMayMan, the_gioi: MpTheGioi,
}

export default function MoPhongTutorial({ chuong, soi }: { chuong: ChuongTutorial['id']; soi?: string }) {
  const Man = MAN[chuong]
  return <SoiCtx.Provider value={soi}><Man /></SoiCtx.Provider>
}
