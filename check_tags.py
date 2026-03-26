
import re

with open('frontend/src/app/delivery-panel/delivery-panel.html', 'r', encoding='utf-8') as f:
    text = f.read()

tags = [
    ('ng-container', r'<ng-container\b', r'</ng-container>'),
    ('div', r'<div\b', r'</div>'),
    ('main', r'<main\b', r'</main>'),
    ('aside', r'<aside\b', r'</aside>'),
    ('nav', r'<nav\b', r'</nav>'),
    ('header', r'<header\b', r'</header>'),
    ('section', r'<section\b', r'</section>'),
    ('table', r'<table\b', r'</table>'),
    ('thead', r'<thead\b', r'</thead>'),
    ('tbody', r'<tbody\b', r'</tbody>'),
    ('tr', r'<tr\b', r'</tr>'),
    ('th', r'<th\b', r'</th>'),
    ('td', r'<td\b', r'</td>'),
    ('span', r'<span\b', r'</span>'),
    ('i', r'<i\b', r'</i>'),
    ('button', r'<button\b', r'</button>'),
    ('a', r'<a\b', r'</a>'),
]

for name, open_re, close_re in tags:
    opens = len(re.findall(open_re, text))
    closes = len(re.findall(close_re, text))
    if opens != closes:
        print(f"MISMATCH: {name} (OPEN={opens}, CLOSE={closes})")
    else:
        print(f"MATCH   : {name} ({opens})")

# Check braces
open_br = text.count('{{')
close_br = text.count('}}')
if open_br != close_br:
    print(f"MISMATCH: Braces ({{={open_br}, }}={close_br})")
else:
    print(f"MATCH   : Braces ({open_br})")
