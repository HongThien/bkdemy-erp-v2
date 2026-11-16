// Trạm soạn bài lẻ chia hết 16/11 — kiểm mọi đẳng thức Phần 2 + khẳng định chia hết cuối bằng BigInt.
// Chạy từ gốc repo: node kho-rules/dai/lo/k8/bai-le-chia-het-1611/tram-soan-kiem.mjs
const B = (x) => BigInt(x);
const LO = -50, HI = 50;
let tests = 0, fail = 0;

// rel: hàm k -> n (null: n tự do chạy trên khoảng). chains: mỗi chuỗi là các vế bằng nhau liên tiếp.
// fns nhận (n, k) đều BigInt.
const bai = [
  { ma: 'G', rel: (k) => 2n * k, de: (n) => n ** 3n - 4n * n, div: 48n, chains: [
    [(n) => n ** 3n - 4n * n, (n) => n * (n * n - 4n), (n) => (n - 2n) * n * (n + 2n)],
    [(n) => (n - 2n) * n * (n + 2n), (n, k) => (2n * k - 2n) * (2n * k) * (2n * k + 2n), (n, k) => 8n * (k - 1n) * k * (k + 1n)],
  ] },
  { ma: 'C1', rel: (k) => 2n * k, de: (n) => n ** 3n + 20n * n, div: 48n, chains: [
    [(n) => n ** 3n + 20n * n, (n) => n * (n * n + 20n),
     (n, k) => 2n * k * ((2n * k) ** 2n + 20n), (n, k) => 2n * k * (4n * k * k + 20n),
     (n, k) => 8n * k * (k * k + 5n), (n, k) => 8n * (k ** 3n + 5n * k),
     (n, k) => 8n * (k ** 3n - k + 6n * k), (n, k) => 8n * ((k - 1n) * k * (k + 1n) + 6n * k)],
  ] },
  { ma: 'C2', rel: (k) => 2n * k + 1n, de: (n) => n ** 3n - n, div: 24n, chains: [
    [(n) => n ** 3n - n, (n) => n * (n * n - 1n), (n) => (n - 1n) * n * (n + 1n)],
    [(n) => (n - 1n) * n * (n + 1n), (n, k) => 2n * k * (2n * k + 1n) * (2n * k + 2n), (n, k) => 4n * k * (k + 1n) * (2n * k + 1n)],
  ] },
  { ma: 'C3', rel: (k) => 2n * k + 1n, de: (n) => n ** 3n + 3n * n * n - n - 3n, div: 48n, chains: [
    [(n) => n ** 3n + 3n * n * n - n - 3n, (n) => (n ** 3n + 3n * n * n) - (n + 3n),
     (n) => n * n * (n + 3n) - (n + 3n), (n) => (n + 3n) * (n * n - 1n), (n) => (n - 1n) * (n + 1n) * (n + 3n)],
    [(n) => (n - 1n) * (n + 1n) * (n + 3n), (n, k) => 2n * k * (2n * k + 2n) * (2n * k + 4n), (n, k) => 8n * k * (k + 1n) * (k + 2n)],
  ] },
  { ma: 'C4', rel: (k) => 2n * k, de: (n) => n ** 4n - 4n * n ** 3n - 4n * n * n + 16n * n, div: 384n, chains: [
    [(n) => n ** 4n - 4n * n ** 3n - 4n * n * n + 16n * n, (n) => (n ** 4n - 4n * n ** 3n) - (4n * n * n - 16n * n),
     (n) => n ** 3n * (n - 4n) - 4n * n * (n - 4n), (n) => (n - 4n) * (n ** 3n - 4n * n),
     (n) => (n - 4n) * n * (n * n - 4n), (n) => (n - 4n) * n * (n - 2n) * (n + 2n)],
    [(n) => (n - 4n) * n * (n - 2n) * (n + 2n), (n, k) => (2n * k - 4n) * (2n * k) * (2n * k - 2n) * (2n * k + 2n),
     (n, k) => 16n * (k - 2n) * k * (k - 1n) * (k + 1n), (n, k) => 16n * (k - 2n) * (k - 1n) * k * (k + 1n)],
  ] },
  { ma: 'C5', rel: (k) => 4n * k, de: (n) => n ** 3n - 16n * n, div: 384n, chains: [
    [(n) => n ** 3n - 16n * n, (n) => n * (n * n - 16n), (n) => (n - 4n) * n * (n + 4n)],
    [(n) => (n - 4n) * n * (n + 4n), (n, k) => (4n * k - 4n) * (4n * k) * (4n * k + 4n), (n, k) => 64n * (k - 1n) * k * (k + 1n)],
  ] },
  { ma: 'C6', rel: null, de: (n) => n ** 5n - 5n * n ** 3n + 4n * n, div: 120n, chains: [
    [(n) => n ** 5n - 5n * n ** 3n + 4n * n, (n) => n * (n ** 4n - 5n * n * n + 4n),
     (n) => n * (n ** 4n - n * n - 4n * n * n + 4n), (n) => n * (n * n * (n * n - 1n) - 4n * (n * n - 1n)),
     (n) => n * (n * n - 1n) * (n * n - 4n), (n) => (n - 2n) * (n - 1n) * n * (n + 1n) * (n + 2n)],
  ] },
  { ma: 'C7', rel: null, de: (n) => n ** 3n + 3n * n * n + 2n * n, div: 6n, chains: [
    [(n) => n ** 3n + 3n * n * n + 2n * n, (n) => n * (n * n + 3n * n + 2n), (n) => n * (n * n + n + 2n * n + 2n),
     (n) => n * (n * (n + 1n) + 2n * (n + 1n)), (n) => n * (n + 1n) * (n + 2n)],
  ] },
  { ma: 'C8', rel: null, de: (n) => n ** 3n - 13n * n, div: 6n, chains: [
    [(n) => n ** 3n - 13n * n, (n) => n ** 3n - n - 12n * n, (n) => n * (n * n - 1n) - 12n * n, (n) => (n - 1n) * n * (n + 1n) - 12n * n],
    [(n) => 12n * n, (n) => 6n * (2n * n)],
  ] },
  { ma: 'C9', rel: null, de: (n) => (n * n + n - 1n) ** 2n - 1n, div: 24n, chains: [
    [(n) => (n * n + n - 1n) ** 2n - 1n, (n) => (n * n + n - 1n - 1n) * (n * n + n - 1n + 1n), (n) => (n * n + n - 2n) * (n * n + n)],
    [(n) => n * n + n - 2n, (n) => n * n - n + 2n * n - 2n, (n) => n * (n - 1n) + 2n * (n - 1n), (n) => (n - 1n) * (n + 2n)],
    [(n) => n * n + n, (n) => n * (n + 1n)],
    [(n) => (n * n + n - 1n) ** 2n - 1n, (n) => (n - 1n) * (n + 2n) * n * (n + 1n), (n) => (n - 1n) * n * (n + 1n) * (n + 2n)],
  ] },
  { ma: 'C10', rel: (k) => 2n * k + 1n, de: (n) => n ** 2n + 4n * n + 3n, div: 8n, chains: [
    [(n) => n ** 2n + 4n * n + 3n, (n) => n * n + n + 3n * n + 3n, (n) => n * (n + 1n) + 3n * (n + 1n), (n) => (n + 1n) * (n + 3n)],
    [(n) => (n + 1n) * (n + 3n), (n, k) => (2n * k + 2n) * (2n * k + 4n), (n, k) => 4n * (k + 1n) * (k + 2n)],
  ] },
];

