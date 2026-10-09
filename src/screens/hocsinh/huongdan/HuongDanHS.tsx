// ============================================================================
// HƯỚNG DẪN CHƠI (Thùy 03/10): "gallery giải thích chi tiết mọi chức năng của app — học sinh chưa hiểu vào đây đọc là biết vận hành thế nào".
// 2 tầng: GALLERY (lưới thẻ theo nhóm, có ô tìm) → trang ĐỌC của 1 chủ đề (màn riêng nền sáng — quy ước STYLE-HS "tầng cuối là màn đọc", cùng bộ ManDocHS với Sổ tay).
// Chữ nằm ở noiDungHuongDan.ts (bản gốc FORMAL; style game chỉ ghi đè tên + tóm tắt — skin/loi.ts `giongGame`). Component chỉ vẽ.
// `onTutorial(chuongId)` do cha cấp (mở tutorial đúng chương); không cấp ⇒ ẩn nút.
// ============================================================================
import { useMemo, useState } from 'react'
import { ChipDocHS, DauTrangHS, HEAD, KhoiDocHS, MAU, ManDocHS, ManHS, NhanHS, NhomHS, NutHS, TheDocHS, TheHS, useLoi, type KieuKhoiDoc } from '../skin/KhungHS'
import { laySkin, mauDocMon } from '../skin/registry'
import { useSkinDangAp } from '../skin/loi'
import { IconO } from '../HomeHS912'
import { CHU_DE, MO_DAU_HD, NHOM, type ChuDeHD, type KhoiHD, type LoaiKhoi } from './noiDungHuongDan'

const KIEU: Record<LoaiKhoi | 'thuong_khong', KieuKhoiDoc> = { luat: 'cong_thuc', thuong: 'vi_du', meo: 'vi_du', luuy: 'luu_y', thuong_khong: 'thuong' }
const NHAN: Record<LoaiKhoi, string> = { luat: 'Luật', thuong: 'Phần thưởng', meo: 'Mẹo', luuy: 'Lưu ý' }
const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

function Icon({ cd, className }: { cd: ChuDeHD; className: string }) {
  const skin = laySkin(useSkinDangAp())
  const anh = cd.icon.o ? skin.anhO?.[cd.icon.o] : undefined
  return anh
    ? <IconO src={anh} mask={!!skin.anhOMask} className={className} />
    : <span className={`flex items-center justify-center text-[33px] ${className}`} aria-hidden>{cd.icon.emoji}</span>
}

export default function HuongDanHS({ onBack, onTutorial, moSan }: { onBack: () => void; onTutorial?: (chuong: string | null) => void; /** mở thẳng 1 chủ đề (id) */ moSan?: string }) {
  const loi = useLoi()
  const [chon, setChon] = useState<string | null>(moSan ?? null)
  const [tim, setTim] = useState('')
  const ten = (c: ChuDeHD) => (loi.giongGame && c.game?.ten) || c.ten
  const tom = (c: ChuDeHD) => (loi.giongGame && c.game?.tomTat) || c.tomTat

  const ds = useMemo(() => {
    const q = boDau(tim.trim())
    if (!q) return CHU_DE
    return CHU_DE.filter((c) => boDau([c.ten, c.game?.ten ?? '', c.tomTat, ...c.khoi.flatMap((k) => [k.tieu, ...k.y])].join(' ')).includes(q))
  }, [tim])

  const cd = chon ? CHU_DE.find((c) => c.id === chon) : undefined
  if (cd) return <TrangDoc cd={cd} ten={ten(cd)} tom={tom(cd)} onBack={() => setChon(null)} onDoi={setChon} onTutorial={onTutorial} />

  const mo = loi.giongGame ? MO_DAU_HD.game : { tieu: MO_DAU_HD.tieu, phu: MO_DAU_HD.phu }
  return (
    <ManHS>
      <DauTrangHS tieuDe={mo.tieu} phu={mo.phu} onBack={onBack} />
      <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm trong hướng dẫn (ví dụ: chuỗi, rank, xu…)" aria-label="Tìm trong hướng dẫn"
        className="w-full px-4 py-2.5 text-[15.5px] outline-none" style={{ background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: '1.5px solid var(--sk-line)', borderRadius: 'var(--sk-radius)' }} />
      {ds.length === 0 && <TheHS className="px-4 py-6 text-center text-[15.5px]"><span style={{ color: MAU.muted }}>Không có mục nào khớp “{tim}”.</span></TheHS>}
      {NHOM.map((n) => {
        const muc = ds.filter((c) => c.nhom === n.id)
        if (!muc.length) return null
        return (
          <section key={n.id} className="flex flex-col gap-2.5">
            <div><NhomHS>{n.ten}</NhomHS><p className="text-[14px]" style={{ color: MAU.muted }}>{n.phu}</p></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {muc.map((c) => (
                <TheHS key={c.id} onClick={() => setChon(c.id)} className="flex min-h-[132px] flex-col gap-2 p-4">
                  <span className="flex items-center gap-3">
                    <Icon cd={c} className="h-12 w-12 shrink-0" />
                    <span className="min-w-0 flex-1 text-[18px] font-bold leading-tight" style={HEAD}>{ten(c)}</span>
                    <span className="shrink-0 text-[24px] leading-none" style={{ color: MAU.muted }} aria-hidden>›</span>
                  </span>
                  <span className="text-[14.5px] leading-snug" style={{ color: MAU.muted }}>{tom(c)}</span>
                  {c.sap && <span className="mt-auto"><NhanHS mau="var(--sk-muted)">Sắp có</NhanHS></span>}
                </TheHS>
              ))}
            </div>
          </section>
        )
      })}
      {onTutorial && <NutHS phu onClick={() => onTutorial(null)}>Xem hành trình tân thủ (hướng dẫn tương tác từng chặng)</NutHS>}
      <p className="pb-4 text-center text-[13px]" style={{ color: MAU.muted }}>{MO_DAU_HD.cuoi}</p>
    </ManHS>
  )
}

