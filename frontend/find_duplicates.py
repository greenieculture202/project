import re

def find_duplicates(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match method definitions like '  methodName(args) {' or '  async methodName(args) {'
    # This is a bit rough but works for most TS/JS class methods
    pattern = re.compile(r'^\s+(?:async\s+)?([a-zA-Z0-9_]+)\s*\([^)]*\)\s*(?::\s*[^\{]+)?\{', re.MULTILINE)
    
    matches = pattern.finditer(content)
    methods = {}
    
    for match in matches:
        name = match.group(1)
        line = content.count('\n', 0, match.start()) + 1
        if name not in methods:
            methods[name] = []
        methods[name].append(line)
    
    duplicates = {name: lines for name, lines in methods.items() if len(lines) > 1}
    
    if not duplicates:
        print("No duplicate methods found.")
    else:
        print("Duplicate methods found:")
        for name, lines in duplicates.items():
            print(f"- {name}: lines {', '.join(map(str, lines))}")

if __name__ == "__main__":
    find_duplicates('src/app/admin-panel/admin-panel.ts')
