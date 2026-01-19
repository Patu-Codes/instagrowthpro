import re

# Read the file
with open('backend-server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the section
old_section = '''        const html = await pageResponse.text();

        // Check if account is private
        // Instagram shows "This Account is Private" text on private profiles
        const isPrivate = html.includes('"is_private":true') ||
            html.includes('This Account is Private') ||
            html.includes('is_private\\\\":true');

        if (isPrivate) {
            const result = {
                valid: false,
                exists: true,
                isPublic: false,
                error: 'Account is private. Please make it public to continue.'
            };

            instagramCheckCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return res.json(result);
        }

        // Profile exists and is public
        const result = {
            valid: true,
            exists: true,
            isPublic: true,
            username: cleanUsername
        };

        instagramCheckCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });

        console.log(`✅ Verified @${cleanUsername} - Public profile`);
        return res.json(result);'''

new_section = '''        const html = await pageResponse.text();

        // CRITICAL: Check for "Sorry, this page isn't available" (non-existent profiles)
        const pageNotAvailable = html.includes('Sorry, this page isn\\'t available') ||
                                html.includes('this page isn\\'t available');

        if (pageNotAvailable) {
            console.log(`❌ Profile @${cleanUsername} does NOT exist (page not available)`);
            const result = {
                valid: false,
                exists: false,
                isPublic: false,
                error: 'Profile does not exist'
            };
            
            instagramCheckCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
            
            return res.json(result);
        }

        // Check if account is private
        const isPrivate = html.includes('"is_private":true') ||
            html.includes('This Account is Private');

        if (isPrivate) {
            console.log(`🔒 Profile @${cleanUsername} exists but is PRIVATE`);
            const result = {
                valid: false,
                exists: true,
                isPublic: false,
                error: 'Account is private. Please make it public to continue.'
            };

            instagramCheckCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return res.json(result);
        }

        // Profile exists and is public
        console.log(`✅ Profile @${cleanUsername} exists and is PUBLIC`);
        const result = {
            valid: true,
            exists: true,
            isPublic: true,
            username: cleanUsername
        };

        instagramCheckCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });

        return res.json(result);'''

# Replace
if old_section in content:
    content = content.replace(old_section, new_section)
    with open('backend-server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Successfully updated backend-server.js")
    print("✅ Added non-existent profile detection")
else:
    print("❌ Could not find the exact section to replace")
    print("File might have been modified already")
