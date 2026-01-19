// Test just one username
const username = 'now_itsgone133vela';

fetch(`https://www.instagram.com/${username}/`)
    .then(res => res.text())
    .then(html => {
        console.log(`Testing: @${username}`);
        console.log(`HTML Length: ${html.length}`);

        // Check og:title
        const titleMatch = html.match(/property="og:title" content="([^"]+)"/);
        if (titleMatch) {
            console.log(`og:title: "${titleMatch[1]}"`);

            if (titleMatch[1] === 'Instagram') {
                console.log('VERDICT: Profile does NOT exist (generic title)');
            } else {
                console.log('VERDICT: Profile exists');
            }
        }

        // Check for error message
        if (html.includes("isn't available")) {
            console.log('VERDICT: Page not available');
        }
    });
