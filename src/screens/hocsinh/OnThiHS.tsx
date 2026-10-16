// ============================================================================
// OnThiHS — Box "Ôn thi giữa kì I" (Thùy 16/10): 2 tab ĐỀ CƯƠNG · ĐỀ THI CÁC TRƯỜNG.
// Chỉ XEM (đọc đề + đáp án + lời giải), không chấm, không đo mastery. Dữ liệu = Kho đề thi, chỉ đề ĐÃ DUYỆT đúng khối em
// (RPC fn_hs_on_thi_ds / fn_hs_on_thi_xem). Danh sách = menu (ManHS); bấm 1 đề ⇒ màn đọc riêng (ManDocHS) — STYLE-HS §2.
// ============================================================================
import { useEffect, useState } from 'react'
import { MathText } from '../kho/ui'
import { onThiDs, onThiXem, onThiLuyenSinh, onThiBatDau, type DeOnThi, type DeOnThiXem, type CauOnThi, type TabOnThi } from '../../lib/onthi'
import { ManHS, DauTrangHS, TheHS, NutHS, NhanHS, TrongHS, MAU, HEAD, ManDocHS, TheDocHS, ChipDocHS, KhoiDocHS, TrongDocHS } from './skin/KhungHS'
import { mauDocMon } from './skin/registry'
import HuongDanThiThuHS from './HuongDanThiThuHS'

// Nhớ tab đang xem khi rời màn (vd vào Luyện tập rồi quay lại) — sống tới F5 (CLAUDE §2 "rời màn quay lại = đúng chỗ cũ").
const NHO: { tab: TabOnThi } = { tab: 'de_cuong' }

// Hướng dẫn Thi thử: tự hiện LẦN ĐẦU (nhớ ở trình duyệt — chỉ là tiện lợi của riêng em, mất cũng chỉ hiện lại).
const KHOA_HD = 'bk_hd_thi_thu_da_xem'
const daXemHD = () => { try { return localStorage.getItem(KHOA_HD) === '1' } catch { return true } }
const ghiDaXemHD = () => { try { localStorage.setItem(KHOA_HD, '1') } catch { /* bỏ qua */ } }

const TAB: { id: TabOnThi; ten: string; trong: string }[] = [
  { id: 'de_cuong', ten: 'Đề cương', trong: 'Chưa có đề cương giữa kì I cho khối của em.' },
  { id: 'de_thi', ten: 'Đề thi các trường', trong: 'Chưa có đề thi các trường cho khối của em.' },
]

