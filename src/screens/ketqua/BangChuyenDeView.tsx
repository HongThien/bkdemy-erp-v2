// KẾT QUẢ THEO CHUYÊN ĐỀ của 1 kỳ thi (MT / khảo sát) — Thùy 23/10. Kết quả học tập › Điểm thi.
// Chọn môn → đề (gốc, mọi lớp đã gán) → bảng: Tên · Lớp · mỗi chuyên đề 1 cột (% đạt = điểm đạt / điểm tối đa các câu
// thuộc chuyên đề) · Điểm (MT/khảo sát) · Xếp hạng (trên cả đề). Mọi con số từ DB (fn_mt_bang_chuyen_de); client chỉ
// lọc lớp + sắp xếp theo cột đang bấm (§2.0). Giai đoạn chuyển giao: CHUYÊN ĐỀ CŨ; xong bản đồ mới đổi nguồn ở hàm DB.
import { useEffect, useState, type CSSProperties } from 'react'
import { dsDeDaThi, bangChuyenDe, type DeDaThi, type BangCD, type BangCDCot, type BangCDHS } from '../../lib/chamMT'

const MON = ['Toán', 'KHTN']
// Bề rộng cột (px): chuyên đề tối thiểu COT_MIN rồi giãn đều theo màn; các cột còn lại cố định.
const COT_TEN = 190, COT_LOP = 60, COT_DIEM = 64, COT_HANG = 64, COT_MIN = 92
// Rời tab quay lại = đúng chỗ cũ (CLAUDE §React).
type Cap = 'chuyen_de' | 'chu_de'
const NHO: { mon: string; deId: string | null; lopId: string | null; cap: Cap; sap: { cot: string; tang: boolean }; huong: Huong } = { mon: 'Toán', deId: null, lopId: null, cap: 'chuyen_de', sap: { cot: 'hang', tang: true }, huong: 'ngang' }

const mauPct = (p: number | undefined) => p == null ? 'bg-slate-50 text-slate-300'
  : p >= 80 ? 'bg-emerald-100 text-emerald-800' : p >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
const nhanLoai = (v: string | null) => v === 'khao_sat_giua_thang' ? 'Khảo sát' : v === 'khao_sat_thang' ? 'MT' : v === 'test_dau_vao' ? 'Test đầu vào' : v === 'thi_thu' ? 'Thi thử' : v === 'luyen' ? 'Luyện' : 'MT'

