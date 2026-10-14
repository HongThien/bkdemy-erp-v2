// CongTA — CHẤM CÔNG của TA trên app (spec-cham-cong-ta.md §4, mockup design/mockup-cham-cong-ta.html, Thùy duyệt 14/10).
// 3 tab: Hôm nay (Checkin/Checkout · việc theo lịch → "Ghi công" · việc đã ghi · thêm việc ngoài lịch · card to "Khai bù ngày trước"
//        → màn Khai bù: lịch chọn ngày dd/mm/yyyy rồi khai ca + ghi công ngày đó)
//        · Bảng công (theo tháng, đối chiếu + trạng thái duyệt) · Lương (tháng đã chốt ⇒ phiếu chính thức từ bản chốt;
//        chưa chốt ⇒ tạm tính, chỉ phần đã duyệt).
// Mọi luật ở DB (lib/tacong.ts): lớp mặc định theo phân công TẠI NGÀY, 24 giờ / đợt khai lùi tháng 10, khớp lịch, làm hộ ai.
// Sau mỗi thao tác: quét lại NỀN, giữ nguyên danh sách đang hiện (không trắng màn — CLAUDE.md §2 React).
import { useEffect, useMemo, useState } from 'react'
import SearchSelect from '../../components/SearchSelect'
import { BKTabHeader, BKSegmented } from '../../components/bk/BKUI'
import HuongDanCong, { daXemHuongDanCong, ghiDaXemHuongDanCong } from './HuongDanCong'
import { lienKetTgCuaToi, linkKetNoiTg, type LienKetTg } from '../../lib/telegram'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay, ngayCuaTs, soNgayGiua } from '../../lib/tuan'
import {
  checkin, checkout, khaiBuCa, goiYViec, congCuaToi, khaiBuChoPhep, boViec, ghiCong, dsLoaiViec, dsLop, luongCuaToi,
  gioVN, hm, nhanCo, type GoiY, type DongCong, type KhoangKhaiBu, type LoaiViec, type LuongThang,
} from '../../lib/tacong'

