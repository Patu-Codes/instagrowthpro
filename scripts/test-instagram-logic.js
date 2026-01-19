// Simple test script to verify Instagram pages
const testUsername = async (username) => {
    try {
        const response = await fetch(`https://www.instagram.com/${username}/`);
        const html = await response.text();

        const pageNotAvailable = html.includes('Sorry, this page isn\'t available');
        const hasProfileData = html.includes('"profile_pic_url"');
        const isPrivate = html.includes('"is_private":true');

        console.log(`\n--- Testing: @${username} ---`);
        console.log(`Status: ${response.status}`);
        console.log(`Page Not Available: ${pageNotAvailable}`);
        console.log(`Has Profile Data: ${hasProfileData}`);
        console.log(`Is Private: ${isPrivate}`);

        if (pageNotAvailable || !hasProfileData) {
            console.log(`✅ Result: Profile does NOT exist`);
        } else if (isPrivate) {
            console.log(`⚠️ Result: Profile exists but is PRIVATE`);
        } else {
            console.log(`✅ Result: Profile exists and is PUBLIC`);
        }
    } catch (error) {
        console.error(`Error testing @${username}:`, error.message);
    }
};

// Test real profile
testUsername('instagram').then(() => {
    // Test fake profile  
    return testUsername('thisuserdoesnotexist999999');
}).then(() => {
    // Test the one from your screenshot
    return testUsername('its_patuvvdvdvdvdvdvddbbbmnzz');
});
