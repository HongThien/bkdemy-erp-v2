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
  nhacViecHomNay, ghiQuyetDinh, nhanDinhHeThong, ghiQuyetDinhNhanDinh,
  hoiTroLy, docDap, viecHomNay,
  type BangHomNay, type BangNhac, type LuotHoi, type NhanDinh, type QuyetDinh, type ViecGom, type ViecNhac,
} from '../../lib/troly'
import { anhChupBoTroBu, NGAY_AP_HAN_48H, type AnhChupBu } from '../../lib/botro'
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
  const [homNay, setHomNay] = useState<BangHomNay | null>(null)
  const [bang, setBang] = useState<BangNhac | null>(null)
  const [nhanDinh, setNhanDinh] = useState<NhanDinh[] | null>(null)
  const [bu, setBu] = useState<AnhChupBu | null>(null)
  const setStaffLeaf = useStore((s) => s.setStaffLeaf)
  const [loi, setLoi] = useState<string | null>(null)
  const [moGac, setMoGac] = useState<string | null>(null)

  const tai = () => {
    setLoi(null)
    viecHomNay().then(setHomNay).catch((e) => setLoi(e?.message ?? String(e)))
    nhacViecHomNay().then(setBang).catch((e) => setLoi(e?.message ?? String(e)))
    // Bổ trợ bù load TRƯỚC rồi mới tới nhận định: nhận định về bù ăn CHÍNH snapshot này,
    // không query lại — hai nguồn thì hai con số, và người sẽ thấy chúng chỏi nhau ngay
    // trên cùng một màn hình. Bù hỏng thì KHÔNG kéo sập tab, nhận định vẫn chạy phần còn lại.
    anhChupBoTroBu().catch(() => null).then((d) => {
      setBu(d)
      return nhanDinhHeThong(d).then(setNhanDinh)
    }).catch((e) => setLoi(e?.message ?? String(e)))
  }
  useEffect(tai, [])

  const khoa = (v: ViecNhac) => `${v.buoiId}|${v.tab}`

  async function quyetViec(v: ViecNhac, qd: QuyetDinh, gacDen?: string) {
    try { await ghiQuyetDinh(v.buoiId, v.tab, qd, gacDen); setMoGac(null); tai() }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function quyetNhanDinh(n: NhanDinh, qd: QuyetDinh, gacDen?: string) {
    try { await ghiQuyetDinhNhanDinh(n.ma, qd, gacDen); setMoGac(null); tai() }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  if (loi) return <div className="mx-auto max-w-[900px] rounded-2xl border border-rose-200 bg-rose-50 p-4 text-[13px] text-rose-700">Lỗi: {loi}</div>
  if (!bang) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>

  return (
    <div className="mx-auto max-w-[900px]">
      <HomNay d={homNay} />
      <KhoiBu d={bu} onDen={() => setStaffLeaf('botro')} />
      <Chat />

      {/* ── TẦNG 2: trợ lý thấy gì ─────────────────────────────────────────── */}
      {nhanDinh && nhanDinh.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-[14px] font-semibold text-slate-800">🤖 Trợ lý thấy gì</div>
          <div className="space-y-2.5">
            {nhanDinh.map((n) => (
              <div key={n.ma} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="text-[14px] font-semibold text-slate-800">{n.tieuDe}</div>
                {/* Số liệu SỐNG, tính lại mỗi lần mở — nguồn của nhận định (doc §4 "truy nguồn"). */}
                <div className="mt-1 font-mono text-[12px] text-amber-800">{n.so}</div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700">{n.dienGiai}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">→ {n.goiY}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <BaNut nho dangMoGac={moGac === `nd:${n.ma}`}
                    onLam={() => quyetNhanDinh(n, 'lam')} onHuy={() => quyetNhanDinh(n, 'huy')}
                    onMoGac={() => setMoGac(`nd:${n.ma}`)} onGac={(den) => quyetNhanDinh(n, 'gac', den)} />
                  {n.quyetDinh === 'lam' && <span className="text-[12px] font-medium text-emerald-700">✓ đã nhận là cần sửa</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TẦNG 1: việc hôm nay ───────────────────────────────────────────── */}
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[14px] font-semibold text-slate-800">Việc cần quyết — {bang.can.length}</span>
        <span className="text-[12px] text-slate-500">
          đã huỷ {bang.soHuy} · đang gác {bang.soGacChuaToi}
          {bang.gacHomNay > 0 && <span className="ml-1 font-medium text-amber-700">· ⏰ {bang.gacHomNay} vừa quay lại</span>}
        </span>
      </div>
      {/* Cắt mà không nói = người đọc hiểu thành toàn bộ. Luôn khai phạm vi. */}
      <p className="mb-2.5 text-[12px] leading-relaxed text-slate-500">{bang.phamVi}</p>

      {bang.can.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-[13px] text-slate-500">
          Hôm nay không có việc nào cần quyết.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {bang.can.map((v) => (
            <div key={khoa(v)} className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-100 px-4 py-2.5 last:border-0">
              <span className="w-[62px] shrink-0 text-[13px] font-semibold text-slate-800">{v.lop}</span>
              <span className="w-[52px] shrink-0 text-[12px] text-slate-500">{v.ngay.slice(5)}</span>
              <span className={`w-[54px] shrink-0 text-right text-[12px] font-medium ${v.quaHan ? 'text-rose-600' : 'text-slate-600'}`}>
                {v.tuoiNgay}n{v.quaHan ? ' ⚠' : ''}
              </span>
              <span className="min-w-[130px] flex-1 text-[13px] text-slate-700">{v.nhan}</span>
              <BaNut nho dangMoGac={moGac === khoa(v)}
                onLam={() => quyetViec(v, 'lam')} onHuy={() => quyetViec(v, 'huy')}
                onMoGac={() => setMoGac(khoa(v))} onGac={(den) => quyetViec(v, 'gac', den)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── HÔM NAY — BA RỔ + rổ "không có hạn" (CEO chốt 12/08 lượt 2) ─────────────
//   *"Phải báo việc đang NỢ, việc đang CẦN HOÀN THÀNH, và việc DỰ KIẾN sẽ phải làm trong
//    hôm nay mới có cái nhìn đầy đủ chứ."*
//   *"Bản chất của việc hàng ngày chính là 'Việc của tôi', nhưng đầy đủ hơn và có nhận định.
//    Thay vì t phải đi click khắp nơi thì t chỉ còn click 1 chỗ."*
//
// Bản trước rút nợ cũ thành MỘT CON SỐ (hiểu đúng ý "đừng trộn lẫn" nhưng làm sai cách: giấu
// đi). Nay tách rổ — vẫn thấy đủ, vẫn không lẫn. Mỗi dòng ghi rõ NHÓM để biết việc đến từ đâu,
// vì giờ bảng này gom 8 nguồn chứ không riêng việc buổi.
function Dong({ v }: { v: ViecGom }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 py-0.5 text-[13px]">
      {/* Mốc bên trái: giờ hạn nếu có, không thì số ngày. Cột cố định để mắt lướt dọc được. */}
      <span className={`w-[52px] shrink-0 text-right text-[12px] font-medium tabular-nums ${v.quaGio || (v.coHan && v.soNgay > 0) ? 'text-rose-600' : 'text-slate-500'}`}>
        {v.hanLuc ?? (v.soNgay > 0 ? `${v.soNgay} ngày` : '—')}
      </span>
      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-px text-[11px] font-medium text-slate-500">{v.nhomTen}</span>
      <span className="font-medium text-slate-800">{v.nhan}</span>
      <span className="text-[12px] text-slate-500">{v.boiCanh}</span>
      {v.dangDo && <span className="rounded-full bg-sky-50 px-1.5 py-px text-[11px] font-medium text-sky-700">đang dở</span>}
      {v.quaGio && v.soNgay === 0 && <span className="text-[11.5px] font-medium text-rose-600">quá giờ</span>}
    </div>
  )
}

function Ro({ ten, mo_ta, ds, rong, mau }: {
  ten: string; mo_ta?: string; ds: ViecGom[]; rong: string; mau: string
}) {
  return (
    <div className="mt-3">
      <div className={`text-[13px] font-semibold ${mau}`}>{ten} — {ds.length}</div>
      {mo_ta && <p className="text-[11.5px] leading-relaxed text-slate-400">{mo_ta}</p>}
      {/* §6 "được phép báo hôm nay không có gì" — im lặng đúng cũng là một câu trả lời. */}
      {ds.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">{rong}</div>
        : <div className="mt-1">{ds.map((v) => <Dong key={v.khoa} v={v} />)}</div>}
    </div>
  )
}

function HomNay({ d }: { d: BangHomNay | null }) {
  const [xemNguon, setXemNguon] = useState(false)
  if (!d) return null
  const tong = d.no.length + d.hanHomNay.length + d.duKien.length + d.khongHan.length
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-[15px] font-semibold text-slate-800">{d.thu}, {d.ngay.slice(8)}/{d.ngay.slice(5, 7)}</span>
        <span className="text-[12.5px] text-slate-500">{tong} việc đang thuộc về bạn{d.soDangDo > 0 && <> · {d.soDangDo} đang dở</>}</span>
      </div>

      {/* Thứ tự cố ý: NỢ trước — món đắt nhất là món để lâu, không phải món đến hạn hôm nay. */}
      <Ro ten="Đang nợ" mau="text-rose-700" ds={d.no} rong="Không nợ việc nào. "
        mo_ta="Hạn đã qua mà chưa đóng. Sắp theo trễ nhiều nhất trước." />
      <Ro ten="Phải hoàn thành hôm nay" mau="text-slate-700" ds={d.hanHomNay} rong="Không có việc nào đến hạn hôm nay."
        mo_ta="Hạn rơi đúng hôm nay." />
      <Ro ten="Dự kiến sẽ phải làm hôm nay" mau="text-slate-700" ds={d.duKien} rong="Hôm nay không có việc nào sắp phát sinh."
        mo_ta="Việc phát sinh trong hôm nay, hạn chưa tới — gồm cả buổi hôm nay CHƯA MỞ (chưa có task nào tồn tại để mà nhắc)." />
      <Ro ten="Không có hạn — vẫn đang chờ bạn" mau="text-amber-700" ds={d.khongHan} rong="Không có việc nào kiểu này."
        mo_ta="Hệ không đặt hạn cho mấy việc này nên chúng không tự nổi lên chỗ nào. Sắp theo nằm lâu nhất trước." />

      <div className="mt-3 border-t border-slate-100 pt-2 text-[11.5px] leading-relaxed text-slate-500">
        {d.phamVi}{' '}
        <button onClick={() => setXemNguon((x) => !x)} className="font-medium text-indigo-600 hover:underline">
          {xemNguon ? 'ẩn nguồn' : 'gom từ đâu?'}
        </button>
        {xemNguon && (
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-slate-500">
            {d.nguonDaQuet.map((n, i) => <li key={i}>{n}</li>)}
            {/* Khai giới hạn ngay cạnh danh sách nguồn — người đọc thấy "đủ 8 nguồn" dễ tưởng
                là đủ mọi thứ, mà mấy chỗ hệ mù thì vẫn mù. */}
            {d.khongBiet.map((k, i) => <li key={`kb${i}`} className="text-slate-400">Chưa biết: {k}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

// ── BỔ TRỢ BÙ — 5 thứ CEO cần nhìn mỗi ngày (chốt 12/08) ────────────────────
// Story cụ thể đầu tiên được khai đầy đủ vào trợ lý. Mọi số do `anhChupBoTroBu()` tính,
// tất định, đối chiếu được bằng `scripts/_diag_botro_bu.mjs`.
//
// Mục ⑤ cố ý CHỈ hiện số + nút nhảy màn (CEO: "cái này nhiều nên ko cần detail, cần số
// lượng và deeplink để đến chỗ xếp bù") — 141 dòng đổ vào đây là dìm chết 4 mục kia.
function KhoiBu({ d, onDen }: { d: AnhChupBu | null; onDen: () => void }) {
  const [moNguon, setMoNguon] = useState(false)
  if (!d) return null
  const { canXep } = d
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
        <span className="text-[15px] font-semibold text-slate-800">Bổ trợ bù</span>
        <button onClick={onDen} className="text-[12.5px] font-medium text-indigo-600 hover:underline">mở màn Bổ trợ ›</button>
      </div>

      {/* ① đã học xong mà hồ sơ còn khuyết */}
      <div className="mt-3 text-[13px] font-semibold text-slate-700">① Đã học bù xong mà chưa fill đủ — {d.chuaFillDu.length}</div>
      {d.chuaFillDu.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Không buổi nào thiếu hồ sơ.</div> : (
        <div className="mt-1 space-y-1">
          {d.chuaFillDu.map((b) => (
            <div key={b.buoiId} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[52px] shrink-0 text-right text-[12px] font-medium tabular-nums text-rose-600">{b.tuoiNgay} ngày</span>
              <span className="font-medium text-slate-800">{b.ngay.slice(8)}/{b.ngay.slice(5, 7)}{b.gio ? ` · ${b.gio}` : ''}</span>
              <span className="text-[12px] text-slate-500">{b.hs.join(', ')}</span>
              <span className="text-[12px] text-amber-700">{b.thieu.join(' · ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* ② sắp tới — chỉ để nhìn, hệ chưa có chỗ ghi "đã xác nhận" (CEO chốt không thêm cột) */}
      <div className="mt-3 text-[13px] font-semibold text-slate-700">② Sắp đến lịch bù — {d.sapToi.length}</div>
      {d.sapToi.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Không có buổi bù nào sắp tới.</div> : (
        <div className="mt-1 space-y-1">
          {d.sapToi.map((b) => (
            <div key={b.buoiId} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[52px] shrink-0 text-right text-[12px] font-medium text-slate-500">
                {b.conMayNgay === 0 ? 'hôm nay' : `+${b.conMayNgay} ngày`}
              </span>
              <span className="font-medium text-slate-800">{b.ngay.slice(8)}/{b.ngay.slice(5, 7)}{b.gio ? ` · ${b.gio}` : ''}{b.phong ? ` · ${b.phong}` : ''}</span>
              <span className="text-[12px] text-slate-600">
                {b.hs.map((h) => `${h.ho_ten}${h.bu_cho ? ` (bù ${h.bu_cho})` : ''}`).join(' · ') || 'chưa có HS nào'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ③ trượt buổi bù — đây là chỗ trước đây rơi im lặng */}
      <div className="mt-3 text-[13px] font-semibold text-rose-700">③ Đã xếp mà trượt, phải xếp lại — {d.phaiXepLai.length}</div>
      {d.phaiXepLai.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Không có ca nào.</div> : (
        <div className="mt-1 space-y-1">
          {d.phaiXepLai.map((l) => (
            <div key={l.id} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[52px] shrink-0 text-right text-[12px] font-medium tabular-nums text-rose-600">{l.tuoiNgay} ngày</span>
              <span className="font-medium text-slate-800">{l.ho_ten}</span>
              <span className="text-[12px] text-slate-500">{l.lop} · nghỉ {l.ngay.slice(8)}/{l.ngay.slice(5, 7)}</span>
              <span className="rounded-full bg-rose-50 px-1.5 py-px text-[11px] font-medium text-rose-700">
                {l.lyDoQuayLai === 'vang_buoi_bu' ? 'vắng buổi bù' : 'buổi bù bị huỷ'}
              </span>
              {l.soLanDaXep > 1 && <span className="text-[11.5px] font-medium text-rose-600">đã xếp {l.soLanDaXep} lần</span>}
            </div>
          ))}
        </div>
      )}

      {/* ④ quá hạn 48h — chỉ tính từ đường ngày, xem ghi chú nguồn ở dưới */}
      <div className="mt-3 text-[13px] font-semibold text-slate-700">④ Quá hạn xếp bù (48h) — {d.quaHan.length}</div>
      {d.quaHan.length === 0 ? <div className="mt-0.5 text-[13px] text-slate-400">Chưa lượt nào quá hạn.</div> : (
        <div className="mt-1 space-y-1">
          {d.quaHan.map((l) => (
            <div key={l.id} className="flex flex-wrap items-baseline gap-x-2.5 text-[13px]">
              <span className="w-[52px] shrink-0 text-right text-[12px] font-medium tabular-nums text-rose-600">{l.tuoiNgay} ngày</span>
              <span className="font-medium text-slate-800">{l.ho_ten}</span>
              <span className="text-[12px] text-slate-500">{l.lop} · nghỉ {l.ngay.slice(8)}/{l.ngay.slice(5, 7)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ⑤ số lượng + deeplink, KHÔNG liệt kê */}
      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="text-[13px] font-semibold text-slate-700">⑤ Đang cần xếp bù</span>
          <span className="text-[20px] font-semibold tabular-nums text-indigo-600">{canXep.tong}</span>
          <button onClick={onDen} className="text-[12.5px] font-medium text-indigo-600 hover:underline">đi xếp bù ›</button>
        </div>
        <div className="mt-0.5 text-[12px] text-slate-500">
          {canXep.trongHan} còn trong hạn 48h · {canXep.quaHan} quá hạn · <b>{canXep.tonDongCu}</b> tồn đọng cũ (nghỉ trước {NGAY_AP_HAN_48H}, chưa chịu luật)
          {canXep.cuNhat && <> · cũ nhất {canXep.cuNhat.slice(8)}/{canXep.cuNhat.slice(5, 7)}</>}
        </div>
      </div>

      <div className="mt-2.5 border-t border-slate-100 pt-2 text-[11.5px] leading-relaxed text-slate-500">
        {d.phamVi}{' '}
        <button onClick={() => setMoNguon((x) => !x)} className="font-medium text-indigo-600 hover:underline">
          {moNguon ? 'ẩn' : 'hệ chưa biết gì?'}
        </button>
        {moNguon && (
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-slate-400">
            {d.khongBiet.map((k, i) => <li key={i}>{k}</li>)}
            {d.buoiRong > 0 && <li>{d.buoiRong} buổi bù không có HS nào — nhiều khả năng là rác, đã bỏ khỏi mục ①.</li>}
            {/* Sự thật lịch sử: nêu một lần ở đây cho tra được, KHÔNG đẩy lên nhận định khi
                nó đã ngừng xảy ra — nhắc việc không còn xảy ra là cách nhanh nhất để người
                dùng học rằng danh sách này không đáng đọc. */}
            {d.dongKhong.coDe > 0 && (
              <li>
                {d.dongKhong.coDe} buổi bù từng bị chốt xong mà không chấm dòng nào (dữ liệu đo mất luôn)
                {d.dongKhong.ganDay === 0 ? ' — đã ngừng xảy ra, gần đây không còn ca nào' : ` — CÒN đang xảy ra: ${d.dongKhong.ganDay} ca trong 14 ngày qua`}.
                {d.dongKhong.khongDe > 0 && ` Ngoài ra ${d.dongKhong.khongDe} buổi đóng mà không chấm vì buổi mẹ chưa soạn ET — cái này bình thường.`}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
