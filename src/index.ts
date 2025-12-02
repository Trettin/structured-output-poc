import 'dotenv/config';
import { ChatGPTClient } from './ChatGPTClient.js';
import { GeminiClient } from './GeminiClient.js';
import { CVSchema, type CV } from './schemas.js';
import type { Message } from './LLMChatClient.js';

// Sample CV text to extract information from
const sampleCVText = `
JOHN DOE
Email: john.doe@email.com | Phone: +1-555-0100 | Location: San Francisco, CA

PROFESSIONAL SUMMARY
Senior Full Stack Developer with 8 years of experience building scalable web applications.
Expert in modern JavaScript frameworks and cloud technologies.

SKILLS
- Programming Languages: JavaScript, TypeScript, Python, Go
- Frontend: React, Next.js, Vue.js, TailwindCSS
- Backend: Node.js, Express, Django, FastAPI
- Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
- Databases: PostgreSQL, MongoDB, Redis

WORK EXPERIENCE

Senior Software Engineer | Google Inc. | 2020 - Present
- Led development of cloud-native microservices handling 10M+ daily requests
- Architected and implemented real-time data processing pipelines using Kafka
- Mentored team of 5 junior developers

Software Engineer | Facebook (Meta) | 2018 - 2020
- Developed React-based dashboard for internal analytics platform
- Improved application performance by 40% through code optimization
- Collaborated with cross-functional teams on product features

Full Stack Developer | Startup Inc. | 2016 - 2018
- Built RESTful APIs using Node.js and Express
- Implemented responsive UI components with React
- Deployed applications on AWS using Docker containers

EDUCATION

Master of Science in Computer Science | Stanford University | 2016
Focus: Distributed Systems and Machine Learning

Bachelor of Science in Computer Engineering | UC Berkeley | 2014
GPA: 3.8/4.0
`;

async function testChatGPT() {
  console.log('\n=== Testing OpenAI ChatGPT Structured Output ===\n');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY not found in environment variables');
    return;
  }

  const client = new ChatGPTClient(apiKey);

  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert at extracting structured information from resumes/CVs. Extract all relevant information and structure it according to the provided schema.',
    },
    {
      role: 'user',
      content: `Extract structured information from this CV:\n\n${sampleCVText}`,
    },
  ];

  try {
    const startTime = Date.now();
    const response = await client.chatWithStructuredOutput<CV>(messages, {
      schema: CVSchema,
      schemaName: 'cv_extraction',
      schemaDescription: 'Structured CV information extracted from resume text',
    });
    const elapsed = Date.now() - startTime;

    console.log('Extracted CV Data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log(`\nResponse time: ${elapsed}ms`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testGemini() {
  console.log('\n=== Testing Google Gemini Structured Output ===\n');

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_AI_API_KEY not found in environment variables');
    return;
  }

  const client = new GeminiClient(apiKey);

  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert at extracting structured information from resumes/CVs. Extract all relevant information and structure it according to the provided schema.',
    },
    {
      role: 'user',
      content: `Extract structured information from this CV:\n\n${sampleCVText}`,
    },
  ];

  try {
    const startTime = Date.now();
    const response = await client.chatWithStructuredOutput<CV>(messages, {
      schema: CVSchema,
      schemaName: 'cv_extraction',
      schemaDescription: 'Structured CV information extracted from resume text',
    });
    const elapsed = Date.now() - startTime;

    console.log('Extracted CV Data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log(`\nResponse time: ${elapsed}ms`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  console.log('POC: Structured Output Comparison - OpenAI vs Gemini\n');

  // Test both implementations
  await testChatGPT();
  await testGemini();

  console.log('\n=== Test Complete ===\n');
}

main().catch(console.error);
