const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

rollup({
    entry: 'src/core.js',
    plugins: [
        babel()
    ]
}).then((bundle) => {
    bundle.write({
        dest: 'dest/scrollbar.js',
        moduleName: 'ScrollBar',
        format: 'iife'
    });
}).catch(console.error);
