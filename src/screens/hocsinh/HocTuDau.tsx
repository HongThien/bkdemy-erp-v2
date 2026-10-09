// ============================================================================
// HocTuDau — "Học từ đầu" (Thùy 19/09, sửa lại 19/09 sau khi xem bản đầu):
// Điều hướng ĐÚNG 3 bước — HS KHÔNG được chọn thẳng dạng:
//   (1) ChonChuDeHTD    — danh sách CHỦ ĐỀ (tầng trên cùng).
//   (2) ChonChuyenDeHTD — danh sách CHUYÊN ĐỀ trong chủ đề đã chọn. Bấm 1 chuyên đề
//       là vào THẲNG dạng đang học của chuyên đề đó (dạng mở đầu tiên chưa xong,
//       hết thì vào dạng cuối) — KHÔNG hiện danh sách dạng để tự chọn.
//   (3) ChiTietDangHTD  — 3 chức năng (lý thuyết/luyện/test) của dạng đang học. Có
//       nút "ⓘ" ẩn — bấm mới hiện toàn bộ dạng trong chuyên đề + khoá/mở (tò mò thì
//       xem, KHÔNG mặc định hiện — CEO 19/09).
// Thùy 22/09 ("card xấu, làm giống bài tập trên lớp"): card đổi HẲN sang khuôn
// DanhSachHS.tsx (icon box tint + tên/mô tả + chevron, nền cardTint) — bỏ khuôn
// "header màu đặc" cũ. Thêm BACKDROP (trời/nhân vật/quote — cùng kit Home/Bài tập)
// cho MỌI màn ở đây — CEO: "chỉ màn làm bài mới không cần, còn lại đều cần". Bỏ luôn
// cờ `desktop` (không còn khác biệt nội dung theo cấp, chỉ còn bề rộng — đã có
// md:/lg: lo, xem bài học rút ra từ đợt fix layout PC 22/09).
// Thùy 29/09: BACKDROP/quote/màu theo giới tính bỏ hẳn — mọi màn theo skin em chọn (skin/KhungHS).
// ============================================================================
import { useEffect, useState } from 'react'
import { htdLoTrinh, htdLyThuyet, type DangHTD } from '../../lib/hoctudau'
import { MathText } from '../kho/ui'
import { ManHS, MAU, THE, THE_TRON, HEAD, NhanHS, useMonHS } from './skin/KhungHS'

// Thùy 29/09: mọi màn theo STYLE (skin) em đang chọn — bỏ nền mây + chồng sách + khẩu hiệu + màu theo giới tính.
// THEME giữ đúng hình dạng cũ (type `Theme` còn được CaBoTroHS dùng cho CardBai) nhưng mọi giá trị là biến skin.
const NAVY = MAU.ink
const T_SKIN = {
  bg: '', decor: '', primary: MAU.acc, sec: MAU.muted,
  iconTint: MAU.surface2, cardTint: MAU.surface, shadow: 'var(--sk-card-shadow)',
  quote: '', quoteColor: MAU.acc,
}
const THEME = { nam: T_SKIN, nu: T_SKIN }
type Theme = typeof THEME.nam
// Nền xanh nhạt ngữ nghĩa "đã xong" — trong suốt để đứng được trên skin tối.
const XONG_BG = 'rgba(34,160,107,0.16)'

