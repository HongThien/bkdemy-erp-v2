// gan-cau.mjs — B3 K12: gắn câu đề thi (bảng Thùy đã duyệt) vào DẠNG MỚI của bản đồ mới. Chạy từ thư mục repo.
//   node kho-rules/dai/lo/k12-de/de-xuat/db/gan-cau.mjs [HS VT NHTP PPTD XS SDT | tat-ca] [--ghi] [--doi-lech-ai]
//   MẶC ĐỊNH = CHẠY THỬ: mọi lệnh ghi trong MỘT transaction rồi ROLLBACK; in đếm + md5 hai bảng gan_cau trước/sau.
//   --ghi = COMMIT thật (CHỈ khi Thùy đã gật). Bị chặn nếu còn mục NGUY (xem cuối).
//   --doi-lech-ai = với NHTP/PPTD (dạng cũ KHÔNG bị xoá): câu nguon='ai' đang ở dạng KHÁC nhãn duyệt ⇒ chuyển. Mặc định KHÔNG đụng, chỉ liệt kê.
// Nguồn nhãn: de-xuat/<CH>-cau-cuoi.tsv | <CH>-cau.tsv (ma_cau ⇥ nhãn ⇥ ghi chú). Nhãn = mã logic (tra db/ma-moi-<CH>.json) · NDB… (dạng
//   có sẵn của chủ đề) · CHUONG:<X> (câu thuộc chương X — dùng dòng của X nếu có, không thì bỏ) · CHUA (không gắn).
// LUẬT:
//   • Bảng đích theo NƠI CÂU SỐNG: dai_cau_hoi ⇒ dai_bdm_gan_cau · hgt_cau_hoi ⇒ hgt_bdm_gan_cau (cả hai FK dang_bai_id → dai_bdm_dang_bai).
//   • Gắn theo GỐC: khoá = coalesce(parent_ma_cau, ma_cau) (bản sao thừa kế qua _bdm_cau_giai / v kho). Bản sao có dòng riêng ở dạng CŨ
//     mà gốc có nhãn ⇒ chuyển theo nhãn gốc (liệt kê riêng).
//   • Chưa có dòng ⇒ INSERT nguon='ai'. Có dòng ở dạng CŨ sẽ xoá (HS/VT/XS/SDT) ⇒ UPDATE dang_bai_id, GIỮ nguon/actor/at (liệt kê riêng nguon='nguoi').
//     NHTP: dạng mới M1 ⇒ chuyển từ NDB00747/751/752. Đã đúng ⇒ GIỮ. Lệch khác (dạng không bị xoá / dạng mới khác / chủ đề khác) ⇒ KHÔNG đụng, liệt kê.
//   • Không đụng: dai_bdm_kho_ds/hgt_bdm_kho_ds, câu xoa_at ≠ null, câu dung_sai, dai_bdm_de_xuat.
//   • Idempotent: UPDATE có điều kiện dạng cũ, INSERT on conflict do nothing ⇒ chạy lại = 0 thay đổi.
//   • Trigger: trg_*_gan_cau_log ghi dai_bdm_log mỗi dòng (actor NULL); _bdm_cam_dung_sai chặn INSERT câu Đ/S (đã lọc trước).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { bien } from '../../../../../../scripts/kho/cau-hinh.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const DX = join(DIR, '..')
const CH = {
  HS: { tep: 'HS-cau-cuoi.tsv', cd: 'NCD00094', xoa: true },
  VT: { tep: 'VT-cau-cuoi.tsv', cd: 'NCD00096', xoa: true },
  XS: { tep: 'XS-cau.tsv', cd: 'NCD00097', xoa: true },
  SDT: { tep: 'SDT-cau.tsv', cd: 'NCD00098', xoa: true },
  NHTP: { tep: 'NHTP-cau-cuoi.tsv', cd: 'NCD00095', xoa: false },
  PPTD: { tep: 'PPTD-cau-cuoi.tsv', cd: 'NCD00099', xoa: false },
}
const M1_TU = ['NDB00747', 'NDB00751', 'NDB00752'] // NHTP: dạng cũ được phép chuyển sang M1
const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const DOI_LECH_AI = args.includes('--doi-lech-ai')
let ds = args.filter((a) => !a.startsWith('--'))
if (!ds.length || ds.includes('tat-ca')) ds = Object.keys(CH)
if (ds.some((x) => !CH[x])) { console.error('Dùng: node …/db/gan-cau.mjs [HS VT NHTP PPTD XS SDT | tat-ca] [--ghi] [--doi-lech-ai]'); process.exit(2) }
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!url) { console.error('Thiếu chuỗi kết nối'); process.exit(2) }
const in_ = (...a) => console.log(...a)

