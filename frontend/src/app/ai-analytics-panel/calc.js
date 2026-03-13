const fs = require('fs');

const labels = [
    { id: 'IN-MH', name: 'Maharashtra', x: 218, y: 215 },
    { id: 'IN-RJ', name: 'Rajasthan', x: 215, y: 125 },
    { id: 'IN-MP', name: 'M.P.', x: 245, y: 162 },
    { id: 'IN-UP', name: 'U.P.', x: 295, y: 118 },
    { id: 'IN-GJ', name: 'Gujarat', x: 168, y: 160 },
    { id: 'IN-KA', name: 'Karnataka', x: 215, y: 265 },
    { id: 'IN-WB', name: 'W.B.', x: 370, y: 128 },
    { id: 'IN-TN', name: 'Tamil Nadu', x: 245, y: 302 },
    { id: 'IN-AP', name: 'A.P.', x: 275, y: 252 },
];

const pins = [
    { name: 'Mumbai', x: 178, y: 215, state: 'IN-MH' },
    { name: 'Delhi', x: 265, y: 100, state: 'IN-DL' },
    { name: 'Bangalore', x: 218, y: 268, state: 'IN-KA' },
    { name: 'Chennai', x: 245, y: 288, state: 'IN-TN' },
    { name: 'Hyderabad', x: 272, y: 218, state: 'IN-TS' },
    { name: 'Kolkata', x: 368, y: 135, state: 'IN-WB' },
    { name: 'Pune', x: 198, y: 228, state: 'IN-MH' },
    { name: 'Jaipur', x: 222, y: 112, state: 'IN-RJ' },
];

const convert = (p) => {
    // Old viewBox was 130 48 320 300 -> mapping to what?
    // Let's actually look at the new path bounds for some states to calibrate
    // We can just rely on the mathematical mapping roughly:
    // Actually wait, let's map based on reference points.
    // IN-GJ center was ~ 168, 160. New IN-GJ bounds: x ~30..150, y~328..450. Center ~ 90, 390
    // old (168, 160) -> new (100, 390)
    // old (370, 128) -> new IN-WB: let's guess
    // Let's just output the arrays with a transformation to let me see.
    let newX = (p.x - 130) * (612 / 320);
    let newY = (p.y - 48) * (696 / 300);
    return { ...p, x: Math.round(newX), y: Math.round(newY) };
}

console.log("Labels:\n", labels.map(convert));
console.log("Pins:\n", pins.map(convert));
