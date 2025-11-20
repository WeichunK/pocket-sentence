import db from './index';

console.log('Migrating database for SRS...');

try {
    // Add easiness_factor
    try {
        db.prepare('ALTER TABLE learning_records ADD COLUMN easiness_factor REAL DEFAULT 2.5').run();
        console.log('Added easiness_factor column');
    } catch (e: any) {
        if (!e.message.includes('duplicate column name')) throw e;
        console.log('easiness_factor column already exists');
    }

    // Add interval_days
    try {
        db.prepare('ALTER TABLE learning_records ADD COLUMN interval_days INTEGER DEFAULT 0').run();
        console.log('Added interval_days column');
    } catch (e: any) {
        if (!e.message.includes('duplicate column name')) throw e;
        console.log('interval_days column already exists');
    }

    // Add repetitions
    try {
        db.prepare('ALTER TABLE learning_records ADD COLUMN repetitions INTEGER DEFAULT 0').run();
        console.log('Added repetitions column');
    } catch (e: any) {
        if (!e.message.includes('duplicate column name')) throw e;
        console.log('repetitions column already exists');
    }

    console.log('Migration complete.');
} catch (error) {
    console.error('Migration failed:', error);
}
