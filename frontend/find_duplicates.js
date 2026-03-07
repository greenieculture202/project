const fs = require('fs');
const content = fs.readFileSync('src/app/admin-panel/admin-panel.ts', 'utf8');

const keywords = new Set(['if', 'for', 'while', 'switch', 'catch', 'constructor', 'return', 'let', 'const', 'var', 'alert', 'confirm', 'console', 'subscribe', 'setTimeout', 'Object', 'Array', 'Map', 'Set', 'next', 'error', 'complete']);
const pattern = /^\s+(?:async\s+)?([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*(?::\s*[^\{]+)?\{/gm;

let match;
const methods = {};
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    while ((match = pattern.exec(line)) !== null) {
        const name = match[1];
        if (keywords.has(name)) continue;
        if (!methods[name]) methods[name] = [];
        methods[name].push(i + 1);
    }
}

const duplicates = Object.entries(methods).filter(([name, lines]) => lines.length > 1);

if (duplicates.length === 0) {
    console.log("No duplicate methods found.");
} else {
    console.log("Duplicate methods found:");
    duplicates.forEach(([name, lines]) => {
        console.log(`- ${name}: lines ${lines.join(', ')}`);
    });
}
