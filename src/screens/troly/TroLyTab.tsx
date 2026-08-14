// ============================================================================
// Tab "🤖 Trợ lý" trong *Việc của tôi*. HAI TẦNG, cùng bộ 3 nút Làm / Huỷ / Gác.
//
// CEO 12/08 chốt hướng: *"1 đứa trợ lý nhắc việc hàng ngày, và khi nó nhắc việc thì t sẽ nhận
// ra được cái gì cần phải làm, cái gì cần hủy, cái gì cần gác lại"* và *"những cái m vừa nói,
// chính là những thứ trợ lý nói — nhưng phải ở trên ERP để test, cả test trợ lý lẫn fix dữ liệu"*.
//
// ⭐ VÌ SAO 3 NÚT GỠ ĐƯỢC BẾ TẮC: bản trước kẹt ở "hệ chưa biết lớp nào bắt buộc làm khâu nào
//   nên không dám nhắc" → đâm đi vá dữ liệu, sai hướng. Nhắc sai thì bấm HUỶ là xong;
//   **luật lộ ra TỪ các lần bấm**, không cần biết trước. Vì thế danh sách mở HẾT mọi khâu.
//
// BA PHẦN, trên xuống: KHUNG CHAT (hỏi được — thứ phân biệt trợ lý với dashboard) ·
// NHẬN ĐỊNH cấp hệ (cái gì cần SỬA Ở ERP) · VIỆC LẺ hôm nay (lướt nhanh, 3 nút).
//
// ⭐ RANH GIỚI MODEL (doc §4): mọi SỐ trên màn này do CODE tính, tất định, kiểm được bằng
//   `scripts/check-troly.mjs`. Model CHỈ đọc bảng đó rồi trò chuyện — không tự tính, không
//   tự đổi trạng thái gì. Hai tầng dưới chạy được cả khi worker tắt.
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import {
  nhacViecHomNay, nhanDinhHeThong, ghiQuyetDinhNhanDinh, anhChupChuoiDuoi,
  hoiTroLy, docDap,
  type BangNhac, type LuotHoi, type NhanDinh, type QuyetDinh, type AnhChupDuoi,
} from '../../lib/troly'
import { mangYeu, mangTestDauVao, type MangYeu, type MangTest } from '../../lib/troly-modules'
import { anhChupBoTroBu, type AnhChupBu } from '../../lib/botro'
import { baoCaoVanHanh, type BaoCaoVanHanh } from '../../lib/troly-vanhanh'
import { useStore } from '../../store/useStore'

// ── KHUNG CHAT ──────────────────────────────────────────────────────────────
// CEO 12/08: *"trợ lý đưa ra 1 đống thứ. t cần trao đổi với nó như đang trao đổi với m.
// chứ hệ thống đưa ra thì khác gì dashboard và việc của tôi nhỉ"*. Đúng — danh sách là
// dashboard; thứ biến nó thành trợ lý là HỎI ĐƯỢC.
// Client ghi job → `worker/troly.mjs` quét mỗi 3s → ghi câu trả lời. Key model ở SERVER.
const GOI_Y = ['Hôm nay nên bắt đầu từ đâu?', 'Cái nào bỏ được?', 'Có gì bất thường không?']

