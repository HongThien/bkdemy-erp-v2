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
// ============================================================================
import { useEffect, useState } from 'react'
import { htdLoTrinh, htdLyThuyet, type DangHTD } from '../../lib/hoctudau'
import { MathText } from '../kho/ui'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
// THEME nam/nữ — cùng bộ ảnh/màu với DanhSachHS.tsx (kit dùng chung, không bịa palette riêng).
const THEME = {
  nam: {
    bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    iconTint: '#E8ECFF', cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Cố gắng hôm nay\nđể tốt hơn ngày mai!', quoteColor: '#4A5BC4',
  },
  nu: {
    bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    iconTint: '#F3E4F6', cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Cố lên\nbạn nhé!', quoteColor: '#E84A8F',
  },
}
type Theme = typeof THEME.nam

function Chevron({ color }: { color: string }) {
  return <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" fill="none" aria-hidden><path d="M19 10l14 14-14 14" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

// Khung dùng chung 5 màn — backdrop trời cố định (không cuộn) + nội dung cuộn đè lên, y hệt DanhSachHS.
function Khung({ gioiTinh, children }: { gioiTinh: 'nam' | 'nu' | null; children: React.ReactNode }) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] md:max-w-[820px] lg:max-w-[1180px]" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover md:max-w-[820px] lg:max-w-[1180px]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end md:max-w-[820px] lg:max-w-[1180px]">
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>
      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        {children}
      </div>
    </div>
  )
}
function NutBack({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="mb-3 flex items-center gap-1 text-[13px] font-medium" style={{ color: NAVY, opacity: .55 }}>
      <span aria-hidden>←</span> Quay lại
    </button>
  )
}
// Card khuôn "Bài tập trên lớp" (DanhSachHS.tsx) — icon box tint + tên/mô tả + chevron (Thùy 22/09:
// "card cũ xấu, làm giống card bài tập trên lớp"). `tag` = badge nhỏ góc trên phải (vd "✓ xong").
function CardBai({ t, icon, ten, sub, tag, onClick, disabled }: { t: Theme; icon: string; ten: string; sub: string; tag?: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="relative rounded-[26px] p-4 text-left transition active:scale-[0.98] disabled:opacity-55" style={{ background: t.cardTint, boxShadow: t.shadow }}>
      <div className="flex items-start gap-3">
        <span className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] text-[26px]" style={{ background: t.iconTint }}>{icon}</span>
        <span className={`min-w-0 flex-1 pt-1 ${tag ? 'pr-14' : ''}`}>
          <span className="block truncate text-[15px] font-extrabold leading-tight" style={{ color: NAVY }}>{ten}</span>
          <span className="mt-1 block text-[12px] leading-snug" style={{ color: t.sec }}>{sub}</span>
        </span>
        <span className="pt-1"><Chevron color={t.sec} /></span>
      </div>
      {tag && <span className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: '#DDF7EA', color: '#1E9E6A' }}>{tag}</span>}
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
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Học từ đầu</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>Chọn 1 chủ đề để bắt đầu. Được phép bỏ qua, làm chủ đề khác trước.</p>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && cay.length === 0 && (
        <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Em chưa có lộ trình bổ trợ đuổi nào cần học.</p>
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
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>{chuDe.ten_chu_de}</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>Chọn chuyên đề — vào là học tiếp đúng chỗ em đang dừng.</p>
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
        <h1 className="text-[20px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>{dang.ten_dang}</h1>
        {dangCungChuyenDe.length > 0 && (
          <button onClick={() => setXemLoTrinh((v) => !v)} title="Xem lộ trình chuyên đề"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold" style={{ color: t.sec, boxShadow: t.shadow }}>ⓘ</button>
        )}
      </div>
      {thuTu > 0 && <p className="mt-0.5 text-[12px]" style={{ color: t.sec }}>Dạng {thuTu}/{dangCungChuyenDe.length} trong chuyên đề</p>}
      {dang.xong && <p className="mt-1 text-[12.5px] font-semibold text-emerald-600">✅ Đã có bài test cho dạng này</p>}

      {xemLoTrinh && (
        <div className="mt-3 flex flex-col gap-1.5 rounded-2xl bg-white p-3" style={{ boxShadow: t.shadow }}>
          {dangCungChuyenDe.map((d) => (
            <div key={d.ma_dang} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px]"
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
      <h1 className="text-[20px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>{dang.ten_dang}</h1>
      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && (
        <div className="mt-4 rounded-[26px] p-4" style={{ background: t.cardTint, boxShadow: t.shadow }}>
          <p className="mb-2 text-[13px] font-bold" style={{ color: t.primary }}>📖 Lý thuyết</p>
          {noiDung
            ? <div className="whitespace-pre-line text-[14px] leading-relaxed" style={{ color: NAVY }}><MathText>{noiDung}</MathText></div>
            : <p className="text-[13px]" style={{ color: t.sec }}>Dạng này chưa có lý thuyết soạn sẵn — em xem qua bài test hoặc hỏi thầy cô nhé.</p>}
          {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 block text-[13px] font-semibold underline" style={{ color: t.primary }}>📎 Xem file đính kèm</a>}
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

  if (state === 'dang_tai') return <Khung gioiTinh={gioiTinh}><p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p></Khung>
  if (state === 'loi') return <Khung gioiTinh={gioiTinh}><p className="mt-8 text-center text-[13px] text-ph-red">{err}</p></Khung>

  if (!chon) return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Lộ trình bổ trợ đuổi</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>Em đang đuổi {cdes.length} chuyên đề — chọn 1 để xem lộ trình.</p>
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
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Lộ trình bổ trợ đuổi</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>{chon.ten_chuyen_de} — học lần lượt từng dạng, dạng khoá tự mở khi dạng trước xong.</p>
      <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-2">
        {chon.dangs.map((d) => {
          const hienTai = !d.xong && d.mo
          return (
            <button key={d.ma_dang} disabled={!d.mo} onClick={() => onPickDang(d, chon)}
              className="relative flex items-center gap-3 rounded-[26px] p-4 text-left transition disabled:opacity-55"
              style={{ background: t.cardTint, boxShadow: (d.xong || hienTai) ? t.shadow : 'none' }}>
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] text-[24px]"
                style={{ background: d.xong ? '#DDF7EA' : hienTai ? t.iconTint : '#EEF1F6' }}>
                {d.xong ? '✅' : hienTai ? '📖' : '🔒'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold leading-tight"
                  style={{ color: d.xong ? '#1E9E6A' : hienTai ? t.primary : NAVY }}>{d.ten_dang}</span>
                {hienTai && <span className="mt-0.5 block text-[12px] font-semibold" style={{ color: t.primary }}>Đang học hôm nay</span>}
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