// ── 1. Đọc nhãn ────────────────────────────────────────────────────────────────────────────────────────────
const MM = {}, dong = {} // dong[ch] = [{ma, nhan, ghi}]
for (const ch of Object.keys(CH)) { // đọc CẢ 6 để giải CHUONG:<X>
  MM[ch] = JSON.parse(readFileSync(join(DIR, `ma-moi-${ch}.json`), 'utf8'))
  if (MM[ch].chu_de !== CH[ch].cd) throw new Error(`ma-moi-${ch}.json chu_de ${MM[ch].chu_de} ≠ ${CH[ch].cd}`)
  dong[ch] = readFileSync(join(DX, CH[ch].tep), 'utf8').split(/\r?\n/).filter((l) => l.trim()).map((l) => { const [ma, nhan, ghi = ''] = l.split('\t'); return { ma: ma.trim(), nhan: nhan.trim(), ghi } })
}
const coTrong = (ch, ma) => dong[ch].some((d) => d.ma === ma && !/^CHUONG:|^CHUA$/.test(d.nhan))
const nguy = [] // mục NGUY ⇒ chặn --ghi
const nhanCau = new Map() // ma → {ch, dang, logic}
const boQua = [] // {ch, ma, ly_do}
for (const ch of ds) for (const d of dong[ch]) {
  let dang = null
  if (d.nhan === 'CHUA') { boQua.push({ ch, ma: d.ma, ly: 'CHUA' }); continue }
  const m = d.nhan.match(/^CHUONG:(.+)$/)
  if (m) { const x = m[1]; boQua.push({ ch, ma: d.ma, ly: CH[x] && coTrong(x, d.ma) ? `CHUONG:${x} (dòng của ${x} xử lý)` : `CHUONG:${x} (không có dòng ở ${x} ⇒ bỏ)`, sangX: CH[x] && coTrong(x, d.ma) && ds.includes(x) }); continue }
  if (/^NDB\d{5}$/.test(d.nhan)) dang = d.nhan
  else dang = MM[ch].dang[d.nhan]
  if (!dang) { nguy.push(`${ch} ${d.ma}: nhãn «${d.nhan}» không tra được mã DB`); continue }
  const cu = nhanCau.get(d.ma)
  if (cu && cu.dang !== dang) { nguy.push(`${d.ma}: hai nhãn khác nhau ${cu.ch}:${cu.dang} ≠ ${ch}:${dang}`); continue }
  nhanCau.set(d.ma, { ch, dang, logic: d.nhan })
}

