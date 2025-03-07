import OpenAI from 'openai';
import { openAIConfig } from '../config/config';
import { LLMRequest, LLMResponse, AttributeType } from '../types/ptce.types';

/**
 * Service for interacting with the OpenAI API
 * This will handle all three LLM roles for testing purposes
 */
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: openAIConfig.apiKey,
    });
  }

  /**
   * Generic method to evaluate a model using OpenAI
   */
  public async evaluateModel(request: LLMRequest): Promise<LLMResponse> {
    try {
      // Create a prompt based on the evaluation type
      const prompt = this.createPromptForEvaluation(request);

      // Make API call to OpenAI
      // Using 4o-mini which supports JSON response format
      // If you want to use GPT-4, remove the response_format parameter
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Model that supports JSON response format
        messages: [
          { 
            role: "system", 
            content: this.getSystemPromptForEvaluationType(request.evaluationType) 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      // Parse the response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      const parsedResponse = JSON.parse(content);

      // Ensure the response has the expected format
      if (!parsedResponse.score || !parsedResponse.confidence || !parsedResponse.reasoning) {
        throw new Error("Invalid response format from OpenAI");
      }

      // Return the evaluation
      return {
        score: parseFloat(parsedResponse.score),
        confidence: parseFloat(parsedResponse.confidence),
        reasoning: parsedResponse.reasoning
      };
    } catch (error) {
      console.error('Error in OpenAI evaluation:', error);
      
      // Return a fallback evaluation
      return this.generateFallbackEvaluation(request);
    }
  }

  /**
   * Creates the appropriate prompt for the evaluation type
   */
  private createPromptForEvaluation(request: LLMRequest): string {
    const { modelId, modelName, modelAttributes, evaluationType } = request;
    
    // Convert attributes to a human-readable format
    const attributesText = Object.entries(modelAttributes)
      .map(([key, value]) => `- ${key.replace('_', ' ')}: ${value}/100`)
      .join('\n');

    // Base prompt with model information
    let prompt = `
    I need you to evaluate a model with the following attributes:
    
    Model ID: ${modelId}
    Model Name: ${modelName}
    
    Attributes (scored out of 100):
    ${attributesText}
    `;

    // Add specific instructions based on evaluation type
    switch (evaluationType) {
      case 'creativity':
        prompt += `
        Please evaluate this model's CREATIVITY and ORIGINALITY.
        Focus on how innovative and unique this model appears based on the strategy and endurance attributes.
        `;
        break;
      case 'technical':
        prompt += `
        Please evaluate this model's TECHNICAL ACCURACY and STABILITY.
        Focus on how reliable and structurally sound this model appears based on the defense and speed/agility attributes.
        `;
        break;
      case 'performance':
        prompt += `
        Please evaluate this model's PERFORMANCE and FUNCTIONALITY.
        Focus on how effectively this model would perform in simulated scenarios based on the attack power and speed/agility attributes.
        `;
        break;
      default:
        prompt += `
        Please provide an overall evaluation of this model based on all its attributes.
        `;
    }

    // Add response format instructions
    prompt += `
    Please provide your evaluation as a JSON object with the following fields:
    - score: A numerical score between 5 and 10, where 10 is excellent
    - confidence: Your confidence in this evaluation as a decimal between 0.7 and 0.95
    - reasoning: A brief explanation of your evaluation
    `;

    return prompt;
  }

  /**
   * Returns the appropriate system prompt for each evaluation type
   */
  private getSystemPromptForEvaluationType(evaluationType: AttributeType): string {
    switch (evaluationType) {
      case 'creativity':
        return `You are LLM 1 (ChatGPT), an expert in evaluating creativity and originality in AI models. 
        Your task is to assess how innovative and unique a model is based on its attributes.
        You should focus on the novelty and artistic value of the model's approach.
        Provide a score between 5-10, confidence level (0.7-0.95), and reasoning.`;
        
      case 'technical':
        return `You are LLM 2 (DeepSeek), an expert in evaluating technical accuracy and stability in AI models.
        Your task is to assess the structural integrity and reliability of a model based on its attributes.
        You should focus on potential stability issues or technical strengths.
        Provide a score between 5-10, confidence level (0.7-0.95), and reasoning.`;
        
      case 'performance':
        return `You are LLM 3 (Grok), an expert in evaluating performance and functionality in AI models.
        Your task is to assess how effectively a model would perform in real-world scenarios.
        You should focus on practical utility and functional effectiveness.
        Provide a score between 5-10, confidence level (0.7-0.95), and reasoning.`;
        
      default:
        return `You are an expert AI evaluator. Provide a comprehensive assessment of the model based on all attributes.
        Provide a score between 5-10, confidence level (0.7-0.95), and reasoning.`;
    }
  }

  /**
   * Generates a fallback evaluation if the API call fails
   */
  private generateFallbackEvaluation(request: LLMRequest): LLMResponse {
    console.warn(`Using fallback evaluation for ${request.modelName} (${request.evaluationType})`);
    
    // Generate a score based on relevant attributes
    let score = 7.5; // Default middle score
    
    switch (request.evaluationType) {
      case 'creativity':
        score = 5 + (((request.modelAttributes.strategy + request.modelAttributes.endurance) / 2) / 100) * 5;
        break;
      case 'technical':
        score = 5 + (((request.modelAttributes.defense + request.modelAttributes.speed_agility) / 2) / 100) * 5;
        break;
      case 'performance':
        score = 5 + (((request.modelAttributes.attack_power + request.modelAttributes.speed_agility) / 2) / 100) * 5;
        break;
    }
    
    return {
      score,
      confidence: 0.7, // Minimum confidence for fallback
      reasoning: `Fallback evaluation for ${request.modelName} based on ${request.evaluationType} criteria.`
    };
  }
} 