function Chevron({ color }: { color: string }) {
  return <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" fill="none" aria-hidden><path d="M19 10l14 14-14 14" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

// Khung dùng chung 5 màn — khung trang của skin (ManHS). gioiTinh giữ trong chữ ký nhưng KHÔNG đổi màu nữa.
function Khung({ children }: { gioiTinh?: 'nam' | 'nu' | null; children: React.ReactNode }) {
  return <ManHS className="!gap-0">{children}</ManHS>
}
// Nút quay lại + nhãn MÔN đang chọn (01/10 — Học từ đầu là việc của 1 môn).
function NutBack({ onBack }: { onBack: () => void }) {
  const mon = useMonHS()
  return (
    <div className="mb-3 flex items-center gap-2">
      <button onClick={onBack} className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[14.5px] font-semibold active:scale-95" style={THE_TRON}>
        <span aria-hidden>‹</span> Quay lại
      </button>
      <span className="flex-1" />
      {mon && <NhanHS dac>{mon}</NhanHS>}
    </div>
  )
}
// Card khuôn "Bài tập trên lớp" (DanhSachHS.tsx) — icon box tint + tên/mô tả + chevron (Thùy 22/09:
// "card cũ xấu, làm giống card bài tập trên lớp"). `tag` = badge nhỏ góc trên phải (vd "✓ xong").
// Khung/nền/viền lấy từ skin (THE) — `t` chỉ còn cấp màu phụ/ô icon (đều là biến skin).
function CardBai({ t, icon, ten, sub, tag, onClick, disabled }: { t: Theme; icon: string; ten: string; sub: string; tag?: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="relative p-4 text-left transition active:scale-[0.98] disabled:opacity-55" style={THE}>
      <div className="flex items-start gap-3">
        <span className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] text-[28.5px]" style={{ background: t.iconTint }}>{icon}</span>
        <span className={`min-w-0 flex-1 pt-1 ${tag ? 'pr-14' : ''}`}>
          <span className="block truncate text-[16.5px] font-extrabold leading-tight" style={{ ...HEAD, color: NAVY }}>{ten}</span>
          <span className="mt-1 block text-[13px] leading-snug" style={{ color: t.sec }}>{sub}</span>
        </span>
        <span className="pt-1"><Chevron color={t.sec} /></span>
      </div>
      {tag && <span className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: XONG_BG, color: MAU.dung }}>{tag}</span>}
    </button>
  )
}

// ── Gom phẳng → cây chủ đề → chuyên đề (thuần trình bày, không tính nghiệp vụ) ──
type ChuyenDeNhom = { ma_chuyen_de: string; ten_chuyen_de: string; dangs: DangHTD[] }
type ChuDeNhom = { ma_chu_de: string; ten_chu_de: string; chuyenDes: ChuyenDeNhom[] }
function gomCay(dangs: DangHTD[]): ChuDeNhom[] {
  const mapChuDe = new Map<string, ChuDeNhom>()
  for (const d of dangs) {
    let cd = mapChuDe.get(d.ma_chu_de)
    if (!cd) { cd = { ma_chu_de: d.ma_chu_de, ten_chu_de: d.ten_chu_de, chuyenDes: [] }; mapChuDe.set(d.ma_chu_de, cd) }
    let cde = cd.chuyenDes.find((x) => x.ma_chuyen_de === d.ma_chuyen_de)
    if (!cde) { cde = { ma_chuyen_de: d.ma_chuyen_de, ten_chuyen_de: d.ten_chuyen_de, dangs: [] }; cd.chuyenDes.push(cde) }
    cde.dangs.push(d)
  }
  return [...mapChuDe.values()]
}
// Dạng ĐANG học của 1 chuyên đề: dạng mở đầu tiên chưa xong; hết rồi thì về dạng cuối (ôn thêm).
function dangDangHoc(cde: ChuyenDeNhom): DangHTD {
  return cde.dangs.find((d) => d.mo && !d.xong) ?? cde.dangs[cde.dangs.length - 1]
}

export function ChonChuDeHTD({ mon, gioiTinh, onPick, onBack }: { mon: string; gioiTinh: 'nam' | 'nu' | null; onPick: (chuDe: ChuDeNhom) => void; onBack: () => void }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [cay, setCay] = useState<ChuDeNhom[]>([])
  const [err, setErr] = useState<string | null>(null)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    htdLoTrinh(mon).then((ds) => { setCay(gomCay(ds)); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>Học từ đầu</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: t.sec }}>Chọn 1 chủ đề để bắt đầu. Được phép bỏ qua, làm chủ đề khác trước.</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'san_sang' && cay.length === 0 && (
        <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: t.sec }}>Em chưa có lộ trình bổ trợ đuổi nào cần học.</p>
      )}
      {state === 'san_sang' && cay.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
          {cay.map((cd) => {
            const tongDang = cd.chuyenDes.reduce((s, c) => s + c.dangs.length, 0)
            const xongDang = cd.chuyenDes.reduce((s, c) => s + c.dangs.filter((d) => d.xong).length, 0)
            return (
              <CardBai key={cd.ma_chu_de} t={t} icon="📘" ten={cd.ten_chu_de}
                sub={`${cd.chuyenDes.length} chuyên đề · đã xong ${xongDang}/${tongDang} dạng`}
                onClick={() => onPick(cd)} />
            )
          })}
        </div>
      )}
    </Khung>
  )
}

