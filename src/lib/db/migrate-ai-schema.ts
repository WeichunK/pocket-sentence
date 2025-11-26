import db from './index';

/**
 * Migration to add support for AI-generated sentences
 * Adds 'source' column to track whether sentence is from seed data or AI
 */
export function migrateAISchema() {
    console.log('Starting AI schema migration...');

    try {
        // Check if 'source' column exists
        const tableInfo = db.pragma('table_info(sentences)') as Array<{ name: string; type: string }>;
        const hasSourceColumn = tableInfo.some((col) => col.name === 'source');
        const hasScenarioColumn = tableInfo.some((col) => col.name === 'practice_scenario');

        // Add source column if it doesn't exist
        if (!hasSourceColumn) {
            console.log('Adding source column...');
            db.exec(`ALTER TABLE sentences ADD COLUMN source TEXT DEFAULT 'seed'`);
            console.log('✓ Source column added');
        } else {
            console.log('✓ Source column already exists');
        }

        // Add practice_scenario column if it doesn't exist (for backward compatibility)
        if (!hasScenarioColumn) {
            console.log('Adding practice_scenario column...');
            db.exec(`ALTER TABLE sentences ADD COLUMN practice_scenario TEXT`);
            console.log('✓ Practice scenario column added');
        } else {
            console.log('✓ Practice scenario column already exists');
        }

        console.log('AI schema migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateAISchema();
}