export default function OnThiHS({ mon, onBack, onLuyen, onThi }: { mon: string; onBack: () => void; onLuyen: (baiTestId: string) => void; onThi: (baiTestId: string) => void }) {
  const [ds, setDs] = useState<DeOnThi[] | null | 'loi'>(null)
  const [tab, setTab] = useState<TabOnThi>(NHO.tab)
  const [mo, setMo] = useState<DeOnThi | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [hoiThi, setHoiThi] = useState<DeOnThi | null>(null) // popup xác nhận trước khi vào Thi thử
  const [xemHD, setXemHD] = useState(false) // đang xem hướng dẫn (lần đầu tự bật; xem lại bằng nút)

  async function luyen(d: DeOnThi) {
    setBusy(d.id); setLoi(null)
    try { onLuyen((await onThiLuyenSinh(d.id)).baiTestId) }
    catch (e: any) { setLoi(e?.message ?? 'Không mở được bài luyện.'); setBusy(null) }
  }

  useEffect(() => { NHO.tab = tab }, [tab])

  async function thi(d: DeOnThi) {
    setBusy(d.id); setLoi(null); setHoiThi(null)
    try { onThi((await onThiBatDau(d.id)).baiTestId) }
    catch (e: any) { setLoi(e?.message ?? 'Không mở được bài thi.'); setBusy(null) }
  }

  useEffect(() => {
    let bo = false
    setDs(null)
    onThiDs(mon).then((r) => { if (!bo) setDs(r) }).catch(() => { if (!bo) setDs('loi') })
    return () => { bo = true }
  }, [mon])

  if (mo) return <DocDe de={mo} mon={mon} onBack={() => setMo(null)} />

  const hien = Array.isArray(ds) ? ds.filter((d) => d.tab === tab) : []
  return (
    <ManHS>
      <DauTrangHS tieuDe="Ôn thi giữa kì I" phu={`Môn ${mon}`} onBack={onBack} />
      <div className="flex gap-2">
        {TAB.map((t) => (
          <NutHS key={t.id} phu={tab !== t.id} onClick={() => setTab(t.id)} className="flex-1">
            {t.ten}{Array.isArray(ds) ? ` (${ds.filter((d) => d.tab === t.id).length})` : ''}
          </NutHS>
        ))}
      </div>
      {loi && <TrongHS>{loi}</TrongHS>}
      {ds === null ? <TrongHS>Đang tải…</TrongHS>
        : ds === 'loi' ? <TrongHS>Không tải được. Em thử lại sau nhé.</TrongHS>
        : hien.length === 0 ? <TrongHS>{TAB.find((t) => t.id === tab)!.trong}</TrongHS>
        : <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hien.map((d) => (
              <TheHS key={d.id} className="flex flex-col gap-2 p-4">
                <span className="text-[18px] font-bold leading-snug" style={HEAD}>{d.ten}</span>
                <span className="flex flex-wrap items-center gap-1.5">
                  {d.nguon && d.nguon !== 'le' && <NhanHS>{d.nguon}</NhanHS>}
                  {d.nam && <NhanHS mau={MAU.muted}>{d.nam}</NhanHS>}
                  <NhanHS mau={MAU.muted}>{d.so_cau} câu</NhanHS>
                </span>
                <span className="mt-1 flex gap-2">
                  {d.tab === 'de_cuong' && <NutHS onClick={() => luyen(d)} tat={busy !== null} className="flex-1">{busy === d.id ? 'Đang mở…' : 'Luyện tập'}</NutHS>}
                  {d.tab === 'de_thi' && <NutHS onClick={() => (d.bai_thi_id ? thi(d) : (setXemHD(!daXemHD()), setHoiThi(d)))} tat={busy !== null} className="flex-1">{busy === d.id ? 'Đang mở…' : d.da_nop ? 'Xem lại bài thi' : d.bai_thi_id ? 'Làm tiếp' : 'Thi thử'}</NutHS>}
                  {/* Đề thi: KHÔNG có "Xem đề" — xem trước đáp án thì điểm xếp hạng mất ý nghĩa. */}
                  {d.tab === 'de_cuong' && <NutHS phu onClick={() => setMo(d)} className="flex-1">Xem đề</NutHS>}
                </span>
              </TheHS>
            ))}
          </div>}
      {hoiThi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={() => setHoiThi(null)}>
          <TheHS className="flex w-full max-w-md flex-col gap-3 p-5">
            {xemHD ? <span onClick={(e) => e.stopPropagation()}><HuongDanThiThuHS onXong={() => { ghiDaXemHD(); setXemHD(false) }} /></span> :
            <span onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3">
              <span className="text-[20px] font-bold leading-snug" style={HEAD}>Sẵn sàng thi thử?</span>
              <span className="text-[16px] leading-relaxed" style={{ color: MAU.ink }}>Làm đề thi sẽ mất <b>{hoiThi.thoi_gian_phut} phút</b>. Điểm thi sẽ dùng xếp hạng và nhận quà. Em đã sẵn sàng chưa?</span>
              <span className="flex gap-2">
                <NutHS phu onClick={() => setHoiThi(null)} className="flex-1">Để sau</NutHS>
                <NutHS onClick={() => thi(hoiThi)} className="flex-1">Sẵn sàng</NutHS>
              </span>
              <button onClick={() => setXemHD(true)} className="text-[14.5px] underline" style={{ color: MAU.muted }}>Xem hướng dẫn làm bài</button>
            </span>}
          </TheHS>
        </div>
      )}
    </ManHS>
  )
}

