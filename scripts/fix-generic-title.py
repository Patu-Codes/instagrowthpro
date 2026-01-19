#!/usr/bin/env python3
"""
Add check for generic "Instagram" title (indicates non-existent profile)
"""

# Read the file
with open('backend-server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the hasProfileData check with a better one
old_code = '''        // BETTER CHECK: Real profiles have og:title meta tag
        const hasProfileData = html.includes('og:title') || 
                              html.includes('og:description') ||
                              html.includes('profilePage"');

        if (!hasProfileData) {'''

new_code = '''        // BETTER CHECK: Real profiles have og:title with username, NOT just "Instagram"
        const hasOgTitle = html.includes('og:title');
        const hasGenericTitle = html.includes('property="og:title" content="Instagram"') ||
                               html.includes('og:title\\" content=\\"Instagram\\"');
        
        // If no og:title OR has generic "Instagram" title = doesn't exist
        if (!hasOgTitle || hasGenericTitle) {'''

if old_code in content:
    content = content.replace(old_code, new_code)
    
    with open('backend-server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Successfully added generic title detection")
    print("✅ Now checking if og:title is just 'Instagram' (fake profile indicator)")
    print("\n📌 Logic:")
    print("   - No og:title → doesn't exist")
    print("   - og:title = 'Instagram' → doesn't exist") 
    print("   - og:title = 'username (@handle) • Instagram' → exists")
else:
    print("❌ Could not find the code to replace")
    print("Trying alternate search...")
    
    # Try finding just the hasProfileData line
    if 'const hasProfileData = html.includes' in content:
        print("✅ Found hasProfileData line - manual fix needed")
    
    exit(1)
