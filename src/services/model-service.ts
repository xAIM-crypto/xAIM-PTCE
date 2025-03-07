import { DBService } from './db-service';
import { Model } from '../types/ptce.types';

/**
 * Service for interacting with saved models
 */
export class ModelService {
  private dbService: DBService;

  constructor() {
    this.dbService = new DBService();
  }

  /**
   * Get a model by its ID
   */
  public async getModelById(id: string): Promise<Model | null> {
    try {
      const query = `
        SELECT 
          id, 
          name, 
          prompt, 
          thumbnail_url as "finalThumbnailUrl", 
          model_3d_url as "finalModelUrl", 
          video_url, 
          texture_urls, 
          attack_power, 
          defense, 
          speed_agility, 
          strategy, 
          endurance, 
          ip_address,
          secret_key as "secretKey"
        FROM saved_models 
        WHERE id = $1
      `;
      
      const results = await this.dbService.executeQuery<any>(query, [id]);
      
      if (results.length === 0) {
        return null;
      }
      
      // Transform the database row to match the Model interface
      const model = results[0];
      
      // Parse texture_urls if it's a string
      let textureUrls: string[] = [];
      if (model.texture_urls) {
        try {
          textureUrls = JSON.parse(model.texture_urls);
        } catch (e) {
          // If it's not valid JSON, assume it's a comma-separated string
          textureUrls = model.texture_urls.split(',').map((url: string) => url.trim());
        }
      }
      
      return {
        id: model.id.toString(),
        name: model.name,
        prompt: model.prompt,
        finalThumbnailUrl: model.finalThumbnailUrl || '',
        finalModelUrl: model.finalModelUrl,
        video_url: model.video_url || '',
        texture_urls: textureUrls,
        attributes: {
          attack_power: model.attack_power,
          defense: model.defense,
          speed_agility: model.speed_agility,
          strategy: model.strategy,
          endurance: model.endurance
        },
        ip_address: model.ip_address || '',
        secretKey: model.secretKey || ''
      };
    } catch (error) {
      console.error('Error fetching model by ID:', error);
      return null;
    }
  }

  /**
   * Get multiple models by their IDs
   */
  public async getModelsByIds(ids: string[]): Promise<Model[]> {
    if (ids.length === 0) {
      return [];
    }
    
    try {
      // Create a parameterized query with the correct number of parameters
      const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
      const query = `
        SELECT 
          id, 
          name, 
          prompt, 
          thumbnail_url as "finalThumbnailUrl", 
          model_3d_url as "finalModelUrl", 
          video_url, 
          texture_urls, 
          attack_power, 
          defense, 
          speed_agility, 
          strategy, 
          endurance, 
          ip_address,
          secret_key as "secretKey"
        FROM saved_models 
        WHERE id IN (${placeholders})
      `;
      
      const results = await this.dbService.executeQuery<any>(query, ids);
      
      // Map each database row to a Model object
      return results.map(model => {
        // Parse texture_urls if it's a string
        let textureUrls: string[] = [];
        if (model.texture_urls) {
          try {
            textureUrls = JSON.parse(model.texture_urls);
          } catch (e) {
            // If it's not valid JSON, assume it's a comma-separated string
            textureUrls = model.texture_urls.split(',').map((url: string) => url.trim());
          }
        }
        
        return {
          id: model.id.toString(),
          name: model.name,
          prompt: model.prompt,
          finalThumbnailUrl: model.finalThumbnailUrl || '',
          finalModelUrl: model.finalModelUrl,
          video_url: model.video_url || '',
          texture_urls: textureUrls,
          attributes: {
            attack_power: model.attack_power,
            defense: model.defense,
            speed_agility: model.speed_agility,
            strategy: model.strategy,
            endurance: model.endurance
          },
          ip_address: model.ip_address || '',
          secretKey: model.secretKey || ''
        };
      });
    } catch (error) {
      console.error('Error fetching models by IDs:', error);
      return [];
    }
  }

  /**
   * Save evaluation results for a match between two models
   */
  public async saveMatchResult(
    matchId: string,
    model1: Model,
    model2: Model,
    winnerId: string,
    model1Score: number,
    model2Score: number,
    confidence: number,
    reasoning: string
  ): Promise<boolean> {
    try {
      await this.dbService.logPTCEEvaluation(
        matchId,
        model1.id,
        model2.id,
        winnerId,
        model1Score,
        model2Score,
        confidence,
        reasoning
      );
      return true;
    } catch (error) {
      console.error('Error saving match result:', error);
      return false;
    }
  }
} 