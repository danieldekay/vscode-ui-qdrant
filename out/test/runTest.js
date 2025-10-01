"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const path = require("node:path");
const glob_1 = require("glob");
const Mocha = require("mocha");
function run() {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        color: true,
        timeout: 10000,
    });

    const testsRoot = path.resolve(__dirname, '..');
    console.log('testsRoot:', testsRoot);
    return new Promise((resolve, reject) => {
        (0, glob_1.glob)('tests/unit/**/*.js', { cwd: testsRoot }, (err, files) => {
            if (err) {
                return reject(err);
            }
            console.log(`Found ${files.length} test files:`, files);
            // Add files to the test suite
            files.forEach((f) => {
                mocha.addFile(path.resolve(testsRoot, f));
            });
            try {
                // Run the mocha test
                mocha.run((failures) => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    }
                    else {
                        resolve();
                    }
                });
            }
            catch (err) {
                console.error(err);
                reject(err);
            }
        });
    });
}
