#!/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const lines = [];
rl.on('line', (line) => {
    if(line){
        lines.push(line);
    }
});

rl.on('close', () => {
    const step = (900 - 100) / (lines.length - 1);
    const colors = [];
    let cur = 100;
    for(const color of lines){
        colors.push(`  ${Math.round(cur)}: "${color}",`);
        cur += step;
    }

    console.log(`{\n${colors.join('\n')}\n}`);
});