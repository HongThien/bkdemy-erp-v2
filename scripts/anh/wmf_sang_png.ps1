# wmf_sang_png.ps1 — đổi mọi WMF/EMF trong 1 thư mục thành PNG (phóng Scale lần, nền trắng); jpeg/png chép nguyên.
# Công thức Word (MathType/Equation 3.0) là WMF — Chrome/Pillow không đọc được, chỉ System.Drawing (Windows) đọc.
#   powershell -NoProfile -File scripts/anh/wmf_sang_png.ps1 -In <thu_muc_media> -Out <thu_muc_png> [-Scale 4]
param([Parameter(Mandatory)][string]$In, [Parameter(Mandatory)][string]$Out, [int]$Scale = 4)
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $Out | Out-Null
$ok = 0; $loi = 0
Get-ChildItem $In -File | ForEach-Object {
  $ext = $_.Extension.ToLower()
  if ($ext -in '.wmf', '.emf') {
    try {
      $img = [System.Drawing.Image]::FromFile($_.FullName)
      $w = [Math]::Max(60, [int]($img.Width * $Scale)); $h = [Math]::Max(30, [int]($img.Height * $Scale))
      $bmp = New-Object System.Drawing.Bitmap $w, $h
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.Clear([System.Drawing.Color]::White)
      $g.DrawImage($img, 0, 0, $w, $h)
      $bmp.Save((Join-Path $Out ($_.BaseName + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
      $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $ok++
    } catch { $loi++; Write-Output ("LOI: " + $_.Name) }
  } elseif ($ext -in '.png', '.jpg', '.jpeg', '.gif') {
    Copy-Item $_.FullName (Join-Path $Out $_.Name) -Force
  }
}
Write-Output "WMF/EMF -> PNG: $ok · lỗi: $loi"
