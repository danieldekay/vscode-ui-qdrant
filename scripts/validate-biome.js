#!/usr/bin/env node

/**
 * Biome Configuration Validation Script
 *
 * Validates that biome.json configuration meets constitutional requirements
 * and follows best practices for linting and formatting.
 */

const fs = require('fs');
const path = require('path');

const BIOME_CONFIG_PATH = path.join(__dirname, '../biome.json');

function validateBiomeConfig() {
    console.log('🔍 Validating biome.json compliance...\n');

    // Check if biome.json exists
    if (!fs.existsSync(BIOME_CONFIG_PATH)) {
        console.error('❌ biome.json not found at project root');
        process.exit(1);
    }

    let config;
    try {
        config = JSON.parse(fs.readFileSync(BIOME_CONFIG_PATH, 'utf8'));
    } catch (error) {
        console.error('❌ biome.json is not valid JSON:', error.message);
        process.exit(1);
    }

    const errors = [];
    const warnings = [];

    // Validate required sections
    if (!config.formatter) {
        errors.push('formatter section is required');
    } else {
        // Validate formatter settings
        if (config.formatter.enabled !== true) {
            errors.push('formatter.enabled must be true');
        }
        if (config.formatter.indentStyle !== 'space') {
            errors.push('formatter.indentStyle must be "space"');
        }
        if (config.formatter.indentWidth !== 2) {
            errors.push('formatter.indentWidth must be 2');
        }
        if (config.formatter.lineWidth > 120) {
            warnings.push('formatter.lineWidth > 120 may reduce readability');
        }
    }

    if (!config.linter) {
        errors.push('linter section is required');
    } else {
        // Validate linter settings
        if (config.linter.enabled !== true) {
            errors.push('linter.enabled must be true');
        }
        if (!config.linter.rules) {
            errors.push('linter.rules must be defined');
        }
    }

    if (!config.files) {
        errors.push('files section is required');
    } else {
        // Validate file patterns
        if (!config.files.ignore) {
            warnings.push('files.ignore should exclude dist/ and node_modules/ for performance');
        } else {
            if (!config.files.ignore.includes('dist/')) {
                warnings.push('files.ignore should include "dist/"');
            }
            if (!config.files.ignore.includes('node_modules/')) {
                warnings.push('files.ignore should include "node_modules/"');
            }
        }

        if (!config.files.include) {
            warnings.push('files.include should specify TypeScript files');
        } else {
            const hasTsFiles = config.files.include.some(pattern =>
                pattern.includes('**/*.ts') || pattern.includes('src/')
            );
            if (!hasTsFiles) {
                warnings.push('files.include should include TypeScript source files');
            }
        }
    }

    // Validate organizeImports
    if (!config.organizeImports || config.organizeImports.enabled !== true) {
        warnings.push('organizeImports.enabled should be true for automatic import organization');
    }

    // Report results
    if (errors.length > 0) {
        console.error('❌ Configuration errors:');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error('');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  Configuration warnings:');
        warnings.forEach(warning => console.warn(`  - ${warning}`));
        console.warn('');
    }

    console.log('✅ biome.json is compliant with constitutional requirements');
    console.log('🎉 Biome configuration validation passed!\n');
}

function validateBiomeInstallation() {
    console.log('🔍 Validating Biome installation...\n');

    try {
        const { execSync } = require('child_process');
        const version = execSync('npx biome --version', { encoding: 'utf8' }).trim();
        console.log(`✅ Biome is installed: ${version}`);
    } catch (error) {
        console.error('❌ Biome is not installed or not accessible');
        console.error('Run: npm install --save-dev @biomejs/biome');
        process.exit(1);
    }
}

function validateBiomeFunctionality() {
    console.log('🔍 Validating Biome functionality...\n');

    const testFile = path.join(__dirname, '../src/biome-test.ts');
    const testContent = `const test=()=>{return'test'};`;

    try {
        // Create test file
        fs.writeFileSync(testFile, testContent);

        // Test formatting
        const { execSync } = require('child_process');
        execSync('npx biome format --write src/biome-test.ts', { encoding: 'utf8' });

        // Check if file was formatted
        const formattedContent = fs.readFileSync(testFile, 'utf8');
        if (formattedContent.includes('const test = () => { return \'test\'; };')) {
            console.log('✅ Biome formatting works correctly');
        } else {
            console.warn('⚠️  Biome formatting may not be working as expected');
        }

        // Test linting
        try {
            execSync('npx biome check src/biome-test.ts', { encoding: 'utf8' });
            console.log('✅ Biome linting works correctly');
        } catch (lintError) {
            // Expected to have some linting issues with test file
            if (lintError.stdout && lintError.stdout.includes('error')) {
                console.log('✅ Biome linting detects issues correctly');
            } else {
                throw lintError;
            }
        }

    } catch (error) {
        console.error('❌ Biome functionality test failed:', error.message);
        process.exit(1);
    } finally {
        // Cleanup
        if (fs.existsSync(testFile)) {
            fs.unlinkSync(testFile);
        }
    }
}

// Run all validations
validateBiomeInstallation();
validateBiomeConfig();
validateBiomeFunctionality();

console.log('🎉 All Biome validations passed!');