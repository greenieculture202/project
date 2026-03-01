
import os

path = r'd:\website_major\project\frontend\src\app\admin-panel\admin-panel.css'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lines are 1-indexed in view_file. 1774 is index 1773.
# We want to remove lines 1774 to 1887.
# Keep 0..1772 (which is lines 1..1773)
# Keep 1887.. (which is lines 1888..end)
new_lines = lines[:1773] + lines[1887:]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('File fixed successfully')