function chk(cond, msg) { tests++; if (!cond) { fail++; console.log('FAIL', msg); } }

for (const b of bai) {
  const nBefore = tests;
  for (let i = LO; i <= HI; i++) {
    const k = B(i);
    const n = b.rel ? b.rel(k) : k; // n tự do: n = i
    // đẳng thức: mọi bước trong chuỗi bằng bước đầu
    for (const ch of b.chains) {
      const v0 = ch[0](n, k);
      ch.forEach((f, j) => chk(f(n, k) === v0, `${b.ma} chain j=${j} n=${n} k=${k}`));
    }
    // chuỗi cuối phải bằng đề (nối đề với chuỗi chính)
    const dev = b.de(n);
    chk(b.chains[0][0](n, k) === dev, `${b.ma} dau chuoi != de n=${n}`);
    // cuối chuỗi chính (và chuỗi nối tiếp) phải bằng đề
    const ch0 = b.chains[0];
    chk(ch0[ch0.length - 1](n, k) === dev, `${b.ma} cuoi chuoi 1 != de n=${n}`);
    if (b.ma !== 'C9' && b.ma !== 'C8' && b.chains.length > 1) {
      const l = b.chains[1];
      chk(l[l.length - 1](n, k) === dev, `${b.ma} cuoi chuoi 2 != de n=${n}`);
    }
    // khẳng định chia hết của đề
    chk(dev % b.div === 0n, `${b.ma} ${dev} khong chia het ${b.div} n=${n}`);
  }
  console.log(b.ma, 'phep thu:', tests - nBefore);
}

// Kiểm các khẳng định chia hết trung gian
for (let i = LO; i <= HI; i++) {
  const k = B(i);
  chk(((k - 1n) * k * (k + 1n)) % 6n === 0n, 'ba so lien tiep chia het 6');
  chk((k * (k + 1n) * (k + 2n)) % 6n === 0n, 'ba so lien tiep chia het 6 (k,k+1,k+2)');
  chk(((k - 2n) * (k - 1n) * k * (k + 1n)) % 24n === 0n, 'bon so lien tiep chia het 24');
  chk(((k - 2n) * (k - 1n) * k * (k + 1n) * (k + 2n)) % 120n === 0n, 'nam so lien tiep chia het 120');
  chk((k * (k + 1n)) % 2n === 0n, 'hai so lien tiep chan');
  chk((2n * k * (2n * k + 2n)) % 8n === 0n, 'hai so chan lien tiep chia het 8');
  chk(((k - 1n) * k * (k + 1n) + 6n * k) % 6n === 0n, 'C1 ngoac chia het 6');
  chk(((k - 1n) * k * (k + 1n) - 12n * k) % 6n === 0n, 'C8 tong chia het 6');
}

console.log(`TONG phep thu: ${tests}, FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
