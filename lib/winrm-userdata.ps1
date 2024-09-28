#Set WinRM service to automatic
Set-Service WinRM -StartupType 'Automatic'

#Configure WinRM Service
Set-Item -Path 'WSMan:\localhost\Service\Auth\Certificate' -Value $true
Set-Item -Path 'WSMan:\localhost\Service\AllowUnencrypted' -Value $true
Set-Item -Path 'WSMan:\localhost\Service\Auth\Basic' -Value $true
Set-Item -Path 'WSMan:\localhost\Service\Auth\CredSSP' -Value $true

#Enable PowerShell remoting
Enable-PSRemoting -Force

#Create a self-signed certificate and set up a listener
New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation Cert:\LocalMachine\My
$thumbprint = (Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object { $_.Subject -eq "CN=localhost" }).Thumbprint
New-Item WSMan:\localhost\Listener -Address * -Transport HTTPS -HostName "localhost" -CertificateThumbPrint $thumbprint -force

#Create a firewall rule to allow WinRM HTTPS inbound traffic
New-NetFirewallRule -DisplayName "Allow WinRM HTTPS" -Direction Inbound -LocalPort 5986 -Protocol TCP -Action Allow

#Configure TrustedHosts
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*" -Force

#Set Execution Policy to Unrestricted
Set-ExecutionPolicy Unrestricted -Force


#Restart the WinRM service
Restart-Service WinRM