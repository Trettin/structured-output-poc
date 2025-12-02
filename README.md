# POC: Structured Output Comparison - OpenAI vs Gemini

Proof of Concept demonstrating structured JSON output using OpenAI GPT and Google Gemini APIs in Node.js with TypeScript.

## Overview

This project implements an abstract `LLMChatClient` class with two concrete implementations:
- **ChatGPTClient** - Uses OpenAI's Structured Outputs with 100% schema compliance
- **GeminiClient** - Uses Google Gemini's Controlled Generation with ~99% schema conformity

Both implementations support structured output using JSON Schema, providing a unified interface for extracting structured data from LLMs.

## Features

- ✅ Abstract base class for LLM clients with structured output support
- ✅ Type-safe implementation using TypeScript
- ✅ OpenAI Structured Outputs integration (strict mode)
- ✅ Google Gemini Controlled Generation integration
- ✅ Unified message interface for both providers
- ✅ Example usage demonstrating CV/resume extraction

## Project Structure

```
poc-structured-output/
├── src/
│   ├── LLMChatClient.ts       # Abstract base class & schema interfaces
│   ├── ChatGPTClient.ts       # OpenAI implementation
│   ├── GeminiClient.ts        # Gemini implementation
│   ├── schemas.ts             # JSON Schema definitions & TypeScript interfaces
│   └── index.ts               # Example usage
├── ai-docs/                   # API documentation
├── .env.example               # Environment variables template
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js 18+
- OpenAI API key
- Google AI API key

## Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## Usage

### Build the project:
```bash
npm run build
```

### Run the example:
```bash
npm start
```

### Development mode (with tsx):
```bash
npm run dev
```

## Example Code

```typescript
import { ChatGPTClient } from './ChatGPTClient.js';
import { GeminiClient } from './GeminiClient.js';
import { CVSchema, type CV } from './schemas.js';
import type { IOpenAIJSONSchema } from './LLMChatClient.js';

// Define a JSON Schema (or import from schemas.ts)
const PersonSchema: IOpenAIJSONSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    age: { type: 'number' },
  },
  required: ['name', 'email', 'age'],
  additionalProperties: false,
};

// Use ChatGPT
const chatGPT = new ChatGPTClient(process.env.OPENAI_API_KEY!);
const result1 = await chatGPT.chatWithStructuredOutput<CV>(
  [
    { role: 'system', content: 'You are an expert at extracting structured information.' },
    { role: 'user', content: 'Extract info from this CV: John Doe, john@email.com, 5 years experience...' },
  ],
  {
    schema: CVSchema,
    schemaName: 'cv_extraction',
  }
);

// Use Gemini
const gemini = new GeminiClient(process.env.GOOGLE_AI_API_KEY!);
const result2 = await gemini.chatWithStructuredOutput<CV>(
  [
    { role: 'system', content: 'You are an expert at extracting structured information.' },
    { role: 'user', content: 'Extract info from this CV: John Doe, john@email.com, 5 years experience...' },
  ],
  {
    schema: CVSchema,
    schemaName: 'cv_extraction',
  }
);

console.log(result1.data); // Typed as CV
console.log(result2.data); // Typed as CV
```

## API Reference

### LLMChatClient (Abstract)

Base class for all LLM client implementations.

#### Methods

- **`chatWithStructuredOutput<T>(messages, config)`**
  - `messages`: Array of `Message` objects with `role` and `content`
  - `config`: `StructuredOutputConfig` containing:
    - `schema`: JSON Schema defining the expected output structure
    - `schemaName`: Name for the schema
    - `schemaDescription`: (Optional) Description of the schema
  - Returns: `Promise<StructuredOutputResponse<T>>` with:
    - `data`: Parsed output matching the schema
    - `rawResponse`: Original API response

### ChatGPTClient

OpenAI implementation with 100% schema compliance.

```typescript
const client = new ChatGPTClient(apiKey, model = 'gpt-4o-2024-08-06');
```

### GeminiClient

Google Gemini implementation with ~99% schema conformity.

```typescript
const client = new GeminiClient(apiKey, modelName = 'gemini-2.0-flash-exp');
```

## Key Findings

### OpenAI Structured Outputs
- ✅ 100% schema compliance with `strict: true`
- ⚠️ First request has latency (10-60s) due to schema processing
- ✅ Subsequent requests are cached and fast
- ✅ Full JSON Schema validation support
- ✅ Deterministic output, no variations

### Gemini Controlled Generation
- ✅ ~99% conformity (high but not 100% guaranteed)
- ✅ Implicit caching enabled by default (May 2025+)
- ✅ Fast response times
- ⚠️ Limited support for complex schemas
- ⚠️ Near-deterministic but may have minor variations

### Both Platforms
- Return exactly 1 JSON per API call
- No native support for alternative schemas at root level
- Support field descriptions in schemas
- High potential for data normalization and validation

## Supported Models

- **OpenAI**: `gpt-4o-2024-08-06` and later
- **Gemini**: `gemini-2.0-flash-exp`, `gemini-2.5-flash`, and others

## Documentation

For detailed API documentation, see:
- [OpenAI Structured Outputs](./ai-docs/openai-structured-outputs-docs.md)
- [Gemini Structured Output](./ai-docs/gemini-structured-output-docs.md)
- [Comparative Analysis](./ANSWERS.md) (in Portuguese)

## Recommendations

**Use OpenAI when:**
- 100% schema conformity is required
- Complex schemas are needed
- No tolerance for output variations
- Critical system integration

**Use Gemini when:**
- ~99% conformity is sufficient
- Automatic implicit caching is desired
- Working with simpler schemas
- Cost optimization is important (75% cache discount)

## Contributing

This is a POC project for evaluation purposes. Feel free to extend it with:
- More complex schema examples
- Additional LLM providers
- Performance benchmarking
- Error handling improvements

## License

ISC
