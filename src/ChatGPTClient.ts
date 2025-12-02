import OpenAI from 'openai';
import { LLMChatClient } from './LLMChatClient.js';
import type {
  Message,
  StructuredOutputConfig,
  StructuredOutputResponse,
  IOpenAIJSONSchema,
} from './LLMChatClient.js';

/**
 * ChatGPT implementation using OpenAI Structured Outputs.
 * Uses strict mode to ensure 100% schema compliance.
 */
export class ChatGPTClient extends LLMChatClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-2024-08-06') {
    super(apiKey);
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async chatWithStructuredOutput<T = any>(
    messages: Message[],
    config: StructuredOutputConfig
  ): Promise<StructuredOutputResponse<T>> {
    // Convert messages to OpenAI format
    const openAIMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Use OpenAI's chat.completions.create with JSON schema
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: openAIMessages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: config.schemaName,
          schema: config.schema,
          strict: true,
        },
      },
    });

    const message = completion.choices[0]?.message;

    if (!message) {
      throw new Error('No response from OpenAI');
    }

    // Handle refusals
    if (message.refusal) {
      throw new Error(`OpenAI refused to respond: ${message.refusal}`);
    }

    // Parse the JSON response
    if (!message.content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedJson = JSON.parse(message.content);

    return {
      data: parsedJson as T,
      rawResponse: completion,
    };
  }
}
