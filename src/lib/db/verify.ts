import { initDB } from './index';
import db from './index';

async function verify() {
  console.log('Starting Verification...');
  initDB();

  // 1. Fetch Daily Sentences
  console.log('\n1. Fetching Daily Sentences...');
  const daily = db.prepare('SELECT * FROM sentences LIMIT 1').get() as any;
  if (!daily) throw new Error('No sentences found');
  console.log('   Fetched:', daily.text);

  // 2. Learn a Sentence
  console.log('\n2. Learning Sentence...');
  const userId = 'user-test';

  // Ensure user exists
  db.prepare("INSERT OR IGNORE INTO users (id, level, subscription_type) VALUES (?, 'Beginner', 'Free')").run(userId);

  const nextReview = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
  db.prepare('DELETE FROM learning_records WHERE user_id = ?').run(userId); // Cleanup

  db.prepare(`
    INSERT INTO learning_records (id, user_id, sentence_id, date_learned, next_review_date, proficiency_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('test-record-1', userId, daily.id, Math.floor(Date.now() / 1000), nextReview, 1);
  console.log('   Record saved.');

  // 3. Check History
  console.log('\n3. Checking History...');
  const history = db.prepare('SELECT * FROM learning_records WHERE user_id = ?').all(userId);
  if (history.length !== 1) throw new Error('History count mismatch');
  console.log('   History verified.');

  // 4. Check Review (Should be empty)
  console.log('\n4. Checking Review (Should be empty)...');
  const now = Math.floor(Date.now() / 1000);
  const reviews = db.prepare(`
    SELECT * FROM learning_records WHERE user_id = ? AND next_review_date <= ?
  `).all(userId, now);
  if (reviews.length !== 0) throw new Error('Review should be empty');
  console.log('   Review list is empty as expected.');

  // 5. Simulate Time Passing (Make it due)
  console.log('\n5. Simulating Time Passing...');
  db.prepare('UPDATE learning_records SET next_review_date = ? WHERE id = ?').run(now - 100, 'test-record-1');

  const reviewsDue = db.prepare(`
    SELECT * FROM learning_records WHERE user_id = ? AND next_review_date <= ?
  `).all(userId, now);
  if (reviewsDue.length !== 1) throw new Error('Review should have 1 item');
  console.log('   Review item appeared.');

  // 6. Test Retention Logic
  console.log('\n6. Testing Retention Logic...');
  // Set retention to 3 days
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('retention_period_days', '3')").run();

  // Case A: Learned today (Should show)
  const cutoff3Days = now - (3 * 86400);
  const reviewsA = db.prepare(`
    SELECT * FROM learning_records 
    WHERE user_id = ? AND next_review_date <= ? AND date_learned >= ?
  `).all(userId, now, cutoff3Days);
  if (reviewsA.length !== 1) throw new Error('Should still show (learned today)');
  console.log('   Case A (Recent): Visible.');

  // Case B: Learned 5 days ago (Should hide)
  const oldDate = now - (5 * 86400);
  db.prepare('UPDATE learning_records SET date_learned = ? WHERE id = ?').run(oldDate, 'test-record-1');

  const reviewsB = db.prepare(`
    SELECT * FROM learning_records 
    WHERE user_id = ? AND next_review_date <= ? AND date_learned >= ?
  `).all(userId, now, cutoff3Days);
  if (reviewsB.length !== 0) throw new Error('Should be hidden (too old)');
  console.log('   Case B (Old): Hidden.');

  console.log('\nVerification Complete! All tests passed.');
}

verify().catch(console.error);
