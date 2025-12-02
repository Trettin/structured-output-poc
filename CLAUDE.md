# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Proof of Concept (POC) project comparing structured JSON output capabilities between:
- **OpenAI Structured Outputs** - JSON Schema with strict mode enforcement
- **Google Gemini Controlled Generation** - Response schema with high conformity

The project aims to evaluate which approach is better for extracting structured information from LLMs.

## Project Structure

- `ANSWERS.md` - Detailed comparative analysis answering 8 key evaluation questions (in Portuguese)
- `doubts.md` - Original evaluation questions to be answered
- `ai-docs/` - Reference documentation from OpenAI and Gemini APIs
- `.env.example` - Template for API keys

## Key Findings Summary

**OpenAI Structured Outputs:**
- 100% schema compliance guarantee with `strict: true`
- First request has latency (10-60s) due to schema processing, subsequent requests are cached
- Deterministic JSON output, no variations
- Full JSON Schema validation support (pattern, format, enum, etc.)

**Gemini Controlled Generation:**
- ~99% conformity (high but not 100% guaranteed)
- Implicit caching enabled by default (May 2025+)
- Near-deterministic but may have minor variations
- Limited support for complex schemas

**Both platforms:**
- Return exactly 1 JSON per API call
- No native support for alternative schemas at root level (use tool calling or separate calls)
- Support field descriptions in schemas
- High potential for data normalization and validation

## Development Setup

When implementing examples:

```bash
# Install dependencies
npm install

# Configure API keys
cp .env.example .env
# Edit .env with your actual keys

# Run examples
npm start
```

## Required API Keys

- `OPENAI_API_KEY` - For OpenAI GPT models
- `GOOGLE_AI_API_KEY` - For Google Gemini models

## Evaluation Criteria

The analysis focuses on:
1. Response time and caching behavior
2. Information extraction potential
3. Single vs multiple JSON outputs
4. Alternative schema support
5. Field metadata descriptions
6. Data normalization capabilities
7. Validation guarantees
8. Post-processing workflow

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
