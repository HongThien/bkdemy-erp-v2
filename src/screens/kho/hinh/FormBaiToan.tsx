// Form node lưới ③ (bài toán nhỏ). CHỈ mở từ M1/M2 (xây lưới) — M3 (gán bài) không có đường tới đây (§0.4).
//
// ⭐ MODEL (Thùy chốt, nới 08-14): bài toán mặc định KHÔNG có giả thiết/hình riêng — cả hai MƯỢN của
//   MÔ HÌNH. Nhưng không phải bài nào cũng tuyệt đối kế thừa: node được phép CỘNG THÊM hoặc THAY HẲN
//   giả thiết riêng (mirror quan hệ mô hình con-cha, xem `giaThietBaiToan` trong hinh.ts) — mặc định
//   vẫn mượn 100%, chỉ ai chủ động gõ mới lệch. Các bài toán trong một mô hình vẫn chủ yếu khác nhau ở
//   CÂU HỎI. Vì câu hỏi luôn dựa trên giả thiết ⇒ mỗi bài toán phải TRỰC TIẾP thuộc đúng 1 mô hình
//   (trường "Mô hình" bắt buộc).
//
// Bố cục: popup lớn 2 cột.
//   TRÁI  = ngữ cảnh (mô hình + giả thiết đầy đủ + cấp + hình mô hình) → rồi CÂU HỎI.
//   PHẢI  = lời giải + tiền đề (mặc định = bài toán phía trước, thêm được qua cây Mô hình›node) + bổ đề.
// Mọi ô chữ có công thức đều 2 cách nhập: gõ LaTeX hoặc 📋 dán ảnh → AI dịch (OcrButton).
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi } from '../../../lib/kho/hinh'
import { MathText, inp } from '../ui'
import { AnhInput, Btn, Cap, Fig, IngestBaiButton, Ma, OcrButton, tron } from './hinhUi'