function DocDe({ de, mon, onBack }: { de: DeOnThi; mon: string; onBack: () => void }) {
  const [x, setX] = useState<DeOnThiXem | null | 'loi' | undefined>(undefined)
  useEffect(() => {
    let bo = false
    onThiXem(de.id).then((r) => { if (!bo) setX(r) }).catch(() => { if (!bo) setX('loi') })
    return () => { bo = true }
  }, [de.id])
  return (
    <ManDocHS onBack={onBack} mau={mauDocMon(mon)} duong={`Ôn thi giữa kì I › ${de.tab === 'de_cuong' ? 'Đề cương' : 'Đề thi các trường'}`}>
      {x === undefined ? <TrongDocHS icon="⏳" tieuDe="Đang tải đề…" />
        : x === 'loi' ? <TrongDocHS icon="⚠️" tieuDe="Không tải được đề" moTa="Em thử lại sau nhé." />
        : x === null ? <TrongDocHS icon="🔒" tieuDe="Đề này chưa mở cho em" />
        : <>
            <TheDocHS chip={<><ChipDocHS dac>{de.tab === 'de_cuong' ? 'Đề cương' : 'Đề thi'}</ChipDocHS>{de.nam && <ChipDocHS>{de.nam}</ChipDocHS>}</>} tieuDe={x.ten}
              tomTat={<span>{de.so_cau} câu · có đáp án và lời giải để em tự đối chiếu.</span>} />
            {x.phans.map((p, i) => (
              <TheDocHS key={i} tieuDe={p.tieu_de || `Phần ${i + 1}`}>
                {p.cau.map((c) => <CauDoc key={c.ma_cau} c={c} />)}
              </TheDocHS>
            ))}
          </>}
    </ManDocHS>
  )
}

const chu = (i: number) => 'ABCDEFGH'[i] ?? String(i + 1)

function CauDoc({ c }: { c: CauOnThi }) {
  const [hien, setHien] = useState(false)
  const tn = c.loai_cau === 'trac_nghiem' && c.lua_chon?.length
  const ds = c.loai_cau === 'dung_sai' && c.menh_de?.length
  return (
    <KhoiDocHS nhan={`Câu ${c.stt}`} kieu="vi_du">
      {c.noi_dung && <MathText>{c.noi_dung}</MathText>}
      {c.anh_de && <img src={c.anh_de} alt="hình đề" className="my-2 max-h-72 rounded-lg bg-white" />}
      {tn ? <ul className="mt-2 flex flex-col gap-1">{c.lua_chon!.map((o, i) => <li key={i} className="flex gap-2"><b>{chu(i)}.</b><MathText>{o.replace(/^[A-H][.)]\s*/, '')}</MathText></li>)}</ul> : null}
      {ds ? <ul className="mt-2 flex flex-col gap-1">{c.menh_de!.map((m, i) => <li key={i} className="flex gap-2"><b>{'abcd'[i] ?? i + 1})</b><MathText>{m.noi_dung}</MathText></li>)}</ul> : null}
      <button onClick={() => setHien((v) => !v)} className="mt-3 rounded-full px-3 py-1 text-[14px] font-bold" style={{ background: 'var(--doc-nhat)', color: 'var(--doc-acc)' }}>
        {hien ? 'Ẩn đáp án' : 'Xem đáp án'}
      </button>
      {hien && (
        <div className="mt-2 flex flex-col gap-2">
          {ds
            ? <p><b>Đáp án:</b> {c.menh_de!.map((m, i) => `${'abcd'[i] ?? i + 1}) ${m.dap_an === 'D' ? 'Đúng' : 'Sai'}`).join(' · ')}</p>
            : c.dap_an ? <p><b>Đáp án:</b> <MathText>{c.dap_an}</MathText></p> : <p style={{ color: 'var(--sk-doc-muted)' }}>Câu này chưa có đáp án.</p>}
          {c.loi_giai && <div><b>Lời giải:</b><MathText>{c.loi_giai}</MathText></div>}
          {c.anh_dap_an && <img src={c.anh_dap_an} alt="hình lời giải" className="max-h-72 rounded-lg bg-white" />}
        </div>
      )}
    </KhoiDocHS>
  )
}