// ── 2. Ảnh chụp 2 bảng gan_cau ─────────────────────────────────────────────────────────────────────────────
async function chup(c) {
  const r = {}
  for (const t of ['dai_bdm_gan_cau', 'hgt_bdm_gan_cau', 'dai_bdm_kho_ds', 'hgt_bdm_kho_ds']) {
    r[t] = (await c.query(`select count(*)::int n, md5(coalesce(string_agg(ma_cau||'|'||${t.includes('kho_ds') ? 'chu_de_id' : 'dang_bai_id'}||'|'||nguon||'|'||coalesce(actor::text,'')||'|'||at::text, ',' order by ma_cau),'')) h from ${t}`)).rows[0]
  }
  r.log = (await c.query(`select count(*)::int n, coalesce(max(id),0)::bigint mx from dai_bdm_log`)).rows[0]
  return r
}
const inChup = (nhan, s) => in_(`[${nhan}] ` + ['dai_bdm_gan_cau', 'hgt_bdm_gan_cau', 'dai_bdm_kho_ds', 'hgt_bdm_kho_ds'].map((t) => `${t} ${s[t].n} (md5 ${s[t].h.slice(0, 10)})`).join(' · ') + ` · dai_bdm_log ${s.log.n}`)

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
let ma = 0
try {
  const truoc = await chup(c)
  inChup('trước', truoc)
  await c.query('begin')
  await c.query(`set local statement_timeout = '180s'`)
  const Q = async (s, p) => (await c.query(s, p)).rows

  // dạng của 6 chủ đề (nhân chứng thứ hai: dạng đích phải thuộc đúng chủ đề)
  const dangCd = new Map((await Q(`select d.id, n.chu_de_id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id = any($1)`, [Object.values(CH).map((x) => x.cd)])).map((x) => [x.id, x.chu_de_id]))
  const moiTat = new Set(Object.values(MM).flatMap((m) => Object.values(m.dang)))
  const CU_XOA = new Set([...dangCd].filter(([id, cd]) => Object.values(CH).some((x) => x.xoa && x.cd === cd) && !moiTat.has(id)).map(([id]) => id))
  in_(`Dạng CŨ sẽ bị xoá (HS/VT/XS/SDT, không thuộc ma-moi): ${CU_XOA.size} — ${[...CU_XOA].sort().join(',')}`)
  for (const [m, n] of nhanCau) { const cd = dangCd.get(n.dang); if (cd !== CH[n.ch].cd) nguy.push(`${m}: dạng ${n.dang} (${n.ch}) thuộc ${cd ?? 'KHÔNG TỒN TẠI'} ≠ ${CH[n.ch].cd}`) ; if (CU_XOA.has(n.dang)) nguy.push(`${m}: nhãn trỏ vào dạng CŨ sẽ xoá ${n.dang}`) }

  // thông tin câu (cả câu trong bảng nhãn lẫn gốc của chúng)
  const tatMa = [...new Set([...nhanCau.keys(), ...boQua.map((b) => b.ma)])]
  const thongTin = async (mas) => new Map((await Q(`select m.ma, d.ma_cau is not null o_dai, h.ma_cau is not null o_hgt,
      coalesce(d.parent_ma_cau, h.parent_ma_cau) parent, coalesce(d.xoa_at, h.xoa_at) xoa_at, coalesce(d.loai_cau, h.loai_cau) loai,
      kd.ma_cau is not null o_kho_ds_dai, kh.ma_cau is not null o_kho_ds_hgt, gd.dang_bai_id gan_dai, gd.nguon ng_dai, gh.dang_bai_id gan_hgt, gh.nguon ng_hgt
    from unnest($1::text[]) m(ma) left join dai_cau_hoi d on d.ma_cau=m.ma left join hgt_cau_hoi h on h.ma_cau=m.ma
    left join dai_bdm_kho_ds kd on kd.ma_cau=m.ma left join hgt_bdm_kho_ds kh on kh.ma_cau=m.ma
    left join dai_bdm_gan_cau gd on gd.ma_cau=m.ma left join hgt_bdm_gan_cau gh on gh.ma_cau=m.ma`, [mas])).map((x) => [x.ma, x]))
  const TT = await thongTin(tatMa)
  const goc = [...new Set([...TT.values()].map((x) => x.parent).filter(Boolean))].filter((p) => !TT.has(p))
  for (const [k, v] of await thongTin(goc)) TT.set(k, v)

  // ── 3. Quyết định từng câu ───────────────────────────────────────────────────────────────────────────────
  const viec = { dai: { ins: [], upd: [] }, hgt: { ins: [], upd: [] } }
  const KQ = [] // {ch, ma, goc, bang, viec, cu, nguon, moi, ghi}
  const nhanGoc = new Map() // gốc → {dang, tu ma}
  for (const [m, n] of nhanCau) {
    const t = TT.get(m)
    const rec = { ch: n.ch, ma: m, moi: n.dang, logic: n.logic }
    if (!t || (!t.o_dai && !t.o_hgt)) { KQ.push({ ...rec, viec: 'KHONG_CO_CAU' }); nguy.push(`${m}: không có trong dai_cau_hoi lẫn hgt_cau_hoi`); continue }
    if (t.o_dai && t.o_hgt) { KQ.push({ ...rec, viec: 'HAI_BANG' }); nguy.push(`${m}: có ở CẢ dai_cau_hoi và hgt_cau_hoi`); continue }
    const g = t.parent ?? m
    if (t.parent && t.gan_dai == null && t.gan_hgt == null) { /* bản sao không có dòng riêng: gắn vào gốc */ }
    const cu = nhanGoc.get(g)
    if (cu && cu.dang !== n.dang) { nguy.push(`gốc ${g}: bản sao/gốc mang nhãn khác nhau (${cu.ma}:${cu.dang} ≠ ${m}:${n.dang})`); KQ.push({ ...rec, goc: g, viec: 'GOC_LECH' }); continue }
    if (cu) { KQ.push({ ...rec, goc: g, viec: 'TRUNG_GOC' }); continue }
    nhanGoc.set(g, { dang: n.dang, ma: m, ch: n.ch })
  }
  for (const [g, n] of nhanGoc) {
    const t = TT.get(g)
    const bang = t.o_dai ? 'dai' : 'hgt'
    const cu = bang === 'dai' ? t.gan_dai : t.gan_hgt, ng = bang === 'dai' ? t.ng_dai : t.ng_hgt
    const rec = { ch: n.ch, ma: n.ma, goc: g, bang, cu, nguon: ng, moi: n.dang }
    if (t.xoa_at) { KQ.push({ ...rec, viec: 'BO_KHO_RAC' }); continue }
    if (t.loai === 'dung_sai') { KQ.push({ ...rec, viec: 'BO_DUNG_SAI' }); continue }
    if (t.o_kho_ds_dai || t.o_kho_ds_hgt) { KQ.push({ ...rec, viec: 'BO_KHO_DS' }); continue }
    if (cu == null) { viec[bang].ins.push([g, n.dang]); KQ.push({ ...rec, viec: 'INSERT' }); continue }
    if (cu === n.dang) { KQ.push({ ...rec, viec: 'GIU' }); continue }
    const choChuyen = CU_XOA.has(cu) || (n.dang === MM.NHTP.dang.M1 && M1_TU.includes(cu))
    if (choChuyen) { viec[bang].upd.push([g, n.dang, cu]); KQ.push({ ...rec, viec: 'MOVE' }); continue }
    const lech = moiTat.has(cu) ? 'LECH_DANG_MOI' : dangCd.has(cu) ? 'LECH_GIU_CU' : 'LECH_CHU_DE_KHAC'
    if (lech === 'LECH_GIU_CU' && DOI_LECH_AI && ng === 'ai') { viec[bang].upd.push([g, n.dang, cu]); KQ.push({ ...rec, viec: 'MOVE_LECH_AI' }); continue }
    KQ.push({ ...rec, viec: lech })
  }
  // bản sao có dòng RIÊNG ở dạng cũ sẽ xoá, gốc có nhãn ⇒ chuyển theo gốc
  const banSao = await Q(`select 'dai' bang, c.ma_cau, c.parent_ma_cau goc, g.dang_bai_id cu, g.nguon from dai_bdm_gan_cau g join dai_cau_hoi c using(ma_cau) where c.parent_ma_cau = any($1) and c.xoa_at is null
    union all select 'hgt', c.ma_cau, c.parent_ma_cau, g.dang_bai_id, g.nguon from hgt_bdm_gan_cau g join hgt_cau_hoi c using(ma_cau) where c.parent_ma_cau = any($1) and c.xoa_at is null`, [[...nhanGoc.keys()]])
  for (const b of banSao) {
    const n = nhanGoc.get(b.goc)
    if (b.cu === n.dang) KQ.push({ ch: n.ch, ma: b.ma_cau, goc: b.goc, bang: b.bang, cu: b.cu, nguon: b.nguon, moi: n.dang, viec: 'GIU_BAN_SAO' })
    else if (CU_XOA.has(b.cu)) { viec[b.bang].upd.push([b.ma_cau, n.dang, b.cu]); KQ.push({ ch: n.ch, ma: b.ma_cau, goc: b.goc, bang: b.bang, cu: b.cu, nguon: b.nguon, moi: n.dang, viec: 'MOVE_BAN_SAO' }) }
    else KQ.push({ ch: n.ch, ma: b.ma_cau, goc: b.goc, bang: b.bang, cu: b.cu, nguon: b.nguon, moi: n.dang, viec: 'LECH_BAN_SAO' })
  }

  // ── 4. Ghi (trong transaction) ──────────────────────────────────────────────────────────────────────────
  const dem = { ins: 0, upd: 0 }
  for (const bang of ['dai', 'hgt']) {
    const t = `${bang}_bdm_gan_cau`
    const { ins, upd } = viec[bang]
    if (ins.length) dem.ins += (await c.query(`insert into ${t} (ma_cau, dang_bai_id, nguon) select m, d, 'ai' from unnest($1::text[], $2::text[]) v(m, d) on conflict (ma_cau) do nothing`, [ins.map((x) => x[0]), ins.map((x) => x[1])])).rowCount
    if (upd.length) dem.upd += (await c.query(`update ${t} g set dang_bai_id = v.d from unnest($1::text[], $2::text[], $3::text[]) v(m, d, cu) where g.ma_cau = v.m and g.dang_bai_id = v.cu`, [upd.map((x) => x[0]), upd.map((x) => x[1]), upd.map((x) => x[2])])).rowCount
  }
  const kyVong = { ins: viec.dai.ins.length + viec.hgt.ins.length, upd: viec.dai.upd.length + viec.hgt.upd.length }
  if (dem.ins !== kyVong.ins || dem.upd !== kyVong.upd) nguy.push(`số dòng ghi lệch kỳ vọng: INSERT ${dem.ins}/${kyVong.ins} · UPDATE ${dem.upd}/${kyVong.upd}`)

  // ── 5. Báo cáo ──────────────────────────────────────────────────────────────────────────────────────────
  const LOAI = ['INSERT', 'MOVE', 'MOVE_BAN_SAO', 'MOVE_LECH_AI', 'GIU', 'GIU_BAN_SAO', 'TRUNG_GOC', 'LECH_GIU_CU', 'LECH_DANG_MOI', 'LECH_CHU_DE_KHAC', 'LECH_BAN_SAO', 'BO_KHO_RAC', 'BO_DUNG_SAI', 'BO_KHO_DS', 'GOC_LECH', 'HAI_BANG', 'KHONG_CO_CAU']
  in_(`\n══ THEO CHƯƠNG (dòng nhãn → việc) ══`)
  in_(['chương', 'dòng tsv', ...LOAI, 'CHUA', 'CHUONG:→', 'CHUONG:bỏ'].join('\t'))
  for (const ch of ds) {
    const k = KQ.filter((x) => x.ch === ch), b = boQua.filter((x) => x.ch === ch)
    in_([ch, dong[ch].length, ...LOAI.map((l) => k.filter((x) => x.viec === l).length), b.filter((x) => x.ly === 'CHUA').length, b.filter((x) => /xử lý/.test(x.ly)).length, b.filter((x) => /bỏ/.test(x.ly)).length].join('\t'))
  }
  in_(`Ghi trong transaction: INSERT ${dem.ins} · UPDATE ${dem.upd} (dai: +${viec.dai.ins.length}/~${viec.dai.upd.length} · hgt: +${viec.hgt.ins.length}/~${viec.hgt.upd.length})`)

  in_(`\n══ THEO DẠNG MỚI / DẠNG ĐÍCH: số câu trong tsv (gốc, duy nhất) vs số dòng gan_cau (dai+hgt) sau khi ghi ══`)
  const sau = new Map((await Q(`select dang_bai_id, count(*)::int n from (select dang_bai_id from dai_bdm_gan_cau union all select dang_bai_id from hgt_bdm_gan_cau) x where dang_bai_id = any($1) group by 1`, [[...new Set([...nhanGoc.values()].map((x) => x.dang))]])).map((x) => [x.dang_bai_id, x.n]))
  const logicCua = new Map(); for (const ch of Object.keys(MM)) for (const [l, id] of Object.entries(MM[ch].dang)) logicCua.set(id, `${ch}:${l}`)
  const theoDang = new Map()
  for (const [, n] of nhanGoc) { const o = theoDang.get(n.dang) ?? { ch: n.ch, tsv: 0, INSERT: 0, MOVE: 0, GIU: 0, khac: 0 }; o.tsv++; theoDang.set(n.dang, o) }
  for (const k of KQ) { const o = theoDang.get(k.moi); if (!o || ['TRUNG_GOC', 'GOC_LECH'].includes(k.viec)) continue; if (k.viec === 'INSERT') o.INSERT++; else if (k.viec.startsWith('MOVE')) o.MOVE++; else if (k.viec.startsWith('GIU')) o.GIU++; else o.khac++ }
  in_(['dạng', 'logic', 'tsv', 'INSERT', 'MOVE', 'GIU', 'không ghi', 'gan_cau sau', 'lệch'].join('\t'))
  let lechDang = 0
  for (const [id, o] of [...theoDang].sort((a, b) => (logicCua.get(a[0]) ?? a[0]).localeCompare(logicCua.get(b[0]) ?? b[0]))) {
    const s = sau.get(id) ?? 0, phaiCo = o.INSERT + o.MOVE + o.GIU
    const ghiChu = !moiTat.has(id) ? `(dạng có sẵn; gan_cau sau gồm cả câu ngoài tsv)` : s !== o.tsv ? `≠ tsv ${s - o.tsv > 0 ? '+' : ''}${s - o.tsv}` : ''
    if (moiTat.has(id) && s !== phaiCo + 0 && s < phaiCo) lechDang++
    in_([id, logicCua.get(id) ?? '(cũ)', o.tsv, o.INSERT, o.MOVE, o.GIU, o.khac, s, ghiChu].join('\t'))
  }
  const moiKhongCau = [...moiTat].filter((id) => !theoDang.has(id) && ds.includes(logicCua.get(id)?.split(':')[0]))
  if (moiKhongCau.length) in_(`Dạng mới KHÔNG có câu nào trong tsv: ${moiKhongCau.map((id) => `${id}(${logicCua.get(id)})`).join(', ')}`)

  const nhom = (v) => KQ.filter((x) => x.viec === v)
  const inDs = (tieuDe, a) => { if (!a.length) return; in_(`\n── ${tieuDe}: ${a.length}`); for (const x of a.slice(0, 400)) in_(`  ${x.ch}\t${x.ma}${x.goc && x.goc !== x.ma ? ` (gốc ${x.goc})` : ''}\t${x.bang ?? ''}\tcũ ${x.cu ?? '—'}/${x.nguon ?? '—'}\t→ ${x.moi} ${logicCua.get(x.moi) ?? ''}`) }
  inDs('MOVE câu NGƯỜI gán (nguon=nguoi) — dạng cũ sẽ xoá nên vẫn chuyển, Thùy xem', KQ.filter((x) => x.viec.startsWith('MOVE') && x.nguon === 'nguoi'))
  inDs('MOVE NHTP → M1', KQ.filter((x) => x.viec === 'MOVE' && M1_TU.includes(x.cu)))
  inDs('MOVE bản sao (dòng riêng của bản sao, theo nhãn gốc)', nhom('MOVE_BAN_SAO'))
  inDs('LỆCH, dạng cũ KHÔNG bị xoá (NHTP/PPTD) — KHÔNG đụng' + (DOI_LECH_AI ? ' (trừ nguon=ai đã chuyển)' : ''), nhom('LECH_GIU_CU'))
  inDs('LỆCH, đang ở DẠNG MỚI khác — KHÔNG đụng', nhom('LECH_DANG_MOI'))
  inDs('LỆCH, đang ở dạng của CHỦ ĐỀ KHÁC — KHÔNG đụng', nhom('LECH_CHU_DE_KHAC'))
  inDs('LỆCH bản sao — KHÔNG đụng', nhom('LECH_BAN_SAO'))
  inDs('BỎ: câu trong kho rác (xoa_at)', nhom('BO_KHO_RAC'))
  inDs('BỎ: câu Đúng/Sai', nhom('BO_DUNG_SAI'))
  inDs('BỎ: câu đang ở kho Đ/S (kho_ds)', nhom('BO_KHO_DS'))
  inDs('Bản sao trùng gốc đã có nhãn (gộp)', nhom('TRUNG_GOC'))

  // ── 6. MỒ CÔI: dòng gan_cau còn trỏ dạng CŨ sẽ xoá SAU khi ghi ─────────────────────────────────────────
  const conLai = await Q(`select 'dai' bang, g.ma_cau, g.dang_bai_id, g.nguon, c.parent_ma_cau, c.xoa_at is not null rac, c.loai_cau, n.chu_de_id, d.ten dang_ten
      from dai_bdm_gan_cau g join dai_cau_hoi c using(ma_cau) join dai_bdm_dang_bai d on d.id=g.dang_bai_id join dai_bdm_nhom n on n.id=d.nhom_id where g.dang_bai_id = any($1)
    union all select 'hgt', g.ma_cau, g.dang_bai_id, g.nguon, c.parent_ma_cau, c.xoa_at is not null, c.loai_cau, n.chu_de_id, d.ten
      from hgt_bdm_gan_cau g join hgt_cau_hoi c using(ma_cau) join dai_bdm_dang_bai d on d.id=g.dang_bai_id join dai_bdm_nhom n on n.id=d.nhom_id where g.dang_bai_id = any($1)
    order by 8, 3, 2`, [[...CU_XOA]])
  const cdTen = { NCD00094: 'HS', NCD00096: 'VT', NCD00097: 'XS', NCD00098: 'SDT' }
  const vi = (r) => {
    const k = KQ.find((x) => x.ma === r.ma_cau || x.goc === r.ma_cau)
    if (k) return `có nhãn nhưng ${k.viec} (→ ${k.moi})`
    const b = boQua.filter((x) => x.ma === r.ma_cau)
    if (b.length) return b.map((x) => `${x.ch}: ${x.ly}`).join('; ')
    if (r.rac) return 'kho rác (xoa_at)'
    const ch = Object.keys(CH).filter((x) => dong[x].some((d) => d.ma === r.ma_cau))
    return ch.length ? `có trong tsv ${ch.join(',')} nhưng chương đó không chạy lần này` : 'KHÔNG có trong bảng nhãn nào'
  }
  in_(`\n══ MỒ CÔI (dòng gan_cau còn trỏ dạng CŨ sẽ xoá, sau khi ghi): ${conLai.length} ══`)
  const theoCd = {}; for (const r of conLai) { const k = `${cdTen[r.chu_de_id]}/${r.nguon}`; theoCd[k] = (theoCd[k] ?? 0) + 1 }
  in_('  ' + Object.entries(theoCd).map(([k, v]) => `${k} ${v}`).join(' · '))
  const md = [`# Mồ côi — câu đang gán dạng CŨ (HS/VT/XS/SDT) sẽ KHÔNG có chỗ ở bản đồ mới`, '',
    `> Sinh bởi \`gan-cau.mjs\` (chạy thử ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}, chương: ${ds.join(' ')}${DOI_LECH_AI ? ', --doi-lech-ai' : ''}). Danh sách = dòng \`dai_bdm_gan_cau\`/\`hgt_bdm_gan_cau\` vẫn trỏ dạng cũ SAU khi áp gan-cau. Xoá cây cũ (B5) mà không xử lý thì các dòng này chặn FK (no action) — tức B5 sẽ fail cho tới khi chúng được gắn lại hoặc xoá (Luật xoá: cần Thùy gật).`, '',
    `Tổng: **${conLai.length}** — ${Object.entries(theoCd).map(([k, v]) => `${k} ${v}`).join(' · ') || 'không có'}`, '',
    '| chương | bảng | ma_cau | gốc | dạng cũ | tên dạng cũ | nguon | loại câu | vì sao không có chỗ |', '|---|---|---|---|---|---|---|---|---|',
    ...conLai.map((r) => `| ${cdTen[r.chu_de_id]} | ${r.bang} | ${r.ma_cau} | ${r.parent_ma_cau ?? ''} | ${r.dang_bai_id} | ${r.dang_ten.replace(/\|/g, '/')} | ${r.nguon} | ${r.loai_cau} | ${vi(r)} |`)]
  writeFileSync(join(DIR, 'mo-coi.md'), md.join('\n') + '\n')
  for (const r of conLai.slice(0, 60)) in_(`  ${cdTen[r.chu_de_id]}\t${r.bang}\t${r.ma_cau}\t${r.dang_bai_id}\t${r.nguon}\t${vi(r)}`)
  if (conLai.length > 60) in_(`  … (đủ ở db/mo-coi.md)`)

  // FK khác còn trỏ dạng cũ (để biết trước B5 — script KHÔNG đụng)
  const fk = (await Q(`select (select count(*) from dai_bdm_de_xuat where dang_bai_id = any($1))::int dai_de_xuat, (select count(*) from hgt_bdm_de_xuat where dang_bai_id = any($1))::int hgt_de_xuat,
     (select count(*) from dai_cau_lop where dang_bai_id = any($1))::int dai_cau_lop, (select count(*) from dai_bdm_doi_ung where dich_dang_bai = any($1))::int doi_ung_dang,
     (select count(*) from dai_bdm_doi_ung_cum where dang_bai_id = any($1))::int doi_ung_cum`, [[...CU_XOA]]))[0]
  in_(`\nℹ FK khác còn trỏ dạng cũ (KHÔNG đụng ở đây, việc B5): ${Object.entries(fk).map(([k, v]) => `${k} ${v}`).join(' · ')}`)

  const lg = await Q(`select bang, hanh_dong, count(*)::int n from dai_bdm_log where id > $1 group by 1,2 order by 1,2`, [truoc.log.mx])
  in_(`\n[CẢNH BÁO TRIGGER] dai_bdm_log sẽ có thêm: ${lg.map((x) => `${x.bang}/${x.hanh_dong} ${x.n}`).join(' · ') || '(không)'} — actor NULL (script). _bdm_cam_dung_sai: câu Đ/S đã lọc trước nên không bắn.`)
  if (nguy.length) { in_(`\n✖ NGUY (${nguy.length}) — chặn --ghi:`); for (const x of nguy.slice(0, 100)) in_('  ' + x) }

  if (GHI && nguy.length) throw new Error('chặn --ghi vì còn mục NGUY')
  await c.query(GHI ? 'commit' : 'rollback')
  const sauC = await chup(c)
  inChup(`sau ${GHI ? 'COMMIT' : 'ROLLBACK'}`, sauC)
  if (!GHI) {
    const giong = ['dai_bdm_gan_cau', 'hgt_bdm_gan_cau', 'dai_bdm_kho_ds', 'hgt_bdm_kho_ds'].every((t) => truoc[t].n === sauC[t].n && truoc[t].h === sauC[t].h) && truoc.log.n === sauC.log.n
    in_(giong ? '✔ DB KHÔNG ĐỔI: đếm dòng + md5 hai bảng gan_cau, hai kho_ds và số dòng log trước = sau.' : '✘ CẢNH BÁO: trước ≠ sau — kiểm ngay!')
    if (!giong) ma = 4
    in_('Đã ROLLBACK. --ghi chỉ sau khi Thùy gật.')
  }
} catch (e) { ma = 1; try { await c.query('rollback') } catch {} ; console.error('✘ LỖI — đã rollback:', e.message) } finally { await c.end() }
process.exit(ma)
