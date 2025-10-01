#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates tsconfig.json against constitutional requirements
 */
function validateTsConfig() {
    const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');

    console.log('🔍 Validating tsconfig.json compliance...\n');

    // Check if tsconfig.json exists
    if (!fs.existsSync(tsconfigPath)) {
        console.error('❌ tsconfig.json not found');
        process.exit(1);
    }

    let tsconfig;
    try {
        tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    } catch (error) {
        console.error('❌ tsconfig.json is not valid JSON');
        process.exit(1);
    }

    const errors = [];
    const warnings = [];

    // Validate compilerOptions exist
    if (!tsconfig.compilerOptions) {
        errors.push('Missing compilerOptions section');
    } else {
        const opts = tsconfig.compilerOptions;

        // Required strict options
        const requiredOptions = {
            strict: true,
            target: ['ES2022', 'ES2023', 'ESNext'],
            sourceMap: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noImplicitReturns: true,
            skipLibCheck: true
        };

        for (const [option, expected] of Object.entries(requiredOptions)) {
            if (!(option in opts)) {
                errors.push(`Missing required compiler option: ${option}`);
            } else if (Array.isArray(expected)) {
                if (!expected.includes(opts[option])) {
                    errors.push(`Invalid ${option}: ${opts[option]}. Must be one of: ${expected.join(', ')}`);
                }
            } else if (opts[option] !== expected) {
                errors.push(`Invalid ${option}: ${opts[option]}. Must be: ${expected}`);
            }
        }

        // Check output directory
        if (opts.outDir !== './dist') {
            warnings.push(`outDir is "${opts.outDir}". Recommended: "./dist"`);
        }

        // Check root directory
        if (opts.rootDir !== './src') {
            warnings.push(`rootDir is "${opts.rootDir}". Recommended: "./src"`);
        }
    }

    // Validate include/exclude
    if (!tsconfig.include || !tsconfig.include.includes('src/**/*')) {
        errors.push('include must contain "src/**/*"');
    }

    if (!tsconfig.exclude) {
        warnings.push('Consider adding exclude for node_modules, dist, tests');
    } else {
        const recommendedExcludes = ['node_modules', 'dist'];
        for (const exclude of recommendedExcludes) {
            if (!tsconfig.exclude.includes(exclude)) {
                warnings.push(`Consider excluding "${exclude}"`);
            }
        }
    }

    // Report results
    if (errors.length > 0) {
        console.error('❌ Validation failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }

    console.log('✅ tsconfig.json is compliant with constitutional requirements');

    if (warnings.length > 0) {
        console.log('\n⚠️  Recommendations:');
        warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    console.log('\n🎉 TypeScript configuration validation passed!');
}

// Run validation if this script is executed directly
if (require.main === module) {
    validateTsConfig();
}

module.exports = { validateTsConfig };