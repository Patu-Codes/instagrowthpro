// Add to payment-complete.html right after getting orderData
console.log('='.repeat(50));
console.log('🔍 PAYMENT COMPLETE - DEBUG');
console.log('='.repeat(50));
const savedOrder = sessionStorage.getItem('pendingOrder');
console.log('1️⃣ Raw sessionStorage:', savedOrder);
const orderData = JSON.parse(savedOrder);
console.log('2️⃣ Parsed orderData:', orderData);
console.log('3️⃣ orderData.profileLink:', orderData.profileLink);
console.log('4️⃣ orderData keys:', Object.keys(orderData));
console.log('='.repeat(50));
