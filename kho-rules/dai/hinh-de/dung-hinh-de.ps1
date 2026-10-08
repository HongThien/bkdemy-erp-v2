# dung-hinh-de.ps1 — DỰNG HÌNH ĐỀ (PNG) cho các bài sách có hình trong đề, từ ảnh GỐC trong word/media của file Word.
# (kho-rules/README.md §4 việc #7; lô 11 của 4T, 08/10)
#
#   powershell -NoProfile -Command "& ([scriptblock]::Create([IO.File]::ReadAllText('kho-rules/dai/hinh-de/dung-hinh-de.ps1'))) -Media <thư mục media đã trích> -Manifest kho-rules/dai/hinh-de/4T.json -Out kho-rules/dai/hinh-de"
#
# Manifest (JSON): { "<mã bài>": { "tep": "4T-LT-5-15.png", "nguon": ["image109.emf"], "cach": "emf" | "png" | "bang", "bang"?: {...} } }
#   emf  : EMF/WMF → PNG bằng System.Drawing (chỉ Windows đọc được EMF), thu cho vừa khung 900×600, nền trắng — KHÔNG vẽ lại, KHÔNG sửa nội dung
#   png  : ảnh PNG/JPG gốc của sách chép nguyên
#   bang : sách là BẢNG Word (chữ ở ô trái, ảnh biểu tượng ở ô phải) mà tách-bài chỉ giữ được chữ ⇒ ghép lại thành 1 ảnh bảng:
#          chữ lấy từ đề sách, mỗi hàng là ĐÚNG ảnh gốc của hàng đó (thu về cùng chiều cao) — không đếm lại, không vẽ biểu tượng mới.
# Lấy ảnh gốc: node scripts/kho/sach/trich-media.mjs <docx> <thư mục> <tên ảnh…>  (hoặc giải nén word/media của .docx)
param([Parameter(Mandatory)][string]$Media, [Parameter(Mandatory)][string]$Manifest, [Parameter(Mandatory)][string]$Out)
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$man = Get-Content -Raw -Encoding UTF8 $Manifest | ConvertFrom-Json

function Ve-Vua($img, $maxW, $maxH) {
  $k = [Math]::Min(1.0, [Math]::Min($maxW / $img.Width, $maxH / $img.Height))
  $w = [Math]::Max(1, [int]($img.Width * $k)); $h = [Math]::Max(1, [int]($img.Height * $k))
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($img, 0, 0, $w, $h); $g.Dispose()
  return $bmp
}

foreach ($p in $man.PSObject.Properties) {
  $ma = $p.Name; $m = $p.Value; $ra = Join-Path $Out $m.tep
  if ($m.cach -eq 'png') {
    Copy-Item (Join-Path $Media $m.nguon[0]) $ra -Force
  } elseif ($m.cach -eq 'emf') {
    $img = [System.Drawing.Image]::FromFile((Join-Path $Media $m.nguon[0]))
    $bmp = Ve-Vua $img 900 600; $bmp.Save($ra, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose(); $img.Dispose()
  } elseif ($m.cach -eq 'bang') {
    $b = $m.bang; $hIcon = [int]$b.cao_bieu_tuong; $pad = 14
    $font = New-Object System.Drawing.Font('Times New Roman', 22); $fontB = New-Object System.Drawing.Font('Times New Roman', 22, [System.Drawing.FontStyle]::Bold)
    $tmp = New-Object System.Drawing.Bitmap 10, 10; $gt = [System.Drawing.Graphics]::FromImage($tmp)
    $hang = @()
    foreach ($r in $b.hang) {
      $img = [System.Drawing.Image]::FromFile((Join-Path $Media $r.anh))
      $w = [int]($img.Width * $hIcon / $img.Height)
      $hang += [pscustomobject]@{ chu = $r.chu; img = $img; w = $w }
    }
    $wTrai = [int](($hang | ForEach-Object { $gt.MeasureString($_.chu, $font).Width } | Measure-Object -Maximum).Maximum) + 2 * $pad
    if ($b.tieu_de) { $wTrai = [Math]::Max($wTrai, [int]$gt.MeasureString($b.tieu_de[0], $fontB).Width + 2 * $pad) }
    $wPhai = [int](($hang | Measure-Object -Property w -Maximum).Maximum) + 2 * $pad
    if ($b.tieu_de) { $wPhai = [Math]::Max($wPhai, [int]$gt.MeasureString($b.tieu_de[1], $fontB).Width + 2 * $pad) }
    $hHang = $hIcon + 2 * $pad; $hTieuDe = if ($b.tieu_de) { 54 } else { 0 }
    $hChu = 0; if ($b.chu_thich) { $hChu = $hIcon + 24 }
    $W = $wTrai + $wPhai + 2; $H = $hTieuDe + $hHang * $hang.Count + 2 + $hChu
    $bmp = New-Object System.Drawing.Bitmap $W, $H; $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.TextRenderingHint = 'AntiAliasGridFit'; $g.Clear([System.Drawing.Color]::White)
    $but = New-Object System.Drawing.Pen ([System.Drawing.Color]::Black), 2
    $den = [System.Drawing.Brushes]::Black
    $y = 1
    if ($b.tieu_de) {
      $g.DrawString($b.tieu_de[0], $fontB, $den, $pad, $y + 12); $g.DrawString($b.tieu_de[1], $fontB, $den, $wTrai + $pad, $y + 12)
      $g.DrawRectangle($but, 1, $y, $wTrai, $hTieuDe); $g.DrawRectangle($but, 1 + $wTrai, $y, $wPhai, $hTieuDe); $y += $hTieuDe
    }
    foreach ($r in $hang) {
      $g.DrawRectangle($but, 1, $y, $wTrai, $hHang); $g.DrawRectangle($but, 1 + $wTrai, $y, $wPhai, $hHang)
      $hc = $g.MeasureString($r.chu, $font).Height
      $g.DrawString($r.chu, $font, $den, $pad, $y + ($hHang - $hc) / 2)
      $g.DrawImage($r.img, 1 + $wTrai + $pad, $y + $pad, $r.w, $hIcon)
      $y += $hHang
    }
    if ($b.chu_thich) {
      $c = $b.chu_thich; $img = [System.Drawing.Image]::FromFile((Join-Path $Media $c.anh)); $w = [int]($img.Width * $hIcon / $img.Height)
      $x = $pad; $yy = $y + 12
      $g.DrawString($c.truoc, $font, $den, $x, $yy + ($hIcon - 30) / 2); $x += $g.MeasureString($c.truoc, $font).Width
      $g.DrawImage($img, $x, $yy, $w, $hIcon); $x += $w + 4
      $g.DrawString($c.sau, $font, $den, $x, $yy + ($hIcon - 30) / 2); $img.Dispose()
    }
    $bmp.Save($ra, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose(); $gt.Dispose(); $tmp.Dispose(); foreach ($r in $hang) { $r.img.Dispose() }
  } else { throw "cach '$($m.cach)' của $ma không biết" }
  $kt = [System.Drawing.Image]::FromFile($ra); Write-Output ("{0,-12} {1,-22} {2}x{3}  <- {4}" -f $ma, $m.tep, $kt.Width, $kt.Height, ($m.nguon -join ',')); $kt.Dispose()
}
