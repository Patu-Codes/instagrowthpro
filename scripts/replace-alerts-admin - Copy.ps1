# Replace all alert() calls with professional modals - ADMIN PANEL
Write-Host "`n🔄 Replacing alerts in Admin Panel..." -ForegroundColor Cyan

$replacements = @(
    # orders.html
    @{
        File = "ADMIN PANEL APP/orders.html"
        Old = "alert('✅ Status updated successfully!');"
        New = "window.modal.success('Order status updated successfully', 'Success');"
    },
    @{
        File = "ADMIN PANEL APP/orders.html"
        Old = "alert('❌ Failed to update status: ' + error.message);"
        New = "window.modal.error('Failed to update status: ' + error.message, 'Error');"
    },
    @{
        File = "ADMIN PANEL APP/orders.html"
        Old = "alert('✅ Order deleted successfully!');"
        New = "window.modal.success('Order deleted successfully', 'Deleted');"
    },
    @{
        File = "ADMIN PANEL APP/orders.html"
        Old = "alert('❌ Failed to delete order: ' + error.message);"
        New = "window.modal.error('Failed to delete order: ' + error.message, 'Error');"
    },
    
    # orders.js
    @{
        File = "ADMIN PANEL APP/orders.js"
        Old = "alert(``✅ Order status updated to: `${getStatusText(newStatus)}`);"
        New = "window.modal.success(``Order status updated to: `${getStatusText(newStatus)}, 'Success');"
    },
    @{
        File = "ADMIN PANEL APP/orders.js"
        Old = "alert('❌ Error: ' + error.message);"
        New = "window.modal.error('Error: ' + error.message, 'Error');"
    },
    @{
        File = "ADMIN PANEL APP/orders.js"
        Old = "alert('✅ Order deleted successfully!');"
        New = "window.modal.success('Order deleted successfully', 'Deleted');"
    },
    @{
        File = "ADMIN PANEL APP/orders.js"
        Old = "alert('❌ Failed to delete order: ' + (data.error || 'Unknown error'));"
        New = "window.modal.error('Failed to delete order: ' + (data.error || 'Unknown error'), 'Error');"
    },
    @{
        File = "ADMIN PANEL APP/orders.js"
        Old = "alert('❌ Failed to delete order. Please try again.');"
        New = "window.modal.error('Failed to delete order. Please try again.', 'Error');"
    },
    
    # users.html
    @{
        File = "ADMIN PANEL APP/users.html"
        Old = "alert(``✅ User `${username} deleted successfully!`);"
        New = "window.modal.success(``User `${username} deleted successfully, 'Deleted');"
    },
    @{
        File = "ADMIN PANEL APP/users.html"
        Old = "alert('❌ Failed to delete user: ' + (data.error || 'Unknown error'));"
        New = "window.modal.error('Failed to delete user: ' + (data.error || 'Unknown error'), 'Error');"
    },
    @{
        File = "ADMIN PANEL APP/users.html"
        Old = "alert('❌ Failed to delete user. Please try again.');"
        New = "window.modal.error('Failed to delete user. Please try again.', 'Error');"
    },
    
    # live-chat.js
    @{
        File = "ADMIN PANEL APP/live-chat.js"
        Old = "alert('Failed to send message');"
        New = "window.modal.error('Failed to send message. Please try again.', 'Error');"
    }
)

# Process each replacement
foreach ($r in $replacements) {
    $filePath = "c:/Users/Prathamesh/OneDrive/Documents/WORK/Insta follower sell web/$($r.File)"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        if ($content -match [regex]::Escape($r.Old)) {
            $content = $content.Replace($r.Old, $r.New)
            Set-Content $filePath -Value $content -NoNewline
            Write-Host "  ✅ $($r.File)" -ForegroundColor Green
        }
    }
}

Write-Host "`n✅ Admin Panel replacements complete!" -ForegroundColor Green