function Chat() {
  const [phien] = useState(() => crypto.randomUUID())
  const [luot, setLuot] = useState<LuotHoi[]>([])
  const [hoi, setHoi] = useState('')
  const [dangCho, setDangCho] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [canhBao, setCanhBao] = useState<string | null>(null)
  const dungLai = useRef(false)
  // ⚠ PHẢI reset về false trong THÂN effect, không chỉ set true ở cleanup.
  //   <StrictMode> (bật ở main.tsx) chạy mount → unmount → mount lại ở dev. Cleanup của lần
  //   unmount giả đặt cờ = true, mà không có dòng reset thì cờ ĐỨNG NGUYÊN true mãi ⇒ vòng
  //   chờ `!dungLai.current` không chạy nổi một vòng ⇒ không bao giờ đọc kết quả, không bao
  //   giờ tắt trạng thái chờ → giao diện "đơ" ở "Đang đọc dữ liệu…" dù server đã trả lời xong.
  //   (Dính thật 12/08: job done trong 14s, UI treo vô hạn.)
  useEffect(() => { dungLai.current = false; return () => { dungLai.current = true } }, [])

  async function gui(cauHoi: string) {
    const q = cauHoi.trim()
    if (!q || dangCho) return
    setHoi(''); setLoi(null); setCanhBao(null); setDangCho(true)
    try {
      const id = await hoiTroLy(phien, q, luot)
      // Chờ worker. Không dùng realtime cho đơn giản — hỏi–đáp vài lượt/ngày, poll là đủ.
      for (let i = 0; i < 120 && !dungLai.current; i++) {
        await new Promise((r) => setTimeout(r, 1500))
        const d = await docDap(id)
        if (d?.trang_thai === 'done') { setLuot((l) => [...l, { hoi: q, dap: d.tra_loi ?? '' }]); setDangCho(false); return }
        if (d?.trang_thai === 'failed') { setLoi(d.error ?? 'Không trả lời được.'); setDangCho(false); return }
        // Vẫn 'pending' sau ~9s = KHÔNG AI NHẶT JOB ⇒ worker chưa bật. Phân biệt hẳn với
        // "worker chạy nhưng lỗi" — hai ca này cần hai hành động khác nhau, mà nếu chỉ
        // hiện "đang chờ" thì người dùng ngồi đoán (đã dính 12/08: job failed ngay trong
        // 0 giây mà vẫn tưởng là nó đang nghĩ lâu).
        if (i === 6 && d?.trang_thai === 'pending') {
          setCanhBao('Worker chưa nhặt job — nhiều khả năng chưa bật. Chạy `npm run worker:troly` ở một cửa sổ terminal riêng.')
        }
      }
      if (!dungLai.current) { setLoi('Quá lâu không có trả lời. Xem log của `npm run worker:troly`.'); setDangCho(false) }
    } catch (e: any) { setLoi(e?.message ?? String(e)); setDangCho(false) }
  }

  return (
    <div className="mb-4 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm">
      <div className="text-[14px] font-semibold text-slate-800">💬 Hỏi trợ lý</div>
      {luot.length === 0 && !dangCho && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {GOI_Y.map((g) => (
            <button key={g} onClick={() => gui(g)}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[12px] text-slate-600 hover:bg-slate-100">{g}</button>
          ))}
        </div>
      )}
      {luot.length > 0 && (
        <div className="mt-2.5 space-y-3">
          {luot.map((l, i) => (
            <div key={i}>
              <div className="text-[13px] font-medium text-indigo-700">{l.hoi}</div>
              <div className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700">{l.dap}</div>
            </div>
          ))}
        </div>
      )}
      {dangCho && <div className="mt-2.5 text-[13px] text-slate-400">Đang đọc dữ liệu…</div>}
      {canhBao && <div className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">{canhBao}</div>}
      {loi && <div className="mt-2.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">⚠ {loi}</div>}
      <form onSubmit={(e) => { e.preventDefault(); gui(hoi) }} className="mt-3 flex gap-2">
        <input value={hoi} onChange={(e) => setHoi(e.target.value)} disabled={dangCho}
          placeholder="Hỏi về việc đang treo, lớp nào nặng, nên làm gì trước…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50" />
        <button type="submit" disabled={dangCho || !hoi.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40">Hỏi</button>
      </form>
      {/* Nói thẳng giới hạn: model CHỈ đọc bảng dưới, không tự tính, không biết gì ngoài đó. */}
      <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400">
        Trợ lý chỉ đọc đúng bảng số ở dưới — không tự tính, không biết gì ngoài phạm vi đó. Hỏi ngoài thì nó sẽ nói là không có.
      </p>
    </div>
  )
}

// Gác bằng nút bấm sẵn, KHÔNG bắt gõ ngày: công cụ dùng hàng ngày mà mỗi lần gác phải mở
// lịch chọn ngày thì người ta sẽ bỏ qua thay vì gác — rồi việc treo mãi.
const MOC_GAC: { ten: string; ngay: number }[] = [
  { ten: '3 ngày', ngay: 3 }, { ten: '1 tuần', ngay: 7 }, { ten: '1 tháng', ngay: 30 },
]
function congNgayVN(n: number): string {
  const d = new Date(); d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}

function BaNut({ dangMoGac, onLam, onHuy, onGac, onMoGac, nho }: {
  dangMoGac: boolean; nho?: boolean
  onLam: () => void; onHuy: () => void; onGac: (den: string) => void; onMoGac: () => void
}) {
  const cls = nho ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[13px]'
  if (dangMoGac) return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[12px] text-slate-500">Nhắc lại sau:</span>
      {MOC_GAC.map((m) => (
        <button key={m.ngay} onClick={() => onGac(congNgayVN(m.ngay))}
          className={`rounded-full border border-amber-300 bg-amber-50 font-medium text-amber-700 hover:bg-amber-100 ${cls}`}>{m.ten}</button>
      ))}
    </div>
  )
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={onLam} className={`rounded-full border border-emerald-300 bg-emerald-50 font-medium text-emerald-700 hover:bg-emerald-100 ${cls}`}>Làm</button>
      <button onClick={onHuy} className={`rounded-full border border-slate-300 bg-slate-50 font-medium text-slate-600 hover:bg-slate-100 ${cls}`}>Huỷ</button>
      <button onClick={onMoGac} className={`rounded-full border border-amber-300 bg-amber-50 font-medium text-amber-700 hover:bg-amber-100 ${cls}`}>Gác</button>
    </div>
  )
}

