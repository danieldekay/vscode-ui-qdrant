const testRunner = require('./suite/index');

testRunner.run().catch(err => {
    console.error('Test run failed:', err);
    process.exit(1);
});