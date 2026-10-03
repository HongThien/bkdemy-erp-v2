// ============================================================================
// sinh-seed.mjs — sinh migration NẠP sổ tay KHTN (807 mục, GV đã duyệt — Thùy 03/10) từ JSON do boc-wiki.mjs bóc.
// ERP là GỐC sau lần nạp này: sửa trên màn Sổ tay ERP, KHÔNG nạp lại đè (migration chỉ chạy 1 lần).
// Chạy: node scripts/sotay-khtn/sinh-seed.mjs <wiki.json> <file migration ra>
// ============================================================================
import fs from 'node:fs'

const [, , vao, ra] = process.argv
const { chuDe, khung, wiki } = JSON.parse(fs.readFileSync(vao, 'utf8'))
const NHANH = { L: 'Lý', H: 'Hóa', S: 'Sinh' }
const THU_TU_NHANH = ['L', 'H', 'S']
const ids = new Set(wiki.map((w) => w.id))

// chủ đề theo khung (thứ tự phân môn L → H → S, trong phân môn theo khung của Pocket)
const cd = []
for (const [i, mon] of THU_TU_NHANH.entries()) {
  for (const [lop, ds] of Object.entries(khung[mon])) {
    ds.forEach((ma, j) => {
      if (!chuDe[ma]) throw new Error('khung có chủ đề không tên: ' + ma)
      if (!wiki.some((w) => w.cd === ma && String(w.lop) === lop)) return // chủ đề chưa có mục ⇒ không tạo
      cd.push({ mon: 'KHTN', khoi: lop, ma, ten: chuDe[ma].ten, thu_tu: (i + 1) * 100 + j + 1, nhanh: NHANH[mon] })
    })
  }
}
const coCd = new Set(cd.map((x) => `${x.khoi}|${x.ma}`))
for (const w of wiki) if (!coCd.has(`${w.lop}|${w.cd}`)) throw new Error(`mục ${w.id} trỏ chủ đề ngoài khung: ${w.lop}|${w.cd}`)

const hinh = wiki.filter((w) => w.hinh).map((w) => ({
  mon: 'KHTN', khoi: String(w.lop), ma: 'H-' + w.id, ten: w.ten,
  mo_ta: `Hình cho mục "${w.ten}". KHTN Pocket vẽ bằng code theo mã: ${w.hinh} — vẽ lại / xuất ảnh rồi gắn vào đây.`,
}))

const dem = {}
const muc = wiki.map((w) => {
  const k = `${w.lop}|${w.cd}`; dem[k] = (dem[k] ?? 0) + 1
  return {
    ma: w.id, mon: 'KHTN', khoi: String(w.lop), chu_de: w.cd, thu_tu: dem[k], loai: w.loai,
    ten: w.ten, ten_khac: w.kw ?? [], noi_dung: w.tom, cong_thuc: w.ct ?? null,
    y: w.y?.length ? w.y : null, bang: w.bang?.length ? w.bang : null, bien: w.bien?.length ? w.bien : null,
    vd: w.vd ?? null, nham: w.nham?.length ? w.nham : null,
    lq: (w.lq ?? []).filter((x) => ids.has(x)), // bỏ liên kết tới "thẻ ôn tập" riêng của Pocket (the-*)
    hinh: w.hinh ? 'H-' + w.id : null, nguon: ['KHTN Pocket'],
  }
})

const J = (x) => { const s = JSON.stringify(x); if (s.includes('$j$')) throw new Error('dữ liệu chứa $j$'); return `$j$${s}$j$::jsonb` }
const sql = `-- ============================================================================
-- sotay_khtn_nap — NẠP SỔ TAY KHTN lần đầu: ${muc.length} mục · ${cd.length} chủ đề · ${hinh.length} hình cần vẽ (Thùy 03/10)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy đưa sổ tay KHTN (artifact "KHTN Pocket", Lý/Hoá/Sinh lớp 6–9, soạn theo SGK KNTT) — "GV đã duyệt rồi, auto không cần duyệt lại";
--   "đưa lên ERP 1 lần làm gốc, từ đó tham chiếu lên app". ⇒ nạp ở trạng thái DA_DUYET (xet_boi null = máy nạp theo quyết định CEO).
--   Sau lần nạp này ERP là GỐC: sửa trên màn Sổ tay ERP; KHÔNG nạp lại đè. Sinh bằng scripts/sotay-khtn/sinh-seed.mjs từ JSON của
--   scripts/sotay-khtn/boc-wiki.mjs (chỉ chạy module dữ liệu trong vm sandbox). Mã mục = id của Pocket (vd h7-nguyen-tu) ⇒ "liên quan" nối đúng.
--   Bỏ 98 liên kết tới "thẻ ôn tập" riêng của Pocket (the-*) — app không có. Hình: KHTN Pocket vẽ bằng CODE ⇒ ghi vào sotay_ct_hinh với
--   url null (CHƯA VẼ), mô tả giữ mã vẽ; app chỉ hiện hình khi đã gắn ảnh.
--
-- MẤT GÌ (Luật xoá): không mất gì — chỉ thêm dòng (môn KHTN chưa có dòng sổ tay nào).
-- ============================================================================

do $$ begin
  if exists (select 1 from public.sotay_cong_thuc where mon = 'KHTN') then raise exception 'Đã có mục sổ tay KHTN — không nạp đè (ERP là gốc).'; end if;
end $$;

insert into public.sotay_ct_chu_de (mon, khoi, ma, ten, thu_tu, nhanh)
select mon, khoi, ma, ten, thu_tu, nhanh from jsonb_to_recordset(${J(cd)})
  as x(mon text, khoi text, ma text, ten text, thu_tu smallint, nhanh text);

insert into public.sotay_ct_hinh (mon, khoi, ma, ten, mo_ta)
select mon, khoi, ma, ten, mo_ta from jsonb_to_recordset(${J(hinh)})
  as x(mon text, khoi text, ma text, ten text, mo_ta text);

insert into public.sotay_cong_thuc (ma, mon, khoi, chu_de, thu_tu, loai, ten, ten_khac, noi_dung, cong_thuc, y, bang, bien, vd, nham, lq, hinh, nguon,
                                    trang_thai, xet_at)
select ma, mon, khoi, chu_de, thu_tu, loai, ten, ten_khac, noi_dung, cong_thuc, y, bang, bien, vd, nham, lq, hinh, nguon, 'da_duyet', now()
from jsonb_populate_recordset(null::public.sotay_cong_thuc, ${J(muc)});

do $$ declare v int; begin
  select count(*) into v from public.sotay_cong_thuc where mon = 'KHTN' and trang_thai = 'da_duyet';
  if v <> ${muc.length} then raise exception 'Nạp % mục, cần ${muc.length}', v; end if;
end $$;
`
fs.writeFileSync(ra, sql)
console.log('ok', muc.length, 'mục ·', cd.length, 'chủ đề ·', hinh.length, 'hình ·', (sql.length / 1024).toFixed(0), 'KB')
