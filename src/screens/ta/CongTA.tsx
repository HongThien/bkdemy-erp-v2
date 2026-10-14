// CongTA — CHẤM CÔNG của TA trên app (spec-cham-cong-ta.md §4, mockup design/mockup-cham-cong-ta.html, Thùy duyệt 14/10).
// 3 tab: Hôm nay (Checkin/Checkout · việc theo lịch → "Ghi công" · việc đã ghi · thêm việc ngoài lịch · khai bù ngày khác)
//        · Bảng công (theo tháng, đối chiếu + trạng thái duyệt) · Lương tạm tính (chỉ phần đã duyệt).
// Mọi luật ở DB (lib/tacong.ts): lớp mặc định theo phân công TẠI NGÀY, 24 giờ / đợt khai lùi tháng 10, khớp lịch, làm hộ ai.
// Sau mỗi thao tác: quét lại NỀN, giữ nguyên danh sách đang hiện (không trắng màn — CLAUDE.md §2 React).
import { useEffect, useMemo, useState } from 'react'
import SearchSelect from '../../components/SearchSelect'
import { BKTabHeader, BKSegmented } from '../../components/bk/BKUI'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay, ngayCuaTs } from '../../lib/tuan'
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

export default function CongTA({ nsId, onBack, onDoi }: { nsId: string; onBack: () => void; onDoi?: () => void }) {
  const [tab, setTab] = useState<Tab>('nay')
  return (
    <div>
      <BKTabHeader icon={A('pr_calendar')} title="Chấm công" sub="Checkin · ghi công · bảng công · lương tạm tính" onBack={onBack} />
      <div className="mx-auto flex max-w-[640px] flex-col gap-2 px-2 pb-6">
        <BKSegmented value={tab} onChange={setTab} items={[{ key: 'nay', label: 'Hôm nay' }, { key: 'bang', label: 'Bảng công' }, { key: 'luong', label: 'Lương tạm tính' }]} />
        {tab === 'nay' && <HomNay onDoi={onDoi} />}
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

// ── TAB HÔM NAY (+ khai bù ngày khác) ──
function HomNay({ onDoi }: { onDoi?: () => void }) {
  const homNay = homNayVN()
  const [ngay, setNgay] = useState(homNay)          // ngày đang xem/ghi: hôm nay, hoặc ngày khai bù
  const laHomNay = ngay === homNay
  const [dong, setDong] = useState<DongCong[] | null>(null)
  const [goiY, setGoiY] = useState<GoiY[]>([])
  const [khoang, setKhoang] = useState<KhoangKhaiBu[]>([])
  const [loai, setLoai] = useState<LoaiViec[]>([])
  const [lop, setLop] = useState<{ id: string; ten_lop: string; mon: string }[]>([])
  const [ban, setBan] = useState<string | null>(null)   // thao tác đang chạy
  const [moThem, setMoThem] = useState(false)
  const { setTb, el: thongBao } = useThongBao()

  const tai = async (d = ngay) => {
    const [c, g] = await Promise.all([congCuaToi(d, d), d === homNay ? goiYViec() : Promise.resolve([] as GoiY[])])
    setDong(c); setGoiY(g)
  }
  useEffect(() => {
    dsLoaiViec().then(setLoai).catch(() => {}); dsLop().then(setLop).catch(() => {}); khaiBuChoPhep().then(setKhoang).catch(() => {})
  }, [])
  // đổi NGÀY = đổi ngữ cảnh ⇒ xoá + tải lại; thao tác trong ngày ⇒ quét nền (tai) giữ list cũ
  useEffect(() => { setDong(null); setGoiY([]); setMoThem(false); tai(ngay).catch((e) => setTb({ ok: false, t: loiCua(e) })) }, [ngay]) // eslint-disable-line

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
  const ngayMin = khoang.reduce((m, k) => (k.tu < m ? k.tu : m), congNgay(homNay, -1))
  const dot = khoang.find((k) => k.han)

  return (
    <div className="flex flex-col gap-2">
      {thongBao}
      {/* chọn ngày: hôm nay / khai bù */}
      <div className="flex flex-wrap items-center gap-2 rounded-[20px] bg-white/90 px-3 py-2">
        <button onClick={() => setNgay(homNay)} className={`rounded-full px-3 py-1 text-[12.5px] font-bold ${laHomNay ? 'bg-[#2F73F6] text-white' : 'bg-[#EEF3FF] text-[#2F73F6]'}`}>Hôm nay</button>
        <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#63709A]">
          Khai bù ngày
          <input type="date" value={laHomNay ? '' : ngay} min={ngayMin} max={congNgay(homNay, -1)}
            onChange={(e) => e.target.value && setNgay(e.target.value)} className="rounded-lg border border-[#D6DEF0] bg-white px-2 py-1 text-[12.5px] text-[#16224D]" />
        </label>
        {dot?.han && <span className="text-[11px] text-[#63709A]">Đang mở khai lùi {ddmmVN(dot.tu)}–{ddmmVN(dot.den)}, hạn {gioVN(dot.han)} {ddmmVN(ngayCuaTs(new Date(dot.han).getTime()))}</span>}
      </div>

      {/* CA CÓ MẶT */}
      <div className="rounded-[22px] bg-white/90 p-3">
        <p className="font-bubble text-[17px] font-extrabold text-[#16224D]">{laHomNay ? 'Hôm nay' : 'Khai bù'} · {thuCuaNgay(ngay)} {ddmmVN(ngay)}</p>
        {dong === null ? <p className="py-2 text-[13px] text-[#63709A]">Đang tải…</p> : <>
          {cas.map((c) => <DongCa key={c.id} c={c} />)}
          {laHomNay && (caMo
            ? <button disabled={!!ban} onClick={() => chay('out', checkout, 'Đã checkout')} className="mt-2 w-full rounded-2xl bg-[#F57C2B] py-3.5 text-[17px] font-extrabold text-white active:scale-[.99] disabled:opacity-50">Checkout</button>
            : <button disabled={!!ban} onClick={() => chay('in', checkin, 'Đã checkin')} className="mt-2 w-full rounded-2xl bg-[#1E9E5A] py-3.5 text-[17px] font-extrabold text-white active:scale-[.99] disabled:opacity-50">{coCa ? 'Checkin ca mới' : 'Checkin'}</button>)}
          {!laHomNay && <KhaiBuCa coCaMo={cas.some((c) => !c.ra_at)} ban={!!ban} onLuu={(v, r) => chay('bu', () => khaiBuCa(ngay, v, r), `Đã khai bù ca ngày ${ddmmVN(ngay)}`)} />}
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
          <p className="font-bubble text-[16px] font-extrabold text-[#16224D]">Việc đã ghi công {laHomNay ? 'hôm nay' : 'ngày ' + ddmmVN(ngay)}</p>
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

function KhaiBuCa({ coCaMo, ban, onLuu }: { coCaMo: boolean; ban: boolean; onLuu: (vao: string, ra: string) => void }) {
  const [vao, setVao] = useState('17:00')
  const [ra, setRa] = useState('21:00')
  return (
    <div className="mt-2 rounded-2xl bg-[#F4F7FE] p-2.5">
      <p className="text-[12.5px] font-semibold text-[#63709A]">{coCaMo ? 'Ca ngày này chưa checkout — điền giờ checkout (giờ checkin giữ nguyên).' : 'Quên checkin/checkout ngày này? Khai giờ thật, quản lý sẽ duyệt như thường.'}</p>
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

// ── TAB LƯƠNG TẠM TÍNH (fn_ta_luong_thang — chỉ việc đã duyệt thuộc ca đã duyệt) ──
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
            <p className="font-bubble text-[16px] font-extrabold text-[#16224D]">Tạm tính</p>
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
          <p className="mt-2 text-[11.5px] text-[#63709A]">Chỉ tính việc đã duyệt thuộc ca đã duyệt. BTVN lấy thẳng từ bài bạn đã chấm trên ERP, không cần ghi công.</p>
        </div>
      )}
    </div>
  )
}
