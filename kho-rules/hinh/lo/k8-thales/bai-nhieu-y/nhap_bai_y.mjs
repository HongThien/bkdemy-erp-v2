// Nhập 2 bài nhiều ý vào HH00143 (Đường trung bình, Hình–Học K8) theo mô hình MỚI 09/11: hinh_hoc_bai_y + mỗi ý = 1 câu (trigger ghép đề).
// Mặc định CHẠY THỬ (rollback, không upload). --ghi: upload hình + ghi thật.
import pg from 'pg'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
const S = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/fb8747b7-c80d-4be5-bd47-3c40acf97252/scratchpad/hinh_by'
const GHI = process.argv.includes('--ghi')
const BAI = 'HH00143'
const r = String.raw

const DIEU_KIEN_Y = (ten, cd, vuong, dai) => ({ ten, cd, vuong, dai })

// ───────────────────────── BÀI 1: Varignon (M,N,P,Q = trung điểm AB,BC,CD,DA) ─────────────────────────
const B1 = {
  hinh: 'BY1.png', hinhLG: 'BY1_lg.png',
  loi_dan: r`Cho tứ giác $ABCD$. Gọi $M$, $N$, $P$, $Q$ lần lượt là trung điểm của $AB$, $BC$, $CD$, $DA$.`,
  y: [
    {
      nhan: 'a', cau_hoi: r`Chứng minh tứ giác $MNPQ$ là hình bình hành.`, da_biet: null,
      loi_giai: [
        r`**Phần 1. Hướng dẫn**`,
        r`$MNPQ$ là hình bình hành`,
        r`$\Uparrow$ (tứ giác có một cặp cạnh đối song song và bằng nhau)`,
        r`$MN\parallel QP$ · $MN=QP$`,
        r`**Nhánh ①:** $MN\parallel QP$ và $MN=QP$`,
        r`$\Uparrow$ (cùng song song với $AC$ và cùng bằng $\dfrac12AC$)`,
        r`$MN$ là đường trung bình của $\triangle ABC$ · $QP$ là đường trung bình của $\triangle ADC$`,
        r`$\Uparrow$ (định nghĩa đường trung bình của tam giác)`,
        r`$M$, $N$ là trung điểm của $AB$, $BC$ ✓ (gt) · $Q$, $P$ là trung điểm của $DA$, $DC$ ✓ (gt)`,
        ``,
        r`**Phần 2. Trình bày**`,
        r`Xét $\triangle ABC$ có:`,
        r`$M$ là trung điểm của $AB$ (gt);`,
        r`$N$ là trung điểm của $BC$ (gt)`,
        r`nên $MN$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).`,
        r`Suy ra $MN\parallel AC$ và $MN=\dfrac12AC$ (tính chất đường trung bình). (1)`,
        r`Xét $\triangle ADC$ có:`,
        r`$Q$ là trung điểm của $DA$ (gt);`,
        r`$P$ là trung điểm của $DC$ (gt)`,
        r`nên $QP$ là đường trung bình của $\triangle ADC$ (định nghĩa đường trung bình).`,
        r`Suy ra $QP\parallel AC$ và $QP=\dfrac12AC$ (tính chất đường trung bình). (2)`,
        r`Từ (1) và (2) suy ra $MN\parallel QP$ và $MN=QP$.`,
        r`Tứ giác $MNPQ$ có một cặp cạnh đối song song và bằng nhau`,
        r`nên $MNPQ$ là hình bình hành (dấu hiệu nhận biết).`,
      ].join('\n'),
    },
    {
      nhan: 'b', cau_hoi: r`Tìm điều kiện của tứ giác $ABCD$ để tứ giác $MNPQ$ là hình chữ nhật.`, da_biet: r`Biết $MNPQ$ là hình bình hành (ý a).`,
      loi_giai: [
        r`**Phần 1. Hướng dẫn**`,
        r`$MNPQ$ là hình chữ nhật`,
        r`$\Uparrow$ (hình bình hành có một góc vuông)`,
        r`$MNPQ$ là hình bình hành ✓ (ý a) · $MN\perp NP$`,
        r`**Nhánh ①:** $MN\perp NP$`,
        r`$\Uparrow$ (một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia)`,
        r`$MN\parallel AC$ ✓ (ý a) · $AC\perp NP$`,
        r`**Nhánh ②:** $AC\perp NP$`,
        r`$\Uparrow$ (một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia)`,
        r`$NP\parallel BD$ · $AC\perp BD$`,
        r`**Nhánh ③:** $NP\parallel BD$`,
        r`$\Uparrow$ (tính chất đường trung bình của $\triangle CBD$)`,
        r`$N$, $P$ là trung điểm của $BC$, $CD$ ✓ (gt)`,
        r`**Điều kiện cần tìm:** $AC\perp BD$.`,
        ``,
        r`**Phần 2. Trình bày**`,
        r`Xét $\triangle CBD$ có:`,
        r`$N$ là trung điểm của $BC$ (gt);`,
        r`$P$ là trung điểm của $CD$ (gt)`,
        r`nên $NP$ là đường trung bình của $\triangle CBD$ (định nghĩa đường trung bình).`,
        r`Suy ra $NP\parallel BD$ và $NP=\dfrac12BD$ (tính chất đường trung bình). (1)`,
        r`Mà $MN\parallel AC$ (ý a). (2)`,
        r`Điều kiện cần tìm là $AC\perp BD$.`,
        r`Thật vậy, nếu $AC\perp BD$ thì:`,
        r`$NP\parallel BD$ (1) và $AC\perp BD$ nên $AC\perp NP$;`,
        r`$MN\parallel AC$ (2) và $AC\perp NP$ nên $MN\perp NP$, tức $\widehat{MNP}=90^\circ$.`,
        r`Hình bình hành $MNPQ$ (ý a) có một góc vuông`,
        r`nên $MNPQ$ là hình chữ nhật (dấu hiệu nhận biết).`,
        r`Ngược lại, nếu $MNPQ$ là hình chữ nhật thì $MN\perp NP$.`,
        r`Mà $MN\parallel AC$ (2) nên $AC\perp NP$;`,
        r`lại có $NP\parallel BD$ (1) nên $AC\perp BD$.`,
        r`Vậy $MNPQ$ là hình chữ nhật khi và chỉ khi $AC\perp BD$`,
        r`(hai đường chéo của tứ giác $ABCD$ vuông góc với nhau).`,
      ].join('\n'),
    },
    {
      nhan: 'c', cau_hoi: r`Tìm điều kiện của tứ giác $ABCD$ để tứ giác $MNPQ$ là hình vuông.`, da_biet: r`Biết $MNPQ$ là hình bình hành (ý a).`,
      loi_giai: [
        r`**Phần 1. Hướng dẫn**`,
        r`$MNPQ$ là hình vuông`,
        r`$\Uparrow$ (hình chữ nhật có hai cạnh kề bằng nhau)`,
        r`$MNPQ$ là hình chữ nhật ✓ (ý b: $AC\perp BD$) · $MN=NP$`,
        r`**Nhánh ①:** $MN=NP$`,
        r`$\Uparrow$ (tính chất đường trung bình: $MN=\dfrac12AC$, $NP=\dfrac12BD$)`,
        r`$AC=BD$`,
        r`**Điều kiện cần tìm:** $AC\perp BD$ và $AC=BD$.`,
        ``,
        r`**Phần 2. Trình bày**`,
        r`Theo ý a) và ý b): $MN=\dfrac12AC$, $NP=\dfrac12BD$.`,
        r`Điều kiện cần tìm là $AC\perp BD$ và $AC=BD$.`,
        r`Thật vậy, nếu $AC\perp BD$ và $AC=BD$ thì:`,
        r`$MNPQ$ là hình chữ nhật (ý b);`,
        r`$MN=\dfrac12AC=\dfrac12BD=NP$.`,
        r`Hình chữ nhật $MNPQ$ có hai cạnh kề $MN=NP$`,
        r`nên $MNPQ$ là hình vuông (dấu hiệu nhận biết).`,
        r`Ngược lại, nếu $MNPQ$ là hình vuông thì $MNPQ$ là hình chữ nhật,`,
        r`suy ra $AC\perp BD$ (ý b);`,
        r`và $MN=NP$ nên $\dfrac12AC=\dfrac12BD$, tức $AC=BD$.`,
        r`Vậy $MNPQ$ là hình vuông khi và chỉ khi $AC\perp BD$ và $AC=BD$.`,
      ].join('\n'),
    },
  ],
}

