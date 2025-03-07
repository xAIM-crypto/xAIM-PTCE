import {
  Model,
  InitialEvaluations,
  DiscussionResults,
  ConsensusScores,
  PredictiveOutcomes,
  PTCEResult,
  FeatureVector,
  AttributeType,
  LLMInteractionLogEntry,
  DetailedPTCEResult
} from '../types/ptce.types';
import { OpenAIService } from './openai-service';
import { validateConfig } from '../config/config';

/**
 * Predictive Triadic Consensus Engine (PTCE) Service
 * 
 * This service implements the PTCE algorithm for determining tournament winners
 * through a collaborative evaluation using multiple specialized LLMs.
 */
export class PTCEService {
  private openAIService: OpenAIService;
  private interactionLog: LLMInteractionLogEntry[] = [];

  constructor() {
    // Validate environment configuration
    validateConfig();
    
    // Initialize OpenAI service (will be used for all LLM roles in testing)
    this.openAIService = new OpenAIService();
  }

  /**
   * Determine the winner between two models using the PTCE algorithm
   */
  public async determineWinner(model1: Model, model2: Model): Promise<PTCEResult> {
    try {
      // Reset interaction log for this evaluation
      this.interactionLog = [];
      
      // Log the start of the evaluation
      this.logInteraction('final_determination', null, 'start_evaluation', {
        model1: { id: model1.id, name: model1.name },
        model2: { id: model2.id, name: model2.name }
      });

      // 1. Initial Evaluation Phase - Each LLM evaluates independently
      const evaluations = await this.performInitialEvaluations(model1, model2);
      
      // 2. Interactive Discussion Phase
      const discussionResults = await this.facilitateInteractiveDiscussion(evaluations);
      
      // 3. Consensus Building and Aggregation
      const consensusScores = this.calculateConsensusScores(discussionResults, model1.id, model2.id);
      
      // 4. Predictive Feature Integration
      const predictiveOutcomes = await this.generatePredictiveOutcomes(model1, model2, consensusScores);
      
      // 5. Final Winner Determination
      const winner = this.determineWinnerModel(model1, model2, consensusScores, predictiveOutcomes);
      
      // Log the final determination
      this.logInteraction('final_determination', null, 'winner_determined', {
        winnerId: winner.id,
        winnerName: winner.name,
        model1Score: consensusScores[model1.id].finalScore,
        model2Score: consensusScores[model2.id].finalScore,
        confidence: consensusScores.confidence || 0.7
      });

      // Return the result
      return {
        winner,
        scores: {
          [model1.id]: consensusScores[model1.id].finalScore,
          [model2.id]: consensusScores[model2.id].finalScore
        },
        confidence: consensusScores.confidence || 0.7,
        reasoning: discussionResults.reasoning
      };
    } catch (err) {
      console.error('Error determining match winner:', err);
      throw new Error('Failed to determine winner using PTCE algorithm');
    }
  }

  /**
   * Determine the winner between two models and return detailed interaction logs
   */
  public async determineWinnerWithDetails(model1: Model, model2: Model): Promise<DetailedPTCEResult> {
    try {
      // Reset interaction log for this evaluation
      this.interactionLog = [];
      
      // Log the start of the evaluation
      this.logInteraction('final_determination', null, 'start_evaluation', {
        model1: { id: model1.id, name: model1.name },
        model2: { id: model2.id, name: model2.name }
      });

      // 1. Initial Evaluation Phase - Each LLM evaluates independently
      const evaluations = await this.performInitialEvaluations(model1, model2);
      
      // 2. Interactive Discussion Phase
      const discussionResults = await this.facilitateInteractiveDiscussion(evaluations);
      
      // 3. Consensus Building and Aggregation
      const consensusScores = this.calculateConsensusScores(discussionResults, model1.id, model2.id);
      
      // 4. Predictive Feature Integration
      const predictiveOutcomes = await this.generatePredictiveOutcomes(model1, model2, consensusScores);
      
      // 5. Final Winner Determination
      const winner = this.determineWinnerModel(model1, model2, consensusScores, predictiveOutcomes);
      
      // Log the final determination
      this.logInteraction('final_determination', null, 'winner_determined', {
        winnerId: winner.id,
        winnerName: winner.name,
        model1Score: consensusScores[model1.id].finalScore,
        model2Score: consensusScores[model2.id].finalScore,
        confidence: consensusScores.confidence || 0.7
      });

      // Return the detailed result
      return {
        winner,
        scores: {
          [model1.id]: consensusScores[model1.id].finalScore,
          [model2.id]: consensusScores[model2.id].finalScore
        },
        confidence: consensusScores.confidence || 0.7,
        reasoning: discussionResults.reasoning,
        interactions: this.interactionLog,
        initialEvaluations: evaluations,
        discussionResults,
        consensusScores,
        predictiveOutcomes
      };
    } catch (err) {
      console.error('Error determining match winner with details:', err);
      throw new Error('Failed to determine winner using PTCE algorithm');
    }
  }

