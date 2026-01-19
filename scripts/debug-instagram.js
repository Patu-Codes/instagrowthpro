// Better Instagram detection script
const testUsername = async (username) => {
    try {
        const response = await fetch(`https://www.instagram.com/${username}/`);
        const html = await response.text();

        // Save a small snippet to see what we get
        const snippet = html.substring(0, 2000);

        console.log(`\n========== Testing: @${username} ==========`);
        console.log(`HTTP Status: ${response.status}`);
        console.log(`HTML Length: ${html.length} chars`);
        console.log(`\nFirst 500 chars:`);
        console.log(snippet.substring(0, 500));
        console.log(`\n--- Detection Checks ---`);
        console.log(`Contains "Sorry, this page"?: ${html.includes('Sorry, this page')}`);
        console.log(`Contains "Page Not Found"?: ${html.includes('Page Not Found')}`);
        console.log(`Contains "isn't available"?: ${html.includes('isn\'t available')}`);
        console.log(`Contains "profile_pic"?: ${html.includes('profile_pic')}`);
        console.log(`Contains "username"?: ${html.includes('"username"')}`);
        console.log(`Contains "@type":"Person"?: ${html.includes('@type":"Person')}`);
        console.log(`Contains "alternateName"?: ${html.includes('alternateName')}`);

    } catch (error) {
        console.error(`Error:`, error.message);
    }
};

// Just test one fake username
testUsername('thisuserdoesnotexist999999');