export function ChonChuyenDeHTD({ chuDe, gioiTinh, onPick, onBack }: { chuDe: ChuDeNhom; gioiTinh: 'nam' | 'nu' | null; onPick: (cde: ChuyenDeNhom) => void; onBack: () => void }) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>{chuDe.ten_chu_de}</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: t.sec }}>Chọn chuyên đề — vào là học tiếp đúng chỗ em đang dừng.</p>
      <div className="mt-4 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {chuDe.chuyenDes.map((cde) => {
          const xong = cde.dangs.filter((d) => d.xong).length
          const daXongHet = xong === cde.dangs.length
          const hienTai = dangDangHoc(cde)
          return (
            <CardBai key={cde.ma_chuyen_de} t={t} icon={daXongHet ? '✅' : '📖'} ten={cde.ten_chuyen_de}
              sub={daXongHet ? `Đã xong cả ${cde.dangs.length} dạng — luyện thêm được` : `Đã xong ${xong}/${cde.dangs.length} dạng · đang học "${hienTai.ten_dang}"`}
              tag={daXongHet ? '✓ xong' : undefined}
              onClick={() => onPick(cde)} />
          )
        })}
      </div>
    </Khung>
  )
}

export function ChiTietDangHTD({ dang, dangCungChuyenDe, gioiTinh, onLyThuyet, onLuyenTap, onTest, onBack }: {
  dang: { ma_dang: string; ten_dang: string; xong: boolean }
  dangCungChuyenDe: DangHTD[] // toàn bộ dạng của chuyên đề — chỉ để hiện khi bấm "ⓘ", KHÔNG mặc định hiện
  gioiTinh: 'nam' | 'nu' | null
  onLyThuyet: () => void; onLuyenTap: () => void; onTest: () => void; onBack: () => void
}) {
  const [xemLoTrinh, setXemLoTrinh] = useState(false)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  const thuTu = dangCungChuyenDe.findIndex((d) => d.ma_dang === dang.ma_dang) + 1
  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>{dang.ten_dang}</h1>
        {dangCungChuyenDe.length > 0 && (
          <button onClick={() => setXemLoTrinh((v) => !v)} title="Xem lộ trình chuyên đề"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14.5px] font-bold" style={{ ...THE_TRON, borderRadius: '999px', color: t.sec }}>ⓘ</button>
        )}
      </div>
      {thuTu > 0 && <p className="mt-0.5 text-[13px]" style={{ color: t.sec }}>Dạng {thuTu}/{dangCungChuyenDe.length} trong chuyên đề</p>}
      {dang.xong && <p className="mt-1 text-[14px] font-semibold" style={{ color: MAU.dung }}>✅ Đã có bài test cho dạng này</p>}

      {xemLoTrinh && (
        <div className="mt-3 flex flex-col gap-1.5 p-3" style={THE}>
          {dangCungChuyenDe.map((d) => (
            <div key={d.ma_dang} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[14px]"
              style={d.ma_dang === dang.ma_dang ? { background: t.iconTint, color: t.primary, fontWeight: 600 } : { color: t.sec }}>
              <span>{d.xong ? '✅' : d.mo ? '📖' : '🔒'}</span>
              <span className="min-w-0 flex-1 truncate">{d.ten_dang}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 md:grid md:grid-cols-3">
        <CardBai t={t} icon="📖" ten="Đọc lý thuyết" sub="Đọc trước cho chắc" onClick={onLyThuyet} />
        <CardBai t={t} icon="🎯" ten="Luyện tập" sub="Không giới hạn" onClick={onLuyenTap} />
        <CardBai t={t} icon="📝" ten="Làm bài Test" sub="3-5 câu · tính KQ" onClick={onTest} />
      </div>
    </Khung>
  )
}

export function LyThuyetHTD({ mon, dang, gioiTinh, onBack }: { mon: string; dang: { ma_dang: string; ten_dang: string }; gioiTinh: 'nam' | 'nu' | null; onBack: () => void }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [noiDung, setNoiDung] = useState('')
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    htdLyThuyet(mon, dang.ma_dang).then((r) => { setNoiDung(r.noi_dung); setFileUrl(r.file_url); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon, dang.ma_dang])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>{dang.ten_dang}</h1>
      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'san_sang' && (
        <div className="mt-4 p-4" style={THE}>
          <p className="mb-2 text-[14.5px] font-bold" style={{ color: t.primary }}>📖 Lý thuyết</p>
          {noiDung
            ? <div className="whitespace-pre-line text-[15.5px] leading-relaxed" style={{ color: NAVY }}><MathText>{noiDung}</MathText></div>
            : <p className="text-[14.5px]" style={{ color: t.sec }}>Dạng này chưa có lý thuyết soạn sẵn — em xem qua bài test hoặc hỏi thầy cô nhé.</p>}
          {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 block text-[14.5px] font-semibold underline" style={{ color: t.primary }}>📎 Xem file đính kèm</a>}
        </div>
      )}
    </Khung>
  )
}

// LỘ TRÌNH BỔ TRỢ ĐUỔI (Thùy 22/09): TA điểm danh có_mặt ở ca đuổi → app HS mở thẳng màn này thay vì
// đi qua 3 bước Chủ đề/Chuyên đề/Dạng của Học từ đầu (mon đã biết sẵn từ ca đang mở). Promote danh sách
// dạng-trong-chuyên-đề — trước chỉ ẩn sau nút "ⓘ" ở ChiTietDangHTD — thành MÀN CHÍNH: ✅ xong (xanh) ·
// 📖 đang học hôm nay (highlight) · 🔒 chưa học đến (khoá). CÙNG dữ liệu htd_lo_trinh với Học từ đầu —
// em tự học thêm ở nhà thì tiến độ vẫn là 1 nguồn, không tách riêng cho "trong ca"/"ở nhà".
// 1 case đuổi có thể có dạng thuộc >1 chuyên đề (vd Tập hợp + Bất phương trình cùng lúc) → nếu vậy hiện
// PICKER chuyên đề trước (thẻ giống ChonChuyenDeHTD), 1 chuyên đề thì vào thẳng lộ trình luôn.
export function LoTrinhDuoiHS({ mon, gioiTinh, onPickDang, onBack }: {
  mon: string; gioiTinh: 'nam' | 'nu' | null; onPickDang: (d: DangHTD, cde: ChuyenDeNhom) => void; onBack: () => void
}) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [cdes, setCdes] = useState<ChuyenDeNhom[]>([])
  const [chon, setChon] = useState<ChuyenDeNhom | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    htdLoTrinh(mon).then((ds) => {
      const flat = gomCay(ds).flatMap((cd) => cd.chuyenDes)
      setCdes(flat); setChon(flat.length === 1 ? flat[0] : null); setState('san_sang')
    }).catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon])

  if (state === 'dang_tai') return <Khung gioiTinh={gioiTinh}><p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: t.sec }}>Đang tải…</p></Khung>
  if (state === 'loi') return <Khung gioiTinh={gioiTinh}><p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{err}</p></Khung>

  if (!chon) return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>Lộ trình bổ trợ đuổi</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: t.sec }}>Em đang đuổi {cdes.length} chuyên đề — chọn 1 để xem lộ trình.</p>
      <div className="mt-4 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {cdes.map((cde) => {
          const xong = cde.dangs.filter((d) => d.xong).length
          return (
            <CardBai key={cde.ma_chuyen_de} t={t} icon="📖" ten={cde.ten_chuyen_de}
              sub={`Đã xong ${xong}/${cde.dangs.length} dạng`} onClick={() => setChon(cde)} />
          )
        })}
      </div>
    </Khung>
  )

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={() => (cdes.length > 1 ? setChon(null) : onBack())} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>Lộ trình bổ trợ đuổi</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: t.sec }}>{chon.ten_chuyen_de} — học lần lượt từng dạng, dạng khoá tự mở khi dạng trước xong.</p>
      <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-2">
        {chon.dangs.map((d) => {
          const hienTai = !d.xong && d.mo
          return (
            <button key={d.ma_dang} disabled={!d.mo} onClick={() => onPickDang(d, chon)}
              className="relative flex items-center gap-3 p-4 text-left transition disabled:opacity-55"
              style={{ ...THE, ...((d.xong || hienTai) ? {} : { boxShadow: 'none' }) }}>
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] text-[26.5px]"
                style={{ background: d.xong ? XONG_BG : t.iconTint, opacity: d.xong || hienTai ? 1 : 0.7 }}>
                {d.xong ? '✅' : hienTai ? '📖' : '🔒'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16.5px] font-extrabold leading-tight"
                  style={{ ...HEAD, color: d.xong ? MAU.dung : hienTai ? t.primary : NAVY }}>{d.ten_dang}</span>
                {hienTai && <span className="mt-0.5 block text-[13px] font-semibold" style={{ color: t.primary }}>Đang học hôm nay</span>}
              </span>
              {d.mo && <Chevron color={t.sec} />}
            </button>
          )
        })}
      </div>
    </Khung>
  )
}

export type { ChuDeNhom, ChuyenDeNhom, Theme }
export { dangDangHoc, CardBai, Chevron }
