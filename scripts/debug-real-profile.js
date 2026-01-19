// Test what Instagram returns for a REAL profile
const testUsername = async (username) => {
    try {
        const response = await fetch(`https://www.instagram.com/${username}/`);
        const html = await response.text();

        console.log(`\n========== Testing REAL profile: @${username} ==========`);
        console.log(`HTTP Status: ${response.status}`);
        console.log(`HTML Length: ${html.length} chars`);

        // Check what we're looking for
        console.log('\n📦 Profile Data Patterns:');
        console.log(`   Has '"username"': ${html.includes('"username"')}`);
        console.log(`   Has '"profile_pic': ${html.includes('"profile_pic')}`);
        console.log(`   Has '"full_name"': ${html.includes('"full_name"')}`);
        console.log(`   Has 'og:title': ${html.includes('og:title')}`);
        console.log(`   Has 'og:description': ${html.includes('og:description')}`);
        console.log(`   Has 'profilePage': ${html.includes('profilePage')}`);
        console.log(`   Has 'additionalProperties': ${html.includes('additionalProperties')}`);

        // Check for error indicators
        console.log('\n❌ Error Indicators:');
        console.log(`   Has 'Sorry': ${html.includes('Sorry')}`);
        console.log(`   Has "isn't available": ${html.includes("isn't available")}`);
        console.log(`   Has 'Page not found': ${html.includes('Page not found')}`);

        // Look for meta tags
        if (html.includes('og:title')) {
            const titleMatch = html.match(/property="og:title" content="([^"]+)"/);
            if (titleMatch) {
                console.log(`\n✅ Found og:title: ${titleMatch[1]}`);
            }
        }

    } catch (error) {
        console.error(`Error:`, error.message);
    }
};

// Test real profile
testUsername('neomatrix.studio');
