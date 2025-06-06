import { Configuration, OpenAIApi } from 'openai';
import { logger } from '../utils/logger';

// Initialize OpenAI API client
let openai: OpenAIApi | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(configuration);
    logger.info('OpenAI API initialized in aiService');
  } else {
    logger.warn('OpenAI API key not provided, using fallback mode in aiService');
    openai = null;
  }
} catch (error) {
  logger.error('Failed to initialize OpenAI API in aiService:', error);
  openai = null;
}

/**
 * Generate a structured completion using OpenAI API
 * 
 * This function sends a prompt to the OpenAI API and parses the response
 * into a structured object of type T.
 */
export async function generateStructuredCompletion<T>(
  prompt: string,
  model: string = 'gpt-4o',
  temperature: number = 0.7,
  maxTokens: number = 1000,
  systemPrompt?: string
): Promise<T> {
  try {
    if (!openai) {
      return generateFallbackStructuredCompletion<T>(prompt);
    }
    
    // Prepare system prompt
    const finalSystemPrompt = systemPrompt || 
      `You are an AI assistant that responds in JSON format. 
      Provide a well-structured response that can be parsed as JSON.
      Do not include any explanations or text outside of the JSON structure.`;
    
    // Generate completion
    const completion = await openai.createChatCompletion({
      model,
      messages: [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' }
    });
    
    // Extract and parse response
    const responseText = completion.data.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      logger.error('Failed to parse JSON response:', parseError);
      logger.debug('Response text:', responseText);
      
      // Attempt to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as T;
        } catch (extractError) {
          logger.error('Failed to extract and parse JSON:', extractError);
          throw new Error('Failed to parse structured response');
        }
      } else {
        throw new Error('Failed to parse structured response');
      }
    }
  } catch (error) {
    logger.error('Error generating structured completion:', error);
    return generateFallbackStructuredCompletion<T>(prompt);
  }
}

/**
 * Generate a fallback structured completion when OpenAI API is not available
 * 
 * This function provides a simple fallback mechanism for structured completions
 * when the OpenAI API is not available or fails.
 */
function generateFallbackStructuredCompletion<T>(prompt: string): T {
  logger.info('Using fallback structured completion');
  
  // Extract key terms from the prompt
  const terms = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(term => term.length > 3)
    .slice(0, 5);
  
  // Create a simple fallback response
  const fallbackResponse: any = {
    analysis: `I understand you're asking about ${terms.join(', ')}. I'm currently operating in fallback mode with limited capabilities.`,
    recommendations: [
      'Please try again later when the full system is available.',
      'Consider rephrasing your query for better results.',
      'Check your connection and try again.'
    ],
    success: false,
    fallbackMode: true
  };
  
  return fallbackResponse as T;
}

/**
 * Generate a text completion using OpenAI API
 * 
 * This function sends a prompt to the OpenAI API and returns the text response.
 */
export async function generateTextCompletion(
  prompt: string,
  model: string = 'gpt-4o',
  temperature: number = 0.7,
  maxTokens: number = 1000,
  systemPrompt?: string
): Promise<string> {
  try {
    if (!openai) {
      return `I understand you're asking about "${prompt}". I'm currently operating in fallback mode with limited capabilities. Please try again later when the full system is available.`;
    }
    
    // Prepare system prompt
    const finalSystemPrompt = systemPrompt || 
      'You are a helpful AI assistant that provides clear, concise, and accurate responses.';
    
    // Generate completion
    const completion = await openai.createChatCompletion({
      model,
      messages: [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens
    });
    
    // Extract response
    return completion.data.choices[0]?.message?.content || 
      'I apologize, but I was unable to generate a response.';
  } catch (error) {
    logger.error('Error generating text completion:', error);
    return `I apologize, but I encountered an error while processing your request. Please try again later.`;
  }
}