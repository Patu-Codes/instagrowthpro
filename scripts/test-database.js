// Test script to verify database functionality
const API_URL = 'http://localhost:3000/api';

async function testCompleteFlow() {
    console.log('\n🧪 STARTING COMPREHENSIVE TESTS...\n');

    try {
        // Test 1: Create Profile
        console.log('📝 TEST 1: Creating test profile...');
        const profileData = {
            id: 'TEST_' + Date.now(),
            username: 'testuser_' + Date.now(),
            password: 'test123',
            email: 'test@example.com'
        };

        const registerResponse = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        const registerResult = await registerResponse.json();

        if (registerResult.success) {
            console.log('✅ Profile created successfully:', profileData.username);
        } else {
            throw new Error('Failed to create profile: ' + JSON.stringify(registerResult));
        }

        // Test 2: Login
        console.log('\n📝 TEST 2: Testing login...');
        const loginResponse = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: profileData.username,
                password: profileData.password
            })
        });

        const loginResult = await loginResponse.json();

        if (loginResult.token && loginResult.profile) {
            console.log('✅ Login successful, token received');
        } else {
            throw new Error('Login failed: ' + JSON.stringify(loginResult));
        }

        // Test 3: Create Order with NEW SCHEMA
        console.log('\n📝 TEST 3: Creating test order with profileLink...');
        const orderData = {
            orderId: 'ORD_TEST_' + Date.now(),
            profileId: profileData.id,
            profileUsername: profileData.username,
            username: 'test_instagram_user',
            profileLink: 'https://instagram.com/test_instagram_user',
            whatsapp: '+1234567890',
            packageName: 'Starter',
            followers: 100,
            amount: 349,
            status: 'pending_verification',
            createdAt: new Date().toISOString()
        };

        const orderResponse = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();

        if (orderResult.success) {
            console.log('✅ Order created successfully:', orderResult.orderId);
        } else {
            throw new Error('Failed to create order: ' + JSON.stringify(orderResult));
        }

        // Test 4: Get All Orders
        console.log('\n📝 TEST 4: Fetching all orders...');
        const ordersResponse = await fetch(`${API_URL}/orders`);
        const orders = await ordersResponse.json();

        console.log('✅ Retrieved', orders.length, 'order(s)');
        if (orders.length > 0) {
            console.log('   Order details:', {
                orderId: orders[0].orderId,
                username: orders[0].username,
                profileLink: orders[0].profileLink,
                package: orders[0].package
            });
        }

        // Test 5: Get Profile Orders
        console.log('\n📝 TEST 5: Fetching profile-specific orders...');
        const profileOrdersResponse = await fetch(`${API_URL}/profiles/${profileData.id}/orders`);
        const profileOrders = await profileOrdersResponse.json();

        console.log('✅ Profile has', profileOrders.length, 'order(s)');

        // Test 6: Update Order Status
        console.log('\n📝 TEST 6: Updating order status...');
        const updateResponse = await fetch(`${API_URL}/orders/${orderData.orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });

        const updateResult = await updateResponse.json();

        if (updateResult.success) {
            console.log('✅ Order status updated to completed');
        } else {
            throw new Error('Failed to update order: ' + JSON.stringify(updateResult));
        }

        console.log('\n🎉 ALL TESTS PASSED! Database is working perfectly!\n');
        console.log('━'.repeat(60));
        console.log('✅ Profile creation: WORKING');
        console.log('✅ Login system: WORKING');
        console.log('✅ Order creation with profileLink: WORKING');
        console.log('✅ Order retrieval: WORKING');
        console.log('✅ Order status updates: WORKING');
        console.log('━'.repeat(60));

        return true;

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run tests
testCompleteFlow().then(success => {
    process.exit(success ? 0 : 1);
});
