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
  type BangHomNay, type BangNhac, type LuotHoi, type NhanDinh, type QuyetDinh, type ViecNhac,
} from '../../lib/troly'

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
  const [loi, setLoi] = useState<string | null>(null)
  const [moGac, setMoGac] = useState<string | null>(null)

  const tai = () => {
    setLoi(null)
    viecHomNay().then(setHomNay).catch((e) => setLoi(e?.message ?? String(e)))
    nhacViecHomNay().then(setBang).catch((e) => setLoi(e?.message ?? String(e)))
    nhanDinhHeThong().then(setNhanDinh).catch((e) => setLoi(e?.message ?? String(e)))
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

// ── HÔM NAY — đúng HAI RỔ theo CEO chốt 12/08 ───────────────────────────────
//   *"Hôm nay là những việc có deadline là hôm nay thôi"*
//   *"những việc phải hoàn thành hôm nay | những việc đã được start và chưa hoàn thành
//     để t nhận thức được nó đang diễn ra"*
// Nợ cũ CHỈ là một con số ở cuối — *"ko phải là mấy cái nợ kia nhé"*. Trộn vào là câu
// trả lời chìm nghỉm giữa gần trăm dòng, đúng lỗi bản trước.
function HomNay({ d }: { d: BangHomNay | null }) {
  if (!d) return null
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[15px] font-semibold text-slate-800">
        {d.thu}, {d.ngay.slice(8)}/{d.ngay.slice(5, 7)}
      </div>

      <div className="mt-3 text-[13px] font-semibold text-slate-700">Phải hoàn thành hôm nay — {d.hanHomNay.length}</div>
      {d.hanHomNay.length === 0 ? (
        // §6 "được phép báo hôm nay không có gì" — im lặng đúng cũng là câu trả lời.
        <div className="mt-1 text-[13px] text-slate-400">Không có việc nào đến hạn hôm nay.</div>
      ) : (
        <div className="mt-1.5 space-y-1">
          {d.hanHomNay.map((v, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-2.5 text-[13px]">
              <span className={`w-[46px] shrink-0 font-medium ${v.quaGio ? 'text-rose-600' : 'text-slate-500'}`}>{v.hanLuc}</span>
              <span className="font-semibold text-slate-800">{v.lop}</span>
              <span className="text-slate-700">{v.nhan}</span>
              <span className="text-[12px] text-slate-400">buổi {v.ngayBuoi.slice(5)}</span>
              {v.quaGio && <span className="text-[12px] font-medium text-rose-600">quá giờ</span>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3.5 text-[13px] font-semibold text-slate-700">Đang dở — {d.dangDo.length}</div>
      <p className="text-[11.5px] text-slate-400">Đã bắt đầu nhưng chưa đóng. Không phải việc hạn hôm nay — để biết đang có gì dang dở.</p>
      {d.dangDo.length === 0 ? (
        <div className="mt-1 text-[13px] text-slate-400">Không có việc nào đang dở.</div>
      ) : (
        <div className="mt-1.5 space-y-1">
          {d.dangDo.map((v, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-2.5 text-[13px]">
              <span className="w-[46px] shrink-0 text-right text-[12px] font-medium text-slate-500">{v.tuoiNgay}n</span>
              <span className="font-semibold text-slate-800">{v.lop}</span>
              <span className="text-slate-700">{v.nhan}</span>
              <span className="text-[12px] text-slate-400">buổi {v.ngayBuoi.slice(5)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 border-t border-slate-100 pt-2 text-[12px] text-slate-500">
        Nợ cũ (hạn đã qua từ trước): <b>{d.noCu}</b> việc — xem ở mục dưới, cố ý không trộn vào đây.
      </div>
    </div>
  )
}
