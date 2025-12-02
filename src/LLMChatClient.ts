export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ============================================================================
// OpenAI JSON Schema Interface (Structured Outputs with strict mode)
// Based on: https://platform.openai.com/docs/guides/structured-outputs
// ============================================================================

/**
 * OpenAI JSON Schema type for structured outputs.
 * Supports: string, number, boolean, integer, object, array, enum, anyOf
 */
export type OpenAISchemaType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'object'
  | 'array'
  | 'null';

/**
 * String format validators supported by OpenAI
 */
export type OpenAIStringFormat =
  | 'date-time'
  | 'time'
  | 'date'
  | 'duration'
  | 'email'
  | 'hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uuid';

/**
 * Base OpenAI JSON Schema properties
 */
interface IOpenAISchemaBase {
  type: OpenAISchemaType | OpenAISchemaType[];
  description?: string;
  enum?: (string | number)[];
  const?: string | number | boolean;
  $ref?: string;
  $defs?: Record<string, IOpenAIJSONSchema>;
  [key: string]: unknown; // Index signature for OpenAI SDK compatibility
}

/**
 * OpenAI String Schema properties
 */
interface IOpenAIStringSchema extends IOpenAISchemaBase {
  type: 'string';
  pattern?: string;
  format?: OpenAIStringFormat;
  minLength?: number;
  maxLength?: number;
}

/**
 * OpenAI Number/Integer Schema properties
 */
interface IOpenAINumberSchema extends IOpenAISchemaBase {
  type: 'number' | 'integer';
  multipleOf?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
}

/**
 * OpenAI Boolean Schema properties
 */
interface IOpenAIBooleanSchema extends IOpenAISchemaBase {
  type: 'boolean';
}

/**
 * OpenAI Array Schema properties
 */
interface IOpenAIArraySchema extends IOpenAISchemaBase {
  type: 'array';
  items: IOpenAIJSONSchema;
  minItems?: number;
  maxItems?: number;
}

/**
 * OpenAI Object Schema properties
 * Note: In strict mode, ALL properties MUST be in 'required' array
 * and additionalProperties MUST be false
 */
interface IOpenAIObjectSchema extends IOpenAISchemaBase {
  type: 'object';
  properties: Record<string, IOpenAIJSONSchema>;
  required: string[]; // REQUIRED in strict mode - must include ALL properties
  additionalProperties: false; // REQUIRED in strict mode
}

/**
 * OpenAI anyOf Schema (union types)
 */
interface IOpenAIAnyOfSchema extends IOpenAISchemaBase {
  anyOf: IOpenAIJSONSchema[];
}

/**
 * Complete OpenAI JSON Schema interface
 */
export type IOpenAIJSONSchema =
  | IOpenAIStringSchema
  | IOpenAINumberSchema
  | IOpenAIBooleanSchema
  | IOpenAIArraySchema
  | IOpenAIObjectSchema
  | IOpenAIAnyOfSchema;

// ============================================================================
// Gemini JSON Schema Interface (Controlled Generation)
// Based on: https://ai.google.dev/gemini-api/docs/structured-output
// Based on OpenAPI 3.0 Schema subset with propertyOrdering extension
// ============================================================================

/**
 * Gemini Schema type
 * Note: Uses OpenAPI 3.0 data types
 */
export type GeminiSchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object';

/**
 * Base Gemini Schema properties
 */
interface IGeminiSchemaBase {
  type: GeminiSchemaType;
  description?: string;
  nullable?: boolean; // Gemini-specific: allows null values
  enum?: string[];
  [key: string]: unknown; // Index signature for flexibility
}

/**
 * Gemini String Schema properties
 */
interface IGeminiStringSchema extends IGeminiSchemaBase {
  type: 'string';
  format?: string; // e.g., 'date-time'
}

/**
 * Gemini Number/Integer Schema properties
 */
interface IGeminiNumberSchema extends IGeminiSchemaBase {
  type: 'number' | 'integer';
  format?: string; // e.g., 'int64', 'double'
  minimum?: number;
  maximum?: number;
}

/**
 * Gemini Boolean Schema properties
 */
interface IGeminiBooleanSchema extends IGeminiSchemaBase {
  type: 'boolean';
}

/**
 * Gemini Array Schema properties
 */
interface IGeminiArraySchema extends IGeminiSchemaBase {
  type: 'array';
  items: IGeminiJSONSchema;
  minItems?: number;
  maxItems?: number;
}

/**
 * Gemini Object Schema properties
 * Note: 'required' is optional in Gemini (not all fields need to be required)
 * propertyOrdering is Gemini-specific for controlling output order
 */
interface IGeminiObjectSchema extends IGeminiSchemaBase {
  type: 'object';
  properties: Record<string, IGeminiJSONSchema>;
  required?: string[]; // OPTIONAL in Gemini
  propertyOrdering?: string[]; // GEMINI-SPECIFIC: controls output order
}

/**
 * Complete Gemini JSON Schema interface
 */
export type IGeminiJSONSchema =
  | IGeminiStringSchema
  | IGeminiNumberSchema
  | IGeminiBooleanSchema
  | IGeminiArraySchema
  | IGeminiObjectSchema;

// ============================================================================
// Unified Configuration Interfaces
// ============================================================================

export interface StructuredOutputConfig {
  schema: IOpenAIJSONSchema | IGeminiJSONSchema;
  schemaName: string;
  schemaDescription?: string;
}

export interface StructuredOutputResponse<T = any> {
  data: T;
  rawResponse: unknown;
}

/**
 * Abstract base class for LLM chat clients with structured output support.
 * Both ChatGPT and Gemini implementations must extend this class.
 */
export abstract class LLMChatClient {
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Send a chat message with structured output requirement.
   *
   * @param messages - Array of conversation messages
   * @param config - Configuration including the JSON schema for structured output
   * @returns Promise resolving to the structured output matching the schema
   */
  abstract chatWithStructuredOutput<T = any>(
    messages: Message[],
    config: StructuredOutputConfig
  ): Promise<StructuredOutputResponse<T>>;
}
