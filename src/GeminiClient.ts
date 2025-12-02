import { GoogleGenerativeAI, SchemaType, type GenerateContentResult } from '@google/generative-ai';
import { LLMChatClient } from './LLMChatClient.js';
import type {
  Message,
  StructuredOutputConfig,
  StructuredOutputResponse,
  IGeminiJSONSchema,
} from './LLMChatClient.js';

/**
 * Gemini implementation using Google Generative AI with controlled generation.
 * Uses responseSchema for ~99% schema conformity.
 */
export class GeminiClient extends LLMChatClient {
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash-exp') {
    super(apiKey);
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  /**
   * Convert a JSON Schema to Google's Schema format.
   */
  private jsonSchemaToGeminiSchema(jsonSchema: IGeminiJSONSchema | any): any {
    if (jsonSchema.type === 'object' && jsonSchema.properties) {
      const properties: Record<string, any> = {};

      for (const [key, value] of Object.entries(jsonSchema.properties)) {
        properties[key] = this.jsonSchemaToGeminiSchema(value);
      }

      return {
        type: SchemaType.OBJECT,
        properties,
        required: jsonSchema.required || [],
      };
    } else if (jsonSchema.type === 'array' && jsonSchema.items) {
      return {
        type: SchemaType.ARRAY,
        items: this.jsonSchemaToGeminiSchema(jsonSchema.items),
      };
    } else if (jsonSchema.type === 'string') {
      return { type: SchemaType.STRING };
    } else if (jsonSchema.type === 'number' || jsonSchema.type === 'integer') {
      return { type: SchemaType.NUMBER };
    } else if (jsonSchema.type === 'boolean') {
      return { type: SchemaType.BOOLEAN };
    }

    throw new Error(`Unsupported JSON Schema type: ${jsonSchema.type}`);
  }

  async chatWithStructuredOutput<T = any>(
    messages: Message[],
    config: StructuredOutputConfig
  ): Promise<StructuredOutputResponse<T>> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: this.jsonSchemaToGeminiSchema(config.schema),
      },
    });

    // Convert messages to Gemini format
    // For simplicity, we'll combine all messages into a single prompt
    // In production, you might want to use chat sessions for multi-turn conversations
    const prompt = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch (error) {
      throw new Error(`Failed to parse Gemini JSON response: ${text}`);
    }

    return {
      data: parsedData as T,
      rawResponse: result,
    };
  }
}
