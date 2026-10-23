// Dựng CHỮ bản tin Telegram TA từ dữ liệu DB (fn_tg_ban_tin) + đăng (spec-bot-telegram-ta.md §3.1).
// File bắt đầu bằng "_" ⇒ Vercel không coi là route. Dùng chung cho api/tg-ban-tin.mjs (cron 08:00) và scripts/tg/ban-tin.mjs.
// Mọi gom/đếm nằm ở DB; ở đây CHỈ định dạng chữ (HTML của Telegram).

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ddmm = (d) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}` : '')
const THU = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const thu = (d) => THU[new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10))).getUTCDay()]
const ten = (p) => (p.tg_user_id ? `<a href="tg://user?id=${p.tg_user_id}">${esc(p.ho_ten)}</a>` : `<b>${esc(p.ho_ten)}</b>`)
const MAX_MUC = 8
const MAX_CT = 10
const NHOM_CONG = [['cong_ca', 'Ca trực'], ['cong_bo_tro', 'Buổi bổ trợ'], ['cong_buoi', 'Buổi lớp'], ['quen_checkout', 'Quên checkout']]

export function dungBanTin(d) {
  const ds = d.ta ?? []
  const dau = [
    `📋 <b>BẢN TIN CÔNG VIỆC TRỢ GIẢNG — ${thu(d.ngay)} ${ddmm(d.ngay)}/${d.ngay.slice(0, 4)}</b>`,
    `ET · BTVN <b>chưa làm và đã quá hạn</b> + <b>chấm công cần hoàn thành</b> (từ 01/10) · <b>${ds.length}</b> TA cần chú ý`,
    d.sach?.length ? `✅ Sạch việc: ${d.sach.map(esc).join(', ')}` : null,
    d.chua_noi?.length ? `⚠️ Chưa kết nối Telegram (bot không tag được): ${d.chua_noi.map(esc).join(', ')} — vào app TA → Chấm công → <b>Kết nối Telegram</b>` : null,
    `Mỗi bạn trả lời <b>ngay dưới tin của mình</b>: việc nào đã xong · lý do chưa xong · hẹn ngày nào xong.`,
  ].filter(Boolean).join('\n')
  const tin = ds.map((t) => {
    const dong = [`👤 ${ten(t)}${t.so_tre ? ` — <b>${t.so_tre}</b> việc trễ` : ''}`]
    for (const n of t.nhom ?? []) {
      const muc = n.muc.slice(0, MAX_MUC).map((m) => {
        // so_luong > 1: BTVN bù = số em chưa chấm ở buổi đó; báo sai cũ = số câu
        const kem = [m.so_luong > 1 ? `${m.so_luong} học sinh` : null, m.tre_ngay >= 1 ? `trễ ${m.tre_ngay} ngày` : null].filter(Boolean).join(', ')
        return `${esc(m.ten_lop ?? '')} ${ddmm(m.ngay_goc)}${kem ? ` (${kem})` : ''}`.trim()
      })
      const them = n.muc.length > MAX_MUC ? ` +${n.muc.length - MAX_MUC}` : ''
      dong.push(`• ${esc(n.nhan.replace(/ — .*$/, ''))}: ${muc.join(', ')}${them}`)
    }
    const c = t.cong
    if (c) {
      // Thùy 23/10: "cần nhắn rõ là ca trực nào" ⇒ từng ca/buổi một dòng (ngày · giờ · tên), nhóm theo loại
      const ct = c.chi_tiet ?? []
      dong.push(`• ⏳ <b>Cần hoàn thành chấm công</b> (${ct.length} mục — khai bù trong app TA → Chấm công):`)
      for (const [loai, nhan] of NHOM_CONG) {
        const ds = ct.filter((x) => x.loai === loai)
        if (!ds.length) continue
        dong.push(`   <i>${nhan}:</i>`)
        // cùng ngày + giờ + tên (TA kèm song song nhiều buổi bổ trợ) ⇒ gộp 1 dòng "(N buổi)"
        const gop = []
        for (const x of ds) {
          const ten = loai === 'quen_checkout' ? '' : ` · ${esc(String(x.ten ?? '').replace(/^Trực bổ trợ /, ''))}`
          const dongX = `${ddmm(x.ngay)}${x.gio ? ' ' + x.gio : ''}${ten}`
          const cu = gop.find((g) => g.d === dongX)
          if (cu) cu.n++; else gop.push({ d: dongX, n: 1 })
        }
        for (const g of gop.slice(0, MAX_CT)) dong.push(`   – ${g.d}${g.n > 1 ? ` (${g.n} buổi)` : ''}`)
        if (gop.length > MAX_CT) dong.push(`   – … và ${gop.length - MAX_CT} mục nữa`)
      }
    }
    if (t.canh_bao?.length) {
      dong.push('⚠️ <b>BTVN cần nhắc em:</b>')
      for (const b of t.canh_bao) dong.push(`   – ${esc(b.ho_ten)} (${esc(b.ten_lop)}): ${b.loai === 'khong_lam' ? 'không làm' : 'nộp muộn'} 2 bài liên tiếp (${b.ngays.map(ddmm).join(', ')})`)
    }
    if (t.phu_trach?.length) dong.push(`Phụ trách: ${t.phu_trach.map(ten).join(', ')}`)
    return { nhan_su_id: t.nhan_su_id, text: dong.join('\n'), viec: t.viec }
  })
  return { dau, tin }
}

// Đăng vào mọi nhóm đã bật: tiêu đề trước, rồi từng TA; bỏ qua cái đã đăng (chạy lại không trùng). Giãn ~3,2s/tin
// (Telegram giới hạn ~20 tin/phút vào 1 nhóm).
export async function dangBanTin({ rpc, tg, secret, ngay, ngu = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const d = await rpc('fn_tg_ban_tin', { p_secret: secret, p_ngay: ngay ?? null })
  const { dau, tin } = dungBanTin(d)
  const kq = []
  for (const g of d.nhom ?? []) {
    const daDang = new Set(g.da_dang ?? [])
    const gui = async (ns, text, viec) => {
      const m = await tg('sendMessage', { chat_id: g.chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true })
      await rpc('fn_tg_ghi_ban_tin', { p_secret: secret, p_ngay: d.ngay, p_chat: g.chat_id, p_ns: ns, p_message_id: m.message_id, p_noi_dung: text, p_viec: viec ?? [] })
      await ngu(3200)
    }
    let n = 0
    if (!g.da_dang_dau) { await gui(null, dau, []); n++ }
    for (const t of tin) if (!daDang.has(t.nhan_su_id)) { await gui(t.nhan_su_id, t.text, t.viec); n++ }
    kq.push({ nhom: g.ten, da_gui: n })
  }
  return { ngay: d.ngay, so_ta: tin.length, nhom: kq }
}
