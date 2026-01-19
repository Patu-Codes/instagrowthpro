# Replace all alert() calls with professional modals
# Public app - main files

Write-Host "`n🔄 Replacing alerts with professional modals..." -ForegroundColor Cyan

$replacements = @(
    # profile-page.js
    @{
        File = "public/profile-page.js"
        Old = "alert('Please enter a new password');"
        New = "await window.modal.error('Please enter a new password', 'Required');"
    },
    @{
        File = "public/profile-page.js"
        Old = "alert('Password must be at least 4 characters');"
        New = "await window.modal.error('Password must be at least 4 characters', 'Invalid Password');"
    },
    @{
        File = "public/profile-page.js"
        Old = "alert('Passwords do not match');"
        New = "await window.modal.error('Passwords do not match',  'Mismatch');"
    },
    @{
        File = "public/profile-page.js"
        Old = "alert('✅ Password updated successfully!');"
        New = "await window.modal.success('Your password has been updated successfully', 'Password Updated');"
    },
    @{
        File = "public/profile-page.js"
        Old = "alert('Account deleted successfully');"
        New = "await window.modal.success('Your account has been deleted', 'Account Deleted');"
    },
    
    # payment.js
    @{
        File = "public/payment.js"
        Old = "alert('No order data found. Redirecting to order page...');"
        New = "await window.modal.error('No order data found. Redirecting to order page...', 'Order Not Found');"
    },
    @{
        File = "public/payment.js"
        Old = "alert('Order data not found');"
        New = "await window.modal.error('Order data not found. Please start a new order.', 'Error');"
    },
    @{
        File = "public/payment.js"
        Old = "alert('Please enter a UPI ID');"
        New = "await window.modal.error('Please enter a UPI ID', 'Required');"
    },
    @{
        File = "public/payment.js"
        Old = "alert('Please enter a valid UPI ID (e.g., name@paytm)');"
        New = "await window.modal.error('Please enter a valid UPI ID (e.g., name@paytm)', 'Invalid UPI ID');"
    },
    
    # order.js
    @{
        File = "public/order.js"
        Old = "alert('Please fill in all required fields');"
        New = "await window.modal.error('Please fill in all required fields', 'Required');"
    },
    @{
        File = "public/order.js"
        Old = "alert('Please select a package');"
        New = "await window.modal.error('Please select a package', 'Required');"
    },
    @{
        File = "public/order.js"
        Old = "alert('Error: ' + err.message);"
        New = "await window.modal.error('Error: ' + err.message, 'Error');"
    },
    
    # my-orders.js
    @{
        File = "public/my-orders.js"
        Old = "alert('Error loading orders: ' + error.message);"
        New = "await window.modal.error('Error loading orders: ' + error.message, 'Error');"
    },
    
    # admin.js
    @{
        File = "public/admin.js"
        Old = "alert('Please select a status');"
        New = "await window.modal.error('Please select a status', 'Required');"
    },
    @{
        File = "public/admin.js"
        Old = "alert('Order status updated successfully!');"
        New = "await window.modal.success('Order status updated successfully!', 'Success');"
    },
    @{
        File = "public/admin.js"
        Old = "alert('Failed to update order status. Please try again.');"
        New = "await window.modal.error('Failed to update order status. Please try again.', 'Error');"
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

Write-Host "`n✅ Replacements complete!" -ForegroundColor Green