// ───────────────────────── BÀI 2: M∈AB, N∈AC, P∈CD, Q∈DB trung điểm ─────────────────────────
const B2 = {
  hinh: 'BY2.png', hinhLG: 'BY2.png',
  loi_dan: r`Cho tứ giác $ABCD$ ($BC$ không song song với $AD$). Gọi $M$, $N$, $P$, $Q$ lần lượt là trung điểm của $AB$, $AC$, $CD$, $DB$.`,
  y: [
    {
      nhan: 'a', cau_hoi: r`Chứng minh tứ giác $MNPQ$ là hình bình hành.`, da_biet: null,
      loi_giai: [
        r`**Phần 1. Hướng dẫn**`,
        r`$MNPQ$ là hình bình hành`,
        r`$\Uparrow$ (tứ giác có một cặp cạnh đối song song và bằng nhau)`,
        r`$MN\parallel QP$ · $MN=QP$`,
        r`**Nhánh ①:** $MN\parallel QP$ và $MN=QP$`,
        r`$\Uparrow$ (cùng song song với $BC$ và cùng bằng $\dfrac12BC$)`,
        r`$MN$ là đường trung bình của $\triangle ABC$ · $QP$ là đường trung bình của $\triangle DBC$`,
        r`$\Uparrow$ (định nghĩa đường trung bình của tam giác)`,
        r`$M$, $N$ là trung điểm của $AB$, $AC$ ✓ (gt) · $Q$, $P$ là trung điểm của $DB$, $DC$ ✓ (gt)`,
        ``,
        r`**Phần 2. Trình bày**`,
        r`Xét $\triangle ABC$ có:`,
        r`$M$ là trung điểm của $AB$ (gt);`,
        r`$N$ là trung điểm của $AC$ (gt)`,
        r`nên $MN$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).`,
        r`Suy ra $MN\parallel BC$ và $MN=\dfrac12BC$ (tính chất đường trung bình). (1)`,
        r`Xét $\triangle DBC$ có:`,
        r`$Q$ là trung điểm của $DB$ (gt);`,
        r`$P$ là trung điểm của $DC$ (gt)`,
        r`nên $QP$ là đường trung bình của $\triangle DBC$ (định nghĩa đường trung bình).`,
        r`Suy ra $QP\parallel BC$ và $QP=\dfrac12BC$ (tính chất đường trung bình). (2)`,
        r`Từ (1) và (2) suy ra $MN\parallel QP$ và $MN=QP$.`,
        r`Tứ giác $MNPQ$ có một cặp cạnh đối song song và bằng nhau`,
        r`nên $MNPQ$ là hình bình hành (dấu hiệu nhận biết).`,
      ].join('\n'),
    },
    {
      nhan: 'b', cau_hoi: r`Tìm điều kiện của tứ giác $ABCD$ để tứ giác $MNPQ$ là hình chữ nhật.`, da_biet: r`Biết $MNPQ$ là hình bình hành (ý a).`,
      loi_giai: [
        r`**Phần 1. Hướng dẫn**`,
        r`$MNPQ$ là hình chữ nhật`,
        r`$\Uparrow$ (hình bình hành có một góc vuông)`,
        r`$MNPQ$ là hình bình hành ✓ (ý a) · $MN\perp NP$`,
        r`**Nhánh ①:** $MN\perp NP$`,
        r`$\Uparrow$ (một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia)`,
        r`$MN\parallel BC$ ✓ (ý a) · $BC\perp NP$`,
        r`**Nhánh ②:** $BC\perp NP$`,
        r`$\Uparrow$ (một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia)`,
        r`$NP\parallel AD$ · $BC\perp AD$`,
        r`**Nhánh ③:** $NP\parallel AD$`,
        r`$\Uparrow$ (tính chất đường trung bình của $\triangle ACD$)`,
        r`$N$, $P$ là trung điểm của $AC$, $CD$ ✓ (gt)`,
        r`**Điều kiện cần tìm:** $BC\perp AD$.`,
        ``,
        r`**Phần 2. Trình bày**`,
        r`Xét $\triangle ACD$ có:`,
        r`$N$ là trung điểm của $AC$ (gt);`,
        r`$P$ là trung điểm của $CD$ (gt)`,
        r`nên $NP$ là đường trung bình của $\triangle ACD$ (định nghĩa đường trung bình).`,
        r`Suy ra $NP\parallel AD$ và $NP=\dfrac12AD$ (tính chất đường trung bình). (1)`,
        r`Mà $MN\parallel BC$ (ý a). (2)`,
        r`Điều kiện cần tìm là $BC\perp AD$.`,
        r`Thật vậy, nếu $BC\perp AD$ thì:`,
        r`$NP\parallel AD$ (1) và $BC\perp AD$ nên $BC\perp NP$;`,
        r`$MN\parallel BC$ (2) và $BC\perp NP$ nên $MN\perp NP$, tức $\widehat{MNP}=90^\circ$.`,
        r`Hình bình hành $MNPQ$ (ý a) có một góc vuông`,
        r`nên $MNPQ$ là hình chữ nhật (dấu hiệu nhận biết).`,
        r`Ngược lại, nếu $MNPQ$ là hình chữ nhật thì $MN\perp NP$.`,
        r`Mà $MN\parallel BC$ (2) nên $BC\perp NP$;`,
        r`lại có $NP\parallel AD$ (1) nên $BC\perp AD$.`,
        r`Vậy $MNPQ$ là hình chữ nhật khi và chỉ khi $BC\perp AD$`,
        r`(hai cạnh đối $BC$ và $AD$ của tứ giác $ABCD$ vuông góc với nhau).`,
      ].join('\n'),
    },
    {
      nhan: 'c', cau_hoi: r`Tìm điều kiện của tứ giác $ABCD$ để tứ giác $MNPQ$ là hình vuông.`, da_biet: r`Biết $MNPQ$ là hình bình hành (ý a).`,
      loi_giai: [
        r`**Phần 1. Hướng dẫn**`,
        r`$MNPQ$ là hình vuông`,
        r`$\Uparrow$ (hình chữ nhật có hai cạnh kề bằng nhau)`,
        r`$MNPQ$ là hình chữ nhật ✓ (ý b: $BC\perp AD$) · $MN=NP$`,
        r`**Nhánh ①:** $MN=NP$`,
        r`$\Uparrow$ (tính chất đường trung bình: $MN=\dfrac12BC$, $NP=\dfrac12AD$)`,
        r`$BC=AD$`,
        r`**Điều kiện cần tìm:** $BC\perp AD$ và $BC=AD$.`,
        ``,
        r`**Phần 2. Trình bày**`,
        r`Theo ý a) và ý b): $MN=\dfrac12BC$, $NP=\dfrac12AD$.`,
        r`Điều kiện cần tìm là $BC\perp AD$ và $BC=AD$.`,
        r`Thật vậy, nếu $BC\perp AD$ và $BC=AD$ thì:`,
        r`$MNPQ$ là hình chữ nhật (ý b);`,
        r`$MN=\dfrac12BC=\dfrac12AD=NP$.`,
        r`Hình chữ nhật $MNPQ$ có hai cạnh kề $MN=NP$`,
        r`nên $MNPQ$ là hình vuông (dấu hiệu nhận biết).`,
        r`Ngược lại, nếu $MNPQ$ là hình vuông thì $MNPQ$ là hình chữ nhật,`,
        r`suy ra $BC\perp AD$ (ý b);`,
        r`và $MN=NP$ nên $\dfrac12BC=\dfrac12AD$, tức $BC=AD$.`,
        r`Vậy $MNPQ$ là hình vuông khi và chỉ khi $BC\perp AD$ và $BC=AD$.`,
      ].join('\n'),
    },
  ],
}

