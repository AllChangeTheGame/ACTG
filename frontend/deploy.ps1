# deploy.ps1
# ------------------------
# PowerShell deploy script for Vite + AWS S3 + CloudFront
# ------------------------

# ------------------------
# 1️⃣ Build Vite app
# ------------------------
Write-Host "Building Vite app..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Aborting deployment." -ForegroundColor Red
    exit 1
}

# ------------------------
# 2️⃣ Sync dist/ to S3
# ------------------------
$bucketName = "actg.parrsec.co.uk"

Write-Host "Syncing dist/ to S3 bucket $bucketName..." -ForegroundColor Cyan
aws s3 sync .\dist\ "s3://$bucketName" --delete

if ($LASTEXITCODE -ne 0) {
    Write-Host "S3 sync failed! Aborting deployment." -ForegroundColor Red
    exit 1
}

# ------------------------
# 3️⃣ Invalidate CloudFront cache
# ------------------------
$distributionId = "YOUR_DISTRIBUTION_ID"   # <-- Replace with your CloudFront ID
Write-Host "Creating CloudFront invalidation for distribution $distributionId..." -ForegroundColor Cyan

aws cloudfront create-invalidation `
    --distribution-id $distributionId `
    --paths "/*"

if ($LASTEXITCODE -ne 0) {
    Write-Host "CloudFront invalidation failed!" -ForegroundColor Yellow
} else {
    Write-Host "Deployment complete! ✅" -ForegroundColor Green
}
