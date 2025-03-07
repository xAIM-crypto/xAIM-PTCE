-- Create the saved_models table for storing 3D models
CREATE TABLE IF NOT EXISTS saved_models (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    thumbnail_url TEXT,
    model_3d_url TEXT NOT NULL,
    video_url TEXT,
    texture_urls TEXT,
    attack_power INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    speed_agility INTEGER NOT NULL,
    strategy INTEGER NOT NULL,
    endurance INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    secret_key TEXT
);

-- Create indexes for saved_models table
CREATE INDEX IF NOT EXISTS idx_saved_models_name ON saved_models(name);
CREATE INDEX IF NOT EXISTS idx_saved_models_created_at ON saved_models(created_at);

-- Create the ptce_evaluations table to store evaluation results
CREATE TABLE IF NOT EXISTS ptce_evaluations (
  id SERIAL PRIMARY KEY,
  match_id VARCHAR(50) NOT NULL,
  model1_id VARCHAR(50) NOT NULL,
  model2_id VARCHAR(50) NOT NULL,
  winner_id VARCHAR(50) NOT NULL,
  model1_score DECIMAL(5,2) NOT NULL,
  model2_score DECIMAL(5,2) NOT NULL,
  confidence DECIMAL(4,3) NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on match_id
CREATE INDEX IF NOT EXISTS idx_ptce_evaluations_match_id ON ptce_evaluations(match_id);

-- Create indexes on model IDs for quick lookups
CREATE INDEX IF NOT EXISTS idx_ptce_evaluations_model1_id ON ptce_evaluations(model1_id);
CREATE INDEX IF NOT EXISTS idx_ptce_evaluations_model2_id ON ptce_evaluations(model2_id);
CREATE INDEX IF NOT EXISTS idx_ptce_evaluations_winner_id ON ptce_evaluations(winner_id);

-- Create a view for easy querying of model performance
CREATE OR REPLACE VIEW vw_model_performance AS
SELECT
  model_id,
  COUNT(*) as total_matches,
  SUM(CASE WHEN won THEN 1 ELSE 0 END) as wins,
  SUM(CASE WHEN won THEN 0 ELSE 1 END) as losses,
  ROUND(AVG(score), 2) as avg_score,
  ROUND(AVG(confidence), 3) as avg_confidence
FROM (
  -- Model as participant 1
  SELECT
    model1_id as model_id,
    model1_score as score,
    (model1_id = winner_id) as won,
    confidence
  FROM ptce_evaluations
  
  UNION ALL
  
  -- Model as participant 2
  SELECT
    model2_id as model_id,
    model2_score as score,
    (model2_id = winner_id) as won,
    confidence
  FROM ptce_evaluations
) as model_matches
GROUP BY model_id
ORDER BY wins DESC, avg_score DESC; 