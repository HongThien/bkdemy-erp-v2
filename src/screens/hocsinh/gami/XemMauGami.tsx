// ============================================================================
// XemMauGami — TRANG XEM MẪU gamification app HS: hs.html?xem=gami[&man=…&tt=…][&an]
// Mọi màn × mọi trạng thái trong design/DON-HANG-GAMI-HS.md, vẽ bằng ĐÚNG component màn thật (NhiemVuView / AlbumView / RankView /
// HoSoView) + dữ liệu giả (mauGami.ts). Không gọi DB, không cần đăng nhập ⇒ chụp ảnh gửi ChatGPT, và soát kit sau khi đổi vỏ.
// &an = ẩn thanh chọn (ảnh chụp sạch). man: nhiem_vu · album · rank · ho_so · the_tv · bo_hinh. tt: số trạng thái (1…).
// ============================================================================
import { useState, type ReactNode } from 'react'
import { Khung, NutBack } from '../TuLuyenChuDe'
import { MAU, THE, THE_TRON, HEAD, ManHS, DauTrangHS } from '../skin/KhungHS'
import { NhiemVuView } from '../NhiemVuHS'
import { AlbumView, tieuDeAlbum } from '../AlbumHS'
import { RankView } from '../RankHS'
import { HoSoView, ChonKhoe, TheTVHS } from '../HoSoHS'
import { HinhHuyHieu, BieuTuongBac, SaoBac, AvatarKhung, IconNV } from './HinhGami'
import { KIT, BAC, MAU_HH, ICON_NV } from './hinh'
import * as M from './mauGami'
import { TheGioiView, TamBinhLuan, TamCamXuc, TamKetBan, type BanPhim } from '../thegioi/TheGioiHS'
import * as TG from '../thegioi/mauTheGioi'

const noop = () => {}
const MAN: { id: string; ten: string; tt: string[] }[] = [
  { id: 'nhiem_vu', ten: 'Nhiệm vụ', tt: ['Giữa tháng', 'Đầu tháng', 'Chưa mở'] },
  { id: 'album', ten: 'Album', tt: ['Giữa năm (1 thẻ mở)', 'Mới vào (0 sao)', 'Lớp phủ sao mới'] },
  { id: 'rank', ten: 'Rank', tt: ['Captain giữa mùa', 'Novice đầu mùa', 'God of War', 'Lớp phủ lên bậc'] },
  { id: 'ho_so', ten: 'Hồ sơ', tt: ['Em khá (Captain)', 'Em mới (Novice)', 'Em bậc thần', 'Chọn 3 huy hiệu khoe'] },
  { id: 'the_tv', ten: 'Thẻ TV lớp', tt: ['3 mẫu'] },
  { id: 'bo_hinh', ten: 'Bộ hình', tt: ['Tất cả hình'] },
  { id: 'the_gioi', ten: 'Thế giới BK', tt: ['Thế giới', 'Thế giới (thẻ gộp mở)', 'Bạn bè', 'Kết bạn', 'Lớp + giữ nút Thích', 'Lớp + menu ⋯', 'Bình luận', 'Bình luận · chọn câu', 'Bình luận · sticker', 'Ai đã bày tỏ cảm xúc', 'Tất cả cảm xúc (＋)'] },
]

function Dau({ tieuDe, phu }: { tieuDe: string; phu: string }) {
  return (
    <>
      <NutBack onBack={noop} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{tieuDe}</h1>
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>{phu}</p>
    </>
  )
}

function MauTheGioi({ tt }: { tt: number }) {
  // Đơn 5 (design/DON-HANG-GAMI-HS.md): 1 Thế giới · 2 thẻ gộp mở · 3 Bạn bè · 4 tấm Kết bạn · 5 Lớp + dải cảm xúc (giữ Thích) · 6 Lớp + menu ⋯
  // 7–9 tấm Bình luận (đóng / bàn phím câu / sticker) · 10 Ai đã bày tỏ cảm xúc · 11 tấm đủ mọi cảm xúc (＋). Bấm được thật (dữ liệu giả, không ghi DB).
  const tab = tt === 3 || tt === 4 ? 'ban' : tt === 5 || tt === 6 ? 'lop' : 'tg'
  const kenh = tab === 'ban' ? TG.KENH_BAN : tab === 'lop' ? TG.KENH_LOP : TG.KENH_TG
  const [thanh, setThanh] = useState<string | null>(tt === 5 ? 'nhat_buoi:1' : null)
  const [banPhim, setBanPhim] = useState<BanPhim>(tt === 8 ? 'cau' : tt === 9 ? 'sticker' : 'dong')
  const [xem, setXem] = useState<'bl' | 'tha'>(tt === 10 ? 'tha' : 'bl')
  const [loc, setLoc] = useState<string | null>(null)
  return (
    <TheGioiView tab={tab} onTab={noop} kenh={kenh} loi={null} banBe={TG.BAN_BE} hien="ten" onHien={noop}
      moGop={tt === 2 ? { nhat_buoi: true } : {}} onMoGop={noop} menuKhoa={tt === 6 ? 'no_luc:em' : null} onMenu={noop}
      danhMuc={TG.DANH_MUC} thanhKhoa={thanh} onThanh={setThanh} onTha={noop} onThemCamXuc={noop} onMoBl={noop}
      onAnTin={noop} onDongY={noop} onDeSau={noop} onMoKetBan={noop} onBack={noop}>
      {tt === 4 && <TamKetBan tim="" onTim={noop} ds={TG.GOI_Y} onGui={noop} onDong={noop} />}
      {tt >= 7 && tt <= 10 && <TamBinhLuan tin={TG.TIN_MO} ct={TG.CHI_TIET} xem={xem} onXem={setXem} loc={loc} onLoc={setLoc} banPhim={banPhim} onBanPhim={setBanPhim}
        danhMuc={TG.DANH_MUC} onGui={noop} dangGui={false} loi={null} onGo={noop} onAn={noop} onDong={noop} />}
      {tt === 11 && <TamCamXuc tin={TG.TIN_MO} danhMuc={TG.DANH_MUC} onChon={noop} onDong={noop} />}
    </TheGioiView>
  )
}

