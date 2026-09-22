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
// Card đổi sang "header có màu" (dải màu đặc trên đầu card + icon) thay vì nền trắng
// phẳng — tái dùng ĐÚNG bảng TONE của HomeHS.tsx (không bịa palette riêng).
// ============================================================================
import { useEffect, useState } from 'react'
import { htdLoTrinh, htdLyThuyet, type DangHTD } from '../../lib/hoctudau'
import { MathText } from '../kho/ui'
import { TONE, type HomeTone } from './HomeHS'

const TONE_CYCLE: HomeTone[] = ['purple', 'blue', 'pink', 'green', 'orange', 'gray']

function Khung({ desktop, children }: { desktop?: boolean; children: React.ReactNode }) {
  return (
    <div className={desktop ? 'mx-auto min-h-screen max-w-2xl bg-[#f4f7fb] px-8 py-6 md:max-w-3xl lg:max-w-4xl' : 'mx-auto flex min-h-screen max-w-md flex-col bg-ios px-4 pb-8 pt-[calc(14px+env(safe-area-inset-top))] md:max-w-3xl lg:max-w-4xl'}>
      {children}
    </div>
  )
}
function NutBack({ onBack, desktop }: { onBack: () => void; desktop?: boolean }) {
  return (
    <button onClick={onBack} className={`mb-3 flex items-center gap-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>
      <span aria-hidden>←</span> Quay lại
    </button>
  )
}
// Card header-màu dùng chung 3 màn — icon/emoji trên dải màu đặc (tone.c), thân trắng bên dưới.
// `square`: ép khung gần vuông (CEO 19/09 — cấm kiểu "dẹt" khi có nội dung, xem CLAUDE.md §6).
function CardMau({ tone, icon, ten, children, onClick, disabled, square }: {
  tone: HomeTone; icon: string; ten: string; children?: React.ReactNode; onClick?: () => void; disabled?: boolean; square?: boolean
}) {
  const t = TONE[tone]
  return (
    <button onClick={onClick} disabled={disabled}
      className={`overflow-hidden rounded-[22px] text-left shadow-sm transition ${square ? 'flex aspect-[0.95] flex-col' : ''} ${disabled ? 'opacity-50' : 'active:scale-[0.98]'}`}>
      <div className={`flex items-center ${square ? 'gap-1.5 px-2.5 py-2 shrink-0' : 'gap-2.5 px-4 py-3'}`} style={{ background: `linear-gradient(120deg, ${t.c}, ${t.c}cc)` }}>
        <span className={square ? 'shrink-0 text-[15px]' : 'text-[20px]'}>{icon}</span>
        <span className={`min-w-0 flex-1 font-bold text-white ${square ? 'line-clamp-2 text-[11.5px] leading-tight' : 'truncate text-[14.5px]'}`}>{ten}</span>
      </div>
      {children && <div className={`bg-white px-4 py-3 ${square ? 'flex-1 overflow-hidden' : ''}`}>{children}</div>}
    </button>
  )
}
// (CardBox riêng cho lưới 3 chức năng đã BỎ — 19/09 CEO chê header quá to so với card khác.
//  Giờ dùng CHUNG CardMau(square) như card chủ đề/chuyên đề — header nhỏ gọn nhất quán toàn màn.)

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

export function ChonChuDeHTD({ mon, onPick, onBack, desktop }: { mon: string; onPick: (chuDe: ChuDeNhom) => void; onBack: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [cay, setCay] = useState<ChuDeNhom[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    htdLoTrinh(mon).then((ds) => { setCay(gomCay(ds)); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon])

  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Học từ đầu</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>Chọn 1 chủ đề để bắt đầu. Được phép bỏ qua, làm chủ đề khác trước.</p>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && cay.length === 0 && (
        <p className="mt-8 text-center text-[13px] text-ph-label-2">Em chưa có lộ trình bổ trợ đuổi nào cần học.</p>
      )}
      {state === 'san_sang' && cay.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {cay.map((cd, i) => {
            const tongDang = cd.chuyenDes.reduce((s, c) => s + c.dangs.length, 0)
            const xongDang = cd.chuyenDes.reduce((s, c) => s + c.dangs.filter((d) => d.xong).length, 0)
            return (
              <CardMau key={cd.ma_chu_de} square tone={TONE_CYCLE[i % TONE_CYCLE.length]} icon="📘" ten={cd.ten_chu_de} onClick={() => onPick(cd)}>
                <span className="line-clamp-4 block text-[12.5px] text-ph-label-2">{cd.chuyenDes.length} chuyên đề · đã xong {xongDang}/{tongDang} dạng</span>
              </CardMau>
            )
          })}
        </div>
      )}
    </Khung>
  )
}

export function ChonChuyenDeHTD({ chuDe, onPick, onBack, desktop }: { chuDe: ChuDeNhom; onPick: (cde: ChuyenDeNhom) => void; onBack: () => void; desktop?: boolean }) {
  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>{chuDe.ten_chu_de}</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>Chọn chuyên đề — vào là học tiếp đúng chỗ em đang dừng.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {chuDe.chuyenDes.map((cde, i) => {
          const xong = cde.dangs.filter((d) => d.xong).length
          const daXongHet = xong === cde.dangs.length
          const hienTai = dangDangHoc(cde)
          return (
            <CardMau key={cde.ma_chuyen_de} square tone={TONE_CYCLE[i % TONE_CYCLE.length]} icon={daXongHet ? '✅' : '📖'} ten={cde.ten_chuyen_de} onClick={() => onPick(cde)}>
              <span className="line-clamp-4 block text-[12.5px] text-ph-label-2">
                {daXongHet ? `Đã xong cả ${cde.dangs.length} dạng — luyện thêm được` : `Đã xong ${xong}/${cde.dangs.length} dạng · đang học "${hienTai.ten_dang}"`}
              </span>
            </CardMau>
          )
        })}
      </div>
    </Khung>
  )
}

export function ChiTietDangHTD({ dang, dangCungChuyenDe, onLyThuyet, onLuyenTap, onTest, onBack, desktop }: {
  dang: { ma_dang: string; ten_dang: string; xong: boolean }
  dangCungChuyenDe: DangHTD[] // toàn bộ dạng của chuyên đề — chỉ để hiện khi bấm "ⓘ", KHÔNG mặc định hiện
  onLyThuyet: () => void; onLuyenTap: () => void; onTest: () => void; onBack: () => void; desktop?: boolean
}) {
  const [xemLoTrinh, setXemLoTrinh] = useState(false)
  const thuTu = dangCungChuyenDe.findIndex((d) => d.ma_dang === dang.ma_dang) + 1
  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <div className="flex items-start justify-between gap-2">
        <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[20px]' : 'text-[17px]'}`}>{dang.ten_dang}</h1>
        {dangCungChuyenDe.length > 0 && (
          <button onClick={() => setXemLoTrinh((v) => !v)} title="Xem lộ trình chuyên đề"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ph-label-2/10 text-[13px] font-bold text-ph-label-2">ⓘ</button>
        )}
      </div>
      {thuTu > 0 && <p className="mt-0.5 text-[12px] text-ph-label-2">Dạng {thuTu}/{dangCungChuyenDe.length} trong chuyên đề</p>}
      {dang.xong && <p className="mt-1 text-[12.5px] font-semibold text-emerald-600">✅ Đã có bài test cho dạng này</p>}

      {xemLoTrinh && (
        <div className="mt-3 flex flex-col gap-1.5 rounded-2xl bg-white p-3 shadow-sm">
          {dangCungChuyenDe.map((d) => (
            <div key={d.ma_dang} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] ${d.ma_dang === dang.ma_dang ? 'bg-brand/10 font-semibold text-brand' : 'text-ph-label-2'}`}>
              <span>{d.xong ? '✅' : d.mo ? '📖' : '🔒'}</span>
              <span className="min-w-0 flex-1 truncate">{d.ten_dang}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        <CardMau square tone="green" icon="📖" ten="Đọc lý thuyết" onClick={onLyThuyet}>
          <span className="block text-[11px] leading-tight text-ph-label-2">Đọc trước cho chắc</span>
        </CardMau>
        <CardMau square tone="orange" icon="🎯" ten="Luyện tập" onClick={onLuyenTap}>
          <span className="block text-[11px] leading-tight text-ph-label-2">Không giới hạn</span>
        </CardMau>
        <CardMau square tone="purple" icon="📝" ten="Làm bài Test" onClick={onTest}>
          <span className="block text-[11px] leading-tight text-ph-label-2">3-5 câu · tính KQ</span>
        </CardMau>
      </div>
    </Khung>
  )
}

export function LyThuyetHTD({ mon, dang, onBack, desktop }: { mon: string; dang: { ma_dang: string; ten_dang: string }; onBack: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [noiDung, setNoiDung] = useState('')
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    htdLyThuyet(mon, dang.ma_dang).then((r) => { setNoiDung(r.noi_dung); setFileUrl(r.file_url); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon, dang.ma_dang])

  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[20px]' : 'text-[17px]'}`}>{dang.ten_dang}</h1>
      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && (
        <div className="mt-4 overflow-hidden rounded-2xl shadow-sm">
          <div className="px-4 py-2.5" style={{ background: `linear-gradient(120deg, ${TONE.green.c}, ${TONE.green.c}cc)` }}>
            <span className="text-[13px] font-bold text-white">📖 Lý thuyết</span>
          </div>
          <div className="bg-white p-4">
            {noiDung
              ? <div className="whitespace-pre-line text-[14px] leading-relaxed text-ph-label"><MathText>{noiDung}</MathText></div>
              : <p className="text-[13px] text-ph-label-2">Dạng này chưa có lý thuyết soạn sẵn — em xem qua bài test hoặc hỏi thầy cô nhé.</p>}
            {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 block text-[13px] font-semibold text-brand underline">📎 Xem file đính kèm</a>}
          </div>
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
export function LoTrinhDuoiHS({ mon, onPickDang, onBack, desktop }: {
  mon: string; onPickDang: (d: DangHTD, cde: ChuyenDeNhom) => void; onBack: () => void; desktop?: boolean
}) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [cdes, setCdes] = useState<ChuyenDeNhom[]>([])
  const [chon, setChon] = useState<ChuyenDeNhom | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    htdLoTrinh(mon).then((ds) => {
      const flat = gomCay(ds).flatMap((cd) => cd.chuyenDes)
      setCdes(flat); setChon(flat.length === 1 ? flat[0] : null); setState('san_sang')
    }).catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon])

  if (state === 'dang_tai') return <Khung desktop={desktop}><p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p></Khung>
  if (state === 'loi') return <Khung desktop={desktop}><p className="mt-8 text-center text-[13px] text-ph-red">{err}</p></Khung>

  if (!chon) return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Lộ trình bổ trợ đuổi</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>Em đang đuổi {cdes.length} chuyên đề — chọn 1 để xem lộ trình.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {cdes.map((cde, i) => {
          const xong = cde.dangs.filter((d) => d.xong).length
          return (
            <CardMau key={cde.ma_chuyen_de} square tone={TONE_CYCLE[i % TONE_CYCLE.length]} icon="📖" ten={cde.ten_chuyen_de} onClick={() => setChon(cde)}>
              <span className="line-clamp-4 block text-[12.5px] text-ph-label-2">Đã xong {xong}/{cde.dangs.length} dạng</span>
            </CardMau>
          )
        })}
      </div>
    </Khung>
  )

  return (
    <Khung desktop={desktop}>
      <NutBack onBack={() => (cdes.length > 1 ? setChon(null) : onBack())} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Lộ trình bổ trợ đuổi</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>{chon.ten_chuyen_de} — học lần lượt từng dạng, dạng khoá tự mở khi dạng trước xong.</p>
      <div className="mt-4 flex flex-col gap-1.5">
        {chon.dangs.map((d) => {
          const hienTai = !d.xong && d.mo
          return (
            <button key={d.ma_dang} disabled={!d.mo} onClick={() => onPickDang(d, chon)}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition ${d.xong ? 'bg-emerald-50' : hienTai ? 'bg-brand/10 ring-2 ring-brand' : 'bg-white opacity-50'}`}>
              <span className="text-[20px]">{d.xong ? '✅' : hienTai ? '📖' : '🔒'}</span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[14px] font-semibold ${d.xong ? 'text-emerald-700' : hienTai ? 'text-brand' : 'text-ph-label'}`}>{d.ten_dang}</span>
                {hienTai && <span className="mt-0.5 block text-[11.5px] font-medium text-brand">Đang học hôm nay</span>}
              </span>
            </button>
          )
        })}
      </div>
    </Khung>
  )
}

export type { ChuDeNhom, ChuyenDeNhom }
export { dangDangHoc }
