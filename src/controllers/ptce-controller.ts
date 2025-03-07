import { Request, Response } from 'express';
import { PTCEService } from '../services/ptce-service';
import { Model } from '../types/ptce.types';
import { ModelService } from '../services/model-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller for PTCE (Predictive Triadic Consensus Engine) endpoints
 */
export class PTCEController {
  private ptceService: PTCEService;
  private modelService: ModelService;

  constructor() {
    this.ptceService = new PTCEService();
    this.modelService = new ModelService();
  }

  /**
   * Determines the winner between two models using the PTCE algorithm
   */
  public async determineWinner(req: Request, res: Response): Promise<void> {
    try {
      const { model1, model2 } = req.body;

      // Validate request
      if (!model1 || !model2) {
        res.status(400).json({ error: 'Both model1 and model2 are required' });
        return;
      }

      // Ensure models have required properties
      if (!this.validateModel(model1) || !this.validateModel(model2)) {
        res.status(400).json({ error: 'Models are missing required attributes' });
        return;
      }

      // Generate a unique match ID
      const matchId = uuidv4();

      // Use PTCE service to determine the winner
      const result = await this.ptceService.determineWinner(model1, model2);

      // Log the match result to the database
      try {
        await this.modelService.saveMatchResult(
          matchId,
          model1,
          model2,
          result.winner.id,
          result.scores[model1.id],
          result.scores[model2.id],
          result.confidence,
          result.reasoning
        );
      } catch (dbError) {
        console.warn('Failed to save match result to database:', dbError);
        // Continue with the response even if database logging fails
      }

      // Return the result
      res.json({
        matchId,
        ...result
      });
    } catch (err) {
      console.error('Error in PTCE controller:', err);
      res.status(500).json({ error: 'Server error processing PTCE determination' });
    }
  }

  /**
   * Determines the winner between two models and returns detailed LLM interactions
   */
  public async determineWinnerWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const { model1, model2 } = req.body;

      // Validate request
      if (!model1 || !model2) {
        res.status(400).json({ error: 'Both model1 and model2 are required' });
        return;
      }

      // Ensure models have required properties
      if (!this.validateModel(model1) || !this.validateModel(model2)) {
        res.status(400).json({ error: 'Models are missing required attributes' });
        return;
      }

      // Generate a unique match ID
      const matchId = uuidv4();

      // Use PTCE service to determine the winner with detailed interactions
      const result = await this.ptceService.determineWinnerWithDetails(model1, model2);

      // Log the match result to the database
      try {
        await this.modelService.saveMatchResult(
          matchId,
          model1,
          model2,
          result.winner.id,
          result.scores[model1.id],
          result.scores[model2.id],
          result.confidence,
          result.reasoning
        );
      } catch (dbError) {
        console.warn('Failed to save match result to database:', dbError);
        // Continue with the response even if database logging fails
      }

      // Return the detailed result
      res.json({
        matchId,
        ...result
      });
    } catch (err) {
      console.error('Error in PTCE controller:', err);
      res.status(500).json({ error: 'Server error processing PTCE determination' });
    }
  }

  /**
   * Determines the winner by model IDs instead of full model objects
   */
  public async determineWinnerByIds(req: Request, res: Response): Promise<void> {
    try {
      const { model1Id, model2Id } = req.body;

      // Validate request
      if (!model1Id || !model2Id) {
        res.status(400).json({ error: 'Both model1Id and model2Id are required' });
        return;
      }

      // Fetch models from database
      const model1 = await this.modelService.getModelById(model1Id);
      const model2 = await this.modelService.getModelById(model2Id);

      if (!model1 || !model2) {
        res.status(404).json({ error: 'One or both models not found' });
        return;
      }

      // Generate a unique match ID
      const matchId = uuidv4();

      // Use PTCE service to determine the winner
      const result = await this.ptceService.determineWinner(model1, model2);

      // Log the match result to the database
      try {
        await this.modelService.saveMatchResult(
          matchId,
          model1,
          model2,
          result.winner.id,
          result.scores[model1.id],
          result.scores[model2.id],
          result.confidence,
          result.reasoning
        );
      } catch (dbError) {
        console.warn('Failed to save match result to database:', dbError);
        // Continue with the response even if database logging fails
      }

      // Return the result
      res.json({
        matchId,
        ...result
      });
    } catch (err) {
      console.error('Error in PTCE controller:', err);
      res.status(500).json({ error: 'Server error processing PTCE determination' });
    }
  }

  /**
   * Determines the winner by model IDs and returns detailed LLM interactions
   */
  public async determineWinnerByIdsWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const { model1Id, model2Id } = req.body;

      // Validate request
      if (!model1Id || !model2Id) {
        res.status(400).json({ error: 'Both model1Id and model2Id are required' });
        return;
      }

      // Fetch models from database
      const model1 = await this.modelService.getModelById(model1Id);
      const model2 = await this.modelService.getModelById(model2Id);

      if (!model1 || !model2) {
        res.status(404).json({ error: 'One or both models not found' });
        return;
      }

      // Generate a unique match ID
      const matchId = uuidv4();

      // Use PTCE service to determine the winner with detailed interactions
      const result = await this.ptceService.determineWinnerWithDetails(model1, model2);

      // Log the match result to the database
      try {
        await this.modelService.saveMatchResult(
          matchId,
          model1,
          model2,
          result.winner.id,
          result.scores[model1.id],
          result.scores[model2.id],
          result.confidence,
          result.reasoning
        );
      } catch (dbError) {
        console.warn('Failed to save match result to database:', dbError);
        // Continue with the response even if database logging fails
      }

      // Return the detailed result
      res.json({
        matchId,
        ...result
      });
    } catch (err) {
      console.error('Error in PTCE controller:', err);
      res.status(500).json({ error: 'Server error processing PTCE determination' });
    }
  }

  /**
   * Validates that a model has all required properties
   */
  private validateModel(model: Partial<Model>): boolean {
    // Check required properties
    if (!model.id || !model.name || !model.attributes) {
      return false;
    }

    // Check required attributes
    const requiredAttributes = [
      'attack_power',
      'defense',
      'speed_agility',
      'strategy',
      'endurance'
    ];

    for (const attr of requiredAttributes) {
      if (typeof model.attributes[attr as keyof typeof model.attributes] !== 'number') {
        return false;
      }
    }

    return true;
  }
} 