  /**
   * Performs initial evaluations using the three specialized LLMs
   * Each LLM has a specific focus area and evaluates each model
   */
  private async performInitialEvaluations(model1: Model, model2: Model): Promise<InitialEvaluations> {
    console.log('Performing initial PTCE evaluations...');
    this.logInteraction('initial_evaluation', null, 'start_initial_evaluations', {
      model1Id: model1.id,
      model2Id: model2.id
    });
    
    // Use OpenAI for all three LLM evaluations (in testing mode)
    try {
      // LLM 1 (ChatGPT): Evaluates creativity and originality
      this.logInteraction('initial_evaluation', 'LLM1 (ChatGPT)', 'evaluating_creativity', {
        model1Id: model1.id,
        model2Id: model2.id
      });
      
      const llm1Model1Eval = await this.openAIService.evaluateModel({
        modelId: model1.id,
        modelName: model1.name,
        modelAttributes: model1.attributes,
        evaluationType: 'creativity'
      });
      
      this.logInteraction('initial_evaluation', 'LLM1 (ChatGPT)', 'evaluated_model', {
        modelId: model1.id,
        score: llm1Model1Eval.score,
        confidence: llm1Model1Eval.confidence,
        reasoning: llm1Model1Eval.reasoning
      });
      
      const llm1Model2Eval = await this.openAIService.evaluateModel({
        modelId: model2.id,
        modelName: model2.name,
        modelAttributes: model2.attributes,
        evaluationType: 'creativity'
      });
      
      this.logInteraction('initial_evaluation', 'LLM1 (ChatGPT)', 'evaluated_model', {
        modelId: model2.id,
        score: llm1Model2Eval.score,
        confidence: llm1Model2Eval.confidence,
        reasoning: llm1Model2Eval.reasoning
      });
      
      const llm1Evaluation = {
        [model1.id]: llm1Model1Eval,
        [model2.id]: llm1Model2Eval
      };
      
      // LLM 2 (DeepSeek): Assesses technical accuracy and stability
      this.logInteraction('initial_evaluation', 'LLM2 (DeepSeek)', 'evaluating_technical', {
        model1Id: model1.id,
        model2Id: model2.id
      });
      
      const llm2Model1Eval = await this.openAIService.evaluateModel({
        modelId: model1.id,
        modelName: model1.name,
        modelAttributes: model1.attributes,
        evaluationType: 'technical'
      });
      
      this.logInteraction('initial_evaluation', 'LLM2 (DeepSeek)', 'evaluated_model', {
        modelId: model1.id,
        score: llm2Model1Eval.score,
        confidence: llm2Model1Eval.confidence,
        reasoning: llm2Model1Eval.reasoning
      });
      
      const llm2Model2Eval = await this.openAIService.evaluateModel({
        modelId: model2.id,
        modelName: model2.name,
        modelAttributes: model2.attributes,
        evaluationType: 'technical'
      });
      
      this.logInteraction('initial_evaluation', 'LLM2 (DeepSeek)', 'evaluated_model', {
        modelId: model2.id,
        score: llm2Model2Eval.score,
        confidence: llm2Model2Eval.confidence,
        reasoning: llm2Model2Eval.reasoning
      });
      
      const llm2Evaluation = {
        [model1.id]: llm2Model1Eval,
        [model2.id]: llm2Model2Eval
      };
      
      // LLM 3 (Grok): Judges performance and functionality
      this.logInteraction('initial_evaluation', 'LLM3 (Grok)', 'evaluating_performance', {
        model1Id: model1.id,
        model2Id: model2.id
      });
      
      const llm3Model1Eval = await this.openAIService.evaluateModel({
        modelId: model1.id,
        modelName: model1.name,
        modelAttributes: model1.attributes,
        evaluationType: 'performance'
      });
      
      this.logInteraction('initial_evaluation', 'LLM3 (Grok)', 'evaluated_model', {
        modelId: model1.id,
        score: llm3Model1Eval.score,
        confidence: llm3Model1Eval.confidence,
        reasoning: llm3Model1Eval.reasoning
      });
      
      const llm3Model2Eval = await this.openAIService.evaluateModel({
        modelId: model2.id,
        modelName: model2.name,
        modelAttributes: model2.attributes,
        evaluationType: 'performance'
      });
      
      this.logInteraction('initial_evaluation', 'LLM3 (Grok)', 'evaluated_model', {
        modelId: model2.id,
        score: llm3Model2Eval.score,
        confidence: llm3Model2Eval.confidence,
        reasoning: llm3Model2Eval.reasoning
      });
      
      const llm3Evaluation = {
        [model1.id]: llm3Model1Eval,
        [model2.id]: llm3Model2Eval
      };
      
      this.logInteraction('initial_evaluation', null, 'completed_initial_evaluations', {
        llm1Scores: {
          [model1.id]: llm1Model1Eval.score,
          [model2.id]: llm1Model2Eval.score
        },
        llm2Scores: {
          [model1.id]: llm2Model1Eval.score,
          [model2.id]: llm2Model2Eval.score
        },
        llm3Scores: {
          [model1.id]: llm3Model1Eval.score,
          [model2.id]: llm3Model2Eval.score
        }
      });
      
      console.log('Successfully completed initial evaluations with OpenAI');
      
      return {
        llm1: llm1Evaluation,
        llm2: llm2Evaluation,
        llm3: llm3Evaluation
      };
    } catch (error) {
      console.error('Error in OpenAI evaluations, falling back to simulated evaluations:', error);
      this.logInteraction('initial_evaluation', null, 'fallback_to_simulated', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Fallback to simulated evaluations if OpenAI fails
      return this.performSimulatedEvaluations(model1, model2);
    }
  }

  /**
   * Performs simulated evaluations (fallback if API calls fail)
   */
  private performSimulatedEvaluations(model1: Model, model2: Model): InitialEvaluations {
    console.log('Performing simulated PTCE evaluations...');
    
    // LLM 1 (ChatGPT): Evaluates creativity and originality
    const llm1Evaluation = {
      [model1.id]: {
        score: this.evaluateAttribute(model1, 'creativity', 5, 10),
        confidence: this.generateConfidenceScore(),
        reasoning: `Model ${model1.name} shows ${model1.attributes.strategy > 70 ? 'high' : 'moderate'} creativity.`
      },
      [model2.id]: {
        score: this.evaluateAttribute(model2, 'creativity', 5, 10),
        confidence: this.generateConfidenceScore(),
        reasoning: `Model ${model2.name} shows ${model2.attributes.strategy > 70 ? 'high' : 'moderate'} creativity.`
      }
    };
    
    // LLM 2 (DeepSeek): Assesses technical accuracy and stability
    const llm2Evaluation = {
      [model1.id]: {
        score: this.evaluateAttribute(model1, 'technical', 5, 10),
        confidence: this.generateConfidenceScore(),
        reasoning: `Model ${model1.name} demonstrates ${model1.attributes.defense > 70 ? 'high' : 'moderate'} technical stability.`
      },
      [model2.id]: {
        score: this.evaluateAttribute(model2, 'technical', 5, 10),
        confidence: this.generateConfidenceScore(),
        reasoning: `Model ${model2.name} demonstrates ${model2.attributes.defense > 70 ? 'high' : 'moderate'} technical stability.`
      }
    };
    
    // LLM 3 (Grok): Judges performance and functionality
    const llm3Evaluation = {
      [model1.id]: {
        score: this.evaluateAttribute(model1, 'performance', 5, 10),
        confidence: this.generateConfidenceScore(),
        reasoning: `Model ${model1.name} performs with ${model1.attributes.attack_power > 70 ? 'high' : 'moderate'} effectiveness.`
      },
      [model2.id]: {
        score: this.evaluateAttribute(model2, 'performance', 5, 10),
        confidence: this.generateConfidenceScore(),
        reasoning: `Model ${model2.name} performs with ${model2.attributes.attack_power > 70 ? 'high' : 'moderate'} effectiveness.`
      }
    };
    
    return {
      llm1: llm1Evaluation,
      llm2: llm2Evaluation,
      llm3: llm3Evaluation
    };
  }

  /**
   * Facilitates interactive discussion among LLMs
   * Each LLM reviews others' evaluations and may update their scores
   */
  private async facilitateInteractiveDiscussion(initialEvaluations: InitialEvaluations): Promise<DiscussionResults> {
    console.log('Facilitating interactive discussion between LLMs...');
    this.logInteraction('discussion', null, 'start_discussion', {
      initialEvaluations: JSON.parse(JSON.stringify(initialEvaluations))
    });
    
    // Extract model IDs from the evaluations
    const modelIds = Object.keys(initialEvaluations.llm1);
    
    // Calculate variance to check if additional discussion is needed
    const varianceByModel: Record<string, number> = {};
    
    for (const modelId of modelIds) {
      const scores = [
        initialEvaluations.llm1[modelId].score,
        initialEvaluations.llm2[modelId].score,
        initialEvaluations.llm3[modelId].score
      ];
      
      varianceByModel[modelId] = this.calculateVariance(scores);
      
      this.logInteraction('discussion', null, 'calculated_variance', {
        modelId,
        scores,
        variance: varianceByModel[modelId]
      });
    }
    
    let finalEvaluations = { ...initialEvaluations };
    let discussionReasoning = '';
    
    // Check if high disagreement exists for any model
    const highDisagreement = Object.values(varianceByModel).some(variance => variance > 2);
    
    // If high disagreement (variance > threshold), simulate additional discussion
    if (highDisagreement) {
      console.log('High disagreement detected. Initiating additional discussion round...');
      this.logInteraction('discussion', null, 'high_disagreement_detected', {
        varianceByModel,
        threshold: 2
      });
      
      // Simulate LLMs adjusting their evaluations based on discussion
      finalEvaluations = this.simulateDiscussionRound(initialEvaluations);
      
      discussionReasoning = `Initial disagreement detected (variance: ${Object.entries(varianceByModel)
        .map(([modelId, variance]) => `${modelId}=${variance.toFixed(2)}`)
        .join(', ')}). After discussion, the evaluations were refined.`;
        
      this.logInteraction('discussion', null, 'discussion_completed', {
        initialEvaluations: JSON.parse(JSON.stringify(initialEvaluations)),
        finalEvaluations: JSON.parse(JSON.stringify(finalEvaluations)),
        reasoning: discussionReasoning
      });
    } else {
      discussionReasoning = `Agreement achieved in initial evaluation (variance: ${Object.entries(varianceByModel)
        .map(([modelId, variance]) => `${modelId}=${variance.toFixed(2)}`)
        .join(', ')}).`;
        
      this.logInteraction('discussion', null, 'no_discussion_needed', {
        varianceByModel,
        reasoning: discussionReasoning
      });
    }
    
    return {
      evaluations: finalEvaluations,
      reasoning: discussionReasoning
    };
  }

  /**
   * Calculate the consensus scores based on the weighted LLM evaluations
   * Uses formula (3) from the PTCE method: S = ∑Wi / ∑Ci where Wi = Si × Ci
   */
  private calculateConsensusScores(discussionResults: DiscussionResults, ...modelIds: string[]): ConsensusScores {
    console.log('Calculating consensus scores...');
    this.logInteraction('consensus_building', null, 'start_consensus_calculation', {
      modelIds
    });
    
    const evaluations = discussionResults.evaluations;
    const result: ConsensusScores = {} as ConsensusScores;
    
    // Process each model
    for (const modelId of modelIds) {
      // Get scores and confidences for this model from all LLMs
      const scores = [
        evaluations.llm1[modelId].score,
        evaluations.llm2[modelId].score,
        evaluations.llm3[modelId].score
      ];
      
      const confidences = [
        evaluations.llm1[modelId].confidence,
        evaluations.llm2[modelId].confidence,
        evaluations.llm3[modelId].confidence
      ];
      
      // Calculate weighted scores
      const weightedScores = scores.map((score, i) => score * confidences[i]);
      
      // Calculate confidence sum
      const confidenceSum = confidences.reduce((sum, conf) => sum + conf, 0);
      
      // Calculate final score (weighted average)
      const finalScore = weightedScores.reduce((sum, score) => sum + score, 0) / confidenceSum;
      
      // Store results for this model
      result[modelId] = {
        individualScores: scores,
        confidenceScores: confidences,
        weightedScores: weightedScores,
        finalScore: finalScore
      };
      
      this.logInteraction('consensus_building', null, 'model_consensus_calculated', {
        modelId,
        scores,
        confidences,
        weightedScores,
        finalScore
      });
    }
    
    // Calculate overall confidence in the decision based on score difference
    if (modelIds.length >= 2) {
      const scores = modelIds.map(id => result[id].finalScore);
      const scoreDifference = Math.abs(scores[0] - scores[1]);
      result.confidence = Math.min(1.0, scoreDifference / 2 + 0.5);
      
      this.logInteraction('consensus_building', null, 'overall_confidence_calculated', {
        modelScores: modelIds.reduce((obj, id, index) => {
          obj[id] = scores[index];
          return obj;
        }, {} as Record<string, number>),
        scoreDifference,
        confidence: result.confidence
      });
    } else {
      result.confidence = 0.7; // Default confidence if only one model
      this.logInteraction('consensus_building', null, 'default_confidence_used', {
        confidence: 0.7,
        reason: 'Only one model provided'
      });
    }
    
    return result;
  }

  /**
   * Generates predictive outcomes using feature vectors and a neural network
   * Uses formula (4) from PTCE: Poutcome = NN(∑Ci × Fi)
   */
  private async generatePredictiveOutcomes(
    model1: Model, 
    model2: Model, 
    consensusScores: ConsensusScores
  ): Promise<PredictiveOutcomes> {
    console.log('Generating predictive outcomes...');
    this.logInteraction('predictive_integration', null, 'start_predictive_outcomes', {
      model1Id: model1.id,
      model2Id: model2.id
    });
    
    const result: PredictiveOutcomes = {};
    
    // Process each model
    for (const model of [model1, model2]) {
      // Generate feature vector for this model
      const featureVector = this.generateFeatureVector(model);
      
      this.logInteraction('predictive_integration', null, 'feature_vector_generated', {
        modelId: model.id,
        featureVector
      });
      
      // Get confidence scores for this model
      const confidenceScores = consensusScores[model.id].confidenceScores;
      
      // Calculate confidence-weighted feature vector
      const weightedFeatures = featureVector.map((feature, index) => 
        feature * confidenceScores[index % 3]
      );
      
      this.logInteraction('predictive_integration', null, 'weighted_features_calculated', {
        modelId: model.id,
        confidenceScores,
        weightedFeatures
      });
      
      // Simulate neural network prediction
      const prediction = this.simulateNeuralNetworkPrediction(weightedFeatures);
      
      this.logInteraction('predictive_integration', null, 'prediction_generated', {
        modelId: model.id,
        prediction
      });
      
      // Store prediction for this model
      result[model.id] = prediction;
    }
    
    return result;
  }

  /**
   * Final winner determination based on consensus scores and predictive outcomes
   * Uses Bayesian refinement for the final decision
   */
  private determineWinnerModel(
    model1: Model, 
    model2: Model, 
    consensusScores: ConsensusScores, 
    predictiveOutcomes: PredictiveOutcomes
  ): Model {
    console.log('Determining tournament match winner...');
    this.logInteraction('final_determination', null, 'calculating_final_scores', {
      model1Id: model1.id,
      model2Id: model2.id,
      consensusScores: {
        [model1.id]: consensusScores[model1.id].finalScore,
        [model2.id]: consensusScores[model2.id].finalScore
      },
      predictiveOutcomes
    });
    
    // Weighted combination (70% consensus score, 30% predictive probability)
    const model1FinalScore = 0.7 * consensusScores[model1.id].finalScore + 
                            0.3 * predictiveOutcomes[model1.id] * 10;
    
    const model2FinalScore = 0.7 * consensusScores[model2.id].finalScore + 
                            0.3 * predictiveOutcomes[model2.id] * 10;
    
    this.logInteraction('final_determination', null, 'final_scores_calculated', {
      [model1.id]: model1FinalScore,
      [model2.id]: model2FinalScore,
      weights: {
        consensus: 0.7,
        predictive: 0.3
      }
    });
    
    // Return the model with the higher final score as the winner
    return model1FinalScore > model2FinalScore ? model1 : model2;
  }

  // Utility functions for the PTCE algorithm

  /**
   * Evaluates a specific attribute of a model
   */
  private evaluateAttribute(model: Model, attributeType: AttributeType, min: number, max: number): number {
    // Map model attributes to appropriate scores based on attribute type
    let baseScore: number;
    
    switch (attributeType) {
      case 'creativity':
        baseScore = (model.attributes.strategy + model.attributes.endurance) / 2;
        break;
      case 'technical':
        baseScore = (model.attributes.defense + model.attributes.speed_agility) / 2;
        break;
      case 'performance':
        baseScore = (model.attributes.attack_power + model.attributes.speed_agility) / 2;
        break;
      default:
        baseScore = (model.attributes.attack_power + model.attributes.defense + 
                     model.attributes.speed_agility + model.attributes.strategy + 
                     model.attributes.endurance) / 5;
    }
    
    // Scale to desired range
    return min + (baseScore / 100) * (max - min);
  }

  /**
   * Generates a confidence score for an LLM evaluation
   */
  private generateConfidenceScore(): number {
    // Generate a random confidence score between 0.7 and 0.95
    // In the real implementation, this will be derived from the LLM's internal uncertainty
    return 0.7 + Math.random() * 0.25;
  }

  /**
   * Calculates the variance of an array of scores
   */
  private calculateVariance(scores: number[]): number {
    // Calculate the variance of an array of scores
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDifferences = scores.map(score => Math.pow(score - mean, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / scores.length;
    return variance;
  }

  /**
   * Simulates a discussion round that reduces variance in evaluations
   */
  private simulateDiscussionRound(initialEvaluations: InitialEvaluations): InitialEvaluations {
    // Create a deep copy to avoid modifying the original
    const adjustedEvaluations: InitialEvaluations = JSON.parse(JSON.stringify(initialEvaluations));
    
    // Extract model IDs
    const modelIds = Object.keys(initialEvaluations.llm1);
    
    // Process each model
    for (const modelId of modelIds) {
      // Calculate mean scores for this model
      const scores = [
        initialEvaluations.llm1[modelId].score,
        initialEvaluations.llm2[modelId].score,
        initialEvaluations.llm3[modelId].score
      ];
      
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      // Adjustment factor - how much to move toward the mean
      const adjustmentFactor = 0.4;
      
      // Adjust scores to be closer to the mean
      adjustedEvaluations.llm1[modelId].score = 
        initialEvaluations.llm1[modelId].score * (1 - adjustmentFactor) + mean * adjustmentFactor;
        
      adjustedEvaluations.llm2[modelId].score = 
        initialEvaluations.llm2[modelId].score * (1 - adjustmentFactor) + mean * adjustmentFactor;
        
      adjustedEvaluations.llm3[modelId].score = 
        initialEvaluations.llm3[modelId].score * (1 - adjustmentFactor) + mean * adjustmentFactor;
      
      // Increase confidence after discussion
      adjustedEvaluations.llm1[modelId].confidence += 
        (1 - adjustedEvaluations.llm1[modelId].confidence) * 0.3;
        
      adjustedEvaluations.llm2[modelId].confidence += 
        (1 - adjustedEvaluations.llm2[modelId].confidence) * 0.3;
        
      adjustedEvaluations.llm3[modelId].confidence += 
        (1 - adjustedEvaluations.llm3[modelId].confidence) * 0.3;
    }
    
    return adjustedEvaluations;
  }

  /**
   * Generates a feature vector for predictive modeling
   */
  private generateFeatureVector(model: Model): FeatureVector {
    // Generate a feature vector for predictive modeling
    return [
      model.attributes.attack_power / 100,
      model.attributes.defense / 100,
      model.attributes.speed_agility / 100,
      model.attributes.strategy / 100,
      model.attributes.endurance / 100,
      // Additional derived features
      (model.attributes.attack_power + model.attributes.speed_agility) / 200,  // offensive capability
      (model.attributes.defense + model.attributes.endurance) / 200,          // defensive capability
      model.attributes.strategy / 100                                         // tactical advantage
    ];
  }

  /**
   * Simulates a neural network prediction
   */
  private simulateNeuralNetworkPrediction(weightedFeatures: number[]): number {
    // Simulated neural network weights (would come from training in reality)
    const weights = [0.2, 0.15, 0.15, 0.25, 0.15, 0.3, 0.25, 0.4];
    
    // Calculate weighted sum
    const weightedSum = weightedFeatures.reduce((sum, feature, index) => {
      return sum + feature * weights[index % weights.length];
    }, 0);
    
    // Apply sigmoid activation to get probability between 0 and 1
    return 1 / (1 + Math.exp(-weightedSum));
  }

  /**
   * Logs an interaction in the PTCE process
   */
  private logInteraction(
    phase: LLMInteractionLogEntry['phase'],
    llm: string | null,
    action: string,
    details: Record<string, any>
  ): void {
    const entry: LLMInteractionLogEntry = {
      timestamp: new Date().toISOString(),
      phase,
      action,
      details
    };
    
    if (llm) {
      entry.llm = llm;
    }
    
    this.interactionLog.push(entry);
    console.log(`[PTCE ${phase}]${llm ? ` [${llm}]` : ''} ${action}:`, JSON.stringify(details, null, 2));
  }
} 