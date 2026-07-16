$token = Get-Content "blogger-tokens.json" | ConvertFrom-Json
$headers = @{
    Authorization = "Bearer $($token.access_token)"
    "Content-Type" = "application/atom+xml; charset=UTF-8"
    "GData-Version" = "2"
}

$xml = @'
<entry xmlns="http://www.w3.org/2005/Atom"
       xmlns:gd="http://schemas.google.com/g/2005"
       xmlns:app="http://purl.org/atom/app#">
  <title type="text">Test Atom With Labels</title>
  <content type="html">&lt;p&gt;This is a test post from Atom API with OAuth 2.0&lt;/p&gt;</content>
  <category scheme="http://www.blogger.com/atom/ns#" term="test"/>
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
</entry>
'@

try {
    $r = Invoke-WebRequest -Uri "https://www.blogger.com/feeds/623286056482006475/posts/default" -Method POST -Headers $headers -Body $xml -UseBasicParsing -TimeoutSec 15
    Write-Output "Status: $($r.StatusCode)"
    if ($r.StatusCode -eq 201) {
        Write-Output "SUCCESS!"
        [xml]$resp = $r.Content
        Write-Output "Title: $($resp.entry.title.'#text')"
    } else {
        Write-Output "Response: $($r.Content.Substring(0, [Math]::Min(1000, $r.Content.Length)))"
    }
} catch {
    Write-Output "Error: $_"
    if ($_.Exception.Response) {
        Write-Output "Status: $($_.Exception.StatusCode.value__)"
    }
}
