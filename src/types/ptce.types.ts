/**
 * Types for the Predictive Triadic Consensus Engine (PTCE)
 */

// Model structure based on the provided information
export interface Model {
  id: string;
  name: string;
  prompt: string;
  finalThumbnailUrl: string;
  finalModelUrl: string;
  video_url: string;
  texture_urls: string[];
  attributes: {
    attack_power: number;
    defense: number;
    speed_agility: number;
    strategy: number;
    endurance: number;
  };
  ip_address: string;
  secretKey: string;
}

// LLM Evaluation types
export interface LLMEvaluation {
  score: number;
  confidence: number;
  reasoning: string;
}

// Model evaluation by a single LLM
export interface ModelEvaluation {
  [modelId: string]: LLMEvaluation;
}

// Initial evaluations from all LLMs
export interface InitialEvaluations {
  llm1: ModelEvaluation; // ChatGPT
  llm2: ModelEvaluation; // DeepSeek
  llm3: ModelEvaluation; // Grok
}

// Discussion results
export interface DiscussionResults {
  evaluations: InitialEvaluations;
  reasoning: string;
}

// Model consensus scores
export interface ModelConsensusScore {
  individualScores: number[];
  confidenceScores: number[];
  weightedScores: number[];
  finalScore: number;
}

// Create a separate interface that extends ModelConsensusScore with confidence
interface ModelConsensusScoreMap {
  [modelId: string]: ModelConsensusScore;
}

// Consensus scores for all models
export interface ConsensusScores extends ModelConsensusScoreMap {
  confidence?: number;
}

// Predictive outcomes
export interface PredictiveOutcomes {
  [modelId: string]: number; // Probability of success/winning
}

// Final PTCE result
export interface PTCEResult {
  winner: Model;
  scores: {
    [modelId: string]: number;
  };
  confidence: number;
  reasoning: string;
}

// Feature vector for predictive modeling
export type FeatureVector = number[];

// Attribute types for evaluation
export type AttributeType = 'creativity' | 'technical' | 'performance' | 'overall';

// Neural network input type
export type NeuralNetworkInput = number[];

// LLM Provider types
export type LLMProvider = 'openai' | 'deepseek' | 'grok';

// LLM Request types for different evaluation dimensions
export interface LLMRequest {
  modelId: string;
  modelName: string;
  modelAttributes: Record<string, number>;
  evaluationType: AttributeType;
}

// LLM Response interface
export interface LLMResponse {
  score: number;
  confidence: number;
  reasoning: string;
}

// LLM Interaction Log Entry
export interface LLMInteractionLogEntry {
  timestamp: string;
  phase: 'initial_evaluation' | 'discussion' | 'consensus_building' | 'predictive_integration' | 'final_determination';
  llm?: string;
  action: string;
  details: Record<string, any>;
}

// Enhanced PTCE Result with detailed logs
export interface DetailedPTCEResult extends PTCEResult {
  interactions: LLMInteractionLogEntry[];
  initialEvaluations: InitialEvaluations;
  discussionResults: DiscussionResults;
  consensusScores: ConsensusScores;
  predictiveOutcomes: PredictiveOutcomes;
} 