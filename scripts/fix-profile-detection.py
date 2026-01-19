#!/usr/bin/env python3
"""
Fix the profile data check to use og:title meta tag instead
"""

# Read the file
with open('backend-server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the hasProfileData check
old_check = '''        // BETTER CHECK: If page has NO profile data, it doesn't exist
        const hasProfileData = html.includes('"username"') || 
                              html.includes('"profile_pic') || 
                              html.includes('"full_name"');'''

new_check = '''        // BETTER CHECK: Real profiles have og:title meta tag
        const hasProfileData = html.includes('og:title') || 
                              html.includes('og:description') ||
                              html.includes('profilePage"');'''

if old_check in content:
    content = content.replace(old_check, new_check)
    with open('backend-server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Successfully fixed profile data detection")
    print("✅ Now checking for og:title meta tag (exists on real profiles)")
else:
    print("❌ Could not find the check to replace")
    exit(1)
