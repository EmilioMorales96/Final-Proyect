# Monitor automático de Salesforce Authentication
# Ejecuta verificaciones cada 5 minutos hasta que funcione

param(
    [int]$IntervalMinutes = 5,
    [int]$MaxAttempts = 20,
    [string]$TestUrl = "https://backend-service-pu47.onrender.com/api/salesforce/debug/test-auth"
)

$startTime = Get-Date
$attemptCount = 0

function Show-Progress {
    param([int]$elapsedMinutes)
    
    $progressPercent = [Math]::Min(($elapsedMinutes / 60) * 100, 100)
    $filledBlocks = [Math]::Floor($progressPercent / 5)
    $emptyBlocks = 20 - $filledBlocks
    
    $progressBar = "█" * $filledBlocks + "░" * $emptyBlocks
    
    Write-Host "`n🔄 Progreso de propagación:" -ForegroundColor Cyan
    Write-Host "   [$progressBar] $($progressPercent.ToString('F1'))%" -ForegroundColor Green
    Write-Host "   ⏱️  Tiempo transcurrido: $elapsedMinutes minutos" -ForegroundColor Yellow
    Write-Host "   🎯 Tiempo estimado total: 30-60 minutos" -ForegroundColor Yellow
}

function Test-SalesforceAuth {
    try {
        $response = Invoke-RestMethod -Uri $TestUrl -Method Get -TimeoutSec 30
        return $response
    }
    catch {
        return @{
            status = "error"
            error = $_.Exception.Message
        }
    }
}

# Mostrar información inicial
Write-Host "`n$('🚀' * 20)" -ForegroundColor Green
Write-Host "    MONITOR AUTOMÁTICO SALESFORCE AUTH" -ForegroundColor Green
Write-Host "$('🚀' * 20)" -ForegroundColor Green

Write-Host "`n📋 Configuración:" -ForegroundColor Cyan
Write-Host "   • URL de prueba: $TestUrl" -ForegroundColor White
Write-Host "   • Intervalo: $IntervalMinutes minutos" -ForegroundColor White
Write-Host "   • Máximo intentos: $MaxAttempts" -ForegroundColor White
Write-Host "   • Iniciado: $($startTime.ToString('HH:mm:ss')) UTC" -ForegroundColor White

Write-Host "`n💡 El script se ejecutará automáticamente hasta que:" -ForegroundColor Yellow
Write-Host "   ✅ La autenticación sea exitosa" -ForegroundColor Green
Write-Host "   ⏰ Se alcance el máximo de intentos" -ForegroundColor Red
Write-Host "   🛑 Presiones Ctrl+C para detener" -ForegroundColor Red

Write-Host "`n🔄 Iniciando monitoreo..." -ForegroundColor Cyan

# Loop principal
do {
    $attemptCount++
    $currentTime = Get-Date
    $elapsedMinutes = [Math]::Floor(($currentTime - $startTime).TotalMinutes)
    
    Write-Host "`n$('=' * 60)" -ForegroundColor Blue
    Write-Host "🔍 VERIFICACIÓN #$attemptCount - $($currentTime.ToString('HH:mm:ss')) UTC" -ForegroundColor Blue
    Write-Host "$('=' * 60)" -ForegroundColor Blue
    
    Show-Progress -elapsedMinutes $elapsedMinutes
    
    Write-Host "`n📡 Consultando endpoint..." -ForegroundColor Cyan
    $response = Test-SalesforceAuth
    
    Write-Host "`n📊 Respuesta recibida:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
    
    if ($response.status -eq "success") {
        Write-Host "`n🎉 ¡ÉXITO! La autenticación de Salesforce está funcionando!" -ForegroundColor Green
        
        Write-Host "`n✅ Resultados:" -ForegroundColor Green
        Write-Host "   • Estado: $($response.status)" -ForegroundColor White
        Write-Host "   • Mensaje: $($response.message)" -ForegroundColor White
        Write-Host "   • Instance URL: $($response.instance_url)" -ForegroundColor White
        Write-Host "   • Token Type: $($response.token_type)" -ForegroundColor White
        
        Write-Host "`n📈 Estadísticas de propagación:" -ForegroundColor Cyan
        Write-Host "   • Tiempo total de espera: $elapsedMinutes minutos" -ForegroundColor White
        Write-Host "   • Verificaciones realizadas: $attemptCount" -ForegroundColor White
        Write-Host "   • Iniciado: $($startTime.ToString('HH:mm:ss')) UTC" -ForegroundColor White
        Write-Host "   • Completado: $($currentTime.ToString('HH:mm:ss')) UTC" -ForegroundColor White
        
        Write-Host "`n🚀 ¡Ya puedes probar la creación de cuentas de Salesforce!" -ForegroundColor Green
        Write-Host "`n🌐 Prueba tu aplicación en:" -ForegroundColor Cyan
        Write-Host "   https://frontend-service-jq4c.onrender.com" -ForegroundColor Yellow
        
        break
    }
    
    # Mostrar estado actual
    Write-Host "`n❌ Estado actual: $($response.status)" -ForegroundColor Red
    if ($response.error) {
        Write-Host "📝 Detalle: $($response.error)" -ForegroundColor Red
        
        if ($response.error -like "*invalid_grant*") {
            Write-Host "`n💡 Diagnóstico: Client Credentials Flow aún propagando..." -ForegroundColor Yellow
        }
    }
    
    if ($attemptCount -ge $MaxAttempts) {
        Write-Host "`n⚠️  Se alcanzó el máximo de intentos ($MaxAttempts)" -ForegroundColor Red
        Write-Host "`n🔧 Posibles acciones:" -ForegroundColor Yellow
        Write-Host "   1. Verificar configuración en Salesforce" -ForegroundColor White
        Write-Host "   2. Revisar variables de entorno en Render" -ForegroundColor White
        Write-Host "   3. Contactar soporte de Salesforce" -ForegroundColor White
        Write-Host "`n🌐 Debug manual: $TestUrl" -ForegroundColor Cyan
        break
    }
    
    # Esperar antes de la próxima verificación
    $nextCheck = $currentTime.AddMinutes($IntervalMinutes)
    Write-Host "`n⏰ Próxima verificación: $($nextCheck.ToString('HH:mm:ss')) UTC" -ForegroundColor Yellow
    Write-Host "⏳ Esperando $IntervalMinutes minutos..." -ForegroundColor Yellow
    
    Start-Sleep -Seconds ($IntervalMinutes * 60)
    
} while ($true)

Write-Host "`n✅ Monitor finalizado." -ForegroundColor Green