export default function BangChuyenDeView() {
  const [mon, setMon] = useState(NHO.mon)
  const [des, setDes] = useState<DeDaThi[]>([])
  const [deId, setDeId] = useState<string | null>(NHO.deId)
  const [bang, setBang] = useState<BangCD | null>(null)
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [sap, setSap] = useState(NHO.sap)
  const [cap, setCap] = useState<Cap>(NHO.cap)
  const [huong, setHuong] = useState<Huong>(NHO.huong)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { Object.assign(NHO, { mon, deId, lopId, sap, cap, huong }) }, [mon, deId, lopId, sap, cap, huong])

  useEffect(() => {
    let alive = true
    setDes([])
    dsDeDaThi(mon).then((ds) => {
      if (!alive) return
      setDes(ds)
      if (!ds.some((d) => d.de_id === NHO.deId)) { setDeId(ds[0]?.de_id ?? null); setLopId(null) }
    }).catch((e) => alive && setLoi('Không tải được danh sách đề: ' + (e?.message ?? e)))
    return () => { alive = false }
  }, [mon])

  useEffect(() => {
    setBang(null); setLoi(null)
    if (!deId) return
    let alive = true
    setDangTai(true)
    bangChuyenDe(deId, cap).then((b) => { if (alive) setBang(b) })
      .catch((e) => alive && setLoi('Không tải được bảng: ' + (e?.message ?? e)))
      .finally(() => alive && setDangTai(false))
    return () => { alive = false }
  }, [deId, cap])

  const lops = bang ? [...new Map(bang.hs.map((h) => [h.lop_id, h.lop])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi', { numeric: true })) : []
  const hien = (bang?.hs ?? []).filter((h) => !lopId || h.lop_id === lopId)
  const giaTri = (h: BangCDHS, cot: string): number | string | null =>
    cot === 'ten' ? h.ten : cot === 'lop' ? h.lop : cot === 'diem' ? h.diem : cot === 'hang' ? h.hang : (h.o[cot] ?? null)
  const sapXep = [...hien].sort((a, b) => {
    const x = giaTri(a, sap.cot), y = giaTri(b, sap.cot)
    if (x == null && y == null) return a.ten.localeCompare(b.ten, 'vi')
    if (x == null) return 1
    if (y == null) return -1
    const s = typeof x === 'string' ? x.localeCompare(String(y), 'vi', { numeric: true }) : (x as number) - (y as number)
    return sap.tang ? s : -s
  })
  // Bấm cột: cột số (chuyên đề, điểm) mặc định cao → thấp; hạng/tên/lớp mặc định tăng dần.
  const bamCot = (cot: string) => setSap((s) => s.cot === cot ? { cot, tang: !s.tang } : { cot, tang: ['ten', 'lop', 'hang'].includes(cot) })
  const muiTen = (cot: string) => sap.cot === cot ? (sap.tang ? ' ▲' : ' ▼') : ''
  const de = des.find((d) => d.de_id === deId) ?? null
  const [dangXuat, setDangXuat] = useState<'anh' | 'pdf' | null>(null)
  async function xuat(kieu: 'anh' | 'pdf') {
    if (!bang) return
    setDangXuat(kieu); setLoi(null)
    try {
      const tenLop = lopId ? lops.find(([id]) => id === lopId)?.[1] ?? '' : ''
      await xuatBang(kieu, {
        tieuDe: de?.ten ?? 'Kết quả', phu: [de ? nhanLoai(de.loai_de) : null, de?.khoi ? `Khối ${de.khoi}` : null, tenLop ? `Lớp ${tenLop}` : 'Cả đề', cap === 'chu_de' ? 'Theo chủ đề' : 'Theo chuyên đề'].filter(Boolean).join(' · '),
        cot: bang.cot, hs: sapXep, capTen: cap === 'chu_de' ? 'chủ đề' : 'chuyên đề',
        tenFile: `KetQua_${(de?.ten ?? 'de').replace(/[^\p{L}\p{N}]+/gu, '_')}_${tenLop || 'CaDe'}_${cap === 'chu_de' ? 'ChuDe' : 'ChuyenDe'}${huong === 'doc' ? '_Doc' : ''}`, huong,
      })
    } catch (e) {
      const m = (e as { message?: string })?.message ?? String(e)
      setLoi(/dynamically imported module|Importing a module script failed/i.test(m) ? 'Hệ thống vừa có bản mới — bấm F5 tải lại trang rồi xuất lại.' : 'Xuất không được: ' + m)
    } finally { setDangXuat(null) }
  }
  const th = 'sticky top-0 z-10 cursor-pointer select-none border-b border-slate-200 bg-slate-50 px-2 py-2 align-top text-[11px] font-semibold text-slate-600 hover:bg-slate-100'

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {MON.map((m) => <button key={m} onClick={() => setMon(m)} className={`h-7 rounded-md px-3 text-[13px] font-semibold ${mon === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{m}</button>)}
        <select value={deId ?? ''} onChange={(e) => { setDeId(e.target.value || null); setLopId(null) }} className="h-8 min-w-[360px] rounded border border-slate-300 bg-white px-2 text-[13px]">
          {des.length === 0 && <option value="">Chưa có đề nào đã chấm</option>}
          {des.map((d) => <option key={d.de_id} value={d.de_id}>{d.ten} · {nhanLoai(d.loai_de)}{d.khoi ? ` · K${d.khoi}` : ''} · {d.so_lop} lớp · {d.ngay_moi.split('-').reverse().slice(0, 2).join('/')}</option>)}
        </select>
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {([['chuyen_de', 'Chuyên đề'], ['chu_de', 'Chủ đề']] as [Cap, string][]).map(([v, l]) => (
            <button key={v} onClick={() => { setCap(v); if (sap.cot !== 'ten' && sap.cot !== 'lop' && sap.cot !== 'diem' && sap.cot !== 'hang') setSap({ cot: 'hang', tang: true }) }}
              className={`h-8 px-3 text-[12.5px] font-semibold ${cap === v ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}>{l}</button>
          ))}
        </div>
        {bang && bang.hs.length > 0 && (
          <div className="ml-auto flex items-center gap-1">
            <div className="mr-1 flex overflow-hidden rounded-md ring-1 ring-slate-200" title="Khổ bản xuất: Ngang (máy tính, in) · Dọc (gửi điện thoại)">
              {([['ngang', 'Ngang'], ['doc', 'Dọc 📱']] as [Huong, string][]).map(([v, l]) => (
                <button key={v} onClick={() => setHuong(v)} className={`h-8 px-2.5 text-[12px] font-semibold ${huong === v ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}>{l}</button>
              ))}
            </div>
            {(['anh', 'pdf'] as const).map((k) => (
              <button key={k} disabled={!!dangXuat} onClick={() => xuat(k)}
                className="h-8 rounded-md border border-slate-300 bg-white px-3 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                {dangXuat === k ? 'Đang xuất…' : k === 'anh' ? '⬇ Ảnh' : '⬇ PDF'}
              </button>
            ))}
          </div>
        )}
        {bang && <span className="text-[12px] text-slate-500">{bang.hs.length} HS đã chấm · {bang.so_co_diem} có điểm tổng · {bang.cot.length} {cap === 'chu_de' ? 'chủ đề' : 'chuyên đề'}</span>}
      </div>
      {lops.length > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Lớp</span>
          <button onClick={() => setLopId(null)} className={`h-7 rounded-md px-3 text-[12px] font-semibold ${!lopId ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>Cả đề</button>
          {lops.map(([id, ten]) => <button key={id} onClick={() => setLopId(id)} className={`h-7 rounded-md px-3 text-[12px] font-semibold ${lopId === id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>{ten}</button>)}
        </div>
      )}
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {dangTai ? <p className="text-sm text-slate-500">Đang tính bảng…</p>
        : !bang ? null
        : bang.hs.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Đề này chưa có HS nào được chấm.</div>
        : (
          <>
            <div className="max-h-[calc(100vh-280px)] overflow-auto rounded-xl border border-slate-200 bg-white">
              {/* 23/10 (Thùy): bảng GIÃN theo màn — cột chuyên đề chia đều phần rộng còn lại, tối thiểu COT_MIN; Tên/Lớp/Điểm/Hạng
                  cố định. Màn hẹp hơn tổng tối thiểu ⇒ bảng giữ tối thiểu và cuộn ngang (table-fixed + minWidth). */}
              <table className="w-full table-fixed border-separate border-spacing-0 text-[12.5px]" style={{ minWidth: COT_TEN + COT_LOP + COT_DIEM + COT_HANG + bang.cot.length * COT_MIN }}>
                <colgroup>
                  <col style={{ width: COT_TEN }} /><col style={{ width: COT_LOP }} />
                  {bang.cot.map((c) => <col key={c.ma} />)}
                  <col style={{ width: COT_DIEM }} /><col style={{ width: COT_HANG }} />
                </colgroup>
                <thead>
                  <tr>
                    <th onClick={() => bamCot('ten')} className={`${th} sticky left-0 z-20 text-left`}>Tên{muiTen('ten')}</th>
                    <th onClick={() => bamCot('lop')} className={`${th} text-left`}>Lớp{muiTen('lop')}</th>
                    {bang.cot.map((c) => (
                      <th key={c.ma} onClick={() => bamCot(c.ma)} title={`${c.ten} (${c.ma})`} className={th}>
                        <div className="mb-0.5 text-center"><TagCap nc={c.nang_cao} nho /></div>
                        <div className="line-clamp-3 text-center leading-tight">{c.ten}{muiTen(c.ma)}</div>
                      </th>
                    ))}
                    <th onClick={() => bamCot('diem')} className={`${th} text-center`}>Điểm{muiTen('diem')}</th>
                    <th onClick={() => bamCot('hang')} className={`${th} text-center`}>Hạng{muiTen('hang')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sapXep.map((h) => (
                    <tr key={h.id} className="hover:bg-indigo-50/30">
                      <td title={h.ten} className="sticky left-0 z-[5] truncate border-b border-slate-100 bg-white px-2 py-1 font-medium text-slate-800">{h.ten}</td>
                      <td className="truncate border-b border-slate-100 px-2 py-1 text-slate-600">{h.lop}</td>
                      {bang.cot.map((c) => (
                        <td key={c.ma} className="border-b border-slate-100 px-1 py-0.5 text-center">
                          <OPct p={h.o[c.ma]} />
                        </td>
                      ))}
                      <td className="border-b border-slate-100 px-2 py-1 text-center font-mono font-semibold text-slate-800">{h.diem == null ? <span className="text-slate-300">—</span> : h.diem}</td>
                      <td className="border-b border-slate-100 px-2 py-1 text-center font-semibold text-indigo-700">{h.hang == null ? <span className="text-slate-300">—</span> : `#${h.hang}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400">
              {de ? `${de.ten} · ` : ''}% đạt = điểm đạt / điểm tối đa các câu thuộc {cap === 'chu_de' ? 'chủ đề' : 'chuyên đề'} (câu chưa chấm hoặc câu C chưa chọn điểm chưa tính; ý Hình của đề chỉ đặt điểm cả bài tính theo cả bài).
              Xếp hạng trên cả đề (mọi lớp), lọc lớp chỉ để xem. {cap === 'chu_de' ? 'Chủ đề theo bản đồ cũ — Hình học chưa có chủ đề cũ: lấy chủ đề mới nếu đã gắn, chưa gắn gom "Hình học".' : 'Chuyên đề theo bản đồ cũ — bài Hình mô hình gom theo mô hình.'}
            </p>
          </>
        )}
    </div>
  )
}

// Ô % đạt — dùng chung cho màn và bản xuất (đổi kiểu ô chỉ sửa 1 chỗ).
function OPct({ p }: { p: number | undefined }) {
  return <span className={`inline-block w-full rounded px-1 py-0.5 font-semibold tabular-nums ${mauPct(p)}`}>{p == null ? '—' : `${p}%`}</span>
}

// ── XUẤT ẢNH / PDF (Thùy 23/10: "có tính năng xuất ảnh/pdf để gửi") ──────────────────────────────
// Dựng bản in (đủ mọi dòng, không cuộn/không dính) theo đúng lọc lớp + thứ tự đang xem, render thật ở top:0 rồi PHỦ trắng che
// (cùng cách PhieuThongBao: toạ độ âm làm html2canvas đo sai), chụp bằng html2canvas-pro. PDF = A4, cắt theo DÒNG,
// trang sau lặp lại tiêu đề + đầu bảng.
// Lượt 2 (Thùy 23/10: "chữ quá bé, gửi PH không đọc được" + "cần bản dọc cho điện thoại"): bề rộng cột tính theo CỠ CHỮ (đơn vị
// F), không theo px cố định ⇒ trang co về A4 thì chữ vẫn to. Bản DỌC: cột chuyên đề chỉ ghi số thứ tự (1, 2, …) + chú giải tên ở
// trên bảng, lớp ghi dưới tên em — bỏ được 1 cột, đủ chỗ cho khổ dọc.
type Huong = 'ngang' | 'doc'
type XuatInput = { tieuDe: string; phu: string; cot: BangCDCot[]; hs: BangCDHS[]; capTen: string; tenFile: string; huong: Huong }
const F = 18 // px — cỡ chữ ô; mọi bề rộng là bội của F
const KHUON = {
  ngang: { ten: 11, lop: 3.5, cd: 5.5, diem: 3.8, hang: 3.8, toiThieu: 44 },
  doc: { ten: 12, lop: 0, cd: 4.2, diem: 3.6, hang: 3.4, toiThieu: 48 }, // Thùy 23/10: bản dọc 30F chữ to quá ⇒ ~48F (≈11pt trên A4)
}
function TagCap({ nc, nho, ngan }: { nc?: boolean; nho?: boolean; ngan?: boolean }) {
  return <span className={`inline-block rounded px-1 font-semibold leading-snug ${nho ? 'text-[9.5px]' : ''} ${nc ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'}`}>{ngan ? (nc ? 'NC' : 'CB') : nc ? 'Nâng cao' : 'Cơ bản'}</span>
}
function BangIn({ x }: { x: XuatInput }) {
  const k = KHUON[x.huong], doc = x.huong === 'doc'
  const rong = Math.max(k.toiThieu, k.ten + k.lop + k.diem + k.hang + x.cot.length * k.cd) * F
  const v = new Date(Date.now() + 7 * 3600 * 1000) // giờ VN, đọc phần UTC (không toISOString — CLAUDE §2)
  const ngay = `${String(v.getUTCDate()).padStart(2, '0')}/${String(v.getUTCMonth() + 1).padStart(2, '0')}/${v.getUTCFullYear()}`
  const cel: CSSProperties = { borderBottom: '1px solid #e2e8f0', padding: `${F * 0.35}px ${F * 0.3}px` }
  const dau: CSSProperties = { ...cel, borderTop: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: F * 0.72, verticalAlign: 'top', lineHeight: 1.2 }
  return (
    <div style={{ width: rong + 2 * F, padding: F, background: '#fff', fontFamily: 'inherit', fontSize: F, color: '#1e293b' }}>
      <div data-dau="1">
        <div style={{ fontSize: F * 1.45, fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>{x.tieuDe}</div>
        <div style={{ fontSize: F * 0.8, color: '#64748b', marginBottom: F * 0.6 }}>{x.phu} · {x.hs.length} học sinh · xuất {ngay}</div>
        {doc && (
          <div style={{ display: 'grid', gridTemplateColumns: x.cot.length > 4 ? '1fr 1fr' : '1fr', gap: `${F * 0.2}px ${F * 0.8}px`, fontSize: F * 0.78, marginBottom: F * 0.6 }}>
            {x.cot.map((c, i) => (
              <div key={c.ma} style={{ display: 'flex', gap: F * 0.35, alignItems: 'baseline' }}>
                <b style={{ minWidth: F * 1.1, color: '#4338ca' }}>{i + 1}.</b>
                <span>{c.ten} <TagCap nc={c.nang_cao} /></span>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1', color: '#94a3b8', fontSize: F * 0.7 }}>Đầu cột: CB = Cơ bản · NC = Nâng cao</div>
          </div>
        )}
      </div>
      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
        <colgroup>
          <col style={{ width: k.ten * F }} />{!doc && <col style={{ width: k.lop * F }} />}
          {x.cot.map((c) => <col key={c.ma} />)}
          <col style={{ width: k.diem * F }} /><col style={{ width: k.hang * F }} />
        </colgroup>
        <thead data-dau="1">
          <tr>
            <th style={{ ...dau, textAlign: 'left' }}>{doc ? 'Tên · Lớp' : 'Tên'}</th>
            {!doc && <th style={{ ...dau, textAlign: 'left' }}>Lớp</th>}
            {x.cot.map((c, i) => (
              <th key={c.ma} style={{ ...dau, textAlign: 'center' }}>
                <div style={{ marginBottom: F * 0.15 }}><TagCap nc={c.nang_cao} ngan={doc} /></div>
                {doc ? <span style={{ fontSize: F * 0.95, color: '#4338ca' }}>{i + 1}</span> : c.ten}
              </th>
            ))}
            <th style={{ ...dau, textAlign: 'center' }}>Điểm</th>
            <th style={{ ...dau, textAlign: 'center' }}>Hạng</th>
          </tr>
        </thead>
        <tbody>
          {x.hs.map((h) => (
            <tr key={h.id} data-dong="1">
              <td style={{ ...cel, fontWeight: 500, lineHeight: 1.2 }}>
                {h.ten}
                {doc && <div style={{ fontSize: F * 0.75, color: '#64748b', fontWeight: 400 }}>{h.lop}</div>}
              </td>
              {!doc && <td style={{ ...cel, color: '#475569' }}>{h.lop}</td>}
              {x.cot.map((c) => <td key={c.ma} style={{ ...cel, padding: `${F * 0.25}px ${F * 0.15}px`, textAlign: 'center' }}><OPct p={h.o[c.ma]} /></td>)}
              <td style={{ ...cel, textAlign: 'center', fontWeight: 600 }}>{h.diem ?? '—'}</td>
              <td style={{ ...cel, textAlign: 'center', fontWeight: 600, color: '#4338ca' }}>{h.hang == null ? '—' : `#${h.hang}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: F * 0.5, fontSize: F * 0.65, color: '#94a3b8' }}>% đạt = điểm đạt / điểm tối đa các câu thuộc {x.capTen}; câu chưa chấm chưa tính. Xếp hạng trên cả đề.</div>
    </div>
  )
}
async function xuatBang(kieu: 'anh' | 'pdf', x: XuatInput): Promise<void> {
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;top:0;left:0;z-index:9998;pointer-events:none'
  document.body.appendChild(host)
  const phu = document.createElement('div')
  phu.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#ffffff'
  document.body.appendChild(phu)
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(host)
  root.render(<BangIn x={x} />)
  await new Promise((r) => setTimeout(r, 250))
  try {
    const node = host.firstChild as HTMLElement
    const TL = 2
    const h2c = (await import('html2canvas-pro')).default
    const canvas = await h2c(node, { scale: TL, backgroundColor: '#ffffff', useCORS: true, logging: false, width: node.scrollWidth, height: node.scrollHeight, windowWidth: node.scrollWidth, windowHeight: node.scrollHeight })
    if (kieu === 'anh') {
      const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = x.tenFile + '.png'; a.click()
      return
    }
    // PDF A4 (ngang/dọc theo lựa chọn): cắt theo ranh giới DÒNG, trang sau lặp lại phần đầu (tiêu đề + chú giải + đầu bảng).
    const goc = node.getBoundingClientRect().top
    const dauCuoi = Math.max(...[...node.querySelectorAll('[data-dau]')].map((e) => e.getBoundingClientRect().bottom - goc)) * TL
    const dong = [...node.querySelectorAll('[data-dong]')].map((e) => (e.getBoundingClientRect().bottom - goc) * TL)
    const { jsPDF } = await import('jspdf')
    const doc = x.huong === 'doc'
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: doc ? 'portrait' : 'landscape' })
    const LE = 8, W = (doc ? 210 : 297) - 2 * LE, H = (doc ? 297 : 210) - 2 * LE
    const mmPx = W / canvas.width, trangPx = H / mmPx
    const cat = (y0: number, y1: number) => { const c = document.createElement('canvas'); c.width = canvas.width; c.height = Math.max(1, y1 - y0); c.getContext('2d')!.drawImage(canvas, 0, y0, canvas.width, y1 - y0, 0, 0, canvas.width, y1 - y0); return c }
    const dau = cat(0, dauCuoi)
    let tu = dauCuoi, trang = 0
    const het = canvas.height
    while (tu < het - 1) {
      const conCho = trangPx - dauCuoi
      let den = tu
      for (const d of dong) if (d > tu && d - tu <= conCho) den = d
      if (den === tu) den = Math.min(het, tu + conCho)
      if (den >= dong[dong.length - 1] - 1) den = het // dòng cuối ⇒ lấy luôn ghi chú dưới bảng
      if (trang > 0) pdf.addPage()
      pdf.addImage(dau.toDataURL('image/jpeg', 0.92), 'JPEG', LE, LE, W, dauCuoi * mmPx)
      const than = cat(tu, den)
      pdf.addImage(than.toDataURL('image/jpeg', 0.92), 'JPEG', LE, LE + dauCuoi * mmPx, W, (den - tu) * mmPx)
      tu = den; trang++
    }
    pdf.save(x.tenFile + '.pdf')
  } finally {
    phu.remove(); root.unmount(); host.remove()
  }
}
