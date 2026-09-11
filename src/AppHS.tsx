// AppHS — shell RIÊNG cho bundle hs.bkacademy.edu.vn (Thùy 21/08: "tách thành 1 subpage của BK
// như PH, làm nó thành webapp như phapp"). Y HỆT nhánh HS của App.tsx (session/hsId/must_change_
// password) nhưng KHÔNG import bất cứ gì thuộc màn staff (NhanSuHome/TopBar/useStore/phanquyen…)
// — mục tiêu: bundle build riêng (vite.config.hs.ts) không kéo theo code nội bộ, khỏi lộ ra domain
// công khai + nhẹ hơn nhiều so với app đầy đủ. KHÔNG có nhánh `hsId === null` (staff) — build này
// chỉ phục vụ HS, nhân sự vẫn dùng domain ERP nội bộ như cũ.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import HocSinhApp from './screens/hocsinh/HocSinhApp'
import DoiMatKhau from './screens/hocsinh/DoiMatKhau'
import HomeHS, { type HomeCard } from './screens/hocsinh/HomeHS'
import DanhSachHS, { type DsRow } from './screens/hocsinh/DanhSachHS'
import { getMyHocSinhId } from './lib/testonline'

// DEMO màn chính (CHỈ bản dev, không vào build): `hs.html?demo` · `?demo=nu` (nữ) · thêm `&ca` (banner bổ trợ)
// · `&khong` (không có bài). Để kiểm UI theo kit hs-home-v4 mà không cần mã+PIN của HS thật (Claude không
// được nhập mật khẩu) và để CEO so cạnh reference. Dữ liệu giả, không đụng Supabase.
function DemoHome() {
  const q = new URLSearchParams(location.search)
  const nu = q.get('demo') === 'nu' || q.get('nu') !== null
  const khong = q.has('khong')
  // `?demo=list` (+`&nu`, +`&rong`) — màn danh sách bài (kit hs-bai-tap-tren-lop-v1) với 4 trạng thái suy sẵn
  if (q.get('demo') === 'list') {
    const noop = () => {}
    const rows: DsRow[] = q.has('rong') ? [] : [
      { id: '1', ten: 'Bài tập Toán · 11A1', sub: 'Buổi 19/08/2026 · 87 câu', trangThai: 'moi', han: { text: 'Hạn 21/08 23:59 · còn 2 ngày 3h', muc: 'con_nhieu' }, khoa: false, onClick: noop },
      { id: '2', ten: 'Bài tập Toán · 11A1', sub: 'Buổi 12/08/2026 · 60 câu', trangThai: 'dang_lam', han: { text: 'Hạn 13/08 23:59 · còn 5h 12p', muc: 'sat' }, khoa: false, onClick: noop },
      { id: '3', ten: 'Bài tập Toán · 11A1', sub: 'Buổi 05/08/2026 · 42 câu', trangThai: 'qua_han', han: { text: 'Hạn 06/08 23:59 · quá hạn 3 ngày', muc: 'qua_han' }, khoa: true, onClick: noop },
    ]
    return <DanhSachHS tieuDe="Bài tập trên lớp" ill="purple_bookmark_book" gioiTinh={nu ? 'nu' : 'nam'} tab="chua" nChua={rows.length} nXong={2}
      rows={rows} dangTai={false} onBack={noop} onTab={noop} empty={<div className="rounded-[26px] bg-white/90 p-8 text-center">🎉 Không có bài nào cần làm</div>} />
  }
  const noop = () => {}
  const cards: HomeCard[] = [
    { id: 'giao_trinh', ten: 'Bài tập trên lớp', sub: khong ? 'Chưa có bài' : '1 bài chưa làm', subMau: khong ? 'xam' : 'ton', badge: khong ? 0 : 1, doodle: 'Cố lên!', ill: 'purple_bookmark_book', tone: 'pink', onClick: noop },
    { id: 'et', ten: 'ET', sub: 'Chưa có bài', subMau: 'xam', doodle: 'Kiến thức là sức mạnh', ill: 'orange_documents', tone: 'purple', onClick: noop },
    { id: 'btvn', ten: 'BTVN', sub: khong ? 'Chưa có bài' : '2 bài quá hạn', subMau: khong ? 'xam' : 'do', doodle: 'Ôn tập mỗi ngày nhé!', ill: 'homework_house', tone: 'orange', onClick: noop },
    { id: 'tu_luyen', ten: 'Tự luyện', sub: 'Luyện theo dạng yếu', subMau: 'xam', doodle: 'Small Steps Big Progress', ill: 'self_practice_target', tone: 'green', onClick: noop },
    { id: 'thong_tin', ten: 'Thông tin học tập', sub: 'Dạng đang yếu', subMau: 'xam', doodle: 'Hiểu mình để tiến bộ hơn!', ill: 'study_progress_chart', tone: 'blue', onClick: noop },
    { id: 'de_thi_thu', ten: 'Làm đề thi thử', sub: 'Sắp có', subMau: 'xam', doodle: 'Sắp ra mắt! Hãy chờ nhé!', ill: 'mock_exam_locked', tone: 'gray', disabled: true },
  ]
  return <HomeHS hoTen={nu ? 'Trần Mai Anh' : 'Nguyễn Văn Đức Huy'} maHS={nu ? 'hs0088' : 'hs0059'} lopMon={nu ? '11A2 - Toán' : '11A1 - Toán'} gioiTinh={nu ? 'nu' : 'nam'}
    anhUrl={null} onAnhChanged={noop} chuaDoc={3} lich={q.has('ca') ? [{ buoi_id: 'x', loai: 'bo_tro_yeu', ngay: '2026-09-10', gio_bat_dau: '16:00:00', gio_ket_thuc: '17:00:00', phong: 'P102', mon: 'Toán', nguoi: 'Cô Thùy', diem_danh: null, hom_nay: true, vao_ca: false }] : []} soRetest={q.has('ca') ? 1 : 0} cards={cards}
    onHopThu={noop} onDoiMK={noop} onThoat={noop} onLich={noop} onRetest={noop} />
}

export default function AppHS() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [hsId, setHsId] = useState<string | null | undefined>(undefined)
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('demo')) return <DemoHome />

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setHsId(undefined); return }
    setHsId(undefined)
    getMyHocSinhId().then((id) => setHsId(id)).catch(() => setHsId(null))
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!session) return <Login hsOnly />
  if (hsId === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!hsId) {
    // Đăng nhập bằng tài khoản KHÔNG phải HS (vd staff gõ nhầm domain này) — không có màn nào cho
    // họ ở đây, chỉ có thể đăng xuất. Domain hs.* CHỈ dành cho HS.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm text-slate-500">Tài khoản này không phải học sinh — trang này chỉ dành cho học sinh.</p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Đăng xuất</button>
      </div>
    )
  }

  // Cổng đổi mật khẩu: PIN provision = chính mã HS ⇒ đoán được ⇒ bài làm không quy được về đúng
  // 1 người. Chặn TRƯỚC khi vào app khi mật khẩu còn mặc định (cờ do script hs_buoc_doi_mk.mjs gắn).
  const phaiDoiMK = session.user.user_metadata?.must_change_password === true
  const maHS = (session.user.email ?? '').split('@')[0]
  return phaiDoiMK
    ? <DoiMatKhau maHS={maHS} batBuoc onXong={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />
    : <HocSinhApp hocSinhId={hsId} hoTen={(session.user.user_metadata?.ho_ten as string) || 'bạn'} maHS={maHS} />
}
