// CREATE A COMPLETE TEST ORDER WITH ALL FIELDS
const testOrder = {
    orderId: 'ORD_COMPLETE_TEST',
    profileId: 'PROF_TEST',
    profileUsername: 'testuser123',
    username: 'instagram_user',
    profileLink: 'https://instagram.com/instagram_user',
    whatsapp: '+1234567890',
    packageName: 'Starter',  // This is what the frontend sends
    followers: 100,
    amount: 349,
    createdAt: new Date().toISOString()
};

fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
})
    .then(r => r.json())
    .then(result => {
        console.log('✅ Order created:', result);

        // Now fetch it back
        return fetch('http://localhost:3000/api/orders');
    })
    .then(r => r.json())
    .then(orders => {
        console.log('\n📦 All orders in database:');
        orders.forEach(order => {
            console.log({
                orderId: order.orderId,
                profileUsername: order.profileUsername,
                profileLink: order.profileLink,
                package: order.package,
                packageName: order.packageName
            });
        });
    })
    .catch(err => console.error('❌ Error:', err));