// ───────────────────────── ghi ─────────────────────────
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]))
const envL = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const sb = GHI ? createClient(envL.VITE_SUPABASE_URL, envL.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
const thang = new Date().toISOString().slice(0, 7)
const up = async (ten, ma) => {
  if (!GHI) return 'https://thu/' + ten
  const path = `hinh_hoc/${thang}/${ma}-${randomUUID()}.png`
  const { error } = await sb.storage.from('kho-anh').upload(path, fs.readFileSync(`${S}/${ten}`), { contentType: 'image/png', upsert: false })
  if (error) throw new Error('upload ' + ten + ': ' + error.message)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const bai = (await c.query('select ma_bai, ten_bai from hinh_hoc_bai where ma_bai=$1', [BAI])).rows[0]
if (!bai) throw new Error('không thấy bài ' + BAI)
let tt = (await c.query('select coalesce(max(thu_tu),0)::int m from hinh_hoc_cau_hoi where dang_chinh=$1 and xoa_at is null', [BAI])).rows[0].m
let ttY = (await c.query('select coalesce(max(thu_tu),0)::int m from hinh_hoc_bai_y where dang_chinh=$1 and xoa_at is null', [BAI])).rows[0].m
// trùng đề? (chống nhập 2 lần)
const trung = (await c.query(`select count(*)::int n from hinh_hoc_bai_y where dang_chinh=$1 and xoa_at is null and loi_dan = any($2)`, [BAI, [B1.loi_dan, B2.loi_dan]])).rows[0].n
if (trung) throw new Error('đã có bài nhiều ý cùng lời dẫn trong ' + BAI)
const urls = { BY1: await up(B1.hinh, 'BY1'), BY1lg: await up(B1.hinhLG, 'BY1'), BY2: await up(B2.hinh, 'BY2') }
await c.query('begin')
const ra = []
try {
  for (const [b, k, kLG] of [[B1, 'BY1', 'BY1lg'], [B2, 'BY2', 'BY2']]) {
    const y = (await c.query(`insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, thu_tu) values ($1,$2,$3,$4) returning ma_bai_y`, [BAI, b.loi_dan, urls[k], ++ttY])).rows[0]
    for (const yy of b.y) {
      const q = (await c.query(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, bai_y, nhan_y, cau_hoi_y, da_biet, loi_giai, anh_dap_an, thu_tu, loai_cau, nguon_giai, giai_method, kho_chuan, da_duyet)
        values ($1,'',$2,$3,$4,$5,$6,$7,$8,'tu_luan','ai','claude_code',true,false) returning ma_cau, noi_dung, anh_de`,
        [BAI, y.ma_bai_y, yy.nhan, yy.cau_hoi, yy.da_biet, yy.loi_giai, urls[kLG], ++tt])).rows[0]
      ra.push({ bai_y: y.ma_bai_y, nhan: yy.nhan, ma_cau: q.ma_cau, de: q.noi_dung, anh: !!q.anh_de })
    }
  }
  if (GHI) await c.query('commit'); else await c.query('rollback')
} catch (e) { await c.query('rollback'); console.error('LỖI, đã rollback:', e.message); await c.end(); process.exit(1) }
console.log(GHI ? 'ĐÃ GHI' : 'CHẠY THỬ (rollback)'); for (const x of ra) console.log(x.bai_y, x.nhan, x.ma_cau, x.anh ? '[có hình]' : '[KHÔNG hình]', '\n   ' + x.de.replace(/\n/g, '\n   '))
await c.end()
