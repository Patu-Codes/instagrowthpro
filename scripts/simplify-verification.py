#!/usr/bin/env python3
"""
SIMPLIFY Instagram verification - use most basic reliable check
"""

# Read the file
with open('backend-server.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the section after pageResponse.text()
found = False
for i, line in enumerate(lines):
    if 'const html = await pageResponse.text();' in line:
        # Replace everything from here until the "Check if account is private" comment
        # Find the private check
        private_check_line = None
        for j in range(i, min(i + 50, len(lines))):
            if '// Check if account is private' in lines[j]:
                private_check_line = j
                break
        
        if private_check_line:
            # Create simple new code
            new_code = [
                '\n',
                '        const html = await pageResponse.text();\n',
                '\n',
                '        // SIMPLIFIED: Check if page shows error message (most reliable)\n',
                '        const pageNotFound = html.includes("Sorry, this page isn\\'t available") ||\n',
                '                           html.includes("this page isn\\'t available");\n',
                '\n',
                '        if (pageNotFound) {\n',
                '            console.log(`❌ Profile @${cleanUsername} does NOT exist`);\n',
                '            const result = {\n',
                '                valid: false,\n',
                '                exists: false,\n',
                '                isPublic: false,\n',
                '                error: \\'Profile does not exist\\'\n',
                '            };\n',
                '            \n',
                '            instagramCheckCache.set(cacheKey, {\n',
                '                data: result,\n',
                '                timestamp: Date.now()\n',
                '            });\n',
                '            \n',
                '            return res.json(result);\n',
                '        }\n',
                '\n',
            ]
            
            # Replace lines from html line to private check
            lines[i:private_check_line] = new_code
            found = True
            print(f"✅ Replaced lines {i+1} to {private_check_line+1}")
            break

if not found:
    print("❌ Could not find the section to replace")
    exit(1)

# Write back
with open('backend-server.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Successfully simplified Instagram verification")
print("\n📌 New Logic (SIMPLE & RELIABLE):")
print("   1. If page says 'Sorry, this page isn\\'t available' → doesn\\'t exist")
print("   2. If page says 'is_private':true → private account")
print("   3. Otherwise → assume it exists and is public")
print("\n⚠️  This is the most reliable approach without using Instagram API")
