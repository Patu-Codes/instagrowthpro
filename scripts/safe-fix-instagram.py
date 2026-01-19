#!/usr/bin/env python3
"""
Safely fix Instagram verification in backend-server.js
"""

# Read the entire file
print("📖 Reading backend-server.js...")
with open('backend-server.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"✅ Read {len(lines)} lines")

# Find the line with "const html = await pageResponse.text();"
target_line_num = None
for i, line in enumerate(lines):
    if 'const html = await pageResponse.text();' in line and i > 290:
        target_line_num = i
        break

if not target_line_num:
    print("❌ Could not find target line")
    exit(1)

print(f"✅ Found target at line {target_line_num + 1}")

# Insert the new code after "const html = await pageResponse.text();"
insert_pos = target_line_num + 1

# Skip blank lines
while insert_pos < len(lines) and lines[insert_pos].strip() == '':
    insert_pos += 1

new_code = '''
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

'''

# Convert to lines
new_lines = new_code.split('\n')
new_lines = [line + '\n' for line in new_lines if line or new_lines.index(line) == len(new_lines)-1]

# Insert the new code
lines[insert_pos:insert_pos] = new_lines

print(f"✅ Inserted {len(new_lines)} lines at position {insert_pos + 1}")

# Write back
with open('backend-server.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Successfully updated backend-server.js")
print("✅ Added non-existent profile detection")
print("\n📌 Next steps:")
print("   1. Run: pm2 restart instagrowth-backend")
print("   2. Test with fake username")