function Man({ man, tt }: { man: string; tt: number }) {
  const [mo, setMo] = useState<string | null>(tt === 1 ? 'athena' : null)
  const [mon, setMon] = useState('Toán')
  const [dong, setDong] = useState(false) // đóng lớp phủ để xem màn phía sau
  if (man === 'the_gioi') return <MauTheGioi key={tt} tt={tt} />
  if (man === 'nhiem_vu') {
    const d = [M.NV_GIUA_THANG, M.NV_DAU_THANG, M.NV_CHUA_MO][tt - 1] ?? M.NV_GIUA_THANG
    return <Khung><Dau tieuDe="Nhiệm vụ Toán" phu="Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP (đổi ra xu cuối tháng)." /><NhiemVuView d={d} onThuThach={noop} onTuLuyen={noop} onVongQuay={noop} /></Khung>
  }
  if (man === 'album') {
    const al = tt === 2 ? M.ALBUM_MOI : M.ALBUM_GIUA_NAM
    return <Khung><Dau tieuDe="Huy hiệu Toán" phu={tieuDeAlbum(al)} />
      <AlbumView al={al} mo={mo} onMo={(k) => setMo((x) => (x === k ? null : k))} chucMung={tt === 3 && !dong ? M.SAO_MOI : null} onDongChucMung={() => setDong(true)} /></Khung>
  }
  if (man === 'rank') {
    const d = [M.RANK_CAPTAIN, M.RANK_NOVICE, M.RANK_THAN, M.RANK_CAPTAIN][tt - 1] ?? M.RANK_CAPTAIN
    return <Khung><Dau tieuDe="Rank Toán" phu="Mùa này · khối 7 · hành trình người thường → thần" />
      <RankView d={d} onThuThach={noop} chucMung={tt === 4 && !dong ? 3 : null} onDongChucMung={() => setDong(true)} /></Khung>
  }
  if (man === 'ho_so') {
    const [rank, hs, dh] = tt === 2 ? [M.RANK_NOVICE, M.HOSO_MOI, null] : tt === 3 ? [M.RANK_THAN, M.HOSO_THAN, 'Quán quân Bảng đua tháng 9'] : [M.RANK_CAPTAIN, M.HOSO_KHA, 'Xuất sắc tháng 9']
    return (
      <ManHS>
        <DauTrangHS tieuDe="Hồ sơ" phu={mon} onBack={noop} />
        <HoSoView hoTen="Nguyễn Minh Anh" anhUrl={null} danhHieu={dh} mons={M.MONS_2} mon={mon} onChonMon={setMon}
          rank={rank} nv={tt === 2 ? M.NV_DAU_THANG : M.NV_GIUA_THANG} hs={hs} onRank={noop} onAlbum={noop} onDoiKhoe={noop} />
        {tt === 4 && !dong && <ChonKhoe hs={M.HOSO_KHA} onHuy={() => setDong(true)} onLuu={async () => setDong(true)} />}
      </ManHS>
    )
  }
  if (man === 'the_tv') {
    return (
      <ManHS>
        <DauTrangHS tieuDe="Thẻ nhỏ trên TV lớp" phu="1 dòng: avatar-khung · tên ngắn · biểu tượng bậc · 3 huy hiệu khoe — không hiện hạng" />
        <TheTVHS hoTen="Nguyễn Minh Anh" anhUrl={null} bac={9} khoe={M.HOSO_THAN.khoe} />
        <TheTVHS hoTen="Trần Gia Bảo" anhUrl={null} bac={3} khoe={M.HOSO_KHA.khoe} />
        <TheTVHS hoTen="Lê Khánh Linh" anhUrl={null} bac={1} khoe={[]} />
      </ManHS>
    )
  }
  return <BoHinh />
}

