CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  level TEXT DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
  subscription_type TEXT DEFAULT 'Free', -- Free, Paid
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS sentences (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  translation TEXT NOT NULL,
  audio_url TEXT,
  vocabulary TEXT, -- JSON string of vocabulary list
  grammar_explanation TEXT,
  context_usage TEXT,
  level TEXT DEFAULT 'Beginner',
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS learning_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  sentence_id TEXT NOT NULL,
  date_learned INTEGER DEFAULT (unixepoch()),
  next_review_date INTEGER,
  proficiency_score INTEGER DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(sentence_id) REFERENCES sentences(id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