export default function FormBaiToan({ L, moHinhMacDinh, sua, phatBieuGoi, tienDeMacDinh, onClose, onDone }: {
  L: Luoi
  moHinhMacDinh?: string | null
  sua?: BaiToan
  phatBieuGoi?: string          // mô tả từ hàng chờ điền sẵn (M5 → M2)
  tienDeMacDinh?: string        // "+ Tạo bài kế tiếp" từ 1 node cụ thể — ghim ĐÚNG node đó làm tiền đề
                                 // chính, thay vì để nodeTruoc() đoán theo cấp cao nhất trong mô hình.
  onClose: () => void
  onDone: () => Promise<void>
}) {
  const cachCu = sua ? api.cachMacDinh(L, sua.id) : null
  const [moHinhId, setMoHinhId] = useState(sua?.mo_hinh_id ?? moHinhMacDinh ?? L.moHinh[0]?.id ?? '')
  const [phatBieu, setPhatBieu] = useState(sua?.phat_bieu ?? phatBieuGoi ?? '')
  // Giả thiết phụ = dữ kiện lẻ của node (đa số là vẽ thêm "gọi I = AC∩BD"). Bám node: hiện ở đề nếu node
  // được hỏi, ở đầu bước nếu node ẩn trong đáp án. Đừng nhét dữ kiện chung ở đây (đó là giả thiết mô hình).
  const [giaThietPhu, setGiaThietPhu] = useState(sua?.gia_thiet_phu ?? '')
  // Giả thiết RIÊNG của node (khác gia_thiet_phu ở trên) — mirror mô hình con-cha: mặc định CỘNG THÊM
  // vào giả thiết mô hình, hoặc THAY hẳn (node tự đứng độc lập). Mặc định để trống = mượn 100% mô hình.
  const [gtRieng, setGtRieng] = useState(sua?.gia_thiet_rieng ?? '')
  const [gtThayThe, setGtThayThe] = useState(sua?.gt_thay_the ?? false)
  const [cap, setCap] = useState<number>(sua?.cap ?? 1)
  // Node MỚI: hệ ĐIỀN SẴN cấp = gợi ý (1 + max cấp tiền đề), vẫn sửa tay được. Node đang SỬA: giữ cấp cũ,
  // coi như người đã chốt (không auto-đè). Người gõ tay 1 lần → `capTuNhap` = true, hệ thôi điền lại.
  const [capTuNhap, setCapTuNhap] = useState(!!sua)
  const [dangId, setDangId] = useState(cachCu?.dang_id ?? '')
  const [loiGiai, setLoiGiai] = useState(cachCu?.loi_giai ?? '')
  const [anhGiai, setAnhGiai] = useState<string | null>(cachCu?.anh_loi_giai ?? null)
  // Hình: mặc định mượn của mô hình. Node bật "hình riêng" → tự vẽ (anh_chuan). Cùng mô hình không có
  // nghĩa hình giống hệt. anh_chuan null = dùng chung hình mô hình.
  const [dungHinhRieng, setDungHinhRieng] = useState<boolean>(!!sua?.anh_chuan)
  const [anhRieng, setAnhRieng] = useState<string | null>(sua?.anh_chuan ?? null)
  // Hình bước giải: mặc định = hình ĐỀ BÀI. Bật "hình riêng" khi bước giải cần hình có tô/kẻ thêm.
  const [dungHinhGiaiRieng, setDungHinhGiaiRieng] = useState<boolean>(!!cachCu?.anh_loi_giai)
  // Tiền đề: khi TẠO node, mặc định gắn "bài toán phía trước" (node cấp cao nhất đã có trong mô hình)
  // làm tiền đề CHÍNH. Người thêm/bớt tự do sau.
  const [tienDe, setTienDe] = useState<string[]>(() => {
    if (cachCu) return api.tienDeCuaCach(L, cachCu.id)
    if (tienDeMacDinh) return [tienDeMacDinh]
    const truoc = api.nodeTruoc(L, sua?.mo_hinh_id ?? moHinhMacDinh ?? '')
    return truoc ? [truoc.id] : []
  })
  const [boDe, setBoDe] = useState<string[]>(cachCu ? api.boDeCuaCach(L, cachCu.id) : [])
  // VAN "cho sẵn ở đề": tiền đề nào bật thì giả thiết phụ CỦA NÓ trồi lên ĐỀ của bài (giảm độ khó — HS
  // khỏi tự dựng). Tắt = giả thiết phụ chỉ hiện trong bước giải. Cờ đặt trên CẠNH tiền đề (keo_gt_phu).
  const [vanIds, setVanIds] = useState<Set<string>>(() =>
    cachCu ? new Set(L.tienDe.filter((t) => t.cach_id === cachCu.id && t.keo_gt_phu).map((t) => t.tien_de_id)) : new Set())
  const [themTd, setThemTd] = useState(false)   // mở cây chọn tiền đề
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [gan, setGan] = useState<BaiToan[]>([])

  // Dạng chọn được = LÁ của cây dạng: cách xử lý (cap='dang'), HOẶC loại câu hỏi chưa tách con
  // (loại chưa có cách xử lý con thì chính nó là dạng terminal). Nhờ vậy mọi dạng tạo ở M6 đều chọn được,
  // không bắt buộc phải luôn có tầng "cách xử lý".
  const dangLa = L.dang.filter((d) => d.cap === 'dang' || (d.cap === 'loai_ch' && !L.dang.some((x) => x.cha_id === d.id)))
  const maCap = useMemo(() => api.maPhanCapMap(L), [L])
  const giaThietMoHinh = api.giaThietDayDu(L, moHinhId)
  // ⭐ Nền kế thừa THẬT (Thùy 17/08): bài có tiền đề thì kế thừa giả thiết của tiền đề CHÍNH (cấp cao nhất
  // trong `tienDe` đang chọn — CÙNG quy tắc `chaKeThua()` mà SoanTaiLieu/HinhPrintView dùng lúc IN), không
  // phải mô hình. Trước đây ô xem trước này LUÔN gọi `giaThietDayDu(mô hình)` — sai với cái đã in ra thật,
  // khiến người sửa bài KHÔNG THẤY tiền đề tác động, tưởng vẫn kế thừa mô hình dù đã gắn tiền đề.
  // Không có tiền đề nào (mảng `tienDe` rỗng) → nền vẫn là mô hình (đúng hành vi khi không có "bài trước").
  const chaKeThuaChinh = useMemo(() => {
    const bts = tienDe.map((id) => L.baiToan.find((b) => b.id === id)).filter(Boolean) as BaiToan[]
    return bts.sort((a, b) => b.cap - a.cap || b.ma.localeCompare(a.ma))[0] ?? null
  }, [tienDe, L])
  const giaThietNen = chaKeThuaChinh ? api.giaThietBaiToan(L, chaKeThuaChinh.id) : giaThietMoHinh
  const giaThietFull = gtThayThe ? (gtRieng.trim() || giaThietNen) : [giaThietNen, gtRieng.trim()].filter(Boolean).join('; ')
  // ⭐ FIX (Thùy 28/08: "Hình của bài node sau phải được kế thừa mặc định từ node trước") — CÙNG LUẬT với
  // giả thiết ngay trên (chaKeThuaChinh): TRƯỚC đây nhảy thẳng lên hình MÔ HÌNH (anhCauHinhCua), bỏ qua
  // hình RIÊNG của chính node tiền đề (anh_chuan) — node cha có vẽ hình riêng khác hình mô hình thì node
  // con vẫn xem preview ra hình mô hình, sai với cái sẽ in ra thật (mọi nơi hiển thị khác đều dùng
  // anhCuaBaiToan() chạy qua chaKeThua trước, xem hinh.ts:198). Không có tiền đề nào ⇒ vẫn về hình mô hình.
  const anhNen = chaKeThuaChinh ? api.anhCuaBaiToan(L, chaKeThuaChinh.id) : api.anhCauHinhCua(L, moHinhId)
  // Hình ĐỀ BÀI đang hiệu lực (node có hình riêng thì lấy nó, không thì kế thừa) — làm mặc định cho bước giải.
  const anhDeHienTai = dungHinhRieng && anhRieng ? anhRieng : anhNen

  // Cấp gợi ý = 1 + max(cap tiền đề); không tiền đề ⇒ 1.
  const capGoi = useMemo(() => (tienDe.length ? 1 + Math.max(...tienDe.map((id) => L.baiToan.find((b) => b.id === id)?.cap ?? 0)) : 1), [tienDe, L])
  // Điền sẵn cấp = gợi ý cho tới khi người tự gõ (đổi tiền đề thì cấp tự cập nhật theo, khỏi sửa tay).
  useEffect(() => { if (!capTuNhap) setCap(capGoi) }, [capGoi, capTuNhap])

  // Search-before-create: gõ câu hỏi → hiện node gần giống trong cùng mô hình + cha/con (nhắc, không chặn).
  useEffect(() => {
    if (sua || phatBieu.trim().length < 3) { setGan([]); return }
    const q = phatBieu.trim()
    const t = setTimeout(() => {
      const scope = [moHinhId, ...api.chaCua(L, moHinhId), ...api.conCua(L, moHinhId)].filter(Boolean)
      api.searchBaiToan(q, scope).then(setGan).catch(() => setGan([]))
    }, 300)
    return () => clearTimeout(t)
  }, [phatBieu, moHinhId, sua, L])

  const luu = async () => {
    setSaving(true); setLoi(null)
    try {
      // Giả thiết luôn mượn của mô hình (de_bai_chuan = null). Hình: mặc định mượn mô hình; bật "hình riêng"
      // thì ghi anh_chuan của node (bỏ trống vẫn = null = mượn mô hình).
      const anhChuan = dungHinhRieng ? (anhRieng || null) : null
      let btId = sua?.id
      const gtPhu = giaThietPhu.trim() || null
      const gtRiengVal = gtRieng.trim() || null
      if (sua) await api.updateBaiToan(sua.id, { phat_bieu: phatBieu, mo_hinh_id: moHinhId, cap, de_bai_chuan: null, anh_chuan: anhChuan, gia_thiet_phu: gtPhu, gia_thiet_rieng: gtRiengVal, gt_thay_the: gtThayThe })
      else btId = (await api.createBaiToan({ phat_bieu: phatBieu, mo_hinh_id: moHinhId, cap, de_bai_chuan: null, anh_chuan: anhChuan, gia_thiet_phu: gtPhu, gia_thiet_rieng: gtRiengVal, gt_thay_the: gtThayThe })).id
      // Hình bước giải: mặc định null = mượn hình đề (mọi chỗ hiển thị fallback `anh_loi_giai ?? anhCuaBaiToan`).
      const anhLoiGiai = dungHinhGiaiRieng ? (anhGiai || null) : null
      // ⭐ 08-10 FIX BUG NGHIÊM TRỌNG: TRƯỚC đây khối này chỉ chạy `if (dangId)` — chưa chọn Dạng (hợp lệ,
      // UI cho phép "— chưa gắn dạng —") thì lời giải/tiền đề/bổ đề bị bỏ qua IM LẶNG, không lỗi, không
      // cảnh báo (Thùy báo "nhập bài toán ko lưu được đáp án"). Nặng hơn: `tienDe` MẶC ĐỊNH tự điền "bài
      // toán phía trước" cho node MỚI — quên chọn Dạng thì node mới còn KHÔNG NỐI được vào chuỗi tiền đề,
      // hỏng cấu trúc DAG âm thầm. Dạng là TAXONOMY (điền sau cũng được — mig dang_id nullable 08-10);
      // lời giải/tiền đề/bổ đề là CẤU TRÚC, PHẢI lưu được bất kể đã phân loại Dạng hay chưa — bỏ gate.
      {
        const cachId = cachCu
          ? (await api.updateCachGiai(cachCu.id, { dang_id: dangId || null, loi_giai: loiGiai || null, anh_loi_giai: anhLoiGiai }), cachCu.id)
          : (await api.createCachGiai({ baitoan_id: btId!, dang_id: dangId || null, ten: 'cách ngắn nhất', loi_giai: loiGiai || null, anh_loi_giai: anhLoiGiai, la_mac_dinh: true })).id
        await api.setTienDe(cachId, btId!, tienDe, vanIds)
        await api.setBoDeCuaCach(cachId, boDe)
      }
      await onDone(); onClose()
    } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
  }

  const themTienDe = (id: string) => setTienDe((a) => (a.includes(id) ? a : [...a, id]))
  const boTienDe = (id: string) => { setTienDe((a) => a.filter((x) => x !== id)); setVanIds((s) => { const n = new Set(s); n.delete(id); return n }) }
  const toggleVan = (id: string) => setVanIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex h-[92vh] w-[95vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">{sua ? `Sửa bài toán ${sua.ma}` : 'Bài toán mới trong mô hình'}</h3>
          <span className="text-[12px] text-slate-400">giả thiết mặc định mượn của mô hình, đặt riêng được · câu hỏi riêng · hình mặc định mượn, đặt riêng được</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>

        {/* Up cả bài (ảnh/PDF) → AI tách CÂU HỎI + LỜI GIẢI (giống mode biến thể). Hình vẫn dán tay. */}
        <div className="border-b border-slate-200 bg-indigo-50/40 px-5 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">✨ Up cả bài (ảnh/PDF) → AI tách đề + lời giải</span>
            <div className="ml-auto"><IngestBaiButton onResult={({ de_bai, loi_giai, anh: anhMoi }) => {
              const doiHinh = anhMoi && anhMoi !== anhRieng
              if ((phatBieu.trim() || loiGiai.trim() || doiHinh) && !confirm(`Ghi đè câu hỏi + lời giải${doiHinh ? ' + hình vẽ' : ''} hiện tại bằng bản AI tách?`)) return
              if (de_bai) setPhatBieu(de_bai)
              if (loi_giai) setLoiGiai(loi_giai)
              if (anhMoi) { setDungHinhRieng(true); setAnhRieng(anhMoi) }
            }} /></div>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-slate-500">AI đọc ảnh/PDF (nhiều trang được) → đổ <b>đề</b> vào ô Câu hỏi + <b>lời giải</b> vào ô Lời giải, tự nhận diện + cắt <b>hình vẽ</b> (nếu có, bật "hình riêng" luôn — bỏ tick nếu muốn mượn hình mô hình). Giả thiết đã mượn của mô hình — nếu bản tách lặp lại giả thiết ở đầu câu hỏi, xoá bớt phần đó rồi soát lại.</p>
        </div>

        {/* Thân — 2 cột */}
        <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-2">
          {/* ── TRÁI: ngữ cảnh + câu hỏi ── */}
          <div className="min-w-0 space-y-3 overflow-y-auto border-r border-slate-100 p-5">
            <Lbl>Mô hình <span className="font-normal normal-case text-slate-400">— bài toán trực tiếp thuộc mô hình này (vì dựa trên giả thiết của nó)</span></Lbl>
            <select className={inp} value={moHinhId} onChange={(e) => setMoHinhId(e.target.value)}>
              {L.moHinh.map((m) => <option key={m.id} value={m.id}>{maCap.get(m.id) ?? '?'} · {tron(m.ten)}</option>)}
            </select>

            <div className={`rounded-lg border px-3 py-2.5 ${gtThayThe ? 'border-slate-200 bg-slate-50/60' : 'border-teal-200 bg-teal-50/60'}`}>
              <div className={`mb-1 text-[10.5px] font-semibold uppercase tracking-wide ${gtThayThe ? 'text-slate-400' : 'text-teal-700'}`}>
                {gtThayThe
                  ? `Giả thiết ${chaKeThuaChinh ? `của tiền đề ${chaKeThuaChinh.ma}` : 'của mô hình'} (tham chiếu — bài này sẽ THAY bằng câu riêng)`
                  : `Giả thiết đầy đủ ${chaKeThuaChinh ? `kế thừa từ tiền đề ${chaKeThuaChinh.ma}` : 'của mô hình'} (kế thừa)`}
              </div>
              <div className="text-[13px] leading-relaxed text-slate-700">
                {giaThietNen ? <MathText>{giaThietNen}</MathText> : <span className="text-slate-400">{chaKeThuaChinh ? 'tiền đề chưa có giả thiết' : 'mô hình chưa có giả thiết'}</span>}
              </div>
            </div>

            {/* Giả thiết RIÊNG của bài (Thùy 08-14): không phải bài nào cũng tuyệt đối kế thừa mô hình.
                Mặc định để trống = mượn 100% (hành vi cũ). Mirror UI kiểu kế thừa của mô hình con-cha. */}
            <div>
              <div className="mb-1.5 text-[11px] font-medium text-slate-600">Giả thiết riêng của bài này <span className="font-normal text-slate-400">— không bắt buộc, đa số để trống (mượn nguyên mô hình)</span></div>
              <div className="grid grid-cols-2 gap-2">
                {([[false, 'Cộng thêm', 'Giữ giả thiết mô hình, thêm chi tiết/điều kiện riêng cho bài này'],
                   [true, 'Thay thế hẳn', 'Bỏ qua giả thiết mô hình — bài này tự đứng độc lập']] as const).map(([v, tit, mo]) => (
                  <button key={String(v)} type="button" onClick={() => setGtThayThe(v)}
                    className={`rounded-lg border px-3 py-2 text-left transition ${gtThayThe === v ? 'border-teal-400 bg-teal-50 ring-1 ring-teal-300' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <div className="text-[12.5px] font-semibold text-slate-800">{tit}</div>
                    <div className="mt-0.5 text-[10.5px] leading-snug text-slate-500">{mo}</div>
                  </button>
                ))}
              </div>
              <textarea className={`${inp} mt-2 h-16`} value={gtRieng} onChange={(e) => setGtRieng(e.target.value)}
                placeholder={gtThayThe ? 'Giả thiết ĐẦY ĐỦ tự viết riêng cho bài này…' : 'Phần giả thiết THÊM riêng cho bài này (không bắt buộc)…'} />
              <div className="mt-1.5"><OcrButton onText={setGtRieng} /></div>
              {(gtThayThe || gtRieng.trim()) && (
                <div className="mt-2 rounded-lg bg-violet-50/70 px-3 py-2 text-[12.5px] leading-relaxed text-slate-700">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide text-violet-700">Giả thiết đầy đủ (xem trước): </span>
                  {giaThietFull ? <MathText>{giaThietFull}</MathText> : <span className="text-slate-400">—</span>}
                </div>
              )}
            </div>

            <div className="flex items-end gap-3">
              <div className="w-40">
                <Lbl>Cấp độ <span className="font-normal normal-case text-slate-400">— điền sẵn, sửa được</span></Lbl>
                <input type="number" min={1} className={inp} value={cap}
                  onChange={(e) => { setCap(Number(e.target.value) || 1); setCapTuNhap(true) }} />
              </div>
              <p className="flex-1 pb-1 text-[11px] leading-snug text-slate-400">Cấp = số tính chất phải CM trước. Độ sâu mô hình KHÔNG cộng vào cấp — mô hình con vẫn có bài cấp 1.</p>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Lbl>Hình vẽ</Lbl>
                <label className="mb-1 inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <input type="checkbox" checked={dungHinhRieng} onChange={(e) => setDungHinhRieng(e.target.checked)} />
                  Hình riêng cho bài toán này
                </label>
              </div>
              {dungHinhRieng ? (
                <>
                  <AnhInput value={anhRieng} onChange={setAnhRieng} cap="Hình riêng của bài toán" />
                  <p className="mt-1 text-[11px] text-slate-400">Cùng mô hình không có nghĩa hình vẽ giống hệt — bài toán này được vẽ riêng. <b>Bỏ trống = vẫn mượn hình mô hình.</b></p>
                </>
              ) : (
                <>
                  <Fig src={anhNen} cap={anhNen ? `Hình ${chaKeThuaChinh ? `kế thừa từ tiền đề ${chaKeThuaChinh.ma}` : 'cấu hình — mượn của mô hình'}` : undefined} h="h-52" />
                  <p className="mt-1 text-[11px] text-slate-400">Mặc định {chaKeThuaChinh ? <>kế thừa hình của tiền đề <b>{chaKeThuaChinh.ma}</b> (nó không có hình riêng thì leo tiếp lên mô hình)</> : <>dùng chung hình mô hình (sửa ở form <b>mô hình</b>)</>}. Tích ô trên để vẽ hình riêng cho bài toán này.</p>
                </>
              )}
            </div>

            <div>
              <Lbl>Câu hỏi / yêu cầu <span className="font-normal normal-case text-slate-400">— bộ chữ chuẩn của họ (△ABC, trực tâm H, chân đường cao D·E·F)</span></Lbl>
              <textarea className={`${inp} h-20`} value={phatBieu} onChange={(e) => setPhatBieu(e.target.value)}
                placeholder="Chứng minh tứ giác $BFEC$ nội tiếp đường tròn đường kính $BC$" />
              <div className="mt-1.5"><OcrButton onText={setPhatBieu} /></div>
              {gan.length > 0 && (
                <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
                  <div className="mb-1 text-[12px] font-semibold text-amber-800">Đã có node gần giống — kiểm tra trước khi tạo (nhắc, không chặn)</div>
                  {gan.slice(0, 4).map((b) => (
                    <div key={b.id} className="flex items-center gap-2 py-0.5 text-[12.5px] text-slate-700">
                      <Cap cap={b.cap} /><Ma>{b.ma}</Ma><span className="truncate"><MathText>{b.phat_bieu}</MathText></span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Lbl>Giả thiết phụ <span className="font-normal normal-case text-slate-400">— dữ kiện lẻ / vẽ thêm cho riêng bài này (không bắt buộc)</span></Lbl>
              <textarea className={`${inp} h-16`} value={giaThietPhu} onChange={(e) => setGiaThietPhu(e.target.value)}
                placeholder="gọi $I$ là giao điểm của $AC$ và $BD$" />
              <p className="mt-1 text-[11px] leading-snug text-slate-400">Đa số là <b>vẽ thêm</b> — hiện ở ĐỀ khi bài hỏi node này, ở BƯỚC giải khi node ẩn. Nhiều dữ kiện phụ ⇒ nên tách thành mô hình riêng.</p>
            </div>
          </div>

          {/* ── PHẢI: lời giải + tiền đề + bổ đề ── */}
          <div className="min-w-0 space-y-3 overflow-y-auto p-5">
            <div>
              <Lbl>Dạng (loại câu hỏi › cách xử lý)</Lbl>
              <select className={inp} value={dangId} onChange={(e) => setDangId(e.target.value)}>
                <option value="">— chưa gắn dạng —</option>
                {dangLa.map((d) => <option key={d.id} value={d.id}>{api.tenDangDayDu(L, d.id)}</option>)}
              </select>
            </div>

            <div>
              <Lbl>Lời giải</Lbl>
              <textarea className={`${inp} h-28`} value={loiGiai} onChange={(e) => setLoiGiai(e.target.value)} />
              <div className="mt-1.5"><OcrButton onText={setLoiGiai} /></div>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Lbl>Ảnh bước giải</Lbl>
                <label className="mb-1 inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <input type="checkbox" checked={dungHinhGiaiRieng} onChange={(e) => setDungHinhGiaiRieng(e.target.checked)} />
                  Hình riêng cho bước giải
                </label>
              </div>
              {dungHinhGiaiRieng ? (
                <>
                  <AnhInput value={anhGiai} onChange={setAnhGiai} cap="Hình bước giải" />
                  <p className="mt-1 text-[11px] text-slate-400">Hình có tô/kẻ thêm cho bước giải. <b>Bỏ trống = dùng hình đề bài.</b></p>
                </>
              ) : (
                <>
                  <Fig src={anhDeHienTai} cap={anhDeHienTai ? 'Dùng hình đề bài' : undefined} h="h-40" />
                  <p className="mt-1 text-[11px] text-slate-400">Mặc định dùng hình đề bài. Tích ô trên nếu bước giải cần hình có tô/kẻ thêm.</p>
                </>
              )}
            </div>

            {/* Tiền đề */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Bài toán tiền đề</span>
                <span className="text-[11px] text-slate-400">cần CẢ (AND) · bỏ 1 là không giải được</span>
                <Btn className="ml-auto h-7 text-[12px]" onClick={() => setThemTd((v) => !v)}>{themTd ? 'Đóng cây' : '＋ Thêm tiền đề'}</Btn>
              </div>
              {tienDe.length === 0
                ? <div className="text-[12px] text-slate-400">Chưa có tiền đề — bài suy thẳng từ giả thiết (cấp 1).</div>
                : (
                  <div className="space-y-1">
                    {tienDe.map((id, i) => {
                      const b = L.baiToan.find((x) => x.id === id)
                      if (!b) return null
                      const mh = L.moHinh.find((m) => m.id === b.mo_hinh_id)
                      return (
                        <div key={id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-[12.5px]">
                          {i === 0 && <span className="rounded bg-blue-100 px-1.5 py-px text-[10px] font-semibold text-blue-700">chính</span>}
                          <Cap cap={b.cap} teal={b.mo_hinh_id !== moHinhId} />
                          <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
                          {mh && <span className="shrink-0 text-[10px] text-teal-600">{mh.ma}</span>}
                          {b.gia_thiet_phu?.trim() && (
                            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10.5px] text-slate-500" title="Cho sẵn giả thiết phụ của tiền đề này ở ĐỀ (giảm độ khó — HS khỏi tự dựng)">
                              <input type="checkbox" checked={vanIds.has(id)} onChange={() => toggleVan(id)} />gt phụ ở đề
                            </label>
                          )}
                          <button onClick={() => boTienDe(id)} className="shrink-0 text-slate-400 hover:text-rose-600" title="Bỏ tiền đề">✕</button>
                        </div>
                      )
                    })}
                    <p className="pt-0.5 text-[11px] text-slate-400">Tiền đề <b>chính</b> = bài toán phía trước (gợi ý sẵn). Thêm tiền đề khác nếu bài cần nhiều.</p>
                  </div>
                )}
              {themTd && <CayTienDe L={L} moHinhId={moHinhId} daChon={tienDe} chuId={sua?.id} onPick={themTienDe} />}
            </div>

            {/* Bổ đề */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-600">Bổ đề <span className="font-normal normal-case text-slate-400">— có bổ đề ⇒ độ khó +1 bậc</span></div>
              <div className="flex flex-wrap gap-1.5">
                {L.boDe.map((b) => (
                  <button key={b.id} type="button"
                    onClick={() => setBoDe((a) => (a.includes(b.id) ? a.filter((x) => x !== b.id) : [...a, b.id]))}
                    className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${
                      boDe.includes(b.id) ? 'border-amber-400 bg-amber-100 text-amber-800' : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-50'}`}>
                    ◦ {b.ten}
                  </button>
                ))}
                {!L.boDe.length && <span className="text-[12px] text-slate-400">— danh mục bổ đề còn trống (màn Bổ đề) —</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          {loi && <span className="text-[12.5px] text-rose-700">{loi}</span>}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={!phatBieu.trim() || !moHinhId || saving} onClick={luu}>{saving ? 'Đang lưu…' : sua ? 'Lưu bài toán' : 'Tạo bài toán'}</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</div>
}

/** Cây chọn tiền đề: nhóm node theo MÔ HÌNH (cả họ — tiền đề đi xuyên mô hình), sắp theo độ sâu.
 *  Dễ hình dung "node này thuộc mô hình nào" hơn là một danh sách phẳng. */
function CayTienDe({ L, moHinhId, daChon, chuId, onPick }: {
  L: Luoi; moHinhId: string; daChon: string[]; chuId?: string; onPick: (id: string) => void
}) {
  const [q, setQ] = useState('')
  const nhom = useMemo(() => {
    const goc = api.gocHoCua(L, moHinhId)
    const trongHo = api.moHinhCuaHo(L, goc)
    return L.moHinh
      .filter((m) => trongHo.has(m.id))
      .map((m) => ({ mh: m, sau: api.doSauTrongHo(L, m.id), nodes: L.baiToan.filter((b) => b.mo_hinh_id === m.id).sort((a, b) => a.cap - b.cap) }))
      .filter((g) => g.nodes.length)
      .sort((a, b) => a.sau - b.sau)
  }, [L, moHinhId])

  const khop = (b: BaiToan) => !q.trim() || b.phat_bieu.toLowerCase().includes(q.toLowerCase()) || b.ma.toLowerCase().includes(q.toLowerCase())

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
      <input className={`${inp} mb-2`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="lọc node theo câu hỏi / mã…" />
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {nhom.map(({ mh, nodes }) => {
          const hien = nodes.filter(khop)
          if (!hien.length) return null
          return (
            <div key={mh.id}>
              <div className="flex items-center gap-1.5 px-1 py-0.5 text-[11px] font-semibold text-teal-700">
                ◇ {mh.ma} · {tron(mh.ten)} {mh.id === moHinhId && <span className="rounded bg-teal-100 px-1 text-[9.5px]">mô hình này</span>}
              </div>
              {hien.map((b) => {
                const chon = daChon.includes(b.id), laChinhNo = b.id === chuId
                return (
                  <button key={b.id} type="button" disabled={chon || laChinhNo}
                    onClick={() => onPick(b.id)}
                    className={`ml-3 flex w-[calc(100%-0.75rem)] items-center gap-2 rounded px-1.5 py-1 text-left text-[12.5px] ${
                      chon || laChinhNo ? 'opacity-40' : 'hover:bg-white'}`}>
                    <Cap cap={b.cap} />
                    <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
                    {laChinhNo ? <span className="text-[10px] text-slate-400">chính nó</span>
                      : chon ? <span className="text-[10px] text-blue-600">đã chọn</span>
                      : <span className="text-[13px] text-blue-600">＋</span>}
                  </button>
                )
              })}
            </div>
          )
        })}
        {!nhom.length && <div className="px-1 py-2 text-[12px] text-slate-400">— họ này chưa có node nào để làm tiền đề —</div>}
      </div>
    </div>
  )
}