type Tab = 'nay' | 'bang' | 'luong'
const A = (n: string) => `/bk-ui/${n}.png`
const loiCua = (e: unknown) => (e as { message?: string })?.message ?? String(e)
const tien = (n: number) => Math.round(Number(n) || 0).toLocaleString('vi-VN')
const so = (n: number) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('vi-VN')
const dauThang = (ngay: string) => ngay.slice(0, 8) + '01'
const cuoiThang = (ky: string) => congNgay(dauThang(congNgay(ky, 32)), -1)
const ngayDu = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`   // dd/mm/yyyy (Thùy 14/10)

export default function CongTA({ nsId, onBack, onDoi }: { nsId: string; onBack: () => void; onDoi?: () => void }) {
  const [tab, setTab] = useState<Tab>('nay')
  const [khaiBu, setKhaiBu] = useState(false)   // màn Khai bù (mở từ card trong tab Hôm nay)
  // Tutorial (Thùy 14/10): tự hiện lần đầu TA mở Chấm công; nút "Hướng dẫn" để xem lại. ?hd=1 ép hiện (trang xem thử).
  const [hd, setHd] = useState(() => !daXemHuongDanCong(nsId) || new URLSearchParams(location.search).get('hd') === '1')
  return (
    <div>
      <BKTabHeader icon={A('pr_calendar')} title="Chấm công" sub="Checkin · ghi công · bảng công · lương" onBack={onBack}
        right={<button onClick={() => setHd(true)} className="shrink-0 rounded-full bg-[#EEF3FF] px-3 py-1.5 text-[12.5px] font-bold text-[#3B62C4] active:scale-95">Hướng dẫn</button>} />
      {hd && <HuongDanCong onXong={() => { ghiDaXemHuongDanCong(nsId); setHd(false) }} />}
      <div className="mx-auto flex max-w-[640px] flex-col gap-2 px-2 pb-6">
        <BKSegmented value={tab} onChange={(t) => { setTab(t); setKhaiBu(false) }} items={[{ key: 'nay', label: 'Hôm nay' }, { key: 'bang', label: 'Bảng công' }, { key: 'luong', label: 'Lương' }]} />
        {tab === 'nay' && (khaiBu ? <KhaiBu onDoi={onDoi} onBack={() => setKhaiBu(false)} /> : <HomNay onDoi={onDoi} onKhaiBu={() => setKhaiBu(true)} />)}
        {tab === 'bang' && <BangCong />}
        {tab === 'luong' && <Luong nsId={nsId} />}
      </div>
    </div>
  )
}

// ── Thông báo ~2s (không alert) ──
function useThongBao() {
  const [tb, setTb] = useState<{ ok: boolean; t: string } | null>(null)
  useEffect(() => { if (!tb?.ok) return; const id = setTimeout(() => setTb(null), 2500); return () => clearTimeout(id) }, [tb])
  const el = tb && <p className={`rounded-2xl px-3 py-2 text-[13px] font-semibold ${tb.ok ? 'bg-[#E4F8EC] text-[#1E8A52]' : 'bg-[#FFE4EA] text-[#C0355A]'}`}>{tb.t}</p>
  return { setTb, el }
}

// ── TAB HÔM NAY: công hôm nay + CARD "Khai bù ngày trước" (Thùy 14/10: khai bù là một chức năng riêng, card to) ──
function HomNay({ onDoi, onKhaiBu }: { onDoi?: () => void; onKhaiBu: () => void }) {
  const [khoang, setKhoang] = useState<KhoangKhaiBu[]>([])
  useEffect(() => { khaiBuChoPhep().then(setKhoang).catch(() => {}) }, [])
  const dot = khoang.find((k) => k.han)
  return (
    <div className="flex flex-col gap-2">
      <NgayCong ngay={homNayVN()} onDoi={onDoi} />
      {/* Card khai bù — kiểu 1 (dải màu trên + thân trắng), bấm cả card để mở màn khai bù */}
      <button onClick={onKhaiBu} className="overflow-hidden rounded-[22px] bg-white text-left shadow-sm active:scale-[.99]">
        <div className="flex items-center gap-3 bg-[#8B6BEF] px-4 py-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/90"><img src={A('pr_calendar')} alt="" className="h-9 w-9 object-contain" draggable={false} /></span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-bubble text-[19px] font-extrabold text-white">Khai bù ngày trước</p>
            <p className="text-[12.5px] text-white/85">Quên checkin · quên checkout · quên ghi công</p>
          </div>
          <span className="text-[26px] font-bold text-white">›</span>
        </div>
        <div className="flex flex-col gap-1.5 px-4 py-3.5">
          <p className="text-[13.5px] text-[#16224D]">Chọn ngày trên lịch, khai giờ checkin / checkout thật của ngày đó, rồi ghi công các việc đã làm. Quản lý vẫn duyệt như thường.</p>
          {dot?.han
            ? <p className="rounded-xl bg-[#F1ECFF] px-3 py-2 text-[12.5px] font-semibold text-[#5B3FC4]">Đang mở khai lùi: từ ngày {ngayDu(dot.tu)} đến hôm qua, hạn {gioVN(dot.han)} ngày {ngayDu(ngayCuaTs(new Date(dot.han).getTime()))}</p>
            : <p className="rounded-xl bg-[#F4F7FE] px-3 py-2 text-[12.5px] text-[#63709A]">Tự khai bù được trong 24 giờ. Quá 24 giờ thì nhờ quản lý nhập hộ.</p>}
        </div>
      </button>
      <TheTelegram />
    </div>
  )
}

// ── Nối Telegram (spec-bot-telegram-ta.md): bot đăng việc tồn mỗi sáng 8:00 trong nhóm và tag đúng người. Chưa nối ⇒ card kiểu 1
// có nút; đã nối ⇒ 1 dòng nhỏ. Quay lại app (sau khi bấm Start trong Telegram) ⇒ tự kiểm lại.
function TheTelegram() {
  const [lk, setLk] = useState<LienKetTg | null | undefined>(undefined)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const tai = () => { lienKetTgCuaToi().then(setLk).catch(() => setLk(undefined)) }
  useEffect(() => {
    tai()
    const h = () => { if (document.visibilityState === 'visible') tai() }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [])
  if (lk === undefined) return null
  if (lk) return <p className="rounded-2xl bg-white/80 px-3 py-2 text-[12.5px] text-[#63709A]">✈️ Telegram đã kết nối{lk.tg_username ? ` · @${lk.tg_username}` : lk.ten_tg ? ` · ${lk.ten_tg}` : ''}</p>
  const moi = async () => {
    setDang(true); setLoi(null)
    try { window.location.href = await linkKetNoiTg() } catch (e) { setLoi(loiCua(e)) } finally { setDang(false) }
  }
  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-sm">
      <div className="flex items-center gap-3 bg-[#2AABEE] px-4 py-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-[24px]">✈️</span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-bubble text-[18px] font-extrabold text-white">Kết nối Telegram</p>
          <p className="text-[12.5px] text-white/85">Để bot báo đúng việc của bạn mỗi sáng</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3.5">
        <p className="text-[13.5px] text-[#16224D]">Bấm nút bên dưới → Telegram mở chat với bot → bấm <b>Start</b>. Xong quay lại app là được.</p>
        {loi && <p className="rounded-xl bg-[#FFE4EA] px-3 py-2 text-[12.5px] font-semibold text-[#C0355A]">{loi}</p>}
        <button onClick={moi} disabled={dang} className="rounded-2xl bg-[#2AABEE] py-3 text-[15px] font-bold text-white active:scale-[.99] disabled:opacity-60">{dang ? 'Đang mở…' : 'Kết nối Telegram'}</button>
      </div>
    </div>
  )
}

// ── MÀN KHAI BÙ: lịch chọn ngày (dd/mm/yyyy) → công của ngày đó ──
function KhaiBu({ onDoi, onBack }: { onDoi?: () => void; onBack: () => void }) {
  const homNay = homNayVN(), homQua = congNgay(homNay, -1)
  const [khoang, setKhoang] = useState<KhoangKhaiBu[] | null>(null)
  const [daCo, setDaCo] = useState<Set<string>>(new Set())     // ngày đã có checkin (chấm xanh trên lịch)
  const [ngay, setNgay] = useState<string | null>(null)
  const tu = (khoang ?? []).reduce((m, k) => (k.tu < m ? k.tu : m), homQua)
  const taiDaCo = () => { congCuaToi(tu, homQua).then((ds) => setDaCo(new Set(ds.filter((r) => r.loai_dong === 'ca' && r.duyet !== 'tu_choi').map((r) => r.ngay)))).catch(() => {}) }
  useEffect(() => { khaiBuChoPhep().then(setKhoang).catch(() => setKhoang([])) }, [])
  useEffect(() => { if (khoang) taiDaCo() }, [khoang]) // eslint-disable-line
  const dot = (khoang ?? []).find((k) => k.han)
  return (
    <div className="flex flex-col gap-2">
      <button onClick={onBack} className="self-start rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-bold text-[#2F73F6]">‹ Về hôm nay</button>
      <div className="overflow-hidden rounded-[22px] bg-white shadow-sm">
        <div className="bg-[#8B6BEF] px-4 py-3">
          <p className="font-bubble text-[19px] font-extrabold text-white">Khai bù ngày trước</p>
          <p className="text-[12.5px] text-white/85">{dot?.han ? `Chọn ngày từ ${ngayDu(tu)} đến ${ngayDu(homQua)} · hạn ${gioVN(dot.han)} ngày ${ngayDu(ngayCuaTs(new Date(dot.han).getTime()))}` : `Chỉ khai bù được ngày ${ngayDu(homQua)} (trong 24 giờ)`}</p>
        </div>
        <div className="px-3 py-3">
          {khoang === null ? <p className="text-[13px] text-[#63709A]">Đang tải…</p>
            : <LichChonNgay tu={tu} den={homQua} chon={ngay} daCo={daCo} onChon={setNgay} />}
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[#63709A]">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#1E9E5A]" /> đã có checkin</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#8B6BEF]" /> đang chọn</span>
          </p>
        </div>
      </div>
      {ngay
        ? <NgayCong key={ngay} ngay={ngay} onDoi={() => { taiDaCo(); onDoi?.() }} />
        : <p className="rounded-[20px] bg-white/80 px-3 py-4 text-center text-[13px] text-[#63709A]">Chọn một ngày trên lịch để khai bù.</p>}
    </div>
  )
}

// Lịch tháng, tuần bắt đầu Thứ 2; chỉ bấm được ngày trong [tu, den]. Ngày = chuỗi 'YYYY-MM-DD', tính bằng lib/tuan (không qua Date local).
const THU_LICH = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
function LichChonNgay({ tu, den, chon, daCo, onChon }: { tu: string; den: string; chon: string | null; daCo: Set<string>; onChon: (d: string) => void }) {
  const thang: string[] = []
  for (let m = dauThang(tu); m <= dauThang(den); m = dauThang(congNgay(m, 32))) thang.push(m)
  return (
    <div className="flex flex-col gap-3">
      {thang.map((m) => {
        const lech = ((soNgayGiua('2026-01-05', m) % 7) + 7) % 7   // 05/01/2026 là Thứ 2 ⇒ số ô trống đầu tháng
        const ngays: (string | null)[] = Array(lech).fill(null)
        for (let d = m; d <= cuoiThang(m); d = congNgay(d, 1)) ngays.push(d)
        return (
          <div key={m}>
            <p className="mb-1 text-[13px] font-bold text-[#16224D]">Tháng {Number(m.slice(5, 7))}/{m.slice(0, 4)}</p>
            <div className="grid grid-cols-7 gap-1">
              {THU_LICH.map((t) => <span key={t} className="text-center text-[11px] font-semibold text-[#9AA5C4]">{t}</span>)}
              {ngays.map((d, i) => {
                if (!d) return <span key={'x' + i} />
                const duoc = d >= tu && d <= den, laChon = d === chon, co = daCo.has(d)
                return (
                  <button key={d} disabled={!duoc} onClick={() => onChon(d)}
                    className={`relative flex h-11 items-center justify-center rounded-xl text-[14px] font-bold transition ${laChon ? 'bg-[#8B6BEF] text-white' : duoc ? 'bg-[#F4F7FE] text-[#16224D] active:bg-[#E6DDFF]' : 'text-[#C9D0E3]'}`}>
                    {Number(d.slice(8, 10))}
                    {co && <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${laChon ? 'bg-white' : 'bg-[#1E9E5A]'}`} />}
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

