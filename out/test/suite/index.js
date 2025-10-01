const path = require('path');
const Mocha = require('mocha');
const glob = require('glob');

function run() {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        color: true,
        timeout: 10000
    });

    const testsRoot = path.resolve(__dirname, '../tests');

    return new Promise((resolve, reject) => {
        const testFiles = [];

        // First, find compiled test files in out/test
        glob('**/*test*.js', { cwd: testsRoot }, (err, compiledFiles) => {
            if (err) {
                return reject(err);
            }

            testFiles.push(...compiledFiles.map(f => path.resolve(testsRoot, f)));

            // Then, find source test files in tests/
            const sourceTestsRoot = path.resolve(__dirname, '../../tests');
            glob('**/*test*.js', { cwd: sourceTestsRoot }, (err, sourceFiles) => {
                if (err) {
                    return reject(err);
                }

                testFiles.push(...sourceFiles.map(f => path.resolve(sourceTestsRoot, f)));

                // Add all files to the test suite
                testFiles.forEach(f => {
                    console.log('Adding test file:', f);
                    mocha.addFile(f);
                });

                console.log('Total test files added:', testFiles.length);

                try {
                    // Run the mocha test
                    mocha.run(failures => {
                        if (failures > 0) {
                            reject(new Error(`${failures} tests failed.`));
                        } else {
                            resolve();
                        }
                    });
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            });
        });
    });
}

module.exports = { run };