function Khoi({ k }: { k: KhoiHD }) {
  return (
    <KhoiDocHS nhan={k.loai ? `${NHAN[k.loai]} · ${k.tieu}` : k.tieu} kieu={KIEU[k.loai ?? 'thuong_khong']}>
      {k.doan
        ? k.y.map((t, i) => <p key={i} className="text-[16px] leading-[1.7]">{t}</p>)
        : <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[16px] leading-[1.65]">{k.y.map((t, i) => <li key={i}>{t}</li>)}</ul>}
    </KhoiDocHS>
  )
}

function TrangDoc({ cd, ten, tom, onBack, onDoi, onTutorial }: { cd: ChuDeHD; ten: string; tom: string; onBack: () => void; onDoi: (id: string) => void; onTutorial?: (chuong: string | null) => void }) {
  const i = CHU_DE.findIndex((c) => c.id === cd.id), truoc = CHU_DE[i - 1], sau = CHU_DE[i + 1]
  const nhom = NHOM.find((n) => n.id === cd.nhom)
  const nut = 'flex-1 rounded-[14px] px-3 py-2.5 text-left text-[14.5px] font-bold active:scale-[0.98]'
  const kieuNut = { background: 'var(--sk-doc-giay)', color: 'var(--sk-doc-ink)', boxShadow: '0 0 0 1px var(--sk-doc-line)' }
  return (
    <ManDocHS onBack={onBack} mau={mauDocMon(null)} duong={`Hướng dẫn chơi · ${nhom?.ten ?? ''}`}>
      <TheDocHS tieuDe={ten} tomTat={tom} chip={<><ChipDocHS dac>{nhom?.ten}</ChipDocHS>{cd.sap && <ChipDocHS>Sắp có</ChipDocHS>}</>}>
        {cd.khoi.map((k) => <Khoi key={k.tieu} k={k} />)}
        {cd.bang && (
          <KhoiDocHS nhan={cd.bang.tieu} kieu="vi_du">
            <table className="w-full text-[15.5px]">
              <thead><tr>{cd.bang.cot.map((c) => <th key={c} className="px-2 py-1 text-left text-[13px] font-extrabold uppercase" style={{ color: 'var(--sk-doc-muted)' }}>{c}</th>)}</tr></thead>
              <tbody>{cd.bang.dong.map((r, a) => <tr key={a} style={{ borderTop: '1px solid var(--sk-doc-line)' }}>{r.map((c, b) => <td key={b} className="px-2 py-1.5">{c}</td>)}</tr>)}</tbody>
            </table>
          </KhoiDocHS>
        )}
        {cd.tutorial && onTutorial && (
          <button onClick={() => onTutorial(cd.tutorial!)} className="rounded-[14px] px-4 py-3 text-[15.5px] font-extrabold active:scale-[0.98]" style={{ background: 'var(--doc-acc)', color: 'var(--sk-doc-giay)' }}>
            Xem hướng dẫn tương tác ›
          </button>
        )}
      </TheDocHS>
      <div className="flex gap-2">
        {truoc ? <button onClick={() => onDoi(truoc.id)} className={nut} style={kieuNut}><span className="block text-[12px] font-semibold" style={{ color: 'var(--sk-doc-muted)' }}>‹ Mục trước</span>{truoc.ten}</button> : <span className="flex-1" />}
        {sau ? <button onClick={() => onDoi(sau.id)} className={`${nut} text-right`} style={kieuNut}><span className="block text-[12px] font-semibold" style={{ color: 'var(--sk-doc-muted)' }}>Mục sau ›</span>{sau.ten}</button> : <span className="flex-1" />}
      </div>
    </ManDocHS>
  )
}
