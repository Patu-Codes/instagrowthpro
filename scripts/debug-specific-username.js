// Test what Instagram returns for the specific fake username
const testUsername = async (username) => {
    try {
        const response = await fetch(`https://www.instagram.com/${username}/`);
        const html = await response.text();

        console.log(`\n========== Testing: @${username} ==========`);
        console.log(`HTTP Status: ${response.status}`);
        console.log(`HTML Length: ${html.length} chars`);

        // Search for various patterns
        const patterns = {
            'Sorry, this page isn\'t available': html.includes('Sorry, this page isn\'t available'),
            'this page isn\'t available': html.includes('this page isn\'t available'),
            'Page Not Found': html.includes('Page Not Found'),
            'Sorry, this page': html.includes('Sorry, this page'),
            'isn\'t available': html.includes('isn\'t available'),
            'pageNotFound': html.includes('pageNotFound'),
            'Page not found': html.includes('Page not found'),
            '"status":"fail"': html.includes('"status":"fail"'),
            'The link you followed': html.includes('The link you followed'),
        };

        console.log('\n📍 Pattern Detection:');
        for (const [pattern, found] of Object.entries(patterns)) {
            console.log(`   ${found ? '✅' : '❌'} "${pattern}"`);
        }

        // Look for profile data
        console.log('\n📦 Profile Data Check:');
        console.log(`   Has "username": ${html.includes('"username"')}`);
        console.log(`   Has "profile_pic": ${html.includes('"profile_pic')}`);
        console.log(`   Has "full_name": ${html.includes('"full_name')}`);
        console.log(`   Has "is_private": ${html.includes('"is_private')}`);

        // Show a snippet around "Sorry" if it exists
        if (html.includes('Sorry')) {
            const index = html.indexOf('Sorry');
            const snippet = html.substring(index - 50, index + 200);
            console.log('\n📝 Snippet around "Sorry":');
            console.log(snippet);
        }

    } catch (error) {
        console.error(`Error:`, error.message);
    }
};

// Test the exact username from the screenshot
testUsername('its_patuvvdvdvdvdvdvddbbbmnzz');