export default function TroLyTab() {
  const [nhanDinh, setNhanDinh] = useState<NhanDinh[] | null>(null)
  const [bu, setBu] = useState<AnhChupBu | null>(null)
  const [vh, setVh] = useState<BaoCaoVanHanh | null>(null)
  const [yeu, setYeu] = useState<MangYeu | null>(null)
  const [test, setTest] = useState<MangTest | null>(null)
  const [duoi, setDuoi] = useState<AnhChupDuoi | null>(null)
  const [toi, setToi] = useState<BangNhac | null>(null)
  const setStaffLeaf = useStore((s) => s.setStaffLeaf)
  const [loi, setLoi] = useState<string | null>(null)
  const [moGac, setMoGac] = useState<string | null>(null)

  // Mỗi mảng tự chịu lỗi riêng — một mảng hỏng KHÔNG được kéo sập cả màn.
  const tai = () => {
    setLoi(null)
    baoCaoVanHanh().then(setVh).catch(() => setVh(null))
    mangYeu().then(setYeu).catch(() => setYeu(null))
    mangTestDauVao().then(setTest).catch(() => setTest(null))
    anhChupChuoiDuoi().then(setDuoi).catch(() => setDuoi(null))
    nhacViecHomNay().then(setToi).catch(() => setToi(null))
    anhChupBoTroBu().catch(() => null).then((d) => {
      setBu(d)
      return nhanDinhHeThong(d).then(setNhanDinh).catch(() => setNhanDinh(null))
    })
  }
  useEffect(tai, [])

  async function quyetNhanDinh(n: NhanDinh, qd: QuyetDinh, gacDen?: string) {
    try { await ghiQuyetDinhNhanDinh(n.ma, qd, gacDen); setMoGac(null); tai() }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  if (loi) return <div className="mx-auto max-w-[1000px] rounded-2xl border border-rose-200 bg-rose-50 p-4 text-[13px] text-rose-700">Lỗi: {loi}</div>

  return (
    <div className="mx-auto max-w-[1000px] pb-8">
      <Chat />

      {/* ⭐ MỖI MODULE = MỘT KHU, báo SỐ TỔNG QUAN + đúng thứ cần hành động.
          CEO 14/08: "màn hình trợ lý phải chia khu ra cho dễ view" + "báo số tổng quan chứ
          liệt kê 100 trường hợp cho chó đọc à". Khối "việc của tôi" đời cũ đổ ra 103 dòng —
          BỎ HẲN, giờ còn đúng một dòng số + chỉ đường sang màn đã có. Danh sách chi tiết là
          việc của MÀN CHUYÊN MÔN; trợ lý chỉ nói con số và chỗ đáng nhìn. */}
      <KhoiVanHanh d={vh} />
      <KhoiBu d={bu} onDen={() => setStaffLeaf('botro')} />
      <KhoiDuoi d={duoi} onDen={() => setStaffLeaf('botro_duoi')} />
      <KhoiYeu d={yeu} />
      <KhoiTest d={test} onDen={() => setStaffLeaf('tuyensinh')} />
      <KhoiViecToi d={toi} />

      {nhanDinh && nhanDinh.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-[14px] font-semibold text-slate-800">🤖 Trợ lý thấy gì</div>
          <div className="space-y-2.5">
            {nhanDinh.map((n) => (
              <div key={n.ma} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="text-[14px] font-semibold text-slate-800">{n.tieuDe}</div>
                <div className="mt-1 font-mono text-[12px] text-amber-800">{n.so}</div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700">{n.dienGiai}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">→ {n.goiY}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <BaNut nho dangMoGac={moGac === ('nd:' + n.ma)}
                    onLam={() => quyetNhanDinh(n, 'lam')} onHuy={() => quyetNhanDinh(n, 'huy')}
                    onMoGac={() => setMoGac('nd:' + n.ma)} onGac={(den) => quyetNhanDinh(n, 'gac', den)} />
                  {n.quyetDinh === 'lam' && <span className="text-[12px] font-medium text-emerald-700">✓ đã nhận là cần sửa</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Khung chung cho mọi module: tên khu + MỘT dòng số tổng quan + phần đáng nhìn ──
function Khu({ ten, tomTat, onDen, tenNut, children }: {
  ten: string; tomTat: string; onDen?: () => void; tenNut?: string; children?: any
}) {
  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-[15px] font-semibold text-slate-800">{ten}</span>
        {onDen && <button onClick={onDen} className="text-[12.5px] font-medium text-indigo-600 hover:underline">{tenNut ?? 'mở màn ›'}</button>}
      </div>
      <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{tomTat}</div>
      {children}
    </div>
  )
}

// ── BỔ TRỢ ĐUỔI ────────────────────────────────────────────────────────────
// Chỉ nêu ca VƯỢT ngưỡng rút từ chính cohort đã hoàn thành. Ca nằm trong p50 là nhịp bình
// thường — lôi ra là nhiễu (đo lúc dựng: 4/8 ca đáng nhắc, 4 ca kia hoàn toàn bình thường).
function KhoiDuoi({ d, onDen }: { d: AnhChupDuoi | null; onDen: () => void }) {
  if (!d) return null
  const dangLo = d.ca.filter((c) => c.muc !== 'binh_thuong')
  const tt = d.tongDangMo + ' đợt đang mở · ' + dangLo.length + ' đợt chậm hơn bình thường'
    + (d.nguong.soCaMau ? ' (ngưỡng rút từ ' + d.nguong.soCaMau + ' đợt đã hoàn thành: p75 ' + d.nguong.p75 + ' ngày, lâu nhất ' + d.nguong.toiDa + ' ngày)' : '')
  return (
    <Khu ten="Bổ trợ đuổi" onDen={onDen} tomTat={tt}>
      {dangLo.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {dangLo.slice(0, 6).map((c) => (
            <div key={c.caseId} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[52px] shrink-0 text-right text-[12px] font-medium tabular-nums text-rose-600">{c.tuoiNgay} ngày</span>
              <span className="font-medium text-slate-800">{c.ho_ten}</span>
              <span className="text-[12px] text-slate-500">{c.lop} · {c.choKhau}</span>
            </div>
          ))}
          {dangLo.length > 6 && <div className="text-[12px] text-slate-400">…và {dangLo.length - 6} đợt nữa — xem ở màn Bổ trợ.</div>}
        </div>
      )}
    </Khu>
  )
}

// ── BỔ TRỢ YẾU ─────────────────────────────────────────────────────────────
function KhoiYeu({ d }: { d: MangYeu | null }) {
  if (!d) return null
  return (
    <Khu ten="Bổ trợ yếu" tomTat={d.thongDiep}>
      {d.soCanhBao > 0 && (
        <div className="mt-1 text-[12.5px] text-slate-500">
          {d.soHS} học sinh bị gắn cờ
          {d.moiNhat && <> · cờ mới nhất {d.moiNhat.slice(8)}/{d.moiNhat.slice(5, 7)}</>}
          {d.topHS.length > 0 && <> · nhiều cờ nhất: {d.topHS.map((h) => h.ho_ten + ' (' + h.soLan + ')').join(', ')}</>}
        </div>
      )}
    </Khu>
  )
}

// ── KIỂM TRA ĐẦU VÀO ───────────────────────────────────────────────────────
function KhoiTest({ d, onDen }: { d: MangTest | null; onDen: () => void }) {
  if (!d) return null
  const tt = d.tong + ' ca · đã test ' + d.daTest + ' · đã scan ' + d.daScan
    + ' · đã chấm ' + d.daCham + ' · đã trả ' + d.daTra + '. ' + d.thongDiep
  return (
    <Khu ten="Kiểm tra đầu vào" onDen={onDen} tenNut="mở màn Tuyển sinh ›" tomTat={tt}>
      {d.ket.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {d.ket.slice(0, 6).map((k, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[52px] shrink-0 text-right text-[12px] font-medium tabular-nums text-rose-600">{k.tuoiNgay} ngày</span>
              <span className="font-medium text-slate-800">{k.ho_ten}</span>
              <span className="text-[12px] text-slate-500">{k.khoi ? 'khối ' + k.khoi + ' · ' : ''}{k.mon} · {k.khau}</span>
            </div>
          ))}
        </div>
      )}
    </Khu>
  )
}

// ── VIỆC CỦA RIÊNG BẠN — CHỈ SỐ, KHÔNG liệt kê ─────────────────────────────
// Đây đúng là chỗ bản cũ đổ ra 103 dòng. Màn "Việc của tôi" đã có sẵn để xem chi tiết;
// nhiệm vụ của trợ lý là nói CON SỐ rồi chỉ đường, không chép lại cả danh sách.
function KhoiViecToi({ d }: { d: BangNhac | null }) {
  if (!d) return null
  const quaHan = d.can.filter((v) => v.quaHan).length
  const tt = d.can.length + ' việc chưa xong'
    + (quaHan ? ' · ' + quaHan + ' đã quá hạn' : '')
    + (d.soHuy ? ' · ' + d.soHuy + ' đã bỏ' : '')
    + (d.soGacChuaToi ? ' · ' + d.soGacChuaToi + ' đang gác' : '')
    + '. Danh sách chi tiết ở tab Vận hành / Phát triển.'
  return <Khu ten="Việc của riêng bạn" tomTat={tt} />
}

// ── BỔ TRỢ BÙ ──────────────────────────────────────────────────────────────
// 5 thứ Lộc cần mỗi ngày (chốt 12/08). Bản đầu liệt kê hết mọi mục ⇒ CEO 14/08:
// *"báo số tổng quan chứ liệt kê 100 trường hợp cho chó đọc à"*. Nay: MỘT dòng số, rồi
// chỉ bày ra thứ CẦN TAY NGƯỜI hôm nay, cắt ngắn có nói rõ còn bao nhiêu.
const CAP = 5

function DongCa({ trai, chinh, phu, mauTrai }: { trai: string; chinh: string; phu: string; mauTrai?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
      <span className={`w-[62px] shrink-0 text-right text-[12px] font-medium tabular-nums ${mauTrai ?? 'text-slate-500'}`}>{trai}</span>
      <span className="font-medium text-slate-800">{chinh}</span>
      <span className="text-[12px] text-slate-500">{phu}</span>
    </div>
  )
}

function MucNho({ ten, so, children }: { ten: string; so: number; children?: any }) {
  if (!so) return null
  return (
    <div className="mt-2">
      <div className="text-[12.5px] font-semibold text-slate-700">{ten} — {so}</div>
      <div className="mt-0.5 space-y-0.5">{children}</div>
    </div>
  )
}

function KhoiBu({ d, onDen }: { d: AnhChupBu | null; onDen: () => void }) {
  if (!d) return null
  const homNay = d.sapToi.filter((b) => b.conMayNgay === 0)
  const tt = `${d.canXep.tong} lượt cần xếp (${d.canXep.quaHan} quá hạn 48h, ${d.canXep.tonDongCu} tồn đọng cũ)`
    + ` · ${d.phaiXepLai.length} ca phải xếp lại · ${d.sapToi.length} buổi sắp tới`
    + (homNay.length ? ` (${homNay.length} hôm nay)` : '')
    + ` · ${d.chuaFillDu.length} buổi học xong chưa fill đủ`
  return (
    <Khu ten="Bổ trợ bù" onDen={onDen} tenNut="đi xếp bù ›" tomTat={tt}>
      {/* Buổi bù HÔM NAY — thứ Lộc cần "kiểm tra xác nhận" trong ngày */}
      <MucNho ten="Buổi bù hôm nay" so={homNay.length}>
        {homNay.map((b) => (
          <DongCa key={b.buoiId} trai={b.gio ?? '—'} chinh={b.hs.map((h) => h.ho_ten).join(', ') || 'chưa có HS'}
            phu={(b.phong ? b.phong + ' · ' : '') + b.hs.map((h) => h.bu_cho).filter(Boolean).join(' · ')} />
        ))}
      </MucNho>

      {/* Đã xếp mà trượt — chỗ trước đây rơi im lặng, phải nêu tên */}
      <MucNho ten="Đã xếp mà trượt, phải xếp lại" so={d.phaiXepLai.length}>
        {d.phaiXepLai.slice(0, CAP).map((l) => (
          <DongCa key={l.id} trai={`${l.tuoiNgay} ngày`} mauTrai="text-rose-600" chinh={l.ho_ten}
            phu={`${l.lop} · ${l.lyDoQuayLai === 'vang_buoi_bu' ? 'vắng buổi bù' : 'buổi bù bị huỷ'}`} />
        ))}
        {d.phaiXepLai.length > CAP && <div className="text-[12px] text-slate-400">…và {d.phaiXepLai.length - CAP} ca nữa.</div>}
      </MucNho>

      <MucNho ten="Học xong nhưng hồ sơ còn khuyết" so={d.chuaFillDu.length}>
        {d.chuaFillDu.slice(0, CAP).map((b) => (
          <DongCa key={b.buoiId} trai={`${b.tuoiNgay} ngày`} mauTrai="text-rose-600"
            chinh={`${b.ngay.slice(8)}/${b.ngay.slice(5, 7)}`} phu={b.thieu.join(' · ')} />
        ))}
        {d.chuaFillDu.length > CAP && <div className="text-[12px] text-slate-400">…và {d.chuaFillDu.length - CAP} buổi nữa.</div>}
      </MucNho>

      <MucNho ten="Quá hạn xếp bù (48h)" so={d.quaHan.length}>
        {d.quaHan.slice(0, CAP).map((l) => (
          <DongCa key={l.id} trai={`${l.tuoiNgay} ngày`} mauTrai="text-rose-600" chinh={l.ho_ten} phu={l.lop} />
        ))}
        {d.quaHan.length > CAP && <div className="text-[12px] text-slate-400">…và {d.quaHan.length - CAP} lượt nữa.</div>}
      </MucNho>

      {/* Sự thật lịch sử, để tra chứ không nhắc hằng ngày (xem lib/botro.ts) */}
      {d.dongKhong.coDe > 0 && d.dongKhong.ganDay > 0 && (
        <div className="mt-2 text-[12px] text-rose-700">
          ⚠ {d.dongKhong.ganDay} buổi bù trong 14 ngày qua bị chốt xong mà không chấm dòng nào.
        </div>
      )}
    </Khu>
  )
}

// ── MẢNG "VẬN HÀNH BUỔI HỌC" — bộ đầu tiên được khai đầy đủ (spec §4.5) ─────
// CEO hình dung ra thành CÂU chứ không phải bảng: *"Ngày hôm qua các lớp XYZ đã hoàn thành
// điền dữ liệu, lớp ABC còn thiếu ET…"* → đọc xong là biết đi nhắc ai. Nên khối này viết
// thành câu tiếng Việt, chỉ rơi xuống dạng danh sách khi số lớp nhiều.
//
// ⚠ Ba khâu BA NHỊP KHÁC NHAU, cố ý không gộp một chỗ (spec §2.1):
//   ET + đánh giá = của buổi hôm qua · BTVN = đến hạn theo LỊCH HÔM NAY (chấm ở buổi kế).
const nốiLớp = (ds: string[]) => ds.join(', ')

function DongCau({ nhan, lops, mau }: { nhan: string; lops: string[]; mau: string }) {
  if (!lops.length) return null
  return (
    <div className="mt-1 text-[13px] leading-relaxed">
      <span className={`font-semibold ${mau}`}>{nhan}</span>{' '}
      <span className="text-slate-700">{nốiLớp(lops)}</span>
      <span className="text-[12px] text-slate-400"> ({lops.length})</span>
    </div>
  )
}

function KhoiVanHanh({ d }: { d: BaoCaoVanHanh | null }) {
  const [moTuan, setMoTuan] = useState(false)
  if (!d) return null
  const q = d.buoiHomQua
  const du = q.filter((b) => b.du).map((b) => b.lop)
  const thieuET = q.filter((b) => b.coDeET && !b.etXong).map((b) => b.lop)
  const thieuDG = q.filter((b) => !b.dgXong).map((b) => b.lop)
  // Lớp không có đề ET: nêu RIÊNG, không trộn vào "thiếu" — chúng không nợ gì cả. Nêu ra để
  // người đọc không tưởng hệ bỏ sót (§ "cắt mà không nói = đọc thành toàn bộ").
  const khongDeET = q.filter((b) => !b.coDeET).map((b) => b.lop)
  const btvnThieu = d.btvn.filter((b) => !b.daGhiNhan)
  const btvnXong = d.btvn.filter((b) => b.daGhiNhan)

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[15px] font-semibold text-slate-800">Vận hành buổi học</div>

      {/* ① HÔM QUA — ET + đánh giá */}
      <div className="mt-2.5 text-[13px] font-semibold text-slate-700">
        Hôm qua {d.homQua.slice(8)}/{d.homQua.slice(5, 7)} — {q.length} buổi
      </div>
      {q.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Không có buổi nào.</div> : (
        <>
          <DongCau nhan="Đã đủ dữ liệu:" lops={du} mau="text-emerald-700" />
          <DongCau nhan="Còn thiếu ET:" lops={thieuET} mau="text-rose-700" />
          <DongCau nhan="Chưa điền đánh giá:" lops={thieuDG} mau="text-rose-700" />
          {du.length === q.length && <div className="mt-1 text-[13px] text-emerald-700">Tất cả các lớp đã hoàn thành.</div>}
          {khongDeET.length > 0 && (
            <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">
              Không đòi ET ở {nốiLớp(khongDeET)} — mấy buổi này chưa có đề ET gắn vào, nên hệ không coi là nợ.
            </div>
          )}
        </>
      )}

      {/* ② BTVN — đến hạn theo LỊCH HÔM NAY, không phải "hôm qua chưa có" */}
      <div className="mt-3 text-[13px] font-semibold text-slate-700">BTVN đến hạn hôm nay — {d.btvn.length} lớp</div>
      <p className="text-[11.5px] leading-relaxed text-slate-400">
        Lớp có ca hôm nay ⇒ BTVN của buổi trước phải được chấm trong buổi này.
      </p>
      {d.btvn.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Hôm nay không lớp nào tới hạn BTVN.</div> : (
        <>
          {btvnThieu.length > 0 && (
            <div className="mt-1 text-[13px] leading-relaxed">
              <span className="font-semibold text-rose-700">Chưa ghi nhận:</span>{' '}
              <span className="text-slate-700">{btvnThieu.map((b) => `${b.lop} (buổi ${b.buoiTruoc.slice(8)}/${b.buoiTruoc.slice(5, 7)})`).join(', ')}</span>
            </div>
          )}
          <DongCau nhan="Đã ghi nhận:" lops={btvnXong.map((b) => b.lop)} mau="text-emerald-700" />
        </>
      )}

      {/* ③ TỪ ĐẦU TUẦN — nợ tích luỹ */}
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="text-[13px] font-semibold text-slate-700">Từ đầu tuần ({d.tuNgay.slice(8)}/{d.tuNgay.slice(5, 7)}) — {d.noTuan.length} lớp còn nợ</span>
        {d.noTuan.length > 0 && (
          <button onClick={() => setMoTuan((x) => !x)} className="text-[12px] font-medium text-indigo-600 hover:underline">
            {moTuan ? 'thu gọn' : 'xem chi tiết'}
          </button>
        )}
      </div>
      {d.noTuan.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Không lớp nào nợ dữ liệu trong tuần.</div> : moTuan ? (
        <div className="mt-1 space-y-0.5">
          {d.noTuan.map((o) => (
            <div key={o.lop} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[56px] shrink-0 font-semibold text-slate-800">{o.lop}</span>
              {o.noET > 0 && <span className="text-rose-700">ET {o.noET}</span>}
              {o.noBTVN > 0 && <span className="text-rose-700">BTVN {o.noBTVN}</span>}
              {o.noDanhGia > 0 && <span className="text-amber-700">đánh giá {o.noDanhGia}</span>}
              <span className="text-[12px] text-slate-400">/ {o.soBuoi} buổi</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-1 text-[13px] leading-relaxed">
          <DongCau nhan="Nợ ET:" lops={d.noTuan.filter((o) => o.noET).map((o) => o.lop)} mau="text-rose-700" />
          <DongCau nhan="Nợ BTVN:" lops={d.noTuan.filter((o) => o.noBTVN).map((o) => o.lop)} mau="text-rose-700" />
          <DongCau nhan="Nợ đánh giá:" lops={d.noTuan.filter((o) => o.noDanhGia).map((o) => o.lop)} mau="text-amber-700" />
        </div>
      )}

      <div className="mt-2.5 border-t border-slate-100 pt-2 text-[11.5px] leading-relaxed text-slate-500">{d.phamVi}</div>
    </div>
  )
}
