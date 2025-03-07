import { Model, FeatureVector } from '../types/ptce.types';

/**
 * Utility functions for the PTCE algorithm
 */

/**
 * Extracts a human-readable summary of a model's attributes
 */
export function getModelAttributeSummary(model: Model): string {
  const { attack_power, defense, speed_agility, strategy, endurance } = model.attributes;
  
  // Determine primary strengths
  const attributes = [
    { name: 'attack', value: attack_power },
    { name: 'defense', value: defense },
    { name: 'agility', value: speed_agility },
    { name: 'strategy', value: strategy },
    { name: 'endurance', value: endurance }
  ];
  
  // Sort by value descending
  attributes.sort((a, b) => b.value - a.value);
  
  // Get top two strengths
  const topStrengths = attributes.slice(0, 2).map(attr => attr.name);
  
  return `${model.name} demonstrates particular strength in ${topStrengths.join(' and ')}.`;
}

/**
 * Creates a debug log of the PTCE process for a pair of models
 */
export function createPTCEProcessLog(
  model1: Model, 
  model2: Model, 
  initialScores: Record<string, number[]>,
  finalScores: Record<string, number>,
  winner: Model
): string {
  let log = '=== PTCE Process Log ===\n\n';
  
  // Log models being compared
  log += `Comparing Models:\n`;
  log += `1. ${model1.name} (ID: ${model1.id})\n`;
  log += `2. ${model2.name} (ID: ${model2.id})\n\n`;
  
  // Log initial scores
  log += 'Initial LLM Evaluations:\n';
  log += `Model 1 (${model1.name}): ${initialScores[model1.id].join(', ')}\n`;
  log += `Model 2 (${model2.name}): ${initialScores[model2.id].join(', ')}\n\n`;
  
  // Log final scores
  log += 'Final Consensus Scores:\n';
  log += `Model 1 (${model1.name}): ${finalScores[model1.id].toFixed(2)}\n`;
  log += `Model 2 (${model2.name}): ${finalScores[model2.id].toFixed(2)}\n\n`;
  
  // Log winner
  log += `Winner: ${winner.name} (ID: ${winner.id})\n`;
  
  return log;
}

/**
 * Generates a neural network weight matrix (simplified version)
 * In a real implementation, these would come from training
 */
export function generateNeuralNetworkWeights(
  inputSize: number, 
  hiddenSize: number = 8
): number[][] {
  const weights: number[][] = [];
  
  // Generate weights for input -> hidden layer (simplified)
  for (let i = 0; i < inputSize; i++) {
    const layerWeights: number[] = [];
    for (let j = 0; j < hiddenSize; j++) {
      // Generate a weight between -0.5 and 0.5
      layerWeights.push(Math.random() - 0.5);
    }
    weights.push(layerWeights);
  }
  
  return weights;
}

/**
 * Normalizes a feature vector to have values between 0 and 1
 */
export function normalizeFeatureVector(features: FeatureVector): FeatureVector {
  // Find min and max values
  const min = Math.min(...features);
  const max = Math.max(...features);
  
  if (max === min) {
    return features.map(() => 0.5); // All values are the same
  }
  
  // Normalize to 0-1 range
  return features.map(value => (value - min) / (max - min));
} 