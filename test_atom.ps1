$token = Get-Content "blogger-tokens.json" | ConvertFrom-Json
$headers = @{ Authorization = "Bearer $($token.access_token)"; "Content-Type" = "application/atom+xml" }

$xml = '<?xml version="1.0" encoding="UTF-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Test Atom Post</title>
  <content type="html">&lt;p&gt;Test from Atom protocol&lt;/p&gt;</content>
  <category scheme="http://www.blogger.com/atom/ns#" term="test"/>
</entry>'

try {
    $r = Invoke-WebRequest -Uri "https://www.blogger.com/feeds/623286056482006475/posts/default" -Method POST -Headers $headers -Body $xml -UseBasicParsing -TimeoutSec 15
    Write-Output "OK: $($r.StatusCode)"
} catch {
    Write-Output "Error: $_"
}
