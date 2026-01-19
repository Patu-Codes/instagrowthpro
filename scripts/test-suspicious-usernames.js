// Test the exact usernames from the screenshots
const testUsername = async (username) => {
    try {
        const response = await fetch(`https://www.instagram.com/${username}/`);
        const html = await response.text();

        console.log(`\n${'='.repeat(60)}`);
        console.log(`Testing: @${username}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`HTTP Status: ${response.status}`);
        console.log(`HTML Length: ${html.length} chars`);

        // Current checks
        console.log('\n🔍 Current Detection Logic:');
        console.log(`   Has 'og:title': ${html.includes('og:title')}`);
        console.log(`   Has 'og:description': ${html.includes('og:description')}`);
        console.log(`   Has 'profilePage': ${html.includes('profilePage')}`);

        // Error messages
        console.log('\n❌ Error Messages:');
        console.log(`   Has 'Sorry, this page': ${html.includes('Sorry, this page')}`);
        console.log(`   Has "isn't available": ${html.includes("isn't available")}`);
        console.log(`   Has 'Page Not Found': ${html.includes('Page Not Found')}`);

        // Check for actual profile
        if (html.includes('og:title')) {
            const titleMatch = html.match(/property="og:title" content="([^"]+)"/);
            if (titleMatch) {
                console.log(`\n📋 og:title content: "${titleMatch[1]}"`);

                // Instagram shows "Instagram" as title for non-existent pages
                if (titleMatch[1] === 'Instagram' || titleMatch[1].includes('• Instagram')) {
                    console.log(`   ⚠️ WARNING: Generic Instagram title = profile likely does NOT exist`);
                }
            }
        }

        // Final verdict
        const pageNotAvailable = html.includes("isn't available");
        const hasGenericTitle = html.includes('property="og:title" content="Instagram"');

        console.log('\n🎯 VERDICT:');
        if (pageNotAvailable || hasGenericTitle) {
            console.log(`   ❌ Profile does NOT exist`);
        } else {
            console.log(`   ✅ Profile appears to exist`);
        }

    } catch (error) {
        console.error(`Error:`, error.message);
    }
};

// Test both usernames from screenshots
(async () => {
    await testUsername('now_itsgone133vela');
    await testUsername('its.sneha_gdgdgshbbqq5673');

    // Also test a known real profile for comparison
    await testUsername('instagram');
})();