function O({ nhan, children }: { nhan: string; children: ReactNode }) {
  return <div className="flex flex-col items-center gap-1.5 text-center"><div className="flex min-h-[70px] items-center">{children}</div><span className="text-[11px]" style={{ color: MAU.muted }}>{nhan}</span></div>
}

// Mọi hình trong 1 trang — soát kit sau khi chép PNG (thiếu file ⇒ ảnh vỡ ngay ở đây).
function BoHinh() {
  return (
    <ManHS>
      <DauTrangHS tieuDe="Bộ hình gamification" phu={`Kit: huy hiệu ${KIT.huy_hieu ? 'PNG' : 'hình tạm'} · rank ${KIT.rank ? 'PNG' : 'hình tạm'} · chung ${KIT.rank_chung ? 'PNG' : 'hình tạm'} · nhiệm vụ ${KIT.nhiem_vu ? 'PNG' : 'emoji'}`} />
      <div className="p-4" style={THE}>
        <p className="mb-3 text-[13px] font-extrabold" style={HEAD}>Huy hiệu — khoá · ★1…★5 · nhỏ 48</p>
        <div className="flex flex-col gap-4">
          {Object.keys(MAU_HH).map((k) => (
            <div key={k} className="flex flex-wrap items-end gap-x-3 gap-y-2">
              {[0, 1, 2, 3, 4, 5].map((s) => <O key={s} nhan={s ? `${k} ★${s}` : `${k} khoá`}><HinhHuyHieu hhKey={k} sao={s} size={56} /></O>)}
              <O nhan="nho_48"><HinhHuyHieu hhKey={k} sao={1} size={48} kieu="nho" /></O>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4" style={THE}>
        <p className="mb-3 text-[13px] font-extrabold" style={HEAD}>Rank — biểu tượng · 64 · khung avatar · khung 96 · sao</p>
        <div className="flex flex-col gap-5">
          {BAC.map((b) => (
            <div key={b.bac} className="flex flex-wrap items-end gap-x-4 gap-y-2">
              <O nhan={`${b.bac} ${b.ten}`}><BieuTuongBac bac={b.bac} size={110} /></O>
              <O nhan="bieu_tuong_64"><BieuTuongBac bac={b.bac} size={40} nho /></O>
              <O nhan="khung_avatar"><AvatarKhung bac={b.bac} size={120} initials="MA" /></O>
              <O nhan="khung_avatar_96"><AvatarKhung bac={b.bac} size={52} initials="MA" /></O>
              <O nhan="sao">{b.bac < 9 ? <SaoBac n={2} /> : <span style={{ color: MAU.muted }}>—</span>}</O>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4" style={THE}>
        <p className="mb-3 text-[13px] font-extrabold" style={HEAD}>Icon nhiệm vụ</p>
        <div className="grid grid-cols-6 gap-2">
          {Object.keys(ICON_NV).map((m) => <O key={m} nhan={m}><IconNV ma={m} size={26} /></O>)}
        </div>
      </div>
    </ManHS>
  )
}

export default function XemMauGami() {
  const q = new URLSearchParams(location.search)
  const [man, setMan] = useState(q.get('man') ?? 'nhiem_vu')
  const [tt, setTt] = useState(Number(q.get('tt') ?? 1) || 1)
  const an = q.has('an')
  const doi = (m: string, t: number) => {
    setMan(m); setTt(t)
    const u = new URL(location.href); u.searchParams.set('man', m); u.searchParams.set('tt', String(t)); history.replaceState(null, '', u)
  }
  const cur = MAN.find((m) => m.id === man) ?? MAN[0]
  const chip = (chon: boolean) => (chon ? { background: MAU.acc, color: MAU.accInk } : { ...THE_TRON, borderRadius: 999, color: MAU.ink })
  return (
    <>
      {!an && (
        <div className="sticky top-0 z-30 flex flex-col gap-1.5 px-3 py-2 text-[12px] font-bold" style={{ background: MAU.bg, borderBottom: `1px solid ${MAU.line}`, color: MAU.ink }}>
          <div className="flex gap-1.5 overflow-x-auto">
            <span className="shrink-0 self-center pr-1" style={{ color: MAU.muted }}>XEM MẪU</span>
            {MAN.map((m) => <button key={m.id} onClick={() => doi(m.id, 1)} className="shrink-0 rounded-full px-3 py-1" style={chip(m.id === cur.id)}>{m.ten}</button>)}
          </div>
          {cur.tt.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto">
              {cur.tt.map((t, i) => <button key={t} onClick={() => doi(cur.id, i + 1)} className="shrink-0 rounded-full px-3 py-1" style={chip(tt === i + 1)}>{i + 1}. {t}</button>)}
            </div>
          )}
        </div>
      )}
      <Man key={`${cur.id}-${tt}`} man={cur.id} tt={tt} />
    </>
  )
}