// ── CÔNG CỦA MỘT NGÀY (hôm nay hoặc ngày khai bù): ca có mặt · việc theo lịch (chỉ hôm nay) · việc đã ghi · thêm việc ──
function NgayCong({ ngay, onDoi }: { ngay: string; onDoi?: () => void }) {
  const homNay = homNayVN()
  const laHomNay = ngay === homNay
  const [dong, setDong] = useState<DongCong[] | null>(null)
  const [goiY, setGoiY] = useState<GoiY[]>([])
  const [loai, setLoai] = useState<LoaiViec[]>([])
  const [lop, setLop] = useState<{ id: string; ten_lop: string; mon: string }[]>([])
  const [ban, setBan] = useState<string | null>(null)   // thao tác đang chạy
  const [moThem, setMoThem] = useState(false)
  const { setTb, el: thongBao } = useThongBao()

  // quét nền: giữ list cũ tới khi có list mới (không trắng màn). Đổi ngày = component mới (key) nên không cần dọn.
  const tai = async () => {
    const [c, g] = await Promise.all([congCuaToi(ngay, ngay), laHomNay ? goiYViec() : Promise.resolve([] as GoiY[])])
    setDong(c); setGoiY(g)
  }
  useEffect(() => {
    dsLoaiViec().then(setLoai).catch(() => {}); dsLop().then(setLop).catch(() => {})
    tai().catch((e) => { setTb({ ok: false, t: loiCua(e) }); setDong([]) })
  }, []) // eslint-disable-line

  const chay = async (ma: string, fn: () => Promise<unknown>, ok: string) => {
    setBan(ma); setTb(null)
    try { await fn(); setTb({ ok: true, t: ok }); await tai(); onDoi?.() }
    catch (e) { setTb({ ok: false, t: loiCua(e) }) }
    finally { setBan(null) }
  }

  const cas = (dong ?? []).filter((r) => r.loai_dong === 'ca' && r.duyet !== 'tu_choi')
  const viecs = (dong ?? []).filter((r) => r.loai_dong === 'viec')
  const caMo = laHomNay ? cas.find((c) => !c.ra_at) : undefined
  const coCa = cas.length > 0

  return (
    <div className="flex flex-col gap-2">
      {thongBao}
      {/* CA CÓ MẶT */}
      <div className="rounded-[22px] bg-white/90 p-3">
        <p className="font-bubble text-[17px] font-extrabold text-[#16224D]">{laHomNay ? 'Hôm nay' : 'Ngày'} · {thuCuaNgay(ngay)} {ngayDu(ngay)}</p>
        {dong === null ? <p className="py-2 text-[13px] text-[#63709A]">Đang tải…</p> : <>
          {cas.map((c) => <DongCa key={c.id} c={c} />)}
          {laHomNay && (caMo
            ? <button disabled={!!ban} onClick={() => chay('out', checkout, 'Đã checkout')} className="mt-2 w-full rounded-2xl bg-[#F57C2B] py-3.5 text-[17px] font-extrabold text-white active:scale-[.99] disabled:opacity-50">Checkout</button>
            : <button disabled={!!ban} onClick={() => chay('in', checkin, 'Đã checkin')} className="mt-2 w-full rounded-2xl bg-[#1E9E5A] py-3.5 text-[17px] font-extrabold text-white active:scale-[.99] disabled:opacity-50">{coCa ? 'Checkin ca mới' : 'Checkin'}</button>)}
          {!laHomNay && <KhaiBuCa coCaMo={cas.some((c) => !c.ra_at)} coCa={coCa} ban={!!ban} onLuu={(v, r) => chay('bu', () => khaiBuCa(ngay, v, r), `Đã khai bù ca ngày ${ngayDu(ngay)}`)} />}
        </>}
      </div>

      {/* VIỆC THEO LỊCH (chỉ hôm nay) */}
      {laHomNay && dong !== null && (
        <div className="rounded-[22px] bg-[#E6F0FF] p-3">
          <p className="font-bubble text-[16px] font-extrabold text-[#16224D]">Việc hôm nay theo lịch</p>
          {goiY.length === 0
            ? <p className="pt-1 text-[12.5px] text-[#63709A]">Lịch hôm nay không có việc nào của bạn. Có việc thì bấm “Thêm việc ngoài lịch”.</p>
            : <div className="mt-1.5 flex flex-col gap-1.5">
              {goiY.map((g) => {
                const ma = g.buoi_hoc_id ?? g.ca_bo_tro_id ?? ''
                return (
                  <div key={ma + g.loai_viec} className={`flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ${g.dang_dien_ra && !g.da_khai ? 'ring-2 ring-[#F59E0B]' : ''}`}>
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="text-[14px] font-bold text-[#16224D]">{tenGoiY(g, loai)}</p>
                      <p className="text-[12px] text-[#63709A]">{hm(g.gio_bat_dau)}–{hm(g.gio_ket_thuc)}{g.dang_dien_ra && <b className="ml-1.5 text-[#C27A00]">Đang diễn ra</b>}</p>
                    </div>
                    {g.da_khai
                      ? <span className="shrink-0 rounded-full bg-[#E4F8EC] px-2.5 py-1 text-[12px] font-bold text-[#1E8A52]">✓ Đã ghi công</span>
                      : <button disabled={!coCa || !!ban} onClick={() => chay('g' + ma, () => ghiCong({ loai: g.loai_viec, ngay, lop: g.lop_id, buoi: g.buoi_hoc_id, ca: g.ca_bo_tro_id, bat: g.gio_bat_dau, ket: g.gio_ket_thuc }), 'Đã ghi công: ' + tenGoiY(g, loai))}
                        className="shrink-0 rounded-full bg-[#2F73F6] px-3 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-40">Ghi công</button>}
                  </div>
                )
              })}
            </div>}
          {!coCa && goiY.length > 0 && <p className="pt-1.5 text-[12px] font-semibold text-[#C27A00]">Checkin trước rồi mới ghi công được.</p>}
        </div>
      )}

      {/* VIỆC ĐÃ GHI + THÊM VIỆC */}
      {dong !== null && (
        <div className="rounded-[22px] bg-white/90 p-3">
          <p className="font-bubble text-[16px] font-extrabold text-[#16224D]">Việc đã ghi công {laHomNay ? 'hôm nay' : 'ngày ' + ngayDu(ngay)}</p>
          {viecs.length === 0 ? <p className="pt-1 text-[12.5px] text-[#63709A]">Chưa ghi công việc nào.</p>
            : <div className="mt-1.5 flex flex-col gap-1.5">{viecs.map((v) => <DongViec key={v.id} v={v} ban={ban === 'b' + v.id} onBo={() => chay('b' + v.id, () => boViec(v.id), 'Đã bỏ việc')} />)}</div>}
          {!moThem
            ? <button onClick={() => setMoThem(true)} disabled={!coCa} className="mt-2 rounded-full bg-[#EEF3FF] px-3 py-1.5 text-[13px] font-bold text-[#2F73F6] disabled:opacity-40">+ Thêm việc ngoài lịch</button>
            : <FormViec ngay={ngay} loai={loai} lop={lop} ban={!!ban} onHuy={() => setMoThem(false)}
                onLuu={(v) => chay('them', async () => { await ghiCong(v); setMoThem(false) }, 'Đã ghi công')} />}
          {!coCa && <p className="pt-1.5 text-[12px] text-[#63709A]">{laHomNay ? 'Checkin trước rồi mới thêm việc.' : 'Khai bù ca ngày này trước rồi mới thêm việc.'}</p>}
        </div>
      )}
    </div>
  )
}

