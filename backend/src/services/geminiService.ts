import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// 2. Add a check to see if it was loaded correctly. This is a best practice!
if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY environment variable not found.");
  console.error("Please check your .env file and ensure dotenv is configured correctly at the start of your application.");
  // Throw an error to stop the application from starting without a key
  throw new Error("GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your-api-key");

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "file" | "date";
  required: boolean;
  options?: string[]; // For select, radio fields
  placeholder?: string;
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export class GeminiFormService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
  }

  async generateFormSchema(prompt: string, title?: string): Promise<FormSchema> {
    const systemPrompt = `You are a form schema generator. Convert the user's natural language description into a structured JSON form schema.

IMPORTANT: Return ONLY valid JSON, no other text.

JSON Structure:
{
  "title": "Form Title",
  "description": "Optional form description",
  "fields": [
    {
      "name": "fieldName",
      "label": "Field Label",
      "type": "text|email|number|textarea|select|checkbox|radio|file|date",
      "required": true/false,
      "options": ["option1", "option2"] // only for select/radio types
    }
  ]
}

Field Types:
- "text": Short text input
- "email": Email input with validation
- "number": Numeric input
- "textarea": Long text input
- "select": Dropdown selection
- "checkbox": Multiple selection
- "radio": Single selection
- "file": File upload
- "date": Date picker

Examples:

User: "I need a contact form with name, email, message"
Output: {
  "title": "Contact Form",
  "description": "Get in touch with us",
  "fields": [
    { "name": "name", "label": "Full Name", "type": "text", "required": true },
    { "name": "email", "label": "Email Address", "type": "email", "required": true },
    { "name": "message", "label": "Your Message", "type": "textarea", "required": true }
  ]
}

User: "Create a survey with age, favorite color (dropdown), and newsletter subscription"
Output: {
  "title": "User Survey",
  "fields": [
    { "name": "age", "label": "Your Age", "type": "number", "required": false },
    { 
      "name": "favoriteColor", 
      "label": "Favorite Color", 
      "type": "select", 
      "required": false,
      "options": ["Red", "Blue", "Green", "Yellow", "Other"]
    },
    { 
      "name": "newsletter", 
      "label": "Subscribe to Newsletter", 
      "type": "checkbox", 
      "required": false 
    }
  ]
}

Now generate schema for: "${prompt}"`;

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response - remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      const schema: FormSchema = JSON.parse(cleanText);
      
      // Use provided title if available
      if (title) {
        schema.title = title;
      }
      
      return schema;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate form schema");
    }
  }
}

export const geminiFormService = new GeminiFormService();