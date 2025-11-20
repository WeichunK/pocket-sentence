import db from './index';

console.log('Migrating database for Content Expansion...');

try {
    db.prepare('ALTER TABLE sentences ADD COLUMN practice_scenario TEXT').run();
    console.log('Added practice_scenario column to sentences table.');
} catch (error: any) {
    if (error.message.includes('duplicate column name')) {
        console.log('Column practice_scenario already exists.');
    } else {
        console.error('Migration failed:', error);
    }
}

console.log('Migration complete!');
