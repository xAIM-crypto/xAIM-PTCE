import { dbPool } from '../config/config';

/**
 * Database service for interacting with the PostgreSQL database
 */
export class DBService {
  /**
   * Executes a query against the database
   */
  public async executeQuery<T>(
    query: string, 
    params: any[] = []
  ): Promise<T[]> {
    try {
      const result = await dbPool.query(query, params);
      return result.rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  }

  /**
   * Logs PTCE results to the database for analysis
   */
  public async logPTCEEvaluation(
    matchId: string,
    model1Id: string,
    model2Id: string,
    winnerId: string,
    model1Score: number,
    model2Score: number,
    confidence: number,
    reasoning: string
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO ptce_evaluations 
        (match_id, model1_id, model2_id, winner_id, model1_score, model2_score, confidence, reasoning, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `;
      
      const params = [
        matchId,
        model1Id,
        model2Id,
        winnerId,
        model1Score,
        model2Score,
        confidence,
        reasoning
      ];
      
      await this.executeQuery(query, params);
      console.log(`PTCE evaluation logged for match ${matchId}`);
    } catch (error) {
      console.error('Failed to log PTCE evaluation:', error);
      // Non-critical operation, don't throw error
    }
  }

  /**
   * Gets historical model performance data
   */
  public async getModelPerformanceHistory(
    modelId: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const query = `
        SELECT 
          match_id, 
          CASE 
            WHEN model1_id = $1 THEN model1_score 
            ELSE model2_score 
          END as score,
          CASE 
            WHEN winner_id = $1 THEN true 
            ELSE false 
          END as won,
          confidence,
          created_at
        FROM ptce_evaluations
        WHERE model1_id = $1 OR model2_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;
      
      const params = [modelId, limit];
      
      return await this.executeQuery(query, params);
    } catch (error) {
      console.error('Failed to get model performance history:', error);
      return [];
    }
  }
} 