#!/usr/bin/env python3
"""
Add better Instagram profile detection - check for ABSENCE of profile data
"""

# Read the file
with open('backend-server.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with pageNotAvailable check
found = False
for i, line in enumerate(lines):
    if 'const pageNotAvailable' in line:
        # Found the line, now add profile data check after the pageNotAvailable block
        # Find the closing brace of that if statement
        brace_count = 0
        j = i
        while j < len(lines):
            if '{' in lines[j]:
                brace_count += lines[j].count('{')
            if '}' in lines[j]:
                brace_count -= lines[j].count('}')
                if brace_count == 0:
                    # Found the end of pageNotAvailable block
                    # Insert new check after this line
                    insert_pos = j + 1
                    
                    # Skip blank lines
                    while insert_pos < len(lines) and lines[insert_pos].strip() == '':
                        insert_pos += 1
                    
                    new_code = '''
        // BETTER CHECK: If page has NO profile data, it doesn't exist
        const hasProfileData = html.includes('"username"') || 
                              html.includes('"profile_pic') || 
                              html.includes('"full_name"');

        if (!hasProfileData) {
            console.log(`❌ Profile @${cleanUsername} does NOT exist (no profile data)`);
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
                    new_lines = new_code.split('\n')
                    new_lines = [line + '\n' for line in new_lines]
                    
                    lines[insert_pos:insert_pos] = new_lines
                    found = True
                    print(f"✅ Inserted profile data check at line {insert_pos + 1}")
                    break
            j += 1
        break

if not found:
    print("❌ Could not find insertion point")
    exit(1)

# Write back
with open('backend-server.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Successfully added profile data detection")
print("\n📌 Now the backend will:")
print("   1. Check for 'Sorry, this page isn't available'")
print("   2. Check if page has NO profile data")
print("   3. If either is true → profile doesn't exist")
