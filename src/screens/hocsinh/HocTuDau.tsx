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
    <div className={desktop ? 'mx-auto min-h-screen max-w-2xl bg-[#f4f7fb] px-8 py-6 md:max-w-3xl' : 'mx-auto flex min-h-screen max-w-md flex-col bg-ios px-4 pb-8 pt-[calc(14px+env(safe-area-inset-top))] md:max-w-3xl'}>
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
function CardMau({ tone, icon, ten, children, onClick, disabled }: {
  tone: HomeTone; icon: string; ten: string; children?: React.ReactNode; onClick?: () => void; disabled?: boolean
}) {
  const t = TONE[tone]
  return (
    <button onClick={onClick} disabled={disabled}
      className={`overflow-hidden rounded-[22px] text-left shadow-sm transition ${disabled ? 'opacity-50' : 'active:scale-[0.98]'}`}>
      <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: `linear-gradient(120deg, ${t.c}, ${t.c}cc)` }}>
        <span className="text-[20px]">{icon}</span>
        <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold text-white">{ten}</span>
      </div>
      {children && <div className="bg-white px-4 py-3">{children}</div>}
    </button>
  )
}
// Card dạng BOX (gần vuông, màu kín cả khối) — dùng cho lưới lựa chọn 1 hàng (3 chức năng của dạng).
// KHÁC CardMau (dải màu chỉ ở header, thân trắng) — box này tránh kiểu "thanh dài" bị chê xấu.
function CardBox({ tone, icon, ten, sub, onClick, disabled }: {
  tone: HomeTone; icon: string; ten: string; sub?: string; onClick?: () => void; disabled?: boolean
}) {
  const t = TONE[tone]
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex aspect-[0.92] flex-col items-center justify-center gap-1.5 rounded-[20px] px-2 py-3 text-center shadow-sm transition ${disabled ? 'opacity-50' : 'active:scale-[0.96]'}`}
      style={{ background: `linear-gradient(150deg, ${t.c}, ${t.c}cc)` }}>
      <span className="text-[26px] leading-none">{icon}</span>
      <span className="text-[13px] font-bold leading-tight text-white">{ten}</span>
      {sub && <span className="text-[10.5px] leading-tight text-white/85">{sub}</span>}
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
        <div className={`mt-4 grid gap-3 ${desktop ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          {cay.map((cd, i) => {
            const tongDang = cd.chuyenDes.reduce((s, c) => s + c.dangs.length, 0)
            const xongDang = cd.chuyenDes.reduce((s, c) => s + c.dangs.filter((d) => d.xong).length, 0)
            return (
              <CardMau key={cd.ma_chu_de} tone={TONE_CYCLE[i % TONE_CYCLE.length]} icon="📘" ten={cd.ten_chu_de} onClick={() => onPick(cd)}>
                <span className="block text-[12.5px] text-ph-label-2">{cd.chuyenDes.length} chuyên đề · đã xong {xongDang}/{tongDang} dạng</span>
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
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {chuDe.chuyenDes.map((cde, i) => {
          const xong = cde.dangs.filter((d) => d.xong).length
          const daXongHet = xong === cde.dangs.length
          const hienTai = dangDangHoc(cde)
          return (
            <CardMau key={cde.ma_chuyen_de} tone={TONE_CYCLE[i % TONE_CYCLE.length]} icon={daXongHet ? '✅' : '📖'} ten={cde.ten_chuyen_de} onClick={() => onPick(cde)}>
              <span className="block text-[12.5px] text-ph-label-2">
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
        <CardBox tone="green" icon="📖" ten="Đọc lý thuyết" sub="Đọc trước cho chắc" onClick={onLyThuyet} />
        <CardBox tone="orange" icon="🎯" ten="Luyện tập" sub="Không giới hạn" onClick={onLuyenTap} />
        <CardBox tone="purple" icon="📝" ten="Làm bài Test" sub="10 câu · tính KQ" onClick={onTest} />
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

export type { ChuDeNhom, ChuyenDeNhom }
export { dangDangHoc }
