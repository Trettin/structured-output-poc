import type { IOpenAIJSONSchema } from './LLMChatClient.js';

/**
 * CV/Resume schema for extracting structured information from resumes
 * Uses OpenAI JSON Schema format with strict mode requirements
 */
export const CVSchema: IOpenAIJSONSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    location: { type: 'string' },
    skills: {
      type: 'array',
      items: { type: 'string' },
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          period: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['title', 'company', 'period', 'description'],
        additionalProperties: false,
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          year: { type: 'string' },
        },
        required: ['degree', 'institution', 'year'],
        additionalProperties: false,
      },
    },
    yearsOfExperience: { type: 'number' },
  },
  required: ['name', 'email', 'phone', 'location', 'skills', 'experience', 'education', 'yearsOfExperience'],
  additionalProperties: false,
};

/**
 * TypeScript interface matching the CV schema
 */
export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface CV {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  yearsOfExperience: number;
}