function tenGoiY(g: GoiY, loai: LoaiViec[]): string {
  if (g.loai_viec === 'tro_giang') return 'Trợ giảng lớp ' + (g.ten_lop ?? '')
  if (g.loai_viec === 'trong_thi') return 'Trông thi lớp ' + (g.ten_lop ?? '')
  if (g.loai_viec === 'bo_tro_dinh_ki') return 'Trực bổ trợ ' + (g.ten_lop ?? '')
  return (loai.find((l) => l.ma === g.loai_viec)?.ten ?? g.loai_viec) + (g.ten_lop ? ' · ' + g.ten_lop : '')
}

const PILL_DUYET: Record<DongCong['duyet'], [string, string]> = {
  cho_duyet: ['Chờ duyệt', 'bg-[#FFF1D6] text-[#C27A00]'], da_duyet: ['Đã duyệt', 'bg-[#E4F8EC] text-[#1E8A52]'], tu_choi: ['Từ chối', 'bg-[#FFE4EA] text-[#C0355A]'],
}
const Pill = ({ c, children }: { c: string; children: React.ReactNode }) => <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${c}`}>{children}</span>

function DongCa({ c }: { c: DongCong }) {
  const chot = c.vao_chot || c.ra_chot
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#F4F7FE] px-3 py-2">
      <span className="text-[13.5px] font-bold text-[#16224D]">Checkin {gioVN(c.vao_at)} · Checkout {c.ra_at ? gioVN(c.ra_at) : '—'}</span>
      {chot && <span className="text-[11.5px] text-[#63709A]">(quản lý chốt {gioVN(c.vao_chot ?? c.vao_at)}–{gioVN(c.ra_chot ?? c.ra_at)})</span>}
      <Pill c={PILL_DUYET[c.duyet][1]}>{PILL_DUYET[c.duyet][0]}</Pill>
      {c.co.filter((x) => x !== 'ca_khong_viec').map((x) => <Pill key={x} c="bg-[#EEF3FF] text-[#3B62C4]">{nhanCo(x).t}</Pill>)}
      {c.duyet === 'tu_choi' && c.ly_do_duyet && <span className="w-full text-[11.5px] text-[#C0355A]">Lý do: {c.ly_do_duyet}</span>}
    </div>
  )
}

function DongViec({ v, ban, onBo }: { v: DongCong; ban?: boolean; onBo?: () => void }) {
  const coManh = v.co.filter((x) => !nhanCo(x).nhe)
  return (
    <div className={`flex items-start gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ${v.duyet === 'tu_choi' ? 'opacity-70 ring-[#F5C2CF]' : 'ring-[#E3E9F6]'}`}>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[14px] font-bold text-[#16224D]">{v.ten_loai}{v.ten_lop ? ' · ' + v.ten_lop : ''}</p>
        <p className="text-[12px] text-[#63709A]">{hm(v.gio_bat_dau)}–{hm(v.gio_ket_thuc)}{v.hoc_sinh ? ' · ' + v.hoc_sinh : ''}{v.ghi_chu ? ' · ' + v.ghi_chu : ''}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {v.khop && <Pill c="bg-[#E4F8EC] text-[#1E8A52]">Đã khớp lịch</Pill>}
          <Pill c={PILL_DUYET[v.duyet][1]}>{PILL_DUYET[v.duyet][0]}</Pill>
          {v.lam_ho && <Pill c="bg-[#EEF3FF] text-[#3B62C4]">Làm hộ {v.lam_ho}</Pill>}
          {v.khai_bu && <Pill c="bg-[#EEF3FF] text-[#3B62C4]">Khai bù</Pill>}
          {v.nguon === 'nhap_ho' && <Pill c="bg-[#EEF3FF] text-[#3B62C4]">Quản lý nhập hộ</Pill>}
          {coManh.map((x) => <Pill key={x} c="bg-[#FFF1D6] text-[#C27A00]">{nhanCo(x).t}</Pill>)}
        </div>
        {v.duyet === 'tu_choi' && v.ly_do_duyet && <p className="mt-1 text-[11.5px] text-[#C0355A]">Lý do: {v.ly_do_duyet}</p>}
      </div>
      {onBo && v.duyet === 'cho_duyet' && <button disabled={ban} onClick={onBo} className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold text-[#C0355A] ring-1 ring-[#F5C2CF] disabled:opacity-40">Bỏ</button>}
    </div>
  )
}

function KhaiBuCa({ coCaMo, coCa, ban, onLuu }: { coCaMo: boolean; coCa: boolean; ban: boolean; onLuu: (vao: string, ra: string) => void }) {
  const [vao, setVao] = useState('17:00')
  const [ra, setRa] = useState('21:00')
  const [moThem, setMoThem] = useState(false)
  if (coCa && !coCaMo && !moThem) return <button onClick={() => setMoThem(true)} className="mt-2 rounded-full bg-[#EEF3FF] px-3 py-1.5 text-[12.5px] font-bold text-[#2F73F6]">+ Khai thêm một ca nữa trong ngày</button>
  return (
    <div className="mt-2 rounded-2xl bg-[#F4F7FE] p-2.5">
      <p className="text-[12.5px] font-semibold text-[#63709A]">{coCaMo ? 'Ca ngày này chưa checkout — điền giờ checkout (giờ checkin giữ nguyên).' : 'Khai giờ checkin / checkout thật của ngày này, quản lý sẽ duyệt như thường.'}</p>
      <div className="mt-1.5 flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-[11.5px] font-semibold text-[#63709A]">Checkin<input type="time" value={vao} onChange={(e) => setVao(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1 text-[13px] text-[#16224D]" /></label>
        <label className="flex flex-col text-[11.5px] font-semibold text-[#63709A]">Checkout<input type="time" value={ra} onChange={(e) => setRa(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1 text-[13px] text-[#16224D]" /></label>
        <button disabled={ban || !vao || !ra} onClick={() => onLuu(vao, ra)} className="rounded-full bg-[#2F73F6] px-3 py-1.5 text-[13px] font-bold text-white disabled:opacity-40">Khai bù ca</button>
      </div>
    </div>
  )
}

function FormViec({ ngay, loai, lop, ban, onHuy, onLuu }: {
  ngay: string; loai: LoaiViec[]; lop: { id: string; ten_lop: string; mon: string }[]; ban: boolean
  onHuy: () => void; onLuu: (v: Parameters<typeof ghiCong>[0]) => void
}) {
  const [ma, setMa] = useState('tro_giang')
  const [lopId, setLopId] = useState<string | null>(null)
  const [bat, setBat] = useState('18:00')
  const [ket, setKet] = useState('19:30')
  const [hs, setHs] = useState('')
  const [gc, setGc] = useState('')
  const L = loai.find((l) => l.ma === ma)
  const optLop = useMemo(() => lop.map((l) => ({ id: l.id, label: l.ten_lop, sub: l.mon })), [lop])
  const thieu = (L?.can_lop && !lopId && ma !== 'tro_giang') || (ma === 'khac' && !gc.trim()) || (L?.don_vi === 'gio' && (!bat || !ket))
  return (
    <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-[#F4F7FE] p-2.5">
      <label className="flex flex-col gap-0.5 text-[11.5px] font-semibold text-[#63709A]">Loại việc
        <select value={ma} onChange={(e) => setMa(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1.5 text-[13px] text-[#16224D]">
          {loai.map((l) => <option key={l.ma} value={l.ma}>{l.ten}</option>)}
        </select>
      </label>
      {(L?.can_lop || ma === 'bo_tro_dac_biet') && (
        <div className="flex flex-col gap-0.5 text-[11.5px] font-semibold text-[#63709A]">Lớp{ma === 'tro_giang' ? ' (để trống = lớp chính của bạn ngày đó)' : ''}
          <SearchSelect value={lopId} onChange={setLopId} options={optLop} placeholder="Gõ tên lớp…" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="flex flex-col text-[11.5px] font-semibold text-[#63709A]">Từ<input type="time" value={bat} onChange={(e) => setBat(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1 text-[13px] text-[#16224D]" /></label>
        <label className="flex flex-col text-[11.5px] font-semibold text-[#63709A]">Đến<input type="time" value={ket} onChange={(e) => setKet(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1 text-[13px] text-[#16224D]" /></label>
      </div>
      {L?.can_hs && <label className="flex flex-col gap-0.5 text-[11.5px] font-semibold text-[#63709A]">Học sinh<input value={hs} onChange={(e) => setHs(e.target.value)} placeholder="Tên học sinh" className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1.5 text-[13px] text-[#16224D]" /></label>}
      <label className="flex flex-col gap-0.5 text-[11.5px] font-semibold text-[#63709A]">Ghi chú{ma === 'khac' ? ' (bắt buộc)' : ''}<input value={gc} onChange={(e) => setGc(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1.5 text-[13px] text-[#16224D]" /></label>
      <div className="flex items-center gap-2">
        <button disabled={ban || !!thieu} onClick={() => onLuu({ loai: ma, ngay, lop: lopId, bat, ket, hs, ghiChu: gc })} className="rounded-full bg-[#2F73F6] px-4 py-1.5 text-[13px] font-bold text-white disabled:opacity-40">Ghi công</button>
        <button onClick={onHuy} className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-[#63709A]">Huỷ</button>
      </div>
    </div>
  )
}

// ── TAB BẢNG CÔNG (theo tháng) ──
function BangCong() {
  const [ky, setKy] = useState(dauThang(homNayVN()))
  const [dong, setDong] = useState<DongCong[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { setDong(null); setLoi(null); congCuaToi(ky, cuoiThang(ky)).then(setDong).catch((e) => setLoi(loiCua(e))) }, [ky])
  const ngays = [...new Set((dong ?? []).map((r) => r.ngay))].sort().reverse()
  return (
    <div className="flex flex-col gap-2">
      <ChonThang ky={ky} setKy={setKy} />
      {loi && <p className="rounded-2xl bg-[#FFE4EA] px-3 py-2 text-[13px] font-semibold text-[#C0355A]">{loi}</p>}
      {dong === null && !loi ? <p className="px-1 text-[13px] text-[#63709A]">Đang tải…</p>
        : ngays.length === 0 ? <p className="rounded-[20px] bg-white/90 px-3 py-4 text-center text-[13px] text-[#63709A]">Tháng này chưa có công nào.</p>
        : ngays.map((d) => (
          <div key={d} className="rounded-[22px] bg-white/90 p-3">
            <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">{thuCuaNgay(d)} {ddmmVN(d)}</p>
            {dong!.filter((r) => r.ngay === d && r.loai_dong === 'ca').map((c) => <DongCa key={c.id} c={c} />)}
            <div className="mt-1.5 flex flex-col gap-1.5">{dong!.filter((r) => r.ngay === d && r.loai_dong === 'viec').map((v) => <DongViec key={v.id} v={v} />)}</div>
          </div>
        ))}
    </div>
  )
}

function ChonThang({ ky, setKy }: { ky: string; setKy: (k: string) => void }) {
  const [y, m] = ky.split('-')
  return (
    <div className="flex items-center justify-between rounded-[20px] bg-white/90 px-3 py-1.5">
      <button onClick={() => setKy(dauThang(congNgay(ky, -1)))} className="rounded-full px-3 py-1 text-[18px] font-bold text-[#2F73F6]">‹</button>
      <span className="font-bubble text-[15px] font-extrabold text-[#16224D]">Tháng {Number(m)}/{y}</span>
      <button disabled={ky >= dauThang(homNayVN())} onClick={() => setKy(dauThang(congNgay(ky, 32)))} className="rounded-full px-3 py-1 text-[18px] font-bold text-[#2F73F6] disabled:opacity-30">›</button>
    </div>
  )
}

// ── TAB LƯƠNG (fn_ta_luong_ky: tháng đã chốt ⇒ bản chốt bất biến; chưa chốt ⇒ tạm tính, chỉ việc đã duyệt thuộc ca đã duyệt) ──
function Luong({ nsId }: { nsId: string }) {
  const [ky, setKy] = useState(dauThang(homNayVN()))
  const [l, setL] = useState<LuongThang | null | undefined>(undefined)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { setL(undefined); setLoi(null); luongCuaToi(ky, nsId).then(setL).catch((e) => setLoi(loiCua(e))) }, [ky, nsId])
  const bt = l?.chi_tiet.bo_tro
  const [tenLoai, setTenLoai] = useState<Record<string, string>>({})
  useEffect(() => { dsLoaiViec().then((ds) => setTenLoai(Object.fromEntries(ds.map((x) => [x.ma, x.ten])))).catch(() => {}) }, [])
  return (
    <div className="flex flex-col gap-2">
      <ChonThang ky={ky} setKy={setKy} />
      {loi && <p className="rounded-2xl bg-[#FFE4EA] px-3 py-2 text-[13px] font-semibold text-[#C0355A]">{loi}</p>}
      {l === undefined && !loi ? <p className="px-1 text-[13px] text-[#63709A]">Đang tải…</p> : l === null ? <p className="rounded-[20px] bg-white/90 px-3 py-4 text-center text-[13px] text-[#63709A]">Chưa có dữ liệu lương tháng này.</p> : l && (
        <div className="rounded-[22px] bg-white/90 p-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="font-bubble text-[16px] font-extrabold text-[#16224D]">{l.da_chot ? 'Phiếu lương chính thức' : 'Tạm tính'}</p>
              {l.da_chot && <p className="text-[11.5px] font-semibold text-[#2E8B57]">Đã chốt {l.chot_at ? ngayDu(ngayCuaTs(new Date(l.chot_at).getTime())) : ''}{l.lan && l.lan > 1 ? ` · lần ${l.lan}` : ''}</p>}
            </div>
            <p className="font-bubble text-[26px] font-extrabold text-[#F57C2B]">{tien(l.net)}đ</p>
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            {l.chi_tiet.lop.map((x) => (
              <div key={x.lop} className="rounded-2xl bg-[#F4F7FE] px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[14px] font-bold text-[#16224D]">Lớp {x.lop} {!x.la_chu && <Pill c="bg-[#EEF3FF] text-[#3B62C4]">dạy hộ</Pill>}</p>
                  <p className="text-[14px] font-bold text-[#16224D]">{tien(x.tien)}</p>
                </div>
                <p className="text-[12px] text-[#63709A]">Sĩ số TB {so(x.si_tb)} · bậc {tien(x.bac)}đ</p>
                <p className="text-[12px] text-[#63709A]">Trợ giảng {x.tg_lam}/{x.so_buoi} buổi ({so(x.ti_le_tg * 100)}%) · BTVN {x.btvn_lam}/{x.btvn_dinh_muc} lần ({so(x.ti_le_btvn * 100)}%)</p>
              </div>
            ))}
            {bt && (
              <div className="rounded-2xl bg-[#F4F7FE] px-3 py-2">
                <div className="flex items-baseline justify-between gap-2"><p className="text-[14px] font-bold text-[#16224D]">Bổ trợ</p><p className="text-[14px] font-bold text-[#16224D]">{tien(l.bo_tro_tien)}</p></div>
                <p className="text-[12px] text-[#63709A]">{so(bt.gio)}/{so(bt.chi_tieu)} giờ ({bt.so_lop} lớp × {so(bt.chi_tieu_moi_lop)} giờ){bt.ti_le != null ? ` · ${so(bt.ti_le * 100)}%` : ''}</p>
              </div>
            )}
            {l.chi_tiet.ngoai_package.map((x, i) => (
              <p key={i} className="rounded-2xl bg-[#F4F7FE] px-3 py-2 text-[12.5px] text-[#16224D]">
                {tenLoai[x.loai] ?? x.loai}{x.lop ? ' ' + x.lop : ''} · {ddmmVN(x.ngay)} · {so(x.so_luong)} × {x.thieu_don_gia ? 'chưa có đơn giá' : tien(x.don_gia ?? 0) + 'đ'}
              </p>
            ))}
            {l.chi_tiet.ngoai_package.length > 0 && <div className="flex justify-between px-3 text-[13px] font-bold text-[#16224D]"><span>Ngoài package</span><span>{tien(l.ngoai_package)}</span></div>}
            {Number(l.tien_phat) > 0 && <div className="flex justify-between rounded-2xl bg-[#FFE4EA] px-3 py-2 text-[13px] font-bold text-[#C0355A]"><span>Phạt (gậy đã chốt)</span><span>−{tien(l.tien_phat)}</span></div>}
          </div>
          <p className="mt-2 text-[11.5px] text-[#63709A]">{l.da_chot ? 'Tháng này đã chốt: số liệu cố định, công của tháng không sửa được nữa. Thấy sai thì báo quản lý để mở lại kỳ.' : 'Chỉ tính việc đã duyệt thuộc ca đã duyệt. Số có thể còn thay đổi tới khi quản lý chốt kỳ (sau ngày 3 tháng sau).'} BTVN lấy thẳng từ bài bạn đã chấm trên ERP, không cần ghi công.</p>
        </div>
      )}
    </div>
  )
}
