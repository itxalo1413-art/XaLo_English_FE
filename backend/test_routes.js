import express from 'express';
const app = express();

const tests = [
    { name: 'Named Splat', path: '*splat' },
    { name: 'Slashed Named Splat', path: '/*splat' },
    { name: 'Named Params Star', path: '/:path*' },
];

console.log('Testing Express 5 Catch-all Routes...');

tests.forEach(test => {
    try {
        app.get(test.path, (req, res) => {});
        console.log(`✅ ${test.name} ("${test.path}"): OK`);
    } catch (err) {
        console.log(`❌ ${test.name} ("${test.path}"): ${err.message}`);
    }
});

process.exit(0);
